---
title: 'Accelerating Financial Process Automation: Scott Logic’s Contribution to the
  FINOS Fluxnova Initiative'
date: 2025-10-22 09:23:00 Z
categories:
- Open Source
tags:
- FINOS
- Business Process
- Open Source
summary: Fluxnova is now live under FINOS, and with it comes a powerful new way to
  model financial workflows. In this post, we explore how Scott Logic helped shape
  the launch, contributing a suite of executable blueprint processes that span the
  full trade lifecycle. From KYC to settlement, these templates combine subject matter
  expertise with engineering precision. Curious how it all came together? Read on.
author:
- rgriffiths
- fvlachos
---

Walk into any investment bank’s trading floor, and you’ll witness a symphony of controlled chaos. Behind the scenes of every trade, from the initial client enquiry to final settlement, lies a complex web of interconnected processes, each governed by regulations, risk controls, and institutional procedures that have evolved over decades. Yet despite this complexity being universal across financial institutions, the tools to model, standardise, and optimise these processes have remained fragmented, proprietary, and often inadequate.

This is where FINOS Fluxnova enters the picture. Launched at the Open Source in Finance Forum (OSFF) in New York this October (2025), Fluxnova represents a fundamental shift towards collaborative, open-source process orchestration designed specifically for financial services. However, such tools are only as valuable as the real-world examples that demonstrate their capabilities, which is where Scott Logic’s contribution becomes crucial.

## What is Fluxnova?

Fluxnova is an open-source orchestration platform for designing and running end-to-end workflows at scale. Governed by FINOS under the Linux Foundation and released under the Apache 2.0 licence, it combines BPMN and DMN compatibility, migration tooling, and audit-ready execution from day one.

At its core, Fluxnova provides financial institutions with a standardised way to describe, visualise, and execute business processes using internationally recognised notation. Think of it as a common language that allows different systems, teams, and even organisations to speak about complex workflows in the same terms, whether you are describing a simple KYC check or a multi-counterparty derivatives settlement process.

Unlike static process documentation, these models are executable. They integrate with existing systems, enforce business rules, and provide audit trails, bridging the gap between business intent and system implementation.

They also help bridge the gap between business intent and system implementation which is often a common bottleneck in institutions reliant on bespoke CI/CD tooling and manual testing.

## Why Fluxnova Matters

Financial institutions have been grappling with process complexity for decades, but several converging factors have made standardised orchestration more critical than ever. Regulatory pressure requires institutions to demonstrate clear audit trails and consistent process execution. Digital transformation demands integration between legacy systems and modern platforms. Market volatility means processes must be understood quickly, adapted, and redeployed without delay.

Currently, many institutions rely on a patchwork of solutions: some processes documented in PowerPoint, others hard-coded in proprietary systems, and still others stored only in the institutional knowledge of long-serving employees. This fragmentation creates operational risk, makes audits painful, and slows innovation to a crawl.

Fluxnova addresses these challenges head-on. Being open source and governed by FINOS ensures that priorities are set by the community, not commercial licensing models. The roadmap is shaped by contributions from leading financial institutions including Fidelity, NatWest, Deutsche Bank, Capital One, and BMO, with participation open to the wider industry.

The first release is scheduled for November 2025, just a few weeks after the announcement at OSFF in New York, marking the point where institutions can begin adopting a transparent, community-driven platform that evolves with real-world needs.

## Fluxnova vs. Existing Solutions

The process orchestration landscape already includes established platforms such as Camunda. So why create something new? The answer mirrors the recent Terraform to OpenTofu transition, i.e., when HashiCorp moved Terraform to a restrictive license model, the open-source community responded by forking the last open-source version and creating OpenTofu under the Linux Foundation. After Camunda 7 was widely adopted as open source, Camunda 8 moved to a commercial-only model. Institutions dependent on open-source solutions found themselves in a difficult position.

Fluxnova emerges as the open alternative: built on the proven foundation of Camunda 7, but governed under FINOS with transparency, flexibility, and community ownership at its core. Existing BPMN and DMN models created for Camunda 7 work with Fluxnova with little to no modification, and in-flight cases continue running without disruption. A migration utility automates much of the transition, updating code and dependencies to align with Fluxnova while preserving process data.

This approach enables institutions to modernise legacy orchestration platforms without wholesale replacement, preserving process data while reducing operational risk.

In short, for institutions already invested in Camunda 7, Fluxnova offers continuity without dependence on a single vendor.

## Scott Logic’s Blueprint Contribution

When Scott Logic offered to support Fluxnova, we recognised the fundamental challenge every new platform faces: the “empty canvas” problem. Tools, however powerful, only prove their worth when paired with concrete, real-world examples.

Our task was to create what we’ve termed blueprint processes: generic yet realistic examples of financial workflows that capture essential regulatory, risk, and operational logic, whilst being flexible enough to adapt to different institutional contexts.

These blueprints not only accelerate adoption but also help overcome SDLC bottlenecks by providing ready-to-execute templates that reduce reliance on manual testing and *ad hoc* documentation.

### The Challenge We Tackled

