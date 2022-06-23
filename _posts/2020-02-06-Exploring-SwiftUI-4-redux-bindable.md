---
title: 'Exploring SwiftUI 4: Creating a Redux Library Supporting Data binding'
date: 2020-02-06 00:00:00 Z
categories:
- bquinn
- Tech
tags:
- Swift,
- SwiftUI,
- iOS,
- Declarative
- UI,
- React,
- Redux
author: bquinn
layout: default_post
summary: In this post I explore the Bindable SwiftUI Redux package I created, and
  explain the motivations behind using Redux for state management in SwiftUI, and
  the challenges faced in integrating the two frameworks.
image: bquinn/assets/swiftui-logo.png
---

As part of exploring SwiftUI, I discovered that while I enjoyed the native state management system, it lacked a few qualities, namely scalability and traceability. Given the similarity between state management in SwiftUI and React, which I explored in my [previous blog post](https://blog.scottlogic.com/2020/01/06/Exploring-SwiftUI-2-React-comparison.html), I looked into creating a Redux package for SwiftUI. This is [available on GitHub](https://github.com/BenedictQ/SwiftUI-Bindable-Redux), and can be imported into Xcode projects using Swift Package Manager.

## State management using SwiftUI

State is managed in SwiftUI using property wrappers and a native module called Combine. The three ways of declaring state are by declaring `@State`, `@ObservedObject` and `@EnvironmentObject` wrapped properties on `View` objects. State can also be passed to child views as `@Binding` properties. See my [previous blog post](https://blog.scottlogic.com/2020/01/06/Exploring-SwiftUI-2-React-comparison.html#swiftui) for more on how this works.

This native SwiftUI state management allows two way databinding, which is performed using the `Binding` struct. This can lead to children directly mutating the state of their parents, and state updates that are completely untraced. The `@State` wrapper works best for basic state such as `String` or `Int` values stored directly on a `View`. For more complicated state, the `@ObservedObject` wrapper can be applied to a property of `ObservableObject` type. However, these properties are still stored directly on the `View`. This can be improved by using the `@EnvironmentObject` wrapper, which allows you to inject an `ObservableObject` into a parent view, and access it directly from any children, keeping a central location for the state of a view hierarchy. However, multiple environment objects may still be in use within the application, and may be mixed with state stored on views. Overall, it felt like a little bit of work needed doing to make state changes easy to manage for large scale applications. Redux is a pattern which performs this role with React, so I looked into adding it into SwiftUI.

## State management using Redux

Redux is summed up by its three principles:

> 1. The state of your whole application is stored in an object tree within a single store.
> 2. The only way to change the state is to emit an action, an object describing what happened.
> 3. To specify how the state tree is transformed by actions, you write pure reducers.

The first principle makes Redux a scalable state management system by providing a single source of truth, even for large applications. It also makes it easy to inject state, or start the application in a given state because you only need to instantiate the store in the desired state. The second principle keeps state changes traceable, allowing easy debugging and logging.  The third principle makes state changes replayable, by ensuring that the current state is known in its entirety if its initial state is known, and all the actions sent are known. This makes state changes simple while opening the door for very useful tools such as ['time-travel'](https://www.youtube.com/watch?v=xsSnOQynTHs), which allows you to easily skip betwen states by reducing the set of actions required to get to them.

## Basic Swift Redux protocols

There are four basic components to the Redux system of state management - a Store, the State which it contains, the Actions, and the Reducers. Following the principle of Protocol Oriented Programming, the first step was to create protocols, if needed, to represent these four components.

### ReduxRootState

The state could be any object which is entirely implementation dependent, and so the `ReduxRootState` protocol doesn't have much to it. However, to integrate properly with SwiftUI's state management, it is class constrained (conformed to `AnyObject`). In order for reducer funtions to be pure, which the third principle of redux requires, the state should move memory location if it is changed. Therefore a `deepcopy` function is imposed in the `ReduxRootState` protocol to encourage this.

~~~swift
public protocol ReduxRootState: AnyObject {
    func deepcopy() -> Self
}
~~~

### ReduxRootReducer

~~~swift
public protocol ReduxRootReducer {
    associatedtype State
    static func reduce(_ action: ReduxAction, state: State) -> State
}
~~~

The `ReduxRootReducer` protocol has one requirement, which is a function which takes in an action and the previous state, and returns the new state. I made this function static because this must be a pure function according to the 3rd principle of Redux, so it doesn't need to belong to an object because its not altered by its surrounding state. The protocol is generic, with an `associatedtype State` because as was just stated, the State could be any object and is implementation dependent. The protocol is called `ReduxRootReducer` because sub-reducers can easily be split out and used within the `reduce` function, but we need a single entry point for all actions.

### ReduxAction

~~~swift
public protocol ReduxAction { }
~~~

All actions will need to be dispatched to the same reducer which will then check their type in the `reduce` function to create the new state. This protocol allows polymorphism among actions without enforcing any requirements (as they could contain anything).

### ReduxStore

~~~swift
public protocol ReduxStore: ObservableObject where ObjectWillChangePublisher == ObservableObjectPublisher, Reducer.State == State {
    associatedtype State
    associatedtype Reducer: ReduxRootReducer
    var state: State { get set }
}

extension ReduxStore {
    public func dispatch(_ action: ReduxAction) {
        // Inform SwiftUI that the state will change
        objectWillChange.send()
        state = Reducer.reduce(action, state: state)
    }
}
~~~

The `ReduxStore` protocol declaration has only one requirement, which is a `state` property. The protocol is generic, with an `associatedtype State` because the State will be implementation dependent. We also have an `associatedtype Reducer` which conforms to the `ReduxRootReducer` we defined earlier. We constrain in the generic `where` clause that the `State` type of the `ReduxStore` must be the same as the `State` type of the `Reducer`. In the protocol extension, we provide the method to dispatch actions to the store. This takes in an action, which it passes to the implementation of the reducer, and sets the `state` property with the result.

In addition, the `ReduxStore` protocol itself conforms to a protocol from the Combine framework - `ObservableObject`. This is a generic protocol as well, so we provide a concrete type `ObjectWillChangePublisher` for its `associatedtype ObservableObjectPublisher`. Conforming to `ObservableObject` is necessary for injecting the `ReduxStore` instance into SwiftUI. In addition, at the end of `dispatch` the `objectWillChange` notification is sent to trigger an update in SwiftUI.

## Injecting the store using EnvironmentObject

Any `View` object which displays a piece of state from the store needs access to that piece of state. That can either be done by injecting the state directly into the `View` or by injecting the redux store directly in. In this implementation of Redux, the `View` needs access to a `ReduxStore` in order to dispatch actions, so it seems to make most sense to inject the store directly into a view. In addition, this allows us to instruct SwiftUI to only watch the store object, and re-render when it changes, rather than watching lots of different pieces of state for different views.

Using the `EnvironmentObject` system makes sense as a way to inject the store into a view hierarchy. An `EnvironmentObject` can be accessed by any child view without it being passed to it by its parent. This provides a similar functionality to the `connect` function in React-Redux. We therefore only have to inject a `ReduxStore` instance into the root view of a hierarchy and we have a single source of truth for that hierarchy. For a concrete implementation of `ReduxStore` called RootStore, this can be done like this:

~~~swift
let store = RootStore()
let rootView = RootView()
    .environmentObject(store)
~~~

For some view that is a descendant of rootView in the view hierarchy, the store can be pulled in and used like this:

~~~swift
struct ChildView: View {
    @EnvironmentObject var store: RootStore
    var body: some View {
        Button(action: {
                self.store.dispatch(SomeAction())
            }
            label: {
            Text(store.state.message)
        })
    }
}
~~~

The `@EnvironmentObject` wrapper has the double effect of informing SwiftUI to inject the `RootStore` into this view, and also to watch the store for the `objectWillChange` notification, and recompute `body` when the store changes.

## Integrating data binding

For views that perform state changes in an imperative fashion, such as `Button` above, it is easy to dispatch actions to the store in their callbacks. The big challenge to integrating Redux with SwiftUI comes in embracing SwiftUI's two way databinding. Many views (such as `TextField` or `Toggle`) take in a `Binding` object which wraps an intrinsically linked piece of state (a `String` for a `TextField` or a `Bool` for a `Toggle`). The view is updated if the state is updated, and the state is updated if the view is updated. This breaks the second principle of Redux, that state updates must only be performed by sending actions.

### ReduxBindable property wrapper 

To overcome this challenge, I used a new feature in Swift 5 called property wrappers. SwiftUI includes a few of these (`@State`, `@Binding`, `@EnvironmentObject` ) which I've mentioned already. A property wrapper is an object which wraps a value. It is declared using the `@propertyWrapper` keyword, and can then be applied to a property on an object. I created a property wrapper called `ReduxBindable`:

~~~swift
@propertyWrapper
public final class ReduxBindable<Store: ReduxStore, State, Action: BindingUpdateAction> where Action.State == State,
Store.Reducer.State == Store.State, Store.State.Store == Store {
    private var state: State
    public var store: Store?

    public var wrappedValue: State {
        get {
            return state
        }
        set {
            let action = Action.init(state: newValue)
            store?.dispatch(action)
        }
    }

    public init(wrappedValue: State) {
        state = wrappedValue
    }

    public var projectedValue: State {
        get {
            return state
        }
        set {
            state = newValue
        }
    }
}
~~~

`ReduxBindable` has three generic types. The `Store` generic type allows it to be used with specific implementations of `ReduxStore`. The `State` generic type allows the same property wrapper to be used for any form of state, from `String` to a custom type. The `Action` generic type enforces a single action to update the state within any `ReduxBindable` object.

`ReduxBindable` has a `wrappedValue` property, which is used in a SwiftUI `View` for databinding. `ReduxBindable` intercepts a setting of this value and dispatches an action to the store. This action is of type `BindingUpdateAction`, which is a protocol which enforces a conforming object to carry a value for the `State` type that `ReduxBindable` wraps.

~~~swift
public protocol BindingUpdateAction {
    associatedtype State
    init(state: State)
    var state: State { get }
}
~~~

`ReduxBindable` also has a `projectedValue` property which is used in the reducer to set the new value of the state. Using `ReduxBindable` as a property wrapper with these two properties allows the `View` to perform normal databinding using vanilla SwiftUI syntax, while obeying the second and third principles of Redux that state updates can only be performed by actions through pure reducer functions.

![ReduxBindable-diagram.jpg]({{site.baseurl}}/bquinn/assets/ReduxBindable-diagram.jpg)

Unfortunately, if  `ReduxBindable` is used as a property wrapper, the class cannot be initialized with the reference to the Redux store, which it needs to dispatch the action. Therefore while complexity is hidden from the `View` structs by using a property wrapper, because they don't know that the property is wrapped, complexity is introduced into our Redux system. We can add an `initialize` function to the `ReduxStore` protocol, and update a `ReduxRootState` protocol with an `initialize` function to allow the store to be injected into `ReduxBindable` properties after they are created.

~~~swift
final class ExampleState: ReduxRootState {
    @ReduxBindable<RootStore, String, UpdateMessageBindableAction> var message: String = ""

    func initialize(store: RootStore) {
        // Underscore syntax accesses the ReduxBindable instance instead of the message state (i.e. wrappedValue property)
        _message.store = store
    }
    
    func deepcopy() -> ExampleState {
        let newState = ExampleState()
        newState._message = _message
        return newState
    }
}
~~~

In addition, `ReduxRootReducer` now has two overloads of `dispatch`, one of which is generic and takes in a `BindingUpdateAction`. The final package is available in a public [GitHub repository](https://github.com/BenedictQ/SwiftUI-Bindable-Redux) and can be imported into SwiftUI projects using Swift Package Manager.

##  Redux middleware and store enhancers

A big part of what makes using Redux so appealing is middleware. Middleware sits between an action dispatch and a state update, and allows you to intercept state updates and perform them asynchronously, or to chain new dispatches. My SwiftUIBindableRedux package provides an `applyMiddleware` function, and a `Middleware` protocol to allow you to write and add your own middleware. It works in much the same way as the [JavaScript Redux middleware](https://redux.js.org/advanced/middleware/), so I won't go into detail here on the implementation. The example project I've written demonstrates how to use middleware in making simple logging middleware and applying it to the store. A very common form of middleware used withRedux is Redux-Thunk. Thunks allow you to dispatch functions to the store in the place of an action. The only middleware implementation that comes with the BindableSwiftUIRedux package is thunk middleware, because it's so common and so useful. A simple example of middleware is a basic logger, which prints the store before and after every action dispatch:

~~~swift
enum LoggingMiddleware: Middleware {
    typealias Store = RootStore
    static var middleware: Store.Middleware {
        return { (dispatch: Dispatch, getState: @escaping () -> CounterState) in
            return { (next: @escaping Dispatch) in
                return { (action: ReduxAction) in
                    print("Logging state")
                    print(getState())
                    next(action)
                    print(getState())
                    print("End logging state")
                }
            }
        }
    }
}
~~~

As in the JavaScript Redux library, the `applyMiddleware` function is implemented as a `StoreEnhancer` which is added to the `createStore` function. The advantage of this approach is that it allows users to develop custom `StoreEnhancers`, which can be composed and used in this function alongside or instead of `applyMiddleware`.

## Pros and cons of the package

The package achieves what I set out to do, which was to create a Redux framework for SwiftUI. The package embraces SwiftUI's idioms by using `EnvironmentObject` and permitting databinding using the `ReduxBindable` wrapper. It satisfies the first principle of Redux by providing a singular store which is the single source of truth of the application. It satisfies the third principle of Redux by changing state through passing actions through pure reducers. 

However, the package doesn't enforce the second principle of Redux, which is that the only way to change state is by emitting actions. The reason for this is that when the store is injected into a `View` it can't be declared as `readonly`. In addition, the `state` property on the store can't be declared as `private` because it satisfies the requirement of the `ReduxStore` protocol. This doesn't stop the package being a Redux framework, but it does rely on implementations to respect the second principle, where it would be nice if it was enforcedby the package itself.

## Counter app

What Redux article would be complete without a simple counter app written to demonstrate its use? The below example is a simple counter app, and is condesnsed from one of my [example projects](https://github.com/BenedictQ/CounterBindableRedux) for the package. It has a `Text` view to display the count, and a `Button` to update the count. It has two modes, controlled by a `Toggle` - incrementing the counter and decrementing the counter. A user can optionally add a limit to the count by typing in a numeric text field. The limit is enforced by dispatching a `Thunk` which checks the value against the limit before dispatching an `Increment` or `Decrement` action. This example demonstrates the usefulness of Redux, and the advanced capability provided by the way that my package integrates with SwiftUI databinding. Enjoy!

### Redux Objects

~~~swift
final class CounterStore: ReduxStore {
    typealias Reducer = CounterReducer

    lazy var storedDispatch: Dispatch = defaultDispatch
    var state: CounterState
    var objectWillChange = ObservableObjectPublisher()

    init(state: CounterState?) {
        self.state = state ?? CounterState()
    }
}

final class CounterState: ReduxRootState {
    typealias Store = CounterStore

    var count = 0
    @ReduxBindable<CounterStore, Bool, UpdateBindingToggle> var isIncrementing = true
    @ReduxBindable<CounterStore, String, UpdateLimitText> var limitText = ""

    func deepcopy() -> CounterState {
        let newState = CounterState()
        newState.count = self.count
        newState._isIncrementing = _isIncrementing
        newState._limitText = _limitText
        return newState
    }

    func initialize(store: CounterStore) {
        _isIncrementing.store = store
        _limitText.store = store
    }
}

enum CounterReducer: ReduxRootReducer {
    static func reduce(_ action: ReduxAction, state: CounterState) -> CounterState {
        let newState = state.deepcopy()

        switch action {
        case let action as UpdateBindingToggle:
            newState.$isIncrementing = action.state
            newState.$limitText = ""
        case let action as UpdateLimitText:
            newState.$limitText = action.state
        case is IncrementCount:
            newState.count += 1
        case is DecrementCount:
            newState.count -= 1
        default:
            break
        }

        return newState
    }
}

struct UpdateBindingToggle: BindingUpdateAction {
    let state: Bool
}

struct UpdateLimitText: BindingUpdateAction {
    let state: String
}
struct IncrementCount: ReduxAction { }

struct DecrementCount: ReduxAction { }

~~~

### Counter View

~~~swift
struct Counter: View {
    @EnvironmentObject var store: CounterStore

    var toggleText: String {
        return store.state.isIncrementing ? "Increase" : "Decrease"
    }

    var updateCounter: Thunk<CounterStore> {
        Thunk<CounterStore> { dispatch, getState in
            let state = getState()
            var shouldChange = true
            if let numberLimit = Int(state.limitText) {
                shouldChange = state.isIncrementing ? state.count < numberLimit : state.count > numberLimit
            }

            if shouldChange {
                let action: ReduxAction = state.isIncrementing ? IncrementCount() : DecrementCount()
                dispatch(action)
            }
        }

    }

    var body: some View {
        VStack {
            Text("\(store.state.count)")
            HStack {
                Button(action: updateCount) {
                    Text("Update counter")
                }
                Spacer()
                Toggle(self.toggleText, isOn: $store.state.isIncrementing)
                    .frame(width: 150, height: 50, alignment: .trailing)
            }
            TextField("Enter number limit", text: $store.state.limitText)
                .keyboardType(.numberPad)
        }
        .padding()
    }

    func updateCount() {
        store.dispatch(updateCounter)
    }
}
~~~

### SceneDelegate (app initialization)

~~~swift
func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    
    // Create the store with logging and thunk middleware.
    let rootStore = CounterStore.createStore(
        reducer: CounterReducer.self,
        preloadedState: nil,
        enhancer: CounterStore.applyMiddleware(middlewares: [
            LoggingMiddleware.middleware,
            ThunkMiddleware<CounterStore>.middleware
        ])
    )
    .initialize()

    // Create the SwiftUI view and inject the store as an environment object
    let contentView = Counter()
        .environment(\.managedObjectContext, context)
        .environmentObject(rootStore)

    // Use a UIHostingController as window root view controller.
    if let windowScene = scene as? UIWindowScene {
        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = UIHostingController(rootView: contentView)
        self.window = window
        window.makeKeyAndVisible()
    }
}

~~~
