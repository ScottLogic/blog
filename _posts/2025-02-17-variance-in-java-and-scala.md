---
title: Variance in Generics, Phantom and Existential types with Java and Scala
date: 2025-02-17 00:00:00 Z
categories:
 - Tech
tags:
 - Java, Scala
author: magnussmith
summary: In this post we look at Variance in Generics and how it is handled in Java and Scala.   We consider use-site and declaration-site approaches and the trade offs of erasure. Finally we take a look at Phantom and Existential types and how they can enhance the capabilities of the type system when it comes to modelling. 
image: magnussmith/assets/java.jpg
---

![variance_phantom_existential.webp]({{site.baseurl}}/magnussmith/assets/variance_phantom_existential.webp)

## Variance in Generics

Generics are a fundamental pillar of modern type-safe programming languages. They allow us to write reusable code that can work with different types without sacrificing type safety. But when you dive deeper into the world of generics, you encounter the intriguing concepts of *covariance* and *contravariance*. These concepts, often perceived as complex, are crucial for understanding how type hierarchies and subtyping interact with generic types.

Both Java and Scala support these concepts but implement them differently. In this blog post, we'll investigate what covariance and contravariance mean, how they are used in generics, and how Java and Scala handle them differently.

### What are Covariance and Contravariance? 

Suppose we have a type hierarchy that has a `Dog` as a subtype of `Animal`.

If we have a generic container then should a `Container<Dog>` be considered a subtype of `Container<Animal>` ?

At their core, covariance and contravariance describe how subtyping relationships between types relate to subtyping relationships between *related* types. Let's break that down:

- **Subtyping and the _Substitution Principle_:** A type `A` is a subtype of type `B` if an instance of `A` can be substituted wherever an instance of `B` is expected. For example, in most object-oriented languages, `Integer` is a subtype of `Number`.
- **Related Types:** These are types constructed from other types, like generic types. For example, `List<Integer>` and `List<Number>` are related types, both constructed using the `List` generic type.

Now, let's define the key terms:

- **Covariance:** If `A` is a subtype of `B`, then `Container<A>` is a subtype of `Container<B>`. The subtyping relationship "flows" in the same direction. Think of a `List<Integer>` being usable where a `List<Number>` is expected.
- **Contravariance:** If `A` is a subtype of `B`, then `Container<B>` is a subtype of `Container<A>`. The subtyping relationship is *reversed*. A common example is a function: a function that accepts a `Number` can be used where a function accepting an `Integer` is expected.
- **Invariance:** If `A` is a subtype of `B`, there's *no* subtyping relationship between `Container<A>` and `Container<B>`. They are considered completely unrelated types.

**Visualizing Variance**

Think of it this way (where `->` denotes a subtyping relationship):

- **Covariance:** `Integer -> Number` implies `Container<Integer> -> Container<Number>`
- **Contravariance:** `Integer -> Number` implies `Container<Number> -> Container<Integer>`
- **Invariance:** `Integer -> Number` implies *no relationship* between `Container<Integer> and Container<Number>`

**Generics and Variance: Why Should We Care?**

Variance isn't just an academic exercise. It has practical implications for how we design and use generic classes and interfaces:

- **Type Safety:** Understanding variance helps prevent runtime type errors. Incorrectly assuming covariance or contravariance can lead to situations where you try to put an object of the wrong type into a collection or pass an incompatible argument to a method.
- **Flexibility:** Variance, especially covariance, allows for more flexible and reusable code. You can write methods that operate on collections of a more general type while still accepting collections of more specific types.
- **API Design:** When designing generic APIs, properly specifying variance is crucial for ensuring that your API is both type-safe and usable in a variety of contexts.

### Covariance and Contravariance in Java

**Java: Use-Site Variance with Wildcards**

Java employs **use-site variance**, meaning that variance is specified at the location **where the generic type is *used***, i.e., where you create a variable, pass an argument, or specify a return type using the generic.  In Java, we use wildcards (`? extends T` and `? super T`) in these usage locations to indicate the desired variance.

