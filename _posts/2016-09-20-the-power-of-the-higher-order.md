---
title: The Power of the Higher Order
date: 2016-09-20 00:00:00 Z
categories:
- Tech
author: asheehan
layout: default_post
summary: A practical look into higher order components and what they bring to the
  table, along with a general discussion of code reuse in React
---

One of the things I love about React is how easy it is to split up and reuse code.

This includes **components**, for example reusing a generic dropdown component, and **behaviours**, which is what I'll be talking about.

This post is meant to be a fairly high level look into code reuse in React generally, and specifically a practical look at higher order components and how they can be utilized to improve reuse across your codebase. I'll also briefly discuss other methods of code reuse in React; where they're useful, and where they fall down.

## Oh Behave

Firstly, what do we mean by **behaviour**? I suppose it's quite a generic word and it really depends on the context. In the React component context, I define behaviour simply as being *something it does*. This may include storing state but not usually anything to do with how a component *looks* (the markup).  

This could be

- Fetching data (from server or your state store)
- Logging
- Listening for events
- Intercepting rendering
- Dispatching an action

Obviously it would be great if we could *reuse* these behaviours in multiple components, for the same reasons we'd want to reuse a generic dropdown component (less code, less time, less redundancy). There are a few ways we can do this specifically in React, the rest of which I'll cover later on.

But first...

## What is a higher order component?

> **A higher-order component is just a function that takes an existing component and returns another component that wraps it**

It's as simple as that.

> Side note: Some of you will have heard of **higher order functions** before, which is defined (loosely) as "*a function which takes in a function parameter or returns a function*". Because React components are really just functions, higher order components are in fact just higher order functions.

So creating a higher order component is **super** easy in React, the code below is the basic blueprint for any wannabe higher order component.

~~~js
import React from 'react';

const HOC = (Component) =>
  class extends React.Component {
    render() {
      return <Component {...this.props} />;
    }
  };
~~~

It's important to notice that we are taking advantage of the [JSX spread attributes](https://facebook.github.io/react/docs/jsx-spread.html) language feature, to allow this component to *proxy* any props back down to the original component using `{...this.props}`. This is a key feature for higher order components.

Also I suppose at this point it's worth mentioning that there are actually **2 ways** of implementing higher order components in React.

**Inheritance Inversion**
The component returned from the higher order function `extends` the original component, and can then access it via the `super` keyword. Sadly this completely removes the ability to pass props from the wrapped component into our original component, so it's not usually the right solution.

**Props Proxy**
This is the implementation I showed above and is the version I'll be using in this article, because in my experience it is by far the most common case (I've never actually had to use Inheritance Inversion).

## Let's code

So now you've read loads of consecutive words, let's actually create some higher order components (Woo).

<img style="margin: 0 auto 40px; display: block;" src="{{ site.baseurl }}/asheehan/assets/lets-code.png" alt="Let's code" />

### Mounting Monitor HOC

Let's say we want to record how long it takes any given component to mount (that being the time between the `ComponentWillMount` and `ComponentDidMount` lifecycle methods). Let's see how that would look in a React Component first.

I made an `AwesomeButton` component, and we can use the *mount* lifecycle methods to log how long it takes for each `AwesomeButton` component to mount.

~~~js
class AwesomeButton extends React.Component {
  componentWillMount() {
    const startTime = Date.now();
    this.setState({ startTime });
    console.log('Mounting ', startTime);
  }
  componentDidMount() {
    const endTime = Date.now();
    console.log('Mounted ', endTime);
    console.log('Total Time ', endTime - this.state.startTime);      
  }

  render() {
    return <button>Sick button</button>;
  }
}
~~~

And we'll get some logs like this:

~~~
Mounting 1472831405653
Mounted 1472831405653
Total Time 0
~~~

Great. But of course we want to be able to use that across **multiple** components, not just my awesome button, so now would be a good time to extract this logic into an HOC.

~~~js
const monitor = (Component) =>
  class extends React.Component {
    componentWillMount() {
      const startTime = Date.now();
      this.setState({ startTime });
      log(`${Component.name} MOUNTING ${startTime}`);
    }
    componentDidMount() {
      const endTime = Date.now();
      log(`${Component.name} MOUNTED ${endTime}`);
      log(`${Component.name} TOTAL TIME ${endTime - this.state.startTime}`);        
    }

    render() {
      return <Component {...this.props} />;
    }
  }
~~~

So as I mentioned earlier, this is simply a function which takes in a Component, and it's returning a new React component, which renders our original component as a child. The wrapper component then logs *before* and *after* the original component mounts which is our desired behaviour.

Now to use this HOC on our button component we can use an **ES7 decorator**, which I think is a neat way doing it.
If you haven't come across these yet, [you should take a look](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.irow3ptj6)

