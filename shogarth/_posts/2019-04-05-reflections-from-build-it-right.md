---
author: shogarth
title: Reflections from Build IT Right
tags:
  - Conferences
  - BuildITRight
categories:
  - Tech
layout: default_post
summary: "My personal reflections on the sessions that I attended at the 2019 Build IT Right conference. Continuous Delivery, embracing conflict and fighting entropy."
---

Yesterday I attended Build IT Right, just around the corner from the Newcastle Scott Logic offices. Advertised as a conference to adapt to emerging patterns, it certainly delivered on that promised, turning out to be one of the more thought-provoking events that I've attended in a long time.

Normally I report conferences by covering each of the sessions that I attended. The sessions I attended yesterday were great, so I extend my thanks to *Dave Farley*, *Jesse Cary*, *Bartosz Jedrzejewski*, *Timandra Harkness*, *Stephen Mounsey* and *Gary Fleming* for some insightful talks. But, I'm going to do it a bit differently this time, take a step back, and reflect on some of the larger trends that emerged.

<img src="{{ site.baseurl }}/shogarth/assets/builditright/stage.jpg" />

## Continuous Delivery Is Your Future
Last year, I read Jez Humble and Dave Farley's "Continuous Delivery" book and then quickly flew through "The Phoenix Project", "The DevOps Handbook" and the more recent "Accelerate". These books have been a real light bulb moment for me, clarifying some of my own thinking on how to build software. The fundamental idea is the continuous delivery of value to our users (and therefore to our business). Achieving this is a root-and-branch transformation of an organisation's approach to software development and delivery, with the added side-effect that we create infrastructure which is reliable, environments that are repeatable and production releases that are uneventful. All this while giving us the means to rapidly iterate and experiment with our product.

Many who have worked in larger organisations will be familiar with spending hours in "go / no-go" meetings. During these meetings senior team members assign risk values to a set of features in a release candidate build, then make a judgement call on whether the business can "afford" the risk. For a long time such meetings and processes have seemed to be designed to slow down delivery. The only truly "safe" form of software delivery is to not deliver at all. Under this philosophy, attempting to release anything is actually an exercise in box-ticking, form-filling and pleading with stakeholders to agree sign-off. Make no mistake, software is a risky business. There's always the risk that a production release causes an outage, a financial loss or reputational damage. But traditionally teams have fallen into the trap of releasing less often as a way of mitigating the risk. Actually, they're compounding it by doing so. Releases become a big deal, a huge event, with lots of ceremony and lots of features being dumped into production in one large chunk.

A core principle of Continuous Delivery is that if it hurts, do it more often. Get good at it. Refine the process, make it as simple as it needs to be. Make it boring. Remove the humans in as much of the boring stuff as you feasibly can - their time and attention is better spent on things that humans are good at, like creativity and exploration, rather than repetitive and laborious run-books.

A Continuous Delivery Pipeline is the process by which an individual commit to your repository can work its way into production. You can consider this an extension of Continuous Integration. A commit turns into a built version of your application, which is itself a release candidate. We run the release candidate through a series of quality gates - each acting as a falsification mechanism. Release candidates are rejected if they fail to meet certain criteria. It's common to see automated unit, integration and system/acceptance level testing quality gates, in addition to security audits and manual exploratory testing. Running a quality gate may require the automated set-up and deployment to an environment. To satisfy this as a team, we need to refine our DevOps abilities. We can't have [snowflake servers](https://martinfowler.com/bliki/SnowflakeServer.html) which are long-lived and whose configuration becomes increasingly opaque and immutable.

All of this is designed to reduce risk whilst delivering to production safely and sustainably. Ideally, release candidates which pass all of your quality gates can be released to production. That step itself can be automated! Incredibly large organisations have cycle times (a measurement of how long it takes an idea to get from conception to production) in the order of *minutes*. We don't know which version of Amazon we're using, the concept is so alien to that platform. End users don't really need to know what version of Chrome they have - it's just "the latest". Adopting this mindset is incredibly powerful, because if you can get good quality code into production this fast, you're not accumulating risk over time. To the risk-based gatekeepers out there, there's still no guarantee the software that will be used by end users will be bug free (it's mathematically impossible anyway). But by passing the code through the quality gates, we've verified it against our known risks. Furthermore, the releases that will be produced from this pipeline will be inherently smaller and therefore inherently less risky than the old large weekly/monthly "drops" into production.

To achieve this as a development team, we must also think about how we develop. We must integrate more often. Long-lived branches are almost unthinkable under this paradigm. Therefore, this necessitates practices such as [trunk-based development](https://trunkbaseddevelopment.com/), being able to place features behind [toggles](https://martinfowler.com/articles/feature-toggles.html), being able to perform rolling upgrades through [blue/green deployments](https://octopus.com/docs/deployment-patterns/blue-green-deployments). I will go in-depth into these topics through a later series of blog posts, but for now, let's appreciate how _agile_ this all feels.

## Embracing The Conflict Inherent To Agile
These processes are, effectively, an application of the Scientific Method: making observations, formulating a hypothesis, devising an experiment and measuring the outcomes. When put on repeat this algorithm has driven the rapid development of our species. When it comes to software, it inherently leads to conflict.

With the engine of Continuous Delivery providing a framework for experimentation and our attention freed from laborious production deployments, we have time for creative innovation. The members of an agile team all have their own priorities, their own incentives, their own personality traits. Conflict arises when these pull in different directions. Effective agile teams can work through conflict to form consensus. Visibility, accountability and transparency are key aspects here, allowing teams to work through their problems.

Agile teams are the foundry of software development. Teams that embrace conflict in order to resolve it become the lubricant of your business value stream, helping you deliver to customers more effectively.

## Entropy Is Also Your Future - If You Let It Be
Entropy, the gradual decline of order and predictability into disorder. Closed systems, according to the laws of thermodynamics, are doomed to this fate. Is our software too?

<img src="{{ site.baseurl }}/shogarth/assets/builditright/entropy.jpg" />

The practices of continuous delivery fight against the forms of entropy our software can run up against. Operating systems, programming languages, frameworks, libraries all get updated. Older versions fall into maintenance windows and then obscurity. If we don't keep up to date, we inherently make our system harder to work with and more difficult to change. But there are other forms of entropy we must think about: people leaving teams, the setup of your developer machines. Knowledge risks being transient - stuck in certain team member's heads, hidden in configuration files and small patches. If those team members leave, or if you need to set something up from scratch you can be often left wondering "why are things this way" and never knowing. Bodge jobs become permanent. Entire sections of domain knowledge just vanish.

We must think of ways and means to prevent the entropy. The only way we can do this is turning the closed system into an open one. That is, to put energy in. To do work to make things last longer, make our processes and systems more resilient, make our architecture more adaptive to change.

## Conclusion
A realisation that I made is the Humble/Farley book was published 9 years ago. The Agile Manifesto is 18 this year, that's old enough to drink in pubs. These ideas aren't new. They're tried and tested with an ever-increasing data sample. Adopting these techniques are still considered the bleeding-edge of software delivery, but I suspect that is because the trailing-edge often trails by several decades. Your future in software engineering will be working with teams practising Continuous Delivery and we'll be better as an industry for it. Should you not be adopting these practices, your software risks being overcome by entropy, increasingly intolerable to change and requiring more and more (highly-paid) specialists to maintain it. Our world is a fast-moving one. We are uncovering better ways of developing software by doing it and helping others to do it.

This is the first conference in a long time that has really shaken up the way that I think about software and for that I extend my thanks to the Build IT Right organisers for putting on such an excellent event!
