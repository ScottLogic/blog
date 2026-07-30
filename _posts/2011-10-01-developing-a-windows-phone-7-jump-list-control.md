---
title: Developing a Windows Phone 7 Jump List Control
date: 2011-10-01 00:00:00 Z
categories:
- Tech
tags:
- codeproject
author: ceberhardt
layout: default_post
source: codeproject
summary: An in-depth guide to building a Jump List control for Windows Phone 7 that
  lets users rapidly navigate long lists by selecting from a pop-up category grid.
  The article covers custom control creation, performance considerations, and the
  MVVM pattern for mobile UI development.
---

*This article was originally published on CodeProject, which has since shut down.*

![JumpListBasic.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/JumpListBasic_c500ad.png)

## Introduction

About a month ago, I created a Jump List control for Windows Phone 7 and [published it on my blog](http://www.scottlogic.co.uk/blog/colin/2011/01/a-windows-phone-7-jump-list-control/). I got a lot of great feedback from the control, including questions about how certain parts of it work. As a result, I decided to publish an in-depth article here on CodeProject which describes the development of this control.

The control itself is quite dynamic, so the best way to get a feel for what it is like is to watch the following videos, one which is recorded from the emulator, the other on a real device - demonstrating the good performance of this control (apologies for the poor video quality!)

<iframe width="560" height="315" src="https://www.youtube.com/embed/hdd1bIdSA-g" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/jk7jUeNNSHU" frameborder="0" allowfullscreen></iframe>

If you just want to grab the code and use the jump list in your application, then [pop over to my blog](http://www.scottlogic.co.uk/blog/colin/2011/01/a-windows-phone-7-jump-list-control/) where you will find a user guide and a number of examples. If you want to learn about how this control was put together, then read on ...

## Introduction

For Silverlight developers, Windows Phone 7 is a dream come true, a mobile platform that supports a language / framework they already know, or as Jesse Liberty puts it, "[You are already a Windows Phone Developer](http://jesseliberty.com/2010/05/20/you-already-are-a-windows-phone-7-programmer/)". What I find really cool about Silverlight for WP7 is that exactly the same controls can be used both on the web and the mobile. However, the controls for Windows Phone 7 are tailored specifically for the mobile form factor having larger areas to 'hit', and gestures for scrolling for example. Despite this, there are times when you really need a control that is specific to the mobile platform.

Navigating long lists of data is a chore on a mobile device. On the desktop / web, you can click on the scrollbar and navigate the full length of the list with a single gesture, whereas navigating the same list on a mobile requires multiple swipe gestures. This is where a Jump List comes in handy!

A Jump List groups the items within the long list into categories. Clicking on a category heading (or jump button) opens up a category view, where you can then click on one of the other categories, immediately causing the list to scroll to the start of this newly selected category.

This article describes the development of a Jump List control.

## Developing the JumpList control

### Creating a custom control

The first step when building a new control is to determine a suitable starting point, i.e., an existing framework class to extend. The jump list should support selection, so the framework `Selector` class (which `ListBox` subclasses) is a potential; however, it does not expose a public constructor, so that is a nonstarter! This just leaves `Control`, so we'll just have to start from there:

~~~csharp
public class JumpList : Control
{
  public JumpList()
  {
    DefaultStyleKey = typeof(JumpList);
  }
}
~~~

By extending `Control`, we are creating a 'custom control' (or as the Visual Studio 'Add New Item' dialog confusingly calls them, 'Silverlight Templated Control'). The 'look' of the control, i.e., the various visual elements that are constructed to represent the control on screen, are defined as a `Style`:

~~~xml
<Style TargetType="local:JumpList">
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="local:JumpList">
                <Border Background="{TemplateBinding Background}"
                        BorderBrush="{TemplateBinding BorderBrush}"
                        BorderThickness="{TemplateBinding BorderThickness}">
                </Border>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>
~~~

Setting the `DefaultStyleKey` of the `JumpList` in the constructor to reference the style above ensures that this style is applied to any `JumpList` instance that we create. The style sets a single property of the control, the `Template`, to render a `Border`. The various properties of the `Border` are bound to various properties that we have inherited from `Control`. The `JumpList` control doesn't really do much yet, although we can create an instance and set its various border properties:

~~~xml
<local:JumpList Background="Pink"
                            BorderBrush="White" BorderThickness="5"
                            Width="100" Height="100"/>
~~~

![control.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/control.png)

### Rendering the items

The `JumpList` needs to render a collection of items that the user supplies, where each item is rendered according to a template, mimicking the behavior of `ListBox` (and other classes that render lists of objects, such as `ComboBox`). To support this, we add an `ItemsSource` dependency property of type `IEnumerable` to the control. If you have created your own dependency properties before, you will know that there is quite a bit of boiler-plate code to deal with, which is why I prefer to use code-generation rather than add this code manually or via snippets. The technique I am using here is described in the blog post '[declarative dependency property code generation](http://www.scottlogic.co.uk/blog/colin/2009/08/declarative-dependency-property-definition-with-t4-dte/)', where you simply add an attribute to your class describing the property, and the code-generation adds the required code to a generated partial class.

Adding a dependency property is as simple as this ...

~~~csharp
[DependencyPropertyDecl("ItemsSource", typeof(IEnumerable), null,
     "Gets or sets a collection used to generate the content of the JumpList")]
public partial class JumpList : Control
{
  public JumpList()
  {
    this.DefaultStyleKey = typeof(JumpList);
  }
}
~~~

which results in the generation of the following code:

~~~csharp
public partial class JumpList
{
    #region ItemsSource

    /// <summary>
    /// Gets or sets a collection used to generate the content
    ///    of the JumpList. This is a Dependency Property.
    /// </summary>
    public IEnumerable ItemsSource
    {
        get { return (IEnumerable)GetValue(ItemsSourceProperty); }
        set { SetValue(ItemsSourceProperty, value); }
    }

    /// <summary>
    /// Identifies the ItemsSource Dependency Property.
    /// <summary>
    public static readonly DependencyProperty ItemsSourceProperty =
        DependencyProperty.Register("ItemsSource", typeof(IEnumerable),
        typeof(JumpList), new PropertyMetadata(null, OnItemsSourcePropertyChanged));

    private static void OnItemsSourcePropertyChanged(DependencyObject d,
        DependencyPropertyChangedEventArgs e)
    {
        JumpList myClass = d as JumpList;

        myClass.OnItemsSourcePropertyChanged(e);
    }

    partial void OnItemsSourcePropertyChanged(DependencyPropertyChangedEventArgs e);

    #endregion
}
~~~

In order to render the list of items that the user supplies via the `ItemSource` property, we also need to expose a property that allows the user to specify how they want their items rendered. Following with the `ItemsControl` naming conventions, we'll add an `ItemTemplate` property to the `JumpList`:

~~~csharp
[DependencyPropertyDecl("ItemsSource", typeof(IEnumerable), null,
     "Gets or sets a collection used to generate the content of the JumpList")]
[DependencyPropertyDecl("ItemTemplate", typeof(DataTemplate), null,
     "Gets or sets the DataTemplate used to display each item")]
public partial class JumpList : Control
{
  public JumpList()
  {
    this.DefaultStyleKey = typeof(JumpList);
  }
}
~~~

Again, the dependency property itself is added to the T4 template code-generated partial class.

In order to render the items that the user supplies to the `ItemsSource` property (either by binding or by directly setting the property), we need to somehow add them to the visual tree of our JumpList when it is rendered. We could add them directly to the visual tree at runtime; however, the framework `ItemsControl` provides a mechanism for rendering a bound collection of items within a panel, providing a simpler and more flexible solution. A collection of `ContentControl`s are created in the code-behind, one for each of the bound items (later, this collection will also include group headings as well as the items themselves):

~~~csharp
/// <summary>
/// Gets the categorised list of items
/// </summary>
public List<object> FlattenedCategories
{
  get
  {
    return _flattenedCategories;
  }
  private set
  {
    _flattenedCategories = value;
    OnPropertyChanged("FlattenedCategories");
  }
}
private void RebuildCategorisedList()
{
  if (ItemsSource == null)
    return;
  var jumpListItems = new List<object>();
  foreach (var item in ItemsSource)
  {
      jumpListItems.Add(new ContentControl()
      {
          Content = item,
          ContentTemplate = ItemTemplate
      });
  }
  FlattenedCategories = jumpListItems;
}
~~~

When the `ItemsSource` property of the `JumpList` is set, the above method, `RebuildCategorisedList`, creates a list of `ContentControl`s which the `JumpList` exposes via the `FlattenedCategories` property. All we have to do now to add them to the visual tree of our `JumpList` is add an `ItemsControl` to the template, binding it to the `FlattenedCategories` property via a `RelativeSource`-`TemplatedParent` binding.

~~~xml
<Style TargetType="local:JumpList">
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="local:JumpList">
        <Border Background="{TemplateBinding Background}"
                          BorderBrush="{TemplateBinding BorderBrush}"
                          BorderThickness="{TemplateBinding BorderThickness}">
          <ItemsControl x:Name="JumpListItems"
                    ItemsSource="{Binding RelativeSource={RelativeSource
                                 TemplatedParent},Path=FlattenedCategories}">
            <!-- use a virtualizing stack panel to host our items -->
            <ItemsControl.ItemsPanel>
              <ItemsPanelTemplate>
                <VirtualizingStackPanel/>
              </ItemsPanelTemplate>
            </ItemsControl.ItemsPanel>

            <!-- template, which adds a scroll viewer -->
            <ItemsControl.Template>
              <ControlTemplate TargetType="ItemsControl">
                <ScrollViewer x:Name="ScrollViewer">
                  <ItemsPresenter/>
                </ScrollViewer>
              </ControlTemplate>
            </ItemsControl.Template>
          </ItemsControl>

        </Border>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
