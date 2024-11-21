---
title: Docker 1.12 swarm mode - round robin inside and out
date: 2016-08-30 00:00:00 Z
categories:
- Data Engineering
author: csmith
summary: This post demonstrates how Docker 1.12 swarm mode round robins the containers
  in a service both for incoming connections (ingress) and DNS within the swarm.
layout: default_post
---

## Swarm mode built in with Docker 1.12

My excellent colleague Dave Wybourn recently blogged about Docker Swarm in [this post](http://blog.scottlogic.com/2016/06/17/docker-swarm.html). Since then, Docker 1.12 has been released and swarm functionality has been integrated into the main Docker engine.

Release 1.12 of the Docker engine has a lot of compelling new features. You can read about them in the official [release notes](https://github.com/docker/docker/blob/master/CHANGELOG.md#1120-2016-07-28) on GitHub.

On my current project, we have been using Docker Swarm as a separate product, with Consul for service discovery. We've just moved to Docker 1.12 and this has significantly simplified our deployment:

* "Swarm mode" is now built in to the core Docker engine
* DNS is built in to swarm mode and so we no longer need a separate service discovery component

In this blog post I want to talk about how Docker load balances requests to containers in a service, whether the requests are coming from outside the swarm (known as "ingress load balancing") or from within it. The release notes describe this as "Built-in Virtual-IP based internal and ingress load-balancing using IPVS" and refer to [this pull request](https://github.com/docker/docker/pull/23361). I'll describe how I got a swarm up and running on my development machine and then played with the round robin load balancing to get a feel for how it works.

("Ingress" isn't a common word. I found a good definition of "a place or means of access" after a quick google. "Ingress" is the term Docker uses to talk about connections coming into a swarm from outside, e.g. via an internet facing load balancer.)

## Creating a swarm

The pull request linked above has some interesting pictures of people covered in bees, like [this one](https://cloud.githubusercontent.com/assets/1564054/16031193/51b01d88-31ad-11e6-81bc-b67ececd640d.png). I'd recommend against this method of creating a swarm. I used VirtualBox instead.

### Networked VMs

I took my cue from the [Docker 1.12 swarm mode tutorial](https://docs.docker.com/engine/swarm/swarm-tutorial/) and created three machines called ```manager1```, ```worker1``` and ```worker2```. I used Vagrant to create the machines, with a multi-host [Vagrantfile](https://gist.github.com/csscottlogic/0e9269b7804a782528a8cf57e203204c) and then I installed the Docker engine manually. There are of course automated ways to do this, but I was just getting a feel for the new swarm mode.

There are two important points here:

- I set the host name on the machines, which is important for the demonstration later
- I make sure that the machines are on a host-only network created previously using VirtualBox, so that they can talk to each other. On my Windows machine, this is ```192.168.56.0/24```.

### Swarm nodes

I SSH'd into the manager node using

~~~
vagrant ssh manager1
~~~

and checked its IP address on the host-only network using ```ifconfig```. On my machine, the ```manager1``` VM had ```eth1``` assigned as ```192.168.56.101```, presumably because Vagrant brought this VM up first and the DHCP server (which is on ```192.168.56.100```) assigns IP addresses sequentially starting at 101.

I then created the swarm using

~~~
docker swarm init --advertise-addr 192.168.56.101
~~~

This command outputs a message telling you how to join more managers and workers to the newly created swarm. I dutifully SSH'd into ```worker1``` and ```worker2``` and joined them as workers using

~~~
docker swarm join \
--token SWMTKN-1-1o89gzximphxqvc6xykvucv58xujyb03xf1kaxmdc8x1gix0n9-eyx1qqxq16ixt1nxdgru6x05x \
192.168.56.101:2377
~~~

(I've mangled that token, since you should never publish a swarm token. Yours will be different.)

## Deploying a published service

In swarm parlance, a service is a set of containers created from the same image, using essentially the same ```docker run``` command. The actual command is ```docker service create```. The swarm master(s) make sure that the number of containers (a.k.a. replicas) we specify when we create the service is maintained. For instance, if a container dies, then another one will be spun up to take its place.

Now that we have an experimental swarm, we can deploy our first service and expose it to our adoring public! I did this with the following command:

~~~
docker service create --name web --replicas 3 --mount type=bind,src=/etc/hostname,dst=/usr/share/nginx/html/index.html,readonly --publish 80:80 nginx
~~~

I'm running 3 nginx containers exposed on port 80 of every node (VM) in the swarm. The bind mount is used for demonstration purposes to replace the default content that nginx will serve with the host name of the VM the container happens to be running on.

## Ingress and round robin load balancing

So let's see what happens if we hit our published service. If I execute ```curl http://192.168.56.101``` at a prompt on ```manager1``` 6 times, I get the following output:

~~~
worker2
worker1
manager1
worker2
worker1
manager1
~~~

There's magic here! Something is distributing the load evenly over the containers in the service. If I execute ```docker service ps web```, I see this:

~~~
ID                         NAME   IMAGE  NODE      DESIRED STATE  CURRENT STATE          ERROR
av3err69nwayohivaog3negsq  web.1  nginx  worker2   Running        Running 7 minutes ago
7926v7ugiomjbe0j5spxw8z53  web.2  nginx  worker1   Running        Running 7 minutes ago
ban21d49ilw4cwe90l2snrtpm  web.3  nginx  manager1  Running        Running 7 minutes ago
~~~

This "something" is also communicating between VMs, since swarm mode's scheduling algorithm has distributed the containers evenly among the nodes.

We're seeing ingress load balancing at work. The traffic to any VM is being distributed between the containers in the published service using an overlay network. If I run ```docker network ls``` on the manager node, I see this:

~~~
NETWORK ID          NAME                DRIVER              SCOPE
fe19570aae7b        bridge              bridge              local
97bdbe178cfc        docker_gwbridge     bridge              local
e931c77834c4        host                host                local
3cxuprxkc1hd        ingress             overlay             swarm
fbf21e4837a2        none                null                local
~~~

The only network with scope "swarm" is called "ingress" and this is being used to spread traffic between the nodes.

If I curl ```worker1``` or ```worker2``` multiple times, I see the same load balancing behaviour. In fact, if I were to curl a VM that's not running a container from the service, I would still get a response. (I'll leave it as an exercise for the reader to confirm that. You can scale the service back to 1 or 2 containers and hit all the VMs to see this happening.)

It's instructive to scale the service to a number that isn't a multiple of the number of nodes, e.g.:

~~~
docker service scale web=5
~~~

On my swarm, this distributes the containers 2-2-1 across the swarm nodes. Repeatedly curling the service then gives a repeated pattern like this,

~~~
manager1
worker1
manager1
worker1
worker2
~~~

which shows that the load is being distributed evenly, since running ```docker service ps web``` shows there is only one container on ```worker2```.

### Internal load balancing - DNS + VIP

Load balancing also works for calls between services within the swarm. To demonstrate this, I'll recreate the "web" service on a user-defined overlay network.

We can destroy the service with

~~~
docker service rm web
~~~

We then create an overlay network on the manager node using

~~~
docker network create --driver overlay services
~~~

Running ```docker network ls``` now gives us two overlay networks with scope "swarm" - the "ingress" network created by Docker and our new "services" network.

We can rerun the command we used for the ingress demonstration, but remove the ```--publish``` switch and add ```--network services```:

~~~
docker service create --name web --replicas 3 --mount type=bind,src=/etc/hostname,dst=/usr/share/nginx/html/index.html,readonly --network services nginx
~~~

Docker automatically spreads the overlay network to the nodes where it schedules the containers for the service.

To test this, we'll spin up a single container attached to the overlay network and create an interactive shell within it. We run

~~~
docker service create --name terminal --network services ubuntu sleep 3000
~~~

and then find out which node Docker has put it on. (Missing out ```--replicas``` defaults the number to 1.)

On my swarm, running ```docker service ps terminal``` tells me that it's on worker1, so I can use vagrant to SSH into that VM and find out the name of the container using a vanilla ```docker ps```. The name comes out as ```terminal.1.9h97oh8wut63a3hl8rgf6nakm```.

I can then create an interactive shell in the container using

~~~
docker exec -it terminal.1.9h97oh8wut63a3hl8rgf6nakm /bin/bash
~~~

I want to look at DNS records and also curl the web service, so I need some tools:

~~~
apt-get update
apt-get install -y dnsutils curl
~~~

So let's test out Docker 1.12's built in DNS in swarm mode! If I type ```nslookup web```, I see something like this:

~~~
Server:         127.0.0.11
Address:        127.0.0.11#53

Non-authoritative answer:
Name:   web
Address: 10.0.0.2
~~~

That's interesting because there are 3 containers, but only one IP returned. 10.0.0.2 is an example of a virtual IP (VIP) and it isn't assigned to a virtual network interface on an actual container. Rather, it's the entry point for round robin-ing the containers in the service. On my swarm, if I shell into the individual web containers and run ```ifconfig```, I see that they are actually on 10.0.0.3 - 10.0.0.5.

If I run ```curl http://web``` multiple times, I see the familiar output:

~~~
worker2
worker1
manager1
~~~

which shows that the round robin behaviour works within the swarm in the same way as it does from outside using the ingress overlay network.

## Conclusion

In this blog post, I wanted to demonstrate ingress and internal load balancing in a Docker 1.12 swarm with very simple containers and command line tools. I hope you're as impressed as I am with this new Docker capability! I've intentionally glossed over some details, e.g. running ```ifconfig``` in the web containers to see their overlay IPs. The documentation for Docker 1.12 swarm mode is really excellent and I'd recommend that as your next port of call if you want to dig deeper :-)
