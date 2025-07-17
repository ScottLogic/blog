---
title: Foreign Currency Trading Heuristic Testing Cheat Sheet
date: 2017-01-15 00:00:00 Z
categories:
- Testing
tags:
- software testing
- exploratory testing
- trading
- foreign currency exchange
- heuristics
- featured
author: rhamilton
title-short: Foreign Currency Trading Heuristic Testing Cheat Sheet
summary: After 18 months testing FX trading software I decided to create and share
  a heuristic cheat sheet to help explore trading apps.
layout: default_post
image: rhamilton/assets/featured/fx-cheat-sheet.jpg
---

<img src="{{ site.baseurl }}/rhamilton/assets/currency.jpg" alt="title image" title="title image"/>

Happy New Year everyone!

For the last 18 months I have been testing software designed to trade foreign currency, known as FX or Forex trading software.

I consider myself lucky as I joined the project on day one which enabled me to learn a lot about testing trading systems.

## Challenges

Financial software, including trading applications, can be some of the most incredibly difficult complex applications to test because they contain many challenges such as:

* Many concurrent users
* High rates of transactions per second
* Large numbers of systems, services and applications that all integrate with each other
* A need to process transactions in real time
* Time sensitive data e.g. the price to buy a Euro can change multiple times every second
* Catastrophic consequences for a system failure, bugs can cause financial loss
* Extremely high complexity level


At the start of my current project, I found very few resources available for testers covering complex financial systems. The few resources that I was able to find were quite dated and generally advised to write detailed plans and document all tests before executing them. I simply couldn't find any information about approaching testing of financial systems in a modern, agile, context driven way.

I was very fortunate on my project that I was able to implement testing with agility and focus on risk. Long checks historically done manually by human testers were replaced with good automated integration test coverage. The team also chose to release to production as frequently as possible, usually once a week. Not having to constantly repeat manual checks of existing functionality gave me time to do a LOT of exploratory testing. Almost all the really bad bugs, the ones with financial consequences, were found during exploratory testing sessions.

##Heuristic Testing Cheat Sheet

Given the high level of exploratory testing I was able to do on my project, I generated a lot of ideas and identified some high risk areas and common mistakes. I have decided to put together a heuristic testing cheat sheet for anyone carrying out exploratory testing of trading software.

The following is a low resolution thumbnail, click to expand, or <a href="{{ site.baseurl }}/rhamilton/assets/cheat-sheet/trading-heuristic-testing-cheat-sheet.png">download directly from this link</a>.

<a href="{{ site.baseurl }}/rhamilton/assets/cheat-sheet/trading-heuristic-testing-cheat-sheet.png">
  <img src="{{ site.baseurl }}/rhamilton/assets/cheat-sheet/trading-heuristic-testing-cheat-sheet-small.jpg" alt="Foreign Currency Trading Heuristic Testing Cheat Sheet" title="Foreign Currency Trading Heuristic Testing Cheat Sheet"/>
</a>

I wanted to combine my knowledge of trading with some of the ideas I generated. On the sheet my ideas are written around the knowledge in magenta coloured boxes. I hope this may be useful to anyone working on trading software.

This post was also published on my software testing blog [Mega Ultra Super Happy Software Testing Fun time](http://testingfuntime.blogspot.co.uk/).
