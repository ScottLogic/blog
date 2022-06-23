---
title: GitHub Copilot Experiences - a glimpse of an AI-assisted future
date: 2021-07-03 00:00:00 Z
categories:
- ceberhardt
- Tech
author: ceberhardt
layout: default_post
summary: I've been lucky enough to be granted access to the preview of Copilot, GitHub's
  new 'AI pair programmer' that is causing quite a stir. This blog post shares my
  initial thoughts and experiences with this tool. In brief, I'm stunned by its capabilities.
  It has genuinely made me say 'wow' out loud a few times in the past few hours, not
  something you expect from your developer tooling.
image: ceberhardt/assets/copilot/moving-average.png
---

I've been lucky enough to be granted access to the preview of Copilot, GitHub's new "AI pair programmer" that is causing quite a stir. This blog post shares my initial thoughts and experiences with this tool. In brief, I'm stunned by its capabilities. It has genuinely made me say "wow" out loud a few times in the past few hours, not something you come to expect from your developer tools!

However, there are some genuine practical limitations to this tool at the moment, which I'll discuss in this post. In brief:

 - Copilot pops up at unexpected moments, breaking my flow
 - Autocomplete feels like the wrong interaction paradigm for a "pair"
 - Checking Copilot's work adds cognitive load
 
My feeling is this tool isn't something that is going to revolutionise programming just yet, but despite the above points, I firmly believe it will have a significant and game-changing impact in the future.

If you're interested to learn more, read on ...

## What is Copilot?

Copilot is the latest development from OpenAI, a San Francisco-based AI company that recently received a considerable backing ($1bn dollars) from Microsoft. OpenAI have been making headlines recently with GPT3 (Generative Pre-trained Transformer), their third generation language model based on a massive neural network, with 175 billion parameters, that has been trained on a vast corpus of text.

