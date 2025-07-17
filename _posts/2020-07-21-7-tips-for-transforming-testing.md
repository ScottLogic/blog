---
title: 7 tips for transforming testing
date: 2020-07-21 00:00:00 Z
categories:
- Testing
tags:
- transformation
- testing
- delivery
- communication
- chat
- problems
author: dmcnamee
summary: For businesses that are transforming their development practices, testing,
  as ever is either overlooked, or the last thing to get a makeover. So how do you
  go about providing real value with changes to your testing practices.
image: dmcnamee/assets/transform-flowers.jpg
layout: default_post
---

<img src="{{ site.baseurl }}/dmcnamee/assets/transform-colour.jpg" alt="colour" title="colour">

## 7 tips for transforming testing

Businesses from agriculture to zoos often rely on a well functioning website to help them in some way. Then there's ecommerce and banking where so much is done via the web interface, they have to be (or should be) excellent at what they do. 
Getting things right is so important. Too often, testing is overlooked or hasn't caught up with modern ways of development. You know you want to, or need to make changes, but don't know where to start? What's effective and what isn't can be difficult to know.

The context driven school of testing lists [7 principles](https://context-driven-testing.com/), as do the [modern testing principles](https://www.ministryoftesting.com/dojo/lessons/modern-testing-principles).

Both are great examples of guiding principles. Neither offer practical examples of what you do with these in any concrete way. How do you action these into achievable changes that can see tangible results?

Using both principles as a guide, here are 7 tips that can help transform your testing.

*A word of warning.* These are bound by the overriding principle of context. That is, what you are building is the solution to a problem. That problem is different for everyone. How you go about solving that problem has context. Use these as good practice or practical tips within the context of agile software delivery. 

If you'd like to know more, or require a more detailed assessment of your current capabilities and what it might take to see results quickly and/or have a long term goal of transformation, give myself, [Daniel](mailto:dmcnamee@scottlogic.com) a shout and we can discuss how we can help.

On to some good practice.

### 1. Involve People
If you are building software that is going to be used by people, involve those people. 
Get your testers involved and involved early. Embed them in your team. If you don't have testers, give someone on the team responsibility for testing. 
Get your developers testing. Not necessarily in depth, but for any code they develop a tester should not be able to find simple problems. Pick off the low hanging fruit and maybe some higher up too.
Get your customers testing. These are your end users. Give them early access. Customers often do things quite unexpected and will use an application in ways that even the most creative testers don't think of.

### 2. Test contextually
You don't need to test everything all the time. Testing for regression is important, but what you test and when should be shaped by the context of what you're building. Understanding of code changes and the possible impacts can guide testers to investigate areas of risk. If an area isn't affected by a change, there's little risk to not spending hours testing for regression there.
This is a way to speed up development whilst still maintaining confidence in the end product. Combine with a good CI pipeline or automation suite to provide greater coverage. 

### 3. Test continuously
Test throughout the whole of your development lifecycle. That starts at the design stage. In a way, this harks back to the old V-model. This shouldn't however be a documentation exercise.  A design walk through where everyone is able to ask questions and provide early feedback or identify issues can work to provide context and uncover areas for exploration or modification. 
Testing in production is also one of the best ways to find problems. Provide test accounts or use feature flags so your testers can explore the production environment as this is the most accurate version of the application.

### 4. Test incrementally
Do test after everything is built, but do also test during development. Provide fast feedback by testing in small increments. Use feature branches, prototyping or pair testing. Enable testers to build and test locally rather than waiting for builds to provide fast feature feedback. More in depth testing can then be conducted in an integrated build with less time being spent on the functionality itself.

### 5. Fix bugs early
Don't sacrifice quality for features. Fix bugs as quickly as possible. Not just major failures. Sometimes the small problems can be irritating to a user. Left unchecked or unfixed these can pile up quickly. 
A good rule of thumb if you're working in sprints is to fix bugs found in sprint in the sprint. Or for Kanban, any issues found with a feature that is in WiP should be fixed before marking as complete.
Any issues logged should be regularly reviewed as a team, where bug advocates can make their case as to why issues need fixing. These should then be fixed as part of the normal workload. This may slow down development for new features, but ultimately produce a more robust solution. 

### 6. Automate effectively
Automation isn't just automating checks in a pipeline. Here's a context driven approach to automation in testing that can explain further and in more detail: [A context driven approach to automation in testing](https://www.satisfice.com/download/a-context-driven-approach-to-automation-in-testing)

However, for your automated code, there are good practices that are worth following:

**Consider your automation as production code and make it adhere to the same quality.** That means reviewing, following code style and fixing bugs quickly. It needs to be maintainable, extensible and robust. 

**Don't automate everything just because you can.** And definitely don't try and automate everything via the UI. 
Shard if possible. Shard? That's splitting the tests so that they run in parallel. This speeds up execution meaning you can do more in a shorter time.

A slightly different way to achieve quicker execution times is to **consider multiple suites** that contain logical groupings of checks to be executed at different points.

**Ensure someone has ownership.** Particularly for UI code where checks tend to be flakier. These need monitoring and updating quickly. 

### 7. Develop with testability in mind
Talking of monitoring. Do some. Any kind. Whether it be logs or adding timings to tests. Applications need to be testable and information such as logs help testability. Observability is another way to provide information that can be analysed. Testing isn't just exploring the application, it's also using tools to provide information and uncover problems. 

## The Bite Down
Where are the KPIs, how do we measure performance of our testers? These are valid concerns, but when you are able to see development times reduced and quality increase, you will be able to instigate performance improvements that work and have relevance. 
