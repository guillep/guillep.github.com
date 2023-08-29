---
external: false
draft: false
title: Pharo 2.0 Released
description: This post is a draft and won't be built.
date: 2013-03-18
---

Aaaand, a new version of the Pharo project cames out. It ressembles the version 2.0 of this dynamically typed object-oriented programming language and environment. This release includes [many cool stuff](https://code.google.com/p/pharo/wiki/ActionsInPharo20) improving a lot the infrastructure of the system, adding new core libraries and lots of cleansing and improvements. Let's make some remarks on this release.

## Cool Development Tools, all by default

Pharo's default browser is now Nautilus by Benjamin Van Ryseghem. Nautilus has lots of cool features, like an alternative Group view, a plugin architecture, and integration with Monticello, refactorings and the Critics browser. Yes! Now by default Pharo includes refactorings, since they are one of the cornerstones of the development activities. Critics browser is also included, so the code quality can only improve :).

Auto completion has also seen lots of changes: default completion is <enter>, press <tab> to complete word per word á la command line, and it has also been revisited to provide better and more meaningful results.

Finally, if you press <shift+enter> you'll see on the right upper corner the Spotlight by Esteban Lorenzano. A simple but powerful way tool to quickly browse a class or method.

## Boosted by NativeBoost and Fuel
Pharo wants to be fast. And that's something NativeBoost and Fuel achieve. That's why you can find them included by default in the system.
[NativeBoost](https://code.google.com/p/nativeboost/) (by Igor Stasenko) gives us the ability to execute machine code from the language side, and a new generation FFI with callbacks. Use it with caution :). [Fuel](http://rmod.lille.inria.fr/web/pier/software/Fuel), written by Mariano Martinez Peck and Martin Dias, is a cool object serializer focusing on **fast deserialization (materialization)**, and the ability to serialize any kind of objects: Block closures? yes. Contexts? yes. Complete debuggers so we can restore them and debug failures in other environments? [YES](http://marianopeck.wordpress.com/2012/01/19/moving-contexts-and-debuggers-between-images-with-fuel)
## UI Front - Spec and Keymappings
Pharo 2.0 includes two new cool libraries on the UI front: Spec and Keymappings.

Spec is a framework, mainly work of Benjamin Van Ryseghem under the tutelage of Stéphane Ducasse, to build UI components declaratively. It puts its main focus on component reuse and ability to be composed. Spec was included into Pharo 2.0 and some tools were reimplemented to use it. How do you give it a try?
- [Tech Report on Spec](http://hal.inria.fr/docs/00/70/80/67/PDF/SpecTechReport.pdf)
- [Paper explaining Spec basics](http://www.esug.org/wiki/pier/Conferences/2012/International-Workshop---IWST-2012/Proceedings.pdf?_k=59sK_AnR-5_4uo42&amp;view=PRDownloadView&amp;_n&amp;25)

On the other side, Keymappings is a shortcut library mostly re-written by me (Guille Polito) to adapt it to Pharo. It's main objective is to provide common shortcut semantics for desktop UIs, and remove hardcoded semantics spread all over the system. Pharo 2.0 includes Keymappings and has already replaced some users of the old-fashioned(harwiredandmessy cof cof) shortcut declaration by nice keymapping ones. On the documentation side, I owe it to you :). I promise to a nice tutorial-post this week!

## System changes - System Announcements, RPackage, FileSystem, branded VM
On the internals of the system, the notification of system events was replaced by System Announcements, RPackage was introduced so the old and ugly packaging system can be slowly migrated, and the old FileDirectory was tackled down and all its usages were replaced by the new cool FileSystem library (already there in 1.4).

Also, the Pharo VM is now branded, and includes many fixes and bundled libraries (nativeBoost and SSL plugins, cairo, freetype). You should run your Pharo images on a Pharo VM, which you will identify by a nice Pharo icon ;).

And of course there are lots of other clean and cool new stuff to see like SSL, command line tools, non UI blocking notifications... A more detailed list is [here](https://code.google.com/p/pharo/wiki/ActionsInPharo20). So take Pharo, have a look, enjoy, and give feedback. Remember that any contribution is valuable, as small as it looks.

[Download Pharo](http://www.pharo-project.org/pharo-download/release-2-0)

[Pharo website](http://www.pharo-project.org/home)

[Joining and helping](http://www.pharo-project.org/community)

[Pharo By Example book (available as a free PDF)](http://www.pharobyexample.org)

Chaus, Guille
