---
layout: page
title : Research
group: navigation
---
{% include JB/setup %}

###[Oz Object Spaces]({{site.url}}/research/oz/)

This is my main software contribution from my phd. Oz object spaces allow the complete manipulation of an object runtime from another object runtime: debugging, browsing, object graph analysis, etc. My implementation is based on [Pharo](http://www.pharo-project.org) and contains two main elements:

- *Oz Virtual Machine*. is a Pharo Stack virtual machine with support for handling several worlds at the same time.
- *Oz Language side Packages*. are the packages that at the language level allow the manipulation of other object runtimes.

Using Oz, I developed many experimental utilities:

- *Oz recovery tools* The Oz image loader and Oz emergency kernel help in the recovery of a broken or unstable Pharo image (see [Details]({{page.path}}/details.html) page).
- *Oz development tools* Debugging, browsing and inspecting another object runtime (see [Details]({{page.path}}/details.html) page).
- *Hazelnut* Bootstrapping a reflective object kernel (see below).

[Details]({{site.url}}/software/oz) - [Downloads]({{site.url}}/software/oz/downloads) - [CI jobs](https://ci.inria.fr/rmod/view/Oz/)

###[Hazelnut Bootstrap]({{site.url}}/research/hazelnut/)

Hazelnut is a project which uses Oz capabilities to bootstrap a reflective object runtime from scratch. This bootstrap takes as input the source code defining the new object runtime plus a builder and outputs an object graph defining the new runtime. The bootstrapped object runtime is aimed so far to run on the Pharo Virtual Machine.

As Hazelnut examples, we bootstrapped three different reflective languages: the Pharo Kernel, PharoCandle and MetaTalk.

[Details]({{site.url}}/software/hazelnut) - [Downloads]({{site.url}}/software/hazelnut/downloads) - [CI jobs](https://ci.inria.fr/rmod/view/Oz/)

###[Tornado]({{site.url}}/research/tornado/)

The tornado project, still unstable and hidden, aims to build tailored object runtimes. These object runtimes will be built for custom scenarios.