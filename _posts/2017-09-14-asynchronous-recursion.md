---
title: Asynchronous Recursion with Callbacks, Promises and Async.
date: 2017-09-14 00:00:00 Z
categories:
- ceberhardt
- Tech
tags:
- featured
author: ceberhardt
layout: default_post
summary: Creating asynchronous functions that are recursive can be a bit of a challenge.
  This blog post takes a look at various different approaches, including callbacks
  and promises, and ultimately demonstrates how async functions result in a much simpler
  and cleaner solution.
image: ceberhardt/assets/featured/spiral.jpg
colour: pink
header-shape: shape2
---

Creating asynchronous functions that are recursive can be a bit of a challenge. This blog post takes a look at various different approaches, including callbacks and promises, and ultimately demonstrates how async functions result in a much simpler and cleaner solution.

<img class="aligncenter" src="{{ site.baseurl }}/ceberhardt/assets/recursion/spiral.jpg"/>

## A simple example

Recently I was writing some code, for a [GitHub bot](http://blog.scottlogic.com/2017/07/16/clabot.html), which needed to obtain some data from a API endpoint that provided a paged output. My bot needed to obtain approximately 1000 records, which in this case required up to 10 asynchronous operations to obtain the full dataset. I explored various different approaches to this problem, which I'll outline in this blog post.

Rather than use an external API, for the purposes of this blog post I'll be using a contrived example that illustrates the same problem:

~~~javascript
const getSentenceFragment = (offset = 0) => {
  const pageSize = 3;
  const sentence = [...'hello world'];
  return {
    data: sentence.slice(offset, offset + pageSize),
    nextPage: offset +
        pageSize < sentence.length ? offset + pageSize : undefined
  }
};
~~~

This function returns the sentence "hello world" as an array of characters, three at a time. Retrieving the entire sentence requires four invocations:

~~~
> getSentenceFragment()
{ data: ['h', 'e', 'l'], nextPage: 3 }
> getSentenceFragment(3)
{ data: ['l', 'o', ' '], nextPage: 6 }
> getSentenceFragment(6)
{ data: ['w', 'o', 'r'], nextPage: 9 }
> getSentenceFragment(9)
{ data: ['l', 'd'], nextPage: undefined }
~~~

NOTE: The above code uses [default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters), [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) and the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator). I've been running these snippets within Chrome that has full support for these language features. For other execution environments, you might need to transpile.

All of the examples in this post look at the same simple problem; how to create a `getSentence` function that retrieves the entire sentence?

The next two sections cover a simple iterative and recursive approaches, without any asynchrony. If you're comfortable with recursion, you might want to skip these!

## An iterative approach

The following function uses an iterative approach to obtain the complete sentence.

~~~javascript
const getSentence = () => {
  let offset = 0,
    aggregateData = [];
  while (true) {
    const fragment = getSentenceFragment(offset);
    aggregateData = aggregateData.concat(fragment.data);
    if (fragment.nextPage) {
      offset = fragment.nextPage;
    } else {
      break;
    }
  }
  return aggregateData;
}
~~~

Here is it in action:

~~~
> getSentence()
["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]
~~~

There isn't really much to say about this approach, it repeatedly invokes the `getSentenceFragment` function, accumulating the result into the `aggregateData` variable. It also keeps track of the current offset. When the `fragment.nextPage` property is undefined, the loop exits and the function returns. Simple.

So how would a recursive approach look?

## Recursive approach

A recursive solution to this problem is much more concise:

~~~javascript
const getSentence = (offset = 0) => {
  const fragment = getSentenceFragment(offset);
  if (fragment.nextPage) {
    return fragment.data.concat(getSentence(fragment.nextPage));
  } else {
    return fragment.data;
  }
}
~~~

~~~
> getSentence()
["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]
~~~

This version of the code is structurally much simpler, without the need for any variables to maintain the current iteration state. With a recursive function, this same information is stored in the stack.

With the Chrome debugging tools, by breaking on the termination condition you can see four invocations of this function. You can also navigate up and down the stack to see the `fragment` and `offset` values that are within scope on each invocation:

<img class="aligncenter" src="{{ site.baseurl }}/ceberhardt/assets/recursion/recursive-stack.png"/>

When the termination condition is reached each function returns, unwinding the stack, to create the returned value at the original point of invocation.

Now let's have a look at what happens when we introduce some asynchrony.

## Asynchronous recursion with callbacks

The first approach we'll look at is a little old-fashioned, using callback functions. The first step is to change the `getSentenceFragment` function so that it returns its result asynchronously.

Using a simple `setTimeout`, we can update the `getSentenceFragment` as follows:

~~~javascript
const getSentenceFragment = (offset, callback) => {
  const pageSize = 3;
  const sentence = [...'hello world'];
  setTimeout(() => callback({
    data: sentence.slice(offset, offset + pageSize),
    nextPage: offset +
        pageSize < sentence.length ? offset + pageSize : undefined
  }), 500);
};
~~~

This function is invoked to request a sentence fragment, and supply a callback function, which is invoked at some point in the future with the result:

~~~
> getSentenceFragment(0, (data) => console.log(data)))
{ data: ['h', 'e', 'l'], nextPage: 3 }
~~~

NOTE: One unfortunate side-effect of the callback-based approach is that we cannot usefully supply a default value for the `offset` parameter.

How do we adapt this to create a function that collects together all of the fragments and returns the complete sentence? Let's assemble it piece-by-piece.

Firstly, the signature; rather than a synchronous return value, we need a callback:

~~~javascript
const getSentence = (offset, callback) => {
  ...
}
~~~

Next, we obtain a fragment, which is now returned via a callback

~~~javascript
const getSentence = (offset, callback) => {
  getSentenceFragment(offset, (fragment) => {
    ...
  });
}
~~~

Next up, is the conditional logic based on whether there are more pages. Let's take the simpler path first, where recursion terminates.

The synchronous version of this code simply returns the fragment. The asynchronous version does the same via the callback

~~~javascript
const getSentence = (offset, callback) => {
  getSentenceFragment(offset, (fragment) => {
    if (fragment.nextPage) {
      ...
    } else {
      callback(fragment.data)
    }
  });
}
~~~

And now for the other branch, where there is another page to fetch, which is where the function is invoked recursively. Here we invoke `getSentence`, however, it returns asynchronously, so we need another callback, where the concatenation takes place..

~~~javascript
const getSentence = (offset, callback) => {
  getSentenceFragment(offset, (fragment) => {
    if (fragment.nextPage) {
      // recursively call getSentence
      getSentence(fragment.nextPage, (nextFragment) => {
        callback(fragment.data.concat(nextFragment))
      })
    } else {
      callback(fragment.data)
    }
  });
}
~~~

When invoked, it returns the expected output (after a few seconds):

~~~
> getSentence(0, (sentence) => console.log(sentence));
["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]
~~~

Now with the synchronous version of the recursive code, you could see the recursive invocations within the call stack (by placing a breakpoint at the termination condition). With the asynchronous version you can actually do the same:

<img class="aligncenter" src="{{ site.baseurl }}/ceberhardt/assets/recursion/async-recursize-stack.png"/>

Although you cannot view the scope of previous invocations (which would require a form of time-travel!).

The recursive version of the `getSentence` function that uses callbacks is not very easy to follow, with the nested callback introducing more functions and scopes.

Let's see how a promise-based implementation compares ...

## Asynchronous recursion with promises

Once again, the first step is to update the `getSentenceFragment` function:

~~~javascript
const getSentenceFragment = (offset = 0) => new Promise((resolve, reject) => {
  const pageSize = 3;
  const sentence = [...'hello world'];
  setTimeout(() => resolve({
    data: sentence.slice(offset, offset + pageSize),
    nextPage: offset + pageSize < sentence.length ? offset + pageSize : undefined
  }), 500);
});
~~~

The returned Promise object represents a task or operation that completes (or fails) asynchronously. You can see this object being returned when you invoke this function:

~~~
> getSentenceFragment()
    .then((fragment) => console.log(fragment));
  Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
  { data: ['h', 'e', 'l'], nextPage: 3 }
~~~

NOTE: We now have our default parameter value again!

So let's once again build-up the `getSentence` function step-by-step. The first step is to invoke the `getSentenceFragment` function and obtain a fragment:

~~~javascript
const getSentence = (offset = 0) =>
  getSentenceFragment(offset)
    .then(fragment => {
      ...
    });
~~~

Because we are using promises, the result of `getSentenceFragment` is available via the `then` fulfilment handler.

One interesting aspect of promises is that you can chain them. The result returned by a `then` handler is a new Promise. Here's a quick example:

~~~
> getSentenceFragment()
    .then((fragment) => fragment.data)
    .then((letters) => console.log(letters));
  Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
  ['h', 'e', 'l']
~~~

If a non promise value is returned by a `then` handler, it is converted to a promise, as per `Promise.resolve(value)`.

Getting back to our `getSentence` implementation, the `getSentenceFragment` invocation returns a value to its `then` handler. The value returned by this function is itself a promise that is the return value of `getSentence`. The value returned is denoted by `...`, so let's fill them in.

Adding both the termination condition and the recursive step in one go ...

~~~javascript
const getSentence = (offset = 0) =>
  getSentenceFragment(offset)
    .then(fragment => {
      if (fragment.nextPage) {
        return getSentence(fragment.nextPage)
            .then(nextFragment => fragment.data.concat(nextFragment))
      } else {
        return fragment.data;
      }
    });
~~~

And running the complete example:

~~~
> getSentence((sentence) => console.log(sentence));
["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]
~~~

Much the same as with the callback implementation, you can breakpoint the termination condition and see the async call stack.

Comparing the promise version of this function to the callback implementation, the code is a little cleaner and easier to follow. However, it is still a lot more complex than its synchronous counterpart.

## Asynchronous recursion with async / await

The purpose of async functions is to simplify the use of promises. As you've seen in the previous example, moving a very simple function from synchronous to asynchronous has a significant effect on code complexity, and with our recursive example, both callbacks and promises are quite messy.

Before diving into the recursive function, let's take a look at converting the `getSentenceFragment` into an async function ...

Let's return to the original synchronous version:

~~~javascript
const getSentenceFragment = (offset = 0) => {
  const pageSize = 3;
  const sentenceCharArray = [...'hello world'];
  return {
    data: sentenceCharArray.slice(offset, offset + pageSize),
    nextPage: offset + pageSize < sentenceCharArray.length ? offset + pageSize : undefined
  }
};
~~~

With both the callback and promise versions of this function much more 'structure' was required, yet all we really want is tell our function to 'wait a bit' before it returns.

Let's create a wait function ... a promise that resolves after a number of milliseconds:

~~~javascript
const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));
~~~

Changing the signature of `getSentenceFragment` to becomes an async function allows us to do just that:

~~~javascript
const getSentenceFragment = async function(offset = 0) {
  const pageSize = 3;
  const sentence = [...'hello world'];

  await wait(500);

  return {
    data: sentence.slice(offset, offset + 3),
    nextPage: offset + 3 < sentence.length ? offset + 3 : undefined
  };
};
~~~

The `getSentenceFragment` async function pauses execution when it meets an await, waiting for the resolution of the returned promise, then resumes execution. Simple and elegant. This function now looks almost exactly the same as its synchronous counterpart.

Because async function return promises, the above code can be used with the promise version of our `getSentence` function.

Let's look at the async equivalent of `getSentence`. Once again, we'll return to the original synchronous version:

~~~javascript
const getSentence = (offset = 0) => {
  const fragment = getSentenceFragment(offset);
  if (fragment.nextPage) {
    return fragment.data.concat(getSentence(fragment.nextPage));
  } else {
    return fragment.data;
  }
}
~~~

The `getSentenceFragment` function and recursive call to `getSentence` are now asynchronous, so require the `await` keyword. And that's it!

~~~javascript
const getSentence = async function(offset = 0) {
  const fragment = await getSentenceFragment(offset)
  if (fragment.nextPage) {
    return fragment.data.concat(await getSentence(fragment.nextPage));
  } else {
    return fragment.data;
  }
}
~~~

Note, you may only use await within an async function, so in order to invoke this function, you still need to use promises:

~~~javascript
getSentence()
  .then((sentence) => console.log(sentence));
~~~  

That really was simple!

## Conclusions

Let's quickly review the four different implementations:

Synchronous ...

~~~javascript
const getSentence = (offset = 0) => {
  const fragment = getSentenceFragment(offset);
  if (fragment.nextPage) {
    return fragment.data.concat(getSentence(fragment.nextPage));
  } else {
    return fragment.data;
  }
}
~~~

Asynchronous with callbacks ...

~~~javascript
const getSentence = (offset, callback) => {
  getSentenceFragment(offset, (fragment) => {
    if (fragment.nextPage) {
      getSentence(fragment.nextPage, (nextFragment) => {
        callback(fragment.data.concat(nextFragment))
      })
    } else {
      callback(fragment.data)
    }
  });
}
~~~

Asynchronous with promises ...

~~~javascript
const getSentence = (offset = 0) =>
  getSentenceFragment(offset)
    .then(fragment => {
      if (fragment.nextPage) {
        return getSentence(fragment.nextPage)
            .then(nextFragment => fragment.data.concat(nextFragment))
      } else {
        return fragment.data;
      }
    });
~~~

Asynchronous with async ...

~~~javascript
const getSentence = async function(offset = 0) {
  const fragment = await getSentenceFragment(offset)
  if (fragment.nextPage) {
    return fragment.data.concat(await getSentence(fragment.nextPage));
  } else {
    return fragment.data;
  }
}
~~~

I really like how this has come full-circle, with the async version looking almost exactly the same, and being just as understandable, as the original synchronous version.

I'll definitely be making much more use of async functions. I am sure they will also help resolve a number of other common issues with promises that I have [written about in the past](http://blog.scottlogic.com/2016/06/10/six-tips-for-cleaner-promises.html), but that's a topic for another day.

Regards, Colin E.
