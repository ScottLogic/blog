---
title: Bullet Graphs - A Custom Control - WPF vs. Windows Forms
date: 2008-10-13 00:00:00 Z
categories:
- Tech
tags:
- wpf
author: ceberhardt
layout: default_post
source: codeproject
summary: A direct side-by-side comparison of building the same custom control — the
  Bullet Graph, a cleaner alternative to gauges for business dashboards — in both
  WPF and Windows Forms. The article highlights fundamental differences in the two
  programming models for control development in a Line of Business context.
---

*This article was originally published on CodeProject, which has since shut down.*

## Overview

“Should we use Windows Presentation Foundation (WPF) or Windows Forms (WinForms) for our Line Of Business (LOB) User Interface (UI) code?”

Unfortunately, this is not an easy question to answer. WPF is not just a new improved Windows Forms; it is a radical departure from its predecessor, offering much more than an extra level of polish. It is a whole new paradigm for UI development!

This article describes the development of a custom control with both technologies in order that they can be compared directly and the differences between the two highlighted.

The control used as a case study in this article is the Bullet Graph:

![bullet large]({{ site.baseurl }}/ceberhardt/assets/codeproject/bullet_large.png)

The source code attached to this article provides fully functional Bullet Graph controls in both WPF and WinForms, so if you just want to use one of these controls in your application, be my guest. If you would like to learn a bit more about WPF, then read on …

## Background

