---
title: 'Introducing: React Hooks for OpenFin'
date: 2019-09-06 00:00:00 Z
categories:
- Tech
tags:
- featured
author: dkerr
title-short: OpenFin React Hooks
layout: default_post
image: dkerr/assets/featured/react.png
summary: An introduction to our recently released open-source React Hooks library, OpenFin React Hooks. Developed especially for OpenFin and its developer community.
---

There's been a lot of excitement recently around the addition of [Hooks into React](https://reactjs.org/docs/hooks-intro.html).
This has resulted in numerous popular React libraries building their own React Hooks to provide a modern way for developers to integrate them into their React applications.

While this has been bubbling away, I've been busy with a few client projects that have been built on top of [OpenFin](https://openfin.co/), an increasingly popular desktop solution for web applications.

Recently a colleague of mine (Mark Jose) suggested that we should build a React Hooks library for OpenFin.
During downtime between projects, I thought a great way to brush up on my React Hooks knowledge would be to follow that suggestion and build some hooks while building [StockFlux](https://openfin.co/partners/scott-logic#partner-demos), a demo application for OpenFin.

<p><img src="{{ site.baseurl }}/dkerr/assets/stockflux-screenshot.png" alt="Diagram of Stockflux" title="Stockflux"></p>

StockFlux is a suite of applications, components and libraries built to demonstrate the latest OpenFin functionality such as layouts, snap & dock windows and [FDC3](https://fdc3.finos.org/).

It also doubled up as the perfect specimen to allow me to ["dogfood"](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) my custom hooks, test driving the functionality you commonly see in OpenFin applications (I'm looking at you, launchbar!).

Throughout this journey I was encouraged to open source the hooks library, as a result [OpenFin React Hooks](https://github.com/ScottLogic/openfin-react-hooks) was born!

It has already had its first contributor and a [webinar](https://www.youtube.com/watch?v=yaCkEo2DgRY) was recently hosted to raise the profile of the library to encourage community contributions. So far, so good!

## What is OpenFin?

Before we take a closer look at React Hooks and the hooks library we’ve built, It’s best to introduce you to what framework we’ve built these hooks for: [OpenFin](https://openfin.co/).

OpenFin is the ‘Operating System of Finance’, providing a secure and flexible environment that liberates your web-based apps from browsers and allows you to build multi-window, multi-monitor web apps on your desktop. With OpenFin, you can optimise your desktop real estate to suit your needs, place legacy and web apps side-by-side, and gain real-time notifications of real-time events.

## What are React Hooks exactly?

So now we know what we've built the React hooks against...what exactly _are_ React Hooks?

Despite being high profile, React Hooks are still pretty new, being released back in February 2019 in [React 16.8](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html) so it's worth providing a summary to those that haven't had the pleasure of using them yet!

React Hooks are functions that allow developers to hook into the React state and lifecycle to provide functionality that is more flexible and scalable than you can currently with the lifecycle restrained approach.

It's not been straightforward to reuse stateful logic between React components across lifecycles, and the more stateful logic a component has, the harder it is to maintain and understand.

Existing methods such as [higher-order components](https://reactjs.org/docs/higher-order-components.html) and [render props](https://reactjs.org/docs/render-props.html) meant that you had to refactor the structure and/or hierarchy of components, which could result in a lot of wrapper components.

In this respect, hooks allow you to split components into smaller functions that do one thing and do it well ([single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)), rather than forcing a sometimes arbitrary split on lifecycle methods.

Not only this, but the ability to extract and easily consume these pieces of shared behaviour has resulted in an explosion of community hook libraries that cover a variety of use cases.

This has been the vision for React Hooks, the library itself simply provides you with a [small set](https://reactjs.org/docs/hooks-reference.html) of low level, building block hooks that you can use such as `useState`, `useEffect` and `useRef`.

You're encouraged to compose these hooks into your own custom hooks with higher-level purposes. For example, you could pair a `useState` and `useEffect` hook to run a side-effect whenever the value within the state hook is changed. There's a lot of power and flexibility within this composition pattern!

Let's move on, this chapter's intention is just to get the high-level purpose of hooks across so if you're curious and would like to know more, I'd check out the official [introduction](https://reactjs.org/docs/hooks-intro.html), [overview](https://reactjs.org/docs/hooks-overview.html) and [documentation](https://reactjs.org/docs/hooks-reference.html).

### Hook libraries

There's been two distinct flavours to the hook libraries that have been published by the community.

You have hook libraries (e.g. [useHooks](https://usehooks.com/)) built to abstract away complexity behind Web APIs such as [useLocalStorage](https://usehooks.com/useLocalStorage/).
This hook allows you to retrieve and store non-primitive data to and from [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) without having to worry about parsing, all within a React component.

Secondly, there are hook libraries that have been built on top of existing web frameworks. One example being state management favourite [Redux](https://redux.js.org/) which now has a [hooks interface](https://react-redux.js.org/next/api/hooks) to allow your components to map state and dispatch actions via Redux through hooks.

### Let’s look at OpenFin React Hooks

The idea behind building React Hooks for OpenFin is just following the trend of building hook libraries against pre-existing APIs, in this case the [OpenFin JavaScript API](https://developers.openfin.co/docs/javascript-api).

The diagram below illustrates where conceptually OpenFin React Hooks fits within your technology stack.

<p><img src="{{ site.baseurl }}/dkerr/assets/ofrh-tech-stack.png" alt="Diagram of OpenFin React Hooks technology stack" title="OpenFin React Hooks technology stack"></p>

As it stands, OpenFin React Hooks consists of twelve hooks, some such as `useMaximize` are simpler low-level utilities whereas others such as `useDockWindow` are more complex.

### Demo Application

<p><img src="{{ site.baseurl }}/dkerr/assets/ofrh-demo-page.png" alt="Diagram of OpenFin React Hooks demo application" title="OpenFin React Hooks demo application"></p>

A great way to get a feel for these hooks is to try out the demonstration application that's been helpfully hosted on the [OpenFin partners website](https://openfin.co/partners/scott-logic).
You should be able to download this application by clicking on the 'Download the Demo' button near the bottom of the page.

Once installed, each hook has a code sample and a live demo for you to play around with.

### useMaximized Deep dive

Let's take a closer look at one of the hooks within the library to give a better impression of what they provide for OpenFin developers working with React.

`useMaximized` is a simple hook which indicates whether or not the provided window is currently maximised or not. It allows the provided window to be programmatically maximised and unmaximised.

If you were to implement this functionality without hooks, it would look something like this:

~~~jsx
import React from "react";

class Maximize extends React.Component {
  setIsMaximizedTrue() {
    this.setState({ isMaximized: true });
  }

  setIsMaximizedFalse() {
    this.setState({ isMaximized: false });
  }

  componentDidMount() {
    this.currentWindow = fin.Window.getCurrentSync();
    this.currentWindow.addListener("maximized", this.setIsMaximizedTrue);
    this.currentWindow.addListener("restored", this.setIsMaximizedFalse);
  }

  componentWillUnmount() {
    this.currentWindow.removeListener("maximized", this.setIsMaximizedTrue);
    this.currentWindow.removeListener("restored", this.setIsMaximizedFalse);
  }

  updateWindow(isMaximized) {
    return isMaximized
      ? this.currentWindow.restore()
      : this.currentWindow.maximize();
  }

  render() {
    return (
      <div>
        <div>
          Window is {this.state.isMaximized ? "maximized" : "not maximized"}
        </div>
        <button
          type="button"
          onClick={() => this.updateWindow(this.state.isMaximized)}
        >
          Toggle maximized
        </button>
      </div>
    );
  }
}
~~~

As you can see, it's quite verbose and you've got a common issue with having to manage listeners and their cleanup.

On top of this, the logic is split across lifecycles...in a more complex component, other logic may also be interleaved which would affect readability.

Let's take a look at how this logic looks with hooks:

~~~jsx
import React, { useEffect, useState } from "react";

const updateWindow = isMaximized => {
  const currentWindow = fin.Window.getCurrentSync();
  return isMaximized ? currentWindow.restore() : currentWindow.maximize();
};

const Maximize = () => {
  const [isMaximized, setIsMaxmized] = useState(false);

  useEffect(() => {
    const setIsMaximizedTrue = () => setIsMaximized(true);
    const setIsMaximizedFalse = () => setIsMaximized(false);

    const currentWindow = fin.Window.getCurrentSync();
    currentWindow.addListener("maximized", this.setIsMaximizedTrue);
    currentWindow.addListener("restored", this.setIsMaximizedFalse);

    return () => {
      currentWindow.removeListener("maximized", this.setIsMaximizedTrue);
      currentWindow.removeListener("restored", this.setIsMaximizedFalse);
    };
  }, []);

  return (
    <div>
      <div>Window is {isMaximized ? "maximized" : "not maximized"}</div>
      <button type="button" onClick={() => updateWindow(isMaximized)}>
        Toggle maximized
      </button>
    </div>
  );
};
~~~

Here, the code is more concise and the listener-related logic is grouped together appropriately rather than split across lifecycles arbitrarily.

But why bother writing and maintaining all that code when you can use an OpenFin React Hook?

~~~jsx
import { useMaximized } from "openfin-react-hooks";

const Maximize = () => {
  const [maximized, setMaximized] = useMaximized();

  return (
    <div>
      <div>
        Window is <strong>{maximized ? "maximized" : "not maximized"}</strong>
      </div>
      <button type="button" onClick={() => setMaximized(!maximized)}>
        Toggle Maximize
      </button>
    </div>
  );
};
~~~

Voilà!

## Why use OpenFin React Hooks?

As you can see above, using OpenFin React Hooks allows you to abstract away common functionality that is built on top of the OpenFin API.

This gives you time back to concentrate on other development work. It's worth noting that the example above is one of the simpler hooks. More complex hooks such as `useDockWindow` can save you upwards of hours of time developing, testing and maintaining functionality.

OpenFin React Hooks is also an abstraction layer on top of the API, meaning that developers can opt out of needing to know the OpenFin API in order to use it.

## What's Next?

My motivation for writing this blog post is to try and encourage not only usage of this library but also contributions back to it.

There's a lot of common functionality out there that OpenFin developers may be rewriting, it's hoped that this could be contributed back into the library rather than hidden away in repositories.

If this was achieved, having a shared set of community hooks would be massively beneficial for numerous reasons:

- Functionality that's written, peer-reviewed and tested by the community
- A layer of abstraction on top of the OpenFin API to provide cross-version compatibility and a reduction in required knowledge to develop on top of it
- Reduction in development time by using pre-built hooks rather than developing identical / similar logic yourself

Interested in contributing? We've got an [Issues](https://github.com/ScottLogic/openfin-react-hooks/issues) board and a [Roadmap](https://github.com/ScottLogic/openfin-react-hooks/projects/1) page on our GitHub showing the current direction of the library.

Feel free to pick an issue up or [contact me](mailto:dkerr@scottlogic.com) if you're looking for a good first issue.

## Webinar

In the introduction I mentioned that a webinar was hosted to present this hooks library to the wider community.

If you'd like to watch it, feel free to check out the embedded video below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/yaCkEo2DgRY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Thanks!
