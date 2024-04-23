---
title: Are we ready to put AI in the hands of business users?
date: 2024-04-23 00:00:00 Z
categories: [ Data Engineering ]
tags: 
    - data
    - bi
    - business intelligence
    - data visualisation
    - ai
    - artificial intelligence
    - ml
    - machine learning
    - generative ai
    - generative bi
    - aws
    - cloud
    - quicksight
    - sagemaker
    - sagemaker canvas
summary: Lots of businesses want to use AI, if they can find the right business case for it.  We look at some new and enhanced AWS products which take a low-or-no-code approach to using AI to enhance Business Intelligence tools.
author: csalt
contributors: sgladstone
layout: default_post
---
Generative AI has been grabbing headlines, but many businesses are starting to feel left-behind.  Large-model AI is becoming more and more influential in the market, and with the well-known tech giants starting to introduce easy-access AI stacks, a lot of businesses are left feeling that although there may be a use for AI in their business, they're unable to see what use cases it might help them with.  They see the potential of AI, but struggle to find practical applications for it.  Consumer chatbots are now a common feature of company home pages, but aren't always popular with end users.  With little other use of AI in the business, some companies are starting to feel that they're missing out from the benefits of AI whilst at the same time being not quite sure what they're missing out on.

However, at the same time, it is becoming more and more common to find AI-driven solutions to specific, well-contextualised business problems.

Several of the tech giants are quietly developing powerful and user-friendly tools to do just that; we recently attended a workshop run by Amazon, to show off some of their products in this area and get hands-on experience of some of AWS's preview capabilities.  These are undoubtedly very powerful, and moreover position AI firmly as a tool to help business, a tool that delivers real value for its (admittedly expensive) running costs.  Amazon's goal in this space is to develop AI tools that are able to be used by non-technical users, so that organisations are not hamstrung by any bottlenecks caused by the number of data scientists they have available.  We're not sure they have completely achieved it, but they have certainly created something that a non-specialist can pick up and potentially get results with very quickly.

## Model training with SageMaker Canvas

One of the first steps in using AI to analyse your own data is to generate a model based upon it, and in AWS, this is done using Amazon SageMaker.  In particular, with SageMaker Canvas, it's possible to create a machine learning model entirely graphically.  You can directly upload a data set, or it can come through some cort of ingestion pipeline using an ETL tool such as Amazon Glue.  You can select which algorithm(s) to use to train the model; but then all you need to do is wait.  Once the model has been trained, you can study its accuracy and its predictions in the SageMaker UI.

![Screenshot of AWS SageMaker Canvas, with the accuracy of a prediction shown using a Sankey diagram]({{ site.github.url }}/csalt/assets/aws-ai-and-bi/aws-sagemaker-canvas-1.png "Screenshot of AWS SageMaker Canvas, with the accuracy of a prediction shown using a Sankey diagram")

The interface uses a Sankey diagram to display the false positives and false negatives of each predicted outcome in an intuitive and easy-to-grasp manner.

SageMaker Canvas also has a number of other features, including the ability to take one of the well-known large language models already produced and use it as a "foundation model", customising the model using your own data or documents.  This is particularly useful when wanting to create a chatbot using retrival-augmented generation (RAG), and SageMaker Canvas lets you configure multiple models to return replies from the same document corpus, then start a simultaneous chat session with each model in parallel, sending the same questions to each.  Just a few minutes with this gives you a really fascinating insight into the comparative performance of different LLMs.

![Screenshot of AWS SageMaker Canvas showing a parallel chat conversation posing the same questions to 3 different LLMs]({{ site.github.url }}/csalt/assets/aws-ai-and-bi/aws-sagemaker-canvas-2.png "Screenshot of AWS SageMaker Canvas showing a parallel chat conversation posing the same questions to 3 different LLMs")

One key business benefit from the SageMaker Canvas architecture is that the data you upload and the models you create will stay entirely under the control of your own AWS account, and is not shared with the foundational model's provider in any way.  This completely obviates a lot of the concerns that I know  many businesses have had around knowing what will happen to your data, not only regarding business sensitivity and commercial secrecy, but also with your legal responsibilities around GDPR and similar legislation elsewhere.  Amazon Glue includes built-in transformations which can attempt to redact any personally-identifying information from your data sets, to further minimise any risk; and this redaction can use a consistent hashing algorithm to enable data correlation without personal identification.  

Moreover, with cost always being a worry when it comes to AI model training, removing unnecessary fields from your data not only helps remove biases from your model, it improves your training speed and costs too.  One slightly clunky aspect of SageMaker Canvas, if you want to use the Foundation Model feature, is that you have to be granted access to the model(s) in the underlying Amazon Bedrock configuration.  This might seem an administrative nuisance, but does enable companies to place sensible restrictions on what users are able to do.

