---
title: 'Beyond the Hype: Will sustainable AI ever be a reality?'
date: 2025-12-11 09:36:00 Z
categories:
- Podcast
- Artificial Intelligence
- Sustainability
tags:
- AI sustainability
- artificial intelligence
- green AI
- environmental impact
- carbon emissions
- water usage
- lifecycle analysis
- federated learning
- smaller models
- energy efficiency
- data centres
- cooling systems
- renewable energy
- nuclear power
- hydroelectric power
- Hugging Face
- OpenAI
- Mistral
- French Tech 2030
- ARM processors
- cloud computing
- inference vs training
- sustainable technology
- tech carbon standard
- government digital sustainability
- ethical AI
- resource constraints
- decentralised AI
- local AI processing
- Apple M-series chips
- TPUs
- efficiency in AI
- podcast transcript
summary: In this episode, I'm joined by colleagues James Camilleri and Hélène Sauvé
  to explore the complex topic of AI sustainability. It’s a conversation that spans
  the environmental impact of AI, from carbon emissions to water usage, and examines
  whether the industry narrative matches reality. We also discuss what practical steps
  your organisation can take to make AI genuinely sustainable.
author: ocronk
contributors:
- jcamilleri
- hsauve
image: "/uploads/BeyondTheHype%20-%20blue%20and%20yellow%20-%20episode%2030%20-%20social.jpg"
---

<iframe title="Embed Player" src="https://play.libsyn.com/embed/episode/id/39343225/height/192/theme/modern/size/large/thumbnail/yes/custom-color/ffffff/time-start/00:00:00/playlist-height/200/direction/backward/download/yes/font-color/252525" height="192" width="100%" scrolling="no" allowfullscreen="" webkitallowfullscreen="true" mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true" style="border: none;"></iframe>

In this episode, I'm joined by colleagues James Camilleri and Hélène Sauvé to explore the complex topic of AI sustainability. It’s a conversation that spans the environmental impact of AI, from carbon emissions to water usage, and examines whether the industry narrative matches reality.

We delve into the trade-offs between energy and water, the role of lifecycle analysis, and how approaches such as federated learning and smaller models could help. We also ask whether “green AI” is more than marketing hype, and what practical steps organisations can take to make AI genuinely sustainable.

## Useful links for this episode

