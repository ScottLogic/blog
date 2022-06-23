---
title: The Lonely Tester's Survival Guide
date: 2016-03-09 00:00:00 Z
categories:
- rhamilton
- Testing
tags:
- featured
- software testing
- pair testing
- agile testing
- survival guide
author: rhamilton
title-short: The Lonely Tester
summary: How to stay fresh, focused and super effective when testing alone
image: rhamilton/assets/featured/lonelytester.jpg
layout: default_post
---

<img src="{{ site.baseurl }}/rhamilton/assets/lonelytester.jpg" alt="lonely testers are sad" title="lonely testers are sad"/>

## Modern software testing has become agile
Anyone that cares about making good software has moved away from the old waterfall ways of *"throw it at QA when it's finished"*. One recent trend is to embed a single skilled tester within a small development team to test early, test often and add as much value as they possibly can.

In the old days, before test automation was as common as it is today, large numbers of human testers were required to carry out large quantities of laborious repetitive checking. Fortunately, in these modern times, test automation takes care of simple, boring, repetitive checking. This has significantly reduced the need for large numbers of human testers.

So as testing has evolved, the test team has also evolved. A traditional test team was large and it is now much smaller. It's common to only have a single tester working within a small group of developers.  At companies where there are multiple testers it is likely that each tester will be working alone in isolation from the other testers. Most companies put different testers on different products or projects and it's a rarity to have two testers testing exactly the same thing.

## Now we test alone

When you are the only dedicated tester within a small development team it's easy to start feeling overwhelmed. The responsibility of testing everything and establishing a good level of confidence that it 'works' is on your plate. You may have pressurised people trying to shift some of the pressure that's on them onto you. It's essential to get as many people as possible involved with testing efforts and create a culture within the team where everyone cares about quality.

But even when everyone does care about quality and untested code is not thrown in your general direction, things can still get really tough. You will be staring at the same piece of software day in, day out and trying to constantly generate and execute test ideas which attempt to cover as many paths though the software as possible. Assumption can start to creep in, which is very dangerous. If the save button worked yesterday, is it less urgent to test it again today?

The lonely tester is limited to their own ideas and strategies. Every software tester will test in a different way, with different ideas and different reasoning for those ideas. The lonely tester won't naturally experience any opportunities to learn from other testers. The lonely tester will be missing out on the kind of learning that testers working co-operatively experience every single day. Once a lonely tester becomes familiar with the software they are testing, they will test it in a completely different way to a tester which is unfamiliar with it.

I used to work in very large teams, frequently working with a minimum of at least 6 other testers. Then in 2014 I became a lonely tester. I've learned a lot since making the switch from co-operative testing to testing alone. This is my survival guide written especially for all the other lonely testers out there.

## Create as many opportunities as you can to interact with as many other testers as possible

Take charge of your situation and be proactive. If there are testing meet-up or conferences near you, go to them. Meet other testers and hear what they have to say. If you can't attend in person, watch some Youtube videos of respected software testers talking at conferences. Sign up for twitter and follow some other software testers. Search for some blogs on software testing and read them. Start forming your own opinions about what other testers have to say.

You might agree with them, you might disagree with them. It doesn't matter. It's the exposure to other tester's thoughts, experience and ideas which is valuable. The lonely tester, will be lacking this kind of exposure. Slowly you will find that things you have heard about testing will help spark your own ideas about how to test. You can even borrow other people's ideas and see if they work for you.

## Join forces with another (possibly lonely) tester

Recently an opportunity came along for me to be less lonely. A new project was due to start which had some similarities to a project I had been working on. I was asked to share some knowledge with the tester due to start work on the new project. So I set aside an hour to team up and do some pair testing.

I have done pair testing before and knew it would be useful for both of us but the experience was remarkable.