~~~

Our control is now able to render a collection of items, for example, if a `JumpList` is instantiated with the following template, where the `ItemsSource` is a collection of `Person` objects (with properties of `Surname` and `Forename`):

~~~xml
<local:JumpList>
  <local:JumpList.ItemTemplate>
    <DataTemplate>
      <StackPanel Orientation="Horizontal"
                  Margin="0,3,0,3"
                  Height="40">
        <TextBlock Text="{Binding Surname}"
                    Margin="3,0,0,0"
                    VerticalAlignment="Center"
                  FontSize="{StaticResource PhoneFontSizeLarge}"/>
        <TextBlock Text=", "
                    VerticalAlignment="Center"
                  FontSize="{StaticResource PhoneFontSizeLarge}"/>
        <TextBlock Text="{Binding Forename}"
                    VerticalAlignment="Center"
                  FontSize="{StaticResource PhoneFontSizeLarge}"/>
      </StackPanel>
    </DataTemplate>
  </local:JumpList.ItemTemplate>
</local:JumpList>
~~~

The `JumpList` would render as follows:

![control2.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/control2.png)

### Handling CollectionChanged events

The `ItemsSource` property is of type `IEnumerable`, which is the only requirement we have on the supplied data in order to render it. This gives the user great flexibility; they can supply a `List`, `Array`, or assign the `ItemsSource` directly to the result of a LINQ query. However, they may also set (or bind) this property to an `ObservableCollection`, with the expectation that the `JumpList` is updated when they add or remove items from the list. In order to support this requirement, we need to 'probe' the `ItemsSource` to see if it implements `INotifyCollectionChanged` (the interface that makes `ObservableCollection` work), and update our list accordingly:

