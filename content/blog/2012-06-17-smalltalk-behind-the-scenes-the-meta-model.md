---
external: false
draft: false
title: 'Smalltalk behind the scenes: the meta model'
description: This post is a draft and won't be built.
date: 2012-06-17
---

**Have you ever evaluated this pieces of code in Pharo?**

```smalltalk
ProtoObject superclass.
ProtoObject class superclass.
Metaclass class class = Metaclass.
```
Wait, WTF? How is that ProtoObject superclass is nil? Wait again, and the one of it's superclass is Class? Metaclass class is an instance of Metaclass? Hey, that's kind of the chiken and the egg problem, which one was first?

You know that when you create a class, you specify a superclass for it. This superclass will specify some other properties and the VM will use it to perform the method lookup.

Also, probably you already know that when a class is created in Smalltalk, a metaclass is created for it implicitly. That metaclass describes the class side behavior: class side methods, class instance variables...

Funny thing about this implicit metamodel, is that a second class hierarchy is built in parallel to the original class hierarchy.

![](http://playingwithobjects.files.wordpress.com/2012/06/meta-hierarchy.png)

Now, if you think about this, you can understand why the method lookup works also in the class side methods, and they are not static like in Java or C# :).
You can have a look at the following invariants:

```smalltalk
aClass superclass class = aClass class superclass.
aClass class class = Metaclass.
```

Which of course have it's exceptions. The method lookup ends when it reaches a class whose superclass is nil. And the class side objects also behave like a Class, because they finally inherit from Class. HA! But then the metaclass hierarchy re-enters the non-metaclass hierarchy. Thinking of this in an operational way is kind of meta confusing, isn't it?

But this is not the motivation of this post. The motivation is this: Are we really coupled to that meta model? How can I create my own?

If you remember from my post on [vm limitations I learned during the bootstap](2012-06-11-the-bootstrap-chronicles-chapter-2-do-not-mess-with-the-vm) vm limitations I learned during the bootstap</a>, the vm only expects 3 things from a class:

- that it's first instance variable is it's superclass.
- that it's second instance variable is it's method dictionary.
- that it's third instance variable is it's format.

Any object respecting that contract can be treated like a class by the VM. Then you can think on creating your own metaclass loop, kind of independent from the original one...

```smalltalk
classFormat := ...
metaclassFormat := ...

"This metaclass defines how our metaclass instances will be. It is only here to define the first metaclass format, and it will be discarded"
metaclassClass := Metaclass new.
metaclassClass
superclass: Class
methodDictionary: (MethodDictionary new)
	format: classFormat.

metaclass := metaclassClass basicNew.
metaclass instVarAt: 1 put: Metaclass.
metaclass instVarAt: 2 put: MethodDictionary new.
metaclass instVarAt: 3 put: metaclassFormat.

metaclassClass := metaclass basicNew.
metaclassClass instVarAt: 1 put: Metaclass class.
metaclassClass instVarAt: 2 put: MethodDictionary new.
metaclassClass instVarAt: 3 put: classFormat.

metaclassClass adoptInstance: metaclass.
```

Once you have a metaclass, instantiate it to create your class, and instanciate it to create your little object! That's crafting Smalltalk using Smalltalk. Well, that is bootstrapping the meta model :).
The only ugly thing is that in order to create a new meta model with different instance variables, you have to create a transient class in the middle, because the VM does not like to have objects with a format X, whose class defines a format Y... So the hack just solves the format problem :).

Now you can think about simpler stuff like a class instance of itself, subclass of nil. Or more complex one :).

You can change it, I told you. Now it's up to you how to use it...
