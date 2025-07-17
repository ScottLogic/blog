---
title: Building performant large scale web applications
date: 2019-12-17 00:00:00 Z
categories:
- Tech
author: rwilliams
layout: default_post
summary: This is a post about doing performance right when building large and complex
  web applications. Much advice is available about optimising for every last ounce
  of performance on the web, but that won't help much if we don't already have 'good'
  to begin with.
---

This post is about doing performance right when building large and complex web applications. Much advice is available about optimising for every last ounce of performance on the web, but that won't help much if we don't already have 'good' to begin with.

> **optimisation** _(noun)_ the action of making the best or most effective use of a situation or resource
>
> &mdash; Oxford English Dictionary

Applied to software performance, that definition is open to interpretation: from tweaks to eek out the last few ounces of performance, to wide-ranging rework to gain big improvements. As software professionals however, I think most of us would think of it as any work to _improve performance that is at least quite good, not involving significant rework_. Optimisation practices can help make good-enough performance better, but won't help much with making poor performance good.

This post is about achieving "good"; getting to a position where it performs at least fairly well, without large or fundamental underlying problems that are difficult and/or costly to fix. Doing that involves all aspects of software delivery. Attention can then be turned towards gainful optimisation - rather than being forced towards low-payoff optimisation or rework.

There is much to think about, so this post isn't comprehensive; more a collection of things that stick in mind as being significant or problem-causers. Nonetheless, I don't think you'd go too far wrong with web frontend performance by bearing these in mind. Individual application and organisational differences will affect many aspects. You may sometimes be better able to achieve what you need by making informed decisions to do differently. The consequences of choices in small-ish and reasonably simple applications may not be hugely significant, but care is needed at larger scale.

## Loading the right amount of the right data

The amount of data loaded should roughly reflect the amount shown on screen. When it doesn't, it's likely a sign that the frontend is loading more than it needs, or performing non-trivial calculations/processing to derive shown data from more raw data.

Loading data has costs all the way through the application stack: database workload, server processing/memory, network payload/time, and frontend processing. Loading much more than is needed, is best avoided. Bulk loading multiples of the required amount at startup or on navigation doesn't scale well with application workload or available data volume - affecting both the frontend and the backend.

The expected volume of data needs to be considered when designing and implementing features; e.g for a data grid or chart, how many rows/points in total, and how big each one is with its attributes' values. Pagination or another form of on-demand incremental loading may be needed. Retrofitting those is often difficult and time-consuming (especially once other features have been layered on top), so decide with good knowledge of current/forecast data volumes and user load, and future functionality plans. In any case, data queries (both client and API-side) need to be constrained to prevent unintentional resource-intensive requests to dump the entire database through the API and frontend.

Browser processing performance has seen vast improvements over most of the past decade, but it's still not the place to be doing heavy processing to calculate/derive shown data from loaded data. There is only one main thread, and it's a "UI thread" intimately tied with the rendering cycle - when it's blocked (busy working), screen updates are paused which results in a poor user experience. Load the data that's needed, rather than the underlying data it derives from. If this is unavoidable, offloading the processing work to a web worker can help, or investigate WebAssembly.

