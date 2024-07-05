---
title: Monzo Stand-in, a smarter approach to DORA
date: 2024-07-05 09:35:00 Z
categories:
- Cloud
tags:
- Cloud
- DORA
- Cassandra
- Kafka
- banking
- financial services
- Monzo
- Business Continuity Planning
- resilience
- Amazon Web Services
- Google Cloud Platform
- Microsoft Azure
- resilience strategies
summary: The impending Digital Operational Resilience Act (DORA) aims to strengthen
  the IT security of financial entities such as banks, insurance companies and investment
  firms across Europe. In this blog post, I share Monzo's smart, modern resilience
  strategy and look at why traditional resilience strategies put organisations at
  significant risk.
author: acarr
---

The impending [Digital Operational Resilience Act (DORA)](https://eur-lex.europa.eu/eli/reg/2022/2554/oj) aims to strengthen the IT security of financial entities such as banks, insurance companies and investment firms across Europe. While the regulations will standardise ICT risk management, business continuity, and incident response, they won’t recommend best practice resilience strategies that banks should adopt.

In this blog post, I want to share one such resilience strategy – Monzo’s – which I think is a very smart approach to DORA. But I’ll start with an overview of DORA and look at why traditional resilience strategies will put your organisation at significant reputational risk.

## DORA’s key pillars

The growing adoption of cloud technologies across financial services played a key role in DORA’s origins. In the days of on-premises hosting of banking systems, outages presented self-contained risks to the banks that suffered them. But we’re now in an era in which the big three cloud hyperscalers – Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP) – host critical infrastructure for banks across the globe. If one of those hyperscalers has a major outage, it could have a significant economic impact.

The key pillars of DORA are regulations covering ICT risk management, ICT third-party risk management, digital operational resilience testing, ICT-related incidents, information sharing, and oversight of critical third-party providers. The UK has also applied a high degree of focus on operational resilience in recent years, with the implementation of a [new 'Operational Resilience' regime](https://www.bankofengland.co.uk/prudential-regulation/publication/2021/march/operational-resilience-sop) in March 2022; the deadline for full implementation of the regime and fixing vulnerabilities is 31 March 2025.

## Traditional resilience strategies are no longer sufficient

Many companies have hinged their [Business Continuity Plans](https://www.investopedia.com/terms/b/business-continuity-planning.asp#:\~:text=Business%20continuity%20plans%20(BCPs)%20are,function%20quickly%20when%20disaster%20strikes.) (BCP) for Operational Resilience on backup/standby systems (or components), waiting for the worst to happen before being called into action. These traditional cold and warm standby systems are often slow (taking hours or days to operationalise, if very manual) and error-prone, with a risk of data loss. The regulators expect financial services companies to do more, and DORA is one of the key pieces of EU regulation that will enable them to impose penalties on those companies which fail to comply.

There are plenty of recent examples of significant outages, including [TSB fined £49m over a system outage](https://www.ft.com/content/b0f6a461-7314-42fd-b76b-7a134bd77fac), [HSBC being down for over 24 hours](https://www.bbc.co.uk/news/technology-67514068), and a [Barclays Payments Systems outage](https://www.bbc.co.uk/news/business-68671228). A lot has been written about why the TSB failure was so big, including [this excellent article](https://jonstevenshall.medium.com/lessons-from-the-tsb-failure-a-perfect-storm-of-waterfall-failures-4f4d2e789b35). Once the TSB go-live had occurred, it was quickly apparent that not all the required functionality had been thoroughly tested. In fact, TSB drove ahead with a migration date without any means of confirming whether all the functions were operating correctly once the switchover happened. As I’ll now go on to explain, if TSB had followed a similar approach to Monzo, it would have avoided the outage, the fine, and the reputational damage.

## Monzo's Live Alternate System: A game-changer

Due to their decentralised architecture, modern scale-out technologies like [Cassandra](https://cassandra.apache.org/_/index.html) and [Kafka](https://kafka.apache.org/) (when used correctly) can offer automatic failure handling and reduced downtime. They also reduce the need to switch manually to cold or warm backup systems.

But Monzo has gone further.

Its innovative strategy ([announced on a couple of LinkedIn posts](https://www.linkedin.com/posts/adlawson_for-the-past-few-months-a-small-number-of-activity-7196409975689068544-1fOS/)) involves running a live alternate system on a different cloud provider, continuously handling a portion of live traffic. This approach – called Monzo Stand-in – provides real-time monitoring and ensures seamless failover in case the primary provider has an outage or experiences significant service degradation. This removes the need for complex Business Continuity Processes (and all the costs involved in planning and running them), as the backup systems are being tested continuously as a first-class citizen in the production environment.

To do this, each day Monzo randomly selects a tiny group of customers to complete their tasks in the ‘emergency mode’, which offers core banking functionality (e.g. viewing your account, making bank transfers, moving money between accounts). This allows Monzo to test whether or not these tasks can be completed successfully in the alternate system, with any issues being flagged for resolution. In the event of Monzo’s primary cloud provider suffering an outage, the bank can rapidly scale up its alternate system and move customers across. This ensures smooth continuity of service without the need for manual technical intervention to reconfigure the system, and all the risks associated with that.

While implementing such a system requires careful planning and investment, the long-term benefits in terms of resilience and risk reduction are significant: reduced BCP tests, automated failure handling, and minimised downtime. The running costs can be very similar.  The traditional approach of having cold or warm standby systems would require complete replicas of all key systems, with charges building up continuously, regardless of whether those servers are being used. In Monzo’s live/live approach, you have pretty much the same number of servers, they are just all being used. So depending on exactly what technologies you use, the hardware costs can be comparable.

![Stand-in approach.jpg](/uploads/Stand-in%20approach.jpg)

## Conclusion

If TSB had followed a similar approach to Monzo, it could have started running a small amount of its customers’ data flow through the new system, while also running the same functions in the old system and comparing the outputs. The issues would have been highlighted quickly, allowing the customers to be moved back quickly to the old system until the issues were resolved.

Monzo's success story exemplifies how embracing modern IT practices, such as scale-out technologies and live alternate systems, can be a starting point to revolutionise resilience and streamline compliance with DORA and the UK PRA Operational Resilience regime. As the examples from TSB and HSBC demonstrate, manual processes and risk mitigation aren’t as good as automated checks and balances, which is built in to the Monzo approach.

It does require careful planning and investment to design in resilience from the outset, but the benefits are reduced risk, lower costs, and happier customers. And in the end, that is what DORA is all about.