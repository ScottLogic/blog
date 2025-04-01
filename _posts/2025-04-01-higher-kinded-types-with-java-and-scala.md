---
title: Higher Kinded Types with Java and Scala
date: 2025-04-01 00:00:00 Z
categories:
- Tech
tags:
- Java, Scala
author: magnussmith
summary: In this post we will see how Higher Kinded Types types can help increase the flexibility of our code and reduce duplication.
image: magnussmith/assets/java.jpg
---

![higher_kinded_types.webp]({{site.baseurl}}/magnussmith/assets/higher_kinded_types.webp)

This is the fifth post in a series exploring types and type systems.  Other posts have looked at

- [Algebraic Data Types with Java]({{site.baseurl}}/2025/01/20/algebraic-data-types-with-java.html)

- [Variance, Phantom and Existential types in Java and Scala]({{site.baseurl}}/2025/02/17/variance-in-java-and-scala.html)

- [Intersection and Union Types with Java and Scala]({{site.baseurl}}/2025/03/05/intersection-and-union-types-with-java-and-scala.html)

- [Functors and Monads with Java and Scala]({{site.baseurl}}/2025/03/31/functors-monads-with-java-and-scala.html)


In this post we will build upon our knowledge of  `Functors` and `Monads` from the previous post to open up the next level of abstraction. 

## Higher Kinded Types (HKT)

In Java, we're used to generics, which let us create type parameters at one level.

**Java example**:

~~~~java
interface Container<T> {
    T get();
}
~~~~

This allows us to work with `Container<String>`, `Container<Integer>`, etc. However, we cannot abstract over type constructors (e.g., Container itself). This means we find ourselves having to duplicate logic.



~~~~java
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class DuplicationExample {

    // Uppercase for Optional
    public Optional<String> toUpperCase(Optional<Object> input) {
        return input.map(Object::toString).map(String::toUpperCase);
    }

    // Uppercase for List
    public List<String> toUpperCase(List<Object> input) {
        return input.stream()
                    .map(Object::toString)
                    .map(String::toUpperCase)
                    .collect(Collectors.toList());
    }
    
    public static void main(String[] args) {
        DuplicationExample ex = new DuplicationExample();

        Optional<String> opt = Optional.of("hello");
        System.out.println("Optional Uppercase: " + ex.toUpperCase(opt));
        // Optional[HELLO]

        List<Object> list = List.of("world", 123);
        System.out.println("List Uppercase: " + ex.toUpperCase(list)); // [WORLD, 123]
    }
}
~~~~

The core logic (`.map(Object::toString).map(String::toUpperCase)`) is identical, but we need separate methods because `Optional` and `List` have different APIs and don't share a useful common interface for this kind of operation at the container level.

In *Java* we can think of `List` or `Optional` as *type constructors* that take a *type* such as `String` or `Integer` as an argument and produce a concrete type `List<String>` ir `Optional<Integer>`.

A *higher-kinded type* is a type constructor that takes *another* type constructor as an argument.  Think of it as a "generic over generics."  In languages with HKT, you can write type-safe abstractions over generic containers. For example, a function that works for all `F[_]` types (e.g., `List`, `Option`, `Future`) could be written generically.


### Java Doesn't *Directly* Support HKTs

In Java, we can think of a "class" as a _kind_ of "type", such as `String` or generic `List<String>`.   

In Java we can also think of a class as a _name for a set of values that have something in common_, such that any one of those values can be used when an instance of the class is required. Say you have a class `Integer`, and if you have a variable of type `Integer`, you can assign any instance of `Integer` to it. The `Integer` class is in some sense just a way to describe the set of all `Integer` instances. We can say classes are a thing that is "higher" than instances.

In Java, a class describes a set of values; any time you need an instance of the class, you can use a value of that type.

What we are missing in Java is that we don't have a way to express the idea "any time I need a type that has certain operations, I can use a member of this class". For that we would need something higher than a type, which is higher than an instance. 

