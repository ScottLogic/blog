---
title: Efficient SVG layout with d3
date: 2017-01-10 00:00:00 Z
categories:
- Tech
author: cprice
layout: default_post
summary: When creating d3 visualisations it's common to want some form of responsive
  layout. However, SVG and canvas don't provide a native way to do this. Most examples
  found online either use fixed dimensions or resort to some form of manual layout
  to achieve the required effect. This post introduces an alternative approach using
  CSS and custom elements.
---

When creating d3 visualisations it's common to want some form of responsive layout. However, SVG and canvas don't provide a native way to do this. Most examples found online either use fixed dimensions or resort to some form of manual layout to achieve the required effect. This post introduces an alternative approach using CSS and custom elements.

### Using flexbox for svg/canvas layout

[Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes) has taken over the world of CSS design. By giving fine grained control over how elements expand to fill the available space, it has solved some of the [weird and wonderful layout issues](https://css-tricks.com/fluid-width-equal-height-columns/) of the past.

It's also very useful for laying out charts. Here's an example of separating the typical chart components out onto separate rendering surfaces -

~~~html
<div id="chart" style="display: flex; height: 40vw; width: 60vw; flex-direction: column">
  <h1 style="text-align: center">
    A Cartesian Chart
  </h1>
  <div style="flex: 1; display: flex; flex-direction: row">
    <svg id="plot-area" style="flex: 1"></svg>
    <svg id="y-axis" style="width: 5em"></svg>
  </div>
  <div style="height: 3em; display: flex; flex-direction: row">
    <svg id="x-axis" style="flex: 1; margin-right: 5em"></svg>
  </div>
</div>
~~~

The example above represents a relatively standard cartesian chart with an x-axis at the bottom and y-axis at the right. A flexbox layout is configured such that the plot area grows to fill the available space, whilst the axes remain a constant thickness. There's also a chart title thrown in for good measure which demonstrates mixing in other arbitrary elements.

In order to demonstrate resizing, it uses another modern CSS feature [viewport percentage lengths](https://developer.mozilla.org/en/docs/Web/CSS/length#Viewport-percentage_lengths). Specifically it has a fixed aspect ratio relative to the viewport width.

As far as producing the static layout for the chart we're set. All we need are the current dimensions of each surface so that we can render each surface.

### Preventing layout thrashing

We can easily retrieve the dimensions of each surface by querying the `clientWidth` and `clientHeight` properties of the nodes -

~~~js
const xScale = d3.scaleLinear()
  .domain([0, 10]);

const xAxis = d3.axisBottom(xScale);

const xAxisContainer = d3.select('#x-axis');

const render = () => {
  xScale.range([0, xAxisContainer.property('clientWidth')]);
  xAxisContainer.call(xAxis);
};
~~~

This works great with a single surface because it implicitly follows the principle of grouping our DOM reads (reading the surface dimensions) and our DOM writes (rendering the axis using SVG nodes) to [prevent layout thrashing](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing). However, when doing the same thing with two surfaces, we have to be more careful about the sequence we perform the operations -

~~~js
// ...
const render = () => {
  xScale.range([0, xAxisContainer.property('clientWidth')]);
  xAxisContainer.call(xAxis);
  yScale.range([0, yAxisContainer.property('clientHeight')]);
  yAxisContainer.call(yAxis);
};
~~~

The above example demonstrates exactly what we should **avoid** doing. We're reading (x-surface dimensions), writing (x-axis nodes), reading (y-surface dimensions) then writing (y-axis nodes).  Instead we should re-arrange the calls to group the read and writes -

~~~js
// ...
const render = () => {
  // reads
  xScale.range([0, xAxisContainer.property('clientWidth')]);
  yScale.range([0, yAxisContainer.property('clientHeight')]);
  // writes
  xAxisContainer.call(xAxis);
  yAxisContainer.call(yAxis);
};
~~~

In this simple example, it's a trivial change to re-order the calls. However, as the number of surfaces increases, it is going to be increasingly easy for a stray read to end up mixed into the writes, or vice versa, crippling the performance.

This is a very low-level but highly performance critical concern. It's not something we want to have to think about it when we're creating charts. Ideally it could all be hidden behind a clean abstraction. However, for a long time the web hasn't provided a nice framework agnostic and convenient primitive to wrap this up into.

### Custom elements

Step up custom elements! Firstly, let's quickly recap what we want -

* Allow users to use CSS to position and size rendering surfaces.
* Perform all DOM measurements prior to drawing.
* Provide the surface measurements to the drawing code.
* Align the drawing calls to animation frames.

Whilst this could be wrapped up in any number of different ways, we additionally want to provide a nice boundary between non-d3 UI framework code (e.g. React, Angular, etc.) and the d3 code. [Custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) are a neat solution to this. As a core (or at least easily [polyfilled](https://github.com/WebReflection/document-register-element)) part of the browser, they allow element-centric functionality that is implicitly framework agnostic. Perfect!

### d3fc-svg & d3fc-canvas

Fundamentally the custom elements we're created are nothing but thin wrappers around `svg` and `canvas` elements. However, they do have a few hidden features up their sleeves. Here's an example of rendering an SVG axis (`d3fc-canvas` works in exactly the same way) -

~~~html
<d3fc-svg id="x-axis" style="width: 10vw; height: 6vw"></d3fc-svg>
~~~

~~~js
const xScale = d3.scaleLinear()
  .domain([0, 10]);

const xAxis = d3.axisBottom(xScale);

let i = 0;

const xAxisContainer = d3.select('#x-axis')
  .on('draw', (d, i, nodes) => {
    const { width } = d3.event.detail;
    xScale.range([0, width])
      .domain([++i, i + 10]);
    d3.select(nodes[i])
      .select('svg')
      .call(xAxis);
  });

d3.select(document)
  .on('mousemove', () => {
    xAxisContainer.node()
      .requestRedraw()
  });
~~~

In the example the axis domain is translated by `1` every time a redraw occurs. Why anybody would wish to do this is beyond my imagination. However, it does demonstrate that CSS can indeed be used to set the element's size, that the dimensions of the element are provided to the `draw` event handler and that the drawing code is only invoked at most once per animation frame (you can test this by waggling your mouse around).

It is worth noting that the `draw` event handler doesn't directly render to the node, it instead selects the nested `svg` which is automatically added when the element is attached to the DOM -

~~~js
d3.select(nodes[i]) // The node is a reference to the custom element `d3fc-svg`
  .select('svg')    // so be sure to select the nested `svg` before calling any
  .call(xAxis);     // components.
~~~

This solves all *but one* of our requirements: automatically performing DOM measurements across multiple elements prior to rendering.

### Co-ordinating measuring and drawing

Let's return to the original flexbox example and make use of the new elements -

~~~html
<div id="chart" style="display: flex; height: 40vw; width: 60vw; flex-direction: column">
  <h1 style="text-align: center">
    A Cartesian Chart
  </h1>
  <div style="flex: 1; display: flex; flex-direction: row">
    <d3fc-svg id="plot-area" style="flex: 1"></svg>
    <d3fc-svg id="y-axis" style="width: 5em"></svg>
  </div>
  <div style="height: 3em; display: flex; flex-direction: row">
    <d3fc-svg id="x-axis" style="flex: 1; margin-right: 5em"></svg>
  </div>
</div>
~~~

Using the elements introduced so far, this could be combined with the following code -

~~~js
const data = d3.range(50)
  .map(d => ({ x: d / 3, y: Math.sin(d / 3)}));

const xScale = d3.scaleLinear();

const yScale = d3.scaleLinear();

const xAxisContainer = d3.select('#x-axis')
  .on('draw', (d, i, nodes) => {
    const { width } } = d3.event.detail;
    xScale.range([0, width]);
    const xAxis = d3.axisBottom(xScale);
    d3.select(nodes[i])
      .select('svg')
      .call(xAxis);
  });

const yAxisContainer = d3.select('#y-axis')
  .on('draw', (d, i, nodes) => {
    const { height } = d3.event.detail;
    yScale.range([height, 0]);
    const yAxis = d3.axisRight(yScale);
    d3.select(nodes[i])
      .select('svg')
      .call(yAxis);
  });

const plotAreaContainer = d3.select('#plot-area')
  .on('draw', (d, i, nodes) => {
    const lineSeries = fc.seriesSvgLine()
      .xScale(xScale)
      .yScale(yScale);
    d3.select(nodes[i])
      .select('svg')
      .datum(data)
      .call(lineSeries);
  });

setInterval(() => {
  const n = data.length;
  data.push({ x: n / 3, y: Math.sin(n / 3)});

  const xExtent = fc.extentLinear()
    .accessors([d => d.x]);
  xScale.domain(xExtent(data));

  const yExtent = fc.extentLinear()
    .accessors([d => d.y]);
  yScale.domain(yExtent(data));

  xAxisContainer.node()
    .requestRedraw();
  yAxisContainer.node()
    .requestRedraw();
  plotAreaContainer.node()
    .requestRedraw();
}, 1000);
~~~

Whilst this does work, it's very fragile code. We have to be very careful about the invocation order of the `requestRedraw` calls to ensure that the axes have their ranges correctly set before we make use of them when rendering the plot area. There's also not an obvious place for our domain calculations to live as there's no top-level component to bring the chart's sub-components together.

This is where `d3fc-group` can be useful. It serves two purposes -

* To multi-cast `requestRedraw` calls to descendant rendering surfaces/groups whilst guaranteeing they are invoked in document order.
* To provide its own `draw` event guaranteed to be invoked prior to any of its descendants (matching the document order guarantee above).

We can additionally make use of the `measure` event which is dispatched after the measuring phase has been completed. All elements which have either directly or via an ancestor group had `requestRedraw` invoked, will have their `measure` event triggered before any element's `draw` event is trigged.

Combining both of these features allow us to rewrite the above as -

~~~html
<d3fc-chart id="chart" style="display: flex; height: 40vw; width: 60vw; flex-direction: column">
  <h1 style="text-align: center">
    A Cartesian Chart
  </h1>
  <div style="flex: 1; display: flex; flex-direction: row">
    <d3fc-svg id="plot-area" style="flex: 1"></svg>
    <d3fc-svg id="y-axis" style="width: 5em"></svg>
  </div>
  <div style="height: 3em; display: flex; flex-direction: row">
    <d3fc-svg id="x-axis" style="flex: 1; margin-right: 5em"></svg>
  </div>
</d3fc-chart>
~~~

~~~js
const data = d3.range(50)
  .map(d => ({ x: d / 3, y: Math.sin(d / 3)}));

const xScale = d3.scaleLinear();

const yScale = d3.scaleLinear();

const xAxisContainer = d3.select('#x-axis')
  .on('draw', (d, i, nodes) => {
    const { width } } = d3.event.detail;
    xScale.range([0, width]);
    const xAxis = d3.axisBottom(xScale);
    d3.select(nodes[i])
      .select('svg')
      .call(xAxis);
  });

const yAxisContainer = d3.select('#y-axis')
  .on('draw', (d, i, nodes) => {
    const { height } = d3.event.detail;
    yScale.range([height, 0]);
    const yAxis = d3.axisRight(yScale);
    d3.select(nodes[i])
      .select('svg')
      .call(yAxis);
  });

const plotAreaContainer = d3.select('#plot-area')
  .on('measure', () => {
    const { detail: { width, height } } = d3.event;
    xScale.range([0, width]);
    yScale.range([height, 0]);
  })
  .on('draw', (d, i, nodes) => {
    const lineSeries = fc.seriesSvgLine()
      .xScale(xScale)
      .yScale(yScale);
    d3.select(nodes[i])
      .select('svg')
      .datum(data)
      .call(lineSeries);
  });

const chartContainer = d3.select('#chart')
  .on('draw', () => {
    const xExtent = fc.extentLinear()
      .accessors([d => d.x]);
    xScale.domain(xExtent(data));

    const yExtent = fc.extentLinear()
      .accessors([d => d.y]);
    yScale.domain(yExtent(data));
  });

// For completeness, request an intial redraw
chartContainer.node()
  .requestRedraw();

setInterval(() => {
  const n = data.length;
  data.push({ x: n / 3, y: Math.sin(n / 3)});

  chartContainer.node()
    .requestRedraw();
}, 1);
~~~

With our final requirement fulfilled `d3fc-group` has one final tick up its sleeve. Whilst it's impossible for an element to know when it has been resized in a performance-sensitive way, we can watch for `resize` events on `window` and make an educated guess that it's probably caused the element to resize. Therefore, if you add the `auto-resize` attribute to the `d3fc-group` element it will start responding to `window` `resize` events by internally invoking `requestRedraw` -

~~~html
<d3fc-group auto-resize id="chart" style="display: flex; height: 40vw; width: 60vw; flex-direction: column">
  <!-- ... -->
</d3fc-group>
~~~

As described this technique relies on an educated guess so isn't perfect. Therefore it's an opt-in feature so you can avoid triggering spurious redraws in performance critical scenarios.

### Check them out

All of the code for these custom elements is available on [GitHub](https://github.com/d3fc/d3fc-element) along with a number of examples. They are part of a wider project to called [d3fc](https://d3fc.io) which aims to supplement d3's modules with additional modules of useful functionality.