~~~csharp
// invoked when the ItemsSource dependency property changes
partial void OnItemsSourcePropertyChanged(DependencyPropertyChangedEventArgs e)
{
  INotifyCollectionChanged oldIncc = e.OldValue as INotifyCollectionChanged;
  if (oldIncc != null)
  {
    oldIncc.CollectionChanged -= ItemsSource_CollectionChanged;
  }
  INotifyCollectionChanged incc = e.NewValue as INotifyCollectionChanged;
  if (incc != null)
  {
    incc.CollectionChanged += ItemsSource_CollectionChanged;
  }
  RebuildCategorisedList();
}

// handles collection changed events, rebuilding the list
private void ItemsSource_CollectionChanged(object sender,
                         NotifyCollectionChangedEventArgs e)
{
  RebuildCategorisedList();
}
~~~

Note that the above code could be optimized to inspect the `NotifyCollectionChangedEventArgs.Action` parameter, modifying our exposed list, rather than completely rebuilding it where appropriate.

### Adding categories

So far the control simply renders the list of items, doing nothing more than an `ItemsControl` would. In order to make this into a jump list, we need to assign items to categories. In order to provide flexibility regarding how items are assigned to categories, we give the user of the control this responsibility via the `ICategoryProvider` interface:

~~~csharp
/// <summary>
/// A category provider assigns items to categories and details
/// the full category list for a set of items.
/// </summary>
public interface ICategoryProvider
{
  /// <summary>
  /// Gets the category for the given items
  /// </summary>
  object GetCategoryForItem(object item);
  /// <summary>
  /// Gets the full list of categories for the given items.
  /// </summary>
  List<object> GetCategoryList(IEnumerable items);
}
~~~

Adding a dependency property to our control:

~~~csharp
...
[DependencyPropertyDecl("CategoryProvider", typeof(ICategoryProvider), null,
    "Gets or sets a category provider which groups the items " +
    "in the JumpList and specifies the categories in the jump menu")]
public partial class JumpList : Control, INotifyPropertyChanged
{
  ...
}
~~~

A category provider is responsible for assigning each object within the list to a category, and also for providing a list of all the categories. The list of categories might depend on the list being rendered, e.g., the dates of events, or it might be some fixed list, e.g., letters of the alphabet. The following shows an implementation of this interface which assigns items to categories based on the first letter of a named property, `PropertyName`. The category list is the complete alphabet, in order:

~~~csharp
/// <summary>
/// A category provider that categorizes items
/// based on the first character of the
/// property named via the PropertyName property.
/// </summary>
public class AlphabetCategoryProvider : ICategoryProvider
{
  /// <summary>
  /// Gets or sets the name of the property that is used to assign each item
  /// to a category.
  /// </summary>
  public string PropertyName { get; set;}
  public object GetCategoryForItem(object item)
  {
    var propInfo = item.GetType().GetProperty(PropertyName);
    object propertyValue = propInfo.GetValue(item, null);
    return ((string)propertyValue).Substring(0, 1).ToUpper();
  }
  public List<object> GetCategoryList(IEnumerable items)
  {
    return Enumerable.Range(0, 26)
            .Select(index => Convert.ToChar(
                   (Convert.ToInt32('A') + index)).ToString())
            .Cast<object>()
            .ToList();
  }
}
~~~

Here you can see that the category list is always the full alphabet and does not depend on the items that are currently rendered by the `JumpList`. The user of the control can simply set the `CategoryProvider` to an instance of the provider above. For example, if the control is being used to render `Person` objects (which have properties of `Surname` and `Forename`), the XAML for the `JumpList` would be as follows:

~~~xml
<local:JumpList>
  <local:JumpList.CategoryProvider>
    <local:AlphabetCategoryProvider PropertyName="Surname"/>
  </local:JumpList.CategoryProvider>
</local:JumpList>
~~~

The `RebuildCategorisedList` method described above which creates a list of `ContentControl`s, one for each item in the list, can now be updated to add the category headings (i.e., the jump-buttons). We want the user of the `JumpList` to be able to style these jump buttons, so some further dependency properties are added:

~~~csharp
...
[DependencyPropertyDecl("JumpButtonItemTemplate", typeof(DataTemplate), null,
  "Gets or sets the DataTemplate used to display the Jump buttons. " +
  "The DataContext of each button is a group key")]
DependencyPropertyDecl("JumpButtonTemplate", typeof(ControlTemplate), null,
  "Gets or sets the ControlTemplate for the Jump buttons")]
[DependencyPropertyDecl("JumpButtonStyle", typeof(Style), null,
  "Gets or sets the style applied to the Jump buttons. " +
  "This should be a style with a TargetType of Button")]
public class JumpList : Control
{
  ...
}
~~~

These three properties give the user complete control over how the buttons are rendered; if they want to simply set the width, height, or some other basic property, they can set the `JumpButtonStyle`; if they want to change the template, or add an icon for example, they can set the `JumpButtonTemplate`; finally, they can specify how the 'object' that represents each item's category is rendered via the `JumpButtonItemTemplate`, this allows them to format a date, for example.

The `RebuildCategorisedList` is expanded to group the items based on the category provider via a simple LINQ query. Buttons are added to the collection of objects exposed to the `ItemsControl` within the `JumpList` template:

~~~csharp
private void RebuildCategorisedList()
{
  if (ItemsSource == null)
    return;

  // adds each item into a category
  var categorisedItemsSource = ItemsSource.Cast<object>()
              .GroupBy(i => CategoryProvider.GetCategoryForItem(i))
              .OrderBy(g => g.Key)
              .ToList();

  // create the jump list
  var jumpListItems = new List<object>();
  foreach (var category in categorisedItemsSource)
  {
    jumpListItems.Add(new Button()
    {
      Content = category.Key,
      ContentTemplate = JumpButtonItemTemplate,
      Template = JumpButtonTemplate,
      Style = JumpButtonStyle
    });
    jumpListItems.AddRange(category.Select(item =>
      new ContentControl()
      {
        Content = item,
        ContentTemplate = ItemTemplate
      }).Cast<object>());
  }
  // add interaction handlers
  foreach (var button in jumpListItems.OfType<Button>())
  {
    button.Click += JumpButton_Click;
  }
}
private void JumpButton_Click(object sender, RoutedEventArgs e)
{
  IsCategoryViewShown = true;
}
~~~

Note that a `Button.Click` event handler is added to each of the buttons that are created - more on this later!

We can set the default values for the three jump-button properties by adding property setters to the `JumpList` default style (in the *generic.xaml* file):

~~~xml
<Style TargetType="l:JumpList">
  <!-- style the buttons to be left aligned with some padding -->
  <Setter Property="JumpButtonStyle">
    <Setter.Value>
      <Style TargetType="Button">
        <Setter Property="HorizontalAlignment" Value="Left"/>
        <Setter Property="HorizontalContentAlignment" Value="Stretch"/>
        <Setter Property="VerticalContentAlignment" Value="Stretch"/>
        <Setter Property="Padding" Value="8"/>
      </Style>
    </Setter.Value>
  </Setter>
  <!-- an item template that simply displays the category 'object' -->
  <Setter Property="JumpButtonItemTemplate">
    <Setter.Value>
      <DataTemplate>
        <TextBlock Text="{Binding}"
                  FontSize="{StaticResource PhoneFontSizeMedium}"
                  Padding="5"
                  VerticalAlignment="Bottom"
                  HorizontalAlignment="Left"/>
      </DataTemplate>
    </Setter.Value>
  </Setter>
  <!-- the template for our button, a simplified version of the standard button -->
  <Setter Property="JumpButtonTemplate">
    <Setter.Value>
      <ControlTemplate>
        <Grid Background="Transparent">
          <VisualStateManager.VisualStateGroups>
            <VisualStateGroup x:Name="CommonStates">
              <VisualState x:Name="Normal"/>
              <VisualState x:Name="MouseOver"/>
              <VisualState x:Name="Pressed">
                <Storyboard>
                  <ColorAnimation To="White" Duration="0:0:0"
                      Storyboard.TargetName="Background"
                      Storyboard.TargetProperty=
                        "(Rectangle.Fill).(SolidColorBrush.Color)"/>
                </Storyboard>
              </VisualState>
              <VisualState x:Name="Disabled"/>
            </VisualStateGroup>
          </VisualStateManager.VisualStateGroups>
          <Rectangle  x:Name="Background"
                            Fill="{StaticResource PhoneAccentBrush}"/>
          <ContentControl x:Name="ContentContainer"
              Foreground="{TemplateBinding Foreground}"
              HorizontalContentAlignment="{TemplateBinding HorizontalContentAlignment}"
              VerticalContentAlignment="{TemplateBinding VerticalContentAlignment}"
              Padding="{TemplateBinding Padding}"
              Content="{TemplateBinding Content}"
              ContentTemplate="{TemplateBinding ContentTemplate}"/>
        </Grid>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
  ...
</Style>
~~~

As you can see from the above XAML, the `JumpButtonStyle` and `JumpButtonItemTemplate` property values are quite simple. The `JumpButtonTemplate` is a little more complex; here we are defining the template used to render our buttons. Rather than using the default button template, which is black with a white border, the jump buttons are templated to be a solid rectangle filled with the phone's accent colour (a user-specified colour which is used for live tiles etc...). The `VisualStateManager` markup has a single `VisualState` defined which makes the button turn white when it is pressed.

The control is now starting to look like a jump list ...

![control3.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/control3.png)

### The Category view

When a user clicks on a jump button, we want to display a menu which allows them to jump to a specific category. In order to achieve this, we need to create another 'view' of our data which is hidden, revealing it when a button is clicked.

We can expand the method which builds our categorized list of items and jump buttons to expose a list of categories:

~~~csharp
private void RebuildCategorisedList()
{
  // adds each item into a category
  var categorisedItemsSource = ItemsSource.Cast<object>()
                                  .GroupBy(i => CategoryProvider.GetCategoryForItem(i))
                                  .OrderBy(g => g.Key)
                                  .ToList();
  // ... jump list creation code as per above ...
  // creates the category view, where the active state is determined by whether
  // there are any items in the category
  CategoryList = CategoryProvider.GetCategoryList(ItemsSource)
                                  .Select(category => new Button()
                                  {
                                    Content = category,
                                    IsEnabled = categorisedItemsSource.Any(
                                      categoryItems => categoryItems.Key.Equals(category)),
                                    ContentTemplate = this.CategoryButtonItemTemplate,
                                    Style = this.CategoryButtonStyle,
                                    Template = this.CategoryButtonTemplate
                                  }).Cast<object>().ToList();
  foreach (var button in CategoryList.OfType<Button>())
  {
    button.Click += CategoryButton_Click;
  }
}
~~~

