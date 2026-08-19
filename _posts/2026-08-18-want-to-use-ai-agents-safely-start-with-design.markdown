---
title: Want to use AI agents safely? Start with design
date: 2026-08-18 13:12:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
- AI
- design
- end-to-end process
- service design
- quality
- security
- auditability
- observability
- operational resilience
- guardrails
- risk management
- featured
summary: Concerns about control are one of the biggest barriers to adopting agentic
  AI, particularly in regulated environments. In this post, we discuss how organisations
  can harness AI safely by designing processes around the strengths of both humans
  and machines, then applying the right controls, guardrails and monitoring.
author: ceberhardt
contributors: ascotland
image: 
---

Time and again, the biggest concern we hear from clients about agentic AI is a loss of control.

This is by no means irrational. AI is non-deterministic, meaning that the same input does not always result in the same output. In addition, AI agents are increasingly being granted full autonomy in making decisions and taking actions, where this non-determinism can have a significant impact. Organisations are right to ask how they can maintain control, accountability and trust.

The risks and concerns that need to be addressed are wide-ranging, including:

* **Quality** – will AI agents deliver correct results? Will they be unbiased?


* **Security** – will the agents be susceptible to deliberate attack or accidental failures?


* **Auditability** – how can you demonstrate that your system is behaving as it's expected to behave?


* **Operational Resilience** – how do you manage the reality that the behaviour of AI systems will change over time?

However, the good news is that organisations have decades of know-how and experience in managing risk in complex systems and dealing with non-deterministic agents: humans. While agentic AI introduces new challenges, it doesn’t overturn decades of thinking about process design, controls and governance.

In this blog, we’ll explain the fundamental importance of design when it comes to introducing AI into your systems and processes. We’ll show how making the right decisions at the design stage ensures that you introduce guardrails that are enablers rather than constraints. And we'll explain how the design decisions you make will determine the right approach to observability and monitoring, and how those controls can evolve as the system matures. But first, let’s begin with a mistake many organisations make.

## Don’t start with guardrails…

At Scott Logic, we have more than two decades of experience in working with organisations in highly regulated environments. It’s therefore unsurprising that the starting point for many such organisations is to ask, “What controls do we need?” The problem with this mindset is that it can constrain the art of the possible. When it comes to leveraging AI, the overzealous application of guardrails can squeeze out any value that might have been gained.

Instead, in our experience, the best Chief Information Security Officers (CISOs) always start by asking “What are we trying to achieve?” and want to understand the end-to-end process. They then ask what controls are required and how their effectiveness will be evidenced.

To leverage AI safely, you should take the same design-first approach: it will help you choose the right technology for the task, determine the appropriate level of autonomy, and decide where human oversight and accountability should remain.

## …start with design

In asserting the importance of the design stage, we’re not advocating big, upfront waterfall design. We’re simply recommending that you should spend time at the start to address some fundamental questions and concerns. You should think carefully about the end-to-end process in which the AI agents will operate. Agentic AI creates an opportunity not simply to automate existing ways of working, but to redesign them. The aim should be to identify where humans and AI each create the most value, then design the process around those strengths.

When it comes to the system itself, the same fundamental questions about objectives, risk, control and accountability still need to be answered. As with any project, you need a clear business objective to serve as the North Star that guides your decisions. Much also remains the same in terms of system design. All the design patterns that have evolved over the years to create secure systems still apply, e.g., Identity Management, Principle of Least Privilege, etc.; they just need to be adapted for a system leveraging non-deterministic AI agents.

In the same way, other design considerations depend on familiar, broad principles, as follows.

### Autonomy should be proportionate to risk

An early question to answer up-front is what level of risk is involved in the outcome of the end-to-end process that’s being designed. That’s because the higher the risk, the less you should rely on non-deterministic decision-making.

For example, let’s consider mortgages. If you were designing a system to explain mortgage-related concepts in plain English to first-time buyers, the level of risk would be low, and therefore the use of Generative AI (GenAI) would be a sound choice. However, if you were designing a system that would task an AI model with making mortgage-lending decisions autonomously, the use of GenAI would be a poor choice with potentially life-changing and business-damaging consequences.

### Accountability remains human

This is a natural extension of the autonomy question. AI cannot be held accountable in law; only organisations and people can. So, the higher the level of risk involved in the outcome, the more human oversight and decision-making is required. Guardrails and observability have no bearing on this; just because you can provide evidence of AI decision-making and behaviour, that still won’t make it accountable.

### Use the right tool for the job

