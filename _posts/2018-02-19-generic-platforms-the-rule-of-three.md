---
title: Generic Platforms - The Rule of Three
date: 2018-02-19 00:00:00 Z
categories:
- tclarke-scottlogic
- Tech
author: tclarke-scottlogic
layout: default_post
summary: When is it time to make something a generic re-usable class? And how do you
  manage the additional complexity of a generic solution? A potential solution lies
  in an incremental approach.
---

In this post, I'm going to consider how you end up with unnecessarily complex systems, and how to avoid them. Let's consider the two most common examples of this issue.

#### Premature Genericisation

Somewhere in your product ecosystem, there exists the `DiscussionDocumentationSynthesiserManager` class.

This class is a wonder of generic behaviour. It can take a flexible custom template designed by skilled UX artisans. It loads a dozen configuration files to allow complete customisation of its data processing flow. It uses dynamic types, reflection and generic templates to allow any form of input.

Maintaining this beast is a nightmare. Just trying to adjust the height of a table requires your interns to learn a company-specific Turing-complete templating language. When the report it produces goes wrong, it takes three Senior Devs two days to locate the problem, then they have to change 30 files before the fixed code will compile. Its informal name is "The Devil Engine". Once someone renamed the actual application that as a joke, and it took three Senior Devs two days to fix the ensuing problems.

And this massive, complex, infinitely customisable class is used... once. For one thing, to create a single Daily Report. It could have been written in one tenth the time, with none of the Factories or ConfiguPlexes or Generic Template Types, just by passing today's table of input data. But because it's only used for that one thing, it's never possible to get the dev time to actually *replace* the infernal thing.

Also, maybe one day a second report will turn up? (Reality Note: A second report will never turn up, and if it did, no-one in their right mind would think "This looks like a job for the Devil Engine")

#### Postmature Genericisation

Meanwhile, you also have the `DogCatMonkeyCowFishChickenHorseOtherReport` class. This began innocuously as a `DogHealthReport` class for reporting the health of dogs. Then someone decided that they wanted it to handle Mr Tiddles the cat. Years later, via a sequence of horrific if-statements and edge-cases, this class handles far, far more reports than the original design intended, and if you want an enhancement or a bug occurs, you have to spray debug logging through a ten thousand line function to find which area is responsible for Dogs, and whether it is also responsible for Monkeys.

Everyone discusses refactoring the class, but somehow, whenever it comes time to add another animal type to the list, the sheer complexity of covering the existing cases (as well as the lack of tests for the early animals) means it's easier to add YAGDIS (Yet Another Gosh Darn If Statement) to the existing chimeric mass. Of course, that makes the problem worse, but when the house is already on fire, nobody really cares that you're smoking indoors.

> #### Yep, This Sounds Familiar

Every experienced developer knows of these two cases. The C++ template function that only actually ever takes ints. The class that is really just a collection of giant switch statements. That bit of the code that people go out of their way not to touch.

The solution to the problems above are generally to get your act together and actually do the redesign everyone's been putting off.

But what you *want* to do is to avoid getting into this problem in the first place. Because no-one meant to cause their future selves and the heirs to their codebase this problem. It just sort of happened.

So the question you need to be asking is:

> #### When Should I Genericise My Code?

My answer is what I've come to call **The Rule of Three**.

### The Rule of Three

The core principle of the Rule of Three is that you should limit genericisation until you have enough information to do it properly, and until the complexity of maintaining separate solutions is high enough. Let's demonstrate with a simple example.

#### Pass One

![Wuff]({{ site.baseurl }}/tclarke-scottlogic/assets/doge.jpg)

You have been asked to do a `DogReport` class that produces individual reports about dogs. You suspect it will one day be extended to cover other animals or different types of reports, and your instinct is to try and make it able to handle them now.

Resist. That. Urge.

> But I have a...

*NO*. RESIST IT. That is the siren song of the `DiscussionDocumentationSynthesiserManager`, and is going to make life hell for future maintainers. Repeat after me.

