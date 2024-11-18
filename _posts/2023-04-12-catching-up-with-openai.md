---
title: Catching up with OpenAI
date: 2023-04-12 00:00:00 Z
categories:
- Artificial Intelligence
tags:
- featured
summary: It’s been over a year since I last blogged about OpenAI. Whilst DALL-E 2, ChatGPT and GPT4 have grabbed all of the headlines, there were a lot of other interesting things showing up on their blog in the background. This post runs through just over six months of progress from Sept 2021 - March 2022.
author: cprice
image: cprice/assets/never-ending-typewriter.png
layout: default_post
---

It’s been over a year since I last blogged about OpenAI. Whilst DALL-E 2, ChatGPT and GPT4 have grabbed all of the headlines, there were a lot of other interesting things showing up on their blog in the background. This post runs through just over six months of progress from Sept 2021 - March 2022.

## [Recursive task decomposition](https://openai.com/blog/summarizing-books/)
September 2021

One of the big constraints of the GPT series of models is the size of the input. This restriction varies by model but a reasonable guide would be hundreds of words. Crucially, due to [how the output is generated](https://blog.scottlogic.com/2021/08/31/a-primer-on-the-openai-api-1.html#basic-prompt-design), this constraint effectively applies to the total length of both the input and output. 

The paper introduces a technique called recursive task decomposition that can be used to workaround this restriction. Instead of instructing the model to perform an associative operation (e.g. producing a summary) on the full input, the input can be bifurcated, the operation performed on each half to produce two partial results and then a final run performed taking those partial results as inputs. 

My favourite part of this approach is the increased observability of the AI behaviour that is possible as a side-effect of the approach. For example, if during a summarisation operation a key detail is dropped, the partial results can be studied to identify the stage of the operation in which that happened.

## [Verifiers](https://openai.com/blog/grade-school-math/)
October 2021

When GPT3 was first released by OpenAI, one of the surprising results was that it could perform simplistic arithmetic on novel inputs with few-shot learning. Whilst it performed admirably on 2 digit addition and subtraction, it was less good on everything else. This paper looks at how the performance on combinations of operations can be improved with higher numbers of digits. 

They choose to represent the combinations of operations as the kind of verbose maths problems we all remember from school e.g. -

~~~
Alice walks into a shop and buys 3 apples and 2 bananas for £7. If an apple costs £2, how much does a banana cost?
~~~

And they trained the model to produce verbose answers e.g. -

~~~
3 apples cost 3 * £2 = £6
2 bananas cost £7 - £6 = £1
1 banana costs £1 / 2 = £0.50
~~~

This allowed a second model, called a verifier, to be trained to predict the accuracy of a question/answer pair. Sampling a number of high-temperature answers from the original model, ranking with the verifier and taking the top answer allowed a significant bump in accuracy. Most interestingly, this approach allowed a 30x smaller model (with verifier) to outperform a fine-tuned model (without verifier).

There was also a notable accuracy boost when they trained the verifier to predict correctness after every token in the answer, not just once with the full answer. Proving the age-old teacher adage that your working out is just as important as the result!

## [Fine-tuning](https://openai.com/blog/customized-gpt-3/)
December 2021

Fine-tuning, a topic I covered in my [previous blog post](https://blog.scottlogic.com/2021/09/02/a-primer-on-the-openai-api-3.html#fine-tuning), has progressed out of beta.

## [WebGPT](https://openai.com/blog/webgpt/)
December 2021

A common complaint about GPT3 is its tendency, when asked to produce a factual answer to a question, to hallucinate facts. That is to say that it firmly states something as fact, which is in fact, complete tosh. This paper attempts to address this by allowing the model to perform its own online research in the form of web searches and then to reference those sources against the claims it is making.

The implementation of this is quite interesting, as is the specific coverage in the paper of the potential risks of bestowing live web access on a model! The model is trained to answer a question with one of a set of commands, including requesting a web search for a particular term, navigating to a particular result, viewing the next page of results, etc.. The runtime environment then parses this command, performs the required action, appends the result to the prompt and then re-invokes the model. Finally terminating the loop when the model issues the command to stop.

Perhaps unsurprisingly, whilst it does improve relative to GPT-3 on a few benchmarks, it does not prove to be a silver bullet. Judging factual/honest sources is not a straightforward task which requires not only technical answers but also more philosophical ones (as discussed in more detail in [this paper](https://arxiv.org/pdf/2110.06674.pdf)). 

## [Embeddings](https://openai.com/blog/introducing-text-and-code-embeddings/)
January 2022

This post covers the promotion of embeddings, which Colin covered in his [previous blog post](https://blog.scottlogic.com/2022/02/23/word-embedding-recommendations.html), out of beta. It’s worth noting that the API described in that article has since been [superseded](https://openai.com/blog/new-and-improved-embedding-model/).

## [InstructGPT](https://openai.com/blog/instruction-following/)
January 2022

Whilst GPT3 can normally be corralled into producing useful responses, it often requires careful crafting of the prompt. This paper utilises Reinforcement Learning from Human Feedback to prime the model to produce high-quality responses from more natural prompts.

RLHF works by collecting examples from human labellers and fine-tuning the base model using this dataset (Supervised Fine Tuning).  Multiple responses from this fine-tuned model for a given prompt are captured and evaluated by human labellers. These scores are then used to train a second Reward Model to predict how a human labeller would score a response. Finally the SFT model is trained again, this time using Reinforcement Learning to maximise the output of the RM.

The improvements were so noticeable that the default models are now based on this technique (although the original models are still available). However, it is worth noting that now there are two potential sources of bias built into the model, from the original training data and now also from the human labellers.

## [Infinite action space/lack of self-play](https://openai.com/blog/formal-math/)
February 2022

Similarly to the previous maths problem paper, in this paper a GPT model is provided with a problem and asked to come up with a multi-stage solution to that problem. Solving earlier maths problems with small numbers requires a few steps in a limited space, while creating a proof involves taking steps in a much larger, unlimited space.

Training a model to do this with a restricted set of training data is challenging. Previous approaches to similar problems (e.g. 2 player games) have had success by pitting cross-generation models against each other. However, reframing theorem proving in this way is challenging, so this paper explores using an expert iteration approach.

First a function was created to generate problems (without solutions), parameterised by a complexity variable. Then a set of solutions was manually created for a small number of the simplest problems to bootstrap the process (n.b. a solution/proof, is complex to create but trivially verified). A training regime was then developed which ramped up the complexity of these problems as training progressed.  At each stage, the training data for the next level of complexity was augmented with valid solutions generated by the model for the current level. 

By generating its own training data, this training regime allowed the model to teach itself how to solve increasingly complex problems. Problems that were quickly out of the reach of a random search. Ultimately achieving a modest amount of success with the original problems of interest.

## [Language model misuse](https://openai.com/blog/language-model-safety-and-misuse/)
March 2022

As with most technological advances, the OpenAI models can be used for good and for not so good reasons. This post covers how OpenAI has tried to mitigate the latter.
The iterative process they define for model deployment of upfront risk analysis, gradual rollout of features, ensuring system observability and retrospective review of incidents/releases is very familiar. I would expect a similar approach to deployment of any API/service/application.

This was followed up a few months later with a [joint statement](https://openai.com/blog/best-practices-for-deploying-language-models/) from OpenAI and others committing to a set of derived principles.

## [Edit & insert](https://openai.com/blog/gpt-3-edit-insert/)
March 2022

Previously GPT-3 was limited to appending text to the end of a provided prompt. This post introduces two additional capabilities: explicitly providing an instruction to mutate the prompt and inserting text within (rather than at the end) of the prompt. 

Insert utilises a new parameter `suffix` with the original parameter `prompt` being taken as the prefix. The existing `stop` parameter can be used to provide stop sequences to control the length of the inserted text.

~~~
4 + 9 = 13 
2012 - [insert] = 6
~~~

~~~
1 - 3 = -2
2012 - 2006 = 6
~~~

Edit ditches the `prompt` parameter and instead takes two new parameters. An `input` parameter containing the text on which to perform the instruction, and an `instruction` parameter containing the action to perform on the text. 

~~~
4 + 9 = 13
1023 - 3 = -1
~~~

> Fix my maths

~~~
4 + 9 = 13
1023 - 3 = 1020
~~~

N.B. That in each case it required an example to steer the model towards maths problems.

I was interested in how these capabilities were achieved but there isn’t an associated paper and after some digging I couldn’t find any further information. I also tried a bit of prompt engineering but unfortunately I found nothing of note.

This in itself is noteworthy compared to my previous experience with the API. It suggests a much stronger level of rigour is being applied to handling user input than I’ve experienced using previous models.

## Conclusion

As always with AI advances, even relatively old ones, the results of these techniques are very impressive. However, I’m typically more impressed by how relatively modest training/model architecture changes can result in such significant capabilities/performance uplift.

It’s also interesting to me that the hardest part of AI training still seems to be producing and refining training data. There’s some real ingenuity going into how to iteratively apply AI models to this part of the process, rather than up-front manual curation. This definitely feels like the most exciting and relatable part of AI research for the non-mathematician!

