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

[Jest](https://jestjs.io/) is a widely used JavaScript testing framework. It can be used "zero-config" with its sensible defaults, but you can tweak it with numerous configuration options. It turns out you can also tweak it to mess with your own head.

I recently wasted a morning trying to work out why my Jest tests were running just fine locally, but weren't even being _found_ when run in AWS CodeBuild:

<pre style="margin-left: 0; margin-right: 0;"><code>&gt; jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
No files found in /codebuild/output/src323229886/src/backend.
</code></pre>

After throwing in a heap of debugging, and even toying with [CodeBuild breakpoints](https://docs.aws.amazon.com/codebuild/latest/userguide/session-manager.html#ssm-pause-build), I inevitably reached my facepalm moment. And boy did I feel silly...

<img src="/uploads/jester-grrr.png" alt="Angry jester" title="I jest you not" style="display: block; margin: 1rem auto;" />

Here's the lowdown, in case you ever find yourself in a similar situation.

## Jest Config

Take a look at this seemingly innocuous config snippet:

<pre style="margin-left: 0; margin-right: 0;"><code>const config: Config = {
  modulePathIgnorePatterns: ['build'],
  ...
};
</code></pre>

I normally use [ts-jest transformer](https://kulshekhar.github.io/ts-jest/docs/) so I can write test _and_ implementation code in TypeScript. Historically I have chosen to ignore the build folder to hide it from Jest's module loader, to avoid accidentally importing from any of the built JavaScript files (which my IDE might suggest in its efforts to be helpful, and I might blindly accept in my efforts to be productive).

However, the [Jest configuration docs](https://jestjs.io/docs/configuration#modulepathignorepatterns-arraystring) state clearly that care is needed when defining ignore patterns, else you might end up accidentally ignoring all your tests or modules when run in a Continuous Integration build environment. These patterns are matched anywhere in the _absolute path_ to a resource, not just within the project directory, so the recommendation is to use the `<rootDir>` token to match strictly within your project:

<pre style="margin-left: 0; margin-right: 0;"><code>const config: Config = {
  modulePathIgnorePatterns: ['&lt;rootDir&gt;/build'],
};
</code></pre>

## Pipeline Shenanigans

My carelessness went unnoticed until I put together an [AWS CodePipeline](https://aws.amazon.com/codepipeline/) to run the tests in CodeBuild before deployment. And to my surprise, they failed. Let's look again at that error message:

<pre style="margin-left: 0; margin-right: 0;"><code>&gt; jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
<span style="font-weight: bold">No files found in /codebuild/output/src323229886/src/backend.</span>
</code></pre>

As you can see, CodeBuild puts everything under a directory named "codebuild", which includes the word "build" ... which I am explicitly ignoring.

<img src="/uploads/homer-hedge.gif" alt="Homer disappears into a hedge" title="Can I disappear now please" style="display: block; margin: 1rem auto;" />

## Final Thoughts

Even salty old coding dogs need an occasional reminder: [RTFM](https://en.wikipedia.org/wiki/RTFM)!

In fact, when using ts-jest I have no need to exclude the build folder in my config, as I can rely on includes / excludes in my test <span style="">ts-config.json</span>. But I will still need to remember this when working on purely JavaScript projects.

Note that the use of `<rootDir>/` is encouraged for all Jest's path patterns, including `coveragePathIgnorePatterns`, `moduleNameMapper`, `watchPathIgnorePatterns` and more. You have been warned.

