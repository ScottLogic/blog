---
title: Bridging UI libraries for decoupled, long-lived, widely-reusable components
date: 2018-12-12 00:00:00 Z
categories:
- rwilliams
- Tech
author: rwilliams
layout: default_post
summary: It's useful to be able to use components built using one framework, within
  different frameworks. In this post, I explore considerations and patterns, and finish
  off with an example using React and D3.
---

Components are a key part of modern frontend development, allowing us to compose trees of encapsulated pieces into complete applications in a maintainable way.

When components are implemented using the same technology as is using them, there is minimal friction. In the rapidly evolving landscape of frontend libraries and frameworks however, it may be desirable or circumstantially necessary for the two sides to be different.

In this post, I'll attempt to make some sense of the considerations and issues that arise, implementation and integration patterns, and finish off with an example using React and D3. I'll have that example in mind while leading up to it, but the lead-up should be fairly general/transferable.

*Note: for brevity, I'll use the words "framework" and "library" somewhat interchangeably.*


## Component types and usage situations
Not all components and component usages are alike. It's important to bear this in mind when thinking about issues and approaches. Situations have their own goals, constraints, and flexibilities. These may rule out options, or vary the weight of some of an approach's benefits/drawbacks.

We may be building a new component, or wishing to use an existing one. The place we want to use it may be using legacy technologies for whatever reason. Legacy platforms may need to be supported. The component may be application-specific, or part of a shared library - or in need of promotion to one.


## Reusability and longevity
The more widely a component can be reused, the more value we can gain from our effort in implementing it. The same is true of the length of time a component remains a viable choice for use in new applications.

There are two main things I see that constrain how wide a component can be reused: how it exposes itself, and what technology it uses internally. The former is often determined by the latter - a React date picker would be implemented in React, and is so exposed as a React component. Components exposed in a framework-specific way are only directly usable in applications using that same one. Those using a particular framework internally require it to be distributed with the application - bloating download assets unless already used in the application.

JavaScript libraries rise, evolve, and sometimes fall out of favour - quickly. In this ecosystem, framework-specific components are constrained in their audience and length of time they remain relevant. Framework-independent ones - vanilla JS interface and implementation - have no such limits. However, many things can be a lot of work to implement in vanilla JS, and framework usage internally or integration is a key benefit for many components.

That said, there are hundreds of components out there (and within large organisations that build their own) that constrain themselves to a single framework in this way for varying levels of gain. Date pickers, specialist dropdowns, and data grids - for example. They are often reimplemented over and over again for the latest framework: consumers wait for the same features to be implemented, new and similar bugs are found. The need to use existing specialist in-house framework-specific components may delay adoption of newer frameworks for implementing applications, or cause delays and cost for rewriting.

We've come a long way, helped by many advancements, since everything required jQuery and exposed itself as a global or a jQuery plugin. But I think we can do more on reusability and longevity of JavaScript components.


## Web components
Web components is a standards-based way of exposing components. They are supported in modern browsers today, and can be polyfilled in older ones.

They are easily used in applications/components using modern UI frameworks such as React and Angular - making them widely reusable. They will also be much longer-lived than the latest cool framework, being standards-based. A web component implemented using vanilla JS would be hard to beat for reusability and longevity.

However, we are rarely designing our ideal world on a clean slate. There are a lot of existing components out there that are exposed in framework-specific ways. There are various quirks and constraints reported around using web components polyfilled in older browsers. A project may not be ready to start using them yet.

For new non-shared (application-specific) components, there's little reason to use anything other than the application's dominant UI framework's (e.g. React, Angular) component system. For shared components however, consider web components as the default choice.


## Using existing components in a different framework
There are various approaches to doing this, such as taking the code and fitting it in to a component in the new framework (not true reuse), or using the foreign component directly where it's needed via some glue code.

Implementing an adapter component is a cleaner technique. The adapter is created by the host framework, and creates the guest component - wrapping it. Once created, it propagates data and calls to the guest component, and events in the other direction. For example, a D3 adapter for React would allow a D3 (guest) component to be conveniently used in React (host). This keeps the glue code out of the host component, and allows the glue code to be reused.

Components are a first class concept in many frameworks, and many others have established conventions. We can take advantage of this to create generic adapters between two frameworks, which can be used with any component implemented in the guest framework. The generic adapter can then optionally be used by component-specific adapters, to deal anything that doesn't fit - or simply for convenience. There will however likely be some components that require all-custom adapters.

