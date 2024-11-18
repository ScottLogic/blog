---
title: Cross-platform mobile with Cordova and Ionic Framework
date: 2014-10-27 00:00:00 Z
categories:
- Tech
author: alee
summary: Using Cordova and Ionic Framework to turn an AngularJS web application into a cross-platform mobile application.
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/10/27/xplatform-mobile-cordova-ionic.html
disqus-id: "/2014/10/27/xplatform-mobile-cordova-ionic.html"
---

Using [Cordova](http://cordova.apache.org/) and [Ionic Framework](http://ionicframework.com/) to turn  an AngularJS web application into a cross-platform mobile application.

This year our summer interns worked on an internal project to build a mobile application. They used Cordova to deploy the cross-platform HTML5 app onto multiple phone platforms, including iPhone and Android. The results looked really good, and inspired me to try making a cross-platform app out of my Angular SPA (Single Page Application) from my [earlier blog post]({{ site.baseurl }}/2014/07/30/spa-angular-knockout.html).

### Setting up Cordova

[Cordova's installation guide](http://cordova.apache.org/docs/en/3.6.0/guide_cli_index.md.html#The%20Command-Line%20Interface) is detailed and easy to follow, so I won't try to reproduce that here.  

Cordova uses the SDKs for each platform that you wish to target. Building an iPhone version requires an Apple Mac, which I don't have unfortunately, but a Windows Phone and Android versions can be built in Windows using Microsoft's SDK. I installed the [Android SDK](https://developer.android.com/sdk/index.html?hl=i), which Cordova uses to build an Android package that can be deployed to a phone.      

With the SDK installed, I used a simple `npm` command to install Cordova:

	npm install -g cordova

I then created a Cordova project in my solution and added Android as a target platform:

	cordova create phone com.scottlogic.AngularSampleSPA AngularSPA
	cd phone
	cordova platform add android

With everything set up, Cordova can build the project, which creates an Android package (the `.apk` file that I can simply email to my phone to install it):

	cordova build

Or deploy it directly to a handset that is connected to the PC:

	cordova run android

Testing with an emulator requires that you first setup a target device using the Android Virtual Device (AVD) Manager from the SDK. Then it's as simple as the command:

	cordova emulate android

At this point I had a functioning Android application, but it just showed the Cordova "ready" page.

<img src="{{ site.baseurl }}/alee/assets/x-platform-ionic/vanilla-cordova.png"/>


### Porting the web application

My Angular SPA uses Gulp to bundle and minify the application in the `dist` folder. What if I just copied that into the content folder of my Cordova application? It can't be that simple can it?

I decided to make a simple batch file that could build the Angular SPA, copy it over to the Cordova project, then build that too:

	REM Create the distribution
	cd AngularFrontEnd
	call gulp
	cd ..

	REM Replace the Phone web folder
	RD /S /Q "Phone/www"
	XCOPY "AngularFrontEnd\dist" "Phone/www" /E /C /I /K

	REM Build the phone apps
	cd Phone
	cordova build

Running that on the emulator looked like this:

<img src="{{ site.baseurl }}/alee/assets/x-platform-ionic/bootstrap-version.png"/>

It really was that simple! The application works as expected - clicking the rows in the table takes it to the view of the selected investment, and entering a search term will filter the list and update the charts.

When I replaced Cordova's scaffolded html page, I lost the reference to Cordova's APIs for accessing the phone's hardware (like the camera etc.). I'm not using any of that stuff though, so the App can run without it.  

### Redesigning for Mobile

My Angular SPA application uses Bootstrap to control the layout, which automatically adapts to different screen sizes. On a phone-sized screen, the two charts move down below the table and the title bar changes to show a pull-down menu. This makes the application usable on a phone, but it doesn't feel much like a mobile application.

I could improve the mobile experience by doing some more size-specific changes. For example, use the `hidden-xs` class to hide elements that don't need to be displayed on small screens. The result might be a good enough experience for mobile visitors to the website, but users expect more from installable phone apps.

### Mobile view with Ionic Framework

[AngularJS](https://angularjs.org/) uses a MVW ([Model-View-Whatever](https://plus.google.com/+AngularJS/posts/aZNVhj355G2)) pattern, so in theory we should be able to swap out the "View" part with a new View that is optimised for mobile.

[Ionic](http://ionicframework.com/) is a great framework for building mobile applications, providing lots of visual elements and behaviours that users have come to expect from native mobile apps. Ionic also happens to be based on AngularJS, so can we build a mobile-specific view using Ionic, without affecting the desktop-specific view that uses Bootstrap? 

I started by creating a mobile version of my index page: `index-mobile.html`. It imports `ionic-bundle.js` (Ionic bundled with Angular) instead of the bootstrap and angular libraries, and it references a different version of the css (`mobile.css`, which is the output of the `mobile.scss` [Sass](http://sass-lang.com/) file that includes both the Ionic and application styles). The view container is a bit different too, as it uses Ionic directives:

    <ion-pane>
      <ion-nav-bar class="bar-dark" ng-controller="RouteCtrl">
        <ion-nav-back-button class="button-clear" ng-click="goBack()">
          <i class="ion-chevron-left"></i>
        </ion-nav-back-button>
      </ion-nav-bar>

      <ion-nav-view animation="slide-left-right">
      </ion-nav-view>
    </ion-pane>

Both index pages use the same set of javascript files (the "Model" and "Whatever" parts are common), but when we initialise the Angular application we need slightly different module dependencies. In `app.js`, I configured the modules like this:

    {% highlight js %}
    // Set the path to the partial pages, depending on whether we're using Ionic
    angularSPA = {
      partialsPath: window.ionic ? 'partials-mobile/' : 'partials/'
    };

    angular.module('testSPA', [
      window.ionic ? 'ionic' : 'ui.bootstrap',
      'ui.router',
      'testSPA.filters',
      'testSPA.services',
      'testSPA.directives',
      'testSPA.controllers',
      'testSPA.navBar',
      'testSPA.investmentsComponent',
      'testSPA.sectorComponent',
      'testSPA.transactionsComponent',
      'testSPA.investmentFilter',
      'testSPA.investmentPage'
    ])
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('home', { url: '', controller: 'HomeCtrl',
            templateUrl: angularSPA.partialsPath + 'home-page.html' })
        .state('about', { url: '/about', controller: 'AboutCtrl',
            templateUrl: angularSPA.partialsPath + 'about-page.html' })
        .state('investment', { url: '/investment/:id',
            controller: 'InvestmentPageCtrl', templateUrl:
                angularSPA.partialsPath + 'investment-page.html' });
    }]);
{% endhighlight %}

The first line tells the application where to find the partial pages (if `windows.ionic` is set, we use `partials-mobile`). For the Ionic version, we also create a dependency on `ionic` instead of on `ui.bootstrap`.

Note that the application originally used Angular's `$routeProvider`, but I had to change it to the newer `$stateProvider` (which Ionic uses). 

I also needed to create mobile-specific versions of the partial pages. As an example, here's what `investments-component.html` looks like with Ionic (the Bootstrap version is a table):

	<ion-list>
      <ion-item class="item-text-wrap investment-item"
           ng-repeat="investment in investments" ng-click="showInvestment()"
           ng-class="investment.returnOnInvestment < 0 ? 'down' : 'up'">
        <span class="name">{{investment.name}}</span>
        <span class="amount">{{investment.investedAmount | customCurrency}}</span>
        <span class="percent">{{investment.returnOnInvestment | percent}}</span>
      </ion-item>
	</ion-list>
 
The only other part of the application that needed special attention was the `investment-filter.js` component. In the mobile version, I wanted a search icon in the header bar that opens an Ionic "popover" window. To do that I needed to inject the `$ionicPopover` service, but of course that service doesn't exist in the desktop version. The controller needs to check whether Ionic exists, and only inject the service if it does. Everything else in the application works without modification.

The Ionic-powered mobile application looks like this:  

<img src="{{ site.baseurl }}/alee/assets/x-platform-ionic/ionic-version.png"/>


The 'home' page no longer has all three components displayed at the same time, but uses Ionic's tabbed view to show them one at a time. Clicking the search icon raises a pop-over window with a search box. Clicking one of the investments initiates a slide-left animation to show the investment details with a back button. The Ionic version looks and feels much more like a native mobile application. 

### Summary

Deploying a Single Page Application as a cross-platform app using Cordova turned out to be extremely easy. Most of the time was spent downloading the Android SDK.

I wanted to improve the mobile experience though, so that meant putting in the extra effort to develop a new mobile-centric View. Ionic's use of Angular made that relatively easy. It does mean more code to develop and maintain in addition to the original application, but most of the code is shared.

I think this is a good approach to building a mobile version of a desktop SPA, but only if the mobile version needs to do the same things as the desktop version. After all, there are limits to what you can do simply by replacing the View in a Model-View-Whatever framework. Often, mobile apps need to do different things - for example, you may not want detailed analyses and reports, but instead have at-a-glance summary screens and quick-response input. Those sort of differences can be coded into the controllers (like I did with the search box pop-over), but at some point you'll need to consider whether it's better to build the mobile version as a separate application.























