---
title: "Testers, testing and the future: A Bifurcation into Testing AI and AI-powered Testing."
date: 2025-11-20 00:00:00 Z
categories:
- Testing
- Artificial Intelligence
tags:
- Aritificial Intelligence
- Machine Learning
- AI
- Future
- Testing
summary: "The role of the Software Test Engineer is undergoing its most radical transformation since the advent of Agile. AI presents a fundamental bifurcation in the future of quality: Testing AI systems and Using AI to Test software. This post explores the evolution of testing from manual gatekeepers to modern, multi-skilled strategists."
author: dmcnamee
image: "/assets/ai-testing-header.png"
layout: default_post
---

<img src="{{ site.baseurl }}/dmcnamee/assets/ai-testing-header.png" width="100%" alt="AI image" title="Future of AI Testing">

## A Brief History of Testing
The rise of Artificial Intelligence is the biggest paradigm shift in software development since Agile—and it’s fundamentally rewriting the role of the Test Engineer.

Testing has evolved over the last two decades, though remnants of the past still linger—people too wedded to their beliefs to change, processes too ingrained to evolve, and ideas too novel to try. Despite these challenges, the field has progressed, and so have testers. No longer are they merely manual verifiers.

The traditional role of the software tester used to be as a gatekeeper, script writer, and manual executioner; a role often filled by accident and amalgamated into large teams of bug hunters, directed to perform repetitive, low-skill tasks. They were the sentries guarding a fixed fortress, checking every latch and bolt on the drawbridge. However, there were always mavericks—testers who went off the beaten path. These individuals eschewed standard processes, hunting on their own or in smaller packs. They were explorers and cartographers, taking an interest in the underlying mechanisms and domain, and could identify the path to follow without the rigid need for pre-drawn maps.

## The Evolution of the Quality Guardian
Today, the modern tester is a Quality Guardian and a strategic architect. They are multi-skilled, required to code, assess risk, analyse data, and communicate across many different boundaries. They must think critically, see the big picture, and possess domain knowledge. They have shed the armour of the sentry and now serve as the chief adviser on risk, performance, security, and accessibility. All the while, they are beholden to delivery expectations and time pressures, relentlessly seeking the very structural weaknesses that threaten the value of the software being produced at an ever-increasing velocity.

Testers have evolved, are still evolving, and will need to evolve further. The future of testing's evolution is bifurcated into two distinct, yet connected, paths: **Taming the AI Dragon** (validating AI systems) and **Wielding the AI Hammer** (AI-powered automation and tools). As professionals, we see this not as a threat to our craft, but as an unprecedented opportunity to trade the shovel for the telescope, moving beyond repetitive toil and focussing on high-value quality engineering.

## Path 1: Taming the AI Dragon (Testing AI-Based Systems)
When the system under test is an AI or Machine Learning (ML) model, the nature of testing fundamentally changes. We are no longer testing against a fixed scroll of business rules; we're testing a probabilistic, evolving, and often non-deterministic black box. The core challenge shifts from verifying known deterministic paths to exploring probabilistic outcomes—it's like trying to predict the path of a river, not just checking if a pipe is leaking.

<img src="{{ site.baseurl }}/dmcnamee/assets/path-finding.png" width="100%" alt="AI generated image of a person finding their way down a river" title="Path finding">

### The New Arsenal of the Tester
The Quality Guardian's skillset must deepen its analytical focus, moving from the logic and structure of imperative code to the statistics and ethics of data:

**The Data Alchemist:** Since the data is the "code" for an AI, testers must become experts in validating the training, validation, and test datasets. This requires advanced analytical skills to find the skew, the gaps, and the poisons hidden in the data well. Proficiency in tools for data visualisation and query languages is essential for maintaining data integrity.

**The Ethical Sentinel:** This highly analytical skill involves proactively designing tests to expose algorithmic bias—the tendency of the machine to treat different groups unfairly. This requires a strong framework for testing fairness, transparency, and accountability (FTA), using statistical methods to quantify the unfairness. They are the guardians of the AI's moral compass.

**The Predictive Oracle** (Deepened Risk Analysis): Because AI behaviour can be non-deterministic, testers must use their critical thinking to anticipate high-risk, real-world edge cases the model might fail to handle gracefully, focussing on the potential impact of a wrong decision.

### The Evolution of the Hunt
Testing AI will evolve into a continuous, data-centric process:

