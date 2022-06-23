---
published: true
author: dsmith
layout: default_post
title: Cutting development costs in AWS with Cloud Custodian
categories:
  - Cloud
summary: >-
  Cloud Custodian is an open source project from Capital One. It allows you to
  enforce your cloud compliance rules in an automated way. One key use case of
  Custodian is to reduce costs by shutting down unused resources. In this post,
  I'll walk through setting up a Custodian and writing a policy. This will shut
  down EC2 instances outside working hours to save money.
tags: 'cloud, AWS, compliance, Cloud Custodian'
---
## Introduction

A common need in AWS development environments is to stop EC2 instances when they aren’t in use. This is because AWS charges either by the [second or hour](https://aws.amazon.com/blogs/aws/new-per-second-billing-for-ec2-instances-and-ebs-volumes/) for these resources. Switching them off can yield large savings for your organisation.

Writing your own scripts using the AWS SDK is one option but you will need to invest time in writing these. You’ll also need to maintain and update them when AWS changes their APIs. An alternative approach is to use an existing project which supports this functionality.

[Cloud Custodian](https://github.com/capitalone/cloud-custodian) is an open source project from [Capital One](https://developer.capitalone.com). It allows you to enforce your cloud compliance rules in an automated way. Custom policies specify the desired state of the resources in your account. Custodian checks the current state of the environment and makes changes where needed.

## Setting up Cloud Custodian

You can run Custodian anywhere including on your machine, an EC2 instance or in a Lambda function. For Lambda functions Custodian handles the deployment for you. It will also create any required CloudWatch Rules.

The recommended practice is to store your policies in source control. A CI server can then run them whenever you commit a change. This will trigger a redeploy of the functions and rules where necessary.

### Prerequisites for installation

You’ll need some valid IAM credentials to deploy your functions into AWS. One way is to create an [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) and run `aws configure` to store these on your local machine. You can also setup Custodian on EC2 instance and [assign a role](https://aws.amazon.com/premiumsupport/knowledge-center/assign-iam-role-ec2-instance/) to it which will provide temporary credentials.

Your role or user will need IAM permissions to allow it to create Lambda functions and [CloudWatch rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html):

~~~json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CanCreateCloudCustodianFunctions",
            "Effect": "Allow",
            "Action": [
                "lambda:CreateFunction",
                "lambda:TagResource",
                "events:DescribeRule",
                "events:EnableRule",
                "lambda:GetFunction",
                "events:PutRule",
                "lambda:UpdateFunctionConfiguration",
                "lambda:UpdateAlias",
                "lambda:UpdateFunctionCode",
                "events:PutTargets",
                "iam:PassRole",
                "lambda:AddPermission",
                "lambda:ListTags",
                "lambda:GetAlias",
                "events:ListTargetsByRule",
                "lambda:CreateAlias"
            ],
            "Resource": "*"
        }
    ]
}
~~~

### Installing Custodian

For Linux users installation of Custodian is quick and easy. You’ll need python2, pip and virtualenv installed:

~~~bash
$ virtualenv --python=python2 custodian
$ source custodian/Scripts/activate
(custodian) $ pip install c7n
~~~

Windows support is [a work in progress](https://github.com/capitalone/cloud-custodian/issues/803). The recommended workaround is to run inside a Docker container. A sample implementation using Alpine Linux is [available on GitHub](https://github.com/ellerbrock/alpine-cloud-custodian).

To test your setup run `custodian version`. This should output the current version of Custodian to the console.

## Implementing the on/offhours policy

Custodian policies use yaml format and consist of several sections:

- `Name`: A machine-readable name for the policy.
- `Resource`: A short identifier for the AWS resource type to act on (ec2, rds, s3 etc).
- `Filters`: A list of filters that determine which resources the policy will act on.
- `Actions`: A list of actions to perform on the matching resources.

Below is an example of a basic offhours policy for EC2 resources:

~~~yml
policies:
  - name: offhours-policy
    resource: ec2
    filters:
      - type: offhour
        default_tz: bst # set this to your timezone
        offhour: 18 # the hour when instances will be shut down
    actions:
      - stop
~~~

This policy uses the offhour filter. The offhours filter finds all EC2 resources which are running after a specified hour. Custodian then applies the `stop` action to those resources.

An onhours policy is written in a similar way:

~~~yml
policies:
  - name: onhours-policy
    resource: ec2
    filters:
      - type: onhour
        default_tz: bst # set this to your timezone
        onhour: 8 # the hour when instances will be started up
    actions:
      - start
~~~

### Making the policy opt-in

You may not want to enforce your offhours policies, especially at first. Custodian allows your developers to either opt-in or opt-out with a custom tag.

An opt-in policy is one where the policy includes a `tag` attribute and `opt-out` is `false` or not specified. In this case Custodian will _only_ stop instances _if_ they have the tag:

~~~yml
policies:
  - name: onhours-policy
    resource: ec2
    filters:
      - type: onhour
        default_tz: bst # set this to your timezone
        tag: downtime
        onhour: 8 # the hour when instances will be shut down
    actions:
      - start
~~~

When `opt-out` is `true` _all_ instances will be stopped _unless_ the developer opts out by adding the tag:

~~~yml
policies:
  - name: onhours-policy
    resource: ec2
    filters:
      - type: onhour
        default_tz: bst # set this to your timezone
        tag: no-downtime
        opt-out: true
        onhour: 8 # the hour when instances will be started up
    actions:
      - start
~~~


## Deploying a policy

### Prerequisites for deployment

Before deploying we need to create a role for the Lambda function to use. The role should have `EC2ReadOnlyAccess` and `CloudwatchFullAccess` managed policies attached. It will also need the following custom inline policy:

~~~json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CanStopAndStartEC2Instances",
            "Effect": "Allow",
            "Action": [
                "ec2:StopInstances",
                "ec2:StartInstances"
            ],
            "Resource": "*"
        }
    ]
}
~~~

