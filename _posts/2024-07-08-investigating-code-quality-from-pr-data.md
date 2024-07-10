---
title: Investigating Code Quality from PR Data
date: 2024-07-08 00:00:00 Z
categories:
  - Artificial Intelligence
tags:
summary: Many of us are now using Generative AI to produce code, but what impact is this having on code quality? By analysing the data contained in PRs, our team has built a tool to investigate this.
author: alaws
---

When a developer wants to make changes to a code base, they raise a pull request (PR) which contains the proposed changes to the code and a written summary of the changes made. Other developers will then review this PR, leaving comments or suggestions, before ultimately deciding whether to approve the changes.

PRs contain valuable data which can help us to get an insight into the process of writing code, and the teams involved. For example, we can use LLMs to analyse the tone of PR review comments - showing us the attitude that reviewers have towards the proposed code changes.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-tone-per-day.jpg
"Comment Tone Analysis per Day")

Of all the impolite comments written, the majority are left on code written on a Friday, which may be an indication that the quality of code written begins to slip towards the end of the week. In contrast, reviewers ration their excitement on PRs opened on a Monday. Perhaps they are also reviewing on a Monday, and are not overly enthusiastic about the prospect? Or perhaps developers are getting the more mundane tasks over and done with at the start of the week?

Our team has built a command line tool which, when pointed at a repository, uses data from PRs to produce a variety of different metrics. These metrics then help us to understand a bit more about the dynamics within teams, the quality of code produced, and the speed at which new code is released.

### Motivation

Generative AI is everywhere, and software development is no exception. Tools such as [GitHub Copilot](https://github.com/features/copilot) and [OpenAI's ChatGPT](https://openai.com/chatgpt/) help developers to quickly write significant amounts of code, reportedly increasing developer productivity. However, this refers purely to the speed at which code is written. The quality of the code produced is arguably more important, but much more difficult to quantify.

The role of a software developer is multi-faceted, and writing code is just one part of the job. Therefore, if GenAI coding tools allow us to write code more quickly, but that code ultimately takes longer to review or is harder to maintain, is it really making us more productive?

PRs contain a huge amount of valuable data that can start to give us an idea of the code's quality. If the [CI/CD pipeline](https://about.gitlab.com/topics/ci-cd/) repeatedly fails, the code may not have been thoroughly tested or properly formatted. If a PR receives lots of review comments, it's likely that there are a number of changes that need to be made. Equally, if it takes weeks for a PR to be approved, it may be a reflection of the amount of work required to get the code to a point that the other developers are happy with it (either that, or the developers are just slow to submit their reviews...).

### Enter LLMs

LLMs (Large Language Models), are noted for their ability to be able to interpret and generate human language, and this also extends to code. Although LLMs can write code, there are some common pain points that are characteristic of AI-generated code and may impact code quality. Things like not adhering to project conventions or not using functions that exist in other parts of the code base, are often clues that code may have been AI-generated.

These issues are likely to be noticed by reviewers. Therefore, what's written in comments is a valuable source of information. For example, what do reviewers frequently suggest needs to be changed? Is a developer frustrated to make this suggestion (perhaps they've made the same suggestion several times already)? Are developers generally polite to their colleagues, but harsher on code that they suspect is AI-generated? We can pass review comments, or even pieces of code, to an LLM and use them to start to answer these questions.

### Pulling this together into a tool

Our team built a tool, to which we provide a GitHub or GitLab URL. It then scrapes the PRs that have been raised within that repository. We take the PR data and process it, to produce a range of different metrics which we classify as either deterministic or AI-powered. Our deterministic metrics use data such as the number of files changed, number of comments, requests for change, PR duration, and PR contributors. The AI-powered metrics use LLMs to analyse things like comment tone and subject, and to detect disagreements within comment threads.

These metrics are then saved to a Parquet file, which can be exported to a [ClickHouse](https://clickhouse.com/clickhouse) database and imported into [Apache Superset](https://superset.apache.org/) to create a dashboard which allows us to visualise and explore the data captured.

To demonstrate our tool, we have used it to analyse 1000 PRs from four different repositories, namely [CPython](https://github.com/python/cpython), [Rust](https://github.com/rust-lang/rust), [OpenJDK](https://github.com/openjdk/jdk), and [TypeScript](https://github.com/microsoft/TypeScript). We've then produced some charts displaying a range of the metrics we produce, with the aim of gaining an insight into the development of these projects and the quality of code contained in the PRs.

##### PR Creation

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-date-combined.jpg "Number of PRs opened per month")

We configured the tool to pull the latest 1,000 PRs for each repository (as of 17/06/24). For CPython and Rust, these were all created between May and June 2024. In contrast, with TypeScript, there has been a fairly consistent number of PRs opened each month since August 2023. Remarkably, in May 2024, there were 602 PRs opened in the CPython repository, and 623 opened in Rust, which shows us the speed at which these languages are evolving.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-day-pr-opened.jpg
"Percentage of PRs opened per day of the week")

