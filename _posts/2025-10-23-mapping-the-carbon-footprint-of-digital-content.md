---
title: Mapping the carbon footprint of digital content
date: 2025-10-23 00:00:00 Z
categories:
  - Sustainability
  - Tech
tags:
  - Tech
  - Sustainability
  - Sustainable AI
summary: Following the latest update of the Technology Carbon Standard, this blog explores the carbon footprint of digital content throughout its entire lifecycle, highlighting key carbon emissions hotspots and offering strategies to mitigate them.
author: hsauve
---

As part of the [latest update](https://blog.scottlogic.com/2025/09/04/technology-carbon-standard-update-4-sept.html) of the [Technology Carbon Standard](https://www.techcarbonstandard.org/), the Sustainability Team at Scott Logic added a new category focusing on content.

Whilst the standard previously focused on hardware and software, content has emerged as a distinct and substantial source of carbon emissions that deserves its own analysis. Despite its growing environmental impact, content has traditionally received less attention. As organisations produce and distribute content at exponential scales, the sustainability implications must be addressed.

## The carbon journey of content

Whether content is treated as a commodity or public good, in the case of cultural heritage with digital libraries as an example, understanding the environmental impact of handling digital content requires examining its lifecycle.

We looked at ways to locate these emissions across all kinds of media, from news articles and blog posts through to photos, audio files and videos. This cluster includes everything from video and music streaming, video conferencing, social media and emails.

![A person wearing a red long-sleeved shirt operates a video camera, while another person observes the scene being filmed]({{ site.baseurl }}/hsauve/assets/content/two-people-filming.jpg "A person operating a video camera, while another person observes")

<small>_Photo by [Marcos Rocha](https://unsplash.com/@marcosrochatv) on [Unsplash](https://unsplash.com/photos/man-in-red-long-sleeve-shirt-using-black-video-camera-_XgGN5yo1QE)_</small>

### Content production

Content production activites include energy consumption from equipment operation (lighting, cameras, computers), physical production (sets, construction materials, costumes and props), location production and travel, and increasingly artificial intelligence tools for editing and visual effects.

Carbon emissions associated with production vary considerably depending on methods and technologies used. Organisations must identify best practices that can limit their environmental impact. Various strategies such as investing in energy-efficient technologies, working with sustainable suppliers and adopting responsible practices like [repurposing set materials](https://www.bbc.co.uk/news/articles/cj3m83pv5lyo) are just some examples.

### Production of hardware and software

The journey of digital content begins long before creation. This category captures [upstream carbon emissions](https://www.techcarbonstandard.org/impact-categories/upstream) generated during the extraction, manufacturing and transportation of raw materials used throughout the content lifecycle. These emissions, although not directly resulting from an organisation's operations, are embedded in the products they use and should be accounted for.

![An ultrawide monitor displaying a video editing software in use]({{ site.baseurl }}/hsauve/assets/content/editing.jpg "A monitor displaying a video editing software")

<small>_Photo by [Jakob Owens](https://unsplash.com/@jakobowens1) on [Unsplash](https://unsplash.com/photos/black-flat-screen-tv-turned-on-displaying-game-B4f_Kx5jvpg)_</small>

In the case of content, this could include hardware such as cameras, microphones, headphones, memory cards, laptops, hard drives and lighting equipment to name just a few. The software footprint on the other hand is the result of the energy needed for coding, testing and deploying applications such as editing platforms or scriptwriting software.
This category also encompasses the embodied carbon of network equipment such as fiber optic cables, satellite systems and routing infrastructure.

As technology advances and manufacturers release new models, encouraging consumers to replace their devices, or forcing upgrades by refusing to update software, e-waste has become one of the fastest growing solid waste streams in the world. In 2022 alone it is estimated that [62 million tonnes of e-waste were produced globally](https://www.who.int/news-room/fact-sheets/detail/electronic-waste-%28e-waste%29), highlighting a pressing environmental challenge.

### Storage and processing

Modern organisations generate data at unprecedented rates, creating a growing demand for efficient storage and processing infrastructure. Whether managing gigabytes or petabytes, the storage layer represents a significant emissions source. These emissions originate from operations requiring substantial computation and cooling systems, embodied carbon of data centre hardware as well as processing and transcoding needed before distribution.

The growth of cloud computing has been pivotal for many organisations, allowing them to store and process data remotely. However, this has also increased the demand for large-scale data centres which are incredibly energy-intensive.

> As an example, in 2023, Meta reported that their data centre carbon footprint was [7.5M metric tons of CO2e including 4.8 M for capital goods, which includes IT hardware purchases.](https://sustainability.atmeta.com/blog/2024/09/10/estimating-embodied-carbon-in-data-center-hardware-down-to-the-individual-screws/)

Beyond the primary content itself, organisations must store metadata: descriptions, comments, tags, translations, accessibility features and versioning information, often located in separate databases, which adds up to the computing resources required.

Versioning itself considerably increases storage volume as each new version of a file is a whole new copy, rather than an update to an existing copy.

- **Data redundancy**

To ensure reliability and availability, organisations typically store [multiple copies of the same data](https://www.ibm.com/think/topics/data-redundancy) across different locations, formats or systems. While redundancy is critical for data security, disaster recovery and performance optimisation, it carries a significant environmental cost.

- **Dark data**

A vast majority of companies' stored data is considered "dark". It is unusable (due to incompatible formats or missing metadata) and is not accessible to analytical tools, which makes it very hard to quantify. [According to a survey quoted by an IBM article](https://www.ibm.com/think/topics/dark-data) that:

> 60% of business and IT decision makers reported that half or more of their organisation’s data was considered dark. A full one-third of respondents reported this amount to be 75% or more.

This staggering unused data doesn’t just gather digital dust, it consumes storage space, drives up energy demands, and directly contributes to avoidable carbon emissions.

### Distribution and networking

For organisations that treat content as their core product, distribution typically accounts for a substantial share of their [operational emissions](https://www.techcarbonstandard.org/impact-categories/operational). This phase encompasses the entire journey from data centre to end-user device.

This generally involves energy consumed by Content Delivery Networks (CDNs) to reduce latency and improve performance, transmission networks moving data between data centres and end-user devices, cable modems and routers, and cloud infrastructure that scales dynamically based on demand. Factors like data transfer distance, content resolution and the efficiency of the infrastructure all play a role.

However, the environmental impact of distribution is not fixed. CDNs reduce both server load and energy consumption by deploying caches closer to users, enabling more efficient content delivery. Oxford University researchers have proposed a [carbon-intelligent content delivery scheduling](https://eng.ox.ac.uk/media/ixmfuz43/elzahr25cics.pdf) to help streaming companies align operational efficiency with sustainability goals. Since carbon intensity varies significantly across regions and fluctuates hourly, daily and seasonally, carefully selecting time-slots can substantially minimise the carbon footprint of these operations.

### End-user consumption

![A person watches Netflix with their feet up on a coffee table, wearing white socks]({{ site.baseurl }}/hsauve/assets/content/person-watching-netflix.jpg "A person watching Netflix")

<small>_Photo by [Mollie Sivaram](https://unsplash.com/@molliesivaram) on [Unsplash](https://unsplash.com/photos/black-flat-screen-tv-turned-on-displaying-11-yubCnXAA3H8)_</small>

Consumption represents the final, and for many organisations, the largest component of content's carbon footprint.
These [downstream emissions](https://www.techcarbonstandard.org/impact-categories/downstream), associated with device energy consumption, vary greately based on how the energy used is generated, device type, content quality and resolution, and consumption duration.

For example, [a 50-inch LED television consumes much more electricity than a smartphone (100 times) or laptop (5 times)](https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines) and the location your consumers are based in will greatly affect your carbon footprint. Indeed, consumers based in France where electricity originates primarily from nuclear power will have a much lower carbon impact than those living in countries that rely on coal for electricity generation.

The IEA study quoted above also illustrates just how complex measuring downstream emissions can be, and how new demands for emerging technologies including artificial intelligence is rapidly changing the sector.

### What are some solutions to reduce the carbon footprint of content?

There are many aspects of our content consumption that lie beyond individual and organisation control, as the energy manufacturing and powering our devices and data centres heavily relies on fossil fuels, and reliable carbon figures from big tech companies are absent.
However awareness that everything we do digitally has a carbon footprint serves as a starting point for a wider reflection.

Research demonstrates the potential for meaningful impact. An article by [WIRED](https://www.wired.com/story/youtube-digital-waste-interaction-design/) reports:

> YouTube's annual carbon footprint is about 10Mt CO2e (Million Metric tons of carbon dioxide equivalent), according to researchers — about the output of a city the size of Glasgow.

Encouragingly, the same research suggests that this footprint doesn't have to be inevitable; applying Sustainable Interaction Design principles could substantially reduce it.

For content platforms and organisations:

- Smarter web design (e.g. faster loading time, image and content optimisation) so users find information quickly.
- Eliminating "digital waste" of showing videos to users only listening to the audio
- Strategic deployment of CDNs to reduce energy use by minimising the physical distance data travels.
- Selecting CDN providers with strong environmental policies and a commitment to renewable energy
- Comprehensive data audit: organisations are often unaware of the existence of dark data but bringing it to the surface can considerably free up storage
- Regular media cleanup: films, videos and photos accumulate quickly and take up storage

While individual actions have limited systemic impact, they contribute to broader awareness. Individual users should consider:

- Unsubscribing from unwanted emails, to reduce unnecessary data transmission across networks. Collectively, emails generate approximately [12 million tonnes CO2e globally per year](https://profilebooks.com/wp-content/uploads/wpallimport/files/PDFs/9781788163811_preview.pdf).
- Being intentional about consumption. For instance stream at appropriate quality levels rather than maximum resolution, and regularly delete unused files minimises personal device energy use.

### Conclusion

Through our work on the Technology Carbon Standard, it became apparent that the vast majority of digital content's environmental impact remains hidden. By examining the complete lifecycle, from production through to consumption, organisations can identify the key carbon hotspots within their operations and implement targeted measures to reduce their footprint.

While some factors lie beyond individual control, both organisations and individuals have considerable agency in that space, starting with recognising that each of our digital interactions carries an environmental cost.
