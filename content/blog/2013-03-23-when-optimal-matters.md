---
external: false
draft: false
title: When optimal matters
description: This post is a draft and won't be built.
date: 2013-03-23
---

This last week I've been involved somehow in several discussions which, although not explicitly, talked about optimizations. In particular, premature optimizations. Of course, we all know they are evil. Do we? I'll not discuss today on optimization techniques, but on what should an IT professional think about when thinking about optimizations in his programs.

The main arguments I heard this week of people supporting premature organizations were:

- A guy using some technology X, should know the underlying details of X, or he will fail. Let's say, if you are a Java programmer, you **must** not only know there is a [GC](http://en.wikipedia.org/wiki/Garbage_collection_(computer_science)), but also how it works.
- A tech guy should be always conscious of the resources used. i.e., not to store a lot of objects in caches because memory is a finite resource.
- Assumptions on what should be faster. Using or not a macro in C for example.

And these arguments are not even totally wrong. But they are not so totally true as they were stated.
> Premature optimization is the root of all evil
You know Donald Knuth? This phrase (attributed to C.A.R. Hoare, btw) became famous because of [this paper](http://pplab.snu.ac.kr/courses/adv_pl05/papers/p261-knuth.pdf) he authored. The interesting thing is that this phrase, when used, is taken out from context. The original phrase is:
> Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We *should* forget about small efficiencies, say about 97% of the time: **premature optimization is the root of all evil.** Yet we should not pass up our opportunities in that critical 3%.

## Being optimal is not all that matters
When writing software, running optimal is not the only variable to analyze. We want programs to be debuggeable, understandable, extendable, maintainable. And sometimes, optimal code can be ugly, and can be hard to change, or to fix bugs on it.

So, let's look at this piece of code written for [Pharo](2013-03-18-pharo-2-0-released). This piece of code takes a string, splits the substrings taking the space character as separator, excludes the substrings that do not exist as symbols in the system, and then it converts them to symbols.

```smalltalk
aString := 'aaaaa bbb Class cccc ddd'.
((aString splitOn: Character space)
    reject: [ :each| Symbol lookup: each  ])
    collect: #asSymbol
```

Kind of understandable piece of code. But what goes on behind scenes?
- **splitOn:** creates a new (and temporary) collection. It also creates strings for each substrings and copy all the contents into those strings;
- **reject:** iterates over the result of #splitOn:, creates a new (temporary again) collection;
- **collect:** iterates over the result of #reject:, creates a new collection to put the results of #asSymbol

Finally, there are two intermediate collections that are discarded, some substrings are created by copying all the contents and finally discarded (cause we only care about the symbols). Yes, that is inefficient: lots of temporary allocations that could launch the GC, several iterations over collections... we could do better. Let's see an alternative version Camillo Bruni ([Rmod, Inria](http://rmod.lille.inria.fr/web/)) suggested to improve in terms of speed and memory usage:

```smalltalk
Array streamContents: [ :s|
    aString
        splitOn: Character space
        indicesDo: [ :start :end|
            aString asSymbolFrom: start to: end ifPresent: [ :symbol|
            s nextPut: symbol]]
```

This new version, which btw ends up with the same result, is pretty much more efficient:
- Streaming on the result causes only one collection allocation without temporal ones;
- Some special methods introduced into String to avoid extra collection allocation, and substring copies;
- One collection means only one iteration :)

But wow, the code became much more complicated (given the simplicity of the example), and less object oriented. We do not manipule so easily the substrings by sending messages to them, we have instead the indices into the source string. Our code is much more aware of the problems we stated before, and recurring to lower level APIs to avoid them.

Now, extend these ideas to a whole large application. Hundreds or thousands of classes written this way. We write methods of tens (or hundreds, why not?) of lines of code to avoid message sends (and therefore method lookups), we avoid at the maximum object allocation and go for an <em>if</em> based solution... and soon we will have lots of duplicated code, stringy code everywhere... And yet I can tell you (just guessing :^) your program will not be tons more optimal. What? Now my code is so hard to maintain and not very much faster? Not cool...

## Being optimal when optimal matters

So let's say we have this function that takes 100.000 database rows, makes some calculations, and show a simple result to a user. It takes 1 second, which is a lot for a nowadays machine. But this function is used once per hour...

Now take the code that evaluates the bytecode that access an object's field. It gets executed maybe some lots of thousands of times per second? So, if this operation starts to take 1 second... :)

Or take this application that stores data on background, but when restoring wants to be as fast as possible to give a really good user experience. Will you care how much it takes the storing operation?

Do we really have to spend a lot of time optimizing code that is almost not used? Or code that does not need to run *that fast*? Wait! My application runs ok, ***do I really have to optimize something?***

As Knuth says, 97% of the code is not critical. Only 3% deserves to be optimized.

## Understand when and where optimal matters
So now you know the key point (optimizing when it matters), and you understood it mattered in your case. Time to find that 3%. And it may be not so obvious...

**Thanks engineers invented profiling!** Just look a bit around, there are tons of tools to help you understand what you're doing wrong: where is memory allocated?, and of which type?, is the GC launched so often? is a time consuming function executed too many times? Profiling is a technique that should be on every software engineer tool-case.

## The rules of optimization

As a conclusion, today I found this link I want to share about the [rules of optimization](http://c2.com/cgi/wiki?RulesOfOptimization). And I think they are a pretty good guideline. When you are thinking on making an optimization:
- First time: Don't do it!
- Second time: Don't do it yet!
- Third time: Ok, but you first profile and measure, and then optimize

There is much to lose when only thinking on the optimal solution to a problem in terms of machine resources. Remember people's time to understand the written code, to adapt it to new situations and to fix bugs on it is also a valuable resource.

Guille