The date and times that PRs were opened can give us an indication as to whether the developers working on these repositories are doing it as part of a job or as a hobby. However, this relies on the assumption that those who are contributing as part of their job are raising PRs during working hours, and those contributing as a hobby are more likely to be making contributions during weekends or evenings.

Looking at the percentage of PRs that were opened on each day per repository, we can clearly see that across all the languages, there are fewer opened on weekends, suggesting that the majority of developers contributing to these repositories are doing so as part of a job. If this is the case, the developers working on OpenJDK must enjoy a particularly good work-life balance, as only 6% of their PRs were opened on weekends.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-time-pr-opened.jpg "Percentage of PRs opened per hour of the day")

Working on the assumption that developers are predominantly raising PRs during the working day, the times at which PRs are opened can give us an idea of the geographical distributions of the developers working on each repository. For example, we might expect that within a company, the team members working on one project are likely to be located in the same timezone, the PRs are raised at specific times within the day.

The above graph shows a rolling average of the percentage of PRs opened at each time, using a period of 3 hours. The graph produced from the Rust repository is flatter, suggesting that there is a more even geographical distribution of developers, compared to the other languages. CPython and OpenJDK seem to have some geographical distribution, with a modest concentration of their developers being based in America and Europe respectively. In contrast, Typescript seems to have a high concentration of developers based in America and Canada, which can be confirmed by exploring the [repository contributors](https://github.com/microsoft/TypeScript/graphs/contributors).

##### PR Duration and Review Time

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-pr-duration.jpg
"PR Duration for each Repository")

*Note: this graph only includes PRs which received review comments.*

`PR Duration` is a measure of the time elapsed between a PR being opened, and it being either merged or closed. If a PR takes a long time to be approved, it could be that the reviewers are dubious that the proposed changes will be an improvement, or that they need some further work before the reviewers are happy. However, it may be the case that a PR sits in review for a period of time, before a reviewer first looks at it. For this reason, we added the additional measures of `Time to First Review` and `First Review to Last Commit`.

TypeScript PRs have a longer average duration than the other repositories. There could be many different reasons for this, including PRs containing lower quality code, reviewers being particularly strict or upholding high standards or simply reviewers being slow to submit their feedback.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-time-to-first-review-by-day.jpg
"Time to First Review By Day")

However, PRs opened on a Saturday (or possibly late on Friday due to timezones) spend significantly longer waiting for the initial review, presumably until work resumes on Monday. In contrast, TypeScript PRs opened on a Friday are reviewed very quickly, which could be a clue that new versions are released on a Friday, or maybe that developers like to get PRs closed before the end of the week.

##### Comment Subject, Tone and Disagreements

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-LLM-pain-points.jpg
"LLM Pain Points")
Here, we asked an LLM to count the number of times reviewers picked up on issues that are common to AI-generated code, but are also indicators of code quality. It's worth mentioning that all the pain points we identified were picked up to some degree in each of these repositories. Not adhering to project standards is the most frequently identified issue across all of the repositories, followed (closely in the case of TypeScript) by adhering to the language's best practices.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-comment-tone.jpg
"Tone Analysis of Review Comments")
Here, an LLM was asked to take a comment and interpret which of the following tones described the comment: polite, neutral, satisfied, frustrated, excited, impolite, sad. Encouragingly, we see that the reviewers for these repositories are polite in the majority of their comments and are almost never sad. Developers contributing to OpenJDK appear to very rarely express any excitement towards their fellow developers' proposed changes, or maybe this reflects a lack of enthusiasm for reviewing PRs?

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-number-of-disagreements.jpg
"Number of Disagreements in PR Comments")
To calculate the number of disagreements, comment threads are passed into an LLM, which is then asked to count disagreements within that thread. The total number of disagreements across all comment threads on a PR is then calculated. The TypeScript repository is home to some keenly debated changes, as there are 5 PRs with over 30 disagreements in their comments. This is an indication that the developers may have conflicting ideas as to what needs to be changed, or may not be on the same page when it comes to project conventions and standards.

These PRs also have some of the highest numbers of comments - reaching up to 214 on one PR. If a PR receives a high number of comments, it's likely that the reviewers have identified a number of changes they believe should be made to the proposed new code, perhaps suggesting that they aren't happy with the quality of the new code.

### Conclusion

The data extracted from pull requests can provide some insights into the quality of the code, but also provides some interesting opportunities. If we were to run our analysis on repositories that are known to use AI code generation tools, and compared them to repositories that are known to be human-written, we could start to analyse the impacts that these tools are having on the quality of the software we produce.

Many thanks to all members of the AI Repository Analysis team including Chris Price, Diana Prahoveanu, James Strong, Jonny Spruce, Matthew Beanland, and Nick Gillen for helping to put together the tool which made this blog possible.
