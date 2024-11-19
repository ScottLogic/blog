---
title: 'TypeScript Builders: Improving your types one step at a time'
date: 2020-09-16 00:00:00 Z
categories:
- Tech
tags:
- typescript
- types
- featured
summary: TypeScript's type system is amazing, but it can't do everything. In this
  post, I demonstrate how the builder pattern takes my types to the next level. We
  walk through an example in detail, so you can start using builders too.
author: swaterman
summary-short: Using the builder pattern, we can take our types to the next level.
image: swaterman/assets/ts-builders/Builders-Usage.svg
layout: default_post
---

The builder pattern in TypeScript is amazing.
However, the way you use it in TypeScript is completely different to other languages.
Typically, builders are used to add support for optional and default parameters in languages that don't support them directly.
TypeScript *already* supports [optional and default parameters](https://www.typescriptlang.org/docs/handbook/functions.html#optional-and-default-parameters) though - so what's the point?

We can actually use builders as a workaround for other issues in the type system.
In TypeScript, that means a way to enforce complex constraints like `only allow sending an event if anyone is listening for that event`.
In this (long but beginner-friendly) post, we do an in-depth walkthrough of how to create a TypeScript builder class to enforce a complex constraint like that one.

We start by introducing a simple data processing task and discuss how it would be useful to create a generic version.
That immediately gets too hard, so we introduce builders to save the day.
Step-by-step, we analyse the problem and design a builder to solve the problem.
We then discuss the pros and cons of that approach, and explore whether it was even necessary in the first place.

## A Simple Task

Let's imagine a basic data processing task:

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Simple-Pipeline.svg" alt="This definitely warranted a 5000 word blog post" aria-label="Shows a simple data pipeline that performs the following steps:">

1. Take an integer string as input

2. Reverse it

3. Parse it back into an integer

4. Multiply it by 5

    const input = "524";
    const a = input.split("").reverse().join("");
    const b = parseInt(input, 10);
    const c = b * 5;

The rest of this blog post is dedicated to over-engineering that tiny bit of code.
It's clearly overkill in this case, but that's inevitable when we use a simple example to demonstrate an advanced technique.

### Making it Reusable

We saw how to do that task as a one-off, but what if we wanted it to be a configurable reusable function?
We can define a function that takes a few config parameters:

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Configurable-Pipeline.svg" alt="Not that you'd ever really want to set the radix" aria-label="The to Int and multiply steps take config parameters now">

    function process(input: string, radix: number, multiplicand: number) {
      const a = input.split("").reverse().join("");
      const b = parseInt(input, radix);
      const c = b * multiplicand;
      return c;
    }
    process("524", 10, 5);

Often, it's easier to take the config as a single object:

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Config-Object.svg" alt="We're definitely doing it this way because it's intuitive and not because it makes the rest of the blog post simpler" aria-label="The radix and multiplicand parameters come from a single config object">

    function process(input: string, config: {radix: number, multiplicand: number}) {
      const a = input.split("").reverse().join("");
      const b = parseInt(input, config.radix);
      const c = b * config.multiplicand;
      return c;
    }
    process("524", {radix: 10, multiplicand: 5});

That's useful as it allows the config to be loaded from a JSON file.
*Conveniently* it also makes our job easier later on.
What are the odds?

### Formal Definition

Taking a step back, what is it that we're actually trying to do?

This pattern is really common, and goes by a few names.
Most commonly in computing, it's known as a [pipeline](https://en.wikipedia.org/wiki/Pipeline_(computing)) - a function which takes data and performs a sequence of transformations.
The fundamental technique in mathematics is called [function composition](https://en.wikipedia.org/wiki/Function_composition) - combining many small functions into one larger function.

Pipelines are used for things like application build config, or for http request middleware.
Their main benefit is the ability to *encapsulate* many functions, allowing them to be treated as one.

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Encapsulation.svg" alt="All good technical diagrams include a red scribble" aria-label="We can treat the entire pipeline as a single function">

### A Pipeline Factory

Since we create pipelines so often, a reusable function that creates pipelines sounds really useful.
The JavaScript implementation is simple using higher-order functions:

    function createPipeline(functions) {
      return function pipeline(initState, config) {
        let state = initState;
        for (function of functions) {
          state = function(state, config),
        }
        return state;
      }
    }

It's even possible as a (long) one-liner:

    const createPipeline = initState => 
      functions.reduce((state, function) => function(state, config), initState);

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Factory.svg" alt="If only it was that easy" aria-label="We pass the three functions as a list into the pipeline factory, which outputs the factory">

However, just because the JS code is simple, that doesn't mean it's easy to do (safely) in TypeScript.
Of course, it's possible to just copy the JavaScript with a healthy sprinkling of `any`.

That's no fun though - why even use TypeScript if you're just gonna ignore type errors?
Let's try actually putting in some effort, and see how narrow we can make the types.
As a first attempt, I get something like this:

    function createPipeline<Type, Config>(
      functions: Array<(input: Type, config: Config) => Type>
    ): (input: Type, config: Config) => Type { }

This has issues.
To find out why, we need to learn some new terminology.

### Math Time

It's time for a quick journey into the foundations of mathematical logic, so hold on...

---

Ideally, we want a type definition to be *sound* and *complete*.
*Soundness* means any function call that compiles will not cause type errors at runtime.
*Completeness* means any valid function call should compile.

Mathematicians have [much longer](https://en.wikipedia.org/wiki/Soundness), [more general](https://en.wikipedia.org/wiki/Completeness_(logic)) definitions of those terms.

Our first Pipeline Factory attempt is *sound* but not *complete*.
It requires all the functions to be the same type.
The JavaScript version is more powerful.

The pipeline we created manually contains three stages.
Some of them output a string, while others output a number.
That's fine in our JS example, but won't compile in our TS example.

Specifically, a pipeline is valid when each stage's output is the same type as the next stage's input.
To achieve both soundness and completeness, we'd need a way to check for that.

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Constraint.svg" alt="The outie bit needs to fit the innie bit. That's just how science works." aria-label="Each stage has a shaped input and output. They must match up like a jigsaw if the pipeline is going to work">

It's not obvious how we could achieve both soundness and completeness at the same time.
Any simple solutions will only achieve completeness by losing soundness, like this:

    function createPipeline<Config>(
      functions: Array<(input: any, config: Config) => any>
    ): (input: any, config: Config) => any {/*...*/}

In other words, this would let us pass an invalid pipeline, like this:

1. Take a string and reverse it

2. Multiply by 5

In step 1, we output a string, but in step 2 we expect a number as an input.

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Constraint-Error.svg" alt="It's like when you get a box that's half full of Lego and half MegaBlocks..." aria-label="The output of reverse doesn't fit the input of multiply">

---

Right, we're out of the woods now.
Still with me?
Let's get back to the code.

### The problem

Our ideal pipeline definition is too complex.
A pipeline is valid based on whether each element in an array matches the one before it.
That's not something we can easily restrict.

With builders, it's a different picture entirely.

## Introducing Builders

A [builder](https://en.wikipedia.org/wiki/Builder_pattern) is any utility class that uses sequential method calls to have the effect of a single method call.
They are typically used for the creation of complex objects.
For example, a string concatenation function could be written as:

    function concat(...sections: string[]): string { }
    const output = concat("hi", "my", "pals");

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-String-Factory.svg" alt="ARGH I FORGOT THE SPACES!!!" aria-label="A simple function that takes a list of strings and joins them together">

Or it could be written as a builder, meaning it gets used like this:

    const output = StringBuilder.new()
      .append("Hi")
      .append("my")
      .append("pals")
      .build();

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-String-Builder.svg" alt="This is definitely much easier :|" aria-label="Achieves the same thing but using repeated append calls on a builder">

`StringBuilder` isn't something we see very often in TypeScript, because it's easy enough to just write it as a single method as seen above.
In Java however, we see builders all the time ([including `StringBuilder`](https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html)).
That's because Java's type system is less flexible than TypeScript's.

> builders make up for inadequacies in the type system

In Java, they let us call functions with a varying number of arguments, and provide a way to support optional and default parameters.
TypeScript already supports [all](https://www.typescriptlang.org/docs/handbook/functions.html#optional-and-default-parameters) of [that](https://www.typescriptlang.org/docs/handbook/functions.html#rest-parameters), but builders can let us enforce more complex constraints, like our pipeline's output-equals-input constraint.

We can achieve that by using a technique that I'm calling *Mutable Generic State*.

*If it already has a name, please [let me know](https://twitter.com/stewaterman). I spent a long time looking.*

## Mutable Generic State

Mutable Generic State is a technique which uses immutable classes to give the impression of a class with mutable generic types.

Let's imagine a simple string wrapper class.
It stores a string which can be accessed with `.get()` and updated with `.set()`.

    const a: StringWrapper = wrap("hello");
    a.set("friends!");

Here, the return type of `a.get()` is `string`.
We can make `a.get()` return `"hello"`, by using type literals in a generic type:

    const a: StringWrapper<"hello"> = wrap("hello");

However, now we can't call `a.set()` unless the new value is also `"hello"`.
With Mutable Generic State, it all works as expected:

    const a: StringWrapper<"hello"> = wrap("hello");
    const b: StringWrapper<"friends"> = a.set("friends!");

The trick here is that we've made `StringWrapper` immutable.
When we call `.set()`, we are actually creating a new instance of StringWrapper with a different generic parameter.
Once those calls are inlined, there's no way to tell that each `.set()` call produces a new wrapper:

    const a = wrap("hello")
                .set("there")
                .set("friends!");

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-MGS.svg" alt="Sadly, one thing builders can't solve is YOU BEING AN IDIOT THAT FORGETS THE SPACES" aria-label="Achieves the same thing but using repeated append calls on a builder">

From the user's perspective, it's like we've *mutated* the generic type from `"hello"` to `"there"` to `"friends!"`.
The generic type tells us something about the current state of the builder, and it mutates when the builder does.
That's where the name comes from - it's *state*, stored in the *generic* types, which is *mutable*.

## Types of Constraints

When thinking about types, we think of it in terms of *constraining* the set of possible data types.
Some of those constraints are *simple*:

> string wrappers should contain a string

Some constraints are *complex*:

> calling `.get()` on a string wrapper should return the type of the argument passed in the last call to `.set()`

Complex constraints are *relative*.
They change based on previous method calls, or previous elements in an array.
In the case of `StringWrapper`, the arguments passed to `.set()` are conditionally valid based on previous `.set()` calls.

That's not the only requirement though.
A constraint can only be complex if it is potentially infinite.
Otherwise, we could just list all valid type combinations.
Our string wrapper has an infinite number of strings it could hold, and no limit on the number of calls to `.set()`.

## When to use builders

Builders are clunky, hard to write, and hard to use.
If you can do it without a builder, that's probably best.
They should be a last resort.

It's not always possible to use a builder.
For example, builders can't help when writing type definitions for a pre-existing JavaScript library, as they exist in the compiled JavaScript code.
You can still use builders in a wrapper around the library though!

Sometimes, a builder is more readable and simpler than the alternative.
If it's *technically possible* to achieve without a builder, but you don't know how, a builder is still a valid choice.
In fact, as of TypeScript 4, you *technically* never need a builder.
I'll come back to this right at the end, so keep an eye out.
In practice though, a builder is usually a better option.

If it wasn't already obvious, our pipeline example is a good candidate for a builder!

## Builder building 1: Identifying the Generics

Now we're set on solving the problem with a builder, where do we start?
The first step is to identify the generic types it needs.
Some of those types will change as we call methods on the builder - the mutable generic state.
Others are just normal generic types.

There are two places we need to look:

1. The builder's output

2. The complex constraints

The builder's output is dependent on what we passed in our method calls.
In order to correctly type it, we need to add some generic state to the builder.
In our case, the output is a function which performs some kind of data transformation on an input, producing an output, based on config.
All three of those should be generic types.

Next, we need to think about the constraints on our builder and how they map to Mutable Generic State.

To create our pipeline, we need a sequence of stages where:

* There is a defined order

* Each one has two arguments - input and config

* The output of one stage is the first argument to the next stage

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Mutation-Constraint.svg" alt="Make them all fit together" aria-label="Visual representation of those bullet points using the jigsaw-like style">

The first constraint is achieved by simply storing the stages in a list in the order they were added to the builder.
The second constraint is a simple type definition: `(input: any, config: any) => any`.
The final constraint is complex, and must be enforced using Mutable Generic State.

### Enforcing Stage Consistency

Consider the builder in an intermediate state.
We have a few stages already added, and assume that everything is correct until now.

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Intermediate-Builder.svg" alt="A happy little community of stages!" aria-label="The builder has 3 stages added">

What information do we need about the previous calls to add a new stage to our pipeline?
Well, that depends on how we add the new stage.
I can see a few options:

1. Only add stages to the start of the pipeline

2. Only add stages to the end of the pipeline

3. Add stages anywhere valid in the pipeline assuming it doesn't make the pipeline invalid

4. Add stages anywhere in the pipeline, even if it becomes invalid, and only allow building the pipeline when it's valid

All four options are *possible* using builders and Mutable Generic State, but some are easier than others.

Options 1 and 2 are both pretty simple.
In option 1, we need to know the current pipeline input and the new stage's output.
In option 2, we need the pipeline's output and the new stage's input.

Option 3 is quite hard.
We need to know the state before and after each stage of the pipeline:

* If we insert at the start, we restrict the output of the new stage.

* If we insert at the end, we restrict the input of the new stage.

* If we insert in the middle, we restrict both the input and output. Both must be the same as the state at the insertion point.

Option 4 is nightmarish.
I'm not going to go into detail, because this is already an absurdly long post.
Feel free to try, and let me know if you get it to work!

We need to weigh up user-friendliness vs simplicity of writing the builder.
To me, options 3 and 4 are too complex and don't make the final builder *that much* easier to use.
Between options 1 and 2, there's no difference in complexity but adding to the end of the pipeline is more natural.

Therefore, I'm going with option 2.
**When adding a stage, we need to know its input and the current pipeline's output.**

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Stage-Consistency-Check.svg" alt="An outsider - but they mesh well!" aria-label="We add a fourth stage, and it is valid because it fits against the current output">

Getting the input of the new stage is simple with a generic type on the builder's `append` method.

We already have an `Output` generic type on the builder, but we'll need to update it over time.
Whenever we add a new stage to the pipeline, we update `Output` to be the output of the new stage.

### Tracking the Config

There's one other constraint on our builder.
The config in the resulting pipeline needs to provide the information to each stage.
I'm going to skip the in-depth discussion of how we could achieve that and tell you the solution.
When talking about function parameters, it's simplest to just use a single config object.

In other words, rather than our stages looking like this:

    function multiply(input: number, multiplicand: number): number { }
    /*...*/
    type Pipeline = (input: number, multiplicand: number, radix: number, ...) => number;

We should just require them to look like this:

    function multiply(input: number, config: {multiplicand: number}): number { }
    /*...*/
    type Pipeline = (input: number, config: {
      multiplicand: number; 
      radix: number; 
      ...
    }) => number;

The first example can work, but it's usually not worth the extra effort.

We already had the `Config` generic type, but now we know it needs to be mutable.
Whenever we append a stage, its config parameters should be added to the `Config` generic type.

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Config-Consistency.svg" alt="Grow! GROW!!!" aria-label="When we add a fourth stage, the config is also updated">

## Builder building 2: Structuring the Builder

Now we know what our generic types are and how they update, we can start writing our builder.
Just focus on the types for now, since that's the hard bit.
We can fill in the method stubs later.

### Class Definition

Create a new class for our builder, with the generics we figured out previously.

    class PipelineBuilder<Input, Config extends Record<string, any>, Output> { }

If you haven't seen the [Record type](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype) before, just know that we're saying that `Config` must be an object with strings for its keys.

### Build definition

The build method creates the output of the pipeline.
It's really nothing special.
We declare a method which outputs a pipeline function based on the generic types:

    build(): (input: Input, config: Config) => Output { }

### Mutator Definition

The mutator method is the one that changes something about the object, in our case `append`.
It's not an entirely accurate name, since our builders are immutable, but it makes sense when we're conceptualising them as mutable objects.

Thinking back to our discussion about how to enforce the constraints with Mutable Generic State, how should each of the three type parameters change after a call to append?
Firstly, `Input` should not change. Stages are added to the end of the pipeline and don't affect the start.

Regarding `Output`, we said:

> Whenever we add a new stage to the pipeline, we update the type to be the output of the new stage.

Regarding `Config`, we said:

> Whenever we append a new stage, any new parameters in that stage should be added to the `Config` generic type.

In terms of a type definition, that looks like this:

    append<NewConfig extends Record<string, any>, NewOutput>(
      func: (state: Output, config: NewConfig) => NewOutput
    ): PipelineBuilder<Input, Config & NewConfig, NewOutput> { }

`Output` becomes `NewOutput` and `Config` becomes `Config & NewConfig`, an [intersection type](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#intersection-types).

Notice that after a few calls to `append`, the `Config` type will be something like:

    Config & NewConfig1 & NewConfig2 & NewConfig3 & NewConfig4

That is harmless, and just a quirk of the Mutable Generic State, so don't be alarmed if you see a huge type when you weren't expecting one.
The autocomplete will get better once the builder is done and in use.

### Internal State

The internal state should just be whatever the `build` method needs for its implementation.
In our case, we only need the list of stages.
We add that as a private readonly property, and give it the narrowest type we can:

    private readonly stages: Array<(state: any, config: Config) => any>;

### Instantiation

Up until this point, we have ignored how to instantiate a new pipeline builder, just assuming that we had one ready-made.
Unsurprisingly, it's more complex than just adding a constructor.
In fact, we need two different ways of creating a builder.

First, we need a private constructor to use internally.
It allows 'mutation' of the builder, setting `stages` to any value, even if that would break the resulting pipeline.
That's why it must be private.

    private constructor(stages: Array<(state: any, config: Config) => any>) { }

Secondly, we need a public creation method.
It should set reasonable defaults for the type parameters where possible, in line with what you'd expect from an 'empty' builder.

    static new<Input>(): PipelineBuilder<Input, {}, Input> { }

Here, the `Config` parameter was set to a reasonable default of `{}`, since a pipeline with no stages doesn't need config.
Other type parameters may have to be manually specified by the user, like the `Input` type.
The `Output` type is the same as `Input` since a pipeline with no stages just outputs the input.

Alternatively, by requiring at least one stage in each pipeline, there's no need to manually specify any generic types:

    static new<Input, Config extends Record<string, any>, Output>(
      stage: (state: Input, config: Config) => Output
    ): PipelineBuilder<Input, Config, Output> { }

I'm going with the first option, but it's a matter of preference.

## Builder building 3: Implementation

Finally, the method stubs need implementing.
The implementation is standard TypeScript, without having to worry about the complex constraints.
Those are handled by the method signatures.

However, be aware that the builder **isn't really type-safe**, at least internally.
A few casts are needed to get the types to work, which means simple mistakes like adding a stage in the wrong location won't cause type errors.
Double-checking that everything lines up is imperative.

Implementing those methods is the last step, meaning the builder is now done!
Here's one I made earlier:

    class PipelineBuilder<Input, Config extends Record<string, any>, Output> {
      private readonly stages: Array<(state: any, config: Config) => any>;
    
      private constructor(stages: Array<(state: any, config: Config) => any>) {
        this.stages = stages;
      }
      
      static new<Input>(): PipelineBuilder<Input, {}, Input> {
        return new PipelineBuilder([]);
      }
    
      append<NewConfig extends Record<string, any>, NewOutput>(
        newStage: (state: Output, config: NewConfig) => NewOutput
      ): PipelineBuilder<Input, Config & NewConfig, NewOutput> {
        const newStages: Array<(state: any, config: Config & NewConfig) => any> = this.stages.slice();
        newStages.push(newStage);
        return new PipelineBuilder<Input, Config & NewConfig, NewOutput>(newStages);
      }
    
      build(): (input: Input, config: Config) => Output {
        return (input: Input, config: Config) => 
          this.stages.reduce((state, stage) => stage(state, config), input);
      }  
    }

In a whistle-stop tour of the implementation, we see that:

* The constructor sets the `stages` property

* `new` creates an empty builder - one with no stages

* `append` creates a new list of stages, adds the new stage, and returns a new builder based on that

* `build` returns a function which takes an input and some config, then sequentially applies the stages

### Usage

let's see the builder in action:

    function reverse(input: string) {
      return input.split("").reverse().join("");
    }
    
    function toInt(input: string, config: {radix: number}) {
      return parseInt(input, config.radix);
    }
    
    function multiply(input: number, config: {multiplicand: number}) {
      return input * config.multiplicand;
    }
    
    const pipeline = PipelineBuilder
      .new<string>()
      .append(reverse)
      .append(toInt)
      .append(multiply)
      .build();
    
    const output: number = pipeline("532", {
      radix: 10,
      multiplicand: 5
    })

I defined the stages above, but they could've been inlined as arrow functions.

We call `PipelineBuilder.new<string>()` to create a new builder that takes a string as input.
Then we append our three functions in the correct order.
Finally, we call `.build()` to get a pipeline that we can call, and then we try it out.

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Usage.svg" alt="The code may be simple, but the complexity of this diagram makes me feel a bit better about how long the post is!" aria-label="Visual representation of the last paragraph's description">

It's hard to demonstrate the builder, because the most impressive bit is all the things you *can't do*.
Here's a gallery of things that won't compile:

---

**Invalid first pipeline stage, `multiply` takes a `number` but got a `string`**:

    const pipeline = PipelineBuilder
      .new<string>()
      .append(multiply)

---

**Invalid second pipeline stage, `toInt` outputs a number but inputs a string**:

    const pipeline = PipelineBuilder
      .new<string>()
      .append(toInt)
      .append(toInt)

---

**Invalid type on `output`, pipeline returns `string`**:

    const pipeline = PipelineBuilder
      .new<string>()
      .append(reverse)
      .build();
    
    const output: number = pipeline("532", {})

---

**Invalid pipeline input, should be string**:

    const output: number = pipeline(532, {
      radix: 10,
      multiplicand: 5
    })

---

**Invalid config, missing radix**:

    const output: number = pipeline("532", {
      multiplicand: 5
    })

---

[Sound.](https://en.wikipedia.org/wiki/Soundness)

## Analysing the Builder

This is not a simple technique, and I've really hyped it up.
However, there are drawbacks, and things can easily go wrong.
Let's discuss a couple of those rough edges.

### Immutable internal state

Each call to the `.append()` method creates a new builder.
That's a bit slow, but that's not the main issue.
There's no guarantee that someone won't hold on to an old builder, like this:

    const a = PipelineBuilder.new<string>();
    const b = a.append((input: string, config: {}) => parseInt(input));
    const pipeline = a.build();

If `stages` was mutable, and append looked like this:

    function append /*...*/ {
      stages.append(func);
      return new PipelineBuilder(stages);
    }

Then `a` and `b` both hold the same reference to `stages`, and now both contain one stage.
However, the `Output` type parameter on `a` says it returns a string.
In reality, a pipeline created from `a` would be identical to one created from `b`, and would return a number.

The long and short of it is: **the builder's variables must be immutable**.

### Unsafe types

The implementation has `any` littered throughout it.
If you're anything like me then alarms are ringing.
Isn't the whole point that we want to *increase* type safety?

Yes, and that's the core issue.
If we could write a correct type for `stages`, one which guarantees the input to a stage is the output of the previous one, we wouldn't need a builder.
We can't do that directly\*, so instead we guarantee that the type meets those requirements through the type signature of `.append()`.

Essentially, we encapsulate all the type-unsafe code behind a type-safe interface.
For that reason, adding to a builder like in `.append()` requires extreme care.
That internal constructor *is not* type-safe, and would accept almost anything.
If the list passed to the constructor breaks that `input to x == output of x-1` guarantee, then any pipelines built from it will break.

### Another Way?

There was a suspicious asterisk in the previous section, and earlier I promised to tell you more about the wonders of TypeScript 4.
Buckle up!

For the entirety of this post, we've just accepted the fact that you can only resolve complex constraints with builders.
In fact, that's not true.
I'm not saying builders are useless, and in fact this section should come with a disclaimer:

> **The stunts performed in this section were done with a complete disregard for best practice.**
> **Don't try this at work.**

---

Allow me to introduce [TypeScript 4.0](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/), and more importantly, [Variadic Tuple Types](https://github.com/microsoft/TypeScript/pull/39094).
Variadic tuple types **massively** increase the flexibility of TypeScript's tuples.

With variadic tuples, we can actually implement anything we could use a builder for as a normal type constraint.
It will be huge, unmaintainable, and really hard to write (this took me a day), but it's possible.
Even better, these don't exist at runtime which means they work when writing type declarations for a 3rd-party library.

Here's the pipeline without a builder:

    type Tail<XS extends readonly any[]> = XS extends readonly [any, ...infer T] ? T : [];
    type Last<XS extends readonly any[]> = XS extends readonly [...infer _, infer X] ? X : never;
    type UnionToIntersection<U> = (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;
    type Equal<A, B> = A extends B ? B extends A ? true : false : false;
    
    type PipelineStage<Input, Config extends Record<any, unknown>, Output> = (input: Input, config: Config) => Output;
    
    type Input<Stage extends PipelineStage<any, any, any>> = Parameters<Stage>[0];
    type Config<Stage extends PipelineStage<any, any, any>> = Parameters<Stage>[1];
    type Output<Stage extends PipelineStage<any, any, any>> = ReturnType<Stage>;
    type PipelineInput<Stages extends readonly [PipelineStage<any, any, any>, ...any[]]> = Input<Stages[0]>;
    type PipelineConfig<Stages extends readonly PipelineStage<any, any, any>[]> = UnionToIntersection<Config<Stages[number]>>;
    type PipelineOutput<Stages extends readonly PipelineStage<any, any, any>[]> = Output<Last<Stages>>;
    
    type Match<First extends PipelineStage<any, any, any>, Second extends PipelineStage<any, any, any>> = Equal<Output<First>, Input<Second>>;
    type ValidPipeline<Stages extends readonly PipelineStage<any, any, any>[]> =
      Stages extends readonly [any] ? true
      : Stages extends readonly [any, any, ...any[]] ? Match<Stages[0], Stages[1]> extends true ? ValidPipeline<Tail<Stages>>
      : false : false;
    
    type Pipeline<Stages extends readonly PipelineStage<any, any, any>[]> = ValidPipeline<Stages> extends true ? Stages : never;
    
    function createPipeline<Stages extends readonly [PipelineStage<any, any, any>, ...PipelineStage<any, any, any>[]]>(...pipeline: Pipeline<Stages>): (input: PipelineInput<Stages>, config: PipelineConfig<Stages>) => PipelineOutput<Stages> {
      return (input: PipelineInput<Stages>, config: PipelineConfig<Stages>) => {
        let state: any = input;
        for(const stage of pipeline) {
          state = stage(state, config)
        }
        return state;
      }
    }
    
    function reverse(input: string, config: {}) {
      return input.split("").reverse().join("");
    }
    
    function toInt(input: string, config: {radix: number}) {
      return parseInt(input, config.radix);
    }
    
    function multiply(input: number, config: {multiplicand: number}) {
      return input * config.multiplicand;
    }
    
    const pipeline = createPipeline(reverse, toInt, multiply);
    const output = pipeline("524", {radix: 10, multiplicand: 5});

This snippet declares that a pipeline is a list of functions in the form `Array<(input: Input, config: Config) => Output>`.
Then, it defines what makes a pipeline valid:

A pipeline with only one stage is always valid.
A longer pipeline is only valid if:

* The output type of the first stage is the input type of the second stage **and**

* The pipeline consisting of all stages except the first is valid

That's right, a recursive conditional type definition!
If the pipeline is 10 stages long, we end up with a 10-layer nested type:

<img style="width: 100%" src="{{ site.github.url }}/swaterman/assets/ts-builders/Builders-Varaidic.svg" alt="Recursive type definitions are a bit of a trip" aria-label="Shows the full recursive type checking of a pipeline">

---

It goes without saying that you probably shouldn't do this without good reason.
The `createPipeline` method signature, with 238 characters on one line, is probably enough evidence of that.

If you do have a good reason to do this though, hooray!
It's finally possible.
Look how nice that `createPipeline` call is!

I'm really excited about variadic tuple types, so keep an eye out for a future blog post on that topic.

## Conclusion

We've introduced the idea of a pipeline, and discussed how it's really hard to achieve type soundness in a pipeline factory function.
Builders came in to save the day, introducing us to Mutable Generic State.

We used the pipeline as a worked example, establishing what generic types the builder would need.
Our builders couldn't enforce the complex constraints on the state directly, so we set up our methods to prevent the internal state becoming invalid.

Finally, we discussed the issues with using the builder pattern, and ended with a bang courtesy of variadic tuple types.

Next time you find yourself cursing a type definition that's **just not narrow enough**, I hope your newfound builder knowledge is useful!

---

If you made it this far, congrats.
This is the longest blog post I've ever written, by a large margin, and it's taken me 6 months to finish.

I really hope you enjoyed it, and I hope you found it useful.
Feel free to contact me on [Twitter](https://twitter.com/SteWaterman) with any questions, feedback, or to point out mistakes!

---

My follow up post '[Better Redux Reducers with TypeScript Builders](https://blog.scottlogic.com/2020/10/01/reducer-builder.html)' is now live.
It demonstrates how to use the builder pattern we saw in this post to create Redux Reducers.
If you want a more realistic example of where builders can help in your TypeScript projects, go check it out!