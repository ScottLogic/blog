---
title: Generate WPF and Silverlight Dependency Properties using T4 Templates
date: 2009-06-01 00:00:00 Z
categories:
- Tech
tags:
- silverlight
- t4
- wpf
author: ceberhardt
layout: default_post
source: codeproject
summary: Presents a T4 template that generates the verbose boilerplate required for WPF and Silverlight dependency property declarations from a simple XML description file, with no third-party tools needed. The technique integrates directly into Visual Studio and eliminates a common source of error-prone repetition in XAML-based development.
---

*This article was originally published on CodeProject, which has since shut down.*

## Overview

This article describes a technique for code-generation of WPF / Silverlight classes which define dependency properties. The code-generation is performed using a relatively simple T4 template which reads an XML description of the classes and their associated dependency properties. T4 templates are a built-in code generator within Visual Studio; therefore, this technique does not require any third party frameworks or libraries; you can simply copy the template, create your XML file, and your classes will be generated for you!

The aim of this article is twofold; firstly, it provides a very light introduction to T4 templates, which seem to be something of a 'secret'; secondly, it provides a practical solution to the problem of verbose and error prone dependency property declarations.

## Introduction

Personally, I find one of the most frustrating aspects of Silverlight and WPF development is working with the dependency property framework. Whilst the framework itself is beautiful in concept, the dependency properties themselves are completely ugly in their implementation!

Take for example the following dependency property declaration:

```csharp
public double Maximum
{
    get { return (double)GetValue(MaximumProperty); }
    set { SetValue(MaximumProperty, value); }
}

public static readonly DependencyProperty MaximumProperty =
    DependencyProperty.Register("Maximum", typeof(double),
    typeof(RangeControl), new PropertyMetadata(0.0, OnMaximumPropertyChanged));

private static void OnMaximumPropertyChanged(DependencyObject d,
    DependencyPropertyChangedEventArgs e)
{
    RangeControl myClass = d as RangeControl;
    myClass.OnMaximumPropertyChanged(e);
}

private void OnMaximumPropertyChanged(DependencyPropertyChangedEventArgs e)
{
    // do something
}
```

The above code defines a dependency property (DP), `Maximum`, providing a type and default value, a CLR property wrapper, and a method which is invoked on property change. We have 21 lines of quite densely packed code, which does so little! Furthermore, dependency property declarations can be quite error prone; if incorrectly specified, the resultant error can easily go undetected and unreported, wasting precious hours ...

