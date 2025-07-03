---
title: How is de-risking a legacy modernisation project different?
date: 2025-07-03 10:55:00 Z
categories:
- Testing
- Delivery
tags:
- legacy modernisation
- legacy IT
- software development
- software engineering
- software development process
- testing
- test engineering
- quality assurance
- test automation
- regression testing
- integration testing
summary: If you’re working on an entirely new product with no dependencies on any
  existing system, you’re free to decide how best to build, test and deploy the product.
  However, if you’re modernising a legacy system, the approach to development and
  testing is less straightforward. In this blog post, I look at some of the key considerations
  that should inform the test strategy for a modernisation project. I also explain
  why it’s important to go beyond the hype and use the right tool for the right job
  at the right time.
author: mcmahon
---

Any of you who have done a home renovation will remember those unexpected hurdles that slow you down from realising your vision – the shoddy plumbing, outdated wiring, or structural challenges your predecessors kindly bestowed upon you. In contrast, when you build a house on a greenfield site (while not without its challenges!), you’re starting from scratch, with fewer dependencies and constraints.

This is analogous to providing quality assurance on software projects. If you’re working on an entirely new product with no dependencies on any existing system, you’re free to decide how best to build, test and deploy the product. However, if you’re modernising a legacy system, the approach to development and testing is less straightforward.

In this blog post, I’ll look at some of the key considerations that should inform the test strategy for a modernisation project. I’ll also explain why it’s important to go beyond the hype and use the right tool for the right job at the right time.

## Maturing the approach

When I was just starting out as a test engineer, I could sometimes be a bit strident about the need to fix bugs I’d identified, and it could be frustrating when I was overruled. But I was lacking the bigger picture. It takes time to mature as a test engineer and appreciate that there are other factors at play. Using a hyperbolic example to illustrate the point, if a company is pushing through a system change so that they can stop haemorrhaging millions of pounds a day, they’re not going to care about a typo. When I mentor junior testers now, it’s a learning curve that I help them along.

Organisations can similarly have varying levels of maturity when it comes to testing. In my experience, organisations with low levels of test maturity can inadvertently increase the time and cost required for projects while decreasing the quality of the output. Markers of low maturity include the separation of development and test within the delivery process, and the imposition of tools, practices or approaches that are not suited to the task at hand. There’s a lot of hype and buzzwords in software engineering, and I’ve seen companies assume they should impose things like comprehensive test automation from the beginning of a legacy modernisation project, because they’ve heard how well that approach delivers value… on greenfield projects.

Organisations with a high level of test maturity factor in the bigger picture when it comes to shaping their test strategy. They might set aspirations to adopt things like test automation over time, but they understand the steps they need to take first. Ultimately, they’re pragmatic. They want to build quality in from the start, and they know that on a legacy modernisation project, this might take a little longer and require a little more initial investment than it would on a greenfield project.

Let me explain my approach to projects like these in helping clients take a pragmatic approach and set their projects up for success.

## De-risking a legacy modernisation project

### Understanding the organisation, the users and the system

As with any other software project, understanding the business goals and the user goals is fundamental to legacy modernisation. Before getting stuck into the ‘wiring’ of the legacy system, I always seek to gain a clear vision of what we’re being tasked with achieving and how success will be measured. It’s this bigger-picture view that allows me to advise the team and the business effectively.

From that high-level view, I then delve into the detail, collaborating with developers and business analysts to understand the existing system in terms of its functionality, user workflows, and current testing practices. It’s vital for us to understand how real users interact with the system, identifying ‘happy paths’ and critical use cases so that we can ensure continuity and usability in the modernised system. At this stage, we can also start to identify ‘unhappy paths’ and unexpected user behaviours which will need to be addressed for the modernisation to be a success.

### Risk management and triage

This is a critical function played by test engineers on legacy modernisation projects (indeed, on any software development project), and it stems from the deep understanding we gain of the business. Throughout a project, it’s our role to identify risks and communicate them clearly and pragmatically, with an understanding of the big-picture perspective. Following triage, we advise on the scale and severity of the risk, but it’s important for us to recognise that the final decision rests with the business. We ensure that the risks are documented and signed off by the appropriate stakeholders so that there’s traceability and accountability.

