---
title: Optimizing Test Suite Metrics Logging in Jest Using `metricsCollector`
date: 2023-09-19 12:00:00 Z
categories:
  - Testing
  - Tech
tags:
  - testing
  - jest
summary: Discover how to streamline metrics collection in Jest test suites using a centralized 'metricsCollector' utility, simplifying test maintenance and enhancing data-driven testing practices.
author: gsingh
---

When striving for robust code quality, efficient testing is non-negotiable. Logging metrics from your test suite can provide valuable insights into the performance and reliability of your codebase. In this blog post, we'll explore a resourceful method to log metrics effectively in Jest test suites using the `metricsCollector` module. This approach not only keeps your codebase clean and efficient but also allows you to seamlessly incorporate metrics recording into your testing process.

## The Hypothesis

Let's set the stage with a hypothetical scenario: You're developing an application that relies on an API. This API call, while essential for your application, is notorious for its carbon footprint. It returns a value containing the amount of CO2 emitted during the call. With an eco-conscious mindset, you're eager to quantify the environmental impact of your software testing. Your goal is to measure the total CO2 emissions during your test runs, not just to validate your code.

## The Naive Approach

Before we delve into the solution, consider the naive approach.
Here's an example of a test file (co2EmissionsNaive.test.js) using the naive approach without the metricsCollector module. This example demonstrates what the code might look like when metrics logging is managed manually inside a test suite:

```javascript
//co2EmissionNaive.test.js

const environmentallyUnfriendlyAPI = require("../test-utils/mocks/apiMock"); // This is our function to call the APIs
const co2Metrics = require("../test-utils/metrics/calculateCO2Metrics"); // This is our function which has all our calculations for the CO2 emisions.

describe("Testing the API Calls - Naive Approach", () => {
  let suiteMetrics = [];
  let singleCO2Emissions = 0;

  afterAll(() => {
    const { totalCO2Emissions, meanCO2Emissions } = co2Metrics(suiteMetrics); // Returns the totalCO2Emissions and meanCO2EMissions using the suiteMetrics.
    console.log("Total CO2 emissions for the suite", totalCO2Emissions);
    console.log("Mean CO2", meanCO2Emissions);
  });

  afterEach(() => {
    const metrics = { CO2Emissions: singleCO2Emissions };

    // Pushing the metrics that we want to record
    suiteMetrics.push(metrics);
  });

  test("Test the API call with 10", async () => {
    // Make the environmentally unfriendly API call
    const result = await environmentallyUnfriendlyAPI(10);

    // Record the CO2 emissions metric
    singleCO2Emissions = result.data.CO2Emissions;

    // Ensure that the result is as expected
    expect(result.data.output).toBe(true);
  });

  test("Test the API call with 15", async () => {
    const result = await environmentallyUnfriendlyAPI(15);
    singleCO2Emissions = result.data.CO2Emissions;
    expect(result.data.output).toBe(true);
  });
});
```

When the test is run, it produces the below result

![Mean and total CO2 Emissions are logged in the console]({{site.github.url}}/gsingh/assets/./naiveResult.PNG "Mean and total CO2 Emissions are logged in the console")

If we have multiple test suites where we are using this environmentallyUnfriendlyAPI calls and want to log their CO2 Emission data, then you could copy-paste metric recording and logging code into each test file. This approach clutters your test files, making them harder to read and maintain. It's prone to inconsistencies, and calculating suite-level or overall metrics becomes a complex, error-prone task. Let's be honest; this approach is neither clean nor efficient.

## The Metrics Collector Solution

The solution lies in the metricsCollector module. This custom module streamlines metrics collection and management within your test suites, eliminating the need for repetitive code. Here's how it works:

```javascript
// metricsCollector.js

const metricsCollector = () => {
  let metrics = {}; // store a single metric
  let suiteMetrics = []; // Store suite-level metrics

  // This function is used to record the metric
  const recordMetric = (key, value) => {
    metrics[key] = value;
  };

  const clearMetrics = () => {
    metrics = {};
  };

  // This function is used to return the suite Metrics
  const getSuiteMetrics = () => {
    return suiteMetrics;
  };

  // This function is used to add a single test's metrics to the suite metrics
  const addToAllMetrics = () => {
    suiteMetrics.push(metrics);
  };

  // This function is used to console log all the suite metrics
  const logMetrics = () => {
    suiteMetrics.forEach((m) => {
      for (const key in m) {
        console.log(`Logging metrics -- ${key}: ${m[key]}`);
      }
    });
  };

  // beforeEach jest hook, here we are clearing the test level metrics before running the next test
  beforeEach(async () => {
    clearMetrics();
  });

  // afterEach jest hook, here we are adding a single test's metrics to the suite level before running the next test.
  afterEach(async () => {
    addToAllMetrics();
  });

  // Here we are exposing all the functions that we think can be used in the test suites to use the suite metrics.
  return { recordMetric, logMetrics, getSuiteMetrics };
};

module.exports = metricsCollector;
```

