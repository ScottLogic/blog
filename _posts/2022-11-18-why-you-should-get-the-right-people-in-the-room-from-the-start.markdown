---
title: Why you should get the right people in the room from the start
date: 2022-11-18 15:47:00 Z
categories:
- Data Engineering
tags:
- Government
- data
- data sharing
- agile
- ways of working
- COVID-19
- ''
summary: Over the summer, in partnership with Scott Logic, the Institute for Government
  (IfG) ran a series of roundtable discussions with senior civil servants and government
  experts on the topic of Data Sharing in Government. This is the first in a series
  of blog posts in which I'll share some reflections on key themes that arose.
author: jmcevoy
---

Over the summer, in partnership with Scott Logic, the Institute for Government (IfG) ran a series of roundtable discussions with senior civil servants and government experts on the topic of Data Sharing in Government. I was a participant in all of them and through a series of blog posts, I’d like to share some reflections on key themes that arose – respecting the Chatham House rule, of course!

But why were the roundtables convened in the first place? Following on from the digital transformation of UK government services over the last decade, and the COVID-19 pandemic, we have seen what data sharing can achieve – as well as the cost of it not working. New technologies, supported by new legal frameworks and good governance, are making it possible to share data safely and securely across and between government departments – in ways that will save taxpayer money and deliver a better experience for citizens.

The demands of responding to the COVID-19 compelled departments to work at an unprecedented pace to share data in order to support citizens in need – for example, [allowing the NHS to share data with the DWP](https://dwpdigital.blog.gov.uk/2021/12/08/guest-post-how-apis-kept-our-country-running-when-everything-stopped/) in order to process health benefit claims. In this way, the pandemic threw into stark relief what worked well in government digital services, what needed to be improved, and what new ways of working should be retained in the New Normal.

One of these ways of working that was cited repeatedly in the roundtables was the importance of getting the right people in the room from the start of a project. That’s what I’m going to focus on in this post.

## What do we mean by the ‘right people’?

When it comes to agile software development, very often the core team consists of the engineers who design, build and test the software, working with a representative of the business (the Product Owner role in Scrum). However, digital services that will be used by members of the public can have complex requirements requiring specialist knowledge, including in the fields of law, regulation, policy and cybersecurity. These services must work for everyone and will need to be iterated frequently; often this involves seeing emerging user needs and navigating the law at the same time. That’s a lot to expect a Product Owner to become expert in, so ongoing input is required from these additional stakeholders.

Historically, the role of these stakeholders was typically one of validation, checking that the software was compliant *after* it had been built – often resulting in costly rework. A far better approach is to bring these stakeholders into the process of designing, building and testing software at a much earlier stage, making them part of a multidisciplinary team. An early task of agile projects should be to identify who are the right people to be part of the team so they can be part of the design and research process. Some teams across government have been working in this way for years but it’s not yet the default, and the pandemic showed us in a very immediate way what the cost of not working in this way can be.

## How did this make a difference during the pandemic?

When the first national lockdown was implemented, I was Deputy Director (Platforms & Services & Head of GDS International) at GDS. The **Clinically Extremely Vulnerable People Service** (CEVPS), was a new public service launched by the UK government in March 2020 to identify, notify and support vulnerable individuals who had to ‘shield’ in order to protect themselves. It was my role on the CEVPS to bridge the policy and technical world, working with very senior stakeholders from across government to ensure that my tech team had a clear picture of what was needed in order to deliver this critical support.

One of the IfG roundtable discussions focused specifically on this service, and everyone agreed that bringing together a multidisciplinary team from the start made the difference between success and failure. The ‘right people’ in this instance consisted of Data Protection Officers (DPOs), security, legal, technical and policy expertise, along with very senior leaders in government. The technical folk in the ‘room’ gained a clear understanding from those leaders of the emerging policy and what they would need to build; the decision-makers had direct access to legal and security expertise, allowing them to be apprised immediately of what could and couldn’t be done, and what obstacles they needed to make sure were removed.

In the case of the **NHS COVID-19 Data Store**, the multidisciplinary collaboration was enduring. The service aimed to bring multiple different data sources from across the health system in England in one place to help with the COVID response – providing ‘a single version of the truth’ to help monitor the virus, ensure the right support was available, and support decision-making by figures from senior national politicians down to local health officials. In this instance, the ‘right people’ were a blend from the private sector as well as within government. The team had a clear, common goal and very effective leadership (a theme I’ll refer to in a future post), and the service was established successfully at unprecedented speed.

The team evolved over time for the better, becoming more multidisciplinary in nature. Initially, the expert data scientists didn’t get the full contextual insight they needed to be fully effective in their analysis of the data. So, they joined up with the people running the emergency responses, having daily stand-ups. This allowed them to triangulate the data with the experience on the ground and feed this insight from multidisciplinary collaboration back into the development of the Data Store. As a result, the role of the analysts changed, bringing them to the forefront of operational problem-solving, rather than being seen solely as a back-office supporting function.

One lesson from not bringing together the right people from the start can be drawn from **General Practice Data for Planning and Research** (GPDPR), a data-sharing initiative launched in 2021. The initiative stoked controversy and [over a million people opted out of the scheme](https://www.theguardian.com/society/2021/aug/22/nhs-data-grab-on-hold-as-millions-opt-out), resulting in it being put on hold. The IfG roundtable on this topic identified several factors that contributed to these problems; one of these being the lack of a multidisciplinary team. Data protection experts could have been involved from the beginning, considering risks in the right order and building in data protection by design. Others opined that many of the problems were design problems masquerading as legal, policy, security or technical issues; if designers had been involved from the start, they could have thought through the end-to-end processes and the outcomes that the service was trying to achieve.

## Why it should be your standard approach

Getting the right people in the room at the start is our recommended approach on client projects at Scott Logic, and I’d recommend it to you too. It’s how we’re working with [ScotGov on their digital identity service](https://www.scottlogic.com/news/scott-logic-awarded-contract-develop-scottish-governments-digital-identity-platform) and their payment service; it’s how we’re working with [HM Land Registry](https://www.scottlogic.com/news/two-year-contract-drive-digitisation-hm-land-registry). As I hope the examples above from the pandemic demonstrate, it can make all the difference between success and failure.

By bringing in expert stakeholders at that start, you can cut down on your missteps and wrong turns, and leverage all the previous work and insight that has come before you. This allows you to plan how and when you will require their input to help design, test and validate the software your team is building. Their input helps to foster a more knowledgeable engineering team over time, sharpening their focus on the needs of users and the project’s objectives. It also deepens their understanding not only of *what* should be built, but *how* and *why*. And by validating completed user stories and engineering decisions as early as possible, the expert stakeholders will help your team to avoid rework, deliver on time and save taxpayer money.

## Join us for 'Lessons from data sharing during the pandemic'

On Wednesday 8 February, I'll be speaking on a panel at an IfG event with fellow panellists **Ming Tang** (National Director of Data and Analytics for NHS England and Improvement), **Juliet Whitworth** (Head of Research and Information, Local Government Association) and **Paul Shepley** (Data Scientist at the Institute for Government). We'll explore themes and case studies from the upcoming IfG report, produced in partnership with Scott Logic: *Data sharing during the pandemic*.

[Register here to join in person or online](https://www.instituteforgovernment.org.uk/event/lessons-data-sharing-during-pandemic?utm_source=events_page&utm_medium=website&utm_campaign=scottlogic_website)