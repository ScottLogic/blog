---
title: Testing in Production
date: 2025-06-26 00:00:00 Z
categories:
- Testing
tags:
- Agile
- CI
- Testing
summary: What? You want to test in production? You must be joking! 
author: dmcnamee
image: "/assets/testing-in-production.png"
layout: default_post
---

<img src="{{ site.baseurl }}/dmcnamee/assets/testing-in-production.png" width="100%" alt="Testing in Production abstract image" title="Testing in Production">

# Testing in Production: Are We Seriously Doing This?!

Alright, folks, gather 'round, because I've got a rather wild one for you. You know how we usually put our software through its paces in these rather pristine, perfectly controlled environments, miles away from the chaotic, unpredictable beast that is "production"? Well, apparently, some brave (or perhaps utterly barmy) souls have decided, "Nah, let's just… test it there."

Yes, you heard that right. We're talking about **Testing in Production (TiP)**. Your initial reaction? "Are they completely crackers? You can't test in live!" But then you look at who's doing it – giants like Google, Netflix, and Amazon – and you start to think, "Hold on a minute, perhaps there's a method to this madness?"

---

## Why on Earth Would Anyone Do This?! (The Surprisingly Brilliant Bits)

It sounds like a recipe for disaster, doesn't it? Deploying untested code to actual users? But hold onto your hats, because it turns out there are some genuinely surprising benefits:

* **It's the Real Deal, Mate!** Forget your perfectly sanitised test data and your staged environments that almost, but not quite, replicate production. With TiP, you're testing with **real users, real data, and real-world chaos**. It's like trying to scuba dive in a paddling pool, versus jumping into the proper ocean. Turns out, the ocean gives you the big picture, a much better idea of what you're up against.

* **"Oops, My Bad!" (But Only for a Few):** The beauty of TiP is that you don't just unleash your new feature on absolutely everyone. Oh no, that would be truly bonkers. Instead, you roll it out to a **tiny percentage of users**. If something goes pear-shaped (and let's be honest, it sometimes does), only a handful of people are affected. It's like a controlled explosion – small, contained, and you learn a tremendous amount from it.

* **Instant Gratification (and Panic):** Remember waiting days or weeks for feedback from a test cycle? Not anymore! With TiP, you get **real-time insights** into how your application is performing. Errors pop up, performance metrics fluctuate, and you know immediately if you've broken something. It's exhilarating, terrifying, and incredibly efficient.

* **Full Steam Ahead Mode Activated:** If you want to move at a lick, like, "warp speed" fast, TiP is your friend. By validating changes directly in production, you can **iterate quicker**, respond to user needs on a sixpence, and deploy new features with a frequency that would make traditional testing teams feel a bit faint.

* **Who Needs a Staging Environment Anyway? (Only Joking... Mostly):** While TiP doesn't replace all pre-production testing, it certainly takes the pressure off having to create an exact, flawless replica of your production environment. That alone can save a fair bit of time and resources.

---

## So, How Do These Clever Clogs Pull It Off? (It's Not Pure Chaos)

Okay, so it's not just a complete free-for-all. There are some obvious ways these companies manage to test in production without setting everything on fire:

* **Canary Releases (The "Dipping Your Toe In" Method):** This is the cornerstone. You deploy your new code to a tiny fraction of your servers or users – your "**canaries**." If the canaries start singing (or, more accurately, screaming with errors), you know to pull it back before the whole flock is affected.

* **Feature Flags (The "On/Off Switch of Power"):** Imagine having a remote control for every feature in your app. That's what **feature flags** give you. You can literally toggle features on or off for specific users or groups, allowing you to experiment, test, and even disable a problematic feature instantly without a full redeployment. It's like magic, but with more code.

* **Observability Galore (Watching Like a Hawk):** If you're going to test in production, you absolutely must have eyes everywhere. Robust **monitoring, logging, and alerting systems** are non-negotiable. You need to know exactly what's happening, when it's happening, and why it's happening, in real-time.

* **Automate All the Things!:** Manual testing in production? That's a definite no-go. **Automation** is key for consistent, efficient validation. Automated tests running against live traffic help ensure everything is humming along nicely.

* **The "Oh Crikey, Rollback!" Button:** Even with all the precautions, things can still go wrong. A solid, well-practised **rollback plan** is essential. With feature flags, this can be as simple as flipping a switch, but you may need more than just feature flags. Depending on your application, you may need back ups to restore to, particularly where data is involved, or parallel environments to switch to. The ability to quickly revert a dodgy change is your ultimate safety net.

* **A/B Testing (The "Which One Do You Fancy?" Game):** Want to know if users prefer a blue button or a red one? Or if a new workflow is more intuitive? **A/B testing** in production lets you show different versions to different user segments and collect real data on which performs best. It's like a popularity contest, but for features.

* **Chaos Engineering (Yes, They Break Things on Purpose):** This one is truly next-level. Companies like Netflix famously use "Chaos Monkey" to intentionally inject failures into their production systems. Why? To see how resilient their systems are and to proactively uncover weaknesses before they cause a real outage. It's like stress-testing your house by setting off small, controlled fires. (Don't try this at home, kids, seriously.)

---

## A Crucial Caveat: This Isn't a Free Pass to Skip Homework!

Now, before you get too excited and start deploying your half-baked code directly to your customers, let's be absolutely clear: **Testing in Production does NOT replace robust testing earlier in your development cycle.**

Think of it this way: You wouldn't build a house by just throwing bricks around and seeing how they land, would you? You'd design it, pour a solid foundation, frame the structure, and then inspect it every step of the way.

**Unit tests, integration tests, end-to-end tests, static code analysis, peer reviews** – these are your essential building blocks. They catch the vast majority of bugs, logic errors, and security vulnerabilities before your code even gets a whiff of a live server.

Testing in Production is the ultimate safety net and feedback loop, not a substitute for due diligence. It's about catching the insidious, real-world problems that even the most meticulously crafted pre-production tests might miss. It's the final frontier of validation, not the first line of defence.

So, while the idea of "testing in production" might still sound a little wild, the results speak for themselves. For organisations that want to move fast, deliver high-quality software, and truly understand how their users interact with their products, it's becoming less of an incredulous concept and more of a strategic imperative. Just remember to bring your safety goggles and a very big "undo" button!

What are your thoughts on testing in production? Are you already employing some of these techniques?
