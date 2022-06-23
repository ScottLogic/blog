---
author: pgraham
title: "Spring Autowiring - It's a kind of magic - Part 1"
summary: "A series of posts exploring the things that Spring Boot does when it magically Autowires application dependencies. Is it really a kind of magic, or is there no such thing?"
summary-short: "A detailed look at the reality of Spring Autowiring magic."
categories:
  - Tech
tags:
  - java
  - spring
  - spring-boot
layout: default_post
---

A recent piece of development work made me think about Spring Autowiring. The Java code and the Spring configuration for the application I was developing were not aligned, but, *as if by magic*, everything seemed to be working fine.

I decided that I wanted an explanation, and results were hard to find on the usual sources of wisdom that we developers turn to ([Google](https://www.google.co.uk/search?q=autowiring+missing+constructor+arguments) and [Stack Overflow](https://stackoverflow.com/questions/41092751/spring-injects-dependencies-in-constructor-without-autowired-annotation)). I set out to recreate the same situation in a [simple project](https://github.com/pagram1975/autowiring-magic-spring-boot). This would help me get to the bottom of what was really happening, and I'd learn more about Spring while I was doing so.

This post focusses on something documented as a note in the Spring documentation. This is that, as of Spring Framework 4.3, Spring does not require the `@Autowired` anotation if a target bean only defines [one constructor](https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/htmlsingle/#beans-autowired-annotation). The examples below work through the mechanisms used in Spring Autowiring, looking into the code to see what's really happening. Firstly let's inject a dependency using the `@Autowired` annotation.

## Autowiring with @Autowired and @Service

Imagine an online blog full of interesting articles about software development and technology. Each article on the blog needs to be assigned an author. If the server was a Spring application written in Java it would be useful to have an `AuthorService`.

~~~java
package com.github.pagram1975.autowiremagic;

import com.github.pagram1975.autowiremagic.model.web.Author;

import java.util.*;

public class AuthorService {

    private Map<Integer, Author> map = new HashMap<> ();

    public AuthorService () {
        Author zinat = new Author(1, "Zinat", "Wali");
        Author jeanSacha = new Author(2, "Jean-Sacha", "Melon");
        Author steven = new Author(3, "Steven", "Waterman") ;
        Author sam = new Author(4, "Sam", "Hogarth");
        Author callum = new Author(5, "Callum", "Akehurst-Ryan");
        Author james = new Author(6, "James", "Grant");

        map.put(zinat.getAuthorId(), zinat);
        map.put(jeanSacha.getAuthorId(), jeanSacha);
        map.put(steven.getAuthorId(), steven);
        map.put(sam.getAuthorId(), sam);
        map.put(callum.getAuthorId(), callum);
        map.put(james.getAuthorId(), james);
    }

    public Collection<Author> getAllAuthors() {
        return map.values();
    }

    public Author getAuthorForAuthorId(int authorId) {
        Author result = map.get(authorId);
        if (result == null) {
            return Author.UNKNOWN_AUTHOR;
        }
        return result;
    }
}
~~~

The Spring application would have an `AuthorController` class which exposes a couple of endpoints to display all authors and also individual authors by ID. We'd need the `AuthorService` to be available to this controller, and this is easily done using `@Autowired`.

~~~java
package com.github.pagram1975.autowiremagic.autowired;

import com.github.pagram1975.autowiremagic.AuthorService;
import com.github.pagram1975.autowiremagic.model.web.Author;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("authors")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    @GetMapping("/")
    public List<Author> getAllAuthors() {
        List<Author> list = new ArrayList<>(authorService.getAllAuthors());
        return list;
    }

    @GetMapping("/{id}")
    public Author getAuthorById(@PathVariable int id) {
        return authorService.getAuthorForAuthorId(id);
    }
}
~~~

Spring will only be able to complete the dependency injection for the `AuthorService` if it is told to create an instance of the `AuthorService` in the application configuration. This can be done by adding the `@Service` annotation to the `AuthorService` class.

~~~java
...
import org.springframework.stereotype.Service;
...

@Service
public class AuthorService {

...

}
~~~

That's all that is required. The application can be started and the local endpoint, `http://localhost:8080/authors/`, will display the list of authors. Spring is filling in the dependency that `AuthorController` has on `AuthorService` *as if by magic*.

So, what's really going on? To see what's happening enable `TRACE` level logging in the application. This is simply a case of passing `--trace` as a program argument at runtime. In IntelliJ Idea that looks like this (open these images in a new tab to see them in more detail).

![Adding --trace as a program argument in IntelliJ Idea]({{site.baseurl}}/pgraham/assets/IntelliJTrace.png)

The trace logging contains some lines that show exactly where the `@Autowired` injection was processed and the `AuthorService` dependency was resolved.

~~~text
TRACE 34936 --- [           main] o.s.b.f.annotation.InjectionMetadata     : Processing injected element of bean 'authorController': AutowiredFieldElement for private com.github.pagram1975.autowiremagic.AuthorService com.github.pagram1975.autowiremagic.autowired.AuthorController.authorService
TRACE 34936 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Returning cached instance of singleton bean 'authorService'
TRACE 34936 --- [           main] f.a.AutowiredAnnotationBeanPostProcessor : Autowiring by type from bean name 'authorController' to bean named 'authorService'
TRACE 34936 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Finished creating instance of bean 'authorController'
~~~

It's possible to inspect what's happening in detail by adding a breakpoint in the `AutowiredAnnotationBeanPostProcessor` class that Spring uses and debugging the process. The trace log provides some text to search for to set the initial breakpoint (there must be a statement that includes `logger.trace("Autowiring by type...`).

![Debugging Spring in IntelliJ Idea to see how the dependency is registered]({{site.baseurl}}/pgraham/assets/IntelliJRegister.png)

This shows that Spring is aware that the `AuthorController` is dependent on the `AuthorService` so it registers this dependency then returns up the stack.

![Debugging Spring in IntelliJ Idea to see how the dependency is resolved and set]({{site.baseurl}}/pgraham/assets/IntelliJSetValue.png)

Stepping back up through the stack, it's in the `AutowiredAnnotationBeanPostProcessor$AutowiredFieldElement.inject()` method that the dependency is injected. Spring has looked in the `BeanFactory` to see what beans are defined. It identifies that it has one bean, the `AuthorService`, that is the correct type for the `AuthorController.authorService` field. Then it uses good old [Java reflection](https://www.oracle.com/technical-resources/articles/java/javareflection.html) and calls [`Field.set(Object obj, Object value)`](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Field.html#set-java.lang.Object-java.lang.Object-) to inject the dependency. Not so magical after all.

## Autowiring with a single constructor

What happens if there is an `AuthorControllerWithConstructor` defined that doesn't use the `@Autowired` annotation to resolve its dependency on the `AuthorService`. What magic does Spring use in that situation? First of all there needs to be a new class.

~~~java
package com.github.pagram1975.autowiremagic.autoconstructor;

import com.github.pagram1975.autowiremagic.AuthorService;
import com.github.pagram1975.autowiremagic.model.web.Author;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("authorswithconstructor")
public class AuthorControllerWithConstructor {

    /* Note - No autowired annotation needed. */
    private AuthorService authorService;

    /* This is the only constructor available to Spring Boot, 
     * so this is the one Spring Boot will use. */
    public AuthorControllerWithConstructor(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping("/")
    public List<Author> getAllAuthors() {
        List<Author> list = new ArrayList<>(authorService.getAllAuthors());
        return list;
    }

    @GetMapping("/{id}")
    public Author getAuthorById(@PathVariable int id) {
        return authorService.getAuthorForAuthorId(id);
    }
}
~~~

To make it clearer which beans are defined in the [project](https://github.com/pagram1975/autowiring-magic-spring-boot) I decided to define all the service beans in an XML configuration. This is very simple for the `AuthorService`.

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- Comment out the bean definition below if you annotate the AuthorService class with @Service.
     Duplicate the bean definition below (with a different name) to see ambiguity cause an error. -->
    <bean name="autowire.AuthorService" class="com.github.pagram1975.autowiremagic.AuthorService"/>
</beans>
~~~

That's all that is required. The application can be started and the local endpoint, `http://localhost:8080/authorswithconstructor/`, will display the list of authors. Spring is calling the constructor in `AuthorController` and passing in the `AuthorService` as a parameter *as if by magic*.

So, what's really going on? This time the `TRACE` level logging in the application provides little detail.

~~~text
TRACE 28728 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Creating instance of bean 'authorControllerWithConstructor'
TRACE 28728 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Returning cached instance of singleton bean 'autowire.AuthorService'
DEBUG 28728 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Autowiring by type from bean name 'authorControllerWithConstructor' via constructor to bean named 'autowire.AuthorService'
TRACE 28728 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Eagerly caching bean 'authorControllerWithConstructor' to allow for resolving potential circular references
~~~

> Note - the singleton bean `autowire.AuthorService` has already been cached by Spring at the point in time when the `AuthorControllerWithConstructor` is being created. This is because it is included in the beans definition.

It's possible to see how Spring is creating the `AuthorControllerWithConstructor` by adding a breakpoint in the constructor and debugging the process.

![Debugging Spring in IntelliJ Idea to see how the constructor is called]({{site.baseurl}}/pgraham/assets/IntelliJConstructor.png)

It's clear from the stack that Spring has worked out that it must instantiate the `AuthorControllerWithConstructor` by calling its constructor, but how has it done this? Looking through the stack there are some descriptive class names that give some hints.

![Debugging Spring in IntelliJ Idea to see which classes are involved in creating the controller]({{site.baseurl}}/pgraham/assets/IntelliJCreateBeanInstance.png)

One method that stands out is `createBeanInstance()` on the `AbstractAutowireCapableBeanFactory` class. The thing that Spring is doing for us is creating a bean instance, in this case the bean is `AuthorControllerWithConstructor`. Looking at this there's another method called from `createBeanInstance()` that has a very descriptive name `determineCandidateConstructors()`.

![Debugging Spring in IntelliJ Idea to shows how Spring discovers the class constructor]({{site.baseurl}}/pgraham/assets/IntelliJDetermineCandidateConstructors.png)

Again, Spring is using [Java reflection](https://www.oracle.com/technical-resources/articles/java/javareflection.html) to determine the constructors that are available to create the `AuthorControllerWithConstructor`. The above shows that the Spring code calls [`Class.getDeclaredConstructors()`](https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html#getDeclaredConstructors--), a method that has been around since JDK1.1. Once a candidate constructor has been discovered Spring resolves the arguments (remember that there's a cached `AuthorService` bean) and instantiates the class.

![Debugging Spring in IntelliJ Idea shows the constructor is invoked via Java reflection]({{site.baseurl}}/pgraham/assets/IntelliJConstructorNewInstance.png)

The class instantiation is done using [Java reflection](https://www.oracle.com/technical-resources/articles/java/javareflection.html), too. The method used is [`Constructor.newInstance()`](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Constructor.html#newInstance-java.lang.Object...-). After looking into the Spring code that is executed, Autowiring a bean by a single constructor doesn't seem so magical after all.

## Summary

The first part of this post looked into the detail of how the Spring Framework resolves dependencies declared with the `@Autowired` annotation. The second part showed that Spring can also resolve dependencies for a target bean class that has just one constructor. In both cases Spring uses [Java reflection](https://www.oracle.com/technical-resources/articles/java/javareflection.html) to perform its task. You can find all the code for the classes referenced in this post on [GitHub](https://github.com/pagram1975/autowiring-magic-spring-boot).

Dependency injection by `@Autowired` is a convenient way to wire beans together within a Spring application. It's easy to use and powerful enough to, at times, appear somewhat magical. While it would be nice to believe in magic, it's better to have a more detailed answer prepared for the question, "How does it work?" 

Thanks for taking the time to read this post. The [next post]({{ site.github.url }}/2020/04/16/spring-autowiring-its-a-kind-of-magic-2.html) in this series will look into some of the quirks of Spring Autowiring and dependency injection, including cases where Spring copes with incomplete configuration details *as if by magic*.
