---
title: From Silverlight to HTML5
date: 2011-07-01 00:00:00 Z
categories:
- Tech
tags:
- html5
- silverlight
author: ceberhardt
layout: default_post
source: codeproject
summary: Documents the experience of re-implementing a Silverlight Windows Phone 7 Jump List control in HTML5, CSS3, and JavaScript to run cross-platform on mobile browsers. Rather than a feature-by-feature comparison, the focus is on the difference in development approach and general feel between the two technologies.
---

*This article was originally published on CodeProject, which has since shut down.*

## Outline

- [Overview](#overview)
- [Introduction (and Windows 8)](#intro)
- [The Silverlight JumpList Control](#silverlight)
- [A JavaScript Refresher](#refresher)
- [Getting Started](#started)
- [Rendering a Simple List](#simpleList)
- [Creating a jQuery Widget](#widget)
- [Tidying Up the Code - JSLint](#jslint)
- [Editors and IDEs](#ides)
- [jQuery Templates](#templates)
- [Adding Jump Buttons](#jumpButtons)
- [Animating the Category Buttons (Hello CSS3!)](#css3)
- [Scrolling the List](#scrolling)
- [Scrolling on a Mobile](#mobile)
- [Conclusions](#conclusions)

## Overview

This article describes my experiences of taking a control written in Silverlight for Windows Phone 7 and making it cross-platform by re-implementing it using JavaScript and HTML5. My aim in writing this article was not to compare HTML5 / CSS3 / JavaScript and Silverlight feature-by-feature; if you squint a bit, you can map most features from one to the other. Instead I wanted to capture the difference in approach and the general ‘feel’ of developing with these two very different technologies.

You can see the finished HTML5 control in action on an iPod Touch here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ckyuUPVVq9g" frameborder="0" allowfullscreen></iframe>

You can also see it running in [your browser on my blog](http://www.scottlogic.co.uk/blog/colin/2011/07/from-silverlight-to-html5-codeproject-article/).

## Introduction (and Windows 8)

I wrote my original [JumpList control for Windows Phone 7](http://www.codeproject.com/KB/windows-phone-7/WindowsPhone7JumpLIst.aspx) a few months ago. Creating a cross-platform JavaScript equivalent has been on my list of things-to-do for a long while now. There is no doubt that HTML5, and its potential as a platform for the development of cross-platform applications, is gaining popularity and momentum. The competing technologies of Silverlight, HTML5, and Flash/Flex make it hard to know which technology to choose, a subject which I have [covered in depth in a recent white paper](http://www.scottlogic.co.uk/blog/colin/2011/05/flex-silverlight-html5-time-to-decide/). Interestingly, while there are a number of technologies that can potentially be used for cross-platform web application development, for the mobile, there is just one, HTML5. Fortunately, mobile browsers are ahead of the desktop in terms of HTML5 adoption, which is why I decided it would be an interesting exercise to port some Windows Phone 7 code I have written to HTML5 in order to have it run on iPhone, Android, and BlackBerry.

Recent press regarding the release of Windows 8 has caused a great deal of [worry and confusion within the development community](http://www.riagenic.com/archives/637). Microsoft has advertised that HTML / JavaScript will be an integral part of Windows 8 and its Metro themed user interface. This has led many to wonder what the future holds for Silverlight, which many feel should be the technology of choice for Metro interfaces. I’m not going to go into my own opinions on this matter; I will instead direct readers to [a blog post by Mike Brown](http://azurecoding.net/blogs/brownie/archive/2011/06/11/silverlight-the-rumors-of-my-death-have-been-greatly-exaggerated.aspx) which I think provides a pragmatic and measured summary of the current situation.

Recent events aside, it is clear that the momentum behind HTML5 is growing. I think it is a wise move for any developer to try their hand at developing the “JavaScript way”.

## The Silverlight JumpList Control

The Windows Phone 7 JumpList solves an interesting problem facing developers of mobile applications. Whilst on the desktop, precise mouse movements can be used to grab and drag a scrollbar, navigating large lists of information. Mobile UIs typically forego visible scrollbars, replacing them with swipe gestures, thus saving on precious screen space. However, if you are faced with a long list of information, having to swipe multiple times to reach a location near the bottom of the list becomes quite a chore!

That’s where the JumpList comes in. The data in the list is arranged into categories, each with a ‘jump button’ at the top. Clicking a jump button shows a category view where you can click to ‘jump’ the list to the desired location. This works very well for data arranged by date or alphabetically.

The following screenshots show the control that I developed in action:

![JumpListBasic.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/JumpListBasic.png)

You can read all about the development of this control in my previous CodeProject article.

## A JavaScript Refresher

I have not had a great deal of JavaScript experience, so before embarking on this development, I thought I should hit the books. A number of my colleagues have a copy of Douglas Crockford’s “JavaScript: The Good Parts”, so, not wishing to learn about bad things, I thought this was a good place to start.

![TheGoodParts.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/TheGoodParts.jpg)

“The Good Parts” is an interesting read. The author takes a refreshingly honest view of the JavaScript language. It is always amusing to compare the size of this book side-by-side with the “Definitive Guide”. This might not be an accurate reflection of exactly how much of JavaScript is “good”, however it does make you think - Exactly what kind of language is this that it needs a book that carefully guides you away from the “Bad Parts”? You certainly won’t find similar “Good Parts” books for Java, C#, or any other mainstream programming languages.

The lack of familiar object-oriented constructs, lack of block scope, a ‘this’ keyword that has a very [different meaning to ‘this’ in C# and Java](http://www.scottlogic.co.uk/blog/chris/2010/05/what-is-this/), and the [numerous other JavaScript Gotchas](http://www.codeproject.com/KB/scripting/javascript-gotchas.aspx) have given the language a bad name, especially among developers who have come to JavaScript via C# or Java.

The forgiving nature of the JavaScript language means that that you can make things work with quite sloppy code. However, as the popularity of HTML5 increases and we find ourselves building more and more complex applications using the JavaScript language, a deeper understanding of the language becomes more important. And for that purpose, the “Good Parts” is a useful guide.

## Getting Started

Armed with the “Good Parts”, I started to ponder over which of the JavaScript inheritance patterns I was going to use to create the JumpList control; [Pseudo-classical? Prototypal?](http://stackoverflow.com/questions/1586915/performing-inheritance-in-javascript) Should I use the [Module Pattern](http://stackoverflow.com/questions/247209/javascript-how-do-you-organize-this-mess)? Then my head started to hurt, and I started to think twice about bothering with the whole idea! Until I realised, unlike Silverlight and WPF, WinForms, Swing (Java), and practically every other UI framework, you do not have to inherit from an existing class in order to create a control.

This led me to consider a fundamental difference between Silverlight and HTML / JavaScript. With Silverlight, the UI (User Interface) is defined within XAML, an XML file, which is then parsed to create an in-memory representation of the UI (the visual tree). All the elements within the tree must inherit from a common base class, `DependencyObject`. Basically, XAML is little more than a convenient syntax for creating an object graph. On the other hand, HTML is not a syntax for creating JavaScript objects, far from it! HTML describes the structure of a page, which is parsed by the browser to create a Document Object Model (DOM). The browser exposes an API for manipulating this DOM using the JavaScript language. The two are quite “loosely coupled” and each can exist (and often does) without the other. Whereas XAML is “tightly coupled” with the Silverlight framework, with its only purpose being to create instances of the classes that the framework contains.

The independence of HTML and JavaScript freed me from the tricky decisions relating to inheritance patterns, you can simply create your markup and manipulate it. I also found that this independence has advantages when you try to perform more complex interactions, but more on this later...

JavaScript developers rarely program directly against the API exposed by the DOM, instead favouring the use of abstraction APIs. There are a few reasons why abstraction APIs make sense for JavaScript development, firstly, the DOM APIs exposed by the various browsers differ, secondly, abstraction APIs often provide much more powerful functionality than the DOM APIs that they abstract.

There are quite a few abstraction APIs to choose from, so rather than review each in turn, I decided to choose the most popular one, [jQuery](http://jquery.com/).

## Rendering a Simple List

Time to stop worrying about the right way to do things, and write some code!

My test page has the following simple markup:

~~~html
<html>
<head>
    <script type="text/javascript" src="jquery-1.6.1.js"></script>
    <script type="text/javascript" src="jumpList.js"></script>
    <link rel="stylesheet" type="text/css" href="jumpList.css" />
</head>
<body>
    <div class="jumpList" style="width:200px; height:300px"/>
</body>
</html>
~~~

Where the `div` with the class `jumpList` is the DOM element where I would like to create my control.

Incidentally, I made the mistake of making the script tags self-closing elements, i.e., `<script />`, which [unfortunately doesn’t work](http://stackoverflow.com/questions/69913/why-dont-self-closing-script-tags-work). I wasted quite a bit of time with that annoying little novice error!

My first-cut at the JumpList JavaScript code creates an array of `people` objects (using some code I found on the internet for [creating random names](http://leapon.net/files/namegen.html)), which is sorted by surname. The code then iterates over this array, adding a new `li` element for each within a parent `ul` with the class `itemList`.

~~~jscript
// create the test data
var people = [];
for (var i=0;i<20;i++) {
    people.push({
        surname : getName(4, 10, '', ''),
        forename : getName(4, 6, '', '')
    });
}

// sort the data
var sortFunc = function(a, b) {
    return a.surname.localeCompare(b.surname);
}
people.sort(sortFunc);

// populate the jump list
$(document).ready(function () {
  // create the category and item lists
  var $jumpList = $(".jumpList");
  var $itemList = $("<ul class='itemList'>");
  for (var i = 0; i < people.length; i++) {
    // add an item to the list
    var $jumpListItem = $("<li class='jumpListItem'>").text(
           people[i].surname + ", " + people[i].forename);
    $itemList.append($jumpListItem);
  }

  // add the item list
  $jumpList.append($itemList);
});
~~~

The best way to see the structure that this code creates is via a browser based developer tool such as Firefox’s Firebug or the built-in Chrome developer tools:

![chromeDevTools.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/chromeDevTools.png)

Most of the above JavaScript code is probably relatively easy to follow for a C# developer, however the dollar functions $() are probably worth a mention. jQuery defines a global function with the name ‘$’ which is used to create a jQuery object, by supplying a CSS selector or an HTML snippet. jQuery is well known for its Fluent interface which allows you to chain function calls:

~~~jscript
$("div.test").add("p.quote").addClass("blue").slideDown("slow");
~~~

This Fluent style is familiar to C# developers who use the (extension method) LINQ syntax. However, the way the two work is quite different. The Fluent C# LINQ APIs rely on extension methods defined on the `IEnumerable` interface, where each method returns an `IEnumerable`. With jQuery, the jQuery object (which is the object returned by the dollar function) wraps a collection of DOM nodes, each function manipulates these nodes and returns a jQuery object.

The use of a global function ‘$’ makes jQuery quite concise. However, other libraries can, and do, define this same global function. For example, Microsoft’s ASP.NET AJAX library provides a dollar function as a shorthand for fetching a DOM element by ID. Fortunately, jQuery has a [noConflict mode](http://api.jquery.com/jQuery.noConflict/) that omits the global dollar function.

In the above code, I have prefixed all variables that are jQuery objects with a dollar. This is a popular convention, but has no effect on the execution itself.

So far the code above has created a nested `ul` which contains our list of elements. The Windows Phone 7 control I am replicating allows you to scroll a long list of data, so the nested `ul` needs to be cropped to the height of its parent, allowing you to scroll its contents. The CSS `overflow` property enables this functionality:

~~~css
.itemList
{
    overflow-y: auto;
}
~~~

The `ul` and `li` elements are also styled to remove the bullet-points, and padding that are applied by standard to these elements:

~~~css
ul.itemList
{
    padding: 0;
}

ul.itemlist li
{
    list-style-type: none;
}
~~~

For this to work, the `itemList` div needs to have the same height as its parent. Unfortunately, this is not so easily achieved with CSS alone. The Silverlight JumpList control uses a grid layout in order that the item list and category list share the same content area. However, there is no such direct equivalent in HTML. The lack of decent grid support is why there are so many hacked approaches for creating classic web-page layouts, like the three-columns and footer layout (and which is why I still quite happily use tables!). Some of the future CSS features like the [Grid Layout Module](http://www.w3.org/TR/css3-grid/) and [Template Layout Module](http://www.w3.org/TR/2009/WD-css3-layout-20090402/) look very promising, but neither appears to have got to the stage of even a preliminary implementation in a browser.

At the moment, the best solution to this problem is to use JavaScript:

~~~jscript
// set the height of the itemList to that of the container
$itemList.height($jumpList.height());
$itemList.width($jumpList.width());
~~~

This gives the desired effect:

![JumpList1.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/JumpList1.jpg)

Whilst the lack of a decent grid layout is frustrating, it is worth noting that the primary focus of HTML is flow layouts, where the height of the page changes based on the content within it. Vertical scrolling of content is quite natural with HTML. Whereas, Silverlight applications are typically constrained to a fixed screen size, in the same way that desktop applications often are. In this context, the developer typically arranges the UI controls to fill the available space. HTML5 might not have a decent grid layout, but conversely Silverlight does not have a decent flow layout that can mix text, images, and other content.

So far things have not gone too well! I have spent too much time stressing over inheritance patterns, become stuck with my script tags, and frustrated by the need for JavaScript code to achieve the layout I require. I have a feeling that many C# developers reach this stage and simply dismiss JavaScript. Fortunately, it does get better!

## Creating a jQueryUI Widget

My code so far is not terribly re-useable, with the div element where the control is located being hard-coded. jQuery has its own UI framework called [jQueryUI](http://jqueryui.com/) which has a collection of widgets (i.e., controls) such as Buttons and DatePickers. I am not sure how popular jQueryUI is, the current framework only includes eight widgets. However, I decided that it was worth a try anyway. The jQueryUI documentation is a little light when it comes to describing how to define your own widgets, although I did find a very popular blog post that did a [very good job of describing the process](http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/).

Re-writing the above code as a jQueryUI widget is a straightforward process, following the simple pattern described in the referenced blog post. An object is created with an `options` property which allows variables to be passed in when a widget is created. The `_init` function is used to build the required UI for the widget, which uses the same code as above. The only difference being that rather than hard coding a CSS selector to the div in the test HTML document, the widget framework sets the `this.element` property to the DOM element where the widget is to be constructed.

~~~jscript
var JumpList = {
  // initial values are stored in the widget's prototype
  options: {
    items: []
  },

  // jQuery-UI initialization method
  _init: function () {

    var $jumpList = $(this.element),
              $itemList = $("<ul class='itemList'>");

    for (var i = 0; i < this.options.items.length; i++) {
      // add an item to the list
      var person = this.options.items[i];
      var $jumpListItem = $("<li class='jumpListItem'>").text(
                             person.surname + ", " + person.forename);
      $itemList.append($jumpListItem);
    }

    // add the item list
    $jumpList.append($itemList);

    // set the height of the itemList to that of the container
    $itemList.height($jumpList.height());
    $itemList.width($jumpList.width());

  }
};
~~~

Finally, before we can use this widget, we must register it as follows:

~~~jscript
$.widget("ui.jumpList", JumpList);
~~~

Using it in the test HTML document is as simple as the following:

~~~jscript
$(".jumpList").jumpList({
  items: people
});
~~~

The net result is that we now have a re-useable widget, where the above syntax gives us the potential to create multiple widget instances simply by using a CSS selector that matches multiple DOM elements.

Something else rather interesting is going here, by registering the `JumpList` object defined above with the jQueryUI widget framework, this has resulted in the addition of a new function ‘`jumpList`’, to the jQuery object. How exactly does this work?

Whilst you can ‘fake’ the addition of methods to existing types in C# by the use of extension methods, with JavaScript, you can add functions to existing objects by adding a function to the object’s prototype. This allows you to add new functionality to existing objects (i.e., [Mixins](http://en.wikipedia.org/wiki/Mixin)), without being constrained by the traditional inheritance hierarchies. Again, this is another reason why classical object oriented inheritance is less relevant to JavaScript.

## Tidying Up the Code – JSLint

So far I have not discussed tooling and IDEs. In fact, for the first few hours of development, I used Notepad++, a Notepad for developers with syntax highlighting, powerful search functionality, plug-ins, and much more. Before I tackle JavaScript IDEs, I want to look first at code quality.

The forgiving nature of the JavaScript language and its numerous gotchas (or “Bad Parts”) means that it is very easy to write poorly constructed hard-to-maintain code. Douglas Crockford, the author of the “Good Parts”, has written and actively maintains JSLint, a static analysis tool for improving JavaScript code quality. Notepad++ has a [JSLint plugin](http://sourceforge.net/projects/jslintnpp/), and on installing and running this, it found a number of issues with my code so far, missing semi-colons and inconsistent indentation among other things. You will find that JSLint often picks up simple typos and syntax errors as well as stylistic issues, so running JSLint each time before you refresh your browser window will save you time.

A particularly interesting issue which JSLint picked up on with my code is with the following snippet:

~~~jscript
var $jumpList = $(this.element),
        $itemList = $("<ul class='itemList'>");

for (var i = 0; i < this.options.items.length; i++) {
  // add an item to the list
  var person = this.options.items[i];
  var $jumpListItem = $("<li class='jumpListItem'>").text(
                       person.surname + ", " + person.forename);
  $itemList.append($jumpListItem);
}
~~~

For the above code, JSLint advises that I should “Move `var` declarations to the top of the function”. This highlights another feature of the JavaScript language that C# developers struggle with. Firstly, if you omit the `var` keyword, you will not create a local variable, instead you will create what is effectively a global variable. Secondly, JavaScript does not have block-level scope, therefore the `$jumpListItem` variable defined in the above code will be scoped to the function that contains it. JSLint encourages you to group all variable declarations to the start of each function to avoid confusion:

~~~jscript
var $jumpList = $(this.element),
        $itemList = $("<ul class='itemList'>"),
        $jumpListItem,
        person,
        i;

for (i = 0; i < this.options.items.length; i++) {
    // add an item to the list
    person = this.options.items[i];
    $jumpListItem = $("<li class='jumpListItem'>").text(
                      person.surname + ", " + person.forename);
    $itemList.append($jumpListItem);
}
~~~

## Editors and IDEs

There is something of a joke among Silverlight developers that moving to HTML5 means ditching Visual Studio in favour of Notepad. Whilst IDE support for JavaScript is not as good as it is for C# and Java, it is certainly a lot better than using Notepad!

The Eclipse IDE has good JavaScript support, providing views of the structure of your code and refactoring tools. The auto-complete feature also understands JSDoc giving you an in-editor summary of functions. Eclipse also has a number of built in checks for code-quality that mirror a lot of the issues that JSLint identifies.

Visual Studio has also greatly improved its JavaScript support; whilst it is not so good at representing the structure of JavaScript files as Eclipse, the Intellisense (auto-complete) support has improved considerably. The IDE pseudo-executes your JavaScript code for you, allowing it to make a very accurate ‘guess’ at the functions available at runtime. For example, the `jumpList` function which the widget framework adds to the jQuery prototype is visible:

![Intellisense.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/Intellisense.jpg)

However, this approach has some limitations; for example, it has no way of determining how your JavaScript files are assembled at runtime, hence you get no Intellisense of the jQuery API when editing the *jumpList.js* file! There are ways to provide the IDE with the information it requires, but these are not well documented. For details, see my friend [Luke Page’s blog](http://www.scottlogic.co.uk/2010/08/vs-2010-vs-doc-and-javascript-intellisense/).

Visual Studio also lacks decent JavaScript code quality checks, however Luke has also developed a [fantastic JSLint plugin](http://jslint4vs2010.codeplex.com/) that has started to become very popular among developers.

Anyhow, enough about tooling, let’s get back to the JumpList control ...

## jQuery Templates

With the current work-in-progress, the surname and forename properties are hard-coded into the code for the widget, which significantly reduces its versatility. In order to address this, we need some way of allowing the developer to specify a template which details how each of their items is rendered, i.e., a concept like Silverlight’s `DataTemplate`. Neither JavaScript nor HTML5 have a similar concept, so we are going to have to look elsewhere. This is a common problem, and as expected, there are numerous frameworks that provide a potential solution. Rather than mix together different JavaScript frameworks, I decided to give the [jQuery templates plug-in](http://api.jquery.com/category/plugins/templates/) (which is incidentally written by Microsoft!) a try.

The API for the templates plug-in is very simple, adding just a couple of functions to the jQuery object. To use this feature, I added an `itemTemplate` property to the options for the widget. When the widget is initialized, this template is compiled using the `$.template` function, with each item rendered using this template via the `$.tmpl` function:

~~~jscript
// 'compile' the template
$.template("itemTemplate", this.options.itemTemplate);

// add each item to the list
for (i = 0; i < this.options.items.length; i++) {
  item = this.options.items[i];
  // create the div that contains the item
  $jumpListItem = $("<li class='jumpListItem'>");
  // render the item using the named template
  $.tmpl("itemTemplate", item).appendTo($jumpListItem);
  // add the the jumplist
  $itemList.append($jumpListItem);
}
~~~

The widget is now totally decoupled from the array of objects that it renders, with the template passed to the widget on instantiation as follows:

~~~jscript
$(".jumpList").jumpList({
  items: people,
  itemTemplate : "<b>${surname}</b>, ${forename}"
});
~~~

The above template renders the surname in bold as shown below:

![JumpList2.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/JumpList2.jpg)

## Adding Jump Buttons

In order to turn the list of items into a jump list, we need a way to assign each item to a category and render this category above each group of items within the category. This is the button which when clicked shows the category view and so is called a ‘jump button’.

Another options property is added to the widget, ‘`categoryFunction`’, which maps each item to a category. Here we take the first letter of the surname:

~~~jscript
$(".jumpList").jumpList({
    items: people,
    itemTemplate: "${surname}, ${forename}",
    categoryFunction: function (person) {
        return person.surname.substring(0,1).toUpperCase();
    }
});
~~~

The loop that builds the item list now adds jump buttons:

~~~jscript
this._$itemList = $("<div class='itemList'/>");

// create the item list with jump buttons
for (i = 0; i < this.options.items.length; i++) {

    item = this.options.items[i];
    category = this.options.categoryFunction(item);

    if (category !== previousCategory) {
        previousCategory = category;

        // create a jump button and add to the list
        $jumpButton = $("<a class='jumpButton'/>").text(category);
        $jumpButton.attr("id", category.toString());

        $categoryItem = $("<li class='category'/>");
        $categoryItem.append($jumpButton);
        this._$itemList.append($categoryItem);

        // store a reference to the button for this category
        jumpButtons[category] = $jumpButton;
    }

    // create an item
    $itemMarkup = $("<div class='jumpListItem'/>");
    $.tmpl("itemTemplate", item).appendTo($itemMarkup);

    // associate the underlying object with this node
    $itemMarkup.data("dataContext", item);

    // add the item to the list
    $categoryItem.append($itemMarkup);
}
~~~

Notice above the use of the jQuery `data()` function, this is a great little feature that allows you to associate arbitrary data with a DOM element. Here I am creating a relationship between the items supplied to the jump list and the DOM elements that represent them. I have called this the `DataContext` as a nod to the Silverlight functionality this imitates!

Supplying some suitable CSS:

~~~css
a.jumpButton
{
    background: #55FF55;
    margin: 7px;
    padding: 5px;
    width: 30px;
    height: 30px;
    display: block;
}
.jumpListItem
{
    margin: 10px;
}
~~~

The jump list is starting to take shape:

![JumpList3.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/JumpList3.jpg)

Notice that the style creates quite large buttons and has a wide margin around each item. This is because it is intended for use on a mobile device, where font sizes and hit-areas need to be larger than on the desktop.

Adding click event handlers can be done via the jQuery `click()` function, and my first attempt at handling jump button clicks looked like this:

~~~jscript
// create the item list with jump buttons
for (i = 0; i < this.options.items.length; i++) {
  ...

  if (category !== previousCategory) {
    ...

    // create a jump button and add to the list
    $jumpButton = $("<a class='jumpButton'/>").text(category);

    $jumpButton.click(function () {
      alert("category clicked: " + category);
    });
  }

  ...
}
~~~

However, this doesn’t function in quite the way you might expect! Clicking on any of the jump buttons reports:

![Alert.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/Alert.jpg)

While confusing at first, the reason for this is actually quite simple. We have seen previously how the lack of block-level scoping means that JSLint encourages you to move variable declaration to the start of the function. Therefore, regardless of which button is pressed, we see the final value of category.

This problem can be solved via a very interesting language feature that is like nothing found in C# / Java. The following modification to the click handler results in the desired behavior:

~~~jscript
$jumpButton.click(function (cat) {
  return function () {
    alert("category clicked: " + cat);
  };
} (category));
~~~

So what’s going on here? This is a mixture of two interesting concepts in JavaScript. The first is an immediate function, a function which is being executed immediately on its creation. In this case, we are creating a function and immediately invoking it passing the category. The second is a closure, where references to variables within the scope of a function are ‘captured’.

The use of closures solves the problem, however there is actually a simpler way that uses a single function rather than creating a new function per category, so consumes a little less memory (considering that closures result in references to the variables within the scope of a function, they can be quite memory hungry).

Mouse events bubble up the DOM in exactly the same way that events bubble up the visual tree in Silverlight. So a simpler solution is to add a single click event handler on the list, rather than one at each element.

I wanted to move this event handler outside of the initialization code, in order to avoid bloating the function; however, this presents another challenge. The value of the `this` variable within a function is dependent on the way in which the function is called. For events that are raised from DOM elements, such as the click event, `this` is a reference to the event source element. Moving the event handler to a property of the JumpList object means that we no longer have a reference to the JumpList object via `this`.

In order to solve this, the various jQuery objects that ‘wrap’ the components parts of the widget are pulled out of the initialization function and made properties of the JumpList object. The click event handler for the parent div that contains the items and the jump buttons is registered using the `bind()` function, which allows you to add data that will be passed to the event handler function. Here, a reference to the jump list is passed. The event handler can then obtain a reference to the jump list via the `event.data` property, and the source element (i.e., the jump button or item) via the `event.target` property:

~~~jscript
var JumpList = {

  // jQuery-UI initialization method
  _init: function () {

    ...

    // create the item list with jump buttons
    for (i = 0; i < this.options.items.length; i++) {

      ...
    }

    // add a click handler to the itemList
    this._$itemList.bind("click", { jumpList: this },
                         this._itemListClickHandler);

    ...

  },

  // Handles click on the itemlist, this is either a jump list item or
  // jump button click
  _itemListClickHandler: function (event) {
    var jumpList = event.data.jumpList,
            $sourceElement = $(event.srcElement);

    // handler jump list item clicks - resulting in selection changes
    if ($sourceElement.hasClass("jumpListItem")) {
      if (!$sourceElement.hasClass("selected")) {
        // remove any previous selection
        jumpList._$itemList.find(".selected").removeClass("selected");
        // select the clicked element
        $sourceElement.addClass("selected");
        // fire the event
        jumpList._trigger('selectionChanged', 0,
                 $sourceElement.data("dataContext"));
      }
    }

    // handle jump button clicks
    if ($sourceElement.hasClass("jumpButton") === true) {
      // fade out the itemlist and show the categories
      jumpList._$itemList.addClass('faded');
      jumpList._$categoryList.addClass('visible');
      });
    }
  },

  _$itemList: undefined,
  _$categoryList: undefined,

  ...
};
~~~

The above event handler shows the category view if a jump button is clicked (more on this later) and implements a very simple selection mechanism, adding a `selected` class to the clicked item and raising a `selectionChanged` event. Here you can see the use of the jQuery `data()` function to extract the ‘bound’ item that the DOM element represents, emulating the Silverlight `DataContext` concept.

We can add a handler for this event when the widget is constructed:

~~~jscript
$(".jumpList").jumpList({
    ...
    selectionChanged: function (event, selectedItem) {
        console.log(selectedItem);
    }
});
~~~

It is impressive how selection can be implemented with just 5 lines of code, with the event created automatically.

## Animating the Category Buttons (Hello CSS3!)

The code that creates the category buttons is pretty similar to the code which creates the jump list buttons and items, so I will not reproduce it here. You can dig around in the code if you are interested.

The DOM elements created on initialization of the jump list result in the following structure:

~~~html
<div class="jumpList">
  <ul class="itemList">
    <li class="category">
        <a class="jumpButton" id="A">A</a>
        <li class="jumpListItem">Afufylug, Efotda</li>
    </li>
    <li class="category">
        <a class="jumpButton" id="B">B</a>
        <li class="jumpListItem">Bastajcyr, Laej</li>
        <li class="jumpListItem">Bexgamila, Ryjl</li>
    </li>
    ...
  </ul>

  <div class="categoryList" >
     <a class="categoryButton">A</a>
     <a class="categoryButton">B</a>
     <a class="categoryButton">C</a>
     <a class="categoryButton">D</a>
        ...
  </div>
</div>
~~~

The categoryList `div` is styled in CSS so that it overlays the `itemList` and is initially hidden.

The Windows Phone 7 version of the jump list has a funky reveal animation where each category button spins and scales into view.

![JumpListAnimation.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/JumpListAnimation.png)

Let’s see how easy it is to reproduce this using CSS / HTML / JavaScript …

The CSS3 specification adds support for transformation, allowing you to scale, rotate, and skew elements. This provides very similar functionality to Silverlight’s `RenderTransform`. We can define styles for the `categoryButton` states as follows:

~~~css
a.categoryButton
{
    opacity: 0;
    -webkit-transform: scale(0,0) rotate(-180deg);
}

a.categoryButton.show
{
    opacity: 1;
    -webkit-transform: scale(1.0, 1.0) rotate(0deg);
}
~~~

The initial state for a category button is transparent, with a scale of zero and rotated by -180 degrees. When the `show` class is added, the button becomes visible and is scaled / rotated to its original positions.

Applying the `show` class will change these properties instantly. In order to smoothly animate the rotation, scale, and opacity change, we can use the new CSS3 transition feature:

~~~css
a.categoryButton
{
    -webkit-transition-property: -webkit-transform , opacity;
    -webkit-transition-duration: 0.3s;
}
~~~

Finally, in order to fire the animations for each element in sequence, a little bit of code is required …

The following function iterates over the items in a jQuery list of elements, firing some action (i.e., function) on each element with a short delay in between. A boolean value is also passed to the function to indicate when the last element has been reached:

~~~jscript
// A function that invokes the given function for each of the elements in
// the passed jQuery node-set, with a small delay between each invocation
_fireAnimations: function ($elements, func) {
  var $lastElement = $elements.last();
  $elements.each(function (index) {
    var $element = $(this);
    setTimeout(function () {
      func($element, $lastElement.is($element));
    }, index * 20);
  });
},
~~~

We can use this function to animate the hiding of the category buttons as follows, where the ‘`show`’ class is removed from each element, which will cause a CSS3 transition back to the original state. When the last element is reached, the parent div is hidden removing the category list:

~~~jscript
// hide the category buttons
jumpList._fireAnimations(jumpList._$categoryList.children(),
          function ($element, isLast) {
  $element.removeClass('show');
  if (isLast) {
    jumpList._$categoryList.removeClass('visible');
  }
});
~~~

The net result is something which is surprisingly similar to my original Windows Phone 7 implementation:

![HTML5JumpListAnimation.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/HTML5JumpListAnimation.png)

The implementation of this effect is considerably simpler and more concise than the equivalent code I wrote for the Windows Phone 7 control. See the [‘category button tile animation’ section](http://www.codeproject.com/KB/windows-phone-7/WindowsPhone7JumpLIst.aspx#category) of the earlier article.

At this point, it is worth saying something about vendor specific CSS properties. Currently, because the CSS specification for transitions and transformations are not finalized, browsers which support them use a vendor specific prefix before each property name. Unfortunately, this means that if you want to use some of these more recent CSS features, you are faced with a lot of duplication. For example, I want to disable text selection within the jump list. This requires the following CSS in order to ensure cross platform support:

~~~css
.jumpList
{
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
}
~~~

These prefixes can be very frustrating and something of a maintenance issue. However, they are a necessary evil. Past experience has shown that allowing vendors to implement CSS features too early can cause massive problems, as Eric Meyer describes in his article [“Prefix or Posthack”](http://www.alistapart.com/articles/prefix-or-posthack/).

Because my main aim is to create a cross-platform jump list for mobile devices, I can happily restrict myself to just using the `-webkit` prefix, because iPhone, Android, and BlackBerry all use webkit powered browsers.

## Scrolling the List

The `for` loop that generates the category buttons uses the jQuery `data()` function to create a relationship between each category button and the jump button it corresponds to. A click handler is added to the `categoryList div` which contains each category button. Again, this follows patterns we have covered previously in this article. If you are interested in the details, view the associated source code.

The final task to make the jump list fully functional is to scroll the list to the correct location when the category button is clicked. This can be achieved using the jQuery `scrollTop` function. We simply add the jump button position to the current scroll location as follows:

~~~jscript
jumpList._$itemListContainer.scrollTop(
     $jumpButton.position().top + jumpList._$itemListContainer.scrollTop());
~~~

Again, implementing the scroll feature has proven very simple in comparison to the Silverlight jump list.

## Scrolling On a Mobile

With a fully functional jump list control, I decided it was time to test it on a mobile. Loading a page which contained a jump list widget on my Windows Phone 7, I was surprised to find that it performed pretty well. The version of IE WP7 currently uses does not support HTML5 / CSS3, however CSS degrades gracefully, so the control is still fully functional. Annoyingly, my HTML jump list scrolls quite smoothly … ahem (if you are not a WP7 dev and you want to know why this is annoying, check out [this blog post](http://blogs.msdn.com/b/slmperf/archive/2010/10/06/silverlight-for-windows-phone-7-listbox-scroll-performance.aspx), or just Google “[WP7 ListBox scroll performance](http://www.google.co.uk/search?sourceid=chrome&ie=UTF-8&q=WP7+ListBox+scroll+performance)”).

I then borrowed one of my friend’s Android phones, which is equipped with a webkit browser. And at this point, I immediately hit an issue. The jump list refused to scroll, no matter which way I swiped the screen. After much head-scratching, it turns out that this is a limitation of mobile webkit browsers, there is no way to scroll the contents of a block level element with an ‘overflow’ style. As you can imagine, this is a pretty big issue that has received [a lot of attention in various forums](http://code.google.com/p/android/issues/detail?id=2118).

So was all my work in vain? Fortunately, with this being a common issue for people developing HTML5 mobile applications, there are various solutions available on the internet. The first one I found, [iScroll](http://cubiq.org/iscroll) (so named because the iPhone also has a webkit browser so exhibits this same bug), did the trick. It took a bit of reworking of the JavaScript and jump list markup to use iScroll, but it did solve the problem.

The end result is something that very closely mimics the jump list I wrote in Silverlight, but with the added advantage that it runs on iPhone, iTouch, Android, BlackBerry, and somewhat ironically, with the upcoming Mango release (which adds HTML5 support), Windows Phone 7.

The control is very much in the metro style, so might look out of place on a mobile device other than a Windows Phone; however, it has been a useful vehicle for trying cross platform HTML mobile development.

## Conclusions

I had a lot of fun writing the HTML5 Jump List control, but this article is not just for fun (well, I suppose unless CodeProject starts paying authors, it primarily is!). It is clear that the headline-grabbing HTML5 is on the rise, and with it, CSS3 and of course JavaScript. I wanted to see how the HTML5 development experience compares to that of Silverlight, and to be perfectly honest ... I was surprised!

One of the things that really surprised me was my level of productivity with JavaScript. I am not new to this language, but I am certainly nowhere near as proficient with JavaScript (and the associated technologies) as I am with Silverlight. Yet I was able to create a roughly equivalent jump list control in a similar amount of time that the Silverlight one took.

This can be attributed to a number of things, the first, and perhaps the most obvious one is the concise nature of both JavaScript and CSS. Comparing the implementations side-by-side for effects like ‘spinning tile reveal’ shows that CSS3 is far more concise than Silverlight Storyboards. Also, CSS3 transitions do not force you to worry about types; you can transition colours and positions all in exactly the same way.

However, there was another less obvious reason why my productivity with JavaScript was relatively high. With Silverlight (or WPF, WinForms, etc...), when you create a new control by extending or modifying existing controls, you are very much at the mercy of the API that the existing framework controls expose. If you find yourself needing to do something that the original control author has decided is not important so has not exposed an API for, you are faced with a difficult technical challenge. For example, finding the items that are currently visible within a Silverlight ListBox control involves relatively deep knowledge of the workings of the Silverlight framework. The relationship between JavaScript and HTML feels quite different than the relationship between C# and XAML. Because JavaScript, HTML, and also CSS, exist as technologies in their own right, they are much more loosely coupled than C# and XAML. For this reason, nothing is ‘hidden’ and as a result it is easier to extend the existing behaviour.

(As an aside, I am aware that the Silverlight visual tree gives a DOM-like interface which you can navigate and modify at will. I wrote [LINQ-to-VisualTree](http://www.scottlogic.co.uk/blog/colin/2010/03/linq-to-visual-tree/) exactly for this purpose; however, it still doesn’t feel as loosely coupled as JavaScript / HTML.

While I was impressed with the productivity of JavaScript / HTML, it is worth noting that this has been from the perspective of someone writing a new control. I think my perspective might have been a little different if I put myself in the position of the control consumer. As an example, I found that adding an event to my JavaScript jump list involved very little code. This was made possible by the jQueryUI widget framework’s own mechanism for expressing events. As a result, the event is not immediately discoverable on the jump list widget. In contrast, it took a bit more effort to add an event to the Silverlight jump list; however, it uses a standard C# event, which is instantly discoverable on the public API and a well understood mechanism for signaling changes in selection. This is a single example of what is a much bigger difference between the two...

The Silverlight (and WPF, WinForms, etc...) framework provides a standard way of building controls, handling data, and creating templates; the net result is that all Silverlight applications follow a similar pattern. Because JavaScript is not a UI framework (although it can be used for this purpose), it lacks this standardisation. I would expect that integrating third party controls and libraries would involve more effort with JavaScript as each would differ in the patterns that they employ. Furthermore, there are numerous JavaScript frameworks to choose from, which could lead to API disparity if you need to mix and match them.

Personally, I think that developers who are used to the “Microsoft Stack” often struggle with JavaScript. The tool support for JavaScript, regardless of which IDE you choose, does not come close to that which you get for Silverlight. For experienced JavaScript developers, I don’t think this presents much of an obstacle, in the same way that experienced Silverlight developers often rely less on the IDE than novice developers. However, for people just starting out with JavaScript development, this is more of an issue. Especially when you consider the various pitfalls and gotchas of the language itself! If I were to make generalisations, I would expect that a team of Silverlight developers of an average skill level would be more productive and produce better quality code than an equivalent team of averagely skilled JavaScript developers.

My advice to anyone who is making the transition from C#, WPF, and Silverlight to JavaScript would be to avoid trying to map familiar C# concepts to JavaScript. If you try to map between the two, you will probably view JavaScript in a less than favourable light, getting hung up on problems like how to tackle object oriented programming and variable scope. I would instead recommend that you view JavaScript afresh, read Douglas Crockford's “The Good Parts”, and learn the “Bad Parts” and how to avoid them. Definitely use a tool like JSLint on your code; it is all too easy to write sloppy JavaScript. I would also avoid complex JavaScript frameworks that try to shape it into an Object Oriented language, one notable one being the Microsoft AJAX framework; because of the nature of JavaScript, they are slightly flimsy facades.

Because of the lack of structure imposed by the JavaScript language, I can see that building large, scalable, modular applications using multiple independent development teams could be a challenge. If you are embarking on such a development, I would urge you to look at Google’s [Closure Compiler](http://code.google.com/closure/compiler/), which uses JavaDoc style annotations which the compiler can use to check types and manage dependencies.

To wrap-up, I was pleasantly surprised with my experiences of JavaScript, HTML, and CSS3; yes, they still have cross-browser issues and numerous gotchas, and probably always will. However, once you navigate your way around these, they are a concise and powerful combination of technologies, and when it comes to reach (i.e., cross-browser, cross-platform, cross-OS), they hold the trump card!

I will definitely work with JavaScript more in the future, but I am not going to be abandoning Silverlight either; it is still a powerful and elegant framework. I am covering my bases, making sure that I am ready for whatever is around the corner...
