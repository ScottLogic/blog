---
title: Default values in code and configuration
date: 2018-11-22 00:00:00 Z
categories:
- Tech
author: rwilliams
layout: default_post
summary: Beneath the user interface of our applications, we as developers both define and use default values in code and configuration. Choosing carefully helps make what we build quicker, easier, and less error-prone to use.
---

Beneath the user interface of our applications, we as developers both define and use default values in code and configuration. Choosing carefully helps make what we build quicker, easier, and less error-prone to use.

> **default** *(noun)* A preselected option adopted by a computer program or other mechanism when no alternative is specified by the user or programmer
>
> &mdash; Oxford English Dictionary

A look around most codebases will likely show up some defaults being defined or overridden. Those defined elsewhere and used as-is however, are only known by their documentation or consequent behaviour.

Constructors and functions may have overload variants taking fewer or no parameters. Components may define default options. Libraries and frameworks may include default configuration. Servers and tools come with default configuration baked-in or in a default file.


## Why defaults
Defaults allow someone to use a thing without having to specify a value for a parameter - in code, or in configuration.

They **reduce friction** between deciding to use something, and actually being able to do so. Without defaults, we'd need to discover that we do indeed need to specify a value, find out which ones are available, decide which one to use, and specify it in the right place.

By not requiring the consumer to understand the parameter and make an informed choice of value, they **reduce analysis fatigue and decision fatigue**. Without defaults, we'd need to understand much more than we probably need to about a framework before using it, and have to make many decisions.

Reducing the number of choices that have to be made (or eliminating them) also **lessens the likelihood of making poor choices**.  Software creators can bake-in good choices that work for most use cases.

Removing the need to specify values in common use cases **reduces the amount of code (or configuration) we own**, making it easier to read and understand. The important things are easier to notice when there's less background noise.

The value of these benefits increases with the number of parameters. As well as having more individual ones, we have to consider relationships between them in terms of effects and compatibility.

The *convention over configuration* paradigm, which relies on good defaults, is motivated by some of these goals. It's widely applied, and specifically favoured by some frameworks and tools such as Spring Boot and Apache Maven.


## To default, or not to default
We make this decision every time we create a new class, component, function, library, application, or tool. There are a few things to consider.

Is there a value that's **appropriate for the majority of use cases?** If so, it should probably be the default, so only the exceptional use cases have to care about it.

Is the parameter something consumers will **always want to specify?** If so, there probably shouldn't be a default - it could silently mask an oversight or a problem.

Is the parameter **something important** consumers should be **forced to think about?** If so, there probably shouldn't be a default. Defaults can easily be used accidentally or without realising. Forcing the consumer to make an active choice for important parameters prevents this.

Is the parameter being **added for a new version of existing software?** If so, there should probably be a default. This makes upgrading to the new version easier, as consumers' existing code/configuration doesn't need any modifications.


## The default value
As mentioned, the default value should be appropriate for the majority of use cases. But that's not all.

It must be **safe, secure, and non-destructive**. Because defaults can easily be used accidentally, they shouldn't cause insecure behaviour or irreversible actions.

It must **not be surprising**. This is the *principle of least astonishment*.

It must **always be applied** unless a value is provided. Using a different default value in different runtime situations can be useful, but not having one at all in some of those is usually surprising when such a situation is encountered.

If the parameter is being added for a new version of existing software, the value should usually **maintain existing behaviour** so as not to cause a breaking change.


## Making defaults visible
The nature of defaults makes them easy to use without realising, which can be both an advantage and a disadvantage. Those whose effects aren't clearly visible can be made so by definers through documentation. Important ones can be highlighted in logging output when they're in use.

Defaults which require known non-defaults of other collaborating software to be used need to be made especially visible.

When we use a default value, there's usually no record anywhere in the code of that decision being made: the default value suits us, so we don't need to do anything. Future maintainers might wonder if we ever did consider whether or not the default was appropriate for our use case. We can make this visible for important parameters by specifying the same value explicitly, possibly accompanied by an explanatory comment.

## Defaults for thought
With the above in mind, you might consider some defaults from popular (and other) software:

* Apache HTTP Server: listens on port 80
* Tomcat thread pool: maximum size 200
* Spring Boot management endpoints: most not exposed over HTTP
* Java `ReentrantLock()` constructor: doesn't use a fair (expensive) ordering policy
* HTML DOM API `addEventListener(type, listener)`: registers for events in the bubbling phase
* D3 map projections' centre: in a 960x500px area
* Angular router: uses the HTML5 history URL `pushState()` API
* Moment.js constructor called with `undefined`: returns a Moment representing the current time
* A library: defaults its behaviour, unless it detects that it's in a production environment
* A data grid component: formats numeric columns to two decimal places
* Build tools that use the browserslist configuration resolution library: uses default configuration if a configuration can't be found

## Conclusion
Defaults have the power to make things better or worse, through their presence or absence, and the values chosen.

Different pieces of software will have their own approach when defining defaults, their take on the pros and cons being driven by their philosophy and their expectations of consumers' knowledge and diligence. I think it mostly comes down to balancing ease of use against being easy to use wrongly.
