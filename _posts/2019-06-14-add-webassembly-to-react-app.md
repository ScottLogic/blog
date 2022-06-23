---
title: Adding a WebAssembly component to a React App
date: 2019-06-14 00:00:00 Z
categories:
- alee
- Tech
tags:
- featured
author: alee
layout: default_post
summary: As a front-end developer working on real-world applications, WebAssembly
  isn't something I can actually use, is it? Let's find out how easy it can be using
  AssemblyScript.
image: ceberhardt/assets/featured/wasm.png
---

As a front-end developer working on real-world applications, I'd imagine that WebAssembly isn't something I can actually use. For one thing, it often requires special tools and platform support (e.g. likely emscripten and some form of Linux/Docker if you're using C++). Secondly, aren't WASM modules harder to work with than JavaScript modules?

But how easy could it be? If I'm working on a React application for example, could I easily add some WebAssembly to support some things that perhaps need to run a bit quicker?

## Some requirements

- It needs to be quick and easy to setup

If it takes a long time to setup all the necessary components and build tools, then it's not going to make it in.

- Minimal work for other team members

Other than running `npm install` to get any new dependencies, ideally the other developers shouldn't need to do anything. If they're not directly working on the WebAssembly code, then they shouldn't even need to know it exists.

- Familiar language

I do remember C++, mostly, but I'm not going to assume the rest of the team do, nor should they.

- No difficult runtime requirements

I shouldn't need to do anything clever to run the application, such as taking special care for hosting the WebAssembly module.

## AssemblyScript

AssemblyScript is based on TypeScript, which is already familiar to many front-end developers. There are no additional build tools required (just `npm install` and a new script in `package.json`). It also comes with a loader to help simplify the runtime JavaScript side.

The AssemblyScript documentation has recently been updated and can be found at [docs.assemblyscript.org](https://docs.assemblyscript.org/).

## A React App Demo

Let's put together a basic React app as a starting point, then add a WebAssembly component to it.

I've put this project in GitHub as a reference: [webassembly-in-react](https://github.com/DevAndyLee/webassembly-in-react).

The first step is easy:

~~~
npx create-react-app webassembly-in-react
~~~

That gives me a template React app with a single screen. Now we can add the AssemblyScript. 

~~~
npm install --save-dev AssemblyScript/assemblyscript
npx asinit .
~~~

The "asinit" command adds an example TypeScript file and the necessary build scripts to package.json. It also adds some example Node.js code in "index.js", which we won't be needing, so remove that. It should be pretty easy to manually reproduce what "asinit" does if desired.

I'm also going to change the build command so that the .wasm file is compiled into the "public" folder instead of "build". This means it'll get deployed along with any other static assets like images.

I'll update the start and build scripts to compile the AssemblyScript.

~~~
  "scripts": {
    "jsstart": "react-scripts start",
    "jsbuild": "react-scripts build",
    "asbuild": "asc assembly/index.ts -b public/as-api.wasm",
    "start": "npm run asbuild && npm run jsstart",
    "build": "npm run asbuild && npm run jsbuild"
  },
~~~

## Factorial

My example TypeScript function is going to calculate the factorial of a number and return the result (not difficult to do in JavaScript of course, but it'll do as a simple example). Here it is:

~~~typescript
// index.ts
export function factorial(value: f64): f64 {
  if (value == 0 || value == 1) return 1;
  return value * factorial(value - 1);
}
~~~

Notice the types, which are one of the ways [AssemblyScript differs from TypeScript](https://docs.assemblyscript.org/basics).

To call it from JavaScript, let's create a simple loader component.

~~~javascript
// wa-api.js
import {instantiateStreaming} from "assemblyscript/lib/loader";
export default instantiateStreaming(
    fetch('./as-api.wasm')
);
~~~

I've used the AssemblyScript's loader utility, which builds on the standard WebAssembly API and adds some additional features for handling memory, strings and arrays. Remember that the .wasm file will be included along with the other static assets, so should be in the right place.

We're exporting a Promise, rather than the API itself, since the .wasm file is loaded asynchronously.

Finally, here's the React screen that calls the function and displays the result:

~~~jsx
// App.js
import React, { useState } from 'react';
import waApi from './wa-api';

function App() {
  const [value, setValue] = useState(5);
  const [result, setResult] = useState();

  return (
    <div className="App">
      <p>
        The factorial of
        <input value={value} onChange={evt => setValue(evt.target.value)} />
        is {result}
      </p>
      <button onClick={async () => setResult((await waApi).factorial(value))}>
        Calculate
      </button>
    </div>
  );
}
~~~

That's it! That was pretty easy. Here's a screenshot

![factorial example]({{site.baseurl}}/alee/assets/assemblyscript-in-react/factorial-screenshot.png)


## Strings and Arrays

WebAssembly doesn't actually have strings and arrays (at least not yet). Instead it uses pointers to memory. AssemblyScript implements strings and arrays, but in order to pass them between the JavaScript and AssemblyScript code, we need to do a little extra work.

For example, here's a new function to scramble a string:

~~~typescript
// index.ts
export function scramble(input: string) : string {
  // implementation omitted for ugliness!
  // ...
  return result;
}
~~~

To call this function we can use the utilities in the [AssemblyScript loader](https://docs.assemblyscript.org/basics/loader) to copy the input string into memory and retrieve the output string.

In this case, I want this to be completely transparent to the caller of my API, so I'm going to extend my loader component to proxy this function:

~~~javascript
// wa-api.js
import {instantiateStreaming} from "assemblyscript/lib/loader";
export default instantiateStreaming(
    fetch('./as-api.wasm')
).then(rawModule => Object.assign({}, rawModule, {
    scramble: input => {
        // Create the string in memory and get the pointer
        const pInput = rawModule.__retain(rawModule.__allocString(input));

        // Call the WebAssembly function
        const pOutput = rawModule.scramble(pInput);

        // Retrieve the result string
        const result = rawModule.__getString(pOutput);

        // Free up memory
        rawModule.__release(pInput);
        rawModule.__release(pOutput);
        return result;
    }
}));
~~~

With that in place, my React component can call it like it would any other function:

~~~javascript
const result = (await waApi).scramble("string to scramble");
~~~

## Conclusion

With AssemblyScript, it's easy to add a WebAssembly component to a front-end application, without creating any additional burdens for developers. Maybe I can use it after all.
