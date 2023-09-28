---
title: Being honest about Embodied Carbon from Software Development
date: 2023-09-26 00:00:00 Z
categories:
- Tech
tags:
- Sustainability
summary: Carbon emissions come in all shapes and sizes, in this blog post I talk about the more illusive sources of embodied carbon from software development.
author: jhowlett
---

### The software industry has had an easy ride compared with other sectors regarding sustainability, in the coming years that could all be about to change.

I wanted to build upon my previous post [A guide to Software Sustainability terminology](https://blog.scottlogic.com/2023/09/12/sustainability-terminology.html) and expand on a term that I feel does not have the awareness it deserves. If you are new to this topic then I recommend giving it a read first.

The software industry has only had minimal, if any, imposing regulations or mandatory audits of sustainability practices. This could be due to the media portraying the digital revolution as part of the green future, software having grown and evolved so fast that regulatory bodies cannot keep up or maybe even just because computers are not directly spewing out plumes of harmful carbon emissions.

Now that there is pressure and a wider adoption of sustainable practices in other sectors, the software industry needs to play catch-up and understand what battles to fight to get closer to a sustainable future. There is benefit to this late arrival, we can use the work and terms developed by other industries that have already gone down this route, with two of particular relevance: Operational Carbon and Embodied Carbon.

In short, operational carbon is the total carbon emissions released to keep a process, product or service (such as a piece of software) functioning whereas embodied carbon is the carbon emissions released to get a product or service (such as software) into its operational state (for example: development, maintenance & decommission). For software, embodied carbon is often much larger than operational carbon and this may be one of the reasons that software is trailing behind in the race for sustainability.

The first source of embodied carbon to be aware of in the tech industry is from the production of IT hardware. This is a large source of emissions because computers are complex machines that require high energy intensity manufacturing processes. For a more detailed description on hardware based embodied carbon emissions and information on other software sustainability topics, check out the Green Software Foundation's [Green Software Practitioner](https://learn.greensoftware.foundation/hardware-efficiency#embodied-carbon) course.

The hardware emission source is sufficient for businesses that directly use IT hardware, but what happens when the software sector starts using this hardware as the foundation of other products? Just like the emissions originating from the electricity consumption of a bricklayer’s cement mixer is attributed to the embodied carbon of a building, I feel the electricity of a software developer's computer should be attributed to the embodied carbon of software. 

To put this definition into context and illustrate how this wider view of embodied carbon can help in understanding the overall carbon impact of a software feature, I have portrayed a common scenario from within software companies that are starting to focus on sustainability.

Say we own an app with a relatively small number of users. With great intentions we want to reduce our operational carbon by making a task more efficient, reducing energy needed to complete said task and therefore reducing the operational carbon. 

Sounds promising, let's get our top developer on it! 

Our developer sees that they can improve the efficiency of the sign-up feature considerably. They spend a week developing locally on their machine and then testing using environments in the cloud which are subsequently destroyed. Hooray, after 1 week the developer has improved the efficiency of the sign-up feature by 70%, so when someone signs up for the software they are now using 70% less energy than before.

Now let’s look at this ‘sustainable’ improvement, taking embodied carbon into account. The story is very different, we don’t have many users and they are stable so the number of people that use the sign-up feature is minimal and so the actual operational carbon reduction is minimal too when compared to the amount of embodied carbon needed to develop and roll out the new feature. 
We must take into account the developer’s computer that was on for 8 hours a day for 5 days, all energy needed to build and run testing environments, the manufacturing of the hardware the environments are running on, the list goes on. I hope this illustration shines a light on the fact that there needs to be a comparison on the operational carbon reduction and the embodied carbon ‘hit’ you take to get a new feature out of the door.

Having a greater awareness and software specific definition of embodied carbon allows better decision making by taking into account a wider range of carbon emission sources. Not just the obvious and generic ones, leading to better overall carbon mitigation planning. As time progresses embodied carbon sources should be solidified with the aid of laws that mandate the publishing of detailed embodied carbon emission data. Until this happens we need to proactively assess our carbon emitting actions during software development to help identify sources of carbon in software. We would hate for all our hard work in making software more sustainable to go to waste because there is an unknown source of carbon emissions silently harming the planet.

If you want to learn more about supply chain carbon emissions, where a substantial proportion of embodied carbon emissions lie. Including problems holding their reporting back, give Graham Odd’s blog post [Environmental Impact – The supplier problem](https://blog.scottlogic.com/2023/07/20/Environmental-Impact-The-supplier-problem.html) a read where he dives into this subject in more detail.