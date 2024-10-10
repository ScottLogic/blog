---
title: 'Elevate Your Accessibility Testing: 10 Key Steps and 5 Inclusive Strategies'
date: 2024-10-09 11:00:00 Z
categories:
- Testing
tags:
- Accessibility
- Inclusivity
- Diversity
- Usability
summary: An overview of the essential points to look out for while testing for accessibility,
  resources for further learning, plus a couple of extra ways to look out for not
  just accessibility but also diversity issues in testing.
author: kcoombes
---

# Elevate Your Accessibility Testing
10 Key Steps and 5 Inclusive Strategies to help you raise your game

I am often asked by colleagues and clients about accessibility testing, as it is something I have done on many occasions as part of my job as a tester.

Even today, it is still an area of testing that often isn’t taught about in either university or on testing courses, yet it’s so important to make sure that software is useful to a wide range of users with diverse needs, as there is no such thing as ‘a typical end user’, so it doesn’t make any sense to exclude potential users because the software isn’t built or designed in a way that is accessible to them.

It is a wide-ranging topic, but here I will give an overview of ten essential points to look out for while testing for accessibility, resources for further learning, plus a couple of extra ways to look out for not just accessibility but also diversity issues in testing.

## Accessibility - 10 Key Steps

**1. Understand Accessibility Standards**

Read and understand the main accessibility guidelines, such as the Web Content Accessibility Guidelines (WCAG). These provide the basics of best practice for creating accessible content and user interfaces and thoroughly understanding the guidelines will allow you to carry out better and more targeted testing.

**2. Proper HTML Usage**

Make sure that your user interface uses proper HTML elements for their intended purpose. For example, use the correct tags and nesting for headings, make sure buttons and links are clearly tagged. This helps screen readers and similar tools to navigate the content better.

**3. Keyboard Navigation**

Test moving through and operating your user interface using only the keyboard. Make sure that all interactive elements (links, buttons, forms) can be accessed and used without a mouse. This is crucial for users with different mobility-related needs and users who prefer keyboard navigation.

**4. Text Alternatives for Images**

Provide descriptive alt text for all images. This allows screen readers to convey the content of images to users who are visually impaired.

**5. Colour Contrast**

Make sure that that text has sufficient contrast against its background. Poor contrast can make it difficult for users with visual impairments to read content. Use tools to check for contrast ratios that meet WCAG standards.

![Illustration of a person in a wheelchair accessing a building via a ramp](/_uploads/accessible_office.jpg)

**6. Responsive Design**

Test your user interface on different devices and screen sizes to make sure that it is accessible on mobile phones, tablets, and desktops. This helps users who may need to zoom in or use larger text.

**7. Form Labels and Instructions**

Make sure that every form field has a clear and descriptive label. For example, instead of just “Name,” use “Full Name” if that is what is required. They should make sense in isolation, and not require context to make sense. Make sure that that error messages are easy to understand, sensibly placed, and indicate how to correct the error.

**8. Test with Screen Readers**

Use screen readers (like NVDA, JAWS, or VoiceOver) to navigate your user interface. This helps you understand how your site is experienced by users who rely on these tools.

**9. Avoid Automatic Content Changes**

Avoid automatically updating content (like moving carousels or pop-ups) without user input, as it can be disorienting for users with disabilities. If you must use these features, make sure that there are controls to pause or stop them, and that the user is informed on the page about what will happen.

**10. Continuous Learning and Testing**

Accessibility is an ongoing process. Regularly test your user interface as you make updates and stay informed about evolving accessibility standards and best practices.

These basics will help you start thinking about accessibility from the very beginning of your project and make sure that your software or site is more inclusive.

***

## Inclusivity - 5 Additional Checks

One way to elevate your testing and take it to the next level is not only to carry out thorough accessibility testing, but also assess your product for wider Diversity and Inclusion considerations. Creating software that is diversity-friendly involves considering a wide range of user needs, backgrounds, and experiences. 

Here are some tips to help make your software more inclusive and accommodating to diverse users:

**1. Language and Terminology**

Use gender-neutral language - avoid using gendered terms in user interfaces e.g., use terms like “they/them” instead of “he/him” or “she/her” to be more inclusive of diverse gender identities. Additionally, using the term ‘partner or spouse’ rather than ‘husband’ or ‘wife’ will improve inclusivity.

**2. Localisation and Clarity**

Make sure that your software supports multiple languages and cultural contexts. This includes date formats, currency symbols and text direction. Use clear, simple language that can be understood by non-native speakers and people with varying literacy levels, avoiding jargon and slang.

**3. Diverse Representation**

Use images, icons, and illustrations that reflect a diverse and inclusive range of people, including different ethnicities, ages, orientations, abilities, and gender expressions. Be mindful of not reinforcing harmful stereotypes in your visual and textual content.

