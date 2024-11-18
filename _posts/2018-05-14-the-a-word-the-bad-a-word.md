---
title: The A word. The BAD A word.
date: 2018-05-14 00:00:00 Z
categories:
- Testing
tags:
- Testing,
- Automation
author: efiennes
layout: default_post
summary: 'A bad beginning... A testing bedtime story that even Crackanory would reject for transmission on the basis it was too crackpot and twisted to be credible. Gather closer my precious readers, sitting comfortably? Good, then I can begin. Abide me carefully because I am going to tell you the secrets of how to have a magic unicorn, hen’s teeth, Harry Potter, automate-the-lot, works every time, end-to-end automated checking solution..... Alas, no chickens, I am not, because there is no such thing. The End. Sleep well all. '
image: efiennes/assets/code2.jpg
---

### **The secret to automation**

The magic automation bullet which hits the target of coverage and usability every time - it doesn’t exist. There, now you know. You can walk away now equipped with the surest piece of knowledge in development. Shut the browser, power down your computer, remove the power cord, lock the room in which it is stored and throw the key into a large lake or an ocean. Preferably the ocean. You do not need to delve any deeper into this world of pain and woe.

### **The devil has all the best detail**

You want to know more? Some whys and wherefores? Oh well, on your head be it. I refer you to my opening paragraph though and recommend battering yourself over the head with a large hardback book as a more pleasurable pastime than continuing to read this treatise which will be full of doom, gloom and ghosts of projects past. Also contains a lot of the 'A' word. The BAD 'A' word - Automation. 

I wish there were a series of simple magic bullet automation solutions to support testing. However, there isn’t even one despite the claims of the snake oil industry of automation solutions that will tell you their tool can do the full gamut of testing from functional to non-functional and make you a cup of tea in bed in the morning. Automation can promise a lot but deliver little except an overhead when it is not planned and maintained properly. In this post I look at some of the reasons (and offer some solutions) to this state of affairs. However, I implore you reader, isn’t there something else you would rather be doing like syringing your ear wax or stacking a years worth of toe clippings to make “interesting” constructions for sharing on Instagram? Look away now, I implore you.

### **Horses for courses and tools for...**

There is a wealth of reasons people use tools to inform them about the general state of a product or system. To call these checks “testing” devalues testing and testers themselves. At best, automated checks are verifications of an expected behaviour which frees up testers to think up and execute the more exciting and rewarding exploratory testing that finds the real breakpoints in a system. An automated check may be able to tell you if a URL is inaccessible, a response is missing or a data field will not accept 150 Cyrillic characters being entered into it. What it will not do is find and identify the cause of the real complex house of cards breakpoint defects. I describe what these are below for those who have nothing more conducive to their well-being to do, like breaking concrete blocks with their heads.

### What is a house of cards defect?

A house of cards (or domino) defect is the perfect storm of circumstances coming together to create an issue. My favourite one was related to emails not being saved into a billing system. It was an expensive issue with the potential to mean that the people sending the emails were not able to automatically charge for their time working for a client. The cause of the issue was a combination of a setting in Outlook, how the billing add-in was coded / configured and the physical location of a person sending an email. It took us 3 days of analysing the users whose emails were not appearing in the billing system, researching how the thick client Outlook worked when off-line and looking at the code of the add-in to track back and identify the exact steps of the perfect storm that caused this issue. These defects were not introduced into a component or component interaction by automation, so there was no way automation was going to be able to find the little ..... darlings. These "darlings" can be the bane and the delight of a testers life. Do you know how it feels to love something that only half shows itself, morphs into a spew of related issues and then laughs at you as you try to find it? That my dears, is the lot of a tester. 

### **How and why automation goes wrong**

(With massive apologies to Elizabeth Barrett Browning)<br> 
How do I screw up thee? Let me count the ways <br> 
I wrong thee to the scope and framework and byte <Br> 
My tool cannot teach, when running out of sight

Automation goes wrong for a variety of reasons. During my first 10 years in testing, I saw the following automation fails on programmes of work without having the influence or the understanding to do anything about them. I should have run away but I couldn't take the hint. Maybe in my next reincarnation, the universe will be a bit clearer with its hints and bring me back in time for an IT apocalypse.

### •	People
Being too ambitious about how you break into automation. Starting out with an inexperienced testing team and an over-ambitious solution is a recipe for disasters aplenty. Expecting a team to learn a language, a framework and a tool with no prior experience as well as deliver day to day testing is a big ask. A better approach is to start with small consumable pieces of automation. Automating Services and Microservices as modular components are great in this context as they give testers small manageable chunks of functionality to work on without huge swathes of integrations or complex functionality to overcome. It is also a mistake to build a development team without building in the capacity to support the testers with automation too. This support could be in the form of a Software developer in test (SDET) or a dedicated developer who is learning to test. Either way, a mutual time for learning from all members on a team will reap huge benefits in team achievement and product quality.

### •	Dogma
Hiring for experience with the one tool and sticking rigidly to using that tool without examining the context in which it was being used is a path to frustration and negative impacts to delivery. Yes, Selenium is great for most webpages and UFT is .... well it is used for some thick client apps but the answer to a long term testing strategy for any environment is not to fill teams with people who are "experts" in these or similar apps. A better approach is to fill teams with people who can examine the context, the requirements, the product and use these as the driving force to pick the best automation solution. These toolsmiths are hard to find and when they are found, they are appreciated and retained. So if you want toolsmiths working for your company, you will have to hire for attitude and train for skills. (See point 1 about people)

Testers have a fascinating wealth in variety and complexity of testing tools available to them. Below is a selection of the tools used by my Scott Logic testing colleagues in the last 8 years –

