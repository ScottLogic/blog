---
published: true
author: thands
layout: default_post
category: Tech
title: 'Now we''re hooking: Redux catches on'
tags: react redux hooks selectors useSelector useDispatch
summary: >-
  Earlier this year React released hooks, shaking the codebase of developers all
  over the world and changing the way we write React web applications.
  Functional components with hooks have largely replaced class components and
  now Redux has followed.
image: 'thands/assets/hooks.jpg'
---

Earlier this year [React](https://reactjs.org/docs/hooks-intro.html) released [hooks](https://blog.scottlogic.com/2019/05/09/by-the-hook-a-practical-introduction-to-react-hooks.html), shaking the codebase of developers all over the world and changing the way we write React web applications. [Functional components](https://reactjs.org/docs/components-and-props.html) with hooks have largely replaced class components and now [Redux](https://react-redux.js.org/next/api/hooks) has followed.

React and Redux are the bread and butter for my web applications, creating a basic UI in a matter of minutes. They work in perfect harmony to give structure to your code whilst providing a platform that enables substantial app growth. So when I recently found out that Redux has also added hooks to their source code, I needed to try it out, and I was not disappointed.

## Where do I start?
When using Redux’s hooks, your initial setup of the store, actions, reducers and selectors will all work exactly the same. This massively helps ease the transition to implementing these new hooks into your existing code.

When writing a component I generally start by considering whether the component needs to be connected to the store or if it can be a dumb component with props passed down from a parent. Previously, each connected component would be wrapped in a higher-order component [`connect`](https://react-redux.js.org/next/api/connect). Its first two arguments, `mapStateToProps` and `mapDispatchToProps` enable your component to access the store and dispatch actions to the store respectively. The update released by [React-Redux](https://react-redux.js.org/) in version 7.1.0 allows you to write connected components, without the repeated container logic, with two easy to use hooks.

![connect vs hooks gif]({{site.baseurl}}/thands/assets/hooks.gif)

## useSelector()
The first hook that we are going to look at is [`useSelector`](https://react-redux.js.org/next/api/hooks#useselector) which allows you to access the store and extract data in a similar way to how we previously would have accessed the store with `mapStateToProps`.

~~~javascript
import React from 'react';
import { useSelector } from 'react-redux';

const Counter = () => {
    const count = useSelector(state => state.counter.count);

    return (
        <div>
            { count }
        </div>
    );
};

export default Counter;
~~~

We assign a variable `count` to the value which `useSelector` is able to pull from the store. This removes a lot of boiler plate code previously required to get this single value.

Another popular approach is to extract this selector logic to a separate file. We can then pass this selector directly to the hook!

~~~javascript
import React from 'react';
import { useSelector } from 'react-redux';

import { getCount } from './selectors';

const Counter = () => {
    const count = useSelector(getCount);

    return (
        <div>
            { count }
        </div>
    );
};

export default Counter;
~~~

The `useSelector` hook is called when the component renders and only causes a re-render if the result of the selector is different to the previous result.

`mapStateToProps` returns an object containing all individually specified values of state as fields, which `connect` compares with shallow equality checks to determine if re-rendering of individual values is necessary.
In contrast, `useSelector` uses a default strict comparison `===`, which allows us to extract a single value. This leaves you with a few options if you want to retrieve multiple values from the store.

1.	Call useSelector() multiple times, with each call returning a single field value (as above).
2.	Use [`Reselect`](https://github.com/reduxjs/reselect) or a similar library to create a memoized selector that returns multiple values and only returns a new object if one of those values has changed.
3.	Pass a second argument to useSelector as the `equalityFunction` such as [Lodash’s](https://lodash.com/docs/4.17.15) `_.isEqual` or `shallowEqual` from React-Redux. 

A dispatched action that causes multiple useSelector()s in the same component to return new values should only result in a single re-render.

## useDispatch()
The second hook we will look at replaces the second argument passed to `connect` (`mapDispatchToProps`) and gives you the ability to trigger [actions](https://redux.js.org/basics/actions) from directly within the components. This hook returns a reference to the dispatch function from the redux store and you can use it to dispatch actions as they are needed.

~~~javascript
const dispatch = useDispatch();
~~~

This can now wrap your actions wherever they are called, whether that is on click, scroll, keydown or in a React hook `useEffect`. Simply wrap the action in the dispatch function which this new hook gives you access to and voila.

~~~javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getCount } from './selectors';
import { incrementCounter } from './actions';

const Counter = () => {
    const count = useSelector(getCount);
    const dispatch = useDispatch();

    return (
        <div>
            <div>
                { count }
            </div>
            <button onClick={ () => dispatch(incrementCounter()) }>
                Increment Counter
            </button>
        </div>
    );
};

export default Counter;
~~~

This constant (dispatch) can then be used multiple times within that component, to wrap any functions that  dispatch actions to the store.

If you are passing the callback using dispatch to a child component, for example a custom button component, it is recommended that you memoize it with `useCallback`. A React hook that will only update the reference if one of its dependencies update otherwise child components may re-render unnecessarily.

~~~javascript
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getCount } from './selectors';
import { incrementCounter, decrementCounter } from './actions';

const Counter = () => {
    const count = useSelector(getCount);
    const dispatch = useDispatch();

    const increment = useCallback(() => dispatch(incrementCounter()), [dispatch]);
    const decrement = useCallback(() => dispatch(decrementCounter()), [dispatch]);

    return (
        <div>
            <div>
            	{ count }
            </div>
            <MyCustomButton onClick={ increment } title="Increment Counter" />
            <MyCustomButton onClick={ decrement } title="Decrement Counter" />
        </div>
    );
};

export const MyCustomButton = ({ onClick, title }) => (
    <button onClick={ onClick }>
        { title }
    </button>
);

export default Counter;
~~~

## In Conclusion
Following the huge rise in popularity of the functional component over class components since the release of Reacts hooks, I am confident the use of React-Redux hooks will flourish in the coming months.

By removing the need for component container logic, these hooks massively simplify the process of linking a component to the Redux store whilst reducing the amount of code we need to write. This is going to be particularly useful for those smaller components that may need access to a few fields of global state or dispatch one action by giving you the ability to hook into the store or trigger actions with two easy to learn hooks.