It's already known that there are massive advantages in pairing an unfamiliar tester with familiar tester for both parties involved. We have all heard the mantra *"fresh eyes find failure"* (as made famous by <a href="http://www.amazon.co.uk/Lessons-Learned-Software-Testing-Approach/dp/0471081124">lessons learned in software testing</a>). The unfamiliar tester won't be making any assumptions about the system or product and will be more likely to interact with it in a different way to the familiar tester. The familiar and the unfamiliar will both be looking at the software from different angles, from different vantage points. Working as a pair helps keep ideas fresh and stops testing from becoming stale and repetitive.

I was familiar with the software we were testing and other tester was completely unfamiliar with it. We worked together sharing a single keyboard and mouse. I let the unfamiliar tester take control of the software first while I observed, explained and took notes.

I described out loud how the software worked, the purpose of each input box and how they linked together as a whole. As I was describing, the other tester used the keyboard and mouse to manipulate them and started fiddling with the application. The software fell under intense focus and lots of scrutiny was applied. Lots of questions were asked out loud by both of us

> *"Why is it doing that?"*
>
> *"Is that what you would expect to see?"*
>
> *"Try doing this instead, is it the same as before?"*

We found a few inconsistencies which warranted further investigation. After 30 minutes, we swapped around and I took the keyboard and mouse. Then, and I'm not entirely sure why, I said...

> *"Let me show you what used to be broken."*

And I started trying to demonstrate some of the previous issues we had encountered, which I knew we had already fixed.

Guess what happened then? The application behaved in an unexpected way and we found a valid bug. It was a Hi-5 moment. The issue was new, it had only been introduced in the last couple of weeks. I knew straight away that I hadn't seen this bug as I was suffering from some kind of <a href= "https://en.wikipedia.org/wiki/Inattentional_blindness">perceptual blindness</a>. My subconscious was making assumptions for me. My sub-conscious had been overlooking areas I had recently tested and observed working correctly.

I learned a lot during that hour. I learned that no matter how good the lonely tester is at testing, a second opinion and someone to bounce ideas off is essential.  Afterwards we both agreed that pair testing was an activity which we should continue doing.

As a lonely tester you may be able to negotiate an exchange of testing with some of the other lonely testers within your organisation. At an agreed date and time set aside a window to spend time with another tester. Allow them to come test with you by your side. In exchange agree that you will do the same and sit and test alongside them.

Every tester tests in different ways and through pairing with others we can learn different approaches to testing. Through these sessions we can learn about the existence of things that we were previously unaware of such as tools, tips and tricks. Having someone to discuss ideas with will help keep your testing fresh and you will learning about different testing styles.

## Share your experiences, ideas and problems with others.

The lonely tester receives less feedback than testers working in small co-operative teams. When a lonely tester tests, the testing ideas happen in their head and they apply them to the software. This process is completely invisible to other people. No-one can question, critique or give any kind of feedback about invisible testing. This is especially true if the lonely tester is weak at recording or documenting the testing they have performed. So the lonely tester needs to make sure they are communicating well with others, at all levels.

If you are lucky enough to sit with the developers on your team, talk to them about the testing you are doing. This might be as simple as a casual conversation about what you are testing, what you have observed or if have got stuck and aren't sure how to test something specific. Developers genuinely care about testability. They want to make it as easy as possible for you to test their code and they might have some ideas that can help. Suffering in silence is the worst thing a lonely tester can do. Don't sit on your problems, talk about them.  

If there are other lonely testers in your office, engage them. Talk about what, when, why, where and how you are testing around the water cooler. Share stories about testing on forums, tweet about testing or start a blog and write about your testing experiences. When you are a lonely tester, this sharing your experiences is essential so you don't end up facing really hard problems alone and are able to get helpful feedback that you can react to.

Above all else, the most important piece of advice for the lonely tester is this...

**If you don't want to be alone any more, you don't have to be.**  


This post was also published on my software testing blog [Mega Ultra Happy Software Testing Fun time](http://testingfuntime.blogspot.co.uk/).
