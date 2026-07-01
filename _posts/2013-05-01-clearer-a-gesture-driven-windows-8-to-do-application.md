---
title: Clearer – A Gesture-Driven Windows 8 To-Do Application
date: 2013-05-01 00:00:00 Z
categories:
- Tech
tags:
- codeproject
author: ceberhardt
layout: default_post
source: codeproject
summary: Documents the experience of porting a gesture-driven Windows Phone to-do app to Windows 8, covering both the challenges and new platform opportunities such as live tiles, search contracts, and snapped view. It provides an honest, detailed account of the transition for developers familiar with Windows Phone.
---

*This article was originally published on CodeProject, which has since shut down.*

## Introduction

A while back I wrote a CodeProject article about a [gesture-driven to-do list application for Windows Phone](http://www.codeproject.com/Articles/428088/A-Gesture-Driven-Windows-Phone-To-Do-List) that eschews the use of buttons and checkboxes in favour of swipes, pinches and other gestures. Windows 8 development is quite similar to Windows Phone, both share the use of XAML, C# and have a similar application lifecycle. In this article I’ll describe my own experiences of porting a Windows Phone application to Windows 8 so that it could be added to the Windows Store.

![Clearer2]({{ site.baseurl }}/ceberhardt/assets/codeproject/Clearer2.jpg)

This article is my entry into the CodeProject Ultrabook competition, but I hope that it stands up as an article in its own right. For that reason it is a detailed and honest account of my experiences with Windows 8, which includes the full sourcecode.

The transition from Windows Phone to Windows 8 was not entirely painless, there were a few features that I was unable to port across. However, there were a number of new opportunities to explore, including live tiles, search contracts and snapped view.

The Windows Phone application was heavily inspired by the [i](http://www.realmacsoftware.com/clear/)

[Phone app Clear by Realmac](http://www.realmacsoftware.com/clear/) software to which I give full credit for coming up with the novel gestures that drive its interface. If you have an iPhone, please buy their app, I have … it is excellent food-for-thought.

The Windows Phone application I wrote has a very simple view model, which is nothing more than an ObservableCollection of simple model objects, `ToDoItem`. Most of the code within the application was concerned with implementing the various gestures.

## Porting The Code

The first step I took in porting the application was to fire up Visual Studio 2012, create a new blank project, and copy across the view models and UI interaction logic from the Windows Phone application. The app was structured such that the gestures were added using a similar pattern to attached behaviours so that they could easily be added or removed via a single line of code. I slowly added the various components into the newly created Windows 8 application, resolving issues as they were encountered.

As expected, the view models required very little modification in order to make them build for Windows 8. The only change I needed to make was one namespace change for a property of type `Color`:

```csharp
System.Windows.Media.Color => Windows.UI.Color System.Windows.Media.Color => Windows.UI.Color
```

With the view models in place I added some to-do items to the `MainPage.xaml` and set it as the `DataContext`:

```csharp
private ToDoListViewModel _viewModel;
public MainPage()
{
  this.InitializeComponent();

  _viewModel = new ToDoListViewModel();
  _viewModel.Items.Add(new ToDoItem("Feed the cat"));
  _viewModel.Items.Add(new ToDoItem("Buy eggs"));
  ...
  _viewModel.Items.Add(new ToDoItem("Simplify my life"));
  this.DataContext = _viewModel;
}
```

The XAML used for the Windows Phone version of the to-do list application, was quite simple, containing an `ItemsControl` for rendering the above list of items and a relatively simple template for each item. For Windows Phone I added a subtle gradient to each item, but for Windows 8 I decided to go for a simpler ‘flat’ look. The XAML is shown below:

```xml
<Page ...>
  <Page.Resources>
    <conv:ColorToBrushConverter x:Key="ColorToBrushConverter"/>
    <conv:BoolToVisibilityConverter x:Key="BoolToVisibilityConverter"/>
    <DataTemplate x:Key="toDoItemTemplate">
      <Border Height="55" x:Name="todoItem">
        <Grid Margin="2"
              Background="{Binding Path=Color, Converter={StaticResource ColorToBrushConverter}}">
          <TextBlock Text="{Binding Text, Mode=TwoWay}"
                    FontSize="25" TextTrimming="WordEllipsis"
                    Margin="10 0 0 0"
                    Foreground="White"
                    VerticalAlignment="Center"
                    Grid.Column="1"/>
          <Line Visibility="{Binding Path=Completed, Converter={StaticResource BoolToVisibilityConverter}}"
                X1="0" Y1="0" X2="1" Y2="0"
                Stretch="UniformToFill"
                Stroke="White" StrokeThickness="2"
                Margin="8,5,8,0"
                Grid.Column="1"/>
        </Grid>
      </Border>
    </DataTemplate>
  </Page.Resources>
  <Grid>
    <ItemsControl ItemsSource="{Binding Path=Items}"
                  ItemTemplate="{StaticResource toDoItemTemplate}"
                  x:Name="todoList">
      <ItemsControl.Template>
        <ControlTemplate TargetType="ItemsControl">
          <ScrollViewer x:Name="scrollViewer">
            <ItemsPresenter/>
          </ScrollViewer>
        </ControlTemplate>
      </ItemsControl.Template>
    </ItemsControl>
  </Grid>
</Page>
```

The above XAML is pretty much a direct copy from the Windows Phone version. Although there were a few minor tweaks required:

- The `BoolToVisibility` and `ColorToBrush` converters required some minor changes, the arguments for value converters differ quite subtly in Windows 8 (the fourth parameter is a `string` rather than a `CultureInfo` instance).
- The `ScrollViewer` within the Windows Phone version has `ManipulationMode` set to `ManipulationMode.Control`. This ensures that updates to the scroll viewer position are handled on the UI thread rather that the scroll viewer thread (this was added in the [Mango release to improve scroll performance](http://blogs.msdn.com/b/slmperf/archive/2011/06/02/listbox-scrollviewer-performance-improvement-for-mango-and-how-it-impacts-your-existing-application.aspx)). The Windows Phone application requires the `ManipulationMode.Control` in order to support the pull-to-add-new interaction. Windows 8 has a very different way of handling scrolling as we will see later!

The Windows 8 UI can be seen below:

![PlainList]({{ site.baseurl }}/ceberhardt/assets/codeproject/PlainList.png)

## Tailoring For The Bigger Screen And Snapped Views

As you can see in the screen above, simply copying an interface for the small phone screen and scaling it to the larger tablet form-factor doesn’t necessarily work. In order to make use of the larger screen I split the interface into two halves; the list rendered on the right, and the details for each item rendered on the left:

![WithBackground]({{ site.baseurl }}/ceberhardt/assets/codeproject/WithBackground.jpg)

I also added a background image to add a bit of ‘texture’ to the interface.

In order to support the ‘detail’ view on the left of the screen, I added a `SelectedItem` to the view model:

```csharp
/// <summary>
/// A collection of todo items
/// </summary>
public class ToDoListViewModel : INotifyPropertyChanged
{
  private ToDoItem _selectedItem;
  …
  public ToDoItem SelectedItem
  {
    get
    {
      return _selectedItem;
    }
    set
    {
      _selectedItem = value;
      PropertyChanged(this, new PropertyChangedEventArgs("SelectedItem"));
    }
  }

  public ObservableCollectionEx<ToDoItem> Items
  {
    …
  }
}
```

I then replaced the `ItemsControl` which renders the list of items with a `ListBox` and bound the `ItemsSource` and `SelectedItem` properties accordingly.

```xml
<ListBox ItemsSource="{Binding Items}"
         SelectedItem="{Binding Path=SelectedItem, Mode=TwoWay}"
         x:Name="todoList">
  ...
</ListBox>
```

The `DataContext` of the Grid, which is the root element of the ‘details’ area on the left of the screen, is then bound to the `SelectedItem` property of the view model. Child elements of the `Grid` can then bind directly to properties of the selected to-do item:

```xml
<Grid x:Name="itemDetailGrid"
      DataContext="{Binding SelectedItem}">
  <Image Source="Assets/StoreLogo.png"
          Width="50" Height="50"
          HorizontalAlignment="Left"/>
  <TextBlock Text="Clearer" FontSize="55"
            Margin="60 20 0 20"
            VerticalAlignment="Center"/>
  <TextBox Text="{Binding Text, Mode=TwoWay}"
            Grid.Row="1" FontSize="25"/>
  <TextBox Text="{Binding Description, Mode=TwoWay}"
           Grid.Row="2"
           TextWrapping="Wrap" FontSize="25" Foreground="White"
           AcceptsReturn="True/>
</Grid>
```

I really like this style of binding, where you ‘switch’ `DataContext` in order to create ‘islands’ within your UI that are bound to different objects.

In switching the `ItemsControl` to the `ListBox` the list now has the standard highlight to indicate focus and selection. The default light blue box doesn’t really fit with the UI for this application, so I template the `ItemsControl` to add a simple ‘dot’ next to the highlighted item. I was able to strip out most of the generic bindings for the template, but was still left with quite a big block of XAML:

```xml
<ControlTemplate TargetType="ListBoxItem" x:Key="listBoxItemTemplate">
  <Border x:Name="LayoutRoot">
    <VisualStateManager.VisualStateGroups>
      <VisualStateGroup x:Name="CommonStates">
        <VisualState x:Name="Normal"/>
        <VisualState x:Name="MouseOver"/>
      </VisualStateGroup>
      <VisualStateGroup x:Name="SelectionStates">
        <VisualState x:Name="Unselected">
          <Storyboard>
            <DoubleAnimation Duration="0" To="0"
                              Storyboard.TargetProperty="(UIElement.Opacity)"
                              Storyboard.TargetName="selectedDot" d:IsOptimized="True"/>
          </Storyboard>
        </VisualState>
        <VisualState x:Name="Selected">
          <Storyboard>
            <DoubleAnimation Duration="0" To="1"
                              Storyboard.TargetProperty="(UIElement.Opacity)"
                              Storyboard.TargetName="selectedDot" d:IsOptimized="True"/>
          </Storyboard>
        </VisualState>
        <VisualState x:Name="SelectedUnfocused">
          <Storyboard>
            <DoubleAnimation Duration="0" To="1"
                              Storyboard.TargetProperty="(UIElement.Opacity)"
                              Storyboard.TargetName="selectedDot" d:IsOptimized="True"/>
          </Storyboard>
        </VisualState>
      </VisualStateGroup>
    </VisualStateManager.VisualStateGroups>
    <Grid>
      <!-- the 'dot' that indicates selection -->
      <Ellipse Width="15" Height="15"
                VerticalAlignment="Center" HorizontalAlignment="Left"
                Fill="White" x:Name="selectedDot"
                Opacity="0"/>
      <!-- the content for this item -->
      <ContentControl x:Name="ContentContainer"
                      ContentTemplate="{TemplateBinding ContentTemplate}" Content="{TemplateBinding Content}"
                      HorizontalContentAlignment="Stretch"
                      Foreground="#FF1BA1E2" Margin="20 0 0 0"/>
    </Grid>
  </Border>
</ControlTemplate>
```

The visual states simply show / hide the dot based on selection state.

Windows 8 applications can exist in two states, full screen or snapped. If you do not have a touch interface you can enter snapped mode by hitting `‘Windows Key’ + ‘.’` .

The UI for the to-do application uses a `Grid` with two ‘star’ width columns to divide the screen into the left and right panes. This will quite happily scale when the application is snapped, but the end result isn’t too pretty:

![Snapped]({{ site.baseurl }}/ceberhardt/assets/codeproject/Snapped.png)

For this application it is best to tailor the interface when it is snapped. This is probably true for most Windows 8 applications!

When an application is snapped there is no requirement that it must delivery all the same functionality that it does when running full screen. Rather than trying to re-arrange or shrink your interface, why not consider why a user might snap your application and what tasks they will be performing?

For this to-do list application I can consider that a user might want to have their list of items snapped to the side whilst they complete the listed tasks using some other application which occupies the larger portion of the screen. For this reason, I think it is absolutely fine that the snapped view renders just the list, which allows them to mark items as complete or delete them (we’ll add this functionality later), but forces them to go full-screen in order to add or edit items.

Looking at the samples that ship with VS2012, or examples from the web you can see that when an app is snapped the visual state of the page changes.

So … I went ahead and added some visual states that show / hide various elements when the application is snapped. I opted to create a second list for rendering the items in a snapped view so that I could more easily control the `ItemTemplate` and other properties:

```xml
<Page ...>
  <Grid Background="{StaticResource ApplicationPageBackgroundThemeBrush}"
        x:Name="ContentRoot">

    <!-- application layout goes here -->
    <VisualStateManager.VisualStateGroups>
      <VisualStateGroup x:Name="ApplicationViewStates">
        <VisualState x:Name="FullScreenLandscape"/>
        <VisualState x:Name="Filled"/>
        <VisualState x:Name="FullScreenPortrait"/>
        <VisualState x:Name="Snapped">
         <Storyboard>
            <!-- hide the item details view -->
            <ObjectAnimationUsingKeyFrames Storyboard.TargetName="itemDetailGrid" Storyboard.TargetProperty="Visibility">
              <DiscreteObjectKeyFrame KeyTime="0" Value="Collapsed"/>
            </ObjectAnimationUsingKeyFrames>
            <!-- hide the application title -->
            <ObjectAnimationUsingKeyFrames Storyboard.TargetName="leftHandTitle" Storyboard.TargetProperty="Visibility">
              <DiscreteObjectKeyFrame KeyTime="0" Value="Collapsed"/>
            </ObjectAnimationUsingKeyFrames>
            <!-- hide the to-do list -->
            <ObjectAnimationUsingKeyFrames Storyboard.TargetName="todoList" Storyboard.TargetProperty="Visibility">
              <DiscreteObjectKeyFrame KeyTime="0" Value="Collapsed"/>
            </ObjectAnimationUsingKeyFrames>
            <!-- show a more compact version of the list -->
            <ObjectAnimationUsingKeyFrames Storyboard.TargetName="todoListCompact" Storyboard.TargetProperty="Visibility">
              <DiscreteObjectKeyFrame KeyTime="0" Value="Visible"/>
            </ObjectAnimationUsingKeyFrames>
          </Storyboard>
        </VisualState>
      </VisualStateGroup>
    </VisualStateManager.VisualStateGroups>
  </Grid>
</Page>
```

However much to my confusion, this did not work!

After digging around the samples in a bit more detail, I discovered that the framework does not set the visual state of your application page. The framework supplied a static property `ApplicationView.ApplicationViewState` which reflects the current orientation and snapped state. You will find that many of the samples that ship with the Windows 8 SDK contain a class `LayoutAwarePage` that maps this property to a visual state.

`LayoutAwarePage` is a rather large class that performs quite a number of utility functions. The fact that it is included in the SDK samples does make me think that the Windows 8 framework itself is a little under-cooked. In my opinion SDK samples should demonstrate how to achieve simple tasks and these tasks should be simple to achieve!

Anyhow, I’ll climb down off my soapbox.

I added `LayoutAwarePage` to my project and modified `MainPage` to use it as a superclass and hey-presto, my snapped view worked! Here is the list snapped next to an image of some beautiful rolling countryside, courtesy of the Bing app:

![Snapped2]({{ site.baseurl }}/ceberhardt/assets/codeproject/Snapped2.jpg)

## Adding Interactions

So far the view models have been ported and the application UI has been tailored for Windows 8. It’s time to get started on porting the gestures that made this such an interesting to-do list application in the first place.

The Windows Phone application described in [my previous article](http://www.codeproject.com/Articles/428088/A-Gesture-Driven-Windows-Phone-To-Do-List) uses the concept of an interaction, as defined by the `IInteraction` interface, which attached event handlers to each of the items within the list. The `InteractionManager` coordinates the various interactions to ensure that only one is active at any one time. These concepts port just fine to the Windows 8 version of the app.

I took the same approach as I did with the view models, add the Windows Phone classes to the Windows 8 project then start resolving compilation issues. This time the changes required to port the code were much more numerous:

1. Lots of namespace changes!
2. The manipulation event arguments are different `ManipulationCompletedEventArgs => ManipulationCompletedRoutedEventArgs` (and the same applies for Started, Delta and other events).
3. The event arguments are different `e.TotalManipulation => e.Cumulative`
4. The e.FinalVelocities property is not present, making it hard to create interactions where you manage your own inertia / momentum
5. e.DeltaManipulation => e.Delta
6. The animation easing property changes type, `IEasingFunction => EasingFunctionBase`
7. Storyboard target properties are of type string rather than `PropertyPath` instances.
8. The `LayoutUpdated` event is of type `EventHandler<object>` rather than simply `EventHandler`.

That’s quite a list of changes required to the code to get it compile. Frustratingly there is nothing fundamentally different in terms of what Windows 8 can and cannot do when compared to Windows Phone. The API is just ever so slightly different!

Anyhow I’ve already climbed on my soapbox once already, for now I’ll push it to one side and just get on with making this thing work.

With the above changes I was able to make the `SwipeInteraction` code compile, adding it to the `MainPage.xaml` via the `InteractionManager` … and when I ran the application, it did absolutely nothing!

With a bit of poking around on the forums and API documentation I discovered that the way Windows 8 Store Apps handle interactions is very different to Windows Phone. You can attach manipulation events to any `UIElement` however, these are only fired if you also set the `ManipulationMode` on the element. The manipulation mode enumeration provides values that allow you to constrain the type of interaction that the element participates in, e.g. `TranslateX`, `TranslateY`. Interestingly you can also specify whether the manipulation should include inertia with values such as `TranslateIntertia` or `RotateIntertia`, when inertia is applied delta events continue to fire event after the user has stopped manipulating. The various values can be ORed together for any element.

In order to make the `SwipeInteraction` work I set the `ManipulationMode` property of the elements that render each to-do item. Unfortunately, this has the rather undesirable side-effect that the list no longer scrolls. The `ScrollViewer` has a ‘special’ `ManipulationMode` of System that provides a smooth scrolling experience, no doubt this is similar to Windows Phone Mango where scrolling was pushed to a separate thread. Unfortunately Windows 8 `ManipulationModel.System` does not cooperate with child elements that have `ManipulationMode` of anything other than None. To put it bluntly, [you cannot handle manipulation events on any element within a ScrollViewer without breaking scrolling](http://stackoverflow.com/questions/12636216/scrollviewer-and-handling-manipulation-events-on-child-elements).

This was a bit of a blow to my application!

The workaround that I came up with was to add little ‘thumb’ controls to each item in the to-do list. These are user controls which are located to the left and right edges of each item, and accept the manipulations required to perform the swipe gestures:

```xml
<DataTemplate x:Key="toDoItemTemplate">
  <Border Height="55" x:Name="todoItem">
    <Grid Margin="2"
          Background="{Binding Path=Color, Converter={StaticResource ColorToBrushConverter}}">
      <Grid.ColumnDefinitions>
        <ColumnDefinition Width="Auto"/>
        <ColumnDefinition Width="*"/>
        <ColumnDefinition Width="Auto"/>
      </Grid.ColumnDefinitions>
      <!-- the two thumb controls -->
      <local:ThumbControl Loaded="Border_Loaded"
                Width="40" Height="55" ManipulationMode="All" />
      <local:ThumbControl Loaded="Border_Loaded"
                Width="40" Height="55" ManipulationMode="All"
                              Grid.Column="2"/>
      <!-- the to-do item visuals -->
      <TextBlock Text="{Binding Text, Mode=TwoWay}"
                      FontSize="25" TextTrimming="WordEllipsis"
                      Foreground="White"
                      VerticalAlignment="Center"
                    Grid.Column="1"/>
      <Line Visibility="{Binding Path=Completed, Converter={StaticResource BoolToVisibilityConverter}}"
                  X1="0" Y1="0" X2="1" Y2="0"
                  Stretch="UniformToFill"
                  Stroke="White" StrokeThickness="2"
                  Margin="8,5,8,0"
                Grid.Column="1"/>
    </Grid>
  </Border>
</DataTemplate>
```

You can see the ‘thumb’ controls in the image below:

![Thumbs]({{ site.baseurl }}/ceberhardt/assets/codeproject/Thumbs.png)

With this in place, the application accepts the swipe-to-the-right to complete and swipe-to-the-left to delete gestures. Although the user must of course swipe from one of the ‘thumbs’, and must scroll using the central region of the to-do item.

With more code wrangling I was also able to add the gesture which allows you to drag re-order the list. The main issue I hit this time was that the Windows 8 `WriteableBitmap` does not have a constructor that takes a `FrameworkElement` as an argument. With Windows Phone this is a very popular technique that can be used to ‘clone’ part of the UI in order to perform some advanced graphical effect. With Windows 8 I had to make a few compromises that resulted in z-index issues, i.e. the dragged item is not always on top of the items you are dragging it over.

The image below shows an item mid-drag:

![drag]({{ site.baseurl }}/ceberhardt/assets/codeproject/drag.jpg)

The Windows Phone application had a couple of other novel interactions, the first is a pull-to-add-new interaction which I found that I was unable to implement in Windows 8. This is no great surprise, the Windows Phone version was a bit of a hack, relying on mouse events and probing the `ScrollViewer` Content to inspect the transforms that the framework had applied. The second was a pinch-to-add-new gesture, my feeling is that the `ManipulationMode` restrictions that Windows 8 impose would make this gesture, while technically possible, just too uncomfortable for the user to work with.

## Transitions

OK, time to report some good new features that have emerged with Windows 8 – Transitions. Actually, I’ll re-phrase that, they are a great new feature!

With Windows Phone I found it a little frustrating that the applications that shipped with the OS were more fast and fluid than those written by my fellow Silverlight developers. With the OS apps (email, calendar etc …) lists swishes and transitioned, items tilted and search results flowed. Because of this I embarked on a seven part blog series called [“Metro In Motion”](http://www.scottlogic.co.uk/blog/colin/2011/05/metro-in-motion-5-sandwichflow/), where I showed how to mimic the fluid animations found in the OS apps. The series proved to be pretty popular!

Windows 8 has many of the metro-style transitions built directly into the framework. You can set the Transitions property of any element to values such as `EntranceThemeTransition`, `AddDeleteThemeTransition` etc … and the elements will automatically be animated as they appear, are deleted etc …

Even more powerful is the `ChildTransitions` property of Panel, which applied the specified transitions to its child element, firing them with a slight delay as each item is added. This produces an elegant and fluid interface without the need to write any code. I think this is a great new feature and something [I blogged about in detail when the CTP was released](http://www.scottlogic.co.uk/blog/colin/2011/10/winrt-transitions-creating-fast-and-fluid-metro-uis/).

It’s hard to capture these transitions with a simple screenshot, but here is the entrance transition for the application:

![transitions]({{ site.baseurl }}/ceberhardt/assets/codeproject/transitions.jpg)

I’d thoroughly encourage you to familiarize yourself with transitions and use them in your own apps.

## Live Tiles

Time to add some Windows 8 specific features …

Whilst Windows Phone has live tile support, Windows 8 takes this onto a whole new level. Live tiles (and secondary tiles) can display a wide range of information based on a number of templates which are part of the framework. Updating an app’s live tile is as simple as sending an XML tile notification via the `TileUpdateManager`.

The documentation [provides a great overview of all the tile notification types](http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx) together with their XML. Unfortunately the SDK samples over complicate things a little, providing an abstraction layer on top of these XML messages making them easier to create. My feeling is, once again, that SDK samples should be simple and concise. If the sample authors feel that the framework is not simple enough to use and end up writing abstractions, the SDK itself needs to be simplified!

Sending an XML message that updated the tile state really isn’t that difficult. I updated the `ToDoListViewModel` to detect changes in its own state and notify the live tile using the following code:

```csharp
private void UpdateTileStatus()
{
  XmlDocument tileXml = TileUpdateManager.GetTemplateContent(TileTemplateType.TileWideBlockAndText01);
  int index = 0;
  foreach(ToDoItem item in _todoItems.Take(4))
  {
    SetElementText(tileXml, index++, item.Text);
  }
  SetElementText(tileXml, 4, _todoItems.Where(t => !t.Completed).Count().ToString());
  SetElementText(tileXml, 5, "Left to-do");
  TileUpdateManager.CreateTileUpdaterForApplication().Update(new TileNotification(tileXml));
}
```

```csharp
private void SetElementText(XmlDocument doc, int index, string text)
{
  var element = (XmlElement)doc.GetElementsByTagName("text")[index];
  element.AppendChild(doc.CreateTextNode(text));
}
```

This generates XML of the following format:

```xml
<tile>
  <visual>
    <binding template="TileWideBlockAndText01">
      <text id="1">Feed the cat</text>
      <text id="2">Buy eggs</text>
      <text id="3">Pack bags for the MVP conference</text>
      <text id="4">Rule the web</text>
      <text id="5">18</text>
      <text id="6">Left to-do</text>
    </binding>
  </visual>
</tile>
```

The only minor issue I found here is that the simulator does not support live tiles, to test the above code you have to run the application on your ‘local machine’. Other than that, live tiles are a breeze to use. The screen shot below shows the app live tile which lists the four top-most items in the to-do list together with the number of items left to complete:

![LiveTile]({{ site.baseurl }}/ceberhardt/assets/codeproject/LiveTile.png)

## Search Contracts

Windows 8 has a charms bar which collects together features and functions that are common across most applications. One contract that it makes sense for the to-do application to implement is search. Handling search input is as easy as handling the `QuerySubmitted` event as shown below:

```csharp
protected override void OnWindowCreated(WindowCreatedEventArgs args)
{
  // Register QuerySubmitted handler for the window at window creation time and only registered once
  // so that the app can receive user queries at any time.
  SearchPane.GetForCurrentView().QuerySubmitted += OnQuerySubmitted;
}
```

In the to-do list application I handled this at the application-level, sending the search input to the MainPage using a static singleton (gasp!).

I added a `SearchText` property to the view model and modified the Items property which exposes the collection of to-do items to filter the collection is the `SearchText` property has been set:

```csharp
public ObservableCollectionEx<ToDoItem> Items
{
  get
  {
    if (string.IsNullOrEmpty(_searchText))
    {
      return _todoItems;
    }
    else
    {
      return new ObservableCollectionEx<ToDoItem>(
        _todoItems.Where(i => i.Text.ToLowerInvariant().Contains(_searchText.ToLowerInvariant())));
    }
  }
}
```

That’s pretty much all you need to handle basic search operations:

![Search]({{ site.baseurl }}/ceberhardt/assets/codeproject/Search.jpg)

## Conclusions

I had fun porting my gesture-driven to-do list application to Windows 8, and had an interesting journey along the way. There are lots of little differences between Windows 8 and Windows Phone, which can result in frustration, or worse still there are some features which are just impossible to port or implement. On the flip side, Windows 8 has some really great new features such as live tiles, transitions, snapped views and more besides. Also, the Windows 8 simulator is fantastic, providing multi-touch emulation for users without touch screens, something that I sorely missed as a Windows Phone developer.

Windows 8 isn’t perfect, and as an experienced WPF, Silverlight and Windows Phone developer it doesn’t really feel like a big step forwards … more of a step sideways. However, having only just installed Windows 8 on my laptop, I marvel at how the Windows team have managed to create such a radically different OS with Windows 8, yet I can still use VS 2010 Express in desktop mode to develop Windows Phone applications.

Windows 8 is a radical departure from previous version of Windows. Hopefully over the next year or so the platform will mature, and the small niggles will be resolved.

You can download the full sourcecode for this application:
