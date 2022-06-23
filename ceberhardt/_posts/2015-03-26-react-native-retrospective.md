---
author: ceberhardt
title: Retrospective on Developing an application with React Native
layout: default_post
summary: >-
  I've been building a React Native app for the past few months, which was
  published as a tutorial yesterday. A number of people have asked about my
  thoughts and opinions about React Native - which I am sharing in this blog
  post.
summary-short: >-
  Some thoughts on developing a React Native app, and how it compares to other
  cross-platform technologies.
title-short: React Native Thoughts
image: ceberhardt/assets/featured/react-native-retrospective.jpg
tags:
  - featured
categories:
  - Tech
---

Yesterday Facebook opened up React Native to the public, and judging by the number of tweets and news stories, has attracted considerable interest.

I was lucky enough to be part of the beta program, and have been developing a React Native application for the past few months. I've shared a [detailed article on how the application was developed](http://www.raywenderlich.com/99473/introducing-react-native-building-apps-javascript) over on Ray Wenderlich's website.

Since publishing, a number of people have asked me to share my thoughts on the framework, and the overall development experience. Hence, this retrospective!

Mobile development is a complex business, with multiple platforms (iOS, Android, Windows) and many more frameworks (Titanium, Xamarin, and a bucket-load of HTML5!). I am firmly of the opinion that there is no silver-bullet, no one framework that is right for everyone. For that reason, this article is split into two sections, the first discussed the pros and cons of React Native, and the second discussing how it affects the various communities (e.g. native iOS devs, Xamarin devs etc ...)

## React Native The Good Parts

There's a lot to like about React Native, here are some of my personal highlights:

### Cmd+R

One of the great advantages of web development is the development cycles, you can make changes refresh your browser and gain almost immediate feedback. Compare this to desktop or mobile development, which requires a full build and deploy cycle each time you make a change.

With React Native there is no need to rebuild the iOS application each time you make a change, simply Cmd+R to refresh just as if it were a browser. Even better, you can use Cmd+D to launch the Chrome Developer Tools:

<img src="{{ site.baseurl }}/ceberhardt/assets/ChromeTools.png" />

(Be sure to link `libicucore.dylib`, which is required for web socket communication to the dev tools)


### Error Reporting

ReactJS has a reputation for providing constructing and informative error reporting, comparing it to other JavaScript MV* frameworks, it is deserving of that reputation.

With React Native the team have taken just as much care in their error reporting. More often than not the framework will not only tell you what has gone wrong, but will provide suggestions regarding how you might fix it.

### ES6

With React Native you are not writing code that targets the browser, you are writing code for a single JavaScript runtime, in this case iOS JavaScriptCore. As a result, you don't have to worry about which Javascript features might be available at runtime. Furthermore, the React Native packager transpiles your JavaScript and JSX for you, which should mean that this code will run just the same on Android. The net result is, you can use modern features such as arrow functions and destructing.

### Virtual DOM

A unique feature of ReactJS is its notion of a Virtual-DOM, which is coupled with a reconciliation process that allows the framework to make efficient updates to the UI when the application state changes.

All this is frighteningly clever, but what does it mean to users of this library?

With React Native you construct your UI as a function of your current application state. The beauty if this approach is that you do not have to worry about which state changes affect which parts of the UI. You simply treat it as though the entire UI is reconstructed with each change.

### Cross Platform

Whilst React Native in its present form just works on iOS so is not a cross-platform framework, the team will add Android support at some point in the future. Considering the split in market share between Android and iOS, any framework that can be used across both platforms has a significant advantage over native development.

However, one thing to bear in mind is that React Native is not write-once run-anywhere framework. You will not be able to take your iOS code and run it on an Android device. With React Native the UI that you construct within your `render` functions is tightly coupled to UIKit controls.

In terms of similar technologies, React Native can be compared to Xamarin. Both allow you to write applications iOS and Android apps with native UIs using a common codebase. However, with React Native and Xamarin it is up to you as a developer to structure your code such that business logic is pushed down into shared a shared set of modules. In each case you have to write a thin UI layer that is platform specific. With Xamarin the Model-View-ViewModel pattern is a great tool for this purpose, with shared ViewModels, but distinct views. With React Native you are going to have to find you own patterns!

### Flexbox

I've never liked auto-layout! There are a few IDEs and UI frameworks that attempt to mix drag and drop with a flexible layout system that can scale across screen sizes. More often than not, the end result is pretty unpleasant! I much prefer defining interfaces using markup, XML or HTML.

React Native uses CSS Flexbox, which is a very natural fit for mobile application development, where your UI controls are arranged in flowing rows and columns that can accommodate a range of screen sizes.

## React Native The Bad Parts

(OK, perhaps 'bad' is a bit harsh, 'limitations' is perhaps a more appropriate word)

### Custom Controls

I order to React Native to construct the UIKit interface the framework has a Javascript counterpart for each controls, and some native code that provides a mapping between the two. As a result, if you want to make use of any custom controls, which considering the limitations of those provided by Apple is quite common, you have to write this code yourself.

