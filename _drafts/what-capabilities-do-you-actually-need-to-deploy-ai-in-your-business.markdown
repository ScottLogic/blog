---
title: What capabilities do you actually need to deploy AI in your business?
date: 2023-11-22 16:26:00 Z
categories:
- Artificial Intelligence
tags:
- artificial intelligence
- AI
- research
- research culture
- capabilities
- capability models
author: jheward
---

There is a lot of hype around AI at the moment, with the current wave sparked by the release of ChatGPT in early 2023. This hype has thrust AI into the minds of many leaders and their organisations, who are now looking at how they should respond. Even where organisations have software development capability, not many have experience with AI or Machine Learning (ML). Deciding what capabilities your organisation requires to deploy these technologies can be daunting.

In this post, I’ll provide an overview of the capability models that are out there, summarise the distinct capabilities required for AI/ML projects, and make the case for what I believe to be the most important capability your organisation will require.

## Existing capability models

Some capability models for developing AI/ML applications do already exist, although they’re fairly nascent. Two popular ones are MLOps from Google and ModelOps from IBM. These both contain a view of the organisational capabilities required to deliver AI/ML applications in production at scale.

However, given the vast size of the corporations that produced them, these capability models carry a lot of in-built assumptions about the ease with which they can be adopted. For example, while both models talk about the importance of experimentation in the AI/ML space, they take it for granted that organisations are set up to foster experimentation and manage it successfully.

So, how much of the AI capabilities defined in these models are required in your organisation, and to what extent – assuming you are not operating at the scale of Google? How do they sit alongside other capabilities, such as DevOps and Data Capability models?

## What distinct AI/ML capabilities are required?

One way to approach this question is to look at what makes delivering AI/ML products/services different from delivering traditional software, and what additional capabilities are required. 

If we compare DevOps and AI/ML development capabilities, we see plenty of overlap – DevOps is a popular approach to develop and operate software products/services at scale. In addition, given that AI/ML products are software, they have much in common with traditional software products. However, as I outline under the headers below, developing and operating AI/ML solutions differs from traditional software development and operations in a few key areas – and, I’ll argue, in one area in particular.

It should be noted that the extent to which it is important to have maturity in each of these areas is in large part driven by the applications of AI/ML within your organisation, the characteristics of these, and the organisational context – there is no one-size-fits-all approach. This is something I will elaborate on further in future publications.

### Skills

AI/ML projects need specialist skills in addition to the skills required for traditional software development. In particular, Data Science, and AI/ML research and engineering skill sets are vital in implementing AI/ML solutions. There may be cases where taking and applying an off-the-shelf product will deliver the desired outcomes. However, in my opinion, this is unlikely to be the case the majority of the time, and as soon as an off-the-shelf product fails to meet requirements, it doesn't take long before fairly deep expertise is required.

### Data

Data is the fuel that powers AI/ML projects. Access to data of sufficient volume, quality and relevance is critical in being able to develop and test AI/ML products. Therefore, the data capabilities and assets of the organisation are key, and having quality data sets that are discoverable and accessible in a self-serve way is vital to success.

### Assurance

Testing AI/ML products is more complex than traditional software. In addition to all the traditional failure modes, there is an additional level of testing required to evaluate model performance. Whereas traditional testing is pass/fail, AI/ML systems can have non-deterministic, stochastic outputs, so different approaches to measuring quality are required. Often there is a subjective element that requires Subject Matter Experts to be involved in assurance, and statistical approaches including the measurement of training and output biases.

### Tooling and infrastructure

Much of the tools and infrastructure required are the same as for traditional software development (source control, CI/CD, hosting infrastructure). However, there are additional tools required such as data exploration, visualisation, experiment tracking, and notebooks amongst others. Given the dynamic nature of the work, self-serve access to these tools and infrastructure is vital to enable tight feedback loops when experimenting.

## The importance of a research culture

In my view, this is the most important and often overlooked difference between the capabilities required for traditional software engineering and those required for AI/ML projects: expertise in the effective management of research projects. It is not fair to assume that your software engineers or engineering leaders will have any expertise in this area – it has not been a requirement of them on software development projects until now.

The development of AI/ML products carries a lot of uncertainty and has as much in common with research as it does with engineering. Whilst MLOps and DevOps mention experimentation as a key capability, they leave out the skills and cultural elements required to successfully perform research in a commercial setting. 

Research is concerned with asking and answering questions, whereas engineering is concerned with building things. Engineering organisations are not always set up with the cultural mindset of performing research. Embracing this different perspective is important. If the difference is not recognised, it can lead to inefficient delivery of research-heavy projects, friction within delivery teams composed of research and engineering roles, and organisational expectations being misaligned with the reality of delivering products with high levels of uncertainty.

Building these skills and fostering a research culture is in my opinion one of the most – if not the most – important factors for success in incorporating AI/ML into products and services. Only in this way can you ensure that research is well-directed, hypotheses and experiments are well-defined, and research remains focused.

To wrap up, we have identified some broad areas where developing AI/ML solutions is different from traditional software development. However, the maturity required in each of these areas will be driven by the characteristics of applications and the business context in which they are deployed. In addition, building research skills and culture is an important factor in success. Both of these topics will be addressed in more detail in an upcoming white paper.