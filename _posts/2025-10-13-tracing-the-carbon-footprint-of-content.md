---
title: From traditional to AI-generated, tracing the carbon footprint of content
date: 2025-10-13 00:00:00 Z
categories:
- Sustainability
- Tech
tags:
- Tech
- Sustainability
- Sustainable AI
summary: Following the latest update of the Technology Carbon Standard, this blog explores the carbon footprint of content throughout its entire lifecycle, highlighting key carbon emissions hotspots and offering strategies to mitigate them.
author: hsauve
---

As part of the [latest update](https://blog.scottlogic.com/2025/09/04/technology-carbon-standard-update-4-sept.html) of the [Technology Carbon Standard](https://www.techcarbonstandard.org/), the Sustainability Team at Scott Logic added a new category focusing on content. 

Whilst the standard previously focused on hardware and software, content has emerged as a distinct and substantial source of carbon emissions that deserves its own analysis. Despite its growing environmental impact, content traditionally received less attention. As organisations produce and distribute content at exponential scales, the sustainability implications must be addressed.

## The carbon journey of content ##

Whether content is treated as a commodity or public good, in the case of cultural heritage for example, understanding the environmental impact of handling digital content requires examining its lifecycle. 

Content, whether used for education, entertainment, intelligence or any other kinds of purpose carries a carbon footprint as it is created, traded, edited and archived. 

We looked at ways to locate these emissions across all kinds of media, from news articles and blog posts through to photos, audio files and videos. This cluster includes everything from video and music streaming, video conferencing, social media, emails and inferences with foundation models, which we’ll explore further down in this article.

![My Image]({{ site.baseurl }}/hsauve/assets/content/social-media.jpg "A person on social media")

<sub>*Photo by [Lisa from Pexels](https://www.pexels.com/@fotios-photos/) on [Pexels](https://www.pexels.com/photo/person-holding-midnight-black-samsung-galaxy-s8-turn-on-near-macbook-pro-1092671/)*</sub>


Let's consider the National Library of France (BnF), the French national library in charge of the legal deposit in France since the XVIth century. In other words, a vast repository of knowledge. 
The BnF has undertaken a major digitalisation effort in the past few years and published a [digital roadmap](https://www.bnf.fr/sites/default/files/2021-04/SN%202020_poster_BAT_ANG%2003.pdf) outlining its digital strategy for its platform [Gallica](https://www.bnf.fr/en/gallica-bnf-digital-library). 

Although playful and light touch, the BnF’s roadmap offers a useful framework for understanding some key elements that contribute to the carbon footprint of digital content. These include:

- Entries (new content)
- Collections processing
- Content management 
- Metadata management 
- Long-term digital preservation 
- Accessibility 
- Artificial Intelligence 

These categories can help us explore the carbon emissions associated with each phase of the lifecycle of digital content.

![My Image]({{ site.baseurl }}/hsauve/assets/content/content-lifecycle-chart.png "A funnel chart representing the lifecycle of digital content")

### Content production ###

This category encompasses all activities directly involved in creating and editing digital content, and varies greatly based on content type and production scale. 

Energy intensive activites may relate to <strong>equipment operation</strong>, to include lighting equipment, cameras and computers, <strong>physical production</strong> for physical sets requiring construction materials, costumes and props, <strong>location production and travel</strong>, as well as <strong>artificial Intelligence</strong>; AI-powered tools used for editing and visual effects being increasingly common.

### Production of hardware and software ###

The journey of digital content begins long before any content is created. This category encompasses carbon emissions generated during the extraction, manufacturing and transportation of raw materials used throughout the content lifecycle. 

The hardware footprint of content includes cameras, microphones and headphones but also memory cards, hard drives and lighting equipment, while software development requires energy consumed in coding, testing and deploying applications.
This category also encompasses the embodied carbon of network equipment such as optic cables, satellite systems and routing equipment.

### Storage and processing ###  

Modern organisations generate data at unprecedented rates, creating a growing demand for efficient storage and processing infrastructure. From large organisations managing petabytes of data to smaller companies handling gigabytes, the storage layer represents a significant source of emissions. These emissions originate from data centre operations, which require substantial computation and cooling systems, as well as processing and transcoding needed before distribution.

Beyond the primary content itself, organisations must store metadata, such as descriptions, comments, tags, translations, accessibility features and versioning information.

<strong>Data redundancy:</strong>
To ensure reliability and availability, organisations must often store multiple copies of the same data. Although redundancy is critical for data security, disaster recovery and performance optimisation, it comes with a significant environmental cost.

### Distribution and networking ###

For organisations that treat content as their core product, the distribution phase typically accounts for a substantial share of operational emissions. This phase encompasses the entire journey from data centre to end-user device.
This generally involves energy consumed by CDNs to reduce latency and improve performance, transmission networks to transfer data from data centres to local networks, as well as cable modems, routers, and cloud infrastructure that scales dynamically based on demand. 

### End-user consumption ###

Consumption represents the final, and for many organisations, the largest component of content's carbon footprint.
These emissions, associated with device energy consumption, vary grately based on various factors including the local electricity grid, device type, content quality and resolution, and consumption duration. 
One [study](https://www.researchgate.net/publication/358794471_Carbon_Footprint_of_The_Most_Popular_Social_Media_Platforms) found for instance that 

[The BBC's carbon impact of streaming](https://www.bbc.co.uk/rd/blog/2021-06-bbc-carbon-footprint-energy-envrionment-sustainability) is just one example that measuring carbon emissions linked to downstream emissions is a complex task.
 
## AI-generated content ## 

![My Image]({{ site.baseurl }}/hsauve/assets/content/chatgpt.jpg "Introducing ChatGPT")

<sub>*Photo by [Shantanu Kumar](https://www.pexels.com/@theshantanukr/) on [Pexels](https://www.pexels.com/photo/chatgpt-webpage-open-on-iphone-16474955/)*</sub>

While traditional content already poses sustainability challenges, the rise of AI-generated content introduces new complexities and a much larger scale of environmental impact.

### The carbon cost of inference ###

State-of-the-art models have the ability to produce multiple formats including text, image and video, with each request (or "inference") carrying its own carbon footprint. In their [contribution to a global environmental standard for AI](https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai) released earlier this year, Mistral estimated that a 400-token text response generated 1.14 gCO₂e and 45 mL of water. While this may seem negligible for a single query, the scale becomes staggering when multiplied across billions of daily interactions globally.

### The hidden cost of training ###

To accurately estimate their carbon footprints, organisations must also account for a portional share of the training phase of the models they use. For instance training GPT-3 is estimated to have consumed [1,287 megawatt-hours (MWh) of electricity and emit over 550 metric tons of CO2e](https://arxiv.org/html/2505.09598v2) and [evaporated 700,000 liters of clean freshwater](https://arxiv.org/pdf/2304.03271), enough to fill an Olympic-sized swimming pool by nearly one-third. 

AI data centres fundamentally differ from traditional data centres in their infrastructure. The specialised hardware necessary for AI workloads involving Graphics Processing Units (GPUs) and Tensor Processing Units (TPUs), consumes substantially more power than standard CPUs.

Understanding the true environmental cost of AI-generated content may enable organisations to make strategic decisions regarding the models selection, and the way they are used.

## The carbon case of this blog post ##

If we were to look for a high level estimate of the carbon footprint of this blog post, here is a list of elements we would need to research:

- A portion of the embodied carbon of my Dell laptop
- Power consumption of the laptop for approximately 3 hours, using a blend of renewable and non-renewable electricity sources.
- Around 15 web searches and 30 clicks on landing pages. AI overviews on the search engine have not been turned off.
- 5 inferences on Mistral AI
