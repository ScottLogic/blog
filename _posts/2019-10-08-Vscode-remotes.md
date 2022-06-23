---
title: 'Visual Studio Remotes: Simplifying developer environments'
date: 2019-10-08 00:00:00 Z
categories:
- mmoxon
- Tech
tags:
- VSCode
- Docker
- SSH
author: mmoxon
layout: default_post
summary: For the past few months I've been using Visual Studio Code Remotes, a powerful
  new feature that is available in Visual Studio code.
---

## Introduction
For the past few months I've been using Visual Studio Code Remotes, a powerful new feature
that [is available in Visual Studio code](https://code.visualstudio.com/docs/remote/remote-overview).

Remotes allows VSCode to operate in either a Docker container, a remote machine via SSH, or
inside the Windows Subsystem for Linux. In this post I'll focus on the first two of
these and give some example use cases for each.


## Containers Remote
Developers are constantly making configuration changes to their machines, installing and uninstalling
packages and updating their machines to accomodate the dependencies of whatever software they are building at any given time. As a result the machine configurations of developers on a team will naturally diverge. This is likely to give rise to "it works on my machine", as well as the subsequent task of trying to figure out what exactly isn't configured correctly.

This issue is compounded by the fact that stakeholders in a project must
also create a clear record of every step they made to set up the configuration
necessary to correctly set up the environment for working on a project. This may
involve downloading and installing packages, configuring a local database, setting up a web server etc.

Fortunately, VSCode's container remote allows us to leverage the benefits of Docker
to build reproducible, isolated and reliable development environments.
  We can put our entire development environment inside a docker container, and work
with VSCode as if it were running inside this container. By containerising dependencies
needed to develop and build an application, it reduces the barrier of entry for a developer
to start working on a project. Additionally, since the container itself is a testable part of the repository, assertions can be made about whether the instructions provided to build it are sufficient.

A benefit of this workflow is that the Dockerfile used to generate the development container can also be version controlled, meaning that changes can be tracked alongside the source. Significant changes to an environment can be as simple as updating the Dockerfile, and each member of the team has only to rebuild their development container to observe this change. Since the Dockerfile provides a description of the environment, it can also guide writing the setup portion of the README with no ambiguity.

### Set up Containers Remote
Provided docker is installed, setting up container remotes is simply a matter of installing the extension:

![vscode-container-remote.PNG]({{site.baseurl}}/mmoxon/assets/vscode-container-remote.PNG)

Once installed, vscode will look for either `.devContainer.json` or `.devContainer/devContainer.json` to determine the configuration for the container remote. This file contains configuration such as the location of the dockerfile to build the container image, and what vscode extensions should be included.

A full reference for `devContainer.json` options
 [can be found here](https://code.visualstudio.com/docs/remote/containers#_devcontainerjson-reference)



### Basic Example: PHP Container

Here is a simple example of a Hello World PHP based on a slightly simplified version of the official 
[PHP remote example](https://github.com/Microsoft/vscode-remote-try-php).

![vscode-php-remote.png]({{site.baseurl}}/mmoxon/assets/vscode-php-remote.png)



In `devContainer.json` the `Dockerfile` location is specified relative to the
`devContainer.json` location, along with two Vscode extensions.

~~~json
{
  "name": "PHP",
  "dockerFile": "Dockerfile",
  "extensions": [
    "felixfbecker.php-debug",
    "felixfbecker.php-intellisense"
  ]
}
~~~

The `Dockerfile` specifies all the dependencies needed for working with PHP, 
including git and xdebug:



~~~dockerfile 

#-----------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See LICENSE in the project root for license information.
#-----------------------------------------------------------------------------------------

FROM php:7-cli

# Install xdebug
RUN yes | pecl install xdebug \
	&& echo "zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" \
		 > /usr/local/etc/php/conf.d/xdebug.ini \
	&& echo "xdebug.remote_enable=on" >> /usr/local/etc/php/conf.d/xdebug.ini \
	&& echo "xdebug.remote_autostart=on" >> /usr/local/etc/php/conf.d/xdebug.ini

# Install git, process tools
RUN apt-get update && apt-get -y install git procps

# Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
~~~

Index.php: 

~~~php
<?php
	echo "Hello world from inside container\n";
?>
~~~

One of the first things that appears when you open this directory is a dialog showing vscode has detected the `devContainer.json`:

![open-in-container.png]({{site.baseurl}}/mmoxon/assets/open-in-container.png)

The "Reopen in container" option (which can also be accessed via the command pallette `ctrl+shift+p`) will build the Docker image and reopen VScode inside this container.

Let's experiment with this new php environment by running the php built in server.

![php-server.png]({{site.baseurl}}/mmoxon/assets/php-server.png)

Success... almost. The php server is running, but we can't access it in our browser yet. 
The server process is isolated in a docker container, so we need to bind a port on the host machine to this port.

We bind ports dynamically by calling the command pallete `Ctrl+shift+p`, `Remote-Containers: Forward Port from Container`

And... actual success this time!

![hello-world.PNG]({{site.baseurl}}/mmoxon/assets/hello-world.PNG)

### Real World Example: Scott Logic Blog

While writing this blog post, I wanted to see the changes as they would appear published on the blog.
Rather than install ruby and jekyll on my development machine, I decided to set up a development container
containing these dependencies. Here is the `.devContainer.json` in the root of the directory. We can
see it is possible to define which ports we want to bind to the container in the configuration.

~~~json
{
	"name": "Scott Logic Blog with Jekyll",
	"dockerFile": "Dockerfile",
	"appPort": 4000
}
~~~

Here is the `Dockerfile` for a simple debian image with nodejs and ruby set up, and installing the ruby dependencies from the Gemfile.

~~~dockerfile 
FROM debian:9.9
RUN apt update && apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt update && apt install -y build-essential patch ruby-dev zlib1g-dev liblzma-dev nodejs
COPY Gemfile .
RUN gem install bundler
RUN bundler install
ENV SHELL /bin/bash
~~~

Reopening VSCode in this container gives us access to jekyll, npm and all of the dependencies necessary to run the server.
Port `4000` on the host is bound to the container.

Let's try it out:
![jekyll-serve.png]({{site.baseurl}}/mmoxon/assets/jekyll-serve.png)

Looks good, let's try opening it in the browser:

![jekyll-serve-browser-2.PNG]({{site.baseurl}}/mmoxon/assets/jekyll-serve-browser-2.PNG)


Success! Now we have a containerised development environment that another developer can replicate and use immediately.

### Lowering the barrier to the first line of code
A major benefit of containerised development environments is that they signficantly reduce the
amount of time and effort investment required to experiment with open source projects. If a developer
is evaluating multiple projects, configuring their development machine for each one may be prohibitively
resource intensive. Being able to build and develop immediately makes it much more likely
that they will take the first step of experimenting with the source code.


## SSH Remotes
Sometimes we have to make some changes on a remote development machine over SSH.
While most developers have no problem with the small change here and there using
CLI editors such as vim, for more complex changes it can be less of a context switch
to continue using the same editor to make changes on remote machines.

Setting up SSH remotes involves installing the extension:
  ![ssh-remotes.png]({{site.baseurl}}/mmoxon/assets/ssh-remotes.png)
  

And configuring your `~/.ssh/config`. This assumes you already have key set up to log in with
Here is a redacted subset of my [ssh config file](https://www.ssh.com/ssh/config/) used to remote into an AWS EC2 instance:

~~~crystal
Host ec2
    HostName  ec2-12-345-678-912.eu-west-2.compute.amazonaws.com
    User ec2-user
    IdentityFile ~/.ssh/aws-key.pem
~~~

Connecting to a host is simple as opening the command pallete `ctrl+shift+p` and choosing `connect to host`, `ec2`, and ...

  ![ec2-remote.png]({{site.baseurl}}/mmoxon/assets/ec2-remote.png)

And now we have access to all features and extensions of VSCode while working directly on the remote machine

## Conclusion
The new remotes features of VScode have improved my development experience in just the short time they've been available. There are definite use cases for each remote, and I suspect the Containers remote has the potential to reduce project overhead.
