---
title: Does Scrum make the Project Manager role redundant?
date: 2014-09-10 00:00:00 Z
categories:
- sfoley
- Tech
author: sfoley
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/09/10/does-scrum-make-project-managers-redundant.html
disqus-id: "/2014/09/10/does-scrum-make-project-managers-redundant.html"
---

This post will address a question that is often raised within organisations transitioning to Agile: is there a place for the Project Manager role when using Scrum on a project? This is a challenging question for IT departments that have historically relied on project managers to control their change portfolio, often trained in using an in-house methodology. Is all this to be rendered redundant by a move to Agile methods?

At Scott Logic we run a lot of Agile projects and this question is asked regularly of us when we’re proposing a team structure for a new client project. In this post I’ll give my perspective on this based on our experience. We’ll focus on Scrum, but this discussion applies to projects run using any Agile method. At Scott Logic we have our own framework for Agile delivery, [Assured Agile](http://www.scottlogic.com/services/assured-agile), which I will refer to although no background knowledge is required!.

## Project Management within Scrum 

Scrum is often classified as Agile’s ‘project management’ method and yet looks incompatible with the traditional Project Manager role. The Scrum method defines only 3 roles: Scrum Master, Development Team and Product Owner. Many of the responsibilities of the traditional Project Manager are covered by these other roles:

- Process focus (Scrum Master)
- Task allocation (Development Team)
- Managing issues and dependencies (Scrum Master/Product Owner)
- Requirements prioritisation (Product Owner)
- Procurement (Product Owner)
- Risk management (everyone, via sprint planning, demos and retrospectives) 

So, given this is all covered, is there any value in assigning a Project Manager to the team? 

## A question of scale and complexity

The answer is (as ever) ‘it depends’! What’s important is to consider the scale and complexity of the project and the wider environment in which it exists. 

We can think about projects on a spectrum of scale and complexity across a number of factors (see the diagram below). At the simplest end we might consider a small, co-located Scrum team delivering a software product with manageable risks and a very simple project environment (i.e. few stakeholders). Here the answer is usually no. As we’ve outlined above, project management responsibilities can be managed within the roles Scrum provides. In this case it’s best to follow a core Agile principle: where responsibility can be devolved into the team then it should be. There is no value in having a Project Manager on the team just for the sake of it. In this situation we’ll often assign a Scrum Master from the team and work out (between this role and the Product Owner) who should take on those traditional project management activities. 

<img src="{{ site.baseurl }}/sfoley/assets/imageOne.png" />

However, the projects we take on are very often of a higher order of complexity across a number of factors, each of which place different demands on the team. As each of these factors increase in relevance, the argument for the addition of a Project Manager becomes much stronger. 

### Project Size

Bigger projects are inherently more complex. Projects with multiple Scrum teams (divided by release or component, for example) will always need an additional layer of co-ordination. This is where a Project Manager becomes very useful. Scrum offers the ‘Scrum of Scrums’ model as a way of scaling within the model, but in our experience this can be inadequate:

1. Individual teams quite naturally focus on the task set for them, rather than everyone else’s problems, so simply relying on teams to organise themselves, without an independent co-ordinating role, is often unrealistic.
1. There are likely to be non-Agile dependencies within and without the project which don’t work to the rhythm of the Scrum teams. 

### Risk Profile

Scrum is a great risk management tool because it significantly decreases the chances of the project delivering the wrong solution. However, ‘requirements’ risk is only one class of risk. Many other sources of risk exist and need to be managed in a more traditional way: identifying, logging and actively managing away. 

It’s essential at the start of any project to run one or more sessions to identify, classify and start managing key risks. Risk management is then a process of actively seeking to manage these known risks away whilst continually monitoring the project environment for new risks. This is a ‘big picture’ activity ideally suited to a Project Manager.

### Physical Distribution of the Team

It’s increasingly common for project teams to be distributed geographically. In this case the need for constant communication within Scrum becomes harder to implement. This is a significant risk: without an easy information flow within the team and active engagement from Product Owners, Scrum becomes much less effective. 

We run highly distributed projects like this regularly and we find that it is a good idea to have a central coordination role in place to oil the wheels of communication. This role ensures that the right structures are in place (technology, meeting schedules, relationship building activities etc) and that the inevitable issues you get around communication on a new team are ironed out quickly. 

### Complexity of the Delivery Process

On medium to large scale enterprise projects, the process of getting things delivered becomes more complex. On a small project it may be a case of releasing a single software deliverable, whereas enterprise level projects often need to deliver larger scale change, including infrastructure and business process change. All of this requires a much greater degree of structure and planning. 

This usually means some sort of phasing. Our Assured Agile framework handles this by imposing a degree of sequential phasing to the project lifecycle to ensure that the project focuses on more than the iterative process of software delivery. At each of these stages the Project Manager role has a significant part to play:

<img src="{{ site.baseurl }}/sfoley/assets/imageTwo.png" />
 
- Enterprise projects require a series of **initiation** activities before Scrum-based delivery gets going. A project without a shared vision and high level scope (including, critically, what’s not in scope) risks failure. Big picture risks need to be identified and mitigation activities started; decisions around architecture and technology choice need to be made and resources identified. Agile methods sometimes call this activity “iteration zero” but on enterprise projects it’s more a phase than an iteration. Assured Agile calls this phase ‘Initiate’ and it is significant enough to require a high degree of planning and organisation. 
- During software **delivery**, the Project Manager can bring planning skills to the management of the Product Backlog and to Release / Sprint Planning. Projects also need to monitor and manage the dependencies they have with other teams and with external projects. We find that it is usually better to have a Project Manager do this to allow the team to focus on the business of software delivery.
- Any significant delivery project requires planning for **transition** to a production environment, ensuring that the organisation is ready for the change and that the project creates the right support team structure. These are often not trivial undertakings! 

### Governance Environment 

Enterprise projects almost always form part of a larger portfolio of work and sit within some sort of governed environment. The overarching programme of work may not be Agile and the natural cadence of the Scrum-based project may not fit well. This is particularly common around status reporting, which is often timed around the Sprint cycle in Scrum but may be much less frequent for the wider programme. In addition, high profile, strategically important projects often have to deal with a complex organisational/political environment where stakeholders may have competing priorities for the project. 

Acting as a buffer between the wider organisation and the project team, the Project Manager role is in an ideal position to manage the flow of information and decisions. Agile methods are good at supplying information on how the project is going, but someone needs to make sure that information is digestible to stakeholders who may convene infrequently. A skilled Project Manager will also help to manage the political environment and protect the team. 

### Commercial considerations

There is another factor to consider which is particularly relevant to us at Scott Logic. When we are asked to manage the delivery of the product, we are always aware that as well as leading the client we are also in a (often new) commercial arrangement with the client. This presents challenges: you want the team (Scott Logic and client team members) to feel and act like one team but there is always that commercial relationship (and contractual obligations) to bear in mind. Our software developers need to be aware of this but don’t generally want to be concerned with anything other than a high quality releasable product. In this case it is useful to have a Project Manager there to manage that commercial boundary, ensuring that we meet our obligations whilst keeping the team focused on the software. 

## What type of Project Manager?

It is important to emphasise that we’re not talking about the old fashioned ‘command and control’ style of project management here. Agile PMs need to fit with the Agile philosophy: delegating as much detail as possible into the team. This leaves the project manager with 3 main areas of responsibility: as a *support* to the team, as a *buffer* to the outside environment and as a *co-ordinator*. 

## Can the Project Manager role be combined with a Scrum role?

One problem faced when integrating the Project Manager role into Agile is that the role is often confused with one of the standard Scrum roles. It’s important to emphasise again that Scrum does not mandate a Project Manager, but when one is needed it does make sense to consider combining the role with one of the standard Scrum roles to make best use of resources. We’ll consider now how the combinations might work:

### Scrum Master and Project Manager

This is the most common combination and it is easy to see why: both roles have a process focus and a responsibility for issue resolution. In that sense, there are aspects of the Scrum Master role which will suit the capabilities of many Project Managers running Agile projects. 

The combination can work, but it is important to note the differences in the roles. The Scrum Master is solely concerned with the efficient execution of the Scrum process for a team and naturally takes a coaching approach to problem solving rather than the directive approach sometimes required in project management. There also may be a natural tension between the roles as the wider programme of work tries to fit the cadence of Scrum into a larger non-Agile governance setup. Combining the roles requires someone with the ability to wear both hats and resolve these tensions.  

### Product Owner and Project Manager

The Product Owner role has elements of overlap with project management. However, typically a Product Owner requires decision making authority for requirements and feature prioritisation, and a level of domain expertise, that Project Managers don't generally have. Conversely, many Product Owners are sourced from business departments and may not be able to bring the range of project management skills required. The combined role may therefore end up as second best hybrid of both roles. 























