---
title: Dynamically Skipping Tests within Jest
date: 2023-09-14 00:00:00 Z
categories:
  - Testing
  - Tech
tags:
  - testing
  - jest
summary: In this blog post I will walk you through how to set up a Jest custom environment in order to dynamically skip tests after they have been queued.
author: osouthwell
---

In this blog post I will walk you through how to set up a Jest custom environment in order to dynamically skip tests after they have been queued.

In [Jest](https://jestjs.io/docs), while you can skip tests in code, there isn't a straightforward way to decide not to run tests once they are queued. This becomes problematic when you need to stop running tests based on dynamic properties. This is an issue specifically when running numerous tests calling APIs with unknown costs beforehand. I will address this problem by creating a custom environment and binding to a [Jest Circus](https://github.com/jestjs/jest/blob/main/packages/jest-circus) event.

### Naive solution

One Solution that could be implemented, is to add a check for the conditions we care about to the test itself. For example, if we care about budget we can add `expect(budget).toBeLessThan(currentCost)` the start of each test. This works as Jest treats a fail as an exception so will not run the expensive api once a check has failed. The downside is that this causes all our tests to fail which could cause issues with some CI pipelines and obscure actual failures.

It is worth noting that, the Mocha framework has a solution of out of the box [out of the box](https://mochajs.org/#inclusive-tests) but our focus here will be on Jest.

### What is a custom environment?

A Jest [custom environment](https://jestjs.io/docs/configuration#testenvironment-string) provides a flexible means to simulate different runtime environments for your tests. Essentially, an environment in Jest defines the context in which your code operates during testing. This context encompasses various factors, including the availability of specific APIs, global variables, and behaviours that are typically associated with browsers. By crafting custom environments, developers can replicate real-world scenarios more accurately, ensuring comprehensive testing under diverse conditions. The custom environment class may optionally expose an asynchronous `handleTestEvent()` method to bind to events fired by Jest Circus, which is Jest's default test runner.

### Crafting a custom environment

Creating a custom Jest environment is not overly complex. By default, Jest includes two environments: Node and [JSDom](https://github.com/jsdom/jsdom), with Node being the default choice. These environments are implemented as classes and can be extended and modified to suit your testing requirements. Within the constructor of your custom environment, you can define global variables or functions that will be available to your test suite. The custom environment is set up uniquely for each test suite, so there's no need to be concerned about variable conflicts.

Within the constructor is where we can define our global variables. These variables are then available to our test suite. For now we will define a simple function `skipIf()` that accepts a function then add it to a list conditions to use later.

~~~javascript
const NodeEnvironment = require('jest-environment-node');

const { TestEnvironment } = NodeEnvironment;

class CustomEnvironment extends TestEnvironment {
    constructor(config, context) {
        super(config, context);

        this.skipIfConditions = [];

        this.global.skipIf = (condition) => this.skipIfConditions.push(condition);
    }

    //...
}

module.exports = CustomEnvironment;
~~~

Now that we've defined our global function, `skipIf()`, we can access it within our test suite and pass in conditional functions. This setup allows us to pass any number of functions, making it versatile for various scenarios. For instance, in this example we use `skipIf()` to skip tests once our budget has been exceeded. This example is very simple but could easily be adjusted to accept complex conditions, such as not running test if an API is offline, as well. Importantly, variables local to your test suite remain fully accessible and updated to your `skipIf()` function.

~~~javascript
let totalCost = 0;
const testBudget = 2;
const expensiveAPI = () => 1;

skipIf(() => totalCost > testBudget);

it(`Test No 1`, () => {
    totalCost += expensiveAPI();
});
it(`Test No 2`, () => {
    totalCost += expensiveAPI();
});
it(`Test No 3`, () => {
    totalCost += expensiveAPI();
});
it(`Test No 4`, () => {
    totalCost += expensiveAPI();
});
~~~

Next, we'll bind to an event fired by Jest Circus. A list of available events can be found in Jest's  [type folder](https://github.com/jestjs/jest/blob/be7e797bd6d1ef3476f1d9a15fb50fd03527bd19/packages/jest-types/src/Circus.ts#L86C7-L86C7). The core idea is to evaluate whether any of the functions passed to our `skipIf()` function return true. If any condition is met, we change the test's mode to `skip`, and it will be skipped in the test runner. Again, this can easily be changed to skip on all conditions being true.

~~~javascript
class CustomEnvironment extends TestEnvironment {
    //...

    async handleTestEvent(event) {
        if (event.name === 'test_start' && this.skipIfConditions.some((condition) => condition())) {
            event.test.mode = 'skip';
        }
    }
}
~~~

Lastly, we need to instruct Jest to use our custom environment. This is achieved by setting the `testEnvironment` property to the file path in the Jest config file. Once this step is completed, all that's left to do is pass in conditional functions into our global `skipIf()` function within our test suite. Our custom environment will then assess these conditions just before each test is run and run the test only if all conditions return true.

~~~javascript
module.exports = {
    // Other Jest configuration options...

    testEnvironment: './environment/CustomEnvironment.js'
};
~~~

### Warning about mutating event data

A disclaimer, this is specifically warned against in Jest Circus documentation. "Mutating event or state data is currently unsupported and may cause unexpected behavior or break in a future release without warning". For this reason, it is crucial to be careful whenever updating to a newer version of Jest. It's wise to thoroughly test and validate your custom environment setup to ensure it behaves as expected.

While Jest is well documented from a user point of view, we are really off the beaten track when altering Jest packages and resources. Jest Circus provides the basics for event binding but it lacks examples of why you would want to or what is possible.

### Conclusion

In conclusion, Jest is a powerful and highly modular tool for JavaScript testing, and with creative solutions like custom environments, you can tailor it to meet your specific testing needs. We have shown, using a custom environment, how to dynamically skip tests within Jest . By dynamically skipping tests, you can prevent unnecessary runs of expensive or time-consuming tests, and you can also ensure that your tests are only run when the conditions are met.
