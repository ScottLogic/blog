---
author: nwolverson
title: Interactive.NET (1)
tags:
  - blog
categories:
  - Tech
layout: default_post
source: site
summary: >-
  In the first part of a series on running an interactive environment (REPL) on
  .NET, I talk a little about why you might want one, and cover the non-C#
  options.
oldlink: 'http://www.scottlogic.com/blog/2013/08/08/interactive-dotnet-1.html'
disqus-id: /2013/08/08/interactive-dotnet-1.html
---
If you ever programmed in a functional language, a dynamic language like Python
or Perl, or even BASIC, you'll likely be familiar with an interactive
programming interface - the Read Eval Print Loop. In this series of articles
I'm going to talk about options for running a REPL on .NET, and a little
about why you might want one.

I'll start with an overview of the non-C# options in this post, and finally get around to C#
<a href="{{site.baseurl}}/2013/08/15/interactive-dotnet-2.html">in part 2</a>. The
collected source of the examples in this post/series is
[available here](https://github.com/nwolverson/blog-interactivenet).

## Why bother?
Since LISP the REPL has been well-used in the functional programming world, and
similarly dynamic languages (less politely "scripting" languages) tend to
provide an interactive shell. On the other hand languages in the C family
historically tended to have a much more static view of the world. Sadly this
lack has been inherited by C# - so what alternatives are there in the .NET
world, and why would you want one?

1. *Interactive prototyping & development*

    I include this first because it may (or may not) be the most important use of an
interactive environment - but I'm not going to evangelise this here. You can
take this to different degrees, but the basic idea is that you will be executing
code in the REPL frequently during the development of your program - more
frequently than you would recompile and run an entire app. The code being run in
the REPL will tend to be a mix of updated definitions (e.g. new version of a
function) and interaction with existing entities (more like testing).

2. *API exploration*

    Sometimes you can learn a new API from the wonderful documentation, but all too
often it's inadequate, or you just want to roll your sleeves up and see what
it can do. An editor with good code completion gets you some of the way, but
there's no substitute for actually calling methods and inspecting data, and
an interactive environment streamlines this process no end.

3. *Data Visualisation*

    Similar but orthogonal to API exploration. There are custom data visualisation
tools, but when you have a bunch of data to fetch, process and explore, why not
do it from the comfort of your favourite programming environment? Take the data
processing tools in the .NET framework, a charting or mapping library and explore!

## The task

For the purpose of this overview, I'm going to set a task to accomplish via the various
options presented. This will consist of fetching some data via the WorldBank API and
extracting some information. The data is the indicator "EN.URB.LCTY", the population
in a country's largest city (for 2009), and we'll end up with a list of countries in
order of population (descending). There are no doubt many ways to do this (perhaps
"better" or "more native"), but in each case we'll use the standard .NET `WebClient`
to download the data in XML format, and then XML to LINQ to parse the data.

The various implementations of this will tend to take a very similar format. Firstly
we'll add references and import the appropriate namespaces, then we'll perform the
download and extract a list of nodes - as uses of the same .NET API, this will look
very similar in every case, a pure question of syntax. Lastly we'll perform some actual
list processing, and here the languages used can show their differences and native
concepts a bit more.

It's worth noting that I'm presenting examples of scripts as a whole, which may be
somewhat misleading as to the use of the REPL. In each case I executed these examples
line by line in the REPL, modifying and correcting as I went along, what you see in
code snippets here are the collected final results of this evolution.

## DLR - the iron languages

Microsoft implemented support for dynamic languages on .NET, via the
[Dynamic Language Runtime](https://en.wikipedia.org/wiki/Dynamic_Language_Runtime) (DLR).
There were 2 officially supported languages developed within
Microsoft, [IronPython](http://en.wikipedia.org/wiki/IronPython) and
[IronRuby](http://en.wikipedia.org/wiki/IronRuby); various other support was planned but shelved.
As of 2010 official support ceased and the projects were handed over to the open source community:
it now seems that IronPython is going strong but IronRuby is looking rather dead (but usable!).

### IronPython

[IronPython](http://ironpython.net/) comes out of the box with "IronPython Console",
the IronPython REPL in a console window:

![IronPython Console screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/ipy-interactive.png)

This comes with standard command history etc, and you could run it in a better (non default) console,
but to be frank it's a little painful. A better experience is in Visual Studio 2010 or 2012 with
[Python tools](http://pytools.codeplex.com/). This gives you standard IDE features, syntax highlighting,
and even better IntelliSense for both standard python libraries and .NET libraries.

![Python Tools intellisense screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/python-intellisense.png)

Then you have the IronPython interactive window where the code is executed, again supporting easy editing, "send to interactive",
syntax highlighting, IntelliSense (this time dynamically based on the actual objects rather than static analysis).

![IronPython interactive window screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/python-interactive.png)

#### The code

Firstly we use the IronPython specific `clr` module, adding the required assembly references
and in some cases importing the identifiers. Then the code looks rather familiar, to the C#
eye the only difference is a missing `new` when constructing the `WebClient`:

{% highlight python %}

import clr
clr.AddReference("System.Core");
clr.AddReference("System.Xml.Linq");
import System
from System.Net import *
from System.IO import *
from System.Linq import *
from System.Xml.Linq import *

uri = System.Uri("http://api.worldbank.org/countries/indicators/EN.URB.LCTY?date=2009:2009&per_page=250");
data = WebClient().DownloadString(uri);
sr = StringReader(data);
doc = XDocument.Load(sr);
wb = XNamespace.Get("http://www.worldbank.org");

{% endhighlight %}

We can then define some utilities to extract the bits we're interested from the XML.
The result of the `DescendantsAndSelf` method is an `IEnumerable`, this is exposed
as a python iterable, which we can use in a list comprehension to construct a list of value/country pairs.

{% highlight python %}

def hasValue(d):
    val = d.Element(wb+"value")
    return val != None and not val.IsEmpty
def getValue(d):
    return int(d.Element(wb+"value").Value)
def getCountry(d):
    return d.Element(wb+"country").Value

pops = [(getValue(n), getCountry(n))
        for n in doc.Root.DescendantsAndSelf(wb+"data")
        if hasValue(n)]
pops.sort(reverse=True)
pops[:5]

{% endhighlight %}

Then the result:

{% highlight python %}
>>> pops[:5]
[(36506588, 'Japan'), (21719706, 'India'), (19960132, 'Brazil'), (19318531, 'Mexico'), (19299681, 'United States')]
>>>
{% endhighlight %}

[Source here](https://github.com/nwolverson/blog-interactivenet/blob/master/Python/IntPy.py).

### IronRuby

As of 2013 IronRuby isn't looking in the best of states. It's open sourced, with some ongoing development, and
should be considered "fully working"; but there still is no support in
[IronRuby Tools](http://www.ironruby.net/tools/) for VS2012. I like Ruby as a language but you would seem to need a
strong reason to rely on IronRuby. Saying that, if you know Ruby and want to play in .NET, why not?

## PowerShell

Some of you may be surprised at this entry. However PowerShell is not only an interactive environment
(by virtue of being a shell!), but also a full .NET citizen. One can natively create .NET objects
(via the `New-Object` cmdlet) and call their methods, though the syntax may be a little strange
at first. The other key point about PowerShell is that its command pipeline is not text-based
as per traditional shells, but consists of fully structured objects, meaning it really isn't
(too) painful to pass these objects around and manipulate them.

Powershell runs in the console as standard:

![PowerShell console screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/powershell-console.png)

However a richer environment is found in the PowerShell ISE.

![PowerShell ISE screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/powershell-ise.png)

The great thing is that now PowerShell comes with Windows as standard.

#### The code

More assemblies are referenced by default, but here we sadly don't have the benefit of
abbreviating namespaces:

{% highlight powershell %}

Add-Type -AssemblyName  System.Xml.Linq

$wb = [System.Xml.Linq.XNamespace]::Get("http://www.worldbank.org")

$uri = New-Object uri "http://api.worldbank.org/countries/indicators/EN.URB.LCTY?date=2009:2009&per_page=250"
$rawdata = (New-Object System.Net.WebClient).DownloadString($uri);
$sr = New-Object System.IO.StringReader($rawdata);
$doc = [System.Xml.Linq.XDocument]::Load($sr);

{% endhighlight %}

We can then pass the enumerable results of `DescendantsAndSelf` through the PowerShell pipeline,
filtering with `Where-Object`, iterating with `ForEach-Object`, selecting
with `Select-Object`. I use the full names here, symbols `?`, `%` and aliases may be easier to type
in practise.

{% highlight powershell %}

function hasValue ([System.Xml.Linq.XElement] $d) {
    $v = $d.Element($wb + "value");
    $v -ne $null -and -not $v.IsEmpty;
}
function getValue ([System.Xml.Linq.XElement] $d) {
    [int] $d.Element($wb + "value").Value;
}
function getCountry ([System.Xml.Linq.XElement] $d) {
    $d.Element($wb + "country").Value;
}

$data = $doc.Root.DescendantsAndSelf($wb + "data") |
	Where-Object { hasValue $_ };

$pops = $data | ForEach-Object { New-Object -TypeName PSObject `
    -Property @{Country=getCountry $_;Population=getValue $_} }

$sorted = $pops | Sort-Object -Property Population -Descending
$sorted | Select-Object -First 5 | Write-Output

{% endhighlight %}

Here we chose to construct an object with named properties with `New-Object`. We could
have just used a tuple, but this gave us the ability to sort nicely, and to output the
structured object in a readable fashion.

{% highlight console %}

PS> .\IntPS.ps1

Country                                                              Population
-------                                                              ----------
Japan                                                                  36506588
India                                                                  21719706
Brazil                                                                 19960132
Mexico                                                                 19318531
United States                                                          19299681

{% endhighlight %}

[Source here](https://github.com/nwolverson/blog-interactivenet/blob/master/PowerShell/IntPS.ps1).

---
F#
--

F# is unique on this list, for now, in being a first-class .NET citizen with full support from MS, and having a
proper REPL in its official incarnation. F# is a powerful language in its own right (which you could class
as hybrid functional/OO), and fully integrates with .NET. Perhaps it might take some getting used to
for a C# or VB programmer, but I'd argue that it's worth it (but then I am a fan).

F# enjoys Visual Studio support in the interactive environment. It's slightly unfortunate that syntax highlighting and
IntelliSense are not permitted in the interactive window, the appropriate methodology being to edit a F# script
file or program and send snippets to the interactive window (alt-enter and alt-#).

![F# intellisense screenshot]({{ site.baseurl }}/nwolverson/assets/interactive.net/fsharp-intellisense.png)

#### The code

Again we reference the required DLLs and open namespaces:

{% highlight fsharp %}

#r "System.Core"
#r "System.Xml.Linq"

open System
open System.Net
open System.IO
open System.Linq
open System.Xml.Linq

let uri = System.Uri("http://api.worldbank.org/countries/indicators/EN.URB.LCTY?date=2009:2009&per_page=250");
let rawdata = (new WebClient()).DownloadString(uri)
let sr = new StringReader(rawdata)
let doc = XDocument.Load(sr)
let wb = XNamespace.Get("http://www.worldbank.org");

{% endhighlight %}

In the remaining implementation we see a list comprehension, similar to the python case, and also
some pipelining, typical of F# code:

{% highlight fsharp %}

let hasValue (d: XElement) =
    match d.Element(wb + "value") with
    | null -> false
    | v -> not v.IsEmpty

let getValue (d: XElement) =
    d.Element(wb + "value").Value |> int
let getCountry (d: XElement) =
    d.Element(wb + "country").Value

let data = doc.Root.DescendantsAndSelf(wb + "data") |> Seq.where hasValue
let pops = [ for v in data -> getValue(v), getCountry(v) ]
let sorted = pops |> List.sort |> List.rev

{% endhighlight %}

The result:

{% highlight fsharp %}

> sorted |> Seq.take(5) ;;

val it : seq<int * string> =
  seq
    [(36506588, "Japan"); (21719706, "India"); (19960132, "Brazil");
     (19318531, "Mexico"); ...]

{% endhighlight %}

[Source here](https://github.com/nwolverson/blog-interactivenet/blob/master/FSharp/IntFs.fsx).

#### Type providers

The big feature in the last edition of F# was type providers. These are basically just a fancy form of
code generation, but the trick here is the Visual Studio integration. A type provider is defined for
a particular resource and at edit time VS is able to provide IntelliSense for the generated types.

It so happens that one type provider that's been included from the start and is now included in
[FSharp.Data](http://fsharp.github.io/FSharp.Data/) is a World Bank provider. The DLL is referenced
(either in a project or interactive session):

{% highlight fsharp %}

#r """..\packages\FSharp.Data.1.1.5\lib\net40\FSharp.Data.dll"""
open FSharp.Data

let data = WorldBankData.GetDataContext()

{% endhighlight %}

Then while in the editor, the type provider will enable intellisense based on actual data fetched
from the WorldBank API:

![FSharp TypeProvider IntelliSense]({{ site.baseurl }}/nwolverson/assets/interactive.net/fsharp-worldbankprovider-intellisense.png)

You can see here that properties are generated automatically based on the data.

Unfortunately the WorldBank type provider doesn't quite fit the bill of accomplishing the task set above
- the ability to fetch all-countries data for a particular year isn't exposed in this case. We could
of course add this functionality for the benefit of programmer-kind, but in this instance we'll make
use of another type provider instead. The XmlProvider from [FSharp.Data](http://fsharp.github.io/FSharp.Data/) generates a strongly typed
view of XML based on a sample document.

Firstly the type provider creates a type based on the name of the input file:

{% highlight fsharp %}

type XmlProvider = FSharp.Data.XmlProvider<"EN.URB.LCTY.xml">

{% endhighlight %}

Then we can use this to parse the data (note XmlProvider here is a typedef of a type created
by the type provider):

{% highlight fsharp %}

let xmlData = XmlProvider.Parse(rawdata);
let data = xmlData.GetDatas() |> Seq.where(fun v -> v.Value.IsSome)

{% endhighlight %}

Then the data itself is typed with properties according to the XML:

![FSharp XMl provider IntelliSense]({{ site.baseurl }}/nwolverson/assets/interactive.net/fsharp-xml-provider-intellisense.png)

The complete code is as follows:

{% highlight fsharp %}

#r """..\packages\FSharp.Data.1.1.5\lib\net40\FSharp.Data.dll"""
#r "System.Core"
#r "System.Xml.Linq"

type xmlProvider = FSharp.Data.XmlProvider<"EN.URB.LCTY.xml">

open System
open System.Net

let uri = System.Uri("http://api.worldbank.org/countries/indicators/EN.URB.LCTY?date=2009:2009&per_page=250")
let rawdata = (new WebClient()).DownloadString(uri)
let xmlData = xmlProvider.Parse(rawdata);

// Unfortunate pluralisation
let data = xmlData.GetDatas() |> Seq.where(fun v -> v.Value.IsSome)
let pops = [ for v in data -> v.Value.Value, v.Country.Value ]
let sorted = pops |> List.sort |> List.rev
sorted |> Seq.take 5

{% endhighlight %}

[Source here](https://github.com/nwolverson/blog-interactivenet/blob/master/FSharp/XmlTypeProvider.fsx).

## The rest

Various other .NET languages [exist](http://en.wikipedia.org/wiki/Microsoft_.NET_Languages), e.g.
C++/CLI, [Boo](http://boo-lang.org/), various
[Lisp](http://en.wikipedia.org/wiki/IronLisp)/[Scheme](http://en.wikipedia.org/wiki/IronScheme),
JavaScript implementations - some of which may or may not have interactive environments, but this web page is only so long, so you're on your own.

As for C#, that shall be the subject of my next post, where I'll cover various options, both "Open Source" and "Official".

You can download the full source for the examples above [from this repository](https://github.com/nwolverson/blog-interactivenet).