Financial processes exist in some form at every investment bank, but the specifics vary dramatically between institutions. A trade settlement process at a Tier 1 US investment bank could well differ significantly from the equivalent at a Tier 1 European investment bank, not just in implementation details but often in fundamental approach. Yet beneath these variations lie common patterns: regulatory requirements, risk controls, and business logic that transcend individual institutional preferences.

Our task was to create what we've termed "blueprint processes", i.e., examples that are sufficiently generic to capture the essential elements of real-world financial workflows while remaining generally applicable across different institutional contexts. Think of them as architectural blueprints: not the final building, but detailed enough to understand the structure and adaptable enough to accommodate different requirements through modifications that are achievable easily.

### Our Approach

Each blueprint follows a consistent approach:

* **Business Definition**: clear English description of what the process accomplishes

* **Stepwise Breakdown**: logical decomposition into sequential activities

* **Visual Modelling**: diagram representation using BPMN

* **Technical Export**: XML format executable by BPMN engines

Drawing on our deep domain knowledge and subject matter expertise in financial services, we created three exemplar blueprints spanning the full trade lifecycle:

* **Pre-Trade**: KYC onboarding and compliance checks

* **Execution**: risk management, real-time assessment, and position limit monitoring

* **Post-Trade**: trade settlement and delivery versus payment coordination

