---
title: Higher Kinded Types with Java and Scala
date: 2025-03-21 00:00:00 Z
categories:
- Tech
tags:
- Java, Scala
author: magnussmith
summary: In this post we will see how Higher Kinded Types types can help increase the flexibility of our code.
image: magnussmith/assets/java.jpg
---

![functors_monads_hkt.webp]({{site.baseurl}}/magnussmith/assets/functors_monads_hkt.webp)

This is the fifth post in a series exploring types and type systems.   Previous posts have looked at

- [Algebraic Data Types with Java]({{site.baseurl}}/2025/01/20/algebraic-data-types-with-java.html)

- [Variance, Phantom and Existential types in Java and Scala]({{site.baseurl}}/2025/02/17/variance-in-java-and-scala.html)

- [Intersection and Union Types with Java and Scala]({{site.baseurl}}/2025/03/05/intersection-and-union-types-with-java-and-scala.html)

- [Functors and Monads with Java and Scala]({{site.baseurl}}/2025/03/21/functors-monads-with-java-and-scala.html)


In this post we will build upon our knowledge of  `Functors` and `Monads` from the previous post opens up the next level of abstraction with Higher-Kinded Types. 



## Higher Kinded Types (HKT)

In Java, we're used to generics, which let us create type parameters at one level.

**Java example**:

~~~~ java
interface Container<T> {
    T get();
}
~~~~

This allows us to work with `Container<String>`, `Container<Integer>`, etc. However, we cannot abstract over type constructors (e.g., Container itself). This is where HKTs come in—they allow us to create generic abstractions over generic types.

**Scala example**:
Scala supports HKTs natively

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




In *Java* we can think of `List` or `Optional` as *type constructors*, They take a *type* (`String`, `Integer`) as an argument and produce a concrete type (`List<String>`, `Optional<Integer>`).

A higher-kinded type is a type constructor that takes *another* type constructor as an argument.  Think of it as a "generic over generics."  Java's type system does not directly support this but we will see some techniques of how this can be simulated.


### Why are Higher-Kinded Types Useful?

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


### Scala Cat's HKT Approach

Cats uses a similar approach, but with some differences in naming and structure:

- **Type Constructor Representation**: In Cats, you directly refer to type constructors using a type parameter in square brackets, but with a "hole" using underscore. For example `F[_]` is a type constructor that takes a type parameter.
- **`Kind[F[_], A]`**: Cats defines `Kind` similarly to PureFun, to represent a type constructor applied to a type argument. But is usually used with its alias, `F[A]`.

```java
// build.sbt
libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0" // Use the latest Cats version
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

*Comparison*:

- Typeclass Instance:
   - PureFun: You explicitly get the Functor instance (e.g., `Option.functor()`) and pass it to your generic map function
   - Cats: You use a context bound (`F[_]: Functor`) on the type parameter `F`. This tells the compiler to implicitly find a Functor instance for `F` in the current scope. The `cats.implicits._` import provides these instances for common types. `Functor[F]` retrieves the implicit instance.
- HKT Representation:
   - PureFun: `Kind<Option.µ, Integer>`
   - Cats: `Option[Int]` (Cats uses the standard Scala type system for HKTs). We are using `F[A]` in the method signature to denote a higher kinded type.
- narrowK vs. Implicit Conversion:
  - PureFun: You need `Option.narrowK` to safely cast back to the concrete type.
  - Cats: Scala's type system handles this automatically.
- Syntax: Scala's for comprehensions and implicit conversions result in more concise and readable code.

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

*Comparison*:
- *for* Comprehension (Scala): Scala's *for* comprehension provides syntactic sugar for *flatMap* and *map*, making monadic code much more readable. Java lacks this feature.
- *Typeclass Instance*: Cats' *Monad[Option]* gets the implicit instance; Purefun uses *Option.monad()*.



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

*Comparison*:
- `mapN` (Cats): Cats provides a very concise syntax for mapN using tuples and the mapN extension method (from *cats.implicits._* or *cats.syntax.apply._*). PureFun's `mapN` is more verbose.
- Typeclass Instance: Both get the applicative in similar way.



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

*Comparison*:
- PureFun: Kind<OptionT.µ<Try.µ>, Integer> - nested Kinds. You need to explicitly get the Monad instance for the outermost type (OptionT).
- The Cats code is considerably less verbose due to Scala's features (for-comprehensions, implicits, type inference).


### Summary

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




*PureFun* provides a valuable way to bring some of the benefits of higher-kinded types and functional programming to Java. While it requires more boilerplate and a different way of thinking compared to plain Java, it enables more abstract and reusable code.  *Cats*, being built into a language designed with functional programming in mind (Scala), offers a more concise and integrated experience with HKTs. If you're working primarily in Java, PureFun is a good option. If you have the flexibility to use Scala, Cats (or Scalaz) provides a more powerful and idiomatic functional programming environment.


### Next time

Next time we conclude this series on type systems by looking at __Thunks__ and __Trampolines__ and how they can help solve some problems when working with recursion.