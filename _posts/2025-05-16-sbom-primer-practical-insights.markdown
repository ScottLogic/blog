---
title: An SBOM primer with some practical insights
date: 2025-05-16 11:21:00 Z
categories:
- Tech
tags:
- SBOM
- Software Bill of Materials
- cloud
- DORA
- operational resilience
- open source
summary: We’ve been generating Software Bills of Materials (SBOMs) on client projects
  for several years now, and we’d like to share insights into the positive impact
  they’ve had on security, resilience and engineering quality, along with some considerations
  to bear in mind when working with SBOMs for the first time.
author: jheward
contributors: sbreingan
image: "/uploads/SBOM%20thumbnail.png"
---

Software Bills of Materials (SBOMs) are playing an increasingly important role in software security and operational resilience. Indeed, they are becoming an essential tool in Financial Services with the advent of the Digital Operational Resilience Act (DORA) and UK Operational Resilience regulations, both of which oblige organisations to track and manage their software supply chains.

What an SBOM is **not** is a magic wand that will somehow make vulnerabilities and security threats disappear. Quite the opposite. By bringing risks to light, SBOMs require you to make more decisions, and potentially more investments, to mitigate them.

We’ve been generating SBOMs on client projects for several years now, and we’d like to share insights into the positive impact they’ve had on security, resilience and engineering quality, along with some considerations to bear in mind when working with SBOMs for the first time.

Let’s start at the beginning – with how SBOMs came into being and the problem they are designed to solve.

## The problem SBOMs tackle

