---
title: 'Swift: The Beautiful Language'
date: 2019-07-19 00:00:00 Z
categories:
- Tech
author: bquinn
layout: default_post
summary: Swift combines the type and memory safety of a language like Java with the
  simplicity and ease of languages like JavaScript and Python. This article will explore
  some of the language features that, in my opinion, make Swift the most beautiful
  language to read and write.
---

# What is Swift?


Apple describe Swift as:

**_"An innovative programming language created by Apple for building everything from mobile apps to desktop software to services in the cloud. It’s designed to let anyone write programs that are safe by default, yet extremely fast. Swift is easy to use and open source, so anyone with an idea can create something incredible."_** 

Swift was first introduced in 2014 primarily to replace Objective C for developing apps for Apple devices and is now widely used for iOS, macOS, watchOS and tvOS. It can also be used for **scripting** and **servers**, and in 5 years it's already gained support and popularity on big platforms such as **AWS**, and was ranked at 13th in the TIOBE Index in July 2019. 

New versions of Swift are released every year, generally with an annual major version jump. This makes it a **modern**, evolving language which incorporates the best ideas that come out of its **open source** community. New versions of Swift are generally compatible with apps coded using older versions, and Apple provide a tool for converting both legacy Objective C code and outdated Swift code into the latest Swift version.


# Swiftly to the Point


So now you’re more familiar with where Swift comes from, let’s dive straight into some of the language features that make it so nice to read and write.


## Variable/Constant Assignment

Swift has two keywords for assigning memory - `let` and `var` which create **constants** and **variables** respectively. A constant cannot change value in its lifetime while variables can. Swift is **type safe**, so when a constant or variable is assigned it must remain the same type throughout its lifetime.

~~~swift
let myName: String = "Benedict Quinn"

var myAge: Int = 23
myAge = "Benedict Quinn" // Compile error - "Cannot convert Int to String"
~~~

This kind of code will be familiar in many languages. What sets Swift apart is its powerful **type inference** system, which removes unnecessary declarations of type. This declutters code, and makes it read almost like prosaic English, so the above assignment can be written more succinctly as:

~~~swift
let myName = "Benedict Quinn"
~~~

This is a simple example, but you can already see how the code is as **clean** and **simple** as JavaScript or Python, but is backed by **type safety** and **compile time** checks.

## Collection Notation

Arrays, sets, dictionaries and other collections can be initialised very **concisely** using square braces:

~~~swift
let array = [1, 2, 3]
let dictionary = [1: "One", 2: "Two", 3: "Three"]
let set: Set<Int> = [1, 2, 3]
~~~

Visually this is very easy to read, and it's even easier to code! You will notice that Swift's type inference assumes `[]` to be an array by default, so to initialise the set we have to explicitly state its type. This demonstrates how **type inference** does not do away with the need to type your objects, but rather **reduces the overhead**. An example of this is if we write a function that takes in a set, we can pass an argument using the the `[]` syntax and Swift will infer that we wish to create a set.

~~~swift
func getSizeOfSet(_ set: Set<Int>) -> Int { ... }
let size = getSizeOfSet([1, 2, 3])
~~~

Swift also incorporates the nice **for-in** syntax from Python, making looping through arrays very readable:

~~~swift
let numbers = [1, 2, 3, 4]
for number in numbers {
    print(number)
}
~~~

## Function Labels

To declare a function you must declare the **types** of the inputs and the return type. This provides the basis for type inference at the call site, allowing very concise code. 

There are also two labels in a function declaration which I want to highlight in this section. The first label is called the **'argument label'** and the second is called the **'parameter name'**. When a function is called, an argument is passed to it using the argument label. Within the function, the the parameter is referred to by the parameter name. There are three distinct combinations of these labels:

1.  If the argument label is **omitted**, then it is automatically set to be the parameter name. 
2.  If the argument label is **`_`**, you don't need to provide the label at the call site. 
3.  If the argument label and the parameter name have **different values** then you use the two different values respectively at the call site and within the function body. 

This allows you to choose the **most appropriate** label for the context, and again promotes very prosaic code. The following code examples demonstrate these three cases:

### _1. Omitting argument label_

~~~swift
class ResponseValidator {
    static func validate(_ response: Response) -> Bool {
        // Parameter label used in function body
        return response.statusCode == 200
    }
}

let response = Response()
// Argument label omitted at callsite; context given by class name
let validResponse = ResponseValidator.validate(response)
~~~

### _2. Providing unique argument label_

