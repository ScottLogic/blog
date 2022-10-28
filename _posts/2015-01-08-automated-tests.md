---
title: Why should a project have automated tests?
date: 2015-01-08 00:00:00 Z
categories:
- lpage
- Testing
author: lpage
layout: default_post
oldlink: http://www.scottlogic.com/blog/2015/01/08/automated-tests.html
disqus-id: "/2015/01/08/automated-tests.html"
summary: It has become generally accepted that a good project has a set of automated tests behind it - whether they be unit tests, integration tests or end-to-end tests. However I don't often hear people talking about the benefits vs cost and how much should be spent on particular projects.
---

It has become generally accepted that a good project has a set of automated tests behind it - whether they be unit tests, integration tests or end-to-end tests. However I don't often hear people talking about the benefits vs cost and how much should be spent on particular projects. I thought it would be nice to write up a guide and cover when automated tests are economical.

## Factors for deciding what tests make sense.

### Longevity of project

The length of active development affects how many substantial changes and additions will occur during the lifespan of that project. In order for a change to a project to be done in a well designed manner it is required that developers refactor code - this is where they move it around and adapt it in order to keep the project well organised and reduce duplicate code, so it continues to be maintainable.

If a project has a short lifespan, it may take away some of the benefits of automated testing.

An analogy for how tests can help refactoring is this - a unit of code is the boiler in a building and because of an extension, the boiler needs to be moved. After moving, two scenarios might be helped by tests.

Firstly, the original designer/builder of the boiler knew it had a tendency to overheat. They never had a problem where it was originally situated, but the original designer added a test so if it was moved close to a wall, it alerted the person moving the boiler - this would stop the developer doing the move and then some time later discovering a big problem that wasn't obvious when they did a quick check that it functioned okay.

Secondly, the person refactoring the boiler switches it on and the house doesn't heat up. Is it a problem with the boiler? with the pipes? Is it unrelated to the boiler move and perhaps a problem introduced by someone else doing some work in another room? With tests the person moving the boiler, might see straight away that the problem is a small part of the boiler that isn't working and save time in narrowing down the problem. 

## Accepted level of bugs

Almost all programs have bugs. Those that don't (pin number verification programs, medical software) are either simple or required to have proofs that the code works as expected. The bugs may be negligible ;- for instance chromium, the project being chrome currently has 128,236 open issues - but you probably don't come across them as an end user very often, if at all. But still there always has to be an accepted quality level. If that quality level is required to be high, then use automated tests - at worst, then just by spending more time on a feature and thinking about it longer, you will inevitably think of new situations and possibilities and thereby raise the quality level.

## Dependencies

What dependencies does your project have? The more dependencies, the more useful automated testing can be. Do those dependencies need to be upgraded regularly? If so then acceptance tests and end-to-end tests may help to allow those dependencies to be upgraded in a safer manner.

If you are writing a web application, I would include browsers in this category - and they are being upgraded all the time. It is quite possible that in a complex web application, a browser upgrade could cause a bug in your application that is only detected by testing.

## Number of releases

Is the project being delivered in an agile way, with releases every month and functionality growing or is it being developed and released once? If it is being released every month with growing functionality then it has to be regression tested by manual testers before every release. This cost can be reduced by increasing the number of end-to-end tests in order to reduce the amount of testers that you require in order keep up the frequent release lifecycle.

## Types of automated tests

### Unit

Unit tests test a class or a small piece of code. They can help pick up regressions, where a change to a class changes the behaviour in unperceived ways. This helps the building blocks of the application stay doing what the original author intended.

Personally I don't think it is necessary to have 100% unit test coverage (where every line of code is tested by a unit test), so long as other types of tests (integration/acceptance) cover the functionality.

Benefits: 
 - High: Lifespan - The code is easier to refactor, aiding future development and future quality level.
 - Low: Quality Level - The quality is improved by virtue of thinking about the code more during writing.

Cost: Medium - Implementing for every single class and mocking every interaction can be quite costly, however it is worth it for classes that contain logic and algorithms

### Integration & Acceptance

Integration tests test how the small components (tested by unit tests) integrate together. Acceptance tests are focussed on acceptance criteria and will test that multiple components work together to satisfy an acceptance criteria of the project. However acceptance tests may not run all of the application at once.

These two types of tests may be 2 separate entities or the same thing, depending on the project.

Benefits:
 - High: Lifespan - The code is easier to refactor, aiding future development and future quality level.
 - Medium: Quality Level - By specifically testing acceptance criteria, you are making sure that they have the potential to work.
 - Low: Releases - these give some assurance the application is doing what you expect so can give you more certainty is releasing often with less manual testing.

