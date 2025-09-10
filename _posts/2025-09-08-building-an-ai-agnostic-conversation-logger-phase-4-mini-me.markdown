---
title: 'Building An AI-Agnostic Conversation Logger - Phase 4: Mini-Me'
date: 2025-09-08 15:08:00 Z
categories:
- Artificial Intelligence
- AI
tags:
- Artificial Intelligence
- AI
summary: This episode charts my attempt to build Mini-Me, a CLI sidekick that was
  supposed to learn my quirks and write like me, but instead turned into a shadowy
  pastiche of my style. AI tools can generate features at light speed, yet without
  unwavering product ownership discipline, scope creep turns your elegant vision into
  feature bloat. The experience crystallised into a practical checklist for AI project
  governance - because just as every orchestra needs a score, every cinematic universe
  needs a storyline, otherwise what should be a legendary saga of epic proportion
  becomes just a messy saga of its own making, worthy of nothing more than a post-credit
  scene.
author: rgriffiths
---

#How Scope Creep Reminded Me of the Value of Product Ownership

Every saga needs a bridge: a messy, transitional chapter that connects what came before with what comes next. In the MCU, Phase 4 followed the grand conclusion of the Infinity Saga. It was sprawling, uneven, and experimental, yet it laid the groundwork for what came next.

