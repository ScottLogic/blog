---
title: Securing access to Firebase Test Lab
date: 2019-03-21 00:00:00 Z
categories:
- Tech
author: zrubin
layout: default_post
summary: This post addresses how to grant access to Firebase Test Lab without also
  granting access to your wider Google Cloud Platform services.
---

Mobile apps pose interesting challenges for automated testing. While both Android and iOS ecosystems offer virtual devices (_Emulators_ on Android and _Simulators_ on iOS) that can run automated tests, it’s always wise to also test on physical devices. However, it can be challenging to manually integrate mobile devices into CI pipelines to deliver robust and scalable automated testing. As a result, many companies provide cloud-based Device Farm services through which time on both virtual and physical devices can be rented to run automated tests.

We've been using Firebase Test Lab, Google's device farm service to run automated tests for both Android and iOS apps. Out of the box, the authorisation methods provided to grant users the ability to run Test Lab jobs also grants them access to wider Google Cloud Platform resources, presenting a potential security risk.

## Introduction

This blog post is here to address a very specific technical issue: how to grant a Google Cloud Platform (GCP) Member (Service Account or User) access to run Firebase Test Lab tests without giving them project-level `Editor` permissions (i.e. full access to all your Google Cloud Storage (GCS) Buckets and any other enabled GCP service!).

## Securing access to Firebase Test Lab

In summary, we will create a custom role that gives a Member permission to execute Firebase Test Lab tests, and a GCS Bucket that the Member has access to, in which the results will be stored. 

You will need the relevant permissions to create GCS Buckets and alter their permissions, create GCP IAM roles, and the ability to assign IAM Roles to IAM Members as well as a Member to execute Test Lab jobs with.

First, [create a new role](https://console.cloud.google.com/iam-admin/roles/create) with the following permissions: `cloudtestservice.*`, and `cloudtoolresults.*` (select all permissions with prefix before `.*`).

You can find these by using `Filter permissions by role` to search for permissions associated with the `Firebase Test Lab Admin` role.

[Using the IAM page](https://console.cloud.google.com/iam-admin/iam), assign this role to the Member you will be using to execute Test Lab jobs.

Next, [create a new GCS Bucket](https://console.cloud.google.com/storage/create-bucket) to store Test Lab results in.

Give the Member you will use to execute Test Lab jobs all of the `Storage Legacy` permissions on the Bucket you created.

Finally, when executing Test Lab jobs provide the `--results-bucket` option with the name of your newly created bucket, for example:

`gcloud firebase ios test run --results-bucket=some-bucket-name`.

## Important Caveats

There are a couple of issues with this configuration to be aware of.

Firstly, the permissions listed above are in `Testing`, which you will notice when adding the permissions as described above. These permissions are not recommended for use in Production, but they have been working okay for us so far. Be aware: if you start receiving strange permission-related errors it may be due to this!

Secondly, when storing Test Lab results in a custom Bucket **you are billed for the storage space you use!** This is not the case when letting Google take care of storing the results for you. You can use [Lifecycle management rules](https://cloud.google.com/storage/docs/lifecycle) to ensure that old results are automatically deleted.

## Conclusion
We use this configuration to run Test Lab tests as part of our CI/D pipelines. We are also able to grant specific people  access to run Test Lab tests as and when they need to.

If you're willing to use bleeding edge features in your project and accept a slightly higher GCP bill at the end of the month, then this may be the solution for you.

If you're not, [Google provide alternative approaches](https://firebase.google.com/docs/projects/iam/permissions#testlab). One approach is to use Firebase Test Lab in an entirely separate Project, and the other involves giving the Member in question `Firebase Test Lab Admin` and `Firebase Analytics Viewer` roles. However, be aware that the `Firebase Test Lab Admin` role grants access to all GCS Buckets associated with the Project.
