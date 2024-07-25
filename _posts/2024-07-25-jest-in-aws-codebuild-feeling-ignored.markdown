---
title: 'Jest in AWS CodeBuild: feeling ignored'
date: 2024-07-25 10:00:00 Z
published: false
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

[Jest](https://jestjs.io/) is a widely used JavaScript testing framework. It can be used "zero-config" with sensible defaults, but you can tweak it with numerous configuration options. It turns out you can also tweak it to mess with your own head.

<img src="/uploads/jester-grrr.png" alt="Angry jester" title="I jest you not" style="display: block; margin: 1rem auto;" />

I recently wasted a morning trying to work out why my Jest tests were running just fine locally, but weren't even being _found_ when run in [AWS CodeBuild](https://aws.amazon.com/codebuild/features/?nc=sn&loc=2):

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>&gt; jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
No files found in /codebuild/output/src323229886/src/backend.
</code></pre>

After throwing in a heap of debugging, and even toying with [CodeBuild breakpoints](https://docs.aws.amazon.com/codebuild/latest/userguide/session-manager.html#ssm-pause-build), I inevitably reached my facepalm moment. And boy did I feel silly...

## Ignorance is a choice

Take a look at this seemingly innocuous config snippet:

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>const config: Config = {
  modulePathIgnorePatterns: ['build/'],
  ...
};
</code></pre>

For various reasons I can no longer fully recall (which is a lesson in itself), I have historically chosen to ignore the build directory in TypeScript projects to hide it from Jest's module loading. I'd never given it much thought until now; it's just one of those boilerplate snippets I find myself carelessly repeating whenever I add Jest to a project.

## Computer says no

My carelessness went unnoticed until I put together an [AWS CodePipeline](https://aws.amazon.com/codepipeline/) to run tests in CodeBuild before deployment, and to my surprise, the job failed.

Hmm. Cue much head scratching and aforementioned debugging. I eventually went back to check the [Jest configuration docs](https://jestjs.io/docs/configuration#modulepathignorepatterns-arraystring), which state that care is needed when defining ignore patterns, else you might end up accidentally ignoring all your tests when run in a Continuous Integration build environment. Well now, that sounds familiar...

Let's look again at the error message:

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>&gt; jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
<span style="font-weight: bold">No files found in /codebuild/output/src323229886/src/backend.</span>
</code></pre>

As you can see, CodeBuild puts everything under a directory named "codebuild", which includes the word "build" .... which I am explicitly instructing Jest to ignore.

<img src="/uploads/homer-hedge.gif" alt="Homer disappears into a hedge" title="Can I disappear now please" style="display: block; margin: 1rem auto;" />

## Rooting for the bad guy

Because path patterns in Jest config match anywhere in the _absolute path_ to a resource, not just within the project directory, the recommendation is to use the `<rootDir>` token to match strictly within your project:

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>const config: Config = {
  modulePathIgnorePatterns: ['<span style="font-weight: bold">&lt;rootDir&gt;</span>/build/'],
};
</code></pre>

Et voilà: the tests are found, and the job passes ✅

## Every day is a school day

Even salty old coding dogs need an occasional reminder: [RTFM](https://en.wikipedia.org/wiki/RTFM)!

In fact, when using [ts-jest transformer](https://kulshekhar.github.io/ts-jest/docs/) as I normally do, I have no need to ignore the build directory in my Jest config, as I can rely on includes / excludes in my test `tsconfig.json`. Therefore I will be removing that line from my personal TypeScript / Jest boilerplate from now on.

But the use of `<rootDir>` is encouraged for most of Jest's path pattern config properties, including `coveragePathIgnorePatterns`, `moduleNameMapper`, `watchPathIgnorePatterns` and more, so this is a valuable lesson learned. Ignore at your peril!