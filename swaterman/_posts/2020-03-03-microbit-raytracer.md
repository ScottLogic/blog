---
published: true
author: swaterman
layout: default_post
title: "3D Rendering on a Children's Toy"
summary: "I recently got the chance to play around with a BBC Micro:Bit - an educational toy aimed at helping kids learn to program. It's designed to do a lot of things, but 3D rendering isn't one of them."
summary-short: "The BBC Micro:Bit is designed to do a lot of things - but 3D rendering isn't one of them."
categories:
  - Tech
tags:
  - optimisation
  - javascript
  - micro:bit
  - hacks
image: swaterman/assets/microbit-raytracer/raytrace-6.jpg
---

The [BBC Micro:Bit](https://microbit.org/) is a single-board computer that aims to help children learn to code.
It has 16KB of RAM, a 16MHz processor, and a 25 pixel "screen" (which is just a 5x5 LED array).
On their website, they propose [lots of fun ideas that you can try](https://makecode.microbit.org/projects).

For *some reason*, they don't suggest trying to implement a ray tracer - an algorithm which simulates light rays to render a 3D scene.
That may have something to do with the fact that [ray tracing is incredibly slow, even on fast computers](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)#Disadvantages) and [Pixar has entire supercomputers dedicated to it](https://sciencebehindpixar.org/pipeline/rendering).
Nonetheless, I like a challenge!

## Show me!

I don't want to keep you waiting, so here's the end result.
The Micro:Bit is rendering a pyramid, with two bright red sides and two dark red sides.
You can turn the camera by tilting, and move it with the buttons.

<iframe width="100%" height="420" src="https://www.youtube-nocookie.com/embed/mtHFzrI7zEE" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>

Of course, the best bit about the Micro:Bit is its [scratch-like, blocks-based IDE](https://makecode.microbit.org/#editor).
It has the killer feature of letting you convert a program back and forth between blocks and JavaScript - which I couldn't resist.
Click the image to see a full-quality version.

[![The image is zoomed out so much that you can barely tell what's going on. It is clear that the blocks-based IDE was not designed for this.]({{ site.github.url }}/swaterman/assets/microbit-raytracer/blocks.jpg "Click me to see the full resolution")](http://microbit-raytracer.stevenwaterman.uk/blocks.html)

The code is available [on GitHub](https://github.com/stevenwaterman/microbit-raytracer).
You can try it out for yourself [in the official emulator](https://makecode.microbit.org/_dRJ72yCK0V6E) or [in my custom-made HTML test bench](http://microbit-raytracer.stevenwaterman.uk/index.html) (which generated the hi-res images in the top left of the video).

The remainder of this post discusses more about the Micro:Bit, and explains what a ray tracer actually is and how it works.

## A :bit more about the Micro:Bit

I apologise for that subheading...

The [BBC Micro:Bit](https://microbit.org/) is a single-board computer, like a [Raspberry Pi](https://www.raspberrypi.org/) or [Arduino](https://www.arduino.cc/).
It was announced March 2015 and released February 2016, costing under £15.
For that, you get a pretty impressive [feature list](https://microbit.org/guide/features/):

* 16MHz ARM Cortex-M0 processor
* 256KB nonvolatile storage and 16KB RAM
* Power via USB or Battery
* 25 LEDs
* Radio & Bluetooth
* 2 programmable buttons
* Accelerometer, Compass, Light & Temperature sensors
* 3 general purpose input/output (GPIO) pins
* 3V 90mA power & ground for accessories

![A picture of the Micro:Bit and its packaging. It has a 5x5 array of LEDs in the middle, with a button either side.]({{ site.github.url }}/swaterman/assets/microbit-raytracer/microbit.jpg "It's no supercomputer")

There are many ways to program the Micro:Bit, including:

* [Blocks + Javascript](https://makecode.microbit.org/reference) (actually somewhere between JavaScript and Typescript, but they don't say that)
* [Python](https://microbit.org/guide/python/) (actually [MicroPython](https://micropython.org/))
* [Swift](https://microbit.org/guide/mobile/#swift)
* [Many other 3rd party programs](https://microbit.org/code-alternative-editors/)

In any source language, the user's program is [compiled to a HEX file](https://tech.microbit.org/software/hex-format/) which [contains the ARM assembly code](https://tech.microbit.org/software/#high-level-programming-languages).
This assembly code usually interacts with the [device abstraction layer](https://tech.microbit.org/software/runtime-mbed/) which provides a simpler interface for controlling the board's functionality such as Bluetooth and accelerometer.

Basically everything about the Micro:Bit is open-source and well-documented, so check out their [developer site](https://tech.microbit.org/).

## What's a Ray Tracer, Anyway?

A [ray tracer](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)) is a program which renders a 3D scene by simulating the path of light from a virtual camera.
Rather than try and explain it in words, I have created a series of pictures demonstrating the process:

On the left hand side of the scene, we can see the virtual camera.
It sits behind the origin point, and is currently looking straight ahead, in the `z` direction.

![The 3d environment is mostly white with a grid drawn on the floor. There are two darker grid lines representing x=0 and z=0. At the point where they cross, there is some text saying 0,0.]({{ site.github.url }}/swaterman/assets/microbit-raytracer/raytrace-1.jpg "The camera is a virtual object in the scene and chooses what direction we fire the rays")

The pyramid is made of four triangles.
It sits further away from the camera, with two light sides and two dark sides.

![A few meters away from the camera, we see a square-based pyramid sitting on the grid. The side facing the camera is bright red, while the right-hand side is a darker red.]({{ site.github.url }}/swaterman/assets/microbit-raytracer/raytrace-2.jpg "The pyramid is the physical object that we want to render in the scene")

Here, we visualise the `view plane` - the representation of the screen.
It is a 5x5 grid, which sits 1m away from the camera.
The width of the grid is customisable, and affects how wide of a view the camera has.
Each LED on the Micro:Bit is represented by one cell in the grid.

![A grid appears in the scene, with an arrow from the camera demonstrating that it is 1m away and 0.5m wide.]({{ site.github.url }}/swaterman/assets/microbit-raytracer/raytrace-3.jpg "There are other (better looking) ways to arrange the rays, but this is the fastest to compute")

Now, we simulate the rays.
Each of the 25 rays originates at the camera (now hidden) and travels through the center of a grid cell.
For higher-quality rendering you could send multiple rays through each pixel, evenly spaced, and average the result.

![Many bright-red lines appear, propoagating from the camera's location and shooting off into the distance. Some go through the pyramid.]({{ site.github.url }}/swaterman/assets/microbit-raytracer/raytrace-4.jpg "The rays are infinitely long")

Some of the rays went through the pyramid.
Let's just keep those, and remove the ones that didn't hit anything.

![There are now far fewer rays - only the ones that went through the pyramid remain]({{ site.github.url }}/swaterman/assets/microbit-raytracer/raytrace-5.jpg "Looks painful")

Any time a ray hits something, we fill that cell the same colour as the object that the ray hit.
This means that if a ray hits the dark side of the pyramid, the cell would get filled in a darker colour.
The rays that don't hit anything get coloured in black, since the camera can't see anything in that pixel.

![The grid has been filled in so that it displays something vaguely resembling a pyramid]({{ site.github.url }}/swaterman/assets/microbit-raytracer/raytrace-6.jpg "The Egyptians would be proud")

Bear in mind that this is the absolute simplest version of ray tracing.
More advanced versions simulate the light as it bounces off objects or refracts through glass.
They also consider the location of virtual lights within the 3D scene, allowing objects to cast shadows that appear in the resulting renders.
Considering that the Micro:Bit already struggled with the simple version, that may have been a bit much to ask.

## Conclusion

Frankly, I think this was an outstanding success.
It works well enough on the Micro:Bit, it's accurate, and it works really well as a learning tool.
I understand ray tracers much better, and it was a great excuse to play with the Micro:Bit!

If you want to learn more about how a ray tracer works, [check out Part 2](https://blog.scottlogic.com/2020/03/10/raytracer-how-to.html), discusses how to actually implement one, and the maths behind it.
[Part 3](https://blog.scottlogic.com/2020/03/27/microbit-optimisation.html) explores how to use a profiler to optimise your Micro:Bit code.
