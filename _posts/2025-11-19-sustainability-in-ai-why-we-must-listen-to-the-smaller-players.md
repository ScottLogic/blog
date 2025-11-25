---
title: Sustainability in AI - why we must listen to the smaller players
date: 2025-11-19 00:00:00 Z
categories:
- Sustainability
- Tech
tags:
- Tech
- Sustainability
- Sustainable AI
summary: As AI systems scale to billions of daily interactions, their environmental
  impact remains largely invisible. Building sustainable AI requires transparency
  in reporting, prioritising efficiency over scale, and challenging the use of AI
  when it is truly necessary.
author: hsauve
image: "/uploads/Sustainability-in-AI---why-we-must-listen-to-the-smaller-players-01.jpg"
---

As Large Language Models (LLMs) become increasingly adopted across all disciplines, their environmental impact remains opaque, with limited transparency from major providers. With model sizes reaching hundreds of billions of parameters, training and developing state-of-the-art AI systems generates substantial carbon emissions and strains vital resources like electricity and water, particularly in certain regions of the world. 

The scale is staggering, a worst-case estimate suggests that Google's AI alone consumes ∼29.3 Terawatt hours (TWh) of electricity annually, comparable to Ireland’s total energy consumption. [^1]

While progress in the field of AI continues apace, addressing sustainability in innovation is crucial not only to limit its ecological footprint and preserve natural resources but also to ensure the development of responsible, ethical and cost-effective AI systems that can scale without compromising our [societal](/2025/05/14/are-we-sleepwalking-into-ai-driven-societal-challenges.html) and environmental future. 

