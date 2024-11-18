---
title: An interactive crosshairs component for D3
date: 2014-09-29 00:00:00 Z
categories:
- Tech
tags:
- d3
author: aaiken
summary: In my last article I put together an interactive chart that could be panned and zoomed, but there was one obvious omission - crosshairs. In this article I'm going to create a D3 crosshairs component, and show you how to add it to a chart.
image: aaiken/assets/featured/crosshairFeatured.jpg
image-attribution: image courtesy of <a href="https://www.flickr.com/photos/natureindyablogspotcom/">Vivek Raj</a>
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/09/29/crosshairs.html
disqus-id: "/2014/09/29/crosshairs.html"
---

<link rel="stylesheet" href="{{ site.baseurl }}/aaiken/assets/crosshairs/style/style.css" />
<script src="{{ site.baseurl }}/aaiken/assets/crosshairs/js/require.config.js">
</script>
<script data-main="{{ site.baseurl }}/aaiken/assets/crosshairs/js/Chart.js" src="{{ site.baseurl }}/aaiken/assets/crosshairs/js/lib/require.js">
</script>

> **Quick update** - the code in this article was used as the starting point for components in [the d3fc project](https://d3fc.io/).
> It's a bit more advanced than this article, but you might find it interesting to see what this code evolved into!

In [my last article]({{ site.baseurl }}/2014/09/19/interactive.html) I put together an interactive chart that could be panned and zoomed, but there was one obvious omission - crosshairs. In this article I'm going to create a D3 crosshairs component, and show you how to add it to a chart.

Here's the chart we're going to build:

<div id="chart">
</div>

You can see that, when you move your mouse over the chart, crosshairs appear on the chart to give you information about the data point the mouse is nearest to. This should also work if you're on a touch screen device - you'd just tap on a data point to bring up the crosshairs, or tap off the chart to clear them - but I have to admit I haven't tested this.

I'm going to approach this project in the same way I approached the [line annotation]({{ site.baseurl }}/2014/08/26/two-line-components-for-d3-charts.html) and [Bollinger Bands]({{ site.baseurl }}/2014/08/28/bollinger.html) components - that is, by breaking the work down into three sections:

* First we write the component (this is obviously where the majority of the work goes)
* Then we style the component
* Finally the add the component to a chart

Let's get cracking!

## The Crosshairs Component

Here's the full code for the crosshairs component - I've left it in one block so it's easier for you to copy & paste. Underneath, we'll go through the code and explain what's going on.

{% highlight javascript %}
sl.series.crosshairs = function () {

    var target = null,
        series = null,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        yValue = 'y',
        formatH = null,
        formatV = null;

    var lineH = null,
        lineV = null,
        circle = null,
        calloutH = null,
        calloutV = null;

    var highlight = null;

    var crosshairs = function (selection) {

        var root = target.append('g')
            .attr('class', 'crosshairs');

        lineH = root.append("line")
            .attr('class', 'crosshairs horizontal')
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1])
            .attr('display', 'none');

        lineV = root.append("line")
            .attr('class', 'crosshairs vertical')
            .attr('y1', yScale.range()[0])
            .attr('y2', yScale.range()[1])
            .attr('display', 'none');

        circle = root.append("circle")
            .attr('class', 'crosshairs circle')
            .attr('r', 6)
            .attr('display', 'none');

        calloutH = root.append("text")
            .attr('class', 'crosshairs callout horizontal')
            .attr('x', xScale.range()[1])
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');

        calloutV = root.append("text")
            .attr('class', 'crosshairs callout vertical')
            .attr('y', '1em')
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');
    };

    function mousemove() {

        var xMouse = xScale.invert(d3.mouse(this)[0]),
            nearest = findNearest(xMouse);

        if ((nearest !== null) && (nearest !== highlight)) {

            highlight = nearest;

            var x = xScale(highlight.date),
                y = yScale(highlight[yValue]);

            lineH.attr('y1', y)
                .attr('y2', y);
            lineV.attr('x1', x)
                .attr('x2', x);
            circle.attr('cx', x)
                .attr('cy', y);
            calloutH.attr('y', y)
                .text(formatH(highlight));
            calloutV.attr('x', x)
                .text(formatV(highlight));

            lineH.attr('display', 'inherit');
            lineV.attr('display', 'inherit');
            circle.attr('display', 'inherit');
            calloutH.attr('display', 'inherit');
            calloutV.attr('display', 'inherit');
        }
    }

    function mouseout() {

        highlight = null;

        lineH.attr('display', 'none');
        lineV.attr('display', 'none');
        circle.attr('display', 'none');
        calloutH.attr('display', 'none');
        calloutV.attr('display', 'none');
    }

    function findNearest(xMouse) {

        var nearest = null,
            dx = Number.MAX_VALUE;

        series.forEach(function(data) {

            var xData = data.date,
                xDiff = Math.abs(xMouse.getTime() - xData.getTime());

            if (xDiff < dx) {
                dx = xDiff;
                nearest = data;
            }
        });

        return nearest;
    }

    crosshairs.target = function (value) {
        if (!arguments.length) {
            return target;
        }

        if (target) {

            target.on('mousemove.crosshairs', null);
            target.on('mouseout.crosshairs', null);
        }

        target = value;

        target.on('mousemove.crosshairs', mousemove);
        target.on('mouseout.crosshairs', mouseout);

        return crosshairs;
    };

    // ... other property accessors omitted, but they'd go here

    return crosshairs;
};    
{% endhighlight %}

