---
title: What to do when some of the team you’re working with aren’t as technically
  adept as you
date: 2018-11-09 00:00:00 Z
categories:
- phands
- Delivery
tags:
- Agile,
- Development,
- DevOps
author: phands
layout: default_post
summary: There are differences in technical ability across any development team. In
  this post I look at how those differences can result in substandard code getting
  into your releases, and some steps to take to avoid that happening.
---

In this blog post, I am hoping to cover something that almost everybody working within a software development team has had to handle, but that often isn’t mentioned or discussed for reasons based mostly on team dynamic and morale: how good the people that are working in the team are, and that someone on the team has logically got to be the weakest at the coding language currently being used on the project that is being worked on.

I am hoping to delve a bit deeper into this, with some examples of how this difference in competence can result in substandard code appearing in your master trunk / released products, and finally give some tips and pointers that I personally follow to try my best to mitigate the risk of this occurring.

## Well this is a bit awkward…

First things first, let’s say the awkward bit and get it out in the open. Whether you work for an independent consultancy (regardless of size), or you work as part of an in-house software development team, there is going to be a spectrum of quality and you are going to sit somewhere on it. Writing code is an inherently challenging activity, not only due to its complexity, but also because, due to the problems very nature, there are usually many different solutions to the same task to solve. That is not to say that person A is always better than person B. It may well be that the current languages being used are languages person A has had much more exposure to, and they are higher on the spectrum at this particular point in time. With a different tech stack on a different project person B might be more proficient. But the important, often unspoken fact is that there is still a hierarchy in ability.

## Different ability levels in agile

In theory the agile methodology removes a considerable amount of the problems that can occur from this. Each team member estimates a story or task based on relative complexity. So, person A and person B (if they’ve been doing agile and backlog refinement / story estimation for a long time) should assign a similar amount of relative complexity – it will just take person A less time than person B to resolve that specific story. However agile, in its very structure of being an ‘equal members of a team’ approach to developing as a small unit, can also cause problems. While every member of a team should have a voice on relative complexity of a project, is it correct for person A, with a wealth of experience in the complications that can arise from the seemingly easy story presented, to have exactly the same say as person B, who is basing their estimate on a different tech stack and how they envisage the issues falling out? Agile principles would tell us yes, while a slightly more pragmatic approach might be to allow person A to lead the estimation. This can be somewhat mitigated with correct discussion (which agile philosophy encourages if estimations are massively inconsistent).

## OK, so we’ve accepted some people are more proficient than others, now what?

The fact that team members have different technical capacities isn’t necessarily a bad thing. Indeed, I am of the opinion that having an eclectic mix of coding experience is beneficial for all members of the team. Those that are less proficient are exposed to a high calibre of development in the technical language currently being worked on. The theory of education of ‘learning-by-doing’, coined by John Dewey is strongly encouraged as code review process, paired programming and elements of agile practice (such as estimation) result in a high level of interaction, and the standard of code for the team should, theoretically, continue to improve. Conversely the members of the team who are considered the local expert on the tech stack currently being used are routinely challenged on their grasp of the tech, in terms of how they can explain it in basic principles, and on their understanding of *why* a certain convention is the correct / optimal way to write that code. And clearly this in itself is subjective. “There’s more than one way to skin an asynchronous function” would have been a much more apt saying (if less catchy). As the standard of the team improves the conversations as to why a certain approach needs to be taken becomes much more of a discussion than a direction.

Another advantage that comes from having differing levels of ability across a development team is that the pace of the development can be maintained with intelligent ‘divvying up’ of the imminent tasks at hand in the present sprint (assuming an agile philosophy). Those with more experience and proficiency can pick up the most technically challenging stories that are at the top of the backlog, while other members can slowly improve their capability with tasks that have less demanding acceptance criteria. This enables the team to continue through the backlog and outstanding tasks as required, while continuing to improve through review process and discussion.

