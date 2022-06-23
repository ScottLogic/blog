---
author: cprice
layout: default_post
title: 'ES6 Iterators, RxJS, IxJS and the Async Iterators proposal'
categories:
  - Tech
---

A quick walk through ES6 iterators and iterables. It covers extending [d3fc's](https://d3fc.io/) random data component to implement the required protocols and how this can lead to greater interoperability with utility libraries like RxJS/IxJS.

## The d3fc-random-data stochastic generator

d3fc contains a [component for generating random data series based on stochastic processes](https://github.com/d3fc/d3fc-random-data). We use this extensively when creating example charts in place of actual financial data streams which tend to be prohibitively expensive (and not work offline!).

It provides one interface for creating batches of data -

~~~js
import { financial } from 'd3fc-random-data';

const generator = financial()
    .startDate(new Date(2016, 0, 1))
    .startPrice(100);

console.log(generator(2));
// [
//   { date: 2016-01-01T00:00:00.000Z, /* ... */ }
//   { date: 2016-01-02T00:00:00.000Z, /* ... */ }
// ]
~~~

and another basic streaming interface for iterating over a sequence of values -

~~~js
import { financial } from 'd3fc-random-data';

const stream = financial()
    .startDate(new Date(2016, 0, 1))
    .startPrice(100)
    .stream();

console.log(stream.next());
// { date: 2016-01-01T00:00:00.000Z, /* ... */ }

console.log(stream.take(2));
// [
//   { date: 2016-01-02T00:00:00.000Z, /* ... */ }
//   { date: 2016-01-03T00:00:00.000Z, /* ... */ }
// ]

console.log(stream.until(d => d.date >= new Date(2016, 0, 5)));
// [
//   { date: 2016-01-04T00:00:00.000Z, /* ... */ }
// ]
~~~

This interface allows us to replicate retrieving an initial batch of data (`stream.take(n)`) and then providing a fake stream of updates (`setInterval(() => process(stream.next()), 1000)`) to the chart.

Now the core part of this library is running the stochastic processes to produce the data but in order to support the use case above we must also implement these additional methods. Wouldn't it be nice if we could just implement a common API for producing the data and let another library take care of the utility methods...

## The iterable & iterator protocols

Luckily ES6 introduced iterators to the language to provide just such an interface. It was added in the form of two new "protocols": iterable and iterator. An *iterable* being something that can be *iterated* over using an *iterator* -

~~~js
const iterable = [0, 1, 2];
const iterator = iterable[Symbol.iterator]();

console.log(iterator.next());
// { value: 0, done: false }
console.log(iterator.next());
// { value: 1, done: false }
console.log(iterator.next());
// { value: 2, done: false }
console.log(iterator.next());
// { value: undefined, done: true }
console.log(iterator.next());
// { value: undefined, done: true }
~~~

As you can see this has been retrofitted into the language's built in arrays but it's not only arrays which support this protocol, all of the language's iterable built-ins do (e.g. strings, objects, etc.). And of course you're free to implement it for your own custom objects -

~~~js
const iterable = {
  [Symbol.iterator]: () => {
    int count = 0;
    return {
      next: () => (count < 3 ? { value: count++, done: false } : { done: true })
    };
  }
};
const iterator = iterable[Symbol.iterator]();

console.log(iterator.next());
// { value: 0, done: false }
console.log(iterator.next());
// { value: 1, done: false }
console.log(iterator.next());
// { value: 2, done: false }
console.log(iterator.next());
// { done: true }
console.log(iterator.next());
// { done: true }
~~~

## Implementing the iterable/iterator protocols

A quick recap of the existing code -

~~~js
import { financial } from 'd3fc-random-data';

const generator = financial()
    .startDate(new Date(2016, 0, 1))
    .startPrice(100);
~~~

We're aiming to make the `generator` instance of our `financial` component iterable so we need to expose an accessor for the iterator -

~~~js
generator[Symbol.iterator] = () => {
    // return iterator;
};
~~~

Now the implementation of our iterator is relatively simple as we already had a very similar interface. The only additional property we need to return from the iterator's `next` method is a `done` value of `false` because the sequence is infinite  -

~~~js
generator[Symbol.iterator] = () => {
    const stream = generator.stream();
    return {
        next: () => ({
            value: stream.next(),
            done: false
        })
    };
};
~~~

We can test it like so (with some gratuitous use of [destructuring assignment](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) which uses [iterators under the hood](http://www.ecma-international.org/ecma-262/6.0/#sec-runtime-semantics-destructuringassignmentevaluation))-

~~~js
const [first] = generator;
console.log(first);
// { date: 2016-01-01T00:00:00.000Z, /* ... */ }
~~~

Or like so (using the [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) statement which again [uses iterators under the hood](http://www.ecma-international.org/ecma-262/6.0/#sec-runtime-semantics-forin-div-ofbodyevaluation-lhs-stmt-iterator-lhskind-labelset))-

~~~js
for (const item of generator) {
  console.log(item);
  // { date: 2016-01-01T00:00:00.000Z, /* ... */ }
  break;
}
~~~

N.B. the break statement. As we're creating an infinite sequence, if we didn't have it the loop would never terminate.

## Interoperability with utility libraries

At this point I wanted to round off the blog post with some exciting RxJS one-line wonders, combining the generator's new iterator with a custom scheduler and then poking, prodding, transforming, filtering, debouncing, manipulating, combining, delaying, sampling and otherwise fiddling with the resulting event streams. Unfortunately it appears the support for iterables in the latest (beta) version is [very broken](https://github.com/ReactiveX/rxjs/pull/1788).

Maybe this isn't such a huge surprise with RxJS being built around the concept of observables rather than iterables.

*Observables allow consumers to subscribe to notifications when a new item arrives (`next`), when no further items are expected (`complete`) and when something goes wrong (`error`). An observable is therefore push-based (consumers are informed when the next value is available), whilst an iterator is pull-based (consumers ask for the next value).*

In my description it was only by combining d3fc-random-data's iterator with some form of timer (scheduler) that it became an observable. It's a shame it seems so broken but I'm willing to bet that I'm the only person who's ever actually tried to do this, it is quite a niche edge case.

My research did lead me to an interesting looking project called [IxJS](https://github.com/ReactiveX/IxJS) which aims to provide a similar set of operators as RxJS but for iterables rather than observables. However, it too seems to be in the middle of a re-write or has possibly being abandoned...

## Async-iterators

Or maybe not... IxJS's description itself led me to this interesting TC39 proposal for [async-iteration](https://github.com/tc39/proposal-async-iteration). It would seem that there are efforts afoot to unify pull-based iterators and push-based observables as pull/push iterators.

Synchronous iterators would continue to work as described above and asynchronous iterators would be added under a new symbol (`Symbol.asyncIterator`). Instead of synchronously returning the iteration result (`{ value: x, done: true/false }`) this new form of iterator would return a promise which resolved to that value.

On the surface this is very similar to observables, allowing all of the same functionality. However, there's one fundamental difference: consumers must explicitly ask to be notified when the next value is available.

By asking to be notified of the next value, consumers are implicitly applying back-pressure to the system. Back-pressure allows a smart producer to dynamically throttle the rate at which they are producing data, to match the rate of consumption. In theory this allows for more CPU, memory or even battery efficient applications. More importantly though, because iterators would be front and center again, it would solve my problem!

## Conclusion

Not all blog posts end up where you expected, but hopefully you've picked up something useful along the way. I certainly did. Mostly around never trusting an API and always looking at the code behind it (once again!) but also a little about a possible future direction of JS. It also appears that interest in iterators is growing with a [push to encourage the use of iterators in libraries](https://github.com/leebyron/iterall#why-use-iterators).
