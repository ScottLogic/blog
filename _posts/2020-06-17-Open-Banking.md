---
title: Demystifying Open Banking
date: 2020-06-17 00:00:00 Z
categories:
- Delivery
tags:
- Open
- Banking
- ","
- Delivery,
- FinTech,
- Finance,
- featured
author: nbetts
layout: default_post
image: nbetts/assets/openbanking.jpg
summary: 'If you don’t work in finance or technology then the chances are, you may not have heard of Open Banking.  In this article I’ll explain more about Open Banking, my own experience of implementing an Open Banking API solution for a UK challenger bank, and a brief look at what''s coming next... '
---

<img src="{{ site.baseurl }}/nbetts/assets/openbanking.jpg" alt="OpenBanking" width="100%"/>

## So what is Open Banking?
Open Banking is the UK version of its European cousin, PSD2 (with a few additional bells and whistles), and was brought in by the Competition and Markets Authority (CMA) in January 2018, with the intention of increasing competition and innovation in the market.  

Data is king, especially banking data, which provides insight into how you and I are spending money, saving, and building up debt.   Open Banking means that UK banks are obliged to open up their data (our data) securely to Third Party Providers (TPP) via a set of Application Programming Interfaces (API).   The intention being that by opening up access to this data, the consumer market will see increased competition as developers build apps that utilise data in a consumer friendly way.   

As a banking customer, you own your data, and retain full control over access to your data (even more so with the introduction of GDPR), and are not obliged to share your data if you don't want to.  Additionally, at the heart of all Open Banking customer journeys, is the process by which explicit (and repeated) customer consent must be granted to a TPP before they can access bank account information or initiate payments.   

Initially, the focus for Open Banking compliance was the “CMA-9”, the 9 largest banks out there, namely HSBC, Barclays, NatWest, Santander, Bank of Ireland, Allied Irish Bank, Danske, Lloyds and Nationwide, but has since expanded to include some of the non-CMA banks that have in-scope payment accounts.  

Before I go any further, let me explain some of the fundamental Open Banking terminology (stay with me on this..).

