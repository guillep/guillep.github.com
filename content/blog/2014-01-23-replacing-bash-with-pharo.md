---
external: false
draft: false
title: Replacing bash with pharo
description: This post is a draft and won't be built.
date: 2014-01-23
---

Yesterday evening we were bored with Santi (Santiago Bragagnolo) and we started discussing about Coral (link to coral). For those who don't know what Coral is, in a couple of words we could say that it's a project that aims to take Pharo into the command shell. Well, since we thought it was easy to implement on top of the new shiny command line handlers of Pharo, we made a prototype implementation of some basic stuff in a couple of hours. We put here the path we took, and what we learnt on the way.

## Shell interpreters (are they called so?)

The first thing we played with to understand is how to tell the operating system to execute a given script with a command or interpreter. You know, usually when you have a bash script you put as first line the following:

```bash
#!/bin/bash
```

When we execute a file with that line on top, it is telling the operating system "hey you, execute me with the /bin/bash executable!". And we wanted to so something similar with pharo taking advantage of the "eval" command line handler. First we tried with the following:

```bash
#!./pharo Pharo.image eval
```

But that didn't want to work. The vm opened as expected, but it didn't take the given image (Pharo.image in this case). (I have to search somewhere why) Ok bash, if you want a single executable in the top, we will give you that:

```bash
#!./scale
```

We named the command we needed scale, because scales are in shells, it sounded nice. The scale file read as follows:

```bash
#!/bin/bash

./pharo Pharo.image eval "$@"
```

That gave us the possibility to write our first pharo script:

```bash
#!./scale

FileStream stdout nextPutAll: 'hello world';cr.
```

And we got it executed! But with an error, now in the side of Pharo :)

```bash
===============================================================================
Notice: Errors in script loaded from /Users/guillermopolito/work/temp/scriptable/print.st
===============================================================================
Syntax Error on line 1: 'Nothing more expected'
===============================================
1: ./scale
   _^_
2:
3: FileStream stdout nextPutAll: 'hello world';cr.
4: "system stdout << 'llamando a ls'.
5: system stdout cr.
6: (system call: 'ls') do: [ :line |
7: 	system stdout << line.
8: 	system stdout cr.
9: ]"
```

What happened there?

Well, fist, the input of the file was sent to the eval command line handler and tried there to be executed. The funny part is that the #! is not shown as part of the parse error because #! is a valid symbol :D. At this point we decided to implement another command line handler, again named scale.

## Scale command line handler

To handle our scale script file we needed to skip the first line, and so we did. We created ScaleCommandLineHandler as a subclass of BasicCodeLoader.

```smalltalk
BasicCodeLoader subclass: #ScaleCommandLineHandler
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'Scale'
	
ScaleCommandLineHandler class >> commandName
	^ 'scale'
	
ScaleCommandLineHandler class >> isResponsibleFor: commandLineArguments

	^ commandLineArguments includesSubCommand: self commandName	
	
ScaleCommandLineHandler class >> priority

	^ 10
```

And we did override the activate method and the installSourceFile: to do as we wanted

```smalltalk
ScaleCommandLineHandler >> activate

	self activateHelp.
	self loadSourceFiles: self commandLine arguments.
	self installSourceFiles.
	FileStream stdout cr.
	self exitSuccess.
	
ScaleCommandLineHandler >> installSourceFile: aReference
		"Install the the source file given by aFileReference"
	
		" parse the code given in the source file"
		aReference readStreamDo: [ :stream |
			(stream peek = $#) ifTrue: [ 
				stream upTo: Character lf ].
		
			self 
				handleErrorsDuring: [
					Compiler evaluate: stream upToEnd.
					]
				reference: aReference
		].
```

The only thing needed was to change our ==scale== bash script to use our new command line handler

```bash
#!/bin/bash

./pharo Pharo.image scale "$@"
```

And our script was now working!

## Calling the system

Now we had scripts evaluating, we wanted a nice way to interact with the system: call other commands, access the command line arguments, the standard input/output/error scripts, and stuff. We decided to make an object and make it available inside the executable script. Doing so in Pharo is as easy as telling the compiler to compile our script for a given object. We introduced a ScaleScriptRunner in charge of running the code in the right way and redirected our command line handler to that guy.

```smalltalk
Object subclass: #ScaleScriptRunner
	instanceVariableNames: 'system'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'Scale'
	
ScaleScriptRunner >> initialize

	super initialize.
	system := ScaleSystemFacade new
	
ScaleScriptRunner >> run: aScript 

	 ^ Compiler
			evaluate: aScript
			for: self
			logged: false
```

```smalltalk
ScaleCommandLineHandler >> installSourceFile: aReference
		"Install the the source file given by aFileReference"
	
		" parse the code given in the source file"
		aReference readStreamDo: [ :stream |
			(stream peek = $#) ifTrue: [ 
				stream upTo: Character lf ].
		
			self 
				handleErrorsDuring: [
					Compiler evaluate: stream upToEnd.
					]
				reference: aReference
		].
```

```smalltalk
Object subclass: #ScaleSystemFacade
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'Scale'
	
ScaleSystemFacade >> stderr

	^ FileStream stderr

ScaleSystemFacade >> stdin

	^ FileStream stdin

ScaleSystemFacade >> stdout

	^ FileStream stdout
```

Our ScaleSystemFacade was now available for our scripts with the instance variable system

```smalltalk
#!./scale

system stdout << 'llamando a ls'.
system stdout cr.
```

## Download me!
----------------

## Coming next (soon)

We also included some OSProcess capabilities, but for that, you'll have to read the next post.

Bye!
Guille and Santi