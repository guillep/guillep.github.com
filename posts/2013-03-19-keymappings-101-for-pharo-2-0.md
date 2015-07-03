---
layout: post
title: Keymappings 101 - for Pharo 2.0
categories:
- Pharo
- Smalltalk
tags:
- command keys
- dynamic languages
- Keymappings
- meta keys
- Object oriented
- OOP
- Pharo
- Shortcuts
- software
- technology
- ui library
status: publish
type: post
published: true
meta:
  _publicize_pending: '1'
  _wpas_done_1260342: '1'
  _wpas_done_1260340: '1'
  _wpas_mess: ! 'Keymappings 101 - for #Pharo 2.0 http://wp.me/p2tOYl-2B @pharoproject'
  _wpas_skip_1260342: '1'
  publicize_twitter_user: GuillePolito
  _publicize_done_external: a:1:{s:7:"twitter";a:1:{i:93753233;b:1;}}
  publicize_reach: a:2:{s:7:"twitter";a:1:{i:1260342;i:157;}s:2:"wp";a:1:{i:0;i:8;}}
  tagazine-media: a:7:{s:7:"primary";s:70:"http://playingwithobjects.files.wordpress.com/2013/03/sans-titre-1.png";s:6:"images";a:1:{s:70:"http://playingwithobjects.files.wordpress.com/2013/03/sans-titre-1.png";a:6:{s:8:"file_url";s:70:"http://playingwithobjects.files.wordpress.com/2013/03/sans-titre-1.png";s:5:"width";i:512;s:6:"height";i:512;s:4:"type";s:5:"image";s:4:"area";i:262144;s:9:"file_path";b:0;}}s:6:"videos";a:0:{}s:11:"image_count";i:1;s:6:"author";s:8:"35633512";s:7:"blog_id";s:8:"36660125";s:9:"mod_stamp";s:19:"2013-03-19
    16:23:29";}
  _wpas_skip_1260340: '1'
  _wpas_done_3194664: '1'
  _wpas_skip_3194664: '1'
  _elasticsearch_indexed_on: '2013-03-19 16:18:05'
---
<img alt="Pharo" src="http://playingwithobjects.files.wordpress.com/2013/03/sans-titre-1.png?w=300" width="210" height="210" />

Pharo 2.0 release includes the Keymappings library. Keymappings is a library for configuring shortcuts for the current UI library (Morphic). It models concepts like: shortcuts, key combinations, event bubbling. It is a very simple library which I'll introduce gradually in this post.

Key combinations
----------------

Keymappings main task is it's ability to associate a key combination to an action. So we have to build up those key combinations. The simplest key combination is the one that gets activated when a single key is pressed. We call these combinations <strong>single key combinations</strong><strong>:</strong>

{% highlight smalltalk %}
$a asKeyCombination. -> "single key combination for A key."
Character cr asKeyCombination. -> "single key combination for  key."
{% endhighlight %}


Although, usually key combinations get a bit more complex. It is very common to combine single keys with <strong>meta keys or modifiers</strong>. These meta keys or modifiers are the well known ctrl, shift, alt and command keys. To build a <strong>modified key combination</strong> we can do as follows:

{% highlight smalltalk %}
$a ctrl. -> "a modified key combination for Ctrl+A"
$a ctrl shift. -> "a modified key combination for Ctrl+Shift+A"
{% endhighlight %}

<address>It is important to notice that all key combinations are not case sensitive. It takes <strong>a</strong> and <strong>A</strong> characters as the same, since they are <strong>the same key</strong>.</address>Have you ever used emacs, Eclipse or Visual Studio? Then you probably know sequences of key combinations that launch one only action. Like <strong>Alt+Shift+X, T </strong>(to run JUnit tests in eclipse)? So keymappings can do that too:

{% highlight smalltalk %}
$a command shift, $b shift. -> "key sequence (Cmd+Shift+A, Shift+B)"
{% endhighlight %}


Sometimes, you want to configure an action to be activated in two different cases. Those are Keymapping <strong>options</strong>, and get activated when one of the options gets activated:

{% highlight smalltalk %}
$a command | $b command. -> "key combination (Cmd+A or Cmd+B)"
{% endhighlight %}


Finally, since Pharo is a cross platform system and it is important to provide a good user experience by with the most suitable shortcut layout, keymapping implements <strong>platform specific shortcuts</strong>, which get activated only when running in the specific platform:

{% highlight smalltalk %}
$a command win | $b command unix. -&gt; &quot;Cmd+A on windows, but Cmd+B on unix&quot;
{% endhighlight %}

<h2>Shortcut configurations</h2>
Now you know how to build key combinations for your purposes, you probably want to go to the action. Map those combinations to actions and make them work!
<h3>Single shortcut configuration</h3>
The simplest way to attach a shortcut to a morph is by sending him the #on:do: message. The first argument expected is a key combination and the second one is an action. In the example below, a workspace is created with two shortcuts:
-<span style="line-height:14px;">when Cmd+Shift+A is pressed, the workspace is deleted</span>
-when Cmd+Shift+D is pressed, an information growl should appear yelling 'this shortcut works!'

{% highlight smalltalk %}
w:= Workspace new.
morph := w openLabel: 'keymapping test'.
morph on: $a shift command do: [ morph delete ].
morph on: $d shift command do: [ UIManager default inform: 'this shortcut works!' ].
{% endhighlight %}


Easy, huh? So let's move on...
<h3>Shortcut categories</h3>
Sometimes you want to group and organize shortcuts in a meaningful way and apply them all together on a morph. Sometimes you want some morphs from different hierarchies to share the same group of shortcuts easily. Those groups of shortcuts are what keymapping calls <b>Categories</b>. A category is a group of shortcuts, so far (will change in the future) defined statically by using a <b>keymap</b> pragma on class side:

{% highlight smalltalk %}
&quot;defining a category&quot;
SystemWindow class&gt;&gt;buildShortcutsOn: aBuilder
    &lt;keymap&gt;
{% endhighlight %}

A class side method marked as &lt;keymap&gt; will be called with a builder object, which can be used to define a named set of shortcuts:


{% highlight smalltalk %}
SystemWindow class>>buildShortcutsOn: aBuilder
    <keymap>
    (aBuilder shortcut: #close)
        category: #WindowShortcuts
        default: $w ctrl | $w command mac
        do: [ :target | target delete ]
        description: 'Close this window'.
{% endhighlight %}

Shortcuts defined through the builder specify the name of the category they belong to, a default key combination, an action, and a description. All this metadata is there to be used as settings in the future.

Finally in order to get your morph handle those shortcuts you can use the #attachKeymapCategory: message as in:


{% highlight smalltalk %}
w:= Workspace new.
morph := w openLabel: 'keymapping test'.
morph attachKeymapCategory: #Growling.
{% endhighlight %}

<h2>Bubbling</h2>
Keymappings' shortcuts bubble to their parent if not handled, up until the main world morph. That has two main consequences:
-Shortcuts for your application can be designed in a hierarchical way and;
-Every time a shortcut does not work for you, it means that a morph below you has handled it ;) (be careful with text editors that handle loooots of key combinations)

<h2>Future work</h2>
So far, so good, but there is some plan on Keymappings for Pharo 3.0 development, which I can anticipate:
-<span style="line-height:1.714285714;font-size:1rem;">Some API changes: #on:do: can be confused with exception or announcement handling. #asShortcut will probably be properly renamed as #asKeyCombination. There is an inconsistency between the #command and #ctrl messages...</span>
-<span style="line-height:1.714285714;font-size:1rem;">A lot of renames and new comments :)</span>
-<span style="line-height:1.714285714;font-size:1rem;">Spread it all over the system</span>
-<span style="line-height:1.714285714;font-size:1rem;">Make keymap categories first class objects, not any more a symbol ;)</span>

à la prochain!
Guille
