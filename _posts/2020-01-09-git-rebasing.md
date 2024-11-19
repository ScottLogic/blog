---
title: 'Git rebasing: What is it and how can you use it?'
date: 2020-01-09 00:00:00 Z
categories:
- Tech
author: slaing
layout: default_post
summary: Rebasing is a technique available in Git, often shrouded in mystery or steered
  away from, this post explains what it is and how it can be used
---

I've talked before about [how the history of a codebase is as important as the codebase itself]({{ site.github.url }}/2019/12/11/source-control-basics). Rebase is the tool that can make the single biggest impact to achieving this. Prior knowledge of [the fundamental concepts]({{ site.github.url }}/2020/01/07/source-control-fundamentals.html) of source control is crucial to understanding this post.

Remember, even though you can use Rebase for the following (and maybe more) cases, it remains best practice to [commit early and often]({{ site.github.url }}/2019/12/19/source-control-when.html):

- Edit/rework a commit in the history
- Add a commit into the history of a change set (or branch)
- Remove a commit from the history of a change set (or branch)
- Split a commit into several commits
- Combine a series of commits into one commit
- Re-order commits

## What does Rebase mean?

> git-rebase - Reapply commits on top of another base tip

[git-rebase](https://git-scm.com/docs/git-rebase)

If you replace the word 'base' with 'ancestor' it means the same thing, so in other words:

> Give a new ancestor to a commit or sequence of commits.

'base' is used in the documentation to allow the base to mean a branch, a commit, a tag, or anything else that can be referenced within git.

As [discussed before]({{ site.github.url }}/2020/01/07/source-control-fundamentals.html), a commit contains - amongst other things - the id of its parent commit(s). As such Rebase is effectively updating the parent commit for the set of commits you provide.

It's also important to remember that each commit in Git is immutable, even to Rebase. As such Rebase will re-create each commit, chaining them all together but with the new ancestor.

Rebase is a bit like the [Grays Sports Almanac](https://backtothefuture.fandom.com/wiki/Grays_Sports_Almanac): it can change _everything_!
<a href="https://tenor.com/view/back-to-the-future-explain-doc-brown-chalk-board-gif-11918536" target="_blank">
    <img src="{{ site.github.url }}/slaing/assets/2020-01-09-git-rebasing/doc-brown-branching.png" />
    <br />
    From tenor.com
</a>

## The rules!
When using Rebase there are certain rules that you need to adhere to - otherwise a world of pain can ensue.

1. **Never Rebase a public branch - one that other people are using**

Remember that Rebase has to follow the rules of a commit - that it is immutable. As such a new commit will be created for every step of the process. This means you'd 'pull the rug from under the feet' of anyone using the 'old' commit.

Git will see that the commit exists twice - the first version and the Rebased version - and potentially get confused when you try to merge the changes together. Moreover the history will show the commit twice, albeit with different ids. A bit like having two Marty's in the same timeline - confusing!

Further reading:

- [Rebasing rules](https://blog.axosoft.com/golden-rule-of-rebasing-in-git/)

## What if it goes wrong
As with [Back to the Future](https://en.wikipedia.org/wiki/Back_to_the_Future), there is always a way out of any problem that may surface. As Rebase creates new commits, the branch can be reset back to the old commit and you're back where you were before. I'd suggest always pushing your branch to remote before using Rebase, especially if you're less familiar with it. It just adds another level of safety in case you need it.

Before using Rebase, take note of where you were - what the commit id is, or the branch name if it hasn't changed from remote.

If Rebase fails part way through and you want to cancel/abort and go back to where you were before, you can execute: `git rebase --abort`

If your branch was pushed before-hand and you want to reset to what the branch looks like remotely: `git reset --hard origin/<branch name>`

If you only have the previous commit id: `git reset --hard <commit SHA>`

Each of the commands described above will reset your current branch back to where you were before you started the Rebase activity.

Futher reading:

- [git-rebase](https://git-scm.com/docs/git-rebase)

## Interactive Rebase

Rebase can be used in one of two different modes, interactive and non-interactive. They both do the same thing, but the interactive edition allows for manipulation of the process.

So we've described Rebase as a tool that can provide a new ancestor to a set of commits. Rebase will create a 'script' (sort of like a todo list) of which commits will be affected. The non-interactive version of Rebase produces this script then executes it immediately.

The interactive version allows for this script to be edited before it is executed.

The script is simply an ordered set of commands to execute. It is a text-file that contains each commit id and what should be done with it. The message for each commit is included for clarity.

An example interactive Rebase script looks like:

~~~~~~
pick 509de5ac New post - Building performant large scale web applications (#1344)
pick 449486aa Source control - when blog post (#1345)
pick 3d4e82be Add fundamentals blog post
~~~~~~

In the above, `pick` means _add the given commit as a child on the previous commit_. So the history, from the given base will look exactly like that provided above. The script works from top-to-bottom, so the commit at the bottom will be the last commit added to the branch.

You can choose different commands instead of `pick`, they are:

~~~~~~
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue Rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
~~~~~~

In a lot of cases you can cause merge conflicts as the Rebase progresses through its script. This is normal and nothing to worry about. You'll just have to resolve the conflicts before you can proceed. If this is the case, use `git mergetool` to resolve the conflicts. Once they're all resolved use `git rebase --continue` to contine the process. Of course, if you want to abort the Rebase process, use `git rebase --abort`.

It's worth noting that Rebase is clever enough to only create new commits where it knows something has changed. If the parent of a commit is the same as before, it'll keep the commit as-is and move on until it has some work to do. Below are some examples to demonstrate usages of Rebase to various ends. All presume that the 'base' has changed, and as such Rebase has work to do at every step of the process.

### Edit/rework a commit in the history
Consider the scenario where you need to fix a typo in a file. You want to edit the commit so the commit is clean and appropriate - you don't want to have another commit that fixes the typo later.

You can edit the script so it shows something like the following:

~~~~~~
pick 509de5ac New post - Building performant large scale web applications (#1344)
edit 449486aa Source control - when blog post (#1345)
pick 3d4e82be Add fundamentals blog post
~~~~~~

When you save then close the file, Rebase will:

1. Reset the branch to the base
1. Add commit `509de5ac`, setting its parent to the given base
1. Add commit `449486aa`, setting its parent to the new id for `509de5ac`
1. Wait for you to edit/modify commit `449486aa`
1. Add commit `3d4e82be`, setting its parent to the new id for `449486aa`

At step 4 you can make the changes you need and amend the commit, for example:

1. Modify the file
1. Stage the file (`git add <file>`)
1. Commit the file, amending the commit (`git commit --amend`)

When you've finished the amends you need execute `git rebase --continue` to proceed with step 5 and complete the process.

### Fix a typo in a commit message
The `reword` command is the same as the `edit` command - except it only prompts for the message to be amended rather than the commit content, for example:

~~~~~~
pick 509de5ac New post - Building performant large scale web applications (#1344)
reword 449486aa Source control - when blog post (#1345)
pick 3d4e82be Add fundamentals blog post
~~~~~~

Dont forget, changing the message in the script does _NOT_ change the content of the commit message. Save and close the script and wait for Rebase to reopen the message editor for the chosen commit/s.

### Add a commit into the history of a change set (or branch)
Consider the scenario where you need to make an additonal change to the codebase after a commit. You've forgotten to do it, and want to ensure it is in the right place in the history - straight after the appropriate commit.

You can edit the script so it shows something like the following:

~~~~~~
pick 509de5ac New post - Building performant large scale web applications (#1344)
edit 449486aa Source control - when blog post (#1345)
pick 3d4e82be Add fundamentals blog post
~~~~~~

When you save then close the file, Rebase will:

1. Reset the branch to the base
1. Add commit `509de5ac`, setting its parent to the given base
1. Add commit `449486aa`, setting its parent to the new id for `509de5ac`
1. Wait for you to make the changes you need
1. Add commit `3d4e82be`, setting its parent to the new id for the new commit you've created

Instead of editing `449486aa` this time, you can add a new commit instead, for example:

1. Make the change/s
1. Stage the file/s (`git add <file>`)
1. Commit the change/s (`git commit`)

When you've finished the amends you need execute `git rebase --continue` to proceed with step 5 and complete the process. At the end of the process you'll have 4 commits in the history rather than 3.

### Remove a commit from the history of a change set (or branch)
Consider the scenario where you have committed a change you don't want to keep and want to remove it from the history. Maybe you've committed a temporary change that you want to eject from the branch before it is merged.

You can edit the script so it shows something like the following:

~~~~~~
pick 509de5ac New post - Building performant large scale web applications (#1344)
pick 3d4e82be Add fundamentals blog post
~~~~~~
Note that line 2 (`449486aa`) has been removed, so it won't be included in the process.

When you save then close the file, Rebase will:

1. Reset the branch to the base
1. Add commit `509de5ac`, setting its parent to the given base
1. Add commit `3d4e82be`, setting its parent to the new id for `509de5ac`

At the end of the process you'll have 2 commits in the history rather than 3. 

### Split a commit into several commits
Consider the scenario where you've accidentally committed two changes into the same commit. You want to split them so the history is neat; so that if needed in the future, part of the commit can be reverted without reverting all of it.

You can edit the script so it shows something like the following:

~~~~~~
pick 509de5ac New post - Building performant large scale web applications (#1344)
edit 449486aa Source control - when blog post (#1345)
pick 3d4e82be Add fundamentals blog post
~~~~~~

When you save then close the file, Rebase will:

1. Reset the branch to the base
1. Add commit `509de5ac`, setting its parent to the given base
1. Add commit `449486aa`, setting its parent to the new id for `509de5ac`
1. Wait for you to edit/modify this commit
1. Add commit `3d4e82be`, setting its parent to the new id for the last commit you added during step 4

Instead of editing the commit, you reset it out, undoing step 2, but keeping the changes on disk.

So you can execute `git reset HEAD~1`. This will remove the commit and place all the changes in your working copy. From there you can selectively add the files into individual commits, i.e.

1. `git add <file1>` then `git commit -m <message 1>`
1. `git add <file2>` then `git commit -m <message 2>`

When you've finished the amends you need, execute `git rebase --continue` to proceed with step 5 and complete the process. At the end of the process you'll have 5 (or more) commits in the history rather than 3.

### Combine a series of commits into one commit
Consider the scenario, you've made a few commits and they need to be merged together: they don't make sense on their own or for some other reason.

You can edit the script so it shows something like the following:

~~~~~~
pick 509de5ac New post - Building performant large scale web applications (#1344)
pick 449486aa Source control - when blog post (#1345)
squash 3d4e82be Add fundamentals blog post
~~~~~~

When you save then close the file, Rebase will:

1. Reset the branch to the base
1. Add commit `509de5ac`, setting its parent to the given base
1. Add commit a commit the contains the changes from `449486aa` and `3d4e82be`, setting its parent to the new id for `509de5ac`
   1. Rebase will pause and prompt for a message, which is prepared as a combination of both commit messages, i.e. "Source control - when blog post (#1345) Add fundamentals blog post"
   1. If you want to take the message from the first commit as-is then use the `fixup` command instead of `squash`.

You can `squash` or `fixup` as many commits as you like - it's not limited to 2 commits at a time. When the message editor is saved and closed (if you're using `squash`) Rebase will contine to the end of the script. At the end of the process you'll have 2 commits in the history rather than 3. The last commit will have the message you entered into the message editor during step 3. Git will be default concatenate the messages together, when using `squash` and use the first message when using `fixup`.

### Re-order commits
Consider the scenario, you've made some changes but they make more sense if they're in a different order.

You can edit the script so it shows something like the following:

~~~~~~
pick 449486aa Source control - when blog post (#1345)
pick 3d4e82be Add fundamentals blog post
pick 509de5ac New post - Building performant large scale web applications (#1344)
~~~~~~

Note that line 1 has been moved to line 3. When you save then close the file, Rebase will:

1. Reset the branch to the base
1. Add commit `449486aa`, setting its parent to the given base
1. Add commit `3d4e82be`, setting its parent to the new id for `449486aa`
1. Add commit `509de5ac`, setting its parent to the new id for `3d4e82be`

At the end of the process you'll have the same commits, just in a different order. 

### No work to do
I've mentioned above that Rebase is clever enough to not create new commits where it doesn't need to - that is when the base/parent is the same as before. This is what happens if you don't modify the initial script, therefore it still looks like this when you close the editor:

~~~~~~
pick 509de5ac New post - Building performant large scale web applications (#1344)
pick 449486aa Source control - when blog post (#1345)
pick 3d4e82be Add fundamentals blog post
~~~~~~

1. Reset the branch to the base, which is the same as the parent of `509de5ac`
1. Add commit `509de5ac`, the parent is the same, No other changes are required so the commit can be used as-is
1. Add commit `449486aa`, the parent is the same: `509de5ac`. No other changes are required so the commit can be used as-is
1. Add commit `3d4e82be`, the parent is the same: `449486aa`. No other changes are required so the commit can be used as-is

At the end of the process nothing will have changed on the branch - all the commits will still exist and in the same order. In truth Rebase is even more clever than this, but I'm using this simplification to demonstrate that Rebase will only recreate commits when it needs to.

#### Further reading

- [Git rebase](https://git-scm.com/docs/git-rebase)
- [Rebasing rules](https://blog.axosoft.com/golden-rule-of-rebasing-in-git/)
