---
title: Infrastructure as Code - Getting Started with Terraform
date: 2018-10-08 00:00:00 Z
categories:
- Cloud
tags:
- featured
author: cmeehan
layout: default_post
summary: The popularity of Infrastructure as Code has skyrocketed in the last few
  years. Such tools allow the rapid and reliable provisioning of resources straight
  to the cloud, saving huge amounts of time and effort in the long run. One of the
  most prominent of these tools is Terraform, which this post will focus on, particularly
  with regards to AWS.
image: cmeehan/assets/terraform.jpg
---

This blog post serves as a brief introduction to what Infrastructure as Code is, as well as how to get started using it with Terraform. Although Terraform can be used with many cloud providers, the post focuses particularly on deploying resources to AWS.

## The problem

So, you need some kind of cloud deployed software and you’ve already decided on some Infrastructure as a Service provider (IaaS - one of the many *something* as *something* acronyms that’s all the rage) such as AWS or Azure. If you require a large set of infrastructure, for a complex distributed application for instance, all of a sudden you find yourself spending a lot of your free time and weekends in the AWS console.

Live configuration of services and the bringing up and down of resources becomes a frequent endeavour, especially during the developmental/experimental stages. On top of the gradual attrition of your will to live, this manual and repetitive procedure also opens you up to human error. Provisioning resources in a slightly different sequence can cause parts of the application to behave unexpectedly. Moreover, with all those services, it’s much more likely you’ll forget to destroy one of them; hiding out of sight while the AWS bill creeps up insidiously.

We recently found ourselves in a very similar situation, building a cloud hosted tool for comparing various data engineering technologies. Everything was deployed to AWS, primarily using the [EC2 Container Service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) for managing all the dockerised services that made up our distributed application. As the tool rapidly grew in functionality, so too did the required infrastructure; we suddenly had to account for various network resources (subnets, internet/api gateways, route53 hosted zones etc.), load balancers, EC2 clusters,  container repositories and more. 

We spent many hours staring at the AWS console, wondering why everything was broken, despite being *certain* we followed the same deployment steps as the time it worked. Instead of trying to rigidly document the exact provisioning process, we decided there must be a better way…

## The Solution


![Terraform Logo]({{site.baseurl}}/cmeehan/assets/terraform-logo.PNG)


###### ...well, specifically, infrastructure as code

## What is infrastructure as code?
Infrastructure as Code, in simple terms, is a means by which we can write declarative definitions for the infrastructure we want to exist and using them with a provisioning tool that deals with the actual deployment. This means that we can code what we want built, provide necessary credentials for the given IaaS provider, kick off the provisioning process, pop the kettle on and come back to find all your services purring along nicely in the cloud… or a terminal screen full of ominous warnings about failed deployment and “unrecoverable state” and a deep sense of growing unease (but not often, don’t worry 👍).

### Advantages
Using Infrastructure as Code as part of your deployment process has a number of immediate benefits to your workflow:

1. Speed - This one speaks for itself really, automation beats manually navigating through an interface to deploy and connect up resources, hands down.

2. Reliability - With a large set of infrastructure, it becomes so easy to misconfigure a resource or provision the services in the wrong order. With IaC the resources will be configured exactly as declared, and implicit/explicit dependencies can be used to ensure the creation order.

3. Experimentation - With the ease at which the infrastructure can be deployed, experimental changes can be readily investigated with scaled down resources to minimise the cost. Once approved, everything can be scaled up for production deployments. 

4. Best Practices - As developers, we’re always looking to employ the known best practices of software engineering wherever we can. Writing code to design and deploy infrastructure facilitates this in the arena of cloud provisioning, using established techniques like writing modular, configurable code committed to version control. This leads us to view our infrastructure as somewhat of a software application in itself, and shifts us in the direction of a DevOps culture. 

![The enabling idea of infrastructure as code is that the systems and devices which are used to run software can be treated as if they, themselves, are software - Kief Morris]({{site.baseurl}}/cmeehan/assets/iac-quote.jpg)



## Sounds like dark magic, how does it actually work?

There are two overarching methods to implement Infrastructure as Code - ‘Push’ and ‘Pull’: 
The Push approach is based around a controlling server, ie the user’s machine, pushing the all the provisioning information to the actual destination server/s to be configured. (CFEngine, Chef, Puppet)
Conversely, the Pull method involves the IaaS requesting it’s configuration from another server, either at a set interval or after receiving a cue. (Terraform, Otter, Ansible Tower).

Although there are number of cloud provisioning IaC tools, each with its own implementation, for the purpose of this blog post I will focus exclusively on using Terraform for deploying to AWS. Also, for the sake of simplicity, I won’t get into all the details and best practices of working with Terraform in an agile team environment, but will attempt to cover that in a subsequent post.

