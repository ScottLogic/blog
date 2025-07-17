---
title: Achieving Cross Browser testing greatness
date: 2018-07-17 00:00:00 Z
categories:
- Testing
tags:
- Cross-browser
- testing
- browser
- automation
- selenium
- driver
- webdriver
author: cbrown
layout: default_post
summary: This blog takes a high level look at some of the challenges faced when conducting
  automated cross-browser testing and discusses potential solutions to tackle these
  challenges.
---

## Introduction
Isn't it frustrating where you start to fill in an online form, only to be met with a page that stops you in your tracks because a date field won’t select correctly, or a button simply gives you a red cross that prevents you from clicking it? You then angrily click the mouse with such force you could put your finger through, followed by shouting and swearing at the screen.

The form is completely broken! It must be!

… or is it?

Maybe this is just the archaic nature of IE and the form works perfectly fine in Chrome?

This happens all too often and is frequently an area of testing that is missed. Manual cross-browser testing quickly becomes impractical and inefficient as the size of your application grows and grows. Maintaining continuous integration when testing is performed manually is also an impossible task. This is where automation swoops in to save the day.

But how do we automate cross-browser testing? In this blog I aim to highlight some of the things we need to consider when writing automated cross-browser tests. This blog isn't about specific implementation details and instead a higher level abstract look at cross-browser testing.

## Which browsers do we support?
First and foremost, we need to decide which browsers we want to support. Automated tests come partnered with an overhead and so there’s no point in writing automated tests for IE 10 if we don’t support it.
Let’s take a look at the statistics around the usage of different browsers. On 30/06/2018, W3Counter reported the following statistics:
![w3counter-browser-stats.PNG]({{site.baseurl}}/cbrown/assets/w3counter-browser-stats.PNG)


https://www.w3counter.com/globalstats.php

As the graph shows, Chrome’s usage smashes other browsers with a whopping 41.7% greater usage than Safari which placed in second.

Every system is different though and the above data is only representative of all websites that use W3Counter's free web stats. A good way to gauge which browsers are favoured by your users is to use an analytics tool. Mixpanel and Google analytics are examples of tools that provide browser identification functionality.

## What are we going to automate?
Although we have the option to automate numerous browsers, we need to start somewhere and get the foundations of our framework setup. Personally, I like to start with automating for either Chrome or Firefox. Setup for both drivers is minimal and both drivers have fast execution times. 
Once you have the basic setup for your framework, you can expand to support other browsers at a later date.

## Where are we going to run the tests?
Something to consider when setting up a cross-browser testing framework (or any testing framework for that matter) is where are we going to run our tests and how often do we want to run our tests? Ideally, we want to run our tests on a regular basis to provide a form of continuous integration and ensure that no regressions are introduced during the development stages. Using a cloud-based CI environment is a great way to do this as they often provide ample processing power and tools to configure the run frequency.

## Writing the tests
The final step to consider is actually writing the tests. Easy! All I need to do is run my whole test suite with different drivers… right?

Writing our tests might seem simple at first, but we need to consider several factors that could affect our tests.

### Element selectors
Something to consider is the type of selector we use for our elements. Different browsers can render certain web elements in slightly different ways and thus can create problems when trying to find a selector that works across all browsers. I’ve found in the past that CSS selectors can be particularly volatile and that, if possible, the use of ID or xpath selectors seem to be more stable.

### Timing issues
Nobody likes an overhead when running their automated tests. A short feedback loop is a good feedback loop. Execution performance is not consistent across different browsers and we therefore need to factor this in when writing our tests. Without considering this, it’s likely that you will have failing tests because the DOM had not loaded in time for an element to be selected.
An easy way to tackle this is to include waits in your test script. These can either be implicit or explicit waits

**Implicit waits**: An implicit wait sets a timeout value to wait for an element to be returned from the DOM if the element is not returned immediately. This wait is used for the lifetime of the web driver object and is used whenever selecting an element. Because of this, an implicit wait can be seen as a 'global' wait.

	driver.manage().timeouts().implicitlyWait(10,TimeUnit.SECONDS);

**Explicit waits**: An explicit wait allows us to wait for a certain condition to be true before moving on to the next statement. Using this method means we can target a specific element or event, giving us more control over our test execution. The example waits for an element to be clickable rather than it simply existing in the DOM as is the case with an implicit wait.

	WebDriverWait wait = new WebDriverWait(driver, 10);
	wait.until(ExpectedConditions.elementToBeClickable(By.id("id")));

## What can we learn from all of this?
To summarise, we have seen that there are various aspects that we need to consider when writing cross-browser tests and we will potentially encounter the issues discussed. My personal advice to minimise the hardship that these issues cause would be to start your testing as early as possible, limit testing to a single feature at first and to use cloud computing to your advantage. This way you can build a good test foundation and allow ample time to handle any issues.
