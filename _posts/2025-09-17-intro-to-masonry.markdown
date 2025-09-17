---
title: Intro to Masonry Layout
date: 2025-09-17 08:00:00 Z
categories:
- Tech
tags:
- CSS
- Javascript
summary: Let's explore the concept of 'masonry' layout in web development where items share the same width but differ in height. We'll explain when a simple CSS grid is sufficient, when to rely on libraries like Masonry.js for dynamic content, and why the CSS grid-template-rows experimental value 'masonry' remains impractical due to limited browser support. We'll also touch on accessibility concerns, the underlying column-stacking logic, and more advanced rectangle-packing techniques for layouts with both variable widths and heights.
author: osharon
image: "/osharon/assets/masonry/pinterest.png"
---

As a web-developer you might have come across the term “Masonry”. If you’re not familiar with it, this article will hopefully shed some light on the topic. The most famous example for masonry layout is [pinterest.com](https://www.pinterest.com/). At first glance it looks like simple grid of items but notice that each item is slightly different height whilst they all stack neatly with varying gaps between them. 

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/pinterest.jpg" alt="Pinterest signature masonry layout"/>

From a designer's point of view, my colleague [Marcin Palmaka](https://www.linkedin.com/in/marcin-palmaka-5481805b/) argues that layouts should adhere to certain typography rules. i.e., the weight of the container and columns should derive from your font size, and your gutters should relate to your baseline (font size * line height). For additional information on that aspect, he recommends the book - [Grid systems in graphic design - Josef Muller-Brockmann](https://www.counter-print.co.uk/products/grid-systems).

The big challenge in masonry layout is that the items are ordered horizontally while stacked vertically - if there were only 5 items, we would expect them fill a single row (and not be stacked in a single vertical column).
There’s no denying that masonry looks good, but do you really need it?
If all your items are of the same height, you can use a simple grid without any issue.

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/fixed-grid.png" alt="Fixed-size grid"/>

If your content is fixed, ie. It’s always the same items; you can use [one](https://cssgrid-generator.netlify.app/) of the [many](https://layout.bradwoods.io/) [grid](https://grid.layoutit.com/) [generators](https://www.tailwindgen.com/).
Even if your layout is fixed, for example - the first item is always big, you shouldn’t have any issue.

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/fixed-layout.png" alt="Fixed layout"/>

This layout is also called "[bento box](https://bentogrids.com/)", and it was inspired from Microsoft Windows 7 [Metro design](https://en.wikipedia.org/wiki/Metro_(design_language)).

<figure>
  <img src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Bento_box_from_a_grocery_store.jpg" alt="Real life bento box" style="width:50%"/>
  <figcaption style="text-align:center">A bento box (image source: wikipedia)</figcaption>
</figure>

The problem begins when items are load dynamically with different sizes and still needs to be nicely laid out. The common case is like Pinterest: same width, different heights.
Let’s say we have this line of items, and we now wonder where the next item should appear.

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/masonry-question.png" alt="Fixed-size grid"/>

If you’re not into reinventing the wheel, there are JS-based [libraries](https://spope.github.io/MiniMasonry.js/) [such](https://isotope.metafizzy.co/layout-modes/masonry) [as](https://getbootstrap.com/docs/5.1/examples/masonry/) [Masonry.js](https://masonry.desandro.com/).
Alternatively, you can use the new CSS feature grid-template-rows: masonry;​. The only problem with it is that it’s only available on Firefox and [must be explicitly enabled](https://www.stefanjudis.com/blog/how-to-use-and-feature-detect-css-grid-masonry-layout/). The feature has been available in Firefox since 2020 but it's still not commonly used.

~~~ css
display: grid;

grid-template-columns: repeat(4, 3rem);

grid-template-rows: masonry;
~~~

<table><tr>
<td><img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/masonry-not-firefox.png" alt="Fixed-size grid"/>
disabled</td>
<td><img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/masonry-firefox.png" alt="Fixed-size grid"/> enabled</td>
</tr></table>

Behind the scenes, the masonry.js library adds the next item to the shortest column iteratively.
Behind the scenes, masonry js-library can do one of the following - 
- Change the actual order of HTML elements; 
- Change the visual layout using CSS transition​ feature but keep the HTML elements at their original order.
When deciding between the two, you should take keyboard-navigation into consideration: When the user hit “next” on the keyboard, where should the focus go?

The next step beyond standard masonry is both widths and heights are different sizes. The algorithm becomes far more complicated - it’s no longer adding an item to the shortest column as the previous libraries did, rather trying to fit each element wherever possible, but of course there’s no need to re-invent the wheel - the problem is called “[rectangle-packing](https://en.wikipedia.org/wiki/Rectangle_packing)” and there are ready made [libraries](https://github.com/mapbox/potpack) for it such as [rectangle-packer](https://www.npmjs.com/package/rectangle-packer).

<img src="{{ site.baseurl }}/osharon/assets/intro-to-masonry/rect-packing.png" alt="Rectangle Packing algorithm"/>

## So, what are the takeaways?
For anything static, avoid overcomplicated code. Use a css-grid generator to set the layout.
For dynamic items of various heights (or width, just as long as one of the dimensions is fixed), use the existing library [masonry.js](https://masonry.desandro.com/). If you're in a controlled environment where you can ensure everyone is using Firefox you may use the css feature, but avoid it otherwise.
For anything more complicated, use the rect-packing algorithm.