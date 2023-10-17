---
title: 'Testing LLM-Based Applications: Strategy and Challenges'
date: 2023-10-12 14:00:00 Z
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
summary: A case study of testing a customised GPT powered chatbot to present strategy and challenges to test LLM-Based applications.
author: dscarborough
---

## **Some Stuff**
As a testing professional with years of experience, I usually approach software testing with confidence. However, this time, in the face of testing a Generative AI powered, LLM-based application, I find myself confronting unusual challenges.

I compared testing a traditional application and found that the most significant challenge in testing LLM-based applications is the non-deterministic output result. Normally testers can predict the expected results for a traditional application. However, LLM-based applications always provide different responses, even with the same input. The unpredictable outcomes make traditional testing approaches, especially test automation, extremely difficult.

Another big difference is the cost. Typically, testers do not give much thought to the cost of testing in their daily work. Running regression tests, exploratory testing, or simple sanity checks only once or a few times doesn't significantly affect the expenses. However, testing non-open source LLM-based applications is a different scenario. LLMs work with tokens, breaking text into small pieces like complete words, subwords, or characters. The testing cost depends on the number of tokens used. In other words, the more queries made, the higher the testing expenses.
