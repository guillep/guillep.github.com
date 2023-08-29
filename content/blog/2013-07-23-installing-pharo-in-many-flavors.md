---
external: false
draft: false
title: Installing Pharo in many flavors
description: This post is a draft and won't be built.
date: 2013-07-23
---

Buon giorno!

In the recent times, there appeared many many ways to leverage the installation and deploy of [Pharo](http://www.pharo-project.org/home) applications. These installation approaches enhance significantly the experience of using Pharo, by simplifying either dependency management with OS libraries, enabling to write deploy bash scripts or loading prebuilt images for any (and many) taste(s).

However, if you are not in the [Pharo mailing lists](http://www.pharo-project.org/community), you probably have not heard about many of these installation mechanisms, and therefore, you cannot enjoy them. So, let's summarize a bit some of these mechanisms, at least the ones I know. If you know some more, contact me so we can include it.
### Manual download from the webpage
Downloading Pharo manually is the easiest but more primitive approach. Proceed to the download page [1] and download the flavor of Pharo you like the most. You will find in here the 1.3, 1.4 and 2.0 releases, plus the option to load the latest (still in development) version of Pharo 3.0.

Focusing on what is available for Pharo 2.0, you can either install

- **under the category "Pharo Installers":** a package specific for your operative system containing both v<em>irtual machine</em> and the <em>image</em> with the runtime and development environment
- **under the category "Custom Downloads":** the possibility to download them by separate. This option is useful if you already have a <em>virtual machine</em> and only want a new *image* to play with.

[1] <a href="http://www.pharo-project.org/pharo-download">http://www.pharo-project.org/pharo-download</a>
### Manual download from the file server
In the Pharo file server[2] you will find available the virtual machine and image releases as well as other resources to download. You can use these urls to create your custom download scripts.

[2] [http://files.pharo.org/](http://files.pharo.org/)
### Virtual Machine PPA for Ubuntu linux
There is a PPA available for Ubuntu users (probably it works also for any distribution using apt-get package manager) which is in charge of downloading the <em>virtual machine</em> and its dependencies, simplifying its installation and deploy. We thank Damien Cassou for taking finally the initiative of creating the PPA!

```bash
#install the PPA repository
sudo add-apt-repository ppa:pharo/stable
sudo apt-get update

#install pharo vm core
sudo apt-get install pharo-vm-core

#install pharo vm for desktop (with graphical dependencies)
sudo apt-get install pharo-vm-desktop
```
### ZeroConf scripts
The ZeroConf scripts[3] are already built bash scripts easing the download and installation of pharo. They are scripts served by get.pharo.org which can be parameterized for getting the pair vm/image you want.

Their usage, as written in the ZeroConf webpage can be resumed as

```bash
curl url | bash
#or if curl is not available:
wget -O- url | bash
```

where url is replaced by the formula vmVersion|imageVersion|vmVersion+imageVersion

For example, some valid usages of ZeroConf are

```bash
#downloading latest 3.0
curl get.pharo.org/alpha | bash

#downloading stable 2.0 + vm
curl get.pharo.org/20+vm | bash

#downloading latest non stable vm
curl get.pharo.org/vmLatest | bash
```

You can look for the valid values in the ZeroConf page [3]. These scripts are currently heavily used by the [ci infrastructure of pharo](https://ci.inria.fr/pharo/). We thank Camillo Bruni for pushing this harder!

In fact, this is the way I download my own images right now, because the url is easy to memorize and using the terminal is pretty straightforward.

[3] [http://get.pharo.org/](http://get.pharo.org/)

### Pharo Launcher
The Pharo Launcher is an application to download and manage prebuilt and custom Pharo images. Below I paste the release notes from the first release:

"Erwan and I are proud to announce the first release of the Pharo
Launcher, a cross-platform application that

- lets you manage your Pharo images (launch, rename, copy and delete);
- lets you download image templates (i.e., zip archives) from many
different sources (Jenkins, files.pharo.org, and your local cache);
- lets you create new images from any template.

The idea behind the Pharo Launcher is that you should be able to
access it very rapidly from your OS application launcher. As a result,
launching any image is never more than 3 clicks away.

Download:
[https://ci.inria.fr/pharo-contribution/job/PharoLauncher/PHARO=30,VERSION=bleedingEdge,VM=vm/lastSuccessfulBuild/artifact/PharoLauncher.zip](https://ci.inria.fr/pharo-contribution/job/PharoLauncher/PHARO=30,VERSION=bleedingEdge,VM=vm/lastSuccessfulBuild/artifact/PharoLauncher.zip)

Please report bugs on the 'Launcher' project at [https://pharo.fogbugz.org](https://pharo.fogbugz.org)

You can contribute to this project. All classes and most methods are
commented. There are unit tests. Please contribute!

Source code: [http://www.smalltalkhub.com/#!/~Pharo/PharoLauncher](http://www.smalltalkhub.com/#!/~Pharo/PharoLauncher)
CI: [https://ci.inria.fr/pharo-contribution/job/PharoLauncher](https://ci.inria.fr/pharo-contribution/job/PharoLauncher)
"

![Pharo Launcher screenshot](http://playingwithobjects.files.wordpress.com/2013/07/launcher_screenshot.png)

The Pharo launcher is an initiative of Erwan Douaille and Damien Cassou. And of course, you can contribute to it. In their release notes they added some points they would like to enhance in this project:

- check if a template is already downloaded before downloading it
- add a preference mechanism (for, e.g., quit after launch, definition of your own template groups, location of downloaded templates and images)
- put the launcher in the Pharo Ubuntu package so that the launcher becomes a registered application of the system ([https://launchpad.net/~pharo/+archive/stable](https://launchpad.net/~pharo/+archive/stable))
- make sure the pharo launcher does not load your personal scripts (like fonts and MC configuration)
- add a toolbar to enhance the discoverability of the features (currently everything is in contextual menus)
- make sure rename and copy actions propose default values
- make sure no debugger pops up when a user press cancels or enter an invalid name
- propose multiple kinds of sorting (last used, most frequently used, alphabetically on the name)
- give some information about each template (build date, pharo version)

### Conclusion
Pharo is growing, and getting sexy. And now you have easy deploy, and it will get only easier in the future. What are you waiting?

```bash
#Just do this!
curl get.pharo.org/20+vm | bash
./pharo-ui Pharo.image
```
