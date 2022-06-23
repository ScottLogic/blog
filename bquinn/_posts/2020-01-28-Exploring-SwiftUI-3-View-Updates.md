---
published: true
author: bquinn
layout: default_post
category: Tech
title: 'Exploring SwiftUI 3: View Hierarchies and State Updates'
summary: >-
  In this post I take a closer look at how SwiftUI uses declarative syntax to
  construct view hierarchies, and how it transmits state updates to the UI.
tags: 'Swift, SwiftUI, iOS, Declarative UI'
image: bquinn/assets/swiftui-logo.png
---

SwiftUI is a new declarative UI framework Apple have released for developing apps on their platforms. In this post, I will particularly look at how to construct view hierarchies.

## Declaring View Hierarchies

SwiftUI provides an elegant declarative syntax for composing complex view hierarchies in a readable and simple way.

### A View body

SwiftUI view hierarchies are made of structs which conform to the protocol `View`, which looks like this:

~~~swift
public protocol View {

    /// The type of view representing the body of this view.
    ///
    /// When you create a custom view, Swift infers this type from your
    /// implementation of the required `body` property.
    associatedtype Body : View

    /// Declares the content and behavior of this view.
    var body: Self.Body { get }
}
~~~

`View` has an associated type which must conform to `View`, and a single property called `body`. Conformers must provide an implementation of `body` which must return a type that conforms to `View`, which becomes the `Body` type. SwiftUI views are structs which conform to the `View` protocol:

~~~swift
struct SwiftUIView: View {
    var body: some View {
        Text("Hello, World!")
    }
}
~~~

Note that Swift syntax allows you to omit the return keyword if the compiler can infer the returned object, in this case `Text`. The combined effect of the return type `some View`[^1] has two significant effects:

1. Any returned object must conform to the protocol View, satisfying the protocol constraint on the `Body` associated type.
2. The returned object must be the same concrete type every time, ensuring that `Body` is well defined for any given view.

Therefore a SwiftUI `View` has a `body` property which returns another SwiftUI `View`.  In this way views can be composed into complex hierarchies by nesting them in other views' `body` properties. Custom views can easily defined by conforming to `View`, and can be used in the same way as pre-built components.

### Grouping Views

A SwiftUI `body` property has to return a single view to satisfy the protocol definition. It is possible however to compose multiple views using special **grouping** views. These views become the `Body` type for the SwiftUI view which returns them. They themselves have a `Body` type of `Never`, which is how they can contain multiple views. They are one of the primitive views which SwiftUI has some special handling for, which works out how to render the views they contain. In practice, you can treat them in the same way as a normal view, but containing multiple views instead of just one.

~~~swift
struct SwiftUIView: View {
    var messages = ["Hi", "Welcome"]
    var body: some View {
        ForEach(messages, id: \.self) { message in
            VStack {
                Text(message)
                Group {
                    Text("This button will appear with every message")
                    Button(action: self.doAction) {
                        Text("Tap me")
                    }
                }
            }
        }
    }

    func doAction() { ... }
}
~~~

