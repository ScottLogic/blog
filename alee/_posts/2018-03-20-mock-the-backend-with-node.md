---
author: alee
title: Mock the Back-End with Node
tags: JavaScript
categories:
  - Tech
summary: >-
  Mock the back-end of your web application, using Node.js, to make developing and testing the front-end easier.
layout: default_post
---

*Mock the back-end of your web application, using Node.js, to make developing and testing the front-end easier.*

Recently, I've worked on a couple of front-end projects where the back-end doesn't actually exist (yet). No problem, of course - assuming the API is reasonably well defined (i.e. not likely to change much), then we can quickly build a simple mock back-end and start building the UI against that. When the time comes to make the real back-end available, it should be a simple task to swap it over.

### Not just throw-away code

We don't want to spend time building software only to throw it away again a short time later. Fortunately there are a number of other advantages to having a simple mock of the back-end.

- Developers don't need to install and maintain everything needed to run the real back-end (e.g. .Net/Java development environment, databases etc).
- Developers can work on new features where API support is not ready.
- Developers can tweak the API responses to develop less-used behaviour (error handling or restricted users).

### Testing

End-to-end tests with a mock of the back-end (ok, so not quite end-to-end), can be much more focused than fully end-to-end tests. A real back-end's responses change based on pre-existing state (e.g. changes in the database), but the mock can always respond the way the test expects. The tests should know exactly what is displayed on screen and what actions can be taken. They should be much less brittle, and require less maintenance.

If the testing framework can start and control the mock back-end, then it can also precisely control responses from the API, and verify that the API gets invoked with the correct parameters and payload.

Of course, this doesn't eliminate the need for fully integrated end-to-end tests, but it can be a good way to create a more complete set of tests for the front-end.

### Example project

I've created a suitably contrived project as a demonstration, which is intended to be as simple as possible while showing the capabilities.
It is a web application that lets users do simple calculations, maintaining the current value as state to use as part of the next calculation. Hence, the server has persistent state that could cause end-to-end tests to interfere with each other.

The full project is [Mock-Api-Blog on GitHub](https://github.com/DevAndyLee/mock-api-blog), so please refer to that for the full code sample. The ReadMe also explains how to run the application and example tests. In this blog I'll try to pull out interesting snippets to keep things simple.

### A Node.js mock server

I wanted to make it nice and easy to add API-like modules, so I've created a simple pattern where each module exports its root `path` (under `/api/`), and an Express `Router` that implements all the API methods (`GET` and `POST` etc).

{% highlight js %}
export const path = '/operators';
export const router = express.Router();

router.get('', (req, res) => {
  // GET /api/operators
  send(req, res, { operators: Object.keys(maths) });
});
{% endhighlight %}

Handling POST requests and parameters is also easy

{% highlight js %}
router.post('/:id', (req, res) => {
  // POST /api/operators/{id} with { operator parameter in body }
  const { id } = req.params;
  const { operator } = req.body;
  // ...
});
{% endhighlight %}

Next, we can wrap all the API modules up together in an `API` router

{% highlight js %}
import * as operators from './routes/operators';
import * as domaths from './routes/do-maths';
const routes = [operators, domaths];

// Add the route for each API
routes.map(route => {
  this.router.use(route.path, route.router);
});

this.router.use('/*', (req, res) => {
  // Fallback if none of the APIs match
  res.status(404).send('Not Found');
});
{% endhighlight %}

Finally, we need to pull the `API` router into the Node Express server, under the path `/api/`. I'm using a simple proxy function here, which will make it easy to replace all the APIs with new ones at the beginning of each test, without having to stop and restart the server. This will help to avoid any state interactions between tests. In the code example below, `globalApi` is replaced by a new instance of the `API` router whenever a `new Api()` is created.

{% highlight js %}
// Setup the API mocks
app.use('/api', (...args) => {
  // This allows us to easily reset the /api routes without restarting
  if (globalApi.router) {
    globalApi.router(...args);
  }
});
{% endhighlight %}

### The tests

When I bundled the APIs together, I wrapped them in an `Api` class, so that whenever a `new Api()` is created, it effectively resets all the back-end state. This is crucial to the testing, because we want each test to get a "clean" version of the back-end, and not depend on which other tests have run first.

While the tests can make use of the default mock APIs, we also want to be able to override specific URLs with behaviour that is custom for that test. The `Api` class does this too. In my test setup I can do something like this:

{% highlight js %}
// Spy on the POST request
let postStub = sinon.spy((req, res) => send(req, res, { value: 13 }));

beforeEach(async () => {
  // Reset the API and override the GET and POST for the /api/domaths endpoint
  new Api()
    .get('/domaths', (req, res) => send(req, res, { value: 10 }))
    .post('/domaths', postStub)
    .start();

  await loadPage('', By.css('.App-maths'));
});
{% endhighlight %}

As you can see the override for the GET request will always return `{ value: 13 }` for these tests, so the test can verify that the correct information is displayed.
The override for the POST request uses a spy, so that at the end of the test we can verify that POST was indeed called, and with the correct parameters.

{% highlight js %}
// Initial value should be displayed
expect(await getElementText(By.css('.App-value'))).toBe('13');

// Input a number and submit
await setInputValue(By.css('.App-input'), '3');
clickElement(By.css('.App-submit'));
await driver.wait(until.elementLocated(By.css('.App-maths.calculated')));

// Verify the correct information was in the POST request
expect(postStub.called).toBe(true);
const postBody = postStub.firstCall.args[0].body;
expect(postBody.operator).toBe('+');
expect(postBody.input).toBe('3');
{% endhighlight %}

Lastly, we can also get the API to throw errors to test the error handling in the front-end:

{% highlight js %}
beforeEach(async () => {
  new Api()
    .post('/domaths', (req, res) => error(req, res, 500, 'My Test Error'))
    .start();

  await loadPage('', By.css('.App-maths'));
});
{% endhighlight %}

### Summary

This simple mocking setup makes life easier for front-end developers. No need to wait for the real API to be ready, and no need to spend time installing and setting up all the tools necessary to run the real back end. It allows for some very specific front-end testing, without any of the usual problems associated with changing state. You'll still want to create some end-to-end tests that leverage the real back end and test integration, but this can take the pressure off some of the more complicated UI behaviour.