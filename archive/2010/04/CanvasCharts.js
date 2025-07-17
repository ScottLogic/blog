(function ($) {
	charts = [];
	var chartdata = [
	{name: "Index Summary", series: [{id: "ftse100", name: "FTSE 100", url: "/blog/archive/2010/04/ftse100.xml", colour: "#895B18", onPositionChange: setTableValues},
		{id: "ftse250", name: "FTSE 250", url: "/blog/archive/2010/04/ftse250.xml", colour: "#265E89", onPositionChange: setTableValues},
		{id: "ftseall", name: "FTSE ALL-SHARE", url: "/blog/archive/2010/04/ftseall.xml", colour: "#669900", onPositionChange: setTableValues}]},
	{name: "Aviva", series: [{id: "av", name: "Aviva", url: "/blog/archive/2010/04/av.xml", colour: "#265E89"}]},
	{name: "HBOS", series: [{id: "hbos", name: "HBOS", url: "/blog/archive/2010/04/hbos.xml", colour: "#895B18"}]},
	{name: "Old Mutual", series: [{id: "oml", name: "Old Mutual", url: "/blog/archive/2010/04/oml.xml", colour: "#265E89"}]},
	{name: "Legal & General", series: [{id: "lgen", name: "Legal & General", url: "/blog/archive/2010/04/lgen.xml", colour: "#669900"}]},
	{name: "Lloyds TSB", series: [{id: "lloy", name: "Lloyds TSB", url: "/blog/archive/2010/04/lloy.xml", colour: "#895B18"}]},
	{name: "Barclays", series: [{id: "barc", name: "Barclays", url: "/blog/archive/2010/04/barc.xml", colour: "#265E89"}]},
	{name: "HSBC", series: [{id: "hsba", name: "HSBC", url: "/blog/archive/2010/04/hsba.xml", colour: "#669900"}]},
	{name: "Prudential", series: [{id: "pru", name: "PRU", url: "/blog/archive/2010/04/pru.xml", colour: "#265E89"}]}
	];
	$(function() {
		var startDate = new Date();
		startDate.setDate(1);
		startDate.setMonth(9);
		startDate.setFullYear(2008);
		startDate.setDate(13);
		for(var i = 0; i < chartdata.length; ++i) {
			var curdata = chartdata[i];
			$('#name' + i).text(curdata.name);
			var canvas = $('#cv' + i)[0];
			var chart = new ChartManager(canvas, {startDate: startDate});
			curdata.chart = chart;
			charts.push(chart);
			curdata.loaded = 0;
			for(var j = 0; j < curdata.series.length; ++j) {
				var s = curdata.series[j];
				s.databean = curdata;
				s.intraday = true;
				s.days = 1;
				loadFeed(s.url, s, loadCallback);
			}
		}
	});
	function loadCallback(series) {
		var databean = series.databean;
		if (++databean.loaded == databean.series.length) {
			var series = databean.series;
			var chart = databean.chart;
			for(var i = 0; i < series.length; ++i) { 
				chart.addSeries(series[i]);
			}
		}
	};
	/**
	 * Load a feed and display it on the chart. 
	 * Sets obj.data to the array of points ({d: Date, v: value} tuples)
	 * and passes this as the first argument to the callback function
	 */
	function loadFeed(url, obj, callback) {
		var req = $.ajax({
			url: url, 
			dataType: ($.browser.msie) ? "text" : "xml",
			success: function(data) {
				var xml;
				if (typeof data == "string") {
					xml = new ActiveXObject("Microsoft.XMLDOM");
					xml.async = false;
					xml.loadXML(data);
				} else {
					xml = data;
				}
				var points = [];
				var i = 0;
				$("data", xml).each(function() {			
					if (i++ % 5 == 0) {
						var data = $(this);
						var dateStr = data.find("date").text().slice(0, 10).split("/");
						var timeStr = data.find("date").text().slice(11, 9999).split(":");
						var point = {
							'd': new Date(dateStr[2],
										dateStr[1] - 1, dateStr[0], timeStr[0],
										timeStr[1], 0, 0),
							'v': parseFloat(data.find("value").text())
						};
						points.push(point);
					}
				});
				obj.data = points;
				callback(obj);
			}
		});
	};
	/**
	 * Set the values of a table row according to the cursor's position. 
	 * Used for the first chart
	 */
	function setTableValues(series, position, chartdata) {
		if(!position)
			return;
		$("#val" + series.id).text(formatNumber(position[3].v.toFixed(2)));
		var change = position[3].v - chartdata[0][3].v;
		var changepc = ((position[3].v - chartdata[0][3].v) / chartdata[0][3].v) * 100;
		$("#pc" + series.id).text(change.toFixed(1) + " (" + changepc.toFixed(2) + "%)");
		if (change > 0) {
			$("#pc" + series.id).removeClass("nochange");
			$("#pc" + series.id).removeClass("loss");
			$("#pc" + series.id).addClass("gain");
		} else if (change < 0) {
			$("#pc" + series.id).removeClass("gain");
			$("#pc" + series.id).removeClass("nochange");
			$("#pc" + series.id).addClass("loss");
		} else {
			$("#pc" + series.id).removeClass("gain");
			$("#pc" + series.id).removeClass("loss");
			$("#pc" + series.id).addClass("nochange");
		}
	}
	function object(o) {
		function F() {}
		F.prototype = o;
		return new F();
	}
	function Chart() {
		var obj = object();
		var dirty = false;  
		obj.x = {
			'min' : -100,
			'max' : 100
		};
		obj.y = {
			'min' : -100,
			'max' : 100
		}
		obj.dirty =  function() {
			dirty = true;
		};
		obj.requiresPaint = function() {
			var requiresPaint = dirty;
			dirty = false;
			return requiresPaint;
		}
		obj.paint = function(ctx) {
			// Nothing to paint
		};
		return obj;
	}
	function Event() {
		var obj = object();
		var observers = [];
		obj.observe = function(cb) {
			observers.push(cb);
		};
		obj.trigger = function() {
			for (var i = 0; i < observers.length; i++) {
				observers[i].apply(arguments[0], Array.prototype.slice.call(arguments, 1));
			}
		};
		return obj;
	}
	function Axes(parent, color, width) {
		var obj = object(parent);
		obj.axes = {
			'color' : color || '#D0D0DD',
			'width' : width || 2
		};
		obj.paint = function(ctx) {
			var xMin = obj.x.min, xMax = obj.x.max, yMin = obj.y.min, yMax = obj.y.max;
			parent.paint(ctx);
			ctx.save();
			ctx.ctx.lineWidth = obj.axes.width;
			ctx.ctx.strokeStyle = obj.axes.color;
			ctx.beginPath();
			ctx.moveTo((0 > xMin ? 0 : xMin), yMin);
			ctx.lineTo((0 > xMin ? 0 : xMin), yMax);
			ctx.moveTo(xMin, (0 > yMin ? 0 : yMin));
			ctx.lineTo(xMax, (0 > yMin ? 0 : yMin));
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		};
		return obj;
	}
	function AxisTicks(parent, xspacing, color, yspacing) {
		var obj = object(parent);
		obj.axisTicks = {
			'xspacing' : xspacing || 21,
			'xstart' : 11,
			'xinc' : 2,
			'xtype' : 'time',
			// TODO this hard-coded value is useless for anything larger
			// than the range of -8% to 8%. Would it be better to force the
			// client to pass the range in, or determine it from the data?
			'yspacing' : yspacing || xspacing || 0.85,
			'color' : color || '#000000',
			'width' : 1
		}
		obj.paint = function(ctx) {
			var xMin = obj.x.min, xMax = obj.x.max, yMin = obj.y.min, yMax = obj.y.max;
			var x, y; // loop indexes
			var xspacing = obj.axisTicks.xspacing; // Prevent value change half way through execution
			var yspacing = obj.axisTicks.yspacing;
			var labelWidth = 11;
			parent.paint(ctx);
			ctx.save();
			ctx.relativeOffset(-12,3);
			ctx.font.textAlign = 'center';
			ctx.font.fontSize = '10px';
			// Start from 0 backwards then forwards so that the lines make sense
			/*for (x = ((-1 * xspacing) < xMax ? (-1 * xspacing) : xMax); x >= xMin; x = x - xspacing) {
				ctx.strokeText(x.toFixed(1), x, 0, false, labelWidth);
			}
			for (x = (xspacing > xMin ? xspacing : xMin); x <= xMax; x = x + xspacing) {
				ctx.strokeText(x.toFixed(1), x, 0, false, labelWidth);
			}*/
			if (obj.axisTicks.xtype == 'time') {
				var time = obj.axisTicks.xstart;
				var inc = obj.axisTicks.xinc;
				for (x = (xspacing > xMin ? xspacing : xMin); x <= xMax; x = x + xspacing) {
					ctx.strokeText(time + ":00", x, 0, false, labelWidth);
					time += inc;
				}
			}
			ctx.relativeOffset(-16,-8);
			ctx.font.textAlign = 'right';
			for (y = ((-1 * yspacing) < yMax ? (-1 * yspacing) : yMax); y >= yMin; y = y - yspacing) {
				ctx.strokeText(y.toFixed(1) + "%", 0, y, false, labelWidth);
			}
			for (y = (0 > yMin ? 0 : yMin); y <= yMax; y = y + yspacing) {
				ctx.strokeText(y.toFixed(1) + "%", 0, y, false, labelWidth);
			}
			ctx.restore();
		};
		return obj;
	}
	function GridLines(parent, xspacing, color, yspacing) {
		var obj = object(parent);
		obj.gridLines = {
			'xspacing' : xspacing || 21,
			'yspacing' : yspacing || xspacing || 0.5,
			'color' : color || '#EEEEEE'
		};
		obj.paint = function(ctx) {
			var xMin = obj.x.min, xMax = obj.x.max, yMin = obj.y.min, yMax = obj.y.max;
			var x, y; // loop indexes
			var xspacing = obj.gridLines.xspacing; // Prevent value change half way through execution
			var yspacing = obj.gridLines.yspacing;
			parent.paint(ctx);
			ctx.save();
			ctx.ctx.strokeStyle = obj.gridLines.color;
			ctx.beginPath();
			// Start from 0 backwards then forwards so that the lines make sense
			for (x = (0 < xMax ? 0 : xMax); x >= xMin; x = x - xspacing) {
				ctx.moveTo(x, yMin);
				ctx.lineTo(x, yMax);
			}
			for (x = (0 > xMin ? 0 : xMin); x <= xMax; x = x + xspacing) {
				ctx.moveTo(x, yMin);
				ctx.lineTo(x, yMax);
			}
			for (y = (0 < yMax ? 0 : yMax); y >= yMin; y = y - yspacing) {
				ctx.moveTo(xMin, y);
				ctx.lineTo(xMax, y);
			}
			for (y = (0 > yMin ? 0 : yMin); y <= yMax; y = y + yspacing) {
				ctx.moveTo(xMin, y);
				ctx.lineTo(xMax, y);
			}
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		};
		return obj;
	}
	function Curves(parent, curves) {
		var obj = object(parent);
		obj.curves = curves;
		obj.params = {
			'activeCurve': -1,
			'activeOnly': false
		}
		obj.paint = function(ctx) {
			var i, curves = obj.curves;
			var currentX = obj.x.current;
			parent.paint(ctx);
			// draw non-active curves first, so the active one ends up on top
			if (!(obj.params.activeOnly && obj.params.activeCurve >= 0)) {
				for (i = 0; i < obj.curves.length; i++) {
					if (i != obj.params.activeCurve) {
					obj.curves[i].paint(ctx, currentX);
					}
				}
			}
			if (obj.params.activeCurve >= 0) {
				obj.curves[obj.params.activeCurve].paint(ctx, currentX);
			}
		};
		obj.updatePositions = function(position) {
			for (i = 0; i < obj.curves.length; i++) {
				if (obj.curves[i].updatePosition(position)) {
					obj.dirty();
				}
			}
		};
		return obj;
	}
	function CurveLine(data, color) {
		var obj = object();
		obj.curve = {
			'data' : data || [],
			'color' : color || '#990000',
			'highlight' : false,
			'firstdraw' : false
		};
		/* Trace line function */
		obj.traceLine = function(ctx, step) {
			if (step == undefined) {
				step = 0;
			}
			var data = obj.curve.data;
			if (step < data.length) {
				ctx.save();
				ctx.beginPath();
				if (step == 0) {
					ctx.moveTo(data[0][0], data[0][1]);
				} else if (step > 0) {
					ctx.ctx.shadowBlur = 2;
					ctx.ctx.shadowColor = '#BBBBBB';
					ctx.ctx.shadowOffsetX = 2;
					ctx.ctx.shadowOffsetY = 2;
					ctx.ctx.strokeStyle = obj.curve.color;
					var point = data[step];
					var prevpoint = data[step - 1];
					if (point[0] > 0) {
						if (prevpoint[0] > 0) {
							ctx.moveTo(prevpoint[0], prevpoint[1]);
						} else {
							ctx.moveTo(0, prevpoint[1]);
						}
						ctx.lineTo(point[0], point[1]);
					}
					ctx.stroke();
					ctx.closePath();
				}
				ctx.restore();
				traceLine = obj.traceLine;
				traceLineCtx = ctx;
				window.setTimeout("traceLine(traceLineCtx, " + (step + 1) + ")", 10);
			}
		};
		obj.paint = function(ctx, currentX) {
			if (obj.curve.firstdraw) {
				obj.curve.firstdraw = false;
				obj.traceLine(ctx, 0);
				return;
			}
			var data = obj.curve.data; // Prevent value change half way through execution
			var point;
			ctx.save();
			ctx.beginPath();
			if (data.length) {
				ctx.moveTo(data[0][0], data[0][1]);
			}
			for (var i = 0; i < data.length; i++) {
				point = data[i];
				if (point[0] < 0) {
					ctx.moveTo(0, point[1]); //don't draw anything before x = 0
				} else {
					ctx.lineTo(point[0], point[1]);
				}
			}
			if (obj.curve.highlight) {
				ctx.ctx.lineWidth = 2.5;
				ctx.ctx.lineCap = "round";
				ctx.ctx.lineJoin = "round";
				ctx.ctx.shadowBlur = 5;
				ctx.ctx.shadowColor = obj.curve.color;
				ctx.ctx.shadowOffsetX = 1;
				ctx.ctx.shadowOffsetY = 1;
			} else {
				ctx.ctx.lineWidth = 1;
				ctx.ctx.shadowBlur = 2;
				ctx.ctx.shadowColor = '#BBBBBB';
				ctx.ctx.shadowOffsetX = 2;
				ctx.ctx.shadowOffsetY = 2;
			}
			ctx.ctx.strokeStyle = obj.curve.color;
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		};
		return obj;
	}
	function CurveDot(parent) {
		var obj = object(parent);
		obj.dot = {
			'position' : obj.curve.data[obj.curve.data.length - 1],
			'positionChange' : Event(),
			'visible' : false
		};
		obj.updatePosition = function(position) {
			var dataPoint, newPosition = obj.dot.position, data = obj.curve.data;
			// TODO this could be improved by at least doing a binary search
			for (var i = 0; i < data.length; i++) {
				dataPoint = data[i];
				if ( (!position || (Math.abs(newPosition[0] - position[0]) > Math.abs(dataPoint[0] - position[0]))) && position[0] >= 0) {
					newPosition = dataPoint;
				}
			}
			if (newPosition != obj.dot.position) {
				obj.dot.position = newPosition;
				obj.dot.positionChange.trigger(this, newPosition);
				return true;
			} else {
				return false;
			}
		};
		obj.paint = function(ctx) {
			var point = obj.dot.position;
			parent.paint(ctx);
			if (obj.dot.visible) {
				if (point) {
					ctx.save();
					if (obj.curve.highlight) {
						ctx.ctx.shadowBlur = 5;
						ctx.ctx.shadowColor = obj.curve.color;
						ctx.ctx.shadowOffsetX = 1;
						ctx.ctx.shadowOffsetY = 1;
					} else {
						ctx.ctx.shadowBlur = 5;
						ctx.ctx.shadowColor = '#BBBBBB';
						ctx.ctx.shadowOffsetX = 2;
						ctx.ctx.shadowOffsetY = 2;
					}
					ctx.ctx.fillStyle = obj.curve.color;
					ctx.beginPath();
					ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI, false);
					ctx.fill();
					ctx.closePath();
					ctx.restore();
				}
			}
		};
		return obj;
	}
	function CurveBubble(parent, visible) {
		var obj = object(parent);
		obj.bubble = {
			'visible': visible || true
		};
		obj.paint = function(ctx) {
			var point = obj.dot.position;
			parent.paint(ctx);
			if (point) {
				ctx.save();
				ctx.font.fontSize = '10px';
				ctx.font.color = obj.curve.color;
				if (visible) {
					ctx.strokeText(point[2], point[0], point[1], 200, true);
				}
				ctx.restore();
			}
		};
		return obj;
	}
	function EnhancedContext(canvas) {
		var obj = object();
		obj.canvas = canvas;
		obj.ctx = canvas.getContext('2d');
		// Create pass through function calls for all methods
		for (var methodName in obj.ctx) {
			if (typeof(obj.ctx[methodName]) == 'function') {
				obj[methodName] = (function(methodName) {
					return function() {
						obj.ctx[methodName].apply(obj.ctx, arguments);
					}
				})(methodName);
			}
		}
		obj.clear = function() {
			obj.ctx.clearRect(0, 0, obj.canvas.clientWidth, obj.canvas.clientHeight);
		};
		var width = Number(obj.canvas.clientWidth);
		obj.width = function() {
			return width;
		}  
		var height = Number(obj.canvas.clientHeight);
		obj.height = function() {
			return height;
		}
		return obj;
	}
	// Turn positive y into upward movement
	// Scale and position  
	// ARCS/CURVES not implemented
	// All methods supply data co-ordinates which are then converted into screen co-ordinates
	function ChartingContext(parent) {
		var obj = object(parent);
		// Translation is applied first
		var translationX = 0, translationY = 0;
		// Then scale
		var scaleX = 1, scaleY = 1;
		obj.charting = {
			offsetX : parent.width() * 0.14,
			offsetY : parent.height() * 0.08
		};
		function scale(x, y, width, height) {
			x = ( x - translationX ) * scaleX + obj.charting.offsetX;
			y = ( y * -1 + translationY) * scaleY * -1  + obj.charting.offsetY;
			width = width * scaleX;
			height = height * scaleY;
			return [x, y, width, height];
		}
		obj.canvasToCharting = function(x, y) {
			x = ( x - obj.charting.offsetX ) / scaleX + translationX;
			y = ( ( y - obj.charting.offsetY ) / ( scaleY * -1 ) - translationY ) * -1;
			return [x, y];
		};
			obj.zoomTo = function(x1, y1, x2, y2) {
			translationX = x1;
			translationY = y1;
			scaleX = parent.width() * 0.8 / (x2 - x1);
			scaleY = parent.height() * 0.85 / (y2 - y1);
			//console.log((parent.width() * 0.125) + " " + (parent.height() * 0.125));
		};
		obj.offset = function(x, y) {
			obj.charting.offsetX = x;
			obj.charting.offsetY = y;
		};
		obj.relativeOffset = function(x, y) {
			obj.charting.offsetX += x;
			obj.charting.offsetY += y;
		}
		var scaledMethods = ['rect', 'fillRect', 'strokeRect', 'clearRect', 'moveTo', 'lineTo'];
		for (var i = 0; i < scaledMethods.length; i++) {
			var scaledMethod = scaledMethods[i];
			obj[scaledMethod] = (function(scaledMethod) {
				return function() {
					parent[scaledMethod].apply(parent, scale.apply(this, arguments));
				}
			})(scaledMethod);
		}
		obj.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
			var scaled = scale.apply(this, arguments);
			parent.arc(scaled[0], scaled[1], radius, startAngle, endAngle, anticlockwise);
		};
		obj.strokeText = function(text, x, y, maxWidth) {
			var scaled = scale(x, y);
			parent.strokeText(text, scaled[0], scaled[1], maxWidth);
		}
		var stateStack = [];
		obj.restore = function() {
			// Prevent null state
			if (stateStack.length) {
				obj.charting = stateStack.pop();
			}
			parent.restore();
		};  
		obj.save = function() {
			stateStack.push($.extend({}, obj.charting));
			parent.save();
		};
		return obj;
	}
	function SimpleTextContext(parent) {
		var obj = object(parent); 
		var locations = [];
		var spans = [];
		var pool = []; // Spans are not destroyed when cleared they are marked as invisible and moved into the pool
		obj.clear = function() {
			while (spans.length) {
				var span = spans.pop();
				$(span).css('visibility', 'hidden');
				locations.pop();
				pool.push(span);
			}
			parent.clear();
		};
		obj.font = {
			fontFamily : "sans-serif",
			fontSize : "10px",
			textAlign : "left", // NOT SUPPORTING start/end (CSS3)
			color : "#000000"
		};
		function getFormattedSpan(text) {
			var span;
			if (pool.length) {
				span = pool.pop();
				$(span).css('visibility', 'visible');
			} else {
				span = $(document.createElement('span')).addClass('canvas_text');
			}
			// Add to local store
			spans.push(span);
			// Set attributes
			span.text(text);
			span.css('font-family', obj.font.fontFamily);
			span.css('font-size', obj.font.fontSize);
			span.css('text-align', obj.font.textAlign);
			span.css('color', obj.font.color);
			return span;
		}
		obj.isWithinBounds = function(x, y, width, height) { // Basic out of bounds check (with slight optimisation for speed)
			if (width && height)
				return ((x >= 0) && (y >= 0) && (x + width <= obj.width()) && (y + height <= obj.height()));
			else
				return ((x >= 0) && (y >= 0) && (x <= obj.width()) && (y <= obj.height()));
		}
		obj.isOverlapping = function(x, y, width, height) {
			for (var i = 0; i < locations.length; i++) {
				if (((x <= locations[i].x) && (x + width >= locations[i].x)) || ((x <= locations[i].x + locations[i].w) && (x + width >= locations[i].x + locations[i].w))) {
					if (((y <= locations[i].y) && (y + height >= locations[i].y)) || ((y <= locations[i].y + locations[i].h) && (y + height >= locations[i].y + locations[i].h))) {
						return true;
					}
				}
			}
			return false;
		}
		obj.findFreePosition = function(x, y, width, height) {
			//nudge the text around until it's in a position where it isn't overlapping (and is still inside the canvas).
			var shifted = false;
			//try shifting vertically first
			for (var shift = 10; shift < 100; shift += 10) {
				if (!(obj.isOverlapping(x, y - shift, width, height)) && (y - shift >= 0)) {
					y = y - shift;
					shifted = true;
					break;
				} else if (!(obj.isOverlapping(x, y + shift, width, height)) && (y + shift + height <= obj.height())) {
					y = y + shift;
					shifted = true;
					break;
				}
			}
			//if we can't find a space vertically, try horizontally instead
			if (!shifted) {
				for (var shift = 10; shift < 100; shift += 10) {
					if (!(obj.isOverlapping(x - shift, y, width, height)) && (x - shift >= 0)) {
						x = x - shift;
						shifted = true;
						break;
					} else if (!(obj.isOverlapping(x + shift, y, width, height)) && (x + shift + width <= obj.width())) {
						x = x + shift;
						shifted = true;
						break;
					}
				}
			}
			if (!shifted) {
				//TODO: handle rare case where neither is possible.
				//at the moment, we give up and allow the text to overlap.
			}
			return {
				'x': x,
				'y': y
			};
		}
		obj.strokeText = function(text, x, y, floating, maxWidth) {
			if (obj.isWithinBounds(x, y)) {
				var strings = new String(text).split("\n");
				var textwidth = 0;
				var textheight = 0;
				var strings = new String(text).split("\n");
				for (var i = 0; i < strings.length; i++) {
					if ((strings[i].length * 6) > textwidth) {
						textwidth = strings[i].length * 6; //estimate of the width of a 10px character
					}
				}
				textheight = strings.length * 10;
				//find a position that doesn't overlap another span or go outside the canvas
				if (floating) {
					//move to be within bounds
					if (x + textwidth > obj.width()) { //draw on the right
						x = x - textwidth;
					}
					if (y + textheight > obj.height()) { //draw above
						y = y - textheight;
					}
					//find a location that doesn't overlap other text
					if (obj.isOverlapping(x, y, textwidth, textheight)) {              
						var newposition = obj.findFreePosition(x, y, textwidth, textheight);
						x = newposition.x;
						y = newposition.y;
					}
				}
				//ctx.drawTextBackgroundHere(x, y, width, height);
				for (var i = 0; i < strings.length; i++) {
					var string = strings[i];
					var span = getFormattedSpan(string);
					// Position on the canvas
					span.css('margin-left', x).css('margin-top', y + (i * 10)).width(maxWidth || 'auto');
					// record the location
					locations.push({
						'x' : x,
						'y' : y,
						'w' : textwidth,
						'h' : textheight
					});
					// Add to DOM
					$(obj.canvas).before(span);
				}
			}
		};
		obj.measureText = function(text) {
			var span = getFormattedSpan(text);
			// Hide before adding to the canvas
			span.css('visibility', 'hidden');
			// Add to the DOM
			$(obj.canvas).before(span);
			// Retrieve TextMetrics
			var metrics = { 'width' : span.width() };
			// Remove from DOM
			span.remove();
			return metrics;
		};
		var stateStack = [];
		obj.restore = function() {
			// Prevent null state
			if (stateStack.length) {
				obj.font = stateStack.pop();
			}
			parent.restore();
		};  
		obj.save = function() {
			stateStack.push($.extend({}, obj.font));
			parent.save();
		};
		return obj;
	}
	// TODO could move some of ChartManager into here (particularly the code
	// that doesn't assume the data is time series data?)
	var fadeZoomWindow;
	function CanvasChart(canvas) {
		var obj = object();
		var newchart = Chart();
		var gridlines = GridLines(newchart);
		var axes = Axes(gridlines);
		var ticks = AxisTicks(axes);
		// Blank chart
		obj.chart = Curves(ticks, []);
		// TODO remove
		/*var curveline = CurveLine(data || []);
		var curvedot = CurveDot(curveline);
		obj.chart = Curves(ticks, [curvedot]);*/
		//obj.chart = Curves(AxisTicks(Axes(GridLines(Chart()))), [CurveDot(CurveLine(data || []))]);
		obj.ctx = ChartingContext(SimpleTextContext(EnhancedContext(canvas)));
		obj.ctx.zoomTo(obj.chart.x.min, obj.chart.y.max, obj.chart.x.max, obj.chart.y.min);
		obj.update = function() {
			obj.ctx.clear();
			obj.chart.paint(obj.ctx);
		}
		//obj.update(); //don't render anything until the first series is ready
		var jCanvas = $(canvas);
		function getMousePosOnCanvas(e) {
			var canvasOffset = jCanvas.offset();
			return [ e.pageX - canvasOffset.left, e.pageY - canvasOffset.top ];
		}
		var start;
		var jDiv = $('<img src="/blog/archive/2010/04/transparent.gif" alt="" />').height(jCanvas.height()).width(jCanvas.width());
		jDiv.css('position', 'absolute').css('z-index', 2);
		jCanvas.before(jDiv);
		jDiv.dblclick(function(e) {
			obj.animateZoomTo(obj.chart.x.min, obj.chart.y.max, obj.chart.x.max, obj.chart.y.min);
			return false;
		});
		jDiv.mousedown(function(e) {
			start = obj.ctx.canvasToCharting.apply(obj.ctx, getMousePosOnCanvas(e));
			return false;
		});
		jDiv.mousemove(function(e) {
			var chartingLocation = obj.ctx.canvasToCharting.apply(obj.ctx, getMousePosOnCanvas(e));
			obj.chart.updatePositions(chartingLocation);
			if (start || obj.chart.requiresPaint()) {
				obj.update();
			}
			if (start) {
				var end = obj.ctx.canvasToCharting.apply(obj.ctx, getMousePosOnCanvas(e));
			drawZoomWindow(end);
			}
			return false;
		});
		jDiv.mouseup(function(e) {
			if (start) {
			var end = obj.ctx.canvasToCharting.apply(obj.ctx, getMousePosOnCanvas(e));
			if ((start[0] - end[0] != 0) && (start[1] - end[1] != 0)) {
				//Ensure the points are the correct way round
				var x0 = start[0], y0 = start[1], x1 = end[0], y1 = end[1];
				if (start[0] > end[0]) {
				x0 = end[0]; x1 = start[0];
				}
				if (start[1] < end[1]) {
					y0 = end[1]; y1 = start[1];
				}
				obj.animateZoomTo(x0, y0, x1, y1);
			}
			start = null;
		}
			return false;
		});
		function drawZoomWindow(end, opacity) {
			var alpha = (opacity || 0.5);
			obj.ctx.save();
			obj.ctx.ctx.shadowBlur = 10;
			obj.ctx.ctx.shadowColor = '#777777';
			obj.ctx.ctx.shadowOffsetX = 5;
			obj.ctx.ctx.shadowOffsetY = 5;
			obj.ctx.ctx.lineWidth = 1;
			obj.ctx.ctx.strokeStyle = 'rgba(0,0,255,' + alpha + ')';
			obj.ctx.beginPath();
			var x, y, w, h;
			// drawing must be top-left to bottom-right, or safari messes up the shadows
			if (end[0] >= start[0]) {
				x = start[0]; w = end[0] - start[0];
			} else {
				x = end[0]; w = start[0] - end[0];
			}
			if (end[1] >= start[1]) {
				y = end[1]; h = start[1] - end[1];
			} else {
				y = start[1]; h = end[1] - start[1];
			}
			obj.ctx.rect(x, y, w, h);
			obj.ctx.stroke();
			obj.ctx.ctx.fillStyle = 'rgba(0,0,255,'+ (0.2 * alpha) + ')';
			obj.ctx.fill();
			obj.ctx.closePath();
			obj.ctx.restore();
		}
		var interval = 1;
		var current = [obj.chart.x.min, obj.chart.y.max, obj.chart.x.max, obj.chart.y.min];
		obj.animateZoomTo = function() {
			function calculateSteps(start, end) {
				var noSteps = 20;
				var step = (end - start) / noSteps;
				var steps = [];
				for (var i = 0; i < noSteps; i++) {
					if (i == noSteps - 1) {
						steps.push(end);
					} else {
						steps.push(start + (tween(i, noSteps) * (end - start)));
					}
				}
				return steps;
			}
			// if the requested zoom is different to the current zoom, animate the change
			if (current[0] != arguments[0] || current[1] != arguments[1] || current[2] != arguments[2] || current[3] != arguments[3]) {
				var x1 = calculateSteps(current[0], arguments[0]);
				var y1 = calculateSteps(current[1], arguments[1]);
				var x2 = calculateSteps(current[2], arguments[2]);
				var y2 = calculateSteps(current[3], arguments[3]);
				var i = 0;
				var timer = window.setInterval(function() {
					obj.ctx.zoomTo(x1[i],y1[i],x2[i],y2[i]);
					obj.update();
					i++;
					if (i >= x1.length) {
						window.clearInterval(timer);
					}
				}, interval);
				current = [arguments[0], arguments[1], arguments[2], arguments[3]];
			}
		}
		obj.instantZoomTo = function() {
			obj.ctx.zoomTo(obj.chart.x.min, obj.chart.y.max, obj.chart.x.max, obj.chart.y.min);
			current = [arguments[0], arguments[1], arguments[2], arguments[3]];
		}
		return obj;
	}
	// TODO Rename to TimeSeriesChart ?
	function ChartManager(canvas, params) {
		// Map of series id to series details object
		this.series = {};
		this.canvas = canvas;
		// Blank chart
		this.chart = CanvasChart(canvas);
		// TODO should these be here? 
		this.chart.chart.x.min = 0;
		this.chart.chart.y.max = 1;
		this.chart.chart.y.min = -1;
		this.params = params ? params : {};
	}
	ChartManager.prototype = {
		getParam: function(name) {
			if (this.params[name]) {
				return this.params[name];
			}
			return null;
		},
		/** 
			Adds a series to the chart.
			@param series object containing the details
				   of the series to add
			 Must have the following properties: 
			 id        Some unique id for the series (can be the same as an existing
					   series, in which case will cause the existing series to be
					   removed from the chart and replaced with this one)
			 colour    The colour of the series line on the graph
			 data 	   Array of points, each consisting of a date and a value
			 intraday  Set to true to show intraday data
			 days	   The number of days to display
			 name 	   Display name for the series
			 
		 */
		addSeries: function(series) {
			// Add series if it doesn't already exist, otherwise update existing curve
			var add = !this.series[series.id];
			// TODO don't do this until we've added it to the graph?
			this.series[series.id] = series;
			this.updateChart(add, series);
		},
		removeSeries: function(seriesId) {
			// TODO implement
		},
		getSeriesDetails: function(seriesId) {
			return this.series[seriesId];
		},
		/** */
		updateChart: function(add, series) {
			// Convert our series data object into something that the chart can use
			var chartdata = [];
			// TODO it looks like this converts back to an array of values. Wouldn't
			// it be better to leave them as dates so that it's easier for horizontalScaleDate?
			var data = series.data;
			for (var i = 0; i < data.length; i++) {
				var point = data[i];
				if (series.intraday) {
					chartdata.push([point.d.valueOf(), point.v, series.name.toUpperCase() 
									+ "\n" + point.d.toTimeString().slice(0, 5) 
									+ "\n" + formatNumber(point.v.toFixed(2), false), point]);
				} else {
					chartdata.push([point.d.valueOf(), point.v, series.name.toUpperCase() 
									+ "\n" + point.d.toDateString().slice(0, 10) 
									+ "\n" + formatNumber(point.v.toFixed(2), false), point]);
				}
			}
			this.horizontalScaleDate(chartdata, series.intraday, series.days);
			this.verticalScalePercent(chartdata, series.intraday);
			this.addCurve(add, chartdata, series);
			this.fitChart();
			this.chart.update();
		},
		horizontalScaleDate: function(series, intraday, days) {
			if (series.length == 0) {
				// TODO what is daycount...?
				daycount = days;
				return;
			}
			//find the first date in the range
			var minX = series[0][0], maxX = series[series.length - 1][0];
			//set min and max to start and end of the first day
			var openTime = "8:00".split(":");
			var closeTime = "18:30".split(":");
			var startDate = this.getParam("startDate");
			if (!startDate) {
				startDate = new Date(minX);
			}
			startDate.setHours(openTime[0]);
			startDate.setMinutes(openTime[1]);
			startDate.setSeconds(0);
			startDate.setMilliseconds(0);
			minX = startDate.getTime();
			var endDate = new Date(minX);
			endDate.setHours(closeTime[0]);
			endDate.setMinutes(closeTime[1]);
			endDate.setSeconds(0);
			endDate.setMilliseconds(0);
			maxX = endDate.getTime();
			var daylength = maxX - minX;
			//bunch up all values to remove gaps between days
			var day = 0;
			var lastGoodDay = day;
			for (var i = 0; i < series.length; i++) {
				//if we've gone off the end of the day, update start and end values to be for the next one
				while (series[i][0] > endDate) {
					day++;
					do {
						startDate.setDate(startDate.getDate() + 1);
						endDate.setDate(endDate.getDate() + 1);
					} while ( isWeekend(startDate.getDay()));
					minX = startDate.getTime();
					maxX = endDate.getTime();
					lastDayValid = false;
				}
				if (intraday) {
					//if this point is between days, remove it (or the chart will be messed up)
					if (series[i][0] < startDate) {
						series.splice(i, 1);
						i--;
						continue;
					} else {
						lastGoodDay = day; //this day had some good data on it
					}
				} else {
					lastGoodDay = day; //eod values are always ok, even if they are after closing time
				}
				
				//shift values to start at the appropriate location
				series[i][0] = (series[i][0] - minX) + (day * daylength);
			}
			daycount = lastGoodDay + 1; //TODO include days after the requested range that have no data
			//if the feed day count is different to the requested day count, translate values to start in the right place
			if (days && days != daycount) {
				var diff = daycount - days;
				for (var i = 0; i < series.length; i++) {
					series[i][0] -= (diff * daylength);
				}
				daycount = days;
			}
			//scale to fit the graph
			for (var i = 0; i < series.length; i++) {
				series[i][0] *= this.chart.chart.x.max / (daylength * daycount);
			}
		},
		verticalScalePercent: function(series, intraday, min, max) {
			if (series.length == 0) {
				return;
			}
			//find the initial value (at x=0)
			var initialpos = series.length - 1;
			var initialval = series[initialpos][1];
			for (var i = 0; i < series.length; i++) {
				if (series[i][0] >= 0) {
					initialpos = i;
					initialval = series[initialpos][1];
					break;
				}
			}
			//rebase values
			for (var j = 0; j < series.length; j++) {
				series[j][1] = ((series[j][1] - initialval) / initialval) * 100;
			}
			//find min and max y values in the displayed range
			var minY = 0, maxY = 0;
			if (min != undefined && max != undefined) {
				minY = ((min - initialval) / initialval) * 100;
				maxY = ((max - initialval) / initialval) * 100;
			} else {
				for (var i = initialpos + 1; i < series.length; i++) {
					if (series[i][1] < minY) {
						minY = series[i][1];
					}
					if (series[i][1] > maxY) {
						maxY = series[i][1];
					}
				}
			}
			var rngY = maxY - minY;
			var chart = this.chart.chart;
			// TODO add a hasCurves method to CanvasChart? 
			if (chart.curves.length < 1 || minY < chart.y.min) {
				chart.y.min = minY;
			}
			if (chart.curves.length < 1 || maxY > chart.y.max) {
				chart.y.max = maxY;
			}
			// TODO add a function on CanvasChart to do this
			chart.axisTicks.yspacing = (maxY - minY) / 7.5;
			chart.gridLines.yspacing = (maxY - minY) / 7.5;
		},
		/**
		 * Add a curve to the chart
		 */
		addCurve: function(add, chartdata, series) {
			// generate the data as a line
			var curve = CurveDot(CurveLine(chartdata, series.colour));
			var seriesnum = 0;
			// TODO we could set this.chart to this.chart.chart if we don't
			// use this.chart for anything other than this.chart.chart
			var chart = this.chart.chart;
			// Add it as a new curve
			if(add) {
				chart.curves.push(curve);
				// TODO add chart.getNumCurves()
				seriesnum = chart.curves.length - 1;
				series.seriesNum = seriesnum;
			// Update the existing curve
			} else {
				seriesnum = this.series[series.id].seriesNum;
				animateChange(add, seriesnum, curve, defaultAnimSteps, defaultAnimInterval);
			}
			// update the table on position change
			var thisObj = this;
			var handler = function(position) {
				if (series.onPositionChange) {
					series.onPositionChange(series, position, chartdata);
				}
				thisObj.chart.chart.curves[seriesnum].dot.visible = true;
			};
			curve.dot.positionChange.observe(handler);
			handler(curve.dot.position);
		},
		// TODO this hasn't been tested
		animateChange: function(add, seriesnum, replacement, steps, interval) {
			var chart = this.chart.chart;
			if (!add) {
				var original = chart.curves[seriesnum].curve.data;
				var serieslength = 0;
				if (chart.curves[seriesnum].curve.data.length <= replacement.curve.data.length) {
					serieslength = chart.curves[seriesnum].curve.data.length;
				} else {
					serieslength = replacement.curve.data.length;
				}
				//copy out the initial values
				var intermediate = [];
				for (var i = 0; i < original.length; i++) {
					intermediate.push(original[i]);
				}
				//work out differences
				var diff = [];
				for (var i = 0; i < serieslength; i++) {
					diff.push((replacement.curve.data[i][1] - original[i][1]) / steps);
				}
				//animate steps
				var step = 0;
				var animationTimer = window.setInterval(function() {
					for (var j = 0; j < serieslength; j++) {
						intermediate[j][1] += diff[j];
					}
					chart.curves[seriesnum].curve.data = intermediate;
					this.chart.update();
					step++;
					if (step >= steps) {
						window.clearInterval(animationTimer);
						chart.curves[seriesnum] = replacement;
						chart.update();
					}
				}, interval);
			} else {
				chart.curves[seriesnum] = replacement;
				this.chart.update();
			}
		},
		/**
		 * Zoom in on the portion of the chart
		 */
		fitChart: function() {
			var chart = this.chart.chart;
			this.chart.instantZoomTo(chart.x.min, chart.y.max, chart.x.max, chart.y.min);
		},
		/**
		 * Highlight a line
		 */
		highlight: function(seriesId) {
			if(seriesId) {
				var seriesnum = this.series[seriesId].seriesNum;
			}
			var chart = this.chart.chart;
			// TODO this has some client specific code. Should add the option
			// for the client to add a handler for this?
			if (!(chart.params.activeOnly)) {
				if (seriesnum != undefined) {
					chart.curves[seriesnum].curve.highlight = true;
					chart.params.activeCurve = seriesnum;
					$('#row_' + seriesnum).addClass("active");
				} else { //remove highlight
					for (var i = 0; i < chart.curves.length; i++) {
						chart.curves[i].curve.highlight = false;
						$('#row_' + i).removeClass("active");
					}
					chart.params.activeCurve = -1;
				}
				this.chart.update();
			}
		},
		/**
		 * Toggle only displaying the active line
		 */
		toggleActiveOnly: function(seriesnum) {
			if (!(chart.chart.params.activeOnly) || seriesnum != chart.chart.params.activeCurve) {
				chart.chart.params.activeCurve = seriesnum;
				chart.chart.params.activeOnly = true;
				chart.chart.curves[seriesnum].curve.highlight = true;
				$('#row_' + seriesnum).addClass("active");
				for (var i = 0; i < chart.chart.curves.length; i++) {
					if (i != seriesnum) {
						chart.chart.curves[i].curve.highlight = false;
						$('#row_' + i).removeClass("active");
					}
				}
			} else {
				chart.chart.params.activeOnly = false;
				highlight(seriesnum);
			}
			chart.update();
		}
	}
	/************************** Helper functions, used above ************************/
	/** Converts an array of values [year,month,day,hour,min] to a Date instance */
	function td(vals) {
		var d = new Date();
		d.setFullYear(vals[0]);
		d.setMonth(vals[1]); // TODO 0 based?
		d.setDate(vals[2]);
		d.setHours(vals[3]);
		d.setMinutes(vals[4]);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
	}
	/**
	* Add thousand separators to a number
	*/
	function formatNumber(someNum, currency) {
		while (someNum.match(/^(.*\d)(\d{3}(\.|,|$).*$)/)) {
			someNum = someNum.replace(/^(.*\d)(\d{3}(\.|,|$).*$)/, '$1,$2');
		}
		return someNum;
	}
	/**
	* Check whether or not a numbered day of the week is at the weekend
	*/
	var disabledDays = [0,6];
		function isWeekend(day) {
		for (var i = 0; i < disabledDays.length; i++) {
			if (day == disabledDays[i]) {
				return true;
			}
		}
		return false;
	}
	/**
	* Generate a tween value for motion between two values.
	* Uses a sine function to give a smooth motion, with fast changes near the
	* middle of the range and slow changes near the start and end.
	*/
	function tween(step, noSteps) {
		return (Math.sin(((step / noSteps) * Math.PI) - (Math.PI / 2)) + 1) / 2;
	}
}(jQuery));