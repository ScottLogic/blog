---
title: A Developer's intro to WebGL
date: 2014-03-11 00:00:00 Z
categories:
- Tech
author: amorgan
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/03/11/a-developers-intro-to-webgl.html
disqus-id: "/2014/03/11/a-developers-intro-to-webgl.html"
summary: Recently, I have been starting to get to grips with WebGL. Having little
  to no real previous experience with 3D graphics, there was a reasonably steep learning
  curve to overcome. So I thought I'd touch on a few of the basics here and share
  some resources that I found really useful.
---

Recently, I have been starting to get to grips with WebGL. Having little to no real previous experience with 3D graphics, there was a reasonably steep learning curve to overcome. So I thought I'd touch on a few of the basics here and share some resources that I found really useful.

## WEBGL OVERVIEW

WebGL is a JavaScript API that allows for the creation of 3D and 2D graphics within the browser. It renders on a <code>&lt;canvas&gt;</code> element as a drawing context, but provides low-level access to the GPU. The graphics can be made completely interactive; responding to keyboard and mouse events, as well as touch events on mobile devices.

There are tons of great resources out there to introduce the key concepts behind WebGl and 3D graphics in general. I found Luz Caballero's [introduction to WebGL]( http://dev.opera.com/articles/view/an-introduction-to-webgl/) particularly helpful in getting my head around precisely what is going on behind the scenes of all those amazing [WebGL examples](http://www.chromeexperiments.com/webgl/) on the web.

Basically, all graphics in WebGL are made up of vertices and fragments. Vertices are what you might expect; points with x, y and z coordinates defining their position. Fragments are in essence the individual pixels within triangles of vertices.

<img src="{{ site.baseurl }}/amorgan/assets/shaders.jpg" alt="vertices and fragments"/>        
<br>
<br>
So, to render a 3D image with WebGL, we essentially build up the image out of triangles. We tell WebGL where we want each vertex, how we want the vertices to be connected into triangles, and how we want both the vertices and the fragments between them to be shaded.

There’s a whole lot more to it than that, of course. So please check out some of the links throughout this post to get a more detailed explanation. You could also read the [WebGL specification]( http://www.khronos.org/registry/webgl/specs/latest/1.0/), if you want a **really detailed** explanation.

## WEBGL LIBRARIES

We’ve **very** briefly covered how WebGL 3D graphics are created. Which may seem simple enough, but in practice it involves several quite mathematical, and perhaps not very intuitive steps. So how does that scale to rendering cubes, or spheres, or [aquariums](http://webglsamples.org/aquarium/aquarium.html)? 

Short answer: a fair amount of work and usually the use of a library to abstract away some of the more tedious and repetitive tasks.

Using libraries, you can go from painstakingly crafting spheres out of triangles to just calling a few simple methods.  This also has the pleasant side effect of making your code a little bit nicer, and a lot shorter.

There are lots of WebGL libraries out there. A few worth looking at are:
*	[Three.js]( https://github.com/mrdoob/three.js#readme)
*	[PhiloGL]( http://www.senchalabs.org/philogl/)
*	[GLGE](http://www.glge.org/)

Check out [Paul Lewis’ tutorials](https://www.aerotwist.com/tutorials/) for more information on using libraries (Three.js  in this case). Incidentally, the tutorials on shaders are also worth a look.

## SPINNING SQUARES AND TRIANGLES

For a far more detailed walkthrough the principles behind WebGL and creating your first 3D graphics, I strongly recommend Giles Thomas’ ["Learning WebGL"]( http://learningwebgl.com/blog/) blog. The lessons are adapted from a popular series based around game development in OpenGL, and they cover everything from spinning squares to nicely lit, interactive globes and more.
