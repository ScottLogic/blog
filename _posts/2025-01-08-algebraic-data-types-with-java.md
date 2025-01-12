---
title: Algebraic Data Types and Pattern Matching with Java
date: 2025-01-08 00:00:00 Z
categories:
- Tech
tags:
- Java
author: magnussmith
summary: In this post we explore the power of Algebraic Data Types(ADT) with Pattern Matching in Java. We look at how they help us model complex business domains and how using them together gives improvements on the traditional Visitor Pattern 
image: magnussmith/assets/java.jpg
---
 <style type="text/css">
  .gist {width:500px !important;}
  .gist-file
  .gist-data {max-height: 500px;max-width: 500px;}
</style> 



![Algebraic Data Types and Pattern Matchinch with Java]({{site.baseurl}}/magnussmith/assets/adt_pattern_matching_java.webp)

# Introduction

When we develop an application, we frequently need to model some aspect of business to describe and solve a business problem. We do this by creating a conceptual representation of the real-world problem that we are trying to solve. This allows us to understand the "domain" where our software operates.

## Domain Modelling

Think of it like creating a blueprint before constructing a building. You identify the key elements, their relationships, and how they interact. The blueprint guides the software design and ensures it accurately reflects the business  problem.

Essentially, Domain Modelling works in four stages:

1. **Identify Key Concepts:** Start by identifying the important concepts, entities, and relationships within the domain.
2. **Create a Model:** Represent these concepts and their relationships using a model such as a class diagram.
3. **Define Attributes and Behaviour:** For each concept, you define its attributes (properties) and behaviour (actions).
4. **Refine the Model:** Now iteratively refine the model based on feedback, further analysis, and discussions with domain experts.

### Relationship to Types and Objects in software:

Domain modelling is closely tied to the concepts of types and objects in object-oriented programming:

* **Types:** The concepts in the domain model often translate directly into types (classes) in our code. For example, the "Book" concept might become a `Book` class.
* **Objects:** Instances of these types represent specific objects in the domain. Each `Book` object would represent a particular book in the library.
* **Attributes:** Attributes in the domain model become properties (fields) of the class.
* **Behaviour:** The behaviour defined in the domain model is implemented as methods in the class.

### Example:

Imagine you're building an e-commerce system. Your domain model might include concepts like "Customer," "Product," "Order," and "Payment." These would translate into classes in your code. Each customer would be represented by a `Customer` object, each product by a `Product` object, and so on.

### Relationship to an Algebra

The relationship between a domain model and an algebra might seem abstract at first, but it's a powerful concept with practical implications in software design, especially when dealing with complex systems.

#### Domain Model as a Foundation:

* **Types as Sets:** In the domain model, each concept (e.g., "Customer," "Product," "Order") can be thought of as a set of possible values. For instance, "Customer" represents the set of all possible customers.
* **Relationships as Functions:** Relationships between concepts can be modeled as functions. For example, an "Order" might have a function `getCustomer()` that maps an order to its corresponding customer.

#### Algebraic Structures:

* **Operations:** An algebra defines operations on these sets. In an e-commerce example, we might have operations like "add product to order," "calculate total price," or "apply discount."
* **Laws and Properties:** These operations adhere to certain laws and properties (like associativity, commutativity, etc.). These laws reflect the business rules and constraints of your domain.

#### Connecting the Pieces:

