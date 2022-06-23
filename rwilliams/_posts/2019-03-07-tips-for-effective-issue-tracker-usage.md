---
author: rwilliams
title: Tips for effective issue tracker usage
layout: default_post
summary: "The flexibility and power of issue tracking tools can make it difficult to figure out how to use them effectively. In this post, I present a few simple tips on what I find works and what doesn't."
categories:
  - Delivery
---

Most projects use an issue tracking system to capture and track items of work through the delivery pipeline. The task at hand combined with the great configurability of these tools can make it difficult to know how to use them effectively, and leaves open a few traps for teams to fall into.

In this post, I present a few simple tips on what I find works and what doesn't. They arise from practices I've seen work well, and some that didn't work so well. They include things that may seem obvious to experienced users, gotchas and surprises, and longer-term realisations. They relate directly to Atlassian's JIRA (arising from years of using it in large organisations), but most are general and should be transferable to other similar tools.

The "right" configuration and usage practices are pretty specific to individual teams and the projects/situations they work in, so one size doesn't fit all. Some things may work for you, others won't, and we all have our own preferences and approaches. So this guide is by no means definitive or comprehensive.


## Allow configuration to be tailored for project needs
As with most tools, issue trackers work best when teams are empowered to use them in a way that works for their individual circumstances and working practices.

Corporate deployments however often discourage or even prohibit project-specific configuration. A global one-size-fits-all configuration may be provided, with the same issue types, fields, statuses and workflows intended to suit all projects. Project-specific changes, or permissions to make such changes, may take weeks - or not be possible. This can lead to projects using a configuration that doesn't suit their needs/process, or that gets in their way.

Permissions granted to modify configuration need to be granular, to avoid project administrators being able to modify parts of configuration that is shared between all projects. Wide-ranging permissions inevitably result in changes ending up being made without consultation, accidentally or otherwise.


## Choose a project key that's long enough - but no longer
Issue keys or identifiers (e.g. MYPROJ-123) uniquely identify issues (stories, bugs, etc.) in a project. The project key forms the first half, and uniquely identifies the project - making each issue key unique across all projects. Since issue keys are used frequently and in many locations, keeping them short allows quick typing (not everyone is allowed/uses text expansion tools!) and display in a reasonably-sized space.

Although it's usually possible to change project keys at any time, their use in external integrations such as source control and build systems means that this is rarely done in practice. So pick a nice one from the start - short, meaningful, and recognisably distinct.

*Note: in JIRA, the default setup imposes a 10 character limit; this is often overridden to be longer in corporate installations.*


## Create and tailor views for different participants
People with different roles in a project have different, sometimes conflicting, needs when it comes to viewing the status/progress of work - such as issues in a sprint.

 Attempting to serve all of them using a single view/board configuration doesn't tend to serve anyone well. Developers typically want a low-level view focused on their work, while product owners and delivery managers tend to want a higher-level view - perhaps omitting some detail and grouping issues differently. Business analysts and testers may want something different still.

View/board configurations that attempt to satisfy everyone, often end up not satisfying anyone. They may be configured to suit the needs of the most powerful participants, at the expense of those who make the most use of them. Separate views/boards tailored for the needs of different roles allow each to have a setup that suits them best.


## Use the right feature to group epics of issues
Epics are large pieces of work, which can be broken down into individual stories for prioritisation and development. These stories then belong to that epic. In JIRA for example, this relationship powers various useful features including filters in the backlog view, and display of the epic name on sprint board issue cards.

These features are foregone when other means of grouping are used, such as components or labels. Compensating for this by prefixing issue titles with the epic name, adds clutter and causes the last (useful) part of the title to be truncated in some views.


## Use issue fields consistently
In order for a field to be useful, it needs to be used for the same purpose by all team members. Used for different purposes, it's no longer useful for any of them. This can cause confusion and incorrect results in queries/reports. Teams and other participants need to agree which fields are used for what, and stick to them.

Consider for example a "fix version" field used inconsistently. The release process sets it on fixed issues, but it's also sometimes set by others who report bugs to indicate which version they desire it to be fixed in. Should a query then use this field as criteria for generating release notes, the result may not reflect reality.


## Prefer purpose-specific fields over labels
The flexibility and convenience of labels can make them attractive to use for purposes better served by other purpose-specific functionality. Fields such as status, priority, and fix/affects version are integrated with other tracker features such as workflows and releases - making them much more powerful than labels. Custom fields can also be created.

