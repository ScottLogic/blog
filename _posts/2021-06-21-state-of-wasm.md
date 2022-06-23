---
title: The State of WebAssembly 2021
date: 2021-06-21 00:00:00 Z
categories:
- ceberhardt
- Tech
author: ceberhardt
layout: default_post
summary: This blog post shares the results of the first State of WebAssembly Survey,
  with results from 250 respondents surveyed in June 2021. We find that Rust is the
  most frequently used and most desired WebAssembly language and many other interesting
  results
image: ceberhardt/assets/state-of-wasm/current-language.png
---

This blog post shares the results of the first State of WebAssembly Survey, with results from 250 respondents surveyed in June 2021. For those of you who just want some quick soundbites, here are the main findings: 

 - Rust is the most frequently used and most desired WebAssembly language.
 - AssemblyScript is the second-most desireable WebAssembly language.
 - WebAssembly is expected to have a significant impact within Web, Serverless, Gaming and Containerisation applications.
 - Better debugging support is the area that people feels needs most attention.

 For more detailed analysis and lots of charts, read on ...

## Introduction

WebAssembly is a relatively new technology, with the final draft specifications published by W3C in 2018. It was originally conceived as a new runtime, with multi-language support, that provides near-native execution speeds within the browser, and has certainly delivered on that promise.

