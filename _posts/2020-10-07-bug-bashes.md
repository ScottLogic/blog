---
title: Bug Bashes
date: 2020-10-07 00:00:00 Z
categories:
- Testing
author: ckurzeja
layout: default_post
summary: When working without testing resource on a project, I was looking for a tool
  to 'shake out' issues in the product. Colleagues suggested using a bug bash and
  this blog post explains what a bug bash is and how we went about running one.
image: ckurzeja/assets/2020-10-07-bug-bash.jpg
---

Recently I was leading a team delivering a proof of concept for a client with no testing resources. I was looking for a tool that would ‘shake out’ issues in the product and improve the overall quality. Given our lack of dedicated testers, I turned to colleagues in the testing community at Scott Logic for advice - they suggested running a bug bash.

## What is a bug bash?

A bug bash is an event hosted by a delivery team that is used to find issues in a product through a short burst of intense usage. When people take part in the bug bash they log any issues that they discover so that the team can get quick feedback and plan how to address them.

The testers from Scott Logic volunteered to facilitate the session for my team. They had previously used the technique to successfully expose numerous issues in a short period of time with people who did not have in-depth product knowledge nor domain knowledge.

For our bug bash, we opened the invite to the entire product development department at the client. This meant we had a wide range of attendees including developers, testers, designers and product owners from other parts of the business. 

One key group missing were the end users of the product. We would ideally have invited them to take part but they were not available to us at the time and so we had to wait for their feedback at a later stage of the development process.

## Surfacing the domain

Our team had been working on the product for some time and had built a strong understanding of the domain. In our bug bash, we would be inviting people to use our product that did not share this understanding. As such, we had to identify what information we needed to provide them with in order to explain what we were building.

We started with the 'elevator pitch' that had been produced by our product owner. This had been written to summarise the user needs that we were seeking to address and to explain the value that would be delivered for the users and the business. This gave our attendees the background behind the product and the goals the team were working towards.

We then started working with the Scott Logic testers to surface more about our product. They asked questions in order to discover more about the product context and tried to spot the areas in our answers in which we may have assumed prior knowledge. 

This let us identify and document the key workflows that end users would be following when using the product and helped us define the scope of what we would ask people to test in the bug bash. We produced diagrams to represent each workflow and suggested different groups of people exercised different parts of the application.

## Testing for non-testers

Another challenge to face was that our participants were not all testers; it can be challenging to get into the mindset of a tester when it is not part of someone's day job. To overcome this, the Scott Logic testers suggested that we consider using test heuristics. 

Test heuristics are a set of ‘rules of thumb’ that can be used as an aid when testing. They help generate new test ideas and can be used to explore the boundaries of a system. An example heuristic is the 'Goldilocks' heuristic which suggests testing things with values that are too small, too large and just right.

For our bug bash, we produced a cheat sheet of heuristics which discussed how to think about testing our product and gave ideas about different things to try - this helped us encourage people to find ways to break the product. Some of the ideas on the cheat sheet included using unusual characters, typing strings into numeric fields or using large numeric values (as per the 'Goldilocks' heuristic).

<p style="text-align:center;"><img src="{{site.baseurl}}/ckurzeja/assets/2020-10-07-bug-bash.jpg" alt="Bug bash in progress"></p>

## Incentivising the hunt

The team decided to run an hour-long bug bash which was felt to be long enough for people to explore the system and start to discover bugs without running out of steam. We also used pizza as a way to entice people to join in our efforts to ‘break all the things’.

We provided the overview of the product, the workflow diagrams we had created, our cheat sheet of heuristics, and encouraged everyone to use their inquisitive nature to find the things they thought were good and bad about the product as well as what they thought was broken.

To keep enthusiasm high, we engaged them using prizes and a leader board. By giving incentives, such as a prize for finding the first bug in a particular workflow or the most interesting UX bug, we were able to provide an element of competitiveness that kept people motivated. I was personally sceptical about this but was proven wrong; people were keen to win the Scott Logic branded swag as well as to be top of the bug count leader board by the end of the session.

We captured any issues we discovered using Slack with a thread per issue. This allowed the development team to respond to issues in real time and capture any extra information as needed. It also allowed us to suggest taking screenshots or videos of the issues as they were found. We could then raise tickets as appropriate later on.

## Outcomes

The outcomes of the bug bash were that our participants identified:

- 8 bugs that had to be fixed before we could launch
- 10 ‘nice to have’ improvements that we could add to our backlog
- 22 bugs related to validation of data which had not yet been implemented
- 5 UX suggestions
- 45 bugs that were duplicates of other bugs

We were able to prioritise the 8 key issues so that we could fix them prior to launch but were pleased that a great number of issues discovered were actually improvements that we could look to address if the proof of concept led to development of a full product.

As developers, getting to witness other people using the product and interacting with it in creative ways allowed us to think about different approaches to our own testing. The list of bugs also highlighted potential blind spots in our test strategy which we could then review and address going forwards. 

Having not had any dedicated resources on the team, it was also a useful demonstration to the client that testing was something we should be investing in. The team had ‘managed’ for a short period but the benefit of having a quality champion in the team was clearly illustrated with the output of the session.

Our team ran further sessions in which we experienced the same benefits found by allowing fresh eyes to explore the product. This also enabled us to share the progress of the product with the wider business and supported quality as the project progressed.

Given the successes of these bug bashes and the outcomes they generated, bug bashes are now a tool that I will return to in future projects. 
