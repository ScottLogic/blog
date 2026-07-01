---
title: Plotting Circular Relationship Graphs with Silverlight
date: 2012-05-01 00:00:00 Z
categories:
- Tech
tags:
- silverlight
author: ceberhardt
layout: default_post
source: codeproject
summary: Describes the creation of a generic Silverlight control for visualising relationships between nodes as a circular graph, originally developed to plot the relationships between Stack Overflow tags. The article covers graph layout, the Silverlight graphics API, and clustering to reveal natural groupings in connected data.
---

*This article was originally published on CodeProject, which has since shut down.*

## Introduction

I’ve been a big fan of Stack Overflow, ever since I started using the site just over a year ago.
Not only is it a great resource for finding answers to your programming questions – it is also a fascinating insight into the languages, tools and frameworks that
are currently being used by developers. I thought it would be a bit of fun to create a graph which illustrated the popularity of each tag, together with the relationships
it has to other tags and the strength of these relationships.

Making use of the publically available Stack APIs, I downloaded the most recent 1000 questions
and here is the graph I came up with:

![screenshot]({{ site.baseurl }}/ceberhardt/assets/codeproject/screenshot.png)

The graph is constructed as follows:

- The size of each segment is proportional to the number of questions relating to the tag, i.e. android and java are the most popular tags.
- Connections between tags indicate questions that have been tagged with both technologies.
  The thickness of the connection indicates how many questions share these two tags, i.e. jQuery and JavaScript tags appear together quite often.
- Each segment is coloured based on the number of connections it has, red for many connections, blue for few.

Next, I clustered the segments to minimize the length of connections. When clustering is applied we can see small ‘pockets’
of related technologies, with the following patterns emerging

1. The two most popular tags, **Java** and **Android**, are very closely related to each other, but have very few other relationships.
2. **iOS**, **Objective-C** and **iPhone** form a close-knit group. However, **Objective-C** questions are sometimes
   also tagged with **C#**, **C** and **C++**.
3. **C#**, **.NET** and **ASP.NET** are clustered, however **C#** has links with many other tags
4. The strongest relationship is between **jQuery** and **JavaScript**, probably due to jQuery having become the de-facto framework
   for JavaScript development, being used on 53% of websites.
5. There is a large cluster of connected web technologies, **CSS**, **HTML**, **JavaScript**, **jQuery**,
   reflecting the mix of technologies involved in creating web sites and web applications.
6. **Python**, whilst being a popular tag, has very
   few relationships, only being weakly linked to **PHP**.