Java generics are limited to first-order types. That is, you can have `List<String>` or `Optional<Integer>`, but you can’t abstract over the type constructors themselves (`List[_]` or `Optional[_]`).

Java's type system does not directly support this, but we will see some techniques of how this can be simulated.



### Why are Higher-Kinded Types Useful?

Using HKTs allow us to write extremely generic and reusable code.  We can define functions that work with any type that has certain properties (like being a Functor or a Monad), regardless of its specific implementation.

**This gives some key benefits:**

- **Write More Generic and Reusable Code**: Instead of writing similar logic for different generic types (like `List`, `Optional`, etc.), we define a common interface like `Functor` or `Monad`.
- **Abstraction**: We can create code that works with concepts (like "mappable") instead of concrete types
- **Improve Type Safety**: They eliminate boilerplate and prevent code duplication while ensuring compile-time correctness.


### Simulating HKTs in Java: 
**Lightweight Higher-Kinded Polymorphism**


As explained you can't get true HKTs in Java. but by we can applying a technique called "**Lightweight Higher-Kinded Polymorphism**" also known as "*defuctionalisation*" you can simulate them to a useful degree.  

Using interfaces, type tags, and type classes the core idea involves 3 steps:

#### *Step 1:* Use Witness Types (or Kind Markers)

Create an interface that acts as a "marker" or "witness" for the type constructor. `ListKind` is the witness for the `List` type constructor.

#### *Step 2:* Represent Type constructors as data Type

Instead of a type constructor like `List<_>`, you create a separate data type to represent the concept of "List-ness".  It takes one type parameter `A `to produce a concrete type `List<A>`.


#### *Step 3:* Higher-Order Logic

We can write methods that operate on these representative types to simulate the behaviour of higher-kinded types:


**1. Witness Type (Kind Marker)**

~~~~java
  public interface Kind<F, A> {}
~~~~

where
 - `F` is the simulated type constructor such as `ListKind<?>`
 - `A` is the element type such as `List`


**2. Type constructor**

~~~~java
interface ListKind<A> extends Kind<ListKind<?>, A> {}
~~~~

**3. Functor interface (our "higher-kinded" concept)**

~~~~java
interface Functor<F> {
<A, B> Kind<F, B> map(Function<A, B> f, Kind<F, A> fa);
}
~~~~


**4. Conversion Operations**

~~~~java
public class ListKindHelper {
  public static <A> List<A> unwrap(Kind<ListKind<?>, A> kind) {
    return switch(kind) {
      case ListHolder<A> holder -> holder.list();
      case null -> Collections.emptyList();
      default -> throw  new IllegalArgumentException("Kind instance is not a ListHolder: " + kind.getClass().getName());
    };
  }

  public static <A> ListKind<A> wrap(List<A> list) {
    return new ListHolder<>(list);
  }

  record ListHolder<A>(List<A> list) implements ListKind<A> {
  }
}
~~~~

**5. Implement Functor**

~~~~java
public class ListFunctor implements Functor<ListKind<?>> {
  @Override
  public <A, B> ListKind<B> map(Function<A, B> f, Kind<ListKind<?>, A> fa) {
    List<A> list = unwrap(fa);
    List<B> result = new ArrayList<>();
    list.forEach(element -> result.add(f.apply(element)));
    return wrap(result);
  }
}
~~~~

**6. Monad**

Provides 'of' (lifting a value) and 'flatMap' (sequencing operations).

~~~~java
public interface Monad<M> extends Functor<M> {
  
  <A> Kind<M, A> of(A value);

  <A, B> Kind<M, B> flatMap(Function<A, Kind<M, B>> f, Kind<M, A> ma);


}
~~~~


**7. Implement Monad**

~~~~java
public class ListMonad extends ListFunctor implements Monad<ListKind<?>> {

