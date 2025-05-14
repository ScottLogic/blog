---
title: Are We Sleepwalking into AI-driven Societal Challenges?
date: 2025-05-14 13:17:00 Z
categories:
- Artificial Intelligence
- Sustainability
tags:
- AI
- Sustainability
- ocronk
- architecture
summary: As the capabilities and accessibility of AI continue to advance—including
  more sophisticated reasoning capabilities and agentic deployment—several questions
  and risk areas emerge that really deserve our attention.
author: ocronk
image: "/uploads/1739191700049.png"
---

*Note: A version of this article was originally shared on [LinkedIn in February 2025.](https://www.linkedin.com/pulse/we-sleepwalking-tomorrows-ai-challenges-oliver-cronk-4rcge/)*

As the capabilities and accessibility of AI continue to advance—including more sophisticated reasoning capabilities—several questions and risk areas emerge that deserve our attention. This is particularly relevant in light of the publication of ["Gradual Disempowerment,"](https://gradual-disempowerment.ai/) a framework that explores how humans may unwittingly cede agency to AI systems. While [I previously explored some of the AI risks and issues in 2023, our initial conceptual thinking on solution architecture](https://www.scottlogic.com/insights/white-paper-derisk-gen-ai) now seems insufficient given the rapid pace of development.

## AI Developments Relevant to All

Like it or loathe it, Generative AI continues to attract serious investment and is advancing rapidly—sometimes with hype and adoption outpacing proven capabilities. Reasoning models and autonomous agents are creating new risks and issues, partly from the immaturity of the technology but also from hasty deployment practices. These concerns are no longer limited to highly regulated businesses using AI; they affect organisations and society at large as we increasingly encounter these solutions in our daily interactions.

In this article, I'll avoid jumping straight to solutions. Instead, I'm keen to explore the challenges, risks, and issues with a view to helping consider how we might architect differently in the future to mitigate them (if we can!).

## Key Challenges

![sleepwalking-risks.png](/uploads/sleepwalking-risks.png)

### Impersonation and Authentication

What happens when AI becomes sophisticated enough for anyone to generate human-like content effortlessly? Currently, only a relatively small portion of the global population possesses this ability. This raises questions about the methods we'll need to authenticate and validate human actions and creations.

For instance, will electronic evidence, such as CCTV footage, become compromised or devalued? The BBC series ["The Capture"](https://www.bbc.co.uk/programmes/m000g3q9) vividly illustrates this concern. In the extreme, this could lead to a "dead internet" populated primarily by bots, with some humans returning to in-person situations to regain trust while others are drawn into an increasingly artificial virtual world disconnected from reality.

### Human vs Bot Activity - What Is Acceptable?

How can we ensure that a human being genuinely created or performed an action on a system, rather than an automated process acting on their behalf? This question is crucial for certain processes as we navigate the blurred lines between human and machine contributions.

But for other processes, will it matter if something was done by the actual person or a tool/agent acting on their behalf? Do we need some classification system such as:

- "Human only" (requiring verification)
- "Human Preferred" (Augmentation acceptable - but with human sign-off and indication of AI use)
- "Full automation expected" (but no set requirements on human involvement)

It's worth noting that these categories might evolve as capabilities or acceptance of AI changes.

While writing this, I came across a recently published paper by HuggingFace which suggests that ["Fully Autonomous AI Agents Should Not be Developed"](https://huggingface.co/blog/fully-autonomous-ai-agents)—adding another perspective to this complex issue.

### Confirmation Fatigue and Review Weariness

The requirement for human sign-off and review of AI activities could become tedious (particularly for repetitive tasks), effectively leading to de facto straight-through automation. After all, you might as well fully automate a process if it isn't going to be meaningfully checked.

This might be prevented by requesting more specific feedback on generated content (which bad actors could probably automate) or through legal frameworks. Another thought is to have another AI evaluate actions (these "evals" are quite common in Agentic AI coding frameworks, including Scott Logic's InferGPT/InferESG architecture)—but is this sufficient? Does this approach risk contributing to the Gradual Disempowerment problem?

### Degradation of Human Capabilities

A longer-term challenge (in some cases related to convenience) is the potential for people to forget how to perform tasks independently. As we increasingly rely on artificial intelligence, should we find ways to prevent this dependency from eroding our skills and knowledge?

Or is this simply like any other technological advancement, with cloud computing being a recent example of de-skilling at a hardware level? How comfortable are we making human society even more dependent on technology, potentially becoming more fragile and prone to major consequences from failures?

Do we need a "chaos anti-AI monkey" for our organisations—designated days when we turn off AI systems to ensure we can still operate without sophisticated tech platforms?

### Tech Addiction on Steroids

How do we address individuals becoming addicted to an artificial version of reality? The allure of a perfectly curated, AI-generated world could lead to detachment from genuine human experiences, interactions, and involvement in society.

### Digital Divide and Further Inequality

How accessible are these latest generation tools? Are we witnessing further digital divides or levels of personal AI maturity:

1. No access to digital technology or the internet
2. No access to or understanding of how to use AI tools
3. Access to AI tools but only as an end user
4. Ability to leverage/create AI tools for economic advantage (creating passive income)
5. Mastering/owning AI platforms that [begin to] dominate markets

This isn't just about end use—while chatbots use human language and are relatively accessible, there's also the ability to leverage their design, creation, and operation. Awareness, access, cost, skills, and bias all play roles here.

How do we ensure we aren't leaving customers, colleagues, and stakeholders behind? For some, these tools are currently like being given an MS-DOS prompt without a manual—until prompt engineering is abstracted away, this can be a barrier to adoption. "What should/can I do with this?" remains a common question from those less familiar with LLMs.

Those with the skills or financial resources to build/own these platforms will have a significant advantage—though not without facing the other risks discussed. Perhaps this is another argument for pushing Open Source AI platforms, as these make AI more broadly accessible.

### Societal and Political Manipulation

Have we learned the lessons from the [Cambridge Analytica scandal](https://en.wikipedia.org/wiki/Facebook%E2%80%93Cambridge_Analytica_data_scandal)? Has the democracy horse already bolted? Is the average person equipped to handle a flood of fake social media activity and hyper-personalisation of political content? This is particularly concerning when many don't understand the capabilities of the latest generation of AI tools, let alone recognise their biases. Manipulation and mobilisation are powerful forces.

### Automation Overloading Our Architectures

Could we see impacts akin to denial of service attacks? The implementation of GenAI systems will likely lead to imbalances and asymmetry. Consider these scenarios:

- A web application or platform architected, designed, and capacity-planned for human use. Unless it has some degree of auto-scaling, could agentic AI use massively overwhelm platforms previously used in limited ways by humans? This needs to be considered throughout the tech stack—not just the presentation or web tier, but also what might happen at the backend or in downstream systems.
- Your email inbox—spam is bad enough today, but what about agents generating emails that look human, important, and urgent?

Non-technical examples include:

- Customer service teams staffed for genuine human interaction becoming overwhelmed by automated calls or emails
- Your attention, including social media feeds. Are the days of being able to manage timelines ourselves coming to an end? It feels like we're already overwhelmed.

### Implications of "I'll Get My AI to Talk to Your AI"

Many might suggest using more AI to address these issues. But what knock-on implications does that bring? Could we have automation on both ends leading to further unexpected consequences—at best, perhaps an endless back-and-forth between bots (wasting energy and storage), at worst causing failures or unpredictable outcomes?

## The Impending AI Arms Race

These questions—and surely many more—suggest there's too much at stake for a wait-and-see approach. Even if you're sceptical of GenAI, many others aren't and are rushing to implement solutions. Some will spectacularly crash and burn, but others might "work"—and what will that do to your operations? Sadly, this arms race will probably eventually force even the reluctant to take up arms.

## The Need for a Conscious Policy/Strategy

I'd encourage you and your organisations not to bury your heads in the sand on this issue. Even if you're not actively implementing AI, make that a conscious, risk-assessed strategy that receives proper sign-off (as it might have cost implications from an increase in human-based activities dealing with inbound AI-generated demand).

This arms race drives further tech consumption with implications for materials and energy use. However, this article has deliberately focused more on the Social and Governance angles than the Environmental aspects of sustainability.

## What's Your Take?

Much of this possibly falls under the banner of AI safety and alignment, but I believe the broader technology community has a valuable role here. I'm consistently impressed by the insights from colleagues and industry experts, and confident we can develop meaningful perspectives on these challenges.

Do check out [gradual-disempowerment.ai](https://gradual-disempowerment.ai/) if you want to explore the implications of this latest wave of software "eating the world" in greater depth.