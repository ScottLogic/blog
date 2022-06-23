---
author: rhendry
title: Writing a Docker Volume Plugin for S3
summary: An experiment in writing a volume plugin for Docker
layout: default_post
tags:
  - docker
categories:
  - Data Engineering
---

While giving a talk about my recent experiences with Docker, I touched briefly on the subject of [data only containers][1]. In the ever changing world of containers, this practice has been superseded by [named volumes][2]. For the small examples I was presenting, creating volumes on the Docker host clashed with my goals, and I lamented that while solutions such as [flocker][3] exist to allow data volumes which back onto cloud storage, these were more involved than creating a simple volume that does the same.

"That's true", agreed one of my colleagues, "And it's not like you want to go down the route of writing your own volume plugin, is it...?"

You've figured out where this is going by now, but before I continue, a few words of warning; This is definitely not production ready code, at all. It's an "I wonder if I can..." experiment. By all means try this at home, but don't expect too much.

## Data Volumes

Data volumes are a way of persisting data and sharing it between containers. You can mount a directory on your Docker host as a volume, and have several containers all look to it for information. This is fine if you have your containers on the same host, but if they're spread more widely this isn't so useful.

At this point, third party solutions such as flocker step in to assist with ensuring that all the containers in your network have access to the volumes they require.

The Docker project I was presenting to colleagues was a simple affair, and so flocker was a bit too heavyweight for me. My use case boiled down to "How can I expose the contents of an S3 bucket as a volume?". Having not found a simple solution I'd gone with a data-only container, but now it was time to write a plugin.

## How Do You Write a Docker Plugin?

Well, you just write a Docker plugin. I had expected this to involve some low level programming, possibly in a language I wasn't familiar with, but I was pleasantly surprised to find that this was not the case.

Docker have decided that plugins should be implemented as JSON requests over HTTP, which gives great flexibility to plugin authors. I went down the route of node and express as that's what I've been using recently, and so getting it up and running would be quick.

All plugins must implement the [Handshake API][4] in order to register themselves as one of the three plugin types, and then the [Volume API][5] mandates only a further seven endpoints. Simple!

## Integrating With systemd

While I had no plans to create a polished end product, I did want to ensure that I was integrating with Docker correctly, so I followed the guidelines and created systemd configuration to control the service on my Ubuntu VM.

While this consists of two, simple files, it did cause something of a headache to begin with. I initially had my express server starting using the following line:

````
server.listen('/run/docker/plugins/s3-volume.sock', function() { ... })
````

This seemed to work fine. I could bounce the service using `systemctl` and systemd seemed happy and then, for some reason, I started getting bind exceptions from the service as it announced that the sock file already existed. In hindsight, the most likely culprit is a typo in my systemd configuration, or a missing option being added, but it did lead to some head scratching.

In the end, I came across a useful npm module which solved my problem. Instead of configuring the plugin service to listen on a port or socket, I used [the module][6] to tell it to listen where systemd was telling it to. Problem solved!

## Implementing The API

With only a small handful of endpoints to be implemented, it did not take long to have a simple service up and running, sending information about requests to syslog so I could better understand the flow through the API for different use cases.

Once a volume has been created by a plugin, it should be able to return a local mountpoint to the Docker daemon which is then used to persist data to disk when a container writes to the volume. This presented something of an issue to me; I had naively imagined I would be able to intercept requests for my S3 volume and use one of the existing NPM modules to transfer data back and forth. How was I going to achieve this if I had to supply a local directory to write to?

Step forward, [s3fs][7]! Before we press on, I would like to remind you of the "not production code" caveat from earlier.

The plan would now be that the service would create temporary, local directories when asked to create a volume, and on receipt of a mount request for the volume it would shell out to the s3fs command and mount the bucket in the temporary directory.

And so, the three most important steps of creating, mounting and unmounting volumes became quite straightforward to implement:

  1. [Create the temporary directory](https://github.com/chooban/s3-docker-volume-plugin/blob/master/app/routes.js#L20)
  1. [Mount it when requested](https://github.com/chooban/s3-docker-volume-plugin/blob/master/app/routes.js#L115)
  1. And [unmount it when no longer required](https://github.com/chooban/s3-docker-volume-plugin/blob/master/app/routes.js#L132)

With an installed, running service, an S3 bucket, and a correctly configured s3fs, I could create a named volume on my Docker host:

````
docker volume create -d s3-volume --name jason --opt bucket=plugin-experiment
````

And then, use a second container to write data to it:

````
docker run -it -v jason:/s3 busybox sh
/ # echo "Hello" >> /s3/greetings.txt
````

A quick check in the S3 Management Console confirmed that the file had been created, and when I logged out of the container I could see that the unmount command had been run.

## Running It For Yourself

The code is available on [GitHub](https://github.com/chooban/s3-docker-volume-plugin), with a more complete list of setup steps, but, as previously mentioned, it's for interest only. If you really wanted to use s3fs to create Docker volumes, why would you go to the bother of a plugin when you could just use a local directory mount in the first place?

While I don't intend to take the code any further, it was an interesting, and useful, exercise. I was pleasantly surprised how easy it was to implement a plugin, and the interaction between systemd and a node process may yet prove useful.

[1]: https://medium.com/@ramangupta/why-docker-data-containers-are-good-589b3c6c749e#.vzx5a7th6
[2]: https://docs.docker.com/engine/userguide/containers/dockervolumes/
[3]: https://clusterhq.com/flocker/introduction/
[4]: https://docs.docker.com/engine/extend/plugin_api/#handshake-api
[5]: https://docs.docker.com/engine/extend/plugins_volume/
[6]: https://www.npmjs.com/package/systemd
[7]: https://github.com/s3fs-fuse/s3fs-fuse
