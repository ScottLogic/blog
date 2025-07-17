---
title: The pros and cons of Redux Form in managing a form state immutably
date: 2018-06-11 00:00:00 Z
categories:
- Tech
tags:
- Redux,
- Javascript,
- Development
author: phands
layout: default_post
summary: Managing state in an application can be tricky, even more so with many moving
  parts like in typical forms. In this article I consider when it is appropriate to
  use Redux and Redux Form to manage the state of a form in a webapplication
image: phands/assets/Redux Form 1.png
---

## How do we handle state?
One of the biggest headaches a client-side developer can face can be how to handle and process updates to the current snapshot (or state) of the application at any given time. Not only can it become a headache to update correctly, a system can quite quickly become unwieldly in different parts of the application efficiently communicating with one another and staying up to date. Enter Redux.

[Redux](https://redux.js.org/) is one of the best state-management software tools available. The full docs and all the bells and whistles aren’t covered here, but Dan Abramov’s [talks on redux](https://egghead.io/courses/getting-started-with-redux) are a brilliant explanation of the ins and outs. Concisely, Redux takes on the role of updating the state and keeping the application up to date. A _very_ basic example is given below which covers the most important elements of redux:

- Part of the web page application is modified (e.g. a button is clicked, a timeout expiring, *a form being entered into*).

~~~ html
<div className="increase-buttons">
  <button onClick={dispatch(incrementBy(1))}> Plus one </button>
  <button onClick={dispatch(incrementBy(2))}> Plus two </button>
</div>
~~~

- This causes the application to _dispatch_ an _action_, which is an object containing a _type_ and then is free to be structured how the author wants.

~~~ javascript
const incrementBy = value => ({
  type: 'INCREMENT_BY',
  value
});
~~~

- _Reducers_ then listen for these actions (handled by Redux) and depending on the _type_ specified, take the old state of the application, make an *immutable* change, and present the new state.

~~~ javascript
// should have an initial state, here it is zero
const incrementReducer = (state = 0, action) => {
  if (action.type === 'INCREMENT_BY') {
    // if the action is relevant do something
    return state + action.value;
  }
  // otherwise simply return the un-modified state
  return state;
};
~~~

- _Selectors_ relevant to different components of the app listen for the changes to the state, and if a state change affects their component, or any of the children of that component, an update is done so the information shown to the user is kept up to date.

~~~ javascript
const getValue = state => {
  // return the value if it exists. If it does not, return 0
  return state.value || 0;
};
~~~

Rinse and repeat and you have an immutable state machine that allows developers to easily travel forward and backward through the actions that were dispatched and troubleshoot.

It’s a very basic but very concise way of managing state well in applications and is widely used.

## Issues with Redux

Redux is not without its issues. You must be intelligent in how you write the reducers and actions to be dispatched to ensure immutability, and the state can (with even a small application) quickly grow difficult to maintain.

An area that this second difficulty is really apparent is with forms for users to interact with. Say we have a very simple form with _first name_, _last name_ and _email address_ (let’s assume this is before GDPR, so I don’t need to ask for explicit consent in a pretend example):

-	Every key press in any of the fields needs to dispatch an action.
-	Each action would need to be handled by a reducer, but each element of the form would need their own action/reducer pair, or the actions and reducers might get very complicated (and coupled, which we want to avoid if possible) very quickly.
-	Most forms will need some sort of validation. We *need* an @ sign in the email form but should not allow them to be entered in the first and last name. More complexity. More code checking, More bugs.

Already we can see the issues stacking up. Add a couple of radio options, a dropdown menu and a phone number and the simplistic nature of redux could quickly end up resulted in complicated, clunky code. Fortunately, we have [Redux Form](https://redux-form.com/7.3.0/).

## Redux Form

Redux Form has been constructed to work and integrate brilliantly with redux for the exact cases above. The reducers are pre-built, and actions are automatically dispatched and listened for basic form components. Clicking onto any redux form field causes an _ON-FOCUS_ action to be dispatched to allow Redux Form to register the specific part of the form getting modified, and any interaction or keypress results in a _CHANGE_ action being dispatched, and the new state updates the relevant part of the form. Clicking away from the element results in an _ON-BLUR_ action, so any subsequent changes are not applied to that form. It is also easy to add validation to fields that are encompassed by Redux Form. I am not going into any more details here, but the documentation contains many [brilliant examples](https://redux-form.com/7.3.0/examples/simple/) I would recommend looking at.

## So, we should always use Redux Form if we have a form in an app with state management using Redux?

Well…no, it’s not quite that simple. Redux Form _can_ be a lot of overhead for very basic forms. And can be a downright nightmare if the form is overly complicated or needs more than basic form functionality. Take for instance a form that requires the user to select a name of existing accounts from a list retrieved from a database. Rather than a simple select, the client opts to use a typeahead component that has its own actions and reducers. Now the user is faced with the difficult task of meshing all these actions together efficiently to ensure the state machine is always up to date and remove any annoying bugs that could appear.

Fortunately, Redux Form exposes the _CHANGE_ action so it can be imported and used inside our own actions, with Redux's dispatch. Meaning that when the typeahead fetches options, and the users selects one, we can dispatch our own _CHANGE_ action to update the form part of the state. However, if we are manually dispatching a change to the form we are going to have to be careful as to making sure the form isn’t showing duplicated or out of date information.

At this point the developer might think “Well I might keep that bit of the form separate from redux forms, and hence not need to manually use _CHANGE_.” This is possible, Redux Form only needs to handle a small section of the state and there is no restriction in place to stop different parts of the form being stored in different states. Unfortunately, this now means that we’ve lost one of the big advantages of using Redux Form, which is to keep all elements of the form in one area in the state.

Suppose further that the account selected now needs to autofill some other fields that are inside the Redux Form managed area of the state. The developer has two options now, to keep the immutability of the form:

1.	Remove the other fields from the state as well. Now we are using Redux Form even less and will need more custom actions and reducers to handle the form changes.
2.	Dispatch the _CHANGE_ action inside the typeahead action functions to automatically fill the required elements of the form.

Both options are quite clunky. And both have their drawbacks. It is at this level of complexity that Redux Form loses some of its appeal, and the developer might be better embracing the multiple actions and reducers approach that is possible using only redux, as it allows for a lot more freedom, and interactivity between different elements in a form.

## Conclusion

Managing the state of an application can be a headache. And managing a form immutably in that state can be even more so. Redux and Redux Form work well together. If the form is overly simple Redux Form might be seen as a bit of overkill. If it is overly complex you may end up writing more code to integrate Redux Form than you would have manually handling the state with redux alone.
