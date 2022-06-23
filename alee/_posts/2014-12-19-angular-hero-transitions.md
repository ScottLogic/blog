---
author: alee
title: Hero transitions in AngularJS
tags: null
categories:
  - Tech
summary: >-
  How to create hero transitions with AngularJS, similar to those implemented by
  Google's Material Design and Polymer's core-animated-pages.
layout: default_post
oldlink: 'http://www.scottlogic.com/blog/2014/12/19/angular-hero-transitions.html'
disqus-id: /2014/12/19/angular-hero-transitions.html
---


*How to create hero transitions with [AngularJS](https://angularjs.org/), similar to those implemented by Google's Material Design and Polymer's [core-animated-pages](https://github.com/Polymer/core-animated-pages).*

In <a href="{{ site.baseurl }}/2014/12/12/html5-android-optimisation.html">my last post</a> I learned a lot about optimising animated transitions for mobile devices. New screens would slide in from the right, while elements that were common between the two screens would animate from their old position to the new position. In that case, it was the header of a card in a list view, which animated to the header of the page on the next screen. The code for animating the elements was very specific to that project though, so I thought I'd try to build a re-usable component for generic hero transitions, with minimal dependencies (other than Angular).

I've also build a simple sample application, which you can try here: <a href="{{ site.baseurl }}/alee/assets/angular-hero/app" target="_blank">Angular-Hero-Sample</a>.

<a href="{{ site.baseurl }}/alee/assets/angular-hero/angular-hero-sample.gif" target="_blank" style="display: block; text-align: center">
  <img src="{{ site.baseurl }}/alee/assets/angular-hero/angular-hero-sample.gif" style="max-width: 300px;"/>
</a>

The code for this sample application is available on [GitHub](https://github.com/DevAndyLee/Angular-Hero-Sample).

### How to use in your application

The component is hosted at [Angular-Hero](https://github.com/DevAndyLee/Angular-Hero), and can be installed into your application using [bower](http://bower.io/) like this:

    bower install angular-hero --save

To use the hero transitions, include `alAngularHero` as a dependency in your Angular app.

    {% highlight js %}
    angular.module('app', ['alAngularHero'])
{% endhighlight %}

Include the supplied CSS file or add the `.hero-animating` style to your own.

Declare the page transitions to use on the `ng-view` element, including `hero-transition`:

    {% highlight html %}
    <div ng-view="" class="page-transition hero-transition"></div>
{% endhighlight %}

Identify hero elements with the `hero` class and `hero-id` attribute:

    {% highlight html %}
    <div class="name hero" hero-id="name">{{"{{"}}contact.name}}</div>
{% endhighlight %}

The `hero-id` attribute should be the same on both pages to trigger a hero animation from one to the other.

Note that for the element styles to animate correctly, hero elements should be styled by a directly applied class.
For example, styling the contact name in the above example with this CSS won't work:

    {% highlight css %}
    .screen1 .name { color: red; }
{% endhighlight %}

The hero element is moved out of `.screen1` during the animation, so will lose its colour.
Instead, add a class to the element and style directly. e.g.

    {% highlight css %}
    .screen1-name { color: red; }
{% endhighlight %}

This also means that CSS styles will be animated during the transition.
For example, if the target element is blue, then you'll get an animated transition from red to blue.
You can also animate other styles in the same way, such as corner-radius and borders etc...

### Screen transitions with AngularJS

AngularJS has great support for animations, with good [documentation](https://docs.angularjs.org/guide/animations).

In my example, I've used one class for the page-level transition (`page-transition`), and a separate one for the hero transitions (`hero-transition`, which is defined by the component).
I used a CSS animation to implement a basic cross-fade transition between pages like this:

    {% highlight css %}
    .page-transition.ng-enter, .page-transition.ng-leave {
      -webkit-transition: opacity ease-in-out 500ms;
      transition: opacity ease-in-out 500ms;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .page-transition.ng-enter, .page-transition.ng-leave.ng-leave-active {
      opacity: 0;
    }
    .page-transition.ng-enter.ng-enter-active {
      opacity: 1;
    }
{% endhighlight %}

Angular applies the `ng-enter` class to set things up, then `ng-enter-active` to begin the transition, so in the above example we get the `opacity` animating from 0 to 1.

I also added extra details like scaling or sliding in blocks of text. For example, the second page has some text that zooms in from the background using a scale transform like this:

    {% highlight css %}
    .page-transition.ng-enter .screen2 p {
      -webkit-transition: transform ease-in-out 300ms;
      transition: transform ease-in-out 300ms;

      -webkit-transform: scale(0.6);
      transform: scale(0.6);
    }
    .page-transition.ng-enter.ng-enter-active .screen2 p {
      -webkit-transition-delay: 200ms;
      transition-delay: 200ms;

      -webkit-transform: none;
      transform: none;
    }
{% endhighlight %}

### How the Hero transition works

To perform a Hero transition, we actually want to animate an element on one screen to a new position in a different screen. From Angular's point of view these are two unrelated elements in the DOM, so there is no way to accomplish that with a CSS-based animation.

I implemented a Javascript-based animation instead. AngularJS calls the `enter()` method for the incoming screen, and `leave()` for the outgoing screen. The Hero transition needs both screens, so it waits for both methods to be called, then looks for matching Hero elements on the two screens.

Hero elements need to have the CSS class `hero`, and also an identifying attribute `hero-id="someId"`. The ID needs to be the same on both screens so that the two elements can be matched up.

On the first screen, we don't actually know which elements are going to be the Heros until the user clicks on a card. In this case, the CSS class is set dynamically using the `ng-class` directive:

    {% highlight html %}
    <div ng-class="clickedIndex === contact.id ? 'name hero' : 'name'"
       hero-id="name">{{"{{"}}contact.name}}</div>
{% endhighlight %}

### Animating the elements

We don't want to mess around with the existing elements in the DOM - they've most likely been created by Angular, and Angular will need to keep control of them to maintain its bindings.

Instead, `hero-transition` will temporarily make those elements invisible, clone the one from the outgoing screen, and absolutely position it so it appears to be in the same place. It will then apply the `.hero-animating` class, which controls the transition, and move the element to its new position on the incoming screen.

At the same time, the clone's CSS classes are also swapped over. That lets us animate other properties such as colour, border and corner styles. For example, if I have a hero element with the class `.screen1-name` moving to one with the class `.screen2-name`, any CSS styles that can be animated will be. My sample application demonstrates this process by animating background colour, corner radius and border thickness.

Finally, the `transitionend` events fire for all the Hero elements, and `hero-transition` will call the `done` callbacks from the animation's `enter()` and `leave()` methods, letting Angular know we've finished.

### Conclusion

While I've been building the `angular-hero` component, I've learned a lot about CSS transitions generally and Angular animations in particular. It's surprisingly easy to do and can help build an engaging user experience.

Hopefully you can find a use for it too. Hero transitions in Angular are easy with `angular-hero`.
