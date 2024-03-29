---
external: false
draft: false
title: The Image Dilemma
description: This post is a draft and won't be built.
date: 2012-05-31
---

> Without self knowledge, without understanding the working and functions of his machine, man cannot be free, he cannot govern himself and he will always remain a slave. -- **Goerge Gurdjieff**

Many people I've talked to think Smalltalk is weirdy because it has an image. Funny thing is most people that thinks that, do it because they *feel* it's different. Or they do Java. Of course, Java and Smalltalk are different :). Okok, joke, I'm not interested in flamewars. Seriously what puzzles me is that normally people's opinion on technology is based on feelings instead of concrete rational arguments.



So, let's think a bit on the pros and cons of using an image and not using it. Really. Only after understanding a bit you can decide whatever you want to use. That's what the quote at the start is there for :).



Also, this post will be one of the corner stones to explain the bootstrap gsoc project basics later ;).

# Non Image Based Development Environments

Ok, we all know these. It's the kind of environment we use when we code in C, [Java](http://www.java.com/), [Python](http://www.python.org/), [Ruby](http://www.ruby-lang.org/en/), JavaScript and many other.



We have source files which will be somehow interpreted on runtime or traduced to machine code in an executable file. Naively explained, the interpreted ones normally depend on another program normally called interpreter or VM and the other ones depend only the first time on a compiler. So far, nothing strange.

# Image Based Development Environments

Image based environments are the main topic of this post. But before talking about it's pros and cons, we have to define what is an image. And to avoid preconceptions, let's name them <em>snapshot</em>s. A snapshot is a photo taken of a system in a moment of time <em>x</em>, from which we can rebuild the whole system again.



If you have ever used VirtualBox or VMWare solutions you know what I am talking about: you have, for example, a linux mint virtual machine, which can be opened with your virtual box software. If you save the state of your linux mint with virtual box, the next time you open it, it will wake up in the same state you left it. **It will not start everything from scratch** unless you tell it explicitly. And if you quit without saving, the next time will open without your changes.



*It's a very simple concept: you are treating a whole running system (a linux machine in this case) as any of your other data files.*



So that's how most of the smalltalk systems work: you have a *running* smalltalk system, and when you wake it up, it will start from where it was left. Even if you was in the middle of a computation, this computation will continue running.

# Comparison

## System Configuration

How heavy or reproducible is our system configuration?

### non image based

When a program start it normally does some basic initialization, configuration loading, setup stuff... Every time our program does this same basic stuff. It's a repetitive task, but it's done by the machine, so I'm ok with it.



Even more, one of the advantages of loading the application again from scratch is that you are testing your building process. And having a working artifact after ensures that you will be able to rebuild it in the future following the same steps.



But have you ever wondered how much time takes a java class loader to load the classes you will use? And how much time takes Hibernate or Spring or JBoss to read your configuration, and provide an usable environment? And how about to compile a large C/C# application? Ok, those times are machine time. You can go to take a coffee every time you restart your tomcat, or change a source file with many dependencies. That time is not even important in a deployed product, since it is delayed to the user or webserver which may run it once every hours/days. But it is important some times. For example, when you are developing software. Software development is a highly demanding task which requires concentration. Taking a coffee every 15 minutes makes you lose concentration. And you can't avoid checking/compiling/testing your code for long periods of times because handling lots of changes only in your head it's a really hard task.

### image based

When an snapshot is taken, the whole objects and computations that were occupying some memory in your program will be saved in a file in the state they were. Object references are not broken. Then, when you load your smalltalk snapshot again, the objects take place in memory, and continue working as they were. Normally there is not heavy initialization on image startup other than reallocating resources from outside the environment (files, sockets are OS resources and become invalid for sure when the system is halted). You don't have to configure almost none of your program neither, because it is already configured!



Now, since you don't have to reinitialize your configurations from scratch every time, maybe you initialized it, then accidentally deleted the method that performed the configuration. And then you are screwed, because if you want to start from scratch you will have pieces of your program lost that will make it impossible. This is why we may consider an image based system and evolving environment. Because the system is changed by mutations that may get lost or untracked.

## The Development process

How is our development process altered by the environment we use?

