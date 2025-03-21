---
title: Functors and Monads with Java and Scala
date: 2025-03-21 00:00:00 Z
categories:
- Tech
tags:
- Java, Scala
author: magnussmith
summary: In this post we will we will explain what Functors and Monads are and how they help us produce more robust code.

image: magnussmith/assets/java.jpg
---

![functors_monads_hkt.webp]({{site.baseurl}}/magnussmith/assets/functors_monads_hkt.webp)

This is the fourth post in a series exploring types and type systems.   Previous posts have looked at

- [Algebraic Data Types with Java]({{site.baseurl}}/2025/01/20/algebraic-data-types-with-java.html)

- [Variance, Phantom and Existential types in Java and Scala]({{site.baseurl}}/2025/02/17/variance-in-java-and-scala.html)

- [Intersection and Union Types with Java and Scala]({{site.baseurl}}/2025/03/05/intersection-and-union-types-with-java-and-scala.html)


In this post we will investigate combining some ideas from functional programming with strong typing to produce robust expressive code that is more reusable. 

In Java, we're accustomed to working with collections and streams, transforming data using `map`, `filter`, and other operations. But have you ever stopped to think about the underlying principles that make these operations possible? To those ends we will explore the concept of a "functor," a fundamental idea from category theory that sheds light on how we manipulate data within containers.

## What's a Functor?

In simple terms, a functor is a design pattern that allows you to apply a function to elements within a container without having to extract those elements manually. Think of it as a "mappable" container.

In Java terms:

* **Container:** This could be an `Optional`, a `List`, a `Stream`, or any other type that "holds" values.
* **Function:** This is a transformation you want to apply to the values inside the container.
* **Functor:** This is the capability of the container to apply the function, producing a new container with the transformed values.

Essentially, a functor provides a `map` operation that "lifts" a function to work within the context of the container.

### Stream as a Functor in Java

~~~~ java
  Stream.of(1, 2, 3, 4, 5)
      .map(n -> n * n) // map applies squaring function
      .toList(); // [1, 4, 9, 16, 25]
~~~~
Here,  Stream.map applies the squaring function to each element in the stream, producing a new stream of squared numbers which we then collect to a List.
The m,ap acts on a stream and returns a stream – just with the contents transformed. This "structure-preserving transformation" is key to the Functor concept.


### Functor an informal definition

A Functor is a type (often a container or "context") that provides a `map` operation (sometimes called `fmap`) with the following characteristics:

1. **Takes a Function**: The `map` operation accepts a function as an argument. This function transforms the *value(s)* inside the functor.  If the functor holds type `A`, and the function transforms `A` to `B`, the `map` operation will return a new functor holding type `B`.
2. **Preserves Structure**:  The `map` operation *doesn't* change the fundamental structure of the functor itself. A `List` remains a `List`, an `Optional` remains an `Optional`, etc. It only changes the type and value *inside*.
3. **Identity Law**:  Mapping with the identity function (a function that returns its input unchanged) should result in an equivalent functor.  In pseudo-code: `functor.map(x -> x)` is equivalent to `functor`.
4. **Composition Law**:  Mapping with two functions sequentially is the same as mapping with the composition of those functions.  In pseudo-code: `functor.map(f).map(g)` is equivalent to `functor.map(x -> g(f(x)))`.

Java doesn't have a built-in `Functor` interface or keyword, but many common classes behave like functors.  They follow the rules above, even if it's not explicitly stated.

_java.util.stream.Stream_

- **Takes a Function**: `Stream.map(Function<? super T, ? extends R> mapper)`
- **Preserves Structure**: `map` returns a new `Stream`. The original `Stream` is left unchanged.
- **Identity**: 

~~~~ java
Stream<String> originalStream = Stream.of("a", "b", "c");
Stream<String> identityMapped = originalStream.map(s -> s); // Equivalent to originalStream
assertTrue(originalStream.collect(Collectors.toList()).equals(identityMapped.collect(Collectors.toList())));
~~~~

- **Composition**:

~~~~ java
Stream<String> originalStream = Stream.of("a", "b", "c");
Function<String, Integer> f = String::length;
Function<Integer, Integer> g = x -> x * 2;

Stream<Integer> composed = originalStream.map(f).map(g);
Stream<Integer> composedOnce = originalStream.map(s -> g.apply(f.apply(s)));

assertTrue(composed.collect(Collectors.toList()).equals(composedOnce.collect(Collectors.toList())));
~~~~


_java.util.Optional_

- **Takes a Function**: `Optional.map(Function<? super T, ? extends U> mapper)`
- **Preserves Structure**: `map` returns a new `Optional`. 
-  **Identity**: 

~~~~ java
Optional<String> original = Optional.of("hello");
Optional<String> identityMapped = original.map(s -> s); // Equivalent to original
assertEquals(original, identityMapped);
~~~~

