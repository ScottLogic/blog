---
title: 'How to assess a developers technical ability: A guide for interviewers'
date: 2020-07-01 00:00:00 Z
categories:
- jharris
- People
author: jharris
summary: If you're hiring developers you're always going to need a technical interview
  as part of the process.  This post discusses what you should look for in this interview
  to find the best applicants.
layout: default_post
---

When you're hiring developers the process is always going to involve a technical interview at some stage.  It's often the company's current developers that interview the candidates, they're probably best placed to assess the the candidate's technical ability after all.  But its not an easy task, strong candidates might not be given the chance to shine because they're not asked the right questions and in a worst case scenario someone with only a surface knowledge can present themselves as a much better developer than they actually are.

This blog post is to give some advice for how to conduct the interview and what to look for to try and get an accurate picture of the candidate's technical ability.  There's a lot more you can do in a technical interview than just quiz the person on arcane details of their chosen language or spot how many mistakes they make when writing a sorting algorithm on a whiteboard.

This post is not meant to be a guide for developers going into interviews.   Although if you are applying for jobs it could well be helpful to read this and think about what the person on the other side of the table is looking for.

As a consultancy, we are fairly language agnostic at Scott Logic.  As projects come up we often ask Java devs to re skill as .NET devs, or ask back end devs to learn some front end.  Of course we need the candidate to have an appropriate technical level for the role they're applying for but we're less interested in whether they've got an encyclopedic knowledge of a language's syntax and more interested in how well they understand the fundamentals of programming.

## Writing code

As part of the interview we'll ask the candidate to write some code and there are a variety of different formats for this.  It could be small projects they write at home, pair programming with you or writing solutions on a whiteboard.  I think the format is probably less important than what you look for in the answer.  When I do this stage I'll have some fairly small problems to solve, ones that should take 20 minutes or less, and ask the candidate to write their code out using pen and paper.  I'm not after perfect syntax, in fact pseudo code is fine.  What I want to know are the candidate's thought processes when they're writing the algorithm.

To make the interview productive for everyone involved it's really worth being explicit about what you're looking for.  The candidate isn't a mind reader and neither are you so ask them to talk you through their thoughts as they go and prompt them if they're sitting in silence for too long.

Let's have a look at a fairly light weight example.  Suppose we've asked the candidate to write a program that determines if a given number is prime.  Here's what a good answer might look like, and just as importantly I've put as comments the things that I would mark a candidate up for if they mention them.

~~~python
# Has the candidate picked a sensible name for their function and its parameters?
def is_prime(number):  
    # Has the candidate made a good attempt to handle edge cases?
    if number <= 1:
        return False
        
    #  The candidate should be able to explain what their code does as they're writing it
    #  or upon finishing.
    #  E.g.
    #  "A prime is anything that only divides by itself and one.  So we'll start x at two
    # (we've already covered one) and we'll keep incrementing x.
    #  If our number divides by x then we know it's not a prime number.
    #  And if x reaches the number without hitting this condition then we know it is prime."
    x = 2
    while x < number:
        if number % x == 0:
            #  Is something sensible being returned?
            # A boolean is a good choice here-  I've seen people return the string "n" instead.
            return False
        x += 1
    return True

~~~

If the solution wasn't perfect first time that's no problem.  There might well be silly errors- maybe they put "greater than" instead of "less than"?  Or they forgot the final return statement?  If I offer a suggestion or correction then I can learn a lot from how the candidate reacts to that.  Some people are happy to solve problems collaboratively but others will push back against any suggestions and insist their way is correct.

There are often multiple good options when solving a problem and if the candidate makes a choice that you wouldn't, you need to give them a chance to explain their reasoning.  For example, maybe we're designing a set of classes and as the first step we need to decide how store a set of incoming messages in a queue while they wait to be processed.  The candidate says they would store them in a database when I think a simple in memory list would suffice.  Are they just over engineering the solution?  Maybe, but they might be able to justify their choices perfectly well, perhaps they're thinking about persistence if the power got cut off?  Some systems need that level of resilience and some don't. Until you know what's motivated their design decisions you don't know if the solution is sensible or not.  Normally I just want to know that they understand the choices they've made and that they've considered the alternatives.

 The key skill I'll be looking for is whether the candidate can explain their reasoning.  Being in an interview situation means they will be under a bit of pressure and it's worth being understanding of that, but since we're a consultancy our developers need to justify their design decisions to clients.

## Logic Puzzles

This approach of talking through the solution works if you ask general logic puzzles as well as programming questions.  By "logic puzzles" I really do mean puzzles that have a logical solution that you can reason your way through and not trick questions.  This is especially useful for more junior hires where they might not have much programming experience.  For interns and graduate developers we don't insist on a computer science background so working through logic puzzles together can be really informative.  I'm fairly sceptical that being good at brain teasers has much bearing on how good someone is as a software developer, but asked in the right way they give the candidate a chance to show they can explain a technical solution to someone and that they can ask sensible questions if they need extra information.

For example let's take the classic logic puzzle where a farmer has to take a fox, a hen and some grain across the river but can only take one of them at a time.

A correct but basic answer that a candidate could give might go along the lines of "take the hen across, then go back and get the grain, etc. etc.".

This answer doesn't give much information as to how they've figured out the solution.  Maybe they've just seen the puzzle before and memorised the answer?
 
A better answer would be saying something like "Well I've seen this before.  I remember you have to take some items to the far side of the river but then some items you have to take back with you again, is that right?  I think for the first step there's only one choice that works because for the first crossing you can't take the fox (because the hen eats the grain) and you can't take the grain (because the fox eats the hen).  That means..."

The candidate's open about the fact they've seen the question before, but they still show they're working through the possible solutions logically and ruling out the ones that don't work.  Because the candidate is explaining their reasoning, someone who hadn't seen the puzzle before could easily follow along and understand how they reached their solution.

Again, as an interviewer you should explicitly tell the candidate that you're after this kind of answer.

## Organisational Fit
Having developers conduct the interview should be more than just screening the candidate's technical level. They'll also get a good feel for if they'd be happy working with that person on their team for eight hours a day and whether they could enhance the office culture.

It's also worth noting that if you make the interview less of a grilling and more of a dialogue then people are more likely to walk away from it with a positive image of your company.  You want them to have this even if you don't end up making the person an offer, or they don't end up accepting it.  Developers talk to one another and it's much better for your hiring prospects if candidates are telling their friends and colleagues good things about your company.
 
## Summing Up
 
Ultimately there are no magic bullets when it comes to hiring. You'll need to gauge the candidate's technical level and you'll also need to decide if they're going to be a good fit for your company.  But we've discussed a couple of things you can do to help achieve this.

First, have developers involved in the interview process.  By looking for red flags in the coding questions and drilling down into the candidate's choices they should be able to spot anyone trying to hide poor programming skills or technical knowledge.  They should also be able to tell if the candidate is a good fit for the work place.

Second, make sure the candidate knows that you're more focused how they think through a problem rather than getting a perfect answer first time or knowing obscure technical details.  The interview should be a two way conversation, both so you can really understand their technical level and so you can give them a positive image of your company.