That isn’t to say this is the way it should be done. If there is scope for paired programming there is no reason that person B – with less exposure to some of the tougher elements of the language stack – can’t work with person A. The back and forth and discussion while constructing the solution line by line will give, in my opinion, an unrivalled learning experience for person B. If person B is convicted in asking questions and comfortable to learn from person A then person A will also benefit greatly from having to build the code base with explanations as to ‘why’ every step of the way.

## So, it’s a *good* thing that teams have different levels of ability?

Well…Sort of. There are pitfalls to avoid, and sometimes these pitfalls can put a lot of pressure on the structure of a team (particularly one that is trying to use the agile philosophy as virtuously as possible).

It goes without saying that in a professional team using agile, if everybody is equally proficient at the language stack being used, and more importantly everybody on the team is highly capable and can write premium quality code, the work gets done quickly and to a high standard. How quickly the team members improve and bounce off one another when everyone is of an identical standard in this theoretical makeup compared to the more realistic eclectic mixture team is open for debate. I personally feel that a mixture drives improvement the best. But any work being done by a team for a live client (be it in house or as part of an external consultancy) will be done the quickest to the expected high standard with a team made of person As.

This in itself isn’t a realistic proposition, even if it is painted that way by most sales teams and recruitment staff. A lot more typical is the spectrum of ability we have been looking at.

## Pitfalls to avoid – what can go wrong?

In the positives I exalted using the code review process as a tool to help less experienced team members improve in their tech knowledge and get better. This is the case, in the scenario outlined where person A reviews person B’s pull request and suggests improvements with detailed, helpful comments. However, let’s imagine a scenario that can occur:

The team is made up of 5 members: Andy, Ben, Claire, Danielle and Edward. Andy is the most proficient member of the team, having years of experience over the rest of the team. He typically works on the most complicated stories that come into the backlog and spends the rest of his time assisting his team-mates in the work they do.

This sprint a bunch of complicated stories have been added to the backlog of work as high priority by the product owner. Andy is on a two week vacation. Now it falls to the rest of the team to complete the more challenging tasks without him. Ben begins working on one of the tasks and puts a solution together. After a lot of wrestling with the problem he has constructed a way to achieve the acceptance criteria specified. He submits a PR to Claire, Danielle and Edward and all three approve of the changes after review, as they have as much experience in the tech and the problem as Ben does. Ben merges these changes into the master branch and the story points are banked. This happens throughout the sprint for other stories and tasks. Andy returns from his holiday the next sprint and the agile process continues.

At this point typically one of two things will occur, if the codebase is still being actively worked on:

1)	A couple of sprints later while working on a different part of the codebase to solve a new problem the PO has presented, Andy spots the code Ben merged and sees that it is done in an anti-pattern and should be done differently. Andy now needs to find time to make the changes needed when the story points are already banked.

2)	A bug arises from the way Ben has constructed the solution. In investigation Andy finds the issue (the way the code was written originally) and must spend time resolving the bug.

Clearly the solution to the problem cannot be ‘Don’t let Andy go on holiday’ (regardless of how much the product owner might like that to be the solution!) but this is one of the problems that can manifest itself.

With the larger enterprises, most projects end up bigger than one agile team can realistically handle. While embracing the agile philosophy a lot of these enterprises have looked at scaling up agile (one example being the scaled agile framework). In this there are multiple, independent agile teams (squads) working in tandem across a project in a single vision (fleet), sometimes sharing important team members like product owners and business analysts. In this fleet wide approach, a common codebase is sometimes used, and this can result in more potential issues if different squads have different technical capability, as this example will hopefully show:

There are two different squads operating on the same codebase in two different geographical locations. Squad 1 is based in London, squad 2 is based in New York. Because of the makeup of the fleet, squad 1 consists of members that are a lot more experienced and proficient in the technology stack being used.

