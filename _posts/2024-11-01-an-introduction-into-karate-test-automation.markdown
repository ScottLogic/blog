---
title: An Introduction into Karate Test Automation
date: 2024-11-01 09:00:00 Z
categories:
- Testing
tags:
- Testing
- Automation
- API
- Open Source
- Karate
summary: In this blog I'll introduce the Karate Test Automation Framework and talk
  about some of the fun and interesting features it provides.
author: sdewar
---

Karate is an automation framework designed to make automation testing easy, super readable and more reliable than other 
offerings in the open source space - don't even ask me how many times I've been bitten by Selenium's reluctance to play 
nice with UI elements or been snowed under trying to get my head around a complex multi-util, multi-file test scenario.

Karate is essentially a [Gherkin-like](https://automationpanda.com/2017/01/26/bdd-101-the-gherkin-language/) programming language, with the ability to use Java and JavaScript almost seamlessly
in order to handle more complex and unique functionality should you require it. It's primarily an API Automation
tool, but it handily also provides very good UI Automation capabilities, Load Testing, Kafka Testing and Image 
Comparison Testing, amongst other features. 

There's a whole host of interesting and handy features of the framework, but I'll focus on a few that make API testing
easy, efficient and clear.

## Test Readability
I'll preface this with the fact [Cucumber](https://cucumber.io/docs/cucumber/) is more readable - but that requires a 
huge amount of effort in implementing the step-definitions correctly, which means higher time investment and ultimately 
less readable code in the background. 

Karate lets us write our test scenarios straight out the box - there's no need to write Java glue code or 
step-definitions like Cucumber. The example below showcases this perfectly - there's no additional setup needed
or extra digging into the technical, behind-the-scenes implementation in order to get testing our services.

Let's take a look - say we want to send a request to an endpoint to list users (we'll use [reqres](https://reqres.in/) 
for the examples in this post):

~~~karate
Feature: 'users' endpoint Scenarios

Background:

  * baseUrl 'https://reqres.in/api'

Scenario: Given we send a request to the 'users' endpoint, a 200 response is returned

  Given path 'users'
  When method GET
  Then status 200
  And match response.data[*].first_name contains "Tobias"
~~~

The above example kicks things off with our Feature File format:

* Feature - the piece of functionality or "feature" we'll be testing
* Background - this is code that is run before every Scenario, save for special cases where `call once` or `callSingle`
is used (more on that later).
* Scenario - our sequence of steps in order to test functionality

Firstly, we set our `baseUrl` in the `Background` section so that our HTTP requests know where to send the requests to. 
We can easily override this in any given Scenario if we so wished to change our target API.

Typically, within our Scenario's, we'll follow a `Given, When, And, Then` syntax - which is 100% interchangeable. These
keywords don't have any underlying functionality other than to tell Karate we're at the start of a new instruction. The 
Karate way here is to use these Gherkin style keywords in the most readable way that makes sense to you and your test 
flows. Here's a breakdown of the request:

* `Given path 'users'` means we'll be targeting `https://reqres.in/api/users` in our request - `path` is basically a
concatenation of `baseUrl` and whatever follows
* `When method GET` means we'll be sending a GET request - as soon as we specify the `method`, Karate will send the 
request
* `Then status 200` is an assertion on the HTTP response code
* `And match response.data[*].first_name contains "Tobias"` is another assertion, this time on the array of JSON objects
from the response to contain an occurrence of `{ "first_name": "Tobias" }` - if our test was deterministic in the array 
index of the object that contained "Tobias", then we could specify that instead of `[*]`

That's all we need - this shows just how easy it is to write our test scenarios and how readable they can be, meaning 
less time is spent understanding the scenarios and more time finding bugs!

## Feature File Re-use, Call Single and Caching
This next feature is both a nice saver in terms of execution cost/time but also in terms of code re-usability. It's true
that this is not necessarily a great pattern in terms of test readability, but there certainly still is a time and place  
for it.

Say we want to add some authentication into the mix - we would request a token, and then add that as a header in
all subsequent requests. How we approach that in Karate looks like this:

~~~karate
Feature: 'users' endpoint Scenarios

Background:

  * baseUrl 'https://reqres.in/api'
    
Scenario: Grab a valid authentication token and send a request to the 'users' endpoint

  Given path 'login'
  And request { username: 'eve.holt@reqres.in', password: 'cityslicka' }
  When method POST
  Then status 200
  * def token = response.token

  Given path 'users'
  And header Authorization = `Bearer ${token}`
  When method GET
  Then status 200
~~~

This Scenario contains two API calls - the first of which is a POST request to the `login` path with some valid known 
credentials. We also assert that this request returns a HTTP 200 response code.

We then have an example of how we can define variables within Karate - `* def token = response.token`. `*` is also 
interchangeable with our Gherkin syntax. Here, we are simply saving the token from the response so we can use it later. 
`response` is always a reference to the most recent response body.

The second API call is then the same as the first example we went through, but with the addition of an Authorization 
header. 

Obviously once our test suite grows arms and legs, we don't want to authenticate for every single request, especially
for large complex test flows that are happy with the same authorization token - enter `callSingle`. 

Karate allows us to move any piece of commonly used functionality out into a Feature File that can be called (via 
`call`, `call once` or `callSingle`). Here, we can move the authentication request into a `callSingle` call and put it
into the `Background`. Usually, all code within the `Background` is executed for every Scenario in that Feature File, 
but in the case of `callSingle`, we only run it once across **all** Features that make the same call.

For example, we have created `AuthenticateAs.feature` which contains our request to login and store the token into a 
`token` variable. 

~~~karate 
# AuthenticateAs.feature
Feature: Util for authenticating as a user and providing an auth token

Background:

  * baseUrl 'https://reqres.in/api'

Scenario: Send a request to login and save the token

  Given path 'login'
  And request { username: '#(username)', password: '#(password)' }
  When method POST
  Then status 200
  * def token = response.token
~~~

`'#(username)'` is how we tell Karate to use any JSON values that were passed in whilst calling the file.

Now in the example below, we can call to the `AuthenticateAs.feature` file by using `karate.callSingle()`. We also pass 
it a JSON object containing some parameters that we want to use for our authentication. Lastly, we assign all of this to 
a local variable called `auth` - meaning that we can access any variables defined in `AuthenticateAs.feature` via 
`auth.variable`.

~~~karate
Feature: 'users' endpoint Scenarios

Background:

  * baseUrl 'https://reqres.in/api'

  * karate.configure('callSingleCache', { minutes: 4 })
  * def auth = karate.callSingle('AutenticateAs.feature', { username: 'eve.holt@reqres.in', password: 'cityslicka' })

Scenario: Given we send a request to the 'users' endpoint, a 200 response is returned

  Given path 'users'
  And header Authorization = `Bearer ${auth.token}`
  When method GET
  Then status 200
~~~

Now we can have a series of requests and scenarios that only authenticate once, since we've used `karate.callSingle()` -
we've also configured our `callSingleCache` to refresh every 4 minutes to avoid tokens reaching their expiry. This will 
not only speed up execution but also improve test readability since our Scenarios are even more straight to the point on
what they are testing.

I previously mentioned we also have `call` and `callOnce`, with their main purpose to facilitate code re-use. These can 
be used similarly to `callSingle`, with `call` happening for every Scenario inside your Feature and `callOnce` only once
inside the Feature file. `call` is especially handy when you have a complex flow of requests and test steps that "muddy"
the waters of a Scenario that you can just move out into another file and replace with a one-liner.

Within the world of development, we try to re-use code as much as possible - but within test automation this can
seriously hamper test readability and time spent understanding, debugging and fixing your tests. Tests should be clear
on what they are testing and if that means we have to re-use code then I think that's absolutely fine. In my experience 
of using Karate, I feel that it provides a really nice middle-ground that empowers the tester to make the decision on 
how readable their test scenarios are.

## Hybrid Scenarios (plus a sneak peek into Karate UI Automation)
Let's now touch on Hybrid Scenarios briefly. So far everything has been API focussed, but I want to show how we can
easily incorporate a simple UI test alongside API calls. 

Say we want to test logging into our application via the UI - but first we need to create our user - what would this 
look like in terms of an actual Scenario?

~~~karate
Feature: Check that we can Login using the UI

Background:
  
  * baseUrl 'https://reqres.in/api'

Scenario: Given we create a user, we can successfully login via the UI using the same user

  Given path 'register'
  And request { email: 'eve.holt@reqres.in', password: 'pistol' }
  When method POST
  Then status 200

  * baseUrl 'https://reqres.in/ui'
  
  # "https://reqres.in/ui/login" doesn't actually exist, but used just as an example
  Given driver `${baseUrl}/login`
  And waitFor(usernameLocator).input('eve.holt@reqres.in')
  And waitFor(passwordLocator).input('pistol')
  When waitFor(signInButtonLocator).click()
  Then waitForUrl(`${baseUrl}/home`)
~~~

Firstly, we have our POST request to create the new user via the `register` endpoint. We then need to tell Karate that 
our `baseUrl` has now changed to the UI because when we instantiate a 
[driver](https://karatelabs.github.io/karate/karate-core/#driver) instance, it'll automatically navigate to the 
currently configured `baseUrl`. 

Karate's UI test features are really robust in the sense of avoiding flakey tests and waiting on elements appearing on 
screen. One example is `waitFor(locator)` - which will wait until a given locator is present on screen. We can also 
chain commands on the back of the locator being found as opposed to waiting for the locator, storing it, then performing
an action. 

This means we have a tidy set of steps that will spin up our driver, wait for elements to appear, perform 
actions accordingly and then wait for the URL to change to the home page to show we've logged in with our new user 
successfully.

## Dynamic Scenario Outlines
Lastly, I want to talk about [Dynamic Scenario Outlines](https://karatelabs.github.io/karate/#dynamic-scenario-outline). 

If you're used to Cucumber then you've probably got an understanding of 
[Scenario Outlines](https://cucumber.io/docs/gherkin/reference/#scenario-outline) - they let you run through the exact 
same test steps but with your variables and data driven directly from a table. 

The example below is 2 different Scenarios, but for each iteration (or row) we substitute the values in angle-brackets 
with values from each column of the table. This is really powerful when we have a lot of different tests that follow the
same steps, but with different input data each time, meaning big savings on lines of code and improved test 
maintainability.

~~~karate
Feature: 'register' endpoint Scenarios
  
Background:

  * baseUrl 'https://reqres.in/api'
    
Scenario Outline: Given we send a <Scenario> username and password combination, the 'register' endpoint returns a <Status>
    
  Given path 'register'
  And request { username: '< Username >', password: '< Password >' }
  When method POST
  Then status < Status >
  And match response == < Response >

Examples: 
  | Scenario | Username           | Password  | Status | Response                                  |
  | valid    | eve.holt@reqres.in | pistol    | 200    | { "id": 4, "token": "QpwL5tke4Pnpja7X4" } |
  | invalid  | eve.holt@reqres.in |           | 400    | { "error": "Missing password" }           |
~~~

In this example, the first row means we'll send a POST request containing a valid username and password to the 
`register` endpoint. We then assert on a valid `200` response from the endpoint and also do a response body assertion.
The second row will send a request without password information, which this time should result in a `400` response from
the endpoint and an error in the response body.

However, we can do something really cool with Dynamic Scenario Outlines. We can essentially generate our `Examples:` 
table at run-time. 

For some initial context, here's a snippet of the response from `https://reqres.in/api/users`:

~~~json
{
  "page": 1,
  "per_page": 6,
  "total": 2,
  "total_pages": 1,
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

Let's say we wanted to clean up our test environment of users, but in order to do that we need to know all user 
ID's and then send a DELETE request to `https://reqres.in/api/users/${id}` for each one.

In the below example, we have a `@setup` Scenario which is our data setup for our Scenario Outline.
Up until now we are used to the `Background` section running before every Scenario, but anything tagged with `@setup` 
will actually run before the `Background`. This means we need to set our `baseUrl` within the `@setup` scenario. We'll 
still want to keep our `baseUrl` defined within the `Background` since any other scenarios still need to know the target
URL.
The `@setup` section then sends a GET request to the 
`https://reqres.in/api/users` endpoint and then we save the `data` array from the response into a `userData` variable.

Now, within our Examples table, we can give our Scenario Outline access to the `userData` array from the `@setup` 
Scenario by using `karate.setup().userData`. This means that our Scenario Outline is aware of each JSON object within 
the array, and it automatically has access to all values from each object and hence the `id` key-value pair.

The steps within the Scenario Outline then make a DELETE request to the `users/${id}` path, and we assert on a 204 
response meaning we successfully initiated a DELETE on that specific user ID.

~~~karate
Feature: Delete Users using Dynamic Scenario Outline

Background:
  
  * baseUrl 'https://reqres.in/api'
    
@setup
Scenario:
  
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

If our ID's were predictable then we could have used something like we have below, but when they are generated at 
run-time then we require a `@setup` routine in order to fetch our non-deterministic data.

~~~karate
Examples:
  | IDs |
  | 7   |
  | 8   |
~~~

This is great for running through a bulk set of tests where we don't necessarily know some vital inputs before 
execution. There's a few others ways to do something similar in Karate, but another benefit of Dynamic Scenario Outlines
is that Karate will still respect any parallel execution configuration, meaning we can run this across multiple threads 
with no extra config outside of the parallel runner configuration.

## Conclusion
I hope you've enjoyed some brief examples of a few features of the Karate Test Automation framework that make API
(and UI!) testing really easy, readable and accessible. Testing complicated back-end services, which typically are not 
very human-friendly without an interactive UI, doesn't need to be complicated - Karate gives us scope to translate
this layer of testing into clean and concise test scenarios that hopefully improves the test experience for everyone.

We have only scratched the surface in terms of everything that the framework offers and in a subsequent blog we can take
a deeper dive into some of the other key features such as exploring the comprehensive assertion features, image 
comparison, built in HTML reporting or data driven tests via tags.

The documentation for Karate is really solid, with lots of examples and good explanations of each bit of functionality.
There's also a very active community on Stack Overflow asking and answering questions - you'll find the author of 
Karate answering a lot of queries. Lastly, I've provided a link to a blog from Automation Panda about Gherkin which
provides a comprehensive overview of the language.

[Karate Documentation](https://karatelabs.github.io/karate/)

[Karate on Stack Overflow](https://stackoverflow.com/questions/tagged/karate)

[Gherkin Language](https://automationpanda.com/2017/01/26/bdd-101-the-gherkin-language/)