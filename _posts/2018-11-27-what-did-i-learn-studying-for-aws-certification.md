---
title: What did I learn studying for AWS Solution Architect Associate Certification
date: 2018-11-27 00:00:00 Z
categories:
- Cloud
author: bjedrzejewski
summary: This month I have sat and passed the AWS Solution Architect Associate exam. Like with many things, the journey is more exciting than the destination. In this article, I share lessons and observations I made along the way.
layout: default_post
---

## Introduction

If someone told me a few years ago that I will spend a few months studying for some software/cloud certification, I wouldn't have believed them!
Let's just say that I was not a big fan of certification in general...

So what changed? Why did I decide to actually get certified? I am glad you asked...

## AWS Certification - what is it and why?

In recent years I have been observing the massive growth of importance of the cloud and DevOps for successful microservices development
(I even [blogged about it](https://bjedrzejewski.github.io/blog/2018/04/30/devops-as-a-key-to-success-with-microservices-approach.html)).
With these technologies becoming so important, I did not want to be left behind. Sure, I can watch some lectures,
hack around on AWS, read a book or two... but is this enough? 

Together with a few other Scott Logic colleagues (more about that later), I decided to formalise my learning of AWS. I wanted to learn
enough of AWS and know how to do it right in order to pass the official exam. So where do you start?

<img src="{{ site.baseurl }}/bjedrzejewski/assets/aws-certification-explained.png" />

As you can see, there are multiple certifications that you can take. Choosing the right one, may not be immediately obvious.
We have decided to study for AWS Solution Architect Associate as it is meant to test your general understanding of designing
cloud solutions that will work on AWS.

Was it worth the effort? Definitely! I feel much more comfortable knowing "the right way" of designing common cloud solutions
for myself and discussing the ones encountered at our clients.

## AWS the big picture

One of the most valuable things I have taken from the experience is understanding of the big picture of AWS. EC2, S3, Lambda,
SNS, AZs, VPCs, Regions etc... It may sound intimidating at first, but studying for the exam, you encounter and get to experiment
with all these services and concepts.

With its large number of services, it is important to know what AWS has to offer. We are developers, so we are used to learning new things.
The trick is knowing what to learn! That high-level overview of multiple services can save us from falling into the hammer trap
- "if all you have is a hammer, everything looks like a nail".

Learning about multiple services available in AWS has one other benefit - inspiration. Learning about fascinating tools such as 
AWS Lambda or Kinesis may give you great ideas for personal projects and inspire you to take another look at your
existing systems.

## The right way to do things

Beyond the big picture, and knowing lots of services, the main focus of the Solution Architect Associate exam is to learn
how to do things the right way. What does that mean? Securely, Reliably and in a Cost-Efficient fashion. Let's look at
these aspects one by one.

### Security

Security is of paramount importance for modern systems. Understanding which parts of security are taken care by AWS
and which ones are your responsibility is very important. This shared responsibility model is what underpins the AWS security philosophy.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/shared-responsibility.jpg" />

What did the certification give me here? A guide to tell me what is most important to learn and how to design
secure systems. In short - Identity Access Management and Virtual Private Clouds (with their many subnets) are an
absolute bread and butter of a well architected, secure solution.

If like me, you come from development, rather than networking/security background, you are likely to learn quite
a few new concepts here. After studying these topics, I have a much better understanding of network security in general,
as much of this knowledge applies beyond the AWS infrastructure.

### Reliability

What is the next thing to think about after securing your system? Reliability! You want to have a high uptime and as
few problems as possible. The more critical your application, the more important these considerations become.

Working through the different materials we used learning for the exam, I have gained a much better understanding of what
is expected to go down (so that it needs replicating!), what should always stay up and how to design with reliability in mind.

This visible focus on reliability and uptime can be used beyond just the AWS architecture. It is a mindset you develop
and ways of analysing your architecture that can be used outside of the traditional cloud environment. If you want to
build robust systems, it is a necessary skill to have.

### Costs

Everything you build is secure and reliable. What good does it give you if you can't afford it? To my surprise, a large
part of the exam is dedicated to knowing what is cost effective. You not only want to be building great architectures, but you
are also meant to do it cost efficiently.

Knowing AWS is also knowing how much things cost and what makes for a cheaper option. If both services can do the job
equally well, but one is ten times cheaper... You are obviously meant to save money and go for the cheaper one!

On one hand I am a bit surprised how much emphasis AWS puts on that, but on the other hand- they want to be a competitive
cloud platform. If it costs too much, people may simply opt-out of the cloud entirely, or look towards the competition!

## A little bit help from my friends

This lesson goes beyond simply learning the exam material. With the idea of taking the certification, came also an idea of
doing it together and creating a little AWS Breakfast Club with a few of my colleagues that were on the same project.

This breakfast club made the experience much more fun and effective. In the end, all of us that took the exam passed it with
flying colours (special mentions to James Wren and James Dunkerley, each scoring an insane 974/1000). I don't think we would
have all achieved it on our own without motivating each other.

We are intending to keep meeting for our AWS focused breakfasts in 2019 and continue our morning "cloudy" discussions!

<img src="{{ site.baseurl }}/bjedrzejewski/assets/aws-breakfast.JPG" />

## What's next

One last thing that I got out of this experience is a hunger for more. I really enjoyed learning about different AWS
services and architectures. Passing that exam really feels like the beginning of the journey rather than the end.

Look out for my future blog posts and crazy AWS projects!