---
title: Design, Data and Redux at Bristech
date: 2016-11-04 00:00:00 Z
categories:
- shogarth
- Tech
tags:
- Conferences
- Bristech
author: shogarth
layout: default_post
summary: Yesterday I attended (and spoke!) at the 2016 Bristech conference, an event aimed at polyglots, innovators and the "tech curious". It was a full house at the Watershed with over 400 tickets sold. I had a great time at the conference, attending quite a few talks myself. What made the conference interesting to me was the diverse range of subjects covered - design, security, even physics! Presented here are some brief notes and comments from the day's proceedings.
---

Yesterday I attended (and spoke!) at the 2016 Bristech conference, an event aimed at polyglots, innovators and the "tech curious". It was a full house at the Watershed with over 400 tickets sold. I had a great time at the conference, attending quite a few talks myself. What made the conference interesting to me was the diverse range of subjects covered - design, security, even physics! Presented here are some brief notes and comments from the day's proceedings.

<img src="{{ site.baseurl }}/shogarth/assets/bristech_opening.jpg"/>

## Create the right product! What happens before wireframing?

(Carl Bettag and Dave Ellender)

This talk introduced me to the notion of design research - the very early discovery phase of a project that's normally conducted before we even have a complete idea of what we'd like to build. The technique involves asking questions, developing an understanding of mental models and building a picture of how the world works. We can then use this knowledge to inform us when we wish to take a concept and design a product in that space.

The example used was the development of an insulin pump for patients with diabetes, which is designed to be worn at all times. By discussing the problem with users they realised that there was a demand for devices that can be worn but does not impact upon the patient's ability to live a normal, healthy life. This was in contrast to the other products in the space, which were competing on the features and power of their devices. Having the conversations with the users resulted in a product that was user-friendly, customisable and more successful. By identifying the problem that mattered to the users, they were able to build a product better suited to their needs.

As an approach it's incredibly appealing, especially compared to the risk of having to fix key concepts at a later stage in the project lifecycle - something we all know is difficult to achieve, costly and time-consuming.

## Linking Data on the Web

(Jen Williams)

`<a href` and you're done, right? Wrong! In this talk Jen introduced the idea of a web of linked data - which is something more than just putting data on the web. The concept was introduced by [Tim Berners-Lee in 2006](https://www.w3.org/DesignIssues/LinkedData.html) (his [TED talk](https://www.ted.com/talks/tim_berners_lee_on_the_next_web?language=en) on the subject is a very accessible primer). It involves enriching data to add meaning. Jen discussed the use of data description formats such as RDF to accomplish this, which enables humans and machines to understand more about the context of data. Search engines such as Google, Bing and Yahoo are heavily involved in this space.

Take for example a list of my speaking engagements, which could be uploaded to the web as a simple CSV data dump. Alternatively, in a linked data world this would be enriched with information about the subjects I'm speaking about, the cities I'm speaking at, the details of the event organisers and so on. These are linked through a vocabulary, which can be custom-built, but common sets do exist.

I thought this was a great talk, which was an eye-opener onto the seemingly-untapped abilities of our World Wide Web, if only we gave it a bit more of a helping hand!

# The Hitchhiker's Guide to Redux

(Sam Hogarth - hey, that's me!)

<img src="{{ site.baseurl }}/shogarth/assets/bristech_redux.JPG"/>

I have been a keen follower of the evolution in front-end application architecture that we have witnessed over the past few years, from two-way binding MVC frameworks, towards the unidirectional style popularised by Facebook with Flux. I was therefore very keen to learn Redux, which reinterprets the unidirectional application update pattern.

What makes Redux particularly interesting is that by imposing some constraints upon development, you gain several benefits. The constraints are that:

1. There is a single source of truth for your application state, as a single JavaScript object
2. The state is read-only, the only way to change it is by raising an action.
3. Updates to the state must be handled by pure functions.

Firstly, the benefit is that your state update functions are simple, predictable and therefore easily testable. Not only that, but by forcing all state updates to enter the app through a single route, it is incredibly easy to gather an audit trail of changes to the app state.

Finally these constraints provide some excellent developer productivity tooling. Using hot-module reloading (from a tool like Webpack) and Redux's developer tooling, a developer can spot a bug and see the state changes that caused the bug. It can be fixed. Your application will instantly rewind, then replay the same set of state changes, to then verify the bug is fixed. This is known as time-travel debugging.

It was great fun speaking to a packed-full audience, who provided an excellent range of questions!

# Delightful UX for Distributed Systems

(Mike North)

Mike covered one of the core problems of the distributed age - what happens when a user goes offline, or suffers poor network connectivity, or even switches from a mobile device a web interface? In today's world distributed systems are commonplace, our user experience therefore needs to address these concerns. With examples, Mike demonstrated how taking into account the distributed, asynchronous nature of his application in the core user experience led to a more fault-tolerant system. It also improved the more general user experience. The take-home message was four rules:

1 - Keep users in the loop. If there's some long-running job that needs to be performed, indicate to the users that the task is in progress. If a user is offline, let them know their data has not yet synced to the server.

2 - Loosely couple - reliability breeds trust. If your application speaks to a third-party, you risk being coupled to their uptimes and downtimes. In Mike's case, this caused a significant impact upon their user onboarding times. Their solution was to separate what needs to be done now, from what can be potentially done later.

3 - Limited offline support is okay - a key concept here, a mobile application during "offline" mode doesn't need to provide the bells and whistles experience. Dropping back to a limited feature set is acceptable to users. Determining what features can be temporarily disabled also helps identify the critical path in your application.

4 - Don't wait for "perfect" - the solution is always around the corner. Right now, service workers are looking increasingly promising for running tasks in the background for web applications and providing some offline support. But they aren't fully supported everywhere. Rather than waiting for the perfect solution, build something with the technology that exists now.

# Thank You

<img src="{{ site.baseurl }}/shogarth/assets/bristech_twitterwall.JPG"/>

Bristech was a huge success. It had excellent organisation, an interesting line-up of workshops and seminars and a wonderful set of attendees. I'd like to extend my thanks to the organisation team for hosting the event. If you're in the region, Bristech hold a yearly conference plus monthly meetups. I highly recommend paying them a visit!


