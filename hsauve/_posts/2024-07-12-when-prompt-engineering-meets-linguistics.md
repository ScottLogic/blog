---
title: In conversation with AI - when Prompt Engineering meets Linguistics
date: 2024-07-12 00:00:00 Z
categories:
  - Artificial Intelligence
tags:
summary: As we keep on building the InferGPT chatbot, the task of crafting prompts is one that our team is experimenting with. In this blog I'll explore some of the challenges of prompt engineering from a Linguistics angle.
author: hsauve
---

As we keep on building the [InferGPT](https://blog.scottlogic.com/2024/06/28/building-a-multi-agent-chatbot-without-langchain.html) chatbot internally at Scott Logic, the task of crafting prompts is one that our team is experimenting with, and through iterative testing and analysis, we’re getting a sense of the techniques that return the best results. 

Whether that's prompting an agent to [write a Cypher query](https://blog.scottlogic.com/2024/05/16/navigating-knowledge-graphs-creating-cypher-queries-with-llms.html) or to select the right tool for the task at hand, even the smallest changes and refinements in prompts are changing the accuracy of the responses we get back. 

## A glance at Linguistics 

A Large Language Model (LLM) is a type of [neural network](https://blog.scottlogic.com/2024/01/05/neural-net-basics.html) that 'learns' patterns that exist between words and expressions based on huge amounts of data they are trained on, to predict the [best next word](https://cset.georgetown.edu/article/the-surprising-power-of-next-word-prediction-large-language-models-explained-part-1/)  based on probabilities.

To better understand those patterns, we can explore the field of Linguistics, and particularly Pragmatics, although other linguistic fields come into play.

Pragmatics is the study of language in its context and effects. This discipline studies speech acts: utterances that serve a function in communication. We use speech acts all the time, they are a key component of human interactions and are used to perform all sorts of actions: request, apologise, refuse, and so on. They define not only the intention of the speaker, but also the effect on the listener.
Speech acts can be direct, like when I request: 'Read my blog now!', and can also be indirect.

Here's an example: I'm at a party with a friend, it's 2 a.m. I'm tired, a little bored and it’s getting late, so I turn to my friend and say: ‘it’s getting late don’t you think’. 
This is not a statement on the passing of time, instead what I truly mean is 'let’s get out of here’.  

My friend is aware of a number of clues to contextualise my comment: 
- her interlocutor is a sleep enthusiast
- she's been yawning ostensibly for the past 20 minutes
- it's 2 a.m. so it is objectively late

With that context in mind, she can interpret what I'm saying.

But that kind of indirect speech act can lead to ambiguity, misunderstanding and misinterpretation, my friend could misunderstand or even pretend to misunderstand what I'm saying, because she herself is having a ball and doesn't want to leave.

## Weaving context into prompts

This is why context is key to avoid ambiguity, and with LLMs, it is a requirement. 

LLMs do not ‘think’. Their conversational abilities are what lead us to attribute human-like feelings to them, but all they’re doing is predicting the best next word. In the human world, we use word-sense disambiguation to understand the meaning of a word within its context, however this pre-existing knowledge is absent in LLMs and therefore needs to be explicated.

The word 'context' comes from the latin *con-texere*, which means 'to weave together'. Context is like weaving connections together and creating a frame in which an idea or an event lives.

![My Image]({{ site.github.url }}/hsauve/assets/prompt-engineer/weaving.jpg "Two people weaving")

*Photo by [Karolina Kaboompics](https://www.pexels.com/@karolina-grabowska/) on [Pexels](https://www.pexels.com/photo/top-view-photo-of-person-weaving-4219653/)*

LLMs are trained on huge amounts of data that belong to many different contexts so defining the connections that surround an idea allows LLMs to narrow down the scope of probabilities to generate the best next word. 

To help do that, there are lots of tools out there.


## Frameworks and strategies

#### Techniques

Several [techniques](https://www.promptingguide.ai/techniques) have been developed to enhance the accuracy of responses. Amongst these, [Chain-of-Thought](https://research.google/blog/language-models-perform-reasoning-via-chain-of-thought/),  proposed by Google researchers involves breaking down a problem into intermediate steps, Few-Shot provides the LLM with 'shots' or examples of the sort of result we want to obtain while Zero-Shot presents a prompt without any examples. 

Different strategies bring different results and based on the desired output, one technique might be preferred to another.

#### Frameworks

With the rise of Generative AI, a whole range of creative ways of interacting with LLMs are being introduced to optimise results.

[Microsoft Guidance](https://github.com/guidance-ai/guidance) allows developers to build the logic of a prompt in a continuous flow, the [CO-STAR](https://chatgpt.com/g/g-RtLe9vFcq-co-star-prompt-engineer) framework offers a template to help structure prompts with clear instructions and other frameworks such as RISEN (Role, Instructions, Steps, End Goal, Narrowing) and TIDD-EC (Task Type, Instructions, Do, Don't) are creating canvas in which to insert the prompt and its context.

While so many tools and techniques are available, they often contain similar elements:

1) Defining a role or persona - telling the LLM what role we want it to adopt, to narrow down its domain of expertise, eg. ‘you are an expert in xyz’ 

2) Providing context - putting yourself in the shoes of someone who has no idea about the topic you’re about to bring in. What would you tell them? What do they need to know to better understand the setting.

3) Choosing your verb: tasks/instructions - which action(s) do you want the LLM to execute? If there are various verbs that could complete the same task, consider each carefully and in what ways they differ. Does one verb contain multiple meanings? Could that lead to ambiguity?
A prompt could contain several actions, which you may want to break down into different steps.

4) Format - whether that's json or a string, this part is particularly important to create pipelines and ensure consistency in responses.

5) Tone/Style - this will prove particularly useful in creative tasks, whether that's adopting an accent or a specific narrative style.

