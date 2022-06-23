///////////////////////////////////////////////////////////////////////////////////////////////
// The indicator chart

var fromDate = new Date(2014, 1, 1),
    toDate = new Date(2014, 3, 1);

// Mock data generation (mu, sigma, startingPrice, intraDaySteps, filter)
var data = sl.utilities.dataGenerator()
    .fromDate(fromDate)
    .toDate(toDate)
    .generate();

// Setup the chartLayout
var chartLayout = sl.utilities.chartLayout()
    .height(200)
    .marginBottom(20)
    .marginLeft(0)
    .marginRight(30);

// The overall chart
var setupArea = d3.select('#rsi_indicator_chart')
    .call(chartLayout);

// Select the elements which we'll want to add other elements to
var svg = setupArea.select('svg'),
    chart = svg.select('g'),
    plotArea = chart.select('.plotArea');

var dateScale = sl.scale.finance()
    .domain([fromDate, toDate])
    .range([0, chartLayout.innerWidth()]);

var percentageScale = d3.scale.linear()
    .domain([0, 100])
    .nice()
    .range([chartLayout.innerHeight(), 0]);

// Create the axes
var dateAxis = d3.svg.axis()
    .scale(dateScale)
    .orient('bottom')
    .ticks(5);

var percentageAxis = d3.svg.axis()
    .scale(percentageScale)
    .orient('right')
    .ticks(5);

// Add the axes to the chart
chart.append('g')
    .attr('class', 'axis date')
    .attr('transform', 'translate(0,' + chartLayout.innerHeight() + ')')
    .call(dateAxis);

chart.append('g')
    .attr('class', 'axis percentage')
    .attr('transform', 'translate(' + chartLayout.innerWidth() + ',0)')
    .call(percentageAxis);

// Create RSI
var rsi = sl.indicators.rsi()
    .xScale(dateScale)
    .yScale(percentageScale)
    .lambda(0.94)
    .upperMarker(70)
    .lowerMarker(30)
    .samplePeriods(14);

plotArea.append('g')
    .attr('class', 'rsiIndicator')
    .attr('id', 'rsi')
    .datum(data)
    .call(rsi);