Labels/tags themselves can be useful for marking and subsequently finding sets of issues that are related for any reason. They are however difficult to apply consistently, for example case-sensitivity, or giving rise to the expectation that all issues that should have a certain label do in fact have that label. This can lead to missing out on issues when filtering. In practice, consistency and completeness becomes difficult to stick to beyond a few "core" labels.


## Use links to join related issues
Searching and filtering are great for finding something you're looking for - but it's also helpful to be led to other things that are *related or likely of interest.*  Creating meaningful links between issues makes this possible in both directions, for example depends-on, caused-by, relates-to, or duplicate-of. When you're looking for something, but not sure what, a linked web of issues makes it much easier to discover it.


## Record reasons for actions
Issue history lets us see everything that's happened to an issue so far - additions, changes, status changes, etc. What it doesn't tell us is *why* those actions were taken - why was this story removed mid-sprint, why was this bug rejected as won't fix. An individual might remember today, or remember they have an email from someone archived, but that's not open or permanent.

Adding comments fills in this gap, the same way they do in source code. This saves any future puzzling, and conveniently communicates to other participants without requiring them to ask you.


## Start sprints in the present
Issue trackers typically rely on sprint starting time to determine what to include in sprint reports and metric calculations. Some (e.g. JIRA) however also allow the sprint start time to be set in the past. It may be tempting to do that, and adjust from the default (current time) back to the start of the day - to reflect the official start time or just to be tidy.

To preserve meaningful metrics and reports, this needs to be avoided. If done, all changes made to the sprint after the chosen start time (e.g. during sprint planning) will feed into all metrics and reports as within-sprint changes - making them meaningless and adding noise.


## Try built-in features before exporting to Excel
Spreadsheets are powerful and flexible, and many people are comfortable with using them to filter and manipulate/edit data. Exporting lists of issues to them for such things and sharing with others however immediately disconnects the data from the constantly-changing situation within the issue tracker. This leads to an outdated view, inconsistency, and the need for tedious reconciliation.

Many, but not all, these purposes can often be better (or sufficiently) served by using built-in features. Issues can be labelled. Queries can be saved and shared (even subscribed to for notifications). Various reports and charts can be generated, and progress towards milestones can be visualised.


## Use filter subscriptions to keep informed and catch problems
In a busy project, it can be hard to keep track of what's going on, and small oversights in filling in issue fields and keeping them updated can cause problems. Creating saved filters to catch these and then subscribing to them (for emails only if there are any results), allows us to keep informed with minimal effort.

Filters that are useful will vary by project and workflow. Some that I've found useful are: new bugs reported yesterday, issues being worked on that are not in a sprint, issues without an epic, and done/fixed issues missing a fix version.


## Tame notifications and emails
Participating in an issue tracker can easily lead to a deluge of emails in your inbox.

A common solution to this problem is to set up a mail rule to delete them, or direct them to a folder - never to be read. Users who do so, in my opinion, are missing out on an efficient way of receiving relevant information in a world of noise. The user misses out on updates they're interested in (new issues, comments, key status changes, etc.). This can lead to team members being asked to personally communicate those updates manually, which is less efficient.

By setting up more fine grained mail rules, notification emails can be sorted into folders by type (comment, status change, etc.) - or even just "interesting" and "everything else". I find that this approach surfaces the 5% of notifications I care about, and allows me to ignore the remaining 95% without consuming any of my attention. Simple string-contains rules on the subject and body are usually sufficient. Some trackers ([GitHub](https://help.github.com/articles/about-email-notifications/)) include a marker-address in the CC field with the notification reason for ease of filtering.

Rules can be exported from mail programs and shared with others in the team, lessening the setup effort and giving them a starting point to customise for their personal preferences.


## Learn and use keyboard shortcuts
Basic and general keyboard shortcuts (such as copy/paste) will be familiar to most people who use issue trackers. Developers especially will be familiar with many more in most of the tools they use, in order to improve productivity. Some issue tracker users may however not realise (most trackers being web-based) that a whole range of shortcuts are available. Learning just a few key shortcuts will save time, and the saving is multiplied when using them during backlog refinement of sprint planning with the whole team.


## Stick to it when crunch time comes
This one is on the edge of the agile antipatterns world, and so-called crunch time should hopefully be a rare or non-occurrence anyway. Under deadline pressure, it may seem tempting to (or be imposed to) generally drop all practices and processes not viewed as absolutely necessary - such as code review and testing.

As with others, dropping the tracker tends to be a false economy. It causes more time spent in manual communication of progress and figuring-out of what is done/isn't at the end. It also creates a gap in the history of the project.
