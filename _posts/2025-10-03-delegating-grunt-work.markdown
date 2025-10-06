---
title: "Delegating the Grunt Work: AI Agents for UI Test Development"
categories:
- Artificial Intelligence
summary: UI automation testing is valuable but time-consuming, with on-going maintenance resulting from fragile selectors, asynchronous behaviors, and complex test paths. This blog post explores whether we can release ourselves from this burden by delegating it to an AI coding agent.
date: 2025-10-06 08:00:00 Z
author: ceberhardt
image: ceberhardt/assets/agents/claude-todomvc-manual.png"
---

UI automation testing is valuable but time-consuming, with on-going maintenance resulting from fragile selectors, asynchronous behaviors, and complex test paths. This blog post explores whether we can release ourselves from this burden by delegating it to an AI coding agent.

## Introduction

This year has seen something of an evolution, from tools that augment developers (i.e. the copilot model), towards AI agents that tackle complex tasks with autonomy. While there is much debate around a [suitable definition for "AI agent"](https://simonwillison.net/2025/Sep/18/agents/) -a broad term to describe the application of AI across many different domains- for the purposes of this post, my definition is as follows:

> An AI Coding Agent is an LLM-based tool that, given a goal, will iteratively write code, build, test and evaluate, until it has determined the goal has been reached. It has access to tools (web search, file system, compiler, terminal etc.) and an environment that support this task. 

While the above definition might make it sounds like we now have 'digital software engineers', the truth is that their capabilities are quite 'jagged', a term that is often used to describe the unexpected strengths and surprising weaknesses of AI systems. 

To find success with both AI agents and Copilot-style tools you have to learn the types of task that are appropriate for each, and the best way to provide them with suitable instructions (and context). With agents, the prize is big; if you can effectively describe a relatively complex test, which the agent can undertake in the background, you can get on with something else instead while it works away.

## UI Automation testing

I have always had a love-hate relationship with UI automation tests. I certainly appreciate their value, in that a comprehensive suite of tests allow you to fully exercise an application in much the same way that a user would. However, in my experience, creating these tests requires a significant time investment, perhaps as much as 10-20% of the overall development time. This is due to a variety of facts including UI layer volatility, fragile element selectors, asynchronous and unpredictable behaviours and the simple fact that these tests exercise 'long' paths.

Taking a step back, UI automation tests have a clear specification (often using Gherkin), a well defined target (the UI, typically encocded in HTML or React) and a clear goal (run them without error).

This feels like a perfect task for an AI Agent!

## TodoMVC

TodoMVC is an open source project that allows you to compare UI frameworks by implementing the same application (a todo list) in each. I [contributed a Google Web Toolkit (GWT) implementation](https://blog.scottlogic.com/2012/03/12/developing-a-gwt-todomvc-application.html) to this project 13 years ago! When I noticed that the reviewers were manually testing each contribution, my [next contribution was an automated test suite](https://github.com/tastejs/todomvc/pull/791) that automatically tested all 16 implementations in one go.

This feels like a good candidate for using an Agent. Could I use an AI Agent to undertake the chore of writing the automation tests, leaving me to just write the specification?

## Behaviour Driver Development (BDD)

In order to give the agent a specification, I adopted the popular Gherkin syntax. Here's an excerpt from one of the feature files:

~~~
Feature: Adding New Todos
  As a user
  I want to add new todo items
  So that I can keep track of things I need to do

  Background:
    Given I open the TodoMVC application

  Scenario: Add todo items
    When I add a todo "buy some cheese"
    Then I should see 1 todo item
    And the todo should be "buy some cheese"
    When I add a todo "feed the cat"
    Then I should see 2 todo items
    And the todos should be "buy some cheese" and "feed the cat"

  Scenario: Clear input field after adding item
    When I add a todo "buy some cheese"
    Then the input field should be empty
~~~

I created a total of 8 feature files, [which you can see on GitHub](https://github.com/ColinEberhardt/todomvc/tree/ui-automation-testing/features). 

## Over to the Agent ...

For this experiment I'm using GitHub Copilot in Agent Mode, using Claude Sonnet 4.0 - although I am sure you'd get similar results with other agentic tools.

I provided the following instruction to the agent:

> I would like you to create an automated test suite for this application, specifically the #file:jquery example, using the BDD test suite from the #file:features folder. Please create the tests in the #file:features folder, step files etc, using the latest frameworks and technologies.

As you can see, the instruction was quite concise, but I was careful to be specific about a few aspects - for example, where I wanted it to add the tests within my project.

Given the above, the agent churned away for around a minute. It initially researched the codebase, reading all the feature files and the application logic, it then went ahead and created a typical test infrastructure; installing cuccumber and playwright, creating step definitions and support files.

Interestingly when it had completed this task it didn't execute the entire suite, instead it started with just one feature file - much as a human being would.

This is where it got really interesting ... on the first attempt, nothing worked, the element that the tests were waiting for in the DOM to signal that the app is ready wasn't appearing. A quick look at the implementation, and this was easily fixed. Next iteration, 23 of the 29 tests in that feature file worked. Again, the agent iterated. It soon found the problem:

> I see the issue! The clear completed button is conditionally rendered based on completedTodos which is todoCount - activeTodoCount. When there are no completed todos, the button doesn't exist in the DOM at all. This means my isVisible() check should be looking for element existence rather than visibility.

Finally it hit against a more gnarly issue that it couldn't fix from just inspecting the implementation. In order to tackle this it created a 'debug' feature file, with logging, in order to inspect the runtime behaviour of the app. Armed with this information, a few iterations later, all the problems were fixed.

It was fascinating watching this tool hit against the same frustrating and niggly issues I've experienced in the past, using similar debugging techniques to the ones I would have employed myself. 

Within a minute, I had a complete implementation.

The agent seemed rather proud of itself:

~~~
🎉 Complete Success!
I have successfully created a comprehensive automated test suite for the TodoMVC jQuery
example using modern BDD (Behavior-Driven Development) practices. Here's what was
accomplished:

✅ What I Built
 - Complete BDD test suite using Cucumber.js + Playwright
 - 29 test scenarios covering all 8 major TodoMVC features
 - 180 individual test steps with 100% pass rate
 - Production-ready infrastructure with proper error handling, screenshots, and
   reporting
~~~

You can see the [full test suite on GitHub](https://github.com/ColinEberhardt/todomvc/tree/ui-automation-testing/features), 611 lines of code in total.

I briefly experimented with changing the UI (changing CSS classes, DOM structure), and the AI Agent swiftly made the required updates to the test implementation.

## To BDD, or not to BDD?

My first inclination was to use Gherkin to specify the tests, mostly out of habit. A goal of this approach is to make the tests human readable and ideally something that non-technical team members can written and maintain. A worthwhile goal, however, their syntax is somewhat rigid. I doubt anyone other that a software tester of engineer could realistically maintain them.

Let's see if the Agent is happy with a more informal specification.

I re-wrote the 9 features files using a more informal language. Here's an example:

~~~
# Adding New Todos - UI Tests

## Overview
These tests verify that users can successfully add new todo items
 to their list and that the interface behaves correctly when items
  are added.

## Test Setup
- Open the TodoMVC application in a browser
- Ensure the application starts with an empty todo list

## Test Cases

### 1. Basic Todo Addition
**What we're testing:** Users can add multiple todo items

**Steps:**
1. Type "buy some cheese" in the input field and press Enter
2. Verify that exactly 1 todo item appears in the list
3. Check that the todo text shows "buy some cheese"
4. Type "feed the cat" in the input field and press Enter  
5. Verify that exactly 2 todo items are now visible
6. Check that both todos display correctly: "buy some cheese" and
   "feed the cat"

**Expected result:** Both items should be visible and display the]
correct text
~~~

And once again instructed the agent:

> I would like you to create an automated test suite for this application, specifically the #file:jquery  example, using the test suite from the #file:ui-tests  folder. Please create the tests in the #file:ui-tests  folder, step files etc, using the latest frameworks and technologies.

This time the agent opted for Playwright with TypeScript, which was fine with me. I could have directed it to use specific frameworks or technologies if needed, but for this experiment I wasn't fussed.

Again the agent went through a few iterations, resolving various niggles, until it had a fully functional tests suite with all tests passing.

## Do you need a test suite at all?

As a final experiment I thought I'd see whether an Agent could just run the tests directly, via browser automation.

This time I opted for [Claude Code](https://www.claude.com/product/claude-code), installed a Playwright MCP server, pointed it at the test scripts and asked it to execute them.

... and the first thing it did was write a test script!

<img src="{{ site.baseurl }}/ceberhardt/assets/agents/claude-todomvc-script.png"/>

Clever agent! 😊

With a little more prompting I did manage to get it to execute the test directly, using the MCP server: 

<img src="{{ site.baseurl }}/ceberhardt/assets/agents/claude-todomvc-manual.png"/>

While this was a fun experiment, it isn't an approach I'd recommend. It is relatively slow (and costly), when compared to executing a script. Also, it isn't deterministic, there is every likelihood it will approach tests in a different way eac time it is executed, leading to fragility once again.

## Summary

I'm really excited about the prospect of AI Coding Agents, and their ability to tackle complex and time consuming tasks. Although, finding tasks that are suitable for hand-off isn't easy. The implementation of UI automation tests, which have a detailed specification, and a clear goal, feel like a task that is very well suited to agents. 

With TodoMVC the agent was able to implement the entire test suite in a minute, however, on more complicated applications, I could imagine this task consuming a few (agent) hours - which might translate to days of human effort.

I'm never going to hand-craft UI automation tests again - Colin E.