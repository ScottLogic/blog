---
title: The future of WebAssembly - A look at upcoming features and proposals
date: 2018-07-20 00:00:00 Z
categories:
- ceberhardt
- Tech
tags:
- featured
author: ceberhardt
layout: default_post
summary: WebAssembly is a performance optimised virtual machine that was shipped in
  all four major browsers earlier this year. It is a nascent technology and the current
  version is very much an MVP. This blog post takes a look at the WebAssembly roadmap
  and the features it might gain in the near future.
image: ceberhardt/assets/featured/wasm.png
---

WebAssembly is a performance optimised virtual machine that was shipped in all four major browsers earlier this year. It is a nascent technology and the current version is very much an MVP (minimum viable product). This blog post takes a look at the WebAssembly roadmap and the features it might be gain in the near future.

I'll try to keep this blog post relatively high-level, so I'll skip over some of the more technical proposals, instead focusing on what they might mean for languages that target WebAssembly.

## A very brief WebAssembly intro

If you've not heard of WebAssembly before, I'll give you a very brief introduction. The team behind it describe it as follows:

> WebAssembly or wasm is a new portable, size- and load-time-efficient format suitable for compilation to the web.

WebAssembly modules are delivered to the browser in binary format, and are executed by a virtual machine (VM) that works alongside the JavaScript VM, sharing resources (e.g. memory) and executing on the same thread.

For a practical introduction to the WebAssembly VM and its instruction set I'd recommend my earlier article on [Writing WebAssembly by Hand](https://blog.scottlogic.com/2018/04/26/webassembly-by-hand.html).

In practice WebAssembly is intended to be used as a compilation target for higher-level languages. Currently you can use C, C++, Rust, Go, Java, C# compilers (and more) - with varying levels of maturity - to create wasm modules.

WebAssembly has some significant design constraints that impact how it is currently being used, these include:

 - support for just 4 types - all numeric
 - modules cannot access DOM or WebAPIs directly
 - modules can import / export functions (but can only receive / return wasm numeric types)
 - it does not have a garbage collector
 - ...

For the reasons above (and more), WebAssembly modules are always used in conjunction with JavaScript hosting / binding code in order for them to do anything useful. 

Many of the proposals that are being worked on relax these constraints, making WebAssembly a better / easier compilation target, and reducing the amount of JavaScript 'glue' code that is required.

## WebAssembly proposals