Over the last couple of decades, the rise of modular software architectures has greatly increased the business agility of organisations, but it has also increased their attack surfaces. The composition of modern business applications now typically includes many open source libraries and third-party dependencies, presenting significant security challenges – as has been demonstrated in recent years through examples such as the [Log4j vulnerability](https://en.wikipedia.org/wiki/Log4Shell), the [Apache Struts vulnerability](https://en.wikipedia.org/wiki/Apache_Struts) and the [xz Utils Backdoor attack](https://en.wikipedia.org/wiki/XZ_Utils_backdoor). (Our CTO, Colin Eberhardt, flagged the critical nature of these dependencies several years ago in [this post on open source sustainability](https://blog.scottlogic.com/2021/12/20/open-source-sustainability.html).)

The first vendor products for managing these dependencies emerged in the early noughties. They included Black Duck, which scanned open source packages for vulnerabilities, but without exporting a bill of materials. In the ensuing years, common standards for SBOMs have emerged, such as [CycloneDX](https://cyclonedx.org/) and [SPDX](https://spdx.dev/), providing schemas for listing dependencies in a simple, structured format.

The primary use cases for SBOMs are security and licensing. They provide detailed lists of all components, libraries, and dependencies that make up a software application, which can then be analysed for security and licence compliance.

## How SBOMs are generated

Many software development platforms now offer the capability to generate SBOMs automatically using build tools integrated into the Continuous Integration/Continuous Deployment (CI/CD) pipeline. Taking the example of our work with the Scottish Government to build [ScotPayments](https://www.scottlogic.com/our-work/scottish-government-full-service-programme-delivery) and [ScotAccount](https://www.scottlogic.com/our-work/scottish-government-delivering-scotaccount), we used GitLab to generate SBOMs to the CycloneDX standard. It was an important part of how we ensured compliance with [Secure by Design](https://www.security.gov.uk/policy-and-guidance/secure-by-design/) framework activities such as '[Documenting service assets](https://www.security.gov.uk/policy-and-guidance/secure-by-design/activities/documenting-service-assets/)'.

With each deployment, GitLab would generate a versioned SBOM and scan it against vulnerability databases (such as those provided by [CVE](https://www.cve.org/) and [VulDB](https://vuldb.com/)), while also checking the licences of dependencies in the supply chain. By automating compliance in this way, we could fail builds if they contained too many vulnerabilities or if dependencies did not meet the licensing criteria we had set.

The versioning of SBOMs is an important feature. For each build of those Scottish Government applications, the SBOM provided an auditable snapshot of the software. This enabled forensic analysis of any build issues and provided the means to create an exact reproduction of a build, if needed.

## How SBOMs help strengthen security and resilience

Integrating SBOMs into the CI/CD pipeline allows organisations to identify and tackle security issues proactively. It also encourages engineering teams to “shift left” and address security considerations early in the software development lifecycle (SDLC) and throughout all its stages.

This shifting left is vital because threat actors are increasingly attacking software at earlier stages in the SDLC. By targeting dependencies in the supply chain, such as open source libraries, threat actors can inject vulnerabilities that compromise not only the application being built, but the build process. At the Scottish Government, we held regular triage meetings to review the results of SBOM scans and prioritise remediation efforts. This continuous process kept security front of mind in the team’s design and build decisions, helping us improve the quality of our software and manage vulnerabilities effectively.

SBOMs are having the same effect on the wider development community, given the way they focus attention on the interdependency of the supply chain. It’s possible to sign all the artefacts listed within a given SBOM. When a dependency is loaded, the signature can be checked to confirm that it has not been altered, ensuring the integrity of the software supply chain. We’re seeing in the developer community a push for signing artefacts as part of a larger trend towards improving software development practices across the industry, encouraging all participants to maintain high standards of security and integrity. In the context of regulations like DORA and UK Operational Resilience, it’s conceivable that the signing of artefacts could become mandatory.

For large enterprises, including the financial institutions that fall within the scope of the DORA and UK Operational Resilience regulations, SBOMs will be a crucial tool in providing visibility across the IT estate. Given the highly complex and interconnected nature of these estates, every system and application will need its own SBOM, feeding into a centralised inventory or database. This is the only way to provide the comprehensive visibility that oversight bodies require to see the overall risk profile and dependency landscape. It’s this aggregated data that will underpin decision-making to drive operational resilience and ensure regulatory compliance.

## Practical advice based on our experience

What follows is not intended to dissuade you from implementing and using SBOMs at your organisation – they’re a critical tool, as we’ve explained. It’s rather to share the benefit of our experience in deploying them so that you can fast-track some of the lessons.

Let’s start with implementation. This can be a fiddly process and requires careful setup to ensure that all of the dependencies are scanned correctly. It is important to continually validate that scans have been successful, checking pipelines and logs to ensure the list of dependencies is complete. You might otherwise labour under a false sense of security that you have comprehensive coverage when, in fact, there’s a hidden vulnerability.

That’s a technical consideration, but the main challenges presented by SBOMs are actually organisational. Each SBOM generates a large amount of data, and when combined with the totality of SBOM data across an IT estate, this can be overwhelming. It’s important to establish effective processes and governance to manage and interpret this data, ensuring that critical issues are not missed amidst the noise.

Development velocity is an important metric for any organisation, and tackling risks identified using SBOMs will necessarily have an impact on velocity. Over time, the benefits of “shifting left” should help to address more and more risks before they arise, but there will be an ongoing need to balance velocity with risk management.

There are inevitably cost considerations as well. The initial implementation of SBOMs can be relatively inexpensive. However, the ongoing maintenance of SBOMs and analysis of the data they produce can be time-consuming and costly. Given the mandatory nature of operational resilience regulations in sectors such as financial services, these are unavoidable costs; however, it’s important to be aware of them. At the end of the day, it costs a lot more to pay a fine for a major incident or outage – not just financially, but also in terms of reputational damage.

That’s the key takeaway we’ll leave you with. SBOMs are a powerful and increasingly crucial tool to help protect your organisation, your clients and your customers. While simple in their own right, SBOMs introduce some complex considerations and organisational challenges that you will need to tackle. However, the benefits of integrating SBOMs into your software development lifecycle far outweigh those challenges by improving your software, strengthening your security, and increasing your resilience.