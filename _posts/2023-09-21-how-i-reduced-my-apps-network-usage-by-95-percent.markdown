---
title: "How I Reduced My App's Network Usage by 95%"
date: 2023-09-21 09:00:00 Z
summary: I developed a cross-platform location sharing app and learned valuable lessons along the way. This post explores the practical strategies used to boost the app's efficiency.
image: "amcgill/assets/data-usage-comparison.png"
author: amcgill
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

---

## TL;DR

- Prefer HTTP for updating user state and WebSockets for broadcasting those changes.
- Minimise state changes to reduce the frequency of data transfers and re-renders.
- Updates should only transmit the necessary state changes, don't send the whole object!
- Handle unstable internet connections with periodic queries for missed events.
- Capture metrics from user testing early in development to help steer your mobile optimisation approach.

## Introduction

In this blog post we'll take a brief look at some of the lessons learned while creating a cross-platform location sharing app.

Why did I make this app? Well, have a think - how many apps on your phone have the ability to share the real-time location of taxis, deliveries or people? If you had the same basic functionality you could make any number of services such as games, visualisations or even a rival delivery service. You'd be surprised how much fun people can have with just the map itself ([looking at you GeoGuessr](https://www.geoguessr.com)).

The app was built with Angular using [Ionic](https://ionicframework.com/) and [Capacitor](https://capacitorjs.com/). These tools give us the ability to build cross-platform apps using native features and view components using a single codebase. With any luck, it'll be released in the near future so I'll only be speaking in relation to a subset of the core functionality:

- User authentication with Google SSO
- Share user location data with other users
- Match user location with pre-configured GPS landmarks server-side
- Render user avatars on a map and update their locations in real-time

## Findings from Test #1 with real users

During a 1 hour test with 3 users here's what I found:

- It used up a lot of battery
- Data usage was much higher than expected (2GB per device on average)
- Some of the state changes were completely missed (the app also broadcasts other important information)

Clearly it needed some rethinking before the next test group. So what went wrong?

### 1. A bad web socket integration

Can you spot what is wrong with this implementation and why it could be linked to such high data usage?

`---- show code snippet of original web sockets implementation ----`

I had accidentally nested the socket listeners inside each active socket connection which meant the number of actions scales logarithmically proportional to the number of active users. Whoops! To make matters worse, some of these actions had side-effects which triggered another re-broadcast of the data, meaning those were sent out again too. This was a small bug but a huge oversight in my original approach that used far too much data.

How did I miss this during development? Well, I:

- Only tested it for a short amount of time
- Was connected to a stable internet connection (Ethernet / WIFI)
- Was plugged into a power outlet

These are the kind of things you'll really have to think about when developing for mobile as resources genuinely are limited.

Here's what it should've looked like all along:

### 2. Frequency of data changes

I wanted location data to update as often as possible in order to display the most recent locations on the map. However, I didn't really appreciate just how much data comes in when you're constantly streaming updates from a number of users. In order to reduce the amount of data being sent, I found a happy medium of only emitting location changes after a minimum of 10 meters had been travelled. In order to retain the smooth visual transition between updates, the avatars were animated from location A to location B.

### 3. Which data is actually being sent

One that could have been improved was the content of the data that was being sent. If one of the fields in the user object updated, the whole user object was sent. As it turns out, this is a huge waste of resources. This was exaggerated even more due the high volume of updates coming from the users.

### 4. Unstable internet connections

How often do you have a reliable connection on your phone when you're out and about? Will it stay connected if you go inside a building? It's not unlikely you'll be disconnected at some point - so what happens if you miss a WebSocket update?

I didn't fancy over-engineering just yet so I settled on intermittently querying different parts of the backend to ask for various app states. More time sensitive data points were pinged more often. This was a great little trick to catch up on missed events but just to reiterate - make sure you carefully consider the frequency.

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

## A closer look at how the app works

To simplify the implementation details we'll forgo security considerations and data persistence.

### Architecture

Let's have a look at how it all comes together. Who doesn't love an architecture diagram?

(If you're not interested in the technical details then [click here](#summary) to skip straight to the summary...)

![Architecture-Diagram]({{ site.github.url }}/amcgill/assets/architecture-diagram.png "Architecture Diagram")

### The backend

Our NodeJS app runs the `index.ts` file, integrating our User Service with HTTP requests and WebSocket connections.

<script src="https://gist.github.com/mcgill-a/0a0ca48e78632f34afbf7126aeaac617.js"></script>
<script src="https://gist.github.com/mcgill-a/f3b31e11ef9be90f60f1322a3d234e96.js"></script>

- show it working with postman (already have this ready, just need to record it)

### The frontend

--TK--

- show web socket listener code
- show Google SSO login to identify the user
- show recurring fetch code to check for missed data
- show gif of icons moving on map

### The deployment

The mobile version of the app is built using capacitor and distributed to the test users via OneDrive (very high tech, I know).

The web version of the app is automatically deployed to Firebase and is set up with temporary deployments for PRs.

![Github Action adding a comment to my PR with a deployed version of the code change for testing]({{ site.github.url }}/amcgill/assets/firebase-pr-action.png "Firebase PR deployments")

The backend is automatically deployed to a Heroku Basic Dyno instance for $7/month. I was hoping to use Firebase here as well since it's free, unfortunately cloud functions do not support web sockets since they only handle a single request/response.

## Summary

I believe that these real-world tests have effectively showcased the advantages of an iterative development and testing approach. Through this process, we were able to spot issues at an early stage, gain valuable insights from them, and enhance our product. It is clear that efficiency and optimization play a pivotal role in mobile app development.
--TK-- but why - only have limited resources, need to use them as efficiently as possible

The main point to remember here is that prioritising performance is crucial in mobile app development, even when using a web framework like Angular. By applying these lessons, we can create apps that perform better, respond faster, and use less data.
