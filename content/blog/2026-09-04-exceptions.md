---
external: false
title: "Exceptional rant"
description: "A personal journey from the familiar termination model of exceptions to Pharo's resumable exceptions—and why explicit callbacks can make better interfaces."
date: 2026-09-04
tags: [pharo, exceptions, modularity]
---

I used to think I understood exceptions.

We **all know** that Exceptions interrupt the execution flow.
Then they go up the stack looking for exception and cleanup handlers, which you may call `try/catch` and `finally` blocks or `on:do` and `ensure:` methods.
Regardless of that cosmethic difference, I learnt in the past that exceptions work as follows: once a handler is found, the stack between the signaler and the handler is terminated, then the handler executed, and and the signaling process continued up.

Simple.

At least, that is the mental model I grew up with.
Now, in the past days a bit of archeology, and read a couple tenths of old research articles between the 70's and the 90's.
And then I discovered that my mental model of exceptions was, well… narrow.

## What I did not know I knew: the termination model

During my studies and my first jobs in Java, C# and all those mainstream languages, I learnt an exception model that now I know is called the **termination model**.
Let us consider the following call stack that reaches an exception:

```text
main
methodA
...
methodC
signal <- an exception happens!

(stack grows down)
````

Then the runtime goes up the stack looking for an exception or cleanup handler.
In the termination model, the runtime stops at the first handler found.

```text
main
  |
on:do:
  |
...
  |
ensure: <- I will stop here!
  |
signal
```

Then, the stack up to that point will be *terminated*, the handler executed, and we continue.

The nice thing about this model is that it is linear, thus easy to reason about.
Execution goes down, exceptions go up, handlers are executed in a predictable order.

## But Pharo does not use the termination model

Somehow, Pharo inherits another model, called the **resumption model**, which is called like that because it has **resumable exceptions**.
In the resumption model, exceptions may continue from the point where they have been raised.
Thus, we only can execute cleanup blocks when we are faily sure!

Consider for example the piece of code below that opens a file, closes it on an ensure block, and resumes an exception if needed.
In the termination model, the ensure block would execute first, close the file and continue upwards.
However, in that case, if the exception is resumed, the execution may continue from the original execution point, except that the file is now closed!

```pharo
[

	file := self openFile.
	[
	self doSomething.
	file read.
	self somethingElse
	] ensure: [ file close ].

] on: SomeException do: [ :e | e resume ].
````

To support resumable exceptions, the resumption model works like this.
First the runtime looks for exception handlers.
If an exception handler is found, it is executed.
If the exception handler choses *not to resume*, then the cleanup handlers below it are executed in upward order.

```text
main
  |
on:do: <- I stop first here! If I do not resume then I go downwards again
  |
...
  |
ensure: <- and then I'll stop here
  |
signal
```

The point is that the execution now is not linear anymore.
It ping pongs up and down the stack.
Which makes it just more difficult to grasp...


## The problems with the resumption model

The first problem is probably just me.

**Linear thinking is sooo much easier.**

I grew up with a linear termination model.
Exceptions terminate a computation.
There is a beginning, something goes wrong, we go upwards, and the original computation is gone.

Resumption breaks that mental model.
But there is another problem that bothers me more.

**They break modularity.**

Consider the code that signals the exception.
For resumption to be safe,
 - the signaler method needs to be prepared to continue after the signal.
 - and the exception handler needs to know whether resumption is possible (or mandatory), and what resumption value is required if any

This creates a contract that is kinda brittle, and very implementation dependant.
What if those two pieces of code belong to different projects?
Different packages?
Different layers?


Can we throw them away?
How are resumable exceptions used in Pharo?

## Process-scoped notifications

If you do some Pharo, you know them. The idea is essentially:

> "I will notify my callers that something happened, and then continue."

This can be used for things like transcript printing, progress bars, and raising warnings.

It is an alternative to mechanisms such as announcers, `update:`/`changed:`, and dependents.
Do we really need another one?

But there is a catch.
If you catch the exception or notification, you need to remember to **resume it**.
Otherwise you have accidentally changed the behavior of the computation.
That is a pretty significant responsibility for something that can look like ordinary exception handling.

## Dynamic value lookup

Another *interesting* use is dynamic value lookup.
Imagine that you need a value that is not directly available in the piece of code executing.
Instead of passing it explicitly through every method in the call chain, you signal something that essentially asks:

> "Does somebody up there have this value?"

One of the callers may then provide the answer.
This is used for things such as asking the user or developer for something, opening popups, with examples like `ProvideAnswerNotification` and some `UIManager` lookups.
It's a clever mechanism.

But it also makes me ask:

**Why wasn't the value a parameter from the beginning?**

If the computation requires a value, passing the value explicitly gives us a very clear contract.
With dynamic lookup, the dependency is hidden in the control flow.

## My superior solution: callbacks

The point is, we already know how to make this work.

```smalltalk
Dictionary >> at: aKey ifAbsentPut: aBloc
	
	^ self at: key ifAbsent: [self at: key put: aBlock value]
```

If your computation needs somebody to provide an answer, give it a callback.
If your computation needs to notify somebody, call the callback.
If your method can continue after something happens, make that continuation part of the interface.
The important thing is not necessarily that callbacks are always better than resumable exceptions.
The important thing is that the contract becomes explicit.

Instead of:

```text
signal
```

and hoping everybody involved understands the resumption semantics, we can make the continuation visible.
The code becomes easier to read.
The dependencies become easier to understand.
And, most importantly, the behavior becomes part of the contract rather than an implementation detail.

## Make it explicit

Exceptions are already a mechanism that makes control flow non-linear.
Resumable exceptions take that one step further: they allow us to interrupt a computation and later continue it from where it was interrupted.

That can be powerful.
It can also be elegant.
But power comes with a responsibility.

But why having a complicated runtime feature when this can be replaced by a callback?
Callbacks can be blocks, or even normal objects.
They can be shared and reusable.

And they are explicit.