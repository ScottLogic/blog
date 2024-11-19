---
title: Successful microservices architecture with the Twelve-Factor App
date: 2017-07-17 00:00:00 Z
categories:
- Data Engineering
author: bjedrzejewski
summary: Using microservices in your architecture is a very popular choice. Unfortunately
  it is also challenging to get it right. With the help of Twelve-Factor methodology,
  I will tell you how to set yourself up for a success rather than a disappointment.
layout: default_post
---

## Introduction

It really seems that everyone is building microservices these days. Start-ups, big Internet companies, the enterprise.
There is a good chance that no matter where you work, if you are a backend developer, you will encounter microservices architecture
or be asked to design one. The Internet is full of advice and opinion about how this should be done. Some of it is very
specific to certain styles- Serverless, Java, .Net, Node etc. and often may be related to very specific issues. What I found
difficult is to find universal truths and practical advice that could be used as a way to evaluate a particular design. We have
these principles for Object Oriented Programming in the form of [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)),
[GRASP](https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)) and even the precursor to microservices-
the Service Oriented Architecture - [SOA design principles](https://en.wikipedia.org/wiki/Service-orientation_design_principles).


There should be a tested lists of rules that could guide development of good architecture. I believe that this list already
exists and is called [The Twelve-Factor App](https://12factor.net/) methodology. I really recommend to check their
[website](https://12factor.net/) and read the details, as we will not repeat everything that is already written there. What
this article aims to do is to give a decent overview of the methodology and explain how it relates to the world of
microservices (as these rules are more universal).

### The Twelve-Factor App - The Goal

Before going into the specific points (factors), it is worth to understand what are they trying to achieve.
To cite directly from their introduction, one by one:

> Use declarative formats for setup automation, to minimize time and cost for new developers joining the project;

An issue of tremendous importance when dealing with a large number of services. The more you have the more important this becomes.
I would argue that this is a key prerequisite for a successful microservices project.

> Have a clean contract with the underlying operating system, offering maximum portability between execution environments;

Another important point, as with microservices we are trying to de-couple things, it is easier to do, when not relying
on particular operating systems.

> Are suitable for deployment on modern cloud platforms, obviating the need for servers and systems administration;

This one is not always necessary, as plenty of people on the enterprise side (particularly in finance) will have their own
infrastructure. It can be crucial for different users though (more devops oriented).

> Minimize divergence between development and production, enabling continuous deployment for maximum agility;

It is always beneficial when development is as similar to production as possible- development and investigating bugs
becomes easier and faster.

> And can scale up without significant changes to tooling, architecture, or development practices.

Scaling is often one of the main reasons why microservices are chosen.


Just by looking at the goals, we can get a sense that having this would make development easier and more enjoyable. This
is the way we should look at these factors. Not as a recipe how to design the full system, but rather a set of
prerequisites that can get the project off to a great start. In my experience and from talking to other colleagues I
conclude that most failed attempts at microservices were really doomed from the start, by setting themselves
for failure. It was not deep design issues, or some coding difficulties that made them ineffective, but rather getting
the basic things wrong. The rest of this article is devoted to reviewing The Twelve Factors in the light of microservices
and hoping that it will help readers get their projects set for success!

### 1. Codebase
>One codebase tracked in revision control, many deploys

This is pretty fundamental, yet sometimes you can see people breaking this principle. You should not create two different
repositories when all you need to do is different setup for production. Of course you can have multiple version of the
app deployed, just make sure that their share the codebase. If you are wondering how to deal with multiple versions
in a single codebase, I recommend having a look at [git-flow](https://danielkummer.github.io/git-flow-cheatsheet/).

### 2. Dependencies
>Explicitly declare and isolate dependencies

Thinking about dependencies usually does not go beyond the dependant libraries. As long as you use a standard build tool
(npm, yarn, maven, gradle, NuGet) you have the basics covered. It is more difficult when it comes to managing
dependencies- required database connections, services, etc. Here it may be easier to look for help from tools
such as [chef](https://www.chef.io/chef/), [puppet](https://puppet.com/) and [kubernetes](https://kubernetes.io/). It
is really beneficial for the speed of development and on-boarding when all that is needed doing is checking out
the repository from the source control and running the build.

### 3. Config
>Store config in the environment

It is very easy to make a mistake when dealing with the configuration in microservices. In the beginning it is quite simple
to just create a few configuration files and load them depending on which environment the service is being executed. While
this seems like a good idea at first, as the number of services and environments grow, this can quickly go out of hand-
you can think of it as an O(n^2) solution to the configuration problem.

The real solution (O(n)) is keeping the configuration in environments. Adding new services is then trivial as you don't need
to update all the config in this new service and keep them all manually in sync. This problem is much more
common in places where developers and operations are two separate strictly separate groups. Lack of communication, or control
leads to the sub-par solution. This can be fixed in your company by implementing more DevOps culture.

### 4. Backing services
>Treat backing services as attached resources

This is a common practice already and not something that professional developers get wrong often. The idea is that your
services should be easily interchangeable. If you are referencing them as simple urls with login credentials there is no
reason why they shouldn't be. This will ensure good portability and helps maintain your system.

### 5. Build, release, run
>Strictly separate build and run stages

Before thinking about it, it is worth to note what each of these mean in the context of the Twelve-Factor App:

* Build - converting code repo into an executable bundle known as the build.
* Release - getting the build and combining it with a config on a certain environment- ready to run. This is also often referred to as deployment.
* Run - starting the app in the deployment

Separation of these processes is important to make sure that automation and maintaining the system will be as easy as possible.
This separation is expected by many modern tools as well.

### 6. Processes
>Execute the app as one or more stateless processes

This is another factor, that is at the core of microservices architecture. The idea of stateless services, that can be
easily scaled by deploying more of them is part of the definition what a microservices are. You should not be introducing
state into your services (that should leave in database or [memcached](https://memcached.org/), [redis](https://redis.io/) - for the session information). Simple,
but a crucial consideration when designing your architecture.

### 7. Port binding
>Export services via port binding

This is quite simple- make sure that your service is visible to others via port binding (if you need it visible at all,
possibly it just consumer from a queue). If you built a service, make sure that other services can treat this as a resource
if they wish.

### 8. Concurrency
>Scale out via the process model

As the headline says- this is all about scalability. Tools such as [kubernetes](https://kubernetes.io/) can really help you
here. The idea is that, as you need to scale, you should be deploying more copies of your application (processes) rather
than trying to make your application larger (by running a single instance on the most powerful machine available). Practice has
shown that this is simpler and more resilient approach to do it. Some may argue that the word micro in the microservices hints
at this as well (beside the services being small code-wise).

There is a misconception that modern developers don't need to worry about low level threading considerations. This is wrong,
as most services will have multithreading introduced via multiple request being handled simultaneously. This is a large
enough topic to warrant its own article...

### 9. Disposability
>Maximize robustness with fast startup and graceful shutdown

Fast startup is based on our ideas about scalability and the fact that we decided on microservices. It is important that they can go up
and down quickly. Without this, automatic scaling and ease of deployment, development- are being diminished. This is one
of the factors, where if we don't get it exactly right- the system will still work. However, the goal here is to achieve
resounding success, not just an acceptable compromise.

Graceful shutdowns are arguably more important, as this is about leaving the system in a correct state. The port that was used
should be freed so that the new server can be started, any unfinished task should be returned to the queue etc.

One last thing... Crashes also need to be handled. These will be the responsibility of the whole system rather than just
the service- just don't forget about it.

### 10. Dev/prod parity
>Keep development, staging, and production as similar as possible

The differences between dev and prod can be significantly larger than people realise. It goes beyond the configuration and
data, but also includes:

>* The time gap: A developer may work on code that takes days, weeks, or even months to go into production.
>* The personnel gap: Developers write code, ops engineers deploy it.
>* The tools gap: Developers may be using a stack like Nginx, SQLite, and OS X, while the production deploy uses Apache, MySQL, and Linux.

In fact this is explained in excellent fashion on the original [Twelve-Factor App Section](https://12factor.net/dev-prod-parity).

The differences when it comes to microservices? It may be even more challenging to achieve this parity than it is with other
types of architecture. This is one of the reasons why doing microservices is seen as a challenge. The good news- if you
managed to achieve the previous 10 factors, this one should be significantly easier! The common theme reappearing here
is the need for developer to work closely with operations. The devops culture is one of the requirements for truly
successful microservices.

### 11. Logs
>Treat logs as event streams

This factor more than any other is about excellence rather than adequacy. Success is possible without logs as event streams,
but you will be missing on a dramatic upside here. This is one of the easier things to do, but the pay-off can be significant.
Bringing [Splunk](https://www.splunk.com/) or [Logstash/ELK Stack](https://www.elastic.co/products/logstash) to help
with your logs, can bring dramatic gains. My experience with Splunk changed QA debugging from a dreaded activity (with
many microservices in place) to something that I actually enjoyed!

Trends, alerts, heuristic, monitoring- all of these can come from well design logs, treated as event streams and captured
by one of these technologies. Don't miss out on that!

### 12. Admin processes
>Run admin/management tasks as one-off processes

This is more about managing your app rather than developing services, but it is still important. Admin tasks should
be run from the relevant servers- possibly production servers. This is easiest done by shipping admin code
with application code to provide these capabilities. The tools should be there even if they are not part of the standard
execution of the service. What we try to do here is to isolate dependencies, as Admin processes and tools required
to carry them out are dependencies as well.

## Summary

Even though [The Twelve-Factor App methodology](https://12factor.net) is not new, it became more relevant with
the raise of microservices. [Heroku](https://www.heroku.com/) (the authors), did a great job at defining what
makes a solid baseline for standing up your architectures. If you are designing microservices architecture, have
a good look at these factors and take them seriously- what may appear trivial now, may be of utmost importance when
you are running 20+ services across 6 environments. If you already have microservices to take care of- see if there
are points that you missed and maybe they can help you solve problems that you could not pin down before.

Microservices are still relatively new architecture pattern and I think there is much more to come. Regardless how you
see your system developed, make sure that you start with a solid foundation. Good luck!
