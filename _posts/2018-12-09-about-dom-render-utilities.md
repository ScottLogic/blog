---
title: About DOM render utilities
date: 2018-12-09 00:00:00 Z
categories:
- Tech
tags:
- JavaScript
- DOM
author: msuperina
layout: default_post
summary: This article describes an experiment about building my own DOM render utilities.
  It is written incrementally following a sequence of commits, each of which brings
  in a new feature. The results are a tiny library, some learning along the way, and
  too many questions left unsolved !
---

This article describes an experiment I wanted to try for a long time: build my 
own DOM render library.
Although React and other similar libraries are a clear inspiration, this is not 
an attempt to build a clone or describe their internals: there are so many texts 
discussing those subjects already. Instead, this is simply a personal reflection 
about what are the problems to solve and what solutions can be adopted. 
Anything written here may be incomplete or simply wrong :)
The full source code can be found 
[here](https://github.com/msuperina/dom-manipulation) 
and the commits order try to reflect the different parts discussed below.

## Abstract the Document API

Component declarations have great benefits in terms of readability.
Take this News component for example: we can quickly visualize how news 
translates to an HTML element. 

~~~jsx
function News({ news }) {
    const { content, image, updatedAt, url } = news;
    return (
        <a href="url">
            <span className="block">
                <span>{updatedAt}</span>
                <span>{content}</span>
                <img src={image.src} />
            </span>
        </a>
    );
}
~~~

Now let's suppose for a moment the function returns an actual element and
translate the previous function into a raw implementation.

~~~js
function News({ news }) {
    const { content, image, updatedAt, url } = news;

    const linkEl = document.createElement("a");
    linkEl.setAttribute("href", url);

    const blockEl = document.createElement("span");
    blockEl.className = "block";

    const updatedAtEl = document.createElement("span");
    updatedAtEl.appendChild(document.createTextNode(updateAt));

    const contentEl = document.createElement("span");
    contentEl.appendChild(document.createTextNode(content));

    const imageEl = document.createElement("image");
    imageEl.setAttribute("src", image.src);

    blockEl.appendChild(updatedEl);
    blockEl.appendChild(contentEl);
    blockEl.appendChild(imageEl);
    
    linkEl.appendChild(blockEl);

    return linkEl;
}
~~~

Hopefully, we can identify a pattern to create elements without the verbosity. 
[Some](https://mochi.github.io/mochikit/doc/html/MochiKit/DOM.html#fn-createdom) 
[libraries](https://mochi.github.io/mochikit/doc/html/MochiKit/DOM.html#id5) 
already provided utilities more than 15 years ago and assuming we do not have 
to deal with old browser legacies, we can simply do the following.

~~~js
function News({ news }) {
    const { content, image, updatedAt, url } = news;
    return el("a", { href: url },
        el("span", { class: "block" }, 
            el("span", null, t(updatedAt)),
            el("span", null, t(content)),
            el("img", { src: image.src })
        )
    );
}

function el(tagName, props, ...children) {
    props = props || {};
    children = children || [];
    if (Array.isArray(children[0])) {
        children = children[0];
    }

    const element = document.createElement(tagName);
    Object.keys(props).forEach(key => element.setAttribute(key, props[key]));

    if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            element.appendChild(children[i]);
        }
    }

    return element;
}

function t(text) {
    return document.createTextNode(text);
}
~~~

And append the created elements into a host node.

~~~js
function append(parentNode, fn, props) {
    const element = fn(props);
    parentNode.appendChild(element);
}

append(/* some host node */, News, /* some news */);
append(/* some host node */, News, /* some other news */);
~~~

## Update the DOM

We now know how to create and append elements. But in an interactive web 
application we need to update their contents when their underlying model 
changes. 
Let's start with a very naive approach and modify our `append` to return an
`update` function that given new props replaces the appended element.

~~~js
function append(parentNode, fn, props) {
    let element = fn(props);
    parentNode.appendChild(element);

    return function update(nextProps) {
        const nextNode = fn(nextProps);
        if (nextNode !== element) {
            parentNode.replaceChild(nextNode, element);
            element = nextNode;
        }
    };
}

// given some news 
// create an element
// and append it to a host node
const update = append(/* some host node */, News, /* some news */);

// when the news changes update the element
update(/* updated news */);
~~~

## Prevent unnecessary updates

If you tried to run the demo at 
[this point](https://github.com/msuperina/dom-manipulation/commit/048209c5dab1fd7d1d51d5c633865ec30ae4d33e) 
you would notice an undesired behaviour: `update` always replaces the previous 
element with a new one, even when the new props have not changed. Something we 
definitely want to avoid.
This is where some libraries compute a virtual DOM, compare it with the current 
DOM and decide whether or not to update the element and how to do it. Because 
eventually in the browser platform the bottleneck is the reflow phase.  
We are not going to implement a virtual DOM or use an existing implementation. 
Instead we are just going to compare the previous props with the next ones and 
decide whether the function to create a new element should be invoked at all.

The problem now is how can we keep track of the previous state of an element 
and maintain a similar straightforward API (`append`, `el` and `t`) ?

After trying various approaches I came to the same conclusion as other 
libraries. We need a cache to store the elements created and the props passed 
to create those elements. Every time we call `el` instead of directly creating 
an element we need to: 

- lookup the cache
- if cache miss create an element
- otherwise compare the previous props with the next props
- if the next props indicate a need to update then create a new element
- otherwise keep the previous element
- store the next props and element in the cache
- return the element currently stored in the cache

In order to leverage the cache we need to modify the `el` function. Rather than
returning an element we can return a function. This function would take a 
`cache` instance as argument and invoke its bound `lookup` function with the new 
props, children and a function which wraps the previous `el` to create the new 
element.

~~~js
function el(tagName, props, ...children) {
    props = props || {};
    children = children || [];
    if (Array.isArray(children[0])) {
        children = children[0];
    }

    return cache => {
        const childrenNodes = children.map(child => child(cache));
        return cache.lookup(props, childrenNodes, () => createEl(tagName, props, childrenNodes));
    };
}
~~~

We can update our `append` function to create a cache, inject it in the call to 
`el` at the root of the elements hierarchy, and `flush` the cache once the 
element is appended before any call to `update` (we will shortly see the details 
of `lookup` and `flush`).
For any `update` we can apply the same mechanism: inject the `cache` in the call 
to `el`, replace the element if necessary and `flush` the cache when done. 

~~~js
function append(parentNode, fn, props) {
    const cache = new Cache();
    let element = cache.lookup(props, undefined, () => fn(props)(cache));
    parentNode.appendChild(element);
    cache.flush();

    return function update(nextProps) {
        const nextNode = cache.lookup(nextProps, undefined, () => fn(nextProps)(cache));
        if (nextNode !== element) {
            parentNode.replaceChild(nextNode, element);
            element = nextNode;
        }
        cache.flush();
    };
}
~~~

This may sound a little obscure but in fact it is quite rudimentary: when the 
`append` creates a new `Cache` two arrays of previous and next entries are 
created, both empty - an entry is an object representing an element and its 
state. 
The `lookup` and `flush` functions are bound to these entries when called with 
the cache context and can now be used to perform operations on those specific
entries. 

~~~js
class Cache {

    constructor() {
        this.previous = [];
        this.next = [];
    }
~~~

Here is a reminder of the `News` component passed to the `append` function.

~~~js
function News({ news }) {
    const { content, image, updatedAt, url } = news;
    return el("a", { href: url },
        el("span", { class: "block" }, 
            el("span", null, t(updatedAt)),
            el("span", null, t(content)),
            el("img", { src: image.src })
        )
    );
}
~~~

When `append` creates the cache for this component, we consider all the `el` and
`t` calls (the `a` root, the various `span` and the `img`) as declarations of 
elements to be stored in the component's cache. Hence the component will store 
the elements and states of its direct children and of all the nested children 
(more on this in the next paragraph).

We can now look at the `lookup` and `flush` functions in detail. Let's start 
with `flush` as it's the easiest. All it does is move the next entries in the
previous ones and empty the previous entries.

~~~js
    flush() {
        this.previous = this.next;
        this.next = [];
    }
~~~

It is invoked only when a component is fully resolved and all its nested 
children are in a stable state. The component is now ready to receive new props 
and start a new update cycle again.

The `lookup` function is at the core of the logic. 
It inspects the cache passed as context by the caller. The cache contains an 
array of previous entries and next entries.
Each entry contains an element, the props and children used to create it and 
a flag indicating if the element should update.
The lookup function inspects the previous and next entries to decide if the 
current element needs to be updated or not, and updates the cache accordingly.
To understand this function it is important to recall the signature of the 
function `el` used to create an element: `el(tagName, props, children)`. When 
calling `el` the children (if any) have been already resolved, which means the 
lookup calls to resolve those children have already been made. The purpose of 
the update flag is to allow a child to indicate to its parent whether it has 
been updated or not. 
If it has updated then the parent needs to update because only one update is 
made per component, at the component's root level.
If none of the children have updated then the next props are compared to the 
previous ones. For now by compare we mean shallow equal. 
Once all this is done we update the cache entry for the current element. 
If an update is needed we create a new element and return it otherwise we return 
the previous element. 

~~~js
    lookup(props, children = [], createFn) {
        const previousEntry = lookupPreviousEntry.call(this) || {};
    
        const nextChildren = lookupNextChildren.call(this, children);
        const shouldUpdate = nextChildren.shouldUpdate || shouldSelfUpdate(props, previousEntry.props || {});
        const element = shouldUpdate ? createFn() : previousEntry.element;

        this.next.push({
            element,
            props,
            children: nextChildren.entries,
            shouldUpdate            
        });
            
        return element;        
    }
~~~  

With this implementation in place let's write a few tests to check the 
rendering is done when necessary and avoided otherwise.
The tests are written with Jest which ships with jsdom and simulates a DOM 
environment. 

~~~js
import * as component from "../src/component";

describe("append", () => {

    function Div({ width, height }) {
        return component.el("div", { width, height });
    }

    let hostNode;
    let update;
    let elSpy;

    beforeEach(() => {
        hostNode = document.createElement("div");
        elSpy = jest.spyOn(component, "el")
        update = component.append(hostNode, Div, { width: 100, height: 200 });
        elSpy.mockClear();
    });

    it("when props change update replaces the element", () => {
        update({ width: 100, height: 300 });
        expect(elSpy).toHaveBeenCalledTimes(1);
    });

    it("when props do not change update does not replace the element", () => {
        update({ width: 100, height: 200 });
        expect(elSpy).not.toHaveBeenCalled();
    });
});
~~~

If we run the tests we can see both pass. Our code is now able to skip any DOM
manipulation when not necessary !

## Introducing components

Our code is too simplistic at the moment. An essential feature we need to 
introduce is the ability to declare components as children.
So far we have our `News` component with nested `el` and `t` declarations. 
Suppose we want to declare a list of news. Let's introduce a `c` function in 
order to declare a component within another component declaration.

~~~js
function NewsList({ list }) {
    const [one, two] = list;
    return el("ul", null, 
        c(News, { news: one }),
        c(News, { news: two }),
    );
}
~~~

We are also going to change the cache mechanism and create one cache per 
component instead of a single cache at the root level. Consider these 
declarations of news and news list.

~~~js
function News({ news }) {
    const { content, image, updatedAt, url } = news;
    if (url) {
        return el("a", { href: url },
            el("span", { class: "block" }, 
                el("span", null, t(updatedAt)),
                el("span", null, t(content)),
                el("img", { src: image.src })
            )
        );
    }
    return null;
}

function NewsList({ list }) {
    const [one, two] = list;
    return el("ul", null, 
        el("li", null, 
            one 
                ? c(News, { news: one })
                : null,
        )
        el("li", null, 
            c(News, { news: two })
        ),
    );
}
~~~

Expanding all the possible combinations of elements can become quite difficult, 
as each component entries should be the union of all the possible children 
entries, and this mechanism would be applied recursively to all the children.
Instead, if we have one cache per component and each component creates entries 
for the elements it declares, things become much easier to reason about.

Our `c` function will be straightforward. It does not support `children` for now
and look similar to `el`.

~~~js
function c(fn, props) {
    props = props || {};

    return cache => {
        return cache.lookup(true, props, undefined, componentCache => fn(props)(componentCache));
    };
}
~~~

First of all notice how the `lookup` signature has changed: we are passing a 
boolean flag as first argument indicating whether `lookup` is performed on a 
component or an element. For now we need to get things done and this seem to be 
a very quick and easy way, but we will probably need to refactor later on 
because such flag indicate brittle code and as we will see shortly we will need 
an `if` test in the `lookup` to make use of the flag. In fact this refactoring
could well be another article on its own depending on how we design it: we 
could for example add a build step for the components and the whole `lookup` 
logic would be completely changed and optimized.
Second, the last argument of the `lookup` signature is now a function with a 
cache as first argument, whereas `el` does not have any argument. This cache is 
the one currently consumed by the existing component instance which needs to be 
replaced. It is passed to be able to decide whether a child of this component 
should be replaced or not.

Next we need to modify is the `Cache` module. Each component will store its own 
set of entries to keep track of its children and those entries need to be passed 
from one instance of component to the one replacing it (in case a replacement 
is necessary) in order to avoid any unnecessary children replacement.
By modifying the `Cache` constructor to accept optional entries as argument we 
can pass previous entries to a new instance.

~~~js
    constructor(entries = { previous: [], next: [] }) {
        this.previous = entries.previous;
        this.next = entries.next;
    }
~~~

The `flush` function needs to be updated. For now we are only going to call 
flush from the root level and recursively flush all components with entries. 
Again, this will be subject of refactoring and we don't need to overthink at 
this early stage.

~~~js
    flush() {
        this.next
            .filter(entry => 'entries' in entry)
            .forEach(entry => this.flush.call(entry.entries));

        this.previous = this.next;
        this.next = [];
    }
~~~

Finally, the `lookup` function needs to take into account when it is called for 
an element or for a component.
When called for a component it needs to store an entries property representing 
all the children entries. 
And if the component should update it has to create a new cache from the 
previous entries, create an element with the new cache and store both the new 
element and the new cache entries.

~~~js
    lookup(isComponent, props, children, createFn) {
        // ...
        // same code as before to inspect the previous entries and create a 
        // next entry
        // ...

        if (isComponent) {
            if (shouldUpdate) {
                const cache = new Cache(previousEntry.entries);
                nextEntry.element = createFn(cache);
                nextEntry.entries = cache.entries();
            } else {
                nextEntry.element = previousEntry.element;
                nextEntry.entries = previousEntry.entries;
            }
        } else {
            nextEntry.element = shouldUpdate ? createFn() : previousEntry.element;
        }

        // ...
        // same code as before to store the next entry and return the element
        // ...    
    }
~~~

A few tests can prove our nested components are preventing unnecessary 
renderings.

~~~js
import * as component from "../src/component";

function Div({ width, height }) {
    return component.el("div", { width, height });
}

function Section({ items }) {
    const [one, two] = items;
    return component.el("section", null,
        component.c(Div, one),
        component.c(Div, two)
    );
}

describe("c", () => {

    let hostNode;
    let update;
    let elSpy;

    const one = { width: 100, height: 200 };
    const two = { width: 300, height: 400 };

    beforeEach(() => {
        hostNode = document.createElement("div");
        elSpy = jest.spyOn(component, "el");
        update = component.append(hostNode, Section, { items: [one, two] });
        elSpy.mockClear();
    });

    it("pass down props changes", () => {
        update({ items: [one, { width: 300, height: 500 }] });
        expect(hostNode.innerHTML).toBe(
            `<section>` +
            `<div width="100" height="200"></div>` +
            `<div width="300" height="500"></div>` +
            `</section>`
        );
    });

    it("update only when props change", () => {
        update({ items: [one, { width: 300, height: 500 }] });
        expect(elSpy).toHaveBeenCalledTimes(2);

        expect(elSpy.mock.calls[0][0]).toBe("section");
        expect(elSpy.mock.calls[0][1]).toBe(null);

        expect(elSpy.mock.calls[1][0]).toBe("div");
        expect(elSpy.mock.calls[1][1]).toEqual({ width: 300, height: 500 });
    });
});
~~~

This is what we want to achieve. We are able to nest components and we can 
prevent renderings which should not happen !

## Final thoughts

DOM manipulation is difficult. What was described here is a small attempt to 
automate such a hard task and take out the verbosity of the DOM API. But this is 
only the beginning. Let aside this code should be refactored (perhaps completely 
and improved), we are now facing other challenges.  

- We are only supporting a fixed amount of children: what about collections ?
- How can we modify the props comparison logic to allow different criteria than 
the default one, which is a shallow compare ? 
- How can we introduce some nice syntax like JSX ? Does it need to be a rewrite of 
the available transformations ? Because we have `c`, `el`, and `t` and perhaps 
more helper function, we cannot rely on modifying the `pragma` option.
- Can we optimize lookups by introducing a build step ? 
- Can we leverage this build step to add checks about the components we are 
declaring ? For example by restricting the possible tag names and props to the 
HTML and SVG namespaces ?
- it is probably worth having a look at how other libraries perform component 
compilation and code transformation. 

This is only the minimal amount of effort necessary to create a credible library, 
and yet there are still lots to do. 

- What about server-side rendering ? 
- Contents and html sanitizing ? 
- Event handling ? 

To name a few...
