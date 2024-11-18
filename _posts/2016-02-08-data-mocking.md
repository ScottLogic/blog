---
title: Data Mocking - A way to test the untestable
date: 2016-02-08 00:00:00 Z
categories:
- Testing
tags:
- testing
- data
- mocking
author: rhamilton
summary: Some of the biggest challenges when testing software can be getting the software into some very specific states...
layout: default_post
---

Some of the biggest challenges when testing software can be getting the software into some very specific states. You want to test that the new error message works, but this message is only shown when something on the back-end breaks and the back-end has never broken before because it always "just works". Maybe the software you have to test is powered by other people's data, data that you have no direct control over and you really need to manipulate this data in order to perform your tests.

Imagine you are testing a piece of software which displays the names of local businesses as values as a drop-down list.

This software might look something like this...

<img src="{{ site.baseurl }}/rhamilton/assets/select1.png" alt="select drop-down1" title="select drop-down1"/>

There are only three items on this list at the moment, but this may not always be the case.

There is currently no option within the software itself to change or manipulate the text displayed on the list because the software retrieves this list of data from someone else's API. We have no control over the data returned by the API, our software under test just displays it.

You have been asked to test the drop-down box. What would you do?

Well most testers would start by looking at it. It appears to work correctly. Items can be selected, the Submit button can be clicked. But how would this drop-down behave with a different set of data behind it? Well we don't know (yet) but it is possible that it could appear or behave differently.

One solution which would allow more scenarios to be tested would be to force the drop-down list to use some fake made-up data. This approach is commonly referred to as testing with mock data or simply "mocking".

Mock data is fake data which is artificially inserted into a piece of software. As with most things, there are both advantages and disadvantages to doing this.

One of the big advantages with mock data is that it makes it possible to simulate errors and circumstances that would otherwise be very difficult to create in a real world environment. A disadvantage however is that without good understanding of the software, it will be possible to manipulate data in ways which would never actually happen in the real world.

Let me give an example. If an API is hard-coded to always respond with 0, 1 or 2 as a status code and you decide to mock this API response to return "fish". As soon as the software asks "what's the status?" and it gets the reply "fish" it might explode because it wasn't expecting "fish". Although this explosion would be bad, this might not be a really big problem because it was your mock data that caused the fish explosion and "fish" is really not a valid status code. You could argue that in a real world environment [this would never happen](http://www.rense.com/general81/dw.htm) (famous last words).

Mocking is essentially simulating the behaviour of real data in controlled ways. So in order to use mock data effectively, it is essential to have a good understanding of the software under test and more importantly how it uses its data.

To start using mock data the software under test needs to be "tricked" into replacing real data with fake data. I'm sure there are many ways to do this but one way I have seen this successfully achieved is through the addition of a configuration file. This configuration file can contain a list of keys and values. The keys being paths to various API end points and the values names of files that contain fake API responses. The application code is told to check the config file and if it contains any fake responses to use those instead of the real responses.

Collecting data to make mocks from is a fairly straight forward process if the application can be opened inside a browser. Opening the browser developer tools (F12), inspecting the Network tab then interacting with the software (i.e.. changing the value on the drop-down box) will usually reveal API requests made and display the associated response received.

Let's continue with the example of our software which displays the names of local businesses as values as a drop-down list. To keep things simple I'm going to say that this software uses a REST API with the following request and response.

A request URL might be:

    https://www.somecompany.com/api/business/names

And a response might be:

    [{"id":"0000001","name":"Tidy Town Taxis" },
     {"id":"0000002","name":"Paul's Popular Pizzeria" },
     {"id":"0000003","name":"Costalotta Coffee Shop" }]


So to set up some mock data for this app, we could copy and paste the response into a file and tell the software to use that data instead of the data at the real API endpoint.

And this is where the fun begins. Once the software has been tricked into using mock data we have direct control over the data used by our application and we can start manipulating it.

If we wanted to test what happens when the list has many values, we could just change the mock data by adding more values to the file so it looks like this...

    [{"id":"0000001","name":"Tidy Town Taxis" },
      {"id":"0000002","name":"Paul's Popular Pizzeria" },
      {"id":"0000003","name":"Costalotta Coffee Shop" },
      {"id":"0000004","name":"Hey guess what, this is fake data" },
      {"id":"0000005","name":"And this is also fake data" },
      {"id":"0000006","name":"This data was made up" },
      {"id":"0000007","name":"But the app thinks it's real" }]

Once this new mock is fed back into the application, it might look something like this...

<img src="{{ site.baseurl }}/rhamilton/assets/select2.png" alt="select drop-down2" title="select drop-down2"/>

When there are 7 items on the list, the contents of the list now covers the Submit button. We may also find that application performance is degraded when a larger number of items are displayed.

It is now possible to test lots of new ideas. These could be things like...

 + Many values
 + Duplicate values
 + Long strings
 + Short strings
 + Accented characters
 + Asian characters
 + Special characters
 + Alpha-numerical values
 + Numerical values
 + Negative numerical values
 + Blank values
 + Values with leading spaces
 + Values with multiple spaces
 + Reserved words "NULL", "False" etc.
 + Code strings
 + Comment flags e.g. "//"
 + Profanity
 + False positive profanity e.g. "Scunthorpe"

Test ideas are now only limited by your imagination, not the application!

Mock data can also be used to see how an application handles API responses which are not "200 OK". We can start testing error states by tricking the software into thinking the API end point returned an error when it didn't. Testing error handling becomes especially important when the software reacts in different ways to different types of errors which can occur.

Imagine an application that handles each of the following error codes in a different way:

 + 400 - Bad Request
 + 401 - Unauthorised
 + 404 - Not Found
 + 408 - Request Timeout
 + 500 - Internal Server Error
 + 503 - Service Unavailable
 + 504 - Gateway timeout

It would be very difficult without mock data to force each of the above error states manually. Testing error handling is where mock data really shines and becomes a very powerful tool.

If you're looking for ways to improve the 'testability' of applications that you are building, consider adding a way to launch the application using mock data. You might be surprised how creative testers can be with data and you could start to spot issues that otherwise would have been missed.

This post was also published on my software testing blog [Mega Ultra Happy Software Testing Fun time](http://testingfuntime.blogspot.co.uk/).
