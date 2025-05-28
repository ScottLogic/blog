---
title: Advice on transitioning from a legacy API
date: 2025-05-28 11:11:00 Z
categories:
- Tech
tags:
- legacy IT
- API
- ''
- Application Programming Interface
- Energy
- Energy Trading
- agile
- software testing
- solution architecture
summary: We have been helping a client migrate their trading platform to a new version
  of a third-party API, and the migration is more interesting than usual for a few
  reasons. Given those aspects of the project, we thought that it might be useful
  if we shared some insights from our experience.
author: glewis-scottlogic
---

We have been helping a client migrate their trading platform to a new version of a third-party API, and the migration is more interesting than usual for a few reasons. We’re working in a context where the specification is not fixed, but the deadline is – there will be a ‘big bang’ switchover, but significant changes are still being made to the external API close to the go-live date. In addition, the new version of the external API combines important functional changes with modernisation and a shift to a new protocol. Given those aspects of the project, we thought that it might be useful if we shared some insights from our experience.

The client’s trading platform connects to multiple exchanges via each exchange's individual (and, of course, disparate) API. The external API we’ve been working with on this project is owned by one of those exchanges. It is transitioning from a legacy SOAP API to a new version that is RESTful and uses JSON and takes a different approach to authentication; in layperson’s terms, the new API has a completely different message format, and the structure of the API surface is also completely different. We’ve been building and testing a new API for our client to interface with the exchange’s new external API.

Our advice in this blog post falls into three main areas, the first two of which are relevant to all projects that involve transitioning from a legacy API to a new one. The last is more relevant to projects like ours, where the API you’re interfacing with is still being designed and built.

## Keep things loosely coupled

Let’s start at the beginning. When you’re setting out to design the architecture of your own application, it’s crucial to ensure a clear separation between your business logic and the business logic of any external APIs. You need to get your abstractions right at this stage in order to avoid baking in any dependencies between systems. For example, the external API’s documentation might encourage you to make API calls on a daily basis and you might bake that into the business logic of your platform; however, another external API might parcel up its data at a different cadence which is now not compatible with your platform’s updated business logic.

Your API plays the role of a translator. It makes API requests at a cadence determined by the external API’s owner and receives data in a format and structure determined by that owner. Your API’s role is to take the data from the external API and translate it to fit your business logic and your data formats and structures. 

Taking the example of our client, its trading platform collates data from all the exchanges and presents it in a web user interface of the client’s own configuration, suited to its own business logic. The new API we’re building and testing for our client will not require any updates to this interface, because the business logic has been kept completely separate from that of the external API. For example, the creation, modification and deletion of curve orders is handled by just one API call from the client’s application; the middleware we created then determines whether it is a create, update or delete before making the appropriate call to the external API. Any future changes to the external API will likewise have a minimal business impact, simply requiring a further update of the client’s API, but not the client’s trading platform.

While the above advice might sound obvious, it’s surprisingly easy to be led (sometimes subtly) by an external API’s logic. It’s worth taking the time at the beginning to make sure you’ve avoided that trap, and then to remain vigilant throughout the project – the trap is ever-present!

## Verify early and directly

Our second piece of advice is never to rely solely on the documentation for the external API. In theory, you could just start writing code based on the external API’s spec and then run tests once the coding is complete, but that’s a recipe for rework. Instead, the better approach is to test each new release of the external API directly to verify its behaviour, and to do this before you start coding. External API owners will often provide simulation environments. If that’s the case with your project, we’d recommend spending a couple of hours with each new release using a tool like Postman to interact directly with the external API, observe what it does with the data across a range of use cases, and relate your observations back to the documentation. There’s a chance that the documentation contains errors or that you’re misinterpreting it. The sooner you can find this out, the better. 

To build on that advice, we would recommend that you don’t just test the happy path. While it’s unlikely that you will have time to test all possible edge cases, it’s important to think through the spectrum of edge cases and aim for a good representative slice. Testing these against the external API will provide confidence that it’s behaving as expected or help to flag issues that might otherwise have been missed.

With some edge cases, it can be hard to test them in the simulation environment, so we have also been running automated tests on our client project using WireMock. This allows us to create mock-ups of the external API to simulate various scenarios. Not only has this allowed us to test a wider range of edge cases, but it’s also sped up our coding; we’ve been able to code within the test framework simulating each edge case, iterating our code quickly until we got it right. Given the complexity of the external API, we have probably spent as much time setting up our automated tests as we have coding, but the overall time saving has been significant, helping us avoid time-consuming rework.

Another time saver when you’re transitioning away from a legacy version of an external API is to look back at the tests that were written for the previous version. They might highlight some useful edge cases to factor into your testing of the new version. By the same token, you can be kind to your future self by doing a good job of writing your tests for this new version of the API; this will save you time when it, in turn, becomes a legacy API you’re transitioning away from.

In summary, we advise you not to underestimate the effort required in writing your tests, and to ensure that you don’t cut corners. The more comprehensive you can be, the more time you will save yourself, both now and in the future.

## Be ‘Agile’ where you can, but always be agile

As mentioned earlier, our last piece of advice concerns projects where you’re transitioning away from a legacy external API to a new API that isn’t yet fully specified or built – especially when you have a hard deadline that you must meet. In such instances, standard Agile (with a capital ‘A’) practices cannot always apply. For example, in Agile planning and delivery, it’s good practice to split the team’s work into sequential epics and to complete work on one epic before you commence work on the next. However, on our current project, we identified key risks and uncertainties in the second epic that we wanted to address before we completed all work on the first. While that may not be Agile best practice, it was the right thing to do in managing our project risks and to give us confidence we could meet the deadline.

The same agility is needed in order to adapt your plan in light of new information. On our current project, the external API owner is providing new information with each release in the form of documentation and webinars, and these updates include new or planned changes to the API. It’s been crucial for us to consume and digest this information as quickly as possible, so that we can assess the impact on our backlog of work and make our recommendations to the client on how the plan needs to be adapted to stay on target. 

In some instances of this iterative release of information on the external API, we have had “known unknowns”. For instance, we knew that the authentication approach was going to change and that we would not have details on this until later in the project. As a result, we kept our plan flexible, factoring this in as a key uncertainty and shaping our plan so that we didn’t waste any time on authentication-related code before we had the information we needed. There are also “unknown unknowns”, and you need to be agile enough to adapt to these. On our current project, the external API owner may require some sort of conformance testing at a later stage, or they might not. We don’t yet know for certain. We’ve ensured that there’s contingency built into our plan to tackle such eventualities.

May all your API projects have clearly defined specs at the beginning. However, as that unfortunately won’t always be the case, we hope you’ve found some useful insights in this blog post to run an efficient and successful API transition project that meets its deadline.