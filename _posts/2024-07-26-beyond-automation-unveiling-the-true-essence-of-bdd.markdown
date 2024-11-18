---
title: 'Beyond Automation: Unveiling the True Essence of BDD'
date: 2024-07-26 00:00:00 Z
categories:
- Testing
tags:
- Testing
- BDD
- Blog
summary: Many organisations mistakenly think Behaviour-Driven Development (BDD) is simply about writing test cases in Given-When-Then format or using test automation frameworks. While automation is a valuable by-product, the true essence of BDD lies in enhancing team collaboration and understanding business requirements. BDD includes three practices- discovery, formulation, and automation, with the discovery phase being foundational. Adhering to best practices ensures that BDD scenarios are clear, focused, and valuable, ultimately creating living documentation that accurately reflects the system's behaviour.
author: xchen
image: "/uploads/Beyond%20automation%20thumbnail.png"
---

Many organisations claim they are applying Behaviour-Driven Development (BDD). When you discuss BDD with them, they often present numerous feature files as evidence of their adoption of the BDD methodology.

These days, some still believe that writing a test case in the Given-When-Then format constitutes BDD, or that BDD is synonymous with a test automation framework. However, all successful BDD practitioners will tell you this is not true. A test automation framework is indeed a valuable by-product of the BDD methodology, but BDD achieves much more than that.

## **The Goal of BDD** 

The ultimate goal of BDD is to enhance collaboration among different stakeholders and ensure technical teams have a better understanding of business requirements. BDD comprises three practices: discovery, formulation, and automation. People typically focus on the latter two practices: formulating BDD scenarios using Gherkin syntax and automating them. However, they sometimes neglect the discovery practice, which lays the foundation for the other two. A solid foundation is crucial for producing high-quality BDD artefacts.

## **BDD Practices** 

Each practice has its own purpose. The following figure shows the input and output from each BDD practice.

