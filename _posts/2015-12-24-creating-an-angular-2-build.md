---
title: Creating an Angular 2 build with Gulp, TSLint and DefinitelyTyped
date: 2015-12-24 00:00:00 Z
categories:
- ceberhardt
- Tech
author: ceberhardt
title-short: An Angular 2.0 Build
layout: default_post
summary: From my perspective Angular 2 is a great improvement over Angular 1. The
  framework is simpler, and as a result your code is more concise, making use of modern
  JavaScript concepts. However, this does come at a cost; with Angular 2 the required
  tooling is really quite complicated.
---

From my perspective Angular 2 is a great improvement over Angular 1. The framework is simpler, and as a result your code is more concise, making use of modern JavaScript concepts. However, this does come at a cost; with Angular 2 the required tooling is really quite complicated.

The Angular 2 website has a [great tutorial introduction to the framework](https://angular.io/docs/ts/latest/tutorial/). Although in order to focus on the Angular framework itself they keep the tooling as simple as possible, making use of command-line tools. This is great for the purposes of a simple tutorial, however for a more complex application your build will become more complex, incorporating numerous steps. At this point it makes sense to move from command-line tools to gulp (or grunt).

Interestingly, there are a number of people that advocate [command-line tools and npm run](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/) over grunt and gulp. I think this makes a lot of sense for small projects, and reduces the amount of time you spend fighting with the build!

In this blog post I'll take the 'Tour of Heroes' app from the Angular 2 tutorial and create a Gulp build. I found this to be a great exercise in understanding how the various components of the Angular 2 application actually work, and used it as an excuse to explore other aspects of TypeScript development including TSLint, DefinitelyTyped and SystemJS module loading.

## The Starter App Build

Tour of Heroes is a simple Angular 2 app that demonstrates the core concepts (DI, components, routing, binding, ... ):

<img src="{{ site.baseurl }}/ceberhardt/assets/angular2/tour-of-heros.png" />

John Papa has a [repo on GitHub](https://github.com/johnpapa/angular2-tour-of-heroes) for this app, which is what I used as a starting point for my build.

The development build process is defined within `package.json` as a number of npm scripts:

{% highlight javascript %}
"scripts": {
  "tsc": "tsc",
  "tsc:w": "tsc -w",
  "lite": "lite-server",
  "start": "concurrent \"npm run tsc:w\" \"npm run lite\" "
}
{% endhighlight %}

Running `npm start` concurrent performs `npm run tsc:w` and `npm run lite`. The first starts the TypeScript compiler in watch mode, while the second starts up the lite-server development server (which has a watch / live-reload function).

You might be wondering why there is a `tsc` script defined which simply runs `tsc`? When you install TypeScript globally it provides a command-line compiler via the `tsc` binary. You could use the global compiler for your TypeScript projects, however, by doing this you can encounter version errors with the compiler itself.

The Tour of Heroes project declares its TypeScript version dependency via `devDependencies`:

{% highlight javascript %}
"devDependencies": {
  ...
  "typescript": "^1.7.3"
}
{% endhighlight %}

As a result, when you run `npm install` you will now have a local copy of the correct version of the TypeScript compiler.

When you use `npm run` to run one of your scripts, npm adds `node_modules/.bin` to the path provided to the scripts. The net result of this is that the locally installed `tsc` binary will be used rather than the global binary. As a result it is preferable to run `npm run tsc` in order to compile your project.

One drawback of using the command-line compiler is that the generated JavaScript and sourcemap files are output directly alongside the source TypeScript files:

<img src="{{ site.baseurl }}/ceberhardt/assets/angular2/generated-files.png" />

This looks a bit messy to me!

## Building with Gulp

I'd like to move the build to Gulp as I feel it is a better foundation for more complex builds. Furthermore, I'd like the build to place its output (JS, CSS, HTML, sourcemaps) into a separate folder so that it is clear which files are required for distribution.

Although, at the same time I don't want to lose the ability to run tools like `tsc` on the command line - this makes it easier to trouble-shoot the build and support other tooling such as IDEs.

The first step is to add gulp and the gulp-typescript plugin to the project

{% highlight javascript %}
"gulp": "^3.9.0",
"gulp-typescript": "^2.8.0",
"del": "^2.1.0"
{% endhighlight %}

The following is a minimal gulpfile that performs the required TypeScript compilation:

{% highlight javascript %}
const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src('app/**/*.ts')
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist/app'));
});

gulp.task('build', ['compile']);
gulp.task('default', ['build']);
{% endhighlight %}

A couple of things to note here:

1. The compiled output is now placed in a `dist` folder so that it is no longer mixed up with the source.
2. The compiler configuration is loaded from the `tsconfig.json` file which is already present in the project and used by the command-line compiler.

