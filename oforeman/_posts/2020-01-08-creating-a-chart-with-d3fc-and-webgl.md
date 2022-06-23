---
published: true
author: oforeman
layout: default_post
category: Tech
title: Creating a chart with D3FC and WebGL
summary: >-
  In this post we will be looking at creating a chart using D3FC and the new WebGL functionality. With the performance boost that WebGL provides we will see how we can render a large data set of around 54,000 points in a single pass.
---
I've recently had the opportunity to use some of the new [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) features of the [D3FC](https://d3fc.io/) library. D3FC extends the [D3](https://d3js.org/) charting library by providing commonly used components to simplify the process of creating interactive charts.

In this post we will be exploring an approach to implementing a chart with a large dataset, around 54k points, using the WebGL series within D3FC. The chart we will be creating is a re-implementation of the 'Diamonds' example that has been created by Mike Bostock in [this bl.ock](https://bl.ocks.org/mbostock/ebb45892cc6ec5e6c902) using D3, and by Colin Eberhardt in [this bl.ock](https://bl.ocks.org/ColinEberhardt/f84c5ded602e0455d248ca889b75b0da) using D3FC. In both examples we can see how batch rendering the data allows us to draw to the canvas in 'chunks', and avoid having a blank page for an extended length of time. However in our example we will be using WebGL, and therefore the processing power of the GPU, meaning we can render the whole dataset at once!

## Drawing a basic chart

The data we are rendering is very simple, we have pairs of values representing the mass of diamonds (in carats) and their price (in US$). Our starting point then is to read this data from a file and format our values as numbers. We can do this using the [`tsv`](https://github.com/d3/d3-fetch/blob/master/README.md#tsv) function from D3 (allowing us to read in data from a `.tsv` file) and a helper function (`type`) that will convert our data values to numbers. This will give us an array of objects with two fields, `carat` and `price`.

~~~javascript
d3.tsv('diamonds.tsv', type).then(data => {
  ...
});

function type(d) {
  d.carat = Number(d.carat);
  d.price = Number(d.price);
  return d;
};
~~~

Now that we have our data we can begin to implement our chart. The first thing we need to do is create our point series renderer, this will define the basic information for each point such as the cross and main values, and the size of the point.

~~~javascript
const pointSeries = fc
  .seriesWebglPoint()
  .crossValue(d => d.carat)
  .mainValue(d => d.price)
  .size(4);
~~~

This syntax should be very familiar to anyone that has used D3FC before, in fact the only thing that is new is `seriesWebglPoint()`. At this point we could switch to using an `SVG` or `canvas` implementation by using `seriesSvgPoint()` or `seriesCanvasPoint()`, and everything would still be valid. For anyone who isn't familiar with D3FC what we are doing here is quite simple. We are telling our renderer how it will access the values needed for each point in our series, the cross value (our x value) comes from the value stored in `carat`, and the main value (our y value) comes from the value stored in `price`. The size of each point is set to a fixed value of 4.

Next we need to set up the scales for our chart. We don't have to do anything new here to work with WebGL, so we are just using existing D3FC and D3 functionality.

~~~javascript
const xExtent = fc
  .extentLinear()
  .accessors([d => d.carat])
  .pad([0.1, 0.1]);

const yExtent = fc
  .extentLinear()
  .accessors([d => d.price]);

const xScale = d3.scaleLinear().domain(xExtent(data));
const yScale = d3.scaleLinear().domain(yExtent(data));
~~~

The first thing we have done is create extents that will give us the upper and lower bounds for our scales when we pass them our data. We also add some padding to `xExtent`, just to make the graph look a bit better. With our extents we can then use D3 to create the scales for our chart.

Now we have our point series generator, the data, and the scales; so all that's left is to plot the chart! We can use the [`cartesian chart`](https://d3fc.io/api/chart-api.html#cartesian) component from D3FC to do most of the work for us.

~~~javascript
const chart = fc
  .chartCartesian(xScale, yScale)
  .webglPlotArea(pointSeries)
  .xLabel('Mass (carats)')
  .yLabel('Price (US$)')
  .yTickFormat(d3.format('.3s'));
~~~

Just like before the only new thing is `webglPlotArea`, all the other functionality is existing and will work with `SVG` or `canvas` implementations as well. The `webglPlotArea` ensures that we have a [WebGL context](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext) for drawing to the canvas using the GPU. The `cartesian chart` will handle drawing our scales for us, and will pass them on to our WebGL series so that the data is drawn in the correct positions. We have also added some labels to our axes and formatted our Y-axis to be a 3 digit number with [SI prefixes](https://en.wikipedia.org/wiki/Metric_prefix#List_of_SI_prefixes).

All that's left is to select the element we want to draw from in the DOM, give it the data, and call our chart.

~~~javascript
d3.select('#chart')
  .datum(data)
  .call(chart);
~~~

That's all there is to a basic chart with WebGL, and we've only had to use two new functions. We now have something that looks like this.

![A basic point series with WebGL]({{site.baseurl}}/oforeman/assets/diamonds-webgl-create-chart/diamonds-webgl-basic-chart.PNG)

While this does show the data, it doesn't look all that great. So lets decorate it!

## Decorating a chart

Just like the other series in D3FC, the WebGL series expose a [decorate function](https://d3fc.io/api/series-api.html#decorate-pattern) that allows us to make changes to the way the chart is drawn. When working with WebGL this exposes the underlying [`WebGLProgram`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) so that we can access the drawing context and the shaders.

As part of the `d3fc-webgl` package we have access to an API that makes it easier for us to construct WebGL programs. This exposes useful functions such as `pointFill` and `pointStroke` that we can use for setting the colour of our points, and adding a coloured stroke to the edge of our points respectively. We can use these to make changes to our point series without having to write the shader code ourselves. Please note that the `d3fc-webgl` package contents are liable to change in the future as the API matures. So whilst the use of these functions for our decorate function is correct as of now, this could change slightly in the future. If you are using the library make sure to check out [the documentation](https://d3fc.io/api/series-api.html) to see what functions are supported.

The first thing we will look at is adding some colour. To do this we will make use of the `pointFill` function that is exposed by the API, this allows us to easily set a colour for our points and apply the shader code to our program.

~~~javascript
const pointSeries = fc
  .seriesWebglPoint()
  .crossValue(d => d.carat)
  .mainValue(d => d.price)
  .size(4)
  .decorate(program => {
    fc.pointFill().color([1, 0, 0, 1])(program);
  });
~~~

We provide our colour in an RGBA format, with each value being between 0 and 1, here we have changed all of our points to be coloured red. We apply the relevant shader code by executing the function, passing the program that we want to apply it to as the argument. As well as providing the `pointFill` function, the API also exposes a `pointAntiAlias` function for adding [anti-aliasing](https://en.wikipedia.org/wiki/Anti-aliasing). We will add in the anti-aliasing so that the edges of our points aren't as jagged.

~~~javascript
const pointSeries = fc
  .seriesWebglPoint()
  .crossValue(d => d.carat)
  .mainValue(d => d.price)
  .size(4)
  .decorate(program => {
    fc.pointFill().color([1, 0, 0, 1])(program);
    fc.pointAntiAlias()(program);
  });
~~~

![WebGL point series coloured red with anti-aliasing]({{site.baseurl}}/oforeman/assets/diamonds-webgl-create-chart/diamonds-webgl-basic-chart-red.PNG)

This looks better, but we now have white patches in areas where we have a lot of data points. This is because the anti-aliasing reduces the alpha value at the edge of each point, when there's a lot of overlap this causes the points to disappear. We can change this by altering the blending function used by the canvas.

~~~javascript
const pointSeries = fc
  .seriesWebglPoint()
  .crossValue(d => d.carat)
  .mainValue(d => d.price)
  .size(4)
  .decorate(program => {
    fc.pointFill().color([1, 0, 0, 1])(program);
    fc.pointAntiAlias()(program);

    const gl = program.context();
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_DST_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA
    );
  });
~~~

The key part here is [`blendFuncSeparate`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate). This allows us to control how blending is calculated for our RGB values (the first two parameters) and our alpha value (the last two parameters). For our RGB values we use the colour we are currently setting and some of the colour that alreay exists, this makes it so that dense areas appear darker. Our alpha value is set up so that it will always use the value we are passing in, which is one.

![WebGL point series coloured red with dark spots for high density]({{site.baseurl}}/oforeman/assets/diamonds-webgl-create-chart/diamonds-webgl-basic-chart-red-dark.PNG)

That's all there is to creating a simple point series chart with D3FC and WebGL! As we are using WebGL we can also add features that require fast rerendering such as zooming and panning, this doesn't require anything specific to WebGL so we wont cover the code now. To see the full example, including zooming and panning, you can check out [this bl.ock](https://bl.ocks.org/OliverForeman/f8bc8d69b7df041ada60cc86952c6fee).

## Conclusion

In this short example we have created a simple point series chart using WebGL with D3FC. By using WebGL we have gained a performance boost to our chart that has allowed us to render a large data set in a single pass. The great thing about it is that we don't need any prior knowledge of WebGL to get started, in fact we only needed some knowledge of WebGL specific functions when we started decorating the chart. This means that it is easy to get started with and gain the performance benefits of rendering using the GPU. As well as this, for anyone that has used D3FC before the syntax used in this example should be very familiar as it follows the same patterns as working with an `SVG` or `canvas` implementation.

So what kind of performance benefits have we gained? In the table below we can see the average time taken to render our chart when the page loads using WebGL rendering, compared to the previous method of batch rendering to the canvas.

| Canvas batch rendering (ms) | WebGL rendering (ms) |
|:---------------------------:|:--------------------:|
| 2198                        | 56                   |

That's a massive improvement with our WebGL rendering running almost 40 times faster! Results will vary depending on the GPU used, however we can clearly see that there is a benefit to using WebGL. We still aren't getting a perfect 60 frames per second however in a future post we will investigate how we can improve the performance even more! In any case by simply switching to using WebGL we have managed to greatly reduce the time it is taking our chart to render, and we have simplified the solution as we don't have to batch our data. If we want the best performance out of our chart, then using WebGL seems the way to go!
