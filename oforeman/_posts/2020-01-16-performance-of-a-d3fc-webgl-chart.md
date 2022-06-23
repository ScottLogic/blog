---
published: true
author: oforeman
layout: default_post
category: Tech
title: Analysing and improving the performance of a D3FC-WebGL chart
summary: >-
  In this post we will be investigating how we can improve the performance of a chart created using D3FC and WebGL by using a lower level API from the d3fc-webgl package.
---
Recently I've been working with the new [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) features of the [D3FC](https://d3fc.io/) library to implement some charts. D3FC extends the [D3](https://d3js.org/) charting library by providing commonly used components to simplify the process of creating interactive charts.

In my [last blog post](https://blog.scottlogic.com/2020/01/08/creating-a-chart-with-d3fc-and-webgl.html) we explored an approach to implementing a point series with a large data set, around 54,000 points, using D3FC and WebGL. Using the new functionality of `seriesWebglPoint` and `webglPlotArea` we were able to quickly create our chart and show that we could render the large data set in a single pass due to the performance boost of using the GPU. The full example from the blog post can be found in [this bl.ock](https://bl.ocks.org/OliverForeman/f8bc8d69b7df041ada60cc86952c6fee).

In this post we are going to be looking at the performance of our large data set chart in a bit more detail. We will then have a look at adapting the example to use the underlying API offered by the D3FC library in order to drive an even greater performance.

## Performance of the original implementation

We know that using WebGL and the GPU gives us a performance boost when rendering our chart. In fact in the previous post we found that we could render almost 40 times faster using WebGL, compared to a canvas batch rendering implementation of the same chart. But what's the performance of our chart like if we look at it in more detail?

Using the [Chrome developer tools](https://developers.google.com/web/tools/chrome-devtools), specifically the performance analysis, we can view lots of information about our chart as it rerenders. We can view a flame chart showing function calls, the FPS (Frames Per Second) of our chart, and the memory usage, as well as lots of other data. Lets get started by taking a performance analysis of our chart as we pan it, causing it to rerender a lot of times.

![Flame chart showing performance when panning the example]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-flame-chart.PNG)

There's a lot going on here so lets break it down a bit. The first thing we are interested in is the FPS, shown at the top of the output.

![Flame chart FPS output]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-flame-chart-fps.PNG)

Overall the FPS is high for most of the duration, however it isn't quite as consistent as we might like, it could be a lot smoother. We can see this as the line fluctuates quite a lot and there are a number of drops in performance. The drops in performance are also a lot more severe than we would like to see. So what's going on here?

If we zoom in on the main flame chart (in the middle of the full output) we can inspect the function calls happening when a drop in performance occurs. This should allow us to see exactly what is happening when our performance drops.

![Flame chart zoomed in on a drop in performance]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-flame-chart-dip.PNG)

We can see here that a call to the function `point` (highlighted in red) is taking a long time. In fact the whole animation frame lasts for 26.08ms, and of that it spends 18.43ms running the `point` function. So what is the `point` function? This is what runs when we call `seriesWebglPoint`, the driving function for our series. We can see that a function called `defined` runs for a long time during this, and leads to a major [garbage collection](https://javascript.info/garbage-collection). This means that our program is dropping in performance as we are having to wait for memory to be freed so that we can use it. If we inspect the memory chart for our test, we can see how the memory usage changes.

![Flame chart memory overview]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-flame-chart-memory.PNG)

We can see that our memory usage spikes often and we are unable to free memory fast enough, this leads to large drops in performance when a major garbage collection occurs. We can see this as each of the large decreases in memory usage (major garbage collections) corresponds to one of our large drops in FPS.

If we inspect the code base we can find that this is happening because the `point` function doesn't cache our data between renders. This means that it reprocesses all of our data (all 54k points) every frame, this is done to ensure that all of our data is valid, and so our data arrays can be recreated. If we want to improve the performance of our chart even more then we need to remove any unnecessary data processing.

## Using the underlying API

For our chart we have been using `seriesWebglPoint` to create our WebGL point series, this handles a lot of functionality for us such as creating the typed data arrays for our [buffers](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer). Essentially this acts as a wrapper for the underlying API `glPoint`. This is where we interact with the [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram) directly to bind the data arrays to our buffers, and to create the [shaders](https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html) that will be used to draw our chart.

Instead of using `seriesWebglPoint` we are going to create our own custom wrapper for `glPoint` so that we can access and call its functions ourselves. This will allow us to remove extra data processing steps such as validating the data on every render. We'll start by removing our existing use of `seriesWebglPoint` and replacing it with a function that we will call `optimisedPointSeries`.

