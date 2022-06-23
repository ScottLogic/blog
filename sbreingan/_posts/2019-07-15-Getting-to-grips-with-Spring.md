---
published: true
author: sbreingan
layout: default_post
category: Tech
title: Getting To Grips With Spring Boot
tags: Java
summary: >-
  Spring Boot applications have quickly become one of the most popular Java
  frameworks due to the speed and simplicity of creating production ready
  applications. Sometimes the world of Spring can be confusing - in this post I
  give an overview of some fundamentals of Spring, what Spring Boot is actually
  doing, and where to start if things go wrong.
image: sbreingan/assets/springs.jpg
---

Developing enterprise Java applications is hard. There is often a lot of complicated configuration, plumbing, and boilerplate code required before you can even get down to writing any business logic. Then you have to worry about security, data-flow, networking, service-discovery. We need to think about security, discovery, data management, networking, data flow - we don't want to re-invent the wheel every time.

If you've been around enterprise Java development for any length of time you will likely come across Spring - not just a time to set your clocks forward and look at the daffodils but also the leading Java framework!

Using the [Spring initalizr](https://start.spring.io/) and picking a few dependencies, within a matter of minutes you could be running a fully-fledged production-ready application such as secure RESTful service connected to a database backend. If there is a feature you need, chances are there is probably a Spring library for it. My first impression creating a Spring Boot application was just how simple it is to start serving up content with a few lines of code.

![Springs]({{site.baseurl}}/sbreingan/assets/springs_large.jpg)

However once I started working on larger Spring projects, and once things started becoming more complicated, at times I would find myself getting a little lost. 

*What do all these annotations do again? Why is my application even working at all?*

Worse still are moments when things break, and Spring produces some cryptic error message. Instead of trying to understand what is going on it can seem easier resorting to Stack Overflow, trying different properties and annotations until something works.

Sometimes you need to take a step back, take a deep breath and try and think through what Spring is actually doing.  

So for this post I'm going focus on some of the basics of Spring, give an overview of what Spring does along with a few considerations on how to use it. I should note that term 'Spring' actually encompasses [a *lot* of different projects](https://spring.io/projects), but for the purposes of this post I'm focussing on Spring Boot and the core Spring framework that it is built on.

## Dependency Injection

What makes a Spring application different from a normal Java application?

Start reading some of the documentation around the Spring framework and you might come across the terms *Dependency Injection* and *Inversion of Control.* 

If you were to write a simple Java application from scratch, you would have complete control and transparency over where and when all the objects were created.  We could start at our main method, step through with the debugger and follow the flow of our application from the beginning.

When we talk about *Inversion of Control* what we generally mean is that we give away some control of the flow of our application - in this case to the Spring framework. We let Spring determine how best to start up and instantiate objects. This makes it easier to manage dependencies between our classes.

Let's imagine an application which fetches information about users, in a class called `UserService`.  As part of this class we are required to lookup a profile picture from a separate `ProfileImageProvider` object - this a dependency of our class. `ProfileImageProvider` may have multiple implementations depending on the context and where we want to get images from. In this example we have a class which fetches from [Gravatar](https://en.gravatar.com/).

~~~ java
public class UserService {
    
    private ProfileImageProvider imageProvider;
    
    public UserService(){
     	imageProvider = new GravatarImageProvider();
    }
    
    public String getProfileImageUrl(String username){
        return imageProvider.getProfileImageUrl(username);
    }
}
~~~
At some point we need to create a concrete instance of a `ProfileImageProvider` but doing so in the `UserService` class, as above, means these classes are _tightly coupled_. This makes our design less flexible - we can't change Gravatar for another service without also updating `UserService`. For a large enterprise application with a lot of dependencies this won't scale well.

We may improve the situation by passing down our image provider in the constructor: 

~~~ java 
    public UserService(ProfileImageProvider imageProvider){
        this.imageProvider = imageProvider;    
    }
~~~ 
We would still need to decide when to create our Gravatar image provider and how we are going to pass it in. We can instead delegate that job to the Spring framework - `UserService` class needs an instance of `ProfileImageProvider` but we leave it to Spring to determine where to get it from. 

When the application starts Spring is responsible for *injecting this dependency* into the constructor. 

## Configuring Beans and ApplicationContext

On start-up Spring creates the *ApplicationContext*. This is the object that stores all these dependencies so they can be wired into the application where they are needed. Spring refers to these dependencies as _Beans_.

How do we tell Spring about our `ProfileImageProvider` bean so that it knows it can use it? 

### @Configuration classes

In the earlier versions of Spring this was done through XML configuration - it's not pretty, but this is still supported and if you search some of the documentation you may find examples that use it. It may be helpful to understand it if looking at legacy code but since Spring 3 configuration can be done in Java classes by using the `@Configuration` annotation and the `@Bean` annotation. 

~~~ java
@Configuration
public class AppConfiguration {
    
    @Bean
    ProfileImageProvider getProfileImageProvider(){
        return new GravatarImageProvider();
    }
}
~~~

This configuration class tells Spring to create a new `GravatarImageProvider` object and the `@Bean` annotation tells Spring to add the returned class to the _ApplicationContext_. It is then available to be injected anywhere requiring a `ProfileImageProvider` object. 

We are still explicitly controlling the creation of this object - we can add more logic to the `getProfileImageProvider` method if required.

### Component Scanning

The second way we can add objects to our _ApplicationContext_ is by labelling an entire class with the `@Component` annotation. 

~~~ java
@Component
public class UserService {
    
    public UserService(ProfileImageProvider imageProvider){
        this.imageProvider = imageProvider;    
    }
~~~

If we have the `@ComponentScan` annotation present on a class, Spring will scan all classes in the same package and look for any components which it will add to the _ApplicationContext_. Spring Boot will do this by default when using the `@SpringBootApplication` annotation.

As Spring starts scanning classes, if it finds one with marked with `@Component`, it will automatically try and create an instance of it to add to the context.  

If the above component class and the previous `AppConfiguration` were in the same base package, Spring would automatically create a `UserService` object at start up, calling the constructor with the `GravatarImageProvider` created in the configuration.

### Other Annotations

If you've seen examples online, you may see different class annotations such as `@Service` or `@Controller`. These are specializations or aliases of `@Component` - they behave in the same way and are added to the context during the component scan. Some, for example `@Repository` or `@RestController`, will add additional Spring features to the class.

In fact the `@Configuration` annotation is itself an alias for `@Component` - this is why configurations are automatically picked up when component scanning is enabled.

### Losing Control

You might think this sounds like a big win - having Spring scanning and automatically creating objects with a one line annotation. Let's consider our `UserService` again - and let's say we've given it a `@Service` annotation because we want to indicate it belongs in the service layer of our application.

Suppose we are writing some tests or running in a different environment and someone decides to overload the `UserService` constructor by adding a title for our Users group.

~~~ java
@Service
public class UserService {

    private ProfileImageProvider imageLookup;
    private String groupName = "Users";

    public UserService(ProfileImageProvider imageLookup){
        this.imageLookup = imageLookup;
    }

    public UserService(ProfileImageProvider imageLookup, String groupName){
        this(imageLookup);
        this.groupName = groupName;
    }
~~~

Everything still compiles and all our unit tests are working. But what is going to happen when we run our Spring application?

We'll get a large stack-trace, and if you've used Spring a lot it's the type of error you are likely to have come across at some point. 

~~~
Error creating bean with name 'userService' defined in file [UserService.class]: 
Instantiation of bean failed; nested exception is org.springframework.beans.BeanInstantiationException: Failed to instantiate [com.test.UserService]: No default constructor found; nested exception is java.lang.NoSuchMethodException: com.test.UserService.<init>()
~~~

Spring couldn't automatically create a `UserService` object because it didn't know which constructor to use. Additionally, if this class had a no-argument constructor Spring would choose it by default - we may then start getting some null pointer exceptions we don't expect.

There are ways we can solve this - for example marking our preferred constructor with an `@Autowired` annotation will tell Spring which one to use.

However, one of the advantages of keeping bean creation in a configuration class is we can always retain control about how they are created. 

~~~ java
@Configuration
public class AppConfiguration {

    @Bean
    ProfileImageProvider getProfileImage(){
        return new GravtarImageProvider();
    }

    @Bean
    UserService getUserService(ProfileImageProvider imageLookup){
        return new UserService(imageLookup, "Developers");
    }

}
~~~

If you want to be _even_ more explicit you [can avoid component scanning altogether](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-using-springbootapplication-annotation.html) and use the `@Import` annotation to add these configuration files directly. This will ensure we aren't bringing in any beans from configurations accidentally because they happen to be in the same package.

If you are seeing errors with your beans when Spring is starting up but aren't sure why, it's worth stepping back and thinking about where everything is being created:

- Is this bean getting created automatically because it is annotated with `@Component` or some alias annotation? Does it have an unambiguous way for Spring to create it?
- Is my component or configuration in the correct base package for Spring to find during the scanning stage? Am I sure about which packages are being scanned?
- Are there multiple beans of the same object in our configuration classes? [Am I being explicit about which one to use?](https://docs.spring.io/spring/docs/5.2.0.M3/spring-framework-reference/core.html#beans-autowired-annotation-primary)

### Finding the balance

Spring also supports *field injection* using the `@Autowired` annotation, meaning a private field in a class can automatically be populated by a bean from the ApplicationContext without injecting in the constructor; you may see this in some example code online.

If we removed all our constructors for `UserService` the code below would still work.

~~~ java
@Service
public class UserService {

    @Autowired
    private ProfileImageProvider imageLookup;

    public String getProfileImageUrl(String username){
      return imageProvider.getProfileImageUrl(username);
    }
}  
~~~

Whilst again this may be seem like a good idea, there are many reasons why this is not recommended - if we ran this class outside of the Spring framework, our `imageLookup` object is going to be null, and it's going to make testing `UserService` harder. Injecting beans through the constructor is therefore preferable in most cases. 

With a lot of these features in Spring it is worth taking some time to look at the options in the documentation and consider the trade-offs when letting the framework automatically take control.

## Using Properties

We've seen how we can use `@Configuration` files in Java, creating beans which load in the ApplicationContext.

Another important part of a Spring application is the `application.properties` file, which lives in the resources folder.

Perhaps we now want to add a default image URL as a fallback when looking up our profile picture. We can use the `@Value` annotation in our configuration file to tell it to fetch from the Spring properties.

~~~ java
  @Bean
  ProfileImageProvider getImageLookup(@Value("${customer.default-image}") String defaultImage){
    return new GravtarImageProvider(defaultImage);
  }
~~~

Then in our `application.properties` file we can add a line to provide that value.

~~~
customer.default-image="default-picture.jpg"
~~~

There are many ways Spring can obtain properties - environment variables, mapping onto a class with `@ConfigurationProperties`, through the command line or even using a [configuration server](https://spring.io/projects/spring-cloud-config). With [Spring Profiles](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html#boot-features-external-config-profile-specific-properties) we can run with different properties files for each of our environments. It's helpful to look at the [documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) to understand the various approaches available and the priority each one takes.

Again, Spring will generally inject these properties anywhere you add a `@Value` annotation. 

If you are changing `application.properties` and things aren't working, try and think about how and where those properties might be getting used for creating a bean.

## Spring Boot

So about Spring Boot? Built on top of these Spring features it has now become the [most popular Java framework](https://www.jetbrains.com/lp/devecosystem-2019/java/). 

You can read about some of the fine details of how it works, but essentially Spring Boot is the part of Spring that allows you to very quickly create a functioning web-application packaged in a single jar, which can be run as a single command. 

In a lot of situations Spring Boot allows you to add features and "just run" without worrying about what's under the hood; it is designed to be that way.

I think it can be helpful, however, to have some passing understanding of what's going on, just to remind yourself [that's it's not actually magic.](https://content.pivotal.io/springone-platform-2017/its-a-kind-of-magic-under-the-covers-of-spring-boot-brian-clozel-stéphane-nicoll) It's still just Java code, and if you delve deep enough you can find out what it is doing. 

### Spring Boot starters

If you'd created Spring Boot projects before you may be familiar with [Spring Boot starter projects](https://docs.spring.io/spring-boot/docs/2.1.6.RELEASE/reference/htmlsingle/#using-boot-starter). These are dependencies you add to your build manager which tell Spring Boot what kind things you need to build in your application. 

If you add the `spring-boot-starter-web` as a dependency, your application is now ready to serve up RESTful content from an embedded Tomcat webserver (amongst other things).

Looking at the [source](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters) for the Spring Boot starters you will find that they contain no code, but are simply Maven *pom.xml* files pulling in the relevant dependencies. So how is Spring doing all its out the box magic?

### Auto Configuration

Let's say you've added the web starter, you've added a `@RestController` class with end-points for serving up data, and then edit the `spring.properties` to change the port that tomcat is running on. 

~~~
server.port=3000
~~~

Your Spring Boot app can now run, serving up content from that port.

We might have created a few of our own beans in some `@Configuration` classes, but behind the scenes Spring Boot is creating a *lot* more, automatically. 

Spring Boot has its own set of `@Configuration` classes. Once it has scanned our user configurations, it starts scanning through a list of all the _auto configuration_ classes. You can see the source code for these configurations inside the [autoconfigure project of Spring Boot](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure).

As an example, inside the source code for the [web server auto configuration](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/servlet/ServletWebServerFactoryAutoConfiguration.java), you can see Spring generating a bean of the (succinctly named) class `TomcatServletWebServerFactoryCustomizer`. It injects a `ServerProperties` object which has been derived from our properties file, which will tell it the port to run Tomcat on. 

~~~ java
	@Bean
	@ConditionalOnClass(name = "org.apache.catalina.startup.Tomcat")
	public TomcatServletWebServerFactoryCustomizer tomcatServletWebServerFactoryCustomizer(
			ServerProperties serverProperties) {
		return new TomcatServletWebServerFactoryCustomizer(serverProperties);
	}
~~~

This bean has another annotation here - `@ConditionalOnClass`.  

Part of the automatic configuration of Spring Boot is that these beans and configuration classes have _conditionals_ on them. In the above case this code is saying *only create this bean if apache Tomcat is already on the class path*, which it is, because we brought it in as part of our web starter. 

There are several different ways these [conditions can be expressed]( https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-developing-auto-configuration.html) - whether a class exists, whether a bean of the same type already exists, whether a property or a resource exists. 

When we start our application Spring Boot is making a lot of decisions about what beans should exist, how they are initialised and under what circumstances, rather than leaving it up to you to decide. This is why Spring Boot is described as being '*opinionated*' - it doesn't have strong views on politics, but it does have strong views on what the sensible defaults should be for your application. 

##### Conditions Evaluation Report

Finally, if you've ever run a Spring Boot application with the `--debug` command, you will have come across a large output at the start called the conditions evaluation report:

~~~
   GenericCacheConfiguration matched:
      - Cache org.springframework.boot.autoconfigure.cache.GenericCacheConfiguration automatic cache type (CacheCondition)

   JmxAutoConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.jmx.export.MBeanExporter' (OnClassCondition)
      - @ConditionalOnProperty (spring.jmx.enabled=true) matched (OnPropertyCondition)

   JmxAutoConfiguration#mbeanExporter matched:
      - @ConditionalOnMissingBean (types: org.springframework.jmx.export.MBeanExporter; SearchStrategy: current) did not find any beans (OnBeanCondition)
~~~

Perhaps, like me, you have glossed over this as just noise in the debug logs. 

Hopefully now it's a little clearer what this is. Spring Boot is showing us all the Configuration classes it loaded in during its AutoConfiguration stage, the beans it created and the conditions which caused it to do so. 

In most cases you shouldn't have to worry about these details - the whole idea behind Spring Boot is that it deals with setting everything up, so you don't have to. Knowing a little a bit about how it works can be helpful however and when things go wrong it can give you some hints about where to look.

##  Summary

Trying to understand the Spring framework can seem daunting at first. There is a huge amount of material out there, and many ways to achieve the same thing. 

I've talked about some of the fundamentals of dependency injection, bean configuration and how Spring Boot builds upon those, allowing us to create functional apps out the box with its auto configuration. 

There are obvious benefits to letting Spring set up things automatically and it's part of the reason why we want to use such a framework in the first place. Being aware of the trade-offs and the places your application is handing control to the Spring framework can help to keep a high-level picture of how everything fits together and what the culprit might be if Spring starts throwing up errors.
