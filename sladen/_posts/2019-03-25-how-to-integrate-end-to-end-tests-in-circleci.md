---
published: true
author: sladen
layout: default_post
category: Testing
title: How to integrate end-to-end tests in CircleCI?
summary: >-
  Adding a job can look intimidating, for an outsider. Here is how I approached
  this task to integrate my end to end tests into an existing workflow
tags: 'CircleCI, featured, e2e, continuous integration'
image: sladen/assets/circleCI.png
---


Recently I joined a project using CircleCI to manage their continuous integration. The workflow was lacking end to end tests, yet the tests were already present in the repository!
In order to not leave these tests to waste, add a safeguard after each check-in, and learn how to use CircleCI, I decided to modify the current workflow to add their execution.

### A few words about the project
The project is a web application, with a server requesting and receiving data from an external source, and a client requesting some of this data to display charts on one page. Data has to be refreshed periodically (every 5 minutes at the moment). 

The client itself offers very little interaction: a few controls to change the format of the charts, a tooltip when the cursor hovers over the chart, and that’s it!

The main value added by these tests is to verify that, with the server running, the client can draw charts. If data is missing, no chart would appear.

This sounds simple, right? 

### CircleCI
The way CircleCI is currently configured is the following: on any branch different than master, when a user pushes a change on a branch, a workflow is triggered.
The workflow includes the following jobs:

- Checkout_code: pulls the code on the branch
- Install: installs the server and the client
- Test-once: runs unit tests

If a change is pushed on master, in addition to these 3 jobs, the workflow is completed by the job “Deploy”, which deploys the application on an AWS server, and starts the application.

My goal is to add a job to run the end to end tests after “Test-once”, but before “Deploy” (if we’re on master).


### Writing the job
CircleCI uses the configuration file config.yml. It describes the workflows, combining jobs with pre-requisites. Jobs are also described in this file, with a sequence of steps to perform.

Before writing the job itself, let’s have a look at the steps required to run the tests:

- Install webdriver-manager
- Start webdriver
- Start the server
- Run the tests



This translates into the following steps:

    e2e-test:
      working_directory: ~/repo
      docker:
        - image: sladen/node:10.15.0-stretch-jdk8
     steps:
       - restore_cache:
           key: source-{{ .Branch }}
       - restore_cache:
           keys: 
             - node-client-v1-{{ .Branch }}-{{ checksum "client/package.json" }}
             - node-client-v1-{{ .Branch }}-
             - node-client-v1
       - restore_cache:
           keys: 
             - node-server-v1-{{ .Branch }}-{{ checksum "server/package.json" }}
             - node-server-v1-{{ .Branch }}-
             - node-server-v1
       - run: 
           name: "Install and update webdriver"
           command: sudo npm install -g webdriver-manager && sudo -s webdriver-manager update
       - run: 
           name: "Start webdriver"
           background: true
           command: npm run webdriver:start
       - run: 
           name: "Start server"
           background: true
           command: API_KEY=$API_KEY && cd server && npm start
       - run: 
           name: "Build the client"
           command: cd client && npm run build
       - run:
           name: "Install dependencies"
           command: | 
               cd test/e2e && sudo npm install
       - run:
           name: "Run the tests"
           command: |
               cd test/e2e && npm run test

Let’s explain some steps:

- **Docker**: we use Docker to contain the different jobs. We are using an image from the DockerHub, tuned to fit our needs. More on this below.
- **Restore_cache**: these steps are used to restore modifications performed in previous jobs. The jobs checking out and installing the application save the changes brought to the docker image, using the command save_cache.
- **Install and update webdriver**: as the name says, we install and update webdriver. Sudo is necessary to install anything globally because CircleCI performs this steps with a regular user.
- **Start webdriver** and **Start server**: both steps must run in the background in order to run the automated tests. The main difficulty here is that CircleCI will initiate these steps and move on to the following step right away. Also, if that background step fails, it won’t stop the rest of the job. To make everything work in a timely manner, it may be necessary to add pauses in the next steps, to ensure that the background step is initiated properly before continuing. Also note the use of $API_KEY, an environment variable defined in CircleCI to store the key used by the server to send requests to a third party provider.

It is worth noting that even if many steps change the current directory, at the end of the step, CircleCI goes back to the working repository, in our case, ~/repo.

As for the workflow, it looks like this:

    workflows:
      version: 2
      build_test_deploy:
        jobs:
          - checkout_code
          - install:
              requires:
                - checkout_code
          - test-once:
              requires:
                - install
          - e2e-test:
              requires:
                - test-once
          - deploy:
              requires:
                - e2e-test
              filters:
                branches:
                  only:
                    - master

We only have one workflow in this project. As mentioned earlier, the job Deploy is used only when we have a check in on the master branch.
Each job requires the previous one to succeed.

### The result
In action, the workflow has the following look:
 ![WorkflowImage]({{site.baseurl}}/sladen/assets/BlogCCIWorkflow.png)
 

And the e2e-test job itself looks like this:
 ![JobImage]({{site.baseurl}}/sladen/assets/BlogCCIJob.png)
 
Each step can be expanded to verify the details.

And voilà!
You now have a workflow running your end to end tests.

### About that docker image
As mentioned earlier, the Docker image used is customised to fit our needs. Indeed, the application is built using Node 10.15. In addition to that, Selenium Webdriver requires JDK8 and Chrome to be installed.

To do so, running the nominal image node/10.15-stretch locally, I installed the desired JDK and Chrome and pushed my modified image to the DockerHub, creating my own tag. Once uploaded, my image was available in the DockerHub, and could be pulled in CircleCI.

### Conclusion
This workflow is relatively simple and is probably ideal to get into CircleCI. The main difficulty when adding a job is to design the steps in the right sequence, keeping in mind that the CircleCI user has no root permissions, and the background steps must be timed correctly to guarantee a smooth execution.
