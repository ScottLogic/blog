---
title: JavaScript Closure
date: 2018-02-23 00:00:00 Z
categories:
- dogle
- Tech
tags:
- featured
author: dogle
layout: default_post
summary: In this blog post I'll be exploring Lexical Scope in JavaScript and answering
  the question "What is Closure?"
image: dogle/assets/featured/fence.jpg
---

I've been looking into the concept of closure in JavaScript, trying to really understand what it means. In the process I learnt quite a few new things about how JavaScript compiles and runs and why things happen the way they do and I thought I'd share.

Closure then, what's that? Here's a definition from the ["You Don't Know JS"](https://github.com/getify/You-Dont-Know-JS/tree/master/scope%20%26%20closures) book series:

> Closure is when a function is able to remember and access its Lexical Scope even when that function is executing outside its Lexical Scope.

Ok, don't know about you but I've still no clue, however this does give us a starting point. So let's start at the beginning, what's scope? 

## Scope ##

Well I'd always thought of it as the variables and functions that are available to you at a specific point in the code. I think with hindsight this is just about the gist of it. The [MDN web docs](https://developer.mozilla.org/en-US/docs/Glossary/Scope) defines it as follows:

> The current context of execution. The context in which values and expressions are "visible," or can be referenced. If a variable or other expression is not "in the current scope," then it is unavailable for use. Scopes can also be layered in a hierarchy, so that child scopes have access to parent scopes, but not vice versa.

Great so now we're happy with scope, what's Lexical Scope? Turns out there are two models for defining scope, Lexical and Dynamic. In Lexical Scope the scope is defined at Lexing time, the first stage of the compiler process where a string of source code is tokenized. This means that scope in JavaScript is set at compile time, conversely Dynamic Scope is is set at run time. Time for an example:

~~~javascript
function print() {
    console.log(message);
}

function first() {
    var message = "dynamic";
    print();
}

var message = "lexical";

first(); // lexical
~~~

In the above example the JavaScript Compiler references the global `message` variable at compile time. When `print()` is called, because `message` does not appear in `print`'s scope the JavaScript Engine will look for `message` in the next scope level up, which will be the global scope, as both `first` and `print` are declared in that scope (due to their position in the code) and return "lexical". If the scope was dynamic when `message` was not found in `print`'s scope the Engine would look up the call stack for the variable and find the `message` declaration from the `first` function, resulting in a print out of "dynamic". JavaScript then uses Lexical Scope over Dynamic Scope and understanding that can help us leverage it to our advantage.

Ok now we know a little bit about the two types of scope and which one we are using(Lexical), but what exactly defines a new level of scope?

### Functions ###

~~~javascript
var a = 0;

function first() {
    var a = 1;
    
    function second() {
        var a = 2;
    
        function third() {
            var a = 3;
            console.log(a); // 3
        }
        third();
        console.log(a); // 2
    }
    second();
    console.log(a); // 1
}

first();
console.log(a); // 0
~~~

In the above example each value of `a` represents the scope level where 0 is the global scope, 1 is the scope of `first` etc. Each time we add a new function we add a new level of scope. If the Engine does not find the variable it is looking for in the given scope it will look up parent scopes until it finds it or gets to the global scope. For instance if we remove the `var` keyword from the `third` function declaration of `a` then the Engine would fail to find `a` in that scope and look in the next level up, assigning the value **3** to the `a` declared in the scope of `second`. As a result instead of

```3210```

the printout would be

```3310```

We can use this functionality to hide variables from the outside scope and make it a bit more efficient using a Immediately Invoked Function Expression (IIFE).

### IIFE ###

"A what?" I hear you ask! Well let's start with the second bit, Function Expression: In JavaScript we can have a function declaration: 

~~~javascript
function myFunction() { ... };
~~~

or a function expression:

~~~javascript
(function myFunction() { ... });

// or

var myFunction = function() { ... };
~~~

Function declarations must start with the keyword `function` and must be named. A function expression is defined as part of a larger expression, often a variable assignment. We can also immediately invoke a function expression using the following syntax:

~~~javascript
(function iife() { 
    var myHiddenVar = true;
 })();

 // or

 (function iife() { ... }());
~~~

The parentheses at the end of the statement immediately calls the preceding function. 

### Block Scope - Let / Const / Catch ###

From ES3 onwards the `catch` block of a `try / catch` statement is block scoped. Meaning that variables declared within a catch are only accessible within that block. As of ES6 the `let` and `const` keywords allow block scope for variable declaration.

~~~javascript
if(true) {
    var a = "global"; 
    let b = "block";
}
console.log(a); // global
console.log(b); // ReferenceError
~~~

As we can see in the above code the `b` is block scoped to the `if` statement whereas `a` is not. 

## Hoisting ##

Consider the following code: 

~~~javascript
1| myVar = "my value";
2| var myVar;
3| console.log(myVar);
~~~

Rather than printing `undefined` as you might expect, the console log on line 3 prints "my value". What's happening here is that at compile time the compiler creates a reference to `myVar` in the global scope on line 1, at line 2 the variable already appears in the scope so it is ignored. At run time "my value" is assigned to `myVar` and printed at line 3. This is essentially the same as lifting the declaration of `var myVar` to line 1 and is know as *hoisting*. 
Lets take a look at how this works with functions. 

~~~javascript
1| myFunction(); // first
2| 
3| myFunction = function () {
4|    console.log("second");
5| };
6|
7| function myFunction() {
8|    console.log("first");
9| }
~~~

Functions are hoisted first over variable declarations so what happens in the above code is that the compiler first stores `myFunction` in the global scope against the definition on line 7. At run time the call to `myFunction` prints "first" from the function declaration. Then the variable myFunction is assigned to function at line 3.

## Closure ##

So what has all of this got to do with the original question of "What is Closure"? Good question! In order to understand closure it is helpful to understand how Lexical Scope works in JavaScript. Now we have that under our belts let's go back to that original definition 

> Closure is when a function is able to remember and access its Lexical Scope even when that function is executing outside its Lexical Scope.

This is starting to make more sense, now that we understand the concept of Lexical Scope, so let's have a look at some code:

~~~javascript
function first() {
    let myVar = 'hello closure';

    function second() {
        console.log(myVar);
    }
    
    return second;
} 

let print = first();

print(); // hello closure
~~~

In the above code the function `second` has **closure** over the the function `first`, that is to say that it has access to the scope of `first`. When we assign the return value of `first` to the variable `print` we move the function outside of its Lexical Scope. Then we execute `print` and get the correct print out "hello closure", which means our function `second` still has access to its Lexical Scope and closure is observed. Under different circumstances after second is executed the JavaScript Engine's Garbage collector would free up the memory used by the Scope of `first`, however with closure this doesn't happen so that `second` still has access to it's parent's Scope. 

The useful thing here is to be able to pair our variables with the function that uses them. So what we can now do is modify our `first` function to emulate something more like a Java style class:

~~~javascript
function myClass() {
    let myVar = 'hello closure';
    let myVar2 = 1;

    function first() {
        console.log(myVar);
    }

    function second() {
        privateThird();
        console.log(myVar2);
    }

    function privateThird() {
        myVar2++;
    }

    return {
        first: first,
        second: second
    };
}

let mc = myClass();
mc.first();
mc.second();
~~~

Here we are using closure to effectively make the two variables `myVar` and `myVar2` and the function `privateThird` private. The function `myClass` returns `first` and `second` as an object, allowing them to be called from outside of their Lexical Scope. The result is that we can assign the return value of myClass to a variable and then call the two exposed functions, which will keep access to their Lexical Scope but that Scope will remain inaccessible from outside the `myClass` function.

Well I guess that's given us some closure (couldn't resist), a lot of my learning was done from the book series ["You Don't Know JS"](https://github.com/getify/You-Dont-Know-JS/tree/master/scope%20%26%20closures) and if you're keen to know more I would recommend having a read. There are also some more examples of closure used in the wild over at the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) site that are worth a look.