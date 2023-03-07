---
title: Migrating from Xamarin Forms to .NET MAUI
date: 2023-03-07 12:38:00 Z
categories:
- Tech
tags:
- ".NET"
- MAUI
- cross-platform
summary: Xamarin Forms has now been superseded with .NET MAUI.  In this blog post
  I'm looking at the process of upgrading an existing Xamarin Forms project to MAUI.  How
  much effort is needed and what will still work or needs to up updated.
author: dhunter
---

## Cheerio Xamarin Forms, Aloha .NET MAUI

I’ve enjoyed working with Xamarin Forms for app development and I’ve been pretty excited to get a look at its successor, .NET Multi-platform App UI (.NET MAUI).

I’ve been keeping an eye on MAUI for a while since I heard about it on a Xamarin Community Standup some time ago.  Quietly excited about the new successor to Xamarin Forms which disappointingly missed being part of the .NET 5 release.  Various features I’d heard of in MAUI sounded pretty nice and have kept me interested.

MAUI officially shipped in May 2022, and it’s time to give migrating a project a go.

My goals were to understand:

* The benefits of migrating to .NET MAUI

* How much effort is needed to migrate a basic project

* The new .NET Core style Startup with App Builder

* How Custom Renderers will work since MAUI has a new Mappers and Handlers approach

* The new single project architecture with targeted platforms

* If Xamarin Essentials and Xamarin Community Toolkit will upgrade nicely. These two packages are likely used in most Xamarin Forms projects

* Is the name MAUI, after the Hawaiian island, or the Maori mythology legend who pulled the North Island of New Zealand up from the sea, if so then, kia ora MAUI.  Perhaps it is simply a fitting acronym

## MAUI Benefits

MAUI has been built from the ground up in .NET and should benefit from improved performance and app size.  Something that is quite important to users.

Using a single project you can now target Android, iOS, Mac OS (using Mac Catalyst), and Windows.

App resources are now organised in a single resources folder, instead of multiple copies in many projects.

Anyone working with Xamarin Forms should be quite familiar with developing in MAUI.  We’re still using XAML for UI (though code is an option), still using MVVM and C# and Visual Studio, it’s kind of Xamarin Forms 6.  However calling it this sort of undermines the effort that has been put into building it.

## Migration Effort

