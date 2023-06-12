---
title: JSNation conference 2023
date: 2023-06-12 12:30:00 Z
categories:
- Tech
summary: I recently spent some time remotely attending JSNation, a hybrid-format JavaScript
  conference held in Amsterdam alongside sister conference React Summit. In this post,
  I'll cover some points of interest from around half the talks I chose to attend.
author: rwilliams
---

I recently spent some time remotely attending [JSNation](https://jsnation.com/), a hybrid-format JavaScript conference held in Amsterdam. With two tracks running over two days, there were plenty of talks to choose from, and plenty more available at sister conference [React Summit](https://reactsummit.com/) around the same dates by the same organisers. It was a very good and professionally-run conference.

In this post, I'll cover some points of interest from around half the talks I chose to attend.

Recordings will be publicly released on the [GitNation portal](https://portal.gitnation.org/events/jsnation-2023) over the next few weeks.

## Building a Web-App: The Easy Path and the Performant Path. Why Are They Not the Same?

Miško Hevery gave his take on the issue of shipping ever-increasing JavaScript payloads to browsers, and presented a solution in the form of the [Qwik](https://qwik.builder.io/) framework. He showed that while server-side rendering combined with hydration can make content appear earlier, it actually delays that content becoming interactive because there's a larger combined amount of HTML and JavaScript that needs to be downloaded. A better solution would solve this without requiring a trade-off of code simplicity for performance, by pushing the optimisation work into the framework and compiler. The Qwik framework seeks to do this using techniques including [resumability](https://qwik.builder.io/docs/concepts/resumable/) and code extraction.

![misko.PNG](/uploads/misko.PNG)

## Dialog Dilemmas and Modal Mischief: A Deep Dive Into Pop-Ups

Hidde de Vries' lightning talk covered how to do "above the page" UI elements on the modern web - dialogs, popovers, and tooltips. There are new experimental HTML elements and attributes that let the browser take more responsibility for these and to do them in a more accessible way. It's great to see progress on enhancing the platform with such basic capabilities, but I expect we'll be using libraries for a good while yet until related functionalities (e.g. positioning of popovers) are included and browser support becomes widespread.

## Maintaining a Component Library at Scale

In this lightning talk, Joran Quinten told the story of introducing a component library in his organisation. From the beginning, they laid down some principles including not having a bottleneck - which meant not having a dedicated team. As things evolved, some snags came to light with this distributed approach, which led them to a hybrid approach with a central core team to shepherd the product long-term and to guard quality.

![joran.PNG](/uploads/joran.PNG)

## AI and Web Development: Hype or Reality

Wes Bos kicked off his talk with some examples of how he's been using GitHub Copilot to help him with some coding tasks, ranging from generating dummy data, to converting promise/callback hell into async/await, to writing a function that satisfies some tests he'd written. He observes that key advantages over looking up answers/solutions online are that it's faster, and that it can use the context it has around your problem to give a tailored outcome. The second segment of the talk covered how he used different AI to transcribe and summarise the [Syntax.fm](https://syntax.fm/) podcast - surfacing a large amount of information from the audio back-catalog and making it discoverable.

![wes.PNG](/uploads/wes.PNG)

## How I Like to Write JavaScript

Caleb Porzio showed us some of the coding patterns he uses in the implementation of the [Alpine.js](https://alpinejs.dev/) library. Starting with a basic implementation of a core part of the library, he iteratively refactored it over the course of the talk. He often uses the "refactor by wishful thinking" approach, writing the code he wants to exist at one point, then moving on to writing the functions etc. around it that don't yet exist. It was nice to see his advocacy for these "micro patterns" (my naming), including: returning early for preconditions, returning cleanup functions from setup functions, and passing parameters to callbacks using a single parameters object.

## Three Ways to Automate Your Browser, and Why We Are Adding a Fourth: WebDriver BiDi

Michael Hablich presented the history and the future direction of how we drive browsers from automated tests. Approaches fall into high-level, where JavaScript code is injected into the browser (used by e.g. Cypress); and low-level, where remote commands are sent to the browser over some protocols (WebDriver Classic or Chrome DevTools Protocol (CDP)). Looking at the low-level approaches, he compared WebDriver Classic and CDP and explained the pros and cons of each. Finally he presented the new WebDriver BiDi (BiDirectional) which uses the good parts of both the aforementioned, and is expected to succeed CDP for test driver use cases.

![michael.PNG](/uploads/michael.PNG)

## The State of Passwordless Auth on the Web

Phil Nash compared the usability and security of various authentication options, including the [Credential Management API](https://developer.mozilla.org/en-US/docs/Web/API/Credential_Management_API), [WebOTP](https://developer.mozilla.org/en-US/docs/Web/API/WebOTP_API), and [WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API). He showed how the ultimate solution that might finally replace passwords is passkeys, which uses public key cryptography synchronised between the user's device, but is still usable on non-synchronised devices. You can try out passkeys at [passkeys.io](https://www.passkeys.io/), and find sites/applications that already support them at [passkeys.directory](https://passkeys.directory/).

![phil.PNG](/uploads/phil.PNG)

## HTTP/3 Performance for JS Developers

Robin Marx explained what HTTP/3 means for application layer developers. Tuning for good performance is much the same as with HTTP/2, in contrast to how practices changed when HTTP/2 arrived. He showed how different browsers differently prioritise resource loading, and how we can use the `fetchpriority` attribute on tags and `priority` option to `fetch()` to influence this. Next, he covered how [HTTP 103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) allow CDNs to inform the browser of resources that need to be loaded, earlier than the page markup can be fetched and delivered from the origin server. Finally he explained [WebTransport](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API), a new companion to Web Sockets that provides access to lower-level socket features.

![robin.PNG](/uploads/robin.PNG)

## What’s New in Node?

Hemanth HM gave a tour of recent and upcoming/experimental new features in Node.js. As someone who currently uses Node.js as a tooling platform, the highlights for me were:

* Permissions model, which should constrain the damage that rogue modules from NPM can do (supply chain attacks).

* Top-level await

* Built-in test runner

* Many promisified APIs

* Native fetch API

* Native command line argument parsing

## Web Push Notifications Done Right

Maxim Salnikov's lightning talk was about being thoughtful and respecting the user while using [web push notifications](https://web.dev/notifications/). He presented some UX patterns for both subscribing to a notifications, and later creating informative and useful notifications. I consider this talk to be mandatory watching for anyone using this API. You can use the playground at [push.foo](https://push.foo/) to try them out.

![maxim.PNG](/uploads/maxim.PNG)

## Static Analysis in JavaScript: What’s Easy and What’s Hard

Elena Vilchik explained the scale of complexity of static code analysis, from text-based analysis, to abstract syntax trees, through to control flow and data flow analysis. Most quality rules can be implemented using lower-complexity techniques, but she showed some interesting more difficult examples/problems such as detecting a "dead store" to a variable, and the lack of type information. The Pareto (80/20) principle applies for any rule - she explains that a simple implementation will detect most issues without causing problems in most cases, however a lot of effort is required to handle options and special cases such as new language features, and patterns encouraged by certain frameworks.

## JavaScript Source Maps, Can We Do Better?

Kamil Ogórek explained why source maps are so hard to get right, and what's finally being done to solve that. Two big problems services such as [Sentry](https://sentry.io/) (where he works) have to deal with are the lack of identity for files beyond the name (e.g. location in directory, version), and finding the scope/caller of where an error is thrown. There are also a more than a handful of smaller issues that make things more difficult than they should be, such as browser inconsistencies in error call stacks. The sourcemap specification hasn't been updated for around 10 years despite all the other language developments in that time, however there is now a TC39 outreach working group that's working to change that.

## More conferences in 2023

If you're looking for a conference to attend, the directory sites [confs.tech](https://confs.tech/) and [dev.events](https://dev.events/) are good places to start looking. When you've found a few candidates, I'd recommend taking a bit of time to look past the marketing to make sure the content/schedule is what you want (if it isn't yet published, look for past years' schedules or videos).