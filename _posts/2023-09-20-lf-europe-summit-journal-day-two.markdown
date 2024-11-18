---
title: LF Europe Summit Journal - Day Two
date: 2023-09-20 19:47:00 Z
categories:
- Tech
summary: This year I’m attending the Linux Foundation Europe Summit, a sizable event bringing together 1,000s of people involved in open source. Day two was packed with surveys, statistics and the fragility of the node ecosystem..
author: ceberhardt
image: uploads/opentofu.jpeg
---

This year I’m attending the Linux Foundation Europe Summit, a sizable event bringing together 1,000s of people involved in open source. I typically take extensive notes of the sessions I attend, so thought I’d share them here on our blog.

This is day two of my journal, while yesterday it was all about [OSPOs, SBOM security, and AI](https://blog.scottlogic.com/2023/09/20/lf-europe-summit-journal-day-one.html), today was packed with surveys, statistics and the fragility of the node ecosystem.

If you’re interested in the details, then read on!

## Keynote

Today it was [Jim Zemlin](https://www.linkedin.com/in/zemlin/)’s turn to led the keynote, with an underlying theme of “don’t panic”. 

Jim kicked off by talking about the widely reported change in licence adopted by Hashicorp (of Terraform fame), moving from a permissive open source licence to something called a Business Source License (BSL), where source is available on request. This caused quite a lot of drama (Jim noted that this community does love a bit of drama!), and ultimately the community took matters into their own hands and forked the project. If this is a term you’re not familiar with, it basically means that the community has taken the Terraform source code and is now committed to maintaining it themselves. The big announcement today was that this project is now called [OpenTofu](https://opentofu.org/) and will be run under the stewardship of the Linux Foundation.

![opentofu.jpeg](/uploads/opentofu.jpeg)

Next Jim discussed open source AI, noting that much of this technology is already being built on open source code. An area where Jim is concerned is potential knee-jerk regulation, with some calling to halt the development of AI in case it become weaponised. Jim reminded us all that we shouldn’t repeat the mistakes of the past, citing the export-controls that were initially applied to cryptography which resulted in [Phil Zimmerman](https://en.wikipedia.org/wiki/Phil_Zimmermann), the inventor of PGP, coming under criminal investigation. Ultimately the challenges we’re facing here (bias, job displacement) aren’t going to be solved by banning the technology. I was a bit disappointed that Jim didn’t discuss some of the issues around copyright, to my mind this is going to bite us very soon.

The final keynote session was presented by [Fiona Krakenbürger](https://www.linkedin.com/in/fiona-krakenbuerger/?originalSubdomain=de) and [Tara Tarakiyee](https://www.linkedin.com/in/tarakiyee/) who told the story of the [Sovereign Tech Fund](https://sovereigntechfund.de/en/), a government funded initiative to support our digital infrastructure. The initial feasibility study, that was used to launch the fund, was released the day before [log4shell](https://en.wikipedia.org/wiki/Log4Shell) zero-day hit, a timely illustration of exactly why initiatives like this are really needed. Having been granted funds last year they have kicked off their pilot round, funding ~10 projects, personally I like the way that they have focussed on language ecosystems as well as specific projects. Also, this was the first presentation to include the classic [Nebraska xkcd](https://xkcd.com/2347/)!


## What's the State of Open Source in Europe?

I didn’t attend any other morning sessions because I was preparing for my own, appearing as a panellist, alongside Mirko Boehm, Hilary Carter and Sachiko Muto to discuss the findings of our recent report. We were all really pleased to present to a full house, no doubt fueled by the number of times Gab plugged the report in the day one keynote. 

![lf-report.jpeg](/uploads/lf-report.jpeg)

One feature of the report that was called out in yesterday’s keynote was the challenges facing public sector organisations. They are struggling to find value in open source, when compared to other sectors, and have different expectations and desired areas of investment. I asked our audience how many of them were employed by a public sector organisation, with only three people raising their hands. I feel our report carries an important message, but perhaps the Linux Foundation Summit isn’t the best place to share it? We need to find ways to take this message more directly to those involved in public sector technology. 

Anyhow, if you haven’t done-so already, go ahead and [read the report](https://www.linuxfoundation.org/research/world-of-open-source-eu-2023?hsLang=en)!

…

You’ve read it now? Good.


## The future of JavaScript package management

Darcy Clarke had a liberal smattering of memes and GIFs. Exactly what I’d expect from a JavaScript talk! He kicked off with Steve Jobs quote that I’ve not heard before:

> The line of code that's the fastest to write, that never breaks, that doesn't need maintenance, is the line you never had to write

I like it!

Darcy went on to produce some quick stats on package manager size and growth, supply chain attacks, the number of transitive dependencies - lots of big numbers. The transitive dependency issue is one I’m familiar with from my [own research into ExpressJS](https://blog.scottlogic.com/2020/12/22/software-crisis.html). 

A recurring theme of his talk is that almost everything about JavaScript package management is broken. Npm audit is broken, npm compatibility is broken (he gave a good example showing how the code installed via yarn, bun and npm isn’t the same!), dependabot is noisy and broken, no-install is risky, lockfiles are broken, oh yes and there’s this nasty thing called [manifest confusion](https://blog.vlt.sh/blog/the-massive-hole-in-the-npm-ecosystem).

![package-managers.jpeg](/uploads/package-managers.jpeg)

It’s amazing that this stuff works at all? It certainly doesn’t seem to be getting better. However, Darcy is rolling up his sleeves, and building [yet another package manager](https://www.vlt.sh/). Good luck to him - he certainly knows his stuff.

## Lessons Learned from Organizations' Use of Open Source

The final session I attended was presented by Javier Perez of OpenLogic. They’ve also been running an annual survey exploring open source practices. Similar to Darcy’s talk, Javier started with a bucketload of growth stats. 

It’s no great surprise that the results of this report were similar to the findings of the report I was involved in authoring. One statistic that I found notable was that 37% of organisations contribute to open source, which is a 5% increase from last year. Also, the list of technologies businesses consider critical are Node, PHP, git, Wordpress, Tomcat, Linux, Jenkins and Apache HTTP - the important lesson here is that while the new and shiny technologies tend to get most of the attention, it’s the mature, and some might say slightly dull, technologies that businesses really rely upon.

I’d recommend checking out [their full report](https://www.openlogic.com/resources/2023-state-open-source-report) … but not until you’ve read our one first!
