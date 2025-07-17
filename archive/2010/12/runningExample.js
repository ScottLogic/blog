var showing2009 = true;
$(function(){
	$('#nextYear').click(function(event){
		var thisYear = (showing2009) ? "2009" : "2010";
		var nextYear = (showing2009) ? "2010" : "2009";
		$('#year').html(nextYear);
		var title = $('#nextYear');
		title.hide();

		//save old version of table..
		var clone = $('.' + thisYear).clone();
		
		//call the function..
		$('.' + thisYear).rankingTableUpdate($('.' + nextYear), {
			onComplete: function(){
				title.html("Show Results for " + thisYear);
				title.show();
				showing2009 = !showing2009;
				
				//add old version of table back..
				clone.hide();
				title.parent().append(clone);
			}
		});
		event.preventDefault();
	});
});

