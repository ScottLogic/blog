---
title: 'Source control: The fundamental concepts'
date: 2020-01-07 00:00:00 Z
categories:
- slaing
- Tech
author: slaing
layout: default_post
summary: The more advanced, time saving and helpful techniques of any source control
  tool require an understanding of the fundamental concepts of any source control,
  here we cover the most important ones
---

There are some key aspects of any source control product; understanding what they are and [when to use them]({{ site.github.url }}/2019/12/19/source-control-when.html) is crucial to being able to use them effectively. Without a basic understanding of the fundamentals then the more advanced features (such as [`git rebase`](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)) will be even harder to grasp.

What are the fundamental concepts of any source control product (and repository)?
A [repository](https://en.wikipedia.org/wiki/Repository_(version_control)) is a structure to store all of your code, assets and their history for a 'given purpose'. Normally a repository would store a single project (like a program) or service (like this blog). A repository is made up of:

- _Commits_ (also known as a _Revisions_)
- _Branches_

I'll use [git](https://git-scm.com/) terminology throughout this document, but the other products (Mercurial, Subversion, etc.) all have the same fundamental concepts, though they may be known by another name.

### Commits (or Revisions)

A commit packages up a set of changes to one or more files into one identifiable container. This container will contain (at least) the following:

- The author (name)
- The change date
- The changes applied (file changes)
- A user supplied message describing the changes

In addition (in _git_ certainly) the following is also present

- The parent commit id(s)
- The committer (name) - which can be different to the author

Each commit will also have an identifier: something that uniquely identifies the commit. Different tools use different methods, for example Subversion (SVN) uses an ever increasing number. In comparison _git_ however uses a hash ([via SHA-1](https://en.wikipedia.org/wiki/Cryptographic_hash_function)) of the commit contents.

Whilst the implementation detail of each tool is unimportant, that each commit has an identifier is. It's also worth pointing out that a git commit id and the git commit hash are one and the same thing.

In most [graphical documentation](https://nvie.com/posts/a-successful-git-branching-model/), including [my previous blog posts]({{ site.github.url }}/2019/12/19/source-control-when.html), a commit is normally depicted with circle.

Further reading:

- [What is a Git commit ID?](https://stackoverflow.com/a/29107504/774554)
- [Git: Committing your changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository#_committing_changes)
- [Git commit objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects#_git_commit_objects)
- [Subversion revisions](http://svnbook.red-bean.com/en/1.7/svn.basic.in-action.html#svn.basic.in-action.revs)

### Branches

A branch is an ordered collection of commits. They can be short lived (for example for the duration of a feature) or long lived (for example the main development branches - master/Trunk).

Once again, each tool will have its own approach for attributing commits to a branch. _Git_ for example simply creates a branch designation with a name and the id of the commit from where it starts. Note _git_ uses a linked list approach, so the branch simply points to a node in this list.

In most [graphical documentation](https://nvie.com/posts/a-successful-git-branching-model/), including [my previous blog posts]({{ site.github.url }}/2019/12/19/source-control-when.html), a branch is normally depicted with a line (or an arrow) between commits.

Further reading: 

- [Git branching and merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [Subversion branching](http://svnbook.red-bean.com/en/1.7/svn.branchmerge.using.html)

#### Merging a branch

When branches are merged (in _git_) a 'merge commit' is usually created - although not required - where the commit contains two parent ids.

1. The id of the last commit in the target branch (e.g. master)
1. The id of the last commit in the branch

As the merge commit is added to the _target branch_ it adds to the history. The branch doesn't change, and can be deleted. All commits from the branch are now accessible from the target branch.

Further reading: 

- [Git branching and merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [Subversion merging (reintegrating)](http://svnbook.red-bean.com/en/1.7/svn.branchmerge.basicmerging.html#svn.branchemerge.basicmerging.reintegrate)


### Git commit ids
It's worth talking about commit ids in _git_ here, as they form a crucial part of any understanding of the more advanced topics I'll cover in later posts.

I've described the contents of a _git_ commit above; each of these are held within a header of the _git_ commit. The changes to each file in the commit are then stored in the 'body' of the commit. I'm not going to cover the storage mechanism here - if you're interested there is lots of documentation online.

A commit id in _git_ is a [SHA-1 calculated hash of the body and the header](https://stackoverflow.com/questions/29106996/what-is-a-git-commit-id) of each commit. The header will be produced - using _now_ as the commit time - for every new commit. As such it is always unique.

> Git is smart enough to figure out what commit you’re referring to if you provide the first few characters of the SHA-1 hash

[Git revision selection](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection)

A full commit hash is 40 characters long, but typically you can uniquely identify a commit using the first 7 characters.

A commit in _git_ is immutable: any change to it - be that its message, sequence, or body - will produce a new commit with a new id. Every time a commit is made the current time is used for the commit time. As the commit time forms part of the header for the commit, which in turn is used to calculate the hash, every time the commit is produced it will have a different id.

These are the most important things to remember from the paragraphs above:

1. Commits are immutable
1. Commit ids will be different every time - even if the commit is otherwise indistinguishable
1. Commits contain their parent id(s) in their headers

Further reading:

- [Git revision selection](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection)

### Centralised vs Distributed Version Control Systems

One fundamental difference between source control systems lies in whether they are distributed or not. Git and Mecurial are examples of Distributed Version Control Systems (DVCS) whereas Subversion and Sourcesafe are not. The difference is important, and impacts what you can and cannot do with the tools.

It doesn't affect how branches and commits work - per se - but does impact what you can do with them.

For example, with Subversion it is all or nothing: everything you have changed will make its way into the commit and be immediately sent to the server. The system is centralised, so changes have to be sent there to be 'committed'. Git and other distributed systems hold these changes locally and permit them to be published when it suits you.

As a product of this approach, you cannot rely on the server providing you with the commit id - hence it is calculated as a hash of the header and body of what is going to be committed and when.

This distributed approach also opens the door to many time-saving and quality-improving techniques, some of which are:

- You can choose to include only the changes you want to in the commit you make
- You can go back and rework a commit (so long as it's not being used by anyone else)
- You can create local branches and switch between them without affecting others
- You can try out changes locally (and commit them) and then proceed/abandon them as you see fit

Further reading:

- [Git: Recording changes to the repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

### Additional terminology

Some additional terminology you may also come across is summarised below:

- [**Clone**](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) (DVCS) [**Checkout**](http://svnbook.red-bean.com/en/1.8/svn.ref.svn.c.checkout.html) (VCS): The process of 'copying' a repository from the server to your computer so you can use it.
- [**Diff**](https://www.atlassian.com/git/tutorials/saving-changes/git-diff): A depiction of the code differences between two commits, or branches
- [**Fetch**](https://www.atlassian.com/git/tutorials/syncing/git-fetch) (DVCS): The process of retrieving updates from the server and storing them locally (but not updating your source code immediately)
- [**Fork**](https://guides.github.com/activities/forking/): An isolated copy of a repository. Typically so you can make changes and then propose them as changes to the original, where you may not originally have permission to perform certain actions
- [**Merge conflict**](https://blog.scottlogic.com/2018/05/30/avoiding-seeking-solving-source-control-conflicts.html): When a branch cannot be cleanly merged into another
- [**Origin**](https://www.git-tower.com/learn/git/glossary/origin) (DVCS): The default name for the remote server address
- [**Pull request**](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests): A request to merge a branch into another, possibly across 'forks'
- [**Pull**](https://www.atlassian.com/git/tutorials/syncing/git-pull) (DVCS) or [**Update**](http://svn.gnu.org.ua/svnbook/svn.ref.svn.c.update.html) (subversion): The process of retrieving updates from the server and bringing them into your current branch
- [**Push**](https://help.github.com/en/github/using-git/pushing-commits-to-a-remote-repository) (DVCS): The process of publishing your local changes to the server
- [**Remote**](https://www.atlassian.com/git/tutorials/syncing) (DVCS): The alias to the remote server address, normally called 'origin'.

## What next...

Now you're familiar with these concepts you're in a position to understand & maximise your usage of the more advanced and time-saving features of source control products. The additional terminology is useful to understand too, as they're often referred to when describing these more advanced features. `git rebase` is a one of the greatest time-saving features - but it's a bit more involved, so I'll explain it and how you can use it in my next post...
