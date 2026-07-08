---
title: 'Auditable Agentic Orchestration: From Autonomous Systems to Governed Execution'
date: 2026-07-08 00:00:00 Z
categories:
- Artificial Intelligence
summary: Giving AI agents free rein is easy. Trusting their output is hard. This post explores how workflow engines like Fluxnova, and its new Agentic Subprocess, bring auditability and control to agentic orchestration without sacrificing the flexibility that makes agents valuable.
author: tstavert
---

## The Rise of Agentic Orchestration

Throughout 2025 we observed a shift in the way that AI was used. As the use of AI shifted from passive text generation to autonomous execution we saw the rise of AI agents, capable of handling much more complex tasks and suddenly offering real value to businesses. 

As the variety and complexity of tasks that AI agents were proven capable of grew, so too did the need to direct the way they operate in a structured way and organise their outputs into usable forms.

The value of AI agents in business workflows comes from their flexibility; their ability to handle unstructured and inconsistent inputs, carry out tasks that require them to plan, adapt on the fly and if necessary, work iteratively until they have achieved their goal. 

This fundamentally non-deterministic behaviour that AI agents derive their value from is exactly what makes these agents challenging to work with. Non-determinism is a feature, not a bug, so how do we guarantee we get the outputs we need from AI agents without constraining their behaviour such that we lose the very thing that gives them transformative power for businesses?

This challenge has led to the rise of agentic orchestration. Instead of relying on a single agent following a set of step-by-step instructions to achieve a task, AI agent orchestration creates a structure under which multiple agents work together, often following complex, multi-step workflows. 

Orchestration is a structured execution framework for workflows which establishes the tasks undertaken by each agent, how they relate to one another, and which guardrails are put in place to validate their outputs and minimise unexpected behaviours. Where agents bring flexibility to workflows, orchestration enforces guarantees by constraining agents within deterministic, explicitly modelled behaviour. 

Agentic orchestration is about letting systems think freely, but act within boundaries. Workflow engines provide a deterministic skeleton into which non-deterministic agent behaviour can be safely embedded. Agents decide how, workflows decide when, where and under what constraints. 

## Workflow Automation and BPMN

Agentic systems are rediscovering problems that workflow engines have solved for decades. Workflow engines first emerged as business process management (BPM) tools, automating business processes often defined in XML, YAML or JSON, and ensuring that they execute in a reliable and predictable way. 

With the rise of distributed systems, these workflow engines adapted to better coordinate microservices at scale and manage long-running, fault-tolerant workflows. Many sectors, including financial services, healthcare, and the public sector require their workflows to be auditable and reproducible, so workflow engines are commonly built to maintain audit trails for regulatory compliance.

![Simple BPMN]({{ site.github.url }}/tstavert/assets/fluxnova/simple_bpmn_workflow_example.png "Simple example of a BPMN diagram")

Workflow engines typically represent business processes using process models: flowcharts that non-technical business users can easily read and understand, acting as a shared contract between business intent and execution. Business Process Model & Notation (BPMN) emerged as a standardised modelling notation for business processes in the early 2000s and BPMN 2.0, which goes beyond just diagrams to define precise execution semantics, became a formally published ISO standard in 2013.  

These process models are also a great way of representing the multiple reasoning steps that AI agents must make when being used in complex business processes. These easily understood flowcharts allow networks of agents to be visualised and understood, even by non-technical personnel, allowing for unprecedented visibility and understandability for even advanced agentic workflows.

Much of the recent success of AI agents comes from "tool calling" capabilities - that is, their ability to communicate with live external systems to access a level of agency outside of their initial training dataset, such as querying external data sources or performing actions in other applications. In BPMN, these tools can easily be represented by service tasks: the nodes in the process models used by workflow engines. The tools themselves could be internal APIs, CRMs, payment systems, or even other workflows managed by the engine. 

This provides a vital integration between these modern agentic workflows and existing infrastructure. Representing tools visibly in this way creates a clear visual indicator of where the agent's work ends, and where deterministic business logic begins. 

As agentic workflows are adopted for long-running tasks which span hours or even days, it becomes essential that their execution is reliably persistent and fault-tolerant. Circuit breaking, error handling, retry logic; these are all challenges relevant to agentic orchestration as much as traditional business workflows, and these challenges are largely solved by modern workflow engines. 

Observability is another key offering of process orchestration software. When a regulator questions what happened with a particular business process, the business must be able to answer exactly what happened, when, and why, and reproduce the results. Anyone who has tried to demo an agent being given complete control over a task will be able to tell you that understanding the reasons for its outputs is often challenging, and reproducing exact results is next to impossible. 

