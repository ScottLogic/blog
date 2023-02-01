---
title: WebView2, Electron challengers, and (slightly) lighter desktop web applications
date: 2023-02-01 14:00:00 Z
categories:
- Tech
summary: Newcomer desktop-web framework Tauri has quickly attracted the interest of
  developers looking to build cross-platform desktop applications using web technologies.
  Promises of smaller and faster applications certainly appeal to those using Electron.
  In this post, I’ll take a look at what’s new in this space, what distinguishes them,
  and why WebView2 doesn’t solve everything.
author: rwilliams
---

Newcomer desktop-web framework Tauri has quickly attracted the interest of developers looking to build cross-platform desktop applications using web technologies. Promises of smaller and faster applications certainly appeal to those using Electron. In this post, I’ll take a look at what’s new in this space, what distinguishes them, and why WebView2 doesn’t solve everything.

![DALL·E 2023-02-01 14.25.09 - people looking at a framed painting.png](/uploads/DALL%C2%B7E%202023-02-01%2014.25.09%20-%20people%20looking%20at%20a%20framed%20painting.png)

## Primer: what’s here already

Almost everything in the desktop-web ecosystem is related in one way or another. It’s useful to know what the existing big things are, what they’re made of, and how they relate to or differ from the others. You may already be familiar with many - so read what you need, and skip the rest.

![wnats-old-7ac29a.png](/uploads/wnats-old-7ac29a.png)

### Chromium

