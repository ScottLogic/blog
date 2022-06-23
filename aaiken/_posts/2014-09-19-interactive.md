---
author: aaiken
title: Creating an interactive chart with D3
summary: >-
  Recently I've been looking at various D3 components, which has been a fun
  project. I haven't yet had the chance to develop an interactive, dynamic
  component though, which has meant that the resulting charts have been sadly
  static. For this article I wanted to use what I've learned to build a fully
  interactive chart - something that wouldn't look out of place on a financial
  app.
image: aaiken/assets/featured/none.jpg
tags:
  - d3
categories:
  - Tech
layout: default_post
oldlink: 'http://www.scottlogic.com/blog/2014/09/19/interactive.html'
disqus-id: /2014/09/19/interactive.html
---
<link rel="stylesheet" href="{{ site.baseurl }}/aaiken/assets/interactive/style/style.css" />
<script src="{{ site.baseurl }}/aaiken/assets/interactive/js/require.config.js">
</script>
<script data-main="{{ site.baseurl }}/aaiken/assets/interactive/js/Chart.js" src="{{ site.baseurl }}/aaiken/assets/interactive/js/lib/require.js">
</script>

> **Quick update** - the code in this article was used as the starting point for components in [the d3fc project](https://d3fc.io/).
> It's a bit more advanced than this article, but you might find it interesting to see what this code evolved into!

Recently I've been looking at various D3 components, which has been a fun project. I haven't yet had the chance to develop an interactive, dynamic component though, which has meant that the resulting charts have been sadly static. For this article I wanted to use what I've learned to build a fully interactive chart - something that wouldn't look out of place on a financial app.

Here's the chart we're going to build:

<div id="chart">
</div>

Let's take a moment to go over this chart's interactive features (which work equally well whether you're using a mouse or touch gestures).

The lower chart, in grey, is what I'm going to call the **navigation chart**. It shows the full extent of the data set. The darker grey box (which I'm calling the **viewport**) shows the current view - ie, what's currently being shown in the main chart - which means that you can see at a glance the relationship between the part of the data you're looking at and the rest of the dataset. You can do quite a few useful things with this box:

* Drag it left / right to scroll through the data on the main chart
* Click and drag the left and right edges to increase / decrease the amount of data shown
* Click off it to get rid of it, and so show the full data set in the main chart
* Click off it and drag to create a new box

The main chart is also interactive. You can:

* Click and drag the chart data left or right (panning)
* Use the mouse wheel to zoom in or out

As you can see, the navigation viewport automatically adjusts its size and position to match the data shown in the main chart when you pan or zoom.

Note: As with my previous D3 posts, my starting point for this work was the chart Tom developed in his article on [OHLC and candlestick components]({{ site.baseurl }}/2014/08/19/an-ohlc-chart-component-for-d3.html) - you'll see that I'm using his candlestick chart here.

## Putting it Together

Although there's not a huge amount of code for this project, it'd be rather a lot to digest all in one go, so let's put the chart together bit by bit, and I'll explain everything as I go.

### Setting up the data

The first thing we do is to set up the data we're going to show on our chart. We're using randomly generated time series data, and we're mimicking real-world financial data by only having data points for weekdays.

{% highlight javascript %}
var data = new MockData(0.1, 0.1, 100, 50, function (moment) {
        return !(moment.day() === 0 || moment.day() === 6);
    })
    .generateOHLC(new Date(2014, 1, 1), new Date(2014, 8, 1));
{% endhighlight %}

We also do a bit of data caching, calculating the minimum and maximum X and Y values we have. You probably wouldn't want to do this in the wild (especially if your data was coming in dynamically) but for our purposes it'll make the code a little easier to read.

{% highlight javascript %}
var minN = d3.min(data, function (d) { return d.date; }).getTime(),
    maxN = d3.max(data, function (d) { return d.date; }).getTime();
var minDate = new Date(minN - 8.64e7),
    maxDate = new Date(maxN + 8.64e7);
var yMin = d3.min(data, function (d) { return d.low; }),
    yMax = d3.max(data, function (d) { return d.high; });
{% endhighlight %}

### The main chart

The next step is to build the main chart. We start by defining the area in which we're going to show the chart.

{% highlight javascript %}
var margin = {top: 20, right: 20, bottom: 30, left: 35},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var plotChart = d3.select('#chart').classed('chart', true).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var plotArea = plotChart.append('g')
    .attr('clip-path', 'url(#plotAreaClip)');

plotArea.append('clipPath')
    .attr('id', 'plotAreaClip')
    .append('rect')
    .attr({ width: width, height: height });
{% endhighlight %}

Now we create the X and Y scales we're going to use for the data (we'll also be using `xScale` a lot when we add the interactive components).

{% highlight javascript %}
var xScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([0, width]),
    yScale = d3.scale.linear()
    .domain([yMin, yMax]).nice()
    .range([height, 0]);
{% endhighlight %}

We now define the X and Y axes and draw them on the chart.

{% highlight javascript %}
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5),
    yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

plotChart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

