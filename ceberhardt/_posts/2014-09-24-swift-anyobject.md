---
author: ceberhardt
title: Swift and the curious case of AnyObject
layout: default_post
summary: >-
  Swift, as I am sure you are aware, is quite a strict, safe and strongly-typed
  language. However, because the language needs to maintain Objective-C
  compatibility it has some rather curious features, and the behaviour of
  `AnyObject` is one of them!
oldlink: 'http://www.scottlogic.com/blog/2014/09/24/swift-anyobject.html'
disqus-id: /2014/09/24/swift-anyobject.html
categories:
  - Tech
---
Swift, as I am sure you are aware, is quite a strict, safe and strongly-typed language. However, because the language needs to maintain Objective-C compatibility it has some rather curious features, and the behaviour of `AnyObject` is one of them!

## AnyObject and relaxed type-safety

`AnyObject` is a protocol that can represent an instance of any class type. It also has a more general counterpart, `Any`, which can represent any type at all (including structs and enums).

As you might expect, the following code will not compile:

{% highlight csharp %}
class Cat {
  func saySomething() {
    println("meow")
  }
}
var tiddles: AnyObject = Cat()
tiddles.saySomething()
{% endhighlight %}

It fails with the error *'AnyObject' does not have a member named 'saySomething()'*.

When provided with an instance of AnyObject you have to cast to the required type in order to execute its methods or access properties:

{% highlight csharp %}
(tiddles as Cat).saySomething()
{% endhighlight %}

This all makes sense so far, but here is where things get a little curious. If you import Foundation and mark the class with the `@objc` attribute, you no longer have to cast from `AnyObject` to `Cat` in order to invoke the `saySomething` method:

{% highlight csharp %}
import Foundation

@objc
class Cat {
  func saySomething() {
    println("meow")
  }
}

var tiddles: AnyObject = Cat()
tiddles.saySomething()
{% endhighlight %}

This is pretty odd behaviour! And as you can imagine, it is also unsafe. It is quite possible to write code that compiles, yet fails at runtime:

{% highlight csharp %}
import Foundation

@objc
class Cat {
  func saySomething() {
    println("meow")
  }
}

@objc
class Dog {
  func doSomething() {
    println("scratches")
  }
}

var tiddles: AnyObject = Cat()
tiddles = Dog()
tiddles.saySomething() // fails at runtime
{% endhighlight %}
Whilst this behaviour is understandable to people who came to Swift via Objective-C, I can guarantee it will confuse people who are new to iOS development!

## AnyObject and sneaky type conversions

If you try to create a 'mixed' array containing strings and numbers you will encounter difficulties:

{% highlight csharp %}
let mixed: [AnyObject] = ["cat", 45]
{% endhighlight %}

`AnyObject` can represent any class instance, but Swift's string and numeric types are all structs (i.e. value types).

However, as soon as you import Foundation, the compiler errors go away:

{% highlight csharp %}
import Foundation

let mixed: [AnyObject] = ["cat", 45]
{% endhighlight %}

How on earth does that work? From inspecting the contents of the array you can see that the compiler has automatically converted those literal values into a `NSString` and `NSSNumber`:

{% highlight csharp %}
let mixed: [AnyObject] = ["cat", 45]

_stdlib_getTypeName(mixed[0])
_stdlib_getTypeName(mixed[1])
{% endhighlight %}

## Conclusions

Take care when using `AnyObject`, you can do some pretty strange things with that types. In fact, take care when using Swift with Objective-C at all! ;-)

Regards, Colin E.
