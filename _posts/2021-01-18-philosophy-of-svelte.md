---
title: The Philosophy of Svelte
date: 2021-01-18 00:00:00 Z
categories:
- Tech
tags:
- svelte
author: mstobbs
layout: default_post
image: mstobbs/assets/philosophy-of-svelte/svelte-philosopher.png
summary: Svelte is one of the most exciting parts of front-end development today.
  But what is it, exactly? In this post, we take a look at the philosophy behind Svelte
  and see how it affects everything Svelte does.
---

In 2019, I presented "An Introduction to Svelte" at Scott Logic's monthly "Newcastle TekTalks". I planned to do a blog post afterwards, writing down what I had already presented.

Nearly 18 months later, here is attempt #5.

The more I reflected on Svelte, the harder it became to summarise it effectively. If you focus on a high-level overview, you miss all the tiny features which make Svelte a joy. But if you zoom in on the exciting details, you miss the overarching picture which makes it all possible. 

From my observations, I'm not the only one who has this struggle. The creator of Svelte, Rich Harris, [described Svelte](https://fullstackradio.com/143) as:

> "It's a component framework, but it's also a compiler, and it's also a library of the things that you need when you're building an application, and a philosophy of building web apps I guess."

Describing Svelte as a philosophy surprised me. But as I tried to organise my thoughts to write this blog post, I arrived at what I believe to be Svelte's underlying [philosophy](https://twitter.com/Rich_Harris/status/1287779277581291526).

<p style="font-size: 1.5rem;"><span style="color: #ef8547; font-weight: 700;">Great DX</span> shouldn't come at the expense of <span style="color: #2bb3bb; font-weight: 700;">great UX</span></p>

In other words, Svelte is designed to make it as easy as possible to create an incredible user experience.

## Trade-Offs?

You may have been disappointed at how ordinary that sounds. Isn't that the goal of every tool used by developers? Well, yes, but actually no.

Large packages can impair the user experience. Large bundles take longer to download, increasing the initial load time of the application. They also have more code that needs to run, slowing the app down at run time.

Thus building a framework is often a balancing act between adding features to make things easier for the developer, and keeping the package as small as possible.

<img src="{{ site.baseurl }}/mstobbs/assets/philosophy-of-svelte/DX-vs-UX.png" alt="A see-saw with UX on one end and DX on the other" title="There is a trade off between DX and UX">

Svelte can avoid this trade-off because, in addition to being a component framework, it is also a compiler. This decouples the developer experience from the user experience. The developer can write the code in an environment optimally suited for developing. The compiler then converts the code, *at build time*, to produce an optimal user experience.

## Frameworks Are For Organising Your Mind

In Rich Harris' talk "[Rethinking reactivity](https://youtu.be/AdNJ3fydeao?t=411)", he described an epiphany he had that lead to the creation of Svelte:

> Frameworks are not tools for organising your code, they are tools for organising your mind.

In other words, frameworks aren't there to help browsers run your app; they're there to help developers create the app. Any application could, in theory, be written in pure JavaScript, and the browser would happily run it. Because of this, Svelte gives you a framework and tools to use for developing, and then "[magically disappears](https://v2.svelte.dev/)" at build time.

Why is this helpful?