#### ? extends T (Covariance): 
`List<? extends Number>` means a list of something that extends Number. The `Number` is the upper bound.  You can safely read Number objects from it, but you can't add anything (except null) because the compiler doesn't know the exact type of elements allowed in the list.

#### ? super T (Contravariance):
`List<? super Integer>` means a list that can accept `Integer` or any of its supertypes.  The Integer is the lower bound. You can safely add Integer objects (and any supertypes of `Integer`) to it, but you can only read them as Object because the specific type of the elements isn't known at compile time.

#### T (Invariance):
`List<Number>` means a list that can accept and produce only `Number` objects.

#### What this implies: 
The generic type declaration itself doesn't have inherent variance. The same generic class can be used in a covariant, contravariant, or invariant manner depending on the specific context.

#### Java: Covariance Example `? extends T`

Can read from the more generic type but cannot modify

~~~~ java
// An upper bounded type restricts the collection to essentially read-only

 static void getNotPut(){
   List<? extends Number> numbers = List.of(1,2,3);  
   double dbl = sum(numbers); // Gets the values from the list
   // numbers.add(2.718);   compile-time error cannot put a value in the list
 }
 
 static double sum(Collection<? extends Number> nums) {
    double sum = 0;
    for (Number num : nums) {
      sum += num.doubleValue();
    }
    return sum;
  }
~~~~

#### Java: Contravariance Example `? super T`

Can write to the generic type but reading is limited to Object

~~~~ java
// A lower bounded type restricts the collection to essentially write-only

static putNotGet(){
  List<Object> objs = Arrays.asList(1, "two");
  List<? super Integer> ints = objs;
  ints.add(3); // ok can put a value in the list
  // double dbl2 = sum(ints);   compile-time error.  Can only get objects 
  String s = "";
  for(Object obj : ints){
    s += obj.toString();
   }    // 1two3
}
~~~~

### Java: Invariance

If neither wildcard is used, Java treats generic types as invariant. For instance, `List<Number>` and `List<Integer>` are entirely unrelated types, even if `Integer` is a subtype of `Number`.

#### The Get and Put Principle
Use an `extends` wildcard when you only _get_ values out of a structure, use a `super` wildcard when you only _put_ values in into a structure, and don't use a wildcard when you both _get_ and _put_ 

We can see these used together in the signature of a copy method

~~~~java
public static <T> void copy(List<? super T> destination, List<? extends T> source);
~~~~

#### Java Arrays

In Java an `Array` behaves differently to a `List` in regard to subtyping. Array subtyping is _covariant_, meaning that type `S[]` is considered a subtype of `T[]` whenever `S` is a subtype of `T`.

~~~ java 
  // Covariant Array
  Integer[] integers = new Integer[] {1,2,3};
  Number[] numbers = integers;
  // numbers[1] = 2.718   runtime ArrayStoreException
  
  // Covariant List
  List<Integer> intList = Arrays.asList(1,2,3);
  List<? extends Number> numList = intList;
  // numList.set(2, 2.718);  compile-time error
~~~

In contrast to Arrays, with Lists the problem is detected at compile time not runtime.  The assignment violates the _Get and Put principle_. 

### Covariance and Contravariance in Scala

**Scala: Declaration-Site Variance with Annotations**

Scala takes a different approach.
It supports use-site variance (syntax is similar to Java, just replace `<? extends T>` with `[? <: T]`) and declaration-site variance.
When using _declaration-site variance_ the variance is specified at the location **where the generic type is _declared_**, i.e., in the definition of the generic class or trait. In Scala, we use annotations `+T`  and `-T` in the generic type parameter list of the class or trait definition.

#### +T (Covariance):
`trait List[+A]` means `List[Subtype]` is considered a subtype of `List[Supertype]`.

#### -T (Contravariance):
`trait Function1[-A, +B]` indicates that `Function1` is contravariant in its input type `A` and covariant in its output type `B`.

