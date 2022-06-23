---
title: 'By the Hook: A Practical Introduction to React Hooks'
date: 2019-05-09 00:00:00 Z
categories:
- mstobbs
- Tech
tags:
- JavaScript
- React
- Hooks
- featured
author: mstobbs
layout: default_post
image: mstobbs/assets/black-and-white-hook.jpg
summary: Hooks are one of the most exciting features of React in recent times, allowing
  the developer to "hook" into React features without having to use class components.
  In this post, we take a dive into Hooks and learn how, when and why to use them.
---

In a [recent interview](https://www.youtube.com/watch?v=G-aO5hzo1aw) with [Dan Abramov](https://twitter.com/dan_abramov), [Mattias Petter Johansson](https://twitter.com/mpjme) converted the components in the [tic tac toe game](https://reactjs.org/tutorial/tutorial.html) used in the React tutorial docs from classes to functions using Hooks. At the end of the interview, Dan gave some suggestions on how Hooks could be used to not only convert the classes into functions, but to improve the overall quality of the code.

In this post, I'll be giving an introduction to Hooks by converting the tic tac toe tutorial into functions in a similar way to the interview. I'll be showing how to handle side effects with `useEffect`. Finally, I'll be talking about Dan Abramov's first suggestion: using the Hook `useReducer` to better manage the game's state.

In a future post, I'll be showing the real value of Hooks by using Dan's second suggestion - extracting away stateful logic into a custom Hook which can be reused throughout the app.

## Converting from classes to functions - Why do we need hooks?

The original tic tac toe final product can be found [here](https://codepen.io/gaearon/pen/gWWZgR?editors=0010). Currently, we have 3 components:

-	`Square`, which displays the current state of a square on the board. In this case, it will either be X, O, or blank.
-	`Board`, which displays the current board. In this case is a group of squares laid out in a 3x3 grid.
-	`Game`, which manages the overall game state (e.g. who's turn it is, who the winner is, etc.). It also stores the history of the game, and allows the players to travel back to previous states of the game board.

The `Board` and the `Square` components simply take an input in the form of "props" and produce an output in the form of a React element to render on the page. There are no state nor side effects, which makes it very straight forward to convert these from class components to function components.

Things are less straight forward with the `Game` component. It contains local state, so in order to convert the component to a function, we will need a way to handle that state.

Our first idea might be to store the state as a local variable. However, when we try this, we find that the component doesn't re-render when the variable updates. This is because `setState` function is not being called. In addition, this would not be taking advantage of the [performance gains](https://overreacted.io/react-as-a-ui-runtime/#batching) that React uses on the `setState` function by batching the calls into a single update.

So if we can't just use a local variable, how can we use...state?

## useState

As stated in the [React docs](https://reactjs.org/docs/hooks-state.html#whats-a-hook), "`useState` is a Hook that lets you add React state to function components." For example, to add the `stepNumber` variable to the state, you can use the following line:

~~~ javascript
const [stepNumber, setStepNumber] = useState(0);
~~~

The function `useState` takes one argument, which is the initial value for the variable being added to state. It returns an array of two items - the current state and a function for updating the current state. The syntax uses [array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) to assign the items to whatever variable names we choose (the convention is to use `[variableName, setVariableName]`).

Using `useState`, we can finish converting our `Game` component into a function component (For simplicity, only parts of the component are shown. The full file can be seen [here](https://github.com/mattstobbs/tic-tac-toe-hooks/blob/master/src/components/GameWithUseState.js)). 

~~~ javascript
import React, { useState } from 'react';
import Board from './Board';
import { calculateWinner } from '../utils/calculateWinner';

const Game = () => {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null),
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const currentBoard = history[stepNumber];
  const winner = calculateWinner(currentBoard.squares);

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const squares = currentBoard.squares.slice();
    if (winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(newHistory.concat([
      {
        squares: squares
      }
    ]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

...

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentBoard.squares}
          onClick={i => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
~~~

As you can see, you no longer need to use `this.state.history`. Instead, we treat `history` like a regular variable, because that's what it is now.

So now we've successfully converted the `Game` component into a function component using hooks. But what would happen if you wanted to implement other features that were previously only possible with classes? For example, how would you implement side effects if you don't have access to lifecycle methods?

## useEffect

To see how we can use hooks to handle side effects, let's implement an API call to load a previously unfinished game. We want this call to be made when the `Game` component initially mounts. Using class components, this would be done in the `componentDidMount` lifecycle method.

~~~ javascript
componentDidMount() {
  fetchSavedHistory()
    .then(savedHistory => setState({ history: savedHistory }));
}
~~~

As you will have guessed by the section heading, this can now be done in React using [`useEffect`](https://reactjs.org/docs/hooks-effect.html). This Hook allows us to perform side effects in our component. As the docs put it, "You can think of `useEffect` Hook as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined."

So how does it work?

~~~ javascript
useEffect(() => {
  fetchSavedHistory()
    .then(savedHistory => setState({ history: savedHistory }));
});
~~~

`useEffect` takes a function as its first argument and calls that function each time the component renders. So now when our `Game` component first renders, it will call this function which will fetch the saved history and load it into the state. Let's open up our app and see if it has worked.

![Tic tac toe loading a saved state]({{ site.baseurl }}/mstobbs/assets/Tic%20Tac%20Toe%20Loading.gif "Tic tac toe loading a saved state")

Success! 🎉

However, once we start playing the game, we run into a problem (some of you may have predicted from my earlier comments what this is and how to fix it).

![Tic tac toe erasing new moves]({{ site.baseurl }}/mstobbs/assets/Tic%20Tac%20Toe%20Not%20Working.gif "Tic tac toe erasing new moves")

The function we passed to `useEffect` is called after __every__ render. This means that it will be called after the first render (which we want), and then again after every re-render (which happens every time someone makes a move). So every time someone makes a move, the component requests the saved history from the store and reloads it, erasing any moves that have been made.

To solve this problem, `useEffect` can optionally take a second argument:

~~~ javascript
useEffect(() => {
  fetchSavedHistory()
    .then(savedHistory => setState({ history: savedHistory }));
}, []);
~~~

This [second argument](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) tells React "to only apply an effect if certain values have changed between re-renders". This would usually be done in classes by writing a comparison with `prevProps` or `prevState` inside `componentDidUpdate`.

If we pass an empty array, no values within that array will ever change after a re-render, and therefore the effect will only be called on the initial render. This might seem strange to those who are used to the React class lifecycle methods but, as Ryan Florence [points out](https://twitter.com/ryanflorence/status/1125041041063665666?s=19), the correct way to think of the second argument isn't in terms of which lifecycle method the effect should occur in, but in terms of which state the effect should synchronize with (in this case, no state).

![Tic tac toe working correctly]({{ site.baseurl }}/mstobbs/assets/Tic%20Tac%20Toe%20Working.gif "Tic tac toe working correctly")

This functionality begins to give us a glimpse of the real benefits of hooks. With classes, the side effects were separated in code by the lifecycle method that calls them. For example, in `componentDidMount`, we may be subscribe to an event listener, and then unsubscribe from it in `componentDidUnmount`. With [hooks](https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup), these two related tasks are [brought together](https://twitter.com/prchdk/status/1056960391543062528) in the code. As Dan Abramov put it in his ["React Today and Tomorrow"](https://www.youtube.com/watch?v=dpw9EHDh2bM&t=17m40s) talk, "with Hooks we separate code not based on the lifecycle method name but based on what the code is doing."

## useReducer

Looking at the current code, you may have noticed something. When we were using class components, each action which triggered a change to the state would only have to call one function, `setState`. Now we have to call multiple functions, which gives the incorrect impression that each of these `setFoo` functions are not related.

For example, when a move is made, the updates to `history`, `stepNumber` and `xIsNext` are all part of the same action (i.e. if only one of the variables updated but not the others, the game would be in an invalid state). But each are set in a different function (`setHistory`, `setStepNumber`, `setXIsNext`) which can make them appear separate.

For this reason, Dan's [first suggestion](https://www.youtube.com/watch?v=G-aO5hzo1aw&t=1h3m10s) at the end of the interview is to "refactor it to `useReducer` to centralise the state handling logic." `useReducer` works in a similar way to [Redux](https://redux.js.org/introduction/core-concepts), but handles state on a local level instead of at a global level.

`useReducer` takes two arguments: a reducer and the initial state. The initial state is straight forward - it's the same object that we set the state to in the constructor of our component when it was a class component.

~~~ javascript
const initialState = {
  history: [{
    squares: Array(9).fill(null),
  }],
  stepNumber: 0,
  xIsNext: true,
};
~~~

The reducer is a function of type `(state, action) => newState`. It takes a state object and returns a new state object based on the action. In our current application, we have three different action types: `make_move`, `jump_to` and `load_game`.

~~~ javascript
const reducer = (state, action) => {
  switch (action.type) {
  case 'make_move':
    return {
      ...state,
      history: [...state.history.slice(0, state.stepNumber + 1), action.newBoardState],
      stepNumber: state.stepNumber + 1,
      xIsNext: !state.xIsNext,
    };
  case 'jump_to':
    return {
      ...state,
      stepNumber: action.step,
      xIsNext: (action.step % 2) === 0,
    };
  case 'load_game':
    return {
      ...state,
      history: action.savedHistory,
      stepNumber: action.savedHistory.length - 1,
      xIsNext: ((action.savedHistory.length - 1) % 2) === 0,
    };
  default:
    throw new Error('Unexpected action');
  }
};
~~~

We can then call `useReducer`. In the same way as `useState`, this returns an array which we can destructure to give us the current state and the dispatch function.

Now, whenever an "action" occurs, we simply dispatch that action and let the reducer handle how the state is updated. In other words, we have decoupled the expressing of “actions” that occur in our component and how the state updates in response to them. For example, the `jumpTo` function now becomes:

~~~javascript
const [state, dispatch] = useReducer(reducer, initialState);

...

const jumpTo = (step) => {
  dispatch({ type: 'jump_to', step });
};
~~~

## Conclusion - But what's the point?

And we're done! We've successfully managed to convert our class components into functions, handled side effects, and decoupled our "actions" from the state updates. The final result can be found [here](https://github.com/mattstobbs/tic-tac-toe-hooks/tree/master/src/components).

But now you may be wondering, "But why did we have to go through all this trouble? We could already use features such as state and side effect with class components."

While there [are](https://reactjs.org/docs/hooks-intro.html#complex-components-become-hard-to-understand) [advantages](https://reactjs.org/docs/hooks-intro.html#classes-confuse-both-people-and-machines) of being able to use functions instead of classes, the real benefits of Hooks come from being able to extract stateful logic out of the component into a reusable function called a **custom hook**. In the words of [Dan Abramov](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889), "Custom Hooks are, in our opinion, the most appealing part of the Hooks proposal."

In our `Game` component, you'll notice that the component has 2 roles: handling the logic of the tic-tac-toe game and handling the time travel logic. In a future post, we'll implement Dan Abramov's second suggestion: extracting out the time travel logic into a custom hook. This will allow us to use time travel on any other game we may wish to implement in the future without the need for repeated code.
