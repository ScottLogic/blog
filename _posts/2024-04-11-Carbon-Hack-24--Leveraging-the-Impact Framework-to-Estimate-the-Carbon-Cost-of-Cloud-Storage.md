---
title: 'Carbon Hack 24: Leveraging the Impact Framework to Estimate the Carbon Cost of Cloud Storage'
date: 2024-04-11 00:00:00 Z
categories:
- Sustainability
tags:
- Sustainability
summary: This is a post on Scott Logic's contribution to the Green Software Foundation's 2024 Carbon Hack.
  Focussing on the energy cost of object storage in the cloud, this post details our process, challenges
  and experiences during the hackathon.
author: mgriffin
---

## Introduction

At Scott Logic, we're committed to helping build a more sustainable tech industry. So, when the opportunity arose to participate in the Green Software Foundation's 2024 Carbon Hack, we jumped at the chance to contribute to this important cause. This blog post serves as a dev diary of the process, covering our challenges, contributions made and attempts to validate them.

The focus of this year’s Carbon Hack was contributing to and using the GSF [Impact Framework](https://if.greensoftware.foundation/). This is a tool for calculating emissions and other factors, made up of lots of small tools implemented as plugins. These are designed to be highly reusable, and any given calculation can make use of a few tools chained together in the style of piping UNIX commands.

The focus of [our submission](https://github.com/Green-Software-Foundation/hack/issues/101) was on calculating the energy cost of object or "blob" storage in the cloud (eg. [Amazon S3](https://aws.amazon.com/pm/serv-s3/)) - an area that is often overlooked when it comes to the environmental impact of software. We collaborated with the UK’s DWP on this project as this is an important aspect of their tech carbon footprint, where a form submission could result in a copy being stored in the cloud for many years. Our aim was to write one or more plugins for the Impact Framework that could calculate the energy used when storing an amount of data in the cloud for a given period.

## Getting Started

While I had previously investigated the Impact Framework upon its initial release, it is clearly still evolving in a positive direction. Asim Hussein’s [workshop](https://grnsft.notion.site/Impact-Framework-Workshop-24100f3553ed42f6b36e61f922c6ea73) on creating a plugin was a valuable source in getting up to speed on the functional way that plugins are now defined and how to create a basic one. However it seemed that there was a lot to be done to take this example further and add unit testing and typescript support. Thankfully we found that this was available in a [template](https://github.com/Green-Software-Foundation/if-plugin-template), which can be used as a starting point for your own plugin repository.

This template also details how to use plugins by directly referencing their Github repository, which is a helpful way of making them available without building a full NPM package. For local testing, while the documentation explains how to use local links to packages on your machine, we found it easier to setup a sub-package in our `examples` directory. This allowed us to pull in all the required dependencies like impact framework and its standard plugins, with a relative path to our own plugins. This meant that anyone could pull down the repository, run `npm install` within the main and examples directory and then use `npx ie –manifest` with one of the example manifest files to execute them.

Once we had this setup, we first created a simple plugin, which we named ‘[Ramboll-Resilio](https://github.com/mgriffin-scottlogic/if-carbon-hack-plugin/tree/main/src/lib/ramboll-resilio)’ based on the authors of a paper called [Assessment of the energy footprint of digital actions and services](https://op.europa.eu/en/publication-detail/-/publication/d3b6c0a1-1171-11ee-b12e-01aa75ed71a1). Part of this paper proposes a simple figure for calculating the energy used to store a Gb of data for a year, which the plugin implements. The paper itself notes that this uses some arbitrary figures and relies on Googles own data, which isn’t ideal but can be a starting point in trying to make an attributional estimation.

## Further research

We struggled to find more official information about how object storage is implemented and measured, so we decided to look at an object storage system that could be deployed locally called [MinIO](https://min.io/docs/minio/container/index.html). This is designed to be compatible with the AWS S3 API while allowing some inspection of what is happening through exposed metrics. This gave us a better understanding of the aspects of object storage that contribute to energy usage. There was some low-level CPU activity, which can increase when data is being read or written, there was memory used to cache data that may be read again soon and there is the data storage itself. Another important consideration is the amount of replication of data that is done to ensure data is secure and recoverable in case of hardware failure.

Thinking about all this it became apparent that a single plugin which took all of this into account would both be complex to write and not really in the spirit of the Impact Framework, where each plugin has one job to do and does it well. We started to consider breaking the components down into different plugins, which could be used for more than just cloud storage.

## Adding further plugins

So first we took the cloud specific aspects and put them into a [cloud-storage-metadata](https://github.com/mgriffin-scottlogic/if-carbon-hack-plugin/tree/main/src/lib/cloud-storage-metadata) plugin, which would retrieve the replication factor based on the vendor and service being used. This was something that the Cloud Carbon Footprint [methodology](https://www.cloudcarbonfootprint.org/docs/methodology#replication-factors) already takes into account. We feel that this plugin could be expanded in future to either include more vendor specific figures or to duplicate observations when data is being stored in different regions with varying carbon intensity.

Another inspiration that the Cloud Carbon Footprint tool provided was their approach to energy consumed by [storage](https://www.cloudcarbonfootprint.org/docs/methodology#storage). Within the tool it uses two different coefficients depending on whether data is stored on HDD or SSD, but this is tied to a point in time industry average in terms of disk capacity and power consumption. An Impact Framework plugin could rely on these figures being passed to it instead, allowing the choice to use an average or specific drive information if known. To perform this calculation we added the [storage-energy](https://github.com/mgriffin-scottlogic/if-carbon-hack-plugin/tree/main/src/lib/storage-energy) plugin.

To complete the storage focus we also added a [storage-read-write-energy](https://github.com/mgriffin-scottlogic/if-carbon-hack-plugin/tree/main/src/lib/storage-read-write-energy) plugin, which requires the power demand of a drive when reading or writing (which can be significantly different than when idle) and its read/write speed in Gb/s. This is used to calculate the minimum time that it must take to transfer data and the drive energy that would be consumed in the process.

## Verification

We also faced some challenges in terms of finding other carbon footprint data to verify our estimations against. For example, if we were to try and use the carbon reporting from some of our own AWS cloud storage, the existing amounts would likely be too small to register. This is because their reporting rounds to the nearest one-tenth of a ton of CO2e, which often results in a figure of zero. And since it also has a 3-month delay in reporting, we couldn't simply upload some new data and see what impact it had before the Carbon Hack finished!

Thankfully, we discovered a very timely [case study](https://www.linkedin.com/pulse/environmental-impact-cloud-common-crawl-case-study-julien-nioche-at8xf/) on the [Common Crawl Foundation](https://commoncrawl.org/) and its environmental impact. Weighing in at ~7.9 Petabytes of data stored, it seemed an ideal opportunity to look at a significant amount of storage where AWS’ Carbon reporting was already complete. Our [common-crawl.yml](https://github.com/mgriffin-scottlogic/if-carbon-hack-plugin/blob/main/examples/common-crawl.yml) manifest file lists the assumptions that we made in attempting to estimate its impact.

While this initially seemed to be orders of magnitude higher than what AWS reports, we were able to have a conversation with the case study’s author, Julien Nioche, which lead us to realise that the article was actually covering the emissions of an internal Common Crawl AWS account, which had a much smaller total of ~115 Terabytes of data. Knowing this we added a secondary [common-crawl-private.yml](https://github.com/mgriffin-scottlogic/if-carbon-hack-plugin/blob/main/examples/common-crawl-private.yml) manifest, which gave us an operational figure closer to that disclosed in the article. Julien may discuss the public dataset in a future post so we will leave that comparison for a later date.

## Embodied Carbon

Another important aspect that wasn’t being covered was the embodied carbon involved in producing storage devices. We initially considered adding another plugin for this but eventually realized that its calculations would essentially be the same as the existing [SCI-M](https://github.com/Green-Software-Foundation/if-plugins/tree/main/src/lib/sci-m) plugin. While the common use case for this plugin is in apportioning a fraction of an entire machine, storing data is an operation where you could instead apportion more than one physical device depending on the amount of data you need to store.

We added this estimation into the common crawl example, making use of some other built-in plugins to change data stored and drive size into the resources-reserved and resources-total figures required by the SCI-M plugin. I think this really highlighted the power of the Impact Framework in terms of creating customised calculation pipelines without writing any more code. Perhaps unsurprisingly, the potential embodied carbon cost turned out to be greater than our operational carbon estimation – another important factor that is not accounted for in AWS carbon reporting.

## Conclusion

Overall, our experience with the 2024 Carbon Hack was extremely rewarding. We were impressed by the rapid pace of changes being made to the Impact Framework, and we're excited to see how other teams have pushed the boundaries of this powerful tool. As the tech industry continues to grapple with its environmental impact, free and open-source tooling with flexible use cases will be essential in increasing adoption of Green Software practices.