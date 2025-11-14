---
title: Leveraging Copilot to rapidly refactor test automation
date: 2025-09-10 00:00:00 Z
categories:
- Testing
tags:
- Automation
- UI
- Playwright
- AI
summary: This blog explores how to best use GitHub Copilot to swiftly refactor existing
  test automation
author: mnyamunda
image: mnyamunda/assets/mnyamunda.jpg
---

# The Problem

Sometimes automation is kept relatively lightweight as there may be very few flows to automate. At this point very few positive and negative path scenarios are created to give quick confidence in regression. At some point the team may now realise that there are more and more scenarios that need to be added to ensure functionality of the application. This is when the team must adapt their test automation scripts to now cover those new scenarios and also ensure that they are easy and intuitive to update. There is also a certain threshold where the test suite should be updated to use a page object model, as tests will become very difficult to maintain otherwise.

The earlier this decision is made the better, as it may end up taking a very long time to refactor or update tests. Another issue is also having to keep up with important features that may urgently need to be tested. This can become a nightmare scenario.

In our case with TCSE estimator there were seventeen e2e scenarios that needed a refactor. Our first pivot would be converting them from python syntax to node.js. This decision made sense as the application itself was using the same environment, which meant that when we eventually setup our GitHub actions we only need to setup that single environment. Our second pivot was to refactor existing tests into page object model. This decision was made as we could see many existing areas to automate, as well as features that would be added in the future.

# The Solution

This is where GitHub Copilot comes in very handy. After creating various methods and properties in page objects the rest of the work is often mundane copying and pasting in our seventeen e2e files. By utilising Copilot within an IDE such as VSCode, testers can drastically reduce the time taken to complete heavy refactoring tasks. You may be wondering, what's so special about Copilot when I can achieve the same result with an online chatbot such as Claude or ChatGPT? The difference is that Copilot will now be integrated with your codebase, giving it a very high level of project context. Online chatbots often come short as they may not provide you with what you need unless you have also pasted other related files or snippets. Copilot intergrated with VSCode will now save you a lot of time as it will have good context of your project. This means that you are likely to get to your solution much faster without having to re-prompt or add more snippets/files into an online chatbot instance.

## Narrowing Context

If the conversion is simple, then we can even apply this to multiple files at once. We can toggle the chat slide and add files/folders as context. Sometimes we don't know the entire context of the project certain tasks. Ideally we want to use fewer resources/tokens, which is where the "add context" option comes in handy. We can prompt something like "Apply this new page object to relevant e2e files". By default files we have open will be included in context.

In practice the steps are:

1. Find relevant files to edit.
2. Find relevant lines to edit.
3. Refactor lines with applicable methods or properties from our page object class.

If we instead point to our relevant test and page object files/folders we can manually reduce the scope. Meaning that chances for mistakes are much lower. Let's say now we know the exact files that we want to refactor:

![convert to typescript prompt ]({{ site.baseurl }}/mnyamunda/assets/copilot-test/add-file-to-chat.png)

![convert to typescript prompt ]({{ site.baseurl }}/mnyamunda/assets/copilot-test/file-context-chat.png)

Now we have greatly reduced the scope of this refactor. Something worth mentioning is that you are essentially training the model on how you want to refactor these tests. At first it may make some small mistakes but by narrowing context or scope appropriately it becomes very good at completing repetitive tasks.

### Auto Completion

Copilot also comes with an autocomplete feature, which can predict your next lines based on previous actions. This is an absolute godsend when it comes to class construction as you can circumvent more copying and pasting!

![Auto completion example ]({{ site.baseurl }}/mnyamunda/assets/copilot-test/auto-completion-example.png)

# Usage examples

In this project we have refactored in 2 ways: Converting from Python to Typescript and optimising into page object model.

## Language Conversion

Our first prompt is simple: we can use both inline chatbot and a separate chatbot window. We can simply highlight our target, then bring up inline chatbot with Ctrl+I. We can then type a simple prompt:

![convert to typescript prompt ]({{ site.baseurl }}/mnyamunda/assets/copilot-test/conversion-prompt.png)

You can then sit back and watch the magic. All you have to do is proof read and accept changes if you are happy with them. This is very important as it's not always super accurate and it may at times misspell or omit some punctuation for example.

## Page Object Model Conversion

We can get started with a prompt to setup our page objects and feature templates:

![prompt for page object and fixtures ]({{ site.baseurl }}/mnyamunda/assets/copilot-test/prompt-po-fixtures.png)

Now it will generate some basic page objects and fixtures in the file and folder we have specified. If we prompt from the chatbot it will generate code there, then it's up to us to allow the creation of these files in the codebase.

![base page class example]({{ site.baseurl }}/mnyamunda/assets/copilot-test/base-page-object.png)

Another issue with existing test suite is that there were a lot of reused lines. These were mainly element visibility checks. We solved this by adding our files as context and prompting "Identify repetitive code in these files and suggest a helper method". This instantly reduced the length of our tests. It highlighted which steps are commonly used which will aid in our page object model methods later.

The next step was to split TCSE into different sections as it is not a multipage application.
Here is a high level diagram showing how we split the page into section objects:

![Page object segmentation diagram ]({{ site.baseurl }}/mnyamunda/assets/copilot-test/pom-sections.png)

At this point we can do a bit of manual work by matching locators in our tests to these page objects.
Once we have all of our properties and methods in our page objects. We can add page object files and e2e spec files as context. Our prompt can be: "Based on properties and methods within this page object, refactor the attached e2e spec files accordingly"

Now it should see matches between e2e and page objects and begin to refactor your tests with newly shortened methods.

Example:
In our page object we have:

~~~
this.numberOfServers = page.getByLabel('Number of Servers:');
~~~

~~~
async selectNumberOfServers(text: string) {
    await this.numberOfServers.click();
    await this.numberOfServers.fill(text);
  }
~~~

In our e2e tests we have tests that interact with that same element:

~~~
await page.getByLabel('Number of Servers').click();
await page.getByLabel('Number of Servers').fill('20');
~~~

So Copilot can see this match in actions performed which then gives us a final result of:

~~~
await onPremSection.selectNumberOfServers('20');
~~~

# Conclusion

Copilot is a very useful tool for time consuming tasks. It is super efficient in a scenario where automation needs to be updated and there are still work items to be tested. I have found that it works super well if the context is a bit tighter. For example refactoring one e2e test at a time. I originally attempted to refactor all 17 tests in one, and noticed that there were more mistakes. Something to also reiterate is that it knows the context of your codebase but not necessarily the task you are carrying out at the time. So I found that being super explicit in what you aim to achieve through prompts makes it perform much better overall. For example "Refactor these files accordingly" vs "I have extracted properties and methods into these page objects, refactor the attached e2e spec files accordingly"
