---
published: true
author: mstobbs
layout: default_post
category: Tech
title: 'Data Fetching in Redux Made Easy With RTK Query'
tags: 'redux rtk rtk-query'
image: mstobbs/assets/introduction-rtk-query/dog-fetching.jpg
summary: >-
  RTK Query is the latest addition to the Redux family, intended to make loading data from a server as easy as possible.
  In this post, we'll look at why I'm so excited for it, and answer the question "but why does redux care about data fetching?"
---

Redux is the most used state management library for frontend apps - [28% of React apps](https://twitter.com/chrisachard/status/1272963246371241984) on Github use it! Despite this, there remains one complaint so common it's almost cliché: boilerplate. Even Dan Abramov, the creator of Redux, complained about this when he returned to a Redux codebase:

<img src="{{ site.baseurl }}/mstobbs/assets/introduction-rtk-query/DanAbramovReduxTweet.png" alt="Dan Abramov complaining about Redux in a tweet" title="Dan Abramov complaining about Redux in a tweet">

To address this, the Redux team has released [Redux Toolkit](https://redux-toolkit.js.org/) (RTK): an opinionated toolset for writing Redux applications. Now, they've added "the newest member of the Redux family", RTK Query. [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) is intended to make data fetching and caching with Redux as easy as possible.

<img src="{{ site.baseurl }}/mstobbs/assets/introduction-rtk-query/RTKQueryAnnouncementTweet.PNG" alt="The release of RTK Query being announced on Twitter" title="The release of RTK Query being announced on Twitter">

When I first saw the announcement, my reaction was, "That's cool... but why?" Why would a state management library need to handle data fetching?

In this post, I want to explain why I'm excited for RTK Query and answer my original question, "but why?"

## "That's Cool"

Asynchronous programming is hard.

It's hard in any application, but it's especially tricky in Redux apps. Redux has no built-in way to handle any side effects, including asynchronous code.

As the [docs](https://redux.js.org/tutorials/fundamentals/part-6-async-logic#redux-middleware-and-side-effects) themselves say, "By itself, a Redux store doesn't know anything about async logic. It only knows how to synchronously dispatch actions, update the state by calling the root reducer function, and notify the UI that something has changed. Any asynchronicity has to happen outside the store."

To get around this, Redux provides a space for middleware - a way to intercept dispatched actions before they are received by the reducer. Typically, data fetching is done using either [Redux Thunk](https://github.com/reduxjs/redux-thunk) or [Redux-Saga](https://redux-saga.js.org/).

Despite this, data fetching is still a manual process, which leaves plenty of room for error and edge cases. It's up to the developer to handle loading states, error states, caching, polling, optimistic updates, etc. And it's up to the developer to make sure these are done in a reusable way, to make it easy to extend and maintain.

## Enter RTK Query

That's where RTK Query comes in. [RTK Query](https://rtk-query-docs.netlify.app/introduction/getting-started#getting-started) is "designed to simplify common cases for loading data in a web application." Now, instead of potentially [five files](https://twitter.com/matt_stobbs/status/1339926485856075777) to fetch data and cache it in the Redux store, we need one.

To see how simple data fetching becomes using RTK Query, here is a basic example of fetching a joke from an API and rendering it.

<iframe src="https://codesandbox.io/embed/rtk-query-jokes-example-0udhi?codemirror=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fservices%2Fjokes.js&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="RTK-Query-Jokes-Example"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

A lot is going on here, so let's break it down.

### Set up the service

~~~js
// services/jokes.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jokesApi = createApi({
  reducerPath: 'jokesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://official-joke-api.appspot.com/jokes/',
  }),
  endpoints: (builder) => ({
    getJokeByType: builder.query({
      query: (type) => `${type}/random`,
    }),
  }),
});

export const { useGetJokeByTypeQuery } = jokesApi;
~~~

