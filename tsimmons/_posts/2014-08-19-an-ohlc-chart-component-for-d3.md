---
author: tsimmons
title: An OHLC Chart Component for D3
title-short: An OHLC Chart with D3
summary-short: a reusable D3 component for OHLC series
summary: >-
  An open-high-low-close chart is a type of financial chart used to show price
  movements in a financial instrument over time. In this post, we'll make a
  reusable D3 component for an OHLC chart series.
layout: default_post
tags: null
image: tsimmons/assets/featured/chart.png
oldlink: 'http://www.scottlogic.com/blog/2014/08/19/an-ohlc-chart-component-for-d3.html'
disqus-id: /2014/08/19/an-ohlc-chart-component-for-d3.html
categories:
  - Tech
---

## 2017 update
A lot has changed in the world of JavaScript and D3 since this post was written.
Check out [the d3fc project](https://d3fc.io/) to see what some of the ideas in this post have evolved into!

---

An open-high-low-close (OHLC) chart is a type of financial chart used to show price movements and help identify trends in a financial instrument over time. For each unit of time, a vertical line is plotted showing the highest and lowest prices reached in that time. Horizontal tick marks are plotted on each side of the line - the opening price for that time period on the left, and the closing price on the right. Usually an OHLC line will be coloured green if on that day the closing price exceeded the opening price (an 'up day'), and coloured red if not (a 'down day').

[D3](http://d3js.org/) is a JavaScript library for data visualisation on the web. It is not a charting library. Instead, it gives us the flexibility to bind data to web graphics, utilising modern web standards such as SVG, HTML5 and CSS3. Charts are just one type of visualisation we can make with it. This post assumes some familiarity with D3. There are already lots of great introductory tutorials available on the [D3 wiki](https://github.com/mbostock/d3/wiki/Tutorials) if you need to get up to speed. 

While D3 does have a component to draw a line series on a chart ([see here](http://bl.ocks.org/mbostock/3883245)), it does not have an inbuilt component we can use to render an OHLC series. In this post, we'll make one.

## Reusable Chart Components
We'll use D3 creator Mike Bostock's [convention for creating reusable components](http://bost.ocks.org/mike/chart/) in D3. Essentially this means our component will be a closure with getter-setter methods. This follows the same pattern used by other D3 components and plugins, so will allow us to treat our OHLC component just like any other D3 component.

We'll assume our data is an array of objects that look like this:
{% highlight javascript %}
{
    date:  // A Date object
    open:  // A Number
    high:  // A Number
    low:   // A Number
    close: // A Number
}
{% endhighlight %}

Here's what the OHLC component will look like internally:
{% highlight javascript %}
sl.series.ohlc = function () {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var ohlc = function (selection) {
        selection.each(function (data) {
            // Generate ohlc bars here.
        });
    };

    ohlc.xScale = function (value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return ohlc;
    };

    ohlc.yScale = function (value) {
        // Similar to xScale above.
    };

    return ohlc;
};
{% endhighlight %}

Here, we are attaching our component to the `sl.series` namespace object. This gives us a nice way to organise the components we write. For example, if we were to implement an axis component, it could go in `sl.axis`. 

Internally, we have 2 scales, `xScale` and `yScale`. We'll need these to map the dates and prices of our input to pixel positions on our chart. The scales are initialised to be default D3 scales. This allows us to use the component without attaching scales, although typically we'll set them to the scales used by our axes.

These scales are exposed to users of the component using getter/setter functions. For example, calling the `xScale` function with no arguments returns the internal `xScale`, and calling it with one or more arguments sets the internal `xScale` to the first argument. When called with arguments, these functions return the OHLC function. This allows setter calls to be chained together.

We'll draw the OHLC bars in the `ohlc` function returned by the component. We'll use D3's [General Update Pattern](http://bl.ocks.org/mbostock/3808218). This is an important D3 concept. In simple terms, we `select` page elements that may or may not exist, and bind data to these elements. Page elements are then created, updated or removed as necessary to reflect the data. Creation happens in the `enter()` selection, updating in the update selection, and removal in the `exit()` selection. This is nice because we can use the same function to both create and update our component to reflect changes in the bound data or in configuration.

To use an instance of the component, we'll set an xScale and a yScale, bind data to a selection, then call the component on the selection. This will draw the series on the selection. This is how we'll use our component when we come to drawing the chart.

{% highlight javascript %}
// Create series and bind x and y scales
var series = sl.series.ohlc()
            .xScale(xScale)
            .yScale(yScale);

// Bind data to a selection and call the series.
d3.select('.series')
    .datum(data)
    .call(series);
{% endhighlight %}


## OHLC Component
Let's go ahead and implement the `ohlc` create/update function.
First we need an SVG group element to contain our series on the selection. We'll use the general update pattern. We want just one element to be created, so we'll bind the whole array of data to the 'ohlc-series' element. Now we can create this element in the `enter()` selection.

{% highlight javascript %}
var ohlc = function (selection) {
    selection.each(function (data) {
        // Generate ohlc bars here.
        series = d3.select(this).selectAll('.ohlc-series').data([data]);
        series.enter().append('g').classed('ohlc-series', true);
        //... 
    });
};

{% endhighlight %}

Next we need a group for each OHLC bar of our series. We will select all the elements with class 'bar' and bind a price object to each one. This time, we'll also include a *key function* which returns the price object's date. While not really necessary for this example, if we wanted to use D3's transitions to animate updates to the data, this would ensure that D3 can match up existing bars with their new data, making for smooth animation. This idea is called [Object Constancy](http://bost.ocks.org/mike/constancy/).

With the series data bound, we can create the bar groups in the `enter()` selection. In the update selection, we will give them a the css class 'up-day' or 'down-day' depending on the difference in opening and closing price. This means that we will be able to give colours to the up-day and down-day bars with CSS.

{% highlight javascript %}
//... 
bars = series.selectAll('.bar')
    .data(data, function (d) {
        return d.date;
    });

bars.enter()
    .append('g')
    .classed('bar', true);

bars.classed({
    'up-day': function(d) {
        return d.close > d.open;
        },
    'down-day': function (d) {
        return d.close <= d.open;
        }
    });

bars.exit().remove();
{% endhighlight %}

All that's left to do is to draw the lines inside each bar. We need to draw 3 lines for each bar - one extending from the low price to the high price, and 2 horizontal ticks for the open and closing prices. First, in the body of `sl.series.ohlc`, we will set up a `d3.svg.line` with appropriate x and y accessors. This means that we will be able to generate svg lines by supplying `line` with an array of points.

{% highlight javascript %}
var line = d3.svg.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
{% endhighlight %}

For each line, we'll select a path element by its class and then append a path element in the `enter()` selection. The `enter()` selection is returned by binding data using `selection.data`, but what data should we bind?

In this case we want to bind the price object that's already bound to the the parent bar group element. It turns out that for this type of multiple selection we need to give a *function* to `selection.data` which returns an array containing the elements to bind ([see here](https://github.com/mbostock/d3/wiki/Selections#data)). In the update selection, we will draw the line, scaling all x and y coordinates with the xScale and yScale respectively.

We'll put the high low line create/update code in a function of its own which we will call from the OHLC create/update function. It looks like this:

{% highlight javascript %}
var highLowLines = function (bars) {

    var paths = bars
        .selectAll('.high-low-line')
        .data(function (d) {
            return [d];
        });

        paths.enter().append('path');

        paths.classed('high-low-line', true)
        .attr('d', function (d) {
            return line([
                { x: xScale(d.date), y: yScale(d.high) },
                { x: xScale(d.date), y: yScale(d.low) }
            ]);
        });
    };
{% endhighlight %}

It's a similar situation for drawing the the open/close ticks:

{% highlight javascript %}
var openCloseTicks = function (bars) {
    var open,
        close,
        tickWidth = 5;

    open = bars.selectAll('.open-tick').data(function (d) {
        return [d];
    });

    close = bars.selectAll('.close-tick').data(function (d) {
        return [d];
    });

    open.enter().append('path');
    close.enter().append('path');

    open.classed('open-tick', true)
        .attr('d', function (d) {
            return line([
                { x: xScale(d.date) - tickWidth, y: yScale(d.open) },
                { x: xScale(d.date), y: yScale(d.open) }
            ]);
        });

    close.classed('close-tick', true)
        .attr('d', function (d) {
            return line([
                { x: xScale(d.date), y: yScale(d.close) },
                { x: xScale(d.date) + tickWidth, y: yScale(d.close) }
            ]);
        });

};
{% endhighlight %}

## OHLC Chart
We've built the component, so now let's use it in a chart! First we'll set up margins, scales, axes and our series.

{% highlight javascript %}
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var xScale = d3.time.scale(),
    yScale = d3.scale.linear();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

var series = sl.series.ohlc()
    .xScale(xScale)
    .yScale(yScale);
{% endhighlight %}

Next, we will create an svg element. We'll assume that our html page has a `div` with id 'chart' to draw this inside. Following the usual D3 [margin convention](http://bl.ocks.org/mbostock/3019563), we'll draw our chart in a group element that translates the origin to the top left corner of the chart area. Our series will be drawn in the 'plotArea' - a group element which references a clipPath. The clipPath contains a `rect` with dimensions equal to the inner dimensions of our chart. This will ensure that OHLC bars for dates that lie outside domain of the axes are not shown.

{% highlight javascript %}
// Create svg element
var svg = d3.select('#chart').classed('chart', true).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

// Create chart
var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Create plot area
var plotArea = g.append('g');
plotArea.append('clipPath')
    .attr('id', 'plotAreaClip')
    .append('rect')
    .attr({ width: width, height: height });
plotArea.attr('clip-path', 'url(#plotAreaClip)');
{% endhighlight %}

Next, we set the domains and ranges of the scales. For this example, we'll have the x domain extend to a day after the most recent data point from about 1 month before the most recent data point. The y domain will extend from the lowest 'low' to the highest 'high' in our data. 

{% highlight javascript %}
// Set scale domains
var maxDate = d3.max(data, function (d) {
    return d.date;
});

// There are 8.64e7 milliseconds in a day.
xScale.domain([
    new Date(maxDate.getTime() - (8.64e7 * 31.5)),
    new Date(maxDate.getTime() + 8.64e7)
]);

yScale.domain(
    [
        d3.min(data, function (d) {
            return d.low;
        }),
        d3.max(data, function (d) {
            return d.high;
        })
    ]
).nice();

// Set scale ranges
xScale.range([0, width]);
yScale.range([height, 0]);
{% endhighlight %}

Finally, we can draw the axes and the series.

{% highlight javascript %}
// Draw axes
g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

g.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

// Draw the series.
plotArea.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(series);
{% endhighlight %}

We'll colour the up-day and down-day bars with css by styling the `stroke` property of the paths:

{% highlight css %}
.chart .bar.up-day path {
    stroke: green;
}

.chart .bar.down-day path {
    stroke: red;
}
{% endhighlight %}

Here's the end result:

<img src="{{ site.baseurl }}/tsimmons/assets/ohlc.png"/>

## Candlestick Component
Candlestick charts are very similar to OHLC charts, so with a small modification we can turn our OHLC component into a candlestick component. All that's needed is to draw a rectangle between the open and close price instead of the open close ticks. The rectangle create/update function looks like this:

{% highlight javascript %}
var rectangles = function (bars) {
    var rect,
        rectangleWidth = 5;

    rect = bars.selectAll('rect').data(function (d) {
        return [d];
    });

    rect.enter().append('rect');

    rect.attr('x', function (d) {
        return xScale(d.date) - rectangleWidth;
    })
        .attr('y', function (d) {
            return isUpDay(d) ? yScale(d.close) : yScale(d.open);
        })
        .attr('width', rectangleWidth * 2)
        .attr('height', function (d) {
            return isUpDay(d)
                ? yScale(d.open) - yScale(d.close)
                : yScale(d.close) - yScale(d.open);
        });
};
{% endhighlight %}

We'll need to style the `fill` property of the rectangles to get the right colours.

The `sl.series.candlestick` component is identical to the `sl.series.ohlc` component, but its create/update function calls `rectangle` instead of `openCloseTicks`. Since the components share a lot of code, we could have a function which contains the common code, takes `rectangle` or `openCloseTicks` as input, and produces the required component (we'll leave out the details for now).

We can use the same code we used to create the OHLC chart. We just have to replace `sl.series.ohlc` with `sl.series.candlestick` when creating the series. Here's what our candlestick chart looks like:

<img src="{{ site.baseurl }}/tsimmons/assets/candlestick.png"/>

## Conclusion
We have made 2 reusable components for financial charts with D3. This is really just the beginning of what we would need for a fully featured financial chart. There are many components we could make using this pattern, including technical studies, comparison series and chart navigators. However, with these simple examples, we can already see the power of breaking chart features into reusable components. It would also be important to see how well these charts perform for large data sets. Ideally, we should be able to smoothly pan and zoom an OHLC chart which shows multiple years of prices. We'll look at that <a href="{{site.baseurl}}{% post_url tsimmons/2014-09-19-d3-svg-chart-performance %}">in another post</a>, where we'll improve our OHLC component so that it is optimised for panning and zooming.