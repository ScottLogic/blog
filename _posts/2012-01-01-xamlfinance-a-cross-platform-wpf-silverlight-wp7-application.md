---
title: XAMLFinance – A Cross-platform WPF, Silverlight & WP7 Application
date: 2012-01-01 00:00:00 Z
categories:
- Tech
tags:
- silverlight
- wpf
author: ceberhardt
layout: default_post
source: codeproject
summary: Describes the development of XAMLFinance, a financial charting application
  built to run across WPF, Silverlight, and Windows Phone 7 from a shared XAML and
  C# codebase. The article provides a detailed guide to cross-platform XAML development,
  covering API differences, resolution techniques, and architectural patterns that
  maximise code sharing.
---

*This article was originally published on CodeProject, which has since shut down.*

## Index

- [Overview](#over)
- [Introduction – Why cross-platform?](#intro)
- [Cross-platform XAML development](#xaml)
- [Cross-platform, a Practical Approach](#practical)
- [WPF / Silverlight Framework Differences](#diffs)

- Broad differences
- API level differences

- [Resolution Techniques](#reso)

- Conditional compilation (#if)
- Partial classes
- Design Patterns
- Missing Framework Features
- Missing Controls
- Common pitfalls
- The Unexpected
- Adapting to each Platform

- [XAML Finance](#xamlfinance)

- Architecture

- DataSource Library

- XAML Finance Application
- The MVVM pattern

- Adapting for the web
- Adapting for the desktop
- Adapting for Windows Phone 7

- [Conclusions](#conclusions)

## Overview

This article describes the development of XAML Finance, a cross-platform application which works on the desktop, using Windows Presentation Foundation (WPF), on the web, using Silverlight and on Windows Phone 7 (WP7). My aim in writing this article is to highlight how the XAML based technologies used for desktop, web and mobile allow you to share large quantities of code and cost-effectively distribute your application on a range of devices.

XAML Finance on Windows Phone 7:

![XAMLFinancePanoramaSmall.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/XAMLFinancePanoramaSmall.jpg)

You can see a video of the WP7 version below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ISWu2VOKIyc" frameborder="0" allowfullscreen></iframe>

The Silverlight version XAML Finance running within a browser, alongside HTML content (also viewable [online here](http://www.scottlogic.co.uk/blog/colin/xaml-finance)):

![XAMLFinanceSilverlightSmall.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/XAMLFinanceSilverlightSmall.jpg)

WPF XAML Finance running on the desktop:

![XAMLFinanceWPFSmall.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/XAMLFinanceWPFSmall.jpg)

## Introduction – Why cross-platform?

It was not so long ago that the main distribution model for software was via floppy disks or CDs with the end-user installing your applications directly onto their desktop computer. In the past decade Rich Internet Applications (RIAs), which give us a web-based distribution model, have become increasingly popular. More recently, the growth in other platforms and form-factors, including smartphone and tablets, have resulted in a complex array of technologies and distribution models.

Each platform (desktop, web, mobile) has its own advantages and unique features to offer the client. It is now becoming a common requirement that applications need to be delivered across a range of platforms. This has an obvious cost impact! The skills required to develop a WPF desktop application are very different from a Flash based web application or an iOS mobile application. With the development of multi-platform applications typically requiring multiple, independent development teams … you are effectively paying to develop the same software three times over! (or more).

![MultiPlatforms.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/MultiPlatforms.png)

If you decide to use Microsoft technologies for your desktop, web and mobile offerings this will put you at an advantage. For desktop development you can use WPF, whilst you can use Silverlight for web and mobile development (you will of course be restricting your mobile offering to WP7 users – but hey, it is a great phone!). All three frameworks share common APIs and allow you to develop using the .NET framework.

![XAMLFrameworks.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/XAMLFrameworks.png)

As an aside, I am not going to explore the other technologies that you might employ for cross-platform development in this article, most notably HTML5. If you want to know my thoughts on this I would recommend reading the following:

- [Flex, Silverlight or HTML5? Time to decide …](http://www.scottlogic.co.uk/blog/colin/2011/05/flex-silverlight-html5-time-to-decide/)
- [From Silverlight to HTML5](http://www.codeproject.com/KB/scripting/SilverlightToHTML5.aspx)
- [Can Microsoft ‘fix’ JavaScript and make HTML5 applications viable?](http://www.scottlogic.co.uk/blog/colin/2011/08/can-microsoft-%E2%80%98fix%E2%80%99-javascript-and-make-html5-applications-viable/)

This article is more about code than strategy and will focus on .NET technologies.

Cross-platform XAML development

WPF and Silverlight are both application development frameworks within the .NET family of frameworks. Their APIs share a lot of common features and as a result it is easy to transition from working with one technology to the other. With the great number of similarities between the two frameworks you might be wondering why there are two of them? Why didn’t Microsoft just create a single framework for desktop and web? To answer that question we need to look into the history of each framework.

WPF was released in 2006 under the code-name Avalon, it is part of the .NET framework and as a result only works on Windows machines. WPF is Microsoft’s next evolutionary step in Windows desktop development (C++ / MFC => WinForms => WPF), and as result its key requirement is that it delivers the tools, controls and APIs required to build a broad range of desktop applications. It also has WinForms interoperability capabilities, offering a migration path for WinForms applications, and supports both the newer .NET APIs (e.g. Entity Framework, RIA Services) and the old (e.g. ADO.NET datasets). WPF relies on the client having installed the .NET client profile, which is a 75 MByte download.

Silverlight fulfils a different need to WPF, it provides a web-based distribution model for .NET applications. Silverlight is defined very much by the limited download size, with the plugin being just 5 Mbytes (compared to 75 Mbytes for the .NET framework), and that it can run on Mac computers as well. For this reason Silverlight cannot rely on the desktop .NET runtime, instead it includes its own stripped-down Common Language Runtime (CLR). Because of this size-constraint, the APIs available to Silverlight are limited.

There has been a gradual convergence of the WPF and Silverlight frameworks, with Silverlight 4 gaining implicit styling, element name binding, etc… while Silverlight 5 adds implicit DataTemplates, and markup extensions. All of these are features that Silverlight has inherited from WPF. There has also been some movement of features the other way, with WPF 3.5 gaining the VisualStateManager, a concept originally introduced in Silverlight.

![FeatureMigration.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/FeatureMigration.png)

This gradual unification of the two frameworks has led some to speculate and some to request of Microsoft that the [two frameworks become one](http://dotnet.uservoice.com/forums/40583-wpf-feature-suggestions/suggestions/481048-merge-wpf-and-silverlight-to-be-one-framework-tha). However, given the deployment constraints facing Silverlight (lightweight, cross-OS), this is unlikely to happen.

## Cross-platform, a Practical Approach

WPF, Silverlight and WP7 assemblies are not interchangeable; this means that you have to re-build the same code for each target. In practical terms this is easily achieved by creating three separate projects in Visual Studio (one for each framework) and ‘linking’ the shared files. Within Visual Studio, if you add files to the project via “Add Existing Item”, and select the “Add As Link” option you can work on the same file from multiple projects. Based on the fact that Silverlight is a subset of WPF it does make sense for your Silverlight project to be your primary focus for development, although it is worth switching between them often in order to ensure compatibility.

When writing cross-platform applications it is important to have a well-structured code-base. The use of UI patterns, for example Model-View-ViewModel (MVVM), and the separation of view components into user-controls will make it easier to tailor your code for each framework and resolve differences.

One of the two demo applications I have attached to this article is a very simple Twitter application which searches Twitter for the #Silverlight hashtag, displaying the results in a list. You can see the structure of the application below:

![SilverlightTwitterSolution.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/SilverlightTwitterSolution.png)

The view model consists of a couple of simple classes, FeedViewModel which queries twitter and exposes a collection of FeedItemViewModel instances, one for each tweet. The TwitterView user control uses an ItemsControl to render the results:

~~~xml
<Grid x:Name="LayoutRoot" Background="White">
  <StackPanel Orientation="Vertical">
    <Image Source="/Resources/Twitter_logo.jpg"/>

    <!-- renders the list of tweets-->
    <ItemsControl ItemsSource="{Binding FeedItems}">
      <ItemsControl.ItemsPanel>
        <ItemsPanelTemplate>
          <StackPanel Orientation="Vertical"/>
        </ItemsPanelTemplate>
      </ItemsControl.ItemsPanel>
      <ItemsControl.ItemTemplate>
        <DataTemplate>
          <StackPanel Orientation="Vertical">
            <TextBlock Text="{Binding Author}"
                        FontWeight="Bold"/>
            <TextBlock Text="{Binding Title}"
                        TextTrimming="WordEllipsis"/>
          </StackPanel>
        </DataTemplate>
      </ItemsControl.ItemTemplate>
    </ItemsControl>
  </StackPanel>
</Grid><span class="Apple-style-span" style="white-space: normal; ">
</span>
~~~

The starting point of a Silverlight application is a UserControl, which is set as the RootVisual of our application. In the VisualStudioSilverlight project template, the control used as the root is called MainPage. In this simple twitter example, the MainPage.xaml file instantiates the view model in code behind, and includes the view as follows:

~~~xml
<UserControl x:Class="SLUGUK.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:view="clr-namespace:SLUGUK.View">
  <Grid x:Name="LayoutRoot" Background="White">
    <view:TwitterView/>
  </Grid>
</UserControl>
~~~

The resulting application looks like the following:

![SilverlightTwitter.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/SilverlightTwitter.png)

*I am not sure what Silverlight has done to offend 6ixnin9 (4th tweet down)!*

The WPF solution has much the same structure as the Silverlight one; however, all of the ViewModel, View and Resource files are included as links, as per the steps described above.

![WPFTwitterSolution.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/WPFTwitterSolution.png)

With WPF, the starting point of our application is a Window, a concept which does not exist in Silverlight. The window that is shown when the application starts is defined by the StartupUri of the application. Within the WPF twitter application, the view model is instantiated in the MainWindow class, with the view included as follows:

~~~xml
<Window x:Class="SLUGUK.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:view="clr-namespace:SLUGUK.View"
        Title="MainWindow" Height="350" Width="525">
  <Grid>
    <view:TwitterView/>
  </Grid>
</Window>
~~~

The resulting application looks like the following:

![WPFTwitter.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/WPFTwitter.png)

As you can see from this simple example, sharing code between Silverlight and WPF is a relatively straightforward process. The use of the MVVM pattern and more specifically having our view within a separate UserControl has allowed us to resolve the different elements WPF and Silverlight use as the ‘root’ of the application.

With the code for this example application I have been careful to use .NET APIs and methods that are common to both WPF & Silverlight. Unfortunately, if you restrict yourself to just the Silverlight APIs which are a true subset of WPF you will find that you are very limited in what you can achieve.

In the next section we’ll take a look at these differences in a bit more detail.

## WPF / Silverlight Framework Differences

### Broad differences

Broadly speaking Silverlight is a sub-set of WPF, whilst Silverlight for WP7 is a further subset of the web-based Silverlight. However, this is not strictly true on a detail level. Silverlight (web) has extra APIs that relate to the context within which is executed, including JavaScript interop APIs and isolated storage. Likewise, Silverlight for WP7 has context specific APIs that handle tombstoning and application state, launchers and choosers etc …

As a cross-platform developer, you need to try to make most use of the intersection of these three frameworks … the “good” bits:

![TheGoodBits.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/TheGoodBits.png)

However, the problem is a little more complex than this. The differences are not just present on the API level, where entire APIs and feature sets are absent from one or other framework, they are also present on a detail level, with common classes having different method signatures and behaviour. As a result of this it is necessary to tailor your cross-platform application for each framework in order to resolve these differences.

### API level differences

Besides the obvious differences relating to the context of each framework, there are numerous smaller differences, most arise due to the size constraint of Siverlight.

Briefly, Silverlight does not support the following WPF features:

- Triggers (data, property, event)
- Markup extensions (this is coming in Silverlight 5!)
- Dependency Property metadata
- Readonly Dependency Properties
- Multibinding
- RelativeSource FindAncestor binding
- *and more ...*

Fortunately, most of these features are nice-to-haves, in that it is possible to implement the same behaviour with some slightly more basic features in order to achieve the same end result.

WPF has many more controls that Silverlight:

![Controls.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/Controls.jpg)

Source: [Guidance on Differences Between WPF and Silverlight](http://wpfslguidance.codeplex.com/releases/view/30311)

Silverlight has a small number of controls as part of the core runtime, however, the more heavyweight controls, like the DataGrid, are available as assemblies that can be added to your XAP file, also the Silverlight Toolkit adds further controls. The omissions are typically controls which relate to more ‘application-like’ contexts, for example toolbars and multi-level menus.

There are also smaller API level differences; Silverlight typically lacks the various method and constructor overrides that WPF developers have at their disposal:

![APIDiff.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/APIDiff.png)

Source: [Guidance on Differences Between WPF and Silverlight](http://wpfslguidance.codeplex.com/releases/view/30311)

Again, this reduces the overall Silverlight footprint.

## Resolution Techniques

In this section we will look at some of the techniques we can use to resolve these differences, allowing us to use slightly different techniques to achieve the same goal with Silverlight and WPF.

### Conditional compilation (#if)

The build setting for an assembly allow you to specify one or more conditional compilation symbols:

![Conditional.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/Conditional.png)

By default, Silverlight projects have the `SILVERLIGHT` symbol defined. Using the #if pre-processor directive you can use this to include code into application when it is built for a specific framework.

We can use this in the above twitter example, by changing the code so that rather than querying twitter, it loads a file with a saved search response built into the assembly; we start to hit upon framework differences. The following code shows how the `SILVERLIGHT` symbol is used to provide different implementations of a `ReadFileToString` resolving differences in URI and file API between Silverlight and WPF:

~~~csharp
public void Update()
  {
    // previous mechanism for fetching XML from twitter commented out
    //_webClient.DownloadStringCompleted += (s, e) => ParseXMLResponse(e.Result);
    //_webClient.DownloadStringAsync(new Uri(_twitterUrl));

    // load a saved response from a file
    ParseXMLResponse(ReadFileToString("data.xml"));
  }

  private string ReadFileToString(string filename)
  {

#if !SILVERLIGHT

    using (var stream = this.GetType().Assembly.GetManifestResourceStream(
      "SLUGUK.ViewModel." + filename))
    {
      StreamReader reader = new StreamReader(stream);
      string xml = reader.ReadToEnd();
      return xml;
    }

#else

    string path = "/SilverlightTwitterApp;component/ViewModel/" + filename;
    Uri uri = new Uri(path, UriKind.Relative);
    StreamResourceInfo sri = Application.GetResourceStream(uri);
    StreamReader reader = new StreamReader(sri.Stream);
    string xml = reader.ReadToEnd();
    return xml;

#endif
  }
~~~

There is another method available for employing conditional compilation without the use of the `#if` / `#endif` directives. You can mark a method with the [Conditional attribute](http://msdn.microsoft.com/en-us/library/system.diagnostics.conditionalattribute.aspx), which means that the method will only be invoked (and included into the compiled IL) if the given symbol is present. However, the code is always compiled by Visual Studio, so this technique can only be used for tackling a subset of framework differences.

Conditional compilation is a common technique for tackling cross-platform issues, however there are other options available.

### Partial classes

With partial classes it is possible to split the definition of a class across multiple files. Visual Studio uses this feature extensively, where the designer generated code is placed in one file, with the developer code inserted into another partial counterpart.

The above example, where the logic to read a file is different in WPF and Silverlight, can be re-implemented using partial classes. The Silverlight version is as follows:

The common `FeedViewModel`:

~~~csharp
public partial class FeedViewModel
{
  ...
  public void Update()
  {
    ParseXMLResponse(ReadFileToString("data.xml"));
  }

}<span class="Apple-style-span" style="white-space: normal; ">
</span>
~~~

And the Silverlight specific specialisation of this class via partial classes (saved in a file `FeedViewModelSilverlight.cs`):

~~~csharp
public partial class FeedViewModel
{
  private string ReadFileToString(string filename)
  {
    string path = "/SilverlightTwitterApp;component/ViewModel/" + filename;
    Uri uri = new Uri(path, UriKind.Relative);
    StreamResourceInfo sri = Application.GetResourceStream(uri);
    StreamReader reader = new StreamReader(sri.Stream);
    string xml = reader.ReadToEnd();
    return xml;
  }
}
~~~

The WPF project includes the common FeedViewModel as a link, but adds the `FeedViewModelWPF.cs` directly into the solution:

~~~csharp
public partial class FeedViewModel
{
  private string ReadFileToString(string filename)
  {
    using (var stream = this.GetType().Assembly.GetManifestResourceStream(
      "SLUGUK.ViewModel." + filename))
    {
      StreamReader reader = new StreamReader(stream);
      string xml = reader.ReadToEnd();
      return xml;
    }
  }
}
~~~

Whilst conditional compilation provides a good mechanism for small pieces of framework specific code, partial classes are a more elegant solution for larger. They provide a cleaner separation of the framework specific code and remove the ‘dead’ sections of code that are ignored by the compiler when the given conditional symbol is not preset.

### Design Patterns

The above techniques are good for detail-level differences between the framework APIs. However, in some cases the various frameworks allow you to achieve the same end-goal, but in very different ways. One such example is modal dialogs, where WPF permits the use of any Window as a modal dialog, whereas Silverlight has the `ChildWindow` concept. The APIs for each are quite different.

To resolve this issue we can call on one of the classic software engineering patterns, the [adapter pattern](http://en.wikipedia.org/wiki/Adapter_pattern). Using this approach, you first define an interface which gives the functionality you require. For example, for model dialogs, the following interface allows you to display `UserControl` in a modal manner:

~~~csharp
/// <summary>
/// An interface which provides a host for some content which should be rendered
/// as a modal dialog
/// </summary>
public interface IModalDialogHost
{
    /// <summary>
    /// Gets or sets the content to host
    /// </summary>
    UserControl HostedContent { get; set; }

    /// <summary>
    /// Gets the dialog title
    /// </summary>
    string Title { set; }

    /// <summary>
    /// Gets the dialog result (i.e. OK, Cancel)
    /// </summary>
    bool? DialogResult { get; }

    /// <summary>
    /// Shows the dialog, invoking the given callback when it is closed
    /// </summary>
    void Show(DialogClosed closedCallback);
}

/// <summary>
/// A callback which is invoked when a modal dialog is closed.
/// </summary>
public delegate void DialogClosed(IModalDialogHost host)<span class="Apple-style-span" style="white-space: normal; ">
</span>
~~~

It is a relatively straightforward process to create a WPF or Silverlight implementation for this interface. For more details, and a working example, see [my earlier blog post](http://www.scottlogic.co.uk/blog/colin/2010/06/modal-dialogs-in-cross-platform-wpfsilverlight-applications/ ).

### Missing Framework Features

As stated previously, the WPF framework features which are missing from Silverlight are, for the most part, features that I would consider to be nice-to-haves. However, if you do need to use them, for whatever reason, there are a couple of approaches that you can take to resolve this issue:

1. Implement the feature yourself, copying the WPF API to ensure compatibility. Unfortunately, in most cases this does not work because you will find yourself faced with sealed classes and ‘closed’ APIs.
2. Implement an equivalent feature. Rather than copy the WPF framework feature, create an equivalent and implement it in both Silverlight and WPF. I have done this a few times in the past, the most popular one I have published is a [MultiBinding solution for WPF and Silverlight](http://www.scottlogic.co.uk/blog/colin/2010/05/silverlight-multibinding-solution-for-silverlight-4/).  The API is a little different from the WPF MultiBinding API, but it does provide compatibility between both frameworks, so is useable in cross-platform contexts

### Missing Controls

If you wish to use a Toolbar in your application, you will find that this control is present in WPF, but absent from Silverlight. When faced with these “missing” controls, there are a number of possible resolution techniques:

1. Use a different control in each framework. You will often find that there is more than one way to present the same interface to the user.
2. Find an implementation of the missing control, for example, you can find a number of missing controls on the internet:
   1. A [Silverlight GroupBox control](http://programmerpayback.com/2008/11/26/silverlight-groupbox-control/)
   2. A [Silverlight Menu](http://www.codeproject.com/KB/silverlight/SilverlightMenu.aspx)However, if the original control author was not concerned with cross-platform development, you might find that the API is not compatible with the equivalent WPF control.
3. Implement your own Silverlight control based on the WPF APIs. Depending on the WPF control in question, this can be quite a long task. In the past I have written a Silverlight toolbar and multi-level menu that are API compatible with WPF.
4. Port the WPF control, using the sourcecode. For example, there are a number of WPF Toolkit controls which can be ported to Silverlight with relative ease. Likewise, there are a number of Silverlight Toolkit controls that can be easily ported to Silverlight for WP7.

### Common pitfalls

There are a number of framework differences that you will hit, no matter what you are developing. I am not going to detail them all here because they have been covered in detail elsewhere, most notably by Alan Mendelevich and Morten Nielsen, who have both published long and detailed blog series on the various detailed framework differences. Both have employed resolution technique similar to those which I have listed above. The best place to start for each is their index page:

- The index to [Morten’s blog series](http://www.sharpgis.net/post/2011/08/04/WPF-vs-Silverlight-Part-0-Introduction.aspx)
- The index to [Alan’s blog series](http://devblog.ailon.org/devblog/post/2009/11/05/Writing-WPFSilverlight-compatible-code-Table-of-Contents.aspx)

### The Unexpected

Whilst there are a number of common pitfalls that are easily resolved, there are few differences between the two frameworks that are surprising and make little or no sense at all! I have called these the ‘unexpected’ because, as the name suggest, you will not expect them, and you typically only find them when things start to misbehave in peculiar and illogical ways!

The first one is the default `BindingMode`. Within Silverlight, this is `BindingMode.OneWay`, which means by default changes to your model will update the UI, but not vice-versa. With WPF the default is `BindingMode.Default` … which means, it depends! The default binding mode is defined by the Dependency Property metadata. This is a confusing difference, but easily resolved by always explicitly setting the BindingMode on your bindings.

Next is the control life-cycle:

![ControlLifeCycle.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/ControlLifeCycle.png)

Within WPF, `OnApplyTemplate` is called before the Loaded event fires, whereas, in Silverlight this is not guaranteed and often `OnApplyTemplate` occurs last. This can be problematic, if you use OnApplyTemplate to wire up your control’s UI, locating element within your XAML markup. In Silverlight, this logic may not be called before user-logic within the Loaded event. There are ways to resolve this issue; Page Brooks describes a method of [forcing the life-cycle](http://pagebrooks.com/archive/2008/11/30/tweaking-onapplytemplate-event-timing-in-silverlight-2.aspx) to follow the WPF order of events.

Finally, XAML resources, if you use the file linking approach within your WPF project to link a XAML resource into your WPF solution, build the project, then inspect the assembly with ILSpy, you will find that XAML resources are always located in the root of the assembly, regardless of which project folder they were dropped into. For custom controls, which require a Themes/generic.xaml file, this is a disastrous!

A nice resolution for this issue, [courtesy of Alan Mendelevich](http://devblog.ailon.org/devblog/post/2010/01/13/Writing-WPFSilverlight-compatible-code-Part-6-Adding-XAML-files-as-links.aspx), is to have all of your XAML resources in the project root, then use `MergedDictionaries` to include the required resources in your generic.xaml file:

~~~xml
<ResourceDictionary
     xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
     xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
  <ResourceDictionary.MergedDictionaries>
     <ResourceDictionary Source="/WpfControl;component/Themes/MyTemplatedControl.xaml" />
  </ResourceDictionary.MergedDictionaries>
</ResourceDictionary>
~~~

## Adapting to each Platform

The previous section described techniques that can be employed to provide the same functionality on each platform. However, if you simply try to deliver exactly the same application across the desktop, web and mobile, your application will probably never really feel “at home” in any of the three.

The various UI controls that are common across all three frameworks do a good job of adapting to the platform within which they are hosted. If we compare a simple interface, generated using identical XAML, across all three, we see some fairly big differences:

![CrossPlatformControls.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/CrossPlatformControls.png)

The desktop WPF and web-based Silverlight interfaces are pretty similar, however, the WP7 interface looks very different. The buttons, checkboxes and radio-buttons are much bigger to account for the relative inaccuracy of the main input device (your finger!), there are also some dynamic differences, for example, scrolling is achieved via a swipe gesture, with the scrollbar hidden so as to save valuable screen estate.

However, the different platforms offer much more scope for adapting your application. Desktop and web-based applications are becoming more and more similar; however, the mobile environment offers many capabilities that are typically absent from web and desktop:

**Orientation** – mobile devices can detect orientation, this allows you to develop a portrait or landscape interface, or perhaps one that adapts as the orientation changes.

**Camera, GPS, Accelerometer** – mobile devices contain a number of peripheral inputs that you can use within your application to deliver novel functionality. The most commonly used one is GPS, providing location aware search results.

**Multi-touch** – there are multi-touch desktop interfaces available, but these are not terribly common (perhaps due to ergonomic issues), in contrast, multi-touch is a standard feature of smartphones. Making use of multi-touch interfaces and gestures allows the user to explore your application and their data in new and interesting ways.

## XAML Finance

With XAML Finance I wanted to see how much code it was possible to share between a desktop, web and mobile application, whilst at the same time making the application feel “at home” within each environment, i.e. making use of the functionality available to each.

The XAML Finance application allows you to explore the shares that comprise the UK’s FTSE100 index. You can browse the FTSE 100 by share price, drill-down to view performance and static data for each share and view historic performance via charts. There is also a heatmap visualisation of the FTSE100 index.

I am not going to describe the code in detail; there is quite a lot of it! The full source-code is available to download with this article, so feel free to delve into it at your leisure. Instead, I will describe the overall architecture and highlight the major differences between the three versions of XAML Finance.

To make it easier to share and specialise the code, all of the shared C# and XAML files are located outside of the project folders, in a ‘Common’ folder. This makes the three platform specific projects less tangled when sharing code between just two of the three platforms.

### Architecture

Each of the three XAML Finance solutions comprises two projects, the datasource class library and the XAML Finance application. I will describe each in turn.

### DataSource Library

The datasource library exposes a single public interface, `IDataSource` which has a few simple methods that asynchronously return data, in the form a structured model (of POCO instances). Internally this is implemented by the class `DataSource` which depends on an xml source of data as defined by the `IXmlDataSource` interface. There are a couple of implementations of this interface, `XmlDataSource` which obtains XML data from the internet, which `XmlFileDataSource` returns XML data from embedded file resources – useful for offline testing of the application. `DataSource` makes use of Linq-to-XML to parse the string response and create the required POCO object graph.

The datasource class library is identical for all three XAML Finance applications.

![DataSourceDesign.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/DataSourceDesign.png)

### XAML Finance Application

The XAML Finance application depends on the datasource project, using it to supply the required data. It is in the three versions of the XAML Finance applications that we see framework differences being resolved and the application being adapted for its target platform.

#### The MVVM pattern

The XAML Finance Application makes use of the Model-View-ViewModel UI design pattern (which is described in detail by [Josh Smith in this MSDN article](http://msdn.microsoft.com/en-us/magazine/dd419663.aspx)), to me, the one key thing to remember in the MVVM pattern is that the ViewModel is the model-of-a-view, in other words, the ViewModel should have a structure that is closely related to the way that the data is presented on-screen.

The Silverlight version of the XAML Finance Application presents the user with a tabbed interface. Clicking on one of the buttons on the left adds a new FTSE100 or Heatmap view, whilst clicking on one of the shares adds a view which gives you more information about the specific company, including a chart. The top-level view model, `XamlFinanceViewModel` exposes an `ObservableCollection` of ‘child’ view models, each one being bound to a tab-page. As new ‘child’ view models are added, they initialise themselves by fetching data via the IDataSource interface. The view models implement the `INotifyPropertyChanged` interface so that the view can be updated as the data arrives. This is all very standard MVVM fare!

![XamlFinanceSilverlightDesign.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/XamlFinanceSilverlightDesign.png)

All of the child view models extend `NamedViewModelBase`. This base class provides a Name property, which is displayed as the tab heading, and a `CloseCommand`, which is bound to the small ‘x’ button that removes a tab. The implementation of this command simply removes the view model from the `TabItems` collection in `XamlFinanceViewModel`, the collection binding ensures that the UI is updated accordingly.

#### Adapting for the web

Web based Silverlight applications often live alongside web-based HTML content. The default style for Silverlight applications, which is based on the Aero theme doesn’t really sit well alongside most web content. The flexible styling / templating available within Silverlight makes it quite an easy task to re-style the UI to fit in with existing web content. In the screenshot below it can be seen that the fonts, colour scheme, hyperlinks and other imagery have been copied from the website which hosts the application, making it hard to determine the boundaries of the Silverlight application:

![XAMLFinanceSilverlightSmall.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/XAMLFinanceSilverlightSmall.jpg)

#### Adapting for the desktop

Desktop applications typically have a similar appearance and layout to web-based applications. I used one of the [‘stock’ themes available to WPF](http://wpf.codeplex.com/wikipage?title=WPF%20Themes), to give the application an aero theme.

With web-based applications it is often the expectation that the browser will be maximized, giving each a similar amount of screen real-estate to utilise. With XAML Finance I wanted to explore the use of multiple windows. In the web version you can open pages for multiple shares, with each appearing in a separate tab, however you cannot compare two side-by-side.

The WPF version of XAML Finance specialises the top-level model `XAMLFinanceViewModel`, via partial classes, to add a second collection of ‘child’ view models.

![XamlFinanceWPFDesign.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/XamlFinanceWPFDesign.png)

The `TabItems` collection is bound directly to the `ItemsSource` of a `TabControl` within the view, with the binding framework managing the creation / destruction of `TabItems` as this collection changes However, the management of the floating windows must be done manually. The WPF specific additions to the view model require WPF specific views. However, the view is composed of `UserControls`, allowing for re-use of the various components, for example, the company summary and chart page is shared between WPF and Silverlight, even though the views that host them differ,

`NamedViewModelBase` is extended in the WPF project, via partial classes, to add `PopOutCommand` and `PopInCommand`. These commands are bound to buttons in the tab heading:

**![TabHeading.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/TabHeading.jpg)**

The `PopOutCommand` moves the view model from the `TabItems` collection to the `FloatingItems` collection. The creating of a `Window` to host a popped-out view model is performed by the application, which handles collection changed events raised by the `FloatingItems` collection:

~~~csharp
private XAMLFinanceViewModel _model = new XAMLFinanceViewModel();

public MainWindow()
{
  InitializeComponent();

  this.DataContext = _model;

  model.FloatingViewModels.CollectionChanged += FloatingViewModels_CollectionChanged);
}

private void FloatingViewModels_CollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
{
  if (e.Action == NotifyCollectionChangedAction.Add)
  {
    // create a window to host the view model that has been moved into this collection
    var host = new ViewModelHost();
    host.DataContext = e.NewItems[0];
    host.Show();
  }
}<span class="Apple-style-span" style="white-space: normal; ">
</span>
~~~

When a view model is added, a `ViewModelHost` window is created with the view model supplied as the `DataContext`. The `ViewModelHost` simply contains a `ContentControl`:

~~~xml
<Window x:Class="XAMLFinance.ViewModelHost"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        ShowInTaskbar="False"
        WindowStartupLocation="CenterOwner"
        Closed="Window_Closed"
        Title="{Binding Path=Title}" Height="600" Width="500">
    <Grid>
        <ContentControl Content="{Binding}"
                        VerticalAlignment="Stretch"
                        HorizontalAlignment="Stretch"/>
    </Grid>
</Window>
~~~

When the `Closed` event is raised, the `PopInCommand` is executed (by simply invoking this command via code-behind), which results in the view model being moved back into the `TabItems` collection.

The selection of a suitable view for the bound view model is performed via implicit `DataTemplates`, with the following XAML merged into the application resources:

~~~xml
<ResourceDictionary
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:view="http://XAMLFinance/View"
             xmlns:vm="http://XAMLFinance/ViewModel">

    <DataTemplate DataType="{x:Type vm:InstrumentDetailsViewModel}">
        <view:InstrumentDetailsView/>
    </DataTemplate>

    <DataTemplate DataType="{x:Type vm:PriceListViewModel}">
        <view:PriceListGridView/>
    </DataTemplate>

    <DataTemplate DataType="{x:Type vm:HeatMapViewModel}">
        <view:HeatMapView/>
    </DataTemplate>
</ResourceDictionary>
~~~

Other than the addition of floating windows, the WPF and Silvelight applications are very similar, sharing view models, with the extensions described above, and much of the view code (XAML) as well.

#### Adapting for Windows Phone 7

The ‘core’ of both the WPF and Silverlight versions of XAML Finance is the tabbed interface that allows the user to open multiple documents and switch between them. Windows Phone 7 doesn’t have a tab control, so there is no easy way to copy the WPF / Silverlight interfaces to WP7. There is nothing stopping you from creating a WP7 tab control, however, with the limited screen size of a mobile device, multiple document interfaces do not work well. As a result, the majority of WP7 applications provide a navigation based approach. In fact the WP7 architecture, with page state, back-stack and tombstoning really push you towards a page-by-page UI model.

I have covered how to integrate with the [WP7 tombstoning and navigation frameworks whilst developing with the MVVM pattern in an earlier article](http://www.scottlogic.co.uk/blog/colin/2011/05/a-simple-windows-phone-7-mvvm-tombstoning-example/), so I will not go into details here. Briefly, the view model presents an object graph that can be navigated to locate a view-model via URIs which are used for navigation. The view model is associated with the application instance, when a page is navigated to it uses its URI to locate the correct ‘node’ within the view model to use as its `DataContext`.

This different architecture is reflected in the re-structured view model, where for example, clicking on a company in the `PriceListViewModel` doesn’t result in a new view model being added to a collection within the top-level view model (as is the case for the WPF and Silverlight applications). Instead, the view model is ‘expanded’ in place, with the additional data requested via `IDataSource` in-situ.

The WP7 landing page makes use of the popular `Panorama` control, and the ‘tiles’ UI paradigm is employed to create a Metro style UI.

Rather than display the Panorama immediately, the UI is hidden while the data is loaded. The `XAMLFinanceViewModel` (the WP7 specific extension), initialises its various child view models immediately. As the state of each changes, various conditions are checked. When all the children are fully populated, the boolean `IsLoaded` property is set to true:

~~~csharp
/// <summary>
/// Initialises the various view-models required for the panorama
/// </summary>
public override void Init()
{
  Pricelist.PropertyChanged += (s,e) => CheckChildViewModelsLoaded();
  HeatMap.PropertyChanged += (s, e) => CheckChildViewModelsLoaded();
  Pricelist.Init();
  HeatMap.Init();

  // get the FTSE100 prices
  App.Current.DataSource.GetFTSE100PriceHistory(
    priceHistory =>
    {
      FTSE100Price = new InstrumentPriceHistoryViewModel(priceHistory);
      CheckChildViewModelsLoaded();
    });
}

/// <summary>
/// Updates the IsLoaded state based on the state of the related view models.
/// </summary>
private void CheckChildViewModelsLoaded()
{
  IsLoaded = Pricelist.Prices.Count > 0 &&
            HeatMap.Sectors.Count > 0 &&
            FTSE100Price.Count > 0;
}<span class="Apple-style-span" style="white-space: normal; ">
</span>
~~~

The code-behind for the page which hosts the panorama control checks the state of the `IsLoaded` property, hiding the loading indicator when all the view models are fully populated:

~~~csharp
public PanoramaIndex()
{
  InitializeComponent();
  this.DataContext = App.Current.ViewModel;

  LoadingIndicator.Opacity = 1;

  // monitor the IsLoaded view model property to determine when the
  // data we require has arrived
  if (App.Current.ViewModel.IsLoaded)
  {
    DataLoadComplete();
  }
  else
  {
    App.Current.ViewModel.PropertyChanged += (s, e) =>
      {
        if (App.Current.ViewModel.IsLoaded)
        {
          DataLoadComplete();
        }
      };
  }
}

/// <summary>
/// If data has arrived, hide the loading indicator.
/// </summary>
private void DataLoadComplete()
{
  BackgroundImage.Opacity = 0.4;
  LoadingIndicator.Visibility = Visibility.Collapsed;
}<span class="Apple-style-span" style="white-space: normal; ">
</span>
~~~

Another place where the WP7 application differs is the FTSE100 Heatmap, this provides a view of share performance, indicated by colour, versus [market capitalization](http://en.wikipedia.org/wiki/Market_capitalization), indicated by size. The heatmap is further structured by industry sector. The WPF and Silverlight toolkits provide a TreeMap control which is ideal for visualising this kind of data, by using nested TreeMaps it is possible to create this heatmap purely within XAML. Clicking on any of the shares executes a bound command which adds the required view model to the collection of tabbed items.

**![Heatmap.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/Heatmap.jpg)**

The WP7 Toolkit does not include the `TreeMap` control which is present in the Silverlight and WPF toolkits. However, by taking the sourcecode from the Silverlight version, I found that it was very easy to port this to WP7. The bigger issue on the phone is usability, for companies with a very small market capitalization, the area they occupy within the heatmap is very small. Whilst they are still clickable with a mouse, which can be manipulated with a high degree of precision, they are impossible to click on a phone interface (with even the most slender of finger!).

For the WP7 version of XAML Finance, the user drills-down through the heatmap, the first click selecting sector, the second click selecting the specific company:

![HeatmapWP7.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/HeatmapWP7.png)

The company information, which is displayed as a single page in the Silverlight and WPF applications, is displayed on multiple screens using a WP7 pivot control:

![CompanyDetails.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/CompanyDetails.png)

The only third-party control that XAML Finance uses is a [Visiblox chart control](http://www.visiblox.com/). This chart has WPF, Silverlight and WP7 editions, each exposing the same API. Furthermore, the WP7 version makes use of the phone’s multitouch interface, allowing the user to scroll and ‘pinch’ the chart using their fingers.

When interacting with the chart, it makes sense to maximise it so that it fills the entire phone screen. Also a landscape orientation makes most sense for a time-series chart. Rather than having the user explicitly navigate to the full-screen chart page, XAML Finance makes use of the fact that the phone can detect orientation. When the user rotates the phone into portrait mode, the chart is rendered full screen.

![OrientationWP7.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/OrientationWP7.png)

The WP7 version of XAML Finance also makes use of the [WP7Contrib project on codeplex](http://wp7contrib.codeplex.com/), which provides a number of useful tools and utilities for WP7 developers.

## Conclusions

With this article I have demonstrated how you can re-use a considerable amount of code between the desktop, web and mobile applications by use of the WPF, Silverlight and Silverlight for WP7 frameworks respectively. Unfortunately writing cross-platform applications is not an easy ride; there is no real tool support for this, beyond linked files, and the numerous framework differences are obstacles that must be overcome. Fortunately, with the use of standard solutions to these differences, and suitable UI patterns to specialise each version of the application it is possible to write cross-platform applications that share large volumes of code, whilst looking like they really ‘fit’ in each environment.

Just how much code can be shared does depend on the application you are creating. The XAML Finance application attached to this article has approximately 75% of its code within a common codebase:

![XamlFinanceCodeReuse.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/XamlFinanceCodeReuse.png)

There is also quite a bit of code shared between the web-based Silverlight and WPF versions. The WP7 edition of XAML Finance has more platform-specific code than the others because of the more dramatic differences in the platform itself.

I hope that this article has been informative and has encouraged others to think about cross-platform development with XAML technologies. The obstacles, once overcome, allow the sharing of a considerable amount of code.

Three applications for the price of one (or one-and-a-half), a real bargain!

## Change History

- ****22 Sep 2011** - Fixed broken links**
- **21 Sep 2011** - Added a video for the WP7 version
- **19 Sep 2011** - Initial article upload
