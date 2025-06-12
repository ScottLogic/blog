---
title: A proven approach to legacy modernisation that delivers early value
date: 2025-06-12 15:37:00 Z
categories:
- Tech
tags:
- legacy modernisation
- desktop containers
- desktop integration platforms
- desktop interoperability platforms
- FDC3
summary: We’ve been working with a market-leading energy trading firm that’s taking
  first-mover advantage in the energy sector by adopting a desktop interoperability
  platform.  In this blog post, I’ll provide an overview of how they work, outline
  the main benefits they deliver, and flag some trade-offs to bear in mind.
author: daustin
---

When you’re working with a complex legacy IT estate, it can often feel like the value to be delivered from legacy modernisation strategies is on an ever-receding horizon. However, an approach pioneered by the financial services industry in recent years can unlock early value, and in a way that places no dependencies on the wider modernisation programme.

The approach in question is the adoption of desktop interoperability technologies. In this blog post, I’ll provide an overview of how they work, outline the main benefits they deliver, and flag some trade-offs to bear in mind. I’ll describe the approach without getting into too much technical detail. If you’re involved in legacy modernisation at your organisation, I hope this post will be of interest, regardless of whether you’re on the business side of things or the technical side.

We’ve been working with a market-leading energy trading firm that’s taking first-mover advantage in the energy sector by adopting this approach. In doing so, it will benefit from streamlined processes, enhanced business agility and improved productivity, while the company's legacy modernisation programme progresses in parallel.

## How desktop interoperability platforms work

Energy trading professionals typically work with a wide range of disparate systems in an application estate that has grown over time. This results in a range of inconsistencies in user experience and interface quality, leading to fragmented workflows that are inefficient or frustrating for the end user.