<img src="{{site.baseurl}}/efiennes/assets/Tools.jpg"/>

None of my colleagues would like to be defined by the tools they have used or currently use. Nor should they be. This is a very short-sighted practice - defining testers by the tools they have used in the past. However, it seems to be more common “out there” (where the bad things live) Go and search any IT related jobs / recruitment site for the depressing stats on how many companies or recruiters are looking for a “Selenium tester” or a “Loadrunner performance tester” and lately the “Postman REST tester” Just. stop. please. Stop looking for “tool testers”, start looking and training for toolsmiths who can evaluate and recommend solutions that are going to work in the context that they are needed for. 

### •	Scope
Not understanding the context and limitations of what you should be automating. I’ve sat in meetings and explained (through teeth best described as “gritted”) that "100% end to end automated tests" were never going to happen given the circumstances of time, money, skills, solution or context for a programme of work. Nowadays, most testers I know, tend to stick to Agile programmes where everyone is more T-shaped and able to pile in on convincing the non-tech members of a programme that what they are asking is just not achievable if we want to release something to the customer in the next decade without bankrupting ourselves. 

### •	Planning
Planning for automation is a dark art but it doesn't have to be. Doing it too early (stop with the derisive laughter, it happens!) is as almost as bad as the flip side. "Quick!, rush!, define the solution!" Yeah, sure, let's define something that will potentially be out of sync with the eventual development strategy. Not enough eye-rolling in the world for that one. Doing it too late is so commonplace, it's like some teams are determined to never learn. You've done a few sprints development? Okayyyyy. With no testers? (Grrr noise) And the devs were not able to manage doing the automation themselves with the rush to get the minimum viable product (MVP) in place. (Head tilt) and now you want testers skilled in x framework, x tool, x language with expert product knowledge to start yesterday? No problem. Just let me go and retrieve my Tardis. Be right back.

### •	Solution
Selecting the wrong language/tool for the testing type. There are circumstances in which rigid adherence to the development language for the product under test has to be followed and cases where you can wrap the checks written in any language to get the same result. If you are unsure which is which and cannot find any research on the automation stack you propose to use, do your POC and write up the results for others to find. It’s good to share. Good testers find solutions, great testers share them.

### •	Standards
Not holding your automation code to the same standards as production / product code. In one not-so-funny-at-the-time example, I had a dev manager tell me how his teams tests were achieving a 100% pass rate every time. I was well impressed considering the shifting sands of the tough programme of work we were on. I went to have a look at the test automation suite to see if there were any reusable lessons there for the other feature teams. All the failing tests were basically just commented out including the one for the SLA for the service response time, a fairly basic and damned important part of the services under test. 

What followed was a conversation that could best be described as “Tense” (New York Times) “Gripping” (London Telegraph) “Direct” (Le Monde) and “No issue with differentiating between Elizabeth and a ray of sunshine that day” (Leinster Leader). Having out of sight, out of mind deployment and running of tests is not a good idea. People forget to regularly review the usefulness and complexity of the checks and focus instead on the “Passes”. You need to understand the information your automation is giving you for it to provide any meaningful feedback on your application or system.

### **Why should I be automating?**

If you have got this far, I salute you. By now, I am considering a less messy career like a slaughterer in an abattoir or a sewage pipe cleaner and I have only written the thing. “Why”, you must surely be wondering, “why would anyone bother with automation when there are so many more pleasurable pastimes out there like pushing tiny splinters into the space behind your thumbnails?”

Despite the litany of tragedy referred to above - there are good reasons to automate. 

Done right, automation takes the mundane, the repetitive, the “seen it before” and cheerfully takes care of it. Quietly, reliably and scheduleyyyyyy …… (voice octave rises to 11)

Configured right, automation plays nicely with other tools and pipelines allowing testing to run with minimum human intervention. (Don't forget those regular reviews for relevancy though!)

Used right, automation can spit out a readable report at the end which can be consumed by the non-techy people on your project who want a little bit more than your word that something was tested.

Maintained right, automation takes care of that workflow that your testers may have had to previously run 5 times in a sprint by hand. Reducing repetitiveness gives people the space and time to let their testing imaginations run free. 

Planned right, automaton can remove the need for real data in a project as you may use a solution that can create its own data as part of the checking process.

<img src="{{site.baseurl}}/efiennes/assets/Things.jpg"/>
 
Here are all the “things” that my colleagues have been able to automate over the last 8 years. All this testing that might have otherwise been a manual process are now part of an automation pack. 

Applied right, automation will free your testers from all of the above tasks and allow them to go wild with exploratory testing. You WANT and NEED your testers to go wild with exploratory testing and shake your systems until all those house-of-cards defects come tumbling out. 

The last reason for automation is that it is deeply satisfying from a tester’s point of view. Some testers love writing the automation and related checks themselves, some pair with developers to discuss scope and methods so the developer can write the code to drive the tests. Whichever method is being used, the deep satisfaction when that code runs and the results pour in, is an amazing feeling like being the kid who found the golden ticket to Willy Wonka’s Chocolate factory, the winning lottery ticket, the yellow brick road and (< snip > "ENOUGH, we get it!" - Blog reviewers.)

### **The end is in sight, rejoice**
Yes, automation is hard, frustrating and can go <i>SPECTACULARLY</i> wrong but if you take the time to understand the art of the possible, it is also fantastically rewarding. Even when it goes wrong, nothing will run, buildings are crumbling, everything is on fire, there is fighting in the streets and you swear "never again", you have still learned something that is applicable to your next project or programme. That is, if you stick at it. No-one could blame you for taking up a gentler, more beloved role in life, perhaps a female premiership referee. 
