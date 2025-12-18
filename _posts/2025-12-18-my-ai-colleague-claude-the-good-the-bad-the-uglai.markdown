---
title: 'My AI Colleague: Claude, the good, the bad, the UglAI'
date: 2025-12-18 09:00:00 Z
categories:
- Technology
- Artificial Intelligence
- Sustainability
tags:
- AI
- prompt engineering
- claude
- generative ai
- confluence
- atlassian
summary: How we leveraged AI to implement a compliance framework in record time –
  and what we learned along the way.
author: twebb
---

When I was asked to lead a management system certification project, I'll admit my first reaction wasn't enthusiasm. It was something closer to: "How on earth are we going to do this with a two-person team, no prior experience with this standard, or domain, and a tight deadline?"

The answer, as it turned out, involved an AI assistant called Claude. But before you dismiss this as another breathless "AI will change everything" piece, let me share the messy, sometimes frustrating, ultimately successful reality of what that actually looked like.

## The Setup: Projects and Prompts

We started by creating a dedicated project in Claude with a custom system prompt. Think of it as giving the AI its job description. Ours went something like: "You are an expert consultant helping implement \[this management system\] for a 500-person software consultancy."

But here's the thing about prompts – they're living documents. What started as a paragraph evolved over weeks as we discovered what worked and what didn't. We added instructions about our documentation platform, reminded it to use British English, clarified our internal terminology. We also specifically and deliberately instructed Claude not to make assumptions – to always ask for clarification and indicate sections that required further input. Each refinement came from hitting a snag and thinking, "right, we need to tell it that as well."

The project also became a repository for our key documents – the standard itself, our existing policies, previous reports. This gave Claude the context it needed to ground its suggestions in our actual organisation rather than generic best practices.

## The Game Changer: Confluence Integration

Everything shifted when we integrated Claude directly with Confluence. Suddenly, the AI could search our existing documentation, cross-reference between policies, and pull accurate information from our source of truth.

Before this, we'd been copying and pasting content back and forth – time-consuming and error-prone. After integration, I could ask Claude to check whether our proposed procedure aligned with what we'd already documented elsewhere, and it would actually go and look. The cross-referencing alone probably saved us dozens of hours.

This capability proved invaluable when preparing for audits. We could ask Claude to identify gaps between our documentation and the standard's requirements, and it would systematically work through the clauses, flagging where we needed more evidence or where documents contradicted each other.

## The Uncomfortable Truth About Confabulation

Now for the less comfortable part. You've probably heard the term "AI hallucination" – but the technical world is increasingly moving away from it. Hallucination refers to a sensory experience: perceiving something that isn't there. LLMs don't perceive anything. The more accurate term is confabulation: filling gaps with fabricated information, delivered with complete confidence and no awareness that it's wrong.

Whatever you call it, it's real, and we learned this the hard way.

Remember that prompt instruction about not making assumptions? Claude mostly followed it, and we mostly trusted it – until it didn't, and that's what stung us. We discovered this in spectacular fashion during a meeting with an executive, when we'd focused all our preparation on ensuring the deck addressed the agenda correctly. What we hadn't thought to check were the basic facts – figures that should have been pulled directly from Confluence but which Claude had apparently decided to manufacture out of thin air. Cue squirming embarrassment in front of an exec who handled it rather kindly in the circumstances.

Walking into that meeting with incorrect information hurt. Not catastrophically, but enough to learn a lasting lesson: always verify the details, even (especially?) the ones that seem too straightforward to get wrong.

The pattern we noticed was that Claude would confabulate most confidently when it should have been uncertain. Rather than flagging "I couldn't find this in your documents," it would generate plausible-sounding numbers with complete conviction and zero warning.

## The Iterative Process: Draft, Challenge, Refine

Our workflow evolved into a rhythm: ask Claude for a first draft, then challenge it relentlessly on length, appropriateness, compliance, and accuracy.

A typical exchange might start with Claude producing 2,000 words of policy documentation. By the time we'd pushed back – "This is too long for our context," "Does the standard actually require this section?" "Our organisation doesn't work that way" – we'd often end up with 350 words that actually said what we needed. One particularly memorable document started life at 12,000 words and was eventually refined to about 1,000.

This wasn't Claude being bad at the task. It was responding to what it thought we wanted versus what we actually needed. The more specific we became in our prompts, the better the initial outputs. We learned to front-load our requirements: "Keep this brief and appropriate. Focus only on MVP. Reference our existing policy for context."

