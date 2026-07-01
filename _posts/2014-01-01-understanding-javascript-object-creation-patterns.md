---
title: Understanding JavaScript Object Creation Patterns
date: 2014-01-01 00:00:00 Z
categories:
- Tech
tags:
- javascript
author: ceberhardt
layout: default_post
source: codeproject
summary: Explores the full range of object creation patterns in JavaScript — from object literals and constructor functions through to prototypal inheritance and the module pattern — to reveal how the language truly works beneath its familiar-looking syntax. Aimed at C# and Java developers who want to move beyond cargo-cult patterns and genuinely understand JavaScript's prototype-based object model.
---

*This article was originally published on CodeProject, which has since shut down.*

## Overview

This article explores the various ways you can create objects
with the JavaScript language, and through this exploration finds that there is
much to learn about the language!

## Introduction

With the continuing popularity of web-based applications and
the death of plugins (Flash, Silverlight, Java Applets, …) more and more developers
are finding themselves writing complex applications using the JavaScript
programming language.

Whilst on the surface JavaScript has a familiar feel to
anyone who has programmed in C# or Java, it doesn't take long before you
discover that it has quite a few fundamental differences. Unfortunately for
JavaScript, the familiar feeling on first contact, which is shortly followed by
confusion, has lead to the language becoming rather unpopular. As a result
there are quite a lot of reluctant JavaScript developers out there!

Probably the first language feature that confuses C# and
Java developers is JavaScript prototypical inheritance. This is nothing like
classical inheritance, this is despite the JavaScript language's use of the new
keyword which was a somewhat failed attempt to make the language feel familiar
to Java developers.

Rather than tackle this problem directly, many developers
rely on frameworks such as [prototype.js](http://prototypejs.org/learn/class-inheritance) which provide classical
inheritance patterns so that they can return to something familiar. As did I.
However, I soon become dissatisfied with my lack of knowledge and wanted to
know how the language really works.

I originally set out to write an article on JavaScript
inheritance patterns, but I soon realised that there was so much to learn about
the most basic task of creating objects.

I know what you are thinking; creating objects in JavaScript
is a trivial task. Here you go:

```jscript
var myObject = {};
```

How can you write an entire article on the subject?

Hopefully the more curious among you will read on and find
out …

## Plain old objects

JavaScript is quite a simple language, with only a few
built-in types. In this section we'll take a detailed look at the object type,
how it is created and the properties that it inherits. In JavaScript an object
is simply a collection of named properties. A property consists of a (unique)
name and a value that can be of any type.

Objects are dynamic in that you can add and remove
properties after they have been created. The code below creates an 'empty'
object then adds a couple of properties:

```jscript
var shape = {};
shape.color = 'red';
shape.borderThickness = '2.0';
```

You could achieve the same result using the slightly more
convenient object initializer:

```jscript
var shape = {
    color : 'red',
    borderThickness : '2.0'
}
```

Both forms result in exactly the same object.

There is a third form, where you use the `Object` constructor
function:

```jscript
var shape = new Object();
```

Which is again equivalent to the other two forms shown
above, but we'll ignore that one for now!

So what does this object that we have created look like? And
what properties does it have? Probably the easiest way to find out is to use
the Chrome Developer Tools (Or IE / Safari / Firefox equivalent) to inspect it.
Typically you can inspect objects by adding a variable watch or by simply
typing their name into the console.

Here's that shape object:

![Screen Shot 2013 11 18 at 17.15.09]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-18_at_17.15.09.png)

As you can see it has the two properties, `color` and
`borderThickness`, that were explicitly added. But what is this mysterious `__proto__`
property?

As you can probably guess, the liberal use of underscores
indicates that it is a 'hidden' variable. However, JavaScript only has public
properties, so there is nothing stopping you using this property in your own
code (at your own peril!).

The `__proto__` property points to this object's prototype. If
you open it up you will see that `__proto__` points to an object 'Object' which
has a number of functions:

![Screen Shot 2013 11 18 at 17.22.00]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-18_at_17.22.00.png)

This reveals the true nature of inheritance in JavaScript
which revolves around a chain of prototypes. If you try to access a property of
an object (whether that property is a value or a function), and it is not
present on the object itself, the JavaScript runtime then checks the object's
prototype. If the property is found on the prototype, it is returned … if not,
the next prototype is inspected, all the way up the prototype chain.

