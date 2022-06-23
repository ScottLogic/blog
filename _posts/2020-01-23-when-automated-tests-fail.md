---
title: When Automated Tests Fail...
date: 2020-01-23 00:00:00 Z
categories:
- hwilliams
- Testing
tags:
- test
- automation,
- testing,
- QA,
- DevOps,
- CI,
author: hwilliams
layout: default_post
summary: Automation plays a crucial role in the execution of regression test suites.
  A Continuous Integration (CI) tool can run 100’s of tests as part of a build deployment
  pipeline. The CI tool proceeds through several steps until the pipeline is complete.
  Wonderful! - but what do we do if failing tests block your pipeline?
image: hwilliams/assets/wile-coyote-fail.jpg
---

![wile-e-coyote-fail-test]({{site.baseurl}}/hwilliams/assets/wile-coyote-fail.jpg)

Automation plays a crucial role in the execution of regression test suites. A Continuous Integration (CI) tool can run 100s of tests as part of a build deployment pipeline. The CI tool proceeds through several steps until the pipeline is complete. Wonderful! - but what do we do if tests fail and block your pipeline?

When an automated test fails
----------------------------

If a CI pipeline test fails, you’ll need to determine why the failure has occurred. Common reasons for failed tests include:
- Test code issues 
- Test data issues
- Server issues
- Application code defects

After identifying the problem, your team should apply a fix, then rerun the pipeline. If no further issues occur, the pipeline will succeed.

On occasion, the team may decide to delay fixing an application defect. The defect may be a low business priority, or there may not be enough time to fix it within the current sprint. The fix is thus postponed with the issue placed on the product backlog until some time in the future.

Without applying a fix, tests will continue to fail whenever the pipeline runs. This would block the delivery of new features - unrelated to the failing tests - to the users. To avoid this consequence, we can **defer** failing tests. I stress the word "defer" as it's important we understand that this should be a temporary measure.

The steps below outline how you can handle CI test failures caused by backlogged defects. Following this process on a recent project helped keep our deployment pipeline flowing.


When the test fails
--------------------

### 1\. Create a bug ticket

Use the issue management tool in use by the project you're working on - e.g. Jira or GitHub - to create a bug ticket. The ticket should detail the issue that caused the test to fail.

Within the ticket, describe how to reproduce the error using a non-automated method. Your description should, of course, include the expected and actual result of the test.

Add a comment or - if the tool allows - a subtask to the ticket as a reminder to un-skip the test once there it's resolved. The note/subtask should reference the failing test spec to make it easier to locate.

### 2\. Add skip statement to the failing test and a comment containing a link to the bug ticket

Within the test spec code, locate the failing “it” function and append it with “.skip”.  Above the function, enter a comment containing a link to the bug in a format like...

    // Bug: http://your.project.issues/bug-13
    it.skip('Creates a new user', () => {...})


Once the bug is fixed
---------------------

### 1\. Retest

Once the developer has marked the issue as fixed, verify it with a manual test re-run. If it passes, move on to the next step if not, have a friendly chat with the developer.

### 2\. Remove the skip statement and the bug reference comment

Reenable the test in the CI pipeline by removing the skip statement. Since the bug is no longer present, delete the comment referencing the issue ticket.

### 3\. Rerun the pipeline

Once you've completed the above steps, merge the updated test files. The test should run and the pipeline should complete with the lush, green passing hue of success.

Final Note
----------

If the team decides to backlog known defects, the team should plan and implement the fixes. The aim is to avoid the burden of clearing down a "backlog landfill" that can mount over time if left unchecked. The bigger the backlog, the more you risk a poor user experience and further quality issues. To be 100% certain that defects do not accumulate, aim to get them fixed - yesterday!
