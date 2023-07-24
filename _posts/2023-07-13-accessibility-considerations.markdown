---
title: Accessibility Considerations in the Software Development Process
date: 2023-07-13 12:57:00 Z
categories:
- UX Design
tags:
- accessibility
- ux design
- Inclusion
- Diversity
- Development
summary: In today's digital world, ensuring accessibility in software has become increasingly
  crucial. The practice of designing software that can be easily used by everyone,
  including individuals with disabilities, has significant implications for user experience,
  legal compliance, and business success. In this article, we will delve into the
  concept of accessibility, its importance, and explore practical considerations to
  integrate accessibility throughout the software development process. By prioritizing
  accessibility, we can create inclusive digital experiences that benefit all users
  and contribute to a more equitable society.
author: osharon
Image: "/uploads/Social%20Card-%20Accessibility%20in%20software%20development.png"
---

![A superhero in a wheelchair (source: midjourney)](/uploads/superhero.png)
As the world becomes more digitised, ensuring accessibility in software is increasingly important. Accessibility refers to the practice of designing software so that everyone, including disabled people, can access and use them easily and effectively. This involves creating services that are perceivable, operable, understandable, and robust. In this article, we'll explore what accessibility is, why it matters, and how we can address it in the software development process.

## Business smart

Accessible products benefit everyone. In 2000 Tesco undertook the challenge to improve the accessibility of its mobile application. By stripping away superfluous images and clearing text-link descriptions, they improved their service to all users. Under the principle that a user should be able to make a purchase of 30 items within 15 minutes (over a 56K connection), Tesco have enabled users with and without visual impairments to achieve this target[\[1\]](https://www.w3.org/WAI/business-case/archive/tesco-case-study). Tesco’s goal to optimise accessibility, both for desktop web and mobile browsers, translated to 350% increase in sales. The sales which stood at GBP 52 million in 2000, grew to £235 million in 2001 – just a year after its launch. As of 2021, Tesco still outranks many other retailers in ranking on the web for e-commerce. In the United Kingdom, online sales have rocketed to GBP 6.3 billion. Accessibility-driven marketplace offerings have helped Tesco gain this competitive advantage[\[2\]](https://codemantra.com/accessibility-higher-sales/).

## Risk Avoidance

If not for any other reason, it’s important to remember that accessibility is a legal requirement in many countries. For example, in the United States, the [Americans with Disabilities Act (ADA)](https://adata.org/learn-about-ada) requires that websites and digital applications be accessible to people with visual, auditory, motor, and cognitive impairments. Similarly, the European Union has the [Web Accessibility Directive](https://digital-strategy.ec.europa.eu/en/policies/web-accessibility), which requires public sector websites and mobile applications to be accessible to all users, including disabled people. Other countries, such as [Canada](https://www.canada.ca/en/employment-social-development/programs/accessible-people-disabilities/act-summary.html), [Australia](https://www.dta.gov.au/help-and-advice/digital-service-standard/digital-service-standard-criteria/9-make-it-accessible), and [Japan](https://www.w3.org/WAI/policies/japan/), also have laws or guidelines related to digital accessibility. These legal requirements often reference the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/) developed by the World Wide Web Consortium (W3C), which provide internationally recognized standards for web accessibility. WCAG is organised into different levels (A, AA, and AAA), with each level indicating a higher level of accessibility compliance. Failure to comply with these legal requirements, including WCAG standards, can result in legal action, fines, and reputational damage to organisations. In 2008, for example, Amazon was required to improve its website’s accessibility as part of a USD 6m lawsuit settlement with the National Federation of the Blind[\[3\]](https://www.ft.com/content/a9f6de62-785d-11dd-acc3-0000779fd18c).

![World-wide Accessibility Laws](/uploads/accessibility-world-map.jpg)

## Why organisations should prioritise accessibility

It is not likely that you will meet anyone who straight-forwardly opposes the idea of accessibility. However, it's more common to argue with those who de-prioritize it for various reasons and therefore worth tackling some of these arguments. One such argument can be that “Accessibility isn’t a priority for our users because we have no disabled users” or “The product is for internal use so there’s no need to put additional efforts on this aspect”. This of course leads to a chicken-and-egg situation where disabled people  wouldn’t be able to use the service (or join the company) even if they wanted.  Furthermore, it is likely that hidden disabilities go under the radar, and not everyone feels comfortable disclosing their disability status. It’s important to remember that accessibility benefits more users than anticipated and can help grow the market reach and improve company's reputation. Another argument can be that “Accessibility is too complicated, time-consuming or expensive”. Again, it’s important to remember that it’s much cheaper to tackle usability from day one and it is a worthwhile investment that can prevent negative consequences such as legal action, lost customers, or damage to reputation. Additionally, research suggests that businesses are missing out significantly by being inaccessible: Supermarket misses out £500 million monthly, while the banking and building sector misses nearly a billion pound every month[\[7\]](https://wearepurple.org.uk/the-purple-pound-infographic/).

## What makes a website accessible?

Web content accessibility can be looked at in four main aspects - Perceivability, Operability, understandability, and robustness. We will now describe them in detail.

### Perceivable

Out of the four, the first and the most obvious one is “Perceivable Information and User Interface”. This means that it should be possible to access information through various senses, such as sight, sound, or touch if relevant. We, as designers and developers, should consider how different users with various devices will experience the service. Using semantic html tags; providing proper text-descriptions to links and images can make your website much more accessible and usable. Verifying proper colour contrast can ease reading any available text. Responsive layout is also critical to ensure the service can be experienced properly on any screen size and allow users to zoom in,,as well as ensuring that the [front-end design takes into account user device settings](https://uxdesign.cc/why-designers-should-move-from-px-to-rem-and-how-to-do-that-in-figma-c0ea23e07a15).

### Operable

The second criteria worth considering is “Operable UI and Navigation”. This means that users should be able to interact with the software using various input methods, such as keyboard, mouse, or touch screen. Pointing devices, such as a mouse are inaccessible for many users, for various reasons and a keyboard can be an easily available alternative. Keyboard can also be useful for “super-user” who can use the mouse but prefer to use the keyboard for efficiency's sake. “Drag-and-drop” with no keyboard-utilising alternative can be a serious blocker when using the service.

### Understandable

The third criteria “Understandable Information and UI” is a often forgotten compared to the previous criteria, but equally as important. It means using [clear and concise language](https://www.plainlanguage.gov/about/definitions/), a simple layout, and keeping a consistent design throughout. A simple example for incomprehensible information would be over-use of professional acronyms without explanations in a service targeted to the general public.

### Robust

And finally, the service should provide “Robust Content and Reliable Interpretation” and follow web standards and be designed in a way that can be interpreted correctly by assistive technologies, such as screen readers, voice recognition software, or Braille displays. For example, using scalable REM size-units instead of PX will allow user to zoom-in without breaking the layout. Sticking to modern-day web-standard should take care of this issue, over-use of Javascript (client-side-based code) or bad software architecture can also make the service less reliable in this aspect.

A single page applications (SPA) are very likely to create accessibility issues that might have been resolved with the use of normal multi-page applications - Screen readers might not detect and announce all content changes and reloading the page might restart the user's journey, unless the issue was taken cared-of explicitly; Keyboard and screen-reader-focus might remain on the last focused element rather than moving to newly loaded content; Custom elements might negate the accessibility advantages of semantic HTML (for example, the screen-reader's capability to list all the page's links); The built-in browser’s “Back” / “Forward” buttons may not work as expected. All these can be resolved but they require additional consideration and development-time[\[4\]](https://www.tpgi.com/single-page-applications/).

## Overusing Javascript

Having the skills to code more accessibly can have benefits for other users, too; for example, [limiting your use of Javascript can make your application faster](https://www.youtube.com/watch?v=rxlJRydqmk8), and more reliable, even when Javascript is not available. There are plenty of reasons to assume the Javascript is not available for a service - be it because it didn’t finish loading properly, or was blocked by a corporate firewall or ISP, or the browser is not compatible with the version of Javascript-code[\[5\]](https://www.kryogenix.org/code/browser/everyonehasjs.html). In its guide, mozzilla warns explicitly to “keep unobtrusive JavaScript in mind when creating your content. The idea of unobtrusive JavaScript is that it should be used wherever possible to enhance functionality, not build it in entirely[\[6\]](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/CSS_and_JavaScript#javascript)”. This, of course, goes against the ideology of most javascript frameworks that manage the entire service in the javascript-code (such as React or Angular), but is being addressed with recent advancement such as server-side-rendering.

## Coding with accessibility in mind

Accessibility isn’t a feature that can be added at any point of product life-cycle or sprinkled-over once the product reaches its MVP. It is a set of considerations one must take from the planning stage and all the way through design, development and of course testing and maintenance. One shouldn’t expect to get it right on the first attempt - much like the user-research agile process, it is an iterative process that hopefully should become easier over time. Following are a list of simple tips to avoid the most common accessibility issues:

* Use semantic HTML to ensure that content is structured correctly and can be interpreted by assistive technologies.

* Use ARIA roles and attributes to provide additional context and meaning to UI elements.

* Provide alternative text for Images to allow users with visual impairments to understand the content of images. Additionally, avoid using <img> for purely decorative elements as to reduce screen-reader’s noise.

* Use descriptive link text to help users to understand the destination of links.

* Ensure users can navigate through the software by keyboard, not only mouse
  Ensure good colour contrast to ensure that text and UI elements are readable by everyone.

* Refrain from using JavaScript when possible to ensure that your software is accessible to users who cannot use JavaScript.

* Design responsively to ensure that your software is usable on a range of devices and screen sizes.

* Be wary of Emojis as it’s not always clear what information they are supposed to convey and might not work well if the application has a “dark mode”. When
  using emojis ensure you wrap them in a tag with alt text.

* Test with assistive technologies from beginning to end of the development cycle to ensure that the software can be used by disabled people.

## Testing your software

Ultimately, the ideal feedback comes from usability research with a broad demographic of users, including disabled people, but  even if circumstances don’t permit that, there is a wide array of tools that can help and provide feedback on how disabled users might experience your application. There are many free accessibility testing tools available online such as Google [Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/), [Accessibility Checker](https://www.accessibilitychecker.org/), [TAW](https://www.tawdis.net/#) or [Wave](https://wave.webaim.org/). Tools like [aXe devtools](https://www.deque.com/axe/devtools/) can be built into the pipeline/testing frameworks. Other solutions implemented at the organisational-level such as services like [SiteImprove](https://www.siteimprove.com/toolkit/accessibility-checker/) or [Tenon](https://tenon.io/) and will provide a broader view of inspection.

![Illustration of a complexed work environments (source: midjourney)](/uploads/work-env.png)

## In conclusion

Accessibility in software development is not only a moral imperative but also a legal requirement in many countries. Designing services, content and products that is perceivable, operable, understandable, and robust ensures that all users, including disabled peoples, can access and use digital services effectively. Accessible products have been shown to benefit everyone, as evidenced by the success of businesses like Tesco, which saw significant increases in sales by optimising accessibility in their online platforms. Additionally, adherence to accessibility standards is crucial to avoid legal action, fines, and reputational damage. As system-builders and service providers, we have a responsibility to prioritise accessibility in our software development processes to create inclusive and usable digital experiences for all users. By embracing accessibility as a core principle, we can contribute to a more inclusive and equitable world.