[Chromium](https://www.chromium.org/Home/) (2008) is the non-commercial open source web browser that underpins Google Chrome, and since 2020, Microsoft Edge too. Some of its internal parts are independently reusable, and are a key part of almost every desktop-web tool.

### Chromium Embedded Framework (CEF)

[CEF](https://bitbucket.org/chromiumembedded/cef/src/master/README.md) (2009) is a component for embedding web content within a native desktop application. It introduced the concept of building Chromium into native applications, bringing with it the benefits of the web platform and its tooling.

It uses part of the Chromium browser to display that web content. The rest is left up to the developer, so the application interface can be a hybrid of web and other views, and the main process code is written in a language such as C\+\+, C#, or Swift. Apps using CEF include part of Chromium in their installer. CEF is developed and maintained by the open source community.

### Electron

[Electron](https://www.electronjs.org/) (2013) is a desktop-web framework for building desktop applications. By including the Node.js JavaScript runtime, it enabled development of unconstrained desktop web applications using only web technologies - no languages other than JavaScript needed.

It uses part of the Chromium browser to display web content windows, and the Node.js JavaScript runtime for executing an application’s main process code. Apps built on Electron include those dependencies in their installer. Electron was originally released by GitHub to underpin their Atom text editor, and continues to be developed and maintained by GitHub (now a subsidiary of Microsoft).

### Commercial desktop-web frameworks

There are a few commercial products which build upon Electron, such as Finsemble, OpenFin, and Glue42. These provide additional functionality geared towards desktop application ecosystems of integrated applications.  You can read more about that world in our white paper [Building an integrated desktop application ecosystem](https://blog.scottlogic.com/2020/08/13/building-an-integrated-desktop-application-ecosystem.html) (page 10 for the products).

## What’s new

Some exciting new developments emerged through 2021-22 that may well change the established model of how we build, distribute, and run desktop applications that use web technologies.

![whats new.png](/uploads/whats%20new.png)

### WebView2

Microsoft [WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/) is a component for embedding web content within a native application - like CEF. It uses part of the Microsoft Edge browser to display that web content. It’s available for applications written in C\+\+ and .NET family languages (C#, F#, and VB).

Unlike Electron and CEF, it’s installed on the operating system for use by any app that needs it, so apps no longer need to include it in their installer (but can if they want to). It will become pervasive on Windows through Windows 10 updates and inclusion in Windows 11. The roadmap includes support for macOS and Linux. It was originally released in late 2020.

### Tauri

[Tauri](https://tauri.app/) is a desktop-web framework for building desktop applications - like Electron. It uses WebView2 to display web content on Windows, and WebKit-based equivalents on macOS for the time being. The application’s main process code is written in Rust, although other languages are on the roadmap.

App installers for Windows can be built including or not including WebView2, and in the latter case can download and install it during app installation if it isn’t found to be already installed. The first stable release of Tauri was released in mid-2022, and there’s quite some excitement amongst developers about it as an Electron alternative (e.g. 2/3rds as many GitHub stars as Electron already).

### Map of the desktop-web landscape

This diagram may help you complete or confirm your understanding of what we’ve covered so far.

![Web tech landscape - simplified.png](/uploads/Web%20tech%20landscape%20-%20simplified.png)

All of the commercial offerings can be thought of as equivalent to Electron in the above diagram.

Electron and Tauri are extendable standalone runtimes - you build and run your application *on them*. CEF and WebView2 are embeddable components - you include and run them *in your* application. Tauri uses WebView2 under the hood.

## There’s always a browser, and it’s Chromium

There’s a price to pay for displaying web content, and that price is having and running a browser.

The only product and scenario from above that doesn’t involve web content being displayed in a Chromium-based browser is Tauri on operating systems other than Windows. When WebView2 becomes available on macOS and Linux, I expect it’ll replace WebKit there.

While this offers a consistent environment for running web content, it also brings the same disadvantages and tough trade-offs to all the options. For their respective strengths and optimisations, none of the products (or the apps we build using them) can get away from these because they stem from using Chromium beneath however many abstraction layers. Partly from just being a web browser, it’s a reasonably complex piece of software, with a download/installation size and runtime (memory and CPU) footprint that reflects that.

## Packaging a browser with every app, or not

An application that includes a browser in its installer via these products will have a pretty large installer. Electron is \~90MB, while CEF is a bit smaller as it doesn’t include Node.js. If you choose to include WebView2 in your app’s installer, it’s \~180MB. This adds perhaps a minute to a new user’s experience through download time, and is often considered unreasonably large - especially for applications that don’t offer a great deal of complex functionality.

This has given rise to several mitigation approaches, some of which also have other benefits. On the other hand, one could decide that it doesn’t matter enough to our users to prioritise over other work. Some common approaches:

1. Bootstrapper installer - the user downloads a small installer, which downloads and installs the actual application when run.

2. Background update download - updates (e.g. new application release, updated framework version) are downloaded in the background while the user is using the app, and are installed at a later convenient time.

3. Application shell model - the installed application (with only the main process code included) is updated only infrequently, while the web content code is loaded from a web server. This allows small, frequent, and unobtrusive releases.

With WebView2, it’s possible to use a shared web browser part that’s installed on the operating system. So every app doesn’t have to include its own browser (although they can choose to do so). There are advantages of this approach:

1. Our application’s installer can be much smaller, e.g. 5MB instead of 100MB.

2. The operating system continuously keeps the browser/webview up to date with security updates.

3. We don’t have to regularly release an app that’s in maintenance mode (feature complete) to remain compliant with the [Microsoft Store policy of not being more than two major versions behind the latest Chromium version](https://learn.microsoft.com/en-us/windows/apps/publish/store-policies#102-security).

And some disadvantages; the same ones as for web apps running in browsers:

1. We don’t know which version of the browser/webview our code might be run in. We need to take care with which recently-launched web features we use, consider testing our app against different versions of the webview, and possibly warn or block users on unreasonably old versions.

2. Updates to the browser/webview may contain bugs which could break our app, to varying extents.

While I think using a shared browser (WebView2) will eventually become the norm and a good choice for many applications, there will still be many who will be better off including their own browser for the control and certainty it gives. The choice can’t be made in isolation, at least not yet - e.g. if you want to use Electron for other reasons (there are many good ones), your app will be packaged with its own browser.

![installers-2f4e78.png](/uploads/installers-2f4e78.png)

*Messaging app installers could once again be smaller than IDE installers*.

## Running a (full) browser for every app - always

The Chromium architecture separates a running browser instance into a handful of processes at runtime - the main browser process, a GPU gateway process, a crash handler process, a couple of utility processes, and finally a renderer process for each window/tab/webview. All that needs quite a bit of memory even before we start running some web content (our app), but it scales in a web browser - each additional tab/window adds just one renderer process (it’s a [bit more nuanced](https://chromium.googlesource.com/chromium/src/\+/main/docs/process_model_and_site_isolation.md#full-site-isolation-site_per_process) than that really).

All the tools we’ve covered here run a complete and independent set of browser processes for each application. That includes Tauri and any other webview-based framework, regardless of whether an app chooses to ship its own webview or use the shared one installed on the operating system. This means the overhead is repeated for each application.

None of the products therefore have a fundamental advantage when it comes to lightening the task of displaying web content. Some achieve an overall performance advantage or advantages in specific areas, but these will arise from different factors such as not running a Node.js runtime, or different inter-process communication approaches.

I had hoped to see that WebView2 would reduce memory usage by sharing all the browser/webview processes except the renderers between apps, so this was a bit of a disappointment. I expect the approach taken has some isolation benefits, however there is already strong security and crash-containment isolation between renderer processes in Chromium - it does after all run code from any website the user happens to visit. I’d be interested to hear the rationale for not sharing the non-renderer processes between apps. Perhaps in future it’ll be possible, and something the WebView2 developers could implement without application developers needing to care.

*With WebView2, we’d have just one of these...*

![before.png](/uploads/before.png)

*... but we’ll still have the rest in the form of WebView2 processes instead (illustrative screenshot of another application’s processes):*

![after.png](/uploads/after.png)

## Recap

We’ve seen how having a shared webview installed on the operating system allows challenger desktop-web frameworks like Tauri (and native applications that include web content) to produce a much smaller installer. The option of including a standalone webview in an application’s installer, is still available. However, I think it’s likely to eventually become less common based on the balance of pros/cons as weighed against the needs of individual applications.

At runtime however, each application still runs its own complete set of browser/webview processes, so any performance advantages and memory efficiencies will be from other areas of the framework/component - not from displaying web content. There may be potential for future structural optimization here by sharing these to lighten the load of desktop web applications. Just like with packaging and installation, we’ll always need a browser, but here too we may well not need a dedicated one for each application.