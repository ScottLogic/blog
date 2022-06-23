---
published: true
author: bquinn
layout: default_post
category: Tech
title: 'Exploring SwiftUI Part 2: State management inspired by React'
summary: >-
  In this post I look at how SwiftUI manages state with Combine, and how it
  compares to using React with Redux. SwiftUI is Apple's new declarative UI
  framework for developing UI natively, while React is a declarative UI
  framework for the web.
tags: 'SwiftUI, React, Swift, Web, Mobile'
image: bquinn/assets/swiftui-logo.png
---

This post is my second in a series on SwiftUI. In the [first post](https://blog.scottlogic.com/2019/12/11/Exploring-SwiftUI-1.html) I looked at the history of iOS development and some of the nice changes that SwiftUI introduced. In this post I look at how SwiftUI manages state, and how it is inspired by React in web technology, quite likely in response  to the popularity of React Native on mobile platforms. But first, I will define declarative and imperative UI, to see why SwiftUI can be compared to React.

## Declarative UI vs Imperative UI

SwiftUI and React are declarative UI frameworks. Previously, development on Apple systems used imperative UI frameworks such as UIKit. In imperative UI design, you define exactly how to construct your UI in an initial state, and provide code that manipulates that UI over time in response to things such as user interaction. In contrast,in declarative UI design, you should never find yourself writing code that manipulates your UI. Instead, you define the UI that should appear given a certain state of the application. Events, such as user interaction, only affect this state. When the state changes, the framework will trigger an update to the UI.

> In a declarative UI framework, you should never find yourself writing code that manipulates your UI. Events (user interaction, pushed server events) only mutate the application state, which is then reflected in the UI.

Imperative UI has the disadvantage of poor predictability and testability. It is hard to predict the effect of new code because it may put the application into an invalid state at runtime by explicitly manipulating the UI. For example, you may write new code to remove a view from the application in response to a user action. Later on, another part of the code may attempt to access that view and crash the application, because it was not clear that it was possible for the view to not exist. It is hard to test imperative UI because in order to to observe the behaviour of the application in a particular state, you have to identify and perform the correct actions to achieve that state. This can leave a lot of edge cases untested.

> The behaviour of declarative UI is easier to predict and test

In contrast, the behaviour of declarative UI is easier to predict and test. It's easy to predict the effect of new code at compile time, because the UI defines precisely how it responds to the state of the application, and also how it mutates that state. It's easier to test declarative UI because it's easy to define all possible states of an application and inject them into the application during testing.

## A brief overview of the technologies

### React

ReactJS is a declarative UI framework used for developing web applications. An application is usually built from controlled components, which declare their UI using JSX. Components are dependent on some state which is stored as a JavaScript object in a property called `state`. State can be passed to a child component as `props`, which allows read-only access to a parent's `state`. Keeping `props` immutable makes it clear that the state is owned by the parent. Because React is declarative, you don't manipulate the DOM directly in React, but instead manipulate the state by hooking into listeners such as `onClick` and calling `setState`. Changing the state causes the HTML on the page to re-render.

~~~javascript
state = {
  text: "Hello"
}

render() {
  return (
    <div>
      {/* This is re-rendered whenever text is changed*/}
      <text>{this.state.text}</text>
      <button onClick={() => this.setState({text: "Hi"})} />
    </div>
  )
}
~~~

### Redux

React is commonly used with Redux. Redux is summed up by its three principles:

> 1. The state of your whole application is stored in an object tree within a single store.
> 2. The only way to change the state is to emit an action, an object describing what happened.
> 3. To specify how the state tree is transformed by actions, you write pure reducers.

The first principle declares that all the state in your application is stored in one place - this means we have a single source of truth for our state. This is important, as a lot of the advantages of declarative programming is negated if you duplicate state, as components which should be displaying the same thing get out of sync with each other due to outdated state. The second and third principles allow traceability of state changes; the second principle states that changes are only allowed by actions, and the third that the same action will always have the same consequence. This makes it easy to debug the cause of your application entering an unexpected state, and makes it easy to implement features such as undo by rolling back state changes.

Redux feeds the state from its store into React components as `props`. Because `props` are read-only in React, this enforces the second principle, that state can only be changed by emitting an action. When the state in the Redux store is changed, this triggers React components which rely on this state to be re-rendered.

### SwiftUI

SwiftUI is a declarative UI framework used for developing Apple platform applications. The UI heirarchy is made up of structs which conform to the `View` protocol. UI is declared using Swift code in the `body` computed property by constructing more View objects. State is declared using properties on the struct and can be labelled using a property wrappers. You use `@State` if the View owns the underlying data, or `@Binding` if a parent View owns it. The SwiftUI framework observes changes to these properties, and re-calculates the `body` property if they change.

~~~swift
@State private var text: String = "Hello"

var body: some View {
    VStack {
        Text(text)
        // Click action passed to Button using trailing closure syntax
        Button("Click me!") {
            self.text = "Hi"
        }
    }
}
~~~

### Combine

In Apple's own words, "The Combine framework provides a declarative Swift API for processing values over time". There are two simple components of Combine - Publishers and Subscribers. A Subscriber can call `subscribe` on a Publisher to open up a subscription. When the value of a Publisher changes, it will send an update to the Subscriber. Multiple Publishers can be combined into an `ObservableObject` for combining multiple values. In addition, there are a lot of operators you can use to process events emitted from a Publisher before subscribing.

> The Combine framework provides a declarative Swift API for processing values over time

SwiftUI defines the `@ObservedObject` property wrapper to use on an `ObservableObject`. SwiftUI will observe changes to this property in the same manner that it observes `@State` wrapped properties, and will re-render the UI if new values are published from within it. `@EnvironmentObject` is a special case of `@ObservedObject` which is stored on the environment. This means that it is available to any views within the view heirarchy it was injected into, without needing being passed down by a parent.


## SwiftUI and Combine compared to React and Redux

### @State vs State

In the basic cases shown above, properties labelled `@State` in SwiftUI perform the same role as React components' `state` object. Views are rendered based on `@State` in SwiftUI in the same way that HTML properties depend on `state` in React. When either `@State` or `state` is changed, the framework takes over and re-renders, by recalculating body in SwiftUI or calling render in React. 

There is one important difference in the frameworks however. In most cases SwiftUI uses two way data binding, while React only uses one way binding. In the SwiftUI example shown above, we used the Text view to render a string in a property. A user cannot interact with a Text view, so it is immutable. This means we only used one way data binding because only the state could change. If we instead use a TextField, allowing the user to enter text, we use two way data binding using the `$` prefix.

~~~swift
@State private var text: String = "Some text"

var body: some View {
    VStack {
        TextField("Placeholder", text: $text)
        Button("Click me!") {
            self.text = "Hi"
        }
    }
}
~~~

Two way data binding means that the text the TextField is displaying will change if the `@State` property `text` changes (e.g. the user clicks the button), but also that the `@State` property changes if the user types in the TextField. 

To achieve the same behaviour in React you have to manually provide an `onChange` function and call `setState` to mutate the `state`.

~~~javascript
constructor(props) {
    super(props);    
    this.onInputChange = this.onInputChange.bind(this);
}
state = {
    text: "Hello"
}

onInputChange(e) {
    this.setState({text: e.target.value})
}

render() {
    return (
        <div>
            <input value={this.state.text} onChange={this.onInputChange} />
            <button onClick={() => this.setState({text: "Hi"})} />
        </div>
    )
}
~~~

Two way data binding provides a tighter approach to coupling state and UI. In the simple React example given here, it would be possible to forget to actually update the `state` in response to the `onChange` event, by not calling `setState` in the `onInputChange` function. In the SwiftUI example, the compiler expects a object of type `Binding` in the constructor for TextView, meaning that it is impossible for the TextField to change without updating `@State`, and vice versa.

Another advantage of two way data binding over the event driven method used in React is that the code is simpler - user interactions are tightly bound to a single piece of state. This can prevent bugs arising from duplication of state in the form of derived state. 

As an example, let's take our previous scenario with a text field, but this time we want to change the colour of the text in the text field depending on the number of characters; the text will be red if there are less than 6 characters, and green if there are 6 or more. We can track this as a boolean, isRed. In SwiftUI, this has to be a derived from the text `@State` property because the only way we can know the user has typed is when the state, `text`, is updated.

~~~swift
@State private var text: String = "Some text"
private var isRed: Bool {
    return text.count < 6
}

var body: some View {
    VStack {
        TextField("Placeholder", text: $text)
        .foregroundColor(isRed ? .red : .green)
        Text("\(text.count)")
        Button("Click me!") {
            self.text = "Hi"
        }
    }
}
~~~

In React, we could similarly set the text color by calculating the boolean. However, it is also possible to introduce isRed as a new piece of state, which we update in response to the `onChange` event. This state can now get out of sync with the number of characters in the text field. As a contrived example, we start out in an invalid state in the code below due to the initial values of the state being out of sync. It would probably be easy to avoid this mistake in a simple case like this one, but in more complex systems it is easy to introduce bugs in this way.

~~~javascript
constructor(props) {
    super(props);    
    this.onInputChange = this.onInputChange.bind(this);
}
state = {
    text: "Hello",
    isRed: false
}

onInputChange(e) {
    this.setState({text: e.target.value, isRed: e.target.value.length < 6})
}

render() {
    return (
        <div>
            <input value={this.state.text} onChange={this.onInputChange} 
				style={{color: this.state.isRed ? "red" : "green"}} />
            <button onClick={() => this.setState({text: "Hi"})} />
        </div>
    )
}
~~~

### @Binding vs Props

In SwiftUI, `@Binding` properties allow parents to pass their children state without losing ownership of it. This is important, as it maintains a single source of truth for each piece of state. This is similar to how a React component can pass state to its children using `props`. However, React ensures the single source of truth by making `props` readonly, whereas SwiftUI ensures it by passing a reference to a `@State` property. `@Binding` properties support two way binding in the same way as `@State` properties, allowing child Views to alter the `@State` of their parents, but in a clear and traceable manner.

~~~swift
struct ParentView: View {
    @State private var text: String = "Some text"

    var body: some View {
        ChildView(text: $text)
    }

    struct ChildView: View {
        @Binding var text: String
        var body: some View {
            TextField("Placeholder", text: $text)
        }
    }
}
~~~

In contrast because `props` are read-only, in order for a child to mutate its parent's state in React, the parents has to pass a lambda function as part of `props` so that it can be called in response to an event.

~~~javascript
export default class Parent extends Component {
    state = {
        text: "Hello"
    }

    onInputChange(e) {
        this.setState({text: e.target.value})
    }

    render() {
        return (
            <ChildView props={{text: this.state.text, onInputChange: this.onInputChange}} />
        )
    }
}

class Child extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <input value={this.props.text} onChange={this.props.onInputChange} />
    }
}
~~~

