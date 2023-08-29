---
external: false
draft: false
title: Bootstrap revival - the basics
description: This post is a draft and won't be built.
date: 2013-05-06
---

In the last time I was working on the system bootstrap again, trying to enhance the process, lower the imposed limitations... And I have a pretty new version. I'll present here a summary of what I've learnt in the last time:

- A review on the process steps, with exemplar code snippets
- Some of the new key ideas and new infrastructure
- And improvements over the last version :)


## What are we going to bootstrap
For the sake of simplicity, we will not bootstrap a full Pharo (because that would include preparing for example Morphic to be bootstrapped, or to be loaded/unloaded). Instead, we will bootstrap an adapted version of MicroSqueak from John Maloney, which we re-baptized as [Pharo Candle](https://github.com/guillep/PharoCandle/tree/master/source/). Pharo Candle has only 50 classes, as you can see in the Github repo, and limited features. All classes from Pharo Candle has a PC prefix, which is not important for the bootstrap, since it will not let be name collisions.

To understand the rest of the post, the following is important: we will take a textual and static definition of the system (methods, classes...), and load it into our image. For that we will parse the files and include them as definition objects. These definition objects will ease the access to the data needed instead of accessing lots of lookup and symbol tables and stuff in a procedural way...

## Some infrastructure basics
The last bootstrap implementation was very coupled to Pharo and its internal implementation. To create objects, to initialize classes, we relied on the existing system, on sending messages, on the VirtualMachine interpreter and infrastructure. So the first step for this new version was to decouple that. Decoupling the existing system from the new system that is about to be created. To do that we encapsulate the state of the new system inside an object, which we call an **object space**.

An object space reifies the new system. It is an object that understand messages such as "create an object", "translate this string to a string of the new system", "register this object as a class in yourself" or even "execute this piece of code". This object space lets us structure the creation of the new system in a more comfortable way.

Our next concern, is not installing objects from the existing system into the new system. We want the new system to be transitively closed. So, the best is not to have direct references from the existing system to the new one. The best is to control those references carefully. Then, every time an object space gives you a reference to one of his objects, he really gives you a proxy. That proxy allows you to manipulate, at some level, the object inside the object space. A proxy can give and revoke permissions on the inner object, and make transformations or validations when necessary to keep the model consistent. Since these proxys may perform meta-operations on the new system objects, we end up calling them mirrors at some point.

Finally there are [VirtualMachine limitations](2012-06-11-the-bootstrap-chronicles-chapter-2-do-not-mess-with-the-vm) when executing code on the new space. We introduced a new piece in the puzzle to overcome them: our own language-level interpreter. In this particular case, we are using an AST interpreter, but we could, if available, use any other kind of interpreter. The important thing about using our own interpreter is controlling the semantics of the new system, and leverage the VM's limitations.
## Where do we start?
When the bootstrap starts, there is nothing. There are no objects, no structures, nothing. So we have to build everything from the start. And the question is... where do we start?

Our system is composed by objects, and thus, we need to create objects. And every new object may have pointers, which are initially pointing to **nil**. But what if there is no **nil** in our system? So, let's build a first **nil**, so all objects created later can point to this **nil** object.
## Creating the first object
As we decided before, we create our first **nil** object. However, there is a question that arises when we try to create nil. How can we create an object without a class? The answer is, so far, that until we have classes we will create objects without classes. We will not care about their classes and we will solve that later, once classes are created. Fortunately, this problem is present with very few objects.

```smalltalk
theNil := objectSpace 
    createObjectWithFormat: undefinedObjectDefinition nilFormat.
```

Since we have no class to create nil, we have to specify the format of this object. That is, the amount of memory to be allocated for it, the amount of slots, and if they are pointers or bytes or what. The format is known by the definition of undefined object. 

Fortunately, nil has no pointers to other objects, except for his class, simplifying the process. We will set nil's class once we create it later.
## We create the classes
Creating a class is a complex operation. A class has a metaclass. And it has a name which is a symbol (unique in the system). And it has a superclass, which may have not been created yet. And it has a dictionary of class variables. And... a lot of stuff.

Our objective is to keep this bootstrap the simplest. And for that, we will delay all the complex operations to the moment when they are not so complex. In this step we create empty classes. We only initialize their format with a SmallInteger, and we let the rest of their pointers pointing to nil.

The first step for creating a class, is to create its metaclass. And to create a metaclass, we need the class Metaclass. This Metaclass, in a ST-80 like model, follows the Metaclass<->Metaclass class loop. *That is, Metaclass is an instance of Metaclass class, and Metaclass class is an instance of Metaclass, as shown in blue in the following figure.*

![](http://playingwithobjects.files.wordpress.com/2013/05/smalltalkmetaclasses.png)

We create the first Metaclass and Metaclass class as objects without class, and then we make each one an instance of the other.

```smalltalk
metaclassMirror := objectSpace
    createClassWithFormat: classFormat
    forInstancesOfFormat: metaclassFormat.
metaclassClassMirror := objectSpace
    createClassWithFormat: metaclassFormat
    forInstancesOfFormat: classFormat.

metaclassMirror 		setClass: metaclassClassMirror.
metaclassClassMirror 	setClass: metaclassMirror.
```

Once we have the first metaclass, we can create all the classes.

```smalltalk
self behaviorDefinitions do: [ :aClassDefinition |
	| newClass newClassMetaclassMirror theMetaclassMirror |
	theMetaclassMirror := objectSpace classNamed: #PCMetaclass.
	newMetaclassMirror := theMetaclassMirror basicNew asClassMirror.
	newMetaclassMirror format: aClassDefinition classSide format.

	newClass := newClassMetaclassMirror basicNew asClassMirror.
	newClass format: aClassDefinition format.
	]
]
```

At this point, the classes only have set their format, and their class. All other slots have pointers to the nil object we created at the beginning.
## Fix nil, create true and false!
Now we created all the classes, even if they are empty, we can fix the "classless" **nil** and create our **true** and **false** objects.

```smalltalk
theNil setClass: (objectSpace classNamed: #PCUndefinedObject).
theTrue := (objectSpace classNamed: #PCTrue) basicNew.
theFalse := (objectSpace classNamed: #PCFalse) basicNew.
```
## Initialize the classes state
Now we have all classes created, and the three basic objects we need (nil, true and false). So now we can start initializing all our classes. This initialization consists for each class in:

- Set the superclass of the class. The root of the hierarchy should be nil.
```smalltalk
classDefinition superclass isEndOfHierarchy ifFalse: [
    superclassMirror := objectSpace
        classNamed: classDefinition superclass name.
] ifTrue: [
    superclassMirror := objectSpace nilObject.
].
classMirror superclass:superclassMirror.
```
- Set the class name
```smalltalk
classMirror className: classDefinition name.
```
- Set the collection of instance variables of the class
```smalltalk
classMirror instanceVariables: classDefinition instanceVariables.
```
- Set the superclass of the metaclass. The root of the hierarchy should be PCClass.
```smalltalk
metaclassMirror := classMirror classSide.
classDefinition superclass isEndOfHierarchy ifFalse: [
    metaclassMirror superclass: superclassMirror classSide.
] ifTrue: [
    metaclassMirror superclass: (objectSpace classNamed: #PCClass).
].
```
- Set the instance side relationship of the metaclass
```smalltalk
metaclassMirror := classMirror classSide.
metaclassMirror
    instanceSideClass: classMirror.
```
- Set the collection of instance variables of the metaclass
```smalltalk
metaclassMirror := classMirror classSide.
metaclassMirror
    instanceVariables: classDefinition classSide instanceVariables.
```



After this initial initialization is performed for every class, we finish by initializing the class variables. Class variables are represented by a Dictionary object. A dictionary object is an object with a complex structure, and the way to manipulate it depends on the nature of the system we are bootstrapping. The solution, so far, is to delegate the initialization of the dictionary to the dictionary itself. 

For that we use a combination of the code of the dictionary and an AST interpreter. An AST interpreter needs to be initialized before its usage so later, all class variables can be initialized. As you can see in the code below, the AST interpreter usage is hidden inside the mirror implementation :).

```smalltalk
objectSpace initializeInterpreterForCodeProvider: self kernelSpec.
self behaviorDefinitions do: [ :classDefinition |
    | classMirror |
    classMirror := objectSpace
        classNamed: classDefinition name.
    classMirror
        classVariables: classDefinition classVariables.
].
```

## Install methods
Now we have all classes of the new system created and initialized. We can start installing all their methods. Before, we should declare all global variables of the system, so the compiler knows how to bind them correctly. After that, we take the source code of all methods from the system description and compile them. The compilation gives us as result the bytecode of the method + the literals. This method is then translated to a method in the new world, and installed into the new system.

The globals initialization looks like:

```smalltalk
objectSpace environment
            addGlobal: #Processor
            pointingTo: objectSpace nilObject.
```

Then, for each class, we have the following code to create and install the methods:

```smalltalk
"build the methods as instances of this system"
newMethods := aMethodBuilder
    methodsForBehavior: mirror
    fromDefinition: aBehaviorDefinition.

"create a method dictionary of the new system"
newMethodDict := objectSpace createMethodDictionary: newMethods size.
newMethods do: [ :m |
    "install a method from this system to the other"
    "the translation to a method to the other side is made inside"
    newMethodDict installMethod: m
].
"we set the method dictionary to our class"
mirror methodDictionary: newMethodDict.
```
## Initialize the system state
Finally, we initialize the system state, with the aid of the AST interpreter. This last step consists mainly in:

- execute the initialize class side methods
- set up the process scheduler of the system and install its processes

```smalltalk
objectSpace interpreter evaluateCode: 'PCCharacter initialize'.
objectSpace interpreter evaluateCode: 'PCString initialize'.
objectSpace interpreter evaluateCode: 'PCFloat initialize'.

objectSpace interpreter evaluateCode: '
    Processor := PCProcessorScheduler basicNew.
    Processor initProcessLists.'.

process := objectSpace
        createProcessWithPriority: 3
        doing: 'PCSystem start'.
objectSpace installAsActiveProcess: process.
```

## Conclusion
Bootstrap: achieved.

With our new pieces into the game, we were able to overcome the virtual machine limitations, and have a in-image full bootstrap. The next steps go in the way to:

- serialize this object graph into an image file, so it becomes autonomous
- test the bootstrapped system while still living along with the original system, without serializing it. I mean, run it into the same VM without AST interpreter.


I hope I explained myself well.
Arrivederci!!
Guille
