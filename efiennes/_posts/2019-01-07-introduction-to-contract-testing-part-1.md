---
published: true
author: efiennes
layout: default_post
category: Testing
title: Introduction to contract testing 
summary: 'Have you heard of contract testing and want to know more?  Are your company asking you to consider this future-facing way of testing? Are you wondering of its relevance to you as a functional or non-functional tester? Then this article can help you with some of the questions you have on the subject.'
image: efiennes/assets/hutshell.png
---
In this post, I will go through the terminology, the use cases and what contract testing does and doesn’t deliver. There may be a follow up post with some tests implemented in a tool.

These posts are written for anyone new to the concept, anyone who wants to understand contract testing from a range of perspectives and anyone looking for more context than they may have otherwise experienced. 

In this post, there are some examples to work through in this post with the help of the Swagger Pet Store and a tool like cURL or Postman. These sections do rely on a passing knowledge of how to install and use these tools in order to replicate the test conditions.

Towards the end of the 2nd part of the posts, we’ll get hands-on with some tooling that is specifically designed for contract testing. 

Feel free to skip the terminology section (immediately below) if you already have a working knowledge of one or more uses for contract testing.

## What is contract testing? ##
Contract testing is the interrogation of a deployed or mocked services endpoint to get information back or define an endpoint in testing prior to deployment.

It provides complimentary testing coverage each time a change is planned or made to your code. We will talk more about how it can form part of your test approach later on in this post.

### **Breaking it down to a simple analogy** ###

I want to go to a new specialist tech shop during lunchtime but it’s along a route I have never walked before and I am worried that I won’t have enough time to get there and back before my 2pm meeting. I need information on how long this journey will take.

Given my current resources, there are 2 approaches I could take - 
Walk there, timing the walk and double the elapsed time to work out the journey total.
Check an online route mapper for the estimates for the route.

One option is a lot faster than the other, has no dependencies and gets me fairly near the answers I want but omits lower level detail (windspeed, gradient) of the journey that I would learn by timing the walk myself.

This is exactly what contract testing does. It mocks or interrogates a response to allow you to get some of the information about functions you require.


## Some terminology ##

**Service Consumer**

A component that initiates a HTTP request to another component.  

**Service Provider**

A server that responds to an HTTP request from another component.

<--Together, the request and response pair are known as an interaction -->  

**Service advertisement**

The method through which a service consumer advertises (makes available) a web service by embedding or rendering machine understandable web service descriptions.  

**Contract file**

Contains the JSON serialised interactions (requests and responses) defined in the consumer tests.  

**Mock Service Provider**

Used by consumer tests to mock out the actual service provider, meaning that integration-like tests can be run without requiring the actual service provider to be available.  

**Service agreement**

A promise from the service provider to return a specific response after the service consumer provides a specific request.  

**Internal Service Consumer**

This is another system in your company that uses your services for things like authentication, auditing permissions or data.  

**External Service Consumer**

This is a party external to your company that consumers your service as a part of their tech offering

![The contract agreement across parties]({{site.baseurl}}/efiennes/assets/Contract2.JPG)


## How can I do it? ##

As Contract testing is a method for testing services, there are 3 ways of doing it:<br>
* Against a deployed service (a URL) <br>
* Against a mocked service (code) <br>
* Against a to-be service (nothing) <br>

**Deployment is King**

Testing against a deployed service would be a recommended way to ensure that services (such as an API provider and a client) can still communicate with each other after development changes have been made.

**Mocking is catching**

When testing against a mock, it can be a useful alternative to some expensive / time-consuming/ brittle integration tests. On the latter point, it is worth mentioning that contract testing cannot replace integration tests in their entirety. I will explain this in greater detail as I go through this instructable.

**Future state (of) affairs**

When testing against an API yet to be developed, the tests will all fail as they are ‘pointing at’ empty air. As the tests are written, they can be used as a conduit for conversation and design decisions for teams that work in Test driven development (TDD). As the endpoints are written, the tests will pass and verify the provider’s contract has been fulfilled. 


## What do I need in order to test in this way? ##

**Know your role**

Are you the provider or the consumer? Is your consumption internally or externally focused? If you are the provider, you need to look at all your endpoints and internal integrations. If you are the consumer (externally facing), you may just be looking at the endpoints you consume not every endpoint. 

