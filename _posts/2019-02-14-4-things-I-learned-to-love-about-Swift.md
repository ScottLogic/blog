---
title: 4 things I learned to love about Swift
date: 2019-02-14 00:00:00 Z
categories:
- mstobbs
- Tech
tags:
- Swift
author: mstobbs
layout: default_post
summary: When first learning to develop in Swift, there were many cases in which I
  would become frustrated at some of its unique features. However, the more I learned
  about Swift, the more I realised these features weren't so crazy after all.
image: mstobbs/assets/apple-laptop.jpg
---

Have you ever become so familiar with a programming language that when you switch to a new one, it's hard to switch your mindset to this "new" paradigm? This is what happened to me when I first began learning Swift 4.0.

Originally coming from a mainly Javascript/Java background, there were several features of Swift that I found restrictive, confusing, or just unnecessary. There were "optional" variables which needed to be explicitly unpacked before they could be used. There were functions which needed labels for each of their arguments when the function was called. Swift even used the keyword let for constants, whereas javascript uses let for variables.

But as I learned more about Swift, I began to understand why the creators of Swift made these decisions. So this article is written to past me, explaining why Swift might not be as bad as you think it is, and may even be very clever.

## Clever types

Swift is statically and strongly typed, resulting in two constraints:

-	All variables, constants, etc. must have a type which is declared in advance and this type cannot change.
-	Whenever something is passed as a function argument, Swift checks at compile time that it is the correct type.

These two constraints, however, allows the developer to use shortcuts when using types. In the example below, we declare a basic enum, `PrimaryColour`, and a function which takes a `PrimaryColour` argument and prints the colour.

~~~swift
enum PrimaryColour {
  case red, green, blue
}

func printColour(colour: PrimaryColour) {
  switch colour {
    case PrimaryColour.red:
      print("Red")
    case PrimaryColour.green:
      print("Green")
    case PrimaryColour.blue:
      print("Blue")
    default:
      print("No colour found")
  }
}

printColour(colour: PrimaryColour.green) // Prints "Green" ✅
~~~

This works fine and prints "Green" as expected. But there's a lot of bloat:

-	It can be tedious to write out `PrimaryColour` so many times. 
-	Swift requires that Switch statements are exhaustive, which generally means a default case is needed. But each case of the `PrimaryColour` enum is covered in the Switch statement, so the default case will never be needed.

Swift is able to use the two previously mentioned constraints to solve these problems. Swift knows that the function argument `colour` must be a `PrimaryColour`, so therefore:

-	You don't need to explicitly state `PrimaryColour` in the switch statement, or in the function call.
-	A default case is not needed in the switch statement, because each of the three possible cases of `PrimaryColour` is covered and therefore the switch statement is exhaustive.

This allows us to clean up a lot of that unnecessary bloat.

~~~swift
enum PrimaryColour {
  case red, green, blue
}

func printColour(colour: PrimaryColour) {
  switch colour {
    case .red:
      print("Red")
    case .green:
      print("Green")
    case .blue:
      print("Blue")
  }
}

printColour(colour: .green) // Prints "Green" ✅
~~~

This makes the code cleaner, easier to write, and easier to read.

## Argument names in functions

When defining a function in Swift, each argument is given a parameter name. These parameter names are then used as labels for the arguments when the function is called.

~~~swift
func greet(person: String) {
  print("Hello \(person)")
}

greet(person: "Bob") // Prints "Hello Bob" 👋
~~~

This label can be customised by adding the alias before the parameter name, or you can remove the need for a label by writing `_` before the parameter name.

~~~swift
func greet(friend person: String) {
  print("Hello \(person)")
}

greet(friend: "Bob") // Prints "Hello Bob" 👋
~~~

This helps document the code and makes it more clear what each parameter is doing. But when I first saw this, it felt like overkill. I assumed `_` would be used for most parameters, except in certain cases where the developer needed to add extra clarity.

This changed when I started getting repeated comments on my code reviews telling me to simplify the repetition in my function names. For example, if I was writing a function to return `true` if two dates are equal to one another to a given granularity (e.g. are two dates in the same month?), I would have originally written:

~~~swift
func areDatesEqualWithGranularity(_ date1: Date, _ date2: Date, _ granularity: Calendar.Component) -> Bool { ... }

let date1 = Date()
let date2 = Date()

areDatesEqualWithGranularity(date1, date2, .month) // returns true ✅
~~~

This function works fine. But if you came across it in a new codebase, it would take a few seconds to figure out exactly what the function did and what each argument was. This would be even worse if the two dates were defined in other parts of the code and had been poorly named.

This same function is defined in the following way on the [Calendar struct](https://developer.apple.com/documentation/foundation/calendar/2292870-isdate):

~~~swift
func isDate(_ date1: Date, equalTo date2: Date, toGranularity component: Calendar.Component) -> Bool { ... }

let foo = Date()
let bar = Date()

isDate(foo, equalTo: bar, toGranularity: .month) // returns true ✅
~~~

Look how neat that function call is. Each argument label clearly explains what it's expecting from each variable and what that variable will be used for. This allows the function name to be simplified as each argument label explains what the function will be doing. This makes the code far more manageable, readable, and prevents function names from growing out of control.

## Extensions

Swift allows you to define extensions to an existing class, structure, enumeration, or protocol type. This allows you to add new functionality without directly adding code to the original definition. 

By using extensions, code can be segmented into [smaller, more readable chunks](https://cocoacasts.com/four-clever-uses-of-swift-extensions). In addition, useful functionality can be added to classes which were not originally defined by you.

For example, if you were writing an applications which needed to check whether two `Date` instances are in the same month as each other, you could extend the `Date` structure:

~~~swift
extension Date {
  func isSameMonth(date: Date) -> Bool {
    return Calendar.current.isDate(self, equalTo: date, toGranularity: .month)
  }
}
~~~

Now you would be able to check whether any two dates are in the same month by calling `Date`'s new method:

~~~swift
let date1 = Date()
let date2 = Date()

date1.isSameMonth(date: date2) // returns true ✅
~~~

## Optionals

Optionals in Swift are wrapper types. When an optional is wrapped around type X, it means that that value can either be of type X or nil. For example, if a variable is of type `Int`, it __must__ have a value, whereas if a variable is of type `Int?` (optional `Int`), it could have a value of type `Int`, or it could be nil.

Optionals are a separate type to their wrapped type, meaning that they can not be used interchangeably. This creates several restrictions:

-	If a function returns `Int`, it cannot return nil - it has to return a value. 
-	If a function accepts an argument of type `Int`, it cannot be used with a value of type `Int?`.

The advantage of this is that it is always clear which values can or cannot be nil. This means that the compiler can do many of the `foo == nil` checks which are needed in other languages and (usually) prevents you from trying to access the value of a variable that is nil. 

In practice, however, it can lead to a lot of frustration as the compiler often complains that you haven't unpacked an optional. This was especially prevalent when I first started using optionals.

But over time, as I learned which methods to use to unpack optionals in certain situations, I grew to appreciate optionals saving me from cases where I may have forgotten to check for nil. 

## Further Reading

If you'd like to learn more about Swift, I would highly recommend starting at the Swift [docs](https://swift.org/documentation/), especially the [guided tour](https://docs.swift.org/swift-book/GuidedTour/GuidedTour.html).

If you'd like to play around with some of Swift's features, try a Swift [playground](http://online.swiftplayground.run/).

Finally, if you'd like to know more about iOS App development, I recommend Ray Wenderlich's free ["Your First iOS App"](https://www.raywenderlich.com/5993-your-first-ios-app) video series.