~~~javascript
const optimisedPointSeries = () => {
  ...
};
~~~

This will act as our custom wrapper for `glPoint` that we are going to use instead of `seriesWebglPoint`. The next step then is to get an instance of `glPoint` that we can use.

~~~javascript
const optimisedPointSeries = () => {
  let draw = fc
    .glPoint();
};
~~~

At this point we can also apply the decorate function that we used with `seriesWebglPoint` as this doesn't depend on any additional external information. You can read more about what this does in my last blog post, but the basic idea is we are colouring the points red and making denser areas darker.

~~~javascript
const optimisedPointSeries = () => {
  let draw = fc
    .glPoint()
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
};
~~~

Perfect, we now have our reference to `glPoint` (that we can refer to through `draw`) allowing us to access the lower level functions. We've also applied our `decorate` function to make our chart look better when it's rendered. The next thing we will set up is the function that will be called whenever the browser is rendering our chart.

~~~javascript
const optimisedPointSeries = () => {
  ...
  const pointSeries = data => {
    draw.type(fc.circlePointShader());
    draw(data.length);
  };
};
~~~

The important thing here is that this is very simple. In the generic `seriesWebglPoint` implementation this is where a lot of the data processing occurs, for example this is where the data is validated (the `defined` function we saw earlier) and the data arrays are created. Instead we are resetting the shader we are using, this ensures that our decorate function and scaling works correctly, and then we are executing the underlying API to draw our chart. This means that we are no longer processing our data every frame that we are rendering.

In order for this to work we will need to have already created and passed our data arrays to the underlying API before this function can run. To do this we will provide some functions that we can use to set the data we need.

~~~javascript
const optimisedPointSeries = () => {
  ...
  pointSeries.xValues = (...args) => {
    draw.xValues(args[0]);
    return pointSeries;
  };
  pointSeries.yValues = (...args) => {
    draw.yValues(args[0]);
    return pointSeries;
  };
  pointSeries.sizes = (...args) => {
    draw.sizes(args[0]);
    return pointSeries;
  };

  pointSeries.context = (...args) => {
    draw.context(args[0]);
    return pointSeries;
  };
  pointSeries.xScale = (...args) => {
    draw.xScale(fc.scaleMapper(args[0]).glScale);
    return pointSeries;
  };
  pointSeries.yScale = (...args) => {
    draw.yScale(fc.scaleMapper(args[0]).glScale);
    return pointSeries;
  };

  return pointSeries;
};
~~~

We've added a lot here but it's all quite simple. We are just providing functions to set properties using the underlying API, accessed through `draw`. We will use the `xValues`, `yValues`, and `sizes` functions later to set the respective values. These functions simply pass the data arrays we give them onto the underlying API, we will only need to call these once as our data never changes.

The other functions (`context`, `xScale`, and `yScale`) are used by `chartCartesian`. We have to provide these functions in order for `chartCartesian` to work correctly, however we never have to call them ourselves. You may notice that for `xScale` and `yScale` we do a bit of extra work. This is because the scales passed to these functions will be d3 scales, and our underlying API needs a custom `glScale`. To get the correct scale we make use of the D3FC `scaleMapper` that maps d3 scales to the corresponding `glScale` implementation.

That's all there is to our custom wrapper, we just need to use it now. The first thing we will do is set up the data array for our point sizes. Just like before we want all the points to be the same size, 4.

~~~javascript
d3.tsv('diamonds.tsv', type).then(data => {
  const sizes = new Float32Array(data.length);
  sizes.fill(4);
  ...
});
~~~

When working with WebGL we have to use typed arrays, so we create a [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) (an array of 32-bit floating point numbers) with the same length as our data. We can then use the `fill` function to set every value in the array to the size we want, 4.

Next we will set up the data arrays for our X and Y values, drawing from the carat and price properties of each data point. Once again we use `Float32Array` for our typed arrays, and we set the length of our arrays to the same length as our data.

~~~javascript
sizes.fill(4);

const xValues = new Float32Array(data.length);
const yValues = new Float32Array(data.length);
data.forEach((d, i) => {
  xValues[i] = d.carat;
  yValues[i] = d.price;
});
...
~~~

That's all the data arrays we need in order to create our chart. Now all we have to do is get an instance of our custom wrapper, and pass the data to it. As we saw before this will pass the data arrays straight on to the underlying API, ready to be used when we start rendering.

~~~javascript
const pointSeries = optimisedPointSeries()
  .xValues(xValues)
  .yValues(yValues)
  .sizes(sizes);
~~~

