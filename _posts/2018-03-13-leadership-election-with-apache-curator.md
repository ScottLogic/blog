---
title: Leadership Election with Apache Curator
date: 2018-03-13 00:00:00 Z
categories:
- Tech
tags:
- Java
- Zookeeper
- Curator
author: janakerman
layout: default_post
summary: Apache Curator is a client side library providing convenience and out of the box algorithms when working with Apache Zookeeper. In this blog we take a quick look at how to implement a leadership election.
summary-short: A quick look at implementing a leadership election with Apache Curator.
---

Distributed computing is difficult, but fortunately it's never been easier. Companies like Netflix, Facebook, LinkedIn, etc, have been solving difficult problems and open sourcing the solutions. This post is going to look at how we can easily implement distributed leadership election using Apache Curator.

## Zookeeper & Curator

Apache Curator is a completely client side library, under the hood it relies on Apache Zookeeper for coordination. Zookeeper facilitates distributed synchronization and coordination for distributed processes, and is used as the cornerstone of a lot of distributed tools. A production Zookeeper service runs in an 'ensemble' (cluster) of nodes and provides a file system like structure where we can store data that is guaranteed to be replicated across the ensemble for fault tolerance. It gives us very low level operations, create, get, delete, and notifications about these events, as well as very strong guarantees about these operations.

Even with the building blocks that Zookeeper gives you, writing a leadership election algorithm isn't particularly trivial. Surely someone out there has done it already and provided it as open source? Yes - you guessed it - Netflix did.

Apache Curator is now under the Apache banner. It brands itself with the apt tag line "Guava is for Java what Curator is for Zookeeper", which I think is a perfect description. It provides a whole set of conveniences for working with Zookeeper at a low level, as well any many "recipes" such as distributed locks, queues, caches, and... leadership election!

## Leadership Election

Leadership election in distributed computing is the process whereby a given set of separate applications negotiate to decide a single globally known leader. This algorithm is useful any time you need horizontal scaling of an application, yet you only want one instance performing a given task, or orchestrating the other instances in some way.

## The code

We're going to follow along with one of the example projects in the Curator repository - you can check out the [Apache Curator repository](https://github.com/apache/curator/tree/master/curator-examples/src/main/java/leader), or simply follow the snippets below.

The leadership example is surprisingly simple. It starts up 10 `ExampleClient`s which all put themselves forwards for leadership election. Only one of these clients will ever be the leader at a given point in time. When a leader steps up, in this example, it logs a message and sleeps for a random period, then relinquishes leadership allowing a new client to step up. The clients are running on different threads and are coordinating themselves by communicating with the Zookeeper ensemble. This works exactly the same way regardless of whether the clients are running in a different thread, or as separate instances of a horizontally scaled application.

Let's walk through the code. For each client that is created, it is passed a `CuratorFramework` instance configured with our Zookeeper URL. Along with the Curator client, it is also passed a path to a unique Zookeeper ZNode representing this leadership group, and a unique ID so we can identify each client in the application logs:

    for ( int i = 0; i < CLIENT_QTY; ++i ){
        CuratorFramework    client = CuratorFrameworkFactory.newClient(server.getConnectString(), new ExponentialBackoffRetry(1000, 3));
        clients.add(client);

        ExampleClient       example = new ExampleClient(client, PATH, "Client #" + i);
        examples.add(example);

        client.start();
        example.start();
    }


In each `ExampleClient` constructor, an instance of a `LeaderSelector` is created - and set to `autoRequeue()` so that it puts itself back in the election pool after it has relinquished leadership.


    public ExampleClient(CuratorFramework client, String path, String name) {
        ...
        leaderSelector = new LeaderSelector(client, path, this);

        // for most cases you will want your instance to requeue when it relinquishes leadership
        leaderSelector.autoRequeue();
    }

Above the `ExampleClient` sets itself as the listener for leadership changes and as a result needs to implement the `LeaderSelectorListener` interface. Here though, the client actually extends the abstract class `LeaderSelectorListenerAdapter` to get the recommended error handling behaviour automatically. This interface is used to listen for leadership changes and defines the following methods:

    public void takeLeadership(CuratorFramework client) throws Exception;

    public void stateChanged(CuratorFramework client, ConnectionState newState);

- The `takeLeadership()` method will be called when that `ExampleClient` has been elected. The client retains leadership until it leaves this method (intentionally or as the result of an exception).
- The `stateChanged()` method is called with Zookeeper connectivity updates. Applications must assume that they no longer have the leadership when they receive the events `SUSPENDED` or `LOST`. The recommended approach is to throw a `CancelLeadershipException` to interrupt the thread that is executing the take `takeLeadership()` method as we can not guarantee we are the only leader without an active Zookeeper connection.

In this basic example, the `takeLeadership()` method simply logs that it has received leadership, waits for a random period, logs that it was releasing leadership, and exits the method, allowing the next leader to step up:

    @Override
    public void takeLeadership(CuratorFramework client) throws Exception
    {
        // we are now the leader. This method should not return until we want to relinquish leadership

        final int         waitSeconds = (int)(5 * Math.random()) + 1;

        System.out.println(name + " is now the leader. Waiting " + waitSeconds + " seconds...");
        System.out.println(name + " has been leader " + leaderCount.getAndIncrement() + " time(s) before.");
        try
        {
            Thread.sleep(TimeUnit.SECONDS.toMillis(waitSeconds));
        }
        catch ( InterruptedException e )
        {
            System.err.println(name + " was interrupted.");
            Thread.currentThread().interrupt();
        }
        finally
        {
            System.out.println(name + " relinquishing leadership.\n");
        }
    }

Running this sample you can see in the logs that the new leaders are being selected, and releasing leadership. As soon as a leader steps down, another one steps up.

You can simple run the `LeadershipSelectorExample` class directly as the demos are packaged with an test Zookeeper instance. This is what you can expect to see:

    Client #5 is now the leader. Waiting 5 seconds...
    Client #5 has been leader 0 time(s) before.
    Client #5 relinquishing leadership.

    Client #0 is now the leader. Waiting 3 seconds...
    Client #0 has been leader 0 time(s) before.
    Client #0 relinquishing leadership.

    Client #7 is now the leader. Waiting 3 seconds...
    Client #7 has been leader 0 time(s) before.
    Client #7 relinquishing leadership.

    ...

# In Summary

This example in the Curator repository is very contrived and the simplest possible demo of the library at work. However, this algorithm is very useful for solving the kinds of problems you can encounter when you start thinking about horizontal scaling. Distributed computing is hard, and the real power in Apache Curator is in how elegantly it wraps these algorithms up for us.

There are many ways to implement leadership election, locking some shared resources, perhaps via a database or a cache. Bringing Zookeeper into the mix just to solve this problem might be a bit overkill. However, Apache Curator offers quite a selection of useful algorithms so it is definitely worth a look!
