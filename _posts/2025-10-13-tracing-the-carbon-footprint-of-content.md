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


> **_DISCLAIMER:_** This blog post generated an estimated xx CO2*

*This is a high level estimate based on a limited amount of factors:
- A portion of the embodied carbon of my Dell laptop
- A portion of the embodied carbon of VSCode (the text editor I used)
- Power consumption of the laptop for approximately 10 hours
- Around 20 web searches (AI overviews on the search engine have not been turned off). [8.2g CO2e 5 minutes web browsing from a laptop](https://profilebooks.com/wp-content/uploads/wpallimport/files/PDFs/9781788163811_preview.pdf)
- Reading the stuff I found: 
- 7 inferences on AI chatbots



## The carbon journey of content ##

Whether content is treated as a commodity or public good, in the case of cultural heritage for example, understanding the environmental impact of handling digital content requires examining its lifecycle. 

We looked at ways to locate these emissions across all kinds of media, from news articles and blog posts through to photos, audio files and videos. This cluster includes everything from video and music streaming, video conferencing, social media, emails and inferences with [foundation models](https://www.adalovelaceinstitute.org/resource/foundation-models-explainer/), which we’ll explore further down in this article.

![My Image]({{ site.baseurl }}/hsauve/assets/content/social-media.jpg "A person on social media")

<sub>*Photo by [Lisa from Pexels](https://www.pexels.com/@fotios-photos/) on [Pexels](https://www.pexels.com/photo/person-holding-midnight-black-samsung-galaxy-s8-turn-on-near-macbook-pro-1092671/)*</sub>



![My Image]({{ site.baseurl }}/hsauve/assets/content/content-lifecycle-chart.png "A funnel chart representing the lifecycle of digital content")

### Content production ###

Content production encompasses all activities directly involved in creating and editing digital content, and varies greatly based on content type and production scale. 

Energy intensive activites include <strong>equipment operation</strong>(lighting, cameras, computers), <strong>physical production</strong> (sets, construction materials, costumes and props), <strong>location production and travel</strong>, and increasingly <strong>artificial Intelligence</strong> tools for editing and visual effects.

### Production of hardware and software ###

The journey of digital content begins long before creation. This category captures carbon emissions generated during the extraction, manufacturing and transportation of raw materials used throughout the content lifecycle. 

The <strong>hardware footprint</strong> includes cameras, microphones, headphones, memory cards, hard drives and lighting equipment. <strong>Software development</strong> requires energy for coding, testing and deploying applications.
This category also encompasses the embodied carbon of <strong>network equipment</strong> such as fiber optic cables, satellite systems and routing infrastructure.

### Storage and processing ###  

Modern organisations generate data at unprecedented rates, creating a growing demand for efficient storage and processing infrastructure. whether managing petabytes or gigabytes, the storage layer represents a significant emissions source. These emissions originate from data centre operations requiring substantial computation and cooling systems, as well as processing and transcoding needed before distribution.

Beyond the primary content itself, organisations must store metadata: descriptions, comments, tags, translations, accessibility features and versioning information.

<strong>Data redundancy:</strong>
To ensure reliability and availability, organisations typically store multiple copies of the same data. While redundancy is critical for data security, disaster recovery and performance optimisation, it carries a significant environmental cost.

### Distribution and networking ###

For organisations that treat content as their core product, distribution typically accounts for a substantial share of operational emissions. This phase encompasses the entire journey from data centre to end-user device.

This generally involves energy consumed by Content Delivery Networks (CDNs) to reduce latency and improve performance, transmission networks moving data between data centres and end-user devices, cable modems and routers, and cloud infrastructure that scales dynamically based on demand. 

### End-user consumption ###

Consumption represents the final, and for many organisations, the largest component of content's carbon footprint.
These emissions, associated with device energy consumption, vary grately based on the local electricity grid, device type, content quality and resolution, and consumption duration. 

One [study from the International Energy Agency (IEA)](https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines) illustrates just how complex measuring downstream emissions can be, and how new demands for emerging technologies and artificial intelligence is rapidly changing the sector.

>  One hour of streaming video in 2019 is 36gCO2.

[Social media carbon footprint calculator](https://www.comparethemarket.com.au/energy/features/social-carbon-footprint-calculator/)
 
## AI-generated content ## 

![My Image]({{ site.baseurl }}/hsauve/assets/content/chatgpt.jpg "Introducing ChatGPT")

<sub>*Photo by [Shantanu Kumar](https://www.pexels.com/@theshantanukr/) on [Pexels](https://www.pexels.com/photo/chatgpt-webpage-open-on-iphone-16474955/)*</sub>

While traditional content already poses sustainability challenges, the rise of AI-generated content introduces new complexities and a much larger scale of environmental impact.

### The carbon cost of inference ###

State-of-the-art models can produce multiple formats including text, image and video, with each request (or "inference") carrying its own carbon footprint. In their [contribution to a global environmental standard for AI](https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai) released earlier this year, Mistral estimated that a 400-token text response generated 1.14 gCO₂e and 45 mL of water. While this may seem negligible for a single query, the scale becomes staggering when multiplied across billions of daily interactions globally.

### The hidden cost of training ###

To accurately estimate their carbon footprints, organisations must also account for a portional share of the training phase of the models they use. For instance training GPT-3 is estimated to have consumed [1,287 megawatt-hours (MWh) of electricity and emit over 550 metric tons of CO2e](https://arxiv.org/html/2505.09598v2) and [evaporated 700,000 liters of clean freshwater](https://arxiv.org/pdf/2304.03271), enough to fill an Olympic-sized swimming pool by nearly one-third. 

AI data centres fundamentally differ from traditional data centres in their infrastructure. The specialised hardware necessary for AI workloads involving Graphics Processing Units (GPUs) and Tensor Processing Units (TPUs) consumes substantially more power than standard CPUs.

Understanding the true environmental cost of AI-generated content may enable organisations to make strategic decisions regarding the model they use, and how they use it.

### What are the solutions to reduce our carbon footprint? ###

There are many aspects of our content consumption lie beyond individual and organisation control, as the energy manufacturing and powering our devices and data centres heavily relies on fossil fuels. However awareness that everything we do digitally has a carbon footprint serves as a starting point for a wider reflection.

Practical steps you can take:

- Switch to a greener energy provider for you home or office
- Choose an [eco-friendly search engine](https://www.choose-greener.com/eco-friendly-search-engines/) that offsets or minimise its carbon footprint
- Unsubscribe unwanted emails as each email has a carbon footprint. According to English researcher and writer on carbon footprinting [Mike Berners-Lee](https://profilebooks.com/wp-content/uploads/wpallimport/files/PDFs/9781788163811_preview.pdf):
> In 2019, the average email user received about 75 emails per day (of which 41 were spam). If you received this number, with all the non-spam being emails that take the sender just 10 seconds to write and you a mere 5 seconds to read, then the carbon footprint of writing, sending and reading would be around 3kg CO2e per year, or 12 million tonnes CO2e globally.
- Regularly delete the media you no longer need: films, videos and photos accumulate quickly and take up storage
- Reflect on your social media habits
- Question the need for AI support. When using AI chatbots, consult our [guide](https://www.techcarbonstandard.org/guides/reduce-ai-emissions), which contains information on prompt engineering and other strategies to minimise emissions. 

