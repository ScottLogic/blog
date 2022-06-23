---
published: true
author: cbrown
layout: default_post
title: Living in an accessible world
summary: >-
  A common misconception is that accessibility is for users that are deemed
  ‘disabled’ in modern society. This blog explores what 'accessibility' really
  is and how we can develop with it in mind.
tags: accessibility user-experience development colours layout disability featured
categories:
  - People
image: cbrown/assets/accessible.jpg
---

A common misconception is that accessibility is for users that are deemed ‘disabled’ in modern society. Knowing that this doesn’t make up the majority of our user base, we often neglect accessibility when creating a user facing product. I often hear:

> “The majority of our user base doesn’t require accessibility so we won’t place any priority on it.”


or

> “It’s only for internal staff, we don’t need to consider accessibility.”

<br/>
But wait! What about all of the users who are **NOT** deemed ‘disabled’?

Consider this. How many of your users… 

* wear glasses?
* have some level of dyslexia or have difficulty reading text?
* like to multitask or use the application on a mobile device?

This blog explores what accessibility _really_ is and how we can develop with it in mind.

## What is accessibility?
‘[oxforddictionaries.com](https://en.oxforddictionaries.com/definition/accessibility)’ defines ‘accessibility’ to be:

> ‘The quality of being able to be reached or entered’

<br/>
Place this in the context of a piece of software, and the definition doesn’t change at all. For a piece of software (or anything for that matter) to be perfectly accessible to users, this definition must hold for all individuals. Regardless of whether the user has a ‘disability’ or not, all content should be easily reachable and interaction with it should not be limited. In terms of _which_ content, it can consist of anything from video, audio or images, to the more simple aspects of an application such as the buttons, links or text.

Enabling usage of these components to all users can ultimately help to improve the user experience within your application. Having good accessibility in your application doesn’t just help your users though. For example, it can help search engines to index content properly or improve the ease of creating automated tests for your application.

That being said, let’s take a look at some of the types of accessibility and how we can incorporate them into our applications.

## Types of accessibility
In this section you can find 10 examples of areas to consider when aiming to develop with accessibility in mind.

### Video
Starting with a simple one. Although it seems obvious, a video can easily become useless if you didn’t have the audio available to you. Users with a hearing disability have exactly this problem. It’s the same reason why you see someone using sign language in the bottom corner of some TV programmes. Understandably, hiring someone to translate your video to sign language is not the most simple of solutions to making a video accessible. However, one simple way is to provide subtitles to your video which is cheap and easy. As an added benefit, it also makes the video accessible to users that are based in a quiet environment (E.G a library).

### Voice recognition
Integrating voice recognition into your application is a great way to add another layer of accessibility, especially in the mobile age. It can be useful to a number of different types of user, such as users that are unable to use the keyboard or the mouse. This could be due to a permanent disability or on a temporary basis (for example users who have a broken arm). Adding voice recognition to your application would allow them to use it. This form of accessibility doesn’t just help those with a disability though. Some users prefer to dictate using voice recognition as it can help to prevent RSI or that they simply prefer to use voice recognition.

![2017-smartphones]({{site.baseurl}}/cbrown/assets/2017-smartphones.jpg)

### Text to speech
There are many third party pieces of software that provide text to speech as well as the native text to speech software available. However ultimately these tools require the page to be structured properly so it can identify the text to read and ensure that it is read aloud in the correct order. For a user who is blind, has difficulty reading text or has dyslexia, not having this function as expected can lead to the user being confused and not being able to use the application. Again, this sort of feature isn’t only for users that have a difficulty reading. By developing your application to allow a screen reader to function correctly, it means users who want to multitask can also use your application.

### Colours and contrast
If it’s important enough to be seen, then it needs to be clear. This applies to everything from text and images to icons and buttons. Many users can have a low sensitivity to contrast. For example, our eyesight deteriorates as we age and so if elderly users are using your application then colour and contrast is definitely something to consider. There is also the consideration of users that have a sight condition for example colour blindness.

![image of colours]({{site.baseurl}}/cbrown/assets/colours.jpg)

With mobile being such a large market, it brings in an additional consideration that prior to the mobile age was not so much of an issue. The clue is in the name, mobile devices are mobile. This means you need to contend with changing light conditions. Your application might be readable on a desktop monitor in a well lit room. But what happens when you load it up on a mobile device and stand outside? Is it as clear as it was before? Part of making colours and contrast levels accessible is selecting a scheme which works across all devices in all environments.

### Clear layout and design
We’ve all been there, when you’re using a website or mobile application and need to change a particular setting. It seems like such a simple task but you just can’t find which menu to look in. Is it in the account settings? Nope. Is it in the general settings? Nope. Is it on the home page? Nope. If only the design would point me to where I need to go…

Having clarity in your layout and design is at the heart of making a usable application and is probably one of the most important forms of accessibility to consider. When releasing an application to the public, first impressions are very important. If a user starts to use your application for the first time and immediately becomes confused, they’re not going to persist with it. Once you lose the confidence and respect of a user, gaining it again can be difficult, especially with users that already lack confidence in using computers.

Having clear headings, navigation bars and a consistent styling is even more important for users with sight disabilities or cognitive and learning disabilities. Ideally you want to avoid all complex layouts as it makes finding content difficult. User testing is a great way to help ensure this. One method of user testing is to present your application to a focus group. Given that the members in a focus group are not selected completely at random, this can help to uncover any improvements that your primary user base requires.

Another method of user testing is to perform ‘Guerrilla testing’. Guerrilla testing is simple and can be highly effective at bringing improvements to light. The concept around Guerrilla testing is to present your application to many randomly selected users whilst keeping the cost and time invested at a minimum. For example, stopping members of the public in the street and taking a few minutes of their time to perform a quick test with your application. Given the random nature and scale of the participant group, Guerrilla testing is an excellent way to avoid missing the obvious when it comes to assessing the design and how accessible your application is.

### Sizing links, buttons and controls
The sizing of links, buttons and controls play a vital part in making your application useable. This is especially true for mobile devices given the reduced precision caveat of having a smaller screen size and using devices on the move. Considering this when developing an application can help to add another layer of accessibility. For example, let’s assume you have developed an application which has a list of radio buttons on a page. However the radio buttons have been developed so that in order to select them you must click the radio button itself (as opposed to the accompanying label). You then give your application to a user with low dexterity (for example they have mild parkinson’s) and to a user that wants to use your application on their phone whilst on the bus. By having such a small selectable area, it makes using the application for both users difficult. Now let’s consider an application that allows you to also click the label of the radio button. This application is ‘accessible’ as both users can select the option they want without having to select a pinpoint component on the page.

![pencil-drawing]({{site.baseurl}}/cbrown/assets/pencil-drawing.jpg)

### Customisable text
It’s all too common that certain fonts and themes make reading text on the screen more difficult. For example many people prefer to use a ‘dark’ theme in order to improve readability. Adding the ability to customise text size, fonts and colour schemes allows the user to customise the application to their personal preference. Mobile devices, again, present a prime example of where this is needed. Most mobile devices provide native accessibility features nowadays. However, these features don’t always work out of the box. For example, iOS applications need to use ‘Dynamic Type’ in order to be compatible with the native text accessibility features.

If you do implement dynamic text in your application, be sure to test that text is still readable at these varying sizes. If I set the text size to the maximum setting, as a user, can I still read the text on screen without it overflowing or being truncated?

### Understandable content
Similar to the previous point, the content itself should be understandable. Take the following sentence:

> “To postulate a conceit more irksome than being addressed in sesquipedalian syntax is adamantine”

Did you know what this means without Googling anything?

It would be much easier to say:

> “Being spoken to in unnecessarily long and complicated language is a pain”

Whilst this _is_ an extreme example, it happens all too often that ‘tech’ words make it into descriptions making it difficult to understand for the everyday user. This should be considered from the early design stages in a project.

### Notifications and feedback
It’s worth mentioning about notifications and providing feedback to the user. Ideally your application should be designed with error prevention in mind. Whether the user does or doesn’t have a disability, where appropriate, you should aim to provide them with as much aid as possible in order to assist them through their user journey.

Considering accessibility at this point is vital. At a basic level, any helper messages should be clear, concise and should not contain any technical language that might confuse the user. Whilst providing help text can prevent the user from running into difficulty, it’s inevitable that you will encounter a user that triggers an error. This is common in applications that contain an input form with validation applied to the fields. In these scenarios your application should provide suitable assistance to help the user get back on track and move forward. In conjunction with assessing how understandable our feedback messages are, we should also consider other accessibility aspects, for example, can these error messages be identified and read aloud by a screen reader? Are they visible on the screen? Has the colour and contrast been considered?

Inclusive of guidance messages it’s also worth ensuring that the application is understandable when the user follows a success path. For example, let the user know that they have successfully logged in or have selected the image on the page. This could be via a text notification or some visual feedback. Accessibility reasoning for this is not dissimilar to reasons mentioned previously. For example, how would a user with a visual disability know that they have successfully updated their account information without a success feedback message being provided to the user?

### Keyboard compatibility
Some users can’t use a mouse. This could be due to a temporary issue (their mouse is broken or they don’t have one) or a more permanent issue (the user has a medical condition that prevents them from using their hands). It’s also possible that some users simply prefer to use the keyboard. For example, when filling in a web form, some users find it easier to tab from field to field rather than clicking in each input. This requires the tab index to be set on the fields correctly. When developing an application, considering keyboard-only use requires very little extra effort and should always be considered.

## Accessibility in a nutshell
Accessibility is often considered an afterthought and labelled as only being required for users that have a ‘disability’. As we have seen though, accessibility consists of so much more and plays a large part in the user experience of an application. If we develop our applications with accessibility in mind from the start, we can add a massive benefit with very little effort. It’s a small price to pay to keep our users happy.

If you would like to know more about accessibility and the standards around it, you can visit the W3C accessibility website [here](https://www.w3.org/WAI/)



