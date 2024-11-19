---
title: AI in Government – the central role of data
date: 2024-08-08 13:22:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
- AI
- Data
- data architecture
- data governance
- Government
- ''
- government
- digital government
- government AI
- Government Digital Service
- MLOps
- event-driven architectures
summary: Data is important to every element of the safe and successful harnessing
  of AI. For the government, data challenges are not new, nor are they insurmountable.
  In this post, I’ll look at some of those challenges across the data lifecycle, and
  share insights from our recent work and conversations with government about practical
  ways forward.
author: godds
image: "/uploads/AI%20in%20Govt%20the%20central%20role%20of%20data.png"
---

You’ve probably heard that data is the foundation of AI – and that’s true. But it is also intrinsically important to every element of the safe and successful harnessing of AI.

For the government, data challenges are nothing new. Recent developments in AI have simply served to bring them to the fore again while introducing new challenges. However, the challenges are not insurmountable and AI itself could help to tackle some of them. In this post, I’ll look at some of those challenges across the data lifecycle, and share insights from our recent work and conversations with government about practical ways forward.

I’ll begin at the point in the lifecycle where data informs decision-making and service delivery.

## The importance of data governance

Most of the challenges at this stage concern the governance of AI and the data on which it’s trained. There’s great potential for AI to improve service delivery, but much of this will depend on training AI on citizen data. To secure public buy-in for these uses of AI, it’s incumbent on the government to be as transparent as possible.

In this regard, it was great to hear recently about the government being ahead of the curve. We recently partnered with the [Institute for Government](https://www.instituteforgovernment.org.uk/) (IfG) to run a couple of private roundtable sessions exploring the opportunities and risks of harnessing AI in providing public services. In one of these discussions, I learnt of the Department for Science, Innovation and Technology’s [Algorithmic Transparency Recording Standard](https://www.gov.uk/government/publications/algorithmic-transparency-template) and its [repository of algorithmic transparency records](https://www.gov.uk/algorithmic-transparency-records). Each of these records provides information on algorithmic tools used in decision-making, including who is responsible for the tool, the rationale behind it, and how data is being used.

Significant improvements in service delivery will be possible if the government can share data across and between departments. There’s a technical aspect to this, but it’s not a deeply challenging one. Data governance is the real challenge; however, there’s cause for optimism stemming from one of the most trying times of our lives – the COVID-19 pandemic. As we learnt from a previous project partnering with the IfG on [Data sharing during coronavirus](https://www.scottlogic.com/data-sharing-in-government), the legal instruments exist to enable data sharing, and it’s possible to win hearts and minds when the public benefit of data sharing is clearly articulated. My colleague Jess McEvoy, a former Senior Civil Servant, writes compellingly about this [in a blog sharing her experiences](https://blog.scottlogic.com/2023/01/24/why-rapid-collaboration-needs-careful-preparation.html) of leading the rapid implementation of the Clinically Extremely Vulnerable People Service. At Scott Logic, we were proud to offer [pro bono support to NHS Digital](https://www.scottlogic.com/our-work/nhs-digital-data-driven-care-covid-19) to establish the Shielded Patient List that fed into this service, drawing together records and datasets from diverse sources.

At the IfG roundtables, another topic ultimately relating to governance and data concerned the limits of delegation to AI. In non-trivial use cases, the consensus was that there would be a point in any process where human review and decision-making would be required. A thought-provoking real example was shared of a government body that declined to fully automate a data processing use case because the error rate was not zero, even though the human error rate was significantly higher. Should we be holding digital technology to such higher expectations?!

What’s reassuring is that in all of these cases, accountability remains of central importance to the government – whether in terms of transparency around algorithms and data, how and why data is shared, or who ultimately makes decisions. You can expose AI and a human to the same data in delivering a public service, but only one of them can be held accountable.

## Data as the foundation of AI

Looking now at the foundations, it’s fair to say that across government, some foundations are older than others. The challenge of legacy IT is significant and real, and it can affect the accessibility and quality of data available to train AI-enhanced services. However, as I said before, these challenges are not insurmountable. New technologies are enabling departments to make small, targeted investments to unlock data from yesterday’s systems to meet today’s objectives.

We worked with a central government department to improve its citizen-facing services by implementing an event-driven architecture around its legacy data store. Avoiding the significant expense and time required to replace the legacy system, our solution wrapped a modern architecture around the old one and enabled a shift to data streaming. With this in place, updates to citizen data by the department’s customer-facing teams could be propagated across all systems in real-time – something that was impossible with the legacy system. In this way, departments and public sector bodies can take an incremental and iterative approach to remove obstacles presented by legacy IT; once a proven AI-enhanced prototype is ready to move into production, legacy impediments can be targeted and overcome in non-destructive ways.

The public sector is laying the data foundations of AI in other ways. [FAIR principles](https://www.go-fair.org/fair-principles/) are enshrined in the [National Data Strategy](https://www.gov.uk/government/publications/national-data-strategy-mission-1-policy-framework-unlocking-the-value-of-data-across-the-economy/national-data-strategy-mission-1-policy-framework-unlocking-the-value-of-data-across-the-economy#foundations), committing departments to make data Findable, Accessible, Interoperable, and Reusable. This will provide the technical underpinnings for data sharing across government, enhancing the potential for AI trained on that data to make public service improvements. AI itself can assist the process – extracting, harmonising and managing metadata across government departments, resulting in better contextualised training data for AI models.

We talk of data as the foundation of AI as though it remains static and stable. This is not the case. Once an AI-enhanced service is in operation, it will constantly be exposed to new data, impacting the accuracy and reliability of its outputs. That’s where Machine Learning Operations (MLOps) comes in – an evolution of DevOps practices and tooling that automates the safe deployment, auditability, and maintenance of ML models. With MLOps, it’s possible to run a live AI-enhanced service while comparing its outputs with several ‘incubating’ models in parallel, swapping out the live model once its reliability declines. We’ve recently supported the DWP in building some of its capability to this end.

While the government appears, on the surface, to face overwhelming challenges in marshalling its data to lay the foundations for AI, I’m hopeful. We see plenty of evidence of departments taking strategic approaches to data – adopting agile approaches to legacy modernisation and using cutting-edge practices for service operation – and at Scott Logic, we’re proud to support them in these endeavours.

## Our work in the public sector

If you’d like to know more about our work with government, visit our [Transforming the public sector](https://www.scottlogic.com/what-we-do/transforming-the-public-sector) page.