---
title: D3FC ❤ Canvas
date: 2016-03-18 00:00:00 Z
categories:
- asheehan
- Tech
author: asheehan
layout: default_post
summary: Along with the modularisation of code, D3 version 4 also brings new support for canvas drawing, thanks to the d3-path package introduced in version 4.
---

Along with the [modularisation](https://github.com/d3/d3/issues/2461) of code, [D3 version 4](https://github.com/d3/d3/releases/tag/v4.0.0) also brings new support for canvas drawing, thanks to the [d3-path](https://github.com/d3/d3-path) package introduced in version 4.

There are performance advantages to using canvas over svg for drawing complex charts (however canvas is not necessarily always better). You can read more about **d3-path** and *svg vs canvas*  [in this blog post](http://blog.scottlogic.com/2016/03/10/d3-path-what-is-it-good-for.html).

In this blog post I will be showing off an example d3fc component, which can render on an svg *and* canvas elements. This is a first step to creating canvas compatible chart components which we may eventually incorporate into d3fc.

[See the series in action](http://alisd23.github.io/d3fc-canvas-example/)  
or  
[Check out the code](https://github.com/alisd23/d3fc-canvas-example).

## Let's get started

First, the candlestick component. We need 2 separate internal functions to handle either svg or canvas rendering. The series generator function then calls either the svg or canvas render function depending on what type of DOM element was passed to it in the selection.

First, **the candlestick generator**, which uses the [d3fc-shape](https://github.com/d3fc/d3fc-shape) candlestick to generate the 'path' for both canvas or svg. The default is svg, but you can set the context to a canvas context for drawing on canvas, which you will see in action in a minute.

{% highlight js %}

// Generator which can be reused for both canvas and svg rendering
const generator = candlestick()
  .x((d, i) => xScale(d.date))
  .open((d) => yScale(d.open))
  .high((d) => yScale(d.high))
  .low((d) => yScale(d.low))
  .close((d) => yScale(d.close));

{% endhighlight %}

**To render to canvas -**

{% highlight js %}

/**
 * Use the generator with the given data to draw to the canvas
 */
function drawCanvas(upData, downData, generator, canvas) {
  const ctx = canvas.getContext('2d');
  // Set the context do the canvas elements' context
  generator.context(ctx);

  // Clear canvas
  canvas.width = canvas.width;

  // We have to draw the up and down candlesticks in separate 'paths' so we can colour them separately (green for up, red for down).
  ctx.beginPath();
  generator(upData);
  ctx.strokeStyle = '#52CA52';
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  generator(downData);
  ctx.strokeStyle = '#E6443B';
  ctx.stroke();
  ctx.closePath();
}

{% endhighlight %}


**and the SVG render -**

{% highlight js %}

/**
 * Use the generator with the given data to draw to the SVG element
 */
function drawSvg(upData, downData, generator, svg) {
  generator.context(null);
  d3.select(svg).select("path.up")
    .datum(upData)
    .attr("d", generator);

  d3.select(svg).select("path.down")
    .datum(downData)
    .attr("d", generator);
}

{% endhighlight %}


Then the series creation function simply sets up the zoom behaviour, splits the data into *up* and *down* arrays (to colour the up and down candlesticks differently), then draws the chart using the appropriate render function.

{% highlight js %}

let xScale = d3.scale.identity();
let yScale = d3.scale.identity();
/**
 * Render the candlestick chart on the given elements via a D3 selection
 */
var candlestickSeries = function(selection) {

  selection.each(function(data) {
    const element = this;

    const upData = data.filter(d => d.open <= d.close);
    const downData = data.filter(d => d.open > d.close);

    const draw = fc.util.render(() => {
      // Check if element is a canvas
      element.getContext
        ? drawCanvas(upData, downData, generator, element)
        : drawSvg(upData, downData, generator, element);
    });

    draw();
  });
};

candlestickSeries.xScale = (...args) => {
  if (!args.length) {
      return xScale;
  }
  xScale = args[0];
  return candlestickSeries;
};
candlestickSeries.yScale = (...args) => {
  if (!args.length) {
      return yScale;
  }
  yScale = args[0];
  return candlestickSeries;
};

{% endhighlight %}

Then in our main code we need to just generate the **x** and **y** scales, initialise the series, then call the series with the data with our d3 selection. In a simple case the code would look something likes this -

{% highlight js %}

const width = 800;
const height = 500;

// Use the date as the x-axis scaling, starting from the min value, ending at the max value using extent
const xScale = scaleTime()
  .range([0, width])
  .domain(d3.extent(data, (d, i) => d.date));

// Scale the y-axis using the minimum 'low' value and the maximum 'high' value in the data array
const yScale = scaleLinear()
  .range([height, 0])
  .domain(fc.util
    .extent()
    .fields(['high', 'low'])
    .pad(0.2)(data))
      .range([height, 0]);

// Zoom handler
function handleZoom() {
  d3.select(this).call(series);
}

// Setup zoom behaviour for each chart individually
const svgZoom = d3.behavior.zoom()
  .x(xScale)
  .y(yScale)
  .on('zoom', handleZoom);

const canvasZoom = d3.behavior.zoom()
  .x(xScale)
  .y(yScale)
  .on('zoom', handleZoom);

d3.select(svgEl).call(svgZoom);
d3.select(canvasEl).call(canvasZoom);

const series = candlestickSeries()
  .xScale(xScale)
  .yScale(yScale);

d3.selectAll('.chart')
  .datum(data)
  .call(series);

{% endhighlight %}


## Performance

As you can see above, to compare performance I added some zoom functionality to the series.
I created this [small application](http://alisd23.github.io/d3fc-canvas-example/) to demonstrate both charts side by side, so you can try out and feel the performance difference for yourself.
Also you can [check out the full code here](https://github.com/alisd23/d3fc-canvas-example).

They perform equally with a low number of candlesticks, but as you increase this number, the svg becomes very laggy and unresponsive on zoom, because it is having to mutate a huge DOM path element, whilst the canvas keeps its smoothness for much longer, performing well even up to 20,000 candlesticks on my PC.

**Try it yourself**

<iframe src="http://alisd23.github.io/d3fc-canvas-example/" style="width:100%;height:600px;"></iframe>

## The future

At some point in the future, we may create some canvas series, or adapt the current series in a similar way to this component, to allow it to render to svg **or** canvas. But until then, if you want to start rendering your charts on canvas, the code in this post should give you an idea of how to implement your own canvas components.
