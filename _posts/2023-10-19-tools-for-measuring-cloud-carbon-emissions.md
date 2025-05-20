---
title: Tools for measuring Cloud Carbon Emissions
date: 2023-10-19 00:00:00 Z
categories:
- Sustainability
- Cloud
tags:
- Cloud
- Sustainability
- featured
summary: In this post I'll discuss ways of estimating the emissions caused by your
  Cloud workloads as a first step towards reaching your organisation's Net Zero goals.
author: dsmith
image: "/uploads/Tools%20for%20measuring%20cloud.png"
layout: default_post
---

> Note: this blog post is a bit out-of-date so I've published a [new version with some updates for 2025](https://blog.scottlogic.com/2025/05/21/tools-for-measuring-cloud-carbon-emissions.html).

# Introduction

In my [previous blog post](https://blog.scottlogic.com/2022/04/07/cloud-sustainability-reach-net-zero.html) I discussed how migrating to the Cloud could help your organisation reach its Net Zero goals. I discussed how shifting your workloads away from on-premises data centres can reduce emissions by allowing you to leverage the expertise of cloud providers and their greater efficiency of scale. It should be noted this isn’t always clear cut - do consider how energy efficient your current hosting is and the [embodied carbon](https://blog.scottlogic.com/2023/09/28/embodied-carbon-from-software-development.html) of any hardware you’d be decommissioning.

If you're using the Cloud there are many ways to optimise your infrastructure and applications to reduce emissions. A key part of optimisation is to first measure what you are trying to optimise. This allows you to identify where the biggest wins can be achieved and understand whether you are succeeding in your efforts over time.

Luckily there are several tools available to help with measuring carbon emissions associated with your Cloud workloads. These are provided by the Cloud Service Providers (CSPs) and are also available from third-parties including Open Source tools. In this blog post I will discuss and evaluate these tools, their features, methodologies and limitations.


## Understanding Carbon measurement

Calculating emissions of Greenhouse Gasses (GHGs) is complicated and it is important that a consistent standard is used to allow meaningful comparisons between organisations. The most widely used standard is the [GHG protocol](https://ghgprotocol.org/) which is used by 90% of Fortune 500 companies to measure and report on their emissions. I’ll give a brief introduction to this standard to give some context to the methodologies used by carbon measurement tools but for a more comprehensive guide the [Green Software Foundation](https://greensoftware.foundation/) provides an excellent and free [training course](https://learn.greensoftware.foundation/).

The [GHG Protocol](https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf) defines three categories or “scopes” for your emissions. The first scope is for direct emissions i.e. “sources that are owned or controlled by the company” and the second is for “electricity indirect emissions” i.e. “electricity consumed by the company”. Taking GCP’s carbon reporting methodology as an example, they report scope one emissions resulting from diesel backup generators and scope two emissions resulting from electricity consumed from the local grid.

There are two different ways to report scope two emissions, a “market-based” and “location-based” approach. Market-based reporting takes into account purchases of renewable energy whereas location-based metrics use the (typically average) intensity of the local grid where the electricity is consumed. For the purposes of understanding how you can reduce the impact of your workloads on overall GHG emissions a location-based metric is preferable. This metric tells you the raw amount of GHG emissions resulting from your workloads which you can then optimise.

The final scope (scope three) is for “other indirect GHG emissions” which is an (optional) catch-all category for emissions which are “a consequence of the activities of the company, but occur from sources not owned or controlled by the company”. It is important to track cloud provider’s scope three emissions since these can constitute a large proportion of the emissions resulting from cloud workloads. This means tracking the emissions associated with the full hardware lifecycle for servers and networking equipment. This is often referred to as the “embodied carbon” for a piece of hardware. There are also scope three emissions related to operation of the data centres which can be harder to estimate such as embodied carbon in the building materials and employee commuting.

It’s also worth noting that for your company, all the emissions of your cloud provider related to your activities would count as part of your scope three emissions. Ideally, we’d like our tooling to report on all three scopes to get the most complete picture.


# Cloud Service Provider Tools

## GCP: Carbon Footprint

The GCP Carbon Footprint tool is available for all accounts and to any user that is granted the relevant [IAM permissions](https://cloud.google.com/carbon-footprint/docs/iam). There is a dedicated role to access the tool which is great because it allows you to give anyone access to emissions data without also having to also give them access to billing data.

The Carbon Footprint tool shows a breakdown of emissions by GCP Project, Region and Product. It includes all three scopes of emissions and clearly states that a location-based approach is used to calculate scope two emissions. At time of writing GCP is [currently working](https://cloud.google.com/carbon-footprint/docs/methodology) on also making available market-based emissions data.

The [methodology used to calculate emissions](https://cloud.google.com/carbon-footprint/docs/methodology) is made available and is an interesting read. Perhaps the most interesting part of their approach is that emissions are calculated on an hourly basis. This allows them to take into account the varying mix of energy sources in use in the local grid and match it with their hourly electricity load data. This should make the calculations more accurate. Although the data is matched on an hourly basis the dashboard updates monthly.


## Azure: Impact Emissions Dashboard

The Azure Impact Emissions Dashboard is based on Microsoft’s Power BI Pro. Unfortunately, it is only available to customers on a EA, Microsoft Customer Agreement or CSP. Since I don’t have access to an account with any of these agreements in place my evaluation has been limited to reviewing documentation and [demonstrations](https://www.microsoft.com/videoplayer/embed/RE5609f?WT.mc_id=industry_inproduct_solncenterSustainability) provided by Microsoft.

The dashboard has a similar breakdown to the GCP tool and shows a breakdown of emissions by Azure Subscription, Region and Service. It also optionally includes scope three emissions and the methodology for calculating these is documented in a [white paper supplied by Microsoft](https://go.microsoft.com/fwlink/p/?linkid=2161861\&clcid=0x409\&culture=en-us\&country=us). While not explicitly stated, it appears that scope two emissions are calculated using a market-based approach. The dashboard updates on a monthly basis.


## AWS: Customer Carbon Footprint Tool

The AWS Customer Carbon Footprint tool is available for all accounts and to any user with the [relevant permissions](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/what-is-ccft.html#ccft-gettingstarted-IAM). There isn’t a dedicated role like the one supplied by GCP but setting one up yourself would be fairly trivial. You can then make this role available to the required users to view the dashboard.

You can see emissions over time with the tool, broken down by geography and service. The geographical breakdown is fairly coarse-grained and only shows geographical groupings such as AMER and EMEA rather than AWS Regions. The service breakdown only shows usage by EC2, Amazon Simple Storage Service (S3). Emissions for any other services are grouped together and presented as one number. It’s hard to see how these breakdowns could be used to drive meaningful optimisations but hopefully this is just the starting point and will be expanded as the tool evolves.

The data for the tool is delayed by three months which is a significant limitation compared to the other tools discussed. Additionally the figures are rounded to the nearest point-one tons of CO2 equivalent GHG emissions. For context, according to the [US EPA](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator) this rounding amount is equivalent to 233 miles driven by the average gasoline-powered passenger vehicle.

For scope two emissions, only a market-based approach is available. The result of this is that in the console you won’t be able to see any usage which has been offset by the purchase of renewable energy. This could be fine for reporting purposes but is less useful if you’d like to optimise your infrastructure to reduce emissions. This is worth doing since even when investments in renewable energy have been made by the CSP their servers are still pulling power from a grid with non-zero carbon intensity.

In terms of Scope three emissions, these are planned to be added to the dashboard for early 2024, this is a little behind the other companies who have had this data available since 2021.

# Third-party tools

## Cloud Carbon Footprint (CCF)

Cloud Carbon Footprint is an open source tool which was originally developed by Thoughtworks. It uses Etsy’s [Cloud Jewels](https://www.etsy.com/codeascraft/cloud-jewels-estimating-kwh-in-the-cloud) approach to estimate the emissions associated with cloud workloads. This is done using the information provided by CSPs for the purposes of itemised billing. It supports AWS, GCP and Azure which means if you’re using more than one of these providers you can use a consistent approach for measuring emissions.

The methodology is described in detail on the [CCF website](https://www.cloudcarbonfootprint.org/docs/methodology) but to summarise, the tool is able to use information about the energy consumed by different server hardware, the average emissions for a certain amount of energy on the local grid and your itemised usage to work out estimated emissions for your workloads. It should be noted that the above estimation only covers scope two emissions and
[scope one emissions are not included](https://github.com/cloud-carbon-footprint/cloud-carbon-footprint/issues/289). It also estimates the scope three emissions for server hardware by proportionally allocating the estimated embodied carbon based on your usage. The tool doesn’t currently estimate embodied carbon for networking hardware and also doesn’t include other scope three emissions which only cloud providers will have access to such as employee commutes. 

These figures aren’t exact but they can give an idea of emissions and as long as a consistent approach is used, relative improvements can be measured. The same approach can be used across different cloud providers and even [against on-premise](https://www.cloudcarbonfootprint.org/docs/on-premise) data centres giving a clearer picture of emissions across your IT estate.

The tool shows breakdowns by region, account and service. This can help identify hotspots which should be addressed. For example, if most of your emissions are coming from storage then investing time into archiving, compressing or deleting data might yield good results. If certain accounts have high emissions then it may be beneficial to work with the teams which own those accounts to bring emissions down.

To further assist with optimisation the tool hooks into recommendation APIs provided by CSPs. These APIs identify things like overprovisioned hardware and idle machines. CCF is able to take this information and work out which changes would provide the highest emissions savings.

The data can be updated on a daily basis which is much more frequently than the CSP dashboards. This is useful for ongoing monitoring and optimisation of emissions since you should be able to notice if a specific change has resulted in a spike so it can be rolled-back or fixed.

Setting up the tool is a bit more involved than using the built-in dashboards. Some infrastructure is required to connect data into the tool such as roles, reports and database tables.

## Software as a Service (SaaS) solutions

There are some SaaS solutions such as [Climatiq](https://www.climatiq.io/) and [Greenpixie](https://greenpixie.com/) which provide similar functionality to CCF but also take care of hosting. I haven’t evaluated these providers in depth but if deploying the solution is a deal-breaker these may be worth looking into.

# Summary

Each of the big three Cloud providers evaluated has their own tooling for measuring carbon emissions. These are of varying levels of maturity, robustness and transparency in terms of methodology. There are also third-party tools available which have their own benefits and trade-offs. This is a rapidly evolving space and each of these tools will likely evolve over the next few years so whichever approach you go with it’s worth regularly reviewing to see if better options are available.

One further thing to consider if you use more than one Cloud provider - is how comparable are the figures across the different tools? It will likely be far more convenient (and more of an apples to apples comparison) if you use a cross Cloud solution like CCF. CCF also has the advantage of having a transparent open source methodology. For these reasons, it is the solution we have selected to measure Scott Logic’s own Cloud Carbon Footprint.

For reference, I’ve prepared a comparison of the features of the different tooling which may be useful in choosing your preferred approach:

| **GCP**                                                                                                     | **Azure**                             | **AWS**                                                                                                         | **CCF**                     |                      |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------- |
| 1, 2 and 3                                                                                                  | 1, 2 and 3                            | 1 and 2\*                                                                                                       | 2 and 3                  | **Scopes covered**   |
| Location-based \*\*                                                                                         | Market-based                          | Market-based                                                                                                    | Location-based              | **Scope 2 approach** |
| Data centre operations, employee commutes and embodied emissions from data centre hardware and construction | Hardware lifecycle embodied emissions | N/A\*                                                                                                           | Server embodied carbon      | **Scope 3 approach** |
| Monthly                                                                                                     | Monthly                               | Monthly ([with 3 month delay](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ccft-overview.html)) | Daily                       | **Update frequency** |
| Month                                                                                                       | Month                                 | Month                                                                                                           | Day                         | **Granularity**      |
| Service, project and region                                                                                 | Service, subscription and region      | Service\*\*\*, account and geography\*\*\*\*                                                                    | Service, account and region | **Breakdowns**       |

\* Scope 3 emissions planned for AWS Cloud Carbon Footprint tool in early 2024.

\*\* Market-based metrics planned for GCP Carbon Footprint although timelines are TBC.

\*\*\* All services other than compute and storage are grouped into “other”.

\*\*\*\* Geography refers to wider geographical areas such as AMER, APAC and EMEA.