It means that Svelte can give first-class support to a lot more features than a typical framework. For example, Svelte has a [state management system](https://svelte.dev/tutorial/writable-stores) baked into the framework. If you don't need to use it, the compiler removes the code at build time, so your final package stays unbloated and, well, [svelte](https://www.merriam-webster.com/dictionary/svelte)!

Another example is animation and transitions. Svelte makes motion [incredibly easy](https://svelte.dev/tutorial/tweened) to manage. If you take advantage of its capabilities, at build time the compiler will compile the code into CSS, creating the smoothest possible user experience. And if you don't use it, the compiler removes the code.

## Write Less Code

Lean codebases are better than large codebases. Smaller codebases are easier to read and understand, take [less time to create](https://blog.codinghorror.com/diseconomies-of-scale-and-lines-of-code/), and have [fewer bugs](https://www.mayerdan.com/ruby/2012/11/11/bugs-per-line-of-code-ratio).

Reducing the amount of code you have to write is [an explicit goal](https://svelte.dev/blog/write-less-code#Yes_I_m_talking_about_Svelte) of Svelte. Rich Harris claims from his experience that a React component is typically 40% larger than its Svelte equivalent. This makes writing Svelte components a joy.

For example, let's compare how you would create a simple component which takes an input and displays the value. In React, it would look something like:

~~~js
import { useState } from 'react';

function MyInput() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>{value}</p>
    </>
  );
}

export default MyInput;
~~~

Here is the equivalent in Svelte:

~~~html
<script>
  let value = '';
</script> 

<input bind:value />
<p>{value}</p>
~~~

This is significantly shorter and easier to read. And even if you've never even heard of Svelte, I bet you can understand exactly what that code is doing.

## It's Fast... Really Fast

Svelte is incredibly [performant](https://twitter.com/Rich_Harris/status/1065992585095929857).

There are two main reasons Svelte can achieve this performance: forward referencing and less code (surprise, surprise).

Svelte uses forward referencing to keep track of which values are dependant upon other values. Therefore, the code doesn't need to spend time comparing virtual DOM trees to see what's changed - it can just immediately update what needs to be updated.

Let's see what this looks like by extending our example from above.

~~~html
<script>
  let value = '';
  $: message = `${value} is our value`;
</script> 

<input bind:value />
<p>{message}</p>
~~~

Here, we've created a [reactive declaration](https://svelte.dev/tutorial/reactive-declarations). We've tied the `value` variable to the `message` variable. Now, when `value` updates, Svelte automatically knows to update `message`. 

It isn't even limited to variables. We can tie the `value` variable to a statement like `console.log`, which will log `value` every time `value` is updated.

~~~html
<script>
  let value = '';
  $: console.log(`The value is ${value}`);
</script> 

<input bind:value />
~~~

The other main performance gain comes from the compiler. It strips out any unused code at build time and reworks the code to be incredibly efficient in the browser. In the words of [Rich Harris](https://youtu.be/AdNJ3fydeao?t=1492):

> "There's only one reliable way to speed up your code, and that is to get rid of it."

For example, one of the hardest parts of a large codebase to edit is the CSS. It's so tricky to know if a line of CSS is still being used, so it always gets left "just in case."

Svelte makes this easy: all CSS is scoped to the component which defines it. That means updating CSS in one component is not going to have unintended consequences somewhere else in your app.

If you do end up with CSS which isn't being used, the compiler will give you a warning, so you know you can safely remove it. Even if you don't remove the code, the compiler will.

All of this means the user only requests what the app needs to load, and only runs what the app needs to run.

## Beginner Friendly

In my experience, Svelte is one of the most beginner-friendly frameworks. It's been [designed](https://twitter.com/Rich_Harris/status/1287779277581291526) so that you can use your existing HTML, CSS, and JS knowledge with as little onramp as possible.

Svelte is a superset of HTML. This means there are fewer "gotchas" that come with learning it (e.g. it uses `class=""`, as opposed to `className=""` in React).

It's also very forgiving. The focus when you're coding is to tell the compiler what you want it to do. The compiler then handles making it run efficiently.

For example, when we defined our reactive declaration above, it would have been equally valid to swap the order of the variables:

~~~html
<script>
  $: message = `${value} is our value`;
  let value = '';
</script> 

<input bind:value />
<p>{message}</p>
~~~

The compiler knows that `message` is dependant upon `value`, so the compiled code will place them in the correct order. This is nice for when we make mistakes (which never happens) but it also gives us more freedom in how we organise our code.

Another example is inline event handlers. Some frameworks recommend avoiding them for performance reasons, particularly inside loops. That advice [doesn't apply](https://svelte.dev/tutorial/inline-handlers) to Svelte - the compiler is smart enough to know what we want.

~~~html
<button on:click={() => {
  console.log('Clicked');
}}>
  Click me
</button>
~~~

## Conclusion

Despite Svelte 3 being only being a couple of years old, there's already a lot to be excited about. It won State of JavaScript 2019's [Prediction Award](https://2019.stateofjs.com/awards/prediction_award), awarded "to an up-and-coming technology that might take over". Sure enough, in 2020 [it was voted](https://2020.stateofjs.com/en-US/technologies/front-end-frameworks/#front_end_frameworks_experience_ranking) the number one framework in terms of both interest and satisfaction.

If you're interested in trying Svelte out, the best place to start is the official [documentation](https://svelte.dev/). The website has a very well written [tutorial](https://svelte.dev/tutorial/basics) which covers all the essentials. There's also a [REPL](https://svelte.dev/repl/hello-world?version=3.31.2) where you can try coding with Svelte right in the browser.

Svelte's philosophy is a paradigm breaker. By removing the trade-off between DX and UX, it can prioritise both. In Svelte, creating apps and using apps spark joy.
