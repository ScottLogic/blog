---
title: Consistency is key...But should it be?
date: 2019-07-16 00:00:00 Z
categories:
- Delivery
tags:
- Agile,
- DevOps,
- Development
author: phands
layout: default_post
summary: "“But we already do it in the codebase” is a statement most developers have
  heard as a reply to a question about some sub-optimal code. But is consistency worth
  the price of lower quality applications? Or is it an excuse used for a less virtuous
  approach?"
image: phands/assets/consistency-is-key.png
---

## Is consistency as important as we make out in software?

_“If Adam jumped off a bridge would you!?”_ A chastise regularly spoken by parents and heard by children when the only justification for deciding to do something naughty was “Adam did it first” (this is just my case; Adam was a childhood friend of mine who regularly did naughty and idiotic things).

We are taught from an early age that just because someone else has done something, we should be able to think for ourselves and decide whether or not it’s the right thing to do, and that justifying our actions with “Somebody else did it before me” falls on deaf ears. Why then, in the world of development, is “This is already in the codebase in file X” permissible as a reason to add sub-optimal, and in some cases downright wrong code to our repositories and applications?

It’s a problem most software engineers have faced:

 -	Using whichever paradigm that the team have for ensuring code quality - assuming (please!) that there is one present – you notice that something isn’t quite right with the code that is being added.
 
 -	You advise the author as much, possibly going so far as to suggest what is wrong in terms of code cleanliness, style, convention, optimisation etc. and also - if you’re feeling particularly generous - how to fix the problem, or the approach you think will take the code in the right direction.

 -	The author immediately pushes back and states that this has already been done elsewhere in the codebase (they might even go so far as to direct you to the relevant code that already exists). If it was OK there, then why is it not OK _here_?

From a personal perspective this conversation usually resolves with a reply like so (I should note most of my experience of these situations comes from agile teams using scrum):

_“OK, I see your point. It shouldn’t have been allowed in in the past either, but I understand the argument with consistency. In an ideal world what we would do is fix all instances and refine the code. So, considering avoiding scope creep on your story, this is OK, but we should look to revisit this at a later date to fix properly”._

Sound familiar? And then before you know it a third instance of the code is added. This time though, the author has two instances they can reference as to why it should be allowed in. Now you’re in a weaker position than you were before, and the argument above repeats again.

So - in software, at least - consistency seems to be a very easy defence to hide behind. Keeping the codebase similar, it would appear, trumps a lot of the decisions going forward, with some feeble attempt to resolve the problem later by adding a task to your backlog to fix the issue, which delivers no new business value to your customer, which your product owner is probably never going to prioritise.

But should we let “keeping our code consistent” be a justification for adding code we know isn’t as good as it could be into the codebase? Or should we be like a parent and refuse to accept such reasoning? As I see it there are three obvious options, each with their own pros and cons.

### (Our typical current outcome) we accept the code as is with the justification of keeping the codebase consistent.

Pros:

 -	It is unfair to do this blog post without acknowledging that consistency in a codebase *is a good thing*. If similar functionality is constructed in a similar manner, then understanding the flow of the functions is a lot easier to grasp, and a lot easier to bounce from.

 - With regards to this example with sub-optimal code, it *will* make it easier in the future to refine the code in all the places it exists, *if* that task is ever started on.

Cons:

 - The entire premise of keeping the codebase consistent so it can be all optimised at a later date relies heavily on actually getting around to optimise all of the code at some point in the future. If this isn’t the case what you end up with is consistently bad code everywhere in your application. Something everyone should want to avoid.

### (The ideal, no time pressured solution) we go back through the code and fix all instances of the sub-optimal code.

Pros:

 - This option is clearly the most evangelical of the approaches we can take to rectify this problem. In fixing the sub-optimal code everywhere we would actively improve our codebase quality, at the same time as keeping a consistent structure in the codebase (which we’ve already agreed is a good thing).
 
 - Moving forward the better way to construct the code in question is present in the codebase, so anybody doing similar won’t be taking inspiration from code which shouldn’t be repeated.
 
Cons:

 - The obvious con here is the viability of taking on the extra workload required to locate and fix the code in question. It might not be too taxing to do so (especially if, at review, something different has been suggested to try), as you would swap the code in both places (another pro of consistency!) and you’re done, right? Well once you’ve gone and regression checked everything and asked your testers to verify nothing has broken in this previously stable section of the app. Let’s hope you’ve got good automated testing in place!
 
 - If the app is in “crunch” _\*shudder\*_ as you approach the end of sprint or even a release to production, you could end up taking time that isn’t available to fix a problem that isn’t as obvious as missing features, risking the wrath of products owners and stakeholders alike.
 
### (For me, the rarest approach taken by a team) we go back and change *this code only*, leaving the sub-optimal code that was already there in place.

Pros:

 - Doing this ensures that the better code *is in the codebase*. This means that moving forward, before you get a chance to refine the other code in the application, if a developer tries to push up similarly sub-optimal code you can point them to the better way of doing it, and ask them to be consistent with the better code, rather than consistent with the sub-optimal code.
 
 - Adding code that you don’t actually consider to be the best it can be is a bit of an antipattern, and adopting this approach means that at no point a justification for consistency will result in a compromise on code quality.
 
Cons:

 - In this case consistency does suffer (and we’ve already accepted consistency *is a good thing*, all considered), so if someone introduces a third solution to the same problem, any argument founded on consistency will be lost.

## So which option is the best one to take?

Unfortunately, as is the case with pretty much all software development questions, the definitive answer is: _It depends_!

I hold the view that sorting out all instances in the codebase (the evangelical approach) is the best one, as I’m sure most developers do. However I also attempt to look at the impact from a realistic approach, and if you have deadlines and sprint commitments and various other external factors I don’t believe very often you’ll get time to pull back and fix what would be traditionally consider a technical debt task “on the fly”. Which only leaves the other two options.

I believe that the biggest consideration of this is down to the amount of time on any given project that is given to fixing issues and refactoring / exploring (and if you don’t have any, *ever*, then you should start asking for some!). If you have enough time, and scope to prioritise it in the up and coming sprints / the work you’re tackling soon, then allowing for consistent code of a lower quality will make the optimising easier *when* you get to it. If however that time is already earmarked for other tech debt issues then I stand by the belief that consistently bad code is still, by it’s very definition, *bad code* that shouldn’t be in the codebase. I would advocate to push back a little bit harder and refuse to accept the consistency argument. Sometimes you do need to ask yourself if this particular consistency argument is going to be _“the hill to die on”_, or whether the code smell is worth having the push back and forward (because I guarantee you’ll get one!).

It is worth bearing this kind of discussion in mind when considering code that covers new ground for the first time. If it is the first time that your code base attempts to make a GET request and parse the response, or set up sockets, or even something as mundane as breaking ground by rendering something new to the app view, it could be worthwhile in the long run to be very rigorous and thorough in assessing whether this approach is truly the best approach. Nobody has a crystal ball but asking a quick “how might this be used elsewhere” aids in both reusability and from falling into the “consistency trap”. This in itself can be difficult if your team is being pushed for reaching a sprint goal, or a release to production, and the stakeholders want the functionality in quickly. Just be strong!

## So, is consistency the trump-all justification we let it be?

I don’t think so. I think that too often we allow for “consistency” to be an excuse to submit code that doesn’t work as well as it could do. I think picking the battles is important, but I would encourage developers to stop and think “if it weren’t in the codebase already, we would accept it?” If the answer is no, should you really accept it now?

If all else fails, push back, and when the consistency excuse / reason / justification is given ask _**“If component X jumped off a bridge would you code your component to do the same!?”**_
