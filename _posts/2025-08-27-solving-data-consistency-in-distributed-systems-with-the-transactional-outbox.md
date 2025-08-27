---
title: Solving Data Consistency in Distributed Systems with the Transactional Outbox
date: 2025-08-27 00:00:00 Z
categories:
- Data Engineering
summary: Distributed systems often struggle with data consistency. In this post, I explore
  how the Transactional Outbox pattern helped us solve this challenge in a client project,
  and how it compares to CDC and Event Sourcing.
author: mdunsdon
---

Our software systems are becoming increasingly distributed, and to support the needs of our business we face new challenges in keeping our data consistent. The Transactional Outbox pattern allows your individual components to own the data they are concerned with, whilst providing an atomic operation that persists data and records events. It is this capability that can give your distributed systems the strong data consistency guarantees you may be looking for.

In this post, I will walk through how the Transactional Outbox pattern works, why it is useful in distributed systems, and some of the practical considerations encountered when applying it in a client project.

## What Is the Transactional Outbox Pattern?

My introduction to the Transactional Outbox pattern came during a client project where event-driven resiliency and data consistency were critical requirements. One of my colleagues had proposed using this pattern as part of the system's architecture. It was intended to ensure that events were reliably emitted whenever the datastore was written to, both for auditability and as part of a data processing pipeline. With data and event operations being atomic, it would meet the requirements.

On a practical level, the Transactional Outbox pattern works by requiring you to commit both the data record and the event payload to a datastore using a single transaction. Typically these event payloads are written to an "outbox" table. In addition, you need to have a messaging service, which can access this datastore, to take new event payloads and emit them as events to your event ingestion service. This gives a guarantee that the event and the data record will have been persisted together, yet it doesn't guarantee the event will only be emitted once.

![Diagram illustrating the transactional outbox pattern. It shows a component writing to a single datastore, including both data tables and an "Outbox" table as part of a transactional commit. A messaging service polls for changes in the outbox table and forwards events to an event ingestion service.]({{ site.github.url }}/mdunsdon/assets/transactional-outbox-diagram.svg "Diagram showing Transactional Outbox Pattern")

The Transactional Outbox pattern has edge cases where a single event can be emitted multiple times. The messaging service can emit an event and fail before marking the entry in the "outbox" table as processed. This means you need to design your systems to have idempotent events. For the client project I was on the event payload identification generation process was deterministic, which allowed the components consuming events to check whether they had seen that event identifier before and ignore duplicate identifiers.

The Transactional Outbox pattern ultimately prevents specific data inconsistency cases from taking place.  To appreciate the impact of this on our systems, we need to consider the dual-write problem as well as consider alternative solutions.

## Solving the Dual-Write Problem

The dual-write problem describes the challenge in getting a change across two separate services. Typically there are architectural limitations that mean that there are no guarantees that this happens atomically, with the changes either succeeding or failing together.

When looking at the risks that our distributed systems can face, if we are not addressing the dual-write problem, then specific failures can lead to data consistency issues. Should we first emit the event, then a failure could occur before a attempting to write to the datastore. Likewise if we choose to write and commit to our datastore first, then there is the case where we could fail to send out the corresponding event.

![Diagram showing a transactional event publishing flow with a key failure point. It includes three components, which are our component, datastor, and event ingestion service. The flow highlights typical CRUD operations, transaction boundaries, and a failure point between committing the transaction and emitting events.]({{ site.github.url }}/mdunsdon/assets/data-inconsistency-scenarios.svg "Diagram showing Failure Points with Dual-Write Problem")

One example of the the dual-write problem is the auditability functionality I was working on. Our components needed to interact with Azure Cosmos as the datastore and Azure Event Bus as the event ingestion service. Both these services were great at providing the capabilities they were designed for, yet there was no first class support for providing transactions across them.

Without considering the dual-write problem, there is a risk that these data consistency scenarios could take place. We have to make the call about the costs that inconsistent data can bring to our business and plan accordingly. Our operation teams can take action to discover and rectify any issues, though this assumes that they have been alerted to any data discrepancies in the first place. 

The Transactional Outbox pattern is one of the solutions to the dual-write problem. This pattern encourages using the datastore as the single system for writing the data records and the event payloads, as well as proposes a strategy for emitting those events written to the datastore.


## Alternatives: CDC and Event Sourcing

Whilst the Transactional Outbox pattern can provide a solution to the dual-write problem, there are other options in this space. The first approach is the Change Data Capture (CDC) pattern that captures changes, typically from the database logs, to facilitate event creation and emission. By your components only needing to write to the datastore, the only interaction is with a single service and can therefore avoid the dual-write problem.

![Diagram illustrating the Change Data Capture (CDC) pattern. A component writes to a datastore containing data tables. A separate event generation service polls the datastore for changes and emits events to an event ingestion service.]({{ site.github.url }}/mdunsdon/assets/change-data-capture-pattern.svg "Diagram showing Change Data Capture Pattern with Polling-Based Event Generation")

