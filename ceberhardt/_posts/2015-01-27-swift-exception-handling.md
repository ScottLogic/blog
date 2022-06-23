---
author: ceberhardt
title: Exception Handling in Swift
layout: default_post
oldlink: 'http://www.scottlogic.com/blog/2015/01/27/swift-exception-handling.html'
disqus-id: /2015/01/27/swift-exception-handling.html
categories:
  - Tech
---

Swift doesn't support throwing exceptions, nor does it support catching them. This wouldn't be a problem if you could develop iOS apps in pure Swift, but unfortunately at the moment you cannot. When developing an app most of the APIs you'll be working with are Objective-C APIs that have been bridged to Swift. These APIs can, and do throw exceptions. So how do you catch them?

In this blog post I'll take a look at how you *can* handle exceptions that are thrown by Objective-C APIs.

I'll also explain why I think Swift should support exceptions 'natively':

> I believe that exceptions would allow us to write simpler, more readable code with fewer branches, whilst maintaining all the security that optionals currently offer.

But more of that later ... first we'll look at how to handle the more immediate issue of exceptions thrown by Objective-C APIs.


## The Problem - KVO

I am currently working on a project that makes use of key-value-observing, where observers are used to execute logic when various object properties change. In order to use KVO with Swift types, you must subclass `NSObject` and declare any properties you wish to observe as `dynamic`:

{% highlight csharp %}
class Person: NSObject {
  dynamic var name = "Bob"
}
{% endhighlight %}

