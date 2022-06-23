---
author: ceberhardt
title: Angular 2 Time Travel with Redux
layout: default_post
categories:
  - Tech
summary: This post looks at integrating Angular 2 with Immutable.js and Redux, a popular Flux store implementation. It also demonstrates that the functional approach, encouraged by these technologies, allow for powerful concepts such as time travel, where you can replay actions and application state.
---

This post looks at integrating Angular 2 with Immutable.js and Redux, a popular Flux store implementation. It also demonstrates that the functional approach, encouraged by these technologies, allow for powerful concepts such as time travel, where you can replay actions and application state.

<img src="{{ site.baseurl }}/ceberhardt/assets/angular2/monitor.png" />

As a brief recap, I've been describing the development of a todo list application with Angular 2 over a number of blog posts:

 - [The first](http://blog.scottlogic.com/2015/12/07/angular-2.html) looked at the the general shape of an Angular 2 application, exploring the concepts of web components, TypeScript and dependency injection.
 - [The second](http://blog.scottlogic.com/2015/12/24/creating-an-angular-2-build.html) explored the complexities of building an Angular 2 applications, introducing DefinitelyTyped and SystemJS in more detail.
 - [The third](http://blog.scottlogic.com/2016/01/05/angular2-with-immutablejs.html) built on the topics introduced in the first, looking at how immutable.js complements the Angular 2 'OnPush' change detection strategy

This is probably my final post on my Angular 2 todo app and in this post I'll explore Flux and more specifically Redux.

## The Current Store

This post will mostly focus on the 'store' component of the todo list application. It's responsibilities are simple, store the current application state, via local storage, and update the state based on an exposed API. The UI components use this API in order to mutate the current state as a result of user interactions.

In the current application the store is injected into the various UI components. Here it is in its entirety:

{% highlight javascript %}
export class TodoStore {
  items = List<TodoItem>();

  constructor() {
    const storedItemsString = <string> localStorage.getItem('todolist') || '[]';
    const storedItems = <Array<any>> JSON.parse(storedItemsString);
    this.items = List<TodoItem>(storedItems.map(i => new TodoItem(i._data)));
  }

  addItem(newItem: string) {
    const item = new TodoItem().setText(newItem);
    this.items = this.items.push(item);
    this.persistChanges();
  }

  updateText(itemId: string, updatedText: string) {
    this.items = this.items.update(this.indexOf(itemId), (i: TodoItem) => i.setText(updatedText));
    this.persistChanges();
  }

  updatedCompletion(itemId: string, completed: boolean) {
    this.items = this.items.update(this.indexOf(itemId), (i: TodoItem) => i.setCompleted(completed));
    this.persistChanges();
  }

  removeItem(itemId: string) {
    this.items = List<TodoItem>(this.items.filter((i: TodoItem) => i.uuid !== itemId));
    this.persistChanges();
  }

  private indexOf(uuid: string) {
    return this.items.findIndex((i: TodoItem) => i.uuid === uuid);
  }

  private persistChanges() {
    localStorage.setItem('todolist', JSON.stringify(this.items.toJS()));
  }
}
{% endhighlight %}

The store contains a list of items, and provides methods that mutate the state. However, the state itself is immutable, so these methods actually result in a transformation of state. The reason for using immutability is that it allows Angular 2 to optimise the rendering of UI components.

However, it's a funny mix of patterns. An API that implies mutation as a thin facade over a more functional approach to managing state changes. Also, because mutations are littered throughout this class, the `persistChanges` method is invoked from multiple places.

## Flux

I'm not going to go into Flux in much detail, it's a relatively simple pattern which is [explain in detail elsewhere](https://facebook.github.io/flux/docs/overview.html). In brief, the Flux architecture has *stores* which represent the current app state, *actions* which mutate the state and a *dispatcher* which dispatches action for consumption by stores. The key principle of the Flux architecture is that it enforces a unidirectional dataflow. User interactions are represented as actions which are dispatched to stores, with state changes flowing from the top down.

[Redux](http://redux.js.org/) is a simplified (and more opinionated) version of Flux which has a single store that you dispatch actions to directly. I'm using it here because this is a simple app, so a simple Flux implementation makes sense.

## Creating a Redux store

Adding Redux to the project involves the usual SystemJS configuration, and updated type definitions, [see the earlier post for details](http://blog.scottlogic.com/2015/12/24/creating-an-angular-2-build.html). Once added you can see that the Redux API is incredibly simple. This is clear form the type definition file which is only 50 lines long!

In it's most basic usage you create a store based on a reducer, access the current state via `getState` and dispatch actions via the `dispatch` method. As a result, the previously bloated store becomes a simple wrapper around the Redux store:

{% highlight javascript %}
interface ITodoAction {
  type: string;
  text?: string;
  index?: number;
}

export default class TodoStore {
  store = createStore(reducer);

  get items(): List<TodoItem>[] {
    return this.store.getState();
  }

  dispatch(action: ITodoAction) {
    this.store.dispatch(action);
  }
}
{% endhighlight %}

The main purpose of the `TodoStore` class is to allow the Redux store to be injected using Angular 2. The above code ignores the fact that the todo items are persisted in local storage. I'll add that back later.

An action is a very simple object that describes something that results in a change of state. Previously the todo list component invoked API methods on the store:

{% highlight javascript %}
addItem() {
  this.store.addItem(this.newItem);
  this.newItem = '';
}
{% endhighlight %}

Now it dispatches actions:

{% highlight javascript %}
addItem() {
  this.store.dispatch({
    type: 'ADD',
    text: this.newItem
  });
  this.newItem = '';
}
{% endhighlight %}

(This is a little more verbose, but I'll come back to that later.)

With the actions and store being so simple, its clear that the final component, the reducer, is where all the magic happens.

A reducer is a function that takes a state and an action, and returns the new state. It is a side-effect free transformation, `(state, action) -> state`. The name 'reducer' is similar to `Array.reduce`, because it performs a very similar function. The current state of an application can be determined by reducing all the actions performed to some initial state.

Here is a reducer that supports a couple of actions, ADD and a REMOVE:

{% highlight javascript %}
import { List } from 'immutable';
import { TodoItem } from './todoitem';

function reducer(state: List<TodoItem> = List<TodoItem>(), action: ITodoAction) {
  'use strict';
  switch (action.type) {
    case 'ADD':
      return state.push(new TodoItem().setText(action.text));
    case 'REMOVE':
      return state.splice(action.index, 1);
    default:
      return state;
  }
}
{% endhighlight %}

the API provided by immutable.js is a great fit for redux, allowing each action to be applied in a single line of code.

And that's just about all you need to do in order to make use of Redux stores!

## action creators

Constructing an action at the point of dispatch is a little long-winded. A common pattern is to define a number of 'action creators', functions that simply create actions (obviously!). Here are all the action creators for the todo list app:

{% highlight javascript %}
import { ITodoAction } from './reducer';

export function addItem(text: string): ITodoAction {
  return {
    type: 'ADD',
    text
  };
}

export function removeItem(itemId: string): ITodoAction {
  return {
    type: 'REMOVE',
    itemId
  };
}

export function updateItemText(itemId: string, text: string): ITodoAction {
  return {
    type: 'UPDATE_ITEM_TEXT',
    itemId,
    text
  };
}

export function updateItemCompletion(itemId: string, completed: boolean): ITodoAction {
  return {
    type: 'UPDATE_ITEM_COMPLETION',
    itemId,
    completed
  };
}
{% endhighlight %}

Notice the use of [ES6 shorthand property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer).

For completeness here's the final reducer implementation, which supports all of the above actions:

{% highlight javascript %}
export function reducer(state: List<TodoItem> = List<TodoItem>(), action: ITodoAction) {

  function indexOf(uuid: string) {
    return state.findIndex((i: TodoItem) => i.uuid === action.itemId);
  }

  switch (action.type) {
    case 'ADD':
      return state.push(new TodoItem().setText(action.text));
    case 'REMOVE':
      return List<TodoItem>(state.filter((i: TodoItem) => i.uuid !== action.itemId));
    case 'UPDATE_ITEM_TEXT':
      return state.update(indexOf(action.itemId), (i: TodoItem) => i.setText(action.text));
    case 'UPDATE_ITEM_COMPLETION':
      return state.update(indexOf(action.itemId), (i: TodoItem) => i.setCompleted(action.completed));
    default:
      return state;
  }
}
{% endhighlight %}

Within the todo list component, which handles events emitted by the todo item instances, it simply needs to create the correct action and dispatch:

{% highlight javascript %}
export default class TodoList {

  ...

  itemUpdated(event: ItemUpdatedEvent) {
    if (event.text !== undefined) {
      if (event.text === '') {
        this.store.dispatch(removeItem(event.itemId));
      } else {
        this.store.dispatch(updateItemText(event.itemId, event.text));
      }
    }
    if (event.completed !== undefined) {
      this.store.dispatch(updateItemCompletion(event.itemId, event.completed));
    }
  }
}
{% endhighlight %}

The above code is really quite elegant. If the use of string literals for action types (`UPDATE_ITEM_TEXT` etc ...) offends you, then by all means replace them with constants!

## State Persistence

The above code provides all the functionality needed to add / remove / update items, however, these changes are not persisted. In the earlier implementation `persistChanges` was invoked whenever the app state changed. With Redux this is a whole lot simpler, the only place where the state can possibly change is within the reducer. This makes the management of state really easy.

Loading initial state simply involves obtaining the data from local storage, parsing, then supplying the initial state to the redux `createStore` function. The store's `subscribe` method can be used to receive state change notifications, allowing all the persistence logic to be located in one place, in this case the constructor:

{% highlight javascript %}
export default class TodoStore {
  store: Redux.Store;

  constructor(monitor: StateMonitor) {
    const storedItemsString = <string> localStorage.getItem('todolist') || '[]';
    const storedItems = <Array<any>> JSON.parse(storedItemsString);
    const items = List<TodoItem>(storedItems.map(i => new TodoItem(i._data)));
    this.store = createStore(reducer, items);

    this.store.subscribe(() => {
      localStorage.setItem('todolist', JSON.stringify(this.items.toJS()));
    });
  }
  ...
 }
 {% endhighlight %}

## Time Travel

The underlying concept of Redux, where the application state can be determined by reducing all the actions performed to some initial state, is not only elegant, it is also very powerful. If you want to track state changes in your application, you simply need to log all of the actions that are dispatched. However, by recording these actions you can potentially replay them or perform rollbacks.

In this section I'll show a quick-and-dirty time travel implementation that allows you to log state changes and roll-back to a previous state.

Redux has a middleware concept which allows you to add functionality around the dispatcher. I'm not going to go into details here, Redux has a [very detailed discussion of the middleware concept](http://redux.js.org/docs/advanced/Middleware.html), and there are other [great articles on the topic](https://medium.com/@meagle/understanding-87566abcfb7a#.9spm0k5p3).

The following is a class that provides a Redux middleware component that stores each action and the resulting new state:

{% highlight javascript %}
class StateLogItem {
    action: any;
    state: any;
    uuid: string;
}

export default class StateMonitor {
    stateLog: StateLogItem[] = [];

    middleware(): Redux.Middleware {
        return (store: Redux.Store) =>
            (next: any) => (action: any) => {
                let result = next(action);
                if (action.type !== 'ROLLBACK') {
                    this.stateLog.push({
                        action,
                        state: store.getState(),
                        uuid: uuid.v4()
                    });
                }
                return result;
            };
    }
}
{% endhighlight %}

(Yes, the Redux functional concepts really are an uncomfortable fit with ES6 classes!)

You can see a new action type, `ROLLBACK`, we'll get to that shortly.

Redux middleware is introduced at the point where a store is constructed:

{% highlight javascript %}
const creator = applyMiddleware(monitor.middleware())(createStore);
this.store = creator(reducer, items);
{% endhighlight %}

With the above code in place, the `StateMonitor` class can be injected into an Angular 2 component which displays each action and the state after the action has been applied (or reduced):

<img src="{{ site.baseurl }}/ceberhardt/assets/angular2/monitor.png" />

The component that renders the action / state log on the left-pane detects click events, dispatching a `ROLLBACK` action to the store when this occurs.

The state monitor class can adapter the existing reducer to handle this action (the default reducer implementation simply ignores any unknown actions):

{% highlight javascript %}
reducer(adaptee: Redux.Reducer): Redux.Reducer {
    return (state: any, action: any) => {
        if (action.type === 'ROLLBACK') {
            const index = this.stateLog.findIndex((i: StateLogItem) => i.uuid === action.logItem.uuid);
            state = this.stateLog[index].state;
            this.stateLog = this.stateLog.slice(0, index + 1);
        }
        return adaptee(state, action);
    };
}
{% endhighlight %}

The above adapter is applied at the point where the store is created:

{% highlight javascript %}
const creator = applyMiddleware(monitor.middleware())(createStore);
this.store = creator(monitor.reducer(reducer), items);
{% endhighlight %}

With this simple update the app now supports time travel, you can click on any action to roll-back to the previous state.

It would be pretty easy to extend the application to store the state-log in localStorage to allow you to replay actions, which would be a great aid to development and testing.

The sourcecode for this app is [available on GitHub](https://github.com/ColinEberhardt/angular2-todo), although the time-travel code is on a [different branch](https://github.com/ColinEberhardt/angular2-todo/tree/redux-time-travel) for clarity.

Regards, Colin E.
