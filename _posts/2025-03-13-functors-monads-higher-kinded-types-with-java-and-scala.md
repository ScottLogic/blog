---
title: Functors, Monads and Higher Kinded Types with Java and Scala
date: 2025-03-13 00:00:00 Z
categories:
- Tech
tags:
- Java, Scala
author: magnussmith
summary: In this post we will see what a Functor and Monad are and how Higher Kinded Types types can help increase the flexibility of our code.
image: magnussmith/assets/java.jpg
---

![functors_monads_hkt.webp]({{site.baseurl}}/magnussmith/assets/functors_monads_hkt.webp)

This is the fourth post in a series exploring types and type systems.   Previous posts have looked at

- [Algebraic Data Types with Java]({{site.baseurl}}/2025/01/20/algebraic-data-types-with-java.html)

- [Variance, Phantom and Existential types in Java and Scala]({{site.baseurl}}/2025/02/17/variance-in-java-and-scala.html)

- [Intersection and Union Types with Java and Scala]({{site.baseurl}}/2025/03/05/intersection-and-union-types-with-java-and-scala.html)


In this post we will look at how we can combine some important ideas from functional programming with strong typing to produce robust expressive code that is more reusable. 

As developers, we're accustomed to working with collections and streams, transforming data using `map`, `filter`, and other operations. But have you ever stopped to think about the underlying principles that make these operations possible? This post will explore the concept of a "functor," a fundamental idea from category theory that sheds light on how we manipulate data within containers.

## What's a Functor?

In simple terms, a functor is a design pattern that allows you to apply a function to elements within a container without having to extract those elements manually. Think of it as a "mappable" container.

To translate this into Java terms:

* **Container:** This could be an `Optional`, a `List`, a `Stream`, or any other type that "holds" values.
* **Function:** This is a transformation you want to apply to the values inside the container.
* **Functor:** This is the capability of the container to apply the function, producing a new container with the transformed values.

Essentially, a functor provides a `map` operation that "lifts" a function to work within the context of the container.


### Stream as a Functor in Java

~~~~ java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamFunctor {

    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        List<Integer> squaredNumbers = numbers.stream()
                .map(n -> n * n) // map applies squaring function
                .collect(Collectors.toList());

        System.out.println(squaredNumbers); // Output: [1, 4, 9, 16, 25]
    }
}
~~~~
Here, We start with a List and take a stream. Stream.map applies the squaring function to each element in the stream, producing a new stream of squared numbers which we then collect to a List.
We started with a List, and we ended up with a List – just with the contents transformed. This "structure-preserving transformation" is key to the Functor concept.


### Functor an informal definition

A Functor is a type (often a container or "context") that provides a `map` operation (sometimes called `fmap`) with the following characteristics:

