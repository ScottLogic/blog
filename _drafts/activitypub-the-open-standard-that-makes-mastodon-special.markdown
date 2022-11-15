---
title: ActivityPub - the open standard that makes Mastodon special
date: 2022-11-15 11:15:00 Z
categories:
- Open Source
summary: After the recent acquisition of Twitter by Elon Musk, you may have heard
  someone mentioning Mastodon. Alongside other open source and decentralised social
  platforms, it is built on the top of ActivityPub specification. In this post I give
  an overview of ActivityPub, explain the idea of fediverse and share my personal
  user experiences.
author: mgrabara
---

Controversies around Elon Musks’ Twitter takeover sparked questions about the alternatives to big-tech-run social media. Debate about decentralised internet is back in the mainstream and focuses on “the fediverse”.

The fediverse, or federated social media, started gaining attention and users. In the last couple of weeks, Mastodon, the most successful one, received coverage from global news outlets, such as [BBC](https://www.bbc.co.uk/news/technology-63534240) and [Al Jazeera](https://www.aljazeera.com/economy/2022/11/7/can-mastodon-be-a-twitter-alternative). While the awareness of the platform is increasing, little is being discussed about its underlying protocol, [ActivityPub, a W3C standard for federated platforms](https://www.w3.org/TR/activitypub/).

If each federated platform is an office building, ActivityPub is an underpass connecting them. On a rainy day, a person working in one building can grab a coffee in a neighbouring building’s café without taking an umbrella. The standard, and federation in general, is not a silver bullet to solve all the issues faced by the interconnected global society. Instead, I see it as an alternative approach towards tackling them. Rather than community relations shaped by R&D departments in Silicon Valley, fediverse tries to replicate offline human relationships on the internet.

## Mastodon is no stranger to news

While many link the media interest in Mastodon to Elon Musk’s late business decisions, [South China Morning Post reported on it on 18th September](https://www.scmp.com/tech/tech-trends/article/3192843/chinese-social-media-users-are-flocking-decentralised-mastodon), two weeks before Musk confirmed his commitment to Twitter acquisition. In the article, Matt Haldane notes fifty thousand new Chinese-speaking participants joined the platform between February and August this year, about a fifty percent increase. The quoted sign-up pattern also shows that each tightening of restrictions in mainland China’s cyberspace is linked to a spike in the number of Chinese speakers joining Mastodon.

Mastodon, with its source code available under AGPL licence, has also been used as a backbone for more controversial projects, such as Donald Trump’s Truth Social. [Suspicions the far-right platform is based on Mastodon were raised before Truth Social even launched](https://news.yahoo.com/trumps-truth-social-may-sued-192100382.html). Threatened with legal action from Mastodon’s creator, Eugen Rochko, Trump Media & Technology Group eventually released the source code.

[As reported by Rochko](https://mastodon.social/@Gargron/107837713886536075), all federation features have been disabled in Truth Social’s code, and therefore it is not different from the incumbent commercial players, in terms of locking users in a walled garden.

## How does ActivityPub support platform federation?

The key issue is to understand how the fediverse achieves seemingly contradictory goals: decentralisation, ease of use, ability to reach users across the whole network, freedom of expression and moderation. This is done on the protocol level. Most commonly used standards in the fediverse are Matrix, used specifically for real-time chat, voice and video solutions, and ActivityPub, a more general W3C standard used by the likes of Mastodon.

[As described by rolltime during her talk at HOPE 2022](https://youtu.be/vnciCz83t70), platform federation is a sweet spot between centralised and completely decentralised networks. Unlike a distributed ledger, used by many cryptocurrencies, it does not require each participant on the network to have a full copy of the history of network events. A server will not actively communicate directly with another one, unless a user of one server initiates it by engaging with a user on another one (it will still crawl the web for other instances and fetch a list of users from each, allowing an individual user to search others across the whole network).

An administrator of each instance, sometimes also called “homeserver”, can enforce their own moderation rules for their own server, and this includes the ability to communicate with other instances. While, by default, the protocol will allow the users to discover and connect with every other instance, an administrator may decide to restrict access to some instances, or defederate from them, effectively filtering content available to its users.

As no central server exists, a user dissatisfied with policies of their homeserver can switch to another one. While not a part of the ActivityPub specification, [many platforms provide tools to migrate between instances](https://blog.joinmastodon.org/2019/06/how-to-migrate-from-one-server-to-another/). They are not perfect. For example, followers are not yet automatically notified of the move and switched to follow the Mastodon account on the new instance. This is definitely a burden for people with a high number of followers and may discourage them from jumping ship, or using federated solutions altogether.

Another important aspect of ActivityPub is the ability to follow users across platforms. A [Friendica](https://friendi.ca/) (a Facebook-like service) user is able to follow someone using Mastodon as they both are based on ActivityPub and share the same specification for JSON messages used to exchange information between one another. The user identity itself is, unfortunately, not “nomadic”, meaning it is not possible to use e.g. Mastodon account to sign into [Pixelfed](https://pixelfed.org/) (an image sharing service), unless an authentication bridge has been specifically implemented on an individual server.

## What is it like in the fediverse? 

I attended the [Hackers On Planet Earth 2022](https://xiv.hope.net/) conference last July and all the communication was conducted through the Matrix chat. Matrix requires a bit of technical affinity and even very advanced users admitted losing their cryptographic keys, and therefore their chat history.

Other than that, the overall experience is very similar to Slack and IRC. Due to its federated nature, the account I set up as @grabi:hope.net can join chats hosted on other servers. Participants who already had an account at another homeserver could use it to join the conference discussion upon verification.

It was also the HOPE conference, where I joined Mastodon, appropriately, at hackers.town instance. It is an invite-only server - [@TheGibson@hackers.town](https://hackers.town/@TheGibson), its owner and administrator, decides who can join and talks to prospective participants before letting them in. If you set up your own homeserver, you can decide if you allow anyone to sign up, or only the invitees. This is how you can manage your own online community and, of course, precious hardware resources.

The most striking aspect of Mastodon, other than the lack of ads, is chronological timeline being the only option, and content warnings, or CWs. CWs are used for much more than what most people consider sensitive content. Many participants put every post (called a “toot”) behind a content warning. The origins of it come from the community understanding that each individual may find different kinds of content sensitive. Furthermore, it allows easier scrolling through posts one finds irrelevant. For example, as someone who does not live or vote in America, I can quickly scroll through posts hidden behind “USPOL” (US politics) warning, allowing me to easily navigate to content I find relevant.

Mastodon users generally insist on being called “people” or “participants”, rather than users, emphasising the human nature of the network. My subjective observation of the demographics is that, at the moment, many more people I see in my feed belong to underrepresented gender and sexual minorities, compared to other platforms I use.

People on Mastodon also pay attention to the profile page. Many make it clear they will not follow or accept a follow request from someone who does not provide any information about themselves. However, very few provide their legal name and their profile pictures often do not contain real faces. Furthermore, Mastodon comes with a (free!) user verification mechanism through cross-linking other websites with HTML anchor tags.

As the above principles align more with my own, it took me far less time to gain a similar number of followers on Mastodon as it did on major platforms, despite far smaller reach and none of my immediate friends using it. While my instance is mostly oriented around IT and otherwise technical people, it took me no time to get acquainted with people from other fields, and confirmed my long-held belief there is a deep connection between hacking and circus communities.

Mastodon, and fediverse at large, gives more ownership to the participant and more tools to express themselves in a way that represents their personality. It does not solve the problem of echo chambers and extremist content, if instance administrators are committed to them. Fediverse simply proposes a more libertarian attitude towards social media, and as with any libertarian solution, the responsibility for actions lies within the individual rather than platform as a whole.