### non image based


1. Write code in a file
2. Compile or similar or however you want to call it :).
3. Run the whole program from scratch
4. Test
5. Go to 1

This process is slooow. Specially because of steps 2/3. For every change you do, no matter if it is long of little, you have to rebuild everything and lost time with it, and reinitialize, and reconfigure... Even if you only wanted to replace a 2 by a 3, or fix a typo in a string.



However, there exist currently some tools that implement what they call [hot deployment](http://radio-weblogs.com/0135826/2004/05/17.html#a30) which is nothing else that exploiting some dynamic features that let a program change while it's running. But hey! That's what we do with an image based approach: we change the program while it's running.



Anyway, those extra steps makes you gain reproducibility by making some parts of the process a bit more explicit. At the cost of extra bureaucracy.

### image based



1. Open your image
2. Write code
3. Evaluate/Accept
4. Test
5. Go to 2

Here the main difference is that the modification of our program is made of little deltas <strong>during execution</strong>. We replace/change/create methods while our whole program is running. We create classes, objects, modify class hierarchies while our whole program is running. We alter our objects state while our whole program is running. This really improves the development process, since the time you have to wait to receive feedback from execution or testing is almost none. And there is less overhead, less context switch in your head.



Now the problem is that to reproduce our program we have to track all the little changes we've done. And understand them, and discard the ones that really overlap o do not make sense. In the Smalltalk System [Pharo](http://www.pharo-project.org/) we have a .changes file that works as a log of the changes done. This changes file aims to reduce the impact of this dynamic feature disadvantages.

## IDE's Features

Have you ever used an IDE with refactoring support, syntax highlighting, nice code browsing capabilities? What do our tools need in order to provide us all those gourgeous features?



IDE are meta-programs. They are programs that help us manipulate programs: modify them, understand them, query them. And to do that they can do it by:

- directly modifying source code without a model behind. Painful and Hard. I would never try to do it that way :).
- modeling the concepts of the language they will manipulate to make it easier.

### non image based

A program's meta model (a model representing program entities such as classes or variables instead of domain entities like bank accounts and clients) is often generated when the program runs if you have reflective capabilities in the manipulated language. But IDEs should work while the program is not running, or even if it does not provide reflection. So, how does this approach build this kind of tools?



They have an alternative model and an alternative parser/compiler which generates this model from sourcecode. A lot of extra work is needed for information that is already there. The problem is that information is lost in text files with source code instead of being stored in a more malleable format.

### image based

Our image based approach can contain all the meta information in the snapshot, alive, as first class objects. This means that we do not have to create a duplicated meta-model, nor an extra parser/compiler. We can use the ones that are alive in the image. We make use of the model created by the language, what we can't do in the non image based approach.

## Files or no files

Some times you feel comfortable modifying files, some times not.

### non image based

You have files with your source code. You can use them to execute/compile your program, you can store them in svn/git/bazar repositories, you can diff/grep/more/less/find over them just using a terminal.



I think this is the main pro over the image based approach. There are plenty of tools working on plain text files you can use if your source code lives in this kind of storage.



But try to write a program implementing an extract method refactoring over a piece of text. You have to write a very complex and large program analyzing classes, methods, scopes...



In two words: It's really cool to use existing tools. But it is not that nice to write your own.

### image based

As the opposite of the not having an image, we can't just use our nice text manipulation tools on our image file. We have to rebuild them on our system, or externalize the source code in files to use them. And then re-insert the feedback in the system.



But there are other tasks-like refactorings and meta programming in general- that become very simple just by the fact of manipulating objects instead of text.



In the Pharo project there are plenty of existing and arising tools aiming us to interact with the outer world, just like:

- [Native Boost](http://www.esug.org/wiki/pier/Conferences/2011/Schedule-And-Talks/Native-boost)

- [OSProcess](http://book.pharo-project.org/book/PharoTools/OSProcess/)

- [Metacello Git binding](https://github.com/dalehenrich/metacello)

# Conclusion

As I've shown you, these two approaches have their good and bad stuff. None of them is the silver bullet, and we should be aware of that to be better developers.



I hope you are a little more free now ;).



さようなら!