#### T (Invariance):
`class Array[T]` signifies that Array is invariant in `T`.

#### What this implies: 
The variance becomes an inherent property of the generic type itself. Every instance of that generic type will have the same variance.

#### Scala: Covariance Example `[+T]`

Covariance is expressed with a `+` annotation in the type parameter. This makes the generic type subtype-preserving.

This variance is part of the `Container` type's definition, so any use of `Container` will be covariant.

~~~~ scala
class CovariantContainer[+T](val value: T)

val container1: CovariantContainer[String] = new CovariantContainer("hello")
val container2: CovariantContainer[Any] = container1 // This is allowed due to covariance

processElements(container1)

def processElements(container: CovariantContainer[Any]): Unit = {
  println(container.value)
}
~~~~

#### Scala: Contravariance Example `[-T]`

Contravariance is expressed with a `-` annotation, reversing the subtype relationship.

~~~~ scala
class ContravariantContainer[-T](val consumer: T => Unit)

val container1: ContravariantContainer[Any] = new ContravariantContainer[Any](println)
val container2: ContravariantContainer[String] = container1 // This is allowed due to contravariance

class Comparator[-T] {
  def compare(a: T, b: T): Int = {
    // Comparison logic here
  }
}

val anyComparator: Comparator[Any] = new Comparator[Any]
val stringComparator: Comparator[String] = anyComparator // Allowed due to contravariance

~~~~
Here, Comparator is contravariant because it consumes values of type `T`. A comparator that can compare a type `Any` can also compare `String`.


#### Scala: Invariance Example

~~~scala
class InvariantContainer[T](val value: T)

val container1: InvariantContainer[String] = new InvariantContainer("hello")
// val container2: InvariantContainer[Any] = container1  // This is NOT allowed due to invariance
~~~


By default, Scala’s generic types are invariant, meaning `Container[Animal]` and `Container[Cat]` are unrelated unless explicitly annotated.

### Erasure

Java has been around a long time - it wasn't until Java 5 in 2004 that generics were added. Java has strong guarantees of backwards compatibility, requiring that the new generic code needed to work with older non-generic code. For this to work during compilation, the Java compiler removes (_erases_) the type information associated with generics.
Generic type parameters are replaced with their bounds (usually _Object_ if no bound is specified). So, a `List<String>` becomes just `List` at runtime. As a consequence you can't check the specific type of a generic object at runtime  (e.g. `instanceof List<String>`)

Scala on the other hand was designed with generics in mind from the start, so it didn't have the same backward compatibility constraints. This allowed the language designers to take a different approach to erasure. Scala does use erasure, but it's more nuanced. Some type information is retained at runtime, especially for things like method signatures and when dealing with traits. 
Scala also has a concept of `Type Tags` that can be used to explicitly carry type information to the runtime when needed. This allows you to work around some of the limitations of erasure.


## Phantom Types

A phantom type parameter is a type parameter that is declared in a class or interface definition but **not actually used in the implementation's fields or method signatures.**

It doesn't affect the runtime behaviour of the class, but it can be used by the type system to enforce constraints or provide additional type information at compile time.

Phantom types can be used to achieve a form of "simulated" variance. Even if a language primarily uses declaration-site variance, a phantom type parameter can be used to make an otherwise invariant type parameter behave in a covariant or contravariant manner in certain situations without compromising type safety.



### How Phantom Types Work in Java

In Java, you can create a "phantom type" by:

1. **Declaring a type parameter in a generic class or interface.**
2. **Not using that type parameter anywhere in the fields or method signatures (except maybe in the return type of factory methods).**

Essentially, the type parameter is "present" in the type signature but has no effect on the runtime representation or behaviour of the class. It only exists to provide extra information to the compiler at compile time.


~~~ java 
// Sealed interfaces for resource states
public sealed interface ResourceState permits Readable, Writable {}
public final class Readable implements ResourceState {}
public final class Writable implements ResourceState {}

// Record for the Resource
public record Resource<T extends ResourceState>(String path) {

