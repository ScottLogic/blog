---
title: 'GLM-5.2: Considerations for enterprise teams starting out with open-weight models'
date: 2026-07-08 10:00:00 Z
categories:
- Artificial Intelligence
summary: "Setting yourself up to try out open-weight models for agentic development isn’t difficult, but it isn’t as straightforward as downloading a coding agent from one of the handful of well-known AI vendors. In preparation for the latest round of our AI productivity experiments, we've recently been through this process. Read on for the choices we made, the considerations at play, and what made our situation unusual."
author: rwilliams
contributors:
- cprice
---

Setting yourself up to try out open-weight models for agentic development isn’t difficult, but it isn’t as straightforward as downloading a coding agent from one of the handful of well-known AI vendors. In preparation for the latest round of our AI productivity experiments, we've recently been through this process. Read on for the choices we made, the considerations at play, and what made our situation unusual.

## Our AI experiments

Our small team is undertaking a series of A/B tests in which developers use different AI development models/tools to complete tasks. These are pre-selected issues from a different open source project for each round of the experiment. Through quantitative and qualitative measures, we seek to capture a well rounded picture of using these tools on real work \- not benchmarks nor ad-hoc trials.

## The open-weight contestant

With the eagerly awaited open-weight vs. Claude Code round of the experiment nearing, we set out to pick the things we needed for an open-weight agentic developer setup.

The key parts we knew we needed from the outset were:

1. The model  
2. How and where to run the model  
3. The coding agent software

## Model

Going into this selection, we identified two universal considerations:

1. Likely competitiveness against frontier commercial models  
2. Practicalities of running the model for the experiment \- locally, or hosted

“Open-weight” models are sometimes conflated with “local” models \- which to be correct and precise, are open-weight models that are small enough to run on a developer’s own high specification computer. We quickly ruled those out due to benchmark results showing them to be less capable than even GPT-5 Mini (which we’ve previously found to be poor).

We shortlisted the top open-weight models according to benchmarks, and spent a couple of hours ad-hoc trialling them: DeepSeek V4 Flash & Pro, GLM-5.2, and Kimi K-2.6. All appeared to be adequately capable. Our final choice of GLM-5.2 was swayed by:

1. Seen to be more capable than DeepSeek V4 Pro on challenging tasks we were familiar with from previous rounds of the experiment.  
2. Seen to ask pertinent questions during task planning, where other models would either not ask, or not even realise there was an ambiguity or a choice to be made.  
3. Better performance on benchmarks, indicating higher capability.

All the shortlisted models were from top Chinese labs. Those available from US/EU labs were not near competitive on benchmarks \- Google’s Gemma, OpenAI’s gpt-oss, Meta’s Llama, nor Mistral (France).

## Model hosting

As we would be working on open-source projects for the experiment, we had considerable freedom on this aspect that many real use cases wouldn’t have. The only thing we ruled out up front was buying or renting our own hardware to run the model \- we wanted a convenient “model as a service”, just like is provided by the well-known AI labs via their APIs.

None of the usual big name providers (e.g. AWS, Azure, Cloudflare) offered our chosen model, although some do offer older versions of various shortlisted ones (e.g. GLM-5, DeepSeek V3.2). For organisations who typically prefer major suppliers they already have relationships with, and who can provision in preferred countries to meet data sovereignty and legal requirements, this will likely be a sticking point. However, for our experiment, it’s of no concern, and something we have to accept to work with a competitive model.

Whilst we expect this situation to improve in future, for now, GLM-5.2 is currently only hosted by relatively small companies, based in the US, China, and Singapore. Rather than creating accounts directly with each of these smaller companies, you can access models hosted by each of these companies via centralised marketplaces instead.

OpenRouter is one such marketplace for hosted models, where hosting companies (providers) offer many different models. The “router” part routes your model calls to a suitable provider based on some criteria, which you can customise. You pay OpenRouter, which takes a small cut, and pays the underlying hosting company for the actual model calls. Having used it for experimenting with different models, we decided it was sufficient for use in the actual experiment too \- purely out of practical convenience. We created an organisation, topped up our credits, and invited our team colleagues.

