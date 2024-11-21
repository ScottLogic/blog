---
title: Domain-Driven Design
date: 2018-03-28 00:00:00 Z
categories:
- Tech
author: tclarke-scottlogic
layout: default_post
summary: Key lessons I took from Eric Evans' book "Domain Driven Design". A brief
  summary of the book's concepts and why you should read it.
---

> Manufacturing is a popular metaphor for software development [...]
>
> This metaphor has messed up a lot of projects for one simple reason - software development is *all* design.
>
> \- *Domain Driven Design, Chapter Three*

One of the key aspects in software development, and the one that is not given enough respect, is design. When people think of design, often they still seem to think of it as the initial step in a Waterfall process, while they think that "Agile skips straight to coding".

This is... a bad thing (and not just because they used [Agile as a proper noun](https://youtu.be/a-BOSpxYJ9M?t=10m46s)), both for software design and for adoption of Agile development practices.

The classic book on Agile Design is probably [Eric Evans' Big Blue Book](https://www.amazon.co.uk/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215). Unfortunately, Eric is an honest design expert, not a marketing expert, so he called it "Domain-Driven Design", thus depriving himself of perhaps ten thousand extra book sales. Time for a rebrand for the second edition, methinks...

But the title is more accurate, because the concepts in Domain-Driven Design can be applied to any project, whether run using XP, SCRUM or CMMI. It is over 500 pages long, and well worth your time and money (or at least the money of your employer's programmer library), but I'll attempt to summarise a few of the core concepts here.

### DDD is about Knowledge

> When we set out to write software, we never know enough.
>
> \- *Domain Driven Design, Chapter One*

>  In my terms design consists of:
> 
> 1. Flowchart until you think you understand the problem.
> 2. Write code until you realize that you don’t.
> 3. Go back and re-do the flowchart.
> 4. Write some more code and iterate to what you feel is the correct solution.
>
> \- *H.A. Kinslow, [NATO Software Engineering Conference(1968)](http://homepages.cs.ncl.ac.uk/brian.randell/NATO/nato1968.PDF)*

Software design is a "[Wicked Problem](https://blog.codinghorror.com/development-is-inherently-wicked/)". In order to really understand the problem you are trying to solve, whether it be your client's real needs, the limitations of your API, or just the discoveries you'll make along the way, you need to begin solving the problem.

And once you have that information, you need to keep it available. One way to describe risk in your software development project is the "Bus Factor"; specifically, how many employees would need to be hit with a bus before the project loses critical knowledge. Of course, [in the real world, the bus is not essential](https://thedailywtf.com/articles/Up-or-Out-Solving-the-IT-Turnover-Crisis).

> But imagine if the justification for documentation was different:
> 
>> "I need you to document this process in detail so that any yahoo can understand it a year from now after you’ve left."
>
> I’ve never had a manager or higher-up ever put it that way. In fact, many people feel that’s an even more stolid justification than “hit by a bus”.
>
> But it isn’t; it’s just reality. Why not accept it?

If the organisation has a shared understanding of the domain the software describes, then a single developer, or even a small team being unavailable should not derail the project, because a new starter assigned to that code can ask anyone about a particular concept and have a good chance of receiving a meaningful answer.

One example from my own history came during a project involving a fairly complex API. We were looking for the location of a particular data source, and were having no luck at all. After a few days, I happened to bring this up with one of the testers on our way to lunch, who mentioned a domain term that we found matched our needs exactly. Now, none of the developers, including myself, had heard the term *in their lives*. The lack of a shared understanding of the domain cost days of developer time.

Imagine if we had instead spent some time modelling the domain we were working in, discovering the different concepts that model required, and every developer had that knowledge. Time and money could have been trivially saved. In Domain-Driven Design, this process is called "**Knowledge Crunching**" and is a key part of the design process.

**Knowledge Crunching** is a process that involves *both* analysts *and* developers. Between them, they both add knowledge to their shared pool, and then (and this is the bit people tend to skip) *filter out anything that does not directly relate to their specific design need*.

Which brings us the the first thing Domain-Driven Design is *not* about.

### DDD is not about Describing the World

Both software engineering and any domain complex enough to be worth designing for often run into the problem of being too complex for any one human mind to cope with. It is pretty easy, as I have discovered, to *open* two hundred tabs of relevant and useful information for HTML5 or Liquidity Management. Actually reading and understanding that information takes a lot more work.

Fortunately, any one product does not require you to understand the complete design history of HTML5, or the entire Financial Products domain. Instead, you extract relevant information from the flood of available knowledge and encode it in some way into your product, whether in documentation or in code.

This is a key aspect of **Knowledge Crunching**.

> Effective domain modellers are Knowledge Crunchers. They take a torrent of information and probe for the relevant trickle.
>
>  \- *Domain-Driven Design, Chapter One*

One good way of thinking about the Domain is described by Evans as "Am I?" vs "Does the user care that I am when using this software?". Your database may be relational. It may be file-based. It may operate by calling up a random call centre worker, who will carve the information on tablets of stone and then type that information into a console when the information is requested. The user does not care, so it is not part of the domain.

This process of refining the model down to something simple enough for people to work with is important, because the design is not the product. The design is intended to help human beings to understand the product, and communicate about it.

### DDD is about Communication

> “Any fool can write code that a computer can understand. Good programmers write code that humans can understand.”
>
> \- *Martin Fowler, "Refactoring: Improving the Design of Existing Code"*

Programming languages are designed for humans to read, not computers (yes, even assembler). The same applies to software design, where you are effectively crafting a **model for shared communication**.

With a good design that matches the way domain experts communicate, developers can quickly find the relevant areas for the part they want to work on.

If the design is disassociated from how the users refer to it, someone somewhere is being forced to do context switching every time they move from dealing with the users to dealing with the code.

If the design is highly technical, because it has been produced from a majority developer perspective, then it is unlikely that the domain experts will feel capable of suggesting where it can be improved, or if something is missing.

Thus, one of the key recommendations from Domain-Driven Design is to adopt a "**Ubiquitous Language**". This should be the language you write your requirements or user stories in.

Effectively, you want to be using language that makes sense to *both developers and domain experts*. This means that you want to remove the technical words (e.g. database table) from your discussion, and use that subset of the domain language that is directly relevant to the problem you are trying to solve.

> Programmers [should be able to] show business experts technical artifacts, even code, that should be intelligible to domain experts (with guidance), thereby closing the feedback loop
>
>  \- *Domain-Driven Design, Chapter One*

At the same time, if there is a term people are throwing around that is not in the model, that raises the question of why it does not appear in the model; and if someone uses a term like "everything" or "whatever", that also implies a missing concept. **There is no such thing as "everything"**. "Everything" means a large collection of things, some of which you do not fully understand. With a good domain model, you should be able to point to, package and name those things.

These models also come in useful when communicating across teams. By seeing which parts of the domain are critical for one model but absent from another, this reveals where the main areas of cross-team design conflict will occur. An excellent example is given by Evans of a team that accidentally broke a working system by treating a mandatory field as optional.

All of the above raises a simple test for if you have a problem with your design; if the design is made up of documentation that is not being used to communicate, you have a problem.

### DDD is not about Documentation

> Well-written Java is as expressive as UML in its way.
>
>  \- *Domain-Driven Design, Chapter Two*

*Domain-Driven Design* uses a lot of UML diagrams. Remember them? No? Oh god, apparently I'm old now.

When I think of UML, I tend to think of unreadable class diagrams that you want to move away from and get to readable code examples. Except when I'm reading DDD, where they are generally clear and concise. This is because Evans focuses his diagrams on a very clear subset of the design process.

Code is good at expressing the "what" of a design. By its very nature, source code is a document that perfectly describes every current design decision of the product. What it can't express is *why* the decision was taken, or even if it was taken for the wrong reasons (aka "yeah, that's a bug").

Non-code documentation is good at expressing that "why". By showing only the big bold strokes of the design, and the history of how that design came to be, a good diagram or document will make it clear which relationships in the design are important.

I still remember my first task on my first job; I had to update a product UML diagram from the design document. There was a specific requirement to include every single element described. But this meant that the diagrams were huge, cluttered, unreadable and redundant. I was *writing* the documentation, and couldn't understand what the diagram was intended to show a reader. Only in later (and more cynical) years did I realise that its sole purpose was to show that work had been done, instead of providing actual value. No-one was ever going to *read* it.

You know what structured document would also have demonstrated this design work? 

> [Customers] are paying us for solutions [not source code]. [...] In actual fact, if we build this analogy properly, [the source code] is the *detailed design document*.
>
> \- [Glenn Vanderburg, Real Software Engineering](https://youtu.be/RhdlBHHimeM?t=51m15s)

A document shouldn't try to do what the code already does well. The code already supplies the detail. It is an exact specification of program behaviour.

### DDD is about Code

> "The project had a domain model, but what good is a model on paper unless it directly aids the development of running software?"
>
> \- *Domain-Driven Design, Chapter Three*

If a term from your ubiquitous language or model does not appear in your codebase, then it is likely that:

1. That word doesn't need to be in your ubiquitous language or
2. You've forgotten to encode that concept or
3. You've called it something else in the code

Note that this does not mean that a *class* needs to exist with that name. If the term refers to an object that relates to two classes, it might be a function name or a member variable or a parameter. In Domain-Driven Design, such "identity-less" objects are known as "**Value Objects**" and contrasted with "**Entities**", which have a "lifetime" (for example, a student is an entity, but a grade is a value object).

What this also means is that the domain should be expressed in the natural semantics of the programming language you are using. Domain-Driven Design was written before the "functional programming renaissance". That doesn't mean it is incompatible with a functional language, but rather that, in that case, your domain should be expressed in functional idioms, just as Evans recommends writing the domain in the idioms of the languages he was more familiar with.

> Before I ever heard of object-orientated programming, I wrote FORTRAN programs to solve mathematical models, which is just the sort of domain in which FORTRAN excels. Mathematical models are the main conceptual component of such a model and can be cleanly expressed in FORTRAN.
>
> \- *Domain Driven Design, Chapter Three*

> A domain model does not have to be an object model. There are model-driven designs implemented in Prolog, for example, with a model made up of logical rules and facts.
> 
> \- *Domain Driven Design, Chapter Five*

But if you allow the model and the code to separate, what Evans describes as "a deadly divide" forms, where either the model or the codebase will eventually end up becoming vestigial. In the former case, your product is unlikely to satisfy the customer or be easy to enhance; in the latter, your product is unlikely to be released at all.

This also connects back to the importance of **Knowledge Crunching**. As Evans discusses, if programmers do not understand the [value of the model](http://blog.scottlogic.com/2018/01/31/rules-values.html), they won't respect which parts of the system "matter", and will compromise the overall model with any refactoring.

> If the people who write the code do not feel responsible for the model, or don't understand how to make the model work for an application, then the model has nothing to do with the software. If developers don't realise that changing the code changes the model, then their refactoring will weaken the model rather than strengthen it.
>
> \- *Domain-Driven Design, Chapter Three*

Evans also has clearly encountered "abstract architects" who design a technical solution in isolation and never consider how it will relate to the code, as this comment shows.

> Any technical person contributing to the model must spend some time touching the code, whatever primary role he or she plays.
>
> \- *Domain-Driven Design, Chapter Three*

And finally, Evans is keen to ensure that domain experts are, if not directly connected to the code, engaging with the developers in a tight feedback loop. 

> Those who contribute in different ways must consciously engage those who touch the code in a dynamic exchange of model ideas through the ubiquitous language.
>
> \- *Domain-Driven Design, Chapter Three*

So, we have established that your domain model should strongly influence your code, but what about actually embedding domain model concepts *into* the code?

That turns out to not be such a good idea.

### Design is not about Tools

> But as we move in this direction, we must guard against our enthusiasm for technical solutions; elaborate frameworks can also straitjacket application developers.
>
> \- *Domain-Driven Design, Chapter Four*

Domain-Driven Design was written not to promote a software toolset, but a particular mindset. And because of the way software developers' brains work, their immediate reaction was to try and build a toolset<sup>[1]</sup>.

Entity Framework is probably the most well-known of these, both for good and for ill. What I have personally found, and had confirmed by other developers, is that tools like Entity Framework, which are marketed as concerned with modelling the domain, tend to instead be about abstracting the persistence layer.

> But these concerns are unrelated to the business problem your software is aimed at solving, so persistence should not interfere with the domain design. This is a challenge for me because as I’m designing my entities, I can’t help but consider how Entity Framework will infer their database mappings. And so I try to block out that noise.
> 
> \- [Julie Lerman, Coding for Domain-Driven Design: Tips for Data-Focused Devs](https://msdn.microsoft.com/en-gb/magazine/dn342868.aspx)

Note that this is not to say that Entity Framework is a bad product. Entity Framework does a good job of solving the problem of abstracting away the database behind Entity Objects, but, because that abstraction is leaky, it encourages you to consider of data access issues in your domain model.

[This article](https://www.thereformedprogrammer.net/six-ways-to-build-better-entity-framework-core-and-ef6-applications/) is a perfect example of a "solution" to that problem. The DDD is good. The business logic is clearly abstracted away from the Entity Framework infrastructure. *But if you are doing that*, then Entity Framework describes persistence layer objects, not domain layer objects. What you have in your domain layer are called objects. And we have programming languages that can handle objects without a framework. They're called object-orientated programming languages.

All Entity Framework is doing is abstracting away the database layer, which is an entirely acceptable use for it, but hardly worth warping your design for. You can expose entity objects to the domain layer if you like, in order to reduce duplication, but this risks your domain layer being corrupted by persistence information, such as database unique identifiers. Worse, it handicaps your domain layer, because certain domain-level relationships interact very badly with relational databases.

As with any tool, it is best that you consider if it is appropriate for your needs. But just having a framework that references the Domain does not mean you are doing Domain-Driven Design. With design, think "Mindset", not "Toolset".

## Conclusion

As I said at the start, Domain-Driven Design is a deep read, with a huge amount of useful content. Take the ideas, use them, share them.

And if you disagree with what I learnt from *Domain-Driven Design*, I can't wait to hear what you learnt from it in the comments!

---

<sup>[1]</sup>: This statement sums up the entire history of software engineering tools.

---

Beyond the authors linked to in the post, thanks to:

* [Ross Rhodes](http://blog.scottlogic.com/rrhodes/) and Heather Carter for reviewing this
* [Kevlin Henney's lecture on Software History](https://youtu.be/otAcmD6XEEE?t=7m45s) for introducing me to the fascinating [NATO Software Engineering Conferences](http://homepages.cs.ncl.ac.uk/brian.randell/NATO/) (also Brian Randell of Newcastle University for putting them online)