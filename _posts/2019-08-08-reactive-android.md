---
title: Reactive Android
date: 2019-08-08 00:00:00 Z
categories:
- Tech
tags:
- Android
- Reactive
author: jporter
layout: default_post
summary: Reactive programming is a powerful technique for handling data that changes
  over time, time-bound events, API requests and updating the UI. This post is a summary
  of how the reactive paradigm works in Android.
---

<style>
.jporter-centred-image {
  display:block;
  margin-left:auto;
  margin-right:auto;
}
  
#jporter-android-robot {
  max-width: 100px
}
</style>

## What is Reactive Programming?
According to André Staltz, author of the library [Cycle.js](https://cycle.js.org/), the reactive paradigm is programming with asynchronous data streams ([André Staltz, Github](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)). It is programming concerned with data that “flows” from a source to a sink and changes over time. For example, a user could press on the screen of their mobile device and generate click events. These events could propagate, or “flow”, through the app, being manipulated by various pieces of code, until they trigger changes in the user interface displayed on screen.

## Observer Design Pattern
Reactive programming is tightly coupled with the observer design pattern. The observer pattern defines two types of object: the subject and its observers. The subject creates a series of events, or data flow, and notifies its observers of any changes. The observers need to subscribe to the subject in order to receive updates to the data. This creates the idea of data “flow”, also known as a data “stream”.

## Example: Button Click
Let me use an example to explain. Suppose you have a button which can generate `onClick` events, like in the diagram below.

<img id="jporter-reactive-1" src="{{site.baseurl}}/jporter/assets/Reactive1.png" alt="Button Click Diagram" class="jporter-centred-image">

The button is the subject, which generates an `onClick` event on the left. On the right there are two observers, which are `onClick` listeners. The white arrows represent the data stream from the event to the listeners; this can be manipulated en-route.

Here is the same example in [Kotlin](https://blog.scottlogic.com/2019/04/29/kotlin-vs-java.html) code. Kotlin is a JVM language promoted by Google for Android development and is arguably a codification of Java best practices.

~~~kotlin
// subject
val button = Button()

// observer A
button.onClick {	
   doWorkA()
}

// observer B
button.onClick {
   doWorkB()
}

// generate event
button.click()
~~~

## Streams

A data stream is a concept that arises from a series of connected objects that propagate changing data from one object to the next along the chain. In this sense data "flows" from one object to another, creating the idea of a data "stream". Because they represent changing data, streams are observable and can typically have at least three standard transformation operations performed on them; merge, filter and map. As in the example above, streams are similar to click events or event buses but differ in that they can contain any arbitrary objects. Another feature of streams is that they are immutable, therefore when a stream is observed or transformed it completes and a new transformed version of the stream is created.

## Example: LiveData in Android

In Android, [LiveData](https://developer.android.com/topic/libraries/architecture/livedata) is an example of an object that implements the reactive paradigm. It allows events to be broadcast to its observers as its input data changes over time. This makes it ideal for handling API requests asynchronously or other stateful data.

<img id="jporter-android-robot" src="{{site.baseurl}}/jporter/assets/Android_Robot.png" alt="Android Robot" class="jporter-centred-image">

This diagram depicts a more complex series of data streams that involves mapping and filtering operations.

<img id="jporter-reactive-2" src="{{site.baseurl}}/jporter/assets/Reactive2.png" alt="Stream Diagram" class="jporter-centred-image">

The `LiveData` contains a float which can change over time. When the value changes, this new value is sent to the mapping operation `round to int`. A new, transformed, data stream is created and the associated value is propagated onwards to the filtering operation `filter to even`. The value is only passed onwards if it passes through the filter, otherwise it is blocked. Finally the value arrives at the observer `print number`.

Here is this example in Kotlin code.

### Setup stream
Firstly, we must set up the stream.

~~~kotlin
// subject
val liveFloat: MutableLiveData<Float> = MutableLiveData()

// observer 1 - map
val liveInt: LiveData<Int> = liveFloat.map { number ->
   number.roundToInt()
}

// observer 2 - filter
val liveEvenInt: LiveData<Int> = liveInt.filter { number ->
   number % 2 == 0
}

// observer 3 - final observer
liveEvenInt.observe(this, Observer { number ->
   println("Even number event: $number")
})
~~~

### Generate events
Now we have our data stream set up, we must generate events to demonstrate it.

~~~kotlin
val floats = listOf(0f, 4.5f, 2.3f, -9f, -6.2f)

floats.forEach { float ->
   liveFloat.value = float
}
~~~

This code will produce the following output.

~~~
Even number event: 0
Even number event: 2
Even number event: -6
~~~

## Resources
As mentioned above, [LiveData](https://developer.android.com/topic/libraries/architecture/livedata) is excellent at handling data from API requests that may have multiple states. A good example of how to effectively use this is with a custom "resource", an object which contains both state and data, an idea suggested by the [Android Jetpack guide](https://developer.android.com/jetpack/docs/guide#addendum).

Here is an implementation of this `Resource` concept. This utilises Kotlin's `sealed class` which is essentially an enhanced `enum class`, but instead of enum states each state is an entirely new class. This allows each state to contain its own data and functions.

~~~kotlin
sealed class Resource<T> {
   class Pending<T> : Resource<T>()
   data class Failure<T>(val throwable: Throwable) : Resource<T>()
   data class Success<T>(val data: T) : Resource<T>()
}
~~~

This can be combined with `LiveData` to produce a powerful mechanism for handling API events.

~~~kotlin
val apiRequest: LiveData<Resource<ResponseBody>> = requestFromAPI()
~~~

In Android, this API request would be done a data layer within the architecture; the response would be propagated up to the view layer where it could be handled like this.

~~~kotlin
when (val info = a.value) {
   is Resource.Pending -> {
       // display loading spinner
       displayLoadingSpinner()
   }
   is Resource.Failure -> {
       // navigate to error screen
       navigateToError(info.throwable)
   }
   is Resource.Success -> {
       // display API data
       displayData(info.data)
   }
}
~~~

Kotlin has many great language features, and I encourage you to go and [explore the language](https://blog.scottlogic.com/2019/04/29/kotlin-vs-java.html). One such feature is a `typealias` which allows one complex type to be represented by a simpler alias.

~~~kotlin
typealias LiveResource<T> = LiveData<Resource<T>>
typealias MutableLiveResource<T> = MutableLiveData<Resource<T>>
~~~

## Aside: LiveData Improvement
As a Java class, `LiveData` does not offer null safety out of the box, which is arguably a problem when working with Kotlin. This means that, in contrast to the rest of Kotlin, the value of a `LiveData<T>` instance can be either `null` or of type `T`. One potential solution to this is to create a non-nullable wrapper. Here is a simple example of this.

~~~kotlin
open class KLiveData<T>(initialValue: T) : LiveData<T>() {
   init {
       value = initialValue
   }

   override fun getValue(): T = checkNotNull(super.getValue())
}

class KMutableLiveData<T>(initialValue: T) : KLiveData<T>(initialValue) {
   public override fun setValue(value: T) {
       super.setValue(value)
   }

   public override fun postValue(value: T) {
       super.postValue(value)
   }
}
~~~

While this would be a useful solution, it would be far better if it was implemented within the Android framework itself. Android is under rapid development so perhaps as Kotlin gains prominence among developers this may happen.

## Conclusion
Reactive programming is a powerful technique for handling data that changes over time, or time-bound events. It is therefore great for supplying up-to-date data to a UI and is widely used in Android as a result. However, reactive code is often harder to read, maintain and test as it does not follow a sequential pattern. While some advocate for using this paradigm for everything, arguably it is prudent to weigh up whether or not it is appropriate for your situation.

<br>

_"The Android robot is reproduced or modified from work created and shared by Google and used according to terms described in the Creative Commons 3.0 Attribution License."_
