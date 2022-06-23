---
title: From Monolith to Serverless on AWS
date: 2019-07-29 00:00:00 Z
categories:
- jhenderson
- Cloud
author: jhenderson
summary: Transitioning from building monolithic applications to serverless applications
  is not always easy. This article explores the challenges that one developer from
  a monolithic background faced while building a serverless application on Amazon
  Web Services.
layout: default_post
---

Since the 2006 release of Amazon Web Services (AWS) and its Simple Storage Service (S3), "The Cloud" has dramatically risen in popularity and continues to do so with no signs of stopping any time soon. It has also helped to shape the future of software development, giving rise to alternative models and concepts.

One such model is "serverless", which is based on the premise that applications run on-demand and are only charged for the units of computation consumed, as opposed to pre-purchasing capacity. Contrary to what the name suggests, "serverless" doesn't actually mean that apps run without a server - they just don't need to care about them. The cloud provider handles incoming requests, calls the serverless function and handles outgoing responses.

The rise of cloud computing has caused developers to re-think software design, ultimately leading to further modularisation by breaking up applications into smaller, single-purpose services that function independently and cooperate with each other to form a single application. This is in contrast to the more traditional model of monolithic development, where a single, heavy-duty application would be developed to be capable of handling everything required for it to fulfill its purpose.

I come from a background of writing monolithic applications and it's fair to say that I found the idea of changing my approach to software development fairly daunting, so I thought that this post would be a nice way to share my experience with others in similar situations.


## The project

I had the pleasure of picking up Scott Logic's [StockFlux](https://stockflux.scottlogic.com) project with the same fantastic team as my previous project, which consisted of 3, very talented frontend developers and myself as the lone backend developer.

