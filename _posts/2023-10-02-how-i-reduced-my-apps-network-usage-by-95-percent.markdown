---
title: How I Reduced My App's Network Usage by 95%
date: 2023-10-02 00:00:00 Z
categories:
- Tech
tags:
- Angular
- Ionic
- Capacitor
- TypeScript
- JavaScript
- NodeJS
- WebSocket
- Network
- Android
- Mobile
- Native
- App
- Data
- Frontend
- Backend
- Optimisation
summary: I developed a cross-platform location sharing app and learned valuable lessons along the way. This post explores the practical strategies used to boost the app's efficiency.
author: amcgill
image: "/uploads/How%20I%20Reduced%20My%20App's%20Network%20Usage%20by%2095%25_.png"
---

## TL;DR

- Prefer HTTP for updating user state and WebSockets for broadcasting those changes.
- Minimise state changes to reduce the frequency of data transfers and re-renders.
- Updates should only transmit the necessary state changes, don't send the whole object!
- Handle unstable internet connections with periodic queries for missed events.
- Capture metrics from user testing early in development to help steer your mobile optimisation approach.

## Introduction

In this blog post we'll take a brief look at some of the lessons learned while creating a location sharing app for mobile and web. There's a lot you can do with real-time geolocation data, but I settled on a local exploration app for small groups of friends. With any luck it'll be released in the near future so I'll only be referencing a subset of the core functionality:

- Share location data with other users
- Match location with pre-configured GPS landmarks server-side
- Render avatars on a map and update user locations in real-time

Here's what that looks like in action (sped up for demonstration purposes):

![User-locations-on-a-map]({{ site.github.url }}/amcgill/assets/map-markers.gif "User locations on a map")

The app is written in Angular and leverages native mobile features using [Ionic](https://ionicframework.com/) and [Capacitor](https://capacitorjs.com/). You can find [details of the architecture and deployment at the end of the article](#bonus-content-a-closer-look-at-how-the-app-works) but for now let's jump right into the findings from initial user testing and find out where I went wrong.

## Findings from Test #1 with real users

During a 1 hour test with 3 users here's what I found:

- It used up a lot of battery
- Data usage was much higher than expected (2GB per device on average)
- Some of the state changes were completely missed (the app also broadcasts other important information)

How did I miss this during development? Well, I:

- Often tested with one user (myself)
- Only tested it for a short amount of time
- Was connected to a stable internet connection (Ethernet / WIFI)
- Was plugged into a power outlet

These are the kind of things you'll really have to think about when developing for mobile as resources genuinely are limited. Clearly it needed some rethinking before the next test group. So what went wrong?

### 1. A bad web socket integration

I made a silly mistake in my original backend WebSocket implementation. Can you spot it?

<script src="https://gist.github.com/mcgill-a/864fd946b0fd215437b77f0087ccb6b8.js"></script>

As it turns out, this is a really bad place subscribe to anything. Every time a new user is connected, it'll subscribe to event observables again (even if we're already subscribed). This meant every new update was broadcasted repeatedly, matching the number of users.

Here's what it should've looked like all along:

<script src="https://gist.github.com/mcgill-a/93aa75c0538b6feef73f85349adca409.js"></script>

This was a small bug but a huge oversight in my original approach that consumed far too much data. Having realised this I also decided now would be a good time to switch outgoing Client requests from WebSockets to HTTP. Just because it's possible to send data both ways doesn't mean you have to for everything!

Although this bug was the worst offender, there was still more to consider:

### 2. Frequency of data changes

I wanted location data to update as often as possible in order to display the most recent locations on the map. However, I didn't really appreciate just how much data comes in when you're constantly streaming updates from multiple users. In order to reduce the amount of data being sent, I found a happy medium of only emitting location changes after a minimum of 10 meters had been travelled. In order to retain the smooth visual transition between updates, the avatars were animated from location A to location B.

### 3. Which data is actually being sent

Now that we've reduced the frequency of the data transfers, let's also consider what we are actually sending. I had originally opted to just send the entire user object every time anything in it changed. However, with such high volumes of (albeit mostly duplicate) updates, you can quickly see why it's an issue worth addressing! I resolved this by switching to partial object data transfers across the entire app, meaning each request is a fraction of the size.