You can try this out for yourself. In the
console try accessing the `toString` property (you can do this either via dot
notation or the indexer), and as this property is a function, you can of course
invoke it:

![Screen Shot 2013 11 18 at 17.26.37]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-18_at_17.26.37.png)

Although the result isn't terribly interesting!

As you have seen, JavaScript objects are pretty simple
things, a 'bag' of properties combined with a 'hidden' prototype that allows
property inheritance.

The dynamic nature of the language makes object creation
pretty easy, however, most non-trivial applications make use of types (which
are defined in C# and Java as classes). A type describes the properties and
methods of an object and allows you to create multiple instances of the type.

In the next section, we'll look at how this can be achieved
with JavaScript.

One last point on terminology - JavaScript has functions,
however a function that is an object property is called a method.

## Constructor Functions

In the previous section we took a brief look at the
prototype chain, and how an object inherits properties and methods. Once an
object is created, you cannot change its prototype. So how do you add
properties and methods to it?

Before diving into constructor functions, which solve this
little problem, we should make the example a little more realistic by adding a function
to this object:

```jscript
var shape = {
    color : 'red',
    borderThickness : '2.0',
    describe : function() {
       console.log("I am a " + this.color + " shape, with a border that is " +
           this.borderThickness + " thick");
    }
}
```

This adds a function to the shape object (i.e., a
method). If you inspect it via the console, you can see that `describe` is a
property just like the others. You can also invoke this method via the console:

![Screen Shot 2013 11 18 at 17.36.40]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-18_at_17.36.40.png)

If you were writing a drawing application you might want to
create multiple instances of this object. This is where the JavaScript concept
of constructor functions comes in handy.

We'll start by creating a constructor function that creates
an object with the color and `borderThickness` properties:

```jscript
function Shape(color, borderThickness) {
    this.color = color;
    this.borderThickness = borderThickness;
}
```

You use a constructor function to create an object by
invoking it with the `new` keyword:

```jscript
var shape = new Shape('red', 2.0);
```

Again you can use your JavaScript debugging tools to inspect
the nature of the object that this constructor function creates:

![Screen Shot 2013 11 20 at 05.18.45]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_05.18.45.png)

If you compare this to the 'shape' that was created via an
initializer, or the shape where the two properties were added after
construction, you will find that it looks almost identical. However, there is
one subtle difference, the object created by an initializer had a 'hidden'
`__proto__` property which Chrome has identified as an `Object`, whereas this one has a `__proto__` which Chrome has identified is
a `Shape`. (NOTE: the way that Chrome makes this identification shall become clear later on!)

Before discussing the implications of this subtle
difference, we'll add the describe method to the shape.

You could add the method directly to the newly created
object within the constructor function, however, this creation pattern provides
a much more powerful alternative. You can add methods to the prototype property
of the constructor function as follows:

```jscript
function Shape(color, borderThickness) {
    this.color = color;
    this.borderThickness = borderThickness;
}

Shape.prototype.describe = function() {
    console.log("I am a " + this.color + " shape, with a border that is " +
        this.borderThickness + " thick");
};
```

If you create a shape instance then inspect it, you will
find the following:

![Screen Shot 2013 11 20 at 05.42.34]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_05.42.34.png)

Your shape instance now has a describe function, but it is not a property of the shape object itself, it is instead a property of the prototype. And in the same way that we saw how functions defined on the `Object` prototype are inherited via the prototype chain, the describe function will be inherited by all `Shape` instances:

![Screen Shot 2013 11 20 at 05.45.04]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_05.45.04.png)

You can also expand the `__proto__` object of `Shape` to reveal that `Object` sits at the base of the prototype chain:

![Screen Shot 2013 11 20 at 06.04.06]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_06.04.06.png)

And as a result, all the functions revealed above are available as methods on each and every object created via the `Shape` constructor.

We'll go into much more detail about the constructor functions prototype property shortly, but before that, we need to look the `new` keyword in a bit more detail …

## The inner workings of 'new'

You might recall from earlier in this article that I mentioned that you cannot change the prototype of an object. An object's prototype is set when it is created via a constructor function, and once constructed its prototype chain is immutable.