To quote [Arram Sabeti](https://arr.am/2020/07/09/gpt-3-an-ai-thats-eerily-good-at-writing-almost-anything/):

> I got access the the OpenAI GPT-3 API and I have to say I’m blown away. It’s far more coherent than any AI language system I’ve ever tried.

GPT3 is able to generate highly realistic prose based on simple prompts. Furthermore, via their API others have developed a great many interesting tools including a question-based search engine, chatbots that allow you to converse with historic characters, even the generation of [guitar tabs](https://twitter.com/AmandaAskell/status/1283900372281511937). Finally, in a hint towards Copilot, Sharif created an impressive demo that [creates HTML layouts based on text prompts](https://twitter.com/sharifshameem/status/1282676454690451457).

Copilot is based on Codex, a new model which is a derivative of GPT3, which has been trained on vast quantities of open source code from GitHub. It is integrated directly with VSCode in order to generate suggestions based on a combination of the current context (i.e. your code), and the 'knowledge' it has acquired during the training process.

As an aside, you can clearly see how Microsoft's strategic investments (backing OpenAI, acquiring GitHub, creating VSCode) are coming together to create their products of the future.

## Copilot first experiences

Copilot is incredibly easy to use, simply install the VSCode plugin (which is unfortunately invite-only at the moment, sorry!), start writing code and wait for the Copilot to chip-in. Copilot understands a wide range of programming languages, but currently works particularly well on Python, JavaScript, TypeScript, Ruby and Go.

Copilot analyses the contents of the current file, both code and comments, to make suggestions. Let's see it in action, with a somewhat contrived demo.

It's quite common to set coding challenges as part of a job interview. At Scott Logic, one of our standard questions is to compute a [moving average](https://en.wikipedia.org/wiki/Moving_average). Let's see if Copilot is up to the challenge.

I simply type a simple comment and a function name, and Copilot suggests the following - a complete implementation of the entire function:

<img src="{{site.baseurl}}/ceberhardt/assets/copilot/moving-average.png"/>

NOTE: The text in grey is the Copilot suggestion that appears just like any other auto-completion. Pressing Tab accepts the suggestion.

Spot on. Impressive stuff.

I challenged Copilot with a whole host of simple programming tasks, verifying palindromes, finding the longest string etc - in each case, it created the correct answer in an instant. It's fascinating to watch how it gains an understanding of the problem through a combination of the comments, function signature and variable names.

Copilot - you're hired.

At this point it would be easy to think that Copilot calls on a vast catalogue of algorithms and functions, and simply selecting the closest match. Simple experimentation reveals that this is certainly not the case, it just so happens that these algorithms provide a simple way to demonstrate Copilot's powers.

Let's put it to the test with something a little more challenging. The [Advent of Code](https://adventofcode.com/) is an annual event where participants are set a series of complex coding challenges. Can Copilot solve the day one challenge?

Again, we'll give Copilot a comment (directly from the AoC instructions) and see what it comes up with:

<img src="{{site.baseurl}}/ceberhardt/assets/copilot/aoc.png"/>

On first inspection it looks like this _might_ be a solution, it has certainly picked up on the need to find two numbers that sum to 2020, and return their product. However, while the solution requires an exhaustive search of all the combinations of array entries, the Copilot suggestion performs a search where `i` and `j` are initialised at the arrays start and end respectively, incrementing / decrementing until the eventually meet.

I tried to give Copilot various other hints, by re-writing the comment and function name, each time it came up wth a sensible looking algorithm, but none were correct.

<img src="{{site.baseurl}}/ceberhardt/assets/copilot/aoc2.png"/>

## Putting Copilot to work

Generating algorithmic code based on a simple comment is an impressive feat, but it's hardly representative of how most of us work as a developers. I let Copilot come for a ride while working on one of my many side-projects to see how it faired on a more realistic challenge - in this case a visualisation of timezone data using D3.

D3 code is somewhat idiosyncratic, adopting a style which is quite different from vanilla JavaScript, so presents an interesting challenge for Copilot.

It's harder to demonstrate my experiences here, because there is much more context to consider, but I'll try to give you a brief flavour of what it was like. The suggestions tended to appear a little less frequently, and were also a little more brief. However, again there were some 'wow' moments.

Here it has suggested a couple of lines of code that are clearly based on the code a few lines earlier, and it is spot on:

<img src="{{site.baseurl}}/ceberhardt/assets/copilot/d3-example.png"/>

Sometimes the suggestions are little more than just a function signature completion, or a small and incomplete snippet of code. Although, quite often the suggested code is just a bit ridiculous, clearly there are not enough hints or cues in my code, or the training corpus, to determine the _intent_.

Despite this, there are times where it is genuinely useful. For example, I wanted a simple axis that renders the months:

<img src="{{site.baseurl}}/ceberhardt/assets/copilot/d3-scale.png"/>

Yes, the 'padding' wasn't quite what I was after, but I'm very impressed that it generated a complete array of month names.

I worked with Copilot for a few hours across a range of different projects and the results were quite mixed. I think Copilot has a little way to go before I'd want to keep it turned on by default, here's why ...

## Thoughts on Copilot

### Slow to arrive, and sometimes doesn't show up

I'm certainly not calling Copilot slow, suggestions appear within a few hundred milliseconds. However, when writing code, you tend to type quite quickly, often not giving Copilot a chance to pop up and do its thing. I found myself second-guessing when Copilot might want to make a suggestion, by pausing for a while. When this resulted in a quality suggestion appearing, great. However, at other times I'd just stare at my blinking cursor wondering whether Copilot had got bored and gone to make a coffee?

Nat (GitHub CEO) mentioned on Twitter that [they will likely add some UI to indicate if Copilot is thinking](https://twitter.com/natfriedman/status/1411187132522106886?s=20), which will go some way to addressing this issue. Which brings me to another problem ...

### Autocomplete is not an ideal interaction for Copilot

For most developers, the speed at which they can type is something of a limiting factor. Our brains move faster than our fingers. However, experienced developers have a very impressive typing speed. Autocomplete works perfectly alongside rapid keystrokes for the simple reason that it is predictable. I know when autocomplete is likely to kick in, closing braces, navigating properties or completing variable names from elsewhere in my code. As a result, my flow is not interrupted and my velocity increases.

Copilot is different in that it is unpredictable. You cannot fully anticipate when it will arrive (although with practice you get a decent idea) and as a result, your flow is broken.

My feeling is that autocomplete is not the best interaction paradigm for Copilot. I'm not entirely sure what a better paradigm is or if one even exists at the moment! Although I do know what I want. I'd like to be able to keep typing without waiting for Copilot. I don't want to have to predict when it might arrive.

I wouldn't mind at all if Copilot was effectively a few keystroke behind, perhaps creating a suggestion that would replace some of the text that I've just typed.

I'm sure some smart interaction designer could come up with something here! But for now, let's leave autocomplete for the simple and predictable stuff.

### Cognitive load

This gets me onto what is probably the biggest challenge I see with Copilot, the cognitive load associated with verifying its suggestions. As you saw earlier in this post, the code it creates almost always looks right, however, dig beneath the surface and you'll find it doesn't always do what you expected. The Advent of Code example above provides a good demonstration.

Verifying the code created by Copilot can be time consuming and ultimately error prone. Personally I prefer it when it generates simple two or three line suggestions that I can verify pretty much on sight. Anything longer and I'm a little unsure as to whether it would be easier to write the code myself in order to better convince myself of its correctness.

## Closing Remarks

I'm convinced that Copilot is going to sell _a lot_ of licenses. The "wow" factor of the simple demonstrations will be enough for many enterprises to add this to their standard toolset. However, I think it's going to be a little longer before Copilot delivers a genuine productivity boost. But I am convinced that this is coming.

Notably GitHub describes Copilot as "Your AI pair programmer". At the moment, it's not the ideal partner. It's equivalent to having a pair that grabs your keyboard unannounced and at unexpected moments, delivering somewhat mixed results.

Personally, I think this is more due to the inherent limitations of the autocomplete paradigm. If that can be addressed, the relationship with Copilot will be much more harmonious.

Taking the "pair programming" paradigm one step further, a pair is someone you have a continuous dialog with. With discussions ranging from the detail or syntactic level, to the more high-level, discussing refactoring or suitable patterns.

Could we really find ourselves with an AI pair programming assistant working alongside us in the future? At the start of 2021 I'd have been a sceptic. But after using Copilot, I think it's a possible future that isn't too far off.

Finally, this blogpost is written in markdown, so I suppose it makes sense for me to turn on Copilot and see what it thinks would be a suitable close for this post.

<img src="{{site.baseurl}}/ceberhardt/assets/copilot/modest.png"/>

Such modesty!

Share your thoughts, ideas and comments of this article over on [r/programming](https://www.reddit.com/r/programming/comments/odfibi/github_copilot_experiences_a_glimpse_of_an/).

Regards, Colin E.
