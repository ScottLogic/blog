---
title: Is Test Driven Development Right for You?
date: 2018-08-24 00:00:00 Z
categories:
- Tech
tags:
- TDD
- Test
- Driven
- Development
author: imaxwell
layout: default_post
summary: Do you think Test Driven Development is simply writing the tests before you write the code?  If you do, then this post is for you.
---

Is Test Driven Development right for you?  That can be a hard question to answer if you don't fully understand what Test Driven Development is.  Worse still, you may think you know, but be labouring under misapprehensions.  Lets clear up some of that confusion.

## My misconception.
A year ago, if you had asked me what Test Driven Development was, I would have fallen into one of two traps.  If you too would fall into one of these traps, then it is to you that I am writing.  If you shake your head at my silliness, then you’re a clever clogs (and you’re right to shake your head, for I was being silly.)

The first interpretation of the phrase I would have used is that writing a set of Acceptance Tests that indicate when a feature is complete, then developing code to pass those tests.  Be it completely writing manual tests, or getting automated tests running, it was my belief that these tests must be specified, and the code had to pass those tests to be considered deployable.
Now while I still stand by this, it’s important to note that this is simply Agile development.  It is not in any way an application of TDD.  Any Agile team is already doing this.  

The other erroneous idea I had was that TDD meant writing a complete unit test first, and then writing the production code to pass the test.  It sounds plausible – intuitive really – that that should be the meaning, but such an interpretation makes one simple error.  It ignores the word driven.  TDD is not a passive habit – it is not simply doing the exact same thing but in a different order.  Like any driver (back seat or otherwise) TDD will cause you to make alterations to your design.  It will govern the direction you take and if you’re very lucky it will help you find more efficient routes to your destination.  

## So, what is it?
What TDD actually is, is a cycle. 

You write a very simple test that fails.  Then you write as little code as possible to make the test pass.  You then write a slightly more complex test case that fails.  Then you make it pass with as little code as possible.  And around and around you go, in this cycle that should be complete in mere minutes (if not seconds). 

![The Red>. Green cycle]({{site.baseurl}}/imaxwell/assets/RedGreenCycle.png)

This cycle is known as the Red-> Green cycle. 

To fully understand this, you have to see a demonstration.  I highly recommend learning the way I learned, and watch Uncle Bob's presentation on  [The Three Laws of TDD ](https://www.youtube.com/watch?v=qkblc5WRn-U)

However, for illustrative purposes, imagine you want to write a method to split a String into lines of exactly 30 characters (padding those that are too short, ensuring there are no words that are broken - unless you have a very long word).  That’s a few things to think of all at once.  When crafting your algorithm, you must consider the short cases, how it will work for long cases, and if you’re missing any error cases.  TDD however lets you write a test case for each of these problems, solve them one at a time, and produce an efficient solution iteratively.  The inputs you test may look like this:

    null
    “”
    “   ”
    “Singleton”
    “    Padding    ”
    “Simple short sentence”
    “Much longer more complex sentence”
    “Much       longer       more       complex       sentence        with      padding”
    “Even more contrived sentence with an excessive amount of sesquipedalian loquaciousness”
    “What happens if I watch Mary Poppins and want to have Supercalifragilisticexpialidocious in my sentence”


You see what happens – the complexity of the tests increases as does that of the production code.  Breaking the problem down into smaller, easier to deliver chunks.  Where have I heard that before?

## You must refactor!
However, there is an extremely important step between the passes and the next failure.  You must refactor your code where appropriate.  You could make any test pass with enough if statements and hard-coding, but it would be useless code.  Useful code is better. 
And when you refactor, you refactor without fear of breaking your existing functionality.  You have no fear, because your full set of tests will let you know if anything breaks.

![Red-> Green ->Refactor Cycle]({{site.baseurl}}/imaxwell/assets/RedGreenRefactorCycle.png)

This cycle is known as the Red-> Green-> Refactor cycle.  **This cycle is Test Driven Development.**

