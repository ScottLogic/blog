---
title: Interactive.NET (2 - C#)
date: 2013-08-15 00:00:00 Z
categories:
- Tech
tags:
- blog
author: nwolverson
layout: default_post
source: site
summary: In the previous part of this series discussing running an interactive environment
  (REPL) on .NET I covered the non-C# options. This post explores the options for
  an interactive or lightweight C# environment.
oldlink: http://www.scottlogic.com/blog/2013/08/15/interactive-dotnet-2.html
disqus-id: "/2013/08/15/interactive-dotnet-2.html"
---

In the <a href="{{site.baseurl}}/2013/08/08/interactive-dotnet-1.html">previous post</a> 
I discussed various options for running an interactive environment (a REPL) 
on .NET, and there was one glaring omission - C# (and perhaps VB if that's your cup of tea). The
collected source of the examples in this post/series is 
[available here](https://github.com/nwolverson/blog-interactivenet).

C#
--

Sadly the C# environment shipped with Visual Studio 2012 does not come with an interactive environment. Here are
some solutions, and hopefully a glimpse of the future.

### Interactive window

Firstly there's the poor man's interactive window: the VS immediate window. I actually love this in debugging,
it seems like you can almost execute arbitrary C#. Outside of debugging, there's nothing to stop you firing
up your code with a breakpoint just to execute some exploratory code in the immediate window. I often find myself
doing this from a unit test when really I'd rather just have a REPL, but at least it's there!

![Immediate window screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/immediate-intellisense.png)

Unfortunately there are some limitations to the immediate window which if anything are becoming worse over time.

* Painful namespace handling. Namespaces are included as per the code context (I think), but for other namespaces
one has to write the qualified type names in full. I don't think there's a way to add usings to pull in more 
namespaces. This is particularly unfortunate when it comes to extension methods, which must then be used
in the full non-extension syntax with full namespace...

* Intellisense is available to a degree, but is not fully usable. I can't put my finger on the differences now,
but this seems "sometimes available" and somewhat flaky - e.g. completion of class names doesn't happen, but
after typing a dot things may or may not be fine.

* Inability to define classes or methods - okay, you don't often want to do this. But also:

* Inability to write delegates/lamdba expressions. This one is the killer, it's annoying to start with, but if
you use LINQ to any degree it's a nightmare. In particular I often find I have a collection result in the
immediate window and would love to perform some test or filter on it.

### Lightweight environments

The official C# compiler is a black box, but of course there's nothing to stop you running the C# compiler under the
hood of any tool. It's also possible to compile C# code via the CodeDom, which is a .NET interface to code generation,
but is basically a wrapper around running the C# compiler executable. Tools like 
[Snippet Compiler](http://www.sliver.com/dotnet/SnippetCompiler/) offer the chance to build C# code without creating a
project in Visual Studio. Jon Skeet's [Snippy](http://csharpindepth.com/Snippy.aspx), created to execute code snippets from
_C# in Depth_ in a more script-like format. However none of these tools provide a REPL environment.

### LinqPad

In many ways LinqPad is in the same category as the previous tools, of providing a place to write some C# (with syntax highlighting) which will be 
compiled and executed, and again it allows writing C# without a full class/method structure if desired for a
lighter-weight experience. Again there is no REPL. However LinqPad does provide is a great tool for exploring, in 
particular offering rich data dumps. This excels for LINQ-like collection data, but there is no requirement to
use LINQ, despite the name. It also supports F# or VB too, if you want to make use of the visualisation.

![LinqPad screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/linqpad.png)

It's worth mentioning a word on assembly references. Many of the examples above load references
as part of the script itself, and import namespaces. LinqPad can add references and namespaces
outside of your script via the properties dialog:

![LinqPad references screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/linqpad-references.PNG)

LinqPad follows a free/premium model, and statement completion is a premium feature, along with NuGet support.

Full example source is available to download for 
[C#](https://github.com/nwolverson/blog-interactivenet/blob/master/LinqPad/IntCsLinqPad.linq) and 
[F#](https://github.com/nwolverson/blog-interactivenet/blob/master/LinqPad/IntFsLinqPad.linq).

### Mono

Mono was ahead of the curve in bringing in a REPL for C#. 
[Miguel blogged about the csharp REPL](http://tirania.org/blog/archive/2008/Sep-08.html) back in 2008, and you can
read about it [here](http://www.mono-project.com/CsharpRepl). If you install the Mono package, a csharp executable
is available. On windows this will be available in your path automatically if you start a "Mono command prompt".
There's also a GUI version, gsharp, but I was unable to find a simple installation of this on Windows.

I actually expected that MonoDevelop/Xamarin Studio would have an interface over the csharp REPL - this is pretty
standard after all, to integrate with a "send to interactive" function - but this doesn't seem to exist as of now.

![Mono csharp window]({{ site.baseurl }}/nwolverson/assets/interactive.net/mono-csharp-window.png)

To get started with the previous example, we first import a namespace:

{% highlight csharp %}

LoadAssembly("System.Xml.Linq");

{% endhighlight %}

And add usings and continue as usual - unfortunately using statements must be separate from actual code, which seems to interfere with
pasting the start of a C# file.

The csharp REPL does not support the definition of methods or classes, so in this respect it is rather
limiting. Crucially it does support other C# features like lambdas and extension methods. So it is rather
simple to pretend we can define methods inline:

{% highlight csharp %}

Func<XElement, bool> HasValue = (d) =>
{
	var v = d.Element(wb + "value");
	return v != null && !v.IsEmpty;
};
Func<XElement, int> GetValue = (d) => int.Parse(d.Element(wb + "value").Value);
Func<XElement, string> GetCountry = d => d.Element(wb + "country").Value;

var data = doc.Root.DescendantsAndSelf(wb + "data").Where(HasValue);
var pops = data.Select(v => Tuple.Create(GetValue(v), GetCountry(v)));
var pops2 = from v in data
			select Tuple.Create(GetValue(v), GetCountry(v));
var res = pops.OrderByDescending(x => x).Take(5);

// Show output:
res.ToList()

{% endhighlight %}

One final thought is this is a REPL for the Mono compiler, if your intention is to interact with existing libraries
this could be an issue.

Full example source is available to download
[here](https://github.com/nwolverson/blog-interactivenet/blob/master/CSharp/MonoIntCs.cs).

### Roslyn

Roslyn is "the future" of C#, and it can't come soon enough (sadly it didn't make it for 2013, but
word is it will definitely be in the version after...). This is a complete reimplementation of the C#
and VB compilers in managed code. Not only that, but a rich API is being exposed for the various parts
of the compilation process, rather than the existing "black box" compiler, enabling things like editor
refactoring support to use the actual compiler code itself. This also enables a rich interactive window:

![C# interactive window screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/csharp-interactive.png)

#### The code

The C# code differs from a standard C# program in the reference syntax (similar to F# scripts),
and the inclusion of definitions at the top level (a more "script like" syntax). Otherwise as you would expect from the earlier examples:

{% highlight csharp %}

#r "System.Xml"
#r "System.Xml.Linq"
#r "System.Core"

using System;
using System.Net;
using System.IO;
using System.Linq;
using System.Xml.Linq;

XNamespace wb = XNamespace.Get("http://www.worldbank.org");

var uri = new Uri("http://api.worldbank.org/countries/indicators/EN.URB.LCTY?date=2009:2009&per_page=250");
var rawdata = new WebClient().DownloadString(uri);
var sr = new StringReader(rawdata);
var doc = XDocument.Load(sr);

bool HasValue(XElement d)
{
	var v = d.Element(wb + "value");
	return v != null && !v.IsEmpty;
}
int GetValue(XElement d)
{
	return int.Parse(d.Element(wb + "value").Value);
}
string GetCountry(XElement d)
{
	return d.Element(wb + "country").Value;
}

var data = doc.Root.DescendantsAndSelf(wb + "data").Where(HasValue);
var result = data.Select(v => Tuple.Create(GetValue(v), GetCountry(v)));
			     .OrderByDescending(x => x)
			     .Take(5);

{% endhighlight  %}

Contrasting with the Mono csharp REPL and the immediate window, here we can define classes freely, methods, any C# features 
we desire (well - not async yet).

The latest released version of Roslyn is the [September 2012 CTP](http://msdn.microsoft.com/en-us/vstudio/roslyn.aspx), 
usable with VS2012. This will not replace the C# compiler used to compile your actual projects, but will make itself available
via the interactive window and other preview functionality.

A VB interactive window is slated for future release, but currently not included in the CTP.

Full example source is available to download
[here](https://github.com/nwolverson/blog-interactivenet/blob/master/CSharp/IntCs.csx).

## Conclusion

You can download the full source for the examples above [from this repository](https://github.com/nwolverson/blog-interactivenet).

There are a number of different interactive environments available for the .NET platform, and which one you might
choose to use will depend a lot on your available tools and background. If you're a C# programmer with VS2012 installed I'd 
strongly recommend trying the Roslyn CTP. Unfortunately Roslyn won't be with us in full any time soon, in the mean time the
most solid REPL environment in my opinion is the F# one (it is an officially supported platform after all), or you can 
pick up IronPython if you're a Python fan. LinqPad may well be a useful download in its own right, and is quite a decent
platform for experimenting with C# snippets.

But roll on Roslyn!























