---
author: ceberhardt
title: Jekyll Pagination and Infinite Scroll
layout: default_post
summary: "Recently I updated the Scott Logic blog to implement infinite scrolling using a combination of Jekyll pagination and jScroll. Both of these components are quite fussy about their respective configuration, meaning that integrating them took longer than expected. I thought I'd share my solution in this blog post, hopefully saving others from the hours I spent digging into jScroll code or cursing Jekyll!"
oldlink: "http://www.scottlogic.com/blog/2014/10/14/jekyll-pagination-and-infinite-scrolling.html"
disqus-id: /2014/10/14/jekyll-pagination-and-infinite-scrolling.html
categories:
  - Tech
---
Recently I updated the Scott Logic blog to implement infinite scrolling using a combination of Jekyll pagination and [jScroll](http://jscroll.com/). Both of these components are quite fussy about their respective configuration, meaning that integrating them took longer than expected. I thought I'd share my solution in this blog post, hopefully saving others from the hours I spent digging into jScroll code or cursing Jekyll!

For a quick example integration I've created a demonstration site on with the sourcecode available on [GitHub](https://github.com/ColinEberhardt/jekyll-pagination-infinite-scroll). You can see the rendered output below:

<style>
    .wrap { width: 600px; height: 390px; padding: 0; overflow: hidden; margin-bottom: 10px;}
    .frame { width: 800px; height: 520px; border: 1px solid black; }
    .frame {
        -ms-zoom: 0.75;
        -moz-transform: scale(0.75);
        -moz-transform-origin: 0 0;
        -o-transform: scale(0.75);
        -o-transform-origin: 0 0;
        -webkit-transform: scale(0.75);
        -webkit-transform-origin: 0 0;
    }
</style>

<div class="wrap">
<iframe class="frame" src="http://colineberhardt.github.io/jekyll-pagination-infinite-scroll/">
unwantedtext
</iframe> 
</div>

NOTE: The above `iframe` will no doubt render quite incorrectly on a mobile browser, so you might want to [visit the example project's generated site](http://colineberhardt.github.io/jekyll-pagination-infinite-scroll/) directly instead.

## Pagination with Jekyll

In order to paginate the index page (`index.html`) of a Jekyll site all you have to do is add the paginate property to the sites configuration:

{% highlight html %}
paginate: 10
{% endhighlight %}

This will cause the posts to be divided into pages and made accessible via the `paginator` object. Rendering the posts from a page is quite straightforward, rather than iterating over the contents of `site.posts`, instead iterate over `paginator.posts`:

{% highlight html %}
{％ for post in paginator.posts ％}
  <article>
    <header>
      <h2><a href="{{ site.scottlogic.url }}{{ post.url }}">{{ post.title }}</a></h2>
      <h5>{{ post.date | date: "%d %b %Y" }}</h5>
      <p>{{ post.content | truncatewords:50 | strip_html }}</p>
    </header>
  </article>
{％ endfor ％}
{% endhighlight %}

Generating your site using the pagination option results in Jekyll creating multiple copies of the index page, each containing the posts for the given page. The first page, `index.html` resides in the usual location, whereas subsequent pages reside in numbered sub-folders starting at `page2`:

<img src="{{ site.baseurl }}/ceberhardt/assets/JekyllPagination.png" />

This slightly peculiar structure makes the next part a little more tricky ...

The `paginator` object contains various other properties that can be used to render previous / next links to allow the user to navigate between the various pages. The following template can be used to render navigation links, notice the special casing for page #2 in order to navigate back to `index.html`, rather than `page1/index.html`, which does not exist!

{% highlight html %}
<!-- render pagination links if there are more than one pages -->
{％ if paginator.total_pages > 1 ％}
<div class="pagination">    
  {％ if paginator.previous_page ％}
    <!-- special case the second page to link back to index.html -->
    {％ if paginator.page == 2 ％}
      <a href="{{ site.scottlogic.url }}/">&laquo; Prev</a>
    {％ else ％}
      <a href="{{ site.scottlogic.url }}/page{{ paginator.previous_page }}/">&laquo; Prev</a>
    {％ endif ％}    
  {％ else ％}
    <!-- if no 'previous' pages exit, render a span rather than an anchor -->
    <span>&laquo; Prev</span>
  {％ endif ％}

  {％ if paginator.next_page ％}    
    <a class='next' href="{{ site.scottlogic.url }}/page{{ paginator.next_page }}/">Next &raquo;</a>
  {％ else ％}
    <!-- if no 'next' pages exit, render a span rather than an anchor -->
    <span class='next'>Next &raquo;</span>
  {％ endif ％}
</div>
{％ endif ％}
{% endhighlight %}

With the above code in place you can support pagination with Jekyll. The next step is integration of jScroll to give infinite scrolling!

## jScroll

[jScroll](http://jscroll.com/) is a jQuery plugin that works by magic, just add the following line of code to your site:

{% highlight javascript %}
$('.content').jscroll()
{% endhighlight %}

And Hey Presto! Infinite scrolling (it's SEO friendly too \*rolls eyes\*). Well, that's the theory.

Unfortunately, in practice jScroll is very sensitive to the way in which you structure the page so that it can work its magic. If your configuration or structure isn't correct, it fails silently and the only option is to delve into the code to find out what it expects.

Don't get me wrong, I think jScroll is very neat. It's simple and lightweight, but relies heavily on opaque conventions. In this post I'll describe some of the inner-workings of jScroll and show how to make it play nicely with Jekyll.

The way jScroll works its magic is actually pretty simple. When you instantiate the jScroll plugin from a DOM element, it searches for the link that is used to navigate to the next page. It then adds a few structural `div` elements that it uses for content insertion and tracking scroll location. When the user scrolls to the bottom of the screen jScroll adds a loading indicator, and fetches the next page via an XHR request. The contents of the response are then added to the page.

A few things you need to ensure are:

1. That the pagination links are within the DOM element used to construct jScroll. By default, it will search for the last anchor within this element and assume that the `href` attribute of this points to the next page. This is all a bit too 'magic' for my tastes, so I prefer to pass the `nextSelector` configuration option to jScroll, so that it can unambiguously locate the next link.
2. jScroll hides the pagination controls when it is created. It assumes that the parent of the 'next' anchor element contains the pagination controls. As you can see in my template above, the `div` with class `pagination` is the direct parent of the next anchor, so this structure is fine.
3. When jScroll fetches the next page, it will fetch an entire HTML page, e.g. `page2/index.html`. In order to update the current page it needs to identify the page fragment to extract and insert into the current page. This is achieved via the `contentSelector` configuration property.

As a result, the following jScroll configuration is suitable for paginating a Jekyll site:

{% highlight javascript %}
$('.content').jscroll({
    contentSelector: ".content",
    nextSelector: '.next'
});
{% endhighlight %}

One other issue I found with jScroll is that when you reach the final page, it doesn't hide the pagination links. I [fixed that in a fork of jScroll](https://github.com/ColinEberhardt/jscroll), I'll raise a pull request shortly :-)

Hopefully this blog post will help anyone else who is trying to integrate Jekyll and jScroll. When it works, it's really rather neat!

Remember to pop over to [GitHub](https://github.com/ColinEberhardt/jekyll-pagination-infinite-scroll) to see a fully functioning example.

Regards, Colin E. 























