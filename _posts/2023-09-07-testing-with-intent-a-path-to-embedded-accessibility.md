---
title: "Testing with Intent: a Path to Embedded Accessibility"
date: 2023-09-07 14:45:00 Z
categories:
- Tech
layout: default_post
tags:
- Testing
- Testing Library
- Automation Testing
- Testing with Intent
- Accessibility
- Embedded Accessibility
summary: "In this post, I explore an approach to testing called Testing with Intent. I look what the approach is—testing from the perspective of a user intending to do something—and the positive impacts it can have on both testing and accessibility. I've written this for a broad audience, so I've steered clear of technical details included. Instead, you should come away with an understanding of why this topic is important and how you can benefit from adopting the approach."
author: sgladstone
---

*Embedded Accessibility* is a vision of building accessible products by default. We can consider accessibility embedded when it no longer needs to be prioritised because it is already at the core of the delivery process. 

But generally, the software industry is not there yet—too many products get built while treating accessibility as an afterthought.

In this post, I will explore a pragmatic and achievable step that software teams can take to tackle this issue. This step centres on adopting an approach to automated testing, *Testing with Intent*, that focuses on user intention. Testing with Intent is all about testing from the perspective of how a user intends to use your app. 

Adopting this approach brings a lot of advantages. Our tests will be more resilient, and will give us more confidence in our code. Our products will also be more accessible by default. But most importantly, this approach breaks down some of the barriers we face when trying to embed accessibility in software delivery.

So, by taking the step of adopting Testing with Intent, we can move towards accessibility being a core part of delivery. We start down a path of practising Embedded Accessibility.

For those of you who aren’t technical, don’t worry! I’ve saved the technical side of Testing with Intent for another post. However, before diving into what exactly this approach is, let’s start by looking at a couple of the barriers that teams often face in implementing accessibility.

## Barrier 1: Accessibility as a Feature
Consider this scenario:

> A software delivery team is starting a new project. While discussing high-level requirements, the team gets on to the topic of accessibility. Everyone agrees that it’s important to make the product accessible. But everyone also agrees that it's not an essential part of the Minimum Viable Product (MVP). So they prioritise the work as a future epic in the backlog.
>
> Fast forward in time and the project has been a massive success. The team has launched the MVP. They have completed a further year of productive development. There is a growing user base. Yet, the work on accessibility is still not started. In fact, the product growth means that adding accessibility now requires considerable effort. This growing cost effectively means that the work will never be started.

Does this sound familiar? It’s certainly a scenario that I’ve seen play out all too often. 

There are many reasons why accessibility is an important issue to address. But it’s easy to approach accessibility as a feature that will be implemented at some point in the future. However, the complexity and cost of this “feature” will grow as other features are completed. The necessary work on accessibility becomes harder and harder to prioritise. There's always some other pressing commercial concern. Most likely, the accessibility “feature” will never get done. 

If we are serious about tackling accessibility, it can’t be an afterthought. We need processes in place that support teams in making it a reality from the star—we need to embed accessibility right at the centre of how we deliver software. 