> "I have one input, and I do not need to handle a second one yet."

At this point, you simply do not have enough information to work out which bits will be useful to genericise. And genericisation takes work. Maybe a trivial amount of work, but work nonetheless. It also introduces complexity to a system that doesn't currently require that complexity to work.

What you should do instead is spend the time you would have spent genericising **getting reliable test coverage around that simple case**. Instead of making the code easily extensible, make the tests easily extensible. That way, when you come down the line to make the genericisation you want to do, you will not perform that shameful ritual beloved of all programmers, skipping the tests because you want to just get the change deployed.

Beyond that, remember that *developing generic reporting tools is not your job*.

Your product owner/client/user asked for `DogReport`s for a reason. They want them as soon as they can, if only so they can check if they meet their needs and give feedback. And remember that your stakeholders do not benefit from genericisation until they ask for a change. So the value to them will come only when and if they ask for that change. So that's when you should genericise.

#### Pass Two

![Mew]({{ site.baseurl }}/tclarke-scottlogic/assets/kitteh.jpg)

A Wild Tiddles has appeared! Your client now wants you to cover a second input type, with a very similar report (except now you have to cope with whiskers, litter boxes and hairballs as well).

Ah-hah! Now 'tis time to genericify your class? Time to bring in the `AnimalFactories` and `PetComponents` and `CatInjectors`?

No.

This is where you give `DogReport` a base interface, *and then copy the `DogReport` and rename the copy to a `CatReport`*. Then make the calling code use the generic "`PetReport`" interface.

> Wait, copy?

I know, I know, "*Shocked GASP!* Copy-pasting? You *monster*."

Well, if you like, you can open the `DogReport` in a different window, create a `CatReport`, and rewrite the class line by line, but most of those lines are likely to be identical. Just pull the trigger and paste the copy.

The reason for this is simple. You have no clear idea at this point whether your `CatReport` is going to remain similar to your `DogReport` or diverge significantly over time. No-one's realised that that section on regular walks is going to be a thing, for example.

Nor do you know how quickly it will diverge. These changes could happen over months, as Cat owners get more and more demanding. Or it could turn out Cat owners are pretty laid back, and as long as the report arrives regularly, they'll barely respond.

Divergence can also have an effect on your tests. If you write tests that have to cover both cases, and then there is significant divergence, those tests are likely to become more flakey. In the worst case, you may have to completely rewrite the tests while changing the code, which somewhat defeats the point of having the tests.

Also importantly, when you're rewriting your `DogReport` to act as a PetReport, consider that your Dog users didn't ask for these changes. Even if you have tests, you are still imposing your Cat changes on the `DogReport` class. Those tests will also be written with `DogReport` in mind, and thus will need to be rewritten as part of that. This imposes risk on a fundamentally stable system. Is it worth it just for Tiddles?

Well, Tiddles may still be a one-off. Possibly you will only ever have `DogReport`s and `CatReport`s and your Pet's Home will never accept a single Monkey. Possibly there won't be that many `CatReport`s.

So minimise your changes to existing code, and focus on the new input type exclusively for this pass.

#### Pass Two-And-A-Bit

![Dogs and Cats living together]({{ site.baseurl }}/tclarke-scottlogic/assets/dogcat.jpg "AKA Dogs and Cats living together!")

Now you have two separate classes, you will start to be able to gather and encode knowledge about their shared behaviour as enhancements start to roll in.

This will often mean you have to change both the `DogReport` and the `CatReport` classes. Often you will get these mid-development of the `CatReport` class. For example, a Cat owner will request the change, and you will find the Cat owners who also own Dogs will want their Dog reports to have the same cool features.

Every time you make the same change in two places, that suggests you should extract the behaviour to a shared component. So this is where you begin the process of genericisation, but *on-demand* as you make changes, not as part of a great design project.

