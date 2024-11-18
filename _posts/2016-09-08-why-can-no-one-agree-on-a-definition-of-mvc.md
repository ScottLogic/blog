---
title: Why does no one agree on a definition of MVC?
date: 2016-09-08 00:00:00 Z
categories:
- Tech
author: jharris
summary: If you look up the MVC pattern on the web you can easily find definitions that differ and contradict each other.  In this post I'll look at some definitions of MVC and consider what the differences mean for applying the pattern in practice.
layout: default_post
---

The MVC pattern is one of the first you’re likely to encounter and be expected to understand as a web developer.  In fact I was asked to explain the pattern in an interview when looking for my first job as a developer.  Sadly I found that if I looked at five different websites I would get five different definitions of MVC, sometimes directly contradicting each other.

In this post I will examine a few definitions of MVC that can be found on the web and highlight their differences.  At the end I will offer my understanding of MVC and how to apply it.  While this doesn’t exactly reconcile the various definitions we see it hopefully offers some insight into how they’ve arisen.

For a start, let’s take [the definition from the Chrome developers site](https://developer.chrome.com/apps/app_frameworks#mvc):

>
>**Model**  
>Model is where the application’s data objects are stored.  
>  
>**View**  
>View is what's presented to the users and how users interact with the app. The view is made with HTML, CSS, JavaScript and often templates. 
>
>**Controller**  
>The controller is the decision maker and the glue between the model and view. The controller updates the view when the model changes. It also adds event listeners to the view and updates the model when the user manipulates the view.


However, [here is another definition of the pattern](https://blog.codinghorror.com/understanding-model-view-controller/), highly ranked on Google, from the blog of Jeff Atwood, co-creator of Stack Overflow:

>**Model**  
>The HTML is the "skeleton" of bedrock content. Text that communicates information to the reader.
>
>**View**  
>The CSS adds visual style to the content. It is the "skin" that we use to flesh out our skeleton and give it a particular look. We can swap in different skins via CSS without altering the original content in any way. They are relatively, but not completely, independent.
>
>**Controller**  
>The browser is responsible for combining and rendering the CSS and HTML into a set of final, manipulatible (sic) pixels on the screen. It gathers input from the user and marshals it to any JavaScript code necessary for the page to function. But here, too, we have flexibility: we can plug in a different brower (sic) and get comparable results. Some browsers might render it faster, or with more fidelity, or with more bells and whistles."

It is plain to see that this is a very different definition from that found on the Chrome developer site, for example by defining the browser as the controller of an MVC web app.  I would say the two definitions directly contradict each other, with one suggesting the HTML should be in the view and the other suggesting it should be in the model.

Let’s introduce [a third definition](https://docs.djangoproject.com/en/1.9/faq/general/#django-appears-to-be-a-mvc-framework-but-you-call-the-controller-the-view-and-the-view-the-template-how-come-you-don-t-use-the-standard-names) from the FAQs of the Django framework:

>Where does the “controller” fit in, then? In Django’s case, it’s probably the framework itself: the machinery that sends a request to the appropriate view, according to the Django URL configuration.

This again is at odds with the previous definitions as Django defines the entire framework as being the controller whereas Atwood defined it as being the web browser and the Chrome developer site didn’t mention either a framework or a browser in its definition of the controller.

To be fair, the people at Django do go on to qualify the FAQ answer and say that Django might be best described as an MTV (Model-Template-View) framework rather than an MVC framework.  To me that raises a further question- why try and fit Django to an MVC framework at all?  Why not just say in the FAQs that it’s not an MVC framework?

The team behind the Angular framework do something similar.  In [their tutorial](https://docs.angularjs.org/tutorial/step_02) they say:

>For Angular applications, we encourage the use of the Model-View-Controller (MVC) design pattern to decouple the code and separate concerns.

By the [end of the tutorial](https://docs.angularjs.org/tutorial/step_13) you have controllers like the following

~~~ javascript
    controller: ['$routeParams', 'Phone',
      function PhoneDetailController($routeParams, Phone) {
        var self = this;
        self.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
          self.setImage(phone.images[0]);
        });

        self.setImage = function setImage(imageUrl) {
          self.mainImageUrl = imageUrl;
        };
      }
    ]
~~~

The reason for setting ```self = this``` in the code above is so that ```self``` can be exposed directly to the view.  We can see that ```self``` contains domain data and has functions for manipulating it.  

In his [Angular style guide](https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers), John Papa calls the variable ```vm``` rather than ```self``` and [writes on his blog](https://johnpapa.net/angularjss-controller-as-and-the-vm-variable/):

>VM represents the View's Model (aka ViewModel). But wait, this is MVC right? Meh, it's MV* .. I'm all for patterns, but I don't get hung up on conforming for the sake of conforming.

Despite the statement in the Angular tutorial that they encourage the MVC design pattern, the pattern they actually implement in the tutorial is MVVM (Model-View-ViewModel) since the ‘controller’ object is handling and manipulating domain data.

We’ve seen from the above definitions, all found on the web from quite prominent sources, that there are several conflicting ideas of what the MVC pattern is and how to implement it.

In my opinion the key to the pattern, and what will facilitate an easily maintainable and testable app, is to keep your business logic separate from your presentation logic. I think at some point in the history of web development this idea became synonymous with MVC, which is perhaps why people try to pin the MVC label onto projects where it doesn’t strictly belong.  But actually all the MV* patterns will provide this separation of concerns.

For MVC, presentation logic should reside in the view, which for a web app usually means the view is an HTML template with little or no code.  The model should contain your business logic and hold data objects.  This might well be an entire layer of the app or reside in its own project, rather than simply having a class or file with the world ‘model’ in its name (there are exceptions - Django, for example).  The controller should have the responsibility for communicating to the model, reacting to user input on the view and updating the view if the model changes (in modern frameworks the view-controller binding is often automatic).

If you find the controller is needing to hold data about the state of the view (which text boxes are filled, whether it’s showing a loading spinner, etc.) then you’ve drifted into MVVM territory.  That’s fine, in fact a lot of modern frameworks guide you towards this pattern.  But, with so many conflicting definitions out there, when beginning work on an application that’s labelled as MVC it’s important to understand the conventions used by the framework and the development team before you begin, or you’re setting yourself up for confusion before you even begin to code.

