---
published: true
author: nwolverson
layout: default_post
title: Deploying PR branches with Gitlab review apps and Elastic Beanstalk
summary: >
  I describe setting up feature branch deployments with Gitlab's Review Apps and AWS Elastic Beanstalk. This gives a fairly straightforward means of setting up automated deployment of PR branches, but I discuss some issues I encountered along the way.
categories:
  - Cloud
---

For another instalment of Build Friday (see: [(Multi-stage Docker) in Docker as CI Sledgehammer](http://blog.scottlogic.com/2018/02/09/multi-dind-ci-boxes.html)) I'm going to describe setting up feature branch deployments with Gitlab's Review Apps and AWS Elastic Beanstalk.

Automated deployment of feature branches allows developers to test changes when reviewing a PR without having to interrupt their work to build and run changes locally, and can allow testers and business stakeholders to access a feature pre-merge providing feedback earlier in the process where change is cheaper.

Gitlab's [Review Apps](https://docs.gitlab.com/ee/ci/review_apps/) and AWS [Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html) are both tools which require very little work to set up and enable a pretty sophisticated workflow with minimal configuration, however in both cases there are gotchas in configuration and tooling that can make the experience painful. My hope in writing this is that at least one person can avoid the infuriating issues that I hit.

### Review Apps

Gitlab has a few things that make it attractive over [GitHub](https://github.com/) and [Bitbucket](https://bitbucket.org/), and the integrated CI/CD support for me is one of these (disclaimer: I've not used Bitbucket pipelines). [Review Apps](https://docs.gitlab.com/ee/ci/review_apps/) is a feature that allows branches to be mapped to dynamically configured environments so that deployment of short lived branches can be automated and integrated into the PR workflow.

If you're using another SCM/CI provider this is something that if not provided directly can most likely be achieved through build scripts and commit/merge webhooks, it may just take a little more work.

The first possibly confusing thing to understand about Review Apps is it's not a *thing* in the sense of a particular option appearing in a menu somewhere. Rather, it's a few things that work together:

1. Set up some deployment environment (for this post, EB)
2. Configure the `.gitlab-ci.yml` correctly
3. UI elements appear on various Gitlab pages to enable this workflow

The fact that there is no explicit *do this* action means that when setting this up for the first time, I found myself unable to see what's wrong as I did not know where to look - the additional UI for Review Apps is well integrated in various places, but it's not clear without seeing it what to expect. I'll illustrate with screenshots below what appears once things are configured correctly.

### Elastic Beanstalk

[Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html) is an AWS offering which provides an easy all-in-one solution to bring up an application on EC2, with load balancing, scaling, DNS, database... It's all a little magic and a little tailored to a local development/deployment workflow (you could say a little opinionated), and to an extent this can be a bit of an issue integrating with CI, but with the right magic it's an easy option to get an automated deployment up really quickly. This assumes you want to deploy an EC2 instance for your application - which may not always be the right fit.

The first gotcha I had around Elastic Beanstalk was the CLI tooling. AWS has a great supported CLI - the philosophy is that anything at all in AWS has the same interface available as a REST service, and on the CLI, as on the console (and increasingly, via CloudFormation templates also). The general `aws` CLI is easy to install on various platforms, but it is a rather low-level interface, as much of the tasks one wants to accomplish becomes a number of perhaps tedious `aws` CLI operations. Therefore various services have their own CLI as well, such as the [ECS CLI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI.html) and the [Elastic Beanstalk CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html). However these are not as easily available: I think at one point the ECS CLI was not available on windows, for example, and they are not as available on system package managers. It seems by comparison to the main API like these may be "fire and forget", they seem like they have been put together out of necessity on initial release then not maintained...

My experience with the EB CLI was that the install process was inordinately unpleasant (and I'll spare the details):

1. First I install `pip` so that I can install the `awsebcli` package
2. On first attempt it turns out that there is a dependency not tracked by the package manager required to build the package, I get some lovely C compiler errors
3. After installing this I manage to install the `awsebcli` package, but then it fails at runtime
4. There seems to be some dependency version issue, but after delving through various issue trackers I never manage to find a compatible set of versions

Now I imagine Python people will tell me that I should have installed the package in a [virtual environment](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-virtualenv.html) but to me the bottom line here is that Python and `pip` is not a suitable choice for distributing a command-line tool for general consumption for those of us that don't care to navigate Python ecosystem issues.

Therefore I'd recommend grabbing a Docker image which contains all the tools required, even to use this tooling locally: I used [`coxauto/aws-ebcli`](https://hub.docker.com/r/coxauto/aws-ebcli/).

### Setting up a review environment

I'm going to continue with the silly [Hello World example](https://gitlab.com/nwolverson/hello-build) from the earlier blog post. Let's start with configuring a standard deploy environment:

~~~yaml
deploy:
  stage: deploy
  image: coxauto/aws-ebcli
  script:
    - ./deploy.sh
  environment:
    name: development
    url: http://hello-build-dev.eu-west-2.elasticbeanstalk.com
  only:
    - master
~~~

I'll come to the deploy script in due course, but this is a build step using the Docker image mentioned above, in this case running on the `master` branch. The interesting point is that an environment `development` is defined. A big thing to understand is that *the URL is very important*: not only does the URL give you a link to actually use the environment, if a well formed URL is not provided other things will mysteriously not show up. Including missing the `http://` / `https://` prefix!

When this environment is configured, and the deploy script succeeds, the environment appears in the `CI/CD -> Environments` tab as follows:

![Environments listing development]({{site.baseurl}}/nwolverson/assets/review-eb/environments-dev.png)

The `dev` environment, which failed to validate and [I can now never delete](https://gitlab.com/gitlab-org/gitlab-ce/issues/25388) ([see also this issue](https://gitlab.com/gitlab-org/gitlab-ce/issues/38718)), can also be seen.

Now let's look at the changes to deploy a Review App. For this we use a dynamic environment, this means we simply use [an environment variable](https://docs.gitlab.com/ce/ci/variables/README.html) in the environment name:

~~~yaml
deploy_review:
  stage: deploy
  image: coxauto/aws-ebcli
  script:
    - ./deploy.sh
  environment:
    name: review/$CI_COMMIT_REF_NAME
    url: http://hello-build-$CI_ENVIRONMENT_SLUG.eu-west-2.elasticbeanstalk.com
    on_stop: stop_review
  only:
    - branches
  except:
    - master
~~~

In this case the `$CI_COMMIT_REF_NAME` is derived from the branch name. For demonstration purposes for this blog post, I created and pushed a branch `blog-demo` and an environment is created called `review/blog-demo`:

![Environments listing review]({{site.baseurl}}/nwolverson/assets/review-eb/environments-review.png)

You can see that this gives options to re-deploy, stop, and link to the deployed environment. We can also see the jobs which underpin these environment tasks in the Jobs tab (and trigger/monitor them):

![Jobs list]({{site.baseurl}}/nwolverson/assets/review-eb/jobs.png)

Now that we've associated an environment with that branch, the environment also appears in the PR:

![Environment deployment shown in PR]({{site.baseurl}}/nwolverson/assets/review-eb/environment-pr.png)

This listing of the environment link in the PR, along with the stop environment button, is a big win in my book. Another great feature is when the branch is merged, the environment is automatically stopped (stopping environments requires the `stop_review` job, more on this below). If you prefer to deploy the review environment on demand, you can add the following condition to give a one-click deployment instead:

~~~yaml
when:
    manual
~~~

### Putting the deployment together

Now for the deployment part, the EB deployment is done in the `deploy.sh` I skipped over earlier. For this example I'll be using Elastic Beanstalk's Docker deployment, in the flavour that uses a `Dockerrun.aws.json` file to specify an existing Docker image to run as opposed to building a local `Dockerfile` (since our CI built that already).

As I want to deploy a specific commit which is tagged in the Gitlab container registry, I include a template for the `Dockerrun.aws.json` file:

~~~json
{
    "AWSEBDockerrunVersion": "1",
    "Image": {
      "Name": "",
      "Update": "true"
    },
    "Ports": [
      {
        "ContainerPort": "8000"
      }
    ],
    "Volumes": [ ]
}
~~~
We'll update this to the specific tagged image in the deployment step. Now we set up the EB environment. In a `coxauto/aws-ebcli` container, and after populating the AWS environment variables *which also need to be configured on the CI server*, I ran

~~~bash
eb init hello -r eu-west-2 -p docker-17.09.1-ce
~~~

This generates a `.elasticbeanstalk/config.yml` which will set up the deployment options, though I *did* have to remove the generated `.gitignore` as I wanted this to be present for the CI deployment step. Then it's as simple as running `eb create` or `eb deploy` as required. For the review branch, I'll run `eb create` if it doesn't exist, or `eb deploy` to update it otherwise, finally afterwards we'll run `eb terminate` to clean up.

This is really easy, but I ran into 3 gotchas

1. EB builds your `Dockerfile` even if you have a `Dockerrun.aws.json` which doesn't use a locally built image. So the build will be defined by `Dockerrun.aws.json`, but fail if the `Dockerfile` fails to build, and certainly take longer than required.
2. EB zips up your entire source tree to upload to S3 even when just the `Dockerrun.aws.json` is required
3. EB only uses the committed source code in your git repository, if it notices it is run in a git repository. With the `--staged` flag, you can stage changes to include, but I found myself bizarrely committing changes locally to git just to make the EB CLI pick up a CI generated modification to the repo...

We can avoid this nonsense by asking `eb` to only upload the `Dockerrun.aws.json` to S3 in `config.yml`:

~~~yaml
deploy:
  artifact: Dockerrun.aws.json
~~~

With this in place, the deployment script is something like this:

~~~bash
jq < Dockerrun.aws.template.json ".Image.Name=\"${IMAGE_TAG}\""  > Dockerrun.aws.json
git add Dockerrun.aws.json

if [ ! -z "$(eb list | grep "${CI_ENVIRONMENT_SLUG}")" ]
then
    eb deploy "$CI_ENVIRONMENT_SLUG"
else
    eb create -c "hello-build-$CI_ENVIRONMENT_SLUG" "$CI_ENVIRONMENT_SLUG"
fi
~~~

...except that `eb` doesn't always error with an error code when things go wrong, so we [grep the output for error lines](https://gitlab.com/nwolverson/hello-build/blob/master/deploy.sh):

~~~bash
eb deploy "$CI_ENVIRONMENT_SLUG" | tee "$CIRCLE_ARTIFACTS/eb_deploy_output.txt"

# ...

if grep -c -q -i error: "$CIRCLE_ARTIFACTS/eb_deploy_output.txt"
then    
    echo 'Error found in deploy log.'
    exit 1
fi
~~~

### Terminating the review environment

Terminating the environment is along the lines of the initial deployment, except in the case that the build is running on branch deletion, there is no source control checkout possible. Per [Gitlab's recommendation](https://docs.gitlab.com/ee/ci/environments.html#stopping-an-environment) we can use the `GIT_STRATEGY: none` option, to avoid checkout, but then rather than using a script must specify the commands inline. This turns out to be pretty straightforward, in this case using `eb terminate --force "$CI_ENVIRONMENT_SLUG"` ([full details](https://gitlab.com/nwolverson/hello-build/blob/master/.gitlab-ci.yml#L34)).

## Conclusion

I hope you'll consider the strategy of review branch deployments, if not the tools discussed above. The same could be accomplished with build scripts and webhooks, on one side, and something like ECS or Kubernetes on the other. And I hope that if you do choose the approach above, you benefit more from its simplicity by avoiding some of the pitfalls I've discussed.

A project containing the example and deployment process discussed above is [available here](https://gitlab.com/nwolverson/hello-build).
