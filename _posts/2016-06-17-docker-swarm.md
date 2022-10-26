---
title: Service discovery with Docker Swarm
date: 2016-06-17 00:00:00 Z
categories:
- dwybourn
- Data Engineering
author: dwybourn
layout: default_post
image: dwybourn/assets/featured/swarm.png
summary: For the last few months we've been working on a very DevOps focused project. As such we've used AWS, infrastructure as code, Docker and microservices. The different microservices were initially running all on one box, each with a different port. This solution wasn't scalable or very practical. We couldn't have all our services on one machine and it was getting tiresome and error prone having to remember/lookup which port each service was on. We needed our services to run on separate machines, and we needed a way to communicate with them without having to hard-code IP addresses or port numbers. What we needed was service discovery. As we had already been using Docker for each service, Docker Swarm was a natural candidate.
---

For the last few months we've been working on a very DevOps focused project. As such we've used AWS, infrastructure as code, Docker and microservices. The different microservices were initially running all on one box, each with a different port. This solution wasn't scalable or very practical. We couldn't have all our services on one machine and it was getting tiresome and error prone having to remember/lookup which port each service was on. We needed our services to run on separate machines, and we needed a way to communicate with them without having to hard-code IP addresses or port numbers. What we needed was service discovery. As we had already been using Docker for each service, Docker Swarm was a natural candidate.


### What is Docker Swarm?
Docker Swarm is a native cluster system for Docker hosts. It allows several machines running Docker to be grouped together and treated as one. Once you have a cluster of Docker hosts up and running, we no longer have to worry where we start our containers. Behind the scenes Docker Swarm decides where to host the container. There are various ways in which it can make its decision, which we'll get into later.

In this blog we'll go over how to set up a simple Swarm cluster on VirtualBox instances using a tool called [docker-machine](https://docs.docker.com/machine/overview/). This is a great little tool for creating Docker hosts on various platforms such as VirtualBox or AWS.

I should mention that docker-machine does a lot of work for you under the hood. Whilst this does make setup easier, it does hide a lot of the implementation detail. If you're a sysadmin or DevOps engineer, you're going to want to know exactly what is going on. In my next blog I'll go over how to manually setup a production ready swarm in AWS, and I'll be going over everything in much greater detail.

### What does the Swarm look like?
There are really three main components to a Docker Swarm: The Swarm Master, a key-value store, and the docker hosts that run our services.

As you've probably guessed by the name, the Swarm Master manages the Swarm and determines where certain images should be deployed to. Once this is done, it issues the necessary Docker command to the host, the host will then pull down the image and run it in a new container.

Each Swarm needs a key-value store, this acts like a DNS server and stores the location and other attributes about each host (these attributes can be used when determining which host to run a container on). Docker supports several key-value stores such as; ZooKeeper, etcd and Consul. We're using [Consul](https://www.consul.io/) from Hashicorp in this post.

The Docker hosts are the machines with Docker running that will run our services. Each host has a Swarm agent running on it that advertises its IP address and other attributes to consul.

<img src="{{ site.baseurl }}/dwybourn/assets/DockerSwarm/swarm.png"/>