For CDC there can be some benefits regarding implementation effort, in comparison to the Transactional Outbox pattern. If you have an existing system without event generation, the event generation service can generate events and give you auditing capabilities without requiring changes to your component. Similarly for greenfield projects, you can keep your components simple and just have the event generation service be responsible for the creating and emitting events.

There are a couple of negatives to be aware of with CDC. One drawback with CDC is that the messaging service needs to take on the responsibility for generating the event payload. If you need consistent event schemas, the messaging service becomes tightly coupled to the data record schema. This makes it sensitive to schema evolution in the datastore.

Another drawback is if you have an existing system with event generation, then the CDC pushes you down the path of only persisting data. As discussed in the previous paragraph, moving event payload generation into another component does not give you many benefits.

Additionally, if you are looking to introduce auditing, the messaging service will need to know who or why an action was triggered, but looking at a data change typically will not provide this information. 

An alternate solution to the dual-write problem is the Event Sourcing pattern. Event Sourcing offers a fundamentally different approach by treating events as the source of truth. Using this pattern, our components just need to send events into the event datastore. The dual-write problem therefore avoided, as the event datastore become the single service that is written to.

![Diagram illustrating the Event Sourcing pattern. It shows a command input being handled by a command handler, which emits domain events to an event datastore. The datastore is used to rehydrate aggregates, append new events, and build a queryable view. Queries are handled separately via a query handler accessing the read model]({{ site.github.url }}/mdunsdon/assets/event-sourcing-pattern.svg "Diagram showing the Event Sourcing pattern: from Command to Event and Query to Queryable View")

In terms of the benefits for the Event Sourcing pattern, if you have a greenfield project or are using the CQRS pattern, then the difficulties in adopting this pattern are reduced. Unlike the CDC or the Transactional Outbox pattern, the event generation service and messaging service are not needed. 

Regarding infrastructure, the Event Sourcing pattern needs you to use an event datastore. Depending on your organisation, this could be a new infrastructure concern, so in this case there could be resistance in adopting the pattern. An addition you need to implement aggregate and build a read model, which you might choose to deploy separately to the component that provides command and query handlers, so there may be more individual components to deploy and maintain.

One drawback is that there are additional considerations needed for querying when using Event Sourcing, often the recommendation is to adopt the CQRS pattern, so if this pattern is unfamiliar to the development team then this can be costly. Given events are the source of truth, you need to make queries for rows of data over a queryable view and this view will need to be build from aggregating over events.

An additional drawback is that when there are existing functioning components in your system, there is a learning curve and additional effort needed to retrofit the Event Sourcing pattern. If you can overcome this, and you are able to ensure there are good bounded contexts in your domain-driven design, then you gain the flexibility to easily add new components and new kinds of events.

## Lessons from a Client Project

For the Transactional Outbox pattern, there were several pros and cons when applying this to a real client project.

One of the benefits were that the pattern allowed the team to focus on writing records to the datastore, especially early on. If we wanted to test that auditing events were being generated, we could just call the application code locally and verify that the records and event payloads were being correctly written to the datastore. It meant we could run locally without needing Azure Event Bus emulators.

Another benefit was in deferring the creation and deployment of our messaging service. We were intentional with how identifiers were generated and could use unique constraints in the datastore to only act once for a specific event. We focused on unit testing to begin with and we started integration testing once the message service was in place.

A final benefit came from using the Azure Cosmos datastore. It provided a change feed capability as well as a time-to-live (TTL) attribute for each document.  In combination this meant that the messaging service could use the change feed to track which events had been processed and allow Azure Cosmos to be responsible for cleaning up old events.

The major drawback to the Transactional Outbox pattern was the need to implement the messaging service, which would not be needed if we would have chosen the event sourcing pattern. For other teams in the project, Azure Cosmos was not suitable for their needs, so the messaging service for those teams was additionally responsible for polling for changes, locking rows in the datastore and clearing up processed events.

Whilst I think that the Transactional Outbox pattern served the project well, I am curious why Event Sourcing was not chosen. This was a greenfield project, where we had the opportunity to support the client through the implementation of their distributed system. My suspicions are that there was not enough interest by the client for this, as we would need to have event datastores and have a willingness for learning how to develop and maintain an event sourcing system.

Ultimately, the Transactional Outbox pattern helped us meet our goals for consistency and reliability in a distributed system. While other patterns offer alternatives, this approach proved practical and effective for our client’s needs.

## How can we help you?

I hoped this blog post challenged you to think about the distributed systems you are responsible for and how data is consistent across the individual components.

For more details on the ways we can help your organisation build distributed systems with data consistency and reliability, visit our [Architecture & Tech Advisory]({{site.scottlogic.url}}/what-we-do/architecture-tech-advisory) and [Modernisation & integration]({{site.scottlogic.url}}/what-we-do/modernisation-integration) pages.
