---
title: Conscientious Computing - Integrating Sustainability into Non-Functional Requirements
date: 2024-05-17 12:45:00 Z
categories:
- Sustainability
tags:
- Sustainability
- NFRs
summary: Architects and engineers are used to setting NFRs around availability and security but not carbon emissions. In this blog I look at why we should think about sustainability NFRs when designing software
author: nbarber
---


As part of our [Conscientious Computing series](https://blog.scottlogic.com/2023/12/19/green-software-podcasts-what-the-team-are-listening-to-right-now.html), we've explored the importance of considering the environmental impact of software development. In this instalment, we'll focus on the role of non-functional requirements (NFRs) in creating sustainable software solutions. 

As the world focuses more on the action needed to solve the climate crisis and with the ICT sector being responsible for [3-4% of global CO2 emissions](https://www.bcg.com/press/24june2021-telco-sector-game-changer-sustainability-shrinking-carbon-footprints), now is the time that development teams need to add sustainability and low carbon to their NFRs and here we’ll look at the considerations needed and some examples.  

Non-Functional Requirements (NFRs) are aspects of software that define quality characteristics rather than specific functionality. Unlike functional requirements that dictate what the system must do, NFRs define how the system must perform under certain conditions. For example:

 * the sign-in page should render in <50ms and be secure against CSRF attacks
 * 95% of requests should be served in <= 150ms. 
 * Service A should be built with adaptability in mind such that we could roll out into a new market in 4 weeks. 

### Why aren't sustainability NFRs prioritised today
Traditionally carbon emissions and environmental impact have not been prioritised as NFRs and there's a few possible reasons for this. One could be that the costs are generally someone else’s problem in the sense that we don’t personally suffer the effects of our service’s emissions.  Contrast with the case where your API is responding too slowly, and the engineering team will get a callout. Over time we expect development teams to face more pressure to keep emissions as low as possible as is now happening with cloud costs and the rise of FinOps. 

Another reason may be that setting sustainability NFRs isn't simple. In short, it's hard to say in advance that software service A should generate X emissions per month, because every application is slightly different and has different usage patterns. It’s not as simple as something like availability with a set of standard achievable values like (99%, 99.5%, 99.9%, ….) that is well understood. 

Like cost, carbon emissions will very much depend on other NFRs like performance and availability. There is a mentality where we set those other NFRs as independent variables and a cost, financial or carbon, results as a dependent variable. We need to move to a mentality where carbon is weighed up independently against all the other NFRs. If we’re to deliver truly sustainable software solutions, we need to incorporate low carbon and sustainability attributes into the same conversations and processes where we consider performance, security, and usability.  

### Tradeoffs 
NFRs are often interdependent and it's generally understood that improving one area can require compromises in others. For example, increasing security may decrease usability or performance. Development and business decisions are made based on requirements and priorities. As an example, the decision of whether to spend development resources making the system more reliable or more performant requires priorities to be considered and stakeholders to agree what is more beneficial. This is why it is essential to consciously include environmental sustainability as early as possible. By stating low carbon emissions as a priority NFR alongside low latency for example, development teams can make informed decisions to get the optimal mix of attributes where latency is acceptable but not creating unnecessary emissions.   

Another consideration for NFRs is the implications of setting them, it's essential to avoid unrealistic targets that could exponentially increase development effort or complexity. Setting a system's target carbon emissions too aggressively could make the system much harder to build and run. It may be quite possible to reduce carbon emissions from 10g CO2e emitted per API to 5g CO2e call but to reduce further to 3g CO2e could be more than twice the development effort.  Appropriate low carbon NFR targets should motivate teams to minimise carbon emissions without compromising other critical qualities.  

### Collaboration
The final requirement I’ll mention for establishing low carbon is collaboration between all stakeholders. Business leaders, developers, operations teams, and end users may have differing perspectives on the acceptable trade-offs between sustainability, functionality, performance, and cost. By bringing together representatives from all stakeholder groups early in requirements planning, priorities can be negotiated to find an optimal balance. For example, developers may push for extremely low emissions targets, while business leaders focus on minimizing short-term costs. End users want both environmental sustainability and high performance. Through collaborative prioritisation, compromise targets can be set, focusing first on easy high-impact emission reductions before making carbon targets more aggressive. 


<img alt="Diagram of overlapping sustainability goals with economically viable, sustainable e.g. managed tech debt and then green sustainability including water and carbon" src="{{ site.github.url }}/nbarber/assets/sustainability_nfrs/sustainabilty_development_goals.jpg" title="" style="display: block; margin: 0 auto; padding: 1rem 0;" />

Collaboration between all stakeholders is crucial for establishing sustainability NFRs. It’s key this occurs pragmatically considering business realities alongside environmental ideals. No single group has the full picture - it requires understanding differing motivations and constraints to find common ground. Joint ownership of priorities allows the sustainability NFRs to be set ambitiously but realistically. Teams can then work together, confident that targets reflect both ethical ideals and practical limitations. Consistent collaboration ensures priorities dynamically adapt as capabilities evolve. 

In future blog posts, we'll discuss how to set specific NFRs that help with sustainability including carbon, such as: 

* Server utilisation - Ensuring servers are utilised at >50%, reducing embodied and operational carbon emissions. 
* Carbon intensity - Setting a limit for the carbon intensity of the electricity a data centre or cloud region uses, such as <200 gCO2e/kWh. 
* Emissions efficiency - That is, the rate of emissions a system generates per request, for example a system generates <x gCO2e per request. 

