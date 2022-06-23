---
author: ceberhardt
layout: default_post
title: "You probably don’t need a micro-frontend"
summary: "Micro-frontends is a relatively new architectural style for building web-based applications, which as the name suggests, is an extension of the popular microservices pattern. In this blog post I argue that this is a pattern you might not need!"
categories:
  - Tech
image: ceberhardt/assets/microfrontends/microfrontends.png
---

Micro-frontends is a relatively new architectural style for building web-based applications. As the name suggests, they are an extension of the popular microservices pattern where the vertical slice of functionality that a microservice provides is extended all the way to the front-end. The application itself becomes a loosely coupled composition of micro-frontend components, with the pattern promising the same benefits as microservices (incremental upgrades, loose coupling etc.)

Software patterns are not invented in isolation, the good ones tend to be emergent. The software engineering community starts to gravitate towards certain solutions to problems they encounter, with ‘patterns’ representing these solutions in a distilled form. The discovery (as opposed to invention) of patterns doesn’t diminish their importance and significance. Their value is in their ability to succinctly capture the essence of a solution to a common set of problems, and in doing so, give us a shared vocabulary.

At Scott Logic we’ve been building complex front-end applications, predominantly for financial services, for many years. Recently I ‘compared notes’ with a number of engineers who had worked on these applications to see whether a micro-frontend pattern had started to emerge. To my surprise - it hadn’t!

This blog post asks the question why?

## What are micro-frontends?

A typical web-application architecture looks like the following:

<img src="{{site.baseurl}}/ceberhardt/assets/microfrontends/microservices.png"/>

Discrete services (these could be a catalogue service, a shopping cart service, a user profile service) providing domain-specific APIs, which are used to create the front-end application. Each of these services and the front-end has their own codebases, CI/CD pipelines and DevOps practices, and depending on their size or organisational structure may be developed by its own team.

With micro-frontends, the architecture becomes the following:

<img src="{{site.baseurl}}/ceberhardt/assets/microfrontends/microfrontends.png"/>

Rather than services providing data which is consumed by the front-end application, they instead provide ‘content’ in the form of mini applications. Within the context of an e-commerce platform, rather than having a shopping cart service that provides API methods (e.g. list cart contents, add item, remove item), the micro-frontend model would have the shopping cart service deliver the HTML and JavaScript required to render and ‘operate’ the shopping cart. As a result, the front-end application becomes an aggregation of smaller applications, which are the micro-frontends.