~~~swift
class DocumentStore {
    // Parameter label is the noun 'id' for use in function body
    static func getDocument(withID id: String) { ... }
}

// Argument label provides prepositional prosaic syntax at callsite
DocumentStore.getDocument(withID: "123456789")
~~~

### _3. Providing parameter name as argument label_

~~~swift
class {
    init(age: Int, height: Int, weight: Int,
         numberOfWins: Int, numberOfLosses: Int) { ... }
}

// Constructor labels usefully distinguish similar arguments which could otherwise easily be passed in the wrong order
let benedict = Competitor(age: 23, height: 180, weight: 75,
                          numberOfWins: 50, numberOfLosses: 0)
~~~

## Closures

Functions are **first class citizens** in Swift, and you can create anonymous functions called closures which are equivalent to **Java lambdas** or **JavaScript arrow functions**. In fact, Apple state that

**_"Global and nested functions...are actually special cases of closures"_**.

This demonstrates the fundamental role closures have in Swift. A closure is a snippet of code which **captures** references to any constants or variables from the **context** in which it is created, and can be called at a later date to perform an action using these references:

~~~swift
let id = "123456789"
let closure = { print(id) }
closure() // prints '123456789'
~~~

Closures can also be called with **arguments** and have **return values**. They also have an associated **type**. The syntax for this is:

~~~swift
let closure: (argument types) -> (return type) = 
    { (argument labels) -> (return type) in (code execution) }
~~~

In practice, Swift's type inference means you almost **never** have to specify the return type of the closure, nor the types of the arguments:

~~~swift
let closure = { id in return "The id is: " + id }
let id = "123456789"
let description = closure(id)
print(description) // prints 'The id is: 123456789'
~~~

Swift also uses **'trailing closure'** syntax; if the closure is the last argument in a function call, it can be placed outside the enclosing `()`, and if it is the only argument the brackets can be omitted completely. This avoids **nesting different braces** and **unnecessary empty brackets**:

~~~swift
func searchForID(_ id: String, onSuccess: (String) -> Void) { ... }
searchForID("123456789") { id in print(id) }

func getServerTime(onSuccess: (Date) -> Void) { ... }
getServerTime { date in print(date) } // Calls function without ()
~~~

Finally, to allow very concise code, you can use **anonymous arguments** rather than declare the inputs. These are notated using `$`, so `$0` is the first argument, `$1` is the second etc. The reason this works is because Swift knows the closure type, so it can **infer** the type of these anonymous arguments without declaring them:

~~~swift
func getServerTime(onSuccess: (Date) -> Void) { ... }
// Can use Date property timeIntervalSince1970
getServerTime { print($0.timeIntervalSince1970) }
~~~

Hopefully you can see from this how **beautiful** and **easy to use** Swift closures are.

## Enumerations

I think enumerations (enums) they are one of the **strongest aspects** of the language. In Swift, enums are **first class** types in their own right, and don't need to have another underlying type. They can have computed properties, or functions on them which can be used to help interpret the cases. 

Enums can also be given with a **raw value**, so that each case carries some value, such as String or Int. Alternatively, you can give individual cases an **associated value** or values, which can be succinctly extracted in control statements. This is particularly useful if you want your cases to have **different types**. For example if you are getting back a result from an API call, you may want to represent this as a **success** and **failure** case. For the failure you want to know the **status code**, but for the success you want to know the string representation of the **response** as well as the **status code**. This can be done using an enum in Swift:

~~~swift
enum Response {
    case success(String, Int)
    case failure(Int)
}
~~~

You can extract **associated values** from an enum in a **switch** or an **if**:

~~~swift
switch response {
case .success(let response, let statusCode):
    // Use response and statusCode
case .failure(let statusCode)
    // Use statusCode
}

if case .failure(let statusCode) = response {
    // Use albumID
}
~~~

Finally, Swift's **type inference** combines with enum cases to make them very attractive. If Swift can infer the type of an enum, you can just write the case e.g. `.success`. I now find this one of the biggest **eyesores** in **other languages**. For example if you are writing an exhaustive switch for an enum with ten cases, you avoid writing the type name ten times. More importantly you can write some very **readable code** by combining variable names with enums:

~~~swift
let musicGenre = MusicGenre.acapella
if musicGenre == .acapella {
    ...
}
~~~

This reads much like you would say this in English prose: "If the music genre is a cappella".

## Optionals