**Account Information Service Providers (AISP)** are authorised to retrieve account data provided by banks and building societies.  For example, a money management app such as [Yolt](https://www.yolt.com) aggregates current accounts data (based on giving explicit consent) across a variety of banks, to help you manage your accounts in a more informed way.

**Account Servicing Payment Service Providers (ASPSP)** are banks or building societies that publish Read/Write APIs to allow (with customer consent) Third Party Providers to access customer account information and initiate payments.  To complicate things further, an ASPSP could also be a TPP (see below).

**Cards Based Payment Instrument Issuer (CBPII)**  is a nuance in the UK right now, with very few real world use cases.  This gives customers the option to initiate card-based payments from payment accounts held by an ASPSP (e.g. an independent credit card provider allowing you to pay from your bank account).  One of the few TPPs providing this service in the UK is [Currensea](https://www.currensea.com) – a travel money card that connects to your bank.

**Common & Secure Communication (CSC)** is one of the two fundamental principles of the Regulatory Technical Standards, whereby Banks need to open up access to customer data and enable payments via a set of secure, common APIs.  The goal being that Third Party Providers can transition away from out-dated and insecure “screen scraping” of customer data to a more secure method for accessing data via APIs. 

**Payment Initiation Service Providers (PISP)** provide an authorised online service (usually via a Third Party Provider app) to initiate payments into or out of a user’s account.

**Strong Customer Authentication (SCA)** is the second of the two fundamental principles of the Regulatory Technical Standards, which ensures that an extra layer of authentication security is introduced into an APSPs online payments journey to “step up” a user when authenticating.  Typically this is based on the use of two or more elements known as knowledge (something a user knows i.e. a password), possession (something the user owns e.g. mobile phone and SMS PIN) and inherence (something the user is, e.g. fingerprint, iris scan).

**Third Party Providers (TPP)** develop custom applications (usually mobile apps) that integrate with the APIs of ASPSPs (Banks) to provide account information and /or payment initiation services on behalf of customers. TPPs are either/both Payment Initiation Service Providers and or/Account Information Service Providers.

## Lessons learned from my experience of implementing Open Banking APIs

As a technology delivery consultant working in the Financial Services sector, I became very well versed with the nuances of Open Banking, working with a UK challenger bank, leading a complex technology project to implement a compliant and operational Open Banking API solution.  Additionally, within Scott Logic our development teams have worked extensively with some of the largest UK banking groups to implement highly performant Open Banking API services.

Here’s my own top 10 lessons learned when implementing an Open Banking API technical service in a bank (in no particular order):

**1. The Open Banking Standard is a moving target**

Like all new standards, the features of Open Banking are evolving on a regular basis.  In March 2020 version 3.1.5 of the Standard was released, including updates to the Read/Write API specification, Customer Experience Guidelines and Operational Guidelines.  
When your programme team are head down in the midst of delivery, significant scope changes can be a distraction.  
Mitigate this by ensuring you build change management budget (and capability) into your forecasts, to ensure any updates required can be accommodated. 
Ensure development teams build code with change in mind, including robust configuration management and API versioning techniques.  Additionally the need to have a robust, automated test suite becomes of paramount importance.

**2. Ensure you have an adequate budget for an OpenBanking programme** 

This point should not be overlooked, Open Banking cuts across banking products and business areas, and hence the change delivery effort involved should not be underestimated.  Also see point 1 above – don’t forget the ongoing operational expenditure change budget!

**3. Get very well acquainted with the Customer Experience and Operational Guidelines**

These documents are your bibles, ensure your delivery and operational teams read and understand the contents.  Specifically, the UX and development teams should ensure all customer experience journeys comply with the [Customer Experience Guidelines](https://standards.openbanking.org.uk/customer-experience-guidelines/introduction/section-a/latest/).   
The [Operational Guidelines](https://standards.openbanking.org.uk/operational-guidelines/introduction/latest/) should also be a point of reference during design, development, test and operational acceptance.  This provides key indicators for your systems availability & performance, and a useful [checklist](https://standards.openbanking.org.uk/operational-guidelines/the-operational-guidelines-checklist/checklist/latest/) to benchmark against. 

**4. Don’t overlook the operational change needed across the Bank**

Once the blood, sweat and tears of delivering the technology programme are over, this is just the start of the journey.  There are a myriad of impacting operational changes needed to support Open Banking.  For example, this may include an uplift to the 24x7 IT support team, creation of new processes and procedures, mobilising a team (and appropriate technology) to manage Third Party Provider queries relating to your APIs, putting in place a process and solution for regular submission of FCA and Open Banking mandated reports. 

**5. Gear up for testing, lots of it**

There are a huge number of moving parts within an Open Banking API solution, so start planning your test approach early, with as much automated testing as possible.  
Open Banking testing also has its own nuances, so build in upskilling time for testers to get fully up to speed.  The test scope is likely to include contract API system testing, regression testing of amended systems, non-functional performance and load tests (that meet the Operational Guideline benchmarks), 3rd party security penetration tests, end to end system integration tests and User Acceptance Testing (UAT), ideally with a variety of TPPs, before go live.   
Open Banking also provides a useful suite of custom testing tools (functional conformance and security conformance suite) which are designed to provide (certified) assurance that banks APIs conform to the latest OBIE Standards - build these into your overall test strategy. 

**6. Ensure you understand the Open Banking MI Reporting Requirements**

Reporting is a significant area of an Open Banking technology solution, and should be factored into your solution design, budgets and resourcing.   At a high level the purpose of the reporting is three-fold:

(1) To ensure that Banks have implemented effective and high-performing interfaces while fulfilling their regulatory obligations. 

(2) To ensure that Third Party Providers (TPP) have access to consistently well-designed, well-functioning and high performing dedicated interfaces. 

(3) To ensure that consumers and SMEs using TPP services have positive experiences that encourage them to continue to consume open banking-enabled services

The Open Banking Implementation Entity (OBIE) provide recommended benchmarks, and at a bare minimum,  banks are required to report (via their website and via quarterly submissions to the FCA and OBIE):

* Availability (99.5% across all interfaces)
* Performance and response times (average 1000 milliseconds per 1MB per response)
* Success and daily error response rates for API calls (average of 0.5% across all endpoints)

**7. Implement holistic System Monitoring**

As mentioned above, there are very clear OBIE benchmarks for system availability, and significant unplanned outages need to be reported to the FCA.  The need for robust and accurate system monitoring (across both applications and infrastructure) is critical for a bank to confidently operate and run a robust Open Banking service.   Therefore, ensure monitoring is an inherent part of your technical solution, and is fully road tested before you launch into production.

**8. Engage Third Party Providers (TPP) as early as possible**

OBIE requires banks to evidence “wide usage” of their APIs (over and above TPP access in the form of research, testimonials or TPP reviews).   Aim to develop ongoing working relationships with as many “friendly” Third Party Providers as possible (OBIE can assist), and include them early in your testing strategy, specifically early live proving of your interfaces.

**9. A mature DevOps process is critical for API microservice build deployments**

Adopting a DevOps mindset early on is crucial in the Open Banking journey.  Combining iterative development with stability testing for APIs, microservices and frameworks, will help to minimise deployment outages and ensure you can maintain future regulations on API performance standards.

Ultimately, the objective of DevOps is to increase agility in an organisation. Especially for large banks, this signifies a need to move away from the traditional “waterfall” development life cycle to adopt a much more agile approach.

Invest in the correct tooling and capabilities to monitor the Continuous Integration/Continuous Delivery (CI/CD) pipeline, for faster response to issues and improved uptime.  As organisations ‘sunset’ old monolithic architectures, bitesize services are arguably more appropriate for modern banking; however, they come with unique caveats that DevOps can address.

**10. Ensure your technology partners have proven OpenBanking credentials** 

Many suppliers during the sales pitch will confirm they have deep OpenBanking experience, the reality can sometimes be very different!  Speak to a supplier's previous clients for honest feedback, and ensure you go into the supplier partnership with full confidence in their ability to deliver.   

Why not put Scott Logic to the test.  We would love to talk you through our Open Banking credentials and how we could help you...

## Real world Open Banking use cases
The use cases for Open Banking should not solely focus on the third party apps.  Banks are now investing in their API services,  beyond the minimum regulatory compliance requirements.  Real opportunities exist for banks to provide customers with new services such as single sign-on, payment with rewards points and credit access, plus the ability to export data to personal finance managers or small business accounting apps like Sage and Xero.

The two most common use cases that are mentioned in the context of Open Banking are usually account aggregation and payments. However, the real world use-cases go way beyond that and include:

**Money management** 
One way to deliver value for customers is to help them manage their finances better using dashboards and other useful financial tools.  Open Banking will enable customers to see their spending compared to previous months and make more informed decisions on purchases and savings/investments.

**Mortgage applications** 
Streamlining the application and decision process by sharing transactional customer data electronically.  Customer bank account data is extremely useful as part of a real time risk calculation, providing useful insight into income and spending habits.

**Tailored price comparison** 
By sharing customer data , much more targeted products (that match spending habits and ability to repay on time) can be offered.

**Money saving offers** 
By partnering with retailers, third party providers can analyse spending habits and provide personalised offers on our favourite products, whilst also recommending other products that match our spending habits, ultimately saving money on the weekly shop. 

**Automated product switching** 
The real-time sharing of transactional data will enable developers to see when  a customer’s income has fallen, or if their outgoings are increasing dramatically. In either case, it becomes possible to automatically change mortgage / loan repayments or even switch products, to reduce the risk of default, based on the analysis of a customer’s behavioural information.  

For a full list of all apps available, Open Banking has recently developed a useful [App Store](https://www.openbanking.org.uk/app-store/) where you can find a wide range of open banking mobile applications and online products, available for everyday use from some of the UK’s leading providers.

As Open Banking evolves, banks should leverage this as an opportunity to:

**Develop the brand**

Open Banking can deliver a greater level of personalisation in the provision of services to the customer, and an opportunity to strengthen and grow your relationship with the customer by demonstrating that you understand their needs.

**Enhance loyalty**

Banks now have more opportunities to partner with FinTechs, to enable their customers to automatically reap the benefits of retailer loyalty programmes every time they use their credit card.

**Deliver an enhanced customer experience**

Today's "tech savvy" customers expect instant service and access to a suite of high-quality digital products. Customers want this provided in a personalised, easy to use way, with 24x7 access.  Helping customers extract value from their data, and improve their lives through its use, is key.  For example, simply pre-qualifying customers for products could help provide an improved customer experience and increase credit application conversion rates. 

**Reduce risk**

Open Banking provides the opportunity to access more historical customer data , including income and expenditure via statement data.  For example, using more accurate data to assess affordability, means a bank can manage a customers risk profile,and make instant decisions in real time whilst also improving the customer experience. This will result in customers gaining access to credit based on a detailed assessment of their ability to repay (and not default!).  

**Reduce debt**

Open Banking could also reduce the risk of customers falling into arrears.  With access to spending trends, and a future forecast of spending habits across the customers complete financial portfolio, banks can work more collaboratively with customers to support those who may find themselves in financial difficulties.  

## The Evolution of Open Banking

The era of Open Banking is just starting.  The UK is “90% of the way” through the first implementation phase, in 2020 the number of people in the UK using Open Banking technology surpassed one million (taken from data released by the [Open Banking Implementation Entity](https://www.openbanking.org.uk/about-us/latest-news/open-banking-adoption-surpasses-one-million-customer-mark/)).  

Undoubtedly, the ecosystem will continue to grow, as more and more third party providers enter the market to tempt us with their shiny new apps.   The winners will be the true market disruptors who can provide a unique customer focused service, successfully leveraging customer data with complex Artificial Intelligence (AI) algorithms, to ensure we are offered (or automatically transferred onto) the most competitive consumer deals available (think Martin Lewis in your pocket!).   

However, this is just the beginning.  There are discussions happening now, regarding new FCA regulation termed **Open Finance**, whereby the core principles of Open Banking (securely sharing customer data with 3rd parties), is extended to other financial products.   In the words of the FCA,

_"Open finance would extend open banking principles to give consumers and businesses more control over a wider range of their financial data, such as savings, insurance, mortgages, investments, pensions and consumer credit. It has the potential to deliver transformative benefits for consumers and open finance participants alike.”_  

Open Finance is currently at the early _“Call for Interest”_ phase with comments due by October 2020, but has the potential to be a real game-changer if it comes into force next year.

In my next blog article, I will be delving deeper into the opportunities that Open Finance could bring, so watch this space.   

If you would like to discuss how Scott Logic could help with your Open Banking implementation, please get in touch with [Nick Betts](mailto:nbetts@scottlogic.com) at Scott Logic.
