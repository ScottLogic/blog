---
title: Communicating Architecture with Diagrams
date: 2025-11-17 00:00:00 Z
categories:
- Architecture
- Tech
author: sbreingan
summary: An overview of approaches on how we communicate architecture
---


# Communicating Architecture: From Whiteboards to Models

One of the most important responsibilities of a software architect is **communicating architecture effectively**. Whether you're sketching out a new system or explaining how existing components fit together, the goal is always the same: help others understand the structure, purpose, and implications of the architecture.

Architecture communication often needs to operate at multiple levels of abstraction. A CTO may want to understand strategic alignment, while an engineer might need to know how a service is deployed and monitored. The challenge is to tailor the message without losing coherence.

More often than not, this communication is **visual**. Diagrams are faster and clearer than text when conveying relationships between components, data flows, and infrastructure. But before drawing anything, we need to ask two fundamental questions:

- **What** do we want to show?
- **How** should we show it?

---

## Modelling vs Diagramming

Many of us have been in meetings gathered around a whiteboard, sketching out boxes and arrows to explore ideas. These ad-hoc diagrams are great for rapid ideation — they help teams align quickly and visually. But they rarely survive beyond the moment. As systems grow in complexity, we need more than just sketches. We need to understand **what** we’re showing, not just **how** we’re showing it.

This is where the distinction between **modelling** and **diagramming** becomes critical.

- **Modelling** is the process of defining the structure of a system: its actors, components, relationships, and abstractions. It creates a consistent representation of the architecture, independent of how it's visualised.
- **Diagramming** is the act of presenting that model — a visual slice tailored to a specific audience or concern.

A diagram is a **view** onto a model. It highlights certain elements while omitting others, depending on the story we want to tell.

In organisations with complex digital estates, this becomes essential. Consider a single system:
- What other systems does it interact with?
- What components make up that system?
- How do those components relate to the underlying infrastructure?

Trying to capture all of this in a single diagram is rarely helpful. Instead, we need **multiple views**, each shaped by a specific **viewpoint**.

Without an underpinning model, creating multiple diagrams can lead to confusion — inconsistent boundaries, conflicting relationships, and misaligned assumptions. A shared model ensures coherence across views.

### 🧠 Analogy: Architecture as House Plans

Think of the model like the structural blueprint of a house. From that blueprint, you can generate different plans:
- A **floor plan** for layout and navigation.
- An **electrical plan** for wiring and sockets.
- A **plumbing plan** for water and waste systems.

Each plan is a **view** onto the same underlying structure. If the walls, doors, and rooms aren’t aligned across these views, you end up with serious problems — wires running through non-existent walls, or pipes with nowhere to go.

Architecture works the same way. The model is your source of truth. Diagrams are tailored views that help different people understand and work with it.

---

## The Spectrum of Approaches

When deciding how to model and create views, there’s no one-size-fits-all solution. Instead, there’s a spectrum — ranging from highly structured, formal modelling approaches to informal, free-form sketches. Each approach has its place depending on the context, audience, and longevity of the diagram.

