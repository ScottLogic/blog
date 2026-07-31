---
title: KnockoutJS vs. Silverlight
date: 2012-08-01 00:00:00 Z
categories:
- Tech
tags:
- silverlight
author: ceberhardt
layout: default_post
source: codeproject
summary: Compares Silverlight and KnockoutJS by implementing the same quiz application
  with both frameworks, examining view models, data binding, templating, commands,
  and data handling side by side. A practical guide for Silverlight developers looking
  to leverage their existing MVVM knowledge when moving to JavaScript development.
---

*This article was originally published on CodeProject, which has since shut down.*

## Overview

This article compares Silverlight and KnockoutJS (<http://knockoutjs.com/>) by looking at the implementation of the same application with both frameworks.  During this comparison we’ll see that there are a great many similarities between the two frameworks, with the same concepts appearing in each. However, the execution / realisation of these concepts is quite different. Finally, we’ll look at the all-important question: **"Which is better, Silverlight or Knockout?"**

*Let the battle commence ...*

## Introduction

There is no denying that the popularity of HTML5 and JavaScript is on the rise. Complex web applications which were previously the domain of plugin technologies (Silverlight, Flex, Flash, Java Applets) are now increasingly being written using JavaScript. Which technology to choose for a particular web development is the subject of another article altogether ([Flex, Silverlight or HTML5 Time to Decide …](http://www.scottlogic.co.uk/blog/colin/2011/05/flex-silverlight-html5-time-to-decide/)), this article instead focuses on Silverlight developers and how they can make the most of their existing skills by using the KnockoutJS framework.

So why KnockoutJS? Good question! To help answer this, we’ll take a brief look at the differences between Silverlight and HTML5 / JavaScript development.

Silverlight has three main components, the first is the language itself (C# or VB.NET), the second is the core libraries that are common to all .NET languages, and the third is the Silverlight framework itself, which includes concepts of controls, animations and XAML. With JavaScript development things are very different, the language itself fulfils the same role as C#, however there are no standard libraries that perform the same functions as the core .NET and Silverlight APIs. Instead, there are numerous frameworks that fill the gaps and a typical JavaScript application will make use of a range of these.

There are a number of JavaScript frameworks that support pattern-based UI design (MVP, MVC). You can see a practical demonstration of 16 (yes 16!) different UI frameworks in the [ToDoMVC project](http://addyosmani.github.com/todomvc/), which re-implements the same simple application with each framework. For the Silverlight developer wishing to learn JavaScript application development Knockout is an obvious choice because it supports the Model-View-ViewModel (MVVM) pattern, which is the UI pattern ‘baked in’ to the Silverlight framework. Knockout is relatively new, first being released in 2010. It has also attracted the attention of Microsoft, who recently hired Steve Sanderson, the creator of this framework. However, Microsoft did not acquire Knockout, which remains an open source project.

NOTE: Throughout this article I will refer to CSS, HTML, JavaScript and Knockout collectively as just ‘Knockout’. All four are quite distinct technologies in their own right, but for brevity, we will consider them all to be components of our Knockout solution.

## The Demo Application

In order to introduce Silverlight developers to JavaScript and Knockout development, this article will describe the development of a simple application using both technologies. The application is a Quiz, with screenshots of the Silverlight and Knockout versions shown below:

![SilverlightQuiz]({{ site.baseurl }}/ceberhardt/assets/codeproject/SilverlightQuiz.jpg)

**Silverlight Version**

![KnockoutQuiz]({{ site.baseurl }}/ceberhardt/assets/codeproject/KnockoutQuiz.jpg)

**Knockout Version**

As can be seen from the screenshots above, the two versions of the application look virtually identical.

## An Overview of the Application View-Model Structure

Both applications have exactly the same view-model structure, shown below as a simple model:

![uml]({{ site.baseurl }}/ceberhardt/assets/codeproject/uml.png)

A brief description of the view models and their responsibilities is given below:

- `QuestionViewModel` – this details a single question, which includes the question text itself, together with the possible answers. This view model also stores the answer which the user selected.
- `AnswerViewModel` – this details a single potential answer to a question. This view model does not contain any dynamic state.
- `ResultsViewModel` – this details how many questions the user got right. An instance of this view model is generated dynamically when they complete the quiz.
- `QuizWizardViewModel` – this view model manages the overall application flow, navigating from one question to the next as indicated by the `CurrentQuestion` property. When the user has answered all of the questions correctly, this view model generates a `ResultsViewModel` instance.

## View-Models - INotifyPropertyChanged vs. Observable

Within this article we’ll focus most of our attention on the `QuestionViewModel`, which exhibits most of the features which we need to aid our comparison.

The Silverlight view-model is shown below:

~~~csharp
public class QuestionViewModel : ViewModelBase
{
  private AnswerViewModel _selectedAnswer;

  public QuestionViewModel()
  {
    // detailed later ...
  }

  public QuizWizardViewModel Parent { get; private set;}

  public string Text { get; private set; }

  public int Index { get; private set; }

  public List<AnswerViewModel> Answers { get; private set; }

  public string InterestingFacts { get; private set; }

  public string Category { get; private set; }

  public AnswerViewModel SelectedAnswer
  {
    get
    {
      return _selectedAnswer;
    }
    set
    {
      _selectedAnswer = value;
      OnPropertyChanged("SelectedAnswer");
    }
  }
}
~~~

The above view model is pretty standard in that it contains a number of properties which will be bound to the UI. These properties fall into two classes, the first which we consider to be immutable (i.e. their value does not change) which are just regular properties; and the second, which change as a result of UI interactions or application logic, these are implemented to raise change notifications via `INotifyPropertyChanged`.

Because of the boiler-plate code involved with `INotifyPropertyChanged`, the view-model extends a common base class:

~~~csharp
public class ViewModelBase : INotifyPropertyChanged
{
  #region INotifyPropertyChanged Members

  public event PropertyChangedEventHandler PropertyChanged;

  protected void OnPropertyChanged(string property)
  {
    if (PropertyChanged != null)
    {
      PropertyChanged(this, new PropertyChangedEventArgs(property));
    }
  }

  #endregion
}
~~~

Which is also quite common practice.

So let’s have a look at the equivalent Knockout view-model:

~~~jscript
QuestionViewModel = function (index, config) {

  // ------ properties

  this.index = index;
  this.text = config.text;
  this.category = config.category;
  this.interestingFact = config.interestingFact;
  this.answers = [];
  this.selectedAnswer = ko.observable();

  //  ------ construction logic

  // detailed later!
};
~~~

One of the first differences here is that the view-model itself is a function rather than a class. This is because JavaScript is not a strongly-typed language, i.e. you do not define your own types (classes) then construct instances of them. Instead, objects can be built dynamically by adding properties and functions to them. The above code defines the view-model using a Constructor Function, in other words `QuestionViewModel` is a function which constructs an object, dynamically adding properties to the object and setting their values. For further details I would recommend reading the article ["Object Oriented Programming in JavaScript"](http://mckoss.com/jscript/object.htm) by Mike Koss.

In common with the Silverlight view-model there are properties which we do not expect to change, such as `text` and `index`, and those which do change, e.g. `selectedAnswer`. In the above view-model `selectedAnswer` is constructed via a call to `ko.observable()`. This function creates an observable property, which has a built in mechanism for notifying subscribers of value changes. This is the Knockout equivalent to `INotifyPropertyChanged`.

It is worth noting that in Silverlight properties and property accessors are a first-class feature of the language, where an auto property with a private setter provides a convenient shorthand for creating immutable properties. JavaScript on the other hand does not widely support the concept of getters and setters (this is a [recent language feature that some browser do support](http://ejohn.org/blog/javascript-getters-and-setters)), but in order to maximize ‘reach’ Knockout does not use it). As a result of this, JavaScript does not support immutable properties. Furthermore, the lack of getters and setters means that the use of `ko.observable` means that the `selectedAnswer` property cannot be set like a regular property, instead it must be *invoked*.

~~~jscript
var viewModel = new QuestionViewModel(…)
viewModel.selectedAnswer = foo; // this will fail – badly!
viewModel.selectedAnswer(foo); // that’s better ;-)
~~~

Because this is a slightly unnatural syntax, I must admit I find myself making this mistake all too often!

In brief, Knockout view-models are much more compact, but lack immutable properties and have a slightly clumsy syntax for setting properties.

## Binding – Markup Extensions vs. data-bind

Before launching into a complete view, we’ll take a look at the binding syntax of each framework. Both share the concept of a data-context, where the regions of the application UI are ‘backed’ by a view model, such that it is the source for any binding defined within that region. With Silverlight you simply set the DataContext of the view to the view model:

~~~csharp
this.DataContext = new QuestionViewModel(...);
~~~

Whereas in Knockout you invoke the applyBindings function:

~~~jscript
ko.applyBindings(new QuestionViewModel(...));
~~~

Not much difference there!

Note that Knockout has the concept of a data-context, which is called the binding context within the documentation. However, unlike Silverlight it is not a property that you can set or inspect directly.

With Silverlight you can bind to any dependency property of an element within the visual tree. Bindings are typically defined using the `{Binding}` markup extension:

~~~xml
<StackPanel Orientation="Horizontal">
  <TextBlock Text="Q"/>
  <TextBlock Text="{Binding Path=Index}"/>
  <TextBlock Text=")"/>
</StackPanel>
~~~

Whereas Knockout uses a [HTML5 custom data attribute](http://ejohn.org/blog/html-5-data-attributes/), data-bind, as shown in the following example:

~~~html
<div class="index">Q<span data-bind="text: index" />)</div>
~~~

The above `text` binding will render the value of the index property within the body of the span element. Knockout has a small handful of built-in bindings for `text`, `css` and `visibility`, together with a generic `attr` binding that can be used to bind and attribute of the element to a view-model property.

While Silverlight and Knockout bindings look similar on the surface, there is one quite significant difference. Both frameworks expect you to bind a property value that is compatible with the binding target. With Silverlight, this means you often find yourself requiring type converters for properties such as visibility. Whereas, with Knockout, JavaScript type coercion and the fact that most DOM properties can be set as strings, means that type conversion is rarely needed.

With Silverlight you can bind properties to the UI that do not raise `PropertyChanged` events, this results in a one-time binding, i.e. the initial property value is set on the UI element, but any subsequent updates are ignored. Likewise, with Knockout you can bind properties that are not observables and achieve the same effect.

## Creating the Basic UI – Templates vs. UserControls

Now that we have a basic understanding of view models and bindings, we’ll look at how these are put together into a view. With Silverlight, the UI is composed of user controls (or custom controls), which are defined using XAML. A common approach with the MVVM pattern is to define a separate view for each view model.

The `MainPage.xaml` which is the starting point for our application contains a single instance of `QuizWizardView`:

~~~xml
<UserControl x:Class="EcoQuiz.MainPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="clr-namespace:EcoQuiz.View"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d" d:DesignWidth="640" d:DesignHeight="480">
  <Grid x:Name="LayoutRoot">
    <local:QuizWizardView />
  </Grid>
</UserControl>
~~~

Which is a user control that renders the green background, title and the current question:

~~~xml
<UserControl x:Class="EcoQuiz.View.QuizWizardView"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:vsm="clr-namespace:System.Windows;assembly=System.Windows"
    xmlns:local="clr-namespace:EcoQuiz.View"
    Width="450" Height="400" Foreground="White"
    FontFamily="Verdana"
    FontSize="14">

  <Border CornerRadius="20" BorderThickness="5">
    <Border.Background>
      <LinearGradientBrush StartPoint="0,0" EndPoint="0,1" >
        <GradientStop Color="#739A39" Offset="0" />
        <GradientStop Color="#A5CF63" Offset="1.0" />
      </LinearGradientBrush>
    </Border.Background>

    <Grid Margin="10">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/>
        <RowDefinition />
      </Grid.RowDefinitions>

      <TextBlock Text="{Binding Path=Title}" FontSize="25" Margin="10"
                 FontFamily="Georgia"/>

      <local:QuestionView Grid.Row="1"
                          Margin="0,10,0,0"
                          DataContext="{Binding Path=CurrentQuestion}"/>

    </Grid>
  </Border>
</UserControl>
~~~

We’ll leave detailing the `QuestionView` until later. In our application, the ‘root’ view-model is constructed when the application starts, within the `App.xaml.cs` file, as shown below:

~~~csharp
private void Application_Startup(object sender, StartupEventArgs e)
{
  QuizWizardViewModel quiz = new QuizWizardViewModel();
  quiz.Title = “Eco-Quiz”;

  ((FrameworkElement)this.RootVisual).DataContext = quiz;
}
~~~

The visual tree `DataContext` inheritance will ensure that the `DataContext` of our `QuizWizardView` is the `QuizWizardViewModel` instance created above. Running the application with the code so far, we see a beautifully shaded square with round borders, plus our quiz title:

![BasicLayout]({{ site.baseurl }}/ceberhardt/assets/codeproject/BasicLayout.jpg)

With Knockout, the approach is quite similar. Our application runs within the context of a HTML page, which includes the various scripts.  The views are defined as jQuery templates, which allow re-use of the same UI markup:

~~~html
<!DOCTYPE html>
<html>
<head>
  <script src="lib/jquery-1.6.1.min.js" type="text/javascript"></script>
  <script src="lib/jquery.tmpl.min.js" type="text/javascript"></script>
  <script src="lib/knockout-2.0.0.js" type="text/javascript"></script>

  <script src="viewModel/QuizWizardViewModel.js" type="text/javascript"></script>
  <script src="viewModel/QuestionViewModel.js" type="text/javascript"></script>

  <script src="app.js" type="text/javascript"></script>

  <link href="style.css" rel="stylesheet" type="text/css"></link>
  <title>Untitled Page</title>
</head>
<body>
  <!-- ... -->

  <script id="quizWizardView" type="text/x-jquery-tmpl">
    <h2 data-bind="text: title"
         class="title"></h2>
    <div data-bind="template: { name: 'questionView', data: currentQuestion }"
         class="question"></div>
  </script>

  <div id="app">
    <div data-bind="template: { name: 'quizWizardView' }"></div>
  </div>
</body>
</html>
~~~

The `template` binding creates an instance of the named template at the given location within our HTML document. The ‘root’ view-model is constructed and bound to the UI within the `app.js` file:

~~~jscript
$(document).ready(function () {
  viewModel = new QuizWizardViewModel();
  ko.applyBindings(viewModel);
});
~~~

Whilst the way in which the UI is constructed is very similar between Silverlight and Knockout, both of which have a mechanism for creating views via user controls and templates respectively, the markup for the UI itself is quite different. Anyone who has created UIs from XAML and HTML will understand that the two are quite different. XAML is geared towards creating applications, whereas HTML is geared towards presenting content. For this reason, something which is quite trivial in Silverlight, such as vertically centring content is [actually pretty tricky in HTML](http://phrogz.net/css/vertical-align/index.html), and conversely, creating a graceful flowing responsive magazine-style layout is almost impossible in Silverlight.

Another significant difference between Silverlight and Knockout applications is styling. In brief, Silverlight styles are simply collections of property values that are applied to elements via explicit references to the style. HTML is styled via CSS, which provides a complete separation between markup and style, where elements are matched using CSS selectors. The CSS for the quiz application is given below:

~~~css
#app
{
  position: relative;
  background: #739A39;
  width: 450px;
  height: 400px;
  margin: auto;
  padding: 10px;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  background: -webkit-linear-gradient(top, #739A39, #A5CF63);
  background: -moz-linear-gradient(top, #739A39, #A5CF63);
}

body
{
  font-size: 14px;
  font-family: Verdana, Sans-Serif;
  color: White;
}

.title
{
  font-size: 25px;
  font-family: Georgia, Serif;
}
~~~

(Note the use of vendor specific prefixes for the background gradient and border radius properties).

With the above styling in place, the Knockout UI looks almost exactly the same as the Silverlight one:

![BasicLayout]({{ site.baseurl }}/ceberhardt/assets/codeproject/BasicLayout.jpg)

## Rendering the Category Image – ValueConverters vs. HTML

Now that we’ve seen how the view is defined in both Silverlight and Knockout, and looked at the basic binding syntax for each, we’ll look into a more complex problem. Each question has a category, which is used to pick an image to accompany it.

The Silverlight `QuestionViewModel` has a string property, `Category`. In order to render this within the view, it is bound to the Source property of an Image element:

~~~xml
<Image Source="{Binding Path=Category, Converter={StaticResource CategoryToImageConverter}}"
        Grid.Row="0" Margin="0,0,0,10"
        HorizontalAlignment="Stretch" VerticalAlignment="Stretch"
        Stretch="UniformToFill"/>
~~~

However, the `Source` property is of type `ImageSource`, so we need to apply a value converter, constructing a `BitmapImage` from the string view-model property:

~~~csharp
public class CategoryToImageConverter : IValueConverter
{
  public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
  {
    string category = (string)value;
    var img = new BitmapImage(new Uri("/EcoQuiz;Component/View/" + category + ".jpg", UriKind.Relative));
    return img;
  }

  public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
  {
    throw new NotImplementedException();
  }
}
~~~

This sort of thing is much easier with Knockout. Firstly, the src property of an image element can simply be set to a string value, so we are able to bind to it directly. Secondly, Knockout permits you to use expressions directly within the bindings themselves, removing the need for value converters:

~~~html
<img class="picture"
     data-bind="attr: { src: 'view/' + category + '.jpg' }"/>
~~~

Note that Knockout doesn’t have a specific binding for the `src` property, so we use the generic `attr` binding.

With a simple bit of styling, both versions of the quiz application now render an image for each question:

![LayoutWithImage]({{ site.baseurl }}/ceberhardt/assets/codeproject/LayoutWithImage.jpg)

The Silverlight quiz application has no less than five value converters. In each case the Knockout implementation is much simpler due to the lack of strong typing, or simply due to the HTML elements accepting string values. Knockout also has a visibility binding, which provides a convenient way of showing / hiding an element based on a boolean view model property.

## Rendering the List of Answers – ItemsControls vs. foreach binding

The `QuestionViewModel` exposes a collection of potential answers. Within the Silverlight view-model implementation this is exposed as a generic `List`, and in the Knockout view-model as an array.

For the Silverlight version of the quiz application, a ListBox is used to render the answers associated with a question:

~~~xml
<!-- the question -->
<TextBlock Text="{Binding Path=Text}" Grid.Column="1" TextWrapping="Wrap"/>

<!-- the answers -->
<ListBox ItemsSource="{Binding Path=Answers}"
          SelectedItem="{Binding Path=SelectedAnswer, Mode=TwoWay}"
          BorderThickness="0"
          HorizontalAlignment="Left"
          Grid.Column="1" Grid.Row="1"
          Background="Transparent" Foreground="White">
  <ListBox.ItemTemplate>
    <DataTemplate>
      <StackPanel Orientation="Horizontal">
        <TextBlock Text="{Binding Path=Index, Converter={StaticResource IndexToLetterConverter}}"/>
        <TextBlock Text=". " />
        <TextBlock Text="{Binding Path=Text}"/>
      </StackPanel>
    </DataTemplate>
  </ListBox.ItemTemplate>
</ListBox>
~~~

Which yields the UI shown below:

![QuestionWithAnswers]({{ site.baseurl }}/ceberhardt/assets/codeproject/QuestionWithAnswers.jpg)

Again, a value converter is being used, this time to convert the index of each answer to a letter.

Knockout supports collection binding via a `template` with a `foreach` property. The markup below iterates over each of the items within the answers array, rendering an instance of the `answerView` template for each of the items. Any databindings within the `answerView` template have the answer instance as their datacontext:

~~~html
<script id="questionView" type="text/x-jquery-tmpl">
  ...

  <div data-bind="text: text" />
  <ul data-bind="template: { name: 'answerView', foreach: answers }"
      class="answers"/>
</script>

<script id="answerView" type="text/x-jquery-tmpl">
  <li>
    <span data-bind="text: String.fromCharCode(index + 64)"
          class="index"/>.
    <span data-bind="text: "text"
          class="answerText"/>
  </li>
</script>
~~~

We add a little bit of CSS:

~~~css
ul.answers
{
  margin: 0;
  padding: 0;
  float: left;
}

ul.answers li
{
  list-style-type: none;
  margin-top: 5px;
  cursor: pointer;
}
~~~

Resulting in a UI which looks exactly the same as the Silverlight one:

![QuestionWithAnswers]({{ site.baseurl }}/ceberhardt/assets/codeproject/QuestionWithAnswers.jpg)

Again, the Knockout collection binding is very similar to Silverlight, you can bind to collections that do not raise change notifications, for example in Silverlight you can use an `ItemsControl` to render a regular `List`, while in Knockout a `foreach` binding can render a regular JavaScript array. For change notification Silverlight uses the `INotifyCollectionChanged` interface (most typically via `ObservableCollection`), whereas Knockout uses [observable arrays](http://knockoutjs.com/documentation/observableArrays.html). An observable array is defined in exactly the same way as a regular (single-valued) observable property:

~~~jscript
this.answers = ko.observableArray();
~~~

Both frameworks take care of handling when items are added and removed from collections in order to keep the view synchronised.

## Some Silverlight Flair – Selection Binding

In the previous section it was shown how both Silverlight and Knockout collection binding can be used to render the potential answers to each question. But what happens when the user clicks on the answer that they think is correct?

Within the Silverlight version of the quiz application we can bind the `SelectedItem` property of the `ListBox` to a property of our view-model. When the quiz is complete we can simply total the number of questions where `question.SelectedAnswer.IsCorrect` is true.

~~~xml
<ListBox ItemsSource="{Binding Path=Answers}"
         SelectedItem="{Binding Path=SelectedAnswer, Mode=TwoWay}">
~~~

The Knockout UI is HTML, which does not really support the concept of controls and as a result the `ul` / `li` elements used to render the answers for a question do not support the concept of selection. With the Knockout implementation we have to add a click event binding which invoked a method on one of our view models:

~~~html
<script id="answerView" type="text/x-jquery-tmpl">
  <li data-bind="click: $parent.answerClicked">
    <span data-bind="text: String.fromCharCode(index + 64)" class="index"/>.
    <span data-bind="text: text" class="answerText"/>
  </li>
</script>
~~~

(We’ll look at what that special `$parent` pseudo-variable does in one of the later sections).

The `answerClicked` function is defined on the `QuestionViewModel`, which simply sets the `selectedAnswer` observable, yielding the same result as the Silverlight `ListBox.SelectedItem` binding:

~~~jscript
QuestionViewModel = function (index, config) {

  var that = this;

  // ------ properties

  // ...
  this.selectedAnswer = ko.observable();

  // ------ functions

  this.answerClicked = function (answer) {
    that.selectedAnswer(answer);
  }
};
~~~

Knockout does have a [selectedOptions binding](http://knockoutjs.com/documentation/selectedOptions-binding.html) which is almost what we are after here. As a general observation, Silverlight has a much stronger concept of UI controls, which can expose control-specific properties that can be bound to. This allows for complex UIs to be built quite rapidly from a suite of common controls, of which Silverlight has around 30 as part of the SDK and many more via third party suppliers.

## Mouse over effects – Visual States vs. CSS3 transitions

The current quiz application is a little plain, we’ll try to make it more interesting (at least within the confines of my artistic ability!) by adding a subtle highlight effect when the user hovers over each answer.

With Silverlight, transitions can be specified using the visual state manager. Controls are able to define visual states, such as `checked`, `focussed` and `mouseover`, you can then use the visual state manager to define the UI for each state and how to transitions between states. For our quiz application we’ll create a subtle highlight effect on mouse over:

~~~xml
<Style TargetType="ListBoxItem" x:Key="ListBoxItemStyle">
  <Setter Property="Padding" Value="3" />
  <Setter Property="HorizontalContentAlignment" Value="Left" />
  <Setter Property="VerticalContentAlignment" Value="Top" />
  <Setter Property="Background" Value="Transparent" />
  <Setter Property="BorderThickness" Value="1"/>
  <Setter Property="TabNavigation" Value="Local" />
  <Setter Property="Template">
    <Setter.Value>
      <ControlTemplate TargetType="ListBoxItem">
        <Grid Background="{TemplateBinding Background}">
          <vsm:VisualStateManager.VisualStateGroups>
            <vsm:VisualStateGroup x:Name="CommonStates">
              <vsm:VisualState x:Name="Normal" >
                <Storyboard>
                  <DoubleAnimation Storyboard.TargetName="fillColor" Storyboard.TargetProperty="Opacity" Duration="0:0:0.5" To="0"/>
                </Storyboard>
              </vsm:VisualState>
              <vsm:VisualState x:Name="MouseOver">
                <Storyboard>
                  <DoubleAnimation Storyboard.TargetName="fillColor" Storyboard.TargetProperty="Opacity" Duration="0:0:0.5" To="1"/>
                </Storyboard>
              </vsm:VisualState>
            </vsm:VisualStateGroup>
          </vsm:VisualStateManager.VisualStateGroups>
          <Rectangle x:Name="fillColor" Opacity="0" Fill="#44000000" IsHitTestVisible="False" RadiusX="1" RadiusY="1"/>
          <ContentPresenter
                          x:Name="contentPresenter"
                          Content="{TemplateBinding Content}"
                          ContentTemplate="{TemplateBinding ContentTemplate}"
                          HorizontalAlignment="{TemplateBinding HorizontalContentAlignment}"
                          Margin="{TemplateBinding Padding}"/>
        </Grid>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
~~~

The style above defines the template and visual state transitions for the `ListBoxItem`, which is generated by the `ListBox` as a container for each item within the list. In order to use the above style, we set the `ItemContainerStyle`:

~~~xml
<ListBox ItemsSource="{Binding Path=Answers}"
         SelectedItem="{Binding Path=SelectedAnswer, Mode=TwoWay}" Grid.Row="1"
         ItemContainerStyle="{StaticResource ListBoxItemStyle}">
~~~

This gives a subtle mouse over effect for each answer, which acts as a handy visual cue that these items are clickable:

![MouseOver]({{ site.baseurl }}/ceberhardt/assets/codeproject/MouseOver.jpg)

Visual states are another facet of the Silverlight concept of ‘controls’ and as a result, Knockout does not share this same feature. However, because the Knockout UI is defined as HTML, we can use CSS to achieve the same effect.

We can use the hover pseudo-selector to specify the mouse-over colour of each answer. But how do we create the subtle fade in / out effect? With CSS3 this is very simple. We can simply specify a transition for the `background-color` property:

~~~css
ul.answers li
{
  ...
  -webkit-transition: background-color 0.4s;
  -moz-transition: background-color 0.4s;
}

ul.answers li:hover
{
  background-color: rgba(0,0,0,0.2);
}
~~~

The transition indicates that any change in the background colour property should transition from the previous colour to the new over a period of 400 milliseconds.

The implementation of this same effect is very different between Silverlight and Knockout, with the Silverlight version being quite a lot more verbose. So why is this? There are a number of reasons; in order to define a visual state transition, you must re-template a control, replicating its existing template. Silverlight animations are strongly typed, therefore we have to choose the correct animation type for each property. Finally, Silverlight uses XAML to define the templates and storyboards which is always going to be a more verbose than alternatives.

I know which approach I prefer! The simplicity of the CSS3 approach, where the type of the property being transitioned does not change the syntax, is so much easier to implement. The lack of type-concerns is a common theme with Knockout development. Furthermore, a CSS3 transition will ensure that a property value transitions regardless of the mechanism used to set its value. Finally, the separation between style and markup that HTML and CSS provide is much superior to the separation that can be achieved in Silverlight.

Although, in Silverlight’s defence, the concept of visual states is entirely extensible, you can define whatever visual states make sense for your control and provide transitions between them.

## Next Question – Commands vs. functions

The `QuizWizardViewModel` exposes the current question view model via its `CurrentQuestion` property. With both the Silverlight and Knockout quiz application the user clicks on a ‘next’ link which advances the quiz to the next question.

The `QuizWizardViewModel` within the Silverlight application exposes a `NextQuestion` command:

~~~csharp
public ICommand NextQuestionCommand
{
  get
  {
    return new NextQuestionCommand(this);
  }
}
~~~

Where the command implementation simply invokes the `NextQuestion` method on the view-model:

~~~csharp
public class NextQuestionCommand : ICommand
{
  private QuizWizardViewModel _quiz;

  public NextQuestionCommand(QuizWizardViewModel quiz)
  {
    _quiz = quiz;
  }

  public bool CanExecute(object parameter)
  {
    return true;
  }

  public event EventHandler CanExecuteChanged;

  public void Execute(object parameter)
  {
    _quiz.NextQuestion();
  }
}
~~~

In a more complex application this would be a good candidate for using a generic [‘delegate command’](%28http://wpftutorial.net/DelegateCommand.html), but as this application only has a single command, we’ll follow the [YAGNI](http://en.wikipedia.org/wiki/You_ain%27t_gonna_need_it) principle and use the above implementation.

Within the view we include a button that binds to this command so that when it is clicked, the above code is invoked:

~~~xml
<Button Command="{Binding Parent.NextQuestionCommand}"
        Style="{StaticResource NextButtonStyle}"/>
~~~

(We’ll look at the ‘Parent’ in the above binding in the next section)

Knockout does not have the concept of commands, instead events are bound directly to functions defined on the view-model:

~~~html
<a href="#" data-bind="click: $parent.nextQuestion"
   class="next">
  Next
</a>
~~~

(Again, we’ll look at `$parent` in the next section!)

The `nextQuestion` function is simply defined on the view model as follows:

~~~jscript
QuizWizardViewModel = function (config) {

  // ...

  this.nextQuestion = function () {
    //...
    }
  }

};
~~~

The Knockout implementation of this functionality is again much simpler than the Silverlight version. The Silverlight concept of commands is more powerful than simple event-to-function wire-up, with features such as command-properties and the `ICommand.CanExecute` property which can be used to automatically disable a button (or other UI control) when a command cannot be executed. Although, in practice, these extra features are often not required, furthermore, command binding can be a little patchy within the Silverlight APIs, some controls which really *should* support commands do not, leading people to use solutions such as [MVVM Light’s EventToCommand behaviour](http://geekswithblogs.net/lbugnion/archive/2009/11/05/mvvm-light-toolkit-v3-alpha-2-eventtocommand-behavior.aspx). In order to avoid the whole command complexity, the Blend Interactivity SDK includes event triggers and a `CallMethodAction` that allows you to [wire an event directly to a method invocation](http://www.codeproject.com/Articles/160892/Binding-Events-to-Methods-in-the-Silverlight-MVVM), just like Knockout.

## Some Knockout Flair - $parent binding and Computed Observables

So far our comparison has focussed on features that are present in some shape or form in both the Silverlight framework and Knockout. In this section we’ll take a brief digression to look at a few rather neat features that Knockout has that lack a Silverlight equivalent.

In the previous section which looked at command binding we saw how the `QuizWizardViewModel` is responsible for navigating from one question to the next. Within both the Silverlight and Knockout applications the ‘next’ button lives within the template for the `QuestionViewModel`, so how do we wire up this button to invoke a command on the `QuizWizardViewModel` when the data-context of our UI is a `QuestionViewModel` instance?

Within Silverlight there is no direct support for this scenario. However, the solution to this problem is relatively simple, we add a relationship from the `QuestionViewModel` back to the `QuizWizardViewModel` as follows:

~~~csharp
public class QuestionViewModel : ViewModelBase
{
  ...

  public QuestionViewModel(QuizWizardViewModel parent)
  {
    Parent = parent;
  }

  public QuizWizardViewModel Parent { get; private set;}

  ...
}
~~~

This allows us to bind to the command exposed by the parent view model from within the `QuestionView` user control:

~~~xml
<Button Command="{Binding Parent.NextQuestionCommand}"
        Style="{StaticResource NextButtonStyle}"/>
~~~

You can also solve this issue via some sort of fancy relative-source bindings.

Even though the solution is relatively simple, I would rather not have to maintain bi-directional relationships within my code if I can help it. They provide the opportunity for all kinds of interesting errors if you need to move child elements from one parent to another.

The Knockout solution to this problem couldn’t be simpler. Whenever the binding context changes through a `template` binding (or `with` binding), the parent view model is accessible via the `$parent` pseudo variable. You can even locate the n’th parent via the `$parents` array, or locate the top-most view model via `$root`. As a result, the Knockout binding for the ‘next’ button click does not require any changes to our view-models:

~~~html
<a href="#" data-bind="click: $parent.nextQuestion"
    class="next">
  Next
</a>
~~~

Another very useful feature of Knockout is computed observables (previous called dependant observables). The `QuizWizardViewModel` for both the Silverlight and Knockout implementations stores the current question as an index into the array of questions. The Silverlight `QuizWizardViewModel` exposes the current question as follows:

~~~csharp
public QuestionViewModel CurrentQuestion
{
  get
  {
    return _questionIndex >= Questions.Count ? null : Questions[_questionIndex];
  }
}
~~~

This is pretty straightforward stuff, however, when creating properties that are derived from other properties of your view-model you must be careful to raise property change correctly. In the example above, whenever `_questionIndex` changes, we need to raise a property changed event for the `CurrentQuestion` property. This is pretty trivial in the above example, however with view-models that have properties that are derived from a number of other properties, this can become something of a maintenance nightmare.

Knockout has a very elegant solution to this problem, you simply create a computed observable, defining a function which is used to determine its value:

~~~jscript
this.currentQuestion = ko.computed(function () {
  return this.currentQuestionIndex() < this.questions().length ?
      this.questions()[this.currentQuestionIndex()] : null;
}, this);
~~~

... and Knockout takes care of the rest!

The framework ensures that whenever an observable property changes that impacts the value of a computed observable, any subscribers to the computed observable are notified of a change, resulting in bindings being updated.

So how does Knockout perform this magic? It’s actually quite simple really. When a computed observable is first created, Knockout invokes the evaluator function (i.e. the function you supply to Knockout which defines the property). Whilst this invocation is running, Knockout keeps a log of any observable property getters that are invoked and as a result it can determine the dependencies of the computed observable. Neat.

## Displaying the Results – Linq vs. $.grep

When the user has answered all of the questions, the number of correct answers are totalled and the results displayed. In order to achieve this the `QuizWizardViewModel` constructs and exposes a `ResultsViewModel` instance which causes the view to render the results template using techniques we have seen earlier in the article. However, the way in which the number of correct answers is totalled highlights another interesting difference between Silverlight and Knockout.

The Silverlight implementation uses a Linq `Count` query to count the number of correct answers:

~~~csharp
public void NextQuestion()
{
  _questionIndex++;

  if (_questionIndex >= Questions.Count)
  {
    int correctQuestions = Questions.Count(q => q.SelectedAnswer.IsCorrect);
    Results = new ResultsViewModel(correctQuestions, Questions.Count);
  }

  OnPropertyChanged("CurrentQuestion");
}
~~~

As a result of setting the `Results` property, the `ResultsView` is rendered:

![ResultsView]({{ site.baseurl }}/ceberhardt/assets/codeproject/ResultsView.jpg)

The Knockout implementation looks quite similar:

~~~jscript
this.nextQuestion = function () {
  that.currentQuestionIndex(that.currentQuestionIndex() + 1);

  if (that.currentQuestionIndex() >= that.questions().length) {
    var correctAnswers = $.grep(that.questions(), function (question) {
      return question.selectedAnswer().isCorrect;
    });
    that.results(new ResultsViewModel(that.questions().length, correctAnswers.length));
  }
}
~~~

However the way in which the number of correct answers is totalled highlights an interesting difference between the frameworks. Silverlight applications have access to a huge range of utility classes, APIs and tools which are all part of the [.NET Base Class Library](http://en.wikipedia.org/wiki/Base_Class_Library) (BCL). The Linq `Count` query used in the code above is part of this standard library and can be employed within a WPF, ASP.NET, WP7 or any other .NET application.

In contrast, the JavaScript language lacks an equivalent to the BCL, having a relatively small collection of built in functions. For any non-trivial JavaScript applications you will probably need a more extensive set of library functions. jQuery provides a small number of utility functions, and in the above example I make use of the `grep` function it provides. However, libraries such as [underscore](http://documentcloud.github.com/underscore/) provide a more extensive set of tools.

The take-home message here is that Silverlight applications have access to a comprehensive set of APIs which can be used to implement view-model logic, whereas with JavaScript you have to find a suitable library or set of libraries to fill the gaps in the JavaScript language. It is unlikely you will find anything quite as rich as the .NET BCL.

## Supplying the Quiz Data – Input Parameters & XML vs. JavaScript & JSON

So far we have looked at the view-models that define how the user interacts with the quiz application, but we haven’t touched on how these view-models are constructed. If we want our quiz application to be versatile and re-useable it would make sense to externalise the data for a specific quiz.

With the Silverlight application the quiz is defined in XML:

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<quiz title="Eco-Quiz">
  <question text="How much household waste does each person create a year?"
            category="rubbish"
            interestingFacts="That's almost 10 times the weight of an average person. Just think how much waste is created throughout your lifetime ... how can you reduce the 50,000 kg of waste you might leave behind?">
    <answer text="150 kg"
            isCorrect="false"/>
    <answer text="513 kg"
            isCorrect="true"/>
    <answer text="1025 kg"
            isCorrect="false"/>
  </question>
  <question text="How much less energy does it take to make an aluminium can by recycling that creating a new one?"
            category="cans"
            interestingFacts="That's an incredible energy saving! The energy saved is enough to power a television for 3 hours.">
    <answer text="10 %"
            isCorrect="false"/>
    <answer text="40 %"
            isCorrect="false"/>
    <answer text="95 %"
            isCorrect="true"/>
  </question>
  <question text="True or false: Does a 100 watt bulb produce the same amount of light as two 50 watt bulbs?"
            category="lightbulb"
            interestingFacts="Not many people know that 100 watt bulbs are more efficient that 50 watt bulbs and produce more light from the energy the consume, so a simple green tip is to use fewer, higher powered bulbs.">
    <answer text="True"
            isCorrect="false"/>
    <answer text="False"
            isCorrect="true"/>
  </question>
  <question text="What percentage of the average households electricity bill is from appliances left on standby?"
            category="washing"
            interestingFacts="To save the environment ... and save you money ... before you go to bed each night, turn all your appliances off at the wall socket.">
    <answer text="0-2 %"
            isCorrect="false"/>
    <answer text="8-10 %"
            isCorrect="true"/>
    <answer text="12-14 %"
            isCorrect="true"/>
  </question>
</quiz>
~~~

With each view-model being responsible for transforming their corresponding XML elements in to the required property values. For example, the `QuizWizardViewModel` identifies obtains the quiz title attribute, then constructs a `QuestioNViewModel` instance from each question element:

~~~csharp
public class QuizWizardViewModel : ViewModelBase
{

  public QuizWizardViewModel(XDocument xml)
  {
    Title = xml.Root.Attribute("title").Value;

    Questions = xml.Descendants("question")
                  .Select((questionElement, index) => new QuestionViewModel(index, questionElement, this))
                  .ToList();

  }

  // ...
}
~~~

The `QuestionViewModel` constructor does the same:

~~~csharp
public class QuestionViewModel : ViewModelBase
{

  public QuestionViewModel(int index, XElement questionElement, QuizWizardViewModel parent)
  {
    Index = index + 1;
    Parent = parent;
    Text = questionElement.Attribute("text").Value;
    InterestingFacts = questionElement.Attribute("interestingFacts").Value;
    Category = questionElement.Attribute("category").Value;
    Answers = questionElement.Descendants("answer")
                            .Select((answerElement, i) => new AnswerViewModel(i, answerElement))
                            .ToList();
  }

  // ...
}
~~~

Creating the view-models from the XML data is quite straightforward. But how does the end-user of our application supply this XML? Any files we add as resources or embedded resources are compiled within the XAP file or application DLLs, so we need to find some other way of externalising this data.  
When a Silverlight application is instantiated you can specify a number of input parameters. The

EcoQuiz application expects a ‘data’ parameter which identifies the location of the XML file:

~~~xml
<object data="data:application/x-silverlight-2," type="application/x-silverlight-2"
  width="100%" height="100%">
  <param name="source" value="ClientBin/EcoQuiz.xap" />
  <param name="initParams" value="data=quiz.xml" />
  ...
</object>
~~~

In order to use this parameter, we read its value when the application starts, then use a `WebClient` to download the XML file:

~~~csharp
private void Application_Startup(object sender, StartupEventArgs e)
{
  this.RootVisual = new MainPage();

  string xmlFile = e.InitParams["data"];

  WebClient xmlClient = new WebClient();
  xmlClient.DownloadStringCompleted += new DownloadStringCompletedEventHandler(WebClient_DownloadStringCompleted);
  xmlClient.DownloadStringAsync(new Uri(xmlFile, UriKind.RelativeOrAbsolute));
}

private void WebClient_DownloadStringCompleted(object sender, DownloadStringCompletedEventArgs e)
{
  XDocument xml = XDocument.Parse(e.Result);

  QuizWizardViewModel quiz = new QuizWizardViewModel(xml);

  ((FrameworkElement)this.RootVisual).DataContext = quiz;
}
~~~

With the Knockout implementation the view-model constructor functions also expect to be passed the configuration data, and again the `QuizWizardViewModel` sets its title property and creates the question instances:

~~~jscript
QuizWizardViewModel = function (config) {

  var that = this;

  // ------ properties
  this.title = config.title;
  // ...

  //  ------ construction logic

  // create the child QuestionViewModel instances
  $.each(config.questions, function (index, question) {
    that.questions.push(new QuestionViewModel(index + 1, question));
  });

  // ...
}
~~~

And again, the `QuestionViewModel` sets its property values and constructs the answer view-models:

~~~jscript
QuestionViewModel = function (index, config) {

  var that = this;

  // ------ properties

  this.index = index;
  this.text = config.text;
  this.category = config.category;
  this.interestingFact = config.interestingFact;
  this.answers = [];
  this.selectedAnswer = ko.observable();

  //  ------ construction logic

  $.each(config.answers, function (index, answer) {
    // add an index to each answer, and add to our observable array
    answer.index = index + 1;
    that.answers.push(answer);

    // identify the correct answer
    if (answer.isCorrect) {
      that.correctAnswer = answer;
    }
  });

  // ...

};
~~~

So with Knockout, how do we create the quiz data that is used to construct our view-models? With JavaScript XML is not the most practical data format, most applications use JSON (JavaScript Object Notation) which has the advantage that it can be parsed directly to construct JavaScript objects. Creating the quiz is as simple as the following:

~~~jscript
var quiz =
{
  title : "Eco-Quiz",
  questions : [
    {
      text: "How much household waste does each person create a year?",
      category: "rubbish",
      interestingFact : "That's almost 10 times the weight of an average person. Just think how much waste is created throughout your lifetime ... how can you reduce the 50,000 kg of waste you might leave behind?",
      answers: [
        { text: "150 kg", isCorrect: false },
        { text: "250 kg", isCorrect: false },
        { text: "500 kg", isCorrect: true }
      ]
    },
    {
      text: "How much less energy does it take to make an aluminium can by recycling that creating a new one?",
      category: "cans",
      interestingFact : "That's an incredible energy saving! The energy saved is enough to power a television for 3 hours.",
      answers: [
        { text: "10 %", isCorrect: false },
        { text: "40 %", isCorrect: false },
        { text: "95 %", isCorrect: true }
      ]
    },
    {
      text: "True or false: Does a 100 watt bulb produce the same amount of light as two 50 watt bulbs?",
      category: "lightbulb",
      interestingFact : "Not many people know that 100 watt bulbs are more efficient that 50 watt bulbs and produce more light from the energy the consume, so a simple green tip is to use fewer, higher powered bulbs.",
      answers: [
        { text: "true", isCorrect: false },
        { text: "false", isCorrect: true }
      ]
    },
    {
      text: "What percentage of the average households electricity bill is from appliances left on standby?",
      category: "standby",
      interestingFact : "To save the environment ... and save you money ... before you go to bed each night, turn all your appliances off at the wall socket.",
      answers: [
        { text: "0-2 %", isCorrect: false },
        { text: "8-10 %", isCorrect: true },
        { text: "12-14 %", isCorrect: false }
      ]
    }
  ]
};

$(document).ready(function () {
  viewModel = new QuizWizardViewModel(quiz);
  ko.applyBindings(viewModel);
});
~~~

This makes it quite a bit easier to create a re-useable quiz application where users can supply their own data.

However, in Silverlight’s defence XML is a more ‘robust’ data format, allowing for checks to be added for well-formed or valid documents (if a schema is supplied). Although, this doesn't help with the fact that the interface between Silverlight and HTML / JavaScript (i.e. the hosting page) can feel a bit clumsy.

## Conclusions

Silverlight and Knockout have a lot of features in common, and for a Silverlight developer wishing to learn JavaScript development, Knockout is an excellent choice. However, while they share most of the same concepts, the implementation in each is quite different, with Knockout generally being much more concise than the Silverlight equivalent.

Again, I will stress that many of the examples I have given in this article where Knockout is more concise than Silverlight stem from JavaScript, HTML and CSS rather than from the Knockout framework directly.

So … **“which is better Knockout or Silverlight?”**

Good question! And I am going to dodge that one by saying “it depends”. I am still of the opinion that JavaScript technologies are better suited to simpler applications, whereas Silverlight is more suited to the construction of large-scale enterprise applications (I go into this in much more detail in my article [Flex, Silverlight or HTML5 Time to Decide …](http://www.scottlogic.co.uk/blog/colin/2011/05/flex-silverlight-html5-time-to-decide/)).

Instead, I’ll give an answer to a slightly simpler question **“which is the better technology for a quiz application? Knockout or Silverlight?”**

I can confidently state that for the quiz application described in this article Knockout is a much better choice. Despite being a more experienced Silverlight developer, I completed the Knockout implementation in approximately half the time. This is also entirely down to the fact that it is so much simpler.

I would urge any Silverlight developer to learn Knockout. You will not regret it.
