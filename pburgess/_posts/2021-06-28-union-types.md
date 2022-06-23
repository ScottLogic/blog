---
published: true
author: pburgess
layout: default_post
category: Tech
title: 'Getting the most out of TypeScript - Union Types'
tags: 'TypeScript'
summary: 'When using TypeScript for many developers it is natural to compare to Object Oriented languages. However TypeScript is different. This article looks at one tool that does not exist in Object Oriented languages: Union Types, and how you can use it to improve your TypeScript.'
---
TypeScript has rapidly grown in popularity in the last few years, and with good reason. It takes a rather flexible language in JavaScript, and fixes one of the big weaknesses of the language, being descriptive typing, with very little compromise having to be made.

However with that increase in popularity comes a big challenge, how to use the language to its full potential. That's a big challenge. I'm learning some new feature, or way to use TypeScript, almost every week.

A large percentage of TypeScript users come from an Object Oriented background, and therefore naturally draw parallels between TypeScript and the OOP languages they used, particularly languages like Java and C#. However, this mindset can lead to us overlooking very useful features of TypeScript. With this article, I hope to demonstrate how TypeScript differs from those languages, and how we have to change our thinking to extract more from the language.

## It's not about Classes.
First thing's first, TypeScript is not OOP. TypeScript provides the ability to add Types, which in their own words:

> provide a way to describe the shape of an object [...] allowing TypeScript to validate that your code is working correctly

Classes exist in JavaScript already. Therefore you can utilise classes in TypeScript too. But Classes are not Types. Classes can, and usually do, define behaviour. Types do not. Types are simply a contract.

## A seemingly simple problem
I've encountered a few problems over the past few weeks that have demonstrated good uses of Union Types. I will start with a seemingly simple problem:

In my system I am writing, I have two types of Authentication, one for systems, and one for users. I have two different ways of dealing with this, and two different places to look up accounts. It is therefore important I establish which of account it is. My authentication middleware does this work for me, and adds the information to the request for use later on in the pipeline.

We could write a simple type to encapsulate the information:

~~~typescript
interface AuthenticationDetails {
  accountType: string;
  accountId: string;
}
~~~

Very simple, and may do the job. However, there is one obvious weakness here. My `accountType` is just a string. That's not very descriptive. In the OOP world, I'd probably use an Enum, and we can do that in TypeScript too.

~~~typescript
enum AccountType {
  user,
  system
}

interface AuthenticationDetails {
  accountType: AccountType;
  accountId: string;
}
~~~

Already looking better! However, lets move on to union types, because in my opinion, this is a better way of doing the above:

~~~typescript
type AccountType = 'user' | 'system';

interface AuthenticationDetails {
  accountType: AccountType;
  accountId: string;
}
~~~

Why is that better? On the surface it looks to be a similar thing, and the uses of strings probably scare you slightly. But what we have used here is a type, that specifies it is either 'user' or 'system'. The power of this comes to when we actually type something. When using the enum, we have to do the following:

~~~typescript
import AccountType from './myAccountTypes';

const authenticationDetails: AuthenticationDetails = {
  accountType: AccountType.user;
  accountId: 'my-id';
}
~~~

Not too bad you may think. But lets compare it to the union type:

~~~typescript
const authenticationDetails: AuthenticationDetails = {
  accountType: 'user';
  accountId: 'my-id';
}
~~~

No import, and no wordy enum usage. just plain and simple one word, `'user'`. You may be looking at this and thinking it's a magic string, and magic strings are bad. But this is not a magic string. It is a defined union type. I can only put either 'user' or 'system' there, and anything else is rejected by typescript. And those two words are descriptive and describe what I want to do.

Another benefit, the data stored is also descriptive. If I serialize the data to JSON, It looks like this for an enum:

~~~json
{
  "accountType": 0,
  "accountId": "my-id"
}
~~~

and for the string union:

~~~json
{
  "accountType": "user",
  "accountId": "my-id"
}
~~~

 I'm storing the word "user", not a number (which enums do by default, though it is possible to give them string values), and therefore I do not require my consuming application to understand which number maps to which option. Of course, sometimes you would want to save the characters, but I would tend to prefer the more descriptive version by default.

 Finally, it's also worth noting that enums with numeric values (the default behaviour), are **not type safe**:

~~~typescript
enum AccountType {
  user,
  system
}

const accountType: AccountType = 2; // OK
~~~

A numeric enum is treated like a number, and therefore it's possible to assign a value outside of the declared values. This is not true when a union type is used. This topic of union type vs enum is a little more in depth than I explore here, so for a far more complete reasoning, see [this answer on Stack Overflow](https://stackoverflow.com/a/60041791/999912).

