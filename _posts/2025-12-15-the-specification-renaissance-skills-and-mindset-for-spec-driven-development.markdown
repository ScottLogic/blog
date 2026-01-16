---
title: The Specification Renaissance? Skills and Mindset for Spec-Driven Development
date: 2025-12-15 17:30:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
- architecture
- documentation
- Prompt Engineering
- Engineering
summary: 'The rise of AI coding assistants has exposed an uncomfortable truth: many
  people struggle to articulate what they actually want to build. We''ve spent decades
  optimising for implementation speed whilst specification atrophied into an afterthought.
  Now AI can handle much of the implementation, and suddenly the bottleneck has shifted
  upstream. So what do we need to rethink and relearn as part of adopting a spec-driven
  approach?'
author: ocronk
---

The rise of AI coding assistants has exposed an uncomfortable truth: many people struggle to articulate what they actually want to build. Machines struggle to understand the messy realities of brownfield projects and changes to software. We've spent decades optimising for implementation speed whilst specification skills have atrophied. Now AI can handle much of the implementation, and suddenly the bottleneck has shifted upstream. My colleague [Colin recently wrote about his practical experiences with spec-driven development](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html) so do check that out alongside this article, although note we don’t always agree on everything! (This is one of beauties of the Scott Logic blog – we sometimes publish differing positions as long as they are well researched and articulated).

## **Problem Articulation**

Before you can specify anything, you need to understand what problem you're solving. This means asking "why" repeatedly until you've stripped away assumed solutions and reached the actual user need. Developers often leap to implementation details ("we need a Redis cache") before fully understanding the problem ("users experience delays when..."). AI amplifies this tendency because it's eager to build whatever you describe. GenAI output naturally tends to skew towards it’s training data – therefore, solutions will feature what has been mostly commonly built before (rather than factoring in the nuances of your project’s requirements).

### **Specification & Requirements**

This is where many developers falter. Good specification requires precision without over-constraint. You need to describe the "what" and "why" whilst leaving room for the "how". This means understanding:

* **Functional requirements**: What should it do?

* **Non-functional requirements**: How well should it do it? (Performance, security, maintainability)

* **Context and constraints**: What are the boundaries? What assumptions are we making?

The irony is that some developers dismiss this as "business analyst work" whilst simultaneously complaining when requirements are unclear. AI doesn't fix poor specifications; it just implements its best guess with great speed. Introducing a stack of assumptions (that likely will lean towards the global average from its training data set) into the implementation that comes out.

## **Prompt and Context Engineering**

Naturally, AI models have constraints – an important one here is they have no memory of your previous conversations, your codebase architecture, or your team's conventions unless you explicitly provide this context (or this is implemented through features of the AI-based product you are using). Context engineering is the art of:

* Structuring your codebase so that relevant context is discoverable

* Maintaining clear documentation that can be referenced

* Understanding token limits and context windows

* Knowing when to provide broad architectural context vs specific implementation details

This resembles good API design: create clear interfaces, maintain consistent patterns, document the non-obvious bits. Of course, it goes beyond this as the requirements for what you feed an AI model are different from what you would provide a person.

### **Prompt Engineering**

This is the most discussed but arguably the least important skill on the continuum. Prompt engineering is tactical execution: "How do I phrase this request to get the output I need?" It matters, but it's downstream of everything else. A well-crafted prompt cannot rescue a poorly understood problem or inadequate specification.

Good prompts are:

* Specific about desired outcomes

* Clear about constraints and requirements

* Explicit about format and structure

* Aware of the model's strengths and limitations

## **Verification & Validation**

AI-generated code requires a different verification approach than human-written code. You're not checking for typos or syntax errors (after all, a compiler picks those up); you're validating that the AI understood your intent and that its solution actually solves the problem. The basics still matter here:

* Strong understanding of your domain and requirements

* Knowing what questions to ask about edge cases

* Recognising when something "looks right" but isn't

## **AI could lead us to change the specification to development process?**

Specification was arguably never the strongest attribute in a developer’s skillset. We're trained to think in implementations, to optimise for efficiency, to value "working code" above all else. Agile methodologies even encouraged us to deprioritise upfront specification in favour of iterative development. However, this probably now needs a rethink as AI requires more specification than humans.

As AI doesn't iterate like humans do. It doesn't learn your preferences through osmosis or pick up on your architectural vision through code reviews. Every interaction starts fresh. This means the quality of your specifications directly determines the quality of your outcomes. Might this lead to a revised operating model where we have the AI guess at a full set of \[missing\] specifications filling in gaps, implement them all and then present them as options? We need to start thinking about the different ways AI augmentation can help us build more effective and sustainable software. Can we avoid lots of costly round-trip to the AI development tooling by re-imagining the development process?

## **The Path Forward**

The good news: these are learnable skills. The better news: they make you a better developer regardless of AI tooling. Clear problem articulation, precise specification, and thorough verification were always valuable; AI has simply made them even more important.

### Start by:

1. **Write before you code**: Articulate the problem in plain English before touching your IDE or talking to a coding agent

2. **Be specific about outcomes**: "Make it faster" isn't a specification; "Reduce order page refresh response time below 200ms" is

3. **Define what makes your problem novel.** Document your context: make the constraints and unique project attributes explicit (remembering that AI-generated output will skew toward the average). Maintain clear architectural decision records and coding standards

4. **Practice verification**: Learn to spot subtle bugs in code you didn't write

5. **Accepting limitations of tooling:** You can't prompt-engineer your way out of poor specification

### Critical considerations for the spec-driven approach:

Don’t evaluate spec-centric processes by talking a purely code (or developer) first process and attempting to retrofit. Evaluating the relevance of spec-driven development by starting with business-aligned specifications not something generated by the code or pseudo code. This requires a mindset shift. If you don’t want to work that way, then you’ll probably find other approaches will work better for you and that’s fine if it achieves what you need.

Ease of maintenance: With AI-assisted development “code is law” will likely only work when you are working on individual files or relatively straightforward pieces of code (or modest code bases that will fit in a model's context window \+ tools for accessing content). Anything non-trivial (so most enterprise rather than hobby projects) will have significant complexity and require alignment across multiple parts of the code base. Add in confabulation, and over time, with maintenance, you have a recipe for creating an uncoordinated mess that lacks coherence. By mastering on the spec and making the spec law, AI can regenerate or refactor the entire code base if needed – as long as it is consistent with the specification (and that includes any required backwards and forwards compatibility requirements), you should be in a much more robust position. I say should as we need to see how spec-driven development plays out over the longer to medium term in significant enterprise deployments.

Portability: In a world where we are seeing evolution in programming languages, this allows for the adoption of more efficient or appropriate languages for the business problem. If you master in Python you are going to need to do a code migration to Rust – where the focus will probably be technical rather than feature equivalence. Spec-driven potentially becomes the step up – much like we mostly moved away from writing in assembly directly other than for niche applications (like real-time, embedded, lower level or truly novel hardware I/O) will we potentially move away from writing the current generation of languages directly ourselves?

The developers, analysts and architects who thrive in the AI era won't be those with the cleverest prompts. They'll be those who can think clearly, specify precisely, and verify thoroughly. The renaissance isn't in coding; it's in knowing what to build and why.

*This article was written with the assistance of claude.ai with review by humans and significant human editing.*