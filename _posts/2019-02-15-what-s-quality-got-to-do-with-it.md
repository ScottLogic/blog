---
title: What's quality got to do with IT?
date: 2019-02-15 00:00:00 Z
categories:
- Testing
tags:
- testing,
- quality,
- delivery,
- SDLC,
- coaching,
- mentoring,
- featured
author: efiennes
layout: default_post
image: efiennes/assets/Stop.png
summary: What is quality? Is it "just" testing? If not, then what else? How do you
  measure it? Should you even try? What does it really mean if you have 1 person or
  a team looking after the quality?  After being told the quality was my new role,
  I did some research to find out the answers to these questions and more.
---

This is the full version of my talk for our Edinburgh office [tech talks](https://www.eventbrite.co.uk/e/an-evening-of-tech-talks-at-scott-logic-tickets-51818533629#) last year. This is the platform that our company offers to all staff to speak about what they do and how they do it. If you want to join a company that will encourage you in your public speaking ambitions, come and [talk to us](https://www.scottlogic.com/careers/).


I was also offered the chance to do the talk at the wonderful [Agile roundabout](https://www.meetup.com/The-QE-Roundabout/events/255548308/) last November. If you are a London based member of a delivery team, do yourself a favour and sign up to this amazing group for the opportunity to hear some amazing talks. If you fancy dipping your toes into the world of public speaking, the organisers are really welcoming - reach out to [them](https://twitter.com/agileroundabout).


![Intro1.png]({{site.baseurl}}/efiennes/assets/Intro1.png)

Hands up - my first "quality" role was a painful and funny process. The organisation I was a part of made the decision to off-shore all our testing. The team that had been responsible for testing was now responsible for "the quality". Whatever that was. In all the rush to off-shore and redefine roles, someone forgot to actually specify what shape this being responsible for quality actually took.


"You!, you did the testing, testing is a part of quality, you now own the quality" was the outcome of a conversation with my manager. If he knew what this quality thing was, he was hiding it like a champion. 



![QA2.png]({{site.baseurl}}/efiennes/assets/QA2.png)

So we got in a "Quality Specialist" who wrote reams and reams of documentation. To me, on the outside, with my nose pressed to the window, this new world of quality was the responsibility of one team, very process heavy and seemed to involve the destruction of entire rainforests while still remaining curiously devoid of actionable detail. I mean, what was I actually supposed to do in order "to do" the quality?

Somehow, a decade in testing had prepared me for this new unspecified role that I had no experience of, so that was all right then. (Cue the internal screaming noises). 

My first date with quality was not destined to be a success. Never mind swiping right, I would have turned off the phone and thrown it in the sea if I had seen what the future had in store!

![BVs.jpg]({{site.baseurl}}/efiennes/assets/BVs.jpg)

I read those quality tomes in which everything was documented to the nth degree in yawn-inducing detail about best practices and related industry certifications. The process flowcharts I inherited had subflowcharts with subflowcharts! As they were based on point in time information and set on the precedent of current projects, most of these intricate processes were out of date as soon as they were written.



![What3.png]({{site.baseurl}}/efiennes/assets/What3.png)

I decided to do some research of my own on what this quality thing was. The good thing about this exercise was that I realised I was not alone. A lot of people were talking about the quality dynamic / mindset / practices in delivery teams and how that should be defined. This was resulting in a lot of debate but not many conclusions.

It was an odd sort of comfort that I was not the only one confused as to what this esoteric thing called quality actually was in actionable terms. On the other hand, I am the sort of person that likes to roll my sleeves up and DO STUFF so not being able to understand what to do was also annoying. On blogs, in books, in whitepapers I found arguments that quality were all of the things in my slide above and yet curiously, none of these things in their entirety.



![Where4.png]({{site.baseurl}}/efiennes/assets/Where4.png)

A lot of the conversations that were going on were centered around what quality was NOT. (Quality is not testing, quality is not requirements, quality is not design, quality is not agile... yadda yadda) That was great but I wanted to know what it actually WAS. So I decided to do some research on the history of quality to see if the past could give me some clues about what quality should be.

Maybe looking at the history of systems / software QA would help me understand it.
The earliest examples of thinking about quality came from a 1931 book called "Economic control of quality of manufactured product" by [Walter Shewhart](http://www-groups.dcs.st-and.ac.uk/history/Biographies/Shewhart.html). In it, he talks about the justification and value of quality controls in factory environments. This was good but it related to a physical activity which might mean a lack of crossover lessons about product quality. I was also uncomfortable about the idea of quality as a form of control although I could see the immense benefit of that to manufacturing.

In his 1950 paper ‘On Checking a Large Routine’ -  [Alan Turing](https://www.bl.uk/people/alan-turing) proposed how to check a routine to make sure that it is fit for purpose. This was more like it. Turing did not just stop there, he also forecast the progress of modern software development with his prediction that "a programming language
(will go on to form) a sort of symbolic logic". So now I have 2 criteria for quality - checking and future-facing. I liked the idea of a check rather than a control. It leaves more room for innovation rather than just adhering to a prescribed control of gate.

Turing was a genius. It is a pity that the state could not see his intrinsic value as a human being and went down a path of prosecuting him rather than encouraging and funding him. It is a ridiculous, time-wasting madness on the part of any country to persecute people for the way they are born. There are so many other good things more worthy of time and energy. 

So far, so concentrating on the product but all that was about to change with the 1951 publication of 'Total Quality Control' by [Armand Feigenbaum](http://www.feigenbaumfoundation.org/about/dr-armand-v-feigenbaum/). A volume that defines quality as a customer outcome. 
The only measure of quality worth taking was a satisfied customer and the responsibility for this sits with everyone in a company. Now THIS felt like something that could be actionable.

In 1961, [Gerald Weinberg](https://www.i-programmer.info/news/82-heritage/12048-gerald-weinberg-a-seminal-influence-on-programming.html) would publish "[Computer Programming Fundamentals](https://www.amazon.co.uk/Computer-Programming-Fundamentals-Herbert-Leeds/dp/0070369941)". For anyone still wondering about the role of testing as part of delivering quality, that book contained a chapter on software testing. 

> “Testing should prove the adaptability of a program instead of its ability to process information”. 

There you go, an unbreakable definition of testing. It's nothing to do with QA or assurance, it's to ensure adaptability. We have slightly expanded that remit nowadays in modern testing to include the idea of providing information as part of our roles as testers but Weinberg's definition still stands strong in supporting this view.



![Who5.png]({{site.baseurl}}/efiennes/assets/Who5.png)

I could not talk about quality without bringing [Margaret Hamilton](https://www.computerhistory.org/fellowawards/hall/margaret-hamilton/) into the conversation. For her self-testing code, she gets a dedicated slide and lots of hearts all to herself.

Hamilton is an innovator in systems design and software development, enterprise scaling, process modelling, development paradigms, formal systems modelling languages, system-oriented objects, automated environments, software reliability, software reuse, domain analysis, correctness by built-in language properties, open architecture techniques for robust systems, seamless integration, error detection and recovery, man-machine interface systems, operating systems, end-to-end testing and life-cycle management. 

All this done well is quality which makes Hamilton the living, breathing, walking, talking definition of quality!



![Decade6.png]({{site.baseurl}}/efiennes/assets/Decade6.png)

I had a bit of a think about how I had seen quality talked about and practiced over the last 20 years and decided that I really had never seen it done properly in waterfall. Too much of a reliance on static artefacts and standards not always applicable to the context in which they were applied. It was an old clunky practice associated with process heavy CMMi, TMMi, ISO, ISEB (ISTQB) and whole other lists of acronyms.

Newer engaged agile was nothing to write home about regarding quality practices either.  Worryingly, the [agile manifesto](https://agilemanifesto.org/) did not even mention quality as one of its core tenants. 

It is hard to relate quality to modern lean agile ways of thinking around solution delivery. Some modern practices in delivery can also leave gaps that causes pain and delays for teams that want to deliver at speed. These are called quality anti-patterns.



![ANTIPA.png]({{site.baseurl}}/efiennes/assets/ANTIPA.png)

Quality anti-patterns are the short-term things that are done to aid delivery but through accident or intention actually become barriers to medium or long term delivery.

I am not going to call all of them out in detail but I will talk about the ones that can do real lasting damage to your team, product and reputation.

Only hiring experienced agilists into your teams is a quality risk as you may limit the perspectives and the experience that a diverse team can bring to your product. As an extreme example - it's great if everyone is thinking lean and clean code but what if the lack of comments and sparsity of information mean that it takes any new joiners months to understand your tech pipeline therefore accidentally expanding the time to when they can start to be truly productive. 

There were 17 signatories to the agile MANifesto and none of them thought to include quality in their considerations. Maybe it's time for a WOMANifesto, one that considers quality as part of the delivery process.

Just because something is agile does not make it good. Standups as a way to exchange information and details of blockers in a quick efficient fashion between an engaged team is great. Let me tell you about what is not great - half the team not listening as *that* team member treats the forum as an outlet for their ranting / complaining / waffle. This makes your ceremony just another rebranded format of the tedious round table meetings of yore.



![That6.png]({{site.baseurl}}/efiennes/assets/That6.png)

With all this research, I now had to decide on what quality was based on my understanding of the work of the trailblazers and my own 2 decades in delivery. This was the conclusion I came to. It's verbose but I am ok with that.

	Quality is the right features or programs...

		being delivered in the right way at the right time...

			by a content team who understand their user base...

				confident they are doing the right activity at any given point...

					As a bonus, it should be inheritable and repeatable.
                
This is taking the stance that quality is something agile, waterfall and mixed delivery teams can introduce and encourage. Therefore it is a dynamic and a mindset.

Yes a content team is a measure of your quality. A team that is not content generally have things not to be content about. These are the things that the whole company should be worried about because they are quality (or lack of) indicators.

![Thethings7.png]({{site.baseurl}}/efiennes/assets/Thethings7.png)

Technology and delivery have changed a lot since the days of Turning and Hamilton. We now have more _stuff_ to consider than those pioneers ever envisaged. More home devices connected to the internet, a more diverse set of users and more local and geological considerations to take into account.

We now have to think about our software in terms of the demographics of our users, the devices they will be using, the quality of the internet they have, how they get their internet. 

Google have been very transparent that their next 1 billion users will probably be on 2nd or 3rd hand devices on PAYG internet in developing countries. They cannot develop for a London user on fast home internet and a customer in a developing country on a 3G phone in the same way. We cannot test for these users in the same way either. 

Considering quality as part of your delivery process means a consideration of every part of the software development lifecycle and the consumers of your products too. This means considering everything from the design of the solution on paper to the feedback from the customer and everything inbetween.



![TheGirls8.png]({{site.baseurl}}/efiennes/assets/TheGirls8.png)

I hope I have managed to give you the message that quality is about so much more than development, testing and business analysis - it is the sum of all the parts of the team INCLUDING the team. Here are some quality trailblazers who set the world on fire with their forward thinking attitude to their products and their teams.

[Annie Easley](https://massivesci.com/articles/annie-easley-facts-stem-mathematician-nasa-scientist-discrimination/) - an actual freaking rocket scientist. Qualified to say "actually it's not rocket science" and know what she was talking about. Her research on battery life and how to manage it programmatically is the foundation for electric car engine power management today. Not bad for a women who once had to pass a literacy test in order to vote. So future facing, she was writing the future rather than speculating on it. 

Could you imagine going to work one day and being told you had to sit at "that table" while the proper engineers got to sit at the engineers table. Even though you did the same job to the same level of quality. The only justification for you not having a place at THE table was a characteristic you were born with. Imagine knowing that you were working with the smartest people in the land and they still insisted that it was ok to treat you like this? How would that make you feel? Like fleeing or fighting? 

[Miriam Mann](https://www.newscientist.com/article/2118526-when-computers-were-human-the-black-women-behind-nasas-success/) decided to fight. Every day she came to work and removed the “Colored Computers” sign that relegated the black women of the Nasa West Computing to a lone rear table away from the "proper" engineers. Making members of your team feel like shit because of who they are is not ok. That's a bad thing. If you do bad things, there will be more bad things. Don't do them. 



![Badsolution9.png]({{site.baseurl}}/efiennes/assets/Badsolution9.png)

Ok, now we have an idea of what quality is and what the anti-patterns are, we need to talk about who does the quality (and how). Traditionally there have been 2 approaches to quality ownership: single and distributed ownership.

In older fashioned dev teams and larger enterprise environments, quality ownership is left to  one person – the "QA manager”. This person is typically reactive, running around like a Tasmanian devil. The Jack/ie of all trades, master of none. The octopus with tentacles in everything who has not got the time or the depth of understanding to drive change at the right level. It's no accident that they like tracking and metrics. However, the production of those metrics are of no benefit to anyone in the delivery teams and dare I say it... only serve as a justification of the role of the QA manager. (Yep, I dared)



![BadSolution10.png]({{site.baseurl}}/efiennes/assets/BadSolution10.png)

The other side of quality is leaving it to the team on the basis that we are all cross-functional now. Assuming quality will just happen is like assuming that development “will just happen” if your t-shaped skills are BA, Tester and Scrum master.

The challenge with the idea of a team taking care of quality is that there is no concept of quality being baked into the role of anyone or everyone. It is “assumed” that if everyone is t-shaped, this just makes the quality happen.

This is not a Harry Potter novel, quality is not magic, it doesn't "just happen" because you throw some of its characteristics into a cauldron. It has to be less abstract and more deliberate than that. It's time to talk about solutions.



![Solution11.png]({{site.baseurl}}/efiennes/assets/Solution11.png)

Burgeoning agile teams parachute in Scrum masters to teach teams how to hone their practices and train up other Scrum Masters in their wake. There is a similar role needed for the encouraging quality too. 

This would involve extensive coaching of a team in quality dynamics and practices. The coach would then leave behind a leader of the quality dynamic who is reactively supported day to day and proactively looking to the future every week, month and year.

The quality coach has to be someone unafraid to gather lots and lots of feedback about quality from those within the delivery teams, those integrating with them and the recipients of their work. It's not a role for the faint of heart. It requires great people skills and the ability (or willingness) to understand what is going on at every level of the software delivery cycle.


![Outcomes12.png]({{site.baseurl}}/efiennes/assets/Outcomes12.png)

This means that QA as is thought of as a practice, a dynamic AND a mindset that is bought into by everyone on a delivery team.
 
The quality role will become a pre-emptive training / influencing / mentoring role rather than a reactive “too slow", "too many bugs", "too many environment outages", "too little unit testing", "too many unclear requirements”... role.


![Solution12.png]({{site.baseurl}}/efiennes/assets/Solution12.png)

As a result of this mindshift, all members in delivery teams add a new dimension to their focus. This means shifting from being t-shaped to being star shaped with a quality focus making up the new facet of team focus and perspective.

I like the idea of being star-shaped. It makes life more interesting.