* **Domain Model Informs the Algebra:** The domain model provides the basis for defining the sets and operations in the algebra. It ensures that the algebra accurately reflects our real-world problem.
* **Algebra Provides Structure:** The algebraic structure helps us reason about the behavior of your system and ensures consistency. For example, the "add product to order" operation might need to be associative (the order in which you add products shouldn't matter).
* **Implementation:** In code, we implement the algebra using classes, methods, and data structures. The algebraic laws guide the implementation and help you avoid inconsistencies.

### Benefits of this Approach:

* **Rigour and Precision:** Using an algebraic approach brings rigour and precision to the domain model. It helps us clearly define the behavior of a system.
* **Testability:** Algebraic laws can be used to create comprehensive test cases, ensuring that your implementation adheres to the domain rules.
* **Maintainability:** A well-defined algebra makes code more modular and easier to maintain. Changes in the domain can be reflected by modifying the algebra and its implementation.

### Example:

Consider a banking system. Your domain model might include concepts like "Account" and "Transaction." We could define an algebra with operations like "deposit," "withdraw," and "transfer." These operations would need to satisfy certain laws, such as:

* **Consistency:** `withdraw(account, amount)` should only succeed if the account has sufficient funds.
* **Associativity:** Multiple deposits or withdrawals should result in the same final balance regardless of the order.

By implementing these algebraic laws in our code, we ensure that the banking system behaves correctly and consistently.




## Algebraic Data Types (ADTs)

Algebraic Data Types (ADTs) are a way to structure data in functional programming languages. They provide a mechanism to create composite data types by combining other simpler types. ADTs help us to model complex data structures using simpler building blocks, much like building with LEGOs. Think of them as custom, compound data types that you design for your specific needs.

ADTs are prevalent in functional programming due to their ability to enhance code safety, readability, and maintainability in a structured and type-safe manner.

### Benefits of using ADTs

### Readability

ADTs make code more readable by explicitly defining the structure and possible values of complex data. This makes it easier to understand and reason about the code, improving maintainability.

### Constraint Enforcement

ADTs leverage the type system to enforce constraints on data. The compiler can detect errors at compile time, preventing runtime issues that might arise from invalid data structures or operations.

### Boilerplate Reduction

Compared to using classes or structs alone, ADTs can often reduce the amount of boilerplate code needed to define and manipulate complex data. For example, pattern matching with ADTs often eliminates the need for lengthy `if-else` chains or `switch` statements.

ADTs accurately model data that has a limited set of possible states or variations. This is particularly useful for representing:

-   **State machines:** Each state can be a variant of an ADT.
-   **Abstract Syntax Trees (ASTs):** Used in compilers and interpreters to represent the structure of code.
-   **Error Handling:** An ADT can represent either a successful result or a specific error.

In essence, ADTs help us model the application domain by defining custom data types that are tailor-made for a specific application and enforced by the type system. They provide a powerful tool for tackling complexity in software engineering.

### Why "Algebraic"?

In the context of Algebraic Data Types (ADTs), "algebra" refers to the operations used to combine types and the relationships between those operations and the types:

-   **Objects:** The types that make up the algebra.
-   **Operations:** The ways to combine types to create new types.
-   **Laws:** The relationships between the types and the operations.

In ADTs, the algebra consists of two primary operators: **x** (`product`) and **+** (`sum`).

## Product Types

Product types represent a combination of data where a type holds values of several other types simultaneously.

-   Think of it as an "AND" relationship.
-   A `Point` might be a product type consisting of an `x` coordinate AND a `y` coordinate.
-   It defines values.
-   Logical AND operator.
-   Product types bundle two or more arbitrary types together such that `T = A AND B AND C`.
-   The product is the [Cartesian product](https://www.ucl.ac.uk/~ucahmto/0005_2021/Ch2.S5.html) of all their components.

In code, we see this as tuples, POJOs, structs, or records. In set theory, this is the Cartesian product.

~~~ java
public record TextStyle(Weight weight, Font font){}
public enum Font { SERIF, SANS_SERIF, MONOSPACE }
public enum Weight { NORMAL, LIGHT, HEAVY }
~~~

This is called a **product** type because the *set of all possible values* is the Cartesian product of the possible values of its components. For example:

In abstract syntax: 

`TextStyle = Weight ⨯ Font`

`6 = 3 x 3`

## Sum Types

Sum types represent a choice between different types, where a value can be one of several possible types, but only one at a time.

-   Think of it as an "OR" relationship.
-   A `Shape` might be a sum type, as it could be a `Circle` OR a `Square` OR a `Triangle`.
-   Defines variants.
-   Logical OR operator.
-   Sum types are built with the '+' operator and combine types with OR, as in `T = A OR B OR C`.
-   The sum is the union of the value sets of the alternatives.

Traditionally, sum types are more common in functional languages like Haskell (as data types) or Scala (as sealed traits of case classes). Java introduced a version with sealed interfaces of records in Java 17. A very simple version in Java is an `enum` type, though enums cannot have additional data associated with them once instantiated.

An important property of ADTs is that they can be sealed or closed. This means that their definition contains all possible cases, and no further cases can exist. This allows the compiler to exhaustively verify all alternatives.

We can define a `Status` as a disjunction, the relation of three distinct alternatives:

~~~ haskell
Under Review | Accepted | Rejected 
~~~
Example: A Status type united with a Boolean type

`Status + Boolean` 

This is a **Sum** because the number of items in the resulting type is the sum of the number of items in each subtype.

`3 + 2 = 5`  




## Combining Product and Sum Types

Product and sum types can be combined, and they follow the distributive law of numerical algebra:

`(a * b + a * c) <=> a * (b +c)`

For example, we could define a DNS Record as a sum type:

~~~ haskell
DnsRecord(
     AValue(ttl, name, ipv4)
   | AaaaValue(ttl, name, ipv6)
   | CnameValue(ttl, name, alias)
   | TxtValue(ttl, name, name)
)
~~~

But we could also refactor it to a product of a product and sums:

~~~ haskell
DnsRecord(ttl, name,
     AValue(ipv4)
   | AaaaValue(ipv6)
   | CnameValue(alias)
   | TxtValue(value)
)
~~~

At the type level we can change ordering in using the same commutative law we would in algebra

Commutativity

`(a * b) <=> (b * a)`
`(a + b) <=> (b + a)`

Associativity

`(a + b) + c <=> a + (b + c)`
`(a * b) * c <=> a * (b * c)`


## A Historical Perspective

The concept of ADTs traces back to the early days of functional programming languages like ML and Hope in the 1970s. They were then popularised by languages like Haskell, which uses them as a fundamental building block.

Let's take a quick tour of how ADTs (or their approximations) have been handled in different languages:

-   **C:** C lacks built-in support for ADTs but can simulate them by using `structs` for product types and `unions` (combined with an `enum` for type tracking) for a rudimentary form of sum types.
    The tagged union (also called a disjoint union) is a data structure used to hold a value that can take on several different, but fixed, types. Only one of the types can be in use at any one time, and a tag field explicitly indicates which one is in use. Here, the tag is a value that indicates the variant of the enum stored in the union. However, unions are notoriously unsafe, as they don't enforce type checking at compile time.

~~~ c
    union vals {
      char ch;
      int nt;
    };
  
    struct tagUnion {
      char tag; // Tag to track the active type
      union vals val;
    };
~~~

- **Haskell**: Haskell a functional language elegantly expresses ADTs with its data keyword. Haskell's type system is specifically designed to support the creation and manipulation of ADTs.

~~~ haskell
  data Shape = Circle Float | Rectangle Float Float
~~~

  This defines Shape as a sum type that can be either a Circle with a radius (Float) or a Rectangle with width and height (Float).

- **Scala**: Scala uses case classes for product types and `sealed traits` with `case classes/objects` for sum types. This provides a robust and type-safe way to define ADTs.

~~~ scala
  sealed trait Shape
    case class Circle(radius: Double) extends Shape
    case class Rectangle(width: Double, height: Double) extends Shape
~~~

- **Java** (Pre-Java 17): Historically, Java relied on class hierarchies and the Visitor pattern to mimic sum types. This approach was verbose, requiring a lot of boilerplate code and was prone to errors if not carefully implemented. Product types were typically represented by classes with member variables.


## ADTs in Java

Java's records and sealed interfaces provide an elegant mechanism for implementing ADTs.

-   **Records:** Introduced in Java 14, records offer a concise syntax for defining immutable data carriers, providing *nominal* types and components with *human-readable* names.
-   **Sealed Interfaces:** Introduced in Java 17, sealed interfaces allow classes and interfaces to have more control over their permitted subtypes. This enables precise data modeling as *sealed* hierarchies of immutable records. The compiler knows all possible subtypes at compile time, a crucial requirement for safe sum types.
-   **Pattern Matching:** Pattern matching is a powerful feature that enhances Java's `instanceof` operator and `switch` expressions/statements. It allows developers to concisely and safely extract data from objects based on their structure. This capability streamlines type checking and casting, leading to more readable and less error-prone code. The evolution of pattern matching in Java is noteworthy. Initially introduced in Java 16 to enhance the `instanceof` operator [JEP 394](https://openjdk.org/jeps/394), it was later extended to `switch` expressions and statements in Java 17 [JEP 406](https://openjdk.org/jeps/496). This expansion broadened the applicability of pattern matching, enabling more expressive and safer code constructs.

Restricting the possible implementations of a type enables exhaustive pattern matching and makes invalid states unrepresentable. This is particularly useful for general domain modeling with type safety.




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

Unlike enums, records allow us to attach arbitrary attributes to each of the enumerated states. We are no longer restricted to fixed constants.

In the Celestial example, we see a `sum of products`. This is a useful technique for modeling complex domains in a flexible but type-safe manner.  For sums of products to work, we have to commit to the subtypes, which is a form of tight coupling. This works well if we are sure the subtypes are unlikely to change. We trade some future flexibility for an exhaustive list of subtypes that allows better reasoning about shapes, especially when it comes to pattern matching.



### Making use of ADTs

Traditionally, Java developers used the Visitor pattern to handle operations on different data types within a hierarchy. However, this approach has several drawbacks, as we will see when we compare using a sum type with Pattern Matching:

### Using Visitor Pattern

<script src="https://gist.github.com/MagnusSmith/1299a2540158de978e7b66a2c1029f87.js"></script>


~~~jshelllanguage
Shapes:
Circle with radius: 5.00, area: 78.54, perimeter: 31.42
Triangle with sides: 3.00, 3.00, 3.00, area: 3.90, perimeter: 9.00
Rectangle with width: 3.00 , height: 5.00, area: 15.00, perimeter: 16.00
Pentagon with side: 5.60, area: 53.95, perimeter: 28.00

Shapes scaled by 2:
Circle with radius: 10.00, area: 314.16, perimeter: 62.83
Triangle with sides: 6.00, 6.00, 6.00, area: 15.59, perimeter: 18.00
Rectangle with width: 6.00 , height: 10.00, area: 60.00, perimeter: 32.00
Pentagon with side: 11.20, area: 215.82, perimeter: 56.00
~~~

#### Explanation:

1. `Shape` is a sealed interface, allowing only permitting `Circle`,` Rectangle`,` Triangle` and `Pentagon` to implement it.

2. `ShapeVisitor<T>` Interface:
    + Defines the visit methods for each shape type.
    + The generic type T allows visitors to return different types of results.

3. accept Method in Shape:
    + Each shape class implements the accept method, which takes a ShapeVisitor and calls the appropriate visit method on the visitor.

4. Concrete Visitors:
    + `AreaCalculator`: Calculates the area of a shape.
    + `PerimeterCalculator`: Calculates the perimeter of a shape.
    + `InfoVisitor`: Generates a string with information about the shape (including area and perimeter).
    + `ScaleVisitor`: Scales a shape by a given factor.

The Visitor pattern heavily relies on polymorphism, specifically double dispatch.
1. **First Dispatch (Dynamic)**: When `accept(visitor)` is called the correct `accept` method is chosen at runtime based upon the actual type of shape. This is standard dynamic polymorphism.
2. **Second Dispatch (Within Visitor**): Inside the `accept` method `this` is now statically known to the concrete shape type (e.g triangle).  Therefore the compiler can statically choose the correct `visit` method in the `Visitor` to call, based upon the type of the current visitor, passed in as an argument to the `accept()` method. 

### Using Pattern Matching

Lets look at the same model with pattern matching

<script src="https://gist.github.com/MagnusSmith/5ea4b7c85a862cfcfbb8dc4b67fc421d.js"></script>


Output:

~~~jshelllanguage
Shapes: [Circle[radius=5.0], Triangle[side1=3.0, side2=3.0, side3=3.0], Rectangle[width=3.0, height=5.0], Pentagon[side=5.6]]
Circle with radius: 5.00, area: 78.54, perimeter: 31.42
Triangle with sides: 3.00, 3.00, 3.00, area: 3.90, perimeter: 9.00
Rectangle with width: 3.00 , height: 5.00, area: 15.00, perimeter: 16.00
Pentagon with side: 5.60, area: 53.95, perimeter: 28.00

Shapes scaled by 2: [Circle[radius=5.0], Triangle[side1=3.0, side2=3.0, side3=3.0], Rectangle[width=3.0, height=5.0], Pentagon[side=5.6]]
Circle with radius: 10.00, area: 314.16, perimeter: 62.83
Triangle with sides: 6.00, 6.00, 6.00, area: 15.59, perimeter: 18.00
Rectangle with width: 6.00 , height: 10.00, area: 60.00, perimeter: 32.00
Pentagon with side: 11.20, area: 215.82, perimeter: 56.00
~~~

#### Explanation:
1. `Shape` is a sealed interface, only permitting `Circle`,` Rectangle`,` Triangle` and `Pentagon` to implement it.
3. `Shapes` demonstrates using pattern matching with switch to handle different Shape types and perform operations like calculating area, perimeter or scaling. The compiler ensures that all possible Shape types are covered in the switch.

### Comparing Pattern Matching with the Visitor Pattern

When we compare pattern matching to the visitor pattern we are actually looking at two different approaches to the [expression problem](https://en.wikipedia.org/wiki/Expression_problem)
The `Expression Problem` in computer science highlights the challenge of extending data structures and operations independently. 

Specifically, it's difficult to:

- **Add new data types**: Without modifying existing code that operates on those data types.
- **Add new operations**: Without modifying existing data types.

#### Visitor Pattern

The visitor pattern is a solution that favours extending operations over extending data types:

- **Adding new operations (Easy)**: Create a new Visitor
- **Adding new data type (Hard)**:  Adding a new type to the hierarchy with the Visitor pattern requires modifying the visitor interface and all its implementations with a new `visit` method, violating the Open/Closed Principle.
- **Verbosity**: The Visitor pattern requires a lot of boilerplate code, with separate visitor interfaces and classes for each operation
- **Exhaustiveness Checking**: The compiler cannot guarantee that all possible types are handled in the Visitor pattern, leading to potential runtime errors.

##### Patten Matching

- **Add new operations (Easy)**:  Add a new pattern matching function
- **Add new data type (Easier)**:  Only update the pattern matching code that needs to deal with the new data type 
- **Verbosity**: ADTs with pattern matching are more concise.
- **Exhaustiveness Checking**: With sealed types and pattern matching, the compiler can perform exhaustiveness checking, ensuring that all cases are handled.

In summary, ADTs, particularly in modern Java with records, sealed interfaces, and pattern matching, offer a more elegant, type-safe, and maintainable approach to modeling complex data and their behavior, compared to traditional techniques like the Visitor pattern.



References:

- [Where does the name "algebraic data type" come from?](https://blog.poisson.chat/posts/2024-07-26-adt-history.html)

  