### Scheduling
Swarm can use different [strategies](https://docs.docker.com/swarm/scheduler/strategy/) to determine where to put a node, these are:

* `spread` - This is the default strategy that attempts to spread the containers evenly over all the hosts. For example, if we have two hosts, one with a running container, one without; swarm will deploy the next container on the empty node.
* `binpack` - This is almost the opposite of spread, new containers will run on the node which is most packed until that node can't run any more containers. At this point new containers will start running on a new host. The reason some people use this mode is that it avoids fragmentation across the hosts.
* `random`- I'll leave this as an exercise to the reader as to what this mode does.

When creating the Swarm, you can choose which strategy to use using the `--strategy` flag.

Other than strategies, you can also use various filters to determine where to deploy the container to. You can use the node's name, health, OS, storage type, kernel version, etc. You can read more about filters and the full list on [Docker's website](https://docs.docker.com/swarm/scheduler/filter/)

### Setup on VirtualBox
That's enough theory, let's dive into an example, and what better example than the classic Hello World, with a twist.

We're going to have three services, one called hello, one called world and one called hello-world. The hello and world services simply respond to REST requests with the words "Hello" and "World" respectively. The hello-world service calls both of these and concatenates the result, producing the string: "Hello World".

The hello-world service doesn't know where the two other services are hosted, that's where the beauty of Docker Swarm comes in. It doesn't need to know, with Docker Swarm it can just do a call on the service name like so:


`client.get("http://hello:8080", ...)`

All the code and Dockerfiles are available on [github](https://github.com/dwybourn/swarm_blog_example)

As part of the setup, we create an [overlay network](https://docs.docker.com/engine/userguide/networking/get-started-overlay/), this is what allows docker containers to communicate with each other across different hosts.

Firstly, make sure you have VirtualBox and docker-machine installed, then follow these instructions step by step.

#### Step 1: Setup consul (our key value store)

1. Create a new virtual machine to run consul.

    `docker-machine create --driver virtualbox --virtualbox-memory 512 consul`
2. Point Docker commands to the newly created Docker host.

    `eval "$(docker-machine env consul)"`
3. Pull down and run a consul image.

    `docker run --restart=always -d -p "8500:8500" -h "consul" progrium/consul -server -bootstrap`

#### Step 2: Setup the Swarm master
1. Create the Swarm Master. Here we just have one Swarm Master, in a production environment you'd have a secondary master that can take over if the primary one fails.

    `docker-machine create --driver virtualbox --virtualbox-memory 512 --swarm --swarm-master --swarm-discovery="consul://$(docker-machine ip consul):8500" --engine-opt="cluster-store=consul://$(docker-machine ip consul):8500" --engine-opt="cluster-advertise=eth1:2376" master`

2. Create three Swarm agents, one for each service.

    `docker-machine create --driver virtualbox --virtualbox-memory 512 --swarm --swarm-discovery="consul://$(docker-machine ip consul):8500" --engine-opt="cluster-store=consul://$(docker-machine ip consul):8500" --engine-opt="cluster-advertise=eth1:2376" node0`

    `docker-machine create --driver virtualbox --virtualbox-memory 512 --swarm --swarm-discovery="consul://$(docker-machine ip consul):8500" --engine-opt="cluster-store=consul://$(docker-machine ip consul):8500" --engine-opt="cluster-advertise=eth1:2376" node1`

    `docker-machine create --driver virtualbox --virtualbox-memory 512 --swarm --swarm-discovery="consul://$(docker-machine ip consul):8500" --engine-opt="cluster-store=consul://$(docker-machine ip consul):8500" --engine-opt="cluster-advertise=eth1:2376" node2`

    Let's walk through this command to make it clear what's going on. `--swarm` says that we want a Swarm agent running on this host. `--swarm-discovery="consul://$(docker-machine ip consul):8500"`, this is saying to use our Consul server for service discovery. Likewise, `cluster-store` tells Docker where the key value store is. Finally, `"cluster-advertise"` advertises our host to the network.

#### Step 3: Create the overlay network
Now that all hosts are setup, we need to create an overlay network so the services can talk to each other.

1. Point Docker commands to the swarm master.

    `eval $(docker-machine env --swarm master)`

2. Create the overlay network. This network is created on the Swarm Master, but is spread to each of the hosts.

    `docker network create --driver overlay server-overlay-network`

#### Step 4: Run the services
Now with the overlay network up and running, the only thing left to do is run the services on the Swarm.

1. Bring up each service, notice that we're using the overlay network we just created.

    `docker run -p 8080:8080 -d --name=hello-world --net=server-overlay-network dwybourn/hello-world-server`

    `docker run -p 8080:8080 -d --name=hello --net=server-overlay-network dwybourn/hello-server`

    `docker run -p 8080:8080 -d --name=world --net=server-overlay-network dwybourn/world-server`

Now with all the services running, let's have a look at the services by running `docker ps` . You should see something like this:

<img src="{{ site.baseurl }}/dwybourn/assets/DockerSwarm/docker_ps_output.png"/>

The services have been spread out evenly with one service per node. As mentioned earlier, the default scheduling strategy is spread, if we added `--strategy=binpack` when creating the swarm master, we'd see all of the services running on a single host.

Remember earlier when we ran `eval $(docker-machine env --swarm master)`. This pointed all Docker commands to the Swarm Master, this is why we're seeing the swarm services. If we had run `eval $(docker-machine env node0)` followed by `docker ps`, we would see two containers; one for the swarm agent and one for the service.

#### Step 5: Test it all works
Now the swarm is up and running, we have our overlay network and our services running, let's see if the most over engineered Hello World example I've ever created works.

1. Run an instance of [busybox](https://www.busybox.net/), then use wget to get the hello-world service's homepage.

    `docker run --rm --net=server-overlay-network busybox wget -q -O- http://hello-world:8080`

If all went well you should see the string "Hello World" returned, pretty exciting stuff right?

### Overview
So it might not look like much, but it's what's happening behind the scenes that's impressive. We have three hosts to run our services, at no point did we have to say where to deploy them to, Docker Swarm handled that for us. Our hello-world service calls two other services, but has no idea where they are. It just needs to know the service name, once again Docker Swarm took care of routing the request to the correct host for us.

In the next blog post I'll be going over how to set up a production ready Docker Swarm in AWS. We'll use the same example, but we'll have a secondary Swarm Master (high availability mode) and we'll be setting up the machines manually so we can see how everything works.
