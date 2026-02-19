---
author: garora
title: NoJS 3 - The dawn of Flappy Bird. Making a Flappy Bird clone using pure HTML and CSS, no JavaScript
categories:
  - Tech
layout: default_post
summary: Everyone loves CSS! Apparently, I have little better to do with my life. I have created a clone of the lesser-known game Flappy Bird. This was made without any JavaScript—only HTML and CSS. In this blog post, I discuss how I made it.
category: Tech
image: garora/assets/noJs3/bird.svg
---

Previously, I created a [calculator](https://blog.scottlogic.com/2022/01/20/noJS-making-a-calculator-in-pure-css-html.html) and [tic-tac-toe](https://blog.scottlogic.com/2024/05/17/noJS-2-stochastic-boogaloo.html) with a "random" computer player, both entirely in CSS. I also once made a game of Flappy Bird in [D3](https://d3js.org/), however, not in any way that warranted a blog post. Recently, a colleague misremembered these as "Flappy Bird in CSS". The thought was amusing. I knew it would be technically possible with the use of animated radio buttons for every single possible state, but that didn't feel interesting. Over the next few weeks, I didn't actively pursue the idea but kept getting thoughts in the back of my mind about how different aspects could be achieved. Until finally I was forced to sit down and make it, you can play around with it [here](https://quarknerd.github.io/noJS/flappybird/). In this <del>cry for help</del> blog post, I explain how I made it.


## Rules
The only thing I wrote was HTML and CSS. No HAML, SCSS or any other preprocessors. No JavaScript is enforced by testing the app with JavaScript disabled in the browser settings. You can view my full codebase, including other creations [here](https://github.com/QuarkNerd/noJS/).

## How did I make it?

### Click to jump

The fundamental aspect of the game, click a button, and a bird jumps up, before falling to the ground ( or in my case, off the screen ). 

Motion is simple. I played around and found an animation setting that looked close enough. I'm not going to explain the `cubic-bezier` here. Just know that by setting up the example below, we can animate the CSS variable `--bird-delta-y` to go up and then down in a falling manner. By adding this value to the bird's position, the bird is animated.


~~~css
@property --bird-delta-y {
  syntax: "<length>";
  initial-value: 0px;
  inherits: true;
}

:root {
  animation-name: jumpAndFall;
}

@keyframes jumpAndFall {
  0% {
    --bird-delta-y: 0;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }
  25% {
    --bird-delta-y: calc(-1 * var(--jump-height));
    animation-timing-function: cubic-bezier(0.68, 0, 1, 0.26);
  }
  100% {
    --bird-delta-y: var(--fall-distance)
  }
}

.bird {
  position: absolute;
  top: calc(30px + var(--furthest-click-dist))
}
~~~

Next, we need to reset the jump and start it from a new location when the player clicks their mouse. It's not possible to just read the current value of `--bird-delta-y` and base new calculations off it; this is because CSS works in a declarative manner, not an imperative one. It's also not possible to do an event listener in CSS, but I can use radio input buttons. CSS can detect a checked radio button and can thus apply styles or modify variables. And the nature of radio buttons is such that if another one is clicked, the first one becomes unchecked. So the value of `--active-number` below will always be the value of the most recently clicked radio button.

~~~css
:root:has(input[id^="1"]:checked) {
  --active-number: 1;
}
/* And so on */
~~~

Above, I make use of the [has selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has), which is relatively new; it allows you to select a parent element or a previous sibling element with respect to a reference element. In this case, it will select `:root` (`html`) when it has an `input[id^="1"]:checked`. `^=` is a begins with selector.

So next, we stack a bunch of radio buttons on top of each other (I actually used [label elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label)). And animate them along with the bird. By restricting the user to only be able to click the button in a specific position, we can make calculations based on the radio button selected on where the bird needs to jump from. This is best understood from the animation below.

<video autoplay controls loop>
  <source src="{{site.baseurl}}/garora/assets/noJs3/ClickToJump.mp4" type="video/mp4" />
  Demonstration of the hidden labels used for randomisation
</video>

The key thing to remember is that in the actual game, the shaded regions are completely grey. The CSS logic looks like..

```css
  --bird-frame-top: calc(
    var(--bird-frame-base-top) + var(--bird-delta-y) + var(--active-number) * var(--click-box-height)
  );
```

`--click-box-height` is the height of the label; this does mean that there is a precision limit based simply on how large the labels are. `--bird-frame-base-top` is just a base value for the position of the bird frame (bird and labels). `--active-number` is determined by the most recent label clicked; each value is just an integer indicating its position. `--bird-delta-y` is the animated variable from earlier.

The code above changes the nature of the animation, but we still need to reset the animation on each click. This is done by simply having two sets of inputs, which swap in and out on every click. Each set has a full collection for setting `--active-number`. However, as seen below, they set a different identical animation. The reason is that when `jumpAndFall` is active and we change it to `jumpAndFall2`, CSS does not detect that they are identical and hence forces the animation to restart. The start of the animation is the bird jumping.

~~~css
:root:has(input[id$="fall1"]:checked) {
  animation-name: jumpAndFall2;
}
:root:has(input[id$="fall2"]:checked) {
  animation-name: jumpAndFall;
}

@keyframes jumpAndFall {
  /* As above */
}
@keyframes jumpAndFall2 {
  /* Duplicate */
}

/* Ensure that the jump-holders (divs containing labels) swap in and out on every click */
div:has(input[id$="fall1"]:checked) ~ * #jump-label-holder-2,
#jump-label-holder-1
{
  display: flex;
}

div:has(input[id$="fall1"]:checked) ~ * #jump-label-holder-1,
#jump-label-holder-2
{
  display: none;
}
~~~

All the radio buttons have the same `name`, which means that only one can be selected at any one time. So when one from `#jump-label-holder-2` is selected, it deselects the one from `#jump-label-holder-1`.

If a user clicks down on a label, it is possible for that label to move out of the way, and another label takes its place, before the user releases. The result is that no selection is detected. To deal with this, we can increase the height of the label when the user presses down by making use of the `:active` label. We can also use `:active` to animate the wings by simply swapping out the image.

### Pipes and "Randomness"

Next, we need to create some pipes. Drawing and animating them is pretty straightforward. To avoid creating a `div` for each new pipe, we simply need to create 3 and have them repeat. But how do we vary their heights? First, we create an `@Property`, call it `--score` and animate it to increase every time the pipe goes off screen (we can do this just by knowing the time it takes). Each pipe is then given a `--pipe-number` (1, 2, 3). The below maths then ensure that each pipe has a `--pipe-index` that jumps up by 3 exactly when it completes one passthrough.

~~~css
.pipe-frame {
  --integer: round(
    down,
    calc((var(--score) + 3 - var(--pipe-number)) / 3)
  );
  --pipe-index: calc(var(--integer) * 3 + var(--pipe-number));
}

Then, by using some trig functions and playing around with them, I was able to create pseudorandom positions for the pipes. And by animating another variable, which pauses once the user closes the pop-up, a "random" seed can be chosen to make the game different each time. Then a simple use of a CSS [counter](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Counter_styles/Using_counters) gives us our visual score. 

~~~

### Collision Detection and Game End

Pipes are great and all, but what's the point if they don't hurt the bird? Here is a simplified version of my collision detection, which is done independently by each pipe.


~~~css
.pipe-frame {
    --overlap-in-x: calc(
    (
        max(
            0px,
            var(--brid-x) + var(--bird-width) -
              var(--pipe-x)
          ) / 1px
      ) *
      max(
        0px,
        var(--pipe-x) + var(--pipe-width) - var(--brid-x)
      )
  );
  /* Similar for --overlap-in-y */
  --collision: calc((var(--overlap-in-x) / 1px) * var(--overlap-in-y) / 1px);
}
~~~

The calculation is split into an overlap in x and in y. The first bit of the x calculation determines if the bird's right side is past the pipe's left side; the first max returns a `0px` if not. Similarly, the second bit determines if the bird's left side is behind the pipe's right side; if both of these are true, the pipe and the bird overlap in the x dimension and the value of `--overlap-in-x` will be non-zero. There is an equivalent calculation for y (that takes into account the gap between pipes).
The result of this calculation is that if there is an overlap of a pipe with the bird, `--collision` will be non-zero. Once we have this, we simply create a game-ending `div` which has a height of `200vh * var(--collision)`, forcing the user to hover on it. On hover, this `div` pauses all animations and remains on screen. 

### A few fun things I found

I had to do a lot of debugging in this; the use of counters and [this trick](https://www.youtube.com/shorts/ii-lSK2_Nu4) helped. I imagine the former is unlikely to come up day to day, however, I look forward to using the second. 

If a `div` changes its position or height as a result of a `transform` being animated, it will not cause the `:hover` state to be recalculated, as shown above. It works for properties directly, so our game-ending logic still works. Finally, dimensions are important in CSS, while making my collision detection formula, I has some issue and realised it's because I was assigning things like `1px*1px` to something wanting a length.

## FAQ

#### The game looks kind of ugly. Have you considered adding pretty styling?
I've never heard of CSS being used for styling, but anything is possible, I guess.

#### Why is the bird square?
I have a square bird for ornithological accuracy and not because it made collision detection easier.

## Wrap up

So what does this tell us? It tells us that at the time of writing this app, I am smarter than Gemini 3 Pro. Here is it giving up after being given the same amount of push I got.
<p><img src="{{ site.baseurl }}/garora/assets/noJs3/gemini.png" alt="gemini failing to create flappy bird without JS" title="gemini failing to create flappy bird without JS" width="500" class="alignnone size-full wp-image-95" /></p>