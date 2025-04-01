---
title: Making Sense of the AI Developer Tools Ecosystem
date: 2025-04-01 14:56:00 Z
categories:
- Artificial Intelligence
summary: 'The AI developer tooling landscape has rapidly expanded from simple autocomplete
  to a complex ecosystem of assistants, agents, and AI-first environments. In this
  post, I propose a practical classification based on how AI is positioned within
  your workflow—from "arm’s length" tools like ChatGPT to fully "AI-first" environments
  like Cursor. '
author: ceberhardt
image: "/uploads/ai-tool-landscape.png"
---

In just a few short years, the AI tooling landscape for developers has evolved from a novel autocomplete plugin to a vast and often overwhelming ecosystem of intelligent assistants, autonomous agents, and AI-first environments. This post traces the arc from early autocomplete tools like GitHub Copilot to the emergence of AI-powered IDEs, rapid prototyping platforms, and fully agentic systems. 

In my attempt to understand the growing landscape, rather than grouping tools by surface-level functionality, I group based on how AI is positioned within your workflow: from "AI at arm’s length" (e.g. ChatGPT), to "Integrated AI" (Copilot), "AI-first" environments (Cursor, Replit), and "Task-focused AI" for specific use cases like rapid prototyping.  

## Introduction

The release of GitHub Copilot, just over three years ago, feels like a whole world away. This nascent tool provided an improved and impressive autocomplete capability, and I was [lucky enough to gain preview access](https://blog.scottlogic.com/2021/07/03/github-copilot-first-thoughts.html). In my blog post where I shared my experiences, I concluded that: 

> My feeling is this tool isn’t something that is going to revolutionise programming just yet, but [...] I firmly believe it will have a significant and game-changing impact in the future. 

And here we are, just three years later, and it does look like AI is indeed changing the game. With [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding), developer jobs in decline and [AI-powered software engineers](https://cognition.ai/blog/introducing-devin), it is hard to ignore the impact that AI is seemingly having. Emphasis on “seemingly”, we are at peak hype. 

This blog post isn’t going to focus on the more existential impacts that AI may (or may not) have on our industry. Instead, I’m going to take a practical look at the tools themselves and how they are evolving. 

I firmly believe that these tools can add genuine value to a wide range of software engineering tasks, and that it is worthwhile exploring and adopting some of them. However, these tools are rapidly increasing in capability, breadth and number. This blog is intended to give you a starting point for a more detailed exploration. 

Here’s a high-level timeline of some of the more notable AI developer tools and trends: 

![ai-tool-landscape.png](/uploads/ai-tool-landscape.png)

The value these tools deliver, which could crudely be measured as the amount of code they generate, has been increasing over time – from the early tools which generated, via autocomplete, 10s of lines of code, to rapid prototyping and agentic AI tools which generate 100s (or even 1000s) of lines of code in a single go. 

Here’s a high-level review of the various types of tool, their capabilities, strengths and weaknesses. 

## Autocomplete (and chat) 

The first tool that really showcased the power of Generative AI for writing code was GitHub Copilot, which was released in late 2021. Autocomplete is something we’ve had available to us via IDEs (e.g. VS Code, IntelliJ) for many years. The basic concept is simple, the editor uses the compiler (or interpreter) to complete variable, function names or signatures, saving precious keystrokes and time. With Copilot, the interface is the same, a form of autocomplete, but rather than just completing a handful of characters, it can generate significant chunks of code.  

![copilot-autocomplete.gif](/uploads/copilot-autocomplete.gif)

The productivity boost provided by Copilot can be significant, but it is not without its risks, the tools make no guarantees about the correctness or quality of the code it generates. 

Copilot isn’t the only AI autocompletion tool. Companies like Tabnine and Sourcegraph (Cody) have similar products, with additional enterprise features, for example custom models trained on your own codebase, and integration with a broader range of IDEs. Amazon have also released Q, which has deeper integration with their own AWS services. 

The capability of Copilot, and its peers, has also grown over the past few years. Most of them now support some form of chat functionality, which allows you to undertake tasks that don’t quite follow an autocompletion workflow, refactoring for example. They also allow you to ask questions, for example “how does authentication work in this application?”, which is a great way to familiarise yourself with and navigate a codebase. 

Finally, Copilot is further evolving the interface, with the recent release of [Copilot Edits](https://code.visualstudio.com/blogs/2024/11/12/introducing-copilot-edits), which makes it easier to work across and scope changes to multiple files. 

GitHub Copilot is the most widely used AI tool according to both the [StackOverflow Developer Survey 2024](https://survey.stackoverflow.co/2024/technology#3-ai-search-and-developer-tools) and [Pragmatic Engineer 2024 Survey](https://newsletter.pragmaticengineer.com/p/ai-tooling-2024), however, both surveys found that more developers are using ChatGPT for writing code. 

## ChatGPT (Claude, DeepSeek ...) 

Before diving into the more sophisticated AI developer tools, it is worth pointing out that the general-purpose AI tools like ChatGPT are also highly capable when it comes to writing code, as well as reading, explaining and debugging. And as of last year, this is still the most popular AI tool amongst developers. This seems quite surprising considering the lack of integration into the developer workflow – you must copy and paste code from your IDE into the chat then back again. Perhaps some developers like this interaction as it tends to limit how much they will rely on AI to write their code, restricting its input to smaller more focussed tasks. 

Iterating on a coding task can feel a bit cumbersome with ChatGPT, although this has improved recently with the [release of Canvas](https://openai.com/index/introducing-canvas/) just six months ago. Canvas provides an interface with your code in one pane, and conversation in the other:

![chatgpt-canvas.png](/uploads/chatgpt-canvas.png) 

It also has some limited capability to execute code, depending on language and environment.  

The various other AI chatbots have similar features, e.g. Claude Artifacts. 

## AI-powered IDEs 

Cursor is a fork of VSCode that was released just over a year ago. Whereas GitHub Copilot presents itself as an extension, an add-on to your IDE, Cursor places the AI capabilities front-and centre. You are very much encouraged to embrace AI for all your tasks, including generation of commit messages, driving your terminal, codebase analysis, autocomplete and the creation of entire applications. 

![cursor.webp](/uploads/cursor.webp)

There are a growing number of Cursor competitors, including Cline (which is open source), and Windsurf. Notably Replit, which has an online IDE that supports an impressive range of languages and frameworks, have launched Replit Agent, which again puts AI front-and-centre. 

An interesting feature of Cursor are Rules, which are model prompts that can be used to customise the overall behaviour of the IDE. You can use these to encourage Cursor to adopt a specific coding style or adapt to a specific type of framework. As an example, here is an excerpt of a custom rule for Angular development: 

~~~
[...]
- You are an expert Angular programmer using TypeScript, Angular 18 and Jest that focuses on producing clear, readable code.
- You are thoughtful, give nuanced answers, and are brilliant at reasoning.
- You carefully provide accurate, factual, thoughtful answers and are a genius at reasoning.
- Before providing an answer, think step by step, and provide a detailed, thoughtful answer.
- If you need more information, ask for it.
- Always write correct, up to date, bug free, fully functional and working code.
- Focus on performance, readability, and maintainability.
- Before providing an answer, double check your work.
[...]
~~~

(from the [Awesome Cursor Rules](https://github.com/PatrickJS/awesome-cursorrules) project on GitHub) 

Yes, it does seem weird that people are prompting this tool to “Always write correct, up to date, bug free, fully functional and working code” 

I am a little sceptical of the value of these AI-first IDEs.  While AI is still somewhat unreliable, my personal preference would be to moderate just how much I use this technology. Furthermore, while AI excels at writing code, it doesn’t perform well at the more nuanced task of engineering, i.e. creating quality, reliable and maintainable code. However, it hasn’t stopped Cursor gathering quite a following, and as the underlying models improve, these tools will immediately benefit.  

One notable tool that I have placed in this category is [Aider](https://aider.chat/), which provides an entirely terminal-based user experience. I have included it in the IDE category because it has fundamentally the same goal, integrating code generation, chat, mapping of codebases, git and more into a single tool. 

## Rapid Prototyping 

One of the first examples I saw of UI prototyping with LLMs was [shared on Twitter five years ago](https://x.com/sharifshameem/status/1284095222939451393), before Copilot was released: 

![debuild.png](/uploads/debuild.png)

What looks like an incredibly clunky demo by today’s standards caused a lot of interest and [scepticism](https://news.ycombinator.com/item?id=23821411). Today’s tools (v0, Bolt, and more recently Lovable), are much more powerful, allowing you to create applications of modest complexity in the space of an hour or two.  

Here’s a functional clone of the [New York Times Connections](/uploads/connections.png) game I created in less than an hour: 

!(https://www.nytimes.com/games/connections)[connections.png]

While I have described these as rapid prototyping tools, it is important to note that they are not just visual prototypes, in the example above, they are more than capable of implementing the simple game logic. In this case, I am confident you could create a production-quality version of the game entirely within these tools, they include a fully-featured editor – giving you the ability to interact directly with code. 

And regarding the code itself, I have found it to be well structured and clean, however, it isn’t perfect. They do have a habit of duplicating code; refactoring isn’t a consideration.  

I wouldn’t hesitate to use these tools for creating prototypes. As well as conversational prompting you can drop in detailed specifications and screenshots, further accelerating he process. Although at times they do get stuck, ending up with a complication error they cannot resolve or a feature that they struggle to implement. 

## Agents 

Finally, we get to the most advanced of AI tools, the Agent. The goal of these tools is to take on significant tasks on our behalf, for example, fixing a bug, or taking a ticket from the backlog. Their goal is to replace (some of) us. 

Devin is probably the most well-known AI agent, thanks to lots of media coverage, fuelled by a [$2bn valuation](https://www.maginative.com/article/cognition-ai-raises-175m-at-2b-valuation-one-month-after-series-a/). Devin is an entirely autonomous agent, that you interact with via a chat interface which should make it feel like any other member of your software development team. Unfortunately, their initial release, which showed Devin completing a freelance software task on a Upwork [somewhat exaggerated the capabilities of the tool](https://www.youtube.com/watch?v=tNmgmwEtoWE), and subsequent reviews have been somewhat mixed. 

I share the same concerns here as I do with AI IDEs, to quote my earlier sentence “While AI is still somewhat unreliable, my personal preference would be to moderate just how much I use this technology.” 

But once again, AI capability is growing at an incredible rate. 

Another tool that describes itself as “agentic” is GitHub Copilot Workspaces, although it is a very different proposition to Devin. Workspaces can also pick up sizeable tasks, but rather than taking it away and working on it in isolation, it follows a collaborative workflow of brainstorming, task generation then execution. You can also iterate and refine each step. Despite the size of the tasks it can undertake, you get the feeling of being in control. I’ve tried it out a few times and am very impressed. 

Finally, GitHub have announced the preview of [Copilot Agent Mode](https://github.blog/news-insights/product-news/github-copilot-the-agent-awakens/), where it can perform multiple iterations on a task until it is complete. 

## Conclusions 

The AI developer tools are evolving at a pace that equals that of the pace of the underlying model development – fast, very fast! 

While the various types of tools look quite different on the surface, they have broadly similar features (multi-file support, chat, autocomplete). I think the bigger difference is how AI is positioned. With that in mind I’d broadly describe these tools as: 

 - **AI at "arm's length"** – the use of general purpose chatbots, such as ChatGPT, for helping you write, understand and debug code. 
 - **Integrated AI** – providing similar capability to ChatGPT, but directly integrated into the IDE, removing the need for copy / paste and the ability to autocomplete 
 - **AI first** – such as Cursor, where you are encouraged to lean on AI for almost every task, with agents at the most extreme end of this  
 - **Task-focussed AI tools** – and finally, the rapid prototyping tools, which have been designed for a specific use case 

It can be confusing to understand which tools to adopt (none of them? All of them?) But given the above, I think the first step is to determine where you want to position AI within your workflow.  

Personally, I prefer the integrated AI approach, I want to be able to rapidly interact with AI but ultimately want to be in control ... for now. 

Finally, if you're interested in a more detailed review of the features and functions of these tools, I've created an [Awesome List on GitHub](https://github.com/ColinEberhardt/awesome-ai-developer-tools).