plotChart.append('g')
    .attr('class', 'y axis')
    .call(yAxis);
{% endhighlight %}

Finally, we define the data series that we're going to show (a candlestick series in this case) and draw it on the chart.

{% highlight javascript %}
var series = sl.series.candlestick()
    .xScale(xScale)
    .yScale(yScale);

var dataSeries = plotArea.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(series);
{% endhighlight %}

That's the main chart done!

### The lower chart

Let's turn to the navigation chart. As before, we start by setting up the drawing area.

{% highlight javascript %}
var navWidth = width,
    navHeight = 100 - margin.top - margin.bottom;

var navChart = d3.select('#chart').classed('chart', true).append('svg')
    .classed('navigator', true)
    .attr('width', navWidth + margin.left + margin.right)
    .attr('height', navHeight + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
{% endhighlight %}

Now we define the X and Y scales.

{% highlight javascript %}
var navXScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, navWidth]),
    navYScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([navHeight, 0]);
{% endhighlight %}

For the navigation chart, we only want an X axis, so we define and add that now.

{% highlight javascript %}
var navXAxis = d3.svg.axis()
    .scale(navXScale)
    .orient('bottom');

navChart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + navHeight + ')')
    .call(navXAxis);
{% endhighlight %}

The only thing left to do is to add the data. We're going to use a `d3.svg.area` component, but we're also going to add a `d3.svg.line` component so we can add a little visual punch.

{% highlight javascript %}
var navData = d3.svg.area()
    .x(function (d) { return navXScale(d.date); })
    .y0(navHeight)
    .y1(function (d) { return navYScale(d.close); });

var navLine = d3.svg.line()
    .x(function (d) { return navXScale(d.date); })
    .y(function (d) { return navYScale(d.close); });

navChart.append('path')
    .attr('class', 'data')
    .attr('d', navData(data));

navChart.append('path')
    .attr('class', 'line')
    .attr('d', navLine(data));
{% endhighlight %}

We style the area component with no borders, and we style the line component to be slightly darker in colour than the area.

{% highlight css %}
.navigator .data {
    fill: lightgrey;
    stroke-width: 0px;
}

.navigator .line {
    fill: none;
    stroke: darkgrey;
    stroke-width: 1px;
}
{% endhighlight %}

Now that's done, we have two charts, one above the other. Nothing interactive so far though - that comes next!

### The viewport on the lower chart

To create our viewport we're going to use a D3 component called a `brush`. The brush component automatically handles all of the behaviour I've noted above: you can drag it, resize it, and click off it to clear it.

The brush component provides three events:

* `brush`, which is called every time the brush's dimensions or position change
* `brushstart`, which is called when the brush's dimensions or position are about to change
* `brushend`, which is called when the user stops interacting with the brush

For this chart, we're going to use the `brush` event to update the `xScale.domain` and redraw the main chart.

{% highlight javascript %}
var viewport = d3.svg.brush()
    .x(navXScale)
    .on("brush", function () {
        xScale.domain(viewport.empty() ? navXScale.domain() : viewport.extent());
        redrawChart();
    });
{% endhighlight %}

The method we're calling there, `redrawChart()`, simply calls the data series and the X axis in order to redraw them following a change in the X scale. I've separated it out into its own method because we're going to need to call it from a few other places once we add panning and zooming.

{% highlight javascript %}
function redrawChart() {

    dataSeries.call(series);
    plotChart.select('.x.axis').call(xAxis);
}
{% endhighlight %}

Then we add the viewport component to the navigation chart.

{% highlight javascript %}
navChart.append("g")
    .attr("class", "viewport")
    .call(viewport)
    .selectAll("rect")
    .attr("height", navHeight);
{% endhighlight %}

For styling, I'm making the brush translucent with a dark border, to make it stand out from the navigation chart but still obviously be part of it.

{% highlight css %}
.navigator .viewport {
    stroke: grey;
    fill: black;
    fill-opacity: 0.2;
}
{% endhighlight %}

By this point we have a fully functional navigation chart - which is pretty impressive, given that the brush code is pleasingly simple.

### Zooming and panning on the main chart

The last thing to be added is the ability to zoom into / out of the main chart using the mouse wheel, and the ability to pan left and right by dragging. This is going to be a little more complicated for the following reasons:

* We don't want to let the user pan past the beginning or end of the data
* We need to update the navigation chart's viewport when we change the data shown in the main chart

Although you might expect to need another `brush` for this, we're going to use a D3 behaviour called `zoom`. This behaviour allows for zooming in and out (as you'd expect given its name) but also provides panning, which I have to admit I hadn't expected.

To use a `zoom` behaviour, we tell it about the main chart's X scale (we could also give it a Y scale if we wanted to allow interaction in that dimension as well, but we won't do that here as it doesn't really make sense in this context). It provides three events: `zoom`, `zoomstart` and `zoomend`; here we're going to handle the`zoom` event, which is called whenever the chart is zooming in, zooming out, or panning in any direction.

