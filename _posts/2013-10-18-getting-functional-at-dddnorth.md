---
title: Getting Functional at DDDNorth
date: 2013-10-18 00:00:00 Z
categories:
- Tech
tags:
- Conferences
- DeveloperDeveloperDeveloper
author: shogarth
layout: default_post
oldlink: http://www.scottlogic.com/blog/2013/10/18/getting-functional-at-dddnorth.html
disqus-id: "/2013/10/18/getting-functional-at-dddnorth.html"
summary: Last weekend I had the pleasure of attending this year's DDDNorth conference
  at Sunderland University.
---

Last weekend I had the pleasure of attending this year's [DDDNorth](http://dddnorth.co.uk/) conference at Sunderland University. DDD events are organised by the community, so anyone is free to submit a session. The community votes on which sessions they would like to see at the event. This year's event took on a distinctly functional feel - advocates of wisdom of the crowds, feel free to interpret this as a sign of things to come. I'd like to reflect upon the excellent sessions I attended.

## TDD - Where did it all go wrong? - Ian Cooper
Ian Cooper took a retrospective look at the practice of TDD, going back to the original source, Kent Beck's book. Why is it that test frameworks do not often deliver on the grand promises of TDD? Test suites built upon brittle foundations become an obstacle. Adverse effects of brittle test frameworks includes adding new code, rather than refactoring because it would "break the tests".

Ian's delve into recent history comes up trumps. Kent was not necessarily talking about testing code in isolation, but testing behaviours in isolation. The key point to remember is that you should be able to change the exact implementation of your code during the "refactor" step of TDD, without breaking the tests. Make it run, make it right.

This then becomes an architectural issue: recognizing that brittle tests are tightly coupled to the code they are testing. Ian's introduced [hexagonal architecture](http://alistair.cockburn.us/Hexagonal+architecture) as a way of handling this situation. The focus is on clear separation of concerns across API boundaries. Keeping the domain model separate from the details of the UI, persistence or networking strategy means that code is reusable but testable. The code to glue your domain model, via its APIs, to a particular implementation detail lives in a separate adapter entity. Thus, switching to a command-line UI running an in-memory database for testing purposes is simple.

Ian's talk was a great start to the day. Hexagonal architecture reminded me to be wary of allowing domain logic to cross your API boundary into adapters. Keep it nicely wrapped up and you can write maintainable test cases against it.

## Scaling Systems Architectures - Kendall Miller
Scaling - the ability to perform and cope under an increasing workload. Kendall Miller is adept at breaking down complex topics into transferable chunks of knowledge, with enthusiasm and theatrics. The audience loved his amusing anecdotes about vanishing heavy machinery and an interpretation of the 'SQL Walk of Shame'. How much work is actually involved to say "Hi, Bob!" at the top of a webpage? Quite a lot, it turns out!

Scaling systems comes down to four core concepts; the first three which aid scalability, the fourth hampers it:
+ **Asynchrony** - taking work out of the critical path and doing it later.
+ **Caching** - Do less work! Authoritative information is time consuming. Oftentimes it is not needed. Software and hardware deploy multiple levels of caching, simply to avoid costly operations.
+ **Distribution** - get as many people to do the work as you can. Where possible, utilise parallelism to scale outwards, across multiple systems. This also applies to geographical distribution, of databases, servers and processes.
+ **Consistency** - the more shared state that a system shares, the harder it is to scale out. Shared states require locks. Waiting on locks wastes processor cycles that could be used for more important work.

From these four pillars, it is possible to deploy scaling strategies. Kendall's pragmatic advice for the developer looking to scale a system is to tailor your strategy to your business requirements - don't go looking for "one size fits all" solutions. Kendall's in-depth knowledge of real-world examples helped solidify this concept. For example, Amazon operates on a global scale. It can geographically distribute its database of orders, order number generation and order processing geographically. There is no nasty singleton living somewhere on one Amazon server, generating unique monotonically-increasing order numbers.

