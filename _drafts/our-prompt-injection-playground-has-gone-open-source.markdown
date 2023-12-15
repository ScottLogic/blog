---
title: Our prompt injection playground has gone open source!
date: 2023-12-15 16:43:00 Z
categories:
- Artificial Intelligence
tags:
- Security
- AI
- Artificial Intelligence
- ChatGPT
- GitHub
- Open Source
summary: An update on our Spy Logic project and its journey to open source.
author: gsproston
---

Back in late October, we revealed our prompt injection project, lovingly called ‘Spy Logic’, with a [short video demo](https://blog.scottlogic.com/2023/10/31/mitigating-prompt-injections.md.html) and an accompanying [blog post](https://blog.scottlogic.com/2023/11/03/spy-logic.html). Now, we’re happy to announce that the project has gone public! As of December 14th, anyone can download, run, and play around with the application. Furthermore, we’re encouraging everyone to raise feature requests, report bugs, and contribute to the code. Just head over to the [GitHub repository](https://github.com/ScottLogic/prompt-injection) to get started.

## What is Spy Logic?

The browser-based app lets you assume the role of a hacker, tasked with extracting secrets from the popular (and fictional) drinks manufacturer Scott Brew. Scott Brew has just added a generative-AI-powered chatbot to assist its employees by retrieving company information and sending emails. Exploit the sloppy implementation of the chatbot with prompt injection to learn the secrets of the Scott Brew formula, and email them out to your spy handler. But be warned! As you progress through the levels, security will be ramped up. Each level adds a new layer of prompt injection protection to the AI, and will be harder to outsmart.

[level 1.PNG](/uploads/level%201.PNG)

At any time, you can switch into ‘sandbox mode’. Here, you will be able to see all the prompt injection defences that are used in the story mode. Sandbox will let you turn these defences on and off, and you’ll also be able to configure them to your liking. Model configuration is also available, allowing you to set the role of the chatbot, tune the AI, and select between OpenAI’s GPT 3.5 and GPT 4, if available. This playground is a great space to make your own challenges. Configure the defences to secure the chatbot and then see if you can outsmart it.

[sandbox.PNG](/uploads/sandbox.PNG)

## What’s new?

This is all old news though, so what’s been added since we last showed off Spy Logic? Well we’ve been hard at work on giving the app a complete UI overhaul. The logo and branding have been spruced up, and we’ve added a footer with a direct link to the GitHub repo. The left panel is much tidier now, with the defences being collapsed into sections. Plus, we’ve added a ‘hacker handbook’ to provide information on prompt injection attacks and other common terms.

We’ve also put a large focus on accessibility, keeping in mind things like keyboard navigation, screen readers, and colour contrast values. There have of course been numerous bug fixes, optimisations, theme changes, story updates, and small quality of life additions too. Beyond all that, we’ve been prepping the project to go open source.

## Available to all

Making Spy Logic fully open source has been a long term goal of the project. Now, anyone can head on over to the [GitHub repository](https://github.com/ScottLogic/prompt-injection) and start contributing! That could mean writing some code and creating a pull request to fix an issue, or opening a new issue for a feature request or bug report. Even adding your thoughts to the discussion threads on open issues is very much appreciated.

But going open source isn’t quite as easy as pressing the button that makes the repo public. [Contributing](https://github.com/ScottLogic/prompt-injection/blob/dev/CONTRIBUTING.md) and [code of conduct](https://github.com/ScottLogic/prompt-injection/blob/dev/CODE_OF_CONDUCT.md) docs were added to ensure that contributing to the project is easy and clear, and that the repo can remain a safe space, free from harassment. We added template files for feature requests, bug reports, and pull requests, for consistency. The ever-expanding list of [existing issues](https://github.com/ScottLogic/prompt-injection/issues) was cleaned up, and we even added a ‘[good first issue](https://github.com/ScottLogic/prompt-injection/issues?q=is%3Aopen\+is%3Aissue\+label%3A%22good\+first\+issue%22)’ label (hint: this is a great place to start contributing). Choosing the right licence is super important too. We decided on the [MIT licence](https://github.com/ScottLogic/prompt-injection/blob/dev/LICENSE), which is very permissive.

## Over to you

And that’s the latest on the Spy Logic project! We can’t wait to see how you deal with the Scott Brew chatbot, and what you come up with in the sandbox. We’re positive that with the benefit of open source collaboration, Spy Logic is going to grow into something really special.