{% highlight javascript %}
var zoom = d3.behavior.zoom()
    .x(xScale)
    .on('zoom', function() {
        if (xScale.domain()[0] < minDate) {
	    var x = zoom.translate()[0] - xScale(minDate) + xScale.range()[0];
            zoom.translate([x, 0]);
        } else if (xScale.domain()[1] > maxDate) {
	    var x = zoom.translate()[0] - xScale(maxDate) + xScale.range()[1];
            zoom.translate([x, 0]);
        }
        redrawChart();
        updateViewportFromChart();
    });
{% endhighlight %}

The first bit of the event handler looks daunting at first glance, but all it's doing is making sure we can't pan past the start or end of the data. If the pan or zoom has caused the domain to move before the start of the data, we use the `translate` property to keep it at `minDate`; similarly, if it goes past the end of the data, we pin it to `maxDate`.

We're calling `redrawChart()` again here, to update the chart and its X-axis, but we've also introduced a new method, `updateViewportFromChart()`, which will take the new dimensions of the main chart and apply them to the viewport on the navigation chart. In this way we can start to keep the two charts synchronised.

{% highlight javascript %}
function updateViewportFromChart() {

    if ((xScale.domain()[0] <= minDate) && (xScale.domain()[1] >= maxDate)) {

        viewport.clear();
    }
    else {

        viewport.extent(xScale.domain());
    }

    navChart.select('.viewport').call(viewport);
}
{% endhighlight %}

If we to leave things at that, and add this behaviour to the data series, we'll run across an immediate issue - we'll only be able to pan and zoom when the mouse is directly over one of our candlesticks! To get around that, we can add a transparent overlay onto the main chart area, and add the behaviour to it, like so:

{% highlight javascript %}
var overlay = d3.svg.area()
    .x(function (d) { return xScale(d.date); })
    .y0(0)
    .y1(height);

plotArea.append('path')
    .attr('class', 'overlay')
    .attr('d', overlay(data))
    .call(zoom);
{% endhighlight %}

Then we just have to remember to make it transparent in the CSS:

{% highlight css %}
.chart .overlay {
    stroke-width: 0px;
    fill-opacity: 0;
}
{% endhighlight %}

Don't do what I did initially and make it white rather than transparent - you'll kick yourself as you realise the reason why your chart's suddenly disappeared.

We have one final task if we want to keep our two charts synchronised. We've already ensured that the viewport is updated when the zoom changes, now we need to ensure the reverse is also handled - the zoom must be updated when the viewport changes.

To accomplish this, I'm hooking into one of the other `brush` events, `brushend`.

{% highlight javascript %}
viewport.on("brushend", function () {
        updateZoomFromChart();
    });

function updateZoomFromChart() {

    zoom.x(xScale);
    
    var fullDomain = maxDate - minDate,
        currentDomain = xScale.domain()[1] - xScale.domain()[0];

    var minScale = currentDomain / fullDomain,
        maxScale = minScale * 20;

    zoom.scaleExtent([minScale, maxScale]);
}
{% endhighlight %}

The `updateZoomFromChart()` method needs a bit of explanation, even though it's pretty short.

Firstly, and most importantly, we need to rebind the main chart's X-scale to the zoom behaviour. It's not an obvious step - and it's one that confused me for quite a while - but without it the zooming and panning will *never* take account of changes in the main chart which are due to the viewport moving. This is because the zoom behaviour doesn't contain a reference to the X-scale object - it takes a *copy*.

The rest of this method handles zooming. There are two properties which control zooming - `scale` and `scaleExtent`:

* `scale` specifies how far to zoom in or out - it's essentially the magnification factor
* `scaleExtent` takes (or returns) a two-value array, which specify the minimum and maximum values that will be honoured for the `scale` property.

Values for these properties assume that the domain *at the point when the scale is bound* has a `scale` of 1 - the scale value for the entire domain, then, is the ratio of the current domain to the full domain. If that's difficult to visualise, consider this example: if we're currently looking at half of the total range of data, and that's a magnification factor of 1, the magnification factor for the entire dataset would be 0.5.

We set the minimum scale to be the magnification factor for the full dataset, and we set the maximum scale to be 20 times that - so, no matter what the current zoom scale is, we can always zoom out to see the full dataset, and we can always zoom in to see 1/20th of it.

Now that we've done that, the two charts are always fully synchronised.

### Final steps

There's one last thing I'd like to do with this chart: when it's loaded I'd like to see the last month or so of data by default. That's pretty simple to accomplish - we just have to modify the main chart's X-scale domain, and then update everything accordingly.

{% highlight javascript %}
var daysShown = 30;

xScale.domain([
    data[data.length - daysShown - 1].date,
    data[data.length - 1].date
]);

redrawChart();
updateViewpointFromChart();
updateZoomFromChart();
{% endhighlight %}

Done!

## Conclusion

We set out to create a simple interactive chart, and that's exactly what we've accomplished. The chart offers lots of ways to interact with it, either by mouse or touch gestures, and with the navigation chart you can quickly see the relationship between the data shown in the main chart and the entire dataset.