An adapter between two frameworks is of course only of use between those specific two. A new adapter is required to use the same type of guest in a different host, and another to use a different type of guest in the same host. This could lead to quite a few adapters needing to be implemented. If however hosts can accept web components, only a single adapter is needed for each type of guest.


## Implementing new component innards
With new components, we have more flexibility. They could be implemented as a component of the target host framework (or a web component), but still use the preferred framework internally. Or there may be integration libraries available which allow code to be written in a way that joins together the two frameworks.

It appears to me that this coming together of two worlds brings conflict and other downsides. In the case of a host framework rather than a web component, it limits reusability. Integration libraries limit the capabilities of the internal framework, may require a specific implementation style, and are less mature and widely used than the framework itself. The collision mixes patterns, idioms and conventions from both frameworks - resulting in code that doesn't quite look like it was written in either.

Implementing components as components in the lower framework, and then providing an adapter for the target host framework, is one way of avoiding this. The component is implemented in one world, using the style of that framework - there is a clean separation, well-known techniques, and a wealth of how-to and problem-solving knowledge.

Strictly speaking, it seems, according to the Gang of Four book, it would be a "bridge" in this case - because it makes things work before they're designed rather than afterwards.

There will always be some conflict or mismatch where different models meet, and this technique isn't likely to solve all of them. For very complex components, or those requiring tight host-guest integration (component, or framework), other approaches - or 100% framework-specific components may work better.


