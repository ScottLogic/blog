title: Algebraic Data Types with Java
date: 2025-01-01 00:00:00 Z
categories:
- Tech
  tags:
- Java
  author: magnussmith
  summary: In this post I explore the power of Algebraic Data Types in Java. 
  image: magnussmith/assets/java.jpg
---

## Introduction

## What are Algebraic Data Types (ADT)?

ADTs provide a way to define composite data types by combining other types in a structured and type-safe manner. They allow developers to model complex data structures using simpler building blocks, much like building with LEGOs.  Think of them as custom, compound data types you design for your specific needs.

## Why do we need them and what kind of problems to they help solve?

ADTs make code more readable by explicitly defining the structure and possible values of complex data. This makes it easier to understand and reason about the code, leading to improved maintainability.

ADTs use the type system to enforce constraints on the data. The compiler can detect errors at compile time, preventing runtime issues that might arise from invalid data structures or operations.

Compared to using classes or structs alone, ADTs can often reduce the amount of boilerplate code needed to define and manipulate complex data. For example, pattern matching with ADTs often eliminates the need for lengthy if-else chains or switch statements.

ADTs can accurately model data that has a limited set of possible states or variations. This is particularly useful for representing things like:

- State machines: Each state can be a variant of an ADT.
- Abstract Syntax Trees (ASTs): Used in compilers and interpreters to represent the structure of code.
- Error Handling: An ADT can represent either a successful result or a specific error.

In essence, ADTs help by allowing us to model the application domain by defining custom data types that are tailor-made for a specific application domain and enforced by the type system. 
They provide a powerful tool for tackling complexity in software engineering.


## Why Algebra?

In algebraic data types (ADTs), algebra refers to the operations used to combine types to create ADTs, and the relationships between those operations and the types:
- `Objects`: The types that make up the algebra
- `Operations`: The ways to combine types to create new types
- `Laws`: The relationships between the types and the operations


In ADTs the algebra consists of just two operators '+' and 'x'   

## Product

- Represents combination. Types that are  built with the 'x' operator and combine types with AND.  A Product type bundles two or more arbitrary types together such that T=A and B and C.
- Defines values
- Logical AND operator
- The product is the cartesian product of all their components

In code, we may see this as Tuples, POJOs or Records.
In Set theory this is the cartesian product

``` (Bool * Bool) ```

``` 2 * 2 = 4 ```


## Sum

- Represents alternation. Types are built with the '+' operator and combine types with OR as in T = A or B or C.
- Defines variants
- Logical OR operator
- The sum is the (union) of the value sets of the alternatives

Traditionally more common in functional languages like Haskel as a data type or in Scala as a sealed trait of case classes and Java as a sealed interface of records.
A very simple version in Java is an Enum type. Enums cannot have additional data associated with them once instantiated. 

An important property of ADTs is that they can be sealed or closed. That means that their definition contains all possible cases and no further cases can exist. This allows the compiler is able to exhaustively verify all the alternatives.

Below Status is a disjunction, the relation of three distinct alternatives 

``` Under Review | Accepted | Rejected ``` 

``` Status + Boolean ```

``` 3 + 2 = 5 ```




We can further combine Product and Sum as they follow the same distributive law of numerical algebra
```
(a * b + a * c) <=> a * (b +c)
```



```

DnsRecord(
     AValue(ttl, name, ipv4)
   | AaaaValue(ttl, name, ipv6)
   | CnameValue(ttl, name, alias)
   | TxtValue(ttl, name, name)
)


DnsRecord(ttl, name,
     AValue(ipv4)
   | AaaaValue(ipv6)
   | CnameValue(alias)
   | TxtValue(value)
)

```

At the type level we can change ordering in using the same commutative law we would in algebra
```
(a * b) <=> (b * a)
(a + b) <=> (b + a)
```
similar with associativity
```
(a + b) + c <=> a + (b + c)
(a * b) * c <=> a * (b * c)
```



## A brief detour into the history of algebraic data types

