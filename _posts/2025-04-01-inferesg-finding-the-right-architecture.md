---
title: 'InferESG: Finding the Right Architecture for AI-Powered ESG Analysis'
date: 2025-04-01 00:00:00 Z
categories:
- Artificial Intelligence
tags:
- Sustainability
- Artificial Intelligence
- Innovation
- Research
- ESG
- Environmental
summary: 'During the InferESG project, we made a pivotal decision to use an orchestrated workflow to conduct a deterministic process, parallel to the agentic system.'
author: drees
---

During the InferESG project we made a pivotal decision to create an alternative architecture, one that sits parallel to the agentic framework used for the conversational part of the system. This decision came about from discussions with the client, and their needs to analyse and process company sustainability reports, evaluate them and compare them to relevant materiality topics. You can read more about the [InferESG project and the challenge it presented here](https://blog.scottlogic.com/2025/03/20/inferesg-overview.html). 

*A word of caution; during this project we have become more aware that terminology such as “Agent”, “Agentic” and what they mean exactly have become a topic of their own. The architecture and components of this project use these terms, but perhaps not in ways that are aligned with more recent discussions, opinions or more [collectively agreed terminology](https://www.anthropic.com/engineering/building-effective-agents). This article does not try to apply an opinionated terminology, and uses these terms rather loosely based on understandings at the time of development.*

# From Conversation to Analysis 

The project began as a conversational, agentic framework. In this initial approach, when a user asks a question like "What does ESG stand for, and why does it matter to a company?", an Intent Agent would decompose this down into separate smaller prompts: "What does ESG stand for" and "Why is ESG important to a company". These prompts are then passed to a Supervisor, which determines which specialist agents (and their tools) are best suited to answer each question. The responses would be collected, summarised and returned to the user. 

While this architecture worked well for general ESG queries and conversations, we discovered it wasn't ideal for the systematic analysis of sustainability reports. Let's look at how this conversational approach might work when applied to report analysis: 

![Agentic, Conversational Reporting]({{site.github.url}}/drees/assets/inferesg/conversational-reporting.png)

When applying this conversational approach to sustainability report analysis, we would provide the report and a prompt to generate the analysis. The Intent Agent would attempt to break down this analysis task into several individual prompts, which would then be processed by appropriate specialist agents through the supervisor loop. Finally, these responses would be collated to produce the sustainability analysis report. 

However, we identified significant challenges with this approach. The Intent Agent, which worked well for breaking down conversational queries, struggled with the complexity and scope of full report analysis. The Intent Agent might interpret the task differently, leading to inconsistent, and incomplete coverage of key ESG topics. During some conversational tests, it even proved to be challenging to ensure that between the Intent Agent and the Supervisor, they would select the agent we expected and intended. It was a frustrating case of trial and error to improve this behaviour, but ultimately it is still not guaranteed. The key realisation was that for the report analysis, we already knew exactly what we needed to be evaluated and the format of that response - so why leave it to an LLM to determine? 

# A More Deterministic Approach 

This led us to develop a more structured workflow approach: 

![Workflow, Deterministic Reporting]({{site.github.url}}/drees/assets/inferesg/deterministic-reporting.png)

By removing the Intent Agent and Supervisor from the process and effectively providing our own intention; the report workflow. The report workflow orchestrates the process using the uploaded sustainability file, synchronously chaining the prompts and agents to obtain the company name, then relevant materiality topics to that company. Then it asynchronously: 
- produces a report overview 
- iterates through a list of question prompts producing the in-depth E, S and G analysis 
- conducts a materiality assessment 

Then finally it produces a report conclusion from all the above before returning the structured report to the UI. 

This process allowed us to clearly specify each question as a prompt without relying on an LLM to assume anything. This deterministic workflow ensures a consistent process, keeping the AI system firmly on rails to deliver a well-structured and repeatable analysis. The use of synchronous prompt chaining ensures that each following step has the necessary information for the task, whilst the asynchronous process reduces time taken to gather the responses. 

# Enhancing Analysis Through Conversation 

While the workflow approach works well for the report analysis, the conversational architecture remains a core part of our solution. We found that these two architectures can work harmoniously together, each addressing different aspects of the ESG analysis challenge. In particular, it enables the user to start with a comprehensible report analysis that provokes further questions from the user. This process starts the conversation for the analyst rather than relying on the analyst to prompt the conversation. [Read Colin's article about the Blinking Cursor Problem](https://blog.scottlogic.com/2025/02/21/ais-biggest-flaw-the-blinking-cursor-problem.html).

The conversational, agentic architecture relies on the Intent Agent and Supervisor to determine and control its processes, where a users' question can provide an open-ended task for the system to solve. 

![Agentic Conversation]({{site.github.url}}drees/assets/inferesg/conversational-agents.png)

The conversational architecture comes into its own when analysts want to explore specific aspects of the report or cross-reference information from multiple sources. For instance, after reviewing the initial report analysis, an analyst might ask: "How does this company's emissions reduction claims compare to their industry peers?" This is where the Intent Agent shines, breaking down this complex query into specific tasks: 
- Extract the company's emission claims from the report 
- Search the web for competitor emissions claims 
- Performing comparative analysis

The Supervisor can then orchestrate these tasks across different specialist agents: 
- The File Agent retrieves relevant information from the sustainability report 
- The Web Agent searches for industry benchmarks and competitor data 
- The Generalist Agent performs the comparison 

This hybrid approach offers several key benefits: 
1. **Consistency**: The deterministic workflow ensures thorough coverage of all essential aspects of ESG analysis 
2. **Flexibility**: The agentic component allows for dynamic exploration of specific areas of interest 
3. **Transparency**: Clear workflow stages make it easier to understand and validate the analysis process 
4. **Adaptability**: The system can easily incorporate new frameworks or requirements as ESG standards evolve 

# Conclusion 

As ESG reporting continues to evolve and new analytical challenges emerge, this hybrid architecture provides a foundation for future development. The modular nature of the system allows for continuous improvement and adaptation, ensuring its relevance in the rapidly changing landscape of sustainable investment. This foundation could be adapted to solve many emerging challenges in the sustainability space. 

The key lesson from our architectural journey was that sometimes the best solution isn't about choosing between different approaches, but rather about finding ways to combine their strengths. By marrying the consistency of deterministic workflows with the flexibility of agentic AI, we've created a system that provides the best of both situations and needs. 