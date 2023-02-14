---
title: NLP for intent classification and entity extraction
date: 2023-02-14 11:33:00 Z
categories:
- Tech
- dnasonov
tags:
- ChatGPT
- Artificial Intelligence
- AI
- Prompt Engineering
summary: Our team embarked on a project to create a chatbot AI system using NLP for
  intent detection and entity extraction. After evaluating several NLP platforms,
  we ultimately chose OpenAI GPT-3 for its overall performance and context-aware capabilities.
  Integrating GPT-3 with neo4j allowed us to establish a strong and easily updatable
  knowledgebase for the chatbot.
author: dnasonov
---

# Intro
Recently, I had the opportunity to work on a project that was out of this world! (Well not literally, but close enough!). The goal was to create a **prototype of a chatbot** AI system with the ability to control the flow of conversation by gathering information and saving it in a **knowledgebase graph using neo4j**.  
To achieve this, we dusted off our NLP books, read some papers and put our natural language processing skills to the tests.
# NLP 101 - Intent Classification and Entity Extraction
Before we dive into the comparison of NLP platforms, let's take a moment to understand what **intent classification and entity extraction** are all about. Essentially, these NLP techniques are like playing a game of 20 questions with a chatbot. The chatbot asks questions to determine what the user **wants** (**intent**) and what specific **information** they're looking for (**entity**).
For example, if a user asks `"What's the weather like in Paris today?"`. The chatbot's job is to identify the user's intent as `"weather inquiry"` and extract the entity `"Paris"`.
In a nutshell, NLP is like being a detective, but with AI. And who doesn't love solving a good mystery? With basic understanding of NLP, let's dive into the comparison of NLP platforms!
# Platforms Comparison - The Battle of the Bots!
In building the chatbot prototype, we had to find the perfect NLP platform to bring out creation to life. After much research and testing, we narrowed down our options to the following heavyweights:

 - Amazon Comprehend: While it was a strong contender, the intent classification wasn't quite up to our standards right out of the box.
 - IBM Watson: Watson was a bit of a challenge as well, as we found that the intent classification wasn't working as seamlessly as we needed it to.
 - Azure Cognitive Services: This platform was straightforward and easy to set up, but it was quite basic and didn't support a chat-like system out of the box. It was mostly focused on intent classification and entity extraction.
 - AWS Lex: An interesting option would be AWS Lex if it could run seamlessly without its ecosystem. Of course, you could find workarounds using Lambda functions, but it felt like swimming against the flow.
 In the end, we decided to settle on OpenAI GPT-3 thanks to its context-aware capabilities (answering questions and providing useful information) as well as its output in JSON format.
 For example, a JSON response might have looked like this:
    {
      "intent": "weather_inquiry",
      "entities":[{entity_name: "city", entity_value: "Paris"}],
      "reply": "The current temperature in Paris is 2°C with scattered clouds"
    }
Keep in mind, working with OpenAI GPT-3 required some knowledge of prompt engineering and testing, but the end result was worth it.

