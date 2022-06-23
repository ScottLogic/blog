---
title: 'White Paper: The Web Assembles'
date: 2018-04-24 00:00:00 Z
categories:
- ceberhardt
- Resources
tags:
- featured
author: ceberhardt
contributors:
- cprice
layout: default_post
summary: WebAssembly is a new runtime for the web; a fast and efficient compilation
  target for a wide range of languages that could have a far-reaching impact on the
  web as we know it. This paper looks at at the performance limits of JavaScript and
  how WebAssembly was designed to tackle them.
image: ceberhardt/assets/featured/webassembly.png
cta:
  link: http://blog.scottlogic.com/ceberhardt/assets/white-papers/the-web-assembles.pdf
  text: Download the White Paper
---

JavaScript has been the only truly native and universally supported language on the web for more than twenty years. That's quite an achievement for a language that was created in just 10 days!

Yet despite the runaway success of JavaScript, the language does have its flaws. The quirks and idiosyncrasies of JavaScript are [very well known]({{site.baseurl}}/2015/07/02/surprising-things-about-js.html), however, the problems run deeper.

<a href="{{site.baseurl}}/ceberhardt/assets/white-papers/the-web-assembles.pdf"><img src="{{site.baseurl}}/ceberhardt/assets/featured/webassembly.png"/></a>

This white paper looks at how JavaScript works within the context of modern web applications, and shows that despite the advanced nature of out tooling, the way code is delivered and executed within the browser is surprisingly inefficient.

> the Web has become the most ubiquitous application platform ever, and yet by historical accident the only natively supported programming language for that platform is JavaScript - [Haas et al., PLDI 2017](https://github.com/WebAssembly/spec/blob/bbb26c42b62096baff86089767531c3b1f108a85/papers/pldi2017.pdf)

WebAssembly is a new runtime for the web; a fast and efficient compilation target for a wide range of languages, that was specifically designed to address these issues. This paper looks at at the performance limits of JavaScript and how WebAssembly was designed to tackle them. We then consider the impact of WebAssembly on JavaScript and the wider web platform, making a number of predictions about the future of the web - and the potential demise of JavaScript!

If you are interested in reading more, download our white paper: ["The Web Assembles" - in PDF format]({{site.baseurl}}/ceberhardt/assets/white-papers/the-web-assembles.pdf).
