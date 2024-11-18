---
title: Adventures with Scala Macros - Part 3
date: 2013-06-07 00:00:00 Z
categories:
- Tech
tags:
- Scala
- Web Services
- blog
author: jphillpotts
layout: default_post
source: site
summary: Taking a macro that can extract path elements from a query string and turning it into a fully fledged RESTful API, backed by an in-memory database.
oldlink: http://www.scottlogic.com/blog/2013/06/07/scala-macros-part-3.html
disqus-id: "/2013/06/07/scala-macros-part-3.html"
---

## A RESTful<a id="footnotebody1" href="#footnote1"><sup>1</sup></a> API

In parts <a href="{{site.baseurl}}{% post_url jphillpotts/2013-06-05-scala-macros-part-1 %}">1</a> and
<a href="{{site.baseurl}}{% post_url jphillpotts/2013-06-06-scala-macros-part-2 %}">2</a> we used a 
macro to generate some regular expressions and match them against a path to extract IDs. 
Now we're going to use that pattern matching to call an API.

First, we'll define some traits for the RESTful actions that the client code can 
add to the companion object of the case class that is the entity being manipulated:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=traits.scala"> </script>

Then to make calling the implementations of these traits a bit more simple, I'm going to
write a supertrait that does the Play work to handle the three basic types of requests:

* Take string and return entity/entities (Read, ReadAll)
* Take entities and return nothing or a simple response (Create, ReplaceAll, Write)
* Take a string and return nothing (Delete, DeleteAll)

The first two of these require transformation of a string to/from JSON - this is done in
Play by using the parse.json parser with the Action, and then validating the body as type
`T` for read, and using Json.toJson on an object of type `T` for write. Each of these
requires a `Format[T]` object in the implicit scope.

The actions that deal with single items will need an id field that can then be not 
provided for the other actions in the same function, `id: Option[String]`. The structure 
for the trait will therefore be:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=request-handler-structure.scala"> </script>

Note that we don't really need to have these different actions grouped together in those
three functions - we could have a function for each - we'll refactor the class later - 
but for the moment it will help us in implementing similar behaviour consistently.

So now we'll go through implementing one of each of the types of requests.

## Reading JSON (and writing data)

By using `Action(parse.json)` to construct our action, the body of the request is now an
instance of `play.api.libs.json.JsValue`, which can then be validated as a type T. This
then returns a `play.api.libs.json.JsResult[T]`, from which we can either get an object
of type T, or a validation error:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=validate-json.scala"> </script>

We know that this trait is a supertrait of the `Create[T]`, so we can now easily
implement the function to handle the `valid` case by casting `this` to an instance of
that trait:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=create-entity.scala"> </script>

We've used two Play `Result` instances here - `Ok` is a standard HTTP 200 response with 
a body to be returned (the id of the new entity), and `InternalServerError` is a 500 
response, that we could customise with a body if we wanted to.

## Writing JSON (and reading data)

This is the inverse of the reading JSON - we use the `play.api.libs.json.Json.toJson`
function to convert an object of type `T` into a `JsValue`:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=entity-to-json.scala"> </script>

This time we're returning either a 200 response with the entity rendered as JSON, or
we're returning a `NotFound` result - a 404 response.

## No Content

In the case of the delete actions, there is no inbound data to convert, and there is
nothing to return either - a successful HTTP status indicates the delete happened - 
so we use the `NoContent` Play result:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=delete-entity.scala"> </script>

We now have enough to complete the `RequestHandler` trait:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=RequestHandler.scala"> </script>

## Modifying the macro to use the API

Now that we have a RESTful Scala API, we need to change our macro to generate calls to it
for the different methods that have been implemented for each entity.

## Finding implemented traits

Previously we've not bothered about what's possible with the case classes we've found in
the classpath of the macro call, but now we only want to generate endpoints for things
that are possible - for example, a read-only entity would only have `Read[T]` and 
`ReadAll[T]` implemented on their companion object.

