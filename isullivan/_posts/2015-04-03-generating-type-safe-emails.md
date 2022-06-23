---
author: isullivan
title: Generating Type-Safe Email Templates Using Single File Generators
layout: default_post
summary: >-
  This post shows how 'single file generators' can be used to generate type-safe
  email templates
disqus-id: /2015/04/03/generating-type-safe-emails.html
categories:
  - Tech
---

Sending emails or other personalised messages from an application is a very common task. This post shows how Single-File Generators (SFGs) and Visual Studio can be used to keep email templates both readable and type-safe.

## The Problem

Emails are important to get right and easy to get wrong. They are often public facing communications from your company and mistakes will reflect badly. I recently received an email from a large company that ended 'Sincerely, {3}'. It's enough to ruin the illusion of a personal email that the company's marketing team spent many man hours creating. 

An email might be written like this in C#:

{% highlight csharp %}
public string GenerateOrderEmail()
{
    var order = GetOrder();
    return "Hello " + order.Customer.Name + 
        "\r\n\r\nYour order for a " + order.Item + " was dispatched on " + order.OrderDate.ToString("dd MMM") + "." +
        "\r\nPlease allow " + DeliveryDays + " days for delivery." +
        "\r\n\r\nRegards\r\nThe Shop";
}
{% endhighlight %}

It's not particularly readable and it's definitely not maintainable. If you have to add a new line or sentence, can you be sure you have the correct number of line breaks? Have you missed a full stop? It's hard to say. This example is simpler than most real emails. A more typical example might contain hundreds of lines of HTML and would be far less readable.

## Fixing the Problem
SFGs take a single file and allow you to transform it in an arbitrary way. I want to create one that takes a readable email template and generates .NET code that I can use in an application. For example, here is the above template in a readable text file called OrderConfirmation.txt:

    Hello {string name}

    Your order for a {string productName} was dispatched on {DateTime dispatchDate:dd MMM}.
    Please allow {int deliveryDays} days for delivery.

    Regards
    The Shop

This is plain text with placeholders for variables that also contain type annotations, a much more reasonable way to store an email template. Once I've installed my SFG, I set the 'Custom Tool' property to 'EmailGenerator' (the name of my SFG) then when I save this file, OrderConfirmation.cs is automatically generated for me:

{% highlight csharp %}
public class OrderConfirmation
{
    private const string EmailTemplate = "Hello {0}\r\n\r\nYour order for a {1} was dispatched on {2:dd MMM}.\r\nPlease allow {3}" +
        " days for delivery.\r\n\r\nRegards\r\nThe Shop";

    public static string Generate(string name, string productName, System.DateTime dispatchDate, int deliveryDays)
    {
        return string.Format(EmailTemplate, name, productName, dispatchDate, deliveryDays);
    }
}
{% endhighlight %}

Now the horrible concatenated mess above has been reduced to a readable template class that can be used like so:

{% highlight csharp %}
public string GenerateOrderEmail()
{
    var order = GetOrder();
    return OrderConfirmation.Generate(order.Customer.Name, order.Item, order.OrderDate, DeliveryDays);
}
{% endhighlight %}

Readable, type-safe and maintainable!

## Creating a Single File Generator

I recently installed [Visual Studio Community 2013](https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx). It isn't as 'stripped back' as the 'express' editions. It's another great move towards making the .NET stack more accessible and appealing to the open source community.

The express editions do not allow you to target the Visual Studio SDK but the community (and paid) editions can. This means it's possible to write Visual Studio plugins without spending a penny. To create a plugin containing an SFG, I installed the Visual Studio SDK and created a new project using the template 'Visual Studio Package'. When the project is built, a '.visx' file is generated that I can use to install my plugin.

Most SFG tutorials state you should implement `IVsSingleFileGenerator` and register your generator in the registry. This solution works however it is very low-level. If you implement `IVsSingleFileGenerator` directly you will have to deal with pointers and memory allocation. If I wanted to do that, I wouldn't be writing C#. Thankfully there is a class called `BaseCodeGeneratorWithSite` that implements `IVsSingleFileGenerator` and gives us a much simpler interface to work with. Here is my code generator called 'EmailGenerator':

