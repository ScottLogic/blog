---
title: Async APIs - don't confuse your events, commands and state
date: 2024-03-23 10:00:00 Z
categories:
- Data Engineering
tags:
- Data Strategy
- Queue
- Event
- State Transfer
- Async command
summary: This blog is about the different types of message you can put on systems like Rabbit MQ and Kafka. It discusses the differences between commands, events, state and gives a few tips around how to structure your messages.
author: dhope
---

<img class="none" alt="Image of some services,a message broker and messages going between them and two arrows. The arrow pointing at the message broker saying 'previous blog' and the arrow pointing at the mesages saying 'this blog'" src="{{ site.github.url }}/dhope/assets/messagetypes/this_blog_last_blog.svg" />

In my previous [blog post](https://blog.scottlogic.com/2023/11/14/data-distribution.html) I looked at various technologies for sending data asynchronously between services including RabbitMQ, Kafka, AWS EventBridge. This time round I'll look at the messages themselves which over the last few years I've found to be a more complex and nuanced topic than expected. 

To set the scene see the diagram below of an imaginary financial trading application:

<img class="none" alt="Diagram showing five services: trade execution, order, data warehouse, payments, prices and various messages going between them like the command Take Payment, state update Trade Details, event Order placed and time series data Stock Price at T=1,2,3" src="{{ site.github.url }}/dhope/assets/messagetypes/different_events.svg" />

There's lots of data flying around varying from real time pricing data to instructions to execute trades. I've coloured the data entities according to their types and we see there's a few different patterns like events and state which we'll discuss in a moment.   

 The data bus isn't shown in the diagram because the discussion in this blog is relatively independent of which you pick. You might imagine, for example, that those with "event" in the title like Azure Event Grid and AWS EventBridge are only for events but the reality is that most data buses support payloads of 256kB or more meaning you can be flexible in what you send in any technology.  

 
## Terminology and types of data
To begin I think it's useful to classify the different types of message we might send before going into more detail on each in the following sections. The obvious ones are:

<table>
  <tr>
    <th>Type</th>
    <th>Example</th>
  </tr>
  <tr>
    <td>Events</td>
    <td><ul>
      <li> User Created (ID=55)</li>
      <li> ECS instance started (ID=353) </li>
    </ul></td>
  </tr>
  <tr>
    <td>Commands/Instructions/Request</td>
    <td><ul>
      <li>Send a reset password email to user X </li>
      <li>Take payment for £x from user Y</li>
    </ul></td>
  </tr>
  <tr>
    <td>State</td>
    <td><ul>
      <li>User (complete object)</li>
      <li>Product (complete object)</li>
      <li>Order (complete object)</li>
    </ul> </td>
  </tr>
  <tr>
    <td>Time series values</td>
    <td><ul> 
      <li>Stock price</li>
      <li> Error rate metric on API</li>
    </ul></td>
  </tr>
</table>

Time series data is of course the state of a single thing, but I'd argue that it is distinct because of its periodic nature - an update is sent regardless of whether it has changed or not 

In the following sections we'll dive into some of these in more detail but let's discuss one more piece of terminology: *messages*. 

Documentation, blogs and books sometimes talk about messages when referring to the use of queues/data buses. I'll use the term *message* in this blog as a generic term for asynchronous communication that may be state or commands or events.

## Events vs State
An event says that something has happened or changed, e.g. "Account Created". 
Ignoring timestamps and metadata it might have a payload like:

<pre>
<code>
{
  "EventType": "ACCOUNT_CREATED"
  "AccountID": "8c0fd83f-ff3f-4e0e-af4b-2b7470334efa"
}
</code>
</pre>

If you want to know about the details of the particular account then you need to get it by some other route like an HTTP request to an accounts REST API or whatever interface is in place. 

*State* on the other hand contains the full state for whatever entity has been created or changed. e.g.

<pre>
<code>
{
  "EntityType": "ACCOUNT"
  "ID": "8c0fd83f-ff3f-4e0e-af4b-2b7470334efa",
  "Name": "David",
  "Email": "An email@domain.com",
  "Tel: {
    "Type: "Mobile"
    "Country Code": "44"
    "777777777"
  }
  .....etc
}
</code>
</pre>

In this example I haven't included a field to say if it is created or updated. A downstream doesn't necessarily care if they saw an earlier message, they'll just check if they already have the particular entity or not. We are sending state, not what happened like creation or an update. The exception is deletions that need some special treatment, e.g. a special message type or an empty payload to signify the state is gone. 

State messages can be used in lots of scenarios but are a necessity when going towards an event sourcing route with the event log as the source of truth rather than a database.

I've found in practice that the difference between state and events can be a bit greyer than suggested so far. You may encounter half way solutions where an event has some commonly used info, like the email, but not the more detailed information. It's not very pure but it saves a lot of API requests for consumers who only care about the email. 
In a similar vein, sometimes an event is conveying a change in just one field, e.g. a "Phone Number Changed" event and includes the phone number as well as the user ID and so carries all the state. Sometimes a state message may include before and after state or a change list with the field names/paths (e.g. changes=[firstname, person.phone.mobile]) that have changed. 