## Example: D3-for-React adapter
The following is a proof of concept implementation of a React component that is an adapter for rendering D3 components within React. The D3 component is assumed to be in the widely-used "closure with getter-setter methods" form ([example in D3 v2](https://bost.ocks.org/mike/chart/time-series-chart.js)), as originally proposed in [Towards Reusable Charts](https://bost.ocks.org/mike/chart/).

I'll build it up step by step for explanation purposes, omitting already-seen parts in each step. You can find the complete implementation in [this gist](https://gist.github.com/robatwilliams/9a978cc72e6a842638d6995ddcaf1bda).

**Initial render and binding of datum from the special `data` prop.** The component (instance, not the factory) is specified by the `component` prop. This allows the host to call the factory with any required parameters. The component is given a `<div>` to render itself into, as components do by convention. React won't interfere with the elements added by D3 (this is critical) because the only element in the virtual DOM remains constant. This may seem more risky than blocking update via `shouldComponentUpdate > false`, but it allows [non-deprecated lifecycle methods](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) to be used and would also allow custom attributes/classes to be added/updated on the root element.

~~~ jsx
class D3Adapter extends PureComponent {

  root = React.createRef();

  componentDidMount() {
    this.renderWrapped();
  }

  get wrappedComponent() {
    return this.props.component;
  }

  renderWrapped() {
    d3.select(this.root.current)
      .datum(this.props.data)
      .call(this.wrappedComponent);
  }

  render() {
    return (<div ref={this.root}></div>);
  }

}
~~~

**Updating the wrapped component on update, and forwarding props:** The component is called again on update. All unrecognised props that don't look like event handlers (see later) are passed on to setters on the wrapped component. This happens for all of them on initialisation, but only for updated ones on update.

~~~ javascript
class D3Adapter extends PureComponent {

  constructor(props) {
    super(props);

    this.forwardTransitProps();
  }

  componentDidUpdate(prevProps) {
    this.forwardTransitProps(prevProps);
    this.renderWrapped();
  }

  get transitProps() {
    const { component, data, ...others } = this.props;

    return filterObject(others, ([name]) => !(name in this.eventHandlerProps));
  }

  forwardTransitProps(prevProps) {
    for (const [name, value] of Object.entries(this.transitProps)) {
      if (!prevProps || value !== prevProps[name]) {
        this.forwardTransitProp(name, value);
      }
    }
  }

  forwardTransitProp(name, value) {
    const setter = this.wrappedComponent[name];

    if (typeof setter === 'function') {
      setter(value);
    } else {
      throw new Error(`Wrapped component does not support prop "${name}"`);
    }
  }

}
~~~

**Propagating events from the wrapped component.** It's assumed that components dispatch events on the root component that they create, and that event names are in lower case (web convention). Handlers are specified using props of the form `onSomeEvent`. Perhaps it should also convert them to React's synthetic events.

~~~ javascript
class D3Adapter extends PureComponent {

  transitEventHandlers = {};

  componentDidMount() {
    this.renderWrapped();
    this.addTransitEventListeners();
  }

  componentWillUnmount() {
    this.removeTransitEventListeners();
  }

  get transitEventTarget() {
    return this.root.current.firstChild;
  }

  get eventHandlerProps() {
    return filterObject(this.props, ([name]) => /^on[A-Z].*/.test(name));
  }

  addTransitEventListeners() {
    for (const [propName, handler] of Object.entries(this.eventHandlerProps)) {
      const eventName = propName.slice(2).toLowerCase();
      this.transitEventHandlers[eventName] = this.transitEventTarget.addEventListener(eventName, handler);
    }
  }

  removeTransitEventListeners() {
    for (const [eventName, handler] of Object.entries(this.transitEventHandlers)) {
      this.transitEventTarget.removeEventListener(eventName, handler);
    }
  }

}
~~~

**Cleaning up on unmount.** If a `destroy()` method is present on the D3 component, it'll be called.

~~~ javascript
componentWillUnmount() {
  if (typeof this.wrappedComponent.destroy === 'function') {
    this.wrappedComponent.destroy();
  }

  this.removeTransitEventListeners();
}
~~~

**Usage example.** This host component uses the adapter directly. A convenience wrapper `Chart` could be created to construct the component instance: it would simply render `D3Adapter` as its root element and forward all its props to it by spreading them.

~~~ jsx
import chart from './chart';  // the D3 component factory

class StockSummary extends PureComponent {

  chartComponent = chart();

  handleChartLegendClick = event => {
  }

  render() {
    return (
      <div>
        <span>other component stuff...</span>
        <D3Adapter
          component={this.chartComponent}
          data={this.props.priceHistory}
          title={this.props.stockName}
          yAxisLabel="Price in USD"
          onLegendClick={this.handleChartLegendClick}
        />
      </div>
    );
  }

}
~~~

A similar adapter could be implemented as a web component, to allow rendering of D3 components within a web component - allowing wider reuse. Web components' lifecycle and attribute observation features would take the place of the similar React ones.


## Inverse-adapters
It's useful in some components for their host to be able to provide custom content to be rendered somewhere internally. This is often called "transclusion". For example, a chart component may accept a custom legend or tooltip renderer.

Adapters can be useful here too, when the host framework is more suitable (or preferred) for creating the custom content. Components implemented using the host framework can be wrapped in a host-for-guest adapter to allow them to be rendered by the guest, and be passed in.

As a specific example to clarify, consider a chart implemented in D3. It's rendered in a React application using a D3-for-React adapter. A custom tooltip is implemented in React, and passed in to the chart via the adapter. The adapter wraps the tooltip using a React-for-D3 adapter before passing it on to the underlying D3 chart for rendering.

Note that an inverse adapter isn't anything special. It's just an adapter that works in the opposite direction to another adapter: Y-for-X is a reverse-adapter of X-for-Y, where the first letter is the guest and the second is the host.


## Example: React-for-D3 adapter - the inverse
The following is a partial implementation of an adapter for rendering a React component within D3. The adapter itself is a conventional D3 component.

The factory accepts a React component (not an instance), and returns a D3 component instance. When called on a selection, it renders the React component into the node. The properties of the bound datum are passed down to the React component as props, by spreading it. When called with a selection having an exit part, it unmounts the React component allowing its `componentWillUnmount()` lifecycle method (if present) to run for any necessary teardown.

~~~ jsx
export default function reactAdapter(WrappedComponent) {

  function adapter(selection) {
    selection.each(function (d) {
      ReactDOM.render(<WrappedComponent {...d} />, d3.select(this).node());
    });

    selection.exit().each(function (d) {
      ReactDOM.unmountComponentAtNode(d3.select(this).node());
    });
  }

  return adapter;
}
~~~

Usage:

~~~ javascript
import Legend from './Legend';  // the React component

const legendComponent = reactAdapter(Legend);
selection.call(legendComponent);
~~~


## Conclusion
Thinking about integration patterns allows cleaner implementation and greater reusability when components need to work within different host frameworks. There's no single answer; the frameworks at hand and other aspects of situations play a part in the decision of how to integrate.

I found the adapter approach a reasonably elegant solution for integrating React and D3. I [previously used](https://blog.scottlogic.com/2014/02/28/developing-large-scale-knockoutjs-applications.html#initializing-and-controlling-components-with-custom-bindings) the same pattern to create a custom binding for KnockoutJS that acted as an adapter to allow jQueryUI widget factory components to be created and updated directly from the KnockoutJS markup.
