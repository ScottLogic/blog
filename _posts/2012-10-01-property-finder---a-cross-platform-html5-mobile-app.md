---
title: Property Finder - a Cross-Platform HTML5 Mobile App
date: 2012-10-01 00:00:00 Z
categories:
- Tech
tags:
- html5
author: ceberhardt
layout: default_post
source: codeproject
summary: Describes the development of a cross-platform HTML5 mobile app for searching UK property listings, using Knockout, jQuery Mobile, and Apache Cordova (PhoneGap). The article covers MVVM architecture in JavaScript, PhoneGap Build for iOS deployment without a Mac, and a critical look at the resulting user experience.
---

*This article was originally published on CodeProject, which has since shut down.*

- or [download / fork on github](https://github.com/ColinEberhardt/PropertyFinder-HTML5).

## Index

- [Overview](#ov)
- [Introduction](#int)
- [Tools and Frameworks](#tool)
- [Development process](#dev)
- [JavaScript Patterns](#java)
- [Application Structure Overview](#app)
- [The Model Layer](#model)
- [The ViewModel Layer](#viewmodel)

- ApplicationViewModel
- App.js
- PropertySearchViewModel
- LocationViewModel and GeoLocationViewModel
- SearchResultsViewModel
- State Persistence

- [Property Finder iOS](#ios)

- Borrowing from jQuery Mobile
- Scrolling with iScroll
- The Project Structure and Build

- [A Critical Look at the UX](#ux)

- Windows Phone
- iPhone

- [Conclusions](#conc)

![wpAndios]({{ site.baseurl }}/ceberhardt/assets/codeproject/wpAndios.jpg)

## Overview

This article describes the development of a cross-platform HTML5 mobile app for searching UK property listings. The application uses JavaScript, Knockout, some elements from jQuery-Mobile and Apache Cordova (PhoneGap) for wrapping the application in order to deploy it to App-stores / marketplaces. I’ll also demonstrate how to use PhoneGap Build to create the iOS version of the application without the need for a Mac computer. The application makes use of the publically available [Nestoria APIs](http://www.nestoria.co.uk/help/api) which provide various methods for querying their database of properties for sale and rent.

Here is a video of the iOS and Windows Phone applications in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/5vJmz89Mbo4" frameborder="0" allowfullscreen></iframe>

This article will look at the technical details of how this application was written and the overall user-experience that this it delivers. The conclusions show that through the use of HTML5 it was possible to share quite a lot of common code between the two mobile platforms, however, the use of HTML5 did result in a few user experience compromises.

## Introduction

There has been a growing trend in the use of HTML5 for development of cross-platform mobile applications. This technology allows a developer to write an application using platform-neutral web technologies that can be delivered to a broad range of smartphone devices. This capitalises on modern smartphones generally having highly capable browsers, with good support for HTML5 / CSS3 features.

This article uses Apache Cordova (previously called [PhoneGap](http://phonegap.com/)), an open source framework, that provides a mechanism for packaging HTML5 content (HTML, JavaScript, CSS, images) as a native executable for Windows Phone, iOS, BlackBerry and Android. Cordova also provides a JavaScript interface for native phone functionality that is not accessible using HTML5 technologies (e.g. camera, accelerometer, compass).

I recently wrote an article for the [Microsoft MSDN magazine](http://msdn.microsoft.com/en-us/magazine/hh975345.aspx) which walked through the basic steps involved in creating a Cordova application for Windows Phone. The application described within the magazine article was rather simple. In this article I want to describe a more complex application “Property Finder”, which I [released to the Windows Phone marketplace last year](http://www.scottlogic.co.uk/blog/colin/2011/11/property-finder-the-first-html5-based-windows-phone-7-application/). Since then, I have used this codebase to create an iOS version of the same application, which I also describe in this article.

![PropertyFinder]({{ site.baseurl }}/ceberhardt/assets/codeproject/PropertyFinder.jpg)

You can [download Property Finder for Windows Phone via the marketplace](http://www.windowsphone.com/en-GB/apps/0349adf6-d6b3-404f-84ea-63ef97c12b79).

If you are totally new to Apache Cordova you might want to [read my MSDN article first](http://msdn.microsoft.com/en-us/magazine/hh975345.aspx). Likewise, if you are new to Knockout, which is a rather funky JavaScript MVVM framework, you might want to read my previous codeproject article which [contrasts Knockout and Silverlight](http://www.codeproject.com/Articles/365120/KnockoutJS-vs-Silverlight). I have written on a number of topics relating to Windows Phone and Cordova in the past, so much of this article is light on details, with references to blog posts and other sources of information throughout.

In this article I’ll assume knowledge of JavaScript, Cordova and Knockout and concentrate on the application itself!

## Tools and Frameworks

I’ll give a very brief summary of the tools and frameworks I have used to develop this application:

**JavaScript** – OK, this is a pretty obvious one, it’s an HTML5 app so it is written using JavaScript, duh! However, JavaScript is very rarely used on its own; there are a plethora of frameworks and tools for you to choose from. What follows are the frameworks I selected for this particular application.

**Knockout** – this is an MVVM framework for JavaScript. It allows you to create view-models that bind to your UI, with the binding framework marshalling changes of state between the two.

**jQuery** – the de facto framework for JavaScript development! Within this project I use jQuery quite sparingly with Knockout removing most of the need for accessing the DOM directly. I use jQuery for the occasional selector to locate an element in the DOM and for the [each()](http://api.jquery.com/each/) convenience function which I use extensively.

**jQuery-JSONP** – The standard jQuery-JSONP functionality lacks a mechanism for specifying a timeout. The [jQuery-JSONP plugin](https://github.com/jaubourg/jquery-jsonp) is a compact and feature rich alternative that provides this much needed functionality.

**Apache Cordova** – this is a framework for packaging HTML5-based applications within a native shell. This allows you to distribute HTML5 applications as though they were native. Cordova also provides a common set of APIs for using the phones hardware functions such as location, persistence etc …

**JSLint** – JavaScript is a very forgiving language … too forgiving! Language features such as globals and semi-colon insertion make it very easy to write sloppy JavaScript code. [JSLint](http://www.jslint.com/) imposes a set of rules that ensure your JavaScript is more consistent, readable and error free. If you are writing anything more than the most trivial piece of JavaScript code, I would recommend linting it! There is a [Visual Studio 2010 extension that provides JSLint](http://visualstudiogallery.msdn.microsoft.com/961e6734-cd3a-4afb-a121-4541742b912e) support which I would recommend using.

**JavaScript Intellisense** – To be honest Visual Studio is not the best tool for authoring JavaScript, personally I think Eclipse has the edge. However, developing in Visual Studio does allow you to quickly build and deploy the Windows Phone version of the code. Visual Studio provides JavaScript Intellisense via pseudo-execution of your code, this is needed because JavaScript is dynamic, so the IDE cannot comprehend your code by static analysis alone. In order to use this effectively you need to ensure that the IDE can discover all of your files. For this reason I have the following file in my project which informs Visual Studio of all the JavaScript files in my project which I would like to include in Intellisense:

```
/// Ensure that all the files listed below are included, so that VS provides
/// Intellisense
///
/// <reference path="namespaces.js" />
/// <reference path="model//JSONDataSource.js" />
/// <reference path="model//Location.js" />
/// <reference path="model//Property.js" />
/// <reference path="model//PropertyDataSource.js" />
/// <reference path="viewModel//AboutViewModel.js" />
/// <reference path="viewModel//ApplicationViewModel.js" />
/// <reference path="viewModel//FavouritesViewModel.js" />
/// <reference path="viewModel//GeolocationViewModel.js" />
/// <reference path="viewModel//LocationViewModel.js" />
/// <reference path="viewModel//PropertySearchViewModel.js" />
/// <reference path="viewModel//PropertyViewModel.js" />
/// <reference path="viewModel//SearchResultsViewModel.js" />
/// <reference path="lib//knockout-2.1.0.js" />
```

All JavaScript files reference the above ‘contents’ file as follows:   
  

```
/// <reference path="..//intellisense.js" />
```

**Firefox and Firebug** – You can develop Cordova apps using the Windows Phone emulator, however the startup times and poor JavaScript instrumentation make this a very painful process! Because the core of your application will be plain-old JavaScript it is possible to run it within a desktop browser. My preference has been Firefox with the Firebug plugin for a long time, however more recently I have started using the Chrome development tools. One thing’s for sure, they both beat the IE tools hands-down!  
  
NOTE: This application and the article were written against Cordova 1.9. The current release is 2.0, however, there are a few Windows Phone bugs in the most recent release that cannot be worked around.   
  

## The Development Process

When developing a Cordova app, you can add your HTML, JavaScript and CSS files to the www folder, and as long as you mark them with a Build Action of Content they will be included into your project and accessible via the browser control when your application executes.   
  
The Cordova APIs are [documented on the PhoneGap website](http://docs.phonegap.com/en/2.0.0/index.html), I will not describe them in detail here. One important thing to note is that you must wait for the deviceready event before making use of any of the other API methods. If you inspect the index.html file generated from the Visual Studio Cordova Application Template you can see that it waits until the device is ready before updating the UI:  
  

```
<script type="text/javascript">

  document.addEventListener("deviceready",onDeviceReady,false);

  // once the device ready event fires, you can safely do your thing! -jm
  function onDeviceReady()
  {
      document.getElementById("welcomeMsg").innerHTML += "PhoneGap is ready! version=" + window.device.phonegap;
      console.log("onDeviceReady. You should see this message in Visual Studio's output window.");

  }
</script>
```

You can develop your applications by making changes to your HTML / JavaScript, compiling and deploying to the emulator or device, however there is a quicker way. As your Cordova application is simply a HTML / JavaScript application you can run it in a desktop browser directly. However, you have to provide mock implementations of any Cordova APIs you use. For example, to run the application created by the Visual Studio template, you can mock the ‘device’ object that Cordova adds to ‘window’ then invoke onDeviceReady:   
  
  
  
![firebug]({{ site.baseurl }}/ceberhardt/assets/codeproject/firebug.jpg)

  
  
  
You will often find yourself using a small subset of the Cordova APIs, so desktop browser-based testing becomes a viable and rapid-turnaround option. For the Property Finder application I describe later, the vast majority of the development was done against FireFox and FireBug.  
  
 If you download the Property Finder source code and view the index.html file in your browser you will find that the application starts immediately. This is thanks to the following little piece of JavaScript:   
  

```jscript
$(document).ready(function () {
  if (window.device) {
    document.addEventListener("deviceready", initializeViewModel, false);
  } else {
    // if there is no 'device' immediately create the view mdoels.
    initializeViewModel();
  }
});
```

If the Cordova created window.device is not present, then the code is being run from a desktop browser, so we immediately create the view models and start the application. Otherwise, we wait for the deviceready event, then start the app.   
  

## JavaScript Patterns

Before delving into the details of the application itself, I want to say a thing or two about JavaScript design patterns I have used.   
  

### Knockout View Models

With Knockout examples you will often see a couple of different methods for creating view models, the first is the use of object literals:  
  

```jscript
var viewModel = {
    firstname : ko.observable("Bob")
};

ko.applyBindings(viewModel );
```

And the second is to define a constructor function for your view model, invoking this function with the new operator to create an instance:   
  

```jscript
var ViewModel = function() {
    this.firstname = ko.observable("Bob");
};

ko.applyBindings(new ViewModel ());
```

My preference is the second, because it allows you to create multiple instances of the same ‘type’ of view models.   
  

### Namespacing

JavaScript does not have a built-in mechanism for namespacing or packaging. As an alternative, objects can be used to organise code into namespaces. Within the Property Finder application I define three objects which act as namespaces:   
var View = View || {};  

```jscript
var Model = Model || {};
var ViewModel = ViewModel || {};
```

The logical OR operator used above is equivalent to the C# null coalesce operator (??).  
  
The view model constructor functions are then defined as properties of these objects:   
  

```jscript
ViewModel.PropertyViewModel = function () {
  // ...view model code goes here
}
```

These constructor functions are then accessed via their ‘namespace’:  
  

```jscript
var viewModel = new ViewModel.PropertyViewModel();
```

### Object Oriented JavaScript

With C# object-oriented constructs such as ‘class’ and ‘interface’ are first-class features of the language. JavaScript is a simpler, more flexible language that lacks these constructs. This does not mean that JavaScript cannot be used to write object-oriented applications.  
  
  
  
You can certainly write object-oriented application with JavaScript, however, you have choices to make. There are a number of different patterns that you can employ to define your classes, their methods and variables. It is worth noting that there isn’t really a good pattern for JavaScript interfaces, however, objects that define the same functions (i.e. methods) can be interchanged, so interfaces become un-necessary.  
  
There are a couple of popular patterns for defining classes. The first uses protoypes:  
  

```jscript
function Book(title) {
    this.title = title;
}

Book.prototype.getTitle = function () {
    return this.title;
};

var myBook = new Book('War and Peace');
alert(myBook.getTitle()); // outputs 'War and Peace'
```

In the above example we define the constructor function and the title variable. We then add a method (a method is a function which is associated with an object), via the prototype. A prototype is an object from which an object inherits properties. In the above example, adding the function to the Book prototype will ensure that it is accessible to any instance of the Book object.  
  
 The use of protoypes for defining the methods of an object is a popular JavaScript pattern for object oriented programming. However, it does not allow information hiding, i.e. private methods and variables.

An alternative approach to defining the same Book class is as follows:

```jscript
function Book(title) {
    this.title = title;

    this.getTitle = function () {
        return this.title;
    };
}

var myBook = new Book('War and Peace');
alert(myBook.getTitle()); // outputs 'War and Peace'
```

Here the `getTitle`method is added to the Book object within the constructor function rather than via the prototype.  
  
One advantage of this approach is that it allows information via closures because the `getTitle`function will have access to all of the variables defined within the constructor function even after it has returned.

The following is a trivial example of how closures can be used to create private variables and methods (although strictly speaking in this context they are actually functions!):

```jscript
function Book(title) {

  // this variable is private
  var count = 0;

  // this method is private
  function incrementCount() {
    count++;
  }

  this.title = title;

  this.getTitle = function () {
    incrementCount();
    return this.title + " : " + count;
  };
}

var myBook = new Book('War and Peace');
alert(myBook.getTitle()); // outputs 'War and Peace : 1'
alert(myBook.getTitle()); // outputs 'War and Peace : 2'
```

Douglas Crockford describes this pattern in [much more detail on his website](http://javascript.crockford.com/private.html).

Whilst it adds information-hiding, this pattern is a little more heavyweight. The prototype pattern has been shown to be [faster and require less memory](http://blogs.msdn.com/b/kristoffer/archive/2007/02/13/javascript-prototype-versus-closure-execution-speed.aspx), which is why the prototype pattern is quite widely used.

With Property Finder I used the ‘closures’ approach due to personal preference more than anything else. I find it easier to read and memory usage and performance were not a great concern for this application.

## Application Structure Overview

The Property Finder application is divided into two distinct layers; the ‘Model’ layer which is responsible for querying Nestoria APIs, analysing the response and returning data in the form of ‘model’ objects, and the ‘View Model’ layer which is responsible for the overall application logic, including navigation, state persistence and responding to the user input.

The following diagram provides an overview of the general application structure. There has been a certain amount of interpretation involved in creating this diagram – interfaces are used where two different classes are interchangeable and used for the same purpose:

![model]({{ site.baseurl }}/ceberhardt/assets/codeproject/model.jpg)

Let’s dive into the details of each layer …

### The Model Layer

From the model layer, `PropertyDataSource` provides the rest of the application with an interface for querying the Nestoria APIs. This is exposed via a couple of simple methods, one which queries via a plain-text search string (e.g. “London”), and one via geolocation (latitude and longitude). Internally, this class makes use of `JSONDataSource`, which encapsulates the logic to perform the actual web requests, the source of which is shown below:

```jscript
/// <reference path="..//intellisense.js" />

/*global $, Model */

Model.JSONDataSource = function () {
  /// <summary>
  /// A service that allows property searches, returning the results in JSON format. This service
  /// uses the Nestoria APIs.
  /// </summary>

  // ----- private functions

  function ajaxRequest(uri, params, callback, errorCallback) {
    /// <summary>
    /// Performs a JSON request via the jQuery-JSONP library
    /// http://code.google.com/p/jquery-jsonp/
    /// </summary>
    $.jsonp({
      dataType: "jsonp",
      data: params,
      url: uri,
      timeout: 5000,
      success: function (result) {
        callback(result);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        errorCallback("datasource error [" + textStatus + "] [" + errorThrown + "]");
      }
    });
  }

  // ----- public functions

  this.findProperties = function (location, pageNumber, callback, errorCallback) {
    /// <summary>
    /// Finds properties based on a location string
    /// </summary>
    var query = "http://api.nestoria.co.uk/api",
        params = {
          country: "uk",
          pretty: "1",
          action: "search_listings",
          encoding: "json",
          listing_type: "buy",
          page: pageNumber,
          place_name: location,
          callback: "_jqjsp"
        };

    ajaxRequest(query, params, callback, errorCallback);
  };

  this.findPropertiesByCoordinate = function (latitude, longitude, pageNumber, callback, errorCallback) {
    /// <summary>
    /// Finds properties based on lat / long values
    /// </summary>
    var query = "http://api.nestoria.co.uk/api",
        params = {
          country: "uk",
          pretty: "1",
          action: "search_listings",
          encoding: "json",
          listing_type: "buy",
          page: pageNumber,
          centre_point: latitude + "," + longitude,
          callback: "_jqjsp"
        };

    ajaxRequest(query, params, callback, errorCallback);
  };
};
```

The above code makes use of the jQuery-JSONP plugin in order to be able to specify a timeout for the query. As an aside, if you are not sure what the difference is between JSON and JSONP, and why we need to use JSONP in this instance, take a look at this [StackOverflow answer for a good overview](http://stackoverflow.com/questions/2067472/please-explain-jsonp).

Separating the code that makes the request to the Nestoria APIs from the code which parses the response allows us to easily inject test data. The class above can be substituted for the following, which waits 1 second before returning a ‘canned’ response:

```jscript
/// <reference path="..//intellisense.js" />

/*global $, Model, setTimeout */

Model.JSONFileDataSource = function () {
  /// <summary>
  /// A test version of JSONDataSource, which returns 'canned' responses.
  /// </summary>

  this.findProperties = function (location, pageNumber, callback) {
    function fetchData() {
      $.ajax({
        dataType: "json",
        url: location.trim() === "" ? "model/AmbiguousSearchResults.json" : "model/SearchResults.json",
        success: function (result) {
          callback(result);
        }
      });
    }
    setTimeout(fetchData, 1000);
  };
};
```

This is very useful for testing against web services, where you do not have any direct control over the returned response. As you can see, the above code returns a couple of different types of response in order to allow for more thorough testing.

The `ProperyDataSource` class takes the JSON response provided by `JSONDataSource`, and parses into a format which is more suitable for the Property Finder application. It also handles the various response codes and returning a suitable response:

```jscript
/// <reference path="..//intellisense.js" />

/*global $, Property, Location, setTimeout, Model */

Model.PropertySearchResponseCode =
  {
    propertiesFound : 1,
    ambiguousLocation : 2,
    unknownLocation : 3
  };

Model.PropertyDataSource = function (config) {
  /// <summary>
  /// A service that allows property searches, returning the results as JavaScript objects. This class
  /// wraps a JSON datasource to create a more structured response that is de-coupled from the specifics
  /// of the Nestoria APIs.
  /// </summary>

  // ----- private variables

  // A source of JSON data.
  var jsonDataSource = config.dataSource;

  // ----- private functions

  function parseResponse(result) {
    /// <summary>
    /// Parses the JSON response into an array of Property instances or
    /// Location instances.
    /// </summary>
    var properties = [],
    locations = [],
    responseCode = result.response.application_response_code,
    property, location, response;

    if (responseCode === "100" || /* one unambiguous location */
        responseCode === "101" || /* best guess location */
        responseCode === "110" /* large location, 1000 matches max */) {

      $.each(result.response.listings, function (index, value) {
        property = new Model.Property({
          guid: value.guid,
          title: value.title,
          price: value.price_formatted.substr(0, value.price_formatted.lastIndexOf(" ")),
          bedrooms: value.bedroom_number,
          bathrooms: value.bathroom_number,
          propertyType: value.property_type,
          thumbnailUrl: value.img_url,
          summary: value.summary
        });
        properties.push(property);
      });

      response = new Model.PropertyDataSourceResponse({
        responseCode: Model.PropertySearchResponseCode.propertiesFound,
        data: properties,
        totalResults: result.response.total_results,
        pageNumber: result.response.page
      });

    } else if (responseCode === "200" || /* ambiguous location */
                responseCode === "202"/* mis-spelled location */) {

      $.each(result.response.locations, function (index, value) {
        location = new Model.Location({
          longTitle: value.long_title,
          placeName: value.place_name,
          title: value.title
        });
        locations.push(location);
      });

      response = new Model.PropertyDataSourceResponse({
        responseCode: Model.PropertySearchResponseCode.ambiguousLocation,
        data: locations
      });

    } else {
      /*
      201 - unkown location
      210 - coordinate error
      */
      response = new Model.PropertyDataSourceResponse({
        responseCode: Model.PropertySearchResponseCode.unknownLocation
      });
    }

    return response;
  }

  // ----- public functions

  this.findProperties = function (location, pageNumber, callback, errorCallback) {
    jsonDataSource.findProperties(location, pageNumber, function (results) {
      callback(parseResponse(results));
    }, errorCallback);
  };

  this.findPropertiesByCoordinate = function (latitude, longitude, pageNumber, callback, errorCallback) {
    jsonDataSource.findPropertiesByCoordinate(latitude, longitude, pageNumber, function (results) {
      callback(parseResponse(results));
    }, errorCallback);
  };
};
```

The various response codes that are handled above are detailed in the [Nestoria API documentation](http://www.nestoria.co.uk/help/api-return-codes).

The code above highlights an interesting design decision that I made; the various model objects returned, Location, `Property`, `PropertyDataSourceResponse`, are all created using a constructor function. Take for example the code which creates a Location:

```jscript
location = new Model.Location({
  longTitle: value.long_title,
  placeName: value.place_name,
  title: value.title
});
```

As these are model objects, they do not have any methods or any kind of functionality beyond being carriers of data. The above code could be modified to create an equivalent object using literal notation:

```jscript
location = {
  longTitle: value.long_title,
  placeName: value.place_name,
  title: value.title
};
```

Using the above, the application would still work just fine. So why have I gone to the effort of creating these model objects? The `Location` object shown below illustrates why:

```jscript
/// <reference path="..//intellisense.js" />

/*global $, Model */

Model.Location = function (config) {
  /// <summary>
  /// A model that represents a location. This is composed of a human readable display string and a
  /// placename, which is the string sent to Nestoria in order to perform a search.
  ///
  /// e.g. longTitle='Albury, Guildford', placename = 'albury_guildford'
  /// </summary>

  // this display name
  this.longTitle = config.longTitle;
  // the query name
  this.placeName = config.placeName;
};
```

The model objects to do not add anything to the functionality of the application, however, they make the code much more readable, providing a place for documentation and a way to specify the ‘shape’ of objects which are being passed around.

Note that the `config` object allows for a more concise and readable construction of the model objects.

Here is a quick example with the use of the `config` constructor:

```jscript
location = new Model.Location({
  longTitle: value.long_title,
  placeName: value.place_name,
  title: value.title
});
```

And the same without:

```jscript
location = new Model.Location();
location.longTitle = value.long_title;
location.placeName = value.place_name;
location.title = value.title;
```

In summary, the model layer is really quite simple, providing a think wrapper on the Nestoria APIs.

## The ViewModel Layer

The Property Finder application uses the same pattern I outlined in my recent [MSDN Magazine Article](http://msdn.microsoft.com/en-us/magazine/hh975345.aspx), so I’ll go light on the details here. The MSDN article uses a much simpler example of a twitter-search application, making it easier

### ApplicationViewModel

The application has a single instance of an `ApplicationViewModel`, which manages the application back-stack. This view model contains an array of view model instances, with the UI being rendered (and data-bound using Knockout) for the top-most view model.

When the back-stack has more than one view model, the Cordova hardware back button event is handled, in order to capture the back button press (which would otherwise exit the application, it is a single Silverlight page after all!) and remove the top-most view model from the stack.

```jscript
/// <reference path="..//intellisense.js" />

/*global $, ViewModel, ko, window, propertySearchViewModel, hydrateObject */

ViewModel.ApplicationViewModel = function () {
  /// <summary>
  /// The view model that manages the view model back-stack
  /// </summary>

  // ----- public fields

  // the back stack that represents the applications current state
  this.viewModelBackStack = ko.observableArray();

  // A boolean dependant observable that is true if this application
  // needs to handle the back button, and false otherwise.
  this.backButtonRequired = ko.computed(function () {
    return this.viewModelBackStack().length > 1;
  }, this);

  // Gets the view model that is top of the back-stack.
  this.currentViewModel = ko.computed (function () {
    return this.viewModelBackStack()[this.viewModelBackStack().length - 1];
  }, this);

  // ----- public functions

  this.navigateTo = function (viewModel) {
    /// <summary>
    /// Navigates to the given view model by placing it on the top of the back-stack.
    /// </summary>
    this.viewModelBackStack.push(viewModel);
  };

  this.back = function () {
    /// <summary>
    /// Navigates backwards.
    /// </summary>
    this.viewModelBackStack.pop();
  };
};
```

### app.js

The Property Finder is structured in a similar manner to the classic Silverlight / WPF MVVM pattern, with folders for view-models, model objects etc …

![projectStructure]({{ site.baseurl }}/ceberhardt/assets/codeproject/projectStructure.png)

The app.js file is the entry-point for the application, creating an instance of the `ApplicationViewModel` and a `PropertySearchViewModel` (the first page of the app), then pushing this view model onto the application back-stack.

```jscript
/// <reference path="..//intellisense.js" />

/*global $, PropertyDataSource, PropertySearchViewModel, Location, PropertyViewModel,
        hydrateObject, ko, Model, ViewModel, window, localStorage, document, console*/

// globals
var application,
  propertySearchViewModel = null,
  propertyDataSource = new Model.PropertyDataSource({
    dataSource: new Model.JSONDataSource()
  });

function onBackButton() {
  application.back();
}

function initializeViewModel() {

  // create the view model
  application = new ViewModel.ApplicationViewModel();

  // subscribe to changes in the current view model, creating
  // the required view
  application.currentViewModel.subscribe(function (viewModel) {
    if (viewModel !== undefined) {
      $("#app").empty();
      $("#" + viewModel.template).tmpl("").appendTo("#app");
      wireUpUI();
      ko.applyBindings(viewModel);

      // disable scrolling if the current content does not require it
      var disableScroll = $(".content").hasClass("noScroll");
      notifyNativeCode("scrollDisabled:" + disableScroll);
    }
  });

  // handle back button
  application.backButtonRequired.subscribe(function (backButtonRequired) {
    if (backButtonRequired) {
      document.addEventListener("backbutton", onBackButton, false);
    } else {
      document.removeEventListener("backbutton", onBackButton, false);
    }
  });

  // create the top-level view model
  propertySearchViewModel = new ViewModel.PropertySearchViewModel();
  application.navigateTo(propertySearchViewModel);
}

$(document).ready(function () {
  if (window.device) {
    document.addEventListener("deviceready", initializeViewModel, false);
  } else {
    // if there is no 'device' immediately create the view mdoels.
    initializeViewModel();
  }
});<span style="white-space: normal; ">
</span>
```

You can see that the above code makes use of the `ApplicationViewModel.backButtonRequired` property, which is a [computed observable](http://knockoutjs.com/documentation/computedObservables.html), which changes state between true / false, depending on whether the application needs to handle the back button.

I like to think of `app.js` as roughly equivalent to the Silverlight Application instance; it handles application and page lifecycle.

### PropertySearchViewModel

The `PropertySearchViewModel` presents the front-page of the application, which gives the user a text field to input their search term. A snippet of this view model is shown below:

```jscript
/// <reference path="..//intellisense.js" />

/*global $, ViewModel, ko, propertyDataSource, Model, navigator, application */

ViewModel.PropertySearchViewModel = function () {
  /// <summary>
  /// The 'top level' property search view model.
  /// </summary>

  // ----- private fields
  var synchroniseSearchStrings = true,
    that = this;

  // ----- framework fields
  this.template = "propertySearchView";

  // ----- public fields
  this.searchDisplayString = ko.observable("");
  this.userMessage = ko.observable();
  this.searchLocation = undefined;
  this.isSearchEnabled = ko.observable(true);

  // ...
}<span style="white-space: normal; ">
</span> <span style="white-space: normal; ">
</span>
```

The template property of each view model is used to identify the names jQuery Template that renders its UI. The template for the `PropertySearchViewModel` is shown below:

```html
<script id="propertySearchView" type="text/x-jquery-tmpl">
  <div class="content noScroll">
    <h2>Property Finder UK</h2>
    <p>Use the form below to search for houses to buy. You can search by place-name,
       postcode, or click 'My location', to search in your current location!</p>

    <div class="searchForm">
        <input type="text" data-bind="value: searchDisplayString,
                                      enable: isSearchEnabled,
                                      valueUpdate:'afterkeydown'"/>
        <button type="submit" data-bind="enable: isSearchEnabled,
                                         click: executeSearch">Go</button>
        <button data-bind="enable: isSearchEnabled,
                           click: searchMyLocation">My location</button>
    </div>

    <div class="loading" data-bind="visible: isSearchEnabled() == false">
      Searching...
    </div>

    <p class="userMessage" data-bind="text:userMessage"/>

    <div data-bind="visible: locations().length > 0">
      <div>Please select a location below:</div>
      <ul class="locationList" data-bind='template: { name: "locationTemplate",
                                        foreach: locations }'/>
    </div>

    <div data-bind="visible: recentSearches().length > 0 && locations().length === 0">
      <div data-bind="visible: isSearchEnabled">
        <div>Recent searches:</div>
        <ul class="locationList" data-bind='template: { name: "locationTemplate",
                                            foreach: recentSearches }'/>
      </div>
    </div>
  </div>

  <div class="appBar">
    <div class="more"><div class="pip"/><div class="pip"/><div class="pip"/></div>
    <div class="icons">
      <div class="icon" data-bind="click: viewFavourites">
        <img src="img/favourites.png"/>
        <div class="iconText">favourites</div>
      </div>
      <div class="icon" data-bind="click: viewAbout">
        <img src="img/about.png"/>
        <div class="iconText">about</div>
      </div>
    </div>
  </div>
</script>
```

As you can see from the above, this is pretty straightforward Knockout stuff. There are a few points worth noting …

The `content` div also has the class `noScroll`, with the page lifecycle code in `app.js` detecting the presence of this class. If it is found, a message is sent to the native Silverlight code to inform it that it should disable scrolling of the native WebBrowser control. This relates to a blog post I wrote a while back on how to [supress pinch zoom and scroll in a Windows Phone WebBrowse](http://www.scottlogic.co.uk/blog/colin/2011/11/suppressing-zoom-and-scroll-interactions-in-the-windows-phone-7-browser-control/)r in order to give a better user experience for HTML5 apps.

At the bottom of this template there is a div which creates an app-bar. The project CSS creates a Metro-style UI as shown below:

![propertyFinder1]({{ site.baseurl }}/ceberhardt/assets/codeproject/propertyFinder1.jpg)

There is a small amount of code in app.js which adds various event handlers to the app-bar to give it the show / hide behaviour:

```jscript
// wire up event handlers for various UI elements
function wireUpUI() {
  $(".appBar .more").click(function () {
    var appBar = $(".appBar");
    if (appBar.css("height") !== "80px") {
      appBar.animate({ height: 80 }, { duration: 300});
    }
  });

  $(".appBar").click(function () {
    var appBar = $(".appBar");
    if (appBar.css("height") === "80px") {
      appBar.animate({ height: 63 }, { duration: 300});
    }
  });
}
```

![appBar]({{ site.baseurl }}/ceberhardt/assets/codeproject/appBar.jpg)

The Property Finder uses a simple CSS file to achieve the Metro styling seen above. You might be wondering why I didn’t use the [recently released jQuery-Mobile Metro](http://www.scottlogic.co.uk/blog/colin/2012/04/introducing-the-jquery-mobile-metro-theme/) to achieve this same result, with less effort. Unfortunately jQuery-Mobile is much more than just CSS, it adds a lot of extra structure to the DOM and has its own page lifecycle. Making [jQuery Mobile play nicely with Knockout is not much fun](http://stackoverflow.com/questions/6089727/how-to-architecture-a-webapp-using-jquery-mobile-and-knockoutjs) and after my own efforts, I’d avoid attempting this!

### LocationViewModel and GeoLocationViewModel

The Nestoria APIs allow you to search via a plain-text search string or a geolocation. The Property Finder has view models that represent each of these types of search.

One for geolocation based searches:

```jscript
/// <reference path="..//intellisense.js" />

/*global $, ViewModel, propertyDataSource, ko*/

ViewModel.GeolocationViewModel = function () {
  /// <summary>
  /// The view model that backs the a search based on geolocation
  /// </summary>

  // ----- public fields
  this.lat = undefined;
  this.lon = undefined;
  this.displayString = undefined;

  // ----- public functions

  this.initialise = function (lat, lon) {
    /// <summary>
    /// Initializes the state of this view model.
    /// </summary>
    this.lat = lat;
    this.lon = lon;
    this.displayString = lat.toFixed(2) + ", " + lon.toFixed(2);
  };

  this.executeSearch = function (pageNumber, callback, errorCallback) {
    /// <summary>
    /// Executes a search by the geolocation represented by this view model for the given page
    /// </summary>
    propertyDataSource.findPropertiesByCoordinate(this.lat, this.lon, pageNumber, callback, errorCallback);
  };

};
```

And one for text-based searches:

```jscript
/// <reference path="..//intellisense.js" />

/*global $, propertyDataSource, ViewModel, ko*/

ViewModel.LocationViewModel = function () {
  /// <summary>
  /// The view model that backs the a search based on a location string
  /// </summary>

  // ----- public fields

  // the string used to search the Nestoria APIs
  this.searchString = undefined;

  // this string displayed to the end-user
  this.displayString = undefined;

  // ----- framework functions

  this.initialise = function (searchString) {
    /// <summary>
    /// Initializes the state of this view model.
    /// </summary>
    this.searchString = searchString;
    this.displayString = searchString;
  };

  this.initialiseDisambiguated = function (location) {
    /// <summary>
    /// Initializes the state of this view model via a location that has a 'display name' which is shown to the
    /// user, which differs from the name used to search the Nestoria APIs
    /// </summary>
    this.searchString = location.placeName;
    this.displayString = location.longTitle;
  };

  this.executeSearch = function (pageNumber, callback, errorCallback) {
    /// <summary>
    /// Executes a search by the search string represented by this view model for the given page
    /// </summary>
    propertyDataSource.findProperties(this.searchString, pageNumber, callback, errorCallback);
  };
};
```

Each of these view models has its own `executeSearch` method, which uses the `PropertyDataSource` described earlier to perform the required search. Giving the responsibility of executing the search to the objects which represent each type of search removes the need for a nasty ‘type-based’ switch to invoke the required search method.

An example of how these are used is when the user hits the ‘My location’ button, which is handled by the `PropertySearchViewModel`. Here the `navigation.geolocation` object, which is part of the HTML5 Geolocation specification, is used to find the current location, an instance of `GeolocationViewModel` created and a search executed.

```jscript
this.searchMyLocation = function () {
  /// <summary>
  /// Performs a search based on the current geolocation
  /// </summary>

  // check that the use of location is enabled.
  if (this.locationEnabled() === false) {
    that.userMessage("The use of location is currently disabled. Please enable via the 'about' page.");
    return;
  }

  function successCallback(result) {
    var location = new ViewModel.GeolocationViewModel();
    location.initialise(result.coords.latitude, result.coords.longitude);

    synchroniseSearchStrings = false;
    that.searchLocation = location;
    that.searchDisplayString(location.displayString);
    synchroniseSearchStrings = true;

    that.executeSearch();
  }

  function  errorCallback() {
    that.userMessage("Unable to detect current location. Please ensure location is turned on in your phone settings and try again.");
  }

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};<span style="white-space: normal; ">
</span>
```

The code that executes the search represented by the searchLocation instance is shown below:

```jscript
this.executeSearch = function () {
  /// <summary>
  /// Executes a search based on the current search string
  /// </summary>

  that.userMessage("");
  that.isSearchEnabled(false);

  function errorCallback(error) {
    /// <summary>
    /// A callback that is invoked if the search fails, in order to report the failure to the end user
    /// </summary>
    that.userMessage("An error occurred while searching. Please check your network connection and try again.");
    that.isSearchEnabled(true);
  }

  function successCallback(results) {
    /// <summary>
    /// A callback that is invoked if the search succeeds
    /// </summary>

    if (results.responseCode === Model.PropertySearchResponseCode.propertiesFound) {

      if (results.totalResults === null) {
        that.userMessage("There were no properties found for the given location.");
      } else {
        // if properties were found, navigate to the search results view model
        that.searchLocation.totalResults = results.totalResults;
        that.updateRecentSearches();
        var viewModel = new ViewModel.SearchResultsViewModel();
        viewModel.initialize(that.searchLocation, results);
        application.navigateTo(viewModel);
      }
    } else if (results.responseCode === Model.PropertySearchResponseCode.ambiguousLocation) {

      // if the location was ambiguous, display the list of options
      that.locations.removeAll();
      $.each(results.data, function () {
        var viewModel = new ViewModel.LocationViewModel();
        viewModel.initialiseDisambiguated(this);
        that.locations.push(viewModel);
      });

    } else {
      that.userMessage("The location given was not recognised.");
    }

    that.isSearchEnabled(true);
  }

  this.searchLocation.executeSearch(1, successCallback, errorCallback);
};
```

If you are wondering why I switch between ‘this’ and ‘that’, you probably need to read about how JavaScript handles the ‘this’ keyword, it is not the same as C#! It is common practice to assign a ‘that’ or ‘self’ variable to this within an object in order to [maintain a reference to the containing object when the context changes](http://www.alistapart.com/articles/getoutbindingsituations).

### SearchResultsViewModel

When a search executes successfully, the application navigates to the `SearchResultsViewModel`:

```jscript
/*global $, ViewModel, ko, propertyDataSource */

ViewModel.SearchResultsViewModel = function () {

  var that = this;

  // framework fields
  this.template = "searchResultsView";

  // ----- public properties

  this.isLoading = ko.observable(false);
  this.totalResults = undefined;
  this.pageNumber = ko.observable(1);
  this.searchLocation = undefined;
  this.properties = ko.observableArray();

  // ----- public functions

  this.initialize = function (searchLocation, results) {
    $.each(results.data, function () {
      var viewModel = new ViewModel.PropertyViewModel();
      viewModel.initialize(this);
      that.properties.push(viewModel);
    });

    that.searchLocation = searchLocation;
    that.totalResults = results.totalResults;
  };

  this.loadMore = function() {
    this.pageNumber(this.pageNumber()+1);
    this.isLoading(true);
    this.searchLocation.executeSearch(this.pageNumber(), function (results) {
      that.isLoading(false);
      $.each(results.data, function () {
        var viewModel = new ViewModel.PropertyViewModel();
        viewModel.initialize(this);
        that.properties.push(viewModel);
      });
      that.pageNumber(that.pageNumber() + 1);
    });

  };
};
```

This is a simple view model that presents a collection of `PropertyViewModel` instances using the template given below:

```html
<script id="searchResultsView" type="text/x-jquery-tmpl">
  <div class="content">
    <div>
      <div class="summary">
        Search results for
        <span class="searchString" data-bind="text: searchLocation.displayString"/>
        , showing
        <span data-bind="text: properties().length"/> of
        <span data-bind="text: totalResults"/> matching properties
      </div>

      <ul class="propertyList" data-bind='template: { name: "propertyThumbnailView", foreach: properties }'/>

      <table style="width:100%">
        <tr><td>
          <div class="summary">
            <span data-bind="text: properties().length"/> of
            <span data-bind="text: totalResults"/>
          </div>
        </td><td style="text-align:right">
          <button data-bind="click: loadMore,
                             enable: isLoading() == false,
                             visible: properties().length!==totalResults">
            Load more ...
          </button>
        </td></tr>
      </table>

    </div>
  </div>
</script>
```

The template which renders each individual property is defined separately as follows:

```html
<script id="propertyThumbnailView" type="text/x-jquery-tmpl">
  <li class="property"
      data-bind="click: select">
    <div class="thumbnailContainer">
      <img data-bind="attr: { src: thumbnailUrl }" class="thumbnail fade-in"/>
    </div>
    <ul class="propertyDetails">
      <li class="price">£<span data-bind="text: price"/></li>
      <li class="propertyType"><span data-bind="text: bedrooms"/> bed <span data-bind="text: propertyType"/></li>
      <li class="title" data-bind="text: title"></li>
    </ul>
  </li>
</script>
```

If there are more pages of data, a ‘Load more …’ button is displayed at the end of the list:  
   
![propertyResults]({{ site.baseurl }}/ceberhardt/assets/codeproject/propertyResults.jpg)

### State Persistence

Hopefully the previous sections are enough to give you a flavour of how the Property Finder application is structured and functions. I have not given an exhaustive descriptions of all the application features, such as recent searches, favourites etc … however, these all follow a similar pattern.

The one area I wanted to detail a bit further is state persistence. Within `app.js` property changed handlers are added to all the view model properties that we would like to persist between application sessions:

```jscript
// handle changes in persistent state
propertySearchViewModel.favourites.subscribe(persistentStateChanged);
propertySearchViewModel.recentSearches.subscribe(persistentStateChanged);
propertySearchViewModel.locationEnabled.subscribe(persistentStateChanged);
```

When the state changes, a JSON representation of these various objects is saved to local storage:

```jscript
// save app state to persistent storage
function persistentStateChanged() {

  var state = {
      recentSearches : propertySearchViewModel.recentSearches,
      favourites: propertySearchViewModel.favourites,
      locationEnabled : propertySearchViewModel.locationEnabled
    },
    jsonState = ko.toJSON(state);

  localStorage.setItem("state", jsonState);
}
```

Cordova does its magic here, replacing the `localStorage` object with its own equivalent that provides a platform specific mechanism for saving state, i.e. for Windows Phone it uses isolated storage via the Silverlight APIs.

When the application restarts, we check for any previously saved state and re-load it:

```jscript
function initializeViewModel() {

   // create the view model
  application = new ViewModel.ApplicationViewModel();

  // ...

  // create the top-level view model
  propertySearchViewModel = new ViewModel.PropertySearchViewModel();
  application.navigateTo(propertySearchViewModel);

  // load application state
  try {
    var state = localStorage.getItem("state");
    console.log("loading state:" + state);
    if (typeof (state) === 'string') {
      setState(state);
    }
  } catch (err) {
  }

  // ...
}

// restore saved state
function setState(jsonState) {
  var state = $.parseJSON(jsonState);
  if (!state) {
    return;
  }
  if (state.favourites) {
    $.each(state.favourites, function () {
      propertySearchViewModel.favourites.push(hydrateObject(this));
    });
  }
  if (state.recentSearches) {
    $.each(state.recentSearches, function () {
      propertySearchViewModel.recentSearches.push(hydrateObject(this));
    });
  }
  if (state.locationEnabled !== undefined) {
    propertySearchViewModel.locationEnabled(state.locationEnabled);
  }
}
```

The saved application state is in JSON format, for we can easily re-create our view model objects, using the `ko.fromJSON` utility function for example. However, this will provide objects that *look* like our view models, but they will lack the methods we have added to these objects within their constructor function.

For this reason I have created a utility function, `hydrateObject`, that recursively re-constructs view models, where each has its constructor function identified by a `factoryName` property:

```jscript
/// <reference path="..//intellisense.js" />

/*global ko, $, window */

function hydrateObject(state) {
  /// <summary>
  /// Takes a JSON representation of view model state and creates view model instances
  /// via their constructor function as indicated by the 'factoryName' property.
  /// </summary>

  // if state is a primitive type, rather than an object - no
  // need to hydrate;
  if (!(state instanceof Object)) {
    return state;
  }

  var property, unwrapped, propertyValue,
  // create the required view model instance
    viewModel = new window["ViewModel"][state.factoryName]();

  // iterate over each state property
  for (property in state) {
    if (property === "template" ||
        property === "factoryName" ||
        property === undefined) {
      continue;
    }

    propertyValue = state[property];

    // if the view model property is a function - it might be a KO observable
    if (viewModel[property] instanceof Function) {

      // check if this is a KO observable
      unwrapped = ko.utils.unwrapObservable(viewModel[property]);

      // if after unwrapping we do not get the same object back, then
      // this is an observable
      if (viewModel[property] !== unwrapped) {

        // check if this is an array observable
        if (unwrapped instanceof Array) {
          $.each(propertyValue, function () {
            viewModel[property].push(hydrateObject(this));
          });
        } else {
          // otherwise set the value via the observable setter
          viewModel[property](propertyValue);
        }
      }

    } else {
      viewModel[property] = hydrateObject(propertyValue);
    }
  }

  return viewModel;
}
```

## Property Finder iOS

Because Property Finder has been written using platform-agnostics HTML5, it could be run directly on an iPhone. However, because I decided to use the Windows Phone Metro style, it would look very odd on an Apple device! Instead, I wanted to give users of both OS an experience that is suited to their device; Metro for Windows Phone and the classic ‘Apple’ theme for iOS.

All of the application logic is written using Knockout view models, so is entirely separate from the UI layer. This means it should be possible to replace the Metro UI with an iOS equivalent simply by changing the templates and style sheets.

Well … almost.

### Borrowing from jQuery Mobile

Creating an iOS style UI using HTML / CSS is a much harder task than creating a Metro UI with HTML. Fortunately the [jQuery Mobile team](http://jquerymobile.com/) have come up with a highly comprehensive framework that produces HTML UIs that look almost exactly the same as their native equivalents, with minimal effort.

Unfortunately, as I mentioned previously, Knockout and jQuery Mobile do not play nice! So I used the jQuery Mobile CSS without their JavaScript code. This has the side-effect that my HTML templates are much more complex.

What was previously a simple button:

```html
<button type="submit" data-bind="enable: isSearchEnabled, click: executeSearch">Go</button>
```

Now becomes this monstrosity:

```html
<div class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c">
  <span class="ui-btn-inner ui-btn-corner-all">
    <span class="ui-btn-text">Go</span>
  </span>
  <input class="ui-btn-hidden" type="button" value="Go"
                  data-bind="enable: isSearchEnabled,
                                    click: executeSearch"/>
</div>
```

The extra HTML elements are required in order to support the jQuery Mobile CSS (If only HTML / CSS had the equivalent of Silverlight templates!).

Using this slightly verbose approach, I was able to create HTML templates that make use of the jQuery Mobile CSS resulting in iOS screens which look very much like a native application:

![propFinderiOS2]({{ site.baseurl }}/ceberhardt/assets/codeproject/propFinderiOS2.jpg)

### Scrolling with iScroll

The ‘standard’ layout for an iPhone application has a fixed header bar at the top and scrolling content beneath. Unfortunately iOS browser (prior to iOS5) lack so of the CSS constructs required to achieve this type of page layout. For an overview of the issues, refer to the [jQuery Mobile page on touchOverflow](http://jquerymobile.com/test/docs/pages/touchoverflow.html).

In order to create a page with a fixed header and scrolling content, people resort to some quite complex JavaScript and CSS, manually handling touch events, offsetting the content, calculating inertia etc … A popular script for that wraps up all of the complex code required is [iScroll](http://cubiq.org/iscroll-4). You can see a [live demo of it in action here](http://lab.cubiq.org/iscroll/examples/simple/). In order to render a scrolling list of properties, I integrated iScroll into the iOS version of Property Finder.

There is a little extra code required in `app.js` in order to handle changes to the list of properties and update the iScroll instance so that it is aware that its contents have changed. Other than that, the integration was quite straightforward:

![iosPropertyList]({{ site.baseurl }}/ceberhardt/assets/codeproject/iosPropertyList.jpg)

Again, the list layout uses jQuery Mobile CSS and hand-crafted HTML to match.

The iPhone lacks a hardware back button, hence the inclusion of a back button within the header bar in the above screenshot.

iScroll also has some very nice extra features, such as pull-to-refresh. I was able to integrate this feature into PropertyFinder as an alternative to the ‘Load more …’ button in the Windows Phone version:

![pullToRefresh]({{ site.baseurl }}/ceberhardt/assets/codeproject/pullToRefresh.jpg)

The code which handles this is a bit messy, as it is outside of the elegant Knockout view model-driven code:

```jscript
 function wireUpUI($view) {

  // fade in images as they appear
  fadeImages();

  var $iScroll = $view.find(".iScrollWrapper"),
      $pullUpEl = $view.find(".pullUp"),
      $pullUpLabel, pullUpEl, pullUpOffset;

  // pull-to-refresh, taken from this iScroll demo:
  // http://cubiq.org/dropbox/iscroll4/examples/pull-to-refresh/
  if ($iScroll.length > 0) {

    if ($pullUpEl.length > 0) {

      pullUpEl = $pullUpEl.get(0);
      pullUpOffset = $pullUpEl.attr('offsetHeight');
      $pullUpLabel = $pullUpEl.find(".pullUpLabel");

      myScroll = new iScroll($iScroll.get(0), {
        useTransition: true,
        onRefresh: function () {
          if ($pullUpEl.hasClass('loading')) {
            $pullUpEl.removeClass();
            $pullUpLabel.html('Pull up to load more...');
          }
        },
        onScrollMove: function () {
          if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass('flip')) {
            $pullUpEl.addClass('flip');
            $pullUpLabel.html('Release to refresh...');
            this.maxScrollY = this.maxScrollY;
          } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass('flip')) {
            $pullUpEl.removeClass("flip");
            $pullUpLabel.html('Pull up to load more...');
            this.maxScrollY = pullUpOffset;
          }
        },
        onScrollEnd: function () {
          if ($pullUpEl.hasClass('flip')) {
            $pullUpEl.addClass("loading");
            $pullUpLabel.html('Loading...');
            pullUpAction();
          }
        }
      });
    } else {
      myScroll = new iScroll($iScroll.get(0), {
        useTransition: true
      });
    }
  }
}
```

It should be possible to create a version of iScroll which has proper binding support, the Knockout framework is quite easy to extend to add custom bindings … but that’s a job for another day!

The `fadeImages` function adds a cool little effect to the image thumbnails, fading them in as they load. This is achieved using a CSS3 opacity transition:

```css
img.ui-li-thumb
{
  -webkit-transition<span class="code-none"><span class="code-none"><span class="code-none">: opacity 1s ease-in-out<span class="code-none"><span class="code-none"><span class="code-none">;
  -moz-transition<span class="code-none"><span class="code-none"><span class="code-none">: opacity 1s ease-in-out<span class="code-none"><span class="code-none"><span class="code-none">;
  -webkit-backface-visibility<span class="code-none"><span class="code-none"><span class="code-none">: hidden<span class="code-none"><span class="code-none"><span class="code-none">;
  opacity<span class="code-none"><span class="code-none"><span class="code-none">: 0<span class="code-none"><span class="code-none"><span class="code-none">;
<span class="code-none"><span class="code-none"><span class="code-none">}

img.shown
<span class="code-none"><span class="code-none"><span class="code-none">{
  opacity<span class="code-none"><span class="code-none"><span class="code-none">: 1<span class="code-none"><span class="code-none"><span class="code-none">;
<span class="code-none"><span class="code-none"><span class="code-none">}<span style="white-space: normal; ">
</span></</span></span></</span>span></</span></span></span></span></span></span></span></span></span>span>span></</span>
```

Which is triggered by adding the `shown` class to images when they have loaded:

```jscript
function fadeImages() {
  $("img.ui-li-thumb:not(.shown)").bind("load", function () {
    $(this).addClass("shown");
  });
}
```

### The Project Structure and Build

Other than the cosmetic changes detailed above, all of the core application functionality, including geolocation and state persistence, work s unchanged on iOS. In order to facilitate the development of the iOS version, I created a simple batch file which copies the shared code from the Windows Phone project into my iOS folders:

```
copy ..\HTML5PropertySearch\www\viewModel\*.js viewModel /Y
copy ..\HTML5PropertySearch\www\model\*.js model /Y
copy ..\HTML5PropertySearch\www\lib\*.js lib /Y
```

The iOS version is not built with Visual Studio, so I cannot use VS file references!

In order to deploy the application to an iPhone, it needs to be Cordova wrapped and packaged as an IPA file. This can be done on a Mac computer using Xcode, however there is a simpler alternative.

You can build your Cordova application online via the [PhoneGap Build](https://build.phonegap.com/) service. For Property Finder, the application assets are accompanied with this XML file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<widget xmlns    = "http://www.w3.org/ns/widgets"
  xmlns:gap  = "http://phonegap.com/ns/1.0"
  id = "uk.co.scottlogic.propertyfinder"
  version = "1.0.0">

  <name>Property Finder</name>

  <description>
    A HTML5 property finder application
  </description>

  <author href="http://www.scottlogic.co.uk/blog/colin/"
    email="ceberhardt@scottlogic.co.uk">
    Colin Eberhardt
  </author>

  <gap:platforms>
    <gap:platform name="android" minVersion="2.1" />
    <gap:platform name="webos" />
    <gap:platform name="symbian.wrt" />
    <gap:platform name="blackberry" project="widgets"/>
  </gap:platforms>

  <icon src="ApplicationIcon.png" gap:role="default" />
  <gap:splash src="SplashScreenImage.png"/>

  <preference name="orientation" value="portrait" />
  <preference name="webviewbounce" value="false" />

  <feature name="http://api.phonegap.com/1.0/geolocation"/>
  <feature name="http://api.phonegap.com/1.0/network"/>

</widget><span style="white-space: normal; ">
</span>
```

On uploading the code, plus this configuration file, the Build service builds your code of a range of devices. Here is what the online portal looks like:

![pgBuild]({{ site.baseurl }}/ceberhardt/assets/codeproject/pgBuild.jpg)

As you can see, I have used this service for quite a few projects. My friend Chris Price has also created a useful [Maven plugin that automates the process of sending your code to PhoneGap Build](http://www.scottlogic.co.uk/2012/06/using-phonegap-build-with-maven/), allowing continuous integration.

## A Critical Look at the UX

The static images in this article look almost indistinguishable from their native contemporaries. However, when you actually put them in the hands of an end user, they will start to spot a few of the tell-tale signs that identify these as non-native applications!

### Windows Phone

Windows Phone HTML5-based applications have a few issues that affect the user-experience of the finished product. Here is a brief summary of some of those issues:

- **Text selection** – because the PhoneGap view is HTML, the user can select any text on the page. With WebKit browsers (iOS, Android), you can disable this with the CSS user-select:none property. This is not supported in IE, which is a shame because it improves the user experience of HTML-based applications.
- **Suppression of pinch zoom** – the solution I described above for disabling pinch and tap zoom works well, however, as it is dependent on the internal visual tree of the `WebBrowser` control. For this reason, when I discussed it with Jesse Macfeyden of the Cordova team, I advised against including it being included in the Windows Phone Cordova framework. A future version of the `WebBrowser` control might have a different visual tree that breaks this functionality. What is really needed is better support for the user-scalable:no meta property. Both Android and iOS do a better job of this!
- **Gray link highlighting** – probably the single biggest issue with the IE9 mobile browser, from a HTML5 application developer perspective, is the way it highlights links, or any element with a JavaScript click event handler, in gray. If you are trying to create an application with a native look and feel it totally ruins the experience. Try looking at the [jQuery Mobile demo](http://jquerymobile.com/test/) on your Windows Phone browser. It is an almost pixel perfect iOS UI, however as soon as you click on a link, it is immediately obvious that this is a web page.

In the screenshot below you can see this issue, where a gray rectangle appears over the property tile when the user clicks on it:

![grayHighlight]({{ site.baseurl }}/ceberhardt/assets/codeproject/grayHighlight.jpg)

This occurs throughout the application, when they search buttons, app-bar buttons, tiles, everywhere! Regarding the last issue, I have [posted on StackOverflow](http://stackoverflow.com/questions/6378008/windows-phone-7-browser-turn-off-the-gray-shading-when-links-are-clickedbut) but haven’t found a satisfactory solution yet.

### iPhone

The Property Finder iPhone interface holds up a little better than the Windows Phone equivalent. There are no immediately obvious UI flaws that identify it as a HTML5 application. However, there are a few signs. Probably the most noticeable difference is the page transitions. With native iOS applications, the transition from one screen to the next is subtle and complex, [involving at least five different elements](http://watchingapple.com/2009/11/a-closer-look-at-iphone-transition-animations/).

![iPhoneTransitions]({{ site.baseurl }}/ceberhardt/assets/codeproject/iPhoneTransitions.jpg)

HTML5-based applications typically transition from one screen to the next as a single sliding block.

## Conclusions

The main reason for choosing to implement mobile applications with HTML5 is in order to share code across multiple platforms, removing the need to create multiple native equivalents. So just how much code was shared between the iOS and Windows Phone Property Finder?

Using lines of code as a metric, 43% of the code was shared across platforms:

![shaedCode]({{ site.baseurl }}/ceberhardt/assets/codeproject/shaedCode.jpg)

This doesn’t sound that impressive! However, it is worth noting that this is over the entire codebase, which includes JavaScript, CSS and HTML. In terms of development effort, it typically takes much less time to write CSS and HTML than JavaScript.

If we focus on JavaScript alone, the re-use story is much better:

![sharedCode2]({{ site.baseurl }}/ceberhardt/assets/codeproject/sharedCode2.jpg)

Another reason why the amount of code shared was not as high as it could have been is that I decided to create an application that mimicked the native look and feel of each of the two platforms. Nearly all of the platforms specific code was as a result of this decision.

The following is a brief summary of my findings, in an easily digestible bullet-point format:

- **HTML5 is a viable technology for cross-platform mobile application development.** Both the Windows Phone and iOS version delivered the required end user functionality.
- **HTML5 does allow you to share code across platforms.** All of the core business logic was shared across both platforms. This is a key benefit of the cross-platform approach, where you can write and test your logic just once.
- **HTML5 is a route of compromise.** While both applications look ‘at home’ within their respective platforms, it is quite easy to spot the fact that they are not native. The Windows Phone version has a few glaring UI quirks that do spoil the user experience. Personally, I would not choose HTML5 for Windows Phone development at the moment, perhaps Windows Phone 8 will solve these issues? For iOS the differences are more subtle, but are still noticeable.
- **Matching the native look and feel is costly.** It did take quite a bit of time to match the native iOS UI. There are frameworks that assist with this, such as jQuery Mobile, however, these are often not suitable for more complex applications and you find yourself fighting the framework.
- **If you want a premium experience, go native!** I don’t think it is possible to create a HTML5 application that matches the ‘premium’ experience of a native equivalent. If you do not want to compromise … native is your only option.

My advice to anyone who is considering creating a HTML5-based cross platform mobile application is to ignore the iOS style, ignore the Windows Phone Metro and Android Roboto and create your own application style that can be shared across all platforms. Creating a single consistent UI style will significantly reduce your development costs. And finally, understand the compromises you will have to make.

I hope you have enjoyed this article … my next one is already underway, where I will look at using Xamarin / MonoTouch as an alternative to HTML5.

You can download the , or [download / fork the codebase on github](https://github.com/ColinEberhardt/PropertyFinder-HTML5).
