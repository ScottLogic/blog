---
title: A Beginner's Guide to Automated API Testing (Postman/Newman)
date: 2020-02-04 00:00:00 Z
categories:
- Testing
tags:
- API
- Testing
author: smangan
layout: default_post
summary: 'A quick introduction into API automated testing using Postman and Newman. Postman tests can be so simple and straight forward. Newman gives the capability of running Postman tests through the command line. I''ll discuss implementing basic tests to showing how valuable Postman tests can be in a CI/CD environment.  '
image: smangan/assets/postman.png
---

After recently finishing up on a project, I wanted to reflect on my journey, from initially being introduced to API testing to implementing a full API automated test suite in the space of a few weeks. When I first started to implement automated tests, I found resources to be scattered. Rooting through documentation for something that seemed to be so simple was tricky. I thought I’d put together a quick guide on getting basic tests running through the command line with Newman which can easily slot into any CI/CD environment with minimal effort.  

## The Tech
For the project, there was a requirement for automated API tests to be in place in a CI/CD environment for continuous testing. Only having experience in UI automated testing, API testing was a new field for me. With new technologies constantly appearing, the list of testing tools available is endless. When looking for an opinion, I got a million and one different tools thrown at me, each one slightly different from the last. As a graduate I found it difficult to search through this huge pile of tech, hoping to pull out the correct one that suited my testing needs. 

Having some experience with Postman, I was unaware of its ‘under the hood’ sidekick Newman. Newman gives the capability of running Postman collections through the command line with no manipulation needed to the collection. These tests can be easily integrated with continuous integration systems to provide automated API test coverage. So here we go: 

## Tutorial

