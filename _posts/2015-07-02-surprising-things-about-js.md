---
title: Seven Surprising JavaScript 'Features'
date: 2015-07-02 00:00:00 Z
categories:
- lpage
- Tech
tags:
- featured
author: lpage
title-short: Surprising JavaScript
layout: default_post
summary: A look at some of the more unusual parts of JavaScript by examining seven
  things I've learnt recently.
image: lpage/assets/featured/javascript.jpg
---

Over the last couple of months I've made a few enhancements to JSHint, mainly as a way of learning ES6
(I'm [most proud](https://github.com/lukeapage/jshint/commit/08eb4e25962eb71f94c09f79b3b08288b91a7bce) of re-implementing
variable scope detection) and during that process I've come across a few things that surprised me, mostly about ES6
but also in ES3, including the following feature, which I've never used and this is where I will start.

## Break from any block

You should be aware that you can break and continue from any loop - it is a fairly standard programming language construct.
You might not be aware that you can label loops and jump out of any particular loop...

{% highlight js %}
outer: for(var i = 0; i < 4; i++) {
    while(true) {
        continue outer;
    }
}
{% endhighlight %}

The same applies to both `break` and `continue`. You will have definitely seen break used with switch statements...

{% highlight js %}
switch(i) {
   case 1:
       break;
}
{% endhighlight %}

Incidentally, this is why Crockford suggests your `case` should not be indented - the `break` jumps out of the `switch`, not the `case`, but I prefer the readability of indenting `case`.
You can also label switch statements...

{% highlight js %}
myswitch: switch(i) {
   case 1:
       break myswitch;
}
{% endhighlight %}

