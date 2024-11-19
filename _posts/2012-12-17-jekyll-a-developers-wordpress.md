---
title: Jekyll - A Developer's Wordpress?
date: 2012-12-17 00:00:00 Z
categories:
- Tech
tags:
- blog
id: 165416
author: cprice
oldlink: http://www.scottlogic.co.uk/2012/12/jekyll-a-developers-wordpress/
layout: default_post
source: site
disqus-id: "/2012/12/jekyll-a-developers-wordpress/"
summary: We're very soon to launch a site documenting an open source project we've
  been hard at work producing. As the project is hosted on github, we'll be making
  use of the Github Pages hosting feature which itself is built on top of Jekyll.
---

## *Outrageous pun intentionally... hyde-n...*

*We're very soon to launch a site documenting an open source project we've been hard at work producing. As the project is hosted on github, we'll be making use of the Github Pages hosting feature which itself is built on top of Jekyll. As all my recent experience of blogging sites has been in Wordpress (i.e. this site!) I thought it would be interesting to look into how and why Jekyll is different.*

### The Official Word

* WordPress is web software you can use to create a beautiful website or blog. We like to say that WordPress is both free and priceless at the same time. [http://wordpress.org/](http://wordpress.org/)
* Jekyll is a simple, blog aware, static site generator. [https://github.com/mojombo/jekyll](https://github.com/mojombo/jekyll)

Just from those one-line descriptions (and the URLs!) I think you can get a good feel for the differences. Wordpress is a complete platform, allowing tech-savvy and non-savvy users alike to create and manage content. Whereas Jekyll is a far simpler, developer oriented site generation tool.

### Authoring content

In Wordpress, all content is created and maintained through the administration interface, using either a WYSIWYG or plain-HTML editor. The content is then saved to a database and served up as it is requested (a cache of the rendered version helps to speed things up). This is normally done directly on the live running instance.

In Jekyll all content is created and maintained directly on the filesystem. Each post is a file written in either Markdown, Textile or HTML, with metadata stored in a YAML header at the top of the file. The content is then processed offline by Jekyll to produce a folder of generated content that can be published to any static web server.

### Templating Content

Both systems offer very similar capabilities for classifying content, applying templates to the content based on category and reusing snippets between templates. The main difference is the templating language used, Wordpress templates tend to use PHP and Jekyll makes use of Liquid.

### Revisioning Content

In Wordpress, there's the concept of saving a draft version before publishing and previewing changes before updating an article but for a complete history of all changes to an article you need to turn to [a plugin](http://wordpress.org/extend/plugins/revision-control/).

In Jekyll, at a basic level you are in control of when to re-generate and publish the site, as well as each post having a metadata flag to control whether a it should be included. However, because Jekyll stores all content and templates on the filesystem you're free to use whichever SCM (git/hg/svn) tool you feel most comfortable with to completely revision not only the content but also the templates.

### Dynamic Content

In Wordpress, most dynamic content (comments/forms/search) can easily be created using one of the plethora of plugins available or in the odd rare case coding it yourself. Most of these plugins are configured through the administration interface and are very easy even for non-technical users to configure.

In Jekyll, there isn't any facility for hosting dynamic content so none of these features can be supported by Jekyll itself. However, there exist many third party services which provide some equivalent functionality, sometimes for free but quite often at the expense of adverts (e.g. [Google Custom Search](http://www.google.com/cse/)) or user-tracking (e.g. [Disqus](http://disqus.com/)/[Livefyre](http://www.livefyre.com/)). It's worth noting that it is not uncommon to see these services used with Wordpress as well.

### Conclusion

There's no doubting that Wordpress is a far more powerful and feature-rich offering when you consider the average user and the average blog. However, as a developer I spend most of my days manipulating files in complex text editors, scripting together command line programs and using an unhealthy amount of git (a.k.a. we're not normal!). And for that reason I just can't help but like the simplicity of Jekyll.

I don't use Wordpress's WYSIWYG editor and find myself frustrated by the simplistic HTML editor ([turns out I'm not  alone](https://premium.wpmudev.org/blog/why-you-hate-the-wordpress-text-editor/?utm_source=feedburner)). Common keyboard shortcuts you expect to work don't, syntax highlighting is often flaky and heaven-forbid you accidentally swap back to the WYSIWYG editor! The Jekyll approach of offline, file based editing in your favourite text editor is much more appealing.

I don't share Wordpress's requirement for the content and templates to be well separated, with content in the database and templates on the filesystem. I'm comfortable with markup and in fact I consider it an advantage of Jekyll to be able to manipulate both at the same time and in the same way.

I don't like making changes in live! Now this is definitely the developer inside me talking, but making changes directly to a live instance makes me uneasy. In Wordpress creating the content is as much of a feature of the live instance as consuming the content. Whereas, with Jekyll consuming the content is the only feature of the live instance. Knowing that I can make large changes to the site offline, using whatever tools I see fit and all the while knowing that an SCM system has my back, puts me far more at ease.

To be clear, these aren't the requirements of an average user, **Wordpress is an excellent tool for most** and Jekyll too is not without its downsides. Not least of which [the very lengthy Window's install process](http://www.madhur.co.in/blog/2011/09/01/runningjekyllwindows.html), [the "quirky" capabilities of its categories/tags/pagination](https://github.com/mojombo/jekyll/pull/521), [inconsistencies in its object model](https://github.com/mojombo/jekyll/issues/171) and [questions over its maintenance](https://github.com/mojombo/jekyll/issues/578) (UPDATE: [no more!](https://github.com/mojombo/jekyll/issues/578#issuecomment-11414645)) - but I'll save all these for another post. It's just that for me, as a developer, Jekyll permits a process and tooling that I'm far more comfortable with for a simple site.
