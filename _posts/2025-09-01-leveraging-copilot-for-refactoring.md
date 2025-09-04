---
title: Leveraging co-pilot to refactor tests
date: 2025-04-09 15:34:00 Z
categories:
  - Testing
tags:
  - Automation
  - UI
  - Playwright
  - AI
summary: This blog explores best use practices for co-pilot and automation
author: mnyamunda
image: mnyamunda/assets/mnyamunda.jpg
---

# Problem

Sometimes automation is kept relatively light weight as there may be fewer scenarios than expected. In this case we can easily create a few positive and negative path scenarios to cover the little functionality that the application may have at the time. These tests are often just used for confidence to make sure that the application does not regress. At some point the team may now realise that there are more and more scenarios that need to be added to ensure functionlity of the application. This is when the team must adapt their test automation scripts to now cover those new scenarios and also ensure that they are easy and intuitive to update. There is also a certain threshold where the test suite should be updated to use a page object model, as tests will become very difficult to maintain otherwise.

The earlier this decision is made the better, as it may end up taking a very long time to refactor or update tests. On top of this, there may be work items constantly coming through, further changing existing automation script steps. This can become a potential nightmare.

# Solve

This is where github co-pilot comes in very handy. After creating various method and properties in page objects the rest of the work is mundane copy pasting. By utilising co-pilot within an IDE such as VsCode, testers can drastically reduce the time taken to complete heavy refactoring tasks. You may be wondering, what's so special about co-pilot, when I can achieve the same result with an online chatbot such as Claude or ChatGPT? The difference is that co-pilot will now be intergrated with you codebase giving it a higher level of context. Online chatbots often come short as they may not provide you with what you need unless you have also pasted other related files or snippets. This now saves alot of time aloowing you to reach solutions much faster.

## File context

If the conversion is quite simple. Then we can even apply this to multiple files at once. We can toggle the chat slide and add files/folders as context. Sometimes we don't the entire context of the project certain tasks. Ideally we want to use fewer resources/tokens. Which is where the "add context" option comes in handy. We can prompt something like "Apply this new page object to relevant e2e files". In this case as we have the page object model file open it is part of current context:

<!-- ![alt text](add-file-to-chat.png) -->

![conver to typescript prompt ]({{ site.baseurl }}/mnyamunda/assets/co-pilot-test/add-file-to-chat.png)

Now theoretically steps are: 1. Find relevant files, 2. Find relevant lines, 3. Refactor those lines.

If we instead point to the files/folders we can manually reduce the scope. Meaning that chances for mistakes are lower. Let's say now we know the exact files that we want to refactor:

<!-- ![alt text](file-context-chat.png) -->

![conver to typescript prompt ]({{ site.baseurl }}/mnyamunda/assets/co-pilot-test/file-context-chat.png)

Now we have greatly reduced the scope in which the LLM should work in.

# Usage example

This refactor to test suite is mainly due to how there are many new features being added to TCSE tool. starting with about 18 e2e scenarios these were originally quite extensive as locators and actions were all in one test. By converting into page objects it means that tests are super concise and intuitive.

In this example it has been used for 2 things: Converting from python to Typescript and optimising into page object model.

### Language conversion

Our first prompt is fairly simple: we can use both inline chatbot and a separate chatbot window. We can simply highlight the file with Ctrl + A, then bring up inline chatbot with Ctrl+I. We can then type a simple prompt:

![conver to typescript prompt ]({{ site.baseurl }}/mnyamunda/assets/co-pilot-test/conversion-prompt.png)

You can then sit back and watch the conversion. All you have to do it proof read the changes and accept if you are happy with them. This is very important as it's not always super accurate and it may at times missspell or ommit some punctuation in the new scripts.

Now we can see the typescript changes highlighted. It's good practice to go line by line and make sure that the script steps have been adequetley translated.

### Page object model conversion

Here we can simply ask to get started with a prompt:

<!-- ![alt text](prompt-po-fixtures.png) -->

![prompt for page object and fixtures ]({{ site.baseurl }}/mnyamunda/assets/co-pilot-test/prompt-po-fixtures.png)

Now it will generate some basic page objects and fixtures in the file and folder we have specified. As this is in chat bot we have to manually click to apply these new changes.

<!-- ![alt text](base-page-object.png) -->

![base page class example]({{ site.baseurl }}/mnyamunda/assets/co-pilot-test/base-page-object.png)

This is the same for the fixtures we have added. It will only generate the newly added or changed code. Another issue with existing test suite is that there were alot of reused lines. These were mainly element visibility checks. We solved this by adding our files as context and prompting "Identify repetitive code in these files and suggest a helper method". This instantly reduced the length of our tests.

The next step was to split TCSE into different sections as it is not a multipage application.
Here is a high level diagram showing how we separated it:

<!-- ![alt text](pom-diagram.png) -->

![Page object segmentation diagram ]({{ site.baseurl }}/mnyamunda/assets/co-pilot-test/pom-diagram.png)

At this point we can do a bit of manual work by matching locators in our tests to these page-objects.
Once we have all of our properties and methods in our page objects. We can add page-object files and e2e spec files as context. Our prompt can be: "Based on properties and methods within this page-object, refactor the attatched e2e spec files accordingly"

Now it should see matches between e2e and page-objects and begin to refactor your tests with newly shortened methods.

Example:
In our page object we have:

```
this.numberOfServers = page.getByLabel('Number of Servers:');
```

```
async selectNumberOfServers(text: string) {
    await this.numberOfServers.click();
    await this.numberOfServers.fill(text);
  }
```

In our e2e test we have tests that interact with that element:

```
await page.getByLabel('Number of Servers').click();
await page.getByLabel('Number of Servers').fill('20');
```

So co-pilot can see this match in actions performed which then gives us a final result of:

```
await onPremSection.selectNumberOfServers('20');
```

# Conclusion

Overall co-pilot is a very useful tool to use when doing time consuming tasks. It is super effient in a scenario where automation is to be updated and there are still work items to be tested. It also works super well if the context is a bit tighter. For example refactoring one e2e test at a time.