Another thing you can do is create arbitrary blocks (I know you can do this in C#, I expect other languages too).

{% highlight js %}
{
  {
      console.log("I'm in an abritrary block");
  }
}
{% endhighlight %}

So, we can put this together and label and break from arbitrary blocks.

{% highlight js %}
outer: {
  inner: {
      if (true) {
        break outer;
      }
  }
  console.log("I will never be executed");
}
{% endhighlight %}

Note that this only applies to break - you can only `continue` in a loop block.
I've never seen labels being used in JavaScript and I wondered why - I think it's because if I need to break two layers
of blocks, it's a good sign that the block might be more readable inside a function and there I will use a single break
or an early return to achieve the same thing.

However, if I wanted to write code that had a single return in every function, which is not to my taste, then I could use block breaking. E.g. Take this multiple return function...

{% highlight js %}
function(a, b, c) {
  if (a) {
     if (b) {
       return true;
     }
     doSomething();
     if (c) {
       return c;
     }
  }
  return b;
}
{% endhighlight %}

And use labels...

{% highlight js %}
function(a, b, c) {
  var returnValue = b;
  myBlock: if (a) {
     if (b) {
       returnValue = true;
       break myBlock;
     }
     doSomething();
     if (c) {
       returnValue = c;
     }
  }
  return returnValue;
}
{% endhighlight %}

The alternative being more blocks...

{% highlight js %}
function(a, b, c) {
  var returnValue = b;
  if (a) {
     if (b) {
       returnValue = true;
     } else {
       doSomething();
       if (c) {
         returnValue = c;
       }
    }
  }
  return returnValue;
}
{% endhighlight %}

I prefer the original, then using elses and then block labels - but maybe that's because it's what I'm used to?

## Destructuring an existing variable

First off, a quirk I cannot explain. It seems in ES3 you can add parentheses around a simple assignment and it works...

{% highlight js %}
var a;
(a) = 1;
assertTrue(a === 1);
{% endhighlight %}

If you can think of why anyone would do this, then please comment!

Destructuring is the process of pulling a variable out of an array or object. Most often you will see the following examples...

{% highlight js %}
function pullOutInParams({a}, [b]) {
  console.log(a, b);
}
function pullOutInLet(obj, arr) {
  let {a} = obj;
  let [b] = arr;
  console.log(a, b);
}
pullOutInParams({a: "Hello" }, ["World"]);
pullOutInLet({a: "Hello" }, ["World"]);
{% endhighlight %}

But you can also do it without a `var`/`let`/`const`. With arrays you can just write it as you expect...

{% highlight js %}
var a;
[a] = array;
{% endhighlight %}

But with objects you must surround the whole assignment in parenthesis...

{% highlight js %}
var a;
({a} = obj);
{% endhighlight %}

The reasoning was that there was too much scope for confusion with code blocks, since you can have anonymous code blocks and ASI (automatic semi-colon insertion) will convert identifiers to expressions that evaluate (and as shown in the example below, can have side effects...)

{% highlight js %}
var a = {
   get b() {
     console.log("Hello!");
   }
};
with(a) {
  {
    b
  }
}
{% endhighlight %}

Going back to the original example, where we parenthesised our identifier before assignment - you might think that also applies to destructuring. It doesn't.

{% highlight js %}
var a, b, c;
(a) = 1;
[b] = [2];
({c} = { c : 3 });
{% endhighlight %}

## Destructuring with numbers

Another aspect of destructuring you might not realise is that the property names do not have to be unquoted strings. They can be numbers..

{% highlight js %}
var {1 : a} = { 1: true };
{% endhighlight %}

Or quoted strings...

{% highlight js %}
var {"1" : a} = { "1": true };
{% endhighlight %}

Or you might want to pull out a computed name...

{% highlight js %}
var myProp = "1";
var {[myProp] : a} = { [myProp]: true };
{% endhighlight %}

Which makes it quite easy to write confusing code...

{% highlight js %}
var a = "a";
var {[a] : [a]} = { a: [a] };
{% endhighlight %}

## class declarations are block scoped

Functions are hoisted to their function scope, meaning you can have a function declaration after its usage...

{% highlight js %}
func();
function func() {
  console.log("Fine");
}
{% endhighlight %}

as opposed to function expressions which when assigned to a variable, the variable is hoisted but the assignment doesn't happen until the function expression is assigned.

{% highlight js %}
func(); // func is declared, but undefined, so this throws E.g. "func is not a function"
var func = function func() {
  console.log("Fine");
};
{% endhighlight %}

Classes have been a popular part of ES6 and have been widely touted as syntactic sugar for functions. So you might think that the following will work..

{% highlight js %}
new func();

class func {
  constructor() {
    console.log("Fine");
  }
}
{% endhighlight %}

But even though this is basically syntactic sugar for our first example, it doesn't work. It is actually equivalent to..

{% highlight js %}
new func();

let func = function func() {
  console.log("Fine");
}
{% endhighlight %}

Which means we are accessing `func` in the temporal dead zone (TDZ), which is a reference error.

## Same name parameters

I assumed it was not possible to specify parameters with the same name, however, it is!

{% highlight js %}
function func(a, a) {
  console.log(a);
}

func("Hello", "World");
// outputs "World"
{% endhighlight %}

Except in strict mode...

{% highlight js %}
function func(a, a) {
  "use strict";
  console.log(a);
}

func("Hello", "World");
// errors in chrome - SyntaxError: Strict mode function may not have duplicate parameter names
{% endhighlight %}

## typeof is not safe

[Okay, I stole this observation](http://es-discourse.com/t/why-typeof-is-no-longer-safe/15), but it is worth repeating.

Before ES6, it was well known you could always use typeof to safely find out if something was defined, whether it was declared or not...

{% highlight js %}
if (typeof Symbol !== "undefined") {
  // Symbol is available
}
// The following throws an exception if Symbol not declared
if (Symbol !== "undefined") {
}
{% endhighlight %}

But now this only works if you have not declared the variable using let or const. This because of the TDZ, which makes it a reference error to access the variable before declaration. Essentially the variable is hoisted to the beginning of the block, but it is a reference error to access it. In JSHint's scope manager I have to record usages of a variable, then if it is declared as a `let` or `const` within the current block or parent blocks, it is a reference error. If it is declared by a var statement it is valid but a JSHint warning and if it is not declared it is using a global and possibly a different warning.

{% highlight js %}
if (typeof Symbol !== "undefined") {
  // Symbol is available
}
let Symbol = true; // causes a reference error
{% endhighlight %}

## new Array

I've always avoided using the new Array constructor. Part of the reasoning is that its arguments can either be a length or a list of items...

{% highlight js %}
new Array(1); // [undefined]
new Array(1, 2); // [1, 2]
{% endhighlight %}

But a colleague was using it recently and came across something I haven't seen before..

{% highlight js %}
var arr = new Array(10);
for(var i = 0; i < arr.length; i++) {
  arr[i] = i;
}
console.dir(arr);
{% endhighlight %}

This produces an array of items from 0 to 9. But then, if this is refactored to use map...

{% highlight js %}
var arr = new Array(10);
arr = arr.map(function(item, index) { return index; });
console.dir(arr);
{% endhighlight %}

Then `arr` is unchanged. It seems that `new Array(length)` creates an array with that length, but does not set any items, so referring to the length works, but enumerating does not. What about if I set a number ?

{% highlight js %}
var arr = new Array(10);
arr[8] = undefined;
arr = arr.map(function(item, index) { return index; });
console.dir(arr);
{% endhighlight %}

Now I get an array where the 8th index is equal to 8, but all the others are set to undefined. Looking at the polyfill for map, it loops over every item (hence why index is correct) but uses an `in` check to see if the property is set. You also get the same behaviour using array literals...

{% highlight js %}
var arr = [];
arr[9] = undefined;
// or
var arr = [];
arr.length = 10;
{% endhighlight %}

## Other gems

Mozilla's developer blog has [a great post on arrow functions](https://hacks.mozilla.org/2015/06/es6-in-depth-arrow-functions/), which includes details of using `<!--` as an official ES6 comment token. It is worth checking out the [whole blog series](https://hacks.mozilla.org/category/es6-in-depth/) too.























