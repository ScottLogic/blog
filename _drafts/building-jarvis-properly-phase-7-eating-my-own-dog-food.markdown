---
title: 'Building JARVIS Properly - Phase 7: Eating My Own Dog Food'
date: 2025-12-11 11:31:00 Z
categories:
- AI
tags:
- AI
summary: 'If a tool isn''t good enough to build itself, it isn''t good enough. That
  was the logic behind Phase 7: using JARVIS to build JARVIS. It started with a simple
  database migration and ended with me locking horns with the Python Global Interpreter
  Lock over a cup of tea that went cold hours ago. Join me for a "war story" about
  the perils of autonomous development, featuring a tin of baked beans, a phantom
  error log, and the realization that sometimes the hardest part of building an AI
  system is just getting it to copy text to the clipboard.'
author: rgriffiths
---

## Act 1: The Lobotomy Loop

By the end of Phase 6, JARVIS had hands. He could read my backlog and write notes in Obsidian. But he still had a critical limitation: he couldn't read his own code.

If I wanted to add a feature, I still had to do it myself. I was the architect; he was just a sophisticated terminal. He could execute complex commands perfectly, but he couldn't draft the plan. He was a passive runtime environment, not an active participant.

Phase 7 is about changing that dynamic. My goal was simple but ambitious: I wanted to use JARVIS to build JARVIS. In industry terms, this is "Dogfooding". If the tool isn't good enough to build itself, it isn't good enough. Full stop.

However, attempting this immediately revealed a dangerous cycle I call the **Lobotomy Loop**.

If I ask JARVIS to rewrite his own brain and he makes a syntax error, he crashes. A crashed JARVIS cannot fix the crash. You are left with a broken Python script, a very quiet terminal, and a profound sense of regret.

To solve this, I had to give him eyes. Before he could rewrite his own code, he first needed the ability to read it.

## Act 2: The Gemini Upgrade

But eyes are useless without a visual cortex. Simply giving JARVIS access to the file system wasn't enough; he needed the intelligence to understand what he was looking at. Before I could trust him with his own source code, I needed a smarter brain.

In previous phases, I relied on "Prompt Engineering" to make models use tools. I would inject a system prompt saying "Please reply with a JSON block if you want to use a tool". OpenAI and Claude are very good at this.

Google's Gemini, however, is more of a free spirit! It often ignored the JSON instruction, or wrapped it in conversational filler ("Here is the JSON you asked for..."), or formatted it in ways that broke my regex parsers. Again. And again.

To fix this, I stopped fighting the model and started using the platform. I rewrote the Google backend (`backend_google.py`) to use **Native Function Calling**. Instead of text prompts, I translate my MCP tool definitions into Google's Protocol Buffer format.

The difference was immediate. No more regex parsing. No more "I hope he formats this right". Gemini now triggers tools with the precision of a compiler.

## Act 3: The Brain Transplant

With a smarter model and a filesystem server that could read `src/`, I attempted the first true Dogfooding task: **The Database Migration**.

JARVIS has historically stored every conversation as a separate JSON file. This works for 50 conversations. It is a disaster for 5,000. I needed a SQLite database.

Instead of writing the SQL myself, I ran this command:

> "Read `src/jarvis/data/threads.py`. Design a SQLite schema to replace the JSON filesystem. Save the raw SQL to `planning/schema.sql`."

JARVIS read the Python class, understood the data structure, and wrote a perfect SQL schema.

I then pushed harder:

> "Read that schema. Now write a Python service `database_service.py` that implements it."

He wrote the import statements. He wrote the `sqlite3` connection logic. He wrote the `INSERT` statements. He even handled the JSON serialisation for the metadata fields.

It was going perfectly, right up until we hit the **Escaping Horizon**.

## Act 4: Infinite Madness

In physics, an Event Horizon is the _point of no return_ around a black hole. In AI engineering, the *Escaping Horizon* is the point where an LLM tries to write Python code *wrapped in* a JSON string *inside* a tool call much like Churchill's _"a riddle wrapped in a mystery inside an enigma"_.

Python code contains quotes, newlines, and indentation. JSON also uses quotes and newlines. If the model misses a single escape character (e.g. `print("hello")` remains as `print("hello")` instead of becoming `print(\"hello\")`), the entire JSON structure collapses.

For a few hours, I felt like Sam Neill's character in *Event Horizon*, staring into a chaotic dimension of malformed syntax from which no valid JSON could ever return (*libera te tutemet ex inferis*, indeed).

Whilst Gemini is brilliant at logic, it struggled with this specific syntactic nesting doll. I had to step in as the "Principal Engineer" to fix the brackets, but the Junior Developer (JARVIS) had still done 90% of the heavy lifting. Nice work, JARVIS!

