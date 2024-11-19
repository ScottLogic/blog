---
title: Spring Autowiring - It's a kind of magic - Part 2
date: 2020-04-16 00:00:00 Z
categories:
- Tech
tags:
- java
- spring
- spring-boot
author: pgraham
summary: The second in a series of posts exploring the things that Spring Boot does
  when it magically Autowires application dependencies. Is it really a kind of magic,
  or is there no such thing?
summary-short: The second post in a series taking a detailed look at the reality of
  Spring Autowiring magic.
layout: default_post
---

This, the second post in the series on the subject of *Spring Autowiring*, will follow on from [part 1]({{ site.github.url }}/2020/02/25/spring-autowiring-its-a-kind-of-magic.html) by taking a look into some of the quirks of Autowiring.

My interest in looking into the detail of how Spring performs Autowiring began with a recent piece of development work. The Java code and the Spring configuration for the application I was developing were not aligned, but everything seemed to be working fine.

This post focusses on a simpler, but similar, case where inconsistencies between configuration and code are deliberately introduced to a [simple project](https://github.com/pagram1975/autowiring-magic-spring-boot). It may be expected that inconsistencies would cause application failures, but this is not the case. Spring copes with the errors that are introduced *as if by magic*.

## Autowiring with incomplete configuration

To demonstrate Spring's behaviour when Autowiring with an incomplete configuration the beans in the example project need to have their own dependencies. A good example is a dependency on Spring's [`ConversionService`](https://docs.spring.io/spring/docs/4.3.x/javadoc-api/org/springframework/core/convert/ConversionService.html). The simple project uses the `ConversionService` as it is easy to code and is fairly common. While the simple implementations of the `Converter` given below look facile, it should be easy to extrapolate a more complex implementation.

Imagine a music library system that catalogues albums. Each album in the library has an associated artist and is categorised by genre. If the server was a Spring application written in Java it would be useful to have an `ArtistService`, similar to the `AuthorService` from [part 1]({{ site.github.url }}/2020/02/25/spring-autowiring-its-a-kind-of-magic.html).

~~~java
package com.github.pagram1975.autowiremagic;

import com.github.pagram1975.autowiremagic.model.web.Artist;

import java.util.ArrayList;
import java.util.List;

public class ArtistService {

    List<Artist> list = new ArrayList<>();

    public ArtistService () {
        list.add(new Artist(1, "Jeff", "Rosenstock"));
        list.add(new Artist(2, "Xenia", "Robinos"));
        list.add(new Artist(3, "Agnes", "Obel"));
    }

    public List<Artist> getAllArtists() {
        return list;
    }
}
~~~

To provide the catalogue of albums the application needs an `AlbumService` that can be called upon to serve the data. In a real system this information could come from some external data source.

~~~java
package com.github.pagram1975.autowiremagic;

import com.github.pagram1975.autowiremagic.model.web.Album;
import com.github.pagram1975.autowiremagic.model.web.Genre;
import org.springframework.core.convert.ConversionService;

import java.util.ArrayList;
import java.util.List;

public class AlbumService {

    ArtistService artistService;

    ConversionService conversionService;

    List<Album> list = new ArrayList<>();

    public AlbumService (ArtistService artistService, ConversionService conversionService) {
        this.artistService = artistService;
        this.conversionService = conversionService;
        /* Create some albums, use the artistService to look up the
         * artist. We don't know the genre at this point. */
        Album worry = new Album(1, "Worry", Genre.UNKNOWN, artistService.getAllArtists().get(0));
        Album blackTerryCat = new Album(2, "Black Terry Cat", Genre.UNKNOWN, artistService.getAllArtists().get(1));
        Album philharmonics = new Album(3, "Philharmonics", Genre.UNKNOWN, artistService.getAllArtists().get(2));
        /* Use another service to determine the album genre. */
        worry.setGenre(conversionService.convert(worry, Genre.class));
        blackTerryCat.setGenre(conversionService.convert(blackTerryCat, Genre.class));
        philharmonics.setGenre(conversionService.convert(philharmonics, Genre.class));
        /* Compile the list of albums to give to our controllers. */
        list.add(worry);
        list.add(blackTerryCat);
        list.add(philharmonics);
    }

    public List<Album> getAllAlbums() {
        return list;
    }
}
~~~

To determine the album genre an implementation of the Spring [`Converter`](https://docs.spring.io/spring/docs/4.3.x/javadoc-api/org/springframework/core/convert/converter/Converter.html) is used to convert album information to a genre. Again, this is a facile implementation provided for the purposes of the simple example.

~~~java
package com.github.pagram1975.autowiremagic.converter;

import com.github.pagram1975.autowiremagic.model.web.Album;
import com.github.pagram1975.autowiremagic.model.web.Genre;
import org.springframework.core.convert.converter.Converter;

public class AlbumToGenreConverter implements Converter<Album, Genre> {

    @Override
    public Genre convert(Album album) {
        switch (album.getTitle()) {
            case "Worry":
                return Genre.PUNK_POP;
            case "Black Terry Cat":
                return Genre.RNB;
            case "Philharmonics":
                return Genre.FOLK;
            default:
                return Genre.POP;
        }
    }
}
~~~

The `AlbumToGenreConverter` must be registered with Spring's [`DefaultConversionService`](https://docs.spring.io/spring-framework/docs/4.3.x/javadoc-api/org/springframework/core/convert/support/DefaultConversionService.html) to be used within the application. This is done by registering the `DefaultConversionService` bean and adding the `AlbumToGenreConverter` to the list of converters. The application configuration includes the two services defined above.

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="conversionService" class="org.springframework.context.support.ConversionServiceFactoryBean">
        <property name="converters">
            <set>
                <bean class="com.github.pagram1975.autowiremagic.converter.AlbumToGenreConverter"/>
            </set>
        </property>
    </bean>
    <!-- The AlbumService construtor has two parameters, here we're only giving Spring 
         the details of one of them and not providing the conversionService. -->
    <bean name="autowire.AlbumService" class="com.github.pagram1975.autowiremagic.AlbumService">
        <constructor-arg ref="autowire.ArtistService"/>
    </bean>
    <bean name="autowire.ArtistService" class="com.github.pagram1975.autowiremagic.ArtistService"/>
</beans>
~~~

This configuration is deliberately incomplete. The bean definition for the `AlbumService` has only been provided the details for the `ArtistService`, the details of the `ConversionService` are not provided.

The final piece of the application is an `AlbumController` which exposes a couple of endpoints to display the list of albums. This `AlbumController` needs the `AuthorService` for its data, this is easily done using `@Autowired`. You can view this code in the [project](https://github.com/pagram1975/autowiring-magic-spring-boot) on GitHub.

With the inconsistency between the configuration and the code it would be acceptable for Spring to report the error when the application is started. What happens is that Spring fills in the missing parameter with the `ConversionService` and the application starts, and runs, without reporting the issue. 

So, what's really going on? To see what's happening enable `TRACE` level logging in the application. This is simply a case of passing `--trace` as a program argument at runtime. In IntelliJ Idea that looks like this (open these images in a new tab to see them in more detail).

![Adding --trace as a program argument in IntelliJ Idea]({{site.baseurl}}/pgraham/assets/IntelliJTrace.png)

The trace logging contains some lines that show exactly where the `AlbumService` creation was processed and the `ConversionService` dependency was resolved.

~~~text
TRACE 15600 --- [           main] o.s.b.f.annotation.InjectionMetadata     : Processing injected element of bean 'albumController': AutowiredFieldElement for private com.github.pagram1975.autowiremagic.AlbumService com.github.pagram1975.autowiremagic.autowired.AlbumController.albumService
DEBUG 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Creating shared instance of singleton bean 'autowire.AlbumService'
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Creating instance of bean 'autowire.AlbumService'
DEBUG 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Creating shared instance of singleton bean 'autowire.ArtistService'
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Creating instance of bean 'autowire.ArtistService'
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Eagerly caching bean 'autowire.ArtistService' to allow for resolving potential circular references
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Finished creating instance of bean 'autowire.ArtistService'
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Returning cached instance of singleton bean 'conversionService'
DEBUG 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Autowiring by type from bean name 'autowire.AlbumService' via constructor to bean named 'conversionService'
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Eagerly caching bean 'autowire.AlbumService' to allow for resolving potential circular references
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Finished creating instance of bean 'autowire.AlbumService'
~~~

As in [part 1]({{ site.github.url }}/2020/02/25/spring-autowiring-its-a-kind-of-magic.html), it is possible to inspect what's happening in detail by adding a breakpoint into the Spring code, in this case in the `ConstructorResolver` class that Spring uses, and debugging the process. The trace log provides some text to search for to set the initial breakpoint (there must be a statement that includes `logger.trace("Autowiring by type from bean name`). This logging is within a method [`createArgumentArray()`](https://docs.spring.io/spring/docs/4.0.2.RELEASE_to_4.0.3.RELEASE/Spring%20Framework%204.0.3.RELEASE/org/springframework/beans/factory/support/ConstructorResolver.html#createArgumentArray-java.lang.String-org.springframework.beans.factory.support.RootBeanDefinition-org.springframework.beans.factory.config.ConstructorArgumentValues-org.springframework.beans.BeanWrapper-java.lang.Class:A-java.lang.String:A-java.lang.Object-boolean-), (Aside - this is a great example of a method name that helps a developer understand what the method does).

![Debugging Spring in IntelliJ Idea to see how the constructor arguments are resolved]({{site.baseurl}}/pgraham/assets/IntelliJConstructorResolverCreateArgumentArray.png)

Looking up the stack a little the `createBeanInstance()` method on the `AbstractAutowireCapableBeanFactory` class from [part 1]({{ site.github.url }}/2020/02/25/spring-autowiring-its-a-kind-of-magic.html) features. The thing that Spring is doing is creating a bean instance, in this case the bean is `AlbumService`. Clicking on the method shows the entry point into the `createArgumentArray()` method. Examination of the variables at this point shows that the constructor that Spring will call has been identified, this is stored in the `ctors` variable that can be seen at the bottom of this image.

![Debugging Spring in IntelliJ Idea to see the constructor for AlbumService has been chosen]({{site.baseurl}}/pgraham/assets/IntelliJCreateBeanInstance2.png)

At this point Spring has selected the constructor that takes two parameters from the `AlbumService` class, even though the configuration told Spring to create the `AlbumService` by calling a constructor with a single parameter. This is reasonable as the `AlbumService` only has one constructor available. The image above shows the value of the `ctors` variable is the result of a call on the function `determineConstructorsFromBeanPostProcessors()`. Looking at the code for that method shows that this method calls down onto the `determineCandidateConstructors()` that cropped up in [part 1]({{ site.github.url }}/2020/02/25/spring-autowiring-its-a-kind-of-magic.html).

![Debugging Spring in IntelliJ Idea to see the code for the determineConstructorsFromBeanPostProcessors method]({{site.baseurl}}/pgraham/assets/IntelliJDetermineConstructorsFromBeanPostProcessors.png)

The `determineCandidateConstructors()` uses [Java reflection](https://www.oracle.com/technical-resources/articles/java/javareflection.html) to determine the constructors that are available to create the `AlbumService`. Within the `determineCandidateConstructors()` class the Spring code calls [`Class.getDeclaredConstructors()`](https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html#getDeclaredConstructors--), a method that has been around since JDK1.1.

Spring has determined from the information it has available that the `AlbumService` must be created using the constructor that takes two parameters. It's the only constructor available on the class, so there are no other options. Spring is not ignoring the configuration that has been provided, though. Spring uses the information for the parameter values that have been provided within the configuration.

![Debugging Spring in IntelliJ Idea to see the configuration data held in the RootBeanDefinition]({{site.baseurl}}/pgraham/assets/IntelliJRootBeanDefinition.png)

Examining the parameters passed into the `autowireConstructor()` method, one of them is named `mdb` and is of type `RootBeanDefinition`. This contains the configuration information that was provided in the xml config file. The image shows that Spring has taken the argument given in the configuration as a value to pass into the constructor being invoked, in this case a reference to the bean named `autowire.ArtistService`.

At this point the investigation has discovered that Spring has used reflection to identify a constructor to call to create the `AlbumService`. Spring has also obtained a value to pass to one of the constructor parameters from the incomplete configuration. The final piece of information Spring requires is the value for the constructor parameter that is missing from the configuration. This is the `ConversionService` that includes the `AlbumToGenreConverter`.

Spring fills in the value for this parameter by determining its type, then checking the contents of the bean registry. For this case Spring finds there is one bean of type `ConversionService` registered, so it passes this instance into the constructor. Another look at the last four lines of the trace logging shows that Spring reports that it is Autowiring the `ConversionService` into the `AlbumService`.

~~~text
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Returning cached instance of singleton bean 'conversionService'
DEBUG 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Autowiring by type from bean name 'autowire.AlbumService' via constructor to bean named 'conversionService'
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Eagerly caching bean 'autowire.AlbumService' to allow for resolving potential circular references
TRACE 15600 --- [           main] o.s.b.f.s.DefaultListableBeanFactory     : Finished creating instance of bean 'autowire.AlbumService'
~~~

There are differences between the code paths Spring executes if the dependency on the `ConversionService` member of `AlbumService` is annotated with `@Autowired` and the code paths explored above. The most notable of these is that `@Autowired` annotations are processed after the constructor is called. This means the dependencies are available to the bean at different times during its lifecycle depending on how the dependency is injected.

The current implementation of `AlbumService` does all its processing in the constructor, so uses the `ConversionService` before any `@Autowired` annotations would be processed. Removing the `ConversionService` argument from the constructor and annotating the class member will cause a `NullPointerException` as soon as the `ConversionService.convert()` method is called. 

It's a simple change to refactor this functionality out into other methods, but if code has to be changed it's always a good idea to know the reasons that make the change necessary. It's never easy to justify a Merge Request for refactoring to the rest of the team without at least some kind of an explanation.

### If it isn't broken...

This shows that Spring will do everything it can with the configuration information that is available, and then do some more. It may be simpler if the code provided above did everything by annotation of `@Autowired` and the code was refactored accordingly. Dependency injection done via annotation makes life easy, after all. However, it is possible to introduce ambiguity into an application where dependencies are exclusively resolved using the `@Autowired` annotation, for example if more than one `ConversionService` beans is registered.

For some projects it makes sense to separate out the dependency configuration into an xml resource so that it is possible to get a view of the application structure and the dependency links between services, controllers and other types of objects. With this type of configuration resource it is possible that inconsistencies might be introduced. If this happens, and Spring plugs the gaps, then it's probably fine, *isn't it?*

When I initially found the inconsistency in my project the first reaction I had was to correct the configuration. The inconsistency was exactly the same as the one explored in this post, a constructor argument of type `ConversionService` was missing for a specific bean, but the application was still working. I only discovered the issue by chance because I was editing that one specific bean configuration in the project. However, what would the impact have been on the project if I had not found the omission of this one argument, and why correct it if everything was working fine?

### ...fix it anyway

Using Spring has introduced a potential strange state for development work. This state is one where the configuration of an application can be incorrect, but the application remains operational. There are issues with this state, although they are not immediate.

In the simple project the use of the configuration xml file reduces the risk of ambiguity for dependencies. If the configuration is fixed to include the `ConversionService` constructor argument it is explicitly stated which `ConversionService` should be injected into the `AlbumService` constructor.

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="conversionService" class="org.springframework.context.support.ConversionServiceFactoryBean">
        <property name="converters">
            <set>
                <bean class="com.github.pagram1975.autowiremagic.converter.AlbumToGenreConverter"/>
            </set>
        </property>
    </bean>
    <bean name="autowire.AlbumService" class="com.github.pagram1975.autowiremagic.AlbumService">
        <constructor-arg ref="autowire.ArtistService"/>
        <constructor-arg ref="conversionService"/>
    </bean>
    <bean name="autowire.ArtistService" class="com.github.pagram1975.autowiremagic.ArtistService"/>
</beans>
~~~

If another `ConversionService` bean is added to the project, it is explicitly stated in the configuration that the one the `AlbumService` should use is the bean named `conversionService`. If this constructor argument parameter is left omitted, an ambiguity is introduced to the project and the addition of an unrelated bean will cause the creation of the `AlbumService` bean to fail. Easy enough to track down in the simple project, but also easy enough to imagine the headache caused by a similar situation in a large, complex project.

Correcting the inconsistency is the right thing to do, and guards against unwelcome surprises in the future. What would happen, for example, if another developer added a second constructor to the `AlbumService` that took one parameter of type `ArtistService`? What would happen if that second constructor took one parameter of type `ConversionService`? Simple code changes could lead to issues that are difficult to diagnose.

## Summary

This post looked into the detail of how the Spring Framework resolves dependencies even when the configuration information is inconsistent or incomplete. In this case Spring uses [Java reflection](https://www.oracle.com/technical-resources/articles/java/javareflection.html) to determine available constructors. Spring then looks in the bean registry to fill in missing parameters by type, Autowiring in the dependency if possible. You can find all the code for the classes referenced in this post on [GitHub](https://github.com/pagram1975/autowiring-magic-spring-boot).

Spring Autowiring is powerful enough to cover mistakes, but this does not mean that inconsistencies in application configuration should be left uncorrected. Any inconsistencies have the potential to cause future problems, and at that point diagnosis of the issue could be complex, time consuming and expensive.

Thanks for taking the time to read this post. The next post in this series will explore the full scope of the bean classes and configuration defined in the [simple project](https://github.com/pagram1975/autowiring-magic-spring-boot), and summarise the investigations that have been discussed through this series.
