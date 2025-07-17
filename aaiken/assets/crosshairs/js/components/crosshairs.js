define ([
    'd3',
    'components/sl'
], function (d3, sl) {
    'use strict';

sl.series.crosshairs = function () {

    var target = null,
        series = null,
        xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        yValue = 'y',
        formatX = null,
        formatY = null;

    var lineH = null,
        lineV = null,
        circle = null,
        calloutX = null,
        calloutY = null;

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

        calloutX = root.append("text")
            .attr('class', 'crosshairs callout X')
            .attr('x', xScale.range()[1])
            .attr('style', 'text-anchor: end')
            .attr('display', 'none');

        calloutY = root.append("text")
            .attr('class', 'crosshairs callout Y')
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
            calloutX.attr('y', y)
                .text(formatX(highlight));
            calloutY.attr('x', x)
                .text(formatY(highlight));

            lineH.attr('display', 'inherit');
            lineV.attr('display', 'inherit');
            circle.attr('display', 'inherit');
            calloutX.attr('display', 'inherit');
            calloutY.attr('display', 'inherit');
        }
    }

    function mouseout() {

        highlight = null;

        lineH.attr('display', 'none');
        lineV.attr('display', 'none');
        circle.attr('display', 'none');
        calloutX.attr('display', 'none');
        calloutY.attr('display', 'none');
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

    crosshairs.series = function (value) {
        if (!arguments.length) {
            return series;
        }
        series = value;
        return crosshairs;
    };

    crosshairs.xScale = function (value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return crosshairs;
    };

    crosshairs.yScale = function (value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return crosshairs;
    };

    crosshairs.yValue = function (value) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = value;
        return crosshairs;
    };

    crosshairs.formatX = function (value) {
        if (!arguments.length) {
            return formatX;
        }
        formatX = value;
        return crosshairs;
    };

    crosshairs.formatY = function (value) {
        if (!arguments.length) {
            return formatY;
        }
        formatY = value;
        return crosshairs;
    };

    return crosshairs;
};

});