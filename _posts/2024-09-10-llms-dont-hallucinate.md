---
title: LLMs don't 'hallucinate'
date: 2024-09-10 00:00:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
summary: Describing LLMs as 'hallucinating' fundamentally distorts how LLMs work.
  We can do better.
author: jcarstairs
image: "/uploads/LLMs%20dont%20hallucinate.png"
layout: default_post
---

**LLMs make stuff up.**

LLMs can confidently tell you all about the winners of non-existent sporting
events[^7], They can invent legal cases[^8], and fabricate fake science[^9].
These kinds of outputs are often called **hallucinations**.

<p>
  <figure aria-hidden="true">
    <img
      src="{{ site.github.url }}/jcarstairs/assets/mirage.webp"
      alt=""
    />
    <figcaption>
      A desert mirage.
      <a href="https://commons.wikimedia.org/wiki/File:Desert_mirage,_Egypt.jpg">Photo credit: Ashabot, Wikimedia</a>,
      <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC BY-SA 4.0</a>
    </figcaption>
  </figure>
</p>

Thankfully, the greatest minds of the human race are hard at work ironing
out this problem. Solutions abound: improving the quality of your training
data[^10], testing the system diligently[^11], fine-tuning the model with human
feedback[^12], integrating external data sources[^13], or even just asking the
LLM to evaluate its own answer[^14] are just some of the ingenious techniques
engineers and scientists have proposed.

