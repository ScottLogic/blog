---
title: Investigating Code Quality from PR Data
date: 2024-06-24 00:00:00 Z
categories:
  - Artificial Intelligence
tags:
summary: Many of us are now using Generative AI to produce code, but what impact is this having on code quality? By analaysing the data contained in PRs, our team has built a tool to investigate this.
author: alaws
---

PRs contain valuable data which can help us to get an insight into the process of writing code, and the teams involved. For example, we can use LLMs to analyse the tone of PR review comments - showing us the attitudes that reviewers have towards code.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-tone-per-day.jpg
"Comment Tone Analysis per Day")

Of all the impolite comments written, the majority are left on code written on a Friday, which may be an indication that the quality of code written begins to slip towards the end of the week. In contrast, reviewers ration their excitement on PRs opened on a Monday. Perhaps they are also reviewing on a Monday, and are not overly enthusiastic about the prospect? Or perhaps developers are getting the more mundane programming tasks over and done with at the start of the week?

Our team has built a command line tool which, when pointed at a repository, uses data from PRs to produce a variety of different metrics. These metrics then help us to understand a bit more about the dynamics within teams, the quality of code produced, and the speed at which new code is released. 

### Motivation
Generative AI is everywhere, and software development is no exception. Tools such as [GitHub Copilot](https://github.com/features/copilot?ef_id=_k_Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB_k_&OCID=AIDcmm4lwmjeex_SEM__k_Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB_k_&gad_source=1&gclid=Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB) and [OpenAI's ChatGPT](https://openai.com/chatgpt/) help developers to rapidly write significant volumes of code, reportedly increasing developer productivity. However, this refers purely to the speed at which code is written. The quality of the code produced is arguably more important, but much more difficult to quantify.

The role of a software developer is multi-faceted, and writing code is just one part of the job. Therefore, if GenAI coding tools allow us to write code more quickly, but that code ultimately takes longer to review or is harder to maintain, is it really making us more productive?

### So, what gives us an indication of code quality?

When a developer wants to make changes to a code base, they raise a pull request (PR) which contains the proposed changes to the code and a written summary of the changes made. Other developers will then review this PR, leaving comments or suggestions, before ultimately deciding whether to approve the changes.

PRs contain a huge amount of valuable data that can start to give us an idea of the code's quality. If the [CI/CD pipeline](https://about.gitlab.com/topics/ci-cd/) repeatedly fails, the code may not have been thoroughly tested or properly formatted. If a PR receives lots of review comments, it's likely that there are a number of changes that need to be made. Equally, if it takes weeks for a PR to be approved, it may be a reflection of the amount of work required to get the code to a point that the other developers are happy with it (either that, or the developers are just slow to submit their reviews...).

### Enter LLMs

Although LLMs are able to write code, there are some common issues, or pain points, that are characteristic of AI-generated code. Things like not adhering to project conventions, not using functions that exist in other parts of the code base or writing code that is hard to read, are often clues that code may have been AI-generated, and are likely to be picked up in a review.

Therefore, what's written in comments is also a valuable source of information. For example, what do reviewers frequently suggest needs to be changed? Is a developer frustrated to make this suggestion (perhaps they've made the same suggestion several times already)? Are developers generally polite to their colleagues, but harsher on code that they suspect is AI-generated?

These are all questions we can begin to answer with the help of LLMs (Large Language Models), which are able to interpret and generate human language. Therefore, we can pass review comments, or even pieces of code, to an LLM and use them to start to answer these questions. Interestingly, this also gives us an insight into the dynamics within development teams, but more on that later.

### Pulling this together into a tool

Our team built a tool, to which we provide a GitHub or GitLab URL. It then scrapes the PRs that have been raised within that repository. We take the PR data and process it, to produce a range of different metrics which we have grouped into deterministic or AI. Our deterministic metrics use data such as the number of files changed, number of comments, requests for change, PR duration, and PR contributors. The AI metrics use LLMs to analyse things like comment tone and subject, and to detect disagreements within comment threads.

