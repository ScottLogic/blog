---
title: Bun - A fast-rising star?
date: 2024-05-20 00:00:00 Z
categories:
  - Tech
tags:
  - javascript
  - TypeScript
  - Node.js
  - Bun
  - Christmas
author: wmckenzie
summary: A (belated) festive look at the latest challenger to Node.js's throne
---

<style>
@media print, screen and (min-width: 64em) {
    table {
        margin-left: calc((16.66667% + .9375rem)* -1);
        margin-right: calc((16.66667% + .9375rem)* -1);
    }
}
</style>

## A trip down memory lane...

Last year I attended the Infobip Shift conference, where I attended a talk by Tejas Kumar on “[New Trends in Front-End Development](https://www.youtube.com/watch?v=VINfWbaFBVs&list=PLuAItjWV4peETEf336UJKvDsI5RWbshUa&index=31&pp=iAQB)”. In his talk, he demoed building and running a new Qwik app using Bun instead of Node.js. I’d been hearing lots of talk about Bun, particularly on the Bytes email blast but hadn’t had a chance to properly check it out so I was particularly interested in seeing how it did.

Bun is billed as “a fast JavaScript all-in-one toolkit”... they’re not lying about the fast part! When he first ran the command to start the app up my colleague and I both looked at each other in amazement and commented: “Wow that was fast” (content edited for a PG rating). There wasn’t much more discussed about Bun in the talk, the focus was more on Qwik and its approach to Signals, and how that compared to other frameworks (a topic for another time), but my interest was certainly piqued.

The problem I was struggling to solve was: “What can I use this on?”. Our client work would be an ideal candidate, we certainly saw issues with Node.js slowness that Bun had the potential to help with, however in the world of Fintech, new and fancy also means unknown and risky, and adopting new tech can be a hard case to make.

![Grumpy Santa Cat]({{ site.github.url }}/wmckenzie/assets/grumpy-santa-cat.jpg)

Then we got to October and, to my eternal annoyance, Christmas stuff started appearing in the shops (thankfully no Mariah yet). Despite myself, I started thinking about Christmas things, and more specifically… [Advent of Code](https://adventofcode.com/). For those currently sitting scratching their heads, Advent of Code is a global series of coding challenges, one a day from the start of December until Christmas Day, set by [Eric Wastl](http://was.tl/). I'd taken part for the first time the year before and managed a respectable 6th place on the Scott Logic leaderboard and a slightly better 5th place on the client leaderboard. This year I was hoping to improve on that.

## Formulating a plan

My first attempts were written in Python, as a way of keeping my hand in. For the most part, it worked fine but some of the more intensive data processing challenges were painfully slow to run, despite my best efforts at optimising. There were points where having confirmed that we were basically running the same algorithm, I was using my line manager’s Rust versions to get the final answers. Suffice to say, this year I needed something better. I’d been considering writing in Rust, both because of its obvious performance advantage, and because I’d like to get better at Rust. My lack of familiarity, however, combined with the knowledge that the faster you solve the puzzle the more points you get, was giving me trepidation… was Bun a possible solution? More research was needed!

I decided to take my existing solutions from last year and convert them to TypeScript, then benchmark them against the Python versions, and while I was at it, why not compare Node.js running the same code? The results... were surprising:

## The results are in

![Speed Comparisons between languages]({{ site.github.url }}/wmckenzie/assets/speed-comparison-chart.svg)

| Language      | Day 10                                          | Day 11                                              | Day 12                                            | Day 13                                           | Day 14                                              | Day 15                                              | Day 16                                              |
| ------------- | ----------------------------------------------- | --------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| Python        | 1.570066                                        | <span style="color:green"><b>39.33278733</b></span> | 145.323992                                        | 13.61234967                                      | 4243.105014                                         | Failed                                              | <span style="color:green"><b>1874.640703</b></span> |
| Bun         | <span style="color:green"><b>1.06759</b></span> | 96.37504                                            | 57.367071                                         | <span style="color:green"><b>3.588709</b></span> | 1139.287269                                         | 8118.08808                                          | 3896.015796                                         |
| Bun via NPM | 2.701455                                        | 105.319079                                          | <span style="color:green"><b>49.231411</b></span> | 6.679770667                                      | <span style="color:green"><b>975.7302437</b></span> | <span style="color:green"><b>8085.080331</b></span> | 3948.378316                                         |
| Node.js        | 2.980631669                                     | 69.88842698                                         | 74.05843997                                       | 5.454815348                                      | 1994.470144                                         | 10390.28093                                         | 3724.372108                                         |

> N.B. For the purposes of keeping the table concise I've focused on a week's worth of tasks in the middle of the month. This gave me problems with a reasonable degree of difficulty but not ones that would be difficult to re-engineer in TypeScript. I've also only included the average total time to load data and complete both parts of each problem across 3 runs, rather than comparing each individual segment.

There's certainly no clear, runaway winner. I'd expected Python to still be the faster option, with Bun maybe coming close, but both beating Node.js across the board. However, as we can see, things weren't quite so clear-cut.

Bun actually managed to outperform Python across the majority of the examples, with 5 total wins to Python's 2. Even expanding this out to the first 16 days, Bun stays ahead with 10 total wins, beating Python's 5 and Node.js's 1. Perhaps most interesting was the fact that calling Bun via NPM performed the best, taking
6 wins to the direct approach's 4. I would've expected the extra overhead to have a negative impact. Admittedly there may have been some skewing of data on this, the run
times via NPM mostly tended to decrease on each execution, suggesting a degree of caching may be taking place.

Also pretty impressive is that both Bun and Node.js managed to produce a result on day 15 where Python continued to crash out. Granted there's probably a flaw in my Python code,
but the TypeScript code is pretty much a like-for-like conversion. I also felt like Bun's perceived load time was faster, even on solutions where Python had the
fastest execution time, the time from pressing enter to starting to see output often seemed quite long, with Bun feeling much more responsive.

## So what did we learn?

![In Conclusion]({{ site.github.url}}/wmckenzie/assets/in-conclusion.jpg)

Let's start with the main question, is Bun faster than Node.js? The results would suggest that on average, yes, Bun executes the same code faster than Node.js.

Should you immediately switch all Node.js projects to Bun? Probably not, while Bun was faster, I would say the differences are not really great enough to warrant the
overhead of any refactoring, however minor. I also hit a scenario in last year's Advent of Code where Bun couldn't run the solution due to import issues, but Node.js could,
so you may find that converting to Bun will break your project.

Should I consider Bun when starting a new project? Absolutely! For most use cases you're unlikely to have an issue, and transitioning back to Node.js should be relatively 
straightforward, should you need to. The out-of-the-box TypeScript and ESM handling is especially nice. I found I had a lot of headaches with ESM TypeScript loaders trying to 
make the scripts run via Node.js without compiling, and faster startup times for your application are never a bad thing.

Should I switch all my Python projects to Bun? Again, probably not. Python is still really fast, and, particularly for these kinds of problems, there are a lot of packages
available to make implementing the more complex algorithms a lot easier. Not to mention, sometimes Python can handle the bigger datasets a lot better, as I found with last year's challenges.

Should I do Advent of Code? Absolutely! While some days' puzzles are downright horrible, for the most part, it's pretty fun, and you can learn a lot about algorithms and more
advanced optimisation techniques.

And in case you're wondering how I did this time around, I managed 2nd place on both. I've no idea how...