Cost: Low - It is generally the easiest type of test to do, testing multiple classes in a single test

### Smoke

Smoke tests are generally used when your developers have a continuous integration (CI) environment in order to make sure no-one has fundamentally broken the app.

If you have a mechanism to manually test merges then this type of test may save you time by doing basic checks for you.

Benefits:
 - Medium: Early warning of problems - depending on your merge process, these tests can give you an early warning that something is broken, decreasing wasted time if other developers have to wait for it to get fixed.
 - Medium: Saved Time - you don't have to do basic checks before every merge. But depending on the level of smoke tests, you may be doing those tests manually anyway, just by logging in and verifying something specific.

Cost: Medium - Usually you only implement a few basic tests, but you usually have to do so using end-to-end test methods, which have high cost.

### End to End

End to end tests will test your whole application from end to end. This means that if it's a web browser, it would usually use selenium to run the application on multiple browsers and simulate the actual clicking and typing that is done by a user. If you are in a windows application you might do the same thing but test in different windows versions. These kind of tests simulate the kind of regression testing that might be done by testers before every release.

Benefits:
 - High: Less manual regression testing - these tests can replace doing the same test. It is particularly economical on tests where a human would have to do a lot of variations on a single test, for instance doing the same thing with every combination of application settings.
 - High: Quality - because the end to end tests will continue to test features long after they were finished, this helps keep quality high by doing an amount of regression testing that would not be economical.

Cost: High - every time I've used an automated test software there has been a high maintenance cost and even simple tests have been difficult to get reliably passing on all browsers. Because webdriver has bugs, selenium has bugs, chrome driver has bugs and the browser has bugs they seem to all combine to make an environment that can be quite challenging. I believe it is quite important to know the cost benefit you are getting - so look at how much maintenance time the tests are taking up from developers, compare it to the amount of time it would take to manually regression test and see how many releases it will take to break even. Use this as a guide to help determine the tests most economical to automate.

## Other things to take into account

### Writing tests afterwards

It is tempting to say that tests can be written afterwards, when things have died down. However, in my experience, that will not happen and tests will never get written. Once a feature is developed it takes great self control to go back and write tests. The developer/project manager/business owner will all not get anything out of writing tests - no new features, little satisfaction and all it takes is for one of them to want to spend the time/money somewhere more visible and it will not happen. Once the correct level of tests is established a lead developer should block merges until those merge requests have tests.

You could say that tests could be written before any refactoring is done - but it defeats the point a little, since it may not be the original author writing them or it may be too long since they did the original work, so the tests may not be as effective.

### Test Driven Development

Some developers prefer to write the tests first (usually more focussed on unit tests) and then implement the code to satisfy those tests. This approach, known as TDD can be beneficial (and economical if you have decided that unit tests should be written anyway). It ensures the tests are being written and it can help some developers develop quicker by giving a focus to their work, by providing a framework for how a feature should be implemented and keeping the developer on track - some developers argue it can be quicker than not writing tests at all - I think that depends on the developer, but regardless, its a very useful process for any developer as it is rare to not need any unit tests.

### Web Projects

It is my experience that web applications in particular are more likely to require automated testing. I think this is because of a few factors. Firstly, if you are using JavaScript directly then its type freedom and global variables can make it more likely to accidentally effect areas other than the one you are working (using a linting tool or writing your code in TypeScript can help prevent this as well). Secondly, there is a trend to use a number of open source libraries and the quality of these libraries may not match your application - they are dependencies which you may need to upgrade, which might mean you effectively need to regression test your whole application in multiple browsers every time you upgrade. Thirdly you are writing for multiple environments - think of this akin to writing an application that needs to work on Linux, Apple and Windows operating systems. You have a framework that means theoretically it should work on all browsers, but particularly in complex applications you frequently come across bugs or missing features on one browser you need to work-around. Lastly, there is a tendency to think that because you are in control of upgrading users (no need to get them to download a new version), that this means you can release often - but releasing often puts a strain on manual regression testing which can only be fully combatted with automated testing.

## Summary

If you are managing an IT project it can be tempting to think of automated tests as an unnecessary expense - but if your project matches the factors above, you may be increasing the cost in the long term (on testers and paying for mistakes) and also making your project a less desirable one to work on in the future (an important factor if it is difficult to get good staff).

Given the cost of automated testing, it is important that you understand and acknowledge the required level of testing in each area and aim for a good balance that is providing you the benefits.























