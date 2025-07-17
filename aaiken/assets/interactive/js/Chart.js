define([
    'd3',
    'components/sl',
    'MockData',
    'components/candlestickSeries'
], function (d3, sl, MockData) {
    'use strict';

    var data = new MockData(0.1, 0.1, 100, 50, function (moment) {
            return !(moment.day() === 0 || moment.day() === 6);
        })
        .generateOHLC(new Date(2014, 1, 1), new Date(2014, 8, 1));

    var minDate = new Date(d3.min(data, function (d) { return d.date; }).getTime() - 8.64e7);
    var maxDate = new Date(d3.max(data, function (d) { return d.date; }).getTime() + 8.64e7);
    var yMin = d3.min(data, function (d) { return d.low; });
    var yMax = d3.max(data, function (d) { return d.high; });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // The primary chart

    // Set up the drawing area
    
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

    // Scales

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    // Set scale domains
    xScale.domain([minDate, maxDate]);
    yScale.domain([yMin, yMax]).nice();

    // Set scale ranges
    xScale.range([0, width]);
    yScale.range([height, 0]);

    // Axes

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    plotChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    plotChart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // Data series

    var series = sl.series.candlestick()
        .xScale(xScale)
        .yScale(yScale);

    var dataSeries = plotArea.append('g')
        .attr('class', 'series')
        .datum(data)
        .call(series);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Navigation chart

    var navWidth = width,
        navHeight = 100 - margin.top - margin.bottom;

    // Set up the drawing area

    var navChart = d3.select('#chart').classed('chart', true).append('svg')
        .classed('navigator', true)
        .attr('width', navWidth + margin.left + margin.right)
        .attr('height', navHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scales

    var navXScale = d3.time.scale()
            .domain([
                new Date(minDate.getTime() - 8.64e7),
                new Date(maxDate.getTime() + 8.64e7)
            ])
            .range([0, navWidth]),
        navYScale = d3.scale.linear()
            .domain([yMin, yMax])
            .range([navHeight, 0]);

    // Axes

    var navXAxis = d3.svg.axis()
        .scale(navXScale)
        .orient('bottom');

    navChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + navHeight + ')')
        .call(navXAxis);

    // Data series

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Viewport

    var viewport = d3.svg.brush()
        .x(navXScale)
        .on("brush", function () {
            xScale.domain(viewport.empty() ? navXScale.domain() : viewport.extent());
            redrawChart();
        })
        .on("brushend", function () {
            updateZoomFromChart();
        });

    navChart.append("g")
        .attr("class", "viewport")
        .call(viewport)
        .selectAll("rect")
        .attr("height", navHeight);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Zooming and panning

    var zoom = d3.behavior.zoom()
        .x(xScale)
        .on('zoom', function() {
            if (xScale.domain()[0] < minDate) {
                zoom.translate([zoom.translate()[0] - xScale(minDate) + xScale.range()[0], 0]);
            } else if (xScale.domain()[1] > maxDate) {
                zoom.translate([zoom.translate()[0] - xScale(maxDate) + xScale.range()[1], 0]);
            }
            redrawChart();
            updateViewpointFromChart();
        });

    var overlay = d3.svg.area()
        .x(function (d) { return xScale(d.date); })
        .y0(0)
        .y1(height);

    plotArea.append('path')
        .attr('class', 'overlay')
        .attr('d', overlay(data))
	.call(zoom);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Setup

    var daysShown = 30;

    xScale.domain([
        data[data.length - daysShown - 1].date,
        data[data.length - 1].date
    ]);

    redrawChart();
    updateViewpointFromChart();
    updateZoomFromChart();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper methods

    function redrawChart() {

        dataSeries.call(series);
        plotChart.select('.x.axis').call(xAxis);
    }

    function updateViewpointFromChart() {

        if ((xScale.domain()[0] <= minDate) && (xScale.domain()[1] >= maxDate)) {

            viewport.clear();
        }
        else {

            viewport.extent(xScale.domain());
        }

        navChart.select('.viewport').call(viewport);
    }

    function updateZoomFromChart() {

        var fullDomain = maxDate - minDate,
            currentDomain = xScale.domain()[1] - xScale.domain()[0];

        var minScale = currentDomain / fullDomain,
            maxScale = minScale * 20;

        zoom.x(xScale)
            .scaleExtent([minScale, maxScale]);
    }
});