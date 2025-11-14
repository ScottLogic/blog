---
title: Greener AI - what matters, what helps, and what we still do not know
date: 2025-09-16 09:00:00 Z
categories:
- Sustainability
tags:
- Sustainability
- AI
- Data Centre
- Cloud
summary: We recently undertook a literature review about the environmental impact
  of AI, across carbon, energy, and water. It offers practical strategies for teams
  to reduce impact today, while highlighting the gaps in measurement, reporting, and
  governance that still need to be addressed.
author: jcamilleri
---

Artificial intelligence (AI), and particularly large language models (LLMs), have rapidly transitioned from niche research to global infrastructure, bringing with it significant environmental impacts. We conducted a literature review to find and evaluate recent academic and industry research to integrate evidence on emissions across the AI life cycle, from hardware manufacturing to large-scale deployment.

We undertook the study to find out:

- What environmental impacts are researchers attempting to measure?
- What methodologies are being employed to assess resource consumption and impact?
- Is there a way to determine both the cost of training and inference of LLMs? And if so, which has the greater impact?
- What tools are being used to measure the impact?
- Did the findings uncover any strategies for managing the environmental impact of AI use?

---

*Why this matters now:* as the use of AI methods such as LLMs becomes widespread, there have been increasing reports into how much energy is required to run them. The point is not to halt progress, but to make trade-offs visible and pick the wins that do not harm performance or user experience.

---

## TL;DR

AI’s environmental footprint is real, measurable, and often misunderstood. Our literature review found that the biggest impacts depend heavily on life cycle boundaries, usage patterns, and reporting standards. Training is a one-off spike, but inference can dominate over time. Energy, carbon, and water are linked, but not interchangeable. Two narratives compete: AI as a sustainability risk, and AI as a potential efficiency tool. Both hold under specific conditions. The good news: there are practical steps teams can take today.

## Methodology

We drew on a selection of recent academic papers, technical reports, and industry benchmarks that explore the environmental impacts of AI, with a focus on carbon emissions, energy use, and life cycle analysis. Sources were selected based on their relevance, transparency, and contribution to either empirical findings or methodological frameworks. Key works include the BLOOM LCA study[^15], infrastructure-aware benchmarks for inference emissions[^9], and comparative life cycle assessments of generative AI services[^2].

To reflect the current state of the field, we included peer-reviewed papers, preprints from platforms like arXiv, and widely-cited grey literature such as Hugging Face’s AIEnergyScore and Mistral’s reporting standards. Tools such as Carbontracker, Experiment Impact Tracker, and CodeCarbon helped frame how emissions are measured and reported. Themes were structured around measurement frameworks, emission sources, mitigation strategies, and reporting practices, with particular attention to the growing impact of inference and the need for shared standards.

## Frameworks and Standards for Environmental Assessment

Assessing AI’s environmental impact demands more than a single metric. It requires a structured methodology capable of capturing both operational and embodied emissions, while accommodating the unique scaling patterns of AI workloads. Life Cycle Assessment (LCA) has emerged as the foundational approach, but its adaptation to AI highlights differences in scope and a lack of available data for key components.

### LCA as a Common Foundation

The principles outlined by Klöpffer[^12] remain central: define scope, compile an inventory, assess impacts, and interpret results. Applied to AI, these stages typically cover the following emission types:

| Emission Type             | Example Sources             |
| ------------------------- | --------------------------- |
| Operational emissions     | training and inference      |
| Embodied emissions        | hardware manufacturing      |
| Supporting infrastructure | data centres and networking |

AI LCAs rarely achieve full “cradle-to-grave” coverage. BLOOM [^15] applied a _partial LCA_ that included manufacturing, training, and inference but excluded data storage and preparation. In contrast, Berthelot et al. [^2] began from the end-user and worked backward to the data centre, capturing client-side emissions that BLOOM omitted.

Boundary-setting strongly shapes results. A model trained on a low-carbon grid (BLOOM [^15]) appears efficient when manufacturing is amortised over hardware life, yet a user-centric approach (Berthelot [^2]) can reveal additional sources of emissions. Without harmonised boundaries, such comparisons risk being misleading.

