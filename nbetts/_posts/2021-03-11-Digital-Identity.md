---
published: true
author: nbetts
layout: default_post
category: Delivery
title: 'Digital Identity in UK Government'
image: nbetts/assets/digital-fingerprint.jpg
tags: 'Government, GOV.UK, Digital, Identity, Technology'
summary: "Since the Government Gateway launched two decades ago , there is now an array of Government online portals available, allowing citizens to securely authenticate with a digital identity, and access Government services.   In this blog post, I discuss the legacy of the Government identity services, and the recent Cabinet Office push for the 'development of a single sign-on and identity assurance system.'"
---
    
<img src="{{ site.baseurl }}/nbetts/assets/digital-fingerprint.jpg" alt="Digital Identity" width="100%"/>

## What is a digital identity?
A digital identity is a digital representation of a person. It enables us to prove who we are during online interactions and transactions. Organisations that let users use secure digital identities during interactions and transactions, can trust that those users are who they say they are, without the need for physical documents.

## Government Gateway
Let’s go back in time.  To a time when Sven-Göran Eriksson was manager of the England football team, Shaggy featured in the Top 10, and the Gateshead Millennium Bridge first opened to the public.  

The year is 2001, also the year that the Government Gateway, an IT system that was developed to register for online services provided by the UK Government, was first made available to UK citizens.

Government Gateway was the first government programme to start building software in new innovative ways that had not been used before on large Government IT projects.  This included a physically co-located team of suppliers, civil servants and users; user-centric design; agile approaches at scale; iterative builds; a delivery team comprising a range of suppliers, and the adoption of open standards mandated by the UK government.

This was cutting edge at the time within the public sector, and the Government Gateway led the way in GOV.UK digital services, but after a decade it was starting to look and feel dated due to advances in web technologies.  Approval for the development of a single cross-gov digital identity system, to replace the Government Gateway, was granted in 2011.  The new service would be known as GOV.UK “Verify”, with aspirations to be the single ‘front door’ portal to online public services for all citizens and businesses. 


