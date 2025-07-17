/* globals window */

/**
 * A collection of components that make it easy to build interactive financial charts with D3
 *
 * @namespace fc
 */
window.fc = {
    version: '0.0.0',
    /**
     * Studies, trend-lines and other financial indicators that can be added to a chart
     *
     * @namespace fc.indicators
     */
    indicators: {},
    math: {},
    /**
     * Useful complex scales which add to the D3 scales in terms of render quality.
     * Also, complex financial scales that can be added to a chart
     *
     * @namespace fc.scale
     */
    scale: {
        discontinuity: {}
    },
    series: {},
    tools: {},
    /**
     * Utility components to shorted long winded implementations of common operations.
     * Also includes components for mock data generation and layout.
     *
     * @namespace fc.utilities
     */
    utilities: {}
};
(function(d3, fc) {
    'use strict';

    /**
    * The chart builder makes it easier to constructs charts from a number of D3FC or D3 components. It
    * adapts a chartLayout (which is responsible for creating a suitable SVG structure for a chart), and allows
    * you to associate components (axes, series, etc ...) with the chart. The chart builder
    * is responsible for associating data with the components, setting the ranges of the scales and updating
    * the components when the chart needs to be re-drawn.
    *
    * @type {object}
    * @memberof fc.utilities
    * @class fc.utilities.chartBuilder
    */
    fc.utilities.chartBuilder = function(chartLayout) {

        // the components that have been added to the chart.
        var plotAreaComponents = [];
        var axes = {};

        // the selection that this chart is associated with
        var callingSelection;

        var chartBuilder = function(selection) {
            callingSelection = selection;
            selection.call(chartLayout);
        };

        /**
         * Adds a number of components to the chart plot area. The chart layout is responsible for
         * rendering these components via the render function.
         *
         * @memberof fc.utilities.chartBuilder#
         * @method addToPlotArea
         * @param  {array} components an array of components to add to the plot area
         */
        chartBuilder.addToPlotArea = function(components) {
            plotAreaComponents = plotAreaComponents.concat(components);
        };

        /**
         * Provides the data that will be joined with the plot area selection, and as a result
         * is the data used by components that are associated with the ploa area.
         *
         * @memberof fc.utilities.chartBuilder#
         * @method setData
         * @param  {array} data the data to associate with the plot area
         */
        chartBuilder.setData = function(data) {
            chartLayout.getPlotArea().datum(data);
        };

        /**
         * Sets the chart axis with the given orientation. The chart builder is responsible for setting
         * the range of this axis and rendering it via the render function.
         *
         * @memberof fc.utilities.chartBuilder#
         * @method setAxis
         * @param  {string} orientation The orientation of the axis container
         * @param  {object} axis a D3 or D3FC axis component
         */
        chartBuilder.setAxis = function(orientation, axis) {
            axes[orientation] = axis;
        };

        /**
         * Renders all of the components associated with this chart. During the render process
         * the axes have their scales set to an appropriate value.
         *
         * @memberof fc.utilities.chartBuilder#
         * @method render
         */
        chartBuilder.render = function() {
            callingSelection.call(chartLayout);

            // call each of the axis components with the axis selection
            for (var axisOrientation in axes) {
                if (axes.hasOwnProperty(axisOrientation)) {
                    var axisContainer = chartLayout.getAxisContainer(axisOrientation);
                    var axis = axes[axisOrientation];
                    if (axisOrientation === 'top' || axisOrientation === 'bottom') {
                        axis.scale().range([0, chartLayout.getPlotAreaWidth()]);
                    } else {
                        axis.scale().range([chartLayout.getPlotAreaHeight(), 0]);
                    }
                    axisContainer.call(axis);
                }
            }

            // call each of the plot area components
            plotAreaComponents.forEach(function(component) {
                chartLayout.getPlotArea().call(component);
            });
        };

        return chartBuilder;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    /**
    * Based on the [Margin Convention]{@link http://bl.ocks.org/mbostock/3019563},
    * the Chart Layout component is responsible for defining the chart area.
    *
    * It attempts to simplify the repetitive process of constructing the chart's layout and its associated elements:
    * <ul>
    *   <li>Define the margins, height and width</li>
    *   <li>Calculate the inner height and inner width</li>
    *   <li>Create an SVG</li>
    *   <li>Create a group for all chart elements; translate it based on the margins</li>
    *   <li>Create a clipping path for the plot area; add it to the group</li>
    *   <li>Create groups for the axes</li>
    * </ul>
    *
    * If the width or height of the component have not been explicitly set using chartLayout.height()
    * or chartLayout.width(), then the width and height of the chartLayout will try to expand to the
    * dimensions of the selected element. If this results in an invalid value, i.e. less than 1,
    * a default value will be used.
    *
    * <hr>
    *
    * Given a div:
    * <pre>
    * &lt;div id=&quot;myChart&quot; style=&quot;width:650px; height:300px;&quot;&gt;&lt;/div&gt;
    * </pre>
    *
    * Chart Layout will tranform the selection to create the following elements:
    * <pre>
    * &lt;div id=&quot;myChart&quot; style=&quot;width:650px; height:300px;&quot;&gt;
    *     &lt;svg width=&quot;650&quot; height=&quot;300&quot;&gt;
    *         &lt;g class=&quot;chartArea&quot; transform=&quot;translate(40,20)&quot;&gt;
    *             &lt;defs&gt;
    *                 &lt;clipPath id=&quot;fcPlotAreaClip_myChart&quot;&gt;
    *                     &lt;rect width=&quot;570&quot; height=&quot;260&quot;&gt;&lt;/rect&gt;
    *                 &lt;/clipPath&gt;
    *             &lt;/defs&gt;
    *             &lt;rect class=&quot;background&quot; width=&quot;570&quot; height=&quot;260&quot;&gt;&lt;/rect&gt;
    *             &lt;g clip-path=&quot;url(#fcPlotAreaClip_myChart)&quot; class=&quot;plotArea&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis bottom&quot; transform=&quot;translate(0,260)&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis top&quot; transform=&quot;translate(0, 0)&quot;&gt;&lt;/g&gt;
    *             &lt;g class=&quot;axis right&quot; transform=&quot;translate(570, 0)&quot;&gt;&lt;/g&gt;
    *         &lt;/g&gt;
    *     &lt;/svg&gt;
    * &lt;/div&gt;
    * </pre>
    *
    * @type {object}
    * @memberof fc.utilities
    * @class fc.utilities.chartLayout
    */
    fc.utilities.chartLayout = function() {

        // Default values
        var margin = {top: 20, right: 40, bottom: 20, left: 40},
            width = 0,
            height = 0;

        var defaultWidth = true,
            defaultHeight = true;

        // The elements created for the chart
        var chartElements = {};

        var plotAreaClipId;

        /**
         * Constructs a new instance of the chartLayout component.
         *
         * Applies the chartLayout to a [D3 selection]{@link https://github.com/mbostock/d3/wiki/Selections}
         * (commonly  a <code>div</code>).
         * The chartLayout component can only be applied to the first element in a selection,
         * all other elements will be ignored.
         *
         * @example
         * // Setup the chart layout
         * var layout = fc.utilities.chartLayout();
         *
         * // Setup the chart
         * var setupArea = d3.select('#chart')
         *     .call(layout);
         *
         * @memberof fc.utilities.chartLayout#
         * @method chartLayout
         * @param {selection} selection a D3 selection
         */
        var chartLayout = function(selection) {
            // Select the first element in the selection
            // If the selection contains more than 1 element,
            // only the first will be used, the others will be ignored
            var element = selection.node(),
                style = getComputedStyle(element);

            // Attempt to automatically size the chart to the selected element
            if (defaultWidth === true) {
                // Set the width of the chart to the width of the selected element,
                // excluding any margins, padding or borders
                var paddingWidth = parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
                width = element.clientWidth - paddingWidth;

                // If the new width is too small, use a default width
                if (chartLayout.getPlotAreaWidth() < 1) {
                    width = 600 + margin.left + margin.right;
                }
            }

            if (defaultHeight === true) {
                // Set the height of the chart to the height of the selected element,
                // excluding any margins, padding or borders
                var paddingHeight = parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
                height = element.clientHeight - paddingHeight;

                // If the new height is too small, use a default height
                if (chartLayout.getPlotAreaHeight() < 1) {
                    height = 400 + margin.top + margin.bottom;
                }
            }

            // Setup the elements - following the general update pattern (http://bl.ocks.org/mbostock/3808218)
            //
            // When creating the elements for the chart, only one of each element is required. To achieve this we bind
            // a single datum to each selection - this is represented in the dummyData variable. This data-join is only
            // used for creating and updating the elements - through data(), enter() and exit(); the value of the data
            // is irrelevant (but there must only be one value). This approach is similar to that used in D3's axis
            // and brush components.
            //
            // For each element, we:
            // 1. Select the element(s) and bind a single datum to that selection
            // 2. If no element currently exists, append it (this is in the enter() subselection)
            // 3. Update the element as required
            // 4. If there are too many of the selected element(>1), then remove it (this is in the exit() subselection)
            var container = d3.select(element),
                dummyData = [0];

            // Create svg
            var svg = container.selectAll('svg').data(dummyData);
            svg.enter().append('svg');
            svg.attr('width', width)
                .attr('height', height)
                .style('display', 'block');
            svg.exit().remove();

            // Create group for the chart
            function roundToNearestHalfInteger(n) {
                var m = Math.round(n);
                return n > m ? m + 0.5 : m - 0.5;
            }

            var chart = svg.selectAll('g.chartArea').data(dummyData);
            chart.enter().append('g')
                .classed('chartArea', true);
            chart.attr('transform', 'translate(' +
                roundToNearestHalfInteger(margin.left) + ',' +
                roundToNearestHalfInteger(margin.top) + ')');
            chart.exit().remove();

            // Create defs - for clipping path
            var defs = chart.selectAll('defs').data(dummyData);
            defs.enter().append('defs');
            defs.exit().remove();

            // Get an ID for the clipping path
            // If the element already has an ID, use that; otherwise, generate one (to avoid duplicate IDs)
            plotAreaClipId = plotAreaClipId || 'fcPlotAreaClip_' + (element.id || nextId());

            // Clipping path
            var clippingPath = defs.selectAll('#' + plotAreaClipId).data(dummyData);
            clippingPath.enter().append('clipPath')
                .attr('id', plotAreaClipId);
            clippingPath.exit().remove();

            // Clipping path rect
            var clippingPathRect = clippingPath.selectAll('rect').data(dummyData);
            clippingPathRect.enter().append('rect');
            clippingPathRect
                .attr('width', chartLayout.getPlotAreaWidth())
                .attr('height', chartLayout.getPlotAreaHeight());
            clippingPathRect.exit().remove();

            // Create a background element
            var plotAreaBackground = chart.selectAll('rect.background').data(dummyData);
            plotAreaBackground.enter().append('rect')
                .classed('background', true);
            plotAreaBackground
                .attr('width', chartLayout.getPlotAreaWidth())
                .attr('height', chartLayout.getPlotAreaHeight());
            plotAreaBackground.exit().remove();

            // Create plot area, using the clipping path
            // NOTE: We do not use a data-join to 'dummy data' here, because it is expected that the
            // user (or chartBuilder) will want to data-join the plotArea with their own data in order
            // that it is inherited by the series within the chart
            var plotArea = chart.selectAll('g.plotArea');
            if (plotArea.empty()) {
                plotArea = chart.append('g')
                    .attr('clip-path', 'url(#' + plotAreaClipId + ')')
                    .attr('class', 'plotArea');
            }

            // Add selections to the chart elements object for the getters
            chartElements = {
                svg: svg,
                chartArea: chart,
                defs: defs,
                plotAreaBackground: plotAreaBackground,
                plotArea: plotArea
            };

            // Create containers for the axes
            if (!chartElements.axisContainer) {
                chartElements.axisContainer = {};
            }

            function createAxis(orientation, translation) {
                var selection = chart.selectAll('g.axis.' + orientation).data(dummyData);
                selection.enter().append('g')
                    .attr('class', 'axis ' + orientation);
                selection.attr('transform', translation);
                selection.exit().remove();
                if (!chartElements.axisContainer[orientation]) {
                    chartElements.axisContainer[orientation] = {};
                }
                chartElements.axisContainer[orientation].selection = selection;
            }

            createAxis('bottom', 'translate(0, ' + chartLayout.getPlotAreaHeight() + ')');
            createAxis('top', 'translate(0, 0)');
            createAxis('left', 'translate(0, 0)');
            createAxis('right', 'translate(' + chartLayout.getPlotAreaWidth() + ', 0)');
        };

        /**
         * Get/set the size of the top margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginTop
         * @param  {number} [value] The size of the top margin
         * @returns {number|chartLayout} If value is specified, sets the top margin and returns the chartLayout;
         * if value is not specified, returns the top margin.
         */
        chartLayout.marginTop = function(value) {
            if (!arguments.length) {
                return margin.top;
            }
            margin.top = value;
            return chartLayout;
        };

        /**
         * Get/set the size of the right margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginRight
         * @param  {number} [value] The size of the right margin
         * @returns {number|chartLayout} If value is specified, sets the right margin and returns the chartLayout;
         * if value is not specified, returns the right margin.
         */
        chartLayout.marginRight = function(value) {
            if (!arguments.length) {
                return margin.right;
            }
            margin.right = value;
            return chartLayout;
        };

        /**
         * Get/set the size of the bottom margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginBottom
         * @param  {number} [value] The size of the bottom margin
         * @returns {number|chartLayout} If value is specified, sets the bottom margin and returns the chartLayout;
         * if value is not specified, returns the bottom margin.
         */
        chartLayout.marginBottom = function(value) {
            if (!arguments.length) {
                return margin.bottom;
            }
            margin.bottom = value;
            return chartLayout;
        };

        /**
         * Get/set the size of the left margin between the chart area
         * and the edge of its parent SVG.
         *
         * Increasing the size of a margin affords more space for an axis in the corresponding position.
         *
         * @memberof fc.utilities.chartLayout#
         * @method marginLeft
         * @param  {number} [value] The size of the left margin
         * @returns {number|chartLayout} If value is specified, sets the left margin and returns the chartLayout;
         * if value is not specified, returns the left margin.
         */
        chartLayout.marginLeft = function(value) {
            if (!arguments.length) {
                return margin.left;
            }
            margin.left = value;
            return chartLayout;
        };

        /**
         * Get/set the width of the chart.
         *
         * If the width of the chart is not explicitly set before calling chartLayout on a selection,
         * the component will attempt to size the chart to the dimensions of the selection's first element.
         *
         * @memberof fc.utilities.chartLayout#
         * @method width
         * @param  {number} [value] The width of the chart
         * @returns {number|chartLayout} If value is specified, sets the width and returns the chartLayout;
         * if value is not specified, returns the width.
         */
        chartLayout.width = function(value) {
            if (!arguments.length) {
                return width;
            }
            width = value;
            defaultWidth = false;
            return chartLayout;
        };

        /**
         * Get/set the height of the chart.
         *
         * If the height of the chart is not explicitly set before calling chartLayout on a selection,
         * the component will attempt to size the chart to the dimensions of the selection's first element.
         *
         * @memberof fc.utilities.chartLayout#
         * @method height
         * @param  {number} [value] The height of the chart
         * @returns {number|chartLayout} If value is specified, sets the height and returns the chartLayout;
         * if value is not specified, returns the height.
         */
        chartLayout.height = function(value) {
            if (!arguments.length) {
                return height;
            }
            height = value;
            defaultHeight = false;
            return chartLayout;
        };

        /**
         * Get the width of the plot area. This is the total width of the chart minus the horizontal margins.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaWidth
         * @returns {number} The width of the plot area.
         */
        chartLayout.getPlotAreaWidth = function() {
            return width - margin.left - margin.right;
        };

        /**
         * Get the height of the plot area. This is the total height of the chart minus the vertical margins.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaHeight
         * @returns {number} The height of the plot area.
         */
        chartLayout.getPlotAreaHeight = function() {
            return height - margin.top - margin.bottom;
        };


        /**
         * Get the SVG for the chart.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getSVG
         * @returns {selection} The SVG for the chart.
         */
        chartLayout.getSVG = function() {
            return chartElements.svg;
        };

        /**
         * Get the defs element for the chart.
         * The defs element can contain elements to be reused in the SVG, after they're defined;
         * for example - a clipping path.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getDefs
         * @returns {selection} The defs element for the chart.
         */
        chartLayout.getDefs = function() {
            return chartElements.defs;
        };

        /**
         * Get the chart area group for the chart.
         * Typically axes will be added to the chart area.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getChartArea
         * @returns {selection} The chart's plot area.
         */
        chartLayout.getChartArea = function() {
            return chartElements.chartArea;
        };

        /**
         * Get the plot area's background element.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotAreaBackground
         * @returns {selection} The background rect of the plot area.
         */
        chartLayout.getPlotAreaBackground = function() {
            return chartElements.plotAreaBackground;
        };

        /**
         * Get the plot area group for the chart.
         * The plot area has a clipping path, so this is typically where series and indicators will be added.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getPlotArea
         * @returns {selection} The chart's plot area.
         */
        chartLayout.getPlotArea = function() {
            return chartElements.plotArea;
        };

        /**
         * Get the group container for an axis.
         *
         * @memberof fc.utilities.chartLayout#
         * @method getAxisContainer
         * @param  {string} orientation The orientation of the axis container;
         * valid values are 'top', 'bottom', 'left' or 'right'
         * @returns {selection} The group for the specified axis orientation.
         */
        chartLayout.getAxisContainer = function(orientation) {
            return chartElements.axisContainer[orientation].selection;
        };

        return chartLayout;
    };

    // Generates an integer ID
    var nextId = (function() {
        var id = 0;
        return function() {
            return ++id;
        };
    })();

}(d3, fc));

(function(fc) {
    'use strict';

    /**
    * This component can be used to generate mock/fake daily market data for use with the chart
    * data series components. This component does not act on a D3 selection in the same way as
    * the other components.
    *
    * @type {object}
    * @memberof fc.utilities
    * @class fc.utilities.dataGenerator
    */
    fc.utilities.dataGenerator = function() {

        var mu = 0.1,
            sigma = 0.1,
            startingPrice = 100,
            startingVolume = 100000,
            intraDaySteps = 50,
            volumeNoiseFactor = 0.3,
            seedDate = new Date(),
            currentDate = new Date(seedDate.getTime()),
            useFakeBoxMuller = false,
            filter = function(date) {
                return !(date.getDay() === 0 || date.getDay() === 6);
            };

        var randomSeed = (new Date()).getTime(),
            randomGenerator = null;

        var generatePrices = function(period, steps) {
            var increments = generateIncrements(period, steps, mu, sigma),
                i, prices = [];
            prices[0] = startingPrice;

            for (i = 1; i < increments.length; i += 1) {
                prices[i] = prices[i - 1] * increments[i];
            }

            startingPrice = prices[prices.length - 1];
            return prices;
        };

        var generateVolumes = function(period, steps) {
            var increments = generateIncrements(period, steps, 0, 1),
                i, volumes = [];

            volumeNoiseFactor = Math.max(0, Math.min(volumeNoiseFactor, 1));
            volumes[0] = startingVolume;

            for (i = 1; i < increments.length; i += 1) {
                volumes[i] = volumes[i - 1] * increments[i];
            }
            volumes = volumes.map(function(vol) {
                return Math.floor(vol * (1 - volumeNoiseFactor + randomGenerator.next() * volumeNoiseFactor * 2));
            });

            startingVolume = volumes[volumes.length - 1];
            return volumes;
        };

        var generateIncrements = function(period, steps, mu, sigma) {
            var deltaW = [],
                deltaY = period / steps,
                sqrtDeltaY = Math.sqrt(deltaY);

            for (var i = 0; i < steps; i++) {
                var r = useFakeBoxMuller ?
                    fakeBoxMullerTransform() :
                    boxMullerTransform()[0];
                r *= sqrtDeltaY;
                r *= sigma;
                r += (mu - ((sigma * sigma) / 2)) * deltaY;
                deltaW.push(Math.exp(r));
            }
            return deltaW;
        };

        var random = function(seed) {

            var m = 0x80000000, // 2**31;
                a = 1103515245,
                c = 12345;

            return {
                state: seed ? seed : Math.floor(Math.random() * (m - 1)),
                next: function() {
                    this.state = (a * this.state + c) % m;
                    return this.state / (m - 1);
                }
            };
        };

        var boxMullerTransform = function() {
            var x = 0, y = 0, rds, c;

            // Get two random numbers from -1 to 1.
            // If the radius is zero or greater than 1, throw them out and pick two new ones
            do {
                x = randomGenerator.next() * 2 - 1;
                y = randomGenerator.next() * 2 - 1;
                rds = x * x + y * y;
            }
            while (rds === 0 || rds > 1);

            // This is the Box-Muller Transform
            c = Math.sqrt(-2 * Math.log(rds) / rds);

            // It always creates a pair of numbers but it is quite efficient
            // so don't be afraid to throw one away if you don't need both.
            return [x * c, y * c];
        };

        var fakeBoxMullerTransform = function() {
            return (randomGenerator.next() * 2 - 1) +
                (randomGenerator.next() * 2 - 1) +
                (randomGenerator.next() * 2 - 1);
        };

        var generate = function(dataCount) {

            var toDate = new Date(currentDate.getTime());
            toDate.setUTCDate(toDate.getUTCDate() + dataCount);

            var millisecondsPerYear = 3.15569e10,
                rangeYears = (toDate.getTime() - currentDate.getTime()) / millisecondsPerYear,
                prices,
                volume,
                ohlcv = [],
                daySteps,
                currentStep = 0,
                currentIntraStep = 0;

            if (!randomGenerator) {
                randomGenerator = random(randomSeed);
            }

            prices = generatePrices(rangeYears, dataCount * intraDaySteps);
            volume = generateVolumes(rangeYears, dataCount);

            var date = new Date(currentDate.getTime());
            while (ohlcv.length < dataCount) {
                if (!filter || filter(date)) {
                    daySteps = prices.slice(currentIntraStep, currentIntraStep + intraDaySteps);
                    ohlcv.push({
                        date: new Date(date.getTime()),
                        open: daySteps[0],
                        high: Math.max.apply({}, daySteps),
                        low: Math.min.apply({}, daySteps),
                        close: daySteps[intraDaySteps - 1],
                        volume: volume[currentStep]
                    });
                    currentIntraStep += intraDaySteps;
                    currentStep += 1;
                }
                date.setUTCDate(date.getUTCDate() + 1);
            }
            currentDate = new Date(date.getTime());

            return ohlcv;
        };

        var dataGenerator = function(selection) {
        };

        /**
        * Used to trigger the generation of data once generation parameters have been set.
        *
        * @memberof fc.utilities.dataGenerator
        * @method generate
        * @param {integer} dataCount the number of days to generate data for.
        * @returns the generated data in a format suitable for the chart series components.
        * This constitutes and array of objects with the following fields: date, open, high,
        * low, close, volume. The data will be spaced as daily data with each date being a
        * weekday.
        */
        dataGenerator.generate = function(dataCount) {
            return generate(dataCount);
        };

        /**
        * Used to get/set the `mu` property for the brownian motion calculation this dictates the
        * deviation in the standard deviation part of the calculation.
        *
        * @memberof fc.utilities.dataGenerator
        * @method mu
        * @param {decimal} value the standard deviation for the generation equation.
        * @returns the current value if a value is not specified. The default value is 0.1.
        */
        dataGenerator.mu = function(value) {
            if (!arguments.length) {
                return mu;
            }
            mu = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the `sigma` property for the brownian motion calculation this dictates the
        * offset in the standard deviation part of the calculation.
        *
        * @memberof fc.utilities.dataGenerator
        * @method sigma
        * @param {decimal} value the offset for the generation equation.
        * @returns the current value if a value is not specified. The default value is 0.1.
        */
        dataGenerator.sigma = function(value) {
            if (!arguments.length) {
                return sigma;
            }
            sigma = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the starting price which provides the reference point for the generation of
        * the data that follows.
        *
        * @memberof fc.utilities.dataGenerator
        * @method startingPrice
        * @param {decimal} value the starting price for data generation.
        * @returns the current value if a value is not specified. The default value is 100.
        */
        dataGenerator.startingPrice = function(value) {
            if (!arguments.length) {
                return startingPrice;
            }
            startingPrice = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the starting volume which provides the reference point for the generation of
        * the data that follows.
        *
        * @memberof fc.utilities.dataGenerator
        * @method startingVolume
        * @param {decimal} value the starting volume for data generation.
        * @returns the current value if a value is not specified. The default value is 100000.
        */
        dataGenerator.startingVolume = function(value) {
            if (!arguments.length) {
                return startingVolume;
            }
            startingVolume = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the number of data points (tick) calculated for each daily data period.
        *
        * @memberof fc.utilities.dataGenerator
        * @method intraDaySteps
        * @param {decimal} value the number of ticks to evaluate within each daily data set.
        * @returns the current value if a value is not specified. The default value is 50.
        */
        dataGenerator.intraDaySteps = function(value) {
            if (!arguments.length) {
                return intraDaySteps;
            }
            intraDaySteps = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the noise factor for the volume data generator. The volume data is generated
        * randomly within the range the start value +/- the noise factor.
        *
        * @memberof fc.utilities.dataGenerator
        * @method volumeNoiseFactor
        * @param {decimal} value multiplier (factor) for noise added to the random volume data generator.
        * @returns the current value if a value is not specified. The default value is 0.3.
        */
        dataGenerator.volumeNoiseFactor = function(value) {
            if (!arguments.length) {
                return volumeNoiseFactor;
            }
            volumeNoiseFactor = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the data filter function. The function passed to this property will have each date sent
        * to it and it will decide whether that date should appear in the final dataset. The default function
        * will filter weekends:
        *
        * <pre><code>function(date) { return !(date.getDay() === 0 || date.getDay() === 6); };</code></pre>
        *
        * @memberof fc.utilities.dataGenerator
        * @method filter
        * @param {function} value a function which will receive a date object and return a boolean to flag
        * whether a date should be included in the data set or not.
        * @returns the current function if a function is not specified.
        */
        dataGenerator.filter = function(value) {
            if (!arguments.length) {
                return filter;
            }
            filter = value;
            return dataGenerator;
        };

        /**
        * Used to get/set the date the data runs from.
        *
        * @memberof fc.utilities.dataGenerator
        * @method seedDate
        * @param {date} value the date of the first data item in the data set.
        * @returns the current value if a value is not specified. This property has no default value and must
        * be set before calling `generate()`.
        */
        dataGenerator.seedDate = function(value) {
            if (!arguments.length) {
                return seedDate;
            }
            seedDate = value;
            currentDate = seedDate;
            randomGenerator = null;
            return dataGenerator;
        };

        /**
        * Used to get/set the seed value for the Random Number Generator used to create the data.
        *
        * @memberof fc.utilities.dataGenerator
        * @method randomSeed
        * @param {decimal} value the seed used for the Random Number Generator.
        * @returns the current value if a value is not specified. If not set then the default seed will be the
        * current time as a timestamp in milliseconds.
        */
        dataGenerator.randomSeed = function(value) {
            if (!arguments.length) {
                return randomSeed;
            }
            randomSeed = value;
            randomGenerator = null;
            return dataGenerator;
        };

        return dataGenerator;
    };


}(fc));
(function(d3, fc) {
    'use strict';

    /**
     * The extent function enhances the functionality of the equivalent D3 extent function, allowing
     * you to pass an array of fields which will be used to derive the extent of the supplied array. For
     * example, if you have an array of items with properties of 'high' and 'low', you
     * can use <code>fc.utilities.extent(data, ['high', 'low'])</code> to compute the extent of your data.
     *
     * @memberof fc.utilities
     * @param {array} data an array of data points, or an array of arrays of data points
     * @param {array} fields the names of object properties that represent field values
     */
    fc.utilities.extent = function(data, fields) {

        if (fields === null) {
            return d3.extent(data);
        }

        // the function only operates on arrays of arrays, but we can pass non-array types in
        if (!Array.isArray(data)) {
            data = [data];
        }
        // we need an array of arrays if we don't have one already
        if (!Array.isArray(data[0])) {
            data = [data];
        }
        // the fields parameter must be an array of field names, but we can pass non-array types in
        if (!Array.isArray(fields)) {
            fields = [fields];
        }

        // Return the smallest and largest
        return [
            d3.min(data, function(d0) {
                return d3.min(d0, function(d1) {
                    return d3.min(fields.map(function(f) {
                        return d1[f];
                    }));
                });
            }),
            d3.max(data, function(d0) {
                return d3.max(d0, function(d1) {
                    return d3.max(fields.map(function(f) {
                        return d1[f];
                    }));
                });
            })
        ];
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.utilities.fn = {
        identity: function(d) { return d; },
        index: function(d, i) { return i; },
        noop: function(d) {  }
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    // the barWidth property of the various series takes a function which, when given an
    // array of x values, returns a suitable width. This function creates a width which is
    // equal to the smallest distance between neighbouring datapoints multiplied
    // by the given factor
    fc.utilities.fractionalBarWidth = function(fraction) {

        return function(pixelValues) {
            // return some default value if there are not enough datapoints to compute the width
            if (pixelValues.length <= 1) {
                return 10;
            }

            pixelValues.sort();

            // creates a new array as a result of applying the 'fn' function to
            // the consecutive pairs of items in the source array
            function pair(arr, fn) {
                var res = [];
                for (var i = 1; i < arr.length; i++) {
                    res.push(fn(arr[i], arr[i - 1]));
                }
                return res;
            }

            // compute the distance between neighbouring items
            var neighbourDistances = pair(pixelValues, function(first, second) {
                return Math.abs(first - second);
            });

            var minDistance = d3.min(neighbourDistances);
            return fraction * minDistance;
        };
    };
}(d3, fc));
/* globals computeLayout */
(function(d3, fc) {
    'use strict';

    fc.utilities.layout = function() {

        // parses the style attribute, converting it into a JavaScript object
        function parseStyle(style) {
            if (!style) {
                return {};
            }
            var properties = style.split(';');
            var json = {};
            properties.forEach(function(property) {
                var components = property.split(':');
                if (components.length === 2) {
                    var name = components[0].trim();
                    var value = components[1].trim();
                    json[name] = isNaN(value) ? value : Number(value);
                }
            });
            return json;
        }

        // creates the structure required by the layout engine
        function createNodes(el) {
            function getChildNodes() {
                var children = [];
                for (var i = 0; i < el.childNodes.length; i++) {
                    var child = el.childNodes[i];
                    if (child.nodeType === 1) {
                        if (child.getAttribute('layout-css')) {
                            children.push(createNodes(child));
                        }
                    }
                }
                return children;
            }
            return {
                style: parseStyle(el.getAttribute('layout-css')),
                children: getChildNodes(el),
                element: el,
                layout: {
                    width: undefined,
                    height: undefined,
                    top: 0,
                    left: 0
                }
            };
        }

        // takes the result of layout and applied it to the SVG elements
        function applyLayout(node) {
            node.element.setAttribute('layout-width', node.layout.width);
            node.element.setAttribute('layout-height', node.layout.height);
            node.element.setAttribute('transform', 'translate(' + node.layout.left + ', ' + node.layout.top + ')');
            node.children.forEach(applyLayout);
        }

        var layout = function(selection) {
            selection.each(function(data) {
                // compute the width and height of the SVG element
                var style = getComputedStyle(this);
                var width = parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                var height = parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

                // create the layout nodes
                var layoutNodes = createNodes(this);
                // set the width / height of the root
                layoutNodes.style.width = width;
                layoutNodes.style.height = height;

                // use the Facebook CSS goodness
                computeLayout(layoutNodes);

                // apply the resultant layout
                applyLayout(layoutNodes);
            });
        };
        return layout;
    };

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.utilities.pointSnap = function(xScale, yScale, xValue, yValue, data) {
        return function(xPixel, yPixel) {
            var x = xScale.invert(xPixel),
                y = yScale.invert(yPixel),
                nearest = null,
                minDiff = Number.MAX_VALUE;
            for (var i = 0, l = data.length; i < l; i++) {
                var d = data[i],
                    dx = x - xValue(d),
                    dy = y - yValue(d),
                    diff = Math.sqrt(dx * dx + dy * dy);

                if (diff < minDiff) {
                    minDiff = diff;
                    nearest = d;
                } else {
                    break;
                }
            }

            return {
                datum: nearest,
                x: nearest ? xScale(xValue(nearest)) : xPixel,
                y: nearest ? yScale(yValue(nearest)) : yPixel
            };
        };
    };

    fc.utilities.seriesPointSnap = function(series, data) {
        var xScale = series.xScale(),
            yScale = series.yScale(),
            xValue = series.xValue ? series.xValue() : function(d) { return d.date; },
            yValue = series.yValue();
        return fc.utilities.pointSnap(xScale, yScale, xValue, yValue, data);
    };

}(d3, fc));

(function(d3, fc) {
    'use strict';

    // a property that follows the D3 component convention for accessors
    // see: http://bost.ocks.org/mike/chart/
    fc.utilities.property = function(initialValue) {

        var accessor = function(newValue) {
            if (!arguments.length) {
                return accessor.value;
            }
            accessor.value = newValue;
            return this;
        };

        accessor.value = initialValue;

        return accessor;
    };

    // a property that follows the D3 component convention for accessors
    // see: http://bost.ocks.org/mike/chart/
    fc.utilities.functorProperty = function(initialValue) {

        var accessor = function(newValue) {
            if (!arguments.length) {
                return accessor.value;
            }
            accessor.value = d3.functor(newValue);
            return this;
        };

        accessor.value = d3.functor(initialValue);

        return accessor;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.utilities.simpleDataJoin = function(parent, className, data, dataKey) {
        // "Caution: avoid interpolating to or from the number zero when the interpolator is used to generate
        // a string (such as with attr).
        // Very small values, when stringified, may be converted to scientific notation and
        // cause a temporarily invalid attribute or style property value.
        // For example, the number 0.0000001 is converted to the string "1e-7".
        // This is particularly noticeable when interpolating opacity values.
        // To avoid scientific notation, start or end the transition at 1e-6,
        // which is the smallest value that is not stringified in exponential notation."
        // - https://github.com/mbostock/d3/wiki/Transitions#d3_interpolateNumber
        var effectivelyZero = 1e-6;

        // update
        var updateSelection = parent.selectAll('g.' + className)
            .data(data, dataKey || fc.utilities.fn.identity);

        // enter
        // entering elements fade in (from transparent to opaque)
        var enterSelection = updateSelection.enter()
            .append('g')
            .classed(className, true)
            .style('opacity', effectivelyZero);

        // exit
        // exiting elements fade out (from opaque to transparent)
        var exitSelection = d3.transition(updateSelection.exit())
            .style('opacity', effectivelyZero)
            .remove();

        // all properties of the selection (which can be interpolated) will transition
        updateSelection = d3.transition(updateSelection)
            .style('opacity', 1);

        updateSelection.enter = d3.functor(enterSelection);
        updateSelection.exit = d3.functor(exitSelection);
        return updateSelection;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.indicators.bollingerBands = function() {

        var algorithm = fc.math.bollingerBands();

        var readCalculatedValue = function(d) {
            return bollingerBands.readCalculatedValue.value(d) || {};
        };

        var area = fc.series.area()
            .y0Value(function(d) {
                return readCalculatedValue(d).upper;
            })
            .y1Value(function(d) {
                return readCalculatedValue(d).lower;
            });

        var upperLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).upper;
            });

        var averageLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).average;
            });

        var lowerLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).lower;
            });

        var bollingerBands = function(selection) {

            algorithm.inputValue(bollingerBands.yValue.value)
                .outputValue(bollingerBands.writeCalculatedValue.value);

            area.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            upperLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            averageLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            lowerLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            selection.each(function(data) {
                algorithm(data);

                var container = d3.select(this);

                var areaContianer = container.selectAll('g.area')
                    .data([data]);

                areaContianer.enter()
                    .append('g')
                    .attr('class', 'area');

                areaContianer.call(area);

                var upperLineContainer = container.selectAll('g.upper')
                    .data([data]);

                upperLineContainer.enter()
                    .append('g')
                    .attr('class', 'upper');

                upperLineContainer.call(upperLine);

                var averageLineContainer = container.selectAll('g.average')
                    .data([data]);

                averageLineContainer.enter()
                    .append('g')
                    .attr('class', 'average');

                averageLineContainer.call(averageLine);

                var lowerLineContainer = container.selectAll('g.lower')
                    .data([data]);

                lowerLineContainer.enter()
                    .append('g')
                    .attr('class', 'lower');

                lowerLineContainer.call(lowerLine);
            });
        };

        bollingerBands.xScale = fc.utilities.property(d3.time.scale());
        bollingerBands.yScale = fc.utilities.property(d3.scale.linear());
        bollingerBands.yValue = fc.utilities.property(function(d) { return d.close; });
        bollingerBands.xValue = fc.utilities.property(function(d) { return d.date; });
        bollingerBands.writeCalculatedValue = fc.utilities.property(function(d, value) { d.bollingerBands = value; });
        bollingerBands.readCalculatedValue = fc.utilities.property(function(d) { return d.bollingerBands; });

        d3.rebind(bollingerBands, algorithm, 'multiplier', 'windowSize');

        return bollingerBands;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.indicators.movingAverage = function() {

        var algorithm = fc.math.slidingWindow()
            .accumulator(d3.mean);

        var averageLine = fc.series.line();

        var movingAverage = function(selection) {

            algorithm.inputValue(movingAverage.yValue.value)
                .outputValue(movingAverage.writeCalculatedValue.value);

            averageLine.xScale(movingAverage.xScale.value)
                .yScale(movingAverage.yScale.value)
                .xValue(movingAverage.xValue.value)
                .yValue(movingAverage.readCalculatedValue.value);

            selection.each(function(data) {
                algorithm(data);

                d3.select(this)
                    .call(averageLine);
            });
        };

        movingAverage.xScale = fc.utilities.property(d3.time.scale());
        movingAverage.yScale = fc.utilities.property(d3.scale.linear());
        movingAverage.yValue = fc.utilities.property(function(d) { return d.close; });
        movingAverage.xValue = fc.utilities.property(function(d) { return d.date; });
        movingAverage.writeCalculatedValue = fc.utilities.property(function(d, value) { d.movingAverage = value; });
        movingAverage.readCalculatedValue = fc.utilities.property(function(d) { return d.movingAverage; });

        d3.rebind(movingAverage, algorithm, 'windowSize');

        return movingAverage;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.indicators.relativeStrengthIndicator = function() {

        var algorithm = fc.math.relativeStrengthIndicator();
        var annotations = fc.tools.annotation();
        var rsiLine = fc.series.line();

        var rsi = function(selection) {

            algorithm.outputValue(rsi.writeCalculatedValue.value);

            annotations.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value);

            rsiLine.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value)
                .xValue(rsi.xValue.value)
                .yValue(rsi.readCalculatedValue.value);

            selection.each(function(data) {
                algorithm(data);

                var container = d3.select(this);

                var annotationsContainer = container.selectAll('g.annotations')
                    .data([[
                        rsi.upperValue.value.apply(this, arguments),
                        50,
                        rsi.lowerValue.value.apply(this, arguments)
                    ]]);

                annotationsContainer.enter()
                    .append('g')
                    .attr('class', 'annotations');

                annotationsContainer.call(annotations);

                var rsiLineContainer = container.selectAll('g.indicator')
                    .data([data]);

                rsiLineContainer.enter()
                    .append('g')
                    .attr('class', 'indicator');

                rsiLineContainer.call(rsiLine);
            });
        };

        rsi.xScale = fc.utilities.property(d3.time.scale());
        rsi.yScale = fc.utilities.property(d3.scale.linear());
        rsi.xValue = fc.utilities.property(function(d) { return d.date; });
        rsi.writeCalculatedValue = fc.utilities.property(function(d, value) { d.rsi = value; });
        rsi.readCalculatedValue = fc.utilities.property(function(d) { return d.rsi; });
        rsi.upperValue = fc.utilities.functorProperty(70);
        rsi.lowerValue = fc.utilities.functorProperty(30);

        d3.rebind(rsi, algorithm, 'openValue', 'closeValue', 'windowSize');

        return rsi;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.math.bollingerBands = function() {

        var slidingWindow = fc.math.slidingWindow()
            .accumulator(function(values) {
                var avg = d3.mean(values);
                var stdDev = d3.deviation(values);
                var multiplier = bollingerBands.multiplier.value.apply(this, arguments);
                return {
                    upper: avg + multiplier * stdDev,
                    average: avg,
                    lower: avg - multiplier * stdDev
                };
            });

        var bollingerBands = function(data) {
            return slidingWindow(data);
        };

        bollingerBands.multiplier = fc.utilities.functorProperty(2);

        d3.rebind(bollingerBands, slidingWindow, 'windowSize', 'inputValue', 'outputValue');

        return bollingerBands;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.math.relativeStrengthIndicator = function() {

        var slidingWindow = fc.math.slidingWindow()
            .windowSize(14)
            .accumulator(function(values) {
                var downCloses = [];
                var upCloses = [];

                for (var i = 0, l = values.length; i < l; i++) {
                    var value = values[i];

                    var openValue = rsi.openValue.value(value);
                    var closeValue = rsi.closeValue.value(value);

                    downCloses.push(openValue > closeValue ? openValue - closeValue : 0);
                    upCloses.push(openValue < closeValue ? closeValue - openValue : 0);
                }

                var downClosesAvg = rsi.averageAccumulator.value(downCloses);
                if (downClosesAvg === 0) {
                    return 100;
                }

                var rs = rsi.averageAccumulator.value(upCloses) / downClosesAvg;
                return 100 - (100 / (1 + rs));
            });

        var rsi = function(data) {
            return slidingWindow(data);
        };

        rsi.openValue = fc.utilities.property(function(d) { return d.open; });
        rsi.closeValue = fc.utilities.property(function(d) { return d.close; });
        rsi.averageAccumulator = fc.utilities.property(function(values) {
            var alpha = 1 / values.length;
            var result = values[0];
            for (var i = 1, l = values.length; i < l; i++) {
                result = alpha * values[i] + (1 - alpha) * result;
            }
            return result;
        });

        d3.rebind(rsi, slidingWindow, 'windowSize', 'outputValue');

        return rsi;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.math.slidingWindow = function() {

        var slidingWindow = function(data) {
            var size = slidingWindow.windowSize.value.apply(this, arguments);
            var accumulator = slidingWindow.accumulator.value;
            var inputValue = slidingWindow.inputValue.value;
            var outputValue = slidingWindow.outputValue.value;

            var windowData = data.slice(0, size).map(inputValue);
            return data.slice(size - 1, data.length)
                .map(function(d, i) {
                    if (i > 0) {
                        // Treat windowData as FIFO rolling buffer
                        windowData.shift();
                        windowData.push(inputValue(d));
                    }
                    var result = accumulator(windowData);
                    return outputValue(d, result);
                });
        };

        slidingWindow.windowSize = fc.utilities.functorProperty(10);
        slidingWindow.accumulator = fc.utilities.property(fc.utilities.fn.noop);
        slidingWindow.inputValue = fc.utilities.property(fc.utilities.fn.identity);
        slidingWindow.outputValue = fc.utilities.property(function(obj, value) { return value; });

        return slidingWindow;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.scale.dateTime = function() {
        return dateTimeScale();
    };


    /**
    * The `fc.scale.dateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps.
    * As an example, you can use this scale to render a chart where the weekends are skipped.
    *
    * @type {object}
    * @memberof fc.scale
    * @class fc.scale.dateTime
    */
    function dateTimeScale(adaptedScale, discontinuityProvider) {

        if (!arguments.length) {
            adaptedScale = d3.time.scale();
            discontinuityProvider = fc.scale.discontinuity.identity();
        }

        function discontinuities() { return scale.discontinuityProvider.value; }

        function scale(date) {
            var domain = adaptedScale.domain();
            var range = adaptedScale.range();

            // The discontinuityProvider is responsible for determine the distance between two points
            // along a scale that has discontinuities (i.e. sections that have been removed).
            // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
            // over the domain of this axis, versus the discontinuous distance to 'x'
            var totalDomainDistance = discontinuities().distance(domain[0], domain[1]);
            var distanceToX = discontinuities().distance(domain[0], date);
            var ratioToX = distanceToX / totalDomainDistance;
            var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
            return scaledByRange;
        }

        scale.invert = function(x) {
            var domain = adaptedScale.domain();
            var range = adaptedScale.range();

            var ratioToX = (x - range[0]) / (range[1] - range[0]);
            var totalDomainDistance = discontinuities().distance(domain[0], domain[1]);
            var distanceToX = ratioToX * totalDomainDistance;
            return discontinuities().offset(domain[0], distanceToX);
        };

        scale.domain = function(x) {
            if (!arguments.length) {
                return adaptedScale.domain();
            }
            // clamp the upper and lower domain values to ensure they
            // do not fall within a discontinuity
            var domainLower = discontinuities().clampUp(x[0]);
            var domainUpper = discontinuities().clampDown(x[1]);
            adaptedScale.domain([domainLower, domainUpper]);
            return scale;
        };

        scale.copy = function() {
            return dateTimeScale(adaptedScale.copy(), discontinuities().copy());
        };

        scale.discontinuityProvider = fc.utilities.property(discontinuityProvider);

        return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp',
            'nice', 'ticks', 'tickFormat');
    }

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.identity = function() {

        var identity = {};

        identity.distance = function(startDate, endDate) {
            return endDate.getTime() - startDate.getTime();
        };

        identity.offset = function(startDate, ms) {
            return new Date(startDate.getTime() + ms);
        };

        identity.clampUp = fc.utilities.fn.identity;

        identity.clampDown = fc.utilities.fn.identity;

        identity.copy = function() { return identity; };

        return identity;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.skipWeekends = function() {
        var millisPerDay = 24 * 3600 * 1000;
        var millisPerWorkWeek = millisPerDay * 5;
        var millisPerWeek = millisPerDay * 7;

        var skipWeekends = {};

        function isWeekend(date) {
            return date.getDay() === 0 || date.getDay() === 6;
        }

        skipWeekends.clampDown = function(date) {
            if (isWeekend(date)) {
                var daysToSubtract = date.getDay() === 0 ? 2 : 1;
                // round the date up to midnight
                var newDate = d3.time.day.ceil(date);
                // then subtract the required number of days
                return d3.time.day.offset(newDate, -daysToSubtract);
            } else {
                return date;
            }
        };

        skipWeekends.clampUp = function(date) {
            if (isWeekend(date)) {
                var daysToAdd = date.getDay() === 0 ? 1 : 2;
                // round the date down to midnight
                var newDate = d3.time.day.floor(date);
                // then add the required number of days
                return d3.time.day.offset(newDate, daysToAdd);
            } else {
                return date;
            }
        };

        // returns the number of included milliseconds (i.e. those which do not fall)
        // within discontinuities, along this scale
        skipWeekends.distance = function(startDate, endDate) {
            startDate = skipWeekends.clampUp(startDate);
            endDate = skipWeekends.clampDown(endDate);

            // move the start date to the end of week boundary
            var offsetStart = d3.time.saturday.ceil(startDate);
            if (endDate < offsetStart) {
                return endDate.getTime() - startDate.getTime();
            }

            var msAdded = offsetStart.getTime() - startDate.getTime();

            // move the end date to the end of week boundary
            var offsetEnd = d3.time.saturday.ceil(endDate);
            var msRemoved = offsetEnd.getTime() - endDate.getTime();

            // determine how many weeks there are between these two dates
            var weeks = (offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek;

            return weeks * millisPerWorkWeek + msAdded - msRemoved;
        };

        skipWeekends.offset = function(startDate, ms) {
            var date = isWeekend(startDate) ? skipWeekends.clampUp(startDate) : startDate;
            var remainingms = ms;

            // move to the end of week boundary
            var endOfWeek = d3.time.saturday.ceil(date);
            remainingms -= (endOfWeek.getTime() - date.getTime());

            // if the distance to the boundary is greater than the number of ms
            // simply add the ms to the current date
            if (remainingms < 0) {
                return new Date(date.getTime() + ms);
            }

            // skip the weekend
            date = d3.time.day.offset(endOfWeek, 2);

            // add all of the complete weeks to the date
            var completeWeeks = Math.floor(remainingms / millisPerWorkWeek);
            date = d3.time.day.offset(date, completeWeeks * 7);
            remainingms -= completeWeeks * millisPerWorkWeek;

            // add the remaining time
            date = new Date(date.getTime() + remainingms);
            return date;
        };

        skipWeekends.copy = function() { return skipWeekends; };

        return skipWeekends;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    /**
    * This component provides gridlines, both horizontal and vertical linked to the respective chart scales/axes.
    * If the pixel alignment options are selected on the scales, this generally produces crisper graphics.
    *
    * @type {object}
    * @memberof fc.scale
    * @class fc.scale.gridlines
    */
    fc.scale.gridlines = function() {

        var xScale = fc.scale.dateTime(),
            yScale = fc.scale.linear(),
            xTicks = 10,
            yTicks = 10;

        var xLines = function(data, grid) {
            var xlines = grid.selectAll('.x')
                .data(data);
            xlines
                .enter().append('line')
                .attr({
                    'class': 'x',
                    'x1': function(d) { return xScale(d);},
                    'x2': function(d) { return xScale(d);},
                    'y1': yScale.range()[0],
                    'y2': yScale.range()[1]
                });
            xlines
                .attr({
                    'x1': function(d) { return xScale(d);},
                    'x2': function(d) { return xScale(d);},
                    'y1': yScale.range()[0],
                    'y2': yScale.range()[1]
                });
            xlines.exit().remove();
        };

        var yLines = function(data, grid) {
            var ylines = grid.selectAll('.y')
                .data(data);
            ylines
                .enter().append('line')
                .attr({
                    'class': 'y',
                    'x1': xScale.range()[0],
                    'x2': xScale.range()[1],
                    'y1': function(d) { return yScale(d);},
                    'y2': function(d) { return yScale(d);}
                });
            ylines
                .attr({
                    'x1': xScale.range()[0],
                    'x2': xScale.range()[1],
                    'y1': function(d) { return yScale(d);},
                    'y2': function(d) { return yScale(d);}
                });
            ylines.exit().remove();
        };

        /**
        * Constructs a new instance of the gridlines component.
        *
        * @memberof fc.scale.gridlines
        * @param {selection} selection contains the D3 selection to receive the new DOM elements.
        */
        var gridlines = function(selection) {
            var grid, xTickData, yTickData;

            selection.each(function() {
                xTickData = xScale.ticks(xTicks);
                yTickData = yScale.ticks(yTicks);

                grid = d3.select(this).selectAll('.gridlines').data([[xTickData, yTickData]]);
                grid.enter().append('g').classed('gridlines', true);
                xLines(xTickData, grid);
                yLines(yTickData, grid);
            });
        };

        /**
        * Specifies the X scale which the gridlines component uses to locate its SVG elements.
        * If not specified, returns the current X scale, which defaults to an unmodified fc.scale.dateTime
        *
        * @memberof fc.scale.gridlines
        * @method xScale
        * @param {scale} scale a D3 scale
        */
        gridlines.xScale = function(scale) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = scale;
            return gridlines;
        };

        /**
        * Specifies the Y scale which the gridlines component uses to locate its SVG elements.
        * If not specified, returns the current Y scale, which defaults to an unmodified fc.scale.linear.
        *
        * @memberof fc.scale.gridlines
        * @method yScale
        * @param {scale} scale a D3 scale
        */
        gridlines.yScale = function(scale) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = scale;
            return gridlines;
        };

        /**
        * Specifies the number of X ticks / vertical lines used on the X scale.
        * If not specified, returns the current X ticks, which defaults to 10.
        *
        * @memberof fc.scale.gridlines
        * @method xTicks
        * @param {integer} value a D3 scale
        */
        gridlines.xTicks = function(value) {
            if (!arguments.length) {
                return xTicks;
            }
            xTicks = value;
            return gridlines;
        };

        /**
        * Specifies the number of Y ticks / horizontal lines used on the Y scale.
        * If not specified, returns the current Y ticks, which defaults to 10.
        *
        * @memberof fc.scale.gridlines
        * @method yTicks
        * @param {integer} value a D3 scale
        */
        gridlines.yTicks = function(value) {
            if (!arguments.length) {
                return yTicks;
            }
            yTicks = value;
            return gridlines;
        };

        return gridlines;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    /**
    * This component provides a scale primarily used on the Y axis of charts and extends the d3.scale.linear
    * scale. This scale contains an option to pixel align when calculating the screen pixel from the real value.
    * This generally produces crisper graphics.
    *
    * @type {object}
    * @memberof fc.scale
    * @class fc.scale.linear
    */
    fc.scale.linear = function() {
        return linearScale();
    };

    function linearScale(linear) {

        var alignPixels = true;

        if (!arguments.length) {
            linear = d3.scale.linear();
        }

        /**
        * Used to scale a value from domain space to pixel space. This function is used primarily
        * to position elements on the scales axis.
        *
        * @memberof fc.scale.linear
        * @method scale
        * @param {decimal} x the real world domain value to be scaled.
        * @returns the converted pixel aligned value in pixel space.
        */
        function scale(x) {
            var n = linear(x);
            return alignPixels ? Math.round(n) : n;
        }

        /**
        * Used to create a copy of the current scale. When scales are added to D3 axes the scales
        * are copied rather than a reference being stored.
        * This function facilities a deep copy.
        *
        * @memberof fc.scale.linear
        * @method copy
        * @returns the copy.
        */
        scale.copy = function() {
            return linearScale(linear.copy());
        };

        /**
        * Used to get or set the option to align ticks to pixel columns/rows.
        * Pixel aligning yields crisper chart graphics.
        *
        * @memberof fc.scale.linear
        * @method alignPixels
        * @param {boolean} value if set to `true` values will be pixel aligned.
        * If no value argument is passed the current setting will be returned.
        */
        scale.alignPixels = function(value) {
            if (!arguments.length) {
                return alignPixels;
            }
            alignPixels = value;
            return scale;
        };

        return d3.rebind(scale, linear, 'domain', 'ticks', 'tickFormat', 'range', 'rangeRound', 'interpolate', 'clamp',
            'invert', 'nice');
    }
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.area = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return area.xScale.value(area.xValue.value(d)); };
        var y0 = function(d) { return area.yScale.value(area.y0Value.value(d)); };
        var y1 = function(d) { return area.yScale.value(area.y1Value.value(d)); };

        var areaData = d3.svg.area()
            .defined(function(d) {
                return !isNaN(y0(d)) && !isNaN(y1(d));
            })
            .x(x)
            .y0(y0)
            .y1(y1);

        var area = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .selectAll('.area-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('area-series', true)
                    .append('path');

                container.select('path')
                    .attr('d', areaData);

                area.decorate.value(container);
            });
        };

        area.decorate = fc.utilities.property(fc.utilities.fn.noop);
        area.xScale = fc.utilities.property(d3.time.scale());
        area.yScale = fc.utilities.property(d3.scale.linear());
        area.y0Value = fc.utilities.functorProperty(0);
        area.y1Value = fc.utilities.property(function(d) { return d.close; });
        area.xValue = fc.utilities.property(function(d) { return d.date; });


        return area;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.bar = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return bar.xScale.value(bar.xValue.value(d)); };
        var y = function(d) { return bar.yScale.value(bar.yValue.value(d)); };

        var bar = function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);
                var series = fc.utilities.simpleDataJoin(container, 'bar', data, bar.xValue.value);

                // enter
                series.enter()
                    .append('rect');

                var width = bar.barWidth.value(data.map(x));

                // update
                series.select('rect')
                    .attr('x', function(d) {
                        return x(d) - width / 2;
                    })
                    .attr('y', function(d) { return y(d); })
                    .attr('width', width)
                    .attr('height', function(d) { return bar.yScale.value(0) - y(d); });

                // properties set by decorate will transition too
                bar.decorate.value(series);
            });
        };

        bar.decorate = fc.utilities.property(fc.utilities.fn.noop);
        bar.xScale = fc.utilities.property(d3.time.scale());
        bar.yScale = fc.utilities.property(d3.scale.linear());
        bar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        bar.yValue = fc.utilities.property(function(d) { return d.close; });
        bar.xValue = fc.utilities.property(function(d) { return d.date; });

        return bar;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.series.candlestick = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return candlestick.xScale.value(candlestick.xValue.value(d)); };
        var yOpen = function(d) { return candlestick.yScale.value(candlestick.yOpenValue.value(d)); };
        var yHigh = function(d) { return candlestick.yScale.value(candlestick.yHighValue.value(d)); };
        var yLow = function(d) { return candlestick.yScale.value(candlestick.yLowValue.value(d)); };
        var yClose = function(d) { return candlestick.yScale.value(candlestick.yCloseValue.value(d)); };

        var candlestick = function(selection) {

            selection.each(function(data) {

                var series = d3.select(this)
                    .selectAll('.candlestick-series')
                    .data([data]);

                series.enter().append('g')
                    .attr('class', 'candlestick-series');

                var g = fc.utilities.simpleDataJoin(series, 'candlestick', data, candlestick.xValue.value);

                var enter = g.enter();
                enter.append('line');
                enter.append('rect');

                g.classed({
                        'up': function(d) {
                            return candlestick.yCloseValue.value(d) > candlestick.yOpenValue.value(d);
                        },
                        'down': function(d) {
                            return candlestick.yCloseValue.value(d) < candlestick.yOpenValue.value(d);
                        }
                    });

                g.select('line')
                    .attr('x1', x)
                    .attr('y1', yHigh)
                    .attr('x2', x)
                    .attr('y2', yLow);

                var barWidth = candlestick.barWidth.value(data.map(x));

                g.select('rect')
                    .attr('x', function(d) {
                        return x(d) - barWidth / 2;
                    })
                    .attr('y', function(d) {
                        return Math.min(yOpen(d), yClose(d));
                    })
                    .attr('width', barWidth)
                    .attr('height', function(d) {
                        return Math.abs(yClose(d) - yOpen(d));
                    });

                candlestick.decorate.value(g);
            });
        };

        candlestick.decorate = fc.utilities.property(fc.utilities.fn.noop);
        candlestick.xScale = fc.utilities.property(d3.time.scale());
        candlestick.yScale = fc.utilities.property(d3.scale.linear());
        candlestick.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        candlestick.yOpenValue = fc.utilities.property(function(d) { return d.open; });
        candlestick.yHighValue = fc.utilities.property(function(d) { return d.high; });
        candlestick.yLowValue = fc.utilities.property(function(d) { return d.low; });
        candlestick.yCloseValue = fc.utilities.property(function(d) { return d.close; });
        candlestick.xValue = fc.utilities.property(function(d) { return d.date; });

        return candlestick;

    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.series.comparison = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var cachedData, cachedScale;

        var yScaleTransform = function(oldScale, newScale) {
            // Compute transform for elements wrt changing yScale.
            var oldDomain = oldScale.domain(),
                newDomain = newScale.domain(),
                scale = (oldDomain[1] - oldDomain[0]) / (newDomain[1] - newDomain[0]),
                translate = scale * (oldScale.range()[1] - oldScale(newDomain[1]));
            return {
                translate: translate,
                scale: scale
            };
        };

        var findIndex = function(seriesData, date) {
            // Find insertion point for date in seriesData.
            var bisect = d3.bisector(
                function(d) {
                    return d.date;
                }).left;

            var initialIndex = bisect(seriesData, date);
            if (initialIndex === 0) {
                // Google finance style, calculate changes from the
                // date one before initial date if possible, or index 0.
                initialIndex += 1;
            }
            return initialIndex;
        };

        var percentageChange = function(seriesData, initialDate) {
            // Computes the percentage change data of a series from an initial date.
            var initialIndex = findIndex(seriesData, initialDate) - 1;
            var initialClose = seriesData[initialIndex].close;

            return seriesData.map(function(d) {
                return {
                    date: d.date,
                    change: (d.close / initialClose) - 1
                };
            });
        };

        var rebaseChange = function(seriesData, initialDate) {
            // Change the initial date the percentage changes should be based from.
            var initialIndex = findIndex(seriesData, initialDate) - 1;
            var initialChange = seriesData[initialIndex].change;

            return seriesData.map(function(d) {
                return {
                    date: d.date,
                    change: d.change - initialChange
                };
            });
        };

        var calculateYDomain = function(data, xDomain) {
            var start, end;

            data = data.map(function(series) {
                series = series.data;
                start = findIndex(series, xDomain[0]) - 1;
                end = findIndex(series, xDomain[1]) + 1;
                return series.slice(start, end);
            });

            var allPoints = data.reduce(function(prev, curr) {
                return prev.concat(curr);
            }, []);

            if (allPoints.length) {
                return d3.extent(allPoints, function(d) {
                    return d.change;
                });
            } else {
                return [0, 0];
            }
        };

        var color = d3.scale.category10();

        var line = d3.svg.line()
            .interpolate('linear')
            .x(function(d) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.change);
            });

        var comparison = function(selection) {
            var series, lines;

            selection.each(function(data) {

                data = data.map(function(d) {
                    return {
                        name: d.name,
                        data: percentageChange(d.data, xScale.domain()[0])
                    };
                });

                cachedData = data; // Save for rebasing.

                color.domain(data.map(function(d) {
                    return d.name;
                }));

                yScale.domain(calculateYDomain(data, xScale.domain()));
                cachedScale = yScale.copy();

                series = d3.select(this).selectAll('.comparison-series').data([data]);
                series.enter().append('g').classed('comparison-series', true);

                lines = series.selectAll('.line')
                    .data(data, function(d) {
                        return d.name;
                    })
                    .enter().append('path')
                    .attr('class', function(d) {
                        return 'line ' + 'line' + data.indexOf(d);
                    })
                    .attr('d', function(d) {
                        return line(d.data);
                    })
                    .style('stroke', function(d) {
                        return color(d.name);
                    });

                series.selectAll('.line')
                    .attr('d', function(d) {
                        return line(d.data);
                    });
            });
        };

        comparison.geometricZoom = function(selection, xTransformTranslate, xTransformScale) {
            // Apply a transformation for each line to update its position wrt the new initial date,
            // then apply the yScale transformation to reflect the updated yScale domain.

            var initialIndex,
                yTransform;

            var lineTransform = function(initialChange) {
                var yTransformLineTranslate = cachedScale(0) - cachedScale(initialChange);

                yTransformLineTranslate *= yTransform.scale;
                yTransformLineTranslate += yTransform.translate;

                return 'translate(' + xTransformTranslate + ',' + yTransformLineTranslate + ')' +
                    ' scale(' + xTransformScale + ',' + yTransform.scale + ')';
            };

            var domainData = cachedData.map(function(d) {
                return {
                    name: d.name,
                    data: rebaseChange(d.data, xScale.domain()[0])
                };
            });

            yScale.domain(calculateYDomain(domainData, xScale.domain()));
            yTransform = yScaleTransform(cachedScale, yScale);

            cachedData = cachedData.map(function(d) {
                initialIndex = findIndex(d.data, xScale.domain()[0]) - 1;
                return {
                    name: d.name,
                    data: d.data,
                    transform: lineTransform(d.data[initialIndex].change)
                };
            });

            selection.selectAll('.line')
                .data(cachedData)
                .attr('transform', function(d) { return d.transform; });
        };

        comparison.xScale = function(value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return comparison;
        };

        comparison.yScale = function(value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return comparison;
        };

        return comparison;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return line.xScale.value(line.xValue.value(d)); };
        var y = function(d) { return line.yScale.value(line.yValue.value(d)); };

        var lineData = d3.svg.line()
            .defined(function(d) {
                return !isNaN(y(d));
            })
            .x(x)
            .y(y);

        var line = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .selectAll('.line-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('line-series', true)
                    .append('path');

                container.select('path')
                    .attr('d', lineData);

                line.decorate.value(container);
            });
        };

        line.decorate = fc.utilities.property(fc.utilities.fn.noop);
        line.xScale = fc.utilities.property(d3.time.scale());
        line.yScale = fc.utilities.property(d3.scale.linear());
        line.yValue = fc.utilities.property(function(d) { return d.close; });
        line.xValue = fc.utilities.property(function(d) { return d.date; });

        return line;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.ohlc = function(drawMethod) {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return ohlc.xScale.value(ohlc.xValue.value(d)); };
        var yOpen = function(d) { return ohlc.yScale.value(ohlc.yOpenValue.value(d)); };
        var yHigh = function(d) { return ohlc.yScale.value(ohlc.yHighValue.value(d)); };
        var yLow = function(d) { return ohlc.yScale.value(ohlc.yLowValue.value(d)); };
        var yClose = function(d) { return ohlc.yScale.value(ohlc.yCloseValue.value(d)); };

        var ohlc = function(selection) {
            selection.each(function(data) {
                // data-join in order to create the series container element
                var series = d3.select(this)
                    .selectAll('.ohlc-series')
                    .data([data]);

                series.enter()
                    .append('g')
                    .classed('ohlc-series', true);

                var g = fc.utilities.simpleDataJoin(series, 'ohlc', data, ohlc.xValue.value);

                g.enter()
                    .append('path');

                g.classed({
                        'up': function(d) {
                            return ohlc.yCloseValue.value(d) > ohlc.yOpenValue.value(d);
                        },
                        'down': function(d) {
                            return ohlc.yCloseValue.value(d) < ohlc.yOpenValue.value(d);
                        }
                    });

                var width = ohlc.barWidth.value(data.map(x));
                var halfWidth = width / 2;

                g.select('path')
                    .attr('d', function(d) {
                        var moveToLow = 'M' + x(d) + ',' + yLow(d),
                            verticalToHigh = 'V' + yHigh(d),
                            openTick = 'M' + x(d) + ',' + yOpen(d) + 'h' + (-halfWidth),
                            closeTick = 'M' + x(d) + ',' + yClose(d) + 'h' + halfWidth;
                        return moveToLow + verticalToHigh + openTick + closeTick;
                    });

                ohlc.decorate.value(g);
            });
        };

        ohlc.decorate = fc.utilities.property(fc.utilities.fn.noop);
        ohlc.xScale = fc.utilities.property(d3.time.scale());
        ohlc.yScale = fc.utilities.property(d3.scale.linear());
        ohlc.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));
        ohlc.yOpenValue = fc.utilities.property(function(d) { return d.open; });
        ohlc.yHighValue = fc.utilities.property(function(d) { return d.high; });
        ohlc.yLowValue = fc.utilities.property(function(d) { return d.low; });
        ohlc.yCloseValue = fc.utilities.property(function(d) { return d.close; });
        ohlc.xValue = fc.utilities.property(function(d) { return d.date; });

        return ohlc;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.point = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return point.xScale.value(point.xValue.value(d)); };
        var y = function(d) { return point.yScale.value(point.yValue.value(d)); };

        var point = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .selectAll('.point-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('point-series', true);

                var g = fc.utilities.simpleDataJoin(container, 'point', data, point.xValue.value);

                g.enter()
                    .append('circle');

                g.select('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', point.radius.value);

                point.decorate.value(g);
            });
        };

        point.decorate = fc.utilities.property(fc.utilities.fn.noop);
        point.xScale = fc.utilities.property(d3.time.scale());
        point.yScale = fc.utilities.property(d3.scale.linear());
        point.yValue = fc.utilities.property(function(d) { return d.close; });
        point.xValue = fc.utilities.property(function(d) { return d.date; });
        point.radius = fc.utilities.functorProperty(5);

        return point;
    };
}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.series.stackedBar = function() {

        var stackedBar = function(selection) {
            var container;

            // takes an object with values associated with each property, and
            // converts it into an array of values. Each value has the xValue associated
            // with it.
            //
            // For example, this object:
            //
            // obj = { county: 'North Tyneside', labour: 23, conservative: 55 }
            //
            // becomes this ...
            //
            // [
            //   { xValue: 'North Tyneside', name: 'labour', previousValue: 0, currentValue: 23},
            //   { xValue: 'North Tyneside', name: 'conservative', previousValue: 23, currentValue: 78},
            // ]
            function objectDatapointToArray(obj) {
                var values = [];
                var yTotal = 0;
                var xVal = obj[stackedBar.xValueKey.value];
                for (var propertyName in obj) {
                    if (obj.hasOwnProperty(propertyName) && propertyName !== stackedBar.xValueKey.value) {
                        var previous = yTotal;
                        yTotal += Number(obj[propertyName]);
                        values.push({
                            'name': propertyName,
                            'previousValue': previous,
                            'currentValue': yTotal,
                            'xValue': xVal
                        });
                    }
                }
                return values;
            }

            selection.each(function(data) {

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                container = d3.select(this)
                    .selectAll('.stacked-bar-series')
                    .data([data]);
                container.enter()
                    .append('g')
                    .classed('stacked-bar-series', true);

                var keyFunction = function(d) {
                    return d[stackedBar.xValueKey.value];
                };
                var g = fc.utilities.simpleDataJoin(container, 'stacked-bar', data, keyFunction);


                // create a join for each bar
                var bar = g.selectAll('rect')
                    .data(function(d) { return objectDatapointToArray(d); })
                    .enter()
                    .append('rect');

                // compute the bar width from the x values
                var xValues = data.map(function(d) {
                    return stackedBar.xScale.value(d[stackedBar.xValueKey.value]);
                });
                var width = stackedBar.barWidth.value(xValues);

                // update
                bar.attr('x', function(d) {
                        return stackedBar.xScale.value(d.xValue) - width / 2; }
                    )
                    .attr('y', function(d) {
                        return stackedBar.yScale.value(d.currentValue); }
                    )
                    .attr('width', width)
                    .attr('height', function(d) {
                        return stackedBar.yScale.value(d.previousValue) - stackedBar.yScale.value(d.currentValue);
                    });

                stackedBar.decorate.value(bar);

            });
        };

        stackedBar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        stackedBar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        stackedBar.xScale = fc.utilities.property(d3.time.scale());

        stackedBar.yScale = fc.utilities.property(d3.scale.linear());

        stackedBar.xValueKey = fc.utilities.property('name');

        return stackedBar;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.tools.annotation = function() {

        var annotation = function(selection) {
            selection.each(function(data) {
                var xScaleRange = annotation.xScale.value.range(),
                    y = function(d) { return annotation.yScale.value(annotation.yValue.value(d)); };

                var container = d3.select(this);

                // Create a group for each annotation
                var g = fc.utilities.simpleDataJoin(container, 'annotation', data, annotation.keyValue.value);

                // Added the required elements - each annotation consists of a line and text label
                var enter = g.enter();
                enter.append('line');
                enter.append('text');

                // Update the line
                g.select('line')
                    .attr('x1', xScaleRange[0])
                    .attr('y1', y)
                    .attr('x2', xScaleRange[1])
                    .attr('y2', y);

                // Update the text label
                var paddingValue = annotation.padding.value.apply(this, arguments);
                g.select('text')
                    .attr('x', xScaleRange[1] - paddingValue)
                    .attr('y', function(d) { return y(d) - paddingValue; })
                    .text(annotation.label.value);

                annotation.decorate.value(g);
            });
        };

        annotation.xScale = fc.utilities.property(d3.time.scale());
        annotation.yScale = fc.utilities.property(d3.scale.linear());
        annotation.yValue = fc.utilities.functorProperty(fc.utilities.fn.identity);
        annotation.keyValue = fc.utilities.functorProperty(fc.utilities.fn.index);
        annotation.label = fc.utilities.functorProperty(annotation.yValue.value);
        annotation.padding = fc.utilities.functorProperty(2);
        annotation.decorate = fc.utilities.property(fc.utilities.fn.noop);

        return annotation;
    };

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.tools.crosshairs = function() {

        var event = d3.dispatch('trackingstart', 'trackingmove', 'trackingend');

        var crosshairs = function(selection) {

            selection.each(function() {
                var data = this.__data__ || [];
                if (!data.__crosshairs__) {
                    data.__crosshairs__ = {};
                    this.__data__ = data;
                }
            });

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.crosshairs', mouseenter);

                if (!data.__crosshairs__.overlay) {
                    container.append('rect')
                        .style('visibility', 'hidden');
                    data.__crosshairs__.overlay = true;
                }

                // ordinal axes have a rangeExtent function, this adds any padding that
                // was applied to the range. This functions returns the rangeExtent
                // if present, or range otherwise
                function rangeForScale(scaleProperty) {
                    return scaleProperty.value.rangeExtent ?
                        scaleProperty.value.rangeExtent() : scaleProperty.value.range();
                }

                function rangeStart(scaleProperty) {
                    return rangeForScale(scaleProperty)[0];
                }

                function rangeEnd(scaleProperty) {
                    return rangeForScale(scaleProperty)[1];
                }

                container.select('rect')
                    .attr('x', rangeStart(crosshairs.xScale))
                    .attr('y', rangeEnd(crosshairs.yScale))
                    .attr('width', rangeEnd(crosshairs.xScale))
                    .attr('height', rangeStart(crosshairs.yScale));

                var g = fc.utilities.simpleDataJoin(container, 'crosshairs', data);

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'horizontal');
                enter.append('line')
                    .attr('class', 'vertical');
                enter.append('text')
                    .attr('class', 'horizontal');
                enter.append('text')
                    .attr('class', 'vertical');

                g.select('line.horizontal')
                    .attr('x1', rangeStart(crosshairs.xScale))
                    .attr('x2', rangeEnd(crosshairs.xScale))
                    .attr('y1', function(d) { return d.y; })
                    .attr('y2', function(d) { return d.y; });

                g.select('line.vertical')
                    .attr('y1', rangeStart(crosshairs.yScale))
                    .attr('y2', rangeEnd(crosshairs.yScale))
                    .attr('x1', function(d) { return d.x; })
                    .attr('x2', function(d) { return d.x; });

                var paddingValue = crosshairs.padding.value.apply(this, arguments);

                g.select('text.horizontal')
                    .attr('x', rangeEnd(crosshairs.xScale) - paddingValue)
                    .attr('y', function(d) {
                        return d.y - paddingValue;
                    })
                    .text(crosshairs.yLabel.value);

                g.select('text.vertical')
                    .attr('x', function(d) {
                        return d.x - paddingValue;
                    })
                    .attr('y', paddingValue)
                    .text(crosshairs.xLabel.value);

                crosshairs.decorate.value(g);
            });
        };

        function mouseenter() {
            var mouse = d3.mouse(this);
            var container = d3.select(this)
                .on('mousemove.crosshairs', mousemove)
                .on('mouseleave.crosshairs', mouseleave);
            var snapped = crosshairs.snap.value.apply(this, mouse);
            var data = container.datum();
            data.push(snapped);
            container.call(crosshairs);
            event.trackingstart.apply(this, arguments);
        }

        function mousemove() {
            var mouse = d3.mouse(this);
            var container = d3.select(this);
            var snapped = crosshairs.snap.value.apply(this, mouse);
            var data = container.datum();
            data[data.length - 1] = snapped;
            container.call(crosshairs);
            event.trackingmove.apply(this, arguments);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            data.pop();
            container.call(crosshairs)
                .on('mousemove.crosshairs', null)
                .on('mouseleave.crosshairs', null);
            event.trackingend.apply(this, arguments);
        }

        crosshairs.xScale = fc.utilities.property(d3.time.scale());
        crosshairs.yScale = fc.utilities.property(d3.scale.linear());
        crosshairs.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        crosshairs.decorate = fc.utilities.property(fc.utilities.fn.noop);
        crosshairs.xLabel = fc.utilities.functorProperty('');
        crosshairs.yLabel = fc.utilities.functorProperty('');
        crosshairs.padding = fc.utilities.functorProperty(2);

        d3.rebind(crosshairs, event, 'on');

        return crosshairs;
    };

}(d3, fc));

