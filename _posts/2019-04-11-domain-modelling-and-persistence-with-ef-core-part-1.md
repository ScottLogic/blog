---
title: Domain modelling and persistence with EF Core - Part 1
date: 2019-04-11 00:00:00 Z
categories:
- hsteele@scottlogic.com
- Tech
author: hsteele@scottlogic.com
layout: default_post
summary: We usually need to consider data persistence when writing an application.
  In this first part we look at how to model your domain in preparation for use with
  Entity Framework.
image: 'image: huwsteele/assets/image.jpg'
---

## Domain modelling and persistence with EF Core 

When you start writing an application, odds are you’ll need some form of data persistence. If so, you’ll be faced with the following decisions:

- How should I model the domain?
- How do I persist these models?

If your domain is exceedingly simple and/or you don’t need to persist any data, those decisions become much easier! If not, I aim to convince you of the benefits of an approach which covers both of the above points in a satisfying and cohesive way.

Let’s get started!

### Design 📐  



First off, modelling. For our problem domain, what models do we create? What do they look like, and how do they interact? I won’t get into a discussion about whether anaemic domain models are a pattern or an anti-pattern, but I will argue strongly for the non-anaemic approach. Specifically, I’ll be championing one of the core principles of object-oriented programming: encapsulation.

Let’s start with an example. Our task is to model a blog post, which has a title, content, some audit information on when it was created or modified, and allows users to add comments. It’s a simple domain, but a good start to explore our options. 

If we start with the basics, we might end up with the following:

    public class BlogPost
    {
      public Guid Id { get; set; }
      public string Title { get; set; }
      public string Content { get; set; }
      public DateTime CreatedOn { get; set; }
      public DateTime LastModifiedOn { get; set; }

      public List<Comment> Comments { get; set; }
    }

    public class Comment
    {
      public Guid Id { get; set; }
      public string Content { get; set; }
    }
    

This covers all of the required attributes of a blog post. The addition of `Id` fields, while not explicitly mentioned in the requirements, allows us to uniquely refer to a blog post or comment. If we stuck with this implementation, we’d assume that the code that uses these classes would be responsible for setting the fields correctly. For example:


    var newBlogPost = new BlogPost
    {
        Id = Guid.NewGuid(),
        Title = "A Great Title",
        Content = "Some really great content!",
        CreatedOn = DateTime.UtcNow
    };


I’m not really satisfied with that assumption. Some of those properties are things I don’t want to be overridden at-will. For example, I want to set the `Id` when I create a new blog post, but I don’t want to change it later. I also want the `CreatedOn` to be set when the blog post is created, and to remain constant thereafter. One approach would be to trust that myself or my team will never write any code that changes those properties and that any attempt to do so would be picked up in code review. While that’s certainly an option, do we need to rely on review for something so straightforward? Let’s try the following:


    public Guid Id { get; }
    public DateTime CreatedOn { get; }
    public List<Comment> Comments { get; }

    public BlogPost(string title, string content)
    {
        Title = title ?? 
                throw new ArgumentNullException(nameof(title));
        Content = content ??
                  throw new ArgumentNullException(nameof(content));

        Id = Guid.NewGuid();
        CreatedOn = DateTime.UtcNow;
        Comments = new List<Comment>();
    }

    public class Comment
    {
        public Guid Id { get; }
        public string Content { get; }

        public Comment(string content)
        {
            Id = Guid.NewGuid();
            Content = content ??
                      throw new ArgumentNullException(nameof(content));
        }
    }


The setters on the `Id`, `CreatedOn` and `Comments` properties have been removed and we set them in the constructor instead. We’ve also specified that we require a title and some content to create a new `BlogPost` and that content is needed to create a `Comment`, which makes sense. We’ve even used the null-coalesce operator to ensure that the title and content aren’t null!

With very little effort, we’ve encapsulated the behaviour of the `Id` and `CreatedOn` properties. Let’s take things a step further with the `LastModifiedOn` property:


    public string Title { get; private set; }
    public string Content { get; private set; }
    public DateTime LastModifiedOn { get; private set; }

    public void UpdateTitle(string newTitle)
    {
        Title = newTitle;
        LastModifiedOn = DateTime.UtcNow;
    }

    public void UpdateContent(string newContent)
    {
        Content = newContent;
        LastModifiedOn = DateTime.UtcNow;
    }


Making the setter private means we can change the value within our class, but not outside of it. This makes sense because our object is ultimately the best source of truth for when a change has taken place, as it’s the object itself we’re telling to change! The two additional methods allow us to change the values of the `Title` and `Content` properties, but also to set the `LastModifiedOn` date. We’ve taken another step towards encapsulating the constraints of our domain within the object itself! 

A quick note: we could also have used setter bodies instead of writing our own methods; it’s a personal preference of mine to keep the property bodies empty and default. The setter body approach looks like this:


    private string _content;
    public string Content
    { 
        get { return _content; }
        set  
        {
            _content = value;
            LastModifiedOn = DateTime.UtcNow;
        }
    }


Instead of using a method to set the content, we can use the `Content` property directly. It's worth having a think about how complex your domain logic is, however. This is a trivial case where we set a field to a provided value and update one other field in the process, but what if it was more complex? What if I needed multiple arguments? In those cases, an explicit method might be a better approach, if not outright required.

Whichever method you prefer, we now move on to the last phase of the modelling: how do we add comments? If we keep things as they are, we’d end up with something like this:


	blogPost.Comments.Add(new Comment("Really great post!"));


This would work fine, but it’s a little obtuse. We have to access a method on the collection, and then pass in another specific object we create. We can move the creation of the comment onto a new line, but it doesn’t really address the issue. 

Let’s try this instead:


    private List<Comment> _comments;
    public IReadOnlyList<Comment> Comments => _comments.AsReadOnly();

    public void AddComment(string newCommentContent)
    {
        var newComment = new Comment(newCommentContent);
        _comments.Add(newComment);
    }


This allows us to define whatever behaviour we like for adding a new comment. Changing the property to return an `IReadOnlyList` allows us to specify that the collection is read-only, and the getter body is defined by returning the read-only form of the backing field. This backing field is where we store the actual comments; the property is now just a read-only view of that private field. It also exposes a more easily-consumable method that takes a string, so callers don't have to supply their own `Comment` objects.

This brings us back to good OOP; the shape and behaviours on your class are an API into your domain! It’s good etiquette to provide a neat and coherent interface for other developers to work with when using your class, and that’s what we’ve done here. Now any calling code knows that it should expect to read the list of comments, and can sort them, but that it can’t add or remove them. We can also change the underlying list to another collection type without needing to alter anything else.

### Result ✨  

  
  
So where are we after these changes? With relatively little effort, we’ve embedded some of our domain logic right into the model. The result is an easily-testable class that can manage its own internal state without needing any help from any other part of the application. If you want to create a new blog, you have to provide some initial information via the constructor, which also sets some key information such as the `Id` and `CreatedOn` properties.


Our next step - how do we save it? [Part two](https://blog.scottlogic.com/2019/04/24/domain-modelling-and-persistence-with-ef-core-part-2.html) will cover how we use these models with Entity Framework Core to be able to save and load our data.