So this is step 1 to simpler, more explicit code. However there is another issue. What if my user ids were strings (uuids), and my system ids were numbers (ints)? Well we could do this:

~~~typescript
interface AuthenticationDetails {
  accountType: AccountType;
  accountId: string | number;
}
~~~

There it is again! I'm explicitly setting a property to a union type here. `accountId` can be a string or a number. But, this causes us a problem:

~~~typescript
function getSystemAccount(id: number) {
  ...
}

function getUserAccount(id: string) {
  ...
}

if (authenticationDetails.accountType === 'system') {
  const systemAccount = getSystemAccount(system.accountId); // ERROR! 
}
~~~

TypeScript correctly prevents us from doing the above code. The function `getSystemAccount` wants a parameter that is a number. However I'm passing it something that could be a string, so TypeScript stops us, and refuses to compile. What's the solution here? We know it's a number, because we know it's a system account. Many times I see the following:

~~~typescript
if (authenticationDetails.accountType === 'system') {
  // We know system account so account id must be number
  const systemAccount = getSystemAccount(system.accountId as number);
}
~~~

This will work. We are giving TypeScript the information it needs with a type assertion at this point to say I know it's a number here, so just go with it.

There is a better way, and guess what? It uses Union Types again. I'll go back to my `AuthenticationDetails` type to show you how we can help TypeScript better understand our real type.

~~~typescript
interface SystemAuthenticationDetails {
  accountType: 'system';
  systemId: number;
}

interface UserAuthenticationDetails {
  accountType: 'user';
  userId: string;
}

type AuthenticationDetails = SystemAuthenticationDetails | UserAuthenticationDetails;
~~~

Now our type definition is clear. We actually have two types, not one. Either we have `SystemAuthenticationDetails` or `UserAuthenticationDetails` and Typescript can now infer everything we need. Lets revisit our example:

~~~typescript
// authenticationDetails is either SystemAuthenticationDetails or UserAuthenticationDetails  
if (authenticationDetails.accountType === 'system') {
  // authenticationDetails must be SystemAuthenticationDetails as that is the only type to have accountType === 'system'
  const systemAccount = getSystemAccount(system.systemId); // property is known to exist and is number - all OK.
} else {
  // authenticationDetails must be UserAuthenticationDetails
  const userAccount = getuserAccount(system.userId); // OK
}
~~~

With one simple union type, I no longer need to help TypeScript out when writing this code. It understands exactly what the type is in each location by understanding how the conditional code I have written affects the type inside each block.

But there is one more important reason why this works, it is because I have correctly reflected the type of the object. In reality I am representing one of two different types of account. It makes logical sense therefore that I need a union type to represent one of two different entity types.

## Where is the inheritance?
The closing point I would like to make is regarding Union Types vs Inheritance. I could have done the following:

~~~typescript
interface AuthenticationDetails {
  accountType: AccountType;
}

interface SystemAuthenticationDetails extends AuthenticationDetails {
  systemId: number;
}

interface UserAuthenticationDetails extends AuthenticationDetails {
  userId: string;
}
~~~

The above however would still require me to cast when I consume this type, as I lose the relationship between the `accountType` and the different types that leads to. An alternative would be:

~~~typescript
interface BaseAuthenticationDetails {
  accountType: AccountType;
}

interface SystemAuthenticationDetails extends BaseAuthenticationDetails {
  accountType: 'system';
  systemId: number;
}

interface UserAuthenticationDetails extends BaseAuthenticationDetails {
  accountType: 'user';
  userId: string;
}

type AuthenticationDetails = SystemAuthenticationDetails | UserAuthenticationDetails;
~~~

This is perfectly fine. `BaseAuthenticationDetails` captures a shared property, but it is highly unlikely we will use the type, as the type `AuthenticationDetails` captures what we actually need to consume. Therefore `BaseAuthenticationDetails` is a personal choice whether it makes it clearer how the two types of accounts are constructed or not.

This demonstrates the difference between Object Oriented thinking, where most languages require a form of inheritance to allow a variable to be assigned to two different types of entities. However that is not the case in TypeScript. We have a true union type. A variable could be set to any of a huge range of things, with no requirement that they are related in any way, just as it could in JavaScript. Whereas this is possible in OOP languages, we usually have to lose some descriptiveness, by assigning to a type of `object` for example.

TypeScript allows us to capture, and type just the allowed types, allowing us to document exactly what that allowed range of entities are. This both leads to more descriptive code, and allows the TypeScript compiler and design time tools to make smarter inferences, provide us with more information, and prevent us from writing and compiling incorrect code.