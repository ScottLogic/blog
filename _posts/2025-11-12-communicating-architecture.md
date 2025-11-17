---
title: How Do We Effectively Communicate Architecture?
date: 2025-11-17 00:00:00 Z
categories:
- Architecture
- Tech
author: sbreingan
summary: In this blog post I provide an overview of approaches in communicating architecture and explore the variety of tools that can assist.
---

# How do we effectively communicate architecture?

One of the most important responsibilities of a software architect is communicating architecture effectively. Whether you're sketching out a new system or explaining how existing components fit together, the goal is always the same: help others understand the structure, purpose, and implications of the architecture.

Architecture communication often needs to operate at multiple levels of abstraction. A CTO may want to understand strategic alignment, while an engineer might need to know how a service is deployed and monitored. The challenge is tailoring the message without losing coherence.

More often than not, this communication is visual. Diagrams are faster and clearer than text when conveying relationships between components, data flows, and infrastructure. But before drawing anything, we need to ask two fundamental questions:

- **What** do we want to show?
- **How** should we show it?

## Modelling vs Diagramming

Many of us have been in meetings gathered around a whiteboard, sketching out boxes and arrows to explore ideas. These ad-hoc diagrams are great for rapid ideation — they help teams align quickly — but they are rarely useful outside that moment. As systems grow in complexity, sketches alone aren’t enough. We need to understand not just what we are drawing, but the underlying structure it represents.

This is where we distinguish between modelling and diagramming:

- **Modelling** defines the structure of a system: its actors, components, responsibilities, and relationships. It creates a consistent representation, independent of how it is visualised.
- **Diagramming** presents that model — a visual slice tailored to a specific audience or concern.

A diagram is a **view** onto a model. It highlights certain elements while omitting others, depending on the story we want to tell and who needs to understand it.

Consider an organisation with multiple interacting systems. Each system may have different users (internal and external), logical components, and supporting infrastructure. The relationships between these layers can become complex very quickly.

Trying to show all of this in a single diagram would be overwhelming. A CTO may care about high-level system interactions, while a security officer needs to understand low-level networking detail. Each stakeholder has different concerns — or **viewpoints** — and no single view can satisfy them all.

This is why we create multiple views, each shaped by a specific viewpoint and tailored to its audience. The model remains the single source of truth; the views simply expose different aspects of it.

A helpful analogy is the architectural plans of a house. A single structural model can be used to generate:
- a **floor plan** for layout and navigation,
- an **electrical plan** for wiring and sockets,
- a **plumbing plan** for water and waste systems.

Each plan is a view of the same underlying structure, shaped by a particular discipline. If an architect moves a wall but doesn’t update the electrical or plumbing plans, the result would be chaos!

Software architecture works the same way. The model holds the truth about the system; diagrams are purposeful views that help different people understand and work with it.

## The Spectrum of Approaches

When deciding how to model and create views, there’s no one-size-fits-all solution. Instead, there’s a spectrum — ranging from highly structured, formal modelling approaches to informal, free-form sketches. Each approach has its place depending on the context, audience, and longevity of the diagram.

