---
title: WebdriverJS and Promises
date: 2015-03-04 00:00:00 Z
categories:
- Tech
tags:
- featured
author: rhendry
title-short: WebdriverJS and Promises
layout: default_post
image: rhendry/assets/featured/promise.jpg
image-attribution: image courtesy of <a href='https://www.flickr.com/photos/32490173@N05/'>galleryquantum</a>
summary: Avoiding broken promises with WebDriverJS - a quick guide to avoiding some of the framework pitfalls.
---

Recently I have been working with WebdriverJS to fulfil a need for browser testing on a project. Although I've used
Selenium for Java in the past, this was my first time using the JavaScript version. While broadly similar to what I
remembered about the Java API, WebDriverJS returns Promises from all of its browser interactions, which can lead to some
confusing behaviour.

## What Is A Promise?
WebdriverJS uses Promises for all of its interactions with a browser. In this context, a Promise is "an object that
represents a value, or the eventual computation of a value". They are a method of dealing with asynchronous code and if
you've used any modern JavaScript frameworks then you've probably come across them.

Promises have a ``then`` method which can be used to get the eventual return value of the operation. In this manner,
it's common to see something along the lines of:

{% highlight javascript %}
    externalService.getData().then(
        function(returnedData) {
            widget.setData(returnedData);
        }
    );
{% endhighlight %}

The widget is only updated with the data once it's been returned, and in addition, the call to get the data from the 
external service does not block.

In the realm of browser tests this could lead to a long chains of ``then`` functions, but WebdriverJS provides a Promise
Manager to get around that issue, thus ensuring that calls to the browser are run in sequence, and we only need to worry
about dealing with the Promises when we wish to do something with data from the page. 

In practice, this means that we can ignore the returned promises while interacting with the page, until such time as we
want to pass page data to something other then WebDriverJS. So, rather than having code which looks like this:

{% highlight javascript %}
    driver.get("http://www.testclient.com").then(function() {
        return driver.findElement(By.name("username"));
    }).then(function(u) {
        return u.sendKeys("user101");
    }).then(function() {
        return driver.findElement(By.name("password"));
    }).then(function(p) {
        return p.sendKeys("m1p4ssw0rd");
    }).then(function() {
        return driver.findElement(By.name("loginBtn"));
    }).then(function(loginBtn) {
        return loginBtn.click();
    });
{% endhighlight %}

We can have code that looks like this:

{% highlight javascript %}
    driver.get("http://www.testclient.com");

    var u = driver.findElement(By.name("username"));
    u.sendKeys("user101");

    var p = driver.findElement(By.name("password"));
    p.sendKeys(“m1p4ssw0rd”);

    var btn = driver.findElement(By.name(“loginBtn”));
    btn.click();
{% endhighlight %}

The slightly tricky part is when we went to extract values from the page in question, at which point we have to
explicitly handle the Promises ourselves:

{% highlight javascript %}
    driver.get("http://www.testclient.com");
    driver.getTitle().then(function(pageTitle) {
      console.log("The title is " + title);
    });
{% endhighlight %}

