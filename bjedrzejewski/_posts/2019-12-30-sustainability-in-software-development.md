---
published: true
author: bjedrzejewski
layout: default_post
title: Sustainability in Software Development
summary: Delivering software fast and with as few bugs as possible is not an easy thing to do. Developers often blame the lack focus on technical debt for a buggy solution, while testers point to well... lack of testing. In this blog post I will talk about the idea of "sustainability" in software delivery and how thinking and using it may make your project more successful. 
categories:
  - Tech
---

##More than just features / The "curse of Scrum"

Most software projects are created to satisfy certain client requirements. This "client" does not have to be an "external entity",
it can be simply a person acting as a "product owner", or even your employer. In some cases, you can be both "client" and developer
if you are working on your personal project. In any of these cases thinking about "sustainability" of your development process
should help you.

Before exploring sustainability (from now written without ""), let's think about the consequence of a client existing in
your development project. With a client come requirements and with requirements inevitably we have features. This is of course
perfectly normal and harmless... unless you and your team start to work only on features and nothing else. I believe this
problem got a lot worse with the popularisation of the Scrum development method...

"The curse of Scrum" is what plagues numerous software projects nowadays. Of course, it is not the Scrum itself that is
at fault here, rather than its misuse as a way to block any sustainability-related work. With Scrum, we want to make work visible.
With that comes accountability for every work item that is being done... And here we have a problem- often, any piece of work
that is not directly related to delivering business functionality is questioned and needs to be explained to the business
owner of the project. This blocks any work on technical debt, security, automated testing etc. I call it "the curse of Scrum".

Don't worry though, as not all the projects are doomed, and the curse can be lifted! Healthy development practices can be
restored. Read on and I will do my best to help you in achieving this feat.

##In the beginning, there was technical debt

<img src="{{ site.baseurl }}/bjedrzejewski/assets/sustainability-in-software-development/galaxy.jpg"
alt="space and start"/>

The idea that we should be working on more than just features isn't new. In fact, people often express it under the
name of "technical debt". I will assume that the reader came across this term so I will focus on how
it usually plays out in reality.

Developers define multiple tickets for fixing problems in the future, these end up in a backlog and if time permits some of them
are being worked on. There are a few problems with this approach.

