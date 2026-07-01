---
title: Property Finder – a Cross-Platform Xamarin MonoTouch Mobile App
date: 2013-01-01 00:00:00 Z
categories:
- Tech
tags:
- xamarin
author: ceberhardt
layout: default_post
source: codeproject
summary: Re-implements the same Property Finder application using Xamarin MonoTouch to share a C# codebase between Windows Phone and iOS while delivering fully native UIs on both platforms. Compared to the earlier HTML5 approach, the Xamarin version achieves similar code sharing with a no-compromises, native user experience.
---

*This article was originally published on CodeProject, which has since shut down.*

## Summary

A few months ago [I published an article](http://www.codeproject.com/Articles/445361/Property-Finder-a-Cross-Platform-HTML5-Mobile-App) which demonstrated how HTML5 technologies (Knockout, Cordova / PhoneGap and a sprinkling of jQuery Mobile) can be used to create a cross-platform mobile application. The results proved that a significant quantity of code could be shared between the two application versions (Windows Phone and iPhone). However, the use of HTML, in place of a native UI, resulted in compromises, and the end-user experience suffered as a result.

In this article I have implemented exactly the same cross-platform application using the native C# / Silverlight for Windows Phone and C#, via Xamarin MonoTouch, for iOS. The resulting cross-platform application achieves a similar amount of shared code, when compared to the HTML5 version, but provides a fully native UI. The net result is a no-compromises user experience.

*NOTE: Since I first started writing this article, the scope of the project has expanded considerably. This article still focuses on the use of Xamarin for sharing a C# codebase between a Windows Phone and iOS application. However, it has spawned a much larger project called [PropertyCross](http://www.propertycross.com/), which compares a whole range of cross-platform mobile frameworks. The project is open source and hosted on github. If you are interested in cross-platform development and want to know the pros and cons of jQuery Mobile, Sencha Touch, Xamarin, Adobe AIR, Titanium and good old native development, I suggest you take a look!*

[![PropertyCross]({{ site.baseurl }}/ceberhardt/assets/codeproject/PropertyCross.png)](http://www.propertycross.com/)

You can see screenshots of the two different version of the application shown below:

![PropertyCrossScreens]({{ site.baseurl }}/ceberhardt/assets/codeproject/PropertyCrossScreens.jpg)

## Introduction to Xamarin MonoTouch

Cross-platform HTML5 applications rely on the languages of JavaScript, HTML and CSS being common across all browsers, from desktop to mobile to tablet (if you ignore the compatibility issues!). HTML5 mobile apps are executed within a full-screen browser control, with the UI entirely constructed using HTML. Xamarin provides a very different approach, where a C# codebase can be shared across a range of mobile platforms, leveraging the native APIs, and most importantly the user interface frameworks, of each platform.

The history behind Xamarin started back in 2001 when the open source Mono project was initiated. This project sought to create an implementation of the Microsoft .NET framework for the Linux operating system. Mono is now a mature project, covering the C# 4.0 language, the core .NET APIs, Linq and much more.

MonoTouch uses the technologies behind the Mono framework in order to allow developers to create C# and .NET based applications which run on the iPhone and iPad. MonoTouch applications are compiled to machine code that targets the iPhone directly, i.e. there is no Virtual Machine / CLR. Application authors have much of the .NET framework at their disposal, but they also have access to the native iOS UI components, which are also exposed as C# APIs.

Xamarin also provides a similar solution for Android development, which uses Java natively. Mono for Android (previously called MonoDroid), creates code that runs on a virtual machine on the device. Again, the native UI components are exposed as C# APIs. An Android version of this application is available at the [PropertyCross website](http://propertycross.com/xamarin/).

## The Development Rig

MonoTouch still relies on many of the build and deployment tools that you use for native iOS development and for this reason you need a Mac in order to develop MonoTouch applications. The complete list of tools and hardware required are as follows:

- A Mac computer
- An Apple Developer account ($99)
- MonoDevelop – the MonoTouch IDE
- An iPhone, iPod or iPad for testing

The subject of this article is a cross platform Windows Phone and iPhone application, and unfortunately the Mac environment described above cannot be used for Windows Phone Development. It is possible to dual-boot a Mac with Windows, or use VMWare to run a Windows image, however neither provide the graphics hardware requirements of the Windows Phone emulator. Furthermore, when developing cross platform applications it is highly beneficial to be able to make changes to the shared codebase and build / test for all platforms rapidly. For this reason, a dual boot Mac would not be a terribly practical solution.

The development rig I am using is pictured below:

![DevelopmentRig]({{ site.baseurl }}/ceberhardt/assets/codeproject/DevelopmentRig.jpg)

I have a Desktop PC running Windows 8 connected to a pair of monitors. Sitting beside them is a MacBook Air, which, because it is far less ugly than a Dell PC, sits proudly on my desk! The far-left monitor is connected to the Mac.

The code resides on the PC HD, which is network shared to the Mac, with MonoDevelop linking files into the MonoTouch project from the shared folders.

In order to avoid the need for multiple mice / keyboards, I use a piece of software called [Synergy](http://synergy-foss.org/), which shares peripherals across multiple computers using its own client / server software. This tool almost magically allows you to move your mouse pointer off the edge of a PC screen onto the Mac screen. You can even share your clipboard between multiple computers. The only thing it doesn’t allow is for you to drag Mac windows onto your Windows desktop!

With this setup I can move seamlessly between the Windows Phone and iPhone codebase, and changes to the common core are immediately synchronized between each.

As an aside, cross-platform development between Android and iOS would not be as complex, with Android development using the Eclipse IDE which will run quite happily on a Mac.

## Design Patterns and MVP

The de-factor pattern for Windows Phone development is the Model-View-ViewModel (MVVM) pattern, where view logic resides within the ViewModel, and synchronisation with the ‘dumb’ View is achieved via the built-in binding framework.

The iOS APIs lack a binding framework, so the MVVM pattern is not the most appropriate to use for iOS, or cross-platform, development. There are open source MVVM implementations for iOS, but within this article I don’t want to add more frameworks to the mix, so instead, I will make use of a different UI design pattern, one that does not rely on databinding.

The MVVM pattern is, in my opinion, one of the simplest UI design patterns. It is comprised of three components, the model, which contains application data and services, the view model, which contains application logic, and the view, which renders the view model.

One of the key principles of the MVVM pattern is that the view should be as ‘dumb’ as possible, in order to maximise test coverage. For more detail on this approach, see Martin Fowlers writings on the ‘[passive view](http://martinfowler.com/eaaDev/PassiveScreen.html)’.

As a result of this principle, the view model contains view-specific state, such as whether a button is enabled, or perhaps even the color of a button. For this reason, the view model is often thought of as a ‘model of the view’.

With the MVVM pattern the view model holds a reference to the model, but not vice-versa. Likewise, the view has a reference to the view model (typically via the DataContext property), but not vice-versa. This results in a simple, linear diagram:

![MVVM]({{ site.baseurl }}/ceberhardt/assets/codeproject/MVVM.png)

Changes in view model state are reflected in the view via bindings.

In the absence of a binding framework, there is no automatic mechanism for transferring changes in view model state onto the view. In this case, the view model must ‘push’ changes to the view by directly invoking methods on the view. This results in a pattern known as the Model-View-Presenter (MVP) pattern:

![MVP]({{ site.baseurl }}/ceberhardt/assets/codeproject/MVP.png)

Adopting the MVP pattern is quite straightforward, you can still structure your models in much the same way that you would using the MVVM pattern. The main difference is that there is just a little bit more code to write!

## Application Structure

In the next sections I will cover the implementation of both versions of the application in parallel; this mirrors the actual development process where it makes sense to develop both versions side-by-side.

### The Model Layer

The code shared between the iOS and Windows Phone applications is the entirety of the model and presenter layers. The Property Finder makes use of the [Nestoria JSON APIs](http://www.nestoria.co.uk/help/api) for querying their UK property database. The primary responsibility of the model layer is to hide the details of this web service, to present a C# API for querying properties.

I’m not going to describe the model layer in detail, it’s pretty un-interesting! Instead I’ll just show a few classes so that you can understand the overall ‘shape’ of this layer.

The Nestoria APIs allows you to search by a text-based search string or a geo-location. The model layer has an interface which described this service:

```csharp
public interface IJsonPropertySearch
{
  void FindProperties(string location, int pageNumber, Action<string> callback);

  void FindProperties(double latitude, double longitude, int pageNumber, Action<string> callback);
}
```

The implementation of this interface is quite straightforward, each of the above methods uses a different query URL, so we’ll just look at the implementation of one of them:

```csharp
public void FindProperties(string location, int pageNumber, Action<string> callback, Action<Exception> error)
{
  var parameters = new Dictionary<string,object>(_commonParams);
  parameters.Add("place_name", location);
  parameters.Add("page", pageNumber);
  string url = "http://api.nestoria.co.uk/api?" + ToQueryString(parameters);
  ExecuteWebRequest(url, callback, error);
}
```

`ToQueryString` is a utility method that creates a URL, adding query string parameters using the supplied dictionary:

```csharp
private string ToQueryString(Dictionary<string, object> parameters)
{
  var items = parameters.Keys.Select(
    key => String.Format("{0}={1}", key, parameters[key].ToString())).ToArray();

  return String.Join("&", items);
}
```

The `ExecuteWebRequest` method uses the `WebClient` class to perform an asynchronous request. But this is where things get a little complicated:

```csharp
private void ExecuteWebRequest (string url, Action<string> callback, Action<Exception> error)
{
  WebClient webClient = new WebClient();

  // create a timeout timer
  Timer timer = null;
  TimerCallback timerCallback = state =>
  {
    timer.Dispose();
    webClient.CancelAsync();
    error(new TimeoutException());
  };
  timer = new Timer(timerCallback, null, 5000, 5000);

  // create a web client
  webClient.DownloadStringCompleted += (s, e) =>
  {
    timer.Dispose();
    try
    {
      string result = e.Result;
      _marshal.Invoke(() => callback(result));
    }
    catch (Exception ex)
    {
      _marshal.Invoke(() => error(ex));
    }
  };

  webClient.DownloadStringAsync(new Uri(url));
}
```

There are a couple of areas where the above code differs from the code you would most likely write if this was not being shared with a MonoTouch application …

The above code uses a timer in order to ‘timeout’ a web request that runs for too long. Within Windows Phone applications the easiest timer to use is a `DispatcherTimer`, however, this class is part of the Silverlight framework which is not supported by MonoTouch. Instead the above code uses a System.Threading.Timer, which is available in MonoTouch. For a comprehensive review of the differences between the various .NET timers, [see this MSDN article](http://msdn.microsoft.com/en-us/magazine/cc164015.aspx).

The second difference is in the usage of `WebClient`. When used on a Windows platform (Silverlight, WPF, WinForms), the web request is performed on a background thread in order to keep the UI responsive, but when the download is completed the `DownloadStringCompleted` event is fired on the UI thread – for ease of use. I found through trial and error that in MonoTouch, `DownloadStringCompleted` is not fired on the UI thread. iOS has a similar threading model to Windows Phone were UI controls have thread affinity, meaning that you should only change their state from the UI thread.

To solve this issue, the above code uses an instance of the following interface:

```csharp
/// <summary>
/// A service which marshals invocations onto the UI thread.
/// </summary>
public interface IMarshalInvokeService
{
  void Invoke(Action action);
}
```

The Windows Phone implementation does nothing, other than invoke the action immediately …

```csharp
public class MarshalInvokeService : IMarshalInvokeService
{
  public void Invoke(Action action)
  {
    // there is no need to marshal to the UI thread with Windows Phone
    action();
  }
}
```

Whereas the iOS version uses the `NSObject.InvokeOnMainThread` method to marshal the event back onto the UI thread:

```csharp
 public class MarshalInvokeService : IMarshalInvokeService
{
  private NSObject _obj = new NSObject();

  public MarshalInvokeService ()
  {
  }

  public void Invoke (Action action)
  {
    _obj.InvokeOnMainThread(() => action());
  }
}
```

I will cover this approach to resolving framework differences that impact the model and presenter layer using ‘services’ in a bit more detail later. For now it is interesting to note how the requirement to share this code between Windows Phone and iOS has had a small impact on the code structure.

Because this is a C# application (as opposed to JavaScript), string-based JSON data returned by `IJsonPropertySearch` is not the most natural format to be passing between application layers. The `PropertyDataSource` class is the primary interface for the model layer, and is responsible for converting the JSON data into an equivalent C# representation:

```csharp
public class PropertyDataSource
{
  private IJsonPropertySearch _jsonPropertySearch;

  public PropertyDataSource(IJsonPropertySearch jsonPropertySearch)
  {
    _jsonPropertySearch = jsonPropertySearch;
  }

  /// <summary>
  /// Find properties by geolocation
  /// </summary>
  public void FindProperties(double latitude, double longitude, int pageNumber, Action<PropertyDataSourceResult> callback)
  {
    _jsonPropertySearch.FindProperties(latitude, longitude, pageNumber,
      response => HandleResponse(response, callback));
  }

  /// <summary>
  /// Find properties by search-term
  /// </summary>
  public void FindProperties(string searchText, int pageNumber, Action<PropertyDataSourceResult> callback)
  {
    _jsonPropertySearch.FindProperties(searchText, pageNumber,
      response => HandleResponse(response, callback));
  }

  /// <summary>
  /// Handles the JSON response, and creates the required model objects
  /// </summary>
  private void HandleResponse(string jsonResponse, Action<PropertyDataSourceResult> callback)
  {
    JObject json = JObject.Parse(jsonResponse);

    string responseCode = (string)json["response"]["application_response_code"];

    if (responseCode == "100" || /* one unambiguous location */
        responseCode == "101" || /* best guess location */
        responseCode == "110"  /* large location, 1000 matches max */)
    {
      var result = new PropertyListingsResult(json);
      callback(result);

    }
    else if (responseCode == "200" || /* ambiguous location */
              responseCode == "202" /* mis-spelled location */)
    {
      var result = new PropertyLocationsResult(json);
      callback(result);
    }
    else
    {
      /*
      201 - unknown location
      210 - coordinate error
      */
      callback(new PropertyUnknownLocationResult());
    };
  }
}
```

Each of the model objects returned by `PropertyDataSource` takes the JSON response as a constructor argument, with the model objects being responsible for conversion. For example, if the search term is recognised and an array of properties is returned, a `PropertyListingResult` is constructed:

```csharp
public class PropertyListingsResult : PropertyDataSourceResult
{
  public PropertyListingsResult(JObject json)
  {
    TotalResult = (int)json["response"]["total_results"];
    PageNumber = int.Parse((string)json["response"]["page"]);
    TotalPages = (int)json["response"]["total_pages"];

    Data = new List<Property>();

    JArray listings = (JArray)json["response"]["listings"];
    foreach (var listing in listings)
    {
      Data.Add(new Property(listing));
    }
  }

  public int TotalResult { get; private set; }

  public int PageNumber { get; private set; }

  public int TotalPages { get; private set; }

  public List<Property> Data { get; private set; }
}
```

The `Property` model object performs a similar function, creating a C# model object from a JSON representation of a single property.

The Nestoria JSON response is quite verbose, containing many details that are not needed in the Property Finder application. The .NET framework has built in support for JSON serialization, but this would require building a C# object model that matches the structure of the entire JSON response. Instead, I opted to use the popular [Newtonsoft Json.NET library](http://json.codeplex.com/), which provides a Linq style query interface for working with JSON data. This is easily added to a Visual Studio project via NuGet.

Because Json.NET is not part of the Microsoft .NET framework, it is not available to MonoTouch developers. Fortunately there is a [MonoTouch build of Josn.NET available on github](https://github.com/chrisntr/Newtonsoft.Json) making it easy to include this into the iOS version of the application.

And that’s just about all there is to the model layer!

### The Presenter Layer

A presenter, within the MSP pattern, performs the same role as a view model within the MVVM pattern. If you are familiar with the MVVM pattern, the MVP pattern shouldn’t feel too alien!

We’ll start with the `PropertySearchPresenter`, which ‘backs’ the front page of the application. This screen provides the user with an interface that allows them to enter a search term which is used to query the property database:

![PropertySearchPresenter]({{ site.baseurl }}/ceberhardt/assets/codeproject/PropertySearchPresenter.png)

If we ignore the ‘My location’ button for now, the presenter that allows the user to enter text and click ‘go’ is quite simple …

```
/// <summary>
/// A presenter for the front-page of this application. This presenter allows the
/// user to search by a text string or their current location.
/// </summary>
public class PropertyFinderPresenter
{
  /// <summary>
  /// The interface this presenter requires from the associated view.
  /// </summary>
  public interface View
  {
    /// <summary>
    /// Sets the text displayed in the search field.
    /// </summary>
    string SearchText { set; }

    /// <summary>
    /// Supplies a message to the user, typically to indicate an error or problem.
    /// </summary>
    void SetMessage(string message);

    /// <summary>
    /// Sets whether to display a loading indicator
    /// </summary>
    bool IsLoading { set; }

    event EventHandler SearchButtonClicked;

    event EventHandler<SearchTextChangedEventArgs> SearchTextChanged;
  }

  private View _view;

  private PropertyDataSource _propertyDataSource;

  private INavigationService _navigationService;

  private SearchItemBase _searchItem = new PlainTextSearchItem("");

  public PropertyFinderPresenter(
PropertyDataSource dataSource, INavigationService navigationService)
  {
    _propertyDataSource = dataSource;
    _navigationService = navigationService;
  }

  public void SetView(View view)
  {
    _view = view;
    _view.SearchButtonClicked += View_SearchButtonClicked;
    _view.SearchTextChanged += View_SearchTextChanged;
  }

  private void View_SearchTextChanged(object sender, SearchTextChangedEventArgs e)
  {
    if (e.Text != _searchItem.DisplayText)
    {
      _searchItem = new PlainTextSearchItem(e.Text);
    }
  }

  private void View_SearchButtonClicked(object sender, EventArgs e)
  {
    SearchForProperties();
  }

  private void SearchForProperties()
  {
    _view.IsLoading = true;

    _searchItem.FindProperties(_propertyDataSource, 1, response =>
    {
      if (response is PropertyListingsResult)
      {
        var propertiesResponse = (PropertyListingsResult)response;
        if (propertiesResponse.Data.Count == 0)
        {
          _view.SetMessage("There were no properties found for the given location.");
        }
        else
        {
          var listingsResponse = (PropertyListingsResult)response;
          _state.AddSearchToRecent(new RecentSearch(_searchItem, listingsResponse.TotalResult));
          var presenter = new SearchResultsPresenter(_navigationService, _state, listingsResponse,
                                                      _searchItem, _propertyDataSource);
          _navigationService.PushPresenter(presenter);
        }
      }
      else
      {
        _view.SetMessage("The location given was not recognised.");
      }

      _view.IsLoading = false;
    });
  }
}
```

A view model for this screen might expose a `SearchString` property and a `GoButtonClickedCommand` which would be bound to the UI using XAML bindings. With the `PropertyFinderPresenter` these are replaced by an inner interface `PropertyFinderPresenter.View` – Note, this certainly doesn’t have to be an inner interface, but my feeling is that this is so tightly coupled to the presenter that it makes sense to define it as such.

The  `PropertyFinderPresenter.View` has properties that are write-only, i.e. they have a setter, but no getter, that allow the presenter to inform the view that it is in a loading state, or set the search text field. This interface also defines events which the view must implement in order to inform the presenter of user interactions.

The `PropertyFinderPresenter` has a `SetView` method, which sets its \_view field (presenters only have a single view), and adds handlers to the various events. Following that, it is all pretty straightforward stuff.

You might have noticed the `INavigationService`, more on that later …

### The View Layer

The view layer for the iOS and Windows Phone versions of the application differ considerably. I would expect that most readers of this article are already familiar with Windows Phone (or Silverlight) development, so the only real difference here is the difference between MVVM and MVP. For the iPhone, Xamarin development feels very close to native iOS development, applications have an `AppDelegate`, use view controllers and the UI is constructed using Xcode’s Interface Builder. In this section we’ll take a quick look at the view for the `PropertyFinderPresenter` for each version of the application.

### Windows Phone

For the Windows Phone version of the application, the corresponding `PropertyFinderView` is implemented as a regular page, with the XAML shown below:

```xml
<Grid Margin="10">
  <Grid.RowDefinitions>
    ...
  </Grid.RowDefinitions>

  <TextBlock Text="UK Property Finder"
              FontSize="{StaticResource PhoneFontSizeLarge}"
              Margin="0,30,0,0"/>

  <TextBlock Text="Use the form below to search for houses ..."
              Grid.Row="1"
              TextWrapping="Wrap"
              Margin="0,30,0,0"/>

  <StackPanel Orientation="Horizontal"
              Grid.Row="2"
              Margin="0,10,0,0">
    <TextBox x:Name="searchText"
              Width="200"
              TextChanged="SearchText_TextChanged"/>
    <Button x:Name="buttonSearchGo"
            Content="Go"
            Click="ButtonSearchGo_Click"/>
    <Button x:Name="buttonMyLocation"
            Content="My location"
            Click="ButtonMyLocation_Click"/>
  </StackPanel>

  <ProgressBar x:Name="loadingIndicator"
                Grid.Row="3"
                IsIndeterminate="True"
                Visibility="Collapsed"/>

  <TextBlock x:Name="userMessage"
              Grid.Row="4"
              Margin="0,20,0,20"/>
</Grid>
```

Notice that there are no XAML bindings and that the elements all have an `x:Name` property, and various event handlers.

The code-behind for this page implements the `PropertyFinderPresenter.View` interface, setting the state of the UI elements and performing the required logic when events occur. The presenter is also constructed within the `OnNavigatedTo` method, with the view set to ‘this’:

```csharp
public partial class PropertyFinderView : PhoneApplicationPage, PropertyFinderPresenter.View
{
  // Constructor
  public PropertyFnderView()
  {
    InitializeComponent();
  }

  protected override void OnNavigatedTo(NavigationEventArgs e)
  {
    base.OnNavigatedTo(e);

    if (e.NavigationMode != NavigationMode.Back)
    {
      var source = new PropertyDataSource(new JsonWebPropertySearch());

      var presenter = new PropertyFinderPresenter(source,
        new NavigationService(NavigationService));
      presenter.SetView(this);
    }
  }

#region PropertyFinderPresenter.View implementation

  public string SearchText
  {
    set
    {
      searchText.Text = value;
    }
  }

  public event EventHandler SearchButtonClicked = delegate { };

  public event EventHandler<SearchTextChangedEventArgs> SearchTextChanged = delegate { };

  public void SetMessage(string message)
  {
    userMessage.Text = message;
  }

  public bool IsLoading
  {
    set
    {
      loadingIndicator.Visibility = value ? Visibility.Visible : Visibility.Collapsed;
      searchText.IsEnabled = !value;
      buttonMyLocation.IsEnabled = !value;
      buttonSearchGo.IsEnabled = !value;
    }
  }

#endregion

#region UI event handlers

  private void ButtonSearchGo_Click(object sender, RoutedEventArgs e)
  {
    SearchButtonClicked(this, EventArgs.Empty);
  }

  private void ButtonMyLocation_Click(object sender, RoutedEventArgs e)
  {
    MyLocationButtonClicked(this, EventArgs.Empty);
  }

  private void SearchText_TextChanged(object sender, TextChangedEventArgs e)
  {
    SearchTextChanged(this, new SearchTextChangedEventArgs(searchText.Text));
  }

#endregion

}
```

I can hear the MVVM purists leaping up and down with fury at the presence of code-behind!

The main tenets of the MVVM pattern are (1) Improve testability, (2) Facilitate the Developer / Designer workflow (i.e. support Blend). Personally I am not that interested in making this application Blend-able, but I do care about writing testable code. Testing the above presenter simply requires that the unit tests supply a mock for the View interface. Other than that, it works just the same as a unit test for a view model, in other words you can fully exercise and test an application using the MVP design pattern without ever having to supply a ‘real’ view (The purists can stop jumping up and down now!).

### iOS

For iOS development you spend most of your time within MonoDevelop writing C# code, an environment that feels much like Visual Studio. But for developing the UI, you have to step into the world of Xcode and even have to create an Objective-C header file!

The iOS view for the front page is constructed using Xcode Interface Builder as shown below:

![Xcode]({{ site.baseurl }}/ceberhardt/assets/codeproject/Xcode.png)

With Windows phone development an x:Name attribute is added to elements that you want to have a field generated for in code-behind. With the Interface Builder you construct ‘outlets’ in the corresponding header file via drag and drop.

MonoDevelop automatically generates a C# partial class with references to the controls for which you have constructed outlets in the Objective-C header file. This might sound like a slightly messy integration between Xcode and MonoDevelop, but I have certainly found it reliable. It does however highlight the fact that a Xamarin iOS developer does need to be pretty familiar with iOS development in general.

The view controller for the front page performs a similar set of tasks as the corresponding Windows Phone page, implementing the ‘view’ interface required by the presenter:

```csharp
public partial class PropertyFinderViewController : UIViewController, PropertyFinderPresenter.View
{
  private PropertyFinderPresenter _presenter;

  public PropertyFinderViewController (PropertyFinderPresenter presenter)
    : base ("PropertyFinderViewController", null)
  {
    Title = "PropertyCross";

    _presenter = presenter;
  }

  public override void ViewDidLoad ()
  {
    base.ViewDidLoad ();

    // initial UI state
    searchActivityIndicator.Hidden = true;
    tableView.Hidden = true;
    tableView.SeparatorColor = UIColor.Clear;

    // handle the enter key, hiding the keyboard and initiating a search
    var enterDelegate = new CatchEnterDelegate();
    enterDelegate.EnterClicked += (s, e) => SearchButtonClicked(this, e);
    searchLocationText.Delegate = enterDelegate;

    // set the back button text
    NavigationItem.BackBarButtonItem = new UIBarButtonItem("Search",
                          UIBarButtonItemStyle.Bordered, BackButtonEventHandler);

    // associate with the presenter
    _presenter.SetView (this);
  }

  private void FavouriteButtonEventHandler (object sender, EventArgs args)
  {
    FavouritesClicked(this, EventArgs.Empty);
  }

  private void BackButtonEventHandler (object sender, EventArgs args)
  {
    NavigationController.PopViewControllerAnimated(true);
  }

  public override void ViewDidUnload ()
  {
    base.ViewDidUnload ();

    ReleaseDesignerOutlets ();
  }

  #region PropertyFinderPresenter.View implementation

  public string SearchText
  {
    set
    {
      searchLocationText.Text = value;
    }
  }

  public event EventHandler SearchButtonClicked = delegate { };

  public event EventHandler<SearchTextChangedEventArgs> SearchTextChanged = delegate { };

  public void SetMessage (string message)
  {
    userMessageLabel.Text = message;
  }

  public bool IsLoading
  {
    set
    {
      searchActivityIndicator.Hidden = !value;
      if (value)
      {
        searchActivityIndicator.StartAnimating();
      }
      else
      {
        searchActivityIndicator.StopAnimating();
      }
      goButton.Enabled = !value;
      myLocationButton.Enabled = !value;
      searchLocationText.Enabled = !value;
    }
  }

  #endregion

  partial void myLocationButtonTouched (NSObject sender)
  {
    MyLocationButtonClicked(this, EventArgs.Empty);
  }

  partial void goButtonTouched (NSObject sender)
  {
    // hide the keyboard
    searchLocationText.ResignFirstResponder();

    SearchButtonClicked(this, EventArgs.Empty);
  }

  partial void searchLocationTextChanged (NSObject sender)
  {
    SearchTextChanged(this, new SearchTextChangedEventArgs(searchLocationText.Text));
  }

  public class CatchEnterDelegate : UITextFieldDelegate
  {
    public override bool ShouldReturn (UITextField textField)
    {
      textField.ResignFirstResponder ();
      EnterClicked(this, EventArgs.Empty);
      return true;
    }

    public event EventHandler EnterClicked = delegate {};
  }

  // ...
}
```

Some of the above code might look a bit alien, `UIColors`, `UITextFieldDelegate` etc … but I am sure you will find it quite readable, it is all C# after all!

All of the other presenters / views for the application follow a similar pattern, so I am not going to describe them all in detail. Other areas where the two differ significantly is the rendering of lists, the Windows Phone application using collection-binding via `ItemsControl`, whereas the iOS version uses a `UITableView` with a`dataSource`. Two very different approaches, but entirely supported by the MVP pattern used here. For an introduction to these topics you might want to read my earlier blog post that [introduces MonoTouch](http://www.scottlogic.co.uk/blog/colin/2012/07/an-introduction-to-developing-ios-applications-with-monotouch/).

## Services

The `PropertyFinderPresenter` takes as constructor arguments the `PropertyDataSource`, which is the ‘interface’ exposed by the model layer, together with the various other ‘services’ that it requires. For example the navigation service:

```csharp
/// <summary>
/// A service which provides navigation from page to page.
/// </summary>
public interface INavigationService
{
  /// <summary>
  /// Navigates to a view for the given presenter.
  /// </summary>
  void PushPresenter(object presenter);
}
```

There are a number of functions that the presenter needs to perform, such as navigation, access to Geolocation and state persistence that cannot be provided by the core .NET APIs. As an example, the navigation API for iOS (as exposed by the MonoTouch APIs) is quite different from the navigation API for Windows Phone.

In order to allow the presenter to perform navigation (or use Geolocation, or state persistence) we need an abstraction layer. The required services can be supplied to the presenters via interfaces, with platform specific implementation supplied for Windows Phone and iOS.

This results in the following overall architecture for the application:

![ServiceLayer]({{ site.baseurl }}/ceberhardt/assets/codeproject/ServiceLayer.png)

The model and presenter layers are shared across all platforms, with any platform-specific features or functions supplied as services to the presenter-layer. The view-layer is bespoke for each platform.

The `INavigationService` interface shown above makes use of the fact that both Windows Phone and iOS have ‘stack’ base approach to navigation. The Windows Phone implementation the uses the platform-specific `System.Windows.Navigation.NavigationService`, mapping presenters to pages.

```csharp
using WPNavigationService = System.Windows.Navigation.NavigationService;

public class NavigationService : INavigationService
{
  private WPNavigationService _navigationService;

  public NavigationService(WPNavigationService navigationService)
  {
    _navigationService = navigationService;
  }

  public void PushPresenter(object presenter)
  {
    App.Instance.CurrentPresenter = presenter;

    if (presenter is SearchResultsPresenter)
    {
      _navigationService.Navigate(new Uri("/SearchResultsView.xaml", UriKind.Relative));
    }
    else if (presenter is PropertyPresenter)
    {
      _navigationService.Navigate(new Uri("/PropertyView.xaml", UriKind.Relative));
    }
    else if (presenter is FavouritesPresenter)
    {
      _navigationService.Navigate(new Uri("/FavouritesView.xaml", UriKind.Relative));
    }
  }
}<span style="font-size: 14px; white-space: normal; ">
</span>
```

Whereas the iOS version creates instances of the required view controllers which are ‘pushed’ to the `UINavigationController` instance supplied:

```csharp
public class NavigationService : INavigationService
{

  private UINavigationController _navigationController;

    public NavigationService (UINavigationController navigationController)
    {
    _navigationController = navigationController;
    }

    #region INavigationService implementation

    public void PushPresenter (object presenter)
  {
    if (presenter is SearchResultsPresenter)
    {
      var viewController = new SearchResultsViewController(presenter as SearchResultsPresenter);
      _navigationController.PushViewController(viewController, true);
    }

    if (presenter is PropertyPresenter)
    {
      var viewController = new PropertyViewController(presenter as PropertyPresenter);
      _navigationController.PushViewController(viewController, true);
    }

    if (presenter is FavouritesPresenter)
    {
      var viewController = new FavouritesViewController(presenter as FavouritesPresenter);
      _navigationController.PushViewController(viewController, true);
    }
  }

  #endregion

}
```

The same approach is used for state persistence and geo-location.

The application has a number of presenters and views that render the different application screens. I’m not going to go into each one in detail, they all follow pretty much the same pattern. The full sourcecode is included with this article – so why not take a look?

## Conclusions

The article I wrote on the HTML5 equivalent of this application had [a large section that covered the user experience](http://www.codeproject.com/Articles/445361/Property-Finder-a-Cross-Platform-HTML5-Mobile-App#ux), detailing the compromises that were made as a result of choosing this implementation technology.

For this article, there is no such section! With Xamarin the application interface is entirely native, providing the same experience as an equivalent native application.

Moving on to code sharing, one of the main driving forces for using technologies such as HTML5 or Xamarin for mobile application development is that it allows the sharing of code. For the HTML5 version of this application around 71% of the application code (i.e. JavaScript) was shared across the Windows Phone and iOS version:

![HTML5SharedCode]({{ site.baseurl }}/ceberhardt/assets/codeproject/HTML5SharedCode.png)

The remaining 29% was OS specific, for example adding back-button and app-bar support to the Windows Phone version. HTML5 does have the potential to increase the amount of code shared, if you are willing to create an application that looks near-identical on all platforms, ignoring the platform differences (i.e. Metro, Roboto, Apple-style).

With Xamarin there is a slight drop in the amount of code shared:

![XamarinSharedCode]({{ site.baseurl }}/ceberhardt/assets/codeproject/XamarinSharedCode.png)

This is to be expected, the Windows Phone and iOS UI frameworks are quite different, meaning that none of the view-layer code can be shared. Interestingly, around two-thirds of the OS Specific code resides in the iOS version. This is because the Windows Phone UI framework is more ‘high level’ and powerful, whereas iOS feels a bit more low-level – you basically have to write more code. This does not necessarily make Windows Phone a better platform, I have found that the low-level nature of iOS development makes for fewer performance issues than I have experienced with Windows Phone.

The development experience offered by both HTML5 and Xamarin are quite different. With HTML5 development is pretty much standard web development, using a browser for testing, and your favourite editor or toolset. With Xamarin things a bit more complicated, requiring a Mac and a PC and knowledge of each native platform. For this reason, despite using C#, I would say that Xamarin requires a greater up-front investment in learning the development process. However, the investment is less than would be required to learn native iOS development, which involves Objective-C.

I finished my previous article with some bullet-points that summarised my thoughts on cross-platform development. I’m going to repeat some of them here, adding some further detail and thoughts on where Xamarin is an appropriate technology:

- **HTML5 is a viable technology for cross-platform mobile application development.** Don’t be fooled by the numerous articles in the technology press that make claims like “HMTL5 will be ready in 2 years’ time”. It is ready to use now! You can write cross platform mobile applications that share a significant quantity of code.
- **HTML5 is a route of compromise.** My previous article clearly demonstrated that a HTML5 user interface is no match for the native equivalent. If you choose HTML5, please make sure you are aware of, and happy with these compromises.
- **Avoid using HTML5 to match the native look and feel.** In my opinion you will make the most of HTML5 if you do not try to match the native look and feel of each platform. Instead, create an application with its own visual identity, and use that across all platforms. This will maximise the code shared between each platform.
- **HTML5 is not the only cross-platform technology**, for a no-compromises approach, give Xamarin a try! Personally I find the technology industry’s fixation with HTML5 to be a little tiring. For cross-platform mobile application development there are other proven alternatives and in my opinion Xamarin is clearly a viable alternative.

You can download the sourcecode for this application here:  - or alternatively [visit the github  project](https://github.com/ColinEberhardt/PropertyCross) for the most up-to-date code.

To expand on my last point above, if you want to explore more alternatives, including of jQuery Mobile, Sencha Touch, Xamarin, Adobe AIR, Titanium and native development – take a look at [PropertyCross](http://www.propertycross.com/).
