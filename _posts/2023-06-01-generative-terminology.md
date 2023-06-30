---
title: A guide to Generative AI terminology
date: 2023-06-01 00:00:00 Z
categories:
- Artificial Intelligence
- ceberhardt
summary: Generative AI is moving at an incredible pace, bringing with it a whole new
  raft of terminology. With articles packed full of terms like prompt injection, embeddings
  and funky acronyms like LoRA, it can be a little hard to keep pace. For a while
  now I've been keeping a notebook where I record brief definitions of these new terms
  as I encounter them. I find it such a useful reference, I thought I'd share it in
  this blog post.
author: ceberhardt
image: ceberhardt/assets/featured/books.jpg
---

Generative AI is moving at an incredible pace, bringing with it a whole new raft of terminology. With articles packed full of terms like prompt injection, embeddings and funky acronyms like LoRA, it can be a little hard to keep pace. For a while now I've been keeping a notebook where I record brief definitions of these new terms as I encounter them. I find it such a useful reference, I thought I'd share it in this blog post.

## The basics

If you're already familiar with the basics of AI you might want to skip this section ...

 - **Artificial Intelligence (AI)** - the development of computer systems that appear to have some form of intelligence, allowing them to perform tasks that usually require human expertise. This is a broad field, with AI models tackling various tasks including visual perception, language processing and speech recognition.
 - **Neural network** - sometimes called artificial neural networks (ANN), these are a method of developing artificial intelligence by modelling the brain. They are comprised of numerous (sometimes billions) of nodes called perceptrons, which are connected together into a network. You'll also find people referring to a neural network as a model.
 - **Parameters** - each of the connections between perceptrons have an associated weight, which is a single model parameter. The neural network functions by propagating values through the layers of network, with the parameters governing how these various values are combined. Model size is often measured in terms of the number of parameters it has.
 - **Model architecture** - complex AI models often have various discrete components, each of which are a neural network, that have a specific function. Examples architectures include convolution networks, transformers and recurrent networks. 
 - **Training** - a process whereby large quantities of data are presented to the neural network, with the quality of its output evaluated in some way. Based on this evaluation the parameter values are tweaked to produce a better output. The training process for large models involves vast training datasets (many gigabytes of data), and takes weeks or months to process.
 
## Generative AI

AI models can be used for a wide range of tasks, for example sentiment analysis, where the model determines whether a passage of text is positive, negative or neutral. Recently there has been a lot of buzz around generative AI, which is quite a specific type of AI system

 - **Generative AI** - an model that is capable of generating media, typically text or images, based on text-based input (a prompt). Recent models are quite capable of generative text and images that are of comparable quality to those produced by humans.
 - **Large language Model (LLM)** - generative AI models that work with, and on human language, taking both text as an input, in what is termed a prompt, and generating text output. There isn't really a formal definition of what makes a model 'large', but typically they will have billions of parameters. LLMs present a paradigm shift, previously models had architectures and training regimes focussed on specific language tasks (e.g. translation, sentiment analysis), with LLMs the training dataset is not focussed on a specific task, and is vast. As a result, the LLMs are capable of performing a wide range of language tasks, based on a suitable prompt.
 - **Generative pretrained transformers (GPT)** - a particularly popular LLM architecture, introduced by OpenAI in 2018. The GPT-3 version, release a couple of years ago to much excitement, has 175 billion parameters and was trained on 570GBytes of text and various other datasources. The training likely took around a month to run. Notably, OpenAI are now asserting that 'GPT' is their brand, and are trying to trademark it!
 - **ChatGPT** - the GPT class of models are stateless, they retain no memory of previous responses to prompts. Introduced in 2022, ChatGPT provides a conversational interface, where the model retains the conversation state, allowing it to answer follow-up questions. 

Alongside ChatGPT, other notable models include DALL·E, which creates images from text prompts and Stable Diffusion, its open source counterpart.

## Under the hood

