---
title: Exploring Reactive Extensions (Rx) through Twitter and Bing Maps Mashups
date: 2011-02-01 00:00:00 Z
categories:
- Tech
tags:
- reactive
author: ceberhardt
layout: default_post
source: codeproject
summary: Introduces the Reactive Extensions (Rx) library through progressively complex
  Silverlight examples, culminating in a Twitter/Bing Maps mashup that plots UK snowfall
  from tweets. The article shows how Rx provides a consistent, LINQ-like model for
  composing asynchronous events and web service calls.
---

*This article was originally published on CodeProject, which has since shut down.*

**NOTE**: You can view the Silverlight examples in action [on my blog](http://www.scottlogic.co.uk/blog/colin/exploring-reactive-extensions-rx-through-twitter-and-bing-maps-mashups/).

## Introduction

Whether reacting to user-input or handling responses from web services, Silverlight applications are typically asynchronous in nature. The framework provides UI controls that fire events in response to user interactions. There are also classes like the `DispatcherTimer` and `WebControl` that perform some background work, firing events which are helpfully marshalled back onto the UI thread. However, Silverlight and the other .NET UI frameworks lack a way of orchestrating these asynchronous activities.  
  
In this article, I will look at how the Reactive Extensions (Rx) library provides a common interface for asynchronous events and actions giving a consistent way to composite, orchestrate and marshal events between threads (and also have some fun creating a few cool mashups along the way!)   
  
This article builds a couple of Rx powered Silverlight applications step by step, the final one being a Twitter / Bing Maps mashup that shows the location of snowfall in the UK based on users Tweets to the #uksnow hashtag.

![uksnow.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/uksnow.png)

## What is the Rx?

The “mission statement” for the Rx library can be summarised as follows:

> *Rx is a library for composing asynchronous and event-based programs using observable collections.*

In practical terms, Rx provides a Linq-like API for handling events, allowing the developer to aggregate, filter and query them in a concise and familiar fashion.  
  
Within the next few sections, I will provide a very brief overview of the Rx library, with the rest of the article focusing on practical and fun examples. For a much more detailed tutorial, I would recommend reading “[DEVHOL202 – Curing the asynchronous blues with the Reactive Extensions for .NET](http://www.google.co.uk/url?sa=t&source=web&cd=2&ved=0CCEQFjAB&url=http%3A%2F%2Fdownload.microsoft.com%2Fdownload%2FC%2F5%2FD%2FC5D669F9-01DF-4FAF-BBA9-29C096C462DB%2FRx%2520HOL%2520.NET.pdf&ei=Qyn1TJaoMpK0hAeFo-DCBQ&usg=AFQjCNHRfU-wca3H514w9jrU2sWk54eTQg&)”.

### Obtaining the Rx Library

The Rx library is available to download from the Rx DevLabs page:

![rxreferences.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/rxreferences.png)

Once downloaded and installed, add references to `System.Reactive`, `System.Observable` and `System.CoreEx` and you are good to go.

### The IEnumerable ‘pull’ Model

Probably the easiest way to gain a quick understanding of Rx is to compare it with Linq. The following example shows some simple logic that finds all the odd numbers in a short sequence:

~~~csharp
List<int> numbers = new List<int>()
{
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10
};

foreach (int number in numbers)
{
  if (number % 2 == 1)
  {
    Debug.WriteLine(number);
  }
}
~~~

Running the above code produces the following output:

~~~
1
3
5
7
9
~~~

We can re-write this simple algorithm using the Linq `Where` operator as follows:

~~~csharp
var oddNumbers = numbers.Where(n => n % 2 == 1);
foreach (int number in oddNumbers)
{
  Debug.WriteLine(number);
}
~~~

The Linq version of our code to find the odd numbers produces the same result as the ‘manual’ approach, however, the way in which it is executed is quite different. The Linq query is constructed by applying the `Where` operator to our source data, however, at this point the condition is not evaluated on the source. If we expand the `foreach` loop, we can see that it uses an enumerator which is obtained from the result for our query.

~~~csharp
IEnumerable<int> oddNumbers = numbers.Where(n => n % 2 == 1);

IEnumerator<int> enumerator = oddNumbers.GetEnumerator();
while (enumerator.MoveNext())
{
  Debug.WriteLine((int)enumerator.Current);
}
~~~

(**NOTE**: The expansion actually adds a `try` / `finally` block, see the [C# language reference](http://msdn.microsoft.com/en-us/library/aa664754%28VS.71%29.aspx))  
  
Each call to the `MoveNext` method on the enumerator is ‘pulling’ data from our query, with the condition being evaluated on each element of the source as and when it is needed. This ‘pull’ model results in deferred execution (or lazy evaluation depending on your preferred terminology) of the query. In the above example, our `IEnumerabl`e source is a list of fixed size, although in more general terms it is simply a source of data from which we can pull items and does not have to have a fixed size.

### The IObservable ‘push’ Model

We can achieve exactly the same result, creating a list of odd numbers, using the Rx library as follows:

~~~csharp
List<int> numbers = new List<int>()
{
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10
};

var observableNumbers = numbers.ToObservable();
var oddNumbers = observableNumbers.Where(n => n % 2 == 1);
oddNumbers.Subscribe(number => Debug.WriteLine(number));
~~~

Again, the output of the above code is exactly the same as the Linq equivalent. The `ToObservable` extension method returns an `IObservable` which is the Rx analogue of the `IEnumerable` interface in that it is a source of items. The Rx library defines many Linq-like extension methods for manipulating `IObservable` sources of data, if you explore the above code via Intellisense, you will find many familiar methods (`Where`, `Select`, `Max`, `SelectMany` ...).

The Rx library also defines the `IObserver` interface which is an analogue of the `IEnumerator` interface that is ‘hidden’ by the `foreach` syntax. The `IObservable` has a `Subscribe` method where you provide an `IObserver`. The observable source will invoke the `OnNext` method on the `IObservable` as items are pushed. Often `IObserver` is hidden via the `Subscribe` extension methods on `IObservable` which creates an `IObserver` instance for you, with your delegate method invoked when `OnNext` is invoked by the observable source.

![classDiagram.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/classDiagram.png)

So, we have seen the similarities between Linq and Rx, but what are the differences?   
  
The key difference is in what ‘drives’ the execution. With Linq, we iterate over the result of the query, ‘pulling’ the items from the `IEnumerable` source. With Rx, as soon as the subscription to our `IObservable` source is made, the items are ‘pushed’ to our subscriber.  
  
The above trivial example was selected in order to highlight the similarities between Rx and Linq, and the net result is exactly the same. Where Rx comes into its own is the extensions methods it provides to create `IObservable` sources from events or asynchronous web service calls, allowing the developer to apply familiar Linq style operations. We’ll look at a slightly more interesting example next, using Rx to handle and manipulate events.

### Creating an Observable From an Event

You can create an observable source from an even via the `FromEvent` factory method where you supply the event source (in our case a `TextBox`) and the name of the event. When you subscribe to this source, your code is executed each time the event is fired.

~~~csharp
// create an observable source from a TextChanged event
var textChangedSource = Observable.FromEvent<TextChangedEventArgs>
	(searchTextBox, "TextChanged");

// subscribe to this source
textChangedSource.Subscribe(e => Debug.WriteLine(((TextBox)e.Sender).Text));
~~~

Typing in the text ‘reactive’ yields the following output:

~~~
r
re
rea
reac
react
reacti
reactiv
reactive
~~~

*NOTE: If the hard-coded event string in the above example offends, there is a slightly more cumbersome FromEvent overload which allows you to specify add and remove handler actions explicitly.*  
  
Whilst the above example is not terribly exciting, now that we have the event packaged as an observable, we can perform Linq-style queries. In the following example, a `Select` projection operator is used to create an observable which contains just the text of the `TextBox`. This is then transformed via a second `Select` to create an observable which provides length changed ‘events’.

~~~csharp
// create an observable source from a TextChanged event
var textChanged = Observable.FromEvent<TextChangedEventArgs>
	(searchTextBox, "TextChanged")
                            .Select(e => ((TextBox)e.Sender).Text);

// create a 'derived' event
var textLengthChanged = textChanged.Select(txt => txt.Length);

// subscribe to these two sources
textLengthChanged.Subscribe(len => Debug.WriteLine("Length: " + len.ToString()));
textChanged.Subscribe(txt => Debug.WriteLine("Text: " + txt));
~~~

Again, typing reactive gives the following output:

~~~
Length: 1
Text: r
Length: 2
Text: re
Length: 3
Text: rea
Length: 4
Text: reac
Length: 5
Text: react
Length: 6
Text: reacti
Length: 7
Text: reactiv
Length: 8
Text: reactive
~~~

### The Über Rx Example

With Rx, it is possible to perform quite powerful logic based on events in a concise manner. If you paste the following code into a new Silverlight project, it gives a simple drawing application:

~~~csharp
// transform the mouse move event into an observable source of screen coordinates
var mouseMoveEvent = Observable.FromEvent<MouseEventArgs>(this, "MouseMove")
                                .Select(e => e.EventArgs.GetPosition(this));

// create observable sources from the left button events
var mouseLeftButtonDown = Observable.FromEvent<MouseButtonEventArgs>
			(this, "MouseLeftButtonDown");
var mouseLeftButtonUp = Observable.FromEvent<MouseButtonEventArgs>
			(this, "MouseLeftButtonUp");

// create a 'drag event', which takes the delta in mouse movements
// when the left button is down
var draggingEvents = mouseMoveEvent.SkipUntil(mouseLeftButtonDown)
                                    .TakeUntil(mouseLeftButtonUp)
                                    .Let(mm => mm.Zip(mm.Skip(1), (prev, cur) =>
                                        new
                                        {
                                          X2 = cur.X,
                                          X1 = prev.X,
                                          Y2 = cur.Y,
                                          Y1 = prev.Y
                                        })).Repeat();

// subscribe and draw lines
draggingEvents.Subscribe(
    p => {
      Line line = new Line();
      line.StrokeThickness = 2;
      line.Stroke = new SolidColorBrush(Colors.Black);
      line.X1 = p.X1;
      line.Y1 = p.Y1;
      line.X2 = p.X2;
      line.Y2 = p.Y2;
      this.LayoutRoot.Children.Add(line);
    });
~~~

![rxRox.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/rxRox.png)

There is some powerful stuff going on here, from transforming the mouse move events into a more useable source of screen coordinates, composition of events via `SkipUntil` and `TakeWhile`, and the creation of deltas via `Let` and `Zip`.  
  
I am not going to describe the above über example in much detail because although it demonstrates some really powerful techniques, it is just not the kind of problem that you typically have to solve when writing Silverlight (or WPF / WinForms) applications. Rather than focussing on how to composite multiple UI events, I will focus on how Rx can be used to orchestrate asynchronous web requests.

## Twitter Instant

This first example application provides a [Google Instant](http://www.google.co.uk/instant/) style search of Tweets, where Twitter is queried as you type. You can now save 2-5 seconds per Twitter search (see the above link if you do not get the reference).

### Handling User Input

We’ll start off with a new Silverlight project and add a `TextBox` to *MainPage.xaml*:

~~~xml
<UserControl x:Class="TwitterRx.MainPage" ...>
  <Grid x:Name="LayoutRoot" Background="White">
    <TextBox x:Name="searchTextBox"/>
  </Grid>
</UserControl>
~~~

In the constructor for `MainPage`, we can then use Rx to create an observable source from the `TextChanged` events:

~~~csharp
Observable.FromEvent<TextChangedEventArgs>(searchTextBox, "TextChanged")
          .Select(e => ((TextBox)e.Sender).Text)			// #1
          .Where(text => text.Length > 2)				// #2
          .Do(txt => Log("TextChanged: " + txt))			// #3
          .Throttle(TimeSpan.FromMilliseconds(400))			// #4
          .Subscribe(txt => Log("Throttle TextChanged: " + txt));	// #5

private void Log(string text)
{
  Debug.WriteLine("[" + Thread.CurrentThread.ManagedThreadId + "] " + text);
}
~~~

The above Rx query does a few things:

1. A `Select` projection operator is used to create an observable source which just contains the text.
2. A `Where` operator is used to remove text which is 2 characters or less, for a search application, there is little point in searching for very short words or single characters.
3. The `Do` operator allows you to perform some operation on the items as they are pushed from the source to the subscriber, here we log the output.
4. The `Throttle` operator ignores pushed items that arrive within the given timespan. This means that subscriptions that follow the throttle will only receive data when the user has paused for 400ms.
5. Finally, the subscription which logs the output.

If I type “reactive library” with a small pause between words, the output looks like this:

~~~
[1] TextChanged: rea
[1] TextChanged: reac
[1] TextChanged: react
[1] TextChanged: reacti
[1] TextChanged: reactiv
[1] TextChanged: reactive
[5] Throttle TextChanged: reactive
[1] TextChanged: reactive
[1] TextChanged: reactive l
[1] TextChanged: reactive li
[1] TextChanged: reactive lib
[1] TextChanged: reactive libr
[1] TextChanged: reactive libra
[1] TextChanged: reactive librar
[1] TextChanged: reactive library
[5] Throttle TextChanged: reactive library
~~~

The output is as expected; however, if you look at the numbers in brackets, which output the managed thread ID, something a little surprising is going on here. The logging at step #3 is on thread #1, which is the UI thread, however, the logging at step #5 is on thread #5. The Throttle step requires the use of a timer, so in order to free up the UI thread, the Rx library has marshalled our observations onto a threadpool thread.  
  
It is great that Rx handles switching between threads for us, however Silverlight (and WPF / WinForms) controls have thread affinity, which means that they can only have their state updated from the UI thread. Fortunately Rx makes it easy to switch the thread that observes a source, via the various `ObserveOn` methods. There is also a WPF / Silverlight specific `ObserveOnDispatcher` method.  
  
Adding a `ListBox` to our application, we can then output the text which we would like to search Twitter for by adding it to a collection bound to the `ListBox`:

~~~csharp
var textToSearch = new ObservableCollection<string>();
searchResults.ItemsSource = textToSearch;

Observable.FromEvent<TextChangedEventArgs>(searchTextBox, "TextChanged")
          .Select(e => ((TextBox)e.Sender).Text)
          .Where(text => text.Length > 2)
          .Throttle(TimeSpan.FromMilliseconds(400))
          .ObserveOnDispatcher()
          .Subscribe(txt => textToSearch.Add(txt));
~~~

## ![twitterInstant.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/twitterInstant.png)

### Searching Twitter

The next step is to take the output above and perform a twitter search with it. There are a number of ways this can be achieved, a good approach if you are building a Twitter enabled application would probably be the [TweetSharp](http://tweetsharp.codeplex.com/) .NET library. However, as I just want to perform a simple search, I decide to use the [Twitter REST AP](http://dev.twitter.com/doc/get/search)I directly. With this, API queries are performed without authentication via HTTP as a simple `GET`, e.g. <http://search.twitter.com/search.atom?q=twitter>, with the response provided in XML or JSON formats.   
  
Silverlight provides two mechanisms for making web requests, `WebClient`, which provides a simple interface which returns the string response via an event marshalled onto the UI thread, and the more feature rich `HttpWebRequest`. The Rx library allows you to create an observable source from any class which has methods that follow the standard `IAsyncResult` pattern. `HttpWebRequest` follows this pattern, so we will use it here.  
  
With `HttpWebRequest`, you invoke `BeginGetResponse` supplying the callback method that is invoked when the response is returned. Within the callback, `EndGetResponse` is invoked in order to obtain the response.  
  
The following code snippet shows how to query the twitter search API and read the result into a `string`:

~~~csharp
public MainPage()
{
  InitializeComponent();

  var request = HttpWebRequest.Create(new Uri
	("http://search.twitter.com/search.atom?q=twitter"));
  request.BeginGetResponse(new AsyncCallback(ReadCallback), request);
}

private void ReadCallback(IAsyncResult asynchronousResult)
{
  HttpWebRequest request = (HttpWebRequest)asynchronousResult.AsyncState;
  WebResponse response = request.EndGetResponse(asynchronousResult);
  Debug.WriteLine(WebResponseToString(response));
}

private string WebResponseToString(WebResponse webResponse)
{
  HttpWebResponse response = (HttpWebResponse)webResponse;
  using (StreamReader reader = new StreamReader(response.GetResponseStream()))
  {
    return reader.ReadToEnd();
  }
}
~~~

With Rx, the `FromAsyncPattern` method can be used to create a function (i.e. an anonymous delegate) which when invoked supplies an observable source which performs the web request. Subscribing to this source will give the response. The Rx equivalent to the above is as follows:

~~~csharp
var request = HttpWebRequest.Create(new Uri
	("http://search.twitter.com/search.atom?q=twitter"));
var twitterSearch = Observable.FromAsyncPattern<WebResponse>
	(request.BeginGetResponse, request.EndGetResponse);
twitterSearch().Select(webResponse => WebResponseToString(webResponse))
               .Subscribe(responseString => Debug.WriteLine(responseString));
~~~

You should be able to use the above pattern for any classes that follow the `IAsyncResult` pattern, for example Visual Studio generated web service client proxies.

### Combining Them

The problem with the above `twitterSearch` function is that it will always perform the same search. We can fix that by creating a delegate that takes the search term as an input argument using one of the generically typed `Func` delegates:

~~~csharp
private string _twitterUrl = "http://search.twitter.com/search.atom?rpp=20&since_id=0&q=";

Func<string, IObservable<string>> searchTwitter = searchText =>
{
  var request = (HttpWebRequest)HttpWebRequest.Create(new Uri(_twitterUrl + searchText));
  var twitterSearch = Observable.FromAsyncPattern<WebResponse>
		(request.BeginGetResponse, request.EndGetResponse);
  return twitterSearch().Select(res => WebResponseToString(res));
};
~~~

We can now combine this function with our event handling logic search Twitter:

~~~csharp
Observable.FromEvent<TextChangedEventArgs>(searchTextBox, "TextChanged")
          .Select(e => ((TextBox)e.Sender).Text)
          .Where(text => text.Length > 2)
          .Throttle(TimeSpan.FromMilliseconds(400))
          .SelectMany(txt => searchTwitter(txt))
          .Select(searchRes => ParseTwitterSearch(searchRes))
          .ObserveOnDispatcher()
          .Subscribe(tweets => searchResults.ItemsSource = tweets);
~~~

The `SelectMany` operator is used to bind the input text to a new observable source that performs our twitter search. The `ParseTwitterSearch` method takes the resultant response string and uses a simple bit of Linq to XML to create a `IEnumerable` of `Tweet` objects.

~~~csharp
private IEnumerable<Tweet> ParseTwitterSearch(string response)
{
  var doc = XDocument.Parse(response);
  return doc.Descendants(_entryName)
            .Select(entryElement => new Tweet()
            {
              Title = entryElement.Descendants(_titleName).Single().Value,
              Id = long.Parse(entryElement.Descendants
			(_idName).Single().Value.Split(':')[2]),
              ProfileImageUrl = entryElement.Descendants
			(_linkName).Skip(1).First().Attribute("href").Value,
              Timestamp = DateTime.Parse(entryElement.Descendants
			(_publishedName).Single().Value),
              Author = ParseTwitterName(entryElement.Descendants
			(_nameName).Single().Value)
            });
}

private string ParseTwitterName(string name)
{
  int bracketLocation = name.IndexOf("(");
  return name.Substring(0, bracketLocation - 1);
}
~~~

The subscription takes this ‘collection’ of `Tweet` objects and sets them as the `ItemsSource` for our search results list box. The `ToString` method on the `Tweet` value object simply returns the `Title`, giving the following result:

![twitterInstant2.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/twitterInstant2.png)

  

### Jazzing It Up a Bit

Finally, we can jazz up the Twitter Instant application by applying a template to our list box and a scattering of value converters. I have added an animated loading indicator, and adjusted the list opacity whilst typing to show that the current search has been invalidated.  
  
The Rx query has a few `Do` operators added to update the UI state:

~~~csharp
Observable.FromEvent<TextChangedEventArgs>(searchTextBox, "TextChanged")
          .Select(e => ((TextBox)e.Sender).Text)
          .Where(text => text.Length > 2)
          .Do(s => searchResults.Opacity = 0.5)       // reduce list opacity when typing
          .Throttle(TimeSpan.FromMilliseconds(400))
          .ObserveOnDispatcher()
          .Do(s => LoadingIndicator.Visibility = Visibility.Visible)  // show the loading
							      // indicator
          .SelectMany(txt => searchTwitter(txt))
          .Select(searchRes => ParseTwitterSearch(searchRes))
          .ObserveOnDispatcher()
          .Do(s => LoadingIndicator.Visibility = Visibility.Collapsed) // hide the
							     // loading indicator
          .Do(s => searchResults.Opacity = 1)                          // return the list
							       // opacity to one
          .Subscribe(tweets => searchResults.ItemsSource = tweets);
~~~

![twitterInstant4.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/twitterInstant4.png)

And we’re done.

What I really like about the Rx approach to this sort of problem is that the program flow becomes a single observable pipeline, free from event handlers, state flags and clumsy thread marshalling logic.  
  
**NOTE**: You might have spotted the race-condition in the above observable pipeline. If the user types ‘reactive’, pauses for a bit, causing a twitter search, then types ‘library’ resulting in a second twitter search, the result depends on which one returns first. Fortunately Rx has a few tricks up its sleeve here, if you read [DevLabs: Reactive Extensions for .NET (Rx)](http://msdn.microsoft.com/en-us/devlabs/ee794896.aspx), you will find that the Switch or TakeUntil operators can be used to solve this problem.

## A Bing Maps/ Twitter Mashup

In this next example, we’ll go one step further and create an observable pipeline that combines a twitter search with geocoding provided by the Bing Maps API.

### Let It Snow

British people love to talk about the weather, and there is nothing that gets us talking more than snow. This week, it has snowed ... [a lot!](http://www.bbc.co.uk/news/11890929) One of my favourite mashups is [Ben Marsh’s #uksnow](http://uksnowmap.com/), where you tweet your UK postcode together with how much snowfall there is in your area using the #uksnow twitter tag. Ben’s mashup adds little snow icons to a map to depict the tweets in realtime. I have been toying with the idea of creating a Silverlight clone of this mashup for a while, the Rx library and our recent excessive snowfall has given me the perfect excuse!

### Polling Twitter

In common with the previous example, the uksnow mashup uses an observable pipeline. The first few steps of the pipeline are shown below:

~~~csharp
Observable.Timer(TimeSpan.Zero, TimeSpan.FromSeconds(30))
          .SelectMany(ticks => searchTwitter("%23uksnow", _lastTweetId))
          .Select(searchResult => ParseTwitterSearch(searchResult))
          .ObserveOnDispatcher()
          .Do(tweet => AddTweets(tweet))
          .Do(tweets => UpdateLastTweetId(tweets))
          ...
~~~

This time, the `Observable.Timer` extension method is used to create a ‘tick’ every thirty seconds. A slightly modified version of the `searchTwitter` function we saw in the previous example is used to query Twitter and the results are parsed. The tweets are then pushed onto the UI thread so that can be added to the view, the `AddTweets` method simply adds them to the list on the right of the UI, whilst ensuring that there is a maximum of 100 tweets present.  
  
The modified `searchTwitter` function takes a `lastId` argument which is used to find all the Tweets since a given Id, so that we just add recent tweets with this hashtag to the list with each 30 second timer tick:

~~~csharp
private string _twitterUrl = "http://search.twitter.com/search.atom?rpp=100&since_id=";

Func<string, long, IObservable<string>> searchTwitter = (searchText, lastId) =>
  {
    var uri = _twitterUrl + lastId.ToString() + "&q=" + searchText;
    var request = (HttpWebRequest)HttpWebRequest.Create(new Uri(uri));
    var twitterSearch = Observable.FromAsyncPattern<WebResponse>
		(request.BeginGetResponse, request.EndGetResponse);
    return twitterSearch().Select(res => WebResponseToString(res));
  };
~~~

The `UpdateLastTweetId` method updates the `_lastTweetId` field:

~~~csharp
private long _lastTweetId = 0;

/// <summary>
/// Update the recorded Id of the most recent tweet
/// </summary>
private void UpdateLastTweetId(IEnumerable<Tweet> tweets)
{
  if (tweets.Any())
  {
    _lastTweetId = Math.Max(_lastTweetId, tweets.Max(t => t.Id));
  }
}
~~~

Note, because the observable pipeline is updating a field, we have to be careful about potential concurrency issues. In our case, the `ObserveOnDispatcher` operator means that the above code will always be called on the UI thread, however, the second step of our pipeline reads the value of `_lastTweetId` and will not be executed on the UI thread. If the timer ticks were reduced, this code could cause some problems if locking were not introduced.  
  
Before moving onto the next few pipeline steps, we’ll look at the items being passed along the pipeline:

~~~csharp
/// <summary>
/// A tweet!
/// </summary>
public class Tweet
{
  public long Id { get; set; }
  public string Title { get; set; }
  public string Author { get; set; }
  public string ProfileImageUrl { get; set; }
  public DateTime Timestamp { get; set; }

  public Tweet()
  { }

  public Tweet(Tweet tweet)
  {
    Id = tweet.Id;
    Title = tweet.Title;
    ProfileImageUrl = tweet.ProfileImageUrl;
    Author = tweet.Author;
    Timestamp = tweet.Timestamp;
  }

  public override string ToString()
  {
    return Title;
  }
}

/// <summary>
/// A tweet with a postcode and snowfall factor
/// </summary>
public class UKSnowTweet : Tweet
{
  public string Postcode { get; set;}
  public int SnowFactor { get; set;}

  public UKSnowTweet(Tweet tweet)
    : base(tweet)
  {
  }

  public UKSnowTweet(UKSnowTweet tweet)
    : this((Tweet)tweet)
  {
    Postcode = tweet.Postcode;
    SnowFactor = tweet.SnowFactor;
  }

  public override string ToString()
  {
    return Postcode + " " + SnowFactor.ToString() + " " + base.ToString();
  }
}

/// <summary>
/// A geocoded tweet
/// </summary>
public class GeoCodedUKSnowTweet : UKSnowTweet
{
  public Point Location { get; set; }

  public GeoCodedUKSnowTweet(UKSnowTweet tweet)
    : base(tweet)
  {
  }
}
~~~

The first part of the pipeline creates `Tweet` objects, some of which might contain a postcode and snowfactor, so we are able to create `UKSnowTweets` from them. Finally, if geocoding is successful, we can create a `GeoCodedUKSnowTweet`.

### Pushing On To Bing

Let’s look at the next steps which complete our pipeline:

~~~csharp
Observable.Timer(TimeSpan.Zero, TimeSpan.FromSeconds(30))
          .SelectMany(ticks => searchTwitter("%23uksnow", _lastTweetId))
          .Select(searchResult => ParseTwitterSearch(searchResult))
          .ObserveOnDispatcher()
          .Do(tweet => AddTweets(tweet))
          .Do(tweets => UpdateLastTweetId(tweets))
          // the next steps ...
          .SelectMany(tweets => tweets)
          .SelectMany(tweet => ParseTweetToUKSnow(tweet))
          .SelectMany(snowTweet => searchBing(snowTweet))
          .ObserveOnDispatcher()
          .Subscribe(geoTweet => AddSnow(geoTweet));
~~~

After updating the last tweet ID, a `SelectMany` operator is used to project the `IEnumerable<Tweet>` items being passed down the pipeline into individual `Tweet` items, which are then passed to the next pipeline step. The next `SelectMany` uses the `ParseTweetToUKSnow` to match the postcode and snowfactors in the tweet. For example `"Ben_fisher: #uksnow so51 1/10 hoping for a 10 :)"` is a ‘valid’ uksnow tweet. The `SelectMany` has the nice side-effect that if a tweet cannot be parsed, it does not proceed to the next pipeline step. Here is the parsing method:

~~~csharp
/// <summary>
/// Parses the given tweet returning a UKSnowTweet if the postcode and snow
/// regexes match
/// </summary>
private IEnumerable<UKSnowTweet> ParseTweetToUKSnow(Tweet tweet)
{
  string postcode = GetFirstMatch(tweet.Title, @"[A-Za-z]{1,2}[0-9]{1,2}");
  string snowFactor = GetFirstMatch(tweet.Title, @"[0-9]{1,2}/10");
  if (postcode!="" && snowFactor!="")
  {
    yield return new UKSnowTweet(tweet)
    {
      Postcode = postcode,
      SnowFactor = int.Parse(snowFactor.Split('/')[0])
    };
  }
}
~~~

Following this, the Bing Maps API is used to geocode the postcode, again via a `SelectMany`. Just like our Twitter search, the observable `FromAsynchPattern` is used to build a suitable function:

~~~csharp
Func<UKSnowTweet, IObservable<GeoCodedUKSnowTweet>> searchBing = tweet =>
{
  var uri = _geoCodeUrl + tweet.Postcode + "?o=xml&key=" + _mapKey;
  var request = (HttpWebRequest)HttpWebRequest.Create(new Uri(uri));
  var twitterSearch = Observable.FromAsyncPattern<WebResponse>
		(request.BeginGetResponse, request.EndGetResponse);
  return twitterSearch().Select(res => WebResponseToString(res))
    .Select(response => ExtractLocationFromBingGeoCode(response))
    .Select(loc => new GeoCodedUKSnowTweet(tweet)
    {
      Location= loc
    });
};
~~~

A `UKSnowTweet` is passed in, and observable returned, which when subscribed to, returns a `GeoCodedUKSnowTweet` if the geocode is a success. The `ExtractLocationFromBingGeoCode` method is again a simple bit of Linq to XML which parses the XML response.

Finally, we `ObserveOnDispatcher` and subscribe, with the resulting geocoded tweets pushed to our `AddSnow` method. This method adds a snow image as a child of a Bing Maps control, using the `MapLayer` attached properties to add it at the required latitude / longitude.

~~~csharp
/// <summary>
/// Adds the given tweet to the map
/// </summary>
private void AddSnow(GeoCodedUKSnowTweet geoTweet)
{
  var location = new Location(geoTweet.Location.X, geoTweet.Location.Y);
  int factor = geoTweet.SnowFactor;

  Image image = new Image();
  image.Tag = geoTweet;
  image.Source = new BitmapImage
	(new Uri("/TwitterRx;component/snow.png", UriKind.Relative));
  image.Stretch = Stretch.None;
  image.Opacity = (double)factor / 10.0;
  Map.Children.Add(image);

  MapLayer.SetPosition(image, location);
  MapLayer.SetPositionOrigin(image, PositionOrigin.Center);
}
~~~

And with that, our mashup is complete ...

![uksnow.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/uksnow.png)

**NOTE**: To run this example yourself, you will have to download [Bing Maps Silverlight SDK](http://msdn.microsoft.com/en-us/library/dd877180.aspx) and also register to get a Bing Maps API key.

## Conclusions

The Rx library is without a doubt a very clever and powerful tool, also the similarities with Linq certainly help the learning process. Many of the examples I have seen concentrate on UI event handling, which as I stated before is something I don’t find myself doing terribly often. Typically Silverlight applications consist of a `ViewModel` bound to the state of various UI controls, together with commanding, as a result you can write complex application without going anywhere near UI events. In my opinion, the real strength of Rx lies in orchestration of program flow. I really like the way that I was able to create the uksnow mashup as a single Observable query or pipeline, making the application flow clear concise and maintainable.

So ... what are your thoughts? Do you think you will use Rx? Is it a neat solution, or just a bit hard to get your head round?

## Further Reading

I have found the following resources to be very handy.

- [DevLabs: Reactive Extensions for .NET (Rx)](http://msdn.microsoft.com/en-us/devlabs/ee794896.aspx) – The Rx library homepage, go here for downloads, tutorials etc ...
- [DEVHOL202 – Curing the asynchronous blues with the Reactive Extensions for .NET](http://www.google.co.uk/url?sa=t&source=web&cd=2&ved=0CCEQFjAB&url=http%3A%2F%2Fdownload.microsoft.com%2Fdownload%2FC%2F5%2FD%2FC5D669F9-01DF-4FAF-BBA9-29C096C462DB%2FRx%2520HOL%2520.NET.pdf&ei=Qyn1TJaoMpK0hAeFo-DCBQ&usg=AFQjCNHRfU-wca3H514w9jrU2sWk54eTQg&) – A thorough introduction to Rx
- [Using Reactive Extensions in Silverlight](http://www.silverlightshow.net/items/Using-Reactive-Extensions-in-Silverlight.aspx) by Pencho Popadiyn
- [Fun with Rx](http://www.codeproject.com/KB/miscctrl/RxDemos.aspx) by Sacha Barber
- [101 Rx Examples](http://rxwiki.wikidot.com/101samples)
- [Reactive Extensions for .NET (Rx) Forum](http://social.msdn.microsoft.com/Forums/en/rx/threads)
