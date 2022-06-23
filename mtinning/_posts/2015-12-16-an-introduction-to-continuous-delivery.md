---
author: mtinning
title: An Introduction to Continuous Delivery
layout: default_post
summary: This post explores continuous delivery within an agile context, and goes into detail about what it really means to be doing continuous delivery.
tags:
  - DevOps
  - Continuous Delivery
  - Agile
categories:
  - Delivery
---

![Traffic]({{ site.baseurl }}/mtinning/assets/traffic-header.jpg "Traffic")

__Continuous Delivery - isn't that the same as Agile?__

Agile has been great for software development. By developing new features in an iterative manner and introducing a rich toolkit with which to govern the development of software and the behaviour of teams, it has taken a lot of the guesswork out of creating new software. Scott Logic has it's own Agile process - [Assured Agile](http://www.scottlogic.com/services/assured-agile) - that is designed to successfully deliver large software projects with distributed teams. It's no coincidence that Agile methodologies produce robust software that meets business requirements.

While Agile techniques focus on the development of software - and maximises the probability that the software will meet business requirements - it doesn't necessarily make shipping software any easier. This is where Continuous Delivery comes in. Continuous Delivery takes many of the core principles that have become commonplace in software development over the last 15 years - change management, iterative development, short cycles with frequent feedback, frequent releases - and runs with them all the way to the delivery stage.

Continuous Delivery aims to make it possible to release software at a moment's notice - quickly and painlessly - with high confidence that there will be no nasty surprises along the way.

__Got it. So it's like Continuous Integration then.__

Continuous Integration is a process that ensures that every change that is made to a code base is _potentially_ releasable. Commonly this includes building the source code to produce distribution packages and running a good suite of unit tests, integration tests and end to end tests, as well as ensuring that the code meets style guidelines and coding best practice.

At the end of the Continuous Integration process we are assured that - to the best of our knowledge - our software is in a releasable state. However, until we deploy our code we really don't know for sure how it will hold up in production. Continuous Delivery extends the Continuous Integration pipeline by actually deploying our code, so that we can reduce the risk that anything will go wrong when we go to production.

__Right. We're doing SCRUM and using automated tools to generate a package which we deploy every two weeks. We've been doing this for a few months and are pretty good at it - releases only take a couple of hours. That's pretty much Continuous Delivery, right?__

Nice! It sounds like you're on top of things, but you're not there just yet - a key feature of Continuous Delivery is that the whole deployment process is _automated_. The aim is to take out all of the pain from releasing code changes by automating everything to the point that it doesn't even require thought, let alone stress and sleepless nights. By automating every stage of the process it should be possible to reduce the time taken to make a release from a couple of hours to mere minutes.

__Automatically deploying every code change? That seems pretty risky to me!__

Not every code change is deployed all the way through to production. When practising Continuous Delivery it is important that multiple environments are available for deployments. A common setup for environments is to have at least four - Development, Quality Assurance, Staging and Production. Automated deployments may be made on every check-in as far as Development or QA. A manual acceptance step would then trigger deployments to Staging and another to Production.

A similar approach - Continuous Deployment - aims to release every code change to production, so that the users are _always_ running the latest code. In order to achieve Continuous Deployment, it is necessary to do Continuous Delivery.

__So we don't just have a single environment for our production code? Sounds complicated...__

Imagine the process of designing a car. A car wouldn't go from the design stage straight through to the shop floor where it can be taken out on the road - there are stages in between:

![Car in Wind Tunnel]({{ site.baseurl }}/mtinning/assets/car-wind-tunnel.png "Car in a Wind Tunnel")

<ol><li><em>Our car is first tested in a lab or a wind tunnel. This allows the engineers and designers to make basic predictions about how our car will behave - aerodynamics and fuel consumption for example - but doesn't give much information about how the car will perform in the real world.</em></li></ol>

This is a bit like running unit tests and integration tests - some things might be flagged up and redesigned at this stage (a failing test requiring a code change), but the lab isn't very much like the real world and we wouldn't consider the car "production ready" without a few more tests...

![Car on Test Track]({{ site.baseurl }}/mtinning/assets/car-test-track.png "Car on a Test Track")

