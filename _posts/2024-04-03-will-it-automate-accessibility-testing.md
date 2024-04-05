---
title: Will It Automate? Accessibility Testing
date: 2024-04-03 00:00:00 Z
categories:
  - Testing
tags:
  - accessibility
  - automation
  - testing
author: wmckenzie
summary: Want to make sure your application is accessible? Here are some different ways you can use your automated tests to make sure.
---

I'm sure we've all been there, you've completed all your features, testers and product owners have signed them off, all critical bugs are resolved and you're ready for production. You've even passed PEN testing! There's just one last hurdle you've got to overcome... accessibility testing. It should be fine, right? You added alt text to your images and linked your labels with your inputs, you've got it covered... and then the report comes back. 

"Colour contrast isn't enough"?

"Can't submit form with keyboard"?

"Alerts not read out with screen reader"?

And they've only tested half the pages... this is going to be a nightmare to go back and fix across everything! Surely there's a better way?

Well, there is... and don't call me Shirley.... 

## Make it automatic

What if I told you that you could build accessibility testing into your automated test suites, so that you can make sure your pages and components are accessible from the start? You can catch any issues with design or navigation early on, ensuring that any future work avoids making the same mistakes and reducing the chance of having major changes to make at the last minute.

## How do we do it?

There are a few different things we want to test, and a few different methods we can use to test them. Some can be used at unit test level,
others will require a full end-to-end in-browser test. 

Let's take a look at them:

### Checking for compliance

#### Unit tests

