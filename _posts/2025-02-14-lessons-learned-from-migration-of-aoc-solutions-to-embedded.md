---
title: Lessons learned from migration of Advent of Code solutions to Embedded
date: 2025-02-14 00:00:00 Z
tags:
- Rust
- system programming
- embedded systems
categories:
- Tech
summary: Following Advent of Code 2024, I migrated some of my solutions to run on a Raspberry PI Pico microcontroller
author: smartin
---
*TODO Fix day9 - Stack Overflow in Windows, part 2 never migrated*

*TODO Sort out headers: content, levels, etc. c.f. Chris' Mobiumata blog post*

### **Introduction**  

#### **About Advent of Code**  
[Advent of Code](https://adventofcode.com/) is an annual programming competition that runs throughout December, offering daily coding challenges that increase in complexity. The problems often involve computationally intensive tasks like pathfinding, recursion, and data manipulation, which made them challenging to solve when running on embedded hardware with limited resources.  

#### **What Drove the Decision to Attempt the Migration**  
Initially, my Advent of Code solutions were written in Rust using the standard library, running on a typical desktop or laptop with ample processing power and memory. In January, after Advent of Code had officially completed for the year, I was discussing with my collegue Chris the challenges encountered and whether they were solvable on more constrained hardware. Thus was born the challenge to implement solutions on bare-metal hardware, specifically on a Raspberry Pi Pico. Questions I was interested in:  

- Would a tiny microcontroller like the Pi Pico handle Advent of Code challenges effectively?
- Could it process intensive computations within reasonable time limits?  
- Would the process of implementing solutions for the more constrained hardware be rewarding?

#### **What the Raspberry Pi Pico Brings to the Table**  
The Raspberry Pi Pico is a microcontroller based on the **RP2040** chip. It has the following characteristics relevant to the challenge:  

- **Dual-core ARM Cortex-M0+ processor** running at up to 133 MHz  
- **264 KB of SRAM**, and 2MB of external flash  

While the Pico is powerful for a microcontroller, it lacks the conveniences of a full-fledged operating system—no dynamic memory allocation (`malloc`/`free`), no standard I/O, and no built-in file system. This makes running Advent of Code solutions particularly tricky, as they often involve handling large data sets, recursion-heavy algorithms, and complex computations.  

#### **Goals of the Migration**  
I decided that migrating the first 10 days of my Advent of Code solution would be a sufficiently challenging objective. It would include challenges solved by 75% of those participants who completed at least day 1 (based on [completion statistics summary](https://adventofcode.com/2024/stats)):
<img src='{{ site.baseurl }}/smartin/assets/advent_of_code_2024_stats.PNG' alt='Advent of Code Completion Statistics'/>

Migrating my Advent of Code solutions to `no_std` Rust on the Pi Pico meant setting some clear objectives:  

- **Successfully run Rust solutions on bare-metal hardware** without relying on an operating system.  
- **Rewrite problem solutions to work without heap allocation**, adapting algorithms to work efficiently with limited stack space.  
- **Document challenges and solutions** encountered during the migration, to help others who might attempt something similar.  

This post will detail that journey: the technical hurdles, lessons learned, and ultimately whether this experiment was worth the effort.

#### **Why Rust Was Chosen**  

##### **Overall: Experience, Compiles to Native**  
Rust has been my language of choice for Advent of Code due to its strong type safety, powerful pattern matching, and high-performance execution. Rust compiles directly to native machine code, which means it can run efficiently without requiring a runtime environment. This is particularly useful for computationally heavy problems that involve recursion, graph traversal, or large-scale data processing.  

Additionally, Rust’s strict borrow checker helps catch potential memory safety issues at compile time, making it a great fit for complex problem-solving where correctness is crucial. Given my prior experience with Rust in a standard development environment, I wanted to see how well it would translate to a completely different domain: bare-metal embedded development.  

##### **For Embedded: Supported, Active Community**  
Rust has rapidly gained traction in the embedded systems world, thanks to its **`no_std`** support and an active community working on microcontroller-friendly libraries. The **Rust Embedded Working Group** maintains key crates like:  

- [`embedded-hal`](https://github.com/rust-embedded/embedded-hal) – A common interface for hardware abstraction layers  
- [`rp2040-hal`](https://github.com/rp-rs/rp-hal) – A Rust HAL (Hardware Abstraction Layer) for the Raspberry Pi RP2040  
- [`defmt`](https://github.com/knurling-rs/defmt) – A lightweight logging framework optimized for embedded environments  

With strong community support, evolving tooling, and increasing adoption in industry, Rust seemed like the right choice for an embedded experiment like this.  

#### **Pertinent Characteristics of the Pi Pico**  

##### **Small RAM**  
As mentioned before, one of the biggest limitations of the Raspberry Pi Pico is its comparatively **small RAM size—only 264 KB**. Which is a drastic step down from the **gigabytes** of RAM typically available in a desktop environment. Many Advent of Code problems involve working with large datasets, such as parsing long input files or storing intermediate results in complex data structures. Managing memory efficiently—without the safety net of dynamic allocation—will prove to be a key challenge.  

##### **Application Code and Constants in Flash**  
Unlike a traditional computer where the OS loads an application into RAM, the Pi Pico executes code directly from external **flash memory**. This means:  

- **Code and constants reside in flash**, leaving RAM primarily for stack and heap usage.  
- **Flash memory is slower than RAM**, so excessive access can impact performance.  
- **Flash has a limited number of write cycles**, making it unsuitable for frequent modifications at runtime.  

This required careful consideration of where data was stored, ensuring that large immutable structures could be placed in flash while keeping frequently modified data in RAM.  

#### **Challenges From My Coding Style**  

##### **Heavily Based on Containers**  
Switching from `std` to `no_std` changes how you think about programming. Gone are the days of freely allocating memory, using high-level debugging tools, or relying on OS abstractions. Instead, every byte matters, and careful planning is required to make the most of limited resources.  

In a normal Rust development environment, I tend to rely heavily on collections like `Vec`, `HashMap`, and `BTreeMap` to store and process data. These structures provide flexibility, dynamic resizing, and convenient API methods for common operations. However, in a `no_std` environment, these **standard collections are unavailable** because they rely on heap allocation.  

When transitioning from `std` to `no_std`, several commonly used features disappear:  

- **Panics and Error Handling (`std::panic`, `std::error`)**  
   - The default panic behavior in `std` assumes access to `println!` or `stderr`, which don’t exist in `no_std`.  
   - Instead, panics must be handled with **custom handlers**, often blinking an LED, halting or resetting the device.  

- **Standard Debugging Tools (`println!`, `dbg!`)**  
   - Without a console or terminal, `println!` doesn’t work.  
   - Debugging requires alternatives, in my case using a Raspberry PI Debug Probe, which permits use of **lightweight logging (`defmt`)**, with logging materialised on a host with log display capacity.

- **Replacement for Standard Containers**  
Instead of standard containers, I use stack-allocated size-bounded alternatives:
   - Instead of `Vec`, I use [`arrayvec::ArrayVec`](https://docs.rs/arrayvec/latest/arrayvec/struct.ArrayVec.html),
   - Instead of `HashSet`, I use [`scapegoat::SgSet`](https://docs.rs/scapegoat/latest/scapegoat/struct.SgSet.html), 

### **3. Setting Up the Development Environment**  
### **Setting Up the Development Environment**  

#### **Toolchain Setup for `no_std` on the Pi Pico**  
To compile Rust for the Raspberry Pi Pico, we need a toolchain that supports **`no_std`** and targets the RP2040’s **ARM Cortex-M0+** architecture. The process involves:  

1. **Installing Rust and the ARM target**  
   Since the RP2040 is an ARM-based microcontroller, we need the appropriate Rust target:  

   ~~~sh
   rustup target add thumbv6m-none-eabi
   ~~~  
   This tells Rust to compile for the **`thumbv6m-none-eabi`** target, which is suitable for the Cortex-M0+ CPU.  

2. **Installing the `probe-rs` tooling**  
   `probe-rs` is a modern tool for flashing and debugging Rust programs on embedded devices:  

   ~~~sh
   cargo install probe-rs cargo-embed
   ~~~  

3. **Setting Up the Rust Standard Library and Allocator**  
   - For `no_std`, we don’t use the standard Rust runtime (`std`), so our `Cargo.toml` must include:  

     ~~~toml
     [dependencies]
     cortex-m = "0.7"
     cortex-m-rt = "0.7"
     embassy-embedded-hal = "0.1.0"
     embedded-hal = "0.2"
     panic-probe = "0.3"
     ~~~
   - `cortex-m-rt` provides the **startup runtime**, ensuring correct entry points.  
   - `panic-halt` exits a `probe-run` with an error code.  

4. **Using `cargo` for Embedded Builds**  
   We need to configure Cargo to build for the this target by default, by adding a `.cargo/config.toml` file:  

~~~toml
[build]
target = "thumbv6m-none-eabi"
~~~ 
   Now, running `cargo build` will automatically compile for the RP2040.  

#### **Setup for Experiments (Windows vs Pico Runner)**  
As the process for migrating existing Advent of Code solutions from a **`std`** environment is challenging, I set up two execution environments:  

1. **Windows**  
   - Used for minimising development time, as no need to flash memory and runs on high speed CPU
   - Has access to full system memory so solutions can still run out of memory on microcontroller
   - Solutions adapted to run without dynamic memory
   - Ran test cases and verified correctness before porting to embedded.  
   - Cargo command line to run:

~~~sh
cargo run --target=x86_64-pc-windows-msvc --bin winmain --features log
~~~

2. **Raspberry Pi Pico**  
   - Used for final testing of the migration process and performance analysis.  
   - Used **serial output (UART)** instead of `println!` for debugging.  
   - Measured execution speed to compare embedded performance vs. PC.  
   - Cargo command line to flash, and run (with debug probe connected):

~~~sh
cargo run --bin embassy_runner --features defmt
~~~

This dual setup allowed me to test the `no_std` migration on Windows before evaluating performance on the target microcontroller.  

4. Import of the Problem Data
Before the solution migration can be evaluated, the problem input data must be read. On a standard OS, I simply read this from a file. However, in an embedded no_std environment, there’s no filesystem, so I had to explore alternative methods:

1. **Hardcoding the Data as a Rust String (&str)**
## Store the problem input directly in the Rust source code as a string constant:

~~~rust
const INPUT: &str = "123\n456\n789\n...";
~~~
- Pros:  
  - Simple, easy to use.
- Cons:  
  - The Rust compiler stores &str in read-only memory (Flash), but it’s UTF-8 encoded, which might introduce unnecessary overhead.
  - Large inputs can clutter the source file.

2. **Embedding the Data as a Byte Array (include_bytes!)**
Use Rust’s compile-time macro to embed the file as a byte array:

~~~rust
const INPUT: &[u8] = include_bytes!("input.txt");
~~~
- Pros:  
  - Efficiently stores data in Flash without modification.
  - No need to manually escape special characters (unlike hardcoded &str).
  - Avoids unnecessary UTF-8 validation overhead.
  - Does not clutter the source file with literal data.
- Cons:
  - The data is in raw bytes, so I would have to convert it to a string if needed.

3. **Storing Data in an Allocated Buffer in RAM**
Data could be manually copied into a statically allocated buffer at runtime (from either of the above flash-based initial options):

~~~rust
static mut INPUT_BUFFER: [u8; 1024] = [0; 1024];
~~~
- Pros:  
  - Allows runtime modification of data.
- Cons:  
  - Wastes RAM, which is extremely limited on the RP2040.
  - Needs unsafe code to mutate the static buffer.

**Why I Selected `include_bytes!`**
Ultimately, I chose `include_bytes!` because it provided a balance of efficiency and simplicity:  
- Stores data directly in Flash, preserving RAM for computation.
- Avoids the need for manual encoding/escaping that a &str constant would require.
- Works seamlessly in no_std without requiring additional crates or allocators.
- I didn't anticipate needing to work with the data as a string, so that potential concern wasn't an issue.


### **5. Parsing the Input**  
Once the problem data was embedded using `include_bytes!`, the next step was **parsing it into a usable format**. In a standard Rust setup, I tend to parse the input data using [`regex::Regex`](https://docs.rs/regex/latest/regex/struct.Regex.html). However, in a `no_std` environment, I found it impossible to get to work in the absence of `alloc`, so I investigated other options.

Given that the input was stored as a **byte array (`&[u8]`) in Flash**, I considered several approaches for parsing:  

* **Using `arrayvec::ArrayVec` for Dynamic Parsing**  
   - As discussed earlier, we can use **fixed-capacity collections**, like `arrayvec::ArrayVec`, which act like `Vec` but without heap allocation:  

     ~~~rust
     use arrayvec::ArrayVec;
     let mut numbers: ArrayVec<u32, 100> = ArrayVec::new();
     for line in input_str.split(|&c| c == b'\n') {
         if let Ok(num) = core::str::from_utf8(line).unwrap().parse::<u32>() {
             numbers.push(num).ok(); // .ok() ignores push errors when full
         }
     }
     ~~~  
   - **Pros**:  
     - Allows **flexibility** in input size while remaining `no_std`.  
   - **Cons**:  
     - Needs to define an **upper limit** (`100` in this case).  
     - Involves **manual parsing logic**, which can get convoluted for complex inputs.  

* **Using `nom` for Robust Parsing** *(Final Selection)*  
   - [`nom`](https://docs.rs/nom/latest/nom/) is a **parser combinator library** that works in `no_std`, allowing parsing to be expressed in a declarative, reusable manner.  
   - Example for extracting numbers from input:  

     ~~~rust
     use nom::{
         bytes::complete::take_until,
         character::complete::u32,
         multi::separated_list1,
         combinator::all_consuming,
         IResult,
     };

     fn parse_numbers(input: &[u8]) -> IResult<&[u8], heapless::Vec<u32, 100>> {
         let (input, numbers) = separated_list1(take_until("\n"), u32)(input)?;
         Ok((input, arrayvec::ArrayVec::from(&numbers).unwrap()))
     }
     ~~~  
   - **Pros**:  
     - **Declarative and reusable** – makes parsing logic more readable.  
     - **Optimized and memory-safe** – doesn’t require unnecessary allocations.  
     - **Works well with `arrayvec::ArrayVec`** – efficiently manages parsed data in RAM.  
   - **Cons**:  
     - Slightly **larger code size** than manual parsing.  
     - Still need to define an **upper limit** on collections (`100` in this case).  
     - Large **Learning curve** if unfamiliar with parser combinators.  

#### **Why I Selected `nom`**  
In the end, I chose `nom` because it provided the best trade-off between:  

- **Readability** : Parsing logic is clear and modular.  
- **Efficiency** : Works in `no_std` with `heapless::Vec`.  
- **Scalability** : Easily adaptable to more complex AoC problems.  

While `arrayvec::ArrayVec` was useful for dynamic storage, `nom` handled the actual **parsing logic** in a way that was both **memory-efficient and expressive**.  

---

### **6. Challenges Faced in the Migration**  


### **Challenges (e.g., Out of Stack Space in Methods)**  
The primary issues I found in running on the microcontroller, after code was proven working on the `no_std` Windows runner related to memory pressure, or which the trickiest issue I (repeatedly) ran into was **stack overflows**. The RP2040 has **only 264KB of RAM**, and each function call consumes stack space. Problems arose when:  

1. **Using Deep Recursion**  
   - Many AoC problems use recursion, but deep recursion can quickly **overflow the stack**.  
   - Solution: Convert recursive functions to **iterative** versions using a stack data structure.  

   Example: Changing a recursive DFS to an **explicit stack-based loop**:  

   ~~~rust
   let mut stack = heapless::Vec::<u32, 100>::new();
   stack.push(start).unwrap();

   while let Some(node) = stack.pop() {
       // Process node
   }
   ~~~
2. **Allocating Large Buffers on the Stack**  
   - Declaring a **large local array** inside a function caused stack overflows.  
   - Solution: Use `static` memory instead of stack allocation:  

   ~~~rust
   static BUFFER: StaticCell<[u8; 1024]> = StaticCel::new(); // Stored in global memory
   .
   .
   .
   fn analyse() {
      let buffer = BUFFER.init_with(|| [0; 1024]);
      // Usage of buffer
   }

   ~~~

---


### **6. Results: Comparative performance**  
*TODO: REWRITE THIS*
   - Table of results for each day (windows vs pico)  

| Problem | Windows Runtime | Pico Runtime |
|:--------|:----------------|:-------------|
|       1 |               0 |         2646 |
|       2 |               0 |          125 |
|       3 |              14 |           54 |
|       4 |               1 |           84 |
|       5 |              17 |         4648 |
|       6 |              79 |        37231 |
|       7 |             821 |       186184 |
|       8 |              17 |         3459 |
|       9 |                 |              |
|      10 |               2 |         1187 |

   - Justifications / Rationale  

### **7. Conclusion and Next Steps**  
I found rust a natural fit for embedded projects. While the support crates are still in active development, they are mature enough to perform meaningful development. Compilation to native code and flashing to on-board flash is a painless process once the one-time setup is in-place.

If I were to migrate equivalent code to run on a microcontroller in future, I would look into using an **embedded allocator**, for example:  
  - [`alloc-cortex-m`](https://docs.rs/alloc-cortex-m/latest/alloc_cortex_m/) – Provides a heap allocator for Cortex-M chips like the RP2040.  
  - [`linked_list_allocator`](https://docs.rs/linked_list_allocator/) – A simple, `no_std`-friendly allocator.

In future, I would like to expand my embedded experience with projects where microcontrollers more naturally have a role to play, for example control of peripherals (lights, motors, ...)

If you are interested in viewing the code associated with this blog, my original solutions to Advent of Code (all days) are available [here](https://github.com/SMartinScottLogic/advent_2024). The migrated solutions are [here](https://github.com/SMartinScottLogic/advent_2024_embassy).

