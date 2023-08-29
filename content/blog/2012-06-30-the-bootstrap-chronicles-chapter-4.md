---
external: false
draft: false
title: The Bootstrap Chronicles Chapter 4 – Pump up with Fuel
description: This post is a draft and won't be built.
date: 2012-06-30
---

Last time we were generating a new image with useful information.  This post tells the story after that first bootstrap: How we ensure that little monster is healthy, and how we ensure that our process is flexible and robust enough, and how does it help pharo in the modularization cruzade.

## Fuel - The modularization sword
Probably some of you already know about Fuel: a fast object serializer written by Mariano Peck and Martín Dias. And maybe you are also aware of another Google Summer of Code Martín is working on: a Binary Package manager on top of fuel. Mariano showed us already a first proof of concept of that idea in this post: [http://marianopeck.wordpress.com/2011/09/24/importing-and-exporting-packages-with-fuel/](http://marianopeck.wordpress.com/2011/09/24/importing-and-exporting-packages-with-fuel/).

So, I want to work on building stuff on top of my little bootstrapped image.  And I thought Fuel was a nice gun to attack that problem.
## Detecting illnesses
In my last post about the bootstrap I've already shown you how to get a list of broken/uninitialized stuff. That gives us an idea of how healthy our image is.  But there are other tools that we already use for that: tests.

So, Can we run SUnit on the bootstrap? Yes.

When I thought about Fuel and the bootstrap, I thought Fuel should be included by default, otherwise it should be difficult make it grow.  Of course I could've chosen the compiler for the same purpose.  But I'd like to enable modularization with binary packages.

So, what about exporting sunit as a binary package, and import it in the bootstrap? And what if we also export the tests over sunit, and include them also? Then we should be able to run the tests of sunit. Nice. Then this same idea can be applied to tests the kernel, or the compiler...

And I did it :)
## Completeness (or "does it have all its essential parts?")
Another thing we can think on is testing the completeness.  When should you consider that the bootstrap is complete? A fun definition could be "when it is able to define itself". Ok, let's export the bootstrapping code with fuel, and import it in the bootstrapped image, and let's try to bootstrap from the bootstrap. And do it again, just for fun.

Once the bootstrap bootstrap was working, I put the tests to work on the last generation of bootstraps.
## The results
I've created some Jobs to test all this stuff in the [Ecole de Mines' Jenkins](http://car.mines-douai.fr/ci/view/Seed%20Tests/).

The test results are exported in JUnit format, so we can tell what's broken and look at the stack trace.  All this jobs are working on the bleeding edge of the project using latest Pharo image and latest CogVM.

Have Fun!

Guille
