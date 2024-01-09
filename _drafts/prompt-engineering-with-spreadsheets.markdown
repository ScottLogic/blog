---
title: Prompt engineering with spreadsheets
date: 2024-01-08 08:00:00 Z
categories:
- Artificial Intelligence
summary: When we couldn't find a tool to meet our prompt engineering needs, we decided
  to create a universal tool that allows anyone to build their own - all within the
  familiar spreadsheet environment. An Excel add-in that lets you use OpenAI models
  in Excel formulas.
author: rwilliams
contributors:
- cprice
---

When we couldn't find a tool to meet our prompt engineering needs, we decided to create a universal tool that allows anyone to build their own - all within the familiar spreadsheet environment. An Excel add-in that lets you use OpenAI models in Excel formulas.

[1LJMJQ3mLu1x0LxTiRcyZB6b70esTGGvVq4TUSLcj_cacheKey=kix.aafiqo2jl3ge_1LJMJQ3mLu1x0LxTiRcyZB6b70esTGGvVq4TUSLcj](/uploads/1LJMJQ3mLu1x0LxTiRcyZB6b70esTGGvVq4TUSLcj_cacheKey=kix.aafiqo2jl3ge_1LJMJQ3mLu1x0LxTiRcyZB6b70esTGGvVq4TUSLcj)

## Prompt engineering

Prompt engineering is a hot topic at the moment but there’s surprisingly little in the way of established tooling to support it, or working practices for developing and proving prompts. This could be due to its relative immaturity as a field, its questionable longevity, or the sheer frustration often experienced by anyone who’s dabbled with it! However, there’s no doubt that as things stand, when using GenAI it’s hard to avoid.

