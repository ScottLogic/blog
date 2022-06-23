---
title: The Catch 22 of Conversational UIs
date: 2016-06-16 00:00:00 Z
categories:
- godds
- UX Design
author: godds
image: godds/assets/featured/catch22-conversational.png
layout: default_post
summary: This blog post highlights an awkward problem in one of the key building blocks
  of an automated conversational UI and suggests a few strategies for how to deal
  with it.
---

The left-right-bubbles-with-text-input interface is universally intuitive (to smartphone users!) as the mechanism for conducting conversation through text.  With Facebook Messenger, iMessage, Skype and most other messaging apps all following in WeChat’s footsteps and opening their platforms to 3rd parties, many – [Scott Logic included](http://blog.scottlogic.com/2016/05/18/make-banking-talk.html) – are exploring how services and brands can meaningfully use conversational interactions with end users.  Conversational interfaces using voice, such as Siri, Amazon Echo, Cortana and Google Now are similarly following suit as ultimately their only real difference is the audio input/output compared to text.
<img class="aligncenter" src="{{ site.baseurl }}/godds/assets/conversational-ui.png" alt="Conversational UI" />
One option for providing a conversational service like this is to have actual people manning it &ndash; a perfectly sensible and common approach if you wish to test an idea in true Lean fashion.  However, such a manual approach does not scale as a genuinely viable business when moving this sort of service to the mainstream because of issues such as cost and standardisation.

Fortunately, the interfaces are such that we can look to artificial intelligence (AI) to automate interactions with end users without them immediately seeming unnatural. The increasing commoditisation of AI, as exemplified by IBM Watson, Microsoft Cognitive Services and Google Cloud Platform amongst others, means that the relevant technology is not only available to all but also relatively inexpensive.

## Catch 22

The specific field of AI most relevant to conversational UIs is natural language processing (NLP). Most current NLP-related systems are based on machine learning in various ways. While the underlying machine learning algorithms and concepts have not progressed significantly over the last decade or two, the ever-increasing computer power available has drastically improved their potency.

Many of the NLP modules of the aforementioned AI services provide very good natural language parsing capabilities. That is, they can effectively interpret the logical structure and constituent components of utterances in many different languages. However, in most cases you &ndash; the service designer/developer &ndash; must still teach the AI the actual meanings, or intents, of those utterances. This is done by providing as many real examples as possible of different statements implying the same intent, from which the machine can learn to infer the meanings of variations of those statements.

<img class="aligncenter" src="{{ site.baseurl }}/godds/assets/thick-robot.png" alt="Machine needs to learn" />

It is in this crucial element of automated conversational systems that a catch 22 currently lies, as the truest examples come from genuine use (the number of different ways people can say effectively the same thing really can be astonishing):

<p style="font-size: 140%; font-weight: 100; margin: 1.2em 1.4em;">
For a conversational UI to be any good it needs to be used a lot; for it to be used a lot the conversational UI needs to be good.
</p>

Putting the size of this challenge into context, the founder of Wit.ai (acquired by Facebook) and teacher of Facebook M (Facebook Messenger’s automated personal assistant), Alex Lebrun, mentioned at [a recent messaging bots meetup in London](http://www.meetup.com/Messaging-Bots-London/events/231040163/) that they were a long way off having sufficient usage examples from several months of their 1000ish private beta users of Facebook M to consider the service fully reliable or automated and that this is their key focus. Admittedly this is likely in part because of Facebook M’s broad remit but then the resources available to the project are probably more significant than in smaller organisations.

## Strategies

So how can we seek to mitigate this issue? What kinds of strategies might we adopt to make an automated conversational interface to our service good enough that people will use it enough to provide the further training for our AI to become better?

**Dig deep for real examples**  
Don’t simply rely on the handful of example utterances you and those around you can think up. Find other ways of sourcing and/or harvesting them: scour support desk emails/calls; hunt online forums or social networks for anything relating to your service; or, role-play the service with people unrelated to the project. Get creative!

**Start regimented, become free-form**  
The more structure that can be assumed both in individual statements and conversational flows, the easier it is to teach the AI what to expect. The automated response can initially be designed to more explicitly shepherd users in their use of the service. Over time this can be lessened to allow more free-form, natural conversation with the user taking more control of its direction.

**Automate the 80%**  
Rather than attempting to have the AI handle all aspects of a conversational service, automation efforts should focus on the core interactions that make up the majority of the service’s use. The system can be set up so that other interactions, or simply those not recognised by the AI, are handled manually by a support team. The added benefit of this approach is that unexpected or new interactions can easily be supported and understood. Facebook M is known to be doing exactly this.

All of these approaches (and likely others) are being used to varying degrees by existing conversational services, regardless of how imperfect they may be. The key is recognising that, even more so than in many other types of systems, you must devise any quick, dirty and/or unscalable tricks you can to get your system being used out in the real world so that it can become the “perfect” system over time rather than attempting to create a gold-plated solution from the outset. AI is an incredibly powerful tool for conversational interfaces, but it is not (yet) a silver bullet.

If you are interested in exploring all this further with us, do <a href="mailto:enquiries@scottlogic.co.uk?subject=Conversational%20Commerce">get in touch</a>.
