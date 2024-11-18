---
title: devtools@scale event
date: 2017-05-25 00:00:00 Z
categories:
- Testing
author: sbaker
layout: default_post
summary: 'This blog describes a one day event in London where leading tech companies were discussing tools they use to make their development and operations scale and be more efficient. '
---

Last week I attended [devtools@scale](https://devtoolsatscale2017.splashthat.com/) at Tobacco Dock, London.  There were about 150 attendees from London’s tech, finance, business community and, from what I gather, most were invited by Facebook after attending a [meetup with Kent Beck](https://buildingproductswithkentbeck.splashthat.com/?gz=3a966da4f2703154b8b594dbe7e61ef6)
at their offices before Easter.  However it was not exclusively Facebook focused, and it was largely an independent view with leading tech companies discussing the tools they use to make their development and operations scale and be more efficient.

![MyImage]({{ site.baseurl }}/sbaker/assets/devtoolscale_opening.jpg "Auditorium")

A variety of subjects were on the programme for discussion, broadly categorized as issues relating to following topics:

-	[Testing](#testing)
-	[Source control](#source-control)
-	[Static analysis](#static-analysis)
-	[Search](#search)
-	[Build](#build)
-	[Debugging](#debugging)


### Testing
First up was a talk by Facebook engineer **Phyllipe Medeiros** working on the _OneWorld_ tool –this is a resource platform so that developers and engineers can test their applications on the multitude of browsers and mobile OS that Facebook support.  There are apparently 180 different combinations of browsers and mobile now supported by Facebook so there were lots of graphs on how the number of tests and time for test suites are growing exponentially.  There was a lot of detail of the workflow of using this service, and how in addition to running tests, they've ensured a clean install, run in parallel, retaining logs, monitoring, performing health checks, restoring original state.

Later there was an excellent talk by **Adriana Liborio**, also from Facebook, who discussed the work of the _Sandcastle_ team responsible for continuous integration, API for source control, dependency installation & resource health checks.   In order to build and test they previously employed a single queue with jobs and workers. However due to growth at Facebook over past few years, the size of the queue easily reaches 50 k by mid afternoon and the system was unworkable and developers were unable to be productive.   They rethought the infrastructure and after contemplating building a global scheduler, and a dispatcher, they eventually developed a distributed queue where each worker (test or build server) and each job are configured in json with their capabilities and other attributes like their preferred data centre location etc.  They also use MySQL database to atomically save each transaction, and problematic jobs were able to be segregated and handled separately so they didn’t impact the majority of well-behaved jobs.   The result is that they're able to reduce the waiting time for a job from 100 s to 5 ms giving a fast, simple, reliable, scalable and consistent matchmaking system.

Spotify developer **Sean Kenny** also described at length the issues relating to how to scale an effective set of unit and end2end tests.  He talked through the classic issue of how when a small company grows the accompanying testing infrastructure develops issues.  Each team (or squad as they called at Spotify) now has their own testing dashboard and able to work more effectively.  The developed concept of _Purgatory Pipeline_ where flaky tests were isolated and allowed other testing to continue. And also have _Cassette_, a fast reproducible hermetic virtual testing environment where tests are reproducible and recordable helping combat the flaky test issue.  _Cassette_ is a third way in their testing strategy to complement unit and end2end tests:

### Source control
There was also an entertaining talk by **Carlos Martin Nieto** from GitHub who highlighted some ways people are misusing GitHub and causing issues.  Examples range from organisations using GitHub as a database with millions of files, to crazy university projects which continually pushed every second,  to a hackathon that tried to run a raffle using GitHub pushes.   There was also some discussion on how large repos they have like linux and IntelliJ scaled. 

However these problems are dwarfed by subsequent talk by **Edward Thomson** of Microsoft who discussed the issues of using git with 4000 developers.   Previously at Microsoft individual teams were using a huge variety of source control systems.    His mission was to achieve a common approach, and the issues he grappled with was i) Large teams with high rate of pushes and large number of branches; ii) Large repos with large number of files and huge history.

Before release deadlines, a high rate of pushes caused huge contention issues so they use pull request solution.   However, they still have huge problem with the large number of branches as typically a developer will have around 25 branches, so with 4000 developers this means over 100,000 branches – git performs well with hundreds of branches, slows down considerable when you have thousands of branches but is almost unusable with 100 k branches!!  So they’ve introduced concept of limited branches where you only have master and specific release and your remainder are virtual branches.

The size of the repo is also huge issue, Windows has 3.5 million files and there’s a huge history associated with it.   So they were seeing `git clone` taking over 12 hours, a `checkout` taking 3 hours, and just to do `git status` (where nothing had changed) 8 min and a `commit` taking over 30 mins!!!!    So again they’ve built their own virtual filesystem on top of git, which means you need to be online the first time open a file, but you can use all the standard git tools on the command-line and in IDEs etc.  This has reduced the `git clone` to 90 s, `checkout` to 30 s, `status` to 8 s and 10 s for a `commit` – so a definitive improvement and a much more workable solution!
![MyImage]({{ site.baseurl }}/sbaker/assets/devtoolscale_microsoft.jpg "Microsoft files")

### Static Analysis
Also speaking were **Dulma Churchill** and **Jules Villard** talking about static analysis tools at  Facebook. They’ve developed their own open source tool [infer](http://fbinfer.com/).   It is used by Spotify, Uber, Sky etc. and of course Facebook.  They described the Facebook code review process where there is human code review as well as the analysis from this tool. Rather than trying to implement all the tool’s recommendations (which is an unenviable task for even a modest sized project), it only suggests improvements which differ from the previous commit.

### Search 
Also from Facebook, **Jeroen Valen** described how the needed a specific search tool to search their codebase as the conventional grep and find will not work!  A simple search could take up to minute, and they’ve reduced this down to 250 ms using their _BigGrep_ tool.  It can take into account dependencies and searching previous commit history, and get contextual information.   This helps their engineers with code i) changes ii) exploration iii) refactoring iv) understanding v) debugging.

### Build  
**Dimtry Lomov** from Google discussed [Bazel](https://bazel.build/), their open source build tool which is in beta.  The talk described the classic google approach of emphasis on correct, reproducibility, speed, scalability, flexibility and reliability, using a python-like language [Skylark](https://bazel.build/versions/master/docs/skylark/index.html). 

The Amazon system architect **Paul Maddox** spoke passionately about on the fact how his clients are too busy to change, and many are constantly firefighting.   They’ve done substantial analysis on their developer tools and constantly working to make most effective solutions which are decentralized, self service and technology agnostic tools.  They always try to practise the model: build once,  build after every commit, commit frequently, and deploy to a running environment.   However they still have bottlenecks or significant chunks of time in their pipeline which are due to “waiting”, and not time spent coding nor testing.  There was quick plug for their [AWS code star](http://docs.aws.amazon.com/codestar/latest/userguide/welcome.html) and their other initiatives.

### Debugging
**Chris January** from ARM discussing their debugging and profiling product for high speed scientific computing.   Interesting case studies here on how a clear navigable UI can really help identify issues quickly and lead to dramatic improvement in stimulations e.g. Brain scan medical modelling software improved by 25% because developer was able to drill down and investigate outliers and data from millions of processes.

## Summary
It was a very interesting day of talks, and excellent opportunity for me to see the challenges and landscape of modern development and operations of large scale companies.   I think the main takeaways are that those leading the industry are continually re-evaluating and reassessing the tools they use and ensuring that their processes are efficient, and when they’re volumes change by orders of magnitude, they are not scared to stand back and re-think their approach.     There was the obligatory grey t-shirt and calorific snacks and beers handed out afterwards and a chance to chat and meet other developers -  so all in all a great day.


