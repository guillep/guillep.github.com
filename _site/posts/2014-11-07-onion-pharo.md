---
layout: post
title: Onion Pharo
categories:
- Pharo
tags:
- bash
summary: In the journey to take the bootstrap to production, we started chasing with JB the Pharo Kernel. Yeah, like the grail but shinier :). what is the minimal pharo and how do we get there?
status: publish
type: post
published: true
---

In the journey to take the bootstrap to production, we started chasing with JB the Pharo Kernel. Yeah, like the grail but shinier :). what is the minimal pharo and how do we get there?

About onion Pharo. Or Pharo in Layers. Or Modular Pharo...
----------------

Discussing with JB about what should be a minimal Pharo, we got an even better question: What should a minimal Pharo do? Simple thing: if we know what it should do, we can know what to put inside it. The answer was, however, easy to find. We need the minimal Pharo to be able to **load code**.

There are many ways of being able to load code:
- we can use Fuel to deserialize classes and methods (a.k.a. Tanker)
- we can use a Compiler+ClassBuilder+SomeKindOfIO combination

So as a first approach, we decided to go for the second one, as the compiler and class builder are in a better shape than Tanker.

However, this loading code thingy is not as easy as it looks like. The compiler, the class builder, have many many dependencies. Without taking them into account, Pharo's Kernel package has many dependencies on its own. And circular ones. So arriving there looks like a gigantic task. We need to control the pain. So let's split the problem again.

What do we need in order to be able to load code? Well, we need to load a class! Of course (yes, we say plenty of obvious things here) we managed to do that before with the bootstrap. However, the bootstrap for Pharo2.0 had to bootstrap classes without Slots nor layouts. Now, when thinking about Pharo3/4, we have to put those into place too! And well, you know, the layout logic is a bit more complex that we liked to actually put it inside the bootstrap process. So... wait! the layout logic is already present in the class builder!

What do we need in order to be able to load a class? We need to be able to run **the class builder** in an empty image! Easy huh? Almost. The question know transformed itself into: What do we need to run the class builder?

So like that we kind of layered Pharo into the following:

1. Phase zero: The objects needed to run the class builder
2. Phase one: The objects from our *loading strategy* (the class builder and the compiler here)
3. Phase two: whatever package you want in your image, as a user

Now that we know what to look for, let's search!

Our Crazy little list 
----------------

So our first approach is to make phase zero work, getting the class builder work. The complex thing at this point, is that that class builder depends on several parts of the system to be initialized before him: it does not require only the existance of some classes, but also that they ensure some initial state. After some iterations we arrived to this little script that initializes in an empty system all we need to run a pharo's class builder:

{% highlight smalltalk %}
HashTableSizes initialize.
		
DangerousClassNotifier disable
Undeclared := Dictionary new.
Smalltalk := SmalltalkImage basicNew.
Smalltalk instVarAt: 1 put: (SystemDictionary withOrganizer: SystemOrganizer new).
Smalltalk at: #Smalltalk put: Smalltalk.
Smalltalk at: #Undeclared put: Undeclared.

	
SmalltalkImage initialize.
Character initialize.
String initialize.
DateAndTime initialize.
ChronologyConstants initialize.
Symbol initialize.
{% endhighlight %}

Ok, to tell the thruth this script is a bit simplified to show you some core ideas. First, as you can see, the class builder does, directly or not, depend on some strange stuff that we couldn't have thought at first: DateAndTime? ChronologyConstants? SmalltalkImage? Second, and to add even more complexity, the order of this script is important. Briefly, this script shows a lot of untangled dependencies, and we are not even in phase zero! For the impatient reader, we know this script is not nice: we are working on enhancing, simplifying, and automatizing it for your happiness.

Now, if we execute this script and trace the executed code, we get the real pre-requisites of a class builder. The list of classes and methods that are needed before even start thinking about it.

- UndefinedObject
- Array
- False
- True
- ProtoObject
- Association
- SmallInteger
- Character
- Categorizer
- DateAndTime
- LargePositiveInteger
- ChronologyConstants
- Time
- Object
- TComposingDescription 
- ClassTrait 
- Trait 
- TraitComposition

- String
- Symbol
- OrderedCollection
- Interval
- ByteArray
- WeakSet
- WeakArray

- SmalltalkImage
- SystemDictionary
- SystemOrganizer
- ByteSymbol
- ByteString
- HashTableSizes
- DangerousClassNotifier
- Dictionary

And then, if we run the class builder in several scenarios, we get the list of classes that it uses during runtime:

- EmptyLayout
- Class
- FixedLayout
- LayoutEmptyScope
- LayoutClassScope
- Slot
- SmallIntegerLayout
- ByteLayout
- WordLayout
- VariableLayout
- OldClassBuilderAdapter
- PharoClassInstaller
- SlotClassBuilder
- MethodRecompileStrategy
- Error
- ReadStream
- WriteStream
- MethodDictionary
- IdentitySet
- SystemAnnouncer
- SubscriptionRegistry
- Semaphore
- CategoryAdded
- TimeZone
- Duration
- Announcer
- CompiledMethod
- TSortable
- ClassAdded

That's a good start! We have a bunch of classes that should be the minimal Phase Zero Pharo Kernel!

Reinjecting in the system
----------------

So now that we have that list of classes... what? We can start doing a lot of stuff!! But my first attempt is to reinject this knowledge inside the system itself. Just by looking at the kernel package, we can do arrive to the following conclusions:

- The Job classes are not actually needed in the kernel, they should be moved to another package
- The kernel has some code for fileIn/fileOut. That should be a tool built on top of the kernel!
- Context inherits from InstructionStream, which is a debugger-related class (and btw, a giant one)...
- NumberParser and DeepCopier in kernel?
- Wowo, we have a Message class and a MessageSend class... Maybe we should think about merging them into one!
- Pragmas are kernel stuff (once we reach the compilation stage, believe me :))... But the pragma collector, and it's related announcements are not
- We have all the code for the InputEventSensor and family there...
- WeakActionSequence, WeakMessageSend and the DependentsArray look outplaced

So, we have work to do, I cannot continue writing this when there are so many refactorings to do.
We will keep you posted,
Guille