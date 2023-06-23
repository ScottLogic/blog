---
title: My Top Ten Tips for Peer Review
date: 2023-06-23 09:00:00 Z
categories:
- Tech
tags:
- Peer Review
- QA
summary: A brief look at why we peer review code and some top tips on how to do it well.
author: dogle
---

For many of us peer review is an everyday part of software development, but why do we bother and how can we do it well?
Here are my top tips for peer reviewing code.

## Why do we peer-review code?

It's a good question, in other industries reviewing others work is often something reserved for junior team members or
for risky work where any mistakes could have major repercussions. Reviewing takes time away from team members who could
be getting on writing their own code and it can hold up code from being merged into the main codebase while developers
quibble about the best name for a variable. It's easy to see why, from a business perspective, you may be keen to avoid
the process entirely after all, we often have pipelines and tests that should catch most issues if we've set them up
correctly. So what value do we get from peer review?

Peer reviewing code encourages the team to take ownership of the codebase, if team members are given responsibility for
maintaining the quality of a codebase they are more likely to take an active interest in its maintenance. A review is a
great way to share knowledge, a person having their code reviewed may learn new or better ways of doing things from
other team members but also those reviewing code are taking time to learn the codebase more deeply. Code review can
catch issues which a single developer may have not thought of, early and prevent a longer feedback loop of moving work
to QA only to have it kicked back again. Code review can help to maintain consistency and quality in your codebase, if
code isn't easy to read and understand it will be less likely to make it past review. Lastly code review can help
discourage throwing "hacky" fixes into the main codebase. If you know your code has to be approved by other developers
you are more likely to spend that extra five minutes tidying it up before you commit. There are other advantages, but
this is enough of a list for now to highlight why we would want to peer review code.

Now that we know why we would want to peer-review code, how do we go about that? It can be a bit daunting if you are new
to the process to dive in and start leaving comments on someone else's work and if we're not careful how we do it we can
stray away from all the great advantages listed above and get into endless arguments about the merits of one stylistic
choice over another. Without further ado then, here are my top ten tips for peer reviewing code:

1. **Check the pipelines have passed.** A lot of the time there are already tools set up that to help maintain quality
   in the codebase. A good [CICD](https://about.gitlab.com/topics/ci-cd/) pipeline may have jobs in place to check
   linting and to test changes automatically before anyone physically looks at the changes. If a pipeline is failing
   there is little value in reviewing until it is fixed as the code will need to be changed anyway.

2. **Set aside some time**. If you're going to review someone's work, set aside some time to do it properly. If you try
   and do a review while in an online meeting or under time pressure before you jump to something else you are more
   likely to miss things or gloss over important details. It's a waste of your time and the person who is asking for a
   review if it isn't done properly, so give yourself time.

3. **Get an overview.** Read the description of what the changes are trying to achieve before diving into the code, make
   sure you understand the point. Once you've done that have a quick skim over the files that have been changed and try
   to get a good overview of what the changes are doing before you go any deeper. Often going line by line through
   changes will get confusing and mean you miss things at a higher level.

4. **Ask questions**. If you don't understand what code is doing, you can't really review it. If a function or block of
   code is particularly confusing to you, there's a good chance it will be confusing to someone else as well and may
   need some comments or refactoring to make it clearer. If the entire change is confusing, maybe the description needs
   to be clearer or perhaps a quick chat with the person who requested the review will be enough to give you the
   foundational knowledge to review the changes effectively.

5. **Check out the code**. Viewing a list of additions and deletions can often be confusing, no matter how nicely
   formatted. Checking out the code and looking at the changes in
   your [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment) can be an effective way to help yourself
   understand what's happening and how it fits with the wider context of the codebase. It has the added advantage that
   you will gain the benefits of whatever syntax highlighting the IDE offers to help you spot issues and also allows you
   to potentially run the code to check the changes work as expected.

6. **Think about what's not there.** It's easy to focus on just the things that have been added in a review but equally
   important is to look at what has been removed. Make sure you understand why code has been removed and check if things
   have been removed with no obvious reason. Alongside this it's important to ask yourself if anything is missing; would
   you expect to see new tests added that aren't there for example or are there other areas of the codebase you would
   expect to be updated as a result, such as the documentation.

7. **Be methodical.** Often it doesn't make sense to start reviewing code changes in the order that they are presented
   to you in a web browser. When you orientate yourself with the code base in your first pass (see above), think about
   where makes most sense to start your review. Platforms such as GitLab and GitHub will allow you to collapse the files
   as you go so you can easily keep track of what you've already reviewed and what you have left.

8. **Don't be afraid to nitpick.** One of the big benefits of doing code reviews is that it helps to build a consistent
   and quality codebase and builds consensus and ownership across the team. Small details like a missing comment, a
   badly named variable or an inconsistent way of doing something may seem trivial and not worth mentioning however,
   these little issues can quickly pile up and leave you with a messy codebase that's hard to maintain. It's often worth
   commenting on things that you may be tempted to dismiss as trivial as it can open a conversation and help build
   agreed practices across the team. There are a couple of caveats here however: Firstly, try to always have a reason
   for your comment asides from "I just don't like it", even if the reason is simply, "that's not how we've done this in
   other areas of the code". Secondly always try and remain pragmatic (see tip number 9).

9. **Be pragmatic.** People will not always agree with your comments, remember the goal here is to open a conversation
   not to insist on having your way. Be careful you are not blocking people from getting work done by making something
   your hill to die on. Some debate can be very useful for thrashing out an issue but always keep an eye on the bigger
   picture. Is the issue worth the time taken to debate? Is there a interim compromise you could suggest such as
   splitting your suggested changes into another ticket? Sometimes a quick call or a face to face conversation can help
   to work out issues and find a way forward (see tip number 10).

10. **Keep it public.** When you're having a discussion on a particular topic in a code review it can be tempting and
    easier sometimes to message the person requesting the review directly on have a face to face conversation to resolve
    things. If you are going to do this, make sure you comment on the review what the outcome of the conversation was.
    It's important for shared understanding and consensus that everyone can see the comments that are raised on a peer
    review and also the resolution.

That's my top tips for code review, hopefully you'll find it useful the next time you are asked to do a review. In the
spirit of peer review, I'd welcome any thoughts or feedback in the comments.