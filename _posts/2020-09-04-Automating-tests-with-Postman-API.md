---
title: Automating API tests with the power of Postman API
date: 2020-09-04 00:00:00 Z
categories:
- Testing
tags:
- Testing,
- API,
- Postman,
- CI/CD,
- Monitor
author: mmcalroy
layout: default_post
summary: Effective API testing has become increasingly more important with the rise
  of microservices. In this post we'll discuss how we can efficiently manage our API
  tests and automate them into a CI/CD pipeline with some of the tools provided by
  Postman
image: mmcalroy/assets/postmanLogo.png
---

As microservices become the norm, ensuring our systems can communicate properly is now more important than ever. Having well written tests that we can easily modify and automate in our CI/CD pipeline will contribute greatly to this. To that end, let's see how we can automate our API tests with Postman, a tool I'm sure many of us have come across at one point or another.

For this, we will be using Stephen Mangan's post [A Beginner's Guide to Automated API Testing (Postman/Newman)](https://blog.scottlogic.com/2020/02/04/GraduateGuideToAPITesting.html) as a jumping off point so will be assuming a lot of the knowledge from there. Primarily how we can export collections and environments as well as using Newman to run them from the command line. If you haven’t read it yet, now would be a good time to go and give it a look. Don’t worry, we’ll be here when you get back.

Using Stephen's approach leaves us with files that aren't easily readable and any changes to them involve importing them to postman if not already there, exporting once the changes are saved and replacing the older files in the repo with these completely new ones. This means that any change involves completely replacing our test file(s) so understanding and reviewing those changes on typical version control systems e.g. github becomes quite a challenge.

So, can we build on this to make the process easier for teams to develop and test? Let’s start by having a look at the Postman API.

## Postman API

Running the Postman app without having an account allows us to make and manage collections locally. With an account, however, we can start to utilise the Postman API which backs up our workspaces, collections and environments in the cloud.

Thanks to this, whenever we save changes to our collection, these will sync automatically through the API and the rest of the team can view these by simply hitting the refresh button. One main disadvantage from this though is that we now have a copy of our tests stored with a third party so should be careful not to store any sensitive information in our collections or environments. 

It's worthwhile considering this aspect carefully as organisations may be averse to storing information externally with a third party. They may not be comfortable with any data being out of their direct control and ultimately having to trust that nothing is saved externally that could compromise their security.

## Team Workspace

To work effectively with our team we should either set up a team workspace or a team account in Postman. The team workspace is free but is limited to only 25 active API requests, after which the oldest will be archived as historical requests, more info on [Team Workspaces](https://blog.postman.com/free-teams-faq/#:~:text=Prior%20to%20Postman%20version%206.2,only%20to%20Pro%20%26%20Enterprise%20users.&text=Now%2C%20collections%20can%20be%20created,on%20projects%20in%20real%20time.) here.

Alternatively we could open a team account which has much higher limits on the number of requests and calls but does involve a monthly subscription so it is really down to what works best for your project and how much you’re willing to spend. Here though, we will just stick to the free team workspace.

You can’t convert the default workspace you start off with (‘My Workspace’) into a team workspace so we need to make a new workspace first and invite our team to it, defining the level of access to give each member as either admin or collaborator 
([Sharing workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/managing-workspaces/#:~:text=Sharing%20workspaces,-You%20can%20share&text=Open%20your%20workspace%20in%20the,the%20center%20and%20click%20Invite.), [roles defined](https://learning.postman.com/docs/collaborating-in-postman/roles-and-permissions/#workspace-roles)).

From here, everyone on our team can view and contribute to all collections and environments of our postman API tests without having to export and import various files.

## Version control

But what about when we want to start making changes to the current tests and write new ones?

If we go to the collection and hit the '...' button, we can choose to fork from the current version within Postman. This will create another version of the collection below the original. From here we can update our branch with any new updates to the master version and create a pull request that will take us to the web dashboard where you can provide your request with a title and description. You’ll then be taken to the page for your pull request.

<img src="{{ site.baseurl }}/mmcalroy/assets/blogpostPullRequest.png" alt="blogpostPullRequest" />

Here we can look over any conflicts our branch may have, assign team members to review our PR and merge it once approved. We can now much more easily version control our Postman collection(s). The main disadvantage of this, however, is that we are now managing these tests separately from the main code repository.

If our codebase is stored on Github or Gitlab then there is a way in which we can sync our repo with our Postman Workspace. This does involve generating an access code through your github account but allows you to sync up your Postman workspace with the github repo such that any updates saved to the workspace are auto-committed to the github repository. You can find in depth information on that here: [Sync with Github](https://learning.postman.com/docs/integrations/available-integrations/github/)

## Handling API keys and using Postman API

Now, we could continue regularly exporting the latest version of our API and merging it into our main repo to run the tests in our CI/CD pipeline, but this doesn't sound very agile and requires manually swapping out files regularly. Needless to say this opens us up to a larger chance of human error and not getting the right version of our tests hitting our code early enough. To improve on this, we can instead turn to some more features of the Postman API.

By following the instructions found here; [using newman with the postman API](‘[https://www.npmjs.com/package/newman#using-newman-with-the-postman-api](https://www.npmjs.com/package/newman#using-newman-with-the-postman-api)’), we can generate an API key for our workspace. We can then use this in the Postman app to get a list of our collections and environments and their associated ids. With these ids and the API key, we can plug these into our newman command which will look something like this:

`$ newman run "https://api.getpostman.com/collections/$uid?apikey=$apiKey" --environment "https://api.getpostman.com/environments/$uid?apikey=$apiKey"`

For added security, we can store the API key and unique ids needed for this as environment variables on our CI/CD provider since they are only necessary for running the tests in the command line. This therefore ensures that we can run the latest version of our API tests against our code without relying on human intervention to manually export and replace the files.

## Reports

So, now we have our workspace, collections and environments set up and shared with our team, we can make pull requests and run our tests against the codebase in our CI/CD pipeline, ensuring it’s always the latest version of the tests run. The last things to have a look at now is generating reports and setting up a monitor to keep an eye on our APIs for us.

Generating a report is as simple as adding an extra newman package to our codebase and an extra flag on the newman command we use for running our tests. Here, we have used the reporting tool ‘htmlextrareport’.

Step 1: simply run npm install newman-reporter-htmlextra.

Step 2: add to the newman command -r html extra --reporter -htmlextra-title “Report title”

This should now look like this:

`newman run "https://api.getpostman.com/collections/$uid?apikey=$apiKey" --environment "https://api.getpostman.com/environments/$uid?apikey=$apiKey" -r html extra --reporter-htmlextra-title “Report Title”`

This will create a folder in the working directory named ‘newman’ with the report file in it.

## Monitors

With Postman, we can set up a monitor on a collection that will automatically run our API tests at regular intervals and alert us of any failures. This can be an incredibly useful tool to help us keep track of the health of the system and get ahead of any issues sooner.

Monitors can be set up from various places (web dashboard, '+New' button, Launchpad etc.) but here, we will go from the collection in the Postman app we want to monitor. Clicking the arrow button next to the collection will open a menu for that collection with ‘Monitors’ as one of the headers. Selecting this header and then hitting the ‘Create a monitor’ button will open a dialog to configure our monitor.

<img src="{{ site.baseurl }}/mmcalroy/assets/blogpostAppMonitor.png" alt="blogpostAppMonitor" width="100%"/>

Here we can choose the name of the monitor, give it a version tag and assign it an environment to use. We can also define the frequency with which we want it to run, varying from weekly to hourly intervals.

After defining our monitor and creating it, we can check it’s results and history on the web dashboard. Here we can get a look at not only the most recent but also all the historical monitor runs of our tests as well as manually trigger new runs if needed. Feedback comes in the form of a graph which gives a broader view of the results of the most recent runs as well as a list below similar to what you would find in the Postman runner summarising the selected runs’ results. Also accompanied is a log of the selected test run which can be useful in investigating any test failures.

For more on monitors, have a look [here](https://learning.postman.com/docs/designing-and-developing-your-api/monitoring-your-api/setting-up-monitor/).

## Conclusion

Something to keep in mind with this solution is scalability. How big is your project/how big do you expect it to become?

Although a lot of what has been covered here is available for free, they do have a use limit per month, usually how many API calls you can make per month. This may not be a problem if your project is small or have the budget to afford one of the paid plans. However, if this isn’t the case, you may want to use this solution carefully to ensure you don’t end up balancing good test coverage with staying out of that paid subscription.

From this process you can now run a lot of your API testing, if not all of it entirely, through Postman. This is done in a way that is accessible for the team, easily maintained and includes simple to use tools to track the health of the system, any failures and how often they occur.