Organisations have been using AI for decades, but it was hard work. Lots of time and effort went into ensuring that the AI delivered the desired results. What’s changed is how easy it now is to use AI, and the confidence with which it asserts that it’s provided the right answer. The ease disguises the underlying complexity and the chance of error.

As a result, organisations feel encouraged to apply GenAI to the wrong use cases. There are many different kinds of AI, and this should be remembered at the design stage. For example, algorithmic trading already uses AI, but it is intrinsically different from GenAI. If algorithmic trading harnessed GenAI, the results would likely be disastrous.

### Design the end-to-end process

It’s only by mapping out the end-to-end process that you can make the right decisions about how you will maintain control and ensure that the system operates safely. It's also worth challenging the assumption that existing controls, approvals and handoffs should remain unchanged. Many business processes were designed around the limitations of human decision-making and human effort. It’s by identifying where AI will create value and where humans need to stay in the loop that you will be able to design the right guardrails and observability mechanisms.

## Guardrails enable safe autonomy

Guardrails encompass a range of mechanisms applied to a system to define acceptable behaviour, reduce risk and keep operations within agreed boundaries. They may take the form of technical controls, procedural checks, or other measures appropriate to the level of autonomy and risk involved. Their ultimate purpose is to maximise the value a system can create while keeping it safe and controllable.

Deterministic systems have always been designed with deterministic guardrails, using black-and-white rules and controls. What’s changed in the era of non-deterministic AI is that guardrails need to be more adaptable and qualitative in nature, favouring positive non-determinism and reining in negative non-determinism.

Guardrails can go a long way in exercising control over AI. However, it’s important to say that the more you use non-deterministic systems, the more you have to accept that the probability of failure is higher than with a deterministic system. This must be weighed against the value that you’re gaining by harnessing the non-deterministic AI, and also against the probability of failure with previous, human-centred processes.

Due to the higher probability of failure, the role played by observability is more important than before.

## Observability helps you understand what’s happening

Observability is the capability of inspecting, understanding and monitoring a live system. Whereas traditional system logging is passive, observability is active.

AI models and systems ‘drift’, which means that their behaviour can alter over time due to numerous factors. Among other reasons, there might be changes in the data consumed by the model, or the behaviour of its users, or the prompts and instructions it receives. If you’re using a third-party, API-based model, the provider may update it or replace it. Meanwhile, you need to keep a close eye on the cost of running the system and protect it against attack; as systems become more dynamic, so too do the risks and vulnerabilities they face.

This makes it critically important to monitor, understand and manage the behaviour of the evolving system throughout its lifecycle. For this, you need a mechanism to evaluate the quality of the system’s outputs. This could include a test suite that helps you continuously monitor behaviours, outputs and outcomes, so that you can refine the model’s instructions. As the system evolves over time, so will the test suite.

In all contexts, but especially in highly regulated environments, observability allows you to demonstrate that your system is behaving as it was intended to do. That means thinking carefully at the design stage about what needs to be observed. Key decision and control points should be identified in advance, including the choices an agent will be instructed to make, the permissions it will exercise, the tools it might invoke, and the level of autonomy under which it will operate.

Those control points are not limited to actions and decisions. Organisations may also need visibility of the identity and authority of both human and AI participants within a process. It's not enough to know that a particular action took place. Organisations may also need to know which agent performed it, which model or version it was using, whether it was acting autonomously or on behalf of a human user, and what authority it had been granted. This provenance will become increasingly important as agentic systems take on greater autonomy. It’s what will help organisations establish accountability, audit decisions, and detect misuse.

## It all comes back to design

We’ve been brought up in a society where computers are integral to our everyday lives and always assumed to be right. To get the most out of GenAI and large language models, we need to accept and accommodate the idea that they will sometimes give us incorrect answers. If we try to constrain AI so that it's always correct, we will lose most of the value that this technology can deliver. Again, this means that organisations will need to understand that it’s not always the right tool for the job.

Working out where it *is* the right tool for the job is not easy, especially if you simply try to integrate it into existing processes. As we said earlier, the much better approach is to take a step back and consider how you might reimagine the end-to-end process. At Scott Logic, we have worked with clients like [Yuki](https://www.scottlogic.com/our-work/yuki-making-migration-viable-with-ai) and [Scopevisio](https://www.scottlogic.com/our-work/scopevisio-ai-accelerated-delivery) to reimagine software engineering in this way with extraordinary results, resulting in a fundamentally different process design. There’s the potential to achieve similar gains by reimagining other business processes, optimising them for a combination of AI and human agents. It’s a design challenge – which Scott Logic can assist you with – and it’s where the real opportunity lies.