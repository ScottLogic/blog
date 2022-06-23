---
title: Developing Bristol Pound - An Open Source React Native App
date: 2017-11-22 00:00:00 Z
categories:
- ceberhardt
- Open Source
author: ceberhardt
contributors:
- gginghina
- cmeehan
layout: default_post
summary: A few weeks ago the new Bristol Pound mobile app was launched, allowing users
  of this local currency to find vendors, view transactions and make payments on both
  iOS and Android. This post describes our experience of writing this application
  using React Native.
image: ceberhardt/assets/bristol-pound/bristol-pound-app.jpg
colour: pink
header-shape: shape4
---

A few weeks ago the new Bristol Pound mobile app was launched, allowing users of this local currency to find vendors, view transactions and make payments on both iOS and Android.

![bristol-pound-app.png]({{site.baseurl}}/ceberhardt/assets/bristol-pound/bristol-pound-app.jpg)


If you want to try out the app, you can download it from the [iOS App Store](https://itunes.apple.com/gb/app/bristol-pound/id1230035185?mt=8), or [Google Play Store](https://play.google.com/store/apps/details?id=org.bristolpound.mobile.rn.android) - although as the app is for a local currency, you’ll need to be a resident of Bristol to make full use of the application. You can [find more details of this process on the Bristol Pound website](https://bristolpound.org/).

This post is all about the code behind the mobile app, which is [open source and available on GitLab](https://gitlab.com/TownPound/Cyclos/ScottLogic.mobile.react-native). It’s quite a sizeable React Native codebase, which we hope will be of use to other developers.

In this post we’d like to share some of our thoughts and experiences from developing this application.

## Why React Native?

Bristol Pound uses the [Cyclos](https://www.cyclos.org/) online banking platform, which [exposes a REST API](https://demo.cyclos.org/api). As a result, we were free to use whatever technology we felt most appropriate for the mobile applications. We wanted to support both iOS and Android, so some form of cross-platform technology was our preference.

Our initial implementation used [Ionic](https://ionicframework.com/), a HTML5 framework based on Angular, distributed via [Apache Cordova](https://cordova.apache.org/).

Ionic gives a good developer experience, which is pretty much the same as web application development, being predominantly browser-based. However, we found that the technical constraints of Ionic were shaping our designs. The application UI was primarily list and drill-down, because this is what is easiest to achieve. We really wanted this user experience of this application to be first-class, without being constrained by the UI framework.

We’d had [some previous React Native experience](http://blog.scottlogic.com/2015/03/26/react-native-retrospective.html), and liked the way you could deliver fully native user interfaces, without compromise.

A new set of (more ambitious) designs were created, and a quick React Native prototype assembled.

![bp-screenshots.jpg]({{site.baseurl}}/ceberhardt/assets/bristol-pound/bp-screenshots.jpg)


As the app is used on-the-go, we wanted to make the map the primary focus. Furthermore, we also know there will be guest-users of this app, visitors to Bristol who are simply curious about this quirky concept. Again, we wanted to take them straight to the map to see local businesses that support the currency.

The prototype results looked good! From thereon we were sold on this approach. However, it hasn’t been plain sailing …

Even though React Native is cross platform, there were still points when things would act differently on iOS than on Android and hence we had some platform-dependent code.

One good example is the differing keyboard interactions, which on iOS require an extra step before hiding and require two clicks to dismiss instead of one as on Android. In fact keyboard interactions have been a bit of a battle for React Native developers, with [numerous different strategies for ensuring that the keyboard doesn’t cover the content](https://stackoverflow.com/questions/29685421/react-native-hide-keyboard).

Other minor differences are that certain components have useful properties on Android but not iOS (or vice-versa), for example overflow, shadows and z-index. In each case we had to come up with workarounds to resolve these differences.

## Expo

Initially, creating the JavaScript bundle and running the app on an emulator or device was a little tedious. This was done using the stand React Native Packager, which has platform specific builds within Android and iOS folders. On top of this, platform specific issues would arise when linking with libraries that contained native code (react-native-maps has been quite the pain!) due to the different tooling for each platform - for example iOS using CocoaPods.

Complex builds, with tricky configuration are not peculiar to React Native development. Similar problems exist in the web world, where developers rely on complex and unmaintainable scaffolding code. To combat this issue a team Facebook came up with [create-react-app](https://github.com/facebookincubator/create-react-app), which moves the build tooling and configuration into a single project dependency, removing the need for copy / paste configuration, and providing a ‘standard’ way of building projects.

While React Native shares these same issues, there is yet more complexity, with the development process relying on complex iOS and Android build tooling (installing Android Studio and setting up emulators is not much fun!).

The team at [Expo](https://expo.io/) came up with a creative solution to this problem, they created an app that is available on the iOS and Android stores, that contains the React Native runtime, it is effectively the ‘shell’ of an app. As a developer, your local build only has to concern itself with the cross-platform JavaScript elements of your application, with the bundle being executed within the Expo App.

Facebook combined the create-react-app approach with Expo, creating a new ‘standard’ approach to React Native development, [create-react-native-app](https://facebook.github.io/react-native/blog/2017/03/13/introducing-create-react-native-app.html)!

This greatly simplified and accelerated our build, Any device with the Expo app installed could just enter a URL (or scan a QR code) and voila, Expo would download JavaScript bundle and the app would run from inside it.

![use-create-react-native-app-to-set-up-a-simple-react-native-app.jpg]({{site.baseurl}}/ceberhardt/assets/bristol-pound/use-create-react-native-app-to-set-up-a-simple-react-native-app.jpg)

While the process of developing with Expo is itself much smoother than the original react native approach, it’s still not perfect ...

## Expo constraints

Firstly, we were limited to only utilising the native components that Expo supports: hence, if we’d need to use a different native module, or develop one ourselves, it wouldn’t be possible and we would need to either detach or eject from Expo.

Moreover, we were limited to utilising the versions of the modules that Expo would support. Generally, this should not be an issue as Expo creates regular updates, however, as we used the Airbnb [react-native-maps](https://github.com/airbnb/react-native-maps) component, there were times when certain bugs would be fixed, and a new version would be released, but we couldn’t benefit from the bug patches until a new Expo version was made available.

Another issue that drove us to ejecting from Expo was the lack of control over the permissions the app would require the user to accept. Even though in the latest Expo release, developers have more control over these, when we were developing the application multiple unused permissions were added. For example, on Android the user would be asked to consent to the app using the Camera, accessing Contacts or read phone state. As our app did not need any of these permissions and required high level of security / integrity, this was an issue. The only way to be able to customise these permissions was after detaching or ejecting from Expo.

Additionally, even though the latest Expo release supports customisable splash screens, when we were working on the app, this was not possible. Hence, our app would load with the Expo logo, which was not desired.

Moreover, utilising Expo meant we’d have to provide build secrets to the server, which was also prohibitive given that the app we were developing manages people's money!

## Ejecting from Expo

In order to overcome all the issues mentioned above and gain full control over the Android / iOS specific build files (input modes, compliance information etc), we decided not to fully embrace Expo.

When ejecting / detaching, there are three options:

1. Full ejection back to the standard react native format (iOS / Android folders generated)
1. Detaching to ‘Expo kit’ - generates build folders in the Expo flavour (allows continued use of Expo specific npm packages.
1. Using “Expo build” - no ejection, build process takes place on a remote server


Even though detaching to the Expo kit option was available, we went for performing a full ejection as simply detaching would still keep the Expo specific loading screen on the app as well as other Expo generated properties. Hence, this option allowing us complete control over the app.

In itself, this is not a ‘clean’ process. The auto generated Android / iOS folders required much changing, and any Expo specific code would break the app. Moreover, having to fix these dependencies also implied re-linking the native components, which often created issues as ‘react-native link’ would not always work. There were a few Expo npm packages we used for loading fonts, getting location etc. that had to be rewritten upon ejection, and the process itself was long and frustrating.

However, once done, this didn’t need to be repeated very often, if at all. The ‘ejected’ code was placed in a different directory, with the remote of the git repo pointing to the open sourced repository. No changes to the functionality of the app itself were performed in this directory, but rather, whenever the code was changed, these changes would just be pulled into the ejected code. This would only ever cause issues if using the aforementioned Expo specific npm packages, which was very rarely.

Then, when it was time to make a release, we would follow the following procedure:

1. Go into the ejected code directory
1. Make a new branch for the current release version
1. Pull in the changes from the master from the public git repo
1. Bump the version numbers etc. in the AndroidManifest and in XCode
1. Make the release APK and IPA file


This process ultimately allowed us to build the APK / IPA locally, and overcome some of the issues we had with Expo, while at the same time sharing the code as open source, with other developers still benefiting from the Expo / create-react-native-app workflow.

Going forward, it seems the best and least troublesome option currently available would be to detach to Expo kit and build that way, still tracking changes related to the bumped version numbers etc. in the Android / iOS folders.

## Airbnb Map

One of the central features of our app was the map, which allows users to navigate around Bristol to find businesses that support this local currency. They search and filter the map by certain business categories and tap on a business to see more detailed information. For this feature, we originally considered using the maps component provided by React Native, however it was only supported on iOS.

Throughout the course of the project a better alternative appeared, a map component provided by the team at Airbnb, which offered support for both Android and iOS. However, this didn’t turn out to be a smooth process. Firstly, integrating the maps component into our app was rather difficult, but even after this was successful, the module turned out to be quite buggy at first.

This certainly isn’t meant to imply any disrespect for the skilled team at Airbnb who shared this important code. Rather, it is a reflection of the complexity of the task they took on - creating a cross-platform wrapper around the native iOS and Android maps is a significant challenge. Furthermore, with so many applications using their map component, there is a large burden of support on this open source team.

Surprisingly, integrating pre-existing JavaScript modules with React Native apps proved to be a very easy process. In our app, we used multiple JavaScript utility libraries, such as Lodash, Haversine etc… We also used Redux, which has become something of a standard for React developers.

In order to improve the performance of our map, which could display over 600 businesses, we integrated [Supercluster](https://github.com/mapbox/supercluster), a very fast JavaScript library for geospatial point clustering. Although presenting a lot of advantages, one drawback of using this library was the fact that the library utilised [GeoJSON Point](https://tools.ietf.org/html/rfc7946#section-3.1.2), hence making manipulating the map point objects impossible (such as adding extra properties that would help visualisation). The outcome of this was that we couldn’t fully benefit from the performance advantages this library provided, as we had to perform additional computations in order to obtain certain properties needed to render the business the maps (such as whether a business was selected). Nonetheless, utilising this library did prove useful, and saved us from writing the complex clustering logic ourselves!

## The future

Since React Native has grown astronomically in popularity since its creation, a number of ‘best practices’ have emerged. With more time, we would have implemented these changes to boost the performance and scalability of the app. Of course, the same optimisations that can be implemented on any React / Redux project still apply with React Native; such as using `shouldComponentUpdate` and extending from PureComponent when possible. Beyond these standard techniques, there are some specific tips that can boost the performance of the app.

During the early development stages of the app, we used a standard `ListView` component for displaying the list of transactions per business as well as per month. This component, as well as those which derive directly from it, have a linearly increasing memory footprint when scrolling down long lists, eventually exhausting memory and contributing to slower rendering. Better implementations have since arisen, such as the FlatList, which are referred to as ‘memory minded lists’. These lists have features such as lazy loading and can greatly improve app performance. When a large number of transactions have been made to a single business, there is a noticeable ‘slow down’ when opening up this business page; this could be readily resolved by using the upgraded list component.

For the general navigation of the app, we used a tab bar, storing the current page index in redux and rendering accordingly. This tab bar worked quite well overall with no noticeable performance issues. There were other places in the app where we placed sequential modals on top of each other to guide the user through the transaction procedure. While both of these navigational methods were implemented in purely javascript, it would have been better to use native navigation.

The native navigation uses specific `Navigator` components that can be nested as desired. In our case, we could have had used a `TabNavigator` at the outermost layer, and nest a `StackNavigator` within it, using card views for each progressive screen through the transaction process. This approach comes with a number of advantages:

1. The stack navigator uses the native device method to ‘go back’, so the android back button could be used to pop a card off the stack and go back to the previous screen. The state of each screen component is also stored. We did all this manually, adding an unnecessary degree of complexity.
1. As the navigation is done on the native thread, the performance will always be better. We used an animation for the transaction confirmation screen sliding up from the bottom which would sometimes be a bit jittery. A wide range of native transition animations are available within the native navigator components, guaranteeing smooth transitions.
1. There is wide support for integrating Redux into these navigators, easily allowing navigation actions etc. to be dispatched from anywhere.

## Conclusions

It’s certainly been a fun and interesting experience developing this application, and we are very pleased with the end result.

Probably the biggest lesson we learnt when developing this application is the pace of change with both React Native and Expo is very rapid and unfortunately quite disruptive. Bugs are being fixed, and new features at an impressive rate, however, accommodating those changes into your application is just too time consuming - we’ve got other things to focus on, like adding features, and keeping our stakeholders happy!

As a result of this 'churn', the structure of our app changed quite a few times, as a result we wouldn't consider it to be an embodiment of 'best practice' for React Native application development, our main focus was on getting the app released!

Neither React Native or Expo are using semantic release, which makes it hard to know whether a newly released version is worth considering, without delving into the release notes. Furthermore, there have been releases that introduce subtle platform-specific bugs, for example changing the way in which the keyboard ‘avoidance’ should be performed.

There are certainly many positives about React Native (with the community being one of them), but if you are writing a non-trivial application, prepare for a bumpy ride!
