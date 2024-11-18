---
title: Recommended Reading For Java Developers
date: 2016-05-21 00:00:00 Z
categories:
- Tech
author: bjedrzejewski
summary: Being a software developer requires constantly improving ones knowledge. This is a short list of books that made the largest impact on me as Java developer. I hope that you too will find here something that will take you to the next level!
layout: default_post
---

Being a software developer requires constantly improving ones knowledge. There are many ways to improve that knowledge, you can read articles or work on personal projects.
These are immensely useful, but sometimes to truly make a jump in your understanding of a topic- it still helps to read a book written by experts. Last year I read a very interesting blog post by our
Head of User Experience [Graham Odds](http://blog.scottlogic.com/godds/) where he presents the
[recommended reading for designers](http://blog.scottlogic.com/2015/12/17/recommended-reading-for-designers.html). That started me thinking- what were for me,
the most important books that I read as a Java developer. Most of us come across numerous books and articles when searching for answers,
but every now and then, there is something that really opens our eyes and takes us to the _next level_. Here I want to present you
with six books that really changed the way I work with Java and think about my projects. Books that had a large impact
on me as a Java developer. I hope that they will help to take you to that _next level_ as well. Reading a technical book cover to cover
is no small commitment, so I decided to split these book by categories so that you can focus on what is most interesting for you.

The categories I chose are:

- Core Java
- Object Oriented Programming
- Testing
- Architecture
- Java 8
- Problem Solving

And these are the books that I selected:

<img src="{{ site.baseurl }}/bjedrzejewski/assets/java-books-2.jpg" alt="Effective Java"/>

[**(Core Java) Effective Java - Second Edition**](http://www.amazon.co.uk/Effective-Java-Second-Joshua-Bloch/dp/0321356683/) by Joshua Bloch

This is probably the most famous 'second Java' book there is. If you already know the language and want to know what are the best
practices and solutions for common problems- this is the place to learn them. The book is written by Joshua Bloch who
is an authority in the Java community, being responsible for some of the platform features and large portion of the Java Collection Framework.
If you don't know why `final` is such an important keyword, or when adding a _builder_ is a good idea, this book will be
very useful. It covers _object creation_, _classes and interfaces_, _generics_, _enums and annotations_, _general programming_
and much more. The only criticism I can have for this book is that it is not yet updated for Java 8 and a few
of the ideas presented here- are arguably better solved with the new language features. For that there is another book further
down this list...

<img src="{{ site.baseurl }}/bjedrzejewski/assets/java-books-3.jpg" alt="Head First Design Patterns"/>

[**(Object Oriented Programming) Head First Design Patterns**](http://www.amazon.co.uk/Head-First-Design-Patterns-Freeman/dp/0596007124/) by Eric Freeman & Elizabeth Freeman with Kathy Sierra & Bert Bates

Object orient programming design skills and knowledge are expected from all Java developers. It is surprising that many
Java developers actually find it difficult to find a good book that will in easy and friendly way describe how to
use design patterns. There is always the famous [Design patterns: elements of reusable object-oriented software](http://www.amazon.co.uk/Design-patterns-elements-reusable-object-oriented/dp/0201633612)
written by _Gang of Four_, but this is a rather difficult book. The Head First book, despite its funny, provocative style,
contains a lot of valuable knowledge about all the common design patterns and more. Maybe this is not a book you want to
keep on your desk at work (especially if you are working in a _very serious_ place), but reading it, is pretty much guaranteed
to help you identify, describe and implement most of the commonly used design patterns. It is also genuinely entertaining.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/java-books-4.jpg" alt="Practical Unit Testing"/>

[**(Testing) Practical Unit Testing with JUnit and Mockito**](http://www.amazon.co.uk/Practical-Unit-Testing-JUnit-Mockito/dp/8393489393/) by Tomek Kaczorowski

Many Java developers (especially the new ones) when hearing about unit tests starts to roll their eyes and look for the exit. Unit testing is
often seen as a necessity, something that has to be done, but does not _really_ help development. A tick-box that needs to be
ticked to get that pull request approval. This book really showed me that there is much more to unit testing than
most people expect. Even if you already know and understand, why you should unit test- this book clearly shows you how.
It tackles most of the common questions and concerns (for example: _"What values to check?"_, _"When to write tests?"_, and more).
I think this is a great book for those who love as well for those who hate testing- it really can change your attitude. Every time
I use it for reference, to refresh my memory- I want to go and write some tests.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/java-books-5.jpg" alt="Building Microservices"/>

[**(Architecture) Building Microservices**](http://www.amazon.co.uk/Building-Microservices-Sam-Newman/dp/1491950358/) by Sam Newman

Nowadays it is difficult to talk about modern Java Architecture without mentioning microservices. There are numerous
success stories from all corners of Java world about successful large scale microservices deployments. Netflix
is one of the pioneers in this space and they wrote quite a lot about their [experience with microservices](http://techblog.netflix.com/2015/02/a-microscope-on-microservices.html).
However, when faced with a reality of implementing this architecture, a few blog posts often seem not enough
to give the knowledge and confidence at replicating these success stories. Building Microservices is a book that can really help
here. It explains the challenges of implementing this solution in real world and answers to common problems that
you will face- _How to make microservices talk to each other?_, _How to map continuous integration to Microservices?_  or _How much is too much?_.
The book is short but is absolutely packed with useful information.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/java-books-6.jpg" alt="Java 8 in Action"/>

[**(Java 8) Java 8 in Action**](http://www.amazon.co.uk/Java-Action-Lambdas-functional-style-programming/dp/1617291994/) by Raoul-Gabriel Urma, Mario Fusco and Alan Mycroft

Introduction of Java 8 is the largest and most significant change to Java language since introducing generics in
Java 5. Java 8 was introduced in 2014 and in 2016 still most Java developers are not fully familiar with
what is new and what changed. Most heard about the lambdas, but this is not all that was added in Java 8. Do you know
about streams, default implementations in the interfaces, `Optional` as an alternative to `null`? If not, this book will
show you all of that in an easy and engaging way. I see this book as a companion to the Effective Java
mentioned earlier. Together they show how to use Java to its full potential.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/java-books-7.jpg" alt="Cracking the coding interview"/>

[**(Problem Solving) Cracking the Coding Interview**](http://www.amazon.co.uk/Cracking-Coding-Interview-6th-Programming/dp/0984782850/) by Gayle Laakmann McDowell

Inclusion of this book may surprise you. If you already have a Java career, why would a book about cracking the interview
be useful in any way? Maybe this is a recommendation only for students? I think experience developers can also benefit from this book.
I personally found this book useful in more than one aspect. It does more than teach you how to prepare
for the _technical interview that may stand between you and your [dream job at Scott Logic](http://www.scottlogic.com/careers/)_.
It will help you you:

- Learn efficient use of data structures and graphs
- Learn different algorithms and their implementations
- Clearly express your solutions and ideas
- Prepare for taking technical interviews
- Prepare for conducting technical interviews
- Solve algorithmic problems and even compete in algorithmic contests

I think these can be useful for most Java developers. It certainly helped me learn important, but sometimes overlooked
aspects of being good Java developer.

<img src="{{ site.baseurl }}/bjedrzejewski/assets/java-books-1.jpg" alt="Recommended Java Books"/>

Have fun reading and learning. If there are books that you found game changing, please let us know in comments
or on [Twitter](http://twitter.com/Scott_Logic).