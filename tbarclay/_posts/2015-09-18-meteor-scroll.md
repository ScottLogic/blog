---
author: tbarclay
title: Building a Jump Scroll Marketing Page with Meteor and OrionJS
title-short: Meteor and OrionJS
categories:
  - Tech
image: tbarclay/assets/featured/spluxr.jpg
tags:
  - featured
summary: >-
  Recently I needed to make a site for a personal project, and although I work
  on dynamic web apps for a living, I hadn't had to make a proper,
  honest-to-goodness website for years. There are plenty of well-known options
  out there for making sites quickly, like Wordpress and Squarespace, but why go
  for the quick option, I said to myself, when there's a learning opportunity to
  be had!
summary-short: This looks at building a jump-scroll website using Meteor and OrionJS
layout: default_post
---

Recently I needed to make a site for a personal project, and although I work on dynamic web apps for a living, I hadn't had to make a proper, honest-to-goodness website for years. There are plenty of well-known options out there for making sites quickly, like Wordpress and Squarespace, but why go for the quick option, I said to myself, when there's a learning opportunity to be had (uh... right?). I enjoyed experimenting with [Meteor](https://www.meteor.com/) for a [previous blog post](/2015/07/14/meteor.html) so I decided to see what I could do with that.

I had a few requirements:

* I wanted to make a slick, modern, long-scrolling product marketing site
* I wanted to use full URL paths - rather than ID hashes - for the different page sections and have jump scrolling navigation around the page
* I should be able to add, remove and edit the page sections through a web interface
* Of course it should be responsive

In this blog I'm going to work through making a product marketing website to these requirements.

Now, I don't know much about product marketing, but I do know that if you have a new product, you have to create its name by making up a word and then removing some vowels. So I'll make a page to market my new product/service/event/solution, Spluxr.

You can find the source of this project on [GitHub](https://github.com/timbarclay/jump-scroll-site).

<img src='{{ site.baseurl }}/tbarclay/assets/meteor/title.png' title="Spluxr" alt="Spluxr title screen" />

## Tooling up

First I'll set up a project in Meteor:

    meteor create jump-scroll-site

[OrionJS](http://orionjs.org/) provides a neat, easily customisable CMS for Meteor, so I'll add that:

    meteor add orionjs:core

To use Orion, I'll [also need](http://orionjs.org/docs/introduction) a front end framework - [Bootstrap](http://getbootstrap.com/), [Materialize](http://materializecss.com/) and [Foundation](http://foundation.zurb.com/) are all supported - and a routing package - with a choice between [Iron Router](https://github.com/iron-meteor/iron-router) and [Flow Router](https://github.com/kadirahq/flow-router):

    meteor add twbs:bootstrap fortawesome:fontawesome orionjs:bootstrap
    meteor add iron:router

While I'm at it, I'll remove the unsafe prototyping packages that Meteor ships with:

    meteor remove autopublish
    meteor remove insecure

At this point I'll also delete the auto-generated files that Meteor sets up in new projects and replace them with three directories, `client`, `server` and `lib`.

We can now start the server with the `meteor` command and see the Orion interface at `localhost:3000/admin`. However, the `localhost:3000` root will just show an error message about routes not being set up.

## Making the basic site

I'll start by setting up a few templates and some routing to get something up on the screen. The routing won't be very complicated for this site as there'll only be one page, so I'll set that up first. In lib/router.js:

{% highlight js %}
Router.route("/", {
  controller: 'MainController'
});

MainController = RouteController.extend({
  template: 'mainPage',
  layoutTemplate: 'layout'
});
{% endhighlight js %}

The strings set in MainController are the names of templates, so I'd better create those next. In client/templates/layout.html:

{% highlight html %}
<template name="layout">
  <div class="layout-page">
    {% raw %}{{> header}}{% endraw %}
    <div id="main">
      {% raw %}{{> yield}}{% endraw %}
    </div>
  </div>
</template>
{% endhighlight %}

The yield keyword tells Iron Router where to render whatever gets returned from its routing functions. In the route set up above, that will be the 'mainPage' template, so I'll create that now in client/templates/main_page.html:

{% highlight html %}
<template name="mainPage">
  <h1>Here's a page</h1>
</template>
{% endhighlight %}

The layout template also referred to a template called header, so I'll put that in client/templates/header.html:

{% highlight html %}
<template name="header">
  <header class="navbar navbar-default navbar-fixed-top" role="navigation">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
        data-target="#navigation">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="/#">Scrolling Site</a>
      </div>

      <div class="collapse navbar-collapse" id="navigation">
        <ul class="nav navbar-nav navbar-right">
        </ul>
      </div>
    </div>
  </header>
</template>
{% endhighlight %}

Now we'll create a static head element that will always get rendered regardless of routing. In client/main.html:

{% highlight html %}
<head>
  <title>Scrolling site</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>
{% endhighlight %}

## The dictionary

[The dictionary](http://orionjs.org/docs/dictionary) is an Orion construct that lets us set up arbitrary key value pairs that can be set through the admin interface and then referred to elsewhere. I'm going to use that to set various values for this site rather than hard coding them. So in lib/dictionary.js I'll add:

{% highlight js %}
orion.dictionary.addDefinition('title', 'site', {
  type: String,
  label: "Title"
});

orion.dictionary.addDefinition('description', 'site', {
  type: String,
  label: "Description"
});
{% endhighlight js %}

Now the dictionary will show up in the admin menu and clicking it brings up a form where I can set my title and description values.

<img src='{{ site.baseurl }}/tbarclay/assets/meteor/dictionary.png' title="Dictionary" alt="Setting values in the dictionary" />

Once that's set up I can show those values in the site.

First I can update my header to reflect the new title. So in client/templates/header.html, I'll change the "navbar-brand" link text:

{% highlight html %}
<a class="navbar-brand" href="/#">{% raw %}{{dict 'site.title'}}{% endraw %}</a>
{% endhighlight %}

The actual site title is a little different though. Spacebars templating in Meteor is only available within `template` elements and the `body` element but not in the `head` element. So, to set the site title dynamically I'll have to use a different approach. In lib/router.js:

{% highlight js %}
Router.configure({
  onAfterAction: function(){
    document.title = orion.dictionary.get('site.title', 'Website');
  }
});
{% endhighlight js %}

Now I'll set up a template to act as the title section of the page. In client/templates/title_page.html:

{% highlight html %}
<template name="titlePage">
  <div class="title-section">
    <div class="container">
      <h1 class="section-title">{% raw %}{{dict 'site.title' 'No title'}}{% endraw %}</h1>
      <p class="section-subtitle">{% raw %}{{dict 'site.description' 'No description'}}{% endraw %}</p>
    </div>
  </div>
</template>
{% endhighlight %}

And refer to this new template in client/templates/main_page.html:

{% highlight html %}
<template name="mainPage">
    {% raw %}{{> titlePage}}{% endraw %}
</template>
{% endhighlight %}

## Adding sections

This site will consist of a number of sections that will run down the page, so I'll start by creating a collection called `Sections`. Normally in Meteor, we'd create a `Mongo.Collection` but Orion provides its own [collection type](http://orionjs.org/docs/collections) that automatically hooks into its admin interface. In lib/section.js:

{% highlight js %}
Sections = new orion.collection('sections', {
  singularName: 'section',
  pluralName: 'sections',
  link: {
    title: 'Sections'
  },
  tabular: {
    columns: [
      {data: 'order', title: 'Page order', width: '20%'},
      {data: 'title', title: 'Title'}
    ]
  }
});
{% endhighlight %}

I'll also set up a publication from the server. In server/publications.js:

{% highlight js %}
Meteor.publish('sectionsPub', function(){
  return Sections.find();
});
{% endhighlight %}

Orion uses [autoform](https://github.com/aldeed/meteor-autoform) to allow creation of objects with a specified schema and automatically generating forms to submit them, so I'll set that up now back in lib/sections.js:

{% highlight js %}
Sections.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Section title"
  },
  id: {
    type: String,
    label: "Section Id"
  },
  order: {
    type: Number,
    label: "Section order"
  },
  headline: {
    type: String,
    optional: true,
    label: "Headline"
  },
  detail: {
    type: String,
    optional: true,
    label: "More detail",
    autoform: {
      type: 'textarea'
    }
  }
}));
{% endhighlight %}

Here I've set up the basic template of what a section will include. Now the menu in the admin interface will contain a link entitled Sections and from there we can add some content.

<img src='{{ site.baseurl }}/tbarclay/assets/meteor/section.png' title="Section form" alt="Adding a section" />

To show the sections on screen I'll need another template. So in client/templates/section.html:

{% highlight html %}
<template name="section">
  <div id="{% raw %}{{id}}{% endraw %}" class="section">
    <div class="container">
      <h2 class="section-title">{% raw %}{{headline}}{% endraw %}</h2>
      <p class="section-subtitle">{% raw %}{{detail}}{% endraw %}</p>
    </div>
  </div>
</template>
{% endhighlight %}

And I'll need a place to show them in client/templates/main_page.html:

{% highlight html %}
<template name="mainPage">
    {% raw %}{{> titlePage}}

    {{#each sections}}
      {{> section}}
    {{/each}}{% endraw %}
</template>
{% endhighlight %}

Finally we can wire up the data into this template in lib/router.js:

{% highlight js %}
Router.configure({
  waitOn: function(){
    return Meteor.subscribe("sectionsPub");
  },
  onAfterAction: function(){//...}
});

// Router.route...

MainController = RouteController.extend({
  template: 'mainPage',
  layoutTemplate: 'layout',
  data: function(){
    return {sections: Sections.find({}, {sort: {order: 1}})};
  }
});
{% endhighlight %}

We should now have any sections we add through the admin interface showing up on the main page under the title section.

Since we configured Iron Router to wait on our sections subscription, it would be nice to show a loading indicator in case there's a delay.

I'll add a package to provide a spinner for me to make life a bit easier.

    meteor add sacha:spin

And then add a new template in client/templates/loading.html:

{% highlight html %}
<template name="loading">
  {% raw %}{{> spinner}}{% endraw %}
</template>
{% endhighlight %}

And add it to the router configuration in lib/router.js:

{% highlight js %}
Router.configure({
  loadingTemplate: "loading",
  waitOn: function(){//...},
  onAfterAction: function(){//...}
});
{% endhighlight %}

## Navigation

So now I can add content through Orion's admin interface and see it on the main page, I need to add some navigation. Iron Router supports hash routing as standard, but my requirement was for each section to have its own full URL path, so that's going to take a bit of extra work.

One of the benefits of avoiding hash routing and going to this extra effort to set up distinct paths to my sections is that I'll be free to update my design to a more traditional multi-page site if and when the current trend for long scrolling landing pages comes to an end. As long as my new pages maintain the paths of my old sections, nobody will have to update their links or bookmarks. Of course this would only be a benefit for certain use cases, but I think it's a nice option to have.

First I'll handle updating the URL while the user scrolls around the page. In client/template_logic/main_page.js:

{% highlight js %}
Template.mainPage.onRendered(function(){
  updateOnScroll();
});

function updateOnScroll(){
  $(window).on('scroll', function(){
    var sections = $('.section');
    var scrollPosition = window.pageYOffset;
    var pastSections = sections.filter(function(index, element){
      return $(element).offset().top <= scrollPosition;
    });
    if(pastSections.length > 0){
      var lastSection = pastSections[pastSections.length - 1];
      var newPath = lastSection.attributes['id'].value;
      var currentPath = location.pathname.slice(1);
      if(currentPath !== newPath){
        window.history.replaceState(newPath, "", "/" + newPath);
      }
    } else if(location.pathname.slice(1)){
      window.history.replaceState(newPath, "", "/");
    }
  });
}
{% endhighlight %}

Here I'm setting up a `scroll` event listener. When the event fires, I'm check the current scroll position against the position of the top of each of the sections to find the last one that has been scrolled past. If that section is different from the one currently in the URL path, I use the `window.history` API to update the path accordingly. Note that with `replaceState()` I'm not altering the browser's history. The back button will still take the user to the page they visited from rather than the section they scrolled from.

Next I'll set up navigation within the page from the nav bar. I'll add the links in client/templates/header.html:

{% highlight html %}
<!-- other stuff -->
<div class="collapse navbar-collapse" id="navigation">
  <ul class="nav navbar-nav navbar-right">
    {% raw %}{{#each sections}}
      {{> headerLink}}
    {{/each}}{% endraw %}
  </ul>
</div>
<!-- other stuff -->

<template name="headerLink">
  <li><a href="{% raw %}{{id}}{% endraw %}" class="scroll-link">
    {% raw %}{{title}}{% endraw %}
  </a></li>
</template>
{% endhighlight %}

Then I'll have to set up handling for these links manually, so I'll add client/template_logic/header.js:

{% highlight js %}
Template.header.events({
  'click .scroll-link': function(e){
    e.preventDefault();
    var path = e.currentTarget.attributes['href'].value;
    var section = $("#" + path);
    window.history.pushState(path, "", "/" + path);

    $('html, body').animate({
      scrollTop: section.offset().top
    }, 1000);
  },

  'click .navbar-brand': function(){
    $('html, body').animate({
      scrollTop: 0
    }, 500);
  }
});
{% endhighlight %}

This time I'm using `pushState()` to update the URL path. This means that I am adding a new entry into the browser's history.

This presents a small problem. I previously set up a scroll listener to update the URL when the user scrolls into a new section. Now I've set up an animated scroll when a user clicks a link. This means that when a user clicks a link, the URL path will update for every section it passes through on its way to its destination section. This isn't the biggest problem in the world, but it isn't ideal, so I'll add a flag to the session variable so I can tell when it was a triggered scroll and not the user scrolling.

In client/template_logic/header.js:

{% highlight js %}
Template.header.events({
  'click .scroll-link': function(e){
    // other stuff

    Session.set('scrolling', true);
    $('html, body').animate({
      scrollTop: section.offset().top
    }, 1000, function() { Session.set('scrolling', false);});
  },
  // other stuff
});
{% endhighlight %}

In client/template_logic/main_page.js

{% highlight js %}
function updateOnScroll(){
  $(window).on('scroll', function(){
    if(Session.get('scrolling')) return;

    // other stuff
  });
}
{% endhighlight %}

## Links to sections

Having these nice, proper URL paths for our sections isn't much use unless people can link to them and bookmark them. At the moment I can scroll to a section and see its path in the address bar, but if I try to navigate straight to that URL, I'll get an error message from Iron Router complaining that there's no route set up.

<img src='{{ site.baseurl }}/tbarclay/assets/meteor/no-route.png' title="No route" alt="No route message" />

I'll solve this by adding another catch-all route in the router that directs to the `mainPage` template. Then I'll handle scrolling to the correct section myself.

So in lib/router.js I'll add:

{% highlight js %}
Router.route("/:path", {
  controller: 'MainController'
})
{% endhighlight %}

Then in client/template_logic/main_page.js:

{% highlight js %}
Template.mainPage.onRendered(function(){
  scrollToPath();
  updateOnScroll();
});

function scrollToPath(){
  var path = Iron.Location.get().path.slice(1);
  if(path){
    var element = $("#" + path);
    if(element.length > 0){
      $(document).scrollTop(element.offset().top);
    }
  }
}
{% endhighlight %}

## Backgrounds

I've pretty much met the requirements now, but it doesn't look very interesting. One thing all modern marketing sites need is big, full-width images. And again I'll have to be able to add these through the admin interface. Orion can use various [specific schema attributes](http://orionjs.org/docs/image-attribute) to handle file and image uploads so I'll add those now.

    meteor add orionjs:filesystem
    meteor add orionjs:image-attribute
    meteor add vsivsi:orion-file-collection

It would also be handy to be able to pick a background colour for a section instead of an image, so I'll also add a package that provides a colour picker input for autoforms:

    meteor add michalvalasek:autoform-bootstrap-colorpicker

Now I can add some extra attributes to my section schema. In lib/sections.js:

{% highlight js %}
Sections.attachSchema(new SimpleSchema({
  title: {//...},
  id: {//...},
  order: {//...},
  headline: {//...},
  detail: {//...},
  backgroundColour: {
    type: String,
    autoform: {
      type: "bootstrap-colorpicker"
    },
    label: "Background colour (optional)",
    optional: true
  },
  backgroundImage: orion.attribute('image', {
    label: "Background image (optional)",
    optional: true
  })
}));
{% endhighlight %}

Since I've made the image and colour fields optional, I'll add a bit of logic to figure out what to do with them. In client/template_logic/section.js:

{% highlight js %}
Template.section.helpers({
  background: function(){
    if(this.backgroundImage){
      return "background-image: url(" + this.backgroundImage.url + ")";
    }
    return "background-color: " + this.backgroundColour || "#ffffff";
  },
  hasBackgroundImage: function(){
    return !!this.backgroundImage;
  }
});
{% endhighlight %}

`background` returns a CSS property, so now I can use that in my template. In  client/templates/section.html:

{% highlight html %}
<div id="{% raw %}{{id}}{% endraw %}" class="section {% raw %}{{#if hasBackgroundImage}}{% endraw %}overlay{% raw %}{{/if}}{% endraw %}"
    style="{% raw %}{{background}}{% endraw %}">
    <!-- content -->
  </div>
{% endhighlight %}

I'm also using the `hasBackgroundImage` helper to add a class `overlay` so I can include some more styling to try and make sure my text doesn't get lost in whatever image a user could upload.

Now, after a quick trip to [pexels.com](https://www.pexels.com/), I can make Spluxr look a bit more engaging.

<img src='{{ site.baseurl }}/tbarclay/assets/meteor/section-with-bg.png' title="A section with a background image" alt="A section with a background image" />

And now all that remains is to set up a million dollar Kickstarter campaign...