The frontend team had the task of transforming the existing StockFlux application to use the bleeding edge of the [OpenFin](https://openfin.co) platform, which incorporated features defined by the [FDC3 specification](https://fdc3.finos.org/) by [FINOS](https://www.finos.org/).

This involved splitting StockFlux into several applications, to showcase OpenFin's inter-app functionality such as snapping and docking, as well as using the OpenFin FDC3 implementations of intents, context data and channels for inter-app communication. It also involved using the FDC3 [App Directory](https://fdc3.finos.org/docs/1.0/appd-intro) specification to promote discovery of our apps using a remotely hosted service, which is where I come in.

I was responsible for implementing all of the backend components, as well as building and managing all of our infrastructure. This involved:

* Building an FDC3 compliant App Directory to host our apps and provide application discovery.
* Building a Securities API, with a full-text search, using a 3rd party data provider.
* Providing Open-High-Low-Close (OHLC) data for a given security, to power the StockFlux Chart application.
* Creating a Stock News API.
* Building and managing our infrastructure on AWS.
* Automating our AWS infrastructure using CloudFormation.
* Creating a CI/CD pipeline to test, build and deploy changes.

This was to be implemented on serverless architecture using AWS Lambda. JavaScript (Node.js 10) became our language of choice, primarily due to the fact that the whole team is proficient in it and the wealth of tooling available to us in its ecosystem.

We also made significant use of S3, API Gateway, CloudFront, DynamoDB and CloudFormation, provided by AWS.


## Getting started

I began by researching AWS, in particular the Lambda and DynamoDB services. When I started to write code, I struggled with my understanding of how I could locally develop Lambda functions.

Most tutorials I found explained how to work with Lambda using the editor in the AWS Management Console. I was apprehensive about giving up my editor, tooling, and local development environment in favour of moving to a web-based editor, dealing with session timeouts and point-click interfaces.

A colleague suggested writing the Lambda functions as Express apps, using a package called [`aws-serverless-express`](https://github.com/awslabs/aws-serverless-express) to bridge the gap between Lambda and the request/response objects that Express exposes. This worked beautifully and the setup was super simple.

To start with I created an Express app, and exported it *without* calling the `listen` method:

~~~javascript
const express = require("express");
const app = express();
app.get("/", (req, res) => res.json({ message: "Hello, World!" }));
module.exports = app;
~~~

I then used `aws-serverless-express` to create an entry point for the Lambda, importing the Express app and wrapping it in a call to `awsServerlessExpress.createServer`:

~~~javascript
const awsServerlessExpress = require("aws-serverless-express");
const app = require("./src/app");
const server = awsServerlessExpress.createServer(app, null, [
  "application/octet-stream",
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpeg",
  "image/png",
  "image/svg+xml"
]);

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
~~~

Finally, I created an entry point for local development:

~~~javascript
const app = require("./app.js");
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
~~~

I used [`nodemon`](https://github.com/remy/nodemon) to run the local entry point which would boot up Express and restart it when changes were detected.

### The App Directory

The frontend team quickly found themselves in need of a working, FDC3 compliant App Directory to host our apps. The launcher in particular, needed to be able to discover other apps that were part of the StockFlux suite and others that were available to handle our intents.

I initially implemented the basic discovery endpoints using local filesystem storage, until I was satisfied it was working and the frontend team were able to use it. I then started to look at implementing persistence using DynamoDB.

Similar to developing Lambda functions locally, I wanted to run a DynamoDB instance on my machine. Luckily, AWS offers a [downloadable version](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) of it for local development. Once downloaded, it was just a case of starting up the local instance and using the [AWS CLI](https://aws.amazon.com/cli/) to manage it as well as using the [AWS SDK for Node.js](https://aws.amazon.com/sdk-for-node-js/) to integrate DynamoDB.


## Manually building the AWS infrastructure

With the help of my colleagues, I created an API Gateway to expose each Lambda function to the outside world. Mostly, this process was pretty smooth, until we spent hours at the end of one day trying to make a simple change, only to discover early the next morning that we'd forgotten to re-deploy our API so our changes hadn't been picked up!

I also create an S3 bucket to host our frontend artifacts, a DynamoDB table to store our App Directory and a CloudFront distribution that was used to tie the API Gateway and S3 bucket together under a single domain. I additionally set up some caching rules in CloudFront, to provide better performance at each edge location and to minimise requests to our external services which were subject to monthly quotas.

As I continued to configure API Gateway and other resources, I couldn't help but think that all of this manual setup, using web-based GUIs was error prone, inefficient and surely unfitting of today's modern, automated world. I began to look back at my monolithic past with rose-tinted glasses, thinking how this could all be managed and customised with code.


## CI/CD pipelines

Over time, updates to Lambda functions and frontend assets became more frequent. It became necessary to invest some time into automating the process by building a CI/CD pipeline. Having never done anything significant with CI tools before, one of the frontend guys who had a bit more experience in doing so, lent me a hand in getting started with [CircleCI](https://circleci.com/).

We created an initial workflow consisting of 3 jobs, `test`, `build` and `deploy`. The first one, `test`, was configured to install dependencies and run the test suites on every push, for each Lambda function. This effectively blocked our Pull Requests on GitHub if tests failed which added a layer of confidence.

The `build` and `deploy` jobs were configured to only run on the protected `dev` and `master` branches, ensuring that we would only ever deploy code updates once they were reviewed, approved and merged. The `build` job was responsible for producing a clean, production ready build of each Lambda, by running `npm install` with the `--production` flag to omit dev dependencies.

The `deploy` job was a little more complex. Its responsibility was to package up the Lambda functions as `.zip` files, upload each of them to our private S3 bucket and finally trigger a Lambda code update using the AWS CLI.

~~~bash
$ pip install awscli --upgrade --user
$ mkdir -p <path/to/deployment/directory>
$ zip -r9 <path/to/deployment/directory>/lambda.zip <path/to/lambda/code>
$ aws s3 sync \
    <path/to/deployment/directory> \
    s3://<private-bucket-name>/<s3/path/to/artifacts> \
    --delete \
    --region <region>
$ aws lambda update-function-code \
    --function-name <lambda-function-name> \
    --s3-bucket <private-bucket-name> \
    --s3-key <s3/path/to/artifacts>/lambda.zip \
    --region <region>
~~~

The frontend pipeline was simpler to implement. Once built, the AWS CLI was used to upload the artifacts into the public S3 bucket.

The process of building the pipelines involved a lot of trial and error, particularly when it came to the `deploy` jobs. Every change required a commit, push and then a delay until CircleCI kicked off the jobs. At Scott Logic, we use CircleCI for a number of projects, so we often had to compete for capacity which slowed things down a little.

Once implemented, the CI/CD pipelines were a blessing. A simple merge to `master`/`dev` and everything would be automatically deployed without having to go through the manual process of zipping up, navigating to the Lambda in the UI and manually uploading to trigger a code update. Likewise, the frontend team were able to avoid having to manually upload their artifacts to S3.


## Automating infrastructure with CloudFormation

CloudFormation is a service provided by AWS for using code to model and provision all of the resources required to build and maintain cloud infrastructure. It provides a common language to describe and configure all of the resources in JSON or YAML format. Much more than just configuration, CloudFormation templates also support declaring and passing parameters as well as using references and intrinsic functions to dynamically and conditionally build configuration.

When I began to investigate and build our CloudFormation template, I started to feel more comfortable creating and maintaining several separate services that functioned as a single application. Where in a monolithic application, I might have a full API under one roof, and use a router component to direct traffic to different controllers, CloudFormation would allow me to define API Gateway routes to direct traffic at entirely distinct services. What's more, CloudFormation would allow me to define and provision my entire infrastructure, as opposed to building and maintaining it by hand which I found to be more common with a traditional, monolithic application. Realising and understanding the potential of this approach was a game changer for me.

Building our CloudFormation template was arguably the most time consuming part of the entire project. It was largely a case of trial and error, involving an iterative process of:

* Editing the YAML template.
* Copying and pasting it into the CloudFormation designer in the AWS Console to validate.
* Triggering a stack build from it.
* Waiting until the build completes successfully or fails with errors.

I did try to spend some time getting used to the CloudFormation Designer tool in the AWS Console but I found it difficult to learn and had problems with being regularly logged out of the AWS Management Console due to session timeout. As a developer, I found that switching to iteratively building a YAML file suited me much better. I regret not spending some time getting to know the CloudFormation commands in the AWS CLI earlier, which would have saved me some time in the long run.

### Using the AWS CLI to extract configuration

One technique, which I found to be invaluable, was to regularly use the AWS CLI to extract configuration from our existing, manually built resources. I created a user account to programmatically access the AWS API, used its commands to retrieve the JSON configuration of each resource, and translated it to YAML for the CloudFormation template. For example, to grab the configuration for our App Directory DynamoDB table, I used the following commands:

~~~bash
$ aws dynamodb list-tables
$ aws dynamodb describe-table --table <table-name>
~~~

### Custom Resources

Another technique I'd like to share, is the use of [Custom Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html), which provides the ability to run custom provisioning logic when creating, updating or deleting stacks through CloudFormation.

By defining a custom resource, it's possible to make CloudFormation send requests to Lambda functions (and other resources) to execute custom logic and potentially abort the procedure. In my case, I used a custom resource to trigger a Lambda function, which used the AWS SDK to seed our App Directory DynamoDB table with data during stack creation.

~~~yaml
DataIngestLambdaTrigger:
  Type: "Custom::DataIngestLambdaTrigger"
  DependsOn:
    - "DataIngestLambdaFunction"
    - "DynamoDBTable"
  Properties:
    ServiceToken: !GetAtt DataIngestLambdaFunction.Arn
    Region: !Ref AWS::Region
    Table: !Ref DynamoDBTable
~~~

### Challenges

Getting CloudFormation working was probably the most satisfying part of the project for me, however, it wasn't always smooth sailing. I ran into more problems than I can remember and found the process quite frustrating. I also happened upon what I believe to be some undocumented limitations.

#### Documentation

CloudFormation is a huge, growing system and it requires maintenance of *a lot* of documentation. The majority of the docs are well structured and easily navigable, however, I found places where it was out of date or innaccurate. They're also quite verbose and tend to contain mostly trivial examples, so I often found myself searching for tutorials and demos of more complicated scenarios.

#### Chicken and egg problem

I originally wanted to automate the creation of an S3 bucket, upload the Lambda .zip files and then push them to our Lambda functions but I quickly gathered that this was not possible. I looked into how others seemed to approach their automated infrastructures on AWS, I discovered that everything almost always begins with a source S3 bucket. Following this revelation, I created a source bucket which would become the origin of our infrastructure, allowing us to upload anything we need to S3 before running our CloudFormation stack. So, to answer one of life's great questions - what comes first, the bucket or the Lambda? The answer is definitely the bucket.

#### CloudFront headers

I discovered that it was problematic to pass down the original host header received by CloudFront, through API Gateway and eventually to the Lambda functions, one of which depended on it to properly generate URLs relative to the domain on which it was hosted. When creating everything manually, I was able pass through the CloudFront domain name as a custom header. However, automating this through CloudFormation was not possible, since it's not known ahead of time what the CloudFront distribution's domain will be.

Determined that this should be automated, I built a working solution using Lambda@Edge which executed logic at each edge location, passing through a custom header based on the incoming request. However, due to reasons described in the next section, we decided that Lambda@Edge wasn't the right approach. Ultimately, I used a custom resource to trigger a Lambda during stack create/update which would set the custom header value in CloudFront, once the distribution existed and its domain was available. Our production environment, uses a custom domain which would be passed as a parameter to the CloudFormation template so it was trivial to pass it as a custom header.

#### Lambda@Edge

Lambda@Edge is a service that allows Lambda functions to be run at CloudFront edge locations around the world, providing the opportunity to modify incoming requests or outgoing responses, before or after they reach CloudFront. As previously mentioned, I used Lambda@Edge to add a custom header to incoming requests that contained the original host header. I found two quite significant issues when trying to deploy them with CloudFormation which lead me to eventually abandon Lambda@Edge and seek other solutions.

Firstly, Lambda@Edge functions can only be deployed to the North Virginia (`us-east-1`) region, even though, they're replicated to every edge location. This meant that we would've had to deploy our entire CloudFormation stack into `us-east-1`, which was something that we decided against. Additionally, I discovered that tearing down stacks containing Lambda@Edge functions would regularly fail since some function replicas persisted, which appears to be a current limitation of CloudFormation.


## Updating our CI/CD pipeline

I updated our CI/CD pipelines to use CloudFormation once I was happy with our template. I removed the manual calls to update the Lambdas and replaced them with a call to the AWS CLI to trigger a `deploy` of our CloudFormation template, dynamically passing through our arguments. The name of the branch (`master`/`dev`), dictated our deployment stage, the name of the stack and resource tags.

~~~bash
aws cloudformation deploy \
    --stack-name stockflux-$(echo $CIRCLE_BRANCH) \
    --template-file cloudformation.yml \
    --parameter-overrides \
        PrivateBucket=<private-bucket-name> \
        Stage=$(echo $CIRCLE_BRANCH) \
        Version=<version>.$(echo $CIRCLE_BUILD_NUM) \
    --capabilities CAPABILITY_NAMED_IAM \
    --tags Stage=$(echo $CIRCLE_BRANCH)
~~~

The following merges into our `dev` and `master` branches, kicked off our initial builds for each environment, in which CloudFormation created our entire stacks. Every subsequent merge to either of these branches resulted in another deploy, updating our existing resources, if changes were detected. Our Lambdas are always updated regardless since we pass a new version number into the command each time.


## Review

I asked a colleague at Scott Logic, who was a certified AWS Solutions Architect, to take a look at our setup. Overall, his review was positive. He agreed that I had approached the infrastructure sensibly and other than some minor tweaks and tightening up security in a couple of places, he was happy with the setup.

This gave me a lot of reassurance, especially since I started this project with very little experience of AWS and was able to achieve quite a lot.


## Final Thoughts

It's fair to say that I felt apprehensive about AWS and serverless when beginning this project, but I was intrigued to see what all the fuss was about. At times, I felt under a lot of pressure, having to learn quite a lot in a short space of time, and having a whole team depend on me to provide infrastructure and CI/CD, as well as the backend services they needed to progress.

One thing I'm still relatively unsure about is the idea of *vendor lock-in*. By basing an application around their specific services, we effectively lock ourselves into AWS, which makes our applications less portable. While building the StockFlux backend services I made an effort to abstract things in such a way that would allow us to add support for services offered by other providers, to reduce our dependency on AWS. On the other hand, locking into one vendor doesn't have to be a bad thing - by committing to use AWS (or another provider), we can explore and utilise the vast array of services that are on offer, rather than restrict ourselves to using as little as possible to promote portability.

There are tools available which can help to alleviate (but not avoid) the idea of vendor lock-in, however. One such tool is [Terraform](https://www.terraform.io/), which provides Infrastructure as Code, just like CloudFormation. It supports managing many popular service providers (including AWS, Azure and GCP) as well as custom, in-house solutions with a single, expressive configuration language. Since Terraform is not tied directly to a single vendor, it can be used to provision and manage the services of other providers and it makes the idea of simultaneously utilising multiple vendors a reality.

Overall, the project has been successful and I'm pleased to have received some great feedback from colleagues. I've had the opportunity to deep-dive into AWS and get a grasp of a good chunk of its most commonly used services. The concept of serverless, which was mostly foreign to me at the start, is now crystal clear and I can see the benefits that it brings. I've also had the opportunity to jump into the DevOps world, by providing and managing infrastructure as well as building CI/CD pipelines to support the operational side of the project. Now everything is up and running, the StockFlux project is quite smooth to work with.

I now feel much more confident with AWS and the idea of managing infrastructure with code. Going forward, I'd like to explore AWS further, and possibly even pursue a certification.
