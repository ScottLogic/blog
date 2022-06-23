---
author: acheshire
title: "Log-driven big data: The ELK stack"
title-short: "The ELK stack"
layout: default_post
categories:
  - Data Engineering
summary: "An insight into the ELK stack and how we used it on a big data project"
---

<p style="text-align: center">
	<img src='{{ site.baseurl }}/acheshire/assets/log-lady.png' title="Log lady" />
</p>

When working with big data it is common that your technology stack will, much like an onion, have many layers between the data source and the end point.
This makes it hard to monitor what your application is doing, locate where performance bottlenecks lie and identify errors.
A good way to solve these issues is to approach these projects using [log-driven development](http://www.infoworld.com/article/3017687/application-development/get-started-with-log-driven-development.html).

I have recently been working on a big data project which involves processing the Common Crawl data to obtain usage statistics for some JavaScript libraries.
We took a log driven approach by implementing the ELK stack at a very early stage.
We have found this to be a valuable tool in the development and the monitoring of our application.

## What is the ELK stack?

The ELK stack is a technology stack used for logging which compromises of Elasticsearch, Logstash and Kibana.
If you haven't heard of these here is a brief description of each.

**Elasticsearch** is a NoSQL (non-relational) database.
It stores data as JSON documents and it offers a quick and versatile search of large data sets.

**Kibana** is an open source analytics tools designed for use with Elasticsearch.
It offers a nice user interface and it is easy to search for specific entries as well as display pretty visualisations based on the information stored in the database.

**Logstash** is a log management tool.
You configure input to accept messages from various sources, aggregate them and output them to a store.
In the ELK stack Logstash uses Elasticsearch as the store.

Below is a diagram showing the flow of data.

<p style="text-align: center">
	<img src='{{ site.baseurl }}/acheshire/assets/elk-data-flow.png' title="ELK data flow" />
</p>

## The ELK stack for big data

The ELK stack is a flexible tool and has multiple use-cases not limited to big data.
However, given that it is great at handling large numbers of logs and requires relatively little configuration it is a good candidate for such projects.
Logstash is a simple log management tool which can comfortably handle the input and output of vast quantities of messages, Elasticsearch is a great solution for storing large quantities of data which needs quick and flexible searches and Kibana offers a nice user interface for visualisations.
Essentially the strengths of this technology stack are ideally suited to log-driven big data projects.

## Our project

When we started our big data project we quickly realised that the amount of processes the data was going through was increasing and the feedback cycle for changes was getting longer.
We also found that monitoring performance and the status of certain components meant we were having to SSH into machines and check the stats which was also a slow process.
We quickly saw the necessity of taking a log-driven approach and used the ELK stack for a variety of things in order to address these issues.

### Performance

#### The problem

On the project we wanted to get the most out of our resources so performance was a priority.
We used AWS to host multiple machines which we deployed docker containers onto.
It was important to monitor the memory and CPU usage by container and machine in order to see where bottlenecks were occurring; slowing down our processing.

#### The solution

The ELK stack allowed us to send performance metrics as logs to Logstash and display them in easy to read dashboards in Kibana.
This made monitoring resource usage and performance simple.

#### The implementation

We used a couple of tools called Dockerbeat and Topbeat along with the ELK stack to provide an eloquent solution to this.
Dockerbeat and Topbeat were ran on each machine as docker containers and could easily be configured to send logs directly to Elasticsearch.
We missed out Logstash in this process as it made configuration more complicated and provided no benefit.
Once the logs were in Elasticsearch it was straightforward to create a dashboard with a number of visualisations in Kibana where we could easily see the performance metrics we needed.

### Events

#### The problem

The feedback loop for code changes can be very slow in big data and to verify things are happening as intended can be quite awkward.
This slows down development as you end up twiddling your thumbs waiting for data to reach a certain point.

#### The solution

Using the ELK stack we can send event logs to Logstash from our application which can be shown as visualisations in Kibana dashboards.
This allows us to verify events which should be happening are in fact happening and see the rate at which they are happening if we want to monitor performance.

#### the implementation

We used event logging in multiple places on our project.
One of the more interesting examples of one of our use-cases is in our Storm topology which we used to process Common Crawl files.
We could send an event log every time a file was processed with how many bytes were processed.
This meant we could quickly and easily verify what our Storm topology was doing just by looking at dashboards in Kibana.

### Errors

#### The problem

When processing large amounts of data it is likely you will get a large number of errors.
Obviously we shouldn't ignore these errors but many aren't critical so it would be preferable to just store them somewhere and view them later.
If we simply log to a file or to the console it is not going to be easy to track errors and find ones which may have caused pivotal problems.

#### The solution

The ELK stack again offers a nice solution to this.
We can send error log messages to Logstash and display metrics on them in Kibana.
Kibana also offers a pretty nice query language to allow us to drill down into logs and find specific ones which is useful when concerned with errors.

#### implementation

The implementation of this is essentially the same as with event logging.
It is probably a good idea to store errors in a separate index in Elasticsearch which can be achieved through a few methods.
We put a flag on log messages and used the Logstash configuration to send them to the right index in Elasticsearch.

## Conclusion

The technologies used in the ELK stack are valuable tools for big data projects and were pivotal to the advancement of our project.
Implementing it early on in the project to allow us to take a log-driven approach meant we could easily track events firing and errors as well as monitor performance metrics.
This makes the development process notably simpler by providing quicker and more informative feedback on code changes.
