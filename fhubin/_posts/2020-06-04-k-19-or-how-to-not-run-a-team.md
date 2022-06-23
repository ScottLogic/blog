---
published: true
author: fhubin
layout: default_post
category: Delivery
title: K-19 or How to not run a team
summary: >-
  In this article, I would like to look at some traps that often impact
  performance in the workplace and outline some efficient ways to ensure your
  team is doing a good job.
tags: delivery team empowerment
---
In this article, I would like to look at some traps that often impact performance in the workplace and outline some efficient ways to ensure your team is doing a good job.

## Setting the scene
The other night, I watched the 2002 film _K-19: The Widowmaker_ ([imdb link](https://www.imdb.com/title/tt0267626/?ref_=tt_urv)). I had never heard of it and, upon reading it was a drama about a Russian submarine based on real events, I thought it might be the story of Kursk, the Oscar-class nuclear submarine that sank in August 2000. Had I known Kursk was K-141, I would have understood that K-19 was probably a much older story.

As it turns out, K-19 was a Hotel-class submarine. The story takes place in 1961, at the height of the Cold War and, although the boat was only decommissioned in 1990, its early days were not much more positive than the last days of Kursk.

To say it is a brilliant film would be an overstatement, but it is not bad. It certainly puts the spotlight on a piece of history that is obscure -- or at least, one I was not aware of at all.

How is this relevant to this blog?
Am I going to talk about technology?
Am I a closet film critic?
Is this some sort of morbid History crash course?
Are _The Hunt for Red October_ and _Das Boot_ not better submarine films?

Hold on! Hold on!

I want to focus on the crew of the ship. How they work, how they react to situations and, especially, how they are managed. I want to draw a perilous parallel between a submarine crew and a software delivery team, between a navy captain and a team lead.

But first, I need to give a little more geopolitical context.
By the way, if you have not seen the film, I will spoil it heavily below. You have been warned.

## Historical context
In 1961 the Soviet Union and the United States are competing for the military supremacy of the world -- the nuclear arms race. Each country wants to have more, bigger and deadlier weapons than the other. They also want to have those weapons _before_ the other one does, and to demonstrate superiority. Enter posturing, parading and propaganda, all in the name of deterrence, which is really another word for intimidation. "Look what I could do to you if you threaten me."

So, when the Americans successfully test intercontinental ballistic missiles, the Russians want to prove they are as advanced by launching a new type of submarine that can bring their (admittedly-shorter-range) missiles within firing range of the USA. Oh! and they want to live-test a missile so their advance can be witnessed by the other party.
With that context in mind, timing is of the essence for the Soviets: the sooner they launch, the sooner they deter potential threats.

## Cutting corners
The submarine is not ready, however. Wikipedia ([link](https://en.wikipedia.org/wiki/Soviet_submarine_K-19)) tells us the following:

> The boat was pushed through production and rushed through testing. It suffered from poor workmanship and was accident-prone from the beginning. [...] [Whilst it was being built,] two workers were killed when a fire broke out and six women gluing rubber lining to a water cistern were killed by fumes. While missiles were being loaded, an electrician was crushed to death by a missile-tube cover, and an engineer fell between two compartments and died.

Early tests were not much more positive:

> In January 1960, confusion among the crew during a watch change led to improper operation of the reactor and a reactor-control rod was bent. The damage required the reactor to be dismantled for repairs. [...]
After surfacing from a full-power run, the crew discovered that most of the hull's rubber coating had detached, and the entire surface of the boat had to be re-coated.
During a test dive to the maximum depth of 300 m (980 ft), flooding was reported in the reactor compartment [...] It was later determined that during construction the workers had failed to replace a gasket. In October 1960, the galley crew disposed of wood from equipment crates through the galley's waste system, clogging it. This led to flooding of the ninth compartment [...]

**What is the conclusion of the above?**
Because of various pressures, corners are cut.

In order to meet an impossible deadline or stick to a predetermined budget, deciders may ask for "a simpler solution" to be considered, that is to say: postpone what is not strictly and immediately necessary. Sometimes, when it is carefully thought through, it is an option (Eurostar did it, as we saw in a previous article -- [link](https://blog.scottlogic.com/2018/10/08/date-driven-delivery-vs-delivery-driven-dates.html)). Too often, limiting scope is seen as a failure. Instead, deciders hope to motivate the delivery team to meet an unrealistic deadline by adding pressure.
Trying to fix scope, time and cost has an impact on quality. Compromising on quality is often perceived to be the only way to deliver the scope in the given time. That is known as cutting corners.
Delivery teams will be tempted to cut corners, if given firm deadlines, hoping that those cut corners will be addressed later on. They seldom are, but that is not the point of this article. The result is a demotivated team, not proud of the work they have done, as well as a product whose quality is perhaps not adequate.

## Team changes
What happens in the film, after those accidents? Mostly, the crew is blamed for doing a poor job, and central command sends replacements, for the lost manpower or otherwise. Most notably:
- The reactor engineer is replaced with a fresh-out-of-school lieutenant who has never seen live operation
- The on-board doctor is replaced with one who is prone to seasickness and has no knowledge of diseases caused by exposure to radioactivity
- Captain Vostrikov is put in charge of the submarine, though his predecessor, Captain Polenin, remains to lead the men, under the command of Vostrikov

Those personnel changes pose several issues.

**Firstly**, at this point and compared to the aspirational timeline, the submarine is already late.
Most, if not all, of the accidents listed above were caused by a team rushing to try and reduce that lateness. Losing experienced crew members will inflict another delay: as much as we try to avoid key-person dependencies, it is misguided to believe that when an expert A disappears, another expert B is ready to step in and carry on seamlessly where A left. A has been intimately connected to the project for a long time, living and breathing it to _become_ an expert. B, without such first-hand experience, simply cannot expect to walk in and perform as efficiently immediately. B has yet to become an expert.

**Secondly**, bringing in new crew members is going to make delivery later.
Losing experts is a source of delay, but replacing them, or even augmenting the existing crew with less-experienced resources, will inevitably bring further delays, as those new resources will need to be trained and integrate an existing team. At the same time, repartitioning of the work will also consume time. As Brooks' Law has taught us: "Adding manpower to a late [...] project makes it later." Fred Brooks, _The Mythical Man-Month_, Addison-Wesley ([Wikipedia link](https://en.wikipedia.org/wiki/The_Mythical_Man-Month))
The more complex the project, the longer the delay caused by staff changes; learning is simply longer. Software is particularly prone to that, as is building a nuclear submarine -- hardly simple activities.

**Thirdly**, the change of management will bring yet another delay.
A crew will be used to certain ways of working and a certain management style. Changing that by bringing in new management (in this case: a new commanding officer) will delay delivery, as the team adjusts to working for a new captain they do not know at all and to new ways of working they are not familiar with.
I have seen managers in such a position employ an authoritarian approach and claim that they are "not there to make friends". That may be so, yet it is much harder to obtain positive results from a team that has no respect for its leader. That respect is earned and based on trust -- trust built over time.
In our film, rank tells the men whose orders to follow. It does not make them respect _the person_ in the uniform, or work as efficiently as possible.

The situation in the film is made even more complex and strange by the fact the previous captain is retained to lead the crew, adding an additional layer of management. That may be welcomed by the team, who are preserved from change and can rely on someone who knows how to handle them, yet that someone is another cook. Too many cooks spoil the broth, the saying goes, and indeed: the crew (and Captain Polenin himself) are torn between Vostrikov’s orders, received from Moscow, and their loyalty to their old commander.
Polenin is the type who tries to do the right thing and looks after his men, no matter what the consequences to him might be -- "my boys," he calls them. In return, they would follow him to hell and back. He has built a trusting relationship and knows he can rely on the crew.
Vostrikov clearly understands the challenges of the situation, but he has his own agenda: clear his reputation, inherited from his father, who was sent to the gulag. He is therefore eager to please the politicians and his hierarchy, to prove his reliability and loyalty to the party. He seems to see losing crew members’ trust (or crew members themselves) as an acceptable collateral damage of that goal.

We could spend a long time debating whether Vostrikov was put in charge precisely because of his personal circumstances, precisely because he could be manipulated into pushing the politicians' agenda in order to progress his own, but let us not get sidetracked.

In truth, various, sometimes contradictory orders frustrate a team and prevent them from performing well. New orders or instructions are given in the name of speed and efficiency, but ultimately have the opposite effect: they confuse the crew by disregarding standard safety and security rules.

**The take-away of the points above** is that no-one is irreplaceable, but equally, no-one is seamlessly interchangeable. One of the most basic and fundamental things to learn when managing teams is that a change in team fabric, _any_ change, will alter team dynamics and performance. It will actually bring productivity down, at least for a time.

Do I mean by that that a team must not be changed? Or that it must not be changed in case of a delayed project?
Certainly not. There can be times when an element in a team is not performing for whatever reason. It needs to be addressed. Their direct lead should do that -- it is their job. The best thing to do is to ask the team what they think about it. Most of the time, they will fix it themselves (e.g., by training the poor performer). If they cannot or will not, then anything can and should be undertaken, from a calm discussion to performance review and removal, if necessary. It is a team game. If there is no room for a tyrant, there is equally no room for a team member who does not contribute to the team effort. The disruption caused by the removal of a poor performer is nothing compared to the damage the presence of a poor performer causes in a team.

Not every assignment comes with detailed files on each team member. How does a manager know in advance who will perform well and who will not?
They do not know. Files rarely tell the whole story anyway. Someone performing poorly in one team might become a star if the team fabric changes -- and vice versa. Remember: any change in any team will modify the team dynamics to a degree. A change in management will do so too, probably more acutely.
A new manager has to give every team member the benefit of the doubt and give some trust. Whilst the relationship is being built in particular, it is the manager's responsibility to observe, talk to the various team members and address shortcomings immediately, if that trust is squandered.

When a leader removes a poor performer, it sends several messages to the team. Firstly: I am here to help you; secondly: complacency is not your friend; thirdly: you are the experts, but no individual is more important than the team; fourthly: my rules.
Whether those signals are received like a breath of fresh air or a cold shower, the effect is positive: those who accept the new rules raise their game and contribute to the team's growth; those who do not accept the new rules end up leaving. Soon enough, the team reaches a point where the leader knows it can be trusted. The team also appreciates its own capacity and ability more accurately, which fuels self-confidence, helps estimate reliably, and, ultimately, deliver.

## The death march
In the film, Vostrikov confronts and criticises his crew members, openly doubts their skills, belittles them and pushes them to the limits ("to see where those limits are," to paraphrase him). In another context, his behaviour would probably class as bullying, but because they are soldiers, the men obey. There is no respect or trust there, however.

He submits the crew to incessant fire drills (literally) and deep-diving tests. His point is to see how the boat and the crew will react in extreme conditions, such as a war. Doing so prior to gaining the crew's respect, Vostrikov’s main achievement is to be disliked by the crew.

Vostrikov is clearly "not there to make friends," a phrase many of us will have heard in the corporate world too. What he is seemingly oblivious to is how detrimental that attitude is to the overarching goal: the crew has no incentive to do things as best they can, since that would mean serving someone they neither like nor trust, but hate. Team morale goes down and whatever trust was there is scorned; respect and loyalty are absent.

The crew’s hatred eases somewhat when they successfully fire a missile from the Arctic, thereby achieving the main objective of their mission. They celebrate that milestone by playing ball on the pack, around the emerged submarine.
Hitting a milestone is not successfully delivering a project, though, the same way winning a battle is not winning the war. Vostrikov drives the crew to short-term success, but he does little to invest in a constructive and productive relationship that would ensure long-term results. In that way, he fails.

There may be circumstances in which hitting a single milestone represents success, and where damaging a team is an acceptable consequence. In K-19, the politicians may think that testing the missile acts as a deterrent, which was arguably the whole point of the enterprise. That would make such a death march ([Wikipedia link](https://en.wikipedia.org/wiki/Death_march_%28project_management%29)) justifiable.
In most cases, it is not that simple, however. One will need a functional team further down the line. In fact, Vostrikov too will soon need one...

## The accident
The crucial part of the plot takes place after all that. It comes in the form of a fault with the nuclear reactor's cooling system. The reactor is no longer cooled and it heats up uncontrollably. Radioactive steam propagates through the ventilation system to the whole ship, irradiating everyone on board.

The cause of that failure is a string of earlier mishaps that can be summarised as consequences of cutting corners (technical debt, we would call that in IT). When it happens, help cannot even be called: the long-range radio system is damaged.
Vostrikov designates volunteers to build a makeshift cooling system for the reactor, which means welding pipes in the reactor room, where the radiations are most nocive. For protection, the voluntold will wear chemical-warfare suits... which are ineffective against nuclear radiations. The anti-radiation protective gear was not delivered on time -- cutting corners, remember?
Aware that this is certain death for the designated men, Polenin insists on leading the repairs. Vostrikov refuses the offer.
The men do what they can and the repairs are efficient for a while. The patch does not last, though, and, as they make their way back, it becomes clear they will not reach Russia.

**What does that tell us?**
Taking shortcuts to meet a deadline and hit milestones will lead to breakages and faults needing urgent repairs. The cost of those breakages and repairs (labour, outages, reputational damage) is very often higher than the value generated by an early release date. Cutting corners and allowing technical debt to build up is a very-high-interest loan indeed.
In the film, launching the submarine before it is ready allows the party (the client) to flex muscles in front of the Americans (the competition). But the associated risk is to lose a submarine and its crew -- the very muscles the client wants to flex.

Does that mean a product should not be launched until it is finished? No.

Firstly, a product is never finished, as long as it is used. It will evolve, as the needs evolve.
Secondly, Agile is all about launching a product early to generate value as soon as possible.
There are two important caveats to that, though.
1. Besides releasing early, Agile also advocates releasing _often_. That means issuing new features and patches every two weeks or so -- something that is much more complicated with a submarine at sea that will not return to base for many months
2. Releasing quickly does not mean releasing poor quality. The more critical the product, the more important quality is. Release a buggy version of a Web site that shares your holiday photographs with your children, and they might chuckle at the questionnable user experience. Launch a nuclear submarine with an unreliable cooling system, and you may end up triggering the third World War. The stakes dictate how strict quality control should be

## The mutiny
Back in the film, Vostrikov has limited choices at his disposal, by that stage. It is even more limited by the fact he is far from friendly waters and cannot contact home base for help. His options are:
- Ask a nearby NATO base for American help: save the crew, but lose face and disclose military secrets to the American rivals in the form of the hi-tech submarine. That is a definite one-way ticket to the gulag, if not a firing squad
- Sink the submarine: sacrifice the crew and write off taxpayers' money -- and his own life
- Evacuate the crew close to American ships, then sink the submarine: save the men (but give them to the enemy), write off taxpayers' money -- and his own life

Meanwhile, painfully conscious of the desperate situation they are in, some crew members instigate a mutiny. After all, if Vostrikov had not given those orders, they would not be where they are.
The mutiny is short-lived: as soon as they return the command to Captain Polenin, Polenin has the rebels arrested and frees Vostrikov, who is still his superior, and who is only implementing orders from Moscow.

Once free, still eager to clear his reputation and prove he is a patriot, Vostrikov tells Polenin he has (unilaterally) decided to evacuate the crew to be rescued by the Americans, then dive alone and sink the ship. Cue national anthem for a heroic act.
Polenin, not convinced that is the best outcome for all involved, tells Vostrikov to ask the men what _they_ want to do. He knows that doing so empowers the team. That it gives the team a chance to own the problem and that they will then come up with a solution for it -- _their_ solution. Since it is theirs, they will give it their all and stand behind it, rather than half-heartedly follow the orders of someone they do not respect.
In the film, Captain Polenin nails the people management. Whereas Captain Vostrikov is blinded by the pursued outcome (his own agenda) and hardly recognises that he is not on his own.

The men, choosing a heroic death over a public admission of weakness, decide to all go down with the ship rather than risk it falling into the hands of the Americans.
In the end, they are met by another Russian submarine that rescues everyone under the watchful eye of Uncle Sam. The boat is towed back to Murmansk, where it will be repaired before resuming its service. The end.

## Conclusion
What are the conclusions of all that?

### The workforce is the wealth of an organisation
Without the workforce, there is no work; without work, there is no product.
The workforce produces and maintains the product, whatever that product is. It is critical for an organisation to build a capable, reliable and dependable workforce. Once assembled, it is just as important to nurture that workforce to help them perform well and to minimise the cost and risks associated with building a new workforce.
Wearing down the workforce, treating them poorly are sure ways to not have a strong, stable product to sell.
Empowering the workforce is the best way to build trust, expertise and loyalty. It also brings stability: empowered workers feel more in control; they are happier and, as a consequence, tend to stay where they are. Unhappy employees, on the other hand, tend to leave an organisation.

### In a consultancy, the above is even more important
The workforce _is_ the product: we rent manpower to other organisations. Disgruntled consultants will leave too, and a consultancy without consultants is like a raclette without cheese.
In the Russian Navy, the workforce builds and operates the product -- in the case of our film, a nuclear submarine. Without the seamen, the submarine is but a metal tube moored in a harbour, unable to harm anyone. With the crew, however, it becomes a formidable weapon, capable of intimidating the nation's rivals and a deterrent for foreign aggression.

### In a project, time can be and often is of the essence
There is room for pressure to an extent -- pressure to deliver faster, or to look for a pragmatic solution, rather than a gold-plated one. Applying immense pressure on team members to work "harder" bears no long-term benefit, though. It does not help build trust, it makes people not want to work for you, it does not make them want to work well, it encourages corner-cutting, it may even result in mutiny or sabotage, in extreme cases.
There is plenty of room between applying too much pressure and being too lax. Finding the right balance is a tough act, and that balance will vary from one project to the next, as the criticality of a solution commands more or less urgency.

### Build a dependable team to lean on
It is a prerequisite for project success. Find people who work well with you. Find people who work well together. Empower that team. They will take ownership of a problem and its solution. Vostrikov did not see that and it cost him dearly (a mutiny). Polenin knew this and got the crew to act as a unit and achieve better results.
