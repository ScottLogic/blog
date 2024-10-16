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

You may not have noticed a small change to our blog posts this week, but it's a significant one for inclusivity. Recently I noticed that our [applause button](https://www.npmjs.com/package/applause-button) component, which allows readers to show their appreciation for a blog post by giving it a clap, was only accessible by mouse, not by keyboard 🫣 

<img src="/uploads/mouse-laugh.jpg" alt="Mouse laughing" title="Not so smart now huh?!" style="display: block; margin: 1rem auto; max-height: 12rem;" />

Yep, kinda embarrassing, and a problem that I and colleague [Dave Ogle](https://blog.scottlogic.com/dogle/) were keen to put right straight away. Using a `<button>` gave immediate relief, though of course there were styling issues to resolve, some structural rearrangements, and a few animations to sort out. On that front, I dampened those animations unless the user has [no preference on reduced motion](https://css-tricks.com/nuking-motion-with-prefers-reduced-motion/), and there is work in progress to correct colour contrast issues.

## Release the Kraken

Time's up, inaccessible clapper! But this is where things became more interesting: how was the applause-button component released and published? I could see [semantic-release](https://www.npmjs.com/package/semantic-release) and [travis-deploy-once](https://www.npmjs.com/package/travis-deploy-once) dependencies in the `package.json`, and a Travis CI config file in the repo root, but I had no idea how to access the Travis build, nor even if it was still working as the last release was almost 4 years ago... 😱

I decided everything would be simpler and more transparent if I switched to using a [GitHub workflow](https://docs.github.com/en/actions/writing-workflows/about-workflows) for the release. Luckily for me, the owner of the [applause-button GitHub repo](https://github.com/ColinEberhardt/applause-button) is our very own [Colin Eberhardt](https://blog.scottlogic.com/ceberhardt/), who graciously gave me maintainer rights and free rein to tinker as I saw fit 🛠️

I began by reading the [semantic-release documentation](https://github.com/semantic-release/semantic-release). This is my first encounter with the package, and I am blown away by how easy the authors have made it to use - it can genuinely be used with zero configuration, the defaults being entirely sensible. The actual work is carried out by [semantic-release plugins](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md), with semantic-release orchestrating the process; each plugin implements one or more release steps, as described in the link above.

If you stick with the defaults, this is what you get:

- **Verify Conditions**: Check GitHub and npm access tokens are present and valid.
- **Analyze Commits**: Determine what version we are releasing, by analyzing all commits since the previous release.
- **Generate Notes**: Generate release notes based on commit messages.
- **Prepare**: Create tag and release in GitHub; create a package tarball for npm.
- **Publish**: Publish the package to npm.
- **Success**: Add a comment to each issue and PR associated with the release.
- **Fail**: Open or update a GitHub issue for the release attempt, documenting what failed.

It's worth going into a little more detail on each of these steps.

<img src="/uploads/infinity-steps.jpg" alt="Impossible staircase" title="Continuous deployment anyone?" style="display: block; margin: 1rem auto; max-height: 12rem;" />

### Verify Conditions

#### [GitHub plugin][github-plugin]

Checks for and validates GITHUB_TOKEN, which must be injected into the environment when running the release. This is straightforward in a GitHub workflow. GitHub creates this token as a secret on your behalf, so you only need to reference it.

#### [npm plugin][npm-plugin]

Checks for and validates NPM_TOKEN. As above, this must be made available in the enviroment at runtime, however, you must [generate this token yourself](https://docs.npmjs.com/creating-and-viewing-access-tokens) and then [add it to your GitHub repo](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository) as a secret.

### Analyze Commits

#### [Commit Analyzer plugin][commit-analyzer-plugin]

This plugin uses [Angular commit message conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit) by default to determine whether a release is major (breaking changes), minor (new feature) or patch (bug fixes); other commit message formats are available. Under the bonnet, the plugin uses [conventional-changelog][conventional-changelog].

It's important to note that neither `docs` nor `chore` commit types trigger a release by default, and I chose to deviate from that by including `docs` changes in patch releases, otherwise our npm package README could become out of sync with the README in GitHub.

### Generate Notes

#### [Release Notes Generator plugin][release-notes-plugin]

By default, commits are grouped by type: `fix` as Bug Fixes, `feat` as Features, `perf` as Performance Improvements, and BREAKING CHANGES as a separate group at the bottom. Again, I chose to deviate from defaults to include `docs` as Documentation, but you don't have to follow suit.

Take a look at [semantic-release's own release page for v23.0.0](https://github.com/semantic-release/semantic-release/releases/tag/v23.0.0) to see how grouped release notes look.

### Prepare

#### [npm plugin][npm-plugin]

Generates a tarball of the npm package.

#### [GitHub plugin][github-plugin]

Generates zip and tarball of source code for the GitHub release.

#### Notes

There are important differences between the bundles generated by these two plugins.

Firstly, it is [recommended not to increment version number](https://semantic-release.gitbook.io/semantic-release/support/faq#making-commits-during-the-release-process-adds-significant-complexity) in the GitHub repository during a release, as that adds a lot of complexity: the release process will need permissions to create and push a commit, which is likely to be restricted on the release branch. Instead, you will see in the [applause-button package.json](https://github.com/ColinEberhardt/applause-button/blob/master/package.json#L4) we have version set to `0.0.0-semantically-managed`, to indicate we don't need to worry about version numbering during development. This is a key tenet of semantic versioning: let code changes determine release numbering, rather than working towards pre-determined releases.

However, we do need our package in npm to have the correct version number, so the [npm plugin][npm-plugin] makes that change locally before creating the tarball, using the version number calculated in the Analyze Commits step.

Secondly, we have an npm script (`prepack`) which runs the build before preparing the npm package, to generate  production-ready JavaScript and CSS files. Therefore, the package tarball also contains a dist folder with these assets, which the GitHub source bundles do not have.

### Publish

#### [GitHub plugin][github-plugin]

Here's another thing to love about semantic-release: contributors have provided a set of [recipes for common release tasks](https://semantic-release.gitbook.io/semantic-release/recipes/ci-configurations), including a recipe for [releasing to npm via GitHub Actions](https://semantic-release.gitbook.io/semantic-release/recipes/ci-configurations/github-actions#node-project-configuration).

I also wanted to try out releasing with [npm provenance](https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/), a relatively new concept which is gaining traction: packages can gain a provenance badge by providing a verifiable link back to the source code _and_ to the build configuration, to give consumers full knowledge of how your package was built from sources. GitHub Actions are one of the current verifiable build systems, which is another good reason to use them instead of Travis.

The workflow is simple to set up following the recipe linked above; the only extra config needed for provenance is this section inside `package.json`:

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>"publishConfig": {
  "provenance": true
}</code></pre>

### Success or Fail

#### [GitHub plugin][github-plugin]

Adding comments and labels to released issues is a nice touch. Here's an example:

<img src="/uploads/semantic-release-comment-b224e8.png" alt="Issue release comment" title="Hello semantic-release bot!" style="display: block; margin: 1rem auto;" />

Equally, when things go wrong it's nice to receive a notification, via a new issue detailing the errors. This helps track both the problem and the eventual solution.

## Convention over Configuration

This felt almost _too easy_! I did add a little configuration to keep documentation in npm up to date, but even that was trivial. Default behaviour of semantic-release may be enough for you, but it is simple to extend using [official and community plugins](https://github.com/semantic-release/semantic-release/blob/master/docs/extending/plugins-list.md); each plugin can be used with defaults or configured as needed, meaning the possibilities are almost limitless. And if you do need something you can't find, you can write your own plugin.

## The End Result

I'm really pleased with this little gem:

<img src="/uploads/provenance-applause-button.png" alt="Published with provenance" title="groovy" style="display: block; margin: 1rem auto;" />

I had no idea it would be this easy, but I just published my first package with provenance!

You can clap now 😉

<img src="/uploads/clap-small.png" alt="Applause!" title="You can clap now" style="display: block; margin: 1rem auto;" />


[commit-analyzer-plugin]: <https://github.com/semantic-release/commit-analyzer>
[conventional-changelog]: <https://github.com/conventional-changelog/conventional-changelog>
[github-plugin]: <https://github.com/semantic-release/github>
[npm-plugin]: <https://github.com/semantic-release/npm>
[release-notes-plugin]: <https://github.com/semantic-release/release-notes-generator>