---
title: Why you should rethink legacy and consider Event-Driven Architecture
date: 2025-08-06 10:07:00 Z
categories:
- Tech
tags:
- legacy modernisation
- legacy technology
- event-driven architecture
- EDA
- co-existence strategies
- hybrid architectures
- Change Data Capture tools
summary: In this post, I describe how your business can assess whether a system is
  ready for modernisation and, if so, how to set your project up for success. I then
  explain why, in most cases, you’ll probably want to take an incremental approach
  rather than replacing the old system in one fell swoop. I end by providing an example
  of one of the ways your business can do this – by using Event-Driven Architecture.
author: jmoore
image: "/uploads/James-Moore-blog-w-quote.png"
---

We should redefine what we mean by legacy technology. Legacy isn’t just about age. Fundamentally, it’s about whether a system is slowing your business down or reducing your responsiveness. Modernisation should not be automatic. Instead, it should be a strategic decision based on clear business value.

In this post, I’ll describe how your business can assess whether a system is ready for modernisation and, if so, how to set your project up for success. I’ll then explain why, in most cases, you’ll probably want to take an incremental approach rather than replacing the old system in one fell swoop. I’ll end by providing an example of one of the ways your business can do this – by using Event-Driven Architecture.

## Do you really need to modernise your legacy system?

If the rationale for modernisation is simply to move to a new tech stack, that’s the wrong reason. Let’s say your business has an old system that does one particular job; if it’s still performing its function reliably and doesn’t hinder business operations or customer experience, there may be no need to replace it (yet).

Even if a system is written in an outdated language on an old platform, that alone isn’t a reason to replace it. If the system only fails occasionally and can be fixed at a known cost (e.g. by hiring a specialist once a year to run maintenance on it), that may be far cheaper than investing in a full rewrite of the code.

