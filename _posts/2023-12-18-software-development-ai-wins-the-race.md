---
title: If software development were a race, AI wins every time
date: 2023-12-18 00:00:00 Z
categories:
- Artificial Intelligence
tags:
- featured
summary: We’ve undertaken experiments to explore the impact of GenAI tools on developer productivity, revealing a 37% improvement in productivity (speed), however, this result is a misrepresentation of what it means to be productive as a developer. This article delves more deeply, beyond punchy metrics, to explore the overall experience of working with these entirely new tools. We discuss where these tools are most effective, the challenge of quality code, the learning curve and much more.
author: ceberhardt
contributors:
- pgraham
- lperrett
- yblowers
image: "/ceberhardt/assets/genai-productivity/ai-race-thumbnail.png"
Key:
---

**An exploration of the quantitative and qualitative impacts of Generative AI on software development.**

We’ve undertaken multiple experiments to better understand the impact of GenerativeAI tools (ChatGPT, Copilot) on developer productivity. Our quantitative results show a 37% improvement in productivity (speed), however, this result is a misrepresentation of what it means to be productive as a developer.

This article delves more deeply, beyond punchy metrics, to explore the overall experience of working with these entirely new tools. We discuss where these tools are most effective, the challenge of quality code, the learning curve and much more.

- [Summary](#summary)
- [Introduction](#introduction)
- [Productivity Studies](#productivity-studies)
- [A side-note on what software developers actually do!](#a-side-note-on-what-software-developers-actually-do)
- [The coding exercise](#the-coding-exercise)
- [A false start](#a-false-start)
- [Ready, steady, go … if coding were a race](#ready-steady-go--if-coding-were-a-race)
- [Experiences of working with GenAI tools](#experiences-of-working-with-genai-tools)
  - [Developers are overwhelmingly positive on productivity gains](#developers-are-overwhelmingly-positive-on-productivity-gains)
  - [GenAI tools help in unfamiliar environments](#genai-tools-help-in-unfamiliar-environments)
  - [GenAI tools, especially ChatGPT, are a great support for learning](#genai-tools-especially-chatgpt-are-a-great-support-for-learning)
  - [The tools can be too fast](#the-tools-can-be-too-fast)
  - [Making the most of these tools is a learning curve](#making-the-most-of-these-tools-is-a-learning-curve)
  - [Creating quality code is a challenge](#creating-quality-code-is-a-challenge)
  - [Security, privacy and trust are an issue](#security-privacy-and-trust-are-an-issue)
  - [These tools may do more than you think](#these-tools-may-do-more-than-you-think)
- [Conclusions](#conclusions)


## Summary

It is broadly accepted that the latest advances in AI, and more specifically Generative AI (GenAI), will have an impact on many tasks undertaken by “knowledge workers”. This has led some to consider entire [roles to be at risk from being replaced by AI](https://www.forbes.com/sites/jackkelly/2023/03/31/goldman-sachs-predicts-300-million-jobs-will-be-lost-or-degraded-by-artificial-intelligence/). Given that Large Language Models (LLMs, a specific implementation of GenAI) are seemingly just as adept at writing code as they are writing prose, it is likely this will have a significant impact on software development, potentially automating tasks which are currently manual, and potentially displacing humans.

We undertook our own research, running multiple controlled experiments with a team of ~100 developers and testers, to determine the impact these tools (ChatGPT, Copilot) have on development. Our finding was that GenerativeAI tools make developers measurably faster. With experiments designed to measure the speed of task completion, those using (and experienced with) Generative AI tooling completed the tasks 37% faster than those without.

However, software development isn’t a race.

![AI race]({{ site.github.url }}/ceberhardt/assets/genai-productivity/ai-race.jpeg)

<small>“a group of runners sprinting across the finish line, they are simultaneously software developing, holding laptops and programming, photorealistic” - generated using DALL-E </small>

Measuring the speed at which a developer completes a programming task is very one-dimensional. In practice, the quality of code produced (however you seek to define it) is just as important, if not more so, than the speed at which it was written. Unfortunately there is no widely-acknowledged  industry-standard metric for measuring software quality; instead, we measure indirectly across a vast number of factors (unit tests coverage, manual code review, linting checks, defect rates, to name just a few).

Furthermore, overall developer (or team) productivity, and the speed of completing a given programming task, are not quite the same thing. More sophisticated measurement frameworks such as [SPACE](https://www.infoq.com/news/2021/03/space-developer-productivity/), evaluate the broader range of tasks developers undertake. However, trying to apply these to create a genuine benchmark is a challenge, and is still a hot topic!

Recently McKinsey claimed to have developed a new and complete framework for measuring and optimising productivity ([Yes, you can measure software developer productivity](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/yes-you-can-measure-software-developer-productivity)), but this was [widely derided](https://leaddev.com/process/what-mckinsey-got-wrong-about-developer-productivity) by the community and prominent figures in software engineering.

The result presented here, that GenAI tools make you 37% faster, is true, within a contrived example. Our hope is that this grabs your attention, but it is not a result that should be parroted without context! Instead, we found much more value in engaging with the study participants. These tools are radically different to others in the ‘developers toolbox’, and we are only just starting to discover their capabilities. Through surveys and interviews we discovered where these GenAI tools are most effective and what challenges still remain.

It feels like we are catching a glimpse of the future of software development. With the rapid pace of tool development, and the somewhat slower pace of human adoption, learning and understanding, the next few years are going to see some radical changes across the industry.

## Introduction

The software development industry is huge, with an estimated [27 million developers worldwide](https://www.statista.com/statistics/627312/worldwide-developer-population/), creating [an industry worth around $700bn](https://www.statista.com/outlook/tmo/software/worldwide). These developers are supported by an ever-growing suite of tools that help them streamline their work in an increasingly complicated environment.

For the most-part these tools have focussed on ancillary tasks, for example streamlining source-control, unit testing and CI/CD integration. This automation allows developers to focus on their primary value-creation task of writing code. And in this task, beyond simplistic auto-completion (which types-ahead by a few characters), the developer has very much been on their own. However, this is starting to change.

GitHub Copilot was released in October 2021. Based on a modified version of GPT3, it is able to generate significant volumes of code, multiple lines and entire functions, by predicting what the developer themselves would likely write.  

In November 2022 Open AI released ChatGPT, based on GPT 3.5; this model had been trained on question and answer tasks allowing for a conversational interaction. Furthermore, ChatGPT understands both text and code, mixing them in both its inputs and outputs. Where Copilot predicts the next few lines you might write, with ChatGPT you enter into a dialogue about the code you would like it to write, and it completes this task in its entirety.

There has been an explosion of research and products launched, with almost every large technology organisation getting into this business (Meta, Google, AWS, et al).

## Productivity Studies

Most of these tools sell themselves based on their flashy demos, and they are all incredibly impressive. However, further research is needed to properly quantify the value.

A [recent study by GitHub](https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) (Sept 2022) tasked developers with writing a simple web server in JavaScript. The results were impressive, with Copilot users finishing the task 55% faster than the developers who didn’t use Copilot. They also explored developer sentiment, with 88% of Copilot users reporting that they felt more productive. The full study details are [available in a paper published Feb 2023](https://arxiv.org/pdf/2302.06590.pdf).

Similar studies have been conducted for other knowledge-worker tasks. Published in July 2023, a [study conducted on 453 college-educated professionals](https://www.science.org/doi/10.1126/science.adh2586) demonstrated a 40% increase in productivity and 18% increase in quality when using ChatGPT to conduct various writing tasks.

Recently a [study conducted by Boston Consulting group and Harvard University](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321) looked at employing GenAI tools across a range of management consultant tasks. They found that those using AI tools completed tasks 25% more quickly and with a 40% greater quality. However, some tasks are less appropriate for AI automation. Furthermore, there is a significant human element at play here, with notable differences in the way people incorporate AI into their working life - with mixed results.

## A side-note on what software developers actually do!

We believe there is considerable value in quantifying the productivity benefits of these tools (Copilot, ChatGPT and others), but this needs to be considered within the context of the typical software developer’s ‘day job’. While much of their day is concerned with writing code, a significant amount of time is spent on all manner of other tasks - including planning, project ceremonies, mentoring peers, engaging with product owners, triaging bugs and many more besides. None of these GenAI tools address these tasks (yet!).

Furthermore, when a developer is actually ‘developing’, they are not sitting at the keyboard churning out code at pace. Their job often involves designing, researching, conversations with colleagues, problem solving and of course googling. GenAI slots somewhere within this workflow, rather than replacing all of it. As a brief example, a developer might not need to google search a specific algorithm if they use a GenAI tool that can immediately write the code for them.

When coupling the two together (all the non-development tasks, and the development tasks that don’t involve writing code), the amount of code generated by a typical developer is relatively small. Fred Brooks seminal book, [The Mythical Man Month](https://en.wikipedia.org/wiki/The_Mythical_Man-Month), has the following to say:

> no matter the programming language chosen, a professional developer will write on average 10 lines of code (LoC) day

For a GenAI tool to be effective, it has to tackle some of the tasks that get in the way of skilled programmers who would dearly love to write more than just 10 lines of code each day!

## The coding exercise

Our goal was to create a contrived yet representative task, that our participants could conceivably complete within half a day. Previous studies have often focussed on ‘green field’ development, asking developers to complete a challenge in isolation (i.e. from scratch). However, the vast majority of real-world development work involves incremental enhancements of an existing codebase. For this reason, the exercise we developed requires participants to change and enhance an existing codebase, rather than create something entirely new.

The exercise we designed was to enhance a simple HTTP web server in a programming language of their choice. Skeleton implementations in C#, Java and JavaScript were provided as a starting point, though the participants could also start from scratch or use another programming language. The requirements for the web server were provided in a README with more detailed supporting documentation available. The development branch of the project repository included two test suites that tested the HTTP API of the web server. The first suite was a Postman collection and the second was a test suite written in JavaScript using the Cypress framework. The development participants were instructed to test their implementations against the two test suites to ensure they were complete.

Participants in the treatment group were asked to use a Generative AI technology of their choice, with the expectation that the majority of participants would use ChatGPT, Github Copilot or both. Participants in the control group were not permitted to use Generative AI technology, but were otherwise unconstrained (i.e. they were free to use any sources of information as they normally would).

We gathered data on a number of metrics to measure the performance for each group and also to obtain data on the developer experience.

## A false start

Our first iteration of the experiment didn’t quite yield the result we were expecting, with GenAI tools providing only a marginal improvement in completion time across certain subsets of the participant. However, the qualitative assessment, based on surveys and workshops, uncovered all sorts of valuable insights which we’ll explore later. But our original aim was to quantify the impact of GenAI tooling and it felt like we had failed!

One of the questions we asked participants was whether they felt GenAI had made them more productive. Looking at the results we can see that the feedback was overwhelmingly positive, with 92% of ChatGPT users reporting a perceived improvement, and 68% of Copilot users reflecting the same.

![GenAI has improved productivity]({{ site.github.url }}/ceberhardt/assets/genai-productivity/gen-ai-improved-productivity.png)

Considering this overwhelmingly positive sentiment (echoing the results found by GitHub) this presented something of a contradiction, participants felt more productive using these tools, but we saw only very marginal improvement in task completion time.

It is at this point we realised that there was a very important variable that we failed to control within this experiment - that of quality. The task provided functional requirements, which coupled with unit tests, provided an entirely unambiguous description of what the code should do. However, there was no indication of how much time or effort should be spent on making this ‘quality code’ by refactoring, adding comments, carefully crafting for readability and future extensibility. 

Notably we found that the more junior developers tended to complete the task more quickly than the more senior folk:

| Seniority      | Average Completion Time (hh:mm) |
| ----------- | ----------- |
| Associate (n=11) | 2:01:00 |
| Developer (n=14) | 2:56:00 |
| Senior (n=16) | 2:20:00 |
| Lead (n=12) | 3:18:00 |

Whilst this may seem counter-intuitive, perhaps more experienced developers instinctively spend more time critiquing the code they write? 

It is almost impossible to describe the quality of code, or a target level of quality for code which a developer must write to meet some functional requirement. With that in mind we modified the experiment to remove quality from the equation altogether. The experiment was repeated with one simple modification, participants were asked to complete the task as quickly as possible.

## Ready, steady, go … if coding were a race

We aimed to introduce more control to the second iteration of the experiment, although the task and the tests remained the same. The second round of participants were given the aim of achieving a clean run of passing tests as quickly as possible and specifically instructed not to be concerned with code quality. By adding these controls we hoped to create something of a coding race between treatment and control participants.

Splitting the results into three groups, we found the following average completion time:


| Group      | Time |
| ----------- | ----------- |
| Control - no access to ChatGPT | 97 mins (n=7) |
| ChatGPT users with no prior experience | 96 mins (n=11) |
| ChatGPT users with prior experience | 61 mins (n=14) |

Developers who had no prior experience of ChatGPT were no more productive than the control group. This isn’t a great surprise, ChatGPT is a new and somewhat alien tool that requires learning time. However, those who have already used ChatGPT completed the task on average 37% faster than those without the tool. This sits within the range found by other studies.

**NOTE:** We haven’t yet collected enough results to be able to be able to deem the results statistically significant. A t-test (one-tail, two-sample unequal variance) yields a p-value of 0.09, whereas < 0.05 is required to demonstrate significance. However, our study was more focused on qualitative feedback, understanding people's experiences, rather than repeating the studies undertaken by others.

## Experiences of working with GenAI tools

Alongside the coding task itself “the race”, we also asked the ~100 developers involved in this study to share their experiences, both positive and negative.

In the next few sections we reflect on some of the common themes expressed by multiple participants.

### Developers are overwhelmingly positive on productivity gains

![GenAI has improved productivity]({{ site.github.url }}/ceberhardt/assets/genai-productivity/gen-ai-improved-productivity.png)

Whether using ChatGPT or Copilot, the participants were overwhelmingly positive about their experience with GenAI tools and the impact it had on their productivity.

Of those using ChatGPT, 92% felt it made them more productive, whereas with Copilot, 68% felt more productive. While both tools are based on GenAI, the way they work, and integrate into the developer workflow, is quite different. Copilot is a code suggestion engine, whereas most use ChatGPT to try and tackle whole problems (although it is highly versatile and can do both). When used successfully ChatGPT can emit large quantities of code, which is likely why our study showed a more prominent (perceived) productivity gain here.

Regarding where and how this productivity gain is realised, common themes emerged around removing the need to create boilerplate, or repetitive code, they also reduce the reliance on other sources of material including Google, StackOverflow and Library / Framework documentation.


> ”Using GitHub Copilot quickly became mentally seamless: it brought me much closer to coding at the speed of thought, especially when carrying out common, simple or repetitive coding tasks.” - Joe Carstairs

> ”It gets the boilerplate code written quickly and you don't have to think about it. I was also impressed that it started to infer some requirements.” - Oliver Foreman

### GenAI tools help in unfamiliar environments

Probably the most notable area that these tools help with is unfamiliar environments, for example working in a language you’re not that familiar with, or a framework you’ve not seen before.

Copilot and ChatGPT are leveraged quite differently in this context.

With Copilot our team found that they could easily steer and prompt the tool, using understanding from similar experiences (e.g. other languages) to rapidly complete the task.

> ”I had no experience with my chosen implementation method (Python Flask). GitHub Copilot generated appropriately-attributed methods with skeleton code for each endpoint that I required, probably more quickly than I could have done through reading the documentation.” - Paul Edwin

> ”Someone who knows Java but not C# will be able to give specific language-agnostic instructions to CoPilot and it should be able to translate them into code without problems.” - Fanis Vlachos

> ”It is exceptionally valuable when you lack language experience, as it significantly reduces the time spent on coding.” - Xin Chen

ChatGPT is equally useful in unfamiliar environments, but the approach is a little different. The conversational nature of this tool means that it provides much more detail, explaining the code that it presents to you. It doesn’t just help you get the job done, it teaches you.

> ”With no knowledge of the language I used, ChatGPT helped me understand creating a skeleton for me and also explaining what I am doing.” - Archana Pandit. 

### GenAI tools, especially ChatGPT, are a great support for learning

The power of ChatGPT as a tool to assist learning was echoed by many of the people who participated in the study. 

> ”You can copy and paste a chunk of code into ChatGPT and ask it what's wrong with it, or what can be improved - it explains what code means really well and I think that's really good for learning” - Katie Davis

This also shows the versatility of ChatGPT, it can create code, debug code, explain code, refactor code and much more. Whereas Copilot simply emits code.

This difference should come with a word of warning, because Copilot doesn’t explain itself, it is perhaps not the best tool for learning a new language. Regardless of which GenAI tool you are using, you have to be able to critique the code that they create. 

> ”With little or no experience in a language it is not possible to evaluate the code suggested by GitHub Copilot, “using GitHub Copilot isn't going to substitute for learning the language from conventional textbooks and tutorials. In fact, I'm not convinced using GitHub Copilot is a good way to learn the language at all. The next time I'm trying to learn a new programming language, I suspect I'll turn GitHub Copilot off.” - Joe Carstairs.

### The tools can be too fast

One unexpected piece of feedback we received was about these tools being too fast, especially Copilot. It churns out suggestions which can be a few lines of code, or much more, almost every second. This applies an additional cognitive load on the developer and can disrupt their chain of thought.

> ”Some blocks of apparently useful code were generated without my having to type. Because the project was small, it was possible to check this quickly. A larger project or library would be less easy to work with, and I'd be scared to run without tests.” - Phoebe Smith

Given that Copilot is marketed as a ‘programming pair’, it is something of an over-active and chatty co-worker at times!

Regardless of how fast or how accurate the suggestions are, almost everyone acknowledged the important point that while the GenAI tool suggested the code, it’s ultimately your code once you accept it. Your name on the commit, your name when someone runs git blame.

> ”I find every information taken from ChatGPT must be validated unless I am only using it to remind me something I already know.” - Fanis Vlachos

### Making the most of these tools is a learning curve

These tools are all very new, and feel quite different to the tools we’ve had previously. Making the most of them requires time, we need to find their strengths and weaknesses, and adapt our workflow to accommodate them.

With ChatGPT this is often about understanding how much of the problem to tackle at any one point in time. Should you use it to help you write just a few lines of code? Or describe your entire application?

Whereas with Copilot it is an experience that feels much more like prompt engineering, finding a concise way to describe your problem so that it suggests something suitable. This might sound simple, but there are numerous options, should you prompt Copilot via comments? Or by how you name variables and functions? Do you encourage it to write just a few lines of code? Does it work better if you decompose your code into small functions?

> “Difficult to know how to get the best out of the Copilot tool without sufficient prior experience.” - Paul Edwin

> “It takes time to get used to how to structure code comments/questions to get the best response” - Harry Bellamy.

As with most tools, if people struggle to adapt, and struggle to get a useful output, they will most likely just stop using them.

### Creating quality code is a challenge

Feelings around the quality of the code produced by the tools were mixed. While 45% were positive about the quality of the code produced, 35% were neutral and 20% were negative. Overall a less positive sentiment than that expressed about the productivity gains.

![GenAI creates quality code]({{ site.github.url }}/ceberhardt/assets/genai-productivity/genai-creates-quality-code.png)

We did see a stronger sentiment towards the quality of code produced by ChatGPT (versus Copilot), reflecting the different ways in which these two tools work. With ChatGPT it is an opti-in process, you explain what you want it to write and in response it is highly verbose, explaining the code it provides, inspiring confidence in the output. Whereas with Copilot it ‘interjects’ when it feels it is appropriate, with varying degrees of success.

When it comes to the specifics of where the output wasn’t of a sufficient quality, the feedback we received was very varied, again reflecting the fact that quality is hard to define and can be quite personal.

> ”ChatGPT did not comprehend the nature of a good project structure and some of the principles of good software engineering - creating a new class for a web service response, where a developer might extend a class type so that common fields and methods are only implemented once.” - Igor Wieczorek

> “It doesn't refactor, it happily spits out code that has duplication. It doesn't use modern language features consistently” - Colin Eberhardt

> “Overall I would say it's good at producing *a* solution, but I wouldn't necessarily trust it for *the* solution.” - Euthyme Ziogas

### Security, privacy and trust are an issue

As anticipated, developers treated these tools with caution, and in some cases a heavy dose of scepticism!

![GenAI creates secure code]({{ site.github.url }}/ceberhardt/assets/genai-productivity/genai-security.png)

Participants frequently highlighted the need to check the code that these tool produce.

> vLarge code blocks can't just be copied over from ChatGPT(or similar) they must be checked first which is time consuming” - Adam Miriam

> ”I will *never* trust generative AI to write unit tests.” - Phoebe Smith

There were also instances where the tools have large “gaps” in their knowledge

> ”The knowledge cutoff date is 2021, so ChatGPT 3.5 sometimes suggests deprecated code - Spring Security version 6 is an example. It is possible to work around this issue.” - Jay Wright. 

###  These tools may do more than you think

Reading through the hundred responses we had to our feedback survey, especially the free-text input, showed that experiences were very mixed. It is clear that people are on a learning journey, and are at different stages. Our qualitative results (37% productivity increase) point towards how those who learn to make effective use of the tools benefit.

> ”It takes some time to get used to the prompt engineering. It takes some learning time to know how to ask for help and how to word it, but once you learn it it’s a smooth sailing.” - Gagan Singh

The Boston / Harvard study cited earlier also looked at the different ways people are adding AI to their workflow. They identified two broad categories, the Centuars, who have a “clear line between person and machine”, dividing up the work into chunks, some of which they give to the AI, and Cyborgs, who “blend machine and person” creating a closer integration.

While the notion of Centuars and Cyborgs is somewhat whimsical, it does demonstrate how deeply this technology is going to touch our industry.

## Conclusions

There is no doubt that the software industry is one of many that is going to be disrupted by Generative AI. Our results show both a strong positive sentiment regarding the productivity gains related to these tools, and a quantifiable improvement also.

However, you cannot simply roll these tools out and expect to see your development teams suddenly get 37% faster. These tools don’t represent an incremental improvement to our existing toolkit, instead they are genuinely disruptive. Making best use of them involves changing our workflow to maximise the benefits, and just as importantly changing ourselves.

We intend to continue our studies, but with a change in focus. For now we’ve scratched the surface on how and where this technology will disrupt. What we’d like to focus on next is some more practical guidance for organisations wishing to adopt these tools.

These are exciting times, and we’re all on a journey of discovery.