These metrics are then saved to a Parquet file, which can be exported to a [ClickHouse](https://clickhouse.com/clickhouse) database and imported into [Apache Superset](https://superset.apache.org/) to create a dashboard which allows us to visualise and explore the data captured.

To demonstrate our tool, we have used it to analyse 1000 PRs from four different repositories, namely [CPython](https://github.com/python/cpython), [Rust](https://github.com/rust-lang/rust), [OpenJDK](https://github.com/openjdk/jdk), and [TypeScript](https://github.com/microsoft/TypeScript). We've then produced some charts displaying a range of the metrics we produce, with the aim of gaining an insight into the development of these projects and the quality of code contained in the PRs.

##### PR Creation

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-date-combined.jpg "Number of PRs opened per month")

Firstly, a note on PR creation dates. Our tool gathers the 1000 most recent PRs from each repository. For CPython and Rust, these were all created between May and June 2024. In contrast, with TypeScript, there have been a fairly consistent number of PRs opened each month since August 2023 . Remarkably, in May 2024, there were 602 PRs opened in the CPython repository, and 623 opened in Rust.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-day-pr-opened.jpg
"Percentage of PRs opened per day of the week")

Looking at the percentage of PRs that were opened on each day per repository, we can clearly see that across all the languages, there are fewer opened on weekends. Developers working on OpenJDK must enjoy a good work-life balance, as only 6% of their PRs were opened on weekends.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-time-pr-opened.jpg "Percentage of PRs opened per hour of the day")

From this chart, it seems like TypeScript developers are night owls. They open very few PRs before 1 pm and really come alive when when activity on the other repositories starts to trail off (around 4pm). However, when we investigate the [contributors](https://github.com/microsoft/TypeScript/graphs/contributors) further, we can see that the developers are located all over the world, with the majority being based in the US. In our tool, if a timezone isn't returned from the GitHub API, we revert to UTC by default. Therefore, what appears to middle of the night in the UK is probably more likely to be during working day in the US.

##### PR Duration and Review Time

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-time-to-first-review-by-day.jpg
"Time to First Review By Day")

`PR Duration` is a measure of the time elapsed between a PR opened, and it being either merged or closed. However, it may be the case that a PR sits in review for a period of time, before a reviewer first at it. For this reason, we added the additional measure of `Time to First Review`.

Generally, TypeScript PRs spend much longer awaiting review than the other repositories. However, PRs opened on a Saturday (or possibly late on Friday due to timezones) spend significantly longer waiting for the initial review, presumably until work resumes on Monday morning. In contrast, TypeScript PRs opened on a Friday are reviewed very quickly, so the developers must be keen to clear their open PRs before the end of the working week.

##### Comment Subject, Tone and Disagreements

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-LLM-pain-points.jpg
"LLM Pain Points")
Here, we asked an LLM to count the number of times reviewers picked up on issues that are characteristics of AI-generated code. It's worth mentioning that all the pain points we identified were picked up to some degree in each of these repositories. Not adhering to project standards is the most frequently identified issue across all of the repositories and TypeScript reviewers seem particularly keen to ensure that everyone adheres to the language's best practices.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-number-of-disagreements.jpg
"Number of Disagreements in PR Comments")
To calculate the number of disagreements, comment threads are passed into an LLM, which is then asked to count disagreements within that thread. The total number of disagreements across all comment threads on a PR is then calculated. The TypeScript repository is home to some keenly debated changes, as there are 5 PRs with over 30 disagreements in their comments. These PRs also have some of the highest numbers of comments, reaching up to 214 on one PR.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-comment-tone.jpg
"Tone Analysis of Review Comments")
Here an LLM was asked to take a comment and interpret which of the following tones described the comment: polite, neutral, satisfied, frustrated, excited, impolite, sad. Encouragingly, we see that the reviewers for these repositories are polite in the majority of their comments and are almost never sad. Developers contributing to OpenJDK seem to very rarely express any excitement towards their fellow developers proposed changes, or maybe this reflects a lack of enthusiasm for reviewing PRs?

### Conclusion

The data extracted from pull requests can provide some interesting insights into the quality of the code, but also provides some interesting opportunities. If we were to run our analysis on repositories that are known to use AI code generation tools, and compared them to repositories that are known to be human-written, we could start to analyse the impacts that these tools are having on the quality of the software we produce.
