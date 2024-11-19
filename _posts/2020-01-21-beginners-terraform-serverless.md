---
title: A Beginner's Guide to Terraform and Serverless
date: 2020-01-21 00:00:00 Z
categories:
- Tech
tags:
- Cloud
- AWS
- Serverless
- Terraform
- Beginner
- Graduate
author: ashing
layout: default_post
summary: We - Alex and James - are graduate developers and our first project introduced
  us to Infrastructure as Code (IaC) and serverless architecture.  This post is a
  collation of useful resources and thoughts gathered on our journey to help you learn
  about AWS, Terraform and Serverless - it's the guide we wish we had.
image: ashing/assets/terraformxserverless.png
contributors:
- jstrachan
---

We - Alex and James - are graduate developers at Scott Logic. Our first project introduced us to Infrastructure as Code (IaC) and serverless functions. We hosted our project on AWS and used Lambdas (AWS's serverless functions) for the back end. We used Terraform to provision the AWS infrastructure and the Serverless Framework to provision and deploy the Lambdas.

We thought it would be a good idea to document our journey and share the resources we found useful. This post explains how to learn Serverless and Terraform – and why we provision certain services with each. So, we present to you: A Beginner's Guide to Terraform and Serverless!

**_Note_**

While Terraform and the Serverless framework are provider agnostic, the resources provided here are AWS orientated.

This method of implementing these technologies worked well for us but there are lots of different options that might work better for you.

## Infrastructure As Code

IT Infrastructure is a set of services and resources for hosting your code, e.g. servers and databases. IaC is the process of building – or provisioning – and managing these services through declarative definitions. Terraform uses HashiCorp Configuration Language (HCL). It's a language that reads a lot like JSON, so it looks like small descriptions of the infrastructure you want to build. This is beneficial, as you can use the same practices you would use for normal development, meaning :

- You can store your infrastructure configurations in version control.
- It minimizes the risk due to automating what was previously manual work.
- It keeps the infrastructure consistent with what the code declares.
- It's simple and speedy once set up. Input the command and go.

## The First Step

A good way to get familiar with IaC is to first provision your resources manually. This helps you visualise 'infrastructure' and you start to learn what each service or resource does.

The first step is to find a tutorial using a similar tech stack. For us, this was "[Wylde Rides](https://aws.amazon.com/getting-started/projects/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/)" - a tutorial that takes you through building a serverless web app. It introduces creating the infrastructure for their resources using the AWS console. Now we have to do the same but through code.

To provision infrastructure, you need to download the [AWS CLI](https://aws.amazon.com/cli/) and set up your credentials. If you are using a CD/CI pipeline, such as CircleCI, set up a new AWS user for them. Finally, set an environmental variable or secret for the CI software so it has permission to build and change infrastructure.

![terraform title]({{site.baseurl}}/ashing/assets/terraform-logo-wide.png)

### What is it?

Terraform is an "Infrastructure as Code" tool. It’s one of the most popular of the IaC tools and has a huge number of providers. It allows you to configure and provision infrastructure. [This Scott Logic blog](https://blog.scottlogic.com/2018/10/08/infrastructure-as-code-getting-started-with-terraform.html) by Chris Meehan goes into more detail.

### How to learn

The [official Terraform tutorial](https://learn.hashicorp.com/terraform/getting-started/intro) introduces Terraform and walks you through the set up as well as the basics.

The [Gruntwork articles](https://blog.gruntwork.io/a-comprehensive-guide-to-terraform-b3d32832baca) will solidify your understanding of modules. They also show how you can structure your Terraform folders. We found that their suggested folder structure was easy to read and kept each Terraform file simple. To provision infrastructure through Terraform, you use the "apply" command. Before the infrastructure gets provisioned, Terraform supplies a "plan". The "plan" provides a blueprint of what Terraform will attempt to create. This bases itself on what it believes to already have provisioned and what is going to change. **Read this plan every time**. It lowers the number of mistakes by a considerable degree.

#### Workflow

Following Gruntwork's advice with the folder structure can create a different kind of workflow. Navigating through multiple modules and environments can take some getting used to. This can lead to situations where you are trying to provision a piece of infrastructure from the wrong directory. __So take care when reading the plans Terraform gives you before provisioning!__ It will tell you what is going to happen so you can cancel it if need be.

#### State management

Terraform stores all the information about your infrastructure in a state file. If you are working in a team, you should aim for remote storage of the state files. State management can often be the source of errors during the set-up of new infrastructure.  Once set up and functional, you will not need to think about it again.

When setting up the remote backend for each piece of infrastructure, you have to specify a key. This key is the file path that Terraform uses when storing the state. As the backend code is very similar for every infrastructure file, it's easy to copy-paste and forget to change the key! If provisioning a piece of infrastructure results in the destruction of another, this may indicate a problem with the state. To fix this, destroy any offending infrastructure. Remove the corresponding state that is wrong. Reinitialise the Terraform folder with the correct state. Once the keys for the state are correct, you can start re-provisioning.

#### Attribute type limitations

The Terraform HCL is currently restricted to the Binary, String and Number types for fields of DynamoDB databases.

### What we provisioned in Terraform

As an example of how you can use Terraform, here is how we structured our folders:

~~~
infrastructure
│
└───dev
│   │   database
│   │   iam-lambda-roles
│   └─── services
│   │   │  lambda-bucket
│   │   │  frontend-app
│   │
└───prod
│   │   database
│   │   iam-lambda-roles
│   └─── services
│   │   │  lambda-bucket
│   │   │  frontend-app
│   │
└───global
│   └───remote-backend
│   │
└───modules
│   │  create-dynamo-database
│   │  create-lambda-bucket
│   │  create-static-website
│   │  iam-lambda-role
~~~

We created modules for each type of service we had. Then we could use them to create a 'dev' and 'prod' environment.

Although it's possible to provision Lambdas and the API Gateway through Terraform, it does not manage the deployment. We managed these services with the Serverless Framework instead.

![serverless title]({{site.baseurl}}/ashing/assets/serverless-logo-wide.png)

### What is it?

The Serverless Framework helps you provision and deploy serverless functions across different cloud providers.

It allows you to specify the events that trigger the Lambdas. It then builds and connects the API Gateway based on those events. It can then handle deploying the Lambdas to a bucket you specify. This means you can focus on writing Lambdas – set up the configuration in the YAML file and off you go!

Serverless uses CloudFormation (for AWS) to provision the declared configuration. While this works well for the resources Serverless has opinions on (Lambdas and API Gateway), it doesn't work as well for the others. If you provision other resources with Serverless, you have to provide raw CloudFormation templates in the Serverless yaml. We don't like this option as much as Terraform for several reasons :

- Terraform has the "plan" ability showing you what is going to change.
- We are more familiar with Terraform.
- We wanted one source of truth for as much of our infrastructure as possible.

This is why we create the Lambda bucket and IAM policies for the Lambdas in Terraform. This integration of the two worked well for us.

### How to learn

The [Serverless AWS intro guide](https://serverless.com/framework/docs/providers/aws/guide/intro/) is a good place to start, and their documentation is comprehensive. They also provide links to a wide variety of [example repositories](https://serverless.com/examples/
) on Github. [Serverless stack](https://serverless-stack.com/) is also a well written resource with full-stack examples.

### Workflow with Serverless

Serverless defines a "service" that is a collection of functions usually within one file.

You can deploy a service or a singular function. The service deployment uses CloudFormation to provision infrastructure changes. You would use this if you edited the configuration in the serverless.yml.

Deploying a single function is much faster as it doesn’t need to deploy a CloudFormation stack. It's useful when you are writing a function and only have implementation changes to make. Serverless writes about its deploying options [here](https://serverless.com/framework/docs/providers/aws/cli-reference/deploy/).

A minor issue is that deploying a single function [requires it to exist on the currently deployed CloudFormation stack](https://serverless.com/framework/docs/providers/aws/guide/deploying#deploy-function). This can cause teammates to overwrite each other's deployments. That can result in unexpected behaviour if they don’t realise it has been overwritten. The problem will not be as noticeable in smaller, local teams as communication is easier. There will also be fewer people working on the Lambdas at the same time. Still, it's worth being mindful of this issue regardless of team size.

This problem isn't unique to Serverless and serverless functions but there are ways to mitigate the issue:

- Adjusting workflows so that the configuration of the serverless.yml is the same across the team. This means everyone can do single function deployments.
- Separating the Lambdas into different services and keeping each service cohesive can solve problems with big teams.
- [Use a Monorepo](https://serverless-stack.com/chapters/organizing-serverless-projects.html). It allows you to manage each Lambda on its own. Invest in a CI service that compliments this.
- Test as much as you can locally. You can do this using the [invoke](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) command.

## Final Notes

Here are some things that we encountered that we thought were worth mentioning.

### CORS

When passing custom headers to the lambda functions you need to list them in the serverless.yml otherwise CORS issues appear. These custom headers also include the Authorization header if you are using a custom Lambda authorizer. Here's an example:

~~~ yaml
getPoints:
  handler: handler.getPoints
  events:
    - http:
        method: get
        path: points/get
        authorizer: authentication
        cors:
          origin: "*"
          headers:
            - Authorization
~~~

Most CORS issues you will come across are likely detailed and resolved in  [this guide](https://serverless.com/blog/cors-api-gateway-survival-guide/) by Serverless. If you're using Typescript, creating an "Http Response" type can also remedy some of these issues by ensuring the correct headers are present.

### Staging variables
If you are deploying to a specific stage using the ```--stage``` option, you can create a custom variable in your yaml file. The code snippet below creates a custom variable called stage that references the stage provided.

~~~ yaml
custom:
  stage: ${opt:stage, self:provider.stage}
~~~

There is [more info here](https://serverless-stack.com/chapters/stages-in-serverless-framework.html).

### CDNs and SPAs
If you are putting a CloudFront distribution in front of your S3 bucket that is hosting a SPA, you'll have problems with routing. You need to change the 404 error code to 200 and point the error page to index.html. This means the SPA will deal with the rerouting when trying to resolve a URL.

## Conclusion

We hope this helped you learn more about Terraform and Serverless! This guide is based on how we decided to use these technologies, as their functionality can overlap. The factors that influence where you choose to draw the line on what to provision with each will more than likely differ. But hopefully, we have shown that it’s not exclusively using one or the other, and we encourage using them together.
