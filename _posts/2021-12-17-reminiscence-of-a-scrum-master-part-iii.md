---
title: Reminiscence of a Scrum Master (Part 3)
date: 2021-12-17 00:00:00 Z
categories:
- Delivery
tags:
- delivery
- team
- empowerment
author: fhubin
layout: default_post
summary: The third in a series of articles, in which we will explore the qualities and behaviours necessary to be an effective Scrum Master and why those qualities and behaviours are important in specific situations.
---

In the previous parts ([link to part 1](https://blog.scottlogic.com/2021/10/18/reminiscence-of-a-scrum-master-part-i.html) and [link to part 2](https://blog.scottlogic.com/2021/11/17/reminiscence-of-a-scrum-master-part-ii.html)), we saw why you are a Scrum Master, what to do when you land into your new work environment, and how to set up a framework that creates a healthy routine for the team.
This time, we will talk about a few principles to make everyone’s life easier.

## Set some ground rules
A little ego-bruising to start with: you are there to serve the team -- that is the "servant leader" phrase so often used. Without the team, you are unnecessary. Whoever you work for is not looking for a great leader as an end goal: they are looking to deliver value, for which they hired a high-performing team. You are there to ensure that the team performs.
You will shield the team from outside distractions, so they can focus on what they are good at: delivering working software.

All the same, for your job to be tenable, the team has to help you. They have to be defendable and, well, performant.

To achieve that, a few ground rules are helpful.

### Define terminology
It is important that everyone in the team understands the same reality, governed by a ubiquitous language.

#### Definition of ready
When is a task ready for an engineer to start working on it? Are the acceptance criteria well defined? Is the sign-off authority identified? Those are all questions that the team must be able to answer. They can only do so consistently if a definition of ready is agreed. Run a workshop where it is debated and captured. Leave no room for interpretation. **Be clear**.

#### Definition of done
The same goes for finishing a task. The team must agree on the criteria to meet for a ticket to be labelled done or done-done (a strange phrase to underline that development is complete and that, from the business’s perspective too, the feature is complete). Usually, a task will have had to go through development, review, test and demo before it can reach the promised land that is the ‘Done’ column on the board (a column that can be named done-done, to be sure to be sure). **Be exhaustive**.

#### Sprint goal
As briefly discussed in part 2 ([link](https://blog.scottlogic.com/2021/11/17/reminiscence-of-a-scrum-master-part-ii.html)), even if your team is not strictly Scrum, chances are that your reporting takes place at regular intervals -- a week, a fortnight, a month. Therefore, the idea of a sprint is still relevant, if only in reporting terms. Having a goal for that sprint is essential. No matter how well you plan and estimate, it is unlikely your team will complete all the tasks that are earmarked at the start of the sprint: reality tends to come in the way and delay or block work. A sprint goal creates focus and helps prioritising: if not all tasks can be completed after all, then those that contribute towards the sprint goal have a higher priority than the others. Not only that: the sprint goal should articulate the business benefit, so that, for example, a collection of tasks described in technical jargon become: “reduce the monthly Cloud bill by 30%.” The business will love that, and the team will appreciate understanding the reasons behind their work.

Without going into too much detail about sprint goals (literature exists that does exactly that), it is important that they are:

* **Achievable**: if the team’s goal is to launch a rocket into space in one week, it is bound to fail. Make the team choose a goal they truly believe they can realistically achieve

* **Precise**: “deploy the application” might seem like a noble, valid goal. Until one realises that deploying to a staging environment is not the same as deploying to a production environment. The application could also be deployed, yet not enabled, not interconnected with its dependencies or whatever else. Phrase the goal in a way that success is as binary as possible

* **Measurable**: “reduce time to complete tasks” is not a sprint goal; it is a vague aspiration. “Increase automated-test speed to bring end-to-end-testing time down by five minutes” is. It is measurable and success is a yes/no question

* **Set by the team**: this is critical. The sprint goal is _the team_’s commitment, based on what _the team_ thinks is achievable, not based on what one manager or another is trying to achieve. Without that, there can be no buy-in from the team and no success

A team that consistently hits its sprint goals will develop self-confidence and high morale. Not only will it make them feel good, they will also become keen to gradually achieve more. That benefits all parties involved.

A team that does not consistently hit its sprint goals learns its own capacity and adjusts its goals so they are achievable. That helps project realistically and manage expectations.

The team will not necessarily understand immediately the benefits of setting sprint goals. It is your role to make sure that they do by explaining. **Be a mentor**.

Those definitions are best published, e.g. on a Confluence page, or printed underneath the board. If anyone asks, the team must be able to point them to those definitions for disambiguation.

### Control scope
Let us take an example to illustrate why controlling the scope is important.

If a client asks for feature f to be worked on and all they can see being produced are unrelated technical tasks and a cluttered board at the end of each sprint cycle, they are likely to question the team's (and, therefore, your) understanding of priorities. We saw how to manage priorities as part of the planning ([link](https://blog.scottlogic.com/2021/11/17/reminiscence-of-a-scrum-master-part-ii.html)) and will discuss it again in another part of this series. For now, let us assume that the priorities are clear to all. Firstly, you need to focus the effort on the Right Things.

The Right Things are those tasks that are currently on the board, as prioritised by the Product Owner during sprint planning. If asked, you need to be able to explain why a ticket is on the board, what the work is, at a high level, who is working on it, and what the current status is.

Any task on the board that was not prioritised at sprint planning (preferably by the Product Owner) classes as scope creep. If it was added to the board, despite there still being prioritised tickets untouched, that task is not part of the Right Things. If you cannot explain why the task is on the board or who added it there, it is definitely not part of the Right Things.

There might well be a valid reason for that task to be where it is; it may be a dependency for a task that _was_ prioritised; it might be an emergency that stops your tests from running; it might something else equally important. Regardless, the content of the board is your responsibility and you will be given a hard time if you do not know what is being worked on. To talk plainly: if you do not know about a task, then it should not be there. To avoid that awkward situation, the easiest is for you to personally add each and every task to the board, which makes you entirely accountable for what is on the board. In JIRA, you can enforce that by removing the scheduling permission from everyone but you as the Scrum Master. A radical approach, perhaps, but an efficient one: the team will have to focus on the tasks at hand and inform you if they cannot; the client will appreciate that you are trying to control the scope and taking the priorities they set seriously; blockers will be more visible and, therefore, can be addressed more effectively; progress will become steadier, as the focus is clearer; all parties will understand the importance of setting priorities for a short period of time (e.g., the next two weeks, if that is the cadence in place).

Removing the scheduling permission is not meant to be a punishment for the team. However, you must put your house in order before doing anything else. You cannot blame the outside world for allowing scope creep if everyone in the team does the same.

While we are here, the client or the Product Owner are just as likely as the team to add tasks to the board and cause scope creep. Removing the scheduling permission from all but yourself also protects the team from that.

The right mechanism to schedule a task is to go through refinement and planning. If a task is so urgent that it cannot wait for those ceremonies, then you still need to control it. Either it is so small that it can be absorbed, in which case, that is the team’s decision, not that of the person raising the task (whether said person is a member of the team or not), or it is so big it jeopardises the current goals. In that case, you definitely need to be involved to decide, as a collective, whether the new task has to wait after all, or if the current sprint has to be cancelled -- a traumatic event that calls for emergency ceremonies and, frankly, is best avoided.

In summary, **be a control-freak**, when it comes to your board.

### Start less, finish more
In order to forecast with any sense of accuracy (rightly or not, your client will likely ask you to), you need to understand the team's capacity. More importantly, the team need to understand their own capacity. If they do not, they will not perform as well as they should; that will lead to frustration, low morale, tensions and brain drain.

A team of ten that has a board with sixty tasks on it is common. It is also less than useful: who is working on what? When can something be expected to complete? What can we work on next? And when can that start?

All of those questions need to have a simple answer. No-one can give those simple answers, if the board is cluttered with six in-flight tasks for each person in the team. The team is frustrated because they cannot see themselves progress; the client is frustrated because they cannot see value being delivered and you are frustrated, because the pressure piles up and everyone is blaming you.

How does a team get to that unenviable point anyway? Here are the most frequent causes of such situations:
* Lack of ownership
* Poor multitasking skills
* Poor estimating

How should you tackle them?

#### Increase ownership
The engineer who works on a task owns that task until it is in the ‘Done’ column. The primary focus of that engineer is to complete that task. The consequence is that engineers convert more open tasks into completed tasks, which can be accurately described as increased productivity.

How? Boards display the engineer assigned to a task. It makes it easy for you to ask a specific engineer for an update on their task. If they try to redirect you to someone else, **be obstinate** about their owning the ticket until done. If an engineer cannot finish a task on their own, they should ask for help. The team can then swarm on said task to complete it.

#### Address Multitasking
This is the easy part and the one to focus on first: only allow one thing to be worked on by an individual at any time. Stop the proliferation of work in progress (WIP). Let a team member do one thing, do it well, finish it, then move on. By starting fewer things, the team will finish more of them, team members will see their own progress, make obstacles visible (if something prevents them from completing the task they are working on, they _will_ tell you, since they cannot be distracted by another task), and it will paint a reliable picture of the velocity. **Be hard-nosed about multitasking**, because, to be clear, no-one is good at it.

How?
* Allow as little work as possible on to the board during planning -- no more than the velocity
* Add WIP limits to the columns on your board. In JIRA, the board will turn red if too many things are in progress, putting the spotlight on what the cause for concern is

"But... We will run out of work in the middle of the cycle!" some engineers may say. No, they will not.

Firstly, a task is only finished when it has reached the definition of done, not when it has been handed over to be reviewed or tested. The engineer who works on a task owns it until it meets the definition of done. Integrating tester feedback is that engineer's responsibility. In fact, the engineer is accountable for making sure the work passes testing too. The engineer is even accountable for ensuring the work is demoed to the right approving person and gets the sign-off. When an engineer owns a task that way, they will have less time to start another task. There will be less work in progress as a result. Again, **increase ownership**.

Secondly, if a task is complete and an engineer has no further work to pick up from the sprint backlog, others may need help to complete their respective tasks. Pairing is incredibly valuable: it helps share knowledge and apply standards; it can even make development faster, since there are statistically more ideas in two heads than in one. **Encourage pairing**.

Thirdly, if pairing is not an option and there really is a shortage of work, then there must be a product backlog full of work waiting to be started. No-one will ever complain about scope creep caused by the initial scope being completed. On the contrary, a client is likely to be thrilled to have a team of overachievers. Remember that you control the scope. Once the team has achieved what they set out to do, it is in your gift to bring another task into the mix. Scrum is rather strict with what goes into the sprint and when, but, if that is the framework you follow, accept that it sometimes has limitations and circumvent those. **Refuse dogma**.

#### Improve Estimation
The second cause of a cluttered board is more complicated to tackle. As we saw in the second part of this series of articles ([link](https://blog.scottlogic.com/2021/11/17/reminiscence-of-a-scrum-master-part-ii.html)), estimating the work your team is about to do is essential: it helps you forecast timelines and manage your client’s expectations, as well as control scope. However, to do that effectively, you need reliable estimates. And we know that teams are not very good at providing those reliable estimates. What can you do about it?

##### Estimate in Story Points
Story points are the only measure that will help you. An estimate in man-days or man-hours is understood by everyone and any deviation is therefore very visible. The team (therefore you) will be judged harshly for any such deviation. A judgement that may be unfair, too. Let us take a simple example to illustrate.

John and Jane live together and take turns to go to the bakery to buy bread. The trip from their house to the bakery (1.3km) takes Jane ten minutes. She is a long-distance runner and in very good physical condition, you see? She is usually in and out in no time. John loves pastry (from the bakery) and walks more slowly. The journey takes him nineteen minutes. On the other hand, he often comes home with pastries, which bring joy to the whole house.

Both John and Jane do what is asked of them: they buy bread. Both walk at a different pace, and bring different qualities to the service. Depending on whose turn it is to fetch the bread, the activity will take more or less time, but the outcome is the same: there is bread for the household.

Story points were created precisely to solve situations like the one above. When a development cycle starts, the sprint backlog contains multiple tasks. Who ends up working on which task is unknown. It depends on who is available and the priority order. Joanna may complete task t in five hours, whereas it would take Alex only three, because Alex has done something very similar in the past. But Alex is not free to pick up task t. So Joanna does the work, and she will see it through, even though she has never done anything like it before. Story points indicate a level of complexity that is relative for a specific team (Team A’s story points do not have the same meaning as Team B’s). The velocity indicates how many story points the team goes through over the course of one cycle. Collectively, the team achieves that much, and how that is spread across the team members is the team’s business.

That way of estimating not only helps forecast more accurately, it also sidesteps key-person dependencies: one might be tempted to ask Jane to go buy bread every time, since she is quicker to do so. However, if Jane then sprains her ankle, or if she moves out (maybe she hates that trip to the bakery), John does not know where the bakery is or what bread to buy, as he has never done it. Perpetuating a key-person dependency only delays someone else learning a skill and makes that learning more taxing: once Jane has moved out, she will not show John how to buy bread.

**Use story points**. Always.

##### Make Mistakes and Refine
With a new team especially, know that the estimates are going to be wrong. Whether the tasks are more complex than anticipated or the team takes on more than they can realistically complete, it will be a while before estimates are reliable. As the tasks become more of the same (by definition, something can only be new once), the team will have reference points against which to estimate new tasks. The resulting estimates will be increasingly reliable when they are based on statistics (the effort it took to complete previous, similar tasks), rather than gut-feel.

As for how much to take on, that decision will also be made easier as the velocity emerges. Remember: take on tasks whose combined story points amount to the velocity. **Making mistakes**, particularly in the early days, **is okay**. At least, as long as you...

##### Communicate
If the team is new, make it known that the velocity is unknown and that it will become clearer after three or four sprints.

If a task is terra incognita, explain to your stakeholders that this is something the team has never done before and that estimates are to be taken with a pinch of salt.

If the team misses its target by a long stretch, underline that the initial forecast was based on a guesstimate and that a better understanding of the velocity will soon address that.

If an established team misses its target, discuss with them and find out why. Was the job more complex than thought? Was the team too ambitious? Decide with the team how to adjust. **Be the firm-yet-reassuring voice**.

##### Learn and Repeat
Practice makes perfect. The more the team estimates-plans-delivers-reviews, the more reliable their estimates and the steadier the velocity. Naturally, there will always be a level of uncertainty and any task will come with its share of unknowns. But it will matter less because the team will learn to factor that into their estimates and your client will understand that your forecast accommodates that uncertainty.

### Summary
With some simple discipline, the team can perform better and help you help them. The discipline to define and use a terminology that leaves no room for interpretation; the discipline to control the scope and to see tasks through to completion. Such discipline will help **make the team predictable**, which, in turn, will help you forecast and reassure your stakeholders.

Next time, we will see how to empower the team and the expected benefits of doing so.
