---
title: Want to deliver value? Focus on flow
date: 2025-06-27 13:38:00 Z
categories:
- Delivery
author: nhume
---

In simple terms, a process that’s becoming more efficient might be defined as one that generates more value without the need for greater effort. However, simplicity is not a defining characteristic of most software development projects, and the more they grow in size and complexity, the more opportunities there are for inefficiencies to creep in.

The software development process is relatively easy to conceptualise, and is all too often oversimplified or trivialised, by everyone, from engineering teams, to managers, to stakeholders. The fact remains however, it is complex, nuanced, and challenging to get right.

A helpful metaphor is to visualise the software development process as pipework. Just like the plumbing in your house, it doesn’t run from point-to-point but instead it must navigate a number of obstacles in order to reach its destination.

Just as actual pipes have twists and turns and become furred up over time, so too does the software development pipework have the potential to be bent out of shape and slowed down by inefficient practices. On the route to delivering and realising value, the aim is to reduce the number of twists and turns in the pipework and avoid adding sludge into the pipework in the first place.

Additionally, the software development process isn’t a static team artefact agreed at the start of a project – it is dynamic and requires attention and effort to improve its efficiency. In my experience of software projects spanning more than two decades, suboptimal flow has diverse causes, but some common factors manifest throughout the software development process.

In this blog post, I’ll share some insights into practices and processes that reduce flow and what you can do to improve flow. It’s important to point out this is purposefully methodology-agnostic; I want to get beyond the rituals and practices of the different approaches and focus instead on the underlying best practices.

There is no one-size-fits-all approach, no silver bullet. However, through continual evolution, it is possible to improve processes, productivity, and effectiveness, whether you’re building a simple API or overseeing a major legacy modernisation programme.

## Some causes of reduced flow

Several of the main causes of pipework friction are interruptions and disconnections in the flow at different stages, and these causes often overlap with each other. Some of these causes are foundational to the way a project is set up, introducing twists and turns into the pipework from the start.

An example of this that I’ve seen time again is the separation of Development and Test. Using simple terms to illustrate the point, Ticket A is worked on by a developer and then handed over to a test engineer. The developer begins work on Ticket B while the test engineer works on Ticket A. When the test engineer inevitably finds issues with Ticket A (sometimes weeks later), they have to interrupt the developer’s work on Ticket B and ask them to switch context to resolve issues with the earlier ticket. Picture that as pipework. I’m not sure anyone would intentionally design pipework with that many backward turns in it if they were aiming for efficiency.

Tipping sludge into the pipework also reduces flow, such as tickets that are simply not ready to be worked on at the point they enter the pipework. The tickets need to be somewhat more complete than the archetypal one-liner, they should have clear requirements and scope, ideally have clear acceptance criteria, but potentially more importantly they should have had all the eyes-on needed to shape them into a known or discernible piece of work. Not doing that just makes that happen at a less efficient time later in the process, one that all too often gets perceived as an unnecessary delay.

A further cause of friction comes from constant shifting of priorities. This can originate outside the team through pressure from business stakeholders, or inside the team with (to return to the example above) the fixes to Ticket A suddenly being deemed more important than concluding work on Ticket B. Course changes cause context switching which places additional cognitive load on the team, which slows down progress and delays the delivery of value. It is acknowledged that sometimes change is needed, and it is the correct course of action, however it does have an impact on the short-term effectiveness of the team.

Another recurrent cause of friction is the introduction of too much concurrency into the pipework. This can be a byproduct of the above; for example, poorly defined tickets are opened, pass back and forth whilst the gaps in information and understanding are closed, and remain open until they are deemed complete. Meanwhile, more tickets are opened, and the pipework starts furring up. Another, more common, cause of concurrency derives from the desire to move fast and start lots of things at once, with the insistence that a team of five should work in isolation on five tickets – thereby exacerbating all the different causes of friction described above.

The cumulative impact of these issues is not insignificant. The team is actively hampered from achieving its full potential, the organisation suffers from reduced business agility, and value is released later (sometimes much later) than targeted.

## How to improve flow

As I said, there is no one-size-fits-all approach, no silver bullet. I’ll offer some examples below of approaches that should improve flow, but I want to stress that the most important thing is to foster the right mindset. Fundamentally, you and your team should review your own processes and practices in a spirit of continuous improvement. Don’t let suboptimal processes become normalised and justified as “the way we’ve always done things”.

