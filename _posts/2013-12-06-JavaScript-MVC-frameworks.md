---
title: An introduction to MVC frameworks
date: 2013-12-06 00:00:00 Z
categories:
- dkerr
- Tech
author: dkerr
layout: default_post
summary: The recent rise of web applications that have all the functionality of their
  desktop counterparts has highlighted the fact that JavaScript MVC Frameworks are
  now an essential part of any modern web developers toolkit.
oldlink: http://www.scottlogic.com/blog/2013/12/06/JavaScript-MVC-frameworks.html
disqus-id: "/2013/12/06/JavaScript-MVC-frameworks.html"
---

Web development has changed significantly in the past few years; it hasn't been long since deploying a web project simply involved uploading static HTML, CSS and JavaScript files to a HTTP server. The growing popularity with providing software as a service has meant that applications which have resided on the desktop are being transferred to the browser.

Some of these web applications are large scale and complex, JavaScript alone cannot be used to provide a stable foundation to write quality, maintainable code. As a result, new MVC frameworks have appeared that offer to provide structure and guidance when developing these applications.

## What are they?

MVC frameworks are libraries that can be included alongside JavaScript to provide a layer of abstraction on top of the core language. Their goal is to help structure the code-base and separate the concerns of an application into three parts:

* **Model** - Represents the data of the application. This matches up with the type of data a web application is dealing with, such as a user, video, picture or comment. Changes made to the model notify any subscribed parties within the application.
* **View** - The user interface of the application. Most frameworks treat views as a thin adapter that sits just on top of the DOM. The view observes a model and updates itself should it change in any way.
* **Controller** - Used to handle any form of input such as clicks or browser events. It's the controller's job to update the model when necessary (i.e. if a user changes their name).