~~~js
@monitor
class AwesomeButton extends React.Component {
  render() {
    return (
     	<button>Sick button</button>
    );
  }
}
~~~

 Of course you're not tied into decorators, you could also just use a plain function call (which is basically what a decorator is), like so:

~~~js
class AwesomeButton extends React.Component {
  render() {
    return (
      <button>Wow this is a great button</button>
    );
  }
}

const WrappedButton = monitor(AwesomeButton);
~~~

See this `monitor` HOC example [live on Codepen](http://codepen.io/alisd23/pen/mAdKVm)


### Data fetching HOC

Another useful use case for an HOC is the scenario where a component *depends* on some data from the server, and therefore needs to fetch that data before rendering.

So let's create a higher order component which:
1. Requests data from the API on the `componentDidMount` lifecycle hook
2. Renders a `Loading` component whilst waiting for the data
3. Renders the **original** component when the data is available, passing the data down as `props`

The HOC needs to know which endpoints to request data from, and this might be specific to each component, so to make this HOC reusable, we need to pass it a function which returns some *request metadata*.

Also we might need the components `props` to generate the endpoints, so we should pass that in as a parameter too.

~~~js
const dataDependencies = (props) => {
  user: `/api/user/${props.userId}`
};
~~~

I'm returning a simple object of *prop name* key to *url endpoint* value here. Also note how here we expect a `userId` prop to be available on the components' props.

I think it helps in this example to look at how we'd want to use the HOC first:

~~~js
@fetchData(dataDependencies)
class User extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div>User: {user.name}</div>
    );
  }
}
~~~

This time we are passing the `dataDependencies` function in to the HOC (which makes it more like a *HOC factory*), and we expect the corresponding API data to be passed down as props into our `User` component under the keys specified in the *metadata* returned by that function, which in this case is just `user`.

And here's the implementation:

~~~js
// Factory function which returns an HOC, which returns the wrapped component
const fetchData = (dataDepsFn) => (Component) =>
  class extends React.Component {
    // State relating to data fetching
    state = {
      isLoading: true,
      data: {}
    };
    componentDidMount() {
      // Create request metadata object
      const dataDeps = dataDepsFn(this.props);
      // Collect array of promises, one for each api request
      const promises = Object.keys(dataDeps)
        .map(key => fetch(dataDeps[key], key));

      const mergeData = (obj, data) => ({ ...obj, ...data });

      // When all requests have resolved
      // Set 'data' and 'isLoading = false', causing re-render
      Promise.all(promises)
        .then(data => data.reduce(mergeData, {}))
        .then(dataObj => this.setState({
          data: dataObj,
          isLoading: false
        }));
    }
    render() {
      const { isLoading, data } = this.state;
      return isLoading
        ? <Loader />
        : <Component {...this.props} {...data} />;
    }
  }
~~~
![Fetch Data HOC]({{ site.baseurl }}/asheehan/assets/fetch-data-hoc.gif "Fetch Data HOC")

