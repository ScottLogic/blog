---
title: Comparing Apache Kafka, Amazon Kinesis, Microsoft Event Hubs and Google Pub/Sub
date: 2018-04-17 00:00:00 Z
categories:
- dnicholas
- Data Engineering
tags:
- featured
author: acarr
layout: default_post
summary: Distributed log technologies have matured in the last few years.  In this
  article, I review the attributes of distributed log technologies, compare four of
  the most popular and suggest how to choose the one that's right for you.
image: dnicholas/assets/featured/distributed.jpg
---

## The rise of distributed log technologies

Distributed log technologies such as Apache Kafka, Amazon Kinesis, Microsoft Event Hubs and Google Pub/Sub have matured in the last few years, and have added some great new types of solutions when moving data around for certain use cases.

According to [IT Jobs Watch](https://www.itjobswatch.co.uk/), job vacancies for projects with [Apache Kafka](https://www.itjobswatch.co.uk/jobs/uk/kafka.do) have increased by 112% since last year, whereas more traditional point to point brokers haven’t faired so well.  Jobs advertised with [Active MQ](https://www.itjobswatch.co.uk/jobs/uk/activemq.do) have decreased by 43% compared to this time last year.  [Rabbit MQ](https://www.itjobswatch.co.uk/jobs/uk/rabbitmq.do) is a more modern version of the traditional message broker and efficiently implements AMQP but only saw an increase of 22% in terms of job adverts which ask for it.  I suspect in reality a lot of the use cases that were poorly served by traditional message brokers have moved very quickly to distributed log technologies, and a lot of new development that traditionally used technologies such as Active MQ have moved to Rabbit MQ.

## What are they?

While distributed log technologies may on the surface seem very similar to traditional broker messaging technologies, they differ significantly architecturally and therefore have very different performance and behavioural characteristics.

![Traditional Message Broker]({{ site.github.url }}/dnicholas/assets/messaging-traditional-broker-architecture.jpeg "Traditional Message Broker")

Traditional message broker systems such as those which are JMS or AMQP compliant tend to have processes which connect direct to brokers, and brokers which connect direct to processes.  Hence for a message to go from one process to another, it can do so routed via a broker.  These solutions tend to be optimised towards flexibility and configurable delivery guarantees.

Recently technologies such as Apache Kafka and the like, or as they are commonly called the distributed commit log technologies have come along and can play a similar role to the traditional broker message systems.  They are optimised towards different use cases however, instead of concentrating on flexibility and delivery guarantees, they tend to be concentrated on scalability and throughput.

![Distributed Commit Log Architecture]({{ site.github.url }}/dnicholas/assets/messaging-distributed-commit-log-architecture.jpeg "Distributed Commit Log Architecture")

In a distributed commit log architecture the sending and receiving processes are a bit more de-coupled and in some ways the sending process doesn’t care about the receiving processes.  The messages are persisted immediately to the distributed commit log. The delivery guarantees are often viewed in the context that messages in the distributed commit log tend to be persisted only for a period of time.  Once the time has expired, older messages in the distributed commit log disappear regardless of guarantees and therefore usually fit use cases where the data can expire, or will be processed by a certain time.

## Choice of distributed commit log technologies

In this article we will compare the four most popular distributed log technologies. Here is a high-level summary of each:

### Apache Kafka

[Kafka](https://kafka.apache.org/) is a distributed streaming service originally developed by LinkedIn.  APIs allow producers to publish data streams to topics.  A topic is a partitioned log of records with each partition being ordered and immutable.  Consumers can subscribe to topics.  Kafka can run on a cluster of brokers with partitions split across cluster nodes.  As a result, Kafka aims to be highly scalable.  However, Kafka can require extra effort by the user to configure and scale according to requirements.

### Amazon Kinesis

[Kinesis](https://aws.amazon.com/kinesis/) is a cloud based real-time processing service.  Kinesis producers can push data as soon as it is created to the stream.  Kenesis breaks the stream across shards (similar to partitions), determined by your partition key.  Each shard has a hard limit on the number of transactions and data volume per second.  If you exceed this limit, you need to increase your number of shards.  Much of the maintenance and configuration is hidden from the user.  AWS allows ease of scaling with users only paying for what they use.

### Microsoft Azure Event Hubs

[Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-what-is-event-hubs) describes itself as an event ingestor capable of receiving and processing millions of events per second.  Producers send events to an event hub via [AMQP](https://en.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol) or HTTPS.  Event Hubs also have the concept of partitions to enable specific consumers to receive a subset of the stream.  Consumers connect via AMQP.  Consumer groups are used to allow consuming applications to have a separate view of the event stream.  Event Hubs is a fully managed service but users must pre-purchase capacity in terms of throughput units.

### Google Pub/Sub

[Pub/Sub](https://cloud.google.com/pubsub/docs/overview) offers scalable cloud based messaging.  Publisher applications send messages to a topic with consumers subscribing to a topic.  Messages are persisted in a message store until they are acknowledged.  Publishers and pull-subscribers are applications that can make Google API HTTPS requests.  Scaling is automatic by distributing load across data centres.  Users are charged by data volume.

It's not possible in this article to examine each technology in great detail. However, as an example we will explore Apache Kafka more within the following section.

### Kafka Architecture

The architecture around Kafka is comprised of the following components:

* **Topics** - this is a conceptual division of grouped messages. It could be stock prices, or cars seen, or whatever.
* **Partitions** - this is how parallelism is easily achieved.  A topic can be split into 1 or more partitions.  Then each message is kept in an ordered queue within that partition (messages are not ordered across partitions).
* **Consumers** - 0, 1 or more consumers can process any partition of a topic.
* **Consumer Groups** - these are groups of consumers that are used to load share.  If a consumer group is consuming messages from one partition, each consumer in a consumer group will consume a different message.  Consumer groups are typically used to load share.
* **Replication** - you can set the replication factor on Kafka on a per topic basis. This will can help reliability if one or more servers fail.

![Kafka Architecture]({{ site.github.url }}/dnicholas/assets/messaging-kafka-architecture.jpeg "Kafka Architecture")

## What are distributed commit log technologies good for?

While I won’t compare and contrast all the use cases of traditional message brokers, when compared with distributed log technologies (we’ll save that for another blog) but if for a moment we compare the drivers behind the design of Active MQ and Apache Kafka we can get a feel for what they are good for.  Apache Kafka was built in Scala at LinkedIn to provide a way to scale out their updates and maximise throughput. Scalability was of paramount concern over latency and message delivery guarantees.  Within the scalability requirement was the need to simplify configuration, management and monitoring.

There are a few use cases that distributed log technologies really excel at, which often have the following characteristics:

* The data has a natural expiry time - such as the price of a stock or share.
* The data is of a large volume - therefore throughput and scalability are key considerations.
* The data is a natural stream - there can be value in going back to certain points in the stream or traversing forward to a given point.

So certainly within financial services, Kafka is used for:

* Price feeds
* Event Sourcing
* Feeding data into a data lake from OLTP systems

## Attributes of distributed log technologies

There are a number of attributes that should be considered when choosing a distributed log technology, these include:

* Messaging guarantee
* Ordering guarantee
* Throughput
* Latency
* Configurable persistence period
* Persisted storage
* Partitioning
* Consumer Groups

### Messaging guarantee

Messaging systems typically provide a specific guarantee when delivering messages. Some guarantees are configurable. The types of guarantees are:

* **At most once** - some messages may be lost, and no message is delivered more than once.
* **Precisely once** - each message is guaranteed to be delivered once only, not more or less.
* **At least once** - each message is guaranteed to be delivered, but may in some cases be delivered multiple times.

### Ordering guarantee

For distributed log technologies the following ordering guarantees are possible

* **None** - there is absolutely no guarantee of any messages coming out in any order related to the order they came in.
* **Within a partition** - within any given partition the order is absolutely guaranteed, but across partitions the messages may be out of order.
* **Across partitions** - ordering is guaranteed across partitions.  This is very expensive and slows down and makes scaling a lot more complicated.

### Throughput

The volume of messages that can be processed within a set period of time.

### Latency

The average speed a message is processed after it is put on the queue.  It is worth noting that you can sometimes sacrifice latency to get throughput by batching things together (conversely, improving latency by sending data immediately after it is created can sacrifice throughput).

### Configurable persistence period

The period of time that messages will be kept for.  Once that time has passed the message is deleted, even if no consumers have consumed that message.

## How to choose which one to use?

When choosing between the distributed commit log technologies there are a few big questions you can ask yourself (captured in a simple decision flow chart below).  Are you looking for a hosted solution or a managed service solution?  While Kafka is possibly the most flexible of all the technologies, it is also the most complex to operate and manage.  What you save in the cost of the tool, you will probably use up in support and devops running and managing.

Common to all distributed commit log technologies is that the messaging guarantees tends to be at least once processing.  This means the consumer needs to protect against receiving the message multiple times.  Combining with a stream processing engine such as Apache Spark can give the consumer precisely once processing and remove the need for the user application to handle duplicate messages.



|  | Kafka | Amazon Kinesis | Microsoft Azure Event Hubs | Google pub/sub |
| --- | --- | --- | --- | --- |
| Messaging guarantees | **At least once** per normal connector.<br />**Precisely once** with Spark direct Connector. | **At least once** unless you build deduping or idempotency into the consumers.<sup>[1](#references)</sup> | **At least once** but allows consumer managed checkpoints for exactly once reads.<sup>[2](#references)</sup> | **At least once** |
| Ordering guarantees | Guaranteed within a partition. | Guaranteed within a shard. | Guaranteed within partition. | No ordering guarantees.<sup>[3](#references)</sup> |
| Throughput | No quoted throughput figures. Study<sup>[22](#references)</sup> showed a throughput of ~30,000 messages/sec. | One shard can support 1 MB/s input, 2 MB/s output or 1000 records per second.<sup>[14](#references)</sup> Study<sup>[22](#references)</sup> showed a throughput of ~20,000 messages/sec. | Scaled in throughput units. Each supporting 1 MB/s ingress, 2 MB/s egress or 84 GB storage.<sup>[12](#references)</sup> Standard tier allows 20 throughput units. | Default is 100MB/s in, 200MB/s out but maximum is quoted as unlimited.<sup>[6](#references)</sup> |
| Configurable persistence period | No maximum | 1 to 7 days (default is 24 hours)<sup>[4](#references)</sup> | 1 to 7 days (default is 24 hours)<sup>[5](#references)</sup> | 7 days (not configurable) or until acknowledged by all subscribers.<sup>[6](#references)</sup> |
| Partitioning | Yes | Yes (Shards) | Yes | Yes - but not under user control |
| Consumer groups | Yes | Yes (called auto-scaling groups) | Yes (up to 20 for the standard pricing tier) | Yes (called subscriptions) |
| Disaster recovery - with across region replication | Yes (cluster mirroring)<sup>[7](#references)</sup> | Automatically across 3 zones | Yes (for the standard tier) | Yes (automatic) |
| Maximum size of each data blob | Default 1MB (but can be configured) | 1 MB<sup>[8](#references)</sup> | Default 256 K<sup>[9](#references)</sup> (paid for up to 1MB) | 10 MB<sup>[6](#references)</sup> |
| Change partitioning after setup | Yes (increase only - does not re-partition existing data)<sup>[10](#references)</sup> | Yes by "resharding" (merge or split shards).<sup>[11](#references)</sup> | No<sup>[12](#references)</sup> | No (not under user control) |
| Partition/shard limit | No limit. Optimal partitions depends on your use case. | 500 (US/EU)<sup>[8](#references)</sup> or 200 (other) although you can apply to Amazon to increase this. | Between 28 and 32<sup>[9](#references)</sup> (can pay for more). | Not visible to user. |
| Latency | Milliseconds for some set-ups. Benchmarking<sup>[23](#references)</sup> showed ~2 ms median latency. | 200 ms to 5 seconds<sup>[13](#references)</sup> | No quoted figures. | No quoted figures. |
| Replication | Configurable replicas. Acknowledgement of message published can be on send, on receipt or on successful replication (local only)<sup>[21](#references)</sup>. | Hidden (across three zones). Message published acknowledgement is always after replication. | Configurable (and allowed across regions for the standard tier). | Hidden. Message published acknowledgement after half the disks on half the clusters have the message.<sup>[20](#references)</sup> |
| Push model supported | Pseudo with Apache Spark or can request data using blocking long polls, so kind of | Yes (via Kinesis Client Library)<sup>[15](#references)</sup> | Yes (via AMQP 1.0)<sup>[17](#references)</sup> | Yes<sup>[16](#references)</sup> |
| Pull model supported | Yes | Yes<sup>[15](#references)</sup> | No<sup>[17](#references)</sup> | Yes<sup>[16](#references)</sup> |
| Languages supported | Java, Go, Scala, Clojure, python, C++, .NET, .NET  Core,  Node.js, PHP, Python, Ruby, Spark and many more...<sup>[24](#references)</sup> | Kenesis Client Libraries (recommended)<sup>[18](#references)</sup>: Java, Python, Ruby, Node.js, .NET, C++<br />Using AWS SDK: C++<sup>[30](#references)</sup>, Go<sup>[30](#references)</sup>, .NET Core<sup>[19](#references)</sup>, PHP<sup>[33](#references)</sup>, Scala<sup>[34](#references)</sup> | Java, .NET, .NET Core, C++,<sup>[25](#references)</sup> GO (Preview)<sup>[26](#references)</sup>, Node.js(Preview), Python<sup>[27](#references)</sup>, Spark<sup>[28](#references)</sup> | Java, Go, .NET, .NET Core, Node.js, PHP, Python, Ruby, Spark. All the API’s for pub/sub are in currently beta with the exception of the PHP API which is at General Availability stage.<sup>[19](#references)</sup> <sup>[29](#references)</sup> |

### Decision flow chart

To help you choose here is a decision flow chart.  It certainly isn't recommended you stick to it rigidly. It's more a general guide to which technologies to consider, and a few decision points to help you eliminate some technologies, so you have a more focused pool to evaluate/compare.  Ultimately Kafka is the most flexible, and has great performance characteristics.  But it is also requires the most energy - both in setup and monitoring/maintaining.  If you wish to go more for a fully managed solution - Kinesis, Event Hubs and pub/sub offer alternative options depending on whether ordering and blob size are important to you.

Hopefully this blog post will help you choose the technology that is right for you, and I am very interested if you have chosen one recently and what reason you chose it over the others.

![Messaging Architecture Decision]({{ site.github.url }}/dnicholas/assets/messaging-architecture-decision.jpeg "Messaging Architecture Decision")

## References

1. [Handling duplicate records with Kinesis][1]
2. [Event Hubs check-pointing][2]
3. [Pub/Sub Message Ordering][3]
4. [Kenesis Changing the Data Retention Period][4]
5. [Event Hubs Quotas][5]
6. [Pub Sub Quotas][6]
7. [Kafka Mirroring data between clusters][7]
8. [Kinesis Data Streams Limits][8]
9. [Event Hubs quotas][9]
10. [Kafka modifying topics][10]
11. [Kenesis resharding][11]
12. [Event Hubs FAQ][12]
13. [Low-Latency Processing][13]
14. [Kinesis Data Streams Concepts][14]
15. [Kinesis Developing Data Streams Consumers][15]
16. [Pub Sub Subscriber Overview][16]
17. [Event Hubs Event consumers][17]
18. [Kinesis data streams][18]
19. [Pub/Sub client libraries][19]
20. [Pub/Sub The life of a message][20]
21. [Kafka replication][21]
22. [Kafka vs Kenesis study][22]
23. [Benchmarking Apache Kafka][23]
24. [Kafka clients][24]
25. [Event Hubs API][25]
26. [Event Hubs Go Preview][26]
27. [Event Hubs Python][27]
28. [Event Hubs Spark][28]
29. [Pub/Sub Big Data Interoperability][29]
30. [Kenesis GO API][30]
31. [Kenesis C++ API][31]
32. [Kenesis .NET API][32]
33. [Kenesis PHP API][33]
34. [Kenesis Scala API][34]

[1]: https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-duplicates.html
[2]: https://docs.microsoft.com/en-gb/azure/event-hubs/event-hubs-features#checkpointing
[3]: https://cloud.google.com/pubsub/docs/ordering
[4]: https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html
[5]: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-quotas
[6]: https://cloud.google.com/pubsub/quotas
[7]: https://kafka.apache.org/documentation/#basic_ops_mirror_maker
[8]: https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html
[9]: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-quotas
[10]: https://kafka.apache.org/documentation/#basic_ops_modify_topic
[11]: https://docs.aws.amazon.com/streams/latest/dev/kinesis-using-sdk-java-resharding.html
[12]: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-faq
[13]: https://docs.aws.amazon.com/streams/latest/dev/kinesis-low-latency.html
[14]: https://aws.amazon.com/kinesis/data-streams/faqs/
[15]: https://docs.aws.amazon.com/streams/latest/dev/developing-consumers-with-sdk.html
[16]: https://cloud.google.com/pubsub/docs/subscriber
[17]: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-features#event-consumers
[18]: https://aws.amazon.com/kinesis/data-streams/faqs/
[19]: https://cloud.google.com/pubsub/docs/reference/libraries
[20]: https://cloud.google.com/pubsub/architecture#data_plane_-_the_life_of_a_message
[21]: https://kafka.apache.org/documentation/#replication
[22]: https://blog.insightdatascience.com/ingestion-comparison-kafka-vs-kinesis-4c7f5193a7cd
[23]: https://engineering.linkedin.com/kafka/benchmarking-apache-kafka-2-million-writes-second-three-cheap-machines
[24]: https://cwiki.apache.org/confluence/display/KAFKA/Clients
[25]: https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-api-overview
[26]: https://azure.microsoft.com/en-gb/updates/event-hubs-go-preview/
[27]: https://github.com/Azure/azure-event-hubs-python
[28]: https://github.com/Azure/azure-event-hubs-spark
[29]: https://github.com/GoogleCloudPlatform/bigdata-interop
[30]: https://docs.aws.amazon.com/sdk-for-go/api/service/kinesis/
[31]: http://sdk.amazonaws.com/cpp/api/LATEST/namespace_aws_1_1_kinesis.html
[32]: https://docs.aws.amazon.com/sdk-for-net/v3/developer-guide/net-dg-platform-diffs-v3.html
[33]: https://docs.aws.amazon.com/aws-sdk-php/v2/guide/service-kinesis.html
[34]: https://github.com/awslabs/aws-scala-sdk

## Technology Vacancies Statistics

The following statistics were taken from [IT Jobs Watch](https://www.itjobswatch.co.uk/), which highlights the changing number of vacancies for each technology between 2016 and 2018.

| | 6 months to 2 April 2016 | 6 months to 2 April 2017 | 6 months to 2 April 2018 |
| :--- | ---: | ---: | ---: |
| Kafka | 499 | 819 | 1,734 |
| ActiveMQ | 675 | 554 | 314 |
| RabbitMQ | 1,048 | 1,181 | 1,438 |
