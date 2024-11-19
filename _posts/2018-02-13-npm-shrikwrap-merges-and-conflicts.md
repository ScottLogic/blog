---
title: Dealing with NPM shrinkwrap merges and conflicts
date: 2018-02-13 00:00:00 Z
categories:
- Tech
author: rwilliams
layout: default_post
summary: Conflicts sometimes arise when merging two npm-shrinkwrap.json files from
  different source control branches. Git might be able to solve some of these - but
  should you let it, and what should you do if it can't?
---

Conflicts sometimes arise when merging two `npm-shrinkwrap.json` files from different source control branches. Git might be able to solve some of these - but should you let it, and what should you do if it can't?

(This post is based on NPM 3 usage, but is most likely also applicable to later versions and the related `package-lock.json` lockfile).

## Avoid merging
The shrinkwrap file is generated based on the current state of the `node_modules` folder, which must be valid - e.g. no extraneous or missing dependencies. Merging two of them, whether done by Git or manually yourself, risks introducing problems as there is no validity check.

In practice, projects normally don't have anything in place to prevent Git from merging the files. It often succeeds without conflicts, and the resulting file will probably work. Any problems with the merged file will be sorted out the next time the shrinkwrap is generated (explicitly, or when installing/updating a dependency) - this isn't great.

## Dealing with a merge conflict
Sometimes Git can't merge two shrinkwraps, leaving a conflict for us to resolve. Rather than doing this by hand using a merge tool or text editor, this is the practice I've settled on:

{% highlight bash %}
git checkout --ours npm-shrinkwrap.json
npm install
npm shrinkwrap
git add npm-shrinkwrap.json
{% endhighlight %}

First (assuming the conflict occurred during a rebase), we checkout the original shrinkwrap - abandoning our changes (`--ours` somewhat confusingly refers to the branch we're rebasing onto). Then, we update the `node_modules` folder to be correct for the combination of the shrinkwrap and whatever we changed in `package.json` (new/updated/removed dependencies). Finally, we regenerate the shrinkwrap.

(If the conflict occurred during a merge of a more authoritative branch (e.g. `development`) into a feature branch when using a merge-based workflow, use the `--theirs` option instead in the first step to checkout the original shrinkwrap).

You now have a valid shrinkwrap, with only the changes required to bring it in sync with your `package.json` changes. Since we discarded our shrinkwrap changes, there is a risk that the install will bring in different versions of new/changed dependencies, but this should be ok on a non-main branch. The dependencies from the main (more authoritative) branch are preserved, and any problems with different new/changed versions should come up during build/test ahead of merging to the upstream branch.

## Preventing auto-merging
To avoid the aforementioned risk of a shrinkwrap that probably works but isn't exactly right, we should always take these steps when two shrinkwraps need to be merged - even if there's no conflict.

So we have the chance to do so, we need Git to always stop for manual resolution. We can do this by configuring it to use the binary merge driver for the file, rather than the default 3-way merge:

<pre>
# .gitattributes file in repository root
/npm-shrinkwrap.json merge=binary
</pre>

Doing this by setting the binary merge driver, rather than setting the file to be generally treated as binary, preserves the ability to diff it.

## Automated conflict resolution
Yarn is [already capable](https://github.com/yarnpkg/yarn/pull/3544) of detecting and merging conflicts in lockfiles, and NPM has an [open issue](https://github.com/npm/npm/issues/18007) for the same feature. In the NPM world, the term "lockfiles" encompasses both `npm-shrinkwrap.json` and `package.lock.json` - worth bearing in mind when searching GitHub for relevant issues!

This feature (which I haven't used myself) however only solves the conflict case - when Git stops for manual resolution. Treating the files as binary for merging ensures it always stops, but also means it won't insert conflict markers into the file - which are used by this detect-and-fix feature.

Using [custom merge driver](https://git-scm.com/docs/gitattributes#_performing_a_three_way_merge) looks like it would offer a way of automating the whole process (forcing a pause, and running the steps). This little-used [npm-merge-driver](https://github.com/npm/npm-merge-driver) module was made to solve this problem, although there's no explanation of the approach it uses.

*Update June 2018* - a few days after this post was published, NPM 5.7.0 was [released including](https://github.com/npm/npm/blob/v5.7.0/CHANGELOG.md#package-lock-git-merge-conflict-resolution) package lock Git merge conflict resolution, which can optionally be used in conjunction with the aforementioned `npm-merge-driver`. There's a [new section](https://docs.npmjs.com/files/package-locks#resolving-lockfile-conflicts) in the `package-locks` documentation.

## Aside: why is it called a shrinkwrap?
When recently asked this question, it reminded me of [this recent tweet by Dan Abramov](https://twitter.com/dan_abramov/status/922227584573890561):

> Today I learned what "shrink wrap" actually means. Mind blown. Just a reminder to consider non-native speaker experience in API naming.

Shrink wrap is a type of plastic film used for wrapping things, which shrinks tightly around them when heat is applied. Software products sold in physical boxes in shops were often wrapped this way - locking in what was inside and preventing it from being changed. The shrinkwrap does the same for a project's NPM dependencies.

"Polyfill" is another term [mentioned in the thread](https://twitter.com/shellscape/status/922259729044393984) that deserves similar explanation. Polyfilla is a brand of multi-purpose filler, whose name is often used as a generic term for filler used to fill in small holes and cracks in walls. Polyfills do a similar job in filling in missing parts of browser APIs.