1. **Takes a Function**: The `map` operation accepts a function as an argument. This function transforms the _value(s)_ inside the functor.  If the functor holds type `A`, and the function transforms `A` to `B`, the `map` operation will return a new functor holding type `B`.
2. **Preserves Structure**:  The `map` operation _doesn't_ change the fundamental structure of the functor itself. A `List` remains a `List`, an `Optional` remains an `Optional`, etc. It only changes the type and value _inside_.
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
There is a `Functor` typeclass in libraries like Cats and Scalaz or you could define a `Functor` trait yourself. However, even without external libraries, Scala's standard collections have a `map` method that aligns with the functor laws.

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
Obviously this is not what we want.  The `flatMap` operation (which we'll see is a core part of the Monad) flattens the 
nested structure, giving you a single `Optional<Address>`.  This is the essence of the problem Monads solve: managing and
combining computations that return "contextualized" values (values wrapped in things like Optional, List, Future).

### Monad an informal definition

A Monad is a type that provides two fundamental operations:

1. `unit` (or `return` or `of`): This takes a plain value and puts it _into_ the monadic context.  In Java's `Optional`, 
this is `Optional.of()` and `Optional.ofNullable()`.  For `Stream`, it's `Stream.of()`. This "lifts" a value into the container.
2. `flatMap` (or `bind`):  This is the key. It does two things:

    - **Mapping**: Like a functor's `map`, it applies a function to the value(s) _inside_ the Monad.
    - **Flattening**: Crucially, this function _itself_ returns a monadic value (e.g., another `Optional`, `Stream`, etc.).
flatMap then "flattens" the result, avoiding the nested structure we saw above.

In addition to these operations, monads adhere to three laws (similar to Functors, but different):

1. **Left Identity**:  `unit(x).flatMap(f)` is equivalent to `f(x)`.  Putting a value into the context and then flatMapping 
a function is the same as just applying the function. 
2. **Right Identity**:  `monad.flatMap(x -> unit(x))` is equivalent to `monad.flatMap`ping with the `unit` function 
(which just puts the value back in the context) doesn't change the monad.
3. **Associativity**:  `monad.flatMap(f).flatMap(g)` is equivalent to `monad.flatMap(x -> f(x).flatMap(g))`. The way you 
nest flatMap calls doesn't matter; the result is the same.

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

### Why they are Monads Useful?

- **Chaining Operations**: Monads allow you to chain operations that return contextualized values in a clean, readable, 
and safe way. This is especially important for handling errors (with `Optional`), working with collections (with `Stream`), 
and managing asynchronous computations (with `CompletableFuture`). 
- **Error Handling**: `Optional` used in a monadic way helps prevent `NullPointerExceptions` by forcing you to explicitly
handle the case where a value might be absent.
- **Composing Asynchronous Tasks**: `CompletableFuture`'s monadic nature makes it possible to build complex asynchronous
workflows without callback hell.
-  **Abstraction and Code Reusability:**: Like functors, monads provide a common interface. If you write code that works 
- with a generic Monad, it can work with `Optional`, `Stream`, `CompletableFuture`, or any other type that implements
- the monadic interface (in languages that support this).

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

- **_for_ Comprehensions:  In Scala the `for` comprehension provides amore readable way to chain monadic operations.
- **Immutability**: Collections in Scala are immutable by default which fits better with the monadic principle of returning
 new instances over modifications.
- **Typeclasses**: Libraries like Cats provide a `Monad` typeclass, allowing us to define monadic behaviour for our own custom types.   

Monads are a powerful tool for managing sequential computations, especially those that involve optionality, collections, 
or asynchronous operations. While Java provides the necessary building blocks (`flatMap` on `Optional`, `Stream`, and 
`CompletableFuture`), Scala's for comprehensions and typeclasses (like those in Cats) make working with monads more 
explicit and convenient.


## Higher Kinded Types

In Java, we're used to generics, which let us create type parameters at one level.

**Java example**:

~~~~ java
interface Container<T> {
    T get();
}
~~~~

This allows us to work with Container<String>, Container<Integer>, etc. However, we cannot abstract over type constructors (e.g., Container itself). This is where HKTs come in—they allow us to create generic abstractions over generic types.

**Scala example**:
Scala supports HKTs natively

~~~~ scala
trait Functor[F[_]] {
  def map[A, B](fa: F[A])(f: A => B): F[B]
}
~~~~

Here, `F[_]` represents a type constructor (such as `List` or `Option`), not a concrete type like `List[Int]`. This means we can define generic behaviors for containers without knowing their exact type.

### What are Higher-Kinded Types?

At their core, HKTs are about abstracting over type constructors rather than just types. Let's clarify those terms:

- **Type**: A basic type is something like String, Integer, Boolean, or a claas that we define. These represent concrete values.
- **Type Constructor**: This is a "type-level function." It's something that takes a type and produces a new type. Generics in Java are the closest we get to this concept directly. Think of `List<T>`. List itself isn't a complete type. It's a constructor that, when given a type like `String` (becoming `List<String>`), produces a concrete type. Similarly, `Optional<T>`, `Map<K, V>`, and `Function<T, R>` are type constructors.


A higher-kinded type is a type that abstracts over these type constructors. Instead of saying "I need a function that takes an `Integer` and returns a `String`", you say "I need a function that takes some container-like thing that holds any type and operates on that." You're abstracting not just the element type (T) but the container itself (e.g., `List`, `Optional`).

Think of regular generics as "type-level functions."  You give them a type (like _String_), and they produce a concrete type (like _List<String>_). HKTs are a level above that.  They're "type-constructor-level functions."  You give them a type constructor (like _List_), and they produce a type.

**Let's break down the terminology:**

- **Type Constructor**:  Something that takes a type and returns a type. _List_ is a type constructor because you need to provide a type argument(like _String_) to get a concrete type( _List<String>_). HKTs are a level above that. They're "type-constructor-level functions." You give them a *type constructor* (like _List_), and they produce a type.
-  **Kind**: The "type of a type". It describes what a type expects.

   - `*` : Represents a concrete type (like `String`, `Integer`, etc.).
   - `* -> *` : Represents a type constructor that takes a single type argument and returns a type (like `Set`, `List`, `Stream`). This is a "kind"
   - `* -> * -> *` : Represents a type constructor that takes *two* type arguments (like `Map`, which needs a key type and a value type). 

A Higher-Kinded Type is a type that takes a type *constructor* as a parameter. We can think of it as abstracting over the container, and not just the contents. 

## Where would we use HKTs

- **Write More Generic and Reusable Code**: Instead of writing similar logic for different generic types (like `List`, `Optional`, etc.), we define a common interface for them.

- **Express Functional Abstractions**: Functional programming concepts like Functor, Monad, and Applicative are Typeclasses.  Typeclasses define operations that must be supported by a type.  We have already seen that a `Functor` must have a `map` operation, and a `Monad` must have a `map` and a `flatMap`. With an HKT we can define these typeclasses genericallyover different containers.  

- **Improve Type Safety**: They eliminate boilerplate and prevent code duplication while ensuring compile-time correctness.




### HKTs in Scala (with Cats)

As we have seen Scala *does* have HKTs and although you can create a hand-rolled `Functor`. In practice we tend to use a library like Cats, which provides a rich set of typeclasses and instances.

~~~~ scala
import cats.Functor
import cats.instances.list._   // Import Functor instance for List
import cats.instances.option._ // Import Functor instance for Option
import cats.syntax.functor._  // (1) Import extension methods (adds .map to any Functor)

object FunctorExample {
  def main(args: Array[String]): Unit = {

    // List example
    val numbers = List(1, 2, 3)
    val doubledNumbers = numbers.map(_ * 2) // Uses the Functor[List].map
    println(doubledNumbers) // Output: List(2, 4, 6)

    // Option example
    val maybeNumber: Option[Int] = Some(5)
    val doubledOption = maybeNumber.map(_ * 2) // Uses the Functor[Option].map
    println(doubledOption) // Output: Some(10)

    val maybeEmpty: Option[Int] = None
    val doubledEmpty = maybeEmpty.map(_ * 2)
    println(doubledEmpty) // Output: None
  }
    // Generic function using Functor
    def doubleAll[F[_]: Functor](fa: F[Int]): F[Int] = {   // (2) The Context Bound
        fa.map(_ * 2)
    }
}
~~~~

**Notes**

*(1)* The import *import cats.syntax.functor._:* brings in *extension methods* This "magic" allows Scala to add methods to existing types. It's what allows us to call `.map` directly on a `List` or `Option` as if it were defined on those types, even though map is actually defined in the `Functor` typeclass.

*(2)* `[F[_]: Functor]`: This defines a *context bound* It instructs the compiler to search for an implicit `Functor[F]` and pass it to the function. This is how Scala handles typeclass instances.


### Java Doesn't *Directly* Support HKTs

Java is missing the ability to express a *generic type constructor*  You can't write 

~~~~ java
// THIS IS PSEUDO-JAVA (Illustrative, doesn't compile)
interface MyHigherKindedInterface<M<_>, A> {  // M<_> is the key: a type constructor
    M<B> map(Function<A, B> f, M<A> input);
}
~~~~ 

Here The `M<_>` part is the hypothetical syntax for saying, "M is a type constructor that takes one type argument." Java's type system can't represent this directly.

All is not lost.  We can attempt to simulate HKTs in Java.

### HKTs in Java with the "Defunctionalisation" Technique

As we have explained you can't get true HKTs, but you can simulate them to a useful degree using a technique often called "defunctionalisation" or "type-level programming." The core idea is:

1. **Represent Type constructors as Types**: Instead of a type constructor like `List<_>`, you create a separate type to represent the concept of "List-ness."
2. **Use Witness Types (or Kind Markers)**: Create an interface that acts as a "marker" or "witness" for your type constructor.
3. **Implement Higher-Order Logic**: Write methods that operate on these representative types, effectively simulating the behavior of higher-kinded functions.


Example: Functor

Let's demonstrate this with a common functional concept: the Functor. A Functor provides a map operation that applies a function to the contained value(s) *without changing the structure* of the container.

~~~~ java

// 1. Witness Type (Kind Marker)
interface Kind<F, A> {}  // F is our "simulated" type constructor, A is the element type

// 2. Represent specific type constructors (List, Optional)
interface ListKind<A> extends Kind<ListKind<?>, A> {}
interface OptionalKind<A> extends Kind<OptionalKind<?>, A> {}

// 3. Functor interface (our "higher-kinded" concept)
interface Functor<F> {
    <A, B> Kind<F, B> map(Function<A, B> f, Kind<F, A> fa);
}

// 4. Implement Functor for List
class ListFunctor implements Functor<ListKind<?>> {
    @Override
    public <A, B> ListKind<B> map(Function<A, B> f, Kind<ListKind<?>, A> fa) {
        List<A> list = unwrap(fa); // We'll need a way to get the actual List
        List<B> result = new ArrayList<>();
        for (A a : list) {
            result.add(f.apply(a));
        }
        return wrap(result); // And a way to put it back in ListKind
    }

    // Helper methods (this is where the "trick" lies)
    private static <A> List<A> unwrap(Kind<ListKind<?>, A> kind) {
        return ((ListHolder<A>) kind).list; // Cast to a helper class
    }

    private static <A> ListKind<A> wrap(List<A> list) {
        return new ListHolder<>(list); // Wrap in a helper class
    }

    // Helper class to hold the actual List
    static class ListHolder<A> implements ListKind<A> {
        final List<A> list;
        ListHolder(List<A> list) { this.list = list; }
    }
}

//5.  Implement functor for Optional
class OptionalFunctor implements Functor<OptionalKind<?>>{

    @Override
    public <A, B> Kind<OptionalKind<?>, B> map(Function<A, B> f, Kind<OptionalKind<?>, A> fa) {
        Optional<A> optional = unwrap(fa);
        Optional<B> result = optional.map(f);
        return wrap(result);
    }

    private static <A> Optional<A> unwrap(Kind<OptionalKind<?>, A> kind){
        return ((OptionalHolder<A>) kind).optional;
    }
    private static <A> OptionalKind<A> wrap(Optional<A> optional){
        return new OptionalHolder<>(optional);
    }

    static class OptionalHolder<A> implements OptionalKind<A>{
        final Optional<A> optional;
        OptionalHolder(Optional<A> optional) { this.optional = optional; }
    }
}

// 6. Example usage
public class Main {
    public static void main(String[] args) {
        ListFunctor listFunctor = new ListFunctor();
        OptionalFunctor optionalFunctor = new OptionalFunctor();

        // List example
        List<Integer> numbers = Arrays.asList(1, 2, 3);
        ListKind<Integer> numberKind = ListFunctor.wrap(numbers); // Wrap for the simulation
        ListKind<String> stringKind = listFunctor.map(String::valueOf, numberKind);
        List<String> strings = ListFunctor.unwrap(stringKind); // Unwrap to get the result
        System.out.println(strings); // Output: [1, 2, 3]

        //Optional example
        Optional<Integer> number = Optional.of(5);
        OptionalKind<Integer> optionalKind = OptionalFunctor.wrap(number);
        OptionalKind<String> result = optionalFunctor.map(String::valueOf, optionalKind);
        Optional<String> stringResult = OptionalFunctor.unwrap(result);
        System.out.println(stringResult);
    }
}
~~~~


### Summary