Existing APIs that need to be used might not follow the aforementioned principles; perhaps they were designed for scenarios other than client applications, or for heavy/fat native client applications. In such cases, a ["backend for frontend"](https://samnewman.io/patterns/architectural/bff/) server application may be needed. That's a facade over those APIs that does processing/calculation/transformation work and exposes an API more suitable for frontend client consumption. Be mindful however that this might not help with the backend consequences of loading too much data, or putting on more load on systems not designed to serve user applications.

## Streaming data

Data can also be pushed to the frontend, usually by streaming over a web socket. The "only what's needed" principle applies here too, and there is also data frequency to consider. It's the server that controls the pushing of data at the point of push, but it should do so based on the needs of the client.

The frontend should generally subscribe to particular data that it currently needs, and receive only that data. This isn't to rule-out broadcast; perhaps a rule-of-thumb is that broadcast is for events/notifications rather than significant pieces of data.

As the server controls the frequency of pushed data as well as the content, it needs to be ensured that the frontend isn't force-fed more volume than it can handle. Aside from causing performance issues (network traffic, main thread blocking), there is little (or negative, even) user value in sending/displaying more than a few updates per second. In fast-updating data sources (e.g. financial trading prices or sensor values), push frequency can be moderated by throttling (on the server side). An appropriate frequency can be chosen based on the nature of the data and the context in which it's used; not everything needs to update as fast as the fastest.

With the above in mind, avoid connecting frontend applications directly to "firehose" sources of unfiltered high-frequency data updates.

## API design

Design APIs with application use cases in mind. Disconnects here can result in excessive network calls and create difficulty in efficient backend implementation, on top of non-performance issues.

When APIs are highly normalised or fine-grained, consuming frontends tend to need to make multiple calls to get the data they need or perform logical units of work. This leads to a "chatty" interaction, with user actions causing many calls, some of which can't be fired off until others have completed (if their parameters depend on the responses of earlier calls). Conversely, when API operations are too broad/coarse, consuming frontends are forced to retrieve more data than they need in a particular context. For fetching data, GraphQL can be used to query for only required data fields and specify related data to return together with it.

Making many individual requests in parallel is much less of an issue with [multiplexing in HTTP/2](https://developers.google.com/web/fundamentals/performance/http2#request_and_response_multiplexing), however specific batch APIs can provide opportunities for efficient request handling on the server side. Aligning API design with batch use cases also has benefits aside from performance, the main one probably being transactionality. A retrieval API can return a consistent set of data at a single point in time (e.g. account balances), or an operation API can provide atomic (all or nothing) operations (e.g. place these orders).

## Devices and networks

Develop for the devices and networks that your users will use to access your application. Static or interactive websites will likely work reasonably well on anything anywhere, but that's not the automatic case for large applications.

This first requires learning about what the devices/networks are. For internal applications that's quite straightforward, but for customer applications it requires some combination of knowing your audience, data collection from existing applications (where possible), and any other available/collectable data and insights (e.g. internet speeds by country).

Knowing those, regularly use similar devices and network conditions during development, testing, and demos. By doing this everyone experiences the application as users will, and will notice any issues quickly. Typical development computers have higher spec than most users will have, and are on the same local network as the backend. Your phone might be higher spec than your average user's one, be replaced more often, and on the great 4G network in the city. Emulated mobile browsers on desktop computers perform much better than real mid-range mobile devices. Browser developer tools can partly simulate slower devices through throttling, but this is a convenience rather than a replacement.

There are various tools available for simulating network latency/bandwidth at the browser level (devtools, extensions) and operating system level (e.g. win-shaper). It's however probably not practical to have these permanently enabled while working. In local development, consider adding artificial request delays by using a proxy server (e.g. [built in to webpack devserver](https://webpack.js.org/configuration/dev-server/#devserverproxy)) or programmatically in your application. This helps draw attention to when network requests are being made. With near-instant responses locally and complex code where cause and effect are decoupled (e.g. Redux), it can sometimes be easy to not realise that something you do actually involves a network call (or a chain of them). It might be unexpected/unnecessary, or a loading state/indicator might need to be added.

## Development and testing environments

Just as a problematic development surroundings can destroy developer productivity, some aspects of it can also hamper efforts to deliver good performance. It needs to be fast, and it needs to be reasonably realistic.

Developing performant software requires a situation where it can be allowed to work performantly. When the environment around it prevents this, performance issues with the software are hard to distinguish from those caused by the environment around it. Slow becomes the normal, and tolerated. New performance issues don't stand out. Any specific slowness is attributed for example to a slow test environment backend, or and inadequately-provisioned development virtual machine. Contrast with a fast development/test environment: anything being slow is unusual, stands out, and is unlikely to be dismissed without investigation.

That said, neither do we want to allow our software to be performant for the wrong reasons. Typically in my experience this is due to not having an adequate amount of (realistic) mock data in development and test environments. An application may be filled with such data for load testing, but it's immensely useful (and not only for performance reasons) to have it there while the team is developing and testing as well. Problems can be noticed sooner, coverage of scenarios is increased, and it makes ad-hoc performance checks/profiling easy. Approaches to making mock data available include random generation, and anonymised production data.

## Observability

We can only see performance as we experience it. To understand it, and to see/understand how users experience it, it needs to be made observable. Only then can we really know how we're doing in the real world and why.

[Real user monitoring (RUM)](https://stackify.com/what-is-real-user-monitoring/) is the passive collection of performance measurements from a frontend application while the user is using it. The application itself measures time taken for various meaningful user actions to be dealt with, and sends these to a data store together with some contextual information. These can then be compared against expectations, analysed, and monitored for sudden changes or trends. They can also be drilled into to help diagnose problems or find areas for improvement: the breakdown of timings along with the contextual data allows performance (good or bad) to be understood and attributed to particular causes. For example, we could find that a feature isn't performing well on mobile devices, that a particular user action is slow for some types of users because the API call is slow to respond, or that our latest release harmed/improved performance of a feature.

During development, many features provided by browser developer tools can be used to observe and analyse performance. The main ones are the network and timeline tabs. As an application grows more complex, it can be useful to supplement these for example with custom user timings on the timeline and conveniently-accessible custom metrics about the state of the application.

## Expensive runtime work

In any type of application on any technology, executing expensive operations will affect performance. Awareness of this in general, and aspects specific to frontend development, can help us know when to be cautious and also when not to worry.

Some things are expensive, other things are cheap. The main expensive things to be aware of in web frontend probably are: blocking the main thread with large chunks of work (thus blocking the event loop and rendering), DOM manipulation, and network requests. These need to be thought about. Cheap things include iterating arrays; the approach used won't make a meaningful difference to performance, so there's no need to be concerned - the simplest/cleanest approach can be used.

Libraries and frameworks bring their own expensive things to be aware of, so it pays to have an understanding of what happens under the hood and specific recommended practices. For example, creating Moment.js objects is expensive at scale, and various operations in jQuery (you most likely don't need it anyway) have expensive side-effects to deal with browser bugs. Take particular care with new frameworks (past example: AngularJS with its watchers and digest cycles) or new patterns/techniques (e.g. [micro frontends](https://martinfowler.com/articles/micro-frontends.html)) whose capabilities are not yet as well understood/explored. Most frameworks will likely execute a lot more code than you might expect in response to even the simplest application events, and generally this won't be a problem in modern browsers.

Code that's difficult to change needs particular care, a specific example being utility or framework code used application-wide by other code. We can optimise its internals without changing behaviour, but fundamental inefficiencies in its behaviour can be difficult and risky to change due to other code relying on that inefficient (and possibly unintentional/undocumented) behaviour. It's worth profiling and checking the behaviour up-front here, even if it's not (yet) causing performance problems - this would not be premature optimisation.

Animation and transitions deserve a special mention. Unimportant as they are to functionality, poorly performing ones are particularly noticeable and affect the user experience. They aren't expensive, but can easily be affected by unrelated code on the main thread. The key is to avoid involving the main thread, and avoid causing layout reflow - use the [FLIP technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/).

## Testing and user personas

Performance testing isn't only a backend consideration. The frontend can be affected by many of the same factors that affect backend performance, and in many applications is the only/primary interface for users. Usual advice applies: test early, test often.

Providing sufficient and realistic mock data for testing was covered in an earlier section, as was consideration of user devices and network connections. In a complex system, data isn't the only prerequisite to testing application performance in realistic scenarios - user accounts need to be available, and configuration needs to be in place for example.

User personas are often used when considering functional requirements and UX, and they can also be applied to performance. By defining performance-focused ones (or adding it as an aspect to existing ones), we can better keep performance in mind throughout the development process. For example: user with a budget phone, rural user with slow network, user on the other side of the world, veteran user who has accumulated a large amount of data, professional user with heavy use. We can also use them to set up corresponding ready-to-use users in development/test environments that can be used to experience the application in the scenarios of those personas.

## Culture and requirements

Many applications achieve the performance they need with quite a light focus on it. To master it and achieve that every time however, it helps to consider the way we think about and work towards performance.

Performance is a feature. As such, it needs to be cared about from idea through to production, by everyone. The requirements and context for performance need to be defined and discovered, the architecture and technology designed and chosen to support them, and the application tested against them. These are easy things to agree to, but can be difficult to stick with when it's inconvenient - and that's sometimes fine; we may need to take a conscious decision to compromise because it's not worth it, or something else is more important. Problems build up however when compromise, deprioritisation or non-acknowledgement is chosen too often.

In a large application, it's impractical to define and test performance requirements for every possible interaction and scenario. Generic non-functional requirements for performance can however be defined. Response and completion times are an example - the times taken respectively for a user action to be acknowledged and completed. Following the [RAIL](https://developers.google.com/web/fundamentals/performance/rail) model, we could for example require that a click is acknowledged within 100ms, and that the action triggered (e.g. changing a view, placing an order) is completed within 700ms. Sometimes there will need to be exceptions, other times however alternative interactions can be designed that are just as acceptable but work around constraints (e.g. slow upstream systems) in a creative way.

Performance aspects of software development can also be included in a learning culture. By cultivating interest and continuously improving understanding and skills, and retrospecting on past mistakes (from a blame-free mindset) and successes, we can become better at it.

## Closing thoughts
Performance can be a tricky aspect of building software. Sometimes it'll turn out fine without doing much in particular, other times it can cause big problems if attention isn't paid to it every step of the way. It often lies near the bottom of agendas, until it rises quickly and then isn't. It's fairly easy to get away with fundamental problems (or shortcuts) early on, only for them to gradually start to bite later as the application grows - at which point the underlying issues and decisions are difficult to put right.

When the fundamentals are right, and we have built "good enough", optimisations can be made to improve it. When they aren't however, it's hard to add performance later as an afterthought - it takes more than optimisation or tuning. If there's one piece of advice for performance, it's probably to trust your gut and not let any doubts or questions go unresolved.
