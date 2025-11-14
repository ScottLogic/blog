---
title: Introducing the Latest Version of the Tech Carbon Standard Estimator
date: 2025-11-07 00:00:00 Z
categories:
- Sustainability
- Open Source
- Tech
author: kellis
summary: Introducing the latest enhancements to the Tech Carbon Standard Estimator
  — schema updates, kg CO₂e values, and exportable data.
---

# Introducing the Latest Version of the Tech Carbon Standard Estimator

## Overview

The [Technology Carbon Standard Estimator](https://www.techcarbonstandard.org/estimator) (TCSE) is designed to provide a high-level overview of the potential areas of carbon impact within your IT estate.

The estimations are framed within our proposed model of tech emissions — the Technology Carbon Standard — designed to help you map, measure, and improve the environmental impact of your technology.

Since its inception in July 2024, the TCSE has undergone various updates, and we are excited to announce the next batch of feature enhancements. The idea behind these updates is to ensure the tool continues to be valuable across a variety of use cases, while laying the groundwork for future improvements.

A big thank you to Daniel Moorhouse, Ben Stinchcombe, Max Nyamunda, and Matthew Griffin for all their hard work on these enhancements.

---

## Schema Updates

The TCSE now uses the latest version of the [Tech Carbon Standard](https://www.techcarbonstandard.org/) schema. This is particularly important when it comes to data export, as we can now provide raw emission data in a predefined, consistent structure for users to ingest into their own tools or applications if required.

---

## Emissions Data Available in kg CO₂e and Percentages

Previously, the TCSE only displayed estimated carbon emissions as a percentage breakdown across the four sectors of the Tech Carbon Standard. With this latest release, users can now view this data as either **kg CO₂e** or a percentage breakdown. This provides better context around estimated emissions and makes the tool even more valuable.

We’ve also updated the tool to use the latest version of the CO2.js library, ensuring the most accurate estimates possible.

![Graph in Kilograms]({{site.baseurl}}/kellis/assets/graph-kgs.png "Graph - Kilograms")

![Graph in Percent]({{site.baseurl}}/kellis/assets/graph-percent.png "Graph - Percent")

![Emissions table]({{site.baseurl}}/kellis/assets/table.png "Table - Emissions")

---

## Exportable Data in JSON or PDF Formats

![Export Menu]({{site.baseurl}}/kellis/assets/export.png "Export Menu")

With the addition of kg CO₂e values, it made sense to make this data available beyond the application’s UI. We’ve implemented several export options: users can export data in **JSON** format (which follows the Tech Carbon Standard schema) and optionally include their estimation input values if required. There is also a **PDF** ption, which provides a snapshot of the tree graph and table — useful for users who want to generate and file reports at regular intervals to track changes.

[Download]({{site.baseurl}}/kellis/assets/carbon-estimation.json) example of an exported JSON file

[Download]({{site.baseurl}}/kellis/assets/report.pdf) example of an exported PDF file

---

## Accessibility Updates

Several areas of the application did not fully meet WCAG 2.1 AA standards, so the team used [axe-core](https://github.com/dequelabs/axe-core) to identify and resolve accessibility issues.

---

## Improved Testing

The automation framework has been migrated from Python to TypeScript to leverage all the best features of Playwright. This included adding screenshot comparison testing (particularly helpful for validating the tree graph) and automated accessibility testing.

The new framework also adopts a Page Object Model, making future test writing and maintenance quicker and easier.

---

## What’s Next?

Hot on the heels of this v0.5.0 release, we expect v0.6.0 to be available soon. For this version, we have worked with the team at DEFRA to define features that would make the TCSE a useful tool for UK Government departments to leverage when reporting carbon emissions (part of the [Greening Government strategy](https://www.gov.uk/government/publications/greening-government-commitments-2021-to-2025/greening-government-commitments-2021-to-2025)). This includes a features that estimates carbon emissions for SaaS solutions — primarily Microsoft 365 — along with improved documentation, including a best practice guide that offers tips for entering estimation inputs. Beyond that, we plan to implement emission estimates for both AI inference and model training...watch this space!

---

If you’re interested in learning more about the Tech Carbon Standard Estimator, check out the latest version here [here](https://www.techcarbonstandard.org/estimator) and the GitHub project [here](https://github.com/ScottLogic/sl-tech-carbon-estimator)
