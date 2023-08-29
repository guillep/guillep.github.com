---
external: false
draft: false
title: Customizing ZeroConf scripts
description: This post is a draft and won't be built.
date: 2013-07-30
---

As you may already know, ZeroConf scripts are bash scripts that <a>ease the installation of a Pharo environment</a>. A funny thing about these ZeroConf scripts is that they are seen as bash scripts by a bash terminal, and as simple and minimal html pages by a web browser. These scripts are extensively used to simplify the configuration of Pharo CI jobs. They allow you to easily download many versions of the Pharo image and VM.

As I'm working for my Phd, and have a custom version of my virtual machine and image, and also want to make use of the advantages our CI server provides, I wanted to build my own ZeroConf scripts specialized for my needs. I also heard recently on the pharo mailing list that there was some work on customizing ZeroConf scripts[1] for Moose[2]. So I wanted to do it as well for my project :).

[1] [http://get.moosetechnology.org/](http://get.moosetechnology.org/)
[2] [http://www.moosetechnology.org/](http://www.moosetechnology.org/)
## Downloading the ZeroConf package
The ZeroConf scripts are generated automatically by the ZeroConf Pharo package. You can find this package in [2]. To download the current version, you just have to execute the following piece of code in a workspace:

```smalltalk
Gofer it
	smalltalkhubUser: 'Pharo' project: 'ZeroConf';
	package: 'ZeroConf';
	loadVersion: '1.0'
```

This code snippet will install in your image the ZeroConf package for the 1.0 version, containing the script generator, and some tests that are not currently working :).
[2] [http://www.smalltalkhub.com/#!/~Pharo/ZeroConf](http://www.smalltalkhub.com/#!/~Pharo/ZeroConf)
## Getting what's inside ZeroConf
The ZeroConf package is pretty small and simple. There is an abstract class AbstractZeroConfBashScript implementing most of the script generation and bash writing utils. Its subclasses will implement the concrete script generation. Current implementation includes three main classes below the AbstractZeroConfBashScript hierarchy, implementing a composite pattern:

- **ZeroConfImageScript**: Generates scripts in charge of downloading image files.
- **ZeroConfVMScript**: Generates scripts in charge of downloading Virtual Machine files (and source files).
- **ZeroConfCombinedScript**: Generates scripts that combine several scripts. It will point to its combined scripts and downloading it means to download them all.

![](http://playingwithobjects.files.wordpress.com/2013/07/zeroconf.png)

## Customizing our ZeroConf scripts

As you can see in the picture, in order to customize the ZeroConf scripts, you have to create your own subclasses and overriding the correct hooks.

### Customizing an image script
A custom image script is defined by a subclass of ZeroConfImageScript. ZeroConfImageScript already defines some image common behavior, such as the **release** number, which we will use in our script.

```smalltalk
ZeroConfImageScript subclass: #OzZeroConfImageScript
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'OurZeroConf'
```

Then we override the methods that tell some information about the files to download:

- **OzZeroConfImageScript>>imageName**: The name of the image and changes files
- **OzZeroConfImageScript>>imageUrl**: The url of the image zip, instance of ZnUrl
- **OzZeroConfImageScript>>defaultBaseName**: The baseName of the script
- **OzZeroConfImageScript class>>baseUrl**: The base url where the scripts are found, instance of ZnUrl
- **OzZeroConfImageScript class>>fileBaseUrl**: The base url where the files the scripts will download are found, instance of ZnUrl


I implemented them in my class as follows
```smalltalk
OzZeroConfImageScript>>imageName
	^'Oz'

OzZeroConfImageScript>>imageUrl
	^ self fileBaseUrl / 'image' / self release asString / self imageFileName / 'download'

OzZeroConfImageScript>>imageFileName
	^'Oz-image-', self release asString , '.zip'

OzZeroConfImageScript>>defaultBasename
	^ self imageName, self release

OzZeroConfImageScript class>>fileBaseUrl
	^ 'https://sourceforge.net/projects/ozobjectspaces/files' asZnUrl

OzZeroConfImageScript class>>baseUrl
	^ self fileBaseUrl / 'get'
```

I also extended my script so it generates a custom html title and uses my combining script when combining:
```smalltalk
OzZeroConfImageScript>>htmlTitle
	^ self imageName, ' Zeroconf Script'

OzZeroConfImageScript>>defaultCombiningScript
	^ OzZeroConfCombinedScript
```

Finally, I created a convenience method for creating a script corresponding to the 1.0 version of my custom image.
```smalltalk
OzZeroConfImageScript class>>oz10
	^self new
		release: '1.0';
		yourself
```

Now you can try generating your script in a workspace,
```smalltalk
OzZeroConfImageScript oz10 generate
```

and see the generated results in your working directory!

### Customizing a vm script
A custom vm script is defined by a subclass of ZeroConfVMScript. ZeroConfVMScript defines, as its image friend, some vm common behavior, such as the **release** number and virtual machine **type**(i.e., if it is a jitted vm or not), which we will use in our script.

```smalltalk
ZeroConfVMScript subclass: #OzZeroConfVMScript
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'OurZeroConf'
```

Then we override the methods that tell some information about the files to download:

- **OzZeroConfVMScript>>binaryName**: The name of the vm binary name
- **OzZeroConfVMScript>>binaryNameLinux**: The name of the vm binary name in linux, which tends to be different
- **OzZeroConfVMScript>>vmUrl**: The url of the vm zip, instance of ZnUrl
- **OzZeroConfVMScript>>defaultBaseName**: The baseName of the script
- **OzZeroConfVMScript class>>baseUrl**: The base url where the scripts are found, instance of ZnUrl
- **OzZeroConfVMScript class>>fileBaseUrl**: The base url where the files the scripts will download are found, instance of ZnUrl


I implemented them in my class as follows
```smalltalk
OzZeroConfVMScript>>binaryName
	^'ozstack'

OzZeroConfVMScript>>binaryNameLinux
	^self binaryName

OzZeroConfVMScript>>vmUrl
	^self fileBaseUrl asString, '/vm/', self release asString,'/', self vmFileName, '/download'

OzZeroConfVMScript>>vmFileName
	^'OzVm-${OS}-', self release asString , '.zip'

OzZeroConfVMScript class>>fileBaseUrl
	^ 'https://sourceforge.net/projects/ozobjectspaces/files' asZnUrl

OzZeroConfVMScript class>>baseUrl
	^ self fileBaseUrl / 'get'
```

I also extended my script so it uses my combining script when combining:
```smalltalk
OzZeroConfVMScript>>defaultCombiningScript
	^ OzZeroConfCombinedScript
```

Finally, I created a convenience method for creating a script corresponding to the 1.0 version of my custom vm.
```smalltalk
OzZeroConfVMScript class>>ozvm10
	^self new
		type: 'oz';
		release: '1.0';
		yourself
```

Now you can try generating your script in a workspace,
```smalltalk
OzZeroConfVMScript ozvm10 generate
```

and see the generated results in your working directory!

### Customizing a combined script
A combined script is the one we use to combine several scripts. It is defined by a subclass of ZeroConfCombinedScript.

```smalltalk
ZeroConfCombinedScript subclass: #OzZeroConfCombinedScript
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'OurZeroConf'
```

Then we override the methods that tell some information about the files to download:

- **OzZeroConfCombinedScript class>>baseUrl**: The base url where the scripts are found, instance of ZnUrl
- **OzZeroConfCombinedScript class>>fileBaseUrl**: The base url where the files the scripts will download are found, instance of ZnUrl


I implemented them in my class as follows
```smalltalk
OzZeroConfCombinedScript class>>fileBaseUrl
	^ 'https://sourceforge.net/projects/ozobjectspaces/files' asZnUrl

OzZeroConfCombinedScript class>>baseUrl
	^ self fileBaseUrl / 'get'
```

As you can see, my methods baseUrl and fileBaseUrl are always the same in all scripts. I extracted them into another class later, but keep the code here as is for clarity.

I also extended my script so it uses my combining script when combining and the html title:
```smalltalk
OzZeroConfCombinedScript>>defaultCombiningScript
	^ OzZeroConfCombinedScript

OzZeroConfCombinedScript>>htmlTitle
	^ self scripts first htmlTitle
```

## Integrating everything and automating generation

As I already showed you, every script understands the message **#generate** to generate itself. However, we may want to generate many scripts, and combine them. The ZeroConf infrastructure already provides for that the ZeroConfCommandLineHandler. The ZeroConfCommandLineHandler is a command line handler that knows which are the scripts we want to generate, combines them appropriately and generates them. So we will subclass from ZeroConfCommandLineHandler and specialize it to fulfill our needs.

```smalltalk
ZeroConfCommandLineHandler subclass: #OzZeroConfCommandLineHandler
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'OzZeroConf'
```

Once we have it, we configure it as a command line handler specifying its command name and description:
```smalltalk
OzZeroConfCommandLineHandler class>>commandName
	^ 'ozzeroconf'

OzZeroConfCommandLineHandler class>>description
	^ 'Generate Oz zeroconf bash scripts'
```

And finally we specialize it to tell it about our scripts:
```smalltalk
OzZeroConfCommandLineHandler>>defaultScript
	^ self defaultImage, self defaultVM

OzZeroConfCommandLineHandler>>defaultImage
	^ OzZeroConfImageScript oz10

OzZeroConfCommandLineHandler>>defaultVM
	^ OzZeroConfVMScript ozvm10

OzZeroConfCommandLineHandler>>imageScripts
	^ { 
		OzZeroConfImageScript oz10.
	}

OzZeroConfCommandLineHandler>>vmScripts
	^ { 
		OzZeroConfVMScript ozvm10
	}

OzZeroConfCommandLineHandler>>indexScriptExamplesHtml
	^ ''
```

Now we have our command line handler, we can test it and make it generate our scripts:

```smalltalk
OzZeroConfCommandLineHandler new
	commandLine: CommandLineArguments new;
	generateScripts
```

Finally, if you have all this code in your image, you can just activate it through the command line thanks to the command line handler!

```bash
./pharo PharoMyZeroConf.image ozzeroconf
```

And look at the results. Upload your files, archive them, and use them :).

Guille
