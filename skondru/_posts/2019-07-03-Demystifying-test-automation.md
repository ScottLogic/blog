---
published: true
author: skondru
layout: default_post
category: Testing
title: Demystifying test automation
summary: >-
  Demystifying test automation - This article aims to provide an understanding
  of the concepts and the implementation of test automation. I will use
  every-day language and avoid overly complicated terminology to build
  confidence in those making a start in test automation.
---

This article aims to provide an understanding of the concepts and the implementation of test automation. I will use every-day language and avoid overly complicated terminology to build confidence in those making a start in test automation.

Throughout my 9 year career, I’ve been using a wide variety of testing tools. These include web application testing tools such as Selenium, performance testing tools such as JMeter and API testing tools such as REST Assured.

WARNING: There is a danger that you might want to add automation to your skill set after reading this!

## My thoughts on the automation role

It’s been my experience that the person who does the test automation role, is someone who has augmented their manual testing skills with software development skills. There may be an expectation from the other feature team members that the automation engineer has good programming knowledge and understands the technical stack. 

When I started working on test automation I was really excited and enthusiastic to learn everything I possibly could about tools, coding, and development. One day, I realised that because I was spending so much time focussing on the technical elements of the role: understanding the technical stacks; learning new programming languages, I was leaving my valuable testing skills behind. 

With this in mind, I started balancing my time between technical and testing skills equally so that I did not get lost in the technical haze and lose my core testing skills. I started thinking about identifying what and how to test, calling out risks, providing relevant information instead of automating every test.

I am still keeping my testing skills updated and recently I have been learning exploratory testing skills from a colleague in order to keep my testing skills as sharp as my automation skills.

In my opinion, the person/team who does test automation should have a *basic understanding of the programming language that is being used for development. This is so that one can understand what the developers have written and should be able to check the flow of the algorithm. Pair programming with a developer would always help with this. 

A test engineer with the ability to automate tests should keep the spirit of a tester and be clear in covering tests rather than getting lost in a technical haze. Like other testers, they need to spend time learning about testing skills by working with other testers, attending conferences and researching about testing.

***What is a basic understanding of a programming language?**

