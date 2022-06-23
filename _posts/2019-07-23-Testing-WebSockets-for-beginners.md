---
title: Testing WebSockets for beginners
date: 2019-07-23 00:00:00 Z
categories:
- efiennes
- Testing
tags:
- WebSockets,
- Testing,
- Automation,
- Java,
- JavaScript
author: efiennes
contributors:
- hwilliams-sl
layout: default_post
summary: What is a WebSocket and how do you test it? Herb Williams and I have been
  looking into this for a while now. This is what we found out.
image: efiennes/assets/Sockets6.jpg
---

In a series of posts which will span the research of myself and my colleague [Herb Williams](@hwilliams-sl), we will talk about our conclusions and general messing about with tools to test WebSockets.

We are going to look at the characteristics of WebSockets, what they do, how to test them and investigate the art of the possible with automation for functional and non-functional checking.

**Note:** This article relies on some knowledge of how http requests and responses work. Links are provided where the assumption of this knowledge has been made so you can go and read for further context if you want to.

## What is a WebSocket?

A WebSocket is a computer communications protocol, a system of rules that allow two or more devices to exchange information and data.

The well known internet standards [http and https](https://www.w3schools.com/whatis/whatis_http.asp) are also communications protocols which send and receive information via requests and responses.

A  protocol defines the rules, language, semantics and rate of synchronization of the exchange of info. It may also include details of and possible error recovery methods. 

In order to help a WebSocket create and manage its connection to a server, a [WebSocket (WS) API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) object is needed. Once the connection is created, the WS API also sends and receives data on the connection it has created.

The WebSocket API differs from the standard [SOAP](https://www.service-architecture.com/articles/web-services/soap.html) or [REST](https://www.mulesoft.com/resources/api/what-is-rest-api-design) API by virtue of the nature of its traffic.

If I was testing a REST API, I would send a request, “wait” for a response and interrogate that to make sure it had the response code, the data, format and response times I was expecting.

<p style="text-align:center;"><img src="{{site.baseurl}}/efiennes/assets/Sockets2.jpg" alt="Picture of a http request and a response being sent between a PC and a server in the form of 2 lines between the two "></p>

A nice REST API simple test in [REST Assured](http://rest-assured.io/) in Java would look something like this:

~~~java
import static com.mytestsite.restassured.RestAssured.given;
  @Test
    public void collectionResourceOK(){
      given()
        .param("limit", 20)
        .when()
        .get("endpoint")
        .then()
        .statusCode(200)        
~~~

I send a request with some parameters and expect a status code back. The test either passes or fails and the jobs is done. 

With a WebSocket API, we are looking at another kettle of fish altogether because of the persistent nature of the connections. We need a method to maintain the open connection and we need a way to see the messages that arrive in response to the messages that you are sending.

<p style="text-align:center;"><img src="{{site.baseurl}}/efiennes/assets/Sockets.jpg" alt="Picture of a WebSocket connection, request and a response and end of connection being sent between a PC and a server in the form of 4 lines between the two "></p>

## How can I see a WebSocket in action?
Before we get into the mechanics of creating any automation, it may be beneficial to see a simple WebSocket in action. The nice people at [Websocket.org](https://www.websocket.org/echo.html) have produced an web apge that allows you to play with their WebSocket or put in the URL for one of your own. 

It provides a simple data entry style of interface for you to be able to see a WebSocket opening connections, sending messages and closing connections.

## How can I test one of my own?
If you are interested, Websocket.org also have the code that drives the test that you can save locally to your PC and run through your browser to open a connection, maintain it and close it again. 

This is very useful in terms of looking at the structure and the order of the code in order to look at how the test requests are structured. However, if you have a lot of requests to process or a lot of WebSocket APIs to test, this will be a very time-consuming way to work so we need to look for a better way.

<p style="text-align:center;"><img src="{{site.baseurl}}/efiennes/assets/Sockets3.jpg" alt="Picture of the code from the websocket.org website used to test WebSockets through a browser"></p>

You can use the console tab of your browser’s developer tools to process requests through the WebSocket to a locally hosted API:

~~~javascript
//This will open the connection*
ws = new WebSocket("ws://localhost:8080/ws"); 
        
// Then you can send a message
ws.onopen = function () {
connection.send("Ping");
};
        
//Log the messages that are returned from the server
ws.onmessage = function (e) {
console.log("From Server:"+ e.data");
};
        
//Sending a simple string message
ws.send("HelloHelloIsThereAnyoneThere");
};
        
//Close the connection
ws.close()  
~~~

<p style="text-align:center;"><img src="{{site.baseurl}}/efiennes/assets/Sockets4.jpg" alt="Picture of the code in the Chrome browser console that opens a WebSocket connection"></p>

These are good for quick and dirty testing of a locally deployed API but they do not efficently scale if you want to run tests for regression against a number of deployed WebSockets. We will keep looking for that solution.

It would be great if there was a UI based tool that added a layer of abstraction to WebSocket testing but allowed us to chain [Chai]( https://www.chaijs.com) or other requests in the way that [Postman]( https://www.getpostman.com) does for REST APIs.

<p style="text-align:center;"><img src="{{site.baseurl}}/efiennes/assets/Sockets5.jpg" alt="Picture of a string of test snippets in the test tab of Postman"></p>

At the time of writing, there had been a [Feature request]( https://github.com/postmanlabs/postman-app-support/issues/4009) opened to introduce this functionality for over 18 months. The frequency of the comments and requests for updates on it show there is a lot of appetite in the testing community for this to be rolled out. 

## In summary 
So far, we have looked at what a WebSocket is and gone through some quick ways to seeing a test running against an individual API.

However, what about enterprise environments that may have 10s of the things running? It’s not nice to spend a day cutting and pasting code snippets. There are far better things that we could be doing so let’s automate instead!

As long as you have the specifications for the WebSocket APIs in place and the code mostly stable, this should be a very rewarding piece of work to complete which will save you having to do a lot of manual work going forward.

The next post will look at what options are out there for functional automation of WebSocket checking.
