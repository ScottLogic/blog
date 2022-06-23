---
title: Configuring Java applications at runtime with Spring Profiles
date: 2020-07-10 00:00:00 Z
categories:
- jharris
- Tech
author: jharris
summary: We explore how to use Spring Profiles as a handy way to select the configuration
  at runtime by wiring in different beans, as well as looking at how to autowire different
  beans in for integration tests.
layout: default_post
---

Sometimes we want slightly different behaviour from our application depending on the situation at runtime.  For example, maybe we want one instance of our app to connect to a host in London and another connecting to a host in New York.  Or maybe we want a QA instance that connects to a local QA host.

In this post we'll look at using Spring profiles as a way of providing this customisation at runtime, allowing us to use the same compiled code in each case.  Under the bonnet, Spring will use these profiles to wire in different beans for the different use cases and thereby provide different behaviour.

To get started let's look at a nice and simple application where we specify the behaviour ourselves, without the benefit of the Spring framework or autowiring.  Then we can go through and see how we can modify this to get an autowired class provided by Spring, based decisions made at runtime.

The main class below simply creates a new `Connector` and then calls the `connect` method on it.

~~~ java

package com.scottlogic.profilepoc;

public class ProfilePocApplication {

	public static void main(String[] args) {
		Connector connector = new LondonProdConnector();
		System.out.println(connector.connect());
	}
}
~~~

The class `Connector` is an abstract class:

~~~java
public abstract class Connector {
    public abstract String connect();
}
~~~

and is implemented in a class called `LondonProdConnector`:

~~~ java
public class LondonProdConnector extends Connector {
    @Override
    public String connect() {
        return "I connect to a host in London";
    }
}
~~~

As the class name would suggest, this implementation is designed to run in prod and connect to a host in London.

### Autowiring the connector
Now let's look at what we need to do to make this a Spring Boot Application and allow Spring to autowire our `Connector` for us.  Here's how we need to change our application to do this:

~~~java
@SpringBootApplication
public class ProfilePocApplication {
	@Autowired
	Connector connector;

	public static void main(String[] args) {
		ApplicationContext context = new SpringApplication(ProfilePocApplication.class).run(args);
		ProfilePocApplication app = context.getBean(ProfilePocApplication.class);
		app.start();
	}

	private void start() {
		System.out.println(connector.connect());
	}
}

~~~

We've added the `@SpringBootApplication` annotation to the class and given it an `@Autowired` connector.  However, we can't autowire into a static context, so we've also moved the `connector` out of the main method and into an instance method named `start`.  What the main method now does is get an instance of our application (the bean of type `ProfilePocApplication`) which Spring *can* autowire, and this autowired connector will be called in the `start` method.

We'll also need to mark our implementation of `Connector` with the `@Component` annotation, so that the class is available for Spring to autowire in.

~~~java
@Component
public class LondonProdConnector extends Connector {
    @Override
    public String connect() {
        return "I connect to a host in London";
    }
}
~~~

### Adding profiles
So far so good.  But what happens if we have more than one implementation of `Connector`?  In this example we're also going to have a `NewYorkProdConnector` for handling a connection to New York and a `QAConnector` that will connect to a QA host.

~~~java
@Component
public class NewYorkProdConnector extends Connector {
    @Override
    public String connect() {
        return "I connect to a host in New York.";
    }
}
~~~

~~~java
@Component
public class QAConnector extends Connector {
    @Override
    public String connect() {
        return "I connect to a QA host.";
    }
}
~~~

With these extra components, Spring won't know which `Connector` to wire in, and we'll see this message if we try and run our application:

```
Field connector in com.scottlogic.profilepoc.ProfilePocApplication required a single bean, but 3 were found:
	- londonProdConnector: defined in file [...LondonProdConnector.class]
	- newYorkProdConnector: defined in file [...NewYorkProdConnector.class]
	- QAConnector: defined in file [...QAConnector.class]
```

That's where the Spring profiles come into it.  As we shall see in a moment, when we run our application we can define one or more active profiles.  Profiles are linked to the beans by putting the `@Profile` annotation on them.  We decide which profiles we want the bean to be used with and pass them into the annotation as parameters.  The bean will be registered for use if those profiles are active.

Hopefully this will be clearer with an example.  We'll go ahead and register the `LondonProdConnector` bean for use if the profiles `ldn` and `prod` are both active:

~~~java
@Profile(value="ldn & prod")
@Component
public class LondonProdConnector extends Connector {
    @Override
    public String connect() {
        return "I connect to a host in London";
    }
}
~~~

