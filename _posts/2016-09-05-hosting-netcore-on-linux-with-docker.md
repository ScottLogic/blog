---
title: Hosting .NET Core on Linux with Docker - A Noob's guide
date: 2016-09-05 00:00:00 Z
categories:
- nsoper
- Tech
author: nsoper
layout: default_post
summary: This blog describes my experience of upgrading a basic RESTful API from .NET
  Core RC1 to .NET Core 1.0, and using Docker to host it on Linux.  Docker is completely
  new to me so I'll give my thoughts as a noob.
---

This post builds on my previous [introduction to .NET Core]({{site.baseurl}}/2016/01/20/restful-api-with-aspnet50.html). First I upgrade that RESTful API from .NET Core RC1 to .NET Core 1.0, then I add support for Docker and describe how to host it on Linux in a production environment.

<img src="{{ site.baseurl }}/nsoper/assets/noob.png"/>

I'm completely new to Docker and I'm far from a Linux expert, so these are very much the thoughts of a noob.

## Installation

Follow the instructions on [https://www.microsoft.com/net/core](https://www.microsoft.com/net/core) to install .NET Core on your development machine. This will include the `dotnet` command line tool and the latest Visual Studio tooling for Windows.

## Source code

You can jump straight to the finished source code [on GitHub](https://github.com/niksoper/aspnet5-books/tree/blog-docker).

## Converting to .NET Core 1.0

Naturally, my first port of call when thinking about how to upgrade the API from RC1 to 1.0 was to [Google it with Bing](https://www.youtube.com/watch?v=tYVCk10AzS0).  There are two pretty comprehensive guides that I followed:

* [Migrating from DNX to .NET Core CLI](https://docs.microsoft.com/en-us/dotnet/articles/core/migrating-from-dnx)
* [Migrating from ASP.NET 5 RC1 to ASP.NET Core 1.0](https://docs.asp.net/en/latest/migration/rc1-to-rtm.html)

I advise reading through both of these very carefully when migrating your code because I tried to skim read the second one without reading the first one and got very confused and frustrated!

I won't describe the changes in detail because you can look at [the commit](https://github.com/niksoper/aspnet5-books/commit/b41ad38794c69a70a572be3ffad051fd2d7c53c0) on GitHub. Here is a summary of what I changed:

* Updated version numbers on `global.json` and `project.json`
* Removed obsolete sections from `project.json`
* Using the more lightweight `ControllerBase` rather than `Controller` because I don't need methods related to MVC views (this was an optional change)
* Removed the `Http` prefix from helper methods e.g. `HttpNotFound` -> `NotFound`
* `LogVerbose` -> `LogTrace`
* Namespace changes: `Microsoft.AspNetCore.*`
* Using `SetBasePath` in `Startup` (appsettings.json won't be found without this)
* Running via `WebHostBuilder` rather than `WebApplication.Run`
* Removed Serilog (at the time of writing it does not support .NET Core 1.0)

The only real headache here is the need to remove Serilog.  I could have implemented my own file logger, but I just deleted file logging because I didn't want to focus on it for this exercise.

Unfortunately, there will be plenty of third party developers that will be playing catch up with support for .NET Core 1.0 but I have sympathy for them because they are often working in their spare time without anything close to the resources available to Microsoft.  I recommend reading Travis Illig's [.NET Core 1.0 is Released, but Where is Autofac?](http://www.paraesthesia.com/archive/2016/06/29/netcore-rtm-where-is-autofac/) for a third party developer's point of view on this!

Having made these changes I was able to `dotnet restore`, `dotnet build` and `dotnet run` from the project.json directory and see the API working as before.

## Running with Docker

At the time of writing, Docker only *really* works on Linux. There is beta support for Docker on [Windows](https://docs.docker.com/engine/installation/windows/#/docker-for-windows) and [OS X](https://docs.docker.com/engine/installation/mac/) but they both rely on virtualisation so I've chosen to run [Ubuntu 14.04](http://releases.ubuntu.com/14.04/) as a [VirtualBox](https://www.virtualbox.org/).  Follow [these instructions](https://docs.docker.com/engine/installation/linux/ubuntulinux/) if you haven't already got Docker installed.

I've been doing a bit of reading about Docker recently but I've never tried to actually do anything with it until now.  I'll assume the reader has no Docker knowledge so I'll explain all parts of the commands that I'm using.

### Hello Docker

Having installed Docker on my Ubuntu machine, my next move was to follow the instructions at [https://www.microsoft.com/net/core#docker](https://www.microsoft.com/net/core#docker) to see how to get started with .NET Core and Docker.

First start a container with .NET Core installed:

`docker run -it microsoft/dotnet:latest`

The `-it` option means interactive so having executed this command you will be inside the container and free to run any bash commands you like.

Then we can run five commands to get Microsoft's Hello World .NET Core console application running inside Docker!

1. `mkdir hwapp`
1. `cd hwapp`
1. `dotnet new`
1. `dotnet restore`
1. `dotnet run`

You can `exit` to leave the container, then `docker ps -a` to show that you have created a container which has exited.  You should really now tidy up that container using `docker rm <container_name>`.

### Mounting the source

My next move was to use the same **microsoft/dotnet** image as above but to mount the source for my application as a [data volume](https://docs.docker.com/engine/tutorials/dockervolumes/).  

First check out the repository at the relevant commit:

1. `git clone https://github.com/niksoper/aspnet5-books.git`
1. `cd aspnet5-books/src/MvcLibrary`
1. `git checkout dotnet-core-1.0`

Now start a container running .NET Core 1.0 with the source located at **/books**.  Note that you'll need to change the **/path/to/repo** part to match your machine:

<pre>
docker run -it \
-v /path/to/repo/aspnet5-books/src/MvcLibrary:/books \
microsoft/dotnet:latest
</pre>

Now you can run the application inside the container!

1. `cd /books`
1. `dotnet restore`
1. `dotnet run`

That's great as a proof of concept but we don't really want to have to worry about mounting the source code into a container like this whenever we want to start the application.

### Adding a Dockerfile

The next step I took was to introduce a Dockerfile, which will allow the application to be started easily inside its own container.

My Dockerfile lives in the **src/MvcLibrary** directory alongside **project.json** and looks like this:

<pre>
FROM microsoft/dotnet:latest

# Create directory for the app source code
RUN mkdir -p /usr/src/books
WORKDIR /usr/src/books

# Copy the source and restore dependencies
COPY . /usr/src/books
RUN dotnet restore

# Expose the port and start the app
EXPOSE 5000
CMD [ "dotnet", "run" ]
</pre>

*Strictly, the `RUN mkdir -p /usr/src/books` command is not needed because `COPY` will create any missing directories automatically.*

Docker images are built in layers.  We start from the image containing .NET Core and add another layer which builds the application from source then runs the application.

Having added the Dockerfile, I then ran the following commands to build the image and start a container using that image (make sure you are in the same directory as the Dockerfile and you should really use your own username):

1. `docker build -t niksoper/netcore-books .`
1. `docker run -it niksoper/netcore-books`

You should see that the application started listening just as before, except this time we don't need to bother mounting the source code because it's already contained in the docker image.

### Exposing and publishing a port

This API isn't going to be very useful unless we can communicate with it from outside the container. Docker has the concept of **exposing** and **publishing** ports, which are two very different things.

From the official [Docker documentation](https://docs.docker.com/engine/reference/builder/#/expose):

> The EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime. EXPOSE does not make the ports of the container accessible to the host. To do that, you must use either the -p flag to publish a range of ports or the -P flag to publish all of the exposed ports.

`EXPOSE` only adds metadata to the image so you can think of it as documentation for the consumers of the image.  Technically, I could have left out the `EXPOSE 5000` line completely because I know the port that the API is listening on but leaving it in is helpful and certainly recommended.

At this stage I want to access the API directly from the host so I need to use `-p` to **publish** the port - this allows a request to port 5000 on the host be forwarded to port 5000 in the container regardless of whether the port has previously been **exposed** via the Dockerfile:

`docker run -d -p 5000:5000 niksoper/netcore-books`

Using `-d` tells docker to run the container in detached mode so we won't see its output but it will still be running and listening on port 5000 - prove this to yourself with `docker ps`.

So then I prepared to celebrate by making a request from the host to the container:

`curl http://localhost:5000/api/books`

It didn't work.

Making the same `curl` request repeatedly, I see one of two errors - either `curl: (56) Recv failure: Connection reset by peer` or `curl: (52) Empty reply from server`.

I went back to the [docker run documentation](https://docs.docker.com/engine/reference/run/#/expose-incoming-ports) and double checked I was using the `-p` option correctly as well as `EXPOSE` in the Dockerfile. I couldn't see the problem and became a bit sad...

After pulling myself together, I decided to consult one of my local DevOps heroes - Dave Wybourn (also mentioned in [this post]({{site.baseurl}}/2016/08/30/docker-1-12-swarm-mode-round-robin.html) on Docker Swarm). His team had run into this exact problem and the issue was the way that I had (not) configured [Kestrel](https://docs.asp.net/en/latest/fundamentals/servers.html#kestrel) - the new lightweight, cross platform web server used for .NET Core.

By default, Kestrel will listen on `http://localhost:5000`.  The problem here is that `localhost` is a loopback interface.

From [Wikipedia](https://en.wikipedia.org/wiki/Localhost):

> In computer networking, localhost is a hostname that means this computer. It is used to access the network services that are running on the host via its loopback network interface. Using the loopback interface bypasses any local network interface hardware.

This is a problem when running inside a container because `localhost` can only be reached from within that container.  The solution was to update the `Main` method in **Startup.cs** to configure the URLs that Kestrel will listen on:

{% highlight c# %}
public static void Main(string[] args)
{
  var host = new WebHostBuilder()
    .UseKestrel()
    .UseContentRoot(Directory.GetCurrentDirectory())
    .UseUrls("http://*:5000") // listen on port 5000 on all network interfaces
    .UseIISIntegration()
    .UseStartup<Startup>()
    .Build();

  host.Run();
}
{% endhighlight %}

With this extra configuration in place, I could then rebuild image and run the application in a container which will accept requests from the host:

1. `docker build -t niksoper/netcore-books .`
1. `docker run -d -p 5000:5000 niksoper/netcore-books`
1. `curl -i http://localhost:5000/api/books`

I now get the following response:

<pre>
HTTP/1.1 200 OK
Date: Tue, 30 Aug 2016 15:25:43 GMT
Transfer-Encoding: chunked
Content-Type: application/json; charset=utf-8
Server: Kestrel

[{"id":"1","title":"RESTful API with ASP.NET Core MVC 1.0","author":"Nick Soper"}]
</pre>

## Kestrel in production

[Microsoft's words](https://docs.asp.net/en/latest/publishing/linuxproduction.html#why-use-a-reverse-proxy-server):

> Kestrel is great for serving dynamic content from ASP.NET, however the web serving parts aren’t as feature rich as full-featured servers like IIS, Apache or Nginx. A reverse proxy-server can allow you to offload work like serving static content, caching requests, compressing requests, and SSL termination from the HTTP server.

So I need to set up Nginx on my Linux machine to act as my reverse proxy.  Microsoft spell out how to do this in [Publish to a Linux Production Environment](https://docs.asp.net/en/latest/publishing/linuxproduction.html). I'll summarise the instructions here:

1. Use `dotnet publish` to produce a self contained package for the application
1. Copy the published application to the server
1. Install and configure Nginx (as a reverse proxy server)
1. Install and configure [supervisor](http://supervisord.org/) (for keeping the Kestrel server running)
1. Enable and configure [AppArmor](https://wiki.ubuntu.com/AppArmor) (for limiting the resources available to an application)
1. Configure the server firewall
1. Secure Nginx (involves building from source and configuring SSL)

It's beyond the scope of this post to cover all of that, so I'm only going to concentrate on configuring Nginx as a reverse proxy - and naturally, I'm going to use Docker to do it.

## Run Nginx in another container

My aim is to run Nginx in a second Docker container and configure it as a reverse proxy to my application container.

I've used the [official Nginx image from Docker Hub](https://hub.docker.com/_/nginx/).  First I tried it out like this:

`docker run -d -p 8080:80 --name web nginx`

This starts a container running Nginx and maps port 8080 on the host to port 80 in the container.  Hitting `http://localhost:8080` in the browser now shows the default Nginx landing page.

Now we've proved how easy it is to get Nginx running, we can kill the container.

`docker rm -f web`

## Configuring Nginx as a reverse proxy

Nginx can be configured as a reverse proxy by editing the config file at `/etc/nginx/conf.d/default.conf` like this:

<pre>
server {
  listen 80;

  location / {
    proxy_pass http://localhost:6666;
  }
}
</pre>

The config above will cause Nginx to proxy all requests from the root to `http://localhost:6666`. Remember `localhost` here refers to the container running Nginx.  We can use our own config file inside the Nginx container using a volume:

<pre>
docker run -d -p 8080:80 \
-v /path/to/my.conf:/etc/nginx/conf.d/default.conf \
nginx
</pre>

**Note:** this maps a single file from the host to the container, rather than an entire directory.

## Communicating between containers

Docker allows inter-container communication using shared virtual networks.  By default, all containers started by the Docker daemon will have access to a virtual network called `bridge`. This allows containers to be referenced from other containers on the same network via IP address and port.

You can discover the IP address of a running container by inspecting it.  I'll start a container from the `niksoper/netcore-books` image that I created earlier, and inspect it:

1. `docker run -d -p 5000:5000 --name books niksoper/netcore-books`
1. `docker inspect books`

<img src="{{ site.baseurl }}/nsoper/assets/docker-inspect-ip.PNG"/>

We can see this container has `"IPAddress": "172.17.0.3"`.

So now if I create the following Nginx config file, then start an Nginx container using that file, then it will proxy requests to my API:

<pre>
server {
  listen 80;

  location / {
    proxy_pass http://172.17.0.3:5000;
  }
}
</pre>

Now I can start an Nginx container using that config (note I'm mapping port 8080 on the host to port 80 on the Nginx container):

<pre>
docker run -d -p 8080:80 \
-v ~/dev/nginx/my.nginx.conf:/etc/nginx/conf.d/default.conf \
nginx
</pre>

A request to `http://localhost:8080` will now be proxied to my application. Note the `Server` header in the following `curl` response:

<img src="{{ site.baseurl }}/nsoper/assets/nginx-proxy-response.PNG"/>

## Docker Compose

At this point I was fairly pleased with my progress but I thought there must be a better way of configuring Nginx without needing to know the exact IP address of the application container. Another of the local Scott Logic DevOps heroes - Jason Ebbin - stepped up at this point and suggested [Docker Compose](https://docs.docker.com/compose/).

As a high level description - Docker Compose makes it very easy to start up a collection of interconnected containers using a declarative syntax. I won't go into the details of how Docker Compose works because you can read about it in [this previous post]({{site.baseurl}}/2016/01/25/playing-with-docker-compose-and-erlang.html).

I'll start with the **docker-compose.yml** file that I'm using:

<pre>
version: '2'
services:
    books-service:
        container_name: books-api
        build: .

    reverse-proxy:
        container_name: reverse-proxy
        image: nginx
        ports:
         - "9090:8080"
        volumes:
         - ./proxy.conf:/etc/nginx/conf.d/default.conf

</pre>

*This is version 2 syntax, so you'll need to have at least version 1.6 of Docker Compose in order for this to work.*

This file tells Docker to create two services - one for the application and another for the Nginx reverse proxy.  

### books-service

This builds a container called `books-api` from the Dockerfile in the same directory as this **docker-compose.yml**. Note that this container does not need to publish any ports because it only needs to be accessed from the `reverse-proxy` container rather than the host operating system.

### reverse-proxy

This starts a container called `reverse-proxy` based on the `nginx` image with a **proxy.conf** file mounted as the config from the current directory. It maps port 9090 on the host to port 8080 in the container which allows us to access the container from the host at `http://localhost:9090`.

The **proxy.conf** file looks like this:
<pre>
server {
    listen 8080;

    location / {
      proxy_pass http://books-service:5000;
    }
}
</pre>

The key point here is that we can now refer to `books-service` by name so we don't need to know the IP address of the `books-api` container!

Now we can start the two containers with a working reverse proxy (`-d` means detached so we don't see the output from the containers):

`docker compose up -d`

Prove the containers were created:

`docker ps`

And finally confirm that we can hit the API via the reverse proxy:

`curl -i http://localhost:9090/api/books`

### What's going on?

Docker Compose makes this happen by creating a new virtual network called `mvclibrary_default` which is used by both `books-api` and `reverse-proxy` containers (the name is based on the parent directory of the **docker-compose.yml** file).

Prove the network exists with `docker network ls`:

<img src="{{ site.baseurl }}/nsoper/assets/docker-network-ls.PNG"/>

You can see the details of the new network using `docker network inspect mvclibrary_default`:

<img src="{{ site.baseurl }}/nsoper/assets/network-inspect.PNG"/>

Note that Docker has assigned `"Subnet": "172.18.0.0/16"` to the network. The `/16` part is CIDR notation and a full explanation is way beyond the scope of this post but CIDR just refers to a range of IP addresses. Running `docker network inspect bridge` shows `"Subnet": "172.17.0.0/16"` so the two networks do not overlap.

Now `docker inspect books-api` to confirm the application container is using this network:

<img src="{{ site.baseurl }}/nsoper/assets/docker-inspect-books-api.PNG"/>

Notice the two `"Aliases"` for the container are the container identifier (`3c42db680459`) and the service name given in **docker-compose.yml** (`books-service`).  We're using the `books-service` alias to reference the application container in the custom Nginx configuration file. This could have been done manually with `docker network create` but I like Docker Compose because it wraps up container creation and interdependencies cleanly and succinctly.

## Conclusion

So now I can get the application running on Linux with Nginx in a few easy steps, without making any lasting changes to the host operating system:

1. `git clone https://github.com/niksoper/aspnet5-books.git`
1. `cd aspnet5-books/src/MvcLibrary`
1. `git checkout blog-docker`
1. `docker-compose up -d`
1. `curl -i http://localhost:9090/api/books`

I know what I have described in this post is not a truly production ready setup because I've not spoken about any of the following, but most of these topics could take an entire post on their own:

* Security concerns like firewalls or SSL configuration
* How to ensure the application keeps running
* How to be selective about what to include in a Docker image (I dumped everything in via the Dockerfile)
* Databases - how to manage them in containers

This has been a very interesting learning experience for me because for a while now I have been curious to explore the new cross platform support that comes with ASP.NET Core, and the opportunity to explore a little bit of the DevOps world using Docker Compose for a "Configuration as Code" approach has been both enjoyable and educational.

If you're at all curious about Docker then I encourage you to get stuck in by trying it out - especially if this puts you out of your comfort zone. Who knows, you might enjoy it?
