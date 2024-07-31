---
title: If agile is the answer, what is the question?
date: 2024-07-31 06:00:00 Z
categories:
- Delivery
tags:
- Agile
- Self-Organizing Teams
- Delivery
summary: We often talk about how to be agile, about particular ceremonies and processes
  but what problem is it we are trying to solve? In this post I'll take a look at
  what we mean when we talk about agile, what it's come to represent and what the
  point is behind aiming for agility.
author: dogle
---

The other day a colleague asked this question on one of our internal Slack channels: 

> "If you were writing headings in a document, and using the capitalisation style of capitalising the first letter of just the important words in a header, how would you capitalise 'what we are trying to achieve?'"

The answers were many and varied, ranging from serious answers with supporting documentation to tongue-in-cheek responses, the answer which won the day though was this: 

> "Objective"

Clever, isn’t it? One of our more astute developers noted that this is a good demonstration of top consultancy skills, i.e. giving the client a solution to the problem they are trying to solve rather than just answering the question asked.

# What does it mean to be agile?

This got me thinking about agile (as that’s my particular itch to scratch right now). So often when we talk about agile, we look at answering the question asked: How do I run a stand up? How do we plan? How do we scale? How do we work iteratively? How often do we look deeper at the underlying problem we are trying to solve? Why do we need to be agile? How is it helping us? In the early days of my career, I often found myself wondering why it was that agile seemed to be very specifically relevant to developing software. We’ve had engineers for a long time, we’ve successfully built houses, bridges and all sorts of infrastructure seemingly without anyone ever seeing the need to rethink the processes involved. What’s different about software that requires an agile approach? I’ll come back to that.

It seems to me that there is a growing movement to reject agile and the things it has come to represent. A quick search for agile online returns [multiple](https://www.reddit.com/r/programming/comments/hygojk/i_hate_agile_development_because_its_been_coopted/) [hits](https://news.ycombinator.com/item?id=5406384) for developers discussing why they hate agile. Articles such as [this one](https://www.theregister.com/2024/06/05/agile_failure_rates/) making claims that agile doesn’t work for a lot of projects, whilst clearly not much of a scientific study, gain huge publicity, indicating that for many people this is something that they already believe to be true. Movements such as [Agile 2](https://agile2.net/) have arisen claiming to be a new iteration of agile more suited to modern ways of developing software. The claim is made that the original manifesto missed out some key topics such as leadership and data and also that agile has become steeped in dogma and prioritises the team over individuals. We are told that agile [encourages micromanagement](https://age-of-product.com/agile-micromanagement/) and at the same time that it encourages [removal](https://kenschwaber.wordpress.com/2011/04/24/agility-and-pmi/) of management entirely in a “leave us alone” culture. 

# Back to basics

Whether or not we believe this is true of agile or merely agile done badly is irrelevant. Clearly the message is that, for many people, the term agile refers to a process which they believe is broken. A process which perhaps no longer works for today's development teams, is outdated, misused and imposed on teams as a one-size-fits-all solution to software development. What we mean when we say we're being agile is very important then and seems to differ dramatically dependent on who you talk to. 
[In the past](https://blog.scottlogic.com/2024/04/17/is-agile-the-answer.html) I’ve said that when looking to define agile development we can do worse than to look to the [manifesto](https://agilemanifesto.org/). I think that still holds true: agile existed before the manifesto of course (it just wasn’t called that) but it wasn’t until February 2001 in Snowbird, Utah that people came together and tried to clarify what they thought was important and common to the various alternate approaches to software development they were practising. What they quickly agreed upon were four things which they valued: 

- Individuals and interactions.
- Working software.
- Customer collaboration.
- Responding to change.

Agile then, by this definition, is about people, about getting working software out the door, about collaborating with those who we are building the software for and about being flexible in our approach. Overall, this is a pretty uncontroversial list of things, and when taken at face value, I see no reason why it’s less true today than it ever was. 

# Our survey says...

As we’ve seen, agile means different things to different people. The agile community of practice here at Scott Logic recently ran a survey in which we asked people to define what they felt was meant by the term agile development and to tell us what problem they think it solves. The results are interesting. I've put together an ordered list of the most common things people mentioned when asked to describe what agile means to them.  

1. Iterative approach.
2. Being flexible.
3. Collaboration.
4. Incremental process.
5. Regular feedback.
6. Speed (in general or getting started quickly).
7. Self organising teams.
8. Reacting to change.
9. Team focused / inclusive.
10. Value working software.

When compared against the manifesto it seems the things that people (at least at Scott Logic) feel really set agile apart are a focus on collaboration and the flexibility we gain through an iterative, incremental approach.

# What problem are we solving?

What problem is it solving though? If being agile is not all the meetings and dogma which has built up around the word, why are we using it and why is it useful? 

For me it comes down to this: 

> "Being agile helps us most when we either don't fully know our goal or else we are unsure of the path to get there e.g. if we don't really know all the requirements upfront and need to discover them as we go. In this scenario we can't map out a complete route to the finish line so need to make small steps, checking each time if we are closer or farther away than we were before."

That’s just my opinion, but it seems fairly consistent with what others think too. Here are the top ten most common responses from the survey:

1. It's impossible to know all the requirements upfront.
2. We need to have regular feedback loops.
3. We need to be responsive to change.
4. It saves us time.
5. We need to be exploratory in our approach.
6. We need close collaboration with stakeholders.
7. We need to do what works over following a rigid plan.
8. We need transparency with stakeholders.
9. It removes inefficiency from the process.
10. It avoids rework.

Our survey results show that, overwhelmingly the number one problem people are trying to solve with agile development is that they either don’t know all the requirements for a project upfront or that those requirements are subject to change. Other responses align closely with that problem e.g. the need for quick feedback loops, the need for stakeholders to know what we are building as we go and the problem of building something only to find out it was the wrong thing. 

I think that makes sense, if we think about our earlier question of why software development is different from building a house, one of the main differences is that we've built a house before, we know what’s involved and we probably understand most if not all the requirements upfront. We're unlikely to get started and then discover that we now need to turn the house into an office block for example. We also have a set finish point, we know when we’re done and the house is complete. In software we often don’t know exactly what we are building, we have a rough idea and discover it as we go. We've also probably never built this software before because if we had, there presumably wouldn’t be a need for it. Lastly we might not ever be done, software evolves and shifts over time as we add new features and remove old things.

# What's the question?

If the answer is being agile, then the question it seems is:

> “How do we build software when we don’t know the goal? We don't have the full requirements upfront, have never built something similar before and know that the requirements are likely to change while we are building it. We also know we may never be done as there may always be new things to do".

When we answer with "by being agile", what we often mean it seems is that we aim to show working software to stakeholders regularly so that they can see what we're building and give us the crucial feedback which prevents us getting too far down the road in the wrong direction. We do this by using an iterative approach, with regular feedback loops and close collaboration with those who we are building the software for to make sure we’re always headed in the right direction and can easily change that direction as and when the business requirements shift.
