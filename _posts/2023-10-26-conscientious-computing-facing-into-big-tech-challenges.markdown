---
title: Conscientious Computing - facing into big tech challenges
date: 2023-10-26 10:42:00 Z
categories:
- Sustainability
- ocronk
tags:
- sustainable software
- Sustainability
- ocronk
- architecture
- Tech
- cloud
summary: The tech industry has driven incredibly rapid innovation by taking advantage
  of increasingly cheap and more powerful computing – but at what unintended cost?
  What collateral damage has been created in our era of "move fast and break things"?
  Sadly, it's now becoming apparent we have overlooked the broader impacts of our
  technological solutions. This blog is the start of a new series that explores what
  we can do as technologists to consider and reduce the impact of the tech we create.
author: ocronk
image: "/uploads/Conscientious%20computing.png"
---

The tech industry has driven incredibly rapid innovation by taking advantage of increasingly cheap and more powerful computing – but at what unintended cost? What collateral damage has been created in our era of "move fast and break things"? Sadly, it's now becoming apparent we have overlooked the broader impacts of our technological solutions. 

As software proliferates through every facet of life and the scale of it increases, we need to think more about where this leads us from people, planet and financial perspectives. Sustainable Information Technology is even more important when you consider that digitalisation (going paperless, telecommuting etc) is often touted as a path to decarbonisation and sustainability.

![SustainabilityVennDiagramBranded.png](/uploads/SustainabilityVennDiagramBranded.png)

