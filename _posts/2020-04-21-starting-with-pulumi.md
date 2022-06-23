---
title: Getting Started With Pulumi
date: 2020-04-21 00:00:00 Z
categories:
- awelsh
- Cloud
tags:
- Pulumi
- Cloud
- AWS
- Serverless
- Terraform
author: awelsh
layout: default_post
summary: Pulumi is one of a number of newer IaC solutions, providing developers with
  real code for defining their infrastructure resources and services. This post assumes
  some prior knowledge of IaC concepts and technologies, particular Terraform and
  Serverless, along with CircleCI
---

As [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) (IaC) has become more and more popular over recent times, there has always been that one aspect which has stood out to most developers - it hasn’t ever felt like real code. Offerings such as [Terraform](https://www.terraform.io/), for which you use HashiCorp's own Configuration Language (HCL), always come with another learning curve and result in a solution that feels disconnected from the product we are buliding.

Fortunately, there are newer frameworks that help solve this problem. One of these is [Pulumi](https://www.pulumi.com/). Out of the box, Pulumi has support for JavaScript, TypeScript, Python, Go and C# (Go and C# support is currently still in the preview stage).

In this post, I will explore getting started with Pulumi by using it (retrospectively) on a real project we developed here at Scott Logic - a React based internal communication web app, using AWS Congnito for authentication (and Azure Identity Provisioning), Lambda functions and DynamoDB. As part of this, I’ll compare the code I write to the equivalent Terraform solution that was originally implemented for the project and discuss why I think I’ll look to use Pulumi more often on future projects.

The code referred to throughout this post can be found [on GitHub](https://github.com/awelsh/pulumi-blog-post).

## Getting Started

Pulumi has its own [getting started](https://www.pulumi.com/docs/get-started/) guide on the website so I won’t be repeating those steps here. My example project will be deployed to AWS, implemented in Typescript and using CircleCI for automated CI/CD. The original project has the following architecture:

![An image of AWS resources for a standard hosted website with Lambda functions]({{site.baseurl}}/awelsh/assets/starting-with-pulumi/aws.png "AWS Architecture")

The green highlighted elements were created manually for the original project. As a result, there is no Terraform for them that I can use for comparison purposes and as such, haven’t been considered for this post. For the resources highlighted in blue and red, these were provisioned using either Terraform or [Serverless](https://serverless.com/). I’ll be provisioning these via Pulumi as part of this blog post.

With an idea of what resources I need, thoughts then turn to how best to structure my Pulumi project(s).

**_Side Note - Stacks, Names and State Management_**

Just before I get deeper into the topic of projects, I first need to discuss how Pulumi handles management of our resource state. Each Pulumi project that we implement is a represenation of resources that we require. Each execution of this project is known to Pulumi as a stack. The idea is that we can execute multiple versions of our project for different purposes. For example, we may want environment based stacks, or feature development based stacks. This gives us great flexibility in how we use Pulumi in our overall development process.

By default, Pulumi will use its own servers and online portal for your stacks. Whilst the UI for this is quite simple and intuitive, it isn’t ideal that we would be depending on another third party for this element of our application. Fortunately, we can configure Pulumi to use a remote backend, such as an AWS S3 bucket.

However, I discovered that this comes at a cost. When we use the Pulumi backend, it does some magic with our project and stacks in order to provide uniqueness for the stack names. For example, we can create a Pulumi project in one directory and initialise a “dev” stack for it. We can then create another project in a separate directory and initialise a “dev” stack for that. The Pulumi console will show the two projects, each with their own “dev” stack. In effect, the stacks have fully qualified names like "project1/dev” and “project2/dev”. The two stacks will also be able to reference each other if necessary as they share the same backend.

If we try this with an S3 bucket for our backend, we will get prevented from creating that second stack. This is because each stack file is put in the same location in our bucket and the project name doesn't play a part in it. Therefore, we'll have to manually create unique stack names ourselves. In my case, I chose to incorporate the project name, using a period as delimiter, e.g. infrastructure.dev.

An alternative approach would be to use separate backend locations for each project. However, this will prevent us from sharing resources between those projects via the stack outputs (as you will read later).

## Project Structure

Eager to get into the code, I found myself starting with a single program to define my stack. I quickly realised this wouldn't be practical and didn't really reflect how I would build somehting using Typescript. In addition to that, I know that some of the resources won’t get updated as regularly as others. For example, the DynamoDB table structure probably won’t change that frequently. Whilst the lambda function code will evolve over time. It seems redundant to include the provisioning of the database in with the same code that manages our API gateway and lambdas.

Once broken down, I decided I would implement the following 3 Pulumi programs.

![An image of 3 stacks containing AWS resources that each will provision]({{site.baseurl}}/awelsh/assets/starting-with-pulumi/stacks.png "Pulumi stacks")

This is a simplified version of a fuller application. I haven’t included a number of supplementary elements here such as the IAM roles/policies.

### Infrastructure Stack Code

Let's get started on the detail of the first program - the core infrastructure. In my simplified case, all I need to define is a DynamoDB table:

~~~ typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
 
const env = pulumi.getStack().split('.')[1];
 
export const table = new aws.dynamodb.Table(
  `blog-post-table-${env}`,
  {
    tags: {
      application: "pulumi-blog-post",
      environment: env
  },
    attributes: [
      { name: "RecordID", type: "S" },
      { name: "Status", type: "S" },
      { name: "Count", type: "N" }
    ],
    globalSecondaryIndexes: [
      {
        name: "StatusIndex",
        hashKey: "Status",
        rangeKey: "Count",
        projectionType: "INCLUDE",
        nonKeyAttributes: ["Description", "CreatedOn"]
      }
    ],
    billingMode: "PAY_PER_REQUEST",
    hashKey: "RecordID",
    streamEnabled: true,
    streamViewType: "NEW_AND_OLD_IMAGES",
    ttl: {
      attributeName: "TimeToExist",
      enabled: false
    }
  }
);
~~~

Upon executing this code, using the `pulumi up` command within my project directory, Pulumi will provision a DynamoDB table, named "blog-post-table-dev" (assuming my stack name is "<something>.dev"). Note that it would only provision the table the first time we execute our program. On subsequent executions Pulumi would compare the staet declared in the program to our stored state and only apply any chnages it finds.

**_Side Note - `getStack()`_**

In an ideal world, the stack name would represent just the environment being deployed into. However, as previously mentioned, because of the backend being stored in AWS, we need to give each stack a unique name. In the case of my application, I chose a convention of “program.stack”, e.g. infrastructure.dev, infrastructure.test gateway.dev as so on. Using the inbuilt getStack() method from the Pulumi library provides access to this name. This is useful later for the cross-stack referencing that is required, but it is equally useful here so that the environment can be applied to the resource names and tags, albeit with a little bit of string manipulation.

**_Side Note Physical Names versus Logical Names_**

The default behaviour for Pulumi, when provisioning a resource, is to append a 7 digit hex value to the end of the name specified in the code. This provides a unique physical name for each resource. It does this to improve the efficiency of updates - it can provision the new version of the resource, leaving the current version in place until the new version is ready. Without this unique naming convention, Pulumi would need to destroy the existing resource before creating the new version, potentially leading to unexpected downtime of the resource. This behaviour can be overridden by specifying the “name” field (check the documentation for particular resources as it may be a different field, e.g for S3 buckets, the field is “bucket”). If doing this, the “deleteBeforeReplace” field also needs to be set in the resource properties.

### Gateway Stack Code

After this, all that is required is to specify what the stack should provide as outputs. This is done in the index.ts file:

~~~ typescript
import { table } from "./table";
export const tableName = table.name;
~~~

Now that table name value will be available to my gateway stack:

~~~ typescript
const env = pulumi.getStack().split('.')[1];
const infraConfig = new pulumi.StackReference(`infrastructure.${env}`);
const tableName = infraConfig.getOutput("tableName");
~~~

The (partial) API gateway definition looks like this:

~~~ typescript
...
async function getRecord(event: awsx.apigateway.Request): Promise<awsx.apigateway.Response> {
  const dbClient = new DynamoDB.DocumentClient();
  const dbTableName = tableName.get();
  return getRecordHandler(dbClient, dbTableName, event); // The actual lambda code
}
...
const apiGateway = new awsx.apigateway.API(
  "pulumi-blog-post-api",
  {
    stageName: env,
    routes: [
      {
        path: "points/get",
        method: "GET",
        eventHandler: getRecord
      },
      {
        path: "raise",
        method: "POST",
        eventHandler: postRecord
      }
    ]
  }
);
 
export const apiUrl = apiGateway.url;
~~~

Notice that I have another output from this stack - the URL of my gateway. This is needed by the front-end application to determine the endpoints of the lambda functions.

## Integration With CircleCI

Using Pulumi in CircleCI is simply a case of pulling in the relevant Orbs. If you aren't familiar with CircleCI Orbs, these are reusable packages of YAML based configuration that can help speed up project setup and allow eay integration with third party tools - take a look [here](https://circleci.com/orbs/) for more information.

These give some simple commands that can be applied in the CircleCI config in order to manage the resources as part of the build and deployment process.

Firstly, we can use the login command to specify where the remote state is managed:

~~~ yaml
- pulumi/login:
          cloud-url: "s3://pulumi-blog-remote"
~~~

After that, the update command will carry out the actual deployment of the stack:

~~~ yaml
- pulumi/update:
          stack: infrastructure.dev
          working_directory: ~/backend-api/infrastructure
~~~

Note that each of these are entries in a single CircleCI step. 

In the case of my backend API repository, I have two separate stacks needing deployed. All that meant was the addition of another Pulumi update command in my step (alternatively, I could have separate steps for each of my stacks:

~~~ yaml
- pulumi/update:
          stack: gateway.dev
          working_directory: ~/backend-api/gateway
~~~

It really is that simple to get the stacks up and running.

When moving to the front-end application, things become a little more complicated. As I have a react app that needs to be built as part of the CircleCI definition, I need to pass the API url that was an output from the gateway stack as part of the build process.

~~~ yaml
- pulumi/login:
    cloud-url: "s3://pulumi-blog-remote"
- run:
    command: echo 'export APIURL=$(pulumi stack -s gateway.dev output apiUrl)' >> $BASH_ENV
- run:
    name: "npm build"
    command: |
      cd ~/frontend-app/app
      npm install
      REACT_APP_STAGE=$CIRCLE_BRANCH REACT_APP_LAMBDA_ENDPOINT=${APIURL} npx react-scripts build
~~~

Notice the stage in this step where I issue a command to get the gateway stack output value and push it into the bash environment variables. Through all my searching, I couldn’t find another solution to this problem - where the value I need to pass to my build is the output from a command line statement. It appears to be unsupported by CircleCI at this time.

There are additional steps in the front end CircleCI config for provisioning the S3 bucket and deploying the application into the bucket, but the former is a repeat of what I did on the backend and the latter has no interaction with the Pulumi environment.

## Comparison To Terraform

One of the purposes of writing this post was going to compare the Pulumi code I wrote to the equivalent Terraform that was implemented as part of the original project.

First, the file structure. The below is a representation of the files and folders that we put in place for our Terraform code:

~~~
infrastructure
└─ dev
│  └─ database
|  |  └─ main.tf
│  └─ services
│  │  └─ lambda-bucket
|  |  |  └─ main.tf   
│  │  └─ frontend-app
│  │  |  └─ main.tf
└─ prod
│  └─ database
|  |  └─ main.tf
│  └─ services
│  │  └─ lambda-bucket
|  |  |  └─ main.tf   
│  │  └─ frontend-app
│  │  |  └─ main.tf
└─modules
│  └─ database
|  |  └─ main.tf
|  |  └─ variables.tf
│  └─ services
│  │  └─ lambda-bucket
|  |  |  └─ main.tf
|  |  |  └─ variables.tf 
│  │  └─ frontend-app
│  │  |  └─ main.tf
|  |  |  └─ variables.tf
~~~

The modules folder contains the common definitions for resource and services that we would be deploying “per environment”. The dev folder then contains environment specific versions of these where variable names are set along with any other environment specific inputs that the modules require. Not shown above is the repetition of the dev folder structure for the production environment (and again if we used a test or QA environment).

Just from this, we can see the number of files that are required to represent our AWS infrastructure using Terraform. Compare this to what I did above using Pulumi, where I had a single set of code files per resource and a single configuration file for each environment. This provided all the customisation I needed without the complexity of repeated folder structures, with its potential for copy and paste errors when I need a new environment.

The complete Terraform code for defining the database looks like this:

__modules/database/main.tf__

~~~
resource "aws_dynamodb_table" "application-database" {
  name             = "${var.database_name}"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "RecordID"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  tags = { ...  }

  attribute {
    name = "RecordID"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }

  attribute {
    name = "Status"
    type = "S"
  }

  attribute {
    name = "Description"
    type = "S"
  }


  attribute {
    name = "Archived"
    type = "S"
  }

  global_secondary_index { ...  }
}
~~~

__dev/database/main.tf__

~~~
provider "aws" {
  region = "eu-west-2"
}

terraform {
  backend "s3" {
    bucket         = "terraform-remote-backend"
    key            = "dev/data-storage/terraform.tfstate"
    region         = "eu-west-2" 
    dynamodb_table = "terraform-remote-backend-locks"
    encrypt        = true
  }
}

module "create-dynamo-database" {
  source = "../../modules/database"
  database_name = "my-table-name-dev"
}
~~~

I certainly feel that the Pulumi equivalent is more readable and maintainable. On top of that, you may notice the dev file includes details of where to find the state backend. This needs to be repeated in every resource file that we have which really does add to the code bloat of this solution. The Pulumi solution to this, where I can specify my remote state as part of the CircleCI config feels much tidier.

Also, notice how each attribute of the DynamoDB table is defined as a separate field within the database definition. Again, it is these small things that just made the Pulumi solution a preferable approach to my IaC needs.

## Conclusion ##

Ultimately, whatever option you go with for your IaC needs, you'll be defining your resources as JSON objects (or something similar) and there isn't too much difference between the available platforms. With Pulumi, we also get access to all the constructs of a real programming language. That means we can easily incorporate conditional resource creation (you might want extra logging resources in a test environment) or create multiples of the same resource using some sort of array mapping.

I’ve barely touched the surface of Pulumi in this post but already I have experienced how much easier defining my infrastructure can be when I use a language that I am familiar with. Not only am I able to produce more readable and maintainable code, but I also have a high level of confidence in how I should structure the code to make it as flexible and reusable as possible.

With regards to the lambda functions and the API gateway, I particularly like the integration between the code and the gateway provisioning. This is similar to what we implemented on the original project, where we used Serverless to define the gateway and its various route handlers. However, just like in the comparison to Terraform, with my Pulumi solution, it feels more like part of my application directly and I have no learning curve for new syntax or technology.

Pulumi isn’t as mature as the other IaC offerings just yet, and as such, doesn’t have quite the level of online content to support it. Much of my learnings came from the Pulumi documentation and blogs directly with little else written about it. This may prove a stumbling block for some more complex problems, but I hope over time, as the adoption level rises, so will the online support.

I definitely think I will be trying to use more of Pulumi in the future. There were several areas during this little example project that I found myself wanting to understand more or even find better ways of solving the problems I encountered so I’ll hopefully find some time to do that as well.
