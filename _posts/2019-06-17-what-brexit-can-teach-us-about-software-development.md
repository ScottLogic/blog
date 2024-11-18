---
title: What Brexit Can Teach Us About Software Development
date: 2019-06-17 00:00:00 Z
categories:
- Delivery
author: tclarke-scottlogic
layout: default_post
summary: Political Journalists - "How can everything have gone so wrong, it must be betrayal." Software Engineers - "Oh yes, this all seems very familiar, I see what you did there, ayup."
---

Over the last few years, British Politics has been an amazing case study in attempting to bring an ambitious, far-ranging project to reality.

[It is hard to argue that it has gone well.](https://ukandeu.ac.uk/wp-content/uploads/2019/06/The-Brexit-Scorecard.pdf)

Still, as we are always told, we can learn more from failure than success. So, let's see if there are any general lessons from this we can apply to software development.

## Take responsibility for ensuring your objectives are meaningful

> What does 'Brexit means Brexit' mean?
>
> - [BBC News](https://www.bbc.co.uk/news/uk-politics-36782922), quoting Prime Minister May

One of the key problems with Brexit is that [different people had different aims for it](https://www.theguardian.com/commentisfree/2017/aug/05/new-political-party-leave-voters-right). The campaign was infamously fought with slogans like "Let's spend it on the NHS instead", "Global Britain" and "Take Back Control". Very little time was spent discussing specific measurable goals, and the idea of the now seemingly inevitable fundamental changes to our economy was played down.

At the same time, one of the main criticisms of the Remain campaign was that it never came up with any aims at all. Its success criteria was *not* doing something, which is hard to sell to people who are dissatisfied. It is [arguable](https://www.theguardian.com/commentisfree/2018/feb/26/have-nots-denigration-brexit-trump) the immediate backlash against the result by the losing side did much to create the current atmosphere of toxicity, by making voters believe their decision was not respected.

A good lesson to learn for software developers is to always respect the core values and agendas that have driven a project, but spend as much time clarifying specific requirements and expectations as you can up front *before committing to implementation*.

Take your stakeholder through the process of what they want to achieve and on what timescale. This also encourages your stakeholder to think about what really matters to them. Even if they don't change any requirements, managing to get a clear expectation of what success looks like allows you to plan effectively, and to be able to assess what you can realistically deliver that will meet their needs.

Always compare your current goals to the five SMART criteria.

* Specific
* Measurable
* Achievable
* Relevant
* Time bound

It is very hard to clearly measure whether we have achieved 'sovereignty', or to achieve 'not sending any money to Europe' while still maintaining a coherent relationship with the EU. With software requirements, words like 'fast enough' are often a sign of poorly understood requirements. Your intent should be to make it easy for stakeholders to tell when you have achieved something of value.

## Produce results, not hard work

> "Right from the get-go, going back to David Cameron's Bloomberg speech when he was full of optimism about reforming the EU in the UK's image, getting a derogation on free movement, there has been a mismatch between expectations and reality. Consequently every single product of these negotiations over a three-year period is delivered in London & Westminster stillborn."
>
>  - [Peter Foster, Telegraph Correspondent](https://twitter.com/pmdfoster/status/1131105950834855936)

When you look at the information coming out of Westminster, it is obvious that the average MP is working incredibly hard under high stress conditions, [sometimes to an unhealthy extent](https://www.standard.co.uk/news/londoners-diary/the-londoner-rosena-allinkhan-says-brexit-tension-puts-mps-sanity-at-risk-a4112096.html). Which makes it slightly unfair, that as far as the average citizen is concerned, they've achieved *nothing*.

Even as someone who has worked on stressful projects in the past, I cannot imagine what it is like to work as hard as MPs appear to be, and then to be openly declared to be lazy and worthless on a national scale. At the same time, it is easy for people to make that assumption, because it's not producing anything that people find satisfactory.

Again, there are useful lessons here for software. **In Agile, demos are important, visible progress is important.** If you're not demonstrating something, confidence begins to break down that you are actually contributing at all.

At the same time, you can be flexible about how much is delivered in one go. One of the key problems for Brexit is that, because March 29th became a national "moment", it became the equivalent of a major product release. Expectations were high that there would be complete success by that point, or parties would be held accountable. If Brexit had instead been promoted by the government as a long term project, there would at least be something to demonstrate at this point, in the form of increased spending for the NHS, and a published Withdrawal Bill. The fact that people are dissatisfied with this is down to disastrous expectations management, not to lack of effort.

## Don't be afraid to engage your stakeholders

>Like a circuit-breaker, citizens’ assemblies can disrupt the bad habits that have come to characterise Brexit: kicking issues into the long grass, placing party interests over the national interest and assuming the public are unable to cope with hard choices.
>
> - [Lisa Nandy and Stella Creasy, Labour MPs (Guardian)](https://www.theguardian.com/commentisfree/2019/jan/16/mps-brexit-citizens-assembly-lisa-nandy-stella-creasy)

One of the best ways to manage expectations is by providing clear, useful information. Obviously, the average UK voting citizen is not terribly interested in the details of the Dover/Calais goods transport system, but just as obviously the average product stakeholder is profoundly uninterested in HTTP codes and inheritance models. Thus the way to engage them is to consult them when there is a meaningful choice they can make, and meaningful input they can provide.

Developers, like politicians, tend to be skittish about over-involving stakeholders, generally out of concern that additional input will confuse a situation. However, stakeholder input still ends up occurring, just far further down the development pipeline, and requiring far more rework, with every popular and parliamentary vote since 2017 being a case study of this.

As a developer, if you have a set of viable options, even if you have a personal preference for sound reasons, it is often best to involve stakeholders in that the choice. If you take the choice away from them, they will try and take it back *even if they would have come to the same conclusion*. As an example, if there are two potential display frameworks, prepare a brief summary of the features available, preferably with a small demonstration, and offer relevant stakeholders the choice. You can introduce which one you feel will be easiest to develop with, which may well sway the stakeholder, but you may also discover previously undiscussed factors which are better influencing your decision before the framework choice is made.

Also, by involving stakeholders, not only do you make them as aware as you are of what you will get out of the decision, you get them to *defend* their choice to others, rather than repeatedly questioning it, which can be destructive to morale.

## Deadlines are extensible at a cost

> But we are where we are. Just over 50 days until we leave the EU and not a deal or an extension so far in sight, even though almost everyone in government admits there just isn't the time for it to pass all the legislation necessary for Brexit before 29 March.
> 
> - John Crace - GQ Magazine

If one thing has come out of the Brexit process, it is the knowledge that the Article 50 process has a time limit in it that is too short to resolve meaningful obstacles to leaving. This was already an accepted truth by economists and civil servants by June 2017. Somehow it was still being debated by the key stakeholders in Parliament and the EU in March 2019.

In the end, politicians on all sides agreed that an extension was necessary. Unfortunately because it had been ruled out for so long, it was seen as far more of a failure than it would have been, had the public and various stakeholders been prepared for it in advance. There is probably no more common problem in professional software development than this, as books like *Rapid Development* and *The Mythical Man-Month* demonstrate.

One way to mitigate the impact of an unavoidable extension is to be clear about the reasons for any extension as early as possible. Don't bluster, and don't use the deadline to extort more from developers. At best, they will suffer from increased stress, and when an extension *is* achieved, rather than taking the pressure off and giving them time to refocus, valuable staff may have prepared for a move already *based* on the deadline, [as the head of the Brexit department did in April 2019](https://www.instituteforgovernment.org.uk/blog/uk-will-probably-never-be-ready-no-deal-it-was-march).

## Conclusion

>"One cannot be successful as an architect without thinking of not only what to do, but how to get it done within an organization, which requires knowing why it should matter to someone who isn’t a technologist."
> [Eben Hewitt, O'Reilly Media](https://www.oreilly.com/ideas/how-architecture-evolves-into-strategy)

Obviously, many Software Developers went into a technical profession to avoid politics. However, one of the hardest parts of Software Development *is* managing the politics of a project. Getting approval for decisions, getting access to resources, persuading people to prioritise changes is as much a part of the software development process as REST calls and debuggers.

Viewed in this way, Brexit is a fascinating example of what happens when the politics around a complex technical project are mismanaged, and one we can all stand to learn from.

Which arguably beats trying to analyse it in a [more traditional manner](https://www.thetimes.co.uk/edition/comment/let-me-tell-you-which-people-in-politics-i-can-t-stand-everyone-cwvvxczmk).