| Feature | Amazon Comprehend | Azure Cognitive Services | IBM Watson | OpenAI GPT-3 | AWS Lex |
|---------|-------------------|--------------------------|------------|--------------|-------|
| Ease of use | Moderate (requires some knowledge of AWS) | Moderate (requires some knowledge of Azure) | Moderate (requires some knowledge of IBM) | Easy (very user-friendly API) | Difficult, (requires knowledge of AWS)
| Intent classification | [Yes, moderate ease of training](https://docs.aws.amazon.com/comprehend/latest/dg/how-document-classification.html) | [Yes](https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/conversational-language-understanding/quickstart?pivots=language-studio#train-your-model) | [Possibly, moderate ease of training](https://cloud.ibm.com/docs/natural-language-understanding?topic=natural-language-understanding-classifications) | [Possible](https://www.pragnakalp.com/intent-classification-paraphrasing-examples-using-gpt-3/) | [Yes](https://docs.aws.amazon.com/lexv2/latest/dg/build-intents.html) |
| Custom Models | Yes | No | Yes | No, but can be [fine tuned](https://beta.openai.com/docs/guides/fine-tuning) | Yes |
| Profanity filter | Using [Amazon Translate](https://docs.aws.amazon.com/translate/latest/dg/customizing-translations-profanity.html)| Using [Content Moderator](https://azure.microsoft.com/en-gb/products/cognitive-services/content-moderator/)| Limited (via [emotion classification](https://www.ibm.com/demos/live/natural-language-understanding/self-service/home))| Content filter, see [here](https://beta.openai.com/docs/api-reference/moderations/create) or [here](https://beta.openai.com/docs/models/content-filter)| Using [Amazon Translate](https://docs.aws.amazon.com/translate/latest/dg/customizing-translations-profanity.html)|
| Language Support | [Multiple](https://docs.aws.amazon.com/comprehend/latest/dg/supported-languages.html) | [Multiple](https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/conversational-language-understanding/language-support) | [Multiple](https://cloud.ibm.com/docs/natural-language-understanding?topic=natural-language-understanding-language-support) | Multiple | [Multiple](https://docs.aws.amazon.com/lexv2/latest/dg/how-languages.html) |
| Pricing | Pay-as-you-go [starting at $0.2 for 1k requests](https://aws.amazon.com/comprehend/pricing/) | Pay-as-you-go [starting at $5 for 1k requests](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/language-service/) | Pay-as-you-go starting at [$3 for 1k requests](https://www.ibm.com/uk-en/cloud/watson-natural-language-understanding/pricing#:~:text=Tier%201:%20USD%200.003/%20NLU,item%20for%20next%205,000,001+%20items) | Pay-as-you-go [at $0.02 / 1k tokens](https://openai.com/api/pricing/) | Pay-as-you-go [starting at $0.75 for 1k requests](https://aws.amazon.com/lex/pricing/)|
| Integration with other services | Yes (integrates with other AWS services) | Yes (integrates with other Azure services) | Yes (integrates with other IBM services) | No | Yes (integrates with other AWS services) |
Additional features| [Custom Classification](https://docs.aws.amazon.com/comprehend/latest/dg/how-document-classification.html), [Custom Entities](https://docs.aws.amazon.com/comprehend/latest/dg/custom-entity-recognition.html), [PII identification](https://aws.amazon.com/comprehend/features/?refid=a7f57dee-fc58-4084-9037-cb552d58a5d5#PII_Identification_and_Redaction) | [PII identification](https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/personally-identifiable-information/overview), [Entity Linking](https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/entity-linking/overview), [Custom Entity Recognition](https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/conversational-language-understanding/quickstart?pivots=rest-api)| Recognition of [Emotions](https://cloud.ibm.com/apidocs/natural-language-understanding#emotion), [Relations](https://cloud.ibm.com/apidocs/natural-language-understanding#relations); [Custom Entities](https://cloud.ibm.com/docs/natural-language-understanding?topic=natural-language-understanding-entities-and-relations) | [Fine tuning](https://beta.openai.com/docs/guides/fine-tuning), [Moderation](https://beta.openai.com/docs/guides/moderation/overview) | [Multi turn dialog](https://aws.amazon.com/lex/features/), [Intent and slot lifecycle management](https://aws.amazon.com/lex/features/) |

  

# Conclusion
In conclusion our team ultimately chose OpenAI GPT-3 as the best option for our chatbot prototype. It's strong performance in entity extraction and context-aware capabilities made it one of the best options for this project. Additionally, the integration of GPT-3 with neo4j allowed  us to build a knowledgebase that could be easily updated and queried. 
However it's important  to note that the current option might change in the future. In fact, building a chatbot AI system often requires a combination of several systems or layers to achieve the desired result.