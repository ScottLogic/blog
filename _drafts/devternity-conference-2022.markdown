---
title: DevTernity conference 2022
date: 2023-01-16 16:00:00 Z
categories:
- Tech
summary: Late last year I attended DevTernity, an all-remote generalist software development
  conference. In this post I'll cover off some points of interest from some of the
  talks I chose to attend, and reflect on the remote conference experience.
author: rwilliams
---

Late last year I had the chance to attend [DevTernity](https://devternity.com), an all-remote generalist software development conference. The first day was the main conference day, with the second (optional) day offering a choice of workshops by some of the speakers. It was a great conference. In this post I'll cover off some points of interest from some of the talks I chose to attend, and reflect on the remote conference experience.

## Improving eBay's Development Velocity

[Randy Shoup](https://twitter.com/randyshoup) told the story of how eBay worked to double their engineering productivity, starting from a base of 27 years' worth of grown IT estate and ways of working. They chose to start by focusing on software development and delivery/deployment, as an enabler for possibly later improving other aspects of building and operating software.  Billed as a "velocity initiative", the programme applied aspects of team topologies (platform teams, enabling teams, senior individual contributors) to bring cohorts of feature/product teams into the fold every quarter. Much of the work backlog could be found by asking the question "if you had to deploy every day, why can't you?". Noting that transformation is hard, he uses the term "immune system" to describe how a company/organisation naturally and unintentionally tends to fight/resist change.

![randy.png](/uploads/randy.png)

## Simple and Powerful Things That Work for Me

[Jakub Nabrdalik](https://twitter.com/jnabrdalik) shared some tips about thinking and doing within software development, grouped by before coding, while coding, and after the coding. While some of these would probably be picked up over years of working in software, it was great to see them identified and shared. One that sticks with me is his approaches for implementing something when you can't see far ahead enough to know what the end result looks like, i.e. how to overcome coder's block when you're out of the comfort zone of your knowledge and familiar patterns. These were "baby steps", "backward programming", "top-down and layer on the detail", and "learning by chaos". He observes that once you know what you want, it's quick to rewrite rough code that helped you figure that out. Another tip he had was on observability - that if you can't reason about your code or failing tests via logs alone (i.e. you need to use a debugger), then you won't be able to reason about what's happening in production either.

## Everything You Should Know About Web Development in 2022

[Stefan Judis](https://twitter.com/stefanjudis) took us through the highlights of what's new in the web space this year. These included CSS is/where/has, CSS container queries, view transitions, ECMAScript type annotations, and tooling written in Go/Rust. With the constant stream of new things in frontend technology, it was useful to have a recap of what the real big things were this year on the web platform itself. He closes with the thought that knowing some of the web fundamentals could become less important for application/website developers in the future, with integrated frameworks and toolkits taking care of ever more concerns for us.

![stefan.png](/uploads/stefan.png)

## The Secrets of the Fastest Java Developers on Earth

[Victor Rentea](https://twitter.com/VictorRentea) demonstrated his arsenal of tips and tricks for IntelliJ IDEA. He stresses the importance of having unconscious competence of the tool, so menial tasks don't distract or slow down our thinking. This talk conflicted with another I wanted to attend on another track, so I watched the recording of this one later while trying things out in my own IDE - which worked well. There was a lot to learn from this one even for seasoned users, covering: typing less, selecting code, inspections, refactoring, and navigation.

## The 7 Pillar Developer: A Holistic Approach to Building an Exceptional Career

[Cory House](https://twitter.com/housecor) gave a profound and thought-provoking talk (while walking on his treadmill) about what underpins an exceptional developer. We'd all do well to take (or consider) one or two things from each pillar, even if the whole structure looks like a daunting to-do list. Starting with **psychology**, he stresses the importance of taking care of yourself and the advantage that happiness brings. He's makes the case that **focus** is important in a growing and maturing industry; being a remarkable and wanted individual by being exceptional at something - rather than being just good at a bunch of things. He shares some things we can do for our **education** to remain relevant, our **image** and reputation to increase our "luck surface area", and our **communication** skills to be effective as an expert. On the subject of **time**, he discusses the idea of using money to buy time and mental bandwidth, and thinking through the consequences of how we spend our time. The final pillar is **systems**, which he favours over goals.

![cory.png](/uploads/cory.png)

## Clean Code: Eternal Principles

[Jakub Pilimon](https://twitter.com/jakubpilimon) argued and demonstrated that clean code is a derivative of the fundamentals of having a clean architecture and a clean model. Traditional clean-code thinking (smaller functions, good naming, etc.) don't help us much if we haven't modelled our domain well, he observes. His demonstration of implementing scooter hire program then throwing new requirements at it showed how coupling, poor testability, repetition, lack of layering, and high cognitive load make things harder and dirtier than they ought to be. Complication, he notes, is often seen as or argued to be a bad thing - but ultimately it leads to proper abstractions and simpler code.

## Practical Leadership for Software Developers

[David Neal](https://twitter.com/reverentgeek) gave this quite reflective talk on how we're all leaders and what behaviours we can take to be better at doing that. He argues that leadership isn't about management or control; rather anyone whose actions inspire others to dream more, learn more, do more, and become more - is a leader. With his hand-drawn slides (he's a talented illustrator), he walked us through 7 things we can do (such as managing time, taking responsibility, having gratitude, and encouraging others) , with some personal examples of him doing (or not doing) these in the past.

![david neal.png](/uploads/david%20neal.png)

## 26 Heuristics for Effective Software Development

[Allen Holub](https://twitter.com/allenholub) talked us through a few of his [heuristics for effective software development organisations](https://holub.com/heuristics). This was a big dose of wisdom and observations, however as one person observed - following them is phenomenally hard.

## Unlocking the Awesome Power of Refactoring

[J.B. Rainsberger](https://twitter.com/jbrains) made a compelling case in this talk for practicing to become better at refactoring. He introduces the idea of "chunking", where sequences of operations come to be seen as one once we've gained unconscious competence in doing them. This frees up our mind for more important thinking, and gives us more confidence to act on our impulses to refactor things. He argues that while we think time is our bottleneck, actually it's skill, so we have a responsibility to invest in ourselves so we can do better work.

![jb.png](/uploads/jb.png)

## The remote conference experience

This was the 7th DevTernity conference, and the second time it had been run remotely.

Everything was organised very slickly using Zoom and Slack, with a channel on each one for each of the three concurrent tracks. A selection of questions posted on Slack were relayed to the speaker by the track host from the organising team, and some speakers also later answered remaining questions on Slack directly. Some will enjoy participating in Slack discussions during a talk, however I quickly found that this distracted from the talk itself.

With there being only one day of talks, I think the remote-only format was especially beneficial for all involved. We had a choice of great speakers, and people from all over the world could attend without excess cost. The experience of going somewhere and being there was of course absent, but that would have a disproportionate cost for a short conference in any case.

## DevTernity 2023

The conference will be on 7-8 December, online. One conference day, followed by a workshop day - both optional. Registration is already open on the [DevTernity website](https://devternity.com).

The headline again is "Turning developers into architects and tech leads", however I suggest keeping an open mind and making your choice based on the talks they'll have lined up.

The 2022 website has now been superseded by the 2023 one, with many of the speakers, talks, and workshops already lined up. For a complete view of the 2022 iteration, you could visit the [DevTernity 2022 page on the Wayback Machine](http://web.archive.org/web/20221128060607/https://devternity.com/).