---
title: 'Learning Through Doing: From one language to another'
date: 2025-08-06 00:00:00 Z
categories: 
- Tech
tags:
- rust
- C#
- learning
summary: When I wanted to learn a new programming language and a new programming paradigm, I decided to cut my teeth on a practical problem.
author: csalt
---
Although I'm an experienced developer, there is always new technology to learn.  It's impossible for one person, after all, to learn every possible tech stack and every possible language.  A few months ago, in a gap between projects, I decided to spend some time experimenting with a language that I'd heard was getting some interesting attention, which I'd heard a few of my friends and colleagues talking about.  The Rust programming language.

## What's different about Rust?

Despite being possibly the only programming language to be named after a fungal infection, Rust has become widely-used in the ten years since Version 1.0 of the language was released.  Moreover, it's extremely popular among its users, is known for having a very friendly and welcoming user community, and has been measured to be [one of the most power-efficient modern programming languages](https://www.technologyreview.com/2023/02/14/1067869/rust-worlds-fastest-growing-programming-language/), increasing the speed of code and literally using less power than functionally-equivalent code written in other languages.  Why is that, and why does that make it popular?

Rust is a fully compiled language, meaning that its code is compiled down to machine code binary files which a computer's CPU can run directly.  This is the same as the languages C and C++, but very different to, say, C# or Java.  Although those languages are compiled, they compile to "bytecode", binary files to run on an imaginary CPU, and the language runtime then has to interpret that bytecode at runtime.  Although a lot of work has been done over the twenty or thirty years that those languages have been around, to try to optimise the runtime process, it still adds overhead.  Python and JavaScript, similarly, are interpreted at runtime.

C and C++ both have a reputation for being fast but difficult, because they leave most of the memory management aspects of coding to the developer.  Because of this, it's very easy for a developer to introduce subtle bugs to a program.  Memory leaks, for example, where a running process slowly bloats over time; or crashes when the program tries to access memory that it hasn't asked for.  Situations where the developer frees up memory, but then refers back to it again, are legal in C/C++ and can create nasty bugs that don't behave predictably at runtime, or which occur in production but not in the debugger.  In short: when writing in a low level language like this, there are lots of dragons to beware of.

The other languages I mentioned above, on the other hand, are all memory-managed.  They all feature runtime "garbage collectors", which track what memory is in use, and don't free any parts of it up until it definitely can't be accessed any more.  You just can't have some of the classes of bugs I mentioned above in a memory-managed language, because the runtime does that management for you.

Developers who only ever use memory-managed languages---including me, most of the time---get used to never really having to worry about their memory.  In the modern world, we just always assume that the memory will be there, we can use as much of it as we want, and we never have to worry about throwing it away because the garbage collector will still clean up afterwards.  Most of the time, this works!  We don't really need to think about it.  However, at the edges, we can start to hit problems purely because we're not used to thinking about it.  I've had developers come ask me for help with code which crashes on a dataset a fraction of their available memory in size, or a web front-end which runs fine for half an hour than randomly falls over, all because they're accidentally forgetting to clean things up, or leaving dangling references that are stopping the garbage collector from cleaning up.  The higher-level abstraction of memory hides the problem away, right up until it becomes a bigger problem.  Moreover, because the garbage collector is a runtime task, it takes processing time itself.  For some workloads, this can become significant and make a noticeable difference to performance; and again, when the developer becomes used to having memory abstracted away, it's easy to accidentally write code which will potentially generate a large garbage collection load.

Like C and C++, Rust doesn't have a garbage collector.  Unlike them, it promises that it won't suffer from memory bugs.  How?

Instead, Rust has a compiler feature called the "borrow checker".  This statically analyses the code for potential memory issues at compile time.  In some ways, you can think of it as being like a compile-time garbage collector.  At places in the code where it spots a piece of memory can no longer be used, it inserts the sort of calls that a garbage collector would have to work out it could make at runtime, the sort of calls that a C/C++ developer needs to make manually.  And if it spots a construction that might cause a bug, it refuses to compile.  It does this in a way that would also prevent race conditions in multithreaded code: at any point in execution, only one block of code can have the right to change any particular value in memory.  If there's any ambiguity about which block of code that is, the code won't compile.

This compile-time safety is why some well-respected people have said that [companies writing low-level code should stop creating new projects in C or C++, and should move to safer languages like Rust instead](https://www.theregister.com/2022/09/20/rust_microsoft_c/).  It's also why Rust is [often considered hard to learn](https://ntietz.com/blog/rust-resources-learning-curve/): there are lots of subtle semantics, there are situations where the developer needs to explicitly bring in Rust-specific constructs such as "lifetime specifiers", and these things are *impossible to avoid* when you're just starting out learning the language.

My question was, then: what would be the easiest way for *me* to learn it?

## Tackling that steep learning curve

