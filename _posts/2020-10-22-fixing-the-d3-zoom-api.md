---
title: Fixing the d3-zoom API... for my use-case
date: 2020-10-22 00:00:00 Z
categories:
- Tech
author: cprice
layout: default_post
summary: d3-zoom is incredibly robust, powerful and flexible. However, its flexibility
  means it can be quite complex to configure and use correctly. This post covers one
  way of wrapping it up, reducing its flexibility but vastly simplifying its use for
  my use-case.
---

d3-zoom is incredibly robust, powerful and flexible. However, its flexibility means it can be quite complex to configure and use correctly. This post covers one way of wrapping it up, reducing its flexibility but vastly simplifying its use for my use-case.

## d3-zoom

To shape the discussion, we'll be creating the chart below which allows you to pan and zoom the the plot-area using your mouse or touch interactions-

<iframe src="https://d3fc.io/examples/chart-d3-zoom/" style="width:100%;height:30vh;border:none"></iframe>

*This first section runs through an example of how to use d3-zoom. If you've already [sucked that particular egg](https://en.wikipedia.org/wiki/Teaching_grandmother_to_suck_eggs), I'd recommend skipping ahead to the [next section](#creating-a-new-component).*

~~~js
const prng = d3.randomNormal();

const data = d3.range(1e3).map(d => ({
    x: prng(),
    y: prng()
}));

const x = d3.scaleLinear().domain([-5, 5]);
const y = d3.scaleLinear().domain([-5, 5]);

const x2 = x.copy();
const y2 = y.copy();
~~~

This first chunk of code is just creating some random x/y data points located around the origin and associated x/y scales to render the values with hard-coded domains.

The noteworthy part of this code is the last two lines which create copies of the scales. These will be very important later...

*The remaining code snippets make use of [D3FC](https://d3fc.io/) components. However, the underlying concepts should be familiar from, and are readily applicable to, vanilla D3.*

~~~js
const series = fc
    .seriesCanvasPoint()
    .crossValue(d => d.x)
    .mainValue(d => d.y)
    .size(4);

const zoom = d3.zoom().on('zoom', event => {
    x.domain(event.transform.rescaleX(x2).domain());
    y.domain(event.transform.rescaleY(y2).domain());
    render();
});
~~~

Again this code starts off rather uninteresting, just creating a point series configured to render the data points.

The second part of this code is where most of the action happens. We create a d3-zoom component/behaviour and listen for its `zoom` event which is triggered when the user interacts with the selection (we'll cover how this is associated with a selection below).

Within the event handler, we receive a [zoomTransform](https://github.com/d3/d3-zoom#zoomTransform) which represents the **combined effect of all interactions since the zoom behaviour was applied to the selection** (or was explicitly reset).

This means that we need to use the rescale utilities from the transform on the x/y scale copies we created earlier (`x2`/`y2`), rather than the previously rescaled ones (`x`/`y`). Effectively, the copied scales represent the baseline on which the transform should be applied. The previously rescaled ones are the working scales which have already had a transform applied to them.

~~~js
const chart = fc
    .chartCartesian(x, y)
    .chartLabel('Canvas Zoom 1,000 Points')
    .canvasPlotArea(series)
    .decorate(sel => {
        sel.enter()
            .selectAll('.x-axis')
            .on('measure.range', event => {
                x2.range([0, event.detail.width]);
            });
        sel.enter()
            .selectAll('.y-axis')
            .on('measure.range', event => {
                y2.range([event.detail.height, 0]);
            });
        sel.enter()
            .selectAll('.plot-area')
            .call(zoom);
    });
~~~

This code block creates a cartesian chart, then configures it with the x/y scales and series. The [decorate](https://github.com/d3fc/d3fc/blob/master/docs/decorate-pattern.md) function is really the only interesting bit, when the elements are created it-

* Listens to `measure` events on the axes to ensure the range values on the copies of the x/y scales are kept up-to-date. These are used internally by the rescaleX/Y transform utilities. 
* Applies the zoom behaviour to the plot-area which internally adds the listeners for user interactions.

As the decorate method is manipulating the internals of the chart component, it requires some defensive programming. The `selectAll` method is used, rather than `select`, to avoid interfering with the data binding established by the chart component (using `select` modifies bound data). Also, the event handlers are namespaced `.range` to avoid interfering with the existing handlers added by the chart component (which are un-namespaced).

~~~js
function render() {
    d3.select('#zoom-chart')
        .datum(data)
        .call(chart);
}

render();
~~~

Finally, we have the render function itself which associates the data with the target container and invokes the chart component. 

With that we've got all the code we need for the above example. It really isn't very much code to add zoom behaviour to a chart. The d3-zoom component takes care of an awful lot of the low-level interaction handling for us. 

However, the component's flexibility does mean the API isn't as ergonomic as it could be for the above use-case. Ideally we wouldn't need to concern ourselves with details like maintaining a second set of scales, applying the transform to the scales or maintaining the range on those scales.

## Creating a new component

Taking our pain points from above as inspiration for a better API, an ideal component for this use-case would additionally-

* Be configurable with x/y scales for a selection
* Automatically update the domains of those scales on user interactions

In code, this might look something like-

~~~js
const zoom = fc.zoom().on('zoom', render);

// ...

chart.decorate(sel => {
    sel.enter()
        .select('.plot-area')
        .call(zoom, x, y);
});
~~~

Now that this hypothetical component provides a succinct way of associating scales with selections, it would be nice to address another common requirement which is [tricky to accomplish with d3-zoom](https://observablehq.com/@d3/x-y-zoom)-

* Easily synchronise the effect of user interactions across multiple selections

This would be useful in a chart with multiple panels sharing a single x-scale, [small-multiples](https://d3fc.io/examples/small-multiples/) charts sharing both scales or more subtle usability considerations such as allowing the user to pan or zoom an axis to mutate just its associated scale.

## d3fc-zoom

At this stage I'm sure it's no surprise that we've implemented such a new component. Below is almost exactly the same chart as the previous example, created using [d3fc-zoom](https://github.com/d3fc/d3fc/blob/master/packages/d3fc-zoom/).

<iframe src="https://d3fc.io/examples/chart-d3fc-zoom/" style="width:100%;height:30vh;border:none"></iframe>

To allow panning and zooming on the axes, the only required change to the "hypothetical" code above is to invoke the component on the axes' selections. That changes the decorate function as follows-

~~~js
chart.decorate(sel => {
    sel.enter()
        .selectAll('.plot-area')
        .call(zoom, x, y);
    sel.enter()
        .selectAll('.x-axis')
        .call(zoom, x, null);
    sel.enter()
        .selectAll('.y-axis')
        .call(zoom, null, y);
});
~~~

*Despite the use of `selectAll`, there is only one container per axis. It is functionally equivalent to `select` but avoids interfering with the data joins used to create the axis containers.*

Internally the component makes use of a d3-zoom component, registering its interaction handlers and responding to zoom events. In place of using the transform to track the state of user interactions, it relies on storing this state in the scale domains directly.

This has the advantage of allowing multiple instances to synchronise on the scale domain values. It also allows the scale domains to be directly updated by other code (e.g. a button click, streaming data, etc.), without having to worry about the transform.

The obvious downside to this approach, is in the difficulty it would have attempting to handle non-continuous scales. By using the scale domain values directly as our state, we lose the intermediate pixel-based representation of the transform. 

## How it works

*Fair warning: this goes into the weeds of the implementation. If you're just trying to use the component, you don't need to know these details and I'd recommend skipping ahead to the [next section](#conclusion).*

*To simplify the explanation in this section I'm using scale as shorthand for x and/or y scale. Additionally whilst multi-node selections are supported by the component, I'm assuming the selection contains only a single node.*

First let's consider how d3-zoom works. Assuming there's an existing transform (`t0`) associated with a selection. The user's interaction causes the component to produce a delta to that transform (`dt`). 

Both of values are combined to produce the transform (`t1 = t0 + dt`) passed into the event handler. This transform is also stored against the selection as a property on the DOM node.

This combination of the existing transform and the delta is what causes problems if we had already applied the previous transform to the scale. In that case we've effectively double-applied the previous transform, leading to some exciting/confusing exponential responses to user interactions.

At its core, d3fc-zoom performs the same workarounds we demonstrated above. When associated with a selection, the component is also passed the working scale. This is stored against the DOM node, along with a copy to act as a baseline when applying transforms. 

Then when the internal d3-zoom component emits a `zoom` event-

* The range of the baseline scale is updated with the current range of the working scale.
* The baseline scale is combined with the transform using the rescale utility to produce a resulting scale.
* The domain of the resulting scale is then used to update the working scale.

The novel part of d3fc-zoom is permitting external modification of the domain of the working scale. This can happen either through the domain being explicitly set or by a `zoom` event on a different selection associated with the same scale.

To handle this situation the component additionally stores-
 * Another copy of the scale representing the previous or last observed state of the scale (after the rescale operation has been performed). 
 * A copy of the transform representing the previous or last observed state of the transform. 

If it detects that the domain of the working scale is different to its previous state, it knows that the domain has been externally modified. In this case, simply applying the transform passed into the event handler to the baseline scale would produce an incorrect result, because `t0` does not represent the difference between the previous scale and the baseline scale.

Instead the component computes the transform delta (`dt = t1 - t0`), resets the baseline to a new copy of the working scale, applies the delta (`dt`) to this baseline and then updates the working scale with the resulting domain.

That was a lot harder to describe in words than it was to code, so you might get a better understanding from a quick look at the [implementation](https://github.com/d3fc/d3fc/blob/master/packages/d3fc-zoom/src/zoom.js).

## Conclusion

I've no doubt that the new API we've created for [d3fc-zoom](https://github.com/d3fc/d3fc/blob/master/packages/d3fc-zoom/) will not have the flexibility to address, or worse still break for, other people's use-cases. However, for the common use-cases I'm familiar with implementing, I've found it really powerful and easy-to-use.

In fact, I'd argue it's generally true that by adding constraints to a problem you open yourself up to simpler solutions. Solutions that ultimately allow you to focus on the details that you consider important.

I guess that's why I'm not a Linux user...