As well as restricting the influence that agents have on workflows, modelling agentic workflows in workflow engines ensures that any decisions made by an AI agent can be traced and explained through audit logs. This positions workflow engines as the perfect tool for agentic orchestration when there is a need for traceability and auditability for regulatory compliance.

It bears repeating: agentic systems are rediscovering problems that workflow engines have solved for decades. These systems need the same operational guarantees as traditional distributed systems, just with probabilistic decision-making layered on top. Rather than reinventing the wheel, why not take advantage of existing process orchestration software to add visibility and reliability to agentic workflows?

## Agentic Orchestration in Fluxnova

Fluxnova is an open-source process orchestration platform which allows businesses to automate and orchestrate business processes without vendor dependence. The project is governed by FINOS and supported by large financial institutions including Fidelity Investments, NatWest Group, Deutsche Bank, BMO and Capital One. Fluxnova is built on BPMN with a focus on audit-ready execution, giving it huge potential for supporting agentic workflows.

Over the last few months, I have been fortunate to have been involved in developing AI capabilities within Fluxnova as part of Scott Logic's ongoing dedication to supporting open-source software. Expanding Fluxnova's agentic orchestration capabilities has been a high priority for the project's AI working group, which prompted our latest contribution in collaboration with NatWest Group: The Agentic Subprocess. 

The idea behind the Agentic Subprocess is to empower Fluxnova workflows with agentic decision-making capabilities. Essentially, this allows you to draw a box around a section of the workflow and allow tasks within this box to become triggerable by an agent in whatever order it chooses, operating in a loop until its goal is complete. This might involve retrieving data, sending emails or even triggering other business processes. The Agentic Subprocess creates a bounded sandbox in which an agent can operate semi-autonomously, but under clearly defined constraints.

![Fluxnova Agentic Subprocess]({{ site.github.url }}/tstavert/assets/fluxnova/fluxnova_agentic_subprocess_example.png "Example of the Agentic Subprocess in Fluxnova")

Importantly, the tasks themselves are regular tasks modelled in BPMN, and when triggered by the agent these are executed by the workflow engine and so can leverage all the benefits that brings, such as audit logs, retry logic and persistence. The Agentic Subprocess draws a clear boundary which defines exactly which activities any given agent is allowed to carry out. Tasks outside of the boundary are not available to the agent, creating clear limitations around its capabilities that both technical and non-technical personnel can understand. 

In the example of a loan application process shown above, the tasks to approve loans or send rejection notices sit outside of the subprocess boundary and therefore cannot be directly triggered by the agent. This creates a clear divide between which actions an agent can take, and those that are better left up to deterministic business logic.

The added benefit of operating these workflows in Fluxnova is that, unlike many other workflow orchestration platforms, it is free and open source. This is particularly important when it comes to software with AI functionality, as it is not at risk of being taken over by any particular AI provider. This is a critical concern as the cost of generating tokens increases and we look towards the feasibility of open-source local models. Workflows built in Fluxnova using our Agentic Subprocess plugin are written purely in BPMN, freeing businesses from any risk of lock-in to any software vendor or AI provider. 

## Rethinking Workflows in an Agentic World

When considering how agentic behaviour can improve upon existing business workflows, it's easy to fall into the trap of just dropping in agents in place of human tasks. While this is no doubt helpful in some situations, agentic behaviour is not just about removing human judgement from processes and handing it over to LLMs. Agents don't just automate tasks - they change the workflow itself. 

Dynamic branching of processes becomes possible, and processes become goal-driven rather than following predefined paths. For businesses, the challenge becomes guaranteeing the outcomes of workflows that have become non-deterministic and ensuring these processes still follow relevant regulations. This is where the deterministic skeleton of workflow engines like Fluxnova becomes essential, providing validation gateways throughout the process, keeping it grounded and controllable.

Where traditional workflows optimise for predictability, agentic workflows favour adaptability. As I stated at the start of this blog post, non-determinism is a feature, not a bug, but to be utilised by businesses, particularly in highly regulated industries, it must be contained and observable, not uncontrolled. Therefore, the future of agentic workflows must combine a deterministic backbone which is offered by existing workflow engines, with the decision-making power of agents. Agent workflows of the future will be required to be explainable, and auditability will be a first-class feature.

In many ways we are still living in the wild west of agentic adoption, and many of the agentic features being built into existing products feel like add-ons rather than first-class features. However, I predict that as agents become a mainstay of modern software, standardisation will emerge. I would go as far as to say that BPMN will be extended to support agentic features, and agents will no longer be bolt-on features to workflow engines but end up embedded deeply in their core.

The future isn't just fully autonomous systems - it's governed autonomy. Auditable agentic orchestration is how we get there.

