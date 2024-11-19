---
title: Porting Scratch To HTML5 From Flash - 2014 Intern Project
date: 2014-08-20 00:00:00 Z
categories:
- Tech
tags:
- Scratch
- Intern
- Flash
- HTML 5
- Javascript
author: jhill
layout: default_post
title-short: Starting from Scratch
oldlink: http://www.scottlogic.com/blog/2014/08/20/starting-from-scratch-2014-intern-project.html
disqus-id: "/2014/08/20/starting-from-scratch-2014-intern-project.html"
summary: We're the Scott Logic interns for Newcastle in 2014, and our project was
  to make a mobile-compatible version of the Scratch HTML5 player that allows offline
  access, and app-like immersion. This blog post is an overview of what we managed
  to achieve ...
---

We're the Scott Logic interns for Newcastle in 2014, and our project was to make a mobile-compatible version of the Scratch HTML5 player that allows offline access, and app-like immersion. This blog post is an overview of what we managed to achieve ...

And just to whet your appetite, here's a screenshot of the popular Doodle Jump game working on the HTML5 scratch player:

<a href="http://sl-scratch-app.herokuapp.com/scratch-player/11342979"><img src="{{ site.baseurl }}/jhill/assets/DoodleJump.png" /></a>


### What's Scratch?

[Scratch](http://scratch.mit.edu/) is a visual programming language created by MIT and aimed at children intended for making games and anything visual. A program in Scratch is called a project, and can be [shared via their website](http://scratch.mit.edu/explore) for others to enjoy and build upon (remix). It's used for a wide variety of projects, from [animation](http://scratch.mit.edu/projects/24065498/) and [games](http://scratch.mit.edu/projects/25165819/) to [newspapers](http://scratch.mit.edu/projects/24141789/) and [art](http://scratch.mit.edu/projects/25023898/), and even a [2D implementation of Minecraft](http://scratch.mit.edu/projects/10128407/).

A project is made up sprites, which contain scripts. These scripts are comprised of events (for example on project start, when a key is pressed, when a sprite starts as a clone of another sprite), with each event containing a stack (set) of blocks that will be executed when the event fires. Scratch includes a fairly comprehensive set of actions (for example a sprite can move to co-ordinates, play a sound, make a clone of itself, and more), conditional statements, loops, logic and custom blocks so a large variety of projects can be created. Even [projects](http://scratch.mit.edu/projects/23322186/) that let you build your own levels and games, or [game making games](http://scratch.mit.edu/projects/16511478/).

### What we've done

We've created a web front-end using [Angular.js](https://angularjs.org/) for people to enter in their username and choose a project to play from their collection of their own projects and the projects belonging to users that they're following (via server-side scraping). There is a set of options that allow the user to customise their experience (ie. auto-start the project, start the project in fullscreen mode, and hide the flags that start/stop the project).

For the player itself, we've allowed it to be scalable to fill the user's screen, so that it is easier to play on mobile devices. Through the creation of an application manifest, the projects themselves are able to be stored and played offline. However, because of difficulties with Safari, audio isn't available on the iOS platform (so you can't enjoy beauties such as [this](http://scratch.mit.edu/projects/23413051/) or [this](http://scratch.mit.edu/projects/11731917/)). We also allowed the user to save the webpage to their home screen (with the project's icon and name for the shortcut) so they can open it at their own convenience.

Many bugfixes have been applied on the player. Deprecated audio API calls have been updated to their newer equivalents, and many null pointers have been type-checked or their causes fixed. Alongside that, there have been fixes to sprite and colour collision detection to help ensure that they work as intended. Also, a basic fix was applied to GPU compositing to enable reporters to display their updated values, where the didn't previously.

One of the more curious bugs was that audio was playing back at a slightly higher frequency than what was expected. The project we were using as a base, [Dot Art](http://scratch.mit.edu/projects/23889125/), remained in sync to the slightly higher-pitched music, so it appeared to just be a frequency issue. Upon investigation, it appeared that the music *and* the Scratch player itself was running too quickly (yet intriguingly, at the same rate). The audio turned out to be pretty straightforward -- the original sample rate returned by the Scratch API was 22050Hz, which was interpolated to 44100Hz by the web browser. However, the Web Audio API in the browser was at 48000Hz. This meant that the AudioNode was playing 8% faster than it should have been, which was easily fixed by adjusting the playback rate to fit the expected duration by using sample rate and number of samples, since the frequency was a read-only object.

<iframe width="560" height="315" src="//www.youtube.com/embed/E00iQkXyz_8" frameborder="0"> </iframe>

This then meant that the playback rate of the player itself was out of sync with the audio. This turned out to be the fact that in the Scratch player, threads are only executed for 75% of the time between frames (so 25ms out of 33.3ms for 30 FPS), which hadn't yet been added to the HTML5 player. Have a look at the before and after video for the Surface Pro 2 to see this in action (turn your audio up):

<iframe width="560" height="315" src="//www.youtube.com/embed/W5Y4JFqLSLQ" frameborder="0"> </iframe>

We've performed optimisations to the player itself. For example, when two sprites were colliding, an off-screen HTML5 canvas was created that was the size of the stage, and that whole canvas was sampled for collision detection. Now, the canvas is just the size of the intersection between the sprites' rectangles, and samples only that intersection for collisions, which reduced the time required for collision detection by 66%. Have a look at the before and after on the Galaxy Note 10.1 to see the rather hefty performance improvements we've been able to bring.

A similar approach was performed to colour collision, with a few differences. Previously, all sprites were rendered to the whole stage canvas and the sprite checking for the collision (the target) was actually on a separate canvas, and the colour values were only checked when the corresponding pixel in the separate canvas had an alpha value greater than 0. Have a look at the code below:

{% highlight javascript %}var stageColorHitTest = function(target, color) {
	    var r, g, b;
	    r = (color >> 16);
	    g = (color >> 8 & 255);
	    b = (color & 255);

	    var targetCanvas = document.createElement('canvas');
	    targetCanvas.width = 480;
	    targetCanvas.height = 360;
	    var targetTester = targetCanvas.getContext('2d');
	    target.stamp(targetTester, 100);

	    var stageCanvas = document.createElement('canvas');
	    stageCanvas.width = 480;
	    stageCanvas.height = 360;
	    var stageContext = stageCanvas.getContext('2d');

	    $.each(runtime.sprites, function(i, sprite) {
	        if (sprite != target)
	            sprite.stamp(stageContext, 100);
	    });

	    var hitData = stageContext.getImageData(0, 0, stageCanvas.width, stageCanvas.height).data;
	    var meshData = targetTester.getImageData(0, 0, targetCanvas.width, targetCanvas.height).data;
	    var pxCount = meshData.length;
	    for (var i = 0; i < pxCount; i += 4) {
	        if (meshData[i+3] > 0 && hitData[i] == r && hitData[i+1] == g && hitData[i+2] == b)
	            return true;
	    }
	    return false;
	};{% endhighlight %}

Our new approach was to render only the portion of the canvas that was the size of the target sprite, and only rendering the other sprites if their rectangles intersected with the target's. Not only that, but after drawing all sprites, we also changed the globalCompositeOperation to destination-in, removing the need for the second canvas as the shape of the target sprite was being overlaid on the original canvas, removing pixels not part of that shape. Have a gander at the improved version:

{% highlight javascript %}var stageColorHitTest = function(target, color) {

	    var r, g, b;
	    r = (color >> 16 & 255);
	    g = (color >> 8 & 255);
	    b = (color & 255);

	    var targetRectangle = target.getRect();

	    // Removed target tester and stamped the sprite directly onto the stage canvas, using destination-in so only the sprite appears

	    var stageCanvas = document.createElement('canvas');
	    stageCanvas.width = targetRectangle.width;
	    stageCanvas.height = targetRectangle.height;
	    var stageContext = stageCanvas.getContext('2d');
	    stageContext.translate(-targetRectangle.left, -targetRectangle.top);

	    $.each(runtime.sprites, function(i, sprite) {
	    if (sprite != target && sprite !== 'undefined' && typeof(sprite) == 'object' && sprite.constructor == Sprite && sprite.getRect().intersects(targetRectangle))
        {
            if (sprite.visible == true)
            {
                sprite.stamp(stageContext, 100);
            }
        }
	    });

	    // Change the composite operation so the canvas only has data within the target's shape 
	    stageContext.globalCompositeOperation = "destination-in";
	    target.stamp(stageContext, 100);

	    var hitData = stageContext.getImageData(0, 0, stageCanvas.width, stageCanvas.height).data;
	    var pxCount = hitData.length;
	    for (var i = 0; i < pxCount; i += 4) {
	        if (hitData[i+3] > 0 && hitData[i] == r && hitData[i+1] == g && hitData[i+2] == b)
	        {
	            return true;
	        }
	    }

	    return false;
	};{% endhighlight %}

Alongside that, many other optimisations were made, including changing less optimal `for x in y` loops to `for` loops, and changing `for` loops to not look up a length parameter before every iteration, which made a small but measurable difference to the performance.

A few functions have also been implemented with the player, for example `stopScripts`, `call`, `createCloneOf`, alongside various volume setting and getting functions, making the HTML5 player more versatile and usable, and making more projects work with the player. Have a look at these new features of the Scratch player in the comparison of a game of Breakout, which utilises cloning and calling:

<iframe width="560" height="315" src="//www.youtube.com/embed/Ml7XtjCblmA" frameborder="0"> </iframe>

The server was powered by [Node.js](http://nodejs.org/), with various plugins to help achieve our aim. The server's primary jobs were to serve files to the client, generate application cache manifests for projects, and scrape the Scratch website for a user's projects and followers.

We've also made a few of our own projects, like [Atari Breakout](http://scratch.mit.edu/projects/24796179/) and if that's too complicated for you, [Pong](http://scratch.mit.edu/projects/24824122/).

### What's left to do

~making it work!~

There's still a fair bit left to do with the Scratch HTML5 player. The main focus is bug fixing and optimisations, as a fair portion of CPU time is spent on collision detection. When the target platform is mobile, any optimisations would greatly improve the player experience.
What would also be a good idea is implementation of a keyboard or some limited means of controls, like left, right, up and down arrow keys which the original HTML5 player had. This would allow the user to use other means of input other than just touch, which would in turn allow for larger variety of projects. Special effects like mosaic/whirl also don't exist (with no sign of being implemented).

Canvas operations, such as drawImage and getImageData are the limiting factors on mobile, which can't be sped up that much more due to it more becoming an issue of the implementation in the web browser, since mobile canvas operations are far less efficient than on desktop.

Since the primary browser engine on mobile is WebKit, most of these changes are targeted specifically towards that. As a result, other browser engines may not perform as intended.

The player still has bugs, for example some mouse clicks don't work (specifically the check if the mouse is over/down, and not the "click" action itself). Text in sprites is also broken. However, this is due to the way Scratch generates SVG files. It also sometimes just doesn't work. Periodically, the Scratch API doesn't allow cross-origin requests to go through, or the requests fail with codes 403/404, and some means to cope with this (like server-side caching/proxying) could be implemented to ensure the experience is consistent. Cross-browser compatibility leaves something to be desired.

### In conclusion

We've accomplished a fair bit, allowing Scratch projects to be playable offline from the home screen, giving an app-ish feel to it. Adding features to the interpreter and performing optimisations helped create a player that was so much more efficient on mobile, with a game going from unplayable to playable because of collision detection changes. There's still a great deal to do, as the HTML5 player is *very* rough-around-the-edges and inefficient. You can try out what we've done:

* [Web front-end](http://sl-scratch-app.herokuapp.com/)
* HTML5 Player:
 * Our games: [Breakout](http://scratch.mit.edu/projects/24796179/), [Pong](http://sl-scratch-app.herokuapp.com/scratch-player/24824122), [Countdown Numbers Game](http://scratch.mit.edu/projects/25671398/), [Countdown Letters Game](http://scratch.mit.edu/projects/25665963/)
 * [Super Waffle Galaxy](http://sl-scratch-app.herokuapp.com/scratch-player/23824657) ([Touch Version](http://sl-scratch-app.herokuapp.com/scratch-player/25165819)) by CANSLP
 * [Super Hexagon](http://sl-scratch-app.herokuapp.com/scratch-player/10711405) ([Touch Version](http://sl-scratch-app.herokuapp.com/scratch-player/25505324/)) by lolwel21
 * [Doodle Jump](http://sl-scratch-app.herokuapp.com/scratch-player/11342979) ([Touch Version](http://sl-scratch-app.herokuapp.com/scratch-player/25321688)) by TheSaint


Our code (and struggles with Git) is available for all to see on [GitHub](http://www.github.com/). If you want to continue our work (without the app-specific features like manifest generation, player scaling, etc.), choose the Scott Logic fork of the Scratch HTML5 player below. The version with manifest generation and player scaling is on WPFerg.

* Web front-end: [https://github.com/WPFerg/scratch-app/](https://github.com/WPFerg/scratch-app/)
* HTML5 Player: [https://github.com/WPFerg/scratch-html5/](https://github.com/WPFerg/scratch-html5/)
* Scott Logic Scratch HTML5 Fork: [https://github.com/ScottLogic/scratch-html5](https://github.com/ScottLogic/scratch-html5)
* Scratch HTML5 Player by LLK: [https://github.com/LLK/scratch-html5/](https://github.com/LLK/scratch-html5/)

Will Ferguson & James Hill























