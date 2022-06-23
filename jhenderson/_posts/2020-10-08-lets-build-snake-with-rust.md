---
author: jhenderson
title: "Let's Build Snake with Rust"
summary: "Learn Rust, the tech industry's most loved programming language by building Snake, the simple but addictive game found preloaded on old Nokia mobile phones."
layout: default_post
categories:
  - Tech
---

Since 2016, Rust has been voted the "most loved programming language" every year in the Stack Overflow Developer Survey by what appears to be a growing margin, and after checking it out for myself, it's pretty clear why.

Rust offers a plethora of features you'd expect from a modern language and addresses pain points that are present in many others. It competes in the same kind of space occupied by C and C++, offering similar performance, but it is also known for safety, reliability and productivity.

The trade-off with Rust is in its complexity, however; it has a reasonably steep learning curve, particularly with regards to its unique memory management model known as ownership.

In this post, we'll explore a step by step implementation of Snake, the simple but addictive game found preloaded on old Nokia phones. We'll use the terminal as the UI and the keyboard for input.

I should preface this post by stating that I am by no means an expert in Rust. I've been learning it on and off in my spare time for the past year or so. I've also more or less thrashed the game out without much thought for code quality, just as a learning exercise more than anything else.

You can find the code for the game [on GitHub](https://github.com/jrhenderson1988/snake-rs), where I would also be happy to address issues or make corrections to this post.

## Getting started

Let's create our project using Rust's build system and package manager, [Cargo](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html).

~~~bash
$ cargo new snake-rs
~~~

This command creates a new Rust project called "snake-rs", in a folder of the same name in the current directory. It creates a `~/Cargo.toml` file and a `~/src/main.rs` file inside that folder. `Cargo.toml` is a bit like `package.json` for JavaScript/NPM based projects, or `pom.xml` in a Java/Maven project and the `main.rs` contains a *main* function which is the entry point to the application.

~~~rust
fn main() {
    println!("Hello, world!");
}
~~~

## Foundation

Let's start with a few building blocks for the game.

### The Direction Enum

The snake will always be travelling in one of four different directions, so we'll use an [`enum`](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html) to define the `Direction` type:

~~~rust
// src/direction.rs

#[derive(Debug, Copy, Clone, Eq, PartialEq)]
pub enum Direction {
    Up,
    Right,
    Down,
    Left
}
~~~

Enums in Rust are just like those found in Java; they define a fixed set of possible variants for a value. In the code above, the `pub` declares that the enum type is *public*; in Rust everything is considered private unless explicitly stated otherwise.

`#[derive(...)]` is an attribute (annotation) which automatically derives implementations of some *traits* for the type.

A [trait](https://doc.rust-lang.org/book/ch10-02-traits.html) in Rust is similar to an interface with default methods in Java 8+. It is an abstraction which can declare methods that either contain a body, or must be implemented by the concrete type.

The traits named in the `#[derive(...)]` attribute come from the Rust standard library and they each have a special meaning. By using this attribute, Rust automatically makes our enum implement those traits and provides their implementations.

### The Command Enum

The controls for the game will be pretty simple. The player will use the directional arrows on a keyboard to tell the snake to *turn* to face a different direction. We'll also let the player *quit* the game by pressing `ESC`, `Q` or `CTRL+C`.

Let's create an enum to represent these commands:

~~~rust
// ~/src/command.rs

use crate::direction::Direction;

pub enum Command {
    Quit,
    Turn(Direction),
}
~~~

Simple enough! The only two variants of the `Command` enum are `Quit` and `Turn`.

`Turn` also accepts a value of type `Direction`, which happens to be the enum that we created earlier. Unlike enums in languages like Java, individual variants of Rust enums may also contain data such as basic types, structs, or even other enums.

When we receive a `Command` we can easily determine if we have a *quit* or *turn* instruction, and if the latter, which *direction* we've been asked to turn.

The `use` statement is just like the `import` statement in Java, in that it allows the use of symbols without the need to specify the full path. The `crate` keyword at the beginning of the path simply refers to the root of the current [crate](https://doc.rust-lang.org/book/ch07-01-packages-and-crates.html), which in this case is the current application.

### The Point Struct

Our game will be based on a positive, two-dimensional coordinate system, starting from (0, 0). To represent each point in the system, let's declare another type:

~~~rust
// ~/src/point.rs

#[derive(Debug, Copy, Clone, Hash, Eq, PartialEq)]
pub struct Point {
    pub x: u16,
    pub y: u16,
}
~~~

This looks a little different to the data structures we've seen so far. We've used a [`struct`](https://doc.rust-lang.org/book/ch05-01-defining-structs.html) to declare our custom type. A struct is a little like a Java class, in that it represents a type that can be instantiated and hold several different, named pieces of data with different types.

Our struct stores two fields, `x` and `y`, both of which have the unsigned 16-bit integer type, `u16` (which holds values between 0 and 65535). Rust has many [different integer types](https://doc.rust-lang.org/book/ch03-02-data-types.html#integer-types), both signed and unsigned and of varying sizes.

Lastly, we've used `pub` on each of the fields to signify that their values are accessible from outside the struct instance.

We could have just as easily used a `(u16, u16)` [tuple type](https://doc.rust-lang.org/book/ch03-02-data-types.html#the-tuple-type) to represent such a simple value, but for convenience and to allow us to extend this type further, a struct is a better choice.

We'll now add some methods to this struct to make it a bit more useful:

~~~rust
// ~/src/point.rs

impl Point {
    pub fn new(x: u16, y: u16) -> Self {
        Self { x, y }
    }

    pub fn transform(&self, direction: Direction, times: u16) -> Self {
        let times = times as i16;
        let transformation = match direction {
            Direction::Up => (0, -times),
            Direction::Right => (times, 0),
            Direction::Down => (0, times),
            Direction::Left => (-times, 0),
        };

        Self::new(
            Self::transform_value(self.x, transformation.0),
            Self::transform_value(self.y, transformation.1),
        )
    }

    fn transform_value(value: u16, by: i16) -> u16 {
        if by.is_negative() && by.abs() as u16 > value {
            panic!("Transforming value {} by {} would result in a negative number", value, by);
        } else {
            (value as i16 + by) as u16
        }
    }
}
~~~

In Rust, we separate the implementation of a struct from its definition unlike in Java where we'd have everything in one place. We use an `impl` block to add methods and functions to the struct.

The first part inside the `impl` block declares a function ([`fn`](https://doc.rust-lang.org/rust-by-example/fn.html)) named *new*. Unlike in Java, Rust does not have constructors; instead, struct instances may be created directly by specifying the values of all fields:

~~~rust
let point = Point { x: 1, y: 2 };
~~~

A common convention is to create a *constructor function* named *new* which can simplify the creation of structs, especially if manual creation is error prone, verbose or there are commonly used default values (which can be omitted from the constructor function's parameter list).

The `new` function accepts two values, `x` and `y` of type `u16` and returns (indiciated by `->`) a `Self`. In Rust, `Self` (with the uppercase *S*) refers to the type we're implementing, in this case `Point`.

The body of the function is a single line which simply creates and returns a `Point` instance. The syntax may look a little odd, but it could be rewritten like this:

~~~rust
return Point { x: x, y: y };
~~~

When creating a data structure, we can use the shorthand `x` in place of `x: x` if the name of the variable/symbol is the same as the field. Also, just like in Scala, if the `return` keyword is not used, the result of the last expression is assumed to be the return value. This means that the `return` keyword can in most cases be omitted entirely, provided that a semicolon is not used (which would turn the expression into a statement).

`transform` looks a little different; the first thing in its parameter list is `&self`. This means that the function will receive a read-only reference to the instance of the struct which can be accessed using `self`, similar to Java's `this` keyword except that we're not allowed to make any modifications.

The presence of `&self` (or `&mut self`) as the first item in the parameter list means that the function is a method which operates on an instance of the struct. An omission of this first item means that we're working with what is like a static method in Java; we don't receive an instance of the struct to operate upon, we're just writing a function which happens to be attached to the struct. If you've done any Python, this may feel somewhat familiar.

~~~rust
// A "static" method is called with Type::function(...)
let a = Point::new(1, 2);

// but we use dot notation to call an instance method: instance.method(...)
let b = a.transform(Direction::Up, 1);
~~~

`transform` accepts a `Direction` and `times`, an unsigned 16-bit integer and returns a *new* `Point`. It first casts `times` to a signed integer so that it can support negative values and uses a `match` to work out a transformation to apply based on the current `direction`.

The [`match` control-flow operator](https://doc.rust-lang.org/book/ch06-02-match.html) is an extremely powerful feature of Rust, similar to Scala's `match` or a significantly improved `switch` statement from Java. Its syntax is pretty intuitive; we simply check each of the branches on the left side of the `=>` arrow and evaluate the expression to the right side for the matching branch.

We then uses the private function, `transform_value` to create new `x` and `y` values based on the transformation and the `Point`'s current values. `transform_value` uses an [`if` expression](https://doc.rust-lang.org/book/ch03-05-control-flow.html#if-expressions) to carry out a bounds check and then applies the transformation by adding `by` to `value`.

If the bounds check fails (which should ideally never happen), the [`panic!` macro](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html) is used to bail out of the application with a fatal error.

## Ownership and Borrowing

Before we go any further with the game it is worth mentioning [ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) and [borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html), since we've already touched on them a little in the previous sections.

### Ownership

One of the unique, core features of the language, the concept of ownership helps Rust deliver on its memory safety guarantees. However, the subject is also one of the biggest stumbling blocks for beginners and is probably the biggest contributor to its steep learning curve.

In Rust, variables are declared with the `let` keyword. By default, all variables are immutable; they cannot be re-assigned and their values cannot be changed. It is possible to declare a variable as mutable using the `mut` keyword:

~~~rust
fn main() {
    let mut a = 1;  // a is declared as 1 (mutable).
    a = 2;          // a is now 2.

    let b = 1;      // b is declared as 1 (immutable).
    b = 2;          // Compilation error. Since we tried to re-assign an immutable variable.
}
~~~

When execution comes to the end of a scope in which a variable is declared, the value will be dropped and the memory will be reclaimed. This is all managed at compile time:

~~~rust
fn main() {
    let a = 1;
    if true {
        let b = 2;
        // b is dropped here
    }
    // a is dropped here
}
~~~

A variable is considered to be the *owner* of a value and there can only ever be one owner at any given time. By default, re-assigning a value *moves* ownership, which means that the original variable is no longer valid:

~~~rust
struct Foo {}

fn main() {
    let a = Foo {}; // Declare a to be an immutable instance of Foo
    let b = a;      // a is moved to b, a ceases to be valid
    let c = a;      // Compilation error. Since the value of a was moved to b, a is no longer valid
}
~~~

A move will also occur when passing a value to a function:

~~~rust
struct Foo {}

fn main() {
    let a = Foo {}; // Declare a to be an immutable instance of Foo
    bar(a);         // a is moved to the bar function, a ceases to be valid
    let b = a;      // Compilation error. Since the value of a was moved to the f parameter of bar,
}                   // a is no longer valid

fn bar(f: Foo) {
    println!("Called bar");
}
~~~

An exception to this rule is if the type implements the `Copy` trait (remember `#[derive(Copy, Clone...)]` from earlier?). This trait marks that the type should be copied, rather than moved.

If `Foo` implemented the `Copy` trait, the two previous code snippets would compile and each variable (`a`, `b` and `c` in the first, as well as `a`, `b` and the `f` parameter of `bar` in the second) would hold distinct, but identical instances of `Foo`.

> There are some types in Rust that implement `Copy` by default:
>
> - All of the signed and unsigned integer types (like `i32`, `u64` etc.)
> - Floating point types like `f64`
> - The boolean type `bool`
> - The character type `char` 
> - Tuples that only contain types that implement `Copy` (e.g. `(i32, char)` does but `(i32, String)` does not).

### References and Borrowing

The move and copy semantics may initially seem pretty tedious and you may be wondering how to work with such seemingly bizarre restrictions. Bear with me, things will soon become clear (hopefully - this is a pretty tricky concept to grasp).

Rust supplements the ownership system with a mechanism called borrowing, which allows access to data without taking ownership.

An immutable reference (or borrow) of a variable can be created using the `&` operator. This allows read-only access to a value without transferring ownership. Multiple immutable references may be created from a single variable:

~~~rust
#[derive(Debug)]    // Derive an implementation of the Debug trait. This allows us to use instances
struct Foo {}       // of Foo in println!() macros, using the {:?} placeholder

fn main() {
    let a = Foo {}; // Declare a to be an immutable instance of Foo
    let b = &a;     // Declare b as an immutable reference of a
    let c = &a;     // Declare c as a second immutable reference of a
    println!("{:?} {:?}", b, c);
}
~~~

Functions and methods can also accept immutable references of types to allow them to be called without ownership being moved:

~~~rust
#[derive(Debug)]
struct Foo {}

fn main() {
    let a = Foo {}; // Declare a to be an immutable instance of Foo
    bar(&a);        // Pass an immutable reference of a to bar. Note the signature of the bar function
                    // At this point, a still owns the instance of Foo
    let b = a;      // Re-assign a to b (notice we didn't use &), a ceases to be valid and b is now the owner
}

fn bar(f: &Foo) {   // The bar function accepts an immutable reference of type Foo
    println!("Called bar");
    // f goes out of scope here, but since it is a reference (not owned), the value is NOT dropped
}
~~~

Remember before when we created some methods on our data structures and `&self` appeared as the first item in the parameter list? As you might be able to guess here, `self` refers to the current instance and `&` means immutable reference; these methods operate upon an immutable reference of an instance of `Foo`. They may *read* properties and call other read-only methods:

~~~rust
#[derive(Debug)]
struct Foo {
    value: u32
}

impl Foo {
    pub fn bar(&self) {             // An immutable reference of an instance of Foo is received
        println!("{}", self.value); // Print the value field of the instance of Foo
    }
}

fn main() {
    let a = Foo { value: 12 };      // Declare a as Foo, with the value field initialised to 12
    a.bar();                        // Call the bar method on a; a is passed as an immutable
                                    // reference to the bar method
    println!("{:?}", a);
}
~~~

A mutable reference can also be created using `&mut`, but only if the variable is declared as mutable:

~~~rust
struct Foo {}

fn main() {
    let mut a = Foo {}; // Declare a as a mutable instance of Foo
    let b = &mut a;     // Declare b as a mutable reference of a

    let c = Foo {};     // Declare c as an immutable instance of Foo
    let d = &mut c;     // Compilation error. Since a is not mutable, it cannot be mutably borrowed
}
~~~

A mutable reference is allowed to modify the value it refers to, but in the above example, `Foo` does not have anything that can be changed.

There can only ever be *one* mutable reference of a value at a time. It is possible to create what appears to be multiple mutable references, but the act of creating another effectively invalidates the previous. Attempting to use the first mutable reference after another mutable reference has been created results in a compilation error:

~~~rust
#[derive(Debug)]
struct Foo {}

fn main() {
    let mut a = Foo {};     // Declare a as a mutable instance of Foo
    let b = &mut a;         // Declare b as a mutable reference of a
    let c = &mut a;         // Declare c as a mutable reference of a; b is invalidated
    println!("{:?}", b);    // Compilation error. Since b is invalid. If we'd tried to 
                            // print c instead, compilation would have succeeded.
~~~

Functions can also accept mutable references and may modify the value that they refer to:

~~~rust
#[derive(Debug)]
struct Foo {
    pub value: u32                  // Note that the value field is declared to be public
}

fn main() {
    let mut a = Foo { value: 12 };  // Declare a as a mutable instance of Foo with value 12
    bar(&mut a);                    // Pass a mutable reference of a to function bar
    println!("{:?}", a.value);      // After calling bar, a.value is 13, so this prints "13"
}

fn bar(f: &mut Foo) {               // bar accepts a mutable reference of foo
    f.value = 13;                   // bar modifies the internal value field of foo
}
~~~

We can also create instance methods on data structures that can mutate state, using `&mut self` as the first item in the parameter list:

~~~rust
struct Foo {
    value: u32
}

impl Foo {
    pub fn add_1(&mut self) {       // A mutable reference of an instance of Foo is received
        self.value += 1;            // The value field is modified, by adding 1 to its current value
        println!("{}", self.value); // The current value is printed.
    }
}

fn main() {
    let mut a = Foo { value: 12 };  // Declare a as a mutable instance of Foo, with initial value 12
    a.add_1();                      // Call the add_1 method; the value field is changed to 13 and
}                                   // then the new value is printed out.
~~~

Mutable and immutable references are mutually exclusive. It is not possible to have both at the same time:

~~~rust
#[derive(Debug)]
struct Foo {}

fn main() {
    let mut a = Foo {};     // Declare a as a mutable instance of Foo
    let b = &a;             // Declare b as an immutable referece of a
    let c = &mut a;         // Declare c as a mutable reference of a, effectively invalidating b.
    println!("{:?}", b);    // Compilation error. Since we cannot have simultaneous mutable and
}                           // immutable references, b is effectively invalidated by c
~~~

Don't worry if you don't quite get ownership, references and borrowing just yet. It's a notoriusly difficult concept to grasp, especially for developers coming from garbage collected languages since it feels like everything you know to be true is pulled out from under you.

If you're interested in learning more, I'd recommend reading the sections on [ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) and [borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html) in the Rust book.

## Back to Snake

Now we've at least attempted to address ownership and borrowing, let's get back to building the game.

### The Snake Struct

~~~rust
// ~/src/snake.rs

use crate::direction::Direction;
use crate::point::Point;

#[derive(Debug)]
pub struct Snake {
    body: Vec<Point>,
    direction: Direction,
    digesting: bool,
}
~~~

To represent the snake itself, we've used a `struct` comprised of 3 fields:

- `body` is a `Vec` (vector) over the `Point` type, which you can think of as a list that holds values of type `Point`. Each (x, y) item in `body` represents a point in the game's grid that is occupied by a part of the snake. The very first item in the `body` is always the head of the snake.
- `direction` represents the direction which the snake is currently facing using our `Direction` enum that we declared earlier. The snake will always face up, down, left or right.
- `digesting` represents whether or not the snake has just eaten some food. We use this flag to indicate that the snake should grow when it next moves.

Now for its implementation, step by step:

~~~rust
// ...

impl Snake {
    pub fn new(start: Point, length: u16, direction: Direction) -> Self {
        let opposite = direction.opposite();
        let body: Vec<Point> = (0..length)
            .into_iter()
            .map(|i| start.transform(opposite, i))
            .collect();

        Self { body, direction, digesting: false }
    }
~~~

The `new` constructor function creates an instance of the `Snake` struct from a starting point, a length and a direction. There's a lot going on here so we'll examine it line by line:

- First, the `opposite` method on the `direction` is called. This method does not yet exist; we'll get to that in just a moment. When implemented, it will return the opposite direction to the value we are operating upon. For example, if `direction` was `Direction::Right`, then it would return `Direction::Left` and so on.
- The next bit is made up of a few different parts:
  - `(0..length)` creates a `std::ops::Range` which is a struct that represents the numbers from 0 up to (but not including) `length`.
  - `into_iter` creates an iterator which allows us to iterate over the range.
  - `map` creates a `std::iter::Map` over the iterator, which allows us to apply a transformation to each `u16` value.
  - The code inside the call to `map` is a closure, where `|i|` is the parameter where `i` is each `u16` item from the iterator.
  - The closure uses `start` and the `transform` method to return a new `Point` for every `i` which is effectively `i` steps in the `opposite` direction from the `start`.
  - `collect` executes the operation (since everything up until this point is lazy) and brings together a resulting `Vec` of type `Point` representing the body of the snake.
- Finally, we use the `body`, we've just created, the `direction` passed into `new` and the default value of `false` for `digesting` to create and return a new instance of `Self`/`Snake`.

The next four read-only methods above are significantly simpler.

~~~rust
    pub fn get_head_point(&self) -> Point {
        self.body.first().unwrap().clone()
    }
~~~

`get_head_point` returns a clone of the first `Point` of the `body` field, which represents the head of the snake.

The `first` method returns an `Option<&Point>` which is an enum that represents either `Some` value or `None`, which would be returned if the vector was empty. Rust doesn't have a concept of null, so it relies on types like `Option` to represent the existence or lack of a value.

The `unwrap` method simply assumes that the `Option` is `Some`, containing a value and returns it. If it was `None`, `unwrap` would panic.

Now we have an immutable reference to a `Point` which refers to a value within the vector. Since we'd like our function to just return a `Point` instead of `&Point`, we use `clone` to create a copy of it.

~~~rust
    pub fn get_body_points(&self) -> Vec<Point> {
        self.body.clone()
    }
~~~

`get_body_points` returns a clone of the `body` field. Rust's `Vec` type doesn't implement `Copy`, so if we didn't have the call to `clone` it would try to *move* the value which is not allowed. Another option would have been to return an immutable reference `&Vec<Point>` instead, but I've just opted to use clone to make things a little easier to digest.

~~~rust
    pub fn get_direction(&self) -> Direction {
        self.direction.clone()
    }
~~~

`get_direction` just returns a clone of the `direction` field. We could have omitted `.clone()` entirely here since `Direction` implements `Copy` but just to make it clear what's happening and for consistency with the other methods, I've opted to add a call to `clone`.

~~~rust
    pub fn contains_point(&self, point: &Point) -> bool {
        self.body.contains(point)
    }
~~~

`contains_point` is a method that accepts a `&Point` (an immutable reference to a point) and returns a boolean value, which tells if the snake's body contains that point.

The following few methods all mutate the state of the snake, so they have the mutable reference receiver `&mut self` as the first item in their parameter lists.

~~~rust
    pub fn slither(&mut self) {
        self.body.insert(0, self.body.first().unwrap().transform(self.direction, 1));
        if !self.digesting {
            self.body.remove(self.body.len() - 1);
        } else {
            self.digesting = false;
        }
    }
~~~

`slither` is a method that is called to make the snake move across the grid.

It works by taking the first point of the snake's body (the head), transforming it 1 step in the snake's current direction and inserting that new point into the beginning of the body, effectively making the new point the new head of the snake.

It then removes the last point in the snake. This has the effect of shifting all of the points along to simulate a slithering motion on the grid.

If `digesting` is `true`, we don't bother removing the last point and we reset `digesting` back to `false`. This means that we increase the size of the snake by only adding to the head.

~~~rust
    pub fn set_direction(&mut self, direction: Direction) {
        self.direction = direction;
    }
~~~

`set_direction` updates the `direction` field of the snake to match the `direction` provided.

~~~rust
    pub fn grow(&mut self) {
        self.digesting = true;
    }
}
~~~

Finally, `grow` simply sets the `digesting` field to `true` so that the next slither causes the snake to increase in size.

## Missing Method

We're currently missing a method from the `Direction` enum, so let's add it now:

~~~rust
// ~/src/direction.rs

impl Direction {
    pub fn opposite(&self) -> Self {
        match self {
            Self::Up => Self::Down,
            Self::Right => Self::Left,
            Self::Down => Self::Up,
            Self::Left => Self::Right,
        }
    }
}
~~~

The `opposite` method returns the `Direction` that is the opposite to the current variant using the `match` control-flow operator.

Notice that we have only a single `match` expression without a semi-colon, which means we return the result of that expression.

We match on `self`, which is the current direction, and compare it to each of the arms until we find a match. The expression is then evaluated to the opposite variant. For example, if the current direction is `Direction::Down`, we'd match the third arm of the statement and which would evaluate to `Direction::Up`.

## The Game Logic

Congratulations for getting this far. This blog post is turning out to be a lot longer than I expected and it's about to get longer!

We have all of our building blocks so it's now time to work on fitting it all together.

### Some Dependencies

Let's begin by adding a couple of dependencies to our `Cargo.toml` file.

~~~toml
[dependencies]
crossterm = "0.17"
rand = "0.7.3"
~~~

Since we're going to build the UI of the game in the terminal, we'll use [Crossterm](https://github.com/crossterm-rs/crossterm) to handle the differences between different platforms and generally make interacting with the terminal a bit easier.

We'll also need to generate some random numbers to position the food on the grid so we'll use the [`rand`](https://github.com/rust-random/rand) crate for that.

### The Game Struct

~~~rust
// ~/src/game.rs

use crate::snake::Snake;
use crate::point::Point;
use crate::direction::Direction;
use std::io::Stdout;
use std::time::{Duration, Instant};
use crossterm::terminal::size;
use crate::command::Command;
use rand::Rng;

const MAX_INTERVAL: u16 = 700;
const MIN_INTERVAL: u16 = 200;
const MAX_SPEED: u16 = 20;

#[derive(Debug)]
pub struct Game {
    stdout: Stdout,
    original_terminal_size: (u16, u16),
    width: u16,
    height: u16,
    food: Option<Point>,
    snake: Snake,
    speed: u16,
    score: u16,
}

impl Game {
    pub fn new(stdout: Stdout, width: u16, height: u16) -> Self {
        let original_terminal_size: (u16, u16) = size().unwrap();
        Self {
            stdout,
            original_terminal_size,
            width,
            height,
            food: None,
            snake: Snake::new(
                Point::new(width / 2, height / 2),
                3,
                match rand::thread_rng().gen_range(0, 4) {
                    0 => Direction::Up,
                    1 => Direction::Right,
                    2 => Direction::Down,
                    _ => Direction::Left
                },
            ),
            speed: 0,
            score: 0,
        }
    }

    // ...
~~~

This struct represents our game state which is the glue that fits everything together. In our constructor function, we capture the standard output stream object, [stdout](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout)) since we'll be using the terminal to represent our UI and we accept a `width` and `height` which determines the area of the grid system for our game.

We're going to resize the terminal window, so we need to get the current size of the window so that we can restore it later. We use Crossterm's `size` function and `unwrap` the returned `Result<(u16, u16)>` to do this.

The position of the food is set to `None` initially, since it will be generated when the game starts. We position the snake's head in the middle of the grid as determined by the `width` and `height` provided, give it a fixed size of `3` and we randomly choose its direction by generating a random integer between 0 and 4 (not inclusive) and matching to a `Direction`.

The `score` and `speed` of the game are both initialised to `0`.

### Running the Game

Now we get into the primary logic of the game, the `run` method. There's a lot to cover here.

~~~rust
    pub fn run(&mut self) {
        self.place_food();
        self.prepare_ui();
        self.render();

        let mut done = false;
        while !done {
            let interval = self.calculate_interval();
            let direction = self.snake.get_direction();
            let now = Instant::now();

            while now.elapsed() < interval {
                if let Some(command) = self.get_command(interval - now.elapsed()) {
                    match command {
                        Command::Quit => {
                            done = true;
                            break;
                        }
                        Command::Turn(towards) => {
                            if direction != towards && direction.opposite() != towards {
                                self.snake.set_direction(towards);
                            }
                        }
                    }
                }
            }

            if self.has_collided_with_wall() || self.has_bitten_itself() {
                done = true;
            } else {
                self.snake.slither();

                if let Some(food_point) = self.food {
                    if self.snake.get_head_point() == food_point {
                        self.snake.grow();
                        self.place_food();
                        self.score += 1;

                        if self.score % ((self.width * self.height) / MAX_SPEED) == 0 {
                            self.speed += 1;
                        }
                    }
                }

                self.render();
            }
        }

        self.restore_ui();

        println!("Game Over! Your score is {}", self.score);
    }
~~~

### Placing the Food

We start off by calling an instance method of the `Game` struct called `place_food`, which looks like this:

~~~rust
    fn place_food(&mut self) {
        loop {
            let random_x = rand::thread_rng().gen_range(0, self.width);
            let random_y = rand::thread_rng().gen_range(0, self.height);
            let point = Point::new(random_x, random_y);
            if !self.snake.contains_point(&point) {
                self.food = Some(point);
                break;
            }
        }
    }
~~~

It uses Rust's `loop` construct to create an infinite loop and creates a `Point` from randomly generated x and y coordinates.

We check to make sure that the point is not already part of the snake's body by calling the `contains_point` method of the `Snake` struct and finally set the value of the `food` field to `Some(point)` and break from the loop.

Remember, the type of the `food` field is `Option<Point>` which can hold either `Some(...)` or `None`. If the random point that we generated already existed as part of the snake's body, then we simply try again on the next iteration of the loop.

> This method could no doubt be improved, but it's sufficient for our needs in this demo.

### Setting up the UI

The `prepare_ui` method uses Crossterm to set everything up to begin rendering the game:

~~~rust
    fn prepare_ui(&mut self) {
        enable_raw_mode().unwrap();
        self.stdout
            .execute(SetSize(self.width + 3, self.height + 3)).unwrap()
            .execute(Clear(ClearType::All)).unwrap()
            .execute(Hide).unwrap();
    }
~~~

First,we enable raw mode which ensures that user input is passed directly to our application without the terminal driver intercepting and carrying out processing of its own. We then set the size of the terminal and clear the screen as well as hide the cursor.

### Rendering

The next part of the `run` method is a call to a `render` method.

This method and those it calls simply use Crossterm's API to draw all of the visual aspects of the game including the snake itself, the border around the grid and the food.

We won't dig into this method any further since this post is already long enough! If you'd like to dig into the rendering side of the game, check out the [source code on GitHub](https://github.com/jrhenderson1988/snake-rs/blob/5ee9763c8e26f76d7af9a401f58bcce04f181833/src/game.rs#L176).

### The Loop

Next, we set up a flag, `done` which provides our `while` loop with an exit condition. The `while` loop begins with a little bit of setup. First, we call a method to calculate the `interval`, which is effectively how long each iteration of the while loop should take:

~~~rust
    fn calculate_interval(&self) -> Duration {
        let speed = MAX_SPEED - self.speed;
        Duration::from_millis(
            (MIN_INTERVAL + (((MAX_INTERVAL - MIN_INTERVAL) / MAX_SPEED) * speed)) as u64
        )
    }
~~~

Let's explain this calculation.

- We take the difference between `MAX_INTERVAL` and `MIN_INTERVAL`; in this case, we have 700 - 200 which results in 500.
- We divide this number by the `MAXIMUM_SPEED`, which is 20 so we end up with 25 milliseconds per unit of speed.
- Since the `speed` field starts at 0 and increases to `MAX_SPEED`, we subtract its value from the `MAX_SPEED` and multiply the 25 milliseconds we calculated earlier to get a total number of milliseconds that we should add onto the minimum to get the real interval.
- We cast the value to an unsigned 64-bit integer that `Duration::from_millis` accepts and return it.

For example, if we take the starting speed of 0, we would end up with a 700ms interval since `(200 + (((700 - 200) / 20) * (20 - 0))) = 700`. Now let's say we take a speed of `5`; we would end up with a 575ms interval since `(200 + (((700 - 200) / 20) * (20 - 5))) = 575`.

The next line gets the current direction of the snake for this iteration. We store this to be able to compare it to the player's input to prevent illegal moves. The following line gets the time at the beginning of the iteration.

### Responding to player input

The next block of code is all about gathering and responding to the player's input and waiting for the calculated interval before executing the rest of the loop.

The `while` loop ensures that we keep checking for the user's input until the interval has elapsed. `now.interval()` returns a `Duration` which represents the amount of time that has elapsed since `now` was created. If that duration is less than the interval (which will be between 700ms and 200ms depending on the current speed), then the body of the loop will execute.

The next line involves a call to `self.get_command(...)` passing through the difference between the interval and the time that has elapsed since the beginning of the loop.

`get_command` is an instance method that uses Crossterm's API to wait up to a given timeout for the player's input and returns an `Option<Command>`. A valid command will be returned from the method, wrapped in an `Option`'s `Some` variant and an invalid command (or if the timeout expires) will be returned as `None`:

~~~rust
    fn get_command(&self, wait_for: Duration) -> Option<Command> {
        let key_event = self.wait_for_key_event(wait_for)?;

        match key_event.code {
            KeyCode::Char('q') | KeyCode::Char('Q') | KeyCode::Esc => Some(Command::Quit),
            KeyCode::Char('c') | KeyCode::Char('C') =>
                if key_event.modifiers == KeyModifiers::CONTROL {
                    Some(Command::Quit)
                } else {
                    None
                }
            KeyCode::Up => Some(Command::Turn(Direction::Up)),
            KeyCode::Right => Some(Command::Turn(Direction::Right)),
            KeyCode::Down => Some(Command::Turn(Direction::Down)),
            KeyCode::Left => Some(Command::Turn(Direction::Left)),
            _ => None
        }
    }

    fn wait_for_key_event(&self, wait_for: Duration) -> Option<KeyEvent> {
        if poll(wait_for).ok()? {
            let event = read().ok()?;
            if let Event::Key(key_event) = event {
                return Some(key_event);
            }
        }

        None
    }
~~~

First, a call to `wait_for_key_event` is made, which uses Crossterm's API to wait until the player does something or the `wait_for` duration elapses.

Immediately following the call to `wait_for_key_event`, there is a [`?`](https://doc.rust-lang.org/edition-guide/rust-2018/error-handling-and-panics/the-question-mark-operator-for-easier-error-handling.html), which is an operator to make error handling in Rust easier and less verbose.

A common pattern when using the `Result<T, E>` or `Option<T>` enum types in Rust is to use a `match` or an `if let` to check the variant that was returned and immediately return the associated `Err` or `None`, if found:

~~~rust
let result = get_an_option();
let val = match result {
    Some(value) => value,
    None => return None,
}
~~~

The `?` operator may be used to reduce the verbosity of this common pattern and simply returns the `Err` or `None` from the method if encountered and causes the value that is wrapped by the `Ok` or `Some` variants to be returned to the caller. Therefore, the code above could be simplified to:

~~~rust
let val = get_an_option()?;
~~~

Inside the `wait_for_key_event` method, the `poll` function waits *up to* the given duration and returns a `Result<bool>` which tells if an event is available i.e. the player pressed a key, moved their mouse etc.

The `ok` method of the `Result` is called, which converts it into an `Option`. This is then followed by the `?` operator, which will immediately return the `None` variant, if one is returned, otherwise the expression will evaluate to the `bool` value inside the `Option`.

When the `if` evaluates to `true`, we can guarantee that an event is waiting to be read. Calling the subsequent `read` method, using `Result::ok` to get an option and the `?` to return `None` if necessary, we get a Crossterm `Event` enum.

Finally, we use an `if let` to assert that the event was a Crossterm `KeyEvent` and we return it to the caller. In all other cases, `None` is returned.

Back to `get_command`, we then `match` the keycode of the key event and return a `Command` wrapped in a `Some` (since the method returns an `Option<Command>`) if the key-press corresponds to one we were expecting.

All other key-presses, events or if the `wait_for` duration passed to the method elapses, result in a `None` being returned.

Back to the game loop, we use `if let` again to check that `Some(Command)` was returned and we then `match` the command to an appropriate action.

If a `Command::Quit` variant was received, we simply set `done` to true and break from the current loop. Setting `done` to `true` satisfies the exit condition of the outer loop so this has the effect of effectively ending the game.

On the other hand if the command we receive is a `Command::Turn(Direction)`, we first check if the direction that the player has pressed is legal, given the current direction of the snake (the snake may not turn back on itself) and if so we set the snake's direction using its `set_direction` method.

### Detecting Collisions

After we've waited until the interval has elapsed, it is time to check to see if the snake is about to either collide with a wall or itself. If any of these conditions are met, we set `done` to `true` which effectively ends the game.

`has_collided_with_wall` uses the current direction of the snake and the point that represents its head to determine if the next move would result in the snake going out of bounds / hitting the wall:

~~~rust
    fn has_collided_with_wall(&self) -> bool {
        let head_point = self.snake.get_head_point();

        match self.snake.get_direction() {
            Direction::Up => head_point.y == 0,
            Direction::Right => head_point.x == self.width - 1,
            Direction::Down => head_point.y == self.height - 1,
            Direction::Left => head_point.x == 0,
        }
    }
~~~

When the snake is facing up or down, we check if the snake's head's `y` coordinate is either `0` or one less than the height of the grid, respectively.

Similarly, when the snake is facing left or right, we check if the its head's `x` coordinate is either `0` or one less than the width of the grid, respectively.

If this method returns `true`, then the snake is about to go out of bounds.

~~~rust
    fn has_bitten_itself(&self) -> bool {
        let next_head_point = self.snake.get_head_point().transform(self.snake.get_direction(), 1);
        let mut next_body_points = self.snake.get_body_points().clone();
        next_body_points.remove(next_body_points.len() - 1);
        next_body_points.remove(0);

        next_body_points.contains(&next_head_point)
    }
~~~

`has_bitten_itself` works out the *next* head position of the snake and the points that would be in its body, if it were to proceed.

Since the snake's body includes the head of the snake at position `0`, we remove the first point and finally we return whether the `next_body_points` contains the `next_head_point`.

If this method returns `true` then the snake is considered to be about to bite itself.

When either `has_collided_with_wall` or `has_bitten_itself` evaluate to `true`, we exit the game loop by setting the `done` flag to `true`, ending the game.

### Slithering on

Now that we can rest assured that the game is in a legal state, we make the snake move by calling its `slither` method, which we described earlier.

This is followed by an immediate check to see if the snake has eaten the food that is placed on the grid.

Since the `food` field is an `Option`, we use an `if let` to make sure that there is `Some` food for the snake to eat (from the beginning of the game there should always be some food) and we then check to see if the snake's head is currently (after slithering) at the same position of the food.

If so, we call the snake's `grow` method which will cause the snake's body to grow on the next slither. We also call the game's `place_food` method again, which chooses another random point that is not currently occupied by the snake's body to place the next food.

We then increment the score by `1` and decide whether or not to increase the speed of the game.

To make this decision, we take the area of the grid by multiplying the `width` and `height` and then divide that area by the `MAX_SPEED`, which is currently fixed to `20`. Assuming a grid size of 10x10, that would result in an area of 100, which we divide by 20 to get `5`.

This number determines how many points the player must accumulate before the speed increases to the next step.

In this instance, the speed of the game would increase from 0 to 1 when the player achieves a score of 5 and it would increase from 4 to 5 when a player achieves a score of 25.

Finally, we draw the next frame of the game by calling the `render` method and the game loop continues.

### Ending the Game

If the player sends a quit command to the game, by pressing `Q`, `ESC` or `CTRL+C` or if the player loses by colliding with the wall or by allowing the snake to bite itsself, the game ends.

We call the `restore_ui` method to reset all of the adjustments we've made to the terminal by restoring the size, clearing the game from the screen, showing the cursor, resetting the colour and disabling raw mode:

~~~rust
    fn restore_ui(&mut self) {
        let (cols, rows) = self.original_terminal_size;
        self.stdout
            .execute(SetSize(cols, rows)).unwrap()
            .execute(Clear(ClearType::All)).unwrap()
            .execute(Show).unwrap()
            .execute(ResetColor).unwrap();
        disable_raw_mode().unwrap();
    }
~~~

Once the terminal has been restored, we print out the user's score and the `run` method returns to its caller.

## The Entry Point

Back to our `~/src/main.rs`, we just need to initialise and run the game:

~~~rust
mod snake;
mod direction;
mod game;
mod point;
mod command;

use crate::game::Game;
use std::io::stdout;

fn main() {
    Game::new(stdout(), 10, 10).run();
}
~~~

In Rust, the `main` function inside `~/src/main.rs` is the entry point to an application. We instantiate a `Game` by calling `Game::new(...)` passing through the stdout object which we get from calling the `std::io::stdout` function as well as the game grid width of `10` and height of `10`. We then call the `run` method on the `Game` struct that is returned.

An important thing to note is that Rust's [module system](https://doc.rust-lang.org/1.30.0/book/2018-edition/ch07-01-mod-and-the-filesystem.html) requires the developer to be more explicit when creating modules than in other languages.

The `mod` keyword must be used to declare a module. The name specified after the `mod` keyword must either refer to a filename, or a folder containing a `mod.rs`. If a file is not explicitly declared as part of a module like this, then it is ignored.

Rust also allows modules to be declared directly, without using another file. For example, we could have written the `command` module directly in `main.rs` like this:

~~~rust
mod snake;
mod direction;
mod game;
mod point;
mod command {
    use crate::direction::Direction;

    pub enum Command {
        Quit,
        Turn(Direction),
    }
}

// ...
~~~

## Wrapping up

I hope this has been an insightful and practical introduction to Rust. We've come a long way and touched on many different areas of the language, but there's still so much that we didn't get into.

If you would like to learn more about Rust, I'd recommend reading [the Rust Book](https://doc.rust-lang.org/book/) or [Rust by Example](https://doc.rust-lang.org/rust-by-example/) for those who prefer a more practical approach to learning.

The code for Snake can be found on [GitHub](https://github.com/jrhenderson1988/snake-rs) where you can also raise an issue or submit a correction to this article.
