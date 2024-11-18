---
title: A quick tour of data distribution technologies
date: 2023-11-14 10:00:00 Z
categories:
- Data Engineering
tags:
- Kafka
- RabbitMQ
- AWS
- Data Strategy
- ESB
- Data Transfer
- Distributed Log
- Queue
- Pub/Sub
summary: This blog discusses the different ways we might choose to distribute data between services including queues and distributed log technologies and their relative strengths and weaknesses
author: dhope
image: "/uploads/data%20distri.png"
---

<style>
  img.pubsub {
    height: 240px;
  }
</style>

In this post we'll take a look at queues, logs and pub/sub systems in order to understand the options for sending data asynchronously between services. 

We'll provide examples of each and discuss the tradeoffs that must be made. 

## Introduction
In any organisation there is a need to distribute data from a source system to other systems. This is especially true with the modern micro-services architecture. For example, consider an online store where a new product is added to the inventory system and needs distributing to the catalogue, marketing, purchase and warehouse services as shown below:

<img class="none" alt="diagram depicting some services where a new product is added to the product management service by a member of the inventory team: that product information will be needed by various services including a downstream catalogue service for display to  the user, the purchase service for when the user buys the product, the data warehouse team, and a marketing system for promotions so customers can be emailed about it" src="{{ site.github.url }}/dhope/assets/databuses/exampleServices.svg" />

There are cases not shown in the diagram where a request from a browser might need fulfilling from multiple systems in a synchronous way but I'm not talking about that in this blog. Rather, I am talking here about asynchronously distributing data to other services that maintain their own copy of the data in order to do their work or where we want to emit and distribute events for other services to process.

It's generally accepted that in such cases we don't want the source system directly doing HTTP requests to all interested parties, we prefer a low level of coupling between systems. The challenge is that there's a bewildering array of choices available and it's not always clear what to use where or if one solution should be used everywhere or if we need multiple technologies. 

In this blog I'll try and illuminate the differences between the various types of solution on the market and show why you shouldn't be afraid to have more than one solution in use.  

### What we are transferring
Before we continue, be aware that I'll be a little loose on terminology around messages, events and streams. I'll discuss this more in an upcoming blog but all I'll say for now is the lines are often blurred  and many of the technologies support multiple use cases. Ultimately it's all data being transferred, just varying in how much state comes in the payload and the volume of data. That said, I'll try and call out when a technology is better for one or another. 

## Types of data transfer services
There's a few models for data transfer and they include:

 * Queues
 * Distributed logs
 * Request based pub-sub

In the next 3 sub-sections we'll define and explore each of these, starting with queues. Be aware not every solution fits exactly in these cateogories and there's some newer options such as Pulsar that attempt to bridge traditional queues and the high volume data streaming world. 

### Queues
When we talk about queues in this context, normally we don't just mean the queue but a queuing system involving a broker to which services write messages. On receipt of the messages the broker distributes them to 1 or more queues according to its config. Consumers read messages off a queue at their leisure and once any consumer takes a message off a queue and acknowledges it the message is gone from the queue. Examples are Rabbit MQ, Active MQ, Azure Service Bus and AWS SQS+SNS (the broker and raw queue are split in AWS). 

<img class="none" alt="diagram with 2 producers writing to a broker which then writes to two queues (with internal crossovers so either or both producer messages can go to both queues) and then to 2 consumers reading the queues" src="{{ site.github.url }}/dhope/assets/databuses/queues.svg" />

The queue model is well suited for work distribution - multiple instances of a service application can listen to a single queue and the first to read the message can act on it and no other workers will see that message because it's left the queue. Queues also provide a way to even-out heavy load where consumers may otherwise be briefly overloaded by requests.

