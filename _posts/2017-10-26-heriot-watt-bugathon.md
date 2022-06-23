---
title: Bugathon at Heriot-Watt University
date: 2017-10-26 00:00:00 Z
categories:
- rrhodes
- People
tags:
- Scott
- Logic,
- Bugathon
author: rrhodes
layout: default_post
summary: Following the success of Scott Logic's first Bugathon in Newcastle last March,
  members of the Edinburgh and Newcastle teams grouped together to organise another
  Bugathon at Heriot-Watt University's Edinburgh campus. Held on Wednesday, October
  18th, this post gives an insight into the work carried out by Scott Logic to prepare
  and run the event.
---

"What's a Bugathon?", I hear you ask. Perhaps Hackathons spring to mind? The two ideas share a common purpose - racing against the clock to complete a given challenge. However, unlike a Hackathon, you’re not aiming to build new software. Instead you're aiming to rigorously test existing software to find (and report) as many bugs as possible with the hope of winning a prize. Following the success of Scott Logic's first Bugathon in Newcastle earlier this year, members of the Edinburgh and Newcastle teams grouped together to plan a second Bugathon for Wednesday, October 18th, at Heriot-Watt University.

<img src='{{ site.baseurl }}/rrhodes/assets/bugathon.png' alt='Bugathon'/>

Bugathon participants group together to form teams of up to four. Their aim is to find as many bugs as possible within a given time, and provide good quality bug reports for developers to be able to reproduce and rectify the bugs which have been found. Each team is given a score based on two things: First, the difficulty rating of each bug found, and second, the quality of each bug report submitted to developers. Whichever team scores highest wins!

Students often tell us that they haven't considered test engineering as a career choice. Many argue that this is down to lack of exposure to testing during their degrees. Offering Bugathons to students provides an opportunity to change this - learning how to test from experienced test engineers at Scott Logic.

### Project Overview
This is the first internal project undertaken by the Graduate Developers and Graduate Test Engineers here in the Edinburgh office, following our initial training and office move to Grassmarket. Mentored by other developers and test engineers within the Edinburgh and Newcastle offices, we spent the past month improving two apps used in the Newcastle Bugathon: A chat app, with bugs deliberately buried within the code, and a Bugtracker, used to report bugs found on the former. Throughout this time we held daily stand-ups and weekly demos of the apps to keep the project on track and ready for the big day.

Whilst the original Bugathon involved one round of testing, we decided to introduce two rounds for students at Heriot-Watt University. The original chat app would be presented in round one, then an updated version with new features and bug fixes would appear in round two. This aimed to simulate a real test engineer's experience: Returning feedback to developers on the original app, and later testing the new and improved app when bug fixes and features have later been introduced. In order to prepare for two rounds, significant work was required on each of the Bugathon apps.

### The Chat App
To retain an element of surprise for upcoming Bugathons, we'll be keeping the details on this app a secret! The frontend consists of a custom GUI, hosting a range of features for students to test during the Bugathon: Instant messages, user groups, user profiles, and more. Developed using JavaScript alongside React and Redux, this app offered the Edinburgh graduates an opportunity to strengthen their skills and knowledge following their recent training on these tools.

Behind the GUI, our chat app uses an API for an existing, real-world chat app. Whenever groups were created, messages were posted, or users were updating their profile, a request would be fired to the API to handle this. There's a whole host of actions the API can perform, and this proved extremely useful (and reliable) leading up to the Heriot-Watt Bugathon.

The key goal with the chat app in our project was to introduce new features and bug fixes following what was used in Newcastle. Deliberate bugs were fixed, new deliberate bugs were introduced, and new accidental bugs always crept in to surprise us! Developing a second version of the chat app gave students a broader range of errors to detect and report to developers on the day. However, without the Bugtracker to keep track of all the bug reports for both versions of the chat app, it would prove challenging to run the Bugathon.

### The Bugtracker
The Bugtracker tool comes in two forms: Participant mode, targeted at the student teams, and admin mode, targeted at the Scott Logic team. Given a team name and password, student teams generate bug reports as Bugtracker participants following a standard template provided. With bug reports submitted, participants could observe their ranking against other teams on a leaderboard, and browse found bugs to avoid reporting a bug already discovered earlier in the Bugathon.

<img src='{{ site.baseurl }}/rrhodes/assets/bugtracker.JPG' alt='Bugtracker'/>

The Bugtracker adopts an entirely different range of tools from the chat app. For starters, there's no pre-build API for this bespoke app. C# and the .NET framework were used to develop the Bugtracker backend, with a PostgreSQL database running behind the scenes to hold data on teams, bugs to be found, submitted bug reports, and more. The frontend uses Typescript along with Angular as opposed to React.