You'll remember that we were previously finding case classes by looking for compilation
units that match `case ClassDef(mods, _, _, _) => mods.hasFlag(Flag.CASE)`. However, we
now want to check the compilation unit's companion object as well as the class itself, so
we'll need to use the class's `ClassSymbol` and the corresponding `ModuleSymbol` to the
companioned types. The `ClassSymbol` for a class can be found using `c.mirror.staticClass`
with the fully qualified name as the argument.

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=find-matching-classes.scala"> </script>

So that's given us a list of the names of classes that have one of our traits on their
companion object, which is the list of classes we need to generate code for. Next we need
to know exactly what those traits are, so that we can generate calls for the appropriate
HTTP methods. Obviously we can do this by using similar code to that used in the
`isRestApiClass` function above:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=implemented-traits.scala"> </script>

## Matching against the request

Now that we've got a list of what classes have what traits, we can start generating our
AST.

### Static objects

The regex generation hasn't changed from before, but for each class, `T` we now need a
JSON formatter, `Format[T]`. Fortunately, Play provide a macro that can generate you a
formatter for a given case class, so we can use that function:  

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=create-formatters.scala"> </script>

The `selectFullyQualified` function here could probably do with a little explaining - it's
a helper function that turns a fully qualified class or function name into the required
`Select`/`Ident` tree required to use it in the generated code. We then use that function 
to select the function we're going to use, and call it, providing a type argument of the 
case class we're processing. The Play `format[T]` macro function has a problem if you pass 
its type argument without that type being imported in the code that is calling it (i.e.
our generated AST), as it generates code that refers to that type without fully qualifying
it, so we include an import in our generated code.

### Path and method matching

For a RESTful API, we need to match on both the path and the HTTP method (GET, PUT, POST,
DELETE) - the easiest way to do this is using a tuple, so we'll change our macro's method
signature to include a method parameter, and to return a Play `Handler`:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=new-macro-signature.scala"> </script>

Now our case expressions will all be tuples of expected values - requests that are acting
on collections will need to match the collection path, and the other requests will need
to use the regex matching to extract the ID. We can generate a case statement for each of 
the traits that we find on the class's companion object:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=trait-case-statements.scala"> </script>

Similarly, for each trait we know what method we're going to call with what arguments, so
we can have another case statement to generate that:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=trait-call-function.scala"> </script>

And then we can combine the two functions into our case definition:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=tuple-casedef.scala"> </script>

To finish off the changes, we just need to make the `MatchDef` also use a tuple, which is
simple enough:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=matchdef.scala"> </script>

## Testing it out

Now we need a Play application - downloading the latest Play build, and creating a new
application, I've then copied the model for the previous posts, and then we need to use
the macro to generate the REST endpoints. The place to do this is in a `GlobalSettings`
object:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=Global.scala"> </script>

Now to test the macro out we need something to back our RESTful services. For this article
I'm just going to use a simple `Map`-based in-memory data store:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=InMemory.scala"> </script>

Then all we need to do is add this trait to our data model. I've abstracted away the ID 
generation, so we end up with:

<script src="https://gist.github.com/mrpotes/93ffc44db30e32ae5cf6.js?file=model.scala"> </script>

And there we have it - run the Play application, and you've got a working REST service.
In the <a href="{{site.baseurl}}{% post_url jphillpotts/2013-06-17-scala-macros-part-4 %}">next 
article</a> we'll try using something a bit more useful than an in-memory map by
implementing a MongoDB data accessor.

---

Footnote <a id="footnote1" href="#footnotebody1">[1]</a>: The term RESTful often leads to
animated discussion about whether or not that which is being described properly 
implements the principles of REST. To be clear, by 'RESTful' I mean in-the-style-of-REST,
and not necessarily strictly conforming to the principles of REST. Please let me know if
you think there are some improvements I could make.



















