## How does that work in action?

First let’s take a look at how ChatGPT (GPT-4o) responds to: ```It’s getting late, don’t you think?``` 
![My Image]({{ site.github.url }}/hsauve/assets/prompt-engineer/gpt-late.png "ChatGPT's response to a query")

With zero context provided, ChatGPT gets philosophical. Interestingly enough however, the LLM is prompting me to say what's on my mind.
Now let's formulate that again with the context it needs to provide a better suited and more appropriate response. We'll use the RISEN method for this exercise.

~~~
Role: Close friend 

Input: It’s getting late, don't you think?

Steps: Consider the following elements: We’re at a party, it’s 2 a.m and I ask you the above {input}. You know that I love a good night sleep and you have seen me yawning ostensibly for the past 20 minutes.

Expectation: Your task is to understand the underlying meaning of {input}, and based on the context, provide me with an appropriate answer.

Narrowing: Your answer needs to be no more than three sentences.
~~~

![My Image]({{ site.github.url }}/hsauve/assets/prompt-engineer/improved-gpt-late.png "ChatGPT's improved response")

With a bit more context, ChatGPT gets me. Well-deserved sleep it is!

## Iterative prompting

Interacting with LLMs is still very new and we are continuously learning how to steer them towards desired outputs, so although LLMs are extremely powerful, they still need human guidance to provide the best results.
 
Prompt engineering is not an exact science and randomness and variations in responses are to be expected. Trial and errors are part of the discipline so a lot comes down to experimenting different ways to express an idea, refining and repeating.

The unpredictable behaviour of AI systems is also what makes them vulnerable to security issues such as [prompt injection attacks](https://blog.scottlogic.com/2023/11/03/spy-logic.html). This underscores the necessity for continuous evolution and innovation in testing to [ensure the security of Generative AI](https://blog.scottlogic.com/2024/07/08/beyond-the-hype-will-we-ever-be-able-to-secure-genai.html). 
