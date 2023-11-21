---
title: Maybe you're a Tester
categories:
- Testing
summary: Imagine a new Restaurant opens down the road from you, and you’ve been invited to the opening night. There are no reviews yet, but you’re curious to try it out - In this blog, I aim to simplify testing terminology through a comparison to a real-world scenario.
author: mholland
---

# Maybe you’re a Tester.

Imagine a new Restaurant opens down the road from you, and you’ve been invited to the opening night. There are no reviews yet, but you’re curious to try it out.
 
> **Opening Night:**

> It’s a lot busier than you thought it would be, and you’re seated at a table in the very centre of this bustling new eatery. Tables are a little too close together for your liking, so it’s very loud and you struggle to flag down any of the servers. You fumble your way through the overly complicated menu which seems to have been poorly translated from an unfamiliar language. When you’re on the verge of giving up, a server appears and recommends the chef’s special. You agree to the suggestion and place your order – but after an hour you’ve still not received any food. You decide to give up and go home.

> **Second Night:**

> OK so last night wasn’t successful, but you’re still curious. Today you decide to take matters into your own hands in the hopes of a better experience. You request to be seated at the edge of the restaurant, and immediately order the chef’s special. You’re happy with this decision, as this table feels a lot less claustrophobic than where you were yesterday, and you were able to order with the server that seated you rather than flailing wildly to flag someone down. And yet, you find yourself waiting. At the point you’re about to give up, your meal arrives! To your disappointment, half of the dish appears to be missing from the plate, and what’s left is cold. Again, you go home hungry, but now you’re determined.

> **Third Night:**

> Today you mean business. You arrive earlier to beat the dinner rush, and follow your plan from the previous night in terms of seating requests and ordering immediately. To your surprise you’re served in record time – but you did not receive the meal you ordered.


Maybe this is a terrible restaurant, and you should give up on it. Or maybe, just maybe, you’re a Tester. Let’s be honest, this restaurant isn’t going to have many guests returning after that opening night debacle, and some will be put off by the negative reviews before even experiencing for themselves. And this, dear reader, is where a Tester’s value is paramount. Testing is taking in the data around you, and understanding which variables make an impact. This can be anything from understanding how something can be improved from an overall user perspective, to spotting which aspects are detrimental to its success. The earlier a Tester can get involved, the higher the quality of the final product. Sadly, at the point a business has scared off so many customers, they’ve already waited too long. Each element of the restaurant should have been checked (and corrected) in isolation long before opening night, and even then perhaps it should have opted for a soft launch to a limited audience where feedback was welcomed and actioned.

The world of software has some surprising parallels to this failed Restaurant. How many of us have been drawn in by the conceptual hype of a shiny new app – only to find it’s completely unusable? Sure, maybe the marketing team is going above and beyond, and maybe the Developers ticked off all the defined requirements before launch, but without the quality it will not survive the test of time. Testers are uniquely positioned to analyse software from the ground up – including the smallest elements, the holistic experience, and indeed even the underlying concept.

Testing is something many of us consider in our day-to-day lives without realising, but sometimes the language surrounding it can be off-putting to those wanting to get started, or even lead to imposter syndrome in those that are already well established in the field. So at a very high level, let’s look at a few of the factors in our failed restaurant experience, and how they translate to different types of Testing based on common terminology.

#### Is each aspect of the Restaurant functioning as expected? `Functional Testing`

- Do the chefs know how to use the equipment and/or ingredients in the kitchen?
  - `Unit testing` – *Checking that the smallest pieces of code are fit for use in isolation.*
- Can the chefs that were hired actually cook the meals on the menu?
  - `Component testing` – *Evaluating a section of code in its entirety, without focusing on the finer details of the underlying code or its relation to other components.*</span>
- Are the chefs communicating to the service staff that meals are ready to be served?
  - `Integration testing` – *Combining different components to ensure that they work together as a unified group based on specific system requirements.*
- How is the full flow from customer ordering to receiving their food? 
  - `End to End testing` – *Verifying the entire system behaves as expected from start to finish, focusing on the end user’s perspective in a real-world scenario.*
- How does the restaurant compare to more established venues of a similar style?
  - `Exploratory testing` – *An approach which relies on knowledge of similar software, in order to freely compare common functionality in a manual/non-scripted process.*
- Is the menu in the correct language (and currency) for where the restaurant is?
  - `Localization testing` – *A technique to verify the behaviour, accuracy, and suitability for the geographical location for which the software was intended.*
