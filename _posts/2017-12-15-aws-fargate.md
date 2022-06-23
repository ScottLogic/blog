---
title: Introducing AWS Fargate
date: 2017-12-15 00:00:00 Z
categories:
- nwolverson
- Cloud
author: nwolverson
layout: default_post
summary: 'AWS recently announced a couple of new container services, EKS and Fargate,
  and I''ll give a brief overview, a "first experience" walkthrough of Fargate, and
  discuss when you might want to choose it.

'
image: ''
---

AWS has a bewildering array of services, so much so that the full page service dropdown now has a scrollbar,  but when it comes to compute, these effectively all boil down to different flavours of VMs and containers. EC2 is at the root of it all; Batch is a way of firing off EC2 instances for batch workloads; ECS is running containers on EC2. Lambda is containers in disguise with elastic scaling (and the mask slips when you start to look at caching and container reuse - e.g. some like to [keep their lambdas warm](https://serverless.com/blog/keep-your-lambdas-warm/)).

With the recent [deluge of announcements](https://www.youtube.com/watch?v=1IxDLeFQKPk), AWS have included a couple of key compute novelties. One is EKS ([Amazon Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/features/)), in a way a means of remedying AWS's first-mover disadvantage in container orchestration - while they have had a capable platform in ECS for some time, Kubernetes has emerged as an industry standard, and while other cloud providers can offer managed Kubernetes solutions (e.g. [Azure Container Service](https://azure.microsoft.com/en-gb/services/container-service/)), on AWS you were previously left managing your own Kubernetes cluster.

[Fargate](https://aws.amazon.com/fargate/) on the other hand is something a bit different, a bit more novel.

> Run containers without managing servers or clusters

Just as with serverless, of course there are VMs under the hood (just now this sits on top of ECS, but later will introduce an EKS option), but in this case AWS takes care of them for you, so you can focus on the container(s) you want to run, and let AWS worry about allocating them to an EC2 instance.

Of course there were plenty other announcements relevant to EC2/ECS users, like updates to RDS Aurora, windows server containers, etc. One interesting new service just launched is [AWS Cloud9](https://aws.amazon.com/about-aws/whats-new/2017/11/introducing-aws-cloud9/), a "cloud based IDE" which runs  on top of an EC2 instance to build, run and debug your code, maybe not fit for all purposes but with some nice AWS integration, a handy tool.

## When to choose Fargate?

The AWS vision for Fargate basically seems to be if you don't have custom requirements for your EC2 instance - i.e. you're running a standard AMI with no further setup - you should be looking at Fargate, let Amazon solve the bin-packing problem, and don't pay for an entire EC2 instance just to run a single container/task.

Right now, the pricing model doesn't seem to support this. Let's compare with on-demand EC2 pricing in the us-east-1 region. Prices are showing as of just now in $/hour, on a basis of the listed 0.0506 vCPU/h and 0.0127 GB/h:

| Fargate | vCPU | Memory | Price ($/h) | EC2 | Class  | vCPU   | Memory   | Price ($/h)  |   |
|---|---|---|---|---|---|---|---|---|---|
|| 0.25 | 0.5 |0.019   |   | t2.nano | 1 | 0.5 | 0.0058 |
|| 0.25 | 1 |  0.02535 |   |   |   |   |   |   |
|| 0.25 | 2 | 0.03805  |   |   |   |   |   |   |
|| 0.5 | 1 | 0.038  |   | t2.micro | 1 | 1 | 0.0116 |
|| 0.5 | 2 | 0.0507  |   |   |   |   |   |   |
|| 0.5 | 3 |  0.0634 |   |   |   |   |   |   |
|| 1 | 2 |0.076 |  | t2.small | 1 | 2 | 0.023 |
|| 2 | 4 |0.152   |  | t2.medium | 2 | 4 | 0.0464 |


While these are shown as hourly prices, in both cases this usage is actually priced per second (note that EC2 was previously priced per hour, [this changed fairly recently](https://aws.amazon.com/blogs/aws/new-per-second-billing-for-ec2-instances-and-ebs-volumes/)).

So as you see there isn't really a point at which Fargate compares favourably with even an underutilised EC2 instance. Maybe if you're spinning a container up for a short task, less time spent starting an EC2 instance might give a saving, but certainly in the long term, this doesn't make financial sense.

So right now, the big win is the ease of use, as you might expect, you don't want to pay for the privilege of running full-time services on Fargate, but if you just need to spin something up quickly, or on occasion - maybe deploying an app for a demo, or investigating some new tech - it makes a lot of sense.

## First steps with Fargate

I'm going to walk through my initial experience with Fargate, initially with the shiny GUI and then without; it's worth noting that this is currently available in the `us-east-1` region only.

With the introduction of Fargate, the "first run" experience of ECS now guides you through deployment of a Fargate-based service. From the start, this is a more polished experience than before, with a diagram/navigational aid illustrating the container-task-service-cluster relation. I know this was an unclear concept for me to pick up at first.

![Conceptual nesting]({{site.baseurl}}/nwolverson/assets/fargate/get-started-diagram.png)

With a few clicks - but not without delay - the getting started app is deployed:

![Deploying progress]({{site.baseurl}}/nwolverson/assets/fargate/get-started-pending.gif)

As per the previous first-run experience, this is all CloudFormation under the hood (or at least the cluster setup). Again I wish I knew this the first time I tried to use ECS, the gulf between the wizard and the manual set up of all the individual pieces was huge.

### Setting it up by hand

To replicate the magical setup from the first-run wizard, you can first create a network-only cluster
![Cluster selection]({{site.baseurl}}/nwolverson/assets/fargate/cluster-type.png) and configure VPC appropriately as usual - though Fargate tasks can also be launched in the same cluster as existing EC2-based tasks (clusters are heterogeneous).

On creating a task definition, again one is presented with the option to choose Fargate:
![Choosing fargate]({{site.baseurl}}/nwolverson/assets/fargate/choose-fargate.png)

Then task definition is much the same as with the existing EC2 launch type - except the memory and vCPU limits at the task level are new, and obviously determine the performance but also the pricing structure.

### Automating it

Fargate is supported already in the [AWS](http://docs.aws.amazon.com/cli/latest/reference/ecs/create-service.html) and [ECS](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/cmd-ecs-cli-compose.html) CLIs and CloudFormation, and to a large extent uses the same model with a couple of changed properties.

For example, launching a Fargate cluster is simple with `ecs-cli`:

~~~
ecs-cli up --launch-type FARGATE --capability-iam
~~~

The `ecs-cli compose` command also gives us a simple setup for an example (though in reality I find it isn't compatible enough with docker-compose to be useful, as we'll already see below, and I'd define the task more directly). Lets say I have created, built and pushed a super simple docker image:

~~~
FROM nginx
RUN echo > /usr/share/nginx/html/index.html 'Good day, dear reader!'
~~~

~~~
docker build --tag hello-fargate .
ecs-cli push hello-fargate
~~~

Then I can create a `docker-compose.yml` file which can be used locally:

~~~
version: '2'
services:
  hello:
    image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/hello-fargate
    ports:
      - 8080:80
~~~

We can almost just push this up via `ecs-cli compose` to ECS. First we need to update the `docker-compose` file to use a matching host:container port mapping to be permitted with the `awsvpc` network type, this makes sense but means we already need to do some work to enable running locally from the same compose file. And some configuration is unfortunately required:

~~~
version: 1
task_definition:
  ecs_network_mode: awsvpc
  task_execution_role: ecsTaskExecutionRole
  task_size:
    cpu_limit: 256 # .25 vCPU
    mem_limit: 512 # 521 MB
run_params:
  network_configuration:
    awsvpc_configuration:
      subnets:
        - subnet-abcdabcd
        - subnet-abcdabcd
      security_groups:
        - sg-abcdabcd
      assign_public_ip: ENABLED
~~~

After all that it's as simple as

~~~
ecs-cli compose --ecs-params ecs-params.yml up --launch-type FARGATE
~~~

And voila, I can see the running task listed, connect to the IP and view our greeting!

~~~
$ ecs-cli ps
Name                                        State    Ports                         TaskDefinition
4582f89a-50de-406c-88eb-e5fb74930196/hello  RUNNING  [...public ip...]:80->80/tcp  blog-fargate:1
~~~

## Conclusion

It's nice to see a new idea with Fargate, that certainly has some potential, and already seems well fitted to some use cases. Fingers crossed as this rolls out more widely the cost reduces to a point where it becomes an easier choice to justify.

### Resources
Some Youtube videos:

[AWS Keynote](https://www.youtube.com/watch?v=1IxDLeFQKPk)

[Fargate launch](https://www.youtube.com/watch?v=0SceSgOTyrw)

[Fargate re:Invent launchpad](https://www.youtube.com/watch?v=y9mzpGAoOuE)

[EKS deep dive](https://www.youtube.com/watch?v=vrYLrx-a_Wg)

[EKS re:Invent launchpad](https://www.youtube.com/watch?v=EoC60KddIXE)