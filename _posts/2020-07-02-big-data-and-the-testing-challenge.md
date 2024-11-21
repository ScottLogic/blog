---
title: Big Data and the Testing Challenge
date: 2020-07-02 00:00:00 Z
categories:
- Data Engineering
author: ahickman
layout: default_post
summary: This blog is about tools that help address the challenge of testing systems
  which handle large data volumes. We’ll see why creating a large, realistic and valid
  test data set is hard, how test data generators can help, and compare some of those
  available.
image: ahickman/assets/2020-06-01/Database-growth.png
---

![Exponential Data Growth]({{ site.github.url }}/ahickman/assets/2020-06-01/Database-growth.png "Data Growth"){:width="40%" style="float:right"}

The huge rise in data volumes over the past few years has been well documented. So have many of the associated challenges: storage of that data; analysing and searching that data; ensuring appropriate retention, security and governance of that data; and designing performant systems that can do all these things. But one of the challenges that receives less attention is how to test systems that manage large data volumes. 

This isn’t a theoretical problem: the Coronavirus pandemic has caused demand spikes in many IT systems, with [online retailers’ websites and apps crashing](https://www.theguardian.com/business/2020/mar/13/morrisons-speeds-up-payments-to-small-suppliers-because-of-coronavirus) and some [stock exchanges seeing double to triple increases in trading volumes](https://finance.yahoo.com/chart/%5EFTSE#eyJpbnRlcnZhbCI6ImRheSIsInBlcmlvZGljaXR5IjoxLCJjYW5kbGVXaWR0aCI6MTIuNTU2OTYyMDI1MzE2NDU1LCJmbGlwcGVkIjpmYWxzZSwidm9sdW1lVW5kZXJsYXkiOnRydWUsImFkaiI6dHJ1ZSwiY3Jvc3NoYWlyIjp0cnVlLCJjaGFydFR5cGUiOiJsaW5lIiwiZXh0ZW5kZWQiOmZhbHNlLCJtYXJrZXRTZXNzaW9ucyI6e30sImFnZ3JlZ2F0aW9uVHlwZSI6Im9obGMiLCJjaGFydFNjYWxlIjoibGluZWFyIiwicGFuZWxzIjp7ImNoYXJ0Ijp7InBlcmNlbnQiOjEsImRpc3BsYXkiOiJeRlRTRSIsImNoYXJ0TmFtZSI6ImNoYXJ0IiwiaW5kZXgiOjAsInlBeGlzIjp7Im5hbWUiOiJjaGFydCIsInBvc2l0aW9uIjpudWxsfSwieWF4aXNMSFMiOltdLCJ5YXhpc1JIUyI6WyJjaGFydCIsIuKAjHZvbCB1bmRy4oCMIl19fSwibGluZVdpZHRoIjoyLCJzdHJpcGVkQmFja2dyb3VuZCI6dHJ1ZSwiZXZlbnRzIjp0cnVlLCJjb2xvciI6IiMwMDgxZjIiLCJzdHJpcGVkQmFja2dyb3VkIjp0cnVlLCJyYW5nZSI6eyJkdExlZnQiOiIyMDIwLTAyLTAzVDAwOjAwOjAwLjAwMFoiLCJkdFJpZ2h0IjoiMjAyMC0wNS0yN1QyMjo1OTowMC4wMDBaIiwicGVyaW9kaWNpdHkiOnsiaW50ZXJ2YWwiOiJkYXkiLCJwZXJpb2QiOjF9LCJwYWRkaW5nIjowfSwiZXZlbnRNYXAiOnsiY29ycG9yYXRlIjp7ImRpdnMiOnRydWUsInNwbGl0cyI6dHJ1ZX0sInNpZ0RldiI6e319LCJjdXN0b21SYW5nZSI6eyJzdGFydCI6MTU4MDY4ODAwMDAwMCwiZW5kIjoxNTkwNTM0MDAwMDAwfSwic3ltYm9scyI6W3sic3ltYm9sIjoiXkZUU0UiLCJzeW1ib2xPYmplY3QiOnsic3ltYm9sIjoiXkZUU0UiLCJxdW90ZVR5cGUiOiJJTkRFWCIsImV4Y2hhbmdlVGltZVpvbmUiOiJFdXJvcGUvTG9uZG9uIn0sInBlcmlvZGljaXR5IjoxLCJpbnRlcnZhbCI6ImRheSJ9XSwic3R1ZGllcyI6eyLigIx2b2wgdW5kcuKAjCI6eyJ0eXBlIjoidm9sIHVuZHIiLCJpbnB1dHMiOnsiaWQiOiLigIx2b2wgdW5kcuKAjCIsImRpc3BsYXkiOiLigIx2b2wgdW5kcuKAjCJ9LCJvdXRwdXRzIjp7IlVwIFZvbHVtZSI6IiMwMGIwNjEiLCJEb3duIFZvbHVtZSI6IiNmZjMzM2EifSwicGFuZWwiOiJjaGFydCIsInBhcmFtZXRlcnMiOnsid2lkdGhGYWN0b3IiOjAuNDUsImNoYXJ0TmFtZSI6ImNoYXJ0IiwicGFuZWxOYW1lIjoiY2hhcnQifX19fQ%3D%3D) during March. Ensuring your systems cope with these scenarios is critical, but is often expensive and not straightforward.


This blog is about test tools that address the challenge of testing large data volume systems. We’ll see why test data generators can help you, what you need from a test data generator and why we decided to build our own.


Ultimately this will enable you to test more effectively – offering improved test coverage of large data systems, with less tester effort.

## Types of test data

Many testing approaches and hundreds of testing tools exist and they nearly always require testers to specify some kind of test data. This might be a developer crafting a function input for a new unit test, or a UX designer creating some “real looking” data for their usability testing session. Most often this test data is created manually, even when the tests themselves are automated.

Let’s consider some very broad areas of testing, alongside the characteristics of test data they tend to need.

| **Test area** | **Volume of test data per test case** | **Importance of test data realism** | **Need for test data fields to be precisely specified** |
|:--------|:-------:|:--------:|:--------:|
| **Functional testing**<br>E.g. unit testing, component testing, API testing, integration testing, system and UI testing | Low | Low | High |
| **Other**<br>E.g  Usability testing and Demos | Low / Medium | High | Medium |
| **Non-functional testing**<br>E.g. performance / speed testing, soak / endurance testing, load testing, scalability | High | Medium | Medium |

These characteristics influence the best method for creating test data. Broadly speaking, there is less advantage in using test data generators for functional and usability testing where the volume of test data is lower, but there are still reasons to do so:

* For some types of functional testing, generated test data can dramatically improve test coverage. For example, it enables techniques such as fuzzing or more exhaustive system/UI/API input testing to make negative testing and system security testing far more comprehensive, without entailing unreasonable extra effort.

* For demos and usability testing, generated test data allows larger, more representative data sets to be created, enabling more compelling, lifelike demos. It also makes it much easier to update the test data as the system and data models evolve.

But it’s for non-functional testing where test data generators really come into their own.

## Why are data generators so useful for non-functional testing?

Let’s consider in more detail the last row in the table above, starting with the test data volume column.

Your tests might show your system is fast enough or stable enough with modest data loads, but you need to be sure this will remain true as the data volume increases. Perhaps you need to test your auto-scaling or high load scenarios and your test data needs to simulate these conditions. Consequently, many types of non-functional tests need a large test data set regardless of the system design. What’s more, if it’s a system that is designed to handle large data volumes, this test data set will likely need to be very large indeed to induce scaling or performance slowdowns.

What about the realism of the data? The data set also needs to be representative, but doesn’t need to be exactly the same as production data. In fact, if it’s solely for a load or performance test, the test data could probably be nonsense! The requirement here is that the data is representative enough that the system will behave the same as it will with production data – in other words, you want the size and nature of the data to be comparable to production data but it doesn’t need to be identical.

Finally, while each data entry probably doesn’t need to be exactly specified to meet the particular needs that a functional test would have, it does need to be syntactically and semantically valid. For example, it might need to be a certain format (such as a date), contain so many characters, fall within a range, etc.

To create one of these very large, representative and valid data sets, there are two common approaches:

1. Create a much smaller subset manually and use custom scripts to “multiply up” the size of the data set.
2. Use tools to anonymize an existing production data set.

But there are problems with both approaches:

* Sometimes tests need to have specific date values for the test to be meaningful – the test data needs to be aged. If data aging is required, both the above approaches require some kind of additional data manipulation often needing manual input.
* Both approaches are error prone and any errors are usually hard to spot.
* Data security and regulatory requirements – such as GDPR and PCI – require that actual production data must not be used. Being 100% certain that an anonymizer hasn’t allowed personally identifiable data to “leak” into your data set isn’t trivial and in many organizations requires a formal audit of the data before it can be used.
* If your system is brand new you won’t yet have production data, but you still need to test it. Even if your system is already live it may not have production data corresponding to the new feature you’re adding.
* Just because you have production data doesn’t mean you have it in sufficient volume to test high load scenarios.

As a result, for both approaches the test data takes time to create and involves costly manual steps. Worse, each time the data model, system design or test design changes, creating a new test data set entails that cost again. The good news is that a test data generator can address all these drawbacks.

## The ideal test data generator

OK, so we need a tool that is going to create a large, representative and valid set of test data. What does the ideal tool look like? It needs to satisfy a few requirements.

| ![Happy Tester]({{ site.github.url }}/ahickman/assets/2020-06-01/Smiley.png "Happy Tester"){:width="400"} | It is easy to use. In particular, it does not require testers to have programming skills. |
| ![Data Types]({{ site.github.url }}/ahickman/assets/2020-06-01/Data-types.png "Data Types"){:width="400"} | It can create a range of different data types, enabling testers to choose or specify a strict syntax for fields, as well as define and customise their own data types if the out-of-the-box types don’t support their needs. |
| ![Relationship]({{ site.github.url }}/ahickman/assets/2020-06-01/Relationship.png "Relationship"){:width="400"} | It allows expression of complex relationships between fields, to reflect the business domain and ensure realistic data sets and relationships are created. |
| ![Declarative]({{ site.github.url }}/ahickman/assets/2020-06-01/Declarative.png "Declarative"){:width="400"} | It specifies the test data declaratively and minimally in a simple configuration file. This has two advantages. First, when business rules and data models change the test data set can be updated via quick, simple changes to the file, rather than manual or scripted changes to millions of data entries. Second, it makes the definition of the test data ‘self documenting’; i.e. can easily be related to the associated domain and its data model. |
| ![Large Data]({{ site.github.url }}/ahickman/assets/2020-06-01/Large-data.png "Large Data"){:width="400"} | It can create very large - possibly Terabyte - data sets in seconds or minutes, making test data updates quick and easy, as well as a usable step in a Continuous Integration pipeline. |
| ![Automated]({{ site.github.url }}/ahickman/assets/2020-06-01/Automated.png "Automated"){:width="400"} | It does not rely on costly manual effort to create or update the data set. For example, there shouldn’t be a need for manual intervention as part of the generation process. This makes the tool usable in a Continuous Integration pipeline and means only the small configuration file needs to be placed under source control and not not the potentially massive data set. |
| ![Output Formats]({{ site.github.url }}/ahickman/assets/2020-06-01/Formats.png "Output Formats"){:width="400"} | It can output data sets in i) a variety of formats, such as CSV and JSON; and ii) structures, such as a simple, column based table, relational database, or tree structured (e.g. arbitrary XML). It is not a goal to support the vast range of possible storage formats, but to ensure that it is straightforward to import the test data into most systems, possibly via a script. |
| ![Free]({{ site.github.url }}/ahickman/assets/2020-06-01/No-money.png "Free"){:width="400"} | It is cheap, ideally free, and does not have restrictive licensing constraints. |

