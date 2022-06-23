---
author: ceberhardt
layout: default_post
title: Serverless Rust with AWS Lambda and WebAssembly
summary: In this post, I look at how WebAssembly can be used to create serverless functions and demonstrate an AWS Lambda function written entirely in Rust.
categories:
  - Cloud
image: ceberhardt/assets/featured/rust-wasm.jpg
tags:
  - featured
---

In this post, I look at how WebAssembly can be used to create serverless functions and demonstrate an AWS Lambda function written entirely in Rust.

## WebAssembly

WebAssembly is a relatively new compilation target for high-level languages (Rust, C++, Go), which, as the name implies, is predominantly focussed on the web. For the first time in the 20+ history of the web, developers have a first-class alternative to JavaScript.

Despite the name, WebAssembly is not coupled to the web. It was designed to be 'host' agnostic, and as a result WebAssembly virtual machines have popped up in all kinds of interesting places such as the Ethereum blockchain. Recently I saw an [interesting blog post from Cloudflare](https://blog.cloudflare.com/webassembly-on-cloudflare-workers/) announcing that their 'workers' now support WebAssembly, allowing you to write serverless applications using a wide range of programming languages (that target WebAssembly).

This made me wonder, can I write an AWS Lambda function using WebAssembly, and the answer was 'yes'!

It was surprisingly easy to write a lambda function, entirely with Rust. An idea which I think has great potential. This blog post dives into the details.

## AWS Lambda Functions

The serverless pattern involves writing event-driven functions that are deployed to the cloud. AWS Lambda functions are an implementation of the serverless pattern, and arguably the most popular at the moment. 

AWS Lambda functions are executed on a server or container, however, the provisioning and capacity management (scaling) of the underlying infrastructure is hidden from the developer. Another advantage of Lambda is the charging model, where you pay by execution, rather than paying for a reserved capacity.

Here's a simple lambda function that returns an HTTP 200, and a 'hello world' message:

~~~javascript
module.exports.handler = async () => {
  return {
    statusCode: 200,
    body: "Hello world!"
  };
};
~~~

Lambda functions are really easy to write, however with AWS you typically require infrastructure around your functions (e.g. API gateway) in order to make them do something useful. This is why I'm a big fan of the [serverless framework](https://serverless.com/), which makes it really easy to create infrastructure around your functions. Here's a simple example that exposes a function via the API gateway and a simple HTTP GET endpoint:

~~~
service: rust-lambda-serverless 

provider:
  name: aws
  runtime: nodejs8.10

functions:
  hello:
    handler: index.handler
    events:
     - http:
         path: hello
         method: get
~~~

Deploying the function is as simple as running `serverless deploy`.

AWS Lambda functions support Node v8.10, which includes WebAssembly support, which means lambda function can load and execute WebAssembly modules.

## Rust with WebAssembly

My first experiment was to create a simple 'hello world' message from a WebAssembly module, compiled from Rust. This sounds quite simple, however WebAssembly doesn't have a string type (it only has 4 numeric types), so returning a string from a WebAssembly module is actually quite challenging!

Rust has a very active WebAssembly community, which have been actively developing tools that support WebAssembly development. Probably the most significant development to come out of this community is [wasm-bindgen](https://rustwasm.github.io/wasm-bindgen/), a tool which generates bindings that make it much easier to interface between JavaScript and Rust code (compiled to WebAssembly). 

Here's a simple Rust function that returns a 'hello world' message:

~~~rust
#[wasm_bindgen]
pub fn hello_world() -> String {
  let mut string = String::new();
  string.push_str("Hello, rust-lambda!");
  return string;
}
~~~

The `wasm_bindgen` directive (apologies if my terminology is incorrect, I'm not a Rust developer!), instructs the `wasm-bindgen` to generate bindings for the function.

Using the `wasm-pack` tool is a convenient wrapper around the rust compiler / cargo / wasm-bindgen, which makes it easy for people who know next to nothing about Rust (i.e. me!) to build and run a simple Rust project. The default target for this toolchain is the browser, which results in JavaScript code using ES6 modules. As this code is running in node, we want to use Node APIs and CommonJS:

~~~
$ wasm-pack build --target nodejs
~~~

The above command compiles the Rust code into a wasm module, a JavaScript file that loads and instantiates the module, and a JavaScript file that contains the binding code.

Looking into the generated binding code for the `hello_world` function, you can see that the Rust function returns an index, which is the location of the string within the wasm module's linear memory. The binding code takes this index, and uses it to extract the string from memory:

~~~javascript
module.exports.hello_world = function() {
    const retptr = globalArgumentPtr();
    wasm.hello_world(retptr);
    const mem = getUint32Memory();
    const rustptr = mem[retptr / 4];
    const rustlen = mem[retptr / 4 + 1];
    const realRet = getStringFromWasm(rustptr, rustlen).slice();
    wasm.__wbindgen_free(rustptr, rustlen * 1);
    return realRet;
};
~~~

Using this module within my lambda function was as simple as adding a module import, and invoking the `hello_world` method:

~~~javascript
const wasm = require("./pkg/rust_lambda");

module.exports.handler = async () => {
  return {
    statusCode: 200,
    body: wasm.hello_world()
  };
};
~~~

With the serverless framework I was able to deploy to AWS and invoke the function:

~~~
$ serverless deploy
...
$ serverless invoke -f handler
{
    "statusCode": 200,
    "body": "Hello, rust-lambda!"
}
✨  Done in 2.93s.
~~~

Wow, that was easy!

## Death to JavaScript

We all know that the real reason WebAssembly was created was to kill JavaScript (I'm being sarcastic - please don't flame me!).

While I was excited to create a lambda function that used a Rust wasm module, I was frustrated that I still need JavaScript to glue it all together. In order to eliminate the JavaScript completely, I needed to create a function that has the expected 'signature' for a lambda function handler from my Rust code. The `handler` function is `async`, which means it returns a `Promise`. 

Fortunately the recently released [js-sys crate](https://rustwasm.github.io/2018/07/26/announcing-the-js-sys-crate.html) contains the required bindings to make this work. Here's the required Rust code to create a suitable handler:

~~~rust
extern crate wasm_bindgen;
extern crate js_sys;

use js_sys::{Object, Reflect, Promise};
use wasm_bindgen::prelude::*;

pub fn response(status: u8, body: String) -> Object {
  let object = Object::new();
  Reflect::set(&object.as_ref(), &"statusCode".into(), &status.into());
  Reflect::set(&object.as_ref(), &"body".into(), &body.into());
  return object;
}

#[wasm_bindgen]
pub fn handler() -> Promise {
  let mut string = String::new();
  string.push_str("Hello, rust-lambda!");
  let res = response(200, string);
  return Promise::resolve(res.as_ref());
}
~~~

Working with JavaScript types directly within Rust is a little cumbersome, but it works!

With my updated Rust code I was able to delete my JavaScript handler and update the serverless configuration to point directly to the generated bindings for my wasm module:

~~~
...
functions:
  hello:
    handler: pkg/rust_lambda.handler
...
~~~

My lambda function is now 100% Rust :-)

## Thoughts

You might be wondering why you'd want to write a lambda function using Rust? An often-cited advantage that WebAssembly has over JavaScript is performance - wasm modules load and compile faster, and have generally more consistent performance than their JavaScript counterparts.

Is this useful for lambda functions? Probably not. Performance optimising code that runs in the browser makes a lot of sense, your resources are constrained. However, with a serverless architecture you can scale, which is sometimes a more cost effective way of improving performance. 

One disadvantage of lambda functions is their 'cold start' time. When your API is under load, AWS will have to spin up new containers to host your functions. The cold start time does depend on the complexity of the code within your lambda function, therefore having lambda functions that initialise quickly (which should be the case with WebAssembly) can reduce cold start times.

I still think these benefits are marginal. I think the most valid reason for using Rust within lambda functions is that Rust developers will want to!

If you want to try out my code, you can find (what little there is of it) [on GitHub](https://github.com/ColinEberhardt/rust-webassembly-serverless).

Thoughts? Ideas? Feedback? [Discuss this post over on reddit](https://www.reddit.com/r/rust/comments/9pac29/serverless_rust_with_aws_lambda_and_webassembly/).
