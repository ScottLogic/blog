---
title: I’m no longer a Tester, I’m a Checker. Or am I?
date: 2023-03-30 08:31:00 Z
categories:
- Testing
summary: A journey of self discovery to see if I'm a Tester or a Checker
author: gsmith
---


On a recent project, I had just finished running my suite of automated end-to-end tests and was pleased to see that single line of green text in the console telling me 347 of my 347 tests had all passed. Sweet. But then it hit me – I never actually tested the system for any of those 347 so called tests, what I felt I had done was simply check that this part of the system behaved as I expected it should, according to Acceptance Criteria. 

So, was I no longer a Tester?

Time to disappear down the rabbit hole(s).

## Testing

Lets start with testing. What is software testing? Many people will have their own idea of what this actually is, but a recurring word in just about all the definitions I’ve seen is ‘process’. Product/software/system also come up quite a lot. To my mind, I believe the Testing process is about the product, where I’m defining the product as being everything to do with the project that is building this entity and not simply the tangible item that is promoted to production at the end.

Everything? Yes. That includes any written artefacts related to this product; this is where I could diverge and go off on a tangent about involving Testers right at the start. Another time for that maybe. Static Testing refers to exactly this - reviewing any early documentation; where a Testers eye can help spot issues or potential issues very early in the project lifecycle – fix it now, cheap as chips.

Requirements or Acceptance Criteria is another area where Testers bring huge value; breaking these down into the various tests that could be incorporated to ensure the product is what the client/customer actually wants. Perhaps even calling out if these are in fact testable. As we become more experienced as Testers, this becomes second nature, easier to accomplish.

Our Developers have pushed their finished code and its ready for me to cast my eye over it. What do I do now? Generally, I will have a play around with the deliverable; randomly on an ad-hoc basis; with more structure in Exploratory Testing.
OK – I can see a bit of a theme developing here. 

All of these require me to have the ability to apply knowledge, experience, understanding, common sense and insight. I believe I have this ability. So I’m a Tester.

## Checking

Well what is Checking? When I’m talking about Checking here, I’m referring to its use in automated tests suites. Checking is about making an evaluation on observations of the product/application under test. 

I think this requires 3 separate elements. Firstly, the item being tested needs to be observed; secondly, some form of decision rule needs to be applied to this item and finally an output has to be achieved. So if we are writing code to ensure that an input field on an online form, for example, is correctly labelled, we would find this label on the page, we would establish its value and then compare it against what we expect it to be - giving us that binary result.

Going back to my recent project there were 347 different instances of this example. As I had not yet pushed up my working branch, I simply initiated the execution of these by pressing a couple of buttons on my keyboard. Once my branch was merged and part of the finished product, my suite would be initiated automatically, no interaction from me nor anyone else.

Hang on then. The running and execution of my suite therefore does not require the sapience I mentioned above in order to show the system behaves as expected. Mmmm, maybe I’m a Checker.

## Test vs Check

Surely though it cant be that straightforward, can it? Well, I don’t believe it is.
Lets go a bit deeper. When the suite of automated ‘checks’ gets run and if they all pass, a report will be generated and filed away somewhere. This is all done as part of a build and deploy process, automatically. The green tick means, most likely, no further thought will be given to this. Now we’re back to Checkers.

But. What if there was one or more red crosses in that report and maybe the build/deployment failed because of it? What happens is that the report will be analysed, each point of failure found and steps taken to address it – cerebral challenges. A Tester.

## What am I then?

Where am I now that I’ve exited the rabbit holes? 
I have realised that our Developers do not actually write Unit Tests, they write Unit Checks. 

If I am writing a suite of automated Acceptance Tests, they should really be termed Acceptance Checks.

Although the output of my code writing may well be a suite of Checks, in order to get to that point I have had to apply all of those sapient attributes previously discussed; with the analysis of the Acceptance Criteria - to determine the checks needed to verify the system acts according to those criteria through to applying the knowledge and skills learnt to determine the best tool to use, the best coding language to select etc. Lets not forget the ability to troubleshoot issues encountered during the writing and testing of the checks.

**Am I a Tester? Yes - but I also have the ability to create Checks.**
