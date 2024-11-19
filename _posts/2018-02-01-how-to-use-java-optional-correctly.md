---
title: How to use Java Optional correctly
date: 2018-02-01 00:00:00 Z
categories:
- Tech
tags:
- featured
author: bjedrzejewski
summary: Java Optional has been around for a while now. It is a pity that this language
  feature is not used more often by developers. This is a simple demonstration of
  how to use it correctly.
layout: default_post
image: bjedrzejewski/assets/featured/directions.jpg
---

###The Problem with Java Optional

Java `Optional` has been available to Java developers for a while. It is a class that, with a use of generics,
informs the user of a function that an empty (null) value can be returned. It was introduced in Java 8 which was released in 2014.
It is quite surprising that as a feature it did not gain more popularity. The first time I heard about it I thought-
Great, finally we will get rid of NullPointerException from our Java programs... Unfortunately, after working with number
of different Java 8 codebases, I did not see much use of the feature and when I did, it was often awkward and not
practical. Why? Lets look at an example- _"safe division"_ (protecting from the infamous divide by 0):

~~~java
static Optional<Double> safeDivision(double a, double b){
    if(b == 0){
        return Optional.empty();
    } else {
        return Optional.of(a/b);
    }
}
~~~

This looks logical and simple. Now, lets look at a common attempt of using this code. Assume that we need to (for
whatever reason) implement a function that carries out a division 3 times (or chains any 3 operations involving
the use of `Optional`). A common attempt at implementation may look like this:

~~~java
static Optional<Double> divideThreeTimesVeryPoor(double a, double b){
    Optional<Double> result = safeDivision(a, b);
    if(result.isPresent()){
        a = result.get();
    } else {
        return Optional.empty();
    }
    result = safeDivision(a, b);
    if(result.isPresent()){
        a = result.get();
    } else {
        return Optional.empty();
    }
    return safeDivision(a, b);
}
~~~

This looks horrible! All these if-else statements and multiple returns... Surely we can do better? Lets clean
this up a little:

~~~java
static Optional<Double> divideThreeTimesPoor(double a, double b){
    Optional<Double> resultOne = safeDivision(a, b);
    if(resultOne.isPresent()){
        Optional<Double> resultTwo = safeDivision(resultOne.get(), b);
        if(resultTwo.isPresent()){
            return safeDivision(resultTwo.get(), b);
        }
    }
    return Optional.empty();
}
~~~

Ok, this is looking better, but still- far from perfect. The need to check with `if(resultOne.isPresent())` feels
very verbose. There must be a better way...

###FlatMap - the way to use Java Optional!

There is a better way! Java `Optional` implements `flatMap`, that introduces a little _functional programming_
into our Java world. This function will take a lambda that would be applied on the result if it is non-empty.
That makes the code much simpler to read and pleasant to write. I think it is much better than
the previous two attempts, but you be the judge:

~~~java
static Optional<Double> divideThreeTimes(double a, double b){
    return safeDivision(a, b)
            .flatMap( x -> safeDivision(x, b))
            .flatMap( x -> safeDivision(x, b));
}
~~~

Next time you think of using `Optional`, or if you have to deal with `Optional`, remember this function!

###Lesson for Java developers

Java is a very established language. Java developers often intuitively go towards the imperative style
of programming, sometimes not realising that as the language becomes more _functional_ (at least since Java 8),
there are more tools at our disposal! Lets spend some time learning this new tools and make our Java as good as it
can be.

The code is available in [this github project](https://github.com/bjedrzejewski/JavaOptionalExample).

This blog post was inspired by a talk about functional programming in Java gave by my friend Cesar Tron-Lozai
([follow him on twitter](https://twitter.com/cesarTronLozai)).