Despite being widely used for data transfer in the enterprise, queues aren't always a great choice for a few reasons:

 * no way to do replays because once a message is read and ACK'd it's gone
   * this means a new downstream service coming online for the first time has to do a backfill via another channel
   * where a downstream loses data it can't replay
 * duplication of data for each consumer because everyone gets their own queue - could be an issue for very high volumes
 * can lack performance for the highest throughput or lowest latency applications
   * older solutions like Rabbit have no built in sharding (you can build your own around it or find plug-ins but they aren't transparent to your app)
   * newer cloud solutions are performant but at the expense of ordering guarantees (e.g. AWS's normal SQS is unlimited, but SQS FIFO limits to 3k req/s)
   * some brokers provide flow control which can be useful but may introduce latency in writing to the queue - not optimal for real time applications 
   * even with FIFO on the main queue, features for retries and dead letter queues can break ordering of messages
 * often use AMQP or non-HTTP protocols so can be a pain to integrate if not in the same data centre or cloud account. 

It's not all bad though and there are some strengths of queues. For example, because the queue maintains state, once a message is read it's gone and consumers can be quite simple - contrast with distributed logs later. You can easily see if a particular consumer is successfully reading the messages just by checking the state of that consumer's queue. Where it fills up and isn't emptying you can go and inspect the messages not being read to check for any issues with them. 

Message brokers also tend to be quite flexible in terms of how messages fan out and which queues they go to. e.g. a producers might publish to `services.commercial.property`, `services.residential.property` separately and a consumer could request a queue that gets everything on the wildcarded `services.*.property` along with other message types. Relating to this, in the queue model you could have a single queue per consumer with lots of different message or event types in the one queue. You don't need to keep integrating to new queues when new message types appear.

Generally then queues offer ease of use and flexibility for low to medium volume messaging applications especially between your own applications in your own data centre/account where networking is flexible.  

### Distributed logs
Distributed logs are an alternative approach popularised by Kafka and also seen with AWS Kinesis Data Streams and Azure Event Hub (effectively a managed Kafka solution). They are often talked about as providing high volume data streams rather than messages.

These work as the name implies, a producer just appends to a log continuously and consumers read that log.  Appending and reading are cheap operations allowing significant throughput (10s of thousands of messages per second+) and low latency. If there's 8 consumers they all read the same copy of the data unlike in the queue. Also as the name applies, the log is distributed by being split into multiple logs across a number of partitions and consumers can scale by having one consumer instance per partition. 

<img class="none" alt="diagram with 2 producers appending to 2 separate logs and 2 consumers each reading one of the logs and also saving their position in the log to a data store" src="{{ site.github.url }}/dhope/assets/databuses/dist_log.svg" />

Besides the higher performance the other notable benefit here is that data is retained because we append rather than delete (although usually there is a cleanup option with a user defined limit, trading off storage costs vs retention). If for any reason a service needs to consume the last 24 hours of data, it can do so. Some teams following more of an Event Sourcing model may even go so far as to make the log, not the DB, the source of truth. 

Distributed logs don't offer global first in first out (FIFO) ordering but they do within a partition. So, for example, if you wanted to ingest real time financial or sales data across hundreds of products, so long as any given product was on a particular partition, then you'd get all messages for the particular product in order. 

#### Distributed log challenges

Naturally there are tradeoffs and a major one is consumer complexity. We saw with the queue that all the consumer does is connect to the queue, receive messages and the queue deletes them when read or ACK'd (settings dependent). For a distributed log, it is up to each consumer to keep track of where it is in the log which implies additional database storage alongside the log itself - sometimes this is provided as part of the product, sometimes not. Client libraries are generally provided to handle the reading and writing of the position but it's something to bear in mind. 

Kafka is generally regarded as the most performant solution in this space but to deliver this it doesn't use a standard like HTTP or AMQP but has its own binary protocol and consumer model and library. This means you need to be aware of networking considerations and consumer impact. Other solutions in this space offer HTTP interfaces (and AMQP in the case of Azure Event Hub) but at the expense of performance in terms of maximum throughput and minimum latency. 

Another downside is that there is some upfront complexity in deciding on the right number of partitions - it's hard to change once a topic is setup. 

Finally, where there's lots of topics/streams (e.g. product, account, profile) of data, they can't all be directed to a single queue for the consumer - each must be consumed independently. 

Overall distributed logs typically provide a more difficult integration for consumers but bring the benefits of higher performance for high volume streams of data (e.g. analytics events), replays and no need to fan out and replicate data. 

### Request based Publication/Subscription (Pub/Sub)
I am defining a publication/subscription system here as one where a consumer subscribes to one or more topics which are then pushed to them. It's a slighty grey area because:

* Arguably a broker+queues product like RabbitMQ is a pub/sub system
  * but it is slightly different to my definition above in that the consumer is listening to specific queues and also the consumer does the initial connection
* Some services offer both push and pull so this isn't a perfect classification. 
* A pub/sub service may use queues or a log internally

Still I think it's worth treating those systems separately where implementation is hidden and I'll focus here on services where the pub/sub broker connects to the consumer via HTTP or gRPC to deliver the messages the consumer told the broker it was interested in.
Examples of pub/sub include Google Pub/Sub, AWS Eventbridge, AWS SNS (without SQS) and Azure Eventgrid. 

<img class="pubsub" alt="diagram with 2 producers writing to a message broker that is sending messages to 2 consumers. Consumers register interest in particular topics with the broker" src="{{ site.github.url }}/dhope/assets/databuses/pub-sub.svg" />

#### Heritage and specifics
Within this space we have generic solutions and those focused more on events. The latter 2, Eventstream and Eventgrid are primarily designed for transmitting events to and from IoT devices (Eventgrid) and the AWS and Azure services (Eventbridge and Eventgrid respectively). Examples of the latter events being "object created in S3" or "container stopped" where the event can then trigger lambdas or go to object stores and lots of other cloud integrations besides the more standard HTTP delivery. 

Despite this heritage they can be used for generic events or messages and can include significant data within the event payload (e.g. up to 1MB for Eventgrid) meaning they can support messages that transfer state rather than just an event with a name and ID.
SNS has more of a focus on external delivery methods including SMS and email but also has HTTP support for more a more generic integration.  

#### Features and properties of pub/sub systems
A feature we find on most of these solutions is sophisticated filtering capabilities and in the case of Eventbridge the ability to transform and remove fields for specific consumers. This contrasts with fairly basic filtering and routing on traditional queue message brokers and none on Kafka. 

Being a push rather than pull model has some implications in that a service may be unavailable when delivery is attempted. Pub/sub systems will have retries with backoff but will eventually give up, usually after 24 hours. Where failures are occurring there is a balance to be struck around alerting - you may want to ignore a few retries but be aware if one message is failing with a bad request or if everything is retrying implying a service or connection is down or overloaded.
Also from a support point of view, care is needed in setting up alerts so that the consumer team, not the broker team, are called out when the consumer is unavailable.  

An obvious difference of HTTP based pub/sub is the connectivity aspect - we don't need special ports open and can use the usual internet infrasturecture with API Gateways, application layer LBs etc. Also the firewall rules are in the opposite direction because the broker pushes out not the consumer initially connecting. 

Finally some (but not all) of these services have support for enforcing schemas - you do see this elsewhere, for example the Kafka client can make use of a schema registry but it's more common and more strictly enforced when publishing by POSTing content to an HTTP endpoint vs queues/logs where the data, aside from the header/metadata, is often treated as a binary object.  Again, this isn't an absolute rule, just what you'll typically find so be aware there's not a strict divide. 

## Requirements around data transfer and tradeoffs

Now we've been through a set of technology types let's try and capture some of the key differences and the tradeoffs.

### Protocols and integration
We've seen a mixture of HTTP, gRPC, AMQP and bespoke protocols. Where you have services all communicating in one data centre or cluster this isn't a big deal, e.g. services within Kubernetes (K8s). However, be aware that usually there are external services and this can cause issues. e.g. if you want to connect to a queue in K8s but only have access via an HTTP based ingress controller. Also consider security aspects - non-HTTP clients can't follow a standard header bearer token mechanism and might restrict you to username/password or x509 certificates.

So in some cases you may prefer a technology that includes native HTTP support or accept that you'll sometimes have to make use of custom adapters which may impact performance, or exactly once delivery semantics or be non trivial, e.g. for Kafka the need to track the position in the log. 

Finally, be aware that some solutions are very much designed for cloud native workflows and will save a lot of development effort if that's what you need. For example, where you want events on a topic to trigger a cloud function/lambda. We saw earlier that Eventgrid and Eventbridge are strong here whereas other solutions would need you to build this. 

### Retention
Some solutions offer retention ranging from days to years.
This can be very useful for new services coming online that need a backfill - if they can hit a replay endpoint and use their normal integration it's a lot easier than doing some bespoke extract transform load (ETL) process. Even better when all they need to do is read a log from the beginning.

A short retention of a few hours can still be valuable in the case of an incident where data has been missed or corrupted, e.g. due to a bad release, because it allows a fix to be deployed followed by a replay of recent data from source to cover the corruption period.  

If you pick a solution without replay, do think about the way you would handle these scenarios or if they are important. Perhaps for value/measure data, like a temperature reading from an IoT device you don't really care if you missed some past data. In some cases you may choose to use a DB with the queue solution or replays and in others you may decide that it's such an infrequent occurance that you accept the need to get data dumps off the origin systems. 

### Resilience and performance tradeoffs
The performance is quite variable between solutions varying from a few thousand messages per second up to millions with Kafka. In some cases the volume of data will trump other concerns and you'll have to go for the option that is most peformant.

Be aware also of the tradeoff between performance and resilience that can exist in deployment of some solutions. For example, you may have a choice of durable vs in-memory queues and/or a choice of quorum size, i.e. how many nodes in a cluster data must be written to in order that data counts as committed. If it's bank transfers then you'll sacrifice some performance to be sure data is committed whereas if you're pulling GBs of analytics data every few minutes you'll accept rare data loss for performance. 

<img class="pubsub" alt="diagram with a producer writing to a primary broker that then replicates the data to 2 secondaries" src="{{ site.github.url }}/dhope/assets/databuses/multiple_nodes.svg" />

There isn't a lot of difference between the options in multi-region offerings and unfortunately, unlike the DB world many queues and pub/sub systems are single region focused - cloud solutions are typically multi-AZ but only one region and solutions you install yourself like Kafka are designed for the cluster to be in one region with low latency between nodes and easy networking. That said Google Pub/Sub is global and Pulsar has multi-region support built in but generally the technologies we've discussed are only resilient within a region and you have to handle the replication to other regions manually. e.g. via Kafka Mirror Maker or for AWS Eventbridge one Eventbridge can be setup to forward to another Eventbridge in another region (but not any other services in another region).

### Operating effort
Different solutions will come with different operating effort. Firstly there's the choice of running yourself vs using a service. Some tools are cloud only, e.g. AWS SNS/SQS whereas others such as RabbitMQ and ActiveMQ are designed for a team to deploy either on-prem or into their cloud account. Kafka can be deployed yourself or there are managed solutions available, albeit at a cost. 

There's also the support aspect to consider - some tools will be better than others in terms of monitoring, knowing when messages haven't been delivered, updating etc.

### Flexibility and features
We saw earlier that a product like Eventbridge brings a lot of features and functionality: replays, filtering per target (consumer), message transforms per consumer whereas distributed log solutions are much more basic: messages go onto a topic and consumers can choose to read from it, subject to topic level access controls.

The flexibility can benefit security and make it easier to limit the scope of what each consumer can see. Some solutions will be more flexible generally around security, e.g. they might have more granular role based access controls.

One feature that may be valuable is support for streaming applications. For example Kafka has the Kafka Streams library which gives you the tools to do sophisticated stream processing via the standard consumer libraries. This allows you to provide real time streaming applications without needing to go via a big data solution like Spark or Google Dataflow wrapped by Apache Beam. By streaming here I'm thinking joining, enriching, grouping and transforming data in real time or close to (subject to watermark contraints, defining how long you wait for late data).

### Vendor lock in
There's tremendous value-add with many of the cloud vendor event and messaging solutions but the consequence is that you get really locked into their ecosystem - this isn't a reason not to go with them, just that it must be a conscious decision in your organisation.

## Final thoughts

We've done a quick tour of various product types for getting data between applications and we've looked at the various tradeoffs involved in picking one. 

Sometimes organisations will be tempted to drive towards a single data transfer solution across the enterprise because "isn't it inefficient and expensive to manage more than one?" Maybe, but we see that different requirements lend themselves to different solutions and often a one size fits all solution isn’t right. 

Therefore, despite the temptation to go one size fits all, in practice this is not often a good idea and it may be better to focus on some common tooling of 2 or 3 types that may be shared across domains. E.g. an HTTP based pub-sub system with guaranteed delivery for most applications and a distributed log for high throughput analytics or whatever suits your needs. 