![meme.jpg]({{site.baseurl}}/cmeehan/assets/meme.jpg)


Terraform uses a Push approach, and therefore initiates the provisioning process by interacting directly with AWS to communicate the desired infrastructure. It does this by using the supplied AWS credentials with the Terraform AWS Provider Plugin, which under the hood utilises the AWS Go SDK. 

From its knowledge of the live infrastructure, Terraform generates a ‘terraform.tfstate’ file, with which it can effectively employ a ‘diffing’ technique on the declared desired infrastructure and that which is actually deployed. Once any required live changes have been calculated, a plan (.tfplan) file is generated. If approved, Terraform can get to work in effecting these changes in AWS. It’s important to note that in the majority of cases, Terraform treats these resources as immutable, that is, rather than trying make configuration changes to already deployed infrastructure, it opts to destroy the resource and create a new one. This directly relates to the ‘speed’ and ‘experimentation’ advantages - rather than wasting time fiddling with deployed resources, developers can just destroy them and create them anew. After all, in today’s world, server time is cheap and developer time is expensive 


## Let’s see Terraform in action / Getting started using Terraform

Terraform itself is a CLI tool, and can be downloaded from ‘the official release page’. It is developed by Hashicorp so, naturally, relies on the HashiCorp Configuration Language (HCL) for creating declarations. HCL strives to be both human and machine friendly, being fully JSON compatible while also supporting comments and variable interpolation etc. Terraform files themselves are referred to as ‘configuration files’ and have the file extensions .tf and .tf.json.

In order to start using Terraform, initialise a terraform directory by calling `terraform init` in any directory containing at least one configuration file. A typical Terraform module will have the following structure:

~~~
my-terraform-files
│
└───my-terraform-module
│   │   main.tf
│   │   variables.tf
|   |   outputs.tf
│   
└───my-other-terraform-module
│   │   main.tf
│   │   variables.tf
|   |   outputs.tf
~~~

Note that the file names themselves are not important, and terraform commands will load all configuration files in the directory. For simplicity’s sake, I won’t cover the creation of reusable modules in this post, and will keep all the declarations in one simple directory with the minimal amount of files.

### Provider
Before Terraform will be able to do anything useful, you must specify which IaaS provider you’re using. This will be the cue to download the plugins necessary to read from and write to the hosting service. Of course, before it can access anything on AWS, it needs the relevant permissions, so here comes the scary part… supplying your AWS credentials 😧. Before doing so, create a user in your AWS IAM account for Terraform itself (just giving it the permissions you’re happy with). There’s a few ways of supplying the provider with your AWS credentials, but a pretty standard way is as follows:



**main.tf**

~~~ruby
provider "aws" {
 region = "eu-west-1"
 version = "~> 1.19"
 access_key = "${var.aws_access_key}"
 secret_key = "${var.aws_secret_key}"
}
~~~

Here, we declare that our provider (AWS), the AWS region (Ireland 💚) , the plugin version and the credentials. Notice here how the credentials are declared using variable interpolation syntax. This leads us on nicely to an essential aspect of HCL: variables. Remember that all configuration files (.tf) in the directory are loaded when run running commands, allowing us to declare variables wherever we want. So, along with a ‘variables.tf’ file, we could also have:


**variables.secret.tf**

~~~ruby
variable "aws_access_key" {
 description = "The AWS access key."
 default     = "XYXYXACCESSKEYXYXYX"
}

variable "aws_secret_key" {
 description = "The AWS secret key."
 default     = "XYXYSUPERSECRETKEYXYXYX"
}
~~~

