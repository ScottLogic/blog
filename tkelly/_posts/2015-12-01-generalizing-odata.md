---
author: tkelly
title: Generalizing OData
layout: default_post
summary: >-
  OData Controllers offer an easy interface between data and your application,
  but require one controller per model type. These controllers often have a
  large amount of almost identical code. In this blog post, we look at using C#
  Generics to remove this duplication.
summary-short: Creating an OData Controller making use of Generics.
tags:
  - .net
  - odata
categories:
  - Tech
---

In this blog post, we take a look at how to create an OData controller which leverages generics to offer the same CRUD services for multiple models. The full source is available [on GitHub](https://github.com/tpkelly/generalizing-odata).

OData is a great way to wrap data sources in a standard and simple access method. It is a mature protocol, having been created by Microsoft in 2007, offering a simple abstraction layer to accessing data. It provides a common protocol for accessing any type of data source, allowing clients and data sources to be mixed and matched together, while allowing the flexibility to say how data should be sorted or filtered at request-time.

Sometimes when working with OData, each OData Controller needs to treat it's model differently and has a lot of business logic built into each controller. However sometimes, all you need to provide is a thin middle-ware abstraction between the data layer and the application. I found myself working on a problem of the latter kind recently, and thought I could save some time by building an OData Controller making use of Generics in C#. Initially I tried to find a solution via Google, but only found fixes to individual issues rather than an overall solution to the problem.

This approach works if each model in your application can be treated the same, allowing CRUD (Create, Read, Update, Delete) on each. If you want to allow Delete calls on some models but not others, you will need custom controllers for each, or an additional abstraction layer above which can handle rejecting these calls. If not, read on!

### Models and Controllers

First and foremost, we need to define a common type for our models. Certain methods are going to expect to look up data by an Id, so we need to have all models using a common type with an Id.

{% highlight csharp %}
public interface IndexedModel
{
  long Id { get; set; }
}
{% endhighlight %}

If there is no possible way for any data in your database to have 2 billion different entries over time, then you can use ```int``` here. When in doubt, ```long``` sacrifices some space for some peace of mind later. This also assumes that all of the Ids will be numerical, so will need some extra work if you have a ```Guid``` or ```String``` Id.

Next comes our controller;

{% highlight csharp %}
public class GenericController<T> : ODataController where T: class, IndexedModel
{
  ...
}
{% endhighlight %}

We allow ```T``` to be generic, but still specify that it must inherit from ```IndexedModel``` to include an ```Id``` field on it.

Now on to the CRUD methods. PUT, POST, DELETE etc. are implemented in the full source, but for now I will only cover GET.

{% highlight csharp %}
[EnableQuery]
public IQueryable<T> Get()
{
    return TableForT();
}

[EnableQuery]
public SingleResult<T> Get([FromODataUri] long key)
{
    IQueryable<T> result = Get().Where(p => p.Id == key);
    return SingleResult.Create(result);
}
{% endhighlight %}

There are a few things to note here. We use the ```[EnableQuery]``` annotation, to allow query parameters such as ```$top```, ```$skip``` and ```$filter``` to be called on the results.

In the GET by Id, we need to retrieve the "key" from the query string, using the ```[FromODataUri]```. Note that the parameter by convention must be called "key" unless the ```ODataRouteAttribute``` specifies a different value.

Finally, we have the ```TableForT()``` method.

{% highlight csharp %}
private DbSet<T> TableForT()
{
  return db.Set<T>();
}
{% endhighlight %}

This makes use of a rather clever method from ```DbContext```. ```Set<T>()``` finds the ```DbSet``` on the ```DbContext``` matching type ```T```. If ```T``` was a ```Product```, it would return the matching ```DbSet<Product>```. If there is no matching ```DbSet<T>``` an ```InvalidOperationException``` is thrown, however because of the way we are building the app this would only occur if you had a valid model which had been mapped to a valid path but had not been added to the ```DbContext```.

For now, the ```DbContext``` should like this:

{% highlight csharp %}
public class GenericContext : DbContext
{
  public GenericContext() : base("name=GenericContext") { }
  public DbSet<Product> Products { get; set; }
}
{% endhighlight %}

### Routing

If you ran the app as it is now, you will get a 403 or 404 page, as no OData routes are yet set up. We need to do something special in ```WebApiConfig.cs```, but to start with we will use a standard OData routing mechanism.

{% highlight csharp %}
public static class WebApiConfig
{
  public static void Register(HttpConfiguration config)
  {
    ODataModelBuilder builder = new ODataConventionModelBuilder();
    // All mappings of (path => model type) to be used in the app
    builder.EntitySet<Product>("Products");

    config.MapODataServiceRoute(
      routeName: "ODataRoute",
      routePrefix: null,
      model: builder.GetEdmModel());
  }
}
{% endhighlight %}

We tell the app that we're using the route "Products" to correspond to the ```Product``` model and ```DbSet<Product>``` database object on our context. However running this will give us a new error.

![No type was found that matches the controller named 'Products'.]({{ site.baseurl }}/tkelly/assets/2015-12-01-generalizing-odata/NoControllerProducts.png)

This is where the magic happens. The controller selector is used to seeing ```Product``` as a model and trying to find the ```ProductsController```, but we don't have one of those, we only have a ```GenericController<Product>``` to use.

Instead, we use our own controller selector to select the generic controller.

{% highlight csharp %}
public static void Register(HttpConfiguration config)
{
  ...
  config.Services.Replace(typeof(IHttpControllerSelector), new CustomControllerSelector(config, builder.EntitySets));
}
{% endhighlight %}

We make use of the ```EntitySets``` to find our mappings of path to model, keeping the setup for this in one place. If any more mappings are added, the correct generic controller will still be selected. Our ```CustomControllerSelector``` takes these mappings and sets itself up like so:

{% highlight csharp %}
public class CustomControllerSelector : IHttpControllerSelector
{
  private IDictionary<string, HttpControllerDescriptor> _controllerMappings;

  public CustomControllerSelector(HttpConfiguration configuration, IEnumerable<EntitySetConfiguration> entitySets)
  {
    _controllerMappings = GenerateMappings(configuration, entitySets);
  }

  private IDictionary<string, HttpControllerDescriptor> GenerateMappings(HttpConfiguration config, IEnumerable<EntitySetConfiguration> entitySets)
  {
    IDictionary<string, HttpControllerDescriptor> dictionary = new Dictionary<string, HttpControllerDescriptor>();

    foreach (EntitySetConfiguration set in entitySets)
    {
        var genericControllerDescription = new HttpControllerDescriptor(config, set.Name, typeof(GenericController<>).MakeGenericType(set.ClrType));
        dictionary.Add(set.Name, genericControllerDescription);
    }

    return dictionary;
  }

  ...
}
{% endhighlight %}

The important part here is the ```typeof().MakeGenericType()```. This lets us create a ```GenericController``` for each model in our mapping, which is then stored against the corresponding path for the model.

With this in place, the two required methods for ```IHttpControllerSelector``` become trivial:

{% highlight csharp %}
public class CustomControllerSelector: IHttpControllerSelector
{
  ...

  public HttpControllerDescriptor SelectController(HttpRequestMessage request)
  {
    var path = request.RequestUri.LocalPath.Split('/','(');
    return _controllerMappings[path[1]];
  }

  public IDictionary<string, HttpControllerDescriptor> GetControllerMapping()
  {
    return _controllerMappings;
  }
}
{% endhighlight %}

With this in place, our Generic OData Controller is complete. You should be able to fire it up and make GET requests against "/Products" to fetch values from the database, and "/Products(1)" to get a specific entry from the database. If you got stuck anywhere along the way, the [full source](https://github.com/tpkelly/generalizing-odata) is also available.

__Tom__