  @Override
  public <A> ListKind<A> of(A value) {
    // Lifts a single value into a List context (singleton list).
    return wrap(Collections.singletonList(value));
  }

  @Override
  public <A, B> ListKind<B> flatMap(Function<A, Kind<ListKind<?>, B>> f, Kind<ListKind<?>, A> ma) {
    List<A> listA = unwrap(ma);
    List<B> resultList = new ArrayList<>();

    for (A a : listA) {
      // Apply the function f, which returns a Kind<ListKind<?>, B>
      Kind<ListKind<?>, B> kindB = f.apply(a);
      // Unwrap the result of f to get the inner List<B>
      List<B> listB = unwrap(kindB);
      // Add all elements from the inner list to the final result list
      resultList.addAll(listB);
    }
    // Wrap the flattened list back into ListKind
    return wrap(resultList);
  }
  
}
~~~~


~~~~java

 void listMonadExample() {
  // Instantiate the Monad implementations
  ListMonad listMonad = new ListMonad();

  // --- List Monad Example ---
  System.out.println("--- List Monad ---");

  // 1. Using of
  ListKind<Integer> ofList = listMonad.of(10);
  System.out.println("of(10): " + ListKindHelper.unwrap(ofList)); // Output: [10]

  // 2. Using map (from Functor, inherited by Monad)
  List<Integer> numbers = Arrays.asList(1, 2, 3);
  ListKind<Integer> numberKind = ListKindHelper.wrap(numbers);
  ListKind<String> stringsKind = listMonad.map(Object::toString, numberKind);
  System.out.println("map(toString): " + ListKindHelper.unwrap(stringsKind)); // Output: [1, 2, 3]

  // 3. Using flatMap
  // Function that takes an integer and returns a ListKind of integers (e.g., the number and itself * 10)
  Function<Integer, Kind<ListKind<?>, Integer>> duplicateAndMultiply =
          x -> ListKindHelper.wrap(Arrays.asList(x, x * 10));

  ListKind<Integer> flatMappedList = listMonad.flatMap(duplicateAndMultiply, numberKind);
  System.out.println("flatMap(duplicateAndMultiply): " + ListKindHelper.unwrap(flatMappedList)); // Output: [1, 10, 2, 20, 3, 30]

}

~~~~

### Further Simulations

We have seen how we can "_simulate_" HKT in Java defining a simple `Functor` and `Monad` capabilities for any `ListKind`.  We can extend this basic simulation to other _kinds_ such as an `OptionalKind`, a `MaybeKind` and an `EitherKind`.  

