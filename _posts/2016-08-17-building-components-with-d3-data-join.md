---
title: Building Components with D3 Data Join
date: 2016-08-17 00:00:00 Z
categories:
- cprice
- Tech
author: cprice
layout: default_post
summary: This post quickly introduces data join before moving on to some of the edge
  cases we've run into when building components on top of data join. It covers how
  you can solve them with vanilla D3 and why you might find our d3fc-data-join component
  useful.
---

You can't build much with D3 without running into data joins. Whilst I found them initially cryptic, I've come to appreciate them as a simple but powerful primitive for binding data to the DOM. [Mike Bostock](https://twitter.com/mbostock) (the author of D3) has already created a number of tutorials on the subject, [Thinking with Joins](https://bost.ocks.org/mike/join/), The  [General Update Pattern](http://bl.ocks.org/mbostock/3808218) series and [Towards Reusable Charts](https://bost.ocks.org/mike/chart/) are definitely worth a read.

In this post, I'll quickly introduce data join before moving on to some of the edge cases we've run into when building components on top of data join. I'll cover how you can solve them with vanilla D3 and why you might find our [d3fc-data-join](https://github.com/d3fc/d3fc-data-join) component useful.

It's worth noting that all code in this post uses the newly released D3v4 which features some minor (and some less minor) [changes from version 3](https://github.com/d3/d3/blob/v4.2.2/CHANGES.md). The most structurally significant change is D3v4's approach of composing itself of small, focused modules rather than the monolithic library it once was. Not only does that have the potential for making your production bundles much leaner, it also paves the way for easily mixing-in third-party components such as d3fc-data-join.

## (Another) Introduction to Joins

Data join is typically used to associate `n` data items with `n` DOM nodes of the same type. E.g. for each item in the `animals` array, insert an `li` element at the correct index, set a class `animal` on it to allow us to find it on the next pass and set its `innerText` to the item's value.

Assuming we have a DOM containing a single empty `ul`, we can implement this easily using vanilla `d3-selection` code -

~~~ javascript
const animals = ['Pigeon', 'Pigeon', 'Pigeon'];

let render = (data) => {
  d3.select('ul')
    .selectAll('li.animal')
    .data(data)
    .enter()
      .append('li')
      .attr('class', 'animal')
      .text(d => d);
};

render(animals);
~~~

Which yields the following -

~~~ html
<ul>
  <li class="animal">Pigeon</li>
  <li class="animal">Pigeon</li>
  <li class="animal">Pigeon</li>
</ul>
~~~

All good. Now let's add the proverbial cat -

*N.B. To demonstrate its idempotent nature, the following code snippets can be run in the console of the page without reloading it.*

~~~ javascript
render([...animals, 'Cat']);
~~~

Again so far, so good -

~~~ html
<ul>
  <li class="animal">Pigeon</li>
  <li class="animal">Pigeon</li>
  <li class="animal">Pigeon</li>
  <li class="animal">Cat</li>
</ul>
~~~

Although, we all know how that ends -

~~~ javascript
render(animals.filter(animal => animal !== 'Pigeon'));
~~~

Or do we... -

~~~ html
<ul>
  <li class="animal">Pigeon</li>
  <li class="animal">Pigeon</li>
  <li class="animal">Pigeon</li>
  <li class="animal">Cat</li>
</ul>
~~~

## Idempotency

One of the problems with the simplistic data join shown above is that we're not informing d3 of how to deal with DOM nodes when their associated data item changes. To add that in, we need to change the render method -

~~~ javascript
render = (data) => {
  const update = d3.select('ul')
    .selectAll('li.animal')
    .data(data);
  const enter = update.enter()
    .append('li')
    .attr('class', 'animal');
  update.merge(enter)
    .text(d => d);
};

render(animals.filter(animal => animal !== 'Pigeon'));
~~~

The snippet above uses the enter selection to add any required new DOM nodes (in this case there are already more DOM nodes than data items so none are added), then [merges](https://github.com/d3/d3-selection#selection_merge) the new DOM nodes in with the existing DOM nodes (remember that initially the DOM contains 4 nodes - one for each data item from the `render([...animals, 'Cat']);` call) before updating their associated text.

Whilst the result is (marginally) closer to what we expected, we've somehow managed to produce a clone of our rather lazy cat -

~~~ html
<ul>
  <li class="animal">Cat</li>
  <li class="animal">Pigeon</li>
  <li class="animal">Pigeon</li>
  <li class="animal">Cat</li>
</ul>
~~~

This is because we've not informed d3 of how to deal with the removal of data items i.e. what to do with DOM nodes for which there aren't associated data items. We can do that with another change to the render method -

~~~ javascript
render = (data) => {
  const update = d3.select('ul')
    .selectAll('li.animal')
    .data(data);
  const enter = update.enter()
    .append('li')
    .attr('class', 'animal');
  update.merge(enter)
    .text(d => d);
  update.exit()
    .remove();
};

render(animals.filter(animal => animal !== 'Pigeon'));
~~~

Now finally we've got the result that we expected -

~~~ html
<ul>
  <li class="animal">Cat</li>
</ul>
~~~

This is now what we refer to as an idempotent transformation of the data items into DOM nodes. No matter how many times we run the render method -

~~~ javascript
render(animals.filter(animal => animal !== 'Pigeon'));
render(animals.filter(animal => animal !== 'Pigeon'));
render(animals.filter(animal => animal !== 'Pigeon'));
~~~

As the input data is unchanged, the output is stable -

~~~ html
<ul>
  <li class="animal">Cat</li>
</ul>
~~~

At its core, this is the boilerplate that the `dataJoin` component wraps up for you. This means we can rewrite `render` as -

~~~ javascript
const join = fc.dataJoin('li', 'animal');

render = (data) => {
  join(d3.select('ul'), data)
    .text(d => d);
}
~~~

Whist this alone can save a lot of boilerplate, there are a few other, more subtle (but useful!) features that are worth knowing about which are discussed in more detail below.

## Decoration

When building components we've found that it's incredibly hard to strike the right balance between configurability and simplicity. Simplicity is a great feature because it means an easier learning curve for new users and less bug-prone code for us to maintain. Configurability is a great feature because it allows users to get exactly the behaviour they want out of the component. However, the two are almost always at odds with each other: adding more configurability invariably means more complex code.

We stumbled across a novel solution to this which was a side-effect of a design decision we made when we first started [d3fc](https://d3fc.io). We set out to create components which fully embraced D3, as opposed to attempting to abstract it away from users.

This is done in a number of ways, be it following d3's component pattern, sticking to established patterns for callback arguments or producing small focused components. By presenting D3 front and center, it allows us to expose some incredibly powerful, low-level hooks into the internal selections that power our components.

These hooks allow for everything from basic styling or alignment tweaks, through to completely new functionality. Whilst they can sometimes feel a bit like dirty hacks, there's definitely a pragmatic balance to be struck between writing a component from scratch and tweaking the output of an existing well-tested component.

For the sake of an example, let's create a very simple vanilla D3 component which renders 3 list items -

~~~ javascript
const component = () => {

  const instance = (selection) => {
    const update = selection.selectAll('li')
      .data(d => [d, d, d]);
    const enter = update.enter()
      .append('li');
    update.merge(enter)
      .text((d, i) => i);
    update.exit()
      .remove();
  };

  return instance;
};
~~~

Now let's assume we want a component which does exactly the same thing, but our customer has decreed that the second item in the list should always be red. We could easily copy/paste the component and add in the relevant code -

~~~ javascript
const component = () => {

  const instance = (selection) => {
    const update = selection.selectAll('li')
      .data(d => [d, d, d]);
    const enter = update.enter()
      .append('li')
      .style('color', (d, i) => i == 1 ? 'red' : 'black');
    update.merge(enter)
      .text((d, i) => i);
    update.exit()
      .remove();
  };

  return instance;
};
~~~

This isn't always a bad idea, in fact if you're making significant changes to the functionality it's exactly what we recommend doing. However, for such a small tweak it seems a shame to have to inherit the burden of all of that code.

Another [common approach](http://bl.ocks.org/mbostock/4403522) is to amend the DOM after the component has rendered -

~~~ javascript
const instance = component();

const render = () => {
  d3.select('ul')
    .call(instance)
    .selectAll('li')
    .style('color', (d, i) => i == 1 ? 'red' : 'black');
};
~~~

This approach works well but sometimes you want to be able to optimise your tweak by only applying changes when nodes enter or exit the selection. Obviously in this case the impact is going to be insignificant but on larger selections it can be more important.

To allow this we can extend our component to support a `decorate` function -

~~~ javascript
const component = () => {
  let decorate = () => {};

  const instance = (selection) => {
    const update = selection.selectAll('li')
      .data(d => [d, d, d]);
    const enter = update.enter()
      .append('li');
    update.merge(enter)
      .text((d, i) => i);
    const exit = update.exit()
      .remove();

    update.enter = () => enter;
    update.exit = () => exit;
    decorate(update);
  };

  instance.decorate = (...args) => {
    if (!args.length) {
      return instance;
    }
    decorate = args[0];
    return instance;
  };

  return instance;
};
~~~

Note that the enter selection exposed here is *real* selection containing the newly inserted nodes. This means we can use the decorate like so -

~~~ javascript
const instance = component()
  .decorate(update => {
    update.enter()
      .style('color', (d, i) => i == 1 ? 'red' : 'black');
  });

const render = () => {
  d3.select('ul')
    .call(instance);
};
~~~

As well as having access to the `enter`/`exit` selections, this approach more clearly associates the tweaks with the components they correspond to, rather than cluttering up the render function.

If we wanted to implement the equivalent with `d3fc-data-join`, the component would simplify down to -

~~~ javascript
const component = () => {
  let decorate = () => {};

  const join = fc.dataJoin('li');

  const instance = (selection) => {
    const update = join(selection, d => [d, d, d])
      .text((d, i) => i);
    decorate(update);
  };

  instance.decorate = (...args) => {
    if (!args.length) {
      return instance;
    }
    decorate = args[0];
    return instance;
  };

  return instance;
};
~~~

Whilst there'll never be a clear cut line for when to tweak versus copy/paste, this pattern at least helps you organise your code on larger projects.

## Child versus descendent selector

When creating reusable components you can't always guarantee how they're going to be used. One issue we've previously run into was unexpected behaviour when one of our components was nested within itself.

Let's assume we are trying to create a two-level deep tree of `p` elements from the following recursive data structure -

~~~ javascript
const root = [
  [ 1, 2, 3 ],
  [ 2, 4, 6 ],
  [ 3, 6, 9 ]
];
~~~

The following component renders an element for each item in the associated array and recursively calls itself to render any nested array.

*N.B. I've chosen to omit class names for brevity. However, adding them has no effect on the outcome.*

~~~ javascript
const component = (selection) => {
  // recursive base condition not an optimisation
  if (selection.empty()) {
    return;
  }

  const update = selection.selectAll('p')
    .data(d => d);

  const enter = update.enter()
    .append('p');

  update.exit()
    .remove();

  update.merge(enter)
    .attr('data-d', d => d)
    .call(component);
};

const render = () => {
  d3.select('body')
    .datum(root)
    .call(component);
};

render();
~~~

Which renders, as expected, the following structure -

~~~ html
<p data-d="1,2,3">
  <p data-d="1"></p>
  <p data-d="2"></p>
  <p data-d="3"></p>
</p>
<p data-d="2,4,6">
  <p data-d="2"></p>
  <p data-d="4"></p>
  <p data-d="6"></p>
</p>
<p data-d="3,6,9">
  <p data-d="3"></p>
  <p data-d="6"></p>
  <p data-d="9"></p>
</p>
~~~

However, when we attempt to re-render the component. Suddenly, it all goes very wrong... -

~~~ html
<p data-d="1,2,3">
  <p data-d="1"></p>
  <p data-d="2"></p>
  <p data-d="3"></p>
</p>
~~~

The problem is that `selectAll` doesn't just select children, it selects any matching descendants. This didn't matter the first time we rendered because there were no elements to select. However, on the second render the top-level invocation of `selectAll` selects not only the top-level elements but additionally all of *their* children.

As there are now more elements than data items, all but the first 3 are removed (matching the 3 top-level data items) and the remaining are assigned the top-level values -

~~~ html
<p data-d="1,2,3">
  <p data-d="2,4,6"></p>
  <p data-d="3,6,9"></p>
</p>
~~~

The component then recurses on the first element, which performs the data join on its descendants, assigning the expected values and adding the missing element -


~~~ html
<p data-d="1,2,3">
  <p data-d="1"></p>
  <p data-d="2"></p>
  <p data-d="3"></p>
</p>
~~~

To fix this we can explicitly provide the children to `selectAll` and then `filter` it down to just the matching elements -


~~~ javascript
const parentNodes = selection.nodes();

const update = selection.selectAll((d, i, nodes) => nodes[i].children)
  .filter('p')
  .data(d => d);
~~~

This additional filter is implicit in the `d3fc-data-join` component. Therefore you can rewrite the above as -

~~~ javascript
const join = fc.dataJoin('p');

const component = (selection) => {
  if (selection.empty()) {
    return;
  }

  join(selection, d => d)
    .attr('data-d', d => d)
    .call(component);
}
~~~

*In this case, you actually don't need to specify the second argument to `join`. The component defaults this to be the identity function.*

Whilst a subtle detail, this additional filter can help prevent a lot of head scratching later.

## Natural transitions

Whilst not every situation calls for transitions, it's can be quite a jarring experience for things to suddenly appear or disappear. Things tend to feel more natural when they transition into place, be that growing, moving or simply fading into position.

To demonstrate transition support, let's create a buffer of up to 3 items, add an item every second and flush the buffer when it's full -

~~~ javascript
const data = [];
setInterval(() => {
  if (data.length < 3) {
    data.push(data.length);
  } else {
    data.length = 0;
  }
  render(data);
}, 1000);
~~~

Now let's wire it up, let's assume the simplest case of fading in or out elements. Whilst `d3-selection` provides the fundamentals of interacting with the DOM, transitions are layered on top by the optional `d3-transiton` -

~~~ javascript
const transition = d3.transition()
  .duration(500);

const effectivelyZero = 1e-6;

const render = (data) => {
  const update = d3.select('ul')
    .selectAll('li')
    .data(data);
  const enter = update.enter()
    .append('li')
    .style('opacity', effectivelyZero)
    .transition(transition)
    .style('opacity', 1);
  update.merge(enter)
    .text(d => d);
  update.exit()
    .transition(transition)
    .style('opacity', effectivelyZero)
    .remove();
};
~~~

First we establish a top-level transition on the document's root element (the implicit target of `d3.transition()`), with a half second duration, the default of no delay and default easing. As we've specified this on the document root, we can use these transition timings any element in the document by supplying a reference to it when we invoke `selection.transition()`. The returned selection will now follow the root transition's timings.

For the fade effect itself, we'll transition the `opacity` of the element from `0` to `1` for the fade-in and `1` to `0` for the fade-out. However, rather than starting at `0`, we use the constant `effectivelyZero`. This is to avoid glitching the transition at very small values when JavaScript switches from decimal notation (e.g. `0.01`) to exponential notation (e.g. `1e-2`).

The data-join component includes a default fade in/out transition. This was added because we've found it to be the most common transition. Even when there's a more complex transition being applied, a fade effect tends to be the foundation of it.

Therefore using the component, the above can be rewritten as -

~~~ javascript
const render = (data) => {
  const transition = d3.transition()
    .duration(500);

  const join = fc.dataJoin('li')
    .transition(transition);

  join(d3.select('ul'), data)
    .text(d => d);
};
~~~

If we wanted to disable the implicit transition we could choose not include `d3-transition`, we could supply a transition with a zero duration or we could override the opacity values in the returned `enter`/`exit` selections.

In the following example we negate the default fade in/out transition, by explicitly setting the opacity value, and replace it with a fly-in/out transition -

~~~ javascript
const render = (data) => {
  const transition = d3.transition()
    .duration(500);

  const join = fc.dataJoin('li')
    .transition(transition);

  const update = join(d3.select('ul'), data)
    .text(d => d);
  update.enter()
    .style('opacity', 1)
    .style('margin-left', '-100px')
    .transition(transition)
    .style('margin-left', '0px');
  update.exit()
    .transition(transition)
    .style('opacity', 1)
    .style('margin-left', '-100px');
};
~~~

We've found that it's rare to want to remove the default fade in/out transition and in many cases its unnecessary to go for anything more complex.

## Implicit ordering

By default, all data-joins have an implicit index-based key. This means that a node from the selection is joined with an item from the data when their respective indices match. Whilst this covers most basic usages of data-join, it's not long before you want to join on something more solid.

Specifying a key function allows complete control over the join. If your data items have intrinsic identifiers, then you could use them -

~~~ javascript
const render = (data) => {
  const update = d3.select('ul')
    .selectAll('li')
    .data(data, d => d.id);
  const enter = update.enter()
    .append('li')
    .attr('data-id', d => d.id);
  update.merge(enter)
    .text(d => d.value);
  update.exit()
    .remove();
};

render([
  { id: 1, value: 'Bob' },
  { id: 2, value: 'Carol' }
]);
~~~

Which produces the following DOM structure -

~~~ html
<ul>
  <li data-id="1">Bob</li>
  <li data-id="2">Carol</li>
</ul>
~~~

**In older versions (pre-v4) of D3** a problem used to occur when using non-index based keys and trying to insert an item anywhere other than at the end of the list -

~~~ javascript
render([
  { id: 0, value: 'Alice' },
  { id: 1, value: 'Bob' },
  { id: 2, value: 'Carol' }
]);
~~~

~~~ html
<ul>
  <li data-id="1">Bob</li>
  <li data-id="2">Carol</li>
  <li data-id="0">Alice</li>
</ul>
~~~

This happened because the data-join established that there were less nodes than items and so, as we'd instructed it to do, appended a new node. As the existing nodes already had an association with the existing data items through the identifier-based key function they remained associated and the new data item was associated with the new node.

With an index-based join, the new node would have been appended to the end in the same way. However, the data would then have been re-assigned to all of the nodes such that the indices matched causing the result to look correct.

To get the expected result (**pre-v4**) instead of `append`ing the new node we had to `insert` it instead. However, D3 v4 fixes this unexpected behaviour. `append` will now insert the node in the expected location. This guarantees the node ordering will match the data as long as the order of the data does not change.

*Confusingly the old behaviour is now available by using `insert` which [caught us out](https://github.com/d3fc/d3fc-data-join/issues/19)!*

The data-join component allows you to specify a key and internally makes use of `append` to ensure nodes are initially inserted in their correct location -

~~~ javascript
const render = (data) => {
  const join = fc.dataJoin('li')
    .key(d => d.id);

  join(d3.select('ul'), data)
    .text(d => d.value);
};
~~~

One final twist to be aware of is when you do need to change the order of the data. In this case, you can use `d3-selection`'s [order](https://github.com/d3/d3-selection#selection_order) to re-insert the nodes at their correct location -

~~~ javascript
const render = (data) => {
  const join = fc.dataJoin('li')
    .key(d => d.id);

  join(d3.select('ul'), data)
    .order()
    .text(d => d);
};
~~~

This functionality is not built-in to the component as it can introduce a significant performance cost for large selections and order isn't always important e.g. when rendering a bar chart or a map.

## Check it out

It's important to note that we created the [d3fc-data-join](https://github.com/d3fc/d3fc-data-join) module to simplify some of the common problems with data join that we ran into *with our particular usage patterns*. These are not going to be universally applicable. As always it's important to understand the abstraction and in many cases a vanilla data join may be simpler or perform better.

Instructions for installing and using the [d3fc-data-join](https://github.com/d3fc/d3fc-data-join) component are available on GitHub.