As an aside, just because an object's prototype chain is immutable, it doesn't mean you cannot add new functions to existing objects within this chain. The example below adds a new function to the `Shape` prototype, demonstrating how this function is immediately accessible by all shape instances:

![Screen Shot 2013 11 20 at 06.08.38]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_06.08.38.png)

This really underlines the simple nature of JavaScript, where you can modify the properties of any object, regardless of whether it is being used as an object instance, or to represent the notion of a 'type'.

So what exactly does the `new` keyword do? When a function is invoked using new, the following occurs:

1. A new instance of an object is created and its prototype (exposed via the `__proto__` property) is set to the prototype property of the constructor function.
2. The constructor function is invoked with the newly created object bound to the `this` property.
3. If the function does not return a value, `this` is returned implicitly.

The interesting thing to note here is that the `new` keyword is 'special', not the function itself.

To confirm this, try invoking the constructor function without the `new` keyword:

![Screen Shot 2013 11 20 at 06.19.29]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_06.19.29.png)

So what's happened here? Because the `Shape` constructor function lacks an explicit return the function doesn't return anything and the `notAShape` variable is undefined.

Well, that's easily fixed:

```jscript
function Shape(color, borderThickness) {
    this.color = color;
    this.borderThickness = borderThickness;
    return this;
}
```

When invoked as a constructor via the new keyword this will work just as before. But what about if we omit the
`new` keyword again?

![Screen Shot 2013 11 20 at 06.21.50]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_06.21.50.png)

The second line looks promising, the object that was returned has the `borderThickness`property, and color, but the third line shows that something really bad has happened. Our shape is not a
`Shape`, it is in fact a reference to the global `Window` object. This is because a constructor function when invoked without the new keyword will obey the standard rules regarding the binding of
`this`, which in the case above results in this being the global object.

As you can see, constructor functions must be invoked via the `new` keyword or
***Bad Things*** will happen.

This fragility, where a developer can easily forget to use the `new`keyword, is of concern to JavaScript developers, which is why convention dictates that constructor functions should start with capital letters as a reminder of their purpose.

This is entirely bullet-proof as I am sure you will agree.

Sarcasm aside, there is a more robust way to ensure that constructor functions are correctly used, which we will see in the next section.

The take-home message from this section is that constructor functions are just regular functions. There is nothing special about them. It is the new keyword that does all the magic.

One final point I want to make is that while in this example the `color`and `borderThickness` properties were added to the newly constructed object and the describe function was added to the prototype, you are certainly not restricted to this pattern. You are perfectly free to add properties via the prototype and functions via the constructor. However, the properties of the prototype are shared across all object instances, so in our example any shapes created via the constructor will share a reference to exactly the same describe function (via the prototype chain). Therefore any properties added in this manner are also shared. This can be used to approximate the concept of static properties.

## Exploring the prototype chain and instanceof

One important feature of any type system is the ability to ask an object what type it is. You have already seen how the prototype chain is visible via the
`__proto__` property of an object. You can manually confirm the type of an object by comparing its prototype to the prototype property of a constructor function.

With the shape object you should find that the following are both true:

```jscript
shape.__proto__ == Shape.prototype
shape.__proto__.__proto__ == Object.prototype
```

And because the prototype reference of an object is immutable it is safe to assume that the above will always be true.
Rather than manually navigating the prototype chain, JavaScript provides an
`instanceof` keyword that performs this check for you. You should also find that the following statements are true for our shape:

```jscript
shape instanceof Shape;
shape instanceof Object;
```

The `instanceof` keyword navigates the prototype chain, returning true if anywhere in the chain is the object pointed to by the given constructor function's `prototype` property.

From the previous section recall that the first thing the new keyword does is construct an object with its internal prototype set to the prototype of the constructor function. As a result, an
`instanceof` check for this should return true. We can use this knowledge to protect against the use of the constructor function without the
`new` keyword as follows:

```jscript
 function Shape(color, borderThickness) {
    if (!(this instanceof Shape)) {
        return new Shape(color, borderThickness);
    }
    this.color = color;
    this.borderThickness = borderThickness;
}
```

The above code checks whether this is bound to a `Shape` instance, and if not invokes the constructor using the
`new` keyword, with an explicit return.

You can confirm that this constructor function can now be invoked without the `new` keyword:

![Screen Shot 2013 11 20 at 06.34.54]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_06.34.54.png)

