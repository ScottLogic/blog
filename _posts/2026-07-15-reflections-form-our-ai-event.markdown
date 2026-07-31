---
title: 'Adopting Agentic: Talks and Reflections from Our AI Engineering Event'
date: 2026-07-15 00:00:00 Z
categories:
- Tech
summary: A summary of the talks and discussions from our recent event, Adopting Agentic
  - Software Engineering for the AI Age, exploring the human and organisational impact
  of AI on our industry. Includes session videos, key quotes and my personal reflections
  on each presentation.
author: ceberhardt
image: "/ceberhardt/assets/adopting-agentic.jpg"
---

<style>
iframe { margin-bottom: 2rem; }
</style>

A couple of weeks ago we organised an event, **Adopting Agentic: Software Engineering for the AI Age**, where we held talks and discussions around the future of our industry in the face of massive AI disruption. In this post I share a brief summary of the talks, together with my thoughts, and the session videos - which are now on YouTube. Enjoy!

## Background

There is no shortage of discussion about the impact AI is having on our industry, and as a practitioner of many years I am keen to be part of that discussion. However, most of the events I have attended recently tend to focus on the tools and the technology. From my perspective, the bigger impact, and more important discussions, are about the impact this technology is having on us. The impact on the individual and their skills and job roles, the impact on teams, their ceremonies and ways of working, and the aggregate impact this has on software businesses as whole.

In the absence of an event talking about the topics I feel are important, the only option was to create one!

## Introduction - Colin Eberhardt

