---
title: Observations on finding good first issues
date: 2022-08-12 10:46:00 Z
categories:
- Open Source
author: rwillis
---

As part of a larger investigation into sustainability in open source development, I recently undertook an exercise to find open source projects and issues for a small team of developers to contribute to. While there is a wealth of development experience within the team, only one of us has any experience contributing to an open source project before.

The process was challenging, and I found that a fair amount of effort is necessary to identify worthwhile issues among the large volume of work available. With little prior experience, the variability in documentation, engagement and presentation between (and sometimes within) projects make it necessary to dig into each individual issue further than I had expected.

I had some success in finding issues to engage with but I was also able to make a few key observations which you’ll find below. Much of this may be obvious, especially in hindsight, but I hope something here can be helpful to new contributors as well as project maintainers.

## The approach

My approach for the purpose of this exercise, was to use a number of websites which promote open source projects generally, as well as those that curate lists of “good first issues” and “up for grabs” issues specifically. These sites aim to provide potential contributors with accessible avenues into open source work as well as exposing and promoting projects in need of contribution.

The sites I used included:

* [Good First Issue](https://goodfirstissue.dev/)

* ...not to be confused with [https://goodfirstissues.com/](https://goodfirstissues.com/)

* [CodeTriage](https://www.codetriage.com/)

* [First Contributions](https://firstcontributions.github.io/)

* [Open Hub](https://www.openhub.net/)

* [Up For Grabs](https://up-for-grabs.net/)

* [LibHunt](https://www.libhunt.com/)

In addition, I looked at open source projects with which we are already somewhat familiar, having used them in the past in other projects, for instance.

I focused on projects that are primarily .NET based, since it’s where we have the most common experience. So bear in mind that some of the observations below might apply more in the .NET world than elsewhere.

## 1. The websites are useful, but they only go so far

The process started off well since there’s no shortage of open source projects, and no shortage of work to do. The websites listed above were valuable in giving me a direction in which to set off.

In particular, I found that [Good First Issue](https://goodfirstissue.dev/), which specifically filters the listed projects for issues marked as “good first issue”, allowed me to get a sense of the actual volume of potential work available on a project for new contributors.

In contrast, [CodeTriage](https://www.codetriage.com/) lists its projects in order of the total number of open issues. This means that the larger, more established and better supported projects are at the top of the list. These can be fruitful grounds for suitable issues but a little more work is needed to filter them out.

On the other end of the scale, some sites lean more heavily towards much smaller projects. For instance \[Good First Issues\]\[https://goodfirstissues.com/\] lists issues directly with some corresponding information about the project. While there are certainly some worthwhile projects and issues to be found here, there is a lot more noise.

Overall, I found it invariably necessary to further filter the results from these sites by individually evaluating each repository, looking at their size, aims and activity patterns.

**Advice for contributors**

Assuming you don’t already have a project in mind and are keen to get started on anything, try to be methodical and narrow down your search to a handful of projects to begin with. If you’re using these sites to find issues to work on, be prepared to do some extra work to investigate each project.

It can be less than obvious that a project is still active, whether it’s in a maintenance state or simply seeing less attention recently. For instance, the latest commit to the develop branch in [oxyplot](https://github.com/oxyplot/oxyplot) is 4 months ago at the time of writing and the Code Frequency graph certainly seems to suggest it is all but inactive, but there are still issues and pull requests being actively discussed albeit on a relatively slow scale.

## 2. It's a different world

Even as a relatively experienced developer I found the process a little daunting. I was looking for suitable work in unfamiliar projects, with a vast array of options before me and little relevant experience to draw on that suggested how my first interactions would go.

Communication in the open source world tends to happen at a much slower pace. It was days before [my first comment on an issue](https://github.com/fluentassertions/fluentassertions/issues/1829#issuecomment-1187478169) drew a response. It’s difficult to tell whether you’ve asked the right thing, been too wordy or too vague, or even asked a plainly nonsense question.

Having worked with a few different development teams across a range of industries and projects before, one thing I’ve always been able to do easily is hold face-to-face, real-time discussions with my colleagues in order to solve a problem.

When trying to contribute to an open source project this just isn’t feasible.

**Advice for contributors**

It may take several attempts to get any response when you’re looking to engage on a project, so you may need to reach out in multiple places at once. I think it’s important to strike a balance here though, and be aware that you could hear nothing for days before being enthusiastically replied to by every maintainer you’ve contacted at once!

I’ve observed that depending on the project or issue, a maintainer may simply assign the issue to you with minimal further comment, while another might engage in some conversation about the issue before assigning. Yet others may not even use the “assign” functionality at all.

This may depend on the size and complexity of the project, or the size of the maintaining team. Github offers a comprehensive standard set of tools to project maintainers, but there is no single standard approach to using them. You may find that larger or more established projects are more consistent in their interaction.

**Advice for maintainers**

First time contributors are likely not yet used to the style and speed of interaction in the open source world, so the clearer your intent, the better. Assigning an issue to a contributor may seem a clear signal that you’re happy for them to go ahead, but a little extra communication, even as simple as “It’s all yours, go ahead!”, gives a much clearer impression to a first-timer.

This has an effect outside of these individual interactions too - when looking for projects to work on, seeing this sort of clarity of communication in issue discussion is very encouraging.

## 3. Features, bugs and documentation dominate

It’s perhaps not surprising that the vast majority of issues, especially good first issues, are a mix of small feature requests, bug fixes and to a lesser extent (though it varies across projects) documentation updates.

Less common by far are specific tasks set out for testing, either manual or automated, or for design or project administration. There are good reasons for maintainers to prefer keeping some of these tasks within the ownership of the maintenance team, especially when it comes to aspects such as design which require a shared vision that is perhaps difficult to coordinate outside of a more traditional team-structure.

**Advice for contributors**

If you are someone with technical experience outside of writing code, it could be more difficult to find good entry points into open source projects, but that’s not to say that work isn’t out there - it may just be that you need to initiate it.

Bug reporting is a useful contribution to any open source project, but *good, systematic* bug reporting is a skill particularly possessed by test engineers. Suggestions for improvements or new features can equally come from designers or analysts.

As always though, when reporting issues on an open source project be courteous and diligent - especially so with feature requests. You are asking for the maintainers' limited time and attention on your idea.

**Advice for maintainers**

Consider whether your project provides clear and structured avenues for non-developers to contribute. Test engineers, UX designers, business analysts and so on are vital to traditional development teams not only for their skills but also the different perspectives they can offer.

## 4. “Good first issues” are not all alike

Once I had some issues to investigate, the next problem was that “good first issue” can mean something very different from project to project.

Projects can differ hugely in the amount of work needed to get started. What might be a good first issue in the context of contributing to a specific project, might still require a significant amount of time and attention invested in getting to a point where work can be started.

My first instinct after cloning a project is to build, test and run. In an ideal world that would always just work, but in practice any project more complex than the smaller helper libraries will have external dependencies such as databases, frameworks etc. that need installing and configuring in order to get everything running. If a brand new contributor has to muddle through this themselves with no obvious source of help, there’s a good chance they’ll give up early.

Some good first issues are labelled as such because the maintainer can see that they’ll really only need a few lines of code changed, and perhaps a new test or two, but this is not always so obvious to a new contributor.

**Advice for contributors**

Take some time to familiarise yourself with the aims of the project.

Be prepared for issues to be more complex than they seem, and account for the time you’ll need to get the code up and running to begin with.

Do some work before committing to working on an issue to work out whether it really is something you can tackle in a reasonable time. Depending on the project, this could be as straightforward as browsing the code on Github. Cloning the code, going through the build process and trying to replicate the issue could take a little more time, but can be worth it to get a feel for the project.

**Advice for maintainers**

Consider what “good first issue” means for your project. Having a consistent definition or guideline for applying this label might help first-time contributors get stuck in. The standard contribution documentation (CONTRIBUTING.md) might be a good place to outline what labels first-time contributors should look for, and what they mean in the context of your project.

Make sure your project readme or other up-front documentation highlights or clearly links to anything out of the ordinary about compiling or running your code.

## 5. Implementation hints are *really* helpful

The first thing we see when opening an issue on Github is the description, and in an ideal world this would contain all the information necessary for a contributor to make a start.

But even on projects with well established guidelines for issue reporting, descriptions can be very terse. In these cases I needed to dig around for context, finding related issues and discussions and preceding pull requests most helpful. Sometimes, merely cloning the code and going to a file or line mentioned in the description gave me some direction that I couldn’t glean from the description alone.

In some circumstances I was lucky enough to come across an issue where the maintainer is able to give a suggestion about what would be involved in solving the issue.

A good example of all of the above is [this issue](https://github.com/dotnet/efcore/issues/25027) in the EntityFramework Core project. Here, the description is tiny - merely an example of one change that might be made. However we can quickly see that it originates from a related change and the suggestion of another maintainer in the pull request for that change.

Moreover, the maintainer has gone further and suggested a more specific task needed to implement this change, and pointed us at the right place in the code-base. From the initial description it’s difficult to judge the size of the task, but that hint together with a little digging (and some prior experience with EntityFramework and its purpose) allowed me to build up a better idea of the scale of the issue and the nuances involved.

**Advice for contributors**

Look beyond the initial description and discussion on an issue, and investigate how it came about.

For issues raised as “to-do” or “nice-to-have” tasks by maintainers, see if you can find the discussion or pull request where the idea originated.

For feature requests and bug reports, trying to reproduce the issue yourself can reveal context that the reporter might have unintentionally missed in the description.

**Advice for maintainers**

Implementation hints are immensely helpful new contributors who are not yet familiar with the structure and organization of your project. There’s a balance to be drawn, but even something as simple as “look at these specific files first” gives us a direction to set off in and can prevent a new contributor from getting immediately lost on an issue which seems straightforward through the lens of the maintainer’s experience. If you can link to a specific file or line of code, even better!

## 6. Feedback is important even if you don’t get anywhere

Often issues will get picked up by new contributors, only to be swiftly abandoned. Thankfully, it seems very common, especially on more established projects for the contributor to announce this on their own or for maintainers to check in and prompt it.

What seems less common, is to see much information volunteered from contributors who have had to abandon an issue. For instance, at the time of writing, multiple contributors seem to have taken interest in [this issue regarding whitespace comparison in Xunit](https://github.com/xunit/xunit/issues/2440), but it remains open and apparently without progress. While it’s probably that these contributors were simply unable to spare the necessary time, despite their best intentions, it could also be that one of them made some progress only to find a blocking problem, and gave up.

This is not to say these contributors must explain themselves of course! They’re contributing their free time after all. But it does suggest that this issue might be more complex that it first appears, and it’s possible that anyone who’s tried to tackle it has learned something that could be valuable to the next person, or that could indicate to the maintainers that it’s perhaps not such a good first issue.

**Advice for contributors**

Be as forthcoming as you can, whether or not you make any progress on an issue. If you think the issue is not quite as simple as the discussion or description implies, then say so. If you made some progress but couldn’t finish, consider communicating that by keeping your branch open and linking to it.

If you try something that doesn’t work, that information can still be valuable. Help others avoid going down the same path.

**Advice for maintainers**

If a contributor abandons an issue, it might be worth prompting them to share what they tried. Perhaps they missed something obvious that you could have pointed out if you’d known it would help.

## Conclusion

There is an overwhelming volume of work available in the open source world. If you’re a new contributor looking for work but you’re not sure where to start, websites such as those listed above can help to orient you, give you some ideas and narrow down your search.

What makes a “good first issue” varies a lot from project to project, so it’ll most likely take a bit of trial and error, as well as communication to find a good route into open source contribution.

If you maintain an open source project and are interested in attracting or sustaining contributors (or struggling to do so), hopefully the observations above will prove helpful.

Overall, on both sides, valuing others' time is paramount. Most people working on open source projects in any capacity are contributing their spare time. In the observations above, I hope we have identified some things that both contributors and maintainers can do to maximise the value of each other’s time.