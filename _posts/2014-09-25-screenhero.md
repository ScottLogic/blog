---
title: Using Screenhero To Turbo-Charge Pair Programming!
date: 2014-09-25 00:00:00 Z
categories:
- Tech
author: jbandenburg
summary: In this blog post, I talk about my team’s journey from traditional “pass me the keyboard and mouse” pair programming to use of Screenhero for IDE sharing both within the office and remotely.
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/09/25/screenhero.html
disqus-id: "/2014/09/25/screenhero.html"
---

*Written in collaboration with [@cjsmithie](https://twitter.com/cjsmithie)*

In this blog post, I talk about my team’s journey from traditional “pass me the keyboard and mouse” pair programming to use of Screenhero for IDE sharing both within the office and remotely.

![Our desks]({{ site.baseurl }}/jbandenburg/assets/screenhero-empty-desks.jpg)

I work in a team practising Agile development (we use Scrum as our process framework). Some way into the project, the subject of [pair programming](http://en.wikipedia.org/wiki/Pair_programming) came up in a retrospective and we decided to try it, as we believed it could improve code quality and knowledge sharing. We resolved to pair for at least two hours every day and posted this resolution in big, bold letters on our team wall.

In the next sprint retrospective, we had to admit that we hadn’t met our target, even though we’d set it at a deliberately low (hopefully achievable) level. Why was this? After a bit of drilling we concluded that we found sitting at someone else’s desk too uncomfortable to do for extended periods of time. We were avoiding pair programming because of how inconvenient it felt. We decided to try something different.

We already had real-time collaboration on documents through tools such as Google Docs, and we wondered how to do the same with our IDE (WebStorm from JetBrains, as it happens). After a bit of research, we settled on [Screenhero](https://screenhero.com/), and we haven’t looked back since. This blog post is about our experiences, and the pros and cons we saw with this approach.

## What is pair programming and why do we do it?

Pair programming is a practice advocated by the Extreme Programming movement. It involves two people working on the same piece of code at the same time. They discuss what they are doing and regularly alternate who is actually writing code. As it is traditionally described, the person typing is focused on low level problems like naming variables and getting the code to compile. The partner has his mind free to focus on the higher level problems.

A common objection to this practice is that it will halve productivity, since a single piece of code is being written by two people. However, studies indicate that pair programming increases code quality without impacting time to deliver (Wikipedia has a list of [empirical studies](http://en.wikipedia.org/wiki/Pair_programming#Empirical_studies)), which is why we decided to do it. We have found that it helps us generate insight, catch errors and share knowledge.

## What we tried first

We started with the most basic approach: Two people sitting at a single computer sharing the screen, keyboard and mouse. The keyboard and mouse are regularly passed back and forth.

#### Pros

 * No setup required: There is no software to install and no extra hardware needed.
 * This is the method advocated by the extreme software movement, so is tried and tested.

#### Cons

 * The pair have to sit physically at the same computer, which can feel crowded, and means someone having to leave their own desk and computer.
 * The keyboard and mouse have to be physically passed between people. (For instance, someone with an ergonomic keyboard might find it difficult to type on a “flat” keyboard.)
 * Depending on the desks, the partner not at the keyboard may be sitting too far from the screen to comfortably read it. The health effects of using such an arrangement for a prolonged period need to be considered.

## The dual screen approach

To make things more comfortable, we tried plugging two keyboards and two mice into the same PC. We found that this worked well on two screens if a single screen was duplicated. (On our team, each team member has two monitors.)

#### Pros

 * Each partner can have their own keyboard and mouse and look at their own screen. Partners can sit side by side.
 * As each partner is close to their respective keyboard, mouse and screen, they can sit comfortably and without strain.

#### Cons

 * Each partner has their own cloned screen, so you’re sacrificing the additional screen that could’ve been used to present supporting information, such as API documentation.
 * Partners still have to sit at the same desk. Also, we found that moving keyboards and mice between computers was tedious and a barrier to actually doing the pairing.
 * Because there is only one mouse pointer, the partners occasionally fight over control.

Ultimately, we still weren’t satisfied with the experience and continued searching for alternatives.

## Screenhero

[![Screenhero]({{ site.baseurl }}/jbandenburg/assets/screenhero-logo-rgb.png)](https://screenhero.com/)

Screenhero is a tool that allows one party to share their screen, keyboard input, and mouse cursor with another party. It also supports remote pairing through VoIP and instant messaging (we found remote working just as productive as us both being in the office).

On the shared screen both users’ cursors are shown along with their names and can be controlled independently.

#### Pros

 * There’s no need to move desks or hardware.
 * Each user has their own cursor. This allows the change of control to flow more freely between the pair.
 * It’s very easy to just share the screen containing your IDE and then collaborate on the code.
 * Each partner has another screen free, which allows them to view supporting information pertinent to the code being written.

#### Cons

 * Involves installing software, which may be difficult or impossible if your machine is locked down by your IT department.
 * Due to image compression, the receiver of the screen-share can sometimes have trouble reading the text in the IDE. It would be nice to see Screenhero add a lossless mode for very high bandwidth connections, such as a LAN.
 * Only works on Windows and Mac OS X.

## Conclusion

We found working with Screenhero to be a real pleasure. We looked around for alternatives, but didn’t find any. Screenhero appears to be quite a unique product.

Control is no longer mutually-exclusive: We can write a suggestion directly into the code when the other person “has the baton”. We found that having a cursor each works really well.

Screenhero has removed the impediments that were stopping us from pairing regularly - it’s as easy as saying “can I share my screen with you?”. Regular pairing has increased knowledge-sharing within the team, reduced code review issues, improved code quality and, ultimately, raised productivity. All of this has led to more enjoyment at work. We’d recommend Screenhero to any agile team.























