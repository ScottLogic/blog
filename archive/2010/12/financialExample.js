//JQUERY CODE..
//acts like document.onload..
$(function(){
    //a rubbish shuffle method for arrays..
    Array.prototype.shuffle = function(){
        var array = this;
        var rands = [];
        $.each(array, function(i, value){
            rands.push([Math.random(), i]);
        });
        rands.sort(function(i,j){
            return i[0] - j[0];
        });
        var clone = array.slice(0);
        $.each(rands, function(i, pair){
            array[i] = clone[pair[1]]
        });
    };

    //rough rounding func..
    var round = function(number, decimals){
        var factor = 1;
        for(var i=0; i<decimals; i++){
            factor *= 10;
        }
        number *= factor;
        number = Math.round(number);
        return number/factor;
    };
    
    //gets the given number with given decimals..
    var display = function(number, decimals){
        number = "" + round(number, decimals);
        var dot = number.indexOf('.');
        if(dot < 0){
            number += '.';
            dot = number.length-1; 
        }
        for(var i=number.length-1-dot; i < decimals; i++){
            number += "0";
        }
        return number;
    };

    //calculates profit and loss..
    var getPandL = function(position){
        var pAndL = (position[4]/position[3] -1) * position[2];
        return display(pAndL,2);
    };
    
    var updatePortfolio = function(){
        //change all trades with max swing 2%.
        $.each(portfolio, function(i, position){
            var r = Math.random();
            if(r < 0.25){
                position[4] += position[4] * 0.02 * Math.random();
            } else if(r > 0.75){
                position[4] += position[4] * 0.02 * Math.random();
            }
        });
        //add an old position randomly..
        if(oldPositions.length > 0 && Math.random() > 0.8){
            oldPositions.shuffle();
            var oldPos = oldPositions.pop();
            oldPos[2] = (Math.random() < 0.4) ? -0.01 - 5 * Math.random() : 0.01 +  5 * Math.random();
            oldPos[4] += (Math.random() < 0.5) ? oldPos[5] * Math.random() * 0.05 : 0 - oldPos[5] * Math.random() * 0.05;
            oldPos[3] = oldPos[4]; //just bought the stock so in price = live price..
            portfolio.push(oldPos);
        }
        //drop a position randomly..
        if(portfolio.length > 1 && Math.random() > 0.8){
            portfolio.shuffle();
            oldPositions.push(portfolio.pop());
        }

        $.each(portfolio, function(i, position){
            position[5] = 1*getPandL(position);
        });
    };

    //All open positions..
    var portfolio = [
        //[company, ticker, size, inPrice, livePrice]
        ['Random Corp.', "RC.L", -1.4, 3.10, 3.11],
        ['ACME Industries', "ACME", 0.5, 0.10, 0.11],
        ['Tin Pot Oily', "TPO", 2, 4.10, 3.99],
        ['Fake Inc.', "FK.L", -0.6, 2.42, 2.59],
        ['Make Up Ltd.', "MAKEUP", 1, 0.98, 0.87]
    ];
    
    //Previously closed ones..
    var oldPositions = [
        ['Mega Corp.', "MEGA", -4.2, 2.65, 2.74, 0],
        ['Big Bank Ltd.', "BIGBK", 1.2, 10.01, 10.20, 0]
    ];
    
    $.each(portfolio, function(i, position){
        position[5] = 1*getPandL(position);
    });

    var sortingFuncs = {
        number: function(i, j){
            return i - j;
        },
        string: function(i, j){
            return (i > j) ? 1 : (i == j) ? 0 : -1;
        }
    };
    
    //initially sort on p and l decending..
    var colSortedOn = 5;
    var ascending = false;
    var sortingFunc = sortingFuncs.number;
    
    //it is currently updating..
    var updating = false;
    
    var generateTable = function(){
        var table = $('#stocks .template').clone();
        table.attr('class', 'actualTable');
        var tBody = $(table[0].tBodies[0]);
        
        //sort the output..
        portfolio.sort(function(i, j){
            i = i[colSortedOn];
            j = j[colSortedOn];
            return (ascending) ? sortingFunc(i,j) : 0-sortingFunc(i,j);
        });

        $.each(portfolio, function(i, position){
            var row = $('<tr/>');
            $.each(position, function(j, value){
                row.append($('<td />', {
                    text: (typeof value == 'number') ? display(value, 2) : value,
                    css: {
                        textAlign: (typeof value == 'number') ? 'right' : 'left',
                    }
                }));
            });
            tBody.append(row);
        });
        
        //attach click events..
        table.find('.fe-sortable').each(function(i, header){
            header = $(header);
            header.click(function(event){
                event.preventDefault();
                if(updating){
                    return;
                }
                updating = true;
                if(colSortedOn == i){
                    ascending = !ascending;
                } else {
                    ascending = true;
                }
                colSortedOn = i;
                sortingFunc = (header.hasClass('fe-string')) ? sortingFuncs.string : sortingFuncs.number;
                updateTable();
            });
        });
		
        return table;
    };
    
    //Updates the status with the current time..
    var updateStatusTime = function(){
         var date = new Date();
        var dateStr = date.getHours() + ":" + date.getMinutes() + ":" 
                        + date.getSeconds() + ", " + date.getDate() + '\/'
                        + (date.getMonth()+1) + '\/' + date.getFullYear();
        $('#stocks .status').html("Updated at: " + dateStr);
    };
    
    //set up the table initially..
    var table = generateTable().show();
    //add image showing sort..
    $(table[0].tHead.rows[0].cells[5]).append('&darr;');
    $('#stocks .tableHolder').append(table);
    updateStatusTime();

    //Updates the table..
    var updateTable = function(updateStatus){
        var newTable = generateTable();
        table.rankingTableUpdate(newTable, {
            duration: [1000,200,700,200,1000],
            onComplete: function(){
                updating = false;
                if(updateStatus){
                   updateStatusTime();
                }
            },
            animationSettings: {
                up: {
                    left: 0,
                    backgroundColor: '#CCFFCC'
                },
                down: {
                    left: 0,
                    backgroundColor: '#FFCCCC'
                },
                fresh: {
                    left: 0,
                    backgroundColor: '#CCFFCC'
                },
                drop: {
                    left: 0,
                    backgroundColor: '#FFCCCC'
                }
            }
        });
        table = newTable;
        $(table[0].tHead.rows[0].cells[colSortedOn]).append((ascending) ? '&uarr;' : '&darr;');
    }
    
    //reference to the infinite loop..
    var loop = null;
	$('#stocks .triggerUpdates').click(function(event){
		if(!loop){
			$('#stocks .triggerUpdates').html('Stop "live" updates..');
			var loopFunc = function(){
				if(!updating){
					updating = true;
			
					$('#stocks .status').html("Updating..");
					//set the columns to be updating..
					$('#stocks .actualTable .livePrice').removeClass('anim:constant');
					$('#stocks .actualTable .profitLoss').removeClass('anim:constant');
		
					updatePortfolio();
					updateTable(true);
					//set the columns to be updating..
					$('#stocks .actualTable .livePrice').addClass('anim:constant');
					$('#stocks .actualTable .profitLoss').addClass('anim:constant');
				}
			}
			loopFunc();
			loop = setInterval(loopFunc, 10000);
		} else {
			$('#stocks .triggerUpdates').html('Start "live" updates..');
			clearInterval(loop);
			loop = null;
		}
		event.preventDefault();
	});
	
	
	
	
});
