---
author: cfreestone
title: Some Best Practices for Writing Readable Automation Tests
summary: While on my most recent project I had the unique experience of working closely with many testers and test minded individuals. This allowed me to learn some much-needed lessons about how to best implement automation testing with accessibility in mind, a sometimes-overlooked area of test automation.
categories:
- Testing
---
While on my most recent project I had the unique experience of working closely with many testers and test minded individuals. This allowed me to learn some much-needed lessons about how to best implement automation testing with readability in mind, a sometimes-overlooked area of test automation.

## Introduction
What I hope to share with you is how simple it can be to both think about and implement the approach to make sure your tests are accessible and readable. You may be reading this because you have strict reasons on your project to ensure compliance with certain metrics, or because you want to increase the longevity of your code, or because you simply want to read some wonderful thoughts from a certain tester's perspective!

## What to expect()
Now, it’s good to make note that the lessons learnt here are all from the work I have carried out while implementing Playwright tests. This means you will need some basic understanding of TypeScript and Playwright for when I discuss some examples. So, without further ado, let's discuss the `expect()` function.

This neat little function is the bread-and-butter of automating in playwright, it's what we want to see when we place our test into a certain configuration. This doesn’t mean it has to do handstands or backflips, but just like any gymnastics routine, we wait on it with bated breath, hoping for results we will cheer for. This anticipation makes it easy for us to write something which makes us wait for that big finale in our tests.

And therein lies the issue; during a test we usually assert for confirmation to ensure we are where we expect. That means we can `expect(response.status()).toBe(200)` which is a wonderful successful request that has found the requested resource of a page. Say that instead we get a `201` response, which is just as equally a successful request, except it led to the creation of a resource. Test results can’t always be perfect and that means that this stopping point during the test, before we check the larger critical parameters later on, will skip the test. Instead, we have to accept that not every response will be exciting and just `expect(response.status()).toBeOK())` which allows us to still capture a successful response from a test, even if the status code is different. 

## Don’t just getBy, Role with it
After correctly measuring our expectations, we want to roll into selecting all the necessary parameters we can get by with. Therefore, it comes as no surprise we use the `.getByRole` function, but in order for us to make sense of it then it's all about those pesky selectors. 

This is because there is an interface that runs behind the scenes of the UI and Playwright can pick selectors which will not be seen by   someone who needs to use the keyboard to navigate around the system. For these users, the elements they have access to are either tabbed to or navigated to via arrow keys. If using a screen reader these selectors   need to have a consistent and readable naming convention. Otherwise, some software that reads it aloud would read out aloud could read jargon which will only confuse the User.

Things like filters and drop-downs can sometimes be difficult to locate but they can be found. A good tip for finding this is by entering the webpage and open up DevTools, then clicking near the item you wish to find the selector of, but not on it. After that press tab and open up the console within DevTools. This works best when your initial click is to the top left of the item you wish to find. If you then type the command: `document.activeElement` you will find the info you need. Failing this you can always right-click and inspect the item.

It's also generally good practice to not use `.getbyTestID`.This is due to the fact that names of those same ID’s will not make sense when either looked at later in a projects life cycle or to others in the team who do not have knowledge in that area. More information can be found about locators in the [Playwright documentation](https://playwright.dev/docs/locators)



Sometimes though this may not have been implemented on the project. This requires roles to be assigned correctly on the project you are on, things like test ID's or divs could have been used instead which makes this impossible to implement. When this is the case it is always best to have that conversation with the team so that you can explain how useful and helpful HTML roles are.

## Some notable names worth tagging
And after all of these suggestions, we find ourselves back at the top of a finished test, ready to move on and forget about all that good work we have done. If only there was a way to easily locate your previous work when you have some busy moments on the project and need to hand over what you’ve created. Well, to name a few reasons, let’s start with the Name of your test and follow with some tagging advice. 

When creating names of tests they tend to look like this:

```test('should return a 200 when User is Valid')```

Which uses single quotation marks `'` as the name is a string. However, it can be difficult when you wish to pass in a variable to that same string, as variables are noted by single quotation marks also.  

So, when creating test names, it's best practice to instead use the back tick ``` ` ``` as this will still allow you to use a variable in the test name as seen in this example:  

```test(`should return a 400 when User Infomation is '${variable}'`)```

For those who don’t know where it is, the back tick can be located underneath the ESC key on the majority of keyboards.  

Going forward with the creation of our tests we want to ensure that they can be associated with the correct story or ticket from which they were created. The tag function can be used in the test name and can be done like this:

```test(`a test example to show a test name for a test under ticket THW-000`, {tag: 'THW-000'}, async()```

Here you can see that the tag simply needs to be placed at the end of the test name and is separated with a comma. For good practice this should be the ticket number that the work is being generated from.

If you want to go the extra mile, it's even better to use annotations for ticket numbers. That way, tags can be used exclusively to filter what tests are run, filtering test results. This is what is documented in the [Playwright documentation](https://playwright.dev/docs/test-annotations)

## Conclusion
Well, there have been some odd analogies and puns along the way but hopefully this peek into a tester's mind has helped you understand the importance of, and some ways to implement some good approaches in your automation tests while also keeping it simple to implement. Maybe there are even more simple techniques out there so go out and find them, or better yet bring them up with others and let's get everything even more readable!   

 

