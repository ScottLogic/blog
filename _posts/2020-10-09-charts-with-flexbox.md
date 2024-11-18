---
title: Weird Flex, but OK; Interactive Charts with Flexbox
date: 2020-10-09 00:00:00 Z
categories:
- Tech
author: jmorris
layout: default_post
image: jmorris/assets/Jamie-Morris-crop-3.jpg
summary: This blog post looks at how CSS flexbox item sizing works, how it is used to create responsive layouts, and how it can be used to display interactive charts without using any Javascript.
---

This blog post looks at how CSS flexbox item sizing works, how it is used to create responsive layouts, and how it can be used to display interactive charts without using any JavaScript.

## Why Not JavaScript?

There are of course many JavaScript libraries that can create charts, such as [ChartJS](https://www.chartjs.org) or [D3](https://d3js.org/). However these will need to be added as dependencies on your project and may require a specific version for the JavaScript framework that you are using.

The benefit of using CSS over one of these libraries is that it is decoupled from the code, making it easier to make changes. There is also no need to worry about versioning, maintenance, or compatibility of the library and your codebase.

## The numbers, what do they mean?

Flexbox has some properties which differ from the CSS norm of defining measurements in units or percentages. Namely `flex-grow` and `flex-shrink`, which set a unitless grow or shrink "factor". Using the `flex` shorthand to declare these, you may see CSS that looks something like this:

~~~scss
flex: 1 1 0px;
~~~

which can be also be written as:

~~~scss
flex: 1;
~~~

This is the equivalent of setting three properties:

- `flex-grow: 1`: sets a grow factor of 1
- `flex-shrink: 1` sets a shrink factor of 1
- `flex-basis: 0px` sets a basis size of 0px

The first number is the`flex-grow` property, which can be defined separately as `flex-grow: 1`. This is saying that this item should grow to a factor of 1. Since the default grow factor is 0, if you define this on an item, it will fill all of the remaining space inside the flexbox.

The second number, `flex-shrink` works in the same way but for shrinking an item. By default, all items have a shrink factor of 1, so they will all shrink equally if any other element grows in size.

The third property is `flex-basis`, which defines the inital size of the item and is the equivalent of setting a `width` or `height`. This uses more common syntax, such as a length in units or a percentage, or properties based on the item's contents.

For the purposes of this blog post, I'm going to be focusing on `flex-grow`.

## Let it grow

Let's see what happens when we apply the above CSS style to one item in a flex box. In the code below, all the `div` elements have a width of 20px, but the 5th has `flex: 1` applied. This makes it grow to fill the remaining space in the flexbox.

<script async src="//jsfiddle.net/jamiemorris1991/4dm3ew1g/embed/result,css,html/"></script><br/>

Conversely, if you give every item the same property, then they all grow at an equal proportion. This is a great way to set items to have an equal width but remain responsive, if the parent flexbox is resized. Thus there is no need to set a `width` property any more.

<script async src="//jsfiddle.net/jamiemorris1991/wbm8skpq/embed/result,css,html/"></script><br/>

If we only apply `flex` on hover, suddenly this property becomes a lot more powerful. For example, we can create a responsive bar chart, that when you hover over one of the bars, it expands and you could display text inside it. This hover property will override the original `flex`

<script async src="//jsfiddle.net/jamiemorris1991/q3s2e1Lf/embed/result,css,html/"></script><br/>

## Proportional Representation

So far we have seen a simple use of expanding one item and shrinking all the others. But this property can also be used to set proportional widths of each item. This is very useful for something like a stacked bar chart, where we can give each section of each bar a flex that matches the proportion of the bar it takes up. The code below splits each bar into three sections, and sets those three sections to have proportional flex properties.

<script async src="//jsfiddle.net/jamiemorris1991/0pjkuovh/embed/result,css,html/"></script><br/>

The only addition to the CSS is these three definitions below. In this case they add up to 100 to act like a percentage, but this isn't necessary. As long as the numbers are proportional to each other, the flex-grow factor will apply to all of them correctly.

~~~scss
.section {
  &.red {
    flex: 20;
    background-color: darkred;
  }

  &.blue {
    flex: 30;
    background-color: steelblue;
  }

  &.orange {
    flex: 50;
    background-color: orangered;
  }
}
~~~

If we wanted to make this interactive, to perhaps show text inside sections of the bars on hover, we can still do that even if we have already set `flex` properties. If we add the `:hover` rules that we saw in the earlier example, all we need to do is ensure the grow factor is large enough to grow the box to be legible.

~~~scss
&:hover {
  flex: 100;
}
~~~

Just adding that code to the above `.section` class means that any section will grow on hover to be larger than all the others, regardless of its previous size. The beauty of flex is that the non-hovered sections will still be proportional to _each other_.

For this example I have rotated the stacked bar chart to be vertical to help show the expansion:

<script async src="//jsfiddle.net/jamiemorris1991/gbcp8rjL/embed/result,css,html/"></script><br/>

## Tying it all together

What the above examples show is that you can use flex-grow along either axis of a graph, either for proportional sections or for expanding sections to display information. What makes it even more handy is that both methods can be used together. If we want to make a Marimekko chart, which is similar to a stacked bar chart but the widths of each parent bar vary too, we can use `flex` for both the bar and the sub-sections, to make it expand across both the x and the y axes.

<script async src="//jsfiddle.net/jamiemorris1991/7es5co8r/embed/result,css,html/"></script><br/>

## Conclusion

Here you have seen how using only CSS and HTML, it is possible to make dense, accurate and interactive charts. Of course this can be expanded on by using a JavaScript framework, such as React, where you can apply the flex properties based on dynamic data in the code.
