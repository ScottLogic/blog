---
title: NoJS - Creating a calculator with only pure HTML and CSS. No Javascript!
date: 2022-01-20 00:00:00 Z
categories:
- garora
- Tech
tags:
- featured
author: garora
layout: default_post
summary: Everyone loves CSS! So I built a calculator where the CSS handles the logic
  without the help of javascript. In this blog post, I will discuss how I achieved
  this and maybe make a case for my sanity for making it.
image: garora/assets/2022-01-26/calc.png
---

Recently, I have been expanding my CSS knowledge and couldn't think of a more practical way of using what I learned than to make something that any reasonable person would probably involve JavaScript for. I have created this [pixel art app](https://quarknerd.github.io/noJS/pixelArt) and this [calculator](https://quarknerd.github.io/noJS/calc.html). Here is how I made the calculator.

## The rules

Whenever you set yourself a challenge it's good to properly define your goals. In this case, no JavaScript is simple, no JS file, no script tag and no use of event handlers in HTML. It is very common for 'pure CSS' projects to use languages like [HAML](https://haml.info/) and [SCSS](https://sass-lang.com/), which compile down to regular static HTML and CSS respectively, so the end result is still pure HTML and CSS. There are many crazy projects using these out in the wild. I elected not to use these for this project, just to start simple. You can view my full codebase [here](https://github.com/QuarkNerd/noJS/).

## Why make this?
Why not?

## How did I do it?

### Radio buttons

First up is user interaction. How do you detect that a user has clicked on a button without JS? We can use `radio` inputs. With 

~~~html
<input type="radio" name="x" id="q-1" /> 
<input type="radio" name="x" id="q-2" /> 
<label for="q-1">Quote 1</label>
<label for="q-2">Quote 2</label>

<p class="quote-1">...</p>
<p class="quote-2">...</p>
~~~

and 

~~~css
input, p { display: none }

#q-1:checked ~ .quote-1 { display: block; }
#q-2:checked ~ .quote-2 { display: block; }
~~~

we get

<video controls loop>
  <source src="{{site.baseurl}}/garora/assets/2022-01-26/demo_radio_as_button.mp4" type="video/mp4" />
  Demonstration of labels as buttons
</video>

Let's explain. The labels are connected to the `radio` buttons, such that clicking on them is the same as clicking on their respective inputs. Labels are preferable to using inputs directly because they make styling easier. The `~` is the general sibling selector, such that `A ~ B` will select all elements that match `B` and have a preceding sibling that matches `A`. This allows us to hide the `p`s by default and show them only when their connected input is checked.

### CSS variables and counters

Now to generate a number. We need to use CSS variables. To declare one, create a property name that begins with a double hyphen (`--`), and the value can be any CSS value. For example `--colour: brown` or `--digit: 3`. To use the variables, simply use the `var` function as below. We will also use CSS counters, which can store and display numbers. Normally CSS counters are used for things like numbering sections automatically. So with

~~~html
<input type="radio" name="theFirstDigit" id="set-to-1" /> 
<input type="radio" name="theFirstDigit" id="set-to-2" /> 
<input type="radio" name="theFirstDigit" id="set-to-3" /> 
<!-- insert labels -->

<div class="number-dsplay"></div>
~~~

and 

~~~css
#set-to-1:checked ~ div { --digit: 1; }
#set-to-2:checked ~ div { --digit: 2; }
#set-to-3:checked ~ div { --digit: 3; }

.number-display { counter-increment: digit var(--digit);  }
.number-display::after { content: counter(digit) }
~~~

we get

<video controls loop>
  <source src="{{site.baseurl}}/garora/assets/2022-01-26/demo-variables.mp4" type="video/mp4" />
  Demonstration of CSS variables and counters
</video>

The selection of the radio buttons sets the variable `--digit` inside the `div`. The value would also be inherited by all the children. Then, because we can't output the value of the variable directly, we increment the counter `digit` and display this value using generated `content`. The reason we need to use CSS variables is that counter values can't be used in `calc`, which we will discuss in the next section. In order to get more digits, we simply need to duplicate what we have. By carefully nesting the HTML and using intermediate variables we can minimise the CSS duplication. We can see this below.

~~~html
<!-- digit inputs name="theFirstDigit -->

<div class="first-digit">
  <!-- digit inputs name="theSecondDigit" -->

  <div class="second-digit">
    <!-- ..and so on -->
    
  </div>
</div>
~~~
~~~css
/* Include previous CSS */

.first-digit { --first-digit: var(--digit); }
.second-digit { --second-digit: var(--digit); }
~~~

