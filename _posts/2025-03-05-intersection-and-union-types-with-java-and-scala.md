---
title: Intersection and Union types with Java and Scala
date: 2025-03-05 00:00:00 Z
categories:
- Tech
tags:
- Java, Scala
author: magnussmith
summary: In this post we will see  how Intersection types help us better model type
  constraints promoting reuse and how Union types increase code flexibility.  We will
  compare and contrast approaches and how to use in the latest Java and Scala.
image: magnussmith/assets/java.jpg
---

![intersection_union.webp]({{site.baseurl}}/magnussmith/assets/intersection_union.webp)


This is the third post in a series exploring types and type systems.   Previous posts have looked at

- [Algebraic Data Types with Java]({{site.baseurl}}/2025/01/20/algebraic-data-types-with-java.html)

- [Variance, Phantom and Existential types in Java and Scala]({{site.baseurl}}/2025/02/17/variance-in-java-and-scala.html)

- [Functors and Monads with Java and Scala]({{site.baseurl}}/2025/03/31/functors-monads-with-java-and-scala.html)

## Intersection and Union Types with Java and Scala

One of the difficult things for modern programming languages to get right is around providing flexibility when it comes to expressing complex relationships. As languages evolve, they need to give us tools to model the nuances of real world problems more accurately in our code.
Modern software systems are much more complex than in years gone by, and developers need type systems that can accurately express intricate relationships. **Intersection types** and **union types** provide this expressiveness by allowing programmers to specify more precise type constraints.
We will see how these powerful features of the type system, while having been present in some form, are now becoming increasingly refined in languages like Java and Scala, providing benefits that help us write more expressive, safer, and ultimately more maintainable code.
In this post, we'll dive deep into these concepts, exploring how they're implemented in the latest versions of **Java 23** and **Scala 3.6**. We'll see practical examples, compare and contrast the approaches, identify where they shine, and where they fall short we will discuss how to bridge the gaps. 

### A brief historical timeline.

Before we go into detail about their application, let's take a brief look at their historical context.