Kevlin Henney in his talk [Get Kata](https://www.youtube.com/watch?v=_M4o0ExLQCs&t=2070) warns against neglecting the refactoring stage and suggests the Plan-> Do-> Study-> Act cycle.  He emphasises the need to study your code, and make sure it is the best code it can be – this is going to production after all.  Meeting the requirements is only part of writing clean code.

![PDSA Cycle]({{site.baseurl}}/imaxwell/assets/PDSA Cycle.png)


Whatever you call your cycle, the net effect here is that the production code and the tests grow in complexity and usefulness at EXACTLY the same time.   And it is this synergy between tests and production code that defines the nature of TDD.

## So why should we do it?
**You will be fearless**

As preached above, you will never be scared to refactor your code.  If you see code you don’t like, you can refactor it, and after every small change, the tests will still pass.  The tests will look after you, while you look after the code.

**Code will be streamlined**

Because you will only ever write code that was written to pass a test, there will be no wasted motion.  You won’t waste time with superfluous loops.  You won’t pre-emptively make classes you thought you ought to.  The only code that will be written (and survive refactoring) is useful, practical and readable.

**You will reduce debugging time.**

With a suite of tests so thorough, there are fewer places for bugs to hide.  Some will slip through the cracks (especially if you choose your tests poorly), but because every line of code was put in place for a specific reason, it’s unlikely to be doing something unexpected.  

**Your tests will become the most comprehensive set of documentation imaginable.**

Documentation can be very useful when written well.  Comprehensive Javadoc can be a boon when using an API.  But all too often we see the situation where the Javadoc doesn’t cover a specific question you had.  There is also the question of if the comments have been updated every single time the method has changed and is still valid.  And, of course we all know (and saw earlier) that a demo is worth 1000 words.

Proper unit tests avoid that issue.  Anyone who has to make changes to that code has a full listing of all valid and invalid inputs.  They see the code being used as it was meant to be used and can more easily understand how they can use it.  And as a big bonus, this ‘documentation’ is ever current, otherwise the build would break!  

**Your code will have better design.**

Untestable code is a significant design smell – it indicates that something is wrong with the system.  Keeping the code testable (indeed tested) will make it easier to write clean code that adheres to the SOLID principles.  Testable code is decoupled code, and decoupled code is much easier to expand and change.

**You get to avoid that feeling**

You know the one.  When you’ve got your code working as expected, and then must begin the monotony of writing the unit tests.   In fact, doing TDD means you get the little adrenaline rush of getting code working constantly!  Integrating writing of unit tests with writing production code makes them a lot more fun, not to mention better tests.

## Drawbacks
In the interest of balance, it is here that I should discuss the drawbacks of using TDD.  I can’t dwell on them though, because I can’t think of any.  Anyone?

It certainly doesn’t double development time.  Yes, you have to design and maintain both production code and test code, but you should be doing that anyway.  TDD is just a cleaner way of producing unit tests that should be in every system.

I can imagine it being argued that it will take time to get used to TDD.  I concur with that notion, but it takes time to adapt to anything new.  A new IDE takes time.  A new coding language takes time.  A new project takes time.  But the time invested in TDD will pay for itself several times over.  The benefits lifted above are worth a relatively small outlay of time.

## Conclusion
So, when I get my teeth into my next project, I’m looking forward to embracing the TDD approach.  I don’t expect it to be easy.  Choosing the correct tests to write.  Choosing the correct order.  Inevitably getting side-tracked as fixing one test breaks 3 existing tests.  These will be challenges, but like every challenge I expect it to make me (and my code) better.  And I invite you to join me.  

I started this piece by asking a question, and I close by reiterating it.  Is Test Driven Development right for you?  To quote Mr Plinkett, I’ll let you decide - but the answer’s yes.

## Further Reading
Test Driven by Lasse Koskela

Test Driven Development: By Example by Kent Beck