To support multiple rounds for a single Bugathon, changes were required both to the Bugtracker and the database in order to support this. Graduates working on the Bugtracker spent a great deal of time working on this whilst also learning Angular at the same time. They did a grand job on this - delivering a new and improved Bugtracker able to support both Bugathon rounds at Heriot-Watt!

### Preparing for the Bugathon
With the chat app and the Bugtracker ready for use, the next step was to deploy these apps somewhere accessible by each participant in the Bugathon. The Newcastle team found the answer before their Bugathon in March: <a href="https://www.heroku.com/platform">Heroku</a>. The Heroku service allows developers to easily deploy their code and access apps through a Heroku app URL. Taking over the existing two Heroku apps from Newcastle and introducing a new one to hold the new and improved chat app proved painless. Each of the apps were reliable throughout the development process.

October 18th arrives. With development and testing on each app complete, it was time to make the final preparations. The Bugathon was due to start at 1330. Lead Test Engineer, Wullie, and Graduate Test Engineers, Jack and Elliot, were travelling from Newcastle to join us in Edinburgh. Once they settled in to the Edinburgh office, we waited eagerly for our taxis to appear at 1230 to take us to the Heriot-Watt campus.

### The Bugathon
Arriving at the Earl Mountbatten building shortly before 1300, students were quick to start arriving. As the clock hand reached half past, Edinburgh's Head of Development, Murray, provided the introductory talk. He explained what Scott Logic does and encouraged students to apply for our <a href="http://www.scottlogic.com/careers/vacancies/">current internship and graduate vacancies</a>. Murray then passed on to Wullie, who explained the format of the Bugathon: There were two rounds, each introducing a different version of a chat app. The mission was to test rigorously, and report as accurately as possible all bugs found using the Bugtracker app. The students formed teams ranging from two to four members, each named after a programming language, and set themselves up to begin the first round.

The first round was set to last 45 minutes. The majority of Scott Logic graduates signed into admin accounts for the Bugtracker - ready to begin marking bug reports as they came in. The other graduates remained on-hand to assist students throughout the Bugathon. As the clock reached 1400, the timer begun. Students were quick to file their bug reports. Admins prepared to start the marking process - putting into practice what was developed and tested in previous weeks to make the admin experience as smooth as possible. It was great to see students picking up on bugs throughout the chat app. As reports came flying in, admins were quick to score them and return feedback to the teams.

Round one came to an end before we knew it! The teams submitted 53 reports by the time 45 minutes were up, covering 31 of a total 63 bugs implemented into the chat app. With refreshments provided by Scott Logic and team scores tallied up, it was time to begin round two. Team JavaScript held the lead with 110 points against Scala on 93. Would these teams retain their rankings after a second round, or would another team jump to the top of the table? Only time could tell.

The admins braced themselves for another period of rapid marking, and begun the second round. Another 45 minutes for bugs to be found! The students learned from the first half, and the quality of the bug reports improved significantly as the Bugathon progressed. Students were quick to see bug fixes in the new chat app, and were also quick to explore the new features and find bugs within them. More reports were submitted in mass numbers toward the admins, and everyone is keeping a close eye on the leaderboard behind the admins to see how would hold the top rank! Teams further down the league table from round one found themselves scoring better during the second round, leaving JavaScript and Scala working hard to retain their positions at the top of the board!

By the end of the second round, teams submitted 71 bug reports, describing 42 of a total 78 bugs introduced in version two of the chat app. With both rounds completed, Wullie took the opportunity to hear the students' views on the running of the Bugathon. Feedback was overwhelmingly positive in the end, and this was extremely satisfying for everyone on the Scott Logic team to hear. Students were with us for over an hour after the Bugathon before we packed up our stuff and set sail back to the office. With the positive feedback we received, we left at the end of the day content with how the Bugathon unfolded!

### Next Steps
The team gathered the next morning for a retrospective on the Bugathon project. As with any retrospective, we discussed two key points: What went well (both for the students and the development team), and what improvements should be made for future Bugathons. Given the positive feedback we received, we were pleased with the outcome of this project. A great deal of improvements were made toward both the chat app and Bugtracker since the Newcastle Bugathon, and we experienced no major hiccups on the day.

With a range of new features and further improvements proposed at the retrospective, we're working now to implement these suggestions into both the chat app and the Bugtracker. This includes a timer beside the Bugtracker leaderboard, allowing participants to keep track of how long they have before a Bugathon session comes to a close. Reflecting on the project, we learned a great deal on the development process - with developers passing their new features and improvements to test engineers, test engineers passing feedback to the developers, and repeating the process until both sides were satisfied with the changes made.

The graduate programme continues here for us in the Edinburgh office. If you're interested in reading further into the programme, whether that be for development, test engineering, or UX design, check out our <a href="http://www.scottlogic.com/careers/graduateprogramme/">graduate programme page</a> for further information. Applications are open now, so apply as soon as you can!
