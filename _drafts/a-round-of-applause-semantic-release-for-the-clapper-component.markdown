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

Yep, kinda embarrassing, and a problem I and colleague [Dave Ogle](https://blog.scottlogic.com/dogle/) were keen to put right straight away. The usual fixes applied here: using a `<button>` gave immediate relief, though of course there were styling issues to resolve, some structural rearrangements, and a few animations to sort out. On that front, I dampened those animations unless the user has [no preference on reduced motion](https://css-tricks.com/nuking-motion-with-prefers-reduced-motion/), and there is work in progress to correct colour contrast issues.

## Release the kraken

Time's up, inaccessible clapper! But this is where things became more interesting: how was the applause-button component being released and published? I could see [semantic-release](https://www.npmjs.com/package/semantic-release) and [travis-deploy-once](https://www.npmjs.com/package/travis-deploy-once) dependencies in the `package.json`, and a Travis CI config file in the repo root, but I had no idea how to access the Travis build, nor even if it was still running because the last release was almost 4 years ago... 😱

I decided everything would be simpler and more transparent if I switched to using a [GitHub workflow](https://docs.github.com/en/actions/writing-workflows/about-workflows) for the release. Luckily for me, the owner of the [applause-button GitHub repo](https://github.com/ColinEberhardt/applause-button) is our very own [Colin Eberhardt](https://blog.scottlogic.com/ceberhardt/), who graciously gave me maintainer rights and free rein to tinker as I saw fit 🛠️

First stop was the [semantic-release documentation](https://github.com/semantic-release/semantic-release). This is my first encounter with the package, and I am blown away by how easy the authors have made it to use - it can genuinely be used with zero configuration, the defaults being entirely sensible. The actual work is carried out by [semantic-release plugins](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md), with semantic-release orchestrating the process. Each plugin implements one or more release steps, as described on the above page, and for each step semantic-release will invoke each of the registered plugins in the order defined in config (noting that a plugin may skip any step).

If you stick with the defaults, this is what you get:

- **Verify Conditions**: Check GitHub and NPM access tokens are present and valid ([GitHub plugin][github-plugin] and [NPM plugin][npm-plugin]).
- **Analyze Commits**: Determine what version we are releasing, by analyzing all commits since the previous release ([Commit Analyzer plugin][commit-analyzer-plugin]).
- **Generate Notes**: Generate release notes based on commit messages ([Release Notes Generator plugin][release-notes-plugin]).
- **Prepare**: Create a Tag and Release in GitHub ([GitHub plugin][github-plugin]). Check out the repo, update version number in package.json, and create a package tarball for NPM ([NPM plugin][npm-plugin]).
- **Publish**: Publish the package to NPM ([NPM plugin][npm-plugin]).
- **Success**: Add a comment to each Issue and PR associated with the release ([GitHub plugin][github-plugin]).
- **Fail**: 

It's worth going into a little more detail on each of the above steps.

### Verify Conditions

As I will be using a GitHub workflow to run the release, I don't need to worry about the GITHUB_TOKEN secret - it will be made available to the release job, so long as I add it to the environment before calling `semantic-release`. This is trivial with GitHub workflows.

An NPM_TOKEN secret is something I needed to ask Colin to generate specifically for the repo, but otherwise it's the same as for GITHUB_TOKEN.

### Analyze Commits

By default, [Commit Analyzer plugin][commit-analyzer] uses [Angular commit message conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit) to determine whether a release is major (breaking changes), minor (new feature) or patch (bug fixes). The plugin uses [conventional-changelog][conventional-changelog] under the bonnet.

It's important to note that neither `docs` nor `chore` types trigger a release by default, and I chose to deviate from the default by including `docs` changes in patch releases, otherwise our package README on NPM could become out of sync.

### Generate Notes

By default, [Release Notes Generator plugin][release-notes-plugin] groups commits by type: fix as Bug Fixes, feat as Features, perf as Performance Improvements, and BREAKING CHANGES as a separate group at the bottom. Again, I chose to deviate from defaults to include docs under Documentation, but you don't have to follow suit.

Take a look at [semantic-release's own release page for v23.0.0](https://github.com/semantic-release/semantic-release/releases/tag/v23.0.0) to see how these grouped release notes look.

### Prepare

This step is implemented by [NPM plugin][npm-plugin] and [GitHub plugin][github-plugin], to prepare bundles for release - a tarball for the NPM package, and zip and tarball of source code for the GitHub release. However, there are important differences in the bundles generated for the two.

It is [recommended not to increment version number](https://semantic-release.gitbook.io/semantic-release/support/faq#making-commits-during-the-release-process-adds-significant-complexity) in the GitHub repo during a release, as that adds a lot of complexity - the release process will need permissions to create and push a commit, which is likely to be restricted on the release branch. Instead, you will see in the [applause-button package.json](https://github.com/ColinEberhardt/applause-button/blob/master/package.json#L4) we have version set to "0.0.0-semantically-managed", to indicate we don't need to worry about version numbering during development. This is a key tenet of semantic versioning: let the code determine release numbering, rather than working towards pre-determined releases.

However, we do need our package in NPM to have the correct version number, so the [NPM plugin][npm-plugin] makes that change locally before creating the tarball, using the version number calculated in the Analyze Commits step. Additionally, we have an npm script (`prepack`) which runs the build before packaging, to generate  production-ready JavaScript and CSS files. Therefore the package tarball also contains a dist folder with these assets, which the GitHub source bundles do not have.

### Publish

Here's another lovely thing about the folks behind semantic-release: they provide a set of [recipes for common release tasks](https://semantic-release.gitbook.io/semantic-release/recipes/ci-configurations), which includes a section on [releasing to NPM with provenance](https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/). Provenance is a relatively new concept, but is gaining traction; packages can gain their provenance badge by providing a verifiable link back to the source code _and_ to the build configuration. GitHub workflows are one of the current verifiable build systems, which is another good reason to use them over Travis.

Here's our shiny new badge for applause-button:

![provenance-applause-button.png](/uploads/provenance-applause-button.png)


[commit-analyzer-plugin]: <https://github.com/semantic-release/commit-analyzer>
[conventional-changelog]: <https://github.com/conventional-changelog/conventional-changelog>
[github-plugin]: <https://github.com/semantic-release/github>
[npm-plugin]: <https://github.com/semantic-release/npm>
[release-notes-plugin]: <https://github.com/semantic-release/release-notes-generator>