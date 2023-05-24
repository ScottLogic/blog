---
title: The Product Owner Role
date: 2023-05-24 12:31:00 Z
categories:
- Delivery
tags:
- delivery
- product
- ''
- Agile
- Scrum
- Business Agility
summary: An oft-misunderstood role that is key to delivering the right solutions.
author: fhubin
---

## “Where do you see yourself in five years’ time?”

That common interview question has always made me smile. Someone who often does not know what they will have for lunch that same day just asked you to plan for the next five years. The answer does not require a good project manager, but a seer, if it is to sound realistic. Long gone are the days when one would enter a company fresh out of school, and follow the formatted career path left by their predecessors, slowly but steadily climbing the ladder for the following forty years. Nowadays, a career is much more haphazard. Even if one has an end goal in mind, the ways to get there are many and often convoluted.

At least, that is my experience: my career has been a succession of opportunities – several times, opportunities that I would have found unappealing earlier in life. Software engineering, project management, team management were not my calling; toddler-me wanted to drive an excavator. In some way, I probably still yearn for the exhilaration of commanding a Bagger 288. But life did not happen that way.

Back to our topic: after years of being a Scrum Master, a new opportunity came up: I was given the chance to play another role in the Agile team: Product Owner.

## What is a Product Owner and what do they do?