Personally I am not a fan of this technique. The new keyword is so important that I don't like to hide its usage, but your mileage might vary.

## When is a prototype not a prototype?

You might have noticed in the previous sections that the talk of prototypes was starting to get confusing:

“A new instance of an object is created and its prototype (exposed via the
`__proto__` property) is set to the
`prototype` property of the constructor function.”

The problem here is that there are two different prototypes being discussed. One is the 'real' prototype, the one that determines the type of an object, the other is simply the prototype property of the constructor function. These are two very different things that unfortunately share the same name! Personally I think it would be a lot less confusing if the prototype property were called something like '`constructedObjectsPrototype`'. Verbose, but much more clear.

At this point it might help to map out all the objects and their relationships. Be warned, this is a little complex. This knowledge is not essential, so feel free to skip this section if you like.

Here's a complete object graph showing the built in objects (in red), the constructor function and its prototype (in blue) and a shape instance (in green):

![PrototypeGraph]({{ site.baseurl }}/ceberhardt/assets/codeproject/PrototypeGraph.png)

Starting with the constructor function at the top you can see that it is related to the
`Shape.prototype` object via its `prototype` property. Whenever you create a function instance, it will automatically have an associated prototype object, although it is only every used in the context of object construction.

You can see that the describe function that was added is a property of `Shape.prototype` and that the shape instance (in green on the left) references this via the
`__proto__` property, allowing it to inherit this property (as a method).

Hopefully this will help you understand the difference between an object's prototype reference, which is immutable, used for inheritance and 'exposed' via the
`__proto__` property; and the `prototype` property of a function, which is used when constructing objects.

I think you'll agree that the naming is a little confusing!

So what about the other objects in this diagram? JavaScript functions are also objects, which means that they also have a prototype. You can see from the above diagram that the prototype of our
`Shape` constructor function is `Function.prototype`, and that this in turn has
`Object.prototype` as its prototype. `Object.prototype` doesn't have a prototype, it is the end of the chain.

Notice that the prototype chain for a function is created automatically. You don't have to use the new keyword here.

The prototype chain associated with the `Shape` constructor function has a few practical implications. If you inspect this function, expanding both the
`__proto__` relationships, you can see the functions that it will inherit:

![Screen Shot 2013 11 20 at 08.35.37]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_08.35.37.png)

From `Function.prototype` it inherits useful functions such as bind, call and apply (more on these later), and from further down the prototype chain it inherits all the functions from
`Object` via `Object.prototype`.

Notice that there is a `toString` property on both `Function.prototype` and
`Object.prototype`. The JavaScript runtime always uses the most immediate property value, in this case it will return the
`Function.prototype.toString` property, which overrides the implementation provided by
`Object.prototype`.

You can try this out. If you invoke the `toString` method on a shape instance, you will see that it differs from the standard implementation. You can of course navigate up the prototype chain to invoke the
`Object` implementation if you really want to:

![Screen Shot 2013 11 20 at 08.40.29]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_08.40.29.png)

As a quick reminder `__proto__` is a hidden property. It is an implementation detail of this particular implementation of JavaScript language. You should not rely on the presence of this property in production code.

## The constructor property

You might have noticed that `Shape.prototype`,
`Function.prototype` and `Object.prototype` all have a
`constructor` property. If you explore further you will find that the value of the
`constructor` property is a reference back to the constructor function that this prototype relates to.

Adding this extra detail to the diagram gives the following:

![PrototypeGraphTwo]({{ site.baseurl }}/ceberhardt/assets/codeproject/PrototypeGraphTwo.png)

So what's the practical use of this property?

In our example, because `Shape.prototype` becomes the prototype for all shape instances, they all automatically inherit this constructor property, giving them a reference back to the constructor function.You can confirm this as follows:

```jscript
shape.constructor == Shape
```

You could use this property as a way of creating new objects. For example, the following creates a new string instance via the constructor property:

![Screen Shot 2013 11 20 at 09.09.45]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_09.09.45.png)

Although I am not convinced of the usefulness of this!

**Warning**… an object's prototype reference is immutable, however `constructor`is just a regular property, so is not immutable. You can modify this property setting it to any value you like - a different function for example:

![Screen Shot 2013 11 20 at 09.07.09]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_09.07.09.png)

You could also change the value of `String.prototype.constructor`, breaking the example above.

