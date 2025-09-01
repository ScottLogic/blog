---
title: Intro to Masonry Layout
date: 2025-09-01 08:00:00 Z
categories:
- Tech
tags:
- CSS
- Javascript
summary: Let's explore the concept of masonry layouts in web development where items share the same width but differ in height. We'll explains when a simple CSS grid is sufficient, when to rely on libraries like Masonry.js for dynamic content, and why the CSS grid-template-rows experimental value masonry; remains impractical due to limited browser support. We'll also touch on accessibility concerns, the underlying column-stacking logic, and more advanced rectangle-packing techniques for layouts with both variable widths and heights.
author: osharon
image: "/osharon/assets/masonry/pinterest.png"
---

As a web-developer you might have come across the term “Masonry”. If you’re not familiar with it, this article will hopefully shed some light on the topic. The most famous example for masonry layout is pinterest.com. At first glance it looks like simple grid of items but notice that each item is slightly different height whilst they all stack neatly with varying gaps between them. 

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/pinterest.jpg" alt="Pinterest signature masonry layout"/>

You might argue that it’s not a big deal but notice that items are ordered horizontally - if there were only 5 items, we would expect them fill a single row (and not be stacked in a single vertical column).
There’s no denying that masonry looks good, but do you really need it?
If all your items are of the same height, you can use a simple grid without any issue.

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/fixed-grid.png" alt="Fixed-size grid"/>

If your content is fixed, ie. It’s always the same items; you can use one of the many grid generators.
Even if your layout is fixed, for example - the first item is always big, you shouldn’t have any issue.

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/fixed-layout.png" alt="Fixed layout"/>

The problem begins when items are load dynamically with different sizes and still needs to be nicely laid out. The common case is like Pinterest: same width, different heights.
Let’s say we have this line of items, and we now wonder where the next item should appear.

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/masonry-question.png" alt="Fixed-size grid"/>

If you’re not into reinventing the wheel, there are JS-based libraries such as Masonry.js.
Alternatively, you can use the new CSS feature grid-template-rows: masonry;​. The only problem with it is that it’s only available on Firefox and must be explicitly enabled. The feature is available in Firefox since 2020 but it's still not commonly used.

```css
display: grid;
grid-template-columns: repeat(4, 3rem);
grid-template-rows: masonry;
```

<table><tr>
<td><img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/masonry-not-firefox.png" alt="Fixed-size grid"/>
disabled</td>
<td><img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/masonry-firefox.png" alt="Fixed-size grid"/> enabled</td>
</tr></table>

From a technical standpoint, we’re adding the next item to the shortest column iteratively.
Behind the scenes, masonry js-library can do one of the following - Change the actual order of HTML elements; change the visual layout using CSS transition​ feature but keep the HTML elements at their original order. When deciding between the two, you should take keyboard-navigation into consideration: When the user hit “next” on the keyboard, where should the focus go?

The next step beyond standard masonry is both widths and heights are different sizes. The algorithm becomes far more complicated - it’s no longer adding an item to the shortest column as the previous libraries did, rather trying to fit each element wherever possible, but of course there’s no need to re-invent the wheel - the problem is called “rectangle-packing” and there are ready made libraries for it.

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/rect-packing.png" alt="Rectangle Packing algorithm"/>

## So, what are the takeaways?
For anything static, avoid overcomplicated code. Use a css-grid generator to set the layout.
For dynamic items of various heights (or width, just as long as one of the dimensions is fixed), use an existing library of masonry-js. Internally you can rely on Firefox feature but avoid it for public use.
For anything more complicated, use the rect-packing algorithm.