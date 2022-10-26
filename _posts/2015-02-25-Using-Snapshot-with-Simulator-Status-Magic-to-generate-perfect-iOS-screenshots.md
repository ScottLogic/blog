---
title: Using Snapshot With Simulator Status Magic To Generate Perfect Ios Screenshots
date: 2015-02-25 00:00:00 Z
categories:
- cgrant
- Tech
tags:
- featured
author: cgrant
image: cgrant/assets/featured/phone.jpg
image-attribution: image courtesy of <a href='https://www.flickr.com/photos/janitors/'>Kārlis
  Dambrāns</a>
layout: default_post
summary: I have recently been using a set of tools called [fastlane](http://fastlane.tools/), developed by [Felix Krause](https://krausefx.com/). fastlane helps to automate the steps involved in building and deploying iOS applications to the App Store.
---

I have recently been using a set of tools called [fastlane](http://fastlane.tools/), developed by [Felix Krause](https://krausefx.com/). fastlane helps to automate the steps involved in building and deploying iOS applications to the App Store.

<p style='text-align:center'>
<a href='http://fastlane.tools/'>
<img src='{{ site.baseurl }}/cgrant/assets/fastlane.png' style='width:266px;'>
</a>
</p>

## Snapshot

One of my favourite fastlane tools is [snapshot](https://github.com/KrauseFx/snapshot). snapshot allows you to automate taking localised screenshots of your iOS app on every device. Without such a tool, taking multiple screenshots in every locale and on every device would take hours, if not days. This is not only very time consuming, but very boring too! I've recently set up snapshot so that it creates all of the screenshots required for the application I have been working on. This is great. It took a short while to set up, but now that it is done, I am free to work on other things while screenshots are being generated.  

	devices([
	  "iPad Air",
	  "iPhone 6",
	  "iPhone 5",
	  "iPhone 4s"
	])

	languages([
	  'en-US',
	  'en-GB',
	  'de-DE'
	])

	screenshots_path "./screenshots"
	clear_previous_screenshots

*A simplified version of the Snapfile script I use with fastlane to generate the screenshots*

## Simulator Status Magic
One issue that I originally came across when setting up snapshot was the status bar. Because snapshot runs on the simulator, the status bar is not realistic and inconsistent. I wanted to display a perfect, consistent status bar on the screenshots that match Apple's [marketing materials](http://www.apple.com/ios/). This led me to [Simulator Status Magic](https://github.com/shinydevelopment/SimulatorStatusMagic). Simulator Status Magic is a tool that modifies the iOS Simulator so that it has a perfect status bar. You can then launch your app and take perfect screenshots every time. The modifications made are designed to match the images you see on the Apple site and are as follows:

- 9:41 AM is displayed for the time.
- The battery is full and shows 100%.
- On iPhone: The carrier text is removed, 5 bars of cellular signal and full WiFi bars are displayed.
- On iPad: The carrier text is set to "iPad" and full WiFi bars are displayed.

*If you're interested in the significance of 9:41 and why Apple use it throughout their marketing materials, check out [this link over at The Unoffical Apple Weblog](http://www.tuaw.com/2014/04/14/why-9-41-am-is-the-always-the-time-displayed-on-iphones-and-ipad/).*

### Using Simulator Status Magic
The easiest way to install Simulator Status Magic is with [CocoaPods](http://cocoapods.org/). Just add the following to your Podfile.

	pod 'SimulatorStatusMagic'

This will install Simulator Status Magic into your CocoaPods library, and you can access it in your code by adding the following import to the top of your AppDelegate.m file.

	#import <SDStatusBarManager.h>

Once you have imported the library, add the following line at the top of your `application:didFinishLaunchingWithOptions` method.

    [[SDStatusBarManager sharedInstance] enableOverrides];

Now, whenever you launch the simulator, the time will be displayed as 9:41 AM, the battery will be full, and the carrier text will be set to "iPad" when launched on an iPad simulator, which matches the Apple marketing materials.

## Conditional Compilation
This works great, but you definitely don't want to leave this in your production code! Thankfully however, there is a way around this. In your Snapfile, you can specify `custom_args` that are passed to the project when it is build in preparation for taking the screenshots. By specifying a `SCREENSHOTS` preprocessor definition in your Snapfile, like so.

	custom_args "GCC_PREPROCESSOR_DEFINITIONS='SCREENSHOTS'"

You can then surround the import and the `enableOverrides` call in your AppDelegate.m file, so that it is only activated when these custom arguments are specified.


	#ifdef SCREENSHOTS
	#import <SDStatusBarManager.h>
	#endif

	...


	#ifdef SCREENSHOTS
    [[SDStatusBarManager sharedInstance] enableOverrides];
	#endif

Your status bar will now only be overridden when `SCREENSHOTS` is specified. This short piece of code used in combination with snapshot and simulator status magic should give you a perfect status bar in all of your screenshots for your iOS App Store applications!
