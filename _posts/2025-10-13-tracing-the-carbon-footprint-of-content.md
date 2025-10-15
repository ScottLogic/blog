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

Whilst the standard previously focused on hardware and software, content has emerged as a distinct and substantial source of carbon emissions that deserves its own analysis. Despite its growing environmental impact, content has traditionally received less attention. As organisations produce and distribute content at exponential scales, the sustainability implications must be addressed.


> **_DISCLAIMER:_** This blog post generated an estimated xx CO2*


## The carbon journey of content ##

Whether content is treated as a commodity or public good, in the case of cultural heritage for example, understanding the environmental impact of handling digital content requires examining its lifecycle. 

We looked at ways to locate these emissions across all kinds of media, from news articles and blog posts through to photos, audio files and videos. This cluster includes everything from video and music streaming, video conferencing, social media, emails and inferences with [foundation models](https://www.adalovelaceinstitute.org/resource/foundation-models-explainer/), which we’ll explore further down in this article.

![My Image]({{ site.baseurl }}/hsauve/assets/content/two-people-filming.jpg "Two people filming with a camera")

<sub>*Photo by [Marcos Rocha](https://www.pexels.com/@fotios-photos/) on [Unsplash](https://unsplash.com/photos/man-in-red-long-sleeve-shirt-using-black-video-camera-_XgGN5yo1QE)*</sub>


### Content production ###

Content production encompasses all activities directly involved in creating and editing digital content, and varies greatly based on content type and production scale. 

Energy intensive activites include equipment operation (lighting, cameras, computers), physical production (sets, construction materials, costumes and props), location production and travel, and increasingly artificial Intelligence tools for editing and visual effects.

### Production of hardware and software ###

The journey of digital content begins long before creation. This category captures [upstream carbon emissions](https://www.techcarbonstandard.org/impact-categories/upstream) generated during the extraction, manufacturing and transportation of raw materials used throughout the content lifecycle. These emissions, although not directly resulting from an organisation's operations, are embedded in the products they use and should be accounted for.

In the case of content, this could include cameras, microphones, headphones, memory cards, laptops hard drives and lighting equipment to name just a few. The software footprint on the other hand would be the result of the energy needed for coding, testing and deploying applications such as editing platforms or scriptwriting software.
This category also encompasses the embodied carbon of network equipment such as fiber optic cables, satellite systems and routing infrastructure.

### Storage and processing ###  

Modern organisations generate data at unprecedented rates, creating a growing demand for efficient storage and processing infrastructure. Whether managing petabytes or gigabytes, the storage layer represents a significant emissions source. These emissions originate from operations requiring substantial computation and cooling systems, embordied carbon of data centre hardware as well as processing and transcoding needed before distribution. 

[As an example, Meta reported:](https://sustainability.atmeta.com/blog/2024/09/10/estimating-embodied-carbon-in-data-center-hardware-down-to-the-individual-screws/)

> In 2023, their carbon footprint was 7.5M metric tons of CO2e including 4.8 M for capital goods, which includes IT hardware purchases 

Beyond the primary content itself, organisations must store metadata: descriptions, comments, tags, translations, accessibility features and versioning information, often located in separate databases, which adds up to the computing resources required.

<strong>Data redundancy:</strong>
To ensure reliability and availability, organisations typically store [multiple copies of the same data](https://www.ibm.com/think/topics/data-redundancy) across different locations, formats or systems. While redundancy is critical for data security, disaster recovery and performance optimisation, it carries a significant environmental cost.

### Distribution and networking ###

For organisations that treat content as their core product, distribution typically accounts for a substantial share of operational emissions. This phase encompasses the entire journey from data centre to end-user device.

This generally involves energy consumed by Content Delivery Networks (CDNs) to reduce latency and improve performance, transmission networks moving data between data centres and end-user devices, cable modems and routers, and cloud infrastructure that scales dynamically based on demand. 

### End-user consumption ###

![My Image]({{ site.baseurl }}/hsauve/assets/content/person-watching-netflix.jpg "A person watching Netflix")

<sub>*Photo by [Mollie Sivaram](https://unsplash.com/@molliesivaram) on [Unsplash](https://unsplash.com/photos/black-flat-screen-tv-turned-on-displaying-11-yubCnXAA3H8)*</sub>
 

Consumption represents the final, and for many organisations, the largest component of content's carbon footprint.
These emissions, associated with device energy consumption, vary grately based on how the energy used is generated, device type, content quality and resolution, and consumption duration. 

For example, [a 50-inch LED television consumes much more electricity than a smartphone (100 times) or laptop (5 times)](https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines) and whether you are based in France where electricity originates primarily from nuclear power, or Germany will determine your carbon footprint.

The IEA study above also illustrates just how complex measuring downstream emissions can be, and how new demands for emerging technologies including artificial intelligence is rapidly changing the sector.

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

An article by [WIRED](https://www.wired.com/story/youtube-digital-waste-interaction-design/) reports:

> YouTube's annual carbon footprint is about 10Mt CO2e (Million Metric tons of carbon dioxide equivalent), according to researchers — about the output of a city the size of Glasgow. But it doesn't have to be that way, with a few easy design changes easily slashing that footprint by applying Sustainable Interaction Design.

- Smarter web design to optimising websites so users find information quickly. 

Practical steps you can take:

- Switch to a greener energy provider for you home or office
- Choose an [eco-friendly search engine](https://www.choose-greener.com/eco-friendly-search-engines/) that offsets or minimise its carbon footprint
- Unsubscribe unwanted emails as each email has a carbon footprint. According to English researcher and writer on carbon footprinting [Mike Berners-Lee](https://profilebooks.com/wp-content/uploads/wpallimport/files/PDFs/9781788163811_preview.pdf):
> In 2019, the average email user received about 75 emails per day (of which 41 were spam). If you received this number, with all the non-spam being emails that take the sender just 10 seconds to write and you a mere 5 seconds to read, then the carbon footprint of writing, sending and reading would be around 3kg CO2e per year, or 12 million tonnes CO2e globally.
- Regularly delete the media you no longer need: films, videos and photos accumulate quickly and take up storage
- Reflect on your social media habits
- Question the need for AI support. When using AI chatbots, consult our [guide](https://www.techcarbonstandard.org/guides/reduce-ai-emissions), which contains information on prompt engineering and other strategies to minimise emissions. 


*This is a high level estimate based on a limited amount of factors:

- A portion of the embodied carbon of my Dell laptop
- A portion of the embodied carbon of VSCode (the text editor I used)
- Power consumption of the laptop for approximately 10 hours
- Around 20 web searches (AI overviews on the search engine have not been turned off). [8.2g CO2e 5 minutes web browsing from a laptop](https://profilebooks.com/wp-content/uploads/wpallimport/files/PDFs/9781788163811_preview.pdf)
- Reading the stuff I found:
- 7 inferences on AI chatbots