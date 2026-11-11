---
title: Jev Is All You Need?
date: 2026-11-11 07:00:00 Z
categories:
- Artificial Intelligence
tags:
- AI
- Artificial Intelligence
- Decision Models
- Jev
- Doom
summary: TypeSafe AI's Jev produces decisions rather than tokens, and it has spawned a whole new class of 'decision models'. I look at what makes it different and show some practical use cases, as well as one more doomonstrative.
author: jstrong
image: "/jstrong/assets/jev-is-all-you-need/doom_4_jevs.webp"
---

Since the [introduction of Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) on the 15th of September, there has been boundless discussion and experimentation on its capabilities and potential use cases. I've been following the discourse since the start. Here, I'll look at what Jev is, whether it is just a case of good marketing, and whether it is the start of a new paradigm.

## What is Jev?

First thing to say: it's not an LLM. In fact, Jev does not output words (tokens) at all (though you can [make it chat](https://github.com/kyle-pena-nlp/jevchat/), if you really want). Instead, Jev outputs _decisions_ in a few forms:

- A Yes or a No (Noul)
- A choice from a fixed set of options
- A score, e.g. 1-5, Small-Medium-Large, a list of options with an ordering

Alongside these decisions, Jev directly outputs a probability for each. For a Noul, it's a probability of an affirmative answer. For a set of options, each choice gets a probability, all summing to 1 - this goes for score also. An extra value is also bundled alongside each decision - confidence (except Noul). The confidence value is not produced by the model itself, but is instead provided in the API response as a calculation based on the number of options and the probability values from the model - generally how spread out the probabilities are. Confidence tells you how certain the model is of its decisions.

