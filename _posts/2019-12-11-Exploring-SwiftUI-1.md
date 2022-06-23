---
title: Exploring SwiftUI Part 1 - A brief history of Apple UI development and Initial
  impressions
date: 2019-12-11 00:00:00 Z
categories:
- bquinn
- Tech
tags:
- Swift,
- SwiftUI,
- UI,
- iOS
author: bquinn
layout: default_post
image: bquinn/assets/swiftui-96x96.png
summary: This is the first of a series of blog posts exploring SwiftUI, the new UI
  framework for native Apple development. This post will focus on my initial impressions,
  having gone through the first part of Apple's SwiftUI tutorials.
---

I will be writing a series of blog posts exploring the new SwiftUI framework for developing on Apple platforms, with a specific focus on developing for iPhone. SwiftUI was released with Xcode 11 late in October, although tools for SwiftUI development are only available when running on macOS Catalina 10.15. It is an exciting new UI framework written for Swift, as I explored in my [previous post](https://blog.scottlogic.com/2019/09/02/swift-ui-a-new-player-in-ui-frameworks.html), which looked at what the release of SwiftUI will mean for development on Apple platforms. This post will focus on my initial impressions having gone through the first part of Apple's SwiftUI tutorials. But before I look at SwiftUI, it's worth taking a little look at its predecessors to understand what it's trying to improve upon.

## A little history of Apple development

### Languages and Frameworks

In 2001 Apple released their line of OS X operating systems on Mac. These used Cocoa UI framework (FoundationKit and ApplicationKit) and the Objective-C programming language as the basis for app development. In 2008 Apple opened the App Store alongside the release of iPhone OS 2, opening up their mobile platform for app developers, using Cocoa Touch (FoundationKit and UIKit) and Objective-C. Since then, tvOS and watchOS have also been introduced, as well as having both iPads and iPhones on iOS. Developing for iOS, macOS, tvOS and watchOS is all quite different and have different frameworks.


In 2014, Apple released a new programming language called Swift. Where Objective-C was created in the 80's, Swift is a modern programming language with a lot of nice and powerful features (see my [previous post](https://blog.scottlogic.com/2019/07/19/swift-the-beautiful-language.html) for an overview). Apple's UI frameworks (ApplicationKit, UIKit etc.) were updated to work with Swift, but ultimately were still written in and intended for Objective-C. Fastforward to 2019 and we have Swift 5, which has developed a long way since Swift 1. It's [ABI stable](https://swift.org/blog/abi-stability-and-more/) on Apple platforms, and has its own programming paradigms such as protocol oriented programming. However, developing in Swift using Cocoa or Cocoa Touch always felt a little bit like you were fighting against their Objective-C history.


### Tools and patterns

To fully explain the impact of SwiftUI on a developer, I will briefly explain some of the existing tools and patterns in Apple development using Swift. I will draw examples from iPhone development using UIKit, but the same will be true of the other platforms and frameworks.

Interface Builder (IB) is a way of statically rendering views so that you can design your UI without compiling your code. It uses 'storyboard' and 'xib' (pronounced nib) files, which are essentially large XML files equivalent to HTML in the web. Xcode (the IDE for development on Apple platforms) interprets this XML and displays an image. 

![Screenshot 2019-12-05 at 10.27.04.png]({{site.baseurl}}/bquinn/assets/Screenshot 2019-12-05 at 10.27.04.png)

You can drop in new components, or add constraints to define the layout of your views (e.g. height, distance from other views, centering on the screen). The Auto Layout framework will calculate the height and position of your views from those constraints, allowing your designs to be reactive to different device sizes and orientations. Xib files are used to design individual components that can be reused. Storyboard files are used to define a sequence of screens as shown in the image, which the user can navigate between.

Interface Builder and Auto Layout are very useful tools, but aren't perfect. Not all UI designs can be implemented in IB, which means that you end up with UI design split between your IB files and Swift code files. This introduces complexity and obscures the source of design features, leading to bugs. In addition, to test your UI you have to compile the code and run it on either a simulator or a device to ensure that the code and IB files work together to have the effect you want.

Similarly while Auto Layout allows for very flexible designs, and is a lot easier and more intuitive to use than something like CSS on the web, it still has its problems. Complex designs often end up having a lot of constraints, and some of them may be in conflict. IB will inform you that this is happening, but it can often be difficult to track down the cause of the conflict due to the complex dependencies between constraints. The introduction of UIStackView, which simply spaces out views along an axis, has helped lessen the number of constraints, but Auto Layout is still a cause of much frustration.

Finally, there are some patterns in Cocoa Touch which are forced on developers. UIKit heavily embraced the MVC architecture, so every UIView ultimately belongs to a UIViewController. Both UIView and UIViewController are classes, so creating custom views and view controllers requires subclassing. This is an example of how Swift development clashed a little with UIKit, as Swift prefers the use of protocols and structs to classes. Another example of a pattern forced on developers is the extensive use of delegates in UIKit, for example for UITableView, effectively a list. The UITableViewDelegate handled interactions such as selecting a row. Making a UITableView work properly could take hours of your time due to the complexity of the way it called its delegate functions and set out its views.

## Enter SwiftUI

SwiftUI takes a very different approach to UI development than UIKit. It uses declarative syntax to define views in Swift code exclusively. It uses data binding over observers, and overall has the modern feel of successful UI frameworks such as React. Having done the [SwiftUI Essentials](https://developer.apple.com/tutorials/swiftui/tutorials) tutorial on the Apple website, I'll write about some of the best features I've enjoyed in comparison to Cocoa development.

### Hot Reloading

Xcode 11 introduces a preview feature alongside SwiftUI. This means when you open a SwiftUI View file, the preview will display alongside it. When editing static views or properties such as text or colours, the preview will update as you write code, allowing you to view the changes without compiling the code. You can also enter live preview mode, where you can interact with the app and dynamic views will be loaded based on data supplied by a PreviewProvider. This is very similar to frameworks such as React. However, SwiftUI allows you to do this for each individual View as well as for composite Views.

![Screenshot 2019-12-05 at 11.58.01.png]({{site.baseurl}}/bquinn/assets/Screenshot 2019-12-05 at 11.58.01.png)

### Clarity and Simplicity

In SwiftUI the code is the single source of truth for UI design. Although in Xcode you can interact with the preview to drag and drop in new views or to edit properties such as colour, ultimately these edits update the code which defines the view. This ensures there's no ambiguity where design features are defined, making for a much simpler development process.

In addition, SwiftUI uses a declarative syntax to build UI frameworks which is easy to read. Modifiers can be chained to alter properties such as styling.

![Screenshot 2019-12-05 at 11.14.50.png]({{site.baseurl}}/bquinn/assets/Screenshot 2019-12-05 at 11.14.50.png)

Layout seems to have been simplified by removing Auto Layout and encouraging the use of the components HStack, VStack and ZStack which will stack views along the three axis on screen. Modifiers such as offset and padding allow you to finetune the positions of your views. I've yet to test SwiftUI against complex layouts and I'm interested to see whether it holds up. For simple views however, it's very easy and intuitive.


### A framework written for Swift

SwiftUI is a framework written for Swift. It takes advantage of the features of Swift, such as using trailing closure syntax to make its declarative syntax readable. It encourages the use of protocols over class inheritance by using protocols for the basic building blocks of the framework, such as View.

An example of this is the List view, which replaces UITableView and its delegate. Lists work by being passed an array of objects which can be uniquely identified. There is an option to pass in a key path to a property that will uniquely identify the objects in the array. Alternatively, you can ensure the objects conform to the protocol Identifiable and it will automatically use the id property. This is just a small example of how protocols are baked into SwiftUI's functionality and I'm excited to be able to use Protocol Oriented Programming more.

### Backward compatibility

SwiftUI provides a way to use views from the original frameworks such as UIKit. This comes in the form of protocols such as UIViewRepresentable. A SwiftUI view can conform to this protocol and, by implementing its function, wrap the UIView in such a way that it works in the new framework.

Interestingly, Apple have also made it very easy to add new SwiftUI Views into existing UIKit applications. A new class, UIHostingController, is a part of SwiftUI, which subclasses UIViewController which is a UIKit class. UIHostingController takes a SwiftUI View as view to present however, meaning it is very easy to embed SwiftUI views within UIKit applications simply by wrapping them in a UIHostingController. 

These two methods of compatibility are very important for the adoption of SwiftUI by developers on Apple platforms. Allowing UIKit components to be used in SwiftUI applications means that all the techniques developers have built in the past decade and the libraries of custom components can be carried forward into new applications written in SwiftUI. Allowing SwiftUI components to be used in UIKit allows existing applications to migrate over to SwiftUI slowly, view by view. Given its advantages over Cocoa development, it seems likely that SwiftUI will rapidly become the foremost way to develop applications on Apple platforms.


## Until next time

There's a lot of questions unanswered at this stage - how well does SwiftUI handle data management, complex composite views, complicated app navigation and animations? What design patterns work well with SwiftUI? Look out for further posts on SwiftUI answering these and other questions as I continue exploring it.
