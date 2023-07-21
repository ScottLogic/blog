---
title: How we de-risked a GenAI chatbot
date: 2023-07-21 16:27:00 Z
categories:
- Tech
tags:
- artificial intelligence
- ai
- generative AI
- GenAI
- ChatGPT
- chatbot
- Large Language Models
- LLM
- Knowledge Graph
summary: I was part of a Scott Logic team that developed and delivered a Proof of
  Concept (PoC) for a major retail bank which demonstrated high potential business
  value and showed how GenAI could be reined in as part of a range of options to mitigate
  risk. In this post, I provide an overview of how it worked.
author: shamiltonritchie
---

After riding the initial wave of excitement about Generative AI’s business potential, enterprises have been becalmed by the risks. My colleague Oliver Cronk has set out [some of the principal risks in this blog post](https://blog.scottlogic.com/2023/05/04/generative-ai-solution-architecture.html).

However, the initial excitement was entirely justified – the business potential of Generative AI (GenAI) is vast. So, how do you mitigate the risks and harness the potential?

I was part of a Scott Logic team that developed and delivered a Proof of Concept (PoC) for a major retail bank which demonstrated high potential business value and showed how GenAI could be reined in as part of a range of options to mitigate risk. In this blog post, I’ll provide an overview of how it worked.

## The hypothesis to be tested

The client wished to test the hypothesis that a chatbot which combined a Large Language Model (LLM) with a Knowledge Graph could become, in effect, the ‘brain’ of the bank. The theory was that the bot would be able to interact with the bank’s systems and with the user so as to enrich the bank’s understanding of the customer and connect them to the most suitable products and services.

Knowledge Graphs, to quote the [Alan Turing Institute](https://www.turing.ac.uk/research/interest-groups/knowledge-graphs), “organise data from multiple sources, capture information about entities of interest in a given domain or task (like people, places or events), and forge connections between them.”

It was hypothesised that in combination with the Knowledge Graph, the LLM (e.g. ChatGPT) would enable the bot’s interactions with the user to flow like human conversation, with the capacity to jump from topic to topic, rather than following the linear flow of a traditional chatbot.

### Anticipated business benefits

The client’s hypothesis was not merely that the combination of Knowledge Graph and LLM could deliver more ‘natural’ customer interactions. It was also that this new model of chatbot could accrue knowledge and make connections across systems – with a whole range of customer and business benefits. 

The ‘golden profile’ – a Holy Grail of customer relationship management – could be within reach. Given the amassed knowledge at the bot’s disposal, customers might no longer be passed from pillar to post between departments in carrying out their banking tasks. Fraud prevention could be enhanced by a bot that can identify unusual behaviour in customers and make rapid assessments based on a wide range of available data.

That’s just to give a flavour of its potential value to businesses. With our appetites whetted, let’s take a high-level look at how the technology works.

## The role of the Knowledge Graph

At a high level, traditional chatbots direct conversations with users along a single tree of branching logic. Starting from the user’s initial response – the root node – the conversation flows along a branching path to a ‘leaf’ somewhere on the tree, based entirely on all the preceding responses. To the user, this can feel artificial and frustrating as there’s no potential to jump ahead or switch conversational direction, and no capacity to ask the chatbot to explain a point that isn’t clear.

To extend the metaphor, the Knowledge Graph connects together a forest of trees of various sizes. In this way, the conversation with the chatbot can pursue journeys directed by the individual needs of the user, rather than forcing the user to follow the logical constraints of the chatbot. If you think of any long questionnaire or form you’ve ever had to complete, they’re typically broken up into sub-sections, some of which are applicable to you, some of which are not; when any section is not applicable, you’re directed to move on to a later section of the form. In the same way, a larger overall conversation with a chatbot can be broken down into a whole network of sub-conversations.

### Guiding highly focused customer conversations

With the Knowledge Graph directing the conversational logic, a customer enters the chatbot conversation with a particular goal in mind – for example, to find out whether they might be eligible for a loan. The conversation about that goal will have a range of potential outcomes depending on the customer. It’s the task of the chatbot to gain insights that will aim to fit the customer into the most appropriate pre-determined profile, one that is suited to particular products and services.

The customer’s root question will determine which set of interconnected, sub-conversational ‘trees’ the chatbot should include in the conversation. The bot then pursues the branching logic of each tree in turn until the sub-conversation reaches an end node, at which point the bot moves on to the next sub-conversational tree. With each interaction, the Knowledge Graph’s logic is designed to prompt the best next question – i.e. whichever question will prompt a response that eliminates the most potential customer profiles that aren’t relevant to the customer.

To use the loan example, one sub-conversation might be about whether the customer has anyone who depends on them financially; if the answer is yes, the bot will ask for more information on the dependants; if the answer is no, the bot might then move on to a sub-conversation about whether the customer has any credit cards, and so on.

## The role of the LLM

In this architecture, the LLM plays the role of translator – not just in terms of holding a ‘human’ conversation with the customer, but in terms of translating the customer’s responses into data that the Knowledge Graph can process.

The Knowledge Graph is seeking Boolean, true/false logic. It can’t deal with the ambiguity of language – but the LLM can. Using its probabilistic model, an LLM like ChatGPT can compose and send natural-sounding messages to the customer, and it can “understand” the customer’s responses. I’m straining the definition of “understand” there, but what I mean is that it can analyse a given response and encode its text into code (in JSON format, in our proof of concept) which the Knowledge Graph can then process and categorise. Having processed the response, the Knowledge Graph presents in code form the best next question to ask the customer, which the LLM translates back into natural language.

The LLM is key to the natural feel of the customer interactions in numerous ways. Not only can it phrase things naturally, it’s also pivotal to the bot’s ability to let the conversation flow naturally, through its interactions with the Knowledge Graph. For example, if the customer’s answer to a question is effectively the same as the previous one, the Knowledge Graph will have gained no new data; this will indicate to the LLM that it needs to rephrase the question. If the customer takes the conversation off in a whole new direction, the Knowledge Graph will offer up to the LLM the new sub-conversations to pursue.

## Building up knowledge about the customer

While the Knowledge Graph interacts with the LLM to guide the conversation with the customer, it simultaneously builds up a graph of the customer’s analysed responses. This aggregate data helps to identify the customer with the most suitable profile, allowing best-fit products and services to be suggested; but that data can also be stored for future interactions with the customer, whether via chatbot or human advisor.

In this way, the Knowledge Graph has the capacity to recall previous conversations with a customer and use the LLM to check whether that data is still current. For example, a customer may have shared information about their salary in a conversation several months ago; the Knowledge Graph can prompt the customer to check whether anything has changed since then.

Even within the same user session, the aggregation of customer data can help to streamline the conversation. For example, the bot may ask the customer about their savings balance and receive a response that covers instant-access savings, along with ISAs and other savings products. As the LLM feeds this composite response into the Knowledge Graph, it whittles down the subsequent questions to ask the customer.

Not all of the data needs to be sought from the customer. The Knowledge Graph can pull data from other systems. For example, if it needs to know the customer’s current account balance, it can encode a query that draws that information from the relevant bank database, and then feeds it back into the Knowledge Graph to prompt the next question.

## De-risking the bot’s interactions

### Constraining the conversation

Central to the design of our Proof of Concept chatbot was the tethering of the LLM to the Knowledge Graph. While the LLM technology has been trained in how to sound human through exposure to real human interactions on the world wide web, the ‘script’ that it follows in the customer interactions is directed by the Knowledge Graph. In a given user session, the LLM is effectively enveloped within the context of that particular customer, constrained by the requests from the Knowledge Graph to seek specific data from the customer or from the bank’s systems.

The Knowledge Graph has its ‘forest’ of sub-conversational ‘trees’ and while they’re not as limited as a traditional chatbot’s single tree of branching logic, they’re still ultimately pre-determined. Through the LLM, the Knowledge Graph still only has a finite set of questions to pose. A malicious actor seeking to hack the system will be presented with questions that are individual to them, pre-programmed into the Knowledge Graph. They can’t ask the bot to expose data on other customers or anything else outside of the Knowledge Graph’s purview.

### Walling in the bot

My colleague Oliver Cronk’s blog post on [GenAI solution architecture](https://blog.scottlogic.com/2023/05/04/generative-ai-solution-architecture.html) touches on the additional layers of security that can de-risk this approach to GenAI chatbot design. As he explains, the LLM is effectively walled in and isolated from any security-critical aspects of the architecture. The full conversation from each user session is encoded into the Knowledge Graph and stored as an auditable log to enable incident investigation, root cause analysis, and performance fine-tuning. In addition, filtering of both inputs and outputs of the LLM’s interactions can mitigate the risk of inappropriate requests being made of the bot, and inappropriate responses being returned by the bot.

## Find out more

I hope you’ve found this overview of our PoC chatbot useful. We’ll be sharing more of our thinking in this area soon, including a white paper on de-risking generative AI in highly regulated environments. Visit our page on how to [Harness the potential of AI](https://www.scottlogic.com/harness-ai-business-potential) for more.