<ol start="2"><li><em>Once we're satisfied that our car won't immediately fall to pieces, we might take it out onto a test track. This will give is loads more information - such as the top speed of the car and how it handles corners (obviously we're designing a sports car and care very much about this). Hopefully we've managed to cover any issues in our lab tests, but there's always a chance to feed back to the designer. When we're ready, we can take our nifty new ride out on the road...</em></li></ol>

In Continuous Delivery, we would push out a version of our code to an environment that resembles production to do some exploratory and smoke testing - the Development (where developers can play around with their latest code) and Quality Assurance environments.

![Car on Road]({{ site.baseurl }}/mtinning/assets/car-road.png "Car on the Road")

<ol start="3"><li><em>Our car is ready for the real world - but we're not ready to put it in showrooms just yet. Our test drivers put our car through its paces by testing it in as close to real-life situations as possible, no matter how extreme - commuting, traffic, speed bumps, whatever the British roads can throw at it. This is a great time to test out our non-functional requirements - things that out car should <strong>be</strong> that don't directly relate to what it <strong>does</strong>. Is it quiet? Comfortable? Does it pack up after 3 months of drizzle? All of this is vital information that will inform us of whether our car is ready to put in the hands of the public.</em></li></ol>

The staging phase is the point at which we have the opportunity to put our code through it's paces in an environment that is as close to the "real world" as possible. Does our production environment use load balancing? Introduce it to staging. Database on a different continent to the app host? If we can afford it, do the same for staging. All of this teaches us more about how our application will behave in the real world.

Just as with our car we have non-functional requirements - requirements that our code must meet, but that aren't directly related to features or functions. These might include latency, performance under load or how network errors are handled. By measuring and monitoring all of these in staging we will gain valuable insights about how our application will behave in production. We can even codify our non-functional requirements, and run tests that raise alarms or automatically reject changes.

![Car in Showroom]({{ site.baseurl }}/mtinning/assets/car-showroom.png "Car in a Showroom")

<ol start="4"><li><em>Finally our car is ready for the shop floor - it is unveiled with great fanfare and thanks to our diligent release process, there are no nasty surprises and the car drives beautifully. The team celebrates with a bottle of champagne.</em></li></ol>

As soon as our code passes the staging environment, a simple "accept" should take it through to production. If we have been diligent with testing through our environments - like the car designers - then there should be much less chance of anything going awry when we deploy to production.

Of course this is not always the case, and the production environment is likely to differ in unavoidable ways from the staging environment - affordability constraints will likely mean that it is smaller scale, and there are almost certainly fewer users and less data in staging. Thanks to Continuous Delivery we have a load of things on our side in the situation that a problem arises that hasn't been caught in staging:

* We have detailed monitoring in place and codified non-functional requirements, so we can instantly detect when anything goes wrong in production.
* We have a staging environment set up that closely matches production, so we can reproduce any issues we find there.
* Because we are releasing frequently, changes are small. It is therefore easy to identify which changes have caused issues.
* Our release process is super-slick thanks to our religious adherence to automation, so we can instantly back out bad changes from production.

As we are releasing software, we have the advantage that we can make changes in one place and all of our users will instantly receive the update. So unlike the car designers, we can make updates almost continuously. With Continuous Delivery, releasing updates is _not a big deal_.

The Continuous Delivery approach recommends releasing often, and in small chunks. All of that testing and measuring we're doing teaches us about how our application performs in the real world - information that we can use to ensure that our users are getting the best service possible, at the same time as having all of the latest features and bug fixes.

Depending on your setup and commit frequency you might want to release every few days, hours or even more frequently - the faster we can get feedback and learn more about our code in production, the better. Just don't celebrate every release with a bottle of champagne...

__Ah I see! That makes a lot of sense - by releasing often and measuring everything we learn more about how our code behaves in the real world. This makes releasing code painless, and we're much less likely to encounter problems in production. Great!__

Now you're getting it!

__One problem though. Our environment changes all the time - what if I want to make a simple update to a library I'm using? Won't it take a lot of effort to make that change on all environments?__

This is where configuration management comes in. We're used to storing all of our source code in a version control repository such as Git. In Continuous Delivery we don't just use version control for source code, but also any information relating to frameworks versions and environments configuration.

All of the information that we require to set up a whole new environment - database connection strings, URLs and IP addresses for example, or installed software versions - should be stored in version control. This way, environment configuration changes can be made in exactly the same way as source control changes - commit a change and the new configuration is picked up and applied.

There are a number of different tools out there that will do this configuration management for you - depending on your stack you might look at Puppet, Chef, or Octopus, to name a few. Some of them will even deploy your software for you! Stay tuned to the Scott Logic blog where we will be going into more detail about configuration management very soon...

One approach that makes environment management even easier is to _automatically create_ environments with the correct configuration whenever you deploy your code. This approach goes further than simply configuring environments and ensures that our multiple environments don't drift apart from occasional "fixes". A great tool for this is Docker, which encapsulates environment details in re-usable containers.

__Wait - so Continuous Delivery is about managing environments too? Not only does it take the pain out of releasing, it takes the pain out of managing environments? Sign me up!__

I'm glad you're impressed! Continuous Delivery gives our users a better experience by allowing us to deliver updates and bug fixes faster, as well as giving us more confidence in our deployments and ensuring that our environments are in the shape that we expect by explicitly defining and version controlling everything that is deployed. All of this adds up to happier users and stress-free development - and this can only be a good thing!
