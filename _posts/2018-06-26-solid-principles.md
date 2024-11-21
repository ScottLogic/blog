---
title: Examples and definitions of the SOLID principles in Software Design
date: 2018-06-26 00:00:00 Z
categories:
- Tech
summary: Code examples and definitions of the SOLID principles to show how easy it
  is to voilate them and how you can refactor code to adhere to them.
author: hmumford
image: hmumford/assets/featured/solid.jpg
layout: default_post
---

During my Graduate Programme at Scott Logic, I joined a study group to learn about software engineering design patterns and core principles.
The SOLID principles are the foundations of good software design. During the study group I learnt how we can use these principles in enterprise development to solve common programming problems. 
Writing these code examples below to show the 'bad way' and the 'good way', gave me some clarity about visualising and understanding these core principles.


## SOLID Principles

- [Single Responsibility Principle](#single-responsibility-principle)
- [Open for Extension Closed for Modification](#open-for-extension-closed-for-modification)
- [Liskov Substitution Principle](#liskov-substitution-principle)
- [Interface Segregation Principle](#interface-segregation-principle)
- [Dependency Inversion](#dependency-inversion)


### Single Responsibility Principle

A class should take care of a Single Responsibility ([C# Code example](https://github.com/harrymt/SOLID-principles/blob/master/README.md#single-responsibility-principle)).

#### Bad Way

This `Add` method does too much, it shouldn't know how to write to the log and how to add a customer.

~~~c#
class Customer
{
    void Add(Database db)
    {
        try
        {
            db.Add();
        }
        catch (Exception ex)
        {
            File.WriteAllText(@"C:\Error.txt", ex.ToString());
        }
    }
}
~~~

#### Good Way

This doesn't violate the single responsibility principle by abstracting the logger for the actual writing.

~~~c#
class Customer
{
    private FileLogger logger = new FileLogger();
    void Add(Database db)
    {
        try {
            db.Add();
        }
        catch (Exception ex)
        {
            logger.Handle(ex.ToString());
        }
    }
}
class FileLogger
{
    void Handle(string error)
    {
        File.WriteAllText(@"C:\Error.txt", error);
    }
}
~~~

### Open for Extension Closed for Modification

Prefer extension over modification ([C# Code example](https://github.com/harrymt/SOLID-principles/blob/master/README.md#open-for-extension-closed-for-modification)).

#### Bad Way

This violates the Open Closed Principle, because at the moment there are 2 types
of customer, if we want to add another customer type
we have to add an `if else` statement below and will modify the existing code.

~~~c#
class Customer
{
    int Type;

    void Add(Database db)
    {
        if (Type == 0)
        {
            db.Add();
        }
        else
        {
            db.AddExistingCustomer();
        }
    }
}
~~~

#### Good Way

This is better, because we structure the code so it's
easier to extend and harder to modify.


~~~c#
class CustomerBetter
{
    void Add(Database db)
    {
        db.Add();
    }
}

class ExistingCustomer : CustomerBetter
{
    override void Add(Database db)
    {
        db.AddExistingCustomer();
    }
}

class AnotherCustomer : CustomerBetter
{
    override void Add(Database db)
    {
        db.AnotherExtension();
    }
}
~~~

### Liskov Substitution Principle

The parent class should be able to refer child objects seamlessly during runtime polymorphism. ([C# Code example](https://github.com/harrymt/SOLID-principles/blob/master/README.md#liskov-substitution-principle)).


#### Bad Way

This violates Liskov substitution principle. 
The parent should easily replace the child object and not break any functionality, only lose some, e.g. for this example below, we don't want this to add an enquiry so we have to throw a new exception, that violates the principle.

~~~c#
class Enquiry : Customer
{
    override int Discount(int sales)
    {
        return sales * 5;
    }

    override void Add(Database db)
    {
        throw new Exception("Not allowed");
    }
}

class BetterGoldCustomer : Customer
{
    override int Discount(int sales)
    {
        return sales - 100;
    }
}

class BetterSilverCustomer : Customer
{
    override int Discount(int sales)
    {
        return sales - 50;
    }
}

// e.g. to show how this is bad:
class ViolatingLiskovs
{
    void ParseCustomers()
    {
        var database = new Database();
        var customers = new List<Customer>
        {
            new GoldCustomer(),
            new SilverCustomer(),
            new Enquiry() // This is valid, but...
        };

        foreach (Customer c in customers)
        {
            // Enquiry.Add() will throw an exception here!
            c.Add(database);
        }
    }
}
~~~

#### Good Way

~~~c#
interface IDiscount {
    int Discount(int sales);
}

interface IDatabase {
    void Add(Database db);
}

internal class Customer : IDiscount, IDatabase
{
    int Discount(int sales) { return sales; }
    void Add(Database db) { db.Add(); }
}

// GOOD: Now, we don't violate Liskov Substitution principle
class AdheringToLiskovs
{
    public void ParseCustomers()
    {
        var database = new Database();
        var customers = new List<Customer>
        {
            new GoldCustomer(),
            new SilverCustomer(),
            new Enquiry() // This will give a compiler error, rather than runtime error
        };

        foreach (Customer c in customers)
        {
            // Enquiry.Add() will throw an exception here!
            // But, we won't get to here as compiler will complain
            c.Add(database);
        }
    }
}
~~~

### Interface Segregation Principle

A client should not be forced to use an interface, if it doesn't need it. ([C# Code example](https://github.com/harrymt/SOLID-principles/blob/master/README.md#interface-segregation-principle)).

#### Bad Way

If we want to add more functionality, don't add to existing
interfaces, segregate them out.

~~~c#
interface ICustomer // existing
{
    void Add();
}

interface ICustomerImproved
{
    void Add();
    void Read(); // Existing Functionality, BAD
}
~~~

#### Good Way

Just create another interface, that a class can also extend from.

~~~c#
interface ICustomerV1 : ICustomer
{
    void Read();
}

class CustomerWithRead : ICustomer, ICustomerV1
{
    void Add()
    {
        var customer = new Customer();
        customer.Add(new Database());
    }

    void Read()
    {
        // GOOD: New functionality here!
    }
}

// e.g.
void ManipulateCustomers()
{
    var database = new Database();
    var customer = new Customer();
    customer.Add(database); // Old functionality, works fine
    var readCustomer = new CustomerWithRead();
    readCustomer.Read(); // Good! New functionalty is separate from existing customers
}
~~~

### Dependency Inversion

High level modules should not depend on low-level modules, but should depend on abstraction. ([C# Code example](https://github.com/harrymt/SOLID-principles/blob/master/README.md#dependency-inversion)).

#### Bad Way

We are relying on the customer to say that we
are using a File Logger, rather than another type of
logger, e.g. EmailLogger.

~~~c#
class FileLogger
{
    void Handle(string error)
    {
        File.WriteAllText(@"C:\Error.txt", error);
    }
}

internal class Customer
{
    FileLogger logger = new FileLogger(); // Bad

    public void Add(Database db)
    {
        try
        {
            db.Add();
        }
        catch (Exception error)
        {
            logger.Handle(error.ToString());
        }
    }
}
~~~

#### Good Way

We pass in a Logger interface to the customer
so it doesn't know what type of logger it is.

~~~c#
class BetterCustomer
{
    ILogger logger;
    BetterCustomer(ILogger logger)
    {
        this.logger = logger;
    }

    void Add(Database db)
    {
        try
        {
            db.Add();
        }
        catch (Exception error)
        {
            logger.Handle(error.ToString());
        }
    }
}
class EmailLogger : ILogger
{
    void Handle(string error)
    {
        File.WriteAllText(@"C:\Error.txt", error);
    }
}

interface ILogger
{
    void Handle(string error);
}

// e.g. when it is used:
void UseDependencyInjectionForLogger()
{
    var customer = new BetterCustomer(new EmailLogger());
    customer.Add(new Database());
}
~~~

Writing [these examples](https://github.com/harrymt/SOLID-principles/tree/master/Solid) helped me better understand how these principles can be applied to real-world examples.
Following these SOLID principles helps us create more reusable, maintainable, scalable and testable code.

