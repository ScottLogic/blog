---
title: How to take incremental steps towards data democratisation
date: 2026-08-17 13:09:00 Z
categories:
- Data Engineering
- Artificial Intelligence
tags:
- data
- data democratisation
- Artificial Intelligence
- AI
- governance
- data products
- data platform
- agent factory
- Conway's Law
summary: Organisations increasingly recognise the value of making data more accessible,
  but concerns around control, risk and governance often stand in the way. In this
  post, I explore why data democratisation doesn't require organisations to sacrifice
  oversight, and how data products, platforms and agent factories can unlock innovation
  while maintaining trust, compliance and accountability.
author: ascotland
---

The promised benefits of AI-powered data democratisation are highly compelling. They include more innovation, faster decision-making, better customer outcomes, and reduced reliance on specialist teams. So, what’s stopping organisations from taking advantage of those benefits?

Frankly, it’s because the desire to unlock value is in tension with the need to maintain control. And this is an entirely rational position for organisations to take, especially those operating in highly regulated environments. However, in this blog post, I’m going to explain that it’s possible to maintain control *and* unlock the benefits of data democratisation. I’ll also set out the incremental steps you can take. But first, I’ll illustrate what democratising data might look like in Financial Services.

## What data democratisation might look like

One of the most attractive benefits of data democratisation is the idea of innovation emerging from unexpected places. Picture a Financial Analyst who notices rising operating costs. Right now, investigating this might require requests for information from multiple teams, the generation of new reports, or support from specialist analysts. In a democratised data environment, that Financial Analyst would be able to interrogate trusted organisational data directly, pursuing lines of enquiry that would hitherto have been too costly or time-consuming to explore. In this way, they might identify an unnoticed efficiency opportunity, a process improvement, or a new way of allocating resources.

However, this isn't only about giving people access to information outside their traditional remit. It can also transform how experts work within their own domains. Imagine an Asset Manager who wants to assess whether a newly listed company is suitable for a client's portfolio. Today, that information may be scattered across multiple internal systems, research tools, and external sources. In a democratised data environment, the Asset Manager could simply ask a question in natural language. AI agents would retrieve trusted information about the company, the client's risk profile and relevant market context, enabling the adviser to reach a recommendation far more quickly. As a result, they would be improving customer service while reducing costs.

## What’s standing in the way?

Put simply, what’s standing in the way of this enticing vision is that our data landscapes mirror the structure and processes of our organisations. This is not a new idea; it’s just that the prospect of data democratisation has thrown it into sharper relief than ever before.

