---
author: shogarth
title: Unit Test Your Architecture with ArchUnit
tags:
  - Java
categories:
  - Tech
layout: default_post
summary: "An introduction to ArchUnit; an open-source, extensible Java unit testing library for enforcing your architectural and coding rules."
---

Automated tests provide fast, frequent and early feedback when code changes are made. Historically we've talked about unit tests, integration tests and acceptance tests, looking at increasing levels of code to business functionality. What if we could apply the same concepts to our architecture?

Enter stage left ArchUnit - a Java testing library that inspects your code's architecture. Assertions can be made on your code's structure, properties and relationships to provide further automated quality guarantees about the health of your codebase.

For the purposes of this article, I'm going to be using ArchUnit with Junit 5. Other test frameworks are compatible and available. I'll explain concepts as we go along. A complete worked solution can be found [here](https://github.com/sh1989/archunit-example) for your reference.

## Tooling Up
Firstly, add the following *test-scoped* dependencies into your project's POM:

~~~java
<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5-api</artifactId>
    <version>0.12.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5-engine</artifactId>
    <version>0.12.0</version>
    <scope>test</scope>
</dependency>
~~~

Now, it's time to write our test class.

~~~java
@AnalyzeClasses(packages = "uk.co.samhogy.example.archunit", importOptions = { ImportOption.DoNotIncludeTests.class, ImportOption.DoNotIncludeJars.class })
public class ArchitectureTests {

}
~~~

The `AnalyzeClasses` annotation sets up ArchUnit to load classes in the specified package. ArchUnit inspects the compiled bytecode and builds it into an analyzable data structure for usage within your tests. I've specified some customisation rules for loading classes to prevent the inclusion of third-party JARs and test classes.
From here, individual architectural tests are tagged with the `@ArchTest` annotation, similarly to how traditional JUnit tests are tagged with `@Test`.

I'd also recommend adding the following `logback-test.xml` configuration, to prevent a huge amount of DEBUG statements from cluttering your log files:

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml" />
    <logger name="com.tngtech.archunit" level="INFO" />
</configuration>
~~~

The rule can always be switched off if you fancy getting into the weeds of how the library initialises and operates.

## Including Pre-Configured Tests

ArchUnit ships with a set of includable tests that cover common use cases. The following snippet demonstrates two of these - enforcing that we throw meaningful (rather than generic) exceptions, and that we don't use JodaTime. I've worked in repositories that have combined JodaTime and Java Time. It gets messy quick. Let's enforce it rather than argue about it!

~~~java
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_THROW_GENERIC_EXCEPTIONS;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_USE_JODATIME;

...

@ArchTest
static ArchRule no_generic_exceptions = NO_CLASSES_SHOULD_THROW_GENERIC_EXCEPTIONS;

@ArchTest
static ArchRule do_not_use_jodatime = NO_CLASSES_SHOULD_USE_JODATIME;
~~~

There are further [common coding rules](https://static.javadoc.io/com.tngtech.archunit/archunit/0.12.0/com/tngtech/archunit/library/GeneralCodingRules.html) that you can include, which prevents `System.out` calls, ensures the correct usage of a logger and so on.

## Defining Architectural Boundaries

Let's envisage an application with a traditional 3-layered architecture:

### Web Layer
* `web` package - defines Spring MVC `RestControllers`
* `dto` package - defines API Request/Response objects

### Domain Layer
* `service` package - defines services that perform business transactions
* `domain` package - framework-independent object modelling of our business domain

### Persistence Layer
* `entity` package - defines Object-Relational Mapping entities
* `repository` package - for querying and data access

Good architectural practice ensures that we have a clear separation of responsibilities between the layers. Returning Hibernate entities from our API endpoints should be discouraged. Instead, prefer the usage of separate DTOs to prevent tight-coupling to your database schema. Likewise, the core business domain is expressed by a set of domain objects that remain independent of both. Sure, in a small sample project there's a quite a bit of duplication, but as an applications grows these will have separate concerns.

ArchUnit has out-of-the-box functionality to assert that your layered architecture is respected. Define layers by specifying the corresponding packages and then express a network of permitted dependencies between these layers. This test then provides automated assurances that access and usage is maintained according to your defined boundaries:

~~~java
@ArchTest
static ArchRule layeredArchitecture = 
    layeredArchitecture()
    .layer("Entity").definedBy("..entity..")
    .layer("Repository").definedBy("..repository..")
    .layer("Domain").definedBy("..domain..")
    .layer("Service").definedBy("..service..")
    .layer("DTO").definedBy("..dto..")
    .layer("Web").definedBy("..web..")

    .whereLayer("DTO").mayOnlyBeAccessedByLayers("Web")
    .whereLayer("Service").mayOnlyBeAccessedByLayers("Web")
    .whereLayer("Domain").mayOnlyBeAccessedByLayers("Web", "Service")
    .whereLayer("Repository").mayOnlyBeAccessedByLayers("Service")
    .whereLayer("Entity").mayOnlyBeAccessedByLayers("Repository", "Service");
~~~

If you follow a Ports and Adapters (Hexagonal Architecture, Onion Architecture) approach, don't worry. ArchUnit [provides assertions](https://www.archunit.org/userguide/html/000_Index.html#_onion_architecture) according to the terminology and dependency structures outlined [here](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/).

## Asserting Classes are in the Correct Package

The test above is fantastic for making quite sweeping assertions. It clearly communicates the design decision and acts as the source of truth. However it's easy to avoid - simply put a different type of class in a different package and use it the wrong way. Naughty, devious, nefarious! So we'll want to defend against that too.

ArchUnit provides a fluent DSL which lets you attach conditions to a given situation. This lets us assert that classes that have particular annotations must belong to particular packages, or that they have particular names. By doing so, we're establishing our coding conventions in a form that's easy to test!

~~~java
@ArchTest
static ArchRule entities_must_be_suffixed_in_correct_package = 
    classes()
    .that().areAnnotatedWith("Entity")
    .should().resideInAPackage("..entity..")
    .andShould().haveSimpleNameEndingWith("Entity");

@ArchTest
static ArchRule services_must_be_in_correct_package = 
    classes()
    .that().haveSimpleNameEndingWith("Service")
    .should().resideInAPackage("..service..");

@ArchTest
static ArchRule rest_resources_must_be_in_correct_package = 
    classes()
    .that().areAnnotatedWith("RestController")
    .should().resideInAnyPackage("..web..");

@ArchTest
static ArchRule dtos_must_be_suffixed_in_correctPackage = 
    classes()
    .that().resideInAPackage("..dto..")
    .should().haveSimpleNameEndingWith("DTO");
~~~

It's also possible to encode your decisions on particular discussions that largely come down to personal preference. Don't like using the `Impl` suffix for interface implementations? Enforce it with a test! As an added extra, the `because` block lets you go into detail about your choice. Or to be passive-aggressive.

~~~java
@ArchTest
static ArchRule classes_must_not_be_suffixed_with_impl = 
    noClasses()
    .should().haveSimpleNameEndingWith("Impl")
    .because("seriously, you can do better than that");
~~~

## The Sell

Other static analysis tools exist on the marketplace. Some are more declarative compared to the programmatic nature of ArchUnit. The power of this library comes, in my opinion, from its fluent expressions and its extensibility. By being a Java library, the language you're already familiar with, you benefit from the additional tooling capabilities and leads to an overall lower cost of maintenance.

As a tool which helps makes your knowledge of the system's operation *explicit* instead of *implicit*, ArchUnit also aids new developers who join the project at a later date. Architectural decisions are defined in code and enforced in an automated manner. Rather than relying on hearsay or reading a wiki page to establish conventions, look at the tests. They're a form of executable documentation.

It also helps you stay on the straight and narrow. There are plenty of times where a corner's cut or a rule is violated and subsequently not spotted at code review. This risks introducing a bug or incurring tech debt. We're humans. I forgive you. But by encoding these choices in an executable form we can provide fast feedback on whether changes satisfy our architectural boundaries, lowering the cost of correcting such mistakes. Also, it's one less thing to review manually.

ArchUnit has [a comprehensive user guide](https://www.archunit.org/userguide/html/000_Index.html) detailing the core concepts, alongside [a treasure trove of examples](https://github.com/TNG/ArchUnit-Examples) covering a myriad of use cases. Suffice to say I've merely scratched the surface in this article.

In summary, this is a fascinating tool that can aid keeping a codebase clean, maintainable and pleasant to work in. It's definitely worth investing in a solution that strengthens your game in this area.