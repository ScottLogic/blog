---
title: RxJS Unit Testing
date: 2023-02-11 07:16:00 Z
tags:
- RxJS
- Unit Testing
summary: 'An RxJS unbeliever explores the testing tools built into the library and
  is pleasantly surprised. '
author: jbickleywallace
---

I'm newish to [RxJS](https://rxjs.dev/) and Reactive programming and so far haven't been impressed.
While, sometimes, it can solve problems elegantly, the times I've seen it deployed in JavaScript projects,
it's made things over complicated and opaque.
How can any library with an API surface so large that it needs a
[decision tree](https://rxjs.dev/operator-decision-tree)
be anything but?
In particular the unit testing story of RxJS concerned me; even some advocates of using the library in my projects tell me it's hard to do.
But the library authors themselves claim it is unit testable.

Given that it has a strong base of support though, and that I see it more and more often on both the front and back end of projects,
I wondered if, by dipping my toe in the water, I might change my mind?

I thought I'd tackle unit testing first,
I find unit tests to be a great way to explore and learn the features of a library
and in this post I'll introduce the basic tool set included in the main package.
I also wanted to see how those tools fair when they encounter more realistic, complex, cases than are found in the documentation,
so we'll take it a step further and test something more gnarly.

Without giving too much away, I was pleasantly surprised.

## Housekeeping

There's loads of great content out there introducing RxJS, so I'm not going to reinvent the wheel here.
Instead I recommend that if you're new to Reactive programming or RxJS head on over to their
[getting started page](https://rxjs.dev/guide/overview)
where you'll get a good overview.

I'm also going to use [Jest](https://jestjs.io/) to drive my tests, but, the concepts laid out here should apply equally in your framework of choice.
If you need an intro to Jest then again their [getting started page](https://jestjs.io/docs/getting-started) is a great place to start.

Everything here is written in [TypeScript](https://www.typescriptlang.org/),
I don't think i've used anything too out there though so hopefully it will still be clear if your only familiar with JavaScript.

If you would like to see the full listings from my investigation then you can find them on [github](https://github.com/jaybeeuu/rxjs-unit-testing).

## The tools

Lets have a look at the tools that RxJS exposes for unit testing. I'm going to stay lightish on this.
It's a big topic and the interesting thing will be seeing this applied to a more complex case,
but I do also want to introduce the main topics for RX testing.
So bear with me.

The first topic to cover is the
[`TestScheduler`](https://rxjs.dev/api/testing/TestScheduler)
.

RxJS, at it's heart is a way to interact with and respond (or... if you will..._react_) to asynchronous events.
From a unit testing stand point that's a problem.
Asynchrony often means time delays, which means slow tests.
But it's also hard to document and visualise sequences of events in code,
in a way that remains terse and expressive.
Enter the `TestScheduler`.

Rx operators take a
[`SchedulerLike`](https://rxjs.dev/api/index/interface/SchedulerLike)
argument which they will use to schedule their emissions and tasks.
Usually, by default they use the
[`asyncScheduler`](https://rxjs.dev/api/index/const/asyncScheduler`)
which puts an operators tasks on the event loop, so they happen asynchronously.
The `TestScheduler` by contrast runs tasks synchronously, and in a similar manner to jest's
[Timer Mocks](https://jestjs.io/docs/timer-mocks)
, in "virtual time".

The virtual time bit of that is important to understand.
Rather than using the systems clock and to schedule tasks the `TestScheduler` is maintaining an ordered list of tasks to run,
with a "time frame" associated with each one.
Hopefully this will become clearer later...

For now, let's look at how to use one.
First we new it up, passing in a function we want it to use to make equality assertions.
This let's us customise it per test framework,
passing a function it will use to make assertions.
I'm going to package that up in a function so I don't have to repeat it for every test:

~~~ts
import { TestScheduler } from "rxjs/testing";

export const makeScheduler = (): TestScheduler => new TestScheduler((actual, expected) => {
  expect(actual).toStrictEqual(expected);
});
~~~

The main method we're going to be interested on in the `TestScheduler` instance is
[`run`](https://rxjs.dev/api/testing/TestScheduler#run)
.
That is where the body of our test will be, and gives us some tools for building the tests.

## The Simple Case

Here's a simple test case so we have something to talk about.

~~~ts
describe("delay", () => {
  it("delays each emission.", () => {
    makeScheduler().run(({ cold, expectObservable }) => {
      const source = cold("1-2-3|");
      const expected = "   300ms 1-2-(3|)";
      expectObservable(source.pipe(
        delay(300)
      )).toBe(expected);
    });
  });
});
~~~

So skipping the Jest `describe` and `it`,
line 3 makes the scheduler (using the function I showed before), then calls `run`.
The callback I'm passing into `run` contains the body of the test,
and you can see that I'm destructuring some properties from the
[`RunHelpers`](https://rxjs.dev/api/testing/RunHelpers#runhelpers)
argument I'm passed.
[`cold`](https://rxjs.dev/api/testing/TestScheduler#createcoldobservable)
and
[`expectObservable`](https://rxjs.dev/api/testing/TestScheduler#expectobservable)
.

`cold` lets me create a cold observable (as opposed to a
[`hot` observable](https://benlesh.medium.com/hot-vs-cold-observables-f8094ed53339)
) using marble syntax, that's what you see on line 4: `"1-2-3|"`.
(Often [documentation](https://rxmarbles.com/)) for RxJS appears to revolve around marble diagrams
and studies show no Rxer can go more than 4 minutes without drawing drawing one.)
This is a DSL (Domain specific language) which let's us concisely describe the behaviour of the observable.
Each character is meaningful.
In this case, it will in sequence:

1. `1` - emit the string value `"1"`
2. "-" - wait a frame (by default 1 frame === 1ms)
3. `2` - emit the string value `"2"`
4. `-` - wait a frame
5. `3` - emit the string value `"3"`
6. `|` - complete.

RxJS have a
[full listing of the syntax](https://rxjs.dev/guide/testing/marble-testing#marble-syntax)
on their website so I won't repeat it here.

I actually think this is pretty cool.
It let's us have fine grained control over when in (virtual) time the emissions occur, and is also used in the assertions. That's Line 5:

1. `` - white space (which is ignored) to align the diagrams
2. `300ms` - Wait 300 milliseconds (In virtual time - Jest tells me this test only takes a few milliseconds to run).
3. `1` - emit the string value `"1"`
4. "-" - wait a frame
5. `2` - emit the string value `"2"`
6. `-` - wait a frame
7. `3` - emit the string value `"3"`
8. `|` - complete.

Line 6; I'm defining the pipeline I want to test. In this case, there's a single operator -
[`delay`](https://rxjs.dev/api/operators/delay)
.
I've inlined that into my call to `expectObservable` and then called `.toBe`, which takes my expected Marble diagram, and performs the equality assertion that I passed as a callback into the `TestScheduler`.
And we're done.

Easy.
Too easy?
When I first saw this I wondered if it wasn't a bit gimmicky.
It seems like it might be too simple to scale to more complex scenarios.
But apparently the Rx team use this internally to test all of the 300,000 operators in the library
and eventually decided to officially support it.
A bit of archeology indicates that it was added in what became
[version 5](https://github.com/ReactiveX/rxjs/commit/b23daf14769d1efc2f27901fed27d334a465153d)
.

The marble diagrams look a bit limited,
only allowing the emissions to be single character strings,
but the methods and functions accepting them also accept a second argument,
letting you map to more complex objects... promising.

## Getting more complex

To test something more realistic... we first need something more realistic.
I decided to use the
[alphabet-invasion-game](https://www.learnrxjs.io/learn-rxjs/recipes/alphabet-invasion-game)
(
props to
[adamlubek](https://github.com/adamlubek)
) as the base for my more complex case.

It's a space invaders style game, with letters marching down from the top of the screen.
To clear them, you type the letter on the lowest row.
Here's a gif of my embarrassingly bad touch typing:

![alphabet-invasion.gif](/uploads/alphabet-invasion.gif)

I've refactored it a bit to make it unit testable
and to avoid some of the more obscure syntax the author favoured (TIL - the
[comma operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator)
)
but I've only done so minimally.
Part of the point of this exercise is to discover if the tools are flexible enough that we can use them to build tests for legacy code.
Also... I don't want to break the game!
Getting the thing under test before I make more dramatic refactors is much safer.

I'm not going to describe the implementation here
(this post is already long enough)
but you can see the full listings of my refactor on
[github](https://github.com/jaybeeuu/rxjs-unit-testing/blob/main/src/alphabet-invasion/alphabet-invasion.ts)
if you are interested.
Instead, I'd like to show you the interfaces, and describe the behaviour we're testing - that's really all we need for this purpose.

Here they are:

~~~ts
export interface Letter {
  letter: string;
  xPos: number;
}

export interface State {
  score: number;
  letters: Letter[];
  level: number;
}

export interface GameOptions {
  levelChangeThreshold: number;
  speedAdjust: number;
  endThreshold: number;
  gameWidth: number;
}

export const makeGame$ = (
  options: GameOptions
): Observable<State>;
~~~

`makeGame$` is what we will test.
This is the function which creates the observable of game state.
We'll be testing how the `State` changes over time, as a result of our input streams.
Here's how the state should evolve:

* Every 600ms the game inserts a letter at the top of the game field, pushing the other letters down.
  * The letter is randomly positioned withing it's row.
* When the player types a key, if it matches the letter lowest in the field,
  * the player gains a point
  * that letter is removed.
* When the player's points are a multiple of `levelChangeThreshold`
  * the player gains a point
  * the `level` increases by one
  * the interval decreases by `speedAdjust`
* If there are `endThreshold` letters in the game, the game ends.

Along the way the implementation makes use of a host of operators, which we don't need to worry about for the test, but there's also some hidden dependencies.
(I really did only minimally refactor this to separate out the render logic from the state logic.)
They are:

* [`fromEvent`](https://rxjs.dev/api/index/function/fromEvent) - Creates an observable of events.
This is how the game listens to keystrokes.
* [`interval`](https://rxjs.dev/api/index/function/interval) - Makes an observable which emits at the defined intervals. This is used for the game clock.
* [`randomInt`](https://github.com/jaybeeuu/rxjs-unit-testing/blob/main/src/alphabet-invasion/random.ts#L13) - Generates a random integer between two values.
* [`randomLetter`](https://github.com/jaybeeuu/rxjs-unit-testing/blob/main/src/alphabet-invasion/random.ts#L23) - Generates a random lower case letter.

To test the game engine we'll need to control the events emitted by `fromEvent` and `interval`,
and, to make them deterministic, we'll mock the output from `randomInt` and `randomLetter`.

Lol. having described it like that it seems like this complex case is going to be simple after all....

~~~ts
it("remove the last letter when the matching key is pressed.", () => {
  makeScheduler().run(({
    cold,
    expectObservable
  }) => {
    jest.mocked(interval).mockImplementation(
      (delay) => cold(`${delay}ms 1`)
    );
    setupRandomLetters("a");
    setupRandomInts(1);
    jest.mocked(fromEvent).mockReturnValue(
      cold("800ms a", { a: new KeyboardEvent("keydown", { key: "a" }) })
    );

    expectObservable(makeGame$(makeGameOptions())).toBe(
      "600ms a 199ms b",
      {
        a: { letters: [
          { letter: "a", xPos: 1 }
        ], score: 0, level: 1 },
        b: { letters: [], score: 1, level: 1 }
      }
    );
  });
});
~~~

Yeah, that wasn't too bad.
First we get into the context of the test scheduler, with a call to `run`. the next 4 statements are setup code.

We're mocking `interval`, when it gets called we'll return a cold observable which emits with a delay according to the delay passed in.
This is a bit awkward, but hopefully its clear why; the code wasn't written with testing in  mind so it has control of the delay
(feels like a good place to refactor once we have the code under test)
.

The next two calls,
[`setupRandomLetters`](https://github.com/jaybeeuu/rxjs-unit-testing/blob/main/src/alphabet-invasion/alphabet-invasion.spec.ts#L35)
and
[`setupRandomInts`](https://github.com/jaybeeuu/rxjs-unit-testing/blob/main/src/alphabet-invasion/alphabet-invasion.spec.ts#L35)
are simple mocks, I've linked their implementations in case you are curious, but I don't think they are interesting to our discussion here.

The only thing that's interesting is that the `randomLetter` function is going to return `a` when it is called.

The next mock setup, `jest.mocked(fromEvent).mockReturnValue`, defines the keys the "player" "presses" during the test - 800ms in they press `a`.
You can see in there the marble diagram only mentions the letter `a`, but we're passing the second argument to `cold` which tells it what `a` maps too - a `new KeyboardEvent`.
It's the event that will be emitted on the stream not the letter.

That's all the setup we need.

Next, we make the observable, with the `makeGame$` call.
(
  [`makeGameOptions`](https://github.com/jaybeeuu/rxjs-unit-testing/blob/main/src/alphabet-invasion/alphabet-invasion.spec.ts#L25)
  is a helper which ... makes the game options.
  None of them have any bearing on this test case so using this to get sensible defaults keeps the test code terse.
)

In the `toBe` assertion we set out our expectations.
Roughly the marble diagram translates to:

> After 600ms, emit state a, 200ms later emit state b

Where, the states are present in the second argument to `toBe`.
The first state has the letter `a` appear on the screen, that's from the interval ticking and calling `randomLetter`.
Then the player hit's the `a` key and the letter is removed.

The only niggle I have is why I'm not getting to put `200ms` - why `199ms`?
Looking back at the docs, there's a note in the
[time progression syntax](https://rxjs.dev/guide/testing/marble-testing#time-progression-syntax)
section.

> NOTE: You may have to subtract 1 millisecond from the time you want to progress because the alphanumeric marbles
> (representing an actual emitted value)
> advance time 1 virtual frame themselves already, after they emit.

By default 1 frame is 1ms.
So here's my understanding of the sequence we're describing with `600ms a 199ms b`:

* Progress `600ms`
* Emit `a`, then advance 1ms (now we're at 601ms)
* Progress `199ms` (now we're at 800ms)
* Emit `b`

No more niggle.
Too Easy.

## Wrapping up

I said in the opening of this post that I don't like RxJS.
Well... the test tools included in the library, at least, have won my heart.
I think the marble syntax is expressive and elegant.
Having given it a fair shake with a more complicated case I think I can see how it would extend to production cases and standup well to the rigours of real life.
As with anything there will be a point where the pattern breaks down or where the complications mount but it looks to me like that would be far enough into the weeds not to matter for most cases.
