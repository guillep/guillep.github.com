---
external: false
draft: false
title: Recover a broken image with Oz
description: This post is a draft and won't be built.
date: 2013-08-26
---

While hacking the VM the other day, I went into a very special situation: I got an image that crashed on startup. And I had stuff without commit!! So I started the crusade to recover it.

I know that some time ago, people like <a href="http://seandenigris.com/blog/">Sean De Nigris</a> had the same problem and ended up hacking the VM to solve their problem. You can have an idea of what exactly happened by reading the <a href="http://forum.world.st/Oops-I-put-a-halt-in-a-startup-method-td3800163.html">original mailing list post</a>.

But doing that required debugging the vm at the bytecode level (that is, debugging each bytecode internally) until I reach my point and solve my problem.
<h2>The concrete situation</h2>
The last thing I executed in my broken image was the following two statements in one doit:

[code language="ruby"]
Smalltalk snapshot: true andQuit: true.
someObject doSomethingThatCrashesTheVM.
[/code]

So when my image was started, it executed all the startup code, returned to the context of the code above, and tried to send the <b>doSomethingThatCrashesTheVM</b> message to <b>someObject</b>, causing a crash.

I knew that Oz could do it, so I went into it.
<h2>The recovery environment</h2>
I needed to put my image in a place where I could fix it. And that place is an <i>object space</i>, which I am implementing in Oz. The idea is to put the broken image inside another image with an object space, so we can manipulate it freely, fix it, and restart it. With the Oz library and VM, creating the object space is as easy as:

[code language="ruby"]
objectSpace := Pharo20 loadFrom: 'broken.image'.
[/code]
<h2>The diagnostic</h2>
Once we have the <i>objectSpace</i> object, we need to understand how to solve our problem. So I wondered around by getting the scheduler of the loaded image, and looking at the active process.

[code language="ruby"]
ps := (objectSpace specialObjectsArray at: 4) value asSchedulerMirror.
activeProcess := ps activeProcess.
[/code]

And once we have the active process, we can have a look at its context and the method that is being executed. We can follow the sender chain until we reach the context with the problem:

[code language="ruby"]
cm := objectSpace
          fromRemoteCompiledMethod: activeProcess context sender method.
cm decompile ==&gt; ' DoIt
	Smalltalk snapshot: true andQuit: true.
	^ someObject doSomethingThatCrashesTheVM.
[/code]

Now that we are there, we have to fix it.
<h2>The medicine</h2>
There are many ways to manipulate the contexts and and processes to solve that. But there is also one that is really easy and simple.

We only need to change the <b>someObject</b> reference to nil. That way, we avoid the crash in the startup and obtain a debugger instead with a:

"Undefined Object does not understand doSomethingThatCrashesTheVM"

Nice! So, in order to do that, I needed to understand a bit how the code was compiled. I did it by sending a couple of messages to the compiled method, to understand its structure. Finally, I got the following conclusion: <b>someObject</b> was the first literal in the compiled method. And I fixed it:

[code language="ruby"]
association := cm literalAt: 4.
association instVarAt: 2 put: objectSpace nilObject.
[/code]

I restarted the image in the object space (with the so far ad-hoc method):

[code language="ruby"]
[[ objectSpace giveChanceToRun. true ] whileTrue: [ ]] forkAt: 80.
[/code]

So you make a loop and in each iteration you give the object space a window of time to run. And after that the broken image will appear before you (if you fixed it reasonably well) :).
<span style="line-height:1.714285714;font-size:1rem;">Then, I saved it with another name, restored manually the changes file (because my object spaces solution does not handle yet :)) and voilá. I had my image back again, with all my objects there. I and could commit :).</span>
