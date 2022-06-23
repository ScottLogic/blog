---
author: shogarth
title: Evaluating Redux Saga Test Libraries
layout: default_post
tags:
  - HTML5
categories:
  - Tech
summary: If you're a fan of Redux Saga then you will have noticed the abundance of libraries to assist testing your sagas. This post takes an in-depth look into the different approaches to testing sagas, describing where five popular testing libraries fit into these approaches.
---

If you're a fan of [Redux Saga](https://github.com/redux-saga/redux-saga) then you will have noticed the abundance of libraries to assist testing your sagas. This post takes an in-depth look into the different approaches to testing sagas, describing where five popular testing libraries fit into these approaches:

* "Native" testing (i.e without a helper library)
* [redux-saga-tester](https://github.com/wix/redux-saga-tester)
* [redux-saga-test](https://github.com/stoeffel/redux-saga-test)
* [redux-saga-testing](https://github.com/antoinejaussoin/redux-saga-testing/)
* [redux-saga-test-plan](https://github.com/jfairbank/redux-saga-test-plan)
* [redux-saga-test-engine](https://github.com/DNAinfo/redux-saga-test-engine)

First, a brief introduction...

## What's a Saga?
A Redux store represents the immutable global application state. Modifications to the state are handled through a process of dispatching an action. The action is handled by a (tree of) reducer functions, which **reduce** the action and the previous state into a new state object.

This functional approach makes Redux easy to test, but it means that your reducers become limited to storing the state. How do you make an API call? In functional programming, this is considered an 'impure' side-effect due to its unpredictability, reliance on external influences and time-dependence. Side-effects have no place in a pure functional reducer.

Enter Redux Saga. A saga uses the dispatching of an action as a signal to asynchronously perform a side effect. Your Redux application becomes nicely separated: the pure state updates to your reducers, and the impure work in your sagas. Alternatives do exist, such as [redux-thunk](https://github.com/gaearon/redux-thunk), but over time I've come to appreciate that sagas are more expressive and are my go-to choice.

Everything connects together using Redux's middleware chain. When an action is dispatched, Redux passes this through a chain of middleware functions. Reducers run after the middleware chain. Redux Saga is a middleware, which generates effects that will run [after the reducers have updated the state](https://redux-saga.js.org/docs/api/index.html#selectselector-args). This may seem initially strange, but makes sense when you consider that you want your `select` calls to be returning up-to-date values.

Redux Saga's middleware is responsible for starting, pausing and resuming sagas, as well as executing the effects that are yielded from a saga.

## Effects
The following saga calls an API and then dispatches an action (either success or fail) with the response:

~~~js
import { call, put } from 'redux-saga/effects';

// Action creators
const loadUser = username => ({ type: 'LOAD_USER', payload: username });
const loadUserSuccess = user => ({ type: 'LOAD_USER_SUCCESS', payload: user });
const loadUserFailure = error => ({ type: 'LOAD_USER_FAILURE', payload: error });

// Selectors
const getContext = state => state.context;

// Reducer
const defaultState = Object.freeze({
  loading: false,
  result: null,
  error: null,
  context: 'test_app'
});

function reducer(state = defaultState, action) {
  switch(action.type) {
    case 'LOAD_USER':
      return { ...state, loading: true };
    case 'LOAD_USER_SUCCESS':
      return { ...state, loading: false, result: action.payload };
    case 'LOAD_USER_FAILURE':
     return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// Saga
function* requestUser(action) {
  try {
    const context = yield select(getContext);
    const user = yield call(getUser, action.payload, context);
    yield put(loadUserSuccess(user));
  } catch (error) {
    yield put(loadUserFailure(error));
  }
}
~~~

(Note - I will be using this reducer and saga for any test cases below!)

`function*` indicates the saga is a generator function. When a generator `yield`s a value to its caller, execution of the generator is 'paused' until the calling function advances it, by calling either `next` or `throw`. It is possible to pass a value back to the generator function by supplying arguments to either of these calls. The generator then runs until the next `yield` or `return` statement.

In the example above, the saga is yielding a JavaScript object returned from a call to `select`, `call`, or `put`. These objects are known as **effects** - they are a *description* of some asynchronous operation that is to be performed by the Redux Saga middleware. `select` selects from the state, `call` calls a function and `put` dispatches an action. Others exist for more complex workflows, but these three are the most common.

## Testing Sagas
The separation between the description of an effect and the execution of that effect is incredibly valuable for testing, for two reasons. Firstly, as the tests do not call an external function directly, mocking is easy. All that is needed is to pass the mock return value back into the saga. Secondly, the effects are just objects, so can be asserted using deep equality.

In my research, I have discovered there are different styles of testing sagas:

### 1. Test the exact order
It is possible to test a saga by simply stepping through its yielded effects. From there you can make assertions by performing a deep equality check on the effect object. This is the most straightforward approach to testing, with test code calling `.next` or `.throw` on the saga function to advance it forward.

 Commonly, this approach to testing is best suited at the unit level, where you are most interested in verifying the saga works in isolation. By stepping through sagas in this manner, testing will typically focus on testing the exact order of yielded effects. Skipping a step is possible, albeit manually. There are times where drilling down to the exact order of effects is necessary to capture in tests. For example, I have a saga which is responsible for orchestrating polling an API endpoint, which means making sure that `delay` and `select` effects occur in a prescribed order, ensuring the saga is using up-to-date data. This testing approach suits this use case very well. However, a slight restructuring of a saga can lead to many test failures and cause annoyance. As with all testing, there's a fine line and you can risk **testing that the code does what the code does, not what it ought to be doing**.

### 2. Recording only the effects that you're interested in
Rather than assert the exact order of a saga's yielded effects, there is another approach which offers more flexibility. Sometimes it is not desirable to ensure a `select` happens at a particular point, just that it happens.

Testing in this style involves setting up a saga in advance with some mocks - normally for `select` and `call` effects. The saga is then started, run until completion, and then you can make your assertions. Test libraries that follow this style still provide you with a history of yielded effects, but also offer more capability than simply asserting that something happened.

This style aims for tests to assert that under a specific run condition a specific effect is observed.  This is closer to integration testing than the style above, but still displays many characteristics of unit testing.

 Placing this into a distinct bucket is difficult. As an approach it is definitely closer to an integration test than the style above, but still carries many characteristics of unit testing. Effectively the entity that runs the saga collects (or records) all of the effects, for you to assert on as you wish.

This approach offers a more stable test, it will be less brittle to change. It is common to see testing libraries that support this style of testing also be used to cover the exact ordering style, for times when it is desirable to be more prescriptive.

### 3. Integration testing
At the top end of the scale, there is the integration testing approach. Rather than test your saga in isolation, as a unit, integration testing libraries act as a mock middleware environment. They are supplied the saga, the reducer tree and an initial state. When the saga is started, some effects (i.e. `select` and `call`) will be applied to the state. Mock values can be provided for other effects (i.e. `call`).

Naturally these tests are slightly slower than a unit test, but fundamentally is just an extension of the methods described above. This is most suitable when testing a saga which manages a complex workflow and requires tight co-ordination with some state held in a reducer. Assertions on integration tests can still involve testing an exact order, or testing that certain effects happened during execution. They can also make assertions on the final state, or even the state at some point within the execution.

## Comparing the Libraries
Each testing library implements one of the above styles in a slightly different way. This section provides a brief overview of each library.

### Native Testing
Testing without any helper library involves manually stepping through the saga function and asserting effects as needed. It is most useful for testing the exact order of effects that are yielded.

Redux Saga also provides a `cloneableGenerator` utility function to reduce duplication in test code when a saga has branching logic. It wraps the saga's generator function, returning a new generator that can be advanced as normal. When a branch is approached, create a clone per branch and diverge at that point.

A complete example, therefore, looks like this:

~~~js
describe('with redux-saga native testing', () => {
  const generator = cloneableGenerator(loadUserSaga)(loadUser('sam'));
  const user = { username: 'sam', isAdmin: true };

  it('gets the execution context', () => {
    const result = generator.next().value;
    expect(result).toEqual(select(getContext));
  });

  it('calls the API', () => {
    const result = generator.next('tests').value;
    expect(result).toEqual(call(getUser, 'sam', 'tests'));
  });

  describe('and the request is successful', () => {
    let clone;

    beforeAll(() => {
      clone = generator.clone();
    });

    it('raises success action', () => {
      const result = clone.next(user).value;
      expect(result).toEqual(put(loadUserSuccess(user)));
    });

    it('performs no further work', () => {
      const result = clone.next().done;
      expect(result).toBe(true);
    });
  });

  describe('and the request fails', () => {
    let clone;

    beforeAll(() => {
      clone = generator.clone();
    });

    it('raises failed action', () => {
      const error = new Error("404 Not Found");
      const result = clone.throw(error).value;
      expect(result).toEqual(put(loadUserFailure(error)));
    });

    it('performs no further work', () => {
      const result = clone.next().done;
      expect(result).toBe(true);
    });
  });
});
~~~

### redux-saga-test
redux-saga-test provides a convenient shorthand syntax for asserting effects yielded from a saga. Rather than:
`expect(generator.next().value).toEqual(select(getContext));`

You can instead use:

~~~js
expect.next().select(getContext);
~~~

I categorise this library as a "quality of life" improvement over native testing. Your tests are still following the native, exact-ordering style, but with fewer keystrokes to make your assertions. It is still required to manually advance the saga in your test code.

If you use Jest as your testing framework and choose to use *redux-saga-test*, you will need to provide `fromGenerator` with a function called `deepEqual`, which maps to Jest's `equals` function. Ideally you'd provide a global wrapper onto `fromGenerator` that your tests can import, preventing the need to do this in every single test file.

~~~js
describe('with redux-saga-test', () => {
  const generator = loadUserSaga(loadUser('sam'));
  const expect = fromGenerator(assertions, generator);

  it('gets the execution context', () => {
    expect.next().select(getContext);
  });

  it('gets the user', () => {
    expect.next('test_app').call(getUser, 'sam', 'test_app');
  });

  ...
});
~~~

### redux-saga-testing
The redux-saga-testing approach is to override the test function (ie `it`), so that each test case advances the generator. The yielded value is then passed through to the test function:

~~~js
import sagaHelper from 'redux-saga-testing';
import { requestUser } from './saga';

describe('with redux-saga-testing', () => {
  const it = sagaHelper(requestUser, loadUser('sam') });
  const user = { };

  it('gets the username', result => {
    expect(result).toEqual(call(getUsername, 'sam'));
    return user;
  });

  it('raises the success action', result => {
    expect(result).toEqual(put(loadUserSuccess(user)));
  });

  it('performs no further work', result => {
    expect(result).not.toBeDefined();
  });
});
~~~

By adopting this library, you tightly couple the execution of your tests to the execution of a saga. You will be testing using the exact style of testing. individual steps can be skipped using an empty test function:

~~~js
it('', () => {});
~~~

However, it can magnify the issues encountered by exact testing because of its lack of support for `cloneableGenerator`. Small structural changes to a saga will cause many test failures - especially so if there are multiple `describe` block to cover the saga's branching logic.

### redux-saga-test-plan
redux-saga-test-plan supports exact order testing with its `testSaga` function. It provides a means of chaining assertions into a single test:

~~~js
describe('with redux-saga-test plan', () => {
  it('works as a unit test', () => {
    testSaga(loadUserSaga, loadUser('sam'))
      .next()
      .select(getContext)
      .next('tests')
      .call(getUser, 'sam', 'tests')
      .next(user)
      .put(loadUserSuccess(user))
      .next()
      .isDone();
  });
});
~~~

When using the `testSaga` function it is possible to avoid having to assert on every effect, although as you have to call `next` yourself, you are still coupling your tests to the exact order in which the saga is yielding effects.

By instead using its `expectSaga` function, you can instead have the saga run until completion without having to manually advance it. You can provide any mock values for effects during setup. The chainable assertion syntax used in `testSaga` is supported on `expectSaga` too:

~~~js
it('works as an integration test', () => {
  return expectSaga(loadUserSaga, loadUser('sam'))
    .provide([
      [select(getContext), 'test_app'],
      [call(getUser, 'sam', 'test_app'), user]
    ])
    .put(loadUserSuccess(user))
    .run();
});
~~~

The `expectSaga` function can be enhance with a reducer, or some static state, so that it can run as an integration test. With this approach you can additionally assert on the final state of the reducer, after the saga runs until completion:

~~~js
it('works as an integration test with reducer', () => {
  return expectSaga(loadUserSaga, loadUser('sam'))
    .withReducer(reducer)
    .provide([
      [call(getUser, 'sam', 'test_app'), user]
     ])
    .hasFinalState({
      loading: false,
      result: user,
      error: null,
      context: 'test_app'
    })
    .run();
});
~~~

### redux-saga-test-engine
redux-saga-test-engine adopts a similar approach to redux-saga-test-plan. It provides the `createSagaTestEngine` function, which accepts a list of effect types to record during a test run. You then start the saga and provide any mock return values, for effects such as `select` and `call`.

The result from the test function is a list of effects of the types you asked to record. It is possible to assert the exact ordering, albeit on a slightly reduced set.

~~~js
describe('with redux-saga-test-engine', () => {
  const user = { username: 'sam', isAdmin: true };
  const collectEffects = createSagaTestEngine(['PUT', 'CALL']);
  const actualEffects = collectEffects(
    loadUserSaga,
    [
      [select(getContext), 'test_app'],
      [call(getUser, 'sam', 'test_app'), user]
    ],
    loadUser('sam')
  );

  it('gets the user', () => {
    expect(actualEffects[0]).toEqual(call(getUser, 'sam', 'test_app'));
  });

  it('raises the success action', () => {
    expect(actualEffects[1]).toEqual(put(loadUserSuccess(user)));
  });

  it('performs no further work', () => {
    expect(actualEffects.length).toEqual(2);
  });
});
~~~

### redux-saga-tester
As an integration test framework, redux-saga-tester provides an class to run a saga alongside a reducer, an initial state and potentially some extra middleware. Create an instance of `SagaTest` and then `start` the saga. From there, it is possible to assert that the final state is as expected. It also maintains a history of effects, making it possible to assert the exact order of effects, or a smaller set.

~~~js
describe('with redux-saga-tester', () => {
  it('works as an integration test with reducer', () => {
    const user = { username: 'sam', isAdmin: true, context: 'test_app' };

    const sagaTester = new SagaTester({
      initialState: defaultState,
      reducers: reducer
    });

    sagaTester.start(loadUserSaga, loadUser('sam'));

    expect(sagaTester.wasCalled(LOAD_USER_SUCCESS)).toEqual(true);
    expect(sagaTester.getState()).toEqual({
      loading: false,
      result: user,
      error: null,
      context: 'test_app'
    });
  });
});
~~~

## Conclusion
In summary, the following table can be used for a quick outline as to where each testing library is best utilised:

<style type="text/css">
  table thead {
    border-bottom: 1px solid #333;
  }
  table th {
    font-weight: bold;
  }
  table td, table th {
    padding: 5px;
  }
  table tr:first-child td {
    padding-top 10px;
  }
  th:nth-child(5), td:nth-child(5) {
    border-left: 1px solid gray;
  }
  table {
    margin-bottom: 17px;
  }
</style>

<table>
  <thead>
    <tr>
      <th>Library</th>
      <th>Exact</th>
      <th>Recording</th>
      <th>Integration</th>
      <th>cloneableGenerator</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Native testing</td>
      <td>Y</td>
      <td>N</td>
      <td>N</td>
      <td>Y</td>
    </tr>
    <tr>
      <td>redux-saga-test</td>
      <td>Y</td>
      <td>N</td>
      <td>N</td>
      <td>Y</td>
    </tr>
    <tr>
      <td>redux-saga-testing</td>
      <td>Y</td>
      <td>N</td>
      <td>N</td>
      <td>N</td>
    </tr>
    <tr>
      <td>redux-saga-test-plan</td>
      <td>Y</td>
      <td>Y</td>
      <td>Y</td>
      <td>N</td>
    </tr>
    <tr>
      <td>redux-saga-test-engine</td>
      <td>N</td>
      <td>Y</td>
      <td>N</td>
      <td>N</td>
    </tr>
    <tr>
      <td>redux-saga-tester</td>
      <td>N</td>
      <td>N</td>
      <td>Y</td>
      <td>N</td>
    </tr>
  </tbody>
</table>

Depending on the nature of the saga under test, I'd advise picking what you consider to be the most appropriate method. `redux-saga-test-plan` provides comprehensive support for all styles of testing, but mixing and matching is equally a valid option. What's more important in my view is that the developer crafts tests with an understanding of the strengths and weaknesses of the approach that they are taking.

A complete working solution is provided on [Github](https://github.com/sh1989/redux-saga-test-analysis).
