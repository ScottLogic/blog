---
title: A primer on the OpenAI API - Part 3
date: 2021-09-02 00:00:00 Z
categories:
- cprice
- Tech
author: cprice
layout: default_post
summary: "...or what I should have known before I jumped in and started playing around.
  In this post I cover few shot learning and fine-tuning."
---

...or what I should have known before I jumped in

I recently received an invite to try out the [OpenAI API beta](https://beta.openai.com/). As always, I jumped straight in and started playing around. By tweaking the examples I was able to produce some interesting and/or entertaining results. 

However, after a little while I realised I didn't really understand what was happening or what the various parameters really did. So I jumped into the docs and read/watched around the subject. This mini-series of posts are a summary of what I've learnt -

* [Part 1 covers basics of tokens, the model and prompt design](../../08/31/a-primer-on-the-openai-api-1.html).
* [Part 2 covers logprobs and the "creativity" controls](../../09/01/a-primer-on-the-openai-api-2.html).
* Part 3 (this post) covers few shot learning and fine-tuning.

*If you were hoping for examples of what it can do, this isn't going to be for you. I'd recommend checking out the [impressive examples](https://beta.openai.com/examples) in the documentation.*

## Few shot learning

Almost any use of the [playground](https://beta.openai.com/playground), is an example of zero, one or few shot learning. Instead of requiring a (often very!) large set of examples to use as training data, a generic model is able to generate a meaningful text completion for a huge variety of intents, from a very small set of examples. 

The most basic example I can think of is the prompt -

~~~python
"Once upon a time"
~~~

In the English-speaking world, there is a very high probability that any text starting with that phrase is going to be a children's story. Therefore a model trained on a large corpus of English text should have picked up on this pattern and with just that prompt, be able to continue the story.

In most other cases, there's a lot more ambiguity. For some of these cases, providing a *few* examples can be enough to resolve that ambiguity. For example -

~~~python
"A: Apple, B:"
~~~

The above prompt could be asking the model to complete an alphabetical list of fruits. Alternatively, it could be an alphabetical list of NASDAQ constituents or something entirely different. In the case of the first two the ambiguity can be resolved by providing more examples -

~~~python
"A: Apple, B: Banana, C:"
~~~

Or - 

~~~python
"A: Apple, B: Broadcom, C:"
~~~

Few shot learning works well when highly probable alternative intents can be resolved by a small number of examples. It is worth noting that the examples in this section are incredibly simplistic, with the model capable of far [more](https://beta.openai.com/examples/default-micro-horror) [complex](https://beta.openai.com/examples/default-spreadsheet-gen) [inferences](https://beta.openai.com/examples/default-movie-to-emoji). However, as powerful as it is, sometimes only a large number of examples can resolve the ambiguity for low-probability intents.

## Fine tuning

I've found the model isn't able to correctly infer the task when working with longer texts where it's hard to fit enough examples within the token limit and when I've tried for a particular output format or style of writing. In these cases, I've had some success with [fine-tuning](https://beta.openai.com/docs/guides/fine-tuning).

Fine-tuning is a form of transfer learning, that is to say, taking a model trained to do one activity and repurposing it for another, most likely similar, activity. If you're not familiar with the concept, I covered the basics in this [talk](https://www.youtube.com/watch?v=U866dA0u4eE) from a few years ago.

Generally speaking, fine-tuning allows you to train a general purpose model to do a more specific task, with a greater accuracy than the original model. While fine-tuning is very powerful, it comes with its own set of problems such as preparing extensive sets of accurate and unbiased examples to use as training data, over-fitting to the training data and the dark art of hyper-parameter tuning.

In the case of the [OpenAI API per-token pricing model](https://beta.openai.com/pricing), there's also potentially a financial advantage if using the fine-tuned model reduces the number of tokens you consume. Although it's worth bearing in mind that using fine-tuned models is [2-5x more expensive](https://beta.openai.com/docs/guides/fine-tuning), it doesn't allow you to use the most-advanced Davinci model and you're currently limited to 10 fine-tune runs a month by default.

*Before embarking on any fine-tuning, it's worth reviewing the existing specialisms of the model/API for dealing with well-understood domains such as [search (ranking matches of a piece of text against a defined set of texts)](https://beta.openai.com/docs/guides/search), [classification (assigning one of n labels to a piece of text)](https://beta.openai.com/docs/guides/classifications) and [answers (generating an answer text to a question text based on a set of reference texts)](https://beta.openai.com/docs/guides/answers). Doing so will most likely save you a lot of time and effort (read that as "would have saved me a lot of effort").*

## Conclusion

The models behind the OpenAI API are very impressive but, as with all new technology, I find it can be very easy to get carried away with the hype. Having a basic understanding of what is going on behind the scenes, helps me understand how I can make the best use of it and also gain an intuitive understanding of when it may or may not be appropriate to apply it to a problem. Hopefully this series of posts helps someone else gain that understanding... or at the very least serves as a reminder to myself in the future!

If you found the underlying AI content interesting, [Robert Miles' Computerphile episodes](https://www.youtube.com/watch?v=rURRYI66E54) cover these topics far better than I ever could. The [AI safety videos on his channel](https://www.youtube.com/channel/UCLB7AzTwc6VFZrBsO2ucBMg) are also great.

I think it is inevitable that AI will change the way I work as a developer. Where once AI technology was confined to specialist teams, applying AI to business problems is becoming ever more accessible through frameworks, libraries and APIs like the OpenAI API. Whilst the OpenAI API might not be the overnight revolution that some of the hype might have us believe, I'm sure this trend will continue and there'll be increasing adoption of AI-based approaches in the future.

In summary, *I think it's important to remember that AI is a tool, just like any other. It's important to understand how it works, what the limitations are and what it can and cannot do. But most importantly, it's important to understand that AI is not magic and, just like any other tool, it's important to use it in the right way.*

(OpenAI wrote that last bit - I should probably have tweaked the frequency penalties!)
