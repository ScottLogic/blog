---
title: Aurelia, less2css and bundling
date: 2015-06-29 00:00:00 Z
categories:
- Tech
author: lpage
layout: default_post
summary: In the second post of my series on the Aurelia framework I walkthrough bundling
  the less2css project. The result of which significantly reduced the load time, but
  did uncover a few aspects of the Aurelia bundling process that do not yet feel fully
  formed.
---

Please read [my first post](http://blog.scottlogic.com/2015/06/19/aurelia-part-one.html) for an introduction.

At the end of that post, I said that it takes a long time for the site to load, something I attributed mainly down to the fact that the JavaScript was not bundled, so Chrome was making many network requests to get the content. Here is the devtools network tab of the site running locally (hence why it is much faster than what I saw running on github pages)..

<img src="{{ site.baseurl }}/lpage/assets/aurelia-two/unbundled.png" alt="Chrome devtools timeline of the non-bundled source" />

In this post, I will cover bundling. I'll try not to cover [what Rob Eisenberg has already blogged about](http://blog.durandal.io/2015/06/23/bundling-an-aurelia-application/) - please read that post for a good introduction.

My first port of call is creating the Aurelia file which will control what is bundled. Lets talk through that file.

{% highlight js %}
var aurelia = require('aurelia-cli');

aurelia.command('bundle', {
{% endhighlight %}

First we get the Aurelia CLI and register a bundle command. The long-term intention seems to be that you could register multiple commands to set up parts of the project. I find this a bit strange, given the heavy use of other tools and
that the example project uses gulp, I would have thought concentrating on making a `gulp-aurelia-bundler` would have made more sense.

{% highlight js %}
  js: {
    'dist/app-bundle': {
      modules: [
        '*',
        "aurelia-dependency-injection",
        "aurelia-event-aggregator",
        "aurelia-framework",
        "aurelia-loader-default",
        "aurelia-logging-console",
        "aurelia-templating-binding",
        "aurelia-templating-resources",
        "codemirror",
        "polymer/mutationobservers",
      ],
      options: {
        inject: true,
        minify: true
      }
    }
  },
{% endhighlight %}

There are two bundles I am defining, JavaScript and HTML, which are separate files.
We list the things we want to be included - it seems `*` specifies all our built javascript in the dist folder
and after that we specify the projects top level dependencies, which includes those and their sub dependencies.

The `inject` option specifies that the `config.js` file should be modified during bundling to include a reference to the bundle. More on that later.

{% highlight js %}
  template: {
    'dist/app-bundle': {
      pattern: 'dist/*.html',
      options: {
        inject: true,
      }
    }
  }
});
{% endhighlight %}

Lastly, we specify our html templates and bundle them into the dist folder also. The inject places a reference to the bundle into our `index.html`.

This looks like this..

{% highlight html %}
<link aurelia-view-bundle="" rel="import" href="./dist/app-bundle.html"></body></html>
{% endhighlight %}

Which means the index.html (which contains things written by me as well, it is not auto generated) is modified to be used in a bundling scenario.

For the JavaScript, the inject option modifies the `config.js` file (which is loaded by the site) to include a bundling definition..

{% highlight js %}
System.config({
//...
  "bundles": {
    "app-bundle": [
      "github:polymer/mutationobservers@0.4.2/MutationObserver",
      "github:polymer/mutationobservers@0.4.2",
      "npm:process@0.10.1/browser",
      "npm:process@0.10.1",
      "github:jspm/nodelibs-process@0.1.1/index",
      "github:jspm/nodelibs-process@0.1.1",
      //...
{% endhighlight %}

Which means that systemjs will look in the bundle file for those packages. It again means that the `config.js` file can no longer be used in a non-bundled scenario.

The Aurelia team are working on API, but for now it seems the way to get bundling to happen inside gulp is to exec the `aurelia` command.

So, I make a command to run `aurelia bundle`:

{% highlight js %}
gulp.task('bundle-cmd', ['build', 'clean-bundle'], function(callback) {
  exec('node node_modules/aurelia-cli/bin/aurelia bundle', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    callback();
  });
});
{% endhighlight %}

However, this currently takes 13 seconds on my system - not something I want to include as part of a watch task, happening every time a change is made.

In addition, the setup seems a bit strange - JS source and HTML is transpiled into the dist folder, but then the bundle is built from the dist folder, meaning the bundled and un-bundled files end up in the same folder.

I've [raised these concerns](https://github.com/aurelia/skeleton-navigation/pull/108#issuecomment-114781861) with the team and hopefully things will improve - bundling is a new thing for Aurelia CLI and it will probably take some time to get the process right.

For now, I've created a process to copy the modified files to a new directory (for release purposes) and then run `git checkout` in order to revert my files.

{% highlight js %}
gulp.task('bundle-copy', function () {
  return gulp.src(paths.bundleSrc, { base: './' })
    .pipe(gulp.dest(paths.bundleOutput));
});

gulp.task('bundle-post-revert', function(callback) {
  exec('git checkout -- config.js index.html', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    callback();
  });
});

gulp.task('bundle', function() {
  return runSequence(
    'bundle-cmd',
    'bundle-copy',
    'bundle-post-revert'
  );
});
{% endhighlight %}

Which seems to work well, giving me a bundled version in one directory and non-bundled in another. Now if I look at the bundled site I see eight requests (one of which is less loaded by the app). Note, this is on an external server, which is why the load time is longer than non-bundled - but this was previously taking 12 seconds, so it is much improved.

<img src="{{ site.baseurl }}/lpage/assets/aurelia-two/bundled.png" alt="Chrome devtools timeline of the bundled source" />

[Someone has already raised an issue](https://github.com/aurelia/cli/issues/114) to investigate how the remaining files could be bundled together.

It still seems slow, and doing a flame chart in chrome seems to suggest it is being caused by the systemjs and es6-module-loader (the purple and mauve colours).

<img src="{{ site.baseurl }}/lpage/assets/aurelia-two/chrome-flame.png" alt="Chrome devtools flame diagram of loading" />

I hope this corresponds to Rob Eisenberg's comment on my previous post.

 > ... a system.js bug that also affects all the transpilers: TypeScript, Babel and Traceur. It causes exponential module lookup in certain scenarios. It's actually a problem with the spec we helped identify a few weeks back. The fixes are being worked on, so once that hits things should load faster.

### Firefox and IE

I then tried the site in Firefox and found it didn't load.

<img src="{{ site.baseurl }}/lpage/assets/aurelia-two/mozilla-error.png" alt="Firefox showing an error loading" />

Which seems to be [because optional dependencies are not included in the bundle by default](https://github.com/aurelia/cli/issues/115). The solution for now, is that optional dependencies have to be specified manually. In this case adding `"github:webcomponents/webcomponentsjs@0.6.3/HTMLImports.min"` to my Aureliafile helped and Firefox loaded, but then I got another problem with IE because `"aurelia-html-template-element"` is also optional and only required in IE.

Lastly, I tried IE9, which seemed incredibly slow. I couldn't profile it because every time I profiled the site stopped working. Luckily for me, this site is for developers, so I hope the number of IE9 users will be minimal.

<img src="{{ site.baseurl }}/lpage/assets/aurelia-two/ie9.png" alt="IE taking 9 seconds to load" />

### File sizes

Comparing the bundled files sizes..

- Code Mirror - 171KB minified, 60KB GZip'd
- Aurelia and dependencies (excluding the modules I removed) - 295KB minified, 71KB GZip'd
- optional polyfills - 23KB minified, 7KB GZip'd
- total less2css app bundle - 500KB minified, 139KB GZip'd

For comparison, Angular 1.4.1 is 142KB minified and 53KB GZip'd, so looking at the GZip'd versions, there doesn't seem to be an order of magnitude in size difference. The core-js bundle (providing es-x polyfills) on its own is 89KB minified and even with angular 1 you would probably want to include at least some es6 shims.

I do think it's a shame that we are continuing to bundle files that include a lot of code and logic around systemjs - I am a fan of the [AMD Clean](https://github.com/gfranko/amdclean) utility which for requirejs removes all of the require and define calls so that you have a bundle that is pure javascript and can then be minified and modules inlined where they are used only once.

### Conclusion

Aurelia is still preview and performance optimisation will be left to the end, so don't take this as a no for production sites, but I think its probably a "not yet". That may change soon though, if the problems are down to systemjs.

You can see the live site at [http://lesscss.org/less-preview/](http://lesscss.org/less-preview/) and I will try to keep it updated with performance fixes as they get released. Also note that it uses code mirror and less, which are both large javascript libraries, so please don't make performance assumptions!