## Act 5: The Self-Awareness Paradox

With the code fixed and the database initialised, I ran the final test:

*"Hello JARVIS, are you writing to the database?"*

The logs showed the following sequence:

1.  JARVIS received the prompt.
2.  JARVIS processed the answer.
3.  JARVIS generated the text: *"No, I am not writing to a database."*
4.  JARVIS executed the new `save_thread()` function and successfully saved that denial into the very database he claimed didn't exist.

Oh, the irony! He had a new memory, but I hadn't updated his self-image (System Prompt) to tell him about it. A quick update to `prompts.py` later, and he finally accepted his new reality. Better late than never!

## Act 6: Breaking the Fourth Wall

With the database migrated and self-awareness achieved, JARVIS was effectively a brain in a jar. He could think, he could write to his local disk, but he was isolated. To be a true collaborator, he needed access to the source of truth: **GitHub**.

In the past, integrating GitHub meant writing a custom wrapper class, handling OAuth flows manually, and hard-coding specific API endpoints. It was brittle.

This time, I used the **Model Context Protocol (MCP)**.

I spun up a local MCP server acting as a gateway to the GitHub API. The beauty of MCP is that I didn't have to teach JARVIS how to use it. I simply pointed the Orchestrator at the server, and during the handshake, JARVIS asked: *"What can you do?"*

The server replied: `['list_repos', 'read_issue', 'create_issue']`.

JARVIS dynamically updated his own toolset. I didn't write a single line of prompt engineering to explain what a "Repository" was. He just knew.

## Act 7: The "Empty State" Test

To test this connection, I gave JARVIS a conditional logic puzzle:

> *"Read the latest issue in 'rgriffiths-scottlogic/JARVIS'. If no issues exist, create a new issue titled 'Phase 7 Integration'..."*

This is trickier than it sounds. It requires the agent to:

1.  Attempt a read operation.
2.  Interpret a failure (or an empty list) not as an error, but as a condition.
3.  Pivot to a write operation.

The logs were beautiful:

```text
INFO: 🛠️ Executing Tool: read_issue with args: {'issue_number': 1}
...
INFO: 🛠️ Executing Tool: create_issue with args: {'title': 'Phase 7 Integration'}
```

He realised the repo was empty, and immediately filed **Issue \#1**. JARVIS had officially created his own work ticket.

## Act 8: The Hammer and The Tin of Baked Beans

Hubris, however, is a constant companion in AI development (or any development!). Emboldened by success, I immediately asked JARVIS to add a comment to that ticket.

**He failed.**

Instead of commenting, he created **Issue \#2** with the body text of the comment. Why? Because I hadn't given him a `create_comment` tool yet.

When an LLM wants to solve a problem but lacks the precise tool, it engages in "Semantic Approximation". It looks at its toolbelt, sees `create_issue`, thinks *"Well, this writes text to GitHub, that's close enough"*, and fires away.

It’s the digital equivalent of trying to hammer in a nail with a tin of baked beans. It _would_ work, but it makes a mess.

I had to lift the bonnet on `server.py`, get my hands dirty once more, and implement `create_issue_comment`. Once I rebooted the server, JARVIS discovered the new tool and immediately corrected his behaviour, successfully posting: *"Phase 7 Integration: Automated comment capability verified."*

In the span of an hour, JARVIS had:

1.  Detected a lack of documentation (no issues).
2.  Created the tracking ticket.
3.  Updated the ticket with progress.
4.  Closed the ticket upon completion.

The "Lobotomy Loop" was broken. The GitHub connection was live. Cue the credits!

But there was still one problem: staring at the scrolling text of the end credits is boring...

## Mid-Credits Scene: The Dashboard War

After closing the loop on the logic, I realised something: if JARVIS is going to be a system, he needs a dashboard.

I spent a whole Monday morning building a **Terminal User Interface (TUI)** using Python's `textual` library. Instead of a black box, I wanted a split-screen command centre:

  * **Left Pane:** The conversation.
  * **Right Pane:** The "Matrix" (Real-time system logs and tool calls).
  * **Status Bar:** A live indicator that flips between **IDLE** and **THINKING**.

It wasn't just aesthetic. It was a declaration of intent. But as it turned out, building the dashboard was the easy part. Making it run without exploding was the real challenge.

Here is the breakdown of the battles we (JARVIS and I) fought to get **v0.7.0** stable.

### 1\. The "Worker Fratricide" Bug

**The Symptom:** The TUI would start, but the moment I typed a command, the Agent would disconnect ("Shutting down MCP connection...").

**The Cause:** Textual's `@work(exclusive=True)` decorator puts workers into a default group. Both our **Agent Lifecycle** (which holds the connection open) and our **Input Handler** (which processes typing) were in the same group. When I typed, the UI spawned the Input worker, which *killed* the Agent worker to enforce exclusivity.

