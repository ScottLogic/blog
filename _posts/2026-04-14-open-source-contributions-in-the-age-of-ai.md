---
title: 'From AI Slop to AI Empowerment: Raising the Bar for Open-Source Contribution'
date: 2026-04-14 00:00:00 Z
categories:
- Artificial Intelligence
- Open Source
tags:
- Artificial Intelligence
- AI
summary: While AI changes the way in which we write software, how do we ensure that
  our open-source contributions remain valuable and are welcomed by maintainers? This
  blog post explores this topic in the context of the Depository Trust & Clearing
  Corporation (DTCC) Hackathon and our contributions to the Fluxnova project.
author: tstavert
---

If you've worked collaboratively on software before, you've probably experienced it. You check out a pull request with the intention of leaving a review, ready to dive in and understand your colleague's solution, leave a few helpful comments, and maybe bless the code with your seal of approval.

Suddenly, however, you're hit with thousands of lines of changed code, fifty files added, and (if you're lucky) a brand-new README file created minutes before the code was put up for review with some vague instructions on how to get it set up. You've now got the thankless task of making sense of this gargantuan submission, disentangling a complex web of classes, configuration files, and cryptic comments.

The one saving grace that you could count on until a few years ago was that a human had written this, and therefore at some point they had (presumably) put some thought into its design, and if all else failed, they could understand the reasons for the choices they had made. You might even be able to call them up and get them to walk you through a particularly confusing section, and in the process maybe you (or the author) would learn a thing or two.

Nowadays, however, seeing a large amount of code changed summons a different concern: how much of this is AI-generated? The signs are clear: a PR description littered with emojis, strange new libraries imported, overly verbose variable names, or thousands of lines of excessive unit tests that cover every possible failure state.

These things aren't always bad, and the code might work perfectly fine, but your job as a reviewer is to ensure the quality of this code, and now you've got your work cut out for you. What's worse is that you know that when you hit something unusual that you don't understand, or can't explain, and you ask your colleague for an explanation, you're probably going to receive something along the lines of: "Oh sorry I'm not sure, AI generated that bit... seems to work though, right?"