The technical implementation of these BPMN flows was led by my colleague [Fanis Vlachos](https://blog.scottlogic.com/fvlachos/), one of Scott Logic’s Senior Developers, whose expertise in orchestration platforms such as Temporal and Cadence proved invaluable.

### From Modelling to Execution

Although Fluxnova's modeler was not yet available at launch, we used Camunda Modeler to draft diagrams and adapted the exported BPMN XML for Fluxnova compatibility. This not only accelerated delivery but also showcased practical migration paths for institutions with existing Camunda 7 models.

Each blueprint is more than illustrative: it is executable. Features such as boundary timers, escalation gateways, DMN decision tables, and parallel compute tasks are embedded to reflect real-world operational realities. Institutions can download a blueprint, adapt it to their own environment, and run it in Fluxnova with minimal friction.

Each blueprint embeds regulatory logic, from SLA-driven escalation paths to audit-ready execution, supporting institutions in meeting evolving compliance demands.

## The Role of AI (or Lack Thereof)

In an era where AI is often bolted onto every project, Fluxnova stands apart. We did use AI during development, but only to assist with breaking down complex processes into sequential activities. The core business logic and design decisions came from human expertise.

Fluxnova succeeds because it focuses on doing one thing exceptionally well: providing the right tools for describing and executing business processes in standard notation. AI will likely play a larger role in optimisation and predictive monitoring in future, but the foundation must be solid, standardised workflows.

## Looking Forward: Community and Ecosystem

The October launch is only the beginning. Fluxnova will continue to evolve with input from the community. Contributions are welcome from organisations and individuals alike, whether in the form of code, documentation, feature requests, or new blueprints.

For institutions, the benefits extend beyond adoption. By contributing back, firms strengthen a shared knowledge base, reduce duplicated effort, and help shape a platform that reflects industry needs. Enterprise-grade support options will also be available through trained partners for organisations requiring additional assurance.

Fluxnova is designed to fit into real deployment environments from day one. It runs as an embedded engine inside a Spring Boot microservice, and can be deployed on-premises, in containers, or in the cloud. It requires Java 21, integrates with existing analytics platforms, and includes both a BPMN/DMN Modeler and a monitoring Cockpit.

Fluxnova's flexible deployment model, whether on-premises or cloud-native, allows institutions to adopt orchestration without compromising control or compliance.

## Conclusion: From Launch to Impact

Fluxnova is more than a new open-source project. It represents a collective shift towards standardised, transparent, and collaborative process automation in financial services.

By pairing the platform with Scott Logic’s blueprint library, the two biggest barriers to adoption — tool complexity and the blank canvas problem — are addressed directly. Institutions can migrate from existing Camunda 7 environments or begin afresh, using blueprints that capture real regulatory and operational requirements.

This also supports institutions responding to both proactive and reactive data-driven initiatives, particularly in the face of evolving regulatory requirements.

The future of financial services lies in collaborative innovation: sharing knowledge, tools, and best practice across the industry. Fluxnova embodies this philosophy, and Scott Logic is proud to have helped shape its launch.

Ready to explore the possibilities? Visit the [FINOS website](https://www.finos.org/), explore the roadmap, and download the blueprint processes to get started.

[Robert Griffiths](https://blog.scottlogic.com/rgriffiths/)

---

## Appendix: Behind the Blueprints — SME Meets Engineering

The blueprint library developed by Scott Logic is more than illustrative: it’s executable. Each process was crafted with precision, drawing on deep subject matter expertise in financial services and rigorous engineering discipline. From KYC onboarding workflows with SLA-driven escalation paths to speculative risk calculations orchestrated across hybrid compute environments, the blueprints reflect real-world operational logic.

The development journey involved decomposing complex institutional workflows into modular, reusable components. Each blueprint includes a business definition, stepwise breakdown, visual BPMN model, and XML export compatible with BPMN engines. This ensures that institutions can adopt, adapt, and execute these processes with minimal friction.

## What’s Inside the Blueprint Library?

While the full collection will be available on the [FINOS website](https://www.finos.org/), here’s a glimpse of what’s included:

* **Pre-Trade Workflows**: KYC Onboarding
[![KYC onboarding  
<sub><em>Click to enlarge</em></sub>](/uploads/01.Pre-Trade.01.KYC.BusinessProcessDefinition.png){: style="max-width:90%; border-radius:8px; display:block; margin:1.5em auto; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.1);"}](/uploads/01.Pre-Trade.01.KYC.BusinessProcessDefinition.png){: target="_blank" title="Click to view full-size"}

* **Trade Execution**: Flash Risk Calculation.
[![Risk management  
<sub><em>Click to enlarge</em></sub>](/uploads/02.Trade.01.Risk.BusinessProcessDefinition.png){: style="max-width:90%; border-radius:8px; display:block; margin:1.5em auto; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.1);"}](/uploads/02.Trade.01.Risk.BusinessProcessDefinition.png){: target="_blank" title="Click to view full-size"}

* **Post-Trade Processes**: Trade setlement
[![Trade settlement  
<sub><em>Click to enlarge</em></sub>](/uploads/03.Post-Trade.01.Settlement.BusinessProcessDefinition.png){: style="max-width:90%; border-radius:8px; display:block; margin:1.5em auto; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.1);"}](/uploads/03.Post-Trade.01.Settlement.BusinessProcessDefinition.png){: target="_blank" title="Click to view full-size"}

* **A snippet from the BPMN file for the "Flash Risk" contains the following items:**
<pre style="background:#2d2d2d; color:#ccc; padding:1em; overflow-x:auto; border-radius:6px; font-family:monospace; line-height:1.5;">
<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_3"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Task_ProvideMarketData"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Gateway_ForkCompute"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_4a"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Gateway_ForkCompute"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Task_OnPremRiskJobs"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_4b"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Gateway_ForkCompute"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Task_ProvisionCloud"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_4c"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Task_ProvisionCloud"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Task_RunCloudRiskJobs"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_4d"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Task_RunCloudRiskJobs"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Task_TearDownCloud"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_4e"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Task_TearDownCloud"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Gateway_JoinCompute"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_4f"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Task_OnPremRiskJobs"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Gateway_JoinCompute"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_5"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Gateway_JoinCompute"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Task_AggregateResults"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_6"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Task_AggregateResults"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Task_ReviewResults"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_7"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Task_ReviewResults"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"Gateway_RiskDecision"</span> <span style="color:#569cd6;">/&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_8_accept"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Gateway_RiskDecision"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"EndEvent_Accept"</span>&gt;
  <span style="color:#569cd6;">&lt;bpmn:conditionExpression</span> <span style="color:#9cdcfe;">xsi:type</span>=<span style="color:#ce9178;">"bpmn:tFormalExpression"</span>&gt;${riskAcceptable}<span style="color:#569cd6;">&lt;/bpmn:conditionExpression&gt;</span>
<span style="color:#569cd6;">&lt;/bpmn:sequenceFlow&gt;</span>

<span style="color:#569cd6;">&lt;bpmn:sequenceFlow</span> 
<span style="color:#9cdcfe;">id</span>=<span style="color:#ce9178;">"Flow_8_reject"</span> 
<span style="color:#9cdcfe;">sourceRef</span>=<span style="color:#ce9178;">"Gateway_RiskDecision"</span> 
<span style="color:#9cdcfe;">targetRef</span>=<span style="color:#ce9178;">"EndEvent_Escalate"</span>&gt;
  <span style="color:#569cd6;">&lt;bpmn:conditionExpression</span> <span style="color:#9cdcfe;">xsi:type</span>=<span style="color:#ce9178;">"bpmn:tFormalExpression"</span>&gt;${riskAcceptable == false}<span style="color:#569cd6;">&lt;/bpmn:conditionExpression&gt;</span>
<span style="color:#569cd6;">&lt;/bpmn:sequenceFlow&gt;</span>
</pre>


Each blueprint is designed to be both illustrative and executable, enabling institutions to start with a robust foundation and tailor it to their specific needs.

## Engineering for Execution

The technical implementation of these blueprints was handled with care. Where platform readiness posed constraints, the team used Camunda Modeler to create initial diagrams and adapted the BPMN XML for Fluxnova compatibility. This not only accelerated delivery but also demonstrated practical migration paths for institutions with existing Camunda 7 processes.

The orchestration logic embedded in the blueprints includes boundary timers, escalation gateways, DMN decision tables, and parallel compute tasks, reflecting the operational realities of financial institutions. Whether it is a 48-hour SLA for document verification or a cloud-based risk calculation engine, the blueprints are engineered for execution.

Whether integrating with aging infrastructure or deploying in modern cloud-native environments, the blueprints are engineered to support incremental modernisation.

## From Stealth to Launch

Originally developed in stealth mode prior to launch, the blueprint library is now publicly available under FINOS governance. Institutions can explore the full collection, download templates, and contribute enhancements. Scott Logic continues to support the initiative, curating new blueprints based on community feedback and emerging use cases.