## GOV.UK Verify
In 2011, the UK Cabinet Office began work on [Verify](https://www.gov.uk/government/publications/introducing-govuk-verify/introducing-govuk-verify), also known as the Identity Assurance Programme (IDAP). The program intended to establish one trusted login across all online services provided by the British government. 

The service was launched in May 2016, with five third party identity providers (IDP) - Experian, Barclays, Secure Identity, Post Office and DigiIdentity.  Identity providers are independent companies who must ensure they comply with the accreditation standards set by GOV.UK.  Before each company connected to GOV.UK Verify as a certified company, they had to show that they had met these standards.  GOV.UK Verify certified companies must verify customers' identities to level 2 (as defined by Good Practice Guide 45) published jointly by CESG and the Cabinet Office. This level of identity assurance is required to support a claim in a civil court.

The original objective for Verify was to replace the Government Gateway, but also expand its usage into the NHS, local authorities and the wider private sector.   Unfortunately, Verify struggled with uptake, and did not make the impact it had hoped.  Possible reasons for its demise included Verify delivering much later than planned (allowing departments time to implement their own ID service), the success rate in identifying individuals online being low (including criticism around the datasets used by IdPs being insufficient to provide the necessary levels of assurance), and Verify being unable to identify intemediaries or businesses.  

If this wasnt bad enough, in April 2020, three of the five third party identity providers (IDP) - Experian, Barclays and Secure Identity, decided to pull out of the Verify scheme.  This leaves two IDPs in the mix: the Post Office and Digidentity.  Considering that the Post Office and Experian have so far accounted for more than 80% of all users registered for Gov.uk Verify, the loss of Experian will have a huge impact.  Additionally, the Post Office actually uses the same identity service as that provided by Digidentity, so effectively Verify is running with one sole IDP – an operational risk and clearly not the original intention.

Treasury funding for Verify, was due to end in April 2020, however this was extended for a further 18 months due to the pandemic.  This was conditional, with no further services to adopt Verify, and all existing services to have an alternative system available by the date the funding ceases (September 2021).  

To add to the pressures on Verify, the identity scheme experienced unprecedented demand during the coronavirus lockdown, particularly through the Department for Work and Pensions (DWP) benefits programme Universal Credit (UC).   However, the surge in people applying for UC in 2020 led to huge queues on its website, and people struggled to successfully create a Verify account.   DWP had to react and pivot quickly, resulting in Universal Credit applicants being allowed to use their Gateway credentials through Confirm Your Identity (CIY), as DWP seeks to move away from Verify.


## Identity Management for Public Services
Over the last decade, a plethora of digital identity portals for citizens and businesses have been developed, each with their own specific use cases.  Examples include:

**Identity and Attributes Exchange (IAX)**

A scheme that aims to establish a trust mark for digital identity products. Organisations will become members of IAX and will be certified by an independent auditor. Only IAX members will be allowed to sell digital identity services to the UK government.

**NHS Login**

Aims to allow patients to securely access online health records and services through a standard, nationwide system.  “NHS Login will make it easier and quicker for patients and the public to see their personal health information online, which will empower people to manage their health more effectively.”

**Home Office EU Settled Status scheme**

A mobile application ID Document Check for EU, European Economic Area (EEA) and Swiss nationals to apply for Pre-Settled and Settled status in the UK after Brexit.  The app supports people in confirming their right to continue to live and work in the UK following Brexit.

**DWP Confirm Your Identity**

The Confirm Your Identity (CYI) service helps Universal Credit (UC) claimants prove their identity online during the application process. This service has been active since April 2020 after being accelerated during the government response to Covid-19 (and technical issues with Verify).  Complementing existing identity verification services, CYI is a key part of DWP’s strategic direction moving forward.

**Scottish Government’s Digital Identity Scotland (DIS) scheme**

A ‘cloud first’ digital identity platform, moving into Beta phase this year.  The service will provide users with a simple, usable and secure mechanism to access public services if they choose, and a means by which they will be able to manage their data in a way that is under their own control.  Scottish Government aims to provide citizens the ability (with their consent) to store their personal information, in the form of verified attributes with associated metadata, in an Attribute Store which they own and control the information within it.

**Department for Business, Energy and Industrial Strategy (BEIS) - Digital Business Identity**

BEIS is working on an identity system to provide companies with better access to government support services and contracts, and reduce fraud. 


Due to the lack of a strategic cross-government solution for identity management, it's really not surprising that departments have taken a siloed, tactical approach, implementing custom solutions that meet their own requirements.   However, as I will now discuss, there is a concerted move in UK Government to implement a single digital identity service..


## The future of Digital Identity in Government
In June 2018, it was announced that responsibility for digital ID policy had moved from GDS to the Department for Digital, Culture, Media and Sport (DCMS).   The move followed the switch of data policy from GDS to DCMS, which was widely seen as a diminishing of GDS’s role in digital government (something I would contest based on the recent announcement by the Cabinet Office discussed below).

Earlier this year, the Government published the [UK digital identity and attributes trust framework policy paper](https://www.gov.uk/government/publications/the-uk-digital-identity-and-attributes-trust-framework/the-uk-digital-identity-and-attributes-trust-framework).  The document sets out the government’s vision for the rules governing the future use of digital identities. It is part of the government’s wider plan to make it quicker and easier for people to verify themselves using modern technology.

The trust framework is also central to the Government Digital Service’s work with other government departments to develop a new cross-government single sign-on and identity assurance solution. This will ensure interoperability of identities and associated attributes between sectors in the longer term.  This government is committed to delivering these benefits digitally, and without the need for a national identity card.

As reported in February by Computer Weekly, Cabinet Office minister Michael Gove wrote to Government departments about the need for **“development of a single sign-on and identity assurance system”**. Gove said in his letter that **“all public-facing central government services should migrate onto it, and legacy systems will be phased out”**, with **“active participation”** from departments **“a precondition for the programme’s success".**

“The work is being led by the Government Digital Service (GDS) and builds on the recent work on [GOV.UK ‘Accounts’](https://gds.blog.gov.uk/2020/09/22/introducing-gov-uk-accounts/), a single sign-on system to deliver more personalised services for users of the Gov.uk website.  However, according to Gove, the new system will go further by adding identity assurance features and sharing identity data between departments.  It is also unclear whether the new development will re-use any of the existing Verify functions.” 

There is no doubt that the COVID-19 pandemic has dramatically fast-tracked the urgency for a secure cross-government digital identity service.  Social distancing caused by the pandemic, has significantly reduced the amount of face to face “in person” contact.  This means, there has never been more of a need for citizens to be able to simply and securely access government services online, using their own digital identity.   

As I've discussed in this blog, there have been numerous failed attempts to establish a strategic digital ID solution for citizens and businesses.  Due to the huge complexity, investment and level of buy-in needed, I remain sceptical if a truly cross-gov UK digital identity solution will come to fruition any time soon.

Maybe we should take a leaf out of Estonia's book - rated “the most advanced digital society in the world” by Wired, with 99% of Government services available online via a single sign on.  Kaimar Karu, who served as Estonia's foreign trade and information technology minister, said using multiple digital accounts “doesn’t work”, and that competing interests within governments are holding countries like the UK back.   

Clearly, the UK is some way behind Estonia in acheieving this digital GOV nirvana, however what is very clear to me, is that the future for digital identity in the UK lies in greater collaboration – between government and the private sector, across industry sectors, to understand their specific needs before implementing a 'one size fits all' solution. 


