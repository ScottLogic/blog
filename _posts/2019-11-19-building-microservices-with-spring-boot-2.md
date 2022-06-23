---
title: Building Microservices with Spring Boot - Part 2
date: 2019-11-19 00:00:00 Z
categories:
- jhenderson
- Tech
author: jhenderson
summary: The second part of a practical series on building Microservices with Spring
  Boot and Spring Cloud. In this post we expand on our previous online store project,
  scaling out while introducing the concept of client-side load-balancing using Netflix
  Ribbon and Feign. We also implement fault and latency tolerance with Netflix Hystrix.
layout: default_post
---

In this installment of *Building Microservices with Spring Boot*, we're going to continue where we left off in [part 1]({{ site.github.url }}/2019/10/31/building-microservices-with-spring-boot.html) by introducing a few new concepts to make our services more scalable and resilient.

Just like last time, all of the code for this series is available on [GitHub](https://github.com/jrhenderson1988/building-microservices-with-spring-boot/tree/part-2).

## Inter-Service Communication

Contrary to a more traditional, monolithic approach where a single database is usually available to all parts of an application, microservices run as distinct processes with their own private data stores and must communicate with one another to achieve their goals. This fundamental difference requires a different mindset and can be one of the biggest challenges facing developers when transitioning to building microservices.

There are many different approaches to inter-service communication, each suited for different scenarios. In this tutorial however, we'll focus on synchronous HTTP.

### HTTP Clients with Feign

Making HTTP requests in Java and Spring isn't too difficult. Java 9 introduced an *incubating* `HttpClient`, which was standardised in Java 11 and there are also a number of well known, open-source HTTP clients available, such as [OkHttp](https://square.github.io/okhttp/), [Apache HttpClient](https://hc.apache.org/httpcomponents-client-ga/) and [Spring's RestTemplate](https://spring.io/guides/gs/consuming-rest/).

We could feasibly choose any of these options to manage communication between our services, but there are other problems to solve before we'd be able to do so. Since service addresses are dynamic and unknown ahead of time, we'd need to integrate with the local service registry to look them up before making requests. We'd also need to invest additional time implementing functions like (de)serialization, fault detection and load distribution.

[Feign](https://github.com/OpenFeign/feign) is a project, originally sponsored by Netflix which was designed to allow developers to declaratively build HTTP clients by means of creating annotated interfaces. It is highly customisable, and supports a significant number of integrations out of the box. [Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign) adds support for Feign by configuring and binding it to the Spring environment, integrating Spring MVC style annotations for building HTTP clients, and connecting it to the rest of the Spring Cloud ecosystem.

Let's imagine that we want to list all of the orders that belong to a customer by making a `GET` request to `/customers/X/orders`.

We'll begin by modifying the `getAllOrders` method of the `OrderController` in our Order Service, to add the ability to filter orders by an optional customer ID in the query string:

~~~java
@GetMapping
public List<Order> getAllOrders(@RequestParam(required = false) Integer customerId) {
    if (customerId != null) {
        return orders.stream()
                     .filter(order -> customerId.equals(order.getCustomerId()))
                     .collect(Collectors.toList());
    }

    return orders;
}
~~~

Launch the Discovery and Order services, then visit [http://localhost:3002/?customerId=2](http://localhost:3002/?customerId=2) to see all of Jane Doe's orders.

Now, add the *Spring Cloud OpenFeign* dependency to the Customer Service by adding the following to the `dependencies` block of its `build.gradle` file:

~~~groovy
implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'
~~~

Then, add the `@EnableFeignClients` annotation to the `CustomerServiceApplication` class:

~~~java
package com.github.jrhenderson1988.customerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
public class CustomerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomerServiceApplication.class, args);
    }
}
~~~

We'll create a Feign client to communicate with the Order Service, declaring a method called `getOrdersForCustomer` with Spring MVC style annotations, to control its behaviour:

~~~java
package com.github.jrhenderson1988.customerservice;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "order-service")
public interface OrderClient {
    @GetMapping("/")
    Object getOrdersForCustomer(@RequestParam int customerId);
}
~~~

- `@FeignClient(name = "order-service")` allows the client definition to be discovered, and specifies `order-service` as the name of the service to communicate with.
- `@GetMapping("/")` declares that calling `getOrdersForCustomer` should perform a `GET` request to the `/` path.
- `@RequestParam int customerId` instructs Feign to take the `customerId` parameter and insert it into the query string when making the request.
- An `Object` return type indicates that Feign should deserialize the response of the remote service into an `Object` which is returned to the caller.

> In a real application, we'd normally specify a return type like `Iterable<Order>`. We'd usually also structure our applications differently to promote code re-use and avoid duplication of our domain entities. For brevity however, I've decided to keep things simple and just return an `Object`, especially since the structure of this response will change in the next section.

Finally, let's inject our new client into the `CustomerController`:

~~~java
@RestController
public class CustomerController {
    private List<Customer> customers = Arrays.asList(
            new Customer(1, "Joe Bloggs"),
            new Customer(2, "Jane Doe"));

    private OrderClient orderClient;

    public CustomerController(OrderClient orderClient) {
        this.orderClient = orderClient;
    }
~~~

And create a new method to handle `GET /{id}/orders`, which uses the Feign client to call the method we declared:

~~~java
    @GetMapping("/{id}/orders")
    public Object getOrdersForCustomer(@PathVariable int id) {
        return orderClient.getOrdersForCustomer(id);
    }
~~~

Ensure that all services are up and running (Discovery Service first, as always), then visit [http://localhost/customers/2/orders](http://localhost/customers/2/orders). You should see the same list of orders belonging to Jane Doe, as we did when visiting [http://localhost:3002/?customerId=2](http://localhost:3002/?customerId=2), earlier.

## Scaling

In a microservice architecture, individual services can be independently scaled using one, or a combination of:

- **Vertical scaling:** Achieved by increasing the power (CPU, memory) of an existing machine. This approach is limited by the machine's maximum capacity and often involves downtime. Due to the increased cost of adding processing power and the fact that demand fluctuates, *scaling up* can be expensive and inefficient.
- **Horizontal scaling:** Involves adding more machines to the existing cluster. This approach is virtually limitless and very flexible since nodes can be dynamically added or removed with little to no downtime. Due to this flexibility and availability of cheap commodity hardware, *scaling out* can be extremely cost effective.

Usually, once an optimum configuration is formulated for a given service, scaling horizontally tends to be the preferred option. However, this introduces some additional complexity - we need to be able to effectively distributed load between multiple instances of a given service.

### Client-Side Load Balancing with Ribbon

[Ribbon](https://github.com/Netflix/ribbon) is an Inter Process Communication library written by Netflix. Its primary purpose is to provide client-side load balancing but also integrates nicely with other cloud services such as Eureka for service discovery and Hystrix to provide resilience.

We're *already* using Ribbon for client-side load balancing in our project since Spring Cloud OpenFeign (at the time of writing) uses Ribbon as its default load balancer.

Let's modify the Order Service and add the port number on which the service is currently running to the body of the response to prove that load-balancing is enabled.

Create a `ResponseWrapper` class:

~~~java
package com.github.jrhenderson1988.orderservice;

import org.springframework.core.env.Environment;

public class ResponseWrapper<T> {
    private final Integer port;
    private final T data;

    public ResponseWrapper(final Environment environment, final T data) {
        String serverPort = environment.getProperty("server.port");
        this.port = serverPort != null ? Integer.parseInt(serverPort) : null;
        this.data = data;
    }

    public Integer getPort() {
        return port;
    }

    public T getData() {
        return data;
    }
}
~~~

Then inject the Spring `Environment` into the `OrderController`:

~~~java
@RestController
public class OrderController {
    private final List<Order> orders = Arrays.asList(
            new Order(1, 1, "Product A"),
            new Order(2, 1, "Product B"),
            new Order(3, 2, "Product C"),
            new Order(4, 1, "Product D"),
            new Order(5, 2, "Product E"));

    private final Environment environment;

    @Autowired
    public OrderController(final Environment environment) {
        this.environment = environment;
    }
~~~

And change the `getAllOrders` method to return a `List<Order>` wrapped in a `ResponseWrapper`:

~~~java
@GetMapping
public ResponseWrapper<List<Order>> getAllOrders(@RequestParam(required = false) Integer customerId) {
    if (customerId != null) {
        return new ResponseWrapper<>(
                environment,
                orders.stream()
                        .filter(order -> customerId.equals(order.getCustomerId()))
                        .collect(Collectors.toList()));
    }

    return new ResponseWrapper<>(environment, orders);
}
~~~

Boot the Discovery, Customer and Gateway services as normal. Then we'll launch multiple instances of the Order Service on different ports using the following command (replace `<port>` with a different number each time):

~~~bash
./gradlew bootRun --args='--server.port=<port>'
~~~

Wait a couple of minutes for everything to register with the Discovery Service and for the updated registries to be propagated. Take a look at the [Eureka dashboard](http://localhost:3000) - under *Instances currently registered with Eureka* you should see multiple instances of the Order Service:

![Instances Registered with Eureka]({{ site.github.url }}/jhenderson/assets/building-microservices-with-spring-boot-2/instances-registered-with-eureka.jpg "Instances Registered with Eureka")

Make a few `GET` requests to [http://localhost/customers/2/orders](http://localhost/customers/2/orders) and take note of the `port` in the response. It should change each time.

The Feign client uses Ribbon to balance requests between instances of our Order Service. Ribbon uses the local service registry, to find all of the physical addresses of the Order Service, and uses a pluggable load-balancing algorithm to determine which instance should receive the next request.

By default, our Gateway Service, set up as a Zuul proxy, also uses Ribbon to balance requests between our services. Make a `GET` request to [http://localhost/orders](http://localhost/orders), taking note of the `port` again.

## Resiliency

Like all software, microservices can fail for all kinds of reasons - bugs, overloading and hardware/network failures to name just a few.

Distributed architectures depend on the ability of many interconnected services to communicate with one another over a network. Gracefully handling inevitable failures is therefore crucial - failing to do so can lead to cascading failures, where one small problem can trigger problems in other services, causing a ripple effect that can eventually bring down an entire system.

### Latency and Fault Tolerance with Hystrix

[Hystrix](https://github.com/Netflix/Hystrix) is a fault and latency tolerance library, written by Netflix which provides developers with fine-grained control over inter-service (or 3rd party) communication. It helps to increase a system's overall resiliency by preventing cascading failures and allowing engineers to add fallback mechanisms to promote graceful degredation.

Calls to external systems are wrapped in [commands](http://en.wikipedia.org/wiki/Command_pattern), which are typically run in separate threads. Hystrix oversees execution, timing out calls that run over configured thresholds and detects errors/exceptions. Failure rates are monitored and when a defined limit is exceeded, a circuit-breaker is tripped, halting the flow of traffic to allow the overwhelmed or failing service an opportunity to recover.

![Hystrix Diagram]({{ site.github.url }}/jhenderson/assets/building-microservices-with-spring-boot-2/hystrix-diagram.svg "Hystrix Diagram")

Feign also includes support for Hystrix although it is not enabled by default. When Hystrix is on the classpath and explicitly enabled in the configuration, Spring Cloud OpenFeign automatically configures and integrates it with Feign clients.

Let's add Hystrix support and create a fallback to our Customer Service's `OrderClient` to allow the `getOrdersForCustomer` method to gracefully degrade when the Order Service fails.

First, we'll add *Spring Cloud Hystrix* as a dependency. Insert the following to the `dependencies` block of your Customer Service's `build.gradle` file:

~~~groovy
implementation 'org.springframework.cloud:spring-cloud-starter-netflix-hystrix'
~~~

We'll then configure Spring Cloud OpenFeign to enable Hystrix support. In `application.properties`, add:

~~~properties
feign.hystrix.enabled=true
~~~

At this point, Hystrix will be used by the Feign client. By default it allows the remote Order Service up to 1 second to respond before it steps in and cancels the request.

Let's add a fallback mechanism to the `OrderClient`, which Hystrix will call when the request fails. First, create a `@Component` class which implements our `OrderClient` interface and provides fallback behaviour for the `getOrdersForCustomer` method. In this case, we'll just return an empty list:

~~~java
package com.github.jrhenderson1988.customerservice;

import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class OrderClientFallback implements OrderClient {
    @Override
    public Object getOrdersForCustomer(int customerId) {
        return Collections.emptyList();
    }
}
~~~

Now, we need to configure our Feign client to point to the fallback implementation. In the `OrderClient` class, modify the `@FeignClient` annotation to add a `fallback` which points to our `OrderClientFallback` class:

~~~java
@FeignClient(name = "order-service", fallback = OrderClientFallback.class)
public interface OrderClient {
~~~

The Gateway Service also uses Hystrix by default and cancels requests after 1 second, which results in it timing out and returning an error response before the Customer Service has the opportunity to execute its fallback mechanism and respond. To avoid this, we'll increase the Gateway's timeout settings to allow our downstream Customer Service enough time to respond after its 1 second timeout has expired.

Add the following lines to the Gateway Service's `application.properties` file:

~~~properties
hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds=5000
ribbon.ConnectTimeout=4000
ribbon.ReadTimeout=4000
~~~

Launch the Discovery Service, followed by the Customer, Order and Gateway services (`./gradlew bootRun`). Once you've waited for everything to boot up and propagate, send a request to [http://localhost/customers/2/orders](http://localhost/customers/2/orders) to confirm that everything is working and you see the correct response.

Now, let's simulate a failure by killing the Order Service instance and trying the same endpoint again. This time, instead of seeing all of Jane Doe's orders, you should see an empty list, which is what we defined in our fallback.

## Summary

- Upon receiving a `GET` request to the path `/customers/{id}/orders`, our Gateway service proxies it to the Customer Service.
- The Customer Service uses a Feign client to send a request to the Order Service to handle the request.
- The Feign client looks up the physical addresses of available Order Service instances in its local registry.
- It uses Ribbon to decide which instance of should receive the request.
- The request is sent to the chosen instance using a Hystrix command to handle timeouts or failure.
- If the Hystrix circuit-breaker is open, the request is immediately cancelled and our fallback method is called.
- If an issue is detected when calling the Order Service (or it times out), Hystrix reports the failure and calls our configured fallback method.
- Upon receiving the request, the chosen Order Service instance does its work and sends back a response.
- The Customer Service receives the response (or result of the calling the fallback method) and sends its own response back to the Gateway (and back to the client).

In part 3, we'll add some externalised configuration and discuss the importance of observability in a microservice architecture.