{% highlight csharp %}
[ComVisible(true)]
[Guid("39075B09-C3F9-4DCA-BE87-C81ACFCFEDD6")]
[CodeGeneratorRegistration(typeof(EmailGenerator), "EmailGenerator", vsContextGuids.vsContextGuidVCSProject, GeneratesDesignTimeSource = true)]
[CodeGeneratorRegistration(typeof(EmailGenerator), "EmailGenerator", vsContextGuids.vsContextGuidVBProject, GeneratesDesignTimeSource = true)]
[ProvideObject(typeof(EmailGenerator))]
[ClassInterface(ClassInterfaceType.None)]
public class EmailGenerator : Microsoft.VisualStudio.TextTemplating.VSHost.BaseCodeGeneratorWithSite
{
    public override string GetDefaultExtension()
    {
        return "." + GetCodeDomProvider().FileExtension;
    }

    protected override byte[] GenerateCode(string inputFileName, string inputFileContent)
    {
        var emailTemplate = TemplateParser.ParseTemplate(inputFileContent);
        return CodeGenerator.CompileToClass(GetCodeDomProvider(), FileNamespace, Path.GetFileNameWithoutExtension(inputFileName), emailTemplate);
    }

    private CodeDomProvider GetCodeDomProvider()
    {
        IVSMDCodeDomProvider provider = SiteServiceProvider.GetService(typeof(SVSMDCodeDomProvider)) as IVSMDCodeDomProvider;
        return (CodeDomProvider)provider.CodeDomProvider;
    }
}
{% endhighlight %}

Visual Studio uses COM to communicate with the single file generator hence the need for the various attributes on the class. The interesting attribute here is `CodeGeneratorRegistration` which registers the single file generator in the registry for you. The third argument of this attribute specifies under what context the SFG works. My particular SFG can produce VB or C# source code.

`GetCodeDomProvider` gets the appropriate `CodeDomProvider` instance for a given project. If my SFG is used in a C# project, it will return an instance of `CSharpCodeProvider` and if used in a VB project it will be of type `VBCodeProvider`. I don't need to know what concrete implementation I'm using so I use the abstract `CodeDomProvider` type everywhere.

`GetDefaultExtension` returns the extension of the generated class file - '.cs' for C# and '.vb' for VB.

`GenerateCode` is where the work gets done. I use a two-step process of parsing the template into an object model and then subsequently use that object model to generate the code I need. That's all there is to it!

## Parsing a Template

I represent an email template using the following classes:

{% highlight csharp %}
public class EmailTemplate
{
    public string TemplateString { get; set; }
    public IList<TemplateParameter> Parameters { get; set; }
}

public class TemplateParameter
{
    public string Name { get; set; }
    public Type Type { get; set; }
    public string FormatString { get; set; }
}
{% endhighlight %}

A template is made up of a single template string and multiple parameters (see the generated `OrderConfirmation` class above). Each parameter has a name, type and an optional format string.

The `ParseTemplate` method takes a string and produces an instance of `EmailTemplate`. It uses a couple of regular expressions for parsing The parsing code is neither interesting nor clever but I've included it for completeness. You are encouraged to neither read nor judge it.

{% highlight csharp %}
public static class TemplateParser
{
    public static EmailTemplate ParseTemplate(string source)
    {
        var parameters = new List<TemplateParameter>();
        int index = 0;
        // Replace all {...} parameters with the parameters index eg {0}. For each parameter,
        // generarte a TemplateParameter instance.
        var templateString = Regex.Replace(source, @"\{([^\}]*)}", (match =>
        {
            var parameter = ParseTemplateParameter(match.Groups[1].Value);
            parameters.Add(parameter);
            if (string.IsNullOrWhiteSpace(parameter.FormatString))
            {
                return string.Concat("{", index++, "}");
            }
            else
            {
                return string.Concat("{", index++, ":", parameter.FormatString, "}");
            }

        }));

        return new EmailTemplate
        {
            TemplateString = templateString,
            Parameters = parameters
        };
    }

