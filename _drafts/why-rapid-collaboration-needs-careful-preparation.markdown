---
title: Why rapid collaboration needs careful preparation
date: 2023-01-24 14:47:00 Z
categories:
- Data Engineering
tags:
- COVID-19
- data
- data sharing
- digital government
- government
- ''
summary: The pandemic response required a remarkable level of collaboration between
  and beyond government departments. In this blog post, I’m going to look at the Clinically
  Extremely Vulnerable People Service, outlining the different areas of collaboration
  upon which the service depended, and reflecting on the lessons that government can
  take forward to achieve its vision of a responsible, efficient and effective data
  ecosystem.
author: jmcevoy
---

*Over the summer, in partnership with Scott Logic, the Institute for Government (IfG) ran a series of roundtable discussions with senior civil servants and government experts on the topic of Data Sharing in Government. This is the fourth in a series of blog posts in which I reflect on those discussions. You can read the first three posts in the series here: ‘[Why you should get the right people in the room from the start](https://blog.scottlogic.com/2022/11/18/why-you-should-get-the-right-people-in-the-room-from-the-start.html)’, ‘[Rules help you go faster](https://blog.scottlogic.com/2022/11/30/rules-help-you-go-faster.html)’ and ‘[How data literacy gives leaders the edge](https://blog.scottlogic.com/2023/01/12/how-data-literacy-gives-leaders-the-edge.html)’.*

So far in this series of blogs, I’ve reflected on factors that underpinned why some pandemic-response programmes were more successful than others. I’ve not yet focused on the remarkable level of collaboration between and beyond departments, nor what made that collaboration possible.

I’m a former civil servant and worked for many years at the Government Digital Service (GDS), where it was our remit to work across departments to make digital government simpler, clearer and faster for everyone. That gave us a broad perspective and I can say from experience that whilst people have the best of intentions, cross-departmental collaboration is not always the highest priority of departments – understandably, their focus is on implementing their own policies which they will be measured on in terms of performance. However, the pandemic changed all that, providing a single point of focus and introducing the need to collaborate at an unprecedented scale and speed.

As Deputy Director (Platforms & Services and Head of GDS International), I helped to establish and lead the **Clinically Extremely Vulnerable People Service (CEVPS)**. In this blog post, I’m going to outline the different areas of collaboration upon which the service depended, and reflect on the lessons that government can take forward to achieve its vision of more accessible, efficient and interconnected service delivery.

## Creating the Shielded Patient List

The CEVPS was designed to support the shielding population by providing essential supplies, preferential access to supermarket delivery slots, and in some cases, emergency support. It was established at extraordinary speed, with planning beginning on 9 March 2020 and the first iteration of the service going live on 23 March 2020, as the UK entered its first national lockdown.

As a starting point, NHS Digital developed the Shielded Patient List (SPL) for England. This involved combining GP records and diverse datasets that were usually only used in trend analysis, but which would now be used to identify a cohort of at-risk patients.

Approached by NHS Digital for assistance, Scott Logic was proud to offer *pro bono* support to help create the SPL. Our Solutions Architects identified and made the case for a suitable migration strategy, and helped NHSD to assemble the right team and manage the migration process.

## Collaboration between departments

With the SPL established, NHS Digital shared it with GDS which took the role of Data Controller. GDS developed a registration service and a way to match individuals who asked for support. The Ministry for Housing, Communities and Local Government (MHCLG – now the Department for Levelling Up, Housing and Communities) and GDS collaborated to create a way to segment the list by local authority so that each area only received data on their specific cohort.

All of these departments came together to collaborate with the Department for Environment, Food and Rural Affairs (Defra) to agree on and develop the best way to share this data so that a section of it could be passed on to supermarkets and Brakes Foodservice. In parallel, the Department for Work and Pensions set up a call centre tasked with calling people on the SPL to check on their wellbeing.

Already, you can see the high level of cross-departmental collaboration involved in creating an entirely new service from a standing start in a matter of weeks – all driven forward by [the kind of multidisciplinary team I described in my earlier post](https://blog.scottlogic.com/2022/11/18/why-you-should-get-the-right-people-in-the-room-from-the-start.html) on the topic.

What made this possible? It was thanks to a decade of investment in digital people, skills and technology. The GDS was established in 2011 and by the time of the COVID-19 pandemic, the UK’s digital government infrastructure ranked among the very best in the world. The UK ranked 2nd globally in the [OECD Digital Government Index 2019](https://doi.org/10.1787/4de9f5bb-en); in the [World Bank GovTech Maturity Index](https://openknowledge.worldbank.org/handle/10986/36233) (Dec 2020), the UK was in the top rank globally as a ‘GovTech Leader’; and GOV.UK was ranked 7th in the [United Nations 2020 E-Government Development Index](https://publicadministration.un.org/egovkb/Data-Center).

Matching this globally renowned technological infrastructure was the deep expertise of civil servants across departments. So, when the pandemic required rapid collaboration, the technological connective tissue was already in place. When legislative frameworks governing data sharing needed to be built into the code of the CEVPS, the deep specialism of civil service experts was ready to be called upon.

## Collaboration with patient groups and compliance bodies

Proactive collaboration with regulators and special interest groups from the earliest stages of the programme was another key to its success. At GDS, we collaborated with the Information Commissioner’s Office (ICO) to ensure that data security and information governance were baked into the technical solution from the start, including privacy-by-design and data minimisation best practices. In my experience, that level of early interaction between policy, data protection, legal and technical specialists does occasionally happen but is not commonplace, and government departments would benefit from fostering that kind of collaboration in future.

In parallel, working together with groups such as the NHS’s Independent Group Advising on the Release of Data allowed us to build confidence in the service by being transparent about what data would be shared, along with why and how, forestalling a negative public or press response.

## Collaboration with local authorities

Due to the extraordinary speed at which the CEVPS needed to be established, the needs and capabilities of local authorities were initially represented by the MHCLG. The cross-departmental team then rapidly engaged with a number of colleagues from the local authorities who would ultimately be some of the users of the system and could describe their technical setup and needs in more detail. Once the CEVPS was up and running, local authorities were given delegated responsibility for providing services to their segment of the SPL – initially in the form of the food delivery parcel scheme, and later through care, and checking on support being provided.

Not all local authorities were ready to take on this challenging data management task; their data systems, skills and processes varied significantly. This prompted closer collaboration with MHCLG and the cross-departmental team, with the setting up of teach-in sessions in which the technical specialists helped to optimise local authorities’ use of the data. In the process, the local authorities helped identify and resolve data issues impacting local service delivery.

Learning from this, it would be beneficial in future for government to gain a better understanding centrally of the varied technical setups across the local authorities, and to introduce some means of bringing direct local government representation into the ‘room’ from the start of nationwide data-sharing programmes.

## Collaboration with the private sector

With the UK entering lockdown, companies from across the private sector offered their assistance to the government. It was necessary to identify the offers that would best meet the needs of the most vulnerable citizens; through this process, the CEVPS collaborated with Brakes Foodservice and supermarkets to ensure that people on the Shielded Patient List were prioritised for food deliveries.

Ready-made frameworks and Data Protection Impact Assessments (DPIAs) made it a rapid process to create the data-sharing agreements, and core to the success of the collaboration was the clarity of the objectives. Precise limitations were accordingly baked into the agreements. Through collaboration with the CEVPS team and the ICO, the supermarkets were able to determine their own legal position and demonstrate how they would comply with the requirements. Working together in this way, we established a means by which data could be shared with the private sector in a way that was safe and provided support to those most in need.

In these specific circumstances, it was possible to enter into data-sharing agreements with the private sector at speed, but it’s far from the norm. While the infrastructure and legal frameworks already exist to facilitate data sharing within government, a wide range of additional considerations need to be taken into account with the private sector.

But as the CEVPS demonstrated, such collaboration is possible. The government is exploring the potential to create a [responsible, efficient and effective data ecosystem](https://www.gov.uk/government/publications/national-data-strategy-mission-1-policy-framework-unlocking-the-value-of-data-across-the-economy/national-data-strategy-mission-1-policy-framework-unlocking-the-value-of-data-across-the-economy), making data more usable, accessible and available for the good of citizens and the economy. Part of this could include defining government-wide principles, frameworks and standards to govern decision-making around data sharing with the private sector. Speaking from experience, it would be better to do this when you’re not in crisis mode!

It’s become a truism that the pandemic was an accelerator, and this is certainly the case with data sharing in government. The crucible of the pandemic response revealed the extent to which the government was already prepared for greater interconnectedness and data sharing, as the rapid establishment of the CEVPS demonstrated. There’s great potential to build on these foundations so that – with clear objectives, a proven public need and sound governance – departments, agencies and even private sector organisations can collaborate safely and effectively to deliver value to citizens. The opportunity cost of not building on those foundations could be significant, not just in economic and social terms, but also in our preparedness for another crisis.

## Join us for ‘Lessons from data sharing during the pandemic’

On Wednesday 8 February, I’ll be speaking on a panel at an IfG event with fellow panellists **Ming Tang** (National Director of Data and Analytics for NHS England and Improvement), \*\*Juliet Whitworth \*\*(Head of Research and Information, Local Government Association) and **Paul Shepley** (Data Scientist at the Institute for Government). We’ll explore themes and case studies from the upcoming IfG report, produced in partnership with Scott Logic: Data sharing during the pandemic.

[Register here to join in person or online](https://www.instituteforgovernment.org.uk/event/lessons-data-sharing-during-pandemic?utm_source=events_page&utm_medium=website&utm_campaign=scottlogic_website)