![You're most likely to implement accessibility if you start tackling it at the beggining of a project]({{ site.github.url }}/sgladstone/assets/twi-likelihood-of-implementing-accesibility.png "You're most likely to implement accessibility if you start tackling it at the beggining of a project")
*This graph is not backed by any data. But it highlights the problem with delaying the implementation of accessible design.*

## Barrier 2: A Skills Gap

Most software professionals I've spoken to feel that accessibility is an important subject. But most also feel that they lack the necessary skills and training. It’s not that there’s a lack of willingness to learn, but a lack of opportunity.

Treating accessibility as a deprioritised feature is creating a chicken-and-egg situation. When are people meant to learn the necessary skills if we don't prioritise working on accessibility? But we can’t write accessible products without the necessary skills. So, If people can't learn as part of their day-to-day work, they need another option. 

But accessibility is a complex subject. It's not something that's easy to pick up with a little time here and there. Tackling as important an issue as having an equal society can't be about putting the onus on individuals to learn in their spare time—that's simply not a way to bring about the systemic change we need.

So, we have a skills gap that we need to bridge and, to properly tackle this gap, we need to address it through our regular delivery work. Again, we need to embed accessibility right at the centre of how we deliver software.

## My Journey to Embedded Accessibility

Early in my career, I started this journey when I read the excellent book *[Don't Make Me Think](https://sensible.com/dont-make-me-think/)*. This set me down a path of figuring out how to design intuitive applications. Over my career, I have dabbled with accessibility here and there. But I suffered from not having the opportunity to bridge the skills gap I described above. This all changed on one of my recent projects.

Jim Light—the lead developer—introduced me to *[Testing Library](https://testing-library.com/)*, a tool for automated frontend testing. This was a lightbulb moment for me. I had found a methodology for frontend testing that finally made sense. This methodology is something that Jim and I call *Testing with Intent*—but more on that in a moment.

I was finding my groove with this new tech over the course of a few weeks. Then, I noticed that something awesome was happening: I was closing my accessibility skills gap in the course of my day-to-day work. Something about the way I was engaging with Testing with Intent was helping me. While coding, I was getting small, achievable learning opportunities around accessibility. We had, unwittingly, started to embed accessibility into our delivery process.

In the rest of this post, I will explore what I learnt from this experience. I'll begin by looking at why these testing principles make sense to adopt, irrespective of tackling accessibility. Then, I'll build to look at why adopting these principles is a step forward in addressing the two accessibility barriers above.

## So what is Testing with Intent?

Testing with Intent is a testing philosophy that is closely related to the [Guiding Principles of  Testing Library](https://testing-library.com/docs/guiding-principles). At a high level, it can be summarised by the following statement:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The more your tests resemble the way your software is used, the more confidence they can give you.</p>&mdash; Kent C. Dodds 🌌 (@kentcdodds) <a href="https://twitter.com/kentcdodds/status/977018512689455106?ref_src=twsrc%5Etfw">March 23, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

When Testing with Intent, we test from the perspective of a user who intends to do something in our system. You might think of this as similar to writing user stories from the perspective of the user. Consider this illustrative example of a user story:

> As a user, I want to be able to log out of the system by clicking my avatar and selecting “Log out” from the displayed dropdown menu.

In Testing with Intent, we approach validating a premise within a test in a similar way. To continue this example, consider how to validate the above story. One of our tests would need to go through the very same steps that a user would take to log out. That is to say the test would locate the avatar on the page, click to open the menu, and click the logout option. While this is a straightforward example, the same principles can be applied to more complex test cases.

We’re also not only looking to test the positive outcome. In Testing with Intent, we want to validate that the user was able to realise their intended outcome. We should also validate that there were no nasty side-effects along the way.

Testing with Intent is a subtle yet powerful paradigm shift. A shift away from writing tests that are based on the way we structure code. A shift towards testing based on the way the app is actually used. A shift away from testing the technical implementation details of the software. A shift towards capturing a user’s intention within the test itself.

There are lots of avenues to explore around the awesome impact of Testing with Intent on testing. In this post, I will stay focussed on addressing the two accessibility barriers described above. To do this, I’ll look at Testing with Intent in web frontend automation testing (this, incidentally, is where Testing Library excels, but that’s something I'll address in another post). Testing Library is an awesome tool, which can enable us to embed accessibility in our delivery process. But it doesn’t require you to write accessible code, so now it's time to look at how we build that in.

## Describing Intent using Techniques for Accessibility
To make Testing with Intent work, we need a way to describe the intentions of a user. 

This is not necessarily straightforward. We often convey the purpose in ways that are hard to capture in test code. For example, certain images have near universal meanings. Almost everyone knows the purpose of a button with this icon:

![A floppy disk–or save–button]({{ site.github.url }}/sgladstone/assets/twi-save-btn.svg "A floppy disk–or icon")

But it’s not easy to describe an image in code. So often, we look to some technical implementation detail to make our test work. By this, I mean that we would target something technical like an id attribute: `id="progress-save-btn"`. While this works, it doesn’t mean anything to a user. How often are you browsing a web page thinking about what id all the elements have? When a user intends to save their progress, they click the floppy disk button. So, if we are going to Test with Intent, our tests should behave in the way a user behaves. Our tests should also click the floppy disk button.

These are the same challenges that the tools for accessibility also face. How does someone using a screen reader know to click the floppy disk button? Fortunately, we already have mature technologies that are designed to solve this. [Semantic HTML](https://web.dev/learn/html/semantic-html/) and [ARIA roles & attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) encode context, intention and structure in ways that can be consumed programmatically. By including them in our websites, we assist the tools that people with impairments rely on to access the web.

Now here’s the trick: we can use those very same technologies to assist our automated tests. By targeting these accessible descriptions, we make our tests behave like users. Gone are any technical implementation details. Our tests start to read like a user interacting with the product. They now capture the intentions of a user.

~~~js
it('should save the current progress', async () => {
  render()
  //...
  const saveBtn = await menu.findByRole('button', { name: 'Save Progress' });
  userEvent.click(saveBtn);
  //...
});
~~~
*Clicking a save button in the style of Testing with Intent. Note that, while the above may look technical, the role ‘button’ and the name ‘Save Progress’ are both accessible descriptors rather than implementation details.*

## Testing with Intent is great for tests
Before we get to those accessibility barriers, I think it’s important to highlight that adopting these techniques is great for our tests. 

Testing is all about giving ourselves confidence that the code we are releasing works. On the one hand, we could invest a lot of time and effort into being 100% certain that our changes work. But that's not the best choice because getting that confidence would take a lot of time and effort.  So, instead, we look for the sweet spot where we are really confident in our code, but it hasn't cost the earth to get there. All that extra saved effort can be invested into the product in other ways. So, tests that give a lot of confidence but take relatively little effort are great tests. This is the case when we Test with Intent and describe that intent through accessibility.

[Stepping away from testing technical implementation details is a good thing](https://kentcdodds.com/blog/testing-implementation-details). It's possible to cover a lot of ground with only a few tests, so we can get a lot of confidence for the effort we put in. Also, as the tests interact with our app in the same way as a user would, they break when something changes for our users. That's the sort of failure we want—the app no longer functions in the expected way for a user. 

This, in turn, gives the team the confidence to make wider technical changes. They can, for example, complete a technical refactor without having to touch these tests. Then the tests run and, hopefully, say, "All good! The app functions the same for the user." No longer does a small technical change break a load of tests, which in turn need to be rewritten. Instead, the tests are more resilient in a way that simplifies technical changes. When a team isn't weighed down by tests that break for the wrong reasons, they are free to be bolder in their work and deliver faster. This is especially true when they need to tackle more complex tasks. 

For me this is a key benefit. If you adopt Testing with Intent, you’ll be reaping benefits in your automated test suite. I think that this value alone is enough to justify Testing with Intent’s adoption. That’s before you even consider adding accessibility into the mix. So, if you look at it from that angle, you can get a bonus here if you also start to address accessibility. It’s pretty awesome that you get to tackle two issues from one investment.

## Two for the price of one: Good Tests + Addressing the Accessibility Barriers

So how does adopting these techniques address the two barriers—accessibility as a feature and a skills gap—described above? 

Describing intent using techniques for accessibility enables us to start tackling the skills gap. Through it, we create those small, achievable learning opportunities for our technical teams. These opportunities start to come up during the course of day-to-day work. To highlight this, I’ll turn to an example of one such opportunity that came up for me. 

While writing a test, I found myself asking which role our app’s sidebar should have. It didn’t take long to scan the [list of roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) to find [the answer](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/navigation_role), and, what’s more, I learnt about [landmark roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#3._landmark_roles) along the way. Using my new knowledge, I replaced the sidebar’s `div` element with `nav`, which directly improved the app's accessibility. Learning while you work really is a powerful way of closing the skills gap.

Starting to tackle accessibility also no longer needs to be considered as a future feature. (Unless you consider your tests a feature, and I think you likely have bigger problems if that’s the case!) You will start to tackle accessibility as soon as you start writing tests, and you should be writing tests for every feature. So, you are tackling accessibility from day one. 

Don’t get me wrong, this is not a silver bullet that will produce perfect accessibility in your apps. Think of it more like a starting place that will build a team’s skill set and also improve the app’s accessibility. Other work will be necessary to further improve accessibility. But you’ll have broken down barriers to starting that work: your team becomes more skilled and you don't need to start from scratch. This is an incredibly cost-effective way of approaching the issue. It’s certainly cheaper than retrofitting accessible designs into an application.

For me, the way that these barriers have been broken down is the most powerful change here. It brings working on accessibility within the reach of delivery teams, and that’s a step towards building a more equal society.

## On the path to Embedded Accessibility
So, we’ve explored a couple of barriers to embedding accessibility, and how Testing with Intent helps us to break down those barriers. We’ve also seen how Testing with Intent is great for tests. So, adopting Testing with Intent improves your tests, and gives you the bonus of a step towards Embedded Accessibility.

There is also, of course, a lot more to Embedded Accessibility. The techniques described in this post aren’t going to be enough just on their own. For example, you probably should consider accessibility in your “Definition of Ready” and “Definition of Done”. I also think we have a way to go before we have a clear and well understood picture of what Embedded Accessibility is. But it’s important not to let the perfect be the enemy of the good. We shouldn’t hold back from good, pragmatic, incremental change simply because it doesn’t give a perfect result. As an industry, we have an accessibility journey to go on, and there are many steps in the journey.

Some teams may have already made good progress on that journey. This can be particularly true for government projects, where the legal requirements are more stringent. For these teams, adopting Testing with Intent can complement existing practices and processes. For many teams, adopting these approaches would be an important first step in tackling the issue. In any case, Testing with Intent is a useful tool for tackling accessibility, as well as a helpful step towards Embedded Accessibility.

If you’re interested in how this works in practice, you may want to look at my follow-up post about the Technical Side of Testing with Intent.

Finally, I’d like to give a massive shout out to Jim Light. We developed these principles and practices while working on a project together. Time got the better of us, and we weren’t able to collaborate on writing these posts together. But he certainly had a big influence on the formation of these ideas. Also, a massive thank you to everyone who gave their time to help me shape these posts!
