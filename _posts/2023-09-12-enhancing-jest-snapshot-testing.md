---
title: Enhancing Jest snapshot testing to performance test your application
date: 2023-09-12 15:00:00 Z
categories:
- Testing
- Tech
tags:
- featured
- testing
- jest
summary: Jest is a JavaScript unit testing framework that is popular amongst developers wanting to ensure code correctness. Jest is not typically used for tasks like performance testing, but offers some useful features in snapshot testing that can be enhanced to carry out such tasks.
author: klau
image: uploads/Enhancing%20Jest%20Snapshot.png
---

## How to customize Jest snapshot testing to performance test your application

_Jest_ is a [widely used](https://2022.stateofjs.com/en-US/libraries/testing/) JavaScript unit testing tool that is well-maintained and popular with developers, due to its ease of use and [active community](https://raygun.com/blog/javascript-unit-testing-frameworks/). One of _Jest_'s unique features is snapshot testing, which can be an excellent tool for writing a large number of tests for pre-existing/legacy codebase with minimum effort.

_Jest_ [Snapshot testing](https://jestjs.io/docs/snapshot-testing) captures the current state of an application and tests against that truth to detect bugs & regression. Traditionally, a developer would write a snapshot test to compare the output of an interface or a screenshot of a rendered webpage/UI component to a previously saved snapshot; if there are any differences a bug might be present, or there has been an expected code change for which old snapshots must be updated.

A basic example-based snapshot test of an array sorting algorithm might look like this:

~~~javascript
test('Assert algorithm returns correct answer', async () => {
    const input = ['a', 'c', 'b'];
    const expected = ['a', 'b', 'c'];
    const actual = await someSortingAlgorithm(input);
    const snapshot = {
        actual
    };
    expect(actual).toEqual(expected);
    expect(snapshot).toMatchSnapshot();
});
~~~

Now, let's say in addition to asserting the actual output matches the expected, we would also like to analyse the performance of the task under test over time i.e. keeping a history of how long it take to respond and build assertions against this value (i.e. we know that response time should be close to previous recorded value, or we might have a SLA requirement for the algorithm to respond in under 1 second). This kind of testing is called [**property-based testing**](https://fsharpforfunandprofit.com/posts/property-based-testing/), which tests against a characteristic or transformation of the output, instead of testing against the output value directly (as in traditional **example-based testing**). Property-based testing is specifically useful when testing functions where a large number of inputs are required to explore all possible code paths, without the need to write many example-based tests to cover that range. Properties can be any characteristic or measurable trait that tells you something valuable about the output. Some other examples of output properties are:

-   output type (string, int, bool etc)
-   output correctness/accuracy
-   output's computation speed/performance
-   output matching specific regex
-   output within numerical range
-   position of the first occurrence of a character in output

Traditional property-based testing goes one step further by allowing the developer to generalise inputs i.e. defining a range of valid inputs, which will be fully controlled by the test, in order to iterate through all possibilities and randomize, however we won't require such exhaustive testing for now and will stick with our example-based tests, and bolster these by adding property-based assertions.

We can add timers around the function call to determine performance, and attach the result to the snapshot:

~~~javascript
test('Assert algorithm returns correct answer and is performant', async () => {
    const input = ['a', 'c', 'b'];
    const expected = ['a', 'b', 'c'];

    const start = Date.now();
    const actual = await someSortingAlgorithm(input);
    const elapsed = Date.now() - start;

    const snapshot = {
        actual,
        runtime: elapsed
    };
    expect(actual).toEqual(expected);
    expect(snapshot).toMatchSnapshot();
});
~~~

We have now introduced some non-deterministic behaviour; since the `runtime` value is not guaranteed to stay consistent, the test may fail sporadically. Snapshot testing usually relies on the fact that the task under test is completely deterministic in behaviour i.e. if we repeat the task with the same inputs, we expect to get the same outputs consistently. Any non-deterministic behaviour in unit tests is usually considered an anti-pattern for [various reasons](https://martinfowler.com/articles/nonDeterminism.html). Developers usually seek to eradicate any non-determinism in unit tests, but in some cases this might not be the [correct approach](https://hitchdev.com/hitchstory/approach/testing-nondeterministic-code/).

### Out-of-the-box Jest features

_Jest_ Snapshot testing provides some mechanisms out-of-the-box to handle non-deterministic behaviour in code in the form of [_property matchers_](https://jestjs.io/docs/snapshot-testing#property-matchers). Snapshot property matchers can be defined for any field inside the snapshot, and will be evaluated **before** the snapshot is tested against or written.
In our scenario we could define a property matcher for the `runtime` value which asserts that the received value is a `Number`.

~~~javascript
test('Assert algorithm returns correct answer and is performant', async () => {
    const input = ['a', 'c', 'b'];
    const expected = ['a', 'b', 'c'];

    const start = Date.now();
    const actual = await someSortingAlgorithm(input);
    const elapsed = Date.now() - start;

    const snapshot = {
        actual,
        runtime: elapsed
    };
    expect(actual).toEqual(expected);
    expect(snapshot).toMatchSnapshot({
        runtime: expect.any(Number)
    });
});
~~~

The resulting snapshot when executing this test would look like so:

~~~
exports[`Assert algorithm returns correct answer and is performant 1`] = `
{
  "actual": [
    "a",
    "b",
    "c"
  ],
  "runtime": Any<Number>,
}
`;
~~~

Although our test is now guaranteed to pass, _Jest_'s current capabilities present some limitations; **(a)** there is no supported way of adding additional logic to the property matcher, i.e. test that the received value is within some tolerance or range; the only supported property matcher to use in snapshot testing is the `Any<Type>` [matcher](https://jestjs.io/docs/expect#expectanyconstructor). Additionally, **(b)** since the property matcher's implementation is written to the snapshot instead of the actual value, we won't be able to refer to the property's actual value or keep track of it.
This blog post will detail how we can [customize](https://jestjs.io/docs/expect#custom-snapshot-matchers) Jest's snapshot matching mechanism to incorporate the logic we desire and suit our use-case.

### Implementing a custom snapshot matcher

We add a new file to the project for the custom matcher's implementation and begin by importing _Jest_'s `toMatchSnapshot` function. This is the same function that we used in our test previously and we will add some logic around it in our custom matcher:

~~~javascript
const { toMatchSnapshot } = require('jest-snapshot');
~~~

We can add the following function to extract the old snapshot from the `SnapshotState`:

~~~javascript
function getSnapshot(snapshotState, currentTestName, hint) {
    const key = `${currentTestName}: ${hint} 1`;
    const snapshot = snapshotState._snapshotData[key];
    if (snapshot == null) {
        return null;
    }
    return JSON.parse(snapshot);
}
~~~

And we implement the custom matcher, called `toMatchPerformanceSnapshot`, by extending _Jest_'s `expect` function:

~~~javascript
expect.extend({
    toMatchPerformanceSnapshot(received) {
        const hint = 'toMatchPerformanceSnapshot';

        const { snapshotState, currentTestName } = this;
        const oldSnapshot = getSnapshot(snapshotState, currentTestName, hint);
        const oldRuntime = oldSnapshot == null ? -1 : oldSnapshot.runtime;

        const tolerance = 0.1;
        const upperBoundary = oldRuntime * (1 + tolerance);
        const lowerBoundary = oldRuntime * (1 - tolerance);

        if (
            (received.runtime <= upperBoundary && received.runtime >= lowerBoundary) || // runtime is within tolerance bounds
            oldRuntime === -1   // no older version of snapshot present
        ) {
            return toMatchSnapshot.call(this, received, hint);
        }

        toMatchSnapshot.call(this, received, hint);
        return {
            pass: false,
            message: () =>
                `Runtime not in tolerance (${global.snapshotTolerance}): ${oldRuntime} -> ${received.runtime}`
        };
    }
});
~~~

#### Updating snapshots via SnapshotState parameter

The custom matcher above will extract the previous snapshot's `runtime` value and compare it to the new `runtime` value. If the new value is outside of the allowed range, we explictly fail the test and return a message to the developer with some information about the failure. On the other hand, if the new value is inside of the allowed range, we call _Jest_'s `toMatchSnapshot` function, which will fail consistently since the `runtime` value has changed and inform the developer to update snapshots via the `--updateSnapshot` CLI parameter.

We can automate the need to manually update snapshots by modifying Jest's Snapshot State object directly. We can emulate passing the `--updateSnapshot` CLI parameter by setting the `_updateSnapshot` [parameter](https://github.com/jestjs/jest/blob/97c41f3ffb550c742ecaae05a58b0ffbb92b7862/packages/jest-snapshot/src/State.ts) to `all`.

~~~javascript
// BEWARE here be dragons
this.snapshotState._updateSnapshot = 'all';
~~~

<span style="color:red">**Caveat:** This is an undocumented/unsupported approach and may stop working in future versions of Jest.</span>

Now, if there has been a change in performance (`runtime` value changed) that is within the tolerated fluctuation range, the matcher will write the new `runtime` value to the snapshot on disk.

Since we have taken direct control over the writing of snapshot, our implementation will supersede the `--updateSnapshot` CLI [parameter](https://jestjs.io/docs/cli#--updatesnapshot) that is traditionally used to [update obsolete snapshots](https://jestjs.io/docs/snapshot-testing#updating-snapshots).
Any changes to `runtime` that fall outside of tolerance will fail the test and a reason will be returned to the user.

#### Utilising custom snapshot matcher
To utilize the new custom snapshot matcher, we must add the following line to the project's `jest.setup.js` in order to register the custom matcher with _Jest_:

~~~javascript
const toMatchPerformanceSnapshot = require('./matchers/toMatchPerformanceSnapshot');
~~~

Now we can use the matcher in our test like so:

~~~javascript
test('Assert algorithm returns correct answer and is performant CS', async () => {
    const input = ['a', 'c', 'b'];
    const expected = ['a', 'b', 'c'];

    const start = Date.now();
    const actual = await someSortingAlgorithm(input);
    const elapsed = Date.now() - start;

    const snapshot = {
        actual,
        runtime: elapsed
    };

    expect(actual).toEqual(expected);
    expect(snapshot).toMatchPerformanceSnapshot();
});
~~~

When the test is run and our algorithm's performance has improved within tolerance, a new snapshot will automatically be registered via our custom matcher and the test will pass:

![Performance improves, snapshot updated, test passes!]({{ site.github.url }}/klau/assets/snapshot/scoreImproveN.PNG 'Performance improves, snapshot updated, test passes')

Our new snapshot will look something like this:

~~~
exports[`Assert algorithm returns correct answer and is performant CS: toMatchPerformanceSnapshot 1`] = `
{
  "actual": [
    "a",
    "b",
    "c"
  ],
  "runtime": 6,
}
`;
~~~

In case performance has regressed outside of tolerance, _Jest_ will fail the test and respond with a message:

![Performance deteriorates, test fails, message is displayed!]({{ site.github.url }}/klau/assets/snapshot/scoreDeterioratesN.PNG 'Performance deteriorates, test fails, message is displayed')

### Enhancing custom snapshot matcher to allow configuration

Note our custom matcher above uses a hard-coded threshold value and does not allow changing this without needing to modify the implementation itself. Additionally, it is currently impossible to ignore the tolerance condition and write snapshots regardless of the new performance value. This might be useful when a developer intends to make a change that have a major impact to performance (similarly to how a developer would pass the `--updateSnapshot` flag to write new snapshots due to a code change).
We can enhance our custom matcher by introducing _Global_ parameters that will control this behaviour. These are created based on defaults and can be overridden via command-line parameters and/or environment variables. Add the new parameters `snapshotTolerance` and `updateSnapshotOutsideTolerance` to the custom matcher implementation:

~~~javascript
expect.extend({
    toMatchPerformanceSnapshot(received) {
        const hint = 'toMatchPerformanceSnapshot';

        const { snapshotState, currentTestName } = this;
        const oldSnapshot = getSnapshot(snapshotState, currentTestName, hint);
        const oldRuntime = oldSnapshot == null ? -1 : oldSnapshot.runtime;

        const upperBoundary = oldRuntime * (1 + global.snapshotTolerance);
        const lowerBoundary = oldRuntime * (1 - global.snapshotTolerance);

        if (
            (received.runtime <= upperBoundary && received.runtime >= lowerBoundary) ||
            global.updateSnapshotOutsideTolerance ||
            oldRuntime === -1
        ) {
            // BEWARE here be dragons
            this.snapshotState._updateSnapshot = 'all';
            return toMatchSnapshot.call(this, received, hint);
        }

        toMatchSnapshot.call(this, received, hint);
        return {
            pass: false,
            message: () =>
                `Runtime not in tolerance (${global.snapshotTolerance}): ${oldRuntime} -> ${received.runtime}`
        };
    }
});
~~~

To set the new variables, we can use CLI parameters, or Environment Variables, or a combination of both. The following implementation demonstrates using both, with CLI parameters taking precedence over Environment Variables. Add the following statements to the top of the custom matcher implementation:

~~~javascript
function setGlobalToleranceParameters(input) {
    if (input !== undefined) {
        const tolerance = parseFloat(input);
        if (!Number.isNaN(tolerance)) {
            global.updateSnapshotOutsideTolerance = true;
            global.snapshotTolerance = tolerance;
        }
    }
}

// Default tolerance parameters
global.updateSnapshotOutsideTolerance = false;
global.snapshotTolerance = 0.1;

// Overriding via Environment variable
const envVariable = process.env.UPDATE_SNAPSHOT_OUTSIDE_TOLERANCE;
setGlobalToleranceParameters(envVariable);

// Overriding via CLI parameter
const cliParameter = process.argv.filter((x) =>
    x.startsWith('--updateSnapshotOutsideTolerance=')
)[0];
if (cliParameter !== undefined) {
    const cpValue = cliParameter.split('=')[1];
    setGlobalToleranceParameters(cpValue);
}
~~~

Let's say we have a hardware requirement that restricts the amount of memory available. A large slow-down to our algorithm's performance (outside of tolerance) is required in order to achieve the lower memory footprint. In this case, after the developer has made the code change, they would invoke the test passing the `--updateSnapshotOutsideTolerance` CLI parameter and defining a new threshold if desired.
The test is now passing, the snapshot is updated, and the new performance value recorded.

~~~shell
npm test -- --updateSnapshotOutsideTolerance=0.1
# OR
jest --updateSnapshotOutsideTolerance=0.1
~~~

The outcome of this command is:

![Performance deteriorates, snapshot updated, test passes!]({{ site.github.url }}/klau/assets/snapshot/scoreDeterioratesUpdateN.PNG 'Performance deteriorates, snapshot updated, test passes')

The resulting snapshot would look like so:

~~~
exports[`Assert algorithm returns correct answer and is performant CS: toMatchPerformanceSnapshot 1`] = `
{
  "actual": [
    "a",
    "b",
    "c"
  ],
  "runtime": 12,
}
`;
~~~