### Extending Beyond LCA

In “Aligning Artificial Intelligence with Climate Change Mitigation”, Kaack et al. add a system lens to LCA by categorising AI’s climate impacts as:

1. **Computing-related**: emissions from electricity and hardware.
2. **Immediate application**: emissions changes from deploying AI.
3. **System-level**: rebound effects (also known as Jevon's Paradox), behavioural shifts, and structural change.

When aligned with the [Technology Carbon Standard (TCS)](https://www.techcarbonstandard.org/), which is derived from the LCA, these categories combine LCA’s process rigour with broader socio-technical context.

LCA measures what is emitted; system-level frameworks explain why and how emissions evolve. Integrating the two enables policies that address both efficiency and demand.

### Standardisation Initiatives

Efforts like Hugging Face’s **AI Energy Score** and Mistral AI’s LCA reporting show movement toward transparency but reveal trade-offs: the Energy Score is simple but scope-limited (inference only); Mistral’s report is broader but lacks methodological detail for reproducibility.

These initiatives are complementary but incomplete. A unified approach would blend scope with accessibility, rooted in ISO 14040 principles and the GHG Protocol.

Since completing the review we have seen several companies release data about their energy usage, carbon and/or water impact. Without a standard or published approach, comparison becomes highly difficult.

### Training vs. Inference: Shifting the Emissions Centre of Gravity

Early AI footprint studies emphasised training costs, with emissions in the hundreds of tonnes CO₂eq [^17] [^15]. Recent work shows this narrative is incomplete: inference can surpass training in cumulative emissions at scale.

- **Low-volume inference**: training dominates at 85%+, inference at just 3% [^16].
- **Large-scale deployment**: per-query emissions vary by a factor of 70 across models; at billions of queries per day, inference becomes the primary driver [^9] [^14].
- **Reconciliation**: differences arise from functional units (per-query vs. total lifetime) and boundary conditions (inclusion/exclusion of networking, devices).

Training and inference impacts are dynamic, not fixed. For sustainable AI, training optimisation is a one-off gain, while inference efficiency compounds over the model’s lifetime. Reporting standards should require clear disclosure of usage assumptions, scope, and life cycle length to enable meaningful comparison.

### Measurement Tools and Methodologies

Accurate measurement moves the field beyond theoretical estimates. Three open-source tools were used in the studies:

- **Experiment Impact Tracker**[^6]: systematic reporting for research.
- **Carbontracker**[^1]: real-time monitoring with predictive early-stopping.
- **CodeCarbon**: lightweight, production-friendly tracking.

All three track CPU/GPU energy use with regional carbon intensity data (How much CO₂ is emitted per unit of electricity), but none offers complete life cycle coverage or embodied emissions integration. They share dependencies on imperfect hardware APIs and inconsistent networking inclusion. Combined strategically, they can cover different phases: predictive control (Carbontracker), publication compliance (Experiment Impact Tracker), and operational monitoring (CodeCarbon).

Measurement enables targeted interventions, for example, shifting training to low-carbon windows, batching inference requests, or routing workloads to smaller models.

### Green AI Strategies: From Measurement to Mitigation

The following strategies were used or suggested in the literature to mitigate the environmental impact of LLMs:

1. **Model efficiency**: Smaller architectures, pruning, and quantisation [^9] [^8] cut inference energy without major performance loss.
2. **Energy-aware training**: Location and timing shifts can reduce emissions 30× [^6] [^17]. Caution is needed with off-peak energy scheduling, as large spikes in demand can cause the local grid to change its energy mix. See [The problems with carbon-aware software that everyone’s ignoring](https://github.com/climateaction-tech/grid-aware-software/tree/main?tab=readme-ov-file) by the [Green Web Foundation](https://www.thegreenwebfoundation.org/) for more information on the impact of energy aware techniques.
3. **Inference optimisation**: Batching, caching, and task-specific models reduce lifetime impact.
4. **Life cycle approaches**: Include embodied carbon in procurement and extend hardware life.
5. **Transparency**: Dual reporting for research depth and user clarity.
6. **Governance**: Efficiency as a research metric; procurement from renewable-powered data centres.

These strategies can be classified in three tiers: 

- **workload-specific optimisation**: Applying methods and tools to reduce the processing required to train and run your LLM.
- **infrastructure alignment**: Using hardware efficiently across it's lifecycle from procurement to disposal. Guidance on these topics can be found in the [Technical Carbon Standard](https://www.techcarbonstandard.org/).
- **system-level governance to prevent rebound effects (Jevon's Paradox)**: When designing the system, take a holistic view, looking not just aat your use, but how it will impact both your upstream suppliers and downstream customers.

### Challenges: Barriers to Progress

Three interconnected barriers slow progress:

1. **Inconsistent reporting**: Boundaries, functional units, and life cycle stages vary, making results incomparable.
2. **Hardware opacity**: Lack of cradle-to-grave emissions data from manufacturers skews focus toward operational emissions.
3. **System-level blind spots**: Efficiency gains can drive up total demand, negating benefits.

These challenges reinforce each other: incomplete reporting hides hardware’s footprint; lack of hardware data biases optimisation; absent demand governance allows rebound effects to erase gains.

## Conclusion

AI’s environmental footprint is measurable and reducible, but progress depends on integrating measurement, mitigation, and governance into a unified framework. The evidence converges on three imperatives:

- **Measure comprehensively**: Include training, inference, and embodied hardware emissions.
- **Report transparently**: Declare boundaries, functional units, and assumptions to enable comparability.
- **Govern at the system level**: Pair efficiency improvements with demand-side controls to ensure absolute emissions reductions.

### Key takeaways:

- **Life cycle boundaries matter**: what you include changes the story.
- **Training vs inference**: inference often outweighs training over time.
- **Carbon ≠ energy ≠ water**: each has its own drivers and mitigation paths.
- **Narratives diverge**: both “AI is a problem” and “AI is a solution” can be true.
- **Mitigation is possible**: batching, caching, model choice, and location all help.

**Action you can take today**: Start tracking energy, carbon, and water in your CI pipeline, and show the numbers in your PRs or a regular report.

Without shared standards and life cycle-inclusive reporting, efficiency gains risk being cosmetic. With them, environmental performance could become as visible and competitive a metric as accuracy or speed — aligning AI’s development with global climate goals.

## References

[^1]: Anthony, L. F. W., Kanding, B., & Selvan, R. (2020). “Carbontracker: Tracking and Predicting the Carbon Footprint of Training Deep Learning Models”. University of Copenhagen.

[^2]: Berthelot, A., Caron, E., Jay, M., & Lefèvre, L. (2024). “Estimating the Environmental Impact of Generative-AI Services Using an LCA-Based Methodology”. “Procedia CIRP, 122”, 707–712. [https://doi.org/10.1016/j.procir.2024.01.098](https://doi.org/10.1016/j.procir.2024.01.098).

[^3]: Bolón-Canedo, V., Morán-Fernández, L., Cancela, B., & Alonso-Betanzos, A. (2024). “A Review of Green Artificial Intelligence: Towards a More Sustainable Future”. “Neurocomputing, 599”, 128096. [https://doi.org/10.1016/j.neucom.2024.128096](https://doi.org/10.1016/j.neucom.2024.128096).

[^4]: Cheung, K. S., Kaul, M., Jahangirova, G., Mousavi, M. R., & Zie, E. (2025). “Comparative Analysis of Carbon Footprint in Manual vs. LLM-Assisted Code Development”. King’s College London; Charsfield Research & Advisory.

[^5]: Dauner, M., & Socher, G. (2025). “Energy Costs of Communicating with AI”. “Frontiers in Communication, 10”, 1572947. [https://doi.org/10.3389/fcomm.2025.1572947](https://doi.org/10.3389/fcomm.2025.1572947).

[^6]: Henderson, P., Hu, J., Romoff, J., Brunskill, E., Jurafsky, D., & Pineau, J. (2020). “Towards the Systematic Reporting of the Energy and Carbon Footprints of Machine Learning”. “Journal of Machine Learning Research, 21”, 1–44.

[^7]: Hugging Face. (n.d.). “AIEnergyScore. [https://huggingface.co/AIEnergyScore](https://huggingface.co/AIEnergyScore)

[^8]: Iftikhar, S., Alsamhi, S. H., & Davy, S. (2025). “Enhancing Sustainability in LLM Training: Leveraging Federated Learning and Parameter-Efficient Fine-Tuning”. “IEEE Transactions on Sustainable Computing. [https://doi.org/10.1109/TSUSC.2025.3592043](https://doi.org/10.1109/TSUSC.2025.3592043).

[^9]: Jegham, N., Abdelatti, M., Elmoubarki, L., & Hendawi, A. (2025). “How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference”. University of Rhode Island, University of Tunis, Providence College.

[^10]: Jinhu Bian, Ainong Li, Xi Nan, Zhengjian Zhang, Guangbin Lei, Jinping Zhao, Yi Deng, Xiaohan Lin, Limin Chen, and Amin Naboureh. (2025). “Tracking the Carbon Footprint of Global Generative Artificial Intelligence”. “The Innovation, 6”(5), 100838. [https://doi.org/10.1016/j.xinn.2025.100838](https://doi.org/10.1016/j.xinn.2025.100838).

[^11]: Kaack, L. H., Donti, P. L., Strubell, E., Kamiya, G., Creutzig, F., & Rolnick, D. (2022). “Aligning Artificial Intelligence with Climate Change Mitigation”. “Nature Climate Change, 12”(6), 518–527. [https://doi.org/10.1038/s41558-022-01377-7](https://doi.org/10.1038/s41558-022-01377-7).

[^12]: Klöpffer, W. (1997). “Life Cycle Assessment: From the Beginning to the Current State”. “Environmental Science and Pollution Research, 4”(4), 223–228.

[^13]: Liu, V., & Yin, Y. (2024). “Green AI: Exploring Carbon Footprints, Mitigation Strategies, and Trade-offs in Large Language Model Training”. “Discover Artificial Intelligence, 4”(49). [https://doi.org/10.1007/s44163-024-00149-w](https://doi.org/10.1007/s44163-024-00149-w).

[^14]: Luccioni, A. S., Jernite, Y., & Strubell, E. (2024). “Power Hungry Processing: Watts Driving the Cost of AI Deployment?”. In “Proceedings of the ACM Conference on Fairness, Accountability, and Transparency (ACM FAccT ’24), 21 pages. [https://doi.org/10.1145/3630106.3658542](https://doi.org/10.1145/3630106.3658542).

[^15]: Luccioni, A. S., Viguier, S., & Ligozat, A.-L. (2022). “Estimating the Carbon Footprint of BLOOM, a 176B Parameter Language Model”. Hugging Face, Graphcore, LISN & ENSIIE.

[^16]: Mistral AI. (2024, May 28). “Our Contribution to a Global Environmental Standard for AI”. [https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai](https://mistral.ai/news/our-contribution-to-a-global-environmental-standard-for-ai)

[^17]: Patterson, D., Gonzalez, J., Le, Q., Liang, C., Munguia, L.-M., Rothchild, D., So, D., Texier, M., & Dean, J. (2021). “Carbon Emissions and Large Neural Network Training”. Google & University of California, Berkeley.

[^18]: Ren, S., Tomlinson, B., Black, R. W., & Torrance, A. W. (2024). “Reconciling the Contrasting Narratives on the Environmental Impact of Large Language Models”. “Scientific Reports, 14”, 26310. [https://doi.org/10.1038/s41598-024-76682-6](https://doi.org/10.1038/s41598-024-76682-6).

[^19]: Strubell, E., Ganesh, A., & McCallum, A. (2019). “Energy and Policy Considerations for Deep Learning in NLP”. University of Massachusetts Amherst.

[^20]: Wang, Q., Li, Y., & Li, R. (2024). “Ecological Footprints, Carbon Emissions, and Energy Transitions: The Impact of Artificial Intelligence (AI)”. “Humanities and Social Sciences Communications, 11”, 1043. [https://doi.org/10.1057/s41599-024-03520-5](https://doi.org/10.1057/s41599-024-03520-5).