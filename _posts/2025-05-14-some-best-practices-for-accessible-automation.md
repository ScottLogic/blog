---
author: cfreestone
summary: While on my most recent project I had the unique experience of working closely with many testers and test minded individuals. This allowed me to learn some much-needed lessons about how to best implement automation testing with accessibility in mind, a sometimes-overlooked area of test automation.
categories:
- Testing
---
# Some Best Practices for Accessible Automation Testing
While on my most recent project I had the unique experience of working closely with many testers and test minded individuals. This allowed me to learn some much-needed lessons about how to best implement automation testing with accessibility in mind, a sometimes-overlooked area of test automation.

## Introduction
What I hope to share with you is how simple it can be to both think about and implement the approach to make sure your tests are accessible. This can be because you have strict reasons on the project to ensure compliance with certain metrics, because this can lead to improved readability of your code and its longevity, or because you want to read some wonderful thoughts "from certain testers perspective".

## What to expect()
Now it’s good to make note that the lessons learnt here are all from the work I have carried out while implementing Playwright tests. This will mean you will need some basic understanding of TypeScript and Playwright when I discuss some examples. So    without further ado let's discuss the `expect()` function.

This neat little function is the bread-and-butter basics of automating in playwright, it's what we want to see when we place our test into a certain configuration. This doesn’t mean it has to do handstands or backflips, but just like any gymnastics routine we do wait on it with bated breath, hoping for results we will cheer for. This anticipation makes it easy for us to write something which makes us wait for that big finale in our tests, even if the tests took the literal definition of breaking a leg.

And therein lies the issue; during a test we usually assert for confirmation to ensure we are where we expect. That means we can `expect(response.status()).toBe(200)` which is a wonderful successful request that has found the requested resource of a page. Instead we get a `201 response`, which is just as equally a successful request but it led to the creation of a resource.   Test results can’t always be perfect and that means that this stopping point during the test, before we check the larger critical parameters later on, will skip the test. Instead, we have to accept that not every response will be exciting and just `expect(response.status()).toBe(OK)` which allows us to still capture data from a test even if the status code is different. 

## Don’t just getBy, Role with it
After correctly measuring our expectations, we want to roll into selecting all the necessary parameters we can get by with. Therefore, it comes as no surprise we use the `.getByRole function`, but in order for us to make sense of it then it's all about those pesky selectors. 

This is because there is an interface that runs behind the scenes of the UI and Playwright can pick selectors which will not be seen by   someone who needs to use the keyboard to navigate around the system. For these users, the elements they have access to are   either tabbed to or navigated to via arrow keys. If using a screen reader these selectors   need to have a consistent and readable naming convention. Otherwise, any software that reads it aloud would read out jargon which will only confuse the User.

Things like filters and drop-downs can be difficult to locate but they can be found. A good tip for finding this is by entering the webpage and open up DevTools, then clicking near the item you wish to find the selector of, but not on it. After that press tab and open up the console within DevTools. If you then type the command: `document.activeElement` you will find the info you need.

By the same accessible reasoning it is good practice to not use `.getbyTestID`.This is due to the fact that names of those same ID’s will not be useful to someone with an accessibility issue, as it will sound like Jargon when navigated to.

Sometimes though this may not of been implemented on the project. This requires roles to be assigned correctly on the project you are on, things like test ID's or divs could of been used instead which makes this impossible to implement. When this is the case its always best to have that conversation with the team so that you can explain how useful and helpful having roles can be.

## Some notable names worth tagging
And after all of these suggestions, we find ourselves back at the top of a finished test, ready to move on and forget about all that good work we have done. If only there was a way to easily locate your previous work when you have some busy moments on the project and need to hand over what you’ve created. Well, to name a few reasons, let’s start with the Name of your test and follow with some tagging advice. 

When creating names of tests they tend to look like this:

```test('should return a 400 when User is Valid')```

which uses single quotation marks `'` as the name is a string. However, it can be difficult when you wish to pass in a variable to that same string, as variables are noted by single quotation marks also. 

So, when creating Test Names its best practice to instead use the back tick ``` ` ``` as this will then still allow you to use a variable in the test name as seen in this example: 

```test(`should return a 400 when User Infomation is '${variable}'`)```

For those who don’t know where it is, the back tick can be located underneath the ESC key on the majority of keyboards.  

Going forward with the creation of our tests we want to ensure that they can be associated with the correct story or ticket from which they were created. When paired with the previous section for “Test Names”,. The tag function can be used in the test name and can be done like this:

```test(`a test example to show a test name for a test under ticket THW-000`, {tag: 'THW-000'}, async()```

Here you can see that the tag simply needs to be placed at the end of the test name and is separated with a comma. For good practice this should be the ticket number that the work is being generated from.

If you want to go the extra mile its even better to use annotations for ticket numbers. That way tags can be used excusivly to filter what tests are ran, filtering test results. This is what is documented in the Playwright documenteation. 

## Conclusion
Well, there have been some odd analogies and puns along the way but hopefully this peek into a tester’s mind has helped you understand the importance of, and some ways to implement some good accessible skills in your automation tests while also keeping it simple to implement. Maybe there are even more simple techniques out there so go out and find them, or better yet bring them up with others and let's get everything even more accessible!   

 

