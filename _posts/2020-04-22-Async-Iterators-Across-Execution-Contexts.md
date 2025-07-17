---
title: Cross-window async iterators using Comlink
date: 2020-04-22 00:00:00 Z
categories:
- Tech
author: sburnstone
layout: default_post
summary: Async iterators are a great language feature that make working with asynchronous
  streams of data a joy to use. We'll take a look at consuming an async iterator running
  in a Web Worker from the main thread and see how we can use a library called Comlink
  to abstract away the fact it's running in a different execution context.
---

Async iterators are a great language feature that make working with asynchronous streams of data a joy to use. We'll take a look at consuming an async iterator running in a Web Worker from the main thread and see how we can use a library called Comlink to abstract away the fact it's running in a different execution context.

The first part of this post is a brief introduction to iterators and generators, however you may want to skip ahead to the [Comlink section](#comlink-and-async-iterators) if you're already familiar with these language features.

## What's an iterator?

Before we delve into asynchronous iterators, it seems a good idea to have quick look at what a synchronous iterator is.

Lots of developers will be familiar with the following:

~~~js
const someNumbers = [0, 10, 20];

for (const elem of someNumbers) {
  console.log(elem);
}
~~~

Here, we're just iterating over each of the items of the array.

For a long time, I didn't think much of the simple `for-of` statement. I assumed when it was given an array, it just knew how to iterate over it. However, it turns out that the iteration behaviour is determined not by the `for-of` statement, but instead by the array's iterator, which the statement will use.

The great thing about an iterator is the iteration behaviour only needs to be defined once. Users of the iterator - such as the `for-of` operator - can consume it and not care about the object it's iterating over.

The iterator is added to an object by assigning a function that creates an iterator to its `Symbol.iterator` property. This is what the `for-of` statement will look for in order to find the iterator. An object with an iterator is known as an [iterable](https://tc39.es/ecma262/#sec-iterable-interface).

The following is equivalent to the code block above:

~~~js
const someNumbers = [0, 10, 20];

const iterator = someNumbers[Symbol.iterator]();

for (const elem of iterator) {
  console.log(elem); // prints 0, 10, 20
}
~~~

### Creating your own iterator

An iterator is an object that includes a `next` function. It's this function that allows consumers of the iterator to "iterate" over the object. Say we wanted to create a `strider` object that returned a sequence of numbers with a specified interval between them.

~~~js
const makeStrider = interval => ({
  [Symbol.iterator]: () => {
    let currentValue = 0;
    return {
      next: () => ({
        value: (currentValue += interval),
        done: false
      })
    };
  }
});
~~~

The object now has an iterator that will increment the value by the interval when `next` is called. Note that we don't simply just return the value, but instead an [`IteratorResult`](https://tc39.es/ecma262/#sec-iteratorresult-interface) containing the `value` and a `done` boolean value that indicates whether the iterator has completed.

The `for-of` statement will take care of pulling out the value from the result object.

~~~js
for (const value of makeStrider(2)) {
  console.log(value); // prints 2, 4, 6, 8, 10
  if (value >= 10) {
    break;
  }
}
~~~

Note that we stop iterating after receiving the value 10. If we didn't then we'd end up in an infinite loop and likely cause the tab to crash!

There's no requirement to use something like the `for-of` statement in order to iterate over the object; we can manually call the `next` function as well.

~~~js
const strideBy2 = makeStrider(2);
const iterator = strideBy2[Symbol.iterator]();

console.log(iterator.next()); // prints { value: 2, done: false }
const { value } = iterator.next();
console.log(value); // prints 4
~~~

### Detecting when the caller has finished iterating

Sometimes it can be handy to detect when the caller indicates it no longer wishes to make any further `next` calls. This can be done by invoking the `return` function, [an optional method](https://tc39.es/ecma262/#table-54) that's part of the `Iterator` interface. Let's add that to our `strider` object:

~~~js
const makeStrider = interval => ({
  [Symbol.iterator]: () => {
    let currentValue = 0;
    let isCompleted = false;
    return {
      next: () => {
        if (isCompleted) {
          return {
            done: true
          }
        }

        return {
          value: (currentValue += interval),
          done: false
        }
      },
      return: () => {
        console.log("return called!");
        return {
          value: undefined,
          done: true
        };
      }
    };
  }
});

const strideBy2 = makeStrider(2);

for (const value of strideBy2) {
  if (value >= 10) {
    break; // When this is hit, "return called" is printed in the console
  }
}
~~~

When we break out of the loop, the `return` function on our iterator will be called now that we've defined it.

We've also extended our iterator to better adhere to the spec. Once `return` is called, any subsequent calls to `next` should no longer iterate over our object as the iterator has completed. Having to maintain this additional state is a bit of a pain, so we'll look at how another language feature called generators can help us.

### Using a generator to do the hard work

For our simple strider, we can use a generator to do the hard graft for us.

A generator function is denoted by the special `function*` syntax. Calling this function will create a generator. A generator implements `next`, as well as the two optional methods of the `Iterator` interface.

~~~js
function* makeStrider(interval) {
  let currentValue = 0;
  while (true) {
    currentValue += interval;
    yield currentValue;
  }
}

for (const value of makeStrider(2)) {
  console.log(value);
  if (value >= 10) {
    break;
  }
}
~~~

When `yield`ing a value, the generator will pause its execution and return the value to the caller as an `IteratorResult` object. When `next` is called on the generator, either directly or implicitly via `for-of`, it will resume executing. The [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) are a great resource if you'd like to find out more.

Before we move on to looking at handling asynchronous data, here's something I found interesting: the returned generator is both an iterator and an iterable.

~~~js
const strider = makeStrider(2);
strider === strider[Symbol.iterator]() // returns true - the iterator function returns "this"
~~~

### Let's make things async

The world's a messy place and unfortunately not everything is synchronous. Luckily for us, we can also create async iterators and generators.

If we adapt our previous example and add a 1 second delay before returning a result on each call to `next`, our homemade async iterator will look something like this:


~~~js
const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

const makeStrider = interval => ({
  [Symbol.asyncIterator]: () => {
    let currentValue = 0;
    return {
      next: async () => {
        await sleep();
        return {
          value: (currentValue += interval),
          done: false
        };
      }
    };
  }
});
~~~

While the format is largely the same, there are a couple of important differences:

- The property key is now `Symbol.asyncIterator` as opposed to `Symbol.iterator`
- The return type of `next` is now `Promise<IteratorResult>` rather than `IteratorResult`

To iterate over the async iterable, we need to swap our `for-of` statement out for `for-await-of`:

~~~js
for await (const value of makeStrider(2)) {
  console.log(value);
  if (value >= 10) {
    break;
  }
}
~~~

The async generator is also very similar to our sync generator:

~~~js
async function* makeStrider(interval) {
  let currentValue = 0;
  while (true) {
    await sleep();
    currentValue += interval;
    yield currentValue;
  }
}
~~~

That's a very brief introduction to iterators and generators. There are a number of [great](https://javascript.info/generators) [articles](https://jakearchibald.com/2017/async-iterators-and-generators/) that go into more detail should you wish to find out more.

## Comlink and async iterators

Using async iterators as a mechanism for cross-window communication was the motiviator behind investigating a tool called [Comlink](https://github.com/GoogleChromeLabs/comlink).

Sending and receiving data across different execution contexts (such as the main thread and a Web Worker) is typically achieved using [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage). This can be a little unwieldy as we have to come up with our own protocol for sending messages that both sides need to understand. Ideally, we'd be able to make calls to functions as if they were in the same execution context, something known as a [Remote Procedure Call](https://en.wikipedia.org/wiki/Remote_procedure_call).

### Introducing Comlink

Through the magic of JavaScript's [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), Comlink allows us to do just that.

Let's take a look at a bare-bones example where the sum of two values is calculated in a Web Worker:

~~~js
// worker.mjs
import { expose } from "./node_modules/comlink/dist/esm/comlink.mjs";

const sum = (a, b) =>  a + b;

const exports = { sum };

expose(exports);

// main.mjs
 
import { wrap } from "./node_modules/comlink/dist/esm/comlink.mjs";

const myWorker = wrap(
  new Worker("./worker.mjs", { type: "module" })
);

(async () => {
  const result = await myWorker.sum(100, 5);
  console.log(result); // Prints 105
})();
~~~

Note that we're using ES Modules and directly importing the ES module build of Comlink. This saves us having to complicate things by using any build tools.

In our main file running on the main thread, we use the `wrap` function to tell Comlink that it should create a `Proxy` for any values we want to call in our worker file. Any calls made on `myWorker` will be "trapped" by the proxy and converted to a value sent via `postMessage`.

On the worker-side, we use `expose` which instructs Comlink to attach an event listener to the worker. This will listen for any messages being sent from the main thread and act on them - in this case, it calls `sum` with the supplied arguments. Once evaluated, the result is post messaged back to the main thread.

Note that due to the async nature of having to wait for the message to be returned from the worker, we need to `await` the call to `sum` in the main thread.

### How about calling an async generator?

Comlink is able to send anything via `postMessage` that conforms to the [structured clone](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) algorithm. [This table](https://github.com/GoogleChromeLabs/comlink/blob/master/structured-clone-table.md) is a handy reference to determine how Comlink will cope with various values.

In the above example, as we're sending numeric values, `postMessage` is quite happy to accept them. However, let's try and create the async generator used earlier in this post.

~~~js
// worker.mjs
import { expose } from "./node_modules/comlink/dist/esm/comlink.mjs";

const sleep = () => new Promise((res) => setTimeout(res, 1000));

async function* makeStrider(interval) {
  let currentValue = 0;
  while (true) {
    await sleep();
    currentValue += interval;
    yield currentValue;
  }
}

const exports = {
  makeStrider
};

expose(exports);

// main.mjs
import { wrap } from "./node_modules/comlink/dist/esm/comlink.mjs";

const worker = wrap(new Worker("./worker.mjs", { type: "module" }));

(async () => {
  // Rather than printing to the console, show the strider value in an h1 element
  const counterEl = document.createElement("h1");
  document.body.appendChild(counterEl);
  for await (const value of await worker.makeStrider(2)) {
    counterEl.innerText = value;
    if (value >= 10) {
      break;
    }
  }
})();
~~~

If we try and run this, we'll see a big red error printed in the console: 

~~~js
comlink.mjs:117 Uncaught (in promise) DOMException: Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': [object AsyncGenerator] could not be cloned.
~~~

Unfortunately, the browser has no clue how to transform our generator such that we can call it from the main thread.

### Transfer Handlers

We can add a custom [`transferHandler`](https://github.com/GoogleChromeLabs/comlink#transfer-handlers-and-event-listeners) to teach Comlink how to handle our generator.

A transfer handler has three functions:

- `canHandle(object)`: Returns true if the transfer handler is capable of transferring the object
- `serialize(object)`: Determines how the object should be sent "across the wire" in such a way that it won't fall foul of `postMessage`'s limitations. In our case, this is transforming the generator in such a way that we can act on calls to `next` coming from the main thread.
- `deserialize(object)`: Takes the "wire value" and transforms it back to an appropriate value. In our case, this is being able to call functions like `next` on the generator and have them be sent back over the wire to the worker.

We can use these functions to build a minimally viable transfer handler for our async generator:

~~~js
// asyncIterableTransferHandler.mjs
import { transferHandlers } from "comlink";

const asyncIterableTransferHandler = {
  // We want to use this transfer handler for any objects that have an async iterator
  canHandle: obj => obj && obj[Symbol.asyncIterator],
  serialize: iterable => {
    // Create a message channel specifically for messages for this async iterator
    const { port1, port2 } = new MessageChannel();

    const iterator = iterable[Symbol.asyncIterator]();

    // Listen and forward calls onto the iterator
    port1.onmessage = async ({ data }) => {
      port1.postMessage(await iterator.next(data));
    }

    // Transfer the message channel to the caller's execution context
    return [port2, [port2]];
  },
  deserialize: async port => {
    // Convenience function to allow us to use async/await for messages coming down the port
    const nextPortMessage = () =>
      new Promise(resolve => {
        port.onmessage = ({ data }) => {
          resolve(data);
        };
      });

    // Construct our "proxy" iterator
    const iterator = {
      next: value => {
        // Inform the iterator that next has been called
        port.postMessage(value);
        // Return a promise that will resolve with the object returned by the iterator
        return nextPortMessage();
      }
    };

    // Make it iterable so it can be used in for-await-of statement
    iterator[Symbol.asyncIterator] = () => iterator;

    return iterator;
  }
};

// Make Comlink aware of the transfer handler by adding it to its transfer handler Map
transferHandlers.set("asyncIterable", asyncIterableTransferHandler);
~~~

A [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API/Using_channel_messaging) enables us to send messages between scripts running in different execution contexts. Unlike our generator, a message channel is transferrable via post message (this means a channel created in a worker can be transferred to the main thread). 

We use these channels to forward any calls onto the iterator running in the worker. The `IteratorResult` is then sent back over the message channel to the main thread.

A more fleshed-out transfer handler that adds support for the optional iterator methods and synchronous iterators can be found [here](https://github.com/samburnstone/comlink-async-iterators/blob/master/src/iterableTransferHandlers.js).

### Putting it all together

All that's left to do is import our transfer handler in **both** our files.

~~~js
import "./asyncIterableTransferHandler.mjs";
~~~

Now when we run our code, we should see the intervals output on the page, having been intially calculated in the background worker thread.

<img src="{{site.baseurl}}/sburnstone/assets/async-iterators-comlink/strider.gif" alt="Strider values being displayed on the webpage" />

## Conclusion

We've seen how iterators can provide a great way of consuming sequential data. Generators provide an abstraction on top of them to make creating iterators nice and simple. Separately, Comlink provides a mechanism whereby we can consume a module's exports as if it were in the same execution context. By writing our own transfer handler, we were able to combine the two and communicate with an iterator running in a Web Worker.

There's an issue on the Comlink repository which includes some discussion about [how to get the library to work with generators](https://github.com/GoogleChromeLabs/comlink/issues/435). A user has written a transfer handler that accomplishes something similar to the written for this blog post, but instead makes use of the built-in `proxy` transfer handler in order to avoid having to create a `MessageChannel`. It's also worth noting that the maintainer of the project has signalled interest in revisiting built-in support for generators.

If you'd like to see a number of examples, plus a more complete example of the transfer handler created in this blog post, please take a look at this [Github repository](https://github.com/samburnstone/comlink-async-iterators).