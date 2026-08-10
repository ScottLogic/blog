---
title: Data modelling for messaging between services
date: 2025-07-29 10:00:00 Z
categories:
- Data Engineering
tags:
- Data Strategy
- State Transfer
- Queue
- Pub/Sub
summary: This blog discusses how to model and structure the data you send on messaging systems like Kafka or RabbitMQ. It covers topics like message aggregation, avalanches and normalisation. 
author: dhope
---

In [part 1](https://blog.scottlogic.com/2024/04/22/message_types.html) I compared various message types including events, state transfer, commands and time series data. I discussed the key characteristics of each and when and where to use each type but I didn't go into depth on how to structure those messages, so that's what I am going to talk about here. The focus is on state transfer because that's where you typically encounter the issues but I'll call out when it also applies to events. 

The design of message payloads is an important topic that I don't think is given as much time and thought as it should be. In the relational database world a lot of thought is given to the schema design, to getting the right entities, the right level of normalisation and the correct relationships between tables. My experience is that we do a lot less of this in service-to-service messaging and so I'll try give this the attention it deserves by looking at some of the complications that you might come across and topics like granularity, normalisation and enrichment pipelines. 

## Granularity

To understand what I mean by granularity consider the following scenario of 2 user related services supporting a music streaming app:  
<img class="none" style="max-width: 600px" alt="TODO" src="{{ site.github.url }}/dhope/assets/messagetypes_p2/granularity2.svg" />

Let's assume there's a core user profile service which might be part of the Identity system and then another service for storing more domain specific preferences. The core profile service has a separate email change endpoint because emails come with extra logic around validation and security. 
Nonetheless, a single profile message, including email, is sent after calling either endpoint, so that the consumer has all the profile in one message. Similarly for convenience, between the two services there is an aggregation component producing messages for consumers that have everything about the user. Think of it as a bit like using Graph QL to get all the related user data in one go.

To bring this more to life there could be the following 2 entities being emitted from the 2 services:
<table>
  <tr>
    <td>
      <pre>
      <code>
      {
         "Entity": "PROFILE"
         "ProfileID": "8c0fd83f",
         "email": "john.smith@google.com",
         "name": "John Smith",
         "mobile": "0777777777",
         "address": {
            "number": 45,
            "postcode": "AA1 1AA"
         }
      }
      </code>
      </pre>
   </td>
   <td>
      <pre>
      <code>
      {
         "Entity": "PREFERENCES"
         "ProfileID": "8c0fd83f",
         "musicPreferences":
            "genrePreferences": ["rock"],
            "artistPreferences": ["Paul Simon"]
         }
      }
      </code>
      </pre>
   </td>
</tr>
</table>

and this combined entity being emitted from the aggregation service:

<pre>
<code>
{
   "Entity": "PROFILE_AGGREGATED"
   "ProfileID": "8c0fd83f",
   "coreProfile": {
      "email": "john.smith@google.com",
      "name": "John Smith",
      "mobile": "0777777777",
      "address": {
         "number": 45,
         "postcode": "AA1 1AA"
      }
   },
   "musicPreferences": {
      "genrePreferences": ["rock"],
      "artistPreferences": ["Paul Simon"]
   },
     
}
</code>
</pre>

An alternative, much more granular approach would be:

<img class="none" style="max-width: 600px" alt="A diagram where the profile service puts out separate address, email and name messages and a preferences service puts out a preferences message and then 2 consumers each read receive the particular messages they are interested in" src="{{ site.github.url }}/dhope/assets/messagetypes_p2/more_granular.svg" />

where we have lots of smaller messages and no aggregation in front of the consumers: 

<pre>
<code>
      {
         "Entity": "EMAIL"
         "ProfileID": "8c0fd83f",
         "email": "john.smith@google.com",
      }
</code>
</pre>

<pre>
<code>
      {
         "Entity": "Address"
         "ProfileID": "8c0fd83f",
         "number": "45",
         "postcode": "AA1 1AA"
      }
</code>
</pre>
etc....

Coarser messages can be simpler for a consumer because all the information they need comes in one message and can be immediately stored; there is no joining of messages, but there are also costs and we'll explore these ideas soon. 

Before we do that, let's briefly consider the different decision points where specific choices around granularity have been made:
 1. Should each endpoint send out an event matching the endpoint payload or divide it into smaller messages for particular field sets
 2. Should an endpoint aggregate data into its messages, where data that has come from another endpoint on the same service
    * Like the email example earlier
 3. Should multiple messages (from multiple services) be aggregated before they reach consumers


