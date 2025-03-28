---
title: Functors and Monads with Java and Scala
date: 2025-03-21 00:00:00 Z
categories:
- Tech
tags:
- Java, Scala
author: magnussmith
summary: Learn about how Functors and Monads provide patterns to write cleaner, more composable, and robust code that helps us deal with operations like handling nulls, managing errors and sequencing asynchronous actions.

image: magnussmith/assets/java.jpg
---

![functors_monads.webp]({{site.baseurl}}/magnussmith/assets/functors_monads.webp)

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
The map acts on a stream and returns a stream – just with the contents transformed. This "structure-preserving transformation" is key to the Functor concept.


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

I'm using scala `3.6.4`, so to add cats to my sbt file 
``` 
libraryDependencies += "org.typelevel" %% "cats-effect" % "3.6.0"
```


~~~~scala
import cats.Functor
import cats.implicits._

val list = List(1, 2, 3)
val doubledList = Functor[List].map(list)(_ * 2) // List(2, 4, 6)

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


### Use Case 1: Handling potentially missing values with Optional<T>

- Safely navigating potentially null object graphs or method return values. Imagine fetching a user's address first line, where the user, their address, orany of the fields could be missing.

- **Monadic Operations**:

  - `Optional.ofNullable()`: Wraps a potentially null value.
  - `map()`: Transforms the value inside the Optional if it's present.
  - `flatMap()`: Transforms the value using a function that returns another Optional. Essential for chaining operations that might each yield an absent result.

~~~~ java
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;


class OptionalMonadExample {

  record Address(Optional<String> houseNumber,
                 Optional<String> houseName,
                 String street) {}

  record User(String name, Optional<Address> address) {}
  
  // Method that might return a null User
  static User findUserById(String id) {
    return switch (id) {
      case "1" -> new User("Eric", Optional.of(new Address(Optional.of("29"), Optional.empty(), "Acacia Road")));
      case "2" -> new User("Bob", Optional.empty()); // no address
      default -> null; // not found
    };
  }

  // --- Traditional Null-Checking Approach (Verbose and Error-Prone) ---
  static String getAddressFirstLineTraditional(String userId) {
    User user = findUserById(userId);
    if (user != null) {
      Optional<Address> addressOpt = user.address();
      if (addressOpt.isPresent()) {
        Address address = addressOpt.get();
        // house number OR name
        String houseIdentifier = "";
        Optional<String> houseNumOpt = address.houseNumber();
        if (houseNumOpt.isPresent()) {
          houseIdentifier = houseNumOpt.get();
        } else {
          Optional<String> houseNameOpt = address.houseName();
          if (houseNameOpt.isPresent()) {
            houseIdentifier = houseNameOpt.get();
          }
          // If neither is present, houseIdentifier remains ""
        }

        String street = address.street();

        if (!houseIdentifier.isEmpty()) {
          return houseIdentifier + " " + street;
        } else if (street != null && !street.isEmpty()) {
          // Handle case where only street exists
          return street;
        }
      }
    }
    return "Address information unavailable";
  }

  // --- Monadic Approach using Optional ---
  static String getAddressFirstLineMonadic(String userId) {
    return Optional.ofNullable(findUserById(userId)) // Optional<User>
        .flatMap(User::address)                 // Optional<Address> (flatMap needed as address() returns Optional)
        .map(address ->                       // Transform Address to String (map is good here)
            Stream.of(address.houseNumber().or(address::houseName),
                Optional.ofNullable(address.street()))
                .flatMap(Optional::stream) // flatten to remove any Optional.empty()
                .collect(Collectors.joining(" "))
        )
        .orElse("Address information unavailable"); // Final default if user/address was missing
  }

  public static void main(String[] args) {
    System.out.println("Traditional:");
    System.out.println("User 1: " + getAddressFirstLineTraditional("1")); // 29 Acacia Road
    System.out.println("User 2: " + getAddressFirstLineTraditional("2")); // Address information unavailable
    System.out.println("User 2: " + getAddressFirstLineTraditional("3")); // Address information unavailable

    System.out.println("\nMonadic:");
    System.out.println("User 1: " + getAddressFirstLineMonadic("1"));   // 29 Acacia Road
    System.out.println("User 2: " + getAddressFirstLineMonadic("2"));   // Address information unavailable
    System.out.println("User 3: " + getAddressFirstLineMonadic("3"));   // Address information unavailable
  }

~~~~

### Use Case 2: Composing Asynchronous Operations with `CompletableFuture<T>`

`CompletableFuture` allows chaining asynchronous computations without blocking threads excessively, avoiding "callback hell".

- Fetching data from a remote service, then using that data to make another service call, then processing the final result.

- **Monadic Operations**:

  - `supplyAsync()`: Starts an async computation.
  - `thenApply()` (map equivalent): Applies a simple function to the result when available.
  - `thenCompose()` (flatMap equivalent): Applies a function that returns another CompletableFuture when the previous stage completes. Essential for chaining dependent async calls.

~~~~ java 
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static java.lang.System.err;
import static java.lang.System.out;

class CompletableFutureMonadExample {

  static ExecutorService executor = Executors.newFixedThreadPool(2);

