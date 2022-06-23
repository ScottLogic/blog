---
title: JVM Roundabout - Microservices
date: 2018-02-21 00:00:00 Z
categories:
- bjedrzejewski
- Tech
author: bjedrzejewski
summary: JVM Roundabout is a meetup in London where all things related to JVM are
  discussed. The February edition of the meetup focused on microservices. I had to
  be there!
layout: default_post
---

###JVM Roundabout

If you are in London, if JVM is your thing, if you like meetups- you have to check out the [JVM Roundabout meetup](https://www.meetup.com/JVM-Roundabout/).
JVM Roundabout is a place where speakers from different companies share their knowledge and experience related to JVM
topics. The February edition of this meetup focused on Microservices, so I was very excited to attend. Here I will share
my impressions from the meetup and give a brief descriptions of presentations that took place. The great thing is that
all JVM Roundabout talks are being recorded and are [available on YouTube](https://www.youtube.com/channel/UCzu7IBWp0x9lbTPC4ODcXsw).

###General Observations

The meetup took place at RightMove company headquarters in London. It was very well attended with over 100 people gathered
to listen and learn about microservices. From talking to different participants it seemed that there is both great excitement
about adopting microservices and confusion about this new way of designing systems. There were multiple questions
being asked by the audience and in-person between the talks. Based on what I heard it seems that the big things for
people are:

* What performance and scale can you achieve per microservice? The answer- it depends...
* How do you approach Contract Based Testing. What are Consumer Driven Contracts (CDCs)? How to test distributed systems?
* How do I start learning about this? I have been asked for book recommendations on Spring Cloud (I recommend "Spring Cloud in Action").
* How to deal with consistency and distributed processing when choreography is used?
* What is your company doing with microservices?

Plenty of interesting questions and discussions. It is worth attending meetup like that, not just for the talks, but also
for the opportunity to ask others in similar positions these questions. Also, the pizza was of exceptionally good quality!

###Property Alerts: The evolution into microservices - Right Move

The first talk was delivered by David Cuevas from Right Move. David shared with us the journey that RightMove went through
in their adoption of microservices. This sort of sharing of experiences is very much needed as shown by multiple
questions asked after the presentation. RightMove has been very successful in their adoption of microservices, enabling
them to massively increase the processing speed of their core business processes. You can watch the whole presentation here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/F59NPzuwLrk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

###Canary monitoring in services oriented architectures - Tide

The second talk focused on the importance of monitoring in microservices. Martin Bechtle shared with the audience his
experiences in advancing the state of the art while working at Tide. The talk showcased how monitoring is used by some of the
largest adopters of microservices (Netflix) and how Tide is attempting to learn from their experiences to build a solution
suited to their business needs. If monitoring in massively distributed systems worries you, definitely watch it:

<iframe width="560" height="315" src="https://www.youtube.com/embed/J93Lqfd0I0Q" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

###Practical Choreography with Spring Cloud - Scott Logic

I also had a pleasure of presenting at this meetup. My talk focused on introducing choreography into microservices
architecture. It was based on some of the [work I published on my e4developer](https://www.e4developer.com/category/choreography/) blog.
From my experience, based on working with multiple clients and talking to my colleagues, choreography is often avoided.
This is often based on lack of experience with the technology and some misconceptions. If you are interested in introducing
messaging and choreography to your system but don't know how to start, check my talk:

<iframe width="560" height="315" src="https://www.youtube.com/embed/1rZQ4e2p-Ig" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

###Summary

The meetup was very successful with over 100 people attending and long question sections after every talk. I think there
is need for more meetups and events exploring microservices architecture, as there is so much happening in that space.
I wanted to thank organisers of the meetup- TRG Recruitment and RightMove for making it happen and giving me
a chance to speak.