- **1930s-1960s**: The theoretical foundations for intersection and union types can be traced back to type theory and mathematical logic, specifically in areas dealing with type polymorphism and subtyping. Thinkers like Haskell Curry, Alonzo Church, and later researchers in the field of type systems have laid the groundwork for understanding types not just as mathematical sets, but as structured entities with relationships.
- **1970s-1980s**: Early type systems (ML, Lisp) lacked explicit intersection/union types. C and Pascal introduced unions although in the case of C unions are not considered type safe because they allow accessing memory as different types without verifying the original type of the data stored, leading to potential data corruption and undefined behavior.
- **1990s**: Functional languages (ML, OCaml) formalised **[Abstract Data Types (ADTs)]({{site.baseurl}}/2025/01/20/algebraic-data-types-with-java.html)**, enabling safer unions.
- **2000s**: **Scala** (2004) introduced explicit intersection type with `with` syntax.
- **2010**s: [**TypeScript**](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html) (2012) embraced and popularised union (`A | B`) and intersection (`A & B`) types in mainstream development as essential features for adding static typing on top of dynamic foundations. 
- **2020s**: TypeScript refinements,[Scala 3](https://dotty.epfl.ch/docs/reference/new-types/union-types.html) fully embraces native union type with `|` and intersections using `&`.


### **Intersection Types: "And" Logic for Types**

Think of intersection types as the "AND" operator for types. An intersection type `A & B` means "something that is *both* type A *and* type B". This is incredibly useful when you want to express that a value must possess the characteristics of multiple types simultaneously.

**Scala 3: Native Intersection Types (`&`)**

Scala 3 gives us direct syntax for intersection types using the `&` operator.

~~~~ scala
trait Resettable {
  def reset(): Unit
}

trait Configurable {
  def configure(settings: Map[String, Any]): Unit
}

class Component extends Resettable with Configurable {
  override def reset(): Unit = println("Resetting component (Scala)")

  override def configure(settings: Map[String, Any]): Unit =
    println(s"Configuring with $settings (Scala)")
}

def setup(component: Resettable & Configurable): Unit = {
  component.configure(Map("initial" -> true))
  component.reset()
  println("Component set up and reset (Scala)")
}

@main def main(): Unit = {
  setup(new Component())
}

~~~~

~~~~text
Configuring with Map(initial -> true) (Scala)
Resetting component (Scala)
Component set up and reset (Scala)
~~~~

Here, `Resettable & Configurable` is a distinct type. Any value of this type must implement *both* Resettable and Configurable. This provides strong compile-time guarantees.

**Java : Interface Intersection**

Java doesn't have a dedicated `&` operator for types *yet* for general type intersections in the same way as Scala. However, it has long supported **interface intersection within type bounds**. This capability becomes incredibly relevant when thinking about intersection types.

~~~~ java
interface Resettable { void reset(); }
interface Configurable { void configure(Map<String, Object> settings); }

class Component implements Resettable, Configurable {
  @Override public void reset() { 
    System.out.println("Resetting component (Java)"); 
  }
  @Override public void configure(Map<String, Object> settings) { 
    System.out.println("Configuring with " + settings + " (Java)"); 
  }
}

class IntersectionExample {
  public static void main(String[] args) {
    setup(new Component());
  }

  // Using interface intersection in a generic type bound
  static <T extends Resettable & Configurable> void setup(T component) {
    component.configure(Map.of("initial", true));
    component.reset();
    System.out.println("Component set up and reset (Java)");
  }
}
~~~~

~~~~text
Configuring with {initial=true} (Java)
Resetting component (Java)
Component set up and reset (Java)
~~~~

**Practical Application: Mix-in Behaviours and Capabilities**

Intersection types shine when you want to compose behaviours or capabilities into a single entity. Imagine a system where components can be both:

- **Closable:** Needs to release resources.
- **Loggable:** Should emit log messages.

With intersection types, you can define a function that operates on anything that is *both* Closable *and* Loggable:

**Scala:**

~~~~ scala
trait Closable { def close(): Unit }
trait Loggable { def log(message: String): Unit }

def manageResource(resource: Closable & Loggable): Unit = {
  resource.log("Resource operation started(Scala).")
  try {
    // ... perform operations ...
  } finally {
    resource.log("Closing resource (Scala).")
    resource.close()
  }
}
~~~~

**Java:**

~~~~ java
interface Closable { void close(); }
interface Loggable { void log(String message); }

<T extends Closable & Loggable> void manageResourceJava(T resource) {
  resource.log("Resource operation started (Java).");
  try {
    // ... perform operations ...
  } finally {
    resource.log("Closing resource (Java).");
    resource.close();
  }
}
~~~~

This ensures that manageResource (and manageResourceJava) only accepts objects that guarantee *both* closing and logging capabilities, enhancing safety and clarity.

**The Diamond Problem? Not with Intersections!**

A classic problem in multiple inheritance is the "diamond problem." This arises when a class inherits from two classes that share a common ancestor, and both parent classes override a method from that ancestor. Which version of the method should the inheriting class use?

Intersection types inherently sidestep the diamond problem. When you create an intersection type like `Resettable & Configurable`, you are *not* creating a new inheritance hierarchy. Instead, you are defining a *constraint*. In Java any type that satisfies `Resettable & Configurable` must simply *implement* both `Resettable` and `Configurable`. There's no shared ancestor in the traditional inheritance sense, and thus no ambiguity about which method to call.  In essence, intersection types are about *composition* of capabilities, not hierarchical inheritance, which naturally avoids the diamond problem scenarios.
In Scala where traits include the method definition then the right implementation of a method that appears in both traits is resolved through a process called `linearisation`.  When a method is called, Scala searches this linearised order from right to left to find the first implementation of the method. So in the case of Scala order matters for intersection types.




### **Union Types: "Or" Logic for Types**

Now, let's switch gears to **union types**. These are about "OR" logic. A union type `A | B` means "something that is *either* type A *or* type B (or both)". This is perfect for situations where a variable or parameter can hold values of different possible types.

**Scala 3: Native Union Types (`|`)**

Scala 3, again, provides elegant, direct syntax for union types using the `| `operator.

~~~~ scala
def handleInput(input: String | Int): Unit = {
 input match {
  case s: String => println(s"Received string input (Scala): $s")
  case i: Int  => println(s"Received integer input (Scala): $i")
 }
}

handleInput("Hello Scala")
handleInput(123)
~~~~

Here, `String | Int` clearly expresses that handleInput can accept either a String or an Int. The match expression then safely handles each possibility, demonstrating the power of union types in pattern matching and branching logic.

**Java: Simulating Union Types with Sealed Classes/Interfaces - Pattern Matching to the Rescue!**

Let's update the Java union type simulation, using pattern matching for instanceof to simplify the handleInputJava method and make it more readable:

Java

~~~~ java
sealed interface InputType {}
record StringInput(String value) implements InputType {}
record IntInput(Integer value) implements InputType {}

class SimulatedUnionExample {
  static void handleInputJava(InputType input) {
    var result =
        switch (input) {
          case StringInput stringInput -> "Received string input (Java): " + stringInput.value();
          case IntInput intInput -> "Received int input (Java): " + intInput.value();
        };  // Compiler knows all subtypes are handled due to 'sealed'.
    System.out.println(result);
  }
  public static void main(String[] args) {
    handleInputJava(new StringInput("Hello Java"));
    handleInputJava(new IntInput(456));
  }
}
~~~~


While the underlying structure with sealed interfaces remains, the handleInputJava method has now become cleaner thanks to pattern matching checks. This has made working with simulated union types in Java significantly less verbose compared to older versions.

**Practical Application: Representing Success or Failure, Variant Data Structures**

Union types are invaluable for representing situations where a function can return different kinds of results, or a variable can hold different types of data. Common use cases include:

- **Error Handling:** Representing a result that is either a success or an error.
- **Variant Data Structures:** Creating data structures that can hold values of different types (think tagged unions).
- **Flexible Input Handling:** As seen in the handleInput example.

**Scala: Result Type**

~~~~ scala
enum Result[+Success, +Error] {
  case Success(value: Success) extends Result[Success, Nothing]
  case Failure(error: Error) extends Result[Nothing, Error]
}

import Result._

def divide(a: Int, b: Int): Result[Int, String] = {
  if (b == 0) Failure("Division by zero!")
  else Success(a / b)
}

def evaluate(result: Result[Int, String]): Unit = {
  result match {
    case Success(value) => println(s"Result: $value")
    case Failure(error) => println(s"Error: $error")
  }
}

@main def main(): Unit = {
  evaluate(divide(10, 2))
  evaluate(divide(5, 0))
}
~~~~

**Java: Simulated Result Type with Sealed Interface**

~~~~ java
sealed interface ResultJava<S, E> permits Success, Failure {}

record Success<S, E>(S value) implements ResultJava<S, E> {}
record Failure<S, E>(E error) implements ResultJava<S, E> {}

class ErrorHandlingJavaExample {
  
  public static void main(String[] args) {
    System.out.println(evaluate(divideJava(10, 2)));
    System.out.println(evaluate(divideJava(5, 0)));
  }
  
  static ResultJava<Integer, String> divideJava(int a, int b) {
    if (b == 0) return failure("Division by zero! (Java)");
    else return success(a / b);
  }

  static <S, E> String evaluate(ResultJava<S, E> result) {
    return switch (result) {
      case Success<S, E> success -> "Result (Java): " + success.value();
      case Failure<S, E> failure -> "Error (Java): " + failure.error();
    };
  }

  static <S, E> ResultJava<S, E> success(S value) {
    return new Success<>(value);
  }

  static <S, E> ResultJava<S, E> failure(E error) {
    return new Failure<>(error);
  }
}
~~~~

### **Gaps and Simulation: Java's Union Type Story**

As we’ve discussed, Java simulates union types through sealed hierarchies, while Scala provides native union types. Let's delve deeper into the implications and differences:


**Exhaustiveness Checking in Pattern Matching: Java vs. Scala**


When dealing with unions, both simulated and real, it is very likely that we are going to undertake pattern matching.
A key advantage of Java's simulation of union types using sealed interfaces is compile-time exhaustiveness checking when used with pattern matching.
Because sealed hierarchies have a fixed, known set of subtypes, the Java compiler can verify that your pattern matching logic handles all possible cases. If you miss a case in a switch expression over a sealed type, the Java compiler will issue a compile-time error.  This dramatically increases safety and helps prevent bugs where you forget to handle a possible variant of your union type.

**Scala 3.6's Union Types and Non-Exhaustive Matching (by Default)**

In contrast, while Scala 3.6's pattern matching on native union types is very flexible and powerful, it does not, by default, enforce exhaustiveness in the same way.  If you pattern match on a union type and miss a case, the Scala compiler might issue a _warning_ depending on settings, but it's not the same level of enforced exhaustiveness as Java provides with sealed types.

###### A couple of practical steps to help mitigate this issue are:

- Wildcard case _: Adding a `case _ =>` // Fallback logic clause in your match expression can silence warnings, but it essentially means you're handling the "missing" cases with a general fallback, not with specific type-safe branches.
- Compiler Settings (`-Wnon-exhaustive-match`): You can configure the Scala compiler to treat exhaustiveness warnings as errors, increasing the strictness of checking.




**Scala's Type Parameter Flexibility: The Power of Structural Types**

One key difference is that Scala's intersection and union types are inherently more flexible in terms of type parameters. In Scala, you can directly use intersection or union types without needing to introduce a generic type parameter. Consider our setup example in Scala:

~~~~ scala
def setup(component: Resettable & Configurable): Unit = { ... }
~~~~

Here, `Resettable & Configurable` is a type in its own right, directly usable. We don't *need* a generic type parameter to express this constraint. Scala’s type system, being more structurally focused, infers and understands the necessary capabilities directly from the intersection type itself.

In contrast, Java *requires* a generic type parameter to express interface intersections in methods like setup:

~~~~ java
<T extends Resettable & Configurable> void setup(T component) { ... }
~~~~ 

While Java's approach with generics is powerful, it's a slightly different idiom. Scala’s approach can feel more direct and less ceremonious, especially in scenarios where you are dealing with existing types and want to express combined or alternative capabilities without needing to introduce type variables.

**Adaptability in Existing Codebases: Sealed Interfaces vs. Ad Hoc Polymorphism**

Another critical difference lies in how easily these approaches adapt to *existing* codebases.

- **Scala's Ad Hoc Polymorphism (Traits and `&`, `|`):** Scala’s approach using traits and intersection/union types is often more *ad hoc* in nature. You can easily combine existing traits or classes using `&` and `|` to create new types on the fly, without needing to modify the original type definitions themselves significantly. This is a form of *structural typing* at play - you are defining types based on the *structure* (the methods and capabilities) they possess, rather than requiring explicit hierarchical relationships beforehand. This can be a significant advantage when integrating with legacy code or libraries not designed with union/intersection types in mind.
- **Java's Sealed Interfaces and Classes: More Carefully Planned, Less Ad Hoc:** Sealed interfaces (and classes) in Java, while powerful for modeling sum types, are inherently more *planned*. To effectively use sealed interfaces to simulate union types, you typically need to design your type hierarchies upfront and ensure that all possible "union members" implement the sealed interface. While this is good when designing completely new, well-structured APIs, it is *less flexible* when trying to retroactively apply union type logic to existing, unrelated classes in a large, mature codebase. Refactoring existing code to fit a sealed hierarchy can be a significant undertaking compared to Scala's more composable approach.

**Scala Union Type Inference: Explicit is Often Better**

While Scala excels at type inference, it's important to note that Scala 3 **does not automatically infer union types** in all situations. If an expression *can* return multiple types, but you don't explicitly declare a union type, Scala will often infer the most general type possible, which might be `Any`.

Consider this Scala example:

~~~~ scala
def maybeStringOrInt(flag: Boolean): String | Int = { // Explicit union type!
 if (flag) "Hello" else 123
}

val explicitUnion = maybeStringOrInt(true) // Type is correctly inferred as String | Int

def problematicFunction(flag: Boolean) = { // No explicit union type
 if (flag) "Hello" else 123
}

val inferredAny = problematicFunction(true) // Type is inferred as Any!
println(s"Type of inferredAny is: ${inferredAny.getClass}") // Prints: Type of inferredAny is: class java.lang.String

def explicitlyAny: Any = { // Explicitly returning Any
  if (true) "hello" else 123
}
val stillAny = explicitlyAny // Type is Any
~~~~

In maybeStringOrInt, we explicitly declare the return type as `String | Int`. Scala correctly infers this union type. However, in problematicFunction, without an explicit return type, Scala infers Any. This is because Scala prioritises type safety and might not "guess" a union type where a broader, encompassing type (like `Any`) is also valid.

**Key Takeaway:** For clarity and type safety, especially when dealing with functions that can return values of different types, it's best practice in Scala to **explicitly define union return types**. This avoids unexpected Any inferences and ensures the compiler enforces the intended type constraints.

### **Null Handling and Union Types**

How do null values play with union types, especially considering Scala 3's Explicit Nulls feature?

- **Scala 3 with Explicit Nulls:** Scala 3's Explicit Nulls feature significantly refines null handling. With it enabled (which is best practice for new projects), `Null` becomes a distinct, non-nullable type. This means:

- `String | Int` is a union of *non-nullable* String and Int. A value of this type *cannot* be null by default.
- To *explicitly* allow null, you must include Null in the union type: `String | Int | Null`. This clearly signals that null is a possible value.

This explicit approach enhances type safety and makes the presence of potentially null values much more deliberate and visible in the type signature. Scala's Option type remains the idiomatic way to represent optional values (absence of a value) in general, but explicit null unions provide a different, more specific tool for situations where null is a legitimate, albeit perhaps less preferred, possibility.

- **Java:** In Java, `null` remains implicitly part of every reference type. When simulating union types with sealed interfaces, if any of the "union members" are reference types, then a variable of the sealed interface type *can* be null. Java's Optional is still the standard and recommended way to handle potential absence of values and avoid direct null usage as much as possible. Java's approach does not offer the same level of explicit control over nullability within union-like structures as Scala 3's Explicit Nulls.


**Conclusion: Embracing Type Flexibility with Intersection and Union types**

Intersection and union types are powerful tools that enhance type system expressiveness and code safety. Scala 3's direct syntax, structural flexibility, and explicit null handling provide a very advanced and adaptable approach to union and intersection types. Java 23, utilising interface intersection and sealed hierarchies (now with improved pattern matching and **compile-time exhaustiveness checking**), offers a robust and structured way to simulate these concepts. This is particularly beneficial for designing well-defined APIs within its more inheritance-centric type system. However, we should be mindful of  increased flexibility, nuances of null handling, the explicit nature of union type inference in Scala, and the different levels of exhaustiveness checking in pattern matching. Understanding these language-specific characteristics will enable you to effectively utilise intersection and union types in both Java and Scala, choosing the approach best suited to your needs and constraints.

### Next time

Next time we will look start to look at the more functional side of the type system and examining how [__Functors__ and __Monads__ can make software more robust]({{site.baseurl}}/2025/03/31/functors-monads-with-java-and-scala.html).