*On a side note, a few people have proposed a pure Swift alternative to KVO, where properties are wrapped in objects that allow subscription (e.g. [Observable-Swift](https://github.com/slazyk/Observable-Swift) and [ReactiveCocoa 3.0](https://github.com/ReactiveCocoa/ReactiveCocoa/blob/677f713b4966f2dfc392fadfd65fa9243d30abc7/ReactiveCocoa/Swift/ObservableProperty.swift)), however I find this technique to be rather cumbersome. It also doesn't allow for truly dynamic observing, where the property being observed isn't know until runtime.*

Anyhow, back to the problem at hand - with an `NSObject` subclass you can add an observer as follows:

{% highlight csharp %}
var person = Person()
person.addObserver(self, forKeyPath: "name", options:nil, context:nil)
{% endhighlight %}

However, this method throws an `NSUnknownKeyException` exception if the given key is not valid for the object being observed.

Various other KVC API methods throw exceptions also, for example `removeObserver` helpfully throws `NSRangeException` if you try to remove an object that isn't actually a current observer; `valueForKeyPath` and `setValue(_:forKey:)` can also throw exceptions.

So if you want to avoid the possibility of your application blowing up at runtime, what do you do?

This had me scratching my head for a while, until thankfully a colleague of mine, [Nicholas Wolverson](http://www.scottlogic.com/blog/nwolverson/), pointed out the seemingly obvious - you catch the exception with Objective-C!

## Catching Exceptions in Swift

The simple solution to the problem is to create a small Objective-C 'shim' that catches any exceptions that might be thrown, returning them via the method signature directly.

Here's a category that adds a `tryAddObserver` method to `NSObject`:

    @interface NSObject (KVOHelper)

    - (NSString *)tryAddObserver:(NSObject *)anObserver
                      forKeyPath:(NSString *)keyPath
                   options:(NSKeyValueObservingOptions)options
                   context:(void *)context;

    @end

Which is implemented as follows:

    @implementation NSObject (KVOHelper)

    - (NSString *)tryAddObserver:(NSObject *)anObserver
                      forKeyPath:(NSString *)keyPath
                   options:(NSKeyValueObservingOptions)options
                   context:(void *)context {
      NSString *result;
      @try {
        [self addObserver:anObserver forKeyPath:keyPath
                  options:options context:context];
      }
      @catch (NSException *exception) {
        result = exception.name;
      }
      return result;
    }

    @end

Any exception that is thrown when trying to add an observer, is now caught, with the method returning the exception name.

When bridged to Swift this results in the following method being added to `NSObject`:

{% highlight csharp %}
extension NSObject {
  func tryAddObserver(anObserver: NSObject!,
   forKeyPath keyPath: String!,
              options: NSKeyValueObservingOptions,
              context: UnsafeMutablePointer<Void>) -> NSString!
}
{% endhighlight %}

That can be used as follows:

{% highlight csharp %}
var person = Person()
let failure = person.tryAddObserver(self, forKeyPath: "name",
               options: NSKeyValueObservingOptions.New, context: nil)

if let failure = failure {
  println("Unable to add observer")
}
{% endhighlight %}

This is a nice simple solution, which can also be rolled out to `removeObserver`, and `setValue(_:forKey:)`, changing each method from having a void return type to returning any error that might have occurred.

## The messy bits ...

Unfortunately things get a bit messier with `valueForKeyPath`; this method
already returns a value, so in order to add exception reporting it would either have to be adapted to include an in-out parameter (yuck), or multiple returns values.

Opting for the later, the following type holds either the return value, or the exception that was thrown:

    @interface ValueWrapper: NSObject

    @property id propertyValue;
    @property NSString *exception;

    @end

Which can be used to build a shim for `getValueForKeyPath`:

    - (AVValueWrapper *)tryGetValueForKeyPath:(NSString *)keyPath {
      AVValueWrapper *result = [AVValueWrapper new];
      @try {
        result.propertyValue = [self valueForKeyPath: keyPath];
      }
      @catch (NSException *exception) {
        result.exception = exception.name;
      }
      return result;
    }

Whilst this solves the problem, it results in a pretty nasty method signature! Multiple returns values are widely considered a 'code smell'

Fortunately Swift enums types, with their associated values, are an excellent way to represent multiple return values.

Renaming the above method to `_tryGetValueForKeyPath` (which of course means other developers can't see it :-P), allows the bridges method to be further adapted as follows:

{% highlight csharp %}
public enum Result {
  case Success(AnyObject)
  case Failure(String)
}

extension NSObject {
  public func tryGetValueForKeyPath(keyPath: String) -> Result {
    let result = self._tryGetValueForKeyPath(keyPath)
    if let exception = result.exception {
      return .Failure(exception)
    } else {
      return .Success(result.propertyValue)
    }
  }
}
{% endhighlight %}

The enum that is returned clearly encodes the success and failure scenarios,  and is used as follows:

{% highlight csharp %}
let result =  source.tryGetValueForKeyPath(binding.sourceProperty)
switch result {
case .Failure(let exception):
  println("Epic fail, due to exception \(exception)")
case .Success(let propertyValue):
  // do something with the value here
}
{% endhighlight %}

Using the basic concepts outlined above it should be possible to create a shim that adapts any Objective-C API that throws exceptions.

The above techniques worked just fine for me, and allowed me to get on with my current pet project (which is pretty cool, more on that another time!). However, this all feels like an unnecessary and cumbersome workaround.

Which brings me onto the final part of this blog post ...


## Swift Needs Exceptions!

Most modern languages support exceptions - the lack of support in Swift does seem to make it be something of an exception (ba-dum-tish). However, despite the fact Objective-C fully supports exceptions, they are often frowned upon.

As an example, the Google Objective-C style guide simply states "[Don't throw exceptions](https://google.github.io/styleguide/objcguide.xml#Avoid_Throwing_Exceptions)".

However, I personally feel that Swift would benefit from the introduction of exceptions. To see why, we'll return back the everyone's favourite topic - optionals!

This is the all-to-familiar problem of optional variables - if you have an algorithm that depends on a number of optionals, each must be explicitly unwrapped:

{% highlight csharp %}
var a: String? = "one"
var b: String? = "two"
var c: String? = "three"

if let a = a {
  if let b = b {
    if let c = c {
      println("\(a) - \(b) - \(c)")
    }
  }
}
{% endhighlight %}

*Note the shadowing of each optional as per the [Ray Wenderlich Swift Style Guide](https://github.com/raywenderlich/swift-style-guide#optionals).*

Although if you're feeling reckless you can use forced unwrapping, but this will result in a non-recoverable runtime error should any of the optionals be nil:

{% highlight csharp %}
println("\(a!) - \(b!) - \(c!)")
{% endhighlight %}

Things get even worse if you want to execute some logic if any of the values are nil ...

{% highlight csharp %}
if let a = a {
  if let b = b {
    if let c = c {
      println("\(a) - \(b) - \(c)")
    } else {
      println("Something was nil!")
    }
  } else {
    println("Something was nil!")
  }
} else {
  println("Something was nil!")
}
{% endhighlight %}

In practice, and in most of the code that I find myself writing, optionals are rarely nil. For example when parsing JSON, the data you are supplied with is rarely malformed.

The need to continually nil check in the 'success scenario' really clutters your code. It reminds me of a small child on a car journey, but instead of repeating;

{% highlight csharp %}
"are we there yet?", "no"
"are we there yet?", "no",
"are we there yet?", "NO!"
{% endhighlight %}

My code reads as follows:

{% highlight csharp %}
"is it nil yet?", "no"
"is it nil yet?", "no"
"is it nil yet?", "NO!"
"is it nil yet?", "Sod it, I'm forced unwrapping this sucker ..."
{% endhighlight %}

Considering that nils are often the exception, I think that 'exceptions' are a the appropriate tool in this context.

In my opinion, if you use forced unwrapping to access an optional that is nil, it should throw an exception. You would then be able to catch these exceptional failures in a single location (which would not necessarily be within the same block of code).

Imagine if JSON parsing were this carefree ...

{% highlight csharp %}
try {
  let person = Person()
  person.age = json["age"]! as Int
  person.name = json["name"]! as String
  person.houseNumber = json["houseNumber"]! as Int
} catch e {
  // any optional that was forced-unwrapped yet found to be nil
  // would throw an exception that is caught as part of this block
  println("Unable to construct a person from the given JSON")
}
{% endhighlight %}

This would give us the best of both worlds, where if-let unwrapping can be employed to make detail-level decisions regarding nil optionals, whereas forced unwrapping and exceptions could be used to write logic that relies on  numerous optionals which we expect to almost always be non-nil.

I feel there are other benefits that exceptions provide, such as their ability to more clearly define the contract of an API method. This is something which I think the Java language does very well. However, Swift does have viable alternatives, such as enums with associated values as shown earlier.

Put simply, I believe that exceptions would allow us to write simpler, more readable code with fewer branches, whilst maintaining all the security that optionals currently offer.

Regards, Colin E.