### Endpoint to message mapping
Let's say there is a single update-profile REST endpoint, like PUT /profile where the XML/JSON payload includes an email, postal address, phone number etc (assume no separate email endpoint for now)

When generating a message there is a choice between
 1. sending out one  "PROFILE" state message (or "PROFILE UPDATED" event)
 2. sending out separate ones like "EMAIL", "ADDRESS" etc 

In the first, a consumer system that only cares about the email doesn't know if the email changed or not without doing a comparison/diff because maybe the postcode changed or some other field. They may end up processing a large volume of messages unnecessarily if some other field regularly changes that they don't care about. Functionally this may be ok but it won't help non-functionals around cost, energy usage and performance. Change lists can at least avoid diffs but see later discussion. 

In the second option a consumer will subscribe to particular fields they are interested in but there will be more messages when multiple fields change at the same time. 

An address itself could divide down to postcode, number etc although this wouldn't make a lot of sense as the fields should always change together. Working out what data should change atomically can help you decide on the right granularity.

Finally bear in mind that UIs can sometimes submit a lots of things in one go to aggregate POST endpoints that have been collected in a big onboarding form or wizard but where the entities are really quite distinct and would later be fetched and changed independently. 

### Aggregation across endpoints (single service)

Next let's think about the scenario shown in the diagram with a separate endpoint for changing the email (we'll conveniently ignore complexities of changing email, which may actually be multi-step). 
We could send an EMAIL_CHANGED  event or EMAIL state message for the email endpoint and a PROFILE/PROFILE_UPDATED one (without the email) when the profile endpoint is hit. But... wouldn't a consumer expect to find an email in a profile message? If we find that persuasive then we might just send a "PROFILE" message including the email when either endpoint is hit meaning that the consumer has one simple message to listen for regardless of how the change occurred. In this case we are relating our events to the entities within our system rather than coupling them to the REST endpoints. 

Such an approach makes good sense but brings consistency risks that'll we'll discuss shortly

### Aggregation across services
Finally we may choose to aggregate multiple messages before delivery to a set of consumers. This, as we'll see, can simplify consumer implementations as they get all the data they want in one single message but it too has some costs around consistency and can lead to event avalanching.

## Normalisation
As well as granularity there is also the question of normalisation, relating to how much data we duplicate across messages. Picking a different example, consider an application processing sports data and imagine there is a separate state message for a tournament, a fixture and a team. 

If messages were normalised then each of these would have distinct, unique data and their only connections would be via IDs. e.g.

<pre>
<code>
{
   "Entity": "FIXTURE"
   "ID": "c51df36c-4635-4568-99d7-64a143bc0599",
   "datetime": 10:00, 23/04/1983 UTC
   "homeTeam": "bafffb74-66d0-458d-b909-67def02f9616",
   "awayTeam": "d4ab14b7-99ed-41a1-bddb-3848781d8ef6",
   "venue": "572ccbd1-a37f-44e7-b8ce-be64588782ed",
   "tournament": "0f504d3b-d76a-4aaa-b628-5e9eeaa10bdc"
}
</code>
</pre>

<pre>
<code>
{
   "Entity": "TEAM"
   "ID": "bafffb74-66d0-458d-b909-67def02f9616",
   "datetime": 10:00, 23/04/1983 UTC
   "name": "Manchester City",
   "shortName": "Man City",
   "location": "Manchester",
   "sponsor": "Ethiad"
}
</code>
</pre>

<pre>
<code>
{
   "Entity": "TOURNAMENT"
   "ID": "0f504d3b-d76a-4aaa-b628-5e9eeaa10bdc",
   "datetime": 10:00, 23/04/1983 UTC
   "name": "Premier League",
   "shortName": "Man City",
   "location": "Manchester",
   "sponsor": "Barclays"
}
</code>
</pre>

However, relating to the aggregation point described already, it might be convenient for consumers if the fixture message included within it information about the teams like the team names and the tournament name. In this case we see the same data duplicated across multiple messages with tournament data appearing in both fixture and standalone messages:

<pre>
<code>
{
   "Entity": "FIXTURE"
   "ID": "c51df36c-4635-4568-99d7-64a143bc0599",
   "datetime": 10:00, 23/04/1983 UTC
   "homeTeam": {
      "ID": "bafffb74-66d0-458d-b909-67def02f9616",
      "name": "Manchester City",
      "shortName": "Man City",
      "location": "Manchester",
      "sponsor": "Ethiad"
   },
   "awayTeam": {
      .....
   },
   "tournament": { 
      "ID": "0f504d3b-d76a-4aaa-b628-5e9eeaa10bdc",
      "datetime": 10:00, 23/04/1983 UTC
      "name": "Premier League",
      "shortName": "Man City",
      "location": "Manchester",
      "sponsor": "Barclays"
   },
   .......
}
</code>
</pre>