The canonical reference for this pattern can be found on [Martin Fowler’s blog](https://martinfowler.com/articles/micro-frontends.html), where they describe micro-frontends as:

> An architectural style where independently deliverable frontend applications are composed into a greater whole

The article describes a number of key benefits to this approach:
 - Incremental upgrades - the ability to evolve a large codebase without the need for a rewrite
 - Simple, decoupled codebases - splitting a large application into smaller pieces makes it easier to manage
 - Independent deployment - to quote, “just as with microservices, independent deployability of micro-frontends is key”, this in turn reduces the scope of each deployment and reduces risk
 - Autonomous teams - decoupling of codebases and release cycles leads to a greater level of autonomy.

It’s no great surprise that these benefits are equally applicable when discussing the merits of a microservice architecture.

The rest of the article on Martin Fowler’s site progresses into a discussion on the implementation of a micro-frontend architecture. 

## Micro-frontend implementations vary

A number of companies have shared their experience of adopting micro-frontends, giving us a better understanding of how this pattern can be applied in practice.

IKEA was one of the first companies to write about this pattern, in an article titled simply [Microservice Websites](https://gustafnk.github.io/microservice-websites/). As the name suggests, this article pre-dates the  term micro-frontend. The challenge they were tackling was quite simply “How can we develop websites where the different parts of the pages are developed by different teams?”. I really like the way that they carefully highlight the “assumptions and constraints” of their specific business, in their case it is a consumer website so “time to interactive” and client browser constraints are both very important. Ultimately they opted for an approach that uses service-side transclusion to compose the component parts of their website.

Spotify is widely reported as having adopted micro-frontends. In contrast to IKEA, which is a shopping website, Spotify delivers a more complex and immersive application-like experience. As a result there is much more runtime interaction between the various micro-frontend components which are assembled to create the application. In support of this, the [application makes use of iframes](https://medium.com/@m.biomee/micro-fronends-spotify-approach-iframes-part-2-bb15c14449bf), with an event bus communicating events and state between these components.

[DAZN are another keen advocate of micro-frontends](https://medium.com/dazn-tech/adopting-a-micro-frontends-architecture-e283e6a3c4f3), which they use throughout their sports subscription streaming services. They describe an approach where a lightweight bootstrap is initially loaded, followed by the required micro-frontend based on routing information. Notably DAZNs application only loads a single micro-frontend at a time, so there is no need for client- or server-side composition of multiple front-end components.

Finally another notable source of information is the [micro-frontends.org](https://micro-frontends.org/) website, created by Michael Geers, the author of the “Micro-frontends in Action” book. The approach described by this website is quite opinionated, for example advocating technology agnostic components - with no shared framework code. In practice this would allow you to build one component in Angular and another in React.

From server-side composition of components that have relatively little client-side interaction, through iframe composition to single-component mounting based on routing, these articles describe very different architectures!

## Why is there such variability?

In the early days, the World Wide Web was primarily used as a way to share static content, a giant digital reference library. However, as browsers become more capable and powerful people started to deliver more interactive experiences over the web. Eventually we reached the point we are at today where the web is the primary distribution mechanism for practically everything - from static content to immersive business-critical applications. 

The technology needs of a simple web-site are very different to that of a web-application as described in Aral Balkan article, the [Document to Application Continuum](https://ar.al/notes/the-documents-to-applications-continuum/).

<img src="{{site.baseurl}}/ceberhardt/assets/microfrontends/continuum.png"/>

On the far left we have static websites, the web of the 90s, mostly free from JavaScript, content-centric, serving text and image content. As we progress along the spectrum from left to right, dynamic websites add a little bit of client-side interactivity, with fewer round-trips to the server. As we move further right we encounter the web-application, behaviour-centric tools, with 1000s of lines of JavaScript. It is here we find standard patterns like ‘Single Page Applications’.

At the very far right is a type of web-application you might not be familiar with, the Portal. These are often found within large organisations such as banks, where multiple applications (trading platform, risk management, operational tools) are hosted on the same web-based platform. Often these are presented as an internal app-store.

When considering this spectrum, another interesting observation is the degree to which these sites / apps require inter-component communication (or in the context of micro-frontends, how much communication is required between each mini application). The inter-component communication is low for interactive websites (e.g. IKEA shopping site), but increases as a more app-like experience is delivered (Spotify). Interestingly this falls off once again at the Portal end of the spectrum - the amount of inter-application communication is modest.

The architectural choices made by Spotify, DAZN, IKEA and others is very much influenced by where they sit on this spectrum.

## The dangers of micro-frontends

So far we have seen that not all micro-frontend architectures are the same, and why. Is this enough evidence to question the validity of this approach? I think so, but there is more!

In my opinion:

**The microservice analogy is a poor fit.** Whilst both microservices and micro-frontends benefit from having teams organising around business capabilities, there are some notable differences. Micro-frontends, by virtue of running within the browser, result in different costs and sacrifices if you allow teams to pick their own tech stack or support independent deployment pipelines.

**Microservices are dangerous.** As an extension of the above point I’ve seen far too many microservice projects that are failing. In almost every case it is due to the inherent complexity of this architecture; too many microservices (often focussed on a single entity rather than a [bounded context](https://martinfowler.com/bliki/BoundedContext.html)), challenges with discoverability, infrastructure as code, deployment pipelines. Often people reach for microservices simply because they believe it is the right way to build systems these days. Micro-frontends have similar characteristics to microservices, they do bring certain benefits, but at a high cost of complexity.

**Patterns that are vague and wooly and inherently dangerous.** I firmly believe that patterns or approaches that cause you to ask more questions than they answer are not good patterns! I believe micro-frontends fall foul of this.

**Ideas need critical mass.** For a pattern to revolve and mature, a significant number of people or companies need to adopt it, test it and learn from it. I just don’t think enough people are using micro-frontends for this to be the case. 

**Micro-frontends assume a specific organisational structure.** There is an assumption in this pattern that teams should own entire front-to-back slices of functionality. In some organisations this makes sense, however, in larger organisations, back-end services often provide data to a myriad of other systems, both front- and back-end. In this context it might not make sense to adopt vertical-slice ownership.

**["There are 11 micro-frontend frameworks you should know"](https://itnext.io/11-micro-frontends-frameworks-you-should-know-b66913b9cd20).** Need I say more? The solution to adopting a slightly vague software pattern that you might not need is not to reach for a framework that claims to implement it!

## So what should you do?

One thing I want to be clear about is that while I have strong reservations around the validity of micro-frontends as a pattern or architectural style, I don’t in any way want to come across as being critical of the articles shared by the teams at IKEA, DAZN and co. These are really interesting articles that describe some excellent architectures that work for their specific contexts. Read them, but please, leave the micro-frontend pattern at the door!

If you are working on a large-scale front-end application, understand the need for scalable teams. Consider how you might create an environment that allows:
 - Fast iterations on some components, slower iterations on others
 - Isolation of functionality
 - The potential for sharing and component re-use across applications
 - Different codebases, with their own build pipelines
 - Create a good developer experience

But in each case, start with the simplest possible solution ([YAGNI](https://martinfowler.com/bliki/Yagni.html)), if you really do need it - consider how this could be achieved given the constraints of your application, and your organisational structure. 

Thanks to [Robat](https://blog.scottlogic.com/rwilliams), [Chris P](https://blog.scottlogic.com/cprice), [Dean](https://blog.scottlogic.com/dkerr), [Sam](https://twitter.com/samhogy) and [Chris K](https://blog.scottlogic.com/ckurzeja) for all their thoughts and ideas on this topic.