(function(d3, fc) {
    'use strict';

    fc.tools.fibonacciFan = function() {

        var event = d3.dispatch('fansource', 'fantarget', 'fanclear');

        var fan = function(selection) {

            selection.each(function() {
                var data = this.__data__ || [];
                if (!data.__fan__) {
                    data.__fan__ = {};
                    this.__data__ = data;
                }
            });

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.fan', mouseenter);

                if (!data.__fan__.overlay) {
                    container.append('rect')
                        .style('visibility', 'hidden');
                    data.__fan__.overlay = true;
                }

                container.select('rect')
                    .attr('x', fan.xScale.value.range()[0])
                    .attr('y', fan.yScale.value.range()[1])
                    .attr('width', fan.xScale.value.range()[1])
                    .attr('height', fan.yScale.value.range()[0]);

                var g = fc.utilities.simpleDataJoin(container, 'fan', data);

                g.each(function(d) {
                    d.x = fan.xScale.value.range()[1];
                    d.ay = d.by = d.cy = d.target.y;

                    if (d.source.x !== d.target.x) {

                        if (d.state === 'DONE' && d.source.x > d.target.x) {
                            var temp = d.source;
                            d.source = d.target;
                            d.target = temp;
                        }

                        var gradient = (d.target.y - d.source.y) /
                            (d.target.x - d.source.x);
                        var deltaX = d.x - d.source.x;
                        var deltaY = gradient * deltaX;
                        d.ay = 0.618 * deltaY + d.source.y;
                        d.by = 0.500 * deltaY + d.source.y;
                        d.cy = 0.382 * deltaY + d.source.y;
                    }
                });

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'trend');
                enter.append('line')
                    .attr('class', 'a');
                enter.append('line')
                    .attr('class', 'b');
                enter.append('line')
                    .attr('class', 'c');
                enter.append('polygon')
                    .attr('class', 'area');

                g.select('line.trend')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                g.select('line.a')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.ay; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('line.b')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.by; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('line.c')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.x; })
                    .attr('y2', function(d) { return d.cy; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('polygon.area')
                    .attr('points', function(d) {
                        return d.source.x + ',' + d.source.y + ' ' +
                            d.x + ',' + d.ay + ' ' +
                            d.x + ',' + d.cy;
                    })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                fan.decorate.value(g);
            });
        };

        function updatePositions() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            if (datum.state !== 'DONE') {
                var mouse = d3.mouse(this);
                var snapped = fan.snap.value.apply(this, mouse);
                if (datum.state === 'SELECT_SOURCE') {
                    datum.source = datum.target = snapped;
                } else if (datum.state === 'SELECT_TARGET') {
                    datum.target = snapped;
                } else {
                    throw new Error('Unknown state ' + datum.state);
                }
            }
        }

        function mouseenter() {
            var container = d3.select(this)
                .on('click.fan', mouseclick)
                .on('mousemove.fan', mousemove)
                .on('mouseleave.fan', mouseleave);
            var data = container.datum();
            if (data[0] == null) {
                data.push({
                    state: 'SELECT_SOURCE'
                });
            }
            updatePositions.call(this);
            container.call(fan);
        }

        function mousemove() {
            var container = d3.select(this);
            updatePositions.call(this);
            container.call(fan);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            if (data[0] != null && data[0].state === 'SELECT_SOURCE') {
                data.pop();
            }
            container.on('click.fan', null)
                .on('mousemove.fan', null)
                .on('mouseleave.fan', null);
        }

        function mouseclick() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            switch (datum.state) {
                case 'SELECT_SOURCE':
                    updatePositions.call(this);
                    event.fansource.apply(this, arguments);
                    datum.state = 'SELECT_TARGET';
                    break;
                case 'SELECT_TARGET':
                    updatePositions.call(this);
                    event.fantarget.apply(this, arguments);
                    datum.state = 'DONE';
                    break;
                case 'DONE':
                    event.fanclear.apply(this, arguments);
                    datum.state = 'SELECT_SOURCE';
                    updatePositions.call(this);
                    break;
                default:
                    throw new Error('Unknown state ' + datum.state);
            }
            container.call(fan);
        }

        fan.xScale = fc.utilities.property(d3.time.scale());
        fan.yScale = fc.utilities.property(d3.scale.linear());
        fan.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        fan.decorate = fc.utilities.property(fc.utilities.fn.noop);

        d3.rebind(fan, event, 'on');

        return fan;
    };

}(d3, fc));
(function(d3, fc) {
    'use strict';

    fc.tools.measure = function() {

        var event = d3.dispatch('measuresource', 'measuretarget', 'measureclear');

        var measure = function(selection) {

            selection.each(function() {
                var data = this.__data__ || [];
                if (!data.__measure__) {
                    data.__measure__ = {};
                    this.__data__ = data;
                }
            });

            selection.each(function(data) {

                var container = d3.select(this)
                    .style('pointer-events', 'all')
                    .on('mouseenter.measure', mouseenter);

                if (!data.__measure__.overlay) {
                    container.append('rect')
                        .style('visibility', 'hidden');
                    data.__measure__.overlay = true;
                }

                container.select('rect')
                    .attr('x', measure.xScale.value.range()[0])
                    .attr('y', measure.yScale.value.range()[1])
                    .attr('width', measure.xScale.value.range()[1])
                    .attr('height', measure.yScale.value.range()[0]);

                var g = fc.utilities.simpleDataJoin(container, 'measure', data);

                var enter = g.enter();
                enter.append('line')
                    .attr('class', 'tangent');
                enter.append('line')
                    .attr('class', 'horizontal');
                enter.append('line')
                    .attr('class', 'vertical');
                enter.append('text')
                    .attr('class', 'horizontal');
                enter.append('text')
                    .attr('class', 'vertical');

                g.select('line.tangent')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                g.select('line.horizontal')
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.source.y; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                g.select('line.vertical')
                    .attr('x1', function(d) { return d.target.x; })
                    .attr('y1', function(d) { return d.target.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.source.y; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

                var paddingValue = measure.padding.value.apply(this, arguments);

                g.select('text.horizontal')
                    .attr('x', function(d) { return d.source.x + (d.target.x - d.source.x) / 2; })
                    .attr('y', function(d) { return d.source.y - paddingValue; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; })
                    .text(measure.xLabel.value);

                g.select('text.vertical')
                    .attr('x', function(d) { return d.target.x + paddingValue; })
                    .attr('y', function(d) { return d.source.y + (d.target.y - d.source.y) / 2; })
                    .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; })
                    .text(measure.yLabel.value);

                measure.decorate.value(g);
            });
        };

        function updatePositions() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            if (datum.state !== 'DONE') {
                var mouse = d3.mouse(this);
                var snapped = measure.snap.value.apply(this, mouse);
                if (datum.state === 'SELECT_SOURCE') {
                    datum.source = datum.target = snapped;
                } else if (datum.state === 'SELECT_TARGET') {
                    datum.target = snapped;
                } else {
                    throw new Error('Unknown state ' + datum.state);
                }
            }
        }

        function mouseenter() {
            var container = d3.select(this)
                .on('click.measure', mouseclick)
                .on('mousemove.measure', mousemove)
                .on('mouseleave.measure', mouseleave);
            var data = container.datum();
            if (data[0] == null) {
                data.push({
                    state: 'SELECT_SOURCE'
                });
            }
            updatePositions.call(this);
            container.call(measure);
        }

        function mousemove() {
            var container = d3.select(this);
            updatePositions.call(this);
            container.call(measure);
        }

        function mouseleave() {
            var container = d3.select(this);
            var data = container.datum();
            if (data[0] != null && data[0].state === 'SELECT_SOURCE') {
                data.pop();
            }
            container.on('click.measure', null)
                .on('mousemove.measure', null)
                .on('mouseleave.measure', null);
        }

        function mouseclick() {
            var container = d3.select(this);
            var datum = container.datum()[0];
            switch (datum.state) {
                case 'SELECT_SOURCE':
                    updatePositions.call(this);
                    event.measuresource.apply(this, arguments);
                    datum.state = 'SELECT_TARGET';
                    break;
                case 'SELECT_TARGET':
                    updatePositions.call(this);
                    event.measuretarget.apply(this, arguments);
                    datum.state = 'DONE';
                    break;
                case 'DONE':
                    event.measureclear.apply(this, arguments);
                    datum.state = 'SELECT_SOURCE';
                    updatePositions.call(this);
                    break;
                default:
                    throw new Error('Unknown state ' + datum.state);
            }
            container.call(measure);
        }

        measure.xScale = fc.utilities.property(d3.time.scale());
        measure.yScale = fc.utilities.property(d3.scale.linear());
        measure.snap = fc.utilities.property(function(x, y) { return {x: x, y: y}; });
        measure.decorate = fc.utilities.property(fc.utilities.fn.noop);
        measure.xLabel = fc.utilities.functorProperty('');
        measure.yLabel = fc.utilities.functorProperty('');
        measure.padding = fc.utilities.functorProperty(2);

        d3.rebind(measure, event, 'on');

        return measure;
    };

}(d3, fc));