- **Composition**:

~~~~java
Optional<String> original = Optional.of("hello");
Optional<String> identityMapped = original.map(s -> s); // Equivalent to original
assertEquals(original, identityMapped);
~~~~

### Functors in Scala
Scala, being a functional programming language, embraces functors more directly. In Scala, a functor is typically represented as a type class with a `map` method.
There is a `Functor` typeclass in libraries like [Cats](https://typelevel.org/cats/) and [Scalaz](https://github.com/scalaz/scalaz) or you could define a `Functor` trait yourself. However, even without external libraries, Scala's standard collections have a `map` method that aligns with the functor laws.

~~~~scala
// Using Scala's built-in collections

val names: List[String] = List("Alice", "Bob", "Charlie")
val nameLengths: List[Int] = names.map(_.length) // [5, 3, 7]

val maybeName: Option[String] = Some("David")
val maybeLength: Option[Int] = maybeName.map(_.length) // Some(5)

val noneValue: Option[String] = None
val noneLength: Option[Int] = noneValue.map(_.length)   //None
~~~~

#### Using Cats
~~~~scala
import cats.Functor
import cats.implicits._ // Or specific imports, e.g., import cats.instances.list._

val list = List(1, 2, 3)
val doubledList = Functor[List].map(list)(_ * 2) // List(2, 4, 6)

// Custom type example (as before)
case class Box[A](value: A)

implicit val boxFunctor: Functor[Box] = new Functor[Box] {
  override def map[A, B](fa: Box[A])(f: A => B): Box[B] = Box(f(fa.value))
}

val box = Box(5)
val doubledBox = Functor[Box].map(box)(_ * 2) // Box(10)
~~~~
Here we make a custom Box class a Functor using Cats. This demonstrates the power of typeclasses: you define the behavior (the map implementation) for your type within the context of the Functor typeclass.

## Monads
We've talked about Functors, which are all about applying a function to a value *inside* a container (like a `Stream` or `Optional`) while preserving the container's structure. Monads build upon this concept, adding the ability to *chain* operations that also return containers, without getting nested containers. This "flattening" capability is the key to understanding Monads, and it's incredibly useful for handling sequential computations, especially those involving optionality, collections, or asynchronous operations.

### The Problem Monads solve: Nested Contexts

Imagine you have a method that might return an `Optional<User>` and another method that, given a `User`, might return an `Optional<Address>`

~~~~ java
Optional<User> findUser(int userId) {
    // ... logic to fetch user from database or return Optional.empty() ...
}

Optional<Address> findAddress(User user) {
    // ... logic to fetch address, or return Optional.empty() if none ...
}
~~~~
Now, you want to find the address of a user given their ID. Using just `Optional.map`, you'd end up with a nested `Optional`:

~~~~ java
int userId = 123;
Optional<Optional<Address>> nestedOptional = findUser(userId).map(this::findAddress);
~~~~
Obviously this is not what we want.  The `flatMap` operation (which we'll see is a core part of the Monad) flattens the nested structure, giving you a single `Optional<Address>`.  
This is the essence of the problem Monads solve: managing and combining computations that return "contextualized" values (values wrapped in things like `Optional`, `List`, `Future`).

### Monad an informal definition

A Monad is a type that provides two fundamental operations:

1. `unit` (or `return` or `of`): This takes a plain value and puts it *into* the monadic context.  In Java's `Optional`, this is `Optional.of()` and `Optional.ofNullable()`.  For `Stream`, it's `Stream.of()`. This "lifts" a value into the container.
2. `flatMap` (or `bind`):  This is the key. It does two things:

    - **Mapping**: Like a functor's `map`, it applies a function to the value(s) *inside* the Monad.
    - **Flattening**: Crucially, this function _itself_ returns a monadic value (e.g., another `Optional`, `Stream`, etc.).
flatMap then "flattens" the result, avoiding the nested structure we saw above.

In addition to these operations, monads adhere to three laws:

1. **Left Identity**:  `unit(x).flatMap(f)` is equivalent to `f(x)`.  Putting a value into the context and then flatMapping a function is the same as just applying the function. 
2. **Right Identity**:  `monad.flatMap(x -> unit(x))` is equivalent to `monad.flatMap`ping with the `unit` function 
(which just puts the value back in the context) doesn't change the monad.
3. **Associativity**:  `monad.flatMap(f).flatMap(g)` is equivalent to `monad.flatMap(x -> f(x).flatMap(g))`. The way you nest flatMap calls doesn't matter; the result is the same.

### Monads in Java
Like Functors, Java doesn't have a dedicated `Monad` interface, but several classes behave monadically:

_java.util.Optional_

- `unit`: `Optional.of(value)` or `Optional.ofNullable(value)`
- `flatMap`: `Optional.flatMap(Function<? super T, Optional<U>> mapper)`

~~~~ java
Optional<Address> address = findUser(userId).flatMap(this::findAddress); // Much cleaner!
~~~~

_java.util.stream.Stream_

- `unit`: `Stream.of(values...)`
- `flatMap`: `Stream.flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)`

~~~~ java
List<String> lines = Arrays.asList("hello world", "java streams");
List<String> words = lines.stream()
    .flatMap(line -> Arrays.stream(line.split(" "))) // Flatten the Stream<String[]>
    .collect(Collectors.toList()); // ["hello", "world", "java", "streams"]
~~~~

Notice how `flatMap` flattens streams of streams


_java.util.concurrent.CompletableFuture_

- `unit`: `CompletableFuture.completedFuture(value)`
- `flatMap`: `CompletableFuture.thenCompose(Function<? super T, ? extends CompletionStage<U>> fn)`

~~~~ java
CompletableFuture<User> userFuture = findUserAsync(userId); // Assume this returns a CompletableFuture
CompletableFuture<Address> addressFuture = userFuture.thenCompose(this::findAddressAsync);
~~~~

### Monads have many uses

- **Chaining Operations**: Monads allow you to chain operations that return contextualized values in a clean, readable, and safe way. This is especially important for handling errors (with `Optional`), working with collections (with `Stream`), 
and managing asynchronous computations (with `CompletableFuture`). 
- **Error Handling**: `Optional` used in a monadic way helps prevent `NullPointerExceptions` by forcing you to explicitly handle the case where a value might be absent.
- **Composing Asynchronous Tasks**: `CompletableFuture`'s monadic nature makes it possible to build complex asynchronous workflows without callback hell.
-  **Abstraction and Code Reusability:**: Like functors, monads provide a common interface. If you write code that works with a generic Monad, it can work with `Optional`, `Stream`, `CompletableFuture`, or any other type that implements the monadic interface (in languages that support this).

### Monads in Scala

Scala has built-in support for monadic operations through it's `for` comprehensions, which are syntactic sugar for 
`flatMap` and `map`.  Additionally, libraries like Cats provide a formal `Monad` typeclass.

~~~~ scala
// Using Scala's for comprehensions (syntactic sugar)

def findUser(userId: Int): Option[User] = ??? // Assume this is defined
def findAddress(user: User): Option[Address] = ???

val userId = 123
val address: Option[Address] = for {
  user    <- findUser(userId)  // If findUser returns None, the whole thing short-circuits
  address <- findAddress(user) // If findAddress returns None, the whole thing is None
} yield address

// Equivalent to:
// val address: Option[Address] = findUser(userId).flatMap(user => findAddress(user))

// Another example with Lists:
val numbers = List(1, 2, 3)
val doubledAndIncremented = for {
    n <- numbers
    doubled = n * 2
    incremented = doubled + 1
} yield incremented  // List(3, 5, 7)
//is equivalent to:
//numbers.flatMap(n => List(n * 2 + 1))

// Using Cats (requires Cats library dependency)
import cats.Monad
import cats.implicits._

case class MyContext[A](value: A)

implicit val myContextMonad: Monad[MyContext] = new Monad[MyContext] {
  override def pure[A](x: A): MyContext[A] = MyContext(x)

  override def flatMap[A, B](fa: MyContext[A])(f: A => MyContext[B]): MyContext[B] = f(fa.value)

   //Required for Monad, but can be derived automatically with cats.
  override def tailRecM[A, B](a: A)(f: A => MyContext[Either[A, B]]): MyContext[B] = {
    f(a) match {
      case MyContext(Left(nextA)) => tailRecM(nextA)(f)
      case MyContext(Right(b))    => MyContext(b)
    }
  }
}
val myContext = MyContext(5)
val result = Monad[MyContext].flatMap(myContext)(x => MyContext(x + 1)) //MyContext(6)
val result2 = myContext.flatMap(x => MyContext(x + 1)) //MyContext(6), using extension methods
~~~~

**Some advantages offered by Scala**

- **_for_** Comprehensions:  In Scala the `for` comprehension provides a more readable way to chain monadic operations.
- **Immutability**: Collections in Scala are immutable by default which fits better with the monadic principle of returning new instances over modifications.
- **Typeclasses**: Libraries like Cats provide a `Monad` typeclass, allowing us to define monadic behaviour for our own custom types.   

Monads are a powerful tool for managing sequential computations, especially those that involve optionality, collections, or asynchronous operations. 
While Java provides the necessary building blocks (`flatMap` on `Optional`, `Stream`, and`CompletableFuture`), Scala's for comprehensions and typeclasses (like those in Cats) make working with monads more explicit and convenient.

### Next time

Next time we build on the concepts of __Functor__  and __Monads__  taking the abstraction to the next level with __Higher-Kinded Types__ and how they can help with....
