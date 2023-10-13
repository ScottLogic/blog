---
title: 'Testing LLM-Based Applications: Strategy and Challenges'
date: 2023-11-08 00:00:00 Z
categories:
- Testing
- Tech
- Artificial Intelligence
tags:
- Testing
- LLM
- Artificial Intelligence
- Pytest
- Pytest-bdd
- LangChain
- Blog
summary: 
author: xchen
---

## New Challenges: Testing LLM-Based vs. Traditional Apps
As a testing professional with years of experience, I usually approach software testing with confidence. However, this time, in the face of testing a Generative AI powered, LLM-based chatbot software, I find myself confronting unusual challenges.

I compared testing a traditional application and found that the most significant challenge in testing LLM-based applications is the non-deterministic output result. Normally testers can predict the expected results for a traditional application. However, LLM-based applications always provide different responses, even with the same input. The unpredictable outcomes make traditional testing approaches, especially test automation, extremely difficult.

Another big difference is the cost. Typically, testers do not give much thought to the cost of testing in their daily work. Running regression tests, exploratory testing, or simple sanity checks only once or a few times doesn't significantly affect the expenses. However, testing non-open source LLM-based applications is a different scenario. LLMs work with tokens, breaking text into small pieces like complete words, subwords, or characters. The testing cost depends on the number of tokens used. In other words, the more queries made, the higher the testing expenses. As of April 2023, it costs $0.002 per query using GPT-3.5-turbo and $0.03 using GPT-4. 

Implementing throttles can help manage costs effectively. However, it's a double-edged sword as changing the throttling settings can impact the output quality, so setting appropriate throttles is crucial.

In addition to the mentioned non-deterministic nature and costs, ensuring compliance poses another significant challenge. The quality of query output heavily relies on the datasets used to train the model. As a result, it is nearly impossible to completely avoid legal breaches and bias. Providing inappropriate recommendations to end-users can not only damage the company or organisation's reputation but also lead to potential legal disputes.

## Testing Metrics to Evaluate LLM-Based Applications

LLM-based applications encompass a variety of implementation formats, each specifically designed to tackle different tasks. Some of the most common applications include chatbots for interactive conversations, code generation and debugging, abstractive or extractive summarization, text classification, sentiment analysis, language translation, and content generation. Different applications require specific test approaches to verify its qualities. 

The quality of LLM-based applications heavily relies on the quality of the model. A higher-performing model will undoubtedly produce more satisfying results. There are essentially two types of models. The first type is proprietary, such as OpenAI's GPT-3.5 and GPT-4, which appears as a black box to users but excels in handling complex tasks with higher performance. The second type is open source models, which may permit you to train them with your own specific data in addition to the language model, model version, and prompt parameters, such as temperature, will also be essential in influencing the eventual output.

The following testing metrics provide comprehensive measurements of the quality of LLM-based applications.

![Test_Scottbot_0.PNG](/uploads/Test_Scottbot_0.PNG)

## Testing Strategy on LLM-Based Applications

Researchers commonly utilise standard metrics to assess traditional language models. These metrics include Perplexity (PPL), BLEU, and ROUGE. However, these metrics are not typically applicable for evaluating applications in production that utilise LLM as a third-party service.

To assess the correctness of LLM-based applications, the test cases should encompass fundamental use cases tailored to the application, while also taking into account potential user behaviours. In simpler terms, test cases should reflect what users intend to accomplish. This customised application usually undergoes a fine-tuning process that involves adapting your own data, including domain-specific terminologies and knowledge, on top of an existing baseline LLM. The test cases should primarily address domain-specific scenarios.

### Use Case Study: Testing Scottbot

Regarding the test strategy for LLM-based chatbots, I will showcase the testing methodologies by using our customised chatbot, Scottbot, as an example. Scottbot is a Scott Logic domain-specific chatbot powered by GPT technology. It has access to Scott Logic’s internal Confluence pages. In addition, it utilises Google and Wikipedia to respond to queries in natural language. 

The main objective of testing for Scottbot is to guarantee accurate and meaningful responses to user queries. This involves system testing at various levels, with a focus on end-to-end scenarios. Functional testing is carried out through the pytest automation framework, supplemented by manual verification.Security testing primarily depends on manual verification to ensure Scottbot's robustness and compliance with legal and ethical requirements. Performance testing is currently not executed but remains a consideration for future assessments.

As we use pytest as the automation framework, pytest-bdd is a natural choice to give us a BDD style for all of our scenarios. As Scottbot is deployed on Azure, automated tests can be executed through its CI/CD pipeline. Azure also provides a dashboard for monitoring and reporting the test results.

Based on Generative AI's non-deterministic feature, we can't do the exact match for the test results. A good solution to solve this issue is to introduce the Langchain string evaluators which will use a specified language model to evaluate a predicted string for a given input. We use correctness_evaluator and confidence_evaluator in our tests. 

#### 1. Verify the Factual Correctness of the Responses
We have the test structure like this,

![Test_Scottbot_1.PNG](/uploads/Test_Scottbot_1.PNG)

Test cases: 

<script src="https://gist.github.com/XChenscottlogic/790309cdb19ffe8b7175854738b60df5.js"></script>

#### 2. Verify the Semantic Correctness of the Responses
We mainly implement manual testing on this section to assess the content generated by Scottbot.
Test structure:

![Test_Scottbot_2_1.PNG](/uploads/Test_Scottbot_2_1.PNG)

Test cases: 

<script src="https://gist.github.com/XChenscottlogic/d95293bb2d23d7cdcdb3519983a608b4.js"></script>

#### 3. Verify the Format Correctness of the Responses
Test structure:

![Test_Scottbot_2_2.PNG](/uploads/Test_Scottbot_2_2.PNG)

Test cases: 

<script src="https://gist.github.com/XChenscottlogic/7a61fc191d8562b3f480e59e2a54fe41.js"></script>

#### 4. Verify the Completeness of the Responses
Test structure:


Test cases: 

#### 5. Verify the Readability of the Responses
Test structure:


Test cases: 

#### 6. Verify the Usability of the Responses
Test structure:


Test cases: 

#### Non - Functional testing
Test structure:

![Test_Scottbot_4.PNG](/uploads/Test_Scottbot_4.PNG)

![Test_Scottbot_5.PNG](/uploads/Test_Scottbot_5.PNG)