Desktop interoperability platforms connect an ecosystem of web and desktop applications, allowing communication between them in support of user-centred workflows. These loosely coupled applications all live within a framework that is easy to deploy, update and maintain. [Open standards such as FDC3](https://fdc3.finos.org/), which was developed collaboratively across the financial services industry, provide an agreed framework for communicating data and actions between applications, and a route for including compliant third-party applications within a workflow.

We’ve been supporting our client by applying some customisations to its chosen desktop interoperability platform – [io.Connect Desktop](https://interop.io/products/io-connect/) – and writing some small, self-contained web apps to run within it. These apps are fed live data by new backend services that communicate with the client’s legacy systems, aggregating and transforming data from across the legacy estate. The apps then present this live data in clean, modern user interfaces. In this way, the apps ‘break up’ the monolithic applications they’re interfacing with, decoupling different workflows and functions. This allows the tailoring of the apps to the specific needs of the user, creating a new, enhanced desktop experience. Through this approach, end users are migrated to the new systems gradually, giving them time to become familiar with the new designs, and building trust in the system.

By prioritising which web apps to build, the business is in effect making selective decisions about which parts of its legacy applications are still important, and this can become a key input into the wider modernisation strategy. Let’s now look at what else this approach allows you to achieve.

## Leveraging interoperability

The web apps we’re building for our client can run in the browser (with slightly reduced functionality) and there are users who require that capability. However, they function best when run within the desktop interop platform. That’s where users benefit from all the interoperability and personalisation features these platforms offer, enhancing their productivity.

Platforms like io.Connect Desktop provide the means of setting up consolidated single sign-on to applications, enabling users to log in once when they open the platform. So, instead of having to log into a number of separate systems and arrange their screens each session, users can set up their preferred work environment and save the layout for future use. In some cases, company policies require credentials to be entered with greater frequency, e.g. every 24 hours; again, we can minimise manual interaction by redirecting this through the platform so that the login is handled once for every open app we’ve integrated.

Whereas the underlying systems have disparate interfaces, the web apps present a consistent interface to the user. With each web app loading in its own window, it’s possible for the user to snap windows together, creating a highly personalised layout. They can be further personalised by persisting user preferences; for example, if a user is only interested in certain markets, they can configure what they see in each app, resulting in an experience tailored to their current task.

The single desktop interface collates and presents personalised notifications from the user’s chosen web apps, each of which might be drawing data from a different legacy system; clicking on the notifications takes the user to exactly the screen they need.

## Keeping things decoupled for optimal flexibility

By splitting a legacy application into a cluster of web applications, you can intentionally design the web applications to be small and self-contained, with minimal dependencies. This has a range of benefits.

For one, it’s possible to migrate away from the underlying legacy system to a new system with no impact on the user. So, you might have developed a web app that presents a streamlined modern interface to the user, tailored to their needs while still connected to the endpoints of the legacy system. Here, we can essentially decouple the user interface from any such [“Big Bang” migration of API systems](https://blog.scottlogic.com/2025/05/28/advice-on-transitioning-from-a-legacy-api.html). At the point of any backend migration, the best-case scenario is that you simply repoint the web app’s dedicated service to the endpoints of the new underlying system. Otherwise, you have time to adapt the service to any new APIs or data sources. Meanwhile, the user experiences an uninterrupted service, with the same data being served up to them as before, accessible via an interface they’ve already had time to adjust to.

Decoupling the frontend also largely simplifies access control requirements. Consider the approach of a single large user interface where you might need complex rules governing read and write access to various sections or components within the app. In our client’s use case, this can be achieved by granting permission to a group of users to view an app. For example, say a department involved in reporting or forecasting needs access to the market summary, we can simply grant them access to view that app.

Another key benefit is the potential for horizontal scaling. The client we’re working with is spinning up new teams to develop additional web apps and this is introducing no new conflicts with existing teams. Each team develops its self-contained web application and connects it into the desktop interoperability platform. The legacy modernisation programme continues in parallel, with different areas of the business able to move at a pace that best suits them.

## Harnessing reusability

One key benefit I’ve observed during this project is that an intentional approach to component design and reuse results in compounding gains as the project progresses. This intentionality has allowed us to identify any components that are likely to be shared between apps. The more apps we’ve designed and built, the better our toolkit of components and design patterns has become.

When shared across teams, this has obvious benefits such as cost savings and efficiency. However, what it also means is that you can incrementally shape a coherent, consistent interface for all your systems, replacing the mess of disparate interfaces in your legacy estate. This does not require significant up-front design; it simply requires you to be focused in looking for opportunities for reuse as you develop each web application, and willing to spend a little extra time extracting the functionality that your future self and future colleagues will thank you for.

This not only speeds up our work but also speeds up the work of the user who knows that a given interface feature will behave in the same way in whichever app they use. This also enables users from different areas of the business to benefit from existing work, preventing duplication of effort and cost.

This reusability – whether in the form of frontend interface features, shared interoperability features such as the login helpers, or backend patterns for streaming live data and managing complex application state – allows us to progress from concept to MVP (and beyond) at an incrementally faster rate.

## Inevitable trade-offs

These platforms aren’t a cure-all, and they introduce new issues to manage. They increase the surface area for potential vulnerabilities by allowing data flow between the apps. In relation to performance, they introduce a new abstraction layer that enables communication between applications, but which also consumes system resources. If not optimised, this communication between apps can also introduce delays in data exchange or interface responsiveness. However, through best practices such as regular security audits, along with effective coding practices, lazy loading of services, and the use of performance monitoring tools, this can all be managed.

The more apps you build, the more apps you need to maintain. While you should minimise dependencies between the apps, they can’t be eradicated completely – after all, the apps are communicating with each other. Consideration must be given to the overall workflow; however, increasing your regression testing can protect against unwittingly breaking these. With clear documentation, a solid change management process, and a robust automated testing strategy, you can reduce the maintenance burden significantly.

No technology implementation comes without trade-offs, and the challenges that desktop interoperability platforms introduce can all be managed and mitigated. What’s more, any issues they bring are dwarfed by the challenges that come with managing a legacy IT estate. As I hope I’ve conveyed in this post, desktop interoperability platforms allow businesses to unlock early business value as large-scale legacy modernisation programmes progress in parallel. It’s delivered on its promise in the financial services industry, and it is starting to do the same in energy trading.