However, this has already introduced an issue. The gulp build outputs files to the `dist` folder, whereas `tsc` still generates files that co-exist with the source.

The `tsconfig.json` file provides configuration to the TypeScript compiler and is documented on the [TypeScript Wiki](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json). Fortunately the compiler options (also [documented on the wiki](https://github.com/Microsoft/TypeScript/wiki/Compiler-Options)) has an optional `outDir` property that can be used to specify the target directory for the compiled output:

{% highlight javascript %}
{
  "compilerOptions": {
    "outDir": "dist/app", // <--- newly added configuration parameter
    "target": "ES5",
    "module": "system",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "removeComments": false,
    "noImplicitAny": true,
    "suppressImplicitAnyIndexErrors": true
  },
  "exclude": [
    "node_modules"
  ]
}
{% endhighlight %}

## Sourcemaps

Unfortunately gulp-typescript does not generate sourcemaps and as a result ignores the `sourceMap` compiler option. This can be added via the gulp-sourcemaps plugin.

Adding sourcemaps to the build is simply a matter of installing the plugin then wrapping the typescript compile step as follows:

{% highlight html %}
const sourcemaps = require('gulp-sourcemaps');
...

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src(tscConfig.files)
    .pipe(sourcemaps.init())          // <--- sourcemaps
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))      // <--- sourcemaps
    .pipe(gulp.dest('dist/app'));
});
{% endhighlight %}


## Handling static files

The current gulpfile writes the generated JavaScript files to the `dist` folder, however, in order to run the application this folder also needs a copy of the HTML, CSS and external libraries.

The Tour of Heroes `index.html` grabs the external libraries direct from the folders where they were installed by npm:

{% highlight html %}
<script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
<script src="node_modules/systemjs/dist/system.src.js"></script>
<script src="node_modules/rxjs/bundles/Rx.js"></script>
<script src="node_modules/angular2/bundles/angular2.dev.js"></script>
<script src="node_modules/angular2/bundles/router.dev.js"></script>
{% endhighlight %}

A build step can be added that copies these dependencies to a `dist/lib` folder:

{% highlight javascript %}
// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/router.dev.js'
    ])
    .pipe(gulp.dest('dist/lib'))
});
{% endhighlight %}

And the URLs updated accordingly:

{% highlight html %}
<script src="lib/angular2-polyfills.js"></script>
<script src="lib/system.src.js"></script>
<script src="lib/Rx.js"></script>
<script src="lib/angular2.dev.js"></script>
<script src="lib/router.dev.js"></script>
{% endhighlight %}

The build also needs to copy the `index.html` file and any component templates / CSS to the `dist` folder. Here's a suitable build step:

{% highlight javascript %}
// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', 'index.html', 'styles.css', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest('dist'))
});
{% endhighlight %}

The file pattern `['app/**/*', '!app/**/*.ts']` copies any non TypeScript file into the `dist` folder. The `index.html` and `styles.css` are included explicitly because they are outside of the `app` folder. Personally I don't like this project structure! I prefer to a clear separation between source-code and configuration / build files. It makes it easier to navigate the project and the build simpler.

With these changes in place you can now run `gulp build` then start a static web server from the `dist` folder to see the results. Adding live-reload and a watch is a pretty trivial step from this point.

## Linting

While the TypeScript compile performs a certain class of checks on your code (for example, ensuring that all variables are explicitly typed), I like to include semantic and syntactic checks. TSLint is a great tool for this job.

Adding a lint step to the build is quite straightforward via the gulp-tslint plugin:

{% highlight javascript %}
const tslint = require('gulp-tslint');
...

gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});
...

gulp.task('build', ['tslint', 'compile', 'copy:libs', 'copy:assets']);
{% endhighlight %}

TSLint is configured via a `tslint.json` file. In the interests of allowing command-line usage, the following can be added to `package.json`:

{% highlight javascript %}
"scripts": {
  "tslint": "tslint -c tslint.json app/**/*.ts",
}
{% endhighlight %}

As a results `npm run tslint` will lint all of the projects TypeScript files.

## DefinitelyTyped

So far the build has been quite straightforward and not so different to any other build that requires a JavaScript transpilation step ( e.g. ES6 to ES5). With TypeScript things become a lot more complicated when you start integrating 3rd party libraries!

In order to illustrate the point, I've modified the Tour of Heroes project so that the ID of each 'hero' is generated via an external UUID generation library, [node-uuid](https://github.com/broofa/node-uuid).

Adding node-uuid to the project is straightforward, via `npm i node-uuid --save` (which installs and adds it to your `package.json` file), then the build can be updated to copy the library to the `dist/lib` folder. The tricky part is keeping the TypeScript compiler happy!

Currently the ID for each hero is a number:

{% highlight javascript %}
import { Hero } from './hero';