## Predictive BI insights with Amazon QuickSight

Amazon QuickSight is AWS's offering in the business intelligence dashboard space.  It's been around since 2017, and we don't intend to go into a full review of its features here&mdash;only a month ago, Mike Morgan and Steve Conway from our Leeds office published [a comparative review of three cloud BI solutions, including QuickSight]({{ site.github.url }}/2024/03/26/cloud-business-intelligence-a-comparative-analysis.html) here on the Scott Logic blog.  However, Amazon are adding the ability to link your QuickSight dashboards to your SageMaker Canvas models, combining the data set your model was trained on with the future data it predicts.

This is powerful as it allows you to create dashboards that go beyond reporting a reflection of the current state of your data. You can build side-by-side visualisations for the state of your business and ML predictions for future trends.

![An AWS QuickSight dashboard showing financial loan data, including predicted loan outcomes]({{ site.github.url }}/csalt/assets/aws-ai-and-bi/aws-quicksight-1.png "An AWS QuickSight dashboard showing financial loan data, including predicted loan outcomes")

## Generative BI?  Natural language processing in Amazon QuickSight

At the workshop, we were able to play with a new feature being added to Amazon QuickSight, which Amazon are calling "Generative BI".  When we heard the term, we were a little bit puzzled and almost put off because, after all, your BI data has to be based on solid facts.  However, what it means is: Amazon have built their Amazon Q chatbot into QuickSight, so you can use natural language queries to explore your data and visualise it.  We were both really impressed with how quickly we could use this to create dashboards. For example, when asked to “forecast loan amount by month”, Q will build you a visual that you can add to your dashboard:

![Adding different visualisations to a QuickSight dashboard with natural language queries]({{ site.github.url }}/csalt/assets/aws-ai-and-bi/aws-quicksight-2.png "Adding different visualisations to a QuickSight dashboard with natural language queries")

You can see from those screenshots that it doesn't always get your intent 100% of the time, and its intent recognition can partially depend on you configuring your data set properly: manually adding synonyms for field names, for example.  You can also see, though, that it really quickly gives you a good starting point, a set of dashboard visualisations that you can then tweak and finesse&mdash;and you can edit visuals using natural language, as well as creating them.  There are a few little oddities in what intents it understands&mdash;for example, when we were playing with it, it could understand "change this chart to a donut chart" but couldn't understand "change the gross profit segment of the chart to green", but overall, this is a really nifty tool.  Right now it's still a preview product, so the UX can be a little clunky and glitchy in parts with slide-out panels occasionally obscuring other controls; we're sure that a lot of these quirks will be resolved before long and everyone will be able to see what a powerful addition to QuickSight this is.

## Is this AI for the regular business user?

The goal of these products and features, we were told, was to enable the use of AI, to enhance BI, by business analysts who are domain experts but are not data scientists or software engineers.  Have Amazon succeeded?  In one sense, we're not the best people to ask about that, because we are software engineers ourselves; we're not the target market.  Zero-code, graphically-edited data preparation tools and BI tools are hardly new to the marketplace, either.  The real innovation here is building AI seamlessly into the tooling, and giving non-technical users the ability to do their own AI model training.

However, it's never quite as straightforward as simply giving everyone access to these new features and expecting a sudden revolution in your business.  Responsible use is key.  Having a plan is key.  Unleashing large numbers of employees to train countless models without understanding, say, the difference between the various training algorithms they could choose from, can quickly lead to huge costs, wasted resources, lots of environmental emissions, all for no business benefit.  While these tools lower the barrier to entry, technical understanding and technical guidance will still be the key to success.

We're not convinced these tools will remove the need for data scientists and software engineers in the business, any more than previous generations of zero-code data tools have.  What they can do, though, is enable the engineers and specialists to focus on the in-depth engineering, on surfacing data sources and making deeply-buried silos accessible, and engineering systems to unearth that data and move it at scale into a data lake that models can then be trained from.  The business team will then be able to use their domain knowledge in combination with AI-enhanced BI tooling to quickly and easily visualise the data and the forecasts that the business needs.  Businesses may well want to bring in specialist data engineers at the outset, to work on these data flows and build themselves a platform which will enable their BI platform to grow and evolve.  Their BI dashboard can then be developed over time by in-house experts on the data domain, experts who know their data models inside out.  

The products Amazon have been demonstrating are soon going to be matched by other suppliers in the wider marketplace; we suspect a host of other AI data summarisation and analysis tools will appear in the marketplace, and they are likely to be one of the biggest effects that AI has on business in the coming years, breaking down technical silos and realising business value.  This is a really exciting field to be working in right now, and as Scott Logic consultants, we're really looking forward to helping build those data pipelines and data flows that business are going to need to unlock the maximum business value from these systems.