The following table summarises the differences:
<table>
  <tr>
    <th>Feature</th>
    <th>Event</th>
    <th>State</th>
  </tr>
  <tr>
    <td>Payload</td>
    <td>An ID and enum to say what happened</td>
    <td>A full data entity</td>
  </tr>
  <tr>
    <td>Event type</td>
    <td>Enum identifying a specific thing that happened like EMAIL_UPDATED</td>
    <td>Entity name like PROFILE</td>
  </tr>
  <tr>
    <td>Followup calls</td>
    <td>Yes, API call needed</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Updates</td>
    <td>Identified by event name but no way to see old value</td>
    <td>Typically not conveyed if a state is new or update but sometimes a message will have old and new state</td>
  </tr>
  <tr>
    <td>Message size</td>
    <td>Small</td>
    <td>Medium or Large</td>
  </tr>
  
</table>

### Tradeoffs
I wouldn't say there's a right or wrong option as to which to go with. It will depend on a few things: 

#### Number of consumers
<img class="none" alt="A sketch showing a producer service sending out a message that fans to many consumers who all then do a REST call back into the producer to get more data" src="{{ site.github.url }}/dhope/assets/messagetypes/API_hit.svg" />
As the consumer volume goes up the advantage of the stateful approach is that you don't end up with heavy load on an API. Imagine a cluster of 100 messages going onto a bus arriving at 15 consumers at the same time. You've then got 1500 requests in a second or two to your API.

#### Resilience
Relating to the number of consumers, if your API is not that reliable then the stateful option can be better for resilience because you don't have a dependency on both the message bus and the API, just on the message bus in order to get all the data. 

#### Coupling
Resilience and some of the other points are really a form of coupling. If a service must call another service's API to get data it is more closely coupled to that service than a state message solution where the consumer needs to know nothing about the producer and isn't dependent on its name, resilience, API schema etc.

#### Data Transfer Volumes
If most consumers only want 2 or 3 fields but the state messages have 200 fields in them it can be wasteful. In this case an event option will be more efficient assuming the synchronous APIs (e.g. REST, GraphQL) are more fine grained. It's not a major plus for small focused state objects (e.g. 10-20 fields) but more important if sending large chunks of data around going into the 10s of KBs.

#### Consumer simplicity

Sometimes I've heard people assert that a state message is simpler because there's no need to make a call to an API which is true. But... it isn't always so straightforward. This is best explained with an example. Consider the following scenario:

 * the data of interest is a user's account detail 
 * you want to send an email or SMS to the user for security reasons when properties on the account change such as the email address change
 * you've taken the state message approach
 * you don't include a change list, just the current state. 
 
 Any service that is responsible for sending the email or SMS has to have its own state so it can compare before and after values and see that the email changed rather than some other field like name.

On the other hand if you had a single event saying "email changed" (with the new email on the event or available via API) then the processing service can be stateless.

In this case the consumer is actually much simpler with events but the problem for state messages can be negated by including a change list. 

#### Schema management
You have to keep 2 schemas in sync for the stateful approach (REST and message) and a lot of messaging systems don't have good support for schema management compared to API framework s. 
This is true both in terms of providing a schema for developers, e.g. via Swagger/Open API but also in terms of enforcing what producers are allowed to write onto a queue. 

#### Aggregations
This is addressed in a lot more detail in the upcoming Part 2 of this blog. 
For now we'll note that if a service needs a few entities to do its work (that would typically arrive via multiple state messages) then an event model can be simpler. The consumer receives 1 event and then immediately makes a few REST calls or a single Graph QL call to get the required entities to proceed. 

With the state approach you potentially have to handle out of order messages and wait for all messages before you can proceed. Alternatively, a larger aggregation state message with all the entities must be constructed which has its own problems.  

### Instructions/commands/requests
An instruction or command is a request to "do X". As an example think about a commerce site or government service that delivers a product by post or courier once a payment is made. Asynchronously this may work 2 ways:

 1. there's a delivery microservice that is listening to generic ORDER_PLACED events (or order state) and acts upon them to arrange delivery.
 2. The order application (or an intermediary microservice service that consumes the ORDER_PLACED events) writes out a "PREPARE_DELIVERY" instruction or similar to a delivery company service. 

The latter is an example of an instruction. 

The instruction message will typically contain all the necessary information for the downstream to do its work although it doesn't have to. Generally because an instruction is quite targeted there is no reason to not have the relevant data in the message unless there's any large files or images needed that are best not transmitted on the message bus. 

### Commands vs state/events

Now we've looked at instructions let's compare them to state and event messages. I would say the differences are:

 * A state or event message is quite generic and there could be a few services interested in it. 
 * A command is more specific and targeted at a particular consumer albeit with loose coupling (via queue or similar). 
 * With a command there is often an expectation of a response back via another message to confirm that it has been received and accepted or acted on. 

