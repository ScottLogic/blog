---
title: How much does a story point cost?
date: 2018-02-16 00:00:00 Z
categories:
- fhubin
- Delivery
tags:
- agile
- scrum
- cost
- project
- management
- self-organised
- team
author: fhubin
layout: default_post
summary: How many times have you heard that from a client?
---

How many times have you heard that from a client?

Usually, a sponsor, or a traditional project manager embarks on a tirade:

_"Back in the day, we would use ideal engineering man-days as a benchmark. Then the work would be estimated in hours, which would then be fit into ideal engineering man-days (ca 80% of a full-time day). The developers would work through the tasks and we could easily monitor spending and progress. With your Agile ways, how can I know if a project is on track and on budget?"_

How does one answer something like that?

There is no simple answer, really. It requires such a radical mind shift that it is impossible to convince someone who asks those questions in only a few words. It requires a long and occasionally challenging education journey. It is, however, helpful for the Agile practitioner to understand the concepts. After all, convincing a stakeholder is easier for a supplier who masters their subject.

Let us pick the bits of that tirade one by one, and build up context in order to tackle the final question of how much a story point costs.

1. Use ideal engineering man-days vs. story points to measure effort
2. Break down all the work into work packages and estimate them
3. Burn down through work packages
4. Measure overall progress based on work package burn-down
5. Equate burn-down with spending
6. Derive the cost of a work unit


### 1) Use ideal engineering man-days vs. story points to measure effort

