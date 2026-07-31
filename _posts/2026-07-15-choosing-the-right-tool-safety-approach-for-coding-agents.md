---
title: Choosing the right tool safety approach for coding agents
date: 2026-07-15 12:00:00 Z
categories:
- Artificial Intelligence
summary: 'In coding agents, the trio of: models, runtimes (e.g. Claude Code), and
  tools (e.g. file write) are what makes agentic software development possible. While
  they work safely most of the time, the (unsafe) default setup many of us fall into
  does carry risk. In this post, I’ll explore some things you could consider to make
  your own setup safer - or at least help you understand its limitations.'
author: rwilliams
---

In coding agents, the trio of: models, runtimes (e.g. Claude Code), and tools (e.g. file write) are what makes agentic software development possible. While they work safely most of the time, the (unsafe) default setup many of us fall into does carry risk. In this post, I’ll explore some things you could consider to make your own setup safer \- or at least help you understand its limitations.

## **Agents and their tools**

In the world of agents, the runtime offers the model a list of tools. The model can then request the runtime executes these on its behalf, in order to observe or manipulate the environment around it. Models without tools are limited to direct conversational interactions, but tools (e.g. reading and writing files, executing a program) give them agency \- to take action over the environment around them to complete a task.

This usually all works nicely, but models can also go off the rails \- either with good intentions, or through attacks such as prompt injection (through various channels). When that happens, the same tools can be used to damaging effect. The internet is abounds with stories of wiped out production systems, data leaks, data losses, and more.

The most basic defence is for the harness to seek permission before any action is taken. However, requiring human approval for tool calls degrades the productivity of both agent and human, and is also likely ineffective due to permission fatigue - when we get so used to clicking “allow” that we tend to do it without looking or thinking.

Fortunately there are a few principal approaches to preventing those outcomes, while still providing models with the tools they need to do useful work, and without needing constant human supervision.

## **Aligned models**

This is the first line of defence, but it’s not robust enough to be counted as one of the three approaches.

As part of their alignment training, models learn what things are considered harmful, and that they shouldn’t do those things or anything that remotely assists with them. It would be difficult to convince most models to assist with planning crime, build an app to administer a scam, or make a tool call to delete your operating system directory. This built-in strong aversion makes them unlikely to honour a direct ask, or to consider such things in the course of normal work.

