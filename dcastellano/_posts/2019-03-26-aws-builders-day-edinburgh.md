---
published: true
author: dcastellano
layout: default_post
category: Tech
title: AWS Builders Day 2019
summary: >-
  In this article, I share my take on the recent AWS Builders Day in Edinburgh.
  I delve into a couple of the talks i attended which were primarily focused
  around AWS AppSync, AWS Amplify and GraphQL.
---
Last week I had the opportunity to attend the AWS Builders day at the EICC in Edinburgh. This was a one-day event that had a variety of talks focused on three different areas. The areas covered were Modern Application Development, Analytics & Machine Learning and Backends & Architecture. I chose mostly from the Modern Application Development track but switched to a couple of talks within Backends and Architecture at the end of the day.

My favourite speaker was Sébastien Stormacq. His first talk was around the useful tools for continuous integration and continuous deployment. This included AWS Serverless Application Model (SAM), AWS CDK, AWS CodeBuild, AWS CodePipeLine, AWS CodeDeploy and the various deployment options you have available to you in AWS. For someone new to AWS this was a very useful session.

During his next session AWS Amplify was used along with AppSync to create a serverless backend for a React web app. AWS Cognito authentication and search capabilities via Amazon ElasticSearch were easily added via Amplify with a few commands and a couple of lines of code.

AWS Amplify can do various things to help make life simpler when creating, configuring and implementing scalable mobile or web apps for AWS. It provisions and manages the backend for your applications so all you need to do is select which capabilities you require, and it will do the rest. Features such as authentication, analytics and offline data sync can be setup and integrated into your application with a few commands and a couple of lines of code. A simple framework is also provided which makes it easy to integrate your backend with IOS, Android, Web or React Native frontends. Amplify also automates the release process of your application which means features can be delivered faster.

AWS AppSync enables developers to manage and synchronise app data in real time across devices and users. It also supports offline data synchronisation. AWS AppSync uses GraphQL which enables the client to perform queries, update and subscribe to the data. This allows the client to query for only the data they require and in the format that they need.

After this session I switched to the Backend and Architecture track to listen to a talk on Rapid Prototyping using Serverless Backend. This session was about a hypothetical client who required their mobile app to be refreshed and a prototype to be created with real data in a small timeframe. The client had an existing legacy REST API which returned a lot of data that was not used in the app which impacted performance.

AWS AppSync was used to create the serverless backend. The relevant fields were extracted from the legacy REST API and a GraphQL schema was created which would return only what the client required. DynamoDB was used to store the data. When a record was modified it would trigger a subscription which would then cause the legacy system to update. New resolvers were added to allow other data to be retrieved from a new data source. This enabled the GraphQL schema to have the new fields but coming from a different data source. All of this was achieved with a few AWS Amplify commands and a few Velocity templates.

The day provided a good introduction to some key features and concepts. My knowledge is mostly in Microsoft Azure, so it was great to see what AWS offer and how this differs from the Microsoft proposition. I can’t wait to explore more within the AWS space.

