---
author: jphillpotts
title: Adventures with Scala Macros - Part 4
tags:
  - Scala
  - Web Services
  - blog
categories:
  - Tech
layout: default_post
source: site
summary: "In the final article in the series, we take the RESTful API we've created and integrate it with MongoDB for persistence using the Salat library."
oldlink: "http://www.scottlogic.com/blog/2013/06/17/scala-macros-part-4.html"
disqus-id: /2013/06/17/scala-macros-part-4.html
---


In <a href="{{site.baseurl}}{% post_url jphillpotts/2013-06-05-scala-macros-part-1 %}">the</a>
<a href="{{site.baseurl}}{% post_url jphillpotts/2013-06-06-scala-macros-part-2 %}">previous</a>
<a href="{{site.baseurl}}{% post_url jphillpotts/2013-06-07-scala-macros-part-3 %}">articles</a> I 
built up a macro that generates a RESTful API from a case class model in a Play 
application. We now want to add a database to this API - in 
<a href="{% post_url jphillpotts/2013-06-07-scala-macros-part-3 %}">part 3</a> we used a simple
map-based in memory data store, which wouldn't really be that useful in the real world.

Step up [MongoDB](http://www.mongodb.org/), a Scala library for interacting with it, 
[Salat](https://github.com/novus/salat) (which uses 
[Casbah](https://github.com/mongodb/casbah/) under the hood), and a Play plugin for 
making the integration with our Play application easier, 
[Play-Salat](https://github.com/leon/play-salat). After following the install 
instructions, I've configured the play application to connect to Mongo: 

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=application.conf"> </script>

We'll use Play-Salat's example Salat Context, and then we'll create a set of traits that
can be applied to the companion objects for our case classes. However, before we do that
we need to change the case classes to use the Casbah `ObjectId` for their identifiers, so
`Author` becomes:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=Author.scala"> </script>

However, when you try and compile this, Play now gets upset because it doesn't know how
to turn an `ObjectId` into JSON. A quick read of the 
[documentation](http://www.playframework.com/documentation/2.1.1/ScalaJson) and we see
that we need to include an implicit `Format[ObjectId]` to do the conversion to/from JSON.
We can implement this as follows:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=objectid-format.scala"> </script>

However, we want this value to be available in the implicit scope in the middle of our
macro that creates the formatter using the Play JSON macro, so how can we do that? We'll
look at a way using the macro itself. The way you might do this if you weren't writing
a macro is put the implicit value in an object, and then `import myObject._` to get the
value into scope wherever we use it. Well, we can easily define a class that can be 
instantiated to form such an object:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=ObjectIdFormat.scala"> </script>

Now we need to tell the macro what class it needs to use to get the implicit values -
which we can use a type parameter for:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=type-param-macro-use.scala"> </script>

Which would be declared on the the macro:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=type-param-macro.scala"> </script>

By declaring the `T` on the implementation of the macro as `c.WeakTypeTag`, we can use
it within the macro to get at the actual class that is being used as a type parameter
using the `implicitly` function:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=type-param-class.scala"> </script>

This gives us the `ClassSymbol` for the type parameter, which we can then use in a
`Ident` to get at the class's constructor, define a value for it, and then import all
its values:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=import-implicits.scala"> </script>

This is basically defining a value as the result of calling the no-argument 
constructor on the class from the type parameter. The result looks like this:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=show-import-implicits.scala"> </script>

So now our Play application compiles again. Let's now move on to creating the Mongo
DAOs. First off, we need an abstract class for our companion objects to extend. From
the Salat docs, we can see that the class needs to extend `ModelCompanion` for type
parameter T, and needs an implicit `Manifest[T]`. The `SalatDAO` requires that `T` 
extends `AnyRef`, so we'll add a bound for the type parameter. We can then create a 
`dao` value that is created using a `mongoCollection`. All we need then is an 
abstract `collectionName` to use for each class's collection:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=MongoDb.scala"> </script>

Now we can create Mongo traits for the CRUD operations. Let's start with `Read`:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=MongoRead.scala"> </script>

This is pretty simple - a template value is defined for the dao (that will be 
supplied by the `MongoDb` abstract class), and an `Option` for the object is found 
using the id. Let's do another one - `Delete` is slightly more complicated, as we
want to only delete if a record is found - a simple `match` expression should do
the trick:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=MongoDelete.scala"> </script>

Now let's look at `Write`. We're need to take an object of type `T`, find the 
corresponding record, and update its state to that provided. To find the record we
need the ID, but the object we have is of type `T <: AnyRef`, so we don't have
access to its ID. Simple enough - we introduced the `WithId` abstract class in the
<a href="{{site.baseurl}}{% post_url jphillpotts/2013-06-07-scala-macros-part-3 %}">last article</a> -
we can update it to use `ObjectId`, and make sure the type parameter is bound to
extend `AnyRef`:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=WithId.scala"> </script>
 
Now we can use this in the `MongoWrite` trait to get the id:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=MongoWrite.scala"> </script>

I'm sure you've got the hang of these traits now - they're pretty simple. Here's
the rest of those that we need:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=other-traits.scala"> </script>

Finally, we add the new traits to the companion objects, adding just the ones we want
for each case class:

<script src="https://gist.github.com/mrpotes/9bc896e985ae0744524a.js?file=Book.scala"> </script>

So that's it - a RESTful API backed by MongoDB with the minimum of code using Scala 
def macros. I hope you've found this introduction interesting, and if you would like
to browse the source code, please head over to 
[Github](https://github.com/mrpotes/playful-rest).















