First, there is often disagreement of what is and what isn't a technical debt. This is quite problematic, as some work would
clearly benefit the project (let's say improved monitoring), but most will not consider it a technical debt and the client
usually values it much less than say, the support team.

The second issue is that these tickets often need to be justified on a case by case basis every agile iteration. This can wear
the team down and may result with the work being ultimately abandoned.

As you can see the technical debt is a useful concept, but rarely enough to significantly change the engineering practices
in a running project.

##The difficult conversation

To fix the problem, one should start with a conversation including the key stakeholders in the project. I would recommend
framing this conversation in terms of "development practices", "sustainable work" and keeping up the pace rather than focusing
on "technical debt". While "technical debt" sounds good to developers, many business people will be very happy to stay "in debt"
for extended periods of time.

You should highlight that the team needs some amount of time (I would recommend 20% on average) to focus on maintaining and
improving the speed of development. It is important to put emphasis on speed here, as this is really all about delivering
working software fast. It is like having your cake and eating it.

There is a misconception that to go fast you need to reduce quality. It is actually quite opposite- to be able to go fast
with a software development project you need to keep quality level high. While the jury is still out on the existence of 10x developers
(developers 10 times faster than the average developer), it is quite clear that there exist 10x companies and products 
(the first time I saw a reference to that was in "Peopleware" by Timothy Lister and Tom DeMarco which I really recommend).
The existence of 10x products and companies (these that can deliver feature 10x faster) should really wake up the business
stakeholders.

Assuming that you can start implementing/including your sustainability work, either through organised ticket or reserved
time, how do you get about choosing what to focus on?

##The technical lead and the tech council

It is important to have someone in the team with a big-picture understanding of the project and technologies used. This
person (or a few people, depending on the size of your project) will be the tech leads primarily responsible for driving
this sustainability work. That means identifying and prioritising different work items.

If you are working in a team, it is important to hear all the voices, as you may have sustainability problems that you
are simply not seeing. One technique that I see working is to create a "technical council" (or another fancy name) meetings
where a wider group can contribute and discuss sustainability issues that could improve or jeopardise the delivery.

With these two ingredients, you should have a good way of surfacing and prioritising sustainability issues and opportunities.

##Elements of sustainability

With the organisational parts out of the way, it is time to focus on what things constitute the 20% (or maybe more!)
sustainability work that you should be doing.

Before going into specifics, make sure that you also think about your project and what makes it unique. It is possible to have
work that will make or break your project that is not being recognised here.

The items below constitute what I think are the most common areas of potential improvement.

###Technical Debt

Technical debt becomes only a part of the sustainability work. The common types of tech debt are:

* Refactoring bad code
* Updating old libraries
* Removing dead code
* Incorrect naming and log messages
* Introducing better tools and techniques
* Cleaning up code not following agreed standards
* Fixing technical defects
* Many more...

It is difficult to give you an exhaustive list of what technical debt is, as there are competing definitions, and some
would argue that the whole sustainability area should be just considered "tech debt". I don't like this approach as it
is misleading to many and often results in circling back to "the curse of Scrum" mentality.

You don't want things to be dismissed simply because they are "only" tech debt.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/sustainability-in-software-development/old-machinery.jpg" 
alt="some old machinery"/>
<p style="text-align:center;"><b>I don't know what it is, but it looks like technical debt feels</b></p>

###Automated Testing

Another area benefiting from this approach is automated testing. Writing some automated tests should be standard in
most cases when working on features. However, even if you follow that practice you are likely to end up with areas that
will benefit from some concentrated testing effort.

You can think of introducing consumer-driven contracts or improving the way you test your APIs. If you are working on
microservices/cloud-based application, you may even consider some "chaos engineering". There are multiple ways to ensure
that your application is well tested and if you have test specialists on your team, make sure to use their expertise.

###Testability

One thing is writing automated tests, the other is making your application more testable. Adding logs, improving APIs,
refactoring code may result in an application that is much easier to test.

This is a prime example of sustainability, as it is doing work that will benefit the project moving forward, by making it easier
and faster to write robust tests.

###Monitoring

Making application easy to support is a very important aspect of sustainable software development. It is difficult to focus
on creating new features when the team's focus is constantly on firefighting issues or false-alarms that arise when
running the application in production.

Common ideas for improved monitoring and support are:

* Introducing a robust monitoring solution like the ELK stack
* Creating monitoring dashboards
* Adding alerting capability
* Improving logs created by the system
* Improved health checks
* Creating a reliable, resilient architecture

It is good when many suggestions come from within the team, rather than a list of external requirements, as often the
the delivery team knows best what would be beneficial for good monitoring.

Another good practice is involving the development team in support and monitoring, as it may lead to identifying some
quick wins.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/sustainability-in-software-development/kibana.png" 
alt="screenshot of Kibana dashboard"/>
<p style="text-align:center;"><b>This is an example of Kibana dashboard</b></p>

###Documentation

Documentation is sometimes seen as a "dirty word" by developers. The problem is that often, there is quite a lot of
documentation being created with a considerable effort that is never used/maintained/looked at again.

The key here is focusing on creating useful and valuable documentation. Things such as:

* Onboarding documentation for new joiners
* High-level architectural diagrams
* List of services and their descriptions
* Coding standards
* Development practices
* Other documentation that is deemed useful

I do not advocate creating documentation for the sake of documentation, but there are cases where some can be really useful.
Ultimately it is up to the team and other stakeholders to decide what is and what is not useful.

###Tooling

Having a good development experience is often as important for sustainability as having a good codebase. With that in mind
making sure that you are using the right tools becomes an important part of delivering the project.

Spending time on your CI/CD, communication tools, even making your project more IDE friendly can all be worthwhile efforts.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/sustainability-in-software-development/blue-ocean-jenkins.png" 
alt="screenshot of the Blue Ocean Jenkins"/>
<p style="text-align:center;"><b>The Blue Ocean Jenkins looks great</b></p>

###Everything else

The point behind the term "sustainability" is to let your team decide what helps you deliver working software quickly. With this
in mind think if there are other areas that don't clearly fit into the "feature" or "tech debt" buckets that you should be working on.

##Sustainable delivery and 10x companies

I hope this article will make it easier for you to advocate for sustainability work to be in your project. The concept of 10x companies
really stuck in my mind and it is something that I advise sharing with others. Doing sustainability work is the way
to awake the unicorn sleeping in your project.