There's a good deal more information about this on the [WebdriverJS
page](https://code.google.com/p/selenium/wiki/WebDriverJs#Control_Flows), but as you might expect, it's still not
overly straightforward.

## Getting Set Up 
Getting set up to write these tests is easy enough; use your preferred method to install
[selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver), [mocha](https://www.npmjs.com/package/mocha),
[chai](https://www.npmjs.com/package/chai), and [chromedriver](https://code.google.com/p/selenium/wiki/ChromeDriver).

## The First Test
The intention with this test is to open a Chrome window, navigate to the Scott Logic Blog, and then assert that the
title is "Scott Logic Blog". I've read the WebDriverJS documentation on bridging between the Promise Manager and
assertions, so I know to use a ``then`` when getting the title of the page.

{% highlight javascript %}
    var webdriver = require("selenium-webdriver");
    var assert = require("chai").assert;

    describe("Demonstrating webdriver promises", function() {
        this.timeout(30000);
        var driver;

        before(function() {
            driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
        });

        after(function() {
            driver.quit();
        });

        it("I open the blog website", function() {
            driver.get("http://www.scottlogic.com/blog");
        });

        it("The title is 'Scott Logic Blog'", function() {
            // Since we want the title from the page, we need to manually handle the Promise
            driver.getTitle().then(function(title) {
                assert.equal(title, "Scot Logic Blog");
            };
        });
    });
{% endhighlight %}

If you run this test it will print a collection of nice, green ticks to the console so we must have done everything
right first time:

{% highlight bash %}
$ mocha test.js

  Demonstrating webdriver promises
    √ I open the blog website
    √ The title is 'Scott Logic Blog'


  2 passing (31ms)
{% endhighlight %}

Celebratory coffee time! But wait... it ran in 31ms? Come to think of it, I never saw a browser window open and as
awesome as my [Scott Logic desktop machine](http://www.scottlogic.com/careers/vacancies/) is, I don't think it's *that*
fast.

## Connecting Mocha and WebdriverJS

Let's look at the assertion that we have:

{% highlight javascript %}
    it("The title is 'Scott Logic Blog'", function() {
        // Since we want the title from the page, we need to manually handle the Promise
        driver.getTitle().then(function(title) {
            assert.equal(title, "Scot Logic Blog");
        };
    });
{% endhighlight %}

Although we're clearly asserting on the title of the blog, that assertion is only executed once WebdriverJS has
retrieved the title from the browser window, and we observed that the browser never appeared. The issue is that our
testrunner has no idea that we want to wait for a browser to appear, as the interactions with the browser are
non-blocking, remember? 

So how do we tell the testrunner to wait for a result? In this case, mocha is Promise-aware so we can simple return that
Promise from our test and rerun the test:

{% highlight javascript %}
    it("The title is 'Scott Logic Blog'", function() {
        // Since we want the title from the page, we need to manually handle the Promise
        return driver.getTitle().then(function(title) {
            assert.equal(title, "Scot Logic Blog");
        };
    });
{% endhighlight %}

{% highlight bash %}
    1) Demonstrating webdriver promises The title is 'Scott Logic Blog':
       AssertionError: expected 'Scott Logic Blog' to equal 'Scot Logic Blog'
{% endhighlight %}

Well, well! Our passing test was doubly wrong! After a bit of correcting, we have this passing test, which does wait for
a browser to appear and asserts correctly on the title:

{% highlight javascript %}
    it("The title is 'Scott Logic Blog'", function() {
        // Since we want the title from the page, we need to manually handle the Promise
        return driver.getTitle().then(function(title) {
            assert.equal(title, "Scott Logic Blog");
        };
    });
{% endhighlight %}

It's still not quite right, however, as the browser is left open after the test has completed despite the call to
``quit`` in the ``after`` block. By this point it probably won't surprise you to learn that it's because we're not
returning the Promise to mocha so it doesn't work as expected. In fact, we're also not returning the Promise from
``get`` either, and if you were to run the test you would see that mocha reports that ``it`` block as passed before the
browser has appeared.

## Broken Promises

These false positives are a problem I have with using WebDriverJS. It is very easy to miss out a return and leave
yourself with a bug-in-waiting, or a mysteriously passing test. Indeed, the final test is not very different to how we
started out; just three return keywords required.

{% highlight javascript %}
    var webdriver = require("selenium-webdriver");
    var assert = require("chai").assert;

    describe("Demonstrating webdriver promises", function() {
        this.timeout(30000);
        var driver;

        before(function() {
            driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
        });

        after(function() {
            return driver.quit();
        });

        it("I open the blog website", function() {
            return driver.get("http://www.scottlogic.com/blog");
        });

        it("The title is 'Scott Logic Blog'", function() {
            // Since we want the title from the page, we need to manually handle the Promise
            return driver.getTitle().then(function(title) {
                assert.equal(title, "Scot Logic Blog");
            };
        });
    });
{% endhighlight %}

The example test above uses a pattern we've established to help with broken Promises, which is to separate out each browser
interaction into an ``it`` block to ensure the spec output appears in sync with what's happening on screen. We've also
found that it helps with those pesky intermittent failures that plague browser testing suites, if only to help narrow
down which interaction failed.

## Possible Improvements
There's an [active project](https://github.com/jsdevel/webdriver-sync) which wraps the Java API in a JavaScript layer in
an attempt to avoid issues like this. I have not tried it yet, but if it also brings some of the Java API's extra
methods to my JavaScript testing then it could be a winner.

There is also a [chai-as-promised](https://github.com/domenic/chai-as-promised/) library which could improve readability
of our tests, and reduce the need to explicitly drop in and out of ``then`` blocks.

## Something Of A Conclusion

I can understand why WebdriverJS has gone with Promises; browser interaction is largely asynchronous, especially with
modern webapps using AJAX calls as opposed to testing older applications where you could just wait for a browser
refresh. However, hiding those Promises away, in my opinion, confuses matters, making it more difficult to get into a
flow when writing the tests. 























