---
title: The Agile Mindset
date: 2014-09-18 00:00:00 Z
categories:
- Delivery
author: dthomas
layout: default_post
summary: Agile is a term that is heavily overloaded within software development. In this blog I take a look at Agile as a mindset for development, as opposed to a set of tools and practices.
oldlink: http://www.scottlogic.com/blog/2014/09/18/the-agile-mindset.html
disqus-id: "/2014/09/18/the-agile-mindset.html"
---

<img src="{{ site.baseurl }}/dthomas/assets/AgileMindset/ManThinking.jpg" style="width: 200px; float:right;" />

Nowadays, it feels like everyone and their dog are practising Agile development. Over half of the respondents to VersionOne’s [8th Annual State of Agile Survey](www.versionone.com/pdf/2013-state-of-agile-survey.pdf) used Agile methodologies in the majority of their projects. Despite this, I’ve always had a nagging feeling that many supposedly Agile projects aren’t all that Agile. When speaking to other developers about whether their projects are Agile, I often hear the same thing: “We’re kind of Agile. We do sprints and daily stand ups, and we estimate in story points”. I’ve heard the term “Scrum-lite” to describe teams that follow the general idea of Scrum, but perhaps don’t have Product Owners or Scrum Masters, or don’t have stand-ups every day. [Scrum.org](http://www.scrum.org) refers to this as “Scrumbut”. I’ve also come across teams who doggedly follow "Scrum rules" despite them obviously being more of a hindrance than a help to that particular team.

The attitude where Agile is a set of boxes that you tick by having the right meetings, using the correct terminology, or having people in the right roles, has never sat well with me. After all, if a team is developing great software, satisfying the client, and enjoying themselves, who cares if they are having a 15 minute stand up meeting every day? It is important to understand that Agile is a mindset for software development, rather than a prescriptive process, or even a toolbox.

## People and Interactions over Processes and Tools
For me, the recognition of Agile as a mindset, occurred over the past year while working on a couple of Agile teams here at Scott Logic. Having made this realisation I must admit to feeling rather foolish, as the authors of the Agile Manifesto left a rather clear hint in the first of their four values. The Agile Manifesto says you should value people and interactions over process and tools. This means focusing on how people think and work together, rather than trying to make them conform to a set way of acting.

I am now truly amazed at the amount of debate that goes on as to how exactly Agile processes should be structured, and what tools should be used to achieve maximum Agility. There isn’t even half the debate as to how people should interact with one another, how they can motivate each other, or how they can communicate better. I perhaps shouldn’t be so surprised. When something is successful, people want to replicate that success. Replicating a process or a tool is easy, replicating complex social interactions between people is far more difficult.

This is a particular concern for Scrum. Scrum bills itself as a lightweight framework rather than a prescriptive methodology. However it is still rather prescriptive: It’s not Scrum if you don’t have a ScrumMaster or a Product Owner, it’s not Scrum if your retrospective lasts more than three hours. These constraints lead teams to focus on having the right meetings at the right times, and having people in the right roles, without any focus on whether they are actually doing the right things.

## Agile Interns
Over the summer we’ve had two interns working on an internal project. Initially it was decided they would adopt Scrum, with a couple of experienced developers taking on the roles of Scrum Master and Product Owner. Having worked like this for a couple of weeks, the interns decided to abandon the traditional Daily Scrum. They found that each morning they struggled to remember what they had done the previous day, which resulted in them wasting time while they tried to work it out. Instead of this, they had a demo each evening, where they showed the Product Owner what they had done that day, and a mini planning session in the morning where they worked out how to approach that day’s work.

This caused some consternation in the office. Shouldn’t these interns be trying to learn Scrum before changing it? What makes them think they know better than the developers of the Scrum guide, who have been practising this since before the interns were born?

From my perspective however, they couldn’t have been more Agile! Delivering working software was easy for them, so they could do it every day instead of every iteration. By organising a demo every day, they were able to reflect with their mentors on what they had been doing, and also collaborate more closely with their Product Owner. Most importantly, they were doing something that worked for them, rather than following a process which hadn’t been developed with their situation in mind. It seemed we had Agile experts in our midst, and they didn’t even know it.

## Responding to change over following a plan
Responding to change is an integral part of Agile. One of the key things that Agile has over Waterfall is that it recognises that change is inevitable in software development. The most obvious form is the change in business requirements that occurs over the course of a project. This is one of the motivations for an iterative approach to development, as we can continually adjust what we are developing to hit a moving target. Change can also occur on a weekly or even daily basis as designs are prototyped and rejected, or technical problems are unearthed.

Scrum recognises change, and prescribes numerous meetings to help manage it. The Daily Scrum meetings provide a forum for managing short term changes, and Sprint Planning and Review meetings do the same for managing the direction of the project over a longer period. Although Scrum does not advocate it, these meetings can end up being the only place where change is managed. This can lead to developers holding on to issues until the Daily Scrum, rather than raising them immediately with the relevant people. It can also lead to developers implementing features that they know will not add value to the customer, as they are waiting for the Sprint Review to get feedback.

These issues are not a failing of Scrum, but rather a result of trying to implement Scrum without having the Agile mindset to make it work. Instead of holding on to issues until a set time, developers should feel free to raise issues at whatever time and in whatever way they feel is appropriate.

## Self-organising teams are effective teams
Many companies have seen technical practices advocated by Agile methodologies and want to implement them across the board. I have spoken in a previous blog about a colleague who, at a previous company, was forced to pair program with the same developer, all day every day. A similar attitude is often taken with test driven development (TDD). Once it is discovered that developers using TDD typically write fewer bugs, some companies immediately want all their developers to use TDD all the time. Although well intentioned, this is problematic.

Practices such as pair programming and TDD can be hugely effective, but this effectiveness is lost when developers are forced to follow them. Mandating such practices will foster resentment, and remove the creativity of the developer in deciding when to use them. When technical practices are mandated, it is common to see developers following the letter but not the spirit of the rules. Developers can end up writing a huge number of unit tests, purely because they were told to write them, not because they add any robustness to the code.

One of the principles behind the Agile Manifesto is that “The best architectures, requirements, and designs emerge from self-organizing teams”. From this, it should be clear that Agile practices cannot be imposed on a team, as that in itself would be un-Agile. Instead, support should be provided for teams to use these practices. For example, if developers know they have the time to thoroughly test code, they will use TDD of their own accord, and will do a far better job of it than if it had been imposed.


<img src="{{ site.baseurl }}/dthomas/assets/AgileMindset/AgileManifesto.png"/>

## The Agile Mindset
So what is the Agile Mindset, and how does it differ from blindly following a process such as Scrum, or using technical practices such as those in XP? The simplest answer is to go back to the Agile Manifesto, and the principles backing it, and to read and reread them until they are instinctive. However it would make for a fairly lame blog post if I said little more than “read the Agile Manifesto”, so I’ll try a bit harder. Here are a few key things to understand in order to work in an Agile way:

Firstly, work should be done as late as possible. When you find yourself thinking “I might as well do this now as I know I’m going to need it later”, ask yourself if you really do know that, and if you are likely to incur any significant cost from deferring the work until you really do know you will need it.

Secondly, it is important to understand that success cannot be easily replicated in something as complex as software development. In simple games such as noughts and crosses there are successful strategies that can easily be copied from one game to another. In the complex world of software development this does not apply. Instead of trying to replicate the way a successful team works, teams must be allowed to discover a way of working that works for them, on the problem they are working on. That is not to say that you shouldn’t look to other projects for inspiration, but you should be ready to adapt any lessons you learn to your situation.

This leads on to having respect for people. Developers usually expect respect from their managers, and this respect is certainly vital. If the management team respects the developers enough to allow them to find the best way of working, they will have a far more successful team than if management decides it knows the best way to work and imposes this on the developers. However, it is also vital that developers respect their managers. It is all too common for developers to assume that their managers are incompetent at best, and deliberately obstructive at worst. This leads to developers spending their time trying to work against their managers rather than working for a common goal. A key principle here is to assume that anyone you are working with is genuinely trying their best to do their job. While you may feel that they are not being as helpful to you as they could be, as long as you believe that they are doing the best they can, or working under constraints you aren’t aware of, you can work with them to achieve a mutually satisfactory goal.

A fourth principle is to continually aim to deliver what the customer wants, as early as possible. Whenever you plan a set of features for a release, work with the customer to see if they could make use of a subset of those features. If so, release that subset first. You must then make sure that the features really are what the customer wants. There are a huge number of techniques for doing this, and it is such a complex and difficult part of software development that it warrants a blog series of its own. At the very least you should be looking for customer feedback early and often, and building what the customer wants, rather than what you’d like to build.

The final thing I will mention is something which I believe is skipped over somewhat in the Agile Manifesto, but is absolutely key to Agile working. It is hugely important to communicate, and to do it constantly. This is true between all members of an Agile team, but also with the stakeholders and customers for a project. Not communicating sufficiently hinders your teams ability to respond to change, and increases the chance that work done by your development team is wasted. The ideal situation is for communication to “just happen”. Scheduled update meetings potentially waste time when they are not needed, and risk delaying the transfer of information, as people wait for these meetings to occur. Instead people should feel free to communicate as and when it is needed, and they should take enough care in the overall value of the work they are doing, to know when it is needed.

## The Agile Mindset vs The Agile Toolbox
It should come as no surprise that the various practices and processes that come under the Agile umbrella complement the Agile mindset perfectly. After all the Agile Manifesto was written by the same people who came up with ideas such as Scrum and XP. However those practices and processes will be far less effective if not accompanied by the way of thinking used by those who came up with them. For this reason it is not simply enough to teach people good technical practices, or a good process to follow.

If a developer does not understand the purpose of a process, they will not know when to follow it and when to adapt it to their current situation. They will also not understand how to improve the process, which is a key part of developing in an Agile way. Similarly, if a developer does not understand the benefits of using a particular technical practice, they may not know when to use it, and when not to, or how to improve on that practice.

For this reason, although I would advocate the processes and practices that led to the creation of the Agile manifesto, I would advocate far more strongly for the teaching and understanding of the Agile Manifesto as a set of first principles from which these techniques come.

## A final word on final words
Kent Beck finishes Extreme Programming Explained by describing it as a toolbox, which you should pick from as you need. He describes the tools as supporting one another, and working well together, but he does not say you need to use every tool in the box to gain the benefits of XP.

The Scrum Guide finishes in quite the opposite fashion. It describes Scrum as “immutable”. If you change the roles, artefacts, events or rules then you are left with something that is not Scrum.

The attitude taken in the Scrum Guide seems incredibly un-Agile. It implies that the authors have foreseen every possible development project and created a one size fits all process, that cannot be modified. While I’m sure it was not the intention, I believe it discourages the sort of creative thinking used by our interns, as described earlier in the blog.

Kent Beck on the other hand hits the nail on the head. He offers a great set of tools, explains how to use them, and encourages you to adopt them as you see fit for the project you are working on. This is the embodiment of the Agile Mindset.