The above code creates a list of buttons, one for each category. The enabled state of each button is determined by whether there are any items within this category in the user-supplied list. Again, we allow the user to specify how the button is rendered via the template, style, and item-template properties.

The following markup is added to the template, binding an items control to a `CategoryList` property, using the same technique as the items control which renders the jump list:

~~~xml
<ItemsControl x:Name="CategoryItems"
              Visibility="Collapsed"
              ItemsSource="{Binding RelativeSource= {RelativeSource
                           TemplatedParent}, Path=CategoryList}">
  <ItemsControl.ItemsPanel>
    <ItemsPanelTemplate>
      <tk:WrapPanel Background="Transparent"/>
    </ItemsPanelTemplate>
  </ItemsControl.ItemsPanel>
  <ItemsControl.Template>
    <ControlTemplate>
      <ScrollViewer x:Name="ScrollViewer">
        <ItemsPresenter/>
      </ScrollViewer>
    </ControlTemplate>
  </ItemsControl.Template>
</ItemsControl>
~~~

The style, item-template, and template for the category buttons are similar to those of the jump buttons; however, the category button adds extra styling for the Disabled state, rendering the button in a dark gray colour. The above markup arranges the buttons using the Silverlight Toolkit `WrapPanel`, which gives the following result:

![control4.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/control4.png)

### Switching views

The control now has two different 'views', one which is the categorized list of items together with jump-buttons, and the other, the category view. All we have to do is handle the `Click` event on the jump-buttons to show the category view. For greater flexibility, this behavior is exposed via a `bool IsCategoryViewShown` property. When a jump-button is clicked, this property is set to `true`, and the change handler for the property takes care of switching the view. This provides greater flexibility to the user of the control, allowing them to switch views programmatically.

In order to show / hide the category views and list views that are defined in the `JumpList` template, we need to obtain references to them. With `UserControl`, elements named with the `x:Name` attribute are automatically wired-up to fields in the corresponding code-behind class. However, with custom controls, you have to do this wire-up yourself. The following code locates the `ItemsControl`s for the jump list and category view:

~~~csharp
private ItemsControl _jumpListControl;
private ItemsControl _categoryItemsControl;
public override void OnApplyTemplate()
{
  base.OnApplyTemplate();
  _jumpListControl = this.GetTemplateChild("JumpListItems") as ItemsControl;
  _categoryItemsControl = this.GetTemplateChild("CategoryItems") as ItemsControl;
}
~~~

Note: the name passed to `GetTemplateChild` matches the `x:Name` for each of these elements.

The code generated for each dependency property adds a call to a partial method which is invoked when the property changes. This allows you to add logic that is executed as a result of the property change. The following method is invoked each time the `IsCategoryViewShown` property is changed, it simply shows / hides the items control:

~~~csharp
partial void OnIsCategoryViewShownPropertyChanged(DependencyPropertyChangedEventArgs e)
{
  if ((bool)e.NewValue == true)
  {
    _jumpListControl.Visibility = Visibility.Collapsed;
    _categoryItemsControl.Visibility = Visibility.Visible;
  }
  else
  {
    _jumpListControl.Visibility = Visibility.Visible;
    _categoryItemsControl.Visibility = Visibility.Collapsed;
  }
}
~~~

### Making the jump

We have already seen that the method `RebuildCategorisedList` adds a `Click` event handler to the category buttons. We now need to add the code which makes the list 'jump' to the required location. The `ItemsControl` which renders our list of categorized items uses a `VirtualizingStackPanel` as the container for the items, and places this within a `ScrollViewer`. The `VirtualizingStackPanel` has a method `SetVerticalOffset` which can be used to scroll it to a specific index, allowing us to make the list jump.

