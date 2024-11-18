---
title: The Good, The Bad and the Easy?
date: 2020-11-26 00:00:00 Z
categories:
- Tech
author: dogle
layout: default_post
summary: 'In this post I''ll try to lay out some requirements for ''good'' code, talk about how we might define ''easy'' code and how this correlates with a definition of ''good'' code.  '
---

Everyone wants an easy life. As a software developer I often come across code bases that are challenging to work with, that I have a knee-jerk aversion to when I first begin working with the code. Often this is just the learning curve of dealing with something new which quickly subsides. Sometimes however it's more than that, and I'm left feeling the journey didn't have to be that hard to reach the desired goal. This presents some questions: what factors make code easy to work with? How much of the learning curve for a given code base is a necessary part of the solving the problem, how much is unhelpful obfuscation and where does all this fit in when we talk about 'good' code?
  
## Part 1 - In Pursuance Of Goodness
As software developers we all try to write "good" code and encourage others to do the same. We learn that we should write [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) code where we don't write the same code twice, instead we should turn to abstraction to perform common functionality, promoting maintainable code. If we abstract and make our code too generic from the start however, we can quickly obfuscate our code base and make it hard to follow and to debug, both for ourselves and others.  
   
What then constitutes "good" code? How can we define this quality? Is it purely subjective, are there objective qualities that we can measure, or is it a mix of both objective qualities and subjective elements to which we can apply common sense and reach broad agreement over?  
   
### The Four Commandments  
There are many definitions for what constitutes "good code", I think that fundamentally they all can be reduced down to four requirements however.  
   
1. Thou shall write **Working** code.  
2. Thou shall write **Maintainable** code.  
3. Thou shall write **Extensible** code.  
4. Thou shall write **Efficient** code.  
  
#### Working 
The code we write should do its job. This is at the heart of good code, without this requirement none of the others matter. If our code doesn't work no-one is going to care how elegant or efficient it might be.   
   
#### Maintainable  
We want to be able to update the code when we need to. When our code breaks (and it will) we want to be able to find and fix the problems quickly and easily.  
   
#### Extensible  
We should write our code in such a way that if and when we want to add to it we can do so without having to rip out or rewrite large chunks of the old codebase.  
   
#### Efficient  
Our code should not do unnecessary work. Our code should do its job and only its job.  
   
