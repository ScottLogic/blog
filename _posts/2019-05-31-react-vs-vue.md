---
title: React vs Vue
date: 2019-05-31 00:00:00 Z
categories:
- jwren
- Tech
author: jwren
summary: React and Vue are two popular web application frameworks aimed to make developing
  user interfaces easier. This post summarises a few of the similarities and differences
  between them I found after using both.
layout: default_post
---

React is in a position of the most used (and liked) web framework/library for developers ([Stack Overflow](https://insights.stackoverflow.com/survey/2019#technology), [State of Javascript](https://2018.stateofjs.com/front-end-frameworks/overview/)) but whilst a comparatively small player Vue.js is popular with its followers and it wasn't until recently that I was able to get to use Vue on a commercial project that I got to experience it after previously working with React. This post will focus on some of the similarities and differences I experienced between the two.

## A Little Background

React was born out of Facebook and this provides one of its big strengths, that it has backing from a major company providing long term support and building large scale applications with complex problems means that they created a great tool that solves a lot of issues. I think this has also meant that it inadvertently created quite a steep learning curve, requiring a lot of new concepts and patterns to be learnt before it can be used in earnest. Vue, on the other hand, is much easier to pick up and is designed to be a *progressive framework* (according to their website) so that it can be added and adopted incrementally to a site. It was created by Evan You who previously worked for Google on AngularJS and this can be felt a little in Vue as in places it feels like a mix of Angular and React with a few tweaks.

Both Vue and React allow fast, performant applications to be built and this is provided using a virtual DOM to calculate the changes required to the DOM before performing the expensive updates to the real version. They are both built with the idea of view components to create reusable and reactive building blocks to piece together an application. They are both performant and can scale to enterprise level applications Vue boasting users such as Grammarly, GitLab, Nintendo and BuzzFeed and React used by Airbnb, Uber, Netflix and of course Facebook and its family of applications.

## Getting Started

The first thing to do when starting with either framework is to create a Hello, World app. It is possible to add in just a little bit of either framework to add small amounts of interactivity to a page. 

Here is an example with React (this isn't a sample that should be used in production because it transpiles on the fly)

~~~ html
<html>
  <body>
    <div id='placeholder' />

    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
    <script type="text/babel">
      ReactDOM.render(
        <h1>Hello, World!</h1>,
        document.getElementById('placeholder')
      )
    </script>
  </body>
</html>
~~~

And now with Vue

~~~ html
{% raw %}
<html>
  <body>
    <h1 id='welcome'>{{ welcome }}</h1>

    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script type="application/javascript">
      var app = new Vue({
        el: '#welcome',
        data: {
          welcome: 'Hello, World!'
        }
      })
    </script>
  </body>
</html>
{% endraw %}
~~~

Using React to add just a little bit of interactivity to a site isn't that easy. To get it working properly you will need to get set up a build process probably involving Webpack to transpile React's markup language, JSX, and this can be a big setup cost especially for a small or proof of concept project. This is where Vue has a big advantage as it is designed to be added incrementally as well as being used as a full application, so it is quick to set up. 

Both frameworks can be used to build single page applications as well. A good place to start with React is to use [create-react-app](https://facebook.github.io/create-react-app/docs/getting-started). It comes with a lot of preconfigured defaults, such as a linter, running locally with hot-reloading, etc. and saves a lot of headaches trying to get this setup on your own. The downside is that it does require deleting a few files to get you back to a place you can actually build your app not work on the pre-built template application, but not a high price to pay. Vue has a similar project for setting up an application that is essential for more complex apps using their [CLI](https://cli.vuejs.org/) and provides a slightly less feature-rich version of create-react-app but with scope to customise the build process yourself.

## Style

Both React and Vue work on the concept of creating your application in the form of components. Reusable blocks with simple functionality that can be composed together to make complex applications.

React created its own language called JSX to create components. It mixes a HTML-like syntax and JavaScript together to create something that looks a bit like a template language but with all the power of JavaScript.

Vue doesn't require learning a completely new language or merge separate concerns like JSX does, instead, it leans on the existing technologies of HTML and JavaScript and uses templating in HTML for it to become dynamic. This style means that it is much easier to pick up quickly with a basic knowledge of web development.

Both frameworks have the concept of props and state and embrace a unidirectional data flow so if you are familiar with these concepts then they are almost identically between the two. The difference is that React sides with immutability and Vue with mutation of state. 

Here is a simple comparison of a counter component that increments a number after clicking a button. I've used Hooks with the React example to manage the state, which makes state management easier than it previously was using classes, but I think both offer reasonably easy to use and read solutions although still with the need to understand the framework specifics as you would expect.

~~~ jsx
function Counter (props) {
  const [counter, setCounter] = useState(0)
  const handleClick = () => setCounter(counter + 1)

  return (
    <div>
      <p>Clicked: { counter }</p>
      <button onClick={handleClick}>Click Me</button>
    </div>
  )
}
~~~

~~~ vue
{% raw %}
<template>
  <div>
    <p>Clicked: {{ counter }}</p>
    <button v-on:click="handleClick">Click Me</button>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      counter: 0
    }
  },
  methods: {
    handleClick() {
      this.counter += 1
    }
  }
}
{% endraw %}
</script>
~~~

Whilst they both have the concept of using props to pass information from parent to child components, they differ in how a child should communicate with its parent. For React it is recommended to pass a function as a prop, encapsulating the action from parent to child as a callback to be invoked by the child when required. This pattern can also be used in Vue however it is preferred and recommended to raise events using Vue's framework and have parent components listen for these and respond accordingly.

## Package Management and Community

React will normally only be one of the pieces of a full application. It *only* handles the view management and relies on external code to deal with other parts of the application like state management, routing, etc. React has a very large and active community and this has led to the production of many libraries to help solve these problems, but being such a large community also has its drawbacks, especially for a new developer to React, as there are often several libraries doing the same thing and lots of advice with different solutions to the same problem (not a unique problem in development though!).

Vue has taken on the responsibility of some of these concerns and supplies its own packages for things like routing and state management with the ability to change these for your own libraries if you choose. This means that even though these libraries might be slightly more opinionated, they also have a tighter integration with Vue as they are not made to be generic and are kept up to date by the same maintainers of Vue. Vue's community is smaller than React's and this shows in the number of GitHub repositories tagged with React (61,000+) and Vue (17,000+) and questions on Stack Overflow 140,000+ vs 35,000+ respectively. There are still lots of excellent libraries and lots of help available for Vue but React has the edge.

## State Management

Simple state management can be handled by both frameworks with the use of local state inside the components and encourage a unidirectional data flow, but for more complex state management React relies on third party libraries, most commonly Redux, storing the state object tree with actions to describe what happens and reducers to modify the state in response to an action. Middleware is then used to enhance Redux, with libraries like redux-thunk and redux-saga, to provide additional functionality like asynchronous actions. 

With Vue, you can use any state management system that you like, but it comes with its own state management library Vuex. This is tightly coupled to Vue in an effort to make working with the two easier. The concepts are the same as with Redux, with actions describing events and then mutations that update the state, via mutation to the objects in contrast to Redux but the same as the state updates natively in Vue. Vuex can be quite simple and has easy to understand guidance but for larger applications, it feels like the added complexity of Redux and its ecosystem provides more value. Vuex has concepts of namespaced slices of state, the same as different reducers in Redux, but the usage feels clunky and a little awkward especially as the application grows. There are some workarounds to bring in some concepts from Redux like constants for mutation types, but these don't feel as natural to use.

## Styling and CSS

Styling components as with all things React has a multitude of options available. CSS stylesheets, inline styles, CSS modules, styled-components... It can be difficult to pick the best option for your application with pros and cons of each solution. One of the easiest things with Vue is styling and I think it is a big plus point. When creating components in Vue you can include standard CSS (or even SCSS or flavour of choice) with the component and scope it just to that component without the worries of styles affecting other components. It is all standard CSS, no extra tricks, it is one of those things that "just works".

~~~ vue
<template>
  <div>
    <h1>Hello, World!</h1>    
  </div>
</template>

<style scoped>
  h1 {
    color: red;
  }
</style>
~~~

## Documentation

Documentation is important, especially when learning a new framework. Both provide their own documentation, and both are high quality covering concepts in good depth. React has some difficult advanced concepts for new starters and it can be quite a challenge for new adopters. Whilst I think all the information is covered in their documentation (and a wealth of third party training material), there is a lot to learn. Vue's own documentation can get a developer who is familiar with web development and JavaScript up to a reasonable level in a few hours I think as it's presented well and the concepts easier.

## Summary

Both frameworks are great, solve some of the big challenges of modern web application development and I would happily work with either again. Vue has simple concepts and is easy to pick up. I think Vue would be worth considering for small/mid-sized projects or adding bits of dynamic content to an existing site. It is suitable for development teams that are new to front-end development or have limited time to learn. Even though Vue can be used for more challenging or larger applications I would still lean on the side of recommending React, the rich ecosystem, support, and more readily available developers still give it the edge in my opinion.
