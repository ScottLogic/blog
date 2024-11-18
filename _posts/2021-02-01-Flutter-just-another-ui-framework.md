---
title: 'Flutter: Just another mobile UI framework?'
date: 2021-02-01 00:00:00 Z
categories:
- Tech
tags:
- Flutter,
- Dart,
- Mobile,
- UI,
- iOS,
- Android,
- featured
author: bquinn
layout: default_post
image: bquinn/assets/Flutter_logo.png
summary: Flutter is a cross-platform mobile UI framework which allows you to  develop an app for Android and iOS with one codebase. But is it any good?
---

![Flutter_logo_text.png]({{site.baseurl}}/bquinn/assets/Flutter_logo_text.png)

While on furlough last year I had the opportunity to **develop and release an app** called Bethshan Unite to the AppStore and PlayStore for my church.

I had previously developed **native** iOS apps using UIKit, Swift and SwiftUI, but
had no experience developing natively on Android. It was also clear that I wouldn't be able to write two codebases myself during the time I was on furlough. This led me to investigate 
cross-platform frameworks. In particular I wanted to use a **natively compiled** framework to get the performance and feel of a native app, without the trouble of writing two codebases.

## So why Flutter?

A number of factors influenced my decision to use Flutter for the app. If I'm honest, I enjoy trying new things and Flutter sounded new and interesting. However, it was important to choose the best
tool for the job, so this wasn't the sole motivation behind choosing Flutter. I tried developing a simple app in Flutter and found I quite liked it. Some of my reasons for choosing it were

* Flutter allows **hot reloading**, giving you fast feedback on your changes which is very nice. 
* Flutter is developed by **Google**, and so I suspect it will grow and become a major player in mobile development. 
* Flutter can be used to build **desktop** applications, and also **web** content (although I believe neither of these are as established as the mobile development frameworks), so it may be useful to know if it breaks into those markets.
* Flutter truly lives up to its **one codebase** claims - you really don't need to write different code or different views for Android and iOS. 
* There is a good **package management** framework at pub.dev
* Where you need to integrate with the **native APIs**, such as camera or microphone, it is fairly easy to do so. (although I never actually found I had to do so - there was always a package available to do it!)

That's just a few of the pros of the framework that led to me selecting Flutter to develop my app. So how does it work?

## Everything's a Widget

A common phrase you read when learning Flutter development is that everything is a **Widget**. Widgets are the basic building blocks of a Flutter UI - like Views in native mobile frameworks,
or sort of like HTML elements on the web. However, there is **no markup** language in Flutter unlike many UI frameworks such as HTML on web or XAML for Xamarin. Flutter Widgets are contructed 
entirely from code:

~~~ dart
class MyView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Text("MyView");
  }
}
~~~

This defines a simple Widget called MyView which displays text using a Text Widget. What's interesting is that **layout** and **styling** is also done using Widgets in a compositional way:

~~~ dart
class MyView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Padding(
        child: Text("MyView"),
        padding: EdgeInsets.symmetric(vertical: 4.0),
      ),
      margin: EdgeInsets.all(4),
    );
  }
}
~~~

Here we are adding vertical padding by wrapping the Text Widget in a Padding widget. In Flutter we use the child property to build up the UI heirarchy. We are then also adding a margin 
of 4 on all sides by using the Container Widget. The Container Widget is like a `<div>` element in HTML. Wrapping a Widget in Container won't have any effect unless you add properties to
the Container such as margin, colour or width. Other common **layout widgets** include ListView, Row and Column.

There are many other types of Widgets as well as layout Widgets:

* **Animation Widgets** such as AnimatedSwitcher which will animate a transition between an element which is appearing on screen and one that is disappearing
* **State management Widgets** such as Provider which provides a value accessible through the BuildContext
* **Builder Widgets** such as FutureBuilder which allow you to build Widgets based on the outcome of asynchronous calls

## Stateful Widgets

The above example used **StatelessWidget**. That is appropriate for that Widget as it has constant size and unchanging text. Because it has no state, the Widget will always render the same
way, so using StatelessWidget also helps Flutter optimise its performance.

More complicated Widgets require State, and so need to extend **StatefulWidget**.

~~~ dart
class MyView extends StatefulWidget {
  @override
  MyViewState createState() => MyViewState();
}

class MyViewState extends State<MyView> {
  bool isConversationFinished = false;

