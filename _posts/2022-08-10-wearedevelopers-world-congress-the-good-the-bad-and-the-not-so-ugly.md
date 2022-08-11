---
title: WeAreDevelopers World Congress - The good, the bad, and the not-so-ugly
date: 2022-08-10 00:00:00 Z
categories:
- awhitmell
- People
author: awhitmell
layout: default_post
summary: A balanced overview of the WeAreDevelopers World Congress 2022 tries to answer the question, "Are international conferences worth all that time and effort?"
---

<img src="{{site.github.url}}/awhitmell/assets/berlin/group.jpg" alt="Scott Logic group photo at the conference" width = fill style="float: centre;" />

“Ich bin ein entwickler” - John F. Kennedy


### Introduction
From cloud-based medical physics to quantum computing, from IBM and JetBrains to university students and technology fanatics, The WeAreDevelopers Word Congress benefitted hugely from the differing passions and interests across a wide range of talented speakers. With over 8000 tickets sold, this two day conference was melting pot of different cultures, experiences, and ideas. 

<img src="{{site.github.url}}/awhitmell/assets/berlin/beer.jpg" alt="A pint of beer that is 60% froth" width = 250 style="float: right;" />

Between presentations, company stalls were there to entertain, notably Ikea handing out ice creams in the baking 28°C summer heat, and winning everyone’s admiration in the process. Some, in desperate need of employees, turned to free vouchers and sweets in an attempt to galvanise engagement via the oldest trick in the book. This exposition element supported the social side of the conference, with a stall even bringing Table Football to help break the ice. One business very kindly gave me what I can only describe as a warm, 4% ABV, bubble bath. 


### The good
The conference kicked off as all good events should do, talking about software! Widespread belief implies AI, such as GitHub Copilot will see across the board integration in the workplace. Trained on billions of lines of code, GitHub Copilot can produce blocks of syntactically correct code from a single user comment. CEO, Thomas Dohmke claims that up to 40% of code today could be written by Copilot with that rising to 80% in the near future. He did however, assure us that Copilot was here to help and not to make us obsolete, though I’m not sure how much I believe him!

The legendary mind behind the book that is the number “9” printed one million times, Douglas Crockford, gave a gripping talk on randomness. Easily and accurately obtaining true randomness is an obstacle facing the cryptology world, currently the best solution is to combine multiple random number generators, such that if one is not truly random or is compromised in some way, the end result is still secure. Given the American NSA’s continual insistence of adding exploitable flaws to modern encryption standards, it raises questions about just how secure we think our data is, though this could be an entirely separate blog post in itself!

<img src="{{site.github.url}}/awhitmell/assets/berlin/crockford.jpg" alt="Douglas Crockford presenting on the main stage" width = fill style="float: center;" />

Application security featured heavily, with common pitfalls being highlighted and addressed. Cross-site scripting injection via frontend bypass is all too common nowadays, and often not handled correctly. Some developers will place all input sanitation in the frontend, unaware of how easy it to bypass it, and inject code into the backend directly, wreaking havoc. The five major mistakes covered all had the same solution: sanitise and escape all user inputs, ideally server side to stop any frontend bypasses, though sanitising twice is better than not sanitising at all. 

Another noteworthy theme covered was coding best practices. By writing pure functions, being consistent when using design patterns, debugging and writing appropriate unit tests becomes much easier. Consistent code is easier to read, and less prone to error. As the speaker herself said, “A web app is just multiple functions stacked on top of each other wearing a trench coat”, making it vitally important these functions are well written, easy to understand, and even easier to fix if something goes wrong. While this talk wasn’t as awe inspiring as Nvidia’s robotics simulation suite, it was arguably the most important of the event, and as a more junior developer, something that you just cannot hear enough times.


### The bad
With exception to the aforementioned Nvidia, there was an unfortunate trend of company sponsored talks being far more dull and self-centred than the others. Porsche and Zeiss both spent upwards of half an hour talking about their problems and niche workarounds, however their specific solution for a performance sports car app just isn’t applicable to any other scenario. If you weren’t interested in that exact fix then you would find yourself questioning why the talk mattered, and what were you getting out of it?

Spending 30 minutes talking about the ins and outs of your particular contractual agreement with Microsoft in which you pay them a certain fee and they’ll help with your medical optometry software, leaves the audience wondering why they’re there. If you have no ties to the medical physics world, or don’t happen to have a legally binding agreement with fifth biggest technology company of 2021 by revenue, then you’ve not learned anything, your perspectives haven’t been challenged, and you wish you’d heard a different speaker present something else instead. 


### The end
<img src="{{site.github.url}}/awhitmell/assets/berlin/beer.jpg" alt="Some Scott Logicians playing Codenames in a beer garden" width = 250 style="float: right;" />
Microsoft struck again, closing the World Congress with a rather underwhelming ~~advertisement~~ talk informing us of how good VS Code, Edge, Surface Books, and GitHub are. In the process souring what was otherwise an excellent event. It did make me wonder whether GitHub Copilot would be able to turn such a dreary talk into something palatable. Despite this disappointing end to the conference, our journey came to a close in a beer garden later that night. For the majority of my colleagues there, that night was the first time I had met them, and their warm and welcoming nature is something I am thankful for. As I sat there, full of beer, listening to my peers screaming over a game of Codenames, I couldn’t help but think that by taking this job I hadn’t joined a company, but rather, a family.

In summary I loved every second of this trip, and am incredibly grateful for having the opportunity to experience something I had never done before. I do strongly recommend considering a large scale conference for the unparalleled benefits in networking, learning new things, and having your current perspectives challenged. 