### Black Box Goodness  
If we have a look at the requirements above we can split them into two [black box](https://en.wikipedia.org/wiki/Black-box_testing) requirements (Working and Efficient) and two [white box](https://en.wikipedia.org/wiki/White-box_testing) requirements (Maintainable and Extensible). That means two out of the four requirements can be tested for without ever looking at a single line of code.   
  
Firstly, we can test if our code does its job, indeed, we regularly do test this requirement with a wide variety of programmatic and manual tests. We can also test how quickly, for how long and how consistently our code does that job. We don't need to know anything about what the code looks like to answer these questions.  
  
We write code to do a job, that's its entire purpose. If we have a system that does that job consistently and at a good speed as many times, or for as long as we require, then clearly that code must have some quality of "goodness" to it.  
  
### White Box Goodness  
At some point we may need to update our software to use the latest versions of available tools. We might have to add a new requirement or, if our code is not 100% bug free (unlikely as that may sound), we might have to fix it. At this point we will be forced to lift the lid and peer into the murky depths of the code within.   
  
As developers looking at code, I think we can lay out our requirements for what we want from the code in the following way:  

- I want to be able to add new things without the need to touch large parts of the codebase that are not directly related to my changes.  
- I want to be able to source and fix issues quickly and easily without the need to follow long trails through the code or spend an undue amount of time trying to understand the code.  
   
We can essentially describe this as what we might call *separation of concerns* and *code readability* 

### Simple vs Easy  
In his talk, '[Simple Made Easy](https://youtu.be/oytL881p-nQ)', Rich Hickey differentiates simple from easy as described from a developer's perspective. In short, he measures simple as how many twists a thing has, how tangled with other concerns our code is.  
   
Easy, in contrast, is how familiar or how "near to hand" a thing is. Readable code then is *easy* code, code that is familiar or that does not require a steep learning curve to understand is "near to hand". Likewise, if the code responsible for my bug is located in the same place the problem manifests then it is also "near to hand".  
   
In his talk, Rich points out that Simple is an objective measure, we can measure how twisted a thing is, how many times it interacts with other things. There are also some obvious benefits to simple code; if my code is simple I can change it or even pull it out and drop it somewhere else without the need to untangle it from other things, or the need to understand the other parts that it is entangled with.  
   
### Recap  
Let's take a moment to take stock of where we are. We've defined four clear requirements for what constitutes "good" code. Both the Black Box requirements also happen to be objective measurements, so I'm going to leave them to one side in the next part as we focus in on the elusive subjective quality to good code. 

The White Box requirements whilst not mapping directly, can be achieved by writing simple and easy code as defined above, simple code also being an objective measure.
   
It will rarely be the case that we can have all of these things all the time, and often we will be forced to make compromises in places to achieve gains elsewhere. That said, even if we only focus on maximising the objective requirements, we can still get most of the way to our goal of writing good code.  
   
## Part 2 - In Defense Of Easy 
Let's take another look at our white box requirements: *Extensible* and *Maintainable*. In order to help us focus in on the subjective quality of good code let's replace these two requirements with *Easy* and *Simple*. It's important to be clear that these new values don't map one to one with the White Box requirements but taken together allow us to write Extensible and Maintainable code.
 
Now we've already seen above Simple code is an objective measurement, in that we can measure how many twists our code has. If we then take *Simple* off the table, that leaves only the quality *Easy* left. We might call this *readability*, but I feel that doesn't quite describe what we are talking about here as how complex or tangled with other concerns our code is can also affect readability, so I'm going to use *Easy* to define this property. How easy the code is to access and to work with. Let's create a clear definition of what we mean by this:  
   
> As an average developer, familiar with the language used, I want to be able to access an unfamiliar codebase and understand the code well enough to make changes relatively quickly and without unnecessary difficulty.  
  
This is clearly going to be more of a subjective requirement than the others, that word *unnecessary* in particular implies that at some point we will have to make a decision on what we deem to be necessary.   
   
### Pros and Cons  
Let's first take a look at the benefits vs the cost of writing *easy* code:  
   
#### Pros

##### **Speed**  
If you can sit down at a codebase and easily understand it, or at least locate and understand the part which concerns your changes, you can make those changes faster.  
   
##### **Concentrate on your best code**  
If you find the code you are using easy to access then it becomes easier to find the best way of solving problems as a result.  
   
##### **Fewer bugs**  
The more we understand the code, the less likely we are to introduce new bugs.  
   
##### **Estimate work** 
Our estimates for how much effort is involved in a given task will become more accurate if we understand the work needed better because the code is easy to follow.  
   
##### **Maintainable**  
Our final requirement for *good* code, if we can easily understand the codebase we can more easily maintain it.  
   
#### Cons  

##### **Fear of new**  
By striving to keep things easy we can end up avoiding anything new. New things are often hard to access at first. Tools, processes and practices can have steep learning curves associated with them but the benefits can be huge in return.  
   
##### **Compromise** 
There will often be times when writing easier code will mean that we miss out on opportunities to make our code simpler or more efficient.  
   
##### **Subjective** 
Because easy is a subjective quality, it can be hard for us to judge when our code has this value. What may seem easy to us may be more challenging to another developer and vice versa.  
   
### What makes a thing easy?  
Let's say I'm writing an email to someone and I use some uncommon word. If my intended reader has a wide vocabulary then I probably don't have to worry, but if I don't know this for sure then it might be helpful to ask myself how much benefit I get back from using the word. It may be the case that this particular word clearly defines a particular concept I'm trying to convey, where otherwise I would have to write a whole sentence to convey my meaning. On the other hand it may be that there is a more widely understood synonym that would be a good alternative and make my email more easily understood by a wider audience.  
   
Now obviously no-one would advocate avoiding all words that may be hard to understand when writing, a reader can always look up a word in the dictionary (the docs) if needed. That said, with just a little extra effort we can make the content more easily understood by all.   
   
If the email is technical in nature, I may wish to include technical terms and acronyms. Again I should consider my audience and provide explanations for terms where appropriate. I could even write part of my email in French if I felt that more succinctly conveyed my meaning however, somewhat obviously, only readers that understand French will understand my meaning.  
   
#### `</Metaphor>`  
Ok, enough metaphor, let's return to coding.  
   
On the one hand we can reasonably expect that other developers will have an average understanding of the programming language that we are using, it would be an unreasonable waste of our time to have to comment every line of code we write just in case someone finds it hard to follow, clearly the cost here will outweigh the benefits. As we evaluate our code for easiness we need to assess how much cost is associated with making our code easier and if that cost outweighs the return.  
   
#### Uncommon code  
In JavaScript (as well as some other languages) the ability to 'Curry' functions is a feature of the language, we need no extra libraries to facilitate it. Despite this it is very much a functional programming technique and the syntax may be hard to follow for those unfamiliar with it.  
   
If I have a function that takes three parameters and uses them for some calculation I could write the code in two ways:  

~~~javascript
// Standard  
const doACalculation = (paramA, paramB, paramC) =>
    paramA ? (paramB + paramC) : (paramB - paramC);

// Curried
const doACalculation = (paramA) => (paramB) => (paramC) =>
    paramA ? (paramB + paramC) : (paramB - paramC);
~~~ 

and call them 
 
~~~javascript
// Standard  
doACalculation(true, 6, 4); // 2  

// Curried  
doACalculation(true)(6)(4); // 2  
~~~ 

It's fair to say I think that the standard version here would be more easily understood by a wider set of developers, therefore improving the *easiness* of our code. As with the uncommon word example in the metaphor above however we can't simply say "let's always avoid currying at all costs as it makes for bad code" because that simply isn't true.  
   
If we only call our `doACalculation` function once in our codebase we lose very little by avoiding the curried version, but let us suppose we call this function twenty times. If we have used the curried version we could do the following:  

~~~javascript 
const subtractValues = doACalculation(false);  
const addValues = doACalculation(true);  

// And call them  
subtractValues(6)(4); // 2  
addValues(6)(4); // 10  
~~~

To achieve the same thing with the standard version we would have to wrap a function around `doACalculation` which will be a bit more verbose. What we have here is quite succinct, it's reusable and we can extend it even further if we wanted to:   

~~~javascript 
const addFiveTo = addValues(5);  
addFiveTo(6) // 11;  
~~~

What's not to like?  
   
There are some warning signs here that we have made our code less easy. If I am a developer looking at this code to fix an issue I will see a function `addFiveTo` that takes a single parameter of value `6`. I don't see the `5` and I don't see the `true` argument that is passed to `doACalculation`. Now, in this case we have clearly named our function so that it is hopefully clear what it does but those parameters are still hidden from view. Whenever we hide code like this we are making the code less easy and we need to ask ourselves if the benefits are worth the cost, if we gain enough from this approach to be worth making our code harder to understand.  
Secondly, we have added to our debugging chain. When I go to debug this code I am going to start where the problem will manifest, in this case that is going to be with `addFiveTo`. I then have to locate and understand `addValues` and finally locate and understand `doACalculation` before I get to the code that performs the calculation. This doesn't mean we shouldn't curry functions but it is a good reason to think about when we need to and how we can mitigate the cost through clear labeling and comments. We should consider how much this approach will benefit us right now, not in the future, as we can always refactor our code. If we reduce easiness in the present to facilitate potential benefits for the future we risk making our code harder for a payoff which may never happen.  
   
#### Terminology  
In general, we should always try to name our variables and functions sensibly, we all know this, in the curried function above for example, we documented its purpose by giving it a sensible name. We could also have named the arguments more descriptively for each function, but there are other things as well we can do to help make our code easier to read. We can avoid unnecessary abbreviations, `secCol` may seem to be an obvious abbreviation for "Second Colour" when we are writing our code but it will make it harder to determine what the variable stores later. `secondColour` maybe a little more verbose but it's a lot clearer what it stores and if you are using a modern text editor you will rarely have to write it more than once. Obviously we can't (and shouldn't) write out a sentence for each variable name however, if you are really struggling to name a variable then a quick comment at the point the variable is declared will help make its purpose more obvious. This will add to our debugging chain as a developer will have to locate the variable declaration to discover its purpose (if it's not already obvious), but it's better than it not being described at all.  
   
Most systems will have terminology that is specific to its domain. If a system is software for a pharmaceutical company for example, I can expect to see pharmaceutical terms in the codebase. On top of this, it will be common to abbreviate terms to acronyms when they are used often within a company or domain. We should not avoid acronyms as they do not necessarily make our code harder to understand. It may be that the acronym is more commonly used than the verbose term in which case using it will reduce confusion when others read the code. Most importantly we should try to remain consistent, if a thing has more than one name we should pick one (the most common if possible) and stick to it, code will quickly become confusing if we use multiple terms for the same thing throughout the codebase.  
   
#### Do I need this?  
In an ideal world when we come to work on software we don't want to spend large amounts of time learning tools. When we learn a new tool we will always have a "newbie" period when we are not using it as well as we could. It can be detrimental to the codebase and frustrating for developers.  
   
Libraries provide a lot of useful and powerful functionality and allow us to leverage that functionality without duplication of code another developer has already written.   
So how can libraries make our code harder to understand? One way is that they can hide functionality from us. This is fairly obvious, if I have a function that makes a call out to a library and gets a value back then what happens in the middle can be hidden, and in most cases we don't care overly how that happens, part of the reason we are using the library is so that we don't have to worry about implementation details.  
Let's look at a couple of examples of how we can think about making our code easier. Ramda is a popular and useful utility library for JavaScript, among the many functions it provides are `map` and `filter`. We can achieve the same thing through use of JavaScript ES6 however without the need to ever involve an external library:  
   
~~~javascript
// Map Ramda  
import * as R from 'ramda';  
const double = x => x * 2;  
R.map(double, [1, 2, 3]); //=> [2, 4, 6]  
// Filter Ramda  
const isEven = n => n % 2 === 0;  
R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]  

