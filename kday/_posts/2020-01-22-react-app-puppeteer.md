---
published: true
author: kday
layout: default_post
category: Tech
title: Adding Puppeteer to create-react-app generated projects
summary: >-
  This post looks at adding Puppeteer to a create-react-app generated app, and shows how easy it is to get Puppeteer up and running.
tags: 'Puppeteer, Jest, React App, UI Automation'
---

This post extends a previous [blog post by Chris Price](https://blog.scottlogic.com/2017/08/24/adding-webdriver-tests-to-create-react-app-generated-projects.html), and looks at adding Puppeteer to a `create-react-app` generated app. It follows the same structure – Jest test runner, modern JavaScript features, similar architecture – and shows how easy it is to get Puppeteer up and running.

[The companion project can be found on GitHub](https://github.com/KyleADay/react-app-puppeteer).

### Contents
* [Why Puppeteer?](#why-puppeteer)
* [Running Specs](#running-specs)
* [Writing Specs and Page Objects](#writing-specs-and-page-objects)
* [Adding to an Existing Project](#adding-to-an-existing-project)

### Why Puppeteer?

Puppeteer is a powerful tool for UI automation. Developed by Google, Puppeteer controls Chromium or Chrome through a high-level API. It runs headless by default but can easily be configured to run in a browser.

There are a couple of limitations – Puppeteer is JavaScript-only (it’s a node.js library), and currently limited to Chromium or Chrome (though at time of writing there is an experimental `puppeteer-firefox` package).

However, it offers much faster and less-flaky browser automation than Selenium-Webdriver. An in-depth comparison between Puppeteer and Selenium can be found in [Mehdi Ridene’s post](https://blog.scottlogic.com/2020/01/13/selenium-vs-puppeteer.html).

### Running Specs
To see Puppeteer in action, let's take a look at a sample project. If you want to skip this section and add this set-up to your current project, you can jump to [Adding to an Existing Project](#adding-to-an-existing-project). 

Open a new terminal and run –

~~~bash
$ git clone https://github.com/kyleaday/react-app-puppeteer
$ cd react-app-puppeteer
$ npm install
~~~

This project uses `puppeteer` and `jest-puppeteer` as its dev dependencies. `jest-puppeteer` gives all the necessary configuration to hook-up Jest with Puppeteer. To set it up, there are two important configuration files.

The first one to look at is `jest.config.js`. It’s necessary to include `preset: “jest-puppeteer”` as a module export. Once set, Jest is ready to run tests with Puppeteer. Note that globals can also be set in this file.

~~~js
//e2e/jest.config.js

module.exports = {
  preset: "jest-puppeteer",
  globals: {
    URL: "http://localhost:3000"
  },
  //...
};
~~~

The second configuration file is `jest-puppeteer.config.js`. This allows custom configuration options, such as turning off headless mode, enabling slowMo for easier debugging, specifying server settings, etc.

~~~js
//e2e/jest-puppeteer.config.js

module.exports = {
  launch: {
    headless: false,
    slowMo: 300
  }
};
~~~

Now we’re set-up, we can run some tests. Let’s start the app –

~~~bash
$ npm start
~~~

And open a new terminal to run the tests –

~~~bash
$ npm run e2e
~~~

Looking at the script in the `package.json`, `e2e` runs `cd e2e && jest`. This changes our directory to `e2e` so jest can use the correct configuration files.

Jest-puppeteer automatically starts a server when the tests are run, and it closes the server when the tests have finished, so there is no need to do this manually.

As we've set the config to not run headless, the browser will open, and the tests can be seen in action.

### Writing Specs and Page Objects

This project follows the page object model, which aims to separate the UI structure from the specs or tests. Spec files can be found in `e2e/specs`, and the accompanying page objects are in `e2e/pageObjects`. Let’s look at the spec and page object for `app.js` –

~~~js
//e2e/specs/app.js

import { getIntroText, getLinkText } from "../pageObjects/app";
import { load } from "../pageObjects/index";

describe("React App", () => {
  beforeEach(async () => {
    await load();
  });

  it("should show the correct intro", async () => {
    expect(await getIntroText()).toBe("Edit src/App.js and save to reload.");
  });

  it("should show the correct link", async () => {
    expect(await getLinkText()).toBe("Learn React");
  });
});
~~~

This spec imports the `load` method and the functions `getIntroText` and `getLinkText` from the page object files. 

It uses [Jest API globals](https://jestjs.io/docs/en/api) - `describe` groups the tests and `beforeEach` loads the browser before each test. The `it` method runs the tests and `expect` is used to access [validation matchers](https://jestjs.io/docs/en/expect), in this case `toBe`. 

Note that the keyword `await` ensures that methods and functions resolve before running the next line.

Using the page object model makes the spec easy to read – it loads the page, gets the text and checks the actual text matches the expected text.

Examining the page object shows how we are using Puppeteer  –

~~~js
//e2e/pageObjects/app.js

import { root } from './index';

const introSelector = '.App-header > p';
const linkSelector = '.App-link';

export const getIntroText = async () => {
  const app = await root();
  return await app.$eval(introSelector, el => el.innerText);
}

export const getLinkText = async () => {
  const app = await root();
  return await app.$eval(linkSelector, el => el.innerText);
}
~~~

The Puppeteer API has classes with methods that allow us to interact with a page. In this example, we've created an `elementHandle` instance from our `app` page object. This allows us to use the method `elementHandle.$eval(selector, pageFunction[,…args]`, rewritten as `app.$eval(introSelector, el => el.innerText)`. We are using CSS selectors and the `innerText` pageFunction to evaluate the selector and return its inner text.

Separating the selectors and methods adds to further readability and makes the tests easier to maintain.

There are many more classes and methods with Puppeteer, and a full list can be found [here](https://pptr.dev/). Puppeteer can automate most browser interactions, such as filling out forms, entering keystrokes, moving the mouse, tapping a touchscreen, and more.

### Adding to an existing project:

To use this set-up on existing projects –

* Copy the e2e folder into the root of the project -

~~~bash
$ cp -r react-app-puppeteer/e2e <react-app>
~~~

* Install the additional dev dependencies -

~~~bash
$ npm install --save-dev puppeteer jest-puppeteer
~~~

* Install TypeScript declarations (optional, but useful as it provides auto-complete even if you're using JavaScript) -

~~~bash
$ npm install @types/puppeteer @types/jest-environment-puppeteer @types/expect-puppeteer
~~~

* Add the following script in the project’s `package.json` -

~~~js
{
  // ...
  "scripts": {
    // ...
    "e2e": "cd e2e && jest",
  }
}
~~~

### Further testing

As seen in this example, Puppeteer is easy to set-up for UI automation. This post covers the basics to get you started. Puppeteer can also be used to generate screenshots and PDFs, test Chrome Extensions, emulate mobile devices, measure performance, and more. So now you're all set-up, there is much more testing to explore with Puppeteer.