This challenge is felt more than ever by the open-source community, who are increasingly fighting a losing battle against "AI Slop" submissions. Many open-source projects have spoken out against this issue or even put measures in place to tackle low-effort submissions. The maintainers of Godot have [expressed despair](https://www.pcgamer.com/software/platforms/open-source-game-engine-godot-is-drowning-in-ai-slop-code-contributions-i-dont-know-how-long-we-can-keep-it-up/) at the quantity of low-quality code contributions, stating that many contributors don't even understand their own changes. The maintainers of cURL have [abandoned bug bounties](https://thenewstack.io/drowning-in-ai-slop-reports-curl-ends-bug-bounties/) due to this same issue, while the [maintainers of tldraw have been forced to review their contributions policy](https://tldraw.dev/blog/stay-away-from-my-trash).

In contrast, some open-source maintainers have expressed more [positivity towards developers utilising AI](https://x.com/mitchellh/status/2006114026191769924). Giving back to an open-source project, while fulfilling, can be a time-consuming process, from the initial steps of becoming familiar with an established codebase and rules surrounding contribution, to developing a solution that is worthy of being merged. If AI is used effectively, it can reduce friction in this process, and when properly utilised, this could lead to an increase in the number of high-quality open-source contributions being submitted. What is it then that differentiates "AI slop" from a valuable and appreciated open-source contribution?

## Fluxnova and the DTCC Hackathon

I was struck by the importance of responsible AI usage for open-source contributions shortly after joining Scott Logic's team for the [Depository Trust & Clearing Corporation (DTCC) Industry-Powered AI Hackathon](https://communications.dtcc.com/dtcc-hackathon-registration-18146.html).

Over the course of just three days our team had to develop an AI-driven solution to a real problem facing the finance industry. Our team was committed to a solution which involved [Fluxnova](https://fluxnova.finos.org/), an open-source workflow automation and orchestration platform that allows business processes to be modelled, executed, and monitored in a transparent and auditable way. The problem we aimed to tackle was the difficulty involved for non-technical people in retrieving workflow information from the system, forcing businesses to invest in training dedicated teams to resolve issues.

Our idea was to use generative AI (and in particular, [model context protocol](https://modelcontextprotocol.io/) tools) to expose this workflow information to a chatbot-style AI, allowing it to return easily understandable updates about ongoing workflows in response to natural language queries.

Now the question was: how do we turn this idea into a real, functional piece of software in the short amount of time we had available? The first challenge we faced was a lack of familiarity with the Fluxnova codebase, which would be essential to understand how to extract the workflow information that we needed for our chatbot. This problem is all too common when getting to grips with a new codebase, and a critical barrier in the path of would-be open-source contributors.

While reading documentation and exploring the engine code manually were useful activities for gaining this familiarity, AI tools were invaluable in rapidly getting up to speed with both the domain and the codebase. The ability to interactively query the AI as my learning developed and ask targeted questions greatly accelerated my learning, and I was able to get up to speed relatively quickly, a task that might have taken days to achieve otherwise.

Once a better understanding of the codebase was achieved, the next challenge was working out how to implement our planned solution. At this stage, it can be tempting to have an AI agent decide how to do this, and the idea of delivering this "one-shot" prompt is appealing from a standpoint of productivity. However, in my experience trying to do too much at once can lead to unpredictable and unreliable results, particularly when working with such a large codebase.

It is frequently observed that AI coding tools work best on relatively small units of code and that they [struggle with large, pre-existing codebases](https://thefridaydeploy.substack.com/p/ai-cant-handle-your-legacy-codebase), likely due to the inability of AI agents to effectively deal with such large amounts of context. Some developers have demonstrated effective techniques for [modernising codebases](https://www.youtube.com/watch?v=uC44zFz7JSM) to allow AI agents to interact more easily with them, but a complete AI-driven overhaul of an open-source project is overkill for a hackathon, as well as most open-source contributions.

Instead, a more robust approach was taken which is similar to the way in which you would tackle the problem without an AI coding agent: breaking the task down. By splitting the larger task into smaller, more manageable subtasks, each with clear direction, it is much easier to effectively steer the AI agent rather than simply hoping that it understands your intentions at each stage. This requires a clearer picture of how the implementation should look from the outset, which takes time to develop. However, this would be required for a more "manual" approach regardless, and the use of AI obviously speeds up actually writing the code significantly.

With this direction I was able to build a working prototype within a matter of hours, a task which would have taken much longer otherwise. If this code had needed to be written manually, dedicating so much time to one solution would have been incredibly risky, with disastrous consequences for the hackathon if it didn't work out. However, because I was able to produce the prototype so rapidly, we were able to test and verify that it was fit for purpose and spend the rest of the available time testing and refining our solution further.

## Hackathon to Open Source Contribution

After the Hackathon concluded, we realised that the solution which we had developed might be relevant to the maintainers of the Fluxnova project, and so we worked to refactor it into a more production-ready state. While our solution was fit for a Hackathon submission, we knew we should expect to be held to a higher standard as open-source contributors. We now shifted our focus from hacking together a working solution to understanding how our offering could be best integrated into the Fluxnova ecosystem.

Part of this process simply involved starting a dialogue with maintainers of the Fluxnova project to understand how they saw our work fitting into the platform, whether it should be part of Fluxnova's core offering or available as a plugin. This communication with stakeholders is something that AI simply cannot do for you (at least for now!).

No matter how high quality the code, it won't be accepted if the contribution is simply not a good fit for the project, so taking the time to get to grips with the expectations of those who will be reviewing your code is a critical step that shouldn't be missed. In our case, we gathered that our contribution would be most appropriate as a plugin, and we got involved in establishing a new [plugins repository for Fluxnova](https://github.com/finos/fluxnova-plugins).

Another critical consideration was the quality of the code itself. Having taken more time to understand Fluxnova's architecture, it was clear that there were a multitude of potential approaches that could be taken, each with their own pros and cons. AI was an effective tool in rapid prototyping of these different approaches to assess their effectiveness, allowing us to make more informed decisions as we narrowed down on our final solution.

One problem that was common to all of these solutions was the relatively large quantity of code that was produced by AI. Most AI agents appear to produce code in an unnecessarily verbose style, leading to a huge number of added lines which become cumbersome to review. While there may be nothing wrong with the code itself, this problem is even more pertinent to open-source contributions as we are also relying on our code being reviewed by maintainers who may be put off by the prospect of sifting through an unnecessarily lengthy pull request.

The challenge, then, is to trim down the code to a more reasonable size. In my experience, AI agents are particularly effective at this kind of refactoring work, spotting where logic can be condensed into helper methods and more succinct syntax. When embarking on a refactor like this, unit tests serve a critical purpose to allow AI agents to ensure that their changes won't break the functionality. In fact, unit tests themselves are a key area in which the quantity of code produced can be significantly reduced.

When relying on AI agents to produce code, it's more important than ever to carefully review tests and ensure that they are as comprehensive as possible. AI-produced unit tests are frequently complete overkill, sometimes thousands of lines long and impractical to review manually. My first task, therefore, was to trim down the unit tests into a more reasonable set of tests that I was confident I could effectively review. With these tests in place, I was able to allow AI to refactor and condense the code it had originally produced, without fear of creating any breaking changes.

Aside from reducing the quantity of code, another way of making your code easier to read and understand, and therefore to review, is high-quality documentation. A decent architectural description of a codebase inserted into a README file works like a map, guiding you around an unfamiliar codebase considerably more easily than just trawling through files. However, in my experience, documentation can easily be forgotten about when you are neck-deep in a refactor or excitedly implementing a new feature.

This is an area that I think AI really excels in. An important part of any AI workflow is guiding your agent towards updating documentation as it goes. Keeping your documentation up to date not only helps any humans that come to review your code in future but also makes your code easier for AI agents to work with. Out-of-date documentation that contradicts the truth of what's happening in a codebase is a sure way to confuse an AI agent, at best wasting tokens as it tries to make sense of an objectively confusing situation, or at worst completely leading it astray.

## The Imbalance of Effort

It is unquestionable that AI coding agents are improving, both in terms of the underlying models and the tooling they have access to. It is beginning to become accepted in the industry that AI agents will be involved in some capacity in the software development process, even if the extent to which they are involved and the autonomy they are given is still in contention. Why is it, then, that so many of us are so concerned about submitting AI-generated code in open-source contributions?

There is a definite stigma surrounding AI use in many circles. Interestingly, I have felt this stigma particularly strongly not from experienced developers but rather from my colleagues who have more recently left education. For those of us who have graduated from university in recent years, we will remember the panic of many universities who were unprepared to handle the sudden rise of AI tools, with many universities outright [banning their use](https://www.redbrick.me/top-uk-universities-ban-chat-gpt/) for academic work. While their stances have largely softened into more refined policies and measured advice, the remnants of this reaction remain in the psyche of those who experienced this vilification of AI.

Another factor is that while these tools have been updated and improved, many people's views have not kept up with these changes. Many of those who tried implementing AI tools into their work too early were left unimpressed by their effectiveness and still hold an outdated opinion of their usefulness in producing quality code.

Ultimately though, I think the biggest concern we have when submitting AI-produced code is that it will be perceived as a low-effort submission, regardless of the amount of effort that was put into reviewing and refining it. It is true that the time taken to produce low-quality code with AI is much lower than the time it takes to review it, particularly if the AI-generated code is not reviewed properly by the contributor. If your contribution consists purely of copy-pasting the description of a GitHub issue into Copilot and letting it take care of the rest, then it's hardly surprising that open-source maintainers would resent your lack of effort and label your contribution "AI slop".

It's often difficult to gauge how much of a contribution is AI-generated until one delves into the code itself, so there's always the risk that you spend time trying to understand code that the contributor themselves didn't write and may not have even looked at. It's this imbalance of effort, I think, that has led so many open-source maintainers to despair at the impact of AI on their projects.

More transparency surrounding the extent of code that is AI-generated seems a logical way forward, but it needs to break through the stigma which has been built up surrounding AI use. Being transparent about AI use needs to be done delicately, or it risks alienating AI-skeptic maintainers who don't want AI agents anywhere near their codebase. Those of us who believe that AI is a valuable tool for producing high-quality code therefore need to be champions of its responsible usage when it comes to open-source.

While it seems obvious, making sure AI-generated code is thoroughly reviewed before you submit it is critical if you want to build up trust in AI-powered solutions for your favourite open-source projects. All it takes is a few low-quality submissions with AI-generated code to torpedo not only your own reputation as a contributor, but also the maintainer's reception of AI-generated code in general.

A good rule of thumb is to spend at least as much time reviewing AI-generated code as you would expect a reviewer to spend on it (and probably a fair bit more). Don't leave it up to others to do that step for you and make sure you're ready to answer questions about the code when the time comes. We won't always get this perfect as we adapt to this new workflow. So, when we do let some code slip through that we don't fully understand, it's important to take ownership of that mistake and not try to deny or defend these mistakes to the detriment of code quality and the quality of our submission.

We must take as much pride in our code now as we did before AI, while giving proper consideration to the reviewers who give up their time. If we do both, we shouldn’t be afraid to embrace AI's power to improve open-source projects.