  // Simulate fetching user data asynchronously
  static CompletableFuture<String> fetchUserData(int userId) {
    return CompletableFuture.supplyAsync(() -> {
      out.printf("%s: Fetching data for user %s ...%n", Thread.currentThread().getName(), userId);
      try { TimeUnit.SECONDS.sleep(1); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
      return "User_Data_" + userId;
    }, executor);
  }

  // Simulate fetching order details based on user data asynchronously
  static CompletableFuture<String> fetchOrderDetails(String userData) {
    return CompletableFuture.supplyAsync(() -> {
      out.printf("%s: Fetching orders for %s ...%n", Thread.currentThread().getName(), userData);
      try { TimeUnit.SECONDS.sleep(1); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
      return "Order_Details_for_" + userData;
    }, executor);
  }

  // Simple processing function
  static String processOrders(String orderDetails) {
    out.printf("%s: Processing %s ...%n", Thread.currentThread().getName(), orderDetails);
    return "Processed: [%s]".formatted(orderDetails);
  }

  public static void main(String[] args) {
    out.println("Starting async chain...");

    CompletableFuture<String> finalResult = fetchUserData(1) // Returns CompletableFuture<String>
        .thenCompose(CompletableFutureMonadExample::fetchOrderDetails) // Uses thenCompose (flatMap) because fetchOrderDetails returns a CF
        .thenApply(CompletableFutureMonadExample::processOrders); // Uses thenApply (map) because processOrders returns a simple String

    try {
      String result = finalResult.join(); // Blocks until completion for this demo
     out.println("\nFinal Result: " + result);
    } catch (Exception e) {
      err.println("An error occurred: " + e.getMessage());
    } finally {
      executor.shutdown();
    }
  }
}
~~~~

### Use Case 3: Data processing with  `Stream<T>`

Streams provide a fluent, declarative way to process sequences of data, often using monadic-style `map` and `flatMap`.

-  Filtering a list of orders, extracting all items from the selected orders, and calculating their total price.

- **Monadic Operations**:
  
  - `stream()`: Creates a stream from a collection.
  - `map()`: Transforms each element.
  - `mapToDouble()`: Specialised version of map.
  - `flatMap()`: Transforms each element into another stream and concatenates those streams.

~~~~ java
import java.util.List;
import java.util.stream.Stream;


class StreamMonadExample {
  record Item(String name, double price) {}
 sealed interface Order permits Order.Priority, Order.Regular {
    record Priority(int orderId, List<Item> items) implements Order {};
    record Regular(int orderId, List<Item> items) implements Order {};
}

  public static double calculatePriorityOrders(Stream<Order> orders) {
    return orders                     // Stream<Order>
        .flatMap(order -> switch (order) {
          case Order.Priority priorityOrder -> priorityOrder.items().stream(); // Stream items if Priority
          case Order.Regular regularOrder -> Stream.empty(); // Empty stream if Regular
        })                            // Stream<Item> (Contains only items from Priority orders)
        .mapToDouble(Item::price)     // DoubleStream
        .sum();                       // Calculate sum
  }

  public static void main(String[] args) {
    List<Order> orders = List.of(
        new Order.Priority(1, List.of(new Item("PC", 1340.0), new Item("Mouse", 25.0))),
        new Order.Regular(2, List.of(new Item("Keyboard", 55.0))),
        new Order.Priority(3, List.of(new Item("Monitor", 450.0), new Item("Webcam", 50.0))),
        new Order.Priority(4, List.of()) // Priority order with no items
    );

    // Calculate the total price of all items from *priority* orders
    System.out.printf("Total price of items in priority orders: %.2f", calculatePriorityOrders(orders.stream()));
    // Output: 1865.0 (1340 + 25 + 450 + 50)
  }
  
}
~~~~


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

// Using Cats 
import cats.Monad
import scala.annotation.tailrec

case class MyContext[A](value: A)

implicit val myContextMonad: Monad[MyContext] = new Monad[MyContext] {
  override def pure[A](x: A): MyContext[A] = MyContext(x)

  override def flatMap[A, B](fa: MyContext[A])(f: A => MyContext[B]): MyContext[B] = f(fa.value)

  //Required for Monad, but can be derived automatically with cats.
  @tailrec
  override def tailRecM[A, B](a: A)(f: A => MyContext[Either[A, B]]): MyContext[B] = {
    f(a) match {
      case MyContext(Left(nextA)) => tailRecM(nextA)(f)
      case MyContext(Right(b)) => MyContext(b)
    }
  }
}

@main def main(): Unit = {
  val myContext = MyContext(5)
  val result = Monad[MyContext].flatMap(myContext)(x => MyContext(x + 1)) // MyContext(6)
  val result2 = myContext.flatMap(x => MyContext(x + 1)) // MyContext(6), using extension methods
}
~~~~

**Some advantages offered by Scala**

- **_for_** Comprehensions:  In Scala the `for` comprehension provides a more readable way to chain monadic operations.
- **Immutability**: Collections in Scala are immutable by default which fits better with the monadic principle of returning new instances over modifications.
- **Typeclasses**: Libraries like Cats provide a `Monad` typeclass, allowing us to define monadic behaviour for our own custom types.   

### Summary

Monads are a powerful tool for managing sequential computations, especially those that involve optionality, collections, or asynchronous operations. 
While Java provides the necessary building blocks (`flatMap` on `Optional`, `Stream`, and`CompletableFuture`), Scala's for comprehensions and typeclasses (like those in Cats) make working with monads more explicit and convenient.

### Next time

Next time we build on the concepts of __Functor__  and __Monads__  taking the abstraction to the next level with __Higher-Kinded Types__ to write more reusable code and reducing code duplication.