The WebAssembly specification is governed by a combination of a Community Group, which anyone can join, and a Working Group. The specification is developed in the open, predominantly on the [WebAssembly design repository](https://github.com/WebAssembly/design), where new proposals are added as issues.

The standardisation process adopts a [phased approach](https://github.com/WebAssembly/meetings/blob/master/process/phases.md), with phases from 1 (immature), up to 5 (standardized), with browser typically starting to implement features in phase 3 and above.

Here is a complete list of all the current proposals, each of which are covered in a later section:


**Phase 1 - Feature proposal**

 - [Custom annotations in text format](#custom-annotations-in-text-format)
 - [Host bindings](#host-bindings-) 🎉🎉
 - [Tail calls](#tail-calls)
 - [bulk memory operations](#bulk-memory-operations)
 - [ECMA module integration](#ecma-module-integration-) 🎉
 - [Garbage collection](#garbage-collection-) 🎉🎉🎉
 - [Exception handling](#exception-handling-) 🎉
 - [Fixed width SIMD](#fixed-width-simd) 
 - [Threads](#threads-) 🎉🎉

**Phase 2 - Proposed specification**

 - [BigInt conversion](#bigint-conversion)

**Phase 3 - Implementation**

 - [Reference types](#reference-types-) 🎉
 - [Multi-value returns](#multi-value-returns)

**Phase 4 - Standardisation**

 - [Export / import mutable globals](#export--import-mutable-globals)
 - [Sign extension operations](#sign-extension-operations)
 

As you can see there are quite a few of them. I've indicated a some of the more exciting ones using the `:tada:` emoji, if you're short on time, you're more then welcome to just skip to those ones!

Currently there is a single version of WebAssembly, that all four browsers support. As these proposals mature and are implemented, we may find ourselves in a position where we need to perform feature detection and apply polyfills. 

Anyhow, if I haven't put you off already, time to grab a coffee, and dive in ☕.

## Reference types 🎉

The current WebAssembly type system is minimal, with just four numeric types. Currently the only way to interact with more complex types (e.g. strings, objects, arrays, structs) is to serialise them into linear memory and pass a reference to their location. This proposal extends the type system, adding a new `anyref` type that allows modules to hold references to objects provided by the host environment, i.e. you can pass a JS object to your wasm module. 

The wasm module can't really do much with the object via the `anyref` type. What's more important is that the module is holding a reference to a garbage collected object on the JS heap, meaning they need to be traced during wasm execution. This proposal is seen as a stepping-stone towards the more significant garbage collection proposal.

An implementation for this specification has [already appeared in FireFox nightly](https://blog.benj.me/2018/07/04/mozilla-2018-faster-calls-and-anyref/).

## Multi-value returns

WebAssembly is a stack-based virtual machine; function operands are placed on the stack prior to invocation, these are consumed by the function and replaced with the return value. With the current specification functions can only return a single value, which is a somewhat arbitrary restriction. This proposal allows instructions, functions and blocks to return multiple values (e.g. an integer division could return the divisor and remainder).

Here's a simple 'swap' function that returns multiple values (`result i32 i32`)

~~~
(func $swap (param i32 i32) (result i32 i32)
	(get_local 1) (get_local 0)
)
~~~

I looked at creating a [polyfill for this feature a while back](https://blog.scottlogic.com/2018/05/29/transpiling-webassembly.html).

This proposal is primarily of interest for people implementing compilers that target wasm.

## Export / import mutable globals

Currently wasm supports global and local variables. Global variables can be imported / exported allowing them to be shared with the JS host, although if shared, they must be defined as immutable.

This proposal allows export / import or mutable globals, adding a `WebAssembly.Global` constructor to the JS API. This feature could be useful for sharing state across multiple wasm modules.

## Sign extension operations

Sign extension is a way to increase the number of bits of a binary number while preserving the number's sign. This proposal adds a small number of sign-extension instructions, e.g. `i32.extend8_s` - extends a signed 8-bit integer to a 32-bit integer.

Similar to multi-value returns, this is a feature that could easily be polyfilled, as [demonstrated by Mario Bringolf](https://github.com/xtuc/webassemblyjs/pull/375/files#diff-89d9b90fea67f396108af626f9c211d2)

This feature has been implemented in FireFox, and is looking to [ship in September](https://github.com/WebAssembly/design/issues/1178#issuecomment-394298608).

## BigInt Conversion 
 
JavaScript only has a single numeric type, which is a IEEE 754 float - the limitations of this approach are [widely documented](https://medium.com/dailyjs/javascripts-number-type-8d59199db1b6). There is an [emerging standard for adding 'big integer' support](https://github.com/tc39/proposal-bigint), which is currently at stage 3 within the TC39 process. When finalised, this will provide developers with arbitrary precision integers.

One of WebAssembly's four numeric types is a 64-bit integer. This proposal will provide full interop, allowing bidirectional conversion of JS BigInts into wasm 64-bit integers.

Incidentally there is already a libraries for performing 64-bit maths in JavaScript called long.js. They recently removed their JavaScript based implementation, and [replaced it with a simpler WebAssembly equivalent](https://github.com/dcodeIO/long.js/pull/50)!


## Threads 🎉🎉

JavaScript has had multi-threading capabilities for a number of years via WebWorkers, however the mechanisms for transferring data between workers is limited to relatively slow message passing via `postMessage`.  More recently [shared memory was finalised in TC39](https://github.com/tc39/ecmascript_sharedmem), and as of Feb 2017 is part of ECMAScript. This adds shared array buffers and atomics (thread-safe operations), making it much easier to share data between threads. The concept is illustrated beautifully in one of [Lin Clark's series of code cartoons](https://hacks.mozilla.org/2017/06/a-crash-course-in-memory-management/).

This proposal for WebAssembly closely mirrors the additions to TC39, allowing shared access to linear memory and providing atomic operations. Notably, this proposal does not introduce a mechanism for creating threads (which has [caused a lot of debate](https://github.com/WebAssembly/threads/issues/8)) instead this functionality is supplied by the host. Within the context of wasm executed by the browser this will be the familiar WebWorkers.

I'm sure there will be some who are disappointed by the limited scope of this proposal, and it is something of a misnomer. However, part of the reason why WebAssembly moved so quickly to an MVP release is the teams focus on simplicity. Making use of mature host functionality (WebWorkers), makes a lot of sense. You'll see this crop up again with garbage collection ...

Native threading will likely be added in future, but as a separate proposal. I'd expect this to be a number of years away!


## Fixed width SIMD

Single Instruction Multiple Data (SIMD) are instructions that allow vector style processing, e.g. adding one vector to another. These instructions are are supported by all modern CPUs. There was a [SIMD.js TC39 proposal](https://github.com/tc39/ecmascript_simd) to add a number of 128 bit types, e.g. float32 x 4, and respective operations (e.g. add, multiply), but this was recently removed in favour of adding similar functionality to WebAssembly. This makes sense, as these are low level instructions and WebAssembly is a low level runtime.

The WebAssembly SIMD proposal is quite straightforward, adding a new 128bit type to wasm that can represent vectors of four numbers, together with a large number of simple instructions for creating and manipulating these new types. This will result in performance improvements for certain classes of algorithm.


## Exception handling 🎉

Exceptions allow a program to break control flow when an error occurs. When an exception is thrown it propagates up the call stack until a suitable 'catch' block is found. Exception handling is a common feature of most modern programming languages, although notably [Swift didn't support them in their earlier releases](https://blog.scottlogic.com/2015/01/27/swift-exception-handling.html). 

The WebAssembly MVP doesn't have have anything that resembles exception handling within its current control flow instructions. As a result, tools like Emscripten have to emulate this functionality, which has an inherent cost - currently catching of C++ exceptions is turned off by default. Other languages face similar challenges.

The [exception handling proposal](https://github.com/WebAssembly/exception-handling/blob/master/proposals/Level-1.md) outlines a lot of the complexity involved in constructing a suitable concept that 'plays nicely' with the host environment. Interestingly this is the [second attempt at creating a suitable proposal](https://github.com/WebAssembly/exception-handling/blob/master/proposals/Exceptions.md), which is likely an indicator of the challenges they face!

Rather than just adding exceptions to WebAssembly, this proposal looks to introduce a more generic concepts of events, that look a lot like interrupts. When an event occurs, execution is suspended, and a suitable handler is located within a new `events` section.

While events are a generic concept, it looks like the standard try / catch instructions will be added also:

~~~
try block_type
  instruction*
catch
  instruction*
end
~~~

This addition will reduce some of the complexity in WebAssembly compilers.

## Garbage collection 🎉🎉🎉

Most modern programming languages (excluding system-level languages) use a garbage collector for memory management. In brief, the garbage collector (GC) frees developers from thinking too deeply about memory management; they can create objects, pass them around, share them between functions / variables, and relying on the GC to clean things up when an object is no longer used.

WebAssembly doesn't have a garbage collector. In fact, it doesn't have any tools for memory management, it simply provides you with a 'slab' of memory. Languages that don't use a GC still need some sort of mechanism for managing allocation of memory, as an example Rust uses a small [WebAssembly optimised allocator](https://github.com/rustwasm/wee_alloc).

Currently languages that require a garbage collector have no other option than to compile the GC to wasm and ship that as part of the binary, for example AssemblyScript includes something which the team describe as a ['makeshift' GC](https://github.com/AssemblyScript/assemblyscript/blob/master/std/assembly/collector/itcm.ts). This comes at a considerable cost, both in binary size and efficiency of the GC algorithm itself. The lack of GC is the reason why certain languages like Scala and Elm have yet to compile to WebAssembly.

This proposal adds GC capabilities to WebAssembly. Interestingly, it will not have its own GC, instead it will integrate with the GC provided by the host environment. This makes a lot of sense as this, and various other proposals (host bindings, reference types), are designed to improve the interop with the host, making it easier to share state and call APIs. Having a single GC to manage memory makes this much easier.

Looking at the state of the current proposal this is a significant change, leading to many additions to the wasm type-system, including simple tuples, structs and arrays. There have also been discussions around adding a string type. The complexity of this proposal is why we've seen the problem broken down into smaller pieces, for example the reference types proposal discussed above.

The use of a GC will be optional in WebAssembly, allowing languages like Rust / C++ to use a memory allocator and linear memory. It looks like these new types will be allocated on a new WebAssembly heap, although this isn't explicitly stated in the proposal. I guess the host heap could also be used, but I'd expect this to introduce significant overheads.

The proposal adds quite a lot of new instructions. Here's an example of a structure type:

~~~
;; structures with fields
(type $point (struct (field $x f64) (field $y f64) (field $z f64)))

;; allocated with new
(call $g (new $point (i32.const 1) (i32.const 2) (i32.const 3)))

;; field accessors - type checked when validated
(load_field $point $x (get_local $p))
~~~

These are of course garbage collected. There are similar concepts for arrays and function pointers (allowing the construction on closures).

## ECMA module integration 🎉

ECMAScript modules (ESM) is a relatively new specification that has now shipped in all major browsers. Again, Lin Clark has a [fantastic introduction](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/), with more code cartoons. This proposal is being led by Lin, and as you can imagine, it is the most clearly documented proposal you're likely to ever see - check out the [proposal video](https://www.youtube.com/watch?v=qR_b5gajwug&feature=youtu.be).

Currently wasm modules are loaded via HTTP, then instantiated via the JS API:

~~~
const req = fetch("./myModule.wasm");

const instance = await WebAssembly.instantiateStreaming(req)
instance.exports.foo();
~~~

This proposal describes the mechanics required to allow wasm modules to be loaded using ESM imports:

~~~
import {foo} from "./myModule.wasm";
foo();
~~~

This makes it easier to instantiate wasm modules, but the bigger benefit is they become part of the JS module graph, allowing them to participate in tree shaking, bundling, code splitting and other optimisations that ESM allow.

Webpack already provides this functionality and the team are participating in this proposal.

## Bulk memory operations

These do pretty much exactly what they say on the tin. This proposal adds new operations for copying / filling 
 regions of linear memory. They will offer improved performance for certain scenarios.

## Tail calls

Recursive function calls can result in deep call stacks, which are problematic for a number of reasons (performance, memory consumed, the possibility of stack overflow). With tail call optimisation, recursive function calls are replaced by iteration. This technique is important for functional languages which favour recursion. This proposal introduces a new `return_call` instruction for this purpose.

## Host bindings 🎉🎉

The current interface between WebAssembly and its JavaScript host is quite limited, due to a number of factors (the simple wasm type system, lack of reference types, etc ...). As an example, if you want to write a wasm module that manipulates the DOM or uses some other browser API you have to write a lot of 'glue' code.

This proposal allows WebAssembly modules to create, pass around, call, and manipulate JavaScript / DOM objects. It adds a number host bindings section that includes annotations that describes binding mechanism / interface that should be constructed. 

Rust already has a tool, [wasm-bindgen](https://hacks.mozilla.org/2018/04/javascript-to-rust-and-back-again-a-wasm-bindgen-tale/), that is very similar in purpose and closely aligns with this proposal. With wasm-bindgen you can pass objects such as strings across the wasm / JS boundary with ease. The tool adds the binding metadata to the wasm module, and generates the required JS glue code.

## Custom annotations in text format

The wasm binary format supports custom sections for adding meta-data to modules. As an example, compilers can add a custom name section that retains function / local variable names (within the binary format functions / variables are all referenced by index).This proposal adds similar functionality for the text format, this could be useful for host bindings as an example:

~~~
(module
  (func (export "f") (param i32 (@js unsigned)) ...) 
)
~~~

The `@js unsigned` annotation adds additional metadata for generation of host bindings.

## Conclusions

Hopefully this has given you a useful glimpse into where WebAssembly is heading in the future. As you might expect, the proposals are a real mixed bag of small enhancements, that will likely move through the process quite rapidly, and more sizeable features that could take years to reach the end. 

I found some real surprises in there too, WebAssembly will not gain native threads or garbage collection, instead, it will make use of the host environment. Furthermore, host bindings will not add Web APIs directly to WebAssembly, rather, it will make it easier to create the binding 'glue'. 

All of this points to WebAssembly having a very interesting symbiotic relationship with its host. And this means that WebAssembly modules will always require JavaScript (or some other hosting code) in order to do anything useful for the foreseeable future!

Comments? thoughts? ideas? please share them on [Reddit](https://www.reddit.com/r/programming/comments/90eul8/the_future_of_webassembly_a_look_at_upcoming/) or [Hacker News](https://news.ycombinator.com/item?id=17573820) threads.