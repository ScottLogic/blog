---
author: ceberhardt
title: Implementing Events in Swift
layout: default_post
summary: >-
  Swift does not have a built in eventing mechanism. This post explores a few
  different ways events can be implemented in Swift and how to avoid problems of
  retain cycles and closure reference equality.
oldlink: 'http://www.scottlogic.com/blog/2015/02/05/swift-events.html'
disqus-id: /2015/02/05/swift-events.html
categories:
  - Tech
---

I initially started writing a blog post that discussed various alternatives to Key-Value-Observing (KVO) in Swift, however, I found myself writing more about the task of implementing events in Swift. So, I've decided to split the problem in two, in this post I'll cover events, and I'll follow-up with the KVO post later on.

I'm certainly not the first to blog about this topic, Mike Ash published a [great article on Swift implementation of NSNotification just last week](https://mikeash.com/pyblog/friday-qa-2015-01-23-lets-build-swift-notifications.html). However, in this post I'd like to approach the problem in a slightly different way, starting with a naïve implementation.

Let's start at the beginning ...

## What are Events?

Cocoa has a number of techniques that allow classes to collaborate in a loosed-coupled fashion via some form of notification, including target-action, the delegate pattern, NSNotification and KVO. These are all forms of the classic [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern), yet all are different implementations, and each have their own failings. KVO is cumbersome, the delegate pattern only permits a single observer ... However this post isn't a rant about Cocoa, so enough of that ;-)

Events provide a generic mechanism for raising notifications that can be handled by multiple observers. C# developers have the luxury of [first-class language support for events](https://msdn.microsoft.com/en-us/library/awbftdfh.aspx), however in most other mainstream languages this is something that is either provided at a library level or that you have to implement yourself.

## A Naïve Event Implementation

Constructing a simple eventing mechanism is pretty straightforward in Swift, here's my naïve implementation:

{% highlight csharp %}
class Event<T> {

  typealias EventHandler = T -> ()

  private var eventHandlers = [EventHandler]()

  func addHandler(handler: EventHandler) {
    eventHandlers.append(handler)
  }

  func raise(data: T) {
    for handler in eventHandlers {
      handler(data)
    }
  }
}
{% endhighlight %}

The `Event` class has a generic parameter `T` which defines the type of data  that this event conveys and the `EventHandler` typealias declares a function that accepts this type. The rest of this class is pretty straightforward, handlers are added to an array, with each being invoked when the event is raised.

The simple eventing code above supports multiple subscribers or handlers, as illustrated below:

{% highlight csharp %}
let event = Event<Void>()
event.addHandler { println("Hello") }
event.addHandler { println("World") }
event.raise()
{% endhighlight %}


In the above, both handlers are invoked when the event is raised. Notice the use of `Void` for the event type, which allows us to invoke the `raise` method without any arguments.

You can pass multiple parameters to event handlers via tuples:

{% highlight csharp %}
let event = Event<(String, String)>()
event.addHandler { a, b in println("Hello \(a), \(b)") }
let data = ("Colin", "Eberhardt")
event.raise(data)   
{% endhighlight %}

And as Mike Ash highlighted (which was news to me), Swift treats a function with multiple parameters just the same as one with a single tuple parameter. As a result, you do not need to construct a tuple in order to raise an event  with two string parameters:

{% highlight csharp %}
let event = Event<(String, String)>()
event.addHandler { a, b in println("Hello \(a), \(b)") }
event.raise("Colin", "Eberhardt") // <- pretty cool!
{% endhighlight %}

(Thanks Mike!)

This eventing mechanism is strongly typed, supports generics, works well with closure expressions, what more could you want?

