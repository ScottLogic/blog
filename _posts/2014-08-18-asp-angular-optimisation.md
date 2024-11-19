---
title: Asp.Net bundling of Angular templates
date: 2014-08-18 00:00:00 Z
categories:
- Tech
author: alee
summary: How to use Asp.Net's built-in bundling and optimisation feature to optimise
  AngularJS templates
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/08/18/asp-angular-optimisation.html
disqus-id: "/2014/08/18/asp-angular-optimisation.html"
---

How to use Asp.Net's built-in bundling and optimisation feature to optimise AngularJS templates.

A core feature of [AngularJS](https://angularjs.org/) is the ability to put HTML templates in partial template files, and have Angular load them on demand and add them to the DOM, as shown in the tutorial: [Routing & Multiple Views](https://docs.angularjs.org/tutorial/step_07).

For example, I could define a route so that when a user navigates to `#/investment/3`, Angular loads the necessary template and renders the view with the associated controller like this:

    {% highlight js %}
    angular.module('testSPA', [
        'ngRoute',
        'testSPA.investmentPage'
    ]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/investment/:id', {
            templateUrl: 'partials/investment-page.html',
            controller: 'InvestmentPageCtrl' });
    }]);
{% endhighlight %}

Templates are an essential part of any large Single Page Application, since trying to put all the HTML in a single file is simply unworkable. Templates aren't just limited to one-per-page, but can be used to define components within a page. This leads to another problem, which is that the page will have to make multiple server requests just to get the HTML content. For example, if my home page is a dashboard-style layout with five components, it has to make seven requests to get the HTML (one for the SPA container, one for the page template, then one each for the components).

Asp.Net has a built in Bundling and Optimisation feature that bundles together multiple JavaScript or Css files into a single minified download. Can we do the same thing with Angular templates?

### Asp.Net Bundling

