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

- **_for_ Comprehensions:  In Scala the `for` comprehension provides a more readable way to chain monadic operations.
- **Immutability**: Collections in Scala are immutable by default which fits better with the monadic principle of returning new instances over modifications.
- **Typeclasses**: Libraries like Cats provide a `Monad` typeclass, allowing us to define monadic behaviour for our own custom types.   

Monads are a powerful tool for managing sequential computations, especially those that involve optionality, collections, or asynchronous operations. 
While Java provides the necessary building blocks (`flatMap` on `Optional`, `Stream`, and`CompletableFuture`), Scala's for comprehensions and typeclasses (like those in Cats) make working with monads more explicit and convenient.


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


In *Java* we can think of `List` or `Optional` as *type constructors*, They take a *type* (`String`, `Integer`) as an argument and produce a concrete type (`List<String>`, `Optional<Integer>`).

A higher-kinded type is a type constructor that takes *another* type constructor as an argument.  Think of it as a "generic over generics."  Java's type system does not directly support this.


### Why are Higher-Kinded Types (HKT) Useful?

Using HKTs allow us to write extremely generic and reusable code.  We can define functions that work with any type that has certain properties (like being a Functor or a Monad), regardless of its specific implementation.

**This gives some key benefits:**

*- *Write More Generic and Reusable Code**: Instead of writing similar logic for different generic types (like `List`, `Optional`, etc.), we define a common interface like `Functor` or `Monad`.
-  **Abstraction**: We can create code that works with concepts(like "mappable") instead of concrete types
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

### Simulating HKTs in Java

Using a library `PureFun` we can simulate HKTs. PureFun uses a technique called "**Lightweight Higher-Kinded Polymorphism**" also known as "*defuctionalisation*"

As we have explained you can't get true HKTs, but you can simulate them to a useful degree using a technique often called "defunctionalisation" or "type-level programming." The core idea involves 3 steps:
#### *Step 1*
**Use Witness Types (or Kind Markers)**: Create an interface that acts as a "marker" or "witness" for the type constructor. `ListKind.µ` is the witness for the `ListKind` type constructor.
#### *Step 2*
**Represent Type constructors as Types**: Instead of a type constructor like `List<_>`, you create a separate type to represent the concept of "List-ness." The `Kind<F, A>` interface represents a type constructor `F` applied to a type `A`. For example, `Kind<ListKind.µ, String>` represents `List<String>`. The `µ` type is a "witness" type, and it's crucial for making this system work.
#### *Step 3*
**Implement Higher-Order Logic**: Use methods that operate on these representative types, effectively simulating the behavior of higher-kinded functions.


```java
dependencies {
    implementation 'com.github.tonivade:purefun:0.11.0' // Use the latest version
}
```

Example: Functor with HKT (PureFun)

Let's demonstrate this with a common functional concept: the Functor. A Functor provides a map operation that applies a function to the contained value(s) *without changing the structure* of the container.

~~~~ java

import com.github.tonivade.purefun.Kind;
import com.github.tonivade.purefun.Witness;
import com.github.tonivade.purefun.Function1;
import com.github.tonivade.purefun.type.Option;
import com.github.tonivade.purefun.type.OptionOf;
import com.github.tonivade.purefun.type.Try;
import com.github.tonivade.purefun.type.TryOf;
import com.github.tonivade.purefun.data.Sequence;
import com.github.tonivade.purefun.data.SequenceOf;
import com.github.tonivade.purefun.typeclasses.Functor; // Import Functor


import java.util.function.Function;

public class HKTFunctorExample {

    // Generic map function using the Functor typeclass
    public static <F extends Witness, A, B> Kind<F, B> map(Kind<F, A> fa, Function1<A, B> mapper, Functor<F> functor) {
        return functor.map(fa, mapper);
    }
  
    public static void main(String[] args) {

        // Option example
        Functor<Option.µ> optionFunctor = Option.functor(); // Get the Functor instance
        Kind<Option.µ, Integer> option = Option.some(5);
        Kind<Option.µ, String> mappedOption = map(option, x -> "Number: " + x, optionFunctor); // Use our map function
        System.out.println(Option.narrowK(mappedOption)); // Output: Some(Number: 5)

        // Sequence example
        Functor<Sequence.µ> listFunctor = Sequence.functor();
        Kind<Sequence.µ, Integer> list = Sequence.listOf(1, 2, 3);
        Kind<Sequence.µ, String> mappedList = map(list, x -> "Item: " + x, listFunctor);
        System.out.println(Sequence.narrowK(mappedList)); //Output: [Item: 1,Item: 2,Item: 3]
    }
}
~~~~


Example: using built in Monad Typeclass (PureFun)

~~~~java
import com.github.tonivade.purefun.Kind;
import com.github.tonivade.purefun.typeclasses.Monad; // Use the typeclass directly
import com.github.tonivade.purefun.type.Option;
import com.github.tonivade.purefun.type.OptionOf;
import com.github.tonivade.purefun.Function1;

public class HKTTypeclassExample {

