---
title: Migrating D3 Force Layout to WebAssembly
date: 2017-10-30 00:00:00 Z
categories:
- ceberhardt
- Tech
author: ceberhardt
layout: default_post
summary: In this blog post I'll take a look at a real-world application of WebAssembly
  (WASM), the re-implementation of D3 force layout. The end result is a drop-in replacement
  for the D3 APIs, compiled to WASM using AssemblyScript (TypeScript).
image: ceberhardt/assets/ForceLayout.png
colour: teal
header-shape: shape4
---

In this blog post I'll take a look at a real-world application of WebAssembly (WASM), the re-implementation of D3 force layout. The end result is a drop-in replacement for the D3 APIs, compiled to WASM using AssemblyScript (TypeScript).

In my [previous post](http://blog.scottlogic.com/2017/10/17/wasm-mandelbrot.html) on WASM I explored various different techniques for rendering Mandelbrot fractals. In some ways this is the perfect application for the technology, a computationally intensive operation, exposed via a simple interface that operates on numeric types.

In this post, I want to start explore slightly less contrived applications of WASM. As someone who is a frequent user of D3, I thought I'd have a go at re-implementing the force layout component. My goal? - create a drop-in replacement for the D3 APIs, with all the 'physics' computation performed using WASM. Rather than implement the entire API, my aim was to port the popular [Les Misérables example](https://bl.ocks.org/mbostock/4062045).

![ForceLayout.png]({{site.baseurl}}/ceberhardt/assets/ForceLayout.png)

Here is the force layout simulation for the above example:

~~~javascript
var simulation = d3.forceSimulation(graph.nodes)
    .force("link", d3.forceLink().links(graph.links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));
~~~

And here is the WASM equivalent:

~~~javascript
var simulation = d3wasm.forceSimulation(graph.nodes, true)
    .force('link', d3wasm.forceLink().links(graph.links).id(d => d.id))
    .force('charge', d3wasm.forceManyBody())
    .force('center', d3wasm.forceCenter(width / 2, height / 2))
~~~

As you can see, they are identical.

You can see the [WASM force layout in action here](https://bl.ocks.org/ColinEberhardt/6ceb7ca74aabac9c8534d7120d31b382). The sourcecode for this demo is [also available on GitHub](https://github.com/ColinEberhardt/d3-wasm-force).

## AssemblyScript

Typically WASM modules are created by compiling languages like C, C++, or Rust using Emscripten. However, in this instance I had a [pre-existing JavaScript codebase](https://github.com/d3/d3-force), so [AssemblyScript](http://assemblyscript.org/), which compiles TypeScript to WASM, seemed like a much better option.

I was hoping that the migration process would simply involve taking the d3-force code, and sprinkling a few types into the mix. Unfortunately it was a little more complicated than that!

Migration of the core algorithms, in this case a many-body, and 'link' force simulation, was quite straightforward.

Here's the original code for the link force simulation:

~~~javascript
function force(alpha) {
  for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
    link = links[i], source = link.source, target = link.target;
    x = target.x + target.vx - source.x - source.vx || jiggle();
    y = target.y + target.vy - source.y - source.vy || jiggle();
    l = Math.sqrt(x * x + y * y);
    l = (l - distances[i]) / l * alpha * strengths[i];
    x *= l, y *= l;
    target.vx -= x * (b = bias[i]);
    target.vy -= y * b;
    source.vx += x * (b = 1 - b);
    source.vy += y * b;
  }
}
~~~

And here it is migrated to AssemblyScript:

~~~javascript
let distance: f64 = 30;

export function linkForce(alpha: f64): void {
  for (let i: i32 = 0; i < linkArray.length; i++) {
    const link: NodeLink = linkArray[i];
    let dx: f64 = link.target.x + link.target.vx - link.source.x - link.source.vx;
    let dy: f64 = link.target.y + link.target.vy - link.source.y - link.source.vy;
    const length: f64 = sqrt(dx * dx + dy * dy);
    const strength: f64 = 1 / min(link.target.links, link.source.links);
    const deltaLength: f64 = (length - distance) / length * strength * alpha;
    dx = dx * deltaLength;
    dy = dy * deltaLength;
    link.target.vx = link.target.vx - dx * link.bias;
    link.target.vy = link.target.vy - dy * link.bias;
    link.source.vx = link.source.vx + dx * (1 - link.bias);
    link.source.vy = link.source.vy + dy * (1 - link.bias);
  }
}
~~~

As you can see, this is very similar and the migration of algorithms was straightforward. By far the most complicated part of the migration process was actually getting the data (nodes and links) into the WASM code ...

## WASM Module Interface

You can export functions from WASM modules allowing them to be invoked by your JavaScript code, and you can also import JavaScript functions so that they can be invoked from WASM. Unfortunately WASM only supports four types (all numeric), so you cannot simply provide the force layout algorithm with an array of links and nodes. In order to pass more complex data types, you have to (1) write the data to the WASM module linear memory from the hosting JavaScript, then (2) read the data from your WASM code.

As AssemblyScript is a subset of TypeScript it provides an interesting way of achieving this ...

The D3 force layout simulation manipulates an array of nodes. These can be represented as classes within AssemblyScript:

~~~javascript
export class Node  {
  x: f64;
  y: f64;
  vx: f64;
  vy: f64;
  links: f64 = 0;

  static size: i32 = 4;

  static read(node: Node, buffer: Float64Array, index: i32): Node {
    node.x = buffer[index * Node.size];
    node.y = buffer[index * Node.size + 1];
    node.vx = buffer[index * Node.size + 2];
    node.vy = buffer[index * Node.size + 3];
    return node;
  }

  static write(node: Node, buffer: Float64Array, index: i32): Node {
    buffer[index * Node.size] = node.x;
    buffer[index * Node.size + 1] = node.y;
    buffer[index * Node.size + 2] = node.vx;
    buffer[index * Node.size + 3] = node.vy;
    return node;
  }
}
~~~

The above code defines a node with a location (`x`, `y`), and velocity components (`vx`, `vy`), it also defines static functions for reading / writing the node to a `Float64Array`.

The following class handles reading / writing this array of nodes to module memory:

~~~javascript
class NodeArraySerialiser {
  array: Float64Array;
  count: i32;

  initialise(count: i32): void {
    this.array = new Float64Array(count * Node.size);
    this.count = count;
  }

  read(): Array<Node> {
    let typedArray: Array<Node> = new Array<Node>(this.count);
    for (let i: i32 = 0; i < this.count; i++) {
      typedArray[i] = Node.read(new Node(), this.array, i);
    }
    return typedArray;
  }

  write(typedArray: Array<Node>): void {
    for (let i: i32 = 0; i < this.count; i++) {
      Node.write(typedArray[i], this.array, i);
    }
  }
}
~~~

The module exports functions that allow the serialiser to be initialised from the hosting JavaScript code, allowing it to set the node array length (which initialises the `Float64Array`), obtain a reference to this array, and instruct the module to read from this array:

~~~javascript
let serializer = new NodeArraySerialiser();
let nodeArray: Array<Node>;

export function setNodeArrayLength(count: i32): void {
  serializer.initialise(count);
}

export function getNodeArray(): Float64Array {
  return serializer.array;
}

export function readFromMemory(): void {
  nodeArray = serializer.read();
}
~~~

The following code snippet shows how the JavaScript code that uses this module can pass the node data via this node array:

~~~javascript
import { Node }  from '../wasm/force';

const nodes = [
  {x: 34, y: 25},
  {x: 12, y: 22},
  ...
]

// initialise the wasm module memory
wasmModule.setNodeArrayLength(nodes.length);
const nodeBuffer = wasmModule.getNodeArray();

// write the node data
nodes.forEach((node, index) => Node.write(node as Node, nodeBuffer, index));

// instruct the wasm module to read the nodes
wasmModule.readFromMemory();
~~~

Because AssemblyScript is valid TypeScript, the above code re-uses the `Node` class which has the static methods for reading / writing nodes to array buffers! To achieve this, the build compiles the WASM module code twice, once with the TypeScript compiler, and once with the AssemblyScript compiler (more on this later).

The above code shows how nodes are passed from JavaScript to the WASM module. Once the WASM code has updated the nodes (positions and velocities) the same happens in reverse, i.e. WASM writes.

The following utility function executes any WASM function, surrounding it in the required read / write of nodes:

~~~javascript
const executeWasm = (wasmCode) => {
  // write the nodes to the WASM linear memory
  let nodeBuffer = computer.getNodeArray();
  nodes.forEach((node, index) => Node.write(node as Node, nodeBuffer, index));

  // read the values form linear memory
  computer.readFromMemory();

  wasmCode();

  // write back any updates
  computer.writeToMemory();

  // read back into the JS node array
  nodeBuffer = computer.getNodeArray();
  nodes.forEach((node, index) => Node.read(node as Node, nodeBuffer, index));
};
~~~

## Working with AssemblyScript

AssemblyScript is a subset of TypeScript, which means it only supports a subset of the language features. As an example, it doesn't support interfaces, or the declaration of functional types. AssemblyScript includes a number of built-in maths functions (min, sqrt, ...) which are [built-in WebAssembly operators](https://github.com/WebAssembly/design/blob/master/Semantics.md#floating-point-operators). However, there are a number of omissions, e.g. PI, sin, cos. For these, you either have to explore JavaScript implementations to your AssemblyScript code (which feels quite messy), or implement them using AssemblyScript primitives.

Another interesting notable difference between AssemblyScript and TypeScript is the array class. The AssemblyScript array interface implements a small subset of the TypeScript functionality. The reason for this is quite simple, WASM doesn't have an array type. In order to provide this functionality AssemblyScript has a small standard library which implements these features. You can see [the array implementation in the sourcecode](https://github.com/AssemblyScript/assemblyscript/blob/master/std/array.ts), notice the use of `malloc`, which is part of the lightweight runtime for AssemblyScript that becomes part of the module.

## Compiling to TypeScript

A really interesting feature of AssemblyScript is that you can run the same code through the TypeScript compiler. You do have to provide implementations of the AssemblyScript floating point operators. Thankfully, the JavaScript equivalents just slot straight in ...

~~~javascript
window.sqrt = Math.sqrt;
window.min = Math.min;
...
~~~

One difference with the TypeScript output is that when you return a `Float64Array` from your module you actually get the array, whereas with WASM the compiled function returns an integer which indicates the location of the array in memory.

In order to resolve the differences in the module interface when compiled to JavaScript or WASM, I created a simple proxy that adapted the WASM module, giving both the same interface:

~~~javascript
new Proxy(wasm, {
  get: (target, name) => {
    if (name === 'getNodeArray') {
      return () => {
        const offset = wasm.getNodeArray();
        return new Float64Array(wasm.memory.buffer, offset + 8, wasm.getNodeArrayLength() * Node.size);
      };
    } else if (name === 'getLinkArray') {
      return () => {
        const offset = wasm.getLinkArray();
        return new Uint32Array(wasm.memory.buffer, offset + 8, wasm.getLinkArrayLength() * NodeLink.size);
      }
    } else {
      return target[name];
    }
  }
})
~~~

This converts the integer 'pointers' returned by WASM into typed arrays.

Notice that the offset provided by the WASM module needs to have the magic number `8` added to it. This relates to the AssemblyScript array implementation, where the first few bytes are used to store the capacity and length before the array contents itself.

Being able to run the same code as both JavaScript (via TypeScript) and WASM is great for debugging, I found quite a few errors that in my module code that would have been really hard to track down if I only had access to the compiled module.

Although of course, there are further differences at runtime, for example, AssemblyScript types default to zero, whereas in TypeScript / JavaScript they default to `undefined`.

Currently the choice between WASM or JavaScript is exposed as a boolean argument on the simulation. Setting it to false will run the JavaScript module:

~~~javascript
var simulation = d3wasm.forceSimulation(graph.nodes, false)
~~~


## Bundling

One final thing I looked at was how WASM modules could be bundled. Most WASM examples load the WebAssembly binary over HTTP via the fetch API. This is not ideal for distribution of mixed WASM / JavaScript modules.

In order to bundle the two together I [wrote a simple rollup plugin](https://github.com/ColinEberhardt/rollup-plugin-webassembly) that base64 encodes the WASM module, and embeds it as a string. With this plugin included in the rollup config, imported WASM modules are returned as a promise which returns the module instance:


~~~javascript
import wasmCode from '../../build/force.wasm';

export const loaded = wasmCode()
  .then(instance => {
    // do something:
  });
~~~

The reason they return promises is because WASM compilation is not performed on the main thread to avoid locking the UI.

This does of course have an impact on consumers of this code, they too have to wait for the WASM code to be compiled. As a result, my force layout API exposes a `loaded` promise, which is used as follows:

~~~javascript
d3wasm.loaded
  .then(() => {
	const simulation = d3wasm.forceSimulation(graph.nodes, true)
        .force('charge', d3wasm.forceManyBody())
        .force('center', d3wasm.forceCenter(width / 2, height / 2))
        .force('link', d3wasm.forceLink().links(graph.links).id(d => d.id));  
  });
~~~

## Conclusions

Most people are currently focussing on the use of WebAssembly to bring performance critical code from other languages to the web. This is certainly a useful application of the technology.

However, I think that AssemblyScript (and [TurboScript](https://github.com/01alchemist/TurboScript), [speedy.js](https://github.com/MichaReiser/speedy.js)) demonstrate that we could be doing a lot more with this technology. If at some point in the future you could easily compile your JavaScript code to WASM, and enjoy improved load / parse times and performance, why wouldn't you?

We're clearly not there yet, porting JavaScript to AssemblyScript is not straightforward - however, this technology is very much in its infancy.

Remember, the [full sourcecode for this demo is available on GitHub](https://github.com/ColinEberhardt/d3-wasm-force).
