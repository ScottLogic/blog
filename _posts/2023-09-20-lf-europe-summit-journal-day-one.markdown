---
title: LF Europe Summit Journal - Day One
date: 2023-09-20 05:41:00 Z
categories:
- Tech
summary: This year I’m attending the Linux Foundation Europe Summit, a sizable event
  bringing together 1,000s of people involved in open source. I typically take extensive
  notes of the sessions I attend, so thought I’d share them here on our blog.
author: ceberhardt
image: uploads/legal-ai-large.jpeg
---

This year I’m attending the Linux Foundation Europe Summit, a sizable event bringing together 1,000s of people involved in open source. I typically take extensive notes of the sessions I attend, so thought I’d share them here on our blog.

It’s only day one, but I’ve already attended some fascinating sessions including OSPOs, SBOM security, the legal implications of AI and blockchain.

If you’re interested in the details, then read on!

## Keynote

The keynote kicked off with Gabriele Columbro (General Manager, LF Europe) setting the scene. A notable feature of his keynote was the LF’s response to the [Cyber Resilience Act](https://digital-strategy.ec.europa.eu/en/library/cyber-resilience-act), a well-meaning yet technically-flawed piece of legislation that threatens some of the foundational principles on open source - our ability to provide code “as is”. The Linux Foundation is still [actively encouraging support from both individuals and businesses](https://linuxfoundation.eu/cyber-resilience-act).

![lf-fix-cra-large.jpeg](/uploads/lf-fix-cra-large.jpeg)

Another notable keynote session was presented by [Nithya Ruff](https://www.linkedin.com/in/nithyaruff/), who heads Amazon’s Open Source Programme Office (OSPO). She outlined various recent challenges in open source:

* A recent proliferation of what she describes as “openish” licences, typically including restrictions that don’t conform to the [widely understood open definition published by OSI](https://opensource.org/osd/).

* AI, where the combination of training datasets, model architectures and model weights have resulted in new challenges.

* Similar to cyber-resilience, we are seeing AI-related legislation on the horizon with the EU AI Act

While the core concepts of open source have changed little in the past 20 years, the changing world around us, both technical and social, mean that the open source world needs to continually evolve in order to protect that which it originally stood for.

## Understanding the Legal Context of AI

The first talk I attended was presented by [Van Lindenberg](https://www.linkedin.com/in/vanlindberg/), giving a legal perspective (albeit US focussed) on recent developments in Generative AI. This was a fantastic talk, which has a [long-form version online](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4464001).

![legal-ai-large.jpeg](/uploads/legal-ai-large.jpeg)

The talk kicked off with an explanation of AI training and inference using an analogy of an art inspector, which, if I’m honest, I simply didn't get! Van also expressed his opinion that because the outputs of these models are not made by humans they cannot be genuinely considered ‘creative’. I’m not sure I agree with that.

Introduction aside, once we got into the details of the legal challenges, the talk was absolutely brilliant.

We started with an overview of the Intellectual Property (IP) challenges, and the simple question of what part of the process are we applying the law to? the architecture? The model weights? the training process? Similar to the issues raised in Nithya’s talk, *nothing* relating to AI is simple!

Things got really interesting when discussing the training process. Almost every work on the internet holds some sort of copyright. Taking code as an example, I retain the copyright to all of the code I distribute, however through suitable licences (e.g. MIT) I grant (often permissive) rights for others to use my code, taking care to avoid any unintended obligations (i.e. distributed as-is).

However, there is a long-standing notion of fair-use, which allows people to legally undertake certain activities with copyright materials, such as summarisation (e.g. a book review), or statistical analysis (e.g. looking at the distribution of words). Given the way that the training of large language models works, this is legally considered fair use of copyright material.

What this also means is that I cannot simply prohibit people from training AI models on my code (or other works) by amending my licence. This isn’t a matter of copyright.

This was news to me!

However, where copyright does come into play is in the content that these models generate. If, for example, you ask Stable Diffusion to draw a picture of Iron Man, the generated content (which will no doubt be visually superb), will certainly infringe Marve’s’ copyright.

Van detailed various legal challenges that are underway, many of which are well publicised, but most of which aren’t going to stick.

This talk was a real eye-opener for me. I don’t think the existing legal framework is suitable for protecting the rights of people creating content (code, art, music). Unfortunately, given that the courts move much slower than technology (for example the fair-use case relating to Google Books was fought over 10 years), I struggle to see how these issues will be resolved.

Sadly Van ran out of time to talk about liabilities or trade secrets. In summary, if you get the chance to see Van speak at a conference, take it.

## Poisoned Pickles

Next up I attended a talk by [Adrian Gonzalez-Martin](https://www.linkedin.com/in/adrian-gonzalez-martin-95a81346/?originalSubdomain=uk). I have to say, I attended this talk simply because of the catchy title, well done Adrian, you reeled me in!

Pickles is the native serialisation format of Python, a language and ecosystem which I’m not familiar with. However it has a dark secret (actually I don’t think it is a secret, but that makes it sound more exciting), it allows arbitrary code execution, which means your serialised data, when deserialised, can do all sorts of nefarious things.

This might sound horrific, but isn’t all that unusual in open source where initial design decisions, made for the sake of simplicity, prove to be somewhat questionable when the software becomes popular. In this talk Adrian highlighted that ML model weights are often distributed and serialised via Pickles, meaning that this is a fun new attack vector for remote code execution.

For the rest of the talk Adrian outlined various mitigations, through having a more secure supply chain (signing etc …), however I feel this is a sticky plaster. We really should have the option to use a serialisation mechanism that doesn’t execute arbitrary code, furthermore, we should be doing this in a sandboxed environment.

However, the open source community tends to favours simplicity and expediency over security.

## Blockchain panel

Just to mix things up a little I thought I’d attend the one-and-only blockchain talk at the conference.

I tried my hardest to come to this session with an open mind, however, I was disappointed to see that panellists use the usual ‘hand waving’ arguments for using blockchain across a range of use cases where it really has no place. I heard that blockchain will help with GDPR, improve the sustainability of companies, create cross-border collaboration and more.

What amused me the most was when the host turned to a couple of the panellists and said “You have both been involved in real blockchain deployments”. Given that this technology has been around for such a long time, this struck me as mildly ridiculous. Can you imagine a kubernetes panel where the host has to ask such a question?

## Smarter Than Your Average SBOM!

And the best talk title of the day goes to [Matt Jarvis](https://www.linkedin.com/in/mattjarvis08?originalSubdomain=uk), of Snyk, and [Andrew Martin](https://www.linkedin.com/in/andr3wmartin/) of ControlPlane. Admittedly the reference was probably lost on most people, but I enjoyed it!

My main take-home thought from this talk was that SBOMs (Software Bill of Materials) are one piece of an incredibly challenging puzzle. This was neatly illustrated when Andrew presented a slide with a typical supply-chain and swiftly enumerated more attacks that I could possibly keep up with. He also made the point that SBOMs often need to evolve post build, and software is patched for vulnerabilities.

One really interesting thing I learnt about was the concept of a VEX file ([Vulnerability Exploitability eXchange](https://cyclonedx.org/capabilities/vex/)), which detail the CVEs present in a particular software release (and accompanying SBOM) and indicate how these have been addressed through patching, dead code path analysis, or other means.

If these become widely adopted, they will be incredibly useful. As an example, I just installed the ever-popular create-react-app, and after running npm audit, discovered that it has six critical vulnerabilities. Now I’m sure that a sufficiently skilled security professional would likely demonstrate that these vulnerabilities aren’t actually exploitable. If this could be attested via an accompanying VEX file, this would be a fantastic combination.

It feels like we have the building blocks to create a much more secure open source ecosystem. However, I’m concerned that we don’t yet have the right forces at play to truly roll this out at scale. This cannot be an additional burden on open source developers, circa CRA.

In short, a fascinating day of talks - I’m very much looking forward to day two.