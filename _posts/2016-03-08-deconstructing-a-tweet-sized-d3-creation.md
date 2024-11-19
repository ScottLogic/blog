---
title: Deconstructing a tweet-sized D3 creation
date: 2016-03-08 00:00:00 Z
categories:
- Tech
author: cprice
layout: default_post
summary: I recently created a site which I'm proud to say now hosts an impressive
  collection of tweet-sized D3 creations from the hugely creative people of the internet.
  In this post I'll talk through deconstructing one or two of those creations with
  the aim of giving any aspiring artists a starting point.
---

I recently created a [site](https://t.d3fc.io) which I'm proud to say now hosts an impressive collection of tweet-sized D3 creations from the hugely creative people of the internet. In this post I'll talk through deconstructing one or two of those creations with the aim of giving any aspiring artists a starting point.

## The concept

The inspiration for the site came when I stumbled across [John Firebaugh's site](http://jfire.io/animations/) featuring his daily D3 creations. His idea was to create a new animation a day, I assume without giving up his day job! Enforcing this artificial constraint produced some stunning looking animations and this gave me an idea - instead of a time constraint, why not have a length constraint?

Now I'm not the first one to have the idea, code golf competitions have been run for a long time, but I believe the site is the first to combine D3 with the constraint of fitting the code in a tweet. To make this achievable the site combines the D3 library, ES6 transpilation, some placeholder elements and a set of helper functions to produce a runtime for the tweeted code.

The site itself is pretty simple, it periodically polls the Twitter search API for tweets containing the term `t.d3fc.io` and attempts to parse them as ES6. If this succeeds it will add an entry to the site and attempt to render the animation as a GIF (assuming it's not too CPU/memory intensive). The real magic happens in the tweets...

<p style="text-align:center"><a href="https://t.d3fc.io/status/694815740449398784"><img src="{{ site.baseurl }}/cprice/assets/t-d3fc/voronoi.gif"></a></p>

## Deconstructing the hello world tweet

To launch the site I tweeted the rather uninspiring -

<p style="text-align:center"><a href="https://t.d3fc.io/status/693087332682088449"><img src="{{ site.baseurl }}/cprice/assets/t-d3fc/hello-world.gif"></a></p>

{% highlight js %}
T().a({transform:d=>sc(4+s(d/1e3)),x:d=>mo[0]*10,y:d=>mo[1]*10}).t('Hello World') https://t.d3fc.io
{% endhighlight %}

Let's tackle the URL on the end first. As described above, that's there primarily to allow the site to find the animations on Twitter. It also makes it easier for other people to discover what that wacky looking tweet in their timeline's all about!

What you see in the rest of the tweet is the code which runs in the animation loop. The animation loop is provided, along with all of the abbreviated function aliases, by [this base file](https://github.com/chrisprice/t-d3fc/blob/36a2543fea0453683d24c292f2bee3dc0d0f0a86/server/public/src/base.js).

I've reproduced the guts of it below -

{% highlight js %}
d3.timer(function(t) {
  g.d([t]);
  if (window.tweet) {
    tweet(t);
  }
});
{% endhighlight %}

This uses the D3 timer utility to run the function once per frame. The important bit is the `t` argument which is provided to the code you see in the tweet. Most of the animations are driven by this value, normally passed through a trigonometric function to provide some easing.

{% highlight js %}
T()
{% endhighlight %}

The first part of the code in the tweet performs a [data-join](http://bost.ocks.org/mike/join/) with the parent set to the root node provided by the base file, the data defaulting to `[t]` as above and with a built-in behaviour of appending an SVG text element in the enter selection (i.e. only once).

{% highlight js %}
.a({ /* ... */ })
{% endhighlight %}

The next bit causes `a`-ttributes to be set on the text element in the update selection (i.e. on each iteration).

{% highlight js %}
transform:d=>sc(4+s(d/1e3)),
{% endhighlight %}

Next up we affine transform the element using a `sc`-ale transform. The scaling value is a function of the data item bound to the element (`t`). `s` is an alias for `Math.sin` and `1e3` is just shorthand for `1000` (saves 1 character!).

*N.B. Thanks to a subsequent addition to the base file, transform could now be abbreviated to `[tr]` saving a whole 5 characters!*

{% highlight js %}
x:d=>mo[0]*10,
y:d=>mo[1]*10
{% endhighlight %}

This penultimate chunk makes uses the `mo`-use alias to adjust the position of the text slightly based on the normalised (x/y expressed between -1 to 1) mouse position.

{% highlight js %}
.t('Hello World')
{% endhighlight %}

And finally we set the `t`-ext content of the text element.

## Try it out

This was by no means the most exciting example but I hope it has provided some clues as to how the more complex animations work. It would be great to see your attempts, so please give it a go in the [playground](https://t.d3fc.io/playground).

<p style="text-align:center"><a href="https://t.d3fc.io/status/694572223596761088"><img src="{{ site.baseurl }}/cprice/assets/t-d3fc/helix.gif"></a></p>
<p style="text-align:center"><a href="https://t.d3fc.io/status/695490817863987201"><img src="{{ site.baseurl }}/cprice/assets/t-d3fc/jfire.gif"></a></p>
<p style="text-align:center"><a href="https://t.d3fc.io/status/695201842968543232"><img src="{{ site.baseurl }}/cprice/assets/t-d3fc/man.gif"></a></p>
<p style="text-align:center"><a href="https://t.d3fc.io/status/693101547396452353"><img src="{{ site.baseurl }}/cprice/assets/t-d3fc/moire.gif"></a></p>