* [Technology Carbon Standard](https://www.techcarbonstandard.org/) – Open-sourced by Scott Logic

* [Balancing AI Innovation and Sustainability: Our presentation at HM Treasury ID25](https://blog.scottlogic.com/2025/11/12/balancing-ai-innovation-sustainability-hm-treasury-id25.html) – Oliver Cronk

* [Greener AI - what matters, what helps, and what we still do not know](https://blog.scottlogic.com/2025/09/16/greener-ai-lit-review.html) – James Camilleri

* [Introducing AI-related emissions into the Technology Carbon Standard](https://blog.scottlogic.com/2025/09/04/technology-carbon-standard-update-4-sept.html) – Hélène Sauvé

* [Mapping the carbon footprint of digital content](https://blog.scottlogic.com/2025/10/23/mapping-the-carbon-footprint-of-digital-content.html) – Hélène Sauvé

* [Sustainability in AI - why we must listen to the smaller players](https://blog.scottlogic.com/2025/11/19/sustainability-in-ai-why-we-must-listen-to-the-smaller-players.html) – Hélène Sauvé

* [Sustainability topic on the Scott Logic Blog](https://blog.scottlogic.com/category/sustainability.html)

* [Beyond the Hype: Can technology sustainability really make a difference?](https://blog.scottlogic.com/2024/02/19/beyond-the-hype-can-technology-sustainability-really-make-a-difference.html)

* [Beyond the Hype: Can we do better than 'carbon aware' computing?](https://blog.scottlogic.com/2024/06/03/beyond-the-hype-can-we-do-better-than-carbon-aware-computing.html)

* [Artificial intelligence threatens to raid the water reserves of Europe's driest regions](https://www.politico.eu/article/artificial-intelligence-threat-raid-water-reserves-europe-dry-regions/) – Marianne Gros and Leonie Cater, Politico

* [Mistral](https://mistral.ai/)

* [Green Tech South West](https://greentechsouthwest.org/)

* [Will new models like DeepSeek reduce the direct environmental footprint of AI?](https://rtl.chrisadams.me.uk/2025/01/will-new-models-like-deep-seek-reduce-the-direct-environmental-footprint-of-ai/) – Chris Adams

* [Government Digital Sustainability Alliance (GDSA)](https://www.gov.uk/government/groups/government-digital-sustainability-alliance-gdsa)

* [Hugging Face](https://huggingface.co/)

* [Empire of AI](https://en.wikipedia.org/wiki/Empire_of_AI) – Wikipedia

* [Computer Says Maybe podcast](https://www.themaybe.org/podcast)

* [GreenIO podcast](https://podcast.greenio.tech/)

* [V-Bucks](https://fortnite.fandom.com/wiki/V-Bucks) – Fortnite Wiki

## Subscribe to the podcast

* [Apple Podcasts](https://podcasts.apple.com/dk/podcast/beyond-the-hype/id1612265563)

* [Spotify](https://open.spotify.com/show/2BlwBJ7JoxYpxU4GBmuR4x)

## Transcript

*Please note: this transcript is provided for convenience and may include minor inaccuracies, and typographical or grammatical errors.*

**Oliver Cronk**

Welcome to Beyond the Hype, a monthly podcast from the Scott Logic team where we cast a practical eye over what's new and exciting in technology. Everything from AI to APIs, carbon aware systems, to containerisation, Kafka to Kubernetes, and message queues to quantum computing. We look beyond the promises that buzz and excitement to guide you towards the genuine value. My name is Oliver Cronk, Scott Logic's Technology Director.

Each month on this podcast, we bring together friends, colleagues, and experts for a demystifying discussion that aims to take you beyond the hype. In this episode, I'm joined by my colleagues James Camilleri and Hélène Suavé to explore the complex topic of AI sustainability. It's a conversation that spans the environmental impact of ai from carbon emissions to water usage and examines whether the industry narrative matches reality. We dig into trade-offs between energy and water, the role of lifecycle analysis and how approaches federated learning and smaller models could help.

We also ask whether green AI is more than marketing hype, and what practical steps organisations can take to make AI genuinely sustainable. I start by setting the scene for the discussion. This is something we've all we've been exploring quite a bit recently, particularly, particularly myself which is the topic of AI sustainability and yeah, there is a number of different dimensions, which we'll get into, but I think the large sort of portion of what we're going to be talking about on this episode, this conversation is going to be the perception that the technology providers put out about AI and some of the reality. So, what is being reported versus what isn't – will AI solve climate challenges – and of course, there is the sort of question marks about enabled emissions from using AI to do extractive things and perhaps environmentally harmful things.

So, I said this is a massive topic because sustainability covers so many areas and there's also so much happening in the AI space as well, which makes this quite challenging to sort of get your head around. But I think, we'll cover a spectrum of issues, but I think the social issues are probably ones we're going to have to park for this episode. Otherwise, the episode would be way too long.

So, we're going to, yeah, we're going to focus mainly on, the kind of environmental impacts, and this will build on some of our previous episodes that, that many of our listeners will have, will have, will have listened to, including the episode we recorded with, with Hannah Smith about Grid Aware, and also the conversation we had with Jeremy Axe about technology sustainability, which we recorded a while back now. So that's, for those that haven't checked out those episodes, I highly recommend those as sort of introductory episodes to the topic we're going to talk about.

And I'm really excited and actually heartened by the fact that mainstream media, the BBC and newspapers, have been reporting on the impacts of, AI and what, what its unchecked growth might, might look and what it, what it might do. 

## Introductions

So, yeah, let's, let's kick off, but we'll, we'll obviously get back into that. But before we do, let's, let's kick off with some introductions. So perhaps, James, if you can kick us off with an intro, please, that'd be great.

**James Camilleri**

Sure, I'm James Camilleri. I am a Lead Developer at Scott Logic, and I've been doing some research on this subject for, on and off the last year and a half, I suppose contributed to the Tech Carbon Standard and being a software developer for about years or so.

**Oliver Cronk**

Great. Thanks, James. And Hélène, welcome back to the podcast.

**Hélène Sauvé**

Thank you. I'm Hélène Sauvé. I'm a Software Developer in the Bristol office and I've been researching the environmental impact of AI since July this year.

**Oliver Cronk**

Brilliant. Thank you. And James, actually, I wanted to start with what you just touched on in your intro, right? Because, we've been wanting to do something in this space for a while, having Tech Carbon Standard, also doing AI projects.

## The narrative around AI sustainability

We've been wanting to sort of connect up the dots somewhat and go actually what is, what is the narrative around AI sustainability and what practically can, can, can we do about it? What can our clients do about it? And so perhaps if you can perhaps kick us off with a bit of, yeah, your, your work that you've been doing to look at sustainable AI research.

**James Camilleri**

So, we got the team together, which includes Hélène, a few months ago back, back in July. And the first thing we wanted to do was a literature review because when we spoke about this couple of years ago. There wasn't a huge amount of literature available. Not many people had done a lot of research because I think at the time we were still focused on the "how", and "can we", not what are, what are the effects of this, none of the "should we".

So, that's changed in the last few years. In fact, since we finished the literature review, I'm pretty sure there's been a pile of more papers published. I think the day I, the day I wrote a blog about it, someone went, "Oh, why didn't we include this one?" And it was, yeah, that, that came out a few days later.

But yeah, what we were trying to do was get an idea of the state of knowledge around this. And we were looking at what methods people were using to evaluate these impacts, what kind of tooling they were using, and whether or not they'd come up with any mitigation strategies around it.

**Oliver Cronk**

Yeah. And Hélène, you are also looking at this and looking at the, the kind of beyond the obvious things that, that, that are happening, right? Not just the energy usage, but also things water, right.

**Hélène Sauvé**

Yes, absolutely. So first, the first thing is following the review that James mentioned, we introduced a new category called Content to account for content and data that foundation models are trained on, but also, digital content as a whole. And as you pointed out, I personally came into the research looking for carbon, and I did find carbon, but I also found water. And it's an interesting topic because it is less talked about it's perhaps less obvious but it's actually a very pressing issue that needs to be, needs to be talked about alongside the carbon footprint of AI.

But the conclusion that, that I, I understood following that research is that both carbon footprint and AI footprint need to be thought together, they're not substitutable to each other and that in fact, optimising for one might hinder the other.

## The role of water in AI

**Oliver Cronk**

Yeah, it's, it's quite a kind of interesting relationship. And I think before we kinda get into this more, maybe we should just unpack why water, right? Because I think if you don't, unless how data centres work and know about the power grid, you won't necessarily know what the role of water is. So James, perhaps if you could help by sort of unpacking where is water involved in, in AI?

**James Camilleri**

Okay, so it's in two main, main places. The, the obvious one is the water cooling used in data centre. So, they'll take in an amount of water, pipe it around the data centre, along with other coolants to keep the machines nice and within operating temperatures. And then do something with that water.

Now what kind of depends on their water usage and as I understand it, there are two primary types of system that are used: open and closed. So, in an open system, you take in water from the water, the main water supply, you cool all your stuff, and then you dispose of it and you keep pulling in fresh water, and

**Oliver Cronk**

Maybe we should touch on the two, the two key ways that happens, right? Because you can obviously dump that water into a water course of some kind, which has environmental knock-on implications for any wildlife living in, in that water course. because that water's often very warm and, and the water may be quite cool that it's going into. Secondly, the other thing, I guess, is evaporative cooling, isn't it?

Where you have the, the cooling towers and you essentially just, just sort of create clouds that you by evaporating water into the sky to get rid of the heat.

**James Camilleri**

So, there's a couple of problems that this can cause, as you've just alluded to, changing the temperature of the water can have huge impacts on the wildlife. I, I know there was a place in France that I was told about that, they started having algae blooms, which then of course suffocated the fish, because they weren't meant, there wasn't meant to be huge amounts of algae in that part of the river. It also, potentially can deprive the local water system of a supply.

So, if you do this in a water-scarce part of the world that needs it for agriculture, it's possible data centre is actually depriving local farmers of the water they need to irrigate their crops.

**Oliver Cronk**

There's some specific examples of this happening in Spain and we can perhaps put a link in the show notes to those, because that's been quite a famous example in Europe. But yeah, this is happening all over the world, right where there is water scarcity. But sorry James, I jumped in because you were talking about the main, most obvious for those that perhaps know about data centres and know they need to be cooled down. But there is another one, which is less direct, isn't there?

**James Camilleri**

Well, before we move on from data centres, there's also the closed loop, which we should mention briefly as well which is essentially the, you take the water in and it stays more or less in a closed system. So, they'll pipe, kind of pipe it through, cool it, and then pipe it through again. And there's very little wastage in that, but it's a more expensive solution. So, not all data centres have got it, and it's got its own, of course it's still radiating, right, large amounts of heat and, and so it's not, it's not a silver bullet solution, but it's definitely better than the open water cooling.

**Oliver Cronk**

But I guess when you say better, it's probably better from a water perspective, but I'm guessing it probably uses more electricity.

**James Camilleri**

I imagine so. I haven't done enough reading about it because I don't…

**Oliver Cronk**

But I, but I'm pretty sure you were talking about the sort of trade-off earlier and there is definitely a trade-off going on between water and electricity, right? Some of the cheaper, from electricity use point of view, ways of cooling a data centre often involve wasting, effectively wasting or being more wasteful with water than not, is my understanding.

**James Camilleri**

Yeah, that, that's mine too. And this leads nicely into the other source of water usage that's less obvious. And that's the water usage at the power station. So, if you are using more electricity, the most power stations involve water in power generation at some point.

Most not all. And if you look at different forms of power generation, they have different water usages associated with them. So, so interestingly if you look at nuclear, it's got the lowest carbon emissions, but the highest water usage, because they have to pump all that water around, to keep everything at the correct temperatures, for everything to work correctly and to, and to do some of the transformation into electricity. So they, again, we see the trade-off between carbon and water, even within the power centre.

But of course if, if you've got a power centre that you now put a data centre next to and start pulling gigawatts of extra electricity, it's going to, the power centre will start using lots more water to go along with that. So, we call that the source water.

**Oliver Cronk**

And there's an obvious example as well, I suppose with hydro, hydro plants are, are using dammed water, right? So, if you want more power, you need to release more water down that dam, which means more water is going downstream. But I guess there are other power sources renewables, wind and solar, that obviously don't typically use water in their, in their operation. So, I guess there isn't always a correlation between the lower the carbon, the more, more water is used.

I think it's probably, in general, the correlation I would expect would be the more carbon intensive, the more water is used, because it's typically used by fossil-fuel-fired power plants. Because to your point, I, I used to work in energy, so I, there's this concept of thermal power plants, and the point is that you basically use heat to create steam, and that steam turns a turbine round and that turbine is attached to a generator, and as the turbine spins, the generator spins and creates electricity, right? That's how for many, many years power has been generated. It's just renewables have come online that, that, that change the game, but, wind, a wind turbine is exactly the same.

It's just spinning the generator itself rather than needing, needing a, you know, hot, hot water or hot, hot steam, sorry, to turn, turn the blades around. It's using the wind. So, I think sometimes some of these things require you to understand, a bit more about the energy system than the average person does. And the interconnectedness of, of these things, right?

So, it's tricky. But Hélène, I wanted to come to you next, because of course we've spoken quite a bit about nuclear and I know the French have got a lot of, cheap, abundant nuclear power, which is often why in Europe they're perhaps the place that, that people are picking for, for running AI. And I know Mistral's been a bit of a poster child, obviously a French AI model, and I, yeah, I wondered if you wanted to talk a little bit about the motivations I suppose that the French had for developing their own LLM.

**Hélène Sauvé**

Yes, of course. Yeah. So, Mistral is one of the startups that was selected by a programme in France called French Tech. It's an investment plan for innovative startups in strategic sectors, and AI included, but there's also cyber, cyber security, quantum computing and other sectors.

And the purpose of it is to build France sovereignty in terms of tech and other, other sectors and in, but also to increase economic attraction, of course. And I think that more broadly, it's also to build the sovereignty, tech sovereignty of the European Union. So, Mistral is a good example as other similar companies that drive innovation in tech whilst also meeting the requirements of the European Union.

**Oliver Cronk**

Yeah, it's, it's really interesting. I mean, I guess I slightly picked on you because obviously you're French for that question. But, and, and I wondered how much of this yeah, the, because I did also wonder whether the French are obviously very passionate about their language. And I, and I can, I have to be a little bit careful here because as an English person, because I'm incredibly lucky that English is generally used all, in a lot of parts of the world as the business language.

And so, I completely understand, other, other languages wanted to be quite defensive, but I got the sense that the, yeah, that the French being very protective about their language, wanted to perhaps have a, have a model that was French- language centric rather than English-centric. Because, let's, let's face it, Silicon Valley is often very English-first, in fact, American English, not even, the, the British form or, or other forms of English. So, yeah.

I wonder whether that played into it as well, do you think? Or is that just me being a, being a classic Brit and stereotyping French people?

**Hélène Sauvé**

I think that's possible. Yeah. I think maybe more than protecting the French language, it's also the attraction of a product that is made in France.

## Updates to the Tech Carbon Standard

**Oliver Cronk**

Before, yeah. Before we move on though, you, we, we potentially skipped over something quite important. You mentioned some of the updates you've made to the Tech Carbon Standard. I wonder if you could talk a little bit more about those.

**Hélène Sauvé**

Yes, sure. So, when we made this latest update of the Tech Carbon Standard, we introduced AI-related carbon emissions. And in order to do that, we looked at the different actors and also the different scenarios of where AI is used. And that includes training, pre-training a foundation model, fine-tuning it, but also self-hosting and of, and of course, the case of inference, so querying an AI model.

As I said, we introduced a new category called Content. And we also included new practical guides on how to reduce carbon emissions. And credit to my colleague, Sarah, who wrote those guides. The guides introduced are on how to reduce carbon emissions in AI, but also how to reduce carbon emissions in testing.

## The difference between training and inference

**Oliver Cronk**

Great. And James, on that, I wanted to come back to you to talk about the difference between training and inference, because I remember that was quite a prominent thing out of the research that you both, that you all, all of you working on this came up with, right? Was this sort of awareness of the difference and perhaps some of the myths around it.

**James Camilleri**

Absolutely. I mean, I'm not sure that there are myths as such, but, I think the story, yeah, perception has well, perception and reality has changed a little bit over the last six months to a year, I'd say. So, when LLMs first kind of made the big time. There was a, there was an implicit understanding that all of the energy, the bulk of the energy was being used in training, right?

because I mean, intuitively that's true. It takes many hours and many thousands of documents and a grid of GPUs and whatnot in order to train a model. And that's going to, that's going to soak up a lot of electricity. But what's happened is over that time with the AI hype and the AI bubble and all the rest of it is the uptake of these services has been massive.

And there was a really interesting paper where they had a look at, at the cost of making an inference at, a query to an LLM. And more specifically, the kind of query, because not all queries are created equal, right? So the difference between generating words of text and generating an image is quite different in the amount of processing power. And also, you get a difference across how big is the model, how many parameters was the model trained on that, that has an impact.

There's a few different aspects to how this is done and a couple of the papers we found made a good job of, of splitting those up and had a good methodology for measuring them. But the conclusion at the end of it was that we've hit the point now where inference is dwarfing training in power consumption, simply because training is kind of a one-off cost. So, it's a big hit right at the beginning. It's your big investment, but inference happens constantly.

So, I think I, I read something that this summer ChatGPT was processing something like 2.5 billion queries a day. So, even if it's only using a, a teaspoon full of water, how much is 2.5 billion teaspoons of water?

I can't actually wrap my head around that number about how much that must be. I can't visual it.

**Oliver Cronk**

Yeah, the scale is pretty staggering. Right. And it's interesting sort of thinking about the different sort of aspects of the AI sort of journey I suppose, or supply chain or value chain. And we've had some recent conversations with colleagues of mine on the GDSA, Government Digital Sustainability Alliance AI Working Group.

So yeah, and, and I think that also kind of drew out the point about lifecycle analysis as well, didn't it, James? That's sort of an interesting sort of piece that okay, you need to make sure we don't overlook because there's some sort of fundamental sustainability approaches that are really important to stick to. And this is where I think it's not helpful when the cloud vendors sort of talk about AI being sustainable, but they often say that just through a lens of talking about the operational energy. So, the fact that they might have renewables or they've purchased renewables or invested in renewables, that perhaps allows them to claim that the energy that they're using in that data centre is, is low carbon.

But in some cases, it's sort of more of an accountancy thing rather than a full lifecycle analysis type thing, isn't it?

**James Camilleri**

I mean, so most of the studies we looked at used some form of lifecycle analysis, which is, which makes perfect sense because I, I mean, it's, it's a tried and tested way of looking at a full impact of whatever the system under scrutiny is. So, for those who don't know a lifecycle analysis goes right from dragging the materials out of the ground through to manufacturing, distribution then the, using the, the product, whatever it is, and then finally disposing of it. So it, it's proper cradle to grave kind of way of splitting up the problem and looking at each section. The problem is, is that when you're looking at tech, especially, although I suspect almost every industry has this problem, it's really hard to get data on that whole spectrum because we only exist in this tiny part of it, and often we don't see where our goods go after we manufacture them, or after we write software, we don't know much about, in the grand scheme of things, about where it's run, how long it's run for and that kind of thing.

And it's quite hard to get data on all of those stages for even the laptop that, and the microphone that we're using right now. So, sometimes it does exist, but how, how reliable is that data?

## The potential of smaller AI models

**Oliver Cronk**

Yeah. And that kind of strikes a chord with the conversation I had at Treasury. And this is definitely something we can put in the show notes is the talk I gave, which talked about sort of the importance of measurement. And of course, I talked about Tech Carbon Standard being one possible way of sort of having a standardised approach to, to measurement, but also the importance of not losing the, the, the human-centric sort of approach.

So, I think there is also a general theme, I suppose, that I'm seeing, I'm sure others are seeing as well where it's trying to justify these very expensive investments, these quite brute-force investments in the fact that we can just replace a whole load of people in the future, or some unspecified point in the future, we'll be able to replace people. I think the reality for those that work in technology is that we know that that's just fairly unlikely, particularly with the current generation of, of technologies, right. Large Language Models are really impressive, of course they are, but they are largely language mimickers, they're kind of reconstructing content, which can be very impressive, but it's not really intelligence and to sort of think that we can just hand over decision-making and various other tasks that are quite complex, particularly those in, high-risk areas, highly regulated areas, to think we can kind of do that is, is, is a bit of a fallacy.

So, part of my talk track there was sort of talking about being more human-centric and empowering people to pick the right tools for the job. And I guess this starts to kind of come on to sort of solutions, right James? in terms of thinking about using smaller models or using models that are more refined to the task at hand.

**James Camilleri**

Yes, so, one of the, one of the things that came out of the research that we found was that using smaller models that were more targeted in their capability, used up less energy they, they take up less to train and they also take up less to infer because they've got a smaller knowledge base to draw on. And, if you think about it, that's intuitively true if you've got a system that's made for answering questions about Harry Potter; it doesn't need to know the capital of Canada or have read the complete works of Shakespeare because, it's outside of the, the knowledge that it requires to answer those questions. And, equally with programming tools, if it, if it, if it's seen enough examples of good programs, it doesn't need some of this general knowledge that goes around it.

So, the idea of using LLMs for, for simple code generation just seems a, a strange direction to take it, given the, the extra power required in the training and, more importantly, in the inference. Because you could make the argument that the LLMs, the Large Language Models have already been trained so that that ship has sailed; that carbon is embodied, right? So, using it for as many different things is a, is another way of looking at it, because then you're not repeating the training cost, but because the inference cost is also higher, it becomes a scale problem.

**Oliver Cronk**

This feels to me a classic sort of trade-off, and "it depends" type situation, right? Is it worth creating a specific model? Well, it sounds it depends on how much that inference is, is the inference going to of impact, going to wash its face, and so on and so forth. But Hélène, was there anything else in the research that sort of struck you as quite interesting or sort of surprising?

**Hélène Sauvé**

Yes, when I, the, the question of small language models compared to large language models totally makes sense and, and I to compare it to commuting by plane to work when it's a -mile journey. It's absolutely not necessary and it's not efficient at all. Another important element that I took away from the research was questioning the use of AI in the first place. And that AI shouldn't be the default tool.

We need to carefully think about when and how it actually benefits the situation.

**Oliver Cronk**

So, being more conscientious about its use. Yeah, I know. I really that. The other thing, James, that I've been looking into, and I think we've talked about this before, we did the Green Tech Southwest event, that again, is something we can put in the notes, and we were talking about, about the sort of financial sustainability, right?

And I think the cost of these models is potentially going to be maybe what drives better behaviours, because I just personally can't see that the economics stack up. And so I'm kind of hopeful, and I don’t know about you, do you want to introduce your perspective on this? that the financial, model and the need for cost saving might drive reduced impact because they'll have to drive for efficiencies.

**James Camilleri**

Yes, absolutely. At the moment, the cost of AI has been massively supplemented by the investment that's going into it, the billions that are going into it. So, almost everybody's operating at a loss. Now some of the agentic AI tools I've been using recently have - I naughtily call them V-Bucks – but, they're, they're, meant to be, they're some kind of virtual representation of how much processing power you're using.

And they could be, they're used partially for billing and also to give you an idea of the context size, so that if it gets too big, it encourages you to create a new session so that you don't get context wrong, where the, where the LLM kind of forgets things that you've already told it. And, essentially I think, I think these are kind of good to, to see. And obviously while the cynical bit of my brain is, oh yeah, that's a nice way of, making some money, By, by, by just having this counter go up, it also forces you to actually think about how much you're spending and how much you are expending as far as carbon and water's concerned. If I had one ask of these services is, is that they make the environmental impacts transparent as well.

If they can put together a V-Buck to represent the billing, then I don't see why they can't put together something similar for carbon and water. I do think that companies are also very cost-conscious, and I actually think this extends beyond AI. If you look at cloud usage and data centre usage, generally the more you're spending, the more you're using. It, it is a rough correlation that, you might not be able to, compare your spend to someone else's spend.

Because the rates might be different, but certainly the more you spend, the more processing you are using. So, by actually looking at your usage and trying to lower your costs, a natural extension of that is you should normally lower your environmental impact as well. I don't think it'll always be true, but it's a decent rule of thumb.

**Oliver Cronk**

Yeah. Yeah. No, this, it, it's a bit using cost as a proxy. It doesn't always work, but if you don't have any other data, it's not a bad place to start.

You've got something that you can use as a metric, but it's not perfect by any means.

**James Camilleri**

Especially when it results in less usage of, you know, being able to shut down cloud appliances and things that the…

**Oliver Cronk**

…are unused. Yeah. Or…

**James Camilleri**

…yeah, the, yeah, exactly. So, it's, it, it again, it's intuitive that by using less, you emit less.

## Running AI locally on personal devices

**Oliver Cronk**

I wanted to talk a bit about the sort of shift that I also sort have been speaking about recently, which is this sort of move from big, centralised sort of compute because you talked earlier, James, about, the thinking around training and thinking about inference. Now, clearly for, for those that don't know, training AI models is a lot easier if you have a big, centralised compute cluster, it's just a lot easier. It's challenging to try and do that in a distributed setting, but what strikes me is a lot of the sort of stories I'm seeing about sort of Apple in particular, they have some amazing capability on their devices for running AI locally. the M4 and M5 series of chips are particularly, very good at running AI models.

And so, I suppose I wanted to chat to you both a bit about this sort of, you know, running AI locally, potentially being, a step in the right direction. And again, it's a trade-off, right? I'm sure there'll be other things, but what occurs to me in this space is that as per our work with, with clients on the Tech Carbon Standard, 50–60% of, of an organisation, organisation's emissions can be from that hardware purchase, typically the end user hardware that, that, that they're buying if there are a large organisation. And so, we can find more ways to sweat that asset to get more, bang for carbon buck as it were.

Wouldn't that make sense? So, wouldn't it be great actually if we can run some more of the AI workload inference locally, because that's, existing hardware we already have? We don't have to build more and more centralised hardware if we can actually leverage hardware that's already going to be on people's desks or in people's hands. And then the other thing on this is the sort of diffuse nature of that power.

And Chris Adams at Green Web Foundation talks a lot about this, that actually part of the problem we have with the large data centres, particularly in Europe and the UK, is getting a new grid connection for a big data centre is nigh-on impossible, right. It's, it's not impossible; it takes many years, though, to get those grid connections. And we talked earlier about water being a sort of tricky resource to sort of manage where we might be taking water and giving it to a data centre, or, or, or agriculture. There's a similar thing here around energy, if we approve a big data centre or two, that might mean we can't approve, , housing development because of the electricity that, there isn't enough to go round, particularly in the southeast of England, the South England.

So, I kind of wondered, yeah, what, what your thoughts really are on, things Hugging Face and the sort of potential shift to using open source models. Either of you want to sort of kick off on that one?

**Hélène Sauvé**

Just when you were talking about centralised training, part of the research that we did was also around, federated learning. So, basically a move away from centralised learning and have more federated learning. So, which means training AI models on data distributed across millions of remote clients which also, in turn benefits data security.

**Oliver Cronk**

Yeah, because I guess if you can run, keep the data where it, where it's stored already, there's less concerns about that data being sort of put in places that are more public cloud and yeah, I think there are, there are a whole bunch of other benefits. I'm sure there are also drawbacks as well. Certainly, yeah. That there are more challenges sort of coordinating training when it's, when it's federated.

But yeah. I mean, James, what's your sort of take, do you, do you see a sort of medium- to longer-term future where a lot more AI inferences running on people's devices rather than in the cloud?

**James Camilleri**

Yeah, I mean. If we look historically at technology, it's an obvious direction for it to move in. So, if you look at, computer graphics as, as, as a really great example, back in the nineties, if you wanted to produce really high-quality 3D graphics which rendered in real time, you needed something a silicon graphic station. This was, a huge piece of hardware that they used to run at movie studios and the, in order to do special effects.

And the idea of doing something that on a home computer was just Space Age, you know? Whereas then we brought out graphics cards that could produce higher quality things and the processes got faster. So, we could do those 3D calculations, 'Doom' came out and, and then after that you end up with, dedicated 3D cards that just take that on. And then past that, we integrate the 3D cards into the main graphics card.

So, it becomes one thing again. So as time goes on, we, the industry gets better at packing this stuff into, moving it out of the server and into the home. So, I think it's only a matter of time before we see something an AI card on the shelf you can just plug into your PC.

**Oliver Cronk**

Which I guess is not far away from where we are with GPUs. right now, I'm, yeah, I'm, I'm running quite a bit AI locally, but I'm aware not everyone has, has a sort of mid- end or high-end, gaming computer. That's, that is a bit of a niche and it's a bit of a privilege, quite frankly to have that. But I think, but I guess my point is it's going to be more of a, just, every phone will have that kind of capability, because phones are designed to be as efficient, I mean, they're very powerful, right?

Our phones, right? They've got more compute power than, than a lot of mainframes and, and supercomputers of, of, of past eras. But they're also designed to be super-efficient, so they don't drain the battery. So, there's an interesting sort of, it's the one area, I suppose where there has been more focus on efficiency.

I think there's a danger that, as developers sometimes we trade off developer efficiency with machine efficiency. I think we do that a lot. But in the mobile space, there, there is in things ARM processes and TPUs and other things, there's, there is sort of a general push towards efficiency, because I think people have realised, wow, this workload is one of the most inefficient power-hungry workloads we've ever created. We better get creative about how we run that, that workload.

## The current AI sustainability narrative: Hype or not hype?

Anyway, we've been chatting. Quite, quite a bit here. And I wanted to sort of start moving us towards the kind of classic, is it hype or is it not hype? So do, do you think the kind of sustainable AI as it's, I suppose currently being sort of touted is, is, is hype and if you think it is a hype, if you think it is hype, do you think it'll always be a pipe dream, or do you see signs that can be made more sustainable?

And Hélène, do you want to have a go doing that first?

**Hélène Sauvé**

Sure. Yeah. So, I've been wondering if sustainable AI is, is actually possible. And I think to answer that question, we, we need first to understand the, impacts AI has on the environment and on society.

And we also need to ask ourselves what future we envisage for AI and what, what role we want AI to play in our, in our lives. I do think that putting profit before people will always lead to unsustainable practices. But, but I also, I'm, I'm also hopeful that, with all the research that I've done on different ways of doing AI and one bit of research being about doing AI frugally can lead to, more, more sustainable more mindful ways of, of doing AI.

**Oliver Cronk**

So, you are optimistic, but do you think the current sort of way AI is being pitched as sustainable, kind of, green by some of the big tech companies? Do you think that's, that's hype?

**Hélène Sauvé**

Yes. So I, I don't think AI is being developed currently sustainably, the demand for new data centres at the moment cannot be met in a sustainable way. I, I wouldn't say I am, I am hopeful, but I know that there, there, there is there are people working towards alternative ways of doing AI. So, it depends on whether we, we build AI in resource-constrained environments that benefit people, or if we just carry on building AI for the benefit of the few at the expense of people and the planet.

**Oliver Cronk**

Yeah, no, I'll, I'll come back to that in a minute, when I wrap up, the point about constraints, because that's a really important point, which we've not talked about yet. James, what's your take?

**James Camilleri**

I do think that there's a lot of hype around this. More specifically, what I look at is the way that it's being reported. I mean, Hugging Face are amazing because they've got these open source models. They've got a published methodology as to how they measure the environmental impact of them, and they've got a system whereby you can upload a model and test it, which I think it, to me, that's the current gold standard.

We contrast that with the private companies doing it, the likes of Open AI and Grok and things that. And they either try not to tell us anything at all or when they do it's soundbites that lack context and method. So, there's no real way to judge how impactful those systems are because they're not giving us enough information to actually make an informed decision as consumers, which I think is deliberate.

So, that part I definitely think is hype. I think the other strand of this is that you often hear that AI will pay for itself environmentally by somehow saving the planet, that it'll process some workload, that will make life better. And what, that, that's plausible. But if there's one thing we've learned about LLMs in the last months, it's that you have to word your requests to them very, very carefully.

So I, I think it's all, all very, dependent on somebody actually using this technology in that way, in a purposeful way, I, and I do think there's, I do think there's some real opportunities there. For example, with code generation, we could actually start building in rules that encourage the AI to generate sustainable code. At that point, maybe the offset of more systems being run in a more efficient way might offset the inference of generating that code in the first place. But again, without methodology and openness about the costs, how do we make that value choice?

**Oliver Cronk**

And my worry at the moment is, unless you prompt them to say, give me the most sustainable, efficient code, they're just going to give you the average of what's in their training set. Right. And even if you ask them for the, for the, for more efficient code, they, that's just going to, it is not surely going to give you the right answer, because these things are just doing it based on word, you know, probability rather than truly understanding the concept of what it means to write sustainable code. But anyway, that's a whole other rabbit hole, we don't have time to go down.

So, I did want to come back to that point about constraints because I think it's a really important point that Hélène was touching on. And again, it's part of the conversations I've been having with people, which is to reframe constraints and regulation. I think often regulation and our "lack of abundance" in air quotes in Europe and the UK is often seen as a negative. I actually think it's not, I actually think it's what keeps us quite conscientious – quite focused on trying to do things efficiently.

I think it's, we have a massive scientific community in the UK, a big engineering community, and I think, we pride ourselves on, on making things efficient. ARM is a great example of this, right? ARM came out of the UK and ARM processes are super-efficient processor designs. So, I think this constraints thing is really interesting, but my take it, it won't surprise to hear, is very similar to the, to the pair of you, right?

I think there is an awful lot of hype around sustainable AI. A particularly bad example I saw is, if you move your AI workloads to cloud, I won't name the vendor, you can go and find it out if you want to, the, the workload will be up to % greener if you run that AI workload on cloud rather than on-premise. And when you dug into it, the on-premise example was just crazy. It was just, a really, really bad example.

And the cloud just looked looked amazing because they cherry picked the most low-carbon region and all that sort of stuff. So, the reality actually that other people in the GDSA community has called this out as well as it can actually be worse. It does, it's not guaranteed that moving AI workload or any workload to the cloud will make it greener. And we touch, I think we've touched on that on previous episodes of the podcast.

Anyway, this is a topic that's dangerous because I'm very passionate about it and you are both very knowledgeable about it as well from the work you've been doing over the last few months and years. So, there's a danger we could go on forever, but unfortunately, we can't. So, we'll bring the episode to a close, but before I do, any other last points or things that you wanted to sort of mention before we wrap up?

**James Camilleri**

Yeah, I think I think the other thing that came, kind of came out, of our studies of the last few weeks is that when you are designing a system, and this, this really applies to any system, right, but it, it just seems to be especially important to AI is that you need to look at it from different perspectives. So you, you need to try to right-size the tool at hand, and you need to try and understand the consequences of using it. So, looking at not just the immediate effects that this is going to have on your bank account and on your IT estate, but also what effects is this going to have upstream and downstream from where you are? How is this going to affect the local area?

How's it going to affect the power grid? There are all these questions, and I'm not saying you need to consider absolutely everything, but just shifting that perspective for a moment and taking a little while to consider how this impacts end users and their lives. Or upstream vendors and what they're supplying could cause you to make a decision that makes a big difference.

**Oliver Cronk**

Yeah. The one thing I guess I, that we, we should probably touch on just briefly before we do close, is that there are also sort of recommendations we've come up with, right? So there are, we'll definitely point to those in the show notes because whilst we've spent a lot of the episode talking about the challenges, there are also things you can do, well we've touched on some of them, right? choosing smaller models and thinking more conscientiously about how you use AI and all that sort of stuff.

So, we'll make sure we include some links to that, so it's sort of balanced. But look, with that, thank you both. That's been a great conversation and hopefully those of you listening have found it interesting and yeah, thanks so much.

**Hélène Sauvé**

Thank you.

**James Camilleri**

Thank you.

**Oliver Cronk**

And so that brings us to the end of this month's episode on AI sustainability. If you've enjoyed this discussion, we'd really appreciate it if you could rate and review Beyond the Hype. It'll help other people tune out to the noise and find something of value, just this podcast aims to do. If you want to tap into more of our thinking on technology delivery approaches and tech sustainability, head on over to our blog at scottlogic.com/blog.

So, it only remains for me to thank Hélène and James for their insights and to you for listening. Join us again next time as we go Beyond the Hype.