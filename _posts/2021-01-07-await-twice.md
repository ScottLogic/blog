---
title: What happens if you await a Promise twice?
date: 2021-01-07 00:00:00 Z
categories:
- abirch
- Tech
author: abirch
layout: default_post
summary: JavaScript provides a Promise abstraction that can be used to express 'give
  me the result later'. What happens if you ask for the result twice?
---

_The following is distilled from a discussion on our `#javascript` Slack channel._

Consider the following:

~~~js
let counter = 0;
const increment = new Promise(resolve => {
  counter++;
  resolve();
});
await increment;
await increment;
console.log(counter); // 1? 2? something else?
~~~

What value do we expect `counter` to have?

What is a promise? Does it mean "do this later"?

It's more accurate to think of promises as state machines.  
A promise begins its life in a "pending" state. If you ask for the result whilst it's in this state: you'll have to queue for it.

The `Promise` constructor above [calls our executor function](https://tc39.es/ecma262/#sec-promise-executor) immediately. Its `counter++` side-effect runs. `resolve()` is called with no arguments, [storing an `undefined` result on the promise](https://tc39.es/ecma262/#sec-promise-resolve-functions) and [promoting its state to "fulfilled"](https://tc39.es/ecma262/#sec-fulfillpromise).

The first `await` runs. [`await`](https://tc39.es/ecma262/#await) is equivalent to running [`.then(onFulfilled)`](https://tc39.es/ecma262/#sec-performpromisethen) upon your promise, with `onFulfilled` set to "the code ahead". This work is [enqueued as a microtask](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#Timing). JavaScript executes microtasks [in FIFO order](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-jobs-and-job-queues); control returns to our function eventually.

The second `await` is no different. It creates a microtask to "give me the promise result and run the code ahead", and waits to be scheduled by JavaScript.

Our side-effect only ever ran once — during `Promise` construction.  
`counter` is `1`.

Did we defer any work? No; the promise was created and fulfilled synchronously. But we used `await` to [yield control](https://en.wikipedia.org/wiki/Cooperative_multitasking) to other microtasks.

How would we defer work?

~~~js
const microtask = Promise.resolve()
.then(() => console.log('hello from the microtask queue'));

const macrotask = new Promise(resolve =>
  // enqueue a macrotask
  setTimeout(() => {
    console.log('hello from the macrotask queue');
    resolve();
  })
  // we did not resolve; promise remains in pending state
);

// this is logged first; we succeeded in deferring work
console.log('hello from the original execution context');

// yields to scheduler; .then() reaction runs (and logs)
await microtask;
// yields to scheduler; promise already fulfilled, so nothing logged
await microtask;

// yields to scheduler; all microtasks run, then macrotask runs (and logs)
await macrotask;
// yields to scheduler; promise already fulfilled, so nothing logged
await macrotask;
~~~

The `Promise` constructor runs synchronously, but we do not have to call `resolve()` synchronously. [`Promise.prototype.then`](https://tc39.es/ecma262/#sec-performpromisethen) also defers work.

Neither the `Promise` constructor nor `Promise.prototype.then` repeat work.  
The implication of this is that _promises can be used to memoize async computations._ If you consume a promise whose result will be needed again later: consider holding on to _the promise_ instead of its result!

It's fine to `await` a promise twice, if you're happy to yield twice.
