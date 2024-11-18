---
title: Foyer Screen Slideshow - 2014 Intern Project
date: 2014-08-29 00:00:00 Z
categories:
- Tech
tags:
- Impress
- Node
- Intern
- HTML 5
- Javascript
- CSS 3
author: mkirova
layout: default_post
title-short: Foyer Screen
oldlink: http://www.scottlogic.com/blog/2014/08/29/foyer-screen.html
disqus-id: "/2014/08/29/foyer-screen.html"
summary: As an Intern in the Edinburgh office I have been involved in creating a slideshow that conveys interesting information about the company; something useful and entertaining to catch the attention of visitors in the waiting area.
---

As an Intern in the Edinburgh office I have been involved in creating a slideshow that conveys interesting information about the company; something useful and entertaining to catch the attention of visitors in the waiting area. The project is essentially a web application built with JavaScript, HTML5 and CSS3.

### Back-end

Having little experience in creating web applications I discovered [Node.js](http://nodejs.org/). Node provides a way to set up a web server with just a few lines of code and makes it possible to easily create fast, real-time network applications. It also serves as a library, providing a vast number of packaged modules for server-side use via the [Node Package Manager](https://www.npmjs.org/) (npm). One example that I personally found convenient was the [ejs Module](https://www.npmjs.org/package/ejs) which allowed me to split my HTML files into a number of small chunks (partials), providing better modularity and readability and making life much easier.

### Front-end: "Impress with Impress"

[Impress.js](https://github.com/bartaz/impress.js/) is a presentation-building tool that relies on the power of CSS3 transforms and transitions to enable creating an interactive and dynamic slideshow. It provides you with an infinite canvas and a number of cool dynamic transitions between slides to choose from.

Each slide in an Impress presentation is specified by a corresponding HTML tag with a class of "step". The slideshow visits them in order and advances forward when a key is pressed. For the purposes of Foyer Screen I wrote a script to auto-advance and loop through the show. I added a "time" attribute to each slide tag that is then processed by the script in order to determine when a transition should happen. As an additional feature the main presentation loop is interrupted every minute to show the "Welcome" screen which contains an animated version of the Scott Logic logo:

<img src="{{ site.baseurl }}/mkirova/assets/2014-08-29-foyer-screen/welcome.png" alt="Welcome Screen" class="aligncenter" />

### Content

The main ingredient in an engaging presentation is its content. The team responsible for the project wanted to include a variety of intriguing items in the slideshow. This section gives an overview of some of the screens in it.

#### Statistics and interesting facts about the company

How many employees are there overall? How many in Edinburgh? How many years has the company been in business for? How much coffee and tea does the Edinburgh office consume within a week? All of this information is stored in the [Parse Cloud](https://www.parse.com/) and fetched for the Foyer Screen using Parse's [REST API](https://www.parse.com/docs/rest). The facts are then displayed in the form of a clock-like rotating wheel which dynamically adapts to provide new slots based on the number of facts stored in Parse.

#### Blog posts

Blog posts from the Scott Logic and [ShinobiControls](http://www.shinobicontrols.com/blog) blogs are included in the presentation after parsing their RSS feeds. A short summary of each post is displayed along with information about the author and when it was posted. All of this is animated with an entry and exit animation using the library stylesheet [Animate.css](http://daneden.github.io/animate.css/).

<img src="{{ site.baseurl }}/mkirova/assets/2014-08-29-foyer-screen/blog.png" alt="Blog Posts" class="aligncenter" />

#### Tweets

Tweets for [Scott Logic](https://twitter.com/Scott_Logic) and [ShinobiControls](https://twitter.com/shinobicontrols) are presented too. The tweets fade in and out with a maximum of two shown at any one time in a two-by-two grid, with the exception of tweets containing images which appear on their own and are centred in the screen (just in case they contain a bigger image).

<img src="{{ site.baseurl }}/mkirova/assets/2014-08-29-foyer-screen/tweets.png" alt="Tweets" class="aligncenter" />

#### Images and Video, Website banners

Images and video are stored in [Dropbox](https://www.dropbox.com/), as just a URL is needed to embed them directly into the HTML for the application. This is implemented by maintaining a text file (stored in Dropbox as well) that contains all necessary URLs for the Photos Slide and is read by a script to display them. All that needs to be done to add another image or remove an existing one is edit this file.

<img src="{{ site.baseurl }}/mkirova/assets/2014-08-29-foyer-screen/quiz.png" alt="Pub Quiz Awards" class="aligncenter" />

<img src="{{ site.baseurl }}/mkirova/assets/2014-08-29-foyer-screen/banner.png" alt="Website Banner" class="aligncenter" />

#### And of course the Scott Logic Edinburgh Xbox FIFA Tournament results

Scott Logic's Edinburgh FIFA World Cup Tournament had nine participants and took place in June. All match results are stored in the Parse Cloud and I used them to create a slide for each stage: Groups, Runners-up, Semi-finals, Third-place Playoff and Final.

Each group stage slide contains a dynamic ranking table for players with six columns: Played, Won, Drawn, Lost, Goal Difference, Points. The table updates itself as match results are highlighted. Its rows are animated with CSS3 transitions to switch and place the player with more points at the top, highlighting winners at the end.

<img src="{{ site.baseurl }}/mkirova/assets/2014-08-29-foyer-screen/fifa.png" alt="Fifa Group B" class="aligncenter" />

### Unit Testing

The development of Foyer Screen gave me the opportunity to familiarise myself with creating unit tests. I chose the [QUnit framework](http://qunitjs.com/), as it is straightforward, popular and easy to use. QUnit has a [Node Module](https://www.npmjs.com/package/qunit), so that tests could be run server-side using the command prompt.

Building unit tests taught me that it is *always* a good idea to build code while relying on many smaller, simpler methods and high modularity. It is much easier to test one function at a time, also when the code is modular, less refactoring is necessary at later stages.

### What is next for Foyer Screen?

The initial version of Foyer Screen is already being used. There are several areas of future work that could extend and improve the application:

* Error handling: the application should not be attempting to refresh content if for example the machine loses connection to the Internet.
* Instead of having pre-set times for showing all slides, the presentation may be able to detect events triggered when animations within a slide have finished and move on. In this way inaccuracies with time calculations made by people can be avoided and a greater flexibility achieved in cases in which slide content will be changed in future.
* Admin functionality that will dynamically update the facts stored in Parse based on recent up-to-date information and add more graphical content to Dropbox.

### First encounter with Agile

This was my first exposure to building an applications of this size from scratch. It allowed me to discover the advantages of using Agile Methodologies and experience different aspects of Software Engineering. The Scrum framework used by Scott Logic consists of frequent iterations of development, providing a chance to do small bits of everything (design, implementation, testing) at all times. The stand-ups, planning and retrospective meetings  helped immensely in being organised and making sure the project is on the right track.

### Reflections

Even though it was challenging, Foyer Screen has been extremely useful and has helped me gain a lot of insight into web development while being fun to work on at the same time. My time at the company provided me with the opportunity to be part of a both dedicated and friendly team and enjoy the advantages of working in a real-world environment. It was an invaluable experience for a student and one that I would definitely repeat!
