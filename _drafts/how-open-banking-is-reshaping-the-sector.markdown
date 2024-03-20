---
title: How Open Banking is reshaping the sector
date: 2024-03-20 10:00:00 Z
categories:
- Tech
tags:
- open banking
- financial services
- retail banking
- APIs
- externalised APIs
- Open Banking APIs
- embedded finance
- ISO 20022
summary: I wrote recently about what the future holds for Open Banking in the US.
  But what about the UK? We’re now over five years into the Open Banking era in the
  UK. How is it reshaping the banking sector, and what’s coming next?
author: acarr
---

I wrote recently about [what the future holds for Open Banking in the US](https://blog.scottlogic.com/2024/02/02/why-you-should-care-about-open-banking-in-the-us.html). But what about the UK? The term ‘world-leading’ is a bit of a cliché, but when it comes to Open Banking, the UK has genuinely led the way. The initiative has brought about positive disruption in our banking sector as the rest of the world has looked on, eager to learn lessons from our experience.

We’re now over five years into the Open Banking era in the UK. How is it reshaping the banking sector, and what’s coming next?

I’m a Solutions Architect by profession, so you’ll have to forgive me if I use an architectural analogy to convey how I see things developing. Just as we talk about transitioning from monolithic architecture to loosely coupled microservices, I foresee an equivalent transition in the banking industry, and this could be very positive – as I’ll go on to explain.

But first, let’s take a quick look at how we got here.

## A potted history of Open Banking

The Competitions and Markets Authority (CMA) issued a remedy in late 2016 requiring the UK’s nine largest retail banks ([the CMA 9](https://www.openbanking.org.uk/glossary/cma-9/)) to implement Open Banking by early 2018. Through Open Banking APIs, licensed third-party providers (or TPPs) would gain direct access to customer banking data down to the transaction level.

This change turbocharged the ascent of the UK’s Challenger Banks and allowed hundreds of TPPs to enter the market, regulated by the Financial Conduct Authority.

It has also enhanced the ability of Google and Apple to make moves into the sector, finding ways to generate revenue from financial products and services without being subject to the same financial regulations as banks. Partnerships are key to this. For example, [Apple’s acquisition of Credit Kudos](https://www.cnbc.com/2022/03/23/apple-buys-uk-fintech-start-up-credit-kudos.html) – which uses consumers’ banking data to make more informed credit checks on loan applications – will give it the capacity to offer micro-loans and Buy Now Pay Later services. [Samsung has partnered with Moneyhub](https://financialit.net/news/payments/moneyhub-partners-samsung-world-first-open-banking-self-service-payments) to facilitate the world’s first Open Banking payments on a retail self-service point-of-sale kiosk. Meanwhile, an [Alphabet-led funding round](https://www.cnbc.com/2024/03/05/uk-neobank-monzo-hits-5-billion-valuation-after-430-million-raise.html) has just helped Monzo secure $430M investment to relaunch in the US.

The UK’s banking landscape has changed radically and rapidly in a very few years – and it’s beginning to raise the question of what it will mean to be a ‘bank’ in the future.

## Redefining what it means to be a bank

We were closely involved in supporting one of the nine big banks to design and implement its Open Banking APIs. This meant that we saw first-hand the cultural transformation that Open Banking brought about, a change in mindset that germinated in the development team and propagated throughout the bank.

In effect, it introduced something akin to [the fabled Bezos API Mandate](https://nordicapis.com/the-bezos-api-mandate-amazons-manifesto-for-externalization/) into financial services organisations which typically had highly coupled software architectures, and which usually viewed direct access as the optimal way to share data between systems. With the new strategic approach to APIs, a loosely coupled architecture could be introduced, one that was based on externalised APIs which could be used by internal and external systems.

Very rapidly, our client’s teams saw that the bank no longer needed to be the sole provider of value to their customers. In fact, by opening up safe access to customer data, they were creating more value for customers within a wider ecosystem. And suddenly, a whole new range of revenue opportunities opened up for the bank that hadn’t been there before, simply by creating externalised APIs that addressed the needs of the bank's retail and business customers. Meanwhile, there were significant cost savings for the bank as its technology teams interfaced with pre-existing, externalised API services – rather than the old approach of building internal data feeds jointly with very busy core teams. Through the simple means of externalised APIs, Amazon’s mandate unlocked massive growth potential; it was being unlocked for our banking client by the same means.

The Open Banking mandate was designed to increase competition and improve customer experience, and that’s exactly what it’s done. The banking sector has been reoriented to place the customer at its centre.

I’m old enough to remember the days of analogue, paper-based banking, where bank branches had limited opening hours and could be frankly daunting places – and you often stayed with the same bank for life. With the rise of online banking accelerated by Open Banking, customers understand that another way is possible – and so that’s what they now expect. Legacy-free Challenger Banks have been in prime position to respond to these new customer expectations.

The likes of Starling and Monzo have driven the redefinition of banking. It’s now commonplace that banking services are available to customers 24/7/365, but the Challengers have also led the way in defining banks as businesses that actively help you manage your finances – through services including budgeting tools, Buy Now Pay Later, and saving pots. It’s no longer difficult to set up an account or move your account to another bank; you can set one up in minutes on your phone, and the bank seamlessly manages the transfer of your standing orders and direct debits. Imbued with the Open Banking ethos, the Challengers create greater customer and business value through partnerships – for example, by offering savings pots provided by third-party specialist lenders ([see these Monzo examples](https://monzo.com/features/savings/)), rather than the bank itself.

UK Tier 1 banks are spinning up similar services, including through partnerships and integrations. I recently set up a [NatWest Rooster account](https://www.natwest.com/current-accounts/childrens-accounts/kids-prepaid-pocket-money-card.html) for my daughter and saw that the sort code for the account isn’t a NatWest one – it’s an account provided through a partnership with Modulr FS on the account and payment services side, with Rooster providing the app technologies (Rooster started life as a fintech startup before being acquired by NatWest). So, this is how far we’ve already moved away from the traditional definition of a bank. When your bank account isn’t intrinsically linked to the bank in question, then a ‘bank’ has become something else: a hub in an ecosystem that generates value for the banking business and its customers.

## From monolith to microservices

To return to my technology analogy from earlier, I hope you can now see why I find it a helpful way of describing the change that’s happening in the UK banking sector. It’s no longer a viable strategy to be a monolithic bank.

Instead, forward-thinking banks are preparing for a future of Banking as a Service (BaaS), where loosely coupled banking services are offered through API-driven platforms in a digital banking ecosystem. It’s why banks like NatWest are recognising [the need to accelerate their digital transformation](https://www.natwest.com/corporates/insights/technology/fit-for-the-future-how-tech-is-transforming-the-banking-industry.html) to contend with the tech giants and Challenger Banks.

Importantly, these banks recognise that regardless of the seismic change that’s underway, there’s huge value in their brand equity. With the right strategy, they can leverage that equity to survive and thrive as highly trusted brands in the new ecosystem of interconnected banking services.

And the connections within this new ecosystem aren’t simply technological. The shared recognition of what the future holds is driving collaboration between banks on new international standards such as ISO 20022, which paves the way for universal standards for electronic financial data interchange. Legislation will forge even more connections – [PSD3](https://www.europeanpaymentscouncil.eu/news-insights/insight/what-do-psd3-and-psr-mean-payments-sector) (and whatever form its UK equivalent takes) looks set to enlarge the financial services ecosystem; with the addition of mortgages, savings, pensions, insurance, and consumer credit, the promise of Open Finance can be realised.

So, what might have at first appeared to be an existential threat to the UK banking sector has instead become a source of vast opportunities – as long as banks adopt strategies that allow them to seize this potential.

I think NatWest has got it right in the Fit for the Future report I linked to above. With the customer at the heart of your business strategy, it’s about leaning into your trusted brand to develop services that are aligned with your USPs, and integrating them into the emerging ecosystem of Open Banking, Open Finance and embedded finance. Regardless of the increased competition, you’ll thrive in the new marketplace as long as you stay true to the unique value you offer.