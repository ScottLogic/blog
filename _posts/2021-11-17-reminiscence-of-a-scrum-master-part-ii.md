---
title: Reminiscence of a Scrum Master (Part 2)
date: 2021-11-17 00:00:00 Z
categories:
- fhubin
- Delivery
tags:
- delivery
- team
- empowerment
author: fhubin
layout: default_post
summary: The second in a series of articles, in which we will explore the qualities
  and behaviours necessary to be an effective Scrum Master and why those qualities
  and behaviours are important in specific situations.
---

In the previous article ([link](https://blog.scottlogic.com/2021/10/18/reminiscence-of-a-scrum-master-part-i.html)), we talked about why you are a Scrum Master and not someone else, what you should do as you land, and the skills that will help you on your way. In this second article, we will see how to create a framework that will foster good practices and help the team perform. 

## Get into the groove
Of course, you have heard of the Agile/Scrum ceremonies* (grooming/refinement, planning, stand-up, review, retrospective), but what is their purpose?

(*) You may remember that, although this series is about what makes an effective Scrum Master, we are not talking about a strictly-Scrum framework or cycle necessarily. Nevertheless, some kind of cycle is almost inevitable. It is also recommended in the early days, when closer accompaniment tends to be beneficial.


### Grooming or Refinement
It may not be the first one you will come across, but technically, it is the first ceremony of the sprint cycle. On this occasion, the team gets together to discuss new tasks. It is a chance to ask questions, clarify what needs to be done and "groom" the task, or make it ready to be picked up by an engineer. It is also at this stage that the task is estimated using story points -- no self-respecting Scrum Master will talk about units of time. Read [here](https://blog.scottlogic.com/2018/02/16/how-much-does-a-story-point-cost.html).
Great. But how should you lead this?

#### Focus on the right tasks
Unless your backlog is tiny and you can groom all of it in one session, focus on tasks that are likely to be looked at in the near future. In theory, the Product Owner is the one who tells you what the priorities are and what needs to be done next. In practice, an architect, a security officer, and even a delivery manager will all have a view. To avoid lengthy and costly last-minute discussions, make sure all those stakeholders provide you with a list of priorities ahead of the refinement session. **Be organised**.

#### Let the right person speak
Your role here is that of a facilitator. You are making sure that the engineer(s) who pick(s) up the task will implement what the analyst/architect specified and deliver the value that the Product Owner needs.

If you understand the work needed, great. If you can explain it, even better. It may come in handy when that person is on leave. Mostly, let that person do the talking, though. Whoever specified the work to be done is best placed to describe it to the team and answer their questions. The tool you use to track work and plan your sprints (e.g., JIRA or Trello) tells you who created a task; ask that person to present the work to the team. **Rely on experts**.

When they are done and all questions have been answered, take back control. Now is the time to...

#### Estimate
In theory, this exercise does not apply to Kanban teams, who tend to measure progress by the number of tasks completed. In practice, most clients, internal or external, will want to know what can be achieved by when and may come to you for that information.

We will see under the Planning heading how tasks are scheduled into a cycle, which will help answer those questions the client asks you. In order for Planning to be useful and reasonably reliable, tasks are estimated. In story points (read ([here](https://blog.scottlogic.com/2018/02/16/how-much-does-a-story-point-cost.html)).
Assume the team is used to estimating in that currency. If one member is new to it, another member can fill them in. If none has done this, point them to an article online that explains why it is better than other estimation units and discuss the merits with them.

Before you start the estimation itself, confirm that no-one has further questions and that everyone is ready to estimate the task. Make sure everyone reveals their estimates simultaneously, so as to deter copycats. Have them write down on a piece of paper, show the adequate number of fingers, or show Agile planning cards in person, or use a tool such as planningpokeronline.com or scrumpoker-online.org if your team is remote. There are Scrum poker apps for smartphones too, but that may quickly be a pretext for individuals to look at their phones, which you will want to avoid.

Engineers estimate, not you. They will do so based on past experience, and size a task relative to other tasks they did in the past. If the estimates vary widely, invite a conversation on why that is. Quite possibly, it will be the result of a misunderstanding and someone in the team will clear it. Possibly, it will be down to lack of expertise in one specific area. Someone will volunteer to help whoever picks up the task. If not, suggest they do. 

Opinions on how difficult a task is from outside the team (including your own) are not relevant to the conversation: only those engineers who may pick up the task have an opinion that counts, in this case. They are doing the work, after all. If anyone from outside the team attends this meeting and tries to push the team into compressing their estimates, tell them off. This is a session to estimate tasks, not to haggle contract prices. **Trust the team’s experience.**.

#### Wrap up
It is wise to groom more than you need to populate one sprint cycle, but it is a waste of time to try and groom the whole backlog: it might be months before a low-priority task is picked up, by which time the needs may have significantly evolved or become irrelevant. In either case, the estimation has grown stale. Stop when you have enough estimated work to last for a couple of sprints. No one will complain if the meeting finishes early.

Depending on what works best for the team and the urgency of some tasks, you may want to have more than one grooming session in a sprint, on the other hand. One of the advantages is that, in multiple-yet-shorter sessions, the risks of overdose and fatigue are reduced. Another incentive is that it gives an opportunity to look at a task that is kind of urgent, yet was forgotten last time, or a task that is a spin-off of a task you looked at last time. The main disadvantage is that it is an additional meeting,
In any case, do not be wedded to a strict ritual. Apply what works best for the team. **Be flexible**.

### Planning
Often done immediately after grooming, planning is about choosing the tickets for the next iteration.

#### What?
The priorities are set by the Product Owner, though the team should make a case for technical tasks they think are important too. Those may seem less relevant to the Product Owner, yet they may also be enablers for more-immediately relevant tasks. Encourage the team to articulate the benefits of doing what they put forward and explain the advantages of, e.g., paying back technical debt to the Product Owner. Something that they are not interested in at first sight might shrink development time by a factor three, with a positive effect on costs. **Reach consensus**.

#### How much?
Once the team has worked together for a while, this part is a simple accountant’s exercise: look at the previous three cycles, add up the story points of all completed tasks and divide that by three. The resulting number is called the team velocity. That is the average output of the team, and a good indication of how much the team can deliver in the next cycle.

Based on the priorities (the What? Discussed above), select tasks whose combined estimates amount to the velocity. That will constitute your sprint backlog, or the tasks to focus on for the duration of the next cycle.

Some claim that a Scrum team commits to completing the sprint backlog over the course of the sprint. That is not necessarily true, but that is a debate probably best kept for another article. On the other hand, no-one benefits from starting a cycle knowing full well the tasks that are taken on cannot be completed. We will talk about this in detail in a future entry, when we see how you help the team understand their own capacity.

If the team is new and does not yet have an established velocity, then how much to take on is guesswork at best. Some go by the assumption that an engineer will, on average, complete x story points in a cycle, and multiply x by the number of engineers. It is an arbitrary choice, but why not? Others may apply the velocity of their previous team. Again, an arbitrary choice, but why not? The important part here is that no matter how you project how much the team can go through over the course of one cycle, it is going to be inaccurate and unreliable until you have measurable data to guide you. Do make sure your stakeholders understand that. Explain that it is a new team and that, for the first three or four cycles, you are trialling how much work to take on while gauging the team velocity. **Base your projections on empirical data**.

Whether new or not, the team has to feel comfortable that they can complete the work being taken on. Piling on more work than they think they can go through in one cycle is a sure way for them to not feel invested. In doubt, plan on the safe side.

Similarly, if the velocity is known and the team insists on taking on more work than the data tells you is achievable, do not give in. If they turn out right and run out of work, it is easier to give them more later than it is to explain to your client that all the projections were incorrect because the team overestimated its capacity. Teams often argue that many of the tasks earmarked for a sprint are “almost done.” In every sprint, there are  tasks that are “almost done.” The velocity covers that.

You ultimately decide where to draw the line. If the team does not know its limits, do on their behalf. Underpromise, overdeliver. **Be the voice of reason**.

#### Who?
As outlined above, the Product Owner is the main stakeholder who sets the priorities, though others (architect, security officer, engineers) may influence the end choice. Make sure they have all told you what they want to focus on prior to this meeting to avoid lengthy debates.

With input from the above, and based on the team’s estimates, you define the sprint backlog. Once again, make sure the team thinks the work is realistically achievable and meets the expectations of the priority-setters. **Be a leader**.

On this subject: this is not a session in which tasks are assigned to individuals. Tasks are selected for the team to choose from. Who does what is decided by the team. Let engineers select their work from the sprint backlog themselves. The task then becomes their choice, their responsibility and they are invested in its success.

#### Sprint goals
We will define what sprint goals are in more detail next time. Now is the time to set those goals. Looking at the sprint backlog, ask the team to articulate what they want to achieve by the end of the cycle that benefits the business. It can be whatever the team decides it to be. Encourage them to be precise and exhaustive with success criteria, but also let them make mistakes and learn from them. It is, ultimately, the team’s goals, the team’s success or the team’s failure to meet those goals. **Encourage ownership**.

You are now ready to start the sprint.

### Stand-up
This meeting, also referred to as the daily scrum, is typically done first thing in the morning. It is a quick daily check of who did what the day before, and what they plan to do on this new day. It is also an opportunity to flag obstacles, ask for help, ask for new work.

Others may have a special interest in someone’s update (perhaps it impacts what they are doing) and they may have questions. Great. Ask them to catch up afterwards. This is not the time for a project update, a workshop, or troubleshooting. Connecting parties that can help one another is fine. Once that connection is established, move on. The meeting must be quick. Thirty of forty seconds per person at most. Insist on that. Reprimand ramblings and interjections. **Be focused and concise**.

### Show-and-Tell
This ceremony, also called the sprint demo, is an opportunity for the team to show what they have done to the wider world and answer questions from the audience. It is crucial from the point of view of the client, who can visualise what they are paying for and inform their stakeholder accordingly. It is also important from the team’s point of view: it validates what they have been spending their efforts on. In the best cases, that work is put into the appropriate business context, and everyone can understand how engineers are helping the business, what value is generated by what is delivered.
Let the various parties present their respective pieces (the techies do the tech talk, the Product Owner covers the business bit), but be prepared to introduce it all and make sure that those who are speaking are ready to do so. **Be an orchestrator**.

### Sprint Review
Of all the ceremonies, this is the one that is most consistently omitted, which is maybe a shame. It is the team’s chance to review achievements against forecasts and to share lessons learned. This is a time to explain the difficulties encountered and how they were overcome (or not), so that the whole team grows from the experiences of individuals. It is a time to look at sprint goals and adjust ambitions or precision for next time. It is not a time for judgement, on the other hand, which means that, depending on the general atmosphere, the sprint review is sometimes best restricted to the team members. **Encourage experience-sharing**.

### Retrospective
Although it tends to take place right before grooming and planning, the retrospective marks the end of the sprint cycle. It is a time for the team to reflect on how the past iteration went, in terms of processes, and look into ways to improve the working practices. If the sprint review helps the team learn how to tame technology, the retrospective helps them learn how to work together more efficiently.

The format is generally to ask team members to express what they think went well, what went less well and hear their suggestions on how to improve. There are many different ways to do that creatively, so as to make it a playful session and to keep individuals engaged (use a different retrospective format, interlace games to keep the energy levels up, ...)

Once everyone has submitted their entries, focus on the most important ones: have the team vote on what they want to talk about and go through the most popular items (or go through them all if you have time).

Get to the bottom of what you discuss, note actions, assign them to someone. Be realistic with the goals: it is better to focus on one imperfection and address it before the next retrospective than pretend you can fix all that is broken in the world. Improvement is often a matter of baby steps.

Because this exercise focuses more on processes and collaboration than on technical challenges, it can easily feel more personal. It has to remain courteous and professional, yet at the same time, it should be open, transparent and candid. For that reason, the retrospective is often best restricted to team members. Which client would like to discover that the engineers they have hired are not working together as efficiently as they thought? **Provide a safe space**.

It is your responsibility, as the Scrum Master, to ensure all voices are heard (even the very shy engineer who started a week earlier) and that criticism is presented in a factual and constructive manner. You will have to defuse tense situations, from time to time, all the while not taking sides. **Be a peace-maker**.

### General Comments
All the above meetings are the mechanism that helps the team function well and improve. It is important that everyone feels safe and accepted, and it is as important that everyone understands the point of those meetings and actively participates in them. To achieve that, it is a good idea to ban distractions, such as mobile phones and laptops. Remind the team that those are their meetings, not yours. You are merely there to ensure they take place and facilitate the discussions. **Be a facilitator**.

Those ceremonies are also not a pretext to tell people what to do. Quite the opposite. Telling people what to do rarely gets the best results, as someone told what to do is not invested in the job -- they are merely serving someone else's interest.

No, the purpose is to put the team into a groove, to give them the self-discipline to look at the work, refine it, estimate it, plan it for the period ahead; the discipline to spot-check on a daily basis in order to identify and remove stumbling blocks as early as possible; the discipline to look at themselves, to reflect, and act to improve. In other words, this routine will help the team perform.

If the team is a machine and its engineers are cogs, **be the oil** that lubricates those cogs and keeps the machine in good working order.

Many organisations seem to confuse standing up in the morning and taking a day every other week to talk about tasks as being Agile. That is not enough to be Agile, but it does create a cycle, a framework that will instill routine discipline.

Next time, we will focus on that very discipline.
