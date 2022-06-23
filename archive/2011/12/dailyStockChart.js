/*global Ext: true, generateMockStockData: true */
Ext.onReady(function(){
    "use strict";   
        
    //format of the data given to the chart..
    var dataDateFormat = "H:i";
	
    //Converts times in the "dataDateFormat" to values..
    function convertTimeToValue(timeStr){
        var time = Ext.Date.parse(timeStr, dataDateFormat);
        time.setFullYear(1970,0,1); //need to set the day to epoch as values do wrong with large numbers..
        return time.getTime();
    }

    //Returns a "stepsCalc" object which describes the minimum, maximum
    //and steps to use for the value axis based on the data points given..
    function getSensibleValueAxisStepsCal(points){
        //get the real max and min values from the data..
        var minValue = 0;
        var maxValue = 0; 

        //get the correct max/min values and converts dates to numbers..
        Ext.each(points, function(point, i){
			var value = point.value;
			if(value < minValue)
				minValue = value;
			if(value > maxValue)
				maxValue = value;
        });
        
        var range = maxValue - minValue;
        var minClearence = Ext.max([range * 0.1, 0.01]);
        
        //get a sensible step between major ticks on axis - bit of a black art!
        var step = 0.01;
        var i = 1;
        while(range > step * 10)
            step *= ++i % 3 ? 2 : 2.5;

        var axisMin = Math.floor((minValue - minClearence)/step) * step; //ensure 10% clearence then round to step value..
        var axisMax = Math.ceil((maxValue + minClearence)/step) * step; //ensure 10% clearence then round to step value..
        var steps = Math.round((axisMax - axisMin)/step);
        
        return {
            from: axisMin,
            to: axisMax,
            step: step,
            steps: steps
        };
    }

    //Formatting functions used for the legend and the axes..
    var timeFormatter = function(timeVal){
        return Ext.Date.format(new Date(timeVal), "g:iA");
    };
    var valueFormatter = function(value){
        return value.toFixed(2)*1 + "%";
    };

    var miniLegendTemplate = new Ext.XTemplate(
        '<div class="miniLegend">' +
        '  <div class="time">{defaultTime}</div>' +
        '  <div class="marker" style="background-color: #5555FF;"></div>' +
        '  <div style="color: #3333FF;">' +
        '    <span class="stockName">{stockName}</span>' +
        '    <span class="value">{defaultValue}</span>' +
        '  </div>' +
        '</div>'
    );
    
    //Create charts and add them to the page..
    Ext.each(Ext.query('div.chartHolder'), function(rootDiv){
		//Get some fake data and convert the dates to values..
		var mockRawData = generateMockStockData();
		Ext.Array.each(mockRawData.data, function(point, i){
			point.time = convertTimeToValue(point.time);
		});
	
		var legendValueResetTimeout; //timeout used to set the legend back to default..
		var valueAxisSteps = getSensibleValueAxisStepsCal(mockRawData.data);
		var legendTimeEl; //gets set to the time field of the legend when it exists..
		var legendValueEl; //gets set to the value field of the legend when it exists..
		var lastPoint = mockRawData.data[mockRawData.data.length-1];
		var latestValueFormatted = valueFormatter(lastPoint.value);
		var latestTimeFormatted = timeFormatter(lastPoint.time);

		//add points for series on the x-axis to represent the previous close value..
		mockRawData.fields.push("previousClose");
		Ext.each(mockRawData.data, function(point, i){
				point.previousClose = 0;
		});
		mockRawData.data.push({
			previousClose: 0,
			time: convertTimeToValue("16:30")
		});

		//define the Ext chart...
		var chart = Ext.create('Ext.chart.Chart', {
			store: Ext.create('Ext.data.JsonStore', mockRawData),
			shadow: false,
			legend: false, //don't even bother - roll your own!
			listeners: {
				afterrender: function(){
					var el = miniLegendTemplate.append(this.el, { 
						stockName: mockRawData.stockName,
						defaultValue: latestValueFormatted, //show the latest value is unknown..
						defaultTime: latestTimeFormatted
					});
					legendTimeEl = new Ext.Element(Ext.query('.time', el)[0]);
					legendValueEl = new Ext.Element(Ext.query('.value', el)[0]);
				}
			},
		
			cls: 'dailyStockChart',
			axes: [{
				type: 'Numeric',
				minimum: valueAxisSteps.from, //essential for correctness!
				maximum: valueAxisSteps.to, //essential for correctness!                    
				position: 'left',
				minorTickSteps: 0,
				grid: true,
				fields: ['value'],
				applyData: function(){
					return valueAxisSteps; 
				},
				label: {
					//annoyingly the default label renderer doesn't deal with decimals well,
					//and labels can have rounding errors (and we want to add '%' to the end!)..
					renderer: valueFormatter
				}
			}, {
				type: 'Numeric',
				position: 'bottom',
				minimum: convertTimeToValue("08:00"), //essential for correctness!
				maximum: convertTimeToValue("16:30"), //essential for correctness!
				minorTickSteps: 0,
				fields: ['time'],
				grid: true,
				applyData: function(){
					var stepConfig = {
						from: convertTimeToValue("08:00"),
						to: convertTimeToValue("16:30"),
						steps: (convertTimeToValue("16:30") - convertTimeToValue("08:00"))/(30*60*1000),
						step: 30*60*1000
					};
					return stepConfig;
				},
				label: {
					//need to convert the numbers back to formatted dates..
					renderer: function(val){
						//return timeFormatter(val);
						return val % (2*60*60*1000) ? "<span style='visibility: hidden;'></span>" : timeFormatter(val);
					}
				}
			}, { //dummy axis - forces the top label on left axis to be in line..
				position: 'top',
				type: 'Numeric'
			}],
			theme: "DailyStockChart",
			series: [{
				type: 'line',
				axis: ['left', 'bottom'],
				xField: 'time',
				yField: 'value',
				showMarkers: true,
				style: {
					stroke: '#5555FF',
					'stroke-width': 1
				},
				markerConfig: {
					radius: 0,
					fill: '#5555FF',
					stroke: '#5555FF',
					'stroke-width': 0
				},
				highlight: true,
				getItemForPoint: function(x, y) {
					var items = this.items;
					if (!items || !items.length || !Ext.draw.Draw.withinBox(x, y, this.bbox)) {
						return null;
					}
					var nearestItem = null;
					var smallestDiff = Number.MAX_VALUE;
					
					//Do binary search to find item with the nearest x point..
					var lowIndex = 0, highIndex = items.length - 1, currentIndex;
					while (lowIndex <= highIndex) {
						currentIndex = Math.floor((lowIndex + highIndex) / 2);
						var item = items[currentIndex];
						
						var diff = item.point[0] - x;
						var absDiff = Math.abs(diff);
						if(absDiff < smallestDiff){
							nearestItem = item;
							smallestDiff = absDiff;
						}
						//update bounds of search..
						if(diff < 0) lowIndex = currentIndex+1;
						else if(diff > 0) highIndex = currentIndex-1;
						else break; //equal case..
					}
					return nearestItem;
				},
				highlightItem: function(item) {
					if(!item)
						return;
					item.sprite.setAttributes({
						radius: 4
					}, true);
					item.sprite._highlighted = true;
					//update the legend..
					clearTimeout(legendValueResetTimeout);
					legendTimeEl.update(timeFormatter(item.storeItem.data.time));
					legendValueEl.update(valueFormatter(item.storeItem.data.value));
				},
				unHighlightItem: function(){
					var items = this.items;
					if(!items)
						return;
					for(var i = 0, len = items.length; i < len; i++){
						var sprite = items[i].sprite;
						if(sprite && sprite._highlighted){
							sprite.setAttributes({
									radius: 0
							}, true);
							delete sprite._highlighted;
						}
					}
					//reset the legend (use timeout to prevent excess dom manipulation)..
					legendValueResetTimeout = setTimeout(function(){
							legendTimeEl.update(latestTimeFormatted);
							legendValueEl.update(latestValueFormatted);
					}, 100);
				}
			}, {
				//fake series which just shows the fill..
				type: 'line',
				axis: ['left', 'bottom'],
				fill: true,
				xField: 'time',
				yField: 'value',
				showMarkers: false,
				style: {
					stroke: '#3333FF', //included due to chome bug..
					'stroke-width': 0,
					fill:  '#3333FF',
					opacity: 0.2 //v. annoyingly the opacity is applied to the line and the fill!
				}
			}, {               
				//series which highlighs the 0% line, inicating the previous close value..
				type: 'line',
				axis: ['left', 'bottom'],
				xField: 'time',
				yField: 'previousClose',
				showMarkers: false,
				style: {
					stroke: '#FF3333', 
					'stroke-dasharray': [9,5], //ignored in browsers that don't support SVG..
					'stroke-width': 1,
					opacity: 1
				}
			}]
	    });
	   
	    //Add the chart to the page..  
	    Ext.create('Ext.container.Container', { //for some reason "Panel" won't work in IE6!
			layout: 'fit', 
			width: 450,
			height: 300,
			renderTo: rootDiv,
			items: chart
	    });
    });
});