**The Fix:** We assigned them explicit groups: `group="agent_core"` and `group="user_input"`. Now they coexist.

### 2\. The "Phantom Error" (Stderr Swallowing)

**The Symptom:** A huge error traceback would flash on the screen for ~100-150ms (just long enough to see), then vanish, replaced by a "Timeout" error.

**The Cause:** The MCP Server process was crashing (due to a missing token check), printing to `stderr`, and dying. The TUI repainted the screen immediately, hiding the evidence.

**The Fix:** We hijacked `sys.stderr` in `tui.py` and redirected it to a file (`tui_debug.log`). This allowed us to catch the crash so we could do a post-mortem exam.

### 3\. The Threading Deadlock

**The Symptom:** `RuntimeError: The 'call_from_thread' method must run in a different thread.`

**The Cause:** We built a `WidgetLogger` to write logs to the screen. When called from a background worker, it needed `call_from_thread` to update the UI safely. When called from the main startup routine, that same call caused a crash because we were *already* on the main thread.

**The Fix:** A "Thread-Smart" Logger. We implemented a check using `threading.get_ident()` to determine if we were on the Main Thread or a Worker, and dispatched the write command accordingly.

### 4\. The Infinite Stutter

**The Symptom:** `Error: Maximum tool turns reached.`

**The Cause:** The Agent would list repositories, show me the JSON, and then my regex parser would see that JSON and think, *"Aha! A tool call!"*. It would then try to execute the data as code, fail, and loop forever.

**The Fix:** We hardened the parser in `jarvis_agent.py`. It now checks if the JSON actually contains `"tool": "..."` before attempting execution.

### 5\. The UI Wars (Colours & Clipboard)

Once the backend stopped crashing, I got *really* greedy. I wanted the agent's output to pop. Green for success, Cyan for prompts and so on. I updated the logger to send coloured text.

  * **Expectation:** A beautiful green <code style="color: green;">[SUCCESS]</code> message.
  * **Reality:** The screen literally printed `[bold green]SUCCESS[/bold green]` in white text.

I learned (the hard way) that the standard `Log` widget is dumb: it only takes strings. I had to rip out the widgets and replace them with `RichLog`, which understands markup natively. Finally, the colours appeared.

Then came the most humbling moment of the project. I tried to copy the agent's response.

I clicked. I dragged. Nothing.

I held <kbd>⇧ Shift</kbd>.

I held <kbd>⌥ Option</kbd>.

I held <kbd>Fn Function</kbd>.

I held <kbd>⌘ Command</kbd>.

I held <kbd>^ Control</kbd>.

The TUI refused to release the mouse capture.

I was building an autonomous AI system, but I couldn't copy text out of my own terminal which was one of the very first key drivers that set me down the path for this whole project. The irony is not lost on me! See [Extracting Data From AI Models - Phase 3: A Tale of Three Approaches](https://blog.scottlogic.com/2025/07/23/extracting-data-from-ai-models-a-tale-of-three-approaches.html) for additional context.

I fought the framework for an hour and lost. In the end, I implemented the "Ultimate Give-Up": a custom `/copy` command. Now, when I type `/copy`, JARVIS programmatically dumps his last response into my system clipboard using `pyperclip`. It is not elegant, but it works sufficiently well for now. This will be revisited!

## Post-Credits Scene: The Memory Hole

Just as I was about to wrap up, I realised a fatal flaw. I had a beautiful dashboard, stable threads, and a powerful agent... but no memory.

If I quit the TUI, the conversation vanished. `tasks` were stored in SQLite, but the actual *thinking* (the prompts, the tool outputs, the reasoning) was purely in RAM. JARVIS had amnesia, poor chap.

**The Recorder**

I hooked into the Agent's chat loop to log every interaction to a new `chat_history` table in `jarvis.db`.

  * **User Input:** Logged immediately.
  * **Tool Calls:** Logged as "System" events.
  * **Final Answers:** Logged as "Assistant" responses.

**The Final Crash**

Of course, it wasn't that simple. The first time I ran it:
`InterfaceError: Error binding parameter 3 - probably unsupported type.`

I was trying to shove the raw `CallToolResult` object from the MCP SDK directly into a SQLite `TEXT` column. One quick `str(result)` cast later, and the crash was gone.

**The Viewer**

Reading raw JSON from SQLite is painful. I didn't want to use a SQL client to read my chat logs: that felt unnecessarily cumbersome. So, I built a small utility script, `view_chats.py`. It uses the `Rich` library to render the database rows into a beautiful, colour-coded script, stripping away the GUIDs and metadata so I can just read the story.

NOW, Phase 7 is complete.