At one end of the spectrum, we have **heavyweight and structured approaches** such as UML and [ArchiMate These approaches enforce strict semantics and provide a rich modelling language. They are ideal for enterprise-scale architecture where consistency, traceability, and alignment with frameworks like TOGAF are essential. However, they come with trade-offs: they require significant effort to maintain, a steep learning curve, and may not be accessible to non-architects.

Moving toward the middle, we find **lightweight but structured approaches** such as C4 Model and Structurizr DSL. These techniques strike a balance by offering structure without the overhead of a full meta-model. They encourage consistency and clarity while remaining agile enough for modern development practices. AWS reference architecture diagrams also fall into this category, using standardised icons to maintain clarity.

Finally, at the far end of the spectrum, we have **lightweight and unstructured approaches** — whiteboards, Miro, Lucidchart, and diagrams.net. These tools are perfect for early ideation and collaborative workshops. They are fast, intuitive, and flexible, but they lack an underlying model and can quickly become inconsistent as systems evolve.

Choosing the right approach is always a trade-off between **consistency**, **flexibility**, and **complexity**. It depends on how long the diagram will live, who will maintain it, and how complex the system is.

![Tooling Spectrum]({{ site.baseurl }}/sbreingan/assets/diagram-spectrum.png)

## Tooling Landscape

Once you've decided how structured your approach needs to be, the next step is choosing the right tools. The tooling landscape is broad, and tools tend to fall into a few categories — each suited to different stages of the architecture lifecycle.

### ✍️ Diagrams as Code

Tools like PlantUML, Mermaid, and Structurizr DSL allow you to define diagrams using text. These are ideal for teams who treat architecture like code — enabling version control, CI/CD integration, and automated documentation.

They work particularly well when architecture needs to evolve alongside code. Diagrams can live in the same repository, be reviewed like any other code change, and even be generated automatically as part of a pipeline. The trade-off is that layout control can be limited, and the output may lack the polish of a hand-crafted diagram.

```plantuml

@startuml !include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_LEFT_RIGHT()

Person(user, “End User”, “Calls the public API”)

System_Boundary(sys, “Serverless API System”) { Container(apiGw, “API Gateway”, “Amazon API Gateway”, “Entry point for HTTPS clients; routing & auth”) Container(lambdaFn, “Lambda Function”, “AWS Lambda”, “Executes business logic for incoming requests”) ContainerDb(backend, “Backend Service”, “Database / Internal Service”, “Stores and retrieves application data”) }

Rel(user, apiGw, “Invokes API”, “HTTPS/JSON”) Rel(apiGw, lambdaFn, “Triggers”, “Lambda integration”) Rel(lambdaFn, backend, “Reads/Writes data”, “SDK / JDBC”)

@enduml

```

![C4 Diagram]({{ site.baseurl }}/sbreingan/assets/diagram-c4.png)

### 🏛️ Model-Driven Tools

Enterprise tools such as Archi, Sparx Enterprise Architect, and Visual Paradigm focus on maintaining a central model and generating views from it. This ensures consistency across diagrams and supports traceability — linking requirements to architecture and even to implementation.

These tools are powerful but require discipline and effort to keep up to date. They are best suited for large organisations with formal architecture governance or regulated environments where long-lived models are essential.

![Archi Mate]({{ site.baseurl }}/sbreingan/assets/diagram-archimate.png)

### ✍️ Visual Diagramming Tools

Tools like Lucidchart, [Miro](https://www.miro.com), [draw.io](https://www.drawio.com/) prioriste collaboration and being simple to use. They mimic the experience of sketching on a whiteboard but add features like templates, real-time collaboration, and cloud storage.

These tools are great for workshops and stakeholder engagement, but they lack an underlying model. As a result, they can become inconsistent and hard to maintain as systems grow.


### ☁️ Cloud-Specific Tools

Tools like [Cloudcraft](https://www.cloudcraft.co/), [Hava](https://www.hava.io/), [AWS Workload Discovery](https://aws.amazon.com/solutions/implementations/workload-discovery-on-aws/), and Azure Resource Visualizer integrate with live cloud environments to auto-generate diagrams. They can reflect the actual state of deployed systems, which is invaluable for audits, onboarding, and operational visibility.

These tools can even integrate with Infrastructure as Code (e.g., Terraform) to generate diagrams from real deployment scripts. However, they are less useful for future-state design and offer limited control over layout and emphasis.

![CloudCraft]({{ site.baseurl }}/sbreingan/assets/diagram-cloudcraft.png)


---

## Future Direction: AI-Generated Diagrams

As systems grow more complex and teams become more distributed, the need for fast, accurate, and adaptive architecture communication increases. AI-generated diagrams offer a promising future direction.

Imagine being able to ask:
> “Show me how the payment service interacts with identity.”

And instantly receive a diagram generated from your codebase, IaC templates, or telemetry data.

### Potential Applications
- **Code-to-diagram translation**: Automatically generate C4 or sequence diagrams from annotated code or Terraform scripts.
- **Live system introspection**: Use observability data to generate real-time architecture views.
- **Threat modelling automation**: AI interprets STRIDE or PASTA inputs and generates visual threat maps.
- **Natural language prompts**: Query architecture in plain English and receive diagrams tailored to your question.

### Benefits
- Reduces manual effort and diagram drift.
- Enables non-technical stakeholders to explore architecture visually.
- Supports continuous documentation in CI/CD pipelines.

### Challenges
- Ensuring accuracy and trust in generated views.
- Balancing automation with human intent and storytelling.
- Integrating with existing modelling tools and repositories.

### Tools to Watch
- GPT-based plugins for Structurizr or Mermaid.
- AI-enhanced IDEs that generate diagrams from code context.
- Cloud-native AI visualizers that interpret Terraform or CloudFormation.

---

## Choosing the Right Tool

There’s no single “best” tool — the right choice depends on:

- **Why** the diagram is being created:
  - Is it for a pitch deck or a long-lived artifact?
  - Does it need to meet regulatory or audit requirements?

- **Who** will maintain it:
  - Are they comfortable with code-based tools?
  - Is it part of a CI/CD workflow?

- **How complex** the architecture is:
  - Does it justify a formal model?
  - Will multiple views need to stay consistent over time?

Above all, ask: **Is this diagram useful?**  
