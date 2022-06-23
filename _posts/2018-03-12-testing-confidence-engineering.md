---
title: 'Testing: Confidence Engineering'
date: 2018-03-12 00:00:00 Z
categories:
- tclarke-scottlogic
- Testing
author: tclarke-scottlogic
layout: default_post
summary: Why do we write tests? When should we write tests? Which tests is it alright
  to skip? And have that angry mob of TDD developers actually achieved 100% test coverage?
---

This is, without question, the worst possible conversation a developer could have with a project sponsor near a deadline.

> **You:** "This application is ready for release and fulfils all the requirements."
>
> **Them:** "Prove it."
>
> **You:** "...Um."

In one second, you have undermined your credibility more than if you'd said "It won't be ready for two months". You have *incentivised* both your Project Sponsor and the Testing Team to go back and look at your application and every defect will be proof that they can't trust your promises.

Contrast:

> "This application is ready for release and fulfils all the requirements."
>
> "Prove it."
>
> "Okay, we've covered all the potential failures we've discussed in the meetings under automated tests, and thrown a thousand requests at it to prove it responds properly under load."

Now you've given them confidence that you've done the work. And you've given them a call to action. If they want to add some more failure conditions, you can add them to the automated tests. If they find a problem, they've helped because they have found a missing test.

Just as importantly, you yourself have confidence in your system. You might be worried about other areas, but you can be confident that the problems you have thought of have not quietly started failing while you are working on something else.

**This is the true value of tests; that they are designed to increase your confidence about your system.**

They do so in various ways:

### Regression Detection

