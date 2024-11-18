---
title: Van Halen's rider and how it can help improve software development
date: 2020-10-15 00:00:00 Z
categories:
- Tech
tags:
- development
- requirements
- detail
- vanhalen
author: pgraham
summary: Van Halen famously requested M&M's with no brown sweets as part of their 1982 world tour rider. What, if anything, is there to learn from this ridiculous demand, and can it help improve our software development processes?
summary-short: What software development lessons can be learned from Van Halen's famous 'no brown M&M's' rider?
layout: default_post
---

High-profile musicians are famous for making ridiculous, or outrageous, demands for their back-stage setups when playing live. There are lots of [articles](https://www.google.com/search?q=backstage+rider+demands) available to read through that include juicy details of artists' demands while they were on the road. Be warned, browsing through the lists is a good way to lose an afternoon.

One demand that was listed in Van Halen's backstage rider for their 1982 world tour has been made legend in popular culture. The 'Munchies' section of the rider included a request for M&M's with a warning that there should be *absolutely no brown ones*. If brown M&M's were found in the backstage area, then the promoter risked forfeiting the entire show at full pay.

Touring is, without doubt, hard and hungry work. Keeping those blood sugar levels up is important when you are one of the most dynamic rock bands in the business. However, this seems to be a famous rock band making ridiculously specific demands just because they could get away with it. 

![Part of the rider from Van Halen's 1982 world tour - (from thesmokinggun.com)]({{site.baseurl}}/pgraham/assets/rider.jpg 
"Part of the rider from Van Halen's 1982 world tour - (from thesmokinggun.com)")

**Part of the rider from Van Halen's 1982 world tour** ([from thesmokinggun.com](http://www.thesmokinggun.com/backstage/hall-fame/van-halen-82))

## A ridiculous demand, but with a good reason

In truth, the demand for M&M's with no brown sweets was a detail that was deliberately included in the contract documentation sent to a promoter. Lead singer, David Lee Roth, explained in a 2012 [interview](https://youtu.be/_IxqdAgNJck) that the bowl of M&M's was an indicator of whether the promoter had actually read the band's complicated contract.

At the time, Van Halen's live show was one of the biggest ever seen. Touring represented a huge logistical challenge. Many venues at the time were too outdated or ill-prepared to cope with the amount of equipment the show used. Set-up and tear-down times were doubling, sometimes trebling. Safety of the band, crew and audience was also a concern. The M&M's clause provided an easy check for the band to reassure them that the promoter had done their job properly.

***"If I came backstage, having been one of the architects of this lighting and staging design, and I saw brown M&Ms on the catering table, then guaranteed the promoter had not read the contract rider, and we would have to do a serious line check..." - David Lee Roth*** 

## Less outrageous demands

While the myth of the "rockstar" developer has been around for a while, it is not likely that anyone working in software development will be able to request a rider for turning up to work. However, in the normal day-to-day life of a software development team, and the immediate business personnel who support that team, less outrageous demands are made all the time.

### Code styling / formatting

Code styling / formatting is one example of a demand that the members of a software development team place on others. It sometimes feels picky to comment on another developer's code to point out that they have missed a space in an if statement or indented using tab rather than space characters. It might become a real issue in smaller teams if a more senior developer consistently points out styling / formatting issues with a junior developer's code.

![Code reviews can sometimes feel picky]({{site.baseurl}}/pgraham/assets/review.jpg)

It is, of course, possible to apply automated formatting tools to solve this issue. That does not mean that a developer should disregard the code styling guidance altogether and leave it all to be tidied up by the tooling.

### Unit tests and testing

Unit testing is another example of something software developers expect their peers to do as a matter of course. A new unit test may be a requirement of fixing a bug. The team may have specified that any new development requires unit tests before code can be merged. The issue may be raised when a build fails due to an agreed level of test code coverage falling below a certain threshold.

![Is there a unit test for this class?]({{site.baseurl}}/pgraham/assets/unittest.jpg)

It may also be implicit that a developer will have tried out the code changes that they have implemented before those changes are introduced to the project. Perhaps it has been agreed that any new features will be demonstrated to the team before any code is committed into the development branch.

### Anything else

Other agreements may have been made as a team that place demands on how individuals do their work. There could be a requirement that certain deprecated classes or functions should no longer be used. There may have been a choice of one version of charting library over another. Some constraints might have been put in place due to the limitations of the production environment, or the database systems available within the organisation.

Taken individually all these demands seem trivial, but they all contribute to the whole ethos of the team and the quality of what they produce.

Agreeing these low-level requirements is, of course, not as ridiculous as requesting a bowl of M&M's with all the brown sweets removed. However, if this is what a development team has agreed, and one member of the team consistently disregards a practise that others try to follow then this will cause problems.

## Conclusion

There is more to story behind Van Halen's 1982 tour rider, and the demand that there be no brown M&M's in the backstage area, than at first glance. The truth is that this unusual demand was a deliberately included litmus test that potentially affected the entire production, possibly even down to the safety of the band, crew and audience.

The demands and requirements that members of software development teams put in place to ensure the quality of their work are more mundane, but still important. The little tasks that software developers perform each day, formatting and commenting code, writing unit tests, producing documentation and design artifacts, can all be used in the same way.

Working to satisfy these kinds of demands builds a culture of quality that has the potential for huge benefits. Our users will be thankful when our productions are well organised, well tested and backed up by the assurance that all those involved took care with the details.

Thanks for taking the time to read this post. RIP [Eddie Van Halen, 1955-2020](https://www.theguardian.com/music/2020/oct/07/eddie-van-halen-obituary).