In my own AI journey, Phase 4 was embodied by Mini-Me, my first attempt at building an AI-agnostic conversation logger as the natural evolution of [Phase 3](https://blog.scottlogic.com/2025/07/23/extracting-data-from-ai-models-a-tale-of-three-approaches.html). It was meant to capture and structure conversations across multiple agents, and even begin to learn my quirks and style. Ambitious? Certainly. Useful? At times. Built to last? About as much as a Tony Stark prototype: flashy, clever, but destined to explode in testing!

Mini-Me became a shadowy pastiche of my intentions, undone by scope creep and feature bloat. Yet from its ashes came the sharpest lesson so far: when working with AI copilots, strong product ownership and governance are not optional extras. They are the only things keeping your elegant vision from collapsing under its own weight.


## Setting the Scene

Before Mini-Me, my work had focused on using multiple AIs for analysis and visualisation. Phase 1 was about building a React SPA to interact with different models. Phase 2 explored how developer tools like Cursor IDE could help restructure and scale those experiments. Phase 3 compared ways to extract structured data from AI outputs. Together these efforts revealed a gap: if I wanted to manage long-running conversations, compare different agents, and start building personalisation into the workflow, I would need something more persistent and structured than a UI or ad hoc script.

What I also wanted, though, went beyond logging. I wanted a tool that could start to learn about me - not just the questions I asked, but the way I wrote, the tone I used, and the quirks of my style. The vision was that, over time, it would tailor its responses so that they increasingly sounded like something I might have written myself. That was the leap from “structured assistant” to “Mini-Me.”

## Enter Mini-Me

Mini-Me was my first serious attempt at building a personal AI CLI assistant.

The goals were simple:

- Capture prompts and responses in JSON logs  
- Maintain threaded conversations  
- Generate embeddings with FAISS for semantic search  
- Orchestrate multiple AI backends (OpenAI, Anthropic, Ollama, GPT4All)  
- Provide failover logic and some early personalisation  

For a while, it even worked. I could start a conversation, switch between backends, and recall earlier threads.

## The Product Owner’s Dilemma

Working alongside AI companions is intoxicating. They offer enticing shortcuts and seductive features that always feel just one tweak away. It is a little like walking the Jedi path, with the dark side of scope creep always beckoning from the shadows. Quicker, easier, more seductive. It creates the illusion of power by delivering more features more quickly. Yet those features are not always required, wanted, or even useful. Giving in feels good in the moment, but the result is a murkier product that is harder to control.

As the product owner of Mini-Me, my hardest job was not the coding. It was keeping the project, and myself, on message.

## Why Mini-Me Fell Short

Mini-Me became more powerful, seemingly, but also unstable. To really push my MCU analogies, it was my Ultron: ambitious, sometimes impressive, but ultimately not the foundation I wanted to build on.

The technical weaknesses became clear:

- **Monolithic architecture**: new features bolted on wherever they fitted, creating tangles.
- **Agent sprawl**: each backend wired in separately, each loading its own config.yaml. Model overrides, error handling, and response parsing were duplicated instead of abstracted behind a common interface. 
- **Personalisation coupling**: early tailoring logic ended up hard-coded in the core.
- **Failover chains**: clever in theory, unwieldy in practice.
- **Search**: useful, but not modular.

The deeper problem was governance. I allowed scope to expand too quickly. I let myself be seduced by shiny ideas. Mini-Me's collapse wasn't just technical debt: it was a masterclass in how AI acceleration can amplify poor product decisions.

## What I Learned

The experience sharpened my perspective as both architect and product owner:

1. **Modularity matters**  
   Clear boundaries between agents, services, data, and utilities prevent spirals of complexity.

2. **Config should be central**  
   Scattering preferences and API keys across the codebase is a recipe for drift. Central .env files and persona definitions (personas.yaml) keep governance visible.

3. **Governance is the true accelerant**  
   AI can accelerate delivery enormously, but that speed is double-edged. Without firm product management, you accelerate off the road just as quickly as you accelerate towards value.

4. **Logs and metadata are gold**  
   Capturing not just responses but context, agents, personas, and modes creates transparency. It is the governance trail that prevents you from losing your way.

Mini-Me did not just teach me how to structure an AI CLI. It reminded me that even when working with AI copilots, product ownership still matters more than ever. Looking back, Mini-Me's failures taught me that every AI project needs a governance framework. Here's the checklist I wish I'd had from the start:

### My Own "Product Owner’s Checklist" for my AI Projects

[ ] Keep scope under control. New features are tempting, but discipline matters more than speed.  
[ ] Build for modularity. Agents, services, and data should be loosely coupled.  
[ ] Centralise config and personas. Make preferences explicit and governable.  
[ ] Capture logs and metadata. Every response, context, and decision should be traceable.  
[ ] Treat AI like a co-pilot, not the driver. Governance and direction must come from you.  
[ ] Remember: faster is not always better. What feels like momentum can just as easily be misdirection.  

## The Dawn of JARVIS

Mini-Me’s shortcomings gave rise to JARVIS: a clean-slate successor, designed with governance in mind. 

Where Mini-Me was sprawling, JARVIS embraces modularity by design. The cli/ directory handles command-line parsing and user interaction, while agents/ contains clean interfaces for each backend - no more duplicated config loading or tangled response parsing. Services/ orchestrates the heavy lifting: logging conversations, building search indices, managing personas, and coordinating between components. Utils/ keeps configuration, environment handling, and shared utilities in one place, while data/ provides a clean home for threads and embeddings.

JARVIS is:

- Persona-aware (coder, pre-sales, blogger)  
- Agent-agnostic (OpenAI, Claude, with more to come)  
- Session-continuing (auto-follows your last conversation)  
- Governance-friendly: logs everything with metadata, making decisions transparent  

If Mini-Me was Ultron, JARVIS is Vision: reborn, leaner, more maintainable, and crucially, better aligned with its product owner’s vision.

And yes, that makes me the product *Visionary*.

##Key Takeaway: A Succinct Product Owner's Checklist for working with AI Agents on Projects

Treat your AI like a teammate, not a boss: keep it on track, log everything, and stay in charge.

[] **Control scope.** Resist the lure of every AI-suggested feature.
[] **Think modular.** Keep agents, code, and data loosely coupled.
[] **Centralise settings.** Keep configs, preferences, and personas in one place.
[] **Log everything.** Preserve prompts, responses, and metadata for transparency.
[] **Lead, don't follow.** Treat AI as a co-pilot, not the driver.
[] **Value quality over speed.** Fast output can feel powerful but can be misaligned without oversight.

## Coming Next: Phase 5 - JARVIS Takes Shape

If Phase 4 was my Ultron moment, Phase 5 is where Vision steps onto the stage. JARVIS represents a clean break from the chaos of Mini-Me, rebuilt with modularity, governance, and sustainability at its core. In this phase I will show how I stitched together agent switching, persona management, critique and consensus modes, and auto-following conversations into something coherent. The focus is not just on building features, but on sequencing them with discipline so that JARVIS grows steadily into the reliable companion I first imagined.
