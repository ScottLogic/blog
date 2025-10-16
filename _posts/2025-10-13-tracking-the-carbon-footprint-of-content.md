---
title: Tracking the carbon footprint of content through its lifecycle
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

## The carbon journey of content

Whether content is treated as a commodity or public good, in the case of cultural heritage with digital libraries as an example, understanding the environmental impact of handling digital content requires examining its lifecycle.

We looked at ways to locate these emissions across all kinds of media, from news articles and blog posts through to photos, audio files and videos. This cluster includes everything from video and music streaming, video conferencing, social media, emails and inferences with [foundation models](https://www.adalovelaceinstitute.org/resource/foundation-models-explainer/), which we’ll explore further down in this article.

![My Image]({{ site.baseurl }}/hsauve/assets/content/two-people-filming.jpg "Two people filming with a camera")

<sub>_Photo by [Marcos Rocha](https://unsplash.com/@marcosrochatv) on [Unsplash](https://unsplash.com/photos/man-in-red-long-sleeve-shirt-using-black-video-camera-_XgGN5yo1QE)_</sub>

### Content production

Content production encompasses all activities directly involved in creating and editing digital content, and varies greatly based on content type and production scale.

Content production activites include energy consumption from equipment operation (lighting, cameras, computers), physical production (sets, construction materials, costumes and props), location production and travel, and increasingly artificial Intelligence tools for editing and visual effects.

Carbon emissions associated with production vary considerably depending on methods and technologies used.
In the television industry, a 2021 UCLA report comparing analog film rolls vs digital memory cards with HBO as a case study found that [capturing an hour of unedited footage on film generated 561.26 kg CO2e, whereas capturing an hour of unedited footage on a digital SD card produced only 164.70 kg CO2e, a difference of nearly 400 kg CO2e.](<(https://www.ioes.ucla.edu/wp-content/uploads/2024/07/UCLA-IoES-Practicum-HBO-Film-vs-Digital-Final-Report-2021.pdf)>) This data illustrates how technological choices can significantly impact a production's carbon footprint.

Organisations must identify best practices that can limit their environmental impact, and various strategies such as transitioning from film to digital capture or [repurposing set materials](https://www.bbc.co.uk/news/articles/cj3m83pv5lyo) are just some examples.

### Production of hardware and software

The journey of digital content begins long before creation. This category captures [upstream carbon emissions](https://www.techcarbonstandard.org/impact-categories/upstream) generated during the extraction, manufacturing and transportation of raw materials used throughout the content lifecycle. These emissions, although not directly resulting from an organisation's operations, are embedded in the products they use and should be accounted for.

![My Image]({{ site.baseurl }}/hsauve/assets/content/editing.jpg "A laptop screen showing an editing software")

<sub>_Photo by [Jakob Owens](https://unsplash.com/@jakobowens1) on [Unsplash](https://unsplash.com/photos/black-flat-screen-tv-turned-on-displaying-game-B4f_Kx5jvpg)_</sub>

In the case of content, this could include hardware such as cameras, microphones, headphones, memory cards, laptops hard drives and lighting equipment to name just a few. The software footprint on the other hand is the result of the energy needed for coding, testing and deploying applications such as editing platforms or scriptwriting software.
This category also encompasses the embodied carbon of network equipment such as fiber optic cables, satellite systems and routing infrastructure.

### Storage and processing

Modern organisations generate data at unprecedented rates, creating a growing demand for efficient storage and processing infrastructure. Whether managing petabytes or gigabytes, the storage layer represents a significant emissions source. These emissions originate from operations requiring substantial computation and cooling systems, embodied carbon of data centre hardware as well as processing and transcoding needed before distribution.

> As an example, in 2023, Meta reported that their data centre carbon footprint was [7.5M metric tons of CO2e including 4.8 M for capital goods, which includes IT hardware purchases.](<(https://sustainability.atmeta.com/blog/2024/09/10/estimating-embodied-carbon-in-data-center-hardware-down-to-the-individual-screws/)>)

Beyond the primary content itself, organisations must store metadata: descriptions, comments, tags, translations, accessibility features and versioning information, often located in separate databases, which adds up to the computing resources required.

<strong>Data redundancy:</strong>
To ensure reliability and availability, organisations typically store [multiple copies of the same data](https://www.ibm.com/think/topics/data-redundancy) across different locations, formats or systems. While redundancy is critical for data security, disaster recovery and performance optimisation, it carries a significant environmental cost.

### Distribution and networking

For organisations that treat content as their core product, distribution typically accounts for a substantial share of their [operational emissions](https://www.techcarbonstandard.org/impact-categories/operational). This phase encompasses the entire journey from data centre to end-user device.

This generally involves energy consumed by Content Delivery Networks (CDNs) to reduce latency and improve performance, transmission networks moving data between data centres and end-user devices, cable modems and routers, and cloud infrastructure that scales dynamically based on demand. Factors like data transfer distance, content resolution and the efficiency of the infrastructure all play a role.

### End-user consumption

![My Image]({{ site.baseurl }}/hsauve/assets/content/person-watching-netflix.jpg "A person watching Netflix")

<sub>_Photo by [Mollie Sivaram](https://unsplash.com/@molliesivaram) on [Unsplash](https://unsplash.com/photos/black-flat-screen-tv-turned-on-displaying-11-yubCnXAA3H8)_</sub>

Consumption represents the final, and for many organisations, the largest component of content's carbon footprint.
These [downstream emissions](https://www.techcarbonstandard.org/impact-categories/downstream), associated with device energy consumption, vary grately based on how the energy used is generated, device type, content quality and resolution, and consumption duration.

For example, [a 50-inch LED television consumes much more electricity than a smartphone (100 times) or laptop (5 times)](https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines) and whether your consumers are based in France where electricity originates primarily from nuclear power, or in a country that relies on coal for electricity generation will greatly affect your carbon footprint.

The IEA study quoted above also illustrates just how complex measuring downstream emissions can be, and how new demands for emerging technologies including artificial intelligence is rapidly changing the sector.

### What are some solutions to reduce the carbon footprint of content?

There are many aspects of our content consumption that lie beyond individual and organisation control, as the energy manufacturing and powering our devices and data centres heavily relies on fossil fuels. However awareness that everything we do digitally has a carbon footprint serves as a starting point for a wider reflection.

An article by [WIRED](https://www.wired.com/story/youtube-digital-waste-interaction-design/) reports:

> YouTube's annual carbon footprint is about 10Mt CO2e (Million Metric tons of carbon dioxide equivalent), according to researchers — about the output of a city the size of Glasgow. But it doesn't have to be that way, with a few easy design changes easily slashing that footprint by applying Sustainable Interaction Design.

Here are just a few initiatives that organisations can take:

- Smarter web design to optimise websites so users find information quickly.
- Strategic deployment of CDNs to reduce energy use by minimising the physical distance data travels.
- Selecting CDN providers with strong environmental policies and a commitment to renewable energy
- Regular media cleanup: films, videos and photos accumulate quickly and take up storage
- Unsubscribing from unwanted emails as each email has a carbon footprint ([3kg CO2e per year per person, or 12 million tonnes CO2e globally](https://profilebooks.com/wp-content/uploads/wpallimport/files/PDFs/9781788163811_preview.pdf))