export var HEROES: Hero[] = [
  {'id': 11, 'name': 'Mr. Nice'},
  {'id': 12, 'name': 'Narco'},
  ...
];
{% endhighlight %}

This needs to be replaced with an ID generated via `uuid.v4()`. However, the TypeScript compiler doesn't know anything about the UUID interface. In this case, as it is a single method, you can supply the type information yourself:

{% highlight javascript %}
import { Hero } from './hero';

interface UUID {
  v4: {(): string};
}

declare var uuid: UUID;

export var HEROES: Hero[] = [
  {'id': uuid.v4(), 'name': 'Mr. Nice'},
  {'id': uuid.v4(), 'name': 'Narco'},
  ...
];
{% endhighlight %}

However this doesn't work so well if you want to use a more complex library such as D3.

DefinitelyTyped is a community effort to provide type definitions for JavaScript libraries. It has a command-line interface, `tsd`, which is similar to npm. In order to obtain the required type information it is simply a matter locating the corresponding project, then executing `tsd install`. However, things are not so easy in practice! In practice there are a number of pitfalls to this approach:

1. **Versioning** - In the case of node-uuid [the type definitions lack a version](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/node-uuid) (e.g. node-uuid-1.2.3.d.ts), which indicates that they are for the current version of node-uuid, but of course this may no longer be the case.
2.  **Environments** - In the case of node-uuid it can be used via common-js (typically in a node environment) or as a global (within the browser). You have to take care to ensure that the correct type definitions are being used.
3.  **Absent libraries** - Some libraries do not use DefinitelyTyped, for example immutable-js [ships its type definitions alongside the JavaScript distributable](https://github.com/facebook/immutable-js/tree/master/dist). In my opinion this is a *much better* approach as it removes the versioning issue mentioned earlier.
4.  **Conflicting techniques** - This being the world of JavaScript there is more than one solution to a problem! [Typings](https://github.com/typings/typings) is a new type definition manager for TypeScript which I've seen a few projects using.

Anyhow, back to the task in hand. In this case the `node-uuid-global` type definitions are what's needed:

<pre>
tsd install node-uuid-global --save

 - node-uuid    / node-uuid-global
   -> node-uuid > node-uuid-base
</pre>

This writes a bunch of `*.d.ts` files to a typings folder (which should not be added to source control), and creates a `tsd.json` file that details exactly which type definitions are being used.

You can now reference type definitions via special comments as follows:

{% highlight javascript %}
/// <reference path="../typings/node-uuid/node-uuid-global.d.ts" />
import { Hero } from './hero';

export var HEROES: Hero[] = [
  {'id': uuid.v4(), 'name': 'Mr. Nice'},
  {'id': uuid.v4(), 'name': 'Narco'},
  ...
];
{% endhighlight %}

The project is now a little more complex in that it requires both an `npm install` and a `tsd install` step before someone can build and run the application. To make life easier for would-be contributors you can actually roll these two together by adding a post-install step within `package.json`:

{% highlight javascript %}
"scripts": {
  "tslint": "tslint -c tslint.json app/**/*.ts",
  "postinstall": "tsd install"
}
{% endhighlight %}

## TypeScript File Globbing

One thing that is a little messy about the solution described above is the need to add those strange looking comments to each file in order to point the compiler towards type definitions:

{% highlight javascript %}
/// <reference path="../typings/node-uuid/node-uuid-global.d.ts" />
{% endhighlight %}

The relative file paths also cause pain when trying to refactor projects.

A better alternative is to provide an explicit list of files to the TypeScript compiler, which includes all your sourcecode together with the type definitions. So how does the compiler know which files to compiler? Looking in `tsconfig.json`:

{% highlight javascript %}
{
  "compilerOptions": {
    ...
  },
  "exclude": [
    "node_modules"
  ]
}
{% endhighlight %}

The default behaviour of the compiler is to compiler and `.ts` files in the current folder and sub-folders. The `exclude` property above is used to exclude certain folders, which in this case stops the compiler from trying to compile everything it finds in the `node_modules` folder (for obvious reasons).

Rather than specify an exclusion, I think it makes more sense to be explicit about which files should be compiled. This can be achieved via the `files` property, which is an array of files. However, this property does not support file patterns, so you must explicitly list each and every file.

Fortunately there is a better way, you can supply a pattern via the `filesGlob` property:

{% highlight javascript %}
{
  "compilerOptions": {
    ...
  },
  "filesGlob": [
    "app/**/*.ts",
    "typings/**/*.d.ts"
  ],
  "atom": {
    "rewriteTsconfig": true
  }
}
{% endhighlight %}

With the Atom editor, this is expanded to the following:

{% highlight javascript %}
{
  "compilerOptions": {
    ...
  },
  "filesGlob": [
    "app/**/*.ts",
    "typings/**/*.d.ts"
  ],
  "files": [
    "app/app.component.ts",
    "app/boot.ts",
    "app/dashboard.component.ts",
    "app/hero-detail.component.ts",
    "app/hero.service.ts",
    "app/hero.ts",
    "app/heroes.component.ts",
    "app/mock-heroes.ts",
    "typings/node-uuid/node-uuid-base.d.ts",
    "typings/node-uuid/node-uuid-global.d.ts",
    "typings/tsd.d.ts"
  ],
  "atom": {
    "rewriteTsconfig": true
  }
}
{% endhighlight %}

Notice that I mention 'with the Atom editor'. Unfortunately Visual Studio Code (which is a popular and rather good editor), does not support `filesGlob`. This property is non-standard and isn't part of the specification for `tsconfig.json`.

Fortunately, there is a project [tsconfig-glob](https://github.com/wjohnsto/tsconfig-glob), which supplied this functionality and can be integrated into the build as follows:

{% highlight javascript %}
gulp.task('tsconfig-glob', function () {
  return tsconfig({
    configPath: '.',
    indent: 2
  });
});
{% endhighlight %}

Adding the above task to a 'watch' will ensure that the `files` property of `tsconfig.json` is always up-to-date.

This is an issue that a lot of people are facing and as a result there are a number of people calling for `filesGlob` to be [supported by the compiler directly](https://github.com/Microsoft/TypeScript/issues/1927).

## Module loading

The above example which added node-uuid to the project is a little simplified because the `uuid` variable is added as a global, so the node-uuid library can simply by added via a script tag. However, in most cases you'll probably want to include external libraries as modules rather than globals. To illustrate the point, I've added the [immutable.js](https://facebook.github.io/immutable-js/) to the project. This library provides support for immutable arrays, maps and objects. In this case I'll just use it to replace the array of heroes with an equivalent immutable list.

As mentioned previously immutable provides type definitions as part of its distribution, therefore you don't need to use DefinitelyTyped. You do of course have to tell the TypeScript compiler where to find the type definitions by updating the `tsconfig.json` file as follows:

{% highlight javascript %}
"filesGlob": [
  "app/**/*.ts",
  "typings/**/*.d.ts",
  "node_modules/immutable/dist/immutable.d.ts"
]
{% endhighlight %}

This allows your code to make use of the external immutable module:

{% highlight javascript %}
import { Hero } from './hero';
import { List } from 'immutable';

export var HEROES = List<Hero>([
  {'id': uuid.v4(), 'name': 'Mr. Nice'},
  {'id': uuid.v4(), 'name': 'Narco'},
  ...
]);
{% endhighlight %}

If you update the build to copy the immutable library to the `dist/lib` folder then run the application ... it doesn't work:

<img src="{{ site.baseurl }}/ceberhardt/assets/angular2/error.png" />

The error indicates that the SystemJS module loader is attempting to load the immutable module via an XHR request, however the file cannot be found.

To solve this problem you need to update your SystemJS configuration to map the `immutable` module to the path `lib/immutable.js`:

{% highlight javascript %}
System.config({
  packages: {
    app: {
      format: 'register',
      defaultExtension: 'js'
    }
  },
  map: {
    immutable: 'lib/immutable.js'
  }
});
{% endhighlight %}

The additional `map` above solves the issue, allowing SystemJS to load this module.

If you want to also load node-uuid via SystemJS things get even more complicated! When used in a common-js environment, node-uuid attempts to load the `crypto` module (which exists in node environments). However, SystemJS will go ahead and try to load crytpo, failing when it isn't found.

To solve this issue, you not only have to map node-uuid to the correct file in your `dist/lib` folder, but also have to map the `crytpo` module to `@empty` which tells SystemJS not to attempt to load it.

{% highlight javascript %}
System.config({
  packages: {
    app: {
      format: 'register',
      defaultExtension: 'js'
    },
    'node-uuid': {
      format: 'cjs',
      map: {
        crypto: '@empty'
      }
    }
  },
  map: {
    immutable: 'lib/immutable.js',
    'node-uuid': 'lib/uuid.js'
  }
});
{% endhighlight %}

You can probably imagine how long it took me to work out the above configuration ;-)

## Conclusions

This has been a bit of a long rambling blog post about various things I have learnt along the way when trying to assemble a sensible Angular 2 / TypeScript build for non-trivial projects. There are still things missing such as unit testing (I managed to get Mocha working, but [as of Angular 2 beta it no longer works](https://github.com/angular/angular/issues/5395)) and bundling.

Angular 2 is really interesting framework, however, the complexity of TypeScript and the associated build system is no doubt going to be quite a challenge for many newcomers.

The source code for this application, which is the original Tour of Heroes app, plus my Gulp build, [is on GitHub](https://github.com/colineberhardt/angular2-tour-of-heroes).

Regards, Colin E.
