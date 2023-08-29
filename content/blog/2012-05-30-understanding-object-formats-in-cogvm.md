---
external: false
draft: false
title: Understanding Object Formats in CogVM
description: This post is a draft and won't be built.
date: 2012-05-30
---

When we do Smalltalk code, we are very happy and proud to say that mostly everything is an object and that they communicate through messages. There are no method invocations, nor direct inst var access.There are no primitive types such as **int** or **float**!


But sometimes, when we go a little deep digging to do some creepy but necessary stuff, we see the dark side. This post is about how our nice Smalltalk objects are seen by our VM, and a little of code to understand it. At the end of the post I present a little project which aims to reify the object vm formats. So, if you want to learn through reading code and maybe contribute, you can skip all this :).

Also, this post talks about 32bit CogVM. All this may change in 64bit VMs.
# Object Format
An object is commonly known to have behavior+data. In Smalltalk the data in encapsulated and the only way to access it is through it's object behavior. Today is data's day.

In plain memory an object is built from:

- It's header/s
- It's fixed fields (a.k.a. instance variables)
- It's indexable fields

## Fields
An object's data is stored in fields in the object. The interesting thing is that the VM uses different kind of fields for different objects, and some times it perform optimizations making us to live in a happier object world.

From the VM side point of view, an object is just a series of fields plus it's header with meta information. Every object may have some fixed size of fields, given by it's instance variables, an some variable amount of indexed fields commonly used for collection-like objects. These fields may contain data interpreted in several ways:

- Object pointers: Simply the address of the object the field is pointing at.
- Immediate SmallIntegers: SmallIntegers are encoded in object fields to save space. But in the Smalltalk side, they are still objects :).
- Just bits: used just to encode some data. Classes with this kind of fields are Floats, ByteStrings, ByteArrays... Also, this can be presented in bytes or words.