As a quick overview of Asp.Net bundling, here's how I've configured bundling for my JavaScript and Css files:

    {% highlight c# %}
    public static void RegisterBundles(BundleCollection bundles)
    {
        // Bundle 3rd-party tools
        bundles.Add(new ScriptBundle("~/bundles/tools").Include(
            "~/Scripts/angular.js",
            "~/Scripts/angular-route.js",
            "~/Scripts/jquery-{version}.js"));

        // Bundle Angular application files
        bundles.Add(new ScriptBundle("~/bundles/application")
            .IncludeDirectory("~/Scripts/app/", "*.js"));

        // Bundle css scripts
        bundles.Add(new StyleBundle("~/Content/css").Include(
            "~/Content/bootstrap.css",
            "~/Content/site.css"));

        // Enable optimisation based on web.config setting
        BundleTable.EnableOptimizations =
            bool.Parse(ConfigurationManager.AppSettings["BundleOptimisation"]);
    }
{% endhighlight %}

In the snippet above, I've created two Javascript bundles - one for tools, and another for the Angular application code. Including the whole directory is nice, because it means we no longer have to worry about adding new script tags when we add a new module to the application. There's also a CSS bundle containing two css files.

I like to leave optimisation off in the debug and test versions, for easier debugging, but switch it on for the release build for performance. This is easily done with an AppSettings switch in web.config, as shown above.

Including the `~/bundles/application` bundle is done like this:

    @Scripts.Render("~/bundles/application")


In debug mode, the files are downloaded individually and are not minified for easy debugging:

    {% highlight html %}
    <script src="/Scripts/app/app.js"></script>
    <script src="/Scripts/app/controllers.js"></script>
    <script src="/Scripts/app/directives.js"></script>
    <script src="/Scripts/app/filters.js"></script>
    <script src="/Scripts/app/investment-page.js"></script>
{% endhighlight %}

In release mode, we get a single minified download instead:

    {% highlight html %}
    <script src="/bundles/application?v=WW2Zqu4rTmvC2w8fLdK2R8aobhpR0_-6Y0_tTR9xWnE1"></script>
{% endhighlight %}


### Bundling Angular Templates

Angular has a `templateCache` object, which stores all the templates it has loaded so far. It also lets you pre-load templates into the template cache, so that's what we need to do. If we have a (very simple) `hello-world` template that looks like this:

    {% highlight html %}
    <div><span>Hello World</span></div>
{% endhighlight %}

Then to insert it into the `templateCache`, we'll need some JavaScript code like this:

    {% highlight js %}
    angular.module('angularApp').run(['$templateCache', function(t) {
        t.put('partials/hello-world', '<div><span>Hello World</span></div>');
    }]);
{% endhighlight %}

So we want to take the list of templates that we're bundling, and wrap them in the appropriate JavaScript for download as a single file. First we need an implementation of `IBundleTransform`:

    {% highlight c# %}
    public class PartialsTransform : IBundleTransform
    {
        private readonly string _moduleName;
        public PartialsTransform(string moduleName)
        {
            _moduleName = moduleName;
        }

        public void Process(BundleContext context, BundleResponse response)
        {
            var strBundleResponse = new StringBuilder();
            // Javascript module for Angular that uses templateCache 
            strBundleResponse.AppendFormat(
                @"angular.module('{0}').run(['$templateCache',function(t){{"{{"}}",
                _moduleName);

            foreach (var file in response.Files)
            {
                // Get the partial page, remove line feeds and escape quotes
                var content = File.ReadAllText(file.FullName)
                    .Replace("\r\n", "").Replace("'", "\\'");
                // Create insert statement with template
                strBundleResponse.AppendFormat(
                    @"t.put('partials/{0}','{1}');", file.Name, content);
            }
            strBundleResponse.Append(@"}]);");

            response.Files = new FileInfo[] {};
            response.Content = strBundleResponse.ToString();
            response.ContentType = "text/javascript";
        }
    }
{% endhighlight %}

Let's look at that Process function. We start with the first line of the Angular module declaration, which needs a module name so we pass that into the constructor. Next, we loop through the list of files, read in the content of each one, and wrap it in a statement to insert it into the `templateCache`. This code assumes that the templates are in the folder 'partials/'. Finally we add the terminating line of the module declaration, and update the response object.
We set `response.Files` to an empty array, which means that no file links get rendered when optimisation is switched off (in debug mode we want to dynamically download partials as normal). We set `response.Content` to the optimised file content that we want to download in release mode. We also need to tell it that the content we're returning is JavaScript.

Now I have implemented a transform, I can use it in a custom Bundle:


    {% highlight c# %}
    public class PartialsBundle : Bundle
    {
        public PartialsBundle(string moduleName, string virtualPath)
            : base(virtualPath, new[] { new PartialsTransform(moduleName) })
        {
        }
    }
{% endhighlight %}

Just like the built-in `ScriptBundle` and `StyleBundle`, we derive from `Bundle`, and use our new transform class. I've passed the name of the Angular module through as a parameter. 

Now we can add the following line to `RegisterBundles`:

    {% highlight c# %}
    bundles.Add(new PartialsBundle("testSPA", "~/bundles/partials").Include(
        "~/Partials/nav-bar.html",
        "~/Partials/home-page.html",
        "~/Partials/investment-filter.html",
        "~/Partials/investments-component.html",
        "~/Partials/sector-component.html",
        "~/Partials/transactions-component.html"));
{% endhighlight %}

I've used the name of the main application module in my Angular application ("testSPA"). If we used a new module name, we'd need to add a dependency from the application module to it, so extending an existing module avoids that problem. We can include the bundle on the page like this

    @Scripts.Render("~/bundles/partials")

And that's it. Now, when I open the application in debug mode, nothing is rendered by the `~/bundles/partials` bundle, so Angular dynamically downloads the templates. When I open it in release mode, the bundle renders like this:

    {% highlight html %}
    <script src="/bundles/partials?v=dq0i_tF8ogDVZ0X69xyBCdV2O2Qr3nCu0iVsatAzhq41"></script>
{% endhighlight %}

The content of the download is JavaScript that inserts the specified templates into the `templateCache`, so that Angular doesn't need to dynamically download them.

### Conclusion

Bundling and Optimisation are powerful features for improving the responsiveness of Asp.Net applications, without the need for a distribution build step. With a little extra effort, we've added Angular's templates to that process, and optimised six requests for HTML content into just one download.























