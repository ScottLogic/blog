---
title: 'Typescript 0.9: Any improvement'
date: 2013-09-10 00:00:00 Z
categories:
- Tech
tags:
- blog
author: nwolverson
image: nwolverson/assets/featured/typescript.jpg
layout: default_post
summary: Version 0.9 of Typescript was recently released with support for generic types. In this post I discuss the features of 0.9 and 0.9.1, particularly generics and the "no implicit any" option.
oldlink: http://www.scottlogic.com/blog/2013/09/10/typescript-0.9.html
disqus-id: "/2013/09/10/typescript-0.9.html"
---

I've been "noodling around" with [Typescript](http://www.typescriptlang.org/) for a while, and enjoying the various improvements over standard Javascript. 
Quite a bit of this comes from ES6 improvements which Typescript incorporates (and transforms to sensible ES3 output) - for example
real classes, and `this`-capturing lambda expressions that help avoid the #1 kick-yourself error of Javascript stupidity.

Syntactic sugar aside, there are a few reasons I like Typescript. An improved IDE experience in VS (and VS2012 is already quite good
with intellisense via jsdoc comments and JS execution). Static typing improves the self-documenting nature
of code, helps enforce a cleaner design, and ensure program correctness. Type definition files are available (the 
[DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped) project maintains a good selection)
for popular JS libraries to allow their use with full type information in a Typescript program (and this interoperability
is huge).

In this post I'm going to discuss some improvements in the recent TypeScript [0.9](http://blogs.msdn.com/b/typescript/archive/2013/06/18/announcing-typescript-0-9.aspx)
and [0.9.1](http://blogs.msdn.com/b/typescript/archive/2013/08/06/announcing-0-9-1.aspx) which get us closer to this goal.

## noImplicitAny

Javascript has some weird and wonderful features which make layering static typing over it somewhat hard. On top of the bizarre
oddities that no sane programmer would expect, the dynamic nature of the language make some things hard to statically type.

There are 2 ways to approach features which cannot be typed in an existing version of the type system, one is to refrain from using them in
order to improve your program's maintainability, ease of understanding, correctness etc (the lint-style approach
of using "the good parts"), the other is to enhance the type system to be more expressive.

Typescript's `any` type covers all the cases where the type of an expression can be basically anything at runtime. This allows for the awkward
cases where the type system is not powerful enough to express what the programmer knows - an escape clause. It also functions as the type 
where standard Javascript code is present without type annotations (which are optional):

{% highlight javascript %}

function f(n, m) {
    return n + m; // has type 'any'
}
function g(n: number, m: number) {
    return n + m; // has type 'number'
}

{% endhighlight %}

When developing Typescript code with the intention of using full type annotations and achieving type safety, this implicit 'any' typing
can be more of a nuisance than a help. In fact, since Typescript has type inference this becomes rather hard to spot - you don't *need* type
annotations everywhere, just wherever the type system is not able to infer the correct type. But you might assume that a type is inferred
where in fact it is just implicitly 'any', and then you have the misapprehension of type safety without any of the guarantees.

Typescript 0.9.1 introduces the `--noImplicitAny` flag to disallow such programs. Then the above program will not compile:

<pre>
any.ts(23,12): error TS7006: Parameter 'n' of 'f' implicitly has an 'any' type.
any.ts(23,15): error TS7006: Parameter 'm' of 'f' implicitly has an 'any' type.
</pre>

## Generics

Functional languages have had the notion of "polymorphism" for a long time - this is when data structures and functions can operate over
any type. Often this is used with lists, for example this F# function works to repeat an element of any type into a list of repetitions 
of that item:

{% highlight fsharp %}

> let rec repeat n x = [ for m in 1..n -> x]
  let a = repeat 3 "a"
  let b = repeat 5 5

val repeat : n:int -> x:'a -> 'a list
val a : string list = ["a"; "a"; "a"]
val b : int list = [5; 5; 5; 5; 5]

{% endhighlight %}

Here `'a` is a type variable, standing for any type (and `'a list` is a list of things of that type). This is in the F# core
as `List.replicate`.