As my colleague Oliver Cronk recommends in this post, [legacy modernisation should be an ongoing strategic capability](https://blog.scottlogic.com/2025/07/22/legacy-systems-beyond-the-modernisation-hype.html) rather than a one-off project. Taking this approach, you can assess a given legacy system at regular intervals—say, every six or twelve months—to see whether it’s starting to become a hindrance. Until the result of that assessment is in the affirmative, you can leave the system alone.

When you’re considering whether your business needs to modernise a legacy system, the fundamental question you need to ask yourself is, “What value will the modernisation bring to our organisation?” If the answer to that question includes benefits like improving productivity or scalability, or the ability to add new features and integrate with modern systems, then you probably *should* modernise.

At which point, it’s important to set things up for success.

## Getting modernisation right

You need to start from first principles to give your legacy modernisation initiative the best chance of success. Otherwise, there’s the temptation to start solutionising, which, more often than not, will result in a like-for-like replacement of a system, with a negligible return on investment.

Start instead by asking yourself what your business goal is, and what business problems you are trying to solve. This will prompt you to bring together the right stakeholders from across the organisation as early as possible, ensuring that everyone from each relevant part of the business understands the goal and can collaborate on the modernisation strategy.

Calling on deep domain expertise at this early stage is key to de-risking the project and setting it up for success. It also affords the opportunity to streamline and improve business processes. If you simply replicate outdated workflows in new systems, the result could be just a legacy system on a new tech stack.

It’s also important at this stage to clarify ownership, by which I mean system-level ownership. This involves determining which system controls particular functions and datasets. You want to ensure a clean separation between old and new systems to avoid ‘split-brain’ scenarios, where both systems try to act on the same data or logic. Clarifying ownership in this way will help inform the approach you take to modernisation.

## Making modernisation feasible

There *may* be circumstances which require the ‘Big Bang’ approach of a complete system rewrite. For example, the legacy system may not be very complex, and there may be no viable path for incremental change. However, it’s important to say that this approach still tends to be high-risk and expensive.

Ultimately, legacy modernisation is an ongoing journey, not a destination. Capex budgets will never stretch to overhauling a complete legacy estate (even if that were the best strategy, which is very unlikely). So, in most cases, a co-existence strategy is the best approach to take – this means allowing the legacy system to continue operating while new functionality is built alongside it, with the strategic aim to retire the legacy system at the appropriate time.

A co-existence strategy has numerous benefits. It enables gradual migration, it reduces risk by avoiding disruption to stable systems, and it allows teams to focus on delivering new value rather than replicating old systems. Crucially, it makes modernisation affordable, breaking the work up into increments that can be prioritised and delivered over time.

There are various technical approaches you can select from to implement a co-existence strategy. My colleague Duncan Austin discussed one of them in his [blog post on desktop interoperability](https://blog.scottlogic.com/2025/06/12/a-proven-approach-to-legacy-modernisation-that-delivers-early-value.html). As mentioned earlier, I’m going to focus on another of them—Event-Driven Architecture—to illustrate how this strategy allows you to modernise legacy in a relatively low-risk, affordable way.

## Legacy modernisation using Event-Driven Architecture

Event-Driven Architecture (EDA) offers a pragmatic and minimally invasive path to legacy system modernisation. Instead of viewing the system as a monolithic whole, EDA encourages breaking it down into functional slices—each tied to a distinct business capability, such as invoicing, customer onboarding, or payment processing.

In practice, this means that modern services subscribe to events emitted by the legacy system, such as "OrderPlaced" or "InvoiceGenerated". These services respond asynchronously and independently, without requiring tight coupling or direct modification of the legacy code. This decoupling enables teams to introduce new functionality incrementally, without destabilising the existing system. In this blog post, my colleague [David Hope delves into this in more technical detail](https://blog.scottlogic.com/2024/04/22/message_types.html).

### A practical example: Sending a welcome email

A simple but powerful example of EDA in action is adding a welcome email feature to an existing user registration system.

Suppose this hypothetical legacy system already handles user signups: when a user submits the signup form, the legacy backend processes the request and stores the user in its database. However, it doesn’t currently send a welcome email, and updating the legacy system directly to introduce this new feature is risky or impractical.

Instead, we can introduce a Change Data Capture (CDC) tool to observe the legacy database for changes. CDC tools monitor database activity and can detect when a new row (such as a new user record) has been inserted. Once a new user is detected, the CDC tool emits a UserSignedUp event to an event queue (such as Kafka, RabbitMQ, or ActiveMQ). A modern Welcome Email Service, developed independently, subscribes to that event and sends the email when it arrives.

This approach allows new behaviour to be introduced without altering the legacy system at all. You’ve extended the system’s capabilities through events—safely, modularly, and incrementally—and laid the foundation for ongoing modernisation efforts.

The welcome email example is something anyone can understand, but Event-Driven Architecture supports a wide range of use cases, from audit logging and real-time analytics to fraud detection and microservice orchestration.

![Event-Driven-Architecture-diagram-01.png](/uploads/Event-Driven-Architecture-diagram-01.png)

### Benefits of Event-Driven Architecture

A key strength of EDA is that it’s asynchronous and fully decoupled from the legacy system. In the example above, the legacy system is unaware that a welcome email is being sent at all. If that functionality had been implemented directly within the legacy system, it would likely be embedded in a sequential, tightly coupled workflow, potentially introducing performance bottlenecks or failure points.

With EDA, in contrast, a single event can trigger one or many downstream processes—from sending emails to updating dashboards or initiating onboarding flows—without any changes to, or load on, the legacy system.

This level of decoupling enables:

* **Scalability**, since new features can be added without touching the legacy system.

* **Performance**, through parallel and asynchronous processing.

* **Resilience**, because failures in downstream services don't impact the core transaction.

In short, EDA allows you to build new capabilities around your legacy system, rather than within it, offering a clean, modular, and future-friendly path to modernisation.

Another often-overlooked advantage of EDA is the improvement it brings to testing and observability. Legacy systems are frequently fragile, complex, and poorly documented, which makes introducing new logic directly into them risky and difficult to validate. Tracing issues can be painful, and debugging often involves navigating tangled, monolithic workflows.

By contrast, when you build modern, decoupled services around the legacy system, you gain the ability to test new functionality in isolation, using familiar modern tooling and development practices. You can write focused unit tests, integration tests with mock event payloads, and even replay events in staging environments before going live.

Additionally, because these services are external and loosely coupled, you can integrate them right from the start with modern observability stacks, including structured logging, distributed tracing, and metrics collection. This makes it much easier to monitor behaviour, detect issues early, and gain confidence in production systems.

In short, EDA doesn’t just help with scaling and speed. It improves the day-to-day developer experience, accelerates delivery, and reduces operational risk.

### A widely applicable, cost-effective strategy

Of course, EDA isn’t suitable for every scenario. Some business processes are too complex, [stateful](https://en.wikipedia.org/wiki/State_(computer_science)), or tightly coupled to be easily broken down into discrete, event-driven steps. In these cases, trying to retrofit an event model can lead to more complexity rather than less.

Additionally, not all legacy databases support event emission out of the box. Older systems may require custom Change Data Capture solutions or manual polling strategies, which can add engineering overhead and introduce latency or reliability concerns. For a deeper discussion of where EDA works, and where it doesn’t, [check out this episode of Beyond the Hype](https://blog.scottlogic.com/2025/06/10/beyond-the-hype-event-driven-architecture-the-only-data-integration-approach-you-need.html), Scott Logic’s podcast.

However, in a great many cases, Event-Driven Architecture offers a lightweight, low-risk, and cost-effective approach to legacy modernisation. By enabling incremental change—often following [patterns like the Strangler Fig](https://en.wikipedia.org/wiki/Strangler_fig_pattern)—EDA allows teams to build out new functionality around the edges of existing systems, gradually reducing reliance on the legacy core.

It’s a pragmatic strategy that balances the need for innovation with the realities of working with ageing systems, delivering real value without needing to rewrite everything from scratch.

To return to the original point: legacy IT isn’t simply about age – it’s about impact. A system becomes legacy not just because it’s old, but because it starts to slow down your business processes or limit your ability to adapt.

When that happens, Event-Driven Architecture offers a powerful way to regain momentum – enabling you to evolve your systems, accelerate change, and deliver new capabilities, all without a risky full-scale rewrite.