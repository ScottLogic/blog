---
title: A Tester's story of adapting to the new world of pipelines - CI/CD
date: 2019-03-22 00:00:00 Z
categories:
- Testing
tags:
- Testing
author: pkhan
layout: default_post
summary: As a tester, how do you adapt when a new technology or process is introduced within your team? Do you accept it as a challenge? Do you research to find a solution along with the team? Do you reach out to people in the community to see how they approached it? Here's my story of how my journey while adapting to the new world of ci/cd pipeline.
image: psultana/assets/Pipeline.png
---

## As a tester, how do you adapt when a new technology or process is introduced within your team? Do you accept it as a challenge? Do you research to find a solution along with the team? Do you reach out to people in the community to see how they approached it?

I was in similar situation when our team decided to adopt Continuous Integration (CI), as we were transitioning to a DevOps culture. I would like to share what it was like to go through this journey.
 

It had been a while since we started to work in agile from waterfall. We as a team (product owner, developers, testers) took baby steps and evolved slowly. We were all happy, comfortable, and settled into the way we were approaching agile using scrum framework. Just when we were happy that we went through the agile transition, now it was a new challenge of transitioning to DevOps. We had to embrace another new change of process, and it was the introduction to the world of pipelines - CI/CD world!
 

As a tester you always like challenges, and this was challenging because I had to understand a new way of how testing fits in continuous integration and embrace the new type of value it could provide while working on it.

I was very curious to know: 

- What it brings to my world of testing?
- How would that effect current test process and what should be changed?
- What benefits do these pipelines bring? 
- What do they look like?
- How do they work?

And on and on. It was very confusing at the beginning to visualize the change.

Why is my first instant emotion towards this change ‘**Scary**’? Why can't it be an excited feeling or enthusiastic feeling for trying something new - I asked myself this question. Then I thought to myself, it's as simple as this - When you don't know about something, you are always scared about the change, but if you feel safe and see it as a new challenge, you will get excited.


Then I started to explore and read more about pipelines. It wasn't surprising that the more I was reading, the more I was confused. Then I decided to draw those pipelines and visualize them.


I sat with my whole team and said:"Let's please visualize the pipeline by drawing it on a big white board". They agreed and we had a whole discussion around these pipelines and came up with our own version of initial pipeline as there's no standard version that needs to be followed and it completely depends on how you as a team you want to approach it. 


That’s where it started to make more sense to me, and I got a better understanding about what exactly this continuous integration is - but all in theory though. What I understood at this point was that it is simply a step by step process to release the code once there’s a commit. Continuous Integration is a practice for integrating code several times to receive quick feedback. Whenever the developer finishes development task and pushes the changes to the repository, that’s where the pipeline stage starts. Because it has stages, it is called as a pipeline I thought to myself.  


I had even more questions:

- What are those stages?
- Who defines those stages?
- Who defines what should go in the pipeline and when?
- The biggest question was - will there be no manual testing at all?

We decided we shall run static code analysis, unit tests and integration tests as our initial stages of our pipeline. This stage would create a unique artefact which could be deployed on a test environment to run additional tests. As my understanding got better about pipelines, I started to suggest that we add more valuable tests to the pipeline.

We used SonarQube for static code analysis which was one of the quality gate. It is presented with the number of reported bugs, vulnerabilities and code smells. The report would look something like this :

![]({{site.baseurl}}/pkhan/assets/Sonar_Qube_Report.png)

Jenkins was used as a tool for continuous integration and Blue Ocean plugin as a UI for it. We integrated slack with Jenkins to get notifications whenever there was new build. 

![Jenkins.png]({{site.baseurl}}/pkhan/assets/Jenkins.png)

Initially we added smoke tests to the pipeline which would run alongside the existing tests. 
The reason why we added the smoke test to the pipeline was:
1)	Smoke tests are fast and checks core behaviour to identify if it’s a faulty deployment.  
2)	To make sure the build is testable before it is deployed on a test environment for further testing.

I could see each stage of tests running one after the other. It would stop going further if there was a failure at any of the tests or stages.

It was just the beginning for us and especially for me. I continued to observe and understand more and more. When my understanding got better, I had a discussion with my team about adding regression tests to the continuous integration pipeline. Initially,we did not want to add any long running tests to the pipeline as we thought the whole point of having these pipelines was for quick feedback. So we decided to run the regression tests as nightly run task instead of running it with every commit. But we had the goal to run these regression tests with every commit once our pipeline was mature enough by running them in parallel. But that was a long-term goal.


Each morning I reviewed the results. The difference was that I could add the build number while raising the issue if there was a failure, so it got easier for a developer to find the root cause. It's not to say that it tells you what exactly went wrong or where the issue is, but they could easily check the recent code related to that build to see what went wrong. Instead of searching a needle in a haystack, it's like you know which **part** of haystack you need to look to find the needle.

I got to spend more and more time on exploratory testing. 
 
As time went on, we got more clarity and the benefits of having these pipelines in place. We decided to have a long-term goal, where I suggested to add visual testing and performance testing as part of the pipeline, from a testing point of view. There was still lot more to learn , explore and add value to and this was just a start.


**This was my actual journey into the world of pipelines!!! It was very challenging and interesting. I'm super glad and proud to be part of it.**

### **Thanks for reading my story!!!  Happy Testing!!!!**


This blog was published on -
Mabl -[https://www.mabl.com/blog/testers-story-adapting-to-continuous-integration](https://www.mabl.com/blog/testers-story-adapting-to-continuous-integration)
DevTestOps Manifesto - [https://devtestopsmanifesto.org/articles-blog-posts/](https://devtestopsmanifesto.org/articles-blog-posts/)