There are numerous articles and blog posts extolling the virtues of WPF, highlighting features such as animation, the rich content model, and superior graphics. For an in-depth overview, see the article: “[Top Ten UI Development Breakthroughs In Windows Presentation Foundation](http://msdn.microsoft.com/en-us/magazine/cc163662.aspx)”. Whilst WPF seems an obvious choice for desktop applications where appearance and style provides a competitive edge, features like lookless controls, styling, and skinnable interfaces make WPF an almost obvious choice.

However, what about more ‘serious’ business applications where style is not important? With Line of Business (LOB) applications, usability, cost of development, stability, and clarity in the presentation of information are far more important than style. In fact, excessive styling can be seen as detrimental, and is usually discouraged. The subject of whether WPF is ready for LOB is still a [topic of hot debate](http://forums.msdn.microsoft.com/en-US/wpf/thread/af511166-002d-472c-b759-131d002adb43). Interestingly, Tim Sneath, in his recent announcement of the [.NET 3.5 SP1 release](http://blogs.msdn.com/tims/archive/2008/05/12/introducing-the-third-major-release-of-windows-presentation-foundation.aspx), expressed surprise at the number of Enterprise Applications that have adopted WPF.

The radical difference in the programming model of Windows Forms and WPF makes it very hard to determine their relative merits in the LOB arena. A direct comparison of WPF and Windows Forms development of the same application can prove very insightful, adding context to their differences. A few months ago, Josh Smith published an article: [Creating the Same Program in Windows Forms and WPF](http://www.codeproject.com/KB/WPF/winforms2wpf.aspx), where he did just that. The article takes a simple application and contrasts the development process with these two very different technologies. Whilst on the surface the two applications are syntactically very different, they share many similarities in their use of user controls, data-binding, and layout techniques (WinForms `Panel`s and WPF `ItemsControl`s). Based on this article, I personally found it hard to pick a winner between the two technologies, which I certainly do not see as a failing of either this excellent article or its author. It’s just that, unsurprisingly, WPF and Windows Forms do have many similarities.

For this article, what I wanted to do was perform the same exercise, creating the same program with WinForms and WPF, but within the context of a LOB control. I deliberately chose a control which does not immediately play on the strengths of WPF, i.e., no bitmap effects, animations, skinning etc…

When I embarked on this task, I had no firm winner in mind, and I have tried to remain free of bias throughout. I am also a pragmatist, I will quite happily pick up any tool, WinForms or WPF, C# or Java, as long as it helps me get the job done quickly and with a quality end result.

## Bullet Graphs

The LOB control I selected for this article is the Bullet Graph, a control for indicating ‘not to exceed’ targets which was developed by [Stephen Few in 2005](http://www.perceptualedge.com/blog/?p=217). Stephen is an expert in business dashboards, which are used to convey complex business critical data in a concise and clear manner, whose book “[Information Dashboard Design](http://www.amazon.com/Information-Dashboard-Design-Effective-Communication/dp/0596100167)” is highly acclaimed. He introduced the Bullet Graph as a clearer alternative to the flashy radial gauges and thermometers that have dominated digital dashboards. I am not sure what Stephen would make of the advertised feature-set of WPF, heck he [doesn't even like pie charts](http://www.perceptualedge.com/articles/visual_business_intelligence/save_the_pies_for_dessert.pdf) … I don't think I will introduce him to my [previous CodeProject article](http://www.codeproject.com/KB/WPF/PieChartDataBinding.aspx)!

The image below shows a number of gauge controls (from a [CodeProject article](http://www.codeproject.com/KB/GDI-plus/AquaGauge.aspx?fid=456028&df=90&mpp=25&noise=3&sort=Position&view=Quick&fr=26&select=2223267)) next to some bullet graphs:

![gauge_and_bullet.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/gauge_and_bullet.jpg)

It is no surprise that you can already find [Gauge controls for WPF](http://www.actiprosoftware.com/Products/DotNet/WPF/Gauge/default.aspx), but not their clearer counterpart, the Bullet Graph.

Stephen Few has published a detailed [design specification for Bullet Graphs](http://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf). The WPF and WinForms controls adhere as closely to this specification as possible. Any additions I have made, such as tooltips, are justified because they convey useful information and improve clarity. His specification is illustrated below.

![bullet_spec.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/bullet_spec.png)

## The Windows Forms Control

I implemented the WinForms Bullet Graph as a User Control; this gives you a blank canvas onto which you can drop other controls. However, much of the content of the Bullet Graph is dependent on the data being displayed, making it impossible to assemble it directly within the Visual Studio Designer. The alternative is to handle the control’s `Paint` event, drawing the control programmatically using the supplied `Graphics` object. This makes the construction of the control a purely manual process.

I will not cover how each component of the Bullet Graph is assembled within the WinForms control, it is all pretty plain and obvious, a few simple algorithms and some drawing code. Here is a snippet of the code which renders the scale bars, featured measure and comparative measure, just to provide a little flavour (full source code is, of course, given with this article):

~~~csharp
private void BulletGraph_Paint(object sender, PaintEventArgs e)
{
    Rectangle rec = bulletBackground.ClientRectangle;
    rec.Offset(bulletBackground.Location);
    float ratio = (float)rec.Width / (float)graphRange;

    // determine the tick spacing
    float tickSpacing = graphRange>0 ? 1 : -1;
    float[] multipliers = new float[] { 2.5f, 2, 2 };
    int multiplierIndex = 0;
    while (Math.Abs((float)graphRange / tickSpacing) > 7)
    {
        tickSpacing *= multipliers[multiplierIndex % multipliers.Length];
        multiplierIndex++;
    }

    // plot the axes
    float tickPosition = 0;
    while (Math.Abs(tickPosition) <= Math.Abs((float)graphRange))
    {
        float xPos = rec.Left + tickPosition * ratio;

        // bottom tick marks
        PointF p1 = new PointF(xPos, rec.Bottom);
        PointF p2 = new PointF(xPos, rec.Bottom + 3);
        e.Graphics.DrawLine(Pens.Black, transform(p1, rec), transform(p2, rec));

        // upper tick marks
        p1 = new PointF(xPos, rec.Top);
        p2 = new PointF(xPos, rec.Top - 3);
        e.Graphics.DrawLine(Pens.Black, transform(p1, rec), transform(p2, rec));

        // labels
        Rectangle labelRec = transform(new Rectangle((int)xPos - 15,
                                       rec.Bottom + 4, 30, 15), rec);
        StringFormat drawFormat = new StringFormat();
        drawFormat.Alignment = StringAlignment.Center;
        e.Graphics.DrawString(Convert.ToString(tickPosition),
                  this.Font, Brushes.Black, labelRec, drawFormat);

        tickPosition += tickSpacing;
    }

    // plot the featured measure
    float thirdOfHeight = (float)rec.Height / 3;
    int x = rec.Left;
    int y = (int) ((float)rec.Top + thirdOfHeight);
    int width = (int)((float)GetFeaturedMeasure() * ratio);
    int height = (int)thirdOfHeight;

    Rectangle controlRec = transform(new Rectangle(x, y, width, height), rec);

    featuredMeasureRect.Location = controlRec.Location;
    featuredMeasureRect.Size = controlRec.Size;

    // plot the comparative measure
    float sixthOfHeight = (float)rec.Height / 6;
    x = (int)((float)comparativeMeasure * ratio + rec.Left);
    y = (int)((float)rec.Top + sixthOfHeight);
    width = rec.Width / 80;
    height = (int)(sixthOfHeight*4);

    controlRec = transform(new Rectangle(x, y, width, height), rec);

    comparativeMeasureRect.Location = controlRec.Location;
    comparativeMeasureRect.Size = controlRec.Size;
}
~~~

As you can see, it is pretty straightforward, although it is a little difficult from the inspection of the code to see exactly how the rendering and layout is actually performed. One feature of note is that any point plotted on the X axis is passed through a transformation function, like the one below:

~~~csharp
PointF transform(PointF point, Rectangle container)
{
    if (flowDirection == FlowDirection.LeftToRight)
        return point;
    else
    {
        float x = container.X * 2 + container.Width - point.X ;
        return new PointF(x, point.Y);
    }
}
~~~

This was done to support the requirement that it should be possible to render the Bullet Graph in a right-to-left orientation to highlight measures that have a negative impact on the business (defect count, for example).

I did, however, use a few tricks in developing this control, the first one relating to the control layout - ideally, the control should be resizable, the second relating to the need for tooltips. Windows Forms has a few simple techniques for managing layout via the `Anchor` and `Dock` properties of a control. I really wanted to use the `Anchor` property which maintains a constant margin around the control as its container is re-sized in order to re-size the centre bar of the bullet graph whilst maintaining a fixed scale bar size. Also, the tooltips within WinForms are bound to controls; therefore, it is not a straightforward process to display a tooltip for a custom rendered graphic.

In order to solve these problems, I created a few ‘dummy’ controls to the design surface, as illustrated below:

![winforms_layout.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/winforms_layout.png)

The two black rectangles are the featured measure and comparative measure, the dotted rectangle is the region used to plot the quantitative scale bar. All three are controls of type `PictureBox`, not because I want to render a picture, simply because I want to make use of some of the functionality that is common to all controls. The quantitative scale bar is positioned using the `Anchor` property, with the typically red-orange-green bars plotted in the `Paint` event handler for this control in the code-behind. The featured measure and comparative measure `PictureBox`-es are positioned depending on the data being visualised in the code-behind, and tooltips set accordingly.

The image below shows a couple of Bullet Graphs of different sizes, demonstrating how the control scales:

![winforms_tooltip.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/winforms_tooltip.png)

Windows Forms provides some very good facilities for Designer support, allowing you to provide a design time interface for configuring the run-time properties of each control instance. For the Bullet Graph, I used the most basic of features. The control properties are exposed as Common Language Runtime (CLR) properties, with the `Category` and `Description` attributes specified. One feature which I particularly like is the `ExpandableObjectConverter`; when this attribute is present, it allows in-line editing within the property grid, as illustrated below:

~~~csharp
[TypeConverter(typeof(ExpandableObjectConverter))]
public class QualitativeRange
{
    public int? Maximum {get; set;}

    public Color Color { get; set; }

    public override string ToString()
    {
        return "Maximum: " +
       (Maximum.HasValue ? Maximum.ToString() : "") + ", Color: " + Color;
    }
}

private QualitativeRange[] qualitativeRanges = new QualitativeRange[] { };

[Description("The qualitative ranges to display")]
[Category("Bullet Graph")]
public QualitativeRange[] QualitativeRanges
{
    get { return qualitativeRanges; }
    set { qualitativeRanges = value; }
}
~~~

![winforms_expandableobject.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/winforms_expandableobject.jpg)

Adding simple data binding to a Windows Forms custom control couldn't be easier, simply add the `DefaultBindingProperty` attribute to the custom control. With this attribute in place, a client of your control simply navigates to the Data category within the property grid, they can then connect a `DataSource` to the control, as illustrated below:

![winforms_databinding.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/winforms_databinding.jpg)

Simple data binding is very straightforward; however, you can only specify a single `DefaultBindingProperty`. The alternatives of complex binding and list binding are much more complex, as illustrated in this excellent [CodeProject article](http://www.codeproject.com/KB/database/DataBindCustomControls.aspx).

With the Bullet Graph control implemented and data binding support added, it would be a useful feature to add a standard legend format. Rather than add this to the Bullet Graph control itself, it makes more sense to add a separate user control which contains a Bullet Graph instance together with the standard legend. This approach provides greater flexibility, allowing users to choose whether to use the graph with legends or without. The custom control `BulletGraphWithLegend` is illustrated below:

![winforms_legend.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/winforms_legend.png)

The code-behind for this control is very un-interesting; it simply defines the same properties as the bullet graph, delegating to the bullet graph which it contains:

~~~csharp
[Category("Bullet Graph")]
public int ComparativeMeasure
{
    get { return bulletGraph1.ComparativeMeasure; }
    set { bulletGraph1.ComparativeMeasure = value; }
}

[Category("Bullet Graph")]
public int FeaturedMeasure
{
    get { return bulletGraph1.FeaturedMeasure; }
    set { bulletGraph1.FeaturedMeasure = value; }
}
~~~

The above is required because Windows Forms does not have the concept of property value inheritance that WPF does.

Putting it all together, the following example shows a number of bullet graphs that have been bound to a .NET object. The configuration of each control is a simple process via the Visual Studio Designer:

![winforms_complete.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/winforms_complete.png)

## The WPF Control

The WPF control is also a User Control, but that is just about where the similarities between the WPF and its Windows Forms counterpart end. Because this article sits within the WPF category within CodeProject, and I anticipate most of its readers will be interested in WPF rather than Windows Forms, I will go into a little more detail regarding the development of the WPF Bullet Graph.

I made the deliberate design aim to minimise the use of code-behind, favouring the declarative approach offered by XAML, databinding, and the use of `ValueConverter`s, where required.

### Layout

The layout of the `BulletGraph` User Control is defined as a `Grid` composed of three rows, as follows:

~~~xml
<Grid.RowDefinitions>
    <!-- houses the upper scale bar -->
    <RowDefinition Height="*"/>
    <!-- houses the qualitative range bar, plus featured &
                comparative measures -->
    <RowDefinition Height="4*"/>
    <!-- houses the lower scale bar with axis labels -->
    <RowDefinition Height="3*"/>
</Grid.RowDefinitions>
~~~

This divides the ‘canvas’ of the `UserControl` into three sections, with a ratio of 1:4:3. In the following sections, we will see how the various component parts are constructed.

### Qualitative Ranges

The Qualitative Ranges are defined as a Collection Dependency Property of our `UserControl`, with the `QualitativeRange` class being the same as the one used in the WinForms control (see above). They are rendered with the following XAML:

~~~xml
<UserControl ... x:Name="bulletGraph" >
   ...
  <UserControl.Resources>
    <ItemsPanelTemplate x:Key="gridItemControl">
      <Grid/>
    </ItemsPanelTemplate>
  </UserControl.Resources>
  ...
  <!-- qualitative range bar -->
  <ItemsControl x:Name="qualitativeRangeBar" Grid.Row="1"
                ItemsSource="{Binding Path=
            (c:BulletGraphWithLegend.QualitativeRanges),
                    ElementName=bulletGraph}"
                ItemsPanel="{StaticResource gridItemControl}">
    <ItemsControl.ItemTemplate>
      <DataTemplate>
        <Rectangle HorizontalAlignment="Left">
          <Rectangle.Fill>
            <SolidColorBrush Color="{Binding Path=Color}"/>
          </Rectangle.Fill>
          <Rectangle.Width>
            <MultiBinding Converter="{StaticResource ScalingMultiConverter}">
              <!-- maximum value -->
              <Binding Path="(c:BulletGraphWithLegend.GraphRange)"
                ElementName="bulletGraph"/>
              <!-- value to scale -->
              <Binding Path="Maximum"/>
              <!-- width to scale to -->
              <Binding Path="ActualWidth" ElementName="bulletGraph"/>
            </MultiBinding>
          </Rectangle.Width>
        </Rectangle>
      </DataTemplate>
    </ItemsControl.ItemTemplate>
  </ItemsControl>
  ...
</UserControl>
~~~

The above XAML defines an `ItemsControl` which has its `ItemsSource` bound to the `QualitativeRanges` Dependency Property. The `ItemsPanel` template is specified so that the items are placed on a `Grid`, simply for the flexibility that a `Grid` provides in arranging elements.

Each `QualitativeRange` is rendered as a rectangle with its `Fill` color bound to the `Color` property. The interesting part of this layout is the way that the `Width` of each rectangle is determined. The rectangle `Width` property is bound via a `MultiBinding` which uses the `ScalingMultiConverter` value converter. This converter takes three parameters, maximum value, value to scale, and the range to scale the value over; with which it performs a simple linear scaling. The value converter code is given below. This simple converter is used extensively within the User Control (and in a number of other WPF projects I have worked on).

~~~csharp
class ScalingMultiConverter : IMultiValueConverter
{
    public object Convert(object[] values, Type targetType,
            object parameter, CultureInfo culture)
    {
        if (!ValuesPopulated(values))
            return 0.0;

        double containerWidth = (double)values[2];
        double valueToScale = (double)values[1];
        double maximum = (double)values[0] ;

        return valueToScale * containerWidth / maximum;
    }

    private bool ValuesPopulated(object[] values)
    {
        foreach (object value in values)
        {
            if (value==null || value.Equals(DependencyProperty.UnsetValue))
                return false;
        }
        return true;
    }

    public object[] ConvertBack(object value, Type[] targetTypes,
                object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
~~~

The net effect of the above XAML and value converter is that each quantitative range is rendered as a rectangle, with its length (i.e. width) specified by its maximum value. The one caveat of this approach is that the ranges must be supplied to the `ItemsControl` in descending size order, or some of them will become hidden. This is an unreasonable constraint to place on the client of this user control, so instead, the ranges are suitably sorted in the code-behind. This is the only code-behind for the Bullet Graph control.

The qualitative measure rendering is shown below, with `ShowGridLines` enabled for the hosting Grid.

![wpf_qualitativeranges.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/wpf_qualitativeranges.png)

### Featured Measure

The XAML for rendering the featured measure is quite similar to that for the qualitative ranges, with a single rectangle rendered as follows:

~~~xml
<!-- featured measure -->
<Rectangle x:Name="featuredMeasure" Grid.Row="1" Fill="Black"
                HorizontalAlignment="Left"
           DataContext="{Binding ElementName=bulletGraph}"
           Height="{Binding Path=ActualHeight,
                    ElementName=qualitativeRangeBar,
                    Converter={StaticResource ScalingConverter},
                    ConverterParameter=3}">
    <!-- the rectangle width defines the length of the featured measure bar -->
    <Rectangle.Width>
        <MultiBinding Converter="{StaticResource ScalingMultiConverter}">
            <Binding Path="(c:BulletGraphWithLegend.GraphRange)"/>
            <Binding Path="(c:BulletGraphWithLegend.FeaturedMeasure)"/>
            <Binding Path="ActualWidth"/>
        </MultiBinding>
    </Rectangle.Width>
    <Rectangle.ToolTip>
        <StackPanel Orientation="Horizontal">
            <TextBlock Text="Featured Measure: "/>
            <TextBlock Text="{Binding Path=
            (c:BulletGraphWithLegend.FeaturedMeasure)}"/>
        </StackPanel>
    </Rectangle.ToolTip>
</Rectangle>
~~~

The height of the rectangle is bound to the `ActuaHeight` of the qualitative range. The `ActualHeight` and `ActualWidth` properties of `FrameworkElement`s are updated during the various layout passes when elements are rendered. This binding makes use of a simpler scaling value converter which takes a fixed scaling factor. In this case, it can be seen that the featured measure will be one-third of the height of the qualitative range bar.

The length (i.e. width) of the featured measure bar again uses the `ScalingMultiConverter`, where the value to scale is the `FeaturedMeasure` of the Bullet Graph control; note also that the `Rectangle DataContext` is bound to the `UserControl` avoiding the need to repeatedly use `ElementName` bindings within the `Rectangle`'s scope.

The Bullet Graph with featured measure added is shown below:

![wpf_featuredmeasure.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/wpf_featuredmeasure.png)

The addition of a tooltip to the featured measure is a very easy task, with all `FrameworkElement` sub-classes supporting a tooltip which itself has a rich content model.

### Scale Bar

~~~xml
<UserControl ... x:Name="bulletGraph" >
   ...
  <UserControl.Resources>
    <!-- for each item within the scale bar compute
        the Canvas.Left property value -->
    <Style TargetType="ContentPresenter" x:Key="scaleBarItem">
      <Setter Property="Canvas.Left">
        <Setter.Value>
          <MultiBinding ConverterParameter="-0.5"
        Converter="{StaticResource ScalingMultiConverter}">
            <!-- maximum value -->
            <Binding Path="(c:BulletGraphWithLegend.GraphRange)"
        ElementName="bulletGraph"/>
            <!-- value to scale -->
            <Binding Path="."/>
            <!-- range to scale over -->
            <Binding Path="ActualWidth" ElementName="bulletGraph"/>
          </MultiBinding>
        </Setter.Value>
      </Setter>
    </Style>
  </UserControl.Resources>
  ...
  <!-- top scale bar -->
  <ItemsControl x:Name="scaleBarTop" Grid.Row="0"
                ItemContainerStyle="{StaticResource scaleBarItem}"
            ItemsPanel="{StaticResource canvasItemControl}"
                ItemsSource="{Binding Path=(c:BulletGraphWithLegend.GraphRange),
                                      ElementName=bulletGraph,
                                      Converter={StaticResource ScaleBarConverter}}">
    <ItemsControl.ItemTemplate>
      <DataTemplate>
        <Canvas>
          <Line Y2="{Binding Path=ActualHeight, ElementName=scaleBarTop}"
                Stroke="Black" X1="1" X2="1" Y1="0"/>
        </Canvas>
      </DataTemplate>
    </ItemsControl.ItemTemplate>
  </ItemsControl>
...
</UserControl>
~~~

Again, an `ItemsControl` is being used to render the scale bar where each `Item` is a single tick. The tick mark itself is a simple line, with bindings used to ensure that its height occupies the full height of the row which contains it. The interesting part is how the X position of each tick mark is located.

The `ItemsControl` is bound to the `GraphRange` property of the Bullet Graph, which is a scalar value. The `ScaleBarConverter` which is used in this binding converts this scalar into an array of values which locate each tick mark. For example, a `GraphRange` of 300 will be converted to the following array: {0, 50, 100, 150, 200, 250, 300}.

The `ItemContainerStyle` property sets the style used by the `ItemContainer`, which is the host container for each `Item` within the control. The given style sets the `Canvas.Left` attached property of the item container, with the result being that each canvas within the scale bar is correctly positioned. The responsibility of positioning the items is delegated to the `ItemsControl`; therefore, all we have to do in order to render the tick mark is draw a vertical line.

The same `ItemContainerStyle` is used for the lower scale bar, which contains both a tick mark and a label. Again, the responsibility of positioning the tick mark / label is factored out so that the item template simply draws the tick and label. See the source code attached to the article for details.

The Bullet Graph with both scale bars is shown below. The border of the scale bar labels is shown to highlight the way in which the `ItemsControl` is being used to locate each item.

![wpf_scalebar.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/wpf_scalebar.png)

For readers who might be interested, the algorithm that converts the scale bar maximum value into an array of tick marks is given below:

~~~csharp
class ScaleBarConverter : IValueConverter
{
    // the maximum number of ticks which should be rendered
    private static int MaximumNumberOfTicks = 7;

    // multipliers which, when applied is sequence,
    //provide an aesthetic scalebar
    private static double[] Multipliers = new double[] { 2.5f, 2, 2 };

    public object Convert(object value, Type targetType,
                          object parameter, CultureInfo culture)
    {
        if (value == null || value.Equals(0.0))
            return null;

        double range = (double)value;

        // determine the tick spacing
        double tickSpacing = range > 0 ? 1 : -1;
        int multiplierIndex = 0;
        while (Math.Abs(range / tickSpacing) > MaximumNumberOfTicks)
        {
            tickSpacing *= Multipliers[multiplierIndex % Multipliers.Length];
            multiplierIndex++;
        }

        // determine the total number of scalebar ticks
        int tickCount = (int)(range / tickSpacing) + 1;

        // construct the scale
        double[] scale = new double[tickCount];
        for (int i = 0; i < tickCount; i++)
            scale[i] = i * tickSpacing;

        return scale;
    }

    public object ConvertBack(object value, Type targetType,
                              object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
~~~

The algorithm determines the tick-spacing via an iterative approach. Starting with a spacing of one, on each iteration, it determines how many ticks would be present if that spacing were used, and compares that to the maximum accepted number (in this case, hard-coded to seven). If the test fails, the tick-spacing is increased by a certain amount. It is these amounts, determined by an array of multiplication factors, which result in an aesthetic scale bar.

The following example shows how the tick spacing for a scale bar with a maximum of 300 is computed, where ‘m’ indicates the multiplier array.

~~~
1 => gives 300 tick marks

1 * (m[0]=2.5)   = 2.5 =>  120 tick marks

2.5 * (m[1]=2)   = 5   =>  60 tick marks

5 * (m[2]=2)     = 10  =>  30 tick marks

10 *(m[0]=2.5)   = 25 =>  12 tick marks

25 * (m[1]=2)    = 50  =>  6 tick marks
~~~

A tick spacing of 50 units is the first one to result in less than 7 tick-marks; therefore, this is selected as the tick spacing.

### Finishing Touches

The WPF bullet graph control is also nested within another `UserControl`, `BulletGraphWithLegend`, in much the same way as the WinForms control. However, WPF has the concept of property inheritance, which means that there is no need to define the same properties in the container to form a ‘wrapper’.

The requirement that Bullet Graphs can be rendered in a right-to-left orientation is easily achieved via the application of a `RenderTransform` on the control's parent `Grid`. However, this results in all child elements being mirrored, including the label text! An easy way to counter this effect is to apply the same transform a second time to the scale labels, resulting in text which is mirrored twice and hence oriented correctly. See the attached source for details.

WPF also includes Designer support with property descriptions and categories.

Finally, data-binding support with WPF is a given. All the properties of the Bullet Graph are exposed as dependency properties, allowing the client to bind to any of them.

The finished WPF Bullet Graph is shown (above), with the WinForms implementation shown directly beneath for comparison.

![wpf_complete.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/wpf_complete.png)

![winforms_complete.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/winforms_complete.png)

## Summary

From the image above, it can be seen that the WPF and WinForms implementations look very similar, but I hope it is clear from the code-snippets above that their implementations couldn't be more different. In this section, I will briefly highlight some of these differences.

One striking difference between WPF and WinForms is that WPF offers far more mechanisms for control and content layout. Both Windows Forms and WPF share a number of common layout mechanisms, allowing tabular, flow (and more) arrangement of controls, via their respective `Panel` classes. However, with WPF, the layout can be further enhanced by the use of data-binding, which allows you to express complex relationships such as “Make element A two-thirds the height of element B, and position it on its bottom-left corner”. This is something that newcomers to WPF often miss; data-binding is not restricted to business data (e.g., name, address, order quantity), it can be used to bind any one dependency property to another, making it very useful for layout (as an aside, I have often wished that this were possible with CSS; there are so many hacks employed that would just vanish if you could, for example, make one `DIV` the same height as another). A direct result of this superior layout mechanism is that the WPF Bullet Graph does not contain any of the algorithmic code that its WinForms counterpart does, making it cleaner, clearer, and easier to understand.

WPF also adds another dimension with the highly flexible `ItemsControl`. Dr. WPF's [ItemsControl Intelligence Quotient](http://theiridescentthong.drwpf.com/ICIQ/) clearly demonstrates the myriad ways this uber-flexible control can be employed.

When it comes to clarity, WPF is not always a clear winner. The XAML syntax can be highly verbose, which, in part, is due to it being expressed in XML. Furthermore, unlike CLR properties which are part of the runtime, Dependency Properties are purely implementation. This goes some way to explain why the construction of a Dependency Property and its respective CLR wrapper (which is not strictly mandatory; however, the Visual Studio editor will not recognize a property without a CLR wrapper) is so verbose. It’s almost enough to make me miss macros!

Personally, I think that a lot more care is required to make XAML clear and readable than its C# equivalent. Within C#, the problem is decomposed into variables and methods which, if well written, are self-documenting. However, XAML expresses a much more complex structure, where properties are inherited, and bindings are used to express complex inter-relationships. It is very easy to end up in a tangled mess. For example, great care needs to be taken with inherited properties such as the `DataContext`, where a change in this important property near the root of your logical tree could have a significant, yet not at all obvious impact on the property bindings of the element's descendants.

Finally, one more difference between the WPF and WinForms control, which I do not feel falls in favour of the WPF version. Compare a close up of the two controls given below:

![zoomed.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/zoomed.png)

We can see that the WPF control is anti-aliasing the text. The algorithm used for anti-aliasing the text is seen by many as being inferior, and it is at its worse when text is animated, resulting in a strange ‘settling’ effect. Furthermore, anti-aliasing cannot be disabled. You can follow the debate on one of the MSDN WPF Forum’s most [hotly debated threads](http://social.msdn.microsoft.com/Forums/en-US/wpf/thread/1ad9a62a-d1a4-4ca2-a950-3b7bf5240de5).

In the above images, you can see that the tick marks are also anti-aliased in a rather smudgy fashion, whereas the featured measure and quantitative ranges are quite clear. This is because the `SnapsToDevicePixels` property common to all `UIElement` subclasses can be used to ensure that the device independent units used by WPF are ‘snapped’ to device pixels. However, `SnapsToDevicePixels` appears to have no effect on `ItemsControls`. This question is the subject of an as-of-yet unanswered thread on the [MSDN WPF Forums](http://social.msdn.microsoft.com/Forums/en-US/wpf/thread/66b89e38-60fc-44a0-9fb1-b5e968c0349c), answers on a postcard please …

## Conclusions

This article set-out to present a comparison between WPF and WinForms with respect to the development of a Bullet Graph control. I hope that the differences highlighted help others decide whether they wish to use WPF in their next project.

This article has turned out much longer than I initially envisioned, partly due to my own personal interest in, and joy of using WPF. I'm sure I mentioned something about being free from bias? Now, I've gone and blown it!

WPF certainly offers the developer a much more powerful framework than its predecessor, and the community is still discovering how to harness this power to its full effect.

Back to the earlier question, “Is WPF ready for LOB?” I am going to give the only sensible answer, “it depends”. What is certainly clear to me is that graphical effects aside, WPF has a lot to offer LOB applications, including features seen in this article such as flexible data-binding and advanced layout techniques, and some which were not, such as data templating. These architectural patterns will certainly benefit any application, LOB or otherwise.

Now, if you'll excuse me, I'm off to see if I can implement Conway’s [Game of Life](http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) entirely within data-bindings …

(Thanks to my colleague David Pentney for suggesting a Bullet Graph as the subject of this article.)
