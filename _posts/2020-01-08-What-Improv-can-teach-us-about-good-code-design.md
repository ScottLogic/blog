---
title: What the art of Improv can teach us about the craft of software
date: 2020-01-08 00:00:00 Z
categories:
- Tech
author: garora
layout: default_post
summary: Improv is one of my favourite pastimes. In this post I explore some of the most fundamental rules of Improv and what they can teach about writing good code.
---

In my spare time, I perform Improvised Comedy with Durham University’s [Shellshock](https://www.facebook.com/shellshockimpro/). I've been thinking about how software developers
can learn from Improvisers. I was spurred by an upcoming [meetup](https://www.meetup.com/Agile-North-East/events/266801981/) hosted by Agile North East to write this blog about it.

## Improv

First a disclaimer, my experience is fairly narrow (yes, in both) and there are many schools of thought - so we will be sticking to general principles.
Improv (or Impro or Improvisation), in entertainment is a technique in which there are no scripts, and the scenes are created based on audience suggestions. Improv does not have to be comedic, it can be of any genre. The nature of and
the method of getting the suggestions various wildly. They might ask people to write down "something that you would not find in the kitchen" on a slip of paper, shout out
"an occupation", or even just give them a random word. Once they have the suggestions the Improvisers may perform a single scene (often with a gimmick), a longer narrative made up of smaller scenes or even a series of unconnected scenes.

## How to be good

Just like in software development, practise is essential, and nothing can substitute for it. However, also like software, there are rules to follow to make your life and your team's
lives much easier. I have chosen a few of these rules and discuss one in each of the sections below.

### Yes and

The number one rule, and I can't stress this enough, is "say Yes and". This rule is not literal, it means you should agree with your fellow improvisers and then add to the scene. Of course
the characters can have conflicts. For example, this is perfectly fine:

> Assistant: Doctor, Doctor. Mrs Jones is in your ward, she has a backache.  
> Doctor: Feed her 3 red grapes, each from a different packet  
> Assistant: Do.. Do you not want to do a check-up? And maybe give her some painkillers?  
> Doctor: I am the Doctor here, I didn't spend 15 years in medical camp for this...

In this conflict, the audience knows what is going on and the improvisers know what is going on. However, a conflict like this causes issues:

> Assistant: Doctor, Doctor. Mrs Jones is in your ward, she has a backache.  
> Doctor: I'm already in my ward, and Mrs Jones is in America and there are no backaches in the 43rd century.

This ridiculous line may get a laugh purely due to the absurdity of it (or my comedic genius), but the improvisers have left yourself nowhere to go. They will struggle
because they don't know which reality to follow and, for the same reason, the audience won't be invested.

So the idea here is to not break what is already established. In software development, we might refer to this as backwards compatibility. This is very important as it won't break things made with the
old version. In rare cases, backwards compatibility may be sacrificed, but this needs to be done slowly with deprecation warnings. In Improv it means slowly hinting and then revealing
you are an alien from the 43rd century.

Another way of implementing "yes and" in your coding is to not contradict yourself. The contradiction in the previous example could’ve left the performers and audience members confused, so don’t let the same happen in your code.

For example, don't reuse variable names for different things. Otherwise it gets confusing for you, and anyone who reads your code.

A key difference between Improv and software is in software you can go back and retrospectively change the variable names to be sensible (don’t let that tempt you into bad practices). Whereas you don’t have that luxury in Improv, you generally can’t restart the scene.

### Confidence

Confidence is important in everyday life, but it has a special place in Improv. If you can't do something well, just commit to doing it and it will be entertaining to see you fail. After all, the entertainment
aspect is the main part. This rule is often thought of as "There are no mistakes". For example, imagine you've been told to do a French accent, and you can't do one. It is better (much better) to do a very
strong accent (even if it starts sounding Spanish let's say) then it is to say "Bonjour" and then go back to your normal voice. In the ideal world, with each challenge you either blow the audience away by how good you are
or make them laugh at your failures. Making a strong choice also makes it easier for other people to add to the scene, because there is more to work from. Another way to think about this is "You do not need to be perfect". If you focus too much on on trying to perfect one aspect, you will likely lose quality elsewhere.

This doesn't mean if you don't know how to use a certain technology, you should just use it, put it in production and hope for the best. But don't be scared of a blank canvas, and
just start doing something. It also teaches us to not chase perfection. This is the
"Done is better than perfect" mentality. You will never be able to make every part of the project absolutely perfect. If you try, you will be frustrated, and quite often stall the
project. It is important to set standards of good code (hence, this post), but it is important to remember that there will not always be a flawless solution. Even if there is, it
might be impractical to implement it due to the potential workload. If you follow perfectionism, you might never get a product. This idea is core to the agile process, because the
agile process recognises that we are not in a perfect world where we can go from product brief to solution without problems. This approach also encourages you to constantly improve,
if you can have a product that is "good enough", you can always improve it later. Nobody expects you to make a flawless product from product brief and no one expects you to do a
perfect Turkish accent (although, well done if you can).

### Drop the baby

This rule can overlap with the first rule but it is still worth mentioning. A "baby" in Improv is defined as an idea you have for a scene or collection of scenes. And the rule states that you should drop
the idea when it can't smoothly be added to the scene(s) and enhance it. In other words don't steer the scene(s) in a certain direction so that you can implement what you want. This can
lead to improvisers 'fighting' to get their way at detriment of the show, especially if neither idea ever gets implemented. If you can't put your idea in smoothly, drop it because
the overall show is more important than you. For example, in this scene P1 wants to buy bread and P2 wants to fight a homeless person:

> P1: Let’s go to the bakery!  
> P2: I hope there’s some homeless people on the way  
> P1: Yes, then we can give them the bread that we buy from the bakery  
> P2: I wonder what kind of bread makes the best weapon  
> P1: Nothing is more powerful than love and friendship expressed over the consumption of bread  
> P2: OR HUMAN FLESH

Here, as before you might get some absurdist humour out, but the scene will stall as the Improvisers can't align their goals.

No matter how good an idea you have of how to implement something, no matter how much you want to use a certain technology, it is always possible that the requirements of the project,
or the way in which another aspect has to be implemented makes that impossible or not worth the effort. The key here is that the project quality is more important than making you
look smart for having a clever fix, and more important than adding an extra technology to your CV.

### Reincorporation

Reincorporation is one of the most difficult parts of improvisation. However, if done correctly it can make longer narrative pieces more engrossing. Reincorporation means you bring
back previously established elements into the show. In a narrative piece, this means that rather than always creating new things, advance the scene by using what the audience already
knows. A good mystery should keep you on your toes about the reveal but be fairly obvious once you know the solution. Similarly a good Improv scene needs to remain unpredictable,
but major plot changes shouldn't just drop out of the sky (unless you've established that things drop out of the sky). This is a very difficult thing to achieve in Improv (and also
for some script writers too, apparently). So it's important to throw out many things that could be used near the beginning of a scene/story.
Reincorporation can also be used directly for comedic purposes. You may for example, have a running gag. Even referencing something well-established in an unrelated scene can make
seemingly normal dialogue hilarious to the audience.

I think this closely relates to the DRY (Don't Repeat Yourself) principle. You might wonder how is reincorporating about not repeating yourself? It is because DRY doesn't mean
never doing the same thing again, because even reusing a function would be doing the same thing again. DRY means you should reuse tools where you can to simplify your life. It tells you
to not solve every problem that you get in a completely new way. If you
can rewrite the problem to reincorporate a tool that already exists you can make writing and maintaining the code a lot easier. And if the tool doesn't exist, you should make your own
i.e. write functions to extract repeated logic in your code.

### The job of the compere

This one isn't really a rule, but more just a fact of the roles within Improv. The compere is the person who runs the scene/show and shouts commands at the performers. For example in a game
called 'Change', the compere shouts 'Change' (Shocking, I know), and the performer must change the last thing they said/did. This may lead some to believe that the compere is completely in charge.
However it is the performer's job to feed the compere with information, lines and actions to work on. For example, in a game of "Forward/Reverse" the compere controls time and can get the
performers to rewind over their actions and see them again. However good improvisers know that this is the funniest for large exaggerated actions. So the performers will do more of these to
let the compere know 'this is a thing you can make me do lots of times'. Of course the compere has final control, but it's their responsibility to help the improvisers do what they want.

This is similar to the role of a scrum master (and product owner) in the agile process. It is not their job to lord over the team and decide everything. But instead they need to use their power to let
the team work in an agile environment as they see fit (within reason). They should create an environment where the team can be effective in their goals. Just like an overbearing compere could
ruin a scene for the audience and the cast, an ineffective scrum master can harm team morale and the product

## To conclude

The next time you watch some Improv, think about what these performers can teach you about good code design. And then stop thinking
about it and enjoy the show.