I started the [WebAssembly Weekly newsletter](https://wasmweekly.news/) almost four years ago and have enjoyed watching this technology mature and evolve. Early newsletter issues focussed on tooling development and experimentation, while more recent issues have focussed on extending the capabilities of WebAssembly and commercial products that have fully embracing this technology. However, probably the most notable change in this four year period has been the success this simple, lightweight and secure runtime has found outside of the browser. These days I'm seeing more articles on serverless, containerisation or blockchain applications than I am on browser apps.

With this in mind, it felt like the time was right to run the very first State of WebAssembly survey (with a hat tip to the [State of JS](https://stateofjs.com/) survey which was a great source of inspiration) to find out more about where people are using this technology, how they’re using it and their thoughts for the future.

## Language

First, we'll explore the languages people are currently using for WebAssembly.

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/current-language.png"/>

Rust, at 26%, is the most frequently used language, followed by C++ then AssemblyScript.  

What are the reasons behind Rust's success? To my mind they are two-fold, firstly, Rust is a very popular language among developers, achieving the status of ['most loved' language](https://stackoverflow.blog/2020/01/20/what-is-rust-and-why-is-it-so-popular/) in StackOverflow's developer survey four years running. Secondly, and perhaps more importantly in this instance, Rust is currently a good 'fit' from a technology perspective for WebAssembly. It doesn't require garbage collection, it creates lightweight binaries, the tooling and community support is strong.

I recall [Michael Gattozzi writing back in 2017](https://blog.mgattozzi.dev/rust-wasm/):

> We're poised to be THE language of choice for wasm.

It was the right place, and right time for Rust.

Second place goes to C++, which through the [Emscripten toolchain](https://emscripten.org/), was the first language to provide support for WebAssembly. It is also a popular choice for game development.

Looking at results across all the languages, we can see how frequently respondents are using WebAssembly: 

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/webassembly-frequency.png"/>

Close to 47% are frequent users.

The survey also asked for other languages that people were using, with a small number (<2% in each case) indicating that they used Kotlin, Elixir, or C++ via Cheerp.

The next question asked *which languages do you most want to use in the future for WebAssembly development?*

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/desired-language.png"/>

Again, no great surprises, with the ever-popular Rust language topping the desirability charts. Compared to the previous chart on language usage, AssemblyScript overtakes C++ moving into second place. For those of you who are unfamiliar with [AssemblyScript](https://www.assemblyscript.org/), it is a new TypeScript-like language that has been designed specifically for WebAssembly. 

Blazor also loses one place, being narrowly overtaken by Go. In my experience, there is a lot of excitement around Blazor, which was officially released by Microsoft last year. Although it is probably most appealing to people migrating WPF and Windows Forms applications to the browser.

## WebAssembly Applications

Next up, we'll explore what people are using WebAssembly for, and their future aspirations.

The survey asked *what are you using WebAssembly for at the moment?*, allowing people to select multiple options and add their own suggestions. Here are all of the responses, with 'Other' including everything that only has a single response:

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/wasm-usage.png"/>

Most people are using WebAssembly for web application development. In a future survey it might be a good idea to explore more specifically how and where they are using it on the web.

WebAssembly is still a relatively young technology and we are still discovering where it will have an impact. The next question explores this by asking *where do you think WebAssembly will have the most impact in the future?*

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/future-impact.png"/>

The results show that 69% believe WebAssembly will have a very high impact on web development in the future.

However, the survey respondents expect WebAssembly to have a significant impact across quite a wide range of different application areas, and Serverless leads the way with 56% seeing this as a high impact application.

The significance of WebAssembly as a universal runtime was most aptly described in this oft-quoted tweet from one of the co-founders of docker:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If WASM+WASI existed in 2008, we wouldn&#39;t have needed to created Docker. That&#39;s how important it is. Webassembly on the server is the future of computing. A standardized system interface was the missing link. Let&#39;s hope WASI is up to the task! <a href="https://t.co/wnXQg4kwa4">https://t.co/wnXQg4kwa4</a></p>&mdash; Solomon Hykes (@solomonstre) <a href="https://twitter.com/solomonstre/status/1111004913222324225?ref_src=twsrc%5Etfw">March 27, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Interestingly a significant number of people indicated that they just don't know what the future impact of WebAssembly will be to blockchain applications. WebAssembly is gaining significant traction in the blockchain community, and is [on the roadmap for Ethereum 2.0](https://medium.com/chainsafe-systems/ethereum-2-0-a-complete-guide-ewasm-394cac756baf). I guess many people simply don't feel they understand blockchain!

## WebAssembly Features and Needs

WebAssembly was initially released as a Minimum Viable Product (MVP), with an initial feature-set focussed on C++ use-cases and migration of pre-existing C++ codebases. Since then, new runtime features have been added, including 
mutable globals and multi-value returns. However, there are some [much bigger new features on the roadmap](https://github.com/WebAssembly/proposals).

The next question asks *what future WebAssembly features are you interested in?*

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/webassembly-features.png"/>

Threads come out on top. This [proposal](https://github.com/WebAssembly/threads/blob/master/proposals/threads/Overview.md) adds support for atomic memory operations and shared linear memory, allowing WebAssembly modules to operate within threaded execution environments. Notably, this proposal doesn't include operations that allow WebAssembly modules to spawn threads directly. I do wonder whether people are aware of this limitation?

Next up is WebAssembly System Interface (WASI), a specification, led by the [Bytecode Alliance](https://bytecodealliance.org/), that is adding various out-of-browser capabilities. Followed by Interface Types, a proposal that makes it much easier for modules written in different languages to communicate directly with each other.

I was a little surprised to see Garbage Collection so low down people's priority list. Languages such as C# and AssemblyScript have to ship their own garbage collector as part of the WebAssembly modules. This proposal opens the door to integration with the host garbage collector, resulting in smaller, more efficient modules.

The next question asked *what do you feel WebAssembly most needs to be a success in the future?*

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/wasm-needs.png"/>

Top of people's priority list was better debugging support. There is a real lack of consistency in tooling here, with some using sourcemaps, and others using [DWARF](http://dwarfstd.org/). In most cases debugging via breakpoints, stack traces and inspection of local variables, is just not possible.

On the flip-side, language support is not a priority, most languages compiled to WebAssembly in some shape or form. We don't need to add any new ones, we just have to improve the developer experience of the ones that are supported already ... which is a lot easier said than done.

## Demographics

Finally, the survey included a few questions that outline the demographics. I'll briefly share those results here.

Respondents were asked to declare their skill level in JavaScript, Back-end and WebAssembly development:

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/skill-level.png"/>

They were also asked about how long they had been using, or had known about, WebAssembly for. Most were quite new to this technology:

<img src="{{site.baseurl}}/ceberhardt/assets/state-of-wasm/wasm-experience.png"/>

The survey received results from 196 countries, with the most from USA (21.8%), then China (9.1%) and Germany (9.1%)

## Conclusions

Thanks to everyone who participated in this survey. The results are [available as a CSV file](https://wasmweekly.news/assets/state-of-webassembly-2021.csv) if you wish to do your own analysis. If you uncover any interesting results, please do share them.

If you have any comments, suggestions or ideas for future surveys, please share via the [Hacker News discussion thread](https://news.ycombinator.com/item?id=27578123).

I look forward to making this an annual event.

Regards, Colin E.