Not all frameworks follow the MVC pattern. You may see some frameworks utilize a variation of the MVC pattern such as [MVVM](http://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/) or [MVP](http://www.roypeled.com/an-mvp-guide-to-javascript-model-view-presenter/).

If you're unfamiliar with the MVC pattern or the variations used by some frameworks a good idea is to read [JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailmvcmvp) to help your understanding.

## Why are they needed?

A DOM manipulation library such as [jQuery](http://www.jquery.com) coupled with utility libraries ([underscore](http://underscorejs.org), [modernizr](http://modernizr.com)) can make building webpages much easier. However, these libraries lose their usefulness when used to build web applications.

Web applications are unlike a normal web page, they tend to feature more user interaction as well as needing to communicate with a backend server in real time. If you were to handle this behaviour without an MVC framework you'd end up writing [messy](http://web.archive.org/web/20151209151711/http://tritarget.org/blog/2012/11/28/the-pyramid-of-doom-a-javascript-style-trap), unstructured, unmaintainable and untestable code.

## When should you use them?

You should consider utilizing an MVC framework if you're building an application with enough heavy-lifting on the client-side to struggle with JavaScript alone. Choose incorrectly and you'll end up re-inventing the functionality provided by an MVC framework.

Be aware, if you're just building an application that still has a lot of the heavy lifting on the server-side (i.e. view generation) and there is little interaction on the client-side, you'll find using an MVC framework is likely overkill. In that case, it's better to use a simpler setup such as a DOM manipulation library with a few utility add-ons.

The following checklist is not exhaustive but hopefully provides enough context to help decide whether an MVC framework is suitable for what you're building:

1. Your application needs an asynchronous connection to the backend
2. Your application has functionality that shouldn't result in a full page reload (i.e. adding a comment to a post, infinite scrolling)
3. Much of the viewing or manipulation of data will be within the browser rather than on the server
4. The same data is being rendered in different ways on the page
5. Your application has many trivial interactions that modify data (buttons, switches)

Good examples of web applications that fulfil these criteria are [Google Docs](http://docs.google.com), [Gmail](https://mail.google.com) or [Spotify](https://play.spotify.com/).

## Introduction to the most popular frameworks

Arguably the four most popular frameworks available today are [Backbone.js](http://backbonejs.org/), [Angular.js](http://angularjs.org/), [EmberJS](http://emberjs.com/) and [KnockoutJS](http://knockoutjs.com/). This section aims to provide a high level comparison of these frameworks.

The reason why it's helpful to concentrate on these frameworks is that each one has been used extensively in the wild and provides excellent documentation and community support. This means you can be confident that any framework you pick will fulfil your requirements as well as having help and support available if needed.

Additionally, there is little difference in the quantity of features provided by each framework. However, their opinion and implementation differ on what approach you should take when building a web application.

Some frameworks tend to be quite flexible in the way you can work with it, whereas others prefer you follow their predefined conventions. These differences can make a framework more suitable in certain scenarios than others.

Focusing on providing a comparison between these framework's philosophies ensures you can pick a framework that is compatible with your application's requirements or suits your personal taste.

## <img src="{{ site.baseurl }}/dkerr/assets/backbone.png"/>

Backbone.js offers a flexible, minimalist solution to separating concerns in your application. As a consequence of its minimal solution, Backbone.js used without its own plugins is more of a utility library than a fully-fledged MVC framework.

It may appear that Backbone isn't as fully featured as the other popular MVC frameworks available. Pairing Backbone with one of its add-ons like [Marionette](http://marionettejs.com/) or [Chaplin](http://chaplinjs.org/) ensures that Backbone.js is as feature complete as other frameworks.

Backbone.js has a [library of plugins and add-ons](http://backplug.io/) that can be used to provide any sort of functionality that your application requires. Its modular approach means you can fine tune Backbone.js to use a different templating engine should your application require it. Furthermore, the flexibility the modularity provides makes Backbone.js suitable when developing a web application with unstable requirements.

**Pros**: minimalist, flexible, great add-on / plugin support, unopinionated, great [track record](http://backbonejs.org/#examples) of being used in complex web applications (WordPress, Rdio, Hulu), source code extremely simple to read, gentle learning curve

**Cons**: Requires external dependencies (underscore), memory management can trip beginners up, no built in two way binding, unopinionated, requires plugins to become as feature complete as other MVC frameworks.




## <img src="{{ site.baseurl }}/dkerr/assets/angular.png"/>

Angular.js is designed and built by Google and is quickly gaining popularity. The stand out feature of Angular is its use of custom HTML tags and components to specify the intentions of your application.

It provides a [HTML compiler](http://docs.angularjs.org/guide/compiler) that allows users to create their own [domain specific language](http://en.wikipedia.org/wiki/Domain-specific_language); this can be an extremely powerful tool. The approach is different than other frameworks which seek to deal with HTML's shortcomings by abstracting away the HTML, CSS and JavaScript by providing alternative ways to manipulate the DOM.

**Pros**: Dependency injection, backed by Google, testing framework built in, built-in form validation, [directives](http://docs.angularjs.org/guide/directive), extremely easy to debug,

**Cons**: Steep learning curve, [data-binding can be problematic for pages with large amounts of information](http://stackoverflow.com/questions/9682092/databinding-in-angularjs), hard to implement transitions when showing / hiding views




## <img src="{{ site.baseurl }}/dkerr/assets/ember.png"/>

EmberJS is an opinionated, modular framework that can be simple and intuitive to work with if you follow its guidelines on how an application is built the Ember way.

Its convention over configuration approach means it provides a good starting point to begin construction when compared to other frameworks.

If you've had experience working with Ruby on Rails you'll find it feels quite familiar when you work with EmberJS.

**Pros**: Fast development and prototyping, little configuration required, convention over configuration approach, Ember Data makes syncing with JSON API's much easier

**Cons**: Lacks extensive testing tools, hard to integrate 3rd party libraries due to its opinionated approach, initially has a steep learning curve, unstable API




## <img src="{{ site.baseurl }}/dkerr/assets/knockout.png"/>

KnockoutJS aims to simplify dynamic UIs with a MVVM (Model - View - ViewModel) pattern.

It provides declarative bindings that make it easy to build even the most complex UIs while ensuring that the underlying data model is left clean.

Custom behaviours [such as sorting a table](http://knockoutjs.com/examples/grid.html) can be easily implemented via bindings in just a few lines of code.

KnockoutJS has fantastic compatibility support; it works on all modern browsers as well as legacy browsers (Internet Explorer 6).

**Pros**: Inter-application dependencies handled with a dependency graph ensures good performance even for data-heavy applications, data binding is intuitive and easy to learn, custom events allow for easy implementation of custom behaviour, great browser compatibility

**Cons**: HTML templates / views can get messy if lots of bindings are used, end to end functionality (url-routing, data-access) not available out of the box, no third-party dependencies



## Which one to choose?

Due diligence should be paid before selecting a framework to use for your web application. The chosen framework may be used to implement complex or uncommon functionality as well as maintain the application for years ahead.

Here are some summaries to help steer your thought process on which ones to try out.

**Use Backbone.js if:**
1. Your web application has uncertain requirements and as a result flexibility is vital.
2. You need to be able to easily change or pull out parts your web application (i.e. templating engine).
3. You'd like to start with a minimalist solution to help understand the fundamentals of MVC frameworks.

**Use Angular.js if:**
1. You want your MVC framework to be backed by a large reputable company to ensure its reliability and stability.
2. The use of a domain-specific language could help reduce the complexity of my web application.
3. Your web application requires extensive testing to verify its functionality. You need a testing framework that has been built from the ground up to work with the MVC framework rather than against it.

**Use EmberJS if:**
1. You've previously had experience with Ruby and enjoyed using its convention over configuration approach.
2. You need a framework that helps develop solutions and prototypes quickly.
3. Your web application needs a framework to handle the interaction with a JSON API with very little effort required.

**Use KnockoutJS if:**
1. The MVVM pattern provided by Knockout is much more suitable for the structure of my application.
2. The framework and application need to support legacy browsers such as IE6.
3. Your application has a complex dynamic UI and as a result the framework needs support creating these as cleanly as possible.

## Conclusion

The discussion above illustrates how there isn't a one-size-fits-all framework that is best for all scenarios. Each framework has its own advantages that make it suitable in different cases. You should try out each framework for a short while to get a feel for each one.

Finally, try to build some proof of concept prototypes in each framework and compare the implementations. This is similar to what the authors behind [TodoMVC](http://www.todomvc.com) started which highlights the differences between a huge number of MVC frameworks by implementing a simple TODO application in each one.