See this `fetchData` HOC example [live on Codepen](http://codepen.io/alisd23/pen/gwArYr).

## Gotchas?

So HOC's look really cool and useful right? But there are some things to be careful of, particularly as you start chaining or **composing** HOC's together.

### Overriding Props

Remember in the examples above we *proxy* the props down from the wrapper component into the original component, by using the [JSX spread attributes](https://facebook.github.io/react/docs/jsx-spread.html).

In some HOC wrapper component:

~~~js
<Component {...this.props} someExtraProp='someValue' />
~~~

However if `someExtraProp` has already been passed down through `this.props`, you will get a **conflict** in prop names and `someExtraProp` will get overwritten by the HOC above. As HOC chains grow this becomes more likely. However, I think it's still rare; rare to get chains of more than 3 HOC's, and rare to actually have a conflict in prop names.


### Order matters!

![Order Matters.](http://www.androidpolice.com/wp-content/uploads/2012/11/nexusae0_judgejudy-002.jpg "Order Matters.")

In some situations the order in which you compose HOC's together is important.

For example, imagine now the `fetchData` HOC requests data periodically, say every 1 second. We also want to be more efficient in rendering and only render when the props have changed, so we could introduce the `pure` HOC from the [recompose](https://github.com/acdlite/recompose) library, which shallow compares the *currentProps* with the *nextProps* and only re-renders when a prop has changed.

~~~js
@pure
@fetchData
class MyComponent extends React.Component {
  ...
}
~~~

In this example, props flow like so, from top down, as you'd expect:  
➔ PureComponent ➔ FetchDataComponent ➔ Component

However, if we compose the HOC's in this order, the `pure` wrapper component is the *parent* of the `fetchData` wrapper component, so if the data from `fetchData` changes, the benefits from the `pure` HOC will **never be applied**, causing unnecessary renders, even if the API data is the same as from the previous request.

So to ensure that prop changes caused by the `fetchData` wrapper component are filtered by the `pure` HOC, this would be the best order:

~~~js
@fetchData
@pure
class MyComponent extends React.Component {
  //...
}
~~~

There are many other situations where you might need to think about the order of your HOC's, so keep that in mind.


## Any other patterns?

Higher order components are not the only way of sharing behaviour between components in React.

### Inheritance

Of course we could turn to the classical object-orientated approach of **inheritance**, where our original component `extends` some parent component, which can contain specific behaviours.

Using the **Monitor** example; instead of extending the `React.Component` class, we could extend a `MonitorComponent` class, which will supply us with the logging behaviour we need.

~~~js
class AwesomeButton extends MonitorComponent {
  render() {
    return (
    	<button>Wow what a button</button>
    );
  }
}
~~~

Then the we implement the `MonitorComponent`

~~~js
class MonitorComponent extends React.Component {
  componentWillMount() {
    const startTime = Date.now();
    this.setState({ startTime });
    log(`${Component.name} MOUNTING ${startTime}`);
  }
  componentDidMount() {
    const endTime = Date.now();
    log(`${Component.name} MOUNTED ${endTime}`);
    log(`${Component.name} TOTAL TIME ${endTime - this.state.startTime}`);      
  }
}
~~~

You can see this working [on codepen too](http://codepen.io/alisd23/pen/EggXZG) ("wow so examples")

There are a couple of issues with this technique:

#### **Maintainability**
If we wanted to also override the `componentWillMount` lifecycle method in our `Button`, we would have to call `super.componentWillMount()` to allow `MonitorComponent` to run it's code.  

This means that that each component extending `MonitorComponent` needs to know the **blueprint** of `MonitorComponent` (i.e. which methods it has implemented) in order to avoid overriding behaviour. This makes code maintaining more painstaking when a change is made to `MonitorComponent`.

Also, method names reserved by the superclass can now not be used in the child class (unless done on purpose) as this will *override* the method which the superclass depends on. So adding a new method to a superclass, if used by many other components, could break some of those components.

#### **Composition**
Due to the **1-to-1** nature of object-orientated inheritance, the ability to compose multiple behaviours together completely disappears.  
For example, if we now wanted to enhance `Button` with the behaviour from the `fetchData` HOC, *how could we do that with inheritance?*  

Simply put, **you can't**.  

You can't chain inheritance together in a generic way like we can with HOC's, which is a **big** issue when it comes to code reuse in components.

Of course it's okay to use inheritance in some situations, maybe when you know there will only need to be *one* enhancement to a component. However as soon as you decide that a component needs some other generic behaviour added to it, you'll have to throw away the superclass and replace it with an HOC or a mixin.

> So is there any point?

In my opinion, **no**, stick with **higher order components**.

### Mixins? Mix-outs.

> In object-oriented programming languages, a mixin is a class that contains methods for use by other classes without having to be the parent class of those other classes. *- (shameless Wikipedia quote)*

An example of a mixin, which has the same effect as the `pure` HOC from [recompose](https://github.com/acdlite/recompose)

~~~js
import PureRenderMixin from 'react-addons-pure-render-mixin';

const Button = React.createClass({
  mixins: [PureRenderMixin],
  render: () => { /*...render...*/ }
});
~~~

Mixins were once the preferred way of sharing code between components in React, but they fell out of favour recently (at time of writing) due to some fairly major flaws outlined by Facebook on [their blog](https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html).

Some of the flaws, summarised from the above blog post include:

#### **Method name clashes**
If 2 mixins both define a method with the *same name*, those mixins **can not be used together**. This can become unmanageable as codebases grow.  

#### **Implicit dependencies**  
Sometimes a mixin depends on something on the component, i.e. some state or a method. If this component needs to change in some way, by moving state up into a parent component for example, then the mixin may have to adapt to accommodate this change. But what if the mixin is used by 10 other components? That could end up being a messy change to make.

#### **No ES6 classes ☹**
Mixins are actually *not supported* in React ES6 class components, which is another deterrent. So if you wanted to use a mixin today you would have to use the `React.createClass` syntax like in the example above.

## Praise the higher order

Higher order components are a very powerful tool in your React toolbox, so I would definitely recommend using this pattern when starting your next project, particularly in projects that you want to **scale** well.

I think it's important to understand other patterns for code reuse, especially the ones I mentioned in this post (mixins and inheritance), and to remember that these alternatives might actually be a *better* solution in *some* situations. However, higher order components don't suffer from most of the downfalls of these other patterns, and in most cases I have found them to be the best solution, and [so have Facebook](https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html).

So get out there and embrace the higher order.

<img style="margin: 40px auto 0; display: block;" src="{{ site.baseurl }}/asheehan/assets/hocs-everywhere.jpg" alt="HOC's Everywhere" />
