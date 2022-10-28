---
title: d3-path - what is it good for?
date: 2016-03-10 00:00:00 Z
categories:
- cprice
- Tech
author: cprice
layout: default_post
summary: d3-path is an abstraction over SVG path creation which uses the canvas element's
  Context2D interface. Previously creating path generation code involved a lot of
  concatenating SVG path commands like M0,0 or L2,2, and the somewhat more cryptic
  C70 20,120 20,120 10. Even with ES6 string interpolation such code can be incredibly
  hard to read (and write!).
---

This post introduces a new feature of D3 version 4: the [`d3-path`](https://github.com/d3/d3-path) package.

`d3-path` is an abstraction over SVG path creation which uses the canvas element's `Context2D` interface. Previously creating path generation code involved a lot of concatenating SVG path commands like `M0,0` or `L2,2`, and the somewhat more cryptic `C70 20,120 20,120 10`. Even with ES6 string interpolation such code can be incredibly hard to read (and write!).

The new package borrows `Context2D`'s fluent path drawing API methods to accomplish the same thing. `M0,0` becomes `ctx.moveTo(0,0)`, `L2,2` becomes `ctx.lineTo(2,2)`, etc.. Internally the code maintains the list of commands and you can get access to the equivalent SVG path by calling `ctx.toString()`.

So one advantage of adopting the package is that your code becomes significantly clearer to read, but there's another more interesting side-effect. Once our code uses the new API, without changing any of the path construction logic, we can draw to canvas instead of SVG!

## What does the code look like?

In this example I'm going to use the new `d3fc-shape` package we've created to demonstrate how to switch between SVG and canvas rendering. The package is able to draw out various specialist series types (e.g. candlesticks, error bars, etc.) internally making use of the new API.

First up, here's the code for rendering a bar series to SVG -

{% highlight js %}
const path = select('svg')
  .selectAll('path')
  .data([data]); // <- Bind data to the path node in the normal way.

const svgBar = barGenerator() // <- Defaults to using SVG path generator.
  .x((d, i) => x(i))
  .y((d) => y(d))
  .height((d) => y(0) - y(d))
  .width(1)
  .verticalAlign('top');

path.attr('d', svgBar); // <- The attr function will invoke the bar path generator
                        //    with the bound data as an argument. By default the
                        //    bar path generator uses an SVG path generator and
                        //    invokes toString(), producing the SVG path data.
{% endhighlight %}

*N.B. Whilst this example uses both ES6 transpilation and the new D3v4 packages, neither are required.*

Rendering to canvas is very similar, but with a couple of subtle differences -

{% highlight js %}
const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d'); // <- Retrieve the `Context2D` implementation
                                     //    from the canvas.

const canvasBar = barGenerator()
  .context(ctx) // <- Pass the `Context2D` implementation to the bar path generator.
  .x((d, i) => x(i))
  .y((d) => y(d))
  .height((d) => y(0) - y(d))
  .width(1)
  .verticalAlign('top');

canvasBar(data); // <- Directly call the bar path generator specifying the data.

ctx.stroke(); // <- Stroke the generated path.
{% endhighlight %}

*N.B. Don't forget the stroke/fill call after calling the bar path generator, without that nothing will be drawn!*

## Why would I want to use canvas paths over SVG paths?

If my visualisation already renders fine in SVG, why would I want to render it on canvas? Ultimately this comes down to the differences between immediate mode (canvas) and retained mode graphics (SVG). In retained mode you manipulate the properties of graphical primitives across frames (e.g. add a `circle` to the drawing, scale it and then move it) rather than performing a sequence of drawing instructions (move here, set the scale, draw a circle, clear the screen, repeat).

Immediate mode is *generally* quicker because it's a lower-level API. You're much closer to interacting directly with the frame buffer so certain classes of operations are going to zip-along e.g. rendering complex paths. In other cases performance gains can come from the extra control that's possible over the exact rendering operations performed.

Retained mode is *generally* easier to use as a programmer because the runtime (browser) will perform many useful operations on your behalf e.g. automatic dirty calculations or event delegation. However, it is *generally* slower.

## How much of a difference does it make?

To attempt to answer this question, I've created the following test in codepen -

<iframe height='540' scrolling='no' src='//codepen.io/chrisprice/embed/MyKvXO/?height=556&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/chrisprice/pen/MyKvXO/'>SVG path versus canvas path performance (using `d3-path`)</a> by Chris Price (<a href='http://codepen.io/chrisprice'>@chrisprice</a>) on <a href='http://codepen.io'>CodePen</a>.</iframe>

**Make sure to rerun the test whilst it's on-screen using the rerun button in the bottom right (hover to make it appear).**

On my machine running Chrome 48, in the 100-2,000 bar range there's almost no difference between the two. However, beyond that canvas starts performing exponentially better and really bad things start happening to SVG beyond 10,000 (you'll need to tweak the code).

Depending on exactly what you're doing you're bound to see slightly different results, but I would expect the general performance pattern to hold. It's worth pointing out that in this example we're comparing a single SVG path to the canvas path, the performance of many SVG paths hasn't been explored.

## Conclusion

I came across `d3-path` whilst investigating how to start moving [d3fc](https://d3fc.io) (our package of charting components) over to D3v4. We decided to start with `d3-path` because it's unusual in containing brand new functionality whilst [not having any dependencies on other v4 packages](http://blog.scottlogic.com/2016/02/23/d3v4-is-on-the-way.html). It was only once we dug a little deeper that we discovered the possibility for this reuse. However, now I've seen what's possible with canvas I'm interested in exploring what's possible with `Context2D`'s bigger brother `WebGL`.

In the mean time, if you're building charts with SVG paths and you're looking for bars, box plots, error bars, candlesticks or OHLC, I'd encourage you to check out our new D3v4 compatible module [`d3fc-shape`](https://github.com/d3fc/d3fc-shape).
