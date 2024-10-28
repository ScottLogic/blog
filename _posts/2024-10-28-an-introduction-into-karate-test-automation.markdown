---
title: 'An Introduction into Karate Test Automation'
date: 2024-10-28 12:00:00 Z
categories:
- Testing
tags:
- Testing
- Automation
- API
- Open Source
- Karate
summary: In this blog i'll introduce the Karate Test Automation Framework and talk about some of the fun and
  interesting features it provides.   
author: sdewar
---

# Introduction
Karate is an automation framework designed to make automation testing easy, super readable and more reliable than other 
offerings in the open source space - don't even ask me how many times I've been bitten by Selenium's reluctance to play 
nice with UI elements or been snowed under trying to get my head around a complex multi-util, multi-file test scenario.

Karate is essentially a Gherkin-like programming language, with the ability to use Java & JavaScript almost seamlessly
in order to handle more complex and unique functionality should you require it. It's primarily an API Automation
tool, but it also handily also provides very good UI Automation capabilities, Load Testing, Kafka Testing & Image 
Comparison Testing, amongst other features. 

# So Stuart, what are you going to show us?
There's a whole host of interesting & handy features of the Framework, but I'll focus on a few that make API testing
easy, efficient and clear.

## Test Readability
I'll preface this with the fact Cucumber/BBD is more readable - but that requires a huge amount of effort in 
implementing the step-definitions correctly, which means higher time investment and ultimately less readable code in the
background. 

Karate lets us use keywords straight out the box, no need for step-definitions & no need for code, everything is
already there hidden away, we really don't need to dive any deeper into the technical behind-the-scenes implementation 
in order to get testing our services.

Let's take a look - say we want to send a request to an endpoint to list users (we'll use [reqres](https://reqres.in/) 
for the examples in this Blog):

~~~karate
Feature: 'users' endpoint Scenarios

Background:

  # Tell Karate that this is our "base url" for all Scenarios in this Feature File
  * baseUrl 'https://reqres.in/api'

Scenario: Given we send a request to the 'users' endpoint, a 200 response is returned

  Given path 'users'
  When method GET
  Then status 200
  And match response.data[*].first_name contains "Tobias"
~~~

That's all we need - this test that will verify that the `users` endpoint returns a 200. Additionally, we run an 
assertion on the array of users to verify that one of the `first_names` equals "Tobias" - the `[*]` means we want to 
check each object within the array for `"first_name" == "Tobias"`.

The main point here though is just showcasing how easy it is to write our test scenarios and how readable they can be, 
meaning less time is spent understanding the scenarios and more time finding bugs!

We don't even have to stick to Given, When, Then syntax. It is completely interchangeable - the Karate way is to write
your Scenarios in the most readable way that makes sense to you and your test flows.

## Feature File Re-use, Call Single & Caching
This next feature is both a nice saver in terms of execution cost/time but also in terms of code re-usability. I know 
I'll mention that this is necessarily not a great pattern in terms of test readability, but there certainly still
is a time and place for it.

Say we want to add some authentication to our request, we typically will need to get a token in which we can 
authenticate with, save the token from the response and then add our Authorization header like so:

~~~karate
Feature: 'users' endpoint Scenarios

Background:

  # Tell Karate that this is our "base url" for all Scenarios in this Feature File
  * baseUrl 'https://reqres.in/api'
    
Scenario: Given we send a request to the 'users' endpoint, a 200 response is returned

  # Send a request to the "authenticate" endpoint and store the access token locally to this Scenario only
  Given path 'login'
  And request { username: 'eve.holt@reqres.in', password: 'cityslicka' }
  When method POST
  Then status 200

  # Lets save our token - note how we can use * or any gherkin style keyword interchangeably
  # 'response' is always a reference to the last response body
  * def token = response.token

  Given path 'users'
  And header Authorization = `Bearer ${token}`
  When method GET
  Then status 200
~~~

Obviously once our Test Suite grows arms and legs, we don't want to authenticate for every single request, especially
for large complex test flows that are happy with the same authorization token - enter `callSingle`. 

Karate allows us to move any piece of commonly used functionality out into a Feature File that can be "called" (via 
`call`, `call once` or `callSingle`). Here, we can move the authentication request into a `callSingle` call and put it
into the Background. Usually, all code within the `Background` is executed for every Scenario in that Feature File, but
in the case of `callSingle`, we only run it once across **all** Features that make the same call.

~~~karate
Feature: 'users' endpoint Scenarios

Background:

  # Tell Karate that this is our "base url" for all Scenarios in this Feature File
  * baseUrl 'https://reqres.in/api'

  * karate.configure('callSingleCache', { minutes: 4 })
  # AuthenticateAs.feature has our authentication request from the snippet above
  # Any variables defined within AuthenticateAs.feature are accessible in this Feature via 'auth.variable'
  * def auth = karate.callSingle('AutenticateAs.feature', { username: 'eve.holt@reqres.in', password: 'cityslicka' })

Scenario: Given we send a request to the 'users' endpoint, a 200 response is returned

  Given path 'users'
  And header Authorization = `Bearer ${auth.token}`
  When method GET
  Then status 200
~~~

Now we can have a series of requests and scenarios that only authenticate once - we've also configured our 
`callSingleCache` to refresh every 4 minutes to avoid tokens reaching their expiry. This will not only speed up 
execution but also improve test readability since our Scenarios are even more straight to the point on what they are 
testing.

I previously mentioned we also have `call` & `callOnce`, with their main purpose to facilitate code re-use. These can be
used similarly to `callSingle`, with `call` happening for every Scenario inside your Feature and `callOnce` only once
inside the Feature file. `call` is especially handy when you have a complex flow of requests and test steps that "muddy"
the waters of a Scenario that you can just move out into another file and replace with a one-liner.

