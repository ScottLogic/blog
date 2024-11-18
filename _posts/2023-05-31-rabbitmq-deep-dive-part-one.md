---
title: Deep Dive into RabbitMQ with Spring Boot - Part 1
date: 2023-05-31 00:00:00 Z
categories:
- Tech
tags:
- java
- spring
- spring-boot
- rabbitmq
- acknowledgement-mode
summary: Spring Boot makes developer’s life easier through autoconfiguration. Even though it's true most of the time, occasionally we come across situations where autoconfiguration makes it harder to understand what is really happening behind the scenes and ends up wasting hours or may be days of developer time. This article is about one such rare occasion where understanding of RabbitMQ got confused with how Spring Boot implemented it behind the scenes.
author: smendis-scottlogic
summary-short: Discuss the misleading naming used by Spring Boot for RabbitMQ acknowledgement modes.
image: "/uploads/Scottlogic---Social-media-cards-copy_Design-4.jpg"
layout: default_post
---

This is the first of a series of 2 posts on RabbitMQ with Spring Boot. In this post, I intend to explain the Spring version of **RabbitMQ Acknowledgement Modes**. Part 2 will elaborate how to tweak your RabbitMQ configuration to alter the retry behaviour, and how to add parallel consumers, in your RabbitMQ Spring Boot Application.

This article is not for you if you are only interested in getting a basic RabbitMQ publisher/consumer pattern to work in your Spring Boot Application.

---

## Confusion between RabbitMQ and Spring Acknowledgement Modes

In RabbitMQ there are 2 main types of message delivery acknowledgements.

* **Auto Acknowledgement** (Default) — requires no acknowledgement, a.k.a. “fire and forget”. This will delete the message from the queue as soon as it has been written to the TCP socket of the consumer.
* **Manual Acknowledgement** — requires explicit consumer acknowledgements. This will ensure that *no message is lost* when a consumer crashes while processing the message or when it encounters an error which prevent it from processing the message completely.

