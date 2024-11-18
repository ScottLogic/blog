---
title: Making Digital Products Accessible
date: 2023-06-29 10:00:00 Z
categories:
- UX Design
tags:
- accessibility
- ux design
- development
- Inclusion
- Diversity
- Global Disability Awareness Day
- featured
summary: In this blog post, two of our consultants share their insights from a panel discussion focused on enhancing the accessibility of digital products and services. They delve into the challenges encountered by disabled users, emphasize the significance of integrating accessibility considerations from the outset, and highlight the universal advantages that accessibility can offer.
author: dhinrichs
contributors: osharon
image: "/uploads/MicrosoftTeams-image%20(7)-8341bc.png"
---

Every year on [Global Accessibility Awareness Day](https://accessibility.day/), people come together to raise awareness about the barriers many users still face in the digital world.

This May, we, Doro Hinrichs and Oded Sharon, attended an accessibility panel discussion and workshop with [UserVision](https://uservision.co.uk/) on Creating Accessible Digital Experiences. The panel brought together experts in the field, including Mark Palmer, the accessibility lead from the Scottish Government; Karen Wilcox, the Digital Product Optimisation Manager at The Postcode Lottery; Graham Gunning, Vice-Chair of Triple Tap Tech, and Harjeet Dhanda, Accessibility Consultant from UserVision.

The inspiring event fuelled conversations for many weeks afterwards, and we would like to share some of our reflections and key takeaways to share our inspiration and motivation to create an inclusive digital world. Let’s first introduce ourselves:

> Doro: “My name is Doro, and I’m a Graduate Developer at Scott Logic. Before becoming a developer, I studied Psychology and worked in mental health, so I enjoy bringing a people-focused view to coding.

> Oded: “And my name is Oded and I’m a senior developer at Scott Logic. I’ve been a developer for about 20 years and I try to focus on the human element and how technology can improve our lives.”

> Doro: “The panel discussion was a truly inspirational event, with many different perspectives and ideas on what we can do to make digital products and services more accessible.“

> Oded: “Yes, I also found the entire event very inspiring. I thought the panellists’ approach was very down-to-earth, and some of their insights were invaluable. What are our biggest takeaways?”

## The barriers that users face

There are a lot of barriers that disabled people face online, many of which could be easily removed if we paid more attention to how we build our websites. For people with a visual impairment—Graham Gunning, for example—a website’s accessibility could be the difference between being able to make use of the website or not. Sometimes the only ‘extra’ effort that is required from the developer’s point of view is to simply use the (semantically) correct HTML tags in the relevant places.

> Doro: “I promise to never use a `<div>` as a `<button>` anymore! It’s really not hard to do, it just takes some practice to get into the right habits.”

Optimising websites for screen readers can make a massive difference to disabled users. Even without much accessibility development experience, you can get a sense of how someone with a screen reader might see your website, simply by trying to navigate through your webpage using the tab key. This allows you to see all the elements that are keyboard focusable, and the ones that aren't. It’s remarkable how much text and information is only displayed visually, in images and icons for example. Tools that use Optical Character Recognition OCR (image-to-text) allows reading text that would be missed by a screen reader, but ‘text in image’ is an inaccessible practice to begin with. A lot of this sounds technical, but it’s simply how people with visual impairments navigate the world every day.

During the pandemic, many essential services transitioned to be online-first, and if they’re not fully accessible they’ll exclude disabled people. One might imagine that an online service would make it more accessible and approachable to everyone; in reality, if the service isn’t designed properly it could exclude disempowered populations, such as elderly people who might be less tech-savvy. In the high-tech industry,  we tend to think that everyone is digitally literate like we are. The reality is actually very far from it, but given that we have this knowledge, we also have the responsibility to build websites that everyone can use.

As developers, we take pride in writing clean code and building user interfaces that look amazing and are easy to use. It's pride in good craftsmanship, and accessibility is a part of that. Imagine if a user tried out your website and said "that's a beautiful website, but I can’t click that button". That’s a really obvious bug that we would fix right away, and that’s exactly what disabled users experience every day; unfortunately, a lot of developers are not aware of that.

> Oded: “Remember that story that one of the panellists told, about building an app that helps with seating arrangements, but when a visually impaired accessibility consultant tested the app, he came back and said *"The app is in line with Web Content Accessibility Guidelines (WCAG) and I can book a seat, but where does my dog sit?"* They had forgotten to allocate the complimentary space on the seating plan for service dogs, so it wasn't accessible.“

[The WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) are a good start, but they do not cover everything. It's only a starting point, and a non-disabled person can easily miss things. That is where lived experience accessibility consultants can raise the bar, especially if they are part of the design process from the very start.

## Including accessibility from the start

> Doro: “One point that all of the panellists raised was how important it is to think about accessibility from start to finish of the project. For a lot of organisations, that requires a significant change of how they operate and a mindset shift. Leadership commitment can make a big difference there.”

When leaders prioritise accessibility, it creates a culture where accessibility is valued and ingrained. It's not about 'sprinkling accessibility' at the end or making adjustments; it's about creating an ecosystem that supports accessibility. This could involve including accessibility as part of the MVP, and making sure it’s addressed in the “Definition of Ready” and the “Definition of Done” stages.

Simply talking more about accessibility at different stages of development can move the needle in the right direction. Accessibility is not just one person or team’s job, it’s a shared responsibility between all of us and we can all take steps in the right direction. It’s okay if things aren’t perfect right away; incremental change is good. Every small accessibility improvement allows one more person to browse your website without barriers.

Of course, every organisation needs to work towards greater inclusivity; but for some organisations, especially in the public sector, it’s absolutely critical. Not only because of the legal requirements, but also because of the core principles of democracy. That might sound pretentious or abstract, but the government needs to make sure that its services are accessible to all citizens, not just some citizens. In practice, that might look like ensuring that the process of issuing a driver's licence is clear and easy to navigate.

It's about providing equal opportunities and ensuring that no one is left behind. No matter how technical the issue is we're working on, we always need to bring in the human element in discussions about accessibility; in this way, we can make it really clear that this is about individual people, not a checkbox to tick off the WCAG requirements.

Creating personas to illustrate the needs of disabled users can be an easy way to bring in that human element throughout the design process, and include disabled people in design considerations like any other user. Creating a persona for a disabled person doesn’t have to be complex, it could be as simple as saying: “This is John. He is blind. He wants to buy a lottery ticket and then go eat his dinner.”  Now we can include John in our user story and design considerations like any other user when we work on creating the best possible user experience.

> Oded: “I think that creating and including personas of people who have a very different experience from you is an exercise in empathy. There’s great value in empathising with different viewpoints and experiences, and approaching your design and build process from multiple perspectives.”

## Accessibility benefits everyone

Every perspective that you take into account offers the possibility to improve your results. Prioritising accessibility benefits not only disabled people but can also remove barriers for someone with a temporary or situational limitation. This graphic from the Microsoft inclusive design toolkit explains that really well:

![Inclusive web design helps people across a spectrum with different related abilities](/uploads/acccessibility_temporary_permanent.png)

[Microsoft Inclusive Design](https://inclusive.microsoft.design/)

This is also referred to as 'the curb-cut effect'. It’s the idea that accessibility features might be appreciated by a much larger user group than originally thought. The dropped curb on sidewalks was originally designed for wheelchair users, but then it turned out that skateboarders, and people with bicycles and prams found them really useful too. Now, they have become so ubiquitous that most people don’t even think of them as an accessibility feature anymore.

> Oded: “It’s great when accessibility becomes part of the norm. It does require dedication from companies, of course. It was interesting to hear from one of the panellists that their company even changed their company logo when they realised the colours were too bright and didn’t have the right contrast. A brand change is not a small feat for an organisation! That’s an impressive level of dedication. I would love to see more companies take accessibility this seriously. Awareness raising is an essential first step.“

> Doro: “We can’t make progress if we don’t understand what we need to work towards and why. Talking about the financial incentives, like [The Purple Pound](https://wearepurple.org.uk/the-purple-pound-infographic/), can nudge people in the right direction. When companies realise that they are turning away millions of potential customers by being inaccessible, they might take steps to address that more quickly. It sometimes feels a bit callous to bring up the business case for accessible design; after all, creating a society where everyone is included should be enough. Still, I understand that every organisation has competing priorities, and a financial incentive can be a great motivator.”

> Oded: “So, what are our key takeaways, what have we learned?”

## Our key takeaways

**Ultimately we want to foster a culture where accessibility is valued and ingrained. Accessibility has many benefits:**

* Including disabled people first and foremost

* The curb-cut effect

* Legal requirements

* Financial benefits

Depending on your audience and the context of the conversation, different arguments are going to make more sense, and that’s okay. The important part is that we’re moving in the right direction.

Accessibility is a shared responsibility across the organisation. When more people with different responsibilities understand the value of accessibility, it becomes easier to incorporate accessibility throughout the entire project lifecycle and accessibility can move from being the exception to being the norm.

Learning and talking about accessibility is a powerful first step, and events like panel discussions, workshops, and talks are a great place to start.

Every person who learns why accessibility is so important and knows the benefits inclusivity brings can make a difference.
