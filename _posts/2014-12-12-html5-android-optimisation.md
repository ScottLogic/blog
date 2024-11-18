---
title: HTML5 Mobile - Optimising for older or slower devices
date: 2014-12-12 00:00:00 Z
categories:
- Tech
author: alee
summary: Some lessons I've learned trying to optimise a HTML5 mobile App so that it's fast and responsive even on old or budget phones with limited performance.
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/12/12/html5-android-optimisation.html
disqus-id: "/2014/12/12/html5-android-optimisation.html"
---

Recently I built a proof of concept HTML5 cross-platform Mobile App, which we intended to use as a technology showcase running on both iPhones and Android phones. I used animated transitions to give the user good feedback when moving between screens and interacting with the App. For example, screens would slide in from the left, and "Hero" elements would move to new positions and change shape/style.

The App looked great running on iPhones and the Android devices we had available during development (Nexus 5 and 10). However, some early testers tried it on other Android phones and reported that the transitions were jerky and didn't look good.

Google's success at making the OS available at lower price points means that many users have devices with relatively limited performance. Giving those users a good experience is vital. Here are some lessons I've learned while optimising my App to look good on older or slower devices.

### About the App

My proof of concept App consists of a home screen showing a scrollable list of cards. Each card shows some summary information, and clicking on the card initiates a transition to the details screen. Some of the the card content also appears in the header of the details screen, so it uses a "Hero" transition to move it to its new position. This diagram illustrates the transition:

<img src="{{ site.baseurl }}/alee/assets/android-optimise/app-layout.png"/>

