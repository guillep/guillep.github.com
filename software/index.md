---
layout: page
title : Software
group: navigation
---
{% include JB/setup %}

###Oz Object Spaces

This is my main software contribution from my phd. Oz object spaces allow the complete manipulation of an object runtime from another object runtime: debugging, browsing, object graph analysis, etc. My implementation is based on [Pharo](http://www.pharo-project.org) and contains two main elements:

- *Oz Virtual Machine*. is a Pharo Stack virtual machine with support for handling several worlds at the same time.
- *Oz Language side Packages*. are the packages that at the language level allow the manipulation of other object runtimes.

Using Oz, I developed many experimental utilities:

- *Oz recovery tools* The Oz image loader and Oz emergency kernel help in the recovery of a broken or unstable Pharo image (see [Details]({{page.path}}/details.html) page).
- *Oz development tools* Debugging, browsing and inspecting another object runtime (see [Details]({{page.path}}/details.html) page).
- *Hazelnut* Bootstrapping a reflective object kernel (see below).

[Details]({{site.url}}/software/details.html) - [Downloads]({{site.url}}/software/downloads) - [CI jobs](https://ci.inria.fr/rmod/view/Oz/)

###Hazelnut Bootstrap

Hazelnut is a project which uses Oz capabilities to bootstrap a reflective object runtime from scratch. This bootstrap takes as input the source code defining the new object runtime plus a builder and outputs an object graph defining the new runtime. The bootstrapped object runtime is aimed so far to run on the Pharo Virtual Machine.

As Hazelnut examples

- Pharo Kernel

- Pharo Candle

- MetaTalk

###Tornado: Ongoing

blabla

###Pharo

###DBXTalk