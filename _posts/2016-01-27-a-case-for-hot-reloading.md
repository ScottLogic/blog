---
title: A Case for Hot-Reloading
date: 2016-01-27 00:00:00 Z
categories:
- cprice
- Tech
author: cprice
layout: default_post
---

Hot-reloading UI is a **hot** [topic](http://gaearon.github.io/react-hot-loader/) [at](http://blog.mgechev.com/2015/10/26/angular2-hot-loader-hot-loading-tooling/) [the](https://github.com/cyclejs/cycle-core/issues/46) [moment](https://github.com/gaearon/redux-devtools). I want to take some time to explain why, in the class of applications I typically work on, I believe it to be such an important feature for future UI frameworks to have.

Fundamentally it's about improving the developer workflow, improving the efficiency of iterating on the small details of the UI, the subtle design and interaction tweaks, that disproportionately improve the user perceived quality of the application. Before we get into that though, a quick detour to provide some context.

## A primer on trading systems in *large organisations*

For the past few years most of the projects I've worked on have been trading systems. They're normally built on behalf of *large organisations* and have hundreds or thousands of users, with a significant fraction of those logged in at any one time. The UI itself commonly looks something like this (excuse my somewhat ironically lacking design skills!) -

    /----------------\
    | chart | watch  | // <- pre-trade
    |       | list   |
    |----------------|
    | trade tiles    | // <- trading
    |----------------|
    | blotter        | // <- post trade
    .                .
    .                .

### Typical functionality

The platform might contain anywhere from a handful of instruments e.g. major FX crosses, through to thousands e.g. equities, through to hundreds of thousands e.g. derivatives. The prices of these instruments can tick at phenomenal rates but are normally throttled back to 1-60 updates per second before being sent to the client. Depending on the instrument, the users either trade directly on these streaming rates or enter orders based on the rates.

As well as trading functionality, the systems often have a pre-trade offering to help users decide on the most appropriate trade. Charts will typically provide many years worth of historic data in daily buckets, increasing in resolution to 1 second buckets as you approach the latest values. There's also commonly live news streams and proprietary research feeds in the platform.

Once trades are performed, all trading activity is shown in the blotter. Typically this defaults to showing today's trades as they happen but allows querying of a user's entire trade history. Allocations and other post-trade activities can then be accessed from this blotter.

### Typical architecture

In *large organisations* it's typical for this load to be managed by an incredibly vast and complex network of interconnected sub-systems, on the front of which sits the UI. These sub-systems range from modern and expensive fast-moving pricing engines (stale prices cost money!) through to decades old mainframe-based ledgers (slow accounting doesn't *directly* cost money...).

If you're picturing this as a loose collection of containerised micro-services each servicing a specific piece of functionality: stop. It is far more accurate to picture it as an unstable container ship, rolling in heavy seas, kept on course by a huge amount of very dedicated, incredibly skilful crew, albeit a crew with hugely conflicting priorities.

## The UI development cycle in *large organisations*

That's all a long-winded way of saying that: in these systems it is not unusual for bootstrapping the application to take 10 seconds or longer. As a result the UI development cycle (code change -> build -> change visible) can be painfully long!

Where possible this can be worked around by designing into the server-side architecture appropriate pre-fetch and caching strategies. However, sometimes that's not possible, it's a work in progress by another team or it is simply not a priority.

Frustratingly, a user's negative opinion of a system can be so easily shaped by things which are incredibly easy to fix. We spend a lot of money working with UX designers to ensure that at the macro level the design and UI flows are the best they can be. Yet at the same time, I'm as guilty as anyone of glossing over a slightly misaligned control or janky animation because fixing it would require many iterations of that painfully long UI development cycle.

These aren't challenges unique to trading applications, the finance industry or even *large organisations*. I'm also certainly not the first person to document them. It does bother me how quickly they are dismissed though. It's always *just* a case of teams *trying harder* in a certain area to improve the cycle. However, I believe that no matter what you try, they'll always be a compromise.

### Test-driven development

Tests obviously form a large part of a trading application, it would be almost impossible to regression test a platform without them. However, in a UI there's a lot of design and interaction that is very difficult to test in an automated fashion. Ultimately there are always times when you need to see and play with a component in order to validate it.

### Harness-driven development

