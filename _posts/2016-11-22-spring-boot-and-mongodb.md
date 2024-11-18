---
title: Spring Boot and MongoDB - a perfect match!
date: 2016-11-22 00:00:00 Z
categories:
- Data Engineering
author: bjedrzejewski
summary: The popularity of Spring Boot in the Java world is undeniable. In this post I will show you yet another reason for this. Using Spring Boot makes working with MongoDB an absolute pleasure.
layout: default_post
---

About three weeks ago I was giving a workshop titled 'Spring Boot and RESTful web services' at the
[Bristech 2016](http://2016.bris.tech/) conference. To prepare for the workshop I created a small GitHub
project called [recognitions-boot](https://github.com/bjedrzejewski/recognitions-boot). What I wanted to do is to
have a simple web service that would allow saving and reading some data from the database. This would have to be
simple enough to code and explain in a 45 minutes workshop. During that exercise and during the actual
workshop, the thing that stood out the most was- how simple it is to work with the database. [MongoDB](https://www.mongodb.com/)
with [Spring Boot](https://projects.spring.io/spring-boot/) is a truly amazing combination!

## Configuration with Spring Boot

<img src="{{ site.baseurl }}/bjedrzejewski/assets/spring-boot.png" />

The philosophy behind Spring Boot is the ability to auto-configure most things. It is a very opinionated, but flexible
framework. This auto-configuration shines when working with MongoDB- if you are going to use the default configuration
and locally running MongoDB, the whole configuration boils down to adding the following to your `.pom` file:

{% highlight java %}

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>

{% endhighlight %}

This concept in Spring Boot is known as a _starter dependency_. Adding these dependencies to your project is how you
configure it. The process of auto-configuration looks for these dependencies and configures the application
as required. You can find many more starter dependencies in the [Spring Initializr](http://start.spring.io/).
I really recommend exploring what is there as it may make your next Java project much easier and fun.
And remember- you don't need to use Spring Boot as an application server- it is perfectly fine to use it for standalone Java projects.

If you have installed MongoDB on your machine and did not change any settings, you can already see it being connect
as you start your application! Assuming that you are using a non default settings for your MongoDB, you will need to
edit the `application.properties` file, where you can supply the following properties:

{% highlight yml %}

spring.data.mongodb.host=
spring.data.mongodb.port=
spring.data.mongodb.username=
spring.data.mongodb.password=
spring.data.mongodb.database=
spring.data.mongodb.repositories.enabled=
spring.data.mongodb.uri=
spring.data.mongodb.authentication-database=
spring.data.mongodb.field-naming-strategy=
spring.data.mongodb.grid-fs-database=

{% endhighlight %}

You only have to change the values that are not set to their defaults. You may end up with completely empty
`application.properties`! Under the hood, the [Spring Data MongoDB](http://projects.spring.io/spring-data-mongodb/)
project is used. That means that if you need a more detailed information about any of the parameters, you should have a
look at the [Spring Data MongoDB documentation](http://docs.spring.io/spring-data/mongodb/docs/current/reference/html/).

There is one more trick that I want to share with you. Assuming that you do not want to install MongoDB anywhere,
but you would rather have it start as a part of your application- you can go for embedded MongoDB. Spring Boot
will connect to it without any configuration required! How do you do it? You just add a single dependency:

{% highlight java %}

<dependency>
    <groupId>de.flapdoodle.embed</groupId>
	<artifactId>de.flapdoodle.embed.mongo</artifactId>
</dependency>

{% endhighlight %}

When the auto-configuration process sees that dependency- it will start an embedded MongoDB and configure the connection.

## Working with MongoDB

<img src="{{ site.baseurl }}/bjedrzejewski/assets/mongodb.png" />

After seeing how easy it is to setup MongoDB, it is time to actually use it. In the
[example github project](https://github.com/bjedrzejewski/recognitions-boot) I have created a `Colleague` class.
I want to use it for storing different `Recognitions` that a `Colleague` may receive from her peers. The class source
code follows:

{% highlight java %}

package bristech;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bartoszjedrzejewski on 31/10/2016.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Colleague {

    @Id
    public String id;

    public String name;
    public List<Recognition> recognitions;

    public Colleague() {
        this.recognitions = new ArrayList<>();
    }

    public Colleague(String name) {
        this.name = name;
        this.recognitions = new ArrayList<>();
    }

    public Colleague(String name, List<Recognition> recognitions) {
        this.name = name;
        this.recognitions = recognitions;
    }

    @Override
    public String toString() {
        return "Colleague{" +
                ", name='" + name + '\'' +
                ", recognitions=" + recognitions +
                '}';
    }

}

{% endhighlight %}

The class is pretty simple, but you can probably imagine, that when working with JPA, you would need a few extra
annotations and certainly there would be some work left when saving this Object. Here Spring Boot comes
with yet another genius idea. You can use a concept of `MongoRepository<Colleague, String>` that will help
you with working with the database. Here is the full source of the `MongoRepository` that I used in my
[example project](https://github.com/bjedrzejewski/recognitions-boot):

{% highlight java %}

package bristech;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Created by bartoszjedrzejewski on 31/10/2016.
 */
public interface ColleagueRepository extends MongoRepository<Colleague, String> {

    public List<Colleague> findByName(String name);

}

{% endhighlight %}

As you see, this is just an `Interface`. When you look at the `Colleague` class and the `ColleagueRepository` class
it is pretty clear what we are trying to do here. The creators of Spring Boot decided that in fact, it is so clear,
that there is no need to provide any more code! You can use the following repository straight away by using `@Autowire`.
The framework will provide an appropriate implementation. It is even smart enough to understand how to implement the
`findByName(String name)` method, by looking at the parameters. To finish this discussion, let's have a look at
an application controller, that reads, saves and deletes from the MongoDB using all these features provided for us:

{% highlight java %}

package bristech;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by bartoszjedrzejewski on 01/11/2016.
 */
@RestController
public class RecognitionController {

    @Autowired
    private ColleagueRepository repository;

    @RequestMapping("/colleagues/{name}")
    public List<Colleague> getRecognition(@PathVariable("name") String name){
        return repository.findByName(name);
    }

    @RequestMapping("/colleagues")
    public List<Colleague> getColleagues(){
        return repository.findAll();
    }

    @PostMapping("/colleagues")
    public ResponseEntity<String> addColleague(@RequestBody Colleague colleague){
        repository.save(colleague);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //This is of course a very naive implementation! We are assuming unique names...
    @DeleteMapping("/colleagues/{name}")
    public ResponseEntity<String> deleteColleague(@PathVariable  String name){
        List<Colleague> colleagues = repository.findByName(name);
        if(colleagues.size() == 1) {
            Colleague colleague = colleagues.get(0);
            repository.delete(colleague);
            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}

{% endhighlight %}

As you can see here, the basic operations are automatically implemented- we can easily call `repository.findAll()`,
`repository.save(colleague)`, `repository.delete(colleague)` or even `repository.findByName(name)`. There is also
`repository.deleteAll()`, just not shown in the example code above.

## Final comments about Spring Boot and MongoDB

I think it is clear, that Spring Boot is a complete game changer when it comes to simplicity of writing small
Java applications- standalone or as embedded server. It is fascinating to see how much simpler it makes
working with the database. Configuring database connection used to require plenty of boiler plate and tinkering,
now it can be as simple as one could imagine! You really can write non-trivial web service within couple hours, thanks
to the simplicity and convenience this provides.

This post focuses on MongoDB, as it is very easy and pleasant to work with. You may
find it interesting to know that Spring Boot offers as well `JpaRepository`, which makes working with JPA similarly
easy and simpler.

I recommend trying this out yourself to really see, just how much you can achieve in a very limited time! It really
feels like the future of Java development is here!
