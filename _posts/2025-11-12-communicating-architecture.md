# Communicating Architecture: From Whiteboards to Models

One of the most important responsibilities of a software architect is communicating architecture effectively. Whether you're sketching out a new system or explaining how existing components fit together, the goal is always the same: help others understand the structure, purpose, and implications of the architecture.

But architecture isn’t just about boxes and lines. It’s about conveying ideas clearly to different audiences — from engineers and product managers to stakeholders and partners — each with their own concerns and levels of technical depth.

---

## Why Diagrams Matter (and Where to Start)

In most situations, a large wall of text it not an effective way of describing how microservices interact or how data flows through a system. Diagrams are often the fastest way to communicate relationships, dependencies, and abstractions. But before you start drawing, it’s worth asking two questions:

- **What** do I need to show?
- **How** should I show it?

This is where we can distinguish between *modelling* and *diagramming*.

---

## Modelling vs Diagramming

Often we can be gatehred around a whiteboard, creating many boxes, adding components, drawing lines between them all. These ad-hoc sketches are great for brainstorming, but they rarely survive beyond the meeting. To create diagrams that are useful over time, we need to think about the underlying *model*.

- **Modelling** is about defining the structure of what we want to present: actors, components, relationships, and abstractions.
- **Diagramming** is how we present that model — a visual slice tailored to a specific audience or concern.

A diagram is a *view* onto a model. As we want to communicate to many different people, one diagram is rarely going to be enough. Real systems are complex, and we need multiple views to tell the full story.

---

## Viewpoints: Tailoring Diagrams to Purpose

Each diagram should be shaped by a **viewpoint** — a lens that reflects the concerns of a particular audience or question. For example:

- A **system integration viewpoint** might show how services communicate across domains — ideal for business stakeholders.
- A **deployment viewpoint** might zoom into how a service is containerized and wired into infrastructure — helpful for engineers.

By choosing the right viewpoint, we ensure diagrams are purposeful, consistent, and meaningful.

---

## The Spectrum of Approaches

When it comes to modelling and diagramming, there’s no one-size-fits-all. Instead, there’s a spectrum:

### 1. Heavyweight & Structured
Tools like **UML** or **ArchiMate** offer formal modelling languages with strict semantics. These are great for enterprise-scale architecture, especially when aligning with frameworks like TOGAF. But they come with a cost: effort, discipline, and often a steep learning curve.

### 2. Lightweight & Structured
Approaches like Simon Brown’s **C4 Model** strike a balance — offering structure without the overhead. C4 defines four abstraction levels and encourages consistent, understandable diagrams. Similarly, cloud architecture diagrams (e.g. AWS reference diagrams) use standardised icons to maintain clarity.

### 3. Lightweight & Unstructured
At the other end are free-form sketches — whiteboards, Visio, diagrams.net. These are perfect for early ideation but can quickly become inconsistent and hard to maintain as systems evolve.

![Tooling Spectrum]({{ site.baseurl }}/sbreingan/assets/diagram-spectrum.png)


Choosing the right approach is a trade-off between **consistency**, **flexibility**, and **complexity**. It depends on how long the diagram will live, who will maintain it, and how complex the system is.

---

## Tooling Landscape

There’s no shortage of tools, and they tend to fall into a few categories:

- **Diagrams as Code**: Tools like **PlantUML**, **Mermaid**, and **Structurizr DSL** let you define diagrams in text. They’re version-controlled, CI/CD-friendly, and great for teams who treat architecture like code. The downside? Layout control and polish can be limited.

```
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_LEFT_RIGHT()

Person(user, "End User", "Calls the public API")

System_Boundary(sys, "Serverless API System") {
    Container(apiGw, "API Gateway", "Amazon API Gateway", "Entry point for HTTPS clients; routing & auth")
    Container(lambdaFn, "Lambda Function", "AWS Lambda", "Executes business logic for incoming requests")
    ContainerDb(backend, "Backend Service", "Database / Internal Service", "Stores and retrieves application data")
}

Rel(user, apiGw, "Invokes API", "HTTPS/JSON")
Rel(apiGw, lambdaFn, "Triggers", "Lambda integration")
Rel(lambdaFn, backend, "Reads/Writes data", "SDK / JDBC")

@enduml
```

![C4 Diagram]({{ site.baseurl }}/sbreingan/assets/diagram-c4.png)


- **Model-Driven Tools**: Enterprise tools like **Sparx**, **Archi**, and **Visual Paradigm** focus on maintaining a central model and generating views from it. These are powerful but require discipline and effort to keep up to date.


![Archi Mate]({{ site.baseurl }}/sbreingan/assets/diagram-archimate.png)

- **Visual Diagramming Tools**: Tools like **Lucidchart**, **Miro**, and **diagrams.net** are intuitive and collaborative. They’re great for workshops and quick sketches but lack model consistency and versioning.

- **Cloud-Specific Tools**: Tools like **Cloudcraft**, **Hava**, and vendor-native options like **AWS Workload Discovery** or **Azure Resource Visualizer** can auto-generate diagrams from live environments. These are brilliant for discovery and documentation — less so for future design.


![CloudCraft]({{ site.baseurl }}/sbreingan/assets/diagram-cloudcraft.png)


---

## Choosing the Right Tool (and Asking the Right Questions)

Ultimately, the tool you choose should reflect:

- **Why** you’re creating the diagram — is it for a pitch deck or a long-lived artifact?
- **Who** will maintain it — are they comfortable with code-based tools?
- **How complex** the architecture is — does it justify a formal model?

And most importantly: **Is this diagram useful?** If it doesn’t help the intended audience understand what they need to, it’s just decoration.
