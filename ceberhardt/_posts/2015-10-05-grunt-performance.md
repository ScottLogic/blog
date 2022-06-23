---
author: ceberhardt
title: Improving Grunt Performance
title-short: Improving Grunt Performance
layout: default_post
summary: "JavaScript builds are getting more complex and time consuming. This blog post shares a few steps I took to improve the performance of one of our project's grunt build, hopefully some of the tools I used will be of use to others."
categories:
  - Tech
---

Many years ago, when I first tried my hand at web development, the rapid development cycles were a welcome change; simply save your changes and hit refresh. This was in contrast to the C++ work I was also doing which was quite tedious, waiting for the code to compile, link and eventually execute after each and every change.

How things have changed.

These days JavaScript and web-app builds are often more complex than the C++ builds I worked with in the past. Our code is transpiled, linted, module dependencies resolved, tested, minified ... and that's just the JavaScript!

I've recently been working on an open source project, [d3fc](https://github.com/ScottLogic/d3fc), which has a fairly typical grunt build. Over time we've added more steps to the build and more code to the project and things have started to get pretty slow. I'd really like to get back to the almost instant feedback that we know is possible with these technologies.

This blog post shares a few steps I took to improve the performance of our grunt build, hopefully some of the tools I used will be of use to others.

## Instrumentation

We all know that the first step in improving performance is to instrument. You need to know which steps in your build are time-consuming before trying to optimise them.

Thankfully with grunt this is really quite simple, just add the `time-grunt` plugin to your build:

{% highlight javascript %}
require('time-grunt')(grunt);
{% endhighlight %}

When the build has finished you get a neat little summary of the execution time for each task:

{% highlight bash %}
Execution Time (2015-10-02 16:44:06 UTC)
loading tasks          1.9s  ▇▇▇▇▇▇ 14%
jshint:components      2.4s  ▇▇▇▇▇▇▇▇ 18%
jscs:components        1.1s  ▇▇▇▇ 8%
rollup:components     627ms  ▇▇ 4%
jshint:test           801ms  ▇▇▇ 6%
jscs:test             218ms  ▇ 2%
jasmineNodejs:test     1.3s  ▇▇▇▇ 9%
jshint:visualTests     1.1s  ▇▇▇▇ 8%
jscs:visualTests      407ms  ▇▇ 3%
assemble:visualTests   3.8s  ▇▇▇▇▇▇▇▇▇▇▇▇ 28%
Total 14s
{% endhighlight %}

As you can see the build takes 14s, which is fine for a CI or release build, but for development I want much more rapid feedback, ultimately as a way to support work in small iterations.

You don't need to know what d3fc is to follow this post, but it is worth knowing what these build steps are:

 - `jshint:components`, `jscs:components` - these run JSHint and JSCS on our library, providing consistent code style.
 - `rollup:components` - this is our dependency mechanism, where the various files are rolled-up into a single library file.
 - `jshint:test`, `jscs:test` - again code style rules, this time applied to tests
 - `jasmineNodejs:test` - unit tests
 - `jshint:visualTests`, `jscs:visualTests` - more code style!
 - `assemble:visualTests` - this probably needs a bit of explanation, our library is visual in nature, so we have a suite of 'visual tests', i.e. HTML tests for visual inspection. This task uses assemble, a static site generator, to generate the test pages.

One repeated pattern in the above build is the need to run JSHint and JSCS against each logic component of the codebase.

## Parallel builds, take one

One of the reasons people favour gulp over grunt is its built-in support for parallel task running. However, you can very easily make grunt run tasks in parallel via the `grunt-concurrent` task. My initial thought was to run JSCS and JSHint in parallel for each component.

Setting up `grunt-concurrent` is very easy, just configure the task with an array of sub-tasks to run in parallel:

{% highlight javascript %}
concurrent: {
    componentCheck: ['jshint:components', 'jscs:components']
}
{% endhighlight %}

The use the `concurrent:componentCheck` task in place of the ones it replaces.

However, with the above tasks running in parallel, the build was actually slower by ~1.5 seconds!

