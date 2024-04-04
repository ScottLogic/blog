---
title: Different levels of automated accessibility testing
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

Accessibility is becoming an increasingly important consideration for web applications, yet it still often feels like a bit of an
afterthought in the development and testing process. Even the design team can be guilty of forgetting to ensure their work is accessible
for all users. Companies are starting to take accessibility more seriously, requiring their applications to pass certain standards
before they can be put live, but this is usually done right at the end by a separate team that don't necessarily fully understand the
full extend of the application, so things can get missed. Additionally retro-fitting accessibility can be a painful process. Wouldn't it
be better if we could find and fix things as we develop?

## Make it automatic

If we build accessibility testing into our automated tests (I'm assuming you have automated tests, if not, go sort that, then come back),
then we can catch problems as we develop and fix them as part of the process. We can then be aware of things we need to implement and
make sure we continue to implement them in future work, highlight required changes in design before stakeholders see and approve the work,
and just generally feel a lot more confident in our application's readiness for release.

## How do we do it?

There are a few different methods we can employ to test for accessibility in our automated tests. Some can be used at unit test level,
others will require a full end-to-end in-browser test. Lets take a look at them:

### Checking for compliance

#### Unit tests

Using tools such as [jest-axe](https://www.npmjs.com/package/jest-axe), or [vitest-axe](https://www.npmjs.com/package/vitest-axe) if
your trendy and cool, we can do general compatibility scans of the individual components to make sure they are compliant with our
required standards.

```typescript
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
```

This will perform a very simple test of rendering the button and making sure it doesn't have any accessibility violations. By default it
will check against the latest W3C standards, as well as best-practices but you can reduce the requirements if necessary. The package docs,
combined with the documentation for [axe-core](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#options-parameter) should help
you configure it to your needs.

We can also run this for different states of our component, for example, if our button changed markup when hovered;

```tsx
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
```

> N.B: colour contrast checks don't work in JSDom so we need to do extra testing to catch those.

We can also add more detailed checking for accessibility attributes by making use of the various
[queries](https://testing-library.com/docs/queries/about) and [assertions](https://github.com/testing-library/jest-dom) that are provided by
[Testing Library](https://testing-library.com).

```tsx
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
```

### End-to-End Tests

We can also perform these standards checks in our full end-to-end browser tests. [Axe](https://github.com/dequelabs/axe-core) has plugins
available for most browser testing frameworks that can be used to check a loaded browser page. Here's an example in
[Playwright](https://playwright.dev/) using the [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) plugin

```typescript
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
```

As with the button test this does a basic compatibilty scan of the entire page to make sure there are no accessibility violations. We can also do other interactions with the page to change the state and re-run our checks to make sure the DOM is still accessible just as we did with our button component.

## Keyboard navigation

Making sure our page is standard compliant is only half the battle, we've also got to make sure everybody can use it. For user's that are unable to use a mouse or trackpad, that means navigating with the keyboard.

We need to ensure 2 things;

1. All interactable elements are reachable and interactable with just the keyboard. That includes your footer links, I may actually want to read your Accessibility Policy.
2. The flow through the page makes sense. If I'm jumping from the header, to the submit button, to the footer then back to an input, I'm going to have a bad time.

Let's take a look at how we can do test this in our Playwright tests:

```typescript
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
```

This navigates through our page, checking it hits the links in the expected order and makes sure it can trigger the click handler for the button by pressing `Enter`. We can also test cursor navigation by pressing the arrow keys instead, e.g. `page.keyboard.press("ArrowLeft")`

## Speech readers

Lastly we come to speech readers, probably the trickiest, and most annoying, part to actually test, and until now, what I considered the holy grail of automated accessibility testing. Previously we either had to download a screen reader, like [NVDA](https://www.nvaccess.org/download/), or use built in OS tools like VoiceOver, turn them on and then try and navigate our web pages while trying not to go crazy as they read out every little thing our pointer touched, not to mention reading out our code as we type. There were ways round this, but it was still tricky to try and navigate the page and make sure the correct info was read out at each point.

Enter [Guidepup](https://www.guidepup.dev/), a screen reader driver for test automation (yes, I just copied their strapline). Guidepup gives us the ability to control either VoiceOver on OSX or NVDA on Windows as well as retrieving what the text they would read out for the current item is so we can validate them. It also comes with a [Virtual Screen Reader](https://www.guidepup.dev/docs/virtual) that we can use in our unit tests to test components in isolation.

Lets start with the Virtual Screen Reader;

~~~ tsx
import { render } from "@testing-library/react"
import {axe} from "vitest-axe"
import App from "./App"
import { virtual } from "@guidepup/virtual-screen-reader";

describe("App", () => {

  it("should be screen reader friendly", async (t) => {
    const {container} = render(<App/>)
    t.onTestFinished(async () => await virtual.stop())
    await virtual.start({container})
    await virtual.next() // Vite Link
    expect(await virtual.lastSpokenPhrase()).toEqual("link, Vite logo, Vite")

    await virtual.next() // Vite Logo
    await virtual.next() // End of Vite Link
    await virtual.next() // React Link

    expect(await virtual.lastSpokenPhrase()).toEqual("link, React logo, React")
    
    await virtual.next() // React Logo
    await virtual.next() // End of React Link
    await virtual.next() // End of banner
    await virtual.next() // Main content
    await virtual.next() // Heading
    expect(await virtual.lastSpokenPhrase()).toEqual("heading, Vite + React, level 1")

    await virtual.next() // Button
    expect(await virtual.lastSpokenPhrase()).toEqual("button, count is 0")
    await virtual.press("Enter")
    expect(await virtual.lastSpokenPhrase()).toEqual("button, count is 1")

    expect(await virtual.spokenPhraseLog()).toMatchSnapshot()

  })

})
~~~

As you can see, it's a little bit clunky as the screen reader insists on jumping through all the end tags and inner items, unlike tab navigation where we can set which things are interactable. We could use some `aria-hidden` attributes but that will only clear things like the logos, we'd still get the end tags. In reality we'd probably tidy this up with a reusable method to jump forward X amount of times but we're keeping it simple for today.

The Playwright integrations for VoiceOver and NVDA however, come with some more helpful methods to match in with the methods those applications actually have, such as 