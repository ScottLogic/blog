---
title: 'Building JARVIS Properly - Phase 6: Vision Awakens (The Power of Protocol)'
date: 2025-12-03 10:54:00 Z
categories:
- Artificial Intelligence
tags:
- AI
summary: 'If Phase 5 was about building the mind, Phase 6 is about building the body.
  In this chapter, JARVIS transitions from a disembodied voice to an agent capable
  of touching the real world. Rather than hard-coding custom adapters for every file
  interaction, I adopted the Model Context Protocol (MCP), effectively "USB for AI",
  to give JARVIS standardised access to my local filesystem. This phase documents
  the technical reality of that upgrade: the "Russian Doll" directory nightmare I
  had to fix with some *emergency refactoring*, the shift to an asynchronous ReAct
  loop, and the satisfaction of seeing the `blast_radius` governance protocols successfully
  block a dangerous write operation. JARVIS is no longer just chatting; he is acting.'
author: rgriffiths
---

## Act 1: The Disembodied Voice

In [Phase 5, I successfully resisted the urge to give JARVIS a memory](https://blog.scottlogic.com/2025/11/21/building-jarvis-properly-phase-5-from-ultrons-ruins-to-jarviss-foundation.html). I argued that, before I gave the system infinite knowledge, I needed to give it discipline. I established the `blast_radius` governance protocols and rebuilt the architecture to be modular and sane.

It was the right call, but it left JARVIS frustratingly limited. He could think, he could reason across multiple agents, he could even synthesise consensus from conversation history. But he couldn't *do* anything. He existed in a kind of liminal space, able to discuss the world but never quite touch it.

In the MCU, this is precisely where JARVIS began: a disembodied voice. Brilliant, witty, indispensable, but fundamentally constrained by his lack of physical form. He could analyse Stark's suit diagnostics but couldn't repair them. He could warn of incoming threats but couldn't intervene. It wasn't until he was uploaded into Vision's synthetic body that he could phase through walls, interface with computers, and interact with the physical world.

Phase 6 is about giving JARVIS hands.

My ambitions were modest. I didn't need JARVIS piloting autonomous drones or restructuring my calendar. I just wanted him to read my project backlog in Obsidian and, ideally, tell me off for not finishing my tickets. To achieve even this simple goal required solving a fundamental architectural problem: how do you give an AI access to the real world without hard-coding every possible interaction?

## Act 2: The Plumbing Problem

The traditional approach to giving LLMs "tools" is straightforward but scales terribly. You write a Python function, let's say `read_file()`, and you describe it in a JSON schema that you send to OpenAI or Anthropic. The model replies with a request to call that function. You execute it, paste the result back into the conversation, and hope for the best.

This works for one or two tools. It becomes unwieldy at five. It becomes a maintenance nightmare at twenty.

If I wanted JARVIS to interact with my file system, my calendar, my GitHub repository, and my email, I would have to write custom adapters for every single one. I would become a plumber, spending my days connecting proprietary pipes between incompatible systems. Worse, every new capability would require invasive changes to JARVIS's core orchestration logic.

This violated the modular philosophy established in Phase 5. The whole point of that architectural rebirth was to avoid monolithic coupling.

Enter the **Model Context Protocol (MCP)**, released by Anthropic in late 2024.

MCP is, in essence, "USB for AI". It defines a standard way for an AI Client to discover and use Tools provided by a Server. Just as USB freed us from needing a different port for every peripheral, MCP frees AI systems from needing a different adapter for every data source.

The elegance was immediately obvious. I didn't need to hard-code a file reader into JARVIS's brain. I just needed to build a "File System Server" that spoke MCP, and teach JARVIS how to connect to it. When I wanted to add GitHub integration later, I wouldn't need to touch JARVIS at all, I would simply spin up a new MCP server.

This was modular AI architecture in its purest form.

## Act 3: Confronting the Russian Doll

Before I could let JARVIS touch my files, I had to confront a horror of my own making.

While implementing the MCP server for my Obsidian vault, I discovered that my project directory structure had evolved into a recursive nightmare. Through a series of hasty commits and "temporary" fixes (all well-known synonyms for technical debt accrual!) during the chaotic Mini-Me era, the planning vault had been nested four folders deep.

The path looked something like: `src/JARVIS/jarvis/planning/JARVIS planning/JARVIS Board.md`.

It was a Russian Doll of folders, each one wrapping the next in an increasingly absurd hierarchy. It was the kind of structure that emerges when you're moving quickly, trusting that you'll "fix it properly later". Later had arrived. The technical debt needed to be repaid.

A younger me, the one who built Mini-Me, might posssibly have hacked the path into the config file and moved on. Ship the feature, worry about elegance never.

But the product owner in me, the one who had painfully learned the lessons of Phase 4, called a halt. You cannot build a sophisticated AI agent on top of a shaky file structure. If the foundation is wonky, everything above it inherits that wobble.

I spent a morning performing "emergency refactoring" on the repository. I shut down the IDEs, killed the file watchers, backed everything up twice, and painstakingly moved the entire `planning` vault to the root level where it belonged. It was unglamorous housekeeping, the kind of work that generates no demos and impresses no stakeholders.

But it meant that when JARVIS finally opened his eyes, he wouldn't be cross-eyed trying to find his own backlog with both of his new hands!

Sometimes the most important work is the work nobody sees.

## Act 4: Architecture of Restraint

With the directories clean, I built the integration in three parts, each deliberately constrained in its responsibilities:

**The Server** (`servers/obsidian-mcp`) is a standalone Python script using the `FastMCP` SDK. It knows how to manipulate Markdown files in an Obsidian vault. It exposes tools like `read_note`, `list_notes`, `append_note`, and `create_note`. Critically, it knows nothing about AI, nothing about JARVIS, and nothing about the broader system architecture. It is simply a competent file handler that speaks the MCP protocol.

**The Client** (`jarvis/services/mcp_service.py`) is a bridge inside JARVIS that connects to the server via standard input/output. It handles the handshake, discovers what tools the server offers, and translates between JARVIS's internal orchestration logic and the MCP protocol. It doesn't care what the tools do; it just knows how to invoke them.

**The ReAct Loop** was the critical upgrade to the Orchestrator, and it's where the real intelligence lives.

Previously, the Orchestrator was a simple pipeline: receive prompt, send to LLM, return response. This worked for conversational AI but couldn't support tool use. I upgraded it to implement a **Reasoning + Acting (ReAct)** pattern.

Now, when I send a prompt, the Orchestrator:

1. Connects to the MCP server and asks "What can you do?"
1. Injects the tool definitions into the system prompt
1. Sends the user's prompt to the LLM
1. Watches the response carefully

If the LLM replies with text, we show it to the user. But if the LLM replies with a JSON tool call, the Orchestrator intercepts it, executes the tool via the MCP client, and feeds the result back to the LLM as a new "observation". The LLM can then reason about that observation and either use another tool or provide a final answer.

This is where JARVIS moves from conversation to action.

## Act 5: Governance as Conscience

This is where the strategic work from Phase 5 revealed its value.

I didn't just want JARVIS to read files. I wanted the ability to write them, to create new notes, to modify existing ones. However, giving an autonomous agent write access to your hard drive is how you get Skynet or, at the very least, a catastrophically deleted codebase.

The `blast_radius` governance pattern, embedded in every conversation thread since Phase 5, became the safety mechanism.

When I ran the system with `--blast-radius low` (Safety Mode), I deliberately asked JARVIS to do something dangerous: append a line to my `Lessons Learned.md` file.

The logs told the story better than I could:

```
INFO: 🛠️ Agent requests tool: append_note
```

```
WARN: 🛡️ Governance Block: 'append_note' blocked by LOW blast radius.
```

The Orchestrator saw the tool request, checked the governance rules defined in `GOVERNANCE.md`, and blocked the call before it reached the MCP server. JARVIS then politely apologised and explained it wasn't permitted to write files in the current mode.

Safety was not an afterthought. It was a first-class constraint, baked into the architecture from the beginning.

This is what mature AI engineering looks like: governance as a non-negotiable layer, not a feature you add when the lawyers get nervous.

## Act 6: First Contact

The final test was the full integration. I set the governance to `medium` (allowing writes) and asked JARVIS to read its own project backlog and create a summary note.

The terminal came alive:

```
✅ MCP Session Initialised
```

```
🔎 Discovered Tools: ['list_notes', 'read_note', 'create_note', 'append_note']
```

```
🛠️ Executing Tool: list_notes
```

```
🛠️ Executing Tool: read_note (path: 'JARVIS Board.md')
```

```
🛠️ Executing Tool: create_note (path: 'Summary.md')
```

I opened Obsidian. There, in the `Planning` folder, was a new file.

JARVIS had successfully reached out of the Python execution environment, navigated the file system, read a Markdown document, understood its structure, and created a persistent artefact based on that understanding.

Vision had awakened.

It was a small moment, but it felt seismic. This wasn't a chatbot parroting responses. This was a system that could perceive, reason, and act in the real world. Constrained, yes. Governed, absolutely. But *capable*.

The disembodied voice finally had hands.

###A Note on Reality:

Readers should not mistake this smooth narrative for a smooth implementation. This phase involved:

1. **Goal Drift:** My first attempt at the "Read & Write" test failed because JARVIS read the file, got excited, and just chatted to me about the contents instead of writing the summary file. I had to update the system prompt to be significantly "bossier" to stop him getting distracted by his own voice.
1. **Regex Betrayal:** My initial JSON parser was too lazy and cut off the end of long responses, causing the tools to fail silently.
1. **Running Out of Breath:** Even after fixing the parser, the write operation failed because the LLM simply hit the token limit. Generating a large markdown summary *inside* a JSON wrapper consumes a huge number of tokens. I had to manually increase the `max_tokens` limit on the backend adapter to stop the model from cutting off mid-sentence.
1. **The Infinite Loop:** During the final test, JARVIS tried to create a file that already existed. Instead of failing, it reasoned that it should try to *append* to the file instead. It then got stuck in a loop of trying to be helpful until the safety governor killed the process.
1. **The Gemini Gap:** While this works beautifully with OpenAI and Anthropic, I discovered that Google's Gemini models struggle with this specific implementation. My current approach relies on "Prompt Engineering" (telling the model to reply with a specific JSON schema). Gemini prefers its own native Function Calling API and often ignores raw JSON instructions, meaning I will need to write a specific adapter for it in a future phase.

AI engineering, it turns out, is 10% AI and 90% fixing regex, race conditions, and token limits.

## Closing: The Ecosystem Expands

I now have a system that can think (LLM orchestration), judge (governance), and act (MCP). Each layer is modular, each interface clean, and each boundary well-defined.

The beauty of the MCP approach is that adding new capabilities no longer requires surgery on JARVIS's brain. Want GitHub integration? Build a GitHub MCP server. Want calendar access? Build a calendar server. JARVIS just connects to them.

The architectural vision from Phase 5 has proven itself. Delayed gratification as competitive advantage. By resisting the urge to bolt on features quickly, I've built something that can grow sustainably.

Next up: **Friday's Library**. I'm going to connect JARVIS to the wider filesystem and GitHub, turning him from a note-taker into a true coding companion. The retrieval layer that I delayed in Phase 5 will finally arrive, but it will arrive on a foundation solid enough to support it.

The flying suit is coming along nicely.

---

### Technical Footnote: Implementation Details

For those following the code, three implementation challenges deserve mention:

**Async/Await:** The move to MCP required refactoring the CLI from synchronous code to `asyncio`. The Orchestrator now runs an async event loop to handle tool execution without blocking. This added complexity but made the ReAct loop far more elegant.

**Environment Management:** I learned the hard way that Python's `dotenv` doesn't automatically propagate to subprocesses. Explicitly injecting environment variables into the MCP server's execution context was critical for it to locate the Obsidian vault path.

**Defence in Depth:** The MCP server implements strict path validation to ensure JARVIS cannot read files outside the designated vault, preventing path traversal attacks. Governance exists at two levels: the Orchestrator checks intent (should this tool be allowed?), and the Server enforces execution boundaries (is this path safe?). Both layers are necessary.
