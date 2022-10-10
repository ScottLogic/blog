---
title: When should we automate?
date: 2022-10-10 09:27:00 Z
categories:
- tgilbert
- Testing
tags:
- Testing
- Automation
- Regression
- test-automation
- ''
summary: 'A look at how building an automated regression test suite in the early days
  of a project will provide benefits further down the line. '
author: tgilbert
---

A look at how building an automated regression test suite in the early days of a project will provide benefits further down the line.

**What is regression testing?**

Regression testing is a type of testing that is done to ensure that changes to the code, in the form of new features, bug fixes or enhancements, do not have a negative impact on the existing functionality of the application.

If the tests that are run during the sprint are identified as 'regression candidates', using a risk-based approach to ensure sufficient regression coverage, then the tests will be added to the regression test suite, and they will then be re-run in future sprints.

If the automated regression tests are not written, as each sprint passes, the manual regression test suite will continue to grow, and an increasing amount of the tester's time will be spent running the regression tests. The graph below is an example of how this scenario may look:

![NoAutomationGraph.PNG](/uploads/NoAutomationGraph.PNG)

**Why should we automate?**

Automating the regression test suite means the testers are spending less time doing the repetitive manual tests and can spend their time testing the new features, doing exploratory testing, and maintaining the automated tests. The graph below is an example of how this scenario may look:

![AutomationGraph.PNG](/uploads/AutomationGraph.PNG)

The automated regression test suite can be integrated into the build process which will provide the developers with early feedback if they have broken anything. This saves the testers from having to deal with issues that should never have reached the Test environment in the first place.

In addition to that, end-to-end integration tests can help ensure that there is no regression impact on the integration points. This becomes increasingly important if there are different teams working on different areas of the system.

**Common blockers**

*We do not have time to automate, let us just get through the story points*

I am sure most people have heard this from their Scrum Master or Project Manager, and it is an easy trap to fall into. The initial investment in putting together the automation test framework is seen as too high. The problem is, as each sprint passes by and those story points are completed, the manual regression test suite is growing. In the short-term, the testers will not mind running a handful of manual regression tests every sprint but 6 months down the line when the regression test suite is incredibly repetitive, time consuming and has grown arms and legs, they will not be happy about the decision not to automate the tests.

*How do we automate this?*

If there is a feeling amongst the Test team that they do not have the skills to create an automation test framework, then do not be afraid to ask for help. Automated tests are there to benefit the whole team and the developers will hopefully have the skills to help. Taking a whole team approach to automation and getting buy-in from everyone is going to help improve the quality of the framework and the tests and that is going to benefit everyone as new features are added, and the code gets more complicated.

*The app is too unstable*

There is often a view that the application under test is too unstable with new features being added every sprint and the worry is that the automated tests will just fail all the time and will need constant maintenance. This may be the case, but that argument could also be applied to the manual regression test cases as well. If the time is spent running and maintaining the automated regression tests rather than running manual regression tests, at some point the application will be stable and we will have an automated suite of regression tests. The alternative is that we have a stable application, many manual regression tests to run every sprint and a development team who wish they had automated tests from the start.

If the tests are failing regularly due to feature changes (as opposed to genuine bugs) then one approach is to leave the automated tests out of the build and deployment pipeline. They can still be run locally by developers and testers to get that early feedback, which will give them confidence the changes have been successful, but they will not be stopping code deployments. This can be particularly useful on projects where there is a lack of test resource. Once the tests are stable, they can then be integrated into the build and deployment pipeline.

**Conclusion**

The short-term investment and pain of getting an automation test framework up and running in the early sprints of the project will really benefit the team in the long term. The quality of the code will be better, the regression issues making it into the Test environment (or beyond) will be lower and the whole team will be happier. No tester really wants to be running an ever-growing suite of repetitive manual regression tests every few weeks. So next time you start a project, think about how you could automate tests in the initial stages of the development process. If you are already on a project and the automated tests have not been created, now might be the time to get started.