---
title: 'Building Scottbot: an AI Chatbot for Scott Logic'
date: 2023-10-23 14:00:00 Z
categories:
- dscarborough
- Artificial Intelligence
tags:
- Testing
- LLM
- Artificial Intelligence
- LangChain
- Blog
- GPT
summary: Teething troubles with our nascent chatbot
author: dscarborough
---

## **The Idea**
Even before all the buzz and excitement of ChatGPT, we had been [experimenting with AI]({{ site.github.url }}/category/ai.html). However, like many others, we have recently dialled up our applied AI Research and Development. After developing the [proof-of-concept chatbot for a major retail bank]({{ site.github.url }}/2023/07/26/how-we-de-risked-a-genai-chatbot.html), we decided to turn our focus inward and develop an AI assistant specifically for our own company’s use.  

In doing so, we wanted to learn the benefits, limitations and risks of integrating Large Language Models (LLMs) with other internal systems, while also creating a useful tool for Scott Logic employees. Thus, Scottbot was born! 

## **The Architecture**
While the banking chatbot combined an LLM with a Knowledge Graph and custom orchestration in Python, we’ve used other technologies for Scottbot. We opted for a more lightweight approach, utilising LangChain for natural language capabilities and vector database technology for knowledge storage and retrieval. We also decided to integrate Scottbot with Microsoft Teams to make it easy for people to use alongside their day-to-day Teams conversations with colleagues. 

[LangChain]({{ site.github.url }}/2023/05/04/langchain-mini.html) allowed us to bootstrap conversational abilities rapidly and in a potentially flexible manner. While we could have used an LLM directly, we were initially unsure which one would give the best results for this use case and so we wanted some abstraction from the underlying model. LangChain provided a single uniform interface under which several different LLMs could be plugged in, allowing us a degree of future flexibility. Our first choice was to go with GPT 3.5 Turbo from OpenAI, but we are exploring and experimenting with different LLMs that offer different performance vs cost trade-offs (watch this space for a separate blog on that topic in the future!). 

## **The Brief**
The remit was to produce a chatbot that employees would find useful – initially by answering questions about our company, but we have lofty goals for what it can do for employees in the future. It’s important to note before we proceed that this is all for internal Scott Logic use cases and isn’t being used on anything sensitive or client related.  

To start with, we decided to plug several data sources and tools into the back end for the LLM to use, should it see fit. These were: 
 
* Google search tool
* DuckDuckGo search tool
* Wikipedia data source
* Calculator tool (LLMs are notoriously bad at calculations)
* Scott Logic Confluence data source (non-sensitive parts), provided in the form of
a vector database

We tagged each tool with a description so that the LLM-powered agent could decide which was the appropriate tool to use, and we primed the bot with a “system prompt” to give it a sense of overall context. This system prompt took the form of a set of behavioural instructions, written in English, which affects the overall behaviour of the system:

> *"Scott Logic is a software company. You are part of the Scott Logic organization, and all your users are Scott Logic employees and are your colleagues. If the users do not provide context, assume questions relate to Scott Logic and try to retrieve it from Scott Logic's Confluence pages. Always cite all of the Scott Logic Confluence sources. Only use the Scott Logic Confluence pages for information about Scott Logic."*

Scottbot now had its raison d'être.

