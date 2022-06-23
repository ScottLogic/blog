---
author: sgrant
layout: default_post
title: 'And Now For Something Completely Different: Creating A Social Environment Under Lockdown'
summary: 'The date is March 31st of the year 2020, and things have gone wrong. What follows is the account of a software developer confined to his home in Bristol as the people of the world come together apart, in defiance of this simultaneously macro-and-micro-scopic attack on our very species.'
categories:
    - Tech
---

## _Foreword_

_At first glance this work may appear merely the ravings of one unused to spending so long indoors; a person on the very verge of cracking. However, buried within it are a collection of useful tips on how Scott Logic has maintained the wonderful social community we're so proud of, and the journey that got us here._

_All across the company we're no strangers to getting the job done remotely - we work on client projects from our various regional offices all the time. This we can do. This is our forte. But lord knows we're a social bunch, and so whilst the shift to persistent home-working has come naturally, the shift to home-socializing has fallen right under the microscope._

## Preface

The date is March 31st of the year 2020, and _things have gone wrong._

It is believed that almost exactly 4 months ago, on [December 1st 2019, patient zero contracted COVID-19](https://www.bbc.com/future/article/20200221-coronavirus-the-harmful-hunt-for-covid-19s-patient-zero), more commonly known as The Coronavirus. Within 2 months, on [January 31st 2020 the first case is reported in the UK](https://www.standard.co.uk/news/health/coronavirus-35-cases-timeline-uk-covid19-new-a4375311.html). A further two months have since passed, and [the entire nation is on lockdown](https://www.theguardian.com/world/2020/mar/23/boris-johnson-orders-uk-lockdown-to-be-enforced-by-police).

What follows is the account of a software developer confined to his home in Bristol as the people of the world come together apart, in defiance of this simultaneously macro-and-micro-scopic attack on our very species.

# March 9th, 2020 - Government Advisory To Stay Home

## Day 1: Reality Check

Sure as sure, upon walking into work, all anyone is talking about is the same thing they were last week: Coronavirus. Some faces are missing - those who've already opted into this new-fangled self-isolation. Friday just gone we drilled working from home, and there are rumours in the air this mornin' that, for once in our comfortable Bristolian lives, this'll be a drill we put into practice. You look around, and you can feel it. There's tension in the air, all the way through until 5 o'clock.

And then it happens.

Nobody knows who heard first, but word spreads like wildfire: everyone is to gather. There's an announcement. They're gonna address the troops. And it's just as expected: "Tomorrow, unless you absolutely must, do not come into the office."

**"Do not come into the office."**

At last, as people say their socially distanced farewells, it feels as though _The Virus_ is really here.

## Day 2: Everyone's a Zealot About Something

In a scene that doubtless plays out across the whole company this morning, I wake up, and shamble zombilike to the improvised desk that will become my office for the foreseeable. We've all worked from home before, and though the development itself goes largely unhindered, things _feel_ different.

Sure we use Slack as always, shooting messages back-and-forth. #dogs is having a banner day, what with people's ready access to their pets. #politics is afire with the constant updates from around the world. But we're missing that easy conversation that comes with sitting 2 feet away from another human (yes they are humans <a name='myzealotry'>[even if they do prefer spaces to tabs](https://medium.com/@sam_holmes/why-tabs-spaces-d0421d52bf38))</a>.

But wait, what's this? "[Discord](https://discordapp.com/)"? Fine, I'll download it, but I really don't see the point when I have Slack at my- OH MY GOD THIS IS AMAZING. **And so did I learn the first important lesson of this new working paradigm: allow people to experiment; allow people to self-organise.**

Slack is great for targeted messaging ([or sometimes semi-targeted](https://lifehacker.com/how-to-navigate-office-etiquette-on-slack-1818966577#h88737)), and I still love it. And yet nothing has done as much to capture the feeling of the office as going to _The Kitchen_ in our Discord server and hanging out on voice chat with the others eating their lunch. It's just like the good old days. Oh, you'd like a private word would you? Sure, let's jump into _The Board Room_. (Alas it wasn't that promotion. Not quite yet.)

More than most, [devs and testers love to proselytize](#myzealotry). This can be a curse - "I'm not using that. It's garbage (because it's a rival to the thing I use)."; and yet it can also be an incredible blessing - "Try this thing that I love. I'm not saying replace your thing, just _try_ this thing.". Today I allowed someone's passion to drag me along, and discovered something I love.

## Day 3: Teething Problems

_Hey, this self-isolating thing isn't so isolating_, I naively thought. _I have my Slack, my Discord, my Skype, my Email.... Oooh I'll check my email_, I jovially decided. _Always something new and interesting in there_, I foolishly conceived. The me of 8 hours ago was an idiot.

Oh boy. I opened my email, and _everything is cancelled_. The message is the same almost across the social-board. Yes, a lot of these things can work with a few folks remoting in, but _everybody_? No. The big data seminars: till further notice. The .NET Study Group: nu-uh. Friday lunch explorers: I don't think so. Film club: get outta here! The only constant is chess, which continues on unabated. Maroon two of these folks on a desert island and watch them eschew food and fire until the final pawn has been carved and the first checkmate declared. Honestly, I despair.

In other news, Skype is proving unfit for purpose. [Nobody is surprised](https://www.onmsft.com/news/microsoft-announces-end-of-life-date-for-skype-for-business-online-july-2021). This was illustrated in an, otherwise handy, Bristol-office-wide check in, wherein information was disseminated, questions taken, and concerns raised. And despite all that, today's headline was **Skype + 70 developers = a bad time**.

## Day 4: Putting The "Fun" In "Functional Business Operations"

So today operation-check-in was formalised and dailyfied. It's in the calendar. **Encouraging self organisation does not preclude providing some simple structures.** This is a short meeting where everyone, including those not actively seeking-out internal news, gets caught up and is given a platform should they desire one.

And the first news, gladly received: Skype is dead; long live [Skype](https://products.office.com/en-US/microsoft-teams/group-chat-software)! (It's Teams.) Word has come down from management, and we've an official policy. Now, I've quite liked Teams for a long while - its integrations and full-featuredness makes it [perfect when you actually want to get something done](https://devblogs.microsoft.com/premier-developer/microsoft-teams-whats-in-it-for-developers/). Problem has been, to get the most from it requires a certain critical mass. Now, with this official policy, looks like we might just get that. Good stuff. I'm one happy camper.

Now, I've expressed previously that we enjoy many messaging platforms here at Scott Logic, but it has been observed that it's been becoming confusing to know exactly where to find who for what. Not everyone is on every platform all the time - it turns out that RAM is actually a finite resource, and _apparently_ Visual Studio "gets priority". Anyway, **I definitely recommend this de-facto standardization. Variety is fantastic, and has allowed people to use the right tool for the right situation, but having a default provides clarity where there might otherwise have been doubt.**

Let's see Rupert try to pull the old "but I thought the meeting was on Discord" again now!

Oooh, and the wonderful folks in our picturesque [Northern](https://www.scottlogic.com/office-newcastle/) [offices](https://www.scottlogic.com/office-edinburgh/) invited us to their respective pub-quizzes for Friday night. Kind of felt like they were trying to show us up a little with that degree of coordination tbh. They might have organised quizzes, but who pioneered the world's first #picture-of-the-day Slack channel eh?

## Day 5: From The Ashes

So. Minor tweak. The daily checkins have now been moved to occur at a different time each day. Keeping us on our toes they are. The point was made that some folks have client engagements at the same time each day, so there's no one-size-fits all moment available. By shifting it about, we ensure most people can go to most. I guess the take-away is that **continuous iteration need not only apply to development**.

The usual monthly comms meeting was supposed to transition smoothly into the regular Friday social. Utter pandemonium. I'll have to concede, I kinda dropped the ball here with my "we'll use the video from Teams and the audio from Discord idea". In hindsight, madness. Fortunately, Ronan swooped in with another new thing, this [Zoom](https://zoom.us/) software <s>which has gone more viral than.... never mind</s>. Turns out this platform can handily handle masses of devs screaming over each-other, and will give you a video wall [without the absurd restriction of just 4 videos on screen at a time](https://microsoftteams.uservoice.com/forums/555103-public/suggestions/17010055-show-video-for-all-people-in-video-meeting).

Weekend is upon us now, so this'll be it till Monday I reckon. One hates to chronicle the events of the weekend. [Nothing good ever happens on the weekend.](https://www.telegraph.co.uk/news/uknews/1545166/Weekends-really-are-wetter-than-Mondays.html)

Almost forgot. Laura ran with Harry's "Buddy System" idea. Everyone gets a different randomly assigned buddy every day, and makes 10 minutes to just see what's what. They _say_ that it ensures that nobody falls through the cracks for whatever reason - maybe they're working on a solo project with no team around them, or perhaps they're new in the office and are still finding their feet. A kind of social support network to operate alongside the formalized professional one. "No man left behind!", yaddah yaddah yaddah. In any case, the idea I think is that nobody is to be allowed any peace and quiet. Sounds dumb to me. Mark my words, everyone will hate it; everyone will want out; it'll never work.

## Day 8: Like Clockwork

The buddy system worked.

Some folks paired off. Some coordinated slightly larger gatherings of multi-pairs. Some folks enjoyed unlikely pairings and got to know people they'd not previously known quite so well. Proved especially a boon when it came to the newer faces in the office of course. The pairings were released alongside some bizarre stock questions, and fun was had either answering or ridiculing these. Inevitably - _sigh_ - much chess was played. I mean seriously, it's compulsive at this point. 

But basically, so far as I could tell, good times were had by all.

Ooooh, and big news, big news! The Edinburgh book-club reached out to our Bristol book-club. Now that we're all book-clubbing remotely anywhom, looks like [we might be pulling a McBusted. There's talk of a super-book-club.](https://www.theguardian.com/music/2013/nov/11/mcbusted-tour-2014-busted-mcfly) Turns out shackling us to our homes has actually _freed us_ from the bonds of mere geography. What a time to be alive! 

## Day 9: Now _That_ is a Nice Lamp

_At this point the journal entries deteriorate to daily rankings of the environs of our developer's coworkers, now visible through the magic of videoconferencing. You will be spared this._ 

# _Addendum_

_Wow. Well that was.... long. The pertinent points are summarised below._

### _Lessons_

- _Encourage experimentation and self-organisation. Your people's passions can yeild useful results._
- _Having a "default" communications platform eliminates confusion that might otherwise arise._
- _Clear and simple underlying structures will faciliate an effective social community._
- _Support refinement of social mechanisms that are introduced._
- _A buddy system is a good way to ensure no-one is left isolated._
- _Once geography becomes a non-factor, entirely new opportunities for socialising might actually become possible._