**Adversarial Encounters:** We will move beyond traditional positive/negative testing. Testers must become masters of the Adversarial Attack (slightly perturbing input data to force a model error) and Metamorphic Testing (checking if minor, non-output-affecting input changes produce the expected non-change in output). These are the new siege tactics against the machine.

**Demanding Explainability (XAI):** Testers will challenge the "black box" nature of models, demanding interpretability. We will use tools and techniques to understand why the dragon chose that particular path, especially for critical, life-impacting systems.

**Concept Drift Watchers:** Since ML models are like living organisms that degrade over time as real-world data changes, the testing process must extend into continuous monitoring, checking for Concept Drift (when the model's understanding of the world warps) and triggering model retraining or rollback.

## Path 2: Wielding the AI Hammer (Using AI to Test Software)
While traditional test automation focusses on scripting repetitive tasks, AI-powered tools bring additional capabilities to the craftsman's workbench:

**Self-Healing Mechanisms:** AI can automatically mend test scripts when a UI element shifts, like an apprentice mending the fence posts after a minor storm, significantly reducing the tedious maintenance overhead.

**Intelligent Scout:** The technology analyses application code and user behaviour to suggest or create new, more effective test cases, including edge cases.

**Predictive Cartography:** Past test results and code changes are analysed to predict where defects are most likely to occur, allowing the tester to prioritise their expedition to the high-risk zones.

**The AI Oracle:** Training on past application behaviour and requirements allows the machine to act as a Test Oracle, automatically judging whether an observed application state or output is correct or incorrect—a traditionally challenging manual task.

This automation will augment the human master craftsman, not replace them.

### The New Skills of the Craftsman
Human ingenuity will be needed to enhance strategy, interpretation, and complex testing:

**The Prompt Engineer:** Testers need to become masters of the AI interface. This requires Prompt Engineering—the skill of crafting precise, magical incantations to get reliable output from the Generative AI (GenAI) engine.

**AI-Augmented Toolsmithing (Vibe-Coding):** The days of waiting for a complex utility to be developed by another team are ending. Testers should be looking to use AI coding assistants to translate a high-level testing intention or "vibe" into functional code. This allows for the rapid creation of bespoke tools—such as log parsers, mock API servers, or specialised data generators—allowing the tester to forge their own tools on the spot.

**The Explorer's Return:** With AI handling the bulk of regression and repetitive checks, human testers are freed up to focus entirely on exploratory testing. This means leveraging our unique human traits: creativity, intuition, and deep critical thinking to find issues in the complex business logic and nuanced user experience that the automation can miss.

### The Evolution of the Workshop
AI integration will make testing faster, more resilient, and continuous:

**Autonomous Automation:** We are moving toward Hyper-Automation, where AI-powered frameworks generate, execute, and even self-heal test scripts. This will free up significant engineering time previously spent on test maintenance.

**Shift from Execution to Analysis:** The bottleneck shifts from the repetitive act of execution to the strategic act of analysis. The tester's role changes from simply running tests to becoming the Master Data Analyst who quickly sifts through vast amounts of AI-generated test data, prioritising actionable insights for the development team.

## Embrace the Change: The Integrated Future
The test engineer of the future is an analytical, ethical, and strategic thinker—an orchestrator of AI tools, focussed on uncovering the deep, complex, and high-impact failures that only human insight and prompt-powered agility can find.

The future of testing is smarter, faster, and hyper-focussed on value discovery through investigation. AI is not a competitor; it is the most powerful co-pilot we have ever had.

<img src="{{ site.baseurl }}/dmcnamee/assets/dragon-hammers.png" width="100%" alt="AI image of a tamed dragon and ai hammer" title="Dragon Hammer">

The future is a symbiotic one, built on the dual pillars of **Taming the AI Dragon** and **Wielding the AI Hammer**. The human tester's role is not replaced, but profoundly elevated; they evolve into strategists, critical thinkers, and ethical guardians in a landscape increasingly defined by machine intelligence.

The Test Engineer of tomorrow will not spend their day writing boilerplate automation scripts. They will spend it strategising, interpreting data, exploring high-risk areas, and guiding AI tools to deliver superior quality.

To thrive, organisations and testers must embrace this bifurcation, investing in the necessary skills and methodologies to harness the full potential of AI and secure the next generation of software quality.

Embrace the change. Start building your AI literacy and prompt engineering skills today, learn to think as the augmented engineer—the one who works with the technology to elevate testing from a cost centre to a strategic business advantage, enabling faster, more confident releases, superior risk management, and ensuring ethical and compliant AI deployments.
