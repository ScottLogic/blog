---
title: Writing WebAssembly By Hand
date: 2018-04-26 00:00:00 Z
categories:
- ceberhardt
- Tech
tags:
- featured
author: ceberhardt
layout: default_post
summary: WebAssembly is a new language for the web, although unlike JavaScript it's
  not a language you are expected to use directly. However, it is actually possible
  to write WebAssembly directly by hand and it turns out this is an educational and
  enjoyable process, which I will explore in this blog post.
image: ceberhardt/assets/featured/wasm.png
---

WebAssembly is a new language for the web, although unlike JavaScript it's not a language you are expected to use directly, instead it is a compilation target for an [ever-growing range of languages](https://stackoverflow.com/a/47483989/249933) including C / C++, Rust, C# and TypeScript. However, it is actually possible to write WebAssembly directly by hand. It turns out this is an educational and enjoyable process, which I will explore in this blog post.

WebAssembly is a pretty low-level language, as a result, creating complex applications using this language can be challenging and time consuming. So why would anyone want to do this?

I started to learn more about the low-level detail of the WebAssembly language and runtime through my contributions to [webassemblyjs](https://github.com/xtuc/webassemblyjs), a toolchain for WebAssembly. It's early days for this project, but we hope it will become a useful and integral part of the hybrid JavaScript / WebAssembly tooling of the future.

I personally find this low-level exploration a lot of fun. Furthermore, writing WebAssembly is actually quite easy, I'd certainly encourage you to give it a go!

This post describes the process of implementing [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), it's something of a classic. You might also want to take a look at this fantastic tutorial which [also implements Life in WebAssembly](https://rust-lang-nursery.github.io/rust-wasm/game-of-life/introduction.html) using Rust (a slightly more practical route).

If you want to see the code in action, it's available via [WebAssembly Studio](https://webassembly.studio/?f=ivzzdwn7fcn) - Just click 'Build' then 'Run'.

## Compiling WebAssembly

The [WebAssembly specification](https://webassembly.github.io/spec/core/index.html) describes two formats, the first is a compact binary format, for `.wasm` files, which is how WebAssembly code is typically distributed. The second is a text format (WAT - WebAssembly Text Format), which is very similar to the binary format, but designed to be human readable.

The following is a pretty simple 'hello world' WebAssembly module (in WAT format):

~~~
(module
  (func (result i32)
    (i32.const 42)
  )
  (export "helloWorld" (func 0))
)
~~~

It defines a single function, which is exported - allowing it to be invoked from JavaScript, that returns a constant value of '42'. 

As an aside, my preferred editor is VSCode, which has a [syntax highlighter for wat files](https://github.com/AlanCezarAraujo/vscode-webassembly-syntax-highlight), which is useful when hand-writing WebAssembly.

WAT files need to be compiled into the binary format before they can be run in the browser or node. The [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt) has various tools that support low-level WebAssembly development, including the command-line `wat2wasm` tool. However, this toolkit is written in C++, and as a JavaScript developer, I'm somewhat allergic to native dependencies!

Fortunately WebAssembly is designed to remove this friction, and you'll find a [WebAssembly build of wabt on npm](https://www.npmjs.com/package/wabt).

With `wabt` added to the project, you can 'compile' wat files to wasm as follows:

~~~javascript
const { readFileSync, writeFileSync } = require("fs");
const wabt = require("wabt");
const path = require("path");

const inputWat = "main.wat";
const outputWasm = "main.wasm";

const wasmModule = wabt.parseWat(inputWat, readFileSync(inputWat, "utf8"));
const { buffer } = wasmModule.toBinary({});

writeFileSync(outputWasm, new Buffer(buffer));
~~~

Once compiled, the 'hello world' example is completed by loading, compiling and instantiating this WebAssembly module:

~~~javascript
const { readFileSync } = require("fs");

const run = async () => {
  const buffer = readFileSync("./main.wasm");
  const module = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module);
  console.log(instance.exports.helloWorld());
};

run();
~~~

Running the above, gives the expected output:

~~~
$ node index.js
42
~~~

I'm not going to go into any of the details around the `WebAssembly` interface in the above code. If you want to learn more about the JavaScript API, and the load / compile / instantiate lifecycle, I'd highly recommend the [MDN documentation](https://developer.mozilla.org/en-US/docs/WebAssembly/). This blog post is all about the WAT!

## Test Drive Development

Writing WebAssembly can be a little error-prone, which is why I found it very useful to have a JavaScript test suite that provides rapid feedback. I decided to use Jest as my test runner, mostly because I've heard good things about Jest and haven't used it before - this seemed like a good excuse for experimentation!

Ideally I want my tests to run whenever I change any of the JavaScript or WebAssembly within my project. I also want to compile wat to wasm before running my tests.

I added Jest to my project, and configured it to include both `js` and `wat` file extensions:

~~~javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ["js", "wat"]
};
~~~

And updated my npm scripts to run Jest in watch mode:

~~~json
"scripts": {
  "test": "jest *.wat *.js --watch"
}
~~~

By tweaking the wabt-based build script above, the code can be re-used, allowing the unit tests to compile the wat to wasm before the suite executed. Here's the complete test suite that verifies the expected behaviour of the exported `helloWorld` function:

~~~javascript
const { readFileSync } = require("fs");
const build = require("./scripts/build/index");

const instantiate = async () => {
  const buffer = readFileSync("./main.wasm");
  const module = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module);
  return instance.exports;
};

beforeAll(() => {
  build("main.wat", "main.wasm");
});

beforeEach(async done => {
  wasm = await instantiate();
  done();
});

test("hello world returns 42", async done => {
  expect(wasm.helloWorld()).toBe(42);
});
~~~

With this in place I can rapidly iterate, with my tests running as soon as I save changes to either the test files or my WebAssembly code.

## Game state

The Game of life is played over a universe of `n x n` square cells. In most languages you'd expect to store the game state in a two dimensional array. Unfortunately WebAssembly doesn't have two dimensional arrays - in fact, it doesn't have arrays at all! The only types available to you are four numeric types (two floating point, two integer). To deal with other more complex types, WebAssembly provides you with [linear memory](http://webassembly.org/docs/semantics/#linear-memory). 

For simplicity, we'll store the state of each cell an integer value, using the `i32` type. Using linear memory, the offset to the storage address for a given cell, assuming a `50 x 50` universe, is simply `(x + y * 50) * 4`.

It makes sense to write a function that converts from screen coordinates to the memory offset. Here's a minimal test case:

~~~javascript
test("offsetFromCoordinate", () => {
  expect(wasm.offsetFromCoordinate(0, 0)).toBe(0);
  expect(wasm.offsetFromCoordinate(49, 0)).toBe(49 * 4);
  expect(wasm.offsetFromCoordinate(10, 2)).toBe((10 + 2 * 50) * 4);
});
~~~

And here is how that function is implemented and exported:

~~~
(func $offsetFromCoordinate (param $x i32) (param $y i32) (result i32)
  get_local $y
  i32.const 50
  i32.mul
  get_local $x
  i32.add
  i32.const 4
  i32.mul
)

(export "offsetFromCoordinate" (func $offsetFromCoordinate))
~~~

WebAssembly functions are much like those in any other language, they have a signature that declares none, one or more typed parameters and an optional return value. The above function takes two `i32` parameters (the coordinate) and returns a single `i32` result (the storage offset). The body of the function contains a number of instructions (WebAssembly has approximately 50 different instructions) that are executed sequentially. 

WebAssembly instructions operate on a stack, considering each step in the above function, it is interpreted as follows:

1. `get_local $y` - push the value of the `$y` parameter onto the stack.
2. `i32.const 50` - push a constant value of 50 
3. `i32.mul` - pop two values from the stack, multiply them together, then push the result onto the stack
4. `get_local $x` - push the value of the `$x` parameter onto the stack.
5. etc ... !

When the execution of the function finishes, there is just a single value left on the stack, which becomes the return value of the function.

When a WebAssembly module is loaded and compiled its contents are validated. One of the many validation steps ensures is that the stack depth at any point within the code is compatible with the subsequent instruction, or the value returned by the current function. You can read more about validation and type checking in [this article by Mauro Bringolf](https://maurobringolf.ch/2018/04/learning-the-webassembly-type-system/). Validation is one of a number of security / safety features of the language and runtime.

This stack-based logic can be a little hard to read, with the input values for a particular operation potentially depending on instructions that are quite 'distant' within the function logic. Fortunately, the WAT format also allows you to express your application in a more readable, nested form.

As an example, a simple multiplication:

~~~
get_local $y
i32.const 50
i32.mul
~~~

Can instead be expressed as follows:

~~~
(i32.mul
  (get_local $y)
  (i32.const 50)
)
~~~~

This format looks like a much more conventional function invocation. Applying this to the earlier function gives the following:

~~~
(func $offsetFromCoordinate (param $x i32) (param $y i32) (result i32)
  (i32.mul
    (i32.add
      (i32.mul
        (i32.const 50)
        (get_local $y)
      )
      (get_local $x)
    )
    (i32.const 4)
  )
)
~~~

In this instance, I think the end result is more readable. However, it is worth noting that this nesting is all 'syntactic sugar', the order of instructions within the binary wasm format is sequential. Also, if you inspect a wasm function within your browsers developer tools, you will see the sequential version.

With this utility function in place, it is now possible to write the functions that get / set the cell state at a given location.

Here's a very simple test case:

~~~javascript
test("get / set cell", () => {
  // check that linear memory initialises to zero
  expect(wasm.getCell(2, 2)).toBe(0);
  // set and expect
  wasm.setCell(2, 2, 1);
  expect(wasm.getCell(2, 2)).toBe(1);
});
~~~

And here is the implementation:

~~~
(memory 1)

(func $setCell (param $x i32) (param $y i32) (param $value i32)
  (i32.store
    (call $offsetFromCoordinate
      (get_local $x)
      (get_local $y)
    )
    (get_local $value)
  )
)

(func $getCell (param $x i32) (param $y i32) (result i32)
  (i32.load
    (call $offsetFromCoordinate
      (get_local $x)
      (get_local $y)
    )
  )
)
~~~

The `store` instruction stores a stack value at the given location in memory, and `load` does the opposite. Each module can have a single linear memory instance, which is either imported (i.e. provided by the host environment), or defined within the module itself (and optionally exported). In the above, the module memory is defined within the module `(memory 1)`, where the '1' indicates that this module requires at least 1 page (64KiB).

## Direct memory access

With the above code it is possible to read / write cell values, which means that the current game state can now be represented graphically. However, there is an overhead to crossing the JavaScript / WebAssembly boundary. Using the current interface would require 2,500 invocations of the `getCell` function. A more efficient approach is to allow the JavaScript host to read the game state directly from linear memory.

Exporting the module memory is quite simple:

~~~
(memory 1)
(export "memory" (memory 0))
~~~

The above code defines the module memory, then exports it by referencing the memory by index (multiple memories may be supported in future), giving it the external name `memory`. Rather than reference by index, it is possible to assign a name, and use this for referencing:

~~~
(memory $mem 1)
(export "memory" (memory $mem))
~~~

The same approach can be used to export functions (and globals). The names are not included in the binary module format, they are merely for convenience, and to enhance readability in WAT format.

Finally, exports can be defined inline, avoiding the need to reference the function or memory that they relate to, with the following shorthand:

~~~
(memory (export "memory") 1)
~~~

Again, this is syntactic sugar, the binary format has a separate export section, and all three examples above are equivalent.

With this export in place, the module memory is made available as a `WebAssembly.Memory` instance, which is an `ArrayBuffer`. The contents of this memory can be accessed via a typed array, in this case using a `Uint32Array` to correspond to the 32 bit `i32` values being stored by the WebAssembly module:

~~~javascript
test("read memory directly", () => {
  const memory = new Uint32Array(wasm.memory.buffer, 0, 50 * 50);
  wasm.setCell(2, 2, 10);
  expect(memory[2 + 2 * 50]).toBe(10);
  expect(memory[3 + 2 * 50]).toBe(0);
});
~~~

## Boundary values

The Game of Life is played over a universe of finite size. This can be implemented by assuming any cell outside of the 50 x 50 universe is dead. Testing whether a cell is within the universe is a simple range test, `0 <= x < 50`. Implementing and using this check requires control flow logic.

WebAssembly control flow is relatively rich (compared to other stack machines), rather than use simple jumps, it has structured control flow constructs that are commonly seen in higher-level languages, including loops and if / then / else. WebAssembly doesn't currently have exception handling, but there is an [active proposal researching this](https://github.com/WebAssembly/exception-handling).

Here's a simple example that evaluates whether the local `$x` is less than `$y`, the `if` operation will execute the instructions within the `then` or `else` block based on the value at the top of the stack:

~~~
(i32.lt_s
  (get_local $x)
  (get_local $y)
)
(if
  (then
    ...
  )
  (else
    ...
  )
)    
~~~

As with other WebAssembly operations, the instructions that precede the `if` block can be nested for improved readability:

~~~
(if 
  (i32.lt_s
    (get_local $x)
    (get_local $y)
  )
  (then
    ...
  )
  (else
    ...
  )
)  
~~~

Finally, the `if` block can also return a result, which must be detailed as follows:

~~~
(if (result i32)
  (i32.lt_s
    (get_local $x)
    (get_local $y)
  )
  (then
    (i32.const 10)
  )
  (else
    (i32.const 20)
  )
)  
~~~

With this in mind, the `getCell` function can be updated to test whether the given coordinate is within the range of our universe, returning zero otherwise:

~~~
(func $inRange (param $low i32) (param $high i32) (param $value i32) (result i32)
  (i32.and
    (i32.ge_s (get_local $value) (get_local $low))
    (i32.lt_s (get_local $value) (get_local $high))
  )  
)

(func $getCell (param $x i32) (param $y i32) (result i32)
  (if (result i32)
    (block (result i32)
      ;; ensure that both the x and y value are within range:
      (i32.and
        (call $inRange
          (i32.const 0)
          (i32.const 50)
          (get_local $x)
        )
        (call $inRange
          (i32.const 0)
          (i32.const 50)
          (get_local $y)
        )
      )
    )
    (then
      (i32.load
        (call $offsetFromCoordinate
          (get_local $x)
          (get_local $y))
      )
    )
    (else
      (i32.const 0)
    )
  )    
)
~~~

With the above, it is quite straightforward to construct a function that counts the number of live members for a given cell.

## The rules of life

The Game of Life is based on the following simple rules:

1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The above could be implemented using nested `if` control flow instruction introduced above - but there's scope for more creativity here!

WebAssembly allows you to create a table with function references, which can by invoked dynamically by index.

~~~
(table 16 anyfunc)
(elem (i32.const 0)
  ;; for cells that are currently dead
  $dead
  $dead
  $dead
  $alive
  $dead
  $dead
  $dead
  $dead
  $dead
  ;; for cells that are currently alive
  $dead
  $dead
  $alive
  $alive
  $dead
  $dead
  $dead
  $dead
  $dead
)

(func $alive (result i32)
  i32.const 1
)

(func $dead (result i32)
  i32.const 0
)
~~~

In the above code the `table` instruction declares a table of 16 elements, of `anyfunc` type, which is a reference to a function of any signature. The `elem` instruction defines the table itself, with an offset `(i32.const 0)`, that gives the starting index of the table, followed by 16 function references.

The following code shows how this table is used in practice:

~~~
(call_indirect (result i32)
  (i32.add
    (i32.mul
      (i32.const 8)
      (call $isCellAlive
        (get_local $x)
        (get_local $y)
      )
    )
    (call $liveNeighbourCount
      (get_local $x)
      (get_local $y)
    )
  )
)
~~~

The `call_indirect` index is determined by the number of neighbours that a cell has, plus 8, if it is a live cell, with the overall returned result based on the `$alive` / `$dead` functions in the table. Probably not the most efficient way to implement this logic, but a good excuse to illustrate another feature of WebAssembly.

The above code can be wrapped into a function `$evolveCellToNextGeneration`, that does pretty much that. The final step is to iterate over all the cells in our universe applying this logic.

WebAssembly has a `loop` instruction that can be used to iterate over a group of instructions. This is used in tandem with the break `br`, and break-if `br_if` instructions, both of which break to a given control flow stack depth. 

Here's the complete code:

~~~
(func $evolveAllCells
  (local $x i32)
  (local $y i32)

  (set_local $y (i32.const 0))
  
  (block 
    (loop 

      (set_local $x (i32.const 0))

      (block 
        (loop 
          (call $evolveCellToNextGeneration
            (get_local $x)
            (get_local $y)
          )
          (set_local $x (call $increment (get_local $x)))
          (br_if 1 (i32.eq (get_local $x) (i32.const 50)))
          (br 0)
        )
      )
      
      (set_local $y (call $increment (get_local $y)))
      (br_if 1 (i32.eq (get_local $y) (i32.const 50)))
      (br 0)
    )
  )
)
~~~

As you can see, the `loop` instruction itself doesn't result in an iteration, instead a `br 0` instruction (break to a control flow stack depth of zero), causes the loop to repeat, with the break-if instruction causing it to terminate.

There are a few extra details required to complete the implementation, however, I'll leave you to look at the complete source code if you're interested in the missing bits.

## A window on Life

The WebAssembly module implements the core logic of Life, however, some form of interface is needed in order to see the results. WebAssembly does not have any DOM, or any other form of IO APIs, this is something you need to handle within the host environment.

Rather than fiddle around with HTML, I decided to use the [axel console graphics library](https://www.npmjs.com/package/axel), giving a nice retro feel to the output. Here it is running within my VSCode terminal:

<img src="{{ site.baseurl }}/ceberhardt/assets/life-console.png" />

## Conclusions

WebAssembly is an interesting and unusual feeling language, while you might not ever find yourself writing it directly, I'm sure you'll find your development tools using, or compiling to it in the near future.

If you'd like to see the full sourcecode for this project you can [find it on GitHub](https://github.com/ColinEberhardt/wasm-game-of-life), and for the impatient, it's available via [WebAssembly Studio](https://webassembly.studio/?f=ivzzdwn7fcn) - Just click 'Build' then 'Run'.

Enjoy!

