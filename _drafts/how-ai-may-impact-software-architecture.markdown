---
title: How AI may impact software architecture
date: 2023-06-06 14:17:00 Z
categories:
- Artificial Intelligence
- AI
- Software Architecture
- Solutions Architect
- Technical Architect
tags:
- Tech
summary: AI tools are being trialled in many areas including software development,
  with huge potential to transform ways of working. What might the impact of AI be
  on software architecture? In this post, I make some predictions and argue that software
  architecture may become more data-driven, with prototype architectures and architectural
  diagrams being generated from the actual code itself.
author: acarr
---

AI tools are being trialled in many areas including software development, with examples such as [GitHub Copilot](https://resources.github.com/copilot-for-business), [CodePal](https://codepal.ai/), [SourceAI](https://sourceai.dev/) and [Tabnine](https://www.tabnine.com/). In this post, I will look at the impact of these tools on coding and use that to predict how they will impact the design of software architecture.

![MicrosoftTeams-image (6).png](/uploads/MicrosoftTeams-image%20(6).png)
_AI-generated image_
 
Predictions around this are very hard to make, especially taking into account how fast this field is changing, so it will be interesting to revisit this blog in a couple of years to see how things are. But taking those caveats into account, I am going to argue that software architecture may change to being more data-driven, with prototype architectures and architectural diagrams being generated from the actual code itself.

## How AI is already speeding up coding
Looking at coding, we can see four clear examples of how coding can be sped up using AI tools that are available now.

![MicrosoftTeams-image (10).png](/uploads/MicrosoftTeams-image%20(10).png)

 
The first is advanced code completion. This is where the AI can complete code quickly and with increasing ease, doing a lot more than the previous generation which statistically predicted the completion of the code. This is especially the case with common tasks that it has seen before, putting the old code completion systems on steroids.

The second is code generation from plain text descriptions. Rapid UI prototyping tools such as [Galileo AI](https://www.usegalileo.ai/) can be used to generate UI screens based on plain text descriptions of what they need to do. [CodePal](https://codepal.ai/) and [GitHub Copilot](https://resources.github.com/copilot-for-business) can generate code in many different languages based on a plain text description. Developers are in the process of finding out how capable and useful these tools can be, but many are already predicting that they will turbocharge software development once the tools mature.

The third is finding and fixing bugs. These tools could be used to help experienced software engineers to find bugs (such as security loopholes or mistakes in logic), as discussed in this [TechRadar article](https://www.techradar.com/news/new-github-code-scanning-tech-should-make-it-easier-to-spot-security-flaws), or could even be used as an interactive way for people to learn how to code.

The fourth is reading code and summarising it using natural language. This could help with code maintenance. As well as aiding early-career developers, these tools could be akin to a personal interactive teacher in helping people learn to code from scratch; although this is easier with simple examples, the tools are highly likely to improve over time.

![MicrosoftTeams-image (8).png](/uploads/MicrosoftTeams-image%20(8).png)
 

Code generation is improving all the time, as Martin Heller discusses in this [Infoworld article](https://www.infoworld.com/article/3696970/llms-and-the-rise-of-the-ai-code-generators.html). While early code generators weren’t generating code that was correct, or even compiled, they are now starting to be able to generate code that can compile, along with Unit Tests that can work. However, just like ChatGPT, the tools can confidently give an answer even when they’re wrong. 

So, we have seen that coding can be turbocharged in producing, reading and maintaining code, and helping developers get up to speed on languages quickly. But what can these new capabilities do to help with the design of software architecture?

## How software architecture is designed today
It could be argued that those who are great at designing software architecture today use a bit of science and a bit of creativity. Ultimately, the architect’s role is to simplify what is going on, or what will go on, at the software level, and to abstract it to the point where decisions can be made about it. The challenge for many is to document the rest of the architecture that the system or component has to work within to understand how the components and systems interact. This is often done by talking to individuals and examining code, but is subject to a certain amount of approximation, guesswork and simplification. Ultimately, it is an error-prone process where experienced heads are often required to help navigate and make good decisions.

But imagine if software architecture was designed and reviewed with more information; if runnable prototypes of the backends could be built with button clicks in seconds to try out architectures; if the logs of the architecture could be reviewed and performance issues spotted, with remedies recommended ([as mentioned by the BCS](https://www.bcs.org/articles-opinion-and-research/will-ai-replace-software-engineers/)). It is also noted within that BCS post that there’s the potential to apply “AI to the design stage to provide a higher level of direct input when considering the pros and cons of architectural options.” In the rest of this blog post, I wish to consider the viability of this and its potential impact on how software architecture is designed.

## So, how is AI likely to impact how software architecture decisions are made?
Clickable mockups have improved and accelerated UI design by speeding up the iterative process of presenting a mockup, getting feedback on it and modifying it – all now fast enough to do within days. It tends not to be possible to do such short iterations to test architecture because changes normally require significant work in the backend.

This means that most software architecture design is an art as much as a science, as experienced heads make their best guestimate based on what they do know or can know easily. An AI agent which reviews the actual code, log files etc. could provide a huge amount of extra information and even test different performance or load scenarios.

## What about if AI were applied to the integration of backend components?
Earlier non-AI platforms that are designed to support the rapid connecting of systems, such as Mulesoft Anypoint, can reduce the amount of boilerplate code; that said, it still typically takes weeks to produce components which connect to multiple systems. This generation of tools was never fast enough to turn integration into point-and-click real-time.

Newer integration platforms such as [Cyclr](https://cyclr.com/) and [Boomi](https://boomi.com/) are going down the low-code, point-and-click route to reduce integration time further. In fact, Boomi has introduced an AI component which uses anonymised learnings from lots of previous integrations achieved with the Boomi platform to automagically create mappings between two integration points, often the most time-consuming part of an integration.

![MicrosoftTeams-image (9).png](/uploads/MicrosoftTeams-image%20(9).png)
 

So, assuming AI-supported development will continue to get easier, more accurate and more common, what are the implications for software architecture? I will argue that there will be four potentially large changes to how software architecture is designed.

## 1) Trade-offs can be tested instead of theorised
With the current AI code-generation systems, we have seen that code can be generated very quickly which very much looks the part, even if it isn’t entirely accurate all of the time. As long as the code compiles, potentially this is good enough for prototype integration. Allowing systems to be connected super-quickly, if not perfectly, enables tests to be run that connect the systems in different ways and therefore test different architectures. 

This good-enough code generation for backend/architecture prototyping could allow architects not just to guess what the best architecture for a new system or component in a current system might be, but actually to generate alternative architectures and test out trade-offs. This process is not currently done at the prototyping stage, but instead during the dry design of the system or, if you are lucky, during sprints in order to iron out the creases in architecturally significant stories. It will enable trade-offs on speed, latency and throughput, providing guarantees that are usually made without hard data.

At present, these tests may be limited by the availability of test versions of all the systems that a new system or component would have to work within (often an organisational challenge, rather than a technical one). However, it is possible to imagine AI technologies mocking up test versions of those missing systems or components.

![MicrosoftTeams-image (5).png](/uploads/MicrosoftTeams-image%20(5).png)
_AI-generated image_

## 2) Designing software architecture will be more data-driven, likely by system prototyping
If these trade-offs can be tested, the tasks of Software Architects and Solution Architects could morph into those of a System Prototyper. Instead of having to argue for a certain architecture, they could try stuff out, record tests and gather real-world evidence for the design decisions and then document them for the developers.

While existing software architecture expertise and experience will be super-valuable in this new role, more classic Developer-type skills will also be required in order to get these system prototypes working and try stuff out. Only time will tell whether this will mean that Software Architects will do system prototyping, or whether Developers will take on this role and push them into a space where they are making architecture decisions. Either way, AI will likely help make decisions around architecture more data-driven compared to current practice.

## 3) It will enable more complex architectures with more nuanced trade-offs
Being able to prototype and compare different architectures quickly will allow more nuanced decisions to be made – whether approach A or approach B should be used, or whether a database should be Eventual Consistency or Fully Consistent. Databases and messaging middleware have tended to become more configurable around guarantees over the last decade or so, allowing the designer to choose trade-offs with more certainty as they can try the trade-offs out. If Software Architects can quickly try out the implication of their trade-offs instead of just guessing them, it means that the more nuanced decisions can be made with confidence and these highly configurable middleware components can be utilised more fully.

Open source components such as [Open Messaging benchmarking tools](https://openmessaging.cloud/docs/benchmarks/) for comparing middleware are starting to appear (currently Apache RocketMQ, Kafka, Pulsar, RabbitMQ, NATS streaming, REDIS and Pravega).

In theory, this should help the architecture and system to be more sustainable going forward – because decisions around trade-offs can include chargeability, storage, data moving etc, which can all impact the environment. It is perfectly conceivable that AI tools will be generated that could create a score for architectural simplicity and maintainability, making the process of decision-making around trade-offs more a matter of reviewing data than they are currently.

## 4) AI tools will be able to provide more information on software architecture, generating useful diagrams from code or vice versa 
As mentioned previously, it is commonly a very manual process for an Architect to gain an understanding of the components and architecture within which a system or component has to work. A huge step-up would be a tool that could look at the code, systems and APIs, and generate knowledge of a current system which could then easily be interrogated by a Software Architect – transforming part of the architectural design process that is currently very manual, time-consuming and error-prone.

As things stand, architecture diagrams tend to be hand-crafted, produced by experienced Architects who add value by deciding what to display and what to compare in order to aid communication of the architecture and any proposed changes. This process is incredibly manual. While there has been an evolution in terms of having diagrams driven by code to describe the diagrams, they still have no real connection to the code itself. (There have also been waves of tools to generate diagrams from actual code, and vice versa, but they tended to have limited use due to two key issues: (1) diagrams generated from code tend to be too complex to be useful – they tend to need to be simplified to show architecturally significant details only; and (2) a similar issue applies to code generated from diagrams – it is too simplistic to run without being enhanced. These two issues mean that once the code is generated from the diagram or vice versa, the two tend to drift apart so that the code evolves without the diagram being updated and vice versa).

AI could completely change this by learning what is useful from the code and from existing pools of architecture diagrams, and then trawling the code of other systems, to produce diagrams showing the current interconnectivity of systems and an understanding of the current architecture. This could include showing whether systems are tightly coupled instead of loosely coupled, or whether microservices are too granular resulting in a system that’s a spaghetti set of calls between microservices to carry out simple tasks.

## So, what might the impact be?
Tools like Copilot are likely to change Developers’ ways of working rapidly and significantly. In the same way, if AI can enable super-fast, semi-working, quick-and-dirty backend integrations of components and systems, the software architecture design could evolve swiftly – from a role that is about diagrams and summarising into a role which is more about coding prototypes to try stuff out. The implications of this will come out in time, but I suspect it will enable us to make more nuanced architectural trade-offs, and make more comprehensive use of the highly configurable middleware, databases, and messaging platforms that have grown up over the last decade. 

It could also have an impact on who makes architectural decisions if suddenly Developers have tools allowing them to try out architectural decisions themselves. One of my colleagues compared making architectural decisions with controlling the chaos. With the potential for Developers to make more of the architectural decisions themselves, time will tell whether that chaos will be reined in more or less, and whether that will be a good thing or bad. (Excel is a great example of this, where it's such a powerful tool that it’s often ended up becoming a way for business people to develop business systems outside of the controls within the IT department. Many businesses have benefited hugely from this, but many in the IT organisations would argue this uncontrolled ability to create or enhance systems has come at a high price – for instance, [see this Society of Actuaries article](https://www.soa.org/news-and-publications/newsletters/compact/2012/october/com-2012-iss45/excel-as-an-it-system/)).

I’ll finish with a couple of questions I’d love to know the answer to, given my interest in personality theories and attributes: if AI tools enable software architecture to become more like prototyping, with AI support to integrate quickly, will it change the nature of the Software Architect role enough to draw in people with different personality characteristics that haven’t been so enticed into architecture previously? And how will that impact the profession and software development overall? 

Watch this space; I certainly will.