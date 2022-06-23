---
author: tbarclay
title: Static Shock - Using Modern Static Site Generators
title-short: Static Site with Jekyll
layout: default_post
categories:
  - Tech
summary: >-
  This post discusses building a modern single page marketing site using a
  static site generator
---

A few months ago I [wrote about creating a single-page marketing site]({{ site.baseurl }}/2015/09/18/meteor-scroll.html). At the time I had been playing quite a bit with the full-stack reactive JavaScript framework, [Meteor](https://www.meteor.com/), so in a fit of "when you have a hammer everything looks like a nail" fervour, that's what I used. That really wasn't the right choice for a site like this for a number of reasons, so here I'll talk about re-implementing the same site in a more sensible way. 

Marketing pages generally contain non-interactive product information that doesn't change very often, and this one was no exception. This makes a dynamic, full-stack approach like Meteor overkill. Instead, in apparent contrast to a decade or so of ever more dynamic web technologies, what we really need here is a static site.

## [Toys in the Static](https://www.youtube.com/watch?v=Q9NAerwlYWw) - Static site generators

<img src='{{ site.baseurl }}/tbarclay/assets/static-site/staticgen.png' title="Staticgen" alt="StaticGen Static site generator statistics" />

Static sites have enjoyed a bit of a renaissance in the last few years with static generation tools like [Jekyll](https://jekyllrb.com/), [Hugo](https://gohugo.io/) and [Middleman](https://middlemanapp.com/) gaining traction for projects that might otherwise have defaulted to using a dynamic CMS tool like [Wordpress](http://www.sitepoint.com/wordpress-vs-jekyll-might-want-make-switch/) or [Joomla](http://www.wayofquality.de/way%20of%20quality/blog/goodbye-joomla-welcome-jekyll/). Modern static site generators provide a happy middle ground between the tooling and composability of a modern development workflow and the simplicity and speed of a traditional static HTML page. Now that modern web development is increasingly reliant on front end frameworks like Angular, more and more work can be done on the client with the server just serving up the files at the start.

Going static also simplifies (and cheapens) hosting because all that's needed is a CDN (Content Delivery Network) - and there are many free options including [Github Pages](https://pages.github.com/).

For my re-implementation I chose [Jekyll](https://jekyllrb.com/) simply because it was the option I was most familiar with and it seems to be the most widely used - indeed *this* blog is built with Jekyll. One thing that's worth mentioning is that, while Jekyll is quite easy to use once it's set up, getting it running locally can be a bit onerous, particularly on Windows. I found [this guide](http://jekyll-windows.juthilo.com/) to be a good supplement to the official [quick-start guide](http://jekyllrb.com/docs/quickstart/).

There are, of course, many other options besides Jekyll each with their own selling points and quirks: [Middleman](https://middlemanapp.com/), for example, focuses on being more feature-rich; [Metalsmith](http://www.metalsmith.io/) offers more flexibility to determine how files are manipulated through plugins; [Bramble MVC](http://blog.scottlogic.com/2014/11/28/bramble-mvc.html) (created by a [fellow Scott Logic blogger]({{ site.baseurl }}/isullivan/)) aims to reclaim some of the advantages of a dynamic web framework while still, in fact, being static; and [Tiny-ssg](https://github.com/ColinEberhardt/tiny-ssg) (from yet [another Scott Logic blogger]({{ site.baseurl }}/ceberhardt/)) is a reaction against the complexity of some of these other tools and is purposefully small and simple. [This](http://www.sitepoint.com/6-static-blog-generators-arent-jekyll/) is a useful guide.

## [You're So Static](https://www.youtube.com/watch?v=DJr1fcTKtbQ) - Re-implementing the Site

The code of the new static implementation of the site is on [GitHub](https://github.com/timbarclay/jekyll-scroll). Migrating over from the previous incarnation was largely just a case of copying blocks of code out of Meteor helpers and into new JavaScript functions. In this case there isn't much Javascript so I've kept it all in one file but it could be modularised further. I won't describe the code in detail because it's largely unchanged.

Jekyll supports arbitrary [collections](http://jekyllrb.com/docs/collections/), so that's what I used to implement the individual sections of my page. To set this up, I added a new entry into `config.yml`:

    collections
    - sections

and a new directory at the base level called `_sections`. Each Markdown file in that directory is included in the `sections` collection and can be referenced using Liquid attributes, the same way as posts and other data.

{% highlight html %}
{% raw %}{% for section in site.sections %}{% endraw %}
  <div id="{% raw %}{{ section.id }}{% endraw %}" class="section {% raw %}{{% if section.backgroundImage != null %}}overlay{{% endif %}}{% endraw %}"
  style="background-image: url({% raw %}{{ site.baseurl }}/{{ section.backgroundImage }}{% endraw %})">
    <div class="container">
      <h2 class="section-title">{% raw %}{{ section.headline }}{% endraw %}</h2>
      <p class="section-subtitle">{% raw %}{{ section.detail }}{% endraw %}</p>
    </div>
  </div>
{% raw %}{% endfor %}{% endraw %}
{% endhighlight %}

It's worth noting that collections in Jekyll are currently an experimental feature so the implementation might change in future versions.

One of the requirements in my original post was that the sections on the long-scrolling page should be accessible via full URL paths rather than ID hashes - i.e. `my-page.com/about` as opposed to `my-page.com#about`. This requirement has an implication for my choice of host.

When I've used Jekyll before on a [personal project](http://www.playsthis.com/) (and on this blog), I've used GitHub Pages as the host so I was ready to use it again here. However GitHub Pages [does not support the kind of front end routing](https://github.com/isaacs/github/issues/408) I needed to be able to intercept the URL and navigate to the right section based on the path in the request.

For this, I looked to another free static host, [Surge.sh](http://surge.sh/). Surge allows you to add a `200.html` page: a default landing page to use when no other file matches but you don't want to serve a `404`. This elegantly gets around the need for any server configuration and allows you to deal with routing at the front end either by writing your own logic, as I did here, or by using a library like [page.js](https://visionmedia.github.io/page.js/).

The final, re-implemented site is hosted [here](http://jekyll-scroll.surge.sh/).

<img src='{{ site.baseurl }}/tbarclay/assets/static-site/frontpage.png' title="Spluxr" alt="Spluxr front page" />

## [Gimme Gimme (static) Shock Treatment](https://www.youtube.com/watch?v=gj4u1yJMAf4)  - The Compromises

One of the requirements in [my original post]({{ site.baseurl }}/2015/09/18/meteor-scroll.html) about making this site was that it should be easy to add, remove and edit sections through a CMS. This implementation doesn't meet that requirement. New sections must be added to the `_sections` directory and then the site has to be redeployed using Surge's command line tool. For a developer, this is a perfectly nice, streamlined workflow, but of course it's not for everybody. And I think this is a problem static site generators have when compared with the Wordpresses and Squarespaces of the world: they aren't yet fully accessibly to non-technical collaborators like designers or copy writers.

If I developed this site for a non-technical client, the absence of a CMS might prevent them from being able to easily add new content. That could easily be a deal-breaker that would prompt them to dismiss this as an option.

There actually are tools out there, like [Netlify CMS](https://github.com/netlify/netlify-cms), that aim to fill this gap, although I haven't had a chance to try them yet, and from a quick glance they don't seem very mature yet. But the fact that there are options out there signals hope for static site generators to become more mainstream and take a bit more of the web market from the PHP-based, dynamic giants.
