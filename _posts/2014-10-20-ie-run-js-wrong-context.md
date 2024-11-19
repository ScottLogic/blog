---
title: How IE confuses JavaScript context when running in multiple windows
date: 2014-10-20 00:00:00 Z
categories:
- Tech
tags:
- IE
- popup windows
- JavaScript
author: lpage
summary: This is a blog post about IE and how it handles windows running code which
  interacts with each other. I've created a test case that shows IE combine together
  two stacks so that code runs in a context which, when looking at the source code,
  seems impossible.
image: ''
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/10/20/ie-run-js-wrong-context.html
disqus-id: "/2014/10/20/ie-run-js-wrong-context.html"
---

This is a blog post about IE and how it handles windows running code which interacts with each other. I've created a test case that shows IE combine together two stacks so that code runs in a context which, when looking at the source code, seems impossible. Afterwards I'll discuss problems it can cause and ways to solve.

## Test Case

First, I'll explain the test case. On the main or start window we have the following, which just creates an app with a synchronous and asynchronous callback.

{% highlight javascript %}
window.myApp = {
	syncCall: function() {
		return "Sync";
	},
	asyncCall: function(callback) {
		setTimeout(function timeoutOnMainPage() {
			callback("async");
		}, 0);
	}
};
{% endhighlight %}

In the html I just have a link which window.opens the popup window.

On the popup or second window we have some code which communicates with the main window - it calls the async function and then it calls the sync function. There are 2 complications - first the sync call is done within a function - this is just so that you can see it in the stack trace. Second, There is a `waitFor(1)` which loops around doing dom manipulation until a second has passed. That call is necessary to reproduce the bug, though it doesn't need to be a second - in a complex web application just having a mass of code between the async and sync call would be enough.

{% highlight javascript %}
var myApp = window.opener.myApp;
myApp.asyncCall(function asyncCallbackOnPopup() {
	log("the stack is:\n" + getStack());
	log("Async call made in state:" + state);
});
function makeSyncCallToMainWindow() {
	changeState("waiting...");
	waitFor(1);
	changeState("making sync call");
	myApp.syncCall();
	changeState("finished");
}
makeSyncCallToMainWindow();
{% endhighlight %}

Note that the helper functions can be found in the linked test-case.

The output from Chrome & Firefox is the following.

<pre>
state is now:waiting...
state is now:making sync call
state is now:finished
the stack is:
Error: Test
    at getStack (testpopup.htm:40:15)
    at asyncCallbackOnPopup (testpopup.htm:10:28)
    at timeoutOnMainPage (testmain.htm:11:5)
Async call made in state:finished
</pre>

So, the sequence of events for chrome and firefox are
1. Popup makes async call to main window
2. Main window schedules timeout to call popup
3. Popup does stuff for a second
4. Popup makes sync call to main window
5. Code is now not running on popup window so main window runs timeout
6. Async callback fires on popup window

However, here is the output from IE

<pre>
state is now:waiting...
state is now:making sync call
the stack is:
Error: Test
   at asyncCallbackOnPopup (testpopup.htm:11:10)
   at makeSyncCallToMainWindow (testpopup.htm:22:4)
   at Anonymous function (testpopup.htm:25:3)
Async call made in state:making sync call
state is now:finished
</pre>

and the sequences of events is (the full test case has more logs to determine this) ...