We also discovered the power of asking Claude to challenge its own work. Prompting it with "Now review this against the requirements and identify anything that's unnecessary or non-compliant" often surfaced issues we'd have missed.

## Getting Smart with Prompts

As the project progressed, our prompting became increasingly sophisticated. We developed templates for common tasks – creating procedures, writing audit checklists, preparing management review agendas – that embedded all the lessons we'd learned about what made outputs useful.

We started specifying alignment requirements upfront: "Ensure this references our existing documentation and uses consistent terminology." This prevented the drift that could otherwise creep in when generating multiple documents over time.

Perhaps most valuable, we used Claude to maintain consistency across the entire system. When we updated one document, we could ask it to identify everywhere else that change might need to ripple through. For a management system where cross-references matter, this was transformative.

## The Double-Edged Sword of Memory

Claude now has memory – the ability to reference previous conversations and build on what's been discussed before. In theory, this is wonderful. No more re-explaining context. No more Groundhog Day prompts.

In practice, it's a double-edged sword.

Memory is brilliant when it works: "Using that procedure we drafted, can you check it aligns with what we just wrote?" Genuinely useful. But memory can also mean Claude repeatedly relies on information that has since been superseded. We'd update a document, move on, and then find Claude confidently referencing the old version three conversations later – because that's what it remembered.

For those of you old enough to remember *Quantum Leap*, it feels a bit like slapping Ziggy repeatedly before getting the right answer. "No, Claude, we changed that. Check again. No, again."

## The Session Limit: Mid-Flow Shutdown

And then there's the session limit.

You're in the zone. You've got momentum. Claude understands exactly what you're trying to achieve, the context is loaded, and you're making real progress. Then, without warning: "You've reached your usage limit."

To be fair, Claude does tell you when it'll be back – but that's where the heart-rate spike comes in. Sometimes it's a couple of hours. Sometimes it's nearly a day. When you're on a deadline, seeing "available again in 5 hours" is not the news you need.

We learned to move smartly with it. Step your work rather than sending monster prompts. If you have several stages to a task, hand-feed one at a time and you can eke out your usage. But the threat is always there, lurking.

## The Sustainability Question

There's a tension in all of this that we haven't addressed yet. As an organisation with sustainability at its heart, it was a consistent consideration throughout the project – weighing up the balance of getting the task done against the footprint left behind.

All those iterative refinements – the back-and-forth challenging, the "try again" prompts – they come at a cost. Every query to an AI model consumes energy. The recommended best practice for sustainable AI use is short, accurate prompts with minimal rework. Our bootstrapping process was anything but that.

This poses an uncomfortable question about cost. Hiring human experts would have been more expensive financially, but arguably more sustainable environmentally. Our AI-assisted approach was cheaper in fees, but every iteration had a carbon footprint we have a responsibility for. On the other hand, the process increased our domain knowledge and educated the consultants involved – a human benefit that outlasts the project.

Perhaps the answer, for now, is that AI-supported human work is the balance to strike. Use AI to accelerate and augment, but don't mistake iteration for efficiency. The more skilled we became at prompting, the less rework we needed. That learning curve isn't just about productivity – it's about responsibility too.

We're not claiming to have cracked this. But it's worth acknowledging that "move fast with AI" has a footprint, and being thoughtful about how we use these tools is part of using them well.

## The Honest Conclusion

Could we have achieved certification without AI? No – certainly not in the timescale we had. The sheer volume of documentation, the need to understand and apply an unfamiliar standard, the cross-referencing and gap analysis – these tasks would have overwhelmed our small team working traditionally.

But here's the equally honest flip side: we would not have achieved certification with AI alone. The analytical skills, the experience of the consultants doing the work, the organisational knowledge, the judgement calls about what was appropriate for our business – these were irreplaceable human contributions.

Claude was an excellent tool for optimising the existing skills of our team. It amplified what we could do, accelerated our learning curve, and handled the heavy lifting of first-draft generation. But it required constant human oversight, regular course correction, and persistent verification.

A power tool, not a replacement worker.

And that lesson about checking the details? I'll repeat it one final time, because it bears repeating: always, always, always verify what the AI produces – even when it seems certain, even when the facts appear obvious, even when you're confident you've asked it to double-check.

Because walking into a meeting with the wrong information does hurt. Trust me on that one.

*A blog prompted and curated by Toni Webb and created by Claude*