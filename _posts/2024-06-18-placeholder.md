---
title: Analysing the Impact of AI Coding Tools on Code Quality
date: 2024-06-18 00:00:00 Z
categories:
- Artifical Intelligencce
tags:
summary: 
author: alaws
---
### Introduction
Generative AI is everywhere, and software development is no exception. Tools such as [GitHub Copilot](https://github.com/features/copilot?ef_id=_k_Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB_k_&OCID=AIDcmm4lwmjeex_SEM__k_Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB_k_&gad_source=1&gclid=Cj0KCQjwvb-zBhCmARIsAAfUI2survphNzpvvdMMG2eOv8HEvVDSkuQo8qHKN-KwDROjlvRPqA8CocwaAuTSEALw_wcB) and [OpenAI's ChatGPT](https://openai.com/chatgpt/) help developers to rapidly write significant volumes of code, supposedly increasing developer productivity, but this refers purely to the speed at which code is written. The quality of the code is arguably more important, but much more difficult to quanitify.

The role of a software developer is multi-faceted, and writing code is just one part of the job. Therefore, if GenAI coding tools allow us to write code more quickly, but that code ultimately takes longer to review or is harder to maintain, is it really making us more productive?


### So, what gives us an indication of code quality?

When a developer wants to make changes to a code base, they raise a pull request (PR) which contains the proposed changes to the code and a written summary of the changes made. Other developers will then review this PR, leaving comments or sugestions, before ultimately deciding whether to approve the changes.

PRs contain a huge amount of valuable data that can start to give us an idea of the code's quality. If the [CI/CD pipeline](https://about.gitlab.com/topics/ci-cd/) repeatedly fails, the code may not have been thoroughly tested or properly formatted. If a PR receives lots of review comments, it's likely that there are a number of changes that need to be made. Equally, if it takes weeks for a PR to beapproved, it may be a reflection of the amount of work required to get the code to a point that the other devlopers are happy with it (either that, or the developers are just slow to submit their reviews...)

### Enter LLMs

There are some common "pain points" with AI-generated code. Things like not adhering to project conventions, not using functions that exist in other parts of the code base, producing algorithms with sub-optimal performance, or code that is hard to read, is often a clue that code may have been AI-generated, and are also likely to be picked up in a review. 

Therefore, what's written in comments is also a valuable source of information. For example, what do reviewers frequently suggest needs to be changed? Is a developer frustrated to make this suggestion (perhaps they've made the same suggestion several times already)? Are developers generally polite to their colleagues, but harsher on code that they suspect is AI-generated?

These are all questions we can begin to answer with the help of LLMs (Large Language Models), which are able to interpret and generate human language. Therefore, we can pass review comments, or even pieces of code, to an LLM and use them to start to answer these questions.

Interestingly, this also gives us an insight into the dynamics within development teams, but more on that later. 

### Pulling this together into a tool

We provide our analyser with a GitHub or GitLab url, and it then scrapes the PRs that have been raised within that repository. We then take the data and process it, to produce a range of different metrics, which are we have grouped into deterministic or AI. Our determinsitic metrics use data such as the number of files changed, number of comments, requests for change, PR duration and PR contributors. The AI metrics use LLMs to analyse things like comment tone and subject, and detect disagreements within comment threads.

These metrics are then saved to a Parquet file, which can be exported to a [ClickHouse](https://clickhouse.com/clickhouse) database and imported into [Apache Superset](https://superset.apache.org/) to create a dashboard which allows us to visualise and explore the data captured.

### Let's see this in action
To demonstrate our tool, we have used it to analyse 1000 PRs the main repositories for a number of different programming languages, namely [Python](https://github.com/python/cpython), [Rust](https://github.com/rust-lang/rust), [JDK](https://github.com/openjdk/jdk) and [.NET](https://github.com/microsoft/dotnet).

##### PR Duration and Review Time
![jpg]({{ site.github.url }}/alaws/assets/AI-quality-analysis/AI-quality-analysis-pr-duration.jpg
 "PR Duration")

PR duration is a measure of the time elapsed between a PR opened, and it ultimately being either merged or closed.

##### Contributors
![jpg]({{ site.github.url }}/alaws/assets/AI-quality-analysis/AI-quality-analysis-contributions-per-user.jpg
 "Number of Contributors Per User")

Here, we define a contribution as having made a commit on a PR. The number of commits in that PR aren't considered.

##### Comment Tone and Disagreements
![jpg]({{ site.github.url }}/alaws/assets/AI-quality-analysis/AI-quality-analysis-comment-tone.jpg
 "Tone Analysis of Review Comments")
 
![jpg]({{ site.github.url }}/alaws/assets/AI-quality-analysis/AI-quality-analysis-number-of-disagreements.jpg
 "Number of Disagreements in PR Comments")

##### Identifying LLM "Pain Points"
![jpg]({{ site.github.url }}/alaws/assets/AI-quality-analysis/AI-quality-analysis-LLM-pain-points.jpg
 "LLM Pain Points")
