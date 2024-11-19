---
title: Swift JSON Shoot-Out
date: 2015-03-09 00:00:00 Z
categories:
- Tech
tags:
- featured
author: sdavies
layout: default_post
summary: For some reason, everybody and their dog has written about how to parse JSON
  in Swift. Not wishing to be left out, I thought I'd throw my hat into the ring.
image: sdavies/assets/featured/json.jpg
title-short: JSON in Swift
summary-short: What's the _best_ way to parse JSON in Swift? Sam explores a number
  of options.
---

## Introduction

In the world of Swift blogging, JSON parsing seems to be a 'hot topic'. Maybe it's
a rite of passage to becoming a Swift blogger? Anyway, it seems like a good time
to get involved.

There have been some truly excellent blog posts about using JSON with Swift, but
they mainly focus on the theory behind using the functional aspects of the new
language to the best effect. This is great, and I recommend you read them, but
we don't necessarily want to have to learn a whole new programming paradigm to
implement the network data layer of our app.

This article is a pragmatic review of the current options available for JSON
parsing in Swift, covering some of the most popular new libraries.

All approaches rely on Cocoa's `NSJSONSerialization` class to handle the JSON
string to Foundation object parsing. The interesting question is what happens at
this point. In the Swift world, the output of 
`JSONObjectWithData(_:, options:, error:)` is an `AnyObject?` blob. What can we
do with this? We know it's made up of Foundation objects such as `NSArray`, 
`NSDictionary`, `NSNumber` etc, but the structure is dependent on the schema of
the JSON.

First of all we'll take a look at what we'd actually like from a JSON parser, in
an ideal world, before reviewing the naïve approaches you'd expect as a seasoned
Objective-C developer. Then we'll consider two new frameworks that have popped
up in the last few months, explaining their underlying concepts and reviewing
how close they come to our ideal scenario.

