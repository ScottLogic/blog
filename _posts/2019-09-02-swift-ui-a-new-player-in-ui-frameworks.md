---
title: 'SwiftUI: A new player in UI frameworks'
date: 2019-09-02 00:00:00 Z
categories:
- Tech
tags:
- Swift,
- Mobile,
- React
- Native,
- Flutter,
- UI
author: bquinn
layout: default_post
summary: SwiftUI is Apple's new UI framework for all its platforms - watchOS, tvOS,
  iOS and macOS. This post explores the significance of its release, comparing it
  to both to former native iOS development and competitor frameworks.
image: bquinn/assets/swiftui-96x96.png
---

## What is SwiftUI?

**SwiftUI** is a new UI framework currently in beta and will be released officially with Xcode 11 which requires macOS Catalina. This will be released this **Autumn**, probably within the next month or so. Apple describe it like [this](https://developer.apple.com/xcode/swiftui/):

> SwiftUI is an innovative, exceptionally simple way to build user interfaces across all Apple platforms with the power of Swift. Build user interfaces for any Apple device using just one set of tools and APIs. With a declarative Swift syntax that’s easy to read and natural to write, SwiftUI works seamlessly with new Xcode design tools to keep your code and design perfectly in sync. Automatic support for Dynamic Type, Dark Mode, localization, and accessibility means your first line of SwiftUI code is already the most powerful UI code you’ve ever written.

## What does this mean?

Let's look at some of this in a bit more detail:

> SwiftUI is an innovative, exceptionally simple way to build user interfaces across all Apple platforms with the power of Swift.

The key take away from this sentence is that the release of SwiftUI is aimed specifically at **Apple platforms**. Historically Apple have stuck with developing and promoting their own systems foremost to encourage the purchase of their hardware, and this latest technology is no exception.

However, the modern age has seen the rise of **open source** software and the **decline of brand loyalty**, with many users daily transitioning across platforms and operating systems (Android phone to a Windows desktop to an Apple watch). Apple seem to have decided they want to push Swift forward as a language beyond their own platforms. As of 2015, Swift is an open source language and as part of this Apple released Swift binaries for use on **Ubuntu**. Swift can also be used for writing server code, or as a scripting language.

With this in mind, while Apple are definitely focussing first and foremost on improving the development experience on their own platforms, we may see them breaking out into other areas of the software industry in the near future. Indeed the Swift community has been doing so without them; you can **port Swift** into [Windows](https://swiftforwindows.github.io/) and even [Android](https://www.scade.io/). 

The significance of SwiftUI is that it may provide a way into **web technology** for Swift. Even before it has left beta, the Swift community have created a way of **running SwiftUI in the browser** - [SwiftWebUI](https://github.com/SwiftWebUI/SwiftWebUI). Whether Apple will pick this up themselves remains to be seen, but it's another stepping stone for Swift towards running on all platforms.

> Build user interfaces for any Apple device using just one set of tools and APIs

This sentence reiterates that SwiftUI will be **one framework** across **all the Apple platforms** - this is in contrast to the current system which has WatchKit for watchOS, AppKit for macOS and UIKit for iOS and tvOS. This is important for developers working in the Apple ecosystem as it unifies the platforms and so **eases the creation of an app** for all of them. This will benefit Apple by expanding the app offerings on all of its devices as developers find it **easier to spread their apps**. For example, what may have been originally a mobile app will be easier to put onto AppleWatch.

I believe this sentence also contrasts SwiftUI with platform agnostic frameworks such as **React Native** or **Flutter**. SwiftUI is Apple's answer to the increasing popularity of these frameworks on its platforms, and they want to emphasise that it has the **same ease of writing** across its platforms as they provide in working between **iOS and Android**. In fact in some ways it is **ahead** of these frameworks. Although frameworks such as Flutter and React Native have some ability to write **desktop** apps, it is unlikely they will be nearly as comprehensive for macOS as SwiftUI will be when it's released. 

> A declarative Swift syntax that’s easy to read and natural to write

This is the biggest change SwiftUI makes to developing frontend applications on Apple platforms. Up to this point, development has been done using **Cocoa** and **Cocoa Touch** exposed through frameworks such as AppKit. These are based on Objective-C, with a Swift API wrapper added on top in more recent times. However, development was **restricted** in a number of ways, including the enforcement of **MVC** architecture, complicated **delegate** callbacks for views such as tables and **class-oriented programming** enforced through the neccesity of subclassing UIViews.

As I mentioned in the second section, frameworks such as React Native and Flutter have gained popularity on Apple's platforms, and frameworks such as React and Angular are hugely popular in web frontend development. The common factor between all these frameworks is their **declarative** syntax. SwiftUI also uses declarative syntax, a massive upgrade to the old Cocoa imperative approach to developing UI.

The tagline for SwiftUI when it was introduced in WWDC19 was **"the shortest path to a great app"**. SwiftUI is presented as a framework which will take care of the 'basic' things like creating lists, animating transitions and screen layout, leaving the developer with **more time** to create the complicated systems that make their app **unique** and **branded**. The declarative syntax is what allows this, writing code saying what to do, not how to do it. For example, no longer will you have to play around with delegates and datasources when creating a simple table - in SwiftUI you can simply wrap your views in a `List` component.

> SwiftUI works seamlessly with new Xcode design tools to keep your code and design perfectly in sync

Largely enabled by the new declarative syntax, SwiftUI also provides a much clearer way to control **data flow** through your app. Using property wrappers such as `@State` on your properties, you can clearly define the **sources of truth** that your UI draws from. You can then **bind** this state to your UI in a similar way to React, leading to **clear**, **state-driven** and **reactive** UI. Alongside SwiftUI, Apple have released [Combine](https://developer.apple.com/documentation/combine), a powerful event processing framework for communicating changes of state.

This change leads into one of the biggest advantages SwiftUI has over any other UI framework: **Xcode 11** tools. Xcode is the **IDE** Apple produce for Swift development on Macs, and is generally the best for creating UI as it is packed full of features. Xcode releases are intrinsically linked to Swift releases, and Xcode 11 is the version being released alongside SwiftUI. Xcode 11 features an **embedded simulator** with **hot reloading** of UI for static design, and a 'play' button than runs live debug data through your app. This brings SwiftUI alongside a framework such as React for the duration of the development feedback loop. Where it goes above and beyond is not only will writing code update the simulator, but you can also **edit UI in the simulator** and this will also **update the code**!

![Xcode_11 copy.jpeg]({{site.baseurl}}/bquinn/assets/Xcode_11%20copy.jpeg)

This is a massive **improvement** on previous UI development done in Xcode. Designs could be created in **Interface Builder** files called xibs (pronounced nibs) and storyboards, but everything could also be done programmatically, and in fact some things had to be done in code. Interface Builder files are essentially **XML**, but would statically render an image in Xcode to allow **immediate feedback** on design features such as layouts. However, you would generally find the design for one View was spread between Interface Builder files and Swift files, introducing **complexity** and **bugs**. Keeping the immediate and live design visualisation while also containing all design code in **one file** will simplify development and help avoid bugs, while hot reloading will save plenty of time waiting for builds to compile onto the simulator or a device.

## To Conclude...

> Automatic support for Dynamic Type, Dark Mode, localization, and accessibility means your first line of SwiftUI code is already the most powerful UI code you’ve ever written

I hope you can agree with this closing statement having heard in a little more detail the changes coming to UI development through SwiftUI. It is an incredibly **powerful** framework, and brings native Apple platform development back up to the standard of its competitors, and even ahead in some ways. I'm very excited to start working with SwiftUI when it's released. Watch this space for **more posts** exploring it in the future!
