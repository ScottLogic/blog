---
title: Retroactively applying Prettier formatting changes to existing branches
date: 2019-03-04 00:00:00 Z
categories:
- Tech
author: rwilliams
layout: default_post
summary: Changes to code formatting tooling/policy can be painful to integrate with
  work-in-progress branches. Here's an approach to solving the situation quickly and
  easily using a single Git rebase command.
---

Changes to code formatting tooling/policy can be painful to integrate with work-in-progress on previously-created branches. Developers can expect a fair amount of conflicts to resolve before they can merge back to the main branch, because the formatting changes affect so many files and lines in the codebase. Avoiding the situation is likely impractical; there will almost always be some work-in-progress branches on a busy project.

But fear not: here's an approach to solving this situation that can be carried out quickly and easily using a single Git rebase command, which doesn't require all previous commits to be squashed. Follow along to learn a bit about Git and shell scripting, or jump to the end for the final assembled command.

I'm using [Prettier](https://prettier.io) here, but it should be applicable to any automatically-applied repeatable formatting changes, such as those [ESLint rules](https://eslint.org/docs/rules) which are auto-fixable.


## Observations
Assume an arbitrary commit A on the `master` branch, followed by a commit B which makes the extensive formatting changes. By first rebasing on top of A, we can guarantee that any conflicts encountered in a subsequent rebase on top of B will be due to formatting changes.

Prettier's formatting is repeatable, so there is no knowledge of value embedded in the changes it makes - they can always be re-done later by re-running Prettier.


## Strategy
Rebase on top of A, then on top of B. The observations allow us to resolve conflicts arising in the second rebase by always discarding the formatting changes and taking the on-branch changes instead - without losing anything important.

After doing that, we have our untouched changes from the last commit in place on the branch. But they don't have the updated formatting, and we've discarded all the other formatting changes that were in the same files. That is easily fixed by running Prettier on all the files that changed in that commit.

Finally, the commit needs to be updated with these formatting changes that Prettier just made. Once that's done, we can move on to the next commit in the rebase, and repeat until done.


## First implementation
The `--exec` option of `git rebase` allows running arbitrary shell commands after each commit is applied. It causes an interactive rebase, with the specified command added after each commit `pick` in the rebase todo list. It's often used to run lint checks. We can implement our strategy by using it multiple times:

~~~ bash
git rebase \
  --strategy-option=theirs \
  --exec 'prettier --write "**/*.js"' \
  --exec 'git add --all' \
  --exec 'git commit --amend' \
  origin/master
~~~

*Note: I found that for some reason, any commands following Prettier when the `--write` option is used are ignored. The workaround is to chain them within a single `--exec` using the `&&` operator. For readability, I won't do that until the end of this post.*

When rebasing, `theirs` somewhat confusingly (but it does make sense) refers to the branch we're on.

As with all interactive rebases, the todo list will appear once the command is run. This could be modified, for example to add pauses (`break` lines) to allow some manual steps where required.

It would also be possible to carry out the strategy entirely manually, which would be rather more tedious.


## Improved implementation
While that works and illustrates the workings, it has some weaknesses.

Running Prettier on all files in a large codebase after every commit could take a while. To avoid that, let's obtain the names of only the files that changed in the last commit, and pass them through to Prettier instead of the pattern we had previously. We use backticks to evaluate `git show` and use its output as an argument to `prettier`. As we want the evaluation to happen after each commit (and not once when the rebase command itself is run), the `--exec` command must be wrapped in single quotes rather than doubles to avoid interpolation.

~~~ bash
  --exec 'prettier --write `git show --name-only --pretty="" HEAD`' \
~~~

Using the `--all` option of `git add` isn't the safest thing generally - it quietly adds everything, even unexpected changes that may indicate a problem. Let's add only the files expected to have changed instead, leaving any surprises in the working directory for the rebase flow to bring to our attention later.

~~~ bash
  --exec 'git add `git show --name-only --pretty="" HEAD`' \
~~~

Finally, let's avoid an editor prompt when amending each commit, by using the `--no-edit` option of `git commit`.

Here's the improved command:

~~~ bash
git rebase \
  --strategy-option=theirs \
  --exec 'prettier --write `git show --name-only --pretty="" HEAD`' \
  --exec 'git add `git show --name-only --pretty="" HEAD`' \
  --exec 'git commit --amend --no-edit' \
  origin/master
~~~

... which won't work as-is due to the aforementioned issue - read on.


## Using the command
First, rebase on top of the commit right before the extensive formatting changes:

~~~ bash
git rebase origin/master~1
~~~

Then run the strategy command (here with the aforementioned workaround):

~~~ bash
git rebase \
  --strategy-option=theirs \
  --exec 'prettier --write `git show --name-only --pretty="" HEAD` && git add `git show --name-only --pretty="" HEAD` && git commit --amend --no-edit' \
  origin/master
~~~


## Custom tooling configuration
For simplicity in this illustrative example, I assumed that the Prettier tool was installed globally, and the default configuration used. This would rarely be the case on a real project. To use a custom configuration, put the configuration file outside the working directory, and point Prettier to it using the `--config` option.

In more complex setups, it's desirable to have the new/updated formatter tooling available in the working directory while rebasing. This requires the Prettier changes to have been made as (or be split into) two separate commits: the first containing only the tooling changes, and the second containing the formatting changes. In the preparation rebase, you'd rebase on top of the first of these commits to bring in only the tooling changes for use in the subsequent rebasing.
