---
title: Foyer Screen, continued.
date: 2014-12-05 00:00:00 Z
categories:
- Tech
author: rfarmer
layout: default_post
summary: I have spent the last 12 weeks continuing the Foyer Screen project. In this post I describe the Admin Panel which I created to allow dynamic editing of presentation content and share a little of what I've learned in my time at Scott Logic, including some useful resources for getting started with Angular JS.
oldlink: http://www.scottlogic.com/blog/2014/12/05/Foyer-Screen-continued.html
disqus-id: "/2014/12/05/Foyer-Screen-continued.html"
---

During my internship I have continued work on the Foyer-screen project started by Mila this summer.
You can read about her experience of creating the JavaScript, HTML5 and CSS3 based web-application [here][MilaBlog].

My main contribution to the project was an Admin App for dynamic editing of presentation content and configuration. I will describe some of the functionality of the Admin App, as well as a process I developed to simplify deployment of the presentation. I will also reflect a little on what I've learned during my internship and share some resources that I have found useful while learning Angular JS.


## Admin Panel:
At the end of her internship, Mila identified a few next steps for the project which included admin functionality for dynamic updates to presentation content fetched from [Parse][Parse].

Initially, some string resources were all that was stored on Parse, with photo content stored on Dropbox.
I separated further content from the presentation, including Web Banner details and Photos and also created classes to store configuration data for slides; specifying details such as sort order, timing, slide type, post limits etc.

<img alt="Admin Parse Edit" src="{{ site.baseurl }}/rfarmer/assets/admin1.jpg"/>

Having slide data fetched after the slide is shown, rather than only on initialisation, removes the need to re-deploy code and restart application for changes as the presentation deployed on the foyer-screen can dynamically respond to changes.

Using Parse also allows resources and their meta-data to be organised more easily. And so instead of having a text file with a list of images to show, we could store photos in a class on Parse along with relevant attributes like photo captions, sort order and group. I used grouping attributes like 'Photo Set', 'Fact Set' etc. to split content of the same type so that a different set would be shown on each use of that slide.

To accommodate the editing and adding of content and configuration for the foyer-screen presentation, I created an HTML and JavaScript based application to alter data on Parse using the [REST API][Parse API].

This was an opportunity for me to develop something 'from scratch'. Initially I inserted data from Parse to the DOM using JQuery as I had picked up some confidence with the library while working on the Foyer Screen app. However, as I will discuss later in this post, this was a technology decision based on what I had experience of and not necessarily what was best for purpose, I later implemented additional functionality using the Angular framework, which turned out to be a much more intuitive approach.

For text-based Parse content, you can edit, add and delete entries.
JQuery Sortable UI has been used to allow entries to be sorted, and this has been implemented across Facts, Photo sets, and Slides.

<img alt="Admin slide Ordering" src="{{ site.baseurl }}/rfarmer/assets/admin2.jpg"/>  
Slide Ordering differs slightly from the others in that each entry is sortable across 3 headings.

* **Static order**: for those slides which should be shown just once per run-through
* **Shown periodically**: for slides which should be shown regularly at a specified interval. This type is used for the Welcome Slide and other slides which display different content each time they're shown - e.g. Photos slide shows a different set of images each time.
* **Inactive**: Used when you don't wish to show a slide, the foyer-screen auto-advance script will skip this slide.

In addition to specifying the order of photo sets, users can add new photos and sets, configure display settings for photo slide, re-order/remove photos within a set, change set name etc.

<img alt="Admin Organise Photos" src="{{ site.baseurl }}/rfarmer/assets/admin3.jpg"/>  

## Deployment:
In the first few weeks of my placement, I created a two part script to simplify deployment of new versions of the foyer-screen application. Deployment previously consisted of transfering the repository via USB stick as the foyer screen is not connected to the internal network, and so we cannot directly pull from the internal git repository.

The first part of the deployment is a script to be run on the local machine, it requires Node and Git to be installed and should be run from Git Bash:

1. Prompts you for username and clones the latest version from Git
2. Zips and encrypts repository
3. Uploads deploy.zip to Dropbox

Part two is run on the foyer-screen itself, it should be run from the command line:

1. Archives the current deployed version
2. Downloads deploy.zip from Dropbox
3. Unzips foyer-screen repository

The scripts made use of Node libraries for dropbox access, git tools and file system operations.

As well as speeding up deployment, this was useful during development as it allowed me to view the effect of my changes in action much more quickly, flagging up any issues that a change may have caused and highlighting areas of further improvement.


## Unit Tests

In the foyer-screen application the DOM is changed using JQuery; we want to test the logic of the application but it can then involve a lot of work mocking the necessary parts of the DOM.

Working on unit testing the application has encouraged me to be more modular in my coding style, separating out testable logic from DOM manipulation and API calls as far as possible.

In developing the Admin Panel, a lot of the logic was tied into DOM manipulation and it became difficult to extract anything testable. To address this, and to add some fresh challenge to the project,
I started to take a look at using Angular for the Admin App.

### Learning Angular JS
I began with a few online tutorials to familiarise myself with the framework:

* CodeSchool's [Shaping Up With Angular.JS][CodeSchool Angular]  
A free, 5 part course from CodeSchool covering the basics of Angular.js. Each part contains a few videos in which the tutor explains an angular concept and talks through an example of using it -
Throughout all 5 levels we follow an example of creating a 'Gem Store'.

After each video the student (i.e. you), is required to complete a few exercises using the concepts they have just learned. These exercises are completed in an environment within the course, which assesses your answer dynamically.

