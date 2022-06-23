---
title: WebAssembly - and the Death of JavaScript?
date: 2018-02-27 00:00:00 Z
categories:
- ceberhardt
- Tech
tags:
- featured
author: ceberhardt
summary: This talk, from JSMonthly, looked at what's wrong with the way we are using
  JavaScript today and why we need WebAssembly.
layout: video_post
video_url: https://www.youtube.com/embed/pBYqen3B2gc
image: ceberhardt/assets/featured/wasm.png
short-author-aside: true
---

For more than 20 years JavaScript has been the only 'native' language of the web. That's all changed with the release of WebAssembly. This talk will look at what WebAssembly is, why it matters and crucially what it means for JavaScript and the future of web development. JavaScript brought interactivity to the web more than 20 years ago, and despite numerous challengers, it is still the only language supported by browser. However, as those 20 years have passed we've moved from adding a little interactivity to largely static sites, to creating complex JavaScript-heavy single page applications. Throughout this journey, the way we use JavaScript itself has also changed. Gone are the days of writing simple code snippets that are run directly in the browser. Nowadays we transpile, minify, tree-shake and more, treating the JavaScript virtual machine as a compilation target.

The problem is, JavaScript isn't a very good compilation target, because it simply wasn't designed to be one.

Born out of asm.js, a somewhat crazy concept dreamt up by Mozilla, WebAssembly was designed from the ground-up as an efficient compilation target for the web. It promises smaller payloads, rapid parsing and validation and consistent performance ... and it's ready to use, right now!

This talk will look at what's wrong with the way we are using JavaScript today and why we need WebAssembly. It will delve into the internals, giving a quick tour of the WebAssembly instruction set, memory and security model, before moving on to the more practical aspects of using it with Rust, C++ and JavaScript. Finally we'll do some crystal-ball gazing and see what the future of this rapidly evolving technology might hold.

