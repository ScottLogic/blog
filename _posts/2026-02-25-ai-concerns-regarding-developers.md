---
title: AI Concerns regarding Developers
title-short: AI Concerns regarding Developers
date: 2026-02-25 00:00:00 Z
categories:
  - colive
  - Artificial Intelligence
  - People
tags:
  - blog
  - artificial intelligence
  - colive
  - featured
author: colive
contributors:
summary: With a whole new way of writing code being adopted across the industry and some talking about the eradication of developers, what should those who code be actually concerned about?
summary-short: Thoughts and concerns on the direction the AI revolution is driving the average developer
layout: default_post
---

## AI Concerns regarding Developers

Modern life can easily distract you away from most of your thinking time. However, within the thinking time I have
had recently, this is what I've been pondering. Below are my thoughts on the change in nature of software development
in light of the new AI tooling world we are all being thrown into.

## Developers are not a dying breed

A colleague of mine named James told me his thoughts and predictions on the AI revolution in our field and I
mostly agree with his opinion on this. Looking at the improvements of the tools now I don't think AI will
completely eradicate developers. If it becomes competent enough to replace 10 developers with 1, I still think
there will be a desire for those 10 developers somewhere in the industry to produce what 100 would do before.
Speak to any development team, I'll be amazed if you find any saying they wouldn't appreciate more time or
team members to refactor, further test or clean parts of the project. Like writing a book, there's always more you could
do; always features in the minds of product owners and developers that would be a good fit (or at least worth exploring),
always areas of the tech stack that could do with reworking to cover potential failures or vulnerabilities. Perhaps AI
will give us all that opportunity to be perfectionists on our projects, finally getting to every little thing on our
Jira boards and notepad todo lists.

## Benefits to be declared first

I think it worthwhile acknowledging what AI has definitively helped with first before discussing the areas of concern.

### Targeted, highly reproduced problems with well-defined prompts produce perfectly serviceable changes
From my experience with the models and tools, that's the point we're at now. They can quite reliably do something I
know how to do and can point it towards directly. "Update this function to take these optional arguments", "Use this
package instead of the existing custom logic" and so on. When changes are small and context is clear, they're pretty good.
This is why I particularly think they will be good at tackling simple tech debt and fixes that often rot in the backlog.

### Educating the developer on the code base
Integrated systems like Windsurf are very good at iteratively exploring a codebase and returning summary descriptions
and explanations about how it works. Comments in code have never been less necessary and well named methods and variables
never more important. I've personally had many moments where the key piece of information for fixing a bug has come from
a summarization of an area of code from my LLM tool.

### Unit test generation
Unit tests are a numbers game and quantity is arguably as important as quality.
Highly complex unit tests that don't point to specific "units" of code are worse than 1000s of tiny logic checks
where the few that fail due to a change point straight to the issue. Unit test writing also requires a very small context
(just the file or function you're testing) which tailors to AI tools very well.
It is also an area where clean code principles are more forgiving (for example, repeated code in tests, if written
clearly as a result, is fine. Feel free to fight me on this in the merge requests).

## Things that are certainly a concern

### Junior developers and their on-project learning opportunities

I'll happily accept to many readers my ~5 years of experience is a relatively weak position to be taking an opinion on this.
Regardless, since the early 2020s AI tooling has gone from experimental and very occasionally available to a developer to
actively being pushed onto developers to use.

My first 2-3 years was spent building things I directly wrote into the IDE and
although search engines had started to begin to show generated summaries of search results, real people's posts of stack overflow,
sites like W3School, Mozilla Developer, GeeksForGeeks and _other people_ were my way of figuring out what to do.
That level engagement into what you're doing teaches you if what you're doing is any good or not,
a crucial skill for not just writing code but learning how to judge it's quality.

If new developers spend their careers leaning on LLMs to generate code, yet are still required to review, sign off and
approve changes, what good will their approval be?

### Quality, especially within new frameworks and languages

If the next generation of developers have a tool that can remove the need to do that micro-level research, why would they
bother to learn software development at that level at all? Humans are lazy; Even if business policy is to "review every line of
code AI tooling will generate", developers against time pressure or just simply without the interest to do so will not follow this perfectly.
When things go wrong, you're left praying your tool can understand the issue well enough to fix it.

### The first unreputable layer of abstraction

If you imagine "AI tools generating code" as the latest layer of abstration in software development above high level languages and
frameworks, this is the first where we have complete uncertainty of how consistently reliable it will be. A C# developer can
rely on machine code working - the code has been written critically, published once and tested by many people around the world to be
considered reputable. The application developer atop the C# language can treat it in the same way - popular, highly regarded languages
have stood the test of time. There is no need to delve deeper into how it works.

Code generated by an LLM will not be 100% reliable and therefore needs proper review. If we treat the AI code generation
layer like all the others where we don't bother understanding how it works under the hood, we won't know how to fix it when it breaks down.
AI generated code does not have the reputability of anindustry grade language - it was born yesterday and must be treated as such.

### Junior job opportunities

The obvious one - if these tools are cheaper than new hires and can already outperform them,
what will happen to the new hires? And if _that's_ the case (just like the depopulation problem),
what will happen to the senior developers down the line when no backfill exists?

### Developers becoming maintainers

Finally, it's worth acknowledging what will likely happen to our roles. AI, like the humans it was trained on, will
make mistakes. Very soon the bottleneck of all development will be the speed at which humans can intervene and fix
problems the LLMs write, removing all developers from the front lines entirely. I think a lot of developers favourite
part of programming is the creative problem-solving we get to do and I suspect our transition to becoming maintainers
of projects will remove a lot of this style of work.

## But AI will fix these problems for us!
Potentially. I'll happily admit most of these concerns are only tangible if LLM generated code continues to be mistake-prone. Perhaps model makers improve their quality to such a high level these "when things go wrong" concerns never materialise.
But I highly doubt it. The training data LLMs rely on for their "pre-trained transformers" is riddled with human error and
any clever patching solutions that don't fix that underlying principle will never eradicate its ability to hallucinate,
make mistakes or simply misinterpret its context.

The truth is none of us really knows what will happen, how big or structurally sound the bubble is. Only time will tell.