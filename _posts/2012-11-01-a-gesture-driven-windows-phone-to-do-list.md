---
title: A Gesture-Driven Windows Phone To-Do List
date: 2012-11-01 00:00:00 Z
categories:
- Tech
tags:
- codeproject
author: ceberhardt
layout: default_post
source: codeproject
summary: A Windows Phone to-do list application that replaces all buttons and checkboxes with gestures — swipes, pinches, and pull-to-add — inspired by the iPhone app Clear. The article walks through implementing each gesture recogniser using the Windows Phone toolkit.
---

*This article was originally published on CodeProject, which has since shut down.*

This article describes the development of a Windows Phone to-do list application that has a very simplified user interface, completely free from check-boxes, buttons and other common UI controls. Instead the application is controlled via swipes, pull-to-add, tap-and-hold and other intuitive gestures. This application started as a number of posts on my blog, originally inspired by the [iPhone application Clear](http://www.realmacsoftware.com/clear/). As the approaches I developed matured, I decided to re-organize and redesign the various snippets of code to create this article.

You can see the application in action in the video below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/xjEqORHkxEs" frameborder="0" allowfullscreen></iframe>

The full sourcecode for the application accompanies this article.

## Introduction – gestures, why don’t we use them more?

The Windows Phone User Interface (UI) follows the Metro Design Language with the resulting interface being quite a radical departure from previous Windows-based phones. The Metro theme makes a break from the [skeuomorphic interfaces](http://medialoot.com/blog/skeuomorphic-design/) of its peers (iPhone), and predecessors (Windows Mobile) with the ornamental features that give buttons depth, highlight and shadow being replaced with stark and flat regions of colour. The only hint at depth is given by a subtle tilt when user interacts with these elements.

![skeomorphic]({{ site.baseurl }}/ceberhardt/assets/codeproject/skeomorphic.png)

But just how radical is the Metro interface? On first inspection it certainly looks quite different to its peers, however, it still retains the common UI features and controls such as buttons, sliders and checkboxes albeit represented using much simpler graphics. Apart from the occasional gesture, we interact with our Windows Phones in much the same way that we interact with a desktop Windows interface. As an aside, this is why you can comfortably control your Windows Phone emulator on a desktop computer without a touch-monitor.

Other than text-entry most everyday user primarily interacts with their computer via the mouse. If you watch a very young child try to control a computer mouse, you will realise that it is not the most intuitive of input devices. Fortunately, once this skill is learnt; it does start to feel natural - a bit like riding a bicycle! The slightly detached nature of the mouse pointer does have a few minor advantages, for example, if the UI lags a little behind your mouse movements, when performing a drag operation for example, you are unlikely to notice.

With touch interfaces we lose this disconnect. Whereas with a mouse our ‘touch’ is communicated via a somewhat artificial on-screen pointer or cursor, with a touch interface there is no need for this as we interact with the objects directly.

Because of the more direct interaction that touch allows, mobile and tablet interfaces have been designed to make use of the physics of inertia, and elasticity. These make the object on screen seem more real, further adding to the illusion that you are interacting with them directly and that they are not simply a collection of pixels. A side-effect of this is that performance is more critical for touch interfaces. If you touch-drag an object, but application performance issues mean that it fails to keep up with you interactions, the illusion that this is a real object is immediately shattered.

The mobile multi-touch interface allows for much more control and expression than a simple mouse pointer device. Standard gestures have been developed such as pinch/stretch, flick, pan, tap-and-hold, however these are quite rarely used; one notable exception being pinch/stretch which is the standard mechanism for manipulating images. Despite the expressive nature of touch, we still fall back to the same old UI paradigms, buttons, slides and checkboxes.

When an application comes along that makes great use of gestures, it really stands out from the crowds. One such application is the [iPhone ‘Clear’ application](http://www.realmacsoftware.com/clear/) by Realmac software, a simple todo-list with not one button or checkbox in sight. You can see the app in action below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/S00H-rz7fGo" frameborder="0" allowfullscreen></iframe>

Interestingly, its use of pinch to navigate the three levels of menu is similar to the Windows 8 concept
of [‘semantic zoom’](http://www.scottlogic.co.uk/blog/colin/2011/11/an-introduction-to-semantic-zoom-in-windows-8-metro/).

When I first saw Clear - the clean, clutter-free interface spoke ‘Metro’ to me! … and I immediately wanted to bring this functionality to a Windows Phone.
My reasons for this are two-fold; Firstly, it looked like an application that could be challenging to write, and I enjoy a challenge! Secondly, I want to use
this application to encourage other developers to think a bit more about how they can use gestures to replace the tired-old desktop interface concepts.

I was not surprised to find out that my thoughts on gestures and how they can replace the classic UI components is not unique. My friend
Graham Odds ([@g\_odds](https://twitter.com/g_odds)) found some great notes online from a talk entitled [“Buttons Are A Hack”](http://www.lukew.com/ff/entry.asp?1566)
that are well worth reading.

**Note**: All of the work I share on CodeProject is under a Code Project Open
License. For this article post I just want to add that I do not want
someone to take this code in order to release a ‘Clear’ clone on the Windows Phone marketplace. All credit must to the creators of Clear for creating a highly innovative and unique application.
Be inspired, but do not copy.

## The Basic Application Structure

The application is a to-do list in its most basic form, items can be added, removed and their text edited. The individual items in the list are represented by a `ToDoItemViewModel`:

~~~csharp
/// <summary>
/// A single todo item.
/// </summary>
public class ToDoItemViewModel : INotifyPropertyChanged
{
  private string _text;

  private bool _completed;

  private Color _color = Colors.Red;

  public string Text
  {
    get { return _text; }
    set
    {
      _text = value;
      OnPropertyChanged("Text");
    }
  }

  public bool Completed
  {
    get { return _completed; }
    set
    {
      _completed = value;
      OnPropertyChanged("Completed");
    }
  }

  public Color Color
  {
    get { return _color; }
    set
    {
      _color = value;
      OnPropertyChanged("Color");
    }
  }

  public ToDoItemViewModel(string text)
  {
    Text = text;
  }

  public event PropertyChangedEventHandler PropertyChanged;

  protected void OnPropertyChanged(string property)
  {
    if (PropertyChanged != null)
    {
      PropertyChanged(this, new PropertyChangedEventArgs(property));
    }
  }
}
~~~

Each item has a `Text` property which describes the task, and further properties which describe whether the task is complete and its color. The UI for the application renders
the list of items colored such that they fade from red at the top to yellow at the bottom, hence the presence of a `Color` property for the to-do item (it is this property
that makes it a ViewModel rather than just a Model).

The collection of items is contained within the `ToDoListViewModel`:

~~~csharp
/// <summary>
/// A collection of todo items
/// </summary>
public class ToDoListViewModel
{
  private ResettableObservableCollection<ToDoItemViewModel> _todoItems =
          new ResettableObservableCollection<ToDoItemViewModel>();

  public ToDoListViewModel()
  {
    _todoItems.CollectionChanged += (s, e) => UpdateToDoColors();
  }

  public ObservableCollection<ToDoItemViewModel> Items
  {
    get
    {
      return _todoItems;
    }
  }

  private void UpdateToDoColors()
  {
    double itemCount = _todoItems.Count;
    double index = 0;
    foreach (var todoItem in _todoItems)
    {
      double val = (index / itemCount) * 155.0;
      index++;

      if (!todoItem.Completed)
      {
        todoItem.Color = SystemColor.FromArgb(255, 255, (byte)val, 0);
      }
    };
  }
}
~~~

The collection of items is exposed as a `ResettableObservableCollection`, a subclass of `ObservableCollection` that allows us to raise ‘Reset’ collection changed events (more on this later). This view model also handles the `CollectionChanged` event internally so that we can update the color of each item whenever the list changes.

The XAML for the UI uses an `ItemsControl` to render the items, using a simple template and a few basic value converters:

~~~xml
<phone:PhoneApplicationPage
    ...>

  <phone:PhoneApplicationPage.Resources>
    <conv:ColorToBrushConverter x:Key="ColorToBrushConverter"/>
    <conv:BoolToVisibilityConverter x:Key="BoolToVisibilityConverter"/>
  </phone:PhoneApplicationPage.Resources>

  <!--LayoutRoot is the root grid where all page content is placed-->
  <Grid x:Name="LayoutRoot" Background="Transparent">
    <Grid x:Name="ContentPanel" Margin="12,0,12,0">
      <ItemsControl ItemsSource="{Binding}">
        <ItemsControl.ItemTemplate>
          <DataTemplate>
            <Border Background="{Binding Path=Color, Converter={StaticResource ColorToBrushConverter}}"
                    Height="75"
                    Loaded="Border_Loaded">

              <Grid Background="{StaticResource itemGradient}">
                <!-- task text -->
                <TextBlock Text="{Binding Text}"
                           Margin="15,15,0,15" FontSize="30"
                           x:Name="taskText"/>

                <!-- the strike-through that is shown when a task is complete -->
                <Line Visibility="{Binding Path=Completed, Converter={StaticResource BoolToVisibilityConverter}}"
                      X1="0" Y1="0" X2="1" Y2="0"
                      Stretch="UniformToFill"
                      Stroke="White" StrokeThickness="2"
                      Margin="8,5,8,0"/>

              </Grid>
            </Border>
          </DataTemplate>
        </ItemsControl.ItemTemplate>
      </ItemsControl>
    </Grid>
</Grid>
</phone:PhoneApplicationPage>
~~~

The item gradient is an application-level resource because it is used elsewhere in the application:

~~~xml
<Application.Resources>
  <LinearGradientBrush EndPoint="0,1" StartPoint="0,0" x:Key="itemGradient">
    <GradientStop Color="#22FFFFFF"/>
    <GradientStop Color="#00000000" Offset="0.05"/>
    <GradientStop Color="#00000000" Offset="0.9"/>
    <GradientStop Color="#22000000" Offset="1"/>
  </LinearGradientBrush>
</Application.Resources>
~~~

The above XAML produces the following, simple UI, where a very subtle gradient for each item is used to distinguish
neighboring items:

![clear2]({{ site.baseurl }}/ceberhardt/assets/codeproject/clear2.png)

Despite the subtle gradient, which are often frowned upon (content over chrome!) this still feels very much like a Metro UI design to me.

## Managing Interactions

When I first started to implement the various gestures for the to-do application, I simply added the various manipulation event handlers in the code behind,
and managed state via a collection of variables. As I added more gestures to the application, it quite quickly become un-manageable,
especially where manipulation events had different meanings depending on the gesture currently being ‘executed’. In an attempt to make the code more object-oriented and
state easier to manage, I separated each interaction into a class that could be easily added / removed from the application.

In this context, an interaction is a series of gestures that the user performs in order to change the state of the application. For example, the ‘reorder’ interaction is initiated by a tap-and-hold gesture followed by a drag gesture.

Each interaction must implement the following interface:

~~~csharp
/// <summary>
/// An interaction is handles gestures from the UI in order to perform actions
/// on the model. Interactions have the concpet of Enabled and Active in order
/// that the InteractionManager can ensure that only one interaction is
/// active at one time
/// </summary>
public interface IInteraction
{
  /// <summary>
  /// Initialises the interaction, providing it with todo model items and the UI that renders then.
  /// </summary>
  void Initialise(ItemsControl todoList, ResettableObservableCollection<ToDoItemViewModel> todoItems);

  /// <summary>
  /// Invoked when a new element that is the ItemsContainer
  /// for a ToDoViewModelItem is added to the list. This allows
  /// the interaction to add event handlers to the element.
  /// </summary>
  void AddElement(FrameworkElement element);

  bool IsActive { get; }

  bool IsEnabled { get; set; }

  /// <summary>
  /// Occurs when this interaction becomes active
  /// </summary>
  event EventHandler Activated;

  /// <summary>
  /// Occurs when this interaction completes
  /// </summary>
  event EventHandler DeActivated;
}
~~~

The `Initialise` method provides the list of model items, together with the
`ItemsControl` that renders them. Interactions have state, `IsActive`, which indicates that the user is currently ‘executing’ this interaction. With our earlier ‘reorder’ interaction example, if the user has performed a tap-and-hold gesture and is currently dragging the item, the interaction is active. Interactions also have an
`IsEnabled` property which indicated whether an interaction can be initiated. This allows us to disable all interactions other than the active. Finally, there is an
`AddElement` method which is invoked each time a new item is rendered within the UI. This allows an interaction to add gesture event handlers to individual items.

The project also includes `InteractionBase`, which is an abstract class that implements
`IInteraction` to provide the common logic, firing the `Active` /
`DeActivated` events as the state changes. It is quite common practice to provide an abstract implementation of an interface when you have multiple implementations, as there is often a ‘core’ set of functions that are common across all implementations.

The task of managing the various interactions falls to the `InteractionManager`:

~~~csharp
/// <summary>
/// Manages a collection of interactions, multicasting various functions to each interaction (such
/// as the need to attached to a new element), and also manages the enabled state of each interaction.
/// </summary>
public class InteractionManager
{
  private List<IInteraction> _interactions = new List<IInteraction>();

  public void AddInteraction(IInteraction interaction)
  {
    _interactions.Add(interaction);
    interaction.Activated += Interaction_Activated;
    interaction.DeActivated += Interaction_DeActivated;
  }

  /// <summary>
  /// 'multicast' AddELement to all interactions
  /// </summary>
  public void AddElement(FrameworkElement element)
  {
    foreach (var interaction in _interactions)
    {
      interaction.AddElement(element);
    }
  }

  private void Interaction_DeActivated(object sender, EventArgs e)
  {
    // when an interactions is de-activated, re-enable all interactions
    foreach(var interaction in _interactions)
    {
      interaction.IsEnabled = true;
    }
  }

  private void Interaction_Activated(object sender, EventArgs e)
  {
    // when an interaction is activated, disable all others
    foreach(var interaction in _interactions.Where(i => i != sender))
    {
      interaction.IsEnabled = false;
    }
  }
}
~~~

This simple class performs a few tasks, it ensures that when an interaction becomes active, all other interactions are disabled, and when an interaction becomes de-activated (i.e. completes), all interactions become enabled. Because interactions use a wide range of gestures and other events, there is no easy way to disable interactions in a centralised fashion, so each must ensure that the ‘honor’ their own
`IsEnabled` property. Finally, the `InteractionManager` ‘multicasts’ the
`AddElement` method described earlier.

Adding interactions to our UI is as simple as creating them and adding them to the manager. As new to-do items are loaded, we handle the
`Loaded` event of the template used to render each item, and present this to the manager, which informs each interaction in turn, allowing them to add event handlers. The complete code-behind for our view is shown below:

~~~csharp
public partial class MainPage : PhoneApplicationPage
{
  // the model objects
  private ToDoListViewModel _viewModel = new ToDoListViewModel();

  private InteractionManager _interactionManager = new InteractionManager();

  // Constructor
  public MainPage()
  {
    InitializeComponent();

    // view model populated with test data here

    this.DataContext = _viewModel.Items;

    var dragReOrderInteraction = new DragReOrderInteraction(dragImageControl);
    dragReOrderInteraction.Initialise(todoList, _viewModel.Items);

    var swipeInteraction = new SwipeInteraction();
    swipeInteraction.Initialise(todoList, _viewModel.Items);

    var tapEditInteraction = new TapEditInteraction();
    tapEditInteraction.Initialise(todoList, _viewModel.Items);

    var addItemInteraction = new PullDownToAddNewInteraction(tapEditInteraction, pullDownItemInFront);
    addItemInteraction.Initialise(todoList, _viewModel.Items);

    var pinchAddNewItemInteraction = new PinchAddNewInteraction(tapEditInteraction, pullDownItemInFront);
    pinchAddNewItemInteraction.Initialise(todoList, _viewModel.Items);

    _interactionManager.AddInteraction(swipeInteraction);
    _interactionManager.AddInteraction(dragReOrderInteraction);
    _interactionManager.AddInteraction(addItemInteraction);
    _interactionManager.AddInteraction(tapEditInteraction);
    _interactionManager.AddInteraction(pinchAddNewItemInteraction);

  }

  private void Border_Loaded(object sender, RoutedEventArgs e)
  {
    _interactionManager.AddElement(sender as FrameworkElement);
  }
}
~~~

This feels quite elegant!

Anyhow, enough of the infrastructure code, let’s look at how these interactions are implemented …

## A Swipe Interaction for Delete / Complete

There are a number of options available to the Silverlight developer who wants to support standard or custom gestures. We’ll take a brief look at these in the next few paragraphs.

Silverlight for Windows Phone provides low-level touch events, via `Touch.FrameReported`, which you can handle in order to track when a user places one or more fingers on the screen and moves them around. Turning low-level manipulation events into high-level gestures is actually quite tricky. Touch devices give a much greater control when dragging objects, or flicking them, when compared to a mouse-driven alternative, but have a much lower accuracy for the more commonplace task of trying to hit a specific spot on the screen. For this reason, gestures have a built in tolerance. As an example, a drag manipulation gesture is not initiated if the user’s finger moves by a single pixel.

Silverlight for Windows Phone exposes high-level manipulation events that take the low-level touch events and make them easier to consume. The
`ManipulationStarted`, `-Delta` and `–Ended` events include components that describe translation (single finger drag) and scale (multi finger pinch), they also provide final velocities so that you can give objects inertia, allowing them to slowly decelerate after manipulation, rather than having them stop abruptly. Unfortunately the manipulation events do not have a tolerance as described above, so a
`ManipulationStarted` followed by `ManipulationDelta` will fire if the user’s finger moves a single pixel in any direction.

The Silverlight Toolkit contains a `GestureListener` which provides an alternative for handling touch events in order to construct gestures. The
`GestureListener` drag does provide the required tolerance, however
`GestureListener` was
[recently deprecated](http://www.jeff.wilcox.name/2011/11/nov2011phonetoolkit/), which is a shame because the framework events do not fully replace the functionality of this class. I found that it still works, but does cause issues when integrating with other framework-supplied gestures, so I would recommend that you avoid using it.

In the to-do application I have mostly used the framework manipulation events, with suitable tolerances to detect flick gestures and prevent drag gestures firing too early, although, I have also used a low-level touch events when more control is required for a custom gesture.

In the to-do application a horizontal swipe to the right sets a todo as being complete, whereas a swipe to the left deletes an item.

In order to support these gestures we handle the `ManipulationDelta` and
`ManipulationCompleted` event for each element as they are added to the list:

~~~csharp
public override void AddElement(FrameworkElement element)
{
  element.ManipulationDelta += Element_ManipulationDelta;
  element.ManipulationCompleted += Element_ManipulationCompleted;
}<span style="white-space: normal; ">
</span>
~~~

The `ManipulationDelta` handler has to perform a couple of tasks. If the interaction is not active, it needs to determine how far the user has dragged the element to see whether we consider this to be a drag gesture. Whereas, if the interaction is active, the delta is used to offset the element being dragged:

~~~csharp
// the drag distance required to consider this a swipe interaction
private static readonly double DragStartedDistance = 5.0;

private void Element_ManipulationDelta(object sender, ManipulationDeltaEventArgs e)
{
  if (!IsEnabled)
    return;

  if (!IsActive)
  {
    // has the user dragged far enough?
    if (Math.Abs(e.CumulativeManipulation.Translation.X) < DragStartedDistance)
      return;

    IsActive = true;

    // initialize the drag
    FrameworkElement fe = sender as FrameworkElement;
    fe.SetHorizontalOffset(0);
  }
  else
  {
    // handle the drag to offset the element
    FrameworkElement fe = sender as FrameworkElement;
    double offset = fe.GetHorizontalOffset().Value + e.DeltaManipulation.Translation.X;
    fe.SetHorizontalOffset(offset);
  }
}<span style="white-space: normal; ">
</span>
~~~

Note, as mentioned previously, each interaction has to handle their own enabled state. But what are these mysterious methods,
`SetHorizontalOffset` and `GetHorizontalOffset` in the above code? They are not found on
`FrameworkElement`. The task of offsetting an element is reasonably straightforward via a
`TranslateTransform`, however, in order to avoid repeating this code in numerous locations it is ‘hidden’ behind the Set /
`GetHortizontalOffset` extension methods. These methods also handle the case where an element does not yet have a
`TranslateTransform` applied:

~~~csharp
public static void SetHorizontalOffset(this FrameworkElement fe, double offset)
{
  var translateTransform = fe.RenderTransform as TranslateTransform;
  if (translateTransform == null)
  {
    // create a new transform if one is not alreayd present
    var trans = new TranslateTransform()
    {
      X = offset
    };
    fe.RenderTransform = trans;
  }
  else
  {
    translateTransform.X = offset;
  }
}

public static Offset GetHorizontalOffset(this FrameworkElement fe)
{
  var trans = fe.RenderTransform as TranslateTransform;
  if (trans == null)
  {
    // create a new transform if one is not alreayd present
    trans = new TranslateTransform()
    {
      X = 0
    };
    fe.RenderTransform = trans;
  }
  return new Offset()
  {
    Transform = trans,
    Value = trans.X
  };
}

public struct Offset
{
  public double Value { get; set; }
  public TranslateTransform Transform { get; set; }
}
~~~

The reason for returning the offset as an `Offset` struct will become clearer later on when we animate the position of elements.

When the manipulation has completed, we need to determine whether the element has been dragged further than half way across the screen, or whether it has sufficient velocity for us to consider this to be a flick gesture. In either case we delete or mark-complete the item depending on the direction of movement.

~~~csharp
private static readonly double FlickVelocity = 2000.0;

private void Element_ManipulationCompleted(object sender, ManipulationCompletedEventArgs e)
{
  if (!IsActive)
    return;

  FrameworkElement fe = sender as FrameworkElement;
  if (Math.Abs(e.TotalManipulation.Translation.X) > fe.ActualWidth / 2 ||
    Math.Abs(e.FinalVelocities.LinearVelocity.X) > FlickVelocity)
  {
    if (e.TotalManipulation.Translation.X < 0.0)
    {
      ToDoItemDeletedAction(fe);
    }
    else
    {
      ToDoItemCompletedAction(fe);
    }
  }
  else
  {
    ToDoItemBounceBackAction(fe);
  }

  IsActive = false;
}<span style="white-space: normal; ">
</span>
~~~

If neither threshold is reached, the item bounces back into place, this is achieved by the following ‘action’:

~~~csharp
private void ToDoItemBounceBackAction(FrameworkElement fe)
{
  var trans = fe.GetHorizontalOffset().Transform;

  trans.Animate(trans.X, 0, TranslateTransform.XProperty, 300, 0, new BounceEase()
  {
    Bounciness = 5,
    Bounces = 2
  });
}
~~~

Animate is another extension method which I created in order to quickly create
`DoubeAnimations` for the properties of an element:

~~~csharp
public static void Animate(this DependencyObject target, double from, double to,
                          object propertyPath, int duration, int startTime,
                          IEasingFunction easing = null, Action completed = null)
{
  if (easing == null)
  {
    easing = new SineEase();
  }

  var db = new DoubleAnimation();
  db.To = to;
  db.From = from;
  db.EasingFunction = easing;
  db.Duration = TimeSpan.FromMilliseconds(duration);
  Storyboard.SetTarget(db, target);
  Storyboard.SetTargetProperty(db, new PropertyPath(propertyPath));

  var sb = new Storyboard();
  sb.BeginTime = TimeSpan.FromMilliseconds(startTime);

  if (completed != null)
  {
    sb.Completed += (s, e) => completed();
  }

  sb.Children.Add(db);
  sb.Begin();
}<span style="white-space: normal; ">
</span>
~~~

When an item is dragged or flicked to the right, the following ‘action’ is invoked, which sets the view model state, and re-uses the bounce-back ‘action’ to return the item to its original location:

~~~csharp
private void ToDoItemCompletedAction(FrameworkElement fe)
{
  // set the ToDoItem to complete
  ToDoItem completedItem = fe.DataContext as ToDoItem;
  completedItem.Completed = true;
  completedItem.Color = Colors.Green;

  // bounce back into place
  ToDoItemBounceBack(fe);
}<span style="white-space: normal; ">
</span>
~~~

The bindings take care of updating the UI so that our item is now green. I also added a
`Line` element which has its `Visibility` bound to the
`Completed` property of the `ToDoItem`:

![complete]({{ site.baseurl }}/ceberhardt/assets/codeproject/complete.png)

If instead the use slides or flicks to the left we’d like to delete the item. The method that performs the deletion is shown below:

~~~csharp
private void ToDoItemDeletedAction(FrameworkElement deletedElement)
{
  _deleteSound.Play();

  var trans = deletedElement.GetHorizontalOffset().Transform;
  trans.Animate(trans.X, -(deletedElement.ActualWidth + 50),
                TranslateTransform.XProperty, 300, 0, new SineEase()
                {
                  EasingMode = EasingMode.EaseOut
                },
  () =>
  {
    // find the model object that was deleted
    ToDoItemViewModel deletedItem = deletedElement.DataContext as ToDoItemViewModel;

    // determine how much we have to 'shuffle' up by
    double elementOffset = -deletedElement.ActualHeight;

    // find the items in view, and the location of the deleted item in this list
    var itemsInView = _todoList.GetItemsInView().ToList();
    var lastItem = itemsInView.Last();
    int startTime = 0;
    int deletedItemIndex = itemsInView.Select(i => i.DataContext)
                                      .ToList().IndexOf(deletedItem);

    // iterate over each item
    foreach (FrameworkElement element in itemsInView.Skip(deletedItemIndex))
    {
      // for the last item, create an action that deletes the model object
      // and re-renders the list
      Action action = null;
      if (element == lastItem)
      {
        action = () =>
        {
          // clone the list
          _todoItems.Remove(deletedItem);

          // re-populate our ObservableCollection
          _todoItems.Reset();
        };
      }

      // shuffle this item up
      TranslateTransform elementTrans = new TranslateTransform();
      element.RenderTransform = elementTrans;
      elementTrans.Animate(0, elementOffset, TranslateTransform.YProperty, 200, startTime, null, action);
      startTime += 10;
    }
  });
}
~~~

There’s actually rather a lot going on in that method. Firstly the deleted item is animated so that it flies off the screen to the left. Once this animation is complete, we’d like to make the items below ‘shuffle’ up to fill the space. In order to do this, we measure the size of the deleted items, then iterate over all the items within the current view that are below the deleted item, and apply an animation to each one. The code makes use of the
`GetItemsInView` extension method that I wrote for the
[Windows Phone JumpList control](http://www.scottlogic.co.uk/blog/colin/2011/01/a-windows-phone-7-jump-list-control/) – it returns a list of items that are currently visible to the user, taking vertical scroll into consideration.

Once all the elements have shuffled up, our UI now contains a number of
`ToDoItems` that have been ‘artificially’ offset. Rather than try to keep track of how each item is offset, at this point we force the
`ItemsControl` to re-render the entire list. This is where the purpose of
`ResettableObservableCollection` becomes clear, it simply exposes a
`Reset` method, which fires a collection changed event that will force any
`ItemsControl` bound to the collection to completely re-render themselves:

~~~csharp
public class ResettableObservableCollection<T> : ObservableCollection<T>
{
  public void Reset()
  {
    OnCollectionChanged(new NotifyCollectionChangedEventArgs(
      NotifyCollectionChangedAction.Reset));
  }
}
~~~

The result of this delete animation looks pretty cool …

![delete]({{ site.baseurl }}/ceberhardt/assets/codeproject/delete.jpg)

## Contextual Cues

My friend
[Graham Odds wrote a great post on UI cues](http://www.scottlogic.co.uk/blog/graham/2010/05/contextual-cues-in-ui-design/), which are subtle effects that visually communicate application functionality to the user. In Graham’s words “they can be invaluable in effectively communicating the functionality and behaviour of our increasingly complex user interfaces”.

The todo-list application uses gestures to delete / complete an item, however, these are not common user interactions so it is likely that the user would have to experiment with the application in order to discover this functionality. They would most likely have to first delete a todo-item by mistake before understanding how to perform a deletion, which could be quite frustrating!

In order to help the user understand the slightly novel interface, we’ll add some very simple contextual cues. In the XAML below a
`TickAndCross` control has been added to the item template:

~~~xml
<Grid>

  <!-- task text -->
  <TextBlock Text="{Binding Text}" Margin="15,15,0,15" FontSize="30"/>

  <!-- the strike-through that is shown when a task is complete -->
  <Line Visibility="{Binding Path=Completed, Converter={StaticResource BoolToVisibilityConverter}}"
        X1="0" Y1="0" X2="1" Y2="0"
        Stretch="UniformToFill"
        Stroke="White" StrokeThickness="2"
        Margin="8,5,8,0"/>

  <!-- a tick and a cross, rendered off screen -->
  <local:TickAndCross Opacity="0" x:Name="tickAndCross"/>

</Grid>
~~~

The `TickAndCross` control is a simple user control that renders a tick off-screen to the right and a cross off-screen to the left:

~~~xml
<UserControl ...>
  <Canvas>
    <TextBlock Text="×" FontWeight="Bold" FontSize="35"
                             Canvas.Left="470" Canvas.Top="8"/>
    <TextBlock Text="✔" FontWeight="Bold" FontSize="35"
                             Canvas.Left="-50" Canvas.Top="8"/>
  </Canvas>
</UserControl>
~~~

When the swipe interaction is initiated, we can locate this control using
[LINQ-to-VisualTree](http://www.scottlogic.co.uk/blog/colin/2010/03/linq-to-visual-tree/), then set the opacity so that it fades into view, with the tick and cross elements becoming more pronounced the further the user swipes:

![contextualcue]({{ site.baseurl }}/ceberhardt/assets/codeproject/contextualcue.jpg)

With that subtle visual effect, the swipe interaction is complete!

## Drag to Re-Order Interaction

The drag interaction is initiated when a user performs a tap-and-hold interaction, which is exposed by the framework via a Hold event. Once they have performed this gesture, they can drag the item up and down the list.

The easiest way to allow the user to ‘pick up’ and drag the item is to clone it using a
`WriteableBitmap`, hiding the original. This technique allows us to place the item at a higher Z-index than the list which it comes from, so that it will always be top-most as it is moved up and down the list.

We’ll create a `DragImage` user control that contains an image together with a couple of subtle gradients which use
`TranslateTransforms` to push them above and below the item:

~~~xml
 <UserControl ...>

  <Grid x:Name="LayoutRoot">
    <!-- the image that displays the dragged item -->
    <Image x:Name="dragImage"
            VerticalAlignment="Top">
    </Image>

    <!-- lower drop shadow -->
    <Rectangle Height="10"
                  VerticalAlignment="Bottom">
      <Rectangle.Fill>
        <LinearGradientBrush EndPoint="0,1" StartPoint="0,0">
          <GradientStop Color="#AA000000"/>
          <GradientStop Color="#00000000" Offset="1"/>
        </LinearGradientBrush>
      </Rectangle.Fill>
      <Rectangle.RenderTransform>
        <TranslateTransform Y="10"/>
      </Rectangle.RenderTransform>
    </Rectangle>

    <!-- upper drop shadow -->
    <Rectangle Height="10"
                  VerticalAlignment="Top">
      <Rectangle.Fill>
        <LinearGradientBrush EndPoint="0,1" StartPoint="0,0">
          <GradientStop Color="#00000000"/>
          <GradientStop Color="#AA000000" Offset="1"/>
        </LinearGradientBrush>
      </Rectangle.Fill>
      <Rectangle.RenderTransform>
        <TranslateTransform Y="-10"/>
      </Rectangle.RenderTransform>
    </Rectangle>
  </Grid>
</UserControl>
~~~

An instance of this control is added to *MainPage.xaml* and passed to the
`DragReOrderInteraction`.

The interaction handles various events on each element that is added to the list, just like the swipe interaction. When a
`Hold` event occurs, we clone the item being pressed upon and fade out the rest of the list:

~~~csharp
private void Element_Hold(object sender, GestureEventArgs e)
{
  if (IsEnabled == false)
    return;

  IsActive = true;

  // copy the dragged item to our 'dragImage'
  FrameworkElement draggedItem = sender as FrameworkElement;
  var bitmap = new WriteableBitmap(draggedItem, null);
  _dragImage.Image.Source = bitmap;
  _dragImage.Visibility = Visibility.Visible;
  _dragImage.Opacity = 1.0;
  _dragImage.SetVerticalOffset(draggedItem.GetRelativePosition(_todoList).Y);

  // hide the real item
  draggedItem.Opacity = 0.0;

  // fade out the list
  _todoList.Animate(1.0, 0.7, FrameworkElement.OpacityProperty, 300, 0);

  _initialDragIndex = _todoItems.IndexOf(((ToDoItemViewModel)draggedItem.DataContext));
}
~~~

![dragStart]({{ site.baseurl }}/ceberhardt/assets/codeproject/dragStart.jpg)

Dragging the item is simply a matter of handling
`ManipulatonDelta` and offsetting the item:

~~~csharp
private void Element_ManipulationDelta(object sender, ManipulationDeltaEventArgs e)
{
  if (!IsActive)
    return;

  // set the event to handled in order to avoid scrolling the ScrollViewer
  e.Handled = true;

  // move our 'drag image'.
  _dragImage.SetVerticalOffset(_dragImage.GetVerticalOffset().Value + e.DeltaManipulation.Translation.Y);

  ShuffleItemsOnDrag();
}
~~~

`SetVerticalOffset` is another extension method that applies a
`TranslateTransform`.

The `ShuffleItemsOnDrag` method is where the fun starts, we’ll get to that shortly. First we’ll take a look at a simple utility method that is used to determine the index that the item being dragged would occupy if it were dropped at the present location. This is achieved by a simple measurement:

~~~csharp
 // Determines the index that the dragged item would occupy when dropped
private int GetDragIndex()
{
  double dragLocation = _dragImage.GetRelativePosition(_todoList).Y +
                          _scrollViewer.VerticalOffset +
                          _dragImage.ActualHeight / 2;
  int dragIndex = (int)(dragLocation / _dragImage.ActualHeight);
  dragIndex = Math.Min(_todoItems.Count - 1, dragIndex);
  return dragIndex;
}
~~~

The above code needs to take the current scroll location into consideration, which is where the reference to
`_scrollViewer`, which is the `ScrollViewer` that hosts
our `ItemsControl` content comes in.

Within `ShuffleItemsOnDrag` we want to create an effect where the dragged item ‘pushes’ the other items out of the way as it hovers over them, giving the impression that the list is re-ordering as we drag.

The method below iterates over all of the items in the list to determine whether they need to be offset. An item needs to be offset if it is between the current dragged item index and the items original location.

~~~csharp
private void ShuffleItemsOnDrag()
{
  // find its current index
  int dragIndex = GetDragIndex();

  // iterate over the items in the list and offset as required
  double offset = _dragImage.ActualHeight;
  for (int i = 0; i < _todoItems.Count; i++)
  {
    FrameworkElement item = _todoList.ItemContainerGenerator.ContainerFromIndex(i) as FrameworkElement;

    // determine which direction to offset this item by
    if (i <= dragIndex && i > _initialDragIndex)
    {
      OffsetItem(-offset, item);
    }
    else if (i >= dragIndex && i < _initialDragIndex)
    {
      OffsetItem(offset, item);
    }
    else
    {
      OffsetItem(0, item);
    }
  }
}
~~~

The `OffsetItem` method performs the actual offset by animating the Y position of each item. The target location is stored in the elements
`Tag` property so that we don’t repeatedly fire the same animation on an element.

~~~csharp
 private void OffsetItem(double offset, FrameworkElement item)
{
  double targetLocation = item.Tag != null ? (double)item.Tag : 0;
  if (targetLocation != offset)
  {
    var trans = item.GetVerticalOffset().Transform;
    trans.Animate(null, offset, TranslateTransform.YProperty, 500, 0);
    item.Tag = offset;
    _moveSound.Play();
  }
}
~~~

![shuffle]({{ site.baseurl }}/ceberhardt/assets/codeproject/shuffle.jpg)

When the user stops dragging the item, the `ManipulationCompleted` event is fired. Here we perform a number of tasks:

1. Fade the list back to full opacity
2. Animate the dragged item so that it ‘snaps’ into location
3. When the above is complete, we need to re-order the underlying collection of model items, then re-populate the
   `ObservableCollection` exposed to the view. This causes all the items to be re-rendered, removing all of the
   `TranslateTransforms` that have been applied.
4. Finally, remove the image which is our copy of the dragged item.

This sounds like a lot of work, but our `Animate` utility method makes it quite simple:

~~~csharp
private void Element_ManipulationCompleted(object sender, ManipulationCompletedEventArgs e)
{
  IsActive = false;

  int dragIndex = GetDragIndex();

  // fade in the list
  _todoList.Animate(null, 1.0, FrameworkElement.OpacityProperty, 200, 0);

  // animated the dragged item into location
  double targetLocation = dragIndex * _dragImage.ActualHeight - _scrollViewer.VerticalOffset;
  var trans = _dragImage.GetVerticalOffset().Transform;
  trans.Animate(null, targetLocation, TranslateTransform.YProperty, 200, 0, null,
    () =>
    {
      // move the dragged item
      var draggedItem = _todoItems[_initialDragIndex];
      _todoItems.Remove(draggedItem);
      _todoItems.Insert(dragIndex, draggedItem);

      // re-populate our ObservableCollection
      _todoItems.Reset();

      // fade out the dragged image and collapse on completion
      _dragImage.Animate(null, 0.0, FrameworkElement.OpacityProperty, 1000, 0, null, ()
        => _dragImage.Visibility = Visibility.Collapsed);
    });
}
~~~

The current implementation only allows the user to drag the item within the bounds of the current screen. What if the list is larger than the screen and the users want to drag right from the bottom to the top?

A common solution to this problem is to auto-scroll the list if the item is dragged near to the top. The following method is invoked periodically by a timer to see whether the item has been dragged within the top or bottom ‘scroll zones’. The velocity of the scroll is proportional to just how far within these zones the item has been dragged. Scrolling is simply a matter of setting the scroll location on the
`ScrollViewer` we located earlier:

~~~csharp
 // checks the current location of the item being dragged, and scrolls if it is
// close to the top or the bottom
private void AutoScrollList()
{
  // where is the dragged item relative to the list bounds?
  double draglocation = _dragImage.GetRelativePosition(_todoList).Y + _dragImage.ActualHeight / 2;

  if (draglocation < AutoScrollHitRegionSize)
  {
    // if close to the top, scroll up
    double velocity = (AutoScrollHitRegionSize - draglocation);
    _scrollViewer.ScrollToVerticalOffset(_scrollViewer.VerticalOffset - velocity);
  }
  else if (draglocation > _todoList.ActualHeight - AutoScrollHitRegionSize)
  {
    // if close to the bottom, scroll down
    double velocity = (AutoScrollHitRegionSize - (_todoList.ActualHeight - draglocation));
    _scrollViewer.ScrollToVerticalOffset(_scrollViewer.VerticalOffset + velocity);
  }
}
~~~

You can see the scroll-zones illustrated below:

![scrollZones]({{ site.baseurl }}/ceberhardt/assets/codeproject/scrollZones.jpg)

And with this, our next interaction is complete!

## A Tap Edit Interaction

Now that we can mark-complete, delete and move items, it’s time to add some edit functionality. For this interaction we are not going to implement any fancy gestures, a simple tap will suffice.

To support this, we’ll modify the item template so that it includes a `TextBox` as well as the readonly
`TextBlock`, both of which will render the same task text:

~~~xml
<Grid Background="{StaticResource itemGradient}">
  <!-- task text -->
  <TextBlock Text="{Binding Text}"
              Margin="15,15,0,15" FontSize="30"
              x:Name="taskText"/>

  <!-- editable task text -->
  <TextBox Text="{Binding Text, Mode=TwoWay}"
            Template="{StaticResource textBoxTemplate}"
            FontSize="30"
            Foreground="White"
            VerticalAlignment="Center"
            Visibility="Collapsed"
            x:Name="taskTextEdit"/>

	...
</Grid>
~~~

I did try making do with just a `TextBox` and setting it to read only when not in edit mode, but found that it interfered with my other gestures.

The
`TapEditInteraction` just handles the `Tap` event, when this event occurs, we find the various components of the todo item UI (`FindNamedDescendant` is a utility method built on Linq-to-VisualTree) and fade out all of the other items:

~~~csharp
 private TextBlock _taskText;
private TextBox _taskTextEdit;
private string _originalText;
private ToDoItemViewModel _editItem;

...

public override void AddElement(FrameworkElement element)
{
  element.Tap += Element_Tap;
}

private void Element_Tap(object sender, GestureEventArgs e)
{
  if (!IsEnabled)
    return;

  IsActive = true;

  var border = sender as Border;
  EditItem(border.DataContext as ToDoItemViewModel);
}

public void EditItem(ToDoItemViewModel editItem)
{
  _editItem = editItem;

  // find the edit and static text controls
  var container = _todoList.ItemContainerGenerator.ContainerFromItem(editItem);
  _taskTextEdit = FindNamedDescendant<TextBox>(container, "taskTextEdit");
  _taskText = FindNamedDescendant<TextBlock>(container, "taskText");

  // store the original text to allow undo
  _originalText = _taskTextEdit.Text;

  EditFieldVisible(true);

  // set the caret position to the end of the text field
  _taskTextEdit.Focus();
  _taskTextEdit.Select(_originalText.Length, 0);
  _taskTextEdit.LostFocus += TaskTextEdit_LostFocus;

  // fade out all other items
  ((FrameworkElement)_todoList.ItemContainerGenerator.ContainerFromItem(_editItem)).Opacity = 1;
  var elements = _todoItems.Where(i => i != _editItem)
                            .Select(i => _todoList.ItemContainerGenerator.ContainerFromItem(i))
                            .Cast<FrameworkElement>();
  foreach (var el in elements)
  {
    el.Animate(1.0, 0.7, FrameworkElement.OpacityProperty, 800, 0);
  }
}

private void EditFieldVisible(bool visible)
{
  _taskTextEdit.Visibility = visible ? Visibility.Visible : Visibility.Collapsed;
  _taskText.Visibility = visible ? Visibility.Collapsed : Visibility.Visible;

}
~~~

With the above code in place, tapping on an item allows the user to edit the text:

![edit2]({{ site.baseurl }}/ceberhardt/assets/codeproject/edit2.jpg)

All that remains is to ‘commit’ the updated text when the user stops editing.

There are a couple of ways that the edit can finish, either when the user hits the enter key, or if the
`TextBox` looses focus:

~~~csharp
private void ItemsControl_KeyUp(object sender, KeyEventArgs e)
{
  if (e.Key == Key.Enter)
  {
    EditFieldVisible(false);
    IsActive = false;
  }
}

private void TaskTextEdit_LostFocus(object sender, RoutedEventArgs e)
{
  TextBox tx = sender as TextBox;
  tx.LostFocus -= TaskTextEdit_LostFocus;

  tx.Visibility = Visibility.Collapsed;

  TextBlock tb = FindNamedDescendant<TextBlock>(tx.Parent,"taskText");
  tb.Visibility = Visibility.Visible;

  EditFieldVisible(false);
  IsActive = false;
}
~~~

We do not need to set the `Text` property of the `ToDoItemViewModel` directly because it is bound to the UI via a
`TwoWay` binding.

The to-do application is starting to become quite functional, although one key feature is missing. They can edit and delete items, but there is no way for them to add any new to-dos!

## Pull-Down to Add New Item Interaction

Where most todo list applications have an ‘add new’ button, the iPhone Clear application uses a very novel alternative. New items can be added to the top of the list via a pull-down gesture, and items added within the body of the list via a pinch. In this section we’ll look at implementing the pull-down interaction.

The pull-down gesture is becoming quite popular, most typically used to refresh or fetch more data, in Twitter applications for example. The ‘compress’ effect that Silverlight for Windows Phone applies to lists when they reach their top or bottom is not something that has been designed for extension, there are no events that indicate a compression is occurring, or indicate the distance moved. Fortunately
[Jason Ginchereau](http://blogs.msdn.com/b/jasongin/archive/2011/04/13/pull-down-to-refresh-a-wp7-listbox-or-scrollviewer.aspx) found that the framework achieves this effect by applying a
`RenderTransform` to the content of a `ScrollViewer`, we can watch for the presence of this transform in order to detect a compression. But before we get to that point we’ll add a new user control,
`PullDownItem`, which is the placeholder that is pulled down from the top of the screen by this interaction:

~~~xml
<UserControl ...>

  <Grid Background="Red"
        x:Name="LayoutRoot">

    <Grid Background="{StaticResource itemGradient}"
              Height="75">
      <!-- task text -->
      <TextBlock Text="Pull to create new item"
                     Margin="15,15,0,15" FontSize="30"
                     x:Name="pullText"/>
    </Grid>
  </Grid>
</UserControl>
~~~

As with the drag interaction, an instance of this user control is added to the
*MainPage.xaml* and a reference passed to our interaction.

The `PullToAddNewInteraction` detects the `MouseMove` event on the
`ScrollViewer` (which sits within the template of our `ItemsControl`), in order to detect compression:

~~~csharp
private void ScrollViewer_MouseMove(object sender, MouseEventArgs e)
{
  if (!IsEnabled)
    return;

  // determine whether the user is pulling the list down by inspecting the ScrollViewer.Content abd
  // looking for the required transform.
  UIElement scrollContent = (UIElement)_scrollViewer.Content;
  CompositeTransform ct = scrollContent.RenderTransform as CompositeTransform;
  if (ct != null && ct.TranslateY > 0)
  {
    IsActive = true;

    // offset the pull-down element, set its text and opacity
    _distance = ct.TranslateY;
    _pullDownItem.VerticalOffset = _distance - ToDoItemHeight;

    if (_distance > ToDoItemHeight && !_effectPlayed)
    {
      _effectPlayed = true;
      _popSound.Play();
    }

    _pullDownItem.Text = _distance > ToDoItemHeight ? "Release to create new item"
                                                    : "Pull to create new item";

    _pullDownItem.Opacity = Math.Min(1.0, _distance / ToDoItemHeight);
  }
}
~~~

(Don’t ask me why you need to detect mouse events to achieve this effect – we are ‘hacking’ into the internals of the framework a little here, so we just go with whatever works!)

When the correct conditions are detected the `PullDownItem` control is offset so as to look like it has been pulled down from the top of the screen. Its opacity is increased the further the user pulls, also its text changes from “Pull to create new item”, to “Release to create new item” as the user pulls further. For a last piece of ‘flare’, a pop sound effect is played to indicate that the user has pulled down far enough to create a new item.

![pullToCreate2]({{ site.baseurl }}/ceberhardt/assets/codeproject/pullToCreate2.png)

When the user releases the list, a `MouseLeftButtonUp` is fired (yes, mouse events are fired even though this is a touch device!). The interaction handles the event, checks how far the user has pulled down, and if the threshold has been exceeded, adds a new item to the list.

~~~csharp
private void ScrollViewer_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
{
  if (!IsActive)
    return;

  // hide the pull down item by locating it off screen
  _pullDownItem.VerticalOffset = -ToDoItemHeight;

  // if the list was pulled down far enough, add a new item
  if (_distance > ToDoItemHeight)
  {
    var newItem = new ToDoItemViewModel("");
    _todoItems.Insert(0, newItem);

    // when the new item has been rendered, use the edit interaction to place the UI
    // into edit mode
    _todoList.InvokeOnNextLayoutUpdated(() => _editInteraction.EditItem(newItem));
  }

  IsActive = false;
  _effectPlayed = false;
}
~~~

When the new item is added to our list of model objects it is not immediately added to the UI, this happened asynchronously. In order to allow the user to edit this newly created item we need to wait for the item to render. The
`InvokeOnNextLayoutUpdated` extension method does just that, it executes the supplied action after the next
`LayoutUpdated` event. This allows the application to immediately go into edit mode:

## ![addNew]({{ site.baseurl }}/ceberhardt/assets/codeproject/addNew.jpg)

## Pinch to Add New Interaction

The one final interaction we’ll add to the application is a pinch which allows the user to drag two items apart in order to add a new one between them. There are no framework-level events that readily support this interaction, so we’ll dive straight in with the low-level touch events.

![pinchToAdd]({{ site.baseurl }}/ceberhardt/assets/codeproject/pinchToAdd.jpg)

In order to determine when the pinch interaction starts, the touch frame reported event is handled. Firstly the number of touch points is inspected to see if two fingers have been placed on the screen. If so, the two items that the user has placed their fingers on are located. If the two items are neighbouring, the pinch interaction is initiated, this includes recording the initial delta (vertical distance between fingers), positioning the placeholder (which is the same user control that is used by the pull-to-add-new interaction) and applying a translate transform to all the elements in the list:

~~~csharp
private void Touch_FrameReported(object sender, TouchFrameEventArgs e)
{
  ...
  var touchPoints = e.GetTouchPoints(_todoList);
  if (touchPoints.Count == 2)
  {

    // find the items that were touched ...
    var itemOne = GetToDoItemAtLocation(touchPoints[0].Position);
    var itemTwo = GetToDoItemAtLocation(touchPoints[1].Position);
    if (itemOne != null && itemTwo != null)
    {
        // find their indices
        _itemOneIndex = _todoItems.IndexOf(itemOne);
        _itemTwoIndex = _todoItems.IndexOf(itemTwo);

        // are the two items next to each other?
        if (Math.Abs(_itemOneIndex - _itemTwoIndex) == 1)
        {
          // if so – initiate the interaction
          IsActive = true;

         _addNewThresholdReached = false;
         _effectPlayed = false;

          // determine where to locate the new item placeholder
          var itemOneContainer = _todoList.ItemContainerGenerator.ContainerFromItem(itemOne) as FrameworkElement;
          var itemOneContainerPos = itemOneContainer.GetRelativePosition(_todoList);
          _newItemLocation = itemOneContainerPos.Y + ToDoItemHeight - (ToDoItemHeight / 2);

          // position the placeholder and add a scale transform
          _pullDownItem.VerticalOffset = _newItemLocation;
          _pullDownItem.Opacity = 0;
          _pullDownItem.RenderTransform = new ScaleTransform()
          {
            ScaleY = 1,
            CenterY = ToDoItemHeight / 2
          };

          // record the initial distance between touch point
          _initialDelta = GetDelta(touchPoints[0], touchPoints[1]);

          AddTranslateTransfromToElements();

          _pullDownItem.Opacity = 1;
        }
      }
    }
  }
}
~~~

While the interaction is active, when subsequent touch frames are reported, the current delta is used to determine by how much the user has pinched the list. During pinch, the items I the list are offset in order to ‘part’ around the pinch location, and the placeholder element is scaled and has an opacity ‘fade’ applied. When pinch is wide enough that the placeholder is fully visible a ‘pop’ sounds is played.

If, however, a touch frame indicates that the user no longer has two fingers on screen, the interaction ends, with the edit interaction being used to edit the newly added item:

~~~csharp
private void Touch_FrameReported(object sender, TouchFrameEventArgs e)
{

  if (IsActive)
  {
    var touchPoints = e.GetTouchPoints(_todoList);

    // if we still have two touch points continue the pinch gesture
    if (touchPoints.Count == 2)
    {
      double currentDelta = GetDelta(touchPoints[0], touchPoints[1]);

      double itemsOffset = 0;

      // is the delta bigger than the initial?
      if (currentDelta > _initialDelta)
      {
        double delta = currentDelta - _initialDelta;
        itemsOffset = delta / 2;

        // play a sound effect if the users has pinched far enough to add a new item
        if (delta > ToDoItemHeight && !_effectPlayed)
        {
          _effectPlayed = true;
          _popSound.Play();
        }

        _addNewThresholdReached = delta > ToDoItemHeight;

        // stretch and fade in the new item
        var cappedDelta = Math.Min(ToDoItemHeight, delta);
        ((ScaleTransform)_pullDownItem.RenderTransform).ScaleY = cappedDelta / ToDoItemHeight;
        _pullDownItem.Opacity = cappedDelta / ToDoItemHeight;

        // set the text
        _pullDownItem.Text = cappedDelta < ToDoItemHeight ?
                 "Pull to create new item" : "Release to add new item";
      }

      // offset all the items in the list so that they 'part'
      for (int i = 0; i < _todoItems.Count; i++)
      {
        var container = _todoList.ItemContainerGenerator.ContainerFromIndex(i) as FrameworkElement;
        var translateTransform = (TranslateTransform)container.RenderTransform;
        translateTransform.Y = i <= _itemOneIndex ? -itemsOffset : itemsOffset;
      }
    }
    else
    {
      // if we no longer have two touch points, end the interactions
      IsActive = false;

      RefreshView();

      // hide the pull-down item
      _pullDownItem.VerticalOffset = -ToDoItemHeight;

      if (_addNewThresholdReached)
      {
        var newItem = new ToDoItemViewModel("");
        _todoItems.Insert(_itemOneIndex, newItem);

        // when the new item has been rendered, use the edit interaction to place the UI
        // into edit mode
        _todoList.InvokeOnNextLayoutUpdated(() => _editInteraction.EditItem(newItem));
      }
    }
  }
...

}
~~~

![pinchToAdd2]({{ site.baseurl }}/ceberhardt/assets/codeproject/pinchToAdd2.jpg)

All-in-all a surprisingly simple implementation for what feel like quite an advanced and complex interaction.

## Conclusions

This article turned into a bit of an epic … I hope some of you are still here with me?

I must admit, this little application is probably
the most fun and interesting Windows Phone application I have ever written. Probably the biggest difference between developing applications
for desktop and mobile is not that the screen is smaller, it is the way that we interact with this small screen. Developing gestures, interaction and
a novel UI that makes great use of the touch-first interface is a lot of fun!

I would thoroughly encourage anyone developing a Windows Phone application to think about how they can use gestures as a replacement for the tired-old buttons, checkboxes and other desktop-style controls. It might not be as hard as you think.

Finally, I just want to re-iterate that the application I have described in this article is a Windows Phone clone of the iPhone Clear application. I want to give the developers of that application full credit for coming up with such a novel interface. My intention here is to show that this style of interface is just as possible on a Windows Phone as it is on an iPhone.

*Have fun!*
