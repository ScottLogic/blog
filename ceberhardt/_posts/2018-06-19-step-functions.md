---
author: ceberhardt
layout: default_post
title: Sleeping Lambdas and AWS Step Functions
summary: With AWS Lambda you pay for execution duration, which means that sleeping or waiting during execution has a direct impact on your bill! This blog post takes a look at how to make AWS Lambda functions sleep, without incurring costs, via AWS Step Functions.
categories:
  - Cloud
image: ceberhardt/assets/astexplorer.png
---

With AWS Lambda you pay for execution duration, which means that sleeping or waiting during execution has a direct impact on your bill! This blog post takes a look at how to make Lambda functions sleep, without incurring costs, via AWS Step Functions.

Skipping to the end, unfortunately Step Function development, while fun, was not an easy task, and the finished result actually runs up an AWS bill that is ten times bigger than my naive 'sleeping lambda'. I still think this is a promising technology, to find out more, read on ...

## Applause 👏👏👏

A brief overview of why I want my Lambda functions to sleep ...

Recently I made a small design change to our company blog, removing the tweet count indicator that was displayed alongside each article, replacing it with a [medium-style applause button](https://help.medium.com/hc/en-us/articles/115011350967-Claps). The reasons for this were two-fold:

1. Twitter [removed the unofficial API for obtaining tweet counts a few years ago](https://twittercommunity.com/t/a-new-design-for-tweet-and-follow-buttons/52791), and a reliable replacement hasn't emerged since.
2. The various authors who contribute to this blog agreed that they like some form of positive feedback from readers, and the medium-style clap button was a popular choice.

Although, I must admit, there was a third reason ... I like building things!

Using various AWS services (lambda, dynamo, API-gateway) it didn't take long to come up with a minimal replacement, the [Applause Button](http://applause-button.com/). I'm happy to say that the posts to this blog collectively receive hundreds of claps every day.

Of course, now that we had our own mechanism for recording claps, I wanted to have a live display that shows these interactions as they happen. I bought a WiFi-connected [LaMetric "smart" clock](https://lametric.com/), which has a very simple interface for displaying custom notifications. You send an HTTP post to their API endpoint, with a UID for your clock, a token and the payload  which describes the icon and text you want to appear.

The clock updates almost immediately after. Here it is above my desk showing the number of claps so far for the day:

<img src="{{site.baseurl}}/ceberhardt/assets/applause/claps-indicator.jpg"/>

The path from someone clicking the button on our website, to the display updating, is as follows:

<img src="{{site.baseurl}}/ceberhardt/assets/applause/applause-architecture.png"/>

1. The current number of claps for an article are retrieved from DynamoDb by a lambda function
2. When someone clicks the applause button, an update is posted to a lambda function, incrementing the count in DynamoDb
3. A DynamoDb stream sends update events to a lambda function
4. The lambda function sends an update to the `developer.lametric.com` endpoint
5. The update arrives at my clock!

So what has all of this got to do with wanting lambda functions to sleep?

It's actually quite simple, the LaMetric API allows you to send an update to you clock, however I wanted the update to display the number of claps, followed by the blog post title and finally the total claps for the day. This requires sending three HTTP requests with a delay in between each.

<img src="{{site.baseurl}}/ceberhardt/assets/applause/lametric-frames.jpg"/>

There is nothing stopping you from using `setTimeout` to write code that 'sleeps' within a lambda function (apart from the lambda timeout, which you can increase), however, this is something of an antipattern. With lambda functions charged by execution duration, the longer your function sleeps, the more it will cost you!

After paying for a month of idle time, I decided to look for a better solution.

## Step Functions

AWS Step Functions were introduced just over a year ago. In brief, Step Functions are state machines with a visual workflow, allowing you to coordinate various activities and tasks.

Step Functions define states which can perform a variety of functions (e.g. branch, delay, execute tasks defined in lambda function), with data passed between each of these states. The idea being that you can define small pieces of application logic, with your Step Functions providing the overall orchestration. 

The Step Function feature I was most interested in was its Wait state, which allows you to pause execution for a configurable number of seconds. The billing model for Step Function charges based on the number of state transitions, therefore long pauses in execution do not incur a cost. You can even pause your state machine for a whole year!

## Serverless Step Functions

As with most AWS services, the console gives you a web-based front end for configuring your Step Functions. This might look appealing for creating orchestrations, however for various reasons I wanted to adhere to the principle of *configuration as code*.

I've been using the [Serverless framework](https://serverless.com/) for a while now and really like the simple abstraction layer it provides over Cloud Formation. Serverless doesn't support Step Functions directly, but there is a [mature plugin](https://github.com/horike37/serverless-step-functions) that provides support.

With Serverless and the serverless-step-functions plugin, the state machine is described in YML, together with the required API gateway configuration to kick-off execution from an HTTP request.

The LaMetric developer API accepts a payload of the following form:

~~~json
{
  "frames": [
    {
      "text": "This message is displayed on screen",
      "icon": "a8699",
      "index": 0
    }
  ]
}
~~~

Where the display cycles through one or more frames of text with an associated icon.

The design of my state machine is quite simple, it is initially fed with multiple LaMetric payloads, with a wait in seconds between each one. This is what one of those requests looks like:

~~~json
{
  "url": "https://developer.lametric.com/...",
  "headers": {
    "Accept": "application/json",
    "X-Access-Token": "..."
  },
  "requests": [
    {
      "wait": 0,
      "data": {
        "frames": [
          {
            "text": "message one",
            "icon": "a8699"
          }
        ]
      }
    },
    {
      "wait": 5,
      "data": {
        "frames": [
          {
            "text": "message two",
            "icon": "a8699"
          }
        ]
      }
    }
  ]
}
~~~

The state machine iterates over the array of `requests` above, on each iteration it sends the associated `data`, then pauses for the number of seconds defined in the `wait` property. Once all the requests have been sent, the state machine execution ends.

The definition of this state machine, is shown below:

~~~yml
service: lametric-step

plugins:
  - serverless-step-functions
  - serverless-pseudo-parameters

provider:
  name: aws
  runtime: nodejs8.10
  region: us-east-2

functions:
  request:
    handler: handler.request

stepFunctions:
  stateMachines:
    stepFunction:
      events:
        - http:
            path: update
            method: POST
      name: lametric-step
      definition:
        StartAt: Iterator
        States:
          Iterator:
            Type: Task
            Resource: arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:${self:service}-${opt:stage}-request
            ResultPath: "$.iterator"
            Next: Pause
          Pause:
            Type: Wait
            SecondsPath: "$.iterator.wait"
            Next: IsCountReached
          IsCountReached:
            Type: Choice
            Choices:
            - Variable: "$.iterator.continue"
              BooleanEquals: true
              Next: Iterator
            Default: Done
          Done: 
            Type: Pass
            End: true
~~~

The `stepFunction.events` allows this Step Function to be initiated via an HTTP request, which will result in the requited API Gateway configuration being constructed on deployment. The state machine itself is defined in the `stepFunction.definition`, with execution starting at the `Iterator` state. The HTTP request body is used as the initial data that is passed to the first state.

The `Iterator` state is a Task, which is defined as a lambda function. Before digging into the details of this function, we'll take a look at the subsequent states.

The `Iterator.Next` property points to the next state, which is the `Pause` state. This is a state of type `Wait` which pauses execution of the state machine for a period of seconds. In this case it is defined by the path `$.iterator.wait`, which is a reference to a property within the machine data which is passed from one state to the next. We'll see how this is populated shortly.

Following the `Pause` state, the `IsCountReached` state is executed, this is a simple branch condition that either returns to the `Iterator` state or terminates execution via the `Done` state.

The Step Function, together with the associated Lambda and Gateway configuration is deployed by running `serverless deploy`

Here is what this state machine looks like in the AWS console:

<img src="{{site.baseurl}}/ceberhardt/assets/applause/state-machine.png"/>

So in order to coordinate the state machine, and ensure it iterates for the correct number of steps, the data passed between states needs to be updated to track the iteration index, the seconds to pause for this iteration, and whether to terminate.

Returning to the lambda function used to implement the `Iterator` task, here it is in full:

~~~javascript
const fetch = require("node-fetch");

module.exports.request = async (event, context, callback) => {
  
  // obtain the current iteration state, or default to zero
  const index = event.iterator ? event.iterator.index : 0;

  // locate the request body for this iterations
  const request = event.requests[index];

  // send the request
  const result = await fetch(event.url, {
    method: "POST",
    headers: event.headers,
    body: JSON.stringify(request.data)
  });
  const resultText = await result.text();

  console.log("request result", event.url, index, resultText);

  // update the iteration state
  const iterator = {
    continue: index < event.requests.length - 1,
    wait: request.wait || 0,
    index: index + 1
  }
  callback(null, iterator);
};
~~~

The function obtains the iterator state from the passed event data (i.e. the machine state data), or defaults to zero if no iterator state is present. The request for the given index is posted, updating the clock with the given message, and finally the iterator state is updated, with the `wait` and `continue` properties directing the `Pause` and `IsCountReached` states accordingly.

Notice that the lambda only returns the iterator state, the `ResultPath: "$.iterator"` configuration ensures that the data returned by this function is merged into the machine data at the `iterator` path.

You can watch your step function execution in real-time via the AWS console, inspecting the data returned by tasks, and the overall machine state:

<img src="{{site.baseurl}}/ceberhardt/assets/applause/state-machine-execution.png"/>

## Conclusions (and reflection on Step Functions)

For this project Step Functions were a great fit, the use of this simple state machine approach has significantly reduced the overall duration of my Lambda function execution. However, while the end result looks good, it wasn't an easy journey.

One of the biggest pain points of Step Functions is testing. The online console feels quite magical, but the overall development cycle times are far from ideal. It takes around 30 seconds to package, upload and deploy a new stack, followed by a number of clicks on the UI to find and debug your latest execution.

For Step Function tasks (lambdas) local testing is a must, which is easily achieved using Serverless, or the similar [SAM tool from AWS](https://docs.aws.amazon.com/lambda/latest/dg/serverless_app.html). However, many of the issues I faced were in configuration of the state machine itself, which cannot be executed locally. There is an [open issue requesting support](https://github.com/awslabs/aws-sam-cli/issues/174).

I also found the features of the console a little lacking in places. While you can easily see inputs and outputs for states, you often need to view the logged output from your lambda functions. The interface provides a link to Cloud Watch, but rather than directing you to the output relating to the current execution, it just takes you to the Log Group.

The whole process feels unnecessarily slow!

Finally, the reason I explored Step Functions was to avoid paying for 'sleeping lambdas'. After implementing my state machine I thought I'd look at the potential cost saving (arguably I should have done this first!)

### Pricing

Lambda is priced by both the number of requests, and duration, measured in GByte seconds. The first thing I discovered was that the default size for Lambda functions is 1,024 MBytes, which has a price of $0.000001667 per 100ms. If your lambda functions are simple (as mine are), you get an 8-fold saving by reducing the maximum memory to 128 MBytes, giving $0.000000208 per 100ms. Further to this, individual requests are charged at $0.0000002 each.

In order to turn these into a more sane unit, I'm going to use SI units of micro-dollars (µ$), and seconds. This gives an execution cost of µ$2.08 per second, and µ$0.2 per request.

Therefore, a sleep of 5 seconds will cost me µ$10.6.

Step Functions are charged by state transitions, at a cost of $0.000025, or µ$25 per transition. With my state machine, a sleep, regardless of its duration, requires four state transitions. As a result, the minimum cost is µ$100.

Therefore a five second sleep costs me considerably less with a lambda function (µ$10.6) than it does with a step function (µ$100).

I really *should* have done this maths at the beginning!

Step Functions do feel like an experimental technology, I'd be very wary of using them on anything more critical than a hobby project. Despite this, they have a lot of potential. The general concept of state machines which coordinate business logic, is a good one. However the tooling really does have a lot of catching up to do. In order to be productive in development we need rapid iterations, which in this case most likely requires local execution. 

But we need more than rapid development cycles, we also need rapid cost modelling. I'd love to see a tool which allows you to iterate on your design, whilst giving you an indication of how much each component of the system costs.

I'm not sure I'll be using Step Functions again anytime soon ...