Very useful.

## The confusing world of 'this'

Now that we have well and truly dissected how objects are created, it is time to look at some of the practical implications of this style of object creation.

It is very common to want to invoke a method on an object in response to a DOM event. So let's give that a try …

```jscript
// create a shape
var shape = new Shape('red', 2.0);

// ask it to describe itself
shape.describe();

// wire this method up to a DOM event handler
$('#foo').click(shape.describe);
```

When the above code runs and the `shape.describe` method is invoked, the console output is as expected:

```
I am a red shape, with a border that is 2 thick
```

However, when you click the 'foo' DOM element, the result isn't what you might expect:

```
I am a undefined shape, with a border that is undefined thick
```

This sucks!

You might already know how to solve this problem, by use of the `bind`function, or by some other library or utility function. However, there is a very simple solution to this problem …

If you simply wrap the invocation in a function as follows:

```jscript
$('#foo').click(function() { shape.describe(); });
```

You will find that it now works:

```
I am a red shape, with a border that is 2 thick
```

Confused? I must admit, I was the first time I encountered this!

To make sense of what is going on here, it helps to know a little bit about the concept of 'execution contexts'.

All JavaScript code execution takes place within an execution context. Each context contains information regarding the variables that are currently in scope and the value that is bound to this. These contexts form a stack, as is common in most
programming languages.

Without wishing to go into too much detail, the important thing to note here is that a new execution context is created when a method is invoked, where
`this` is a reference to the object that owns the property. This is nothing like the way C# and Java handle the
`this` reference, or how Objective-C handles `self`. You can also manually set this if you invoke a function via call or apply, or adapt it via bind.

So why does this fail:

```jscript
$('#foo').click(shape.describe);
```

But this works?

```jscript
$('#foo').click(function() { shape.describe(); });
```

In the first example, `shape.describe` simply passes a reference to the
`describe` function. The click event invokes this function directly, rather than invoking it via
`shape`. As a result it is executed within the scope of the click execution context. This happens to set
`this` to reference the DOM element that was clicked, which is convenient much of the time.

The second example invokes the function within the context of the shape object. This is a method invocation and as a result a new execution context is created with this referencing shape.

Still confused?

The above is a very real practical example, however we can simplify it by 'detaching' the describe function then invoking it directly:

![Screen Shot 2013 11 20 at 09.32.41]({{ site.baseurl }}/ceberhardt/assets/codeproject/Screen_Shot_2013-11-20_at_09.32.41.png)

As you can see, this has the same effect. Executing the detached function does not create a new execution context hence the value of this is determined by the parent execution context.

It is worth pointing out that this is nothing to do with our use of a constructor function. You would observe exactly the same behaviour with a shape created via an initializer:

```jscript
var shape = {
    color : 'red',
    borderThickness : '2.0',
    describe : function() {
        console.log("I am a " + this.color + " shape, with a border that is " +
            this.borderThickness + " thick");
    }
}
```

A pretty standard solution to this problem is to use the `bind` function, which as you will have seen earlier is on
`Function.prototype`, so is inherited by all functions. The bind method returns a function that when called has this bound to a given value. In our case we want this to be our shape, so can bind as follows:

```jscript
$('#foo').click(shape.describe.bind(shape));
```

Personally I really dislike this.

## Private parts

(and no, not those private parts)
The final thing I want to discuss regarding JavaScript objects is private properties and functions. One of the key tenants of object oriented programming is the ability of objects to hide state and logic in order to exposure a simple interface. Most object oriented languages have access modifiers which allow you to make methods, properties or variables private (or protected). JavaScript does not have a first-class language feature that supports information hiding in the context of object creation.So how do we create private state with JavaScript? Continuing the 'shape' example, if you wish to access some private state from within the describe function, the only option available to you is to use a pseudo-private variable:

```jscript
function Shape(color, borderThickness) {
    this.color = color;
    this.borderThickness = borderThickness;
    this._describeCount = 1;
}

Shape.prototype.describe = function() {
    console.log("I am a " + this.color + " shape, with a border that is " +
        this.borderThickness + " thick. I have told you this " + this._describeCount++ + " times.");
};
```

Do you see the private `describeCount` variable in the code above? No? Of course not. The code cunningly relies on the fact that as a developer you have a blind spot for variables prefixed with an underscore.