In contrast to this "parametric polymorphism", object oriented languages
have long provided a different feature of "subtype polymorphism". This is classically useful to treat your button and
textbox alike as widgets to compose your UI (and many other things). One obvious thing that this does not help with
is the case of homogeneous collections, and so the mainstream OO languages (C++, Java, C#) now (eventually!) all have a form of "generics"
which allow us to express strongly typed operations over arbitrary types ("generics" and "\[parametric\] polymorphism" are terminology
for the same thing from different worlds). For example, the above in C#:

{% highlight csharp %}

static IEnumerable<T> Repeat<T>(T x, int n) {
	for (i = 0; i < n; i++) {
		yield return x;
	}
}

{% endhighlight %}

(this is a naive version of LINQ's Enumerable.Repeat).

Now to Typescript. As Javascript does not have static typing, one can easily write functions which are "morally generic".
Here's a definition of a similar repeat function in Typescript:

{% highlight javascript %}

function repeat(n: number, x: any) {
	var l : any[] = [];
	for (var i = 0; i < n; i++)
	{
		l.push(x);
	}
	return l;
}

{% endhighlight %}

Note that without knowing the type of `x`, we've assigned it the `any` type, and as a result the function returns `any[]`
(if we omit type annotations on `x` and `l` they would be implicitly `any` to the same result).
Typescript 0.9 introduces generics syntax which should be familiar as above, and we have:

{% highlight javascript %}

function repeat<T>(n: number, x: T) {
	var l : T[] = [];
	for (var i = 0; i < n; i++)
	{
		l.push(x);
	}
	return l;
}

{% endhighlight %}

And this function returns `T[]`.

This might all seem a bit academic, but I think it's huge. As an example take the library 
[Underscore.js](http://underscorejs.org). This provides
a bunch of utility functions for working on lists and collections (familiar to the functional programmer/LINQ user,
and some of which are in some JS implementations but not present on all browsers).
Prior to 0.9, many types would incorporate `any`, e.g. `rest` which returns the rest of a list after skipping the first
(or first n) element(s):

{% highlight javascript %}

export function rest(array: any[], n?: number): any[];

var z = _.rest([1,2,3,4,5], 2); // z : any[]
z[0].foo(); // typechecks - z[0] is any
	
{% endhighlight %}
		
Now this can return the same type of array: 
{% highlight javascript %}

export function rest<T>(array: List<T>, n?: number): T[];

var z = _.rest([1,2,3,4,5], 2); // z : number[]
z[0].foo(); // doesn't typecheck - z[0] is number
	
{% endhighlight %}

### Knockout

Knockout has the notion of observable properties - to create such a property we wrap it in a call to 
`ko.observable`, e.g. 

{% highlight javascript %}

var viewModel = { 
	z = ko.observable(5);
};

{% endhighlight %}

The pre-generic typing of knockout had some fixed overloads for built in types `number`, `string`, but if you use
a user-defined type, you were cast back into `any`-land. Now with generics we can have an `Observable<T>` type.

{% highlight javascript %}

class Foo {
	constructor(public x: number) {}
}
var viewModel = { 
	z: ko.observable(new Foo(42))
};

{% endhighlight %}

Note, I did not specify the type of the observable. If I run `tsc -d` on the above input I get the resulting types inferred:

{% highlight javascript %}

declare class Foo {
    public x: number;
    constructor(x: number);
}
declare var viewModel: {
    z: KnockoutObservable<Foo>;
};

{% endhighlight %}

The difference between these two typings is that the following mistake will be rejected by the generic typing:

{% highlight javascript %}

viewModel.z().y = 42;

{% endhighlight %}

## Conclusion

The addition of generics to [Typescript](http://www.typescriptlang.org/) probably marks the point where if you're thinking of trying it, it's worth 
doing so, particularly if your favourite JS libraries have typing definitions available 
(again, check [DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped)). There are a number of other improvements
in these recent releases ([0.9](http://blogs.msdn.com/b/typescript/archive/2013/06/18/announcing-typescript-0-9.aspx) /
 [0.9.1](http://blogs.msdn.com/b/typescript/archive/2013/08/06/announcing-0-9-1.aspx)) - overloading on constants is also
 quite funky. It's also worth trying `--noImplicitAny`, though you might well decide it's not for you.























