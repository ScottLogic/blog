---
title: AI in Government – Addressing bias in AI-assisted services
date: 2024-08-27 14:57:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
- ai
- bias
- structural bias
- data
- data piplines
- MLOps
- Machine Learning
- observability
- transparency
- fairness
- reliability
- machine learning models
- AI models
summary: As the government progresses from prototype to production to ongoing operation with AI-assisted services for UK citizens, how can it minimise the risk of replicating structural biases? In this blog post, I’ll explore key elements of what’s involved in ensuring that services are as representative, fair and impartial as possible.
author: godds
image: "/uploads/AI%20in%20govt%20addressing%20bias.png"
---

Generative AI (GenAI) holds up a mirror to humanity. The training data for a Large Language Model (LLM) like ChatGPT includes large sets of unstructured textual data from across the internet, including Wikipedia pages, books, and articles. Its responses to prompts synthesise that data with no inherent understanding of biases or points of view.

AI is the sum of its training – by humans. We’ll all have heard examples of stories of AI displaying discriminatory bias, whether [in recruitment](https://www.personneltoday.com/hr/ai-recruitment-discrimination-to-be-investigated-ico/), [law enforcement](https://www.computerweekly.com/news/366603173/Automated-police-tech-contributes-to-UK-structural-racism-problem), or other domains. The UK government’s recently established [AI Safety Institute](https://www.aisi.gov.uk/) is actively conducting research in this area, recently publishing findings demonstrating that LLMs can give [biased career advice to different profiles based on class and sex](https://www.gov.uk/government/publications/ai-safety-institute-approach-to-evaluations/ai-safety-institute-approach-to-evaluations#ai-safety-summit-demonstrations).

As the government progresses [from prototype to production](https://blog.scottlogic.com/2024/08/02/ai-government-prototype-to-production.html) to ongoing operation with AI-assisted services for UK citizens, how can it minimise the risk of replicating structural biases? In this blog post, I’ll explore key elements of what’s involved in ensuring that services are as representative, fair and impartial as possible.

## Fixing the plumbing

If AI is only as good as the data it’s trained on, then you need ready access to high-quality, representative datasets in order to mitigate the risk of bias. The government’s large legacy IT estate poses a significant challenge in this regard. At one of the recent private roundtable sessions co-hosted by the [Institute for Government](https://www.instituteforgovernment.org.uk/) (IfG) and Scott Logic on harnessing AI in providing public services, a participant expressed the view that the public sector was often starting from minus 100, not zero, when it came to legacy IT.

The legacy challenge cannot be ignored, but [as I explained in a recent blog](https://blog.scottlogic.com/2024/08/08/ai-in-government-the-central-role-of-data.html), there are practical ways to tackle it. By incrementally moving towards more modular architectures comprising microservices connected by Application Programming Interfaces (APIs), it’s possible to connect siloed data sources and implement seamless data exchange along secure pipelines – “fixing the plumbing”, to coin a phrase. Data can then be drawn from legacy systems to ensure that datasets are as comprehensive and richly representative as possible for a given purpose. [In this short video](https://www.linkedin.com/posts/scott-logic-limited_ai-mlops-publicsectortechnology-activity-7198608612091412481-RxHS?utm_source=share&utm_medium=member_desktop), former civil servant Peter Chamberlin expands on this and explains how we’ve been supporting public sector clients to establish pipelines such as these.

## Training the models

One of the best ways to mitigate the risks of discriminatory bias or omitting the needs of minorities is to train AI models in-house, tailored to the requirements of specific services. This provides civil servants with the greatest visibility of the data inputs and the workings of the chosen model, allowing its outputs to be better understood and fine-tuned. By conducting demographic analysis, it’s possible to identify and address gaps or imbalances in a given dataset to ensure it is representative of the population.

While the data is of foundational importance, the training of AI models requires ongoing iterative testing and refinement. A range of techniques is emerging to help to mitigate bias. Among these is the use of [fairness metrics](https://councils.forbes.com/blog/ai-and-fairness-metrics) with which a model’s outputs can be assessed to check whether positive outcomes are consistent across demographic groups. Another technique is adversarial debiasing, where the AI model is assessed by an adversarial model. The latter model is tasked with predicting a given [protected characteristic](https://www.gov.uk/discrimination-your-rights) by analysing the outputs of the main model. Taking an example from recruitment, the main model might be tasked with predicting the likelihood of a job applicant’s success based on a range of attributes, and the adversarial model might be tasked with using the main model’s outputs to predict the applicant’s gender. The technique aims to iteratively address bias in the training data until the adversarial model cannot predict the main model’s outputs.

Where it’s not possible to train a model in-house, a good alternative is to use an open source model which is transparent in how its algorithms work. A great example of this was provided at one of the IfG roundtables – the [Collective Intelligence Lab](https://openpolicy.blog.gov.uk/2022/10/11/cutting-through-complexity-using-collective-intelligence/), which uses an open source tool called [Polis](https://pol.is/home) to collect diverse views on government priorities as a means of shaping policy-making. Collective Intelligence sought views on a range of topics, inviting participants to submit their own views and vote on the views of others. The machine learning in Polis then grouped participants according to how they voted on topics. Demographic data could then be analysed to ensure that participation was as representative as possible.

Ultimately, it’s this transparency that will be key. The more open the government can be about its algorithms and data, the better. Through a kind of constructive scrutiny, organisations and bodies outside of government can then help refine algorithms and address gaps in data to mitigate the risk of bias. Cited at the IfG roundtables, the Department for Science, Innovation and Technology’s [Algorithmic Transparency Recording Standard](https://www.gov.uk/government/publications/algorithmic-transparency-template) and the Public Law Project’s [Tracking Automated Government (TAG) Register](https://trackautomatedgovernment.shinyapps.io/register/) aim to foster this culture of openness and transparency (albeit from different angles).

## Maintaining the models

Iteratively improving AI models involves training and retraining over time. What’s more, models aren’t static, they can ‘drift’ and degrade due to changes in the underlying data or the model’s environment. Mitigating biases in AI and Machine Learning (ML) models will therefore require ongoing effort. The vigilance required can be shared with non-technical teams. With open source observability tools like [Grafana](https://grafana.com/), it’s possible to create simple dashboards that display real-time data on models’ outputs, allowing their accuracy and fairness to be monitored by non-technical civil servants.

The testing and evaluation of new versions of models is more complex than testing improvements to standard software code. It requires the capability to deploy the test model and expose it to the same data inputs as the version of the model that’s in production, allowing the outputs to be benchmarked against each other. This capability comes through the use of a model repository (analogous to a secure, version-controlled file store) housing both the in-production model and in-training models; and pipelines running in parallel, piping live data to the in-production model and an in-training model, allowing their outputs to be compared. Beyond being exposed to live data, the in-training models and pipelines are otherwise isolated from live systems. 

In this way, using [Machine Learning Operations (MLOps) practices](https://en.wikipedia.org/wiki/MLOps), it will be possible for government departments to mitigate biases iteratively, along with other issues affecting their models’ fairness, accuracy and reliability. We’ve recently supported a team at DWP to create AI-monitoring Grafana dashboards and build its MLOps capability.

As in society at large, it will be an ongoing challenge for the government to address structural biases as it increasingly harnesses AI and ML in delivering public services. At both IfG roundtables, it was clear from the participants how conscious they were of the challenge and how committed they were to tackling it. From our work at Scott Logic in supporting clients to de-risk their deployment of AI, I know there are practical solutions the government can adopt so that the AI-assisted services it develops hold up a mirror that shows us a better version of ourselves.

## Our work in the public sector

If you’d like to know more about our work with government, visit our [Transforming the public sector](https://www.scottlogic.com/what-we-do/transforming-the-public-sector) page.