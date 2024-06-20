---
title: Investigating Code Quality from PR Data
date: 2024-06-20 00:00:00 Z
categories:
- Artifical Intelligencce
tags:
summary: Many of us are now using Generative AI to produce code, but what impact is this having on code quality? By analaysing the data contained in PRs, our team has built a tool to investigate this.
author: alaws
---

Generative AI is everywhere, and software development is no exception. Tools such as [GitHub Copilot](https://github.com/features/copilot?ef_id=_k_Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB_k_&OCID=AIDcmm4lwmjeex_SEM__k_Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB_k_&gad_source=1&gclid=Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB) and [OpenAI's ChatGPT](https://openai.com/chatgpt/) help developers to rapidly write significant volumes of code, supposedly increasing developer productivity, but this refers purely to the speed at which code is written. The quality of the code is arguably more important, but much more difficult to quantify.

The role of a software developer is multi-faceted, and writing code is just one part of the job. Therefore, if GenAI coding tools allow us to write code more quickly, but that code ultimately takes longer to review or is harder to maintain, is it really making us more productive?


### So, what gives us an indication of code quality?

When a developer wants to make changes to a code base, they raise a pull request (PR) which contains the proposed changes to the code and a written summary of the changes made. Other developers will then review this PR, leaving comments or suggestions, before ultimately deciding whether to approve the changes.

PRs contain a huge amount of valuable data that can start to give us an idea of the code's quality. If the [CI/CD pipeline](https://about.gitlab.com/topics/ci-cd/) repeatedly fails, the code may not have been thoroughly tested or properly formatted. If a PR receives lots of review comments, it's likely that there are a number of changes that need to be made. Equally, if it takes weeks for a PR to be approved, it may be a reflection of the amount of work required to get the code to a point that the other developers are happy with it (either that, or the developers are just slow to submit their reviews...)

### Enter LLMs

There are some common "pain points" with AI-generated code. Things like not adhering to project conventions, not using functions that exist in other parts of the code base, producing algorithms with sub-optimal performance, or code that is hard to read, is often a clue that code may have been AI-generated, and are likely to be picked up in a review. 

Therefore, what's written in comments is also a valuable source of information. For example, what do reviewers frequently suggest needs to be changed? Is a developer frustrated to make this suggestion (perhaps they've made the same suggestion several times already)? Are developers generally polite to their colleagues, but harsher on code that they suspect is AI-generated?

These are all questions we can begin to answer with the help of LLMs (Large Language Models), which are able to interpret and generate human language. Therefore, we can pass review comments, or even pieces of code, to an LLM and use them to start to answer these questions.

Interestingly, this also gives us an insight into the dynamics within development teams, but more on that later. 

### Pulling this together into a tool

We provide our analyser with a GitHub or GitLab URL, and it then scrapes the PRs that have been raised within that repository. We then take the data and process it, to produce a range of different metrics, which are we have grouped into deterministic or AI. Our deterministic metrics use data such as the number of files changed, number of comments, requests for change, PR duration and PR contributors. The AI metrics use LLMs to analyse things like comment tone and subject, and detect disagreements within comment threads.

These metrics are then saved to a Parquet file, which can be exported to a [ClickHouse](https://clickhouse.com/clickhouse) database and imported into [Apache Superset](https://superset.apache.org/) to create a dashboard which allows us to visualise and explore the data captured.

### Let's see this in action
To demonstrate our tool, we have used it to analyse 1000 PRs the main repositories for a number of different programming languages, namely [Python](https://github.com/python/cpython), [Rust](https://github.com/rust-lang/rust), [JDK](https://github.com/openjdk/jdk), NodeJS(https://github.com/nodejs/node) and [.NET](https://github.com/microsoft/dotnet). We've then produced some charts displaying a range of the metrics we produce, with the aim of gaining an insight into the development of these languages.

![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-date-dotnet.jpg
 "Number of PRs opened per Month .NET")
 ![jpg]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-date-combined.jpg
 "Number of PRs opened per week")

Firstly, a note on PR creation dates. Our tool gathers the 1000 most recent PRs from each repository. For CPython and Rust, these were all created between May and June 2024. In the case of NodeJS and Rust, the earliest PRs come from January and March 2024 respectively. In contrast, .NET, there are PRs from October 2014. Remarkably, there were 257 PRs opened in the CPython in the week commencing 20th May 2024.

##### PR Duration and Review Time
![png]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-pr-duration.jpg
 "PR Duration")

`PR Duration` is a measure of the time elapsed between a PR opened, and it ultimately being either merged or closed. However, it may be the case that a PR sits in review for a period of time, before the reviewer first looks at it. Similarly, once it is approved, there may be a time delay before it is merged. For this reason, we added the additional measures of `Time to First Review` and `Time From First Review to Last Commit`. This is perfectly illustrated by .NET, which has a noticeably high PR duration. However, if you raise a PR, you'd spend the majority of this time waiting for the first review, but would be likely to quickly merge/close your PR after the initial review.

##### Contributors
![png]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-contributions-per-user.jpg
 "Number of Contributors Per User")

Here, we define a contribution as having made a commit on a PR. The number of commits in that PR aren't considered. All languages seem to accept PRs from new contributors, but .NET and Rust seem to have some very seasoned contributors, with one person having worked on 161 and 157 PRs out of the last 1000.

##### Comment Subject, Tone and Disagreements

![png]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-LLM-pain-points.jpg
 "LLM Pain Points")
Here, we asked an LLM to count the number of times reviewers picked up on issues that are characteristics of AI-generated code. It's worth mentioning that all the pain points we identified were picked up to some degree in each of these repositories. Not adhering to project standards is the most frequently identified issue across all of the repositories.

![png]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-comment-tone.jpg
 "Tone Analysis of Review Comments")
Here an LLM was asked to take a comment and interpret which of the following tones described the comment: polite, neutral, satisfied, frustrated, excited, impolite, sad. Encouragingly, we see that the reviewers for these repositories are polite in the majority of their comments and are never sad. However, they are frustrated more often than they are excited, especially in the JDK repository.
 
![png]({{ site.github.url }}/alaws/assets/code-quality/code-quality-analysis-number-of-disagreements.jpg
 "Number of Disagreements in PR Comments")
To calculate the number of disagreements, comment threads are passed into an LLM, which is then asked to count disagreements within that thread. The total number of disagreements across all comment threads on a PR is then calculated. The JDK repository is home to some keenly debated changes, as there are 3 PRs with over 40 disagreements in their comments. Notably, these PRs also have some of the highest numbers of comments, reaching up to 184 on one PR.

### Conclusion
The data extracted from pull requests can provide some interesting insights into the quality of the code, but also provides some interesting opportunities. If we were to run our analysis on repositories that are known to use AI code generation tools, and compared them to repositories that are known to be human-written, we can start to analyse the impacts that these tools are having on the quality of the software we produce.