UI component harnesses allow a component or component tree to be hosted outside of the application. They are probably the best way of probing every possible state of the UI. However, viewing one component in isolation sometimes doesn't allow you to gauge the design or interaction in the required context. Therefore the harness ends up hosting ever larger trees of components. The larger the component tree the more harness specific configuration is needed and maintaining the harness for the tree of components can easily become an unjustified burden.

### Mock-driven development

Mocks are a very quick way of responding to client requests whilst still exercising a significant fraction of your UI and business logic. They can be a burden to maintain but it's common that they are maintained, to some extent, as part of the test suite.

However, it is unusual for a set of mocks to cover every aspect of the functionality of an API. They're also unlikely to accurately reflect all of the quirks of the real implementation (otherwise you wouldn't need integration tests!) or there may also be functionality which isn't considered worth mocking. For these reasons it can be beneficial to develop against the real API.

### Dependency-driven development

*N.B. my succinct title generator failed at this point...*

It is very common to organise UI code in to loosely coupled components, each of which have self-initiated subscriptions (via client-side services) to back-end services. This is definitely a *good thing*. In theory, with this design you can disable all but the UI component you're currently working on and have a very quick startup time. However, sometimes it can be the subscriptions required for that one component that take all of the time, or worse, a horrible chain of sequential calls you're forced to make.

### DevTools-driven development

The browser developer tools allow you to modify the DOM structure, styling and even code in real-time. In the case of styling and code, if you've got the right setup you can even map the source files back to your file system. However, when it comes to the mapping between the rendered DOM and your code/templates there's somewhat of a disconnect. It's possible to make the changes in the browser and then transcribe them back to the code/template but sooner or later you end up having to refresh to make sure it all comes together.

### Style-driven development

As well as editing the styles in the browser, it's now very easy to setup hot-reloading of stylesheets. You make a change in your editor of choice and within a fraction of a second, the styles have been pushed into your browser without refreshing and losing the state of the UI.

This always feels to me like the ultimate UI workflow but it has its own downside. As it only works with styles, I end up opting to inappropriately do as much development as possible in the styles rather than the code/templates because I can iterate so much more quickly.

## The compromise

Either individually or combined, these solutions can solve the problem. Although they often end up requiring unnecessary effort or quality compromises! Deadlines often force developers to make pragmatic decisions to deliver, and in my experience, anything causing undue effort outside of the core functionality of the platform will be sidelined.

Don't get me wrong, in many ways that's a good thing. The application functionality is delivered on time in a thoroughly tested and stable state. It's just that final bit of polish to the design and interaction of the UI, that we all know makes the difference, ends up not happening because of the extra time involved in iterating a few more times.

What if there was a way to iterate more quickly on the UI design and interaction in code/templates, without having to maintain mocks/harnesses/tests/etc. specifically for that purpose?

## Hot-reloading UI code/templates

As I described in *Style-driven development*, I consider hot-reloading to be the ability to make a change to a file in your editor and in a fraction of a second, see the resulting UI. Crucially this should happen without losing any of the UI state through e.g. refreshing the page.

<p style="text-align:center"><img src="{{ site.baseurl }}/cprice/assets/hot-reloading.gif"></p>

With a near instant development cycle, there's no longer an excuse to gloss over little tweaks, you can iterate on a solution in seconds rather than minutes. No more clicking through the UI to get it into the state you need to reproduce the issue. No more compromising on the code quality hacking a fix in an inappropriate location to avoid wasting time waiting for it to load. No more maintenance of mock data, fixtures, harnesses, specifically to support the development cycle.

In the name of balance I should probably point out that it's not going to work for all UI code: this will be restricted to the presentation layer. However, it is here that most, if not all, of the design and interaction tweaks are made. Also, all of the techniques listed above  still have their place, hot-reloading is definitely not an excuse not to write tests!

As I linked to at the start of this article, most of the popular frameworks are choosing to adopt hot-reloading in some form. I think hot-reloading could be such a productivity boost, that it has the potential to become a feature around which frameworks are developed, rather than the other way around.

## Conclusions of sorts

Ultimately I'm not proposing that component hot reloading should replace any of the techniques listed above, rather, I'm trying to make the case for its use alongside them. I want to ensure that the enormous effort that goes into creating complex UIs is rounded out in the experience of the users. If they have a glitchy or janky experience, regardless of the effort involved, that will be the reputation of the application. No one wants that. It's time to give the UI that final bit of polish to the design and interaction it deserves!
