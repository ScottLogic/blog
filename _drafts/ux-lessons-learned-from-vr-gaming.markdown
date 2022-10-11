---
title: UX Lessons Learned from VR Gaming
date: 2022-10-11 09:56:00 Z
categories:
- UX Design
tags:
- ux design
- UX
- UI
- VR
summary: Virtual Reality gaming has some unique UX challenges. But what lessons can
  be applied from VR to all flatscreen applications?
author: delliott
---

Virtual Reality (VR) is still relatively immature from a User Experience (UX) point of view. It’s sometimes referred to as a ‘Wild West’ as it doesn’t yet have the established patterns and mental models of most flat screen technology. As it grows in popularity, many users are new to VR, and the completely new way of interacting with a digital world causes a lot of UX pain points.

So, what UX lessons can we learn from VR that can be transferred to flat screen applications?

During the pandemic I bought a Valve Index VR Headset and have played a variety of driving, shooting, social, rhythm and other games, with mixed success!

Here are some of the pain points I’ve stumbled upon during my experiences and how I believe the lessons can be applied to all User Experiences.

## Lack of help or documentation

\[ gif of flailing trying to make something work \]

Generally, when we start a process that is novel to us we would expect some instructions or tuition. On mobile or desktop applications that might be text instructions, tooltips or help screens. In more interactive experiences this is often tutorials or intro levels. Some VR titles however, seem to skip over this entirely.

Hotdogs, Horseshoes and Handgrenades (H3VR) is an in-depth shooting range game with a huge range of detailed weapon models. However quite often there are no instructions on how to use a piece of in-game equipment. Although figuring out how to load a belt-fed machine gun is part of the fun of the game, I’ve quit a couple of times because I’ve spawned enemies and they do nothing, or it’s not clear how actions have been mapped to my controller.

Another example is VTOL VR, a flight simulator game. It does have some tutorial missions, however the difficulty level goes up 10x when you go into actual missions or play multiplayer. It assumes prior knowledge of air combat and evasion that leaves new players getting consistently punished.

### Lesson

Remember, you are not the user. If you are developing a product you will build up expert knowledge of that product, don’t assume any prior knowledge from users. Guide and teach new users, then have those lessons within easy reach for if a user hasn’t used your product in a while.

## Menus and Navigation

\[ gif of over complex navigation \]

Easy navigation is a cornerstone of good UX. Allowing users easy control over their experience is critical for their success and comfort. There are a few VR games that seem to have missed the mark on navigation.

VRChat is a social VR game, along the lines of Second Life. They recently renewed their UI, but it still feels over complicated. There is a launch pad menu, a radial context menu and a main menu. Once you have memorised where the commonly used options are you’re alright, but numerous times I’ve had other players have to tell me where some new option or feature is. I can only imagine it is horror for a new player.

Another roach motel is Pavlov VR. It’s a shooter game in the same vein as Counter Strike. A problem with VR is that there are no agreed upon controller layouts, so there is no consistent way to get a pause menu for example. In Pavlov, the pause action is a combination of a button and a trigger, which takes a huge amount of experimentation to find and leaves you essentially trapped in a game! You might learn how to do it, but after a few weeks it’s quickly forgotten.

### Lesson

Always let the user know where they are in an application, and how they can get back out. In websites and applications, design patterns like breadcrumbs, step indicators, pagination and dropdown menus can help us find our way back from dead ends and orphan pages. 404 pages should have helpful links if resources are lost and failed form submissions should have easy recovery and helpful error messages.

## Comfort

\[ gif of rally barrel roll \]

One aspect of VR that you notice more than with flat screen tech is comfort. There is of course the physical comfort of a headset on your face, but beyond that it’s the comfort of the interaction and visual display.

A common complaint of first time VR users is motion sickness. This can be solved by avoiding sudden changes in directions or speed. However, some users don't suffer motion sickness and would prefer their motions not to be smoothed out. It's always important to give users control of their experience.

For example, in Pavlov VR, when the main menu first loads it goes from a dark loading screen, to a very bright snowy landscape. The brightness of VR headsets makes this incredibly startling and usually makes me wince in discomfort.

Discomfort can also be due to poor placement of controls. Sometimes UI elements are placed on the back of a players hand, or on their chest or hips, other times they are control panels or levers in level. These can cause discomfort through being hard to reach or having to look down constantly. If you’ve ever gotten a sore neck looking down to watch a film on your phone, imagine doing that with a moderately heavy headset strapped to the front of your face!

### Lesson

An application that is comfortable to use won’t have startling transitions and styling should be consistent. The controls you use the most should be easy to reach and easy to recognise. If you build a mobile phone app, keep the main buttons and actions within easy thumb reach! Be aware of potential repetitive strain from unnatural or awkward movements.

## Interaction Pains

\[ gif of failing to type/pick somthing up \]

Interaction Design in mobile devices has undergone huge investment to create an intuitive experiences with interactions such as taps, swipes, accelerometers and limited buttons. VR has not yet had this investment and interactions can be clunky.

The main way to interact in VR is with triggers and buttons on hand-held controllers. Often an in-game laser will emit from the front of your controller allowing you to click on objects across the room. However this becomes difficult with small or cluttered targets as your aim and controller tracking need to be very accurate.