The Internet is full of articles explaining in detail why story points (SP) became the industry standard to estimate work packages ([here](http://blog.scottlogic.com/2017/09/19/how-big-is-a-story-point.html) is one). In short, when estimating in man-hours or man-days, different developers will estimate differently, based on their skills, experience, domain knowledge or other. Story points are a scale that caters for those parameters. 3 SP might translate into a different duration for different developers, but that is not an issue -- in fact, it is the point.
It is tempting here for the sponsor or the traditional project manager to want to gauge the developer's worth based on that. _"Sprint after sprint, Paul completes twice as many SP as John. Surely, John is not performing."_
The reasons might be many -- e.g. John started recently, whereas Paul designed the system, two years ago; or John spends a lot of time code reviewing, or pairing with Paul, effectively helping Paul tally up the story points.
Regardless of the exact reason for that apparent difference in throughput, story points cannot be used to measure an individual’s ability. The team’s output is the only metric to measure. If an individual is indeed not performing, it is the self-organised team’s responsibility to discuss options, e.g. in a retrospective.
The important thing to understand, here, and take away from it, is that story points have no meaning outside of the Scrum team and the sprint. Another team will estimate differently. The same team working on another work stream will estimate differently.
Story points are used by the Scrum team to measure the team's velocity and gauge how much output is achievable in the next sprint -- typically assessed during sprint planning. Story points cannot be used to gauge individuals and must not be equated to man-days.

_"In that case, what is the point? With ideal engineering man-days, one was able to gauge individual performance and it gave visibility over how long development would take!"_

Bluntly put: no and no. Estimates in man-days were more often wrong than right, which gave no reliable visibility over how long development was really meant to take. All it provided was an unrealistic baseline (because based on unreliable estimates and not taking deviation into account), with all the inherent challenges that came along when the inevitable re-planning moment hit (e.g. stakeholder management, budget negotiation, pressure on teams). As for gauging performance, estimation in man-days merely drove rivalry and resentment, instead of collaboration and mentoring, because it put the emphasis on individual performance, rather than team performance. That was not a good thing for the client or the business, either culturally, or in terms of business value delivered.

Estimating in man-days gave a false sense of control to sponsors and traditional project managers. It made no sense for anyone else and inevitably ended in tears.
Story points, on the other hand, make no sense to sponsors and traditional project managers as they do not allow them to monitor progress and hence, insist on applying techniques that ignore the inherent uncertainty in projects. They do, however, make sense to teams who see them as a more reliable way to measure and forecast progress -- and, ultimately, serve the business.

### 2) Break down all the work into work packages and estimate them

It is that period at the beginning of a project, where the traditional project manager and other stakeholders sit down to break down the work into palatable chunks, so they can each be estimated, before the work actually starts.

**Why it makes sense:**
It gives a clear picture of all the activities that need to take place, the interdependencies, and forms the basis of the project plan. In turn, the plan shows the critical path that illustrates the milestones (what is needed when), and how likely it is that those milestones will be hit.

**Why it does not make sense:**
Estimates will change. By estimating so early on in the Software Delivery Life Cycle (SDLC), the probability that the estimates are accurate is virtually 0. The reasons for that are many: firstly, user feedback will dictate scope changes and new priorities to help improve the product -- a key principle of Agile; secondly, there are many unknowns (technical challenges or other) that no-one is yet aware of, that will add complexity (and therefore time) to the implementation. It is impossible to factor those in during estimation, because not only does no-one know how complex those unknowns are, no-one even knows they exist (that is called the “unknown unknowns”). More importantly, however: the requirements will change. Businesses face an ever-changing landscape. Their needs will evolve over time. On top of that, they will have an idea and a vision, as well as an expectation for what that vision's implementation will produce. The reality, once their vision is implemented and hits the real world, is that the vision might not bear the results the business had expected; in which case, they will refine their vision (in other words: change the requirements) and expect the tech team to oblige.

In those circumstances, a project plan and its critical path are as useful and reliable as a chocolate teapot. Extrapolating, it is easy to understand why defining and estimating all the work packages upfront is a rather futile exercise.
An understanding of the overarching goal and of the rough, global size of a project is useful. Breaking down to work packages and estimating in detail before the implementation starts is a waste of time, or an exercise that needs to be reviewed on a daily basis for the duration of the project (also known as: a waste of time).

The alternative is to have different planning horizons, with a detailed plan for the next sprint or two (detailed breakdown with estimates in story points), and guidance and a roadmap for further in time (a high-level appreciation of the global project's size, or t-shirt-size estimates, and a view of the main deliverables). That pragmatic approach allows reasonably reliable forecast and ensures time, effort and budget is spent on work that is immediately relevant at any given time.

### 3) Burn down through work packages

During implementation, the sponsor and the traditional project manager will likely want to monitor spending and progress. In other words, ensure that the required, fixed requirements are not taking more time to implement than forecast and, are not more expensive than forecast. The traditional project manager will likely use that to gauge how hard or efficiently the dev team is working.

**Why it makes sense:**
After all, the sponsor has likely battled hard to secure a budget for this implementation and is keen not to overspend. It is also extremely likely that the sponsor has publicly announced a release date, so users can gear up for the change. Understandably, they want the solution to be rolled out when they announced it would be.

**Why it does not make sense:**
Despite the often-held belief that they are or can be, requirements in a typical project are seldom fixed. It is impossible to determine how long a functionality will take to build, if the definition of said functionality (scope) changes. If the scope is fluid, then the duration and the cost to complete the implementation of the scope cannot be fixed, or even predicted with much accuracy.
In any case, a team does not accurately know how long something will take to build... until it is built. That is in part due to the “unknown unknowns” we talked about previously.

In those circumstances, a traditional project will often be deemed "not on track," because the scope has changed, or because hurdles were encountered that could not be planned around.

As for the traditional project manager using the burndown chart to gauge how hard a team is really working, it also makes no sense: a team might be working twice as hard as required and still be "late," if the requirements are thrice as complex as anticipated, or if new, urgent requirements are constantly thrown into the mix.
A more useful gauge is the burn-up chart, where effort consumption is tracked, rather than "progress." That will better represent what the budget is spent on, and help the sponsor decide whether it is spent on the right priorities or not and act accordingly. It also shows how hard the team really is working -- although the focus should be on value and upcoming priorities instead of team effort.

The traditional project manager might argue that it is necessary to control scope change, or lock down the scope altogether. It makes for a more stable and predictable development cycle indeed. Unfortunately, it also almost inevitably leads to a solution that does not fulfil business needs and, therefore, does not achieve the sponsor's targets (also known as: a waste of money).
By fixing the time and the cost instead, but not the scope, Agile/Scrum promises to accommodate changes to scope, so the team can deliver what the business really needs and help the sponsor achieve their targets. 

In summary, that model of fixed scope, controlled-variable time, controlled-variable cost does not work, because the scope never really is fixed.
Scrum spins that on its head and fixes the time and cost, whilst leaving the scope variable. A Scrum sprint has a set duration and a set cost. The only variable is what comes out at the end of the sprint. The traditional project manager does not need to try and determine the cost of a work package, because it is irrelevant. The only unit that has a cost and a duration is the sprint.

### 4) Measure overall progress based on work package burndown

This is a way for the sponsor and the traditional project manager to monitor overall progress on the project. If an individual work package does not follow the expected burn-down, the implications can be highlighted for the overall timeline and cost.

**Why it makes sense:**
The sponsor, who is keen to not overspend and has likely announced a release date, wants to confirm that their projections are still valid. Perhaps the traditional project manager wants to measure how the development team, who might be a third party, is performing.

**Why it makes no sense:**
Think of all the arguments against monitoring burn-down of one work package and raise them to the power of the number of work packages. Fluctuating requirements will have an amplified impact on the whole project, inevitably delaying delivery, and potentially affecting the overall cost.

Instead, a much more valuable parameter to measure is the value generated at the end of each sprint. The right question for the sponsor to ask is not: _“how much has this project cost me, so far?”_ It is instead: _“how much value has been generated since the inception of the project?”_ Another one is: _“how does that compare to the cost of the project, so far?”_

A sponsor tends to worry less about cost, when they are shown generated value -- which is usually their real concern.

### 5) Equate burn-down with spending

The cost of a man-day is known (e.g. £500). If a work package takes 3 man-days to complete, said work package costs 3 x £500 = £1,500. Simple.

**Why it makes sense:**
When one hires a builder to fit a bathroom, one usually wants to make sure the builder is working within the budget. When the sponsor hires an IT team to build a feature, they want to make sure the team is working within the budget that was probably difficult to secure.

**Why it does not make sense:**
Although the intent, at the start of the sprint, is to complete the chosen stories, reality often does not make it so. Whether it is an urgent requirement, an undetected dependency, a production issue to fix, or other, there are many reasons why a requirement cannot be completed. In that case, the burn-down is flat. That does not mean the team is not working -- they are simply working on something else. During that time, the requirement in question does not burn down, but it does also not cost more. Here, it is important to remember that the cost is fixed and is the cost of a sprint, whilst the scope is variable. What comes out of the sprint is done in agreement with the business, personified by the product owner; the delay should be understood, and the cost will not vary.

### 6) Cost of a work unit

Easy. The team tells the sponsor and the traditional project manager how many man-days are needed to complete the requirements, and, leaving rate negotiation for another article, the sponsor can negotiate a budget with their own boss (with a bit of contingency, just in case).

**Why it makes sense:**
A budget needs to be secured for the project to start. In order to plan for the right budget, the sponsor needs to understand the anticipated cost. That is traditionally a simple multiplication of the cost of a work unit (man-day or story point) and the number of work units.

**Why it does not make sense:**
It might be tempting to start from the postulate that a developer will "produce," on average, 6 SP per sprint. A sprint is 10 days. A dev man-day is, say, £500. 6 SP therefore cost £500 x 10 and 1 SP is £5,000 / 6. That is criminally ignoring all the less visible activities needed to complete a story (analysis, testing, management, devops, architecture), several of which are performed by other team members who are also billed for each day they work. Not to mention that a team might achieve 24 SP in one sprint and 37 in the next.
The price of a story point is not fixed. The cost of the sprint is.

The cost of a work unit must never be used for forecasting a project's cost.

In an Agile approach, the only work unit that can be cost is the sprint. The sprint has a fixed cost, which makes it an easy calculation. Even if the team scales up, the cost of the sprint is still fixed -- the sum of the daily rates of each team member multiplied by the duration of the sprint. The cost of the whole project? The cost of the sprint, multiplied by the number of sprints. How many sprints are needed? As many as the sponsor is prepared to fund, really. The requirements will change through the course of the project, and the solution will generate value as soon as a Minimum Viable Product (MVP, the minimum required for a first delivery that will generate value, once in production) is released. Depending on how much the requirements change and how much value is generated from the MVP, the sponsor will decide whether to continue or not. It is worth noting that the team composition may change, if that makes sense from the sponsor’s point of view. For example, by front-loading the project to deliver an MVP by a certain date, then reducing the team beyond that initial roll-out.

### What is the cost of a feature?

Only once the sprint is complete, is it safe to evaluate the cost of a feature, relating its estimation to the total output of the sprint. E.g. if the sprint cost is £50,000 and the velocity is 30, a 3 SP story can be estimated to cost 3/30, or 10% of £50,000, or £5,000. That is not a particularly useful exercise, yet it will reassure the sponsor and the traditional project manager that the team is indeed tracking costs. Until the sponsor and the project manager are comfortable with an Agile approach, that might come in handy.

### Conclusions

What is the cost of a story point? It is irrelevant. One can work out the cost of a story point for a particular team during a particular sprint _after the sprint is finished_. That must not be used for forecasting, however: swap a team member, change the scope slightly, or change the circumstances in which work gets estimated and the result might be completely different.