The first thing we need to do is locate the `VirtualizingStackPanel`. Unlike the other named elements in our template, this element cannot be retrieved by `GetTemplateChild` within `OnApplyTemplate` because it is in a different XAML namespace (also, it may not be created initially, if the `ItemsControl` does not have any items to render). In order to locate the `VirtualizingStackPanel` when we need it, we can use [LINQ-to-VisualTree](http://www.scottlogic.co.uk/blog/colin/2010/03/linq-to-visual-tree/) to query the descendant elements of our `ItemsControl` to locate the element of the required type:

~~~csharp
 /// <summary>
/// Gets the stack panel that hosts our jump list items
/// </summary>
private VirtualizingStackPanel ItemsHostStackPanel
{
  get
  {
    if (_stackPanel == null)
    {
      _stackPanel = _jumpListControl.Descendants<VirtualizingStackPanel>()
                                  .Cast<VirtualizingStackPanel>()
                                  .SingleOrDefault();
    }
    return _stackPanel;
  }
}
~~~

When a category button is clicked, we find the corresponding jump-button (both have the same `Content`, i.e., the category returned by the `ICategoryProvider`). Once the corresponding button is found, we can find its index, offset the `VirtualizingStackPanel`, then switch back to the jump-list view:

~~~csharp
private void CategoryButton_Click(object sender, RoutedEventArgs e)
{
  var categoryButton = sender as Button;
  // find the jump button for this category
  var button = FlattenedCategories.OfType<Button>()
                                  .Where(b => b.Content.Equals(categoryButton.Content))
                                  .SingleOrDefault();
  // button is null if there are no items in the clicked category
  if (button != null)
  {
    // find the button index
    var index = FlattenedCategories.IndexOf(button);
    ItemsHostStackPanel.SetVerticalOffset(index);

    IsCategoryViewShown = false;
  }
}
~~~

We now have a fully functioning `JumpList` control!

## Jazzing it up!

The control we have developed so far works well; however, it is lacking in flare (we don't want our iPhone and Android friends to think theirs is a better platform, do we?). We could spice up the graphics, adding drop shadows, gradients, images etc... however, that is not really in keeping with the Windows Phone 7 Metro theme which favours clear typography and sparse graphics coupled with fluid animations. In this section, we will look at how to make this control more visually appealing via animations, whilst maintaining its clean and simple style.

### Simple Show / Hide animations

When the jump list control switches between the category and list views, the following code simply shows / hides the respective items controls for each of these views:

~~~csharp
partial void OnIsCategoryViewShownPropertyChanged(DependencyPropertyChangedEventArgs e)
{
  if ((bool)e.NewValue == true)
  {
    _jumpListControl.Visibility = Visibility.Collapsed;
    _categoryItemsControl.Visibility = Visibility.Visible;
  }
  else
  {
    _jumpListControl.Visibility = Visibility.Visible;
    _categoryItemsControl.Visibility = Visibility.Collapsed;
  }
}
~~~

It would be nice if we could use a fade or some other transition effect to switch between these two views. A while back, I [wrote a blog post](http://www.scottlogic.co.uk/blog/colin/2009/09/helpful-extension-methods-for-show-hide-animations-in-silverlight/) which presented a couple of simple `FrameworkElement` extension methods, `Show()` and `Hide()`, which inspect the element resources to find a storyboard which can be used to show or hide the element. If no storyboard is present, the `Visibility` property is set instead. Applying this method, the above code becomes:

~~~csharp
partial void OnIsCategoryViewShownPropertyChanged(DependencyPropertyChangedEventArgs e)
{
  if ((bool)e.NewValue == true)
  {
    _jumpListControl.Hide();
    _categoryItemsControl.Show();
  }
  else
  {
    _jumpListControl.Show();
    _categoryItemsControl.Hide();
  }
}
~~~

Here is the updated XAML for the `ItemsControl` which renders the jump list, to include storyboards which alter the control's opacity in order to provide a fade-in / fade-out effect:

~~~xml
<l:JumpListItemsControl x:Name="JumpListItems"
              ItemsSource="{Binding RelativeSource={RelativeSource
                           TemplatedParent}, Path=FlattenedCategories}">
  <l:JumpListItemsControl.Resources>
    <Storyboard x:Key="JumpListItemsShowAnim">
      <DoubleAnimation To="1.0" Duration="0:0:0.5"
            Storyboard.TargetName="JumpListItems"
            Storyboard.TargetProperty="(ScrollViewer.Opacity)"/>
    </Storyboard>
    <Storyboard x:Key="JumpListItemsHideAnim">
      <DoubleAnimation To="0.35" Duration="0:0:0.5"
            Storyboard.TargetName="JumpListItems"
            Storyboard.TargetProperty="(ScrollViewer.Opacity)"/>
    </Storyboard>
  </l:JumpListItemsControl.Resources>
  <l:JumpListItemsControl.ItemsPanel>
    <ItemsPanelTemplate>
      <VirtualizingStackPanel/>
    </ItemsPanelTemplate>
  </l:JumpListItemsControl.ItemsPanel>
  <l:JumpListItemsControl.Template>
    <ControlTemplate TargetType="l:JumpListItemsControl">
      <ScrollViewer x:Name="ScrollViewer">
        <ItemsPresenter/>
      </ScrollViewer>
    </ControlTemplate>
  </l:JumpListItemsControl.Template>
</l:JumpListItemsControl>
~~~

For details of the `Show()` / `Hide()` extension methods, please refer to my [earlier blog post](http://www.scottlogic.co.uk/blog/colin/2009/09/helpful-extension-methods-for-show-hide-animations-in-silverlight/).

### Adding a Loading indicator

If you have only developed Windows Phone 7 applications using the emulator, you will probably have some false impressions regarding your application's responsiveness. The real Windows Phone 7 hardware is typically much less powerful than the emulated hardware on your whizzy developer machine! I made a few measurements and found that my developer machine emulator rendered each page approximately [four times faster than a real device](http://www.scottlogic.co.uk/blog/colin/2011/02/windows-phone-7-performance-measurements-emulator-vs-hardware/). However, results will of course vary from one machine to the next. The real take-home message here is, "test on the real hardware". This section describes a few simple changes to the jump list which should ensure a rapid initial render time.

If the category view `ItemsControl` is shown by animating its opacity from 0 to 1.0, then all the visual elements of the category view will be rendered when the jump list is first displayed, even though the user cannot see the category view. This can add as much as half a second to the overall load time of the control. If the visibility of the `ItemsControl` is initially set to `Collapsed` (in *generic.xaml*), then the overhead of the numerous child elements it contains will be removed. However, this still does not remove the half-second additional render time for the category view, it just postpones it until later on. We do not want the jump list to simply 'stall' the first time a button is clicked, therefore a small loading indicator is added so that the user knows that the phone is doing something ...

When a category button is clicked, we initially show a simple loading message, then set the category view visibility to `Visible`, causing the expensive initial construction of this view. When the category view and its child elements are created, a `LayoutUpdated` event will fire; we can handle this event in order to hide the loading indicator.

This simple loading indicator is added to the jump list template:

~~~xml
<Grid IsHitTestVisible="False"
      x:Name="LoadingIndicator"
      Opacity="0">
  <TextBlock Text="Loading ..."
              HorizontalAlignment="Right"/>
</Grid>
~~~

The code which handles the `IsCategoryViewShown` property changed is updated to show this loading indicator the first time the category view is shown. The next time it is shown, we do not need the loading indicator because the category view UI is already built and has just been hidden by setting its opacity to zero.

~~~csharp
partial void OnIsCategoryViewShownPropertyChanged(DependencyPropertyChangedEventArgs e)
{
  if ((bool)e.NewValue == true)
  {
    _jumpListControl.Hide();
    // first time load!
    if (_categoryItemsControl.Visibility == Visibility.Collapsed)
    {
      // show the loading indicator
      _loadingIndicator.Opacity = 1;

      Dispatcher.BeginInvoke(() =>
      {
        // handle layout updated
        _categoryItemsControl.LayoutUpdated +=
           new EventHandler(CategoryItemsControl_LayoutUpdated);
        // make the items control visible so that its UI is built
        _categoryItemsControl.Visibility = Visibility.Visible;
      });
    }
    else
    {
      _jumpListControl.IsHitTestVisible = false;
      _categoryItemsControl.IsHitTestVisible = true;
      _categoryItemsControl.Show();
    }
  }
  else
  {
    _jumpListControl.Show();
    _jumpListControl.IsHitTestVisible = true;
    _categoryItemsControl.IsHitTestVisible = false;
    _categoryItemsControl.Hide();
  }
}
/// <summary>
/// Handles LayoutUpdated event in order to hide the loading indicator
/// </summary>
private void CategoryItemsControl_LayoutUpdated(object sender, EventArgs e)
{
  _categoryItemsControl.LayoutUpdated -= CategoryItemsControl_LayoutUpdated;
  _loadingIndicator.Visibility = System.Windows.Visibility.Collapsed;
  Dispatcher.BeginInvoke(() =>
  {
    // play the 'show' animation
    _categoryItemsControl.Show();
  });
}
~~~

I have refined the above into a more general approach to deferring the rendering of some UI elements, creating a `DeferredLoadContentControl` which initially displays a 'loading...' message whilst the more complex content is constructed. You can read about this control on my blog.

### Animating the 'jump'

The jump list control described so far sets the vertical offset of our list directly so that the jump button which heads each category is immediately brought into view. In this section, we will look at how to animate this, so that the selected category scrolls smoothly into view.

The vertical offset of our list is changed via the following code:

~~~csharp
ItemsHostStackPanel.SetVerticalOffset(index);
~~~

Unfortunately, the vertical offset is not exposed as a dependency property, so we cannot animate it directly via a storyboard. A simple solution to this problem is to add a private dependency property to our jump list control which we can animate. We can then handle the property changed callback for this dependency property in order to set the vertical offset as above.

Here's the private dependency property, with the callback that sets the vertical offset:

~~~csharp
/// <summary>
/// VerticalOffset, a private DP used to animate the scrollviewer
/// </summary>
private DependencyProperty VerticalOffsetProperty =
  DependencyProperty.Register("VerticalOffset", typeof(double),
  typeof(JumpList), new PropertyMetadata(0.0, OnVerticalOffsetChanged));

private static void OnVerticalOffsetChanged(DependencyObject d,
                    DependencyPropertyChangedEventArgs e)
{
  JumpList jumpList = d as JumpList;
  jumpList.OnVerticalOffsetChanged(e);
}
private void OnVerticalOffsetChanged(DependencyPropertyChangedEventArgs e)
{
  ItemsHostStackPanel.SetVerticalOffset((double)e.NewValue);
}
~~~

We can then create a suitable storyboard in the constructor of the jump list control. Here, a simple `DoubleAnimation` which uses a Sine easing function, which accelerates at the start and decelerates at the end (providing a smoother experience), is created:

~~~csharp
public JumpList()
{
  DefaultStyleKey = typeof(JumpList);
  RebuildCategorisedList();
  // create a scroll animation
  _scrollAnimation = new DoubleAnimation();
  _scrollAnimation.EasingFunction = new SineEase();
  // create a storyboard for the animation
  _scrollStoryboard = new Storyboard();
  _scrollStoryboard.Children.Add(_scrollAnimation);
  Storyboard.SetTarget(_scrollAnimation, this);
  Storyboard.SetTargetProperty(_scrollAnimation, new PropertyPath("VerticalOffset"));
  // Make the Storyboard a resource.
  Resources.Add("anim", _scrollStoryboard);
}
~~~

We can make this functionality more flexible by adding a `ScrollDuration` dependency property to the `JumpList` control. All that is left to do is use the above animation when the category button is clicked:

~~~csharp
private void CategoryButton_Click(object sender, RoutedEventArgs e)
{
  var categoryButton = sender as Button;
  // find the jump button for this category
  var button = FlattenedCategories.OfType<Button>()
                                  .Where(b => b.Content.Equals(categoryButton.Content))
                                  .SingleOrDefault();
  // button is null if there are no items in the clicked category
  if (button != null)
  {
    // find the button index
    var index = FlattenedCategories.IndexOf(button);
    if (ScrollDuration > 0.0)
    {
      _scrollAnimation.Duration = TimeSpan.FromMilliseconds(ScrollDuration);
      _scrollStoryboard.Duration = TimeSpan.FromMilliseconds(ScrollDuration);
      _scrollAnimation.To = (double)index;
      _scrollAnimation.From = ItemsHostStackPanel.ScrollOwner.VerticalOffset;
      _scrollStoryboard.Begin();
    }
    else
    {
      ItemsHostStackPanel.SetVerticalOffset(index);
    }
    IsCategoryViewShown = false;
  }
}
~~~

### Animating the category button 'tiles'

The switch from the jump list to the category view is now a bit more interesting, with a fade-effect applied (which can be replaced by some other effect if you re-template the control). However, it would be much more exciting if each of the category buttons were animated into view, in much the same way that the tiles on the Windows Phone 7 hub are animated.

To support this, the category button template is extended, adding storyboards for showing and hiding the category buttons, in much the same was as the `Show()` / `Hide()` extension methods described above. In the example below, a storyboard is defined that shows the category button by scaling and rotating the tile, with the reverse being used to hide it:

~~~xml
<Setter Property="CategoryButtonTemplate">
  <Setter.Value>
    <ControlTemplate TargetType="Button">
      <Grid Background="Transparent"
            x:Name="Parent"
            RenderTransformOrigin="0.5,0.5">
        <Grid.Resources>
          <Storyboard x:Key="ShowAnim">
            <DoubleAnimation To="0" Duration="0:0:0.2"
                 Storyboard.TargetName="Parent"
                 Storyboard.TargetProperty="(UIElement.RenderTransform).(
                    TransformGroup.Children)[0].(RotateTransform.Angle)"/>
            <DoubleAnimation To="1" Duration="0:0:0.2"
                  Storyboard.TargetName="Parent"
                  Storyboard.TargetProperty="(UIElement.RenderTransform).(
                    TransformGroup.Children)[1].(ScaleTransform.ScaleX)"/>
            <DoubleAnimation To="1" Duration="0:0:0.2"
                  Storyboard.TargetName="Parent"
                  Storyboard.TargetProperty="(UIElement.RenderTransform).(
                    TransformGroup.Children)[1].(ScaleTransform.ScaleY)"/>
          </Storyboard>
          <Storyboard x:Key="HideAnim">
            <DoubleAnimation To="120" Duration="0:0:0.2"
                  Storyboard.TargetName="Parent"
                  Storyboard.TargetProperty="(UIElement.RenderTransform).(
                    TransformGroup.Children)[0].(RotateTransform.Angle)"/>
            <DoubleAnimation To="0" Duration="0:0:0.2"
                  Storyboard.TargetName="Parent"
                  Storyboard.TargetProperty="(UIElement.RenderTransform).(
                    TransformGroup.Children)[1].(ScaleTransform.ScaleX)"/>
            <DoubleAnimation To="0" Duration="0:0:0.2"
                  Storyboard.TargetName="Parent"
                  Storyboard.TargetProperty="(UIElement.RenderTransform).(
                    TransformGroup.Children)[1].(ScaleTransform.ScaleY)"/>
          </Storyboard>
        </Grid.Resources>
        <Grid.RenderTransform>
          <TransformGroup>
            <RotateTransform Angle="120"/>
            <ScaleTransform ScaleX="0" ScaleY="0"/>
          </TransformGroup>
        </Grid.RenderTransform>
        ... category button template here ...
      </Grid>
    </ControlTemplate>
  </Setter.Value>