    public static void main(String[] args) {
        Monad<OptionOf.µ> optionMonad = Option.monad(); // Get the Monad instance

        Kind<OptionOf.µ, Integer> option1 = Option.some(5);
        Kind<OptionOf.µ, Integer> option2 = Option.some(10);

        // Use the Monad instance directly
        Kind<OptionOf.µ, Integer> result = optionMonad.flatMap(option1, x ->
                optionMonad.map(option2, y -> x + y)
        );

        System.out.println(Option.narrowK(result)); // Output: Some(15)
    }
}
~~~~


Example: Homemade Monad with HKT (PureFun)

~~~~java
import com.github.tonivade.purefun.Kind;
import com.github.tonivade.purefun.Witness;
import com.github.tonivade.purefun.Function1;
import com.github.tonivade.purefun.type.Option;
import com.github.tonivade.purefun.type.OptionOf;

interface Monad<F extends Witness> extends Functor<F> {
    <A> Kind<F, A> pure(A value);
    <A, B> Kind<F, B> flatMap(Kind<F, A> fa, Function1<A, ? extends Kind<F, B>> mapper);

    @Override
    default <A, B> Kind<F, B> map(Kind<F, A> fa, Function1<A, B> mapper) {
        return flatMap(fa, a -> pure(mapper.apply(a)));
    }
}
public class HKTMonadExample {

    public static <F extends Witness, A, B> Kind<F, B> flatMap(Monad<F> monad, Kind<F, A> fa, Function1<A, ? extends Kind<F, B>> mapper) {
        return monad.flatMap(fa, mapper);
    }

    public static void main(String[] args) {
        Monad<OptionOf.µ> optionMonad = Option.monad();

        Kind<OptionOf.µ, Integer> option1 = Option.some(5);
        Kind<OptionOf.µ, Integer> option2 = Option.some(10);

        // Using flatMap to chain operations
        Kind<OptionOf.µ, Integer> result = flatMap(optionMonad, option1, x ->
                flatMap(optionMonad, option2, y ->
                        optionMonad.pure(x + y) // Combine the results
                )
        );
        System.out.println(Option.narrowK(result));  // Output: Some(15)


        Kind<OptionOf.µ, Integer> noneResult = flatMap(optionMonad, Option.none(), x ->
                flatMap(optionMonad, option2, y ->
                        optionMonad.pure(x + y)));
        System.out.println(Option.narrowK(noneResult)); //Output: None
    }
}
~~~~

Example: Applicative and `mapN` (PureFun)

~~~~java 
import com.github.tonivade.purefun.Kind;
import com.github.tonivade.purefun.type.Option;
import com.github.tonivade.purefun.typeclasses.Applicative;
import com.github.tonivade.purefun.Function2;

public class ApplicativeExample {

   public static void main(String[] args) {
      Applicative<Option.µ> optionApplicative = Option.applicative();

      Kind<Option.µ, Integer> option1 = Option.some(5);
      Kind<Option.µ, Integer> option2 = Option.some(10);
      Kind<Option.µ, String> option3 = Option.some("Result: ");

      Kind<Option.µ, String> result = optionApplicative.mapN(option1, option2, option3,
              (a, b, c) -> c + (a + b));
      System.out.println(Option.narrowK(result)); // Output: Some(Result: 15)
   }
}
~~~~

Example: Monad Transformers (PureFun)

~~~~java
import com.github.tonivade.purefun.Kind;
import com.github.tonivade.purefun.type.Option;
import com.github.tonivade.purefun.type.Try;
import com.github.tonivade.purefun.transformer.OptionT;
import com.github.tonivade.purefun.typeclasses.Monad;

public class MonadTransformerExample {
   public static void main(String[] args) {

      Monad<Try.µ> tryMonad = Try.monad();
      // OptionT<Try, A> represents an Option wrapped in a Try
      Monad<OptionT.µ<Try.µ>> optionTMonad = OptionT.monad(tryMonad);

      Kind<OptionT.µ<Try.µ>, Integer> successSome = OptionT.some(tryMonad, 5); // Try.success(Option.some(5))
      Kind<OptionT.µ<Try.µ>, Integer> successNone = OptionT.none(tryMonad);     // Try.success(Option.none())
      Kind<OptionT.µ<Try.µ>, Integer> failure = OptionT.of(tryMonad, Try.failure(new RuntimeException())); // Try.failure(...)

      Kind<OptionT.µ<Try.µ>, Integer> result = optionTMonad.flatMap(successSome, x ->
              optionTMonad.map(successNone, y -> x + y)
      );

      System.out.println(OptionT.narrowK(result));

      Kind<OptionT.µ<Try.µ>, Integer> result2 = optionTMonad.flatMap(successSome, x ->
              optionTMonad.map(successSome, y -> x + y)
      );
      System.out.println(OptionT.narrowK(result2));

      Kind<OptionT.µ<Try.µ>, Integer> failedResult = optionTMonad.flatMap(failure, x ->
              optionTMonad.map(successSome, y-> x + y)
      );
      System.out.println(OptionT.narrowK(failedResult));
   }
}
~~~~