    // Factory methods for creating tagged Resource instances
    public static Resource<Readable> openForReading(String path) {
        return new Resource<>(path);
    }

    public static Resource<Writable> openForWriting(String path) {
        return new Resource<>(path);
    }
}

public class Main {
    public static void main(String[] args) {
        Resource<Readable> readableResource = Resource.openForReading("my_file.txt");
        Resource<Writable> writableResource = Resource.openForWriting("output.txt");

        // readData(writableResource); // Compile-time error: Expected Resource<Readable>
        readData(readableResource);      // This is allowed

        // writeData(readableResource); // Compile-time error: Expected Resource<Writable>
        writeData(writableResource);     // This is allowed
    }

    static void readData(Resource<Readable> resource) {
        System.out.println("Reading data from: " + resource.path());
    }

    static void writeData(Resource<Writable> resource) {
        System.out.println("Writing data to: " + resource.path());
    }
}
~~~



**Explanation:**

1. **`Resource<T extends ResourceState>`:** The `T` is a phantom type. It's declared but not used to store any data or influence the runtime behaviour of `Resource` objects.
2. **`Readable` and `Writable`:** Are concrete implementations of the ResourceState interface. They don't have any methods but serve as type-level indicators of whether a resource is intended for reading or writing.
3. **Factory Methods:** `openForReading` and `openForWriting` are static factory methods. They create `Resource` objects but "tag" them with the appropriate phantom type (`Readable` or `Writable`).
4. **`readData` and `writeData`:** These methods accept only `Resource<Readable>` and `Resource<Writable>`, respectively. This is where the phantom type enforces constraints at compile time.

#### How it Enforces Constraints

- The compiler uses the phantom type `T` to track the intended use of a `Resource` object.
- `readData` will only accept a `Resource` that has been "tagged" as `Readable` through the `openForReading` factory method.
- `writeData` similarly only accepts a `Resource` tagged as `Writable`.
- This prevents you from accidentally trying to write to a resource that was opened for reading or vice-versa, catching potential errors at compile time.



### Scala Phantom Types example

~~~~ scala
// Marker traits (similar to Java's marker interfaces)
sealed trait Readable
sealed trait Writable

// Resource class with a phantom type parameter
class Resource[T] private (val path: String)

object Resource {
  // Factory methods that "tag" the resource with the phantom type
  def openForReading(path: String): Resource[Readable] = new Resource[Readable](path)
  def openForWriting(path: String): Resource[Writable] = new Resource[Writable](path)
}

def main(args: Array[String]): Unit = {
  val readableResource: Resource[Readable] = Resource.openForReading("my_file.txt")
  val writableResource: Resource[Writable] = Resource.openForWriting("output.txt")

  // readData(writableResource) // Compile-time error: Type mismatch
  readData(readableResource) // This is allowed

  // writeData(readableResource) // Compile-time error: Type mismatch
  writeData(writableResource) // This is allowed

  def readData(resource: Resource[Readable]): Unit = {
    println(s"Reading data from: ${resource.path}")
  }

  def writeData(resource: Resource[Writable]): Unit = {
    println(s"Writing data to: ${resource.path}")
  }
}
~~~~

**Analogy**

Imagine you have a physical folder (the `Resource` object). The folder itself only contains a file path (the `path` field). The phantom type `T` is like a label you stick on the folder:

- A red label (`Readable`) means the folder is intended for reading.
- A blue label (`Writable`) means the folder is intended for writing.

The label doesn't change the contents of the folder, but it tells you (and the compiler) how the folder should be used. The factory methods are like a labeling machine that puts the correct label on a new folder.

### Benefits of Using Phantom Types

- **Enhanced Type Safety:** They allow you to encode additional constraints and information into the type system, preventing certain kinds of errors at compile time.
- **Improved Code Clarity:** Phantom types can make the intended use of a class or interface more explicit in the code.
- **Refactoring Safety:** They can help make refactoring safer by ensuring that type constraints are not accidentally violated.




## Existential Types

