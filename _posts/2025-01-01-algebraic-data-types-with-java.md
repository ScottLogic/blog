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

 Building modern applications means managing complexity.   For years, Java developers have grappled with modelling representations of complex data and relationships in a clean, maintainable way.  More traditional Object-Oriented programming techniques provide many tools, but sometimes, it can feel that we are forcing data into structures that don't quite fit.
 Algebraic Data Types (ADTs), a powerful concept from functional programming that's making waves in the Java world, offering an elegant solution in the programmers arsenal.

## What are Algebraic Data Types (ADT)?

Algebraic data types (ADTs) are a way to structure data in functional programming languages. They define a mechanism to create composite data types by combining other simpler types. They allow developers to model complex data structures using simpler building blocks, much like building with LEGOs.  Think of them as custom, compound data types you design for your specific needs.
ADTs are prevalent in functional programming due to their ability to enhance code safety, readability, and maintainability in a structured and type-safe manner.

## Why do we need them and what kind of problems to they help solve?

### Readable
ADTs make code more readable by explicitly defining the structure and possible values of complex data. This makes it easier to understand and reason about the code, leading to improved maintainability.
### Enforce Constraints
ADTs use the type system to enforce constraints on the data. The compiler can detect errors at compile time, preventing runtime issues that might arise from invalid data structures or operations.
### Remove boilerplate
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


- These represent a combination of data, where a type holds values of several other types simultaneously. Think of it as an "AND" relationship. A Point might be a product type consisting of an x coordinate and a y coordinate.

- Defines values
- Logical AND operator
- Product types bundle two or more arbitrary types together such that T=A and B and C.
- The product is the cartesian product of all their components

In code, we may see this as Tuples, POJOs or Records.
In Set theory this is the cartesian product

``` (Bool * Bool) ```

``` 2 * 2 = 4 ```


## Sum
These represent a choice between different types, where a value can be one of several possible types, but only one at a time. It's an "or" relationship. A Shape might be a sum type, as it could be a Circle or a Square or a Triangle.

- Sum types are built with the '+' operator and combine types with OR as in T = A or B or C.
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


## A Historical Perspective
The concept of ADTs traces back to the early days of functional programming languages like ML and Hope in the 1970s. They were then popularized by languages like Haskell, which uses them as a fundamental building block.


Let's take a quick tour of how ADTs (or their approximations) have been handled in different languages:

  - `C`: C lacks built-in support for ADTs but can simulate by using structs for product types and unions (combined with an enum for type tracking) for a rudimentary form of sum types.
    The tagged union (also called a disjoint union) is a data structure used to hold a value that can take on several different, but fixed types. Only one of the types can be in use at any one time, and a tag field explicitly indicates which one is in use. Here the tag is a value that indicates the variant of the enum stored in the union.  However, unions are notoriously unsafe, as they don't enforce type checking at compile time.
      ~~~ c
        union vals {
          char ch;
          int nt;
        };
    
        struct tagUnion {
          char tag;
          vals val;
        };
      ~~~
  - `Haskell`: Haskell a functional language elegantly expresses ADTs with its data keyword. Haskell's type system is specifically designed to support the creation and manipulation of ADTs.

     ~~~ haskell
    data Shape = Circle Float | Rectangle Float Float
     ~~~
    This defines Shape as a sum type that can be either a Circle with a radius (Float) or a Rectangle with width and height (Float).

  - `Scala`: Scala uses case classes for product types and sealed traits with case classes/objects for sum types. This provides a robust and type-safe way to define ADTs.
    ~~~ scala
    sealed trait Shape
      case class Circle(radius: Double) extends Shape
      case class Rectangle(width: Double, height: Double) extends Shape
    ~~~

  - `Java` (Pre-Java 17): Historically, Java relied on class hierarchies and the Visitor pattern to mimic sum types. This approach was verbose, requiring a lot of boilerplate code and was prone to errors if not carefully implemented. Product types were typically represented by classes with member variables.




## ADTs in Java

Java's records and sealed interfaces provide an elegant mechanism for implementing ADTs. 


- Records, introduced in Java 14, offer a concise syntax for defining immutable data carriers. Providing `nominal` types and components with `human readable` names.  

- Sealed interfaces, a feature introduced in Java 17, allows classes and interfaces to have more control over their permitted subtypes. We achieve precise data modelling as `sealed` hierarchies of immutable records.  This enables the compiler to know all possible subtypes at compile time, a crucial requirement for safe sum types.


- Pattern matching is a powerful feature that enhances Java's instanceof operator and switch expressions/statements. It allows developers to concisely and safely extract data from objects based on their structure. This capability streamlines type checking and casting, leading to more readable and less error-prone code.
  The evolution of pattern matching in Java is noteworthy. Initially introduced in Java 16 to enhance the instanceof operator (JEP 394), it was later extended to switch expressions and statements in Java 17 (JEP 406)9. This expansion broadened the applicability of pattern matching, enabling more expressive and safer code constructs.

Restricting the possible implementations of a type, enables exhaustive pattern matching and making invalid states unrepresentable.  
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
For the Sums of Products to work we have to commit to the subtypes, which is a form of tight coupling.  This works if we are sure the subtypes are unlikely to change. 
We trade some future flexibility for an exhaustive list of subtypes that allows better reasoning about shapes especially when it comes to pattern matching   




### Advantages over the Visitor Pattern
Traditionally, Java developers used the Visitor pattern to handle different types within a hierarchy. However, this approach has several drawbacks:
- Verbosity: The Visitor pattern requires a lot of boilerplate code, with separate visitor interfaces and classes for each operation.
- Openness to Extension: Adding a new type to the hierarchy requires modifying the visitor interface and all its implementations, violating the Open/Closed Principle.
- Lack of Exhaustiveness Checking: The compiler cannot guarantee that all possible types are handled, leading to potential runtime errors.



~~~ java 

public sealed interface Shape permits Circle, Rectangle {
    double area();
    double perimeter();
}

public record Circle(double radius) implements Shape {
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
    @Override
    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}

public record Rectangle(double width, double height) implements Shape {
    @Override
    public double area() {
        return width * height;
    }
    @Override
    public double perimeter() {
        return 2 * (width + height);
    }
}

public class Shapes {
    public static void printShapeInfo(Shape shape) {
        switch (shape) {
            case Circle c -> System.out.println("Circle with radius: " + c.radius() + ", area: " + c.area() + ", perimeter: " + c.perimeter());
            case Rectangle r -> System.out.println("Rectangle with width: " + r.width() + ", height: " + r.height() + ", area: " + r.area() + ", perimeter: " + r.perimeter());
        }
    }
    public static Shape scaleShape(Shape shape, double scaleFactor) {
        return switch (shape) {
            case Circle c -> new Circle(c.radius() * scaleFactor);
            case Rectangle r -> new Rectangle(r.width() * scaleFactor, r.height() * scaleFactor);
        };
    }
}
~~~
Explanation:
1. Shape is a sealed interface, allowing only Circle and Rectangle to implement it.
2. Circle and Rectangle are records, concisely defining the data they hold.
3. Shapes demonstrates how to use pattern matching with switch to handle different Shape types and perform operations like calculating area, perimeter or scaling. The compiler ensures that all possible Shape types are covered in the switch.






References:

- [Where does the name "algebraic data type" come from?](https://blog.poisson.chat/posts/2024-07-26-adt-history.html)