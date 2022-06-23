---
title: Capitalism, Socialism, and Code Ownership
date: 2021-09-30 00:00:00 Z
categories:
- bquinn
- Open Source
tags:
- Code,
- Version
- Control,
- Git,
- XP,
- Agile
author: bquinn
layout: default_post
image: bquinn/assets/share-knowledge.png
summary: Admittedly not three concepts you would usually hear together. However, there
  are some interesting parallels in models of ownership that might challenge the way
  we manage projects.
---

![ESLint.png]({{site.baseurl}}/bquinn/assets/share-knowledge.png)

In 1626, so the story goes, Dutch settlers bought the island of Manhattan from the native occupants for $26. I think the reason we love this famous ([and undoubtedly false](https://www.livescience.com/was-manhattan-sold-for-24-dollars.html)) story is because it exposes a concept we otherwise take for granted as potentially ridiculous. That concept is private ownership. Mortgages and renting make private property ownership a part of everyday life that we just take for granted. Scaling this up to the island of Manhattan, or even [the state of Alaska](https://en.wikipedia.org/wiki/Alaska_Purchase) suddenly makes us question the idea that land is something that can be bought or sold and, ultimately, owned.

## Capitalism

I won't profess to be an expert in economics, but the [definition of Capitalism on Wikipedia](https://en.wikipedia.org/wiki/Capitalism) will do for the sake of this post.

> Capitalism is an economic system based on the private ownership of the means of production and their operation for profit.

So the concept of private ownership is actually baked into our very  society. Perhaps it shouldn't be a surprise it's also influenced the way that we develop software.

## Socialism

Again with the caveat that I'm not an expert in these matters, the obvious system to contrast against Capitalism is Socialism. Again using Wikipedia's definition:

> Socialism is a political, social, and economic philosophy encompassing a range of economic and social systems characterised by social ownership of the means of production and democratic control, such as workers' self-management of enterprises.

The key term here is **social ownership**, contrasted against the **private ownership** found in Capitalism.

## Code Ownership

At this point, you might be questioning why you're reading this article. You came to this blog for an article on software, not politics or economics. So what does this have to do with code? Well we can actually see the same models applying to code ownership.

### Private code ownership

Almost every project I've ever worked on or heard other developers talk about has what I would call **private code ownership**. Perhaps surprisingly, even most open source projects I've seen on GitHub seem to follow this model.

Private code ownership as I'm referring to it tends to manifest itself through the following features:

1. A single source of truth for the code e.g. a remote repo to be forked off, a master branch
1. A person or set of people who act as gatekeepers for any changes to the code e.g. an approvers group (GitLab actually calls this feature [`Code Owners`](https://docs.gitlab.com/ee/user/project/code_owners.html))
1. A system to allow people to propose changes e.g. Pull Requests

The first feature sets up code as something which can be owned, like property. The second feature defines who owns the code, like a deed to a property. The third group separates the owners from the contributors. We now have a microcosm of a capitalist system - a small group of 'capitalist' code owners, and a large group of the 'working class' who contribute to the code.

### Collective code ownership

 In spite of its pervasiveness private code ownership, like private property ownership, is not the only way of doing things. The alternative is called **collective code ownership**, which has the following features:

1. A single source of truth for the code
2. Everyone has the ability to change the code e.g. push straight to master branch
3. Everyone has responsibility for the code

Again the first feature is the same - the code is something that can be owned. However, there's no special status for anyone - anyone can contribute to the code. Consequently it's everyone's responsibility to ensure that it's working and well written, and to maintain the code when you see things that aren't right.

## Extreme Programming

One of the key concepts in Extreme Programming (XP) is **collective ownership** as defined above. Although other practices from XP have made their way into mainstream development, including Test Driven Development (TDD), Continuous Integration (CI), and Pair Programming, collective ownership is not one I've ever seen practiced.

There are a number of benefits that are claimed to arise from a collective ownership model versus private ownership, including increased motivation of developers, better diffusion of technical knowledge among the team and less reliance on individuals who become bottlenecks. I've personally experienced the  detrimental effects of bottlenecks and decreased motivation on projects because of private code ownership.

The main objection to collective ownership is the risk that the quality of code and engineering may decrease. In essence the concern is that without oversight, individuals will contribute bad code, or the resultant codebase have incoherent architecture. In XP these risks are mitigated by TDD, CI and Pair Programming, which ensure a comprehensive suite of tests are covering the codebase and accountability between developers. Of course, you also have to rely on your developers to be following these practices and writing good tests, so ultimately code ownership comes down to the issue of trust - do you trust your development team?

## Trust

### Open Source

Open Source code is often described as being "owned by the community", so you might imagine that it follows the collective ownership model. In fact I believe the type of ownership referred to by this phrase is Intellectual Property - Open Source code has permissive licensing and can be used by anyone. 

Open Source code is actually a good example of where trust in developers is in short supply. As far as code ownership is concerned, Open Source projects actually tend to have a list of maintainers who determine what goes into a project. While these may rotate over time, ultimately it follows the private code ownership model.

This makes a lot of sense to me. I don't think collective ownership of code would work for Open Source - there's too much scope for someone to contribute malicious code, and many of the codebases aren't worked on frequently enough for even honest mistakes to be fixed quickly (a lot of Open Source projects are worked on in people's leisure time).

### Commercial Projects

Ironically, I think the best context for collective code ownership is on commercial projects. The code is developed by professionals who are good at their jobs, and are likely to follow enterprise practices such as TDD. Therefore trust should be in good supply.

Of course there may be good reasons there might be limited trust even on commercial projects - perhaps you're training a junior developer who is new to the technology, or there are organisational constraints which are in conflict with collective code ownership. Pair Programming could be a way to help ensure the quality of code for a new developer, but of course there will still be times when it's not appropriate. 

## Scott Logic

So what about at Scott Logic? We rarely see a collective code ownership model used on projects. However we pride ourselves in recruiting good developers who we can trust to write good code and follow good development practices, which is the perfect context to seek the benefits of collective ownership.

So I want to conclude this post with a challenge. Think about it - is your project somewhere you could introduce collective code ownership? What benefits could you see from it? What issues of trust might stand in the way, and how can these be addressed?
