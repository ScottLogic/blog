---
title: Keeping Secrets in Docker
date: 2017-03-01 00:00:00 Z
categories:
- rhendry
- Data Engineering
tags:
- docker
author: rhendry
summary: Docker 1.13 introduces a simple way of providing secrets to containers
layout: default_post
---

Keeping secrets in Docker containers has been a problem for a while now, and there have been a number of solutions
suggested by the internet at large. There's a good write-up of these over on the [issues
log](https://github.com/docker/docker/issues/13490).

If you're using Docker as a personal tool then you might have stuck with using environment variables rather than
creating another container to install [Consul](https://www.consul.io/), [etcd](https://github.com/coreos/etcd) or
another key store, but as of version 1.13 you can [manage sensitive data](https://docs.docker.com/engine/swarm/secrets/) within the Docker infrastructure directly.

I've recently upgraded a small personal project from using environment variables for service keys to the new way, which
turned out to be a fairly painless procedure.

## Secrets 1.0

Here's a snippet from the [Compose](https://docs.docker.com/compose/) file for the project:

{% highlight yaml %}
version: '2'
services:
  profiles:
    image: awesome-profile-service
    environment:
      - NODE_ENV=development
      - CLIENT_ID=t0t3lg1bb3ris4
      - CLIENT_SECRET=wh474l0t0fru331sh
{% endhighlight %}

This profiles service takes requests from a webapp and validates the supplied JWT against a third party service. In
order to perform the validation it needs the ID and secret which I'm passing in via the environment variables.

The eagle-eyed will have noticed it's a node application and so may have guessed that the relevant code looks a bit like
this:

{% highlight javascript %}
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
{% endhighlight %}

It works, but it's not ideal as the data leaks out of the container quite easily. If I were to spin up a container
configured in this way, I could run `docker inspect` and see all of the environment variables very easily. Not so great
if you had a environment which allowed developers to see the running containers in production for monitoring purposes,
but you had to keep production signing keys secret.

## Secrets 2.0

Now that we have secrets as first class citizens in the docker-engine environment, we can get away from leaking our data to the world, but there are a few hoops to jump through.

Putting secrets into the compose file requires us to use [version 3](https://docs.docker.com/compose/compose-file/) of the service definition and you may have noticed above that I'm only on v2. Although the [notes](https://docs.docker.com/compose/compose-file/compose-versioning/#/version-3) say that version 3 is designed to be cross-compatible with both Compose and Docker Engine's swarm mode I found that Compose wasn't too happy with secrets, so I switched to a swarm for my local development.

What did that entail? Not a lot, it turns out, if all you want to do is create a single node swarm:

`docker swarm init`

That's it. I can't speak to all the effects of doing that, so don't run it on production just yet, but my
development VM seems happy with the changes. After that, I created an updated version of my compose file, increasing the
version number and declaring my intention to use secrets:

{% highlight yaml %}
version: '3.1'
services:
  profiles:
    image: awesome-profile-service
    environment:
      - NODE_ENV=development
    secrets:
      - client_id
      - client_secret
secrets:
  client_id:
    file: ./client_id
  client_secret:
    file: ./client_secret
{% endhighlight %}

The new block at the bottom declares a couple of secrets that we want to be part of our deployment. You can't declare a
secret's value within the compose file, the only options being to put it in a local file or to create it externally
(more later). Since this is just for local development at the moment I copied my secrets into two files (which I then
added to git's ignore file before I did something stupid).

Secrets aren't exposed as environment variables in the running container, instead they're deployed to a read-only file
instead. I updated my service appropriately:

{% highlight javascript %}
const client_id = fs.readFileSync('/run/secrets/client_id', 'utf8').trim();
const client_secret = fs.readFileSync('/run/secrets/client_secret', 'utf8').trim();
{% endhighlight %}

Since we cannot use Compose to deploy secrets it's time to deploy to our local swarm:

`docker deploy -c docker-compose-secrets.yml secretservice`

This creates a stack called `secretservice` and deploys our services to it. A quick login and test later I could see
that my profiles service was still happily authenticating tokens without need of leaky secrets in environment variables.

## Secret Configuration

Having secrets in files isn't ideal so you can also define a secret as being `external` which means that you've declared
the secret outside of Compose (or deploy) and it already exists in the swarm. This is easily done using the
[secret](https://docs.docker.com/engine/swarm/secrets/) command (though if you're going to use `echo` then be sure and
do it in a way that bypasses your shell history!) which makes a lot more sense for production deployments.

## Next Steps

Since a docker secret is a blob of data up to 500KB in size, there's nothing to stop us from using them to store and
share config files as well. The volume mounts for nginx configuration files could easily move the secrets store
instead which, if this is possible, would make it very easy to share configuration automatically to new nodes in a
cluster, regardless of their host which is something I believe isn't so easy with data volumes. That said, I haven't had
need to do that yet, and with the pace of Docker development being what it is, that might already be a solved problem!
