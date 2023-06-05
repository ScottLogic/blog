---
title: Deep Dive into RabbitMQ with Spring Boot - Part 2
date: 2023-05-31 00:00:00 Z
categories:
- smendis-scottlogic
- Tech
tags:
- java
- spring
- spring-boot
- rabbitmq
- retry
- concurrent-consumers
summary: Using RabbitMQ as it is in Spring Boot works fine. But sometimes it's not
  enough. This article will explain how to alter the retry behaviour and consume messages
  concurrently by multiple consumers in RabbitMQ in your Spring Boot Application.
author: smendis-scottlogic
summary-short: Discuss how to alter the retry behaviour and how to add multiple consumers
  to allow parallel processing in RabbitMQ with Spring Boot.
image: "/uploads/Scottlogic---Social-media-cards-copy_Design-5.jpg"
layout: default_post
---

This is the final post of a series of 2 posts on RabbitMQ with Spring Boot. In the previous post, I explained the spring version of RabbitMQ acknowledgement mode. In this post, I’m hoping to explain how to tweak your RabbitMQ configuration to alter the retry behaviour, and how to add multiple consumers to allow parallel processing, in your Spring Boot application.

This article is not for you if you are only interested in getting a basic RabbitMQ publisher/consumer pattern to work in your Spring Boot application.

---

## Altering Retry Behaviour

In spring boot default configuration for RabbitMQ, if a consumer throws an exception while processing the message, it will republish the message to the queue over and over again, forever. It looks as follows in the management console.

![Default_Retry]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_1.png)

This is not what we want in most of the cases. What we would generally expect is to retry only a predefined number of times to consume the message, if not publish it to the dead letter queue. It can be achieved fairly easily by adding the following configuration to your `application.yml` file *if your message is just a simple String or is of a primitive data type*. We will discuss later how to handle if your message is a complex object in this post.

~~~java
spring:
  rabbitmq:
    host: localhost
    port: 5672
    listener:
      simple:
        retry:
          enabled: true
          initial-interval: 3s
          max-attempts: 3
          max-interval: 10s
          multiplier: 2
~~~

![Application_YAML_Retry]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_2.png)

This will be shown in the management console as follows,

![Retry_In_Console]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_3.png)

What if we don’t want to send the message to the dead letter queue after 3 attempts and wish to publish it to some other queue conditionally after 3 retries. To implement this, we need to set the retry configuration in code instead in the `application.yml` as shown below.

~~~java
spring:
  rabbitmq:
    host: localhost
    port: 5672
app:
  rabbitmq:
    direct-exchange: my.direct
    request-queue: my.direct.request
    response-queue: my.direct.response
    retry-attempts: 3
    backoff-interval: 1000
    backoff-multiplier: 2
    backoff-max-interval: 5000
~~~

Let’s configure a simple rabbit listener in `RabbitMqConfig.java` file with retry interceptor as below. I have added a `Jackson2JsonMessageConverter` and configured it to be used in the rabbit listener because I’m expecting to receiving a complex message of type `MyMessage` from the queue.

~~~java
Jackson2JsonMessageConverter messageConverter(ObjectMapper mapper){
    var converter = new Jackson2JsonMessageConverter(mapper);
    converter.setCreateMessageIds(true); //create a unique message id for every message
    return converter;
}

@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
        ConnectionFactory connectionFactory,
        RetryOperationsInterceptor retryInterceptor,
        ObjectMapper objectMapper) {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(messageConverter(objectMapper));
    factory.setAdviceChain(retryInterceptor);
    return factory;
}

@Bean
public RetryOperationsInterceptor messageRetryInterceptor(){
    return RetryInterceptorBuilder.StatelessRetryInterceptorBuilder
            .stateless()
            .maxAttempts(properties.getRetryAttempts())
            .backOffOptions(
                    properties.getBackoffInterval(),
                    properties.getBackoffMultiplier(),
                    properties.getBackoffMaxInterval()
            )
            .recoverer(new RejectAndDontRequeueRecoverer())
            .build();
}
~~~

Properties values will be read from `application.yml` with the prefix `app.rabbitmq`.