Within the world of development, we try to re-use code as much as possible - but within test automation this can
seriously hamper test readability and time spent understanding, debugging & fixing your tests. Tests should be clear
on what they are testing and if that means we have to re-use code then I think that's absolutely fine. In my experience 
of using Karate, I feel that it provides a really nice middle-ground that empowers the tester to make the decision on 
how readable their test scenarios are.

## Hybrid Scenarios (+ a sneak peek into Karate UI Automation)
Let's now touch on Hybrid Scenarios briefly. So far everything has been API focussed, but I want to show how we can
easily incorporate a simple UI test alongside API calls. 

Say we want to test logging into our application via the UI - but first we need to create our user - what would this 
look like in terms of an actual Scenario?

~~~karate
Feature: Check that we can Login using the UI

Background:

  # Tell Karate that this is our "base url" for all Scenarios in this Feature File
  * baseUrl 'https://reqres.in/api'
      
  * call read 'homePagelocators.json'     

Scenario: Given we create a User, we can successfully login via the UI

  Given path 'register'
  And request { email: 'sdewar@scottlogic.com', password: 'test123' }
  When method POST
  Then status 200

  # Update baseUrl to the UI
  * baseUrl 'https://reqres.in/ui'
  
  # This doesn't actually exist, but used just as an example
  Given driver `${baseUrl}/login`
  And waitFor(usernameLocator).input('sdewar@scottlogic.com')
  And waitFor(passwordLocator).input('test123')
  When waitFor(signInButtonLocator).click()
  Then waitForUrl(`${baseUrl}/home`)
~~~

Firstly, we have our API call to create the new user. We then need to tell Karate that our `baseUrl` has now changed to
the UI one. Then we instantiate a `driver` instance, and use locators stored in a `homePagelocators.json` file in order
tell Karate to wait until they are rendered on screen. We can also use chaining to perform actions as soon as the 
element is found - removing the need for multiple lines of code or storing the element into a variable.

## Dynamic Scenario Outlines
Lastly, I want to talk about Dynamic Scenario Outlines. 

If you're used to Cucumber then you've probably got an understanding of Scenario Outlines - they let you run through
the exact same test steps but with your variables & data driven directly from a table, for example:

~~~karate
Feature: 'register' endpoint Scenarios
  
Background:

  # Tell Karate that this is our "base url" for all Scenarios in this Feature File
  * baseUrl 'https://reqres.in/api'
    
Scenario Outline: Given we send a <Scenario> username & password combination, the 'register' endpoint returns a <Status>
    
  Given path 'register'
  And request { username: '< Username >', password: '< Password >' }
  When method POST
  Then status < Status >
  And match response == < Response >

Examples: 
  | Scenario | Username           | Password   | Status | Response                            |
  | valid    | eve.holt@reqres.in | cityslicka | 200    | { "id": #number, "token": #string } |
  | invalid  | eve.holt@reqres.in |            | 400    | { "error": "Missing password" }     |
~~~

Here, we will send off a request to the `register` endpoint, with & without a password and make assertions based on
that. Note that on row 1 of the Examples table we use Karate's built in Schema Validation functionality since we may not
necessarily know the `id` and `token` for a valid username & password combination.

However, we can do something really cool with Dynamic Scenario Outlines. We can essentially generate our `Examples:` 
table at run-time. 

Let's say we wanted to clean up our test environment of users. We would first want to GET a list of all users, then 
initiate a DELETE request using the `id` of the user:

~~~karate
Feature: Delete Users using Dynamic Scenario Outline

Background:

  # Tell Karate that this is our "base url" for all Scenarios in this Feature File
  * baseUrl 'https://reqres.in/api'
    
@setup
Scenario:

  # The background section is not executed for the "setup" part Dynamic Scenario Outlines
  # So we need to re-set any variables & urls here
  * baseUrl 'https://reqres.in/api'
  Given path 'users'
  When method GET
  Then status 200
  * def userData = response.data

Scenario Outline: Delete all users by fetching the ID's from the users endpoint
    
  Given path `users/${id}`
  When method DELETE
  Then status 204

Examples: 
  | karate.setup().userData |
~~~

Since we told our Scenario Outline to use the `userData` array as its data source via our `Examples` table, it will have access 
to any key-value pair present in that array. Here's a snippet of the data array from the `users` endpoint:

~~~json
{ 
    "data": [
        {
            "id": 7,
            "email": "michael.lawson@reqres.in",
            "first_name": "Michael",
            "last_name": "Lawson",
            "avatar": "https://reqres.in/img/faces/7-image.jpg"
        },
        {
            "id": 8,
            "email": "lindsay.ferguson@reqres.in",
            "first_name": "Lindsay",
            "last_name": "Ferguson",
            "avatar": "https://reqres.in/img/faces/8-image.jpg"
        }
    ]
}
~~~

This is great for running through a bulk set of tests where we don't necessarily know some vital inputs before 
execution. There's a few others ways to do something similar in Karate, but another benefit of Dynamic Scenario Outlines
is that Karate will still respect any parallel execution configuration, meaning we can run this across `x` threads with
no extra config outside of the parallel runner configuration.

# Conclusion
The aim of this blog post was just to show some features of the Karate Test Framework that make API (and UI!) testing
really easy, readable and accessible. Perhaps paving the way for a follow-up where we can dive deeper into other 
features of the framework. 

***

## Resources

The Documentation for Karate is really solid, with lots of examples and good explanations of each bit of functionality.
There's also a very active community on Stack Overflow asking and answering questions - you'll find the author of 
Karate answering a lot of queries.

[Karate Documentation](https://karatelabs.github.io/karate/)

[Stack Overflow](https://stackoverflow.com/questions/tagged/karate)