Accompanying this article you'll find an Xcode workspace containing several
playgrounds. This is available to download from GitHub at
[github.com/sammyd/SwiftJSONShootout](https://github.com/sammyd/SwiftJSONShootout).
The dependencies are managed by Carthage, but are checked in to ensure
compatibility. You will probably have to build each of the frameworks in order
for the playgrounds to pick them up.

> __Note:__ Swift is undergoing a huge amount of development, as are the
> libraries used in this blog post. The code works at the time of writing, using
> Swift 1.2, with Xcode 6.3β2.

### Wish list

JSON is a great serialization technology due to its simple specification, and
accessibility to both humans and machines. However, it quickly becomes unwieldy
within the context of an application. Most software design architectures have
the concept of a model layer - that is a selection of objects used to model the
data structure that your application acts upon. It is these model objects that
the JSON should be converted to inside the application.

Since the `NSJSONSerialization` class has no knowledge of the specific model
layer within your application, it translates the JSON into the generic types
within Foundation. It is the next step - translating these Foundation types into
our data model - that is important.

Our parser should leverage the type-safety that underlies Swift, and also prevent
creation of invalid objects - i.e. model objects which don't have all required
properties populated.

As you'll see, satisfying these requirements is not too difficult in a
'best-case' scenario, but becomes increasingly difficult when attempting to cope
with errors in the JSON data structure.

### Other approaches

Before diving into the problem from a Swift point of view, let's take a moment
to review how other languages handle JSON.

C# offers an approach which uses dynamic objects. That is to say that the
structure of the objects is not known at compile time, but instead they are
created at runtime. In some respects, this is a lot like the behaviour of
`NSJSONSerialization`, with the extension of using properties on a dynamic
objects instead of a dictionary keyed on strings. This approach is not typesafe,
in that the type-checker has no knowledge of the dynamic objects, and therefore
lets you do whatever you wish with them in the code. It isn't until runtime
(i.e. once the JSON has been parsed) that you discover particular properties
don't exist, or are of the incorrect type.

Sticking with C#, there are alternative approaches that automatically
deserialize JSON into pre-defined model objects through reflection and
annotations. Since you define the model objects in code, you retain the type
safety you're used to, and the annotations/reflection mean that you don't
repeat yourself.

Ideally we'd like to use the latter of these two approaches in Swift. Swift
doesn't yet support reflection or annotations, so we can't get quite the same
functionality, but how close can we get?

### Accompanying Project

This article has accompanying code to demonstrate the different approaches to
JSON parsing in Swift, and it takes the form of three playgrounds, combined
together in a workspace. The workspace also contains projects for the three
framework dependencies - SwiftyJSON, Argo and Runes. Combining everything in a
workspace allows you to use dependencies within playgrounds.

[Carthage](https://github.com/Carthage/Carthage) was used to import the dependencies, but since they have been committed
into the repo, you shouldn't need to worry about it. You will, however, need to
build the frameworks in the workspace. The playgrounds are for OSX, so select
each of __ArgoMac__ and __SwiftJSONOSX__ from the build schemes menu and then
build it. Then the playgrounds will work as expected.

## Naïve Parsing

The output from the `NSJSONSerialization` class is composed of Foundation
objects - `NSDictionary`, `NSArray`, `NSString`, `NSNumber`, `NSDate` and
the all-important `NSNull`. Understandably, coming from an objective-C
heritage, your first attempt at interpreting this data structure to match your
model layer might be to deal with it directly. Since all the constituent parts
are subclasses of `NSObject`, and properly implement key-value coding (KVC), you
can jump straight in with the `valueForKeyPath:` method.

For example, given an `NSDictionary` that represents a GitHub repository from
the __repos__ API, you could find discover the repo name as follows:

{% highlight swift %}
let repo_name = repo_json.valueForKeyPath("name")
{% endhighlight %}

Notice that since you're leveraging KVC, you can delve further into the nested
structure:

{% highlight swift %}
let owner_login = repo_json.valueForKeyPath("owner.login")
{% endhighlight %}

This approach is quite powerful for pulling out the odd element from a JSON
structure, however, it doesn't stack up very well when trying to populate a
model object. For example, the `Repo` struct is a small subset of the data
returned in the JSON:

{% highlight swift %}
struct Repo {
  let id: Int
  let name: String
  let desc: String?
  let url: NSURL
  let homepage: NSURL?
  let fork: Bool
}
{% endhighlight %}

To correctly populate an array of `Repo` objects using `valueForKeyPath`, you'd
have to write code along the following lines:

{% highlight swift %}
var repos = [Repo]()

if let json : AnyObject = json {
  if let array = json as? NSArray {
    for jsonItem in array as [AnyObject] {
      if let id = jsonItem.valueForKey("id") as? Int {
        if let name = jsonItem.valueForKey("name") as? String {
          if let url_string = jsonItem.valueForKey("url") as? String {
            if let fork = jsonItem.valueForKey("fork") as? Bool {
              if let url = NSURL(string: url_string) {
                let description = jsonItem.valueForKey("description") as? String
                var homepage: NSURL? = .None
                if let homepage_string = jsonItem.valueForKey("homepage") as? String {
                  homepage = NSURL(string: homepage_string)
                }
                let repo = Repo(id: id, name: name, desc: description, url: url,
                                homepage: homepage, fork: fork)
                repos += [repo]
              }
            }
          }
        }
      }
    }
  }
}
{% endhighlight %}

There are a few points to note about this code:

- __Rightward Drift__ If the JSON is malformed, or there is a mistake in the
parsing code, then `valueForKeyPath()` will return `nil`. Therefore you need to
check that each time you extract a value, it is not `nil`, and it is of the
expected type. This leads to the optional-checking tree, the so-called "pyramid of doom".
- __Type conversions__ If your JSON includes types which are not directly
supported by `NSJSONSerialization` (such as `NSURL`) then the conversion code is
likely to end up mixed in with the optional checking tree, as it does here.
- __Repeated Structure__ Notice that all this code is really doing is extracting
the appropriate values for your pre-defined `Repo` struct and then creating one.
This feels like repeated effort, especially since the property names in the
struct are identical to those in the JSON itself.
- __Legibility__ I bet you haven't actually read the above code block. Not
_really_ read it - I mean read it to understand it. I don't blame you - it's an
impenetrable mess. It's responsible for extracting values, type checking,
validation, type conversion, object creation and appending to an array. That's
not a sign of a well-formed block of code.

Don't dwell on this example too much - the code could almost certainly be
reformatted and improved, whilst retaining the same approach. However, as we
progress, you'll see that there are better approaches.

You might have looked at this and decided that the `valueForKeyPath` approach is
a deliberate attempt to be obtuse - there are better ways of working with
Foundation objects in Swift. To an extent you'd be correct - `valueForKeyPath`
is great at diving deep into object structures, but that might not always be
ideal. For the interests of fairness, let's take a look at a slightly more
Swift-friendly approach.

The Foundation objects that are supported by `NSJSONSerialization` all have
Swift counterparts that are bridged. For example, `NSString` in Foundation can
be represented as a `String` in Swift. This gets a little more complicated with
`NSArray` and `NSDictionary`, but with some optional casting, and liberal use of
`AnyObject` you can work with pure Swift representations of the underlying
Foundation objects.

The previous code block for creating an array of `Repo` objects can be rewritten
as the following:

{% highlight swift %}
var repos_ot = [Repo]()

if let repo_array = json as? NSArray {
  for repo_item in repo_array {
    if let repo_dict = repo_item as? NSDictionary {
      if let id = repo_dict["id"] as? Int {
        if let name = repo_dict["name"] as? String {
          if let url_string = repo_dict["url"] as? String {
            if let fork = repo_dict["fork"] as? Bool {
              if let url = NSURL(string: url_string) {
                let description = repo_dict["description"] as? String
                var homepage: NSURL? = .None
                if let homepage_string = repo_dict["homepage"] as? String {
                  homepage = NSURL(string: homepage_string)
                }
                let repo = Repo(id: id, name: name, desc: description, url: url,
                                homepage: homepage, fork: fork)
                repos_ot += [repo]
              }
            }
          }
        }
      }
    }
  }
}
{% endhighlight %}

You should notice straight away that there isn't actually a huge amount of
difference. The code still suffers from rightward drift from the optional
nesting, it still has the type conversion embedded in the tree, and the
structure has once again been replicated.

Swift 1.2 introduces some new syntax around `if let` statements that
significantly reduces the rightward drift. An `if` statement can include
multiple (comma-separated) `let` statements, all of which must succeed in order
for the conditional clause to be evaluated. Translating the above "pyramid of
doom" into this new syntax results in the following:

{% highlight swift %}
var repos_pyramid = [Repo]()

if let repo_array = json as? NSArray {
  for repo_item in repo_array {
    if let repo_dict = repo_item as? NSDictionary,
      let id = repo_dict["id"] as? Int,
      let name = repo_dict["name"] as? String,
      let url_string = repo_dict["url"] as? String,
      let fork = repo_dict["fork"] as? Bool,
      let url = NSURL(string: url_string) {
        let description = repo_dict["description"] as? String
        var homepage: NSURL? = .None
        if let homepage_string = repo_dict["homepage"] as? String {
          homepage = NSURL(string: homepage_string)
        }
        let repo = Repo(id: id, name: name, desc: description, url: url,
          homepage: homepage, fork: fork)
        repos_pyramid += [repo]
    }
  }
}
{% endhighlight %}

Notice that all the fields can be extracted from the `NSDictionary` in one
statement, using this new `let` syntax. Although the syntax is slightly nicer,
it is still semantically equivalent - a fairly unpleasant mix of model structure
and parsing logic.

OK, so we've established how far we can get with this naïve approach, somewhat
inspired by our traditional Objective-C days, but what happens when we start to
use some of the new features of Swift?

## SwiftyJSON

As was mentioned in the intro to this article, we're not actually going to dig
too far into _how_ things are being implemented in Swift, but rather discover
how others (via frameworks) have used the functionality to improve the developer
experience associated with parsing JSON.

First up is an open source library called __SwiftyJSON__. The key functionality
within Swift that drives the approach taken in __SwiftyJSON__ is the
introduction of a more complete `enum` type - more specifically, one that allows
associated values. This is used to create a `JSON` type, which can take a
variety of different cases, each with an associated value. i.e. every element in
a JSON structure can be represented using a single type - a string is still of
type JSON, but with an associated `String` value, etc. This might sound a little
confusing, but once you get your head round it you'll see that it's really
powerful. This is starting to scratch the surface of a topic known as
"Algebraic Data Types" from within functional programming. As with all topics in
functional programming, it sounds a lot more complicated than it actually is.

In addition to this fundamental `JSON` datatype, __SwiftyJSON__ also adds lots
of implicit type conversions to simplify the typing frenzy that is optional
chaining.

So, enough theory, what does this actually look like when applied to the
aforementioned `Repo` array?

{% highlight swift %}
let json = JSON(data: rawJSON!, options: .allZeros, error: nil)

var repos = [Repo]()
for (index: String, subJson: JSON) in json {
  if let id = subJson["id"].int,
     let name = subJson["name"].string,
     let url = subJson["url"].string,
     let fork = subJson["fork"].bool {
        var homepage: NSURL? = .None
        if let homepage_raw = subJson["homepage"].string {
          homepage = NSURL(string: homepage_raw)
        }
        let url_url = NSURL(string: url)!
        repos += [Repo(id: id, name: name, desc: subJson["description"].string,
          url: url_url, homepage: homepage, fork: fork)]
  }
}
{% endhighlight %}

Some things to note about this code segment:

- __Implicit NSJSONSerialization__. SwiftyJSON includes this as part of its
implementation, so you actually just need to pass the raw `NSData` object.
- __Custom enumeration__. A new `for(index:, subJson:)` method has been created
which looks a little bit like a `for-in` loop. This works on a JSON array, and
provides each element as a `JSON` object.
- __JSON Subscripting__. If a `JSON` element is of a dictionary type then
subscripting behaves as you might expect, allowing things like `subJson["url"]`.
- __JSON casting__. `JSON` elements also have properties on them which allow you
to extract the associated value. For example, if the element is of a string
type, you can extract that string with the `string` method. These properties are
all optionals, so if you attempt to extract a string from a number element,
you'll get rewarded with `.None`. 
- __Rightward Drift__. Well, it's not really there, because of the new
syntax in Swift 1.2, but there is a huge `if` statement ensuring that it's
impossible to construct a malformed `Repo` object. This is because the accessor
properties on the `JSON` enum are all optional, and not all of our `Repo`
properties accept optionals.
- __Type Conversion__. The `NSString` to `NSURL` type conversion is still part
of the parsing tree. This is probably a little unfair; it is perfectly possible
to define an extension to the `JSON` enum to add a property of type `NSURL?`.
This would implement the same functionality as the existing code, but would be
in a more appropriate place.

So in summary, it's a lot better than the original approach, but it is still
liable to end up with an optional tree somewhere. It's great for extracting
specific values from a JSON data structure, but doesn't solve the problem of
converting the JSON to model objects in a particularly elegant way. You could
argue that maybe it's not supposed to do that - it has succeeded in making
working with JSON a much more type-safe exercise, but you're still left with
writing a lot of the parsing logic yourself.

## Argo

__SwiftyJSON__ introduced a slightly more functional way of thinking to parsing
JSON, but we can take that line of thought much further. That's the approach
taken by, amongst others, __Argo__ (swiftz is another example, but is a
less-targeted toolkit, with a JSON approach that doesn't appear to be quite as
well thought out). The approach used in __Argo__ is inspired by parser design
from purely functional languages such as Haskell, so there is a lot of
background and a rich heritage to this approach.

It is designed to populate model objects directly from the JSON stream, by
specifying how each of the models should be 'decoded' from the stream. More
often than not, this boils down to describing which fields in the JSON object
should be used for each of the properties in your model object.

Inevitably, since this is a functional approach, it involves some crazy looking
operators. Therefore, rather than just chucking a load of code at you, we'll
take it in smaller chunks.

We start with exactly the same `Repo` struct as in every other example, and this
time add an extension that defines the conformance to the `JSONDecodable`
protocol:

{% highlight swift %}
extension Repo: JSONDecodable {
  static func create(id: Int)(name: String)(desc: String?)
                    (url: NSURL)(homepage: NSURL?)(fork: Bool) -> Repo {
    return Repo(id: id, name: name, desc: desc,
                url: url, homepage: homepage, fork: fork)
  }
  
  static func decode(j: JSON) -> Repo? {
    return Repo.create
      <^> j <|  "id"
      <*> j <|  "name"
      <*> j <|? "description"
      <*> j <|  "url"
      <*> j <|? "homepage"
      <*> j <|  "fork"
  }
}
{% endhighlight %}

This looks scary - but keep calm. The `JSONDecodable` protocol actually defines
just one method - the static `decode()` method. This takes a `JSON` (think
equivalent to the `JSON` enum used in __SwiftyJSON__) and attempts to create a
new `Repo` (hence the optional). The other method that's been defined here is
the curried `create` method - and this is only done as an implementation detail
associated with Swift initializers.

The body of the `decode` method contains several custom operators, and getting
your head around these will allow you to construct your own `decode` methods.
Rather than explaining in great detail exactly what these methods do, lets take
a look at how to use them in the context of implementing a `decode` method:

- `<|` __parse value__. This attempts to extract the field specified by the
string to the right from the `JSON` on the left. It will then cast to
appropriate type. If this is impossible then the operation will return `.None`,
which will cause the parsing chain to fail. You can parse nested values with an
array of strings e.g. `<| ["owner", "login"]`
- `<|?` __parse optional value__. This works in exactly the same way as the
previous operator, only allows parsing into optional values. This means that the
parsing chain will not fail if the specified field is `null` or cannot be found.
- `<^>` __map__. This takes a function `T -> U` and an optional input `T?` and
returns an optional output `U?`. In the parsing chain, the function is the
curried `create` function, the optional input is the output from the value
parsing function. The output is now an optional function - comprising the input
`create` function, with one less level of currying.
- `<*>` __apply__. This is very similar to the __map__, only this time the
function it operates on is optional itself - i.e. `(T -> U)?`. This matches with
the result from the parsing chain; if a result cannot be parsed then the output
will be none. Otherwise, the output will be a curried `create` function with the
more recent input parameter applied.

In addition to the ones used above, the following are also important:

- `<||` __parse array of values__. Takes an array from the JSON and parses it
into an array in Swift.
- `<||?` __parse optional array of values__. Identical to the previous operator,
but will parse to an optional array if required.

This isn't as confusing as it might seem. These are the important things to
note:

- The `create` function is curried. This means that each individual parameter
can be provided in turn. This is important to support the chain-approach to
parsing.
- The parsing functions (`<|`, `<|?` etc) are used to extract the values from
the input `JSON`. If they succeed the value is correctly typed, otherwise
it is `.None`.
- These extracted values are applied in turn to the curried `create` function.
The order of the curried function and the parsing chain must therefore match.
- If at any point a parsing function fails, the repeated application of the
__apply__ function means that the model object will not be formed.

This approach actually gets us quite close to the functionality we desire. Once
you've ensured that your model object conforms to the `JSONDecodable` protocol,
parsing the incoming JSON structure becomes a one-liner:

{% highlight swift %}
let repos: [Repo]? = (JSONValue.parse <^> json) >>- decodeArray
{% endhighlight %}

Once again, this line isn't overly self-explanatory (welcome to functional
programming). The output will be an array of `Repo` objects - as expected. The
first clause (`JSON.parse <^> json`) takes the output of the
`NSJSONSerializer` and converts it into the `JSON` structure used by Argo.
This is then 'fed-in' to the `decodeArray` function, which maps over an array
and attempts to convert each `JSON` within to the type specified in the
signature (here - `Repo`). The `>>-` operator is flatmap, and is used here to
cope with any `.None` inputs that might appear in the output of the initial
conversion.

This approach required a large amount of explanation - it appears very alien to
our procedural eyes. However, I suggest that it presents a very elegant
solution - certainly one which is close to the desired "automatic mapping to
model objects" set out at the beginning of this article.

Something that was skipped over slightly in this explanation is the ability to
add additional value converters without difficulty. The parsing of values
automatically does type conversion where it can, but if you want to support
additional types, it's as easy as ensuring that that type also conforms to the
`JSONDecodable` protocol. This is demonstrated in the playground example with
`NSURL`.

## Conclusion


This has been a reasonably comprehensive review of what's currently possible
with Swift, and a look at some of the great libraries that have been built on
top of the new language. It hasn't gone in to great details about the theory
behind the parsing options, but it should have given you enough info to assist
in your decision on what approach to take, and to help you once you have done
that.

It should be noted that not one of the options presented actually attains what
we set out to achieve - i.e. that we could automatically parse a JSON data
structure into the model objects in our data layer. Argo got by far the closest,
with the additional restriction being that we had to provide our own `decode`
functions to extract our model objects from the JSON data structure. This isn't
an entirely bad thing - even in our best case scenario we'd expect that we'd
have cases that needed special attention. And the great thing about Argo is that
using the functional operators and patterns meant that this code was succinct.
It isn't, however, necessarily very easy to get your head around at first. I
suggest that this is because the new functional operators and ideas are still
new to us - they appear alien. Once you've got your head around the parsing
chain pattern then I think the Argo approach is both easy to comprehend and
reason about - certainly more so than the mountain of optional tests we saw at
the beginning of this article.

If Swift were to add functionality for reflection/introspection then the `decode`
method present in Argo could be replaced with a sensible default. This would
likely work for most cases (i.e. where property names match up with field names
in the JSON), and customizations could still be provided in the existing manner.
At this point I'll be happy to say that JSON parsing in Swift has finally become
a non-issue and the world can stop blogging about it. Maybe at that stage it'll
be time to argue about IoC containers instead?

Don't forget that you can get hold of a workspace containing a set of playground
that demonstrate all the code that has been introduced here today. It's
available on GitHub at
[github.com/sammyd/SwiftJSONShootout](https://github.com/sammyd/SwiftJSONShootout).
The dependencies are managed by Carthage, but are checked in to ensure
compatibility. You will probably have to build each of the frameworks in order
for the playgrounds to pick them up. The code has all been tested with Swift 1.2
in Xcode 6.3β2.

If you've enjoyed reading about this topic in Swift then maybe you'd be
interested in reading some of the other things I've written about other iOS
topics. In fact, you might be interested in a book about iOS 8, written to help
you get your head around all the important new technologies. To grab your free
copy, head on over to the ShinobiControls site at 
[shinobicontrols.com/iOS8](http://shinobicontrols.com/iOS8).

sam
























