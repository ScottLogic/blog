---
published: true
author: jporter
layout: default_post
category: Tech
title: 'Toppling the Giant: Kotlin vs. Java'
tags: 'Kotlin, Java'
summary: >-
  Can Kotlin, the latest language to join the JVM, supersede its predecessor
  Java? Let's compare the two languages that are currently battling for
  supremacy in the world of Android.
image: jporter/assets/kotlin-logo.png
---
## Introduction

Released in February 2016, Kotlin is an open source language initially developed by JetBrains and named after Kotlin Island which is off the west coast of St Petersburg in Russia. Kotlin was initially designed to join the ranks of the JVM languages but has quickly expanded to other platforms; in 2017 version 1.2 was released which enabled developers to transpile Kotlin code to JavaScript. As a result of this, Kotlin is interoperable with Java when written for the JVM or Android, and - with a little difficulty - JavaScript too. Due to the similarities with Java, the language is easy (and thus cheap) to learn, especially given Intellij IDEA’s automatic Java to Kotlin converter which runs automatically when you copy-paste Java code into the editor. As you can see, IntelliJ IDEA has great support for Kotlin, which is extremely beneficial given that Android Studio is built on top of the IDE, thus making Kotlin a first-class citizen in the world of Android development.

As you are reading this blog post I would recommend trying out the examples here, and you will see first hand the advantages and disadvantages of the language. The first half of this post is a discussion of some of the key features of Kotlin that make it stand out. The second half is a discussion of some of the disadvantages of using Kotlin instead of Java.

![Kotlin Logo]({{site.baseurl}}/jporter/assets/kotlin-logo.png)

## Features of Kotlin

### Null-Safety
Arguably the best feature of Kotlin is its null-safety.

In 1965, Tony Hoare, developer of ALGOL W and the Quick Sort algorithm, unleashed the infamous null reference upon the world. Forty-four years later, he described his invention as a billion dollar mistake, due to the innumerable problems caused by this design flaw. Kotlin solves this issue by using a type system that differentiates between nullable references and non-nullable references.

For example:

~~~kotlin
var foo: String = "Hello World!"
foo = null  // compilation error

var bar: String? = "This is nullable"
bar = null  // okay
~~~

This results in a number of language features designed to convert between nullable and non-nullable reference types. My favourite of these is the “Elvis” operator. In this example, `foo` is a nullable string (`String?`) and therefore cannot be directly assigned to `bar`, which is a non-nullable string. Thus the Elvis operator is needed to provide a default value for `bar` which will be assigned if `foo` is null.

~~~kotlin
var foo: String? = "This is nullable"
var bar: String = foo ?: "default string"
~~~

Kotlin also has a safe call operator, to avoid methods being called on objects with a null reference. In this example, `bar` is a nullable `Int` which will only receive a value if `foo` is non-null. If `foo` is null then anything after the safe call operator `?.` will be disregarded.

~~~kotlin
var foo: String? = "This is nullable"
var bar: Int? = foo?.length   // bar is set to 16

foo = null
bar = foo?.length             // foo.length is never called, and bar is set to null
~~~

The one exception to this in-built null-safety is when a Java library or class is used within a Kotlin class. Unless the Java library has been designed in a defensive manner with null-safety in mind, such as using the annotations provided by the `java.util.Optional` package, this null-safety in Kotlin is lost too.

### Brevity - When to Switch
In Java, and most modern languages, there is a “switch” statement. Kotlin is different in that it has a “when” expression. Syntactically, this expression is more concise than Java’s “switch”. However, there is a functionality difference in that Kotlin’s “when” block is not a statement but an expression. This means that there is a value returned from the expression which can be assigned to a variable or returned from a function call.

~~~java
public class Calculator {
    public static double calculate (double a, String op, double b) throws Exception {
        switch (op) {
            case "plus":
                return a+b;
            case "minus":
                return a-b;
            case "div":
                return a/b;
            case "times":
                return a*b;
            default:
                throw new Exception();
        }
    }
}
~~~

As you can see, Kotlin reduces a lot of the boilerplate involved in writing a switch/when block.

~~~kotlin
fun calculate(a: Double, op: String, b: Double): Double = when (op) {
    "plus" -> a + b
    "minus" -> a - b
    "div" -> a / b
    "times" -> a * b
    else -> throw Exception()
}
~~~

### Brevity - Data Classes vs. Boilerplate
To write a class in Java can be arduous. IDEs have improved this process by auto-generating much of the boilerplate involved but fundamentally Java is overly verbose when it comes to classes designed to store data. Kotlin represents a vast improvement in this area as a typical 49 line class can be reduced to one line, as shown in this example. Every Kotlin object will automatically generate the relevant getters and setters for its properties, but a data class additionally generates the `equals()`, `hashCode()` and `toString()` methods such that any two instances of the same data class with the same field data will be "equal". This is comparable to the `@Data` Lombok annotation that can be used in Java; the difference is that Kotlin has this language feature built-in.

