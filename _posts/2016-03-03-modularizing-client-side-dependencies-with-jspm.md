---
title: Modularizing Client Side Dependencies With jspm
date: 2016-03-03 00:00:00 Z
categories:
- Tech
tags:
- featured
author: tferguson
title-short: Modularizing With jspm
layout: default_post
gravatar: 46b3ff75f0c69eca7f80876307e1f386
summary: Making the jump to fully modularized applications in javascript is now incredibly easy with ES6 modules and javascript package manager (jspm). We'll take a look at the refreshing simplicity in the jspm workflow and how it goes about achieiving this.
summary-short: Making the jump to fully modularized applications in javascript is now incredibly easy with ES6 modules and javascript package manager (jspm).
image: tferguson/assets/featured/jspm.png
---

*This post uses jspm 0.16. This information may be incomplete and even incorrect when jspm 0.17 is released. You can still try out jspm 0.17 beta now and follow developments [via the beta guide](http://jspm.io/0.17-beta-guide/index.html).*

jspm is an incredibly powerful client side package manager for [SystemJS](https://github.com/systemjs/systemjs). SystemJS is a universal module loader built on top of the [ES6 Module Loader Polyfill](https://github.com/ModuleLoader/es6-module-loader) allowing us to work with ES6 modules in our applications today.

For those familiar with Bower, jspm fulfils a similar role without the nastiness of polluting the global scope with our dependencies - it allows us to directly import our dependencies into modules as and when we need them. On top of this, we’ll see later that jspm can also help us greatly simplify our build in an ES6 application!

In this walkthrough we’ll take a look at setting up jspm, installing packages from the jspm registry, building a modular ‘Hello World’ application in ES6 using angular, preparing our code for a production environment and trying to understand how jspm solves problems that the tools before it didn’t.

*“But this sounds like a lot of effort, and Bower works just fine.”*

Well we’re working on the assumption that we would like to write a modular javascript application. Using ES6 modules will get us most of the way there, but our job isn’t really complete unless we modularize our third party dependencies as well. jspm is ‘module aware’ and will go a long way to helping us achieve that aim.

Despite the various moving parts in the jspm workflow one of its big advantages over tools that have tried to solve similar problems in the past (e.g. RequireJS for loading dependencies) is its ease of use. In order to do this aspect of jspm justice I will begin each section with an “In a Nutshell” aside which shows you how we achieve the task at hand. The rest of the section will discuss and attempt to understand what we just did.

The complete code for this post can be found on [github](https://github.com/tylerferguson/jspm-setup-example).

## Installing jspm and Setup
Assume we are currently in a blank project directory (e.g. ‘/jspm-setup-example’).

#### In A Nutshell

    npm install jspm -g
    jspm init
    npm install jspm --save-dev

When prompted select the default setting at each stage except for the `server baseURL` which we will set to ‘app’.
The `app` directory (which jspm will now have created for us) will house all of our client side code.
The other options are fairly self explanatory but you can learn more in the [jspm getting started guide](http://jspm.io/docs/getting-started.html#2-create-a-project).

#### What’s Actually Happening

We first install jspm globally and then use `jspm init` to create a new project configuration:

    npm install jspm -g
    jspm init

You’ll notice that jspm asks if you would like to create a package.json. This is because jspm piggybacks on npm’s package.json to keep track of installed packages. This means we can track all of our app's dependencies pretty easily in one place!

We now have the following project structure:

![Result of jspm init]({{ site.baseurl }}/tferguson/assets/jspm-init.PNG "Result of jspm init")

The `jspm_packages` directory is similar to the familiar `bower_components`; it contains our client side dependencies. If we delve inside it however, it looks wholly unfamiliar:

![jspm_packages]({{ site.baseurl }}/tferguson/assets/jspm-packages.PNG "jspm_packages")

*Why is there a github directory, an npm directory and all this other stuff I didn’t ask for?!* ( If this upsets you don’t even bother looking in the `npm` directory - it’s pretty cosy in there too). As it turns out, jspm is much more than a simple package installing tool - it will help us with transpiling, module loading, bundling and minification. The stuff you see is what jspm ships with by default in order to perform these tasks.

*But what about the github and npm directories?*
Well this is because jspm, again, piggybacks on top of these registries. jspm does have its own registry but it simply aliases the npm or github package requested. The directories we are looking at represent the registries these packages originate from.

The `config.js` is a default config for SystemJS. It will tell SystemJS which transpiler to use and how to resolve modules amongst some other things we’ll find out about later.

Our `package.json` in the root directory is looking a little sparse compared to what we are used to:

<pre>
{
  "jspm": {
    "directories": {
      "baseURL": "app"
    },
    "devDependencies": {
      "babel": "npm:babel-core@^5.8.24",
      "babel-runtime": "npm:babel-runtime@^5.8.24",
      "core-js": "npm:core-js@^1.1.4"
    }
  }
}
</pre>

jspm has only created what it needed. So we’re missing things we would normally like to have (like a name field for example). Not to worry, it shouldn’t affect us in this application, but it's worth bearing in mind if you choose to start a project with `jspm init`. The `jspm` node
in the `package.json` will be updated any time we add new packages. This is pretty neat and matches up with npm conventions that we’re already pretty used to.

The more observant reader will have spotted the following warning after running `jspm init`:

`warn Running jspm globally, it is advisable to locally install jspm via npm install jspm
--save-dev.`

jspm recommends installing globally and locally so that any updates to the global jspm will not affect your application, so that’s just what we’ll do:

    npm install jspm --save-dev

It might be worth noting that we don’t want to check `jspm_packages` into source control. The `package.json` has everything we need for a repeatable build for both development and production. It is the only file we need to check
into source control to keep track of all of our project's dependencies. Pretty simple.

## Installing packages / Adding Angular


#### In A Nutshell

    jspm install angular


#### What’s Actually Happening

After running the above command there will be changes to our `package.json` and `config.js`.
In the `jspm_packages/github` directory there will also be a newly added `angular` directory. Let's take a look at each change in turn beginning with the `package.json`:

<pre>
{
  "jspm": {

    ...

    "dependencies": {
      "angular": "github:angular/bower-angular@^1.5.0"
    },

    ...

}
</pre>

With jspm we don’t need to specify a `--save` flag; the angular dependency is automatically added to the `jspm` node in the `package.json`.
In future, if we check this project out in a fresh directory, running `jspm install` will fetch and install angular (as well as any other dependencies we may have added).

jspm also updates the `map` field in the `config.js` for SystemJS:

{% highlight js %}
// config.js

System.config({
  baseURL: "/",
  defaultJSExtensions: true,

  ...

  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "angular": "github:angular/bower-angular@1.5.0",

    ...

  }
});

{% endhighlight %}

This tells SystemJS how to resolve module dependencies in our javascript files.
Any time System sees `import angular from 'angular'` it will know to look at `github:angular/..` which in turn (due to the `paths` field in `config.js`) resolves to `jspm_packages/github/angular/..`.
If this `import` syntax looks unfamiliar you can read more on [ES6 module loading on MDN](https://developer.mozilla.org/en/docs/web/javascript/reference/statements/import).
For our purposes we just need to know that `import *variable* from *module*` means we are assigning the default export from `*module*` to `*variable*`.
In the case of modules we have defined ourselves we provide the path to the module in place of `*module*`.

Now let's turn our attention to that new `angular` directory. jspm will check the [jspm registry](http://kasperlewau.github.io/registry/#/), see that angular aliases `github:angular/bower-angular` and hence create the `github/angular` directory.
Taking a look inside the `angular` directory we see the following structure:

![Angular jspm package]({{ site.baseurl }}/tferguson/assets/angular-jspm-package.PNG "Angular jspm package")

Opening `bower-angular@1.5.0.js` reveals the following code:

{% highlight js %}
module.exports = require("github:angular/bower-angular@1.5.0/angular");
{% endhighlight %}

This is a file that jspm creates to wrap the actual angular file in a CommonJS style module (which as a universal module loader SystemJS can deal with fine). Looking inside the `bower-angular@1.5.0` directory reveals a fairly familiar structure if you have ever looked inside your `bower_components`. In fact, how are they different?
If we `bower install angular` (don’t panic, global dependencies aren’t sneaking back in, it’s just for a quick test) and compare the two directories we see the following:

    diff -r app\jspm_packages\github\angular\bower-angular@1.5.0 bower_components\angular\
    // Result
    Only in bower_components\angular\: .bower.json
    Only in app\jspm_packages\github\angular\bower-angular@1.5.0: .jspm-hash
    diff -r "app\\jspm_packages\\github\\angular\\bower-angular@1.5.0/angular.js" "bower_components\\angular/angular.js"
    1,3d0
    < /* */
    < "format global";
    < "exports angular";
    diff -r "app\\jspm_packages\\github\\angular\\bower-angular@1.5.0/angular.min.js" "bower_components\\angular/angular.min.js"
    1,2d0
    < /* */
    < "format global";
    diff -r "app\\jspm_packages\\github\\angular\\bower-angular@1.5.0/index.js" "bower_components\\angular/index.js"
    1,2d0
    < /* */
    < "format cjs";

The directories are in fact exactly the same except for a `.bower.json`, a `.jspm-hash` and a few innocuous looking strings that have been inserted at the top of some files.
The first two files contain information like the source of the package and which commit is being used. [This can help with identifying an outdated package that needs to be downloaded again](https://github.com/jspm/registry/issues/789).

What about the strings? jspm uses some [rules](https://github.com/systemjs/systemjs/blob/master/docs/module-formats.md#user-content-module-format-detection) to determine the format of a module (global / commonjs / amd / esm) and what is being exported in the case of a global module. These strings are used by SystemJS in module loading to identify the format of the module, its exports and its dependencies. The rest of the code is *exactly* the same, the only difference is that we get module loading and dependency resolution for free! We can now remove the `bower_components` directory, we will not be needing it again.

At this point it might be worth mentioning that jspm, like bower, supports a flat dependency structure. However, jspm runs a [version conflict resolution algorithm](http://jspm.io/docs/installing-packages.html#resolution-algorithm) that transparently ‘forks’ dependencies as required, identifying different versions of packages by using their version numbers in the aliases.
This is similar to [the approach that npm3 takes](https://docs.npmjs.com/how-npm-works/npm3) though the directory structure will always remain flat.

## Hello World

Now that we have installed angular as a jspm package all we should need to do now is load angular as a module anywhere we need it and Bob’s your uncle. Probably. Let’s try to get a simple ‘Hello World’ printing to the screen and see what happens.

I’m using a simple express server shown below to statically serve a given directory. Just copy this file and install express as a dev dependency with npm.

{% highlight js %}
// server.js

const express = require('express');

const dir = process.argv[2];
const port = 8080;
const app = express();

app.use(express.static(dir));
app.listen(port);

console.log('\n Serving directory /' + dir + ' on port ' + port);
{% endhighlight %}


The code I’m using for this first attempt is shown below:

{% highlight js %}
// app/app.js

import angular from 'angular';

angular.module('app', [])
    .controller('MainController', ($scope) => {
        $scope.hello = 'Hello World';
    });
{% endhighlight %}

{% highlight html %}
<!-- app/index.html -->

<head>
    <script src="jspm_packages/system.js"></script>    
    <script src="config.js"></script>
</head>

<body ng-app="app">
    <div ng-controller="MainController">{% raw %}{{hello}}{% endraw %}</div>
</body>
{% endhighlight %}

If we load this in the browser by running `npm start app` and navigating to `localhost:8080` we see the angular binding for our `hello` scope variable, but not the 'Hello World' string we expected.

![First App Run]({{ site.baseurl }}/tferguson/assets/first-app-run.PNG "First App Run")

We also don’t get any errors. This actually isn't a problem with our angular code. A quick look at the sources tab gives a clue to the issue.

![First App Run Sources Tab]({{ site.baseurl }}/tferguson/assets/first-app-run-sources-tab.PNG "First App Run Sources Tab")

*Where is our app.js?* Well because we are no longer using script tags to load our files the browser doesn’t know about `app.js`. This file creates our main angular module (not to be confused with an ES6 module) so we need the browser to execute it in order to bootstrap our angular application and kick everything off. We can do this by importing `app.js` using System:

{% highlight html %}
<!-- app/index.html -->
<head>
    <script src="jspm_packages/system.js"></script>    
    <script src="config.js"></script>
    <script>
        System.import('app.js');
    </script>
</head>

<body ng-app="app">
    <div ng-controller="MainController">{% raw %}{{hello}}{% endraw %}</div>
</body>
{% endhighlight %}

This time when we load the app in the browser we are presented with 'Hello World'.

![Angular Hello World]({{ site.baseurl }}/tferguson/assets/angular-hello-world.PNG "Angular Hello World")

Congratulations, you have built a (rather simple) angular application that uses ES6 module loading for all client side dependencies!

Let’s recap here. The only files loaded via script tags in our `index.html` are for `system.js` and its `config.js`.
We need the config in a script tag so that SystemJS knows which transpiler to use and other important details like its module resolution mappings.
We import `app.js` because it is the entry point of our application. This sets up our main angular module and allows the application to bootstrap via the `ng-app` directive.
No matter how many modules and third party dependencies we add to the rest of our application we will never need to make the `index.html` aware of any other file again. SystemJS will handle all module loading from here onwards. In fact, if we were using a third party angular module like [UIRouter](https://github.com/angular-ui/ui-router) so that our template (not including the bootstrapping directive) is replaced by a div with a `ui-view` directive, we could theoretically never have to touch our `index.html` again.

This is amazing news for those of us who have inexplicably forgotten to add a script tag in the past and wondered where an error is coming from or had to deal with ordering issues for our app’s dependencies, and it is also a much, much cleaner solution than injecting script tags into your `index.html`.

This is similar to solutions arrived at by RequireJS in the past, but more powerful as we are able to write spec compliant javascript modules (instead of amd modules) and much easier as we do not have to configure our own shims for dependencies of dependencies. jspm is handling all of this work for us.

## jspm in Production

As great as all this is, something still doesn’t seem quite right. Do you remember having to transpile the code at any point. When is this happening? Also, how does bundling work if every file is a separate module? Do we now have to make loads of HTTP requests for our javascript code instead of one? That could be a problem.

Let’s answer the first question. Currently, SystemJS is transpiling on the fly in the browser which as you can see has proven super easy for development purposes but will become slow and impractical in production as our application grows. We need a way of precompiling our ES6 code.

For the second question, we do currently make a request for each module when they are first needed. We would like to bundle these files together while maintaining the concept of modules.

#### In a Nutshell

    jspm bundle app.js app/app.bundle.js [--inject, --minify, --no-mangle]

#### What’s Actually Happening

Let’s split our app into a second module.

{% highlight js %}
// app/app.js

import angular from 'angular';

import MainController from './main.controller.js';

angular.module('app', [])
    .controller('MainController', MainController);
{% endhighlight %}

{% highlight js %}
// app/main.controller.js

export default ($scope) => {
    $scope.hello = 'Hello World';
}
{% endhighlight %}

Running `npm start app` and taking a look at the network tab should reveal 9 requests being made. We should be able to spot our `app.js` and `main.controller.js` amongst those requests.

![Request for each module]({{ site.baseurl }}/tferguson/assets/request-for-each-module.PNG "Request for each module")

The `jspm bundle` command will both transpile and bundle our modules into one file. Not only that, but it will include all of our installed jspm dependencies in the bundling step. Running

    jspm bundle app.js app/app.bundle.js

produces an `app.bundle.js` file in the app directory. The only trouble with this is that we need to make our `index.html` aware of this file now and we aren’t in the habit of adding script files at the moment. *There must be a better way?*

There is! The `--inject` flag addresses our woes!

    jspm bundle app.js app/app.bundle.js --inject

This will perform the same actions as before, but this time it will also add a `bundles` node to the SystemJS config:

{% highlight js %}
System.config({

  ...

  bundles: {
    "app.bundle.js": [
      "app.js",
      "main.controller.js",
      "github:angular/bower-angular@1.5.0.js",
      "github:angular/bower-angular@1.5.0/angular.js"
    ]
  },

 ...

});

{% endhighlight %}

Now the first time a module is requested SystemJS will see that it falls within this bundle and request `app.bundle.js` instead.
From then onwards SystemJS will continue to go back to the already requested `app.bundle.js` instead of making further HTTP requests.
Running the app in the browser and taking a look at the network tab now reveals only 4 requests.

![Request for bundle]({{ site.baseurl }}/tferguson/assets/request-for-bundle.PNG "Request for each bundle")

This is now a pretty lean request pipeline, but it still can be streamlined a little more by [creating a self executing bundle](http://jspm.io/docs/production-workflows.html#creating-a-selfexecuting-bundle) thereby removing the references to `system.js` and its `config.js`.

You may also have noticed an `app.bundle.js.map` after the bundling step. What does this do? If you click the sources tab in your dev tools you will find your original `app.js` and `main.controller.js` as though they had never been bundled or transpiled. We can put breakpoints in these files and step through just like we always have. We can debug the transpiled javascript running in the browser as though it was still written in ES6!

If you still aren’t impressed then jspm’s `bundle` command still has one last trick up its sleeve: minification. Minifying is as simple as adding `--minify` to our bundle command and the resulting `app.bundle.js` will be minified. Running the app in the browser and clicking the sources tab presents us with the true miracle of source maps; we can debug minified code!
Actually, because minifying the code will mangle all identifiers in our app, angular’s implicit dependency injection will fail.
We can (and should) fix this by explicitly injecting `$scope` using one of [angular’s dependency annotations](https://docs.angularjs.org/guide/di#dependency-annotation). We can quickly get around this for now by specifying the `--no-mangle` flag to `bundle`.

Note that we probably don't want to include `app.bundle.js` or `app.bundle.js.map` in source control since these are dynamically generated every time we run `jspm bundle`.
We also don't want to include the addition of the `bundle` node in `config.js` for the same reason. jspm provides a `jspm unbundle` command which will revert the `config.js` instead of having to manually delete the `bundle` node.

There are [alternatives to bundling](http://jspm.io/docs/production-workflows.html#creating-a-dependency-cache) discussed on the jspm site which are very worth looking into.

## Conclusion

jspm is a package manager that solves many of the problems of its predecessors while maintaining an incredible ease of use.

Most of the time it is a two step process to include packages in your application: `jspm install` then import.
Occasionally you will have to [configure your own shims](https://github.com/jspm/registry/wiki/Configuring-Packages-for-jspm) much like you would have done with RequireJS.
The big advantage jspm provides in this scenario is the ability to submit a pull request to the jspm registry and share your configuration as a new [package override](https://github.com/jspm/registry#user-content-packagejson-overrides) so that in the
future others will simply be able to `jspm install`.

The transpiling, bundling and minification commands provided with jspm are incredibly useful and can go a long way in helping with the shift from build tools like gulp and grunt
to simple npm scripts.

The simplicity of the tool and workflow make it a compelling choice for client side package management which I will certainly be using in future ES6 projects.