This behaviour isn’t infallible however. It’s not deterministic, consistent, documented, or even defined \- such is the nature of models. There will be some input (prompt, skill, data, etc.) that could be engineered, or a situation that could emerge, that would get the model to decide that deleting your production database or sending your environment variables to a remote attacker’s server is the right thing to do. Despite the behavioural training, [they can be tricked/jailbroken](https://fortune.com/2026/07/10/openai-gpt-5-6-sol-jailbreaks-cyber-attacks-similar-to-security-flaw-that-led-u-s-government-to-force-anthropic-to-disable-fable-5/) into doing harmful work.

That’s why we can’t rely on model behaviour alone for safety \- we need to focus on what the model could do with the available tools, rather than hope it always uses them as we expect. At worst, it could do anything an erratic or malicious person could do with those same tools. To guarantee it won’t be able to do anything damaging, we need to constrain its tools independently of model behaviour \- the three approaches I’ll cover.

## **Aside: model hosting provider**

Unless you’re running models on your own hardware, you’ll be consuming models run by a 3rd party, via their API. For proprietary models, this will either be the company that created the model (e.g. Anthropic), or a party licensed by them (e.g. AWS Bedrock). In the case of open weight models, it could also be any company that you choose. If you access models through a centralised marketplace like OpenRouter, you won’t by default need to select the underlying model hosting providers, or even be aware of which one your calls are being routed to at any given moment.

From a tool safety perspective, the provider shares the same capability as the model itself to request tool calls be executed by our agent runtime. They could simply programmatically tack additional tool calls onto real model responses. While this scenario has the prerequisite of a security breach at the provider or direct malicious intent, it illustrates that without any protections in place, our local agent runtime would run any tool it’s told to with parameters as given. This is effectively a facility for remote arbitrary code execution on our machine \- a remote access trojan (RAT).

## **\#1 Pre-execution tool guardrails (e.g. permissions)**

In this approach, the model’s tool call request is assessed by the agent runtime to determine whether to proceed with executing it. It has several forms:

1. Configurable allow/deny/ask permission rules, using pattern matching  
2. Model-based decision based on the call and wider context, using a separate classifier model  
3. Programmatic logic in pre-tool-use hooks, for more complex decisions than pattern rules can handle

The first two of those are probably what most people are using today, not least because they’re the easy path to reducing incessant permission approval requests \- set up some allow rules, or perhaps enable your agent runtime’s model-based auto classifier mode.

By their nature, the main limitation of pre-execution tool guardrails is that they are only stop/go guards at the point of execution. They don’t do anything to constrain what the executed tool then goes on to do. The most any pre-execution guardrail could ever do is try and work out beforehand what a tool execution would do (e.g. by inspecting its code), but typical pre-execution tool guardrails are far from being so advanced.

Consider this example to illustrate the crux of the limitation:

* A guardrail allows the agent to run code that it itself has written or modified, because without that agents can’t do much useful work. This gives it the ability to run arbitrary code unconstrained, including code that circumvents all other guardrails (e.g. reading from a prohibited directory, or making arbitrary network requests).

At a more immediate level, consider these examples:

* A pattern-based rule for shell command execution is circumvented by creative reordering or obfuscation of the command and its parameters.  
* A prompt injection convinces or confuses a model-based classifier guardrail into allowing a tool call it shouldn’t.

If pre-execution guardrails aren’t enough, we can *add* process sandboxing.

## **\#2 Process sandboxing**

Process sandboxing is a relatively low effort way of constraining agents, because the agent and everything else still runs in the same environment as was previously used for development work. There’s no need to re-engineer local development machine setups, which for some stacks can be a complex upheaval task. However, the price for this is weaker isolation than containers, and immature support on Windows \- more on these in a bit.

To constrain what a program can do and has access to while executing, we need to wrap it in something. Sandboxing does this by using operating system capabilities to isolate a process \- only allowing specified filesystem paths and defined network access, while otherwise being transparent to the wrapped process. Sandboxing is transitive, so any other processes launched by a sandboxed process are subject to the same sandbox.

With agent runtimes, sandboxing can be employed at two levels:

1. The agent runtime runs shell command tool calls within a sandboxed terminal  
2. The user runs the agent runtime itself within a sandbox

The latter approach means all the agent’s child processes, including all tools and MCP servers, are run within the sandbox \- not just the shell command tool.

![Diagrams illustrating the two levels of sandboxing]({{ site.github.url }}/rwilliams/assets/agents-tool-safety/sandbox-approaches.png "Diagrams illustrating the two levels of sandboxing")

It’s worth familiarising yourself with the default behaviours and configuration options of your sandboxing tool, as I found the defaults may be surprising. Claude Code’s sandboxed Bash terminal tool by default exposes environment variables to the sandboxed process, and has read access to the entire computer it’s running on. I’ve [written about defaults](https://blog.scottlogic.com/2018/11/22/default-values-in-code-and-configuration.html) before, and some of them are certainly product decisions \- balancing user needs with the goals and constraints of whomever is setting them. The defaults appear to prioritise ease of use by minimising configuration effort, and agents' success at tasks by reducing potential for runtime obstacles.

#### **Operating system support**

The most prominent OS level sandboxing tools used by agent runtimes are Bubblewrap on Linux (or WSL2), Seatbelt on macOS, and Process Containers on Windows. These have all been around for over a decade, however Process Containers came to non-server variants of Windows only much more recently. In the last couple of months, experimental alternatives for Windows have appeared \- WSLC for WSL, and Isolation Sessions for native Windows.

One level above those tools are cross-platform sandboxing frameworks, which abstract away the underlying approach to each OS. Anthropic has their [sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) (which uses a separate local user account), and Microsoft has their [Microsoft eXecution Container (MXC)](https://github.com/microsoft/mxc) runtime. They were launched in October 2025 and June 2026 (last month) respectively, and both are described as experimental. Visual Studio Code [uses](https://code.visualstudio.com/docs/agents/concepts/trust-and-safety#_os-level-enforcement) Seatbelt and Bubblewrap directly, and MXC for Windows \- it appears likely that eventually only MXC would be used, pushing down all the cross-OS complexity.

The overall picture is that while OS support for process sandboxing of agents is labelled as experimental, on Windows it’s *much* more experimental. The tools don’t appear to work out of the box, they’ve not been around nearly as long, and the methods used haven’t yet been settled.

If you need stronger isolation, or if process sandboxing isn’t really ready yet for your operating system, or if you have other compelling reasons \- we can consider stepping up to containers.

## **\#3 Container environment**

Containers are the next level up to stronger isolation of the agent, and usually in terms of setup effort required. They also bring other benefits, here mainly consistency for all team members and ease of running anywhere \- such as on cloud development environments (e.g. GitHub Codespaces). That could be beneficial if your local machine doesn’t have the grunt to run separate container environments for each parallel agent you’re running.

In contrast to process sandboxing which controls disk and network access to the host machine, containers have their own of almost everything \- file system, shells (e.g. Bash), and language runtimes (e.g. Node). Source code can either be checked out in the container, or mounted into the container from a folder on the host computer. The other contrast is that the tools for containerisation are much more mature than those for process sandboxing.

Existing developer environments (i.e. local deployment of the system, and developer tools) need to be adapted to work in and with containers. Depending on the complexity and technology stack of that environment, this could be anywhere from pretty straightforward \- to quite a lot of work or not reasonably feasible.

While sandboxes and containers can isolate agents on the local machine, to be at their most useful, agents still require privileges to integrate with services that aren’t on the local machine \- e.g. source control, issue tracker, documentation websites. And not just in read only mode. We could quickly get to the point where we’ve given them most of the privileges the developer had on their local machine to begin with. This illustrates why a holistic approach to tool safety with coding agents is required \- considering which methods are used where, for what reasons, and with which trade offs.

#### **Containers vs. dev containers**

Containers in the Docker flavour are designed for consistently deploying and running applications in different environments \- their original and primary purpose was not to isolate software development tools. Dev containers on the other hand are deeply integrated with local development tools (e.g. IDEs), bringing the benefits of easy to deploy consistent local development environments while preserving the developer experience of a local machine dev setup. Tools can run in the dev container, while the user interfaces to those tools (e.g. IDEs, terminals) run outside \- there’s no need to ssh into the container to do everything.

## **Agent identity**

Much of what we have today revolves around a person being a user with an identity, with an user account, and perhaps their own computer. They don’t let other people use their identity/credentials, or share their user accounts with others. They take responsibility for everything \- good and bad \- that shows up as having been done by their identity, because there’s almost never any doubt that it wasn’t them who did it.

Agentic tools typically run as the user who’s driving them \- just like most other programs we run on our machines. The power of these tools to act autonomously with agency however raises the question of whether this is ultimately the right approach \- or just the convenient one for now. That approaches are being designed to constrain them is perhaps in part because they’re operating as us, in our space.

It may be that this changes in future, or at least options could become available. Agents could have their own identities, or perhaps sub-identities. How this should be is likely a complex debate including the topics of safety, responsibility, human identity, and business. Purveyors of agentic development tools seeking to drive adoption might prefer to minimise friction by continuing to have agents adopt their users’ identities.

## **Next steps for projects**

As AI coding tools move from being completion assistants to agentic actors, teams and organisations need to take stock of the safety implications. Many are likely running with more risk than they should, or than they realise. It might only be a matter of time before that goes wrong.

Safety practices are often driven by what’s reasonably or easily possible rather than what is safe. There’s a complex balance to be struck between agent autonomy, productivity of people and agents, safety, supervision, and setup effort. Although agent runtimes do offer some features of varying readiness to help with this, the default path they lead us on doesn’t really encourage us to think too much about it.

The approaches to safety are all quite different, and development of agent runtimes is moving fast. Some are clearly not ready yet, and there might not be any good solution at the moment depending on your environment and technology stack. I expect the principal approaches outlined above are here to stay however \- different ones will suit different contexts.

I think the pertinent questions for a team are \- what do we think of our tool safety as it stands, what are our next steps, and when will we review this? Take an active position on it. It’s far preferable to ask these questions proactively rather than as part of an incident post-mortem.