It’s common to see teams down in the weeds and suffering the pain of inefficient processes, not even conceiving of the notion that things could be done differently. Sometimes, when delivery isn’t panning out as expected, wholesale changes are made in an attempt to fix whatever has been singled out as ‘the problem’, without any real investigation into the underlying causes, which, in itself creates additional friction.

However, what’s called for is evolution, not revolution. Throughout any software delivery project, it’s vital to keep stepping back to see the end-to-end process, looking for nasty twists in the pipework and sections that are furring up. Use an existing forum or create a new forum for this, creating a constructive opportunity to effect positive change. Together, the team can identify issues that are causing pain, agree actions to make things better, along with some mechanism of how this change will be evaluated. This becomes an iterative process of gradual, intentional improvement and smooths flow through the pipework so that business value can be delivered more rapidly.

Each software development project is unique and so the improvements needed will need to be tailored to you and your team’s scenario. However, to provide some illustrative examples from my experience of improving flow, let’s return to the reductions in flow that I described earlier.

The biggest improvements in flow are likely to result from ‘shifting test left’. Remove any artificial separation of Development and Test so that the two disciplines can work collaboratively from the start, working together on tickets so that testing happens alongside development until the ticket is closed. No more back and forth, no more needless loops in the pipework, significantly reducing the need for context switching and therefore reducing cognitive load.

Ensure that appropriate investment is spent on tickets before they enter the pipework, avoiding delays during what was expected to be productive development and testing time, so that value can be released as quickly and effectively as possible. Further improve this process by ensuring that there is a clear prioritisation, so that work being undertaken helps to meet the expectations that have been set in terms of delivery dates and release dates and crucially helps to avoid impromptu changes in priority.

Those responsible for release activity will gain better visibility of tickets progressing towards them, with greater confidence as to when tickets will be ready to deploy to production. The team overall will become better able to commit to release dates, building stakeholder confidence.

Keep a check on concurrency, resist the false notion that starting everything together will result in a quicker delivery of everything. Use size, complexity and dependencies to help determine how many pieces of work your team can tackle successfully. Synergy is real, but more than that, it also spreads knowledge which helps reduce single points of failure in the future. It might also mean that you have more people who can help when there is an urgent need such as a production issue, or a high priority piece of work.

Wherever possible, identify and remove the need for context switching. It’s very inefficient and difficult for those having to context switch to maintain for any period of time. Removing the need for it will improve flow and importantly improve morale of those who were having to endure it.

I’ve seen all those strategies improve flow on projects I’ve worked on, but you will need to work out the right strategies for your particular context. What is vital is to understand your ability to make improvements to the flow in your own pipework. And in my experience, any team that is able to complete work and deliver value on a regular, ongoing basis is (generally) a happy team, ergo a happy team is a productive team.

## A few takeaways

No one buys a car or a house and assumes that it’s the last time they will ever spend money on it. Everyone involved in software development projects, from senior leadership down, should understand that time, money and effort need to be invested in the pipework itself, not just the product or service that’s being delivered – and that this is an ongoing investment throughout the project. By understanding that, they will appreciate better that there are consequences whenever a decision or action introduces a new bend in the pipework. Everyone needs to be cognisant of the short-term impact constructive change can have on the efficiency of the pipework, as optimisation won’t happen instantly and it isn’t totally ‘free’, however, the effort to change will be repaid multiple times over.

It’s tempting to try to change everything at once – don’t. Make deliberate changes, review them, and evolve, always maintaining the focus on flow. As changes are made, you may well identify other opportunities to optimise further.

The overarching principle is to increase flow, getting items from the beginning of the pipework to the end as efficiently and effectively as possible. I said there were no silver bullets, but I’ll end by leaving you with some bullets of another kind:

* Value is only realised once software is in use, so aim to release business value as quickly as possible.

* Speed comes from effectiveness, not from cutting corners – keep in mind that ‘smooth is fast, fast is smooth’.

* Maximise people’s potential by reducing handoffs and context switching.

* Set the team up for success from the start – avoid adding unnecessary twists and turns in the pipework and do not tip sludge into the pipework.

* The beginning of the software development process is just as important as the rest, if not more so.