A member of squad 2 submits a PR with a solution to a complicated problem to the shared codebase. This solution is sub-optimal, but nobody in squad 2 is aware of how to improve on it. The PR is submitted towards the end of the working day for squad 2, which, being based in America, is hours after all of UK-based squad 1 have finished for the day (and hence they won’t see the PR until tomorrow). Other members of squad 2 review the PR and approve the changes, and the request is merged in that day. Members of squad 1, who would have requested modifications and suggested improvements, haven’t seen the PR before it has been merged in, at which point it is typically considered too late to retrospectively suggest changes. The same 2 scenarios outline above will now usually end up occurring, because the code base has got code in it of a sub-standard nature.

## How can we negate these pitfalls?

It’s not easy. Some things are unavoidable, and (in the first example with Andy’s holiday) the options are usually constrained by a demand for the delivery of the story in question. However, in my experience there are a few steps one can take, that fall into the remit and acceptable philosophy of everyone being equal in agile:

### For everyone in the squad:

1)	Agree on a set amount of “cooling time” for PRs. This allows members of the team to correctly assess the suitability of the changes that are being touted for the master branch, and it shifts culpability onto the reviewer to review the code in that timespan. This is clearly fluid, any arbitrary changes (such as pixel adjustments or changes to hard coded text, as examples) could be considered exempt. This will help to negate the possibility of only members of the squad / fleet who are technically not quite so advanced reviewing the code and letting it get in.

2)	On submitting a PR for approval, *ask for approval*. While it seems pretty obvious, simply ensuring that more experienced members of the squad are asked for review will help to ensure the standard of the codebase.

3)	Requesting time for refactor. Most agile timelines usually have a sprint set aside before release to production to allow for test automation, refactoring, bug fixes and general code tidy-up. This is usually the first thing culled if the release is delayed or pushed back, and rarely do teams actually get time to refactor their code without some underhand practices like overestimating stories to get some breathing space to refactor. Asking for time to refactor is clearly a negotiation and selling the business value of making something that works, work nicer, can be a difficult pitch. But this can allow for some time for paired programming and fixing and refactoring pieces of code that may have made it into the master branch.

### If you’re a technically proficient member of the team:

(I accept that you may not know where you sit on the spectrum exactly. But in keeping with handling the awkwardness of these subjects, everyone has a rough idea of where in the hierarchy they sit). If you find yourself more capable than most, these things can help the team improve and keep the codebase to a high standard, while continuing to finish story points:

1)	Review PRs quickly. Whether the onus should be placed on you or not to review the PRs or the submitter to wait is a question for debate. But if, as an experienced member of the team, you can weigh in quickly, then changes can be made, and the team member will benefit from your experience.

2)	Make yourself available for conversations. If person B is struggling to implement your PR review comments it’s a lot less daunting to get in touch privately, via paired programming or a shared screen chat, than to have a conversation on a PR for all to see.

3)	Explain yourself clearly and assume nothing. While the benefits of constructing this bit of logic in one way may be obvious to you, assuming that person B hasn’t understood that and explaining it to them – in my experience – will not offend them. If they know the detail already they’ll skip it, if they don’t, you’ve made a developer that little bit better.

### If you’re less experienced and still learning:

In my opinion your responsibilities in this team dynamic in terms of trying to maintain the codebase standard are minimal. Your focus should be on attempting to improve your own knowledge and understanding of the language. To that end I would recommend:

1)	Ask questions. Lots of them. Most developers start off from a very similar position to you (I know when I started learning Javascript I knew less than nothing!) and are sympathetic to developers wanting to improve. There is no such thing as a bad question!

I wouldn’t recommend you attempt to do anything more than that. Asking questions, religiously, to strive to get better, is the best way for you to individually improve your own coding capability and avoid some of the pitfalls that can occur.

## Disclaimer

I’m aware this blog post is filled with opinion and things that are relatively awkward to talk about. I’ve tried to draw on my own experience and things I’ve observed being done well or not so well. And in terms of where I consider myself on the spectrum, I’m definitely more of a Person B!
