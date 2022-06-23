---
title: Jumping from Javascript to Java. How hard can it be?
date: 2019-04-05 00:00:00 Z
categories:
- phands
- Tech
tags:
- Java,
- Javascript,
- Development
author: phands
layout: default_post
summary: A lot of developers start specialising in Javascript, and have an inherent
  fear of Java (I know I did!) In this blog post I look at a few tips to get over
  that initial fear and start coding in Java, from a Javascript background.
image: phands/assets/javascript-to-java.png
---

## Why should I even bother, Javascript is the best language ever?
There is a real demand in the software industry for specialists who don’t specialise. That is, most software roles now are looking to fill the position with someone who has “Extensive knowledge of Javascript, specifically React, Redux, and experience in TDD [test driven development]. Some knowledge of Java is also useful.”, as a real life example.

That’s a fairly typical request, from either internal development teams advertising for new starters, or from clients to consultants when they want to onboard a new member of a team.

What it means in a nutshell is that as the universe of coding evolves, and as the lines blur between “Server work does the heavy lifting” and “front end shows the nice stuff” the demand for developers who have multiple facets of knowledge is growing. They want people who can do both. This means if you’re a developer who has a very deep knowledge of Javascript and have a multitude of tech stacks you can write in (Angular, React, etc.) but the idea of booting up a Tomcat server in Java terrifies you then you might quickly find yourself struggling to fit into and contribute a comparable amount of value to a team that requires “full stack” developers.

I speak from experience. About 3 months ago I was working exclusively in the front-end stack, and in that, more or less entirely in Javascript. Our application had an Angular front end and a Java server connected to a database, which was a fairly standard application setup. I had an extensive depth of knowledge for anything Angular, but if the task involved going into the server side to do any work at all I was immediately stumped and had to ask for help. This meant I ended up waiting around for a while or trying to switch focus and work on something else as I waited for the server changes to be done. It would slow me down and would also slow down the person who I asked to make the changes for me.

I resolved to fix this and decided to learn as much Java as I needed to start understanding the server codebase, and to contribute (slightly!) to the changes needed as the application we were building evolved. I’ve been looking at (and contributing to) the Java codebase now for just over six weeks on the current application I’m building. I’m by no means a Java wizard yet, but I’m making good progress and can now contribute effectively to the whole stack that our team is working on.

I’ve put together a list of a few bits and pieces of advice that helped me bridge the gap between knowing Javascript and beginning to learn Java. The list is by no means exhaustive, and I imagine some Java purists will choke as they read through, but I’m hoping that the lessons I learned might hopefully let someone else make the jump to being a “full stack” developer a little easier than I did!

## Start with “type”-ing in Javascript

While this may seem like a fairly innocuous concept the idea of explicitly defining a type is (in my opinion) one of the biggest differences between Java and Javascript.  So, what is a type?

If we look at an example, we will quickly grasp what a “type” is!

In Java if you define a string as:

~~~ java
String myString = "Java is great!";
// OK
~~~

Then everything works correctly, as the type of myString is correctly identified as a String type, which it was originally defined as.

However, were we to declare

~~~ java
Boolean myString = "Java is great!";
// Compiler error!
~~~

Then we will end up with a problem, and the compilation would fail. We have explicitly made myString to be a Boolean type but have then defined it to be a String type.

Types in themselves can be complex. A language with static types – like Java – is referred to as a statically-typed language and checks the types at compile time, such as our example above. On the other hand, a language with dynamic types is referred to as a dynamically-typed language, and – crucially – checks the types at runtime.

JavaScript is an example of a dynamically-typed language, and it takes a different approach. It allows the context to establish what type of data is being defined. This means that types are still a thing in Javascript, they are just handled under the hood. So, in Javascript it is perfectly OK to define:

~~~ javascript
const myString = 'Javascript is easier!';
// OK
~~~

which will, at runtime, determine that myString is a String type. One of the biggest bugbears of statically-typed language developers is that the following is perfectly valid (if terribly designed) code, which wouldn’t break at runtime or compile time.

~~~ javascript
let result = 'Javascript is sometimes a bit daft';
// result is type string
if(result === 'Javascript is sometimes a bit daft') {
    result = 10;
    // result is type int
} else {
    result = true;
    // result is type boolean
}
return result;
// 10 - all compiles OK (?!)
~~~