We’re less sure that a model routing service/marketplace will form part of most organisations’ settled approach to open-weight models, so we decided to partially align to that direction by selecting a single underlying provider on OpenRouter. For similar reasons, we also opted for a provider which did not make use of submitted data for model training.

To make sure that we were testing the model at its best, not degraded by poor hosting, we discounted various providers for:

* Scaled down provision of the model (e.g. reduced context size)  
* Quantization undisclosed or fp4 \- reducing model capability  
* No pricing for caching, possibly indicating the lack thereof  
* Excess latency (time to first token) compared to peers  
* Low throughput (tokens per second) compared to peers  
* Uptime below 99.0%

We also ruled out Z.ai \- the company behind the model itself, as we couldn’t be sure the model provided was exactly the same one made available as open-weight to the rest of the world.

From less than a handful remaining, we made a rough decision of the provider based on it having a higher cache hit rate, and slightly better performance (latency, throughput, uptime). Given the already considerable step down in cost to this market from frontier US labs, cost was not a factor within reason.

So as we touched on earlier with local models too, selection of model and choices of how and where to host it cannot usually be made separately. Depending on availability, one might force the other. We venture that for many organisations, availability of suitable hosting will drive which models can be used. For example, if we needed to host on AWS in Europe, at the moment we’d need to make do with GLM-5 rather than 5.2.

## Coding agent

The choice of coding agent runtime is the final one we need to make. While some providers of open-weight models have launched their own recently, most of the buzz is in the open source space. The main flavours appear to be terminal based UIs (TUI) and plugins for IDEs. The former are constrained in user experience capability and disjointment from the IDE, while the latter (particularly in VS Code) seem to struggle with buggy integrations.

There is also the possibility of using Claude Code with non-Anthropic models, by setting some environment variables. While this did work, it wasn’t always reliable, and we envisaged this capability could be withdrawn at any point. Some coding agents have tailored system prompts for different models, and we expect this would be the case for Claude Code too \- possibly making it less effective when used with other models.

We shortlisted some well known ones to briefly trial: [Pi](https://pi.dev/), [OpenCode](https://opencode.ai/) and [Cline](https://client.bot/). OpenCode was our agent of choice. Pi’s barebones offering would require additional effort to build a functional harness, and seemed a more niche offering. Cline had a couple of issues/omissions and bugs we ran into while trialling.

## Future

We assembled a setup fit for conducting the next round of our experiment \- using GLM-5.2, OpenRouter with a single underlying provider, and OpenCode. Again, outside of the experiment there would be more considerations and constraints to contend with when coming up with a setup for doing real work.

Of our trio of selections (model, hosting, coding agent runtime), it’s the hosting that seems most short-lived and in need of solutions \- particularly when looked at from a typical organisation technology selection perspective (i.e. not an experiment).

On the models front, the lack of competitive options from outside China is notable.

The coding agent runtimes ecosystem is evolving at a frenetic pace, attributable to the relatively low barrier to entry when compared to the other areas. Like most popular developer tooling, there are likely to be open-source winners in the long-term but at this stage it’s impossible to call when they will or whether they have already emerged.

The space around agentic software development with open-weight models is moving fast. In the near future we expect more hosting options for GLM-5.2 and other top models, and could see new models, coding agent innovations, or regulatory movements.

To stay up-to-date with our experiment, its results and our recommendations you can follow along on this blog or our social media channels. If you’re looking for help demonstrating the value of AI-augmented delivery in your organisation, check out our case studies for real-world examples of quantifiable returns:

* [Scopevisio: From migration risk to AI-accelerated delivery](https://www.scottlogic.com/our-work/scopevisio-ai-accelerated-delivery)
* [Yuki: Making a complex migration viable with AI](https://www.scottlogic.com/our-work/yuki-making-migration-viable-with-ai)