The message retry interceptor can be either stateful or stateless. See the [spring boot documentation](https://docs.spring.io/spring-batch/docs/1.0.x/spring-batch-docs/reference/html/ch06.html) for retry to determine whether you need a stateless or stateful interceptor. In short, if you have transactions or database updates that needs to be reverted if the code fails, you will need a stateful retry interceptor to avoid data inconsistencies. If you were to use a stateful retry interceptor your `rabbitListenerContainerFactory` and `messageRetryInterceptor` methods will change as follows,

~~~java
@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
        ConnectionFactory connectionFactory,
        StatefulRetryOperationsInterceptor retryInterceptor,
        ObjectMapper objectMapper) {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(messageConverter(objectMapper));
    factory.setAdviceChain(retryInterceptor);
    return factory;
}

@Bean
public StatefulRetryOperationsInterceptor messageRetryInterceptor(){
    return RetryInterceptorBuilder.StatefulRetryInterceptorBuilder
            .stateful()
            .maxAttempts(properties.getRetryAttempts())
            .backOffOptions(
                    properties.getBackoffInterval(),
                    properties.getBackoffMultiplier(),
                    properties.getBackoffMaxInterval()
            )
            .recoverer(new RejectAndDontRequeueRecoverer())
            .build();
}
~~~

In the retry interceptor we specify it needs to be retried 3 times max, set of backoff options namely, initial interval, multiplier and max interval. If exhausted with all retry attempts, then the recoverer of the retry interceptor will be called. To this method we need to pass an implementation of a `MessageRecoverer` interface.

`RejectAndDontRequeueRecoverer` class which implements the `MessageRecoverer` interface will send the message to the dead letter queue by throwing an `AmpqRejectAndDontRequeueException` in its recover method.

`RepublishMessageRecoverer` class which implements the `MessageRecoverer` interface will publish the message to a given exchange.

To provide a custom implementation having both features conditionally, we will implement `ErrorMessageResolver` which implements the `MessageRecoverer` interface.

Update your `messageRetryInterceptor` method as follows to accept instance of `ErrorMessageResolver` class in recoverer as follows. Here I’m using a stateless retry interceptor but can be done with a stateful retry interceptor in the same manner. I’m adding a bean definition for rabbit template in the config as it will be needed in the `ErrorMessageResolver` class as we are dealing with complex messages.

~~~java
@Bean
public RetryOperationsInterceptor messageRetryInterceptor(
        MessageRecoverer messageRecoverer){
    return RetryInterceptorBuilder.StatelessRetryInterceptorBuilder
            .stateless()
            .maxAttempts(properties.getRetryAttempts())
            .backOffOptions(
                    properties.getBackoffInterval(),
                    properties.getBackoffMultiplier(),
                    properties.getBackoffMaxInterval()
            )
            .recoverer(messageRecoverer)
            .build();
}

@Bean
public MessageRecoverer messageRecoverer(RabbitTemplate template, AppProperties properties, ObjectMapper objectMapper){
    return new ErrorMessageResolver(
            template,
            properties,
            messageConverter(objectMapper)
    );
}

@Bean
public RabbitTemplate rabbitTemplate(ConnectionFactory factory, ObjectMapper objectMapper){
    RabbitTemplate template = new RabbitTemplate();
    template.setConnectionFactory(factory);
    template.setMessageConverter(messageConverter(objectMapper));
    return template;
}
~~~

Our `ErrorMessageResolver` class will be implementing the recover method from the `MessageRecoverer` interface. It is important to note that every exception thrown by the listener method is wrapped by a `ListenerExecutionFailedException`. We have defined a custom exception as `FailedProcessException`. If the listener method throws an exception of type `FailedProcessException` it will publish the message to the response queue, and for all other types of exceptions it will publish the message to the dead letter queue.

~~~java
public class ErrorMessageResolver implements MessageRecoverer {
    private final RabbitTemplate template;
    private final AppProperties properties;
    private final Jackson2JsonMessageConverter converter;

    public ErrorMessageResolver(RabbitTemplate rabbitTemplate,
                                AppProperties properties,
                                Jackson2JsonMessageConverter converter) {
        this.template = rabbitTemplate;
        this.properties = properties;
        this.converter = converter;
    }