![Illustration of three people with laptops working together around a table](/_uploads/diverse_office.jpg)


**4. Privacy and Safety**

Read over the information being requested in the site or system and sense check that everything being asked for is necessary and relevant for the purpose of the system being tested. Allow users to control how much personal information they share, for example, they should be able to use avatars instead of real photos.

**5. Support for Multiple Learning Styles**

Offer tutorials, tooltips, videos, and text instructions to cater to different learning styles. Provide both basic and advanced interfaces or features so that users of varying skill levels can use your software comfortably.

**In Summary**

By incorporating these tips, you can create software and sites that better serve a broad spectrum of users, making the result more welcoming, usable, and respectful of diversity. However, the most effective way to naturally lead to more inclusive software is to encourage diversity within the development team - to bring in a variety of perspectives and experiences.

Involve people from diverse backgrounds in the design process and make space for underrepresented voices and viewpoints in all parts of the design, development, and testing processes.

Additionally, provide training and resources for your team on topics such as unconscious bias, cultural sensitivity, and accessibility. 

***

## Additional Resources

Each of these tools and resources is geared toward making accessibility testing more manageable and helping teams create digital products that work for everyone.

**Standards & Guidelines**

[Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)

The WCAG outlines the global standard for web accessibility. These guidelines define how to make web content more accessible to people with disabilities.

[ARIA (Accessible Rich Internet Applications)](https://www.w3.org/TR/wai-aria/)

Defines ways to make web content and applications more accessible, especially for dynamic content and advanced user interface controls developed with HTML, JavaScript, and related technologies.

**Tools for Automated Accessibility Testing**

[WAVE Accessibility Evaluation Tool](https://wave.webaim.org/)
WAVE is a suite of evaluation tools that help authors make their web content more accessible to individuals with disabilities.

[Axe Accessibility Tools](https://www.deque.com/axe/)
A comprehensive set of tools to integrate accessibility checks into the workflow.

[Lighthouse (Google)](https://developer.chrome.com/docs/lighthouse/overview/)
Lighthouse is an open-source, automated tool for improving the quality of web pages, including accessibility.

[Accessibility Insights](https://accessibilityinsights.io/)
A set of free, open-source tools to help find and fix accessibility issues in web and desktop applications.

**Screen Readers and Testing Tools**

[NV Access](https://www.nvaccess.org/)
A free, open-source screen reader for Windows.

[JAWS (Job Access With Speech)](https://www.freedomscientific.com/products/software/jaws/)
One of the most widely used screen readers for Windows.

[VoiceOver](https://support.google.com/accessibility/android/answer/6007100?hl=en)
Built-in screen reader for macOS and iOS.

[TalkBack](https://support.google.com/accessibility/android/answer/6007100?hl=en)
Screen reader for Android devices.

**Browser Extensions**

[axe DevTools Browser Extension](https://www.deque.com/axe/browser-extensions/)
Provides instant accessibility feedback in Chrome and Firefox.

[HeadingsMap](https://addons.mozilla.org/en-US/firefox/addon/headingsmap/)
A Firefox extension that helps visualize the structure of headings on a webpage, a key aspect of accessibility.

**Accessibility Communities & Forums**

[WebAIM](https://webaim.org/)
WebAIM provides resources, training, and guidelines to make web content accessible to people with disabilities.

[The A11Y Project](https://www.a11yproject.com/)
A community-driven effort to make digital accessibility easier, offering a range of resources including checklists, articles, and testing tips.

[Inclusive Design Principles](https://www.designcouncil.org.uk/fileadmin/uploads/dc/Documents/the-principles-of-inclusive-design.pdf)
A set of principles for developing accessible and inclusive web design practices.

**Colour and Contrast Testing Tools**

[Colour Contrast Analyzer](https://developer.paciellogroup.com/color-contrast-checker/)
A downloadable tool for testing colour contrast, ensuring readability and compliance with WCAG standards.

[Accessible Colours](https://accessible-colors.com/)
A simple tool to find colour combinations that are accessible and compliant with WCAG.

**Mobile Accessibility Testing**

[Android Accessibility Scanner](https://support.google.com/accessibility/android/answer/6376570?hl=en)
Google’s Accessibility Scanner helps find and fix accessibility issues in Android apps.

[iOS Accessibility Inspector](https://developer.apple.com/videos/play/wwdc2019/254/)
A tool built into iOS for checking the accessibility of apps.

**Other Useful Resources**

[A11Y Style Guide](https://a11y-style-guide.com/style-guide/)
A free resource for developing accessible web design and code patterns.

**Images Used in Blog Post**

[Freepik](www.freepik.com)

