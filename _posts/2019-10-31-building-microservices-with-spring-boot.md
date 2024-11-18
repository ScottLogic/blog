---
title: Building Microservices with Spring Boot - Part 1
date: 2019-10-31 00:00:00 Z
categories:
- Tech
author: jhenderson
summary: A practical series on building Microservices with Spring Boot and Spring Cloud. In this post we get started by building some services for an online shop and tie them together with 2 more services, backed by Netflix's Eureka and Zuul.
layout: default_post
---

The term "microservices" is used to describe a software architectural design whereby many loosely-coupled components run independently, but ultimately work together as a single application. Services typically focus on particular aspects of a business domain or business entities and they tyically use a network to communicate.

When I became interested in microservices, I felt that I understood the idea at a conceptual level, but I still had many knowledge gaps surrounding the intricacies of their implementation. Without practical experience, I had little understanding of how services communicated, scaled, handled failures or how they were arranged and exposed to the outside world.

This post intends to be a hands-on, introductory guide to building microservices with Spring Boot and software developed by Netflix with the intention of answering these questions. You can find all of the code on [GitHub](https://github.com/jrhenderson1988/building-microservices-with-spring-boot/tree/part-1).

## Spring Cloud and Netflix OSS

Netflix became one of the earliest adopters of microservices, having transitioned their monolithic application to a horizontally scalable, distributed architecture long before the term "microservices" gained any sort of traction.

Over the years Netflix have open-sourced a number of tools (that they continue to use internally) as part of the [Netflix Open Source Software Center (Netflix OSS)](https://netflix.github.io/) project. Many of these tools have been adopted by the Spring team as part of the Spring Cloud project, which provides tools to assist developers with some of the common patterns used when building distributed systems.

## The Project

Let's imagine a simple online store scenario, where *customers* can place *orders*. We can already identify some services that we'll need - a customer service and an order service. We'll take it step by step to build out each one.

> Note: For the purposes of this demo, we'll be sticking to Java projects using Gradle and Spring Boot 2.2.0. Feel free to use Maven or a different supported language if you prefer. We'll also be using the *group*/*package* `com.github.jrhenderson1988` for all projects.

## The Customer Service

Let's head over to [start.spring.io](https://start.spring.io/) to create our *Customer Service* project. This is generally the best starting point for any new Spring Boot application. If you've ever watched any talks by Spring Developer Advocate and Java Champion, [Josh Long](https://twitter.com/starbuxman), and I recommend that you do, you'll learn why this is the second best place on the Internet (after production, of course)!

Create a project with an *Artifact* of `customer-service`, specifying only *Spring Web* as a dependency, then hit *Generate* to download it. Once downloaded and extracted, we'll create a `Customer` class to use as our domain object:

~~~java
package com.github.jrhenderson1988.customerservice;

public class Customer {
    private final int id;
    private final String name;

    public Customer(final int id,  final String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
~~~

Then we'll add a `CustomerController` class which exposes a couple of endpoints to allow us to view all customers and individual customers by ID:

~~~java
package com.github.jrhenderson1988.customerservice;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Arrays;
import java.util.List;

@RestController
public class CustomerController {
    private List<Customer> customers = Arrays.asList(
            new Customer(1, "Joe Bloggs"),
            new Customer(2, "Jane Doe"));
    
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customers;
    }
    
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable int id) {
        return customers.stream()
                        .filter(customer -> customer.getId() == id)
                        .findFirst()
                        .orElseThrow(IllegalArgumentException::new);
    }
}
~~~

> The data is represented here as a property in the controller class, which is a bad idea and nothing like a real application. Not only would this mean that each instance of a given microservice has its own data, but it also ignores concurrency concerns, since controllers are singletons in Spring. In reality, an application would have an external datasource and use something like JPA to connect to it. In this demo I've opted to keep things simple just for illustrative purposes.

Finally, let's configure the Customer Service to give it the name `customer-service` and a default port `3001`. Add the following to the `src/main/resources/application.properties` file:

~~~properties
spring.application.name=customer-service
server.port=3001
~~~

Let's verify that everything is working by building and running the project using Gradle:

~~~bash
$ cd customer-service
$ ./gradlew bootRun
~~~

Visiting [http://localhost:3001](http://localhost:3001) should display a list of customers represented in JSON. Open [http://localhost:3001/1](http://localhost:3001/1) to see Joe Bloggs or [http://localhost:3001/2](http://localhost:3001/2) to see Jane Doe as individual data items.

## The Order Service

The setup for the Order Service is virtually identical to that of the Customer Service. Create a project with the *Artifact* `order-service` using [start.spring.io](https://start.spring.io) and the same dependencies as before. Then we can add an `Order` domain object:

~~~java
package com.github.jrhenderson1988.orderservice;

public class Order {
    private final int id;
    private final int customerId;
    private final String name;

    public Order(final int id, final int customerId, final String name) {
        this.id = id;
        this.customerId = customerId;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public int getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }
}
~~~

Then create an `OrderController` to handle the endpoints:

~~~java
package com.github.jrhenderson1988.orderservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class OrderController {
    private final List<Order> orders = Arrays.asList(
            new Order(1, 1, "Product A"),
            new Order(2, 1, "Product B"),
            new Order(3, 2, "Product C"),
            new Order(4, 1, "Product D"),
            new Order(5, 2, "Product E"));

    @GetMapping
    public List<Order> getAllOrders() {
        return orders;
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable int id) {
        return orders.stream()
                     .filter(order -> order.getId() == id)
                     .findFirst()
                     .orElseThrow(IllegalArgumentException::new);
    }
}
~~~

And update the `application.properties` file:

~~~properties
spring.application.name=order-service
server.port=3002
~~~

Finally, let's run the Order Service (`./gradlew bootRun`) and [verify that everything is working](http://localhost:3002).

## Service Discovery

A microservice architecture can be incredibly dynamic. Services don't necessarily have fixed addresses, known ahead of time. They can be moved around onto different ports, machines and even different data centres entirely. More often than not, there will be many instances of a given service - a number that is rarely constant as new instances are often introduced to meet demand and are removed when demand decreases. They also need to discover other services in order to communicate with them.

[Netflix's Eureka](https://github.com/Netflix/eureka) is a service discovery tool, designed to solve this problem. When a service starts up, it registers itself with Eureka, specifying its name, address and other relevant information. It regularly sends heartbeat messages to Eureka to communicate that it's still alive and able to handle requests. If that heartbeat stops for any reason, Eureka will de-register that particular service after a configured timeout. Services can also request registry information from Eureka in order to discover other services.

![Eureka Diagram]({{ site.github.url }}/jhenderson/assets/building-microservices-with-spring-boot/eureka-diagram.jpg "Eureka Diagram")

## Discovery Service

Create a new project using [start.spring.io](https://start.spring.io) with an *Artifact* of `discovery-service`. Select *Eureka Server* as its sole dependency and hit *Generate*. Open up the `DiscoveryServiceApplication` class and add the `@EnableEurekaServer` annotation, to stand up a Eureka service registry:

~~~java
package com.github.jrhenderson1988.discoveryservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServiceApplication.class, args);
    }
}
~~~

By default, a Eureka server communicates with peers to share their registry information in order to provide high availability, but since we're just going to run a single instance here, let's disable that feature and configure our service *not* to register with a peer and *not* to fetch a peer registry. We'll also give it a name and a default port of `3000` (the default for Eureka is 8761). In `application.properties` add the following:

~~~properties
spring.application.name=discovery-service
server.port=3000
eureka.client.registerWithEureka=false
eureka.client.fetchRegistry=false
eureka.instance.hostname=localhost
eureka.client.serviceUrl.defaultZone=http://${eureka.instance.hostname}:${server.port}/eureka/
~~~

Build and run the service (`./gradlew bootRun`) and confirm that it works by visiting [http://localhost:3000](http://localhost:3000). You should see a Eureka dashboard which displays information about the running instance:

![Eureka Dashboard]({{ site.github.url }}/jhenderson/assets/building-microservices-with-spring-boot/eureka-dashboard.png "Eureka Dashboard")

### Registering with the Discovery Service

Now our Discovery Service is up and running, our domain services must communicate with it to register themselves and to receive registry updates. To do this, we'll need to add the *Eureka Discovery Client* dependency to our projects. Usually, adding a dependency to a Gradle project is as simple as adding a line to the `dependencies` block of the `build.gradle` file. However, in this case its best to use [start.spring.io](https://start.spring.io) to regenerate our `build.gradle` file as it can be a little more tricky. Once generated, our `build.gradle` files will look something like this:

~~~groovy
plugins {
    id 'org.springframework.boot' version '2.2.0.RELEASE'
    id 'io.spring.dependency-management' version '1.0.8.RELEASE'
    id 'java'
}

group = 'com.github.jrhenderson1988'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '1.8'

repositories {
    mavenCentral()
    maven { url 'https://repo.spring.io/milestone' }
}

ext {
    set('springCloudVersion', "Hoxton.RC1")
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
    testImplementation('org.springframework.boot:spring-boot-starter-test') {
        exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
    }
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}

test {
    useJUnitPlatform()
}
~~~

Now, let's annotate our `CustomerServiceApplication` and `OrderServiceApplication` classes with the `@EnableEurekaClient` annotation:

~~~java
package com.github.jrhenderson1988.customerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class CustomerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomerServiceApplication.class, args);
    }
}
~~~

Finally, let's tell the Eureka Client where to find our Discovery Service. In each service's `application.properties`, add the following line:

~~~properties
eureka.client.serviceUrl.defaultZone=http://localhost:3000/eureka/
~~~

Spin up your `discovery-service`, followed by the `customer-service` and `order-service` applications, then open the Discovery Service's [Eureka Dashboard](http://localhost:3000) - you should see that both services have been registered.

![Registered with Eureka]({{ site.github.url }}/jhenderson/assets/building-microservices-with-spring-boot/instances-registered-with-eureka.png "Registered with Eureka")

## Routing and Server-Side Load Balancing with Zuul

In a microservice architecture there can be tens, hundreds or even thousands of services. Many are private and internal, but some need to be exposed to the outside world. We need a single entry point into the system to allow us to wire up and expose selected services to the outside world.

[Netflix's Zuul](https://github.com/Netflix/zuul) (a reference to the [Gatekeeper of Gozer](https://ghostbusters.fandom.com/wiki/Zuul) in Ghostbusters) is a JVM based router and server-side load balancer. By mapping routes to services via its configuration, Zuul can integrate with Eureka to discover service locations to load-balance and proxy requests to them.

Zuul also supports *filters* which allows developers to intercept requests before they are sent to services (Pre-filters) and responses before being sent back to clients (Post-filters). This enables developers to implement functionality that is common to all services, running either before or after requests are handled. Filters are often used for features such as authentication, load shedding and CORS management, to name just a few.

![Zuul Diagram]({{ site.github.url }}/jhenderson/assets/building-microservices-with-spring-boot/zuul-diagram.jpg "Zuul Diagram")

## Gateway Service

Back at [start.spring.io](https://start.spring.io), create a new project with the *Artifact* `gateway-service` with *Zuul* and *Eureka Discovery Client* as dependencies. Once generated, open up the `GatewayServiceApplication` class and add the `@EnableZuulProxy` and `@EnableEurekaClient` annotations.

~~~java
package com.github.jrhenderson1988.gatewayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableZuulProxy
@EnableEurekaClient
public class GatewayServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayServiceApplication.class, args);
    }
}
~~~

Now add the following to `application.properties`:

~~~properties
spring.application.name=gateway-service
server.port=80
eureka.client.serviceUrl.defaultZone=http://localhost:3000/eureka/

zuul.routes.customers.path=/customers/**
zuul.routes.customers.serviceId=customer-service

zuul.routes.orders.path=/orders/**
zuul.routes.orders.serviceId=order-service
~~~

We've given the project a name of `gateway-service`, set it to run on port `80` (which is the default for HTTP) and told it to find our Discovery Service on port `3000`. We've also added some route mappings so that requests to `/customers/**` and `/orders/**` will be forwarded to services named `customer-service` and `order-service`, respectively. Zuul uses the service registry provided by our Discovery Service to locate each target service.

Using Gradle (`./gradlew bootRun`), spin up the `discovery-service`, followed by the `customer-service`, `order-service` and `gateway-service`:

> Once everything is running, wait a couple of minutes for the Discovery Service to receive connections from each service and to propagate its registry back down to each application.

Visit [http://localhost/customers](http://localhost/customers). You should see the same JSON representation of customers as before. In fact, the `customer-service` should still be [running](http://localhost:3001). Try hitting [http://localhost/orders](http://localhost/orders) to see the orders as well.

## Summary

Let's run through what currently happens in our system:

- The Discovery Service must be started first. When it loads it sits idle, waiting for incoming connections.
- Upon starting up, the other services talk to the Discovery Service to register themselves and schedule a regular heartbeat to be sent. They also regularly request the registry information from the Discovery Service, which responds with the details of all of the registered services.
- When a request is sent to the Gateway Service, it checks its mapped routes for a match. If it finds one, it looks up the name of the target service in its local registry that it retrieved from the Discovery Service, to work out the physical address of the target service and then proxies the incoming request to it.
- The target service handles the incoming request and responds back to the Gateway Service which then responds back to the client.

In [part 2]({{ site.github.url }}/2019/11/19/building-microservices-with-spring-boot-2.html), we'll discuss inter-service communication, scaling out, client-side load balancing and communication fault tolerance using Feign, Ribbon and Hystrix.

---

<sub><sup>*Thanks to [@nomadcanuck](https://github.com/nomadcanuck) for raising an issue regarding peer-replication in the Discovery Service.*</sup></sub>
