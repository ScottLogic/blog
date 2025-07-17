/*global Ext: true */

/*
 * Produces a JSONObject that can be used to back a daily stock chart.
 */
function generateMockStockData(){
	"use strict";
	return {
		fields: ['time', 'value'],
		data: (function(){ //basic fake stock data generation..
			var points = [];
			var nextTime = new Date(2011,9,10,8,0,0); //8 o'clock (October, not September!)..
			var previousClose = 100;
			var nextValue = previousClose; // previous close stock value
			var trendUp = Math.random() > 0.5;
			var numPoints = Math.random() > 0.5 ? 200 : 255; //just to show what it's like when finished or part way through the day..
			
			for(var i = 0; i < numPoints; i++){
				//update the date and value for next time..
				nextTime = Ext.Date.add(nextTime, Ext.Date.MINUTE, 2);
				var diff = Math.random() * nextValue * (i === 0 ? 0.02 : 0.001); //max 0.01% or 2% on open..
				nextValue += trendUp ? diff : -diff;
				nextValue += nextValue * (Math.random() > 0.5 ? 0.002 * Math.random() : -0.002 * Math.random()); //add some random noise..
				nextValue = Math.round(nextValue*100)/100; //basic method to try to make it 2 dp..
				if(Math.random() > 0.95) trendUp = !trendUp; //flip trend..  

				//add the point (displayed as "H:i" -> % change)
				points.push({
					time: Ext.Date.format(nextTime, "H:i"),
					value: ((2*previousClose - nextValue)/previousClose * 100 - 100).toFixed(2) * 1
				});
			}
			return points;
		})(),
		stockName: "Mock Mega Corp."
	};
}