This is more than just a “do good” or “feel good” thing – there are many benefits of pushing towards [sustainability](https://www.scottlogic.com/what-we-do/sustainable-software) and [regenerative](https://blog.scottlogic.com/2023/09/27/architecting-a-regenerative-future-thoughts-from-intersection23.html) technology approaches including financial advantages. This is the first in our latest series of blogs on sustainable technology that will explore these issues and, where possible, offer pragmatic suggestions that hopefully raise thought-provoking questions to ask yourself, your suppliers, and technology teams.

**How we got here**

In the [early days of computing (1950s to 1980s)](https://en.wikipedia.org/wiki/History_of_computing_hardware), memory and processing power were extremely scarce and expensive resources. Programming required ingenious techniques to optimise every byte and cycle in order to accomplish anything useful within the tight constraints. Computing was a highly specialised dark art practised by only a handful of knowledgeable people. 

Moore’s law ([which has been running out of steam](https://www.nytimes.com/2016/05/05/technology/moores-law-running-out-of-room-tech-looks-for-a-successor.html) recently) has made computer chips increasingly cheap and powerful – so efficiency hasn’t been as important a priority. 

**“Hardware is cheap”**

Thanks to Moore's law, the more recent breakneck speed of improvement in computing has led to the mantra "hardware is cheap". Efficient applications haven’t been a priority – instead, the priority has been speed to market and programmer productivity. Something called the [Jevons paradox](https://en.wikipedia.org/wiki/Jevons_paradox) has come into play – the more cheap we make something (in this case through more efficient hardware), the more of it we use. Today, AI and cloud make massive compute power available at the click of a button. As the costs have come down, it’s been very tempting (in many cases unknowingly) to apply brute force rather than carefully crafting solutions. Developer productivity shouldn’t be demonised - it’s been super important - but we need to find smarter ways to balance speed to market without being wasteful. 

**Tech business models driven by growth**

Technology platforms are commercially driven to grow aggressively, and their primary means of growth is to encourage increased adoption. This presents a challenge as their commercial model is in conflict with attempts to reduce their footprint and impact. Sadly in some cases, this has led to [greenwashing](https://blog.scottlogic.com/2023/09/12/sustainability-terminology.html) (misleading or untrue claims about the positive impact that a service has on the environment), including suggesting that their platforms are always greener than alternatives. Whilst economies of scale and centralisation do have benefits, they are not always a panacea and you should evaluate the performance of your current platforms. This is particularly the case if your current infrastructure operates in parts of the [world with cleaner electricity](https://app.electricitymaps.com/map) (say [Scotland ](https://scottishbusinessnews.net/huge-regional-variations-in-carbon-intensity-of-great-britains-power-new-analysis/)or the [Nordics](https://datacentremagazine.com/articles/the-nordics-a-leading-sustainable-data-centre-destination)) than the [major cloud provider locations](https://uptimeinstitute.com/resources/tools/cloud-carbon-explorer) (often cities like London or US locations with higher demand for electricity).

**Ubiquitous cheaper computing is a double-edged sword**

We are now uncovering the pitfalls of this brute-force approach. Bloated, wasteful applications contribute to growing energy consumption and carbon emissions from data centres. They strain local resources for power and cooling. Materials and energy used in the manufacturing and supply chain (aka embodied carbon from hardware) are almost completely hidden and unknown. We have made using computers and building systems far easier by abstracting away layers of complexity, and this is a good thing, democratising access to computing. Unfortunately however, these layers (such as end-user tools, low or no code, spreadsheets and more recently GenAI) can also add inefficiency and create a lack of transparency regarding what is going on under the hood. Software has real world impacts and the cloud is not ephemeral. As the old joke about Cloud states “it’s someone else’s computer” (often massive racks of them in fact) and it exists somewhere out of sight and out of mind.

**Cost vs Quality and the role of Architects**

Technologists (in particular more forward-looking/strategic Architects) already know that we need to go beyond evaluating systems on benchmarks of speed and cost of delivery. Often the champions of quality attributes and non-functional requirements are so often overruled in an era where cost and time pressures have a tendency to drive out software quality. Sadly, this results in unintended consequences.

![330px-Project-triangle-en.svg.png](/uploads/330px-Project-triangle-en.svg.png)

The classic Scope, Cost, Time pyramid - but often it’s the **observable ** functional quality that is prioritised. For that I’ll use a somewhat surreal version of an iceberg - as so much of technical (and effectively sustainability debt - a topic for a future blog) is hidden below the water line.

![DALL·E 2023-10-25 16.13.50 - Create an outline cross section sketch of a waterfall that shows 1 mobile phone and a laptop on the top of the iceberg and hidden beneath the water li.png](/uploads/DALL%C2%B7E%202023-10-25%2016.13.50%20-%20Create%20an%20outline%20cross%20section%20sketch%20of%20a%20waterfall%20that%20shows%201%20mobile%20phone%20and%20a%20laptop%20on%20the%20top%20of%20the%20iceberg%20and%20hidden%20beneath%20the%20water%20li.png)

Every engineering decision (or indecision) has ethical and sustainability consequences, often invisible from within our isolated bubbles (for example, we don’t feel or see the impact of electronic waste, but it does exist; it just ends up somewhere else). Just as the industry has had to raise its game on topics such as security, privacy and compliance, we desperately need to raise our game holistically on sustainability.  

**Why not just wait for regulation?**
While compliance requirements eventually nudge laggards, early adopters reap benefits on multiple fronts. Sustainable practices like streamlining processes, right-sizing resources, and eliminating waste can significantly trim expenses. And sustainability-focused companies (that are genuine and don’t just greenwash) attract top talent and brand affinity. 

The incentives are there for organisations to get ahead of the curve on environmental practices rather than delay until mandated. Beyond regulatory obligation, optimising for sustainability is an opportunity to reduce costs and create value. The time to start is now as the longer we put this off, the more technical/environmental debt we accumulate. Of course, carbon or environmental pricing/taxation would provide more of a stick, but there are already clear benefits from being a leader rather than a laggard – for example:

* More cost-efficient – through measuring and optimising your assets
* Managing risks and increasing resilience by being on top of your architecture
* More attractive supplier – through demonstrable and transparent actions
* More attractive employer – many are now looking for their employer to walk the walk on environmental action and, if they haven’t already, will start to see through greenwash

**Making Progress Visible – you can’t manage what you can’t measure**

To enable more conscientious computing, we must start by making impacts visible. As the old saying goes, “you can’t manage what you can’t measure”. Ideally, we need standard global frameworks for efficiency and utilisation, assessing lifecycle product/system carbon footprints, and other aspects that can help expose the true costs of our systems. 

**Visibility into Data centres: where software = physical impact**

Transparency of the carbon footprint of data centres – beyond just energy consumption (to include water and e-waste) – would connect developers to the real-world impacts of their cloud usage. Every part of the software development and operations lifecycle needs visibility so that we can start to optimise (or at the very least make pragmatic trade-offs). Many of these things are being actively worked on by the likes of [Green Software Foundation](https://greensoftware.foundation/) and the [Sustainable Digital Infrastructure Alliance](https://sdialliance.org/), but they are still very much in their infancy. In the meantime, we should work with what data and proven research are available, learn from others and do our best to fill gaps pragmatically. Of course, end-user devices are also where software has real-world impact – but this will get picked up in a separate article.

**Beyond measurement – taking action**

Once we understand the size of the problem, we can prioritise the areas that look the most compelling to address (based on current size or projected growth in usage). You can start by implementing the high-impact, low-effort actions, and progress to weighing up the changes that will require investment (will the effort pay back?). Then you can start tying technology strategy, architecture principles and policies back to your corporate sustainability goals (where these exist). If Environmental, Social and Governance (ESG) isn’t a priority at an organisation-wide level (increasingly rare but not unheard of), look for other areas such as cost savings, marketing, customer and employee retention as drivers and levers for change.

![sustainable-framework-v05.PNG](/uploads/sustainable-framework-v05.PNG)

In other articles, we will talk about practical actions and decisions you can make, such as:

* How we strive for BOTH developer and machine productivity
* Making sustainable infrastructure and cloud provider choices 
* Sustainable design, development and DevOps choices
* Carbon aware computing and time and location shifting

None of these is a silver bullet that should be applied dogmatically – you will need to carefully consider pragmatic trade-offs.

**Raising awareness and inspiring action**

Before all of this, we have to raise awareness of the issue across the technology industry, our organisations and the sector we work in. This blog series (and other supporting material) is part of that, from a Scott Logic point of view. As much as we are a business, we have a social mission. Being an active part of the sustainable software ecosystem, in particular open source communities, is a [significant part of our social mission](https://www.scottlogic.com/who-we-are).

Education more broadly plays a role too. Environmental science concepts (or at the very least awareness of Greenhouse Gas (GHG) protocols and the concepts explained in the Green Software Foundation certification) integrated into the computer science curriculum could seed the next generation of technologists with sustainability thinking. We also need to educate everyone on the impacts of their technology usage – “[Fast Tech](https://www.bbc.co.uk/news/business-67082005)” is starting to get mainstream attention, which is encouraging.

**The Path Forwards**

With focus and initiative across stakeholders, we can build an ecosystem that values conscientious computing. One where technologists have both the desire and tools to create solutions that uplift society’s sustainable use of digital.

The challenges ahead are enormous, but so is the opportunity for positive impact and financial cost savings. Our systems can either contribute to humanity’s burdens or help shoulder them. The choice comes down to thousands of small decisions we make every day as architects and engineers. Do we reach for the quick and easy path, or do the difficult, nuanced work of considering the trade-offs we need to make? Whilst it’s unlikely we can build perfect, zero-impact systems (at least in the medium term), that should not get in the way of making progress.

**_“Perfection (and fear of hypocrisy) is the enemy of progress when it comes to tech sustainability”_**

Recently at a [People, Planet, Pint](https://small99.co.uk/people-planet-pint-meetup/) event in Bristol, the comedian Stuart Goldsmith said that our fear of hypocrisy [on the environment] often stops us from taking action. All of us are waking up to the true impacts and costs of our actions and past behaviour and fear that we need to be perfect (across all parts of our lives) before we can really make an impact. The reality is that as important as collective individual actions are, the actions we take at work can make a huge difference. Whilst this topic can feel overwhelming at times, this shouldn’t stop us from taking pragmatic action – particularly when this can have huge effects (imagine if you could easily reduce the energy consumption of your organisation’s tech by just 0.5-1%).

**Sustainable Innovation**

Future innovation is going to require elevating both technical and ethical standards. It means creating human-centric and planet-centric systems, not merely human-usable ones. We have the potential to build a future where technology brings out the best in humanity. But we must commit to holding ourselves and our industry to higher standards. The world needs technology pragmatists willing to ask tough questions in pursuit of progress. Together, through conscientious computing, I am confident we can #ArchitectTomorrow and build that world!

If you’d like a friendly chat about this topic, our door is open – whether the discussion is to raise awareness, lead to cross-industry/open source collaboration, or something more in-depth. Please do get in touch: [oliver@scottlogic.com](mailto:oliver@scottlogic.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/cronky/). You can also find out more here about our work supporting organisations to design and build [sustainable software](https://www.scottlogic.com/sustainable-software).