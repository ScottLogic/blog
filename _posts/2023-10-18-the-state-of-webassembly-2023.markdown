---
title: The State of WebAssembly 2023
date: 2023-10-18 16:01:00 Z
categories:
- Tech
summary: This blog posts shares the results of the third annual State of WebAssembly
  survey, where we found that Rust and JavaScript usage continues to increase, but
  there is a growing desire for Zig and Kotlin. The use of wasm as a plugin environment
  continues to climb,  with developers hoping it will deliver of the “write once and
  run anywhere” promise.
author: ceberhardt
image: uploads/wasm-language-usage.png
---

The State of WebAssembly 2023 survey has closed, the results are in … and they are fascinating!

If you want the TL;DR; here are the highlights:

* Rust and JavaScript usage is continuing to increase, but some more notable changes are happening a little further down - with both Swift and Zig seeing a significant increase in adoption. 
* When it comes to which languages developers ‘desire’, with Zig, Kotlin and C# we see that desirability exceeds current usage
* WebAssembly is still most often used for web application development, but serverless is continuing to rise, as is the use of WebAssembly as a plugin environment. 
* Threads, garbage collection and the relatively new component model proposal, are the WebAssembly developments that people are most interested in.
* Whereas with WASI, it is the I/O proposals (e.g. HTTP, filesystem) that garner the most attention.
* We are potentially seeing some impatience in the community, with the satisfaction in the evolution of WAI being notably less than the satisfaction people express in the evolution of WebAssembly.
* Many respondents shared that they expect WebAssembly to deliver on the “write once and run anywhere” promise that was originally made by Java.

