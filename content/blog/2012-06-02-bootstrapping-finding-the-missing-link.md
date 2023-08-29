---
external: false
draft: false
title: 'Bootstrapping: finding the missing link'
description: This post is a draft and won't be built.
date: 2012-06-02
---

A few months ago I got involved in some crazy project: bootstrapping Pharo. I took some existing code, played with it, hacked it, modified it, understood it. Now I think I have some idea of what is a bootstrap and what are it's advantages. I'll try to give a brief introduction to the project: what is it about, advantages, an overview of the current military secret results, and an insight of what is to come.

I recommend you to have look at my last post ([the image dilemma](blog/2012-06-01-the-image-dilemma)) before reading.

This project is one of the ESUG projects supported this year by the [google summer of code program](http://www.google-melange.com/gsoc/proposal/review/google/gsoc2012/gpolito/1).

## What is a Bootstrap

The encyclopedic definition: A Bootstrap of system is a process that can generate the smallest subset of that system that may be used to reproduce the complete one.

I mean, you have an explicit process that can generate a the minimal version of your system.

Ok, easier: You kick yourself to get impulse and start from a better place :).

Then, bootstrapping software systems or languages normally means that you will somehow enhance the original process that created the system.

Some examples to clarify:
- When your computer is turned on, some one has to bootstrap the little program able to load other programs :).
- Generating a development environment with very basic tools will improve your work a lot (when you use your development environment).
- C compiler is written in C. That means that It somehow compiles itself. Of course if you do not like assembly much, reading the C implementation is a great improvement.
- Pharo implements traits and uses them in the core of the system to empower the design.
- A big part of Pharo's VM is written in smalltalk!

## The need of bootstrapping Pharo

Did you know the image you download from the pharo website is the same one that comes from years ago? I mean, not the exactly same one, but a binary copy :). The fact is that years ago (yeah, ancient history) god created the first image and it started evolving, one little change after the other, to the Pharo we know today.

Now, as in evolution, we found in Pharo missing links. We do not know how some object became the way it is. Or how it was initialized.  The code is simple nowhere, it's a missing link. Also, as years passed, our ancestor became chaotic. It grew in many different uncontrolled and unordered ways. Since the Pharo Project started, one if it's goals was cleaning this mess, but re-modularising and cleaning the system is a hard, long, and bothersome process.

The outputs and advantages of Bootstrapping Pharo will be:
- getting tools to detect problems: bad dependencies, unexistent initializations, code that really do not work but was never executed before.
- This initialization process will be explicit and open.
- We will be able to start the next Pharo from scratch, and since we will be able to change this explicit process, our next generation Pharo will be cleaner and fancier. It will be able to acquire easily new features: namespaces/modules, security, remote tools, mirrors.
- But also, since it will allow people to create a custom system, researchers will have an invaluable tool to fulfil their own purposes. They will be able to experiment

## Current status of the project
The project has already had a first output, which is the <em>image writer</em>. The image writer is a little tool that traces a graph from an SmalltalkImage object, and deploys that graph into a .image file.  I'll talk about this sub project in a future post.

The rest of the code is a military secret yet. Ok, I can give it to you, but you have to be responsible if it blows up on your face :).

The results of the project so far are:
- It can create an Smalltalk image living inside another image.
- This inner/guest image can be written in a new .image file.
- With this approach a small kernel of 1.1MB has been reached.
- SpaceTally runs and prints reports to understand how the space is distributed among objects.
- A tool to detect every uninitialized class variable/class instance variable and references to unexistant globals was developed.

Soon we will have all these public on Pharo Jenkins server.

## Next Steps

- Jenkins jobs :)
- Taking jenkins feedback to speed up the cleaning process
- Remodularizaton to get even a smaller kernel
- Maybe some little experiment to bootstrap MicroSqueak and learn from it
- Bootstrap from source code.

I'll try to keep you updated often. BTW, any ideas, critics or suggestions are welcome. I'm not a gurú, I'm just learning, as everyone :).

Saludos!
