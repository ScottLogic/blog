---
author: hmumford
title: 'How to use npx: the npm package runner'
layout: default_post
tags:
  - npm
  - JavaScript
  - npx
categories:
  - Tech
summary: 'What is npx? How is it useful and why should you care? Find out how you can use npx to run global npm packages without having them installed.'
image: hmumford/assets/npx/using-npx.jpg
---

`npx` is a tool for running `npm` packages that:

- live inside of a local `node_modules` folder or
- are not installed globally.

~~~bash
# Before
$ node ./node_modules/.bin/mocha

# Now with npx:
$ npx mocha
~~~

`npx` looks into the local `/node_modules` folder for the package and if it can't
find it, it will download and run it without having that package globally installed.


## npx can reach into `node_modules` to run package binaries

`npx` is a replacement for installing global packages. It encourages you to install packages
locally, but still be able run them as if they were global, just with `npx`.

~~~bash
$ npm i -D gulp gulp-cli
$ npx gulp
~~~

<img src="{{ site.baseurl }}/hmumford/assets/npx/gulp.gif" alt="Running gulp locally with npx" />


Make sure you `--save` or `--save-dev` the package first.
This keeps dependent packages listed in package.json, so that `npx` can use the local version instead of downloading it to the npm cache.

`npx` is a useful tool for easily running `npm` packages. Just be wary of *typos* as this method increases the chance of being
[typosquatted]({{ site.baseurl }}{% post_url cburbridge/2018-02-27-hunting-typosquatters-on-npm %}).



## npx comes with npm

`npx` comes bundled with [npm version 5.2+](https://github.com/npm/npm/releases/tag/v5.2.0) (or as a [standalone package](https://www.npmjs.com/package/npx)). It works by checking if the npm package command exists in your local `node_modules/.bin` folder, or from a central `npx` cache and installing any packages needed for that command to run.


## Run any one-off package

`npx` will download and execute any package you give it.
This is useful for one-off commands, such as:


Checking the accessibility score of a website.

~~~bash
$ npx pa11y https://scottlogic.com
> Running Pa11y on URL https://scottlogic.com/
~~~


<img src="{{ site.baseurl }}/hmumford/assets/npx/pa11y.gif" alt="npx pa11y" />

After performing this audit we have promptly looked into the accessibility of [our website](https://www.scottlogic.com/) and how we can improve its [Pa11y](http://pa11y.org/) score.


Creating a boilerplate React app.

~~~bash
$ npx create-react-app harrys-site
~~~

Running a static web server.

~~~bash
$ cd my-website
$ npx http-server
> Starting up http-server, serving ./
> Available on:
>  http://192.168.36.65:8080
>  http://127.0.0.1:8080
> Hit CTRL-C to stop the server
~~~

Deploying to a [live server](https://zeit.co/now).

~~~bash
$ cd my-website
$ npx now --public
> Ready! https://test-hffvgcpvvq.now.sh [2s]
~~~

`npx` can also execute a package from a URL, e.g. [this GitHub gist](https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32):

~~~bash
$ npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32
> yay gist
~~~

Use it today by updating npm: `npm i npm`.


~~~bash
$ npx cowsay goodbye!
~~~


<img src="{{ site.baseurl }}/hmumford/assets/npx/cowsay.gif" alt="npx cowsay goodbye!" />
