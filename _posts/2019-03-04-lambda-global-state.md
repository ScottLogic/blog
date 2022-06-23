---
title: Maintaining global state in AWS Lambda functions with Async Hooks
date: 2019-03-04 00:00:00 Z
categories:
- ceberhardt
- Cloud
author: ceberhardt
layout: default_post
summary: This post looks at how the experimental Async Hooks API can be used to support
  global state within AWS Lambda functions. Considering that this is an experimental
  API it's worth treating with caution, but it does provide an interesting potential
  solution to a common problem.
image: ceberhardt/assets/featured/locks.png
---

This post looks at how the experimental [Async Hooks API](https://nodejs.org/api/async_hooks.html) can be used to support global state within AWS Lambda functions. Considering that this is an experimental API it's worth treating with caution, but it does provide an interesting potential solution to a common problem.

Before diving into the details, I want to spend a moment framing the problem. With lambda functions, global state is something that should be avoided. If you need to maintain state that persists between lambda invocations, you'll need to store this externally, in DynamoDB or ElastiCache for example. However, it is here that terminology becomes a little tricky, there are instances where you might want to have state that is maintained globally for the duration of the lambda function execution.

## The problem with global state

Take the following example:

~~~javascript
let foo = "bar";

export default function myFunc() {
  // provide some logic that depends on and mutates foo 
}
~~~

Here we have a mutable variable that is globally scoped to the module contained inside this file. You'd be forgiven for thinking that this might be OK when deployed as a lambda function. Unfortunately you'd be wrong! In practice the execution model of AWS lambda functions will mean that the `foo` variable is shared across multiple invocations, and your global state can 'leak'.

It is a shame that this trap, which could be quite dangerous (leaking state between clients for example), is so easy to fall into.

I encountered this problem myself with the [cla-bot](https://colineberhardt.github.io/cla-bot/), an AWS-hosted GitHub bot. In order to provide users with debug information, log messages are collated as the bot executes, with the final result saved to a public S3 bucket at the end. Unfortunately, in order to achieve this, I was relying on a mutable global.

Here's a simplified version of the logging module that is used through the bot's code:

~~~javascript
const messages = [];

const logger = {
  log(message) {
    messages.append(message);
    console.log(message);
  },
  flush() {
    // write message to an S3 bucket
  }
}
export default logger;
~~~

AWS shuts down inactive containers after ~20 minutes, so when the bot was being used infrequently this worked just fine. However as it became more popular the same container was being used multiple times and this global state 'leaked'. Fortunately these logs are public and no sensitive information is included!

Here's a very simple lambda function that reproduces the issue:

~~~javascript
const log = [];

const logMessage = msg => {
  console.log(msg);
  log.push(msg);
};

const getMessages = () => JSON.stringify(log);

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.hello = async () => {
  logMessage("test 1");
  await pause(1000);
  logMessage("test 2");
  await pause(1000);
  return getMessages();
};
~~~

The above code logs a couple of messages, then returns the completed message log. When invoked locally (I'm using the [serverless framework](https://serverless.com/)), it behaves as expected:

~~~
$ serverless invoke local --function hello
"[\"test 1\",\"test 2\"]"
~~~

When deployed to AWS, a single invocation gives the expected result:

~~~
$ serverless invoke --function hello
"[\"test 1\",\"test 2\"]"
~~~

But a second invocation gives the following:

~~~
$ serverless invoke --function hello
"[\"test 1\",\"test 2\",\"test 1\",\"test 2\"]"
~~~

This nicely illustrates the problem - the global state in the `log` array has been retained between invocations, leaking state. If you wait for around 30 minutes, then run it once again, you received the expected result, as the original container has been shut down and a new one offered up.

Whilst I felt a bit stupid for falling into to this trap, I did find that other (quite experienced) engineering teams had [fallen foul of this](https://medium.com/tensult/aws-lambda-function-issues-with-aglobal-variables-eb5785d4b876). The general advice is "don't use global state", which in the above example would mean changing the scope of the `messages` variable. Unfortunately in this case I would have to create a logger instance and pass it to every file / module that needs to make use of it, resulting in much more complexity.

It was at that point I started to look for other options ...

## Async Hooks

While hunting for alternatives I came across a node module called [continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage) which provides something akin to thread-local storage for node applications. Unfortunately this approach is based on a polyfill of [async-listener](https://www.npmjs.com/package/async-listener) which was a proposed addition to Node which [never actually landed](https://github.com/nodejs/node-v0.x-archive/pull/6011). It was superseded by the [Async Hooks API](https://nodejs.org/api/async_hooks.html), and an implementation of continuation-local-storage based on this newer API does exists, but the implementation looks pre-beta being [full of debug statements and comments](https://github.com/Jeff-Lewis/cls-hooked/blob/master/context.js) (this hasn't stopped >150 other packages on npm from using it!).

Rather than use something based on a polyfill for a feature that never landed, or a somewhat sketchy implementation based on the newer experimental API, I thought I'd implement this feature for myself.

Node achieves single-threaded non-blocking I/O, by executing everything within the [event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/). The Async Hooks API allows you to register callbacks which are invoked at various points in the lifecycle of an asynchronous operations. It also indicates which asynchronous operation triggered another, allowing you to trace execution from one asynchronous invocation to the next.

The API itself is quite simple, you register callbacks for the various lifecycle methods, then enable them. Here's an example that registers various handlers:

~~~javascript
const asyncHooks = require("async_hooks");
const fs = require("fs");

asyncHooks
  .createHook({
    init(asyncId, type, triggerId) {
      fs.writeSync(1, `init asyncId=${asyncId} triggerId=${triggerId} type=${type}\n`);
    },
    before(asyncId) {
      fs.writeSync(1, `before asyncId=${asyncId}\n`);
    },
    after(asyncId) {
      fs.writeSync(1, `after asyncId=${asyncId}\n`);
    },
    destroy(asyncId) {
      fs.writeSync(1, `destroy asyncId=${asyncId}\n`);
    }
  })
  .enable();
~~~

The `init` callback is invoked when a resource is created that might emit an asynchronous event, and `destroy` is invoked when destroyed. The `before` and `after` callbacks are invoked either side of asynchronous event invocation.

Notice that the above code uses `fs.writeSync` instead of `console.log`, this is because printing to the console is an asynchronous operation, which would result in unbounded recursion if used instead.

With the hooks registered, here is a simple code sample to illustrate:

~~~javascript
fs.writeSync(1, `Hello World executionId=${asyncHooks.executionAsyncId()}\n`);

setTimeout(() => {
  fs.writeSync(1, `Hello World executionId=${asyncHooks.executionAsyncId()}\n`);
}, 1000);
~~~

The `asyncHooks.executionAsyncId` function returns the unique execution id for the current execution context. When executed, it outputs the following:

~~~
Hello World executionId=1
init asyncId=5 triggerId=1 type=Timeout
init asyncId=6 triggerId=1 type=TIMERWRAP
before asyncId=6
before asyncId=5
Hello World executionId=5
after asyncId=5
after asyncId=6
destroy asyncId=5
destroy asyncId=6
~~~

From the above logs you can see that we start with an execution id of '1'. When `setTimeout` is invoked, it results in the creation of `Timeout` and `TIMERWRAP` resources - notice that their trigger id indicates the resource that created them. The `setTimout` callback is invoked within the execution context resulting from the `Timeout` resource, which has an id of '5'. Finally, these resources are destroyed.

The above example is quite simple - things become *much* more complicated as soon as you start doing things like making HTTP requests:

~~~javascript
https.get("https://www.google.com", res => {
  fs.writeSync(1, `status code ${res.statusCode}\n`);
});
~~~

This results in the creation of numerous resources, giving a glimpse into the node internals:

~~~
init asyncId=5 triggerId=1 type=TCPWRAP
init asyncId=6 triggerId=1 type=TLSWRAP
init asyncId=7 triggerId=1 type=TickObject
init asyncId=8 triggerId=1 type=DNSCHANNEL
init asyncId=9 triggerId=6 type=GETADDRINFOREQWRAP
init asyncId=10 triggerId=1 type=TickObject
before asyncId=7
after asyncId=7
before asyncId=10
init asyncId=11 triggerId=10 type=HTTPPARSER
init asyncId=12 triggerId=10 type=HTTPPARSER
init asyncId=13 triggerId=10 type=TickObject
after asyncId=10
before asyncId=13
after asyncId=13
before asyncId=9
init asyncId=14 triggerId=5 type=TCPCONNECTWRAP
after asyncId=9
destroy asyncId=7
destroy asyncId=10
destroy asyncId=13
destroy asyncId=9
before asyncId=14
before asyncId=6
after asyncId=6
init asyncId=15 triggerId=6 type=WRITEWRAP
after asyncId=14
destroy asyncId=14
before asyncId=6
after asyncId=6
before asyncId=15
after asyncId=15
before asyncId=6
before asyncId=12
status code - 200
after asyncId=12
[...]
destroy asyncId=42
destroy asyncId=43
destroy asyncId=44
destroy asyncId=45
destroy asyncId=46
destroy asyncId=47
destroy asyncId=48
~~~

One interesting thing I observed when pairing up `init` and `destroy` invocations is that they don't all match up - some resources are initialised but not destroyed. This is because some of the underlying resources are garbage collected, which means that they might persist beyond the lifetime of the above application code.

## Associating state 

With the `triggerId` passed to the `init` callback, it is possible to trace execution from one asynchronous event to the next. We can use this to associate state with each event, allowing it to be 'passed' from one event to the next without the need to scope it in the usual way.

This is surprisingly simple to do - here's a complete implementation of a 'context' module that maintains state object that is passed from one event to the next:

~~~javascript
const asyncHooks = require("async_hooks");

const state = new Map();

asyncHooks
  .createHook({
    init: (asyncId, _, triggerId) => {
      state.set(asyncId, state.get(triggerId));
    },
    destroy: asyncId => state.delete(asyncId),
    promiseResolve: asyncId => state.delete(asyncId),
  })
  .enable();

exports.getContext = () => state.get(asyncHooks.executionAsyncId());

exports.enable = fn => {
  const id = asyncHooks.executionAsyncId();
  state.set(id, {});
  return fn();
};

~~~

The `enable` function creates an initial state object and associates it with the current event's id via a state map. When the `init` callback is invoked, this state is copied across from the original event id (which is the trigger), to the new event id. The `destroy` and `promiseResolve` callbacks simply remove the id from the state map. Finally, the `getContext` function provides a way to retrieve the state associated with the current execution context.

Here's how the above context module can be used to replace the global mutable state in the simple 'logging' lambda function example:

~~~javascript
const { getContext, enable } = require("./context");

const logMessage = msg => {
  console.log(msg);

  const context = getContext();
  if (!context.log) {
    context.log = [];
  }
  context.log.push(msg);
};

const getMessages = () => 
  JSON.stringify(getContext().log);

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.hello = async () =>
  enable(async () => {
    logMessage("test 1");
    await pause(1000);
    logMessage("test 2");
    await pause(1000);
    return getMessages();
  });
~~~

The lambda function is wrapped in the `enable` function, which initialises the context. Within the `logMessage` function this same context is obtained (without the need to store it locally, or pass it as an argument to the function), and a `log` property added, which is used to store the log messages. Finally, the `getMessages` function retrieves these logged messages, which are returned by the lambda function.

When deployed to AWS, this lambda function now behaves as expected. No matter how many times it is invoked, the state does not 'leak' from one execution to the next:

~~~
$ serverless invoke --function hello
"[\"test 1\",\"test 2\"]"
~~~

Clearly this is quite a contrived example, however, this technique could prove quite useful for more complex cases, with code spread across multiple files / modules.

I'm going to be giving this a try on the cla-bot to see how it works in practice. Considering that this is an experimental API, and I am using it to create global state, I want to keep an eye on how it works in production (in my case, I'm logging the `state` map so that I can check for memory leaks).

Perhaps you might find a use for this technique too?