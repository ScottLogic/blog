define([
    'd3',
    'components/sl',
    'MockData',
    'components/ohlcSeries',
    'components/gridlines',
    'components/fibonacciFan'
], function (d3, sl, MockData) {
    'use strict';

    var data = new MockData(0.1, 0.1, 100, 50, function (moment) {
            return !(moment.day() === 0 || moment.day() === 6);
        })
        .generateOHLC(new Date(2014, 7, 1), new Date(2014, 9, 1));

    var minDate = new Date(d3.min(data, function (d) { return d.date; }).getTime() - 8.64e7);
    var maxDate = new Date(d3.max(data, function (d) { return d.date; }).getTime() + 8.64e7);
    var yMin = d3.min(data, function (d) { return d.low; });
    var yMax = d3.max(data, function (d) { return d.high; });

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

    var xScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, width]),
        yScale = d3.scale.linear()
        .domain([yMin, yMax]).nice()
        .range([height, 0]);

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

    var gridlines = sl.svg.gridlines()
        .xScale(xScale)
        .yScale(yScale)
        .xTicks(5);

    plotArea.call(gridlines);

    var series = sl.series.ohlc()
        .xScale(xScale)
        .yScale(yScale);

    var dataSeries = plotArea.append('g')
        .attr('class', 'series')
        .datum(data)
        .call(series);

    var overlay = d3.svg.area()
        .x(function (d) { return xScale(d.date); })
        .y0(0)
        .y1(height);

    var fibonacci = sl.series.fibonacciFan()
        .target(plotArea)
        .series(data)
        .xScale(xScale)
        .yScale(yScale);

    plotArea.append('path')
        .attr('class', 'overlay')
        .attr('d', overlay(data))
        .call(fibonacci);
});