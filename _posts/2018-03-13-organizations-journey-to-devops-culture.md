---
title: An Organization's Journey to a DevOps Mindset and Culture
date: 2018-03-13 00:00:00 Z
categories:
- Delivery
author: bjedrzejewski
summary: 'DevOps culture is a critical part of successfully delivering an enterprise scale project. Getting that culture into a company requires a mindset change. In this article, I explore the journey to the DevOps Culture, DevOps Mindset and provide some practical advice based on my experiences. '
layout: default_post
---

## Introduction

Modern software development projects consist of much more than simply writing code. It is very common to hear about
outcome-based delivery. Be it internally or working on external projects, development teams are judged based on the
outcomes they provide. It is the ultimate outcome of the project, rather than specific deliverables that matter to the project sponsors.
UK Government Digital Services even published [a blog post](https://gds.blog.gov.uk/2015/06/30/outcomes-not-deliverables/)
on the importance of outcomes in favour of deliverables.

In the world where development teams are judged based on the successful outcomes rather than just code being delivered-
how can they ensure to achieve that success? There is only one answer- by getting involved in the entire process from
inception to delivery to the customer.

Getting involved in the end to end delivery of a project can be a new idea for some developers. There is no substitute for
experience, but everyone has to start somewhere. "The Phoenix Project: A Novel About IT, DevOps, and Helping Your Business
Win" is a great place to start. I will use the book, mixed with my experience from multiple projects to illustrate the
journey to DevOps.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/devops-phoenix-project-top.jpg" />

## Developers, Testers, Operations, Architecture, and Business

Before we embark on that journey, let's look at the parties involved in a project. I focus 
here on the five groups that are often present in large scale enterprise projects.

### Developers

These are the people writing the application code. Writing unit tests, ideally deploying to some development environment.

### Testers

On many larger projects, we have dedicated testers. Either manual testers doing exploratory testing or security testing.
The key here is that these would be the people that don't write the core application code but are responsible for
the quality of the delivery.

### Operations

These are the people in charge of deployment and support of the application. They would often deal with servers and middleware services.
They often support the application in production.

### Architecture

These are your Technical Architects, Solution Architects, Security Specialists and other people who dictate how the system
should be designed. They set technical standards, recommendations and more.

### Business

These are most often the product owners, business analyst, SMEs, project sponsors and other stakeholders that do not fit into the other categories.

## The non-DevOps project

On many non-DevOps oriented projects, these teams share two common characteristics:

* They all communicate very little
* **They hate each other**

Ok, this is a bit dramatic, but I am sure that you have seen it in action! Developers blaming operations for _"breaking"_
their system. Testers complaining about the low quality of the deliverables from the _"incompetent"_ developers.
Operations frustrated by _"arbitrary"_ obstacles thrown at them by a Security Architect. Architects frustrated with the
seemingly _"ad hoc"_ Business decisions... And Business frustrated with a failing project!

Surely, **there must be a better way!**

## Embarking on the DevOps Journey

"The Phoenix Project" succeeds as an introduction to DevOps so much, because it is not a handbook- it is a novel! DevOps
is not something that happens overnight in an organization because people decided that they will adopt it. It is a process
of changing the culture. 

The book defines the key groups a bit differently than I did here using: Development, QA, IT Operations
and InfoSec; but that does not matter that much. On my current project, this split looks a bit different and it may differ even more on your project. What matters is the goal here. Getting all these groups to work together,
to help each other win.

Cultivating this one-team approach can do wonders for the project outcome. I will share one of my favourite quotes,
attributed to President Truman:
   
>"It's amazing how much can be accomplished if no one cares who gets the credit."
    
Rather than re-telling "The Phoenix Project", I will present here a journey, inspired by the book, that a Development team may go through introducing DevOps ("The Phoenix Project" is written from the perspective of the IT Operations team).

### Identifying problems

Everything starts with identifying a problem. "The Phoenix Project" is written with a looming disaster, a potential
closing down of a company as a background. Thankfully, our reality is rarely so dire. However, if you are dealing with
issues such as:

* Deployments to production happening very rarely (only a few times a year)
* Testing happens months after the development finishes
* Operations team is constantly fire-fighting
* Developers find it near impossible to get any IT changes done
* Architecture is despairing about the state of the system
* Things only ever get worse

You may benefit from introducing a more DevOps oriented culture into your organization. How do you get started?

### Identifying and connecting key people

In a similar vein to "The Phoenix Project", you will need to assemble your DevOps "working group". Key representatives
from different areas (Development, Operations, Testing, Architecture, IT in my case) that share the common goal. That
common goal is quite simple- work better together, work faster.

A transformation like this really needs an alignment at the top, as it may be just too difficult to come organically from
the teams. I am sure everyone in the team can influence and help, but without this alignment on top, it will be very
difficult to change the working practices.

The people you have together now should have some ideas of what "good" looks like. If they were not yet exposed to
the DevOps movement, you may need to do some evangelizing and explaining here. This is once again where I find "The Phoenix
Project" to shine- recommend it for people to read! The more formal "DevOps Handbook" is also a great resource.

Don't be afraid to introduce these ideas to your company. It may take time, there may be some resistance, but ultimately,
when people see results, they get convinced. Everyone wants their team, and ultimately the project to be successful.

This "working group" should meet quite often- depending on your goal. The key thing is making yourself accessible to
other partners here. You really want this to be a collaborative effort.

### Connect the teams

With the alignment at the top, it will be much easier to start connecting teams. You want your developers, operations and
testers feel like they are part of one family, one over-arching team. How is this achieved? I have a few suggestions:

* **Get people to know each other** - make a conscious effort to introduce the teams to each other on a personal level. People should know each other's names if the project size permits.
* **Get a good communication channel** - you really want a good way to communicate. I can't recommend Slack enough, as I have seen it completely change teams and cultures. I heard Microsoft Teams is great as well. Make sure you use the best in class, not just 'a chat program'.
* **Celebrate each other's achievements** - one way to make people feel part of one team is to celebrate successes together. Operations success is Developers success and vice versa. If you are doing Scrum, invite each other to your respective Sprint Reviews.
* **Foster knowledge sharing and blame-free culture** - this is quite self-explanatory, but sharing knowledge is a key. When teams learn more about each other, they understand each other better. It helps to eliminate blame, build empathy and focus on solutions and improvement. One way of eliminating the blame culture is blaming the process rather than an individual.

I am sure that you can think of some more ways you can improve that connection between teams on your project. Every organization,
every project is different and there won't be a one-size fits all solution here. You need to get thinking, you need to get creative.

### Problems identified, management aligned, teams connected and communicating

Congratulations! Just doing these three things can bring incredible value to the project. Even if you were to stop here
things should start looking much better.

The best thing though- you are only just starting. With these three things in place, you are ready to start with DevOps.
These things were the prerequisites.

## DevOps Mindset - the Three Ways

<img src="{{ site.baseurl }}/bjedrzejewski/assets/devops-three-columns.jpg" />

I see the DevOps Mindset as fully internalizing the "Three Ways" as defined in ["Phoenix Project"](https://itrevolution.com/book/the-phoenix-project/) and ["The DevOps Handbook"](https://itrevolution.com/book/the-devops-handbook/).
The three ways are:

* **Flow**: This is the flow of work through our value stream. 
* **Feedback**: This is the feedback that we receive from our work.
* **Continual Experimentation and Learning**: Everything changes, in order not to fall behind, but advance, continual experimentation and learning are required.

I have previously written what the development team can be doing to embrace this mindset in 
[Making agile teams more productive from the inside](http://blog.scottlogic.com/2017/05/05/making-agile-teams-more-productive-from-the-inside.html).
In this article, we will look at the journey the whole project can go to embrace these values.

### Journey towards Flow

Enabling flow means enabling work in the system to move quickly. This is the part of Software Development that is often
compared to a factory floor. You have different "workstations" and you want "work items" to move through them quickly.
Your stations could be: "business story being written", "code being written", "code being tested", "code deployed to
production". If you are experienced with the full software development life cycle, you may see that I am simplifying here a bit.

Once you can see the flow (Kanban style boards can be very useful for that), your DevOps working group should focus
on identifying slow parts and speed them up!

From some of the projects that I worked on, these actions included:

* **Improving the quality of business stories and tasks**: These were done by developers collaborating with the business, making sure that tasks don't have to go back to business for refinement constantly.
* **Improving the sign-off process**: If finished work items are waiting for sign-off for weeks, something is very wrong. If you only get feedback on your finished work after months, how can you hope to move fast? Improving that process helped the project tremendously.
* **Making deployments automatic**: Here, we are not talking about deploying to production, but rather to some development environment. Automating this task eliminates the manual activity that can go wrong.
* **Making an Operations representative join Development morning stand-up**: Getting the teams together directly improved the speed of IT Operations problem resolutions. They knew about problems quicker, so they could solve it faster.
* **Streamlining system configuration**: This is specific, but serves as an example. If some process, potentially technical slows the team down, it should be a focus of streamlining and automation.

There are of course many more actions that can always be taken to make work flow faster. If you have a good visibility
and understanding of what slows down your work- you have a good idea where to put the effort.

### Journey towards Feedback

It is great when work moves fast, but if that work is of bad quality and has to constantly move back to earlier steps in the
process (bug discovered, requirement misunderstood, etc.), then this is not great. When something goes wrong you need
to know as soon as possible. You want fast, tight feedback loops in your system. This is very much to do with quality
control throughout the process, supported by automation.

Here are some actions that can be taken to help gain this quick feedback:

* **Business stories reviewed quickly**: If you involved testers and developers (with business analysts they form the "Three Amigos") early- you would get feedback once that story is ready for delivery.
* **Automated testing as part of development**: You have to build up a suite of automated tests to know if things are being broken by the new development. It is slow and unrealistic to regression test the whole system manually with every new feature. 
* **Different levels of testing appropriately added across the deployment pipeline**: Speed of feedback is of the essence. If something can be shown broken within 5 minutes it is better than spending hours. Some of the testing stages can be time-consuming and these usually should come later in the pipeline.
* **Involve the business as quickly as possible**: Showing a quick mock of a feature to get an idea if it meets the business criteria is better than developing the whole thing only to learn that it is not fit for purpose.
* **Good code review and branching process**: Merge/pull requests and code reviews are standard in the industry. If you are not making use of this yet- seriously consider it.
* **Agreed and adequate Definitions of Done**: You want everyone to understand what it takes to finish a task so that it does not come to 'haunt' the respective teams.

There is more that can be done to enable fast feedback, but these points are key. Testing and its automation is
a large topic in itself with Scott Logic writing [extensively on that subject](http://blog.scottlogic.com/category/test.html).

### Continuous Integration, Delivery and Deployment

Continuous Integration, Delivery, and Deployment- these are the terms that people most closely associate with DevOps.

Based on my experience, Continuous Integration can be tackled early- it usually requires relatively modest effort. It is an important
part of your DevOps journey. 

The remaining two- Continuous Delivery (understood here as being able to deliver any cut of the software
to production) and Continuous Deployment (understood here as automatic deployments to production after the code is merged) are much more
challenging. Trying to implement them first is where organizations fail.
Instead of starting with connecting the teams and people- they take on the most difficult challenges straight away.

Once your teams are working together, there is alignment among the leaders and you have Continuous Integration, then you may be
ready for Continuous Delivery and Deployment.

### Journey towards Continual Experimentation and Learning

The third way as described by ["The DevOps Handbook"](https://itrevolution.com/book/the-devops-handbook/) is Continual Experimentation and Learning.
The _"Journey"_ as I am describing it here really does not have an end. Even if you are doing everything perfectly, there are always
new challenges, new people, new technology, new project realities. 

You really can't treat DevOps as a one off effort and hope for it to last forever. The good news is- once people start working
in this way, Continual Experimentation and Learning will become second nature.

### The DevOps Culture

<img src="{{ site.baseurl }}/bjedrzejewski/assets/devops-jumping.jpg" />

Some of the ideas illustrated here may seem like common sense. Others may be new to your organization or project.
When put together and applied they create the DevOps culture. By being part of it, people will naturally start adopting
the DevOps mindset. There are many benefits of that. Some that I have observed are:

* Motivation and morale are much higher. People love being part of successful teams
* Delivery speed increases greatly
* Quality of the software is higher
* Automation start to appear everywhere- once people get started with it, they can't get enough
* Project and Organisations as a whole succeed

This is not an easy Journey, but the rewards are worth the effort. [Frank Hubin](http://blog.scottlogic.com/hubinf@scottlogic.com/), a Project
Manager in my most recent project always underlines the importance of _"getting your own house in order first."_ What is meant
by that is the necessity to solve the internal team problems before trying to take on the world. I start to see DevOps Culture
as the next step from Agile.

## Summary

I hope that Journey inspires you to learn more about DevOps and possibly replicate it in your Organisation. 
I predict DevOps to be as revolutionary to the way companies work as Agile was. If you want us to be part of your
revolution, [get in touch](https://www.scottlogic.com/who-we-are/#contact-us). Good luck on your Journey!