// Map es6  
const double = x => x * 2;  
([1, 2, 3]).map(double); //=> [2, 4, 6]  
// Filter es6  
const isEven = n => n % 2 === 0;  
([1, 2, 3, 4]).filter(isEven) //=> [2, 4]  
~~~ 

By using the library, we force a developer coming to our code to not only have knowledge of the language we are developing in, but also to learn the Ramda functions. With these particular functions the name is probably enough to inform us what the function does however, we are still adding a dependency on a library we don't need for this operation. Even worse, if somewhere in the codebase another developer has used the ES6 versions of these functions we now have two versions of each operation in use in the code, each with its own syntax that will add confusion to our code.  
   
Other cases may be more nuanced than this. Let's take for example the `Ramda.cond` function, we can use this in place of an `if / else` condition:  
   
~~~javascript  
// Vanilla JS  
function conditional(temp) {
    if (temp === 0) {
        return 'water freezes at 0°C';
    } else if (temp === 100) {
        return 'water boils at 100°C';
    }
    return 'nothing special happens at ' + temp + '°C';
}

// Ramda  
import * as R from 'ramda';
const fn = R.cond([
    [R.equals(0), R.always('water freezes at 0°C')],
    [R.equals(100), R.always('water boils at 100°C')],
    [R.T, temp => 'nothing special happens at ' + temp + '°C']
]);
fn(0); //=> 'water freezes at 0°C'  
fn(50); //=> 'nothing special happens at 50°C'  
fn(100); //=> 'water boils at 100°C'  
~~~

In this example it seems fairly plain we have taken something widely understood (the `if` statement) and obfuscated it using a library, if we had a lot more cases however we might view this differently. We could use a `switch` statement to keep things tidy but we may want to check more complex conditions that a switch allows for, in this case the use of a library function such as this starts to look more reasonable.   
   
Again the lesson is not "don't do this" but rather "think before you do". Do you need the library function, are the benefits greater than the cost? What would this look like if I was to write it without the library?  
   
> Each time we use a library we require a developer looking at our code to learn at least part of that library in order to work with our code.   
 
All in all then, *easiness*, as we have defined it in code, is the polish that we put on the top of our objectively *good* code. It's not always possible to make all our code easy to access, sometimes we must compromise to get greater benefits elsewhere and sometimes the cost of learning something new is worth what we get back in return, in fact it's rare we will have to make no compromises at all.   
  
As a rule we should strive to always write code with a developer who has never seen our codebase before in mind. If we take the time to consider if our code could be easier without significant cost we can create code that is not only working and efficient but extendable and maintainable as well. Code that is just hard enough to solve the problems it needs to without adding unnecessary misdirection, obfuscation and difficulty, in short, good code.