Here, the inputs will set `--digit` as they did above, and each individual div takes that value and assins it to `--first-digt` ect. This means we don't need to repeat the `#set-to-1:checked` CSS for every digit.

### CSS calc

CSS has the function `calc`. Which allows you to do calculations (I'm as shocked as you are). It has many uses, for example, you could set the `width` of something to `calc(100% - 95px)`. For our case, we can use it to determine our input numbers and also the final result. Let's look at getting the input number

~~~css
[name="theFirstDigit"]:checked ~ * .set-number { --number: var(--first-digit); }
[name="theSecondDigit"]:checked ~ * .set-number {  
  --number: calc(var(--first-digit)*10 + var(--second-digit)); 
}
[name="theThirdDigit"]:checked ~ * .set-number {  
  --number: calc(var(--first-digit)*100 + var(--second-digit)*10 + var(--third-digit)); 
}
/* and so on */
~~~

The CSS selector `*` matches all elements, so the above CSS will find a `.set-number` that is the descendent of any element that comes after a checked input with a certain name. The second selector overrides the first simply by being later in the document. 

If we add a set of inputs to choose the operation, we can use a similar method as above to get the final answer. Then it's just about capturing the values in a counter and displaying it. The `content` property can also take a string, which allows us to show the user the operation being used.

### @property and @counter-style

With what we have so far, we can make a functional calculator. However there is one flaw, and that is the lack of decimals. The issue is that counters can only contain integers. So we need to split the number into integer and fractional parts. The first thing we need for this is a way to round numbers (we can't use counters because they cant be put into `calc`). We will use the as of yet experimental feature `@property`. @property allows you to define a variable with features like type checking and controlling whether the values are inherited by children. If we define a `@property` like so

~~~css
@property --integer {
    syntax: '<integer>';
    initial-value: 0;
    inherits: true;
}
~~~

then any value assigned to `--integer` will be rounded to the nearest integer. To show a number to 7 decimal places we will first do the following calculations. Here `--number` is defined outside

~~~css
.number-display {
    --abs-number: max(var(--number), -1 * var(--number)); 
    /* By suptracting 0.5 we make sure that we round down */
    --integer: calc(var(--abs-number) - 0.5);
    --decimal: calc((var(--integer) - var(--abs-number)) * 10000000);

    --sign-number: calc(var( --abs-number) / var(--number));
}
~~~

Using `--integer` and `--decimal` we can increment counters with similar names. But we can't just display them directly. The reason is if we do this for a number like 1.005, the `--integer` value will be 1 and the `--decimal` will be 5. We need to pad the decimal using a custom `@counter-style`. We also need to use a `@counter-style` to show the negative sign, because with something like `-0.5`, we can't tell the system that we have a 'negative zero'. To properly show the number we need 

~~~css
@counter-style pad-7 {
    system: numeric;
    symbols: "0" "1" "2" "3" "4" "5" "6" "7" "8" "9";
    pad: 7 "0"
}

@counter-style sign {
    system: numeric;
    symbols: "" "";
}

.number-display::after {
    content: counter(sign-number, sign) counter(integer) "." counter(decimal, pad-7);
}
~~~

The 2nd argument in the `counter` function is the style. The `pad-7` style, defines a normal number system, except any value with fewer than 7 digits will be padded with zeros. The `sign` style uses a numeric system too, but because we defined the symbols to be blank it will only show a negative sign (when needed).

### Wrap up

These are all the key elements to making a calculator. There are a few things left to do. There is the styling (yes, I used CSS for its actual purpose too). You might have also noticed that the current set-up gives us a separate set of inputs for each digit of a number, we can use `~`, `:checked` and the `display` property, to always show the labels of the next digit. The `content` can be split into separate elements, which allows us to only show the decimal part when needed.

How much further can we take this? We could allow the user to do calculations with the result, however, I don't think it would be possible to compute with an indefinite amount of values. Although by using something to generate the HTML you could get quite far. In theory, it is possible to take this closer to a scientific calculator. For example, to do trigonometric functions we can exploit their symmetry and periodicity and then use approximations. I think the hardest part would be to use brackets, as I don't know of a way to dynamically add brackets to `calc` so we would have to have seperate selectors and CSS for every scenario.

## Conclusion
I created this calculator, just as a fun exercise and to do something silly. The absurdity is what fueled my desire to make this. Still, I did learn a lot while doing this. While I will still have to use google every time I want to centre some text, I had a lot of fun. If you have an idea for a nonsense project, I highly recommend pursuing it. After all, why not?