---
title: On Running a Code Club
date: 2013-12-04 00:00:00 Z
categories:
- People
author: shogarth
layout: default_post
image: shogarth/assets/featured/code-club.jpg
summary-short: My thoughts and experiences setting up and running a Code Club
summary: Scott Logic have been helping out with a Code Club at a local primary school.
  As one of the developers involved, I'd like to share my experiences and tips for
  running your own Code Club!
oldlink: http://www.scottlogic.com/blog/2013/12/04/on-running-a-code-club.html
disqus-id: "/2013/12/04/on-running-a-code-club.html"
---

Since September, a colleague (Pat Armstrong) and I have been taking part in a local school's after-school [Code Club](https://www.codeclub.org.uk/), [backed by Scott Logic](http://www.scottlogic.com/news/20131203-certificates-awarded-to-code-club-whiz-kids/). This is a nationwide, non-governmental initiative to aid children, aged 9-11, to learn programming. It's operated purely on a voluntary basis and is free for a school, library or community centre to set up. In this post, I'd like to discuss my personal experiences from the initiative and provide some tips I found useful during the sessions.

<img src="{{ site.baseurl }}/shogarth/assets/code-club-west-jesmond-primary-school.jpg"/>

## What is Code Club?

Code Club lessons are structured into terms, each with nine lessons. The terms are further subdivided into 'levels' of difficulty. At the end of each level, the children are awarded a certificate to recognise their achievements.

Term One focuses on [Scratch](http://scratch.mit.edu/), an educational tool which combines a programming language and development environment. Using Scratch it is incredibly easy to create games, animations and interactive stories, which is perfect for whetting the appetites of budding programmers! Children are able to pick up Scratch very quickly - it needs little exploration and results are immediate.

Code Club lessons are extremely well-designed. Instructions are clear, concise and age-appropriate. Students are reminded when to test, when to save, and there are extension activities to really test the understanding of a project. [Sample lessons are available online.](https://www.codeclub.org.uk/about)

## My Top 5 tips on Running a Code Club

1. **Anticipate, log, and feedback issues.**
Follow the [7 P's of the military](http://military.wikia.com/wiki/7_Ps_(military_adage)) religiously. Before each lesson take some time to follow the lesson plans yourself to identify potential issues. For example, I asked myself: are some of these instructions tricky? Did _I_ make a mistake? Is it easy to make a common mistake at this point? Jot these down, along with the solutions. If the lesson introduces a new programming concept, come up with some spiel to explain it. Explaining the notion of a variable to a bunch of kids off-the-cuff is tricky! I overcame this with a heavy focus on examples. I also maintained a diary to track the progress of the students and the details of any issues we encountered. In one specific case discovered a bug in the lesson code! Code Club host plain text versions of their [lessons on Github](https://github.com/CodeClub/scratch-curriculum), which gives you an easy way to provide feedback. You don't have to be meticulous with your book-keeping, but reporting on your experiences makes the lessons better for everyone!

2. **Use the check-boxes!**
Each instruction in the lesson plans has a check-box to the right of it. Make sure the children use them! When you're diving into a piece of new functionality it's very easy to lose track of your place. Give each children a pen and hail the importance of keeping track of work. We didn't quite make it through one lesson a week (some of which is down to the nature of an after-school club session), so having the students record their progress meant they could get straight back into the action at the next session.

3. **Encourage problem solving.**
It's easy to grab the mouse and show the student the solution when they get stuck. That works well in the initial stages, providing you carefully explain why your change fixes the issue. In the initial sessions I tried my best to do this, but as the students progressed to the later stages I began to take a hands-off role. By this point they have some Scratch experience under their belts, so it's worth giving them a chance to figure it out for themselves. One way of achieving this is to ask the students to read the code aloud. Sometimes they'll spot the issue straight away ("oh, I've got less than when I actually meant greater than!"). I don't tell them we call this [rubber-duck debugging](https://en.wikipedia.org/wiki/Rubber_duck_debugging)! However, if that doesn't work, I instead try to encourage problem solving by explaining the requirements, sometimes with other examples.

4. **Recruit helpers.**
Some students will finish lessons before others. Luckily this is anticipated! The Code Club material contains extension challenges to add an extra level of difficulty. I found that some of the challenges were quite tricky (one required completely changing the perspective of a game), but effectively cement the knowledge developed over a lesson. It can be great fun to get students who finish these challenges to help others! A key concept in programming is communication - including verbal communication. Understanding requirements, talking through solutions and helping others are all vital skills that should be encouraged within the club. Not only that, but you develop a community atmosphere in which everyone helps each other complete the work. After all, it's not a competition.

5. **Have fun!**
Code Club can be hard work, so take a step back and enjoy it! Give the students time to play the games they create, especially when they need two players! The students will quickly come up with new ideas and begin implementing them! Students will also want to put their own spin on the games. Wherever possible, allow them to do so. It's not always possible to deviate from the lessons, such as with Fish Chomp (collision detection is performed on a fish's teeth, which is not possible on all sprite images), so be aware of where the students will have to be more constrained. If they're having fun, you'll be having fun and they're learning!

## The Developer's Perspective

Programs in Scratch are created by dragging and dropping 'blocks' of functionality into a stage. The shape of a block affords its function - iterative and conditional blocks literally enclose their contents. That way it's easy to see exactly what code will be executed under certain conditions. Interactive components, known as sprites, are added to a stage. These can be styled with 'costumes', respond to messages and events (such as mouse clicks) and can contain their own scripts.

<img src="{{ site.baseurl }}/shogarth/assets/scratch.png"/>

Scratch comes in two forms, both of which are available for free online. Version one is a desktop application and version two is both a desktop and web application. Scratch 2 also has some new features that the Code Club material doesn't cover, such as function blocks'. There's an ongoing effort to [convert the lessons to Scratch 2 over on GitHub](https://github.com/CodeClub/scratch-curriculum/issues/37), should you wish to help out. Until the Scratch 2 conversion has finished, I advise sticking to Scratch 1.4 as there are some subtle differences between the two platforms.

The very essence of possessing a general-purpose computer is its ability to be programmed, unlocking another form of creative expression. Passing this knowledge to the next generation and seeing such a rapid, passionate uptake of the information is something I've found to be extremely rewarding. Indeed, I'd go as far as saying this is the most rewarding experience I've had in my professional career. Computing, specifically programming, is becoming an integral part of education - next year will see a new [Computing curriculum](https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study) introduced in the UK. If done correctly, this can have profoundly positive effect on the capabilities of our future society. Being a small part of that is exciting and something I can't recommend enough!