OK, now let's go through this and talk about what's going on.

### Declarations

At the top of the component we set up the various user-configurable properties we require. They are:

* `target`: the area we're going to be adding our crosshairs elements to
* `series`: the data series
* `xScale` and `yScale`: the X and Y scales, which we need to determine positioning
* `yValue`: the name of the field on the data model that we're going to use for the Y-value (we'll assume that the X-value field is 'date')
* `formatH` and `formatV`: callbacks that we're going to use to format the text for the horizontal line and the vertical line respectively

We also declare variables to hold the five SVG elements that our crosshairs component will comprise:

* a horizontal line
* a vertical line
* a circle (at the intersection of the horizontal and vertical lines)
* a value callout for the horizontal line
* a value callout for the vertical line

We then declare a variable called `highlight`, which will hold the currently highlighted data point.

### Component function

In the component function we initialise the SVG elements as follows:

* for the `lineH` element, we set the X co-ordinates so that the line reaches all the way across the target area
* similarly, we set the Y co-ordinates for the `lineV` element so that it takes up the whole height of the target area
* we set the `r` (radius) property on the `circle` element
* for `calloutH` we set the `x` co-ordinate so that the text appears at the right hand side of the chart, and we set the `text-anchor` style attribute to `end` so that the text is right-aligned
* for `calloutV` we set the `y` co-ordinate so that the text appears just below the top of the chart, and we set the `text-anchor` style attribute as above

Each of the elements is also given a unique set of CSS classes, and we set `display=none` on each element so that they are initially not shown.

### Property accessors

Jumping ahead a little, let's look at the property accessor I've included in the code above, for the `target` property. Accessors are implemented for the other properties but I've left them out of the code block above because they're all standard get/set accessors, whereas this one's slightly different.

To save you scrolling back up, here's the relevant code again...

{% highlight javascript %}
crosshairs.target = function (value) {
    if (!arguments.length) {
        return target;
    }

    if (target) {

        target.on('mousemove.crosshairs', null);
        target.on('mouseout.crosshairs', null);
    }

    target = value;

    target.on('mousemove.crosshairs', mousemove);
    target.on('mouseout.crosshairs', mouseout);

    return crosshairs;
};
{% endhighlight %}

... but in essence the only extra thing we're doing here is adding handlers for the `mouseover` and `mouseout` events when we set the property - and clearing those event handlers if we reset the property.

### Event handlers

Let's look at those event handlers now. The first one, `mousemove`, is the more programmatically interesting one:

{% highlight javascript %}
function mousemove() {

    var xMouse = xScale.invert(d3.mouse(this)[0]),
        nearest = findNearest(xMouse);

    if ((nearest !== null) && (nearest !== highlight)) {

        highlight = nearest;

        var x = xScale(highlight.date),
            y = yScale(highlight[yValue]);

        lineH.attr('y1', y)
            .attr('y2', y);
        lineV.attr('x1', x)
            .attr('x2', x);
        circle.attr('cx', x)
            .attr('cy', y);
        calloutH.attr('y', y)
            .text(formatH(highlight));
        calloutV.attr('x', x)
            .text(formatV(highlight));

        lineH.attr('display', 'inherit');
        lineV.attr('display', 'inherit');
        circle.attr('display', 'inherit');
        calloutH.attr('display', 'inherit');
        calloutV.attr('display', 'inherit');
    }
}
{% endhighlight %}

What's happening here is pretty straightforward though. We use `xScale.invert()` to get the date value of the location of the mouse, and then we call `findNearest()` (see below) to find the data point closest to that date.

If we have a data point (and it's not the one that's currently highlighted) then we spring into action:

* We get the X and Y co-ordinates for the point we're going to highlight
* We set these co-ordinates on our SVG elements, moving them all to the correct places on the chart
* We set the text of our `calloutH` and `calloutV` elements by delegating to the `formatH` and `formatV` callbacks respectively
* We show the SVG elements by setting `display=inherit` on each one

The second event handler, `mouseout`, is much simpler:

{% highlight javascript %}
function mouseout() {

    highlight = null;

    lineH.attr('display', 'none');
    lineV.attr('display', 'none');
    circle.attr('display', 'none');
    calloutH.attr('display', 'none');
    calloutV.attr('display', 'none');
}
{% endhighlight %}

All we're doing here is clearing the `highlight` field and hiding all the SVG elements when the mouse leaves the target area.

The last bit of code to look at is the `findNearest()` function:

{% highlight javascript %}
function findNearest(xMouse) {

    var nearest = null,
        dx = Number.MAX_VALUE;

    series.forEach(function(data) {

        var xData = data.date,
            xDiff = Math.abs(xMouse.getTime() - xData.getTime());

        if (xDiff < dx) {
            dx = xDiff;
            nearest = data;
        }
    });

    return nearest;
}
{% endhighlight %}

This is pretty self-explanatory - we're just iterating through the data points in `series`, comparing their `date` fields to `xMouse` so that we find the data point which is the closest, temporally, to it.

## Styling

I'm using three CSS rules for this component - nice and simple. One is for the horizontal and vertical line elements, one is for the circle element, and the last is for the two text elements. If you look at the CSS you can see that the rule for the lines and the rule for the circle is identical - I'm really just setting the colour. For the text elements I'm copying the style of the axis labels (10pt sans serif).

The important thing to note here is that the user *could* style each element differently if they wanted to, without having to get into the JavaScript, as each element has a unique set of CSS classes - this component is very stylable.

{% highlight css %}
.chart line.crosshairs {
    fill: none;
    stroke: blue;
    stroke-width: 1;
    stroke-opacity: 0.5;
}

.chart circle.crosshairs {
    fill: none;
    stroke: blue;
    stroke-width: 1;
    stroke-opacity: 0.5;
}

.chart text.crosshairs {
    font: 10px sans-serif;
}
{% endhighlight %}

## Adding it to the chart

The final step is to add the crosshairs component to a chart.

Rather than create a chart from scratch, I'm starting with the OHLC chart that Tom developed in his article on [OHLC and candlestick components]({{ site.baseurl }}/2014/08/19/an-ohlc-chart-component-for-d3.html).

To add the crosshairs component, I'm firstly using a trick I learned in [my previous article]({{ site.baseurl }}/2014/09/19/interactive.html) - adding an invisible overlay onto the chart area. If we don't do this, the `mouseover()` event will only be fired when we mouse over a data point, but adding this we get the events fired when the mouse moves anywhere on the chart area.

Once that's created, we initialise the crosshairs component, providing values for all the properties we defined.

Finally we add the overlay to the chart area, and call the crosshairs component on it.

{% highlight javascript %}
var overlay = d3.svg.area()
    .x(function (d) { return xScale(d.date); })
    .y0(0)
    .y1(height);

var crosshairs = sl.series.crosshairs()
    .target(plotArea)
    .series(data)
    .xScale(xScale)
    .yScale(yScale)
    .yValue('close')
    .formatV(function(data) { return d3.format('.1f')(data.close); })
    .formatH(function(data) { return d3.time.format('%b %e')(data.date); });

plotArea.append('path')
    .attr('class', 'overlay')
    .attr('d', overlay(data))
    .call(crosshairs);
{% endhighlight %}

The following bit of CSS makes our overlay invisible:

{% highlight css %}
.chart .overlay {
    stroke-width: 0px;
    fill-opacity: 0;
}
{% endhighlight %}

And with that, we're done! We've created the interactive chart you see above.

## Enhancements

As we've learned from [my previous article]({{ site.baseurl }}/2014/09/19/interactive.html), when you add multiple modes of interactivity to a chart, most of your time is spent making sure everything is synchronised correctly. If we added this crosshairs component to the interactive chart we developed in that article, we'd soon run into a problem - when you zoomed the chart, the crosshairs would stay in the same place because they only respond to the mouse moving over the chart (panning the chart probably wouldn't be a problem, because you need to move the mouse to do that).

Luckily there's an easy fix for this issue - all we'd have to do would be to refactor the drawing code from `mousemove()` into its own method, maybe called `update()`, and then call `crosshairs.update()` whenever a zoom would cause the chart to be redrawn.

## Conclusion

I wanted to create a D3 component to add crosshairs to a chart. The component is comprised of five SVG elements, which are updated on `mousemove` and `mouseout` events. The component can be styled in whatever way the user needs.