I believe that this is a relatively straightforward task. I've not tried it myself, but the code on each side (JavaScript, Objective-C) looks relatively straightforward. However, for many users of the frameworks this will no doubt be a daunting prospect!

### Animations

Animation is simply something which I haven't tried yet. Conceptually there might be concerns, for each step in the animation all your React Native components are re-rendered, reconciled and the native UI updated. However, until I have had a chance to give this a go, I'll not pass judgement!

What I would say is that in the iOS world there are already some widely used frame-based animation frameworks, e.g. Facebook's [POP](https://github.com/facebook/pop), so I wouldn't be concerned about creating non UIView / CALayer animations.

### It is an Abstraction

This is probably the most important limitation of React Native. It is an abstraction, by which I mean that there is a pretty large chunk of code sitting between yourself and the native platform you are developing for.

Time for that [Joel Spolsky quote](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/):

> All non-trivial abstractions, to some degree, are leaky

So in the context of React Native where might the abstraction leak?

One significant issue with abstractions is bugs. If you hit upon an issue with the abstraction layer, you might have to delve into the implementation and fix it yourself. This can be time consuming, and you might find issues that you are unable to resolve!

Another issue with abstraction layers is that you are dependant on a third party not just for bug fixes, but to keep their framework up-to-date. The iOS world moves very quickly, and other companies such as Xamarin have to work very hard to keep their abstraction layer up to date.

Another less obvious abstraction leak is features that you cannot access. Most abstraction layers are incomplete in that there are some features of the underlying system which are not exposed via the abstraction layer.

This might all sound a little frightening and negative, but I'm afraid it is the truth!

One mitigating factor for all of the above is popularity. The more people there are using a framework, the less likely it is that the above issues will trip you up. There will be more developers finding bugs (hopefully before you do), submitting patches, and helping ensure the abstraction is 'complete'.

## What does React Native mean to you?

The final part of this retrospective is a quick summary of how React Native effects the various 'schools' of mobile development.

### Native iOS Developers

There are a large number of iOS developers who are only interested in writing for the iOS platform. If you are one of these developers, you might be wondering what React Native means to you? The answer is "not a lot!". React Native isn't going to replace native development, I am 100% sure of that.

For native developers, you can happily continue writing in Objective-C and learning about Swift.

What I would say is that React Native is a very interesting framework from a 'patterns' perspective. It is well worth looking at its highly-function approach, [something which I wrote about a few weeks ago](http://blog.scottlogic.com/2015/03/05/reactjs-in-swift.html).

### Native Android Developers

Yes, I know you can't use React Native yet, but I am sure it will not be long before this is possible. But if you are only interested in the Android platform, it's pretty much the same story as above. Nothing to see here!

### Web Developers writing Mobile Apps

There are a number of web developers who are currently transitioning to mobile development. Unfortunately this is not an easy transition to make, Objective-C is a frightening looking language!

For this reason you might have decided to put your current skills to use and develop using an HTML5 framework (Ionic, Famo.us, jQuery Mobile, etc). However writing a HTML5 application that feels as good as a native equivalent is a significant challenge, and in many cases simply not possible.

For web developers, especially those who are fluent in ReactJS, React Native is a fantastic opportunity to write 'native' mobile applications using their existing skills.

Some have [expressed disappointment ](http://reefpoints.dockyard.com/2015/01/30/why-i-am-disappointed-in-react-native.html)that Facebook isn't investing in HTML5 to try to narrow the gap with native applications. However, while Apple and Google are competing for market share, and using performance and features to gain an edge, there will always be a gap. The best experiences will always be native. Live with it!

### Titanium Developers

There is already quite a large community of developers writing iOS and Android apps with native UIs in JavaScript via [the Titanium framework](http://www.appcelerator.com). React Native is a very close competitor to Titanium, and is well worth exploring as an alternative. Personally I prefer the React Native approach, but only have a small amount of Titanium experience, so do not want to do that company an injustice.

### HTML5 Developers

Aside from Titanium, there is a huge community of developers writing cross platform applications via the [myriad frameworks at their disposal](http://www.propertycross.com). If you are currently using one of the Phonegap-Wrapped HTML5 frameworks, you should definitely give React Native a try.

### Xamarin Developers

Another close competitor of React Native is Xamarin, which allows you to write cross-platform applications in C#. With Xamarin you also have to construct separate iOS and Android UIs (which is a good thing!). The difference between the two is fundamentally a language preference, however Xamarin does have the maturity advantage.

## Conclusions

React Native is a great addition to the ever growing list of mobile frameworks. It is well written, has a great development experience, a novel 'functional' approach to constructing the UI, great tooling and is a pleasure to use.

Will it be the framework that finally replaces native mobile app development?

No, don't be silly!

Whether or not React Native is right for you very much depends on who you are and what you are trying to build. The same could be said for any other mobile framework.

I'd encourage you to give it a try, and see whether it is right for you.

Regards, Colin E.