    /// <summary>
    /// Parse text of the form 'typeName parameterName:formatString' where :formatString is optional
    /// </summary>
    public static TemplateParameter ParseTemplateParameter(string source)
    {
        var match = Regex.Match(source, @"\s*(?<typeName>[^\s]+)\s*(?<parameterName>[^:]+)(:(?<formatString>.*))?");
        return new TemplateParameter
        {
            Name = match.Groups["parameterName"].Value,
            Type = GetTypeByName(match.Groups["typeName"].Value),
            FormatString = match.Groups["formatString"] != null ? match.Groups["formatString"].Value : null
        };
    }

    private static readonly Dictionary<string, string> TypeAliases = new Dictionary<string, string> {
        {"string", "System.String"},
        {"DateTime", "System.DateTime"},
        {"int", "System.Int32"},
        {"double", "System.Double"}
    };

    public static Type GetTypeByName(string typeName)
    {
        string realTypeName;
        if (TypeAliases.TryGetValue(typeName, out realTypeName))
        {
            typeName = realTypeName;
        }
        return Type.GetType(typeName);
    }
}
{% endhighlight %}

## Generating Code
The code I want to generate is of the form:

{% highlight csharp %}
public class CLASSNAME
{
    private const string EmailTemplate = "TEMPLATESTRING";

    public static string Generate(PARAMETERS)
    {
        return string.Format(EmailTemplate, PARAMETERS);
    }
}
{% endhighlight %}

The code to generate such a class is quite verbose however it is also fairly simple. `CodeDomProvider` contains methods for building a tree of all the needed parts. It also has a method to output to a `TextWriter` stream.

{% highlight csharp %}
public class CodeGenerator
{
    public static byte[] CompileToClass(CodeDomProvider codeDomProvider, string classNamespace, string className, EmailTemplate emailTemplate)
    {
        var unit = new CodeCompileUnit();

        // Namespace
        CodeNamespace generatedNamespace = new CodeNamespace(classNamespace);
        unit.Namespaces.Add(generatedNamespace);

        // Class
        var generatedClass = new CodeTypeDeclaration(className);
        generatedClass.IsClass = true;
        generatedClass.TypeAttributes = TypeAttributes.Public;
        generatedNamespace.Types.Add(generatedClass);

        // Template Constant
        CodeMemberField templateStringField = new CodeMemberField(typeof(System.String), "EmailTemplate");
        templateStringField.Attributes = MemberAttributes.Const | MemberAttributes.Private;
        templateStringField.InitExpression = new CodePrimitiveExpression(emailTemplate.TemplateString);
        generatedClass.Members.Add(templateStringField);

        // Generate Method
        var method = new CodeMemberMethod();
        method.Name = "Generate";
        method.Attributes = MemberAttributes.Public | MemberAttributes.Static;
        method.ReturnType = new CodeTypeReference(typeof(string));
        method.Parameters.AddRange(emailTemplate.Parameters.Select(p => new CodeParameterDeclarationExpression(p.Type, p.Name)).ToArray());
        var templateReference = new CodeVariableReferenceExpression("EmailTemplate");
        IEnumerable<CodeExpression> argumentReferences = emailTemplate.Parameters.Select(p => new CodeArgumentReferenceExpression(p.Name));
        CodeExpression[] formatArguments = new[] { templateReference }.Concat(argumentReferences).ToArray();

        method.Statements.Add(new CodeMethodReturnStatement(
            new CodeMethodInvokeExpression(
                new CodeTypeReferenceExpression(typeof(string)),
                "Format",
                formatArguments
            )));
        generatedClass.Members.Add(method);

        // Generate Code
        CodeGeneratorOptions options = new CodeGeneratorOptions();
        options.BracingStyle = "C";
        var memoryStream = new MemoryStream();
        using (var sourceWriter = new IndentedTextWriter(new StreamWriter(memoryStream)))
        {
            codeDomProvider.GenerateCodeFromCompileUnit(unit, sourceWriter, options);
            sourceWriter.Flush();
            return memoryStream.ToArray();
        }
    }
}
{% endhighlight %}

## Conclusion
Single File Generators provide an automated way to generate code from arbitrary input files inside Visual Studio. I used a custom templating engine however this solution could be adapted to use something more familiar such as 'Razor'. Even if you are not using Visual Studio or don't want your project to depend on a plugin, I implore you to leave large amounts of text outside of code files.