A few people have created code snippets which help automate the construction of this boiler-plate code. There are a few snippets available for Silverlight within the [Silverlight Contrib project](http://silverlightcontrib.codeplex.com/) and the whole host available for [WPF](http://www.drwpf.com/blog/Home/tabid/36/EntryID/41/Default.aspx), courtesy of Dr. WPF. Code snippets help to a certain extent, giving you a far quicker way to introduce a new DP to a class; however, if you need to modify your DP declaration, possibly adding a change event handler or moving it within a class hierarchy, you are back to using a more manual approach.

Before I describe my approach, I want to briefly explain why dependency properties (DP) have to be this way. An obvious beginner question is, why can't CLR properties behave like DPs? The difference is that CLR properties are understood by the compiler, they are part of the language, whereas DPs are purely implementation being part of the framework rather than the language. The compiler has no understanding of DPs, hence there is no shorthand available.

So, if we can't change the language itself, what can we do? I toyed with the idea of applying [Aspect Oriented Programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming), enhancing the compiled IL in order to add DPs for CLRs marked with attributes; however, whichever way I looked at the problem, I could not find a solution that fits. This led me onto code generation, the basic idea being that my DPs would be generated from some concise description. This investigation led me to one of Visual Studio's best kept secrets: [T4 templates](http://msdn.microsoft.com/en-us/library/bb126445.aspx) (T4 = Text Template Transformation Toolkit!).

## A Quick T4 Primer

### Hello World

T4 templates are available within Visual Studio 2008; however, they are not listed when you select 'Add => New Item'. To add a new template, simply create a new, empty text file and change its extension to 'tt'. You will then see something that looks like the following:

![TemplateFile.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/TemplateFile.png)

Your template file is visible within the Solution Explorer, together with the file that it generates. If you inspect the properties of your template file, you will find that it has a 'Custom Tool' associated with it, `TextTemplatingFileGenerator`. This class is responsible for invoking the code generation engine that transforms the T4 file and generates the associated file. Also, if you right click your T4 file, you will notice that there is a new menu option available: 'Run Custom Tool', which allows you to execute your template on-demand.

![CustomTool.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/CustomTool.png)

The templates themselves are executed when you save changes to them, and before Visual Studio compiles your project, so in the example above, *HelloWorld.cs*, our generated file, is compiled just like any other 'cs' file. However, Visual Studio does not have any understanding of the dependencies between your template and other files or templates. Therefore, if your template depends on some external file, such as an XML file, when this file is changed, you will have to select 'Run Custom Tool' to run the template engine for your T4 template and update the output file.

Here's a very simple example. The following template (which has an almost ASP.NET-like syntax) creates a *.cs* file, whilst the template language itself is C#.

```csharp
<#@ output extension="cs" #>
<#@ template language="C#" #>
public class HelloWorld
{
    public void DoSomething()
    {
        <#
            for(int i=0; i<5; i++)
            {
        #>
        this.Write("Hello World #<#= i #>");
        <#
            }
        #>
    }
}
```

**Note**: The CodeProject syntax highlighter does not recognise T4 template code, hence it performs some slightly odd and random highlighting on the template code!

And, here is the output:

```csharp
public class HelloWorld
{
    public void DoSomething()
    {
        this.Write("Hello World #0");
        this.Write("Hello World #1");
        this.Write("Hello World #2");
        this.Write("Hello World #3");
        this.Write("Hello World #4");
    }
}
```

**Note**: The above will not work within a Silverlight project; for details of why and how to solve this problem, see the 'Other Issues' section.

### Template Structure

Templates are composed of four main parts:

- [Statement blocks](http://www.olegsych.com/2008/02/t4-statement-blocks/) - enclosed as follows: `<# StatementCode #>`. This code is executed by the template engine and is where you express your template logic.
- [Expression blocks](http://www.olegsych.com/2008/02/t4-expression-blocks/) - enclosed as follows: `<#= ExpressionBlock #>`. The evaluation block is executed by the template engine, and its result is added to the generated file.
- Directives - enclosed as follows: `<#@ Directive #>`. These provide information to the template engine such as the output file extension, the language used in statement blocks, any referenced assemblies, and imported namespaces.
- [Text blocks](http://www.olegsych.com/2008/02/t4-text-blocks/) - this is the plain text which is not contained within one of the other blocks detailed above. This text is simply copied to the output.

T4 templates are quite script-like in that they do not contain classes or any other Object Oriented concepts. The only mechanism available for code re-use is [class feature blocks](http://www.olegsych.com/2008/02/t4-class-feature-blocks/), which have the following syntax: `<#+ FeatureBlock #>`, and are effectively helper functions, The following is a simple example:

```csharp
<#@ template language="C#"#>
<# HelloWorld(); #>
<#+
    private void HelloWorld()
    {
        this.Write("Hello World");
    }
#>
```

Here, a class feature block containing a single helper function `HelloWorld` has been defined (you can, however, define multiple helper functions in one block) and is invoked just once.

### Useful Tools

Visual Studio Intellisense does not recognise T4 files; also, there is no form of context highlighting. However, context highlighting is made possible with the free Clarius [Visual T4 Editor Community Edition](http://www.visualt4.com/downloads.html). You can also purchase the professional edition which includes Intellisense. If you only implement simple templates, the lack of Intellisense is not a major obstacle; however, if I were implementing something more ambitious, I would definitely consider purchasing the Pro. edition.

If you are considering serious T4 development I would also recommend looking at the T[4 Toolbox](http://www.codeplex.com/t4toolbox). This Open Source CodePlex project adds many enhancements to the basic Visual Studio T4 support, including a template option in the 'Add => New Item' dialog, OO templates, a unit test framework, some ready made templates, and [a whole lot more besides](http://www.olegsych.com/2008/12/what-is-in-t4-toolbox/).

I quite intentionally did not use the T4 Toolbox for my Dependency Property generation code. This is not because I dislike the T4 Toolbox, which really simplifies coding T4 templates; my reason for not using it is that, I wanted anyone to be able to use my simple WPF / Silverlight templates without having to download any other libraries or frameworks.

One of the best resources for information on T4 on the internet is Oleg Sych's blog. He has posted [numerous mini-articles](http://www.olegsych.com/tag/T4/) on using T4 templates, which range from simple primers and tutorials to advanced concepts.

### Using T4 Templates Within Silverlight Projects, and Other Issues ...

Visual Studio uses your project references to run T4 templates within your project. This works just fine for most .NET project types; however, the Silverlight .NET assemblies do not include all the classes required for T4 template execution.

In order to use T4 templates within Silverlight projects, you need to use the `assembly` directive, which adds assembly references, just for executing the T4 template, to your template, as follows:

```
<#@ assembly name="C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\System.dll" #>
<#@ assembly name="C:\Program Files\Reference Assemblies\Microsoft\
                   Framework\v3.5\System.Core.dll" #>
<#@ assembly name="C:\Program Files\Reference Assemblies\
                   Microsoft\Framework\v3.5\System.Xml.Linq.dll" #>
<#@ assembly name="C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\System.Xml.dll" #>

<#@ import namespace="System.Linq" #>
<#@ import namespace="System.Xml.Linq" #>
```

The *System.dll* assembly is the only assembly you need for a simple T4 template; however, I found the other three were required to use LINQ to XML, which I use later in this article. Notice also the `import` directive which has the same role as the `using` keyword within C# files.

Another thing to watch for is that if you want to load files from your T4 template, you have to bear in mind the working directory. If you simply want to reference another template file, you can use the `include` directive:

```
<#@ include file="DependencyObjectTemplate.tt" #>
```

However, if you want to load an XML file for example, you have to reference the complete path of the file. This is because the working directory for your T4 templates is Visual Studio's working directory, rather than your current project location.

## Dependency Property Code Generation

### Generating Partial Classes

T4 templates are clearly a good candidate for generating DP code; however, how can we add these properties to classes which we will want to add other logic to in the form of methods, fields, and properties? The answer is to simply use the same mechanism that Visual Studio itself uses to combine hand-written code with designer generated code - partial classes.

If we can create a suitable representation of our DPs within our T4 template, the process of generating all the DPs for a class is quite straightforward, as illustrated below:

```csharp
public partial class <#= className #>
{
<#
foreach(var dp in dps)
{
    string propertyName = dp.Name;
    string propertyType = dp.Type;
    string defaultValue = dp.DefaultValue;
    #>

    #region <#= propertyName #>

    public <#= propertyType #> <#= propertyName #>
        {
            get { return (<#= propertyType #>)GetValue(<#= propertyName #>Property); }
            set { SetValue(<#= propertyName #>Property, value); }
        }

        public static readonly DependencyProperty <#= propertyName #>Property =
            DependencyProperty.Register("<#= propertyName #>", typeof(<#= propertyType #>),
            typeof(<#= className #>), new PropertyMetadata(<#= defaultValue #>));

        #endregion
<#
} // end foreach dps
#>
}
```

The above code registers a DP with the associated CLR wrapper and gives a default value. I will consider how to add change notification in the next section. This leaves the problem of how to specify the DPs in a concise and simple manner. I decided that the simplest approach would be to define the DPs for each class within an XML file, the template can load the XML file, use LINQ to query it, then generate the required partial classes.

### An XML Schema for DP Specification

I usually like to define an XML schema for my XML files for a number of reasons. Firstly, having a schema to validate your XML instance documents means that your parser does not need to be so defensive. Secondly, with the Visual Studio XML editor, when a schema is associated with an XML instance document, you get element and attribute name auto-complete via Intellisense; this means, you do not have to worry so much about using verbose and descriptive element / attribute names.

Here is a simple XML schema for our DP specification:

```xml
<?xml version="1.0" encoding="utf-8"?>
<xs:schema
    targetNamespace="http://www.scottlogic.co.uk/DependencyObject"
    elementFormDefault="qualified"
    xmlns="http://www.scottlogic.co.uk/DependencyObject"
    xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <xs:element name="dependencyObjects" type="dependencyObjectsType"/>

  <xs:complexType name="dependencyObjectsType">
    <xs:sequence>
      <xs:element name="dependencyObject"
         type="dependencyObjectType"
         maxOccurs="unbounded" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>

  <xs:complexType name="dependencyObjectType">
    <xs:sequence>
      <xs:element name="dependencyProperty"
         type="dependencyPropertyType" maxOccurs="unbounded"/>
    </xs:sequence>
    <xs:attribute name="type" type="xs:string" use="required"/>
    <xs:attribute name="base" type="xs:string" use="required"/>
  </xs:complexType>

  <xs:complexType name="dependencyPropertyType">
    <xs:attribute name="name" type="xs:string" use="required"/>
    <xs:attribute name="type" type="xs:string" use="required"/>
    <xs:attribute name="defaultValue" type="xs:string" use="required"/>
  </xs:complexType>

</xs:schema>
```

An example instance document is given below, which describes the DPs for a pair of classes: a `RangeControl` and an `AmountControl`:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<dependencyObjects
  xmlns="http://www.scottlogic.co.uk/DependencyObject"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <dependencyObject name="SilverlightTemplates.RangeControl"
                    base="UserControl">
    <dependencyProperty type="double" defaultValue="0.0"
                        name="Maximum"/>
    <dependencyProperty type="double" defaultValue="0.0"
                        name="Minimum"/>
  </dependencyObject>

  <dependencyObject name="SilverlightTemplates.AmountControl"
                    base="UserControl">
    <dependencyProperty type="double" defaultValue="0.0"
                        name="Amount"/>
  </dependencyObject>

</dependencyObjects>
```

We can define a helper method (within a class feature block) which loads this XML file, and generates the partial class for a named class within our XML file:

```csharp
<#@ output extension="cs" #>
<#@ template language="C#v3.5" #>
<#@ assembly name="C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\System.dll" #>
<#@ assembly name="C:\Program Files\Reference Assemblies\
                   Microsoft\Framework\v3.5\System.Core.dll" #>
<#@ assembly name="C:\Program Files\Reference Assemblies\
                   Microsoft\Framework\v3.5\System.Xml.Linq.dll" #>
<#@ assembly name="C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\System.Xml.dll" #>
<#@ import namespace="System.Linq" #>
<#@ import namespace="System.Xml.Linq" #>
using System;
using System.Windows;
using System.Windows.Controls;
using System.ComponentModel;

<#+

private void GenerateClass(string classFullName, string xmlFileLocation)
{
    string classNamespace = classFullName.Substring(0, classFullName.LastIndexOf('.'));
    string className = classFullName.Substring(classFullName.LastIndexOf('.') + 1);

    XNamespace ns = "http://www.scottlogic.co.uk/DependencyObject";
    XDocument xmlFile = XDocument.Load(xmlFileLocation);

    var dps =    from dp in xmlFile.Descendants(ns + "dependencyProperty")
                where dp.Parent.Attribute("type").Value == classFullName
                select dp;

    var depObj = (from c in xmlFile.Descendants(ns + "dependencyObject")
                    where c.Attribute("type").Value == classFullName
                    select c).Single();

    string baseType = depObj.Attribute("base").Value;
#>

namespace <#= classNamespace #>
{
    public partial class <#= className #> : <#= baseType #>
    {
<#+
    foreach(var dp in dps)
    {
        string propertyName = dp.Attribute("name").Value;
        string propertyType = dp.Attribute("type").Value;
        string defaultValue = dp.Attribute("defaultValue").Value;
        #>

        #region <#= propertyName #>
        <#+

        GenerateCLRAccessor(propertyType, propertyName);

        GenerateDependencyProperty(className, propertyType, defaultValue, propertyName);

        #>
        #endregion
    <#+
    } // end foreach dps
    #>
    }
}

<#+
}

private void GenerateCLRAccessor(string propertyType, string propertyName)
{
    #>
        public <#= propertyType #> <#= propertyName #>
        {
            get { return (<#= propertyType #>)GetValue(<#= propertyName #>Property); }
            set { SetValue(<#= propertyName #>Property, value); }
        }
    <#+
}

private void GenerateDependencyProperty(...)
{
     ...
}
#>
```

The `GenerateClass` function takes two arguments: the fully qualified name of the class to generate, and the location of the XML file (with its full path specified). It creates an X-DOM from the file, then uses LINQ queries to locate the `dependencyObject` XML element for our named class and the `dependencyProperty` elements which it contains. The partial class is constructed within the correct namespace, then the DPs collection is iterated over to output each dependency property.

The `GenerateCLRAccessor` helper function constructs a CLR wrapper for the DP, while the `GenerateDependencyProperty` function constructs the dependency property itself. Note that the `GenerateDependencyProperty` function is not illustrated because it is basically the same as the earlier example.

In order to use the above template, we create a very simple template file which references it and invokes the `GenerateClass` function:

```csharp
<#@ include file="DependencyObject.tt" #>
<#
GenerateClasses("SilverlightTemplates.RangeControl",
    @"C:\Projects\...\DependencyObjects.xml");
#>
```

### Property Change Notification

The above examples demonstrate how to generate dependency properties of a given type for a class. However, a common requirement is the need to add a callback when a dependency property changes. This is specified as part of the dependency property metadata; revisiting our initial example DP, it is used as follows:

```csharp
public static readonly DependencyProperty MaximumProperty =
    DependencyProperty.Register("Maximum", typeof(double),
    typeof(RangeControl), new PropertyMetadata(0.0, OnMaximumPropertyChanged));

private static void OnMaximumPropertyChanged(DependencyObject d,
    DependencyPropertyChangedEventArgs e)
{
    RangeControl myClass = d as RangeControl;
    myClass.OnMaximumPropertyChanged(e);
}

private void OnMaximumPropertyChanged(DependencyPropertyChangedEventArgs e)
{
    // do something
}
```

In the above example, the DP declaration provides a method `OnMaximumPropertyChanged` which will be called each time this property changes. The method must be static; therefore, in order to forward this change event to the correct instance of our class, we have to cast the `DependencyObject` argument, then invoke the non-static `OnMaximumPropertyChanged` method.

This 'boiler-plate' code could also be eliminated by our T4 template. The problem is, we really want the non-static `OnMaximumPropertyChanged` method to live within our hand-coded `RangeControl` class where we implement our business logic; however, it is invoked from our generated class. We could add a virtual method; however, this would require that we implement a sub-class in order to override this and add behaviour.

Fortunately, the .NET framework already has a solution to this problem in the shape of partial methods. When defining a partial class, it is possible to define partial methods which may be invoked from within the partial class. You can define the implementation of these partial methods within your hand-coded class, allowing your generated partial class to invoke methods of your hand-coded class directly. The really clever part is that, if you do not implement the partial method, the call to this method vanishes completely when the classes are compiled! This does, of course, impose some constraints on the [signature of partial methods](http://msdn.microsoft.com/en-us/library/wa80x488.aspx); for example, they must return `void` for obvious reasons.

### Implementing INotifyPropertyChanged

Within WPF, the binding framework is slightly more powerful than its Silverlight counterpart, allowing you to bind DPs together via value converters, making all sorts of interesting bindings possible. However, Silverlight is slightly less powerful; if you want to bind two DPs together, this is very much a manual process, although approximations of the [`ElementName`](http://www.scottlogic.co.uk/blog/wpf/2009/02/elementname-binding-in-silverlight-via-attached-behaviours/) and [`RelativeSource`](http://www.scottlogic.co.uk/blog/wpf/2009/02/relativesource-binding-in-silverlight/) bindings are possible. You also have to implement `INotifyPropertyChanged` and raise `PropertyChanged` events for each DP.

The T4 template in the attached source code and described later in the User Guide section has an attribute `notifyPropertyChanged` on the `dependencyObject` element, which if set to `true` will generate the `INotifyPropertyChanged` implementation for the class and raise the `PropertyChanged` event for each DP when their property changed callback is invoked. Again, more boiler-plate code eliminated!

## The Complete Template and XML Schema

The previous sections described how a T4 template could be used to generate dependency properties. The following section details the completed dependency object generation template which I have developed, which adds features such as attached properties, comments, and WPF support.

You can either cut-and-paste the template and follow the instructions to get started, or download the example projects to see the template used in a real WPF or Silverlight project.

### Dependency Object Generation Template

**Note**: If used within a WPF project, you can remove the assembly reference directives.

```csharp
<#@ output extension="cs" #>

<#@ template language="C#v3.5" #>

<#@ assembly name="C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\System.dll" #>
<#@ assembly name="C:\Program Files\Reference Assemblies\
                   Microsoft\Framework\v3.5\System.Core.dll" #>
<#@ assembly name="C:\Program Files\Reference Assemblies\
                   Microsoft\Framework\v3.5\System.Xml.Linq.dll" #>
<#@ assembly name="C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\System.Xml.dll" #>

<#@ import namespace="System.Linq" #>
<#@ import namespace="System.Xml.Linq" #>

using System;
using System.Windows;
using System.Windows.Controls;
using System.ComponentModel;<#+

/// <summary>
/// Generates all the classes defined within the given XML file
/// </summary>
private void GenerateClasses(string xmlFileLocation)
{
    XNamespace ns = "http://www.scottlogic.co.uk/DependencyObject";
    XDocument xmlFile = XDocument.Load(xmlFileLocation);

    var depObjs = from c in xmlFile.Descendants(ns + "dependencyObject")
                    select c;

    foreach(var depObj in depObjs)
    {
        GenerateClass(depObj.Attribute("type").Value, xmlFileLocation);
    }
}

/// <summary>
/// Generates an implementation of INotifyPropertChanged
/// </summary>
private void GenerateINotifyPropertChangedImpl()
{
    #>

        #region INotifyPropertyChanged Members

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        #endregion
    <#+
}

/// <summary>
/// Generates a handler for the DP change event
/// </summary>
private void GenerateChangeEventHandler(string className, string propertyName,
             bool propertyChangedCallback, bool classRaisesPropertyChanged)
{
    string raisePropertyChanged = classRaisesPropertyChanged ?
        string.Format("myClass.OnPropertyChanged(\"{0}\");", propertyName) : "";
    #>

        private static void On<#= propertyName #>PropertyChanged(DependencyObject d,
            DependencyPropertyChangedEventArgs e)
        {
            <#= className #> myClass = d as <#= className #>;
            <#= raisePropertyChanged #>
            myClass.On<#= propertyName #>PropertyChanged(e);
        }

        partial void On<#= propertyName #>PropertyChanged(
                                 DependencyPropertyChangedEventArgs e);

    <#+
}

/// <summary>
/// Generates a DP definition
/// </summary>
private void GenerateDependencyProperty(string className, string propertyType,
             string defaultValue, string propertyName, bool changedCallback,
             bool isAttached, string metadata, string summary)
{
    string propertyMetadata;
    string changedCallbackMethodName = changedCallback ? "On" +
           propertyName + "PropertyChanged" : "null";

    // if DP metadata is provided, create an instance of FrameworkPropertyMetadata,
    // this is WPF specific
    if (!string.IsNullOrEmpty(metadata))
    {
        propertyMetadata = string.Format(
            "new FrameworkPropertyMetadata({0}, {1}, {2})",
            defaultValue, metadata, changedCallbackMethodName);
    }
    else
    {
        propertyMetadata = string.Format("new PropertyMetadata({0}, {1})",
            defaultValue, changedCallbackMethodName);
    }

    string registerMethod = isAttached ? "RegisterAttached" : "Register";

    #>

        /// <summary>
        /// Identifies the <#= propertyName #> Dependency Property.
        /// <summary>
        public static readonly DependencyProperty <#= propertyName #>Property =
            DependencyProperty.<#= registerMethod #>("<#= propertyName #>",
            typeof(<#= propertyType #>),
            typeof(<#= className #>), <#= propertyMetadata #>);

    <#+
}

/// <summary>
/// Generates a CLR accessor for a DP
/// </summary>
private void GenerateCLRAccessor(string typeConverter, string propertyType,
                                 string propertyName, string summary)
{
    string typeConverterDefinition = typeConverter!= null ?
                        "[TypeConverter(typeof(" + typeConverter + "))]" : "";

    if (!string.IsNullOrEmpty(summary))
        GeneratePropertyComment(summary);

    #>
        <#= typeConverterDefinition #>
        public <#= propertyType #> <#= propertyName #>
        {
            get { return (<#= propertyType #>)GetValue(<#= propertyName #>Property); }
            set { SetValue(<#= propertyName #>Property, value); }
        }
    <#+
}

private void GenerateAttachedPropertyAccessor(string propertyName, string propertyType)
{
    #>

        // <#= propertyName #> attached property accessors
        public static void Set<#= propertyName #>(UIElement element,
                                                  <#= propertyType #> value)
        {
            element.SetValue(PlottedPropertyProperty, value);
        }
        public static <#= propertyType #> Get<#= propertyName #>(UIElement element)
        {
            return (<#= propertyType #>)element.GetValue(<#= propertyName #>Property);
        }
    <#+
}

/// <summary>
/// Generates a comment block for a CLR or DP
/// </summary>
private void GeneratePropertyComment(string summary)
{
    #>
        /// <summary>
        /// <#= summary #>. This is a Dependency Property.
        /// </summary><#+
}

/// <summary>
/// Generates a class along with its associated DPs
/// </summary>
private void GenerateClass(string classFullName, string xmlFileLocation)
{
    string classNamespace = classFullName.Substring(0, classFullName.LastIndexOf('.'));
    string className = classFullName.Substring(classFullName.LastIndexOf('.') + 1);

    XNamespace ns = "http://www.scottlogic.co.uk/DependencyObject";
    XDocument xmlFile = XDocument.Load(xmlFileLocation);

    var dps =    from dp in xmlFile.Descendants(ns + "dependencyProperty")
                where dp.Parent.Attribute("type").Value == classFullName
                select dp;

    var depObj = (from c in xmlFile.Descendants(ns + "dependencyObject")
                    where c.Attribute("type").Value == classFullName
                    select c).Single();

    bool classRaisesPropertyChanged =
             depObj.Attribute("notifyPropertyChanged")!=null &&
            (depObj.Attribute("notifyPropertyChanged").Value ==
             "1" || depObj.Attribute("notifyPropertyChanged").Value == "true");

    string baseType = depObj.Attribute("base").Value;
#>

namespace <#= classNamespace #>
{
    public partial class <#= className #> :
      <#= baseType #><#+ if(classRaisesPropertyChanged){ #>,
                            INotifyPropertyChanged<#+ } #>
    {
<#+
    foreach(var dp in dps)
    {
        string propertyName = dp.Attribute("name").Value;
        string propertyType = dp.Attribute("type").Value;
        string summary = dp.Attribute("summary")!=null ?
                         dp.Attribute("summary").Value : null;
        string metadata = dp.Attribute("metadata")!=null ?
                          dp.Attribute("metadata").Value : null;
        string defaultValue = dp.Attribute("defaultValue").Value;
        string typeConverter = dp.Attribute("typeConverter")!=null ?
                               dp.Attribute("typeConverter").Value : null;
        bool propertyChangedCallback =
             dp.Attribute("propertyChangedCallback")!=null &&
            (dp.Attribute("propertyChangedCallback").Value ==
             "1" || dp.Attribute("propertyChangedCallback").Value == "true");
        bool isAttached = dp.Attribute("attached")!=null &&
            (dp.Attribute("attached").Value == "1" ||
             dp.Attribute("attached").Value == "true");
        #>

        #region <#= propertyName #>
        <#+

        GenerateCLRAccessor(typeConverter, propertyType, propertyName, summary);

        bool handleDPPropertyChanged =
             propertyChangedCallback || classRaisesPropertyChanged;

        GenerateDependencyProperty(className, propertyType, defaultValue,
                                   propertyName, handleDPPropertyChanged,
                                   isAttached, metadata, summary);

        if (handleDPPropertyChanged)
        {
            GenerateChangeEventHandler(className, propertyName,
                   propertyChangedCallback, classRaisesPropertyChanged);
        }

        if (isAttached)
        {
            GenerateAttachedPropertyAccessor(propertyName, propertyType);
        }
        #>
        #endregion
    <#+
    } // end foreach dps

    if (classRaisesPropertyChanged)
    {
        GenerateINotifyPropertChangedImpl();
    }
    #>
    }
}

<#+
}
#>
```

### The XML Schema

```xml
<?xml version="1.0" encoding="utf-8"?>
<xs:schema
    targetNamespace="http://www.scottlogic.co.uk/DependencyObject"
    elementFormDefault="qualified"
    xmlns="http://www.scottlogic.co.uk/DependencyObject"
    xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <xs:element name="dependencyObjects" type="dependencyObjectsType"/>

  <xs:complexType name="dependencyObjectsType">
    <xs:sequence>
      <xs:element name="dependencyObject"
        type="dependencyObjectType"
        maxOccurs="unbounded" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>

  <xs:complexType name="dependencyObjectType">
    <xs:sequence>
      <xs:element name="dependencyProperty"
        type="dependencyPropertyType" maxOccurs="unbounded"/>
    </xs:sequence>
    <xs:attribute name="type"
      type="xs:string" use="required"/>
    <xs:attribute name="notifyPropertyChanged"
      type="xs:boolean" use="optional"/>
    <xs:attribute name="base" type="xs:string" use="required"/>
  </xs:complexType>

  <xs:complexType name="dependencyPropertyType">
    <xs:attribute name="summary" type="xs:string" use="optional"/>
    <xs:attribute name="name" type="xs:string" use="required"/>
    <xs:attribute name="type" type="xs:string" use="required"/>
    <xs:attribute name="typeConverter" type="xs:string" use="optional"/>
    <xs:attribute name="defaultValue" type="xs:string" use="required"/>
    <xs:attribute name="propertyChangedCallback" type="xs:boolean" use="optional"/>
    <xs:attribute name="notifyPropertyChanged" type="xs:boolean" use="optional"/>
    <xs:attribute name="attached" type="xs:boolean" use="optional"/>
    <xs:attribute name="metadata" type="xs:string" use="optional"/>
  </xs:complexType>

</xs:schema>
```

### A Quick User Guide

The template has two entry points: `GenerateClass`, which generates a specific class from the referenced XML file, and `GenerateClasses`, which generates all the classes within the XML file. I typically create a single XML file for all the classes within my project (for simple projects), or namespace for more complex projects. This helps to keep all the generated code in one place, and also removes the need for lots of little 4 line templates which simply reference the DP generation template and invoke `GenerateClass`. This section briefly describes the various elements and attributes within the XML schema. Structurally, the XML file can contain one or more instances of the `dependencyObject` element, each containing one or more `dependencyProperty` elements. The `dependencyObject` element has the following attributes:

- `type` - the fully qualified name of the generated class.
- `base` - the name of the generated class' superclass (does not need to be fully qualified if it is within the same namespace).
- `notifyPropertyChanged` - if this boolean attribute is set to `true`, the class will implement `INotifyPropertyChanged` and will raise the `PropertyChanged` event whenever any of the DPs change.

The `dependencyProperty` element has the following attributes:

- `name` - the DP name.
- `type` - the DP type.
- `defaultValue` - the default value of the dependency property.
- `summary` - a description of the DP which will be used to document the CLR wrapper.
- `typeConverter` - the type converter to associate with the CLR wrapper. For example, if you specify a converter `typeConverter="MyConverter"`, the following attribute is associated with the CLR property: `[TypeConverter(typeof(MyConverter))]`.
- `propertyChangedCallback` - a boolean property which indicates whether to add a property changed callback. Note that if this attribute is `false` and the `notifyPropertyChanged` attribute on the `dependencyObject` is also `false`, then no `PropertyChangedCallback` will be generated.
- `attached` - indicates that this is an attached DP.
- `metadata` - (WPF only) the framework metadata for this DP; for example: `metadata="FrameworkPropertyMetadataOptions.Inherits"`.

Finally, if I require additional `using` statements (other than those defined in the *DependeycObjectTemplate.tt* file), I typically add them to the simple templates that invoke the `GenerateClasses` function:

```csharp
<#@ include file="DependencyObject.tt" #>
// additional using statements go here ...
using System.Collections.Generic;
<#
    GenerateClasses(@"C:\Projects\...\DependencyObjects.xml");
#>
```

### A Worked Example

As an example, this section will illustrate the development of a simple Silverlight range control which contains a pair of text boxes which indicate the maximum and minimum range values. The control has two DPs: `Maximum` and `Minimum`, which are bound to these `TextBox`es. When the text of either changes, a simple check is made to ensure that `Maximum` > `Minimum`; if this is not the case, the two values are swapped.

Here is the XML description of our `RangeControl` class:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<dependencyObjects
  xmlns="http://www.scottlogic.co.uk/DependencyObject"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <dependencyObject type="SilverlightTemplates.RangeControl"
             base="UserControl" notifyPropertyChanged="true" >
    <dependencyProperty type="double" defaultValue="0.0"
             summary="The maximum range value"
             name="Maximum" propertyChangedCallback="true"/>
    <dependencyProperty type="double" defaultValue="0.0"
             summary="The maximum range value"
             name="Minimum" propertyChangedCallback="true"/>
  </dependencyObject>

</dependencyObjects>
```

Here is the T4 template which uses our generic *DependencyObjectTemplate.tt* to generate the class:

```csharp
<#@ include file="DependencyObjectTemplate.tt" #>
<#
    GenerateClass("SilverlightTemplates.RangeControl",
        @"C:\Projects\...\RangeControl.xml");
#>
```

The generated class is illustrated below:

```csharp
using System;
using System.Windows;
using System.Windows.Controls;
using System.ComponentModel;

namespace SilverlightTemplates
{
    public partial class RangeControl : UserControl, INotifyPropertyChanged
    {

        #region Maximum

        /// <summary>
        /// The maximum range value. This is a Dependency Property.
        /// </summary>
        public double Maximum
        {
            get { return (double)GetValue(MaximumProperty); }
            set { SetValue(MaximumProperty, value); }
        }

        /// <summary>
        /// Identifies the Maximum Dependency Property.
        /// <summary>
        public static readonly DependencyProperty MaximumProperty =
            DependencyProperty.Register("Maximum", typeof(double),
            typeof(RangeControl), new PropertyMetadata(0.0, OnMaximumPropertyChanged));

        private static void OnMaximumPropertyChanged(DependencyObject d,
            DependencyPropertyChangedEventArgs e)
        {
            RangeControl myClass = d as RangeControl;
            myClass.OnPropertyChanged("Maximum");
            myClass.OnMaximumPropertyChanged(e);
        }

        partial void OnMaximumPropertyChanged(DependencyPropertyChangedEventArgs e);

        #endregion

        #region Minimum

        /// <summary>
        /// The maximum range value. This is a Dependency Property.
        /// </summary>
        public double Minimum
        {
            get { return (double)GetValue(MinimumProperty); }
            set { SetValue(MinimumProperty, value); }
        }

        /// <summary>
        /// Identifies the Minimum Dependency Property.
        /// <summary>
        public static readonly DependencyProperty MinimumProperty =
            DependencyProperty.Register("Minimum", typeof(double),
            typeof(RangeControl), new PropertyMetadata(0.0, OnMinimumPropertyChanged));

        private static void OnMinimumPropertyChanged(DependencyObject d,
            DependencyPropertyChangedEventArgs e)
        {
            RangeControl myClass = d as RangeControl;
            myClass.OnPropertyChanged("Minimum");
            myClass.OnMinimumPropertyChanged(e);
        }

        partial void OnMinimumPropertyChanged(DependencyPropertyChangedEventArgs e);

        #endregion

        #region INotifyPropertyChanged Members

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        #endregion

    }
}
```

Here is our XAML:

```xml
<UserControl x:Class="SilverlightTemplates.RangeControl"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <StackPanel x:Name="LayoutRoot"
                 Background="White" Orientation="Horizontal">
        <TextBox Name="minTextBox" Width="50"/>
        <TextBlock Text=" : " VerticalAlignment="Center"/>
        <TextBox Name="maxTextBox" Width="50"/>
    </StackPanel>
</UserControl>
```

And finally, our code-behind file for the XAML is as follows:

```csharp
namespace SilverlightTemplates
{
    public partial class RangeControl : UserControl
    {

        public RangeControl()
        {
            InitializeComponent();

            // bind the text boxes to the dependency properties of this user control
            var maxBinding =
              new Binding("Maximum") { Source = this, Mode = BindingMode.TwoWay };
            maxTextBox.SetBinding(TextBox.TextProperty, maxBinding);

            var minBinding =
              new Binding("Minimum") { Source = this, Mode = BindingMode.TwoWay };
            minTextBox.SetBinding(TextBox.TextProperty, minBinding);
        }

        /// <summary>
        /// If max is less than min, swap their values
        /// </summary>
        private void Swap()
        {
            if (Maximum < Minimum)
            {
                double swap = Minimum;
                Minimum = Maximum;
                Maximum = swap;
            }
        }

        partial void OnMaximumPropertyChanged(DependencyPropertyChangedEventArgs e)
        {
            Swap();
        }

        partial void OnMinimumPropertyChanged(DependencyPropertyChangedEventArgs e)
        {
            Swap();
        }
    }
}
```

As you can see from this simple example, the generated class is more than double the size of our code-behind implementation! Also, any changes to our DP declarations can be applied rapidly by simply changing our *RangeControl.xml* file and regenerating.

## The Example Projects

This article is accompanied by two example projects:

## Conclusions

In this article, I have demonstrated a technique for generating DPs (both regular and attached) within WPF and Silverlight. I have been using this technique now for the past month, and have found it to be a real boost to my productivity. Furthermore, I have enjoyed discovering the secret of T4 templates; they are my new favourite tool! Although I seem to find myself seeing T4 as the solution to almost every problem right now ... I am sure this will pass ...

I hope you have enjoyed this article. If you do use this template and can think of any useful additions, please let me know in the comments section below.