In this section, I'll touch on a number of more technical terms.

 - **Token** - neural networks are numerical algorithms, therefore we need away to encode text into numbers to feed passages of text into the model (and perform the equivalent decode for the output). This process is called tokenisation. With GPT-3, tokens may be letters, groups of letters, or whole words.  For example, the sentence "this is a test" is encoded using a single token for each word `[5661, 318, 257, 1332]`, whereas the word "intermingled" is encoded as three tokens `[3849, 2229, 992]`
 - **Embeddings** - similar to tokens, embeddings are another way to encode text as numbers. However, there are a few  differences, embeddings can represents words, sentences or whole passages of text. But more importantly, embeddings capture the semantics (meaning) of the text that is encoded. As a result, two words with similar embeddings have similar meaning. 
 - **Attention** - the GPTs transformer architecture allows it to use a novel concept called self-attention, described in the paper ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762). Given a long passage of text, the model learns the relationships between various words in the sequence, giving a better understanding of overall context.
 - **Alignment** - the training datasets for LLMs isn't curated in any great detail. What this means is that the models will have been exposed to content that results in undesirable output (racism, bias, aggression and more). Alignment is a process whereby additional training is applied to steer the model towards certain ethical principles.
 - **Foundational model** - models that are trained on a broad dataset, making them suitable for a broad range of use cases. The process of creating a foundational model, through training cycles, is expensive and time consuming. The GPT-n series of LLMs can be considered foundational models.
 - **Fine tuning** -  a technique where a (foundational) model that is trained on a generic dataset, has additional training applied in order to gain more specific capabilities. For example, fine tuning for a specific domain (finance) or a private dataset. The fine tuning process is far more cost effective than retraining an LLM from scratch.
 - **Reinforcement Learning from Human Feedback (RLHF)** - a popular technique for model alignment is to use human feedback to train a reward model, which in turn is used to fine-tune an LLM. 
 - **low rank adaption (LoRA)** - this is a fine tuning method that consumes less memory and resources, allowing models to be tuned more quickly and cost effectively
 - **multi-modal** - most models take textual input and provide output in the form of text or images. Multi-modal models are able to handle mixed media inputs, for example, you can ask questions that involve both text and images.
 
## Practical Generative AI

These are some of the terms that you'll hear when people apply Generative AI to practical problems.

 - **Prompt** - this is the textual input supplied to the LLM. It can be brief, for example "What is the capital of England?", or a long passage of text describing a problem or task in detail. A practical consideration when creating a prompt is the prompt-length limit for the model you are using, which is measured in tokens. For example GPT-3 had a prompt length of 2,049 tokens, which is roughly 1200 words.
 - **Completion** - the output of an LLM, in response to a given prompt, is called a completion. The term derives from the way prompts are phrased, for example, the above prompt example is often phrased as "Q: What is the capital of England? A:", where the LLMs task is to complete the sentence with the answer.
 - **Hallucination** - models are trained on large quantities of data, giving them the ability to recall an impressive number of facts (e.g. names of presidents, capital cities and much more). This often gives the user the impression that an LLM is some form of database or that it performs web queries. However, this is not the case, the factual information that models digest is represented in a much more abstract form in the billions of model weights during the training process. As a result, these models don't have any knowledge of what is right or wrong, instead they just know what 'sounds' right, or more correctly, what is the statistically most likely completion. This leads them to make statements that are quite believable, but are factually incorrect or entirely fictitious, these statements are called hallucinations.
 - **One-shot / few-shot** - a prompt that simply asks a question is called a one-shot prompt. For certain problems, performance is improved by providing multiple examples that help the LLM better understand the task.
 - **System prompt** - when an LLM is supplied with user input, for example in chatbot applications, this input is typically combined with a system prompt that defines the overall behaviour and described characteristic. There have been numerous cases where system prompts for commercial AI tools have been leaked (via prompt injection), giving a fascinating insight into how they are designed. As an example, GitHub Copilots system prompt starts "You are an AI programming assistant, When asked for you name, you must respond with 'GitHub Copilot', Follow the user's requirements carefully & to the letter, ..."
 - **Prompt engineering** - this describes the task of developing effective prompts. While it is termed 'engineering', to my mind it is an interesting blend of technical writing and requirements definition.
 - **Prompt injection** - where a platform or product, such as a chatbot or GitHub Copilot, uses LLM technology, it may be possible to subvert its behaviour by providing inputs that override the prompt or system prompt. Using this technique it is possible to get the model to reveal internal information, such as the system prompt, or undo alignment training - a process which is known as jailbreaking.
 

## Reasoning capabilities
 
The final few terms I want to cover relate to the more novel applications of LLMs, where they are being used as a general-purpose reasoning engines.

 - **Chain-of-thought** - this is a prompting technique that improves the reasoning capability of LLMs. The prompt encourages the model to tackle tasks and answer questions by breaking them down into smaller discrete steps. These steps may also involve collecting additional data via web searches. More recently a tree-of-thought technique has been developed, which allows branching and back-tracking within the logical steps.
 - **Agents** - a broad term used to describe versatile, general purpose AI tools, such as Siri. Recently there have been numerous LLM-based agents developed using the chain-of-thought architecture, examples include LangChain and AutoGPT.
 - **Plugins / tools** - LLM agents often have the ability to use 'tools' by accessing APIs, giving them powerful new capabilities. Notably, an LLM, given the ability to perform web searches, can access data that was not present in its training dataset, significantly reducing the risk of hallucinations.
 - **Retrieval Augmented Generation (RAG)** - a term that specifically describes the process of supplementing a prompt with additional information based on web searches or queries of internal / private documents.

With all these new terms cropping up, I've found it very useful to create my own glossary. Hopefully you've found it useful too. If I've missed anything, or you want to submit a correction, this blog is hosted on GitHub, [pull requests](https://github.com/ScottLogic/blog/blob/gh-pages/_posts/2023-06-01-generative-terminology.md) are welcome!

Thanks, Colin E.
 
 

 
 


