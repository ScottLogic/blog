---
title: A WPF Pie Chart with Data Binding Support
date: 2008-07-25 00:00:00 Z
categories:
- Tech
tags:
- wpf
author: ceberhardt
layout: default_post
source: codeproject
summary: This article describes the development of a WPF pie chart control that fully supports data binding, allowing it to bind directly to your data objects rather than requiring a separate model. Along the way it covers custom shapes, dependency property inheritance, and the nuances of tooltips and data binding in WPF.
---

*This article was originally published on CodeProject, which has since shut down.*

![leadimage.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/leadimage3.jpg)

## Introduction

The Windows Presentation Framework provides developers with a toolset for developing visually rich and interactive user interfaces. Charts are a highly effective way of presenting data to a user, with pie charts providing a simple mechanism for comparing the relative magnitudes of different items. WPF does not provide a charting library, and there is no ‘official’ library that can be purchased as an extension. For this reason, there are a number of articles on the Internet which provide simple charting controls.

For pie charts, CodeProject has a [3D pie chart library](http://www.codeproject.com/KB/WPF/Wpf3DGraphingLibrary.aspx), elsewhere you can find a [Silverlight pie chart](http://petermcg.wordpress.com/2008/05/18/silverlight-20-pie-chart/). However, neither of these controls take full advantage of data binding. In each case, the data is presented to the pie chart control as an array of pie data objects (either programmatically, or via XAML). Therefore, in order to visualise your data, you must copy the relevant properties of your data objects into the ‘pie data objects’. When reviewing these libraries for possible use in a project, it struck me that the way they work reflects how UI frameworks used to work before binding; i.e., the control has a model behind it, and it is your job as the developer to copy your data into this model so that the control (view) can render it. It is, of course, also your job to ensure that changes in the ‘real’ data are copied across to the model that backs your view, effectively keeping the two synchronised. With data binding, shunting data between different incompatible models should be a thing of the past!

This article describes the development of a pie chart user control for WPF that uses data binding. The pie chart is not backed by its own model, rather, it binds directly to your data objects. This has the big advantage that the WPF framework takes care of handling events that relate to changes in the bound data, updating the pie chart view accordingly. Along the way, a few other areas of interest will be covered:

- The peculiarities of Tooltips and data binding
- The use of `FrameworkElement.Tag` as a mechanism for passing data around
- The development of custom shapes
- Dependency Property Inheritance

The code that is associated with this article is not intended to be a complete, fully featured pie charting library. Anyone who has attempted to develop a charting library in the past will know that this is a huge undertaking! Instead, it is meant to be a useful starting point for anyone wishing to add their own custom charts to a project.

## Step one: Our first slice

The flexibility of the WPF graphics API makes constructing a pie piece a relatively straightforward task, with a pie piece being little more than a `Path` consisting of a couple of [`LineSegment`s](http://msdn.microsoft.com/en-us/library/system.windows.media.arcsegment.aspx) and an [`ArcSegment`](http://msdn.microsoft.com/en-us/library/system.windows.media.arcsegment.aspx). It is possible to render a pie chart by programmatically adding suitable paths to our control; however, this approach is a little inflexible. For example, animation within WPF relies on the presence of Dependency Properties. As a result of this, if an attribute of our object is not exposed as a dependency property, it cannot be animated. Ideally, we would like to be able to animate these pie pieces, perhaps smoothly increasing their wedge size, or rotating it around the centre of the pie.

Thankfully, it is a straightforward task to create our own custom shapes, with [Tomer Shamam’s article](http://www.codeproject.com/KB/WPF/wpfarrow.aspx) on CodeProject giving a good introduction. The following code snippet shows how the geometry of our pie piece is defined:

~~~csharp
private void DrawGeometry(StreamGeometryContext context)
{
    Point startPoint = new Point(CentreX, CentreY);

    Point innerArcStartPoint =
      Utils.ComputeCartesianCoordinate(RotationAngle, InnerRadius);
    innerArcStartPoint.Offset(CentreX, CentreY);

    Point innerArcEndPoint =
      Utils.ComputeCartesianCoordinate(RotationAngle + WedgeAngle, InnerRadius);
    innerArcEndPoint.Offset(CentreX, CentreY);

    Point outerArcStartPoint =
      Utils.ComputeCartesianCoordinate(RotationAngle, Radius);
    outerArcStartPoint.Offset(CentreX, CentreY);

    Point outerArcEndPoint =
      Utils.ComputeCartesianCoordinate(RotationAngle + WedgeAngle, Radius);
    outerArcEndPoint.Offset(CentreX, CentreY);

    bool largeArc = WedgeAngle>180.0;

    Size outerArcSize = new Size(Radius, Radius);
    Size innerArcSize = new Size(InnerRadius, InnerRadius);

    context.BeginFigure(innerArcStartPoint, true, true);
    context.LineTo(outerArcStartPoint, true, true);
    context.ArcTo(outerArcEndPoint, outerArcSize, 0, largeArc,
                  SweepDirection.Clockwise, true, true);
    context.LineTo(innerArcEndPoint, true, true);
    context.ArcTo(innerArcStartPoint, innerArcSize, 0, largeArc,
                  SweepDirection.Counterclockwise, true, true);
}
~~~

The `ComputeCartesianCoordinate` method is a static utility method for converting between [Polar](http://en.wikipedia.org/wiki/Polar_coordinates) and [Cartesian](http://en.wikipedia.org/wiki/Cartesian_coordinate_system) coordinates. The variables, `CentreX`, `CentreY`, `Radius` etc… are all dependency properties. This is pretty much all that is needed to define a custom shape. The WPF `ArcSegment` and the signature of `Geometry.ArcTo()` method can be a little tricky to understand. Fortunately, Charles Petzold has published a very good article describing the [Mathematics of ArcSegment](http://www.charlespetzold.com/blog/2008/01/Mathematics-of-ArcSegment.html) with a number of illustrated examples.

The example below shows the pie piece in action, with the shapes being defined within XAML; however, they can, of course, be added programmatically in the code-behind.

~~~xml
<Window x:Class="WPFPieChart.Window1"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:b="clr-namespace:ScottLogic.Shapes"
    Title="Pie Pieces" Height="200" Width="200">
   <Grid>
        <b:PiePiece CentreX="50" CentreY="80" RotationAngle="45" WedgeAngle="45"
                    Radius="80" InnerRadius="20" Fill="Beige" Stroke="Black"/>
        <b:PiePiece CentreX="50" CentreY="80" RotationAngle="95" WedgeAngle="15"
                    Radius="90" InnerRadius="40" Fill="Chocolate" Stroke="Black"/>
        <b:PiePiece CentreX="30" CentreY="70" RotationAngle="125" WedgeAngle="40"
                    Radius="80" InnerRadius="0" Fill="DodgerBlue" Stroke="Black"/>
   </Grid>
</Window>
~~~

![piepieces.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/piepieces.jpg)

## Step two: Making a pie

Once we have a pie piece shape, the next job is to assemble the pieces into a pie chart within a user control. I did consider the idea of using an [`ItemsControl`](http://msdn.microsoft.com/en-us/library/system.windows.controls.itemscontrol.aspx) or one of its sub-classes as the basis for this control, supplying it a suitable control layout and item template. The `ItemsControl` has certainly been proven to be very flexible, one of the most notable examples being Beatriz Costa’s [Solar System](http://www.beacosta.com/blog/?p=40) styling. However, this approach hit a dead end when trying to introduce Polar transformations. Unfortunately, it is not possible to sub-class the abstract [`Transform`](http://msdn.microsoft.com/en-us/library/system.windows.media.transform.aspx) base class, due to the presence of internal methods. If someone out there can demonstrate how to modify an `ItemsControl` so that the items it contains are rendered around a circle to produce a pie chart, I would love to hear from them!

In my solution, the pie pieces are assembled into a pie chart within a user control, `PiePlotter`. Because this control uses data binding, we can simply use the `DataContext` property to find the data that is being plotted. A pie chart, unlike a grid (`ListView`) is only able to plot one attribute of our data. For example, we might want to plot attributes of a stock portfolio as a pie chart. The positions (i.e., items) within our portfolio might include attributes such a quantity, market cap, value, etc… With a pie chart, we are only able to plot one of these attributes at a time. For this reason, `PiePlotter` has a dependency property `PlottedProperty` that indicates which attribute of the data should be displayed. This allows us to extract the data which relates to this attribute from each item, as follows:

~~~csharp
private double GetPlottedPropertyValue(object item)
{
    PropertyDescriptorCollection filterPropDesc = TypeDescriptor.GetProperties(item);
    object itemValue = filterPropDesc[PlottedProperty].GetValue(item);
    return (double)itemValue;
}
~~~

In order to render the data as a pie chart, we first obtain the [`CollectionView`](http://msdn.microsoft.com/en-us/library/system.windows.data.collectionview.aspx) from the `DataContext`. The next step is to total the values for the plotted attribute so that we can scale them to fit within a 360° pie chart. Finally, we iterate over the collection, determining the wedge angle of the pie piece that represents it, accumulating the total of all the pie pieces as we assemble the pie chart in a clockwise direction.

~~~csharp
private void ConstructPiePieces()
{
    CollectionView myCollectionView = (CollectionView)
        CollectionViewSource.GetDefaultView(this.DataContext);
    if (myCollectionView == null)
        return;

    double halfWidth = this.Width / 2;
    double innerRadius = halfWidth * HoleSize;

    // compute the total for the property which is being plotted
    double total = 0;
    foreach (Object item in myCollectionView)
    {
        total += GetPlottedPropertyValue(item);
    }

    // add the pie pieces
    canvas.Children.Clear();
    double accumulativeAngle=0;
    foreach (Object item in myCollectionView)
    {
        double wedgeAngle = GetPlottedPropertyValue(item) * 360 / total;

        PiePiece piece = new PiePiece()
        {
            Radius = halfWidth,
            InnerRadius = innerRadius,
            CentreX = halfWidth,
            CentreY = halfWidth,
            WedgeAngle = wedgeAngle,
            RotationAngle = accumulativeAngle,
            Fill = Brushes.Green
        };

        canvas.Children.Insert(0, piece);

        accumulativeAngle += wedgeAngle;
    }
}
~~~

The `PiePlotter` control can now be dropped into a window that has a suitable `DataContext`, with the `PlottedProperty` indicating which attribute of the data to display, as illustrated below:

![bindingpie.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/bindingpie.jpg)

~~~xml
<Window x:Class="WPFPieChart.Window1"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:c="clr-namespace:ScottLogic.Controls.PieChart"
    Title="Pie Chart Databinding" Height="300" Width="300">
   <Grid>
      <c:PiePlotter PlottedProperty="Benchmark" Width="250" Height="250"/>
   </Grid>
</Window>
~~~

## Step three: Binding the pie

The code shown above provides a straightforward method for rendering an attribute of our data as a pie chart. However, if the bound data changes, either due to a change in the property values of one of the items, or if a new item is added/removed to the collection, the pie chart is not updated.

These are two separate problems: changes to the bound items, and changes to the bound collection. We will consider each in turn.

Bound objects must implement the [`INotifyPropertyChanged`](http://msdn.microsoft.com/en-us/library/system.componentmodel.inotifypropertychanged.aspx) interface in order to notify the view that a change has occurred and that this should be reflected in the UI. Because our control binds to a collection, we must iterate over the collection, adding an event listener for each of the bound items. This is performed within a handler for the [`FrameworkElement.DataContextChanged`](http://msdn.microsoft.com/en-us/library/system.windows.frameworkelement.datacontextchanged.aspx) event, as shown below:

~~~csharp
void DataContextChangedHandler(object sender,
              DependencyPropertyChangedEventArgs e)
{
    CollectionView myCollectionView = (CollectionView)
            CollectionViewSource.GetDefaultView(this.DataContext);

    foreach (object item in myCollectionView)
    {
        if (item is INotifyPropertyChanged)
        {
            INotifyPropertyChanged observable = (INotifyPropertyChanged)item;
            observable.PropertyChanged +=
               new PropertyChangedEventHandler(ItemPropertyChanged);
        }
    }
}

private void ItemPropertyChanged(object sender, PropertyChangedEventArgs e)
{
    // if the property which this pie chart
    // represents has changed, re-construct the pie
    if (e.PropertyName.Equals(PlottedProperty))
    {
        ConstructPiePieces();
    }
}
~~~

Whenever a property changes that matches the `PlottedProperty` of this pie chart, the chart is reconstructed. Note, this could be improved a little. Rather than disposing of all the pie pieces and reconstructing the chart from scratch, the dependency properties of the existing pie pieces could be adjusted accordingly, possibly even using an animation.

The above code takes care of property value changes in the bound items, but what about when items are added or removed from the bound collection? To be able to support this, the WPF framework has another interface, [`INotifyCollectionChanged`](http://msdn.microsoft.com/en-us/library/system.collections.specialized.inotifycollectionchanged.aspx), which has a single [`CollectionChanged`](http://msdn.microsoft.com/en-us/library/system.collections.specialized.inotifycollectionchanged.aspx) event which is raised when items are added or removed, or the collection is cleared. In order to accommodate changes in the bound collection, we need to handle this event as follows, with the handler simply reconstructing the pie chart:

~~~csharp
// handle the events that occur when the bound collection changes
if (this.DataContext is INotifyCollectionChanged)
{
    INotifyCollectionChanged observable =
       (INotifyCollectionChanged)this.DataContext;
    observable.CollectionChanged +=
        new NotifyCollectionChangedEventHandler(BoundCollectionChanged);
}
~~~

## Step four: Adding interactivity

So far, the pie chart is flexible in its functionally, but it is a bit plain and lacks interactivity. One useful interactive feature would be to reflect the currently selected item in the bound collection, with an animation that pulls out the currently selected piece.

![pieselectedpiece.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/pieselectedpiece.jpg)

This can be achieved quite simply by handling the [`CollectionView.CurrentChanged`](http://msdn.microsoft.com/en-us/library/system.windows.data.collectionview.currentchanged.aspx) event, animating the respective pie piece:

~~~csharp
void CollectionViewCurrentChanged(object sender, EventArgs e)
{
    CollectionView collectionView = (CollectionView)sender;

    PiePiece piece = piePieces[collectionView.CurrentPosition];

    DoubleAnimation a = new DoubleAnimation();
    a.To = 10;
    a.Duration = new Duration(TimeSpan.FromMilliseconds(200));

    piece.BeginAnimation(PiePiece.PushOutProperty, a);
}
~~~

Note that in order to allow navigation from an index in the collection view to a pie piece, a `List` ‘`piePieces`’ is populated during the construction of the chart. Also, to facilitate navigation in the other direction, from the pie piece to the item in the collection, the item index is stored in the [`Tag`](http://msdn.microsoft.com/en-us/library/system.windows.frameworkelement.tag.aspx) property of `FrameworkElement`. This allows us to add an event handler to each pie piece so that when it is clicked, the item is selected within the bound collection:

~~~csharp
void PiePieceMouseUp(object sender, MouseButtonEventArgs e)
{
    CollectionView collectionView = (CollectionView)
            CollectionViewSource.GetDefaultView(this.DataContext);

    PiePiece piece = sender as PiePiece;

    // select the item which this pie piece represents
    int index = (int)piece.Tag;
    collectionView.MoveCurrentToPosition(index);
}
~~~

## Step five: Tooltip confusion

Tooltips can be used to provide further contextual information. However, simply adding the tooltip to each pie piece does not have the desired effect. The `DataContext` for the pie piece will be inherited from the `PiePlotter` and will be a collection. A `ToolTip` bound to this same `DataContext` will display information relating to the currently selected item, which will not always be the same as the piece that the user mouse-overs to reveal the tooltip. To solve this problem, the [`FrameworkElement.ToolTipOpening`](http://msdn.microsoft.com/en-us/library/system.windows.frameworkelement.tooltipopening.aspx) is handled, allowing us to modify the `DataContext` prior to the rendering of the `Tooltip`:

~~~csharp
void PiePieceToolTipOpening(object sender, ToolTipEventArgs e)
{
    PiePiece piece = (PiePiece)sender;

    CollectionView collectionView = (CollectionView)
            CollectionViewSource.GetDefaultView(this.DataContext);

    // select the item which this pie piece represents
    int index = (int)piece.Tag;

    ToolTip tip = (ToolTip)piece.ToolTip;
    tip.DataContext = collectionView.GetItemAt(index);
}
~~~

Again, the `Tag` property of the pie piece is used to good effect.

With this in place, the `ContentTemplate` of the `Tooltip` can be modified to provide a summary of the data which the pie piece represents. Unfortunately, data binding within a `Tooltip` is not as straightforward as it is for other controls. A `Tooltip` is displayed in a new window; therefore, they do not appear in the logical tree of the parent window, and for this reason, they do not inherit properties. This has been the subject of a number of blog posts which describe how to perform [data binding within tooltips](http://blogs.msdn.com/tom_mathews/archive/2006/11/06/binding-a-tooltip-in-xaml.aspx), and how to make [`ElementName bindings`](http://joshsmithonwpf.wordpress.com/2008/07/22/enable-elementname-bindings-with-elementspy/) work. The upshot of this is that you have to manually obtain the `DataContext` for your `Tooltip`. Thankfully, this is easily achieved using a [`RelativeSource`](http://msdn.microsoft.com/en-us/library/system.windows.data.relativesource.aspx) binding to connect the two `DataContext`s together. `RelativeSource` is a powerful concept which can be used in many interesting and surprising ways, more on this one later. The `Tooltip` `DataTemplate` below illustrates how the percentage that a pie piece represents (which is a dependency property of the pie piece) can be located by setting the `DataContext` of the `TextBlock` to the [`PlacementTarget`](http://msdn.microsoft.com/en-us/library/system.windows.controls.tooltip.placementtarget.aspx) of our `Tooltip`, which is the pie piece which the `Tooltip` is ‘attached’ to. The `Text` property of the `TextBlock` is then bound to the `Percentage` property with a suitable value converter.

~~~xml
<DataTemplate>
    <!--<span class="code-comment"> bind the stack panel datacontext to the tooltip data context --></span>
    <StackPanel Orientation="Horizontal"
            DataContext="{Binding Path=DataContext, RelativeSource={RelativeSource
                          AncestorType={x:Type ToolTip}}}">

        <!--<span class="code-comment"> navigate to the pie piece (which is the placement
             target of the tooltip) and obtain the percentage --></span>
        <TextBlock FontSize="30" FontWeight="Bold" Margin="0,0,5,0"
                DataContext="{Binding Path=PlacementTarget,
                             RelativeSource={RelativeSource AncestorType={x:Type ToolTip}}}"
                Text="{Binding Path=Percentage, Converter={StaticResource
                      formatter}, ConverterParameter='\{0:0%\}'}"/>

        <StackPanel Orientation="Vertical">
            <TextBlock FontWeight="Bold"  Text="{Binding Path=Class}"/>
            <StackPanel Orientation="Horizontal">
                <TextBlock Text="Fund"/>
                <TextBlock Text=": "/>
                <TextBlock Text="{Binding Path=Fund}"/>
            </StackPanel>
            <StackPanel Orientation="Horizontal">
                <TextBlock Text="Benchmark"/>
                <TextBlock Text=": "/>
                <TextBlock Text="{Binding Path=Benchmark}"/>
            </StackPanel>
        </StackPanel>
    </StackPanel>
</DataTemplate>
~~~

A bit of opacity and a drop shadow applied via the control template gives the following:

![pietooltip.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/pietooltip.jpg)

## Step six: I Am Legend

A pie chart is not much use without a legend which indicates the meaning of each pie piece:

![chartwithlegend.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/chartwithlegend3.jpg)

The `Legend` class is another user control, i.e., it is a distinct re-useable unit that is not tightly-coupled with the `PiePlotter` control. This allows for a greater level of flexibility. The layout of the pie chart (which comprises the pie itself plus the legend) can be controlled via XAML, allowing charts with different visual configurations. Both the `Legend` and the `PiePlotter` will share a number of dependency properties, such as `PlottedProperty`. It makes sense to wrap the two controls in another user control which defines the layout:

~~~xml
<UserControl x:Class="ScottLogic.Controls.PieChart.PieChartLayout" ...>
    <Grid>
        <StackPanel Orientation="Horizontal">
            <c:PiePlotter Margin="10" Height="200" Width="200" HoleSize="0.3"/>
            <c:Legend Margin="10" Height="200" Width="200" />
        </StackPanel>
    </Grid>
</UserControl>
~~~

The common dependency properties can be defined on the `PieChartLayout` control which can pass it to the `Legend` and `PiePlotter` via dependency property inheritance. One thing that is worthy of note here is that dependency properties can only participate in inheritance if they are attached properties. This is not immediately obvious, and has caused others [some confusion](http://cebla5.spaces.live.com/?_c11_BlogPart_BlogPart=blogview&_c=BlogPart&partqs=cat%3DWPF).

The `Legend` control itself is not much more than a [`ListBox`](http://msdn.microsoft.com/en-us/library/system.windows.controls.listbox.aspx) with a `DataTemplate` applied to provide the required visual appearance. The title of the `Legend` is obtained from the `PlottedProperty` dependency property via a `RelativeSource` binding:

~~~xml
<TextBlock TextAlignment="Center" Grid.Column="1" FontSize="20" FontWeight="Bold"
        Text="{Binding Path=(c:PieChartLayout.PlottedProperty),
        RelativeSource={RelativeSource AncestorType={x:Type c:Legend}}}"/>
~~~

Because the dependency property is an attached property, the binding path has a slightly different syntax, again another area that [causes confusion](http://www.topxml.com/rbnews/XML/re-75352_Binding-to-an-Attached-Property.aspx)!

The data template for the legend’s listbox is shown below:

~~~xml
<DataTemplate>
    <Grid HorizontalAlignment="Stretch" Margin="3">
        <Grid.Background>
            <SolidColorBrush Color="#EBEBEB"/>
        </Grid.Background>
        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="20"/>
            <ColumnDefinition Width="120"/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Grid.RowDefinitions>
            <RowDefinition/>
        </Grid.RowDefinitions>

        <Rectangle Grid.Column="0" Width="13"
                   Height="13" Tag="{Binding}"
                   Fill="{Binding RelativeSource={RelativeSource Self},
                         Converter={StaticResource colourConverter}}"/>

        <TextBlock Grid.Column="1" Margin="3" Text="{Binding Path=Class}"/>

        <TextBlock Grid.Column="2" Margin="3" Tag="{Binding}"
                   Text="{Binding RelativeSource={RelativeSource Self},
                         Converter={StaticResource legendConverter}}"/>
    </Grid>
</DataTemplate>
~~~

The `Fill` for the rectangle and the `Text` of the second `TextBlock` are derived from a slightly unusual binding. The `TextBlock` displays the value of the property which the pie chart is displaying, as defined by `PlottedProperty`. In other words, the property of the data object which is being bound to is variable.

For the `TextBlock`, it would be nice to be able to specify the binding path value as being derived from the `PlottedProperty` dependency property (via a `RelativeSource` binding, of course!). However, this is not possible, only dependency properties can have bindings. [`Binding.Path`](http://msdn.microsoft.com/en-us/library/system.windows.data.binding.path.aspx) is plain-old CLR property. To side-step this problem, I used a trick inspired, in part, by Mike Hillberg’s blog post about [parameterized templates](http://blogs.msdn.com/mikehillberg/archive/2007/02/01/ParameterizedTemplates.aspx), where he uses the `Button`'s `Tag` property to pass an image URI to a data template.

In order to extract the plotted property value from the item, we need two pieces of information: firstly, the `PlottedProperty` dependency property; secondly, the item itself. Value converters are not part of the visual tree; therefore, we cannot navigate up to the `Legend` control to discover the `PlottedProperty` value. The trick here is to pass the `TextBlock` to the value converter via a `RelativeSource` binding of type [`Self`](http://msdn.microsoft.com/en-us/library/system.windows.data.relativesource.self.aspx), allowing the value converter to navigate the visual tree. The item bound to the `ListBoxItem` is bound to the `Tag` property. Again, this can be picked up within the value converter. The code which performs this is given below:

~~~csharp
public class LegendConverter : IValueConverter
{
    public object Convert(object value, Type targetType,
        object parameter, CultureInfo culture)
    {
        // the item which we are displaying is bound to the Tag property
        TextBlock label = (TextBlock)value;
        object item = label.Tag;

        // find the item container
        DependencyObject container = (DependencyObject)
          Helpers.FindElementOfTypeUp((Visual)value, typeof(ListBoxItem));

        // locate the items control which it belongs to
        ItemsControl owner = ItemsControl.ItemsControlFromItemContainer(container);

        // locate the legend
        Legend legend = (Legend)Helpers.FindElementOfTypeUp(owner, typeof(Legend));

        // extract the ‘plottedproperty’ value from the item
        PropertyDescriptorCollection filterPropDesc = TypeDescriptor.GetProperties(item);
        object itemValue = filterPropDesc[legend.PlottedProperty].GetValue(item);

        return itemValue;
    }

    public object ConvertBack(object value, Type targetType,
        object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
~~~

Helpers is a set of visual tree navigation utilities written by [Andrew Whiddett](http://blogs.msdn.com/karstenj/archive/2006/04/19/579233.aspx). Note also that the navigation is a two step process, first locating the `ListBoxItem` parent, then locating the `ItemsControl` via [`ItemsControlFromItemContainer`](http://msdn.microsoft.com/en-us/library/system.windows.controls.itemscontrol.itemscontrolfromitemcontainer.aspx). This is because the container elements within an `ItemsControl` are not children of the `ItemsControl`.

Josh Smith describes a solution to a similar class of problems in his article on adding “[Virtual Branches](http://www.codeproject.com/KB/WPF/AttachingVirtualBranches.aspx)” to the logical tree, solving the problem of obtaining dependency property values within a validation rule.

## Step seven: A splash of colour

The addition of colour to the pie chart is an interesting problem. An easy solution would be to mandate that the items bound to the control have a property which specifies their colour. However, forcing the data objects to expose specific properties is exactly the thing that we are trying to avoid. Realistically, the colour of an item can depend on one of two things: either the item itself (perhaps derived from one of its properties somehow), or the index of the item within the collection. For this purpose, we define a simple interface with a single method:

~~~csharp
public interface IColorSelector
{
    Brush SelectBrush(object item, int index);
}
~~~

With an `IColorSelector` instance, the `Legend` and `PiePlotter` can obtain the correct `Brush` to use when plotting a pie piece or the colour panel in the legend which it relates to. A very simple implementation, shown below, has an array of brushes which are cycled through to select a colour:

~~~csharp
public class IndexedColourSelector : DependencyObject, IColorSelector
{

    /// <span class="code-SummaryComment"><summary></span>
    /// An array of brushes
    /// <span class="code-SummaryComment"></summary></span>
    public Brush[] Brushes
    {... }

    public Brush SelectBrush(object item, int index)
    {
        if (Brushes == null || Brushes.Length == 0)
        {
            return System.Windows.Media.Brushes.Black;
        }
        return Brushes[index % Brushes.Length];
    }
}
~~~

An instance of the above can be provided to the pie chart through XAML:

~~~xml
<Window >
    <Window.Resources>
        <x:ArrayExtension Type="{x:Type Brush}" x:Key="brushes">
            <SolidColorBrush Color="#9F15C3"/>
            <SolidColorBrush Color="#FF8E01"/>
            <SolidColorBrush Color="#339933"/>
            <SolidColorBrush Color="#00AAFF"/>
            <SolidColorBrush Color="#818183"/>
            <SolidColorBrush Color="#000033"/>
        </x:ArrayExtension>
    </Window.Resources>
    <Grid>
        <c:PieChartLayout PlottedProperty="Fund" Margin="10">
            <c:PieChartLayout.ColorSelector>
                <c:IndexedColourSelector Brushes="{StaticResource brushes}"/>
            </c:PieChartLayout.ColorSelector>
        </c:PieChartLayout>
    </Grid>
</Window>
~~~

## Conclusions

The sample code attached to this article displays the pie chart shown below. The legend, pie chart, list view, and item details are all synchronised via data binding. Clicking on the column headings within the list view will cause the pie chart to plot the selected property of the dataset.

![completedemo3.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/completedemo3.jpg)

Whilst it takes a bit more effort to create a chart which supports data binding, the end result is a much more interactive control and one which is much easier to re-use.
