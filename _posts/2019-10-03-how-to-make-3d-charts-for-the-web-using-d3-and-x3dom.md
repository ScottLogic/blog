---
title: How to Make 3D Charts for the Web Using D3 and X3DOM
date: 2019-10-03 00:00:00 Z
categories:
- Tech
author: asureshkumar
layout: default_post
summary: In this blog post we consider a practical example of how the D3 and X3DOM libraries can be used together to build dynamic 3D charts for the web.
---

## Introduction
In my [previous blog post]({{ site.github.url }}/2019/08/27/declarative-3d-for-the-modern-web.html) we looked at the [X3DOM](https://www.x3dom.org/) library and how it offers a declarative approach for rendering 3D graphics in any modern web browser. We will now consider a practical example of how this can be combined with [D3](https://d3js.org/) to make dynamic data-driven 3D charts, or more specifically, a 3D doughnut chart!

## X3D Representation
Before we start writing any D3 code, let's first consider how we can represent a doughnut chart in an X3D document.  Whilst not part of the underlying X3D standard, the X3DOM library provides us with a [Torus node](https://doc.x3dom.org/author/Geometry3D/Torus.html) that we can use to represent our doughnut shape.

~~~ html
<html>
  <head>
    <title>Sphere: X3DOM</title>
    <script src="http://www.x3dom.org/release/x3dom-full.js"></script>
    <link rel="stylesheet" href="http://www.x3dom.org/release/x3dom.css">
    <style>
        html { height: 100%; width: 100%; }
        body { height: 100%; width: 100%; margin: 0px; }
        x3d { height: 100%; width: 100%; }
        x3d > canvas { display: block; }
    </style>
  </head>
  <body>
    <x3d>
      <scene>
        <shape>
          <appearance>
            <material diffuseColor="1 0 0"></material>
          </appearance>
          <torus></torus>
        </shape>
      </scene>
    </x3d>
  </body>
</html>
~~~

In this first [example]({{ site.github.url }}/asureshkumar/assets/2019-10-03-how-to-make-3d-charts-for-the-web-using-d3-and-x3dom/torus.html) we have simply defined a torus shape and specified that it should be coloured red.

In order to make a chart we will need to divide the full torus into segments. This is possible by setting the angle attribute on the torus as shown in the following [example]({{ site.github.url }}/asureshkumar/assets/2019-10-03-how-to-make-3d-charts-for-the-web-using-d3-and-x3dom/torus-single-segment.html). This limits the torus to an arc of the specified angle (in radians) rather than being a fully closed ring.

~~~ html
<torus angle="2.094"></torus>
~~~

One point to note here is that the torus segment starts at the 3 o'clock position and is drawn clockwise from there. Whilst the drawing direction is as expected, traditionally we would expect this to start at the 12 o'clock position. We therefore also need to apply a rotation transform to our shape as shown [here]({{ site.github.url }}/asureshkumar/assets/2019-10-03-how-to-make-3d-charts-for-the-web-using-d3-and-x3dom/torus-single-segment-rotated.html):

~~~ html
<transform rotation="0 0 1 1.571">
  <shape>
    <appearance>
      <material diffuseColor="1 0 0"></material>
    </appearance>
    <torus angle="2.094"></torus>
  </shape>
</transform>
~~~

The first three numbers in the rotation specify the axis about which we wish to rotate our shape. In this case we need to rotate about the z-axis by 90° (or π/2 radians).

This approach will also enable us to build up a full torus composed of multiple segments, by rotating each segment to start where the previous segment ends.

~~~ html
<transform rotation="0 0 1 1.571">
  <transform rotation="0 0 1 0">
    <shape>
      <appearance>
        <material diffuseColor="1 0 0"></material>
      </appearance>
      <torus angle="2.094"></torus>
    </shape>
  </transform>
  <transform rotation="0 0 1 2.094">
    <shape>
      <appearance>
        <material diffuseColor="0 1 0"></material>
      </appearance>
      <torus angle="2.094"></torus>
    </shape>
  </transform>
  <transform rotation="0 0 1 4.188">
    <shape>
      <appearance>
        <material diffuseColor="0 0 1"></material>
      </appearance>
      <torus angle="2.094"></torus>
    </shape>
  </transform>
<transform>
~~~

We now have a [prototype]({{ site.github.url }}/asureshkumar/assets/2019-10-03-how-to-make-3d-charts-for-the-web-using-d3-and-x3dom/torus-multiple-segments.html) of something that resembles a 3D doughnut chart! However, handcrafting a sequence of torus segments to match the data is clearly not going to be a practical solution, so let's now introduce some D3 code to automate the process.

## D3 Chart Definition

In his article '[Towards Reusable Charts](https://bost.ocks.org/mike/chart/)' creator of D3, Mike Bostock, recommends implementing charts as "closures with getter-setter methods". This is therefore also the pattern that we will follow here.

Let's look at what this would look like for our doughnut chart:

~~~ javascript
const chart = function() {
  let data = [];

  const renderFn = function(selection) {
    // Render code goes here!
  };

  renderFn.data = function(value) {
    if (arguments.length === 0) {
      return data;
    }
    data = value;
    return renderFn;
  };

  return renderFn;
}
~~~

We define a `chart` function which contains a local variable `data` which will store the data to be rendered by the chart. We then define a local function `renderFn` which has access to this variable and will use it to render the chart (we will come back to the implementation of this later). We also attach a `data` function to `renderFn` which will act as both a getter and a setter for the `data` variable.

We can now create and configure the chart rendering function with the following code:

~~~ javascript
const renderChart = chart()
  .data([
    { color: d3.rgb(255, 0, 0), value: 1 },
    { color: d3.rgb(0, 255, 0), value: 1 },
    { color: d3.rgb(0, 0, 255), value: 1 }
  ]);
~~~

We are passing in an array of 3 data items with equal values to display in the chart. This describes the same chart that we hard-coded previously in our prototype.

In this case we have used the `data` function as a setter by providing it with an argument. This will set the value of the `data` variable that the render function has access to. It will also return the render function itself allowing us to chain calls to any further getter-setter methods that we might define in future.

We could also call the `data` function without any arguments to get the current value of the underlying `data` variable:

~~~ javascript
console.log(JSON.stringify(renderChart.data()));
// > [
//     {"color":{"r":255,"g":0,"b":0,"opacity":1},"value":1},
//     {"color":{"r":0,"g":255,"b":0,"opacity":1},"value":1},
//     {"color":{"r":0,"g":0,"b":255,"opacity":1},"value":1}
//   ]
~~~

We can now render the chart by calling the render function on a selection. Here we will render our chart directly beneath the HTML body element:

~~~ javascript
d3.select("body").call(renderChart);
~~~

## D3 Render Implementation

We have created a reusable component to represent our chart, but it doesn't yet do anything useful. We now need to implement the render function.

~~~ javascript
const renderFn = function(selection) {
  // Render code goes here!
};
~~~

First of all we need to calculate the length and starting position of each doughnut slice as an angle in radians. We get the sum of the values for each datum and use this to calculate the fraction of the doughnut taken up by each slice. We then start each slice after the end of the previous slice.

~~~ javascript
const sum = data.reduce((sum, datum) => sum + datum.value, 0);

const slices = [];
data.forEach((datum, index) => {
  const prev = index > 0 ? slices[index - 1] : null;
  slices.push({
    color: datum.color,
    length: 2 * Math.PI * datum.value / sum,
    start: prev ? prev.start + prev.length : 0
  })
});
~~~

This model now represents the data that we want to bind to our DOM.

We want our selection to contain a single `x3d` element at the root. We therefore select all `x3d` elements under the selection and perform a data join between this selection and an array containing a single element (the array containing our slices).

~~~ javascript
selection
  .selectAll("x3d")
  .data([slices])
  .join("x3d")
~~~

The `data` function matches each of the existing nodes in the selection to the items of data in the provided array and binds each item of data in the array to the corresponding node. Mike Bostock provides a comprehensive explanation of this process in his article '[How Selections Work](https://bost.ocks.org/mike/selection/)'.

The `join` function then takes care of both inserting missing nodes and removing any extra nodes. Note that [this function](https://observablehq.com/@d3/selection-join) is fairly new to D3 and provides a much simpler approach than the [general update pattern](https://bl.ocks.org/mbostock/3808218) which was recommended previously.

We can use the same approach to ensure that we have a single `scene` element below the single `x3d` element in the parent selection. In this case we perform the data join against the data bound to the parent selection (rather than setting this explicitly as we did at the root).

~~~ javascript
  .selectAll("scene")
  .data(d => [d])
  .join("scene")
~~~

We then add a single `transform` element at the root of the scene with our 90° rotation to ensure that the chart starts at 12 o'clock. However, as we will be using several levels of transforms we need to be more specific in our selection to ensure that we only select the node we expect and not any of the per-slice transforms below. In this case we have used a class to mark the node - but any alternative approach that achieves this would also be fine.

~~~ javascript
  .selectAll("transform.chart")
  .data(d => [d])
  .join("transform")
    .attr("class", "chart")
    .attr("rotation", `0 0 1 ${Math.PI / 2}`)
~~~

The next level are our `transform` elements which will rotate each of their associated torus shapes to their starting positions. Note that as we need a node per item we bind _directly_ to the data associated with the parent selection, which is our array of slice data. Previously we were wrapping this array in an additional array to signify that we only needed a single child element.

~~~ javascript
  .selectAll("transform.chart-slice")
  .data(d => d)
  .join("transform")
    .attr("class", "chart-slice")
    .attr("rotation", d => `0 0 1 ${-d.start}`)
~~~

All that now remains is to ensure that we have our torus shape rendered below each of the parent `transform` elements. The use of `call` here allows us to maintain the chained function call where we branch off to create multiple nodes below the parent `shape` element.

~~~ javascript
  .selectAll("shape")
  .data(d => [d])
  .join("shape")
  .call(s => s
    .selectAll("torus")
    .data(d => [d])
    .join("torus")
      .attr("angle", d => d.length)
  )
  .call(s => s
    .selectAll("appearance")
    .data(d => [d])
    .join("appearance")
    .selectAll("material")
    .data(d => [d])
    .join("material")
      .attr("diffuseColor", d => `${d.color.r / 255} ${d.color.g / 255} ${d.color.b / 255}`)
  );
~~~

We now have a complete [example]({{ site.github.url }}/asureshkumar/assets/2019-10-03-how-to-make-3d-charts-for-the-web-using-d3-and-x3dom/torus-multiple-segments-d3.html) that will generate our chart based on the specified data.

## Dynamic Updates and Transitions

Let's change our example to update the chart data dynamically with random values on a timer interval:

~~~ javascript
const renderChart = chart();

function update() {
  renderChart.data([
      { color: d3.rgb(255, 0, 0), value: Math.random() },
      { color: d3.rgb(0, 255, 0), value: Math.random() },
      { color: d3.rgb(0, 0, 255), value: Math.random() }
    ]);

  d3.select("body")
    .call(renderChart);
}

update();
d3.interval(update, 5000);
~~~

An important point to note here is that we call our `update` function *immediately*. This ensures that an `x3d` element has been created in the DOM when our page loads. If we omit this, then nothing will ever be rendered on the screen - even when the initial interval has elapsed! The DOM elements will be  updated by D3 as expected, but X3DOM will not be monitoring the DOM for changes and rendering our scene onto its internal canvas using WebGL.

It would also be nice if our chart updated smoothly. We can use a D3 transition to animate the updates to the transform rotation and torus angle attributes:

~~~ javascript
.selectAll("transform.chart-slice")
.data(d => d)
.join("transform")
  .attr("class", "chart-slice")
  .call(s => s
    .transition()
      .attr("rotation", d => `0 0 1 ${-d.start}`)
  )
~~~

~~~ javascript
.selectAll("torus")
.data(d => [d])
.join("torus")
  .attr("useGeoCache", false)
  .call(s => s
    .transition()
      .attr("angle", d => d.length)
  )
~~~

Note that here we have also set the `useGeoCache` attribute to `false` on our torus. Otherwise the internal caching of the geometry in X3DOM will cause some unexpected results as the transitions are applied!

We now have our doughnut chart [example]({{ site.github.url }}/asureshkumar/assets/2019-10-03-how-to-make-3d-charts-for-the-web-using-d3-and-x3dom/torus-multiple-segments-d3-transition.html) updating dynamically with smooth transitions!

## Conclusion

We've seen how we can use the declarative X3D syntax with the D3 and X3DOM libraries to produce a dynamic 3D doughnut chart for the web.

I've put together a more complete example of this approach as a small library (d3-donut-3d) which is written in [TypeScript](https://www.typescriptlang.org) and is available both on [GitHub](https://github.com/adrian-sureshkumar/d3-donut-3d) and as an [npm package](https://www.npmjs.com/package/@adrian-sureshkumar/d3-donut-3d).

However, if you are looking for a more comprehensive (and perhaps more useful!) set of charts written using these technologies, it might also be worth looking at the [d3-x3d](https://github.com/jamesleesaunders/d3-x3d) library by James Saunders.