This blog post aims to complement the research carried out by the Sustainability Team at Scott Logic as part of the [latest update](/2025/09/04/technology-carbon-standard-update-4-sept.html) of the [Technology Carbon Standard](https://www.techcarbonstandard.org/), following a thorough [literature review](/2025/09/16/greener-ai-lit-review.html).

![A smartphone on top of a book on problem-solving agents, the phone displays OpenAI's ChatGPT. ]({{ site.baseurl }}/hsauve/assets/ai-sustainability/chatgpt.jpg "A smartphone displaying OpenAI's ChatGPT.")

<small>_Photo by [Shantanu Kumar](https://www.pexels.com/@theshantanukr/) on [Pexels](https://www.pexels.com/photo/chatgpt-webpage-open-on-iphone-16474955/)_</small>

## AI impacts on natural resources

To get a more accurate picture of the environmental footprint of AI, we deemed necessary to first examine its embodied carbon. This encompasses both [upstream emissions](https://www.techcarbonstandard.org/impact-categories/upstream), in other terms carbon emissions generated during the manufactue of hardware, including abiotic resources consumption and the fabrication of server components, as well as [downstream emissions](https://www.techcarbonstandard.org/impact-categories/downstream) which relate to the end-of-life and recycling stages of AI hardware.

AI is increasing demand for AI chips and analysts have estimated that demand for Nvidia's prized AI chips is exceeding supply by at least 50%. [^2] In the UK alone, the number of data centres is expected to [increase by almost a fifth over the next few years](https://www.bbc.co.uk/news/articles/clyr9nx0jrzo).

The embodied carbon of AI is far from negligible. A comprehensive AI cradle-to-grave approach [^3] estimates that manufacturing emissions represent up to 25% of AI carbon emissions and data centre construction emissions up to 5%. 

We believe that a [Life Cycle Assessment](https://www.techcarbonstandard.org/resources/glossary#life-cycle-assessment-lca) approach to the environmental impact of AI is necessary to correctly assess its impact outside [operational emissions](https://www.techcarbonstandard.org/impact-categories/operational) accounting so as not to lose sight of natural resources depletion, pollution and biodiversity loss associated with the development of AI systems. [^4]

## The cumulative cost of inference

State-of-the-art models can generate content across multiple media formats including text, image and video. Each "inference", the process by which an LLM takes a user's input and generates a relevant output, carries its own carbon footprint. In their [contribution to a global environmental standard for AI](https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai) released earlier this year, Mistral estimated that a 400-token text response generated 1.14 gCO₂e and 45 mL of water. While this may seem negligible for a single query, the scale becomes staggering when multiplied across billions of daily interactions globally. Indeed, Google reported that 60% of AI-related energy consumption from 2019 to 2021 stemmed from inference. [^1]

Inference does not only apply to commercial inference services, but is also increasingly integrated into systems such as search engines. As an example, Alphabet’s chairman indicated in February 2023 that:

> Interacting with an LLM could "likely cost 10 times more than a standard keyword search". [^5]

## The hidden impact of pre-training

If inference is the front door through which most of us interact with LLMs, we must also examine what lies behind it: the carbon-intensive phases of data collection, storage, and preprocessing, as well as the pre-training process itself.

To provide a sense of scale, training GPT-3 is estimated to have consumed 1,287 megawatt-hours (MWh) of electricity, emitted over 550 metric tons of CO2e [^6], and evaporated 700,000 litres of clean freshwater [^7], enough to fill an Olympic-sized swimming pool by nearly one-third.

AI data centres fundamentally differ from traditional data centres in their infrastructure. The specialised hardware necessary for AI workloads - Graphics Processing Units (GPUs, the chips that process multiple calculations simultaneously) and Tensor Processing Units (TPUs, Google's custom AI chips) - consumes substantially more power than standard CPUs.
Pre-training in general is almost always performed over multiple GPUs which incurs energy costs from communication between GPUs, and often also with gradient accumulation (a technique for processing large amounts of data in smaller chunks) to accommodate large batches.

### The less obvious case of fine-tuning

The data on carbon emissions generated by fine-tuning is less well documented than that of pre-training, although fine-tuning accounts for a substantial part of energy consumption. Indeed, while fine-tuning is less computationally expensive than pre-training due to the smaller amount of training data, its carbon footprint may be much bigger due to being intensively performed worldwide. [^8]

As is the case with pre-training, energy consumption depends on the hardware it is run on, the type of task and the type of computation required to carry it out. Additional factors like data centre location, energy mix, model complexity, and training duration come into play.

It is important to note that although fine-tuning can be extremely energy-intensive, it can also reduce long-term emissions by making models more efficient during inference. 

### A path forward

The scale of AI's environmental impact might seem overwhelming, but our research also revealed reasons for optimism. Across academia and industry, researchers are developing practical strategies to reduce AI's footprint without sacrificing accuracy. 

## The future of AI is not yet written

Our research made clear that without addressing the environmental impact of LLMs, there is a risk that the rapid advancements in the field will result in irreversible environmental harm.

The unbridled way AI is currently being developed by big tech companies, which Dr Sasha Luccioni likens to the big oil industry is not sustainable and only benefits a few. 

<div style="max-width:1024px"><div style="position:relative;height:0;padding-bottom:56.25%"><iframe src="https://embed.ted.com/talks/sasha_luccioni_we_re_doing_ai_all_wrong_here_s_how_to_get_it_right" width="1024px" height="576px" title="We’re doing AI all wrong. Here’s how to get it right" style="position:absolute;left:0;top:0;width:100%;height:100%"  frameborder="0" scrolling="no" allowfullscreen onload="window.parent.postMessage('iframeLoaded', 'https://embed.ted.com')"></iframe></div></div>

However there are many ways researchers and corporations can collectively work towards a more sustainable AI. In fact, many are already pioneering [alternative approaches](/2025/02/20/there-is-more-than-one-way-to-do-genai.html) that prioritise sustainability and responsibility.

### Learning from the smaller players

While major tech companies dominate headlines with ever-larger models, smaller AI research groups and [novel companies](/2025/10/14/beyond-compliance-how-sustainable-technology-creates-value.html) are charting a different course. Organisations like [Hugging Face](https://huggingface.co/) are championing open research into AI's carbon footprint and demonstrating that effective AI doesn't always require massive models and infrastructure. Academic institutions, working within resource constraints, have driven innovation in efficient architectures, proving that limitations can foster creativity rather than hinder it. As the poet Charles Baudelaire said of poetry, *because the form is constrained, the idea springs forth more intensely*. [^4] The same principle applies to sustainable AI: sometimes the most elegant solutions emerge not from unlimited resources, but from thoughtful constraints.

Among the papers reviewed, a few observations and actionable recommendations stood out:

### Standardised data needs to be available

- The opacity around standardised reporting hinders independent verification and undermines efforts to regulate AI’s true environmental cost. [^6]
- Authors should report training time and sensitivity to hyperparameters [^9] to enable direct comparison between models, which would enable corporations to make informed and sustainable decisions when training models.
- Academic researchers need equitable access to large-scale compute to foster creativity and prevent the problematic “rich get richer” cycle of research funding. [^9] 

### Sustainability must be put at the centre of AI innovation

- Cost-effective and sustainable innovation in the context of limited resources should be promoted. 
- Frugal AI (a design philosophy emphasising resource-conscious systems) offers a vision of systems that are functional, robust, user-friendly, growing, affordable, and local. [^4]
- Federated Learning (a method where AI models are trained across many devices without centralising data) offers a solution by decentralising the training process and offers several advantages such as reducing the time and bandwidth required for training and inference and lower the energy consumption associated with long-distance data transmission. [^10]
- Efficiency should be an evaluation criterion so that ML practitioners compete to increase accuracy. [^11] However this can also lead to a rebound effect whereby the more efficient models become, the more they get used.
- Research should prioritise developing efficient models and hardware. Improvements in state of the art accuracy are possible thanks to industry access to large-scale compute. [^10]

### The right AI for the right need at the right time. 

> Artificial intelligence should only be used in cases where it is the best technique to use. [^4]

- The necessity of using AI should be critically considered in the first place, as it is unlikely that all applications will benefit from AI or that the benefits will always outweigh the costs.
- The Deep Neural Network (DNN) model, processor and data centre should be carefully chosen.
- Existing models should be lightened and faster GPUs used [^12] to both reduce the environmental damage of LLM training while maintaining results. However this comes with financial implications, which necessitates further research to make sustainable AI practices more accessible.
- Short reasoning methods should be used for inference, for accuracy and carbon saving. Long LLM reasoning does not mean greater accuracy and correct answers are typically shorter than incorrect ones. [^13]

### Smaller models for smarter solutions

- [Smaller models](https://www.techcarbonstandard.org/guides/reduce-ai-emissions#model-size) are sufficiently powerful for many tasks that we entrust AI with, and are considerably less energy-intensive as Small Language Models (SLMs) trained on carefully selected data require less computation power. 
- This is particularly relevant in the context of agentic AI where LLMs are excessive and misaligned with the demands of most use cases, like using a sledgehammer to crack a nut. [^14] 
- The shift to smaller, task-specific models represents perhaps the most immediate opportunity to reduce AI's environmental impact while maintaining practical utility.

## References

[^1]: Alex de Vries (2023). “The growing energy footprint of artificial intelligence”. [https://doi.org/10.1016/j.joule.2023.09.004](https://doi.org/10.1016/j.joule.2023.09.004).

[^2]: Chavi Mehta, Max A. Cherney and Stephen Nellis "Nvidia adds jet fuel to AI optimism with record results, $25 billion buyback". Reuters. August 24, 2023. [https://www.reuters.com/technology/nvidia-forecasts-third-quarter-revenue-above-wall-street-expectations-2023-08-23/](https://www.reuters.com/technology/nvidia-forecasts-third-quarter-revenue-above-wall-street-expectations-2023-08-23/)

[^3]: Ian Schneider, Hui Xu, Stephan Benecke, David Patterson, Keguo Huang, Parthasarathy Ranganathan, Cooper Elsworth (2025) "Life-Cycle Emissions of AI Hardware: A Cradle-To-Grave Approach and Generational Trends" [https://doi.org/10.48550/arXiv.2502.01671](https://doi.org/10.48550/arXiv.2502.01671)

[^4]: Ludovic Arga, François Bélorgey, Arnaud Braud, Romain Carbou, Nathalie Charbonniaud, et al. [Frugal AI: Introduction, Concepts, Development and Open Questions. 2025. ffhal-05049765f](https://hal.science/hal-05049765/file/Frugal_AI_Introduction_Concepts_Development_and_Open_Questions_HAL.pdf)

[^5]: Jeffrey Dastin, Stephen Nellis. "For tech giants, AI like Bing and Bard poses billion-dollar search problem". Reuters. February 22, 2023. [https://www.reuters.com/technology/tech-giants-ai-like-bing-bard-poses-billion-dollar-search-problem-2023-02-22/](https://www.reuters.com/technology/tech-giants-ai-like-bing-bard-poses-billion-dollar-search-problem-2023-02-22/).

[^6]: Jegham, N., Abdelatti, M., Elmoubarki, L., & Hendawi, A. (2025). “How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference”. University of Rhode Island, University of Tunis, Providence College. [https://doi.org/10.48550/arXiv.2505.09598](https://doi.org/10.48550/arXiv.2505.09598)

[^7]: Pengfei Li, Jianyi Yang, Mohammad A. Islam, Shaolei Ren (2025). UC Riverside, UT Arlington. "Making AI Less “Thirsty: Uncovering and Addressing the Secret Water Footprint of AI Models". UC Riverside, UT Arlington. [https://doi.org/10.48550/arXiv.2304.03271](https://doi.org/10.48550/arXiv.2304.03271)

[^8]: Xiaorong Wang, Clara Na, Emma Strubell, Sorelle Friedler, Sasha Luccioni (2023). Haverford College, Carnegie Mellon University, Allen Institute for AI, 4Hugging Face. "Energy and Carbon Considerations of Fine-Tuning BERT". [https://doi.org/10.48550/arXiv.2311.10267](https://doi.org/10.48550/arXiv.2311.10267)

[^9]: Emma Strubell, Ananya Ganesh, Andrew McCallum (2019). University of Massachusetts Amherst. "Energy and Policy Considerations for Deep Learning in NLP". [https://doi.org/10.48550/arXiv.1906.02243](https://doi.org/10.48550/arXiv.1906.02243)

[^10]: Iftikhar, S., Alsamhi, S. H., & Davy, S. (2025). “Enhancing Sustainability in LLM Training: Leveraging Federated Learning and Parameter-Efficient Fine-Tuning”. “IEEE Transactions on Sustainable Computing. [https://doi.org/10.1109/TSUSC.2025.3592043](https://doi.org/10.1109/TSUSC.2025.3592043).

[^11]: David Patterson, Joseph Gonzalez, Quoc Le, Chen Liang, Lluis-Miquel Munguia, Daniel Rothchild, David So, Maud Texier, Jeff Dean (2021) "Carbon Emissions and Large Neural Network Training" [https://doi.org/10.48550/arXiv.2104.10350](https://doi.org/10.48550/arXiv.2104.10350)

[^12]: Vivian Liu, Yiqiao Yin (2024). Columbia University, University of Chicago. "Green AI: Exploring Carbon Footprints, Mitigation Strategies, and Trade Offs in Large Language Model Training" [https://arxiv.org/abs/2404.01157](https://doi.org/10.48550/arXiv.2404.01157)

[^13]: Michael Hassid, Gabriel Synnaeve, Yossi Adi, Roy Schwartz (2025). The Hebrew University of Jerusalem. "Don't Overthink it. Preferring Shorter Thinking Chains for Improved LLM Reasoning". [https://doi.org/10.48550/arXiv.2505.17813](https://doi.org/10.48550/arXiv.2505.17813)

[^14]: Peter Belcak, Greg Heinrich, Shizhe Diao, Yonggan Fu, Xin Dong, Saurav Muralidharan, Yingyan Celine Lin, Pavlo Molchanov (2025). Georgia Institute of Technology. "Small Language Models are the Future of Agentic AI" [https://doi.org/10.48550/arXiv.2506.02153](https://doi.org/10.48550/arXiv.2506.02153)