## **The Demo**
In August, one of the key members of the team, Gokberk, presented the alpha version of Scottbot at NatWest as part of our Open-Source London series – see the video below for a demo of the early version. 
[![Scottbot Open-Source London](http://img.youtube.com/vi/hzjm2mPI9qQ/maxresdefault.jpg)](http://www.youtube.com/watch?v=hzjm2mPI9qQ "Scottbot Open-Source London")

## **The Excitement**
We released this alpha version of the system to a limited set of individuals. The initial response was very favourable. People could type in general queries and the bot would use Google, or DuckDuckGo if the user expressed concerns about privacy, and return reasonable results. Sometimes the tool would not even feel the need to search and produce a perfectly satisfactory answer on its own, purely from its innate training. When asked about Scott Logic, the bot would usually resort to the vector database and produce a reasonably relevant response.

Unfortunately, our initial excitement was short-lived! 

## **The Frustration**
It soon started to become clear that Scottbot was unable to answer certain questions about Scott Logic, even though we knew that the answers to those questions were clearly in the Confluence pages. Moreover, the bot was inconsistent, sometimes getting the right answer but sometimes preferring to invent an answer without referring to the Confluence tool at all. These “hallucinations” are a notorious feature of LLM behaviour – and going back to the [retail banking chatbot]({{ site.github.url }}/2023/07/26/how-we-de-risked-a-genai-chatbot.html) – were avoided through the use of a conversational ontology powered by a Knowledge Graph.  

We needed an alternative approach to reduce the risk of hallucinations as trying to rely on a fixed version of the LLM with the temperature set to zero wasn’t cutting it (for "temperature", read “creativity" in this context). Crucial to this alternative approach may be the ability to control the seed value (something you do have control over with self-hosted Open Source LLMs) – this is something we are aiming to validate in the near future. 

We tried changing certain parameters, processing the Confluence pages in a different way, and a few other things, but it soon became evident that improving something would break something else, and our subjective view of its performance was insufficient. It had become a frustrating game of “whack-a-mole” with no magic bullet that would just make things better. 

## **The Testing Framework**
This nondeterministic behaviour created challenges for testing the performance of Scottbot (as it does for most LLM-based applications). We knew we needed to get more formal about the measurement of performance, but this was going to need a novel approach. So, we set about creating a test framework (a separate blog on this is coming soon) and populated it with some model questions and answers. Our framework would feed in the question, retrieve the answer and then use another LLM to decide whether that answer was similar to what was expected. 

We also produced a second, more conventional type of test, where we would provide a question and a string that the bot’s answer should contain – for instance, a link to a Confluence page when asked about a Scott Logic topic. This second type of test would be cheaper to run as the output would not need to be “marked” by another LLM. 

At this point, we had a baseline. There was some variability in the pass rate from run to run, but that was in the region of 5%. Our overall pass rate was about 65%, and it was always the same tests that would flip between pass and failure. 

## **The Improvement**
Once we had our baseline, we started to get a consistent view of the class of question the bot was having difficulty answering. We looked at the Confluence pages involved and spotted a common theme, which allowed us to make a specific improvement to the way the Confluence pages were ingested. We now have other types of question that the bot struggles to answer, and we have a pipeline of work off the back of this. 

## **The Future**
We intend to improve the quality of Scottbot in the short term by:

* Trying different LLMs in the backend
* Experimenting with multiple LLM invocations to produce a single answer
* Processing the Confluence data in a number of different ways
   * Ingesting the data in larger chunks to retain more context.
   * Ingesting the data in different formats to answer different types of questions. Some questions may demand a very specific answer, but others may entail listing all the pages that fulfil a set of criteria.
   * Weighting the pages by metrics, such as the number of views or edits, the date of the last edit or even who the author is.

There will no doubt remain questions Scottbot cannot answer and so we’ll need to make a subjective judgement as to when it has achieved a sufficient level of quality. At that point, we’ll start to investigate pulling in data from other sources, such as our sales pipeline documents (pdfs on shared drives), Kimble, and Salesforce. 

Ultimately, we’d really like Scottbot to be able to help with filling in timesheets or helping with travel requests and expense claims. But we have a bit more to do on the basics before we can get to that level of sophistication. We are also aware that this area is evolving rapidly, and we are fully prepared to throw away parts of what we have built as new solutions come on the market – both open source and proprietary, like Microsoft Co-Pilot. But we see value in more deeply understanding this technology (and how it integrates into other tech) ourselves and managing some of the risks of allowing our employees to use this technology day to day. 

## **Postscript**
One other maxim that this project has resurrected is "Garbage in, garbage out". It's clear that our Confluence needs a little maintenance, and while changing the inputs to improve our pass rate would be somewhat underhand, the bot has highlighted some of the areas where one of our most important data assets is in need of some polish.