## WTFP?! Functional Programming and Why You Should Care - Grant Crofton
Grant's talk focused on the concepts of functional programming, with examples in F#. The functional programming paradigm has a long history - with roots in 1930s lambda calculus. This style is becoming popular once again. Languages like Scala and Clojure, both of which run on the JVM, are reaching a sufficient level of confidence in order for [ThoughtWorks](http://www.thoughtworks.com/radar) to advise adopting them in production applications.

Where functional programming stands strong is with a declarative approach to programming. Problems are described closer to the problem domain, with the language dealing with the implementation particulars. Grant introduced several concepts, such as expressions, parallelism, immutability and higher-order functions. For each section, a problem was addressed in two ways. First, Grant presented an imperative approach in C# and compared this to the corresponding F# declarative implementation. Sometimes, just for kicks, Grant would show an imperative solution in F#, just to show it is possible and to demonstrate how well it interacts with C#.

As a means of quick introduction to functional programming and the F# language, this talk was particularly useful. Unfortunately, I didn't get the opportunity to see Phil Trelford's "F# Eye for the C# Guy" talk, but from fellow conference-goers I heard that these were two great complementary sessions.

## Tyrannosaurus Rx - John Stovin
Reactive Extensions (Rx) is a .NET library used to simplify the handling of asynchronous, event-driven programs. Rx is built upon the classic "Gang of Four" Observer pattern, where you have an observer wrapping a data source. Subscribers are notified when updates to the source occur and react accordingly. Rx allows for LINQ-style operations (such as filtering) to be applied in response to subscription notifications. Where concurrency is needed, Rx integrates tightly with schedulers. Once again, the functional, declarative approach shines through.

John's talk focused on covering the basics of Rx, explained succinctly with a trusty whiteboard and [marble diagrams](http://rxwiki.wikidot.com/marble-diagrams). The session was very use-case oriented, which is an effective way of demonstrating the benefits of a library. One particular example concerned sampling and interpreting a user's mouse movements, which was scaled to support clicking and dragging.

With hindsight, I would have loved to see how an example of how Rx integrates with C#5's async and await mechanisms; but overall I'm impressed with how easy reactive extensions are to use and how simple they make your code. In fact, when you then see the old way of doing things - manually hooking up event listeners with delegates, maintaining state and so on - it just seems dated. Rx seems to fit perfectly. Rx now has a life of its own outside .NET land - the library has been open-sourced and is frequently ported to other languages.

## You've Learned the Basics of F# - What's next? - Ian Russell
Ian's talk took a deep dive into F#, to show how it can aid developers quickly create scalable applications. This was a fantastic end of day session, building upon the core concepts from Grant's session. The focus was on two particular concepts:

- **Type Providers** are a quick, easy and flexible way of pulling content out of SQL, JSON, CSV, XML and much more. The functional paradigm suits this particularly well, providing an elegant means of selecting, filtering and operating on data pulled from a source. Type Providers integrate well into Visual Studio, exposing via Intellisense types, properties and methods pulled directly from the data source!

- **The MailboxProcessor** is an asynchronous message queue and handler which runs on its own thread. Any other thread can post messages to the mailbox processor agent, which may also reply back. MailboxProcessor is thus a very lightweight means of inter-process communication, requiring little boilerplate code. To demonstrate the usefulness of this functionality, Ian created a simple example of sending 100,000 asynchronous messages to the MailboxProcessor agent. Following on from this, the example was scaled up into a full chat room service!


## Summary
DDD events are always high quality. This year's DDDNorth was no exception! My thanks go out to Andrew Westgarth and co for organising the event. As a developer, DDD events around the country are a great way to delve into concepts you may not normally have the time to investigate, network with developers around the country and eat far too much food at the Geek Dinner. I always come home brimming with ideas, but also with great insights on everyday practice. I highly recommend that you come along next year - remember to say hi!

