The most common grouping views are the stack views (`HStack`, `VStack` and `ZStack`), `Group` and `ForEach`. The stack views provide a way to spatially arrange views by stacking them horizontally, vertically and on top of each other respectively, with a defined spacing between them. `Group` simply provides a way to group up to 10 views together in code, and has no effect on rendering. `ForEach` is very similar to `Group` but takes in a `Collection` of data and outputs a view which you define for each member of the collection (syntactically it's very similar to a `forEach` method, hence its name). The members of `ForEach` have to be uniquely identifiable by a property. In the example above, we provide the property `self` to uniquely identify the strings in the array by their own value. The resulting UI is:

![SwiftUIGroupsExample.png]({{site.baseurl}}/bquinn/assets/SwiftUIGroupsExample.png)

## SwiftUI state

Being a declarative UI framework, SwiftUI renders views based on the state of the application, with a few different ways of declaring state.

### @State

The most basic way of storing state in SwiftUI is the `@State` property wrapper. This is applied to properties on a view. SwiftUI views' properties are immutable because they are structs, which are value types. The `@State` property wrapper hands off managing the value of the property to SwiftUI, allowing you to treat the property as mutable without actually mutating the underlying struct[^2]. `@State` properties should be marked as private and should only be mutated by the view that owns them, or their children. An example might be a boolean which correlates to a toggle button being on or off.

### @ObservedObject

Wrapping properties with the `@ObservedObject` wrapper allows SwiftUI views to hook into Swift's Combine framework, which manages data changing over time or asynchronous. The `@ObservedObject` wrapper must be applied to a type which conforms to Combine's `ObservableObject` protocol. An `ObservableObject` mus be class, which may have multiple mutable properties. When any of the properties change, the `ObservableObject` publishes a notification to inform any subscribers that the class has changed. Wrapping a view's property in `@ObservedObject` informs SwiftUI that the property is a source of UI state, and to watch the publisher for changes. An example might be a network service, which publishes values from a network call.

### @Binding

The `@Binding` property wrapper is applied to properties on a view, and wraps them in the `Binding` struct. `@State` exposes a property which returns a `Binding` struct wrapping the value it controls. `@ObservedObject` exposes a property which has the same properties as the object, and returns their values wrapped in a `Binding` struct. Instances of `Binding` can be passed into a child view to initialize a property wrapped with `@Binding`. This gives the child a way to get and set the value without copying the state. This helps keep one source of truth for state, while allowing children to mutate thier parents' state.

### @EnvironmentObject

The `@EnvironmentObject` wrapper is very similar to the `@ObservedObject` wrapper and also refers to an `ObservableObject`. The difference between environment objects and observed objects is where the state is stored. Observed objects are created and stored on the view that declares them, whereas environment objects are injected into the **environment** of a view from outside, and can be read and mutated directly by any of its child views without needing to pass it as a binding.


## Updating Views

Understanding how to construct view hierarchies in SwiftUI, and how to manage state using property wrappers provides the basis for understanding what happens when state changes and the UI updates.

### Rendering Views

There are two stages SwiftUI goes through to render UI from your Swift code. The first is to initialise the `View` structs which you define in your code. These are essentially a blueprint of what you would like the UI to look like based on the state of the application, defined in the `body` properties of the views. SwiftUI builds the view hierarchy of a `View` by calling the `body` property to initialise its children. It will then call the `body` property of each of those children, which may then initialise their own children, which have their `body` property called, and so on. There are a number of **primitive** views that come with SwiftUI, such as `Text`, which have a `Body` type of `Never`. `Never` is a special return type in Swift which tells the compiler that the function will never return. In this case, `Never` means that SwiftUI doesn't call `body` when these primitive views are initialised, but handles them in a special way. These primitives therefore become the base of any view hierarchy, as they don't initialise any new views in their body function.

Once all the views have been initialised, SwiftUI will have been able to create a virtual **view tree**.  When you inspect the view tree on a debug build, you can see that custom `View` structs are not part of it - instead, it is made up of the primitive views with `Never` types. Even a pre-defined component such as `Button` will be broken down to primitive views on the view tree. These primitive views will be fed into the rendering stage to produce the UI that the user can interact with.

It's important to note therefore that the initialising a SwiftUI `View` struct doesn't automatically lead to updating the virtual view tree. SwiftUI will only access the `body` property on a `View` if the value of the `View` has changed. This means only the parts of the view hierarchy which have actually changed will be updated on the virtual tree, and then re-rendered.  While re-rendering is expensive, it's relatively cheap to initialise SwiftUI views because they are value types. Therefore this system allows SwiftUI to remain performant by calling `body` when a view's state changes, and initialising all of its child views again, yet only re-rendering the children affected by the change in state by comparing the resultant primitive views.

### Triggering re-renders

SwiftUI re-renders are triggered by changes in state, which leads to the `body` property of a `View` to be recomputed. Once this body is recomputed, the rendering system described in the previous system ensures that any `View` structs affected by the state are re-rendered, as their value will have changed.

If a `@State` property is changed then the view which declared that property its `body` recomputed.  Any newly initialised views which have a different value to their predecessor will also have their `body` recomputed and so on. This leads to all the views affected by the change in state being re-rendered.

If an `@ObservedObject` publishes a new value, any view with a property referencing object  will have its `body` recomputed. An `ObservableObject` can have multiple properties, but only informs subscribers that it has changed, not which of its properties has changed. This means SwiftUI can't predict whether a view will update based on whether it actually uses the property that has changed, so it's possible `body` will be recalculated when it didn't need to be. This is particularly true of `@EnvironmentObject`, as this is just a special type `ObservableObject` which is intended to be injected into multiple views. However, as stated in the previous section, initialising views in the `body` computation is relatively cheap, and if the state didn't cause a change in the view then that won't change the virtual tree and therefore won't lead to a re-render.


## Conclusion

SwiftUI separates the computation of its view hierarchy from the rendering of basic components. Only basic components are actually rendered, so changes are easily distinguished and re-rendered. The view hierarchy is recalculatedin response to changes in application state. This is tracked using wrapped properties, and only `View` bodies which declare the property which changes are recalculated. During calculation, top level `View` structs are reduced down to basic components. This system leads to an efficient declarative rendering framework with easily traceable state changes.


[^1]: _In Swift, the syntax `some View` means the type of the property body is an opaque type which conforms `View`. Opaque types are new in Swift 5.1 and mean that Swift hides the concrete type of the object returned from the caller. This is sometimes described as a reverse generic type because it performs the opposite role to a generic type; a generic type has a defined concrete type at the call site, but the concrete type is unknown in the implementation. An opaque type has a defined concrete type in the implementation, but an unknown concrete type at the call site. An important feature of opaque return types is that the concrete return type must always be the same, even though it is obscured to the caller._

[^2]: _In Swift, a property wrapper is an object that wraps the declared value. It's syntactic sugar that allows you to succinctly access the wrapped value as though it wasn't wrapped, while adding extra functionality in the wrapper. In SwiftUI, adding the `@State` wrapper to a property means that when you apparently mutate that property, you are actually calling a setter on the `State` struct wrapping the property. This hands off to the SwiftUI framework to actually control the state value, which is why the compiler doesn't complain about mututating an immutable value._
