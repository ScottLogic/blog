---
title: Making agile teams more productive from the inside
date: 2017-05-05 00:00:00 Z
categories:
- bjedrzejewski
- Delivery
author: bjedrzejewski
summary: It is a great joy to be a member of a productive team that delivers exceptional
  value. In this blog post I will share things that developers can be doing to make
  that happen. Ideas presented are funded in Agile principles and Lean manufacturing.
layout: default_post
---

In the agile way of working, being a developer means more than just writing code. This often comes as a surprise to
people joining the industry. When reading [_The Scrum Guide™_](http://www.scrumguides.org/) written by the creators of Scrum, you can find the quote:

> Scrum recognizes no titles for Development Team members other than Developer, regardless of the work being performed by the person; there are no exceptions to this rule;

I think this is a very healthy approach, that frees people from thinking that developers only develop, testers only test etc.
The development team in Scrum is supposed to do much more than that and the lack of specific titles frees people to apply
themselves wherever they can help the most. In this blog post I will share my opinions and ideas what developers in an
agile team (not necessarily Scrum) can be doing to make the whole team more productive (and hopefully with that, their company more successful!).

When choosing what you should do as a developer I find it helpful to think about the Three Ways as described in [The Phoenix Project](http://www.itrevolution.com/book/the-phoenix-project/)
and [The Devops Handbook](http://www.itrevolution.com/book/the-devops-handbook/) (both of which I really recommend). I will introduce that concept here briefly. Have a look at the following diagram:

<img src="{{ site.baseurl }}/bjedrzejewski/assets/3ways.png" />

You can see the three main elements called _The Three Ways:_ Flow, Feedback and Continual Experimentation and Learning.
These _ways_ are described more in-depth [in this article](http://itrevolution.com/the-three-ways-principles-underpinning-devops/) written by one of the authors of Devops Handbook.
For a process to be as successful as it can be, these three elements should be taken care of. To elaborate on what each of the elements stands for:

* **Flow:** This is the flow of work through our value stream. In the development we can think of it as features that come to the team
in the form of requirements/wants and end up being handed over to the next team in the stream (test/qa/operations). We want to maximise the
completion rate and minimize the number of bugs.
* **Feedback:** This is the feedback that we receive on our work. It can come from testers finding issues, product owner not liking the
way that a feature was delivered or a production system breaking. In short- anything that tells the team if the job is done well or needs
reworking.
* **Continual Experimentation and Learning:** In order not to improve, but even to simply maintain the desired level of productivity,
the development team needs to embrace culture of experimentation and learning. Without this, ever changing software, requirements
and potential technical debt can jeopardise any efforts to improve.

With the three aspects explained, let's look at some specific actions that a developer can do to make the whole team perform better.

## Flow

### Finish tasks before starting new ones
A common problem faced by new agile teams, is doing too many things at once. Starting new tasks while still having significant Work In Progress (WIP)
is a sure way to kill productivity. It is a natural intuition, that if there is something blocking us
and there are tasks still waiting to be started to pick them up and start. This has multiple problems ranging from frequent
context switching, never quite finishing features (and having them linger 95% done) to merge problems down the line.
There is a great [article](https://www.atlassian.com/agile/wip-limits) on that topic  alone, published by Atlassian that
you can read if you are still not convinced that too much WIP is harmful. What to do then? See if you can help to close tasks-
do code review, try to remove any blockers, do what it takes to push the task over the limit rather than take a new task.
You may uncover a bottleneck that causes tasks to take longer than necessary- removing it can cause leaps in productivity!
If it is often unclear if a feature is finished, it helps for everyone involved to share an
understanding of what defines a completed feature- this is often referred to as _definition of done_.

### Automate manual work
This sounds quite obvious, but the more you automate, the faster you can work. The common targets for automation improvements are:

+ Deployment: is it completely manual? Does it take multiple commands to run?
+ Testing: are you always running the same manual sanity test that you could automate?
+ Build: does the build require manual steps that could be avoided
+ Other: each project and team is different and there always can be other things that you would prefer from having done by a machine

Sometimes automation can be part of a normal feature development, other times it may be good to bring it up with your team
and try to get it actually scheduled (if this is a significant amount of work).

### Help with the requirements / stories - look ahead
If the first time a development team sees stories is when they are coming to the sprint, it is a bad sign. It often results
in requirements that are not well understood, tasks that are not really feasible and a poor planning and estimation. All of these
can impact flow. What you can do is to look ahead, try to understand the upcoming stories and think how will you implement them.
If they are clear, great- make a note of that. If not- perhaps a chat with Business Analyst or Product Owner can help here. These
quick action can save hours in the future when the unclear story makes it to the team and someone goes ahead and implements it
anyway. It is often stated that about 10% of everyone's time in an agile team is usually spent on [backlog grooming](https://www.agilealliance.org/glossary/backlog-grooming/).

<img src="{{ site.baseurl }}/bjedrzejewski/assets/3ways_flow.png" />

## Feedback

### Talk to your testers- then write more tests
Most people understand that adding tests improves the quality of the product and productivity of the team. What is often
not so clear is what tests to write. I suggest a slightly more human focused approach here. If you have dedicated testers (or someone
else filling that role) talk to them to find out what testing they are doing. The main two types of testing are scripted
testing and exploratory testing. To have a basic understanding of both, I strongly recommend a [short video presentation from a conference](https://www.youtube.com/watch?v=5lE5RH_PsgI)
by [Rosie Hamilton](http://blog.scottlogic.com/rhamilton/) where she defines and compares the two approaches. What can you do as a developer then?
Maybe you can help testers with automating something that takes hours, days or weeks of their time. Doing that frees them to focus on something more unique
and difficult for others to carry out (like for example exploratory testing). In the meantime, you will have the feedback from scripted tests
automatically and at will when you (or your Continuous Integration) runs them. Your long term goal should be trying to automate as much
of the scripted work as possible. Automating scripted tests is a large discipline in itself, but there is nothing stopping developers
from helping in that department or being pioneers in their teams or organisations. It is a good place to bring back the famous
relationship between the cost of a bug-fix and the phase of the feature delivery. Think here about the cost in terms of productivity rather than
strictly money:

<img src="{{ site.baseurl }}/bjedrzejewski/assets/3ways_bugfix.png" />

### Get your Product Owner / Business Analyst engaged
It is one thing to have a bug, and another to build a feature that was wrongly specified from the start. If you are
unsure about anything, or working on a complex feature, get the Product Owner involved early. If the feature
will take a few weeks to complete, but you can show something one week in, this early feedback can be invaluable. Not only
you will be sure that you are doing the right thing, you give your stakeholder a chance to make any last minute corrections.
This close cooperation with your client is expressed in at least 3 out of 4 postulates
stated by the [Agile Manifesto](http://agilemanifesto.org/).

### Review each others code
Code review is one of the most invaluable ways of providing feedback by developers and yet many teams are missing out
on the benefits by not doing it. It is not only a useful way of preventing bugs and technical debt, but a great mentoring tool for
new team members. Both doing and giving code review can be a learning process. I recommend another [article
from Atlassian](https://www.atlassian.com/agile/code-reviews) for more details. One extra thing to keep in mind is making sure
that the review is positive- people can be feel quite vulnerable with the review process so that right culture and attitude must
be in place. The goal is to get people to collaborate better, not fight or tremble with fear!

<img src="{{ site.baseurl }}/bjedrzejewski/assets/3ways_feedback.jpg" />

## Continual Experimentation and Learning

### Identify and start fixing your technical debt
I can't stress how important this is. One common misconception is that if no work on technical debt is done, the status
quo is maintained. It is wrong. When technical debt is not addressed, the project start to fall into sort of downward
spiral when things get worse and worse over time until adding new features or even changing code is hardly possible.
To avoid that, the team needs to proactively spend time at fixing numerous problems as they appear. It is recommended that
high performing teams spend around 20% of their time improving the code-base and eradicating technical debt. If your team has not
been doing that in the past, I would argue that even greater percentage should be initially devoted to that task. If you are
in a really bad place don't despair... LinkedIn [halted their development of new features for 2 months just to fix technical
debt in the past](https://www.bloomberg.com/news/articles/2013-04-10/inside-operation-inversion-the-code-freeze-that-saved-linkedin)
and managed to get back on track.
I would suggest trying to take action sooner rather than leaving it to such drastic measures!

### Learn, Collaborate, Try something new
In the end, the important part here is that you learn new and useful things that may help your team! The fact that
you are reading this article and you made it this far is already a great sign. I would suggest trying to implement
some of the advice here and maybe research mentioned topics a bit deeper. You want to ensure that your team has a space
where they can learn, experiment and make an occasional mistake with a focus on preventing it from reoccurring rather than
looking for someone to blame and punish. Fostering a positive company culture is a large topic in itself- that should not
stop you from leading by example!

## Conclusion
There are many ways in which developers can help their teams be more productive. What I presented here is a systematic
way of looking at them. If you don't see something that you consider useful, let us know in the comments. Constant looking
for way in which we can work better is the key theme here. Good luck with your journey to productivity and team
transformation!