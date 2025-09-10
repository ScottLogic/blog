---
title: Reading The Gentle Singularity Through a Sustainability Lens
date: 2025-09-09 10:00:00 Z
categories:
- Sustainability
tags:
- Sustainability
- AI
- Data Centre
- Cloud
summary: Sam Altman says AI will cost as little as electricity—but what’s the real
  environmental impact of billions of queries a day? In this post I dig into the numbers
  from the blog post "The Gentle Singularity" and compare them to previous studies
  of the power and water use of AI systems.
author: jcamilleri
---

![Illustration of a microchip with the letters AI stamped on it]({{ site.github.url }}/uploads/ai-chip-illustration.jpg "Musing on The Gentle Singularity")

In June 2025, Sam Altman published [*The Gentle Singularity*](https://blog.samaltman.com/the-gentle-singularity), a post exploring the future of AI. Among his predictions, he claims:

> “As datacenter production gets automated, the cost of intelligence should eventually converge to near the cost of electricity.”

He also shares figures on the power and water used in an average ChatGPT query.

At first glance, these per-query figures seem reassuringly small. But without context, are they all that they seem?

In this post, we examine Altman’s claims using scientific literature and accepted sustainability frameworks to better understand their implications.

## The Gentle Singularity: A Snapshot

Altman’s post outlines several bold predictions:

- We’ve crossed the event horizon toward superintelligence. Agents that do real cognitive work arrived in 2025; insight-generating systems may emerge in 2026, and capable robots by 2027.
- Intelligence and energy will become abundant, driving massive gains in productivity and quality of life.
- He estimates an average ChatGPT query uses about **0.34 watt-hours (Wh)** and **0.000085 gallons of water**—roughly one fifteenth of a teaspoon.
- The goal is to scale safely, solve alignment, and make superintelligence cheap and widely available.

To better understand the environmental implications, let’s take a closer look at Altman’s estimates for a typical ChatGPT query.

## The Numbers Problem: Averages Without Assumptions

Altman writes:

> “The average query uses about 0.34 watt-hours, about what an oven would use in a little over one second, or a high-efficiency lightbulb would use in a couple of minutes.”

But what is an *average query*? This term is ambiguous. For example, [Hugging Face’s AI Energy Score](https://huggingface.co/AIEnergyScore) uses six different types of queries to assess model inference, from summarizing text to generating images. The energy usage varies significantly depending on the task.

So, is an average useful? On its own, probably not. We also don’t know how this average was calculated. Was it measured across real-world usage in production, or in a controlled test harness using predictable queries?

Another key factor is **where** the query was run. The same 0.34 Wh in a coal-powered region has a much higher carbon footprint than in a region powered by nuclear or renewables. This is called **carbon intensity** which is measured as CO₂ emissions per unit of electricity.

Is Altman’s number plausible? Yes, though it’s on the lower end. *How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference*, by [Jegham et al.](https://arxiv.org/abs/2505.09598), suggests a **median estimate of 0.42 Wh** for a short GPT-4o prompt. The paper also notes that **query batching** (processing multiple queries together) can significantly reduce energy per query, while longer prompts increase it.

|Source|Energy per Query (Wh)|Water per Query (ml)|
|---|---|---|
|Sam Altman (2025)|0.34|0.32|
|Jegham et al. (2025)|0.42|1.2|

![Bar Chart of reported energy use]({{ site.github.url }}/uploads/ai-query-energy-bar.svg "Bar Chart of reported energy use")

## Beyond Electricity: The Hidden Environmental Costs of AI

If we take a **lifecycle assessment (LCA)** approach, used in studies like *Estimating the Carbon Footprint of BLOOM* ([Luccioni et al.](https://arxiv.org/abs/2211.02001)) or the [Tech Carbon Standard (TCS)](https://www.techcarbonstandard.org/), we must consider more than just electricity.

Lifecycle assessment captures upstream and downstream impacts across air, water, and soil. For AI, this includes:

|Lifecycle Stage|Description|Environmental Impact Type|
|---|---|---|
|Model Training|Energy-intensive process|High electricity and water usage|
|Hardware Embodied Carbon|Manufacturing, transport, disposal of servers and GPUs|CO₂ emissions|
|Networking Equipment|Routers, switches, cables|CO₂ emissions|

For more detail, see TCS guidance on [data centre hardware](https://www.techcarbonstandard.org/impact-categories/upstream#data-centre-and-server-hardware), [networking](https://www.techcarbonstandard.org/impact-categories/upstream#networking-hardware), and [foundation models](https://www.techcarbonstandard.org/impact-categories/upstream#foundation-models).

> While this post focuses on AI-specific impacts, it's worth noting that the lack of visibility into data centre operations is a broader issue. Most providers, including those outside the AI space, offer limited transparency around infrastructure emissions, water usage, and lifecycle impacts. Addressing this industry-wide opacity is essential if we’re serious about sustainable digital infrastructure.

## Water Usage: What’s Counted and What’s Not

Altman quotes **0.000085 gallons of water per query**, or about **0.32 millilitres**. Expressing the figure in gallons rather than millilitres may visually downplay its size, as the formatting introduces more leading zeros.

This figure is also lower than expected. [Jegham et al.](https://arxiv.org/abs/2505.09598) estimate **1.2 ml per query**, assuming a short prompt under typical conditions — nearly four times Altman’s figure.

So, what accounts for this discrepancy? It likely comes down to **on-site vs off-site water usage**.

- **On-site water** is used directly at the data centre, mostly for cooling.
- **Off-site water** is used indirectly—primarily in generating the electricity that powers the data centre.

![Bar Chart of reported water use]({{ site.github.url }}/uploads/ai-query-water-bar.svg "Bar Chart of reported water use")

If a data centre reduces its on-site water usage by increasing power consumption, it may shift the burden to off-site water use. Lifecycle assessments aim to capture these hidden trade-offs.

## The Impact of Scale

Even if we accept Altman’s numbers, they look small until we scale them.

A [TechRadar article](https://www.techradar.com/pro/openai-says-it-has-proof-its-tools-are-making-workers-more-productive?utm_source=chatgpt.com) from July 2025 reports that OpenAI supports **2.5 billion messages per day** from **500 million users**.

Using Altman’s estimates:

- **Energy**: 0.34 Wh × 2.5 billion = **850 million Wh/day**  
  Equivalent to powering an average UK home at [8.5 kWh/day](https://www.ecoflow.com/uk/blog/how-many-watts-to-run-house)) **for 100 days**.
  
- **Water**: 0.000085 gallons × 2.5 billion = **72,250 gallons/day**  
  Enough to supply a four-person UK household at [118.9 gallons/day](https://www.cladco.co.uk/blog/post/uk-household-water-usage) for **approximately 1.7 years**.

## Conclusion: A Call for Transparency

None of this is to say that we shouldn't be using or embracing AI powered tools. Instead, this is a call to action for AI companies such as OpenAI, Mistral, Alphabet and Meta to produce an open, scientifically backed standard which openly discloses the environmental cost of training and using AI based technology.

Open metrics would allow developers and consumers to:

- Make informed decisions
- Employ strategies to minimise their environmental impact (for example by using services in regions with greener power generation, or using right sized models for their workload)
- Give AI service providers metrics to improve their environmental impact.

What we want to avoid is out of context data with no way to verify its methodology or understand the assumptions it is built on as this can lead to misunderstandings and poor decisions.