### Scala Cat's HKT Approach

Cats uses a similar approach, but with some differences in naming and structure:

- **Type Constructor Representation**: In Cats, you directly refer to type constructors using a type parameter in square brackets, but with a "hole" using underscore. For example `F[_]` is a type constructor that takes a type parameter.
- **`Kind[F[_], A]`**: Cats defines `Kind` similarly to PureFun, to represent a type constructor applied to a type argument. But is usually used with its alias, `F[A]`.

```java
// build.sbt
libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0" // Use the latest Cats version
```


Example: Functor (Cats) 
~~~~ scala
import cats.Functor
import cats.implicits._ // Import syntax and instances

object FunctorExample {

  def map[F[_]: Functor, A, B](fa: F[A], f: A => B): F[B] = {
    Functor[F].map(fa)(f)
  }

  def main(args: Array[String]): Unit = {
    val option = Option(5)
    val mappedOption = map(option, (x: Int) => s"Number: $x")
    println(mappedOption) // Output: Some(Number: 5)

    val list = List(1, 2, 3)
    val mappedList = map(list, (x: Int) => s"Item: $x")
    println(mappedList) // Output: List(Item: 1, Item: 2, Item: 3)
  }
}
~~~~

Example: Monad (Cats) 

~~~~ scala
import cats.Monad
import cats.implicits._

object MonadExample {

  def main(args: Array[String]): Unit = {
    val optionMonad = Monad[Option]

    val option1 = Option(5)
    val option2 = Option(10)

    val result = optionMonad.flatMap(option1) { x =>
      optionMonad.map(option2) { y =>
        x + y
      }
    }
    println(result) // Output: Some(15)

    // Using for-comprehension (syntactic sugar for flatMap and map)
    val resultFor = for {
      x <- option1
      y <- option2
    } yield x + y
    println(resultFor) // Output: Some(15)
  }
}
~~~~
Example: Applicative `mapN` (Cats)
~~~~ scala
import cats.Applicative
import cats.implicits._

object ApplicativeExample {

  def main(args: Array[String]): Unit = {
    val optionApplicative = Applicative[Option]

    val option1 = Option(5)
    val option2 = Option(10)
    val option3 = Option("Result: ")

    val result = (option1, option2, option3).mapN { (a, b, c) =>
      c + (a + b)
    }
    println(result) // Output: Some(Result: 15)

     //Alternative syntax:
     import cats.syntax.apply._
     val result2 = (option1, option2, option3).mapN(_ + _ + _)
     println(result2)

  }
}
~~~~
Example: MonadTransformer (Cats)
~~~~ scala
import cats.Applicative
import cats.implicits._

object ApplicativeExample {

  def main(args: Array[String]): Unit = {
    val optionApplicative = Applicative[Option]

    val option1 = Option(5)
    val option2 = Option(10)
    val option3 = Option("Result: ")

    val result = (option1, option2, option3).mapN { (a, b, c) =>
      c + (a + b)
    }
    println(result) // Output: Some(Result: 15)

     //Alternative syntax:
     import cats.syntax.apply._
     val result2 = (option1, option2, option3).mapN(_ + _ + _)
     println(result2)

  }
}
~~~~

| Feature                  | PureFun (Java)                                    | Cats (Scala)                                                                  |
| :------------------------ | :------------------------------------------------- | :----------------------------------------------------------------------------- |
| HKT Representation       | `Kind<F.µ, A>`, `Witness` types                    | `F[A]` (using standard Scala type parameters and `F[_]` for the type constructor)                         |
| Typeclass Instances     | Explicitly obtained (e.g., `Option.functor()`)    | Implicitly resolved (using context bounds and `cats.implicits._`)             |
| Syntax                  | More verbose                                        | More concise (due to `for` comprehensions, implicits, etc.)                  |
| Type Safety             | Strong, but requires `narrowK`                      | Strong, handled more seamlessly by the compiler                               |
| Monad Transformers       | Nested `Kind`s                                   | More natural syntax (e.g., `OptionT[Future, Int]`)                             |
| Learning Curve          | Steeper for those unfamiliar with HKT simulation   | Steeper initially (due to implicits, etc.), but more natural once mastered |
| Interoperability      | Designed for Java                                   | Designed for Scala                                                              |
| Boilerplate           | More boilerplate code.                            | Significantly less boilerplate.                                                  |


### Summary

PureFun provides a valuable way to bring some of the benefits of higher-kinded types and functional programming to Java. While it requires more boilerplate and a different way of thinking compared to plain Java, it enables more abstract and reusable code.  Cats, being built into a language designed with functional programming in mind (Scala), offers a more concise and integrated experience with HKTs. If you're working primarily in Java, PureFun is a good option. If you have the flexibility to use Scala, Cats (or Scalaz) provides a more powerful and idiomatic functional programming environment.


### Next time

Next time we conclude this series on type systems by looking at __Thunks__ and __Trampolines__ and how they can solve some problems with recursion.