Existential types allow us to work with values without knowing their exact type at compile time. They let you define a type in terms of a property or behaviour, without revealing the concrete implementation. This is like defining an interface: you know what operations are supported, but the underlying class that implements those operations remains opaque.  This abstraction helps in writing more modular and maintainable code.

### Existential Types in Scala

- **Abstraction over Type Parameters:** Existential types let you express that a type parameter exists without specifying its concrete type.
- **"There Exists Some Type":** The phrase "for some type" captures the essence of existential types. You're saying that a type parameter has *some* specific type, but you don't need to know or expose what that type is at the use site.

**Scala 2** has direct support for existential types using the `forSome` keyword or the wildcard `_` syntax.  The `forSome` keyword has been dropped in Scala 3.  

**Scala 3** provides two main ways to express existential types.  We can use wildcards (?) or path-dependent types to achieve the same effect.

#### Wildcards `?`

Wildcards (`?`) allow you to express an unknown type while still enforcing type constraints.

~~~~ scala
trait Animal { def name: String }
case class Dog(name: String) extends Animal
case class Cat(name: String) extends Animal

class Container[T](val value: T)

def printUnknown(container: Container[? <: Animal]): Unit = 
  println(container.value.name)

val dogContainer = new Container(Dog("Buddy"))
val catContainer = new Container(Cat("Whiskers"))

printUnknown(dogContainer) // Prints: Buddy
printUnknown(catContainer)  // Prints: Whiskers
~~~~

- Here, `Container[? <: Animal]` means _a container of some unknown subtype of `Animal`_.  
- We lose specific type information, but we still know it must be an `Animal`.

#### Using Path-Dependent Types as an Alternative

Instead of existential types, Scala 3 encourages **path-dependent types**, which let instances define their own concrete type.

~~~~ scala
trait Box {
  type T // Abstract type member
  val value: T
}

val intBox = new Box {
  type T = Int
  val value = 42
}

val stringBox = new Box {
  type T = String
  val value = "Hello"
}

def printBox(box: Box): Unit = println(box.value)

printBox(intBox)  // Prints: 42
printBox(stringBox)  // Prints: Hello

~~~~
- Here, `Box` has an **abstract type member** (`T`) instead of a generic type parameter.
- Each `Box` instance chooses its own concrete type for `T`.

#### Limitations of Existential Types

- **Loss of Type Information:** When you use an existential type, you lose specific type information. You can only access members and methods that are known to exist for the general type, not for the specific hidden type.

### Existential Types in Java

Java does not have direct support for existential types. However, you can **partially simulate** existential types.

#### Simulated with Wildcards

Upper-Bounded Wildcards (`? extends T`): behave similarly to Scala’s wildcards (`? <: T`). They can be used to express a limited form of existential quantification. You're essentially saying, "I don't know the exact type, but it's some type that extends `T`."

~~~~ java
interface Animal {
  String name();
}

record Dog(String name) implements Animal {}
record Cat(String name) implements Animal {}

class ExistentialWildCardExample {
  public static void main(String[] args) {
    List<Dog> dogs = List.of(new Dog("Buddy"));
    List<Cat> cats = List.of(new Cat("Whiskers"));

    List<? extends Animal> animals = dogs; // Equivalent to List[? <: Animal] in Scala
    // animals.addAll(cats); // Compile-time error - addAll is not allowed

    printNames(animals);
    animals = cats; // Allowed because of the wildcard
    
    printNames(animals);
  }

  static void printNames(List<? extends Animal> animals) {
    for (Animal animal : animals) {
      System.out.println(animal.name());
    }
  }
}
~~~~

#### Using Generics with Bounded Types

For more flexibility, Java uses bounded type parameters (`<T extends Animal>`) instead of existential types.

~~~~java
interface Animal {
  String name();
}

record Dog(String name) implements Animal {}
record Cat(String name) implements Animal {}

class Container<T extends Animal> {
  private final T value;

  public Container(T value) { this.value = value; }
  public T getValue() { return value; }
}

