---
external: false
draft: false
title: The Bootstrap Chronicles - The end of a phase
description: This post is a draft and won't be built.
date: 2012-08-22
---

As some of you already know, the GSOC project edition 2012 is coming to an end. And along with it, the bootstrap project reaches a checkpoint. This post covers is the news since the last chapter, and discusses about the future steps. In a next post I'll document the details of the project deliverables.

## Where we where?

The first product of this project was a renewal of an image serializer: the SystemTracer. It takes an object graph and serializes it into the image format a vm works with. The System tracer was refactored reifying the memory object formats and updated to write Cog images.

The second step was to work on bootstrapping. And it was successful. Hazelnut, the bootstrap process tool, is able to build a smalltalk image from a description. To ensure the quality and health of these newly created images I set up jenkins jobs loading different packages on top of them, and running tests over them.

## What happened since last time: Declarative kernel descriptions
A kernel definition has two main parts:

- the code and definitions of the entities of that kernel 
- a definition on how to build the basic model of that kernel and how to initialize it finally

The first one can take the form of source files like in [https://github.com/guillep/PharoKernel](https://github.com/guillep/PharoKernel), which is the source code Hazelnut actually uses to bootstrap Pharo images. The second part of the kernel definition contains some imperative parts, and by now they are declared in simple pharo classes you download from Monticello.

So now, the bootstrap loads the kernel definition from those source files, generates the bootstrapped environment, and serializes it into a new image file.

## The future of bootstrapping pharo
Since our goal is to bootstrap pharo to support it's modularity and evolution, there are some keypoints to attack in the near future:
- getting the pharo sourcecode in sync with this bootstrap representation
- choosing the really important parts for a kernel. What should be and what should not in those source files? Where do we package what's not going kernel?
- building pharo from bootstrapped images.

Even, when looking at the upcoming pharo changes like first class slots and class layouts, or the new Tanker package manager, the bootstrap will need for sure some updates.
## Conclusions
I hope this project makes pharo grow and get better! We can now generate images with the source code defined statically in source files, so for the GSOC program the scope has been fulfilled.

See you in a next post documenting the project!

Salut!
