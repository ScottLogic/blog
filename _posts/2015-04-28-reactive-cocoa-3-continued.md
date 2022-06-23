---
title: ReactiveCocoa 3.0 - Signal Producers and API clarity
date: 2015-04-28 00:00:00 Z
categories:
- ceberhardt
- Tech
author: ceberhardt
layout: default_post
summary: My previous blog post took a first look at ReactiveCocoa 3.0 (RC3), where
  I described the new Signal interface, and the pipe forward operator. In this blog
  post I continue my exploration of the RC3 APIs and turn my attention to signal producers.
  I also discuss a few points around the overall clarity of the new ReactiveCocoa
  APIs.
---

My previous blog post [took a first look at ReactiveCocoa 3.0 (RC3)](http://blog.scottlogic.com/2015/04/24/first-look-reactive-cocoa-3.html), where I described the new `Signal` interface, and the pipe forward operator. In this blog post I continue my exploration of the RC3 APIs and turn my attention to signal producers. I also discuss a few points around the overall clarity of the new ReactiveCocoa APIs.

If you've used ReactiveCocoa before you might have come across the concept of hot and cold signals. The distinction between the two has been a source of confusion, partly because the two concepts are represented by the same type, `RACSignal`.

With RC3 the difference between these two concepts is made much more explicit by representing each with a different type (`Signal` and `SignalProducer`), and a subtle difference in operation naming (you observe a signal but start a signal producer). With RC3 the confusing terms 'hot' and 'cold' have disappeared completely.

## Signals

The easiest way to understand how `Signal` and `SignalProducer` compare is to give them a try.

In my previous blog post I created a simple signal that emits a next event each second:

{% highlight swift %}
func createSignal() -> Signal<String, NoError> {
  var count = 0
  return Signal {
    sink in
    NSTimer.schedule(repeatInterval: 1.0) { timer in
      sendNext(sink, "tick #\(count++)")
    }
    return nil
  }
}
{% endhighlight %}

By adding a couple of `println` statements it is possible to instrument when the signal is constructed and when events are sent:

{% highlight swift %}
func createSignal() -> Signal<String, NoError> {
  var count = 0
  return Signal {
    sink in
    println("Creating the timer signal")
    NSTimer.schedule(repeatInterval: 0.1) { timer in
      println("Emitting a next event")
      sendNext(sink, "tick #\(count++)")
    }
    return nil
  }
}
{% endhighlight %}

If you create an instance of this signal:

{% highlight swift %}
let signal = createSignal()
{% endhighlight %}

But don't actually add any observers, you'll find that it is created and emits events, despite the lack of observers.

{% highlight text %}
Creating the timer signal
Emitting a next event
Emitting a next event
Emitting a next event
...
{% endhighlight %}

## Signal Producers

Signal producers follow a very similar initialisation structure:

{% highlight swift %}
func createSignalProducer() -> SignalProducer<String, NoError> {
  var count = 0
  return SignalProducer {
    sink, disposable in
    println("Creating the timer signal producer")
    NSTimer.schedule(repeatInterval: 0.1) { timer in
      println("Emitting a next event")
      sendNext(sink, "tick #\(count++)")
    }
  }
}
{% endhighlight %}

The differences are pretty subtle, `SignalProducer` shares the same generic type parameters as `Signal`, one for the next event type, the other for the error type. It is also typically initialised via a closure expression, however this time rather than returning a disposable, the closure expression is supplied with a composite-disposable instance.

If you create a signal producer, but do not subscribe:

{% highlight swift %}
let signalProducer = createSignalProducer()
{% endhighlight %}

You'll find that nothing is logged to the console, the timer has not been started.

Signal producers are factories which create signals when they are started. In order to start the timer, you either invoke the `start` method defined on `SignalProducer` or as with the signal API, use the `start` free function via the pipe forward operator:

{% highlight swift %}
signalProducer
  |> start(next: {
    println($0)
  })
{% endhighlight %}

With the earlier signal example, if you add multiple observers, only a single timer created, whereas with the signal producer, each time you start it, a new timer is created.

Signal producers are used to represents operations or tasks, where the act of starting the signal producer initiates the operation. Whereas signals represents a stream of events which occur regardless of whether observers have been added or not. Signal producers are a good fit for network requests, whereas signals work well for streams of UI events.

## Signal Producer Operations

The operations that can be performed on signal producers are defined as curried free functions, in exactly the same way as they are for signals.

For example, here is the `on` operation, which injects side effects into a pipeline:

{% highlight swift %}
func on<T, E>(started: (() -> ())? = nil, ...)
             (producer: SignalProducer<T, E>) -> SignalProducer<T, E> {
  ...
}
{% endhighlight %}

(Some function arguments have been removed for readability)

The pipe forward operator is overloaded allowing it to be applied to signal producers:

{% highlight swift %}
public func |> <T, E, X>(producer: SignalProducer<T, E>,
                        transform: SignalProducer<T, E> -> X) -> X {
  return transform(producer)
}
{% endhighlight %}

And as a result, you can create pipelines of signal producer operations:

{% highlight swift %}
signalProducer
  |> on(started: {
    println("Signal has started")
  })
  |> start(next: {
    println("Next received: \($0)")
  })
{% endhighlight %}

With the timer signal producer this results in the following output:

{% highlight text %}
Signal has started
Creating the timer signal producer
Emitting a next event
Next received: tick #0
Emitting a next event
Next received: tick #1
...
{% endhighlight %}

## Applying Signal operations to Signal Producers

If you look at the operations that are defined for signal producers you'll soon realise that it is lacking some of the 'core' functions, e.g. map and filter.

Rather than duplicate signal operations, the `SignapProducer` exposes a `lift` method which will apply the given signal operation to any signal created when the producer starts.

Here it is in action:

{% highlight swift %}
let signalProducer = createSignalProducer()

let mapping: Signal<String, NoError> -> Signal<Int, NoError> = map({
  string in
  return count(string)
})

let mappedProducer = signalProducer.lift(mapping)

mappedProducer
  |> start(next: {
    println("Next received: \($0)")
  })
{% endhighlight %}

The above code uses the curried `map` function to create a mapping from one signal type to another, it is then 'lifted' onto the signal producer. As a result the code now logs the length of the string:

{% highlight text %}
Emitting a next event
Next received: 7
Emitting a next event
Next received: 7
Emitting a next event
{% endhighlight %}

Using Xcode you can confirm that the original signal producer of type `SignalProducer<String, NoError>` has become a producer of type `SignalProducer<Int, NoError>`:

<img src="{{ site.baseurl }}/ceberhardt/assets/rac3/producer.png" />

Which is pretty cool! Although it gets better ...

The pipe forward operator has another overload that allows you to apply signal operations to signals in a more direct fashion:

{% highlight swift %}
public func |> <T, E, U, F>(producer: SignalProducer<T, E>,
      transform: Signal<T, E> -> Signal<U, F>) -> SignalProducer<U, F> {
  return producer.lift(transform)
}
{% endhighlight %}

As a result, signal operations can now be used directly within the pipeline itself:

{% highlight swift %}
signalProducer
  |> on(started: {
    println("Signal has started")
  })
  |> map { count($0) }
  |> start(next: {
    println("Next received: \($0)")
  })
{% endhighlight %}

The above code shows how signal producer operations, in this case `on`, can be mixed freely with signal operations, e.g. `map`.

I am still a little unsure about the reasoning behind which operations are defined on signal and which are defined on signal producer. Looking at the current API the signal operations are mainly focussed on the 'next' event, allowing you to transform values, skip, delay, combine and observe on different threads. Whereas the signal producer API is mostly concerned with the signal lifecycle events (completed, error), with operations including then, flatMap, takeUntil and catch.

Currently this approach is restrictive, if I model a stream of events from a `UITextField` as a signal, I cannot apply a `flatMap` operation to it. I've [raised this as an issue](https://github.com/ReactiveCocoa/ReactiveCocoa/issues/1930)!

## API Clarity

The RC3 APIs contain some really clever concepts and are a great example of 'functional' Swift. I have personally learnt a lot from this library.

RC3 also has some very real functional benefits. The use of generics means that signals are now strongly typed, eliminating a whole class of runtime errors, and allowing for more concise code. Furthermore, the distinction between signal and signal producer is quite clear.

However, I can't help thinking that this API is just a bit too clever!

In my [previous talks on ReactiveCocoa](http://www.slideshare.net/colineberhardt/reactive-cocoa-made-simple-with-swift) I have always tried to present the subject in a clear and simple fashion, showing the audience that the core concepts are easy to grasp. I've had some great feedback from people in the audience, and have had a number of people approach me after the talk to say that they now 'get it'. I do wonder whether the new RC3 APIs might confuse those same people who have struggled to understand ReactiveCocoa in the past?

I'll be specific about the RC3 API features that cause some concern ...

The use of generics in RC3 is necessary, and highly beneficial. Furthermore, generics is a mainstream concept that is well understood. Thumbs up!

RC3 uses curried free functions for operations, I have a couple of issues with these. Firstly, curried functions are quite an advanced concept, they are not what you might call a mainstream technique. Secondly, free functions are less 'discoverable', Xcode auto-complete gives you no hint as to the types of operations that are available to you.

The pipe forward operator is also a pretty advanced concept, especially the overloaded usage that allows you to apply signal operations to signal producers. Critically, if you do not understand how this works, it is far from obvious how to apply a simple map operation to a signal producer.

ReactiveCocoa 3.0 is in beta and the APIs I have been using and describing are certainly not final. The team have done a great job with RC2 and have excelled themselves with RC3. Now is the time to provide them with feedback!

I've raised [my concerns about API clarity as an issue](https://github.com/ReactiveCocoa/ReactiveCocoa/issues/1941). One potential solution is to duplicate the free functions as methods directly on signal and signal producer (in much the same way as the swift collection operations), however, this does result in some unpleasant compromises.


## Conclusions

This concludes my second look at RC3, I'll probably write one final blog post on the subject where I look at building a more complete example.

If you've tried RC3 I'd be interested in hearing your experiences via the comments below.

Regards, Colin E.
