---
published: true
author: pburgess
layout: default_post
category: Tech
title: 'Using TypeScript to Express Intent'
tags: 'TypeScript, featured'
summary: 'When coming to TypeScript from OOP languages it can be very easy to fall into the trap of using types the same way you are used to. But this is missing a lot of power of TypeScript. This article looks at how you can extend your TypeScript use to not only represent types, but also express the intent and document your code better.'
---

TypeScript is an excellent language to improve the experience of writing JavaScript. It gives us a lot of protection from mistakes in our code at compile time, and if the IDE supports it, when writing the code as well. However TypeScript is more than this.

According to TypeScript's documentation, the purpose of TypeScript is to:
*provide a way to describe the shape of an object, providing better documentation, and allowing TypeScript to validate that your code is working correctly.*

I'd like to start this article by looking at that second point: *"providing better documentation"*

## Better Documentation

I'm a subscriber to the belief that your code should be mostly self documenting. We shouldn't be needing comments to describe how our code works in most situations, our code should be self explanatory. Types improves our ability to do this.

Lets take the following JavaScript

~~~typescript
function getUserById(id) { ... }
~~~

Pretty obvious what this does: it gives me back a user when I pass it the user's id. However this leaves a lot unknown. What is a valid user id? What happens if I don't find a user? Lets add some types to improve this.

~~~typescript
function getUserById(id: string): User | null { ... }
~~~

Much better. I've not only described what the id is, but I've shown we either get a User or null back.

However I think we are still lacking something here. We are missing the intent of what we are doing. Yes a user id is a string, but it's more than that. It should be the type of the id of the User entity. Let me do another update here.

~~~typescript
type UserId = string;

interface User {
  id: UserId;
  ...
}

function getUserById(id: UserId): User | null {
  ...
}
~~~

We've now captured the intent of what we are doing. I don't want to take any string in. I want one that represents a user's id. As `UserId` is just a type alias to a string, structurally the code behaves the same way, but semantically I've expressed a lot more.

There is another benefit of this approach. We've taken the decision as a team to change the id to be a number. If I used the first example, where id was typed as a string, I would have to find every reference to the `userId` myself (potentially a tough job) and manually update them. In the second scenario, where I've used a type alias, I just need to update the type alias `type UserId = number` and my entire code base will update. Why? Because we've captured the intent and therefore we've capture all references to the user id.

There's a way of referencing the type of a property on a type that we can use to improve our capturing of intent:

~~~typescript
interface User {
  id: string;
  ...
}

function getUserById(id: User['id']): User | null {
  ...
}
~~~

This syntax is exactly what I want. It says the type is the type of the property `id` on the type `User`. It perfectly captures my intent. It also has the same benefits as the example above, where if I changed the type of the user id, my code will just update to reflect the change.

## Narrower types

Lets take a simple example of rolling a normal six sided dice. A simple function would look like this:

~~~typescript
function rollD6(): number { ... }
~~~

Now imagine I do the following:

~~~typescript
const diceRoll = rollD6();

if (diceRoll === 7) {
  // TypeScript doesn't know we can't hit this code
}
~~~

Number is not really the return type of our function, because 7 is a valid number, but will never be returned as a result of rolling a 6 sided die. We can instead do the following.

~~~typescript
type D6Result = 1 | 2 | 3 | 4 | 5 | 6;

function rollD6(): D6Result { ... }

const diceRoll = rollD6();

if (diceRoll === 7) {
  // Warning: Will always be false since the type 7 and D6Result do not overlap.
}
~~~

Much better! TypeScript has now helped us out and prevented us writing useless code. This is because we gave it the narrowest types and expressed the actual intent of the code.

## Template Literal Types

If you have seen tabletop RPGs you will have seen dice notation. These are functions that describe what you need to roll, including which type of dice and what to add or subtract to get the number you need to use. For example `2d6 + 4` means to roll two 6 sided dice and add 4 to the result. I could represent this in code with a type alias:

~~~typescript
type DiceNotation = string;
~~~

This is not very good. It tells us nothing about the structure of the string. Whilst I capture some of the intent with the name of the type alias, I do nothing here to actual represent what is a valid string.

This is where template literal types come in. TypeScript introduced template literal types in version 4.1. And they allow us to specify the types to expect in various points of a string. For example, we can update DiceNotation:

~~~typescript
type Die = 'd3' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

type DiceNotation = `${number}${Die}${'+' | '-'}${number}`;
~~~

TypeScript can now validate the structure of the string matches what we would expect. If I try to use an invalid DiceNotation, TypeScript will prevent me from doing so. This allows us to be confident not only of the type being a string, but also the structure of the string. This is very useful and brings a lot of safety to writing code, in particular when passing around strings.

It is worth noting the above actually forces us to have the exact structure specified, so if we wanted to roll a single d6, we'd have to write `1d6+0`. This isn't great, so we could improve this by using a union type to represent all different valid string structures like so:

~~~typescript
type DiceNotation = `${Die}` | `${Die}${'+' | '-'}${number}` | `${number}${Die}` | `${number}${Die}${'+' | '-'}${number}`;
~~~

Now we could write `d6` or `2d6` or `d6-1` and they would all be valid. Just note this is a simplified dice notation, and the full spec of dice notation includes more structures that aren't handle here, but this covers the main uses of dice notation.

I'll finish this article with an optimisation of the above. Again the above only captures some of the intent. We actually have two parts of the templated string, which die and how many of that die, and a modifier to add or subtract. Therefore we can better express what the string looks like with the following:

~~~typescript
type DiceAndNumber = `${Die}` | `${number}${Die}`;
type Modifier = `${'+' | '-'}${number}`

type DiceNotation = DiceAndNumber | `${DiceAndNumber}${Modifier}`;
~~~

Whilst the above is identical to the previous definition in terms of functionality, it's more explicit from a documentation point of view, and easier to process mentally. That is because we have captured the intent of each part of the string with our `DiceAndNumber` and `Modifier` types.

If we come back to the original point, that code should be self documenting, it's a lot more obvious here what we are doing than if we had just left the type as a string. So when writing TypeScript, stop and think when you are writing your types and answer the question: do your types express the intent of what you are writing?