The above, dear readers is why testers say “it depends” a lot and ask bundles of questions. It is not that we don’t have a concrete answer, it just happens we need a lot of information and context to give you the RIGHT concrete answer.

**API Docs**

In order for contract testing to take place on a deployed service or via mocks, a contract must be available to all parties. This is our API documentation. Depending on the REST maturity of your organisation, the quality of this may vary.

API publishers conforming to the REST Richardson Maturity Model (RMM) Level 3 will be exposing contract declaration via endpoint responses, whether real or mocked. 
Most providers are producing APIs at RMM Level 2 making it even more important that they provide accurate documentation. There are lots of tools that can automatically generate documentation for APIs defined against known standards - OpenAPI/Swagger, RAML or API Blueprint.

**Testing tool**

When it comes to constructing contract tests, there are a number of tools you can use depending on the scope and the perspective of the testing you want to do. [PACT](https://docs.pact.io/) is good for internal provider and consumer focused testing. [Spring cloud contract](https://spring.io/projects/spring-cloud-contract) is recommended for those focusing on consumer testing. [Hoverfly](https://hoverfly.io/) is written in Go with native support for Java which can be run inside JUnit test. Hoverfly can be used for testing REST APIs as well as testing calls between microservices.

**Define your scope of testing**

One thing it can be hard for devs and testers to work out is how deep into the functions they should go as part of testing. This really depends on the level of information you want to get out of the tests, what they are being run against and your perspective as a provider or a consumer. Below are some suggested scopes but they are not exhaustive and as with contract testing in general, you have to think about which approach suits you and the context you work in the best.

### Some tests - Data entry / deployed endpoints / sequential functions / changing data states ###

First we can POST a new pet: <br>
`POST "https://petstore.swagger.io/v2/pet" -H "accept: application/xml" -H "Content-Type: application/json" -d "{ \"id\": 0, \"category\": { \"id\": 0, \"name\": \"string\" }, \"name\": \"Dinosaur\", \"photoUrls\": [ \"string\" ], \"tags\": [ { \"id\": 0, \"name\": \"string\" } ], \"status\": \"available\"}"`<br>
Based on the data provided in the POST request above, we can then sequence the rest of the requests as tests to get back the expected data. Happy dino hunting!

`PUT /pet //Updates the pet`<br>
`GET /pet/findByStatus //Finds Pets by status`<br>
`GET /pet/findByTags //Finds Pets by tags`<br>
`GET /pet/{petId} //Find pet by ID`<br>
`POST /pet/{petId} //Updates a pet in the store with form data`<br>
`DELETE /pet/{petId} //Deletes a pet`<br>
`POST /pet/{petId}/uploadImage //uploads an image`<br>
<br>
<br>
Running some checks against the GET /Pets endpoint using cURL<br>

### __**Test:**__ ###
GET an endpoint which does not exist to ensure the service can deal with this cleanly and alert us to any incorrect endpoints we are attempting to consume.<br>
(Yes - this is a bit of a naughty test as the Petstore does not call this response out as supported)

**Request (in cURL):**<br>
`GET -I -X "https://petstore.swagger.io/v2/pet/`<br>
(The -I switch will make sure that cURL outputs the response)

**Response:** <br>
`HTTP/1.1 405 Method Not Allowed`<br>
`Date: Thu, 20 Dec 2019 14:16:29 GMT`<br>
`Access-Control-Allow-Origin: *` <br>
`Access-Control-Allow-Methods: GET, POST, DELETE, PUT` <br>
`Access-Control-Allow-Headers: A, B, C, D` <br>
`Content-Type: application/json` <br>
`Connection: close` <br>
`Server: Betty Boo` <br>

### __**Test:**__  ###
GET a generated STATUS endpoint for an endpoint that exists

**Request:** <br>
`C:\DEV\cURL\bin>curl -I -X GET "https://petstore.swagger.io/v2/pet/findByStatus?status=available"`<br>
Available is a status supported by the Petstore

**Response:** <br>
`HTTP/1.1 200 OK` <br>
`Date: Thu, 20 Dec 2019 14:16:29 GMT`<br>
`Access-Control-Allow-Origin: *` <br>
`Access-Control-Allow-Methods: GET, POST, DELETE, PUT` <br>
`Access-Control-Allow-Headers: A, B, C, D` <br>
`Content-Type: application/json` <br>
`Connection: close` <br>
`Server: Betty Boo` <br>

### __**Test:**__ ###
GET a generated STATUS endpoint for an endpoint that does not exist

**Request:**<br> 
`C:\DEV\cURL\bin>curl -I -X GET "https://petstore.swagger.io/v2/pet/findByStatus?status=Blah"`<br>
Blah is not a status supported by the Petstore

**Response:** <br>
[ ]
Now you need to talk to your team about the specification and decide if the specs are thorough enough to deal with unexpected endpoints OR decide on the endpoints that are likely to be miscalled and deal with them appropriately.

## Mocked endpoints / TDD - Classic or London school ##

There has been so much written on one way of doing TDD over the other that it does not bear repeating here. It also borders on a whole load of debate that falls more under a TDD rather than a contract testing discussion. <br>
For anyone who does want to look into this in more detail, I’ve provided links to provide more context if you want to research the ways and means of looking into algorithmic verses role-based testing focus.
[London School](http://coding-is-like-cooking.info/2013/04/the-london-school-of-test-driven-development/) and the [Chicago School](https://8thlight.com/blog/georgina-mcfadyen/2016/06/27/inside-out-tdd-vs-outside-in.html)


## What information do we get out of testing in this way? ##

A good contract test for a deployed service will tell you if:<br>
* The API under test understands the request made of it<br>
* The API under test can send the response expected of it<br>
* The endpoints are accessible<br>
* The provider and the consumer have a working connection if you are testing against a deployed service<br>
* If an expected integration is in place<br>
<br>
The same can be said for mocked and TDD contract testing only IF the deployed version of the service corresponds to the mocks and tests. For that reason, mocked and TDD tests should be used to drive design decisions rather than to provide information.

## What does contract testing NOT do? ##

As much as I hate bursting out the negatives, anyone researching contract testing will find a wealth of conflicting information out there on the uses and boundaries of contract testing. I am not going to add to that except to specify what contract testing explicitly cannot do and in what circumstances. Other than that, I am going to tell you exactly what contract testing does do, provide some use cases and you can make your mind up if it suits your context (or not).

### **The art of the (im)passible** ###

Agreements are the API specification presented by the services under test. Therefore, any function not described in that specification cannot be tested. This includes:<br>
* Customer based workflows<br>
* Some UI functions<br>
* Service level agreements (SLAs)<br> 
* Failover plans<br>
* Performance under stress<br>
* Suitability of deployed environments<br>

### **When mocking is not catching** ###

If you are mocking the API endpoints for your testing, contract testing will not give you any information about the endpoints eventually deployed. If you want to find potential issues such as endpoint configuration issues or misused classes, you need to run some standalone or integration tests against the deployed service.

### **Data Semantics** ###

If you have rules around your data such as maximum and minimum boundaries, format and size. Contract testing will not test these rules in an effective way unless you are testing the deployed version of the service. 

### **Unknown (unknown) consumer actions** ###

If your internal or external consumers expect to be able to use your service in a way that has not been documented in the contract, neither of you will not be able to test this, unless it is written as a future-state test expected to fail on first run. That is why it is important to make sure the contract is shared before testing of any request/response pairs has started.
![The different phases of Microservice testing]({{site.baseurl}}/efiennes/assets/Contract3.JPG)

## What can contract testing actually test? ##

Contract-based unit tests only check that API endpoint connections are active and functioning (responding) correctly. A contract test ensures a service responds as advertised in terms of it’s agreement. To provide an example of an agreement in action, I am going to use the Swagger Petstore API endpoints - 

According to the spec, the Petstore API will return a 200 for any queries which ask it to find a pet with the status of ‘available’, ‘pending’ or ‘sold’. For anything else, it will return a 400. For more on http requests and responses - have a look here. Let’s test this agreement:

If I sent the request:
<br>
`GET https://petstore.swagger.io/v2/pet/findByStatus?status=available`<br>
=> I should get a 200 response as this is a valid request. The status "available" is supported by the Petstore<br>

`GET https://petstore.swagger.io/v2/pet/findBySize`<br>
=>I should get a 400 or empty brackets [] response. This is an invalid request as the "findbysize" option is not supported by the Petstore`<br>

You can use the Swagger ‘Try it out’ function,  cURL or Postman to have a play with the Petstore requests. Please keep in mind, the swagger.io interface only tests the happy paths so you will need to use one of the other tools to send the request syntax to invoke 400 / 500 type responses.

## How can I incorporate contract testing in my overall approach? ##

Combine, combine, combine. Try not to think of contract testing as a replacement for unit testing, standalone API functional testing or integration testing, it is more of a complimentary stream of testing. As long as you can avoid duplicating tests during different phases of testing and test as close to the code as possible.
 
**Standalone API functional testing**
<br>
When I am in a position to recommend contract testing, the question I am asked most is “oooh can that replace standalone API testing then? The answer is yes… and no. If you are testing against a deployed API in an environment you can access, contract testing will certainly verify that API is working as expected. However, if you are mocking the endpoints, as an internal or external consumer, you cannot replace this testing especially if there is any chance the contract will change as a result of testing so the deployment is different to what is mocked.
 
**Integration testing**
<br>
Contract tests cannot find non-logical defects such as anomalies exposed by negative testing nor can they detect configuration problems with database entries or connections.
<br>  
This is where your integration testing (or end to end testing) comes into play. If you have completed your contract testing first (and you should do it as early in the development cycle as possible), you have the assurance that your service endpoints are processing requests and responding as expected BUT not if the planned deployment of the same will work with it's integrated services / databases / authentication systems etc.
<br>
It's also worth remembering that contract testing will tell you that there is a break but not necessarily where that break is in the same way that standalone or integration testing would.
<br>

## Use cases ##

**Use case 1 - The internal consumer without a developed service**<br>
I am a tester on TeamA (the consumer). TeamB (the provider) will be developing a new service that the component I test has to integrate with. I want to write some tests to ensure integration between the two. Working with the developers from TeamA and TeamB, I am going to write some contract tests against mocked endpoints for the new service to ensure that when my component advertises the endpoints, they will integrate as expected. 
<br>
<br>
**Use case 2 - The external consumer with a developed service**<br>
I am a web developer who consumes the Marvel comics APIs in my comic bookstore shopfront. I want to make sure that any changes to the Marvel APIs don’t break the services I advertise as this would break several parts of my landing page. I will provide my tester with the API specification so we can mock the API. The resulting contract testing will help us verify that all the agreements that we expect from Marvel as our provider are still in place after any changes to the service URL or individual endpoints.
<br>
<br>
**Use case 3 - The internal consumer with endpoints in production**<br>
We are a scrum team. We have built a new component to replace one already in production. The APIs that the component consume are also in production but are not consumable by anyone other than internal development teams. We don’t want to build a whole regression environment for this one change as we have the ability to test in production. However, we do want some assurance that the deployed component can access all the endpoints it advertises before we deploy into live. We will mock the existing endpoints and by contract testing ensure our new component can consume them.
<br>
<br>
**Use case 4 - Which technical design decision to make**<br>
We are a scrum team. We intend to build and deploy a new API to a cloud-based container. However, there is some debate within the team whether to use a REST or a SOAP service. There are good points on both sides for using either. The decision is taken to do a POC with both and see how responsive both APIs are at a feature level. This means that we will be monitoring the SLA times for the responses to the calls to the APIs. We write our tests and put in a clause for the assertion to be marked as failed if the response takes more than 100ms from first call to response. This way, we will know for the happy paths in our application which features are the most performant in the same environments but with a different service design.
<br>
<br>
*****
<br>
That’s it, Contract testing, how to do it, some use cases and what it can and cannot do for you as a provider or a consumer. Not in a nutshell, perhaps more of a hutshell really. 
<br>
In the meantime, my colleague Darren Smith, based in Newcastle has written an excellent post on [Consumer driven testing using PACT](https://blog.scottlogic.com/2017/01/10/consumer-driven-contracts-using-pact.html) which is a great overview of some of the capabilities of that tool.