I built my App using [Ionic Framework](http://ionicframework.com), which is based on [AngularJS](https://angularjs.org/), but these lessons should apply to other frameworks too. Angular has built-in support for animations, and Ionic comes with some default transitions for sliding pages left and right. I used that, and added a Javascript animation for the "Hero" element. It extracts the element from the card and positions it so it's in the same place on screen, then animates it to it's new location before removing it. The corresponding element in the details page is initially hidden during the animation, and revealed at the end so it appears to be the same element.

### Cache or pre-fetch data

The data for the card details page comes from an Ajax request, so a simple implementation would look something like this:

    {% highlight js %}
    angular.module('myApp', []).controller('DetailsCtrl',
      function ($scope, $stateParams, dataService) {
        // Asynchronous ajax request for data
        dataService.getDetails($stateParams.id, function(data) {
          $scope.data = data;
        });
    });
{% endhighlight %}

The Ajax request is asynchronous, and subject to internet latency, so the screen transition is likely to be half-way through when the data comes back and displays the details screen. Yuck!

As it happens, some of the data on the details screen was used to create a summarised version on the home screen. Instead of requesting it all again, let's cache and re-use it:

    {% highlight js %}
    angular.module('myApp', []).controller('DetailsCtrl',
      function ($scope, $stateParams, dataService) {
        // Synchronous request for partial cached data
        $scope.data = dataService.getCachedDetails($stateParams.id); 

        // Asynchronous ajax request for complete data
        dataService.getDetails($stateParams.id, function(data) {
          $scope.data = data;
        });
    });
{% endhighlight %}

Now the important parts of the details screen will be displayed before the transition begins. We'll still get some additional details popping in mid-transition, but I'll have a look at that problem in a later paragraph: [Avoid DOM updates during transitions](#avoid_dom_updates_during_transitions). 

### Use CSS transitions

Rather than try to explain how Angular Animations work, I'll refer to the [documentation](https://docs.angularjs.org/guide/animations). I created an `animation` module, with `enter` and `leave` methods for the screens containing the "Hero" elements.

My initial attempt at animating the "Hero" element used jQuery, something like this:

    {% highlight js %}
    element.css({
        position: 'absolute',
        top: initialTop
      }).animate({
        top: finalTop
      }, 300, function() {
        element.remove();
      });
{% endhighlight %}

However, a CSS transition should be smoother, because it can be handled natively by the browser. Some phones even allow for hardware acceleration of CSS transitions. 

    {% highlight js %}
    // Set the initial position
    element.css({
        position: 'absolute',
        top: initialTop
      }).addClass('animating');

    // Animate to the new position
    element.css({
        transform: 'translate3d(0, ' + (finalTop - initialTop) + 'px, 0)'
      }).addClass('animating-end');

    // Remove the element after the transition finishes
    element.bind('transitionend', function() {
      element.remove();
    });
{% endhighlight %}

In this example, the `animating` class tells the browser to animate the `top` attribute from `initialTop` to `finalTop`.

    .animating {
      -webkit-transition: all ease-in-out 300ms;
      -moz-transition: all ease-in-out 300ms;
      -o-transition: all ease-in-out 300ms;
      transition: all ease-in-out 300ms
    }

    // Final appearance of the animated element
    .animating-end {
      color: #fff;
      background-color: #0495c1;
    }

The CSS transition also lets us animate other properties, such as the foreground and background colours. These are different on the details page because the element moves inside the header.

### Selectively disable transitions

The CSS transitions look nice and smooth on the higher-end devices, such as the Nexus 5 and Nexus 10, but older devices still struggle. I tested with a HTC Desire S, which could handle the simple side-to-side transition of the page, but not animating the "Hero" element.

A good way to solve this is to intelligently scale back the experience, depending on the hardware capabilities. I want the "Hero" animation on the Nexus 5, but on the Desire S it should stick to the basic side-to-side transition.

Ionic framework already has a built in feature for just this sort of situation. The `ionic.platform` object has a property `grade` which is 'a' for newer/faster hardware, then 'b' or 'c' as things get slower. I can limit "Hero" animations to grade 'a' devices like this:

    {% highlight js %}
    // Check the platform grade
    if (ionic.platform.grade === 'a') {
      // Trigger "Hero" transition

      // ...
    } 
{% endhighlight %}

### Avoid DOM updates during transitions

Javascript applications that get data from an ajax service are high-latency asynchronous by their nature. That makes it very difficult to make sure you don't get any data returned in the middle of a transition. When that happens, it usually means changes to the controller's `$scope`, which trigger DOM updates. The updates may not take long, but it can be enough to delay one of the frames of the animation, which creates a noticeable and unsightly judder.

My first attempt to avoid callbacks during transitions was to simply delay the request until after the transition had finished. Like this:

    {% highlight js %}
    angular.module('myApp', []).controller('DetailsCtrl',
      function ($scope, $stateParams, dataService) {
        // Synchronous request for cached data
        $scope.data = dataService.getCachedDetails($stateParams.id); 

        // 300ms delay to make sure the transition has finished
        setTimeout(function() {
          // Asynchronous ajax request for data
          dataService.getDetails($stateParams.id, function(data) {
            $scope.data = data;
          });
        }, 300);
    });
{% endhighlight %}

In practice, this was difficult to manage because data requests are made in many different places, and it makes the code harder to read and maintain. It's also unreliable for a couple of reasons. Firstly, it's hard to make sure there are no outstanding timeouts or ajax calls when a transition begins. Secondly, sometimes it takes longer for Angular to get the transition started so the timeout ends up firing mid-transition anyway.

In the end I settled on a system of guarded callbacks. The Ajax requests are made in the normal way, but the callbacks are delayed if there is an in-progress transition. I implemented this using an Angular service:

    {% highlight js %}
    angular.module('myApp').service('callbackService', function () {
      var animating = 0;
      var callbacks = null;
		
      this.beginAnimation = function() {
        if ( animating === 0 ) callbacks = [];
        animating++;
      };

      this.endAnimation = function() {
        animating--;
        if ( animating === 0 ) {
          // Call all the stored callbacks
          callbacks.forEach(function(callback) { callback(); });
        }
      };

      this.call = function(callback) {
        if ( animating ) {
          // Store the callback function for later
          callbacks.push(callback);
        } else {
          // Invoke the callback function immediately
          callback();
        }
      };
    });
{% endhighlight %}

`callbackService` is injected into the animation class, which calls `beginAnimation` and `endAnimation` when the transition starts and finishes respectively.

The `dataService` class also gets `callbackService` injected, and uses it to wrap callbacks from `$http` requests, like this:

    {% highlight js %}
    angular.module('myApp')
              .service('dataService', function ($http, callbackService) {

      // Service method to get a card's details
      this.getDetails(id, callbackFn) {
        // Make the Ajax request
        $http.get('/dataUrl').success(function(data) {
          // Guard the callback so it can't happen during a transition
          callbackService.call(function() {
            // Invoke the callback function with the data
            callbackFn(data);
          });
        });
      };

    });
{% endhighlight %}

### Conclusion

The optimisations I've tried have noticeably improved the User Experience on high performance devices like the Nexus 5, which has fewer dropped animation frames and feels smoother and more responsive. More importantly, it has made a dramatic improvement on the lower end devices. Where the transition was previously slow and jerky, it is now a simple slide-left with nothing else competing for CPU time.   

As a developer, it's easy to focus on high-end devices like iPhones and premium Android handsets, but providing a good user experience for all Android users requires a little optimisation and lots of testing.























