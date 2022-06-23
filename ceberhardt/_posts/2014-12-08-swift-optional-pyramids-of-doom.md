---
author: ceberhardt
title: Tearing Down Swift's Optional Pyramid of Doom
layout: default_post
summary: >-
  This blog post looks at a few techniques that can be used to remove the deeply
  nested if-let statements that are a common sight in Swift code.
oldlink: 'http://www.scottlogic.com/blog/2014/12/08/swift-optional-pyramids-of-doom.html'
disqus-id: /2014/12/08/swift-optional-pyramids-of-doom.html
categories:
  - Tech
---
This blog post looks at a few techniques that can be used to remove the deeply nested if-let statements that are a common sight in Swift code.

## Introduction

I know Swift's optionals are good for me, their strictness make my applications safer. But like that strange banana flavour medicine I recall the doctor giving me as a child, optionals leave a bad taste in my mouth!

In my previous blog post, I looked at how lazy properties can be used to avoid some of the [initialisation woes cause by optionals]({{ site.baseurl }}/2014/11/20/swift-initialisation.html). In this post, I'm turning my attention to optional pyramids!

What *is* an Optional Pyramid of Doom I hear you say?

It's a name I borrowed from the JavaScript world. Web developers often find themselves having to deal with chains of asynchronous callbacks. These can lead to deeply nested code, termed a [Pyramid of Doom](https://github.com/survivejs/js_tricks_and_tips/wiki/Common-Problems#user-content-pyramid-of-doom).

With Swift, pyramids become an issue when you have to unwrap multiple optional values before performing some logic:

{% highlight csharp %}
var a: String? = "one"
var b: String? = "two"
var c: String? = "three"

if let aUnwrapped = a {
  if let bUnwrapped = b {
    if let cUnwrapped = c {
      println("\(aUnwrapped) - \(bUnwrapped) - \(cUnwrapped)")
    }
  }
}
{% endhighlight %}

In the above code, the `println` statement will only be executed if all three of the optional variable `a`, `b`, and `c` are non nil. The more optionals your code relies on, the deeper the nesting becomes.

This becomes such an eye-sore that I've seen some developers [suggest nil-checking then forced unwrapping to flatten the code](https://github.com/raywenderlich/swift-style-guide/issues/63#issuecomment-65521081). Not something I'd recommend.

Time to explore an alternative:

## A Functional Alternative

It is actually quite a straightforward task to move the nested if-let statements into a utility function, where a given function is only invoked if all the optional parameters are non nil:

{% highlight csharp %}
func if_let<T, U>(a: Optional<T>, b: Optional<U>, fn: (T, U) -> ()) {
  if let a = a {
    if let b = b {
      fn(a, b)
    }
  }
}
{% endhighlight %}

