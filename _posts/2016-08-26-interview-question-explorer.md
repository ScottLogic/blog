---
title: Interview Questions Explorer - Edinburgh Interns 2016
date: 2016-08-26 00:00:00 Z
categories:
- Tech
author: jfriel
title-short: Interview Question Explorer
summary: 'An overview of the Edinburgh Interns summer project: A react application
  to filter and search interview questions stored on Google Drive'
layout: default_post
---

As the Edinburgh branch of Scott Logic's 2016 intern cohort,
 Jamie Connelly and myself have spent the last 12 weeks building an online interface to the extensive library of interview questions we have in the office.


## The Problem

Our task was to take the current paper library and build a searchable digital library of interview questions that Scott Logic currently uses.
Some of our aims for the project were to help minimise the frequent reuse of interview questions, collocate questions and their answers and to easily maintain information about the questions.
Prior to our time at Scott Logic, Jamie and myself considered ourselves backend developers, so building a client side interface was an exciting new challenge.



## Google Drive

One of our first tasks was to build the interface to our backing store, Google Drive.
Google Drive allows you to apply custom properties to documents through their API,
which is ideal for a document tagging and searching system. For an interface to this system,
we build an [express.js](http://www.expressjs.com) backend to access, update and serve the metadata of the Google Drive files,
all of which is accessed through a RESTful API.


Here's a look at what a library entry looks like.

~~~ json
  {
    "id": "0B1HQ9RC",
    "name": "Foo Bar",
    "docType": "question",
    "category": "coding",
    "questionLink": "https://drive.google.com/file/d/0B1HQ9RC",
    "blackball": false,
    "displayName": "Foo Bar",
    "hasAnswer": true,
    "answer": {
      "id": "0B1HQ9RC",
      "link": "https://drive.google.com/file/d/0B1HQ9RC"
    },
    "jobroles": [ "Intern" ]
  }
~~~


## The Backend

This stage of the internship allowed us to familiarise ourselves with all the tools and procedures used in the office:
 Code Reviews, Continuous Integration, Unit Tests, how to use an aeropress along with all things Javascript and an introduction to the Agile development process.
We were given the freedom to shop around for the tools and modules we felt would be best for the project.
After some umming and ahhing and much guidance from  our mentors,
 we settled on [Tape](https://github.com/substack/tape) for testing
 and [Underscore](http://underscorejs.org/) for writing functional style Javascript.

## The Frontend

In the sprints following backend completion, our project manager suggested we use [ReactJS](https://facebook.github.io/react/) for the frontend.
Cue every [Dan Abramov](https://twitter.com/dan_abramov) tutorial (several times),
multiple rewrites and a power cut until it finally clicked and we had the Interview Question Explorer v0.01
(There might be a reason we weren’t hired as UX Interns).

<img src='{{ site.baseurl }}/jfriel/assets/firstpass.png' alt='original demo with mock data'/>


Now you can’t just use ReactJS by itself, that would be too easy...  
So the frontend is a combination of ReactJS, Underscore and Bootstrap bundled up using Webpack with
a combination of [Enzyme](https://github.com/airbnb/enzyme) and Tape for testing.

## Combining The Services

<img src='{{ site.baseurl }}/jfriel/assets/schema.png' alt='Diagram of how services connect to one another'/>   



  Throwing our application into Docker containers was really useful,
  allowing us to experiment with new technologies without worrying about integration with the internal systems.
  Splitting the application into three containers, 1 for the backend, 1 data container holding our Webpack output and one for the nginx server made testing and development really simple.

## Improving The Look   

<img src='{{ site.baseurl }}/jfriel/assets/css-is-awesome.jpg' alt='the Mug In Question' align='left' hspace="20" style="margin-right: 10px"/>




It was at this point that I regretted my choice of mug,
as we discovered why developers aren’t the ones in charge of design when trying to make the application a bit more user-friendly.
Fortunately Scott Logic's UX team are based in the Edinburgh office and were quite happy to give us some pointers. Their input
prompted a large redesign of the user interface, giving us a design much more akin to a finished product.

<img src='{{ site.baseurl }}/jfriel/assets/final_app.png' alt='The Final application' align='right' style="margin-bottom: 10px"/>   





## Retrospective

  While we consider the project a success, learning more than we imagined possible along the way,
  the project is still rough around the edges with a few improvements and features we would have liked to have added:

<ul>
  <li>OAuth2 with all Scott Logic accounts to get real analytics on question data</li>
  <li>Improved deployment with persistent layers on the server-side</li>
  <li>A suggestion slackbot for our company wide slack team</li>
  <li>Improve UI and usability</li>
</ul>

 With that being said, the project will continue to be upgraded and maintained within the office and hopefully be coming to an interview near you soon.

  Finally, we cannot thank our mentors and Scott Logic as a whole enough for guiding us through the learning curve of real software development and for this invaluable experience.
