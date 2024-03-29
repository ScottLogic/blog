---
title: OpenAI Outage November 2023
date: 2023-11-16 00:00:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
- llm
- scottbot
- jwarren
summary: In the light of OpenAI’s system outage, a ripple of unprepared AI powered
  systems crashed across the world. How can we best secure our LLM based applications
  against such occurrences?
author: jwarren
image: "/uploads/Open%20AI%20outage%20quote%20card-38ac49.png"
---

In the light of OpenAI’s system outage, a ripple of unprepared AI powered systems crashed across the world. There has been a gold rush towards GenAI ever since ChatGPT’s release in November 2022, with many attempting to understand and tame the beasts that are Large Language Models  (LLM). So far, OpenAI’s models have generally come out on top as the tools of choice. However, the burden of OpenAI’s popularity has at times become too great for their servers to bear.

At OpenAI’s first developers’ conference on 6th November, the release of models boasting greater power at lower costs was announced. A fresh wave of eager developers rushed to their computers to try the new technology and demand for OpenAI’s services shot through the roof. At the same time, OpenAI received an immense entourage of traffic, said to be ‘reflective of a DDoS attack’ which subsequently politically-charged hacktavists have claimed responsibility for. No matter whether the cause was a premeditated attack, or a frenzy of demand, we should all accept Sam Altman’s words, OpenAI's CEO, admitting we should expect “service instability in the short term”. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">usage of our new features from devday is far outpacing our expectations. <br><br>we were planning to go live with GPTs for all subscribers monday but still haven’t been able to. we are hoping to soon. <br><br>there will likely be service instability in the short term due to load. sorry :/</p>&mdash; Sam Altman (@sama) <a href="https://twitter.com/sama/status/1722315204242149788?ref_src=twsrc%5Etfw">November 8, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


Here at Scott Logic, we have been working on an artificial intelligence chat bot called Scottbot. Though the project is still relatively new, we envisage this bot will help our employees with their day to day work. If you would like to find out more about the project, have a look at [this blog](https://blog.scottlogic.com/2023/10/23/building_scottbot_an_ai_chatbot_for_scott_logic.html). Our bot is powered by OpenAI’s GPT-3.5 Turbo, where we have embraced the challenge of an inferior model as a low cost and sustainable solution. Like so many bots across the globe that use GPT3.5 or GPT4 variants, it fell victim to the OpenAI system outage on the 8th November.

OpenAI’s crash serves as a gentle reminder that we need to safeguard our AI applications with failsafes. Though OpenAI offers impressive products, the company has yet to reach its full maturity, so we can’t expect its systems to be completely stable. Nonetheless, for many LLM-powered applications, OpenAI’s services remain the AI brain and therefore act as a single point of failure. This technology being still relatively new for the masses, means most applications using these LLMs are research projects and thus pose no serious problems when an outage arrives (except mild annoyance). However, as AI seeps into our everyday life, we must be careful to have fail safes in the case of a system outage, certainly in the context where lives are at stake, such as driverless cars or [medical operation tools](https://www.facs.org/for-medical-professionals/news-publications/news-and-articles/bulletin/2023/june-2023-volume-108-issue-6/ai-is-poised-to-revolutionize-surgery/) which are areas where AI is hoped to revolutionise. 


**What could we do?**
The first option we could explore is to have backup LLMs. Though OpenAI’s LLMs transcend the market in their accuracy and capabilities, there are many LLMs in development by key players across the globe. If we receive timeout errors from OpenAI, we can for example have our system switch seamlessly to [Anthropic’s Claude 2](https://www.anthropic.com/index/claude-2) (backed by Amazon), and even have [Cohere’s LLM](https://cohere.com/) as a secondary back up. Pricing should not be a point of worry since most LLMs are pay as you go, however there are still some significant drawbacks to this approach. The switch of LLM would come at the detriment of quality if the backups are of inferior ability (which all the alternatives currently are) and furthermore may cause severe problems if these LLMs respond differently to the bespoke prompts. Would we have to write a separate suite of prompts and tests for each backup? In the future, I’m sure that the quality of competitor LLMs will exponentially increase, so only tailoring prompts and tests for each backup is of long term concern.

Another alternative is for developers to leverage open source models to create their own local LLM. This could offer better availability (depending on the underpinning architecture) whilst giving much greater control of its training and the parameters held and we should have less concerns in terms of privacy or intellectual property loss. For example, Meta’s LLaMa 2 and Mosaic’s MPT-7B are both commercially viable open source LLMs, whose model can be pulled from Github and tweaked to our liking.  However, due to the higher scale costs and low level technical nature of this approach, it is likely to yield a significantly less sophisticated bot unless much time and energy is spent on fine-tuning these models. Furthermore it could even be more expensive than calling a prepackaged LLM due to the necessity of hosting the model. In essence, this option would require considerable resources to be a quality alternative. 

In any and every case, it will of course be important to handle errors gracefully. This is nothing new when building applications that leverage APIs, however displaying errors, and signalling to users is even more imperative when the world leader on the matter is a relatively small company in the process of rapid expansion. Moreover, if different LLMs are used as a backup, perhaps a message displaying the model being used could be displayed, signalling to the user what service they can expect. Consider how a phone displays its network connection, if you have 4G you can expect a quick service streaming videos, whereas if you have EDGE you know to only use the internet for text based media. We could always display the LLM that we are using for each request, and with time, users will understand what they can or cannot do on each LLM. Perhaps one day, we could give the user free choice on what LLM will be powering their application. 

In conclusion, whilst handling errors smoothly isn’t a new concept,  more consideration is needed for when things go wrong in GenAI powered applications. We should be quick to apply fail safes to our 3rd party (AI) API powered applications, considering all the possibilities and what is right for our application. Combine this with exception handling and we can build applications that users trust and can rely upon. 
