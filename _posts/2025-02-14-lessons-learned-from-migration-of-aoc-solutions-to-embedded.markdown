---
title: Lessons learned from migration of Advent of Code solutions to Embedded
date: 2025-02-14 00:00:00 Z
tags:
- Rust
- system programming
- embedded systems
categories:
- Tech
summary: Following Advent of Code 2024, I migrated my solutions to run on a Raspberry PI Pico microcontroller
author: smartin
---

### **Introduction**  

#### **About Advent of Code**  
[Advent of Code](https://adventofcode.com/) is an annual programming competition that runs throughout December, offering daily coding challenges that increase in complexity. While primarily designed for fun and learning, many developers use it to explore new programming languages, test performance optimizations, or push the boundaries of constrained environments. The problems often involve computationally intensive tasks like pathfinding, recursion, and data manipulation—making them an interesting challenge when running on embedded hardware with limited resources.  

#### **What Drove the Decision to Attempt the Migration**  
Initially, my Advent of Code solutions were written in Rust using the standard library, running on a typical desktop or laptop with ample processing power and memory. However, I wanted to push the challenge further by running my solutions on bare-metal hardware, specifically on a Raspberry Pi Pico. This decision was driven by several factors:  

- **Exploring `no_std` Rust**: Moving away from the standard library introduces unique constraints, requiring a deeper understanding of Rust’s lower-level capabilities.  
- **Embedded Systems Experience**: I wanted hands-on experience with embedded development, including working with microcontrollers, managing memory manually, and handling direct hardware interactions.  
- **Performance Curiosity**: Would a tiny microcontroller like the Pi Pico handle Advent of Code challenges effectively? Could it process intensive computations within reasonable time limits?  
- **A Fun Constraint**: Adding an extra layer of difficulty to an already challenging competition made the experience even more rewarding.  

#### **What the Raspberry Pi Pico Brings to the Table**  
The Raspberry Pi Pico is a microcontroller based on the **RP2040** chip, featuring:  

- **Dual-core ARM Cortex-M0+ processor** running at up to 133 MHz  
- **264 KB of SRAM**, but **no built-in flash storage** (external flash is used)  
- **Low power consumption**, making it ideal for embedded applications  
- **Rich peripheral support**: GPIO, UART, SPI, I2C, PWM, ADC, etc.  

While the Pico is powerful for a microcontroller, it lacks the conveniences of a full-fledged operating system—no dynamic memory allocation (`malloc`/`free`), no standard I/O, and no built-in file system. This makes running Advent of Code solutions particularly tricky, as they often involve handling large data sets, recursion-heavy algorithms, and complex computations.  

#### **Goals of the Migration**  
Migrating my Advent of Code solutions to `no_std` Rust on the Pi Pico meant setting some clear objectives:  

- **Successfully run Rust solutions on bare-metal hardware** without relying on an operating system.  
- **Rewrite problem solutions to work without heap allocation**, adapting algorithms to work efficiently with limited stack space.  
- **Leverage the Raspberry Pi Pico’s capabilities** (e.g., using its hardware features where possible).  
- **Gain a deeper understanding of embedded Rust development**, particularly how `no_std` applications are structured and optimized.  
- **Document challenges and solutions** encountered during the migration, to help others who might attempt something similar.  

This blog will detail that journey—the technical hurdles, lessons learned, and ultimately whether this experiment was worth the effort. 🚀  

#### **Why Rust Was Chosen**  

##### **Overall: Experience, Compiles to Native**  
Rust has been my language of choice for Advent of Code due to its strong type safety, powerful pattern matching, and high-performance execution. Unlike interpreted languages like Python, Rust compiles directly to native machine code, which means it can run efficiently without requiring a runtime environment. This is particularly useful for computationally heavy problems that involve recursion, graph traversal, or large-scale data processing.  

Additionally, Rust’s strict borrow checker helps catch potential memory safety issues at compile time, making it a great fit for complex problem-solving where correctness is crucial. Given my prior experience with Rust in a standard development environment, I wanted to see how well it would translate to a completely different domain—bare-metal embedded development.  

##### **For Embedded: Supported, Active Community**  
Rust has rapidly gained traction in the embedded systems world, thanks to its **`no_std`** support and an active community working on microcontroller-friendly libraries. The **Rust Embedded Working Group** maintains key crates like:  

- [`embedded-hal`](https://github.com/rust-embedded/embedded-hal) – A common interface for hardware abstraction layers  
- [`rp2040-hal`](https://github.com/rp-rs/rp-hal) – A Rust HAL (Hardware Abstraction Layer) for the Raspberry Pi RP2040  
- [`defmt`](https://github.com/knurling-rs/defmt) – A lightweight logging framework optimized for embedded environments  

With strong community support, evolving tooling, and increasing adoption in industry, Rust seemed like the right choice for an embedded experiment like this.  

---  

#### **Pertinent Characteristics of the Pi Pico**  

##### **Small RAM**  
One of the biggest limitations of the Raspberry Pi Pico is its **small RAM size—only 264 KB**. While this might seem like plenty compared to older microcontrollers, it’s a drastic step down from the **gigabytes** of RAM available in a desktop environment. Many Advent of Code problems involve working with large datasets, such as parsing long input files or storing intermediate results in complex data structures. Managing memory efficiently—without the safety net of dynamic allocation—would be a key challenge.  

##### **Application Code and Constants in Flash**  
Unlike a traditional computer where the OS loads an application into RAM, the Pi Pico executes code directly from **flash memory** (specifically, external QSPI flash). This means:  

- **Code and constants reside in flash**, leaving RAM primarily for stack and heap usage.  
- **Flash memory is slower than RAM**, so excessive access can impact performance.  
- **Flash has a limited number of write cycles**, making it unsuitable for frequent modifications at runtime.  

This required careful consideration of where data was stored, ensuring that large immutable structures could be placed in flash while keeping frequently modified data in RAM.  

---  

#### **Challenges From My Coding Style**  

##### **Heavily Based on Containers**  
In a normal Rust development environment, I tend to rely heavily on collections like `Vec`, `HashMap`, and `BTreeMap` to store and process data. These structures provide flexibility, dynamic resizing, and convenient API methods for common operations. However, in a `no_std` environment, these **standard collections are unavailable** because they rely on heap allocation.  

Without `Vec`, I needed to rethink how I stored and manipulated data. This meant replacing dynamic containers with fixed-size arrays or manually managed memory regions, which required careful planning to avoid excessive stack usage.  

##### **Typically Reliant on Dynamic Memory**  
On a desktop or server, memory allocation is an afterthought—if a program needs more memory, the OS provides it on demand. However, in an embedded system with **no dynamic memory allocator**, all allocations must be known at compile time or carefully managed through custom memory pools.  

Many of my initial Advent of Code solutions relied on:  
- **Heap-allocated recursion** (e.g., DFS algorithms with dynamic stack growth)  
- **String-heavy processing** (e.g., `String`, `format!`, `Vec<u8>` for handling text data)  
- **Expanding data structures** (e.g., `Vec::push()`, `HashMap::insert()`)  

Porting this style to the Pi Pico required significant rewrites—switching to stack-based data storage, pre-allocating buffers, and avoiding unnecessary heap usage altogether.  

---  

This section highlights the key differences between my usual coding habits and the constraints of embedded Rust. The next section will dive into **setting up the development environment**, covering toolchains, debugging strategies, and how to actually get Rust code running on the Pi Pico.  

Let me know if you'd like any refinements or extra details! 🚀

---  

### **2. Understanding the Differences: `std` vs `no_std`**  
### **Understanding the Differences: `std` vs `no_std`**  

#### **What is `no_std` and Why It Matters for Embedded Development**  
Rust's standard library (`std`) is designed for systems that have an underlying operating system, providing features like heap allocation, file system access, and threading. However, **many embedded systems lack an OS**, meaning there’s no concept of dynamic memory management, file I/O, or multi-threading in the traditional sense.  

To support environments without an OS, Rust allows developers to opt out of the standard library using **`no_std`**, which removes dependencies on OS-specific functionality. This is crucial for embedded development because:  

- It eliminates unnecessary dependencies, reducing **binary size and memory footprint**.  
- It allows direct interaction with **hardware and peripherals**, without relying on OS abstractions.  
- It forces developers to **explicitly manage memory**, making applications more predictable and efficient.  

Using `no_std` is a fundamental shift—it’s not just about omitting features but about designing code to work within **severe resource constraints**.  

---  

#### **Key Missing Features When Moving Away From `std`**  
When transitioning from `std` to `no_std`, several commonly used features disappear:  

1. **Heap Allocation (`Box`, `Vec`, `String`, `HashMap`, etc.)**  
   - `std`-based applications can dynamically allocate memory at runtime using the heap.  
   - `no_std` does not include a heap allocator by default, so **all memory must be pre-allocated or managed manually**.  

2. **File and Network I/O (`std::fs`, `std::net`)**  
   - Embedded systems typically don’t have a filesystem, so reading and writing files is not an option.  
   - Network access is highly hardware-dependent and must be implemented at a lower level.  

3. **Threads and Concurrency (`std::thread`, `std::sync`)**  
   - Many embedded systems don’t support standard threading models.  
   - Concurrency must be managed through **interrupts, cooperative multitasking, or hardware peripherals**.  

4. **Panics and Error Handling (`std::panic`, `std::error`)**  
   - The default panic behavior in `std` assumes access to `println!` or `stderr`, which don’t exist in `no_std`.  
   - Instead, panics must be handled with **custom handlers**, often blinking an LED or resetting the device.  

5. **Standard Debugging Tools (`println!`, `dbg!`)**  
   - Without a console or terminal, `println!` doesn’t work.  
   - Debugging requires alternatives like **serial output (`UART`) or lightweight logging (`defmt`)**.  

---  

#### **Workarounds and Common Libraries for `no_std` Development**  
Despite these missing features, the Rust embedded ecosystem provides excellent workarounds through specialized libraries:  

1. **Heap Allocation in `no_std`**  
   - While `no_std` removes heap allocation by default, you can bring it back using an **embedded allocator** like:  
     - [`alloc-cortex-m`](https://docs.rs/alloc-cortex-m/latest/alloc_cortex_m/) – Provides a heap allocator for Cortex-M chips like the RP2040.  
     - [`linked_list_allocator`](https://docs.rs/linked_list_allocator/) – A simple, `no_std`-friendly allocator.  
   - This allows limited use of heap-based structures like `Box` or `Vec`, but careful memory management is required.  

2. **Replacement for Standard Containers**  
   - Instead of `Vec`, use **fixed-size arrays** or [`heapless::Vec`](https://docs.rs/heapless/latest/heapless/struct.Vec.html), which provides a stack-allocated vector alternative.  
   - Instead of `HashMap`, use [`heapless::LinearMap`](https://docs.rs/heapless/latest/heapless/struct.LinearMap.html) or a **statically allocated array**.  

3. **Embedded-Friendly Debugging and Logging**  
   - [`defmt`](https://github.com/knurling-rs/defmt) – A lightweight logging framework that uses **less RAM and flash space** than `println!`.  
   - Debugging can be done via **UART serial output**, SWD (Serial Wire Debug), or onboard LEDs for simple error signaling.  

4. **Concurrency and Async in `no_std`**  
   - [`RTIC`](https://github.com/rtic-rs/cortex-m-rtic) – A **Real-Time Interrupt-driven Concurrency** framework that provides safe, priority-based multitasking without traditional threads.  
   - [`embassy`](https://github.com/embassy-rs/embassy) – A modern async/await-based framework for embedded systems.  

5. **Handling Panics Gracefully**  
   - The default panic handler doesn’t work in `no_std`, but you can define a custom one using:  
     ```rust
     #[panic_handler]
     fn panic(_info: &core::panic::PanicInfo) -> ! {
         loop {} // Infinite loop or reset the device
     }
     ```  

---  

### **Summary**  
Switching from `std` to `no_std` changes how you think about programming. Gone are the days of freely allocating memory, using high-level debugging tools, or relying on OS abstractions. Instead, every byte matters, and careful planning is required to make the most of limited resources.  

Next, I’ll cover **setting up the development environment**, including toolchains, HALs, and getting code running on the Raspberry Pi Pico. 🚀  


Does this align with what you were envisioning? Let me know if you want more depth in certain areas!

---  

### **3. Setting Up the Development Environment**  
### **Setting Up the Development Environment**  

#### **Toolchain Setup for `no_std` on the Pi Pico**  

To compile Rust for the Raspberry Pi Pico, we need a toolchain that supports **`no_std`** and targets the RP2040’s **ARM Cortex-M0+** architecture. The process involves:  

1. **Installing Rust and the ARM target**  
   Since the RP2040 is an ARM-based microcontroller, we need the appropriate Rust target:  
   ```sh
   rustup target add thumbv6m-none-eabi
   ```  
   This tells Rust to compile for the **`thumbv6m-none-eabi`** target, which is suitable for the Cortex-M0+ CPU.  

2. **Installing the `probe-rs` tooling**  
   `probe-rs` is a modern tool for flashing and debugging Rust programs on embedded devices:  
   ```sh
   cargo install probe-rs cargo-embed
   ```  

3. **Setting Up the Rust Standard Library and Allocator**  
   - For `no_std`, we don’t use the standard Rust runtime (`std`), so our `Cargo.toml` must include:  
     ```toml
     [dependencies]
     cortex-m = "0.7"
     cortex-m-rt = "0.7"
     rp2040-hal = "0.9"
     embedded-hal = "0.2"
     panic-halt = "0.2"
     ```
   - `cortex-m-rt` provides the **startup runtime**, ensuring correct entry points.  
   - `panic-halt` stops execution cleanly when a panic occurs.  

4. **Using `cargo` for Embedded Builds**  
   We need to configure Cargo to always build for the correct target by adding a `.cargo/config.toml` file:  
   ```toml
   [build]
   target = "thumbv6m-none-eabi"
   ```  
   Now, running `cargo build` will automatically compile for the RP2040.  

---

#### **Setup for Experiments (Windows vs Pico Runner)**  

Since Advent of Code solutions were originally written for a standard OS, I set up two execution environments:  

1. **Windows/Linux (Standard Runner)**  
   - Used for initial algorithm development and debugging.  
   - Full `std` support, with easy-to-use debugging tools (`println!`, `Vec`, `HashMap`).  
   - Ran test cases and verified correctness before porting to embedded.  

2. **Raspberry Pi Pico (`no_std` Runner)**  
   - Used for testing the migration process and performance analysis.  
   - Had to adapt solutions to run without dynamic memory.  
   - Used **serial output (UART)** instead of `println!` for debugging.  
   - Measured execution speed to compare embedded performance vs. PC.  

This dual setup allowed me to debug complex logic on Windows before tackling `no_std` constraints on the Pico.  

---

#### **Choice of Rust Runtime/Abstraction Layer**  

Since the Raspberry Pi Pico doesn’t have an OS, it needs a **runtime and hardware abstraction layer (HAL)** to interact with its peripherals. I explored a few options:  

1. **[`rp2040-hal`](https://github.com/rp-rs/rp-hal) (Chose This One)**  
   - Official Rust **HAL (Hardware Abstraction Layer)** for the RP2040.  
   - Provides easy access to GPIO, UART, SPI, I2C, etc.  
   - Works well with `cortex-m-rt` for low-level initialization.  
   - Ideal for a lightweight, `no_std`-only environment.  

2. **[`embassy`](https://github.com/embassy-rs/embassy) (Considered, but Not Used)**  
   - An async-first framework for embedded development.  
   - Supports cooperative multitasking with async/await.  
   - More complex than needed for this project, since AoC problems are mostly single-threaded.  

3. **[`RTIC`](https://github.com/rtic-rs/cortex-m-rtic) (Not Used in This Case)**  
   - A framework for real-time interrupt-based concurrency.  
   - Great for multi-threaded embedded applications, but overkill for AoC-style problems.  

I ultimately chose **`rp2040-hal`**, as it provided a **simple, low-level interface** while remaining lightweight and idiomatic for Rust.  

---

#### **Debugging and Flashing the Firmware**  

With the code compiled for the RP2040, the next step was **flashing and debugging**:  

1. **Flashing Using UF2 Bootloader**  
   - The Pico has a built-in USB bootloader, allowing direct firmware flashing.  
   - To flash a Rust program:  
     ```sh
     cargo build --release
     elf2uf2-rs target/thumbv6m-none-eabi/release/my_project my_project.uf2
     ```  
   - Drag and drop `my_project.uf2` onto the Pico’s USB drive.  

2. **Using `probe-rs` for Direct Flashing**  
   - Instead of manual flashing, `probe-rs` can automate the process:  
     ```sh
     cargo run
     ```  
   - This loads the binary onto the Pico without using the UF2 bootloader.  

3. **Serial Output for Debugging (`defmt` + UART)**  
   - Since `println!` doesn’t work in `no_std`, I used **UART output** for debugging.  
   - The [`defmt`](https://github.com/knurling-rs/defmt) crate provides **efficient, embedded-friendly logging**.  
   - Connected the Pico’s UART to my PC using a USB-to-serial adapter for real-time logging.  

---

### **Summary**  

- **Toolchain**: `thumbv6m-none-eabi`, `probe-rs`, `rp2040-hal`.  
- **Two Testing Environments**: Windows for debugging, Pico for embedded constraints.  
- **Runtime Choice**: Used `rp2040-hal` for hardware interaction.  
- **Debugging & Flashing**: Used **UART for logs** and **probe-rs for flashing**.  

With the setup complete, I was ready to tackle the **actual migration of Advent of Code solutions**. The next section will dive into the **challenges faced during the migration**, including adapting algorithms to work without `std` and optimizing memory usage for embedded constraints. 🚀  

---

Does this flow work for you? Let me know if you’d like to expand on any part!

---

4. Import of the Problem Data
One of the first challenges in migrating my Advent of Code solutions to the Raspberry Pi Pico was figuring out how to import problem input data. On a standard OS, this is trivial—just read from a file. However, in an embedded no_std environment, there’s no filesystem, so I had to explore alternative methods.

Options for Storing Problem Data
Since Advent of Code problems typically involve parsing a static input file, I considered the following approaches:

Hardcoding the Data as a Rust String (&str)

Store the problem input directly in the Rust source code as a string constant:
rust
Copy
const INPUT: &str = "123\n456\n789\n...";
Pros: Simple, easy to use.
Cons:
The Rust compiler stores &str in read-only memory (Flash), but it’s UTF-8 encoded, which might introduce unnecessary overhead.
Large inputs can clutter the source file.
Embedding the Data as a Byte Array (include_bytes!)

Use Rust’s compile-time macro to embed the file as a byte array:
rust
Copy
const INPUT: &[u8] = include_bytes!("input.txt");
Pros:
Efficiently stores data in Flash without modification.
No need to manually escape special characters (unlike hardcoded &str).
Avoids unnecessary UTF-8 validation overhead.
Cons:
The data is in raw bytes, so I must convert it to a string (core::str::from_utf8()) if needed.
Using an External Flash File System (e.g., LittleFS)

Some embedded systems can use an SPI flash chip with a lightweight filesystem like LittleFS.
Pros:
Works well for dynamic storage (e.g., logging, saving game progress).
Cons:
Requires extra dependencies and driver code.
Overkill for static problem inputs.
Storing Data in an Allocated Buffer in RAM

Data could be manually copied into a statically allocated buffer at runtime:
rust
Copy
static mut INPUT_BUFFER: [u8; 1024] = [0; 1024];
Pros: Allows runtime modification of data.
Cons:
Wastes RAM, which is extremely limited on the RP2040.
Needs unsafe code to mutate the static buffer.
Why I Selected include_bytes!
Ultimately, I chose include_bytes! because it provided a balance of efficiency and simplicity:

✅ Stores data directly in Flash, preserving RAM for computation.
✅ Avoids the need for manual encoding/escaping that a &str constant would require.
✅ Works seamlessly in no_std without requiring additional crates or allocators.

The only minor downside was needing to convert the byte array into a string manually:

rust
Copy
let input_str = core::str::from_utf8(INPUT).unwrap();
But this was a small price to pay for an efficient, no_std-compatible solution.

Next Steps
With the problem data successfully embedded, the next challenge was parsing and processing the input efficiently—without relying on heap-allocated Vec<String> or other standard Rust collections. That’s what I’ll cover in the next section! 🚀

### **5. Parsing the Input**  

Once the problem data was embedded using `include_bytes!`, the next step was **parsing it into a usable format**. In a standard Rust setup, parsing is straightforward thanks to **`std::str`**, `Vec`, and `Iterator` utilities. However, in an embedded `no_std` environment, I needed to be more careful with memory usage.  

---

#### **Options for Parsing the Input**  

Given that the input was stored as a **byte array (`&[u8]`) in Flash**, I considered several approaches for parsing:  

1. **Manual Byte-by-Byte Parsing**  
   - Process the byte array character by character:  
     ```rust
     let mut numbers = [0u32; 100]; // Fixed-size array
     let mut index = 0;
     for line in input_str.split(|&c| c == b'\n') {
         if let Ok(num) = core::str::from_utf8(line).unwrap().parse::<u32>() {
             numbers[index] = num;
             index += 1;
         }
     }
     ```  
   - **Pros**:  
     - **Zero dependencies**, pure Rust.  
     - **Highly efficient** for small, simple input formats.  
   - **Cons**:  
     - Requires **manual management** of array sizes.  
     - Complex parsing logic can get unwieldy.  

2. **Using `heapless::Vec` for Dynamic Parsing**  
   - The [`heapless`](https://docs.rs/heapless/latest/heapless/) crate provides **fixed-capacity collections**, like `heapless::Vec`, which act like `Vec` but without heap allocation:  
     ```rust
     use heapless::Vec;
     let mut numbers: Vec<u32, 100> = Vec::new();
     for line in input_str.split(|&c| c == b'\n') {
         if let Ok(num) = core::str::from_utf8(line).unwrap().parse::<u32>() {
             numbers.push(num).ok(); // .ok() ignores push errors when full
         }
     }
     ```  
   - **Pros**:  
     - Allows **flexibility** in input size while remaining `no_std`.  
   - **Cons**:  
     - Needs to define an **upper limit** (`100` in this case).  
     - Still involves **manual parsing logic**.  

3. **Using `nom` for Robust Parsing** *(Final Selection)*  
   - [`nom`](https://github.com/Geal/nom) is a **parser combinator library** that works in `no_std`, allowing parsing to be expressed in a declarative, reusable manner.  
   - Example for extracting numbers from input:  
     ```rust
     use nom::{
         bytes::complete::take_until,
         character::complete::u32,
         multi::separated_list1,
         combinator::all_consuming,
         IResult,
     };

     fn parse_numbers(input: &[u8]) -> IResult<&[u8], heapless::Vec<u32, 100>> {
         let (input, numbers) = separated_list1(take_until("\n"), u32)(input)?;
         Ok((input, heapless::Vec::from_slice(&numbers).unwrap()))
     }
     ```  
   - **Pros**:  
     ✅ **Declarative and reusable** – makes parsing logic more readable.  
     ✅ **Optimized and memory-safe** – doesn’t require unnecessary allocations.  
     ✅ **Works well with `heapless::Vec`** – efficiently manages parsed data in RAM.  
   - **Cons**:  
     - Slightly **larger code size** than manual parsing.  
     - **Learning curve** if unfamiliar with parser combinators.  

---

#### **Why I Selected `nom`**  

In the end, I chose `nom` because it provided the best trade-off between:  

✅ **Readability** – Parsing logic is clear and modular.  
✅ **Efficiency** – Works in `no_std` with `heapless::Vec`.  
✅ **Scalability** – Easily adaptable to more complex AoC problems.  

While `heapless::Vec` was useful for dynamic storage, `nom` handled the actual **parsing logic** in a way that was both **memory-efficient and expressive**.  

---

### **Next Steps**  
With input parsing handled, the next major challenge was **adapting problem-solving algorithms to work without `std` collections**, particularly those that relied on `Vec`, `HashMap`, and recursion. I’ll cover that in the next section! 🚀  

---

### **6. Challenges Faced in the Migration**  

Migrating my Advent of Code solutions from a **standard Rust environment** to an **embedded `no_std` environment** on the Raspberry Pi Pico presented several challenges. The lack of a traditional operating system, heap allocation, and standard debugging tools meant that I had to rethink many aspects of my approach. Below are the major challenges I encountered and how I addressed them.  

---

### **Memory Allocation and Handling (or Lack Thereof)**  

In a normal Rust program, memory management is relatively straightforward:  
- **`Vec`, `Box`, and HashMap`** dynamically allocate memory on the heap.  
- The Rust **borrow checker** prevents many common errors.  

However, in `no_std`, **there’s no heap allocation**, which meant:  
1. **No `Vec`** → Had to use **fixed-size arrays** or `heapless::Vec`.  
2. **No `String`** → Had to rely on **byte slices (`&[u8]`) and `heapless::String`**.  
3. **No `HashMap`** → Replaced with **fixed-size lookup tables or linear scans**.  

Example: Replacing a `Vec<u32>` with `heapless::Vec`:  
```rust
use heapless::Vec;

let mut numbers: Vec<u32, 100> = Vec::new(); // Max 100 elements
numbers.push(42).unwrap();
```
Using fixed-size data structures required estimating the **maximum possible input size**, which wasn’t always straightforward.  

---

### **Porting Dependencies That Rely on `std`**  

Many Rust libraries assume they will run in an environment with **full `std` support**, which made porting difficult. Some common issues included:  

✅ **Replacing `std`-dependent crates with `no_std` alternatives:**  
| Standard Library | `no_std` Alternative |
|-----------------|----------------------|
| `std::vec::Vec` | `heapless::Vec` |
| `std::string::String` | `heapless::String` |
| `std::collections::HashMap` | `hash32` or static arrays |
| `std::time::Instant` | `cortex-m-rtic::monotonic` |
| `println!` | `defmt::info!` or UART |

✅ **Manually removing `std` dependencies:**  
For some libraries, I had to enable `no_std` features by tweaking `Cargo.toml`. Example:  
```toml
[dependencies]
nom = { version = "7", default-features = false, features = ["alloc"] }
```
✅ **Rewriting some functionality from scratch**  
In some cases, I had to **completely remove dependencies** and implement custom solutions.

---

### **Working with Peripherals (GPIO, UART, SPI, etc.)**  

Unlike a PC, where I/O is abstracted by an operating system, embedded programming requires **direct interaction with hardware**. To communicate with the outside world, I had to work with:  

1. **GPIO (General-Purpose Input/Output)**  
   - Used `rp2040-hal` to toggle LED indicators for debugging.  
   ```rust
   let mut led_pin = pins.gpio25.into_push_pull_output();
   led_pin.set_high().unwrap();
   ```
2. **UART for Debugging**  
   - Since `println!` doesn’t work in `no_std`, I used UART output via `defmt`:  
   ```rust
   use defmt::*;
   info!("Debug message here");
   ```
3. **SPI/I2C for External Communication**  
   - I didn’t use SPI or I2C for AoC problems, but setting them up required careful configuration with `rp2040-hal`.  

Overall, working with peripherals required **reading RP2040 datasheets** and understanding **low-level register access**.  

---

### **Debugging Without Traditional OS Tools**  

On a PC, debugging is easy with tools like **gdb, `println!`, and cargo test**. On an embedded system, debugging was much harder. I had to:  

1. **Use UART (`defmt`) for Logging**  
   - Since there’s no console output, I used `probe-rs` to capture log messages.  
2. **Use LEDs for Simple Status Indicators**  
   - Blinking an LED was sometimes the easiest way to check if a program was running!  
3. **GDB Debugging with `probe-rs`**  
   - Used `cargo embed` to debug with a hardware debugger.  
4. **Check for Hard Faults**  
   - If the code crashed unexpectedly, I had to **manually inspect registers** to find the issue.  

---

### **Challenges (e.g., Out of Stack Space in Methods)**  

One of the trickiest issues I ran into was **stack overflows**. The RP2040 has **only 264KB of RAM**, and each function call consumes stack space. Problems arose when:  

1. **Using Deep Recursion**  
   - Many AoC problems use recursion, but deep recursion can quickly **overflow the stack**.  
   - Solution: Convert recursive functions to **iterative** versions using a stack data structure.  

   Example: Changing a recursive DFS to an **explicit stack-based loop**:  
   ```rust
   let mut stack = heapless::Vec::<u32, 100>::new();
   stack.push(start).unwrap();

   while let Some(node) = stack.pop() {
       // Process node
   }
   ```
2. **Allocating Large Buffers on the Stack**  
   - Declaring a **large local array** inside a function caused stack overflows.  
   - Solution: Use `static` memory instead of stack allocation:  
   ```rust
   static mut BUFFER: [u8; 1024] = [0; 1024]; // Stored in global memory
   ```

---

### **Summary**  

| Challenge | Solution |
|-----------|----------|
| **No dynamic memory (`Vec`, `String`, etc.)** | Used `heapless::Vec` and fixed-size arrays |
| **Dependencies requiring `std`** | Replaced with `no_std` alternatives or rewrote functionality |
| **Interacting with hardware (GPIO, UART, etc.)** | Used `rp2040-hal` and `defmt` for debugging |
| **No traditional debugging tools** | Used UART logging, LEDs, and `probe-rs` |
| **Stack overflows from recursion/large allocations** | Used iterative algorithms and static memory |

Migrating to `no_std` required **rethinking how to manage memory, dependencies, and debugging**, but it was a rewarding learning experience.  

---

### **Next Steps**  

With the major migration challenges overcome, the next step was **optimizing performance and testing execution speed on the RP2040**. In the next section, I’ll cover performance trade-offs, execution time comparisons, and final results! 🚀  

---

### **5. Lessons Learned**  
   - Performance improvements and trade-offs  
   - Code size and efficiency in `no_std`  
   - Best practices for writing portable embedded Rust  

### **6. Results: Comparative performance**  
   - Table of results for each day (windows vs pico)  
   - Justifications / Rationale  

### **7. Conclusion and Next Steps**  
   - Would you use Rust again for embedded projects?  
   - Further improvements and future projects  
   - Resources for others interested in `no_std` development  

