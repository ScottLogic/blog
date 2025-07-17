---
title: Avoiding, seeking, and solving source control conflicts
date: 2018-05-30 00:00:00 Z
categories:
- Tech
author: rwilliams
layout: default_post
summary: Nobody looks forward to conflicts when collaborating on code. There are things
  we can do however to minimise unwanted ones, promote useful ones, and make them
  easier to solve correctly.
---

Nobody looks forward to conflicts when collaborating on code. There are things we can do however to minimise unwanted ones, promote useful ones, and make them easier to solve correctly. That will contribute to better quality and higher productivity through better use of [finite cognitive resource](http://seriouspony.com/blog/2013/7/24/your-app-makes-me-fat).

Most of this isn't specific to a particular tool or workflow, but some parts are from the perspective of using Git in merge or rebase-based workflows.

## Two kinds of conflict
We tend to think of conflicts as any two sets of changes that can't be merged by a tool, but these are only one type of conflict. They are text conflicts. The tool, aware of only line additions and removals - and not their meaning, is unable to combine both into a single result. When this happens during a merge or a rebase, the tool pauses and leaves it up to us to resolve them by reconciling both sides.

The other type of conflict is a semantic conflict. These are when two sets of changes are compatible at the text level, but not at higher levels where meaning matters. Examples include sets that merge to produce invalid syntax, non-compiling code in/across files, or incompatible application features. Source control and merge tools don't have this level of awareness and understanding, so won't detect these conflicts. We have to identify them ourselves. Means include compiling the code, running tests, observing program behaviour, and learning of the meaning/purpose of the "other" changes through reading commit messages.

For a truly successful merge, we must identify and fix all conflicts of both types. That two sets of changes auto-merge successfully at the text level doesn't mean that the result makes sense and is correct. Consequences of not getting it right include broken features, subtle bugs, dormant code, and lost/partially-lost bug fixes.

## Eliminating plain-unnecessary conflicts
There are some conflicts which have no legitimate reason to occur in the first place. These include: mixed line endings, different indentation styles, varying code formatting conventions, and blanket reformatting of code as part of unrelated work.

Source control tools, editors and IDEs can and should be configured consistently across all contributors to avoid these. Wherever tools support doing so, check-in such configurations into the repository itself. This eases sharing and ensures consistency. Many modern tools support [separate](https://code.visualstudio.com/docs/getstarted/settings) project and user-level configuration, thus supporting personalisation while having some shared configuration. If your codebase already contains a mix on these fronts, disable editor/IDE auto-reformatting until you can address the situation.

Introduce a tool such as ESLint or Checkstyle as part of your build process, for definitive enforcement of these subjects. Many editors/IDEs support extensions which can configure formatting (or at least show errors inline) by consuming these tools' configuration files. Do this and the above early in the project - it's much harder once you have more files and more active contributors.

## Organising code to reduce and promote (!) conflicts
Code organisation in a deliberate and thoughtful manner can help us avoid tedious text conflicts - as well as having numerous other benefits. A modular structure, with clear responsibilities and organised dependencies, and sensibly-sized, tidy, files, reduces the likelihood of concurrent pieces of work needing to touch common/nearby areas of code.

We can also organise code to increase the likelihood of text conflicts where there is a semantic conflict - taking advantage of the ease, speed and reliability with which the former are detected. Some (not all) of these semantic conflicts would be easily detected later at build-time, but this gives earlier feedback of the problem.

I've found predictable ordering of any orderable collection of things within files to help both reduce nuisance text conflicts and promote useful text conflicts (plus other benefits). Examples include lifecycle methods within a component class, functions in a file, import statements, configuration files, and CSS declarations. Adding every new thing after the last existing one tends to cause nuisance conflicts as other contributors do the same, so I try to avoid this where possible. Adding new things in a predictable place on the other hand, tends to flag-up semantic issues such as the two sides adding the same method or import statement. Most of these orderings can be automated [using](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md) [style](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md) [tools](https://github.com/sasstools/sass-lint/blob/develop/docs/rules/property-sort-order.md), either to a well-known convention or to be alphabetical.

## Workflow practices to minimise conflict-related pain
Technical tips will only be of limited help if a project's workflow and practices don't give any regard to avoiding conflict-related pain points. Working in a thought-out way can minimise the opportunity for conflicts, and make those that do occur easier to solve correctly.

Avoid too many contributors working on the same area of the code at once, by being aware of what others on the team are working on and deferring overlapping tasks. Minimise the amount of time work sits on branches awaiting code review, revisions, and testing. Avoid multiple long-lived diverging branches. While working on a feature branch, merge/rebase frequently from the main branch to reduce divergence. Using a rebase-style workflow tends to bring out conflicts in more manageable chunks with better context (one commit at a time) than in a merge-style workflow, which in my experience makes them easier to solve correctly.

## Resolution-friendly commits
Applying good practices when creating commits will make it easier to correctly solve conflicts involving those commits, as well as bringing other benefits.

Small, focused commits are easier to understand than large wide-ranging ones. Good commit messages which convey the intention of a change allows quick understanding and re-establishment of context when later fixing a conflict. Intent should be at the application/code level, rather than higher-level intents such as "fix review comments" or "fix recent bugs". Squashing together commits which re-work others avoids unnecessary solving and re-solving of conflicts. Ensuring that every commit at least compiles and passes lint (and preferably tests pass) means we can use these as sanity checks after resolving conflicts.

## Resolving
The task of resolving is to reconcile two sets of conflicting changes ("sides") to produce a single result. There are many tools and techniques that can help with this process - making it easier and reducing the chance of mistakes.

Most straightforward conflicts can be solved using a text editor, by manually moving/deleting/editing lines between the conflict markers. Work is minimised usually by applying the changes from the side with fewer changes, to the side with more changes. Enabling the `diff3` [conflict style](http://psung.blogspot.com/2011/02/reducing-merge-headaches-git-meets.html) in Git adds the common base/ancestor between each side, which is often useful for context and understanding intent.

Tooling can however make the process easier and less error-prone. Merge tools such as [KDiff](http://kdiff3.sourceforge.net/) can show the base and both sides in three side-by-side panes, with another pane underneath for the final result. Markers, colour coding, and quick actions are also helpful. [Semantic Merge](https://www.semanticmerge.com/) is a merge tool that understands the semantics of some languages, allowing functionality that goes beyond purely text-level tools.

## Post-resolution sanity checks
Once we've resolved a particular conflict, there are a few checks we can do to increase confidence that we did so correctly. These vary in terms of effort involved, so you might choose to postpone the more expensive ones until the end of a series of merged/rebased commits, especially for simpler conflicts.

Check that the code compiles, run the style/lint checks, run the tests, run the application and manually check it works. These do rely on these checks passing for the original commit in the first place ([hooks](https://github.com/okonet/lint-staged) can help with this). Check that there aren't any conflict markers left over (tools and [hooks](https://github.com/pre-commit/pre-commit-hooks/blob/master/pre_commit_hooks/check_merge_conflict.py) can help with this too).

For more complex conflicts (overall, or at a file-level), it's also good to check the post-resolution diff looks sensible and compares well to the original diff. This helps ensure nothing was accidentally lost during resolution.

## References and further reading

* [Semantic Conflicts](https://martinfowler.com/bliki/SemanticConflict.html) - Martin Fowler
* [Dealing with line endings](https://help.github.com/articles/dealing-with-line-endings/) - GitHub
* [.gitattributes](https://git-scm.com/docs/gitattributes) - Git
* [14 tips and tools to resolve conflicts with Git](https://developers.atlassian.com/blog/2015/12/tips-tools-to-solve-git-conflicts/) - Atlassian
* [Advanced Merging](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging) - Pro Git
