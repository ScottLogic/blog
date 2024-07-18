---
title: Will Generative AI Implode and can it become more Sustainable?
date: 2024-07-16 15:23:00 Z
categories:
- Artificial Intelligence
- Sustainability
tags:
- Sustainability
- Artificial Intelligence
- ocronk
summary: Generative AI has a Sustainability problem - across environmental, cost and
  and expectations. Many companies are racing to implement GenAI in their projects,
  lured by its hyped potential to revolutionise industries. However in applying GenAI
  to enterprise implementations, I am seeing firsthand the sustainability challenges
  threatening to implode the first generation of this technology. This blog talks
  about what I hope will rise from the ashes of such an implosion.
author: ocronk
Field name: 
---

# **Generative AI has a Sustainability problem**

[Generative AI](https://blog.scottlogic.com/2023/06/01/generative-terminology.html), including large language models (LLMs), [has taken the world by storm](https://blog.scottlogic.com/2023/03/31/the-new-ai-platform.html). Inspired by ChatGPT many companies are racing to implement GenAI in their projects, lured by its hyped potential to revolutionise industries. However in experience of applying GenAI to enterprise implementations, I am seeing firsthand the sustainability challenges threatening to implode the first generation of this technology. 

Industry [commentators](https://www.linkedin.com/feed/update/urn:li:activity:7216205024694013953/) are calling into [question the value](https://www.goldmansachs.com/intelligence/pages/gs-research/gen-ai-too-much-spend-too-little-benefit/report.pdf) and[ long term economic viability of the underlying platforms](https://www.sequoiacap.com/article/ais-600b-question/), Gartner is [claiming GenAI is entering a trough of disillusionment](https://itp.nz/techblog/genai-disillusion-sets-in-but-new-ai-innovations-creating-buzz) and energy grids are under [huge strain from increased demand](https://www.funds-europe.com/nuclear-smr-powered-data-centres-and-europes-grid-crisis/). This article (the latest in our [series on conscientious computing](https://blog.scottlogic.com/2023/10/26/conscientious-computing-facing-into-big-tech-challenges.html)) summarises the current state and puts forward a pragmatic hopeful vision for a more sustainable future generation of AI.

## The Pitfalls of Blindly Applying LLMs

In May 2023,[ we called out the risks and challenges of implementing GenAI at large regulated enterprises and proposed high-level architecture concepts](https://blog.scottlogic.com/2023/05/04/generative-ai-solution-architecture.html) to address these issues. The industry has since caught up with the trend towards "Compound AI," which wraps AI models with supporting technologies including (but not limited to) prompting frameworks Knowledge Graphs and Vector Databases / RAG (Retrieval-Augmented Generation).

Despite these advancements, many organisations are still making the mistake of blindly applying AI models on their own, expecting miraculous results and returns on often significant upfront and ongoing investments. Sadly, those with non-trivial use cases (those that stretch too far beyond language processing) are quickly met with disappointment. While LLMs excel at document summarisation and given the right input generation of content, stretching them too far beyond this core competency into a broader silver bullet solution often leads to prototypes that fail to deliver in real-world production deployments.

To address some of these shortcomings, the trend is shifting towards [Compound AI](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/) and [Agentic AI](https://blog.scottlogic.com/2024/06/28/building-a-multi-agent-chatbot-without-langchain.html), which can combine LLMs with other technologies to create more sophisticated automation solutions. In particular seeding GenAI with enterprise data to provide context and alignment. This shift can not only compensate for some of the limitations of LLMs but can also help lower costs by offloading work from expensive AI models to more cost-effective traditional software and data engineering approaches. By leveraging the strengths of various technologies, organisations can build robust and scalable GenAI solutions that deliver real value.

## Significant Sustainability Challenges

While technical limitations are concerning, they are compounded by sustainability issues - across all definitions of sustainability: financial, environmental and people:

* **Power Consumption**: Training and running massive LLMs consumes an immense [amount of electricity](https://www.wired.com/story/ai-energy-demands-water-impact-internet-hyper-consumption-era/). This energy appetite is increasingly difficult to justify. Data centre operators are [already struggling to get electricity grid connections for new and expanded data centres - leading some to consider small local nuclear reactor](https://www.funds-europe.com/nuclear-smr-powered-data-centres-and-europes-grid-crisis/)s.

* **Environmental Cost**: The carbon footprint and [water usage](https://www.aiaaic.org/aiaaic-repository/ai-algorithmic-and-automation-incidents/chatgpt-consumes-500-ml-of-water-per-5-50-prompts) of GenAI is under growing scrutiny. Without major shifts in approach, the environmental toll may become untenable - particularly for organisations already struggling to stick to ambitious net zero plans or those training or operating AI in water stressed areas.

* **Hardware Demands**: GenAI requires vast amounts of computing power, straining [chip supplies](https://www.argusmedia.com/en/news-and-insights/latest-market-news/2464740-ai-boom-to-drive-demand-for-chip-materials) and rare earth materials. The current AI arms race is exacerbating this resource pressure.

* **Escalating Costs**: The financial costs of GenAI, driven by its power and hardware demands, are skyrocketing. ROI will be increasingly difficult to achieve, especially for marginally valuable use cases.

* **Skillset Scarcity**: Organisations are struggling to find talent with the unique blend of AI, software engineering, and domain expertise needed to effectively implement GenAI. This skill shortage threatens to bottleneck adoption.

Sustainability also includes impacts to people of course and the next section goes into detail on some of these challenges.

## Distrust and Misinformation

Technology is shifting from being a definitive source of facts and knowledge (e.g. reliable SQL database) to a platform that breeds division and mistrust (i.e. fake news shared on social media), We still haven’t recognised the longer term impacts of social media on society and GenAI looks to have an even greater impact.

**Believable Falsehoods**: GenAI's ability to generate highly convincing text, images, and video has opened the floodgates for misinformation. Bad actors can leverage these tools to create fake news, deepfakes, and scams at an unprecedented scale.

Biassed Outputs: LLMs can absorb and amplify the biases present in their training data and prompts used by users, leading to discriminatory outputs that perpetuate societal inequities. Addressing these biases is a complex challenge as incorrect statements can be perpetuated rather than corrected.

**Intellectual Property Issues: ** GenAI's knack for remixing and recombining existing content raises thorny questions around intellectual property rights, attribution, and plagiarism.

As these ethical risks mount, they threaten to undermine trust in GenAI and hinder its adoption, even in cases where the technology could drive significant value. Again compound AI architectures and careful integration with data platforms are key to addressing many of these. But some (for example IP issues) might be insurmountable with the current generation of the technology.

# The Potential of a GenAI 2.0

Whilst in the near term greater experience deploying these solutions may lead to a better understanding of appropriate and compelling use-cases this won’t address the underlying sustainability challenges. Expectations not matching reality and fundamental sustainability challenges may ultimately cause first-gen GenAI platforms to implode under their own weight. However, from the ashes, my prediction is that a second generation of the technology will rise - one that ideally is:

* **Laser-focused on high-value problems - **realistically solvable with compound AI with a clearer path to return on investment

* **Dramatically more efficient** in its use of energy and computing resources

* **Deeply integrated with other technologies - **GenAI should handle the language processing and generation and leverage other components such as enterprise data platforms. Existing platforms will weave GenAI features into core functionality (just look at what Microsoft is already doing with it’s CoPilot integration with Office 365 for example)

* **More open and accessible to implement** as the pool of experienced GenAI talent grows and as Open Source AI projects continue to mature

* **Hardware and model innovation** - throwing power hungry GPUs at neural networks feels like lazily brute forcing the problem. Expect to see different hardware architectures and smaller models being used.

* **Smart use of waste heat:** Organisations such as [Deep Green](https://deepgreen.energy/) and [Heata](https://www.heata.co/) are showing how tech can be part of the circular economy: through re-use of the waste heat from computing. Making a liability a source of value is very smart but will require decentralisation and probably a rethinking of the role of public cloud for AI.

* **More explainable** - there is a significant amount of [ongoing work on the explainability of AI ](https://scholar.google.co.uk/scholar?q=ai\+explainability\+research&hl=en&as_sdt=0&as_vis=1&oi=scholart)that may address mistrust and misinformation and allow for broader adoption.

* **Transparent and accountable on sustainability:** Not only on what was required to develop and train a model but ongoing operational impact metrics including electricity, carbon (including the embodied carbon from hardware) and water usage.

We are already starting to see innovation and signs of radically different approaches emerging that point to where GenAI 2.0 might go. I believe a convergence of innovations across models, infrastructure, and ethics are coming:

## The Rise of Small Language Models (SLMs)

One of the key innovations driving GenAI 2.0 will be the [rise of Small Language Models](https://thenewstack.io/the-rise-of-small-language-models/) (SLMs). In contrast to the massive, energy-hungry LLMs that dominate current GenAI, SLMs like DistilBERT and PHI2 offer a more efficient and targeted approach:

Efficiency: SLMs are designed to be lightweight and fast, requiring significantly less computing power and energy to train and run compared to LLMs. This makes them more environmentally and financially sustainable.

Specificity: Rather than trying to be a jack-of-all-trades, SLMs are often tailored for specific tasks or domains. This specialisation allows them to achieve high performance on their target use cases without the bloat of general-purpose LLMs.

Scalability: The efficiency and specificity of SLMs make them easier to scale and deploy across a wide range of applications. This could help unlock value in previously untapped niches.

Interoperability: SLMs are well-suited for integration into compound AI architectures. By combining multiple specialised SLMs with other AI components, developers can create powerful systems that are greater than the sum of their parts. However as is seen with the current generation of LLMs swapping in and out models is currently a challenge - SLMs will need to offer better decoupling from the prompting layer to be truly flexible which might prove challenging.

While SLMs may not have the same raw language capabilities as LLMs, their efficiency, specificity, scalability, and interoperability make them a key building block for a more sustainable and impactful GenAI 2.0 ecosystem. As the technology matures, we can expect to see a proliferation of SLMs tackling a diverse array of language tasks and domains.

## Deeply integrated with Data Architecture

Grounding GenAI in context and reality of the use case they are being applied to is essential for production deployment of real world applications. This is where carefully considered Data and Integration Architecture is vital. Data architecture components including an appropriate blend of Knowledge Graphs, APIs, in memory data caching and RAG / Vector Databases with accurate, relevant data is going to be vital for most use cases.

## **Infrastructure Architecture Revolution: Neuromorphic Edge Computing?**

Alongside advancements in models, GenAI 2.0 will need to be powered by a revolution in computing infrastructure:

**Edge Computing: **By pushing AI computation to the edge of the network, closer to where data is generated and actions are taken, edge computing can dramatically reduce latency, bandwidth, and (particularly where there is a surplus of local renewable power generation) carbon emissions. This is particularly valuable for GenAI applications that require real-time interaction or operate in resource-constrained environments. Moreover, edge computing opens up opportunities to better align computing demand with heat demand and availability of renewable electricity. By strategically locating edge data centres in areas that require heat (e.g., district heating systems, industrial processes, indoor agriculture), the waste heat from AI computation can be efficiently repurposed. This "renewables-compute-heat coupling" can significantly improve the overall energy use (particularly as compute workloads can displace Gas that would have been used for heating), carbon intensity and sustainability of GenAI compared to centralised public cloud based architectures that are often located in cities with high levels of electricity demand and carbon intensity.

**Novel Hardware Architectures including Neuromorphic Chips: **
CPUs and GPUs are not the only technologies for running AI. [Google has been working on ](https://cloud.google.com/tpu/docs/intro-to-tpu)their [TPU (Tensor Processing Unit) technology](https://deepgram.com/ai-glossary/tensor-processing-unit-tpu) for many years. There are also fascinating [Neuromorphic computing](https://medium.com/@IEEE_Computer_Society_VIT/neuromorphic-hardware-and-computing-f7cc8f71ed58) architectures like those pioneered by [FinalSpark](https://finalspark.com/) and [SpiNNcloud](https://spinncloud.com/). These are designed to mimic the energy efficiency and processing capabilities of biological brains. By leveraging biological neural networks neuromorphic chips can achieve orders-of-magnitude improvements in performance per watt compared to traditional hardware. This could make large-scale AI far more sustainable. The ultra-low power consumption of neuromorphic chips also makes them well-suited for deployment in edge environments where energy may be limited. By combining novel hardware like neuromorphic chips with edge computing, the next generation of AI could achieve unprecedented levels of efficiency and sustainability. That's not to say that GPUs won’t be used at all going forwards. Perhaps they will be used for certain training or prototyping stages of AI development. However if AI powered solutions are to be ubiquitous and affordable, large scale operational deployment (including inferencing) will need vastly more efficient approaches.

**Transparency and Accountability: ** Currently Hugging Face is showing leadership in this area - allowing for [carbon measurement data to be added their Model Hub](https://huggingface.co/docs/hub/en/model-cards-co2). Projects such as [MLCO2](https://mlco2.github.io/impact/), [Alygne Ecologits Calculator](https://huggingface.co/spaces/genai-impact/ecologits-calculator) and [CodeCarbon](https://codecarbon.io/) show great promise but only really scratch the surface. What we really need is for the big tech players to become far more transparent about what is going on in the cloud data centres where the majority of training and model inference is happening. However it might take further regulation for that level of transparency to be achieved - particularly if the [current level of greenwash about the sustainability of cloud hosted AI](https://www.thestack.technology/aws-emissions-cloud-efficent/) is anything to go by. In the near future we plan to map out AI across the open source [Tech Carbon Standard](https://www.techcarbonstandard.org/) pillars of upstream, operational and downstream to make the lifecycle impacts easier to understand, measure and mitigate.

# Conclusion

GenAI is a transformative technology that is almost certainly here to stay. But in its current form it is unsustainable. Implosion is inevitable - and necessary if it is to be a truly holistically sustainable platform. Only by moving beyond the current brute force approaches can we create architectures that are environmentally, technologically and financially sustainable. The future of GenAI could be bright, but we must first endure some short-term darkness (it [wouldn’t be the first AI winter](https://en.wikipedia.org/wiki/AI_winter)) as the industry reinvents itself for the long haul. The biggest areas to watch? Niche GenAI start ups and the underlying GPU / hardware and cloud computing supply chains that primarily support the GenAI ecosystem.

I just hope this shift happens before we significantly impact the environment with the brute forced AI gold rush. Admittedly, the road to a sustainable future for Generative AI is a daunting one. We've gone so far with current approaches that it may seem easier to just stay the course, even as the long-term consequences become increasingly apparent (it wouldn't be the first time the environment has paid the price for profit). Changing direction will require us to confront uncomfortable truths, make difficult trade-offs, and overcome significant technological and economic hurdles. But however hard this change may be, it is a challenge we must embrace. The alternative - a world where the AI revolution comes at the cost of our environment and our values - is simply unacceptable.

Full disclosure - in a somewhat ironic twist initial drafts of sections of this article were generated with assistance from Claude.AI. However as this article talks about future possibilities rather than a summary of the past that can be created from LLM training data it required significant reworking! Massive thanks to the clients and Scott Logic teams members who provided input and feedback on this piece - fair to say this one has divided opinion!

If you’d like to discuss responsible AI with us feel free to get in touch [via LinkedIn](https://www.linkedin.com/in/cronky/) or email [sustainability@scottlogic.com](mailto:sustainability@scottlogic.com)