Using the least permissions required is a good security practice. It also reduces the scope for Custodian to do something unexpected.
 
### Configuring the policy for deployment

To configure Custodian to deploy as a Lambda you can add a `mode` section to your policy:

~~~yml
policies:
  - name: offhours-policy
    mode:
        type: scheduled
        schedule: "cron(1 * * * ? *)" # Run every hour at one minute past the hour
        role: arn:aws:iam::123456789012:role/CloudCustodianOffHours
    resource: ec2
    filters:
      - type: offhour
        default_tz: bst # set this to your timezone
        tag: downtime
        opt-out: false
        offhour: 18 # the hour when instances will be shut down
    actions:
      - stop
~~~

The `mode` section has the following fields:

- `Type`: This determines how the Lambda is triggered. For example, this could be on a schedule defined in a CloudWatch rule or in response to a CloudTrail event.
- `Schedule`: This is used for scheduled Lambda functions. An expression in CloudWatch [scheduler syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) can be provided here.
- `Role`: The role which the Lambda function should assume. This should be [setup in advance](#prerequisites-for-deployment) of deploying the function.

#### A gotcha about time zones

To keep things simple the examples above are run every hour. You could optimise this to run only during the offhour hour. If you decide to do so watch out for this gotcha: filters use your timezone but schedules are always evaluated in UTC.

This inconsistency can lead to issues when using both together. For example, in the BST/GMT time zone, filters and schedules will have an hour offset during summer time. If the hour doesn't match exactly the on/offhours filter won't run so your policy will not work during summer.

### Running the deployment

Deploying the Lambda function is handled entirely by Custodian. Simply use the run command:

~~~
custodian run --region=eu-west-2 --output-dir=/tmp policies/offhours.yml
~~~

Custodian also has a dryrun parameter which can be used to test your policy. When doing so the policy will run in-place rather than being deployed. This means your IAM role or user will need the [same permissions as the deployed Lambda function](#prerequisites-for-deployment).

The `region` parameter specifies where the function and CloudWatch rule will be setup e.g. `eu-west-2`. If you want to deploy globally you can specify `all`. You may need separate policies for teams in different time zones.

Once the run has complete you should see a new lambda function and CloudWatch rule. These should both be called `custodian-offhours-policy`.

![Screenshot of AWS Console showing the CloudWatch Rule for the Custodian offhours policy.]({{site.baseurl}}/dsmith/assets/custodian-offhours-cloudwatch.jpg)

![Screenshot of AWS Console showing the Lamdba function for the Custodian offhours policy.]({{site.baseurl}}/dsmith/assets/custodian-offhours-lambda.jpg)

### Testing the deployment

To test the deployment end-to-end you can use an opt-in policy and tag a single instance with your chosen tag. You can then set the offhour for the next hour and the onhour for an hour after that. You might have to wait a while to see if it has worked.

## Extending your setup

In this post, I've covered policies for stopping and starting EC2 instances on a schedule. You can also setup similar policies for other resources such as RDS instances and Auto Scaling groups.

There are also a lot of other use cases for Custodian including security, compliance and cost-saving applications. For more information see [the Cloud Custodian documentation](https://capitalone.github.io/cloud-custodian/docs/usecases/index.html).

## Conclusions

Custodian is quite easy to use and the Lambda integration is particularly convenient. It also seems like a neater way to manage your environment than writing lots of custom scripts. There are some gotchas to be aware of and care is needed when setting up policies. I definitely will be making more use of Custodian in the future.