Using `@Binding` in SwiftUI means you only have to pass one property to a child compared to two properties in React. In addition, it tightly couples the value of the state to the changing of the state, whereas in React the Child is reliant on the Parent passing a function which changes the correct piece of state, making the system more flexible but more open to error.

### @EnvironmentObject with Combine vs Redux

Using an `@EnvironmentObject` in SwiftUI is comparable to using a Redux store in React. It acts as a single source of truth for application state which affects more than one component. You could use a `@State` property on the highest view, and pass it down using `@Binding`, but using an `@EnvironmentObject` has less complexity. The `@EnvironmentObject` can be accessed by any view that is a descendant of the View it is injected into, so it avoids passing down state through several children which don't need to know about it. This is the same advantage you gain using the Redux `connect` function in React to populate a Component's `props`, rather than passing the props down through children in a parent's state.

> @EnvironmentObject and Redux provide a single source of truth for application state

There are two keys differences between using an `@EnvironmentObject` and Redux however. The first is, again, databinding. An `@EnvironmentObject` is an `ObservableObject`, and so is essentially a store for multiple Publishers from Combine. SwiftUI Views can perform two way binding on these Publishers in the same way as they would to a `@State` property. In React, Redux hooks into the `props`, and so has to pass both the state properties and functions to change the state into the `props`.

> Because Redux state can only be mutated by dispatching actions, it is possible to record and trace state changes, and even replay them

This leads to essentially the same comparison we just performed between `@Binding` and `props`, but in this instance actually gives React props an advantage. The read-only nature of React's `props` fits very nicely with Redux's second and third principles. The second principle states that Redux state can only be mutated by dispatching actions. This means through recording the actions, it is possible to trace all state changes, and even replay or reverse them. SwiftUI's `@EnvironmentObject` lacks this traceability due to the tight data binding, which means that state changes are made by directly mutating the state.

### SwiftUI vs React

Although SwiftUI with Combine resembles React with Redux in many ways, we've also seen some crucial ways in which it differs. The main source of these differences is the fact that SwiftUI employs two way data binding, where React uses one way data binding. Both frameworks do a good job of ensuring single sources of truth and allowing clear declarations of how UI depends on and mutates state.

It's worth noting here that I've not delved into some of the more complex or recent developments in React such as React Hooks or packages that might provide two way databinding, and similarly it's entirely possible we will see SwiftUI frameworks supporting Redux-style state management start to appear as the technology matures. However, we have seen in this comparison of the core technolgoies that SwiftUI and Combine have brought native iOS development on par with a popular UI framework such as React with its declarative UI and its state management.
