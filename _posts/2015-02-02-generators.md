---
title: JavaScript ES6 generators
date: 2015-02-02 00:00:00 Z
categories:
- Tech
author: jbandenburg
summary: The upcoming JavaScript standard ES6 introduces generators, which provides us with a new pattern for writing asynchronous code. I compare this pattern to the established patterns of callbacks and Promises.
layout: default_post
oldlink: http://www.scottlogic.com/blog/2015/02/02/generators.html
disqus-id: "/2015/02/02/generators.html"
---

JavaScript is mostly single-threaded, code cannot be executed while any other operation is currently executing. This has
lead to the JavaScript community shunning long, blocking operations and moving to asynchronous APIs. Asynchronous
operations are non-blocking and signal their completion via some other channel. New libraries and APIs are increasingly
asynchronous and hence developers are increasingly required to deal with asynchronous code.

In this post I explore the patterns available for working with asynchronous code in a manageable way.

Let’s start by looking at a simple, synchronous API and some code that uses it.

{% highlight javascript %}
SessionFactory.createSession()
Session.getEncoding()
MessageEncoder.encode(message, session, encoding)
DataStore.storeMessage(message, session, encoding)
{% endhighlight %}

{% highlight javascript %}
var session = sessionFactory.createSession();
var encoding = session.getEncoding();
var message = messageEncoder.encode("Hello world!", session, encoding);
dataStore.storeMessage(message, session, encoding);
{% endhighlight %}

Hopefully, you find the above code easy to follow. If we make the API asynchronous, we’ll need to update the code.
Ideally, we’d like to avoid drastically changing the structure or risk obfuscating the algorithm.

## Callbacks ##
The naive approach is to use callbacks. Each asynchronous function takes an additional argument, a callback, which it
will call with the result of the operation.

##### Synchronous version
{% highlight javascript %}
var result = syncFunction("input");
{% endhighlight %}

##### Asynchronous version
{% highlight javascript %}
asyncFunction("input", function(result) {
	console.log(result);
});
{% endhighlight %}

Callbacks are straightforward and work well for simple cases. They work in all versions of JavaScript and are using
extensively by Node.js’s standard library.

How does our code example look with callbacks?

{% highlight javascript %}
sessionFactory.createSession(function(session) {
    session.getEncoding(function(encoding) {
        messageEncoder.encode("Hello world!", session, encoding, function(message) {
            dataStore.storeMessage(message, session, encoding);
        });
    });
});
{% endhighlight %}

Unfortunately, as you can see above, callbacks don’t scale well to higher levels of complexity. This anti-pattern of
nesting is known as the "Pyramid of Doom".

## Promises ##
Instead of passing a callback to each method, the methods can instead return
[Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise), which are objects
that allows us to register one or more callbacks using the <code>Promise.then</code> method. <code>Promise.then</code>
returns another Promise, which allows us to chain multiple Promises together rather than nesting them.

{% highlight javascript %}
asyncFunction("input").then(function(result) {
    return asyncFunction2(result); // Returns another Promise
}).then(function(result2) {
    console.log(result2);
});
{% endhighlight %}

Promises are an excellent addition to JavaScript. They’re supported natively in ES6 and, as they don’t require any
additional syntax, can be easily [polyfilled](https://github.com/jakearchibald/es6-promise). I recommend using Promises
over callbacks for anything but the most trivial cases.

How does our code example look with Promises?

{% highlight javascript %}
sessionFactory.createSession().then(function(session) {
    return session.getEncoding().then(function(encoding) {
        return messageEncoder.encode("Hello world!", session, encoding).then(function(message) {
            return dataStore.storeMessage(message, session, encoding);
        });
    });
});
{% endhighlight %}

That isn’t much of an improvement over the version that uses callbacks. What’s going on here? It turns out that Promises
don’t completely solve the "Pyramid of Doom". In our code example, the results of earlier asynchronous calls need to be
combined at the end, forcing us to nest the callbacks to capture the earlier results in the closure. This prevents us
from benefiting from the best feature of Promises - the chaining.

## Generators ##
[Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) are another
exciting feature coming in ES6. They’re already [supported](http://kangax.github.io/compat-table/es6/#generators)
in the latest version of Firefox, Chrome and Opera and in Node.js when running with a flag. Generators are functions
that can stop and resume their execution. This is done with the new <code>yield</code> keyword. If you’d like to know
more about generators check out these [excellent](http://davidwalsh.name/es6-generators)
[descriptions](http://tobyho.com/2013/06/16/what-are-generators/).

Combining Generators with a bit of library magic gives us a way of writing code that is very close to the synchronous
code. Using <code>yield</code> we can make the code wait for a Promise to be fulfilled and continue once the result is
available. It’s as if the rest of the code in the function is wrapped up in the fulfilled-handler for that Promise.

The library magic required can be very [simple](https://gist.github.com/jakearchibald/31b89cba627924972ad6). However, as
an alternative you may wish to use one of the [many](https://github.com/petkaantonov/bluebird)
[libraries](https://github.com/tj/co) as they support more features, such as yielding on an array of Promises to await
all the Promises to be fulfilled. We’ll use [task.js](http://taskjs.org/) here.

{% highlight javascript %}
spawn(function*() {
    var session = yield sessionFactory.createSession();
    var encoding = yield session.getEncoding();
    var message = yield messageEncoder.encode("Hello world!", session, encoding);
    yield dataStore.storeMessage(message, session, encoding);
});
{% endhighlight %}

This is a huge improvement over the other versions. Gone is the additional control flow and nesting. The boilerplate has
been reduced to the <code>yield</code> keyword.

The wrapped function will return a Promise. This makes it easy to compose generators and mix them with existing code
that returns or expects Promises. When trying this pattern out I was surprised by how easily it integrated into my
existing codebase.

Unfortunately, it’s not possible to polyfill generators as they introduce new syntax. If you need to support older
JavaScript environments, then you can use one of [the](http://6to5.org/)
[excellent](http://facebook.github.io/regenerator/) [transpilers](https://github.com/google/traceur-compiler). These
tools take the ES6 code and compile it to ES5-compatible JavaScript. Huzzah!

## Async/await ##
Looking even further into the future, ES7 includes [a proposal](https://github.com/lukehoban/ecmascript-asyncawait) for
adding two keywords: async and await. Developers with experience of C# will immediately recognise the syntax.

{% highlight javascript %}
async function() {
    var session = await sessionFactory.createSession();
    var encoding = await session.getEncoding();
    var message = await messageEncoder.encode("Hello world!", session, encoding);
    await dataStore.storeMessage(message, session, encoding);
};
{% endhighlight %}

This version is similar to the generators version, but the intent of code is arguably more clear.

[Traceur](https://github.com/google/traceur-compiler) supports this proposed feature, so if you’re going to transpile
the code anyway you may consider using this syntax. Be warned that tools like jshint
[don’t yet support the syntax](https://github.com/jshint/jshint/issues/1939).

## Conclusion ##
Dealing with asynchronous code in JavaScript can be a challenge and the single-threaded nature of the language makes
this type of code very common. Thankfully, JavaScript is evolving to help developers solve this challenge. Generators
offer a good layer above Promises for writing clean, synchronous-like code. Native support for them has already arrived
or is arriving soon and transpilers make it easy to support older environments.