- If a new item is added to the menu, are both new and existing items to standard?
  - `Regression testing` – *A type of testing to be run after every change in the development cycle, to ensure that the change introduces no unintended consequences.*
- If the new item’s recipe was changed due to incorrect allergens, is it correct now?
  - `Sanity testing` – *A technique to quickly evaluate whether basic functionality is working correctly (or not) after a new build.*

#### Do these aspects cooperate in the overall Restaurant Setting? `Non-Functional Testing`

- Is the menu too confusing? Is the font legible and contrast reasonable for the lighting? 
  - `Accessibility testing` – *Verifying that the application is usable to as many people as possible, inclusive of those with disabilities.*
- What is an acceptable speed for order turnaround? Is it consistent through the day?
  - `Performance testing` – *Evaluating how the system being developed performs in a production (or closely simulated) environment in terms of speed, stability, and efficiency.*
- What happens if the restaurant adds more tables, is it still performing the same? 
  - `Load testing` – *Checking for any variations in the system behaviour when simulating multiple concurrent users using the system over a period of time.*
- Can the restaurant maintain this speed during peak times (like the dinner rush)? 
  - `Stress testing` – *Determining how robust the system is, by simulating scenarios beyond the limits of normal day-to-day operation.*
- Is the restaurant maintaining these standards every day it’s open? 
  - `Reliability testing` – *The dependability of a system to perform its intended function consistently and without failure over an extended period of time.*
- Is the kitchen sufficiently separated to stop customers wandering in and helping themselves? 
  - `Security testing` – *Uncovering system vulnerabilities, to determine protection of the software, its data, and communication with other networks.*
- Are the tables clearly numbered/fairly spaced, so that service staff can bring food quickly? 
  - `Usability testing` – *A method of testing the functionality of the software to ensure that the product is easy to use, and intuitive for real users.*
- What if the restaurant changes venue with the same staff to improve security and space? 
  - `Portability testing` – *Measuring the ease and efficiently of transferring a software component or application from one environment to another.*

Well would you look at that, with just a few real-world questions, you’ve identified 16 different Testing types! Not so scary, right? Whilst this is in no way an extensive list, I hope it helps uncover some of the mystery.

Testing in a career setting can feel like an isolating role at times. You may find yourself as the only Tester on a project and feel inadequate because you don’t recognise all the terminology, or there can be a sinking feeling when your purpose is to critique the hard work of others. But when in doubt, take a breath and try and look at the situation from another angle. Think back to the restaurant example and remember that you do know a lot of the types of testing to consider, and that by finding issues and relaying them back in a concise manner, you are providing an opportunity to improve the overall quality.

Sometimes, a lack of focus on terminology can help you in thinking critically, as there is a nasty little trap in our grouping – Functional versus Non-Functional. When it comes to deciding what testing is required, it’s better to consider which aspects are important to the product being tested, rather than favouring one grouping over another (check out this fantastic article by Rich Rogers - [Functional or non-functional: does it really work?](https://richrtesting.com/2016/02/16/functional-or-non-functional-does-it-really-work/)). For example, did you know that the UK Equality Act of 2010 states that websites must be accessible to ***all*** users? That means Accessibility is a legal requirement in the UK, so why do so few people consider this a Functional Requirement? Whilst Accessibility Testing can be considered a specialism (as with several other types), that does not justify ignoring it altogether. There are always some simple tests you can perform for even the more daunting Testing Types. Even if all you do is scratch the surface, it can make a huge impact on Software Quality and inclusivity (I’d strongly recommend reading this article by Ady Stokes - [Simple Tests For Accessibility Every Tester Should Know](https://www.ministryoftesting.com/articles/simple-tests-for-accessibility-every-tester-should-know?s_id=16293301)).

Whether you’re trying to hone your skills or begin your testing journey, know that you are part of a huge community of likeminded people. Never be afraid to reach out and ask for help, there will always be someone who can explain things in a way you understand. The wonderful thing about the Testing community is the diversity of individuals from all sorts of unexpected backgrounds. Testing embraces a “what if…” mindset, which is applied to a multitude of different careers. Just because you didn’t start out as a Tester doesn’t mean it’s too late.

So next time you’re criticizing yourself and wondering if maybe you’re; too pedantic, too risk averse, or maybe you shouldn’t have clicked the same button 10 times… why not look at the data from different angle and instead realise that ***you*** are a Tester, and you’ve found your calling. 

 
