---
author: ceberhardt
title: Exploring KVO alternatives with Swift
layout: default_post
summary: >-
  Swift has access to all of the Objective-C APIs, which means that anything you
  could do with Objective-C you can now do with Swift. However, there are times
  when it is worth exploring a better, pure-Swift, alternative. This post
  explores the pros and cons of KVO versus a couple of Swift alternatives.
oldlink: 'http://www.scottlogic.com/blog/2015/02/11/swift-kvo-alternatives.html'
disqus-id: /2015/02/11/swift-kvo-alternatives.html
categories:
  - Tech
---

Swift has access to all of the Objective-C APIs, which means that anything you could do with Objective-C you can now do with Swift. However, there are times when it is worth exploring a better, pure-Swift, alternative. This post explores the pros and cons of KVO versus a couple of Swift alternatives.

A [recent blog post by Ash Furrow](http://ashfurrow.com/blog/protocols-and-swift/) made a really interesting point:

>  Pay attention to the friction you experience when writing Swift – if something feels overly difficult, there probably is a better way.

The problem he was tackling was optional protocol methods, which whilst possible in Swift, drag you back into the world of Objective-C.

In order to mark a protocol method as optional you need to add the `@objc` keyword, which has some unpleasant side-effects, in that you cannot use it with structs or generics. His solution was to use multiple protocols to define logical groupings of functionality, which ultimately yielded a much better solution.

The ability to observe changes to an object's properties is a fantastic tool for writing applications that are composed of loosely coupled pieces. Cocoa provides this capability via Key-Value-Observing.

The bridging of Objective-C to Swift means that you can use KVO within Swift, however this results in the same kind of friction that Ash was referring to.

Let's take a look at some of the options:

## KVO in Swift

The first options is to simply use the pre-existing Key-Value-Observing capability provided by `NSObject`. In order to make a Swift type observable it must inherit from `NSObject`, and any properties that you wish to observe need to be marked with the `dynamic` keyword:

{% highlight csharp %}
class Car: NSObject {
  dynamic var miles = 0
  dynamic var name = "Turbo"
}
{% endhighlight %}

The `dynamic` keyword ensures that property access is dynamically dispatched via the Objective-C runtime, which is where the KVO logic is implemented.

The above code has some pretty undesirable side-effects, for example observable properties and classes must be Objective-C types, i.e. no structs, enums, and no generics.

The code required to observe changes is pretty horrible too. The following class `CarObserver` observes changes to the `miles` property:

{% highlight csharp %}
class CarObserver: NSObject {

  private var kvoContext: UInt8 = 1

  private let car: Car

  init(_ car: Car) {
    self.car = car
    super.init()
    car.addObserver(self, forKeyPath: "miles",
       options: NSKeyValueObservingOptions.New, context: &kvoContext)
  }

  override func observeValueForKeyPath(keyPath: String,
       ofObject object: AnyObject, change: [NSObject : AnyObject],
       context: UnsafeMutablePointer<Void>) {
    if context == &kvoContext {
      println("Change at keyPath = \(keyPath) for \(object)")
    }
  }

  deinit {
    car.removeObserver(self, forKeyPath: "miles")
  }
}
{% endhighlight %}

There's a lot of nasty stuff going on here; the need to use a context for KVO observation (to differentiate from any KVO in a potential subclass), the context constant which has to be a `var`, the cumbersome method signature ... it's just a mess!

Boring it down to a quick list of pros and cons:

**PROS**

 + Marking a property as `dynamic` is all you need to do in order to support change notifications

**CONS**

 + This drags you back into the Objective-C world via `NSObject`
 + It does not support [observing all the properties of an object](http://stackoverflow.com/questions/13491454/key-value-observing-how-to-observe-all-the-properties-of-an-object).
 + The code required to observe property changes is really ... *really* horrible!

It would be possible to address the last point by adding a simple adapter around the KVO interfaces. The other cons are inextricably linked to the design of KVO itself.

## Adding Events to Swift

The pure-Swift alternatives to KVO which I will discuss next all rely on an eventing mechanism. This is something that you have to build yourself, and that I covered in [my previous blog post](http://www.scottlogic.com/blog/2015/02/05/swift-events.html).

If you just want to grab the event code, [take a look at this gist](https://gist.github.com/ColinEberhardt/05fafaca143ac78dbe09).

## Observable Objects

The first implementation we'll explore is similar to KVO in that it is the object itself that is observable.

In order to make an object observable, it adopts the following protocol:

{% highlight csharp %}
protocol PropertyObservable {
  typealias PropertyType
  var propertyChanged: Event<PropertyType> { get }
}
{% endhighlight %}

This adds a `propertyChanged` event which is raised whenever a property is changed, and allows you to add observers. The data conveyed by this event, defined by the `PropertType` associated type, indicates which property has changed.

It's probably easier to understand by seeing this protocol in action:

{% highlight csharp %}
enum CarProperty {
  case Miles, Name
}

class Car: PropertyObservable {
  typealias PropertyType = CarProperty
  let propertyChanged = Event<CarProperty>()

  dynamic var miles: Int = 0 {
    didSet {
      propertyChanged.raise(.Miles)
    }
  }

  dynamic var name: String = "Turbo" {
    didSet {
      propertyChanged.raise(.Name)
    }
  }
}

{% endhighlight %}

You can see that the `Car` class has an associated enumeration which defines the observable properties. Whenever a property changes, the `didSet` 'internal' property observer is used to raise the event.

Here's how an observable object is used in practice:

{% highlight csharp %}
func viewDidLoad() {
  var car = Car();
  car.propertyChanged.addHandler(self, handler: ViewController.onPropertyChanged)
  car.miles = 34
}

func onPropertyChanged(property: CarProperty) {
  println("A car property changed!")
}
{% endhighlight %}

Those of you who have written any C# code will recognise this pattern from [INotifyPropertyChanged](https://msdn.microsoft.com/en-us/library/system.componentmodel.inotifypropertychanged.aspx).

When a property changes it can be quite useful to look at the difference between the old and new value. It should be easy to add this to the `propertyChanged` event:

{% highlight csharp %}
protocol PropertyObservable {
  typealias PropertyType
  var propertyChanged: Event<(PropertyType, Any)> { get }
}

class Car: PropertyObservable {
  typealias PropertyType = CarProperty
  let propertyChanged = Event<(CarProperty, Any)>()

  dynamic var miles: Int = 0 {
    didSet {
      propertyChanged.raise(.Miles, oldValue as Any)
    }
  }

  dynamic var name: String = "Turbo" {
    didSet {
      propertyChanged.raise(.Name, oldValue as Any)
    }
  }
}
{% endhighlight %}

You might be wondering why the downcast to `Any` is required? If you remove it, the resultant error message is totally misleading ... although as a Swift developer I am sure you are used to that!

The reason for the downcast is that the raise method has a single argument of type `(PropertyType, Any)`, however, the code above makes use of the way Swift allows you to 'decompose' a single tuple argument into multiple separate function arguments. However `(.Miles, oldValue)` would result in a tuple of type `(PropertyType, Int)`, which is clearly incompatible.

Having said that, this is a pretty minor annoyance, and the ability to 'decompose' tuple is a pretty sweet feature!

Here's a quick run down of the pros and cons of this approach:

**PROS**

 + This is a pure-Swift implementation, so doesn't interfere with the use of structs, generics and other non-ObjC concepts.
 + It allows you to observe all of the properties of an object with minimal effort.

**CONS**

 + You have to implement `didSet` for each property you wish to observe.
 + It requires an enumeration (or some other non-compiler checked string constants), which is used to distinguish each property.


### Observable Properties

The next solution is to move the responsibility for change notification from the class to the properties themselves.

The following is a simple implementation for `Observable`, a generic class that represents an observable property:

{% highlight csharp %}
class Observable<T> {

  let didChange = Event<(T, T)>()
  private var value: T

  init(_ initialValue: T) {
    value = initialValue
  }

  func set(newValue: T) {
    let oldValue = value
    value = newValue
    didChange.raise(oldValue, newValue)
  }

  func get() -> T {
    return value
  }
}
{% endhighlight %}

This `didChange` event includes both the old and new value, and both are typed.

You can add observable properties to a class like so:


{% highlight csharp %}
class Car {
  let miles = Observable<Int>(0)
  let name = Observable<String>("Turbo")
}
{% endhighlight %}

Notice the use of `let` here, the physical properties are a constant, while the (conceptual) properties are mutable! On other words, this prohibits re-assignment of `miles` or `name` to a new `Observable` instance, which is a good thing, because it would result in the loss of all the current observers.

Here are those observable properties in action:

{% highlight csharp %}
func viewDidLoad() {
  var car = Car();
  car.name.didChange.addHandler(self, handler: ViewController.nameDidChange)
  car.name.set("Speedy")
  println("The car is now called \(car.name.get())")
}

func nameDidChange(oldValue: String, newValue: String) {
  println("Name changed from \(oldValue) to \(newValue)")
}
{% endhighlight %}

One of the most immediate side-effects of this approach is that properties now have explicit `get` and `set` methods (it's like JavaBeans all over again *\*shudders\**)

For those of you who have done any JavaScript development, you might recognise this pattern from the MVVM framework [Knockout.js](http://knockoutjs.com). Although Knockout has the advantage that JavaScript functions are objects, which allows the framework to add the subscribe method to the observable function. This removes the need for explicit get and set functions.

With Swift you can apply a some custom operator and auto-closure magic to hide this to a certain extent:

{% highlight csharp %}
infix operator <- {}

func <-<T> (property: Observable<T>, value: @autoclosure () -> T) {
  property.set(value())
}
{% endhighlight %}

Which allows the following:

{% highlight csharp %}
car.name <- "Speed" + "Demon"
{% endhighlight %}

However, I'm not terribly keen on using custom operators, they feel like a form of obfuscation.

Here's a quick run-down of the pros and cons:

**PROS**

 + This is a pure-Swift implementation, so doesn't interfere with the use of structs, generics and other non-ObjC concepts.
 + There is no need to implement `didSet` for observable properties
 + The events are strongly typed (i.e. `T` for the old / new value as opposed to `Any`)

**CONS**

 + It does not allows you to observe all of the properties of an object
 + It adds a cumbersome extra layer for each and every property.


## Conclusions

I've shown three different approaches to creating observable properties and objects, none of which are perfect.

I'd be interested to know which approach you use? and why?

Personally, my feeling is that any modern language should have built-in support for observing property changes. In JavaScript this is on its way, in the form of `Object.observe`, [as part of ECMAScript 7](http://www.html5rocks.com/en/tutorials/es7/observe/). I'd really like to see Swift v.Next include a built-in alternative to KVO.

Regards, Colin E.
