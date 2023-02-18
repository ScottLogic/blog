---
title: Testing Spring Boot With Testcontainers
date: 2023-02-20 00:00:00 Z
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

Looking for a better way of testing your spring boot application’s repository layer? If this is a question that crossed your mind recently, then this article is for you. I’m hoping to share you my experience of writing integration tests to test your repository layer with the use of test containers in this article. Hope this will help you to make a better decision next time when you are faced with the same challenge. 

Before coming into Testcontainers let’s try to find out what’s out there as alternatives. This will help us to appreciate the value that Testcontainers bring in. Since we are using Spring Boot, you would probably be extending an interface such as `CrudRepository` or `MongoRepository` based on your choice of database to create your repository. So, one may argue that we don’t need to test the repository layer as it was not written by us. For simple applications which do not have any custom repository queries this may be true. But if you are adding more functionality to your repository than what is provided by CrudRepository or Mongo Repository it’s always recommended to test your repository layer with integration tests.