1. popup makes async call to main window
2. main window schedules timeout to call popup
3. popup does stuff for a second
4. at some point whilst the popup window is doing things, the main window runs the setTimeout, but it doesn't call into the popup window because the popup window is currently running code.
5. popup makes sync call to main window
6. main window is busy trying to run timeout - so because IE hasn't waited till the popup has finished running JavaScript, we have a deadlock situation with the main window wanting to run code in the popup window and vice versa.
7. IE then runs the callback from the main window to the popup window, even though the popup window is trying to make a synchronous call to the main window. The result is that the callback from the main window runs in the context that the popup window is currently in (e.g. a context that couldn't possibly have led to that function being called!).
8. then (or possibly at the same time) it runs the synchronous call from the popup in the current context of the main window (i.e. the context of the function inside setTimeout that was previously running in step 7!) So their stack traces and contexts are reversed.
9. Once that has the result to send to the main window, it then continues both threads as if nothing has happened - the syncCall return runs in the popout window and the remainder of the timeout function runs on the main window.

You can see this in the log result above (though it is simplified and not showing step 9), because of two things.

Firstly the stack goes `asyncCallbackOnPopup` and then `makeSyncCallToMainWindow` which implies that somehow the popup window is running the code inside the setTimeout on the main window!
Secondly the line `Async call made in state:making sync call` - this means that any state setup in the popup window whilst it is executing is being used for running the callback.

If you don't quite understand, the easiest way is to compare the code with the stack traces.

The test case can be run from <a href="{{ site.baseurl }}/lpage/assets/wrong-context/testmain.htm">here</a>.

## What are the implications?

There are several issues that can arise because of this IE bug. The most obvious is because it makes JavaScript not like a single threaded language any more. For example..

{% highlight javascript %}
window.myResource = null;
function reEntrant() {
    if (myResource) {
        myResource.dispose();
    }
    myResource = anotherFunction();
}
{% endhighlight %}

You might be fooled into thinking this function was safe and that for instance `dispose` would only ever be called once. However imagine reEntrant is called every time X changes and that `anotherFunction();` calls into a different window. If that different window sends something to this window, which causes reEntrant to be called, then the first execution will not yet have set a new resource onto `myResource` and dispose will be called twice.

{% highlight javascript %}
window.myResource = null;
function reEntrant() {
	// thread from main window is going to dispose myResource
    if (myResource) {
        myResource.dispose();
    }
    // Thread from popup window already disposed myResource and is in anotherFunction(), creating a new one.
    myResource = anotherFunction();
}
{% endhighlight %}

But that's probably the least of your worries. Firstly the main window thread will create a new myResource based on new information, then once the current windows thread comes back, it will overwrite myResource with a version based on outdated information.

A third example can be seen when using knockout computed values - Knockout ignores re-entrant calls to ko.computed (it messes up the internal ko state of that computed). But in the case of a popup window, the computed might be triggered by a completely new event (not recursive) but be ignored because the current state of that computed tells knockout that it is being called recursively.

## How to fix it

I don't think we can deal with this bug by programming in a thread safe way - there are too many loop holes, javascript lacks the tools and its not quite just multithreaded behaviour. Imagine the previous example.. (note - untested, for illustration purposes only)

{% highlight javascript %}
window.myResource = null;
window.inFunction = false;
window.reEntry = false;
function reEntrant() {
	var iAmtheReEntrantOne = false;
    if (inFunction) {
    	reEntry = true;
    	iAmtheReEntrantOne = true;
    }
	inFunction = true;
    if (myResource) {
        myResource.dispose();
        myResource = null;
    }
    
    var newResource = anotherFunction();
    inFunction = false;
    if (!reEntry) {
        myResource = newResource;
    } else if (!iAmtheReEntrantOne) {
        reEntry = false;
    }
}
{% endhighlight %}

So What can we do to fix the problem? The only way around it I can think of is to run the async callback in the popout window in a setTimeout. That fixes only one side (the main window still runs the sync function in the context of its setTimeout, but hopefully a setTimeout that calls the popout window does not have a large amount of associated state that can mess up the sync call). You could also mandate that all communication between the 2 windows goes through a post message type mechanism - thereby separating the communication in the same way.

Unless you do write an application that is very strict in its window communication this will be a difficult bug to track down the cause of, an easy one to fix a single case of and a difficult bug to permanently work around. Here's hoping that IE fixes it in IE12!

## Further thoughts

I wonder whether IE is detecting the deadlock and resolving it manually or if it is essentially unlocking both windows so that they both run at once until both are finished and then they both swap back again?
I wonder what happens if you extend this to 3 browser windows? Does IE crash or cope with it in the same way as above?

As for firefox and chrome - it seems they must have something in them which stops setTimeouts from firing on the parent window until the child window is free. Does that mechanism kick in for any site that can access its opener or just when you access the opener? If its the former then opening any site on the same domain could end up locking your page if that child window locks.