Ideally it can also automatically learn from or profile sample data sets, such as production data, to make it easier to create test data sets and have confidence they are truly representative.

## Which data generator should I use?

Many excellent test data generators are available, including:

* [Mockaroo](https://mockaroo.com/). Mockaroo has support for a very rich set of data types with high degree of realism. Over certain usage limits it is charged for and its HTTP API based design (SaaS) means it is not well suited for fast creation of extremely large data sets.
* [GetRocket](https://www.genrocket.com/). GenRocket provides very comprehensive functionality and test data management. However, all versions are paid for.
* [Amazon Kinesis Data Generator](https://github.com/awslabs/amazon-kinesis-data-generator). This open source tool is focussed around sending test data to Amazon Kinesis Streams and Firehose.
* [TSimulus](https://tsimulus.readthedocs.io/). While open source, this tool specialises in generating time-series data, so isn't well suited to more general purpose test data generation.
* [Data Generator for SQL Server](https://www.devart.com/dbforge/sql/data-generator/). This commercial tool has excellent support for realistic data types, is GUI driven, and is focussed on generating test data for import into relational databases.

So why did we create another test data generator? With DataHelix we wanted a tool that was open source and free to use, with a focus on generation of large data sets very fast. Realism of data, while important, wasn't the top priority, so it supports a range of common data types and a mechanism to extend those types for those that need more. The ability to express relationships between fields of data was critical, as was support for a simple declarative syntax that could be used by developers and non-developers alike and could easily be slotted into a Continuous Integration pipeline.


## DataHelix

DataHelix is open source and was created in partnership with [FINOS](https://www.finos.org/). It has already been used as part of a financial services project to create a test data set requiring 180 million rows, and to support the Government with their response to COVID-19. We have seen DataHelix quickly provide value to our clients and hope the wider community will find it useful too.
You can find out more about the DataHelix project [on Github here](https://finos.github.io/datahelix/). Although DataHelix has some out-of-the-box support for common data types of the financial services industry, the vast majority of the tool is generic and applicable to a range of business domains.

There is a [DataHelix playground](https://finos.github.io/datahelix/playground/), if you are interested in seeing it in action. Alternatively, if you would like to see a particular feature added [please request it](https://github.com/finos/datahelix/issues/new/choose).