{% highlight bash %}
Total 15.4s
{% endhighlight %}

Thankfully `time-grunt` also produces a report for concurrent tasks, immediately revealing the issue:

Running "concurrent:componentCheck" (concurrent) task

{% highlight bash %}
Running "jscs:components" (jscs) task
    >> 74 files without code style errors.

    Done, without errors.


    Execution Time (2015-10-03 10:15:00 UTC)
    loading tasks     1.6s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 64%
    jscs:components  918ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 36%
    Total 2.5s

    Running "jshint:components" (jshint) task
    >> 74 files lint free.

    Done, without errors.


    Execution Time (2015-10-03 10:15:00 UTC)
    loading tasks      1.6s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 44%
    jshint:components    2s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 56%
    Total 3.6s
{% endhighlight %}

Each concurrent task is loading all of the grunt tasks required by the Gruntfile. Looking at the implementation of `time-grunt` you can [see why this is the case](https://github.com/sindresorhus/grunt-concurrent/blob/master/tasks/concurrent.js#L27), it uses `grunt.util.spawn` to spawn a new process for each tasks, each executing grunt. Clearly this approach doesn't make sense for parallelising a small number of relatively rapid tasks.

Grunt loads _all_ the referenced tasks regardless of whether they are used or not, this is a [known issue](https://github.com/gruntjs/grunt/issues/975). It's also exacerbated by `matchdep`, the plugin that loads tasks which are referenced in your `package.json`, e.g.:

{% highlight javascript %}
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
{% endhighlight %}

It's very easy to forget to clean up your `package.json` resulting in your grunt build loading tasks unnecessarily.

## JIT task loading

As ever, when grunt doesn't support something, you can almost guarantee that there will be a plugin that does! In this case it's `jit-grunt`, a just-in-time plugin loader. Simply replace the manual `loadNpmTasks` or `matchdep` step and replace with the following:

{% highlight javascript %}
require('jit-grunt')(grunt);
{% endhighlight %}

For our project build this gave an immediate improvement of ~2.5 seconds:

{% highlight bash %}
Execution Time (2015-10-03 10:29:14 UTC)
loading grunt-contrib-jshint  217ms  ▇ 2%
jshint:components              1.8s  ▇▇▇▇▇▇ 16%
loading grunt-jscs            164ms  ▇ 1%
jscs:components               796ms  ▇▇▇ 7%
rollup:components             438ms  ▇▇ 4%
loading grunt-contrib-cssmin  139ms  ▇ 1%
jshint:test                   644ms  ▇▇ 6%
jscs:test                     213ms  ▇ 2%
jasmine_nodejs:test            1.3s  ▇▇▇▇ 11%
jshint:visualTests             1.1s  ▇▇▇ 9%
jscs:visualTests              407ms  ▇▇ 3%
copy:visualTests              145ms  ▇ 1%
loading assemble              353ms  ▇ 3%
assemble:visualTests           3.5s  ▇▇▇▇▇▇▇▇▇▇ 30%
Total 11.6s
{% endhighlight %}

It also has the added benefit that if you want to execute a single task, it is also very fast:

{% highlight bash %}
$ grunt jscs:components

Running "jscs:components" (jscs) task
>> 74 files without code style errors.

Done, without errors.

Execution Time (2015-10-03 10:33:30 UTC)
loading tasks        87ms  ▇▇▇▇ 8%
loading grunt-jscs  175ms  ▇▇▇▇▇▇▇ 16%
jscs:components     854ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 76%
Total 1.1s
{% endhighlight %}

Unfortunately `jit-grunt` doesn't support `grunt.renameTask`, I've [raised an issue](https://github.com/shootaroo/jit-grunt/issues/39) and might look into a a fix for this.

## Parallel builds, take two

With the task loading optimised it was time to return to running tasks in parallel. With this project a much better split is to run the tasks relating to the two logic components (library code, visual test harness) in parallel:

{% highlight javascript %}
concurrent: {
    visual: ['components', 'visualTests']
}
{% endhighlight %}

This gives a significant improvement, bringing the build time down to around 8 seconds:

{% highlight bash %}
$ grunt visualTests:serve

    [...]


    Execution Time (2015-10-03 10:37:50 UTC)
    loading tasks                 132ms  ▇ 2%
    loading grunt-contrib-jshint  269ms  ▇▇ 4%
    jshint:visualTests             1.4s  ▇▇▇▇▇▇▇ 22%
    loading grunt-jscs            190ms  ▇ 3%
    jscs:visualTests              759ms  ▇▇▇▇ 11%
    copy:visualTests              199ms  ▇ 3%
    loading assemble              409ms  ▇▇ 6%
    assemble:visualTests           3.2s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 48%
    Total 6.6s

    [...]


    Execution Time (2015-10-03 10:37:50 UTC)
    loading tasks                 163ms  ▇ 2%
    loading grunt-contrib-jshint  246ms  ▇▇ 3%
    jshint:components              2.2s  ▇▇▇▇▇▇▇▇▇▇ 30%
    loading grunt-jscs            186ms  ▇ 3%
    jscs:components                  1s  ▇▇▇▇▇ 14%
    loading grunt-rollup          113ms  ▇ 2%
    rollup:components             593ms  ▇▇▇ 8%
    loading grunt-contrib-cssmin  155ms  ▇ 2%
    jshint:test                   702ms  ▇▇▇▇ 10%
    jscs:test                     270ms  ▇▇ 4%
    jasmine_nodejs:test            1.5s  ▇▇▇▇▇▇▇ 20%
    Total 7.3s

Done, without errors.

Execution Time (2015-10-03 10:37:49 UTC)
Total 8.4s
{% endhighlight %}

## From JSHint+JSCS to ESLINT

Looking at the tasks that are taking most time, JSHint certainly stands out. Also, we are running two separate static analysis tools over our code. The first, JSHint, is focussed on the languages constructs used, restricting the use of JavaScript features in order to write more 'safe' and predictable code. Whereas JSCS is purely a style checker, looking at things like indentation, single/double quotes etc ...

Both do their job very well, however, running two separate analysis tools over the code does feel a little inefficient.

An alternative I've used a few times recently is ESLint which has rules that cover both languages constructs and style. Hopefully just using ESLint should be faster than JSHint and JSCS combined!

However, the first problem is migrating to ESLint, with each of these tools supporting 100s of rules I didn't want to manually map between them. This got me thinking, what if you could auto-configure the ESLint ruleset to the most 'aggressive' set of rules based on an existing codebase?

Of course I'm not the first person to think this, there's a tools called `dryer` [available on GitHub](https://github.com/willklein/dryer) that does just that, running the ESLint CLI, checking which rules fail, then building a configuration based on the results.

Of course there are a number of rules it cannot readily derive from the code, such as the level of indentation, but it does give a big head start.

So how does it compare?

Here's JSCS + JSHint:

{% highlight bash %}
loading grunt-contrib-jshint  246ms  ▇▇ 3%
jshint:components              2.2s  ▇▇▇▇▇▇▇▇▇▇ 30%
loading grunt-jscs            186ms  ▇ 3%
jscs:components                  1s  ▇▇▇▇▇ 14%
{% endhighlight %}

And Here's ESLint:

{% highlight bash %}
loading grunt-eslint          525ms  ▇▇▇ 9%
eslint:components              2.1s  ▇▇▇▇▇▇▇▇▇▇▇▇ 35%
{% endhighlight %}

Around 3.6 seconds, versus 2.6 seconds. A small improvement, but worthwhile. Also, it does make your build simpler, and your associated tooling (i.e. your editor only needs one plugin for code style checking).

Interestingly I found out that the ESLint team are [currently working on an auto-configuration tool](https://github.com/eslint/eslint/issues/3567)

## The end result

With all these changes in place the overall build time was reduced from 14 to 6.5 seconds. This might not sound like much, but for developer productivity it is a *big* improvement.

It's probably about time I stopped fiddling around with the build and got some real work done ...

Regards, Colin E.
