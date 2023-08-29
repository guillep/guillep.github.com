---
external: false
draft: false
title: The Bootstrap Chronicles Chapter 3 - It's Alive!
description: This post is a draft and won't be built.
date: 2012-06-17
---

So now that you now a bit what the bootstrap is about and what are some of the problems to face. I'll show you some solutions and progress for **real**.

## How does the bootstrap implementation work
To bootstrap a Smalltalk environment, you need to create a new environment, with it's classes and objects, and initialize some state in them. I could have done that in C, using mallocs and initializing everything by hand using plain memory :). But doing it in smalltalk is easier: you have late binding, polymorphism, closures... Even, once you have done your first steps in the bootstrap, you can send messages to your objects. THAT is nice.

So, that is the way we cho0se to go: A new environment is created (a guest) into the current environment (the host). The guest will have it's own classes and objects.

What about the special objects of the vm? We share them with the host environment, because if not, out new image will not be able to run... Afterwards, when this new image is written into an image file, we will swap references to point to our own new special objects array.

Here is a picture of how it looks like:

![How the host and guest are related](http://playingwithobjects.files.wordpress.com/2012/06/bootstrap-strategy.png)

## The Current Version
I've been through several versions of the image with different capabilities, sizes, correctness. You have to know, everything you forgot to initialize, or initialize in a wrong order, or if you took an extra object you do not need, you will have a not running image, or one that carries all the objects in the host also...

Another thing is that current version takes a sample of the objects in the host to build the guest. I'm already working on starting from scratch + source code, but that is the future and I like enjoying the present :).
### So, how do you load the current code?
```smalltalk
Gofer it
    url: 'http://www.smalltalkhub.com/mc/Guille/Seed/main';
    package: 'ConfigurationOfHazelnut';
    load.

(ConfigurationOfHazelnut project version: '1.3') load.
```

Also, as the code is very sensitive on what you do, it is also sensitive on what image you're running it on. If you play with it in a wrong/different image, you will have different/unexpected results. So, I suggest you to use the same image as me for testing it: **Latest Pharo 2.0**. In particular, I've tested it on versions 20133 and 20134.

Do not scare when loading the configuration on Pharo 2.0 for the first time It will raise an error. It is an issue related with unzipping old mcz in Pharo ([http://code.google.com/p/pharo/issues/detail?id=6054](http://code.google.com/p/pharo/issues/detail?id=6054)) which will fortunately fixed soon. Just close the debugger, try again, and get the project working.

### And, How do I try these weird stuff?
With Nicolas Petton, we have written some examples in the class named **HazelBuilderExamples**.

To run them, you can try the following scripts:

```smalltalk
"Writes an image which when opened prints a spaceTally on fileok.txt"
HazelBuilderExample new buildImageWithSpaceTally

"Writes an image which when opened prints a report on all the packaging/initialization deficiencies of the image on fileok.txt"
HazelBuilderExample new buildImageWithBrokenReferencesReport

"Writes an image which when opened prints a report on all the packaging/initialization deficiencies of the image on fileok.txt. The report is written in the xml format Jenkins Junit plugin likes."
HazelBuilderExample new buildImageWithBrokenReferencesReportForJenkins
```

After evaluating this code, you'll have some *bootstrapped* image and changes files. Open that file with your CogVM and wait until it closes. Then have a look at the *fileok.txt* file :).

Of couse you can look at the code in the examples, and try to build your own. Email me if you have ideas to improve this :).

There are also probably some problems with file overwritting that came with some latest Pharo changes with the file management. Please, if you notice this, just remove the bootstrapped* files from the folder where your image is and try again.
### Hey! How is this thingy useful?
Well, if you've had a look at the examples, the three examples I've shown you are very useful:

- The first one tells you how the space is distributed in the new image. You can use this knowledge to attack space problems if you want an even smaller image.
- The second one is used to detect bugs in the pharo Packaging or in the initialization process: You have not initialized some classes, or the have been initialized but the initialization code does not initialize all the variables.
- The third one is the same as the second, but adapted to have this kind of CI integration: [http://car.mines-douai.fr/ci/job/Seed%20Broken%20References%20Report/](http://car.mines-douai.fr/ci/job/Seed%20Broken%20References%20Report/)

Nice huh? Now we can use jenkins to validate the core of Pharo is well initialized and well packaged when that list becomes empty.
## What's next?

- Each one of those things in the list should be tracked as issues.
- continue working on the bootstrap from sourcecode.
- Making the fuel seed work so we can install fuel packages on our little image.

Keep u updated!

Hasta Luego!

Guille