When [I published this visualisation on my blog](http://www.scottlogic.co.uk/blog/colin/2012/02/visualising-stackoverflow-tag-relationships-with-silverlight/)
the feedback was very positive. So I decided to tidy up my code and create a generic Silverlight control that can graph relationships between a set of related nodes.
This article describes the creation of that generic control.

Here are a couple of examples of this control in action …

The first one is Stack Overflow tag relationships once again, this time the first 50 are plotted, with the labels templated so that the text is rotated, and the connector thicknesses adjusted:

![screenshot2]({{ site.baseurl }}/ceberhardt/assets/codeproject/screenshot2.png)

The next one is topical, it illustrates the debt of various countries, and the amount owed to each other. We’ll look at how this is built towards the end of the article.

![world debt]({{ site.baseurl }}/ceberhardt/assets/codeproject/world-debt.png)

You can view an [interactive version of this graph on my blog](http://www.scottlogic.co.uk/blog/colin/plotting-circular-relationships-graphs-with-silverlight/).

## Creating a Source of Data

Simple Silverlight controls have simple interfaces, composed of a few dependency properties, for example, the
`TextBlock` control has a `Text` dependency property which details the string that is rendered. List-based controls, such as the
`ListBox`, have an `ItemsSource` dependency property, where you supply a collection of items to be rendered, and an
`ItemTemplate` property which details how each instance is rendered. A graph of relationships between a set of nodes is a little more complex than either a simple or list-based control, so I decided that my
`RelationshipGraph` control would have its own specialised interface for the data that it renders:

The `RelationshipGraph` control takes an `INodeList` as its source of data:

```csharp
public interface INodeList : IList<INode>
{
}

public interface INode
{
  /// <summary>
  /// Gets the number of instances of this node type
  /// </summary>
  double Count { get; }

  /// <summary>
  /// Gets the name of this node
  /// </summary>
  string Name { get; }

  /// <summary>
  /// Gets the nodes that this node instance is related to
  /// </summary>
  List<INodeRelationship> Relationships { get; }
}
```

Where each `INode` has a `Name` property, which for the Stack Overflow graph shown earlier is the name of the tag (e.g. C#, Python, Java, …) and a
`Count`, which indicates the frequency of this node. This determines the size of the segment that renders this node. Finally, each node has a collection of relationships defined by the
`INodeRelationship` interface:

```csharp
public interface INodeRelationship
{
  /// <summary>
  /// Gets the name of the node which this is a relationship to
  /// </summary>
  string To { get; }

  /// <summary>
  /// Gets the strength of this relationship
  /// </summary>
  double Strength { get; }
}
```

Each relationship indicates the name of the related node via its `To`property, and the strength of the relationship. In the case of our Stack Overflow graph the strength indicates the number of questions that share both tags.

**Note:** the `To` property of `INodeRelationship`could have been an `INode` instance, rather than the name of the related node. However, this makes it a little harder for the user of the control to construct the required data. For the sake of usability, I prefer making it simpler for the end-user of this control.

So as a starting point we define a custom control that exposes a `Data`property of type `INodeList`:

```csharp
[SnippetDependencyProperty(property = "Data", defaultValue = "null",
                            type = "INodeList", containerType = "RelationshipGraph")]
public partial class RelationshipGraph : Control
{
}
```

## A Quick Note on Code Generation

If you are developing a control with the intention that it will be highly flexible it will probably expose numerous dependency properties. Unfortunately the syntax for defining a dependency property is rather verbose, which is why developers tend to use code snippets to help generate the required boiler-plate code. The problem with code snippets is that while they assist in the initial definition of the property, they are not very refactor friendly. If you want to change the name of a dependency property that you generated via a code snippet, you have to manually make the change in about 5 different places.

A little while back I wrote a code project article about
[the automation of code snippets via the built-in Visual Studio T4 templates](http://www.codeproject.com/Articles/184031/Declarative-Codesnippet-Automation-with-T4-Templat). Given the following code snippet:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <CodeSnippet Format="1.0.0">
    <Header>
      <Title>Defines a DependencyProperty</Title>
      <Shortcut>DependencyProperty</Shortcut>
      <Description>Defines a DependencyProperty</Description>
      <Author>Colin Eberhardt</Author>
      <SnippetTypes>
        <SnippetType>Expansion</SnippetType>
      </SnippetTypes>
    </Header>
    <Snippet>
      <Declarations>
        <Literal>
          <ID>type</ID>
          <ToolTip>Property Type</ToolTip>
          <Default>string</Default>
        </Literal>
        <Literal>
          <ID>summary</ID>
          <ToolTip>Summary Documentation</ToolTip>
          <Default>Gets / sets the property value</Default>
        </Literal>
        <Literal>
          <ID>property</ID>
          <ToolTip>Property Name</ToolTip>
          <Default>MyProperty</Default>
        </Literal>
        <Literal>
          <ID>containerType</ID>
          <ToolTip>Containing type</ToolTip>
          <Default>Control</Default>
        </Literal>
        <Literal>
          <ID>defaultValue</ID>
          <ToolTip>Property default value</ToolTip>
          <Default>null</Default>
        </Literal>
      </Declarations>
      <Code Language="csharp">
        <![CDATA[
    /// <summary>
    /// $summary$ This is a dependency property
    /// </summary>
    public $type$ $property$
    {
        get { return ($type$)GetValue($property$Property); }
        set { SetValue($property$Property, value); }
    }

    /// <summary>
    /// Defines the $property$ dependnecy property.
    /// </summary>
    public static readonly DependencyProperty $property$Property =
        DependencyProperty.Register("$property$", typeof($type$), typeof($containerType$),
            new PropertyMetadata($defaultValue$, new PropertyChangedCallback(On$property$PropertyChanged)));

    /// <summary>
    /// Invoked when the $property$ property changes
    /// </summary>
    partial void On$property$PropertyChanged(DependencyPropertyChangedEventArgs e);

    private static void On$property$PropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        $containerType$ control = d as $containerType$;
        control.On$property$PropertyChanged(e);
    }

    $end$]]>
      </Code>
    </Snippet>
  </CodeSnippet>
</CodeSnippets>
```

The T4 templates generate a corresponding attribute:

```csharp
/// <summary>
/// Defines a DependencyProperty
/// </summary>
[AttributeUsage(AttributeTargets.Class , AllowMultiple = true)]
public class SnippetDependencyProperty  : Attribute
{

    /// <summary>
    /// Property Type
    /// </summary>
    public string type = "string";

    /// <summary>
    /// Summary Documentation
    /// </summary>
    public string summary = "Gets / sets the property value";

    /// <summary>
    /// Property Name
    /// </summary>
    public string property = "MyProperty";

    /// <summary>
    /// Containing type
    /// </summary>
    public string containerType = "Control";

    /// <summary>
    /// Property default value
    /// </summary>
    public string defaultValue = "null";

}
```

If you apply this attribute to a class, and mark it as partial:

```csharp
[SnippetDependencyProperty(property = "Data", defaultValue = "null",
                            type = "INodeList", containerType = "RelationshipGraph")]
public partial class RelationshipGraph : Control
{
}
```

The T4 templates will generate the dependency property code snippet in a corresponding partial class, using the values you supply to the attribute:

```csharp
public partial class RelationshipGraph
{

  /// <summary>
  /// Gets / sets the property value. This is a dependency property
  /// </summary>
  public INodeList Data
  {
      get { return (INodeList)GetValue(DataProperty); }
      set { SetValue(DataProperty, value); }
  }

  /// <summary>
  /// Defines the Data dependnecy property.
  /// </summary>
  public static readonly DependencyProperty DataProperty =
      DependencyProperty.Register("Data", typeof(INodeList), typeof(RelationshipGraph),
          new PropertyMetadata(null, new PropertyChangedCallback(OnDataPropertyChanged)));

  /// <summary>
  /// Invoked when the Data property changes
  /// </summary>
  partial void OnDataPropertyChanged(DependencyPropertyChangedEventArgs e);

  private static void OnDataPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
  {
      RelationshipGraph control = d as RelationshipGraph;
      control.OnDataPropertyChanged(e);
  }
}
```

This project uses various code snippets for automating dependency properties and CLR property that raise change notifications.
You can see the T4 templates that perform this code generation in the `CodeGen`folder, the snippets plus their generated attributes
are found in the `CodeGen/Snippets` folder. Any class which is marked with an automated code snippet will have a corresponding
`MyClass_Generated.cs` file created, as shown below:

![solution]({{ site.baseurl }}/ceberhardt/assets/codeproject/solution.png)

I find this technique to be a real time saver. Have fun experimenting, dropping in your own code snippets. Anyhow, this technique is described in detail
in
[my earlier code project article](http://www.codeproject.com/Articles/184031/Declarative-Codesnippet-Automation-with-T4-Templat).

Back to circles …

## A NodeSegment Shape

The UI for the relationship graph is composed from a couple of different shapes; the first is the
`NodeSegment`, which is a circular arc; and the second
is a `NodeConnector`, an arced connector that joins two segments. It would be possible to programmatically construct this UI from paths and geometries.
However, I have opted for a more modular approach where these shapes are defined as controls in their own right. Later in this article we see the benefit
of this approach when animating the graph. These shapes, when used outside of the context of the relationship graph are as shown below:

![connectionAndSegment]({{ site.baseurl }}/ceberhardt/assets/codeproject/connectionAndSegment.png)

In this section we’ll look at how the `NodeSegment` is constructed.

Within WPF it is possible to define custom shapes by subclassing Shape and providing your geometry. However, the Silverlight framework,
which can be viewed as a stripped-down version of the WPF framework, does not support this. With Silverlight we can achieve a similar effect
by creating a custom control that contains the shape geometry as a Path. We’ll see how this works in practice with the node segment shape.

The node segment is described by a number of properties as illustrated in the diagram below:

![NodeSegment]({{ site.baseurl }}/ceberhardt/assets/codeproject/NodeSegment.png)

Using the code generation technique described earlier, these properties are added to our
`NodeSegment` custom control:

```csharp
[SnippetDependencyProperty(property = "StartAngle", defaultValue = "0.0",
                            type = "double", containerType = "NodeSegment")]
[SnippetDependencyProperty(property = "SweepAngle", defaultValue = "0.0",
                            type = "double", containerType = "NodeSegment")]
[SnippetDependencyProperty(property = "InnerRadius", defaultValue = "0.0",
                            type = "double", containerType = "NodeSegment")]
[SnippetDependencyProperty(property = "OuterRadius", defaultValue = "0.0",
                            type = "double", containerType = "NodeSegment")]
[SnippetDependencyProperty(property = "Center", defaultValue = "new Point()",
                            type = "Point", containerType = "NodeSegment")]
public partial class NodeSegment : Control, INotifyPropertyChanged
{

}
```

It is relatively easy to create a path that produces our desired shape using a couple of arcs and connecting lines. We can construct
a `Path` and add it to the template of our `NodeSegment` control, binding these properties to the various figures
and segments that describe our segment:

```xml
<Style TargetType="local:NodeSegment">
  <Setter Property="Template">
    <Setter.Value>
       <ControlTemplate>
          <Path>
            <Path.Data>
              <PathGeometry>
                <PathFigure StartPoint="{...}"
                            IsClosed="True">
                  <ArcSegment Point="{...}"
                              SweepDirection="Counterclockwise"
                              IsLargeArc="{...}"
                              Size="{...}"/>
                  <LineSegment Point="{...}"/>
                  <ArcSegment Point="{...}"
                              SweepDirection="Clockwise"
                              IsLargeArc="{...}"
                              Size="{...}"/>
                </PathFigure>
              </PathGeometry>
            </Path.Data>
          </Path>
        </Canvas>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
```

The problem is … what properties do we bind to? The interface of the `NodeSegment`control is expressed
in terms of a centre point, radii and angles, i.e. a polar coordinate system. Whereas, the
`Path` shown above which has been added
to the control template expects points to be expressed as X and Y locations, i.e. they use the Silverlight cartesian coordinate system. We need to find some
way to convert the various polar property values into the screen coordinate system.

WPF allows you to bind multiple source properties to a single target via a
`MultiBinding`, I have previous
[created a Silverlight equivalent](http://www.scottlogic.co.uk/blog/colin/2010/08/silverlight-multibinding-updated-adding-support-for-elementname-and-twoway-binding/),
although considering the number of segments that are to be rendered and the number of multi-bindings required for each, I felt that this was a slightly heavyweight solution.

Instead I will use a pattern I have described previously,
[which I call the mini-ViewModel
pattern](http://www.scottlogic.co.uk/blog/colin/2009/08/the-mini-viewmodel-pattern/), where a view model is constructed within a user control in order to assist the binding framework in a localized manner.

`NodeSegment` user control exposes a number of CLR properties, again,
these properties and the implementation of `INotifyPropertyChanged` itself, are generated via code-snippet automation:

```csharp
[SnippetINotifyPropertyChanged]
[SnippetPropertyINPC(property = "S1", field = "_s1",
                    type = "Point", defaultValue = "EMPTY_POINT")]
[SnippetPropertyINPC(property = "S2", field = "_s2",
                    type = "Point", defaultValue = "EMPTY_POINT")]
[SnippetPropertyINPC(property = "S3", field = "_s3",
                    type = "Point", defaultValue = "EMPTY_POINT")]
[SnippetPropertyINPC(property = "S4", field = "_s4",
                    type = "Point", defaultValue = "EMPTY_POINT")]
[SnippetPropertyINPC(property = "InnerSize", field = "_innerSize",
                    type = "Size", defaultValue = "EMPTY_SIZE")]
[SnippetPropertyINPC(property = "OuterSize", field = "_outerSize",
                    type = "Size", defaultValue = "EMPTY_SIZE")]
[SnippetPropertyINPC(property = "IsLargeArc", field = "_isLargeArc",
                    type = "bool", defaultValue = "false")]
public partial class NodeSegmentViewModel : INotifyPropertyChanged
{
  private static readonly Point EMPTY_POINT = new Point();

  private static readonly Size EMPTY_SIZE = new Size();
}
```

Within the `NodeSegment` control we create an instance of this view model and expose it via a property. The
`DataContext` of the root element of
the `NodeSegment` is also set to itself:

```csharp
public partial class NodeSegment : Control, INotifyPropertyChanged
{
  private NodeSegmentViewModel _viewmodel = new NodeSegmentViewModel();

  public NodeSegmentViewModel ViewModel
  {
    get
    {
      return _viewmodel;
    }
  }

  private void UpdateViewModel()
  {
    double startAngle = StartAngle;
    double endAngle = StartAngle + SweepAngle;

    // compute the properties that the segment exposes to support other UI elements
    MidPointAngle = startAngle + (SweepAngle / 2);
    ConnectorPoint = Util.RadialToCartesian(MidPointAngle, InnerRadius, Center);

    // compute the path control points
    ViewModel.S1 = Util.RadialToCartesian(startAngle, OuterRadius, Center);
    ViewModel.S2 = Util.RadialToCartesian(endAngle, OuterRadius, Center);
    ViewModel.S3 = Util.RadialToCartesian(endAngle, InnerRadius, Center);
    ViewModel.S4 = Util.RadialToCartesian(startAngle, InnerRadius, Center);

    // create sizes from radius values
    ViewModel.InnerSize = new Size(InnerRadius, InnerRadius);
    ViewModel.OuterSize = new Size(OuterRadius, OuterRadius);

    ViewModel.IsLargeArc = SweepAngle > 180;

  }

  public NodeSegment()
  {
    this.DefaultStyleKey = typeof(NodeSegment);
  }

  public override void OnApplyTemplate()
  {
    // set the control’s root element DataContext
    Panel root = this.GetTemplateChild("rootElement") as Panel;
    root.DataContext = this;

    UpdateViewModel();
  }
}
```

The `UpdateViewModel` method makes extensive use of a simple utility function for converting from radial coordinates to cartesian.
Whenever any of the dependency properties of `NodeSegment` change, we simply invoke
`UpdateViewModel` to update the exposed view model state.

With this view model in place, we are now able to bind the `Path` that sits within the control’s template:

```xml
<Style TargetType="local:NodeSegment">
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="local:NodeSegment">
          <Path Stroke="{TemplateBinding Stroke}"
                StrokeThickness="{TemplateBinding StrokeThickness}"
                Fill="{TemplateBinding Background}"
                DataContext="{Binding ViewModel}"
                x:Name="segmentShape">
            <Path.Data>
              <PathGeometry>
                <PathFigure StartPoint="{Binding Path=S1}"
                            IsClosed="True">
                  <ArcSegment Point="{Binding Path=S2}"
                              SweepDirection="Counterclockwise"
                              IsLargeArc="{Binding Path=IsLargeArc}"
                              Size="{Binding Path=OuterSize}"/>
                  <LineSegment Point="{Binding Path=S3}"/>
                  <ArcSegment Point="{Binding Path=S4}"
                              SweepDirection="Clockwise"
                              IsLargeArc="{Binding Path=IsLargeArc}"
                              Size="{Binding Path=InnerSize}"/>
                </PathFigure>
              </PathGeometry>
            </Path.Data>
          </Path>
        </Canvas>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
```

Note that the `DataContext` of the path is bound to the exposed
`ViewModel` property. This simplifies the bindings of the child elements, for example
`Path=ViewModel.S1` becomes simply `Path=S1`.

With the above code in place, we can now use the `NodeSegment` from code-behind or XAML just like any other shape:

```xml
<local:NodeSegment InnerRadius="200" OuterRadius="250"
                    StartAngle="35" SweepAngle="45"
                    Center="100,80"
                    Background="Blue"
                    Stroke="Black" StrokeThickness="5"/>
```

## Generating the NodeSegments

Now that we have the first of our two shapes we can start assembling the graph. The template for the
`RelationshipGraph` simply contains a `Grid` which
we populate dynamically with the segments:

```xml
<Style TargetType="local:RelationshipGraph">
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="local:RelationshipGraph">
        <Border Background="{TemplateBinding Background}"
                BorderBrush="{TemplateBinding BorderBrush}"
                BorderThickness="{TemplateBinding BorderThickness}">
          <Grid x:Name="graphContainer">
          </Grid>
        </Border>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
```

In order to render our data, firstly a few properties are added to the `RelationshipGraph`that express the various radii as a factor of the graph height / width.
Then a `Render` method is invoked which simply iterates over the supplied data and adds a node segment of the required angle and sweep angle:

```csharp
[SnippetDependencyProperty(property = "InnerRadius", defaultValue = "0.7",
                            type = "double", containerType = "RelationshipGraph")]
[SnippetDependencyProperty(property = "OuterRadius", defaultValue = "0.8",
                            type = "double", containerType = "RelationshipGraph")]
public partial class RelationshipGraph : Control
{

  private Panel _graphContainer;

  public RelationshipGraph()
  {
    this.DefaultStyleKey = typeof(RelationshipGraph);
  }

  public override void OnApplyTemplate()
  {
    _graphContainer = this.GetTemplateChild("graphContainer") as Panel;

    Render();
  }

  /// <summary>
  /// Renders the relationship graph
  /// </summary>
  private void Render()
  {
    if (_graphContainer == null ||
        double.IsNaN(ActualWidth) || double.IsNaN(ActualHeight) ||
        ActualHeight == 0.0 || ActualWidth == 0.0)
      return;

    // clear the UI
    _graphContainer.Children.Clear();

    if (Data == null || Data.Count == 0)
      return;
    // compute the various radii
    double minDimension = Math.Min(ActualWidth, ActualHeight) / 2;
    Point center = new Point(ActualWidth / 2, ActualHeight / 2);
    double innerRadius = minDimension * InnerRadius;
    double outerRadius = minDimension * OuterRadius;
    double labelRadius = minDimension * LabelRadius;

    // render the segments
    double currentAngle = 0;
    foreach (INode node in Data)
    {
      double sweepAngle = ((double)node.Count) * 360.0 / totalCount;
      var segment = new NodeSegment()
      {
        SweepAngle = sweepAngle,
        StartAngle = currentAngle,
        InnerRadius = innerRadius,
        OuterRadius = outerRadius,
        LabelRadius = labelRadius,
        Center = center
      };
      _graphContainer.Children.Add(segment);
      currentAngle += sweepAngle;
    }
  }
}
```

With the above code in place, we simply create an instance of this control in XAML:

```xml
<UserControl x:Class="CircularRelationshipGraph.MainPage"
    ...>
  <Grid x:Name="LayoutRoot" Background="White">
    <local:RelationshipGraph x:Name="graph" />
  </Grid>
</UserControl>
```

And feed in some data in XML format, via a Linq-to-XML:

```csharp
var doc = XDocument.Parse(_xml);
var data = doc.Descendants("tag")
            .Select(el => new Node()
            {
              Name = el.Attribute("name").Value,
              Count = int.Parse(el.Attribute("count").Value),
              Relationships = el.Descendants("rel")
                            .Select(rel => new NodeRelationship()
                            {
                              To = rel.Attribute("name").Value,
                              Strength = int.Parse(rel.Attribute("count").Value)
                            }).Cast<INodeRelationship>().ToList()
            }).Cast<INode>();

graph.Data = new NodeList(data);
```

In this case, the data is in an XML format which I created using a simple console application that queries the latest 1000 Stack Overflow questions:

```xml
 <tags>
  <tag name='android' count='107'>
    <rel name='java' count='34' />
    <rel name='javascript' count='8' />
    <rel name='c++' count='2' />
    <rel name='html' count='2' />
    <rel name='ios' count='2' />
  </tag>
  <tag name='java' count='103'>
    <rel name='android' count='34' />
    <rel name='c++' count='2' />
  </tag>
  <tag name='javascript' count='90'>
    <rel name='jquery' count='60' />
    <rel name='php' count='22' />
    <rel name='html' count='20' />
    <rel name='css' count='14' />
    <rel name='android' count='8' />
    <rel name='ruby-on-rails' count='4' />
    <rel name='asp.net' count='2' />
    <rel name='c#' count='2' />
    <rel name='.net' count='2' />
  </tag>
  <tag name='php' count='84'>
    <rel name='javascript' count='22' />
    <rel name='mysql' count='20' />
    <rel name='jquery' count='14' />
    <rel name='html' count='8' />
    <rel name='css' count='6' />
    <rel name='c#' count='2' />
    <rel name='python' count='2' />
  </tag>
  ...
</tags>
```

With the above code in place, the graph is starting to take shape …

![GraphPartOne]({{ site.baseurl }}/ceberhardt/assets/codeproject/GraphPartOne.png)

## Adding Some Colour

The next step is to add some colour to these segments and a text label to indicate the name of the node they relate to.

Further properties are added to the `NodeSegment`; `ConnectorPoint`,
`LabelRadius`, `IsHighlight`,
`LabelText` and `MidPointAngle`. The fill colour for the segment uses the inherited
`Background` property,
rather than adding a new property for this purpose. The newly added `LabelText`property is set by the `RelationshipGraph` when it constructs each segment,
whereas, the `MidPointAngle` and `ConnectorPoint` are a little different, these is computed by the NodeSegment
itself – later these is used to attach the connectors.

Again, the mini-ViewModel is used to expose the required co-ordinates to the
`TextBlock` that renders the label. The complete XAML for the
`NodeSegment` is shown below:

```xml
<Style TargetType="local:NodeSegment">
  <Setter Property="Canvas.ZIndex" Value="100"/>
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="local:NodeSegment">
        <Canvas x:Name="rootElement">
          <vsm:VisualStateManager.VisualStateGroups>
            <vsm:VisualStateGroup x:Name="CommonStates">
              <vsm:VisualState x:Name="Normal">
                <Storyboard>
                  <ColorAnimation Storyboard.TargetName="segmentShape"
                                  Storyboard.TargetProperty="(Path.Fill).(SolidColorBrush.Color)"
                                  Duration="0:0:0.2"/>
                </Storyboard>
              </vsm:VisualState>
              <vsm:VisualState x:Name="Highlighted">
                <Storyboard>
                  <ColorAnimation Storyboard.TargetName="segmentShape"
                                  Storyboard.TargetProperty="(Path.Fill).(SolidColorBrush.Color)"
                                  To="LightGray" Duration="0:0:0.2" />
                  <ObjectAnimationUsingKeyFrames Storyboard.TargetName="label"
                                  Storyboard.TargetProperty="(UIElement.Visibility)">
                    <DiscreteObjectKeyFrame KeyTime="00:00:00">
                      <DiscreteObjectKeyFrame.Value>
                        <Visibility>Visible</Visibility>
                      </DiscreteObjectKeyFrame.Value>
                    </DiscreteObjectKeyFrame>
                  </ObjectAnimationUsingKeyFrames>
                </Storyboard>
              </vsm:VisualState>
            </vsm:VisualStateGroup>
          </vsm:VisualStateManager.VisualStateGroups>

          <!-- the segment itself -->
          <Path Stroke="{TemplateBinding Stroke}"
                StrokeThickness="{TemplateBinding StrokeThickness}"
                Fill="{TemplateBinding Background}"
                DataContext="{Binding ViewModel}"
                x:Name="segmentShape">
            <Path.Data>
              <PathGeometry>
                <PathFigure StartPoint="{Binding Path=S1}"
                            IsClosed="True">
                  <ArcSegment Point="{Binding Path=S2}"
                              SweepDirection="Counterclockwise"
                              IsLargeArc="{Binding Path=IsLargeArc}"
                              Size="{Binding Path=OuterSize}"/>
                  <LineSegment Point="{Binding Path=S3}"/>
                  <ArcSegment Point="{Binding Path=S4}"
                              SweepDirection="Clockwise"
                              IsLargeArc="{Binding Path=IsLargeArc}"
                              Size="{Binding Path=InnerSize}"/>
                </PathFigure>
              </PathGeometry>
            </Path.Data>
          </Path>

          <!-- the text label for this segment -->
          <TextBlock Text="{Binding Path=LabelText}"
                      Visibility="{Binding Path=SweepAngle, Converter={StaticResource DoubleToVisibility}, ConverterParameter=3}"
                      Canvas.Top="{Binding Path=ViewModel.LabelLocation.Y}"
                      Canvas.Left="{Binding Path=ViewModel.LabelLocation.X}"
                      x:Name="label"
                      Height="20"
                      VerticalAlignment="Center"
                      HorizontalAlignment="Center">
            <TextBlock.RenderTransform>
              <TransformGroup>
                <TranslateTransform X="0" Y="-10"/>
                <RotateTransform Angle="{Binding Path=MidPointAngle, Converter={StaticResource NegateDouble}}"/>
                <RotateTransform Angle="90"/>
              </TransformGroup>
            </TextBlock.RenderTransform>
          </TextBlock>

        </Canvas>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
```

There are a few interesting new features here – the `TextBlock` that is used to label each segment is positioned, as expected, via various render transforms
and attached `Canvas` properties that are bound to the view model. The
`Visibility` property is bound to the `SweepAngle` property,
via a value converter `DoubleToVisibility`, this simple converter returns a ‘visible’ value if the supplied double is greater that the provided parameter.
In this case, labels are only visible if the sweep angle is greater than 3 degrees.

Also a couple of visual states have been added. In the `NodeSegment`code behind, `MouseEnter` and `MouseLeave` events
are handled on the path to set the control’s `IsHighlighted` property. This also sets / unsets the
`Highlighted` visual state,
which changes the fill colour of the segment and sets the visibility of the label, ensuring that hidden labels are shown on mouse-over.

The colour for each segment is determined by the number of connections it has, in order to provide a nice colour gradient I borrowed
the `SolidColourBrushInterpolator` from the Silverlight Toolkit, which converts a numeric value within some pre-determined range
into a color value (You could also use a more complex interpolator, that allows you to specify more than two colours,
[as described in this blog post](http://www.surveyxtreme.com/?p=115)).

With a `SegmentFillInterpolator` dependency property added to the graph, and a simple bit of code added to convert connector count to a color,
we can now specify a colour range as follows:

```xml
<local:RelationshipGraph x:Name="graph" FontSize="10"
                          LabelRadius="0.73" OuterRadius="0.7" InnerRadius="0.6">
  <local:RelationshipGraph.SegmentFillInterpolator>
    <datavis:SolidColorBrushInterpolator From="Blue" To="Orange"/>
  </local:RelationshipGraph.SegmentFillInterpolator>
</local:RelationshipGraph>
```

Which results in the following graph:

![GraphPartTwo]({{ site.baseurl }}/ceberhardt/assets/codeproject/GraphPartTwo.png)

## Connecting the Segments

In order to connect the segments I created another ‘shape’, the `NodeConnector`, using exactly the same pattern as the
`NodeSegment`,
i.e. a custom control which contains the shape, as defined by a Path element, which is supported by a mini-ViewModel.

The `NodeConnection` is specified in terms of three points, `From`,
`To` and `Via`.
The `From` and `To` locations are the contact points with the segments, whereas the
`Via` point, is the centre of the graph:

![connector]({{ site.baseurl }}/ceberhardt/assets/codeproject/connector.png)

The connection is simply an `ArcSegment`:

```xml
<Style TargetType="local:NodeConnection">
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="local:NodeConnection">
        <Canvas x:Name="rootElement">
          <vsm:VisualStateManager.VisualStateGroups>
            <vsm:VisualStateGroup x:Name="CommonStates">
              <vsm:VisualState x:Name="Normal">
                <Storyboard>
                  <ColorAnimation Storyboard.TargetName="connectorPath"
                                  Storyboard.TargetProperty="(Path.Stroke).(SolidColorBrush.Color)"
                                  Duration="0:0:0.2"/>
                </Storyboard>
              </vsm:VisualState>
              <vsm:VisualState x:Name="Highlighted">
                <Storyboard>
                  <ColorAnimation Storyboard.TargetName="connectorPath"
                                  Storyboard.TargetProperty="(Path.Stroke).(SolidColorBrush.Color)"
                                  To="Red" Duration="0:0:0.2" />
                </Storyboard>
              </vsm:VisualState>
            </vsm:VisualStateGroup>
          </vsm:VisualStateManager.VisualStateGroups>

          <Path Stroke="{Binding Path=Stroke}"
                StrokeThickness="{Binding Path=StrokeThickness}"
                x:Name="connectorPath">
            <Path.Data>
              <PathGeometry>
                <PathFigure StartPoint="{Binding Path=From}"
                            IsClosed="False">
                  <ArcSegment Point="{Binding Path=To}"
                              Size="{Binding Path=ViewModel.Size}"
                              SweepDirection="{Binding Path=ViewModel.SweepDirection}"/>
                </PathFigure>
              </PathGeometry>
            </Path.Data>
          </Path>
        </Canvas>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
```

Again, a highlighted visual state is applied.

Computing the radius (`Size`) of the `ArcSegment` was fun! Connections that pass through the centre
of the graph need to be straight, whereas those between neighbouring segments should be large circular segment. To achieve this, I applied a the
`Tan` function,
which tends to infinity at `PI / 2`, to the angle between the `To`and `From` points as described by a circle centred on `Via`.
The code which updates the view model is shown below:

```csharp
/// <summary>
/// Gets the angle between the point from and to on a circle with
/// the given center. The returned value is in the range -360 to 360.
/// </summary>
private static double SubtendedAngle(Point from, Point to, Point center)
{
  double fromAngle = Math.Atan2(from.Y - center.Y, from.X - center.X);
  double toAngle = Math.Atan2(to.Y - center.Y, to.X - center.X);
  double angle = toAngle - fromAngle;
  return 180 * angle / Math.PI;
}

private void UpdateViewModel()
{
  double angle = SubtendedAngle(From, To, Via);
  if (angle < 0)
    angle += 360;

  double radius = Math.Sqrt((From.Y - Via.Y) * (From.Y - Via.Y) + (From.X - Via.X) * (From.X - Via.X));
  double shortestAngle = (angle > 180) ? 360 - angle : angle;
  double func = Math.Tan(shortestAngle * (Math.PI / 2) / 180) * radius;

  _viewModel.Size = new Size(func, func);
  _viewModel.SweepDirection = Math.Abs(angle) < 180 ? SweepDirection.Counterclockwise : SweepDirection.Clockwise;
}
```

The `Render` code for the `RelationshipGraph` is then extended to render the connections after the segments have been constructed:

```csharp
double maxRelation = Data.SelectMany(d => d.Relationships).Max(d => d.Strength);
double minRelation = Data.SelectMany(d => d.Relationships).Min(d => d.Strength);

// set the interpolator bounds
ConnectorFillInterpolator.ActualDataMaximum = maxRelation;
ConnectorFillInterpolator.ActualDataMinimum = minRelation;

// render the connections
foreach (INode fromNode in sortedData)
{
  foreach (var rel in fromNode.Relationships)
  {
    // locate the other end of this connection
    INode toNode = Data.SingleOrDefault(n => n.Name == rel.To);

    if (toNode == null)
    {
      Debug.WriteLine("A relationship to a node that does not exist was found [" + rel.To + "]");
      continue;
    }

    // locate the segment for each node
    var fromSegment = _segmentForNode[fromNode];
    var toSegment = _segmentForNode[toNode];

    // create a connector
    var conn = new NodeConnection()
    {
      Via = center,
      StrokeThickness = Interpolate(minRelation, maxRelation, ConnectorThickness.Minimum,
                                      ConnectorThickness.Maximum, rel.Strength),
      Stroke = ConnectorFillInterpolator.Interpolate(rel.Strength) as SolidColorBrush,
      Style = NodeConnectorStyle
    };

    // bind the connector from / to points to the respective segments
    conn.SetBinding(NodeConnection.FromProperty, new Binding("ConnectorPoint")
    {
      Source = fromSegment
    });
    conn.SetBinding(NodeConnection.ToProperty, new Binding("ConnectorPoint")
    {
      Source = toSegment
    });

    // bind the highlighted state to the highlight state of the source segment
    conn.SetBinding(NodeConnection.IsHighlightedProperty, new Binding("IsHighlighted")
    {
      Source = fromSegment
    });

    _graphContainer.Children.Add(conn);
  }
}
```

Most of the above code is pretty straightforward, when the segments are produced they are added to the `_segmentForNode` dictionary so that we can rapidly map
from node to segment. Also, I have added another interpolator for the connector colour and a double-range that is used to determine the connector thickness.

The interesting part in the above code is the bindings. The first two bind the To and From properties of the segment to the
`ConnectorPoint` dependency property of each
`NodeSegment`. These bindings ensure that the connectors are always attached to the segments regardless of their location. This works
in a similar fashion to the connectors you can use within PowerPoint and Word.

The second binding ensures that when a segment is highlighted, all the connectors that emanate from this segment are also highlighted.

With this code in place, the graph is complete:

![GraphPartThree]({{ site.baseurl }}/ceberhardt/assets/codeproject/GraphPartThree.png)

You can view an [interactive version of this graph on my blog](http://www.scottlogic.co.uk/blog/colin/plotting-circular-relationships-graphs-with-silverlight/).

## Sorting the Data

Whilst this visualisation is quite pretty, I also want it to be useful, in other words, assist the viewer in understanding the data that it represents.
The order in which the various nodes are rendered has a significant impact on the appearance of the graph and allows the user to spot different patterns.
In order to animate changes in sort order, I need to make the process of applying a new sort order atomic, in other words,
`INotifyCollectionChanged` doesn’t really fit the bill!

In order to support an atomic sort, I have introduced the following interface:

```csharp
/// <summary>
/// Takes a list of nodes and sorts them.
/// </summary>
public interface ISortOrderProvider
{
  INodeList Sort(INodeList nodes);
}
```

With the relationship graph accepting an instance of `ISortOrderProvider`via a dependency property. Before the segments and connections are rendered,
this provider is used to sort the supplied list of nodes.

A trivial implementation of this interface is shown below:

```csharp
/// <summary>
/// A sort order provider that doesn't actually perform any sorting.
/// </summary>
public class NaturalSortOrderProvider : ISortOrderProvider
{
  public INodeList Sort(INodeList nodes)
  {
    return nodes;
  }
}
```

This doesn’t actually sort the data at all, and is the default behaviour. I have also created a more generic provider that sorts via a delegate, as shown below:

```csharp
/// <summary>
/// A sort provider that orders the nodes via the given delegate
/// </summary>
public class DelegateSortOrderProvider : ISortOrderProvider
{
  private Func<IList<INode>, IEnumerable<INode>> _func;

  public DelegateSortOrderProvider(Func<IList<INode>, IEnumerable<INode>> func)
  {
    _func = func;
  }

  public INodeList Sort(INodeList nodes)
  {
    return new NodeList(_func(nodes));
  }
}
```

With this approach, you can cause the graph to sort by node count as follows:

```csharp
graph.SortOrderProvider = new DelegateSortOrderProvider(nodes =>
                                 nodes.OrderBy(node => node.Count));
```

Rather than re-rendering the graph when the `SortOrderProvider` property changes, the pieces are animated to their new location.
The partial method that is invoked when the dependency property changes invokes a method which performs the animation:

```csharp
partial void OnSortOrderProviderPropertyChanged(DependencyPropertyChangedEventArgs e)
{
  var sortedData = SortOrderProvider.Sort(Data);
  AnimateToOrder(sortedData);
}

/// <summary>
/// Launch a storyboard to animate each segment into place
/// </summary>
private void AnimateToOrder(IList<INode> data)
{
  var sb = new Storyboard();

  double currentAngle = 0;
  foreach (INode node in data)
  {
    NodeSegment segment = _segmentForNode[node];

    double toAngle = currentAngle;
    double fromAngle = segment.StartAngle;

    // find the shortest route between the from / to angles
    if (Math.Abs(fromAngle - (toAngle - 360)) < Math.Abs(fromAngle - toAngle))
      toAngle -= 360;
    if (Math.Abs(fromAngle - (toAngle + 360)) < Math.Abs(fromAngle - toAngle))
      toAngle += 360;

    // animate the segment
    var db = CreateDoubleAnimation(fromAngle, toAngle,
        new SineEase(),
        segment, NodeSegment.StartAngleProperty, TimeSpan.FromMilliseconds(1500));
    sb.Children.Add(db);

    currentAngle += segment.SweepAngle;
  }
  sb.Begin();
}

private static DoubleAnimation CreateDoubleAnimation(double from, double to, IEasingFunction easing,
                                          DependencyObject target, object propertyPath, TimeSpan duration)
{
  var db = new DoubleAnimation();
  db.To = to;
  db.From = from;
  db.EasingFunction = easing;
  db.Duration = duration;
  Storyboard.SetTarget(db, target);
  Storyboard.SetTargetProperty(db, new PropertyPath(propertyPath));
  return db;
}
```

It is quite neat how the way that because the `To` / `From` property of connectors are bound to the
`ConnectorPoint` properties of their respective
segments, only the segment’s position needs to be animated. Everything else updates automatically.

## Clustering Related Nodes

One interesting way in which the graph can be sorted is to cluster related nodes by minimising the number of connections that pass through the centre of the circle.
To achieve this, I have created a sort provider, `MinimisedConnectionLengthSort`, that sorts the nodes by minimising connection length resulting in a clustering of nodes.

This provider assigns a ‘weight’ to a given node configuration, where the weight is computed by summing the ‘length’ of each connection.
The provider then moves each node in turn, left and right, to determine whether this new configuration minimises the weight. After a number of iterations, the optimum configuration is found.

The result of applying this iterative approach is shown below:

![WeightReduction]({{ site.baseurl }}/ceberhardt/assets/codeproject/WeightReduction.png)

## A Final Example

So far, all the examples have used data relating to Stack Overflow tags. To demonstrate that this graph is a bit more versatile,
my final example is a graph of Eurozone debt, with data (and concepts!) taken from the
[BBC News website](http://www.bbc.co.uk/news/business-15748696).

![world debt]({{ site.baseurl }}/ceberhardt/assets/codeproject/world-debt.png)

You can view an [interactive version of this graph on my blog](http://www.scottlogic.co.uk/blog/colin/plotting-circular-relationships-graphs-with-silverlight/).

This example has the various debts owed between countries stored in an XML file:

```xml
<debt>
  <country name='France' debt='4200' text='Europes second biggest economy owes the UK, the US and Germany ...'>
    <owes name='Italy' amount='37.6'/>
    <owes name='Japan' amount='79.8'/>
    <owes name='Germany' amount='123.5'/>
    <owes name='UK' amount='227'/>
    <owes name='US' amount='202.1'/>
  </country>
  <country name='Spain' debt='1900' text='Spain owes large amounts to Germany and France. However...'>
    <owes name='Portugal' amount='19.7'/>
    <owes name='Italy' amount='22.3'/>
    <owes name='Japan' amount='20'/>
    <owes name='Germany' amount='131.7'/>
    <owes name='UK' amount='74.9'/>
    <owes name='US' amount='49.6'/>
    <owes name='France' amount='112'/>
  </country>
  <country name='Portugal' debt='400' text='Portugal, the third eurozone country to need a bail-out...'>
    <owes name='Italy' amount='2.9'/>
    <owes name='Germany' amount='26.6'/>
    <owes name='UK' amount='18.9'/>
    <owes name='US' amount='3.9'/>
    <owes name='France' amount='19.1'/>
    <owes name='Spain' amount='65.7'/>
  </country>
  ...
</debt>
```

A very similar piece of Linq-to-XML is used to parse this data in order to construct nodes and relationships.
The one thing to note here is that the ‘text’ attribute is used to populate a
`Tag` property on the concrete node implementation (yes ... I know this
is a bit old-school, I just wanted to avoid creating a bindable `INode`implementation!).

The XAML for this example, includes a right-hand column which displays this text value. This is done by databinding to the
`HighlightedNode` property which
the graph exposes, then binding to the node `Name` and `Tag`:

```xml
<Grid x:Name="LayoutRoot"
      Background="White">
  <Grid Margin="15">
    <Grid.ColumnDefinitions>
      <ColumnDefinition Width="2*"/>
      <ColumnDefinition Width="*"/>
    </Grid.ColumnDefinitions>

    <local:RelationshipGraph x:Name="graph" FontSize="12"
                              NodeSegmentStyle="{StaticResource NodeSegmentStyle}"
                              LabelRadius="0.93"
                              Margin="0,0,30,0">
      <local:RelationshipGraph.ConnectorThickness>
        <local:DoubleRange Minimum="0.5" Maximum="80"/>
      </local:RelationshipGraph.ConnectorThickness>
      <local:RelationshipGraph.SegmentFillInterpolator>
        <datavis:SolidColorBrushInterpolator From="LightGray" To="DarkGray"/>
      </local:RelationshipGraph.SegmentFillInterpolator>
      <local:RelationshipGraph.ConnectorFillInterpolator>
        <datavis:SolidColorBrushInterpolator From="#66dddddd" To="#66dddddd"/>
      </local:RelationshipGraph.ConnectorFillInterpolator>
    </local:RelationshipGraph>

    <Line X1="0" Y1="0" X2="0" Y2="350"
          Grid.Column="1"
          Stroke="LightGray" StrokeThickness="2"
          VerticalAlignment="Center"/>
    <Grid Grid.Column="1"
          DataContext="{Binding ElementName=graph, Path=HighlightedNode}"
          Margin="10">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/>
        <RowDefinition/>
      </Grid.RowDefinitions>
      <TextBlock Text="{Binding Name}"
                  FontSize="20"
                  TextDecorations="Underline"
                  FontFamily="Georgia"
                  Margin="0,10,0,10"/>
      <TextBlock Text="{Binding Tag}"
                  FontSize="13"
                  TextWrapping="Wrap"
                  Foreground="#999"
                  Grid.Row="2"
                  FontFamily="Georgia"/>
    </Grid>
  </Grid>
</Grid>
```

In other words, no code-behind is required to produce the interactivity. This makes me happy!

## Conclusions

Well, there’s not much more for me to say, other than I hope you like this control and enjoy reading about it.
I certainly feel that templating and binding features of the Silverlight framework result in a very elegant implementation,
with very little code within the `RelationshipGraph` control itself. If you have any comments, or make use of this
control in your own project please let me know!