The above function unwraps the optional parameters and invokes the given function with the unwrapped results. Notice that the unwrapped variables have the same name, and shadow, the optional parameters, [a naming convention proposed by Sam Davies](https://github.com/raywenderlich/swift-style-guide/issues/64#issuecomment-64116223), which I quite like.

The above function only takes two optional parameters, however the example above uses three. Unfortunately variadic parameters don't work in this context, so you have to overload the `if_let` function in order to vary the number of optional parameters:

{% highlight csharp %}
func if_let<T, U, V>(a: Optional<T>, b: Optional<U>,
  c: Optional<V>, fn: (T, U, V) -> ()) {
  if let a = a {
    if let b = b {
      if let c = c {
        fn(a, b, c)
      }
    }
  }
}
{% endhighlight %}

Using the above tears down the pyramid, giving the following code:

{% highlight csharp %}
if_let(a, b, c) {
  a, b, c in
  println("\(a) - \(b) - \(c)")
}
{% endhighlight %}

Much better!

(If you want to test the `if_let` function, have a go via this online [Swift Stub](http://swiftstub.com/306740405/))

## Further Extensions

The `if_let` function is quite a practical alternative to the nested if-let statements. Although it can be taken further, the next few sections explore some extensions that might be of interested

### if-let-else

Whilst optionals force you to consider `nil` and help avoid application crashes, you still need to do something sensible when nil checks fail.

The code snippet at the start of this post lacks and 'else' logic, time for a quick update:

{% highlight csharp %}
if let aUnwrapped = a {
  if let bUnwrapped = b {
    if let cUnwrapped = c {
      println("\(aUnwrapped) - \(bUnwrapped) - \(cUnwrapped)")
    }
  }
} else {
  println("Something was nil!")
}
{% endhighlight %}

Although, that's not quite right is it - the 'else' logic is only executed if the first 'if' fails.

What you actually need is something more like this:

{% highlight csharp %}
if let aUnwrapped = a {
  if let bUnwrapped = b {
    if let cUnwrapped = c {
      println("\(aUnwrapped) - \(bUnwrapped) - \(cUnwrapped)")
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

Yuck, I think I just spat out that medicine!

The `if_let` function can be extended to add an else argument as follows:

{% highlight csharp %}
func if_let<T, U, V>(a: Optional<T>, b: Optional<U>,
  c: Optional<V>, fn: (T, U, V) -> (), #elseFn: ()->()) {
  var allUnwrapped = false
  if let a = a {
    if let b = b {
      if let c = c {
        fn(a, b, c)
        allUnwrapped = true
      }
    }
  }
  if !allUnwrapped {
    elseFn()
  }
}
{% endhighlight %}

Yes, I know, it uses a variable to avoid the need to check each if-let statements, but variables are just fine if you use them to create higher-order functions ;-)

Putting this into action, gives the following:

{% highlight csharp %}
if_let(a, b, c, ({
    a, b, c in
    println("\(a) - \(b) - \(c)")
  }),
elseFn: {
  println("Something was nil!")
})
{% endhighlight %}

The syntax isn't quite as neat as the previous, which made good use of trailing closure syntax, but it is still better that the more manual approach. Again, there's a [Swift Stub](http://swiftstub.com/40660754/) to play with.

### if-let and cast

One area where Swift developers often encounter Pyramids of Doom is the parsing of JSON. In the early days of Swift there were quite a few people [lamenting the code that this resulted in](https://owensd.io/2014/06/18/json-parsing-2/), although more recently this problem has been solved by libraries such as [SwiftlyJSON](https://github.com/SwiftyJSON/SwiftyJSON), or [ridiculously clever functional concepts](http://robots.thoughtbot.com/efficient-json-in-swift-with-functional-concepts-and-generics).

The basic problem is as follows, when JSON is parsed, a dictionary is created at runtime, which is a collection of name-value pairs of `Any` type:


{% highlight csharp %}
// simulates a dictionary that is constructed from JSON
let dictionary: [String:Any] = [
  "age" : 23,
  "forename" : "Chris",
  "surname" : "Lattner"
]
{% endhighlight %}

Let's say you want to create a strongly typed model:

{% highlight csharp %}
struct Person {
  let forename: String,
  surname: String,
  age: Int
}
{% endhighlight %}

You're going to need this code:

{% highlight csharp %}
if let forename = dictionary["forename"] as? String {
  if let age = dictionary["age"]  as? Int {
    if let surname = dictionary["surname"]  as? String {
      let person = Person(forename: forename,
        surname: surname, age: age)
    }
  }
}
{% endhighlight %}

In this case the pyramid is caused because the dictionary subscript (i.e. the `[]` part) returns an optional result, furthermore a failable cast, `as?`, is required.

This can be replaced with an `if_let` overload that uses the type information from the supplied function in order to perform the required cast:

{% highlight csharp %}
func if_let<T, U, V>(a: Optional<Any>, b: Optional<Any>,
     c: Optional<Any>, fn: (T, U, V) -> ()) -> Bool {
  if let a = a as? T {
    if let b = b as? U {
      if let c = c as? V {
        fn(a, b, c)
        return true
      }
    }
  }
  return false
}
{% endhighlight %}

Which is used as follows:

{% highlight csharp %}
if_let(dictionary["forename"], dictionary["age"], dictionary["surname"]) {
  (forename: String, age: Int, surname: String) in
  let person = Person(forename: forename,
    surname: surname, age: age)
}
{% endhighlight %}

Again, removing the pyramid (here's a [Swift Stub](http://swiftstub.com/773581102/)). Note that in this instance you must provide type annotations for the closure variables, because this type information is used by `if_let` in order to cast the values of type `Any` returned by the dictionary.

This technique probably isn't as elegant as SwiftlyJSON, but it's an interesting alternative.

## Conclusions

Hopefully you've found some useful techniques in this blog post that will help you with your own personal battles with optionals!

I'm sure there are more interesting extensions possible, perhaps using custom operators? Or how about the annoying cases where you want to perform an if-let and combine it with some other boolean logic?

If you come up with any good ideas, please share!

Regards, Colin E.
