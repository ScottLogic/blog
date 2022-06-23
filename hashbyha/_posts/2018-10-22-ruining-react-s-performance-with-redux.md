---
published: true
author: hashbyha
layout: default_post
title: Ruining React's Performance with Redux
categories:
  - Tech
tags: React Redux Performance
summary: >-
  Developing with Redux makes managing your React state easier, but if not
  integrated correctly it can remove key advantages of using React, wrecking
  your application's performance. This blog will outline how I managed to create
  a painfully slow React app and the steps took to correct it.
---
Developing with Redux makes managing your React state easier, but if not integrated correctly it can remove key advantages of using React, wrecking your application's performance. This blog will outline how I managed to create a painfully slow React app and the steps took to correct it.

Our team was tasked with creating a tool to allow users to add and edit into a hierarchy of data. Our React application was zipping along nicely until the user viewed a page with hundreds of components displayed. This shouldn't have been an issue once the page loaded as React should only render what is required for state changes. But the page ground to a halt on every state change. Something was obviously wrong.

We analysed the processing on each state change, using chrome dev tools to create a flame chart. This shows the amount of processing happening on each state change with each update taking a second to complete before the page responded again. Our app user experience was far from amazing.

![Flame Chart]({{site.baseurl}}/hashbyha/assets/flameChart.png)
 
## The Problem
I've reconstructed the issue in a small JSFiddle to demonstrate the issue we faced in the application, visualising the render changes with a simple counter every time `render` is called. 
Pressing a monkey causes the Redux store to update the 'clicks' value. 'Clicks' is not passed into the component and nothing else in the store has been updated so why does the component render again?

See if you can spot what is causing the component to keep rendering and causing the performance issue.

<script async src="//jsfiddle.net/hashbyhayter/utxh47b9/embed/result,js/"></script>
<br>

## The Culprit 
The filter in `mapStateToProps` was to blame for the multiple renders and the performance woes the application was experiencing. Let me explain...

On each state change, `mapStateToProps` fires to ensure that the component is up to date with the change. The filter removes any of the emoji's that shouldn't be displayed and passes them into the props of the component in a new array.  React then checks if the props have changed and if they have then it will render the component again. As filter always returns a new array the component will always render for EVERY state change.


<figure>
 <img src="https://media.giphy.com/media/zk6GuYqfi3M2s/giphy.gif" alt="shock" width="400px" style="margin: 1em auto;display: block;" />
</figure>


I'm beating up on filter a bit here but anything that creates a new instance of something in `mapStateToProps` will show the same behaviour, I'm looking at you map!

The application regularly had 100 individual components on the page using `mapStateToProps` with either filter or map causing them to render for each state change. Not ideal.

## The Solution for Comparing States

After finding what was causing our performance issues I implemented a naive solution to work around the issue by moving the filtering out of `mapStateToProps` and into the render function of the component.

<script async src="//jsfiddle.net/hashbyhayter/utf4xvsr/embed/result,js/"></script>
<br>

While this solution does solve the performance issues it isn't a satisfying fix. It has meant that the component is now dealing with more than just displaying the props and must know more about the data that is getting passed to it as it is doing the filtering as well. Thankfully there is a better way!

After reading around this subject for this post I found the *magic* Redux solution for this issue which is well hidden in their documentation judging by the number of "unknown performance trick" blogs.

The connect function allows for additional arguments to be passed into it to configure how the component updates. The `areStatesEqual` option allows developers to override how the state is checked.

<script async src="//jsfiddle.net/hashbyhayter/edmx3fqt/embed/result,js/"></script>
<br>

This allows for the component to remain unchanged from the original implementation and the connected component will only render once the relevant change has happened. In the example above, if `emoji store` hasn't changed then `mapStateToProp` doesn't run. Therefore no new instances are created and React doesn't render again. Problem solved!

React and Redux are great together, but if you aren't careful with the implementation it is all too easy to introduce performance overheads into your application creating a slow user experience.
 
## Further Reading:
* [https://reactrocket.com/post/react-redux-optimization/](https://reactrocket.com/post/react-redux-optimization/)
* [https://medium.com/@jidefr/the-most-unknown-redux-performance-trick-986fdfe871fa](https://medium.com/@jidefr/the-most-unknown-redux-performance-trick-986fdfe871fa)
* [https://itnext.io/redux-ruins-you-react-app-performance-you-are-doing-something-wrong-82e28ec96cf5](https://itnext.io/redux-ruins-you-react-app-performance-you-are-doing-something-wrong-82e28ec96cf5)
