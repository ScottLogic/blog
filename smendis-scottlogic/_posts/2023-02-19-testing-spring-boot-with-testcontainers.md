---
title: Testing Spring Boot With Testcontainers
date: 2023-02-19 00:00:00 Z
categories:
- Tech
tags:
- java
- spring
- spring-boot
author: smendis-scottlogic
summary: What is the best way to test the repository layer of a spring boot application? Or should you test it at all? What are Testcontainers and how to use them? This article addresses them all with examples, so you can make a better decision when you are faced with a similar challenge in future.
summary-short: Discuss how repository layer of a spring boot application can be tested using Testcontainers.
layout: default_post
---

*Looking for a better way of testing your spring boot repositories?* If this is a question that crossed your mind recently, then this article is for you. I’m hoping to share you my experience of writing integration tests to test your repository layer with the use of **Testcontainers** in this article. Hope this will help you to make a better decision next time when you are faced with the same challenge.

Before coming into how to write tests with Testcontainers, let’s try to investigate our options. Since we are using Spring Boot, you would probably be extending an interface such as `CrudRepository` or `MongoRepository` based on your choice of database to create your repository. So, one may argue that we don’t need to test the repository layer at all, since it was not written by us. For simple applications which do not have any custom repository queries this may be true. But if you are adding more functionality to your repository than what is provided by `CrudRepository` or `MongoRepository` it’s always recommended to test your repository layer with integration tests.

Ok, let’s assume you have decided to test your repository layer. The easiest would be to add an embedded database like H2 if you are using a relational database or add an embedded MongoDB solution if you are using a NoSQL storage. *Wait what?? I have a PostgreSQL database in my production, and now you are asking me to test with H2?* Since they are both relational database management systems yes you can use that approach. But I don’t recommend. Not everything in PostgreSQL is there in H2. When you have complex queries to execute there is no guarantee that passing tests in CI, means that it will work the same in production.

*Alright, then what should I do? Create a separate database just like the one I use in production, populate it with test data and use it only within my test class??* Yes, why not?? It will fix all your problems. *But wouldn’t it be too much work?* This is where the **Testcontainers** come into action. Just like you automate many things using annotations in Spring Boot, **Testcontainers** allows you to do all the things that I mentioned above in few lines of code. Of cause, this takes few minutes to run your test cases, but you can always configure your CI to run repository tests only on request which will eliminate the long test execution times and allow you to run them when you require an end-to-end testing.

### What are Testcontainers?

[**Testcontainers for Java**](https://www.testcontainers.org/) which I will be referring simply as 'Testcontainers' throughout this article is a Java library that supports testing frameworks like Junit, by providing light weighted, throwaway  instances of common databases, Selenium web browsers, or anything else that can run in a Docker container. At the time of writing this article Testcontainer libraries exists for many other popular programming languages and runtime environments such as .NET, Python, Go, Node.js and Rust. 

![Testcontainers Logo]({{ site.github.url }}/smendis-scottlogic/assets/Testcontainers.PNG)

### Building a demo Spring Boot Application

Since we have a basic understanding of what the Testcontainers are and why we need them, let’s see how we can build a basic Spring Boot application and test it using Testcontainers.

This demo application will have 2 repositories, namely `ConsultantRepository` and `ProjectRepository`. Since I intend to demonstrate the usage of Testcontainers with 2 different storages I have stored Consultants in a PostgreSQL database and Projects in a MongoDB database. I have not implemented the service layer or the controller layer as they are out of scope of this demo. However I have added the `docker-composer.yaml` file to create 2 separate docker containers, one with a PostgreSQL image and other with a MongoDB image and used them in the `application.properties` so that you can make use of them to run and build upon this demo application.

#### Prerequisites

1. JDK 17
2. Docker Desktop

#### Initialize the demo project

I have used [Spring Initializer](https://start.spring.io/) to bootstrap a basic spring boot application as follows,

![Spring Initializer]({{ site.github.url }}/smendis-scottlogic/assets/SpringInitializer.PNG)

### Adding Testcontainer dependancies

Open the project in your IDE and open the `pom.xml` file on the root folder. Add following dependancies and reload the project to load maven changes.

~~~xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>mongodb</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>
~~~

### Spin up Docker containers

Create a new file on the project root as `docker-compose.yaml` and add the following code to create 2 different containers, one for PostgreSQL and the other for MongoDB.
~~~yaml
version: '3.1'

services:
  mongo:
    image: mongo
    container_name: mongodb_container
    ports:
      - "27017:27017"
    volumes:
      - mydata:/home/db/data/mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example

  postgresql:
    image: postgres
    container_name: pg_container
    restart: always
    ports:
      - "5432:5432"
    volumes:
      - mydata:/home/db/data/postgres
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: consultants

volumes:
  mydata: {}
~~~
Then run this command on a terminal at the project root to spin up the docker containers.
~~~
docker-compose -f docker-compose.yaml up
~~~

### Updating application properties

Add following to your `application.properties` file to setup database connections
~~~
# PostgreSQL database properties
spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.show-sql=true
spring.datasource.url=jdbc:postgresql://localhost:5432/consultants
spring.datasource.username=root
spring.datasource.password=root

# MongoDB database properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=projects
spring.data.mongodb.username=root
spring.data.mongodb.password=example
spring.data.mongodb.authentication-database=admin
spring.data.mongodb.auto-index-creation=true
~~~
Now you should be able to run your demo application without and errors.

### Creating the consultants repository

Let's start this by creating a new package named `models` and adding a `Consultants.java` class to it.
~~~java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultant {
    @Id
    private UUID id;
    private String name;
    private int grade;
    private String technology;
}
~~~
`@Entity` annotation will mark this class as a entity in our relational data model. Other annotations above the class declaration are from 'lombok'. `@Data` is equivalent of having `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`