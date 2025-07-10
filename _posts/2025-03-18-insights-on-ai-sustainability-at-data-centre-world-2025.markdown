---
title: Insights on AI Sustainability at Data Centre World 2025
date: 2025-03-18 20:07:00 Z
categories:
- Sustainability
- Tech
tags:
- Sustainability
- datacentres
- hardware
summary: Oliver's reflections on the Sustainable AI and Data Centres type content
  at Data Centre World London March 2025.
author: ocronk
image: "/uploads/datacentre-world-orb-hand.JPG"
---

Last week, I had the opportunity to [speak at](https://www.iema.net/articles/experts-voice-fears-over-growing-impact-of-data-centres-on-nature/) and attend [Data Centre World](https://www.datacentreworld.com/conference-programme) as part of the larger Tech Show London 2025. This massive event sprawled across half of the ExCeL centre, bringing together industry vendors, academics, and innovators across multiple technology domains. While the conference covered loads of topics, I was particularly drawn to sessions focusing on sustainable data centres and AI computing. I did my best to navigate the busy conference floor and attend as many relevant talks as possible!

On the surface much of the messaging at the conference aligned with sustainability themes. Not far off what we've been exploring through [previous blog posts](https://blog.scottlogic.com/ocronk/) and my personal podcast, [Architect Tomorrow](https://www.youtube.com/@ArchitectTomorrow), where sustainable technology solutions are a common topic. However as always the devil was in the detail and the reality was mixture of best intentions, outright [greenwashing](https://blog.scottlogic.com/2024/04/15/how-cxos-can-spot-technology-greenwashing.html) through to genuine looking pragmatic progress on making data centres more sustainable.

## The Double-Edged Sword of AI and Data Centres

Data centres are a double-edged sword when it comes to sustainability. On one hand, they *can* enable technologies that can help solve climate change and optimise resource usage (but they can also be used for frivolous purposes or [optimise the extraction of fossil fuels](https://www.datacenterdynamics.com/en/news/microsoft-accused-of-greenwashing-due-to-fossil-fuel-partnerships/)). On the other hand, they are significant consumers of energy and resources. Compounded by a lack of transparency and [accurate data](https://www.adalovelaceinstitute.org/blog/data-ai-climate-impact/) to really understand their real impact.

![Double-edge-PXL_20250313_113414572.jpg](/uploads/Double-edge-PXL_20250313_113414572.jpg)

\(Kennedy Miller of Leviton during his presentation)

## Power: The Challenge of the Decade?

Perhaps the most consistent message throughout the conference was that power availability will be the primary challenge for data centres over the next 10-15 years. Without addressing this fundamental constraint, our ability to scale AI and other compute-intensive technologies will be severely limited.

Given the constraints of many national grid systems and a general association by the tech industry that Green IT equals energy efficiency I wasn't massively surprised with this focus. The need to expand focus beyond "Operational" to "Upstream" embodied impacts and "Downstream" end user impacts - was one of the drivers behind creating our [Tech Carbon Standard](https://www.techcarbonstandard.org/) with its 3 pillars.

The panel on "All in on AI but What About Sustainability" explored innovative approaches including direct renewable connections, [microgrids](https://en.wikipedia.org/wiki/Microgrid), and potential convergence of data centres with [power generation facilities](https://www.theregister.com/2024/05/16/datacenter_power_demands/). The topic of heat reuse was also touched on. These ideas challenge us to think beyond traditional boundaries when architecting tomorrow's infrastructure.

## Economics and the Potential AI Bubble

An undercurrent at the conference, though not always explicitly stated, was the question of economic sustainability in the AI boom. Investment funds backing data centres are now looking beyond traditional infrastructure and considering power investments - a significant shift that signals deeper structural changes in how technology is financed and built.

This economic dimension raises important questions: Are we in the midst of an AI bubble that could eventually burst? In my piece from mid 2024 "[Will Generative AI implode and can it become more sustainable](https://blog.scottlogic.com/2024/07/16/the-impending-implosion-of-generative-ai-and-the-potential-of-a-more-sustainable-future.html)", I explored how the current trajectory of AI development doesn't look be sustainable various standpoints (economic, environmental, social).

When we consider the enormous capital expenditure on AI infrastructure [against uncertain long-term returns](https://www.theregister.com/2025/02/26/microsofts_nadella_wants_to_see/#:\~:text=Nadella%20thinks%20a%20better%20benchmark,percent%20for%20the%20developed%20world), it's worth questioning the economic sustainability of the current approach alongside environmental sustainability. These 2 are interlinked:

* Clearly massive amounts of rapid investment can lead to shortcuts and growth at all costs; often to the environment and social impacts

* Making AI more cost effective and efficient could / should also reduce its material and energy footprint. As less demanding AI models and hardware providing more tokens per watt mean less requirements for servers, GPUs and the electricity to run them. (Yes I know rebound effect etc but perhaps controversially I think there is an upper bound on the amount of demand for AI)

## Revised AI Energy Use Projections

During a session on sustainable AI in the cloud the projected growth of cloud computing energy consumption was discussed. Gregory Lebourg from OVHcloud shared that cloud computing currently consumes approximately 460TWh of electricity globally. While originally forecasts estimated this would double by 2026 (to levels comparable with France's entire electricity consumption!), more recent forecasts now suggest a 60-70% increase by 2030.

These revised projections might be early indicators of a more realistic growth trajectory, or perhaps the beginning of a correction in the AI hype cycle / bubble. Still, even this growth projection is significant and will still challenge our energy infrastructure unless we architect our systems differently.

Matt Foley from AMD presented their approaches to sustainability. AMD's focus on hardware efficiency has apparently yielded the following results: 6x more cores, 11x better performance, and 4x greater efficiency over five years. Gregory explained that OVHcloud has concentrated on holistic sustainability, including supply chain improvements and advanced cooling technologies.

## Challenging the "Bigger is Better" Mindset

One of the most thought-provoking sessions came from DEFRA's team discussing AI in government. They challenged the prevailing "bigger is better" approach to AI models, noting that we are potentially reaching the limits of scaling by simply throwing more compute at problems. This is something I massively agree with - and you can check out my other [recent blog - there is more than one way to do GenAI](https://blog.scottlogic.com/2025/02/20/there-is-more-than-one-way-to-do-genai.html) for the detail.

There was also a suggestion of a "nutritional style label" for AI models resonated which with me - its not far off what [Hugging Face are doing with their AI Energy Score project](https://huggingface.co/blog/sasha/announcing-ai-energy-score). To me transparency about environmental impact should be a core design principle. Another comparison made during the session was stark: old style incandescent light bulbs with 5% efficiency were banned, yet we embrace AI systems with potentially worse efficiency!



## Holistic Architectural Thinking
> "up to 10% of European heating needs could potentially be met through data centre heat recovery"

Several sessions highlighted the need for holistic thinking about data centre design. Francesco Di Giovanni from Daikin outlined how up to 10% of European heating needs could potentially be met through data centre heat recovery. Kennedy Miller from Leviton challenged us to look beyond metrics like PUE to address supply chain sustainability. The Siemens Energy team demonstrated how data centres have evolved from steady-state grid loads to more unpredictable "tyrants" on the grid.

Whilst at the conference I managed to catch Mark Bjornsgaard from Deep Green (one of the pioneers of reusing heat from computing for heating) - look out for him appearing on Architect Tomorrow very soon.

## The Elephant sorry I mean Engine in the Room!

![BFengine.JPG](/uploads/BFengine.JPG)

As a reminder of how much infrastructure (beyond compute that sits in the stereotypical racks you seen when there is a picture of a data centre) that supports DCs at was eye opening. I found it rather ironic that near lots of signs about Green IT and sustainability was a massive internal combustion engine generator the size of a small house.

This raises the fact that resilience of power supply sometimes fights with sustainability objectives. If you are a hardware geek it was a haven - lots of tools, 19" rack enclosures, power distribution units, batteries, chillers and other kit! But it was a stark reminder of the supply chain and supporting ecosystem with its associated embodied carbon and life cycle impacts.

![pcb-capacitors.JPG](/uploads/pcb-capacitors.JPG)

Massive thanks to Patrick from Daikin for taking a good 20 minutes or so to explain a lot of this infrastructure to me on their stand! It's been quite a long time since I built and racked a server at a co-location data centre facility and hyperscalers have moved things on significantly due to increased density and of course scale.

## Beyond Energy: The Broader Environmental Impact

On the second day, [I participated in a panel discussion on "How Can We Manage the Nature Impact of AI?"](https://www.iema.net/articles/experts-voice-fears-over-growing-impact-of-data-centres-on-nature/) alongside experts including Deborah Andrews, Laila Takeh, and Sarah Krisht chaired by Astrid Wynne Rogers.

Our discussion expanded beyond the energy consumption narrative to consider impacts on land use, biodiversity, water resources, and pollution. As we didn't have a huge amount of time we focussed on water usage and how organisations can think differently about data centre design and its life cycle impacts.

Whilst this session was at the end of the second day - so we got a small but committed crowd - it was worth doing for the dialogue on the panel and with the audience. Many seem keen to learn more about how to strike a pragmatic balance when it comes to data centre developments. One of the most interesting questions was from someone in local government. They asked - what can we do in the planning process to try and manage the nature impacts and sustainability of DC projects.

## Architecting a More Sustainable Tomorrow

As I reflect on what I learnt at Data Centre World, I'm both concerned and optimistic. The scale of the challenge is immense, but the conference demonstrated that innovative thinking is out there but it needs more support. As customers we need to get louder on these issues to ensure they aren't side stepped or put in the too hard box.

At Scott Logic, we are committed to advancing this conversation and developing practical approaches to more sustainable digital systems. We recognise that the choices we make today will shape the environmental impact of technology for decades to come - for more on this see the [Conscientious Computing Series](https://blog.scottlogic.com/2023/10/26/conscientious-computing-facing-into-big-tech-challenges.html).

The fundamental question remains: how do we harness the potential of AI and other advanced technologies while minimising their environmental footprint? The answer lies not just in incremental improvements to existing approaches, but in fundamentally rethinking how we architect and design tomorrow's systems. We need to consider circular approaches, heat re-use and novel operating models (including how do we distribute compute to the edge to complement centralised computing in data centres) - for more on this see the recent piece I mentioned before - on [there is more than one way to architect AI](https://www.linkedin.com/pulse/more-than-one-way-architect-ai-oliver-cronk-tfnsf/).

I'd love to hear your thoughts on this - particularly if you are working on something novel or innovative on sustainability in the data centre space. How is your organisation approaching sustainable computing?

**Full disclosure** - I frantically took notes during the parts of the conference I attended and then used Claude to helpfully turn these into more of a narrative adding in the pictures I took. I have then heavily edited what it produced to ensure it's in my voice. Its probably the only way at the moment I could get a blog out on this topic in a reasonably timely manner given current workload!