This has several advantages. For one thing, it keeps the changes limited in scope. Unless you've gone truly pathological with your initial design, changing one aspect of the `PetReport`  should have minimal impact on most of the rest of it. That means that, as you extract the behaviour, you get to focus your regression testing (e.g. checking you haven't broken the thing) on one small area of both reports, rather than the complete retest that would be required if you were doing a full rewrite to a generic system.

For another, it is an established truism of life that if someone asks you to change something once, they are more likely to ask you to change the same thing again than they are to ask you to change a different thing. One "common code extraction" based on an actual change request can cover eight or nine further change requests, where one that isn't based on an actual user request may wind up never really adding value beyond a certain "clean code" satisfaction, because that common code never changes. Which again, is of no value at all to your stakeholders.

Worse, you may extract certain common code chunks, then find that future changes require lots of interaction between those chunks for Cats but not for Dogs. By guessing badly at where that interaction will exist, you now have to re-refactor the code to pull those chunks back together just for the kittys, which can become very complex indeed.

What this also means is that you can start to lean on your existing unit tests to assess the effect of the refactoring changes. This confirms that your unit tests are well-written enough to support refactoring to a truly generic system, and allows you to introduce more/better tests for any problems you introduce during your refactor.

Obviously, the disadvantage of doing ad-hoc common code extraction is that you're still stuck up with two very similar classes that could probably share more common code than they do. Which brings us to Pass Three.

#### Pass Three

![Ook]({{ site.baseurl }}/tclarke-scottlogic/assets/monkeh.jpg)

Okay, Banana Joe has turned up. *Now* is the time to look into proper generic design.

You should now have an idea of which behaviours `CatReport`s and `DogReport`s share. Because of Pass "2A", you should have some simple classes that capture the kind of shared behaviour that is more likely to change in the future.

Just as importantly, you now have three different types of input to compare and contrast with each other. This is where you find out that some animals have fingers, which you didn't account for with Dogs and Cats. Or that climbing trees no longer needs to be associated with difficult behaviour. [Or that not every animal has a name](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/).

Also, because the system has been merrily producing Dog and Cat reports you should now have a good idea of the kind of day-to-day enhancements that people ask for (e.g. bulk reports, summaries, etc). Your "properly generic" system can be designed to optimise for those features. Plus, you are probably more likely to get a decent amount of budget and eyes on the end product, because you have a userbase who value their `PetReport`s. Good genericisation *always* takes longer than people expect, so you want the payoff to be worth it.

It is also easier to justify genericisation at this stage as a business case. Because this has come up three times, you can be more confident that people will want similar reports for Bessie the Cow and Miss Cluckington. The pain you felt of extracting shared behaviour when you have only two common classes currently in existence is trivially manageable, and you can lay out the work that will need doing. Once you've got five, ten or thirty-seven different inputs? I think the living would envy the dead (or at least the retired).

## Conclusion

Obviously, you probably aren't working in a Farmyard. But no matter whether your input types are Financial Institutions, Language Locales, or Video Game Enemies, applying this principle can save you a great deal of pain.

So let's review, without the "hilarious" veterinary examples:

> ##### Input Type 1 - Just build it, don't genericise at all. Solve the problem in front of you.

> ##### Input Type 2 - Duplicate the original, redesign for your new input type, and then extract common behaviour as you change that behaviour.

> ##### Input Type 3 - Now is the time to examine the lessons from the first two passes, and design a generic platform from them that will make it easy to add your third type.

It doesn't matter if the gaps between Input Example 1 and Input Example 3 are six days or six years. Even if they are within the same *release* and the application is required to be generic, it is often worth getting your initial non-generic system in front of users, so you can respond to their initial feedback as quickly as possible.

And finally, whether you take this advice or not, when dealing with multiple input types and generic platforms, please, please, *PLEASE* make sure you have **full automated test coverage of all input and output types**. Tony the Intern isn't going to realise that he's broken the `DogReport` when working on the `MonkeyReport` until your Dog Owners start howling. Knowing when he's broken something makes it easier to make the changes you want.

Don't let him get torn apart without warning. They'll turn on you next.
