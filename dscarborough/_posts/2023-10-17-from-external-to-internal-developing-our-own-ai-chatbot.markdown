---
title: 'From External to Internal: Developing Our Own AI Chatbot'
date: 2023-10-17 14:00:00 Z
categories:
- Artificial Intelligence
tags:
- Testing
- LLM
- Artificial Intelligence
- LangChain
- Blog
- GPT
summary: The Scottbot saga - episode one
author: dscarborough
---

## **The Idea**
After developing a proof of concept chatbot for a major retail bank, we at Scott Logic decided to turn our focus inward and develop an AI assistant specifically for our own company's use. Thus, Scottbot was born.

While the banking chatbot combined a large language model with a knowledge graph to serve customers, Scottbot uses different technology under the hood. We opted for a more lightweight approach, utilizing LangChain for natural language capabilities and vector database technology for knowledge storage and retrieval.

LangChain allowed us to bootstrap conversational abilities rapidly and in a potentially flexible manner. While we could have used an LLM directly, intially we had no idea which one would perform the best. LangChain provided a single uniform interface, under which several different LLMs could be plugged in, and so allowed us a degree of future flexibility. Initially, we chose to go with GPT 3.5 Turbo from OpenAI, as the intention was always to release the bot to a large audience, and the newer, and almost certainly better, GPT 4.0 would have been about 20 times the price, and hence prohibitively expensive.

The remit was to produce a chatbot that people would find "useful", so we decided to plug several data sources and tools into the back end for the LLM to use, should it see fit. These were:

* Google search tool
* DuckDuckGo search tool
* Wikipedia data source
* Calculator tool (LLMs are notoriously bad at 
* Scott Logic Confluence data source (non-sensitive parts), provided in the form of
a vector database

We tagged each tool with a description, so that the LLM could decide what was the appropriate tool to use, and we primed the bot with a "system prompt" to give it a sense of overall context. This system prompt took the form of a set of behavioural instructions, written in English, which affects the overall behaviour of the system: 

> *"Scott Logic is a software company. You are part of the Scott Logic organization, and all your users are Scott Logic employees and are your colleagues. If the users do not provide context, assume questions relate to Scott Logic and try to retrieve it from Scott Logic's Confluence pages. Always cite all of the Scott Logic Confluence sources. Only use the Scott Logic Confluence pages for information about Scott Logic."*

Scottbot now had its raison d'être.

## **The Excitement**
We released an alpha version of the system to a limited set of individuals. The initial response was very favourable. People could type in general queries and the bot would use Google, or DuckDuckGo if the user expressed concerns about privacy, and return reasonable results. Sometimes the tool would not even feel the need to search and produce a perfectly good answer on its own, purely from its innate training. When asked about Scott Logic, the bot would usually resort to the vector database and produce a reasonably relevant response. Unfortunately, our excitement was shortlived. 

## **The Frustration**
It soon started to become clear that Scottbot was unable to answer certain questions about Scott Logic. Moreover, the answers to these questions were clearly in the confluence pages. Also, the bot seemed to be inconsistent, sometimes getting the right answer but sometimes preferring to invent an answer, without referring to the confluence tool at all. (These "hallucinations" are a notorious feature of LLM behaviour.) This came as a surprise, as we were using a fixed version of the LLM and using it with its temperature set to zero (*for temperature read creativity in this context*).

We tried changing certain parameters, processing the confluence pages in a different way, and a few other things, but it soon became evident that improving something would break something else, and our subjective view of its performance was insufficient. It had become a frustrating game of "whack-a-mole" and there was no magic bullet that would just make things better.

## **The Testing Framework**
We knew we needed to get more formal about the measurement of performance, so we set about creating a test framework, and populating it with some questions which we felt it should be able to answer, along with some model answers. Our framework would feed in the question, retreive the answer and then use another LLM to decide whether that answer was similar to what was expected.

We also produced a second, more conventional type of test, where we would provide a question and a string that the bot's answer should contain, for instance a link to a confluence page when asked about a Scott Logic topic. This second type of test would be cheaper to run as the output would not need to be "marked" by another LLM.

At this point, we had a baseline. There was some variablity in the pass rate from run to run, but that was in the region of 5%. Our overall pass rate was about 65%, and it was always the same tests that would flip between pass and failure.

## **The Improvement**
Once we had our baseline we started to get a consistent view of the class of question the bot was having difficulty answering. We looked at the confluence pages involved and spotted a common theme, which allowed us to make some improvements to the way the confluence pages were ingested. We now have other types of question that the bot struggles to answer, and we have a pipeline of work off the back of this. 

## **The Future**
We intend to improve the quality of Scottbot in the short term by:

* Trying different LLMs in the backend
* Experimenting with multiple LLM invocations to produce a single answer
* Processing the confluence data in a number of different ways
   * Ingesting the data in larger chunks to retain more context.
   * Ingesting the data in different formats to answer different types of questions. Some questions may demand a very specific answer, but others may entail listing all the pages that fulfil a set of criteria.
   * Weighting the pages by metrics, such as the number of views or edits, the date of the last edit or even who the author is.

Once we have a improved the quality enough (ultimately there will always be a subjective aspect to this as questions will no doubt remain that Scottbot cannot answer), we'll start to look into into pulling in data from other sources, such as our sales pipeline documents (pdfs on shared drives), Kimble and Salesforce. 

Who knows? One day, Scottbot may even be able to fill in your timesheets for you! 

## **Postscript**
One other maxim that this project has resurrected is "Garbage in, garbage out". It's clear that our confluence needs a little maintenance, and while changing the inputs to improve our pass rate would be somewhat underhand, the bot has highlighted some of the areas where one of our most important data assets is in need of some polish.
