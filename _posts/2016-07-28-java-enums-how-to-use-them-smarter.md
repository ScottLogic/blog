---
title: Java Enums - how to use them smarter
date: 2016-07-28 00:00:00 Z
categories:
- Tech
author: bjedrzejewski
summary: 'A short introduction to Java enum capabilities followed by concrete examples of good use. How enums help with implementing lazy loaded singleton, following open/closed principle and using strategy pattern. '
layout: default_post
---

Java enums are very powerful and important part of the Java language. Even though they can do so much, it is very common
to see them either being used incorrectly or not used at all. In this blog post I want to remind you what Java enums can
do and show some of the usage patterns that don’t get enough attention.

## What are Java enums?

An enumerated type in Java is a type whose values consist of a fixed set of constants. This sounds quite theoretical,
so let’s try with an informal way of describing them. In Java, enumerated types are kinds of classes which have predefined
set of instances. This is quite different to C# where enums are a much simpler type. In Java enums can have constructors,
methods, fields… They really are like classes, with only a few specific differences:

- They extend [java.lang.Enum](http://docs.oracle.com/javase/8/docs/api/java/lang/Enum.html)
- They have fixed set of instances
- They can be used in switch statements
- They can’t be extended
- They have minor differences that won’t be important for the usages mentioned here unless explicitly stated

With this reminder of how similar enums are to classes, it should be clear that they can be used for more than simply
enumerating things.

## Enums are great as Singletons

Using Enums in Java it is very easy to implement a lazy loading Singleton:

~~~ java
public enum Singleton {
    INSTANCE;
    private Singleton() {
        //This is called the first time this enum is initialised
        System.out.println("I am initialised");
    }
}
~~~

As you can see, this provides a very simple and correct implementation of the singleton pattern. Also, since this is an
enum, it does not have to be a single instance. There could be precisely two instances etc.

## Enums can replace switch statements

This is one of my favourite uses of enums and one that is often overlooked. It is often the case that someone uses enum
for selecting different behaviour. It is common to see a code like this:

~~~ java
public static boolean isTransactionComplete(Transaction transaction){
    switch(transaction.getTransactionState()){
        case COMPLETE:
            return true;
        case PENDING:
            return true;
        case REJECTED:
            return false;
        default:
            return true;
    }
}
~~~

with a `TransactionState` enum like this:

~~~ java
public enum TransactionState {
    COMPLETE, REJECTED, PENDING
}
~~~

This is ok, but what if the same method (with the same business logic) is needed somewhere else? You can always move the
method inside the enum and have it constructed like this:

~~~ java
public enum TransactionState {

    COMPLETE, REJECTED, PENDING

    public boolean isTransactionComplete(){
        switch(this){
            case COMPLETE:
                return true;
            case PENDING:
                return true;
            case REJECTED:
                return false;
            default:
                return true;
        }
    }
}
~~~

This at least keeps the logic together with the definition of the enum, so it is all in one place (encapsulation). However, if the enum
gets large and complicated (never through our fault!) it is easy to introduce bugs. Let’s add
another state- `AWAITING_APPROVAL` which is not _transactionComplete_. If someone overlooks changing the
`isTransactionComplete` method, a new bug is introduced. This can be prevented by introducing some type-safety. Java
enums can declare abstract methods which have to be implemented by specific instances. Let’s introduce `isTransactionComplete`
as an abstract method and refactor this enum as follows:

~~~ java
public enum TransactionState {

    COMPLETE {
        @Override
        public boolean isTransactionComplete() {
            return true;
        }
    }, REJECTED {
        @Override
        public boolean isTransactionComplete() {
            return true;
        }
    }, PENDING {
        @Override
        public boolean isTransactionComplete() {
            return false;
        }
    }, AWAITING_APPROVAL {
        @Override
        public boolean isTransactionComplete() {
            return false;
        }
    };

    public abstract boolean isTransactionComplete();
}
~~~

This adds a few more brackets, but no new instance can be added without explicitly stating what the implementation of
`isTransactionComplete` method should be. I worked on a project where we inherited code with dozens of enum instances and many
switch statements across the code. If this pattern was followed, it would have been much easier to understand
what is required when adding a new enum instance- compiler would have told us! Good use of enums creates a code that
can help developers extend it, without changing any implemented methods. This is called the [open/closed principle](https://en.wikipedia.org/wiki/Open/closed_principle).

## Enums with interfaces can provide extensibility

I have learned this trick from Effective Java (which is featured in my [Recommended Reading for Java Developers](http://blog.scottlogic.com/2016/05/21/recommended-reading-for-java-developers.html))
and it shows how to elegantly overcome one of the enum limitations. As mentioned in the beginning of this blog post, enums
can’t be extended. Most of the time extending enums is a bad idea, but there are some cases where it does make sense.
Imagine that you are writing a library where you want to provide clients with some list of enums that can be used in your library-
let’s say `MathematicalMean`. At the moment you are using this enum:

~~~ java
public enum MathematicalMean {

    SIMPLE_MEAN {
        @Override
        public double calculate(double[] values) {
            double mean = 1.0;
            for(double d : values) {
                mean += d;
            }
            return mean / values.length;
        }
    }, GEOMETRIC_AVERAGE {
        @Override
        public double calculate(double[] values) {
            double product = 1.0;
            for(double d : values) {
                product = product * d;
            }
            return Math.pow(product, 1.0 / values.length);
        }
    };

    public abstract double calculate(double[] values);

}
~~~

Your library provides a function: `executeAlgorithm(double[] data, MathematicalMean mean)`, this is a [strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern)
in action. If the client wants to use harmonic mean in the algorithm, then he is out of luck- enums can’t be extended. The
way to fix it, is to use an interface rather than an enum- something that is instinctively done when working with
classes. Let’s have a following Interface and Enum provided by the library:

~~~ java
public interface MathematicalMean {
    public abstract double calculate(double[] values);
}
~~~

and the enum:

~~~ java
public enum BasicMean implements MathematicalMean {

    MEAN_AVERAGE {
        @Override
        public double calculate(double[] values) {
            double mean = 0.0;
            for(double d : values) {
                mean += d;
            }
            return mean / values.length;
        }
    }, GEOMETRIC_AVERAGE {
        @Override
        public double calculate(double[] values) {
            double product = 1.0;
            for(double d : values) {
                product = product * d;
            }
            return Math.pow(product, 1.0 / values.length);
        }
    };
}
~~~

Now the client is free to implement its own `AdvancesMean` enum with the `HARMONIC_MEAN` member and the library is still
able to provide implementation for basic mathematical means. For some programmers
this may look like a non-standard case, but it actually comes up frequently in some domains. I have used it when working
on algorithmic library with a requirement for clients to be able to extend the algorithm.
It is useful to know when mixing strategy pattern and enums in general.

## Final Words

Enum in Java is a very powerful construct. There is a lot of attention on the new Java features and what they bring, but
very often we are still under utilising the older set of language features. I think Java enums are one of the greater
strengths of the language and I encourage you to use more of them in your code. Good luck in your implementations!
