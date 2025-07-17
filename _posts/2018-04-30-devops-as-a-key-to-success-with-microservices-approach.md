---
title: DevOps as a key to success with the microservices approach
date: 2018-04-30 00:00:00 Z
categories:
- Tech
author: bjedrzejewski
summary: It seems that everyone is trying to build a microservices based system these
  days. Some of those attempts succeed when others fail miserably. In this article,
  I will look at one thing that often connects the winners- the use of DevOps practices
  and culture.
layout: default_post
---

## Introduction

It seems that everyone is trying to build a microservices based system these days. Some of those attempts succeed when others fail miserably. In this article, I will look at one thing that often connects the winners- the use of DevOps practices and culture.

##Microservices – the main ideas
Before going into specific DevOps techniques and approaches that can help you succeed with your microservices, let’s look at some core ideas behind these types of architectures:

* Microservices should be based on domain, not functionality. Think about Customer Services rather than Database Service.
* Each microservice should be owned by a dedicated team.
* Microservices should be independently deployable.
* Security is something that each service should be concerned with.
* Monitoring and logging become more distributed.

As you can see, each of these ideas poses its own unique challenges. Let’s look at each one of them and see why DevOps is such an important factor when thinking about microservices.

## Microservices based on domain, not functionality
One of the first things that come up when talking about microservices is the functional orientation. It poses multiple questions- how to divide the application, where the boundaries of each service should lay and more.

Beyond the design questions, we have the questions about the supporting infrastructure. Microservices are supposed to own their own data. That often means having their own dedicated database or a schema. They should also scale independently. They may need to interact with a message queue…

As you can see there are many additional infrastructure related problems that come with functional orientation. Having DevOps practices established in your organisation will help you in a few ways:

* The team will be empowered to make the right decisions about provisioning resources if they oversee the infrastructure or collaborating closely with them.
* If it is easy to provision relevant database and infrastructure, the team will not be unnecessary slowed down. I often see this as one of the main challenges in organisations adopting microservices.
* The team managing the service should be empowered to make changes as necessary.

As you can imagine there are more benefits and challenges, but without these basic things down, microservices development will turn into a painful, slow drag.

## Each microservice owned by a dedicated team

I have mentioned the team a few times in the previous section. This is because the idea of microservices architecture is closely related to the idea of a dedicated team owning and maintaining the service.

Maintaining a service is something that may go beyond the development, testing, and even deployments… We are talking here about an active support for a service deployed in production. This is one of the key ideas that microservices share with DevOps culture. Both the empowerment and responsibility can be found in these practices.

## Microservice should be independently deployable

Going beyond the fact that it is the team that should be deploying the microservice, the independent nature of it poses additional difficulties.

In the monolithic approach, there are far fewer deployments happening. Imagine that what used to be one application becomes 10-20 services… On top of that, these 10-20 services may be deployed 5 times as often (or more) than the original application. With that, you are looking at 100 times more deployment than before while being rather conservative with the numbers…

It is easy to see that with these increased challenges, the slow way of doing deployments is not maintainable. The DevOps answers are:

* Automate everything. Automation should become part of the culture.
* Operational excellence is a must. Continual improvement is non-optional to increase speed 100-fold and more.
* Operations must work very closely with Development to make this happen.

These three points are not the whole story. They are here to give you an idea and illustrate clearly, that status-quo won’t do. If you are changing microservices without changing how you are doing operations, the deployments itself will put the project at risk!
 
## Security is everybody’s concern

Independent deployments, empowered teams, functional orientation… The microservices landscape looks very different from what we got used to writing monoliths. With all these changes, it should come as no surprise that the approach to security changes as well.

A common approach to application security was to leave it until the end. Get some penetration testing done before release, get some code review… Well, this won’t work if you release 100 times more often or more. Here are some DevOps practices that can ensure the application security in the fast-moving microservices world:

* Inviting security representatives to iteration demonstrations. Make sure to get their early feedback.
* Involve security in defect tracking.
* Integrate security representatives in the code review process as necessary. Especially if you are dealing with authentications flows, configurations, secrets storing etc.
* Move as much security towards automation as possible (can you see a theme?). Dependency scanning and static analysis can become part of your deployment pipeline.

Only you and your organisation can be sure what constitutes enough security. With that in mind, you must make security everyone’s concern. Not towards the end, but pro-actively during development.

## Make your logging and monitoring ready for microservices

The last but not least is the approach to logging. This is not only a challenge but also an opportunity.

When you are supporting a single application, you usually have a single place to look at the logs and a clear picture of what is happening. What about when dealing with 20 applications (services) all dynamically scaled? You need a different strategy.

Introducing a state of the art logging and monitoring is crucial for supporting microservices architecture in production. Being able to trace requests across different microservices is a must. Seeing all these logs, searchable, and in one place is the only way this can realistically work.

DevOps makes logging, monitoring and measuring nearly as much a priority as it does automation. This is because, without it, you are flying blind. You need to have a good idea of what is happening to make it better.

## Summary

I wanted to make a case that to be successful with microservices your organization must move towards DevOps. In fact, some people with microservices successes moved to DevOps practices without doing it consciously. This only emphasizes the fact that these practices can be universally beneficial.

How do you start? I have a few ideas. First, I have written a blog post about [An Organization's Journey to a DevOps Mindset and Culture](http://blog.scottlogic.com/2018/03/13/organizations-journey-to-devops-culture.html). This may give you some ideas.

Scott Logic can help you with that journey as well, as we helped Rabobank. You can read more about it in [our Rabobank case study](https://www.scottlogic.com/our-work/case-study-rabobank/).

Lastly, if you are looking for written references [The Phoenix Project](https://itrevolution.com/book/the-phoenix-project/) and [The DevOps Handbook](https://itrevolution.com/book/the-devops-handbook/) are outstanding introductions and sources of inspiration.