A major pain is typing in VR. In many applications a flat keyboard will emerge in front of you and you use your controller lasers to point at each key and pull the trigger to select each character. However this is quite slow and you need to be very accurate, pulling the trigger quite often shifts your aim and you can misclick keys.

Another interaction fairly unique to VR is being able to grab and move items. It opens up a world of unique interactions, but it also brings unique user pains. How do you indicate what is interactable? Usually not everything in a room is pickup-able so you have to add a glow or some effect when you get near it. Where can you pick items up from? A bucket might have a handle but what if a user tries to pick it up from the bottom?

Many traditionally flat screen interface factors matter in VR as well, such as whitespace between elements, visual weighting and obviously sign posting the functionality and state of a form field. Physical user interface design is also relevant, such as haptic feedback when you interact with a switch, keeping important items within arms reach and logical grouping of controls.

### Lessons

Interaction design always needs careful consideration. VR interaction design forces us to be very analytical of what users are trying to do and the context they are doing it in. In desktop and mobile many interactions may seem obvious as there are so many established methods already available. However, sometimes you need research how users are actually interacting with your product and not use ‘off-the-shelf’ solutions.

## Hardware Limitations

\[ gif of index finger tracking \]

VR hardware is still quite varied. Meta (used to be Oculus, bought by Facebook) have taken a lot of the market with their Quest 2, a wireless self contained headset. Valve has their wired index, Vive has some options and there are other smaller manufacturers like Pimax. Not forgetting PlaystationVR.

This variety is great for competition and innovation but there are issues. Different headsets have different controller layouts, meaning the mapping of functions is inconsistent. Some are wireless allowing full freedom of movement but have limited play time due to batteries. Some are wired with unlimited play time but you can get caught up in cables if you spin too much or walk backwards.

What all of this means is you have to carefully consider all use cases in UX decisions. Are assets optimised to have small file sizes and function on self contained headsets like the Quest? Valve index controllers allow you to flex individual fingers. Do these interactions work with the simpler Vive controllers?

### Lessons

Allow top tier experiences but also consider low end hardware and connections. In web applications optimise for mobile and keep things streamlined. Be empathetic to people using products differently to you; you might use a program at a desk with a large monitor and a fibre broadband connection, others might be doing it on their phone out and about with poor 3G reception.

## Typography

\[ gif of small type \]

Text in VR can be quite tricky to read. This can be due to lens clarity, viewing text from an angle and varying distance. It’s rare that text is pin sharp. As such, sizing, colour contrast and font face selection are even more important than in flat screen applications. I’ve lost count of the amount of times I’ve had to pull an asset right up to my face to be able to read it in VR.

### Lessons

Choose fonts and font styles carefully. Be aware they might not always be pin sharp and legible. Be empathetic to people with visual impairments and consider options for magnification or high contrast.

## The Future

I’ve talked a lot about missteps in VR User Experiences, but it’s definitely not all bad. There are a number of fantastic and intuitive experiences, backed up by lots of ground breaking research.

Many companies are beginning to see the opportunities in Virtual Reality, Augmented Reality and Mixed Reality Technologies. As this grows we are seeing some standards and agreements on best practices being developed by industry leaders.

These standards need constant development though as there is a steady stream of new technology. Recent innovations include better lenses, processing power and ways to interact with a virtual world like haptic feedback gloves, 360 degree treadmills and facial/eye tracking.

## Takeaways

The experimental and emerging nature of VR reminds us of some of the UX fundamentals that need to be considered in all projects, no matter the format.

These are:

* Always be empathetic to first time users and give plenty of instructions and guidance.

* Make navigation easy. Signpost where a user is at all times and offer obvious escape routes

* Be mindful of comfort. Make screens clutter free and pleasurable to look at.

* Always consider interaction design. Remember not everyone will be using your product in the same way, think about touch vs mouse vs keyboard only control.

* Be aware that different hardware exists, an application on desktop might be too processor, network or memory heavy for an enjoyable experience on mobile or low end computers on a phone hotspot connection.

* Consider legibility in font selection and styling. Text’s primary purpose should be to be consumed, not to be decorative. Use clear font styles with good colour contrast to the background.

By being mindful of these factors you have a better chance to create a pleasurable and productive user experiences in virtual reality, augmented reality or reality reality!

**References:**

UX \+ VR: 14 Guidelines for Creating Great First Experiences

[https://medium.com/@oneStaci/https-medium-com-ux-vr-18-guidelines-51ef667c2c49](https://medium.com/@oneStaci/https-medium-com-ux-vr-18-guidelines-51ef667c2c49)

Oculus Designing for Hands Documentation

[https://developer.oculus.com/resources/hands-design-intro/](https://developer.oculus.com/resources/hands-design-intro/)

NN Group UI Guidelines

[https://www.interaction-design.org/literature/article/user-interface-design-guidelines-10-rules-of-thumb](https://www.interaction-design.org/literature/article/user-interface-design-guidelines-10-rules-of-thumb)

Virtual Reality (VR) Design & User Experience

[https://xd.adobe.com/ideas/principles/emerging-technology/virtual-reality-design/](https://xd.adobe.com/ideas/principles/emerging-technology/virtual-reality-design/)

Ultraleap Developer Documentation

[https://docs.ultraleap.com/](https://docs.ultraleap.com/)