    @Override
    public void recover(Message message, Throwable cause){
        if(cause instanceof ListenerExecutionFailedException &&
                cause.getCause() instanceof FailedProcessException){
            try {
                //retrieve original message
                message.getMessageProperties().setInferredArgumentType(MyMessage.class);
                MyMessage originalRequest = (MyMessage) converter.fromMessage(message, MyMessage.class);

                FailedMessage failedMessage = new FailedMessage(
                        originalRequest.getMessageId(),
                        originalRequest.getMessage(),
                        cause.getCause().getMessage()
                );
                //send the message to response queue
                this.template.convertAndSend(
                        properties.getDirectExchange(),
                        properties.getResponseQueue(),
                        failedMessage
                );

            } catch (Exception ex){
                //send the message to dead letter queue
                throw new AmqpRejectAndDontRequeueException("Unable to recover message", ex);
            }
        } else {
            //send the message to dead letter queue
            throw new AmqpRejectAndDontRequeueException("Unable to recover message");
        }
    }
}
~~~

Let’s try sending a message that throws a `FailedProcessException` when get executed by the listener method. This is what you will see in the management console.

![Modified_Retry_Send_To_Queue_Console]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_4.png)

![Modified_Retry_Send_To_Queue_Counts]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_5.png)

Let’s empty the response queue for clarity and try sending a message that throws a exception of type `Exception` when get executed by the listener method. This is what you will see in the management console.

![Modified_Retry_Send_To_DLQ_Console]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_6.png)

![Modified_Retry_Send_To_DLQ_Counts]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_7.png)

This is what we wanted to achieve by altering the retry behavior with retry interceptors and message recoverers.

---

## Concurrent Consumers

You may be able to see that if you are using the default configuration for concurrent consumers you get only 1 consumer per queue with a message prefetch count of 250. This means that 1 consumer you have for the queue will fetch up to 250 messages at once and do sequential processing.

![Default_Consumers_List]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_8.png)

So, if we send 2 messages both messages get delivered to the same consumer and while it process the first message the second message is stored on in memory of the consumer. This is not the desired behaviour in general. We would like to have multiple consumers to handle messages and ideally will not want them to accept more than 1 message at once.

We can achieve this simply by configuring the `application.yml` given that you are not creating your own rabbit listener factory in the code.

~~~java
spring:
  rabbitmq:
    host: localhost
    port: 5672
    listener:
      simple:
        concurrency: 5
        max-concurrency: 10
~~~

Your management console will now display 5 concurrent consumers.

![Modified_Consumers_List]({{ site.github.url }}/smendis-scottlogic/assets/rabbit2_9.png)

If you have defined your own rabbit listener factory in the configuration, your `application.yml` will be fairly simple as follows,

~~~java
spring:
  rabbitmq:
    host: localhost
    port: 5672
~~~

But will require to add the related configuration inthe rabbit listener factory in `RabbitMqConfig.java` class.

~~~java
@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
        ConnectionFactory connectionFactory,
        RetryOperationsInterceptor retryInterceptor,
        ObjectMapper objectMapper) {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(messageConverter(objectMapper));
    factory.setPrefetchCount(0);
    factory.setConcurrentConsumers(properties.getConcurrentConsumers());
    factory.setMaxConcurrentConsumers(properties.getMaxConcurrentConsumers());
    return factory;
}
~~~

Setting the prefetch count to zero will make sure the consumers will not accept more than 1 message at a time. Concurrent consumers will specify the number of consumers you will initially create, and max concurrent consumers will set the maximum number of parallel consumers the system can initiate for you.

Please note that if you do not set the prefetch count to zero, even though you have specified multiple consumers, 1 consumer will greedily accept up to 251 messages at once and sequentially process them one after the other.

Complete code for RabbitMQ producer can be found [here](https://github.com/smendis-scottlogic/rabbitmq-producer).

Complete code for RabbitMQ consumer with retries, and concurrency implementations can be found [here](https://github.com/smendis-scottlogic/rabbitmq-advanced-consumer).