### Create a Collection and Running Newman Tests
In Postman select “New” -> “Collection”. Name your collection whatever you feel is appropriate. I’ll be using this [Dummy API](http://dummy.restapiexample.com/) just for the purpose of the demo. 

![1.png]({{site.baseurl}}/smangan/assets/1.png)


Next, add a request to the collection. As a first pass we’ll use a simple GET request. 
Right click on the collection name and select ‘Add a Request’. Navigate to the test column and write some basic tests:

![2.PNG]({{site.baseurl}}/smangan/assets/2.PNG)

The tests above are basic checks typically seen in Postman tests. We check: 

1. If we get back the expected response code
2. If a response is returned under a specific time constraint
3. If a response comes back in the correct format

Send the response, making sure that all tests pass. Now for the exciting bit.. We’re going to export this collection and run the same tests through the command line.

### Exporting Postman Collection
Firstly, install Newman (npm install -g newman). Now that Newman is installed, go to Postman. Right click on the collection and select ‘Export’. You should be prompted with this alert: 

![3.PNG]({{site.baseurl}}/smangan/assets/3.PNG)

Save it to any directory. The collection should be saved as a postman_collection.json file. 

### Running the Tests
Open a terminal and navigate to where the Postman json file is saved. To execute the tests simply run : 

`newman run BlogPost.postman_collection.json`

![4.PNG]({{site.baseurl}}/smangan/assets/4.PNG)

There you have it. A Postman collection executed through the command line. As simple as it seems we now have shown it's possible to run tests through the command line, let’s look at what this opens up. 

1. Being able to execute Postman collections gives us the ability to run these tests in a CI/CD environment
2. Tests can be easily built on through Postman and exporting again
3. Multiple requests can be made in each collection with their own set of tests
4. Multiple collections can be executed

### Specifying environment variables
Let’s say you have a development and a test environment with two separate URLs. When a change is merged to the master branch, we want to run a set of tests. Since we want to run tests in both environments, does there have to be two separate postman collections to run the exact same tests? 

Well no, no there doesn't. This would lead to multiple collections being needed to run the exact same tests, leading to a huge amount of maintenance. Postman gives us the capability of passing environment variables into anywhere in a request. For the purpose of the tutorial, we'll pass a variable into a request URL. In Postman, create a set of environment variables. Name the set appropriately to the environment in which you want to run tests against. 

![5.PNG]({{site.baseurl}}/smangan/assets/5.PNG)

Define a URL variable denoting a piece of the actual URL: 

![6.PNG]({{site.baseurl}}/smangan/assets/6.PNG)

Now that the variable is defined, we can now pass it into our request. Replace the segment of the URL with the environment variable as shown below. In a real world situation we would have two sets of environment variables, one for each environment. 

![7.PNG]({{site.baseurl}}/smangan/assets/7.PNG)

So now that we have our environments defined in Postman, lets see how to pass these values into a collection when running in Newman. We need to download the set of environment variables and save them to the same directory as the Postman collection.

![8.PNG]({{site.baseurl}}/smangan/assets/8.PNG)

Since the initial Postman collection has been updated as well, we will need to export that again making sure that it is saved to the same directory as the environment variables. 
Through command prompt, we can now specify the environment we want to run the tests against by passing in the set “DevelopmentEnvironment” variables.

`newman run BlogPost.postman_collection.json -e DevelopmentEnvironment.postman_environment.json`

The only change needed for running against a different environment would be changing the command line argument to reference a different set of variables. 

Let’s reflect on what we have here. Apart from the point already made on running a collection in a CI environment, we’re now also able to pass in variables. This allows us to be able to run tests against multiple different environments without having re-write tests, only needing to change one argument in the command.  

### Passing variables from collection to collection
Let’s say we need to attach an access token to our request to hit a specific endpoint. Could we not just attach a token to our tests, export the collection and put them into our CI? Well no, no you can’t. That would work for a while but what the tests would fail once the access token expires. So any access token I attach to my Postman collection to run in CI is eventually going to be invalid.

We need a way of automatically generating a fresh access token and passing it into our Postman tests. In CI terms, we need to be able to generate an access token on every run of tests. 
Let’s break this down in parts. Firstly, we can easily [generate an access token through Postman](https://www.toolsqa.com/postman/oauth-2-0-authorization-with-postman). How about we create a collection that requests an access token from your service, saves it as a variable and passes it into the tests. For the purpose of the tutorial, let’s see how you’d save some data from a response as an environment variable. 

Add a variable to store the access token to the original set of environment variables ***making sure that it’s the same set of variables as you will use for running the tests.*** 

![9.PNG]({{site.baseurl}}/smangan/assets/9.PNG)

Next, send a request with the correct headers to your authentication service (Again, I won’t go into these details). We’ll send a request and with a value in the response body we’ll update the access token environment variable by using Postman's function ‘setEnvironmentVariable’.

![10.PNG]({{site.baseurl}}/smangan/assets/10.PNG)

Copy the code above and send the request. Go to your environment variables collection and ta-da ! You’ve updated the environment variable.
Think back to our real world scenario, when we send a request for an access token we can now grab that access token from the reponse and attach it to any future responses we need `{{access_token}}`. 

We’re nearly there! So in theory, we should now be able to run our collection to get the access token and then run the tests with the new access token environment variable passed in? Close, but not yet. 
Newman does not update the environment variables file during a run of tests. So to save the new values of the environment variables after a collection run, simply add this argument when running the collection that updates the variables : 
`--export-environment OurEnvironment`

In our case : 
`newman run BlogPost.postman_collection.json -e DevelopmentEnvironment.postman_environment.json --export-environment DevelopmentEnvironment.postman_environment.json`

In a real world scenario, to generate a new access token and to the run tests with that new token two postman collections will be needed. One is to generate the access token and the other runs the actual tests. Follow the steps above to request a token from your service and save that it as an environment variable making sure to add the `--export-environment` argument to update the file. This variable can then be passed to the actual tests and used as a header `{{access_token}}`. 
Example below: 

1. `newman run accessTokenCollection -e env --export-environment env`
2. `newman run tests_collection -e env` 

##Summary
There you have it. A few tips on implementing automated API tests with Newman. These tests are so straightforward to implement and with some tweaking, they can provide a valuable CI/CD solution for continuous testing against multiple environments. API testing provides extreme value in an agile environment, giving the capability of identifying server side defects faster without the need to test a user interface which saves time and resources. 

One thing to outline, Postman collection json files can be difficult to read without being imported through Postman. There is no easy way around this only by importing the file through Postman and checking whether the tests pass or fail.

