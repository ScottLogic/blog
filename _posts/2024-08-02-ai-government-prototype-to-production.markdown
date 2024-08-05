---
title: AI in Government – from prototype to production
date: 2024-08-02 09:04:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
- government
- ''
- Government
- digital government
- MLOPs
- productionising
- prototype
summary: Government departments are not alone in struggling to move artificial intelligence
  (AI) prototypes into production. Here, I reflect on some of the reasons for this
  and share some insights from our client work which I think point towards how the
  government can harness AI with greater confidence.
author: godds
image: "/uploads/AI%20in%20Govt.png"
---

Government departments are struggling to move artificial intelligence (AI) prototypes into production. But they’re not alone in this – I’ve seen economy-wide research (that I’m not allowed to cite, sorry!) indicating that most organisations are still at the investigation stage, a handful are at the piloting stage, and very few have deployed Generative AI (GenAI) in production.

In this blog, I’ll reflect on some of the reasons for this and share some insights from our client work which I think point towards how the government can harness AI with greater confidence.

## Fewer opportunities to ‘get it right’

In March this year, the National Audit Office (NAO) published the results of a survey on how effectively the government had set itself up to harness AI in providing public services. The context for this research was the requirement for all departments to create AI adoption plans by June of this year.

The survey received responses from 17 ministerial departments, 20 non-ministerial departments and 52 arm’s length bodies. [The NAO’s findings](https://www.nao.org.uk/reports/use-of-artificial-intelligence-in-government/) were that less AI was being deployed than expected. 37% of respondents had deployed AI, with typically one or two use cases per body. 70% were in the piloting or planning stages, with a median of four use cases per body.

As I’ve mentioned, this is actually not inconsistent with the rest of the economy. However, it’s also true that factors specific to the public sector explain some of the apparent caution.

This summer, we partnered with the [Institute for Government](https://www.instituteforgovernment.org.uk/) (IfG) to run a couple of private roundtable sessions exploring the opportunities and risks of harnessing AI in providing public services. The roundtables brought together senior representatives from central government, and stakeholder agencies and bodies. At one of these roundtables, a participant stated plainly that when it came to harnessing AI, the public sector had fewer opportunities to ‘get it right’ than the private sector.

Citizens quite reasonably expect a high degree of transparency and assurance that AI is being used ethically by the government. Added to this, there are AI use cases where public resistance will probably need to be overcome. AI-powered automated decision-making appears to be effective in areas such as medical diagnosis and legal decision-making; however, there are understandable concerns about this, not least in relation to questions of accountability. That said, resistance to automated decision-making is not universal; some teenagers felt more comfortable discussing their mental health with AI than with a human practitioner, as it was [deemed to be non-judgemental](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10876024/).

So, there are complex and nuanced questions for government departments to consider in where and how it harnesses AI to improve public services. However, the government also knows there’s an opportunity cost to impeding innovation that could save the public purse millions of pounds. So, what can it do to move forward?

At Scott Logic, we’ve been supporting clients to productionise AI and machine learning for some time. This experience has given us insights into the practical steps and cultural changes organisations can undertake to move AI-enhanced services into production safely and successfully. I’ll start with the practical ones.

## The territory is more charted than you think

You may have heard that software engineering with AI is different, and it is. At the core of traditional programming and testing was the concept that you could rely on a given input to produce a given output in a repeatable fashion. Not so with AI, given its non-deterministic nature. Productionising any software is a de-risking process, building confidence that it will operate within fixed parameters – so how does that process work with non-deterministic AI?

The answer is that some different approaches are needed, and they’re not habitual to most software engineers; however, standard approaches are beginning to emerge. Our engineers are gaining expertise in the new techniques required to build and test AI-enhanced software, and passing these practical insights on to our clients. And as I’ll explain, it’s not all uncharted territory.

In some instances, engineers require creativity to pioneer new ways of de-risking software. [Working with Blinqx](https://www.scottlogic.com/our-work/blinqx-building-genai-paralegal) to harness GenAI to the task of accelerating legal document analysis, our engineers commissioned document summaries from a human lawyer. These provided an initial control variable against which we could assess the accuracy of the GenAI’s outputs using a testing suite. They played a pivotal role in enabling us to fine-tune the GenAI to provide suitable results regardless of the document type.

In other instances, the productionising process is reassuringly familiar. For example, we’ve recently supported the Department for Work and Pensions to build some of its capability in Machine Learning Operations (MLOps) – a set of practices and tooling that automate the safe deployment, auditability, and maintenance of ML models. While some aspects of MLOps are obviously new, there’s a lot that’s in common with now-familiar DevOps practices, including version control, and Continuous Integration and Continuous Deployment pipelines.

Faced with the rapid rise of a groundbreaking and unfamiliar technology like GenAI, organisations can be forgiven for feeling initially uncertain about how, practically, to work with it. Based on our experience at Scott Logic, I would say that the government is in an excellent position to harness AI safely. The same organising, standardising, and agile ethos that shaped the Government Digital Service will apply equally well here. What’s new about working with AI will rapidly become customary, consensus will build around suitable and unsuitable use cases, and the same governance processes that underpinned the success of GOV.UK will do the same for government use of AI.

## Fostering a research culture

At one of the IfG roundtable sessions, there was a discussion about the importance of evaluating AI pilot projects and sharing lessons across government – and of having an evaluation framework in place from the beginning, so that failing pilots could be stopped as soon it was clear that they were not delivering the expected results.

This brings me to the point I wanted to make about cultural changes. [In this blog, my colleague James Heward](https://blog.scottlogic.com/2023/11/22/capabilities-to-deploy-ai-in-your-organisation.html) makes the case that AI projects have as much in common with research projects as traditional software engineering projects. As he says, “Research is concerned with asking and answering questions, whereas engineering is concerned with building things.” Failing to recognise this will create friction and misalignment between management and engineering teams when working on AI projects.

An agile, research-style culture should be fostered in which it’s possible to start fast and fail fast – one in which project evaluation is welcomed by teams as a way of distilling and sharing learnings, rather than feared as a certification of project failure.

Again, it seems to me that government departments are in a strong position to adopt this approach, endowed as they are with expert researchers. By taking the same multidisciplinary attitude set out by the [Service Standard](https://www.gov.uk/service-manual/service-standard) and [Service Manual](https://www.gov.uk/service-manual) that has underpinned the success of so many projects, government could foster the right culture to harness AI safely and successfully to the benefit of UK citizens.

## Our work in the public sector

If you’d like to know more about our work with government, visit our [Transforming the public sector](https://www.scottlogic.com/what-we-do/transforming-the-public-sector) page.