Clearly in a statically typed language such as Java this would throw a bunch of errors. Long story short: Dynamically-typed languages do not require you to declare data types. JavaScript implies the data type, while statically-typed languages like Java state it outright, requiring you to declare the data types of your constructs before you can use them.

If you’ve been developing in Javascript and haven’t been looking carefully at your types _but_ you’ve been coding correctly, then this shouldn’t be too big a wrench. Getting used to assigning types while staying inside Javascript languages is a great stepping stone to moving to statically typed languages (in our case, specifically Java). There are typically two ways to introduce typing explicitly into your Javascript code:

 -	Migrate to [Typescript](https://www.typescriptlang.org/): If you have the capacity then I would really recommend moving your Javascript to Typescript. Typescript compiles back down to Javascript and a lot of compilers now can handle both in tandem.
 
 -	Use [Flow](https://flow.org/): As a kind of middle ground between migrating to Typescript and just trying to use Javascript with a bit more care of the type inference, Flow acts as a medium, inferring itself what the types of each variable are, and highlights any issues with changing the types inside the .js files.

## Learn to love streaming

One of the most powerful tools at the disposal of a good Javascript developer is that of being able to do a lot of different operators on arrays, chaining the results to seamlessly modify your data from something big and clunky down to whatever you want.

~~~ javascript
const myAwesomeArray = ['Java', 'is', 'different', 'to', 'Javascript'];
myAwesomeArray
    .filter(entry => { return entry.includes('Java'); })
    .map(javaEntries => { return javaEntries.toUpperCase(); })
    .slice(-1)
    .reduce((acc, entry) => { return `${entry} is a dynamically typed language!`},'');
    // JAVASCRIPT is a dynamically typed language!
~~~

When you start working in Java the first thing you notice is that there are an awful lot of Lists and Collections around, and not all that many arrays! Suddenly all of your brilliant chaining makes no sense, and you need to learn everything all over again. Worry not! Java 8 introduced the concept of streaming. Which supports functional operations on your Lists and Collections. Meaning suddenly, you can tap back into your chaining and operators you know and love from Javascript (or at least something very similar!)

~~~ java
myAwesomeList.stream()
    .filter(entry -> entry.contains("Java")
    .findFirst()
    .ifPresent(entry -> system.Print(entry.toUpperCase() + "is a statically typed language!");
    // JAVA is a statically typed language
~~~

Notice how similar those are? I accept there are some small differences but generally there is a lot of overlap. A lot more than most people would expect! All made possible by the power of Stream()!

## Get your IDE set up correctly

This one is a bit less obvious and is something that can be neglected at first glance. With Javascript, because of the fact it’s dynamically typed and typically a bit more lax on global and local variables, the IDE you use can be something as basic as notepad (I still would not recommend it though!) to the gold standard of Javascript editors (which for me at the moment is definitely Visual Studio Code!)

Java however, due to it’s compile complexities, can be made or broken, by setting up your IDE correctly. I can’t recommend using IntelliJ enough. I’m currently using the ultimate edition. I’m aware that it costs money to use, but (for myself, learning the language from Javascript) being able to cycle the options for every class and variable and view errors and warnings as I worked through them made it worth the money over the community edition!

## Don’t be afraid to ask an expert!
My last bit of advice is a really obvious one but one that I believe experienced developers and writers of code struggle with: don’t be afraid to ask more experienced writers for help on problems. Anecdotally, when I started learning Javascript, I was asking patient colleagues everything, from why a for loop wasn’t as good as using forEach on an array, to why my local variable wasn’t being imported elsewhere. As I improved in writing Javascript I started asking questions less and started using stack overflow and the official docs more regularly, and only asking questions if they were particularly complex. So when I started trying to use Java, I fell into the common trap of moving to a new language and believing that I needed to immediately use stack overflow and official docs, making little to no real headway, when instead I should have seen that asking for help was the most sensible and quickest way to improve. Thankfully I had a colleague who was on hand to answer even the most obvious questions with a quick explanation. Rest assured I still lean on them a lot for answers, but the questions are already getting more nuanced.

I can only implore you, if you are moving from Javascript to Java, to not be afraid to ask lots of questions, and ignore how basic they are. It’s the fastest way to improve!

## Conclusion

More and more demand is being made in the software industry for full stack developers as the lines blur between front (typically Javascript) and back (Java) end applications. If you want to make the jump from Javascript to Java I hope these steps outlined above are a good start point for you and wish you well in your journey to becoming full stack!