class ExistentialBoundedExample {
  public static void printUnknown(Container<? extends Animal> container) {
    System.out.println(container.getValue().name());
  }

  public static void main(String[] args) {
    Container<Dog> dogContainer = new Container<>(new Dog("Buddy"));
    Container<Cat> catContainer = new Container<>(new Cat("Whiskers"));

    printUnknown(dogContainer);  // Prints: Buddy
    printUnknown(catContainer);  // Prints: Whiskers
  }
}
~~~~

#### Limitations of Java's Approach

- **More Limited:** Java's wildcards are less powerful than Scala's existential types. They are primarily useful for covariance and don't fully capture the concept of "for some type."
- **Read-Only (Mostly):** You generally can't add elements to a collection with an upper-bounded wildcard (like `List<? extends Animal>`) because the compiler can't guarantee type safety.
- **No Lower-Bound Counterpart:**  Java has lower bounded wildcards (`? super T`) which are used for contravariance but those are not used to express existential types.

### When to Use Existential Types (or Their Simulation)

- **Heterogeneous Data:** When you need to work with collections or structures that can hold objects of related but different types, and you only need to access common functionality.
- **API Design:** When you want to hide implementation details (specific type parameters) from users of your API, providing a more abstract interface.


### In Summary

#### Variance

Understanding covariance and contravariance is essential for designing type-safe APIs. For instance:

- Covariant types are useful for producer-only scenarios (e.g., a collection you only read from).
- Contravariant types are ideal for consumer-only scenarios (e.g., a handler that processes inputs).
- Invariant types are best when both reading and writing operations are required.

#### Phantom Types

A phantom type is a compile-time construct used to enhance type safety.  It doesn't exist at runtime but allows the compiler to enforce rules on usage.

#### Existential Types

- Scala 2 has direct support for existential types using `forSome` or the wildcard `_` syntax, making them more powerful and flexible.
- Scala 3 dropped the `forSome` keyword and now uses `?` wildcard and path-dependent types.

- Java can partially simulate existential types using upper-bounded wildcards (`? extends T`), but this approach is more limited and primarily useful for expressing covariance.

- Existential types are a valuable tool for managing type abstraction and working with partially unknown types, but they should be used judiciously as they can introduce complexity and potential type safety challenges if not handled carefully. They are most useful when you need to balance flexibility with type safety in specific scenarios.


#### Key Differences Between Java and Scala

| Feature          | Java                                                | Scala                                                                                            |
| ---------------- | --------------------------------------------------- |--------------------------------------------------------------------------------------------------|
| Variance         | Use-site (wildcards: ? extends, ? super)            | Declaration-site (annotations: +, -)                                                             |
| Arrays           | Covariant (can lead to runtime ArrayStoreException) | Invariant (more type-safe)                                                                       |
| Method Positions | Less strict enforcement at compile time             | Stricter compiler enforcement of valid positions                                                 |
| Verbosity        | More verbose, variance specified at each use        | More concise, variance defined once                                                              |
| Phantom types | Supported | Supported                                                                                        |
| Existential Types | Partially simulate with wildcards  | Directly supported with `forSome` in Scala 2.  In Scala 3 use wildcards and path-dependent types |

While Java has made significant strides in recent years, especially with the introduction of features like records, sealed interfaces, and improved type inference, Scala's type system still offers significant advantages in terms of expressiveness, type safety, and the ability to create advanced abstractions. 


### Next time

Next time we will look at some powerful features of a type system that enable programming techniques that are more difficult or impossible to achieve in Java.

#### Union and Intersection Types:

- **Scala:** Supports union types (e.g. `Int | String`) and intersection types (e.g. `T with U`) allowing for more flexible type expressions directly in the type system.

#### Higher-Kinded Types:

- **Scala:** Natively supports higher-kinded types, allowing you to abstract over type constructors (e.g., `List`, `Option`, `Future`). This enables powerful generic programming patterns and the creation of highly reusable abstractions (like `Functor`, `Monad`, etc.).









