---
title: Why Apache Spark is getting so much momentum behind it
date: 2016-01-24 00:00:00 Z
categories:
- acarr
- Data Engineering
author: acarr
summary: Apache Spark has quickly become the largest open source project in big data,
  but why has it suddenly got so much momentum behind it?
layout: default_post
---

Apache Spark has quickly become the largest open source project in big data - with over [750 contributors from 200 companies](https://databricks.com/spark/about).
It’s very easy to see why - it is a data processing platform where client code can be Java, Scala or Python.  It can do mapreduce processing like hadoop but due to it’s tendency to process things in memory; it is commonly much faster typically between [10 to 100 times faster](http://www.zdnet.com/article/faster-more-capable-what-apache-spark-brings-to-hadoop/).

Spark can run on YARN (hadoop evolution) or alone, plus comes with out of the box algorithms such as Machine Learning, GraphX and IBM has now announced 15 of it’s core analytics libs including [SPSS](https://developer.ibm.com/predictiveanalytics/2015/11/06/spss-algorithms-optimized-for-apache-spark-spark-algorithms-extending-spss-modeler/) predictive analytics portfolio are now integrated with Spark.

But three things really seal the deal, firstly it can scale out to over 8,000 nodes and process petabytes of data and provides great tools to manage and deploy easily, secondly it comes with an interactive shell where the user can instantly run functions and try stuff out in Scala or Python.  Last but by no means least - because of all the built in functions - it is so easy to write code that is loosely coupled and can be run in parallel that it can speed up the development cycle for rolling [new functionality](http://www.toptal.com/spark/introduction-to-apache-spark).  Which lets the developers concentrate on developing new features for users.

While Apache Spark won’t solve every problem, and there are plenty of Use Cases where Apache Storm is more relevant such as where low latency is key (even Spark Streaming doesn’t quite match the low latency Storm can achieve as Spark Streaming is effectively micro-batching not true event triggered processing), but if you want speed of development, deployment, and throughput - you really should consider Apache Spark.

Andrew
