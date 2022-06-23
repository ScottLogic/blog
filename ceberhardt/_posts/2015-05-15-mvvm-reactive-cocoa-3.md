---
author: ceberhardt
title: MVVM With ReactiveCocoa 3.0
layout: default_post
summary: >-
  This is my final article on ReactiveCocoa 3.0 (RAC3), where I demonstrate some
  more complex RAC3 usages within the context of an application built using the
  Model-View-ViewModel (MVVM) pattern.
categories:
  - Tech
---


This is my final article on ReactiveCocoa 3.0 (RAC3), where I demonstrate some more complex RAC3 usages within the context of an application built using the Model-View-ViewModel (MVVM) pattern.

ReactiveCocoa 3.0 is currently in beta, having had [four beta releases](https://github.com/ReactiveCocoa/ReactiveCocoa/releases) in the past month. Version 3.0 brings a whole new Swift API alongside an updated Objective-C counterpart. While the core concepts of functional reactive programming remain the same, the Swift API is *very* different to the versions that have come before it, using generics, custom operators and curried functions to good effect. In my previous articles I took a look at the [generic Signal class](http://blog.scottlogic.com/2015/04/24/first-look-reactive-cocoa-3.html), which allows for 'strongly typed' reactive pipelines, and the [SignalProducer interface](http://blog.scottlogic.com/2015/04/28/reactive-cocoa-3-continued.html), that gives a cleaner representation of signals that have side-effects.

Since publishing those articles I've had quite a few people ask me to demonstrate some more complex RAC3 code, hence this article!

## A Quick MVVM Refresher

ReactiveCocoa is not an MVVM framework in itself, however, it provides functionality that make it easier to implement apps using this popular UI pattern.

At the core of this pattern is the ViewModel which is a special type of model that represents the UI state of the application. It contains properties that detail the state of each and every UI control, for example the current text for a text field or whether a specific button is enabled. It also exposes the actions that the view is able to perform, for example button taps or gestures.

<img src="{{ site.baseurl }}/ceberhardt/assets/rac3/MVVMPattern.png" />

Looking at the MVVM pattern specifically from the perspective of iOS development, the View is composed of the ViewController plus its associated UI (whether that is a nib, storyboard or constructed though code):

<img src="{{ site.baseurl }}/ceberhardt/assets/rac3/MVVMReactiveCocoa.png" />

With MVVM your Views should be very simple, doing little more than just reflecting the current UI state.

ReactiveCocoa holds a special role in implementing MVVM applications, providing a simple mechanism for synchronising Views and their associated ViewModels.

## MVVM in ReactiveCocoa 2.0

With RAC2, the process of binding ViewModel properties to your View involved the use of a number of macros:

{% highlight objc %}
RAC(self.loadingIndicator, hidden) = self.viewModel.executeSearch.executing;
{% endhighlight %}

The above code binds the `hidden` property of a loading indicator to the `executing` signal on the view model via the `RAC` macro. Another useful RAC2 macro is `RACObserve` which creates a signal from a property, effectively acting as a wrapper around KVO.

(If you've not used MVVM with ReactiveCocoa before, you might want to read my [tutorial on Ray Wenderlich's site](http://www.raywenderlich.com/74106/mvvm-tutorial-with-reactivecocoa-part-1))

Unfortunately these RAC2 macros are pretty clumsy and cumbersome to use. This is true of all macro-based APIs, not an issue with RAC specifically.

RAC3 does away with macros, and KVO, replacing them both with a pure Swift implementation.

## RAC3 Properties

I wrote a blog post a few months back which looked at [KVO and a few KVO-alternatives with Swift](http://blog.scottlogic.com/2015/02/11/swift-kvo-alternatives.html), the lack of strong-typing, dependence on NSObject and a rather clumsy syntax mean that KVO feels quite uncomfortable within the swift world.

With RAC3, properties (or at least properties which you wish to observe),are represented by the generic `MutableProperty` type:

{% highlight swift %}
let name = MutableProperty<String>("")
{% endhighlight %}

This creates a `name` property of type `String` and initialises it with an empty string. Notice that the name property above is a constant, despite the fact that it represents a mutable property!

Mutable properties have a very simple API, with a `value` property and `put` method, allowing you to get / set the current value:

{% highlight swift %}
name.put("Frank")
println(name.value)
{% endhighlight %}

They also expose a `producer` property of type `SignalProducer<T, NoError>`, which allows you to observe property changes:

{% highlight swift %}
name.producer
  |> start(next: {
    println("name has changed to value \($0)")
  })
{% endhighlight %}

... with everything being all nice and strongly typed.

With the MVVM pattern the process of wiring up the ViewModel to the View typically involves binding properties together, in other words, you want to ensure that the various properties of your view  are synchronised with the respective ViewModel properties.

RAC3 has a specific operator for this purpose:

{% highlight swift %}
executionTimeTextField.rac_text  <~ viewModel.queryExecutionTime
{% endhighlight %}

The above code binds the `queryExecutionTime` view model property to the `rac_text` property on the text field.

**NOTE:** Currently [RAC3 does not support two-way binding](https://github.com/ReactiveCocoa/ReactiveCocoa/issues/1986).

## An MVVM RAC3 Example

As promised, this blog post includes a more in-depth RAC3 example. A twitter search example:

<img src="{{ site.baseurl }}/ceberhardt/assets/rac3/MVVMRAC3.png" />

(Yes, all my example code seems to involve either Twitter or Flickr APIs! - if you have some more creative ideas that you'd like to share, please do)

The app searches for tweets containing the given text, automatically executing the search as the user types.

The ViewModel that backs the application has the following properties:

{% highlight swift %}
class TwitterSearchViewModel {

  let searchText = MutableProperty<String>("")
  let queryExecutionTime = MutableProperty<String>("")
  let isSearching = MutableProperty<Bool>(false)
  let tweets = MutableProperty<[TweetViewModel]>([TweetViewModel]())

  private let searchService: TwitterSearchService

  ...
}
{% endhighlight %}

These represent everything the View needs to know about the current UI state, and allow it to be notified, via RAC3 bindings, of updates. The table view of tweets is 'backed' by the `tweets` mtable property which contains an array of ViewModel instances, each one backing an individual cell.

The `TwitterSearchService` class provides a RAC3 wrapper around the Twitter APIs, representing requests as signal producers.

The core pipeline for this application is as follows:

{% highlight swift %}
let textToSearchSignal: SignalProducer<String, NSError>  -> SignalProducer<TwitterResponse, NSError> =
  flatMap(.Latest) {
    text in self.searchService.signalForSearchWithText(text)
  }

searchService.requestAccessToTwitterSignal()
  |> then(searchText.producer |> mapError { _ in TwitterInstantError.NoError.toError() })
  |> filter {
      count($0) > 3
    }
  |> throttle(1.0, onScheduler: QueueScheduler.mainQueueScheduler)
  |> on(next: {
      _ in self.isSearching.put(true)
    })
  |> textToSearchSignal
  |> observeOn(QueueScheduler.mainQueueScheduler)
  |> start(next: {
      response in
      self.isSearching.put(false)
      self.queryExecutionTime.put("Execution time: \(response.responseTime)")
      self.tweets.put(response.tweets.map { TweetViewModel(tweet: $0) })
    }, error: {
      println("Error \($0)")
    })
{% endhighlight %}

This requests access to the user's twitter account, following this the pipeline passes control to the `searchText.producer`, i.e. it observes its own `searchText` property. You'll notice that the producer isn't used directly, instead it is first mapped as follows: `searchText.producer |> mapError`. This highlights a common issue with RAC3, because signals have an error type constraint, any operation that combines signals (or signal producers) requires that their error types matches. The use of `mapError` above transforms any error that `searchText.producer` might produce into an `NSError`, which is compatible with the other signals being used in this pipeline.

Following this, the signal is filtered and throttled. This reduces the frequency of the signal if the `searchText` property (which is bound to the UI), changes rapidly.

The signal is then flat-mapped to a signal that searches twitter based on the given search text. Notice that I had to 'break out' the `flatMap` operation. This is due to the overloaded nature of this operation making it impossible for the compiler to determine which implementation to use - I'll raise an issue on GitHub for that one shortly!

## Adding Mutable Properties to UIKit

Currently RAC3 lacks any UIKit integration, my guess is that this will come later in the beta process. For now, in order to bind a ViewModel to a UIKit View, you have to add the required extensions yourself. Fortunately this is quite simple!

In another side project I have been messing about with I created a utility function for creating lazily-constructed associated properties:

{% highlight swift %}
func lazyAssociatedProperty<T: AnyObject>(host: AnyObject,
                       key: UnsafePointer<Void>, factory: ()->T) -> T {
  var associatedProperty = objc_getAssociatedObject(host, key) as? T

  if associatedProperty == nil {
    associatedProperty = factory()
    objc_setAssociatedObject(host, key, associatedProperty,
                                   UInt(OBJC_ASSOCIATION_RETAIN))
  }
  return associatedProperty!
}
{% endhighlight %}

This creates a property of type `T`, where the given factory function is used to create the properties initial value on first access.

This can be used to create a lazily-constructed mutable property:

{% highlight swift %}
func lazyMutableProperty<T>(host: AnyObject, key: UnsafePointer<Void>,
              setter: T -> (), getter: () -> T) -> MutableProperty<T> {
  return lazyAssociatedProperty(host, key) {
    var property = MutableProperty<T>(getter())
    property.producer
      .start(next: {
        newValue in
        setter(newValue)
      })
    return property
  }
}
{% endhighlight %}

The above code creates a mutable property, then subscribes to the producer, calling the supplied `setter` function when the value changes.

This can be used to add RAC3 properties to a view as follows:

{% highlight swift %}
extension UIView {
  public var rac_alpha: MutableProperty<CGFloat> {
    return lazyMutableProperty(self, &AssociationKey.alpha, { self.alpha = $0 }, { self.alpha  })
  }

  public var rac_hidden: MutableProperty<Bool> {
    return lazyMutableProperty(self, &AssociationKey.hidden, { self.hidden = $0 }, { self.hidden  })
  }
}
{% endhighlight %}

Note that these properties only have getters, you set them via the `put` method on the property itself.

Within this project I have only added the properties I need for this example code.

It is of course a little more complicated for controls where they also mutate the same properties. With a text field you also have to subscribe to changes as a result of user input:

{% highlight swift %}
extension UITextField {
  public var rac_text: MutableProperty<String> {
    return lazyAssociatedProperty(self, &AssociationKey.text) {

      self.addTarget(self, action: "changed", forControlEvents: UIControlEvents.EditingChanged)

      var property = MutableProperty<String>(self.text ?? "")
      property.producer
        .start(next: {
          newValue in
          self.text = newValue
        })
      return property
    }
  }

  func changed() {
    rac_text.value = self.text
  }
}
{% endhighlight %}

With this in place, the ViewModel can be bound as follows:

{% highlight swift %}
viewModel.searchText <~ searchTextField.rac_text
executionTimeTextField.rac_text  <~ viewModel.queryExecutionTime
{% endhighlight %}

It's also possible to map values as part of the binding process.

{% highlight swift %}
searchAcitivyIndicator.rac_hidden <~ viewModel.isSearching.producer
                                       |> map { !$0 }
tweetsTable.rac_alpha <~ viewModel.isSearching.producer
                            |> map { $0 ? CGFloat(0.5) : CGFloat(1.0) }
{% endhighlight %}

For the tweets table view, this project also includes an adapted version of the [table view binding code](http://blog.scottlogic.com/2014/05/11/reactivecocoa-tableview-binding.html) I wrote a while back.

Interestingly, RAC3 also has a `ConstantProperty` class, which might seem a little odd! I use it for the ViewModel that backs each table cell:

{% highlight swift %}
class TweetViewModel: NSObject {

  let status: ConstantProperty<String>
  let username: ConstantProperty<String>
  let profileImageUrl: ConstantProperty<String>

  ...
}
{% endhighlight %}

The value of this `ConstantProperty` is that you can still use the `<~` binding operator, and in future if you do decide to make it mutable you do not have to change your binding code.

## Conclusions

RAC3 is shaping up to be a really great framework. There are still one or two loose ends, but overall it represents is a significant step forwards.

All the code for this example app is [available on GitHub](https://github.com/ColinEberhardt/ReactiveTwitterSearch). I'd also suggest taking a look at [WhiskyNotebook](https://github.com/nebhale/WhiskyNotebook), another project which makes quite a bit of use of RAC3.

Regards, Colin E.
