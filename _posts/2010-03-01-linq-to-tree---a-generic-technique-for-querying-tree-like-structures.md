---
title: LINQ to Tree - A Generic Technique for Querying Tree-like Structures
date: 2010-03-01 00:00:00 Z
categories:
- Tech
tags:
- linq
author: ceberhardt
layout: default_post
source: codeproject
summary: Presents a generic technique for applying LINQ to any tree-like data structure, inspired by LINQ to XML, using a simple adapter to expose parent/child/sibling axes as queryable sequences. Demonstrated with examples including LINQ to WPF VisualTree, LINQ to WinForms, and LINQ to Filesystem.
---

*This article was originally published on CodeProject, which has since shut down.*

## Overview

This article looks at how LINQ can be applied to tree-like data, using LINQ to XML as an example. A generic approach to querying trees is constructed, which allows any tree structure to be made LINQ 'compatible' with the implementation of a simple adapter class. This idea is extended further with T4 templates for code generation, with examples of LINQ to VisualTree (WPF / Silverlight), LINQ to WinForms, and LINQ to Filesystem presented.

![tree.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/tree.jpg)

## Introduction

One of my favorite features of the C# programming language is LINQ. As a programmer, so much of what we do is write code to filter, manipulate, and transform data. LINQ brings with it a whole host of functionality that allows you to perform these tasks using a much more expressive and succinct language. It has clearly played a big part in the development of the language itself, bringing with it Extension Methods, yield, and Lambda Expressions.

When I started learning WPF, I thought it might be useful to apply LINQ to the visual tree in order to query the state of the user interface (UI). For those of you not familiar with WPF, the visual tree is the hierarchical structure of elements, borders, grids, etc... that are used to build the UI. These are typically defined in XAML, i.e., XML, which is itself a hierarchical structure. The problem is, LINQ depends on the `IEnumerable` interface, which is used to define a 1-dimensional array of items. How can this be used to query a hierarchical structure like the WPF visual tree?

After a quick Google search, I stumbled upon Peter McGrattan's [LINQ to Visual Tree implementation](http://petermcg.wordpress.com/2009/03/04/linq-to-visual-tree-beta/), which simply flattens the tree into a 1-dimensional structure. Elsewhere, I also found a more generic implementation by David Jade which can be used to [flatten any tree in order to apply LINQ queries](http://mutable.net/blog/archive/2008/05/23/using-linq-to-objects-for-recursion.aspx). However, in flattening the tree, you are losing useful information that might be relevant to your query. Neither were they the solution I was looking for!

Anyhow, I forgot about this problem for a while until more recently when I started a new project where we were working with a lot of data in XML, and naturally, we turned to LINQ to XML...

## An Introduction to LINQ to XML

*This section gives a very brief introduction to the LINQ to XML API and its relationship to XPath. If you are already a LINQ to XML guru, feel free to skip it and get onto the juicy bits!*

The LINQ to XML API provides methods for querying XML documents which are loaded into memory in the form of an `XDocument` (or X-Dom for short). The in-memory XML document consists of a tree-like structure of nodes. At each node, there are LINQ methods available for searching the tree in order to find children, siblings, or nodes with some other relationship to the current node (context) that matches the various criteria.

A simple example, which queries the following example XML, is given below, based on the following XML instance document:

![xml.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/xml.png)

The following query will find all 'product' elements with a colour child element with a value 'Red':

![linq.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/linq.png)

The nodes matched by each part of the query are highlighted in the XML document above.

The first part of the query starts at the root of the document, invoking the `XDocument.Descendants` method to find any elements with the name *order* which are descendants (direct or otherwise) within the tree.

The second part of the query matches all the *product* descendants of *order* elements; however, this is where things start to get interesting. Whilst the first `Descendants` method in the above query is defined on `XDocument`, the second `Descendants` method that follows it is not. This method is defined on `IEnumerable<XElement>`, and is the result of invoking the `Elements` method on each of the `XElement`s within the collection returned by the preceding Descendant query.

