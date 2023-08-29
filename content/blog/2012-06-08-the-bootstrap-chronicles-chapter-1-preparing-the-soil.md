---
external: false
draft: false
title: The Bootstrap Chronicles Chapter 1 - Preparing the soil
description: This post is a draft and won't be built.
date: 2012-06-08
---

In my [last post](2012-06-02-bootstrapping-finding-the-missing-link) I briefly explained what a bootstrap is and why it sometimes is necessary or good to have. But bootstrapping a system is not always the panacea: it means that you have to know lots of it's internals, implement hackish stuff, fight against huge walls like the VM restrictions... So, today we will talk a bit about implementation.

## The First Experiment

I started trying to generate a new image and people pointed to [SystemTracer](http://squeaksource.com/@z-tX0y8Z_DlhaXAp/c_rpul6H).  There was a fork on [PharoTaskForces](http://squeaksource.com/@z-tX0y8Z_DlhaXAp/kHMQOZJX) also, and there were some experiments to base my work on. So I had plenty of things to look at. To have an idea of what SystemTracer does:

- Traces the whole image graph
- For each object it reaches, writes a binary version on a file, respecting the object [format](http://playingwithobjects.wordpress.com/2012/05/30/understanding-object-formats-in-cogvm/)
- Finally, it comes to the start of the file and writes the header the VM needs to start

So my first experiment was based on adapting this SystemTracer guy to write a custom set of objects instead of the whole image. The chosen objects were the ones in the Kernel packages, compiler, files, collections...

*First problem:* If I cherry pick the stuff I want in the new kernel, and the packaging is crap, my selected classes can point directly or indirectly to objects in the non selected set.

This kind of behavior can mean several things:
- You picked wrong. You forgot to pick dependencies that should be there to let the image work. Or you picked stuff you didn't need.
- You picked right, but you have bad packaging in the system, and have to fix it.

You can be asking yourself, Why not following dependencies recursively? Because if you do that, you will end up with the the whole system again :), so simple. Then, we needed a way to trace these problems, instead of hiding them behind a carpet, because whatever the cause of the problem is, it is a problem in the original system we have to fix, not in our process. The chosen solution was to replace rejected objects by a mock ones when writing the image through the SystemTracer. This mock object, which we called MissingVariable could carry some info for debug.

After some trials, I got this little monster alive, compiling stuff, writing to files...

But this is not a bootstrap. Because this process is not to make explicit initializations nor kernel creations. So, my next post will be about the next step: towards creating an image from scratch.

Au revoir!