</Setter>
~~~

In order to play the above animation to reveal the tiles, we have to locate the storyboards that will be created for each tile. In order to make the 'reveal' effect more interesting, the following code 'prepares' each of the category tile storyboards by setting their `BeginTime` property based on the desired delay between the animations for neighboring tiles firing:

~~~csharp
// sets the begin time for each animation
private static void PrepareCategoryViewStoryboards(ItemsControl itemsControl,
                    TimeSpan delayBetweenElement)
{
  TimeSpan startTime = new TimeSpan(0);
  var elements = itemsControl.ItemsSource.Cast<FrameworkElement>().ToList();
  foreach (FrameworkElement element in elements)
  {
    var showStoryboard = GetStoryboardFromRootElement(element, "ShowAnim");
    if (showStoryboard != null)
    {
      showStoryboard.BeginTime = startTime;
    }
    var hideStoryboard = GetStoryboardFromRootElement(element, "HideAnim");
    if (hideStoryboard != null)
    {
      hideStoryboard.BeginTime = startTime;
      if (element == elements.Last())
      {
        // when the last animation is complete, hide the ItemsControl
        hideStoryboard.Completed += (s, e) =>
        {
          itemsControl.Opacity = 0;
        };
      }
    }
    startTime = startTime.Add(delayBetweenElement);
  }
}
private static Storyboard GetStoryboardFromRootElement(
               FrameworkElement element, string storyboardName)
{
  FrameworkElement rootElement = element.Elements().Cast<FrameworkElement>().First();
  return rootElement.Resources[storyboardName] as Storyboard;
}
~~~

