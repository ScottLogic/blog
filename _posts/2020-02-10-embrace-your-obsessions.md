---
title: Embrace your Obsessions!
date: 2020-02-10 00:00:00 Z
categories:
- swaterman
- Tech
tags:
- minesweeper
- retrospectives
- advice
author: swaterman
layout: default_post
summary: For the past 3 months, I have been a bit obsessed with Minesweeper. It has
  plagued my honeymoon, stolen my free time, and been the subject of two tech talks.
  That's a good thing.
summary-short: I have been obsessed with Minesweeper - an experience I can highly
  recommend!
image: swaterman/assets/embrace-your-obsessions/web.png
---

*In this post, I tell the story of my recent obsession with the game Minesweeper and discuss why having an obsession can be helpful.*

<br/>

A few months ago, my wife and I were playing a lot of [Minesweeper](https://en.wikipedia.org/wiki/Minesweeper_(video_game)).
It was a dark time - I even spent £3.99 for a Nintendo Switch version!
When playing a game, I often think about how I'd write an AI for it.
*Most of the time*, I don't actually implement that algorithm.

This time was different.
It all snowballed from there - implementing the solver was just the beginning.
Two months on, I can think of at least six side projects that are the direct result of my Minesweeper obsession.

### Artifact 1: A Minesweeper Solver 

We were on our honeymoon at the time, travelling around Europe by train.
That meant a lot of downtime, and I just happened to have a laptop with IntelliJ.

![I am on a train playing a card game]({{ site.github.url }}/swaterman/assets/embrace-your-obsessions/starrealms.jpg "Can recommend both Star Realms & cheap 1st class upgrades")

*(I did other things too, promise)*

My solver defined Minesweeper as a set of constraints.
Each constraint declared `This set of unknown cells contains between <min> and <max> mines`.
If you want the details of how it all works, watch one of the talks later in this post or have a look at the [Minesweeper Constrained readme](https://github.com/stevenwaterman/Minesweeper-Constrained/blob/master/README.md#constraint-actions).

I did finish my solver, and it worked - but it wasn't flawless.
It never made a mistake, but occasionally it would get stuck in a situation that I could solve manually.
Making things worse, at one point I sat for 5 minutes assuming it had crashed, only for the solver to then report it had processed *5 million* constraints!
Looking back, this was inevitable given that [Minesweeper is NP-Complete](http://simon.bailey.at/random/kaye.minesweeper.pdf).

All in all, the solver was good, and my constraint-based technique worked, but it wasn't a great bit of programming.
I'm not particularly proud of it, so [here's someone's dissertation on the topic](https://dash.harvard.edu/bitstream/handle/1/14398552/BECERRA-SENIORTHESIS-2015.pdf?sequence=1) instead.

I thought that writing the solver would satisfy me and end my obsession - but it only made me want to do more...

### Artifact 2: A Lightning Talk

It was time for Scott Logic's annual Christmas Lightning talks, and my Minesweeper obsession was in full swing.
I knew exactly what I wanted to talk about, and jumped at the chance to indoctrinate the rest of the office!
It was my first real Tech Talk, and I was well outside my comfort zone.
It didn't help that everyone kept telling me that Lightning talks are the hardest kind of tech talk!

I spent 2 days straight preparing for this 3 minute talk, which I titled `How to solve Minesweeper in 3 minutes`.
It paid off though - I finished perfectly on time, and the audience really enjoyed it.
One member of the audience enjoyed it so much that I was invited to give a longer version at the local meetup, [NE:Tech](https://www.meetup.com/NE-Tech/events/267298193/).

<iframe class="video-frame" width="560" height="315" src='https://youtube.com/embed/E7UYQA-7Ego' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

If you're not prepared to listen to me shout for 3 minutes, you can just [read the slides](http://www.stevenwaterman.uk/assets/slides/how-to-solve-minesweeper-in-3-mins.pdf) on my website.

### Artifact 3: Minesweeper Constrained

So, I was invited to give a long-form talk, in a 15 minute slot.
I knew from my previous talk that the audience was getting a bit lost when things got complex.
Since this talk was going to be even more in-depth, I decided to include audience participation to keep people engaged.
Adding audience participation just raised the bar - it's one thing to understand a talk, but it's another thing entirely to understand well enough to participate!

I had a week's notice before the talk, and thankfully had nothing else to do.
After spending every available moment working on it, I finished my version of Minesweeper with a few hours to spare.
It forced you to act like an algorithmic solver, manually combining and clearing constraints.
I called it `Minesweeper Constrained`, and it served its purpose - though it wasn't exactly efficient.

You can view the [source code on GitHub](https://github.com/stevenwaterman/Minesweeper-Constrained) or try a [live version of the game on my website](http://minesweeper.stevenwaterman.uk).

### Artifact 4: A Long Talk!

With my game complete, I needed to think about how to do the actual talk.
I'd never seen a tech talk with heavy audience participation, so I relied on my experience with Improvised Comedy.
There were three stages to my plan:

1. Humorous introduction without theme to set a light-hearted tone
1. Introduce a theme and the audience participation
1. Bribe with chocolates

But what theme would I pick for a presentation about clearing minefields?
The military-industrial complex, of course!

<iframe class="video-frame" width="560" height="315" src='https://youtube.com/embed/2ibiA5TEsxw' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

All in all, my presentation went well.
People enjoyed it (including the venue staff!) and I think they understood what I was going for.
The main complaint was the number of people (and fire sprinklers) I hit with chocolate projectiles!

### Artifact 5: An article about SAT Solvers

While researching Minesweeper solvers, I came across [Kaboom](https://pwmarcz.pl/blog/kaboom/), a version of Minesweeper which forces you to play methodically.
If you guess unnecessarily, you always lose - but if you're forced to guess then you're guaranteed to be correct.
As part of that, they had to use a Minesweeper solver to know when guessing was needed.
They used a [SAT solver](https://en.wikipedia.org/wiki/Boolean_satisfiability_problem#Algorithms_for_solving_SAT), which inspired me to write a [blog post about SAT solvers](https://blog.scottlogic.com/2020/01/16/planning-56-sprints-per-second-with-sat4j.html) applied to sprint planning.

There were lots of examples of SAT solvers used for Minesweeper - which made it really easy to learn how they worked when researching for the blog post.
Any time I got confused, I could rely on the general context of Minesweeper which I understood well.
I always knew *what* they were trying to do, and just had to work out *how* they were achieving that.

### Artifact 6: Optimised Minesweeper

Looking back on my NE:Tech talk, I was embarrassed at how inefficient Minesweeper Constrained was.
I knew I could do better if I tried to write an optimised version, so I started looking into [Svelte](https://svelte.dev/).
I was led down a rabbit-hole of svelte optimisation, exploring the intricacies of the HTML rendering pipeline.

This is a whole story in itself, and one I wanted to write about in more detail.
You can read all about the optimisation process in my next blog post [Slow Code HATES him!](https://blog.scottlogic.com/2020/02/17/minesweeper-optimisation.html)

# Obsessions are good

A lot of my recent productivity has been a direct result of my Minesweeper obsession.
I don't mean that I was working any harder or longer hours than usual.
I was enjoying it, but I was still working my usual hours.
I was more productive because **I'd already done most of the work**.

By having an obsession, and making any new projects related to it, you end up writing some parts over and over again.
It means you can focus on the *how*.
You know *what* you're building, *what* the requirements are, and *what* is transferrable.
You can focus on *how* the latest project is different, and *how* you're going to leverage those differences.

![A visual representation of how each task feeds into each other. The same information is in the bullet points following the diagram]({{ site.github.url }}/swaterman/assets/embrace-your-obsessions/web.png "*Everything's Connected*")

I worked out my solving algorithm in November, and everything since has just built on that.

* When writing the solver, I knew the algorithm inside-out, and explored *how* to transfer that to an efficient implementation.
* When writing the 1st talk, I had a deep understanding of the topic, and could focus on how to present it to an audience.
* When writing Minesweeper Constrained, the only bit I didn't know what *how* to port my solver and my talk's visualisations to a website.
* When writing the 2nd talk, I focussed on *how* a longer talk and audience participation would affect the style.
* When learning about SAT solvers, I could read examples that discussed Minesweeper and know exactly *what* they were trying to do, focussing on *how* they described that as a SAT problem.
* When it eventually got around to optimisation, I had already written the solver twice, and all I cared about was *how* to optimise the implementation.

Having an obsession is great because it means you can do the same thing over and over again in different ways, focussing on how it's different each time.
**What will your obsession be?**

<br/>
<hr/>

I'd like to end this post by thanking all the people that supported me through this obsession, giving me progressively bigger opportunities.

* My wife Amie, for tolerating discussion of inexact constraints at 11pm on the streets of Cologne
* Andy, Wayne, John, and everyone else that helped me practice my Lightning talk
* Chris B, for asking me to speak at NE:Tech
* Sam P, for being super encouraging after NE:Tech and pushing me out of my comfort zone
* James D, for inviting me to give a talk at the London office
* Chris P, for appearing like StackOverflow personified and teaching me the secrets of HTML rendering
* Bartosz, for being a constant help with the blog, talks, and my application to Build IT Right
* Erin, for being a star and helping me edit all these blog posts!