And similarly for our other implementations:

~~~java
@Profile(value="nyc & prod")
@Component
public class NewYorkProdConnector extends Connector {
...
}
~~~

~~~java
@Profile(value="test")
@Component
public class QAConnector extends Connector {
...
}
~~~

Then, at runtime, we specify which profiles are active.  If we want to use the `LondonProdConnector` like we were before then we provide `prod` and `ldn` as active profiles, matching the parameters in the `@Profile` annotation for that class:

`java -jar application.jar --spring.profiles.active=prod,ldn`

(There are [other ways](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-adding-active-profiles) of specifying the active profiles.  Later on in the post we'll look at how we can set profiles as active by default without having to pass them in at runtime.)

Any beans that don't have the `@Profile` annotation are always registered and are available no matter which profiles are active (and also available if there are no active profiles at all).  So if there are multiple implementations of a class, which is the case for our `Connector`, then we need to have `@Profile` annotations on all of them if we're going to specify active profiles.  Otherwise we'll hit the same runtime issue as before where Spring did not know which bean to use.

### Testing
We'll also need to specify which profile we want to use in integration tests, if we want our components to be autowired in for us.

Two things are needed for autowiring our test class.  First, we have to to give the test a context which can provide our beans.  In this case, we the test will use the context of the main application class by passing this as an argument into the `@SpringBootTest` annotation.  Second, we need to specify which are the active profiles when we run the test.  In this case just specifying the `test` profile is enough since, unlike the prod beans, there is just one `QAConnector` and not one for each region.

~~~ java
@SpringBootTest(classes = ProfilePocApplication.class)
@ActiveProfiles("test")
class ProfilePocApplicationTests {
	@Autowired
	Connector connector;
~~~

With the active profile specified in the annotation, the test will know to use the `QAConnector`:

~~~ java 
	@Test
	void qaActiveProfileLoadsCorrectBean() {
		String actual = connector.connect();

		String expected = "I connect to a QA host.";

		assertEquals(expected, actual);
	}
~~~

### Providing some defaults
It might be that we don't want to have to tell Spring which profile to use every time we run our application. Maybe as a developer it's getting a bit tiresome adding the `@ActiveProfile` annotation to all of our tests so we want them to use that profile by default.  So let's remove the `@ActiveProfiles("test")` from our test class.  As it currently stands the test will fail as it won't be able to find a bean to provide for the autowired `Connector`.

Happily, there's a way to fallback to a set of default active profiles.  If we're using a maven or gradle build then we can create a properties file in the following location and the build process will automatically put it on the classpath when we run our tests:

`src/test/resources/application.yml`

(And we would use `src/main` rather than `src/test` if we wanted the file on the classpath for our main build.)

Inside this yaml file we can specify default spring profiles.  For our tests to work we just need the `test` profile to be active by default:

~~~ yaml
spring:
  profiles:
    default: test
~~~

Since we are no longer specifying an active profile through the annotation, the test will fallback to using the default `test` profile and this in turn will wire in the `QAConnector`.  Of course, if we do provide an active profile that will be used to determine the beans instead.

### A note on syntax
I'll go into a quick aside to show some of the different options we have available for us when we use the `@Profile` annotation to determine which profiles we want as active.  The functionality can be quite powerful, although we haven't needed it in our example application.

We can pass in a single profile, as we do with qa:

~~~ java  
@Profile(value="qa")
~~~

or multiple profiles, as we do with the prod connectors:

~~~ java
@Profile(value="ldn & prod")
~~~

we can set an "or" condition:


~~~ java
@Profile(value="ldn | prod")
~~~

which can also be passed as as a comma separated list:

~~~ java
@Profile(value={"ldn", "prod"})
~~~


We can also use more complex expressions for the parameters, for example register a bean if either the profiles `nyc` or `ldn` are active as well as the `prod` profile:

~~~ java
@Profile(value="(nyc | ldn) & prod")
~~~

and if we have more complex requirements its possible to use [regex matching](https://raymondhlee.wordpress.com/2015/05/31/using-spring-4-condition-to-control-bean-registration/) to register beans.

### Summary
Spring profiles provide a handy way to specify at runtime which configuration of beans we want to use.  When we run the app, we specify one or more profiles as "active" and allow Spring to select which beans to use based on annotations we've put on the beans themselves.  This can be used to change the behaviour of the app without having to recompile or redeploy anything.

We've also seen that we can use the properties file to specify a default profile if we're not passing one in at runtime and we've seen how to set the active profile on a test class in order to use different beans in the application's integration tests.