---
published: true
author: cyule
layout: default_post
title: The UX of Consent Models in Open Banking
summary: >-
  Open Banking came into force in January 2018. It was introduced to shake-up
  the fundamentals of the UK financial sector by aiming to create competition
  and foster collaboration. This blog post will take a brief look at what Open
  Banking means for the user experience by reviewing some of the current Consent
  Models (permissioning flows) for adding a users’ bank account to the account
  aggregator Yolt.
tags: >-
  OpenBanking, Open, Banking, User Experience, UX, Featured, UX Design, Consent
  Models, Consent Flows, Monzo, Starling, CMA 9, featured
categories:
  - UX Design
image: cyule/assets/featured/openbanking.png
---


[Open Banking](https://www.openbanking.org.uk/) came into force in January 2018. It was introduced to shake-up the fundamentals of the UK financial sector by aiming to create competition and foster collaboration. It forces the [CMA 9](https://www.gov.uk/government/publications/retail-banking-order-2017-directions-issued-to-5-banks) (the nine biggest UK banks) to open up their APIs to Third Party Providers (TPPs) so they can access users’ financial data in order to create new financial services, applications and technology. As with other significant initiatives, it has inevitably experienced some stumbling blocks. This has mostly been from a technical and user adoption perspective. One of its main challenges is increasing consumer trust, and helping users understand that their data is secure when their accounts are connected via API. This blog post will take a brief look at what Open Banking means for the user experience by reviewing some of the current Consent Models (permissioning flows) for adding a users’ bank account to the account aggregator [Yolt](https://www.yolt.com/).



## Screen-Scraping vs Connecting via an API

In the past, the banks have typically not had APIs that were available to TPPs. To get around this obstacle, TPPs could ask users for their bank’s login credentials in order to screen-scrape the user’s data by logging in to their online banking account acting as them. There is still a lot of debate around the security of screen-scraping, since you are effectively giving another party your banking credentials. This approach also introduces issues around robustness and reliability of the data because it needs to be reactively re-designed every time a bank amends its online banking interface. In comparison, data sharing via APIs is more secure than screen-scraping because the user should be aware of the exact info that is being shared, can revoke access to the data much more easily, and most importantly their login credentials are not shared. 



## The Recommendations

[The Open Banking Implementation Entity (OBIE)](https://www.openbanking.org.uk/about-us/), a company set up by the CMA in 2016 to deliver Open Banking, released some [Open Banking Consent Model Guidelines](https://www.openbanking.org.uk/wp-content/uploads/Consent-Model-Part-1-Implementation-Guide.pdf) back in October 2017. The document outlines recommendations and best practices which can help improve the user experience when people are trying to connect their bank accounts to a third party application.

Although these recommendations are directly aimed at the CMA 9 banks, there are a number of challenger banks who have made their APIs available, taking advantage of open APIs to help their customers better manage their finances. These challenger banks can also make use of these recommendations, but are not limited by them, so a difference in their consent flows in comparison to the incumbent banks can often be observed, as this blog post will go on to discuss.

Below is an OBIE example of a consent model whereby the user is connecting their bank account (‘Greenview Bank’) to a third party app (‘Tree Quote’):

<a href="{{site.baseurl}}/cyule/assets/OBIE example thin-min.png">![OBIE example thin-min.png]({{site.baseurl}}/cyule/assets/OBIE example thin-min.png)</a>


This clearly shows the three stages of the user flow suggested by the OBIE. 

1. **Consent Stage** - The application lets the user know what information it requires from the bank and why, and asks for consent to contact the bank. The user must explicitly opt in, and they are reminded that this permission is time-bound in order to make the user feel that they remain in control of their data.

2. **Authentication Stage** - The bank takes over the experience, verifying the user’s identity and reassuring them that the TPP can not see their credentials. The OBIE suggests making this step distinctive from the TPP’s part of the flow to make the user feel more reassured. They also suggest that banks use the same login/credentials process as their online banking to further create familiarity and trust.

3. **Authorisation Stage** - The bank tells the user which information they are about to share with the TPP, and asks the user to authorise this sharing of account information. According to the OBIE this additional step is supposed to increase positive friction. 

[OBIE’s research](https://www.openbanking.org.uk/wp-content/uploads/Consent-Model-Part-2-User-Experience-Guide.pdf) found that less technical users (who they suggest make up the larger section of the Open Banking demographic) prefer to have both the consent and authorisation step for added clarity and security reassurance. However, those who may be more technically or financially advanced (20% of the market), would be happy to combine the authentication and authorisation steps as one. These users believe this would increase the speed and efficiency of the process without compromising on safety and customer understanding.



## The Reality

While the OBIE’s recommendations seem clear and considered, TPPs face the significant problem that they have no control over what the banks do during their part of the consent flow, despite this impacting through association the user’s impression of the TPP. The user experience of their application could be great, but users may be put off connecting their accounts if the consent flow is laborious or seemingly insecure, rendering the application itself useless if it can’t get access to the account information it needs. If this consent flow can be standardised in some way across banks and TPPs it would be sensible to presume that this may create familiarity and confidence with users that should lead to increased engagement and adoption.


The rest of this blog post will explore this issue by reviewing some current examples of connecting your financial information to [Yolt](https://www.yolt.com/), an FCA-approved application and one of [Open Banking’s regulated providers](https://www.openbanking.org.uk/customers/regulated-providers/). At the time of writing not all banks can be connected in Yolt by syncing with an API for a variety of reasons, but they announced in April 2018 that they were now connected to RBS Group, Lloyds Banking Group, Nationwide and Danske Bank. This blog will review some consent flows from CMA 9 banks connected either via Open Banking-enforced APIs or through screen-scraping, as well as taking a look at some of the API connected challenger banks.



### Bank of Scotland & Yolt Consent Flow

<a href="{{site.baseurl}}/cyule/assets/Bank of Scotland thin-mini.png">![Bank of Scotland thin-mini.png]({{site.baseurl}}/cyule/assets/Bank of Scotland thin-mini.png)</a>



Bank of Scotland (BOS), part of the Lloyds Banking Group (one of the CMA 9), can be connected to Yolt via an Open Banking-enforced API. It looks like BOS have followed the OBIE recommendations very closely, splitting the journey into the three main steps: consent, authentication and authorisation. They make it clear that the user’s credentials will not be shared with the third party app (Yolt), the data is time bound and can be revoked at any time, and make sure that the user explicitly opts in to the request. They also provide some helpful FAQ pages during the flow in case users become unsure during the process, and make it fairly clear to the user which stage of the journey they are currently in. BOS also make their part of the consent flow resemble their own online banking, asking for the same logins, passwords and memorable information, in order to increase familiarity and trust with their customers. The act of redirecting to a web-page, where the user can see the secure mode icon should also reassure those users that regularly use online banking through the web, that their connection is secure, again increasing familiarity.


However, this is one of the longer consent flows encountered since BOS repeats the consent request and offers the log-in as both a second consent confirmation and the first step of the authentication. Although this contributes towards the idea of creating ‘positive friction’ to incite feelings of security and control for the user, it does make the process seem repetitive, with the consent object (what information will be shared) being repeated across three different steps, each presenting the request in slightly different ways. If the sections in a flow are very repetitive and verbose, often users will skim-read which reduces the usefulness of these sections, and may lead to issues in the future if a small but important detail is missed.

The Bank of Scotland consent flow certainly  follows the OBIE recommendations but the user experience, particularly for more advanced users, is laborious, and therefore possibly off-putting.



### RBS & Yolt Consent Flow

<a href="{{site.baseurl}}/cyule/assets/RBS-thin-min.png">![RBS-thin-min.png]({{site.baseurl}}/cyule/assets/RBS-thin-min.png)</a>



RBS, another of the CMA 9, has a slightly more efficient consent flow. It, like BOS, adheres to the three step process of consent, authentication and authorisation, and again uses a web journey to create a distinct experience from the third party’s section of the model. Again, the same credentials used for online banking are required, but in contrast to BOS, users who bank with RBS can actually select which specific accounts they would like to connect to Yolt. This helps give the users more control of their data, with some users potentially only feeling confident sharing their less important accounts to begin with as a first foray into Open Banking.

It is also worth mentioning that for banks connected via Open Banking-enforced  APIs, Yolt itself has included some helpful features that improve the UX of the consent flow. They show a link during the consent step that provides the user with information on what syncing via Open Banking means for them. Once an account has been authorised, they also show a buffer step that makes it clear to the user that they are moving away from their bank’s part of the flow, and their information is being organised. This increases the visibility of the system status to the user and increases their perception of control, providing them with help during the task itself.



### Santander & Yolt Consent Flow

<a href="{{site.baseurl}}/cyule/assets/Santander thin-min.png">![Santander thin-min.png]({{site.baseurl}}/cyule/assets/Santander thin-min.png)</a>


Santander, at the time of writing, is not connected to Yolt via API despite being one of the CMA 9. When analysing this flow an important point arose relating to the clarity and transparency of how TPPs are connecting to user’s bank account information. The flow here is almost identical to that provided when a bank is connected via API, except for a few important details: the ‘Sync to Online Banking’ help link, the mention of a consent period and the reassurance from the bank that the TPP can not view their credentials are missing. In this instance the app is likely screen-scraping the data from the user’s bank account by logging in as them. However, by only having to input minimal credentials, and with no additional authorisation or consent steps to go through, it does, arguably, make the consent flow slightly more efficient than the previous examples. The user can just input their login details and their account is connected. The issue here is that it may not always be clear what exactly you are handing over to the TPP. Without this clarity, it potentially creates a feeling of mistrust, and may put users off connecting their accounts altogether.



### Monzo & Yolt Consent Flow

<a href="{{site.baseurl}}/cyule/assets/Monzo thin-min.png">![Monzo thin-min.png]({{site.baseurl}}/cyule/assets/Monzo thin-min.png)</a>



The next couple of flows are from challenger banks. Under Open Banking they are not forced to provide APIs yet, unlike the CMA 9, but they obviously see the benefit in making them available and can therefore connect to Yolt without screen scraping user’s data.

However, the consent flows that both Monzo, shown here, and Starling Bank (as we will discuss next) follow within Yolt are quite distinct to what the other API connected banks are using. These approaches have their own pros and cons, but this inconsistency can be confusing to users who may be wondering if these challenger banks are indeed connected via API and whether or not the TPP can view their credentials.

Both Monzo and Starling Bank do the authorisation and authentication through their own apps. This increases the efficiency of the consent flow and may reduce repetitive steps, but, on the other hand it may not create enough positive friction for the less technical users. Monzo uses an email confirmation to log in to their app and authenticate the data sharing, keeping the user informed of what is happening at each stage. They also repeatedly call out the name of the TPP so the user is reassured that the information matches up. Monzo informs the user of a list of information that the TPP will be able to see, but does not explicitly state that there will be a consent period, or that the TPP will not be able to view their credentials. This may cause some confusion and mistrust from some users who would prefer this to be clarified. Monzo also uses the text, “You are about to give this app access to your account.” in one of the screens, which does not necessarily offer enough context and may cause confusion with some users interpreting that as ‘the TPP can log in to my account pretending to be me’, which is not the case, as according to all literature and Monzo advice, it does not screen-scrape.This links back to the idea that non-consistent consent flows across Open Banking reduce trust, ultimately reducing user engagement and adoption overall.


Although some users may have questions about the clarity and security of this consent flow, in comparison to some of the other examples, as mentioned this flow is quite quick and efficient. The user only needs to enter an email address and click a link to authenticate the use of their data; certainly more helpful for the more technically minded users who have less doubts about the security of their data in this instance.



### Starling Bank & Yolt Consent Flow

<a href="{{site.baseurl}}/cyule/assets/Starling Bank thin-min.png">![Starling Bank thin-min.png]({{site.baseurl}}/cyule/assets/Starling Bank thin-min.png)</a>



The final consent flow I’d like to look at is for Starling Bank; who Yolt promoted as their first integrated digital challenger bank. This consent flow certainly has the least steps, with authentication through use of a pincode. This provides a quick and easy solution in contrast to entering usernames, passwords and memorable information. Authentication through the app also makes the flow pretty secure. 

However, again we see no indication of how long the data consent will last, and no reassurance that the TPP can not see the credentials. This point may come down to the question - ‘Do we actually need this reassurance?’. Well, from the OBIE's research apparently some users do, and if these users do indeed make up a large percentage of the Open Banking demographic, then we must cater to their needs.

It is also worth noting that Starling Bank make it fairly easy to revoke access to apps using their data through their own app. However in contrast there is currently (at time of writing) no way of doing this directly through the Monzo app.



## Conclusions

Overall, there is still a long way to go with Open Banking irrespective of the technology side, but a lot of what will help in terms of user adoption and engagement will be through paying close attention to creating clear, efficient and consistent user experiences. This doesn’t just apply to the third party providers who create innovative new applications, but also to the banks, who will need to engage in collaboration to stay ahead of the game and discover new and exciting sources of revenue.