![BDDpractices.png]({{ site.github.url }}/uploads/BDDpractices.png#center)

In discovery practice, we typically start with the product owner (or business analyst, or customer) providing information about the user story. Sufficient detail is presented to give stakeholders a basic understanding and to enable exploration of the story's scope. This user story serves as the input for the discovery activity.

Following this, a structured conversation usually takes place in the form of a requirements workshop. During this workshop, representatives from diverse roles (product owner, developer, and tester) collaborate to develop rules and examples based on the high-level description of the user story. This conversation is commonly referred to as a "Three Amigos" meeting.

The Three Amigos meeting is expected to be brief, typically lasting no more than 30 minutes, and each session should focus on a single user story. Various techniques can be employed during this meeting, with [example mapping](https://cucumber.io/blog/bdd/example-mapping-introduction/) being the most common. A board is set up where participants use different cards to write down rules (also known as acceptance criteria), examples that are specific and precise to effectively illustrate the rules, and questions that highlight areas of ambiguity or unknowns that require further clarification. To make the meeting more productive, examples do not need to be in Gherkin format; bullet points with key words are sufficient. At the end of the meeting, an example map for the particular user story will be generated and agreed upon by all roles.

This example map will serve as the primary input for the formulation practice. Typically, it is the tester's responsibility to document these examples of system behaviour as scenarios in Gherkin syntax—in other words, in our familiar Given-When-Then format. A feature file containing these scenarios will be generated as the outcome of the formulation practice. To convert these examples into Gherkin feature files, the individual responsible must be familiar with the [BRIEF](https://cucumber.io/blog/bdd/keep-your-scenarios-brief/) principles and BDD frameworks such as [Cucumber](https://cucumber.io/) or [SpecFlow](https://specflow.org/).

According to these principles, the language used in the scenarios should align with the business domain. Essential concrete data should be integrated to unambiguously illustrate the system’s behaviour and expose edge cases. The steps in the scenarios should express the intent, focusing on what is to be achieved rather than prescribing how to achieve it. Incidental information should be removed to maintain clarity and focus. Each scenario is expected to illustrate a single rule and must not exceed 10 steps.

It is important for other stakeholders, especially business representatives, to review and refine this file to ensure it accurately describes the expected behaviour without any ambiguities or misunderstandings.

In some organisations, they prefer to create the feature file and automation code simultaneously. In others, they generate the feature file first and consider automating it in the near future when they have the necessary automation capabilities. Whether this is done synchronously or sequentially, the formulated scenarios ultimately serve as a specification document. It will be the sole source of truth for the system behaviour and will not change unless the system behaviour itself is altered.

## **Common anti-patterns on BDD scenarios** 

Even though Gherkin syntax is easy to understand and use, it's common to encounter certain anti-patterns when using it. Some people may generate hundreds of scenarios without being aware of the BRIEF principles. As a result, we may see varying styles of scenarios—some short and sweet, others long and difficult to understand. It's important to assess the quality of BDD scenarios to ensure they adhere to the BRIEF principles.

### **1.	Scenario uses technical or mechanistic terms.**
It goes against the business language principle. The language from solution domain should be removed as the scenario should be thought of as documentation with shared understanding for every stakeholder. 

Example from Seb, R and Gaspar, N (2021). The BDD Books - Formulation: 

< <span style="color: red;">Bad</span> >

<script src="https://gist.github.com/XChenscottlogic/d57849240fca22d25eaf30b9c86b278e.js"></script>

< <span style="color: green;">Good</span> >

<script src="https://gist.github.com/XChenscottlogic/9e024be47f8bf62a856b28f740066a8d.js"></script>

< <span style="color: blue;">Note</span> >  

The original scenario's words, including HTML element names (such as "BasketItemCount") and implementation actions (such as "click"), must be replaced with business language. 

### **2.	Scenarios are written as test procedures.**
It goes against the Intention revealing & Focused principles. It is a common mistake that people write imperative scenarios rather than declarative ones. Scenarios should show what the actor in the scenario wants to achieve, rather than describing how they will do it. It's a misconception that BDD scenarios are synonymous with step-by-step test scripts written in the Given/When/Then style. 

Example from [web](https://automationpanda.com/2017/01/30/bdd-101-writing-good-gherkin/):

< <span style="color: red;">Bad</span> >

<script src="https://gist.github.com/XChenscottlogic/596c439787de24aca757500688496299.js"></script>


< <span style="color: green;">Good</span> >

<script src="https://gist.github.com/XChenscottlogic/7f07f3b18197bd348cd56b939670924e.js"></script>

< <span style="color: blue;">Note</span> >  

As Andrew Knight said in his blog, one scenario covers one behaviour. 

### **3.	Scenarios contain too many context steps.**
It goes against the Essential principle. Even though these actions are pre-requisites of the required state, they do not directly illustrate the behaviour and should be removed. Keeping these inessential details in the scenarios has two drawbacks. Firstly, it diminishes the readability of the scenarios and can easily distract the reader. Secondly, it increases maintenance costs, as any changes to these steps may potentially disrupt the scenario. 

Example Generated by GPT-3.5:

< <span style="color: red;">Bad</span> >

<script src="https://gist.github.com/XChenscottlogic/19836db3dd1074f8b9fecfbda56f2bfa.js"></script>

< <span style="color: green;">Good</span> >

<script src="https://gist.github.com/XChenscottlogic/93057f8995af154d6e6f65ab0bf8af18.js"></script>

< <span style="color: blue;">Note</span> >  

We need to keep the context essential as the scenario will be easy to understand and less fragile. 

### **4.	Too many journey scenarios.**
It goes against the BRIEF principles. Most BDD scenarios should be granular, focusing on illustrating a specific rule. Scenarios that describe a long or end-to-end user journey typically exercise multiple rules. By nature, journey scenarios do not adhere to BRIEF principles. Although they can provide valuable overviews of the system, they tend to be slow, fragile, and costly to maintain. Therefore, the number of such scenarios should be minimised as much as possible. It is also recommended to use asterisks (*) instead of the Gherkin keywords "Given," "When," and "Then" to improve readability.

### **5.	Data tables and scenario outlines are either neglected or overused.**
Gherkin data tables and scenario outlines are designed to enhance readability and should be used appropriately. It's important to strike a balance and avoid either neglecting or overusing them. Using scenario outlines can sometimes lead to adding unnecessary data. For example, using "banana" and "apple" as inputs does not add much value because both are just short text strings and fall into the same category. Only essential and behaviour-relevant data should be included in the example tables, as large tables can be difficult for readers to understand and even worse, increase test execution time. These types of data can be verified through exploratory testing instead of including everything in the feature file.

## **Automation Offers Only Partial Benefits**

Once the scenarios on a feature file are automated, the feature file becomes executable test artefacts. As BDD is a test-driven methodology, we can automate scenarios before code implementation. Although BDD itself is not testing, it fits well within the testing strategy. A significant side effect of the BDD methodology is the creation of automated tests. These tests can be executed either locally or integrated within a CI pipeline. The outcome of this practice is not only an automation test framework but, more importantly, a living document that evolves alongside the software, ensuring that it always reflects the current state of the system.

## **Conclusion**

Overall, the purpose of BDD methodology is to enhance collaboration across the entire team. While automated testing is a valuable outcome of the process, it is not the sole benefit it offers. A successful BDD practice requires everyone on the team to understand its principles and adhere to best practices.