### 4. Unstable internet connections

How often do you have a reliable connection on your phone when you're out and about? Will it stay connected if you go inside a building? It's not unlikely you'll be disconnected at some point. Sure enough, this happened in the first test. So what should you do if a user misses a WebSocket update?

Conveniently, [Ionic has a Network API](https://ionicframework.com/docs/native/network) built in so you are able to detect changes to network connectivity relatively easily and had I known about this at the time I would've used it. Instead, I opted for intermittently querying different parts of the backend to ask for various app states. Some data points are more time sensitive so those were pinged more often. This was a great little trick to catch up on missed events but just to reiterate - make sure you carefully consider the frequency.

With these issues addressed and additional features added to the app, I ran another test with real users.

## Findings from Test #2 with real users

During a 2 hour test with 9 users here's what I found:

- Battery usage was lower than before 👏
- Data usage was much lower than before (using 100MB per device on average) 👏
- If a user missed an update from the web socket, they received it shortly after 👏

## A comparison of the performance between Test #1 and Test #2

![Data-Usage-Comparison]({{ site.github.url }}/amcgill/assets/data-usage-comparison.png "Data Usage Comparison")

The second test lasted twice as long, had three times as many users, and we still managed to use 95% less data? Nice!

Don't get me wrong - some bugs still cropped up, but that first test revealed many issues that I was able to address before the second test. This is why we test things in the real world with real users! If there's a bug, they'll probably find it.

## Conclusion

I believe that these real-world tests have effectively showcased the advantages of an iterative development and testing approach. Through this process, we were able to spot issues at an early stage, gain valuable insights from them, and enhance the final product.

It is clear that since we only have limited resources, we need to use to use them as efficiently as possible. No matter how great your app is, if your app unnecessarily drains their battery or eats up their data, people probably won't use it.

## Bonus content: a closer look at how the app works

To simplify implementation details we'll forgo security considerations and data persistence in these examples.

### Architecture

Let's have a look at how it all comes together. Who doesn't love an architecture diagram?

![Architecture-Diagram]({{ site.github.url }}/amcgill/assets/architecture-diagram.png "Architecture Diagram")

### A NodeJS backend

All we need for the backend is [a service to hold the user information](https://gist.github.com/mcgill-a/711607e67bd6877cb04be44fa52bcdfa#file-user-service-ts) and [a controller to communicate with the users](https://gist.github.com/mcgill-a/c9f01e36196a983019c151b33c859ad1#file-index-ts).

In the gif below, we can see that our actions (join, leave, and update position) are broadcasted in real-time over WebSockets.

![Postman-Web-Socket-Example]({{ site.github.url }}/amcgill/assets/postman-web-sockets.gif "Postman Web Socket Example")

### An Angular frontend

There's a lot of moving parts in the frontend, here's a snippet of some interesting bits:

- [Tracking user location (code)](https://gist.github.com/mcgill-a/db12926331f47f3a8672a996b9067a12)
- [Listening to WebSocket changes (code)](https://gist.github.com/mcgill-a/9c3614132b842f217fa8c97bdfa43e0e)
- [Updating user data (code)](https://gist.github.com/mcgill-a/7f92a1d32fed02b5dd4541ba53483aed)

Finally, we can use [Angular Google Maps](https://github.com/angular/components/tree/main/src/google-maps#readme) to render the updating locations of the user avatars.

### The deployment

The mobile version of the app is built using capacitor and distributed to the test users via OneDrive (very high tech, I know).

The web version of the app is automatically deployed to Firebase and is set up with temporary deployments for PRs.

![Github Action adding a comment to my PR with a deployed version of the code change for testing]({{ site.github.url }}/amcgill/assets/firebase-pr-action.png "Firebase PR deployments")

The backend is automatically deployed to a Heroku Basic Dyno instance for $7/month. I was hoping to use Firebase here as well since it's free but my understanding is that cloud functions do not support web sockets since they only handle a single request/response. There's probably a way around this but that's a problem for another day. Thanks for reading 🙂