Distinguishing features of this form of aggregation are:

 1.  There's both the distinct messages and the aggregated ones, e.g. tournament exists as its own message as well as within each fixture. This means that we have 2 sources of truth, a point we'll come back to. 
 2. There is a many-to-one relationship where, for one tournament, there are many fixtures which is a common scenario in relational database table design. 

## Challenges and trade-offs
Now we'll have a look at the different features and tradeoffs you'll need to consider when deciding on a data model for your messages. 

### Message volumes

A similar argument applies here as discussed in [part 1](https://blog.scottlogic.com/2024/04/22/message_types.html) for events vs state: if finer grained messages are used, e.g. one for email, one for phone number, one for postal address etc rather than a single *profile* message then it seems pretty obvious that there's going to be a lot more messages sent from the producer. However where there is a large fan out to consumers, if each consumer is only interested in one or two fields, then the larger message results in a lot more unnecessary deliveries (because a message is delivered for a change the consumer didn't care about). The cost/space impact here may depend on the tech choice; for example Kafka has one copy of data across all consumers whereas Rabbit MQ and Azure Service Bus have a copy per consumer. 

One thing we didn't discuss in part 1 of this blog was many-to-one relationships. Let's look back to the normalisation sports example a short while ago - imagine what happens if the tournament sponsor changes. With the normalised case, where the fixtures only have a tournament ID, then a single message is sent out with the new tournament sponsor. On the other hand, if the tournament data is also included in all the fixture messages (for consumer convenience) then all those fixtures must be sent again with the new sponsor. If there's hundreds of fixtures against a tournament, that's a lot of extra messages that need to be delivered and they'll all come in a burst which may impact other functionality. So a small change causes an event avalanche. 

That's not to say the de-normalised option is always wrong, the convenience trade-off may be worth it in many cases but be aware of the costs in both message volume and the complexity of needing to recalculate and send all the entities that include the thing that might change, in this case all the fixtures including the sponsor.  

### Consistency
Consider the case where 2 entities are aggregated as per the original example:
```
message: {
  "core_profile": {
    "email": "name@domain.com",
    .....
  }
  "user_preferences": {
    .......
  }
}
```
If one message has the latest profile but older user preferences and the next the latest preferences but older profile then you've got a problem! You could at least add versioning or timestamps at the level of the sub-entities but consumers must be aware of this. 

Such a scenario can occur both within a service or when aggregating messages from multiple services. 
For the former imagine that address and email endpoints are hit in quick succession from a browser (because they change in one UI screen) but go to 2 different instances of the application providing the service. Each may read an old version of the data it aggregates, e.g. user_preferences endpoint reads the old email and vice versa due to the close timing. If such edge cases are a risk in your implementation, aggregation can cause serious confusion and should be avoided. 

As a counter to these points, sometimes going very granular can cause difficulties because some fields change together and you want to know about one thing at as it relates to another things at a point in time. e.g. purchase and user address, product and price, a player's team at the point of a fixture or goal. 
At the very least, if you were to split something that is atomic in the API into smaller events there needs to be references to the correct version of an entity. Otherwise the consumer, if receiving events in unpredictable order, may match one entity to the wrong version of another. 

#### Sources of truth
The nice thing about normalised messages is that for the contents of the messages there's only one source of truth. This isn't true for the de-normalised versions.

In our earlier example, we have the fixture and the tournament message both containing the same information. If some property of the tournament changes then there'll be 2 messages: one for the fixture (inc. tournament) and one for the tournament alone. Until a consumer has received both they will have an inconsistent view of the tournament and it might result in different data being displayed to a user from one view to the next. 

So in this case the presence of the de-normalised messages means there are 2 sources of truth and in turn means there can be some temporary consistency issues for anyone consuming both messages. Eventual consistency will apply though once all messages are received. 

### Understanding what has changed
When a consumer receives a state message like:
<pre>
<code>
   {
      "Entity": "PROFILE"
      "ProfileID": "8c0fd83f",
      "email": "john.smith@google.com",
      "mobile": "0777777777",
      "address": {
         "number": 45,
         "postcode": "AA1 1AA"
      }
   }
</code>
</pre>
how does it know which field or fields actually changed? In short it doesn't unless it does a field-by-field diff with its own data store (which is a non-starter for a stateless service). Why might the consumer want to know this: well consider the case where you want to send an email as a security measure if the email address changes but not if it was the other fields that changed. 

Two convenience solutions (to avoid the diff) are:

 * to include a change list as well as the state 
 * to include before and after state in one message. 
 
 This can work for the use case above but you have to be careful about how much you rely on the change list, especially where:
 * a producer has multiple sources of truth (e.g. de-normalisation or messages + API)
 * parallel or near parallel messages may be sent for the same entity

For the former the diff on the producer may have no meaning on the consumer, On the latter consider this scenario: 
<table>
  <tr>
    <td>
    Arrives first, new email
      <pre>
      <code>
      {
         "timestamp": "2025-07-12T20:35:02Z"
         "Entity": "PROFILE"
         "ProfileID": "8c0fd83f",
         "email": "john.smith@outlook.com",
         "mobile": "077777777777",
         "changes": {
            "changeList": ["email"],
            "previousVersion": 2
         }
      }
      </code>
      </pre>
   </td>
   <td>
   Arrives just after, new mobile num but original email
      <pre>
      <code>
      {
         "timestamp": "2025-07-12T20:35:01Z"
         "Entity": "PROFILE"
         "ProfileID": "8c0fd83f",
         "email": "john.smith@google.com",
         "mobile": "011111111111",
         "changes": {
            "changeList": ["mobile"],
            "previousVersion": 2
         }
      }
      </code>
      </pre>
   </td>
</tr>
</table>

There is obviously a conflict here from a state point of view and the change list tries to get round it by saying what changed in each message but then we no longer have a state message as you can't rely on the payload as a whole so might as well have used events instead.  

A change list can be useful for the case of an action like "send an email" but can be problematic for deciding what to update in a DB. It all starts to get a bit complex for consumer implementers and there's something to be said for not including them and just saying "here's the latest state".

Whatever option you take, identifying what has changed becomes a lot easier if a system can provide guarantees from DB write through to event receipt in a single linear order:
 
 <img class="none" alt="Diagram showing 2 browser requests coming into a service, then the data + a message for one of them going into a DB and then the message bus, then the other data with an associate outbox message going into the DB followed by the message bus, i.e. with clear order that matches in the DB and messages" src="{{ site.github.url }}/dhope/assets/messagetypes_p2/message_order.svg" alt=""/>
 
In this example two HTTP requests come in at the same time relating to the same entity. If there is a conflict it may be that one is rejected but whatever happens there is a clear order here enforced by DB transactions. The one that is written first to the DB also gets an entry in an outbox table/collection at the same time transactionally (or DB change feed entry if supported by the DB). The change feed reader application reads this table/change feed in order (i.e. no parallel threads/processes for a given entity ID) and writes, in order, to the messaging system and then the consumer reads in order. Each message can then reference the previous state with no conflicts or complexities.

 Many tools like Kafka/Kinesis/EventHubs can guarantee ordering within a shard/partition (it's up to you to pick a sensible key, e.g. user Id, to select the shard) and this will simplify consumers who don't have to worry about receiving and stashing out of order events. If you don't have this you'll have to rely on timestamps to enforce order and add some consumer complexity. 
  
If you are sending events from application code after a database write and without ACID guarantees, reasoning about your messages will be difficult, not just in terms of change lists but also for overall system consistency and avoiding conflicts.


### Security in aggregated messages and accidental coupling 
Moving on to a totally separate topic, let's briefly consider security. 
With REST and other APIs it is normal to have access controls saying which endpoints an be accessed by who.

If you go down an aggregation path this can be partially lost because one state message contains data that would, for REST, be read via separate endpoints each with it's own access rules. Most messaging services, e.g. Kafka, RabbitMQ don't allow you to control who gets which fields in the message although there are exceptions like AWS Eventbridge.

What this means is that going down the state transfer route as opposed to events can limit your security when the messages contain an aggregation of multiple REST endpoint payloads. So never aggregate data that has different access requirements. 

Related to this, there's also a risk of accidental coupling. Imagine you add a new field to some message where that field is only really intended for one consumer. You think that if you ever need to change/remove the field it it'll be a quick conversation with that one consumer's dev team. However, perhaps this field is also added to an existing aggregated message because the consumer already gets this and it's easier than integrating with a new topic and message. Unfortunately, 20+ other consumers are also using the aggregated message and, over time, developers in the associated other teams choose to use/misuse this field but you have no visibility. All you know is that 20 consumers of the aggregated message may or may not be using a given field. Suddenly you can't make a change because you'll break lots of services, not just the original intended one.

Therefore, if you want to restrict the blast radius of a change some data smaller focused messages with clear access controls and a limited consumer list can help. This doesn't mean you are coupling producer and consumer, it just means that from a message perspective it is sensible to know who is consuming what, just as you would with any REST API. 

### Producer complexity
The simplest option for producers is generating a message payload that matches the API but splitting into multiple messages isn't a major issue. On the other hand, aggregation, e.g. pulling in extra information from the DB does add complexity because, as discussed, you need to then be very careful about conflicts. 

De-normalisation also increases producer complexity as the producer needs to calculate all the entities affected by a change. 

### Consumer complexity

Contrary to the producer, aggregation can simplify a consumer especially where multiple messages are needed to proceed. To see how, imagine there is a non-nullable foreign key relationship between entities in a consumer DB and where those entities arrive as separate messages. The consumer may need to stash one entity and wait for the other as in the diagram below:

<img class="none" alt="Diagram two tables, payments and users where the payment references the user. Two events are arriving to the service with these tables but the user is after the payment so the service must stash the payment in a temp table" src="{{ site.github.url }}/dhope/assets/messagetypes/stashing.svg" />

In this scenario a consumer that would otherwise be stateless must have storage (meaning costs, ops, resilience etc) to aggregate multiple normalised messages. 

Additionally, if aggregation is left to the downstream consumer and they all need same aggregation, they must all implement the same logic around stashing entities and waiting for all the data to come in.

A related scenario is when you don't know how much related content is going to arrive - imagine some relationships are optional but the preference is to let all the information arrive before proceeding to the next step. A bit like watermark problems, there is a question here of how to be sure all the necessary information has arrived, how long should you wait for. Obviously this is easier if one message says explicitly how much related content to expect. 


## Enrichment pipelines
To finish, consider a slightly different pattern I am calling the enrichment or decoration pipeline:
<img class="none" alt="Diagram showing a data source feeding into an enrichment block that feeds into another then another" src="{{ site.github.url }}/dhope/assets/messagetypes_p2/EnrichmentPath.svg" />

 In this a piece of data flows through multiple systems, being decorated with additional information by each. e.g. a video data pipeline that starts off with an ID, name and genre then gets technical metadata added (like resolution or encoding type), then gets advertising data added and then editorial data. The final result is a kind of aggregated message but the way it is built up is a gradual additive flow.  

My experience of this pattern is that it leads to 3 related problems:

 * High coupling and lack of flexibility
 * Cost of changes
 * No clear source of truth

Lack of flexibility because if you want to add some new data set via a new service how do you do it, does it go at the end of the enrichment pipeline or do insert it in the middle somewhere and cause a lot of changes because each service is heavily dependent on the one before and the version it puts out. 

On the cost of changes, even a small change like a single field in an existing service can be problematic because it means that all the later services in the pipeline order must also be changed so they output the extra field in their enriched view. 

For the source of truth, if field A is introduced in pipeline service N-3 then it will also be present in servicesN-2, N-1 or N, so which do you use.

You can get round the cost issue to some degree by mandating that where a service enriches data it should effectively pass through the existing data. To put it another way you treat earlier data as a blob and don't map it into internal models on input and output. However, you still need to think about schemas and how you keep this up to date. If consumer A reads from Enricher N-1 at the end of the chain, it wants an async API schema from Enricher N-1 and that should include all the data added by previous stages.

## Final thoughts
My advice would be to generally prefer normalised, small entities but be flexible and consider the implementation expense of downstream consumer services. What entities make sense for a modern API will typically also make sense for messages, where each entity has fields that naturally fit and change together. This doesn't apply to large aggregate convenience endpoints, these should split into separate entities for messagings. 

Where the natural entity like a core user profile is split on writes, I'd recommend aggregating for consumer convenience on the message. For example, in the case of an email change being a separate HTTP POST because it drives a lot of business logic. However, you must ensure you have correct ordering and atomic updates so you don't get 2 messages each with the whole entity but with half the update, e.g. first message has new email, old address, second one vice versa.  

I generally avoid change lists and focus on a clear ordering and versioning of entities that consumers can use. If you have downstreams you must keep stateless (e.g. lambda processors with no DB) then an intermediary service can also be used to generate change-event messages from the state messages but be careful and clearly mark this - you don't want 2 sources of truth! 

Pragmatically if lots of consumers need the same combination of entities it is sometimes ok to add an aggregation service that can join data as a convenience function. Such a service should treat all fields except join IDs as opaque objects so as to keep the cost of change down, i.e. adding a field doesn't come with a lot of system changes. Keep such a service standalone and don't add business logic. 

I'd recommend avoiding enrichment pipeline flows where possible for the reasons given earlier. As just described you can always aggregate the normalised entities from a few services in one place, rather than gradually through a pipeline.  