  @override
  Widget build(BuildContext context) {
    return Column(children: [
        Text(isConversationFinished ? "Goodbye" : "Hello"),
        RaisedButton(
          onPress: () => setState(() {
            isConversationFinished = true;
          })
          child: Text("Finish conversation")
        ),
    );
  }
}
~~~

A StatefulWidget has a function "createState" which is called on the first render to create the state. From then on, whenever the Widget is re-rendered, it will receive the **same state** object
meaning that the state is persisted across rendering cycles. Notice the build function has moved to the State object, which allows it to use the state to decide on which text to display,
and also to set the state when the button is clicked.

## Dart

Hopefully it will have been easy to follow the code examples above, whether you come from a .NET, Java or JavaScript background. This is because Flutter uses Google's language **Dart**.
I would describe Dart as what would happen if JavaScript and Java have a child. It's a strongly typed language, leading to Java-like syntax in variable declarations. However you will
also see a lot of arrow functions, and the Dart promise API will be very familiar to anyone who has used JavaScript.

~~~ dart
Future<String> fetchMessages() async {
  return await api.getMessageList()
    .then((messages) => messages.map((m) => m.text).toList());
}
~~~

The reason for this is because Dart was developed by Google to be **easy to pick up** from any programming paradigm. This was certainly true for me, and I was able to
start writing Flutter code almost immediately. That said, I wouldn't say it is my favourite programming language - in many ways it feels **clunky** and **verbose**. For example, one of my
least favourite language features is the syntax for declaring private access, which is to prefix the name with an underscore. I don't find it very expressive, and it means typing a
lot of underscores across the course of the project.

~~~ dart
class MyClass {
  // This property has private access for this class only
  String _message = "Private";
  // This property has public access from outside this class
  String message = "Public";
}
~~~

## Developing a mobile app

So how does creating a cross-platform UI for mobile work in Flutter? Each Widget provided by the framework will render on **both** iOS and Android, so you can create your UI for both platforms in
one go. For example, the following Widget will render a piece of text over a button on either platform with not problems.

~~~ dart
class MyView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Text("This is a button"),
      RaisedButton(
        onPressed: () { /* do something */ },
        child: Text("Some action"),
      )
    ])
  }
}
~~~

There are some small nuances in design conventions between iOS and Android however. For example, the standard iOS button looks different to the standard Android button. Because Flutter is
developed by Google, the default design for most Widgets follows their **Material Design** principles, and so fits in well on Android. While the same buttons will work on iOS, you may decide you
want to try for a more native feel. In that case, there are libraries provided that allow you to select **Cupertino** Widgets if you would like. Such customisation is also readily available for
using system icons for something like settings - Apple's icons are different to Google's icons, and can be accessed from the CupertinoIcons class instead of Icons.

~~~ dart
class MyView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Text("This is a button"),
      Icon(icon: CupertinoIcons.person),
      CupertinoButton.filled(
        onPressed: () { /* do something */ },
        child: Text("Some action"),
      )
    ])
  }
}
~~~

In some cases, the framework handles this difference for you. One significant Widget is the **Scaffold**, which provides a top bar for navigation and actions. On iOS, the title is left 
aligned in the scaffold and the actions go on the right, whereas in Android the text is centre aligned and actions can go on either side. This is actually done for you by the Scaffold 
Widget, so you get that native feel without any extra effort. In addition, **navigation animations** will also be adjusted based on the platform without any extra code - new screens 
slide up from the bottom on Android, or slide in from the right on iOS.

The important thing is that customising your app to use these native styles or behaviours is entirely up to you - you could use the standard Material Design Widgets for everything and it would work perfectly on iPhone.
So with Flutter you have the best of both worlds, where you can truly write one codebase for both platforms, but also have the **flexibility** to use native styles where you think it's important.

## So is it worth it?

Overall I would conclude that Flutter is an **excellent** UI framework that significantly decreased the development time of my app for two platforms. I've only delved into the basics here, but there is **rich functionality**
including animation, asynchronous data handling and styling and theming. There are some downsides - the app will take up **more memory** on a user's phone than a native app, and while
there is a decent package ecosystem, it isn't as comprehensive as for other frameworks written in more popular languages like JavaScript or C#. However, with the backing of Google, I 
suspect Flutter will continue to grow in features and user base, so **I would recommend giving it
a try**!
