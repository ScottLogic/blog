---
title: 'TypeScript: Interfaces or Types. What’s the Difference?'
date: 2021-06-24 00:00:00 Z
categories:
- Tech
tags:
- TypeScript
author: pburgess
layout: default_post
summary: When first using TypeScript you get presented with a choice, do I represent that with an interface or a type alias? In this article I explain the differences and why and when you should choose one over the other.
---

When I first started using TypeScript I was presented with a conundrum. I could declare a type like this:

~~~typescript
interface Person {
  firstName: string;
  lastName: string;
}
~~~

or like this:

~~~typescript
type Person = {
  firstName: string;
  lastName: string;
}
~~~

Both were valid, and worked, so it was very confusing. Why have two ways to do the same thing. Then I read briefly into it, and the advice was use interface, not type. So I did, and I thought no more about it.

But that didn't really tell me what each did, why I should use the interface type, and where that rule may not apply. As I began to use TypeScript more, `type` began to creep back into my usage, where it was necessary, and over time I've gradually understood the purposes of the two keywords, and I'm going to attempt to explain the difference, both in what we can do, and how I logically think about it.

## The Basics

TypeScript allows us to use a number of different ways to specify types. Firstly we have the primitives: `string`, `number`, `boolean`

~~~typescript
const firstName: string = 'Tom';
~~~

(note, we wouldn't need to add a type here, it would be implicitly typed by being assigned to a string, however I'm writing it here to make the type clear)

then we can have an `Array`

~~~typescript
const allFirstNames: string[] = ['James', 'Tom'];
~~~

and thirdly, we can have an Object type

~~~typescript
const name: { firstName: string; lastName: string } = { 
  firstName: 'Tom',
  lastName: 'Jones'
};
~~~

There are more types, but this is enough to move on to explaining type aliases and interfaces.

## Type Aliases

Type aliases allow us to give a name to a type definition. For example:

~~~typescript
type FirstName = string;
const firstName: FirstName = 'Tom';
~~~

Here, `FirstName` is just a string, but we've given it a name, and encapsulated some meaning. So everywhere I expect a first name, I can now use the `FirstName` type. If for any reason we were to change the type of first names, to a number for example, I just need to update the alias. Then every reference to `FirstName` will now expect a number.

We can do more complex type aliases:

~~~typescript
type StringOrNumber = string | number;
~~~

This is a **union type** which means that the type is either of the types stated. `StringOrNumber` now refers to a type that is either a string or a number.

We can also go back to our original example, and use a type alias to refer to an object type:

~~~typescript
type Person = {
  firstName: string;
  lastName: string;
}
~~~

One thing to note, a type alias is exactly that, an alias. It doesn't create something new, it just gives a name to refer to a type definition. For example, the following is completely valid:

~~~typescript
type FirstName = string;
type LastName = string;

const firstName: FirstName = 'Tom';
const lastName: LastName = firstName; // OK
~~~

So aliases essentially give us two things: a way to provide a nice name to save us writing type over and over, and a way to capture intent.

## Interfaces

Interfaces are much simpler. They define the structure of object types. Of all the examples above, the only one that an interface can define is the object:

~~~typescript
interface Person {
  firstName: string;
  lastName: string;
}
~~~

Interfaces allow inheritance:

~~~typescript
interface Sportsman extends Person {
  preferredSport: string;
}
~~~

Interfaces also allow something known as declaration merging, where you can declare it twice or more, and TypeScript will combine all the declarations into a singular interface:

~~~typescript
interface Person {
  firstName: string;
}

interface Person {
  lastName: string;
}

const person: Person = {
  firstName: 'Tom',
  lastName: 'Jones'
}; // OK
~~~

Trying to do the above with a type would result in an error that you have a duplicate identifier.

This feature of interfaces is useful because it allows us to extend interfaces already declared, that may be outside of what we can edit. For example, it allows us to extend the global type `Window` by declaring a new interface `Window` inside our codebase, and it will merge the type with any other type both globally, and in any libraries we use.

## Extending Types
There is one big difference with extension. An interface will not allow you to change a property's type to an incompatible type by extension:

~~~typescript
interface Person {
  firstName: string;
  lastName: string;
}

interface ExtendedPerson extends Person {
  lastName: number; // ERROR: types are incompatible
  age: number;
}
~~~

but using a type alias

~~~typescript
type ExtendedPerson = Person & {
  lastName: number; // No problem, takes the last defined
  age: number;
}
~~~

The consequence of this is an extended interface can **always** be provided to a method that expects the base type. An intersection that overwrites types does not have this guarantee, as our new type may not be compatible with the original type.

## Type Aliases or Interfaces

An interface is designed to do one thing well. Describe the shape of an object. The majority of our use of types in TypeScript is to describe the shape of the object. Therefore an interface is focussed on just this purpose.

A type alias does a lot more. It allows us to provide a name for any type, not just objects. It is best to think about type aliases as a way of defining shorthand for a longer type.

So with all of this in mind, you can summarise three tools in TypeScript:

1. Primitive types are built in (string, boolean, number, etc.) to represent simple values.
2. Interfaces are provided so you can describe objects with a single named type. They protect extension, ensuring child types are always compatible with their parents.
3. Type aliases are provided so you can give a simple name to a type. They behave exactly the same as if you had used the type they refer to directly. They do not provide any special function unlike interfaces.

Therefore, when describing object shape, **prefer interfaces**. Hopefully this article gives you the context why which I lacked when I first saw that advice. Type aliases only allow you to provide a single name to reference a type. There are plenty of uses for this which I will explore in future articles. An interface offers you more protection, and inheritance, without losing any functionality, as it can be treated both as an interface, and a type.