Using tools such as [jest-axe](https://www.npmjs.com/package/jest-axe), or [vitest-axe](https://www.npmjs.com/package/vitest-axe) (if
you're trendy and cool), we can do general compatibility scans of the individual components to make sure they are compliant with our
required standards.

~~~typescript
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import Button from "./Button";

describe("Button", () => {
  it("should render an accessible button", async () => {
    const { container } = render(<Button title="Click Me">OK</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
~~~

This will perform a very simple test of rendering the button and making sure it doesn't have any accessibility violations. By default it
will check against the latest W3C standards, as well as best-practices, but you can reduce the requirements if necessary. The package docs,
combined with the documentation for [axe-core](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#options-parameter), should help
you configure it to your needs.

We can also run this for different states of our component, for example, if our button changed markup when hovered:

~~~tsx
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import Button from "./Button";

describe("Button", () => {
  it("should render an accessible button when hovered", async () => {
    const { container } = render(<Button title="Click Me">OK</Button>);
    await userEvent.hover(screen.getByRole("button", { name: "OK" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
~~~

> N.B: colour contrast checks don't work in JSDom so we need to do extra testing to catch those.

We can also add more detailed checking for accessibility attributes by making use of the various
[queries](https://testing-library.com/docs/queries/about) and [assertions](https://github.com/testing-library/jest-dom) that are provided by
[Testing Library](https://testing-library.com).

~~~tsx
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import Button from "./Button";

describe("Button", () => {
  it("should render an accessible button", async () => {
    const { container } = render(<Button title="Click Me">OK</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    const button = await screen.getByRole("button", { name: "OK" }); // Uses accessibility attributes to get a button with visible text OK
    expect(button).toBeInTheDocument();
    expect(button).toHaveAccessibleName();
    expect(button).toHaveAttribute("title", "Click Me");
  });
});
~~~

### End-to-End Tests

We can also perform these standards checks in our full end-to-end browser tests. [Axe](https://github.com/dequelabs/axe-core) has plugins
available for most browser testing frameworks that can be used to check a loaded browser page. Here's an example in
[Playwright](https://playwright.dev/) using the [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) plugin:

~~~typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const URL = "http://localhost:5173/";

test("is accessible", async ({ page }, testInfo) => {
  await page.goto(URL);

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  await testInfo.attach("accessibility-scan-results", {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: "application/json",
  });

  expect(accessibilityScanResults.violations).toEqual([]);
});
~~~

As with the button test, this does a basic compatibility scan of the entire page to make sure there are no accessibility violations. We can also do other interactions with the page to change the state and re-run our checks to make sure the DOM is still accessible, just as we did with our button component.

## Keyboard navigation

Making sure our page is standard compliant is only half the battle, we've also got to make sure everybody can use it. For users that are unable to use a mouse or trackpad, that means navigating with the keyboard.

We need to ensure 2 things:

1. All interactive elements are reachable and interactable with just the keyboard. That includes your footer links, I may actually want to read your Accessibility Policy.
2. The flow through the page makes sense. If I'm jumping from the header, to the submit button, to the footer then back to an input, I'm going to have a bad time.

Let's take a look at how we can do test this in our Playwright tests:

~~~typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const URL = "http://localhost:5173/";

test("is navigatable", async ({ page }) => {
  await page.goto(URL);

  const header = page.locator('header[role="banner"]');
  await header.waitFor();

  await page.keyboard.press("Alt+Tab"); //Using Alt+Tab to enable tab navigation in WebKit
  await expect(await page.getByRole("link", { name: "Vite" })).toBeFocused();

  await page.keyboard.press("Alt+Tab");
  await expect(await page.getByRole("link", { name: "React" })).toBeFocused();

  await page.keyboard.press("Alt+Tab");
  const button = await page.getByRole("button");
  await expect(button).toBeFocused();
  await expect(button).toHaveText("count is 0");

  await page.keyboard.press("Enter");
  await expect(button).toBeFocused();
  await expect(button).toHaveText("count is 1");
});
~~~

This navigates through our page, checking it hits the links in the expected order and makes sure it can trigger the click handler for the button by pressing `Enter`. We can also test cursor navigation by pressing the arrow keys instead, for example `page.keyboard.press("ArrowLeft")`. This is usually required for navigating radio groups or dropdowns.

## Speech readers

Lastly we come to speech readers, probably the trickiest (and most annoying), part to actually test, and until now, what I considered the holy grail of automated accessibility testing. Previously, we either had to download a screen reader, like [NVDA](https://www.nvaccess.org/download/), or use built in OS tools like VoiceOver, turn them on, then try to navigate our web pages whilst trying not to go crazy as they read out every little thing our pointer touched, not to mention reading out our code as we type. There were ways round this, but it was still awkward to try to navigate the page and make sure the correct info was read out at each point.

Enter [Guidepup](https://www.guidepup.dev/), a screen reader driver for test automation (yes, I just copied their strapline). Guidepup gives us the ability to control either VoiceOver on OSX or NVDA on Windows, as well as retrieving the text that would be read out for items so we can validate them. It also comes with a [Virtual Screen Reader](https://www.guidepup.dev/docs/virtual) that we can use in our unit tests to test components in isolation.

Let's start with the Virtual Screen Reader:

~~~tsx
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import App from "./App";
import { virtual } from "@guidepup/virtual-screen-reader";

describe("App", () => {
  it("should be screen reader friendly", async (t) => {
    const { container } = render(<App />);
    t.onTestFinished(async () => await virtual.stop());
    await virtual.start({ container });
    await virtual.next(); // Vite Link
    expect(await virtual.lastSpokenPhrase()).toEqual("link, Vite logo, Vite");

    await virtual.next(); // Vite Logo
    await virtual.next(); // End of Vite Link
    await virtual.next(); // React Link

    expect(await virtual.lastSpokenPhrase()).toEqual("link, React logo, React");

    await virtual.next(); // React Logo
    await virtual.next(); // End of React Link
    await virtual.next(); // End of banner
    await virtual.next(); // Main content
    await virtual.next(); // Heading
    expect(await virtual.lastSpokenPhrase()).toEqual(
      "heading, Vite + React, level 1"
    );

    await virtual.next(); // Button
    expect(await virtual.lastSpokenPhrase()).toEqual("button, count is 0");
    await virtual.press("Enter");
    expect(await virtual.lastSpokenPhrase()).toEqual("button, count is 1");

    expect(await virtual.spokenPhraseLog()).toMatchSnapshot();
  });
});
~~~

As you can see, it's a little bit clunky as the screen reader insists on jumping through all the end tags and inner items, unlike tab navigation where we can set which things are interactable. We could use some `aria-hidden` attributes, but that will only clear things like the logos, we'd still get the end tags. In reality we'd probably tidy this up with a reusable method to jump forward X amount of times, but we're keeping it simple for today.

The Playwright integrations for VoiceOver and NVDA however, come with some more helpful methods that mimic the built in methods and commands found in each application, such as `findNextHeading` or `findNextControl`. We can use these to streamline our navigation around the page, and more closely resemble how an actual user would be interacting with our application while using a screen reader. According to Guidepup's documentation, any command that VoiceOver or NVDA support, they support.

Let's try that same test, but with Playwright and VoiceOver:

~~~ typescript
import { voiceOverTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";

test("I can navigate the page", async ({ page, voiceOver }) => {
  test.setTimeout(3 * 60 * 1000);
  // Navigate to Guidepup GitHub page
  await page.goto("http://localhost:5173", {
    waitUntil: "load",
  });

  // Wait for page to be ready
  const header = page.locator('header[role="banner"]');
  await header.waitFor();

  // Interact with the page
  await voiceOver.navigateToWebContent();

  while ((await voiceOver.itemText()) !== "Vite + React heading level 1") {
    await voiceOver.perform(voiceOver.keyboardCommands.findNextHeading);
  }

  await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);
  expect(await voiceOver.itemText()).toBe("count is 0 button");

  await voiceOver.perform(
    voiceOver.keyboardCommands.performDefaultActionForItem
  );
  expect(await voiceOver.itemText()).toBe("count is 1 button");

  // Assert that the spoken phrases are as expected
  expect(JSON.stringify(await voiceOver.spokenPhraseLog())).toMatchSnapshot();
});
~~~

We can already see that's looking a little cleaner, the unusual React App default layout aside. If we wanted to make it a little closer to the previous example, we could use `findNextDifferentItem` instead and navigate through the items until we get to the button.

Setting this up is a little more involved, but Guidepup has some pretty good [instructions](https://www.guidepup.dev/docs/intro) to help you get everything configured, including how to get it working on your CI/CD server.

In short, you'll need to run 

~~~
npx @guidepup/setup
~~~

To configure your local screen reader tool and set up the permissions. Then it's just a case of installing the package and updating your Playwright config. If that's not working for you, you can also go through the [manual setup](https://www.guidepup.dev/docs/guides/manual-voiceover-setup). 

> Be aware, you will likely still hear your screen reader while your tests are running. I still haven't figured out how to stop this as Guidepup seems to override OS settings.

In all honesty, in my brief experience of using it, it's a bit flakey. I think some of that may be down to running it locally and it trying to control my OS which may have other stuff going on. I haven't had chance to try it on CI/CD yet, but that might be a bit more reliable given proper resource. That being said, it's definitely a huge improvement over what we had previously... which was nothing.

## In Conclusion

So that was a very brief tour of what's available but hopefully I've given you a few more options to enhance your automated testing and help ensure your site or application is accessible right from the get-go. Admittedly my examples are pretty basic, and probably aren't the most thorough tests of accessibility. However, hopefully they demonstrate some of the potential, enabling someone with a much better understanding of accessibility testing than I to build that into their automated test suite. The linked in documentation should give you much more info and you can also check out my [example repo](https://github.com/OiNutter/automated-accessibility) that the code samples are pulled from.