I kicked off the event with a brief introduction, reflecting on just how much has changed in the past four years. Back in 2023, when [Goldman Sachs published a report on the economic impact of AI](https://www.gspublishing.com/content/research/en/reports/2023/03/27/d64e052b-0f6e-45d7-967b-d7be35fabd16.html), they predicted that 29% of software engineering tasks were exposed to AI automation (just 4% above the average impact across all job roles). That figure seems rather conservative these days as we now find our industry to be _one of the most exposed_ to automation.

After a whistle-stop tour of the tooling which has seen AI progress from being an autocomplete, then pair programmer, workflow participant to become an autonomous contributor we reach the present where ...

> "The cost of generating the right code has rapidly dropped to almost zero - under some very specific conditions."

(this includes some important caveats when compared with the simpler 'code is now free' mantra)

For as long as software has existed, our processes, our SDLC, our ceremonies have all been built around us - modelled around the strengths and weaknesses of human beings.

My parting thought was that:

> "We need to replace the processes and practices that we have built around our own strengths and weaknesses with new ones designed around the strengths and weaknesses of AI"


<iframe width="560" height="315" src="https://www.youtube.com/embed/pvecT3tFaeM?si=mxKksgYYYSsrApwI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Build Boldly - Rhea Sam

The first 'proper' talk of the night was from Rhea Sam, an AI Adoption Specialist at Valtech. Her talk focused on the gap between headline adoption statistics and genuine organisational fluency, and what it takes to bridge it.

As I mentioned in the introduction, capitalising on this technology takes far more than just rolling out the tools (and a mandate to use them). It demands change, and that is where Rhea's talk dug in, highlighting the sometimes uncomfortable changes that are needed.

> "The questions I get every day are: I'm scared to start. I don't know where to start. I want to start, but I don't feel confident to start."

This isn't an easy technology to use. It hides both its strengths and its weaknesses, and it is fundamentally unlike any other technology we have ever had before. The emotional impact, which Rhea mentions above, is very real - but often goes unspoken.

Her talk covered AI fluency, enablement and cultural change. I particularly liked this statement:

> "It's not a top-down strategy. It's top-down strategy meets bottom-up community adoption."

<iframe width="560" height="315" src="https://www.youtube.com/embed/A3fUdBhG1xI?si=j-70jV3L3WkbB4Ee" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Why you shouldn't add MCP to an arcade machine - Chris Price

The next talk, by Chris Price - one of my colleagues at Scott Logic, was quite avant-garde, requiring us to install a full-sized (and very heavy) arcade machine at the front of the event venue.

Given the title of the talk, as you can imagine, Chris has spent far too long connecting his arcade machine (which he has been rebuilding in his home workshop) to Claude Code via MCP, because .... why not? As you can imagine, a live demo, with poor event Wi-Fi, an AI model, MCP and a coin-pushing arcade machine is a recipe for fun, confusion and quite a bit of noise.

Chris' talk did have a serious note, which he introduced after exploring various different ways that an AI model could integrate with his arcade machine and bring it to life, from low-level, then high-level tools and finally an algorithmic (deterministic) solution.

The punchline to this is that:

> "If all you have is an AI budget, everything starts to look like an agent"

I couldn't agree more - our industry is currently trying to "AI all the things".

> "Don't incentivise AI utilisation. Incentivise solution fitness. Make it so that an option available to your teams is to make that final step to an algorithmic solution — if it makes sense in that particular application."

<iframe width="560" height="315" src="https://www.youtube.com/embed/Po2zBet6IMc?si=kcMjk1RTXWLzYHK9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Hard, honest, in progress: agentic development in the trenches - Richard Thorpe

Richard Thorpe is the head of Engineering at FE Fundinfo and has been taking the organisation on the journey towards agentic engineering. This talk is a candid account of 24 months of agentic adoption across a 200-developer financial services organisation.

This talk was packed with insights and stark statements, I'm going to find myself quoting Richard quite a bit going forwards. There were far too many nuggets for me to share in a brief summary, but the standouts for me were:

> "Build if you need it, but be prepared to throw it away"

Richard and his team jumped in early, possibly too early - when the technology was quite nascent, but they didn't regret it. While the technology they built was thrown away just months later, the impact it had on the people within the organisation was deep and long-lived.

> "They moved from thinking about AI as find-replace on steroids to understanding what agents could do"

Next up:

> "Don't run a pilot — jump in with both feet"

That's an interesting point and is counter to the approach of most organisations. The reason Richard gave was quite compelling:

> "This surfaces who can drive change. Unexpectedly, the champions turned out to be QA engineers and testers — historically pushed to the back of the queue."

I wholeheartedly agree, I have been surprised by who takes to this technology and who finds it a bit of a challenge. It is far from obvious.

Anyhow, watch the video, it's gold.

<iframe width="560" height="315" src="https://www.youtube.com/embed/PyfKUDcNxMo?si=FIcA6wUQYaOVP1cI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Vision for an AI-first Product Organisation - Chris Parsons 

Our final speaker for the day was Chris Parsons, who asked - if individuals are 2–3× faster but teams are barely faster at all, what does that tell us about organisational design?

Chris started by reflecting on the current paradox where individuals are faster, but organisations are not, pointing out that even at Anthropic, individual speed-ups of 10–20× translate to only ~60% faster at the organisational level. That's a fascinating point, and should be reassuring to those of us outside of Silicon Valley!

Digging into the root cause, Chris quoted Goldratt's Theory of Constraints. 

> "If we have made coding faster, yet in our organisations coding was not the bottleneck, then we are not improving the speed of our system — all we are doing is increasing queues somewhere else."

This had me nodding furiously, when introducing agentic engineering into organisations, the first thing we do is ask them about their current SDLC bottlenecks. 

Chris closed his talk by considering how our roles could shift, contrasting two paths:

 - **Hybridisation** — everyone takes on adjacent roles (devs make product decisions, designers prototype code, QAs write tests). Seems good but collapses into chaos: decisions made without customers, knowledge gaps, collaboration becomes the bottleneck, until you end up with "one-person teams" — which is, as Chris put it, "oxymoronic as well as being moronic."
 - **Amplification** — keep small, genuinely cross-functional teams; amplify each specialism with AI rather than dissolving the specialisms.

 <iframe width="560" height="315" src="https://www.youtube.com/embed/ozw2x2sWZgs?si=CGEY-YVITKCnnFNO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Panel Discussion 

And finally, the event wrapped up with a panel discussion based on audience questions. It came as no surprise that the top-voted question related to junior engineers, asking whether their jobs and career pathway is now at risk.

<iframe width="560" height="315" src="https://www.youtube.com/embed/NleLdtrgP-Y?si=D9nRzZlK1ybVB71D" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

I really enjoyed the event, it was worth all the toil in putting it together. Thanks to the Scott Logic Marketing team for their support, the speakers for their wonderful presentations and everyone who came along on the night.

