---
title: 'A round of applause: semantically releasing the clapper component'
date: 2024-10-17 15:00:00 Z
categories:
- Tech
- Open Source
tags:
- semantic release
- applause button
- github
- github workflow
- provenance
- npm
- accessibility
summary: Using semantic-release to publish an npm package with provenance, via a GitHub
  workflow... Almost too easy!
author: cwilton
---

You may not have noticed a small change to our blog posts this week, but it's a significant one for inclusivity. Recently I noticed that the [applause button component](https://www.npmjs.com/package/applause-button), which allows readers to show their appreciation for a blog post by giving it a clap, was not accessible by keyboard 🫣 

![mouse-laugh.jpg](/uploads/mouse-laugh.jpg)

Yep, kinda embarrassing, and a problem I and colleague [Dave Ogle](https://blog.scottlogic.com/dogle/) were keen to put right straight away. The usual fixes applied here: using a `<button>` gave immediate relief, though of course there were styling issues to resolve, including a few animations the component uses. On that front, I dampened those animations unless the user has [no preference on reduced motion](https://css-tricks.com/nuking-motion-with-prefers-reduced-motion/), and there is work in progress to correct colour contrast issues.

## Release the kraken

Time's up, inaccessible clapper! But this is where things became more interesting: how was the applause-button component being released and published? I could see we had [semantic-release](https://www.npmjs.com/package/semantic-release) and [travis-deploy-once](https://www.npmjs.com/package/travis-deploy-once) dependencies in the `package.json`, and a Travis CI config file in the repo root, but I had no idea how to access the Travis build, nor even if it was still running because the last release was over 4 years ago...

I decided everything would be simpler and more transparent if I switched to using a [GitHub workflow](https://docs.github.com/en/actions/writing-workflows/about-workflows) for the release. Luckily for me, the owner of the [applause-button GitHub repo](https://github.com/ColinEberhardt/applause-button) is our very own [Colin Eberhardt](https://blog.scottlogic.com/ceberhardt/), who graciously gave me maintainer rights and free rein to tinker as I saw fit 🛠️

First stop was the [semantic-release documentation](https://github.com/semantic-release/semantic-release). This is my first encounter with the package, and I am blown away by how easy the authors have made it to use - it can genuinely be used with zero configuration, the defaults being entirely sensible:

- **Verify release conditions**: are GitHub and NPM access tokens present and valid?
- **Analyze commits since last release**: what version are we releasing?
- **Generate release notes**: based on commit messages, uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) under the hood
- **Publish to NPM**: Checks out the repo, updates version number in package.json, creates a package tarball then publishes the release to NPM
- **Release in GitHub**: Creates tag and release in the repo

It's worth going into a little more detail on each of these.

### Verify release conditions

As I will be using a GitHub workflow to run the release, I don't need to worry about the GITHUB_TOKEN secret - it will be made available to the release job, so long as I add it to the environment before calling `semantic-release`. This is trivial with GitHub workflows.

The NPM_TOKEN secret is something I needed to ask the repo owner to generate specifically for the repo, but otherwise it's the same as for GITHUB_TOKEN - simples.

### Analyze commits

By default, semantic-release uses [Angular commit message conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) to determine whether a release is Major (breaking changes), Minor (new feature) or Patch (bug fixes).