The main source of RTK Query's functionality comes from `createApi`. This is where we'll define our endpoints and allow it to create the [API slice](https://redux-toolkit.js.org/rtk-query/api/created-api/overview) that gives us everything we need.

In our example, we pass in an object that defines three things:

- `reducerPath`: The _unique_ key that defines where the Redux store will store our cache.
- `baseQuery`: The base query to request data. The Redux team [recommend](https://redux-toolkit.js.org/rtk-query/api/createApi) that you have one API slice per base URL.
  - `fetchBaseQuery`: RKT Query also provides a lightweight wrapper around `fetch` queries, which allow us to build a query by just providing the base URL.
- `endpoints`: The set of operations that we want to perform against the server. In this case, we have one, `getJokeByType`, which will take a type and query the endpoint `${type}/random`.

Finally, because we're using this in a React app, RTK Query will automatically generate hooks for each endpoint query (in this example, `useGetJokeByTypeQuery`). This is done by using `createApi` from `'@reduxjs/toolkit/query/react'`.

### Hook the service into the Redux store

~~~js
// store.js

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { jokesApi } from './services/jokes';

export const store = configureStore({
  reducer: {
    [jokesApi.reducerPath]: jokesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jokesApi.middleware),
});

setupListeners(store.dispatch);
~~~

We hook RTK Query into our app when we set up the Redux store. The API object we created with `createApi` gives us everything we need:

- `reducerPath` and `reducer` are created for us, which we can pass straight into the `reducer` parameter of `configureStore`.
- `middleware` is also created for us, which will allow us to take advantage of caching, invalidation, polling, and the other features of RTK Query.

Optionally, we can use `setupListeners`, which will [enable](https://redux-toolkit.js.org/rtk-query/api/setupListeners) us to refetch the data on certain events, such as `refetchOnFocus` and `refetchOnReconnect`.

### Display the data

~~~js
// App.js

import { useGetJokeByTypeQuery } from './services/jokes';
import './styles.css';

export default function App() {
  const { data, error, isLoading } = useGetJokeByTypeQuery('programming');

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops, an error occured</div>;
  }

  return (
    <div className="app">
      <p>{data[0].setup}</p>
      <p>{data[0].punchline}</p>
    </div>
  );
}
~~~

Finally, in our React component, we can use the hook we created to fetch the type of joke we want. We'll be able to see what state we're in (e.g. loading, error) and get the data once it's returned.

With the foundations in place, it's now incredibly easy to expand.

Need a new endpoint? Just add it to the `endpoints` parameter in `services/jokes.js`.

Want to add polling so that the data is refreshed at regular intervals (or, in our case, request a new joke at regular intervals)? Just pass `pollingInterval` to the `useQuery` hook:

~~~js
const { data, error, isLoading } = useGetJokeByTypeQuery('programming', {
  pollingInterval: 5000, // 5000 ms
});
~~~

## But Why Does Redux Care About Data Fetching?

RTK Query makes it incredibly simple to handle your app's data fetching in a maintainable way. But when I first saw the announcement, I couldn't help but think that this isn't Redux's job. In my mind, you had the "data layer" part of your app, which handles fetching the data. It then passes the data over to Redux, which takes care of holding it in the global state to be used throughout your app.

My lightbulb moment came as I read [My State Management Mistake](https://epicreact.dev/my-state-management-mistake/) by Kent C. Dodds. In it, he says that if he could go back in time and give advice to his past self, it would be:

> "Server cache is not the same as UI state, and should be handled differently."

Take a look at the Redux store in an app you're working on now. If it's anything like mine, you'll see a mix of data from the backend (which is behaving as a cache) and UI state (the data that isn't persisted when the page reloads).

These two types of data are treated as if they are the same, which ends up making both more complicated. As Kent explains, 'I would try and fail at state synchronization. Found myself in "impossible" states that were difficult to debug.'

That's where RTK Query comes in. It makes it easy to separate the two and handles the server cache, allowing us to focus on the UI state.

You may find that you have very little UI state to handle once you've removed the server cache. In that case, it may be worth considering whether you actually need Redux, or whether you only need something to handle the server cache, like [React Query](https://react-query.tanstack.com/).

## Conclusion

Redux Toolkit does an incredible job of giving Redux a much-needed update, and RTK Query is an exciting new piece of that.

To find out more about RTK Query, I highly recommend looking at the [official docs](https://redux-toolkit.js.org/rtk-query/overview). They cover everything you need to know and include an [examples page](https://redux-toolkit.js.org/rtk-query/usage/examples) with lots of examples, including using RTK Query with GraphQL and with Svelte.
