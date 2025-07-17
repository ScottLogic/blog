//details list of the tables to show..
var tablesAndTitles = [
	{title: "Standings after Korea", tableClass: "afterKorea"},
	{title: "Standings after Brazil", tableClass: "afterBrazil"},
	{title: "Final Standings", tableClass: "finalStandings"}
];
var currentlyShowingIndex = 0; //index into the tablesAndTitles list that is current being displayed.

//JQUERY CODE..
//acts like document.onload..
$(function(){

	//function to change the title above the table..
	//params:
	//  newTitle, a sting to set the title to..
	var changeTitleTo = function(newTitle){
		var titleEle = $('#title')[0];
		
		var showAnimator = new Animator().addSubject(new NumericalStyleSubject(titleEle, "opacity", 0, 1, ""));
		var removeAnimator = new Animator({
			onComplete: function(){
				//actually update the vale then show it again..
				$(titleEle).html(newTitle);
				setTimeout(function(){
					showAnimator.play()
				}, 1000);
			}
		}).addSubject(new NumericalStyleSubject(titleEle, "opacity", 1, 0, ""));
		
		removeAnimator.play();
	};

	//called by the onclick methods to start the animation..
	var showNextTable = function(nextIndex){
		//before we start the animation we'll clone the table which is going to be removed
		//and add it to the dom, this is only necessary since we aren't using a service which
		//generates the table - they are simple hard-coded into the html
		var currentTable = $('.'+tablesAndTitles[currentlyShowingIndex].tableClass);
		$('#f1').append(currentTable.clone().hide());

		var nextTableObj = tablesAndTitles[nextIndex];
		
		//try to start the animation..
		finishedAnimation = false;
		currentTable.rankingTableUpdate($('.'+nextTableObj.tableClass),
			//the animation settings..
			{
				onComplete: function(){
					finishedAnimation = true;
				}
			}
			
		);
		
		changeTitleTo(nextTableObj.title);
		
		//hide/show the back/forward buttons as expected..
		var buttonAnimator = null;
		if(nextIndex == 0){
			buttonAnimator = new Animator().addSubject(new NumericalStyleSubject($('#back').find("img")[0], "opacity", 1, 0, ""));
		} else if(nextIndex == 1 && currentlyShowingIndex == 0){
			buttonAnimator = new Animator().addSubject(new NumericalStyleSubject($('#back').find("img")[0], "opacity", 0, 1, ""));
		} else if(nextIndex == tablesAndTitles.length -1){
			buttonAnimator = new Animator().addSubject(new NumericalStyleSubject($('#forward').find("img")[0], "opacity", 1, 0, ""));
		} else if(currentlyShowingIndex == tablesAndTitles.length -1){
			buttonAnimator = new Animator().addSubject(new NumericalStyleSubject($('#forward').find("img")[0], "opacity", 0, 1, ""));
		}
		if(buttonAnimator){
			buttonAnimator.play();
		}

		currentlyShowingIndex = nextIndex;
	}
	
	//if the table is still updating then this should be set to false..
	var finishedAnimation = true;
	
	//attach event to back button..
	$('#back').click(function(event){
		if(currentlyShowingIndex > 0 && finishedAnimation){
			showNextTable(currentlyShowingIndex-1);
		}
		event.preventDefault();
	});

	//attach event to forward button..
	$('#forward').click(function(event){
		if(currentlyShowingIndex < tablesAndTitles.length-1 && finishedAnimation){
			showNextTable(currentlyShowingIndex+1);
		}
		event.preventDefault();
	});
});

