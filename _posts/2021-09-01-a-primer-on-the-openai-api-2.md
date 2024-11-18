---
title: A primer on the OpenAI API - Part 2
date: 2021-09-01 00:00:00 Z
categories:
- Tech
author: cprice
layout: default_post
summary: '...or what I should have known before I jumped in and started playing around. In this post I cover logprobs and the "creativity" controls.'
---

...or what I should have known before I jumped in

I recently received an invite to try out the [OpenAI API beta](https://beta.openai.com/). As always, I jumped straight in and started playing around. By tweaking the examples I was able to produce some interesting and/or entertaining results. 

However, after a little while I realised I didn't really understand what was happening or what the various parameters really did. So I jumped into the docs and read/watched around the subject. This mini-series of posts are a summary of what I've learnt -

* [Part 1 covers basics of tokens, the model and prompt design](../../08/31/a-primer-on-the-openai-api-1.html).
* Part 2 (this post) covers the logprobs and the "creativity" controls. 
* [Part 3 covers few shot learning and fine-tuning](../../09/02/a-primer-on-the-openai-api-3.html).

*If you were hoping for examples of what it can do, this isn't going to be for you. I'd recommend checking out the [impressive examples](https://beta.openai.com/examples) in the documentation.*

## Controlling "creativity"

In the [previous post](../../08/31/a-primer-on-the-openai-api-1.html) I introduced the model as a function which returns an output token. Well, I lied. It's a reasonable starting point but glosses over some of the detail needed to generate more "creative" responses. This creativity comes in everyone's favourite form, probabilities, or more specifically `logprobs`...

I'm making it sound a lot worse than it really is and a basic understanding should be within everyone's grasp. Personally, I can follow the steps involved intuitively, but would definitely struggle if I was trying to come up with them from first principles. Let's deal with `logprobs` first.

## Logprobs

Most people are already familiar with more than one method of specifying probabilities. `logprobs` are just another way. For example, `1 in 10` is equivalent to `10%` as a percentage, is equivalent to `0.1` as a decimal fraction, is equivalent to `-2.303...` as a `logprob`. The following lookup table helped me understand them -

| Percentage |    logprob |
|------------|------------|
| 100        |     0      |
|  99.99     |    -0.0001 |
|  99.9      |    -0.001  |
|  ~99       |    -0.01   |
|      x     | log(x/100) |
|  e(x)*100  |     x      |

The API uses `logprobs` because it is computationally easier to calculate the probability of a sequence of tokens if their individual probabilities are expressed as `logprobs` (their sum) rather than percentages (their product). The only thing I really hold in my head about `logprobs` is that the largest value (remember they're negative numbers) has the highest probability. So how does the API use them?

## Revisiting the model output

Updating the previous example of prompting the model with `"Once upon a"` to include the `logprob` -

~~~python
model(tokenise("Once upon a")) == (tokenise(" time")[0], logprob("96.45%"))
~~~

But even this isn't a true representation of the output, instead it's my understanding that the model is actually outputting a `logprob` for every known token. The API then sorts this from most likely to least and truncates it after N values, producing something more like -

~~~python
model(tokenise("Once upon a")) == [
  (tokenise(" time")[0], logprob("96.45%")),
  (tokenise(" Time")[0], logprob("0.67%")),
  (tokenise(" midnight")[0], logprob("0.31%")),
  # ...
]
~~~

Having access to these raw probabilities for each token leads to some interesting possibilities. Instead of always picking the most likely token, what if the API randomly chose from one of the most likely values? 

*Interestingly, the API also returns the logprobs for tokens in the prompt. That suggests that the loop I referred to when discussing basic prompt design, runs for each token in the prompt as well as those produced for the completion.*

## Adding randominsation to the output

It turns out that the APIs behaviour is always to randomly choose from the set of output tokens. Prior to sampling, each token is first weighted by its relative probability. To change the model's behaviour, these probabilities can be manipulated with the following request options, which were until now set to `0` and `1` respectively -

* `Temperature` - a value between `0` and `1`. At `0`, randomness is removed by boosting the most likely token to `100%`. Values greater than `0` have the effect of boosting the next most probable tokens. The exact effect a particular value will have is hard to reason about, but the greater the value, the less likely a more-probable token will be boosted relative to a less-probable token.
* `Top P` - again a value between `0` and `1` but this time representing a decimal fraction. The effect of the value is similar to `Temperature` but it is easier to reason about the effect a particular value will have. The top N tokens with a cumulative probability greater than the value specified are boosted, with all other tokens suppressed e.g. a value of `0` will select only the top token.

In the above descriptions all boosts are relative. The total probability of all tokens can not exceed 100%, therefore a boost in one probability necessitates a suppression of another. It typically doesn't make sense to set both of these options, as they both attempt to manipulate the same probabilities in similar ways. So the documentation advice is to set whichever you're not using to `1`.

## Looping the loop

Understanding that the model is no longer restricted to just picking the most likely next token, changed my mental model of the generation process, from a linear sequence of tokens being generated, to a somewhat controlled random walk through a tree of possible sequences. The original linear sequence being just one possible path, where the highest probability branch was chosen on each iteration, but which does not necessarily have the highest cumulative probability when the full path is considered.

The API provides a convenience option `Best of` to allow you to run N completions and return only the completion with the highest cumulative probability (this is one reason for `logprobs`). With the right degree of randomness, this should mean the API is able to find a completion with a higher cumulative probability than simply choosing the highest probability token on each iteration.

I say this is a convenience because as opposed to the options above which run within the loop, this loop wraps that loop. So whilst it might save some bandwidth, it costs the same as invoking the API N times (using the `n` option) and performing the small amount of post-processing yourself.

## Probability penalties

When using no or low degrees of randomness, I've found it very easy to end up with repetitive completions. To help with this, as well as transforming the probabilities in isolation, it is also possible to transform them as a function of the input tokens.

The following two request options are available, in both cases they are a value between `0` and `1` representing the maximum suppression to apply to a token's probability as a decimal fraction -

* `Presence penalty` - suppress a token's probability by this amount if it is found in the input.
* `Frequency penalty` - suppress a token's probability by this amount multiplied by its frequency of occurrence in the input.

These penalties can be freely combined to gently nudge the model away from repeating itself with a presence penalty. Before steadily ratcheting that up to a firm prod, if it continues to repeat itself, with a frequency penalty. `0` values have no effect on the model.

## Conclusion

One of the standout things to me which is obvious in retrospect but definitely wasn't when I first interacted with the models, is that they are pure functions. I think it's easy to assume with all of the talk of probabilities, along with the lack of anyone really understanding what the models are doing internally, that they are in some way non-deterministic in their "thinking". Knowing that they are in fact deterministic somehow puts my mind at ease. 

But then I get carried away thinking philosophically - what really is creativity? Luckily for you, I dodge this question and others in [part 3](../../09/02/a-primer-on-the-openai-api-3.html).
