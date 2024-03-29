---
external: false
draft: false
title: The Bootstrap Chronicles Chapter 2 - Don't mess with the VM
description: This post is a draft and won't be built.
date: 2012-06-11
---

> Everything you want in life has a price connected to it. There’s a price to pay if you want to make things better, a price to pay just for leaving things as they are, a price for everything. -- **Harry Browne**
And I found myself trying to bootstrap for real. But of course it was not going to be easy. I had to pay the Iron price.

The VM we use plays a very important role in the day to day development. It is the one in charge of defining the method lookup, garbage collection, some platform dependent code, some optimizations. And as it does some nice things for us, it also puts restrictions on what we do. Have you ever heard about the special objects array? The compact classes array? Primitives? We are going to talk a bit about them and other secrets, and how they bother in the bootstrap process :).

## The Special Objects Array
The special objects array is an array shared between the VM and the image. This array points to some objects that are important or interesting to the VM, you can have a look at it inspecting the following expression in Pharo:

```smalltalk
Smalltalk specialObjectsArray
```

If you have an overview, you will see some things like the Processor instance, the Array, Smalltalk, SmallInteger, Float, Compiled method, Semaphore classes, some Semaphore instances...

What does the vm do with them? It for example introduces hard validations against concrete classes -yeap, like checking if an instance's class is the same as the object in it's slot 20, which BTW is Character...

Ok...

Doing those validations through messages could be too expensive in terms of speed. If you want to be fast, you have to pay some price. If you want to have a tiny mermory footprint, you have to pay some price. There are side effects for decisions in general...

So, some may wonder, Why is this array so important for the bootstrap? Imagine I want to have a new Array class, Class class, Character class, and a new CompiledMethod class. What should happen if the VM does not recognize them as I would like? CogVM only recognizes one special objects array.

The solution? Hack and cheat. You choose, you can cheat on the VM side, or in the image side. Each has a price to pay. But today is not the day for telling you how I cheated :).

Now, look at the field 29 of the special objects array. It is another array, ...

## The Compact Classes Array

U remember about compact objects? If not, you can refresh in here: [Understanding Object Formats in CogVM](2012-05-30-understanding-object-formats-in-cogvm)

In two words, compact objects do not have an extra header for the class pointer: they have some bits in it's base header which is an index into this nice compact classes array, where it's class is. This mechanism is normally used for classes with tons of instances, saving 1 header for each object. Complexity against space.

Here again, we have the same problem. Even worse, having this guy here means that if I have my nice Array' class, which is also compact, and it's compact class index points to the original Array class, the method lookup will end up in the original class instead of mines :(.

The solution? Hack, and cheat.

## The Primitives

Now think what happens when my bootstrap classes use primitives methods. It's nice because the vm returns me the objects it wants :). It's actually a sinptom of the last two points. But it is good to know that primitives can give you headaches...

## Other problems? Of course...

**Literals:** I can't change so easily SmallInteger's class because it is an inmediate object for example. The same happens with the other numbers, or strings, or blocks. They all give you headaches. Even if I could make it work with the VM, I should change the compiler to use a different set of classes...

**Vm magic assumptions:** Like class instances' first three instance variables are superclass, method dictionary and format. In that order. Try changing the order :). Or doing something like:

```smalltalk
myA := A new.
A become: 'hello'.
myA crashTheVM.
```

And there are some other like this. So far I know LinkedList, ProcessScheduler, and Class. Find your own Waldo!

You already know what the solution is, do you?

## HACK AND CHEAT
Yeah, this is what the bootstrap is really about. And learning hardcore stuff too :). Of course I can't tell you every detail because this post will be larger than anyone would care to read.

So, I'll keep you updated, I have now to continue paying the iron price.

$33 ¥0µ £473r!

9µ1££3