LINQ to XML defines a corresponding ['IEnumerable' extension method](http://msdn.microsoft.com/en-us/library/system.xml.linq.extensions_methods.aspx) for each of the regular query methods on a single `XElement` (or `XDocument`). It is these methods that give LINQ to XML its real power, allowing the queries to 'spider' throughout the document.

The final part of the query filters the *product* elements. It finds the colour elements, which is a direct descendant, finding those with a value of Red.

The LINQ to XML API is powerful and expressive, but how were these query methods, that match sibling, ancestor, descendant elements selected? For this, the LINQ to XML developers borrowed from an existing technology for querying XML, that of XPath. The equivalent XPath query to the one given above in LINQ is:

~~~
//order//product[colour='Red']
~~~

XPath allows you to create a query by assembling a number of expressions and predicates, each one acting on the node-set which is the result of applying the preceding expressions. This is analogous to the LINQ to XML execution described above.

With XPath, at a specific node in the XML document, you have the option to query a number of different 'axes', each one defining a set of nodes relating to the current context node. This allows you to define queries that traverse the document in a number of different directions. The axes that are common to both LINQ and XPath are summarised below:

| LINQ to XML | XPath | Illustration |
| --- | --- | --- |
| Descendants | descendant (//) | ![image001.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/image001.png) |
| Ancestors | ancestor | ![image002.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/image002.png) |
| Elements | child (/) | ![image003.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/image003.png) |
| ElementsBeforeSelf | preceding-sibling | ![image004.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/image004.png) |
| ElementsAfterSelf | following-sibling | ![image005.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/image005.png) |

**Note**: In the above diagrams, the code highlighted in red is the current context. The nodes highlighted in green are the ones that are members of the given axis. Also, XPath has a corresponding 'or-self' axis for each of those given above, which includes the context node; these are also present in LINQ to XML as 'AndSelf' methods.

## A Generic LINQ to Tree Implementation

LINQ to XML borrows the axes defined by XPath for querying the XML tree. Why not use these same axes for querying other tree-like structures?

The problem is, there is no common interface for defining a tree structure; for example, the WPF visual tree and filesystem APIs have very different interfaces. A common solution to this problem is to apply the Gang of Four [Adapter Pattern](http://en.wikipedia.org/wiki/Adapter_pattern), where you define the interface that you really want, then 'adapt' the existing classes so that they implement this interface, typically by 'wrapping' them in another class.

In order to traverse a tree structure, at each node, all you need are methods to navigate to the parent or children. The following generic interface provides methods for traversing a tree of objects of type '`T`':

~~~csharp
/// <summary>
/// Defines an adapter that must be implemented in order to use the LinqToTree
/// extension methods
/// </summary>
/// <typeparam name="T"></typeparam>
public interface ILinqToTree<T>
{
    /// <summary>
    /// Obtains all the children of the Item.
    /// </summary>
    /// <returns></returns>
    IEnumerable<ILinqToTree<T>> Children();

    /// <summary>
    /// The parent of the Item.
    /// </summary>
    ILinqToTree<T> Parent { get; }

    /// <summary>
    /// The item being adapted.
    /// </summary>
    T Item { get; }
}
~~~

This interface then allows us to create extension methods for navigating the different axes for a specific node of type '`T`'.

~~~csharp
/// <summary>
/// Returns a collection of descendant elements.
/// </summary>
public static IEnumerable<ILinqToTree<T>>
       Descendants<T>(this ILinqToTree<T> adapter)
{
    foreach (var child in adapter.Children())
    {
        yield return child;

        foreach (var grandChild in child.Descendants())
        {
            yield return grandChild;
        }
    }
}

/// <summary>
/// Returns a collection of ancestor elements.
/// </summary>
public static IEnumerable<ILinqToTree<T>>
       Ancestors<T>(this ILinqToTree<T> adapter)
{
    var parent = adapter.Parent;
    while (parent != null)
    {
        yield return parent;
        parent = parent.Parent;
    }
}

/// <summary>
/// Returns a collection of child elements.
/// </summary>
public static IEnumerable<ILinqToTree<T>>
       Elements<T>(this ILinqToTree<T> adapter)
{
    foreach (var child in adapter.Children())
    {
        yield return child;
    }
}
~~~

(I have omitted the 'AndSelf' implementations; these are quite trivial; if you are interested, download the sample code for this article.)

However, as we saw in the LINQ to XML section above, these methods allow us to navigate from one node to the nodes within its related axes; however, it is the `IEnumerable` extension methods that provide the real power of LINQ to XML, allowing your query to 'spider' throughout the document.

The `IEnumerable` equivalents of the above axes methods are given below:

~~~csharp
/// <summary>
/// Applies the given function to each of the items in the supplied
/// IEnumerable.
/// </summary>
private static IEnumerable<ILinqToTree<T>>
        DrillDown<T>(this IEnumerable<ILinqToTree<T>> items,
        Func<ILinqToTree<T>, IEnumerable<ILinqToTree<T>>> function)
{
    foreach (var item in items)
    {
        foreach (ILinqToTree<T> itemChild in function(item))
        {
            yield return itemChild;
        }
    }
}

/// <summary>
/// Returns a collection of descendant elements.
/// </summary>
public static IEnumerable<ILinqToTree<T>>
       Descendants<T>(this IEnumerable<ILinqToTree<T>> items)
{
    return items.DrillDown(i => i.Descendants());
}

/// <summary>
/// Returns a collection of ancestor elements.
/// </summary>
public static IEnumerable<ILinqToTree<T>>
       Ancestors<T>(this IEnumerable<ILinqToTree<T>> items)
{
    return items.DrillDown(i => i.Ancestors());
}

/// <summary>
/// Returns a collection of child elements.
/// </summary>
public static IEnumerable<ILinqToTree<T>>
       Elements<T>(this IEnumerable<ILinqToTree<T>> items)
{
    return items.DrillDown(i => i.Elements());
}
~~~

(Again, 'AndSelf' implementations have been omitted.)

In the above code, you can clearly see the relationship between the methods that act on a single node and their `IEnumerable` equivalent which performs the same function on a collection of elements. In the above code, they are all implemented via the private `DrillDown` method, which applies a given function to each of the items within a collection, yielding the results.

An implementation of the `ILinqToTree` interface can be created to wrap any tree structure, allowing it to be queried using this API. To see how the `ILinqToTree` interface is used in practice, we will create an adapter that allows us to query the WPF visual tree:

~~~csharp
/// <summary>
/// An adapter for DependencyObject which implements ILinqToTree in
/// order to allow Linq queries on the visual tree
/// </summary>
public class VisualTreeAdapter : ILinqToTree<DependencyObject>
{
    private DependencyObject _item;

    public VisualTreeAdapter(DependencyObject item)
    {
        _item = item;
    }

    public IEnumerable<ILinqToTree<DependencyObject>> Children()
    {
        int childrenCount = VisualTreeHelper.GetChildrenCount(_item);
        for (int i = 0; i < childrenCount; i++)
        {
            yield return new VisualTreeAdapter(VisualTreeHelper.GetChild(_item, i));
        }
    }

    public ILinqToTree<DependencyObject> Parent
    {
        get
        {
            return new VisualTreeAdapter(VisualTreeHelper.GetParent(_item));
        }
    }

    public DependencyObject Item
    {
        get
        {
            return _item;
        }
    }
}
~~~

The visual tree is composed of `DependencyObject` instances, and their relationships can be determined from the `VisualTreeHelper`. With the above adapter, we can now apply LINQ queries to our visual tree. The following is a simple example, where a `Window` with the following XAML markup is queried:

~~~xml
<Window x:Class="LinqToTreeWPF.Window1"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    Title="Window1" Height="300"
    Width="300" ContentRendered="Window_ContentRendered">

    <Grid x:Name="GridOne" Background="White">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>

        <TextBox x:Name="TextBoxOne"
          Text="One" Grid.Row="0" />

        <StackPanel x:Name="StackPanelOne" Grid.Row="1">
            <TextBox x:Name="TextBoxTwo" Text="Two" />

            <Grid x:Name="GridTwo">
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto" />
                    <RowDefinition Height="Auto" />
                </Grid.RowDefinitions>

                <TextBox x:Name="TextBoxThree"
                   Text="Three" Grid.Row="0" />

                <StackPanel x:Name="StackPanelTwo" Grid.Row="1">
                    <TextBox x:Name="TextBoxFour" Text="Four"/>
                    <RadioButton>Radio</RadioButton>
                </StackPanel>
            </Grid>

            <ListBox>
                <ListBoxItem>Foo</ListBoxItem>
                <ListBoxItem>Bar</ListBoxItem>
            </ListBox>
        </StackPanel>
    </Grid>
</Window>
~~~

The following examples demonstrate a few queries executed against the visual tree. Each example is given in both LINQ query syntax and extension method (or fluent) syntax:

~~~csharp
// get all the TextBox's which have a Grid as direct parent
var itemsFluent = new VisualTreeAdapter(this).Descendants()
                                             .Where(i => i.Parent is Grid)
                                             .Where(i => i.Item is TextBox)
                                             .Select(i => i.Item);

var itemsQuery = from v in new VisualTreeAdapter(this).Descendants()
                 where v.Parent is Grid && v.Item is TextBox
                 select v.Item;

// get all the StackPanels that are within another StackPanel visual tree
var items2Fluent = new VisualTreeAdapter(this).Descendants()
                                              .Where(i => i.Item is StackPanel)
                                              .Descendants()
                                              .Where(i => i.Item is StackPanel)
                                              .Select(i => i.Item);

var items2Query = from i in
                      (from v in new VisualTreeAdapter(this).Descendants()
                       where v.Item is StackPanel
                       select v).Descendants()
                  where i.Item is StackPanel
                  select i.Item;
~~~

Each of these queries follows a similar pattern. First, the root of the visual tree is wrapped in the `VisualTreeAdapter` (which implements `ILinqToTree`); this is followed by the query itself; finally, a `Select` clause is used to unwrap each of the items that satisfies our query criteria.

In my opinion, queries against tree structures are most often more readable in fluent / extension method syntax, the sub-selects required in query syntax are needlessly verbose. However, there are a few times when query syntax, or a mixture, provides the most readable query, as we will see later.

Whilst this mechanism works quite well, there are a few not-so-nice features. Firstly, the addition of our adapter means that we are continually wrapping and un-wrapping the nodes of our tree. A second issue is a little more subtle. It would be nice to add extension methods for the common tasks of filtering an axis by type; for example, allowing us to find the descendants of type '`TextBox`'. The following should fit the bill:

~~~csharp
/// <summary>
/// Returns a collection of descendant elements.
/// </summary>
public static IEnumerable<ILinqToTree<T>>
       Descendants<T, K>(this ILinqToTree<T> adapter)
{
    return adapter.Descendants().Where(i => i.Item is K);
}
~~~

The above method does indeed produce the desired outcome, filtering the descendant nodes for those with a type given by `K`. However, while the existing method has a single type parameter that can be inferred by the compiler, the method above has two type parameters, and inference no longer takes place. This means that we not only have to specify the type we are searching for, but also the type being queried, as illustrated below:

~~~csharp
// find all descendant text boxes
var textBoxes = new VisualTreeAdapter(this).Descendants<DependencyObject, TextBox>();
~~~

If anyone can suggest an extension method that does not have this problem, I would love to know! Please leave a comment below...

## Code Generation of LINQ to Tree APIs

In order to remove the need to wrap / unwrap the nodes of our tree, the extension methods need to be defined on the node type itself. The problem is, if we define extension methods on our specific node type, this means that the LINQ to Tree API has to be manually constructed for each node / tree type. The solution I found to this problem was to 'internalise' the use of the adapter, generating the LINQ to Tree extension methods via T4 templates.

T4 templates are built in to Visual Studio, and provide a mechanism for generating code files via C# and a simple template markup. For an introduction to authoring T4 templates, [try this article on CodeProject](http://www.codeproject.com/KB/WPF/DependencyPropertyCodeGen.aspx). The solution works as follows: there is a single T4 template file that contains our simplified `ILinqToTree` interface (there is no need for the `Item` property required for unwrapping, or the factory method), and the LINQ to Tree extension methods, plus their `IEnumerable` equivalents. This code is within a T4 template method that takes parameters which detail the type which the API is being generated for (e.g., `DependencyObject`, `DirectoryInfo`) and the class which implements the `IlinqToTree` interface for this type.

Here is the template (**Note**: I have only included the descendants axis in this code snippet; the other axes and their 'AndSelf' counterparts are all in the code associated with this article):

~~~csharp
<#@ template language="C#" #>

using System.Linq;
using System.Collections.Generic;
using System;

<#+

private void GenerateLinqMethods(string typeName,
        string adapterType, string targetNamespace)
{
#>
namespace <#=targetNamespace#>
{
    /// <summary>
    /// Defines an interface that must be implemented
    /// to generate the LinqToTree methods
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface ILinqTree<T>
    {
        IEnumerable<T> Children();

        T Parent { get; }
    }

    public static class TreeExtensions
    {
        /// <summary>
        /// Returns a collection of descendant elements.
        /// </summary>
        public static IEnumerable<<#=typeName#>>
               Descendants(this <#=typeName#> item)
        {
            ILinqTree<<#=typeName#>> adapter =
                        new <#=adapterType#>(item);
            foreach (var child in adapter.Children())
            {
                yield return child;

                foreach (var grandChild in child.Descendants())
                {
                    yield return grandChild;
                }
            }
        }

        /// <summary>
        /// Returns a collection of descendant elements which match the given type.
        /// </summary>
        public static IEnumerable<<#=typeName#>>
               Descendants<T>(this <#=typeName#> item)
        {
            return item.Descendants().Where(i => i is T).Cast<<#=typeName#>>();
        }
    }

    public static class EnumerableTreeExtensions
    {
        /// <summary>
        /// Applies the given function to each of the items in the supplied
        /// IEnumerable.
        /// </summary>
        private static IEnumerable<<#=typeName#>>
            DrillDown(this IEnumerable<<#=typeName#>> items,
            Func<<#=typeName#>, IEnumerable<<#=typeName#>>> function)
        {
            foreach(var item in items)
            {
                foreach(var itemChild in function(item))
                {
                    yield return itemChild;
                }
            }
        }

        /// <summary>
        /// Applies the given function to each of the items in the supplied
        /// IEnumerable, which match the given type.
        /// </summary>
        public static IEnumerable<<#=typeName#>>
            DrillDown<T>(this IEnumerable<<#=typeName#>> items,
            Func<<#=typeName#>, IEnumerable<<#=typeName#>>> function)
            where T : <#=typeName#>
        {
            foreach(var item in items)
            {
                foreach(var itemChild in function(item))
                {
                    if (itemChild is T)
                    {
                        yield return (T)itemChild;
                    }
                }
            }
        }

        /// <summary>
        /// Returns a collection of descendant elements.
        /// </summary>
        public static IEnumerable<<#=typeName#>>
               Descendants(this IEnumerable<<#=typeName#>> items)
        {
            return items.DrillDown(i => i.Descendants());
        }

        /// <summary>
        /// Returns a collection of descendant elements which match the given type.
        /// </summary>
        public static IEnumerable<<#=typeName#>>
               Descendants<T>(this IEnumerable<<#=typeName#>> items)
            where T : <#=typeName#>
        {
            return items.DrillDown<T>(i => i.Descendants());
        }

    }
}<#+
}
#>
~~~

The code within the template is very similar to that given in the previous sections. The main difference being that the use of the `ILinqToTree` adapter is now scoped within each extension method so that the LINQ to Tree API operates directly on the type itself. This removes the need for the generic type parameters on the 'regular' methods, allowing us to use a single type parameter for searching the collection for a specific type.

### LINQ to VisualTree

In order to generate a LINQ to Visual Tree API, we first create an `ILinqTree` implementation:

~~~csharp
/// <summary>
/// Adapts a DependencyObject to provide methods required for generate
/// a Linq To Tree API
/// </summary>
public class VisualTreeAdapter : ILinqTree<DependencyObject>
{
    private DependencyObject _item;

    public VisualTreeAdapter(DependencyObject item)
    {
        _item = item;
    }

    public IEnumerable<DependencyObject> Children()
    {
        int childrenCount = VisualTreeHelper.GetChildrenCount(_item);
        for (int i = 0; i < childrenCount; i++)
        {
            yield return VisualTreeHelper.GetChild(_item, i);
        }
    }

    public DependencyObject Parent
    {
        get
        {
            return VisualTreeHelper.GetParent(_item);
        }
    }
}
~~~

Then, execute the T4 template using the required types:

~~~csharp
<#@ template language="C#v3.5" #>
<#@ include file="..\LinqToTreeCodeGen.tt" #>
<#
string typeName = "System.Windows.DependencyObject";
string adapterType = "LinqToVisualTree.VisualTreeAdapter";
string targetNamespace = "LinqToVisualTree";
GenerateLinqMethods(typeName, adapterType, targetNamespace);

#>
~~~

From these few lines of code, the T4 template generates a ~400 line API that allows you to query the tree making use of all the XPath axes described earlier. For example, the generated `Descendants` method looks like this:

~~~csharp
/// <summary>
/// Returns a collection of descendant elements.
/// </summary>
public static IEnumerable<DependencyObject> Descendants(this DependencyObject item)
{
    ILinqTree<DependencyObject> adapter = new VisualTreeAdapter(item);
    foreach (var child in adapter.Children())
    {
        yield return child;

        foreach (var grandChild in child.Descendants())
        {
            yield return grandChild;
        }
    }
}
~~~

I am not going to reproduce the whole LINQ to Visual tree API in this article, the code itself is really not that interesting! (You can find the full API in the code attached to this article.) What is more interesting is that fact that we now have a generic LINQ API for tree structures that can be tailored for generating the API for a specific tree type in just a few lines of code. Before we explore its application to some other tree-like structures, let's revisit the queries that we applied earlier to the visual tree. With the new API, the queries are much more succinct:

~~~csharp
// get all the TextBox's which have a Grid as direct parent
var itemsFluent = this.Descendants<TextBox>()
                      .Where(i => i.Ancestors().FirstOrDefault() is Grid);

var itemsQuery = from v in this.Descendants<TextBox>()
                 where v.Ancestors().FirstOrDefault() is Grid
                 select v;

// get all the StackPanels that are within another StackPanel visual tree
var items2Fluent = this.Descendants<StackPanel>()
                       .Descendants<StackPanel>();

var items2Query = from i in
                     (from v in this.Descendants<StackPanel>()
                      select v).Descendants<StackPanel>()
                  select i;
~~~

### LINQ to Windows Forms

Another commonly encountered tree structure is the hierarchical control structure within Windows Forms applications. This structure is not always that obvious to WinForms developers because it does not have the same significance that the visual tree structure has in WPF / Silverlight, where property inheritance is supported by the tree structure. However, you can see that the UI is indeed a tree, by switching on the Document Outline view:

![DocumentView.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/DocumentView.png)

Creating our LINQ to Windows Forms API is again simply a matter of creating our `ILinqToTree` adapter for a `Control`:

~~~csharp
/// <summary>
/// Adapts a Control to provide methods required for generate
/// a Linq To Tree API
/// </summary>
class WindowsFormsTreeAdapter : ILinqTree<control />
{
    private Control _item;

    public WindowsFormsTreeAdapter(Control item)
    {
        _item = item;
    }

    public IEnumerable<control /> Children()
    {
        foreach (var item in _item.Controls)
        {
            yield return (Control)item;
        }
    }

    public Control Parent
    {
        get
        {
            return _item.Parent;
        }
    }
}
~~~

And, creating our T4 template that makes use of our API generation template described earlier:

~~~
<#@ template language="C#v3.5" #>
<#@ include file="..\LinqToTreeCodeGen.tt" #>
<#
string typeName = "System.Windows.Forms.Control";
string adapterType = "LinqToWindowsForms.WindowsFormsTreeAdapter";
string targetNamespace = "LinqToWindowsForms";

GenerateLinqMethods(typeName, adapterType, targetNamespace);
#>
~~~

And, here are a couple of simple queries that use this generated API:

~~~csharp
// find any buttons that are within GroupBoxes
var buttons = this.Descendants<Button>()
                    .Where(i => i.Ancestors<GroupBox>().Any());

// find all visible textboxes
var textBox = this.Descendants<TextBox>()
                  .Cast<TextBox>()
                  .Where(t => t.Visible);
~~~

### LINQ to Filesystem

I think you probably know the drill by now...

The following is the `ILinqToTree` implementation that adapts classes of type `DirectoryInfo`:

~~~csharp
/// <summary>
/// Adapts a DirectoryInfo to provide methods required for generate
/// a Linq To Tree API
/// </summary>
class FileSystemTreeAdapter : ILinqTree<DirectoryInfo>
{
    private DirectoryInfo _dir;

    public FileSystemTreeAdapter(DirectoryInfo dir)
    {
        _dir = dir;
    }

    public IEnumerable<DirectoryInfo> Children()
    {
        DirectoryInfo[] dirs = null;
        try
        {
            dirs = _dir.GetDirectories();
        }
        catch (Exception)
        { }

        if (dirs == null)
        {
            yield break;
        }
        else
        {
            foreach (var item in dirs)
                yield return item;
        }
    }

    public DirectoryInfo Parent
    {
        get
        {
            return _dir.Parent;
        }
    }
}
~~~

I have also added another extension method to `DirectoryInfo` to adapt the '`GetFiles`' method which returns an array into something more LINQ friendly. For those of you familiar with XPath, files in this context can be seen as analogous to attributes in an XML document, and form another axis which can be queried.

~~~csharp
public static class DirectoryInfoExtensions
{
    /// <summary>
    /// An enumeration of files within a directory.
    /// </summary>
    /// <param name="dir"></param>
    /// <returns></returns>
    public static IEnumerable<FileInfo> Files(this DirectoryInfo dir)
    {
        return dir.GetFiles().AsEnumerable();
    }
}
~~~

Here are a few examples which use this API.

Personally, I have a vast number of Visual Studio projects littered around my hard disk, the fruits of many ideas, some good and some bad, but all somehow lacking in organisation. I tend to keep the better ones in Subversion (SVN). The following query finds all the projects which I have added to SVN:

~~~csharp
var dir = new DirectoryInfo(@"C:\Projects");

// find all directories that contain projects checked into SVN
var dirs = dir.Descendants()
      .Where(d => d.Elements().Any(i => i.Name == ".svn"))
      .Where(d => !d.Ancestors().FirstOrDefault().Elements().Any(i => i.Name == ".svn"));

foreach (var d in dirs)
{
    Debug.WriteLine(d.FullName);
}
~~~

The first `where` clause in the query finds any directories that contain a '*.svn*' sub directory. The second `where` clause matches those which do not have a direct parent which itself contains a '*.svn*' directory (when you add a project to SVN, all folders will have a *.svn* folder added to them).

Here's another fun example that provides an interesting mix of query and fluent syntax:

~~~csharp
// find all 'bin' directories that contain XML files, and output
// the number of XML files they contain.
var dirsWithXML =
    from d in dir.Descendants().Where(d => d.Name == "bin").Descendants()
        let xmlCount = d.Files().Where(i => i.Extension == ".xml").Count()
        where xmlCount > 0
        select new{ Directory = d, XmlCount = xmlCount};

foreach (var d in dirsWithXML)
{
    Debug.WriteLine(d.Directory + " [" + d.XmlCount + "]");
}
~~~

The first part of the query, the '`in`' clause, finds all *bin* directories and selects all of their descendant directories; the '`let`' clause assigns the count of the number of XML files in each directory to a variable '`xmlCount`'; the `where` clause selects those where the count is >0; finally, the `selects` clause creates an anonymous type containing the directory and the number of XML files. The output looks something like this:

~~~
...
C:\Projects\SLF\Source\Facades\SLF.BitFactoryFacade\bin\Debug [1]
C:\Projects\SLF\Source\Facades\SLF.BitFactoryFacade\bin\Release [3]
C:\Projects\SLF\Source\Facades\SLF.EntLib20Facade\bin\Debug [3]
C:\Projects\SLF\Source\Facades\SLF.EntLib20Facade\bin\Release [4]
C:\Projects\SLF\Source\Facades\SLF.EntLib41Facade\bin\Debug [2]
C:\Projects\SLF\Source\Facades\SLF.EntLib41Facade\bin\Release [3]
...
~~~

## Conclusions, and One Last Example

I'll finish this article with one last example, for a bit of fun. Returning to the example XAML used in our LINQ to VisualTree implementation above. The following one line query:

~~~csharp
string tree = this.DescendantsAndSelf().Aggregate("",
    (bc, n) => bc + n.Ancestors().Aggregate("",
      (ac, m) => (m.ElementsAfterSelf().Any() ? "| " : "  ") + ac,
    ac => ac + (n.ElementsAfterSelf().Any() ? "+-" : "\\-")) +
      n.GetType().Name + "\n");
~~~

Outputs an ASCII representation of the tree structure:

~~~
\-Window1
  \-Border
    \-AdornerDecorator
      +-ContentPresenter
      | \-Grid
      |   +-TextBox
      |   | \-ClassicBorderDecorator
      |   |   \-ScrollViewer
      |   |     \-Grid
      |   |       +-Rectangle
      |   |       +-ScrollContentPresenter
      |   |       | +-TextBoxView
      |   |       | | \-DrawingVisual
      |   |       | \-AdornerLayer
      |   |       +-ScrollBar
      |   |       \-ScrollBar
      |   \-StackPanel
      |     +-TextBox
      |     | \-ClassicBorderDecorator
      |     |   \-ScrollViewer
      |     |     \-Grid
      |     |       +-Rectangle
      |     |       +-ScrollContentPresenter
      |     |       | +-TextBoxView
      |     |       | | \-DrawingVisual
      |     |       | \-AdornerLayer
      |     |       +-ScrollBar
      |     |       \-ScrollBar
      |     +-Grid
      |     | +-TextBox
      |     | | \-ClassicBorderDecorator
      |     | |   \-ScrollViewer
      |     | |     \-Grid
      |     | |       +-Rectangle
      |     | |       +-ScrollContentPresenter
      |     | |       | +-TextBoxView
      |     | |       | | \-DrawingVisual
      |     | |       | \-AdornerLayer
      |     | |       +-ScrollBar
      |     | |       \-ScrollBar
      |     | \-StackPanel
      |     |   +-TextBox
      |     |   | \-ClassicBorderDecorator
      |     |   |   \-ScrollViewer
      |     |   |     \-Grid
      |     |   |       +-Rectangle
      |     |   |       +-ScrollContentPresenter
      |     |   |       | +-TextBoxView
      |     |   |       | | \-DrawingVisual
      |     |   |       | \-AdornerLayer
      |     |   |       +-ScrollBar
      |     |   |       \-ScrollBar
      |     |   \-RadioButton
      |     |     \-BulletDecorator
      |     |       +-ClassicBorderDecorator
      |     |       | \-Ellipse
      |     |       \-ContentPresenter
      |     |         \-TextBlock
      |     \-ListBox
      |       \-ClassicBorderDecorator
      |         \-ScrollViewer
      |           \-Grid
      |             +-Rectangle
      |             +-ScrollContentPresenter
      |             | +-ItemsPresenter
      |             | | \-VirtualizingStackPanel
      |             | |   +-ListBoxItem
      |             | |   | \-Border
      |             | |   |   \-ContentPresenter
      |             | |   |     \-TextBlock
      |             | |   \-ListBoxItem
      |             | |     \-Border
      |             | |       \-ContentPresenter
      |             | |         \-TextBlock
      |             | \-AdornerLayer
      |             +-ScrollBar
      |             \-ScrollBar
      \-AdornerLayer
~~~

This same query could, of course, be applied to any of the LINQ to Tree APIs generated in this article.

In conclusion, this article has demonstrated how to produce a LINQ API for any tree-like structure by the implementation of a simple adapter interface and the use of T4 templates for code generation. Hopefully, you have found this article interesting, and have perhaps learnt something new about the LINQ to XML APIs, or XPath axes.

If you manage to apply this technique to some other tree structure that I have not covered in this article, I would love to hear about it, please leave a comment below.

Enjoy!
