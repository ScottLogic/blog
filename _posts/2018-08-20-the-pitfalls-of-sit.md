---
title: 'The Pitfalls of SIT '
date: 2018-08-20 00:00:00 Z
categories:
- Testing
tags:
- Testing,
- System
- Integration
- Testing
author: croberts
layout: default_post
summary: System Integration Testing can often be very complex. This article aims to explore some of the common pitfalls of SIT and aid in preventing or overcoming these.
image: ''
---

Doing SIT at an enterprise level can be time-consuming, expensive, badly planned and provide negligible value to the end user for the weeks of effort put in. System integration testing can be one of the most complex parts of the software development life cycle (SDLC). But here I am to tell you how with a bit of preparation and a lot of thought you can drastically improve and get your SIT right.

System Integration Testing (SIT) ensures that all the subcomponents in a system are integrated successfully by verifying that the modules in a system interact as expected. As shown in the diagram, there many integration points to consider when testing, this is why it can be so complex.

<img src='{{site.github.url}}/croberts/assets/SIT1.png'/>

Your programme team has highly skilled developers producing amazing code and a great deployment team releasing it, so you should support their work by carrying out well planned and well executed SIT.

##Planning and Preparation

###Test Artefacts

There can be a multitude of test artefacts that you need to get in place before commencing with testing such as access:

- Users
- Data
- Configurations
- Environments

Often these cause issues such as delays when not setup properly. Although this can affect all test phases, it can be particularly hindering to SIT.

If something is missing or configured incorrectly, it could take a lot of steps to figure out what the cause is. This investigation could look something like this:

<img src='{{site.github.url}}/croberts/assets/SITflow.PNG'/>

Tests will pass locally or in some environments but not others. A line we are all familiar with, ‘but it worked on my computer.’ Not helpful! A lot of the time this can simply be down to the way the other system or environment has been set up which can be easily avoided by documenting the setup and preconditions so that they can be replicated consistently. These can even then be automated if necessary, particularly for running on a CI server. By documenting these things, it can avoid pitfalls that are preventable.

<img src='{{site.github.url}}/croberts/assets/SIT2.png'/>

###Data

SIT often needs the most complex data set of all testing. If the data is incorrect then this can be one of the most problematic parts of your environment to fix.

The data needed can:

- Be from multiple sources
- Have interdependencies that may be known or unknown
- Be time or date dependent
- Be needed in high volumes
- Have regulatory conditions around it
- Have encryption requirements
- Be either static or constantly changing 

And these could just be the tip of the iceberg depending on your design.

###Late Involvement

One of the big pitfalls that can actually determine how SIT will go, testers doing the SIT being brought in later on. It is common that a tester may be brought in after the development is underway. For a tester to be the most valuable they can possibly be, the earlier their involvement the better. This is how they are able to gain the relevant domain and tech knowledge for the product. Putting someone who has had no involvement in the designing stage of the product or developing the acceptance criteria, in control of defining a test strategy for SIT for a complex system with complex environments, might seem ridiculous to many. However it happens. Testers will be able to perform higher quality SIT if they are involved from the very start as they will more likely be an expert in that product.

###Writing Test Cases Too Early

There can also be issues when writing test cases too early. It is important to note that test preparation is encouraged as early as possible. You can start planning test activities, such as what you might want to test and tools you might want to use so that you can start to formulate a strategy. There is a risk that people can be too focused on getting test cases created in high volume rather than thinking about what they actually want to achieve with their testing. You can have the relevant conversations so that you can understand what tools and tech others are planning to use for development etc. However when planning you need to be realistic and allow for flexibility due to changes. When starting to design your tests, it is vital to keep in mind that they will evolve in line with any design changes.

##Execution

###Writing Too Many Tests

Some testers can write too many tests for integration testing. If you have a well structured approach to your testing, then SIT should become a less onerous layer of testing, as there should be solid assurances that come out of the unit testing coverage. The SIT should come after the components have been tested individually, otherwise the testing could be failing because they simply fail on their own. The test pyramid demonstrates the testing layers. Integration tests can be costly to create and maintain, therefore it is not about quantity, but rather quality. Furthermore, you want to be able to feedback with a relatively fast turnaround speed rather than having to wait for numerous tests to run before being able to do so. Otherwise this can slow down various activities in the SDLC.

<img src='{{site.github.url}}/croberts/assets/SIT3.png'/>

###Not Using Modern Testing Methods

People can be afraid to use modern testing methods when SIT, such as exploratory testing. In reality, methods like this can assist with SIT. Exploratory testing in particular can be extremely useful when your test team is unfamiliar with the system you are testing. It can help with the learning part of the planning phase so that they are quickly able to become familiar and understand the system they are testing.

###Lack of Error Handling in Automation Tests

It can be extremely beneficial, in both long term cost and time, to automate SIT. When doing so, it is important to have appropriate error handling in your automation code, otherwise it may not save you much time at all. We are human, we are bound to make mistakes here and there when writing our tests. Tests can sometimes fail and we have absolutely no idea why. Instead of setting yourself up for a fail, you can avoid the potential issues you might have. It can save you a lot of time and frustration trying to figure out why your test or tests have failed. It is worth spending the extra time to begin with, rather than creating more work for yourself later on.

<img src='{{site.github.url}}/croberts/assets/SIT4.png'/>

###Deciding what to Automate

A vital decision for SIT is deciding what to automate. Although automation can be highly beneficial and effective, there are also instances when automation is not the way forward. There is not necessarily always a benefit to automating. For example:

- When human interaction is needed (such as for look/feel of an application)
- When data is constantly changing
- When code is constantly changing
- If something is unstable
- When it is not cost effective
- When it is not time effective

However when these are not the case and the tests are going to be repeated often then there clearly is a benefit. It can be particularly beneficial for regression testing. Often a combination of both manual and automation provides for effective test execution.

###Testing the Infrastructure

When planning for SIT do not forget about the part played by your infrastructure. Systems can run across a multitude of hardware - routers, switches, load-balancers, firewalls and more. Most of the time it is presumed that infrastructure “just works” except when it doesn’t.

Have you ever seen a certificate update on a load-balancer prevent traffic from getting to an environment? Have you ever seen a WAN emulator crash spectacularly when one new application was run across it? Have you ever seen a “vendor tested” upgrade to your authentication systems lock out all your test users?

We have and it was all for the same reason - these changes to infrastructure were rolled out in SIT non-production environments with the presumption they would “just work” instead of being tested properly in advance. Guess what? They didn’t “just work” they just brought all our SIT to a crashing halt.

##Reporting

Something that is often ignored is the value of the reporting during and following SIT. No matter how well planned and executed your SIT is, if the way it is reported is not in a way that the audience want to consume, then the SIT may not be perceived as successful as it actually was.

When reporting it is important to consider who the reports are for, what information they want to see and how they want this information to be provided. This way you will produce reports that are useful and demonstrate the quality of the SIT that has taken place.

##Conclusion

To summarise, these are just some of the pitfalls with SIT. People will have faced their own challenges, but these are some of the more common ones. As discussed throughout this post, there are ways to reduce the risk of these challenges. Planning to address them before starting to think about the integration testing of a system is a start. SIT is complex and can be difficult, it needs significant planning and consideration to get it right. If you do not do this you should not be confident that your product is ready to go live.
