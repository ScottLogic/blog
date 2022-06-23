---
author: isullivan
title: What Makes a Good CMS?
layout: default_post
summary: >-
  Code quality is important in large systems and web sites are no exception.
  This post shows how Umbraco enables developers to write clean and maintainable
  code.
disqus-id: /2015/07/31/what-makes-a-good-cms.html
categories:
  - Tech
---

Content management systems (CMSs) provide a separation between content and code. This allows, among other things, non-programmers to create and maintain website content. This post demonstrates how the open source .NET CMS [Umbraco](http://umbraco.com/) can be used to create a complex website while maintaining a clean code base.

CMSs solve a common problem therefore there are hundreds of different ones to choose from. Having such a large selection is both a blessing and a curse; by what criteria do you choose?

When CMSs are compared, it is often by feature set. This is a reasonable way to make a decision, but up to a point. When choosing a CMS (or any framework), don't only consider what you think you will need when you start the project - think about what will be important 6 months into the project. Will you care if response times are 150ms instead of 100ms? Will you care if the CMS supported a shopping cart out of the box so you didn't have to spend a week implementing it? Probably not. But something that will affect you for the lifetime of the project is the quality and complexity of the code base. 

Code quality will vary depending on your choice of CMS. It's not always easy to create clean code when using a CMS as the CMS is usually the boss and your code has to fit around its needs and wants. As an example, I would like to demonstrate creating a simple blog site with Umbraco while keeping clean code.

*Disclaimer: I am not aiming to encourage or discourage the use of Umbraco as a CMS. I'm aiming for people to consider how a CMS will affect the quality of their code. Full disclosure: I am wearing an Umbraco T-shirt as I write this but don't let that skew your judgement of my impartiality.*

## Site Setup

The blog has two types of pages: a 'BlogHome' and a 'BlogPost'. The home page has a title and some intro text. Each blog post has a title, a published date and the body of the post. The site currently has a home page and two all-encompassing posts:

<img alt="Blog Structure" src="{{ site.baseurl }}/isullivan/assets/blog-structure.png" />

Each item can be edited in the CMS with the following forms:

### Blog Home

<img alt="Blog Home Item" src="{{ site.baseurl }}/isullivan/assets/blog-content.png" />

### Blog Post

<img alt="Blog Post Item" src="{{ site.baseurl }}/isullivan/assets/blog-post-content.png" />

This kind of structure is similar in many CMSs.

## Simple Data Access

The first hurdle is accessing the values entered in the CMS from your code. There is an application boundary here as the values are stored in a database. Umbraco allows the creation of a type safe wrapper around each page type. The wrappers are simple:

{% highlight csharp %}
public class BlogHome : PublishedContentModel
{
    public BlogHome(IPublishedContent content) : base(content){}

    public string BlogTitle { get { return this.GetPropertyValue<string>("blogTitle"); } }
    public string Intro { get { return this.GetPropertyValue<string>("intro"); } }
}

public class BlogPost : PublishedContentModel
{
    public BlogPost(IPublishedContent content) : base(content) { }

    public string Title { get { return this.GetPropertyValue<string>("title"); } }
    public DateTime PublishedDate { get { return this.GetPropertyValue<DateTime>("publishedDate"); } }
    public IHtmlString Body { get { return this.GetPropertyValue<IHtmlString>("body"); } }
}

{% endhighlight %}

The classes simply pull the correct values from the CMS by field name. This is very similar to using an ORM to read from a database. One of the best parts about these wrapper classes is that with a couple of lines of configuration, Umbraco will return instances of your wrapper classes when using the Umbraco API. These wrapper classes keep the code clean in several important ways:

 - The interface between your code and the CMS is isolated within these classes - property names are referenced in a single place. This is much cleaner and less error prone than accessing values by string keys throughout your code.
 - All type conversions are in these classes. There is a single point in the code base where the blog post published date is converted into a `DateTime` value.
 - It adds compile time safety. I've explicitly marked that the blog post body may contain HTML by using `IHtmlString` instead of `string`.
 - I can use developer tools to find, for example, all references to the `PublishedDate` of blog posts.
 - The classes are testable.

More information on using these wrapper classes can be [found here](https://github.com/zpqrtbnk/Zbu.ModelsBuilder/wiki/IPublishedContentModelFactory).

## Clean, Logic-Less Views

CMSs are generally used for creating websites and therefore are designed to spit out HTML. Moving from your application logic to a templating engine is another application boundary. Umbraco is built on top of Microsoft's ASP.NET MVC framework and therefore has access to all of its features including Razor, its view templating engine. Razor works well with the wrapper classes as it supports compile time type-checking like any other C# code.

I first created a 'BlogHome' page type (document type) and a `BlogHome` wrapper class. The next thing I need to do is create a BlogHome.cshtml view template. Umbraco uses naming conventions so when I visit the home page, Umbraco magically passes an instance of my wrapper class `BlogHome` into the BlogHome.cshtml view:

{% highlight html %}
@inherits Umbraco.Web.Mvc.UmbracoViewPage<BlogHome>

<h1>@Model.BlogTitle</h1>
<p>@Model.Intro</p>

<h2>Latest Posts:</h2>

<ol>
    @foreach (var post in Model.Children().OfType<BlogPost>().OrderByDescending(p => p.PublishedDate))
    {
        <li><a href="@post.Url">@post.Title</a></li>
    }
</ol>

{% endhighlight %}

That is everything I need to view the home page of my blog.

Some things to note:

 - The view inherits from `UmbracoViewPage` and has my wrapper class as the type parameter. I can access the `BlogHome` instance using the `Model` property.
 - The view is very clean. There is no logic, database access or string parsing which can plague a lot of CMS code.
 - Umbraco's `Children` method is returning instances of the `BlogPost` wrapper class.

Very little code and effort has been required to take a document from the CMS and convert it to HTML. I admit that this is a fairly contrived example. There is no logic in the view because there is no logic required - I'm simply reading fields. The next section shows how more complex code can be added to the process.

## Isolated & Testable Code

Lets suppose that each blog post has comments that are posted by visitors to the site. These comments are not maintained within Umbraco and are stored in a database somewhere but will still be displayed on the blog post pages. The same approach as before would work. The `BlogPost` wrapper class gets passed into a view and some code in the view could query the database and pull the comments out. Razor is too powerful and lets us get away with far too much - just because we can execute arbitrary C# using razor doesn't mean we should!

A nicer alternative is to use what Umbraco calls 'hijacking'. Conceptually, it is simply putting a controller between the model and the view. This allows you to pass a custom view model to the view instead of the default wrapped Umbraco item:

{% highlight csharp %}
public class BlogPostController : RenderMvcController
{
    private readonly ICommentRepository _commentRepository;

    public BlogPostController(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public override ActionResult Index(RenderModel model)
    {
        var blogPost = (BlogPost)model.Content;

        var viewModel = new BlogPostViewModel {
            Post = blogPost,
            Comments = _commentRepository.GetCommentsForPost(blogPost.Id)
        };

        return CurrentTemplate(viewModel);
    }
}
{% endhighlight %}

This controller (which inherits from ASP.NET's `System.Web.Mvc.Controller`) is called `BlogPostController` and Umbraco knows to run this code as the controller name matches the page type. Overriding the `Index` method allows the creation of an arbitrary view model that will get passed to the view instead of the wrapper class we created. I'm also using Ninject to inject an instance of `ICommentRepository` which keeps the code clean and testable. Now the view for blog posts is simple:

 {% highlight html %}
 @inherits Umbraco.Web.Mvc.UmbracoViewPage<BlogPostViewModel>

<article>
    <header>
        <h1>@Model.Post.Title</h1>
        <time pubdate datetime="@Model.Post.PublishedDate.ToIsoString()">@Model.Post.PublishedDate.ToShortDateString()</time>
    </header>
    <div>
        @Model.Post.Body
    </div>
    <footer>
        <ol>
            @foreach(var comment in Model.Comments)
            {
                <li>@comment.User - @comment.Value</li>
            }
        </ol>
    </footer>
</article>
{% endhighlight %}

Data access is separate from my application logic and my application logic is separate from my view. My application logic is also fully testable. Great! More information on Umbraco route hijacking can be [found here](https://our.umbraco.org/documentation/Reference/Templating/Mvc/custom-controllers).


## Conclusion

Hopefully this example, albeit simple, shows how Umbraco allows developers to keep code clean and maintainable. Regardless of your CMS choice, always try to picture how maintainable your code will become as your website grows in complexity. Consider this to be a feature of the CMS, and an important one at that.
