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

[Jest](https://jestjs.io/) is a widely used JavaScript testing framework. It can be used "zero-config" with its sensible defaults, but you can tweak it with numerous configuration options.

I recently wasted a morning trying to work out why my Jest tests were running just fine locally, but weren't even being found when running in AWS CodeBuild:

    > jest
    
    No tests found, exiting with code 1
    Run with `--passWithNoTests` to exit with code 0
    No files found in /codebuild/output/src323229886/src/backend.

After throwing in a heap of debugging, and even toying with [CodeBuild breakpoints](https://docs.aws.amazon.com/codebuild/latest/userguide/session-manager.html#ssm-pause-build), I inevitably reached my facepalm moment. And boy did I feel silly...

<img src="/uploads/jester-grrr.png" alt="Angry jester" title="I jest you not" style="display: block; margin: 1rem auto;" />

Here's the lowdown, in case you ever find yourself in a similar situation.

## Jest Config

As stated in the [Jest configuration docs](https://jestjs.io/docs/configuration#modulepathignorepatterns-arraystring), care is needed when adding ignore patterns to your Jest config, else you might end up accidentally ignoring all your tests when run in your build environment. Because a pattern will be matched anywhere in a path, the recommendation is to use the `<rootDir>` token so that the pattern will only match within your project:

```
const config: Config = {
  modulePathIgnorePatterns: ['<rootDir>/build'],
};
```

Why is this important?