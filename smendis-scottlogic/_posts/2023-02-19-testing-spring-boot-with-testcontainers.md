---
title: Testing Spring Boot With Testcontainers
date: 2023-02-19 00:00:00 Z
categories:
- Tech
tags:
- java
- spring
- spring-boot
author: smendis-scottlogic
summary: What is the best way to test the repository layer of a spring boot application? Or should you test it at all? What are Testcontainers and how to use them? This article addresses them all with examples, so you can make a better decision when you are faced with a similar challenge in future.
summary-short: Discuss how repository layer of a spring boot application can be tested using Testcontainers.
layout: default_post
---

*Looking for a better way of testing your spring boot application’s repository layer?* If this is a question that crossed your mind recently, then this article is for you. I’m hoping to share you my experience of writing integration tests to test your repository layer with the use of test containers in this article. Hope this will help you to make a better decision next time when you are faced with the same challenge.

Before coming into **Testcontainers** let’s try to find out what’s out there as alternatives. This will help us to appreciate the value that **Testcontainers** bring in. Since we are using Spring Boot, you would probably be extending an interface such as `CrudRepository` or `MongoRepository` based on your choice of database to create your repository. So, one may argue that we don’t need to test the repository layer as it was not written by us. For simple applications which do not have any custom repository queries this may be true. But if you are adding more functionality to your repository than what is provided by `CrudRepository` or `MongoRepository` it’s always recommended to test your repository layer with integration tests.

Ok, let’s assume you have decided to test your repository layer. The easiest would be to add an embedded database like **h2** if you are using a relational database or add an **Embedded MongoDB** if you are using a NoSQL database. *Wait what?? I have a **PostgreSQL** database in my production, and now you are asking me to test with **h2**?* Since they are both relational databases yes you can use that approach. But I don’t recommend. Not everything in **PostgreSQL** is there in **h2**. When you have complex queries to execute there is no guarantee that passing tests in CI, means that it will work the same in production.

*Alright, then what should I do? Create a separate database just like the one I use in production, populate it with test data and use it only within my test class??* Yes, why not?? It will fix all your problems. *But wouldn’t it be too much work?* This is where the **Testcontainers** come into action. Just like you automate many things using annotations in Spring Boot, **Testcontainers** allows you to do all the things that I mentioned above in few lines of code. Of cause, this takes few minutes to run your test cases, but you can always configure your CI to run repository tests only on request which will eliminate the long test execution times and allow you to run them when you require an end-to-end testing.

### What are Testcontainers?

> **Testcontainers** is a library that supports testing frameworks like Junit, by providing light weighted, throwaway  instances of common databases, Selenium web browsers, or anything else that can run in a Docker container.
- [Testcontainers](https://www.testcontainers.org/) Official Site


At the time of writing this article **Testcontainers** are available for many popular languages such as,
* Java
* .NET
* Python
* Go
* Node.js
* Rust.

Enough with the background. Let’s see how you can use **Testcontainers** in your Spring Boot application.

### Building a demo Spring Boot Application

Intension




