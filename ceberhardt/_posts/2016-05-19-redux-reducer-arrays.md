---
author: ceberhardt
title: Applying redux reducers to arrays
layout: default_post
summary: null
categories:
  - Tech
---

The redux pattern provides a simple (and strict) pattern for managing state; a single store holds the state while a reducer applies actions, evolving the application state. As your app becomes more complex, you can [split up your reducer into separate functions](http://redux.js.org/docs/api/combineReducers.html), however, what if you have multiple instances of the same state in your app? for example a collection of notes, or calendar entries? the standard pattern for splitting reducers doesn't cover this scenario.

In this blog post I'll take a look at how you can take a reducer and apply it to a collection of state objects. As an example, I'll take the classic 'counter' demo and turn it into an app with multiple counters:

<img src="{{ site.baseurl }}/ceberhardt/assets/redux/counter-app.png" />

## A single counter

I have taken the counter app from the [redux examples page](http://redux.js.org/docs/introduction/Examples.html) and added just a little more functionality, the counter is now highlighted as a 'warning' if the value is greater than five.

Here's the reducer together with the increment and decrement action creators:

~~~ javascript
const INCREMENT = 'counter/INCREMENT'
const DECREMENT = 'counter/DECREMENT'

const update = (state, mutations) =>
  Object.assign({}, state, mutations)

export const incrementAction = () => ({
  type: INCREMENT
})

export const decrementAction = () => ({
  type: DECREMENT
})

export const INITIAL_STATE = {
  value: 0,
  warning: false
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INCREMENT:
      state = update(state, { value: state.value + 1 })
      break
    case DECREMENT:
      state = update(state, { value: state.value - 1 })
      break
  }
  state = update(state, { warning: state.value > 5 })
  return state
}

export default reducer
~~~

The above code follows the [ducks](https://github.com/erikras/ducks-modular-redux) bundling pattern (if you're interested!).

The component that renders the counter is quite straightforward, the `connect` function exposed by the [react-redux bindings](https://github.com/reactjs/react-redux) is used to map both state and actions to the components properties.

~~~ javascript
import React from 'react'
import { connect } from 'react-redux'
import { incrementAction, decrementAction } from '../store/counterReducer'

const mapStateToProps = state => ({
  counter: state
})

const mapDispatchToProps = {
  incrementAction,
  decrementAction
}

const Counter = props =>
  <div className={'redux' + (props.counter.warning ? ' warning' : '')} >
    <h1>{props.counter.value}</h1>
    <button onClick={props.onIncrement}>+</button>
    <button onClick={props.onDecrement}>-</button>
  </div>

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
~~~

This code uses the shorthand form of `mapDispatchToProps` where each property of the supplied object is expected to be an action creator and is wrapped in a call to dispatch.

## A whole load of counters ...

So how do we move from having a single counter to a collection of counters? The existing reducer, and the state that it manages, could be extended to add this capability, but that doesn't feel like a good approach. The reducer and component are small and focussed units of functionality, I'd prefer to leave them that way.

A better approach would be to add a new reducer that manages the state for a collection of counters. Ignoring the required actions for the time-being, here's what that reducer looks like:

~~~ javascript
import { INITIAL_STATE as COUNTER_INITIAL_STATE } from './counterReducer'

const INITIAL_STATE = [
  COUNTER_INITIAL_STATE,
  COUNTER_INITIAL_STATE,
  COUNTER_INITIAL_STATE
]

const reducer = (state = INITIAL_STATE, action) => state

export default reducer
~~~

The current `Counter` component is coupled to the state directly. In order to render multiple counter instances, this component has to be stateless.

With the way the redux connectors work, this is a trivial change to make. The component render function remains the same, but the state and dispatch property mappings are removed:

~~~ javascript
import React from 'react'

const Counter = props => (
  <div className={'redux' + (props.counter.warning ? ' warning' : '')} >
    <h1>{props.counter.value}</h1>
    <button onClick={props.incrementAction}>+</button>
    <button onClick={props.decrementAction}>-</button>
  </div>
)

export default Counter
~~~

Finally, a new `CounterCollection` component is added that renders the application state:

~~~ javascript
import React from 'react'
import { connect } from 'react-redux'
import Counter from './Counter'

const mapStateToProps = state => ({
  counters: state
})

const CounterCollection = props =>
  <div className='container'>
    {props.counters.map(value =>
      <Counter incrementAction={()=>{}} decrementAction={()=>{}} counter={value}/>
    )}
  </div>

export default connect(mapStateToProps)(CounterCollection)
~~~

The above maps the counter state to each component via the `Counter.counter` property. We'll look at mapping the actions later.

The `CounterCollection` renders as follows:

<img src="{{ site.baseurl }}/ceberhardt/assets/redux/counter-collection.png" />

That was easy enough, however the counters no longer function because the button clicks do not result in actions being dispatched. This is where it starts to get interesting ...

# Binding actions to an item index

In order for the store to update the state of one of the counters, the action (either increment or decrement) needs to uniquely identify the counter that it applies to. The simplest way to achieve this is to add the counter index to each action.

The aim here is to use the existing counter reducer without modification, so the original action creators shouldn't be modified. An alternative is to adapt the action creators:

~~~ javascript
export const bindIndexToActionCreator =
  (actionCreator, index) =>
    (...args) =>
      Object.assign(actionCreator(...args), { index })
~~~

The above function takes an action creator and an index, returning a new action creator that will include the item index.

Here's a quick example:

~~~ javascript
// the original action
console.log(incrementAction())
// {
//   type: 'counter/INCREMENT_COUNTER'
// }

// bound to an index
const boundIncrementAction = bindIndexToActionCreator(incrementAction, 2)
console.log(boundIncrementAction())
// {
//   type: 'counter/INCREMENT_COUNTER',
//   index: 2,
// }
~~~

In the above example the action creator doesn't have any arguments, but `bindIndexToActionCreator` works just fine for action creators that do.

The `CounterCollection` component can make use of this function as follows:

~~~ javascript
const counterDispatchProperties =
  index =>
    dispatch => ({
      decrementAction() {
        dispatch(bindIndexToActionCreator(decrementAction, index)())
      },
      incrementAction() {
        dispatch(bindIndexToActionCreator(incrementAction, index)())
      }
    })

const Counters = props =>
  <div className='container'>
    {props.counters.map((value, index) =>
      <Counter counter={value}
        {...counterDispatchProperties(index)(props.dispatch)}/>
    )}
  </div>
~~~

In the component render function, the `counterDispatchProperties` function is being invoked for each counter instance, with the index passed. The `counterDispatchProperties` function, when invoked with an index, returns a new function that when invoked with the dispatcher returns an object which contains action creators that are bound to the dispatcher.

The use of [JSX spread attributes](https://facebook.github.io/react/docs/jsx-spread.html), i.e. `{...counterDispatchProperties}` means that the `decrementAction` and `incrementAction` functions are copied to the component properties.

Each counter is now able to dispatch actions with their respective index. The final piece of the puzzle is handling these within a reducer.

Once again, I don't want to change the counter reducer, so this needs to be handled in the root reducer.

Given that actions are namespaced, it is possible to identify the counter actions by their prefix. The root reducer identifies any actions that are intended intended for the counter reducer, using the index to locate the correct item within the array of counter states, then invokes the counter reducer accordingly:

~~~ javascript
import counterReducer from './counterReducer'

const reducer = (state = INITIAL_STATE, action) => {
  if (action.type.startsWith('counter/')) {
    state = [
      ...state.slice(0, action.index),
      counterReducer(state[action.index], action),
      ...state.slice(action.index + 1)
    ]
  }
  return state
}
~~~

The use of slice and spread on the state array creates a copy, with the counter at the given index updated.

With the above code in place, the counters are fully functioning once again:

<img src="{{ site.baseurl }}/ceberhardt/assets/redux/working-counters.png" />

## Getting functional

The way that the action creators are bound to the item index, looks quite similar to the way react / redux binds the dispatcher to actions.

Taking inspiration from the redux utility function [bindActionCreators](http://redux.js.org/docs/api/bindActionCreators.html), `bindIndexToActionCreators` can be extended to operate on object whose values are action creators, as well as a single action creator:


~~~ javascript
const transformObjectValues = (obj, fn) => {
  var transformed = {}
  Object.keys(obj).forEach(key => {
    transformed[key] = fn(obj[key])
  })
  return transformed
}

const bindActionCreator = (actionCreator, index) =>
  (...args) => Object.assign(actionCreator(...args), { index })

const bindActionCreatorMap = (creators, index) =>
  transformObjectValues(creators, actionCreator => bindActionCreator(actionCreator, index))

const bindIndexToActionCreators = (actionCreators, index) => {
  return typeof actionCreators === 'function'
    ? bindActionCreator(actionCreators, index)
    : bindActionCreatorMap(actionCreators, index)
}

export default bindIndexToActionCreators
~~~

Combining redux's `bindActionCreators` with the updated implementation of `bindIndexToActionCreators` makes it really easy to supply actions that have the index bound and wrapped in dispatch, to the `Counter` component:

~~~ javascript
const counterDispatchProperties =
  index =>
    dispatch => bindActionCreators(
        bindIndexToActionCreators({incrementAction, decrementAction}, index),
      dispatch)

const Counters = props =>
  <div className='container'>
    {props.counters.map((value, index) =>
      <Counter counter={value}
        {...counterDispatchProperties(index)(props.dispatch)}/>
    )}
  </div>
~~~

Nice!

## Adding counters

So far the root reducer only passes off actions to the counter reducer. I wanted to quickly illustrate that it can also handle its own dedicated actions.

Here the reducer has had another action added, this time one that adds a new counter to the collection:

~~~ javascript
import counterReducer, { INITIAL_STATE as COUNTER_INITIAL_STATE } from './counterReducer'

const ADD_COUNTER = 'counterCollection/ADD_COUNTER'

export const addCounterAction = () => ({
  type: ADD_COUNTER
})

const reducer = (state = INITIAL_STATE, action) => {
  if (action.type.startsWith('counter/')) {
    return [
      ...state.slice(0, action.index),
      counterReducer(state[action.index], action),
      ...state.slice(action.index + 1)
    ]
  }
  switch (action.type) {
    case ADD_COUNTER:
      return [
        ...state,
        COUNTER_INITIAL_STATE
      ]
  }
  return state
}

export default reducer
~~~

With a suitable component added to the UI and wired up to this action, new counters can now be added:

<img src="{{ site.baseurl }}/ceberhardt/assets/redux/counter-app.png" />

If you find yourself in a similar position, where you are struggling to apply reducers to multiple state objects, hopefully this post will have been useful to you.

The source for this multi-counter example can be [found on GitHub](https://github.com/ColinEberhardt/redux-reducer-array).

Enjoy! Colin E.
