---
title: Contributing to open source - taking the dive
date: 2022-08-15 14:57:00 Z
categories:
- jdunleavy
- Open Source
tags:
- Open Source
- Tech
- Beginner
- programming
- learning
summary: My experience contributing to open source as a first-timer - along with some
  thoughts for those that are looking to take part but are unsure of what to expect.
author: jdunleavy
---

Working on open source projects can be a great learning experience for any developer looking to expand their skills. It’s also a good way for newcomers to gain demonstrable, practical skills that could help them land their first developer job. However, getting started can be daunting. As a self-taught developer, despite having toyed with the idea when I first started learning, I never quite found the courage to dive in – being somewhat afraid of exposing my inexperience. In hindsight, it feels like a missed opportunity given that it could have provided me with some of the hands-on experience that I was lacking at the time. 

Over the last few weeks, I finally got round to spending some time working on some open source projects. I have yet to have a pull request approved and it’s been a bit of a bumpy ride – but such is the fitful nature of open source. If you are new to open source, the following sections should give you a better idea of what to expect and how to prepare before taking the plunge.

**The journey begins**

I began my foray by sifting through the many [first good issue](https://catalins.tech/find-open-source-projects-to-contribute-as-a-beginner) websites providing a hodgepodge of issues from all kinds of open source projects looking for help. Feeling a little overwhelmed by the sheer variety of issues that needed addressing, I settled on a [small issue](https://github.com/oxyplot/oxyplot/issues/1469) to ease myself in and familiarise myself with the contribution process. The task required changing the software’s default font size and style to system defaults. But there were a couple of things that the original request didn’t address – such as how we were going to handle the font size of titles and subtitles. I made a couple of suggestions and implemented the requested changes, eagerly awaiting a response which – unfortunately, never came. The project showed signs of life but taking a closer look, it appears the maintainer was no longer very active.

In light of this, I picked up a [second issue](https://github.com/xunit/xunit/issues/1963) from the xUnit project. A safe bet I thought, given that it’s such a widely used unit testing tool that is actively in development. At first, I was unable to get some of the tests to run. Thinking about how ironic it was that I was unable to run tests in a piece of software built entirely for this purpose, it occurred to me that this was a chicken and egg situation – the software’s unit testing tool was implemented by the code it was being used to test. I eventually stumbled upon a [post](https://github.com/xunit/xunit/discussions/2328) buried in the project’s discussions tab in which the project maintainer confirmed that the latest tests were not yet supported by the test runner. He did, however, provide a workaround that helped me get the tests up and running. This information would have been more helpful had it been contained within the documentation. Unfortunately, due to the ever-evolving nature of software, new requirements can sometimes get left out and trawling through community support pages for answers is to be expected.

A few years had passed since the xUnit issue had been raised. Within that time, a pull request had been initiated but by the time the maintainer responded, the person who had made the pull request had disappeared. Eventually, the issue was closed following a change of mind and a new issue was raised as a result. What began as a potential candidate for an interesting task to work on had fizzled out into a request for a class to be sealed. Somewhat disappointed by this, I decided to go ahead and implement the change anyway. But after speaking to the maintainer, it emerged that within the time that had passed since this new issue was raised, the software had evolved, and sealing the class no longer made sense – so once again the issue was closed. 

Due to the stop-and-start nature of open source collaborative work, this situation isn’t uncommon. Often, weeks or even months can go by before a message is answered – by which time the contributor might have moved on or lost interest. This isn’t to say that their efforts go to waste as new information or a new perspective might be brought to light, resulting in further discussion and – ultimately – better outcomes. 

Determined to make it past the finish line, I picked up a [third issue](https://github.com/cake-build/cake/issues/1852). This time I had done my homework – pick an issue that is unlikely to get shut down - *check*. Make sure the maintainer is active - *check*. It ticked all the boxes! Clicking on create a pull request after the previous two failed attempts felt incredibly satisfying. Only my excitement was short-lived. It appears that the maintainer was active up until the day I made the pull request because they haven't been active since.

**Reflecting on my experience**

I’m now three weeks in and despite my best efforts, I have yet to make any useful contributions to open source. Given that I have resolved myself to writing a blog post detailing my experience, it’s starting to dawn on me that I might just be an imposter.

Community-based open source software is built by-and-large by the goodwill of those willing to offer their time and effort for “free”. Thus, tight schedules and deadlines that come about as the result of financial interests don’t apply, and as a contributor, you just have to accept that you will be working asynchronously at a discontinuous pace. Waiting a few weeks or months for a response from someone at work might have you questioning that person’s aptitude for the job, but with open source, it’s to be expected. 

Not only do maintainers provide the bulk of the work on the projects they maintain, they also have to sift through a mountain of questions, suggestions and pull requests – often maintaining more than one project at a time and/or working at a job that actually puts food on the table. [Burnout is all too common](https://www.jeffgeerling.com/blog/2022/burden-open-source-maintainer) and there is often no other choice but to prioritise who they respond to. Another reason you might not get a response in due time is that the project may have become irrelevant or reached a state of maturity, and the maintainers have simply moved on to greener pastures.

The keyword here is *patience*. Don’t expect to jump in and be done within a couple of weeks because you will likely have spokes thrown into your wheels. A project’s requirements are likely to change over time rendering some lingering requests invalid, its maintainers may go silent for a while, or some other unforeseen circumstances might occur. However long it takes for a maintainer to get back to you, it’s important that you are prepared to follow through – or at the very least let them know if you have lost interest, were unable to resolve the issue, or have moved on.

**Word of advice**

Let’s face it, if you are a developer you likely eat patience for breakfast and none of what I have said will have put you off. If you are wondering how to best prepare for your first code contribution, my advice is to make sure you have a decent understanding of unit testing beforehand. Languages, frameworks and software design will vary wildly from project to project, but any project worth its salt will have some form of unit testing.

When working on open source projects, test-driven development is particularly useful because it allows you to zone in on just the part that is relevant to the problem you’re trying to solve, without having to know the software inside out. For each of the issues I addressed, I began by writing the tests that met the requirements first and then made the necessary adjustments for the tests to pass. In many cases, you will be able to resolve issues without having to worry about how to run the software or one of its libraries, or even how to use it.

**When all is said and done**

If you would like to join me on this journey, know that things might not always go to plan and that some patience is required. You might find yourself scratching your head trying to figure out why something isn’t working as expected and why you can’t find answers within the documentation. Or worse, some of your efforts might even lead to a dead end. But stick with it and you could learn a thing or two, maybe even gain some valuable experience and – best of all – when you finally get that first pull request approved, you will be rewarded with a feeling akin to what a child feels when receiving a sticker in class simply for doing something good. 