Then, we can simply ignore ‘.secret.tf’ files in our version control 👊. (Alternative means of supplying credentials are from environment variables or storing them in ~/.aws/config, as explained in more detail [here](https://www.terraform.io/docs/providers/aws/#authentication). In an another ‘main’ variables file ( `variables.tf`), we declare values essential to our resource provisioning such as instance sizings, autoscale desired capacities and the various human-friendly names of all the resources. A typical file may look like:

**variables.tf**

~~~ruby
variable "instance_type" {
 description = "Type of EC2 instance to use"
 default = "t2.small"
}

variable "instance_types" {
 type    = "map"
 default = {
   "dev" = "t2.small"
   "prod" = "t3.large"
 }
}

variable "autoscale_min" {
 description= "The minimum number of EC2 instances"
 default = 2
}

variable "autoscale_max" {
 description= "The maximum number of EC2 instances"
 default = 5
}

variable "autoscale_desired" {
 description = "Desired autoscale (number of EC2)"
 default = 3
}

variable "alb_name" {
 description = "Human-friendly application load balancer name"
 default = "my-alb"
}
~~~

Here, we’re simply declaring some values to be reused when declaring the infrastructure we need. The descriptions are purely optional, and for the developer’s benefit only. The possible variable types are `string` (default type), `list` and `map`. Variables can also be declared but left blank, setting their values through environment variables or .tfvars files, explained [here](https://www.terraform.io/intro/getting-started/variables.html#from-a-file). The former can be accomplished by prepending the variable name with `TF_VAR_`, for example:

~~~ruby
variable "environment" {
 description = "Generic environment"
}
~~~

~~~bash
$ TF_VAR_environment=foo terraform apply
~~~

Ok cool, but we haven’t really done anything yet. Time to actually do, infrastructure, stuff.

### Resources

The most essential components of configuration files are ‘resources’. This is where you declare the type of resource and all of the resource specific settings. Let’s take a look at a simple set of resources:

~~~ruby
resource "aws_instance" "myapp_ec2_instance" {
 ami               = "ami-21f78e11"
 availability_zone = "${var.availability_zone}"
 instance_type     = "${var.instance_type}"

 tags {
   Name = "myapp-EC2-instance"
 }
}

resource "aws_ebs_volume" "myapp_ebs_volume" {
 availability_zone = "${var.availability_zone}"
 size              = 1

  tags {
   Name = "myapp-EBS-volume"
 }
}

resource "aws_volume_attachment" "myapp_vol_attachment" {
 device_name = "/dev/sdh"
 volume_id   = "${aws_ebs_volume.myapp_ebs_volume.id}"
 instance_id = "${aws_instance.myapp_ec2_instance.id}"
}
~~~

Here, we’ve declared a few pieces of infrastructure that we want Terraform to provision in AWS. After the ‘resource’ keyword, we specify the type and a local identifier as strings before providing necessary information in the code block. 

First, we declare a simple EC2 instance (‘aws_instance’) and give it the local identifier of `"myapp_ec2_instance"` so that we can reference it elsewhere and Terraform can keep track of it in the `.tfstate` file. Then we pass in some settings to configure how it is provisioned (the instance size etc.), simple :). Next up, we want an Elastic Block Storage volume, so we go ahead and declare that too in the same manner.

Finally, we want to actually attach this block volume to the EC2 instance. This attachment is itself considered a ‘resource’, so we can declare it as the others, passing in the relevant IDs for the instance and the volume. This is where implicit dependencies come into the scene: we can reference the other two Terraform resources, which means Terraform to wait until these resources exist and then use their ‘id’ attributes. This gives us reliable provisioning order :)

We can also give provide explicit dependencies to resources where necessary, instructing Terraform to wait until the dependent resources exist by specifying a ‘depends_on’ field.

Also,we gave everything we could a tag. This is for us to quickly find the resource should we need to in the AWS console, maybe to track costs or manually delete it if something does go wrong.

### Data Sources

The other key construct in Terraform is the ‘data source’. This enables us to reference resources that should already exist in AWS, allowing us to extract information from them to feed into new resources etc. For example:




~~~ruby
data "aws_route53_zone" "myapp_private_hosted_zone" {
 vpc_id       = "${var.myapp_vpc.id}"
 name         = "${var.private_hosted_zone_name}"
 private_zone = true
}

resource "aws_eip" "myapp_eip" {
 instance = "${aws_instance.myapp_ec2_instance.id}"
 vpc      = true
}

resource "aws_route53_record" "myapp_hosted_zone_entry" {
 zone_id = "${data.aws_route53_zone.myapp_private_hosted_zone.id}"
 name    = "subdomain.myapp"
 type    = "A"
 ttl     = "300"
 records = ["${aws_eip.myapp_eip.public_ip}"]
}
~~~

Here, we want to create a new route53 DNS record in our hosted zone (e.g. subdomain.myapp.com) so that it points to an elastic ip address we created. In this case, we create the elastic ip and the route53 record, but our hosted zone already exists. Therefore, in order to reference our hosted zone, we use a data source. 

We declare them much the same as with resources, only the information we supply in the block is used by Terraform to discover such resources, not create them. Then, we can reference the data sources in the same way, extracting information to pass into new resources.

Once you’ve declared all your resources and data sources, defined your necessary variables and provided your credentials, you’re all set to let Terraform do its magic! To check if everything will work and there’s no errors, run `terraform plan` from within the directory. If all is well and you’re happy with what it plans to build, kick off the process with `terraform apply`, one final approval, then wait for your infrastructure to be deployed :)

If you make changes to your code, running the `plan` and `apply` commands again will let Terraform use its knowledge of the deployed resources (.tfstate) to calculate what changes need to be made, whether building or destroying. Finally, when you want to bring down your infrastructure, simply issue a `terraform` destroy command and down it comes.

That’s all for an introduction, thanks for reading! Later posts may cover best practices for running Terraform in a team, as well as how to remotely run Terraform in automation.
