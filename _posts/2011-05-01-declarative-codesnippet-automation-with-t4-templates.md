---
title: Declarative Codesnippet Automation with T4 Templates
date: 2011-05-01 00:00:00 Z
categories:
- Tech
tags:
- t4
author: ceberhardt
layout: default_post
source: codeproject
summary: Describes a mechanism for automating code snippet generation with T4 templates, letting developers declare snippet parameters via attributes instead of writing boilerplate by hand. The approach extends earlier work on dependency property generation to support arbitrary code snippets with a concise, declarative style.
---

*This article was originally published on CodeProject, which has since shut down.*

## ![gears.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/gears.jpg)

[Image from Flickr under CC licence from [ralphbijker](http://www.flickr.com/photos/17258892@N05/)]

## Overview

This article describes a mechanism for automating codesnippets. The
code presented using T4 templates to generate attributes for each code snippet. When
the attribute is applied to a class, the snippet code is generated in a partial class,
based on the arguments supplied to the attribute. This approach allows you to change
the values of the codesnippet parameters and regenerate the code, it also removes
repetitive boiler-plate code from your classes, favouring a more concise, declarative
description of the classes capabilities.

## Introduction

When I started working with WPF and Silverlight a few years ago, one of the few
things that frustrated me about these frameworks is just how verbose the code required
to define dependency properties is (a dependency property is special kind of property
that can be animated, supports inheritance etc...). To tackle this problem I came up
with a solution that uses [T4 templates and ENV.DTE to generated partial classes that contain the dependency
property definitions based on attributes](http://www.scottlogic.co.uk/blog/colin/2009/08/declarative-dependency-property-definition-with-t4-dte/). For example, to add an
`ItemsSource` property to a class you simply add an attribute as
follows:

```csharp
[DependencyPropertyDecl("ItemsSource", typeof(IEnumerable), null,
     "Gets or sets a collection used to generate the content of the JumpList")]
public partial class JumpList : Control
{
  public JumpList()
  {
    this.DefaultStyleKey = typeof(JumpList);
  }
}
```

Which results in the generation of the following code:

```csharp
public partial class JumpList
{
    #region ItemsSource

    /// <summary>
    /// Gets or sets a collection used to generate the content of the JumpList.
    /// This is a Dependency Property.
    /// </summary>
    public IEnumerable ItemsSource
    {
        get { return (IEnumerable)GetValue(ItemsSourceProperty); }
        set { SetValue(ItemsSourceProperty, value); }
    }

    /// <summary>
    /// Identifies the ItemsSource Dependency Property.
    /// <summary>
    public static readonly DependencyProperty ItemsSourceProperty =
        DependencyProperty.Register("ItemsSource", typeof(IEnumerable),
        typeof(JumpList), new PropertyMetadata(null, OnItemsSourcePropertyChanged));

    private static void OnItemsSourcePropertyChanged(DependencyObject d,
        DependencyPropertyChangedEventArgs e)
    {
        JumpList myClass = d as JumpList;

        myClass.OnItemsSourcePropertyChanged(e);
    }

    partial void OnItemsSourcePropertyChanged(DependencyPropertyChangedEventArgs e);

    #endregion
}
```

I have found this to be a great time-saver and use the same code in every single
Silverlight / WPF project that I work on.  
  
Whilst dependency properties are a pretty extreme case of boiler-plate code, they are
by no means the only example. More recently I started on a project which had a fairly
extensive model-layer. This layer contains numerous classes which implement
`INotifyPropertyChanged` and properties which raise the event. Again, I
found myself writing lots of boiler-plate code. The
"standard" approach to boiler-plate code is to
use codesnippets and I found myself adding new snippets for the various code patterns
we used within the modules. This accelerates development, but still generates lots of
code that is not refactor friendly and does nothing to enhance the readability of the
code.  
  
If I could somehow combine the versatility of codesnippets with the convenience of the
declarative code generation, this would be a nice solution to all my boiler-plate code
issues. This article describes the solution I came up with.  
  
This article and the code it presents makes use of T4 templates, a mechanism which is
built-in to Visual Studio for the generation of sourecode from a template, i.e. code
which generates code. For a quick introduction to T4 template I would recommend my
[earlier
article on codeproject](http://www.codeproject.com/KB/WPF/DependencyPropertyCodeGen.aspx#primer).  
  
You don"t need to know all the ins-and-outs of T4 templates to use
this code-generation technique. Probably all you need to know is that T4 templates are
text files with a ".tt" extension that are
executed whenever their contents is changed, the solution is built, or the following
button is clicked:

![TransformAllTemplates.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/TransformAllTemplates.png)

So, if you are using the technique described in this article, whenever you add or
remove an attribute from a class and want to update the generated code, simply click
the button above or build the project.

## From Codesnippets to Attributes

### Transforming snippets with XSLT

The first step in the process is to convert each codesnippet into an attribute that
can be associated with a class. The attribute should have properties that reflect the
properties of the codesnippet. As an example, the following snippet is one that I
created for adding CLR properties to a class which implements
`INotifyPropertyChanged`:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <CodeSnippet Format="1.0.0">
    <Header>
      <Title>Define a Property with Change Notification</Title>
      <Shortcut>PropertyINPC</Shortcut>
      <Description>Code snippet for a property which raises INotifyPropertyChanged</Description>
      <Author>Colin Eberhardt</Author>
      <SnippetTypes>
        <SnippetType>Expansion</SnippetType>
      </SnippetTypes>
    </Header>
    <Snippet>
      <Declarations>
        <Literal>
          <ID>type</ID>
          <ToolTip>Property Type</ToolTip>
          <Default>string</Default>
        </Literal>
        <Literal>
          <ID>summary</ID>
          <ToolTip>Summary Documentation</ToolTip>
          <Default>Gets / sets the property value</Default>
        </Literal>
        <Literal>
          <ID>property</ID>
          <ToolTip>Property Name</ToolTip>
          <Default>MyProperty</Default>
        </Literal>
        <Literal>
          <ID>field</ID>
          <ToolTip>Backing Field</ToolTip>
          <Default>_myproperty</Default>
        </Literal>
        <Literal>
          <ID>defaultValue</ID>
          <ToolTip>Field default value</ToolTip>
          <Default>null</Default>
        </Literal>
      </Declarations>
      <Code Language="csharp">
        <![CDATA[

    /// <summary>
    /// Field which backs the $property$ property
    /// </summary>
    private $type$ $field$ = $defaultValue$;

    public static readonly string $property$Property = "$property$";

    /// <summary>
    /// $summary$
    /// </summary>
    public $type$ $property$
    {
            get { return $field$; }
            set
            {
                    if ($field$ == value)
                            return;

                    $field$ = value;

                    OnPropertyChanged($property$Property);
            }
    }

    $end$]]>
      </Code>
    </Snippet>
  </CodeSnippet>
</CodeSnippets>
```

To use this snippet declaratively we need an attribute which has the properties, i.e.
type, property, field and defaultValue. There are a number of technologies that could
be used to perform this transformation, for example, you could use Linq to XML to query
the above XML, and construct an attribute (as a string) programmatically. However, I
personally favour XSLT whenever I need to transform XML documents because the templated
approach makes it much easier to visualise the output of the transformation. XSLT is
most often used for XML to XML transformation, although by setting the
"output method" you can transform XML into any
form of text-based output. For example, you can use it to transform XML into SQL, C# or
CSV, it really is a powerful language!  
  
The following simple XSLT document transforms a codesnippet into an attribute:

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:s="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet"
    exclude-result-prefixes="msxsl">
  <xsl:output method="text"/>

  <xsl:template match="/">
using System;

namespace Snippets
{
    <xsl:apply-templates select="//s:CodeSnippet"/>
}
  </xsl:template>

  <!-- matches a CodeSnippet element generating an attribute -->
  <xsl:template match="s:CodeSnippet">
    /// &lt;summary&gt;
    /// <xsl:value-of select="s:Header/s:Description"/>
    /// &lt;/summary&gt;
    [AttributeUsage(AttributeTargets.Class , AllowMultiple = true)]
    public class Snippet<xsl:value-of select="s:Header/s:Shortcut"/>  : Attribute
    {
    <!-- generate the attribute properties -->
    <xsl:apply-templates select="//s:Declarations/s:Literal"/>
    <!-- add the snippet code to the attribute -->
    <xsl:apply-templates select="//s:Code"/>
    }
  </xsl:template>

  <!-- generates a string property for codesnippet literal -->
  <xsl:template match="s:Literal">
        /// &lt;summary&gt;
        /// <xsl:value-of select="s:ToolTip"/>
        /// &lt;/summary&gt;
        public string <xsl:value-of select="s:ID"/> = "<xsl:value-of select="s:Default"/>";
  </xsl:template>

  <xsl:template match="s:Code">
    <!-- escape any quotes in the snippet -->
    <xsl:variable name="escaped">
      <xsl:call-template name="escapeQuot">
        <xsl:with-param name="text" select="."/>
      </xsl:call-template>
    </xsl:variable>

    <!-- add a method that returns the snippet -->
    /// &lt;summary&gt;
    /// Gets the code snippet
    /// &lt;/summary&gt;
    public string GetSnippet()
    {
    return @"<xsl:value-of select="$escaped" />";
    }
  </xsl:template>

  <!-- relpaces single quotes with double-quotes -->
  <xsl:template name="escapeQuot">
    <xsl:param name="text"/>
    <xsl:choose>
      <xsl:when test="contains($text, '&quot;')">
        <xsl:variable name="bufferBefore" select="substring-before($text,'&quot;')"/>
        <xsl:variable name="newBuffer" select="substring-after($text,'&quot;')"/>
        <xsl:value-of select="$bufferBefore"/>
        <xsl:text>""</xsl:text>
        <xsl:call-template name="escapeQuot">
          <xsl:with-param name="text" select="$newBuffer"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>
```

The transform above is really quite simple, the first template matches the document
root, outputting a namespace and using statement. Any child `CodeSnippet`
elements are selected in order to output their transformed content within the scope of
the namespace. Note that because the `CodeSnippets` xml file has a default
namespace applied via an xmlns attribute, we must prefix the element names with the
same namespace in order to successfully match them.  
  
The template which matches the `CodeSnippet` element outputs the attribute
class and selects the XPath
`â€œ//s:Declarations/s:Literalâ€` which matches
a nodeset with a node for each Literal element in the snippet XML document, i.e. the
properties of the snippet. The template also selects the element which contains the
snippet code itself.  
  
As you can see the XSLT approach is quite elegant; you provide discrete templates each
of which transform an XML node into the desired target format. The structure of the
output is clearly visible, being reproduces directly in this XSLT file. The templates
are connected together by the apply-templates elements which define the next nodeset to
match as an XPath query.  
  
The only part of the above XSLT which is a bit ugly is the code which escapes the
quotes in the code defined within the codesnippet so that it can be included within a
C# verbatim string. XSLT is great at transforming the structure of XML documents, but
not so good at transforming the content. A simple find and replace on a string required
recursion as you can see in the `escapeQuote` template in the above
example.  
  
The result of running this XSLT transformation with the above codesnippet as the input
is the following attribute:

```csharp
using System;

namespace Snippets
{

  /// <summary>
  /// Code snippet for a property which raises INotifyPropertyChanged
  /// </summary>
  [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
  public class SnippetPropertyINPC : Attribute
  {

    /// <summary>
    /// Property Type
    /// </summary>
    public string type = "string";

    /// <summary>
    /// Property Name
    /// </summary>
    public string property = "MyProperty";

    /// <summary>
    /// Backing Field
    /// </summary>
    public string field = "_myproperty";

    /// <summary>
    /// Field default value
    /// </summary>
    public string defaultValue = "null";

    /// <summary>
    /// Gets the code snippet
    /// </summary>
    public string GetSnippet()
    {
      return @"

    /// <summary>
    /// Field which backs the $property$ property
    /// </summary>
    private $type$ $field$ = $defaultValue$;

    public static readonly string $property$Property = ""$property$"";

    /// <summary>
    /// Gets / sets the $property$ value
    /// </summary>
    public $type$ $property$
    {
            get { return $field$; }
            set
            {
                    if ($field$ == value)
                            return;

                    $field$ = value;

                    OnPropertyChanged($property$Property);
            }
    }
    $end$";
    }

  }

}
```

With the above XSLT it is possible to generate a corresponding attribute for any
codesnippet.

## Automated snippet generation with T4

You could manually execute the above XSLT each time you want to generate an
attribute, however, it would make life easier if you could simply drop a .snippet file
into your project and have the attribute generated automatically.  
  
As an aside, I originally investigated whether it would be possible to locate all a
user"s codesnippet via the Visual Studio APIs. However, each user
typically has their own set of snippets defined causing issues if code is shared
between users. I decided that a better approach would be to require that a snippet is
added to a project so that you can ensure that everyone who works on the project shares
the same snippet code.  
  
In the example project, if you add a snippet into the Snippets folder then click the
button indicated to run all the T4 templates, you will find that a corresponding C#
file is generated with the output of the XSLT transform described in the previous
section.

![SnippetGeneration2.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/SnippetGeneration2.png)

To achieve this, I make use of Env.DTE which is an API for Visual Studio automation.
This API allows you to explore a Visual Studio project, locating the classes and other
files it contains. I have found it to be a great tool to use in conjunction with T4, as
have other. See for example Daniel Vaughan"s excellent article which
describes a technique for [generating class metadata](http://www.codeproject.com/KB/codegen/T4Metadata.aspx) (e.g.
property names etc...) using T4 & Env.DTE.  
  
I have created my own set of utilities which allow you to execute Linq-style queries in
order to search your project files / classes. I will not go into the details here, for
more details please refer to my [earlier article on dependency property code generation](http://www.scottlogic.co.uk/blog/colin/2009/08/declarative-dependency-property-definition-with-t4-dte/).  
  
The T4 template below finds the Env.DTE Project that this template resides within, then
queries all the ProjectItems to find those that have the extension .snippet. It then
executes the `GenerateAttributes` method, which runs the XSLT transform
adding the generated output to the project:

```
<#@ template language="C#" hostSpecific="true" debug="true" #>
<#@ output extension="cs" #>
<#@ include file="Util.tt" #>
<#@ include file="EnvDTE.tt" #>
<#

var project = FindProjectHost();

// capture the generated output so far, and use for each class file
Includes = this.GenerationEnvironment.ToString();
this.GenerationEnvironment.Remove(0, this.GenerationEnvironment.Length);

// generate the snippet attributes
GenerateAttributes(project);

#>
<#+

/// <summary
/// Generates attributes for all codesnippets within the given project.
/// </summary>
public void GenerateAttributes(Project project)
{
  // extract the path
  int lastSlash = project.FileName.LastIndexOf(@"\");
  string projectPath = project.FileName.Substring(0,lastSlash);

  // find all the ProjectItems which are code snippets
  var snippets = GetProjectItems(project).Where(item => item.FileNames[0].EndsWith("snippet"));

  // apply the XSLT file which generates attributes
  foreach(ProjectItem item in snippets)
  {
    string filename = item.FileNames[0];
    string attributeFilename = filename.Substring(0, filename.Length - 8) + ".cs";
    RunTransform(projectPath + @"\CodeGen\SnippetToAttribute.xslt",
                filename, attributeFilename, project);
  }
}
#>
```

The code for `RunTransform` is given below, it is another utility method
that I have used in a few Env.DTE/T4 projects:

```csharp
/// <summary
/// Executes the given transform on the given source, adding the
/// generated output to the given project.
/// </summary>
public void RunTransform(string transformPath, string sourcePath,
        string outputPath, Project project)
{

  XslCompiledTransform transform = new XslCompiledTransform();
  transform.Load(transformPath);

  XDocument source = XDocument.Load(sourcePath);

  StringWriter strWriter = new StringWriter();
  var args = new XsltArgumentList();
  transform.Transform(source.CreateReader(), args, strWriter);

  WriteLine(strWriter.ToString());

  SaveOutput(outputPath, project);
}

/// <summary
/// Adds the given file to the given project.
/// </summary>
public void SaveOutput(string outputFileName, Project project)
{
  // write all of the generated output to a file
  string templateDirectory = Path.GetDirectoryName(Host.TemplateFile);
  string outputFilePath = Path.Combine(templateDirectory, outputFileName);
  File.WriteAllText(outputFilePath, this.GenerationEnvironment.ToString());

  // clear the generated output
  this.GenerationEnvironment.Remove(0, this.GenerationEnvironment.Length);

  // add to the project
  project.ProjectItems.AddFromFile(outputFilePath);
}
```

The `SaveOutput` method is also a useful addition to the toolbox, it
saves the output of a T4 template into a file and adds it to the project. It is very
useful for templates that generate multiple classes, allowing you to split them across
multiple files.

![gears2.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/gears2.jpg)

[Image from Flickr under CC licence from [RogueSun Media](http://www.flickr.com/photos/shuttercat7/)]

## From Attributes to Code!

### Declarative Snippets

We"ll start with a simple example, a class that implements
`INotifyPropertyChanged` and has a single property that raises the
`PropertyChanged` event from its setter. We"ll use the
`SnippetPropertyINPC` from the previous section, and also add a snippet for
the implementation of `INotifyPropertyChanged` itself. The following snippet
is added to the project:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <CodeSnippet Format="1.0.0">
    <Header>
      <Title>Implementation of INotifyPropertyChanged</Title>
      <Shortcut>INotifyPropertyChanged</Shortcut>
      <Description>Implementation of INotifyPropertyChanged</Description>
      <Author>Colin Eberhardt</Author>
      <SnippetTypes>
        <SnippetType>Expansion</SnippetType>
      </SnippetTypes>
    </Header>
    <Snippet>
      <Code Language="csharp">
        <![CDATA[
    #region INotifyPropertyChanged Members

    /// <summary>
    /// Occurs when a property changes
    /// </summary>
    public event PropertyChangedEventHandler  PropertyChanged;

    /// <summary>
    /// Raises a PropertyChanged event
    /// </summary>
    protected void OnPropertyChanged(string property)
    {
            if (PropertyChanged != null)
            {
                    PropertyChanged(this, new PropertyChangedEventArgs(property));
            }
    }

    #endregion
    $end$]]>
      </Code>
    </Snippet>
  </CodeSnippet>
</CodeSnippets>
```

Which, when the T4 templates are run, generates the following attribute:

```csharp
/// <summary>
/// Implementation of INotifyPropertyChanged
/// </summary>
[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class SnippetINotifyPropertyChanged : Attribute
{

  /// <summary>
  /// Gets the code snippet
  /// </summary>
  public string GetSnippet()
  {
    return @"
#region INotifyPropertyChanged Members

/// <summary>
/// Occurs when a property changes
/// </summary>
public event PropertyChangedEventHandler  PropertyChanged;

/// <summary>
/// Raises a PropertyChanged event
/// </summary>
protected void OnPropertyChanged(string property)
{
    if (PropertyChanged != null)
    {
        PropertyChanged(this, new PropertyChangedEventArgs(property));
    }
}

#endregion
$end$";
  }

}
```

We can then use these attributes to "declare"
that a class implements `INotifyPropertyChanged` and has a property that
raises this event:

```csharp
[SnippetINotifyPropertyChanged]
[SnippetPropertyINPC(field = "_height", type = "int", property = "Height", defaultValue = "1")]
public partial class SomeViewModel : INotifyPropertyChanged
{
  public SomeViewModel()
  {
  }
}
```

 Note that this is a partial class, a language feature
which Visual Studio uses extensively for keeping designer generated code separate from
our own code. Here is it being used so that we can generate another partial counterpart
to the class above, with the code that corresponds to the attributes. It is also
possible to have more than two partial definitions of a class, allowing you to use this
code generation technique with classes that already have a designer generated
counterpart.  
  
In the next section we"ll see how the code generation works...

### Generating the Code

We"ll use the techniques described above,
Linq-to-Env.DTE, to locate the classes within our project that have one or more of our
snippet attributes associated with them.

```
<#@ template language="C#" hostSpecific="true" debug="true" #>
<#@ output extension="cs" #>
<#@ import namespace="System.Text.RegularExpressions"#>
<#@ include file="Util.tt" #>
<#@ include file="EnvDTE.tt" #>
<#@ include file="Includes.tt" #>
<#

var project = FindProjectHost();

// capture the generated output so far, and use for each class file
Includes = this.GenerationEnvironment.ToString();
this.GenerationEnvironment.Remove(0, this.GenerationEnvironment.Length);

int lastSlash = project.FileName.LastIndexOf(@"\");
string projectPath = project.FileName.Substring(0,lastSlash);

AllElements = GetProjectItems(project).SelectMany(item => GetCodeElements(item)).ToList();

// iterate over the files in the project
foreach(ProjectItem projectItem in GetProjectItems(project))
{
  // find any classes that have a 'snippet' attribute
  var classes = GetCodeElements(projectItem)
                    .Where(el => el.Kind == vsCMElement.vsCMElementClass)
                    .Cast<CodeClass>()
                    .Where(cl => Attributes(cl).Any(at => at.Name.StartsWith("Snippet")));

  foreach(var clazz in classes)
  {
    // generate the snippet
    GenerateClass(clazz);
    SaveOutput(projectPath + @"\CodeGen\Generated\" + projectItem.Name, project);
  }
}

#>
<#+

public List<CodeElement> AllElements { get; set; }

public string Includes { get; set; }

#>
```

The T4 template above first captures the output of
`Includes.tt` into a string, this is used to add the
"using" section to that start of each of our
generated files. This is followed by a Linq query that locates any class that has any
attributes that start with the text "Snippet".
For each of these, the method `GenerateClass` is invoked. The generated
output is then captured and saved to a file using the utility method
`SaveOutput` described earlier which saves to a file and adds it to the
project.  
  
The `GenerateClass` method adds the boiler plate stuff, the namespace,
partial class and then iterates over all the snippet attributes,
invoking the `GenerateSnippet` method for each:

```
<#+
/// <summary
/// Generates a class with snippets
/// </summary>
private void GenerateClass(CodeClass clazz)
{
  string classNamespace = clazz.Namespace.Name;
  string className =  clazz.FullName.Substring(clazz.FullName.LastIndexOf(".")+1);
  string classVisiblity = GetClassVisiblityString(clazz);
  #>

<#= Includes #>
namespace <#= classNamespace #>
{
  <#= classVisiblity #> partial class <#= className #>
  {
  <#+
    // iterate over all the 'snippet' attributes
    var attributes = Attributes(clazz).Where(at => at.Name.StartsWith("Snippet"));
    foreach(var attribute in attributes)
    {
      GenerateSnippet(attribute);
    }
  #>
  }
}
  <#+
}
#>
```

The `GenerateSnippet` method is where the fun
begins:

```
<#+
/// <summary
/// Generates the given snippet
/// </summary>
private void GenerateSnippet(CodeAttribute attribute)
{
  // locate the attribute class
  CodeClass attributeClass = AllElements.Where(el => el.Kind == vsCMElement.vsCMElementClass)
                        .Cast<CodeClass>()
                        .Where(d => d.Name==attribute.Name).First();

  var snippetFields = Members(attributeClass).Where(m => m.Kind == vsCMElement.vsCMElementVariable);

  var values = new Dictionary<string, string>();
  foreach(CodeElement field in snippetFields)
  {
    var text = GetElementText(field);

    // extract the default values from the snippet attribute
    Regex regex = new Regex("= \"(.*?)\"");
    Match match = regex.Match(text);
    var defaultValue = match.Groups[1].Value;
    values[field.Name] = defaultValue;

    // extract instance values from the CodeAttribute
    regex = new Regex(field.Name + @"\s*=\s*(@""(?:[^""]|"""")*""|""(?:\\.|[^\\""])*"")");
    match = regex.Match(attribute.Value);
    if (match.Success)
    {
      string literalValue = match.Groups[1].Value;
      if (!literalValue.StartsWith("@"))
      {
        literalValue = literalValue.Substring(1, literalValue.Length - 2);
        values[field.Name] = StringFromCSharpLiteral(literalValue);
      }
      else
      {
        literalValue = literalValue.Substring(2, literalValue.Length - 3);
        values[field.Name] = StringFromVerbatimLiteral(literalValue);
      }
    }
  }

  // extract the snippet
  var snippetMethod = Members(attributeClass).Where(m => m.Name=="GetSnippet").Single();
  var snippetText = GetElementText(snippetMethod);
  var firstQuote = snippetText.IndexOf("\"");
  var lastQuote = snippetText.IndexOf(@"$end$");
  snippetText = snippetText.Substring(firstQuote + 1, lastQuote - firstQuote - 1);
  snippetText = snippetText.Replace("\"\"", "\"");

  foreach(var value in values)
  {
    snippetText = snippetText.Replace("$"+value.Key+"$", value.Value);
  }

  #><#=snippetText#><#+
}
#>
```

This method locates the attribute itself then uses Linq to
extract the fields for the snippet. For each field, we extract the default value from
the attribute. This makes use of the following Env.DTE utility method that captures the
text for a `CodeElement`:

```csharp
<#+
/// <summary>
/// Extracts the code that the given element represents
/// </summary>
public string GetElementText(CodeElement element)
{
    var sp = element.GetStartPoint();
    var ep = element.GetEndPoint();
    var edit = sp.CreateEditPoint();
    return edit.GetText(ep);
}
#>
```

The following regular expression is used to extract field
instance values from the attribute associated with the class:

```csharp
field.Name + @""(?:[^""]|"""")*""|""(?:\\.|[^\\""])*"")"
```

The above expression matches both string literals and verbatim strings, and yes, I did
need a bit of help to find the right expression ([thank
you StackOverflow!](http://stackoverflow.com/questions/4953737/regex-for-matching-c-string-literals)). If the expression matches, the methods
`StringFromCSharpLiteral` or `StringFromVerbatimLiteral` are used
to extract the value, by parsing the escaped string, to give the same result that the
compiler would in interpreting the field value. Again, my thanks go to [Google
and Istvan](http://dotneteers.net/blogs/divedeeper/archive/2008/08/03/ParsingCSharpStrings.aspx) for those useful methods!

Finally, the snippet itself is extracted from the attributes
GetSnippet method, and the field tokens within the snippet are replaced.  
  
Revisiting our class:

```
[SnippetINotifyPropertyChanged]
[SnippetPropertyINPC(field = "_height", type = "int", property = "Height", defaultValue = "1")]
public partial class SomeViewModel : INotifyPropertyChanged
{
  public SomeViewModel()
  {
  }
}
```

When the T4 templates are executed, the following partial class is generated:

Finally, the snippet itself is extracted from the attributes `GetSnippet` method, and
the field tokens within the snippet are replaced.

Revisiting our class:

```csharp
[SnippetINotifyPropertyChanged]
[SnippetPropertyINPC(field = "_height", type = "int", property = "Height", defaultValue = "1")]
public partial class SomeViewModel : INotifyPropertyChanged
{
  public SomeViewModel()
  {
  }
}
using System.ComponentModel;

namespace CodeSnippetAutomation
{
  public partial class SomeViewModel
  {

    #region INotifyPropertyChanged Members

    /// <summary>
    /// Occurs when a property changes
    /// </summary>
    public event PropertyChangedEventHandler PropertyChanged;

    /// <summary>
    /// Raises a PropertyChanged event
    /// </summary>
    protected void OnPropertyChanged(string property)
    {
      if (PropertyChanged != null)
      {
        PropertyChanged(this, new PropertyChangedEventArgs(property));
      }
    }

    #endregion

    /// <summary>
    /// Field which backs the Height property
    /// </summary>
    private int _height = 1;

    public static readonly string HeightProperty = "Height";

    /// <summary>
    /// Gets / sets the Height value
    /// </summary>
    public int Height
    {
      get { return _height; }
      set
      {
        if (_height == value)
          return;

        _height = value;

        OnPropertyChanged(HeightProperty);
      }
    }
  }
}
```

Note that the snippet for
`INotifyPropertyChanged` adds the event and a protected method for invoking
the event, however it does not add the interface to the class that is generated.
Therefore we have to add the interface to our class manually. However, it is perfectly
acceptable to indicate that a class implements a certain interface whilst having the
interface implementation in a partial counterpart.

## Making Snippets Code-Generation Friendly

Sometimes we have to modify codesnippets a little in order
to make them suitable for code-generation. One of the main reasons for doing this is
that if we generate code from a snippet, we cannot
"tweak" the output because this will be
overwritten next time the code is generated. For example, with manual snippets you will
probably find yourselves tailoring the generated code, tweaking it a little bit, to
suite the specific purpose. With code-generation, each generated
"instance" must be the same.  
  
If we take the example detailed above, a snippet for generating a property that raises
change notifications, it is a common requirement that some code is executed when this
property changes. With regular, manual snippets, we would just edit the generated
output. In order to support this requirement with code-generation, we must build in
extension points into our snippet code.  
  
Fortunately partial methods have a useful trick up their sleeves - partial methods. A
partial method is a void method defined in a partial class, but with no implementation.
You can then optionally provide an implementation for this partial method in one of the
other partial class counterparts. Note, this is entirely optional - it is not an
interface-style contract. If an implementation of the partial method is not supplied,
the compiler actually removes the call to the partial method, hence the reason why
partial methods must be void.  
  
We can modify the snippet as follows:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <CodeSnippet Format="1.0.0">
    ...
    <Snippet>
      ...
      <Code Language="csharp">
        <![CDATA[

    /// <summary>
    /// Field which backs the $property$ property
    /// </summary>
    private $type$ $field$ = $defaultValue$;

    public static readonly string $property$Property = "$property$";

    /// <summary>
    /// $summary$
    /// </summary>
    public $type$ $property$
    {
      get { return $field$; }
      set
      {
        if ($field$ == value)
          return;

        $field$ = value;

        On$property$Changed(value);

        OnPropertyChanged($property$Property);
      }
    }

    /// <summary>
    /// Invoked when the value of $property$ changes
    /// </summary>
    partial void On$property$Changed($type$ value);
    $end$]]>
      </Code>
    </Snippet>
  </CodeSnippet>
</CodeSnippets>
```

This means that we can now add code to our class which has declarative snippet
generation as follows:

```csharp
[SnippetINotifyPropertyChanged]
[SnippetPropertyINPC(field ="_foo", property ="Foo", defaultValue = "\"FOO\"")]
public partial class SomeOtherViewModel
{
  partial void OnFooChanged(string value)
  {
    // invoked when the Foo property changes
  }
}
```

This means that we can now add code to our class which has
declarative snippet generation as follows:

![gears3.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/gears3.jpg)

[Image from Flickr under CC licence from [MrB-MMX](http://www.flickr.com/photos/marlon-bunday-mmx/)]

## A Detailed Example

The previous sections have described the technologies and
mechanisms that make declarative code snippet automation work. In this section, I will
put these mechanisms into practice with a real-world example. Rather than create some
example project using code-generation techniques I thought it would be more informative
to start with an existing project which has a much larger codebase than a fabricated
example would. The project I chose was
"SilverTrack", a Silverlight based [telemetry application
published here on codeproject](http://www.codeproject.com/KB/silverlight/SilverTrack.aspx). SilverTrack uses the Model-View-ViewModel UI
pattern, which often results in quite a bit of boiler-plate code. It also makes use of
custom-controls and user-controls, again adding further boiler-plate code.  
  
The first step towards code-generation is to add the `CodeGen` folder which
adds the various templates to the project. I also added the codesnippets described
earlier in this article. There is one further snippet
`"dp.snippet"` for dependency
properties which will be described later.

![SilverTrackProject.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/SilverTrackProject.png)

SilverTrack has a number of `ViewModel` classes,
each containing numerous properties with change notification. Starting with
`TelemetryChannelViewModel`, I removed six of the properties and replaced
them with snippet attributes. I also removed the reference to the
"base" view model, which simply implements
`INotifyPropertyChanged`, replacing this with a suitable snippet (this give
you the freedom to create a more meaningful inheritance hierarchy).  
  
Two of the properties had logic within their setters, this is replaced by partial
methods as shown below:

```csharp
[SnippetINotifyPropertyChanged]
[SnippetPropertyINPC(property="SelectedSecondaryIndex", type="int", field="_selectedSecondaryIndex", defaultValue="1",
  summary="The Index of the selected series in the secondary combo box.")]
[SnippetPropertyINPC(property="SelectedPrimaryIndex", type="int", field="_selectedPrimaryIndex", defaultValue="1",
  summary="The Index of the selected series in the primary combo box.")]
[SnippetPropertyINPC(property="Behaviour", type="BehaviourManager", field="_behaviour",
  summary="The Behaviour Manager which contains the trackball and the XAxisZoomBehaviour.")]
[SnippetPropertyINPC(property="XAxisVisible", type="bool", field="_xAxisVisibile", defaultValue="false",
  summary="Whether this chart's X-Axis is visible.")]
[SnippetPropertyINPC(property="LivePrimaryChartDataSeries", type="DataSeries<DateTime, double>", field="_livePrimaryData",
  summary="The Live Updating DataSeries that is always displayed on the chart's primary y-axis.")]
[SnippetPropertyINPC(property="LiveSecondaryChartDataSeries", type="DataSeries<DateTime, double>", field="_liveSecondaryData",
  summary="The Live Updating DataSeries that is always displayed on the chart's secondary y-axis.")]
public partial class TelemetryChannelViewModel : INotifyPropertyChanged
{

    #region partial methods

    partial void OnSelectedSecondaryIndexChanged(int value)
    {
      ModifySecondaryChannel(ParentTelemetryViewModel.Channels[SelectedSecondaryIndex]);
    }

    partial void OnSelectedPrimaryIndexChanged(int value)
    {
      ModifyPrimaryChannel(ParentTelemetryViewModel.Channels[SelectedPrimaryIndex]);
    }

    #endregion

    ...

}
```

The net result of the above is to remove much of the
un-interesting boiler-plate code, with the code-generation creating a corresponding
partial class as shown below. The generated class contains 229 lines of code, which is
pretty good for 13 lines of attribute definitions and is of course much better for
future refactoring and maintenance.

![SilverTrackProject2.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/SilverTrackProject2.png)

SilverTrack also contain a number of controls which define
dependency properties. The WPF / Silverlight dependency property syntax is highly
verbose and is what spurned me to create my original non-snippet based code-generation
approach.  
  
A suitable snippet for dependency properties is shown below:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<CodeSnippets  xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <CodeSnippet Format="1.0.0">
    <Header>
      <Title>Defines a DependencyProperty</Title>
      <Shortcut>DependencyProperty</Shortcut>
      <Description>Defines a DependencyProperty</Description>
      <Author>Colin Eberhardt</Author>
      <SnippetTypes>
        <SnippetType>Expansion</SnippetType>
      </SnippetTypes>
    </Header>
    <Snippet>
      <Declarations>
        <Literal>
          <ID>type</ID>
          <ToolTip>Property Type</ToolTip>
          <Default>string</Default>
        </Literal>
        <Literal>
          <ID>summary</ID>
          <ToolTip>Summary Documentation</ToolTip>
          <Default>Gets / sets the property value</Default>
        </Literal>
        <Literal>
          <ID>property</ID>
          <ToolTip>Property Name</ToolTip>
          <Default>MyProperty</Default>
        </Literal>
        <Literal>
          <ID>containerType</ID>
          <ToolTip>Containing type</ToolTip>
          <Default>Control</Default>
        </Literal>
        <Literal>
          <ID>defaultValue</ID>
          <ToolTip>Property default value</ToolTip>
          <Default>null</Default>
        </Literal>
      </Declarations>
      <Code Language="csharp">
        <![CDATA[
    /// <summary>
    /// $summary$ This is a dependency property
    /// </summary>
    public $type$ $property$
    {
        get { return (double)GetValue($property$Property); }
        set { SetValue($property$Property, value); }
    }

    /// <summary>
    /// Defines the $property$ dependnecy property.
    /// </summary>
    public static readonly DependencyProperty $property$Property =
        DependencyProperty.Register("$property$", typeof($type$), typeof($containerType$),
            new PropertyMetadata($defaultValue$, new PropertyChangedCallback(On$property$PropertyChanged)));

    /// <summary>
    /// Invoked when the $property$ property changes
    /// </summary>
    partial void On$property$PropertyChanged(DependencyPropertyChangedEventArgs e);

    private static void On$property$PropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        $containerType$ control = d as $containerType$;
        control.On$property$PropertyChanged(e);
    }

    $end$]]>
      </Code>
    </Snippet>
  </CodeSnippet>
</CodeSnippets>
```

Taking the `GForceControl` as an example, this
control defines two dependency properties. These can now be replaced by the following
attributes and partial methods which are invoked on property change:

```csharp
[SnippetDependencyProperty(property = "Lateral", type = "double", containerType = "GForceControl",
  summary = "Lateral G-Force", defaultValue = "0.0")]
[SnippetDependencyProperty(property = "Long", type = "double", containerType = "GForceControl",
  summary = "Longitudinal G-Force", defaultValue = "0.0")]
public partial class GForceControl : Control
{

  /// <summary>
  /// Sets the gPoint's X Value to the Lateral Value, if gPoint is not null.
  /// </summary>
  partial void OnLateralPropertyChanged(DependencyPropertyChangedEventArgs e)
  {
    if (gPoint != null)
      gPoint.X = Lateral;
  }

  /// <summary>
  /// Sets the gPoint's Y Value to the Long Value, if gPoint is not null.
  /// </summary>
  partial void OnLongPropertyChanged(DependencyPropertyChangedEventArgs e)
  {
    if (gPoint != null)
      gPoint.Y = Long;
  }

  ...
}
```

The dependency property code-snippet generates code which contains
`DependencyObject` and other classes from the `System.Windows`
namespace. Therefore, the `Includes.tt` template which contains code which
is added to the top of every generated class is updated to include these
namespaces:

```csharp
<#@ template language="C#" #>

<# // the following template outputs code that is added to the start of every generated file #>
using System.ComponentModel;
using Visiblox.Charts;
using System.Windows;
using System;
```

Running the T4 templates results in the generation of a 73 line generated class
containing the dependency property boiler-plate code:

![SilverTrackProject3.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/SilverTrackProject3.png)

## Conclusions

I had a lot of fun developing this technique and putting
together this article. It uses an interesting mix of technologies, Linq, XML, Env.DTE
and T4 to create something which I think is genuinely very useful. Boiler-plate code is
the bane of every programmer"s life, it slows us down when we
initially write our code, it hampers readability, and slows us down further if we have
to refactor in the future.  
  
In this article I have illustrated how a declarative approach to code generation
removes all the boiler-plate code associated with properties raising change
notification, dependency property definitions and the implementation of
`INotifyPropertyChanged`. This leaves us with a simple declaration of a
classes capabilities. However, these are just a few examples, there is much more
boiler-plate code out there ... most design or architectural patterns involve a certain
amount of boiler-plate.  
  
I hope you have found this article interesting and useful. Even if you do not use the
codesnippet automation technique it describes, perhaps you will find some other novel
use for T4 + Env.DTE, a very interesting technology pairing.  
  
The sourcecode download for this article contains two projects; the first is a minimal
example with a couple of trivial classes just to show the basic principles. The second
is SilverTrack where the technique is used more extensively in a real-world
application.