- Programming structure - It is the overall form of a program, with particular emphasis on the individual components of the program and the interrelationships between these components.
- Variable Declaration - Data type and name declaration
- Looping structures - Running the statement multiple times based on a  condition
- Control structures - It is the general flow of a program
- Syntax - It is a set of rules that define the combinations of symbols that are considered to be correctly structured programs in that language
- Object-oriented principles - encapsulation, abstraction, inheritance, and polymorphism
- Browser developer tools - HTML, CSS, Javascript to locate elements and debug 
- [Software testing fundamentals](https://www.edx.org/course/software-testing-fundamentals)

## What is test automation?

Test automation is the process of writing,  executing, reporting and maintaining the tests using a set of tools.

**Why we automate**

- Reduces human effort and time in running repetitive tasks to ensure that code changes have not broken the build.
- It allows regression testing to be conducted as part of the build pipeline.
- To run large volumes of tests in a short amount of time for volume and performance testing.

**When we automate**

- When there is a test that we want to re-run multiple times.
- When the feature or behaviour will be static and not changed.
- When there is a predictable expected outcome of the behaviour.
- When there is Continuous Integration in the build pipeline.
- Test Driven Development (TDD) and Behaviour Driven Development (BDD).


**When don’t we automate**

- When we don’t have to repeat the test, or it’s not valuable to repeat the test.
- When it would be too expensive to create the test.
- *When there is no Continuous Integration in the build pipeline.

*However there are some exceptions to automate with No CI (CI/CD)

- During the time we are waiting on the pipelines to be built
- Projects too small to justify pipelines 
- Projects in which development and testing are done in different phases and kept separately.

“Hold on a moment... when is it required?”
It's vital to have automation in place to protect static behaviour against unwanted changes either in functional or non-functional areas when new features or code changes are implemented. This can be fed into a [CI/CD](https://blog.scottlogic.com/2019/03/22/a-tester-s-story-of-adapting-to-the-new-world-of-pipelines-ci-cd.html) environment and reduces the need to manually recheck that behaviour is still correct.

This means that every time there’s a fix implemented or change in code the tests needs to be executed again and again to validate behaviour. This could be as minimal as 2 tests or 1000+ tests. It would take hours, days even weeks to complete regression testing on the entire test suite. In such a situation, it is better to have the automation pack ready to trigger the build and let the tests run without much human interference.

**Test Automation can be the best option for following testing types:**

- **Regression Testing:** Due to code changes and the ability to run regression testing in a timely manner.
- **Load Testing:** Automated tests are also the best way to complete the testing efficiently when it comes to non-functional testing because it’s cheaper and faster to run multiple threads via automated tests compared to multiple users doing this manually.
- **Testing bulk data:** Testing that requires repeated execution of the same task with multiple data.
- **Performance Testing:** Similar to bulk data testing with a simulation of thousands of concurrent users (load testing), sharp increases in users (spike testing) and long-running user processes (endurance testing) requires automation testing.

**Main parts of Test Automation:**

- Test framework - How you write, execute, report and maintain tests?
- Automation tool - Tool that could execute and report tests on your behalf
- Writing tests - Some code in a specified language – handcrafted or snippets
- Supporting tools and techniques - addition libraries and tools that help to enhance test automation

## What is a Test Framework?

During the course of my whole career, there have been differences in the test automation framework that I’ve used for each project. It changed the project by project based on the needs of the team and the software being developed.

Frameworks are built by analysing the purpose of automation testing for the project and applying suitable test techniques. To be more specific it is the working style of writing, running, reporting and maintaining the tests. In your agile team, you are always open to seek help and suggest improvements to your team. So why not pair up with developers to have a conversation and make recommendations on this? 

I have added some simple descriptions below which are quite easy to understand and compare with the projects you are currently working on or will be in the future.

- **Linear Scripting Framework:** Consists of a process that automatically records steps from a tester manually using the software, allowing for automated playback of those steps at a later date (example: Selenium IDE).
- **Modular Testing Framework:** Consists of a technique where workflows are broken up into a library of smaller reusable scripts (e.g. login steps, search steps, filling a form steps, submitting a form steps), these are then reused across multiple tests.
- **Data-driven Framework:** This technique is used to keep the test steps and test data independent from each other. The test is written to execute by calling multiple sets of test data that are stored outside of the test in a separate file. This means the same test steps can be used across different data easily and that test data can be updated without impacting the test steps.
- **Keyword Driven Testing Framework:** It is also known as table-driven testing or action word based testing. In Keyword-driven testing, we use a table format to define keywords or action words for each function or method that we would execute.
- **Hybrid Driven Testing Framework:** Hybrid Test automation framework is the combination of two or more frameworks
- **Test-driven development (TDD) Testing Framework:** This is a development technique where automated tests are written, frequently at a unit or integration level, to drive the development of functionality. Feature code is written to pass the tests created which implements the functionality required as set out by the tests. These automated tests can then be kept to serve as a regression test suite.

## What is an automation tool?
It is a software tool that controls the automated tests execution and reporting

“How to select an automation tool?”

- Use a tool that supports the application type you are testing
- *Use a scripting language that matches the development language of the software being developed
- Use a tool that allows for the reporting required by the project
- Use a tool that is easily maintainable or is open source
- Use a tool that integrates with the existing build pipeline, using Jenkins, TeamCity, etc…

* However It is possible to use tools with pre-canned tests, not in the language of the components under development. 
Example:
- Using Postman with Chai/JS to automate scenarios against APIs written in Kotlin/Java

## Worrying about writing tests?

This is another thing where some testers can feel panicky, but it is as simple as seeding a plant. A test automation tool is a robot or an agent that has some features to understand your commands and process them. For example, in a UI test, you ask the selenium web driver to:

- Open a specific browser
- navigate to a specified URL
- Check that conditions exist on the page
- give a result (either pass or fail)
Irrespective of which tools and programming language we use, however, the testing we perform does not change; our aim is always to check whether the actual result is the same as the expected result. 

Each tool has support for various languages such as Java, C#, JavaScript, Python, Ruby, etc. so it’s good to have some knowledge of a programming language for automation, but not to the same deep level of knowledge that a programmer will have! For writing automated tests using various frameworks, having a breadth of knowledge is more useful than a deep depth of knowledge.

## Supporting tools and techniques for test frameworks:

**Editors:** The editor is where we physically write our tests.
Example: Eclipse, IntelliJ, Visual Studio or even notepad works well

**Test Practices:**  Style of writing your tests which would typically include: when and how you are writing tests.
Some examples are:  BDD, Test-driven development (TDD) 

**Repositories:** Development code and our tests can be stored in shared repositories
Some examples are: Github, Bitbucket

**Continuous Integration:** Execution and reporting of our tests can be part of Continuous integration build pipeline
Some examples are: Jenkins, TeamCity

**Test Data maintenance:** Test data ( constants and elements ) can be stored and maintained in the independent page objects or within the test scripts created. Storing the data and constants outside of the tests means you only have to update one location if this change (rather than change every test individually).
Test data can also be stored in YAML, JSON, MS Excel, XML, CSV, DataBase

**Libraries:** Libraries are used for enhancing the test automation process especially to run and report the test results.
Some examples are:  JUnit, NUnit, TestNG

Having the skills to configure tools, runners and libraries inside of an automation framework are very useful to an Automation Engineer.

## Those who write automated checks are still testers…

Remember that all test automation engineers are also test analysts. Every automation tester must be able to write test cases for increased functionality and product test coverage. Testers with good manual testing skills will be able to identify the scope for an Automation pack.  However, the person with test automation skills would be able to take these cases and with relative ease be able to automate them.
 
There’s an ongoing demand for testers with the ability to automate their testing work. Many clients are looking out for these skills to aid with agile testing and CI development.
 
Nearly every automation tool on the market has its own syntax and uses a different programming language. This means there’s no such thing as a single “automation skill”. Instead, a tester needs to get hands-on with multiple languages, get exposure to different coding practices and learn how to collaborate with developers and understand the technologies.
 
By learning about and using many different types of tooling and programming it is possible to build an understanding of the general principles of such tools.  This knowledge can then be applied across different frameworks and projects.


Be a jack of all trades, develop a breadth of programming understanding across a number of languages and tools, rather than being a master of just one.

I hope this blog is energising you to motivate yourself moving towards test automation and enjoy the new learning to explore future automation.

Some good links for learning automation:

- [Ministry of Testing][1]
- [Practice site if you are learning to code][2]
- [The basic general automation practices a tester should have][3]
- [Different automation approaches and tools][4]

[1]: https://www.ministryoftesting.com/dojo/lessons/podcast-richard-bradshaw-test-automation
[2]: https://www.sololearn.com/Courses
[3]: https://www.edx.org/course/software-testing-fundamentals
[4]: https://testautomationu.applitools.com/

Be slow but steady, just like a tortoise. This way you reach your aims easily and in an impactful way.

![blogimage.png]({{site.baseurl}}/skondru/assets/blogimage.png)