(If you want to look back, here are the [2021](https://blog.scottlogic.com/2021/06/21/state-of-wasm.html) and [2022](https://blog.scottlogic.com/2022/06/20/state-of-wasm-2022.html) results)

Interested to learn more? Then read on …

## Language

The first question explored which languages people are using by asking the question _which languages do you use, or have you tried using, when developing applications that utilise WebAssembly?_

![wasm-language-usage.png](/uploads/wasm-language-usage.png)

For the third year running, Rust is the most frequently used language for WebAssembly. Rust has always been a good fit for WebAssembly; it is a modern system-level language that has broad popularity (the Stack Overflow revealed it is the most desired language seven years in a row), it also happens to be a popular language for authoring WebAssembly runtimes and platforms.

JavaScript is the second most widely used language, which is quite notable considering that you cannot compile JavaScript to WebAssembly. To run JavaScript code, the runtime is compiled to WebAssembly, with your code running within the WebAssembly-hosted interpreter. This approach, which might sound inefficient, is surprisingly practical and increasingly popular. You may not get a speed advantage, but do benefit from the security and isolation benefits of WebAssembly. For further details, I’d recommend this [in-depth article from the Shopify team](https://shopify.engineering/javascript-in-webassembly-for-shopify-functions) which describes how they support ‘Shopify functions’ written in JavaScript, which run on a WebAssembly platform. 

The following chart shows the long-term trends, comparing the results from the last three surveys, with the percentage of people using each language (frequently or sometimes) - excluding those with &lt;10% usage.

![wasm-language-usage-trends.png](/uploads/wasm-language-usage-trends.png)

Usage of Rust and JavaScript is increasing, but some more notable changes are happening a little further down. Both Swift and Zig have seen a significant increase in adoption. 

Swift is a relatively recent addition to the WebAssembly ecosystem, starting a few years ago with a [pull request on Apple’s Swift repo](https://github.com/apple/swift/pull/24684) to add a wasm target. However, despite having numerous commits over many years, this PR hasn’t been merged. It looks like the community is undeterred and are [maintaining their own fork](https://swiftwasm.org/).  

While Swift and Rust are both quite new languages (2014 and 2015 respectively), Zig is even younger, having emerged in 2016, which makes it one year older than WebAssembly (which had its first MVP release in 2017).

This year I added a new question to the survey which asked _what is your professional relationship with WebAssembly?_ With a goal of separating responses from people who are actively developing WebAssembly tools, or platforms and those who are simply end users. Separating these two groups, we see the following language preferences:

![wasm-language-use-end-user.png](/uploads/wasm-language-use-end-user.png)

As expected, tool developers have a strong preference for Rust, and also enjoy programming WebAssembly directly using WAT (WebAssembly Text Format). There is also a strong preference for Go and Python - which is something I wasn’t expecting.

The next question in the survey explored how desirable each language is by asking the question _which languages do you want to use in the future to develop applications that utilise WebAssembly?_

![wasm-language-desire.png](/uploads/wasm-language-desire.png)

Once again, Rust comes out top, reflecting the findings of the annual Stack Overflow survey, with JavasScript in second. However, Zig, which is somewhat infrequently used, is the third most desired language.

Plotting the delta for each language, between the number of “frequently used” responses and “want to use a lot”, for desirability, we can see which languages have the biggest difference in desirability vs. usage:

![wasm-desire-vs-use.png](/uploads/wasm-desire-vs-use.png)

At one end of the spectrum, Zig, Kotlin and C# we see that desirability exceeds current usage, whereas at the other end, people would prefer to use less C++, JavaScript and WAT.

## Runtime

Considering that non-browser based usage of WebAssembly on the climb, it’s interesting to explore which runtimes people are using, or are simply aware of, the survey simply asked _which have you heard about or used?_

![wasm-runtime-usage.png](/uploads/wasm-runtime-usage.png)

[wasmtime](https://github.com/bytecodealliance/wasmtime), from Bytecode Alliance is the most widely used, with [wasmer](https://wasmer.io/), which is developed by a start-up, coming in second. [Wazero](https://wazero.io/) is a new addition to the list, a recently released runtime built in Go.

## Practical applications of WebAssembly

The survey asked _what are you using WebAssembly for at the moment?_, allowing people to select multiple options and add their own suggestions. Here are all of the responses, with ‘Other’ including everything that only has a single response:

![wasm-applications.png](/uploads/wasm-applications.png)

Web application development is still at the top, but the gap is closing. The following chart reveals the year-on-year trends:

![wasm-application-trends.png](/uploads/wasm-application-trends.png)

Serverless is continuing to rise, but perhaps the most notable shift is the use of WebAssembly as a plugin environment. Here are some real-world examples:

* Zellij is a developer-focussed terminal workspace that has a [WebAssembly plugin model](https://zellij.dev/news/new-plugin-system/)
* Microsoft Flight Simulator allows you to [write add-ons as wasm modules](https://docs.flightsimulator.com/html/Programming_Tools/WASM/WebAssembly.htm)
* Envoy and Istio have a [Wasm Plugin API](https://istio.io/latest/blog/2021/wasm-api-alpha/)
* Lapce, a new IDE written in Rust, has a [WASI-based plugin system](https://lapce.dev/)

In each case, the platform (terminal, editor, flight simulator, proxy) benefits from allowing end-users to extend the functionality, using a wide range of programming languages, in an environment that is safe and isolated. In other words, if someone writes a plugin that misbehaves, or simply has poor performance, the impact on the platform itself is minimised.

We also asked respondents - _what’s the status of your organisation’s WebAssembly adoption?_

![wasm-org-usage.png](/uploads/wasm-org-usage.png)

From the above chart we can see that 41% of respondents are using WebAssembly in production, with a further 28% piloting or planning to use it in the next year.

The survey also explored what WebAssembly needs to help drive further adoption:

![wasm-needs.png](/uploads/wasm-needs.png)

The most frequently cited ‘need’ was better non-browser integration, through WASI (WebAssembly System Interface). The WebAssembly specification doesn’t define any host integration points, whether this is how you access the DOM, or exchange data with the host runtime (e.g. pass values to JavaScript within the browser). WASI is plugging this gap, but doesn’t have a complete answer just yet.

Better debugging support is a very close second, which will become more important as people develop more complex solutions with WebAssembly. For a good overview options, check out [this blog post from the Shopify team](https://shopify.engineering/debugging-server-side-webassembly).

## Features, features, features

Both WebAssembly (which is managed by W3C) and WASI (managed by a sub-organization of the WebAssembly Community Group of the W3C) are constantly evolving, with a backlog of new features that follow the standard 5-phase proposal process.

Regarding WebAssembly proposals, the following shows which are the most desired:

![wasm-feature-desire.png](/uploads/wasm-feature-desire.png)

Threads, garbage collection and exception handling were all at the top in last year's results, and all three are at implementation (phase 3) or standardisation (phase 4) in the proposal lifecycle. This means they are ready to use, and close to finalisation.

Component model is a much more early-stage proposal (phase 1), with a broad ambition to make it much easier to compose wasm modules, written in any language, at runtime. If you’re interested in the details, I’d recommend this [video from Luge Wagner](https://www.youtube.com/watch?v=phodPLY8zNE), who is leading on the proposal.

Regarding WASI proposals, the following shows which are the most desired:

![wasi-feature-desire.png](/uploads/wasi-feature-desire.png)

The four top proposals are all I/O related, quite simply, creating a standard way for WebAssembly modules to communicate with the outside world is a priority.

Finally, we asked how satisfied people are with the evolution of WebAssembly and WASI:

![wasm-wasi-satisfaction.png](/uploads/wasm-wasi-satisfaction.png)

There are a significant number of people who are not satisfied! This isn’t at all surprising, evolving specifications, that have so many stakeholders, in an open and transparent fashion is not easy and takes time. What is probably more notable is that generally speaking, people are less satisfied with the evolution of WASI.

I do want to make an important point here; this result should not be used as a direct criticism of the fantastic efforts the WASI and WebAssembly groups are making.  The lack of satisfaction in the evolution of WASI could simply be a reflection of the eagerness people have for the technology, which is not a bad thing. 

Earlier this year Wasmer announced [WASIX](https://wasmer.io/posts/announcing-wasix), which is their attempt to accelerate WASI (or the concepts it represents), to a mixed response.

## And finally

I asked people _what is the thing that excites you most about WebAssembly?_ And almost half the respondents shared their thoughts, far more than I can realistically reproduce here. So, I did the most sensible thing, I asked ChatGPT to summarise the key themes:


 * Portability and the ability to run code on different platforms
 * Interoperability between different languages and the web
 * Native performance and efficiency
 * Access to existing code and libraries
 * The potential for new languages and tools
 * Security and sandboxing capabilities
 * The ability to replace containers and run complex stacks in the browser
 * The potential for a universal binary format
 * The opportunity to write once and run anywhere
 * Improved performance and speed
 * The component model and the ability to reuse code
 * The reduction or elimination of JavaScript dependence
 * More flexibility and choice in language selection
 * The potential for a plugin system
 * The potential for running complex applications in the browser

Thank you to everyone who shared their thoughts, much appreciated.

If you want to explore the data, feel free to [download the dataset](https://wasmweekly.news/data/state-of-webassembly-2023.csv), please do attribute if you reproduce or use this data.



