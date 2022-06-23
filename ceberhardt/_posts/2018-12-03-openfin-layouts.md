---
author: ceberhardt
layout: default_post
title: OpenFin Layouts added to StockFlux
summary: We've updated StockFlux, our OpenFin demo app, to make use of the recently-released OpenFin Layouts APIs. This blog post takes a quick look at the features we've added, and the APIs used.
categories:
  - Tech
contributors:
  - msuperina
image: ceberhardt/assets/stockflux/stockflux.png
---

We've updated StockFlux, our OpenFin demo app, to make use of the recently-released OpenFin Layouts APIs. This blog post takes a quick look at the features we've added, and the APIs used.

## StockFlux Release

We initially released StockFlux a couple of years ago as a way to demonstrate to our clients the design possibilities on offer when moving applications from the web to the desktop. While you can easily migrate any web app to the desktop by simply hosting it in a container, in doing so you miss the opportunity to explore the design potential the desktop has to offer.

With our initial release we illustrated this by adding a number of features that cannot be implemented, or just don't make sense, for a browser-based app:

1. Compact mode - the StockFlux app is a fairly standard tool for exploring stock prices. It has a toolbar icon that toggles the app between its 'full' and 'compact' modes. The compact mode occupies very little screen estate, and is ideal for keeping an eye on the markets.
2. Tear out tabs - inspired by Chrome, with StockFlux you can tear a tab out to create a new window, and move tabs between windows. It also works in compact mode.
3. Recently closed tabs - again, inspired by Chrome, when you close a window, you can easily restore it via the 'recently closed' menu .

<img src="{{ site.baseurl }}/ceberhardt/assets/stockflux/stockflux.png" />

Another interesting feature, that become possible when moving to the desktop, is window 'snapping'. This allows the user to dock multiple windows into a single unit which can be moved around the screen. Previously this is a feature that developers would either have to implement themselves, programming against the OpenFin APIs, or alternatively, would require third-party libraries to achieve. With the newly-release Layouts API, this is now a core feature of OpenFin.

## OpenFin Layouts

The OpenFin Layouts API was [announced earlier this year](https://openfin.co/blog/introducing-openfin-layouts/), with the first release appearing last month. The API itself is provided via a new service model, where applications are able to incorporate additional functionality via a plugin-style model. Adding layouts to your OpenFin app involves adding the following to the manifest:

~~~json
"services": [
  {
    "name": "layouts",
    "manifestUrl": "https://cdn.openfin.co/services/openfin/layouts/0.9.1/app.json"
   }
]
~~~

The service is exposed via the `openfin-layouts` API, which is [open sourced as part of Hadouken](https://github.com/HadoukenIO/layouts-service), and [available via npm](https://www.npmjs.com/package/openfin-layouts).

At runtime, the layouts service executes as a separate process, communicating with the client OpenFin application via the inter-application bus. This allows the service to manage layouts across multiple OpenFin applications.

The basic window docking behaviour provided by this service works really well, with windows docking together once they are moved close to each other. However, the default behaviour for un-docking requires the use of a hotkey (shift-control-U), which isn't terribly discoverable for the end-user.

The OpenFin Layouts API exposes various lifecycle hooks, including events that are raised when windows join / leave dock-groups. Within StockFlux we subscribe to these events and for windows that are part of a group we add a 'padlock' icon to the app toolbar.  When this icon is clicked, we invoke `Layouts.undockWindow()`, which instantly undocks all of the grouped windows.

The following screenshot shows two windows (one full, the other compact) docked together:

<img src="{{ site.baseurl }}/ceberhardt/assets/stockflux/snapped.png" />

(It makes more sense on an interactive demo where you can see the two windows moving around as a single unit!)

The OpenFin Layout API also adds a number of other features (e.g. layout persistence and tabbing) that we are not making use of within StockFlux just yet. This is because we have our own custom implementations of these features. However, we'll look to replace our bespoke implementation, and replace with OpenFin's, in a future release.

If you want to have a go with this demo, [download StockFlux installer zipfile](https://install.openfin.co/download?fileName=StockFlux-master&config=http://scottlogic.github.io/StockFlux/master/app.json), unzip and run the executable. You can also find the [sourcecode on GitHub](https://github.com/ScottLogic/StockFlux).