<img alt="Shaping Up With Angular" src="{{ site.baseurl }}/rfarmer/assets/shaping-up.jpg"/>  
This course is very engaging and quickly brings you up to speed on the Angular basics. CodeSchool have other, more advanced, Angular resources and I would personally recommend Shaping Up as a great starting point.

* [Egghead.io][EggheadIO]
For a deeper level of detail, I looked at the Egghead.io website.

Their free content again covers the basics, however, there are ~60 free Angular JS videos available. These can be found on the website, or as a Youtube [playlist][EggheadPlaylist]. The videos each last anywhere between 2 - 10 minutes and are split into concepts. John Lindquist and team have done an excellent job in breaking down the creating a concise and informative course. The videos are great for beginners and I have also found that I use them as reference material almost as much as the Angular docs themselves.

<img alt="Egghead Playlist" src="{{ site.baseurl }}/rfarmer/assets/egghead.jpg"/>  
Egghead.io also has further content available for paid subscribers and new videos are uploaded to the website on a regular basis.

To run unit tests I used [Karma][karma] with assertions in [Jasmine][jasmine]. Writing these tests was very simple due to the extensive resources of examples available on the Jasmine site, and within developer communities.
Karma runs the tests each time a file is saved, allowing instant review of results.

My first impressions of using Angular was that the approach just seemed so natural. Removing the DOM manipulation from my JavaScript made Unit Testing much simpler!

It can take some time to put yourself in the 'Angular mind-set' when you're used to using JQuery but there is a very active community around Angular and so I found I could find advice on any issues I encountered on Stack Overflow or other similar resources. The docs and Developer guide on the [Angular website][Angular] itself are also very useful!

Given more time I would have re-implemented the rest of the Admin App in Angular. I found the approach much neater and more intuitive than using JQuery to manipulate DOM elements, especially as much of the functionality of the Admin App was simply to insert Parse data into the page, or save page content back to Parse.


## Next Steps
As well as various additional content ideas which would enhance the foyer-screen application, there are a number of pieces of functionality that would improve the Foyer Screen project itself:

* Hosting for the admin app:  
A user currently has to checkout the foyer-screen git repo and have node and npm installed in order to access the Admin Panel on localhost.  
It would be good if the app was accessible via URL to anyone who needed to make changes.
* Deployment via Github:
As mentioned, the foyer screen is separate to the internal network and so we cannot deploy direct from the internal git repository. Hosting the repository on a private github account would allow us to remove the need to deploy via Dropbox.
* 'Dev environment' - at the moment, all changes made to Parse affect the version deployed on the foyer-screen. For dev and testing purposes, it would be good to have a staging area of some description so that we can, for example, insert a test set of photos to test change in slide configuration before we change that config in the deployed version and without having the test set showing up on the foyer-screen. Having a separate data source for dev may be one solution, though synchronisation issues will need to be considered. Another solution would be to introduce a 'dev' type flag within the current Parse data core, so that the foyer-screen knows to avoid certain objects, but allow them to be accessed locally.

## Reflection
The foyer-screen project has been excellent for broadening my experience and building my confidence as a developer.

I found the pace at which I was progressing with the project was much faster than anything I've worked on before and so the rate at which I was learning new things was also accelerated. I feel the pace was set by the Agile aspect of the project. Being accountable for my work on a daily basis meant I was making regular tangible progress, which in turn helped maintain motivation throughout the project. I also liked the Sprint planning part of Agile, as it gave a flexibility to the project, allowing us to take it the best direction at any given time rather than being committed to one scope from the beginning.

Picking up where Mila left off allowed me experience of getting to know an unfamiliar codebase and creating the Admin Panel was a chance to create from scratch something of a larger scale than I've had prior experience of. Through this internship I have made a lot of progress with improving my previously limited web development skills, had the opportunity to try something new in picking up Angular.js and through feedback from code-reviews I have picked up a few good practices for development in general.


***
***
**Some Screenshots of the Foyer Screen**

<img alt="Photo Slide - Scatter" src="{{ site.baseurl }}/rfarmer/assets/scatter.jpg"/>  

<img alt="Photo Slide Grid" src="{{ site.baseurl }}/rfarmer/assets/GridShinobi.jpg"/>  

<img alt="Twitter - Scott Logic" src="{{ site.baseurl }}/rfarmer/assets/tweetsScottLogic.jpg"/>  

<img alt="Twitter Shinobi" src="{{ site.baseurl }}/rfarmer/assets/TweetsShinobi.jpg"/>  

<img alt="Testimonials" src="{{ site.baseurl }}/rfarmer/assets/TestimoniesShinobi.jpg"/>  

<img alt="Testimonials - long string" src="{{ site.baseurl }}/rfarmer/assets/TestimoniesShinobi2.jpg"/>  

<img alt="Testimonials - long string" src="{{ site.baseurl }}/rfarmer/assets/shinobi-showcase.jpg"/>  

[MilaBlog]: {{ site.baseurl }}/2014/08/29/foyer-screen.html
[Parse]: https://www.parse.com/
[Parse API]: https://www.parse.com/docs/rest
[CodeSchool Angular]: https://www.codeschool.com/courses/shaping-up-with-angular-js
[EggheadPlaylist]: https://www.youtube.com/playlist?list=PLP6DbQBkn9ymGQh2qpk9ImLHdSH5T7yw7
[EggheadIO]: https://egghead.io/technologies/angularjs
[Angular]: https://docs.angularjs.org/guide
[karma]: http://karma-runner.github.io/0.12/index.html
[jasmine]: http://jasmine.github.io/2.0/introduction.html
