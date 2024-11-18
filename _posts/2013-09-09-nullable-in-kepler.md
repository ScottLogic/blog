---
title: Eclipse Kepler and @Nullable
date: 2013-09-09 00:00:00 Z
categories:
- Tech
tags:
- Eclipse
- blog
id: 161553
author: aaylett
image: aaylett/assets/featured/eclipse.jpg
layout: default_post
oldlink: http://www.scottlogic.com/blog/2013/09/09/nullable-in-kepler.html
disqus-id: "/2013/09/09/nullable-in-kepler.html"
summary: When Eclipse Juno came out last year, I was excited to see some support for `@Nullable` annotations.  I didn't get very far with them at the time, though, as the implementation was quite strict.  With the release of Kepler though, it's much easer to make productive use of `@Nullable` to help avoid errors.
---

When Eclipse Juno came out last year, I was excited to see some support for
`@Nullable` annotations.  I didn't get very far with them at the time, though,
as the implementation was quite strict.  With the release of Kepler though,
it's much easer to make productive use of `@Nullable` to help avoid errors.

What is @Nullable?
==================

`@Nullable` annotations allow you to mark parameters as allowing (or otherwise)
null values, enabling compile-time checking.  The default, as I'm sure you're
aware, is that every parameter and field may contain a `null` value, so for
safety's sake, you've got to be careful about verifying that values aren't
`null`.  Different environments use different annotations, but
[JSR-305](https://code.google.com/p/jsr-305/) exists to provide a standard set
and at least Eclipse and IntelliJ are able to be configured to use whichever
set of annotations you choose.  I'm going to use the JSR-305 annotations for
this post, which are `@Nonnull` and `@Nullable`.

You can apply `@Nonnull` (and `@Nullable`) to methods, to document their
return value, and to parameters:

{% highlight java %}
@Nonnull
String doubleString(@Nullable String input) {
  if (input == null) {
    return "Null Input!";
  }
  return input + input;
}
{% endhighlight %}

That's a bit of a pointless function, especially its behaviour on `null`
input, but it serves as an example.

Java defaults to allowing null values, but that's not very useful for static
analysis as we don't really want to litter our code by annotating everything
`@Nonnull`.  Tooling can help, by supporting an annotation to change the
default within its scope.  JSR-305 supplies `@ParametersAreNonnullByDefault`,
which can be applied at the class, package or method level.

This lets us construct pure functions that are null-safe, and Eclipse Helios
was perfectly capable of null-checking such functions.  Things get more
interesting when we have to interact with fields and libraries.

 @Nullable Fields
================

For a field to be `@Nonnull`, we must ensure that it is never assigned a
`null` value and that it is initialised to a non-`Null` value at construction.
Juno didn't support marking fields as `@Nonnull`, as the compiler didn't have
enough information to verify the condition will not be violated.  In Kepler,
the Eclipse compiler has been enhanced to support enough global data, so it's
possible to apply `@Nonnull` to fields sensibly.  There is a small wrinkle
when combining this feature with dependency injection, though: the compiler
can't see the injector, so direct injection and bean-style injection are out.
You can still use constructor injection, though, which I'd recommend in any
case.

Another interesting oddity is that the compiler doesn't yet have enough
intelligence to perform dataflow analysis on objects visible outside the local
scope, so this code will fail to compile:

{% highlight java %}
class Thing {
  @Nullable
  private String thingString = "value";

  ...

  @Nonnull
  String getThingString() {
    if (thingString != null) {
      return thingString;
    }
    return "Thing String is null";
  }
}
{% endhighlight %}

Even if we did fix the compiler to recognise this pattern, there may still be
issues around race conditions, and recognising locking patterns is almost
certainly doomed to failure.  The workaround is to copy the value into a local
variable before using it.

Library Functions
=================

One of the nice things about working in Java is that you're not constrained to
using code that you've written yourself.  Unfortunately for the sanity of
people using JSR-305, most of the libraries out there (and the whole of the
standard library) aren't written with `@Nullable` in mind.  Java allows null
values by default, so every function from every library that doesn't annotate
is assumed to be potentially null.

I'm a big fan of Google's [Guava](https://github.com/google/guava),
which provides lots of very useful helper libraries (some of which wind up
getting implemented in subsequent Java releases).  One which sees ubiquitous
use on my projects is the `Preconditions` library, which allows you to
document preconditions -- basically ways for your code to fall over as fast as
possible if something goes wrong, and for it to be clear that's what's
happening.  Probably the simplest precondition is `checkNotNull(T)`, which
checks that its value is not null.  It doesn't help us here, though, as the
parameter to `checkNotNull` is marked `@Nonnull`!  A moment's thought resolves
the confusion: it makes sense for this function to refuse null values, as its
purpose is to check a precondition: if a null was expected, we should be
handling it, not throwing an error.  That makes this function unsuitable for
laundering values returned from the standard library.  In the end, I wrote a
new function which I call `verifyNotNull`.  It's got the same implementation
as `checkNotNull`, but conveys a different meaning: the suggestion is that the
programmer knows that the value is non-null, but that the compiler has to be
told.  Unfortunately, you've got to verify the result of any standard library
function, which means that using the `@Nullable` and friends is still quite
painful on code that uses standard library functions.

The Future
==========

I don't know whether JSR-305 will ever be implemented in Java itself.  [The
specification](http://www.jcp.org/en/jsr/detail?id=305) has been around since
2006 and was marked dormant in 2012, so it's unlikely to see the light of day
any time soon.  That doesn't mean that it's completely unusable, though -- as
I've explained, it's possible to make use of it in your own code, with some
difficulties.  It's made much easier by Guava supporting the annotations.
What I'd really like to see is some way of attaching annotations to existing
libraries, so that we can tell the compiler about functions known to return
non-null values.

Discussion Points
=================

Guava adds `Optional<T>` which lets you specify a present or an absent value.
Is there a meaningful distinction between a nullable value and an optional
one?  Is `Optional<T>` useful in the absence of static null-checking?

JSR-305 isn't widely supported.  How much tooling support do you need before
using a feature like this?  Is it useful to add annotations that won't be
statically verified by the compiler?  What about annotations that are only
verified by your IDE and not by your regular build (or CI server)?