In Swift, any object must **have a value** or reference assigned to it before it is used. To cover cases where a variable may legitimately have no value, Swift uses **optionals**. Optionals are notated by a `?` after the type, so an optional String is notated as `String?`. Optionals are a type in their own right, which either take a value of another type (a String in this case) or are `nil`. Swift uses the term `nil` to separate itself from `null`  which can apply to any object in other languages. 

Swift's optionals are conceptually similar to the **Optional** object introduced in **Java 8**, but Swift provides a much nicer interface for handling optionals. In addition, **all** memory assignments are type checked. This means the compiler will throw an **error** for attempting to use an optional type without ensuring it's not nil, or an error for assigning nil to a non-optional. 

This introduces the concept of **'unwrapping'** an optional i.e. checking it actually has a value and assigning it to a variable. Swift provides a **very nice syntax** for unwrapping by treating an assignment of a nil value like a boolean. This can be done in an if or in a guard:

~~~swift
guard let necessaryVariable = object.nilReturnType() else {
    // Exit the function if necessaryVariable does not exist
    return
}

if let necessaryVariable = object?.getProperty() {
    // Use necessary variable
}
~~~

This allows us to use the unpacked variable as a non-optional type from then on. This is very **safe** as you always know when your variables hold values and when they don't, while keeping our code as **concise as** checking null equality in **other languages**. 

You also use `?` to perform actions on an optional value, such as calling a method or accessing a property without checking whether it is nil or not. These actions won't be performed if the value is nil, and will return nil if you are assigning to another property:

~~~swift
let potentialName: String?
// nameLength here is inferred to be type String? and is nil
let nameLength = potentialName?.count
~~~

Overall Swift's optionals provides **readable** syntax while providing excellent **memory safety**.

## Control Flow

Swift has all the usual control flow statements: for loops, while loops, if statements and switch statements. Swift's **switch** statements **don't fallthrough** by default, which avoids having to write numerous breaks, keeping code nice and clean. In addition, switch statements are required to be **exhaustive**, making them easy to understand, and with type inference switch cases are very easy to read in Swift.

Another way Swift syntax aims for readability is that it does **not** require control statements to **wrap** their arguments in brackets `()`. This **declutters** code and **focuses** the eyes on the important keywords:

~~~swift
if isVisible {
    handle()
}
~~~

A big part of Swift syntax attempts to **reduce indentation**. Particularly helpful for this aim is the **guard** statement. It asserts 'This condition must be true to continue with executing the body of this function'. You then provide an **else** block that will be executed if the condition or conditions are not met, which must exit the function by returning. This **reduces indentation** by allowing the rest of the function to continue at the **previous** level of **indentation**, with only the else block indented. In contrast, in an if-else statement both flows lead to indented code. 

The guard statement doesn't provide new functionality, as you can create the same effect in other languages by returning early in an if statement. Instead what it achieves is **greater readability** of your code by clearly stating that this boolean check is a **precondition** to the body of the function, allowing you to highlight exceptional cases to the 'normal flow' or 'happy path' of a function. An example of this may be handling a non-200 status code response from an API call:

### _Using guard_
~~~swift
func handleAPIResponse(_ apiResponse: Response) {
    guard apiResponse.statusCode == 200 else {
        handleFailure()
        return
    }

    handleSuccess()
}
~~~

### _Using if-else_
~~~swift
func handleAPIResponse(_ apiResponse: Response) {
    if apiResponse.statusCode == 200 {
        handleSuccess()
    } else {
        handleFailure()
    }
}
~~~

You can see how the guard statement suggests that a 200 response is the **expected** behaviour of the function and you handle the **exceptional** case of the failure in its own block. You can also see that if you had several lines of code instead of calling `handleSuccess()`, the indentation would make the code look much nicer to the eye.

# And That's Not All...


Like what you see? I've highlighted some of my favourite language features that make Swift beautiful, but there are plenty more cool and powerful features. These include **Protocol Oriented Programming**, Swift's use of **value types** and a brilliant API for **manipulating strings**. Plus it has all the other things you would expect from a modern object oriented language such as **generics**, **class inheritance**, **nested types** and **interfaces**. Watch out for further blog posts on these and other topics.

If you want to try coding in Swift, try it out on this [online playground](http://online.swiftplayground.run/). Or if you own a Mac, simply head to the App Store and download **Xcode**, which is a dedicated IDE for Swift. If you are on Linux or Windows, it's a little more complicated to run Swift code locally, though entirely possible and there are a number of online tutorials to help you get there.

_Swift and the Swift logo are trademarks of Apple Inc._