Let’s spin up a RabbitMQ docker container, a spring boot RabbitMQ [producer](https://github.com/smendis-scottlogic/rabbitmq-producer) and a basic spring boot RabbitMQ [consumer](https://github.com/smendis-scottlogic/rabbitmq-basic-consumer) to test this. I have also opened the RabbitMQ management console and used Postman to call producer's POST endpoint so that it generates and publishes messages to the queue. What you see below is how RabbitMQ reacts with the default spring boot RabbitMQ autoconfiguration. 

![Default_Spring_Boot_RabbitMq]({{ site.github.url }}/smendis-scottlogic/assets/rabbit1_1.png)

* 14:52:00 — Message is published to the queue. No consumers.
* 14:52:40 — Consumer comes online. Delivery acknowledgement received. Message is no longer eligible to consume as it is in Unacked state, but message is not deleted from the queue.
* 14:52:50 — Consumer acknowledgement received, and message is removed from the queue.

This is exactly what is explained in the manual acknowledgement mode in the RabbitMQ documentation given above. And you can also see in the legend of the chart that it received a Delivery (manual ack) at 14:52:40

***So… We must be using manual acknowledgement in spring boot application.***

Let’s see the code on the consumer of our spring boot endpoint.

~~~java
@RabbitListener(
        queues = "#{requestQueue.name}",
        containerFactory = "rabbitListenerContainerFactory"
)
public void receiveMessage(MyMessage message) throws Exception {
    Thread.sleep(5000);
    if(message.getMessageId() > 5){
        throw new Exception("abc");
    } else if(message.getMessageId() == 3){
        Thread.sleep(5000);
        System.out.println("Listener method executed successfully");
    } else {
        System.out.println("Listner method executed successfully");
    }
}
~~~

Where is the manual acknowledgment part? RabbitMQ documentation says that the consumer should <ins>explicitly</ins> send the acknowledgements when using manual acknowledgement mode. Bit of googling tells me that if you are to implement manual acknowledgement your RabbitListener should look like this.

~~~java
@RabbitListener(
        queues = "#{requestQueue.name}",
        containerFactory = "rabbitListenerContainerFactory"
)
public void receiveMessage(MyMessage message, Channel channel,
           @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws Exception {
    Thread.sleep(5000);
    if(message.getMessageId() > 5){
        channel.basicNack(tag, false, true);
    } else if(message.getMessageId() == 3){
        Thread.sleep(5000);
        System.out.println("Listener method executed successfully");
        channel.basicAck(tag, false);
    } else {
        System.out.println("Listner method executed successfully");
        channel.basicAck(tag, false);
    }
}
~~~

Yes! This looks more like what RabbitMQ expects for manual acknowledgment.

***So… We must me using auto acknowledgment in our spring boot application.
<br/><br/>
Wait...***
<br/><br/>
From code it looks like we are using auto acknowledgment but from RabbitMQ management console it looks like we are using auto acknowledgment..
<br/><br/>
***Confused ?? Yes me too..***


According to the  [Spring AMQP documentation](https://docs.spring.io/spring-amqp/docs/current/api/org/springframework/amqp/core/AcknowledgeMode.html), it has 3 acknowledgment modes instead of 2 provided by the RabbitMQ.

* **AUTO** — (Default) the container will issue the ack/nack based on whether the listener returns normally, or throws an exception.
* **MANUAL** — user must ack/nack via a channel aware listener.
* **NONE** — No acks. `autoAck=true` in `Channel.basicConsume()`.

And most importantly under AUTO it says, ***Do not get confused with RabbitMQ `autoAck` which is represented by `NONE` here.***

I think we have cracked our case here. Spring has used the word AUTO but underneath uses the RabbitMQ Manual acknowledgments. If the listener executes without any exceptions spring boot will send back `basicAck` for us, or else will send a `basicNack`. If using Spring’s MANUAL the container does not handle anything for us. So, we need to send `basicAck` or `basicNack` as needed. If using Spring’s NONE then the RabbitMQ’s Auto acknowledgment is implemented in spring.

To prove we have got it right, let’s implement these 3 acknowledgment modes and test the behaviour on RabbitMQ management console.

---

## Implementing Spring’s AUTO Acknowledgment Mode

This is the default behaviour. But you can explicitly set it at the `SimpleRabbitListenerContainerFactory`. See the `RabbitMQConfig.java` class in the rabbitmq-basic-consumer repo.

~~~java
@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
        ConnectionFactory connectionFactory,
        StatefulRetryOperationsInterceptor retryInterceptor,
        ObjectMapper objectMapper) {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(messageConverter(objectMapper));
    factory.setAcknowledgeMode(AcknowledgeMode.AUTO);
    return factory;
}
~~~

And the RabbitListener looks like follows in `MessageReceiver.java` class in the **rabbitmq-basic-consumer** repo.

~~~java
@RabbitListener(
        queues = "#{requestQueue.name}",
        containerFactory = "rabbitListenerContainerFactory"
)
public void receiveMessage(MyMessage message) throws Exception {
    Thread.sleep(5000);
    if(message.getMessageId() > 5){
        throw new Exception("abc");
    } else if(message.getMessageId() == 3){
        Thread.sleep(5000);
        System.out.println("Listener method executed successfully");
    } else {
        System.out.println("Listner method executed successfully");
    }
}
~~~

Management console looks as same as before.

![Auto_Acknowledgement_Mode]({{ site.github.url }}/smendis-scottlogic/assets/rabbit1_2.png)

## Implementing Spring’s Manual Acknowledgment Mode

You can set this at the `SimpleRabbitListenerContainerFactory` just like before. See the `RabbitMQConfig.java` class in the **rabbitmq-basic-consumer** repo.

~~~java
@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
        ConnectionFactory connectionFactory,
        StatefulRetryOperationsInterceptor retryInterceptor,
        ObjectMapper objectMapper) {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(messageConverter(objectMapper));
    factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
    return factory;
}
~~~

And the RabbitListener looks like follows in `MessageReceiver.java` class in the **rabbitmq-basic-consumer** repo.

~~~java
@RabbitListener(
        queues = "#{requestQueue.name}",
        containerFactory = "rabbitListenerContainerFactory"
)
public void receiveMessage(MyMessage message, Channel channel,
           @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws Exception {
    Thread.sleep(5000);
    if(message.getMessageId() > 5){
        channel.basicNack(tag, false, true);
    } else if(message.getMessageId() == 3){
        Thread.sleep(5000);
        System.out.println("Listener method executed successfully");
        channel.basicAck(tag, false);
    } else {
        System.out.println("Listner method executed successfully");
        channel.basicAck(tag, false);
    }
}
~~~

Management console looks as same as before.

![Manual_Acknowledgement_Mode]({{ site.github.url }}/smendis-scottlogic/assets/rabbit1_3.png)

## Implementing Spring’s NONE Acknowledgment Mode

You can set this at the `SimpleRabbitListenerContainerFactory` just like before. See the `RabbitMQConfig.java` class in the **rabbitmq-basic-consumer** repo.

~~~java
@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
        ConnectionFactory connectionFactory,
        StatefulRetryOperationsInterceptor retryInterceptor,
        ObjectMapper objectMapper) {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(messageConverter(objectMapper));
    factory.setAcknowledgeMode(AcknowledgeMode.NONE);
    return factory;
}
~~~

Management console looks different now.

![None_Acknowledgement_Mode]({{ site.github.url }}/smendis-scottlogic/assets/rabbit1_4.png)

* 15:46:20 — Message published to the exchange. No consumers
* 15:47:00- A Consumer comes online and consume the message. Message get immediately removed from the queue. No Consumer ack is seen here.

---

## Summary

Even though the names mislead you, Spring boot by default use RabbitMQ’s Manual Acknowledgment Mode and in addition will send the acknowledgment on behalf of you from the container, based on whether the listener method executed successfully without throwing any Exceptions. This will ensure no message is lost if the consumer crashers or unable to complete the execution of the message.
