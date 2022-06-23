---
author: ceberhardt
layout: default_post
title: Transpiling WebAssembly to support Multi Return Values
summary: The WebAssembly specification is evolving, with many new features on the way. This blog post makes one of these future features available today, multi value returns, using the Babel approach of transpiling.
categories:
  - Tech
image: ceberhardt/assets/astexplorer.png
---

WebAssembly currently has a minimal feature-set, with the initial release designed to be an MVP (Minimum Viable Product). In the near future we'll likely see additional features being added as the WebAssembly specification evolves, and implementations shipped in the browser. For a bit of fun I thought I'd make one of these future features available today, using the Babel approach of transpiling. However, while Babel transpiles JavaScript, I'm going to be transpiling WebAssembly!

For the past few months I've been making contributions to [webassemblyjs](https://github.com/xtuc/webassemblyjs), which is a suite of tools for parsing, manipulating and executing WebAssembly within JavaScript. Most recently I've been working on the AST (Abstract Syntax Tree) tools which allow you to create, traverse and manipulate the WebAssembly AST. You can see this in action using the [AST Explorer](https://astexplorer.net/), where it was recently integrated.

<img src="{{site.baseurl}}/ceberhardt/assets/astexplorer.png"/>

This blog post is a good excuse to show off what you can do with these tools.

## Multi value

There are a number of proposed enhancements to WebAssembly, at varying levels of maturity, visible on the [GitHub issues page](https://github.com/WebAssembly/design/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%9B%A4+tracking%22). One of the features that is near complete is 'multi value'. It is currently at Phase 3, which means it's in the process of being implemented.

Currently WebAssembly functions can accept multiple parameters, but only return a single result. For example a function that has two `i32` parameters, and returns a single value has the following signature:

~~~webassembly
(func $foo (param i32 i32) (result i32)
  ;; code goes here
)
~~~

The multi value proposal details an enhancement whereby functions can returns multiple values, for example:

~~~webassembly
(func $foo (param i32 i32) (result i32 i32)
  ;; code goes here
)
~~~

Here's a concrete example of how it could be used in practice, a simple swap function:

~~~webassembly
(func $swap (param i32 i32) (result i32 i32)
  (get_local 1)
  (get_local 0)
)
~~~

This function takes the two values that are at the top of the stack, and swaps them over.

~~~webassembly
(i32.const 10)
(i32.const 20)
;; at this point the stack has the value 20 at the top
(call $swap)
;; now 10 is at the top, and 20 is beneath
~~~

Interestingly, in WebAssembly blocks can also return values, and this proposal adds multi value support to those also.

Currently if you try to compile a function from wat (WebAssembly text format) to wasm (the binary format) with multiple return values using the `wat2wasm` tool you'll receive the following error:

~~~
$ wat2wasm multi.wat
multi.wat:4:4: error: multiple result values not currently supported.
  (func $swap (param i32 i32) (result i32 i32)
~~~

So clearly you cannot execute this example today.

## Emulating multi value returns

Babel has revolutionised the way we work with JavaScript - gone are the days of waiting for the browsers to implement new language features. Instead we use Babel to transpile our code, replacing modern JavaScript language features with 'simpler' equivalents.

For example, here's a destructuring assignment (which is not supported in IE):

~~~javascript
const { a, b } = { a: 10, b: 20 }
~~~

Babel transpiles this into the following:

~~~javascript
var _a$b = { a: 10, b: 20 },
    a = _a$b.a,
    b = _a$b.b;
~~~

Which will work in any browser.

A similar approach can be used for multi return values in WebAssembly. It is actually a very simple feature to replicate with the existing WebAssembly instruction set, using global variables as a way to return multiple values.

The swap function can be re-written to store the 'return' values in globals:

~~~webassembly
(global (mut i32) (i32.const 0))
(global (mut i32) (i32.const 0))

(func $swap (param i32 i32)
  (get_local 1)
  (get_local 0)
  (set_global 0)
  (set_global 1)
)
~~~

Whenever it is invoked, the 'return' values can be retrieved from these globals.

Using the same example as above:

~~~webassembly
(i32.const 10)
(i32.const 20)
;; at this point the stack has the value 20 at the top
(call $swap)
(get_global 1)
(get_global 0)
;; now 10 is at the top, and 20 is beneath
~~~

So to emulate the multi value return behaviour any function that returns multiple values need to be updated to return via globals, and any `call` that invokes these functions needs to be followed by a number of `get_global` instructions to retrieve these values.

## Transpiling

I'm going to implement this feature as a wat to wat transform for readability, using the wat parser, printer and AST tools from webassemblyjs:

~~~javascript
const { parse } = require("@webassemblyjs/wast-parser");
const { print } = require("@webassemblyjs/wast-printer");
const t = require("@webassemblyjs/ast");
const traverse = t.traverse;
~~~

NOTE: wast is a superset of wat, with additional instructions used by the [WebAssembly spec test suite](https://github.com/WebAssembly/testsuite)

The wast-parser converts the wat source into an AST:

~~~javascript
const sourceWat = fs.readFileSync("swap.wat", "utf8");
const ast = parse(sourceWat);
~~~

The goal of this example is to transpile multi value returns, that will be supported in the future. This means that wast-parser needs to be able to parse wat files that make use of these features. Fortunately this was a [pretty trivial change to make](https://github.com/xtuc/webassemblyjs/pull/353) and has already been merged into the project.

Here's the simple example I'm going to use to illustrate:

~~~webassembly
(module
  (import "console" "log" (func $log (param i32 i32)))
  
  (func $swap (param i32 i32) (result i32 i32)
    (get_local 1)
    (get_local 0)
  )

  (func $go
    (call $log
      (i32.const 1)
      (i32.const 2)
    )
    (call $log
      (call $swap
        (i32.const 1)
        (i32.const 2)
      )
    ) 
  )
  (start $go)
)
~~~

This logs the two numbers, 1 & 2, then logs the result of 'swapping' them.

NOTE: If you want to explore the AST of the above example, remove the multi return, and cut and paste the code into [AST Explorer](https://astexplorer.net/) - our multi return support hasn't been merged into this project yet!

In order to create the right number of globals, the first task is to determine the maximum number of returns values from any function. The following code uses the AST `traverse` function, which recursively walks the AST tree, invoking visitor functions. In this case the visitor `Func` is invoked for every function in the AST:

~~~javascript
let maxReturns = 0;
traverse(ast, {
  Func(path) {
    const resultLength = path.node.signature.results.length;
    if (resultLength > maxReturns) {
      maxReturns = results;
    }
  }
});
~~~

Now that we know how many globals are required, they can be created as follows:

~~~javascript
const globalDefs = [];
for (var i = 0; i < maxReturns; i++) {
  const global = t.global(t.globalType("i32", "var"), [
    t.objectInstruction("const", "i32", [t.numberLiteralFromRaw(0)])
  ]);
  globalDefs.push(global);
}
~~~

The AST package exposes a number of constructor functions, e.g. `t.global`, that create AST nodes of the correct form.

Import instructions must appear at the start of wat files, so the next task is to find the index of the last import statement within the body of the module:

~~~javascript
const wasmModule = ast.body[0];
let lastImportIndex = -1;
wasmModule.fields.forEach((field, index) => {
  if (t.isModuleImport(field)) {
    lastImportIndex = index;
  }
});
~~~

This allows the globals to be inserted at the right location:

~~~javascript
const insert = (a1, a2, index) => [
  ...a1.slice(0, index),
  ...a2,
  ...a1.slice(index)
];

wasmModule.fields = insert(wasmModule.fields, globalDefs, lastImportIndex + 1);
~~~

NOTE: Based on the above, I think the AST tools could do with a way of inserting nodes before, or after the current context node. Babel has `insertBefore` and `insertAfter` for this purpose.

With these globals added, the next step is to transform the multi value functions, and any call operations that invoke them. This poses a bit of a challenge, functions can be referenced by their index within the module, or by label. In this example swap can be referenced by the label `$swap`, or index `1` (the imported function has index zero).

Rather than support both forms of reference, it would be easier if everything could reference by index. Fortunately webassemblyjs has a transform that does just this!

~~~javascript
const identifiedToIndex = require("@webassemblyjs/ast/lib/transform/wast-identifier-to-index/index");

// ...
identifiedToIndex.transform(ast);
~~~

Here's the result of this transform:

~~~webassembly
(func $go
  (call 0 ;; was $log
    (i32.const 1)
    (i32.const 2)
  )
  (call 0 ;; was $log
    (call 1 ;; was g$swap
      (i32.const 1)
      (i32.const 2)
    )
  ) 
)
(start 2) ;; was $go
~~~

Now we're ready to transform the functions themselves. The following locates any multi valued functions, removes their return values, replacing them with `set_global` instructions:

~~~javascript
let funcIndex = 0;
traverse(ast, {
  FuncImportDescr() {
    funcIndex++;
  },
  Func(path) {
    let results = path.node.signature.results.length;
    if (results > 1) {
      // remove all return values
      path.node.signature.results = [];
      // add global setters to the end of the function body
      for (var i = 0; i < results; i++) {
        path.node.body.push(t.instruction("set_global", [t.indexLiteral(i)]));
      }
      updateCallSites(funcIndex, results);
    }
    funcIndex++;
  }
});
~~~

It also calls the following function, which updates any `call` instructions that invoke the function, adding the global getters after the function is invoked:

~~~javascript
const updateCallSites = (funcIndex, resultsCount) => {
  traverse(ast, {
    CallInstruction(path) {
      if (path.node.index.value === funcIndex) {
        // find the parent property that holds the instructions
        const parentNode = path.parentPath.node;
        const instructions = parentNode.instrArgs;
        // find the index of this node within the parent
        const index = instructions.findIndex(i => i === path.node);
        // create the get global statements
        const globalGetters = [];
        for (var i = 0; i < resultsCount; i++) {
          globalGetters.push(t.instruction("get_global", [t.indexLiteral(i)]));
        }
        globalGetters.reverse();
        // insert the get global instruction
        parentNode.instrArgs = insert(instructions, globalGetters, index + 1);
      }
    }
  });
};
~~~

NOTE: I *really do* need to add an `insertAfter` method for adding siblings!

Once the transform is complete, all that remains is to write the AST back out as a wat file:

~~~javascript
const generatedWat = print(ast);
fs.writeFileSync("out.wat", generatedWat);
~~~

Here is the output, with the modifications annotated:

~~~webassembly
(module
  (import "console" "log" (func $log (param i32) (param i32) (param i32) (param i32)))

  ;; the globals used to return values
  (global (mut i32) (i32.const 0))
  (global (mut i32) (i32.const 0))

  ;; the swap function, which now returns two values via globals
  (func $swap (param i32) (param i32)
    (get_local 1)
    (get_local 0)
    (set_global 0)
    (set_global 1)
  )

  (func $go
    (call 0 ;; calls the imported log function, passing two numbers
      (i32.const 1) (i32.const 2)
    )
    (call 0 
      (call 1 ;; calls the swap function
        (i32.const 1) (i32.const 2)
      )
      ;; gets the result
      (get_global 1) (get_global 0))
    )
  )
  (start 3)
)
~~~

Compiling the above to wasm, via `wat2wasm` and executing, gives the expected result:

~~~
$ node run.js
1 2
2 1
~~~

The `run.js` file just loads and instantiates the wasm module.

I'm sure you are as excited as I am by that output! 

## A more advanced example

I'll finish with a slightly more advanced example. The following function takes an `i32` value and splits it into 4 bytes:

~~~webassembly
(module
  (import "console" "log" (func $log (param i32 i32 i32 i32)))

  (func $bytes (param i32) (result i32 i32 i32 i32)
    (i32.and
      (get_local 0)
      (i32.const 0xff)
    )
    (i32.and
      (i32.shr_u 
        (get_local 0)
        (i32.const 8)
      )
      (i32.const 0xff)
    )
    (i32.and
      (i32.shr_u 
        (get_local 0)
        (i32.const 16)
      )
      (i32.const 0xff)
    )
    (i32.and
      (i32.shr_u 
        (get_local 0)
        (i32.const 24)
      )
      (i32.const 0xff)
    )
  )

  (func $go
    (call $log
      (call $bytes
        (i32.const 0x55667788)
      )
    )
  )

  (start $go)
)
~~~

The result of each `i32.add` operation is left on the stack, with all four being returned due to the `(result i32 i32 i32 i32)` signature.

Running it through the transpiler gives the following:

~~~webassembly
(module
  (import "console" "log" (func $log (param i32 i32 i32 i32)))

  (global (mut i32) (i32.const 0))
  (global (mut i32) (i32.const 0))
  (global (mut i32) (i32.const 0))
  (global (mut i32) (i32.const 0))

  (func $swap (param i32) (param i32)
    (get_local 1)
    (get_local 0)
    (set_global 0)
    (set_global 1)
  )

  (func $bytes (param i32)
    (i32.and (get_local 0) (i32.const 0xff))
    (i32.and (i32.shr_u (get_local 0) (i32.const 8)) (i32.const 0xff))
    (i32.and (i32.shr_u (get_local 0) (i32.const 16)) (i32.const 0xff))
    (i32.and (i32.shr_u (get_local 0) (i32.const 24)) (i32.const 0xff))
    (set_global 0)
    (set_global 1)
    (set_global 2)
    (set_global 3)
  )

  (func $go
    (call 0 ;; calls the imported log function
      (call 2 ;; calls the $bytes function
        (i32.const 0x55667788)
      )
      (get_global 3)
      (get_global 2)
      (get_global 1)
      (get_global 0)
    )
  )
  (start 3)
)
~~~

And when run, it gives the following output:

~~~
$ node run.js
136 119 102 85 
~~~

## Conclusions

I think this is a great example of the power that webassemblyjs will bring in the future - and from my perspective, it was a fun exercise to try an use it in practice.

This transform isn't quite complete, here are a few remaining task:

  - it assumes that the wasm module doesn't already have any globals, indexing the additional globals from zero
  - it currently only supports the `i32` type
  - it doesn't support multi value blocks
  - finally, it currently only works for wat => wat transformation, the wasm parser also needs updating to support multi value

If you're interested in helping out with any of the above, why not [get involved and contribute](https://github.com/xtuc/webassemblyjs)?

Finally, you can see the complete [sourcecode of this transform in this gist](https://gist.github.com/ColinEberhardt/0ab739f18576e6e90ce784a765c26b75).