To know which kind of fields an object will have, we have to take a look at it's class format. 
[Mariano](http://marianopeck.wordpress.com) already wrote a post on Class formats
([http://marianopeck.wordpress.com/2011/05/07/class-formats-and-compiledmethod-uniqueness/](http://marianopeck.wordpress.com/2011/05/07/class-formats-and-compiledmethod-uniqueness/)) so I'll not write everything again. But to understand the rest of the post, here comes a little classification:

- normal: it's fields are the instance variables, therefore fixed and containing pointers to other objects.
- bytes: it's a variable amount of fields, 1 byte long each. Contains bits, not pointers.
- words: it's a variable amount of fields, 1 word long each. Contains bits, not pointers.
- weak: it's indexed fields might be garbage collected.
- variable: indicates when an object contains a variable set of fields in addition to it's instance variables.
- compiled method: just a special format for the VM. They are special objects with bit fields sometimes encoding object pointers.

When an object is created, it will have as many fixed fields as it's class instance variable defines for it. These fixed fields are pointers to other objects. If it's class is variable, we have also to tell it how many indexed fields we want for that object. That is the case of for example:

```smalltalk
Array new: 50.
```

Now, depending on the class format, those fields can be 1 byte or 1 word long. And it's content may be interpreted as object pointers or simple byte data. To be careful: the minimum amount of memory to be taken is one word<em>. Having this into account, remember to pad an object's size to be divisible by the word size when calculating it's real size in memory/disk ;).</em>

If you want to ask about this data to an object:

```smalltalk
anObject class instSize. &quot;answers the number of instance variables&quot;
anObject basicSize. &quot;answer the number of indexable fields&quot;

anObject class isBits.
anObject class isBytes.
anObject class isWords.
anObject class isWeak.
anObject class isPointers.
anObject class isVariable.
```
## The Object Header
An object always has a header which may be one, two, or three words long. But we will refer them as three different headers. So I'll rephrase it as "An object may have one, two or three headers, 1 word long each". These three headers are the base header, the class header and the length header.
### The Base Header
This is the normal header. Almost every object has one of these. It encodes some useful information of the object and it's class. This way it can avoid to fetch the class for some operations. Base header is a sum of bits with the following information:

![Base header format](http://playingwithobjects.files.wordpress.com/2012/05/format-jpg.png)

- The GC bits are three bits for making objects as old, dirty...
- The hash bits are 12 bits encoding the identity hash in the object. Maybe not enough, but there is no much more space available :).
- The compact index bits represent the index of the class of the object in the <em>compact classes array</em> (will talk about it later) or 0 if it is not there.
- The inst spec are 4 bits telling when the class is bits, bytes, variable... It tells us the format of the class and how it's instances fields behave.
- The size field is the amount of words the object occupies, which is the amount of fields (fixed and indexed) + 1 (for the base header). In case this object is long, this field contains just 0.
- The type bits encode whenever this object has one, two or three headers.

### The Class Header
This header contains a pointer to the class of the object + the type which encodes if this object has one, two or three headers.
### The Length Header
When we have large objects and it's size cannot be encoded in the size field of the base header, we use this special header to store the size. It stores the length + the type encoding if this object has one, two or three headers.
### When Which Header?

- Normal objects use class header + base header, in that order. These objects have a 0 in their type headers fields.
- Large objects, the ones with more than 63 words in its body, have the three headers: lenght header + class header + base header, in that order. These objects have a 0 in the type fields of its headers.
- Compact objects use only the base header. This is mainly an space optimization for broadly used objects such as CompiledMethods, Arrays... Compact objects are the ones whose class is in the compact classes array of the VM. To fetch it's class, the VM uses the index in the base header to access the class in the array. These ones have a 3 as the type in its headers.

If you want to have a look at the compact classes array, you may inspect in a workspace:

```smalltalk
Smalltalk compactClassesArray
```
# Exceptional Cases
## Compiled Methods
A compiled method is a variable byte object, which is supposed to contain bytecode. Now, they are implemented some extensions to encode object pointers into these byte fields. This way, a compiled method can point to it's set of literals (the literals used in it) and to it's class so it can resolve super sends.

To make this work, the GC was modified to take into account this special property of CompiledMethods while traversing the object memory.
## Contexts
When looking at context object's fields, they behave a little differently. As it is written in Pharo MethodContext's class comment:
> MethodContexts, though normal in their variable size, are actually only used in two sizes, small and large, which are determined by the temporary space required by the method being executed.
```smalltalk
CompiledMetho>>frameSize
    (self header noMask: 16r20000)
        ifTrue:  [^ SmallFrame]
        ifFalse: [^ LargeFrame]
```

Where SmallFrame = 16 and LargeFrame = 64.

So, you can't rely on what a context object tells you about it's indexed size :).
# A Word On Reference Encoding and Immediate Objects
How does Smalltalk to make integers objects?

The answer is easy. An integer is an object when you are at the Smalltalk side of the world. When you are at the VM side, it's just an integer of 31 bits, so no indirection nor extra object is needed.

A pointer field of 32 bits may encode an object's address or a small integer.

A funny fact is that addresses do not point to the first header of the object nor the start of it's fields. It points to the start of the base header. This way, only the operations that need the class pointer or the extra length may fetch the extra headers that is behind the base header.

Since memory addresses are multiple of 4, the less significant 2 bits of the address are always 00. This way, the VM recognizes an object's address when it's tagged with a 00 in those 2 bits. For SmallIntegers, the decision was to tag the last bit with a 1, and use the other 31 bits to encode integers.

This way, SmallInteger and memory addresses can be differentiated by how those 2 bits are tagged. This also allows us to encode SmallIntegers inside fields saving space at the cost of making 1 bitshift each time we want to use an SmallInteger. This technique of encoding objects directly in the field is called <strong>immediate objects</strong>, and can be used for other kind of values where the identity is not so important: characters, other kind of numbers...

Also, as you may note, there is an unused bit to let us encode one more immediate object.

- xxx1 is used by SmallIntegers
- xx00 is used by pointers
- xx10 is not used by anybody yet.

Characters maybe? You can read the discussion about it in the Pharo's mailing list, and be part of the future :).

(http://forum.world.st/Plan-discussion-communication-around-new-object-format-td4631910.html)[http://forum.world.st/Plan-discussion-communication-around-new-object-format-td4631910.html]

## U Said Code?
Evaluate this in your workspace and have fun:

```smalltalk
Gofer it
    squeaksource3: 'ImageWriter';
    package: 'ImageWriter-ObjectFormats';
    load.
```

And have an initial look at `HzObjectFormat class>>#formatClassFor:`

Currently this code is a bit dependant on the image writer. And probably it deserves a little cleaning, but it is good enough :).
Patches and improvements are welcome!

Bon Voyage!

Guille
