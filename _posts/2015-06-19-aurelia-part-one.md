---
title: Creating less2css using Aurelia
date: 2015-06-19 00:00:00 Z
categories:
- Tech
author: lpage
layout: default_post
summary: This post gives a walkthrough of a project that makes use of the new Aurelia framework. It also take a look at how it compares to Angular 2.0, which is still in development.
image: lpage/assets/featured/aurelia-large.png
---

### The Aurelia Story

Aurelia is project created by Rob Eisenberg, a former member of the Angular 2.0 team and creator of Durandal and Caliburn. In his own words...

 > I left Angular 2.0 to build Aurelia, something that I believe is more in line with what the Angular community had hoped for in 2.0. It also draws from the best parts of Durandal and merges these ideas together into a consistent JavaScript application development experience for mobile, desktop and web.

After reading through [an example of porting a simple app from angular 2 to Aurelia](http://eisenbergeffect.bluespire.com/porting-an-angular-2-0-app-to-aurelia/) I was intrigued and felt it was worth giving it a go to find out what it was like, how different it was and how close it was to being production ready.

### less2css

The [less2css](http://www.less2css.org) site allows you to try out less and see the resultant css. Its been a great learning and testing tool, but has been out of date a while (version 2 not available) and it's been frustrating that its not hosted on github pages (it hasn't been that reliable) and that it requires a server-side component. I thought this would be a good project to try Aurelia out on.

### Creating the Skeleton

First I created the repo..

{% highlight bash %}
$ mkdir less2css-site
$ cd less2css-site/
$ git init
$ npm init
{% endhighlight %}

Then, following the [getting started guide](http://aurelia.io/hub.html#/doc/article/aurelia/framework/latest/quick-start)...

{% highlight bash %}
$ npm install -g gulp
$ npm install -g jspm
$ jspm registry config github
$ npm install -g yo generator-aurelia
$ yo aurelia
{% endhighlight %}

This creates a copy of [the Aurelia skeleton navigation project](https://github.com/aurelia/skeleton-navigation). It also runs `npm install` to get node packages for the build chain and uses [jspm](http://jspm.io/) to download libraries that will be used.

I can see there is a `gulp serve` command and when I run that I get a web server and an Aurelia site that works.

<img src="{{ site.baseurl }}/lpage/assets/aurelia-one/aurelia-skeleton-start.png" alt="Aurelia skeleton load screen" />

<img src="{{ site.baseurl }}/lpage/assets/aurelia-one/aurelia-skeleton-pageone.png" alt="Aurelia skeleton first page" />

### A single text editor

The first thing I'm going to do is try removing all the pages but one. `index.html` is just a bootstrapper and the rest of the files are in src. I'll keep the router for now, but [remove the nav bar](https://github.com/less/less-preview/commit/6a5a677813f4ae6e5b3fa450d204982759b6a01b).

Starting with the riskiest part, which is the text editor, I've decided to use a project called [CodeMirror](https://codemirror.net/), which provides a fully featured text editor written in JavaScript for the browser, with support for various languages, Less and CSS included. First off, I need the CodeMirror files, so I try to get them with jspm..

{% highlight bash %}
$ jspm install npm:codemirror
{% endhighlight %}

Which downloads the files and puts them into the jspm_packages folder. A google for codemirror jspm had shown that I need an extra bit of configuration in package.json, so I add that..

{% highlight js %}
// package.json
...
  "jspm": {
    "dependencies": {
...
      "codemirror": "npm:codemirror@^5.3.0",
    },
    "overrides": {
      "npm:codemirror@5.3.0": {
        "shim": {
          "lib/codemirror.js": {
            "exports": "CodeMirror"
          }
        }
      },
{% endhighlight %}

You might recognise the syntax as being close to requirejs and that may be because there are some familiar faces involved in jspm that contributed to requirejs.

I create a new element for my editor, by adding an html template and a JavaScript file with the same name. There may be some way to associate the files that isn't just by naming convention, but I'm not sure what it is.

Then I add some code to see if I can get at the library now...

{% highlight js %}
import CodeMirror from 'codemirror';
alert(CodeMirror);
{% endhighlight %}

And when I run the site, I see it is available!

The next thing I need is a DOM element, to give to code mirror in order for it to create its editor. After a little searching I see I can use the `ref` attribute to get an element to be assigned to my view model. Unlike angular this doesn't require any prefixing, but the attribute is used in polymer too, so it may be also in a spec associated with web components and that may protect it against future additions to the HTML spec.

At this point you might reel back in horror at getting a reference to an element inside your code. In Angular you might be using directives for a layer of dom manipulation and controllers for manipulating those directives and containing the model. Or you might not be using any controllers at all, treating directives as your controllers and abstracting as much logic as possible to services. This second approach fits better with what Aurelia does (it has no controllers, just a view model which can interact in both directions with the dom), but it also fits with what Angular 2 has planned. The reasoning ties into web components, because a native element/web component exposes an API that might not be so low level. For instance the video element has a play function on it, if you want to play that video when an event is raised, you need to access the element and writing another piece of code that mirrors the API may not be worth it.

So, my first attempt was to use a property setter. I had the following html template in `cmeditor.html`:

{% highlight html %}
<template>
  <textarea ref="cmTextarea">This is a text editor</textarea>
</template>
{% endhighlight %}

And view model in `cmeditor.js`:

{% highlight js %}
import CodeMirror from 'codemirror';

export class cmeditor {
  set cmTextarea(value) {
    CodeMirror.fromTextArea(value);
  }
}
{% endhighlight %}

and I could use it in my main view...

{% highlight html %}
<require from='./cmeditor'></require>
<cmeditor />
{% endhighlight %}

Which gives me a text editor on the page.

<img src="{{ site.baseurl }}/lpage/assets/aurelia-one/text-editor.png" alt="A simple text editor included" />

You can see that it seems to be missing some styling, so next I add gulp-less to the skeleton and get it set up as part of the build. However I need a way of including the code mirror css file, downloaded by jspm. From the skeleton project I see bootstrap is using `!` (familiar to require js users), so I looked up the path to the css by finding where jspm downloaded the file to and added...

{% highlight js %}
import 'codemirror/lib/codemirror.css!';
{% endhighlight %}

And I can do the same thing to include the CSS/Less language highlighting plugin and a cobalt theme...

{% highlight js %}
import 'codemirror/lib/codemirror.css!';
import 'codemirror/theme/cobalt.css!';
import 'codemirror/mode/css/css';
{% endhighlight %}

But I found I was getting some strange styles from CodeMirror, supposedly caused by code mirror being initiated when the element is not visible. The problem was that code mirror was being initiated when hidden and I realised that instead of using an element setter, I need to add a function called `attached` to my view model and that will get called at the right time.

{% highlight js %}
export class cmeditor {
  attached() {
    CodeMirror.fromTextArea(this.cmTextarea, {
      lineNumbers: true,
      matchBrackets : true,
      mode: "text/x-less",
      theme: "cobalt"
    });
  }
}
{% endhighlight %}

And below is shown my now working text editor...

<img src="{{ site.baseurl }}/lpage/assets/aurelia-one/one-editor.png" alt="A text editor with less syntax highlighting" />

### Multiple text editors

Next, I want to try having two editors, one of which is read only - the left hand side will be the less editor and the right hand side the resultant css editor which will be read only. Strangely I found that having the two elements be the children of a single parent didn't work, but everything went okay when I added sub div's which will probably be needed anyway.

{% highlight html %}
  <require from='./cmeditor'></require>
  <section class="au-animate">
    <div class="cm-less">
      <cmeditor />
    </div>
    <div class="cm-css">
      <cmeditor readonly="true" />
    </div>
  </section>
{% endhighlight %}

Next, I need to get hold of the readonly attribute I set above inside my element. I tried seeing if it was just put on the viewmodel, but it wasn't. However, a short 'ES7 attribute' later and it worked..

{% highlight js %}
import { bindable } from 'aurelia-framework';

//...

export class cmeditor {
  @bindable readonly;
  attached() {
    CodeMirror.fromTextArea(this.cmTextarea, {
      readOnly: this.readonly

//...
{% endhighlight %}

I also added a custom element attribute `@customElement("cmeditor")` though it seemed to be fine without.

The next risky thing is browser support - as it seems [IE9 support is a new thing](http://aurelia.io/docs.html#browser-support). So I followed the instructions and hit problems. I solved it and sent a [PR to update their instructions](https://github.com/aurelia/documentation/pull/111). Hopefully it should be easier for the next person!

### Less compilation

I want to set up the bindings and have less compile source code as the user types, so I write a utility class that loads less from our CDN and a static gulp task that generates a list of less versions (since the CDN has no directory listing we can scan).
If you are coming from Angular 1, you might expect Aurelia to want to know about services, but it doesn't have its own module system (it uses jspm), you just create a [new ES6 module that does what you want](https://github.com/less/less-preview/blob/dd4a9ca3286d442588c95037f511793d8c23fed8/src/less.js).

I add another `@bindable value;` to the editor, meaning I can bind to it from outside. Then I update the value when code mirror changes...

{% highlight js %}
this.codeMirror.on('change', (codeMirror, changeObj) => {
  const newValue = codeMirror.getValue();
  if (newValue !== this.value) {
    this.value = newValue;
  }
});
{% endhighlight %}

Now, I need to bind to this `value` from outside my code mirror editor element. A one-way binding means data flows from the view model to the element, but I can also use a two-way binding, so data flows both ways, which means I can pick up changes to the editor in my main view model..

{% highlight html %}
<cmeditor value.two-way="lessSrc" />
{% endhighlight %}

{% highlight js %}
  set lessSrc(value) {
    this._lessSrc = value;
    less.convert(value)
      .then((cssResp) => {
        this.css = cssResp.css;
      });
  }
{% endhighlight %}

Now my view model updates a `css` property when the Less source code is edited. So, I bind this to my 2nd editor..

{% highlight html %}
<cmeditor readonly="true" value.bind="css" />
{% endhighlight %}

Then I need to make my editor update its contents when the value changes. I got a bit stuck here, because I initially tried a property setter like lessSrc, but that doesn't work because the `@bindable` annotation adds a getter and setter as part of its implementation. The solution is that when you have a `@bindable`, a function (if it exists) `xChanged` will be called when the field changes. So I add one...

{% highlight js %}
  valueChanged(newValue, oldValue) {
    if (this.codeMirror && newValue !== this.codeMirror.getValue()) {
      this.codeMirror.setValue(newValue);
    }
  }
{% endhighlight %}

<img src="{{ site.baseurl }}/lpage/assets/aurelia-one/less-to-css.png" alt="two text editors, one showing Less and one showing CSS" />

And now I have 2 editors, when I edit Less code in one, the CSS code in the right changes!

### Saving to the URL

I want the less code to be saved on the URL so that you can link to code examples and while playing with setting `location.hash`, I find you get a routing exception even when routing isn't configured. So, I decided to start removing routing. Aurelia is built as a very small core framework with plugins for everything (from templating to routing to http). Aurelia is generally started with [Aurelia bootstrapper](https://github.com/aurelia/bootstrapper) which imports all the modules and then you choose which ones you want to initialise. From the documentation, here is a setup example...

{% highlight js %}
  aurelia.use
    .defaultBindingLanguage()
    .defaultResources()
    .history()
    .router()
    .eventAggregator()
    .plugin('./path/to/plugin');

  aurelia.start().then(a => a.setRoot('app', document.body));
{% endhighlight %}

However, it seems that modules are always imported, you can only choose which ones are started and I don't want the source on my page at all, so I forked the bootstrapper file and adjusted it to remove dependencies to the router and history. [This seems to work well](https://github.com/less/less-preview/commit/d5b802677b82b95713af9f2c630c790a80816ab8) and I can now load the app without including any router code. Once bundling is announced I may re-visit this as it seems there should be a simpler solution.

To get the URL to contain the current state I first need to get the data on to the URL. So, in the app element (which you might think of as the main controller), I just need to update the URL when the lessSrc value changes.

{% highlight js %}
set lessSrc(value) {
  this._lessSrc = value;
  if (value !== defaultLessSrc) {
    window.location.hash = "#" + encodeURIComponent(JSON.stringify({less: value}));
  }
{% endhighlight %}

Now I'll look at loading - I need to set the lessSrc variable from the constructor for when the page loads..

{% highlight js %}
constructor() {
  // ...
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  let loadedFromHash = false;
  if (hash) {
    try {
      const data = JSON.parse(hash);
      this.lessSrc = data.less;
      loadedFromHash = true;
    }
    catch(e) {
    }
  }
  if (!loadedFromHash) {
    this.lessSrc = defaultLessSrc;
  }
}
{% endhighlight %}

And I need to add a line to the editor element so that it picks up the value on startup..

{% highlight js %}
  attached() {
    // ... create code mirror
    this.codeMirror.setValue(this.value || "");
{% endhighlight %}

And that works!

I also took the styling from the existing site, so now it is looking more familiar.

<img src="{{ site.baseurl }}/lpage/assets/aurelia-one/less2css-url.png" alt="Site showing less on the left, css on the right and a url encoded with the current less value" />

You can see the work in progress [here](http://www.lesscss.org/less-preview) and the [source code is all on github](https://github.com/less/less-preview).

On an external server without bundling, the site takes 12 seconds to load - please see [my next post for how I tackled bundling and how it effected performance]({{ site.baseurl }}/2015/06/29/aurelia-part-two.html).

In later posts I will look at binding the options panel and evaluating what I think of Aurelia.