According to OpenAI,
[GPT-4 reduces hallucination by 40%](https://openai.com/index/gpt-4) compared
to its predecessors: and surely, LLM proponents say, that pattern will continue,
Moore's-Law-style, until LLM hallucination is a distant memory, like the
[inefficiencies in early steam engines](https://www.thehistorycorner.org/articles-by-the-team/a-dream-too-lofty-why-the-steam-engine-failed-in-the-18th-century).

But is it so simple? A growing chorus of academics, engineers and journalists
are calling this narrative into question.[^3] **Maybe hallucination isn't a
solvable problem at all.**

<p>
  <figure aria-hidden="true">
    <img
      src="{{ site.github.url }}/jcarstairs/assets/ai-safety-summit.webp"
      alt=""
    />
    <figcaption>
      Taken at the AI Safety Summit hosted at Bletchley Park, Nov 2023.
      <a href="https://www.flickr.com/photos/ukgov/53302448690/in/album-72177720312359636/">Photo credit: Marcel Grabowski</a>,
      <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">CC BY-NC-ND 2.0</a>
    </figcaption>
  </figure>
</p>

Indeed, it's increasingly clear that the word 'hallucination' fundamentally
distorts the way LLMs actually work. This means our judgements of what LLMs are
capable of could be systematically off the mark.

**We need a new word**. We need a word which captures how LLMs behave, but
doesn't bake in false assumptions about how LLMs work. We need a word which
enables accurate and honest discussions about how best to apply LLMs.

But before we get to the solution, we need to properly understand the problem.

## What is 'hallucination'?

Since about 2017, researchers in natural language processing have used the word
'hallucination' to describe a variety of behaviours[^1]. Since ChatGPT propelled
LLMs to public awareness, this word has become commonplace. But what does it
actually mean?

Sometimes, it refers to **unfaithfulness**, a jargon word in natural language
processing. This means that its output contains information which is not
supported by the input.

For example, if you try to get an LLM to summarise a meeting transcript, and its
summary includes events which weren't described in the transcript, the LLM has
been 'unfaithful'.

When academics talk about 'hallucination', they most often mean something like
'unfaithfulness' – though other meanings are common, too.

Sometimes, 'hallucination' refers to **non-factuality**: producing outputs which
contain falsehoods, or other falsehood-like things, such as unjustifiable
claims, or claims which contradict the LLM's training data. This is probably the
most common usage in non-academic circles.

By the way, sometimes, 'hallucination' has another meaning altogether:
**nonsense**. Nonsense is one of those things which is hard to define, but you
know it when you see it. This isn't my focus for this article, so let's leave
nonsense aside for proper treatment another day.

If you want to go deep on how people are using the word 'hallucination' to talk
about LLMs, I've investigated this in detail on
[my personal blog](https://joeac.net/blog/2024/07/16/word_hallucination_with_reference_to_llms).

So what people mean by 'hallucination' is pretty diverse. But all of these
different usages have something in common: 'hallucination' is regarded as
**abnormal behaviour**.

### 'Hallucination' as abnormal behaviour: what this means

Treating hallucination as abnormal is very significant. Let's take a minute to
consider what this entails.

First of all, it entails that **every hallucination can be explained**, at least
in principle.

This is because, when the environment and inputs are normal, systems behave
normally. So, whenever an LLM hallucinates, we should expect to find something
abnormal about the environment or the input which explains why the LLM
hallucinated.

Secondly, if hallucination is abnormal behaviour, that implies that not
hallucinating is normal.

That in turn means **there must be some mechanism**, some causal explanation
contained in how LLMs work, which explains why, under normal conditions, LLMs
don't hallucinate.

These points are pretty subtle, so let's explore a couple of examples.

Think about dice. I could roll six sixes in a row, and that would be really
unusual behaviour for the die.

<p>
  <figure aria-hidden="true">
    <img
      src="{{ site.github.url }}/jcarstairs/assets/dice.webp"
      alt=""
    />
    <figcaption>
      <a href="https://www.deviantart.com/barefootliam-stock/art/five-ivory-dice-97476774">Photo credit: barefootliam-stock</a>,
      <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>
    </figcaption>
  </figure>
</p>

But firstly, this wouldn't demand an explanation. It's not a bug, it's just
statistically improbable.

And secondly, there's no mechanism which can explain why, under normal
conditions, a die shouldn't roll six sixes in a row. Very, very occasionally,
it's just what dice do.

That's because it's normal (albeit uncommon) behaviour for a die to roll six
sixes in a row.

In contrast, if I secure a picture to the wall with a picture hook, and it
falls off, I can reasonably expect there to be an explanation.

<p>
  <figure aria-hidden="true">
    <img
      src="{{ site.github.url }}/jcarstairs/assets/picture-falling-off-wall.webp"
      alt=""
    />
    <figcaption>
      A picture hook behaving abnormally. Mind you, the chap on the ladder
      appears to have bigger problems right now.
      <a href="https://www.lookandlearn.com/history-images/YW039819V/Episodes-illustrating-forces-in-physics-dynamics-and-mechanics">Photo credit: lookandlearn.com</a>,
      <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
    </figcaption>
  </figure>
</p>

Maybe the nail was bent. Maybe I didn't hammer it in straight. Maybe I didn't
quite catch the string on the hook when I put it up.  Point is, something must
have gone wrong for the picture hook to behave in this way.

And again, we should expect there to be a mechanism which can explain why under
normal conditions, pictures hooked to the wall don't fall off.

And indeed there is such a mechanism: the hook catches the string and transfers
the weight of the picture to the wall, instead of leaving that weight to pull
the picture down towards the ground.

That's because for the picture to fall off the wall is abnormal behaviour
for a picture hook.

So, to recap, if LLM hallucination is abnormal behaviour, we should expect two
things:

1. There should be some abnormal conditions which explain why LLMs hallucinate
   in some cases but not others.
2. There should be some mechanism which explains why, under normal conditions,
   LLMs don't hallucinate.

## Why the word 'hallucination' distorts how LLMs work

**The word 'hallucination' doesn't satisfy either of those two expectations**
listed above. Therefore, the word 'hallucination' fundamentally distorts how
LLMs really work.

Firstly, when an LLM hallucinates, we should expect there to be some abnormal
conditions which explain why it did so. But often, **there is no such
explanation**.

Occasionally, LLMs produce unfaithful and untrue content for no good reason.
Often, the problem goes away by making meaningless tweaks in the wording of the
prompt, or even simply by running the algorithm again.

Secondly, if hallucination is abnormal behaviour, we should expect there to be
some mechanism which causes LLMs not to hallucinate under normal conditions.
But **there is no such mechanism**.

LLMs are predictive text machines, not oracles. They are not trained to target
faithfulness. They are not trained to target truth. They are trained to guess
the most plausible next word in the given sequence. So the case where the LLM
'hallucinates' and the case where it doesn't are causally indistinguishable.

<p>
  <figure aria-hidden="true">
    <img
      src="{{ site.github.url }}/jcarstairs/assets/predictive-text.webp"
      alt=""
    />
    <figcaption>
      The solution given by LLMs is new. The problem of predictive text is not.
      <a href="https://www.flickr.com/photos/bike/4474418938">Photo credit: Richard Masoner</a>,
      <a href="https://creativecommons.org/licenses/by-sa/2.0/deed.en">CC BY-SA 2.0</a>
    </figcaption>
  </figure>
</p>

There were some important and difficult points there, so let's elaborate.

By comparison, for humans to produce false or unfaithful data would indeed be
abnormal behaviour for humans.

But there are explanations for why humans sometimes produce such outputs: maybe
they were lying, or they were playing a game, or they were joking. Or indeed,
perhaps they 'hallucinating' in the traditional sense!

In contrast, an LLM can never literally lie, play a game, or tell a joke. It's a
pile of matrices.

And there are mechanisms which explain why humans normally don't produce
unfaithful or unfactual content. We have mental models of the external world. We
continually amend those models in response to evidence. We receive that evidence
through perception. And we use language, among other things, as a means of
communicating our mental models with other people.

But an LLM doesn't have any of these mechanisms. It doesn't have a model of
the external world. It doesn't respond to evidence. It doesn't gather evidence
through perception (or, indeed, by any other means). And it doesn't attempt to
use language as a means of communicating information with other minds.

So the concept of 'hallucination' fundamentally mischaracterises the nature of LLMs
by assuming that false or unfaithful outputs are abnormal for LLMs. In fact,
such outputs, while rare (at least in recent models), are nonetheless normal,
like a dice rolling six sixes in a row.

## Why this matters

OK, so 'hallucination' is not a great word. It assumes that unfaithful or
unfactual output is abnormal output for an LLM, when in fact, this just isn't
true.

But why does this matter? Can't we afford a little fudge?

I think the use of this word has serious consequences.

In academia, researchers are spilling considerable amounts of ink trying to
ascertain the causes of 'hallucination'[^5].

Not only is this enterprise wholly in vain, but it risks spreading the
misperception that hallucination is incidental, and will disappear once we find
better ways of designing LLMs. That in turn could lead decision-makers to invest
in LLM applications that just won't work, under the false impression that the
'hallucination' problem will disappear in future.

This isn't a hypothetical concern. LLMs have been set to
[writing entire travel articles](https://arstechnica.com/information-technology/2023/08/microsoft-ai-suggests-food-bank-as-a-cannot-miss-tourist-spot-in-canada),
[making legal submissions](https://www.texaslawblog.law/2023/06/sanctions-handed-down-to-lawyers-who-cited-fake-cases-relying-on-chatgpt),
and [providing customers with information on company policies](https://bc.ctvnews.ca/air-canada-s-chatbot-gave-a-b-c-man-the-wrong-information-now-the-airline-has-to-pay-for-the-mistake-1.6769454)
with catastrophic results.

And think about some of these common or proposed use cases:

- Helping write submissions to academic journals
- Generating meeting minutes
- 'Chatting with data'
- Summarising non-structured data in social research
- Writing computer code
- Question-answering
- All-purpose 'AI assistants'

Given that LLMs will, rarely, but inevitably, output garbage, all of these will
need to be done with enormous care to avoid causing serious damage.

Furthermore, there's a risk that an LLM may act as a so-called 'moral crumple
zone', effectively soaking up responsibility for failures on behalf of the
humans who were really responsible. And where there's a lack of accountability,
organisations are unable to make good decisions or learn from their
mistakes[^2].

<p>
  <figure aria-hidden="true">
    <img
      src="{{ site.github.url }}/jcarstairs/assets/crumple-zone.webp"
      alt=""
    />
    <figcaption>
      Just as crumple zones in a car is designed to absorb the impact of a
      collision to protect its driver, so misplaced and misunderstood LLMs
      could act to absorb responsibility from decision-makers.
      <a href="https://commons.wikimedia.org/wiki/File:Escort_wreck_006.jpg">Photo credit: Karrmann, Wikimedia</a>,
      <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en">CC BY-SA 3.0</a>
    </figcaption>
  </figure>
</p>


## How to understand LLM behaviour besides 'hallucinating'

So, the word 'hallucination' isn't fit for purpose. But we do legitimately need
ways of understanding how LLMs behave, including their tendencies to produce
false or unfaithful outputs.

### Confabulation: a step forward, but still flawed

One alternative suggestion is to
[refer to the behaviour as 'confabulation' instead of 'hallucination'](https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000388).

While, as the authors linked above rightly point out, this does address some
of the problems with the word 'hallucination', it still has the fundamental
flaw we've been discussing. It still assumes that 'hallucination', or
'confabulation', is a causally distinguishable abnormal behaviour.
 
Humans sometimes confabulate, but normally they don't. When humans do
confabulate, we can expect there to be an explanation, like a head injury or
mental illness. And we can expect there to be mechanisms in how the human mind
works which explains why humans don't normally confabulate.

But as we have seen, this is not an accurate analogy for LLMs. For an LLM, it is
just as normal for it to produce outputs which are false or unfaithful outputs
as it is for it to produce outputs which are true or faithful.

### Bulls\*\*t: a better solution

However, three philosophers at the University of Glasgow have come up with an
ingenious solution.

[**LLMs are bulls\*\*t machines**](https://link.springer.com/article/10.1007/s10676-024-09775-5).

Please don't be alarmed. Despite appearances, 'bulls\*\*t'
is a technical term in analytic philosophy, developed in
[Harry Frankfurt's 2005 classic, _On Bulls\*\*t_](https://doi.org/10.2307/j.ctt7t4wr).
Following Frankfurt's original usage, it's generally taken to mean something
like this:

> **bulls\*\*tting**: speaking with a reckless disregard for the truth.

Canonical examples include:

- Pretending you know something about whisky to try and impress a client,
  colleague, or crush
- Bizarre advertising slogans, like 'Red Bull gives you wings'
- Any time Paul Merton opens his mouth on [Just A Minute](https://www.bbc.co.uk/programmes/b006s5dp)

Why is this a good match for describing how LLMs behave? Well, LLMs are trained
to imitate language patterns from its training data. The LLM has succeeded at
its task when its output is linguistically plausible. Not when it's true,
well-evidenced, or faithful to the input – just when it's linguistically
plausible. In other words, its goal is to 'sound like' what a human would say.

This is just like what a human does when they bulls\*\*t. When someone
bulls\*\*ts, they're not aiming to produce anything true, faithful or coherent,
they're just trying to sound like they know what they're talking about. If I
can convince my crush that I'm a sophisticated gentleman that knows his Islays
from his Arrans, she just might consider going on a date with me. Actually
saying something true or meaningful about whisky is not the task at hand.

<p>
  <figure aria-hidden="true">
    <img
      src="{{ site.github.url }}/jcarstairs/assets/whisky.webp"
      alt=""
    />
    <figcaption>
      I like the long notes of smoke and spices in this one. Mmm, gingery.
      <a href="https://timelessmoon.getarchive.net/amp/media/whisky-alcohol-drink-food-drink-e8ec93">Photo credit: Pixabay</a>,
      <a href="https://creativecommons.org/publicdomain/zero/1.0">CC CC0 1.0</a>
    </figcaption>
  </figure>
</p>

The word 'bulls\*\*t' is a huge step forward:

- **It captures LLMs' tendency to produce false or unfaithful output.** Since
  truth and faithfulness are not goals, it's perfectly possible for it to
  produce false or unfaithful output purely by chance.
- **It explains why LLMs often produce true and faithful output**, even if it is
  accidental. Plausible-sounding things, by their nature, have a good chance of
  being true.
- **It correctly identifies false and unfaithful outputs as normal for an LLM**
  \- unlike 'hallucination'.

Previously, we thought that an LLM reliably outputs true and faithful content,
except when it occasionally hallucinates. Now, we recognise that an LLM in fact
always outputs bulls\*\*t.

### The benefits of bulls\*\*t

So far, the word 'hallucination' has trapped us into talking pretty negatively
about LLMs. But the word 'bulls\*\*t', perhaps surprisingly, frees us to talk
honestly about the positive applications of LLMs as well.

As several authors have pointed out before[^4], the tendency of LLMs to produce
false and misleading output corresponds closely to its tendency to produce
output which might be described, for want of a better word, as 'creative'.

Trying to understand why 'hallucinating' goes together with 'creativity' is a
profound mystery. But it's obvious that 'bulls\*\*tting' is in some sense a
'creative' activity by nature. (Just ask Paul Merton!)

Therefore, because we have a more accurate description of how LLMs work, we
can make more robust decisions both about where LLM behaviour is desirable, and
about where it isn't.

Would you employ a professional bulls\*\*tter to write your company minutes? Or
write large chunks of computer code? Or summarise a legal contract?

Or what about redrafting an email in a formal tone? Or suggesting a more
descriptive variable name in your code? Or suggesting a couple extra Acceptance
Criteria on your Scrum Issue that you might have forgotten? Are these
applications where 'sounds about right' is good enough?

## Recap

The word 'hallucination' has gripped the popular narrative about LLMs. But the
word was never suited to describing how LLMs behave, and using it puts us at
risk of making bad bets on how LLMs ought to be applied.

By using the word 'bulls\*\*t', we recognise that while false and unfaithful
outputs may be rare, they should occasionally be expected as part of the normal
operation of the LLM.

As a result, we are empowered to recognise the applications where LLMs can
really make a positive difference, as well as quickly recognise the applications
where it can't.

## Footnotes

[^1]: If you want a fuller treatment of how the word 'hallucination' has been used historically in the field, see [my personal blog post](https://joeac.net/blog/2024/07/16/word_hallucination_with_reference_to_llms) on the topic.
[^2]: For more on this idea, look into [Madeleine Clare Elish's concept of moral crumple zones](https://doi.org/10.17351/ests2019.260).
[^3]: For example, see [a Harvard study on hallucination in the legal context](https://doi.org/10.48550/arXiv.2405.20362), this [philosophical article](https://arxiv.org/pdf/2212.03551) and this [Forbes article](https://www.forbes.com/sites/lanceeliot/2022/08/24/ai-ethics-lucidly-questioning-this-whole-hallucinating-ai-popularized-trend-that-has-got-to-stop) expressing concern about the use of the word 'hallucination', this [BBC journalist on using LLMs in journalism](https://www.bbc.co.uk/rd/blog/2024-06-mitigating-llm-hallucinations-in-text-summarisation), and this [PBS article which quotes an academic saying 'this isn't fixable'](https://www.pbs.org/newshour/science/chatbots-can-make-things-up-can-we-fix-ais-hallucination-problem).
[^4]: See for example [Jiang, Xuhui et al 2024. A Survey on Large Language Model Hallucination via a Creativity Perspective](https://arxiv.org/abs/2402.06647).
[^5]: See for example [Huang, Lei et al 2023. A Survey on Hallucination in Large Language Models: Principles, Taxonomy, Challenges, and Open Questions](https://arxiv.org/abs/2311.05232).
[^7]: Like when [an LLM made up the 1985 World Ski Championships](https://medium.com/@gcentulani/understanding-hallucination-in-llms-causes-consequences-and-mitigation-strategies-b5e1d0268069).
[^8]: As one person found to their misfortune, when [a New York lawyer filed a brief containing six references to non-existent cases](https://www.bbc.co.uk/news/world-us-canada-65735769).
[^9]: [Meta's AI academic assistant Galactica flopped after three days](https://www.technologyreview.com/2022/11/18/1063487/meta-large-language-model-ai-only-survived-three-days-gpt-3-science), following a backlash over its tendency to output falsehoods.
[^10]: See for example [Gianluca Centulani on Medium](https://medium.com/@gcentulani/understanding-hallucination-in-llms-causes-consequences-and-mitigation-strategies-b5e1d0268069).
[^11]: See for example [IBM's introduction to LLM hallucination](https://www.ibm.com/topics/ai-hallucinations)
[^12]: As claimed by [OpenAI's GPT-4](https://openai.com/index/gpt-4).
[^13]: See for example [Shuster et al 2021. Retrieval Augmentation Reduces Hallucination in Conversation](https://arxiv.org/pdf/2104.07567).
[^14]: See for example [Ji et al 2024. Towards Mitigating Hallucination in Large Language Models via Self-Reflection](https://aclanthology.org/2023.findings-emnlp.123.pdf).
