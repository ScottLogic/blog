---
title: Playwright Visual Testing; How Should Things Look?
date: 2025-02-12 11:25:00 Z
categories:
  - Testing
tags:
  - Automation
  - UI
  - Playwright
summary: This blog explores best use practices for co-pilot and automation
author: mnyamunda
image: mnyamunda/assets/mnyamunda.jpg
---

# Problem

Sometimes automation is kept relatively light weight as there may be fewer scenarios than expected. In this case we can easily create a few postitive and negative path scenarios to cover the little functionality that the application may have. These tests are often just used for confidence to make sure that the application does not regress. At some point the team may now realise that there are more and more scenarios that need to be added to ensure functionlity of the application. This is when the team must adapt their test automation scripts to now cover those new scenarios and also ensure that they are easy and intuitive to update. The earlier this decision is made the better, as it may end up taking a very long time to refactor tests. On top of this, there may be work items constantly coming through, further changing existing automation script. This can become a potential nightmare.

# Solve

This is where github co-pilot is of great help. Most refactory work is quite mundane copying and pasting into different test files. By utilising co-pilot within an IDE such as VsCode. It can hasten the time taken to complete heavy refactoring tasks or tech debt. You may be asking wondering, what makes co-pilot different? When I can just paste into an online chatbot such as Claude or chatGPT? The difference is higher level of context. Online chatbots often come short as they may not provide you with what you need unless you have also pasted other related files.

Co-Pilot essentially has knowledge of you codebas, thus giving it wider context of your project compared to online an chatbot. This embedded version of co-pilot is essentially able to save you the hassle of copying and pasting files for better context. This makes it especially useful for refactors, as you can specifically add files as context.

# Usage example

In this example it has been used for 2 things: Converting to Typescript and optimising into page object model.
Our first prompt is fairy simple: we can use both inline chatbot and a separate chatbot window. We can simply highlight the file with Ctrl + A, then bring up inline chatbot with Ctrl+I. We can then type a simple prompt:

![conver to typescript prompt ]({{ site.baseurl }}/mnyamunda/assets/co-pilot-test/conversion-prompt.png)

You can then sit back and watch the conversion. All you have to do it proof read the changes and accept if you are happy with them. This is very important as it's not always super accurate and it may at times missspell or ommit some punctuation in the new scripts.

![alt text](image.png)

Now we can see the typescript changes highlighted. It's good practice to go line by line and make sure that the script steps have been adequetley translated.

## File context

If the conversion is quite simple. Then we can even apply this to multiple files at once. We can toggle the chat slide and add files/folders as context. Sometimes we don't the entire context of the project certain tasks. Ideally we want to use fewer resources/tokens. Which is where the "add context" option comes in handy.

Conversion to node.js, typescript.

- Efficiency for setting up environments. No longer have to setup python stuff.

# How to solve?

- python conversion (very easy) medium time consumption
- Helper methods ( fairly easy ) High time consumption
- POM Easy, (Very time consuming)