In our advisory capacity, we support risk management throughout the software development lifecycle (SDLC). For example, on a large legacy modernisation project, it’s usually unfeasible to undertake comprehensive testing; instead, we might advise on a pragmatic, risk-based approach, prioritising particular areas as part of a holistic strategy. If that’s the approach we recommend, we make sure to demonstrate its effectiveness and secure buy-in from stakeholders.

### Regression and integration testing

Legacy systems often have complicated codebases that have evolved over time and sit within complex architectures. For a decades-old system, this can mean that there’s no one left within the organisation with a comprehensive understanding of how it works, which turns the project team into a group of tech archaeologists! For this reason, regression testing is more important on a legacy modernisation project than a greenfield one. Throughout the SDLC, teams need to know that the changes they’re making aren’t breaking functionality elsewhere in the system.

A common mistake I see when it comes to regression testing is that teams build regression packs from past tests. All this does is reconfirm that certain isolated features they’ve built are still working. Again, teams need to take a more holistic approach by carrying out regression testing on end-to-end flows and high-risk areas so that they can validate broader system integrity.

Viewing things from a narrow perspective lies behind another mistake I often encounter, where teams run backend testing in isolation from frontend testing. On modernisation projects, frontend and backend development streams often run in parallel, so it’s understandable that teams often decide to run parallel tests; however, it’s something that needs to be well thought out and coordinated. Integration testing is key to ensuring ongoing alignment of the frontend and backend throughout the project. If it’s not possible to test the integration in the early stages, mocks and stubs can be used to simulate the frontend and backend interactions.

## Making the right use of test automation

I wanted to call out test automation as it’s the perfect example of the difference between a greenfield project and a legacy modernisation project. As I mentioned earlier, there’s a lot of hype around it, with organisations keen to emulate the likes of Spotify, Amazon and Netflix in releasing valuable increments frequently and frictionlessly. By no means am I saying that organisations shouldn’t use test automation on a legacy modernisation project; what I *am* saying is that it needs to be used on suitable tasks at the right time, as part of a test strategy that embraces other types of testing that are suited to the project context.

With all the complex dependencies of a legacy modernisation project, it would take a big up-front investment of time, effort and money to set up comprehensive test automation from the beginning, with no obvious ROI from doing so. The better approach is to build up the automation over time, focusing on particular areas, while manual testing is focused on other areas. Using an example I used earlier, automation is perfectly suited to support regression testing, validating wider system integrity as new functionality is built, rather than just double-checking that features delivered in the previous sprint still work. The benefits of test automation build up gradually while the automation framework is being established. Product delivery might slow down temporarily, but once the framework is in place, delivery will speed up.

Well, it will speed up as long as no one decides to adopt a different test automation tool mid-project, which is something I’ve seen happen on more than one project. It’s important to remember that each tool works differently, meaning that switching horses mid-race will slow you down dramatically. Each time a team adopts a new test automation tool, they have to upskill in how the tool works, update the test suite, and change their coding practices – requiring additional investment of effort, time and money.

## Confidence isn’t bought, it’s earned

Any organisation planning a legacy modernisation project needs to understand that there’s no off-the-shelf solution that will magically de-risk delivery for them. Those organisations with a high level of test maturity will understand that a robust test strategy has to be aligned with business goals and user goals, and tailored to the specific context of the system being modernised. The strategy will be pragmatic in using the right approaches for the right tasks at the right times in the project delivery. It will maintain a holistic view that takes in the system, the project and the wider business. And it will be iterative and incremental, recognising that the mix of testing methods will evolve as delivery progresses.

While buying your way to safety may sound attractive, it’s an illusion. Confidence comes from recognising the complexity of what you’re dealing with and investing time and effort in the right things to de-risk the delivery of your legacy modernisation project.