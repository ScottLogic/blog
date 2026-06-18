---
title: Working Effectively with Claude Code
date: 2026-06-18 09:09:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
summary: After months working with GitHub Copilot in VS Code and recently switching to Claude Code, the transition turned out to be more involved than expected. Claude Code operates differently and in ways that take time to adjust to. In this post, I share my experiences and tips drawn from that experience.
author: alaws
---

After months working with GitHub Copilot in VS Code and recently switching to Claude Code, the transition turned out to be more involved than expected. Claude Code operates differently and in ways that take time to adjust to. The tips below are drawn from that experience.

## Parallelisation
Often the greatest efficiency gains come from working in parallel. This may be as simple as setting an agent off to complete groundwork for an issue while you're in a meeting or working on an unrelated task. Alternatively, it may involve running multiple agents simultaneously - a significant shift from how developers worked before AI tooling.

Claude Code's terminal interface makes this low-friction by default: you open a new terminal, start a session, and it's independent. GUI-based tools typically tie parallelisation to whatever that tool explicitly supports, meaning your ability to run concurrent agents depends on how well that particular interface has been designed for it. With a TUI, the underlying OS already has well-established UX patterns for swapping between parallel terminals, so you get this for free.

Claude Code's support of Git worktrees takes this further, allowing multiple agents to work on the same codebase simultaneously without overwriting each other's changes as each agent operates in its own isolated branch and on-disk working copy. Unlike separate clones, worktrees share the same underlying commit graph, so agents benefit from a single, consistent history while still working in fully independent directories. For example, you might have one agent working on a new feature in one worktree while another agent is debugging an issue in a different worktree. This allows for true parallelisation without the risk of conflicts or lost work.

Claude also offers an [agent view](https://code.claude.com/docs/en/agent-view#manage-multiple-agents-with-agent-view), which is opened with the `claude agents` command. Rather than managing parallel sessions across separate terminals, agent view consolidates them into a single screen: each session appears as a row showing what it's currently doing and whether it needs your input. This makes it much easier to round-robin between tasks as you can see at a glance which agents are waiting on you and which are still working.

## Managing parallel work

When running multiple tasks concurrently, it can become difficult to keep track of things, which Addy Osmani refers to as the [orchestration tax](https://addyosmani.com/blog/orchestration-tax/). Simple habits like naming sessions and terminals make a meaningful difference. Claude Code's ability to search through previous sessions also helps here, making it easier to pick up context across concurrent workstreams.

For the developer, parallelisation comes with the trade-off of more context switching, potentially imposing a limit to how much you can usefully parallelise. Therefore, take the time to work out a strategy that works for you and your situation. For example, you might start a new session to get a basic implementation in place for one feature while you actively refine and test the previous one. For more complex problems, you may benefit from having an agent gather and summarise relevant background information before you begin. One practical approach is to keep agent requests roughly the same size and rotate between them, so you're never just waiting on a response from an agent. When switching back to a task, re-reading your initial prompt is more effective than scanning the output; it often pulls you back into the context more quickly.

Claude Code's `/btw` (by the way) functionality is particularly useful here. While an agent is working on changes, you can ask it to complete an additional task in parallel such as finding relevant information, answering questions about previous changes, or summarising the context you'll need later. The benefit of `/btw` is that it allows you to ask a side question, with the full context of the session, but it is not added to the main context itself. This means you can quickly ask a question without providing additional context yourself and you don't derail Claude from its main task. It's worth noting that `/btw` has no tool access, meaning it can't read files, run commands, or search.

## Switching Models to Suit the Task
Different models are suited to different tasks, and token budgets should factor into your decisions. Using the most capable model for every job is likely to burn through that budget fast.

Opus is built for deep work, such as complex multi-step tasks requiring sustained reasoning and planning, at the cost of higher latency and token spend. Haiku is suited for wide work: high speed and low cost, suited to broad exploration, high-volume tasks, and anything where coverage matters more than judgment. Sonnet is the balanced default: strong coding abilities, good speed and cost efficiency.

You don't need to use the heavyweight models for every task. Claude Code already applies this logic internally - during plan mode, it delegates codebase exploration to a Haiku-powered subagent, using the lighter model for broad search tasks and reserving heavier models for reasoning. You can apply the same principle yourself. Reserve Opus for complex technical problems, and try Haiku for simpler tasks like small research tasks or documentation changes. The reverse is also true: if a lighter model has struggled to make progress, switching to a heavier one is often the right call.

Be intentional about which model you start a session on. It isn't always visibly obvious which model is active, so it's easy to forget you've switched to a lighter one and find yourself wondering why output quality feels off. In the TUI, you can [customise your status line](https://code.claude.com/docs/en/statusline) using the `/statusline` command to surface things like the active model and context percentage at a glance.

## Learning a New Tool Takes Time
When switching to a new AI coding tool, expect the ramp-up to take longer than you anticipate. New tools come with new features or different names for capabilities that exist elsewhere. Make a deliberate effort to explore and try these, whether through cheat sheets, knowledge sharing with colleagues, or simply reading through the command list from within Claude Code. Don't underestimate the amount of muscle memory a new tool requires, and the time it takes to build it.

Adapting your workflow also takes time. When you first start using Claude Code, consider spending time observing it in action with more verbose output enabled, so you can see exactly what's happening and identify where things could be improved. This may feel counterintuitive given the productivity gains on offer, but the investment pays off. In the TUI, `CTRL + O` opens the transcript viewer, where you can review all tool calls and actions from your session, making it easier to spot where things went wrong or where Claude made unexpected choices. You can also set `showThinkingSummaries: true` in your `settings.json` file. This means that thinking blocks are expanded by default rather than requiring you to open them manually.

The `/insights` command can be particularly useful here. It reflects on your current session and surfaces observations you might otherwise miss repeated friction points, common tool calls, or patterns worth reinforcing. It's a good starting point for tuning your harness: after a working session, run it to get a concrete basis for which permissions to add to your allow-list, which hooks might save you repeated approvals, and what automated behaviours are worth configuring.

## Sandboxing and Permissions
Claude Code's sandbox and allow-list features give you control over what the model can execute automatically, but there are some practical nuances worth understanding. Allow-list entries can be brittle - minor variations in how a command is phrased may break them, and models will readily reach for those variations. The sandbox addresses this more fundamentally: rather than blocking a specific technique, it provides complete filesystem and network isolation.

When using the sandbox, Claude cannot edit files outside the current directory regardless of what it tries. Network access is restricted in the same way: it is limited to explicitly approved domains. This makes sandboxing more robust than allow-listing alone, and it enables a more experimental approach. Because Claude is operating within a controlled boundary, you can afford to let it try things without worrying about unintended side effects on your environment. This shifts the dynamic from carefully approving each action to broadly enabling a class of behaviour and letting Claude work. The trade-off is that the sandbox can be complex to configure safely.

However, sandboxing comes with a significant caveat: it only applies to Bash commands. Model Context Protocol (MCP) tools run as separate processes on your host machine and effectively bypass the sandbox. For example, an MCP tool that makes HTTP requests can reach external networks regardless of your sandbox's network isolation. Similarly, a GitHub MCP tool's access is determined entirely by its API credentials; it can modify any repository the token allows. Therefore, you need to also carefully lock down each tool’s credentials and permissions to ensure that the sandbox remains an effective security boundary.