~~~java
public class Person {
    private String name;
    private String email;
    private int age;

    public Person(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public int getAge() {
        return age;
    }

    @Override
    public String toString() {
        return name + " - " + email + " - " + age;
    }

    @Override
    public int hashCode() {
        int result = 17;
        result = 31 * result + name.hashCode();
        result = 31 * result + email.hashCode();
        result = 31 * result + age;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj != null && obj.getClass() == this.getClass()) {
            Person castObj = (Person) obj;

            if (this.name.equals(castObj.getName())) return false;
            if (this.email.equals(castObj.getEmail())) return false;
            if (this.age != castObj.getAge()) return false;
        }
        return false;
    }
}
~~~

As you can see, without using any libraries, Kotlin drastically reduces the boilerplate involved in writing a data class.

~~~kotlin
data class Person(val name: String, val email: String, val age: Int)
~~~

### Extension Functions
Although Kotlin is heavily based on Java, it does have some language features that are inspired by other sources. Inspired by C#, extension functions allow the developer to add “missing” functionality to classes. Here is an example:

~~~kotlin
fun String.toGreeting(): String = "Hello World!"

fun main() {
    val foo = "A string"
    val bar = foo.toGreeting()    // "Hello World!"
}
~~~

### Hybrid Paradigms
Kotlin supports both object-oriented and functional paradigms. While confusing at first for the Java developer, this approach is versatile and allows the development team to design an architecture suitable for their application rather than having the language dictate this. In the following example both `foo()` and `bar()` return “Hello World!”, however `foo()` is not declared within a class.

~~~kotlin
fun foo(): String = "Hello World!"

class MyClass {
    fun bar(): String = "Hello World!"
}
~~~

## Disadvantages of Kotlin vs. Java
Syntactically, Kotlin is a simplified and optimised version of Java. As mentioned in the introduction, it is relatively easy for a Java developer to learn, and has a low barrier to entry for developers in general. However, there are some disadvantages of Kotlin, which are discussed here.

### Lack of Ternary Operator
Unlike Java, Kotlin lacks a ternary operator. This is because `if` is an expression and returns a value, so performs the function of the ternary operator.

~~~kotlin
val foo = if (bar == 1) getMessage() else "Hello World!"
~~~

Whereas in Java, this is prettier to write.

~~~java
String foo = bar == 1 ? getMessage() : "Hello World!";
~~~

While the functionality of Java is replicated in Kotlin in a more generalised way, the syntactic sugar of the ternary operator definitely makes this aspect of Java more pleasant to work with than Kotlin.

### Relatively New Language
While arguably Kotlin could be considered an improvement on Java in most regards, Java does have one significant advantage: community support. Due to its long history, Java has a wealth of great examples and documentation which the developer can draw upon when writing code. Kotlin is lagging behind in this area, but the introduction of Kotlin as an official Android language has helped in this area.

### Advantage or Disadvantage (Up for Debate): No Checked Exceptions
Kotlin does not enforce catching exceptions like Java does. Depending on your attitudes towards defensive programming and boilerplate code this could be an advantage or drawback of Kotlin. While it reduces the amount of boilerplate code that needs to be written it does open the door to uncaught exceptions which would not be possible in Java.

### No implicit widening conversions
In Java, widening primitive conversions are specific conversions on primitive types to “wider” types, such as `byte` to `int`, in a way that means that no or minimal information is lost. In Kotlin, the conversion from a `Byte` to an `Int` must be explicit through the `Byte.toInt()` method. This boilerplate is uncharacteristic of Kotlin, but has perhaps been included to enforce defensive programming practices. Depending on a particular team’s approach to defensive programming, this could be considered an advantage or disadvantage.

## Conclusion
Kotlin seems to be a codification of Java best practices, with a few features from other languages thrown in for good measure. As such, it is a powerful and expressive language that solves many of the common problems Java developers face. You might even be tempted to call Kotlin “Java++”. With Kotlin support for Android the language has found a natural home in mobile development but there is also a lot of potential for using Kotlin outside of this domain. These reasons are potentially why Evernote, AirBnB, Uber and Trello use Kotlin for their Android apps, and why I argue that Kotlin is a definite improvement over Java; you should consider trying it out!

Thank you for reading my perspective on Kotlin. If you are interested in reading about Android, the main application of Kotlin, check out my blog post [A Developer's Intro to Android](https://blog.scottlogic.com/2018/12/05/a-developers-intro-to-android.html).
