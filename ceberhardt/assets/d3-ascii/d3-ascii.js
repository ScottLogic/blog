function AsciiCanvas(width, height) {

  var buffer = Array.apply(null, Array(width * height)).map(String.prototype.valueOf, ' ');
  var self = this;

  this.render = function() {
    var stringBuffer = '';
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        stringBuffer += buffer[x + y * width];
      }
      stringBuffer += '\n';
    }
    return stringBuffer;
  }

  this.setPixel = function(x, y, char) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x > width - 1 ||
      y < 0 || y > height - 1) {
      return;
    }
    buffer[x + y * width] = char;
  }

  this.renderSvg = function(svg) {
    var paths = svg.selectAll('.bar path');
    paths.each(function() {
      var rect = new Rectangle(this);
      rect.render(self);
    });

    var labels = svg.selectAll('text');
    labels.each(function() {
      var label = new Text(this);
      label.render(self);
    });
  }
}

// obtains the boudns of an SVG element
function getBounds(svgElement) {
  var bbox = svgElement.getBBox();
  var transform = svgElement.getCTM();

  return {
    left: bbox.x + transform.e,
    right: bbox.x + bbox.width + transform.e,
    top: bbox.y + transform.f,
    bottom: bbox.y + bbox.height + transform.f
  };
}

// a text primtive that can be rendered to an AsciiCanvas
function Text(svgText) {

  var bounds = getBounds(svgText);
  var text = svgText.textContent;

  this.render = function(asciiCanvas) {
    var x = bounds.left + ((bounds.right - bounds.left) / 2) - (text.length / 2),
      y = bounds.top;
    for (var i = 0; i < text.length; i++) {
      asciiCanvas.setPixel(x, y, text[i]);
      x++;
    }
  }
}

// a rectangle primtive that can be rendered to an AsciiCanvas
function Rectangle(svgRect) {
  var bounds = getBounds(svgRect);
  var fill = svgRect.getAttribute('ascii-fill') || '#';
  this.render = function(asciiCanvas) {
    for (var i = bounds.left; i < bounds.right - 1; i++) {
      for (var j = bounds.top; j < bounds.bottom - 1; j++) {
        asciiCanvas.setPixel(i, j, fill);
      }
    }
  }
}

(function() {

  var data = [
    {year: '2014', shipments: 34000000},
    {year: '2015', shipments: 49000000},
    {year: '2016', shipments: 53000000},
    {year: '2017', shipments: 55000000},
    {year: '2018', shipments: 57500000},
    {year: '2019', shipments: 57700000}
  ];

  var width = 80, height = 20;
  d3.select('#ascii-dom').style({
    width: width + 'px',
    height: height + 'px'
  });

  function d3Render() {

    var container = d3.select('#ascii-dom');

    var bar = fc.series.bar()
        .xValue(function(d) { return d.year; })
        .yValue(function(d) { return d.shipments; })
        .decorate(function(sel) {
          sel.enter().select('path')
            .attr('ascii-fill', function(d, i) { return d.year === '2015' ? '#' : '=';});
        });

    var chart = fc.chart.cartesian(
          d3.scale.ordinal(),
          d3.scale.linear())
      .xDomain(data.map(function(d) { return d.year; }))
      .yDomain(fc.util.extent().include(0).fields('shipments')(data))
      .margin({bottom: 2, right: 5})
      .xTickSize(0)
      .xTickPadding(1)
      .yTickSize(0)
      .yTicks(5)
      .yTickPadding(1)
      .yTickFormat(d3.format('s'))
      .yNice()
      .plotArea(bar);

    container
        .datum(data)
        .call(chart);
  }

  function svgToAscii() {
    var canvas = new AsciiCanvas(width, height);
    canvas.renderSvg(d3.select('#ascii-dom'));
    var ascii = canvas.render();
    d3.select('#ascii-output').text(ascii);
  }

  d3Render();
  svgToAscii();
})();

(function(){
  // generate some random data
  var data = d3.range(15).map(Math.random);

  var colors = '£$%@£^&!';

  var width = 80, height = 20;
  d3.select('#ascii-dom-2').style({
    width: width + 'px',
    height: height + 'px'
  });


  // render a bar series via the cartesian chart component
  var barSeries = fc.series.bar()
      .key(fc.util.fn.identity)
      .xValue(fc.util.fn.index)
      .yValue(fc.util.fn.identity)
      .decorate(function(sel) {
        sel.enter().select('path')
          .attr('ascii-fill', function(d, i) {
            return colors[i % colors.length];
          });
      })

  var chart = fc.chart.cartesian(
                d3.scale.linear(),
                d3.scale.linear())
      .xDomain([-1, data.length])
      .yDomain([0, 1])
      .margin(0)
      .xTickPadding(1)
      .xTickSize(0)
      .plotArea(barSeries);

  var index = 0;
  function render() {
    if (index === data.length) {
      index = 0;
      data = d3.range(15).map(Math.random);
    }

    // perform a single iteration of the bubble sort
    var temp;
    for (var j = index; j > 0; j--) {
      if (data[j] < data[j - 1]) {
        temp = data[j];
        data[j] = data[j - 1];
        data[j - 1] = temp;
      }
    }
    index++;

    // re-render the chart
    d3.select('#ascii-dom-2')
        .datum(data)
        .transition()
        .duration(300)
        .call(chart);
  }

  setInterval(render, 500);
  render();

  function svgToAscii() {
    var canvas = new AsciiCanvas(width, height);
    canvas.renderSvg(d3.select('#ascii-dom-2'));
    var ascii = canvas.render();
    d3.select('#ascii-output-2').text(ascii);
    requestAnimationFrame(svgToAscii);
  }

  svgToAscii();

})();