Joking aside, this is the generally accepted approach for implementing private state and private functions.

No wonder there is a long history of Java and C# developers mocking JavaScript!

## Using closures for private state

So far I have focused on prototypical inheritance and constructor functions, which happens to be a great way to learn about some of the peculiarities of the JavaScript language. However, it isn't the only object creation pattern that JavaScript developers use.

The current `Shape` constructor function adds the color and
`borderThickness` properties to the newly constructed object. There is nothing stopping you adding the describe function directly to the object within the constructor as follows:

```jscript
function Shape(color, borderThickness) {
    this.color = color;
    this.borderThickness = borderThickness;

    this.describe = function() {
        console.log("I am a " + this.color + " shape, with a border that is " +
            this.borderThickness + " thick");
    }
}
```

So what difference does this make? Any newly constructed `Shape` instance will have a
`describe` method, however it will be a method directly on the object itself rather than one it inherits via the prototype.

A practical implication of this change is that each and every `Shape`instance will have its own `describe` method, which will increase the memory consumed by each instance.

So what advantage does this pattern give us?

One major advantage that this pattern provides is information hiding. The example shown above, where the describe function records the number of times it has been invoked, can be implemented as follows:

```jscript
function Shape(color, borderThickness) {
    var describeCount = 0;

    this.color = color;
    this.borderThickness = borderThickness;

    this.describe = function() {
        console.log("I am a " + this.color + " shape, with a border that is " +
            this.borderThickness + " thick - ", describeCount++);
    }
}
```

The `describeCount` variable is visible to the describe function after the constructor function has returned due to a concept called 'closures'. If you create a shape instance via the function above and inspect the result via your JavaScript developer tools, you will find no mention of
`describeCount`. It is well and truly hidden.

Closures can also be used to solve another nasty little problem with JavaScript objects –
`this` binding. Recall that previously I demonstrated how you have to take care when wiring a method invocation to a DOM event handler. With the creation pattern above you can 'store' the reference to the object being created within the same closure, as shown below:

```jscript
function Shape(color, borderThickness) {
    var describeCount = 0,
        self = this;

    this.color = color;
    this.borderThickness = borderThickness;

    this.describe = function() {
        console.log("I am a " + self.color + " shape, with a border that is " +
            self.borderThickness + " thick. I have told you this " + describeCount++ + " times.");
    }
}
```

The describe function, when invoked, will always have the correct reference to the owning object via the self variable - another advantage over the 'prototype' style of object creation. The only slightly less attractive feature of this pattern is that you need to remember to substitute self for this in any publicly exposed function.

## Summary

Object creation within JavaScript is not a simple topic! Hopefully in reading this article you will have learnt something about constructor functions, prototypes or the wider JavaScript language.

Both the forms of object creation I have written about, prototypes vs. closures, are perfectly viable solutions and I would not discourage you from using either. All I would ask is that you take the time to understand the different patterns, and the implications of each.

Finally, one of my colleagues recently introduced me to a slight variation on the closures pattern:

```jscript
function Shape(color, borderThickness) {
    var describeCount = 0,
        instance = {};

    instance.color = color;
    instance.borderThickness = borderThickness;

    instance.describe = function() {
        console.log("I am a " + instance.color + " shape, with a border that is " +
            instance.borderThickness + " thick. I have told you this " + describeCount++ + " times.");
    }

    return instance;
}
```

So what is going on in the above code? A new object 'instance' is created within the constructor function, and the properties / methods are added to this object which
is then returned. This pattern still benefits from the use of closures to provide private state, however you no longer have to substitute self for this (which is easy to forget),
making it easier to maintain.

However, it is not without its disadvantages. The 'instance' object was not created via the
`new` keyword and as a result, will not have prototype set to `Shape.prototype`, which means that
`instanceof` will no longer work. Although you could make use of the fact that constructor is mutable in order
to make your own manual relationship between the shape instances and the Shape constructor.

## Conclusions

I know that I have occasionally mocked JavaScript throughout this article. Perhaps a little unfairly at times!

Whilst it is unlike most of the other popular languages that most of us use at the moment, it isn't such a bad language when you start to get to know it.
And that's the most important thing … you have to learn JavaScript and not expect it to conform to your preconceptions that stem from C# or Java.

Enjoy.
