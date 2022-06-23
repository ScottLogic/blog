---
published: true
author: mstobbs
layout: default_post
category: Tech
title: The 6 Most Common Accessibility Problems (and How to Fix Them)
tags: a11y accessibility WCAG
image: mstobbs/assets/6-most-common-accessibility-problems/increase-colour-contrast.png
summary: >-
  Accessibility is essential to provide a high-quality experience for all of your
  users. However, it can be easy for failures to slip into our applications. In this
  post, we'll look at the six most common accessibility problems and discuss why
  they matter and how they can be fixed.
---

<style>
  .media-container {
    justify-content: center;
    display: flex;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .media-container > * {
    margin: 0.5rem 1rem;
  }

  .media-container > table {
    border: 2px solid #252525;
  }
  
  .low-contrast-explanation:hover {
    color: #b6b6b6;
  }

  .low-contrast-example {
    padding: 24px;
    font-size: 1.75rem;
    font-weight: 400;
    line-height: 1.235;
    letter-spacing: 0.00735em;
  }

  .low-contrast {
    color: #f2f2f2;
    background-color: #808dd1;
  }

  .high-contrast {
    color: #fff;
    background-color: #3f51b5;
  }

  .example-with-caption {
    display: flex;
    flex-direction: column;
  }

  .caption {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }

  .plus-button {
    color: #fff;
    background-color: #3f51b5;
    font-size: 1.5rem;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    padding: 8px;
    min-width: 64px;
    line-height: 1.75;
    border-radius: 4px;
    cursor: pointer;
  }

  .default-post .post-content .media-container > .twitter-link {
    color: #3f51b5 !important;
    flex: 0 0 auto;
    padding: 12px;
    overflow: visible;
    font-size: 1.5rem;
    text-align: center;
    border-radius: 50%;
    border-bottom: 0 !important;
    background-color: transparent !important;
  }

  .twitter-icon {
    fill: currentColor;
    width: 1em;
    height: 1em;
    display: inline-block;
    font-size: 1.5rem;
    flex-shrink: 0;
    user-select: none;
  }
</style>

> "The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect."

> _- Tim Berners-Lee, W3C Director and inventor of the World Wide Web_

For the past two years, [WebAIM](https://webaim.org/) has performed an [accessibility evaluation](https://webaim.org/projects/million/) of the home pages of the top 1,000,000 web sites. Their results show that accessibility errors are still incredibly prevalent, even on popular web sites.

- "Across the one million home pages, 60,909,278 distinct accessibility errors were detected — an average of 60.9 errors per page."
- "Users with disabilities would expect to encounter detectable errors on 1 in every 14 home page elements with which they engage."

In total, 98.1% of home pages had detectable [WCAG 2](https://webaim.org/standards/wcag/checklist) failures - an increase from 97.8% the year before.

As part of their analysis, WebAIM shared what the six most common WCAG failures were.

<div class="media-container" >
<table>
	<caption>Most common types of WCAG 2 failures</caption>
	<tbody>
    <tr><th>WCAG Failure Type</th><th>% of home pages in Feb 2020</th><th>% of home pages in Feb 2019</th></tr>
    <tr><td><a href="#low-contrast-text">Low contrast text</a></td><td>86.3%</td><td>85.3%</td></tr>
    <tr><td><a href="#missing-alternative-text-for-images">Missing alternative text for images</a></td><td>66.0%</td><td>68.0%</td></tr>
    <tr><td><a href="#empty-links-and-empty-buttons">Empty links</a></td><td>59.9%</td><td>58.1%</td></tr>
    <tr><td><a href="#missing-form-input-labels">Missing form input labels</a></td><td>53.8%</td><td>52.8%</td></tr>
    <tr><td><a href="#empty-links-and-empty-buttons">Empty buttons</a></td><td>28.7%</td><td>25.0%</td></tr>
    <tr><td><a href="#missing-document-language">Missing document language</a></td><td>28.0%</td><td>33.1%</td></tr>
  </tbody>
</table>
</div>

In this post, I will describe each of these failures, and answer why they are important and how we can fix them. Live demos for each of the failures can be seen with the [demo app](https://mattstobbs.github.io/common-accessibility-failures/low-contrast-text).

## Low Contrast Text

> "On average, home pages had 36 distinct instances of low-contrast text."

> _- [The WebAIM Million](https://webaim.org/projects/million/)_

Web sites should have a high colour contrast between all text and the background colour behind it. In other words, the brightness of the text shouldn't be too close to the background brightness.

<p class="low-contrast-explanation">Low contrast text makes it more difficult for the reader to distinguish the shapes and edges of the characters, reducing reading speed and reading comprehension. This problem is emphasised as the text size decreases, making this issue increasingly important as the number of mobile users continues to grow.</p>

*(Try hovering your mouse over the previous paragraph to see for yourself.)*

The difficulties with low contrast text are magnified for those who experience low vision. [One in twelve](https://dequeuniversity.com/rules/axe/3.5/color-contrast) people cannot see the full spectrum of colours. Many older people lose contrast sensitivity from ageing. A person with low vision will be unable to read text which is against a background without sufficient contrast.

### How to fix it

One of the reasons low contrast text is so common is that it's so hard to detect. When writing or reviewing some code, you may see the text has a hex value of `#f2f2f2`, and the background has a value of `#808dd1`. Is that a sufficient colour contrast? Even checking how it looks on screen, it's hard to determine whether the contrast is sufficient for those with low vision or on smaller screens.

  <div class="media-container">
    <div class="low-contrast-example low-contrast">Hello World</div>
  </div>

Fortunately, there are several tools which can measure the colour contrast automatically and highlight any which fail to meet the success criterion.

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is a tool created by Google and is already built into the browser if you're using Google Chrome (there are also browser extensions for other browsers). [Running an audit](https://developers.google.com/web/tools/lighthouse/#devtools) will generate a report which will flag the accessibility issues on the web site. It will list any elements it detects whose text background and foreground colours don't have a sufficiently high contrast ratio.

<div class="media-container" >
<img src="{{ site.baseurl }}/mstobbs/assets/6-most-common-accessibility-problems/lighthouse-failure.png" alt="Accessibility error report generated by Lighthouse" title="Accessibility error report generated by Lighthouse">
</div>

Once you're aware of the elements which fail to meet the success criteria, you can adjust the background and foreground colours to increase the contrast.

There are multiple [colour contrast analysers](https://dequeuniversity.com/rules/axe/3.5/color-contrast) which can help you find two colours with sufficient contrast. If you are using Google Chrome, you can use the [Chrome DevTools' colour picker](https://web.dev/color-contrast/?utm_source=lighthouse&utm_medium=devtools#how-to-ensure-text-has-sufficient-color-contrast), which will display two white lines to show the AA and AAA thresholds.

<div class="media-container" >
<img src="{{ site.baseurl }}/mstobbs/assets/6-most-common-accessibility-problems/color-picker.png" alt="Picking colours with sufficient contrast with Chrome DevTools" title="Picking colours with sufficient contrast with Chrome DevTools">
</div>

WCAG defines [the success criterion](https://www.w3.org/TR/WCAG21/#contrast-minimum) for text contrast as a contrast ratio of 4.5:1. For our Hello World example above, we can see that the colour contrast is only 2.82, which doesn't reach the threshold. By increasing the contrast, we can improve the readability and accessibility of the element.

  <div class="media-container">
    <div class="example-with-caption">
      <div class="low-contrast-example low-contrast">Hello World</div>
      <div class="caption">❌ Contrast ratio 2.82</div>
    </div>
    <div class="example-with-caption">
      <div class="low-contrast-example high-contrast">Hello World</div>
      <div class="caption">✅ Contrast ratio 6.87</div>
    </div>
  </div>

## Missing Alternative Text for Images

> "31.3% of all home page images (12 per page on average) had missing alternative text...

> "These data show that one can expect nearly half of the images on the web to have missing, questionable, or repetitive alternative text."

> _- [The WebAIM Million](https://webaim.org/projects/million/)_

All images should have alternative text to convey their meaning to screen reader users.

A screen reader is used by those who are blind or visually impaired. It transmits the visual information on the screen in another form, such as by reading the text aloud.

Screen readers have no way of translating an image into words. Therefore, it is necessary to give each image a short, descriptive alternative text which will be used by the screen reader to convey the image's content and purpose.

### How to fix it

Alternative text should be short and descriptive. It should describe the image's content and purpose while avoiding any irrelevant details which will dilute the useful details.

There are three main ways to add alternative text to an image:

1. If the image is shown using an `img` tag, you can use the `alt` attribute.
2. If the image is shown with another tag, such as the background image of a `div`, you can use the `aria-label` attribute.
3. If the image is described by the content of another element, you can use the `aria-labelledby` attribute.

~~~html
<!-- ❌ Missing alternative text -->
<img src="cow.jpg" />

<div class="cool-bg-image" />

<div class="another-cool-bg-image" aria-labelledby="non-existent" />

<!-- ✅ With alternative text -->
<img src="cow.jpg" alt="a sad seal" />

<div class="cool-bg-image" aria-label="an angry alligator" />

<div class="another-cool-bg-image" aria-labelledby="my-label" />
<div id="my-label">a happy hyena</div>
~~~

If an image is purely decorative, you can give the image an alternative text of `""` to indicate to the screen reader that it shouldn't be read aloud. This stops the screen reader reading out information that isn't useful.

~~~html
<img src="decoration.jpg" alt="" />
~~~

## Empty Links and Empty Buttons

Link and button text should be discernible by a screen reader. This includes alternative text for images when used as links or buttons.

It is common on the web for links and buttons to be shown as symbols or images. This is particularly useful when space is limited, such as on smaller screens and mobile devices. However, screen readers will struggle to translate the purpose of these elements to the user.

For example, we are very used to seeing buttons with a "+" sign to represent adding something to a list, or a logo to represent a link.

<div class="media-container">
  <button class="plus-button" tabindex="0" type="button">+</button>
  <a class="twitter-link" href="#">
    <svg class="twitter-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
    </svg>
  </a>
</div>

~~~html
<!-- ❌ Missing descriptive labels -->
<button>+</button>
<a href="...">
  <img src="twitter.svg" />
</a>
~~~

When read by a screen reader:

- the button will be read as "plus button".
- the link will be read as either the image file name or the URL of the page being linked to.

These descriptions may be fine when you can see the whole screen and understand the context of the button/link, but a screen reader won't be able to provide those additional details.

### How to fix it

Descriptions can be added to buttons and links by using the `aria-label` and `aria-labelledby` attributes. These descriptions will then be read by the screen reader, giving the user a more clear understanding of the purpose of the element.

~~~html
<!-- ✅ With descriptive labels -->
<button aria-label="Add a playlist">+</button>

<a href="..." aria-label="View our Twitter page">
  <img src="twitter.svg" />
</a>
~~~

## Missing Form Input Labels

> "55% of the 4.2 million form inputs identified were not properly [labelled]"

> _- [The WebAIM Million](https://webaim.org/projects/million/)_

Each element of a form should have a programmatically associated label element.

Useful form labels are necessary to understand the purpose of each form element. This purpose can often be inferred by sighted users, by using information such as the proximity of the label to the element, or the element's placeholder. However, a screen reader cannot make these assumptions, so it requires that the label be programmatically associated with the element.

Clicking a programmatically associated label element also activates the control. This benefits users with impaired motor skills, or any user using a small screen, by providing a larger clickable area.

### How to fix it

There are three main ways to add a label to a form element:

1. Nest the input element within the label element.
2. Give the label a `for` attribute, which is equal to the `id` of the input element.
3. Give the input element an `aria-labelledby` attribute, which is equal to the `id` of the element acting as a label.

~~~html
<!-- ❌ Missing input labels -->
<label>Name</label>
<input />

<div>Name</div>
<input />

<!-- ✅ With input labels -->
<label>Name: <input /></label>

<label for="name">Name</label>
<input id="name" />

<div id="name">Name</div>
<input aria-labelledby="name" />
~~~

## Missing Document Language

The HTML document element should contain a valid `lang` attribute.

When users configure a screen reader, they select a default language. If the language of a web site is not specified, the screen reader uses the default language set by the user.

If the user speaks multiple languages, they may be visiting a web site written in a language which is different from the default on their screen reader. If the wrong language library is used, the pronunciations of the words will be strange, making the web site impossible to use.

### How to fit it

Add a `lang` attribute to the html element whose value represents the primary language of the web site. Possible values for the attribute can be found in the [IANA Language Subtag Registry](http://www.iana.org/assignments/language-subtag-registry) or by using the [Language Subtag Lookup](https://r12a.github.io/app-subtags/) tool.

~~~html
<!-- ❌ Missing lang attribute -->
<html>
  <!--document head and body-->
</html>

<!-- ✅ With lang attribute -->
<html lang="en">
  <!--document head and body-->
</html>
~~~

If the language changes within the web site, you can specify this with another `lang` attribute. If the language is written right to left, you should also specify that with the `dir` attribute.

~~~html
<p>Text in one language <span lang="es">texto en otro idioma</span></p>

<p lang="ar" dir="rtl">النص العربي هنا</p>
~~~

## Conclusion

> "Accessibility is essential for developers and organizations that want to create high-quality websites and web tools, and not exclude people from using their products and services."

> _- W3C, [Introduction to Web Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/)_

It can be hard to remember to include accessibility in your web site as you're building it, especially as a person who may not be affected by the failures. Fortunately, tools and resources can help us.

As mentioned above, [Lighthouse](https://developers.google.com/web/tools/lighthouse/) is an incredible tool for checking the quality of a web site. It can create an audit in several categories, including performance, SEO, and accessibility. They offer browser extensions and, if you're using Google Chrome, it is already built into the Chrome DevTools.

[Deque](https://www.deque.com/) also offers the Axe browser extension for [Chrome](https://chrome.google.com/webstore/detail/axe-web-accessibility-tes/lhdoppojpmngadmnindnejefpokejbdd) and [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/axe-devtools/). Like Lighthouse, this extension will list the accessibility issues for the current page. If you select an issue, you can highlight each of the elements with that issue. It also provides details such as what the issue is, the severity of the issue, and provides a link where you can learn more about it.

By using these tools, we can easily improve the accessibility of our web sites, and help meet the [goal of the Web](https://www.w3.org/WAI/fundamentals/accessibility-intro/#context) "to work for all people, whatever their hardware, software, language, location, or ability".
