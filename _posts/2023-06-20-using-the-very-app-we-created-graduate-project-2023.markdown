---
title: Using the very app we created – Graduate Project 2023
date: 2023-06-20 15:46:00 Z
categories:
- People
tags:
- Graduate
- Grad Project
- Grad Summit
- Graduate Programme
summary: After months of hard work, rattling lines of code away, time in meetings,
  questions, debates, pair programming, banging your head against the wall after hours
  spent on one elusive bug, new technologies, old technologies, refactoring, testing,
  polishing and then… the day arrives. Our grad project app is to be released into
  the wild, used by the very ones who created it.
author: jwarren
---

It was the day.

After months of hard work, rattling lines of code away, time in meetings, questions, debates, pair programming, banging your head against the wall after hours spent on one elusive bug, new technologies, old technologies, refactoring, testing, polishing and then… the day arrives. Our grad project app is to be released into the wild, used by the very ones who created it.

![The Summit Explorer's timetable display](/uploads/timetable-display-choices.JPG)

I joined Scott Logic 9 months previously (August 2022), on the [developer graduate programme](https://www.scottlogic.com/graduate-programme) after having studied maths at university. The programme began with a few weeks of training, followed by engaging in an appointed project. This project would be useful to the company in some way and would be coded in teams with the support of mentors. Our assignment was to create an app for our internal graduate conference, the ‘Graduate Summit’. An annual conference where Scott Logic gathers its graduate cohort from across the country for networking and bespoke training purposes. Our app ‘Summit Explorer’ would facilitate the organising and running of these events.

To build our web application, we used a range of state of the art frameworks and libraries within our program. This consisted of a backend in Java Spring, a frontend in Typescript React and deployed to the cloud (AWS). Our app would allow conference delegates to view scheduled talks, choose which talks they want to attend and view their own personal timetable after organisers had made the assignments. Organisers could edit the timetable, manage users and send notifications. The app was bolstered by a secure login through ‘Azure AD Seamless SSO’ and was compatible with both desktop and mobile devices.

During the two-day conference our app ran pretty smoothly. There were no server crashes, no one was unfathomably lost, and for the most part, people could use the app without a problem. Organisers had their workflow streamlined and productivity thus increased with a single app to fulfil all their organising needs. It was a rewarding experience to see our work had paid off, especially on features that I had personally grappled with. I don’t think I will ever look at a ‘notification dot’ the same way again.

![The dreaded notification dot](/uploads/notification%20dot.JPG)

Being the consumers of our own app was an interesting experience. Some pages remind you of your friends and co-workers who worked on those areas. Some components remind you of the frustration and elation that came with the work involved. Surprisingly, despite demoing the app pre-release, using the app in the context of a real summit caused certain features to reveal themselves as more prominent, and highlighted other features as in need of a rethink. For example, I personally spent much time on the notifications page; however, on the day, the lack of ‘push’ notifications, combined with no truncation of long notifications, rendered this feature difficult to use. After receiving feedback, we were able to implement various simple and effective changes that will greatly improve future user experience, namely the persistence of the personalised timetable. It’s certainly a case study in favour of early user testing.

For someone from a non-computer science background, this project made a helpful introduction to the web development industry. Getting experience building an app from scratch to MVP (minimum viable product), we became familiar with a number of industry-standard technologies, in an atmosphere which fostered learning from our mistakes, without fearing client repercussions. We also had the space, away from the fray of client work, to learn about clean and maintainable code, whilst experiencing ways in which ‘agile’ and ‘test-driven development’ could be worked out in practice.
In conclusion, it was a positive experience where we could all grow as a team of developers with a useful product at the end which we can be proud of.