With everything set up the only thing left to do is pass the instance of our custom wrapper to `chartCartesian`, we do this using the `webglPlotArea` function. In the original example we passed our instance of `seriesWebglPoint` here, so all we are doing is passing our custom wrapper for the underlying API instead. Everything else that was already set up for the `chartCartesian` can be left as it is.

~~~javascript
const chart = fc
  .chartCartesian(xScale, yScale)
  .webglPlotArea(pointSeries)
  ...
~~~

With that done we are finished adding our custom wrapper for the underlying API, the full example for this can be found in [this bl.ock](https://bl.ocks.org/OliverForeman/7199e7387d73bd0a909902a3887968b7). Please note that the `d3fc-webgl` package contents are liable to change in the future as the API matures. So whilst the custom wrapper we have created is correct as of now, this could change slightly in the future. If you are using the library make sure to check out [the documentation](https://d3fc.io/api/series-api.html) to see what functions are supported.

Now that we have implemented our custom wrapper and removed the extra data processing, the big question is what has this done for our performance?

## Performance of the new implementation

We'll start by having a look at the FPS of our chart again. For our original implementation we noticed that the FPS wasn't as consistent as we would want and there were quite a few severe drops in performance, so hopefully we can improve from there.

![Flame chart FPS for custom wrapper]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-flame-chart-2-fps.PNG)

We can see that our FPS is looking a lot smoother and more consistent, the line fluctuates less and there are far fewer drops in performance. We still have a few drops but they are a lot less severe. Overall this is looking like a good improvement! Let's have a closer look at the flame chart again and see what the function executions look like.

![Flame chart drop in performance for custom wrapper]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-flame-chart-2-dip.PNG)

This time our animation frame is firing for 14.14ms (compared to around 26ms before) so we have almost halved our execution time. We can also see that our custom wrapper isn't even noticeable at this level, in fact if we keep zooming in we can find that our custom wrapper only had to run for 0.12ms. That's a huge improvement from the 18ms we were seeing before when we were using `seriesWebglPoint`!

Now that we are no longer processing our data on every frame we have managed to significantly improve our performance. We can attribute this to the fact that we have reduced the work load and therefore reduced our memory consumption. We can see this as we are no longer having to perform a garbage collection during most renders. If we inspect the memory chart for our custom implementation we can see what a difference our changes have made.

![Flame chart memory usage for custom wrapper]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-flame-chart-2-memory.PNG)

We can see that our memory usage now increases at a much more gradual rate and has far less severe spikes. This is meaning that we aren't running out of memory as often as we were before, and we aren't having to wait for memory to be freed. Overall this provides us with a noticeable performance boost, and allows our chart to render smoother.

With our new implementation we have seen a big improvement in the performance of our chart, however it still isn't perfect. Ideally we would like to see a consistent 60 FPS. So what's causing the drops in performance that we are still seeing? With a bit of investigation we can find that it's the axes of the graph that are causing the problems. This is because the axes are drawn using SVGs, resulting in a lot of [DOM Nodes](https://developer.mozilla.org/en-US/docs/Web/API/Node) being created and disposed of. This triggers frequent garbage collection, which causes the frame rate drops in our chart! So what would our performance look like if we didn't have the axes on the chart?

![Memory usage of chart with no axes]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-no-axes-memory.PNG)

We no longer have the highly fluctuating memory usage! So what about the FPS?

![FPS of chart with no axes]({{site.baseurl}}/oforeman/assets/diamonds-webgl-performance/diamonds-webgl-no-axes-fps.PNG)

Perfect, we now have our consistent 60 FPS! For charts where we don't need the axes then removing them can be the best solution for getting maximum performance out of a chart. However if the axes are important to the chart then you can follow this [Github issue](https://github.com/d3fc/d3fc/issues/1380) where we are working to improve their performance.

## Conclusion

By creating a custom wrapper and using the underlying API (`glPoint`) directly we have been able to gain a significant performance boost for our chart. The key difference is that `seriesWebglPoint` processes the data it is given every time the chart needs to render, whereas with our implementation we process the data once at the start and then reuse the buffers we create for every render. We can do this as we know that all of our data points are valid and none of the values will change. This significantly reduces the amount of work that is performed on each render of the chart and therefore reduces the amount of memory that we are using. In turn this means that our chart performance increases, notably with the FPS becoming smoother and more consistent and the run time of our function becoming a fraction of a millisecond.

In order to create our custom wrapper implementation and use the underlying API we haven't had to add a lot of extra code. However we did require a greater understanding of the D3FC components and how they connect together, for example we had to provide `context`, `xScale`, and `yScale` functions in our custom wrapper for `chartCartesian` to use. For this reason it is easier to start with the higher level API (`seriesWebglPoint`), however we have shown that when we use the underlying API we can push optimisation for the best possible performance.