You may have heard of [Conway’s Law](https://en.wikipedia.org/wiki/Conway%27s_law). Back in 1967, Melvin Conway explained that “Organisations which design systems \[...\] are constrained to produce designs which are copies of the communication structures of these organisations.” By extension, this means that an organisation’s systems and data inadvertently tend to reflect its internal silos. The result is fragmented views of customers, products and operations.

I’ve seen this play out throughout my career. Back in the 1990s and 2000s, there was the Spreadsheet Era, where you’d see the smartest developer on a trading desk being tasked with building risk calculation solutions in Excel, with data copied in batches from other systems to perform the calculation. All the knowledge of that system was siloed in the heads of one developer and one trader. In that era, critical data and business logic became scattered across locally useful tools, making it difficult to understand where information came from, whether it could be trusted, and who was responsible for it.

So, we moved into the Platform Era, where organisations focused on consolidating data into the smallest possible number of platforms and aiming towards a ‘single source of truth’. Data platforms, dashboards and reporting functions gave organisations better control, but there was still a fragmented landscape; you might find three different trading divisions with data siloed in separate systems. Ultimately, the platform era didn’t democratise access. Business users still relied on data specialists to retrieve and interpret information.

Now, in the Agentic Era, expectations have changed utterly. We no longer want to request a report; we want to get an answer to our question, and fast. Organisations are being compelled to resolve a tension they’ve been navigating for years: how to make data widely available without losing control, trust and accountability. This *is* possible, but it relies on changing how you think about your data.

## From silos to marketplaces

We’re all familiar with the existing model in the Platform Era. In broad terms, it’s a hierarchical one of departmental ownership, in which Finance owns finance data, Operations owns operations data, and so on. Data may be shared upon request, and efforts are sometimes made to integrate data sources. However, the instinctive way for organisations to exercise necessary control over data is to hold it within departmental silos. It’s Conway’s Law made manifest.

What if we were to reconceive of data, seeing it not as assets owned by departments, but as products owned by the whole organisation? We might then bring these data products together in a stewarded space where access is no longer determined by hierarchy but instead by policy, governance, and need. In other words, a marketplace.

As we all know, markets work precisely because they are governed. Participants understand the rules, trust the safeguards, and can exchange value within clear boundaries.

So, releasing data from departmental siloes is not a recipe for chaos. Instead, the goal is to replace arbitrary organisational barriers with guardrails based on business need, risk and compliance. Data remains governed, but it becomes discoverable and reusable by those who can create value from it ([see this blog post](https://blog.scottlogic.com/2026/08/12/unlocking-your-data-in-collaboration.html) by my colleague, Sam Perridge, for more on this topic).

## Incremental steps towards data democratisation

OK, so that’s a lot of theory, but you might well ask whether it’s achievable in practice. I can tell you that it is, and I’m beginning to see some clients adopting this approach. They recognise that the obstacles to democratising data are rarely technical alone. Technology still plays a critical role, but before data can flow through a marketplace, organisations must first decide who can participate, under what conditions, and what safeguards need to be in place.

To democratise data with agentic AI, what’s required is the introduction of three operating principles:

* **Data Products** – Organise data around user needs and outcomes, not organisational boundaries


* **Data Platform** – Enable access through governance and guardrails, not ownership and restriction


* **Agent Factory** – Encourage experimentation and innovation while retaining control and oversight

The word ‘product’ immediately evokes ideas of user need, and that’s what makes the **Data Product** principle so powerful. The starting point shifts from “Who owns the data and where is it held?” to “What are business users/our customers trying to achieve?” It also stops organisations from viewing data and AI as a technology problem; I’ve seen companies embark on large-scale programmes of data product creation by throwing the task “over the fence” to IT, which means that they’ve misunderstood the whole point of data products.

I’ve also seen organisations try to boil the ocean when working towards this goal, and that’s a mistake. The approach should be incremental. You don't need to redesign your entire data estate before seeing value. Instead, you can start with a specific user need or business outcome and create a data product that brings together trusted information, clear ownership, quality standards and governance around that outcome. Having demonstrated the data product’s value, you can build from there.

Once data is organised into products, you need a way to make those products available safely. This is where the data platform principle comes into play. A **Data Platform** provides the guardrails that allow wider access without creating a chaotic free-for-all. It’s this that creates the marketplace, governing who can access what, monitoring how data is used, and providing the transparency and auditability required in regulated environments. Importantly, this is not about replacing one set of barriers with another; done well, the guardrails are enablers, making broader access possible in the first place.

With trusted data products and appropriate guardrails in place, you can begin putting data in the hands of people and AI agents in new ways. This is where the **Agent Factory** principle becomes useful. Rather than building a single AI solution, an Agent Factory gives you the capability to experiment, prototype and scale agent use cases incrementally and safely. In this way, business users can explore new ideas and workflows rapidly, with successful concepts being brought into production within the controls established by the platform.

If Conway's Law explains how many organisations ended up with siloed data, these three principles provide a framework for how you move beyond that model.

## The future is openness with control

Looking to the future, I think organisations that successfully democratise data will innovate faster, lower operating costs, and create capacity for new products and services. Why am I so confident in this? It’s because we’ve seen this pattern before.

At Scott Logic, we were the technology partner that supported a household-name banking group to adopt Open Banking. The successful implementation of this initiative involved creating standardised access, introducing governance, building shared infrastructure, and enabling safe self-service. There was a transformation in how the bank thought about customer value, one in which the bank understood that it was no longer solely responsible for meeting customer needs. Instead, it cultivated an ecosystem of third-party businesses all dedicated to customer success. Meanwhile, within the bank, unexpected innovation emerged thanks entirely to the new shared infrastructure.

I’m confident that what happened before will happen again. When information that was previously trapped becomes safely portable, people start creating value in ways that no one ever anticipated.