---
title: What I’ve learned over 3 years of writing code
date: 2026-01-20 10:00:00 Z
categories:
- People
tags:
- software engineering
summary: What has three years of writing code taught me?
author: dhinrichs
image: "/uploads/Doro-Hinrichs-blog.jpg"
---

# Three years of writing code
At the beginning of 2023 I kick-started my career in tech with Scott Logic’s graduate program. It’s been an incredible journey and three years later I wanted to reflect and share some of the lessons I’ve learned.

## Names
Solid naming conventions make a huge difference. A branch named “ticket-42-add-intergalactic-microservice” is far better than simply “42”. A commit message “ticket 42: added controller” is easier to work with than “made changes”. 

And when you work with users, product owners, testers, and other teams, making sure that we all know that we are talking about the same thing becomes absolutely necessary for making progress. Consistency is vital, and I wouldn’t shy away from adding definitions into the README or add an intranet page explaining the terminology different teams use. At the end of the day it doesn’t matter if we call it a spaceship_id, ship-key, or transportIdentifier, as long as we use whichever naming styles and naming conventions we pick consistently in our  code and conversations.

Speaking of conversations – let’s talk about people next.

## People
When I first started to learn coding someone told me: “In software development, all problems that aren’t maths problems are people problems”. After three years I think I’m starting to get an idea of what they meant.

The best developers I know are not just technically excellent, but also know how to talk to colleagues and stakeholders alike with kindness and clarity. They know how to explain complicated processes in simple terms, they don’t overuse jargon just for the sake of it, and most importantly: They take ego out of the equation. If they mess up, they don’t try to brush it under the carpet hoping that no one will notice, they own their mistakes and fix them as soon as possible. For more junior staff it makes a big difference to see your seniors and leads model this kind of growth-mindset; it creates a safe culture for learning and making progress fast.

## The myth of “fixing it later”
On the topic of making progress fast: It’s usually better to take a few more hours to do something right the first time than to rush a PR merge with hard-coded mock data without tests and saying ‘we’ll fix it later’. It builds up tech debt that just gets worse with every consecutive commit. Later we’ll be busy building the next feature. Later we’ll be dealing with a bug. Later doesn’t exist. Let’s fix it now. 

That being said: Sometimes you do need to pivot and take a ticket that has scope-crept into an entire epic and break it up into smaller tasks. Just make sure you do those small tasks right the first time.

## Coding with style
As I’m writing this blog post, my text editor autocorrects small mistakes and shows me a red squiggly line to tell me that “devs” is not a real word. Did you know that code editors can do the same thing for code quality, formatting, indentation, naming conventions and more? Incredible! Which is why I am flabbergasted on the rare occasion that I come across a codebase that clearly doesn’t use them. 

I could tell you about cognitive load and how a visually clear structure reduces it, or about the effort of reviewing a PR with multiple typos in it, but I think you already get the point. 

It takes a small effort to add the correct settings and configurations to your IDE/pipeline checks, but it will save you a huge amount of energy and time in the long run. 

It really doesn’t matter how many indentations you like, or where you put your curly brackets, but make it consistent. And: Tell your AI companion about your preferences.
On that note:

## I, for one, welcome our new AI overlords
Yes, they might take my job. But until they do I’ll enjoy the benefits of coding with AI tools. My enjoyment of writing unit tests has increased by at least 50% since I can tell AI “write the same test but now check what happens if the warp core fails” and within a few seconds I have another edge case covered. And, to highlight the importance of naming things well one more time: AI can also give me great alternatives for testCaseNamesThatGetABitTooLongToReadFluently_Returns413.

Reviewing code is also easier with AI - more than once has a quick AI check spotted a logic error, or offered a different implementation with better performance. 

The necessary caveat: AI does make mistakes. Even with plenty of context, it often defaults to ‘standard’ answers that won’t work for your project. When you use AI tools in your development, you are still responsible for every line of code you commit so make sure to double check everything.  

## TLDR
- Names (and naming conventions) hold great power
- Use your words with kindness and clarity
- Own your mistakes
- Do it right the first time
- Use the tools available to you (including AI, with caution) to make your life easier and your code better. 

That’s a wrap for 3 years of coding.

I can't wait to see what the next few years will teach me.
