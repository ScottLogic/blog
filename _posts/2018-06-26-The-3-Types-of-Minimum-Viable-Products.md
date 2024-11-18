---
title: The 3 types of minimum viable products
date: 2018-06-26 00:00:00 Z
categories:
- Delivery
author: tmakarem
layout: default_post
summary: An MVP is a product that has just enough features to add business value. Typically you quickly learn from it to improve on subsequent releases or inform business decisions. MVP is also a buzzword and many have tried to constrain its definition. However, when people talk about MVPs, they mean different things. In this post, I describe the 3 types of MVPs that I encountered.
---

An MVP is a product that has just enough features to add business value. Typically you quickly learn from it to improve on subsequent releases or inform business decisions. MVP is also a buzzword and many have tried to constrain its definition. However, when people talk about MVPs, they mean different things. In this post, I describe the 3 types of MVPs that I encountered.

###THE VERTICAL SLICE MVP

The Vertical Slice MVP allows you to focus on one part of the product but flesh it out and see it executed from start to finish. For example, It is useful when testing the workflow of a specific feature or user. You test all components from design, to services and persistence. You verify that it works in production with end-users before expanding to other features. However, the product temporarily misses key features and users can’t get a comprehensive experience.

<p style="font-size: 140%; font-weight: 100; margin: 1.2em 1.4em;">
Pros: Allows testing something from start to end
<br/>
Cons: Provides a limited experience of the product
</p>

A couple years ago, I worked on a 10-week proof of concept for the redesign of an FX trading application. The goal was to enhance the UX and to migrate the application from Flex to HTML5. As part of the proof of concept, the team created a Vertical Slice MVP to demonstrate that the most common use case works from start to end with the new technology. Users could request a quote, view streaming rates, buy or sell and view the trade in the blotter.

###THE HIGH LEVEL MVP

The High Level MVP provides users with an overview of the product giving access to everything they would want to do but without perfecting the experience for each feature.

<p style="font-size: 140%; font-weight: 100; margin: 1.2em 1.4em;">
Pros: Provides a comprehensive experience of the product
<br/>
Cons: Its features are not as good as they should be
</p>

*[Groupon’s](https://www.groupon.co.uk/)* first prototype was a High Level MVP. They created a Wordpress site on which deals were posted daily. When a user signed up to a deal, a PDF document was generated and emailed to them. This allowed Groupon to provide the main features that users needed and later enhancing the experience.

###THE THROWAWAY MVP

The throwaway MVP allows you to test a hypothesis. The goal is to find out if an idea would work before investing a lot of time building it. You build small prototypes to test hypotheses. The throwaway MVP is not your end product but rather brings you insight on whether to and how to build your product. It is very useful when trying to come up with a creative or new idea. The risk of building a throwaway MVP is the temptation to reuse the MVP and have parts of it, a codebase for example, persisting into the end product. When building a throwaway MVP, you might hack something together quickly to test it. It helps you understand how you might build your product and the technology to use. Having experimented with the system, it could also help you build the product faster. However, the technical choices could be completely different for the end product and should not be compromised.

<p style="font-size: 140%; font-weight: 100; margin: 1.2em 1.4em;">
Pros: Accelerates learning and reduces waste
<br/>
Cons: Cannot be used as the end product
</p>

An example of the throwaway MVP is Dropbox. Instead of spending years of development building a product that nobody wants, *[Dropbox’s](https://www.dropbox.com/?landing=dbv2)* CEO first tested the assumption that users would want a product like Dropbox. He created a video demonstrating what the product would do. Thousands of people signed up to the waiting list and liked the video overnight. The team was able to get quick feedback and validate an assumption before investing additional time. Even though the video was not a product that allowed users to sync files, it established the business premise on which the product was built. When Dropbox finally launched, they reached 1 million users after 7 months.

###WHICH MVP TYPE SHOULD WE BUILD?

It is important to select the right type of MVP to build. That being said, you can work on multiple MVPs simultaneously to test different things. In fact, on a recent project I worked on, we built all 3 types of MVPs.

The project was to design a tool that allowed users to book FX voice trades in compliance with the *[MiFID II](https://www.esma.europa.eu/policy-rules/mifid-ii-and-mifir)* regulation.

The team created a Vertical Slice MVP to test that trades were booked correctly. The technical release allowed users to book an FX spot trade. The goal was to check that a simple spot RFQ can be booked correctly from users inputting the data to the trade appearing on the blotter and in the corresponding database. When testing the release, one of the users could not see the trade she booked appear in the blotter. We quickly worked with the support team to locate the problem. We discovered that we had the incorrect configuration details for Database Gateway in production. The Vertical Slice MVP allowed us to quickly spot the issue and fix it.

We had a strict deadline because of the regulation coming into effect. We needed to build a tool that allowed users to book all product types that fell under the regulation so we delivered a High Level MVP focusing on Forwards, Swaps, and NDFs. All features that would have been useful to users but not required by the regulation were not included in this MVP. For example, the ability to view the margin utilisation for a client and how close the client is to exceeding that limit would have been very helpful for users but it wasn’t essential for compliance so it was viable to release the product without it.

The regulation meant that users had to undertake new ways of operating. We needed to capture very complex workflows and extract all the edge cases. I created prototypes using InVision to test different workflows with users. The prototypes were not intended as an end product and were based on different assumptions. I used them on the trading floor with end-users mapping the user scenarios to the prototypes. This helped quickly verify the workflows addressed in the design, and identify missing edge cases.

###CONCLUSION

When clients ask for an MVP, it is important to identify what they mean by that and which type of MVP they are looking for. The way you approach a project and the way you structure it is directly affected by that. Understanding the type MVP the client is looking for allows us to provide better estimates of the work and manage expectations.
