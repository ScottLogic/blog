---
published: true
author: mstobbs
layout: default_post
category: Tech
title: Demystifying React Redux
tags: react redux featured
image: mstobbs/assets/demystifying-react-redux/Provider%20Satellite.jpg
summary: >-
  One of the most common complaints when someone starts learning React Redux is
  that it's too magic. In this post, we'll be pulling back the curtain on React
  Redux to discover how it really works.
---
Last year, the React team introduced Hooks - allowing many React features which were previously only accessible by class components to be available to functional components. While there was a high amount of praise and excitement for the release, there were also some complaints. One of the most common arguments was that they were too "magic".

[Magic code](https://en.wikipedia.org/wiki/Magic_(programming)) is a common issue in every framework. To improve the developer experience, the implementation details of the framework are abstracted away. This abstraction, however, comes at a cost, such as making your code very difficult to debug as soon as anything goes wrong.

To help demystify React Hooks, [Ryan Florence](https://twitter.com/ryanflorence) created a [demo](https://www.youtube.com/watch?v=1jWS7cCuUXw) in which he built "crappy hooks". As the name suggests, instead of importing Hooks from React, Ryan implemented a basic version himself. Although simplified, this created a mental model for me and helped pull back the curtain of React Hooks.

<div style="justify-content: center; display: flex; margin-bottom: 1rem;" >
<img src="{{ site.baseurl }}/mstobbs/assets/demystifying-react-redux/javascript_curtain.gif" alt="Pay no attention to the JavaScript behind the curtain!" title="Pay no attention to the JavaScript behind the curtain!">
</div>

During the past year, I've had the opportunity to work with several of the graduate developers here at Scott Logic. One of the most common complaints I hear when they're learning [React Redux](https://react-redux.js.org/) (the library that connects Redux to your React application) is that it's too magic. They don't understand how Redux is able to update their components, or how their components can update the Redux store by dispatching actions into the abyss. And because they don't understand how it's working, they struggle to debug their code when something breaks.

So, in this post, I'll be implementing "crappy React Redux". This is intended to give a general idea of what's going on when you connect your React app to Redux, rather than give a detailed description of how React Redux is implemented in practice.

But before we jump into the code, first we need to clear up another source of confusion when first learning React Redux - what is the difference between React and Redux?

## React vs Redux vs React Redux

[React](https://reactjs.org/) is "a JavaScript library for building user interfaces". Its job is to take data and render the correct display on the screen. When the data changes, React will figure out which parts of the screen need to update, and rerender them.

[Redux](https://redux.js.org/introduction/getting-started) is a state management tool. It is concerned with the state (or data) of your app: storing it, updating it, and notifying the appropriate listeners of updates. It does this by dispatching [actions](https://redux.js.org/basics/actions), which describe *what happened*, and [reducers](https://redux.js.org/basics/reducers), which specify *how* the state should change in response to the action.

React and Redux are very common together, but it's not essential to have both. It's possible to use React without Redux (either with another state management tool such as [MobX](https://mobx.js.org/getting-started.html) or with no state management tool at all). Likewise, it is possible to use Redux with another UI library. 

React Redux can be used to refer to the general tech stack of using React with Redux. However, I will be using the term "React Redux" to refer specifically to the React Redux library. This library is used to bind React and Redux together, allowing React to access data in the Redux store and dispatch actions, and updating the appropriate components when the store updates.

React Redux can be thought of as the "magic layer" that lies between React and Redux and it's this layer that we will be implementing.

## The Initial App

This would not be a React demo without creating a todo list. The initial app is a React implementation of a Svelte [example](https://svelte.dev/examples#animate). It's a simple app with an input at the top to add new todos, a list that shows incomplete todos and one that shows completed todos. The code can be found on [CodeSandbox](https://codesandbox.io/s/github/mattstobbs/simplified-react-redux/tree/183f3baed382888fe769f2324f714be5511d3647), where you can also follow along!

<div style="justify-content: center; display: flex; margin-bottom: 1rem;" >
<img src="{{ site.baseurl }}/mstobbs/assets/demystifying-react-redux/InitialTodoApp.jpg" alt="The initial todo app" title="The initial todo app">
</div>

## Redux

One day, our tech lead comes to us, explains the app state is far too complicated to manage with pure React and asks us to use Redux. After a quick `npm install redux`, we write a [reducer](https://github.com/mattstobbs/simplified-react-redux/blob/master/src/reducers/todosReducer.js) and some [actions](https://github.com/mattstobbs/simplified-react-redux/blob/master/src/actions/index.js). Finally, we create the Redux store in the root file:

~~~js
// configureStore.js

import { createStore } from 'redux';
import todosReducer from '../reducers/todosReducer';

const configureStore = (initialState) => {
  const store = createStore(todosReducer, initialState);
  return store;
};

export default configureStore;
~~~

~~~js
// index.js

import React from 'react';
...
import configureStore from './configureStore';

const todos = [
  { id: 1, isDone: false, description: "write some docs" },
  ...
  { id: 6, isDone: false, description: "fix some bugs" }
];

const store = configureStore(todos);

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
~~~

But how can we make the store globally accessible to all parts of our app without having to pass down the store as props to every component?

## React Context

According to the React [documentation](https://reactjs.org/docs/context.html):

> Context provides a way to pass data through the component tree without having to pass props down manually at every level.

It comes in two parts: the Provider, which stores the data, and the Consumers, which requests the data.  It's like the Consumer having a direct phone line to the Provider, which it can use regardless of where it is in the component tree (provided the Consumer is a descendant of the Provider).

I often picture the Provider as a satellite which will float above your application and hold the Redux store. Consumers will be able to send messages to the Provider in the form of dispatched actions, and the Provider can speak to the Consumers by sending them the new state.

<div style="justify-content: center; display: flex; margin-bottom: 1rem;" >
<img src="{{ site.baseurl }}/mstobbs/assets/demystifying-react-redux/Provider%20Satellite.jpg" alt="Providers are like satellites, communicating with Consumers" title="Providers are like satellites, communicating with Consumers">
</div>

Let's create a Provider, which will hold the Redux store, and wrap the root component with it so that it can be accessed by every Consumer in our app.

~~~js
// react-redux.js

import React from 'react';

const Context = React.createContext();

export const Provider = ({ store, children }) => {
  return (
    <Context.Provider value={store}>
      {children}
    </Context.Provider>
  );
};
~~~

~~~js
// index.js

import React from 'react';
import { Provider } from './react-redux';
...

const store = configureStore(todos);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
~~~

There's just one problem. The App component isn't a Consumer and ideally, we'd like to leave it that way. It shouldn't be [concerned](https://en.wikipedia.org/wiki/Separation_of_concerns) with the implementation details of React Redux, it should only worry about presenting the todo list. So how should we connect the component to the Redux store?

## Connect

The [`connect`](https://react-redux.js.org/api/connect) function does exactly that. It wraps your component in another container component. This new component is a Consumer, which can access the store, pull out the needed data, and pass them to our original component as props.

To know which data to pull out, `connect` takes a parameter called [`mapStateToProps`](https://react-redux.js.org/api/connect#mapstatetoprops-state-ownprops-object). This is a function that receives the state from redux, and returns an object which will be passed to the component as props. `connect` then returns the function that can be used to wrap the component.

This can get confusing so let's start at the top: 

1. `connect` is a function that takes `mapStateToProps`, and returns another function.
2. This function takes a component and returns another function.
3.  This third function is a React component which returns what we want to render: the container component.

~~~js
// react-redux.js

// 1.
export const connect = (mapStateToProps) => {
  // 2.
  return (Component) => {
    // 3.
    return () => (
      <ConnectedComponent
        mapStateToProps={mapStateToProps}
        component={Component}
      />
    );
  };
};
~~~

Once we have our `connect` function defined, we just need to create our `ConnectedComponent`. To keep things simple, we'll assume the child component isn't receiving any other props.

~~~js
// react-redux.js

const ConnectedComponent = ({
  mapStateToProps,
  component
}) => {
  const store = React.useContext(Context);
  const state = ???
};
~~~

We need to get the current state from the Redux store but this raises an important question: what *is* the Redux store?

## getState

The redux store is an object that contains 4 functions:

1. `getState()`
2. `dispatch(action)`
3. `subscribe(listener)`
4. `replaceReducer(nextReducer)`

For now, all we need is `getState`, which we can use to access the current state in our container app. We'll come back to `dispatch` and `subscribe` later.

~~~js
// react-redux.js

const ConnectedComponent = ({
  mapStateToProps,
  component
}) => {
  const { getState } = React.useContext(Context);
  const state = getState();
  const props = mapStateToProps(state);
  return component(props);
};
~~~

Now that we've defined the `connect` function, we can create our container.

~~~js
// TodosContainer.js

import Todos from './Todos';
import { connect } from '../react-redux';

const mapStateToProps = (state) => ({
  todos: state,
});

export default connect(mapStateToProps)(Todos);
~~~

~~~js
// App.js

import React from 'react';
import Todos from './TodosContainer';
...

const App = () => <Todos />;
~~~

Now, `App.js` imports the Todos container instead of the component. Because the todos list is now stored in the Redux store, it can be removed from the App component, meaning now our component just returns the Todos container.

Let's see how our app's looking.

<div style="justify-content: center; display: flex; margin-bottom: 1rem;" >
<img src="{{ site.baseurl }}/mstobbs/assets/demystifying-react-redux/InitialTodoApp.jpg" alt="The todo app with state" title="The todo app with state">
</div>

Success! 🎉

Well, sort of. Our app is rendering the todo list from the Redux store, but when we try interacting with our app, we get an error message.

<div style="justify-content: center; display: flex; margin-bottom: 1rem;" >
<img src="{{ site.baseurl }}/mstobbs/assets/demystifying-react-redux/todoError.gif" alt="The todo app giving an error after a user interaction" title="The todo app breaks after user interactions">
</div>

Our Redux store is successfully sending messages to our components, but our components can't send messages back yet. We need to be able to dispatch actions.

## dispatch

To allow components to dispatch actions, the `connect` function takes a second parameter, [`mapDispatchToProps`](https://react-redux.js.org/api/connect#mapdispatchtoprops-object-dispatch-ownprops-object). In React Redux, `mapDispatchToProps` could be an object or function but to keep it simple, in our version we'll only accept a function. Similar to `mapStateToProps`, this function will receive the dispatch function from Redux, and return an object which will be passed to the component as props.

~~~js
// TodosContainer.js

import Todos from './Todos';
import { connect } from '../react-redux';
import { addTodo, removeTodo, checkTodo } from '../actions';

const mapStateToProps = (state) => ({
  todos: state,
});

const mapDispatchToProps = (dispatch) => ({
  addTodo: (todo) => dispatch(addTodo(todo)),
  removeTodo: (id) => dispatch(removeTodo(id)),
  checkTodo: (id) => dispatch(checkTodo(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
~~~

Now we just need to update our `connect` function to accept `mapDispatchToProps`. We can access the dispatch function from the Redux store and use it with `mapDispatchToProps` to create the needed props. `mapStateToProps` and `mapDispatchToProps` are both optional now, so we'll need to take that into account too.

~~~js
// react-redux.js

const ConnectedComponent = ({
  mapStateToProps,
  mapDispatchToProps,
  component,
}) => {
  const { getState, dispatch } = React.useContext(Context);
  const state = getState();
  const props = {
    ...(mapStateToProps && mapStateToProps(state)),
    ...(mapDispatchToProps && mapDispatchToProps(dispatch)),
  };
  return component(props);
};

export const connect = (mapStateToProps, mapDispatchToProps) => {
  return (Component) => {
    return () => (
      <ConnectedComponent
        mapStateToProps={mapStateToProps}
        mapDispatchToProps={mapDispatchToProps}
        component={Component}
      />
    );
  };
};
~~~

Let's go back to our app to see if it's working.

<div style="justify-content: center; display: flex; margin-bottom: 1rem;" >
<img src="{{ site.baseurl }}/mstobbs/assets/demystifying-react-redux/todoNoUpdate.gif" alt="Nothing happens when the app is interacted with" title="Nothing happens when the app is interacted with">
</div>

We're not getting any error messages, but nothing's changing on the screen. Our state is being updated, but our components aren't being told about the update. We need to subscribe to the changes.

## subscribe

The Redux store provides us with a [`subscribe`](https://redux.js.org/api/store#subscribelistener) function, which we can use to notify our components whenever there is an update.

The `subscribe` function accepts a callback as a parameter, which it calls every time an action is dispatched. In this callback, we want to check if our props will change based on the new state and, if they will, pass the new props to the component. The simplest way to do this is to store the current props in the container's local state. Whenever it is updated, the container will re-render and pass the new props to the child component.

`subscribe` returns an unsubscribe function, which we need to use when the component is unmounting to prevent Redux from calling the callback unnecessarily.

~~~js
// react-redux.js

const ConnectedComponent = ({
  mapStateToProps,
  mapDispatchToProps,
  component,
}) => {
  const {
    getState,
    dispatch,
    subscribe,
  } = React.useContext(Context);
  const state = getState();

  // We need to store the props from the state, so
  // we can check later to see if they have updated
  let stateProps = {};
  if (mapStateToProps) {
    stateProps = mapStateToProps(state);
  }
  const props = {
    ...stateProps,
    ...(mapDispatchToProps && mapDispatchToProps(dispatch)),
  };

  // Store the current props in local state
  const [currentProps, setCurrentProps] = React.useState(props);

  React.useEffect(() => {
    // Define our callback
    const updateProps = () => {
      // Only update if mapStateToProps has been provided
      if (mapStateToProps) {
        // Get the new props from state
        const newStateProps = mapStateToProps(getState());
        
        // Compare the new props with the old props
        // and update if they have changed
        if (
          JSON.stringify(newStateProps) !== JSON.stringify(stateProps)
        ) {
          setCurrentProps({
            ...currentProps,
            ...newStateProps,
          });
        }
      }
    };
 
    // Subscribe, and store the unsubscribe function
    const unsubscribe = subscribe(updateProps);
  
    // Unsubscribe when the component unmounts
    return unsubscribe;
  });  

  return component(currentProps);
};
~~~

We use [`useEffect`](https://reactjs.org/docs/hooks-effect.html) because setting up the subscription is a side effect. It also allows us to perform the necessary clean up once the component unmounts.

Let's see how the app looks now.

<div style="justify-content: center; display: flex; margin-bottom: 1rem;" >
<img src="{{ site.baseurl }}/mstobbs/assets/demystifying-react-redux/todoFinal.gif" alt="The final working app" title="The final working app">
</div>

Now we can see the state updates! 🎉

## Bonus: Hooks

As part of React Redux v.7.1.0, they introduced [three hooks](https://react-redux.js.org/api/hooks) that could be used instead of the `connect` function: `useStore`, `useDispatch`, and `useSelector`. Based on how we've set up our react-redux file, these are easy to include in our app.

~~~js
// react-redux.js

export const useStore = () => {
  const store = React.useContext(Context);
  return store;
};

export const useDispatch = () => {
  const { dispatch } = React.useContext(Context);
  return dispatch;
};

export const useSelector = (selector) => {
  const { getState } = React.useContext(Context);
  const state = getState();
  const value = selector(state);
  return value;
};
~~~

## Conclusion

And that's React Redux! As I said at the start, this isn't exactly how React Redux is implemented, but as a mental model, this is what's going on behind the curtain. We have:

- A Provider, which sits at the top of our application and stores our Redux store.
- A `connect` function, which wraps our components with a container component. This component listens for state updates and passes the necessary props to the component.

You can see the final code on [github](https://github.com/mattstobbs/simplified-react-redux) or on [CodeSandbox](https://codesandbox.io/s/github/mattstobbs/simplified-react-redux/tree/master/?fontsize=14&hidenavigation=1&theme=dark).

If you're interested in learning more about React Redux, [Mark Erikson](https://twitter.com/acemarke) wrote a great blog post called [The History and Implementation of React-Redux](https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/). In it, he explains what React Redux does, how it works, and how the API and implementation have evolved. Mark also did a [talk](https://blog.isquaredsoftware.com/2019/06/presentation-react-redux-deep-dive/) at ReactNext 2019 based on that blog post.

There's also an episode of [readthesource](https://www.youtube.com/watch?v=VJ38wSFbM3A) in which [Dan Abramov](https://twitter.com/dan_abramov), the creator of Redux, takes a deep dive into the React Redux code at that time (2016) and shows some of the optimisations and edge cases they had to consider.
