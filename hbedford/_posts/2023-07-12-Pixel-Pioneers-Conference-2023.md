---
author: hbedford
title: Pixel Pioneers UI/UX Conference 2023
layout: default_post
summary: My summary of a one day UI/UX conference event in the heart of Bristol. There were a range of talks, from declarative design to web development in the times of AI. This was the first conference I'd attended, so here's my thoughts and highlights of the day.
category: UX Design
tags:
- UI
- UX
- Conference
---  

_Unveiling Insights from My First UI/UX Conference._

I wanted to explore the UI/UX conference landscape, and after some research, settled on the local [Pixel Pioneers](https://pixelpioneers.co/events/bristol-2023) event. The conference's lineup of speakers and diverse range of topics piqued my interest, and I was eager to immerse myself in the day.

With a concise one-day duration and a lineup of nine captivating talks, the conference was a condensed knowledge share that immersed attendees in the latest trends and techniques. Across the course of the day the following talks caught my interest:

- Declarative Design
- Animating the Impossible
- Modern CSS Development and Debugging
- Web Development in the Times of AI

### Declarative Design
The conference started with [Jeremy Keith](https://www.linkedin.com/in/adactio/) talking on declarative design, which explored the differences between an imperative and declarative way of programming. To open the talk an analogy of classical vs jazz music was shared. With classical music, the artists are incredibly talented at following sheet music, and can even play a new piece from sight. This is akin to an imperative way of thinking. Jazz musicians, on the other hand, are more free-flowing, creative, and can improvise on the spot. This is more like a declarative way of thinking.

Keith then challenged us to think about how we use UI languages, such as Javascript, HTML and CSS. We tend to think of CSS as an imperative language, detailing exactly how we want the browser page to look. However, it is actually a declarative language. Every line of CSS is a suggestion to the browser. It is then up to the browser to decide how to render the page.

This was a great start to the conference. It really made you think about how we interact and use front end languages, with a reminder that there is never one way to approach a problem. Keith had successfully set the tone for the day, challenging your understanding whilst introducing new ideas.

### Animating the Impossible
We were all held in suspense as to what the impossible was that was going to be animated. To introduce the problem, [Cassie Evans](https://www.linkedin.com/in/cassie-codes/) illustrated a deck of cards. The goal was to move a card from one person's hand to the other. This would mean that the position of the card element needed to change in the DOM. Thus the problem, how do you animate this without causing the card to disappear from the page?

The FLIP animation technique was the solution, which is a pnemonic that stands for first, last, invert and play:

- First: the starting position of the element
- Last: the end position of the element
- Invert: invert the element's position, first becomes last and vice versa
- Play: Animate the inverted positions, so the element appears to go back to its last position

Applying this technique meant that no element would disappear from the page, and the animation would appear seamless. To justify this, Evans showed the three stages of how a browser renders a page: construction, layout and paint. Without using the FLIP technique, we'd have to hit the construction stage twice, which is very expensive. Whereas with the FLIP technique, we do not need to reconstruct the DOM, and can jump straight to the paint stage, saving precious compute time.

Before this talk I had never heard of the FLIP animation technique. In fact, I hadn't delved into the world of animation much at all. Evans' talk was an exciting introduction to the topic, which made me appreciate the skill associated with creating smooth and efficient animations.

### Modern CSS Development and Debugging
Next on the list of talks was a rapid fire session on modern CSS development and debugging by [Umar Hansa](https://umaar.com/). Whilst not all related to just CSS, the personal list of useful tools were interesting. For example, the sticky scroll setting in vscode was mentioned that helps a developer quickly see what code section they are in. Other tools included how to load css faster when developing, and making instant changes that could be easily copied to a local CSS file.

This was a rapid fire talk, very much breadth first! So, it was understandable that not all the tools mentioned elicited a response of _'oh yeah I need to be using that!'_ . However, it was a great reminder that there are many tools and extensions out there to help aid development. It's just a case of finding the ones that work for you.

### Web Development in the Times of AI
[Christian Heilmann](https://www.linkedin.com/in/christianheilmann/) rounded off the day with an excellent talk on web development and how it relates to AI. It felt like a rally cry towards the warnings and assumptions of AI. The hype around the subject was put into question. Is it _actually_ useful? Is it ready? Heilmann conveyed an anxiety around the transparency of training data sources. Without it, how can we verify AI's validity from a technical point of view? What struck me was how he questioned what is being used to train these models. There are many bad examples of code out there, but are they being used for training? If so, then surely there should be a way to signpost a repository as exempt from being used as training.

What was highlighted though was how AI can work with developers to automate less interesting tasks. If used correctly, it could save time and allow developers to focus on more interesting pieces of work.

## Personal Reflection

I didn't really know what to expect from my first UI/UX conference, but was pleasantly surprised by the variety of talks, and the quality of the speakers. It was a great opportunity to learn about new techniques and tools, and to see how other developers approach their work. I would definitely recommend attending a UI/UX conference to anyone who is interested in the field. It is a great way to expand your horizons and learn about new ideas.
