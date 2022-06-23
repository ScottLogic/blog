---
title: Angular 2 with Immutable.JS
date: 2016-01-05 00:00:00 Z
categories:
- ceberhardt
- Tech
tags:
- featured
author: ceberhardt
layout: default_post
summary: Angular 2.0 introduces a component-based approach to building applications,
  where the rendering can be optimised by selecting a suitable change detection strategy
  for each component. This post looks at how the OnPush change detection strategy
  works quite elegantly with the concept of immutable objects as enforced by Immutable.js.
summary-short: This post looks at how the Angular 2 component-based approach to building
  applications works quite elegantly with the concept of immutable objects as enforced
  by Immutable.js
image: ceberhardt/assets/featured/angular2-tile.png
---

Angular 2.0 introduces a component-based approach to building applications, where the rendering can be optimised by selecting a suitable change detection strategy for each component. This post looks at how the `OnPush` change detection strategy works quite elegantly with the concept of immutable objects as enforced by Immutable.js.

In my [previous blog post on Angular 2.0](http://blog.scottlogic.com/2015/12/07/angular-2.html) I described how to build the classic 'todo list' application as shown below:

![enter image description here](https://raw.githubusercontent.com/ColinEberhardt/angular2-todo/angular2-beta/screenshot.png)

The app has two simple Angular components; the first is the top level todo-list, which is responsible for rendering the todo input field, and an array of items, which are themselves rendered using the todo-item component:

{% highlight html %}
<section class="main">
  <ul class="todo-list">
    <todo-item *ngFor="#item of store.items"
      [item]="item"
      (done)="removeItem($event)">
    </todo-item>
  </ul>
</section>
{% endhighlight %}

Property bindings are used to supply data to each todo-item, and event bindings are used inform the parent todo-list component of any updates, which it delegates to the store.

The previous post showed how the default change detection strategy causes a dirty check for each binding on every keypress and button-click. However as the the todo items are not mutated in the current implementation, The `OnPush` change detection strategy can be employed in order to minimise the amount of dirty checking required.

The OnPush strategy will only dirty check a component if its input properties change.

While this improves the rendering performance for the previous example, there are a couple of problems:

 1. The todo items are not strictly immutable. They are objects with setters as well as getters, and the code could accidentally be updated to break the contract I have with Angular via the `OnPush` strategy.
 2. The todo application is a little simplistic, in reality I'd also like to be able to edit the text of existing todo items rather than just delete them. In other words, I'd like them to be mutable.

How can these two issues be resolved while still benefiting from the OnPush strategy? This blog post takes a closer look ...

## Strict immutability

The first issue I am going to look at is immutability. When using the OnPush change detection strategy you are informing Angular that all the values supplied to a component (via its input properties) are immutable. If you break this contract your application will find itself in an inconsistent and somewhat unpredictable state.

Facebook's [Immutable.js](https://facebook.github.io/immutable-js/) library provides a a number of immutable JavaScript 'types', including lists and maps. In my [previous blog post on creating an Angular 2 build](http://blog.scottlogic.com/2015/12/24/creating-an-angular-2-build.html) I described how to integrate libraries such as Immutable by updating SystemJS to load the 'external' module and DefinitelyTyped to provide type information to the TypeScript compiler. You can refer to that blog post for details.

With Immutable.js integrated into the project, making the list of todo items immutable is quite straightforward. The list of todo items is changed from a JavaScript array:

{% highlight javascript %}
items: TodoItem[];
{% endhighlight %}

To a generic `List`:

{% highlight javascript %}
items = List<TodoItem>();
{% endhighlight %}

Mutation methods now create a new copy of the items rather than mutating them in-place. Here you can see the updated `addItem` method from the store:

{% highlight javascript %}
addItem(newItem: string) {
  const item = new TodoItem(newItem)
  this.items = this.items.push(item);
}
{% endhighlight %}

Making the list immutable is pretty trivial - individual items is harder.

With Immutable.js you can create immutable objects using `Map`:

{% highlight javascript %}
var map1 = Immutable.Map({a:1, b:2, c:3});
var map2 = map1.set('b', 50);
map1.get('b'); // 2
map2.get('b'); // 50
{% endhighlight %}

With a `Map` property access is performed via the `get` method, and mutations are performed via the `set` method, which returns a new instance with the mutations applied. It's clear that todo items should be map-like objects, however I don't want to lose the strong-typing that TypeScript provides.

Immutable also has the concept of a [Record](https://facebook.github.io/immutable-js/docs/#/Record) which generates property accessors in order to give a more familiar API:

{% highlight javascript %}
var ABRecord = Record({a:1, b:2});
var myRecord = new ABRecord({b:3});
myRecord.b; // 3
{% endhighlight %}

This looks more useful from a TypeScript perspective, although currently it doesn't look like there is an easy way to make an immutable Record work with interfaces as [discussed in this issue](https://github.com/facebook/immutable-js/issues/166).

I instead opted for a manual approach:

{% highlight javascript %}
/// <reference path="../../../typings/node-uuid/node-uuid-global.d.ts" />
import { List, Map } from 'immutable';

export class TodoItem {
  _data: Map<string, any>;

  get uuid() {
    return <string> this._data.get('uuid');
  }

  get text() {
    return <string> this._data.get('text');
  }

  setText(value: string) {
    return new TodoItem(this._data.set('text', value));
  }

  get completed() {
    return <boolean> this._data.get('completed');
  }

  setCompleted(value: boolean) {
    return new TodoItem(this._data.set('completed', value));
  }

  constructor(data: any = undefined) {
    data = data || { text: '', completed: false, uuid: uuid.v4() };
    this._data = Map<string, any>(data);
  }
}
{% endhighlight %}

The above class forms a very thin wrapper around an immutable Map, with property getters allowing strongly-typed access, and corresponding set methods, which return new todo item instances rather than mutating.

The one other change above is the use of [node-uuid](https://github.com/broofa/node-uuid) to generate unique identifiers for each item. With property setters copying in order to mutate, reference equality no longer makes sense.

Here's an example of this class in action:

{% highlight javascript %}
const item = new TodoItem();
const newItem = item.setText('hello world'); // calling setText() creates a new item
newItem.text; //  'hello world'
{% endhighlight %}

Now that the items are strictly immutable, enforced both at compile-time by TypeScript and runtime by Immutable.js, the use of the OnPush change detection strategy doesn't feel quite so risky.

However, this introduces another problem, ideally items in the list should be editable.

## Editing Items

The TodoMVC project has a [specification for app implementations](https://github.com/tastejs/todomvc/blob/master/app-spec.md) which I am following here.

I've updated the todo item component to have two different views, which are shown / hidden based on the `editing` class, which is bound to the `editMode` component property via the `class.editing` binding. All quite standard Angular 2 stuff ...

{% highlight html %}
<li [class.editing]="editMode" [class.completed]="item.completed">
  <div class="view">
    <input class="toggle" type="checkbox" (click)="toggle()" [checked]="item.completed">
    <label (dblclick)="enterEditMode(todoItemInput)">{{item.text}}</label>
    <button (click)="doneClicked()" class="destroy"></button>
  </div>
  <input class="edit" [value]="item.text"
    #todoItemInput
    (keyup.enter)="commitEdit(todoItemInput.value)"
    (keyup.escape)="cancelEdit(todoItemInput)"
    (blur)="commitEdit(todoItemInput.value)">
</li>
{% endhighlight %}

Double clicking the label moves the application into edit mode:

{% highlight javascript %}
enterEditMode(element: HTMLInputElement) {
  this.editMode = true;
  if (this.editMode) {
    setTimeout(() => { element.focus(); }, 0);
  }
}
{% endhighlight %}

Notice the `setTimeout` 'hack' above. I'd like to set focus on the input element when it is shown. However, I can only set focus when the item is visible. The effect of changing the `editMode` property will only be reflected in the DOM after the current VM turn (thanks to zone.js). Therefore, in order to execute my focus logic after the DOM has been updated, I use a timeout to push it onto a future VM turn.

I'd hoped that one of the [component lifecycle hooks](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html) might provide a better solution, although I haven't found a hook for this logic. Interestingly the React TodoMVC implementation [makes use of lifecycle methods in order to update focus](https://github.com/tastejs/todomvc/blob/master/examples/react/js/todoItem.jsx#L70).

If anyone has a better solution, I'd be very happy to hear about it!

The todo item component uses an event to inform the parent component of changes, here's the new event:


{% highlight javascript %}
@Output()
itemUpdated = new EventEmitter<ItemUpdatedEvent>();
{% endhighlight %}

And the corresponding interface which describes the update:

{% highlight javascript %}
interface ItemUpdatedEvent {
  itemId: string;
  text?: string;
  completed?: boolean;
}
{% endhighlight %}

When an item is committed either via a keypress or loss of focus, the event is emitted:

{% highlight javascript %}
commitEdit(updatedText: string) {
  this.editMode = false;
  this.itemUpdated.emit({
    item: this.item,
    text: updatedText
  });
}
{% endhighlight %}

Whereas a cancel just reverts the input element to its previous state:

{% highlight javascript %}
cancelEdit(element: HTMLInputElement) {
  this.editMode = false;
  element.value = this.item.text;
}
{% endhighlight %}

Notice the DOM is responsible for holding the transient state of the todo item. This may or may not be a good thing, I'm still thinking about that one!

The todo list component handles the events raised by the todo item components, delegating to the store to update the state of the app:

{% highlight javascript %}
itemUpdated(event: ItemUpdatedEvent) {
  if (event.text !== undefined) {
    if (event.text === '') {
      this.store.removeItem(event.item);
    } else {
      this.store.updateText(event.item, event.text);
    }
  }
  if (event.completed !== undefined) {
    this.store.updatedCompletion(event.item, event.completed);
  }
}
{% endhighlight %}

Within the store, the update functions (`updateText`, `updateCompletion`) find the item based on their uuid, create a new item with the updated state, then update the list:

{% highlight javascript %}
updateText(itemId: string, updatedText: string) {
  const index = this.items.findIndex((i: TodoItem) => i.uuid === itemId);
  const item = this.items.get(index);
  const newItem = item.setText(updatedText);
  this.items = this.items.set(index, newItem);
}
{% endhighlight %}

The `removeItem` method is even simpler:

{% highlight javascript %}
removeItem(item: TodoItem) {
  this.items = List<TodoItem>(this.items.filter((i: TodoItem) => i.uuid !== item.uuid));
}
{% endhighlight %}

The above all works very nicely with the OnPush strategy. When an item is edited, the updates are applied via the store and the original todo item is replaced with a new one with the updated state. As a result the `item` property of the todo item component is changed (to reference this new object) and as a result the component is re-rendered.

I've [updated the GitHub repo with these changes](https://github.com/ColinEberhardt/angular2-todo). From my perspective, Angular 2 and Immutable.js work really well together. I'm looking forwards to exploring these concepts further!

Regards, Colin E.