The most obvious way in which repeatable tests, whether automated or manual, provide value. If you run the same process as before and get different results, you can be confident something has changed since the last time you ran that process (if you *can't* be confident in that, that test is worthless).

If the previous results were better, you know that a mistake has been made. Occasionally, you find that the change has actually improved the output (for example, an algorithm change produces results that more accurately follow a desired target), in which case, you have increased your confidence that that change was good.

Note however, that this makes an important point about tests:

**If your tests are failing even though the system still produces the expected behaviour, then they do not improve your confidence in the system, they undermine your confidence in the tests.**

It is *amazing* how many automated tests developers have written over the last 10 years which do not come close to respecting this simple principle.

I have spent what seems like days of my life, days that could have been spent with my wife and children, unpicking what a failing unit test was trying to do, and eventually realising that it was effectively only meant to *test that the current lines of code existed*. Literally any change to the existing code would cause the test to fail, even if the *final output was the same*.

These days, unless a failing test suggests what meaningful failure it was supposed to be capturing, I just delete that test and move on. Life is short. The joy of source control means that if you eventually discover that there *was* a meaningful failure that this test was trying to highlight, you can restore the test. And because you now know, you can **and should** encode that information into the test.

Think of a failing test like a warning sign lying on the ground. If what is on the sign doesn't give enough context about where it was supposed to be, why it was supposed to be there, and what you need to do if you find it on the ground, the only thing you can actually do is put the sign somewhere safe until you have more information, and eventually, if nothing starts to smoke, assume it was redundant and throw it away.

This allows for a simple principle:

**If a failing automated test does not make it clear what that failure will mean for the system's user, then that test is expendable**

By corollary:

**If your automated tests are not intended to be expendable, they need to present a clear "Call To Action" to the person responsible for handling their failure**

### Communication Through Testing

One issue unit tests often expose is the differences in confidence between colleagues. Developers who are confident that their code is correct do not see the value of tests. And no amount of writing unit tests will give confidence to developers who are not confident about the problem they need to solve.

These differences can cause friction, but they actually demonstrate how the developers view the system.

It is thus important, as [this excellent article](https://dev.to/danlebrero/the-tragedy-of-100-code-coverage) by Dan Lebrero shows, not to get too dogmatic about tests.

> "The code is obvious. There are no conditionals, no loops, no transformations, nothing. The code is just a little bit of plain old glue code."
>
> "But without a test, anybody can come, make a change and break the code!"
>
> "Look, if that imaginary evil/clueless developer comes and breaks that simple code, what do you think he will do if a related unit test breaks? He will just delete it."

It is possible, if you are as confident in your design as Dave Thomas, to [avoid testing altogether](https://youtu.be/a-BOSpxYJ9M?t=18m48s). Note however, that with respect to Dave Thomas, Isaac Asimov's famous dictum may apply:

> Yes, I know Bob Heinlein did it, but he was Bob Heinlein. You are only you.

This is especially true when working as part of a team. While *you* may be confident in your design, a lack of regression tests generally makes it harder for others to be confident about their changes to your code.

Note also what Dave Thomas says; when he is dealing with a complex area he's not **confident** in, *then he writes a test*.

Again, it is one of the job of a [good test team](https://www.scottlogic.com/what-we-do/software-testing/) to be suspicious about overly confident developers. As one tester described it to me; "if the developer tells me he's completely confident about something, I want to go back and test that part of the system more."

### Unexpected Benefits of Testing

One of my earliest lessons in the value of tests was when I was working on a (nominally) multi-threaded system. I'd encountered an infuriatingly annoying [Heisenbug](https://en.wikipedia.org/wiki/Heisenbug) that only appeared on production. It was clearly a threading error, but it was impossible to get it to happen without 100 users.

What I ended up doing was finding an obsolete test framework from the early days of the project that allowed generation of fake data, rewriting it to cope with the new system, and turning three instances up to eleven on the dev environment. BOOM. Threading issue reliably replicated.

But a side effect of this was, when the business manager asked "How can we be sure the new system will handle the load?", my lead dev replied that I'd run about 20 times the expected load against it, at a frequency that the users would never be able to match.

Note that this isn't remotely why I'd run those tests. I'd been focused entirely on my bug. Load-testing the system was just a side-effect. But the point is that it increased the confidence of the project manager that the system would not simply keel over when exposed to the real world.

Similarly, BDD testing that is written in a way that normal sane people (i.e. not software developers) can understand gives the project manager confidence that there is an understood "correct" way to interact with the system, and watching an automated demonstration of the system via a system like Ranorex gives them confidence that you haven't broken it.

Indeed, one way to ensure constant confidence in your system is to put up a great big screen on the wall with a script repeatedly running your core workflow. If a push breaks *that*, you can basically stop doing whatever you're doing till that's fixed, because that code ain't goin' out the door.

## Skipping Tests

In every project, some tests get skipped. You may now head to the comments to explain that all your projects have complete branch coverage, your UI is fully tested, and you only use libraries that have the same testing rigour. Then start reading again from the line below.

---

You're back? I look forward to reading your comments.

Now, let's ["pretend" that you're an "anomaly"](https://www.google.co.uk/search?q=liar+gif&tbm=isch). The question then becomes not "should we skip a test?" (to which the answer should always be no) but "how do we know when which tests to prioritise?"

The following two reasons are common reasons for skipping testing, but come with serious drawbacks.

### Common Reason 1: Skipping Tests to Make A Release

One real challenge for testing is that it is always the first casualty of delays. When the project needs to reach its deadline, and doesn't want to cut functionality, "compressing" the release testing phase is an obvious option.

Indeed, it may often be the only available approach, but it is important to recognise what you are doing; by sacrificing some testing time for increased development time, you are trading **confidence in the reliability of your existing functionality** for **the mere existence of additional functionality**.

If the *presence* of particular functionality is what is important (which is sometimes the case for marketing purposes), it can make sense to focus on getting something done. But if *reliability* of functionality is important, then it is a terrible mistake to compromise testing for more functionality.

What is important is to always phrase testing in terms of confidence. If the client talks about reducing time for testing a system, reframe it as reducing confidence in the reliability of that system. Similarly, if they want to increase reliability, they need to take time out of the "new functionality budget" to devote to the "confidence in functionality budget".

It is also important to understand that **if a piece of functionality is not reliable enough, then it might as well not exist**. This is very easy to forget when you have marketing or stakeholder material that mentions a piece of functionality. The urge to get that extra functionality in can compromise the reliability of more important functionality, especially near the end of a project.

### Common Reason 2: Skipping Tests Because Stakeholders Undervalue Them

Does this sound familiar?

* Client comes up with a massive collection of requirements, all labelled "must have"
* Developers push back massively to get some to "would be nice"
* Work begins despite the amount of work required being about three times estimated capacity
* Developers write unit tests for the bit of work they're currently working on
* Somewhere down the line, reality asserts itself about what will be achieved
* A combination of "crunch" (aka "overwork") and "expectations management" (aka "finding someone to blame") occurs
* Then acceptance tests are written for the stuff that's actually been done (if at all)
* Cool, ship it

From experience, this is depressingly common practice. What's notable is that if you ask stakeholders to come up with a set of test criteria without which the product cannot be released, the reply is normally "We don't have time for that." For some reason, the obvious implication about the amount of work involved in *implementing* the system never occurs to them till "somewhere down the line".

It is important to persuade stakeholders that a key aspect of testing is in *the planning phase*, not the end phase. When we are planning out a system and designing it, testing needs to be embedded from the start.

Ideally, there should be a collection of high-level tests that you can specify that "if it doesn't pass these, it can't go out the door". Then you encode those tests in your [end-to-end testing tool of choice](http://blog.scottlogic.com/2018/01/08/pros-cons-e2e-testing-tools.html) and focus on getting those done first. And if any work causes those tests to fail, everything comes to a shuddering halt until they pass again.

Obviously, in an agile environment you can always *change* these tests, but until those tests exist at all, you can't be confident you're coding the right thing.

---

So, what might be a valid reason to skip a test? Well, if you accept that tests are of value because they give you confidence in your system, then this implies that there is one valid reason to skip that test.

### Skipping Tests Because They Won't Increase Confidence

##### The Strong Law of Skipping A Test:

**If adding a test does not increase your confidence about the system, that test is not worth adding.**

But the strong law runs into the problem that some people are [unjustifiably confident](https://medium.com/@CodementorIO/good-developers-vs-bad-developers-fe9d2d6b582b) about their work. So therefore we have:

##### The Weak Law of Skipping A Test:

**Only someone who is not confident about the expected result should write a test.**

If you are confident that your code is fine, find a code-reviewer or tester who isn't, and get them to write the test. If it fails, then you were overly confident.

Similarly, if you find a developer has skipped writing a test for code you're uncomfortable with, write a test yourself and get the original author to confirm that the test respects the intention.

Do not return it to them with instructions to write a test. If they thought that part was worth testing, they would have already written a test. Telling them to write a test anyway is just likely to leave you with some bad tests.

> "But Our Team Expects 100% Code Coverage"

If this is true, then you need to ask *why*?

There will be an [underlying value to that rule](http://blog.scottlogic.com/2018/01/31/rules-values.html), even if it's "we want the code coverage metrics to be high so we can report them to management".

You need to respect that value, and then work to explain why that [value can still be met or may be inappropriate](http://programmer.97things.oreilly.com/wiki/index.php/Give_me_100%25_Code_Coverage_or_Give_Me_Death%21) without following the rule to the letter.

> What if we accept that there are categories of code that must exist but that genuinely need never (or can never) be executed under the glassy eye of the coverage tool? If we eliminate that from our consideration and from the metrics then what are we left with?

## Conclusion

At the end of the day, just like with any other code, every unit and behavioural test should exist for a reason.

[More code is bad. Less code is good.](https://blog.codinghorror.com/the-best-code-is-no-code-at-all/) Only add code when the other options have been exhausted. This also applies to tests.

You are writing tests to increase your confidence in your system. If you are not confident about aspects of your system, do more testing. When you have to make compromises due to time and budget constraints, always prioritise testing the areas where you need the most confidence.

I'm confident you'll make the right choice.