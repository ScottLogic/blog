---
author: ceberhardt
layout: default_post
title: "Open source in financial services, bridging the contribution gap"
summary: "We recently worked on a research project, exploring open source issues and challenges within financial services organisations. We found that consumption is “acceptable” rather than “encouraged”, with security concerns representing the biggest obstacle. On the flip-side, open source maintainers don’t wish to invest further in security. Financial services organisations, whose contribution policies lag behind, need to bridge this gap in order to fully capitalise on the value open source presents."
image: ceberhardt/assets/finos-survey/thumbnail.png
categories:
  - Open Source
---

We recently worked on a research project, exploring open source issues and challenges within financial services organisations. We found that consumption is “acceptable” rather than “encouraged”, with security concerns representing the biggest obstacle. On the flip-side, open source maintainers don’t wish to invest further in security. Financial services organisations, whose contribution policies lag behind, need to bridge this gap in order to fully capitalise on the value open source presents.

## Introduction

Over the past six months I’ve been working on a research project (in close collaboration with friends from FINOS, Linux Foundation Research, GitHub and Wipro) looking at open source within financial services. The survey, interviews and research cover a broad range of topics, including governance, culture, contribution, motivations and more. You can access the full report on the [FINOS website](https://www.finos.org/state-of-open-source-in-financial-services-2021).

In this post, I’ll delve into some of the survey findings in a little more detail; looking at the two sides of the open source equation, consumption and contribution. I’ll also draw on the [FOSS Contributor survey](https://www.linuxfoundation.org/wp-content/uploads/2020FOSSContributorSurveyReport_121020.pdf), which Linux Foundation published in 2020 (FOSS is an acronym for Free and Open Source Software). 

The FINOS survey respondents are predominantly employees within financial services organisations, and tend to be consumers of open source. Whereas the respondents to the FOSS contributor survey are active contributors / maintainers, and can be seen as producers of open source software. This gives an interesting contrast - ideally the two sides should be aligned in a way that creates mutual benefit.

## Consumption

Open source is pretty much inescapable these days, many of the core building blocks that we use (languages and frameworks) are open source, as is much of the infrastructure we deploy to (e.g. Kubernetes).

Whilst most organisations have clear policies regarding open source consumption (i.e. using open source software), it doesn’t necessarily mean that developers are encouraged, or feel confident in doing so. Within financial services, there is a burden of responsibility that isn’t so acutely felt in other sectors.

We asked respondents to describe their employer’s policy on incorporating open source libraries into their codebase (i.e. consuming):

*NOTE: The exact same survey wording was used in both the FINOS and FOSS Contributor surveys*

<img src="{{site.baseurl}}/ceberhardt/assets/finos-survey/consumption.png"/>

Within financial services organisations open source consumption is seen as acceptable, rather than encouraged. However respondents to the FOSS contributors survey tend to work at organisations where it is encouraged. 

Open source might be free to use, but that doesn’t mean it comes without a ‘cost’. The burden of responsibility regarding security, longevity and support often sits on the shoulders of the consumer. These hidden costs need to be considered when using open source software.

We asked about the challenges people face when using open source software:

<img src="{{site.baseurl}}/ceberhardt/assets/finos-survey/challenges.png"/>

Concerns regarding security and vulnerabilities were most frequently cited, with the next two highest challenges both relating to “good decision making”. Again, both speak to the burden of responsibility felt by developers.

The FOSS contributor survey was targeted at the creators of open source software. It’s interesting to contrast the challenges the financial services consumers have with the challenges felt by the creators.

A key finding of the FOSS contributor was that there is a need to dedicate more effort to the security of open source projects:

> All types of contributors reported they spend very little of their time responding to security issues (an average of 2.27% of their total contribution time) and reported that they do not desire to increase this significantly.

If the open source contributors and maintainers do not wish to spend more time on matters of security, how should these security issues be addressed?

> When asked what would be the most beneficial contribution to their FOSS projects, survey participants pointed to bug/security fixes, free security audits, and simplified ways to add security-related tools to their CI pipelines.

There is a clear gap here.

The biggest obstacle financial services developers face when wishing to consume open source software is “security”, however the FOSS contributors and maintainers don’t wish to invest more of their own time on these matters and are seeking external support.

Should financial services organisations be offering this support? I’m going to be bold and simply say “yes”!

However, in order to provide support this requires financial services organisations to contribute. Let’s have a look at their readiness and willingness to do so ...

## Contribution

We asked respondents to describe their employer’s open source contribution policy:

<img src="{{site.baseurl}}/ceberhardt/assets/finos-survey/contributing.png"/>

A significant number (30%) answered that there was no clear policy or that they were not sure, and for 9% their understanding of their employer's contribution policy is that upstream contribution is prohibited. 

When comparing with the FOSS contributor survey, the most stark difference is the number who “always contribute upstream” (36% vs. 8%). Although it is worth noting that individuals who are active contributors to open source will likely choose an employer with a more permissive open source policy.

Interestingly, if we segment the FINOS survey results by company size, we see a divide emerging:

<img src="{{site.baseurl}}/ceberhardt/assets/finos-survey/contributing-by-size.png"/>

The very large organisations (30,000+ employees), which tend to be top-tier / global banks, have clearer policies, which is no doubt due to the more rigorous policy and compliance training. But they also tend to be less welcoming of upstream contribution.

We asked respondents to describe what they feel are the factors that limit their employer’s open source investment. Again, splitting the results by company size:

<img src="{{site.baseurl}}/ceberhardt/assets/finos-survey/limits-small.png"/>

A “fear of leaking IP” is the greatest (perceived) concern.

If we look at the same results for the respondents working at the very largest of organisations, the concerns run in a similar order, but are heightened (e.g. agreement that IP leakage is a concern rises from 65% to 77%)

<img src="{{site.baseurl}}/ceberhardt/assets/finos-survey/limits-large.png"/>

When looking at these top three concerns, I must admit, I’m a little perplexed. Here are my very off-the-cuff thoughts on each. I’m going to be blunt!

**A fear of leaking IP** - the vast majority of open source I’ve seen consumed with financial services organisations is framework and infrastructure code. This is code that is used across almost every industry sector, there is nothing financial services-specific about this stuff. The likelihood of leaking some (domain specific) IP via contribution to a general purpose framework or infrastructure project seems incredibly small!

**Legal or licensing concerns** - The vast majority of open source projects use mature and well-understood licenses. I’m sure the legal teams that sit within organisations with 30,000+ employees, who are able to adhere to the regulatory frameworks of the numerous countries they operate in are up to this challenge!

**A lack of understanding of the value proposition** - well, let’s ask the survey respondents what they think? 

We asked them why their employer should invest and contribute:

<img src="{{site.baseurl}}/ceberhardt/assets/finos-survey/why-invest.png"/>

That it would help them become a more attractive employer came out on top. Circling back to the FOSS contributor survey, 65% of respondents said that their current employer’s support for open source influenced their decision. It clearly does make a difference.

## Conclusions

In summary, we found that within financial services organisations consumption is “acceptable” rather than “encouraged”, with security concerns representing the biggest obstacle. On the flip-side, open source maintainers don’t wish to invest further in security. 

Financial services organisations appear very reluctant to contribute to open source, in other words, they observe these security issues but are not able to “roll their sleeves up” and tackle them. This problem is even more acute in the largest of banks.

The concerns that limit open source contribution (IP concerns, legal and a lack of value proposition) all seem quite misplaced (in my opinion).

If we’re going to overcome this impasse (consumption limited by security concerns, and maintainers unwilling to address them), the financial services industry is going to have to overcome these concerns, bridge the gap, and lend a hand!

