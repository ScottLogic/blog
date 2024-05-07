---
title: BunJS - A fast-rising star?
date: 2023-05-03 00:00:00 Z
categories:
- Tech
tags:
- javascript
- typescript
- NodeJS
- BunJS
author: wmckenzie
summary: A festive look at the latest challenger to NodeJS's throne
---

Last year I attended the Infobip Shift conference where I saw a talk by Tejas Kumar on “[New Trends in Front-End Development](https://www.youtube.com/watch?v=VINfWbaFBVs&list=PLuAItjWV4peETEf336UJKvDsI5RWbshUa&index=31&pp=iAQB)”. In his talk, he demoed building and running a new QwikJS app using Bun instead of Node. I’d been hearing lots of talk about Bun, particularly on the Bytes email blast but hadn’t had a chance to properly check it out so I was particularly interested in seeing how it did.

BunJS is billed as “a fast Javascript all-in-one toolkit”... they’re definitely not lying about the fast part! When he first ran the command to start the app up my colleague and I both looked at each other in amazement and commented “Wow that was fast” (content edited for a PG rating). There wasn’t much more discussed about Bun in the talk, the focus was more on Qwik and it’s approach to Signals, and how that compared to other frameworks (a topic for another time), but it had definitely piqued my interest.

The problem I was struggling to solve was; “What can I use this on?”. Our client work would be an ideal candidate, we certainly saw issues with NodeJs slowness that Bun definitely had the potential to help with, however in the world of Fintech new and fancy also means unknown and risky and adopting new tech can be a hard case to make. 

Then we got to October, and to my eternal annoyance Christmas stuff started appearing in the shops (thankfully no Mariah yet), and, despite myself, I started thinking about Christmas things, and more specifically… [Advent of Code](https://adventofcode.com/). For those currently sitting scratching their heads, Advent of Code is a global series of coding challenges, one a day from the start of December until Christmas Day, set by [Eric Wastl](http://was.tl/), which I took part in for the first time the year before. I’d managed a respectable 6th place on the Scott Logic leaderboard and a slightly better 5th place on the client leaderboard. This year I was hoping to improve on that.

Last year’s efforts I’d written in Python, as a way of keeping my hand in. For the most part, it worked fine but some of the more intensive data processing challenges were painfully slow to run, despite my best efforts at optimising, to the point where, having confirmed that we were basically running the same algorithm, I was using my line manager’s Rust versions to get the final answers. Suffice to say, this year I needed something better. I’d been considering writing in Rust, both because of its obvious performance advantage, and because I’d like to get better at Rust, but my lack of familiarity, combined with the knowledge that the faster you solve the puzzle the more points you get, was giving me trepidation… was BunJS a possible solution? More research was needed!

I decided to take my existing solutions from last year and convert them to Typescript, then benchmark them against the Python versions, and while I was at it, why not compare NodeJS running the same code? The results... were surprising:

### Python

| Day | Data Prep | Task 1     | Task2       | Total       |
|-----|-----------|------------|-------------|-------------|
|   1 |   0.59104 |   0.026226 |    0.014067 |    2.149105 |
|   2 |  0.028133 |   1.204967 |    1.235008 |    4.741907 |
|   3 |  0.030041 |   0.657082 |    0.361919 |    3.296137 |
|   4 |  2.193928 |    0.67997 |    0.469923 |    5.463839 |
|   5 |  0.016212 |   1.994848 |    1.372814 |    4.484892 |
|   6 |  0.022173 |   1.035929 |    3.088236 |    5.753994 |
|   7 |  4.172087 |   0.031948 |    0.022173 |    5.908966 |
|   8 |  3.004313 | 321.163893 |   40.660143 |  366.266966 |
|   9 |   1.01018 |  19.140959 |   94.997644 |  117.190838 |
|  10 |   0.48995 |   0.012875 |    0.025272 |    1.455069 |
|  11 |  0.086069 |    3.18408 | 1076.185703 | 1080.979347 |
|  12 | 26.124954 |  74.841022 |   31.799793 |  136.190891 |
|  13 |  2.291918 |   0.602007 |    7.067204 |   11.980057 |
|  14 |  0.017166 |  130.05209 | 4916.393042 | 5048.125029 |
|  15 |  0.709772 | 2228.88422 |             |             |
|  16 |  0.299931 | 749.699831 | 1292.188883 | 2043.264866 |

### BunJS

| Day | Data Prep | Task 1      | Task 2      | Total       |
|-----|-----------|-------------|-------------|-------------|
| 1   |  1.748967 |    0.142928 |    0.064925 |    2.786357 |
| 2   |  0.026083 |    1.908292 |    1.064129 |     4.41491 |
| 3   |  0.035062 |    2.974646 |    0.745375 |    5.382629 |
| 4   |  1.745684 |    0.886423 |    0.464507 |    3.764245 |
| 5   |  0.038483 |    1.613605 |    0.883742 |    2.792149 |
| 6   |  0.025973 |    5.399242 |     8.93851 |   16.523445 |
| 7   |   0.57537 |     1.07013 |    0.146887 |    7.837843 |
| 8   |  1.536062 |    30.79651 |    3.468016 |   38.804612 |
| 9   |  1.916143 |    8.321198 |   29.577421 |   43.114606 |
| 10  |  0.775073 |     1.29945 |    0.113532 |    5.466702 |
| 11  |  0.517007 |    4.528253 |   86.598141 |   94.108958 |
| 12  |  1.629051 |   23.098499 |   19.713756 |   45.934121 |
| 13  |  1.008153 |    1.562735 |    2.420872 |     6.93212 |
| 14  |  0.039913 |   70.777261 |  921.215483 |  994.024702 |
| 15  |  1.284169 | 3502.799146 | 4108.788668 | 7615.049725 |
| 16  |  1.619275 |  109.284153 | 3671.563318 |  3784.52568 |

### BunJS via NPM

| Day | Data Prep | Task 1      | Task 2      | Total       |
|-----|-----------|-------------|-------------|-------------|
| 1   |  1.156204 |    0.089815 |     0.02905 |    1.631001 |
| 2   |  0.025971 |     2.06866 |    1.543709 |     6.21064 |
| 3   |  0.089616 |    3.850746 |    1.354451 |    7.656712 |
| 4   |  2.646188 |    2.037947 |    0.918084 |    7.897617 |
| 5   |  0.072775 |    9.743062 |    1.911554 |   16.088883 |
| 6   |  0.036151 |    5.491488 |    7.819929 |   18.103653 |
| 7   |  4.972701 |    1.376042 |    0.244659 |    9.505551 |
| 8   |  0.872446 |   33.272144 |    3.167168 |   40.410787 |
| 9   |  1.563592 |     7.83241 |   22.543755 |    34.60378 |
| 10  |  1.146802 |    1.070616 |     0.11946 |    5.535451 |
| 11  |  0.697809 |    5.676932 |   94.388937 |  104.639425 |
| 12  |  1.428591 |   21.896529 |   27.058339 |   52.025615 |
| 13  |  1.310323 |    1.974011 |    3.208853 |   11.825741 |
| 14  |  0.030868 |   66.630601 |  931.044371 | 1000.180086 |
| 15  |  0.866335 | 3703.212977 | 4071.893487 | 7779.582651 |
| 16  |  1.041401 |   92.635882 | 3561.743567 | 3657.851725 |

### NodeJS

| Day | Data Prep     | Task 1       | Task 2        | Total       |
|-----|---------------|--------------|---------------|-------------|
| 1   |  0.6326570511 | 0.7726178169 | 0.09186601639 | 4.036453962 |
| 2   | 0.06083703041 |  3.081161022 |   2.736801147 | 8.797230959 |
| 3   |  0.0717959404 |  1.395604134 |  0.8155229092 | 4.395972967 |
| 4   |   2.967746973 |  1.262831926 |  0.6106090546 |  6.88043499 |
| 5   | 0.03186917305 |  1.607506037 |  0.8835170269 | 4.430343866 |
| 6   | 0.03769493103 |  1.477972984 |   4.335619926 |  7.83961606 |
| 7   |   4.268946886 | 0.8105518818 |  0.1285278797 | 7.313599825 |
| 8   |   0.965007782 |  24.61702394 |   7.036854982 | 35.49565005 |
| 9   |   1.430613995 |  7.346641064 |   19.90986896 | 30.65957308 |
| 10  |  0.7217030525 | 0.5553958416 |  0.4496278763 | 4.492933035 |
| 11  |  0.2193989754 |  2.270998001 |   49.84459496 | 55.24138713 |
| 12  |   2.225651026 |  40.98382688 |   25.68456006 | 70.81108499 |
| 13  |  0.8755860329 | 0.8597660065 |    1.65435195 | 5.230237007 |
| 14  | 0.04812097549 |  71.35918212 |   1641.818351 | 1717.190493 |
| 15  |   1.681344032 |  5801.378749 |     3748.3283 | 9553.386698 |
| 16  |  0.5565521717 |  285.5421021 |   3415.973495 | 3704.117316 |