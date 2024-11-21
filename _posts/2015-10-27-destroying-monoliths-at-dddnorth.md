---
title: Destroying Monoliths at DDDNorth
date: 2015-10-27 00:00:00 Z
categories:
- Tech
tags:
- Conferences
- DeveloperDeveloperDeveloper
author: shogarth
layout: default_post
summary: Saturday marked the fifth annual DDD North conference, held once again at
  the University of Sunderland. DeveloperDeveloperDeveloper! events are volunteer-organised
  conferences where members of the community propose and vote on the agenda. ScottLogic
  took part this year as a Platinum-level sponsor. We had many fantastic conversations
  with developers from all across the country, plus our squishy rugby ball giveaways
  were very popular!
---

Saturday marked the fifth annual DDD North conference, held once again at the University of Sunderland. DeveloperDeveloperDeveloper! events are volunteer-organised conferences where members of the community propose and vote on the agenda. ScottLogic took part this year as a Platinum-level sponsor. We had many fantastic conversations with developers from all across the country, plus our squishy rugby ball giveaways were very popular!

Luckily, I managed to slack off from our recruitment stand and attend some of the great talks. As always I like to write up my impressions and pay compliments to the speakers. Overall this is one of the most diverse lineups that I've seen at a DDD event. This year's prominent topic was microservice architectures, that have been rapidly taking the developer world by storm. But there were also talks on sketchnoting, fun things to do with Raspberry Pi 2s, Deep Learning, DevOps and Usability. As the agenda is decided upon by community votes, it's always interesting to see which of the many competing ideas out there stand out from the crowd. Hopefully in the future we'll see fewer monolithic applications. Anyways, onto the talks: 

## How I became Less Terrible at JavaScript - Steve Higgs

At the time that I moved from C# into JavaScript I felt underwhelmed at the lack of basic tooling support baked into the language. Over time I started to love that as it has allowed JavaScript to prosper with innovation and experimentation. Nowadays I feel overwhelmed at the variety! But once you realise that there are key steps that you need to perform in a JavaScript toolchain, your choices become manageable.

In this talk, Steve introduced a modern-day JavaScript build toolchain. Webpack was used to facilitate modular JavaScript development, ESLint for style and error checking, Babel for transpilation so that we can utilise the language benefits of ES2015, and Gulp as a build tool to drive the entire process. Phew! The focus here wasn't on how to use this particular set of tools (although you did pick that up through osmosis), it was more about what each tool was doing to your code and why that is useful. Alternatives such as Browserify, Grunt and JSLint were mentioned to demonstrate that in JavaScript, there is no One True Path. Steve even touched on the controversial topic of CSS within JavaScript, something we'll see more of with the trend towards isolated front-end components.

JavaScript is such a rapidly-evolving environment that even experienced developers will learn something new by exploring the bleeding edge.

## Why SOA? - Sean Farmar

Sean reminded us of the big ball of mud. It's what code becomes if not regularly curated, pruned and honed. It's a product of team scaling, product growth and feature creep, under release pressures. Coupling is why this happens, but not all coupling is equal. There are many types of coupling:

* What you depend on (efferent)
* What your dependents are (afferent)
* Time (temporal)
* Deployments and endpoint locations (spatial)
* Protocols and platforms

You're not going to remove all types of coupling, but Sean covered ways of minimizing this coupling. For example, with asynchronous messaging, publish/subscribe, not hard-coding endpoints and using a "share contract and schema" mantra. Following from this Sean busted several distributed computing myths and assumptions. Your network is not secure, bandwidth may not be a problem at the moment, but when you scale it will be. For each myth, Sean described patterns for mitigation.

## Monoliths to Microservices: A Journey - Sam Elamin

A nice complementary talk to Sean's SOA talk. Sam's focus wasn't to present another microservices 101 talk. Instead this was a de-brief on an effort to decouple a monolithic application and what was discovered along the way.

Sam mentioned that all developer conferences should have a failure track. As an industry, we're unique in our ability to fail fast and learn from our mistakes. This is a great suggestion, hindsight is 2020 and there is an opportunity to learn a lot. Sam gave pragmatic advice on how to get started with microservices, if you're already living in a monolithic codebase. Don't bother re-writing everything now. Instead, the next time you need a new feature, microservice it! Over time your code will gradually migrate to a more distributed architecture. Sam's team now have 290 microservices!

The example that Sam used was adding a new payment provider (let's say PayPal) to an existing application. Along the way, Sam discussed many microservice patterns mentioned earlier in Sean's talk, such as the use of pubsub and asynchronous communication and keeping your service contracts small. Sam also impressed the audience with his team's bespoke error handling system, which tracked failure rates and if a threshold was hit, would terminate a service and flag the on-call developers of an issue. 

## React for .NET Developers - Macs Dickinson

React is currently my favourite JavaScript view engine. It's the first since Knockout that has felt right to me. React is fast but in my opinion its USP is how it encourages you to think about data flow through your application. Consider the view layer of your application as a functional transformation of the model layer, with a tiny bit of view-specific state. React is good at solving just that specific problem, rather than trying to do everything, poorly.

Macs' talk aimed to introduce React to .NET developers, most likely for use within the client-side of their ASP.NET applications. Macs justified this by looking into ASP's long history and seeing an increasing demand for rich, interactive client-side functionality, with fast load times. Admittedly, a trend not unique to .NET. Macs provided a comprehensive introduction to React, which you can do because its functionality is so incredibly specific. From creating and rendering a React component, he introduced the scary-looking-but-totally-not-scary JSX, looked at React component properties and internal state. What most impressed me was Macs' demonstration of how fast React can be, by rendering thousands of numbers (and applying CSS styles) on-screen and changing them at customisable intervals.

Macs showed how well React works in Visual Studio. It's nice! I enjoyed learning about [ReactJS.NET](http://reactjs.net/) - a tool for server-side JSX compilation in ASP.NET MVC, so that applications can benefit from server-side rendering. Hooray SEO! Finally, TypeScript 1.6 supports JSX. Macs showed that React and TypeScript in Visual Studio is a pleasant setup. A great talk to end the day.

## Summary

For the fifth year running, DDD North has been a massive success, reaching record attendance. It is now claimed to the be the largest conference of its type in the country. Such success is down to the organisers (thanks, Andy, Linda and co!) and speakers, all of whom donate their time. They are driven by a passion to build a thriving community focused on education and integration. We all have a million things to be doing on a weekend, but if possible, I'd highly recommend popping along to next year's event. I guarantee you'll learn something new and make new friends.
