---
title: Making our contribution to FDC3 2.0
date: 2023-06-16 16:57:00 Z
categories:
- Open Source
tags:
- FDC3
- open source
- desktop containers
summary: I'm excited to share that we are imminently reaching our next milestone as we release our set of test suites against FDC3 2.0. In this post,  I explain what the FDC3 Conformance Framework is and how it works, and share our experiences from our contribution journey.
author: acaulfield
---

At Scott Logic, we’re proud to be contributing to the FINOS mission to help the finance industry “Do Open Source Properly”. I am excited to share with you that we are imminently reaching our next milestone as we release our set of test suites against FDC3 2.0. 

The FDC3 Conformance Framework works to ensure that desktop containers are compatible with the [FDC3 standard](https://fdc3.finos.org/) – giving reassurance and accreditation that their apps will work with every Desktop Agent.

As Interop.io describe it:

> “The foundation of FDC3 is the desktop agent API (Application Programming Interface), which is a single interface that any application developer can write to (whether it’s an in-house built app or a vendor application) in order to add interoperability to their application. Think about the FDC3 API as an agreement between existing platforms and applications.”

It can be annoying for users to find that features they rely on in their apps don't work when changing between Desktop Agents. These conformance tests will add security around that. FINOS has created badges to indicate conformance with the FDC3 standard. 

By passing the conformance tests and joining the conformance program, firms are able to use those badges in their own marketing materials.

## Our contribution journey
Throughout this journey, we have collaborated closely with organisations such as FINOS and Interop.io, as well as having conversations with Connectifi, Sail and OpenFin.

Engaging with FINOS and Interop.io has been instrumental in the progress of the FDC3 project. Through Slack and Zoom, we engaged regularly with a Senior Architect from FINOS, providing project updates, discussing ongoing work, and determining the next steps. This structured approach ensured that our efforts remained aligned and progress was maintained.

During the final stages of development, we introduced key stakeholders from Interop.io. By collaborating closely with them, we were able to ensure the smooth progression of the project and align our efforts effectively.

Although Connectifi, Sail and OpenFin were part of the project, their 2.0 products were not yet at the same stage during the development phase. However, we maintained ongoing conversations over Slack, which allowed us to exchange information, address queries, and maintain awareness of their progress.

To address the evolving challenges during the final weeks of development, we increased our engagement by having daily calls. These sessions were dedicated to pair programming which enabled us to work closely together, address issues in real time, and maintain project momentum.

Collaborating on an open source project with multiple parties across different time zones comes with intrinsic challenges, and so the key to our success was frequent and transparent communication.

## How FDC3 conformance works
There are multiple versions of the FDC3 standard. A Desktop Agent could host apps written in any one of these versions. For that reason, it's important that Desktop Agents are tested to make sure that they keep on supporting apps written against older versions of FDC3.
 
There are two main parts to conformance:

* Running the tests locally, then 
* Joining the Conformance Program

You can either run the hosted conformance tests listed in the FINOS App Directory, or run them on your local machine (useful if you are making changes). You can [find instructions here](https://github.com/finos/FDC3-conformance-framework).

If you have a Desktop Agent supporting the [AppD v2 standard](https://fdc3.finos.org/docs/app-directory/spec), you can point it at the [FINOS App Directory](https://directory.fdc3.finos.org/) which contains not only the current conformance suite but also many other sample FDC3 applications. The endpoint for your agent is: [https://directory.fdc3.finos.org/v2/apps](https://directory.fdc3.finos.org/v2/apps). Or you can install it locally – [find instructions here](https://github.com/finos/FDC3-conformance-framework).

If you've had a clean run of all the tests locally, why not join the Conformance Program? You can [find instructions on how to join here](https://github.com/finos/FDC3-conformance-framework/blob/main/instructions.md).

Once you have followed these steps, you will be allowed to display the FDC3 Compliance Badges within your marketing literature.

Details are published of conformant desktop agents on the [FDC3 Community page](https://fdc3.finos.org/community).

And you can read the latest blog post here about the [certification announcements at OSFF New York](https://www.finos.org/blog/first-fdc3-1.2-certified-desktop-agents).