---
title: Does NPM 5 deprecate yarn?
date: 2017-06-06 00:00:00 Z
categories:
- Tech
tags:
- featured
author: nowen
summary: Does npm 5 deprecate yarn? With promises of increased speed and consistent
  package versions yarn has a new competitor, but in this post I'll show the reasons
  for why, for the time being, I'll be sticking with yarn.
layout: default_post
image: nowen/assets/featured/npm-yarn-benchmark-og.png
---

Recently npm announced the release of their new version, [npm 5](http://blog.npmjs.org/post/161276872334/npm5-is-now-npmlatest). This new version has several improvements, and when reading the changelog I started to wonder: does this deprecate [yarn](https://yarnpkg.com/lang/en/) for me?

##Usage

The default behaviour for `npm i` is now to `--save`! Hurrah! It never made much sense to me before why we had to specify this, and it's something I've loved about yarn too. As far as day-to-day npm usage goes though I think this is about it in terms of differences. There are some neat additions where the entire package tree isn't spat out into the console on install, which makes the process seem a bit more streamlined, but in reality isn't a head turner.

##Versioning

Another great improvement: `npm-shrinkwrap` is gone! And what originally led me to yarn, the `yarn.lock` file has been made defunct by the `package-lock.json` file that npm 5 uses. No more wobbly dependency versions between installations. No more pesky failures because [left-pad](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/) went nuts again!

##Speed

While the top two sections are neato, this is where the real money will come.

The team at npm have made some very bold claims about speed improvements between versions, claiming some operations are up to 5x faster! The great thing about yarn was its use of caching to improve install times.

Here I'll compare npm 4, yarn and npm 5 for installation of dependencies with a combination of cache and lockfile absence.

The dependencies I'll be testing this on are fairly simple:

~~~json
  "devDependencies": {
    "autoprefixer": "^7.1.0",
    "css-loader": "^0.28.1",
    "extract-text-webpack-plugin": "^2.1.0",
    "html-loader": "^0.4.5",
    "html-webpack-plugin": "^2.28.0",
    "postcss": "^6.0.1",
    "postcss-cssnext": "^2.10.0",
    "postcss-load-config": "^1.2.0",
    "postcss-loader": "^2.0.5",
    "postcss-smart-import": "^0.7.0",
    "precss": "^1.4.0",
    "resolve": "^1.3.3",
    "webpack": "^2.5.1",
    "webpack-dev-server": "^2.4.5"
  },
  "dependencies": {
    "babel": "^6.23.0",
    "babel-core": "^6.24.1",
    "babel-loader": "^7.0.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "react": "^15.5.4",
    "react-dom": "^15.5.4"
  }
~~~

This is just enough to get a styled React application running.

And the results are in!

    |                   | npm 4    | yarn  | npm 5   |
    |-------------------|----------|-------|---------|
    | no cache, no lock | 1m15.6s  | 58.1s | 1m7.7s  |
    | cache, no lock    | 1m3.3s   | 30.3s | 0m55.5s |
    | cache and lock    | N/A      | 26.6s | 0m49.3s |

I must say here I was actually a bit disappointed. I had expected npm 5 to blow me away and end up _much_ faster than its predecessor. This was all using the same WiFi connection at the same time of day folks, so while I can't guarantee consistency here I think it's safe to say it didn't skew the results all too much.

As a note: to time here I was using [bash time](https://ss64.com/bash/time.html), which does add a small overhead to each measurement. This is because npm 4 doesn't print out a log of how long the operation took, while yarn and npm 5 do. To keep consistency I used `time` for each command.

##Conclusions

Okay so I didn't compare _every_ new feature of npm 5 to yarn -- just the ones that matter to me. I have a feeling that the cache improvements and speed gains advertised by npm might improve with (a) time and (b) a larger list of dependencies. However, I don't see how this can then outstrip yarn.

Also each of these new features is playing catch-up -- I don't see anything specific that is an *improvement* over yarn, or is more forward-thinking.

Overall I'm going to continue to use yarn. It looks like it is just quicker, right now. That and if in the future npm should outpace fellow yarn I'm comfortable that the switchover will be quite easy.

I do wonder what the next stage for both of these packages is: will yarn continue to pave the way for npm? Or is its time nearing an end and npm will continue to make large strides?


Nick
