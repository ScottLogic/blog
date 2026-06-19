---
title: Sustainable acceleration and the Agentic Software Development Life Cycle
date: 2026-06-19 00:00:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
- AI
- Agentic AI
- ASDLC
- Governance
- Prompt Engineering
- Agile
- People
- Cognitive Entropy
- Delivery
summary: A discussion of how to successfully leverage agentic AI to raise the productivity ceiling covering the topics of human oversight, governance, and disciplined engineering practices that preserve stability.
author: dallsop
---

The traditional Software Development Life Cycle (SDLC) treats requirements, design, implementation, verification, and maintenance as separate phases coordinated by humans. Transitioning to Agentic Software Development Life Cycle (ASDLC) sees AI agents actively participating in reasoning, planning, validation, and optimisation across each of the phases of the SDLC. This presents new challenges to absorb, govern, review, and sustain the pace of change AI enables. In pursuit of raising the productivity ceiling what do we need to remain mindful of?

#### Governance
Transitioning to ASDLC is underpinned by organisational processes, governance, and culture. AI amplifies existing engineering culture and so organisations with fragmented processes, inconsistent standards, or weak architectural discipline will discover that AI scales disorder just as efficiently as it scales productivity. Thus organisations must take steps to review and strengthen the foundations of their SDLC to ensure that AI serves to accelerate value delivery.

#### Policies
Establishing and refining clear policies regarding AI agents is essential. These should cover a range of areas providing guidance to human engineers regarding approved AI use, cost and resource consumption, data protection, and escalation paths. There should be a clear message that reinforces judgement as a fundamentally human responsibility which should not be delegated to AI. 

#### Leadership
The role of tech leadership shifts to orchestrating collaboration between humans and AI agents. Responsible use of AI requires fostering a culture of healthy scepticism, and reinforcing a core principle that humans must remain firmly in the driving seat at all times. Targeted training can help reinforce that AI agent output should not be accepted passively. Such training can promote good practices including questioning AI agent assumptions and independently validating AI agent reasoning.

#### Human Engineers
Human engineers move up the value chain focusing less on implementation and more on orchestrating design, evaluating trade-offs and shaping architecture. Their efforts to simplify are becoming increasingly strategically critical including reducing technical debt, minimising maintenance surface area, and preserving architectural clarity. In addition, prompt engineering is now a core competency, with AI agents' effectiveness depending on how effectively humans can define objectives, constraints, and architectural intent. This skill requires continuous refinement as model updates can greatly alter the output of prompts. Great prompts can (model updates permitting) be shared across teams as reusable interaction patterns between human engineers and AI agents. Planning benefits heavily from well-structured prompts reducing unnecessary iteration and minimising wasted AI Compute Unit (ACU) consumption. Plans very rarely survive implementation unchanged, but spending the time to resolve ambiguity before generating code is significantly less costly than correcting flawed assumptions afterwards.

#### Pacing
The surge in AI generated activity is already exponential, placing significant infrastructure and scaling pressure on platforms such as GitHub. However, human attention does not scale exponentially. As AI generated activity such as pull requests continues to increase, a psychological strain can emerge in the form of mounting expectations for human engineers to review, comment and merge in increasingly compressed timelines. 

Let us take a moment to consider the Japanese concept of ma (間) which refers to intentional space or pause in both physical and temporal contexts. Hayao Miyazaki, co-founder of Studio Ghibli, once described it by clapping repeatedly and explaining “The time in between my clapping is ma. If you just have non-stop action with no breathing space at all, it’s just busyness.”. As human engineers begin collaborating with AI agents, intentional pacing becomes essential to supporting them as effective stewards of their systems. This is not inefficiency, but instead actively preserving long-term coherence in systems adapting to accelerated delivery:

* For human engineers, this means providing sufficient time to properly evaluate changes before signoff, enabling them to act as a stabilising force.
  
* For teams, this means allotting deliberate pauses for reflection, continuous learning and iterative improvement of collaborative AI agent workflows.
  
* For codebases, this means protecting system robustness by mitigating the effect of code churn at machine scale. In practice, this may require introducing cooldown periods after high entropy changes, or throttling the volume of AI agent pull requests.

#### Cognitive Entropy
One emerging anti-pattern of Agentic AI is the overproduction of engineering artifacts (especially markdown files) at a volume and pace that cannot be comfortably consumed by human engineers. Organisations need to maintain their information architectures by actively reducing content sprawl, removing file duplication, standardising naming, and maintaining reliable knowledge sources. These measures are essential for helping human engineers navigate information, understand systems, and avoid cognitive saturation. Furthermore, there needs to be a focus on making sure generated content is not hostile for humans to engage with. This requires actively reducing cognitive entropy:

* Providing rendered views instead of raw markdown.
  
* Generating diagrams and visual explanations.
  
* Adapting information density to meet the needs of the reader.
  
* Choose information structures better suited to the context. For example:
  
  * Logs for a production outage investigation might best take the form of chronological timelines.
    
  * Meeting discussion notes might best be clustered semantically into conceptual units such as “Decisions Made“, “Action Items”, “Open Questions”, etc.

#### Accessibility
Many enterprise systems have been optimised solely for human interaction. As AI adoption increases, organisations should consider evolving these systems to better support collaboration with AI agents. Exposing clearer APIs, workflows and AI agent friendly interfaces that enable AI agents to operate more efficiently at scale. Organisations that modernise their platforms in this way will be better positioned than those relying on legacy systems designed for manual workflows and human paced decision making.

#### Assurance
Rapid content generation is creating a profound shift in delivery bottlenecks from implementation to assurance. Implementation time is decreasing, making assurance activities before signoff the new dominant constraint. Generating large volumes of code very quickly can leave the review process feeling disproportionate to the implementation effort. It is important not to try and scale old traditional signoff practices which assume human authorship and human scale output. A useful approach is to have AI agents rank the uncertainty of their contributions to flag high entropy changes versus boilerplate ones. Reasoning traces can also be included to provide human reviewers with greater transparency, while also being used as feedback that can be used to refine future prompts. Independent AI agents can be used to investigate and challenge changes which shifts assurance from a purely manual activity toward a more scalable and collaborative verification process between humans and AI agents.

### Conclusion
Competitive advantage will belong to organisations that combine AI acceleration with clear accountability, information organisation and accessibility,  sustainable delivery pacing, scalable assurance practices, and continuous learning and adaptation. Organisations capable of compounding intelligence, automation, and delivery velocity without undermining stability will define the next era.