This in no way claims to be a detailed and comprehensive recap of what the Product Owner (PO) is or does; there is enough literature on the subject online, starting with [scrum.org](https://www.scrum.org/resources/what-is-a-product-owner). It is merely a reflection of my own experience. So, what is it that I do?

## It is (probably) not what you think!

It is a difficult truth to apprehend, but even in 2023, the role remains confusing to many. The PO is not planning and driving the delivery of a system (that is the Delivery Manager’s job); the PO does not decide how the system is designed and built (that is the Architect’s role); the PO does not look after the team (Scrum Master’s role); the PO does not design the look-and-feel of the system (UX/UI experts do that), the PO does not (necessarily) capture the detailed requirements of the system (Business Analysts do).

What does the PO do, then? In a nutshell, it boils down to one thing: stakeholder management. That is:

* Manage business stakeholders to reassure them that the team is delivering the right thing for the business, and

* Manage technical stakeholders to reassure them that they are delivering the right product for the business.

Indeed, in several years as a PO, I have only written a handful of JIRA tickets. When I took the role, I fully expected to be writing most (business) tickets, be heavily involved in ceremonies (planning, most of all), be demoed to, and, generally, be present where I thought the many PO I had worked with previously were absent. Reality turned out to be rather different.

I work with business analysts who write JIRA tickets and merely consult me – not because the task is below me, but because I am constantly in meetings and have no time to do it myself. The teams building the solutions we deliver also raise their fair share of tickets themselves: everything from “swap this Web component for that one,” to “upgrade our version of log4j” is best left for the techies to specify; they do it much better.

Agile ceremonies are useful, but I rarely have the time to attend them. So I work closely with the Scrum Masters, so they ensure my priorities get the airtime they deserve.

## Vision

The natural first thing a PO does is capture the product vision, a brief document in plain language that tells what the business is trying to achieve, and why. As usual, there are only ever two possible reasons: to make money, or to save money. “Increase efficiency” really means: “achieve more with less.” “Provide a better experience” stands for: “avoid rework,” or “spend less time holding a user’s hand.” Simples.
My product visions are a short slide deck that outlines:

1. The business drivers: why are we doing this?

2. The current situation and its shortcomings

3. The proposed solution and its advantages

4. An elevator pitch: a sentence that crystallise the objective of the solution

That product vision is essential: I play it back to the business to give them confidence their needs have been understood. I also use it to reassure the team that the direction is known and approved. Soon, various parties will shower the team with confusion, which makes this simple vision very valuable, and something to frequently refer back to. The idea is to move ever closer to that vision. If a piece of work takes the project further from realising the vision, it is likely the wrong thing to do.

## Priorities

The PO’s role is, in large part, to decide what to do next. Why? To maximise the value generated by the product in as short a time as possible. That is what drives the prioritisation process.

As the project gains in clarity and stability, further projections become relevant – no more: what are we doing today? More: what are we doing for the next two quarters. That is when the roadmap appears.

## Roadmaps

The roadmap’s purpose is to communicate the order in which features are made available in a simple, visual format. It shows what comes next, i.e. what is being worked on now, with relative certainty. It shows what is intended to be released in the not-too-distant future (next quarter, for example), and that is aspirational. Finally, it outlines what happens beyond that horizon, and that belongs to the realm of science fiction.

A roadmap should also illustrate what value comes out when – e.g., in the next quarter, the checkout feature of a Web site will be unveiled (what is released); it will allow customers to buy online (the new capability), that will result in a 40% increase in our revenue (what value is generated – preferably quantified).

In any case, remember a roadmap is not a plan. It is indicative, aspirational, provisional, or whatever adjective applies, but what it does not do is give certainty over when exactly something is delivered, or how. It is not a collection of milestones. It merely reflects the PO’s understanding of the order in which the value is best maximised, given what is known at the time of producing that roadmap. It is not an exact science, and it will inevitably change over time, along with circumstances. I spend a lot of time making that clear to my stakeholders.

## Vision, Priorities and Roadmaps. What else?

Most of my time is spent managing stakeholders. It is not sufficient to have them agree on the vision at the project’s inception and have a vague awareness of a roadmap; they need to be on board for the whole journey, and be reassured that their interests are still my priority.

To achieve that, I find it useful to divide stakeholders into key ones and non-key ones. The key stakeholders deserve more attention, because they are very close to the project. Oftentimes, they are the sponsor and the Subject Matter Experts (SME), usually the first who will use the system directly. Others need to be on board as well, but they require less immediate attention. When all is said and done, they are not the ones paying the bills.

I set up frequent meetings with my key stakeholders (sponsor, SMEs). In the beginning, I believe there is no such thing as overkill. One does not build a trusting relationship by spending five minutes a month with another person. Thirty minutes once a week is a strict minimum. I let the stakeholders decide when they have seen enough of me. That tends to coincide with the moment they become confident I represent them and their interest adequately. We then review the frequency of our meetings.

In parallel, I create a steering group comprising all stakeholders, key and non-key. I facilitate it, and have the participants negotiate the direction amongst themselves, rather than impose mine. It reassures everyone that I am there to represent their interests, not my own. I may own a product, yet I do not shape said product for my own benefit. I shape it so it fulfils the needs of its end users, some of whom are in that steering group.

If at an impasse, I do offer an opinion to help break the deadlock. I take care to explain my reasoning for whatever solution I propose. There are situations where those stakeholders cannot decide what will be useful for them, or how to measure success. It is my role to help them. That is where the product vision is most useful: priorities need to tie up to the high-level goals (make money or save money).

## Are you some kind of Proxy PO, then?

That phrase reflects a lack of understanding of the role. The PO is a proxy for the business. They act as a single point of contact between the various business stakeholders and the team who build the solution. An interface between business and tech teams. The phrase “proxy Product Owner,” aside from being somewhat belittling, implies there is a dedicated PO on the business side, and someone else to represent them.

No, the PO reports directly to the client, not to the delivery team’s lead. The PO is accountable for what is delivered, and in which order, since they set the priorities.

However, that can be slightly confusing for a client too. I am likely to be asked for a roadmap (which is correct), an update on progress (at a push), or a project plan (that is the Delivery Manager’s job). The person asking does not always understand the difference between a roadmap (aspirational) and a plan (how the objectives are implemented), and I often have to explain the distinction, or remind them what my role is.

## Does the role not require someone *from* the business?

In theory, perhaps the optimal PO candidate comes straight from the business. In practice, businesses often outsource the development of their solutions to external suppliers. That takes the form of a project, by nature a temporary engagement (*). Businesses rarely have the means to dedicate a full-time role to a temporary endeavour. And that is if they understand the importance of the PO’s role in the first place.

\(*) Whether those projects are a good way to approach building a solution is another subject for another day.

With the above in mind, three situations are common:

1. The business does appoint someone internal… who has another full-time job already

2. The business appoints a third party, contractor or otherwise

3. There is no PO

Each comes with its disadvantages. But before we look at them, let us reflect on why a PO is important.

Any project will come with a collection of stakeholders (sponsors, users, potential users, architects, building teams, upstream and downstream dependencies, etc.), all with different desires and needs regarding the solution to be built. Those stakeholders will not present a unified front and make clear decisions on the way forward. Instead, they will each push for their own interest, because they are themselves under pressure to deliver something (another application, insights, savings, or other). That lack of clear decisions often results in analysis paralysis. A PO’s job in that case is to push back, decide and map out what is released when, if at all, based on projected value, and sell that to their stakeholders. In doing that, the PO manages stakeholders’ expectations, and gives a clear steer to the team, shielding them from distractions and shifting priorities.

That shielding and that stakeholder management tend to be a full-time occupation. Certainly in the early stages of a project, before there is a shared understanding of the direction of travel. It requires drive to force a consensus, if one is not forthcoming, but also a degree of agnosticism, and the ability to operate for the greater good. A PO must not be afraid of pleasing one stakeholder and disappointing another one, one day, and reverse that sentiment the following day, if that makes business sense. They must be able to do that at all levels of the organisational hierarchy without causing long-term resentment, which requires tact, and relationship-nurturing, i.e. time. A client PO doing the role as a side-job is not necessarily best placed to do that: they are simply not available enough, because they are busy doing another job.

A third-party PO has little skin in the game. Their interest lies in securing their position, which often translates to: “pleasing the business.” They have little-to-no accountability for what the team delivers. They often end up being but a mailbox between the business and the team building the solution, not quick to challenge the business stakeholders or push back on antagonistic priorities, and not particularly invested in the team’s success. A pessimistic view, perhaps, yet one that is far from rare. I have certainly come across it more than once.

If there is no PO at all, well, the team is left to do all the prioritisation themselves, based on myriads of requirements from various stakeholders. A stressful juggling game that keeps them away from doing what they are good at: building a quality product.

## Who, then?

It may be counter-intuitive, yet a PO from the same supplier as the team who builds the solution is often best. Indeed, that person is keen to see the team succeed: the team’s failure would inevitably reflect badly on the PO too. A client may question whether such a PO is the best representative of their interest; the answer has to be yes, or the PO is not doing the job properly.

The actual interest of the client, by the way, is to have a solution live, generating value in the shortest possible time. The PO’s role is to help that happen. The solution will not be perfect from the start, regardless of how much time and effort is invested in trying to make it all-encompassing. Once it is live, even imperfect, it starts generating some value, thereby reducing its cost.

Minimising the time to market frequently translates to keeping a client focussed on one thing at a time. It is important to accept that trying to please everyone at once equates to pleasing no-one. It is important to operate for the greater good of the organisation, not for the benefit of an individual. It is, in other words, being impartial. Interestingly, that is often much easier for a vendor than it is for a client, who will have spent years developing internal relationships, and may, in some cases, have a bias.

## The Consultant Product Owner

That brings us to why we consultants do a role that is traditionally reserved to those who employ us. We do it, because it benefits all parties involved.

Firstly, our teams know what they are working towards and how it generates value, because they talk to the PO regularly. They have a single point of contact they can easily approach for all business questions, whilst being sheltered from shifting priorities and internal client politics. They can focus on what they do best: deliver high-quality solutions for our clients.

The capability allows consultants to move to a more business-oriented position without having to leave the consultancy world. And unlike what sometimes happens, a consultant PO is not tied to one product for the rest of their career: their objective is to bring the product to maturity, then pass it on. It is still a consultant role, with the variety that implies.

Most importantly, it benefits our clients tremendously. By supplying a PO, we free them up to do what they are good at (the business part), and help them prioritise based on projected generated value. And, since we are accountable for the outcome, it is an assurance that we will seek to do the right thing for them, aim for success, and help them measure that success.