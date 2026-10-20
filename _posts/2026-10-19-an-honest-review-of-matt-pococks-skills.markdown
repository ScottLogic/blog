---
title: An honest review of Matt Pocock's Skills framework
date: 2026-10-19 00:00:00 Z
categories:
- Artificial Intelligence
summary:
author: ceberhardt
layout: default_post
---

There is a vast and ever-growing array of frameworks, skills and platforms that _help_ us be more effective in our use of AI for software engineering, or agentic engineering if you like that term (I do). However, my experiences with these have often been pretty poor. Around a year ago I put the [popular SpecKit through its paces](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html), but found that it did little more than emit excessive amounts of markdown. Then just a few months ago, I [tried out the 'viral' Ponytail Skill](https://blog.scottlogic.com/2026/06/16/ponytail-yagni-and-the-problem-with-prompt-benchmarks.html), finding that it performed no better than just asking an agent to "follow the YAGNI principles" (I believe the Ponytail creator has incorporated my feedback and improved their benchmarking since). I've tended to avoid similar frameworks since, favouring my own Skills, or those of my colleagues.

Last month I listened to Gergely Orosz (Pragmatic Engineer) [interview Matt Pocock on his podcast](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock) and found the conversation fascinating. Matt's approach to Skill design is really interesting, and the interview is well worth listening to in full. One specific point that jumped out at me was his consideration of an agent's "priors", the inherent knowledge gained through training, and how prompting can unlock latent behaviour.  

Given that Matt is the author of 'skills', possibly the most popular agentic engineering skills framework (as of today, 294k GitHub stars), I thought it was worth trying out his framework to see if it could change my perspective. This blog post is a brief write-up of my experiences, which were decidedly mixed.

## A promising start

The 'pitch' for this framework certainly aligns with my preferences:

> My agent skills that I use every day to do real engineering - not vibe coding.

Agreed. I still want to stay connected to the code - agentic engineering, not vibe coding.

> These skills are designed to be small, easy to adapt, and composable

Once again, this resonates. In my experience, projects (and teams) are sufficiently different that Skills created for one might not necessarily translate to another. Skills should be owned by a team, not foisted upon them, and their effectiveness is a team's responsibility. This certainly sets it apart from SpecKit, which I tried out a while back.

In order to test this framework I once again used a personal app that I've used as something of a benchmark for trying out different agentic engineering approaches. It's called [KartLog](https://colineberhardt.github.io/kartlog/), and it is an app (PWA) of modest complexity that I use for tracking karting sessions - it is real and has a modest number of users! 

To put Matt's Skills framework to the test, I decided to rebuild the app from scratch.

## Kicking the Tyres

I wasn't entirely sure where to start, so after set-up (which was near trivial), I used the `/ask-matt` skill to ask where I should start if I had a high-level app idea. It pushed me towards `/grill-with-docs`, as a way to interactively elaborate the idea in order to create a more formal structure.

Before Matt developed his broader Skills framework, he initially found success with his 'grill me' skill, which went viral. Put simply, this is a skill which turns the tables: the agent is tasked with asking you questions rather than the conventional approach where you instruct the agent. It is a surprisingly powerful, yet altogether hidden feature - I covered this just over a year ago in a blog post on the ["Blinking Cursor"](https://blog.scottlogic.com/2025/02/21/ais-biggest-flaw-the-blinking-cursor-problem.html) problem, arguing that AI has so many strengths that are entirely hidden behind the simplistic chat interface.

## Grilling to identify project context

The `/grill-with-docs` Skill resulted in a ~5-minute conversation, where it asked some quite sensible questions. It is clear that it has an inherent understanding of this domain (it knows about sprockets, caster, jets etc.) - I wonder how it would cope with something less familiar? Regardless, it felt like it worked well here. The result of this session was a ~45-line `CONTEXT.md` file, and an ADR (Architecture Decision Record) file. Most of the content was quite straightforward, explaining the core concepts; however, the ADR did highlight an important point:

> A go-karting app would normally be expected to have a "Kart" record. Instead, Chassis, Engine, and Tyre Set are modeled as independent, swappable components, each referenced directly by Session, because they're swapped and worn independently (a chassis outlives many tyre sets; an engine can move between chassis) and usage stats (laps, heat-cycles) need to attach to the actual physical part, not an artificial bundle.

While this is obvious to me, I can see how this is an important concept worth capturing and communicating.

So far, so good.

At this point I wanted to have a quick look 'under the hood' at the `/grill-with-docs` Skill. I was interested to see that it is implemented via Skill composition (grilling + domain modelling), something I hadn't thought of doing before. The 'grilling' concept appears in a few of the Skills, and there is a single file that describes this process. The use of composition seems so obvious in hindsight! It was also pleasing to see that the Skills themselves are very concise compared to many others I have reviewed.

### Specification - and a little AI theatre

The next step (as `/ask-matt` helpfully informed me) was to start building out the specification, via `/to-spec`. On running this Skill, it acknowledged that this is a greenfield application and that it is important to identify a seam for testing (a seam is an interface where you swap underlying implementations, in this case to support testability), proposing an abstraction layer above the cloud storage provider. A sensible choice.

Once I confirmed that choice, it generated a specification for the application which, at around 80 lines, seems like a reasonable level of detail.

One complaint I do have about this specification document is the use of user story syntax (As a… I want… so that…). Here are some examples:

~~~
...
1. As a User, I want to add a Chassis with a name, make, and serial number, so that I can track a specific physical chassis I own.
2. As a User, I want to add an Engine with a make and name, so that I can track a specific physical engine I own.
3. As a User, I want to add a Tyre Set with a make and compound, so that I can track a specific set of tyres I own.
4. As a User, I want to mark a Tyre Set as retired, so that it stops appearing as selectable for new Sessions once it's worn out.
5. As a User, I want to see the total laps and total sessions run on each Chassis, so that I know how much use it's had.
...
~~~

Much of the functionality of this application is basic CRUD (Create, Read, Update, Delete) and I'd personally favour a specification that represents this as a data model, rather than a set of disconnected user story 'atoms'. 

This is where we have to be careful of AI theatre. It is a trivial exercise for an AI model to express this application as a set of user stories, whereas a human would have likely tired of typing this out and realised that a more concise representation of the same concept takes fewer keystrokes, and is ultimately a better vehicle for communicating the concept to other humans (and AI agents also).

There is something deeper going on here too; the problem goes beyond the resulting inefficient expression of the specification. Ultimately the problem here is that faithfully executing a process is not equivalent to achieving the purpose of that process. A specification should succinctly capture and communicate the requirements of an application; that is its purpose. In this case, it has missed the mark a little.

Following the specification, I was prompted to run `/to-tickets`, which generated eight tickets, all of which looked quite sensible and lightweight.

## Implementation - 

The next step is implementation, via the `/implement` Skill. Looking at the Skill itself, it is [just six lines long](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md). 

I kicked off the first ticket, watching it implement using a red/green TDD approach (i.e. write a failing test, implement, then verify). Implementation also invokes a `code-review` Skill, which I found particularly interesting. The review is split across two axes: Standards (does the code follow the project's documented coding standards?) and Spec (does it faithfully implement the specification?). I hadn't supplied a coding standard, which caused the Skill to fall back on a baseline set of 'code smells'. Both standards and spec caught a few bugs in the initial implementation, which it fixed as part of the loop.

I found this whole process to be a great example of sensors: feedback mechanisms that improve an agent's implementation as part of an iterative process. There is a good article on sensors over on [Martin Fowler's blog](https://martinfowler.com/articles/sensors-for-coding-agents.html). There is tremendous value in encoding project- or organisation-specific standards for your agents to follow.

I was genuinely delighted to watch this system working - a great antidote to the approaches which favour complex up-front specification in pursuit of one-shot success. Here, a relatively simple loop, guided by carefully curated Skills, which are easy to modify, improves the code quality through iterations in a very meaningful way.

But ... when I took a look at the tests themselves ...

The PWA uses Supabase as a back-end, and in order to support testing, there is a thin abstraction layer that wraps the Supabase implementation. As a result, the UI doesn't have any direct dependency on Supabase, which is a sensible design decision. 

The generated tests look quite sensible on the surface, generating a mock Supabase back-end:

~~~javascript
it('creates a tyre set', async () => {
    const insert = vi.fn().mockReturnValue({ error: null })
    const supabase = fakeSupabaseWithTable('tyre_sets', { insert })
    const client = createTyreSetClient(supabase)

    await client.createTyreSet(newTyreSet)

    expect(insert).toHaveBeenCalledWith(newTyreSet)
})
~~~

However, digging into the implementation, the `client` is around 15 lines of generic adapter code, which is shared across all entity storage logic. Despite this, the agent has generated tests for the CRUD behaviour of all entities, testing these few lines of code repeatedly. In fact, the tests do more to validate the mocks that they have constructed than the code itself!

Once again, a human being would have probably stopped short of implementing all of these tests due to the effort involved in typing them out.

I proceeded with a few more rounds of implementation, and the functional slices all seemed quite reasonable.

## Wizard - or, not to wizard

At the early stages of implementation I asked for some help setting up Supabase:

> help me setup supabase and run the current codebase

To which the agent responded:

> This is exactly what /wizard is for — steps only you can take (clicking through the Supabase dashboard, Google Cloud Console) that I can't do myself. Let me generate an interactive script for it.

Cool, let's give it a whirl. 

Wizard creates a bash script that walks you step-by-step through a set-up process. It's a nice idea, but in my case fell apart quite rapidly. The problem is, set-up is rarely linear. In my case, it asked me to navigate to pages that no longer existed, or click buttons that were simply not there. Clearly its 'memory' of Supabase was a little stale. 

Now, if this wizard was being orchestrated by the agent itself, we would likely have been able to resolve this issue collaboratively. However, the shell script has no escape hatch. If there is a bug in the implementation, you just get stuck at that step. 

## Conclusions

I have mixed feelings about Matt's Skills framework, which I will try to summarise here. However, it would be remiss of me not to point out the limitations of my experiment. This was a greenfield application of modest complexity, and I didn't tailor or adapt the Skills.

Stepping back from the implementation detail and the individual Skills, it promotes a set of fundamentally sound engineering practices. It also does this in a manner that is lightweight and thus easy to tailor. The framework claims to be:

> small, easy to adapt, and composable

And it certainly delivers on that. The Skills are refreshingly simple in their implementation.

However, the output occasionally felt a little amateurish. At times it felt like we were simulating the rituals of software engineering, but without the judgement that makes these processes genuinely valuable. I wouldn't consider that to be a direct criticism of this framework, rather, it is a pitfall to be wary of. We cannot offload our judgement to an agent (at least not yet), even if they make it easy for us to do so.

I would expect these Skills to be a useful tool for engineers who lack the experience of a more structured approach to engineering. They teach a disciplined approach that many experienced engineers would likely employ intuitively. Furthermore, the implementation loop (with feedback from sensors) is a great illustration of an agentic loop and just how powerful they are.

I also think this framework delivers a different kind of value for experienced engineers, illustrating how easy it is to create an agentic software development system that follows their own conventions and preferences. They are a great antidote to the more bloated software development "factories" (complex, fully autonomous agentic delivery systems) that others are pushing. But don't expect it to conform to your conventions out of the box; it is a good starting point that can and should be tailored.

I would also encourage engineers, both inexperienced and grey-beards, to listen to Matt's thoughts on prompting and Skill design. It is one of the most considered approaches I have come across.

Throughout my use of both this Skills framework, and others, I spend a lot of time considering how much control we should be handing over to the agent. At times in the process I found myself feeling strangely uncomfortable, not because the agent was doing something dangerous or wrong, more because it was taking responsibility for activities I understood and was perfectly capable of doing myself, and my experience and judgement would have added value. I use AI extensively, but don't necessarily want to use it for everything. But exactly when and where you yield control is always going to be a personal decision and one that requires great judgement and discipline.

Going full circle, to the headline claim of this framework:

> My agent skills that I use every day to do real engineering - not vibe coding.

Engineering isn't just a sequence of tasks that you can encode as Skills and entrust to your agent. It requires judgement about which practices are appropriate, when and why - there is a need for context (and no, I'm not talking about model context here, we're talking real-world context that is human-specific).

Skills can help encode tasks and guide agents, but they do not eliminate the need for judgement.

These agent Skills are what Matt says "I use every day to do real engineering". Note the presence of Matt in that statement. I don't know whether that was intentional; he could have said "Agent skills that do real engineering" and removed himself from the equation. I'd like to think it was intentional though.








