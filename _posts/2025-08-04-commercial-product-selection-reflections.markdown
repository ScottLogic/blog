---
title: Commercial product selection reflections
date: 2025-08-04 10:45:00 Z
categories:
- Tech
summary: In the course of building a new system for a client over the past year, we
  evaluated and selected a couple of commercial software products   to use as components
  of that system. In this post, I’ll share some observations and thoughts which may
  be of interest or help you with your next selection.
author: rwilliams
---

In the course of building a new system for a client over the past year, we evaluated and selected a couple of commercial software products   to use as components of that system. In this post, I’ll share some observations and thoughts which may be of interest or help you with your next selection.

## Nature of different product domains
The selections we made spanned from complete user-facing applications which manage their own data, to components that would only be visible to technical staff. Identifying likely differences between product domains helps shape the selection approach.

Why do products of this type exist? There’s no single reason but common ones are that it’s quicker and cheaper than building your own, or that building your own is practically too technically challenging. It’s essentially the same question as why are you considering buying one.

Who is offering these products? In some domains there are a few (or even one) clear leading product, whereas others have numerous seemingly similar options. There may be a mix of new-tech giants, legacy vendors, and mid or small size startups. The composition and quantity is perhaps partly driven by how easy it is (given time) to build and establish such a product.

Who is buying these products, for what? Some products are quite general purpose, and others either more specialist, or catering to particular customer preferences. It’s worth considering generally how alike your use case is compared to the mainstream for the product.


## Context of product use
What the product is used for and how it fits in affects the factors that need to be considered, their relative importance, and in turn what needs focus for evaluation.

All product selections will seem important, but it does help to have a bigger picture view of how important a role the new product will have. Some will be critical to the operation of a business, whereas at the other end of the spectrum are nice to have use cases that could be tolerably done with a spreadsheet if needs must.

Who is the product for? Some products will be highly user facing and heavily used as part of their work, others are only used once a week for a couple of minutes, others won’t be visible to the user at all. Users could be internal staff, or customers, and there could be few or many. All this can inform the relative importance when weighing up the pros/cons of different products.


## Feature comparison requires depth and nuance
At an early stage of selection, you will likely have a longlist of options to consider, and a list of areas (e.g. features) of initial interest. It’s relatively quick to populate a matrix of this with a simple yes/no, and it can highlight some surprising omissions. However, we found that almost all products achieve a “yes” for every area in this simple exercise.

To really count for something, a feature needs to be a) substantive, and b) suitable. In one product domain, we found some very basic implementations of some features – even in established products. Where there is substantive functionality, its quality, capability, and usability often varies – informing how suitable it is for our needs. The only way to get a full and informed view of this is to try out the feature first hand, but looking at documentation is quicker for a less complete early view.

Abstraction is necessary to summarise evaluation results in a consumable format. We used several ratings such as good/acceptable/poor, with a short note or link to further detail where appropriate.


## Not all about features
There are a myriad of other aspects that need to be kept in mind from the start. Requirements for non-functional aspects (capacity, traffic, etc.), support, and service level agreements can be blockers if unsatisfiable, or greatly affect the pricing.

You’re also developing some view of the vendor and the history of the product – are they a stable established company, are you comfortable entrusting them with this component of your system, is the product mature, etc.


## There is likely no ideal product
We generally found something missing or disappointing about every product during evaluation, or later in integration. Often a missing or poorly-done feature, or some seemingly obvious scenario that isn’t handled well. It’s easy to enter with high expectations based on vendor company sizes, huge startup valuations, and online sentiment.

Upon discovering such a thing during evaluation, and it being a major one, it can seem sensible to quickly rule out that product and not spend any more effort evaluating it. However, it’s quite possible or even likely that you’ll encounter something negative of similar or higher significance in many or all products under evaluation. I suggest not ruling anything ou t too early, and be open to going back to them if you find problems with the current leading contenders.

For every missing or unsuitable feature, consider what mitigations are possible e.g. workarounds, process changes, user training or protocols, or bespoke implementation. Investigate what capabilities the product has to support bespoke code implementation, or integration with external bespoke software – e.g. plugins, APIs, event hooks. These will also be needed for any new future requirements that aren’t handled by the product.


## Reconsider bespoke build
As evaluations progressed, we learnt more about the requirements, user needs, and what a good solution would look like. If the evaluation started from a pure “select a product” perspective, from a view that a bespoke build would not suit, then it’s worth validating that this remains the case. Are the products a good fit for the context? Does the expediency and cost saving justify the negatives? Which approach is holistically the best value?

There will likely be gaps or unsuitabilities in the features offered by products, and meeting these needs by bespoke development within the constraints of the product could be difficult and time consuming due to that constrained programming environment. Are the other proposed mitigations workable? Are users going to be satisfied?

Stakeholders need to understand the implications of using a product as opposed to a bespoke build, perhaps most importantly the rigidity of the product and lack of influence over it. While there is often some configurability, many/most things cannot be changed; they and the users will need to take what they’re given. Consider whether that works, with reference to the earlier section on context of product use.

## Environments and configuration as code in SaaS products
Some of the products we evaluated were software as a service, and our criteria covered how we’d develop and deploy these using modern controlled practices. Unfortunately, none of the products in the segments we looked at were particularly satisfactory.

Our environments model for the wider solution included many non-production environments for purposes including development, testing, acceptance testing, etc. Only a few products had a first-class environment concept, or an equivalent strongly-separated one like tenants. Many relied on using some other feature to mimic environments, with weaker separation of data and less independent configurability. Beyond a single non-prod environment-like area, the pricing often didn’t reflect that additional ones would be non-production (less data, users, traffic, etc.).

We also wanted to have all configuration under source control, and deployed by automated means – as we did quite straightforwardly with the bespoke components of our wider solution. Generally we found products’ capabilities to support this poor – none or poor tooling, and APIs which didn’t fully cover the configuration space.


## Time, and making effective use of it
We need to select a suitable product, but we can’t spend forever doing it – there has to be a point where we decide we’re adequately confident. If we cut corners, we risk choosing something that later turns out to be unsuitable or needs a large effort (or impossible) to mitigate its limitations. Evaluation is an exploratory, research-oriented process. While it can be estimated and roughly planned, it isn’t routine sprint work – we’re not working in a familiar area, we’re constantly discovering new things that need looking at, and the consequences of rushing it can be large and long-term.

Many will talk about doing proof of concept (PoC) implementations a principal evaluation activity. That can be useful, however it’s important to consider what are you seeking to achieve at any given stage and product. When what’s needed is to judge a particular feature or aspect, localised experimentation with that can be more efficient and focused. There is a risk with PoCs that much time is spent on assembling something demonstrable, at the expense of investigation and discovery that yields valuable information. 

It's important to establish effective ways or working, and to evolve them through the selection process. Topics to consider include collaboration, capturing and summarising information, keeping track of open matters of interest, gaining different perspectives, going deep vs. taking a step back to reflect, keeping stakeholders involved, thinking independently, and moving towards a conclusion.


## Conclusion
Comparatively few software build projects in my experience involve a vendor product that is “traditional enterprise software”. Selecting open source libraries/frameworks, or cloud provider sub-products are more familiar territories but much of the same principles apply.
