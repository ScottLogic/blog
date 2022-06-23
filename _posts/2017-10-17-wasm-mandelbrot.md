---
title: Exploring different approaches to building WebAssembly modules
date: 2017-10-17 00:00:00 Z
categories:
- ceberhardt
- Tech
author: ceberhardt
layout: default_post
summary: In this blog post I'll explore the various different ways you can create
  WebAssembly modules, using Emscripten, LLVM and AssemblyScript, comparing the tooling
  and performance.
image: ceberhardt/assets/featured/mandelbrot.jpg
colour: orange
header-shape: shape3
---

In this blog post I'll explore the various different ways you can create WebAssembly (WASM) modules, these include:

 - Emscripten, which is currently the 'standard' approach, as [described on the WebAssembly website](http://webassembly.org/getting-started/developers-guide/).
 - Hand-crafted toolchains, which remove some of the complexity of Emscripten.
 - AssemblyScript, as an example of the growing number of tools for compiling JavaScript to WASM.

 I'll take a look at the tooling, the interface between JavaScript and WASM, and everyone's favourite topic - performance!

## What is WebAssembly?

WebAssembly (or WASM) is a very new standard, having been kicked off as a collaboration between Mozilla, Microsoft, Google and others in 2015. The progress towards MVP was rapid, with [all four major browser announcing WASM support in early 2017](https://lists.w3.org/Archives/Public/public-webassembly/2017Feb/0002.html).

WASM is an assembly language that targets a 'virtual CPU' that runs alongside your JavaScript virtual machine, sharing memory, and importing / exporting functions to allow the two to communicate with each other. When writing algorithmic code, WebAssembly has a number of advantages over JavaScript including:

1. WASM modules are delivered in a binary format, so are compact and don't require parsing.
2. It is a simple, low-level assembly language that can be rapidly compiled and optimised.
3. WASM code is compiled and optimised when built (just like C++), rather than leaving the optimisation to the runtime.

Put simply, JavaScript is not an efficient compilation target, with the browser having to parse, optimise / de-optimise, garbage collect etc ... (for more detail, see [Lin Clark's excellent cartoon tutorial to WASM](https://hacks.mozilla.org/2017/02/a-cartoon-intro-to-webassembly/)).

## Mandelbrot

Currently there is additional overhead in crossing the WASM / JavaScript boundary (although I have read that this will reduce over time). Therefore most applications of WebAssembly technology concentrate on complex algorithmic tasks that can easily be handed off to a WASM module. Fractals are a great example of this type of task, which is why I opted for a Mandelbrot algorithm as my test-bed.

For the Emscripten and LLVM-based approaches I wrote a simple Mandelbrot algorithm using C. Here's a brief snippet of that code:

~~~c
const int WIDTH = 1200;
const int HEIGHT = 800;
unsigned char image[WIDTH * HEIGHT * 4];

...

void mandelbrot(int maxIterations, double cx, double cy, double diameter) {
  double verticalDiameter = diameter * HEIGHT / WIDTH;
  for(double x = 0.0; x < WIDTH; x++) {
    for(double y = 0.0; y < HEIGHT; y++) {
      // map to mandelbrot coordinates
      double rx = scale(cx, diameter, WIDTH, x);
      double ry = scale(cy, verticalDiameter, HEIGHT, y);
      int iterations = iterateEquation(rx, ry, maxIterations);
      int idx = ((x + y * WIDTH) * 4);
      // set the RGB and alpha components
      image[idx] = iterations == maxIterations ? 0 : colour(iterations, 0, 4);
      image[idx + 1] = iterations == maxIterations ? 0 : colour(iterations, 128, 4);
      image[idx + 2] = iterations == maxIterations ? 0 : colour(iterations, 356, 4);
      image[idx + 3] = 255;
    }
  }
}

unsigned char* getImage() {
  return &image[0];
}
~~~

(You can see [the complete code on GitHub](https://github.com/ColinEberhardt/wasm-mandelbrot/blob/master/c/mandelbrot.c))

The above code is quite straightforward; an image array buffer is created, with the mandelbrot function iterating over each pixel, calculating the number of iterations of the mandelbrot equation, then colouring the pixel accordingly.

Note, the code was written with readability in mind, rather than performance!

## Emscripten

The most widely used tool for generating WASM modules is Emscripten, which is based on the LLVM compiler infrastructure project. In order to use Emscripten you need to clone and compile the SDK project. The MDN documentation provides a [decent set of instructions you can follow](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm).

With Emscripten you can compile C code into WASM modules using the `emcc` command:

~~~
emcc mandelbrot.c -s WASM=1 -o mandelbrot.wasm
~~~

Under-the-hood this uses clang to compile C into LLVM intermediate representation, together with the fastcomp fork of the llc compiler to generate asm.js. Finally BinaryEn is used to compile asm.js into WASM. Yes, it's complicated!

When compilation is complete Emscripten outputs two files, a WASM module and a JavaScript file which acts as a 'loader'. With the default options, Emscripten generates quite a 'fat' WASM module which includes various system libraries. This allows support for various standard C libraries got memory management, binding, and a host of other features which make porting C / C++ code a lot easier.

However, for this simple mandelbrot example I don't need any of these advanced features. Fortunately Emscripten has experimental support for [side modules](https://github.com/kripken/emscripten/wiki/WebAssembly-Standalone) that generate standalone modules.

Adding this, together with a suitable optimisation level (O3), this is the build command:

~~~
emcc mandelbrot.c -O3 -s WASM=1 -s SIDE_MODULE=1 -o mandelbrot.wasm
~~~

With a side-module you no longer need the bloated Emscripten JavaScript loader, and can load the WASM module using the standard JavaScript APIs:

~~~javascript
const res = await fetch('emscripten/mandelbrot.wasm');
const buffer = await res.arrayBuffer();
const module = await WebAssembly.compile(buffer);

const imports = {
  env: {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
      initial: 512
    }),
    table: new WebAssembly.Table({
      initial: 0,
      element: 'anyfunc'
    })
  }
};

const instance = new WebAssembly.Instance(module, imports);
~~~

You can interact with WebAssembly modules via imported (that allow WASM modules to call JavaScript functions) and exported functions (that allow JavaScript to call WASM functions). However, WASM only has four basic numeric types, which makes moving things like strings, or image buffers across the boundary a little interesting.

In the C code, the following function returns a pointer to the image array:

~~~c
unsigned char* getImage() {
  return &image[0];
}
~~~

This returns a value of type `unsigned char*`, which is a pointer to an `unsigned char`. There is no support for this type in WebAssembly, when invoking this exported function from your JavaScript code it instead returns an integer, which is the location of this image buffer within the module's linear memory.

Rendering the mandelbrot to a canvas involves using this offset to create an array, `Uint8Array`, as a 'view' on the underlying module memory, then copying the data into the canvas.

~~~javascript
const imgData = context.createImageData(WIDTH, HEIGHT);
const offset = instance.exports._getImage();
const linearMemory = new Uint8Array(imports.env.memory.buffer,
  offset, WIDTH * HEIGHT * 4);
for (let i = 0; i < linearMemory.length; i++) {
  imgData.data[i] = linearMemory[i];
}
context.putImageData(imgData, 0, 0);
~~~

As you can see, this is a pretty low-level operation, which is why more complex applications use the tooling Emscripten provides for mirroring C++ types within JavaScript code.

I've created a simple demo page that allows you to view the [Emscripten-generated WebAssembly mandelbrot](https://colineberhardt.github.io/wasm-mandelbrot/#Emscripten).

Here's a screenshot:

<img class="aligncenter" src="{{ site.baseurl }}/ceberhardt/assets/wasm/mandelbrot.png"/>

With Emscripten you can of course compile to asm.js, in this case simply by omitting the `-s WASM=1` option. You can see the [asm.js build in action on the same page](https://colineberhardt.github.io/wasm-mandelbrot/#asm.js).

## LLVM-based toolchains

Emscripten is a powerful tool for porting large-scale C / C++ codebases, although, for simple algorithms the WASM, and supporting JavaScript it generates are a little bloated.

Rather than using Emscripten as a front-end to the various underlying LLVM tools, you can actually assemble your own toolchain. Rather than compile WASM via asm.js (which is what Emscripten does), you can compile to WASM directly using `clang` and `llc`, together with `s2wasm` and `wat2wasm` from the BinaryEn project:

~~~
clang -emit-llvm  -O3 --target=wasm32 ...
llc -march=wasm32 -filetype=asm ...
s2wasm ...
wat2wasm ...
~~~

Rather than install and configure these tools manually, I used the [wasm-toolchain](https://github.com/tpimh/wasm-toolchain) project which wraps these up into a single script. I also found a more comprehensive [minimal wasm toolkit](https://github.com/dcodeIO/webassembly), and a few other projects using this approach.

You can [see the results here](https://colineberhardt.github.io/wasm-mandelbrot/#WebAssembly). (You probably get the picture, the output for all of these looks exactly the same!)

## AssemblyScript

The final method I explored was the use of [AssemblyScript](https://github.com/AssemblyScript) which allows you to compile TypeScript into WASM.

AssemblyScript supports a subset of the TypeScript language, here are a few of the restrictions it imposes:

 - no interfaces
 - a simplified Array interface
 - no implicit types
 - no string / dates
 - support for the the four 'core' WASM types - `i32`, `i64`, `f32`, `f64`

As you can see, with these restrictions in place you cannot easily take a pre-existing TypeScript application and port it to WASM. Also, as well as the language restrictions above, you cannot access the DOM or Web APIs directly.

Despite these restrictions, which are pretty much a direct reflection of the WASM runtime environment, I do think this approach is tremendously useful. It allows JavaScript developers to crate WASM modules within having to learn (or in my case re-learn) C!

Here's a snippet of the AssemblyScript module:

~~~javascript
const WIDTH: f64 = 1200, HEIGHT: f64 = 800;
const data: Uint8Array = new Uint8Array(1200 * 800 * 4);

export function mandelbrot(maxIterations: i32, cx: f64, cy: f64, diameter: f64): void {
  const verticalDiameter: f64 = diameter * HEIGHT / WIDTH;
  for (var x: f64 = 0; x < WIDTH; x++) {
    for (var y: f64 = 0; y < HEIGHT; y++) {
      // convert from screen coordinates to mandelbrot coordinates
      const rx: f64 = scale(cx, diameter, WIDTH, x);
      const ry: f64 = scale(cy, verticalDiameter, HEIGHT, y);
      const iterations: i32 = iterateEquation(rx, ry, maxIterations);
      const idx: i32 = ((x + y * (WIDTH as f64)) * 4) as i32;
      data[idx] = iterations == maxIterations ? 0 : colour(iterations, 0, 4);
      data[idx + 1] = iterations == maxIterations ? 0 : colour(iterations, 128, 4);
      data[idx + 2] = iterations == maxIterations ? 0 : colour(iterations, 356, 4);
      data[idx+3] = 255;
    }
  }
}

export function getData(): Uint8Array {
  return data;
};
~~~

When compiled to WASM you interface with this module in exactly the same way, via the exported functions. Also, the `getData` function returns an integer when invoked from JavaScript, so the same buffer copying technique employed with Emscripten is required.

You can see the [AssemblyScript version in action here](https://colineberhardt.github.io/wasm-mandelbrot/#AssemblyScript).

One interesting benefit of using TypeScript as a source for WASM is that you can also run the same code through the TypeScript compiler to generate JavaScript instead. This is a really useful method for debugging your AssemblyScript!

Here's the output from the [AssemblyScript code compiled to TypeScript](https://colineberhardt.github.io/wasm-mandelbrot/#TypeScript).

However, there is one subtle difference, when compiled to TypeScript the exported interface is slightly different, with the `getData` function above returning a `Uint8Array` rather than an integer.

AssemblyScript is not unique, I have found a couple of other projects that provide support for TypeScript to WASM compilation, [TurboScript](https://github.com/01alchemist/TurboScript) and [speedy.js](https://github.com/MichaReiser/speedy.js). Both look quite similar, although speedy.js has an interesting approach where code that is compiled into WASM is embedded directly into your application code, using a `"use speedyjs"` literal string to mark functions for compilation.

## Performance

Probably the first people ask when you show them some WebAssembly code is "what's the performance like?".

Reading about the experience others have had, the results vary wildly. I've read a blog post that claims a [x84 speed increase in a simple Fibonacci algorithm using AssemblyScript](https://medium.com/@BenedekGagyi/the-simplest-way-to-get-started-with-webassembly-1f92f6f90d24)!

To counter that claim, I found a [slightly more thorough analysis](https://medium.com/@mbebenita/webassembly-is-30x-faster-than-javascript-c71ea54d2f96) that includes some warnings against micro-benchmarking:

> Don’t write tiny WebAssembly functions expecting them to be faster than JS. You’ll most likely be paying for the call overhead and that will outweigh whatever speed benefit you get from WebAssembly in the first place.

I also found a much more balanced article that shows a 30% speed increase when [applying WASM to a D3 pack algorithm](https://hackernoon.com/screamin-speed-with-webassembly-b30fac90cd92), and another that showed a [roughly comparable speed to JavaScript for an n-body simulation](http://www.stefankrause.net/wp/?p=405):

> it seems like JavaScript VMs are already pretty good at simple numeric code. For the other browsers WebAssembly couldn’t beat the JavaScript versions yet.

So how did my various implementations compare? The following graph shows the execution time (lower is better), for the various implementations, benchmarked against a C version (optimised with `-Ofast`), shown as the solid black line.

<img class="aligncenter" src="{{ site.baseurl }}/ceberhardt/assets/wasm/performance.png"/>

A few things to note:

 - JavaScript is really fast! In this case it is just 25% slower than native. This agrees with many other JavaScript vs. C benchmarks I've seen.
 - With my code WebAssembly is roughly the same speed as JavaScript. This could be due to (1) my inexperience at correct toolchain configuration, or (2) immaturity of the WebAssembly runtime.
 - asm.js is slow in Chrome, this is most likely because it is running it as JavaScript, rather than asm (which will skip the standard JavaScript benchmark compiler).

So what *should* the performance of WebAssembly look like? considering that JavaScript is only marginally slower than native code, there isn't a huge gap to close. The more reliable source is a [joint paper from Mozilla, Apple, Microsoft and Google](http://link.crwd.fr/45ZL#https://blog.acolyer.org/2017/09/18/bringing-the-web-up-to-speed-with-webassembly):

> WebAssembly is on average 33.7% faster than asm.js, with validation taking only 3% of the time it does for asm.js

> WebAssembly binaries are also compact, being on average 62.5% the size of asm.js, and 85.3% of native x86-64 code.

If you're interested in the various code examples, you can [find them on GitHub](https://github.com/ColinEberhardt/wasm-mandelbrot). I'll probably add speedy.js and TurboScript examples - I think the TypeScript-based tooling is a very interesting angle for web developers.
