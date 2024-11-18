---
title: Switching in Swift
date: 2019-12-04 00:00:00 Z
categories:
- Tech
tags:
- Swift
author: bquinn
layout: default_post
summary: 'The switch statement in Swift is a powerful and expressive way of performing flow control. It pairs very nicely with a few other language features: enumerations, extensions and type inference.'
image: bquinn/assets/Swift_logo_color.svg
---

In this post I will go through some of the interesting and useful things you can do with a Swift switch. Some of these will be familiar from other languages, perhaps with a twist, while others might be completely new to you. I'll start by looking at the syntax and basic principles of a Swift switch, then move onto more specific examples of its use.

## Basic syntax

A switch statement is written to match a value against a number of cases. For example different HTTP status codes might each require different handling, and could have a case each.

~~~swift
switch value {
case potentialMatch:
    // Handling code
case secondPotentialMatch:
    // Handling code
default:
    // Default handling code
}
~~~

Swift developers like to simplify code visually, so in a switch statement the cases sit in-line with the switch statement itself to reduce the number of levels of indentation. Swift language syntax discourages wrapping the input value of a switch in braces, and also discourages putting the opening brace of a control statement on a new line. Overall this keeps the switch statement compact and clean.

Swift's switches must be **exhaustive**, so all possible values of the input must be matched. You can provide a number of cases to match against the value, and also a default case to handle any unmatched values.

Another important feature of a Swift switch cases is that they do no automatically 'fallthrough'. Cases are evaluated in the order that they are written, and once a match is found, only the handling code for that case is handled. This means in more complex pattern matching, if the input matches more than one case, only the first case's code will be called. You can opt out of this behaviour by using the `fallthrough` keyword. Subsequent cases will then also be evaluated for a match. 

Another useful keyword is `break` which will immediately exit the evaluation of the switch statement. A common use case for this is to explicitly avoid handling a certain case. In this case, `break` is used to exit the switch without evaluating any other cases.

~~~swift
switch value {
case firstMatch:
    // Handling code - doesn't match any other cases
case secondMatch:
    // Handling code - continues on and evaluates against thirdMatch
    fallthrough
case thirdMatch:
    // Exits switch statement without evaluating fourthMatch
    break
case fourthMatch:
    // Handling code - doesn't match any other cases
default:
    // Exits switch statement
    break
}
~~~


## Enumerations

Probably the strongest feature of Swift's switches is how they combine with Swift's enumerations (enums). If you are unfamiliar with the syntax and behaviours of Swift's enums, check out my [previous post](https://blog.scottlogic.com/2019/07/19/swift-the-beautiful-language.html#enumerations) where I give a brief overview of their important features, or see Apple's [documentation](https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html) for a more detailed explanation.

Enums can be matched expressively thanks to Swift's type inference. In addition, because in Swift an enum is a type in it's own right, it has a well defined number of cases so the compiler is able to determine whether a switch is exhaustive. This means default cases are only enforced where they are truly necessary. Swift's enums can also carry associated values. These can easily be unpacked for use in handling code by assigning them as part of the case.

~~~swift
enum HTTPResponse {
    case valid
    case error(statusCode: Int)
}

let error = Error.valid
switch error {
case .valid:
    // Handle valid
case .error(let statusCode):
    // Handle error based on status code
}
~~~

## Using 'where' clauses

Any switch case can have its matching extended by an expression returning a boolean using a `where` statement. This can match against a variable or constant assigned inside the case, or anywhere in the scope of the switch statement. Cases matching with a `where` statement should be placed above a more general case of the same match, otherwise the general case will be matched first.

~~~swift
enum HTTPResponse {
    case valid
    case error(statusCode: Int)
}

let ignoreNonAuthenticationErrors = true
let error = Error.valid
switch error {
case .valid:
    // Handle valid
case .error(let statusCode) where statusCode == 403 :
    // Handle 403 error code
case .error(let statusCode) where statusCode == 401 :
    // Handle 401 error code
case .error(let statusCode) where ignoreNonAuthenticationErrors:
    // Ignore errors
case .error(let statusCode):
    // Handle errors
}
~~~

## Switching on types other than enumerations

### Basic types

You can match against any basic type in the Swift language, such as Int, String or Array. Because these types can have almost any value, the compiler will always prompt you to provide a default case.

~~~swift
let value = "Two"
switch value {
case "One":
    print("1")
case "Two":
    print("2")
default:
    break
}
~~~

For numeric types, you can also perform matches against a range of values using Swift's range operators:


~~~swift
let value = 4
switch value {
case 1...2:
    print("Between 1 and 2")
case 2..<5:
    print("Between 2 and 4")
case 5:
    print("It's 5")
default:
    print("Greater than 5")
}
~~~

### Extending basic types

In Swift, basic types such as Int and String are backed by structs. This allows the use of a Swift language feature called extensions, which allow you to add custom methods or static properties onto previously defined types. This allows us to define static properties on something like an Int to make switch cases more readable. The Swift compiler can determine the type of the value we are switching on, so it can use type inference to resolve the type to call the static property on.

~~~swift
private extension Int {
    static let forbidden = 403
    static let unauthorized = 401
}

let httpStatusCode = 403
switch statusCode {
case .forbidden:
    // Handle forbidden
case .unauthorized:
    // Handle unauthorized
default:
    // Handle general case
}
~~~

This example shows how our code now provides much more context for someone reading the code who isn't familiar with the meaning of HTTP status codes.

### Tuples

A tuple in Swift is a compound type that contains any number values of other types. The contained values can be named or unnamed. You can match each value of the tuple individually, or any combination of the values, allowing some very flexible matching:

~~~swift
let postion = (x: 5, y: 10, z: 7)
switch postion {
case (_, _, let z) where z == 0:
    // Handle point on the z axis
case (let x, _, let z) where x == z:
    // Handle point on the line x == z
case (1, 5, 9):
    // Handle specific point
case (let x, let y, let z):
    // Handle any other point
}
~~~

## Checking type

Swift's switch statements can be used to check the type of an input variable. This can be done either using the `is` operator if you simply want to check type, or using the `as` operator if you want to retain the cast for future use:

~~~swift
switch vehicle {
case is Bike:
    // Handle Bike
case let vehicle as Car:
    // Handle vehicle as Car
default:
    break
}
~~~

## And anything else you want!

In the event that the built in behaviours aren't sufficient, Swift provides the **expression operator**, `~=` which you can overload for any type to perform custom pattern matching in switch statements. As a simple example, you could extend String to provide pattern matching against Int using Swift's NumberFormatter.

~~~swift
extension String {
    static func ~= (pattern: Int, value: String) -> Bool {
        let numberFormatter = NumberFormatter()
        guard let numericValue = numberFormatter.number(from: value) as? Int else {
            return false
        }
        return numericValue == pattern
    }
}

let value = "4"
switch value {
case 1:
    // Match String against Int!
default:
    break
}
~~~