In order to reveal the category view, we simply iterate over all the tiles, firing the animations:

~~~csharp
// plays the animations associated with each child element
public static void ShowChildElements(ItemsControl itemsControl,
                                     TimeSpan delayBetweenElement)
{
  itemsControl.Opacity = 1;
  PrepareCategoryViewStoryboards(itemsControl, delayBetweenElement);
  foreach (FrameworkElement element in itemsControl.ItemsSource)
  {
    var showStoryboard = GetStoryboardFromRootElement(element, "ShowAnim");
    if (showStoryboard != null)
    {
      showStoryboard.Begin();
    }
    else
    {
      element.Visibility = Visibility.Visible;
    }
  }
}
~~~

This gives the control a much more interesting transition between the two views:

![JumpListAnimation.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/JumpListAnimation_60b03f.png)

Note that the way this category view animation has been introduced means that the client of the control can change the animation by simply providing an alternative `CategoryButtonTemplate`.

## Summary

This brings us pretty much to the end of this article. I hope your have enjoyed reading about the development of this control. If you use it in your Windows Phone 7 application, please let me know by leaving a comment below. Also, as mentioned earlier, if you want to read a user-guide or see some more practical examples of this control, please [visit my blog](http://www.scottlogic.co.uk/blog/colin/2011/01/a-windows-phone-7-jump-list-control/).