In this solution:

- metricsCollector initializes metric storage.
- Metrics are recorded at both the test case and suite levels.
- It simplifies logging and provides flexibility in calculating suite-level metrics.
- If we want to include more functions in our metricsCollector module around suiteMetrics, we can have those and then can use those functions in our test suites.

## Integration into Test Suites

Now, let's see how you use it in your sample test suite, co2EmissionModule.test.js:

```javascript
// co2EmissionModule.test.js

const environmentallyUnfriendlyAPI = require("../test-utils/mocks/apiMock");
const co2Metrics = require("../test-utils/metrics/calculateCO2Metrics");
const metricsCollectorModule = require("../test-utils/metricsCollector");

const { recordMetric, getSuiteMetrics, logMetrics } = metricsCollectorModule(); // This will return the functions e.g. recordMetric, getSuiteMetrics

describe("Testing the API Calls - Naive Approach", () => {
  afterAll(async () => {
    const suiteMetrics = getSuiteMetrics(); // Returns all the metrics collected for this test suite.
    const { totalCO2Emissions, meanCO2Emissions } = co2Metrics(suiteMetrics); // Returns the totalCO2Emissions and meanCO2EMissions using the suiteMetrics.
    console.log("Total CO2 emissions for the suite", totalCO2Emissions);
    console.log("Mean CO2", meanCO2Emissions);
  });

  test("Test the API call with 10", async () => {
    // Make the environmentally unfriendly API call
    const result = await environmentallyUnfriendlyAPI(10);

    // Record the CO2 emissions metric
    recordMetric("CO2Emissions", result.data.CO2Emissions);

    // Ensure that the result is as expected
    expect(result.data.output).toBe(true);
  });

  // ... (similar tests follow)
});
```

#### _Test results_

When the test is run, it produces the below result

![Mean and total CO2 Emissions are logged in the console]({{site.github.url}}/gsingh/assets/moduleResult.PNG "Mean and total CO2 Emissions are logged in the console")

By using this modularised approach, if we want to use 'logMetrics' function in another test suite, we can just plug it in our afterAll hook and it will work as the following.

```javascript
//co2EmissionModule.test.js

// previous import statements

const { logMetrics } = metricsCollectorModule(); // This will return the functions e.g. recordMetric, getSuiteMetrics, logMetrics

describe("Testing the API Calls - Naive Approach", () => {
  afterAll(async () => {
    logMetrics(); // Plugging logMetrics
  });

  test("Test the API call with 10", async () => {
    // Make the environmentally unfriendly API call
    const result = await environmentallyUnfriendlyAPI(20);

    // Record the CO2 emissions metric
    recordMetric("CO2Emissions", result.data.CO2Emissions);

    // Ensure that the result is as expected
    expect(result.data.output).toBe(true);
  });

  // ... (similar tests follow)
});
```

When the test is run, it produces the below result

![Metrics are logged]({{site.github.url}}/gsingh/assets/moduleLogMetrics.PNG "Metrics are logged")

## The Results and Conclusion

In this blog post, we've tackled the challenge of tracking environmental impact in your Jest test suites. We started with a scenario where an environmentally unfriendly API call produces CO2 emissions. We contrasted a naive approach, which involves repetitive metric tracking in each test file, with a more streamlined approach using the metricsCollector.

By centralizing metrics tracking, you can keep your test files clean and maintainable, while also gaining the flexibility to log metrics at different levels. With our metricsCollector module seamlessly integrated, running our test suite yields insightful metrics logging without cluttering the test code itself. The common module approach centralizes metrics management, promoting clean and focused tests.

In conclusion, our hypothesis was successfully tested and validated. By leveraging the metricsCollector module, we achieved a streamlined and organised way to log metrics during Jest test executions. This method enhances the maintainability and readability of our test suite, enabling us to focus on what matters most: writing high-quality, well-tested code.

_Note: This blog post provides a high-level overview of logging metrics in Jest test suites. For more advanced use cases and in-depth analysis, you can extend the metrics collector and data processing logic to suit your specific needs_.