Actually, there are a couple of issues with the above code, firstly the use of closure expressions for event handlers is a risky business. Any closure that uses `self` will cause a retain cycle and result in a memory leak. As [Lammert Westerhoff points out](http://blog.xebia.com/2014/10/09/function-references-in-swift-and-retain-cycles/), all you need is a single class instance and a closure with a captured reference to self to cause a memory leak.

Whilst this problem is easily remedied using a capture list `[unowned self]`, it is all too easy to forget.

The second issue is much more fundamental, the above event implementation allows you to add handlers but doesn't allow you to remove them. You might be tempted to add a `removeHandler` implementation as follows:

{% highlight csharp %}
func removeHandler(handler: EventHandler) {
  eventHandlers = eventHandlers.filter { $0 !== handler }
}
{% endhighlight %}

However, this will not compile. Whilst closures are reference types, the Swift identity operators (`===` and `!==`) are defined for `AnyObject` - and closures do not conform to this protocol!

As a result, there is no way to determine whether two closures are the same. Go ahead and try this out in a Playground:

{% highlight csharp %}
var foo:() -> () = { println("hi") }
var bar = foo

foo() // "hi"
bar() // "hi"

let equal = foo === bar // error: type '() -> ()' does
                        // not conform to protocol 'AnyObject'
{% endhighlight %}

It's a real shame that this doesn't work, I really liked the idea of adding a bit of C# style syntactic sugar for adding handlers:

{% highlight csharp %}
public func += <T> (left: Event<T>, right: T -> ()) {
  left.addHandler(right)
}
{% endhighlight %}

Which would allow you to add handlers as follows:

{% highlight csharp %}
event += { println("Hello") }
{% endhighlight %}

Anyhow, this isn't going to work :-(

## A Complete Event Implementation

OK, so there are quite a few issues with the simple implementation, time to put things right.

Diving into the implementation of `Event`, the updated version is shown below:

{% highlight csharp %}
public class Event<T> {

  public typealias EventHandler = T -> ()

  private var eventHandlers = [Invocable]()

  public func raise(data: T) {
  for handler in self.eventHandlers {
    handler.invoke(data)
    }
  }

  public func addHandler<U: AnyObject>(target: U,
            handler: (U) -> EventHandler) -> Disposable {
    let wrapper = EventHandlerWrapper(target: target,
                         handler: handler, event: self)
    eventHandlers.append(wrapper)
    return wrapper
  }
}

private protocol Invocable: class {
  func invoke(data: Any)
}
{% endhighlight %}

The concept is pretty similar to the earlier implementation, with the event class containing an array of handlers, however, this time they are instances of `EventHandlerWrapper` that implement an `Invocable` protocol.

The real magic happens in `addHandler`, which makes use of the fact that instance methods are curried functions. For an excellent overview of what this means, I'd refer you to [Ole Begemann's blog](http://oleb.net/blog/2014/07/swift-instance-methods-curried-functions/).

Before looking at the implementation details, it's worth taking a quick look at how you would use this event in practice:

{% highlight csharp %}
func someFunction() {

  // create an event
  let event = Event<(String, String)>()

  // add a handler
  let handler = event.addHandler(self, ViewController.handleEvent)

  // raise the event
  event.raise("Colin", "Eberhardt")

  // remove the handler
  handler.dispose()
}

func handleEvent(data: (String, String)) {
  println("Hello \(data.0), \(data.1)")
}
{% endhighlight %}

This addresses the two issues outlined above, firstly the handler is supplied as a reference to a type (in this case `self`) and a method defined on that type, you'll see shortly that this results in a weak reference to `self`, removing the retain cycle issues. Secondly, when a handler is added, it can later be disposed in order to remove the subscription.

So how are the two points above achieved?

The event's `addHandler` method constructs an instance of an `EventHandlerWrapper`, which is shown below:

{% highlight csharp %}
private class EventHandlerWrapper<T: AnyObject, U>
                                  : Invocable, Disposable {
  weak var target: T?
  let handler: T -> U -> ()
  let event: Event<U>

  init(target: T?, handler: T -> U -> (), event: Event<U>) {
    self.target = target
    self.handler = handler
    self.event = event;
  }

  func invoke(data: Any) -> () {
    if let t = target {
      handler(t)(data as U)
    }
  }

  func dispose() {
    event.eventHandlers =
       event.eventHandlers.filter { $0 !== self }
  }
}

public protocol Disposable {
  func dispose()
}
{% endhighlight %}

The above class maintains a weak reference to the target, avoiding potential retain cycles. The `invoke` method invokes (partially applies) the curried type method to create the required instance method, then invokes the resultant method with the event data (again, if this sounds like gibberish, go read Ole's blog post!).

Finally, the `dispose` method simply removes itself from the array of `EventHandlerWrapper` instances ensuring that the handler it wraps is no longer invoked.

## Conclusions

And there you have it, a Swift event class that is strongly typed, generic, doesn't create retain cycles, all good stuff!

In my next blog post I'll look at how this class can be used to explore various KVO alternatives.

Regards, Colin E.
