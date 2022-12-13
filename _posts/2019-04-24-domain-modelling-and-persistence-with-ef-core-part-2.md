---
title: Domain modelling and persistence with EF Core - Part 2
date: 2019-04-24 00:00:00 Z
categories:
- hsteele
- Tech
author: hsteele
layout: default_post
summary: Persisting data can be easy with an ORM like EF Core. Let's take a look at
  how we can save our data without compromising our domain models.
---

## Domain modelling and persistence with EF Core - Part 2

[In part one](https://blog.scottlogic.com/2019/04/11/domain-modelling-and-persistence-with-ef-core-part-1.html), we looked at how we could begin modelling our domain. We used an example of a blog post with a title, content, audit information, and commenting functionality. We then performed some simple refactors to encapsulate domain logic within our classes. 

The end result was a model that neatly contains all of the behaviour required in our domain, using constructors to specify what data was initially needed and easily recognisable domain-oriented methods that specified what actions could be performed on the object.

The next question is, how do we save anything?


### Persistence 💾

We could spend a lot of time exploring every detail of this step, but let’s leave that for another time! The persistence technology you choose depends on


- Your project’s needs
- Your organisation's tech stack
- Engineering requirements
- Team skills


and many other factors. For the sake of this post, we’re focusing on persisting our data in a relational database, say SQL Server. 

So how are we going to interact with the database? We can write the low-level interactions directly, sending queries to the database with a `SqlCommand` via an `SqlConnection` and mapping returned data into objects manually. There may be occasions where this more direct interaction, but you’ll end up writing a lot of management boilerplate and mapping code. 

Enter the ORM, the Object-Relational Mapper. As the name implies, an ORM's core purpose is to map between objects in code and a relational data structure. There are a lot of ORMS to choose from, spanning technologies and offering their own features.

For this blog, we’re going with Entity Framework Core, the flagship .Net ORM which was rewritten to be used with .Net Core. I won’t go into the details of how to set-up EF Core in your project as there are some great set-up articles out there, including [some thorough guides by Microsoft](https://docs.microsoft.com/en-us/ef/core/get-started/).

### Data models vs Domain models 🤔

The first thing to keep in mind with this approach is **don’t make your domain model a different class to your data model**! 

Let’s say we’ve set EF up with the following collection:

	public DbSet<BlogPost> BlogPosts { get; set; }

That's the domain model we created previously! Then we can do this:

	BlogPosts.Where(blogPost => blogPost.CreatedOn < DateTime.UtcNow);

This would translate into a query for all of the posts created before the current moment. No need for any hand-written SQL!

### How it works 💡

Although a lot of this might seem magical, a quick dive into how EF works under the hood is a great way to understand how it wants you to use it.

We tell EF that we have an object we want it to manage; in this case, a `BlogPost`.

EF decides, quite sensibly, that there will be a `BlogPost` table to hold this data.

EF then looks at the `BlogPost` class properties one by one and works out how to model them. A simple property like `Id` is a column on the `BlogPost` table, whereas a collection property like `Comments` is recognised as a relationship. It’s a one-to-many relationship, so EF creates a new table and starts again, recursively working out how to model a `Comment`.

### Conventions 🖋

EF relies heavily on conventions; that is, it expects some common names and patterns and makes some assumptions about them.

- A property called `Id` will be mapped as a primary key. 
- Column names will be derived from the property name, and table names from the class name. 
- Collections are mapped as one-to-many relationships, with a column added on the child object with a foreign key linking back to the parent. 


Most of the time, these assumptions are fine, but if you find yourself wanting to customise some aspect of the mapping process, [EF allows you to do so](https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontext.onmodelcreating?view=efcore-2.1).

Finally, when it doesn’t have anything left to map, EF is done. When you ask EF for a `BlogPost` with a specific `Id`, it knows which table to look in, what the column name for the `Id` is, and which class to create and populate with the data it finds. EF creates and executes the query, gets the resulting row (if any) and gives you a populated object ready to use; perfect!

### Object tracking 🔄

Here’s where my earlier comment about using the same model for the domain and data comes back up. The object EF gives you is, by default, tracked. That is, EF is aware of the loaded object instance. If I load up a `BlogPost` and call `AddComment`, I can then tell EF to save pending changes. EF checks the object, notices changes have been made to it since it was loaded, and works out how to persist those changes in the database. As it finds a new `Comment`, EF generates a `CREATE` statement that adds it to the `Comments` table and provides the `BlogPost`'s `Id` for the foreign key property. If you were to delete a `BlogPost`, EF would know it has to clean up any children first, so it doesn't attempt to breach a foreign key constraint.

### Drawbacks 👀


Although we get a huge number of advantages using EF, we do also have to be aware of some drawbacks and gotchas. Remember how we made a neatly-defined domain model with scoped properties? One step we took was to modify the `CreatedOn` property to the following:

	public DateTime CreatedOn { get; }

The other was to add a specific constructor that took the basic arguments needed to create a new `BlogPost`:

	public BlogPost(string title, string content)
	{ … }

These are fine when we create the class via the constructor, but EF by default requires a parameterless constructor to create an empty instance of the class, which it then populates with the loaded data via reflection. This means we need to make the following changes:

	public DateTime CreatedOn { get; private set; }

	private BlogPost()
	{ }


Firstly we've provided a setter which, although private, allows EF to set the `CreatedOn` field’s data. This same change is needed for every property on the object. 

Secondly we've added a default constructor which is inaccessible from code outside of the class but can be found by EF (via reflection), which allows it to create an empty instance prior to populating it with loaded data. 

Neither of these are particularly notable concessions to make, but I think they were worth highlighting as they do cause us to slip a little on our original goal of defining a clean domain model. The important fact is that we’re still encapsulating our domain logic for the `BlogPost`.

### Results ✨

- We’ve progressed from having a well-defined and cohesive domain model to being able to persist said model to the database without having to write a single line of SQL. 

- We've leveraged commonly-required features provided by EF to create and maintain our database schema. 

- We’ve avoided having to write an additional layer for persistence, and we don’t have to consider how to get our data into a model without needlessly exposing back doors to the rest of the application via public setters on properties. 

- _Most importantly, we’ve done all of the above without having to make substantial changes to the model by making sure we understand how EF wants us to work with it. **We haven't had to compromise on our original goal** of achieving a concise domain model just to get EF to work for us._

Hopefully this has been a good taste of how cleanly an ORM can fit into your solution. As with any framework there are gotchas and exceptions, and I hope to be able to address these specifically in future posts. 

Happy modelling and persisting!