At one end of the spectrum, we have *heavyweight and structured* approaches such as [UML](https://www.omg.org/uml/) and [ArchiMate](https://www.opengroup.org/archimate-forum/archimate-overview). These approaches enforce strict semantics and provide a rich modelling language. They are often used in enterprise-scale architecture where consistency, traceability, and alignment with frameworks like TOGAF are required. The trade-off is that they require significant effort to maintain, have steep learning curves, and may not be accessible to non-architects.

In the middle, we find *lightweight but structured* approaches such as the [C4 Model](https://c4model.com/), which emphasise having a consistent model, but much more flexibilty and less rigous. This encourages an underlying model, but without the same level of prescriptiveness. This encourages consistency and clarity while remaining flexible enough that generating views does not become burdensome. 

Cloud diagrams that use AWS or Azure icon sets also sit broadly in this category. They offer a standardised visual vocabulary that improves clarity and consistency, but they stop short of providing a true modelling approach.

At the far end of the spectrum, we have *lightweight and unstructured* approaches - free-form diagrams created on whiteboards or tools such as  Miro, Lucidchart, and diagrams.net. These tools are perfect for generating quick and flexibile diagrams. They are fast, intuitive, and flexible, but they lack an underlying model and can quickly become inconsistent as systems evolve.

Choosing the right approach is always a trade-off between consistency, flexibility, and complexity. It depends on how long the diagram will live, who will maintain it, and how complex the system is.

## Tooling Landscape

Once you've decided how structured your approach needs to be, the next step is choosing the right tools. 

The following diagram shows how different tools fit into the spectrum of different approaches.

![Tooling Spectrum]({{ site.baseurl }}/sbreingan/assets/diagram-spectrum.png)

These tools tend to fit into a few key categories.

### Diagrams as Code

Tools like PlantUML, Mermaid, and Structurizr DSL allow you to define diagrams using text. These are ideal for teams who treat architecture like code — enabling version control, CI/CD integration, and automated documentation.

They work particularly well when architecture needs to evolve alongside code. Diagrams can live in the same repository, be reviewed like any other code change, and even be generated automatically as part of a pipeline. The trade-off is that layout control can be limited, and the output may lack the polish of a hand-crafted diagram.


~~~ plantuml

@startuml !include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_LEFT_RIGHT()

Person(user, “End User”, “Calls the public API”)

System_Boundary(sys, “Serverless API System”) { 
  Container(apiGw, “API Gateway”, “Amazon API Gateway”, “Entry point for HTTPS clients; routing & auth”)
  Container(lambdaFn, “Lambda Function”, “AWS Lambda”, “Executes business logic for incoming requests”)
  ContainerDb(backend, “Backend Service”, “Database / Internal Service”, “Stores and retrieves application data”) 
}

Rel(user, apiGw, “Invokes API”, “HTTPS/JSON”) Rel(apiGw, lambdaFn, “Triggers”, “Lambda integration”)
Rel(lambdaFn, backend, “Reads/Writes data”, “SDK / JDBC”)

@enduml
~~~

![C4 Diagram]({{ site.baseurl }}/sbreingan/assets/diagram-c4.png "A generated C4 Diagram from PlantUML")

### Model-Driven Tools

Enterprise tools such as Archi, Sparx Enterprise Architect, and Visual Paradigm focus on maintaining a central model and generating views from it. This ensures consistency across diagrams and supports traceability — linking requirements to architecture and even to implementation.

These tools are powerful but require discipline and effort to keep up to date. They are best suited for large organisations with formal architecture governance or regulated environments where long-lived models are essential.

![Archi Mate]({{ site.baseurl }}/sbreingan/assets/diagram-archimate.png)

### Visual Diagramming Tools

Tools like [Lucidchart](https://www.lucidchart.com/), [Miro](https://www.miro.com), [draw.io](https://www.drawio.com/) prioriste collaboration and being simple to use. They mimic the experience of sketching on a whiteboard but add features like templates, real-time collaboration, and cloud storage.

These tools are great for workshops and stakeholder engagement, but they lack an underlying model. As a result, they can become inconsistent and hard to maintain as systems grow.

![CloudCraft]({{ site.baseurl }}/sbreingan/assets/diagram-drawio.png)

### Cloud-Specific Tools

Tools like [Cloudcraft](https://www.cloudcraft.co/), [Hava](https://www.hava.io/), [AWS Workload Discovery](https://aws.amazon.com/solutions/implementations/workload-discovery-on-aws/), and Azure Resource Visualizer integrate with live cloud environments to auto-generate diagrams. They can reflect the actual state of deployed systems, which is invaluable for audits, onboarding, and operational visibility.

These tools can even integrate with Infrastructure as Code (e.g., Terraform) to generate diagrams from real deployment scripts. However, they are less useful for future-state design and offer limited control over layout and emphasis.

![CloudCraft]({{ site.baseurl }}/sbreingan/assets/diagram-cloudcraft.png)

## What about AI-assisted diagrams?

Automated diagramming tools already exist — cloud-native consoles can generate infrastructure maps and database tools can produce entity-relationship diagrams. These are useful, but they reflect the *raw state* of a system rather than a *modelled* view. They rarely show intent, abstraction, or logical grouping, and because they generate everything at once they are difficult to tailor for different audiences or architectural viewpoints.

Because diagrams can be defined as code, we can use LLM's to help generate them in formats such as Mermaid or PlantUML from natural-language descriptions. This accelerates early drafts, but it has a core limitation: diagrams are spatial and visual, while LLMs only predict text. They cannot reliably assess whether the final layout will be readable, balanced, or meaningful.

To address that gap, AI features are emerging inside visual diagramming tools themselves — for example [Miro](https://miro.com/ai/diagram-ai/), [Lucidchart](https://www.lucidchart.com/pages/use-cases/diagram-with-AI), and dedicated tools like [Eraser](https://www.eraser.io/). These combine language input with layout engines, constraint solving, and interactive prompts, producing more coherent visuals while still keeping the human in control of the modelling.

LLMs also have potential to support the modelling process more directly. By connecting to codebases or live infrastructure, they can answer natural-language questions (“Which services call this API?”), help infer relationships, and assist in keeping architectural models aligned with the real system.

AI-assisted diagramming is most effective as augmentation rather than automation. By combining automated insights with natural-language interaction, these tools have the potential to reduce the effort of creating and maintaining diagrams — while architects still provide the intent, abstraction, and viewpoint needed for effective communication.

## Choosing the Right Tool

There’s no single “best” approach to architecture diagrams. The right tool depends on **why** the diagram is being created, **who** is going to maintain it and for how long, and **how complex** the system being communciated is. 

What matters far more than the tool itself is clarity of intent. Effective architectural communication starts understanding what needs to be modelled, what the viewpoints need to be captured and how diagrams will be used to tell a clear and purposeful story. 
