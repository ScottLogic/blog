---
title: 'New Tools, New Flow: The Cognitive Shift of AI-Powered Coding'
date: 2025-05-08 21:43:00 Z
categories:
- Artificial Intelligence
summary: Adopting AI-powered developer tools like GitHub Copilot and ChatGPT is a
  challenging yet rewarding journey that requires time, experimentation, and a shift
  in how developers approach their workflows. This post explores why these tools are
  hard to learn, how they disrupt traditional flow states, and offers practical advice
  for integrating them effectively into day-to-day coding.
author: ceberhardt
image: "/uploads/robot-shrug.jpg"
---

*Adopting AI-powered developer tools like GitHub Copilot and ChatGPT is a challenging yet rewarding journey that requires time, experimentation, and a shift in how developers approach their workflows. This post explores why these tools are hard to learn, how they disrupt traditional flow states, and offers practical advice for integrating them effectively into day-to-day coding.*

I’m continuing to explore the ever-evolving world of AI-developer tools and how the craft of software development is changing in response. If you’ve not taken the plunge - picked up Copilot or tried coding with ChatGPT - I would encourage you to give it a go. These tools are here to stay and there is no better time to get started.

For now, ignore the [vibe coders](https://en.wikipedia.org/wiki/Vibe_coding), and the toolmaker claims of improved productivity. Put expectations to one side and simply treat it as a learning experience. I can guarantee that your initial experiences will be frustrating and confusing. The goal of this blog post is to give you some insight into why this journey is going to be challenging but also give you the reassurance that it is a journey worth taking.

![robot-tool.png](/uploads/robot-tool.jpg)

## Why AI Dev Tools Are Hard to Learn

These tools are tremendously powerful, but are surprisingly difficult to adopt, for a number of reasons, which I’ll delve into in some detail. But keeping it brief, the headlines are:

* **They have unclear capabilities** – their features and functions they perform are somewhat unclear. And worse still, their strengths and weaknesses are even more unclear.


* **They are an entirely new tool** - they are not simply a better version of a tool you are currently familiar which will certainly make them feel a little alien at first.

A direct impact of the second point is that adding this new tool to your toolkit will require you to make adjustments (some big and some small) to almost everything else you do. Ultimately, it will take time for you to find your new ‘flow state’.

## What is 'flow state’?

*Flow* is about finding the right way to wield the tools we have at our disposal (IDEs, debuggers, logging, compiler, web-inspector, unit tests, etc ...) to create a productive workflow. This often involves using a range of tools in pursuit of short iterations and rapid feedback. Although, our use of tools shifts based on the task (authoring new code, refactoring, debugging).

It’s interesting to watch what happens to a junior dev, or school student, when you introduce them to a fundamentally new tool which they have not experienced before, for example a debugger or web-inspector. You’ll observe their whole approach to software development change over time, as they find their new (and more productive) *flow* incorporating this new tool.

AI dev tools fit into this same category; they are not just a better version of something you are already familiar with. They are an entirely new tool, with some features that overlap with some of your existing tools but also adding a whole slew of entirely novel ones.

Learning a new tool can be hard, and takes time, but there is something about AI-powered dev tools that presents an additional challenge ...

## Unclear capabilities

Good tools have clear capabilities. To use them, you can skip reading the manual and get straight to business. They achieve this through a combination of familiar UI paradigms and conventions, carefully designed workflows and all manner of other things that I am not entirely qualified to describe! but I know it when I see it 😊

Gen-AI chat applications (e.g. ChatGPT), all share a couple of common problems which I’ve written about before:

* [The blinking cursor problem](https://blog.scottlogic.com/2025/02/21/ais-biggest-flaw-the-blinking-cursor-problem) - chat apps do nothing to reveal their capabilities, hiding behind a single empty input box. If you want to discover what they can do, it's on you to try things out and experiment. This isn’t how traditional user interfaces are designed.


* [LLMs don’t know what they don’t know](https://blog.scottlogic.com/2025/03/06/llms-dont-know-what-they-dont-know-and-thats-a-problem.html) - the above problem is exacerbated by the fact that GenAI chatbots are entirely unaware of their own limitations. They will willingly take on tasks that far exceed their capabilities.

The above are equally true for all the AI dev tools I have experienced.

![robot-shrug.jpg](/uploads/robot-shrug.jpg)

The leading tool in this field is GitHub Copilot (used by 41% of devs in a [2024 StackOverflow survey](https://survey.stackoverflow.co/2024/technology#most-popular-technologies-ai-search-dev)). Its very first release was simple and familiar, a more powerful autocomplete. Soon after, they added chat capability allowing you to prompt Copilot to make changes that are not so easy for it to pre-empt via autocomplete (e.g. refactoring tasks).

However, the current release of GitHub Copilot is much more complicated. From a features perspective, it has multiple modes (Ask, Edit, Agent) a model selector, chat participants, commands, variables and much more. And from a capabilities perspective, it can write code, fix bugs, explain code, write tests, drive the terminal and generate documentation.

This all sounds wonderful and you’d probably expect a tool that has such a breadth of features to have a moderately complicated interface. But the fundamental issues of GenAI make this tool very hard to navigate. Here are a few examples:

Ask, Edit and Agent are different modes. However, I can also ask questions in Edit mode, in Ask mode it happily suggests edits, and I honestly don’t know when an appropriate time would be to use Agent mode! This makes it very hard to understand which mode I should be in and when.

The model selector allows me to choose between 10 different models by default. I’m aware that there are all sorts of trade-offs between these models, for example some are fast and cheap, others are slower but might be better at reasoning. However, how do I map these model capabilities to the tasks I am trying to achieve? When do I need reasoning? When should I spend a bit more money on a task?!

The chat itself allows adds more vague features. For example, I can add a file into the context, however, in my experience Ask can answer questions relating to files that are not ‘in context’ and likewise Edit can suggest edits for non-context files. Checking the user manual it mentions that adding a file to the chat context means that the “AI model can provide more relevant code edits”, whatever that means. You can also start new chats whenever you want, which is something I assume is worthwhile when changing the topic of conversation. But again, what this achieves is unclear.

You can also use an inline chat, which is embedded directly into the code editor. According to the docs, the use case for this is “for situations where you want to ask Copilot about the code you're actively working on in the editor.”. However, the (ask, edit, agent) chat panel knows where your cursor is in the current file (if you have added it to the chat context) so appears to be able to do the same thing.

The above are just a few examples and are by no means unique to Copilot, in fact Cursor (the AI-first IDE), tends to go a step further, for example, allowing to add your own modes beyond the built in (Agent, Ask, and Manual). They are an artefact of the underlying limitations of GenAI.

The net result of the examples above, is that this tool isn’t all that easy to learn. In instances like this, we tend to (begrudgingly) turn to the user manual. However, in this case the manual itself uses vague language (e.g. adding a file to context means the “AI model can provide more relevant code edits”), by necessity.

The only way to learn how to use this tool is by experience ... and a lot of it!

You need to experiment with the various modes; try the different models to create your own intuition around what its capabilities are. You need to experiment with giving it small tasks, then gradually bigger tasks until it starts to fail. You need to experiment with different ways of driving this tool, code-first, or requirements (something I’ll cover later). All the while, you’ll start to build up a mental model of its capabilities and the types of tasks it can undertake.

But be warned, the mental model you have of its capabilities will never have a sharp focus. You can never be entirely sure whether it can or cannot perform a specific task.

And worse still, this is a fast-moving space, and your mental model will likely need to adapt as the tools and models develop!

While this probably sounds rather negative, I can guarantee that the effort you invest in creating this mental model (of the tool) will be worthwhile.

## Rediscovering your flow

Learning how to use these tools takes time and a lot of experimentation. However, over time, you will start to find a new flow state, where you are comfortable with the tool and have incorporated it into your own workflow, adjusting your use of the other tools at your disposal.

![confident-robot.jpg](/uploads/confident-robot.jpg)

I’ll briefly describe the way I am currently using AI dev tools, and what feels comfortable for me. However, I wholeheartedly expect others to find a different flow that works for them (just like some people love using git from the command line, while others prefer a GUI).

1. **Scoping** – the very first thing I do is decide the scope of the task I’m going to hand over to the AI tool(s). Personally, I feel that a typical class or module of a few hundred lines of code is a reasonable and manageable chunk.


2. **Specification** – my next step (typically using ChatGPT) is to create a specification for the module. I find it quicker and easier to spot logic errors or misunderstandings (between myself and the AI) before generating a significant body of code. It is worth noting that these AI models, despite being used to generate code, have been trained on a vast corpus of (non-code) knowledge, so will understand a wide range of domains and business concepts. However, I always find it is worth being explicit, e.g. rather than asking it to “calculate the tax on my earnings”, I’d ask ChatGPT how it would perform this task and to add it to the specification.


3. **Code generation** – once I have a specification I am happy with, this is added to the project as a markdown file. From there, I ask Copilot to implement this spec as a module.


4. **Test generation** – next I’ll ask it to create unit tests for the module. There is a subtle, yet important point, here – I don’t have any expectation that it will find bugs in its own code. Rather, the unit tests provide a way for me to evaluate the interface, via a set of scenarios. I use this to reassure myself that the interface is correct. Sometimes I also ask it to create a simple terminal app that exercises the module for the same reasons.


5. **Inspect and refactor** – finally I’ll inspect the generated code and then I might ask Copilot to make some cosmetic refactors.

As I said, the above seems to work for me – but [your mileage may vary.](https://dictionary.cambridge.org/dictionary/english/your-mileage-may-vary)

The important point here is not the steps I describe above, rather, that time I have personally invested in experimenting and experiencing these tools. I am still evolving this process, it still doesn’t feel entirely comfortable, and I have a long list of variations I’d like to try (for example, it feels wrong to switch between ChatGPT and Copilot). However, it is productive, and I can certainly write greenfield code faster using the above process than I would without these tools.

I’m yet to find the flow I like for tackling non-greenfield codebases.

## Advice for Individuals, Teams and Managers

Our world is changing around us, and the software industry is first in-line for disruption.

If you haven’t started using these tools yet, I’d very much encourage you to get started. And yes, they will be confusing – that's OK, I’ve been doing this for 25 years and they confuse me too. However, you will start to get a feel for them over time.

And if you are a manager of a development team, you should be investing in these tools, but just as importantly (vitaly!), you should be giving your team the time and space needed to build their own understanding and educate themselves.

I wish you all the best of luck!