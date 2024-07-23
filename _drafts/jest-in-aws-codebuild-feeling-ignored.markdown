---
title: 'Jest in AWS CodeBuild: feeling ignored'
date: 2024-07-23 13:25:00 Z
categories:
- Testing
tags:
- Jest
- AWS
- CodeBuild
- testing
- Ignore Pattern
- config
summary: Ignore Patterns in Jest config can lead to "no tests found" in CI
author: cwilton
---

[Jest](https://jestjs.io/) is a widely used JavaScript testing framework. It can be used "zero-config" with its sensible defaults, but you can tweak it with numerous configuration options.![jester-grrr.png](/uploads/jester-grrr.png)

I recently wasted a morning trying to work out why my Jest tests were running successfully locally, but weren't even being found when running in AWS CodeBuild. Here's the lowdown in case you ever find yourself in a similar situation.

<img src="/uploads/jester-grrr.png" alt="Angry jester" title="I jest you not" style="display: block; margin: 1rem auto;" />

## Jest Config

As stated in the [Jest configuration docs](https://jestjs.io/docs/configuration#modulepathignorepatterns-arraystring), when adding ignore patterns to your Jest config