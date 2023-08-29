---
external: false
draft: false
title: Oz object spaces in Esug 2013
description: This post is a draft and won't be built.
date: 2013-09-06
---

Hi!

This little post is to add a summary of what I'll be showing in the upcoming [ESUG conference](http://esug.org/wiki/pier/Conferences/2013). I'll present a paper about my work in the workshop and present the recovery tools of Oz in the innovation awards :).

####For the paper
I'll present the ideas and implementation of Oz object spaces. Especially the metacircular problems it solves, and a bit on the vision we (I and my supervisors have on this line of work). If you want to read the paper, you can go to:


[http://rmod.lille.inria.fr/archives/papers/Poli13a-IWST13-ObjectSpacesVirtualization.pdf](http://rmod.lille.inria.fr/archives/papers/Poli13a-IWST13-ObjectSpacesVirtualization.pdf)

For the lazy, I paste here the abstract:
> Reﬂective architectures are a powerful solution for code browsing, debugging or in-language process handling. However, these reﬂective architectures show some limitations in edge cases of self-modiﬁcation and self-monitoring. Modifying the modiﬁer process or monitoring the monitor process in a reﬂective system alters the system itself, leading to the impossibility to perform some of those tasks properly. In this paper we analyze the problems of reﬂective architectures in the context of image based object-oriented languages and solve them by providing a ﬁrst-class representation of an image: a virtualized image.
We present Oz, our virtual image solution. In Oz, a virtual image is represented by an object space. Through an object space, an image can manipulate the internal structure and control the execution of other images. An Oz object space allows one to introspect and modify execution information such as processes, contexts, existing classes and objects. We show how Oz solves the edge cases of reﬂective architectures by adding a third participant, and thus, removing the selfmodiﬁcation and self-observation constraints.

####For the innovation awards
I've prepared a demo and with that I recorded a little video showing it. You can see it in:


<YouTubeEmbed url="http://www.youtube.com/watch?v=9-ARnlGXjL8" label="Oz Demo"/>

####Also, we have a sexy logo!

Created by my friend Ximena Fernandez

Copyright (C) 2013 Ximena Fernandez.

![](http://playingwithobjects.files.wordpress.com/2013/09/oz.gif?w=625)


I asked my friend Ximena to make a logo for my projects, even pushing her with the deadline of ESUG 2013 (sorry xime ;), and she created this one, that I really like.

So, thanks again Xime!

Now, waiting for next week @ ESUG, to taste the [ESUG Beers](https://twitter.com/esugsmalltalk/status/375693284389441536/photo/1) ;).

Enjoy!
Guille
