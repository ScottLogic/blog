---
title: "Making Digital Emissions Data Work Better: How We Built the Technology Carbon Standard Schema"
date: 2025-07-11 00:00:00 Z
categories:
- Sustainability
tags:
- Sustainability
- Responsible Tech
- Tech Carbon Standard
summary: "Scott Logic created the Technology Carbon Standard Schema, an open-source tool that helps companies measure and share their digital carbon emissions data. With the ICT sector consuming 4% of global electricity, most organisations lack standardised ways to track their technology-related carbon footprint. The schema provides a structured format for measuring and exchanging this data between companies."
author: drees
---

The ICT sector now consumes about 4% of global electricity - a figure that continues growing rapidly as our digital world expands. Yet despite this substantial energy footprint, most companies have no clear way to measure or share information about their digital carbon emissions.
At Scott Logic, we created the [Technology Carbon Standard Schema](https://www.techcarbonstandard.org/schemas/implementation-guide) to help solve this. It's an open-source tool that helps organisations measure their technology-related carbon emissions. Our latest version makes it much easier for companies to share this data in a way that others can actually use.


## Why Digital Emissions Data Is Hard to Find and Use

When trying to find a company's carbon emissions data today, you probably have to download a large PDF sustainability report, search through dozens of pages, and hope to find the information is there. Even if you find it, the data might be formatted differently from every other company you look at.

This creates real problems. Companies can't easily compare their emissions with others in their industry. They can't automatically calculate emissions from their suppliers, or track their carbon reduction progress. Tools that could help track these commitments across the industry sectors simply can't work because the data isn't accessible.


## Working with Green Web Foundation

We found the solution with [Green Web Foundation](https://www.thegreenwebfoundation.org/) and their [carbon.txt](https://carbontxt.org/) project. They had already figured out an important piece of the puzzle - where companies should put their sustainability data so others can find it easily.

The carbon.txt approach is simple. Companies publish their sustainability information in a structured file at a predictable web address, like yourcompany.com/carbon.txt. This means anyone looking for that data knows exactly where to find it.

The carbon.txt project solved the "where to find it" problem. Our [Technology Carbon Standard Schema](https://www.techcarbonstandard.org/schemas/implementation-guide) solves the "how to structure it" problem. Together, they create a complete system for sharing digital emissions data.


## How We Built the Schema

We designed our schema to be modular, nesting multiple individual schemas together. This approach helps solve several real-world problems that companies face when reporting emissions data.

The [Router Schema](https://www.techcarbonstandard.org/schemas/router/) acts like a traffic controller. When someone validates a company's emissions data, it automatically sends them to the right version of our standard. This means companies can update to newer versions without breaking their old data.

The [Reporting Organisation Schema](https://www.techcarbonstandard.org/schemas/reporting-organisation/v0-1-0) captures basic information about the company and holds all their emissions reports in one place. Think of it as the cover page that introduces the organisation and contains all their annual reports.

The [Emissions Report Schema](https://www.techcarbonstandard.org/schemas/emissions-report/v0-0-1) defines what goes into each individual report,  such as the time period, the business unit (i.e. a sub-group, region or country), whether the data was verified by an outside auditor, and links to detailed methodology documents.

All of this structure ultimately leads to the core emissions data contained in the [Tech Carbon Standard Schema](https://www.techcarbonstandard.org/schemas/tech-carbon-standard/v0-0-1). This is where all the actual emissions values or stored, organised into four clear categories, Upstream, Direct Operational, Indirect Operational and Downstream emissions.

This building block approach is a key feature of the schema design as it means companies can break down their emissions reporting by logical business units, support year over year reports,  each using different versions of the standard, without requiring them to update previous reports.


## The Four Types of Digital Emissions

We organise digital emissions into four categories that cover all aspects of technology use in organisations.

**Upstream Emissions** include the carbon that went into producing the technology before a company acquires it. This covers manufacturing laptops and servers, building software, and shipping equipment. These emissions already happened, but they've become part of a company's total footprint.

**Direct Emissions** cover the electricity a company uses to run their technology. This includes powering office computers, running servers in their own data centres, and keeping network equipment running. Companies have direct control over these emissions.

**Indirect Emissions** include technology services that other companies provide. Cloud computing, software subscriptions, managed IT services, and the electricity remote employees use all fall into this category. These emissions happen because of the company's activities but aren't under their direct control.

**Downstream Emissions** consider how customers use the company's products or services. When someone visits a website, their device uses electricity and data travels through network infrastructure. Companies that provide digital services create these emissions indirectly.

This structure follows established frameworks like the GHG Protocol while giving companies enough detail to identify specific ways to reduce their emissions.


## Making Data Useful for Everyone

Publishing emissions data as structured files at predictable web addresses creates new possibilities. A company's supply chain emissions data could be gathered from all their upstream suppliers instantly on demand. Procurement systems could also help companies choose lower-carbon options when buying technology services.

These capabilities become possible when emissions data follows consistent formats that can be read and processed automatically.


## Starting Where You Are

We designed our system so companies can start with whatever data they have. Every category and measurement is optional. Companies can begin by reporting just the emissions they know about and add more categories as they learn to measure them.

Don't expect perfection when starting out, a rough estimate with whatever data you have is better than no estimate. The key is being transparent with your methods and assumptions.

Our schema includes space for companies to explain how they calculated each value and what assumptions they made. This transparency builds trust and helps everyone improve their methods over time.


## The Bigger Picture: Supply Chain Transparency

The real potential comes when this approach spreads across the technology industry. Right now, companies have to estimate their supply chain emissions using rough calculations based on how much money they spend with different suppliers.

When technology suppliers start publishing their emissions data in standardised formats, companies can calculate much more accurate numbers. This creates incentives for suppliers to actually reduce their emissions rather than just claiming they have.


## Moving Forward
The Technology Carbon Standard Schema gives the technology industry infrastructure for better environmental accountability. By making digital emissions data easy to find, compare, and use, we're building the foundation for real progress on climate impact.

The whole system is open source and designed to work with carbon.txt. Companies ready to start can begin with their existing data, document their methods clearly, and publish everything in a format others can discover and use.

The technology sector has the tools and expertise to lead on climate transparency. The question for each organisation is whether they want to be among the first to embrace this transparency or wait for others to go first.

- Get started with the Technology Carbon Standard schema here: [Technology Carbon Standard Schema Implentation Guide.](https://www.techcarbonstandard.org/schemas/implementation-guide)

- [Visit the Github project if you would like to contribute to the technology carbon standard](https://github.com/ScottLogic/Technology-Carbon-Standard)

- Or if you need any help and advice to create or consume the TCS data, then [get in touch with Scott Logic](https://www.scottlogic.com/contact-us)