You can find all the [example simulation code](https://github.com/MagnusSmith/simulation-hkt) on Github. 

So although defunctionalisation is a clever technique ot overcome Java's lack of native HKT support, it comes with several significant drawbacks.

- **Increased Complexity and Boilerplate:**
  - **Witness Types:** You need to define "witness" interfaces or classes for each type class (like `Functor`, `Monad`) and concrete implementations for each type constructor you want to abstract over (`ListMonad`, `OptionalFunctor`, etc.). This adds a substantial amount of code that exists purely to encode the HKT pattern.
  - **Encoding (`Kind<F, A>`):** The common encoding involves marker interfaces or wrapper types (like `Kind<F, A>`) to represent the application of a type constructor `F` to a type `A`. This adds another layer of indirection.
  - **Explicit Passing:** Instances of these witness types often need to be explicitly passed around as arguments to methods that operate on the HKTs.
- **Verbosity:**
  - The boilerplate and encoding make the code significantly more verbose than it would be in a language with native HKT support (like Scala or Haskell).
  - Type signatures become much longer and harder to parse, involving nested generics and the Kind encoding (e.g., `Kind<Maybe, String>` instead of just `Maybe<String>` when used generically).
- **Type Inference Limitation:**
  - Java's type inference, while improved over the years, often struggles with the complex nested generics and witness types involved in HKT simulations.
- **Performance Overhead:**
  - **Object Allocation**: Creating witness instances and potentially wrapping/unwrapping values using the Kind encoding can lead to increased object allocation compared to direct type usage.
  
### Summary

In essence, simulating HKTs via defunctionalisation in Java is a trade-off: you gain the ability to abstract over type constructors (like `List`, `Optional`, `Try`) enabling powerful functional patterns, but at the cost of significant increases in code complexity, verbosity, potential performance overhead, and a steeper learning curve compared to standard Java practices or languages with native HKT support.


## Scala's approach

In contrast to Java, Scala has native support for Higher-Kinded Types. This means the language itself provides syntax and semantics to abstract over type constructors, making functional patterns significantly more elegant and less verbose than simulations involving defunctionalisation.

~~~~ scala
trait Functor[F[_]] {
  def map[A, B](fa: F[A])(f: A => B): F[B]
}
~~~~

Here, `F[_]` represents a type constructor (such as `List` or `Option`), not a concrete type like `List[Int]`. This means we can define generic behaviors for containers without knowing their exact type.

~~~~ scala
object ListFunctor extends Functor[List] {
  def map[A, B](fa: List[A])(f: A => B): List[B] = fa.map(f)
}

object OptionFunctor extends Functor[Option] {
  def map[A, B](fa: Option[A])(f: A => B): Option[B] = fa.map(f)
}
~~~~
With this pattern, we can now abstract over different "mappable" containers.

Notice how Functor and Monad define `F[_]` as a type parameter that itself takes a type parameter. This is what makes them higher-kinded.


### Scala Cats

The Cats library builds upon this native support to provide a rich ecosystem of type classes (like Functor, Applicative, Monad) that define common behaviours for these HKTs.

If you are using scala `3.6.4`, then add the cats core library to your sbt file

~~~~ java

libraryDependencies ++= Seq("org.typelevel" %% "cats-core" % "2.13.0")
~~~~


- **Type Constructor Representation**: In Cats, you directly refer to type constructors using a type parameter in square brackets, but with a "hole" using underscore. For example `F[_]` is a type constructor that takes a type parameter.
- **`Kind[F[_], A]`**: Cats defines `Kind` similarly to our simulation, to represent a type constructor applied to a type argument. But is usually used with its alias, `F[A]`.



Cats defines type classes that capture common functional patterns. These type classes are parameterised by HKTs. Let's look at a couple of examples:

### Functor Example

~~~~scala
import cats.Functor
import cats.syntax.functor._  // Import extension methods (adds .map to any Functor)


@main
def main(): Unit = {

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
~~~~

~~~~ scala
import cats.Functor
import cats.implicits._ // Import syntax and instances


  def map[F[_]: Functor, A, B](fa: F[A], f: A => B): F[B] = {
    Functor[F].map(fa)(f)
  }

  @main
  def main(): Unit = {
    val option = Option(5)
    val mappedOption = map(option, (x: Int) => s"Number: $x")
    println(mappedOption) // Output: Some(Number: 5)

    val list = List(1, 2, 3)
    val mappedList = map(list, (x: Int) => s"Item: $x")
    println(mappedList) // Output: List(Item: 1, Item: 2, Item: 3)
  }
~~~~

Notes:

- **Native Syntax:** We use F[_] directly. No need for marker interfaces like Kind<F, A>.

**Implicit Resolution:** The import *import cats.syntax.functor._:* brings in *extension methods* This "magic" allows Scala to add methods to existing types.  The [_]: Functor context bound tells Scala to automatically find and provide the correct Functor instance (Functor[List], Functor[Option]) where the function is called. No manual passing of "witness" objects. Cats provides these instances out-of-the-box for standard library types.

- **Conciseness:** The code is much less verbose. Type signatures are cleaner.

- **No Manual Wrapping/Unwrapping:** We work directly with `Option[Int]`. No need for explicit `KindHelper.wrap(...)` calls.

### `Applicative` Example

`Applicative` extends `Functor` and allows combining values within independent contexts (among other things). A common method is mapN which lets you apply a function to values inside multiple containers.


~~~~ scala

import cats.Applicative
import cats.implicits._

@main
def main(): Unit = {

  // Function generic over any Applicative F
  def combine[F[_] : Applicative](fa: F[Int], fb: F[String]): F[(Int, String)] = {
    // mapN uses the Applicative power to combine F[Int] and F[String]
    // into an F[(Int, String)] using the provided tuple-creating function.
    (fa, fb).mapN((intValue, stringValue) => (intValue, stringValue))
    // Shorter version: (fa, fb).tupled
  }

  // Usage with Option:
  val opt1: Option[Int] = Some(10)
  val opt2: Option[String] = Some("Cats")
  val optNone: Option[Int] = None

  val combinedOpts: Option[(Int, String)] = combine(opt1, opt2) // Some((10, "Cats"))
  val combinedNone: Option[(Int, String)] = combine(optNone, opt2) // None

  println(combinedOpts)
  println(combinedNone)

  // Usage with List: (Applicative for List gives Cartesian product)
  val list1: List[Int] = List(1, 2)
  val list2: List[String] = List("a", "b")

  val combinedLists: List[(Int, String)] = combine(list1, list2)
  // List((1,"a"), (1,"b"), (2,"a"), (2,"b"))

  println(combinedLists)
}
~~~~

Notes:

- **Seamless:** Methods like `mapN` work uniformly across any `F` that has an `Applicative `instance. The underlying mechanics (how Option handles None, how List creates a product) are abstracted away by the type class.

- **Readability:** The intent of combining `fa` and `fb` is clear, without the noise of simulation boilerplate.

- **Type safety:** The compiler ensures, via the implicit Applicative[F] constraint, that mapN can only be used with types F that logically support such an operation.


~~~~ scala
import cats.Applicative
import cats.implicits._

@main
def main(): Unit = {
  val optionApplicative = Applicative[Option]

  val option1 = Option(5)
  val option2 = Option(10)
  val option3 = Option(1)

  val result = (option1, option2, option3).mapN { (a, b, c) =>
    c + (a + b)
  }
  println(result) // Output: Some(Result: 16)

  //Alternative syntax:
  import cats.syntax.apply._
  val result2 = (option1,  option2, option3).mapN(_ + _ + _)
  println(result2) // Output: Some(Result: 16)

}
~~~~

Notes:

- **`mapN`:** Cats provides a very concise syntax for mapN using tuples and the mapN extension method (from *cats.implicits._* or *cats.syntax.apply._*).


### `Monad` Example

~~~~ scala
import cats.Monad
import cats.implicits._

@main
def main(): Unit = {
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
~~~~

Notes:

- **_for_ Comprehension:** Scala's *for* comprehension provides syntactic sugar for *flatMap* and *map*, making monadic code much more readable. Java lacks this feature.

- **Typeclass Instance:** Cats' *Monad[Option]* gets the implicit instance. 

- **The Cats code:**  It is considerably less verbose due to Scala's features (for-comprehensions, implicits, type inference).



### Summary 

As these examples show, Scala's native support for HKTs, combined with a library like Cats providing type class instances and syntax extensions, results in code that is:

- **More Concise:** Significantly less boilerplate compared to Java simulations.
- **More Readable:** Type signatures and implementation logic are clearer.
- **More Ergonomic:** Less ceremony (no manual witness passing, no Kind encoding/decoding).
- **Better Type Inference:** While Scala's inference isn't perfect, it generally handles these constructs more smoothly than Java's inference handles the complex simulation types.


This native approach makes functional patterns based on HKTs feel like a natural part of the language, rather than an intricate simulation built on top of it.

## Next time

Next time we conclude this series on type systems by looking at __Thunks__ and __Trampolines__ and how they can help solve problems when working with recursion where it can pay to be lazy.