While advancements in model technology are likely to diminish the importance of crafting the perfect phrasing of prompts, the work of developing and proving prompts will remain - but focusing more on [problem formulation](https://hbr.org/2023/06/ai-prompt-engineering-isnt-the-future). We expect sufficiently capable and flexible tools to have continued utility with this change of focus.

## Tooling spectrum

The tooling available for prompt engineering is emergent and rapidly evolving. Thankfully, we can simplify the landscape into a spectrum - tooling in each band of the spectrum having a mostly common set of characteristics, pros/cons, and uses.

### Playgrounds

The most basic tools for crafting prompts are the ones we all tend to start with: the web-based "playgrounds" provided by model vendors. These are great starting points for quick experiments and broadly testing the feasibility of an idea. There’s practically zero setup time, and you can quickly iterate your prompt by manually judging the model response then adapting the prompt.

We found them however to limit our effectiveness and productivity for prompt engineering. Swapping between different input data requires laborious copy/pasting, and you’ll be doing a lot of it to check and re-check different ones as you change your prompt. You can only run and view the response for one scenario at a time. Manually judging long or complex responses is time consuming and taxing. The toil can significantly slow down what may have been rapid early progress.

### Automated evaluation frameworks

At the other end of the spectrum there exist variations on the [OpenAI Evals](https://github.com/openai/evals) framework, which automate executing a prompt (or system) with a large number of inputs and evaluating the results. Here there’s a much larger setup time but that’s balanced out by more extensive and accurate assessment of the prompt result.

Setup time consists of establishing the evals suite configuration, creating the input samples (or sourcing and converting them into the required format), and implementing/defining the assessment criteria. This setup time, and subsequent per-testrun times, means the approach doesn’t lend itself to rapid iteration or collaboration. We’ve also found that the inputs-to-outputs structure doesn’t give visibility of the results from intermediate model calls, making debugging laborious.

### Everything novel and inbetween

Being a relatively new field, there are a [plethora](https://www.promptingguide.ai/tools) of [tools](https://learnprompting.org/docs/tooling/tools) available to assist with prompt engineering, with no obvious group of leading contenders. It’s natural for an emerging field to have many different approaches and tools - it normally takes time for some to win out, and that hasn’t happened here yet. We think it’ll happen eventually, whether before or after the focus of prompt development moves (as previously mentioned) from linguistic crafting to problem formulation.

By designing a prompt iteration workflow around such tools, and/or adopting ways of working those tools encourage/prescribe, we expect prompt engineering can be more efficient and effective in common and foreseen scenarios. It remains to be seen whether the tooling space settles in a similar place to the coding-IDE space - where all products have the same key features, there’s a generally accepted UI form, and any decent product will be good enough and adaptable enough to suit almost any development project.

In future, we could see some tools widen their coverage of the spectrum - transcending the aforementioned categories to support a full prompt development journey from playing with an idea, to refining it, through to robust automated proving.

Python Jupyter Notebooks are a pre-existing tool that could be used for prompt engineering. However, they’re relatively niche outside of data science domains and can be hard to experiment with due to the lack of dependency tracking. Every time you make a change, you need to find and rerun the related cells. This can be confusing and time-consuming, especially when the processing takes a while and can have significant cost.

## Our needs from a real project

In a recent project, having used both the OpenAI Playground and Evals, we realised we needed something in the middle. The list of use cases we envisaged for this tool rapidly grew, and began to include things quite specifically tied to our project domain and ways of working. We were quite sure that a well-suited tool wouldn’t exist.

We wanted to test with a moderate amount of samples/inputs (being mindful of assessment cost/time), we wanted the flexibility to iterate quickly, we wanted to collaborate seamlessly with domain experts, and to not introduce completely novel tools/services that would require product selection and careful consideration of the project’s strict data confidentiality needs.

Before this realisation, we got by for a while using a mix of Playground, Evals, and scripts for converting/merging input and output files to/from CSV for import/export to Excel. This allowed us to use spreadsheets for human-friendly editing of inputs and inspection of outputs, and allowed us to use collaborative editing to work with domain experts, but the whole process was pretty clunky, error-prone, and had a slow cycle time. We also tried using Python Notebooks to solve some of the use cases, but found this very confusing and error-prone due to the aforementioned lack of dependency tracking.

We needed a tool made for us, but building a tool to build a tool isn’t a luxury afforded to small client projects. And surely we wouldn’t be the only GenAI project facing this dilemma.

## OpenAI functions add-in for Excel

We built [OpenAI API Functions for Excel](https://github.com/robatwilliams/openai-excel-functions), an add-in that allows you to create chat completions from your Excel formulas. Rather than build a prescriptive or highly-customisable tool, we built a tool that allows you to build your own tool - quickly.

```
=OAI.CHAT_COMPLETE("Tell me a joke", PARAMS)
```

By complementing the power of spreadsheets with this simple add-in that calls the OpenAI API, you can easily assemble a tool (a spreadsheet) that does exactly what you need. Use familiar features such as cell referencing, dependent updates, and collaborative editing to suit your use cases and ways of working.

Completion calls go directly from your Excel instance to OpenAI’s API, using your own API key. No need to sign up or pay for anything new, or be concerned by a company in the middle harvesting your data (you can check out source code!). All current and future models and input parameters are supported. Complete request and response data is available for viewing in your spreadsheet or referencing from other formulas.

We built this add-in with GenAI developers in mind. There are other products available on the same theme which are likely more suitable for using GenAI in general spreadsheets, however they fall substantially short on many/most of the aforementioned topics.

## Use for prompt engineering

Here we’ll go through using a spreadsheet and our new OpenAI functions, for a basic prompt engineering task. This video also serves as an instructional aid, but for complete instructions and documentation please see the [project readme](https://github.com/robatwilliams/openai-excel-functions#readme).

<iframe width="560" height="315" src="https://www.youtube.com/embed/g8b2jDl9QlQ?si=yNBBIBs8DNoulBEK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

That would have been rather less efficient using the Playground or Evals. Replace the problem with a more complex one, with answers that aren’t as clear-cut which require collaboration with domain experts, and the difference between the approaches only become more stark.

## Use for system prototyping and task decomposition

When building a real system, we’d typically have multiple model calls - some dependent on the outputs of earlier ones. In this video, we use a spreadsheet and our new functions to perform a task where the results of previous model calls feed into subsequent ones. This technique can be used to quickly prototype the arrangement of calls in a system, or similarly to iterate on decomposing complex tasks (prompts) into smaller more manageable ones.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jJShRQ-S75s?si=pSWLMCV__9GDsHSo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Conclusion

The tooling space for prompt engineering is far from settled, and our recent project experience demonstrated there is an unfilled niche in this area. Whilst we don’t think that an Excel add-in is the final chapter in this story, we do think if we’d had this a few months ago it would have increased the efficiency of our prompt engineering work.

In doing so, we’d have saved a lot of development time, probably saved money on model invocations and certainly had a far less frustrating time of it! We’re looking forward to an excuse to use it in anger, and to seeing what others do with it.