My personal take on this is that commands best fit into a workflow where you want to keep coupling low but nonetheless you are requesting something to happen and you care that it does happen. You may want to be able to bring up on a dashboard the state of the user's order and its delivery and take action where there are problems and you don't want to have to pull data from numerous systems to get that view. Such a scenario often benefits from an orchestrator, e.g. something like Camunda or Uber Cadence or AWS Step Functions.

With events/state messages then the source system (or an orchestrator) doesn't take any responsibility for what happens when it has done its work. It just throws out a message saying "here's some new/updated data" and moves on. It's up to other services to decide what to do and to provide a view on the status of the downstream actions. An obvious corollary of this is that where transmitting state, if any critical (to business function) downstreams depend on it then the messaging system must be very robust because there's no opportunity for retries or flagging errors in the source system. The source has no idea if downstreams got the data and successfully processed it. 

## Time series data
I am not going to say a lot here because the question of what to put in the message is a lot more obvious: 

* 1 or more values, 
* the value type(s) 
* a timestamp. 

The challenges are primarily around the message bus and the consumer. e.g. working out when all data has arrived in a given time period (See watermarks in [Streaming Systems](https://www.oreilly.com/radar/the-world-beyond-batch-streaming-102/)) and finding the right balance between risk of data loss vs throughput and latency. But the question of what to put in the message itself is comparatively simple. 

## Message envelopes

<img class="none" alt="simple sketch of inner and outer boxes with the outer labelled as the message envelope and the inner as the message" src="{{ site.github.url }}/dhope/assets/messagetypes/envelope.svg" />

As well as the contents of the payload some thought should be given to the message metadata that will make up the standard envelope for all your messages. 
A few recommendations are:

### IDs
 Include a unique ID on a message regardless of whether it's state, command etc. I'd advise UUIDs to guarantee uniqueness. This ID should just be about the message and not the entity. This is useful because:

 * for a command an action may not be idempotent, e.g. sending an email is not idempotent and so you must be able to de-duplicate
 * even for state which ideally is idempotent, it's better to avoid duplicating work in consumers and so having an ID to check against makes this easy.


### Timestamps
Include a timestamp in a standard UTC form so that a consumer can reorder messages and be clear about what the timestamp means. I'd recommend this being based on the entity being written to the source database (where applicable) or processed, not the message send time which in a threaded system may be non-deterministic. 

On the format, it's debatable but I prefer string versions of the timestamp as it makes debugging easier without having to convert epoch values. e.g. 2024-02-19T12:18:07.000Z, not 1708344420000.

### Versioning
Have a plan for versioning which could be in version field or be part of the message type name if you want to be able to route different versions to different consumers easily.

Don't confuse the version for the message envelope (shared across many entities) and the version for the specific entity. It's fine to have 2 version numbers, one for each. 
    
### Testing and environments
It's worth allowing for testing and multiple environments in your messages. 
For example, consider a flag to say if a message is a test message. This will allow easy filtering of test data in production without polluting your analytics systems.

Also consider an environment flag. It is common to flow production data into test environments to help provide realistic data. Sometimes you'll want to know about this because, as the data came from production, referenced IDs won't exist. A flag lets you know this came from another environment and not all linked data may have flowed into that test environment.

### Example
As an example of a message with the above fields:

<pre>
<code>
 {
  "messageID": "cc7b9901-c339-4c7d-80cd-c400f20581fd"
  "timestamp": "2024-02-19T12:18:07.000Z"
  "entityType": "ACCOUNT",
  "envelopeVersion": 1,
  "isTest": true,
  "fromEnvironment": "prod"
  "payload": {
    "version" = 1,
    "accountID": "0a0ebe8d-e48a-4195-8372-4f54c5dfd4e5",
  }
 }
</code>
</pre>

## Final thoughts

We've been through some of the pros and cons of events vs state and also looked at commands, observing the latter are often used in a workflow where you care about the receipt of that instruction and want to know the state of the action off the back of it. 

On state and events specifically, I'm not sure there's ever a 100% preferred approach just tradeoffs dependent on the number of consumers, the relationships between your data entities. If I must leave the fence, all I'll say is that state messages have often proved more complex than expected so I lean very slightly towards events, all else being equal. A few reasons being:

* only one API for getting the data - don't need to keep 2 in sync
* consumers don't have to assemble objects turning up in random order
* one source of truth accessible via the one API
* no need to worry about replays and backfills - just grab historic data from the REST/GraphQL/RPC API.

 Nonetheless events do mean tighter coupling between services and won't always scale if consumer numbers are high.

Whatever you go for, have a clear plan, try to be consistent and logical and don't make a choice accidentally. Put another way don't randomly mix instructions, state and events within a service without any clear reasoning. This doesn't mean you should try and have a one size fits all enterprise wide pattern. Even in a single domain it may be fine to have one service emitting state and another service listening to that and sending commands to do specific things when the data changes.

In part 2 I'll go into more detail on state messages looking at how to pick the right granularity for the data. 