Migration effort will of course vary based on the size of your project, but Microsoft are here to help.  The [.NET Upgrade Assistant](https://learn.microsoft.com/en-us/dotnet/maui/migration/upgrade-assistant?view=net-maui-7.0) CLI tool helps speed along the process.  Certainly use the CLI unless you enjoy living life on the edge, running various find and replace in files.  You will need to complete some manual steps to get the project to build, the machines are yet to replace us after all.

It’s worth taking a look over some of the [manual update steps](https://learn.microsoft.com/en-us/dotnet/maui/migration/forms-projects?view=net-maui-7.0#namespace-changes) to understand what the CLI tool is doing, and to see a summary of changes from Xamarin Forms to MAUI.

Backwards compatibility is available for [custom renderers](https://learn.microsoft.com/en-us/dotnet/maui/migration/custom-renderers?view=net-maui-7.0) and [effects](https://learn.microsoft.com/en-us/dotnet/maui/migration/effects?view=net-maui-7.0).  They're configured slightly differently and may require some slight modifications.  Handlers can replace these in a phased approach.

.NET 6.0 is the minimum support, at the time of writing, you can use .NET 7.0, however bear in mind that 6.0 is the current LTS release.

If you’re heavily reliant on any NuGet packages, check for compatibility as detailed in the [manual steps](https://learn.microsoft.com/en-us/dotnet/maui/migration/forms-projects?view=net-maui-7.0#update-app-dependencies).  Hopefully they’ve been recompiled for .NET.

## .NET Startup with App Builder

Working with .NET Core since version 2.0, I was keen to see if there would be a similar approach with the App Builder when moving to .NET.

The App Builder and Startup approach is the out of the box setup now and works much as I’d hoped it would.  This will be familiar to .NET developers and it’s super easy to use.  This is great to make reliable network requests with HttpClientFactory and Polly, a simple setup.  Of course there are more uses, this is just a personal favourite.

![xf_maui_image1.png](/uploads/xf_maui_image1.png)

## Custom Renderers or Mappers and Handlers

Handlers and Mappers are here to complete the same task as Custom Renderers.  They provide access to customise native controls when you need more than what’s already available.  The main benefit seems to be performance as the page hierarchy is reduced on the compiled app.  You can read about [Handlers](https://learn.microsoft.com/en-us/dotnet/maui/user-interface/handlers/?view=net-maui-7.0) in the MAUI docs.

[Custom renderers](https://learn.microsoft.com/en-us/dotnet/maui/migration/custom-renderers?view=net-maui-7.0) tend to be a small but rather complex part of an app.  Fortunately they are still supported in MAUI but only for backwards compatibility and you can register these in the MAUI App Builder.  This will certainly make the transition to MAUI much simpler.

![xf_maui_image2.png](/uploads/xf_maui_image2.png)

## Single Project Architecture

In Xamarin Forms the main project has the bulk of our code, then a head project for each targeted platform.  This has changed to supported platforms in the single project.  As a personal preference this is quicker and easier to navigate.  Individual projects in the solution for each platform didn't add much value. Really they kind of get in the way, especially when you’ve generally got projects for a backend, shared code and testing.

MAUI projects have two named folders for cross platform code.  The Platforms folder is where code for each targeted OS should live.  The Resources folder should have shared components like fonts and images.

Font resources are now referenced in the App Builder, simply set the build action on the file to MauiFont instead of EmbeddedResource.

![xf_maui_image3.png](/uploads/xf_maui_image3.png)

## Xamarin Essentials and Xamarin Community Toolkit

As expected these have been updated to work in MAUI projects.  Xamarin Essentials is now a core part of MAUI.  It makes sense, it's a library of cross platform APIs of device functionality from file system to connectivity to see if data or Wi-Fi is being used.

Xamarin Community Toolkit has changed to CommunityToolkit.MAUI.  I found some converter name changes, but nothing major, and easily fixed with Intellisense suggestions.

## Some Gotchas I Encountered

Microsoft's migration documentation is pretty good and covers issues that may arise.  Having a freshly created MAUI project is very helpful to compare the project file and platform file setup.

A few points that I came across doing the migration:

* The MAUI project file is quite different to the Xamarin Forms one.  A lot of cleanup and new parts need to be added for the correct debug options and run configuration.

* iOS Main.cs Application class caused conflicts, simply renaming to Program as per fresh app is an easy fix (not refactor rename).

* Android MainActivity and iOS AppDelegate are quite different.  The simplest option is referencing the fresh project for changes.  These changes are detailed in the [manual steps](https://learn.microsoft.com/en-us/dotnet/maui/migration/forms-projects?view=net-maui-7.0#bootstrap-your-migrated-app).

* VerticalStackLayout and HorizontalStackLayout have replaced the [StackLayout](https://learn.microsoft.com/en-us/dotnet/maui/migration/layouts?view=net-maui-7.0#stacklayout) control.  \*AndExpand is now deprecated so various UI updates are likely required.

* [RelativeLayout](https://learn.microsoft.com/en-us/dotnet/maui/migration/layouts?view=net-maui-7.0#relativelayout) is also no longer available.  However the xmlns can be added if needed but it’s recommended to change to using a Grid layout.

* AssemblyInfo is now part of the project file, these properties can be moved and the file deleted.  This will cause build conflicts so even just comment it out initially.

* The migration CLI wont move everything into a single project.  I did this manually by creating the Platforms folder and moving over the required files.  Updating the project file will enable the debug options for running the project, you likely need to restart Visual Studio.

* If you have build errors similar to *project.assets.json doesn't have a target for*.  You may not have everything installed, running the CLI command ‘dotnet workload install maui’ should fix this.  If you’re on a mac you should be using Visual Studio for Mac 2022 version 17.4 as a minimum.

## Is migrating worth it?

Definitely, any almost free performance gains are fantastic.  Knowing your app will receive framework updates going forward is great.  Updated developer experience is always a win.

Should I do this on all my apps though, perhaps not straight away unless you have some new features to build.  There is no reason that your app will suddenly stop working.  Support for Xamarin Forms runs to the end of May 2024 so there is plenty of time to migrate your projects.

I should note that I didn’t notice any performance benefits but I migrated a relatively small app.  This may be more noticeable on larger projects or going forward as MAUI updates are released.

Overall it’s a good upgrade process and will definitely be worth the effort.  Possibly even a reason to justify doing some clean up or refactoring some old code.  Though always do thorough testing after migrating your app to ensure you don’t have any bugs before publishing.

## More MAUI

Microsoft has a lot of documentation on [MAUI](https://learn.microsoft.com/en-us/dotnet/maui/?view=net-maui-7.0) and it’s a great place to have a quick look for either migrating a project or starting out.

James Montemagno covers a lot of nice features on his [website](https://montemagno.com/) and even more on his [YouTube channel](https://www.youtube.com/jamesmontemagno).

Microsoft's [.NET Community Standups](https://www.youtube.com/playlist?list=PLdo4fOcmZ0oX-DBuRG4u58ZTAJgBAeQ-t) feature .NET MAUI each month.  This can be very useful for following upcoming features and advice or best practices.

[MVVM Source generators](https://learn.microsoft.com/en-us/dotnet/communitytoolkit/mvvm/generators/overview) look great for clearing out some boilerplate MVVM code and trimming down some view models.  This is a successor to MVVMLight, I want to start using this.