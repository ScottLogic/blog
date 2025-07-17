---
title: Highlights from JSConf.IS
date: 2016-09-01 00:00:00 Z
categories:
- Tech
author: cprice
layout: default_post
summary: My highlights from the inaugural JSConf.IS 2016 hosted at Harpa, Reykjavik.
---

I recently attended the very first [JSConf.IS](https://jsconf.is) in Reykjavik. It was a great conference and one that I can highly recommend for next year. In this post I wanted to cover off some of my highlights from the conference. I've also published another blog post covering some of the [evening activities](using-d3-force-to-control-a-massive-display.html).

<img src="{{ site.baseurl }}/cprice/assets/northern-lights/welcome.jpg" alt="Welcome to JSConf Iceland" style="display: block; margin: auto;"/>

## The New Mobile Web: Service Worker, Push, and App Manifests
[Dan Callahan](https://twitter.com/callahad)

I've previously seen talks about [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) which convinced me that one day it was going to change everything. Dan's talk could probably be summed up as: [that day is now](http://caniuse.com/#feat=serviceworkers). The major features of service worker are now available in Chrome and Firefox, Edge is currently working on it and Safari is considering working on it. Even if those browsers take a while to get on board, service worker apps are fully backwards compatible so there's nothing to stop adoption now.

If you've not come across service workers before you can think of them as `script` tags for domains rather than pages. Whilst the web is ubiquitous, it can't currently be considered resilient because it doesn't work offline. Service workers can plug this gap by allowing a domain to take complete control over how its resources are cached.

However, they can be so much more than that. As well as offline support, they allow web technologies to deliver other experiences we've come to expect from native apps but which have previously required native wrappers to achieve. Examples include, push notifications even when the user isn't using your site, chrome-less launching from home screen, geo-fenced events, etc..

Already libraries are starting to emerge which offer benefits for service worker supported browsers with little effort required from the developer. An example presented in the talk used a service worker to automatically send patches for updated assets to the client, whilst browsers lacking support continued to receive the original assets. I'm sure performance enhancements such as these will pile the pressure on the other browsers to support the standard.

## Pivoting to React, at scale
[Tilde Ann Thurium](https://twitter.com/annthurium)

Tilde talked us through Pintrest's move to React covering some of the things they did well and things they'd do better next time. It's worth noting that these are lessons that apply to very large code bases where big-bang migrations are not an option. It was an interesting talk with parallels to many projects Scott Logic has worked on.

My favourite piece of advice relates more to human psychology than anything particularly technical. The rule was very simple: most UIs are composed of nested trees of widgets, when transitioning from framework A to B allow teams to host type-B widgets within type-A widgets but not the other way around.

This rule forces teams to port over all components in a hierarchy and not skip over the "boring" components to play with the "exciting" ones. If you don't have a rule like this it's easy to end up stuck with a codebase based on both frameworks, for a very long time. On reflection, Tilde suggested that you might want to specify some top-level exceptions to this to maintain a level of pragmatism but these should be the exception.

Another interesting suggestion, although one that's probably harder to pull off in real life, is to decouple framework changes from design changes. The rationale being that if you don't there's no way to decouple the effect of the changes on engagement metrics i.e. did a user stop using that feature because the design is now awkward or did we introduce a massive bug? I do like the idea but I can foresee a tricky budget conversation when you suggest reworking the same widget twice.

Also in my notes -

* When training up a team in a new framework produce a suggested learning order for the various technologies and sub-frameworks involved.
* If possible when moving between frameworks, you can try to iteratively update the semantics of framework A to be ever closer to framework B to ease the migration.

<img src="{{ site.baseurl }}/cprice/assets/northern-lights/harpa-ceiling.jpg" alt="View from inside looking up, Harpa" style="display: block; margin: auto;"/>

## JavaScript on tiny, wearable hardware
[Heiko Behrens](https://twitter.com/HBehrens)

Heiko introduced his team's recent work to allow [Pebble](https://www.pebble.com/) watches to run [JavaScript watchfaces](https://developer.pebble.com/blog/2016/08/15/introducing-rockyjs-watchfaces/). In a world where everything runs JavaScript this may not sound like much of an achievement. However Pebble devices [typically have 64k of memory](https://developer.pebble.com/guides/tools-and-resources/hardware-information/). That's got to fit both your code and your heap in it...

To work their magic the team used an existing JavaScript engine called [JerryScript](http://jerryscript.net/) which is developed by Samsung specifically for IoT-type devices. Using this engine they are able to precompile the JavaScript code down to bytecode on the supporting phone app before running it on the watch. Although due to Apple's App Store restrictions they can't use the engine as is to do this (I presume because it's interpreting code and is written in C).

Therefore, they've taken the JerryScript JavaScript engine and transpiled it to JavaScript using Emscripten (which satisfies the App Store rules because it's now JavaScript). So they're now running a JavaScript engine... in JavaScript...

As if this wasn't hard enough to wrap your head around, they realised that debugging on the watch was going to be incredibly painful due to the constrained resources available. Therefore, they also transpiled their firmware's application layer using Emscripten so that they can offer as realistic as possible emulation of your app running on the phone... in your browser...

It was a thoroughly enjoyable talk and a very interesting conversation I had with Heiko afterwards. As someone who's backed the last two Pebble campaigns it was reassuring to hear the rationale behind some of their decisions and hear a sneak preview of some very useful sounding, upcoming features.

As impressive as it is to see JavaScript running on the watch I would love to see someone (myself included when I get some time...) try to bring more of the modern JS ecosystem tools and techniques to Pebble development -

* Make developing on Pebble with JS as simple as `npm install pebble-create-app` in a similar way to [react-create-app](https://github.com/facebookincubator/create-react-app).
* Support hot module reloading. Ideally on the device but the browser-based emulator would be a good start.
* Support for some form of time-travel debugging. If there are the resources to spare, a functional UI approach would allow for rapidly testing e.g. the various edge-cases of watchfaces (midnight, midday, daylight savings, etc.).

I was also disappointed to discover that the latest firmware would remove the ability to navigate into the past (rendering my [Mondo Timeline pins](2016-04-19-mondo-bank-webhook-to-pebble-watch-timeline-using-aws-labmda-functions.html) pretty useless) but apparently that feature was very rarely used...

## Spinning up an Electron App - Desktop Apps in JavaScript
[Katrina Uychaco](https://twitter.com/kuychaco)

Katrina talked us through creating apps with [Electron](http://electron.atom.io/) with a demo which featured remote controlling a [Sphero BB-8 Droid toy](https://www.amazon.co.uk/Sphero-R001ROW-BB-8-Enabled-Droid/dp/B0107H5FJ6) via Bluetooth, from a popup menu launched from the task tray on her laptop. It was a very entertaining demo which was very well received.

My favourite part of the demo was actually something that was very quickly glossed over. In order to allow the whole room to see the small droid do its thing, Katrina had quickly put together a (or possibly grabbed someone else's) system tray launched chrome-less app, which showed the laptop's webcam scaled to the size of the window. Despite being so simple, for me it demonstrated the real power of Electron: being able to achieve deep integration with an operating system very quickly and easily, in a very accessible way, all with web technologies.

If you're interested in finding out more about the security side of using Electron, I'd recommend [Dean's posts](http://blog.scottlogic.com/2016/03/09/As-It-Stands-Electron-Security.html) on the subject. Or if you just fancy reading making something cool in Electron, check out [William's post](http://blog.scottlogic.com/2016/07/05/audio-api-electron.html).

## And much more...

* notalljavascript, [Malte Ubl](https://twitter.com/cramforce) - The technical lead of the AMP project detailed some of the weird, wonderful and scary code that runs inside 3rd party adverts. My favourite hack was an advert which decoded and rendered h264 video in JS to get around video tag restrictions, who needs performance!
* This will flow your mind, [Tryggvi Gylfason](https://twitter.com/TryggviGy) - A quick tour of Facebook's TypeScript competitor. I was interested to find out about it's unique approach to opting-in to type-checking per file to allow adoption in large projects. Also hat tip to [pungenerator.org](http://pungenerator.org/) for its many pun-hit wonders!
* On How Your Brain is Conspiring Against You Making Good Software, [Jenna Zeigen](https://twitter.com/zeigenvector) - An interesting talk covering an angle of development we talk very little about: we're not designed for writing software. I particularly enjoyed the discussion of how bad we are at estimating tasks: more formally called the [planning fallacy](https://en.wikipedia.org/wiki/Planning_fallacy).
* There was also much talk of Guinea pigs, Babel/PostCSS, filthy dirty CSS, WebVR and so very, very, much React (so hot right now!).

One final mention to [Jan Lehnardt](https://twitter.com/janl) who gave an impassioned talk about the state of the JavaScript Community, how we should always recognise the contributions of others and never excuse unnecessary negativity, in whatever form it may take. Scott Logic makes wide use of open source software and whilst we, as a company and also as the individuals who make up the company, already contribute back in [various](https://d3fc.io/) [ways](http://propertycross.com/) this talk has inspired me to pilot changes at Scott Logic to try and expand our contributions back to the community. I will publicly detail these changes once the plan is formalised (deadline: 2016/10/01).

## Thanks!

Thanks to the organisers for all the hard work they put in to pull together such a great event. Also a big thanks to everyone I spoke to, the community around the conference really is the most important part of the experience. If you're looking for a JavaScript conference, I can definitely recommend [JSConf.IS](https://jsconf.is) for next year.

Also, don't forget about the [evening's activities](using-d3-force-to-control-a-massive-display.html).