The creators of Jev, [TypeSafe AI](https://typesafe.ai/), describe this as being an example of 'System One' thinking - that is, thinking that is fast and needs no effortful reasoning (the latter constitutes 'System Two' thinking which recent LLMs have been [getting better and better at](https://openai.com/index/navier-stokes-solution/)).

Whilst LLMs are able to solve longstanding problems in mathematics, are they not overkill for the 'smart if statement' which many applications desire? That question is the premise behind Jev, and part of why many people are so excited about its arrival.

### What makes it different?

Whilst TypeSafe AI has not revealed the exact architecture of Jev (they are keeping it "close to the chest" [per the CEO](https://news.ycombinator.com/item?id=49717558#:~:text=architecture%20is%20close%20to%20the%20chest%20for%20now)), there is plenty of speculation.

The first rumour is that transformers are still being used. A lot of people conflate transformers and LLMs, and whilst most LLMs use transformers, they are not the same thing. The transformer is the component introduced in the breakthrough 2017 paper ['Attention Is All You Need'](https://arxiv.org/pdf/1706.03762), which when scaled (this was done a few years later) showed emergent language understanding and output capabilities, which Jev appears to possess.

Secondly, unlike most frontier LLMs of the day, Jev is not autoregressive. Autoregression (AR) is the process by which language models output tokens: one at a time, after looking back over all the past tokens. AR is an inherently sequential, and therefore slow, process. Jev, however, outputs all its decisions in a single pass, in parallel. This means that its responses come back orders of magnitude faster than what is usually expected of modern AI (hundreds of milliseconds vs tens of seconds). It also means that output 'tokens' cost nothing!

Lastly, instead of RLHF (Reinforcement Learning from Human Feedback) through which foundation models are fine-tuned into instruction-following LLMs that aim to please people (or indeed RLAIF, Reinforcement Learning from Artificial Intelligence Feedback), Jev uses RLCD (Reinforcement Learning for Calibrated Decisions), whose aim is to provide reliable probabilities on outputs. This is much more suited to automation, where decisions should not depend on human preference.

## Why use Jev?

Once more: it's not an LLM. The answer to 'Why use Jev?' is much the same as 'What is Jev?' - it allows flexible, natural language inputs (and images [as of the 14th of October](https://typesafe.ai/blog/jev-1-14)) to result in inflexible, fixed outputs.

This is contrary to AI agents, whose flexibility is the selling point. But AI agents and Jev are targeting different use cases. Whilst an AI agent may be able to find an answer for you or complete a general task on your behalf, it will produce essay after essay whilst doing it, and take a relatively long time. Jev, however, sticking to three simple [primitives](https://docs.typesafe.ai/introduction#typesafe-primitives), can output quickly and in the guaranteed format you provide. Of late, the answer to many a problem has been 'throw an agent at it', or indeed 'throw more agents at it'. A novel concept such as Jev has broken this pattern and as such stands out amongst the crowd.

Whilst classification models have existed for years, including over text (sentiment classifier models, for example), none has had the level of generality which Jev appears to possess. Historically, a bespoke model with a bespoke dataset was trained for a bespoke task. This process can take a lot of effort and resources, even when such a model is only a small part of a larger application. Jev's ability to work out-of-the-box on a multitude of problems is its main selling point - all you need to do is call an API.

I think this combination of being different, and being general, is what has allowed Jev to gain such a following.

## Start of the Jeviverse

With the release of Jev has come an influx of similar solutions, generally termed 'decision models'. Here are but a few:

- [**SemIf**](https://openjev.com/): Formerly OpenJev, and standing for Semantic If, this was an early open-source Jev-like. This approach uses an open-weights LLM at its core but does not output token-by-token as usual. Instead, it normalises across the subset of the logits pertinent to your chosen options to produce probabilities (these probabilities are not synonymous with the calibrated confidence values output by Jev).
- [**Laya**](https://laya.convaiinnovations.com/): I first came across what would be Laya a couple of days after the Jev announcement, [on the LocalLLaMA subreddit](https://www.reddit.com/r/LocalLLaMA/comments/1wijo3e/i_literally_built_the_jev_architecture_one_year/). The post boiled down to claiming that TypeSafe AI had stolen the thunder from an idea they had a year ago, and lamenting the lack of support for individual contributors. A couple more days later, Laya arrived and was nigh immediately lauded as _the_ open-source Jev competitor. Laya has the same three primitives (choice, score, noul) and performs well in benchmarks compared directly to Jev. There is one big caveat: Laya is a base to build on top of and does not work 'zero-shot' (without any modification) on a wide variety of tasks (unless you want a model to do no better than random). It needs fine-tuning on a particular domain to compete with Jev.
- [**OpenAI Decisions API**](https://developers.openai.com/api/docs/guides/decisions): Announced on the 29th of September at the 2026 OpenAI DevDay, this appears to be a direct response by a frontier lab to the popularity of Jev. Sam Altman described it as being an "exciting speed update", which could answer in "a fraction of a second". He also detailed that it is a GPT Luna model with "a pre-defined set of options" to choose from - and that it is that limited choice which allows it to be "extremely fast".
- [**Cloudflare Clef**](https://blog.cloudflare.com/clef-decision-models/): Based on open-weights Qwen models, Cloudflare's entry into the fray was announced on the 1st of October. Clef and Clef-flash are based on Qwen3.8-27B and Qwen3.5-9B respectively and are free to download [from Hugging Face](https://huggingface.co/Cloudflare/clef).
- [**Microsoft-Decision-1**](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/): Microsoft has also joined in with its excitingly titled model. It's a post-train of Qwen3.5-9B, like Clef-flash, and does well on many benchmarks concerning both response quality and latency.
- [**Liquid AI LFM 3 d1 Family**](https://www.liquid.ai/blog/lfm3): Liquid AI is known for its smaller, yet performant, models. On the 7th of October they introduced the d1 family with d1-3B and d1-omni-600M, and on the 27th of October, with the introduction of LFM 3 (Liquid Foundation Model), they also delivered two more decision models - d1-2B which takes in text and images, and the omnimodal d1-Omni-2B.

Whilst Jev introduced the new decision model paradigm, its competitors' capabilities are not in any way deficient, and in fact, many surpass Jev in certain areas (at least as far as the benchmarks go).

## Showcase

### Text Classification

Classification models have been around for a while now, but they have usually needed either training from scratch or fine-tuning on a particular domain in order to be accurate, and in turn in any way useful. Unfortunately, for most developers in enterprise, a lack of time, data, and compute prevents producing a bespoke model for a particular task, let alone many tasks. As a result, Jev's out-of-the-box generality is very welcome. Classifying emails is a task which may appear to some to be at the peak of mundanity, but it is an oft-sought ability in enterprise applications - Jev excels here. Classifying an email into one of a number of categories with Jev is as simple as this:

~~~python
from typesafe_sdk import Choice, Score, TypeSafeClient

email = (
    "FINAL WARNING!!! Your account has been flagged for suspicious activity and "
    "will be PERMANENTLY DELETED in 24 hours. We are extremely disappointed you "
    "ignored our last 3 notices. Download the attached form and send us your "
    "bank details NOW or face legal action."
)

result = TypeSafeClient().system_one(
    state=email,
    questions={
        "category": Choice(
            instructions="What is this email about?",
            criteria={"billing": None, "technical": None, "sales": None, "spam": None, "other": None},
        ),
        "sentiment": Score(
            instructions="How does the sender feel?",
            criteria=["Negative", "Neutral", "Positive"],
        ),
    },
)

print(result.choices["category"].choice)  # "spam"
print(result.scores["sentiment"].score)   # e.g. 0.1, firmly negative
~~~

Notice that the above code does not just give a category for the email, it also discerns its sentiment at the very same time. In the past, you would have had to run two different models or make two API calls to get both answers.

### Agent Routing

Routing can supercharge an agent/harness by choosing the right model for the right moment. However, until now, the router has usually been another LLM indicating which agent is best-suited to a task - such limited categorisation was never the forte of LLMs, and nor should such a limited choice between a handful of options take multiple seconds to complete. The dedicated `choice` primitive and its fast output (without going back and forth 'wait what about this, but wait!') make Jev well-suited for this task.

![Example diagram showcasing possible workflow for agent delegation using Jev.]({{site.baseurl}}/jstrong/assets/jev-is-all-you-need/agent_router_diagram.webp)

### Expanding on Jev's Doomo

Now that we've covered 'useful' examples, let's try our luck with a DMDM - a Decision Model Death Match inspired by the [doomo](https://typesafe.ai/blog/introducing-system-one-models-and-jev#:~:text=the%20team%E2%80%99s%20favorites%3A-,Doom,-We%20love%20how) shown in TypeSafe's Jev announcement post.

<video controls muted playsinline preload="metadata" poster="{{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_4_jevs.webp" width="100%">
  <source src="{{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_4_jevs.mp4" type="video/mp4">
  4 Jev Models in 1v1v1v1
</video>

I couldn't find any code for the demo in the original Jev post, so the first task was to determine what was already out there that could help. Luckily, people have been tinkering with Doom for decades, and they have also been trying to get AI to play Doom well for years. The two main projects which made this possible were Freedoom and ViZDoom. Freedoom is a project which provides free replacements of the game data (such as levels, graphics, and sounds) to go with Doom's engine, whose source code id Software released under GPL (General Public License) in 1999. It is included with ViZDoom (which is itself based on ZDoom - too many Dooms to keep track of!) which is a platform designed to provide environments for machine learning and, in particular, reinforcement learning - all centred around Doom.

Instead of testing out custom RL-trained Doom models, as intended with ViZDoom, I wired up various 'brains' powered by decision models. Given the extensive information and labelling around game state provided by ViZDoom, describing to each model where it is and what it can see proved a smooth process. Every model got the same text description, with no screenshots. Pairing this with calls to OpenRouter, and putting together a workflow with choices and code to execute: we have Jev playing Doom.

The process was not without hiccups and the initial iteration played just about as poorly as random. However, with evolution of the workflow including the information provided and the choices given to the models, their behaviour started to resemble something sensical (though not championship-winning). The final workflow offered the models higher-level choices: a general goal such as `scout` and actions such as `walk_to_target` rather than `move_forward`.

And here is the workflow which each model ran through for every decision:

![Diagram showing simple steps of the workflow each 'player' follows in the Decision Model Death Match.]({{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_workflow_diagram.webp)

The following is an example of the 'situation report' each model is given as part of input 'state', not a prompt/instructions (frag refers to a kill, in Doom parlance):

~~~
Health 80, armor 25, ammo 42, frags 2, deaths 1.
Under attack: hit 0.4 s ago from your left (-20 health).
Visible:
- medikit: close, 120 units, 0° (dead ahead)
- enemy A: medium, 340 units, +25° (ahead left)
- shells: medium, 500 units, -60° (ahead right)
Remembered (out of view):
- enemy B: last seen 2.1 s ago, medium, ~600 units, -140° (behind right)
~~~

The models are quick - generally on the order of a few hundred milliseconds. That is fast in the context of AI/LLMs but still not quite quick enough for the constant decision-making of Doom gameplay.

You may also wonder how the game plays in real time or deals with delays and how this factors into which model 'wins'. This was considered from the off, and there are indeed two ways to play matches:

- **Fair** (turn-based): The game pauses every 4 game tics (in Doom, a tic is 1/35 of a second) for all models to make a decision, executes decisions, and then repeats. This mode allows for better evaluation of decision quality, as the models are not penalised for taking too long.
- **Speed** (real-time): The game itself runs as normal. Whilst a model decides, its character continues to execute its prior decision. If it takes over a second, its character becomes idle. This mode prioritises decision speed over quality.

![Visualisation of timelines comparing speed and fair mode. Fair mode has the game pause every 4 tics whilst models make their decisions. In speed mode, the game never stops and models which take over a second stand still.]({{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_modes_timeline.webp)

Jev playing Doom is itself interesting, but we've just about seen that before, albeit not multiplayer. So far, we've only seen Jev facing off against itself, but how will it fare against its competitors - or rather, its opponents? Next, we see which decision model comes out on top. In the matches below, the players are controlled by the following:

- Jev
- OpenAI GPT-6 Luna
- Microsoft-Decision-1
- Clef-flash

Below is a 2-minute match in speed mode:

<video controls muted playsinline preload="metadata" poster="{{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_speed.webp" width="100%">
  <source src="{{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_speed.mp4" type="video/mp4">
  Speed Mode Video
</video>

GPT-6 Luna got the most frags and is therefore the winner, but I can't say any of the models were particularly skilled (not unlike a usual multiplayer FPS lobby then!).

![Charts showcasing latency, kills, and deaths for each model across the course of the match in speed mode.]({{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_speed_lanes.webp)

Jev had the lowest and steadiest latency across the match, and was the only one not to time out. GPT-6 Luna started off strong with five of its eight frags in the first half. Microsoft-Decision-1 stuttered a bit at the start, with a couple of timeouts straightaway, but mostly kept a steady rhythm - albeit at a high latency. The stuttering of Clef-flash was worst in the first minute, but remained present late into the match (it timed out 17 times!) - likely contributing to its poor performance of 0 frags, and match-high 8 deaths.

Looking at the match and the scores alone is fine, but it can be hard to tell anything of the models' styles. The chart below shows how often each model picked each answer in the speed match:

![Charts showcasing proportion of choices made across the models in speed mode over the decision categories Goal, Fire, Movement, Look, Dodge.]({{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_speed_choices.webp)

Interestingly, GPT-6 Luna was the most aggressive, closing in on enemies half the time and backing off less than 1% of the time. In contrast, Microsoft-Decision-1 was the most cautious, with just over a third of its movement decisions being 'back off' and holding its ground much more than any other model.

Many of the stalls were down to the one-second timeout kicking in. How would things pan out without it? This is where fair mode comes in. Below is a 2-minute match in fair mode (the actual match took over 15 minutes, as the game waited for each model to answer, but the recording skipped the pauses):

<video controls muted playsinline preload="metadata" poster="{{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_fair.webp" width="100%">
  <source src="{{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_fair.mp4" type="video/mp4">
  Fair Mode Video
</video>

Once more, GPT-6 Luna is on top, and by some way. Only Luna's K/D (kill/death) ratio is over 1, though none of the models could be said to be particularly skilled.

![Charts showcasing latency, kills, and deaths for each model across the course of the match in fair mode.]({{site.baseurl}}/jstrong/assets/jev-is-all-you-need/doom_fair_lanes.webp)

You'll notice on this chart that there are many more points - this is due to the game waiting for each model to make a decision. Jev's steady latency continued into this match, though it bided its time and only scored frags in the second half. Microsoft-Decision-1 retained the highest latency this time round, but was steadier than last time - beaten only by Jev. Unfortunately, steady latency does not mean better play: its performance in the match was the worst, with it scoring the fewest frags. GPT-6 Luna got first blood and continued fragging, racking up six kills before being taken out (if only Doom had killstreaks). It added two more before the halfway mark, but the rest of the match saw it score but one lonely frag. Clef-flash had the most erratic latency figures, with many still above speed mode's one-second timeout (73 of the 895 decisions from Clef-flash took over one second!). Regardless, it went from 0 frags in speed mode to 4 in fair - which suggests its issue was not the quality of its decisions but their slowness.

After all that, I'm afraid the fun is over.

## So, is Jev all you need?

Jev is not an LLM. It will not replace LLMs entirely. However, it can fill a lot of roles which LLMs have been put into so far, in many of which an LLM is massively overkill for the complexity of the task. When Jev was released, the hype was so great that some thought it was the product of a coordinated marketing campaign. However, in my view, the fact that it has spawned an entirely new class of model, the decision model, speaks to its authenticity. Given the combination of their generality, speed, and cost, be it Jev or any other decision model, I foresee that they will prove useful in putting together smarter and swifter applications for end-users.

Harking back to the title, Jev isn't all you need, and neither are other decision models, but they're a non-negligible portion of what you need (that's not quite as catchy a title, though).
