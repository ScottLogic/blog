$(function() {
			var canvas = document.getElementById("rxCanvas");
		
			// transform the mouse move event into an observable source of screen coordinates
			var mouseMoveEvent = Rx.Observable.FromHtmlEvent(canvas, "mousemove");
			
			// create observable sources from the left button events
			var mouseLeftButtonDown = Rx.Observable.FromHtmlEvent(canvas, "mousedown");
			var mouseLeftButtonUp = Rx.Observable.FromHtmlEvent(document.body, "mouseup");

			// create a 'drag event', which takes the delta in mouse movements 
			// when the left button is down
			var draggingEvents = mouseMoveEvent.SkipUntil(mouseLeftButtonDown)
												.TakeUntil(mouseLeftButtonUp)
												.Let(function(mm) {
													return mm.Zip(mm.Skip(1), function(prev, cur) {
														return {
														  X2: cur.offsetX,
														  X1: prev.offsetX,
														  Y2: cur.offsetY,
														  Y1: prev.offsetY
														};
													})
												})
												.Repeat();

			// subscribe and draw lines
			var context = canvas.getContext("2d");
			
			draggingEvents.Subscribe(function(p){
				context.moveTo(p.X1,p.Y1);
				context.lineTo(p.X2,p.Y2);
				context.stroke();	
			});
			
			
		});