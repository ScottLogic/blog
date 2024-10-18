---
title: 'Sustainability in Agile: How Scrum Roles Can Drive Greener Practices'
date: 2024-10-21 11:00:00 Z
categories:
- Sustainability
tags:
- Sustainability
- Agile
summary: A look at how agile practices can be used to drive sustainable software development 
 with a focus on how each role can contribute to lowering their product's carbon emissions.
author: jcamilleri
image: ""
---
# Introduction

The intersection of sustainability and software development is gaining attention, with increasing awareness of the environmental impact of IT practices. A recent blog by [Pini Reznik](https://blog.re-cinq.com/posts/enviromental-cost-of-agile/) discusses the environmental impact of Agile software development, highlighting how its emphasis on speed and adaptability often leads to resource waste, particularly in cloud computing. Essentially, we have a tendency to want to ship as early as possible without optimising the product. This leads to requiring more hardware resources to run and thus higher running costs and carbon emissions.
They suggest that adopting Lean software development practices aligns well with sustainability goals. There is some great advice and insight in the article, but not all teams can choose their methodology. For them, an Agile approach such as Scrum may be better for a lot of their work, but that does not mean they should ignore sustainability or their impact on the environment.

In this article we explore how sustainability fits in with Scrum software development and how the different Scrum roles of Product Owner, Scrum Master and Team Member can build sustainability into their workflow.

# Always mind your surroundings

An old team leader of mine would often quote Liam Neeson from Batman Begins when reviewing code – “Always mind your surroundings.” His point was that you must consider the wider system when making changes, not just focus on the small part that you are working on. This is even more true with sustainable technology. Before we look at any processes that incorporate sustainability goals, we need to know what context we are working in. Without this context, it is hard to make the right choices. This is where Scott Logic’s [Technology Carbon Standard](https://www.techcarbonstandard.org/) or TCS for short, a proposed method for analysing an organisation’s technology carbon footprint, is useful.

The TCS allows organizations to categorise the emissions of their IT estate. Mapping the IT estate like this allows two things:

1. Conversations between different stakeholders and specialists using the mapped TCS as a common frame of reference.
2. Application of different estimation and measurement techniques, which are sign posted in the TCS, to make emissions reportable and transparent.

By building upon this transparency, each traditional Scrum role—Product Owner, Scrum Master, and Team Member—can contribute to sustainable development practices by integrating environmentally conscious decisions into their workflows.

During each sprint, the team works together to make changes to the system, optimising their code as they go. Individually, these optimisations can make minor differences to your operational emissions. Over time, these changes to improve performance will have a culminative impact on your operational environment, as detailed below. The best part is that these changes often come with extra benefits in the form of reduced running costs, and software that runs faster and more securely. Depending on the change, the optimisation process can be tackled as an epic in its own right, a user story that impacts a specific feature, or part of the standard development process such as refactoring and testing.

## Mapping The Technology Estate

The first step in developing an understanding of the context of your technical environment is to map the estate. Identify what is important and needs to be measured. The TCS provides categories to help you do this.

![Technology Carbon Standard categories]({{site.github.url}}/jcamilleri/assets/TCSCategories.PNG 'Technology Carbon Standard categories')

The categories are very flexible and designed to be scalable to the needs of a team. It can take in the entire IT estate of a business or zoom into a specific project. 

At the project level, you just need to focus on the items you want in scope for your team. Using the Upstream Emissions category (U), and Category O of Operational Emissions, you can track the hardware that your team uses to determine the teams own carbon emissions while developing the software. These categories can also be used if you have on premises server hardware that you use for development, testing or in production environments.

Category C is used for cloud environments, software as a service and other IT services that you do not host yourself. If you are unsure what category to put a system into, ask if you pay the electricity bill for that system, or if you pay a third party for access to that system. If you are paying the electricity bill, it is classed as a direct emission (category O). Otherwise, it is indirect (category C).

Your systems also have an impact downstream which are mapped to Category D in the TCS:

- the minimum specification of your software drives hardware sales and therefore old hardware disposal. 
- software performance and network traffic use the resources of your consumers, and the infrastructure used to reach them. 

Once you have finished mapping your project or tech estate, you should have a table that looks something like this:

| Emissions Category | Items |
| -------------------|-------|
| Software |Wordpress Sites, Zoom, Chrome, Firefox, Jira |
| Employee Hardware |Team Laptops, Monitors, Printer |
| Networking and Infrastructure Hardware | Out of scope for this project |
| Servers and Storage Hardware | Linux dev server |
| Employee Devices | Team Laptops, Monitors, Printer |
| Networking and Infrastructure | Out of scope for this project |
| Servers and Storage | Linux dev server| 
| Generators (Cat G) | None |
| Cloud Services | AWS Services |
| SaaS | GitHub, NPM |
| Managed Services | N/A |
| End-User Devices | End users accessing www.example.com via web browser, Android and iOS apps |
| Network Data Transfer | www.example.com, api.example.com |
| Downstream Infrastructure | N/A |

## Measuring the Estate

A full discussion on how to measure the estate is beyond the scope of this article. As a starting point you should take into account that not everything can be measured. When you cannot measure something then you should consider if there is an appropriate proxy measurement. For example, you may not be able to measure the exact power consumption of a process, but you may be able to measure the CPU usage. An increase in CPU usage is normally synonyms with an increased power consumption, so that would make an appropriate proxy. If a good proxy cannot be found, then you may be able to use a heuristic estimate by modelling the domain you wish to estimate. The [SWD]( https://sustainablewebdesign.org/estimating-digital-emissions/) method for estimating the carbon emission of websites and using the monthly cost of cloud computing are examples of heuristic estimates. Something is better than nothing but be careful with less accurate measurement techniques as they can lead to optimising the wrong thing. For example, some methods emphasise page weight over number of calls made by the page – which is more valuable to optimise depends on your system and users – the wider context, if you will.

## Be Transparent

Once you have mapped out and measured or at least estimated the carbon emissions of your project, find a way to make them available, ideally via a dashboard. There are a few tools that can assist you in this regard:

- [Cloud Carbon Footprint]( https://www.cloudcarbonfootprint.org/): In addition to the dashboards provided by your cloud provider, the CCF tool can be used to get up to date metrics from a variety of cloud providers to create a dashboard for your carbon emissions. Installation can be a little involved, but once it is set up, it is quite easy to use.
- [Scaphandre](https://github.com/hubblo-org/scaphandre): This is an open-source utility for measuring the energy utilisation of processes on a server. It can be configured to output the data to any target such as Prometheus. When no other data is available (such as in an On Prem environment), CPU utilisation, which Scaphandre measures, can be a good proxy for carbon emissions. Higher CPU usage is normally a good indicator of higher power usage, which means increased carbon emissions.
- [Green Metrics Tool](https://github.com/green-coding-solutions/green-metrics-tool): This tool from Green Coding Berlin is a great benchmarking tool. Again, getting it set up can be a little involved, and you need to be able to run your application in a dockerised environment. However, once it is set up it gives very professionally researched metrics back in a very nicely presented dashboard. It is best treated in a comparable way to a performance benchmarking tool. Rather than telling you your carbon emissions in your production environment, you run the tool in a lab environment. You can build this yourself or pay for access to Green Coding Berlin’s platform (which may be cheaper and certainly easier overall). Once you have your benchmark measurement, you should re-run the tool after each sprint. From that you can see if your carbon emissions have changed since the last product increment.
- [CO2.js]( https://www.thegreenwebfoundation.org/co2-js/): CO2.js is a useful library for estimating the emissions of a website or other app.
- [Firefox Profiler]( https://www.thegreenwebfoundation.org/news/carbon-emissions-in-browser-devtools-firefox-profiler-and-co2-js/): Firefox profiler can also be used to measure and estimate the carbon footprint of a web page.

These are just a few of the tools available right now and there are more appearing every day.

# How Scrum Roles Can Mitigate Carbon Emissions

Having talked about how we map and measure the carbon emissions of the project, it is down to the team to start reducing carbon emissions. Each role has their part to play.

## If you are the Product Owner

As a Product Owner, you are already responsible for defining the product’s features, liaising with stakeholders, and prioritising the backlog.

- *Feature Prioritization*: Try to prioritize features that reduce the product's environmental footprint, such as optimising code efficiency or reducing server load. Remember, there are often multiple advantages to these features, making the cost of running the software lower and potentially more secure as well as reducing their carbon footprint. Look for these synergies and go for those features first.
- *Estimation*: Encourage team members to incorporate sustainable considerations into their estimates. Help them to carve out time to craft high quality software – by doing so, you can help reduce your running costs and the total cost of ownership of the system, by allowing time to keep systems well designed and efficient.
- *Lifecycle Thinking*: Consider the entire product lifecycle, focusing on features that enhance durability and reduce waste.

You can integrate the sustainability metrics discussed above into decision-making, ensuring that carbon reduction is a key factor in planning and prioritization. For example, if you had a user story to use a smaller cloud appliance, or even eliminate it entirely, prioritising it would reflect in the cloud emissions metrics.
 

## If you are the Scrum Master

As the Scrum Master you ensure the team adheres to Agile principles and facilitates processes.

- *Process Optimisation*: You can identify and eliminate wasteful practices in the development process, such as unnecessary meetings or redundant testing, that consume excessive energy.
- *Green Agile Practices*: Promote the use of energy-efficient tools and methods and ensure that sustainability is part of the team’s definition of done.
- *Integrating Technology Carbon Standard Practices*: The Scrum Master can educate the team on the Technology Carbon Standard, embedding it into the team's continuous improvement practices.

## If you are a Team Member

As team members, you will be the ones making these smaller changes that will add up in the larger picture, coordinated by your Product Owner. How you do that will depend on your speciality. While we cannot cover all possible specialisms here, we can look at some of the most common.

### As a Software Developer

- *Efficient Coding Practices*: You should aim to write clean, efficient code that reduces computational load and energy consumption.
- *Sustainable Architecture*: Advocate for and implement architectural designs that minimize resource use, such as serverless architectures or microservices that scale efficiently.

The TCS can be used as a framework for evaluating the impact of code changes. As the TCS grows and improves you will find tips for code and architecture design, and links to current tools that can assist you.
For some guidance on potentially useful software patterns that promote green coding, take a look at Green Software Foundation’s [Green Software Patterns](https://patterns.greensoftware.foundation/). Each of these patterns should be judged on their own merit, with their suitability for your specific product in mind.

### As a DevOps Engineer

- *Efficient Build Pipelines*: Optimise your build pipelines to run quickly and efficiently, paying attention to what resources are consumed when they run, and how often they run.
- *Shut Down Unused Processes*: Look for zombie processes that are running, taking up resources, but are not actually being used by anyone. Also keep an eye out for system that are left running when not in use for extended periods. For example, are integration environments only used in the day, but left running all night?
- *Check the Energy Mix*: Where does your hosting provider get its energy? Is it from renewable sources? If not, is there a viable alternative that can deliver the same feature at a similar or lower cost that runs from renewables? If your software is cloud hosted, could you move to a more sustainable location?
- *Optimise Regular Jobs*: If there are automated processes that run regularly, check that they are doing so efficiently and are definitely required. It may also be worth checking if they can be run at a time or location with a cleaner energy mix.

### As a Tester

- *Develop Carbon Aware Metrics*: Craft tests that can surface carbon emission data and check the feedback over time. If a test shows that the new feature uses a lot of carbon compared to other, similar features, make the developer aware. Similarly, check if a change to an existing feature has improved or worsened the carbon emissions of the system under test.

Design, with your team, what measurements, proxies and models can be used to measure and estimate carbon emissions. The mapping and measurement exercises described above should provide a variety of metrics that can be incorporated into your testing routine. To achieve this, you could try the techniques above, such as outputting carbon data to a dashboard or using a benchmarking style tool like the Green Metrics Tool. Then run your standard end to end tests against an instrumented test environment.

### Other Specialities

Of course, there are a great many other specialised skills that I've not detailed here, but you can use the above to think about how your skills can contribute to the shared goal of improving digital sustainability.

# Collaborative Efforts and Continuous Improvement

It is vital that the whole team – the Product Owner, Scrum Master, and Team Members, work together to align sustainability goals with sprint goals, making sustainability a shared responsibility.
The team should review the sustainability metrics they create in the sprint demo and discuss them in the retrospective. This will create a sustainable feedback loop as part of your agile process, allowing the team to continuously refine their approach to greener practices.

# Conclusion

When it comes to sustainable software, here at Scott Logic we try to follow the mantra “Map, Measure, Mitigate!”

- *Map*: Map your carbon emissions so that you know where the carbon lives in your system and can start to understand what you can influence and how you can influence it.
- *Measure*: Do your best to apply appropriate measurements to the different components in your system. Remember that some kind of measurement is better than nothing, so when you can’t measure something directly, measure an appropriate proxy that will indicate if your carbon emissions have changed. And if you can’t do that, work out a robust method to estimate the carbon emissions of that part of the system.
- *Mitigate*: As a team, each of you has a role in reducing the carbon emissions of your products. As a Product Owner, allow your team the time to reduce carbon emissions. As a Scrum Master make the data available and review it with your team. And as a Team Member, whatever your specialisation, use your skills to optimise your products and make them more efficient.

While Agile software development aims to deliver software in small increments, sustainable agile tries to do this while being mindful of efficiency and the expenditure of resources. Sometimes teams can meet these aims at the same time, in the same product increment. At other times this will not be possible or feasible, either for technical or business reasons. Under these circumstances the Product Owner should be made aware of the trade off and prioritise a follow up task to make the feature sustainable at the next opportunity. Ideally in the next product increment.

Agile software development, and specifically Scrum also bring another advantage that makes it well placed to address sustainability concerns - Agile teams are cross functional, meaning that you are more likely to have the necessary skills to make your products more efficient and sustainable.

By following these practices and principles, teams can do their part in making technology more sustainable. 

# Summary

So, in summary, a team that wants to be more sustainable should...

Create context so that they can understand how their changes will impact their carbon emissions.

- Map: Understand your carbon footprint by mapping emissions across your IT estate.
- Measure: Use appropriate tools and techniques to measure or estimate emissions, applying proxies where direct measurement isn't possible.
- Mitigate: Use each Scrum role’s unique contribution to reduce emissions across the development process.

Once the context is created, each role should do their part.

Product Owner:

- Prioritize features that reduce environmental impact.
- Encourage sustainability in estimates and product lifecycle planning.

Scrum Master:

- Optimise team processes to reduce waste.
- Promote energy-efficient tools and ensure sustainability is in the Definition of Done.
- Embed sustainability practices in continuous improvement.

Team Members:

- Developers: Write efficient code, optimise architecture.
- DevOps: Streamline pipelines, shut down unused processes, and seek green hosting solutions.
- Testers: Surface carbon-aware metrics and integrate emissions feedback into testing.

As a team, remember that:

- Sustainability should be a shared responsibility across all Scrum roles.
- Review sustainability metrics during demos and retrospectives to drive continuous improvement.