Before we get into how we can exploit ADTs in Java lets take a little detour into the history od ADTs

ADTs are not a new idea.  As we have seen Java has been able to simulate them to some extent since enums were introduced in 1.1 (date?), but the ideas actually go back much further.

In the 1960's a kind of ADT known as a tagged union which later became part of the C language.  The tagged union (also called a disjoint union) is a data structure used to hold a value that could take on several different, but fixed types. Only one of the types can be in use at any one time, and a tag field explicitly indicates which one is in use. Here the tag is a value that indicates the variant of the enum stored in the union.
This allows a structure that is the Sum of different types.

By the mid 1970s,  In Standard ML, ADTs are defined using the datatype keyword. They allow you to create new types as a combination of constructors, each potentially holding values of other types.  

Essentially, datatype lets you build custom, compound types with named constructors and pattern matching lets you effectively use them. 


## ADTs in Java

Java's records and sealed interfaces provide an elegant mechanism for implementing ADTs. Records, introduced in Java 14, offer a concise syntax for defining immutable data classes. Providing `nominal` types and components with `human readable` names.  

Sealed interfaces, a feature introduced in Java 17, allows classes and interfaces to have more control over their permitted subtypes. We achieve precise data modelling as `sealed` hierarchies of immutable records.  Restricting the possible implementations of a type, enables exhaustive pattern matching and makes invalid states unrepresentable.

This is particularly useful for general domain modeling with type safety.



### Why not just use enums?
~~~ java
enum Task = {
  NotStarted,
  Started,
  Completed,
  Cancelled;
}

sealed interface TaskStatus{
  record NotStarted(...) implements TaskStatus
  record Started(...) implements TaskStatus
  record Completed(...) implements TaskStatus
  record Cancelled(...) implements TaskStatus
}
~~~
It is possible to associate data with an enum constant, such as the mass and radius of the planet

~~~ java 
enum Planet {
  MERCURY (3.303e+23, 2.4397e6),
  VENUS (4.869e+24, 6.0518e6),
  EARTH (5.976e+24, 6.37814e6),
...
}
~~~
sealed records work at a higher level.  Where enums enumerate a fixed list of `instances` sealed records enumerate a fixed list of `kinds of instances`

~~~ java 

sealed interface Celestial {
    record Planet(String name, double mass, double radius) implements Celestial {}
    record Star(String name, double mass, double temperature) implements Celestial {}
    record Comet(String name, double period) implements Celestial {}
}

~~~

Unlike enums records allow us to attach arbitrary attributes to each of the enumerated states.  We are no longer restricted to fixed constants  

In the Celestial example we see a Sum of Products. This is a useful technique for modelling complex domains in a flexible but type-safe manner.
For thw Sums of Products to work we have to commit to the subtypes, which is a form of tight coupling.  This works if we are sure the subtypes are unlikely to change. 
We trade some future flexibility for an exhaustive list of subtypes that allows better reasoning about shapes especially when it comes to pattern matching   


### Pattern Matching

Pattern matching is a powerful feature that enhances Java's instanceof operator and switch expressions/statements. It allows developers to concisely and safely extract data from objects based on their structure. This capability streamlines type checking and casting, leading to more readable and less error-prone code.
The evolution of pattern matching in Java is noteworthy. Initially introduced in Java 16 to enhance the instanceof operator (JEP 394), it was later extended to switch expressions and statements in Java 17 (JEP 406)9. This expansion broadened the applicability of pattern matching, enabling more expressive and safer code constructs.



A key advantage of pattern matching in switch statements is the increased safety it provides. By requiring that pattern switch statements cover all possible input values, it helps prevent common errors arising from incomplete case handling10.
The combination of ADTs and pattern matching is particularly powerful, as it allows for exhaustive and type-safe handling of different data variants within a sealed hierarchy. This synergy simplifies code and reduces the risk of runtime errors.





References:

- [Where does the name "algebraic data type" come from?](https://blog.poisson.chat/posts/2024-07-26-adt-history.html)