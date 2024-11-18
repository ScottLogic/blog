---
title: 'Delta requests for frequently-updated application bundles: from 2002 to service workers'
date: 2019-08-15 00:00:00 Z
categories:
- Tech
author: rwilliams
layout: default_post
summary: Caching frontend application bundles isn't as effective when they're updated frequently. In this post, I'll explore the idea of using deltas to update already-cached bundles, and cover some approaches - including one that's feasible today using service workers.
---

One of the powers given to developers by service workers is the ability to slot in between the main window application and the browser's network layer. This has made offline applications possible, as well as performance improvements driven by smart caching strategies. This level of the stack was previously beyond our reach, reserved for browser developers. Now, in addition to application-specific use cases, it can act as a breeding  ground for general ideas that could one day make their way into web standards. One such idea is HTTP delta requests, which I'll explore in this post.

Caching frontend application bundles isn't as effective when they're updated frequently - an increasingly common occurrence as teams move towards continuous delivery. Updating already-cached bundles using downloaded deltas can vastly reduce transfer sizes and maintain loading times. In this post, I'll take a look at the situation, possible gains, considerations, and approaches - including one that's feasible today using service workers.


## Current caching practice
First as a primer, let's take a look at a typical (as I see it) caching approach today for enterprise single-page applications. You could skip this section.

Each bundle version is given an unique URL, by including a version number or content hash within the path or filename. It's then served with headers indicating that it may be cached for a very long period (effectively forever) and used without consulting the server to check for updates (revalidation):

~~~http
GET main.ad717f2466ce655fff5c.js HTTP/1.1
~~~

~~~http
HTTP/1.1 200 OK
Cache-Control: public, max-age=31536000
~~~

The bootstrap (entry point) bundle is then loaded from a script tag on a HTML page that's much less cacheable - for a very short period, not at all, or requiring mandatory revalidation (by time or entity tag) before a cached copy may be used:

~~~http
GET index.html HTTP/1.1
~~~

~~~http
HTTP/1.1 200 OK
Cache-Control: public, no-cache
ETag: 5987b7ff34ac456af3f4ace1c8f91283cf3dec5a2b918e500e15f73f502762fb
~~~

The application may be split into multiple bundles (code splitting) to improve load times, possibly with consideration to the frequency with which different parts change (e.g. separate bundle for libraries which change less often). Caching of these may then be optimised by using a hash of the bundle content to create the unique URL - rather than version numbers, which always change even if the content hasn't.


## More frequent updates with continuous delivery
With the aforementioned caching strategy, and say a week or more between releases, a very high proportion of return visits will have cache hits for the bundles. The application loads quickly, and we don't consume any of the user's data allowance.

That changes when releases become more frequent - the more frequent we release (say daily, or even multiple times a day), the more cache misses our users will encounter. How much of an issue that is depends on the nature of the application and its usage patterns; e.g. size/complexity, proportion of first-time vs. returning users, frequency of visits, user connectivity.

Delta updates is one way of mitigating this, by reducing the amount of data that needs to be transferred when the application is updated. Pre-emptive preloading of updates is another, which isn't in scope for this post.


## Delta bundle loading concept
The proportion of new/added/changed code in a bundle between different versions can be expected to be quite small relative to its total size. This is especially so when releases are frequent. That's a lot of redundant data that we're making our users download.

If we could transfer only the parts that change, it would eliminate that waste - this is the idea of delta requests in general, here specialised as delta bundle loading. To put it simply, the server calculates a delta (diff) of the changes between two versions, which the client then downloads and applies to the version it already has - thus recreating the newer version.

To illustrate what kind of reduction in transfer size this could achieve, let's put aside bundles for a moment and consider the smaller (105 KB) `react-dom` library. Specifically, the scenario of upgrading from an already-cached version (16.8.0) to the next patch version. Below is a comparison of the transfer size required for a complete transfer vs. delta transfer, using a non-optimised delta format[^jsdiff] from [my own proof-of-concept](https://github.com/robatwilliams/differential-loading-poc)[^poc], for various compression schemes (sizes in KB):

<pre>
            Uncompressed    gzip   brotli
Complete           104.7    41.4     33.1
Delta               33.6     2.5      1.5
</pre>

That's a large relative drop, and also an absolute one when scaled up to a "good" bundle size of a few-hundred KB compressed. It would probably give an appreciable improvement for users on poorer connections, especially with larger bundle sizes. If neither of those is applicable however, it's not likely to be worth the effort to put the technique in place unless it were a built-in feature of browsers and servers.

Reduction in transfer size comes at the fairly expensive (by web file serving standards) computational cost of computing deltas on the server. It would be wise to cache output, or even better precompute deltas. In contrast, applying deltas in the browser is of negligible cost.


## RFC 3229: Delta encoding in HTTP
> Many HTTP (Hypertext Transport Protocol) requests cause the retrieval of slightly modified instances of resources for which the client already has a cache entry.  Research has shown that such modifying updates are frequent, and that the modifications are typically much smaller than the actual entity.  In such cases, HTTP would make more efficient use of network bandwidth if it could transfer a minimal description of the changes, rather than the entire new instance of the resource.  This is called "delta encoding."
>
> &mdash; RFC 3229 abstract

Protocol-level support for delta transfer in HTTP was proposed by [RFC 3229](https://tools.ietf.org/html/rfc3229) in 2002. It extends HTTP with three new headers and a new status code to facilitate the following basic client-server exchange.

The request starts off as a normal conditional request to validate that the currently-held resource is the latest, which would normally yield a `304 Not Modified` (without content) or a `200 OK` (with the complete updated resource). The new `A-IM` (Accept Instance-manipulations) header indicates that in case of an update, the client is willing to accept it as a manipulation (i.e. application of a delta, in one of the specified formats) applied to the currently-held version of the resource.

~~~http
GET index.html HTTP/1.1
If-None-Match: "123xyz"
A-IM: vcdiff, diff
~~~

In the case of the resource having been updated, the server may respond with the [`226 IM Used`](https://httpstatuses.com/226) status code instead of a `200 OK`. This indicates that it took up the client's invitation to send the response as a manipulation (delta). The `IM` (Instance-manipulation) header indicates which of the delta formats accepted by the request it decided to use.

~~~http
HTTP/1.1 226 IM Used
ETag: "489uhw"
IM: vcdiff
~~~

The RFC [remains](https://www.rfc-editor.org/info/rfc3229) a proposed standard, with no implementations other than a [few](https://www.wyman.us/main/2004/09/using_rfc3229_w.html) [experiments](https://www.ctrl.blog/entry/feed-delta-updates.html) at applying it to RSS feeds. [Reasons](https://new.blog.cloudflare.com/efficiently-compressing-dynamically-generated-53805/#rfc3229) [given](https://lists.w3.org/Archives/Public/ietf-http-wg/2008JulSep/att-0441/Shared_Dictionary_Compression_over_HTTP.pdf) for lack of adoption are that the URL-centric approach is unsuitable for dynamic/parameterised content, and the compute/storage demands it would place on web servers. I wouldn't expect this to be such a concern for the application bundles/libraries use case: there are few (if any) variations, deltas can be cached on the server (or better, precomputed), and we can limit the number of older versions we support delta-upgrading to the latest.


## Shared Dictionary Compression for HTTP (SDCH)
In 2008, a team from Google set out to design a technique for optimising-out redundant data between multiple responses, without the aforementioned issues of delta encoding. They came up with [SDCH](https://lists.w3.org/Archives/Public/ietf-http-wg/2008JulSep/att-0441/Shared_Dictionary_Compression_over_HTTP.pdf).

The approach is to supply the client with a dictionary of common fragments (e.g. a site's page header) early on, and then substitute those fragments for their much-smaller dictionary keys in later responses. Contrast this to compression schemes such as gzip and Brotli, which work on each response individually. [This post by Adam Prescott](https://aprescott.com/posts/sdch) provides a further (yet concise) explanation of its basic workings, while [this post from LinkedIn](https://engineering.linkedin.com/shared-dictionary-compression-http-linkedin) provides a bit more along with their story of trialling it.

SDCH was supported in Chrome from 2010 to 2017, and used on Google websites. The [decision to unship](https://groups.google.com/a/chromium.org/d/msg/blink-dev/nQl0ORHy7sw/HNpR96sqAgAJ) cited lack of interest/adoption by non-Chromium browsers, and limited standards activity.

While SDCH came much further than RFC 3229, it does appear to be less suitable than its predecessor for the application bundles use case. It serves the need it was designed for; a more chatty-conversation type of client-server interaction, where the content of the dictionary can be worked out and refined. This might have been one of the reasons the Gmail team chose not to use it in 2012 when they [experimented with delta delivery of their bundles.](https://www.w3.org/2012/11/webperf-slides-hundt.pdf)


## DIY with service workers
We've seen that protocol-level efforts on improving efficiency of multiple responses with very similar content have stalled. For application data requests, there's always the option of implementing a DIY approach in the client and server sides of your application. You could even do it for your JavaScript code by resorting to `eval()` - which you shouldn't.

Here's where service workers come in useful - we can use them to implement delta requests at their own layer, transparently to the client-side application itself. The approach is similar to that of RFC 3229, the key difference being that the delta is applied by the worker rather than the browser itself. It requires a service worker implementation to request and apply the deltas, and a server-side implementation to handle requests by computing the requested deltas.

There have been a few open-source efforts on doing this. They are all general-purpose, and none are production-grade or have been adopted. Only the first one out, [sw-delta](https://github.com/gmetais/sw-delta), has received any [significant](https://github.com/gmetais/sw-delta/stargazers) [community](https://twitter.com/gaelmetais/status/760446075719127040) [attention](https://news.ycombinator.com/item?id=12284846). The other two I found are [delta-cache](https://github.com/wmsmacdonald/delta-cache-browser), and a description of an implementation in [this blog post](https://blog.wanderview.com/blog/2015/10/13/patching-resources-in-service-workers/) by Ben Kelly. All are well-explained by their authors and work in basically the same way.

The delta-cache implementation actually implements RFC 3229, where all versions of the same resource share the same URL, and deltas are served with the `226` response code. The latter does preclude caching, which was a design goal of the RFC seemingly due to concern about old/misbehaving proxy servers in those days. Given the slowness of generating deltas server-side (unless precomputed), this is an issue as it rules out using a caching proxy to mitigate the slowness. It would also prevent CDN distribution. The other two implementations take the approach of treating deltas as separate resources in their own right, which avoids this issue and stays in the safer and preferable realm of standard HTTP usage.

Various diff algorithms/formats have been tried and investigated, including the textual [diff-match-patch](https://github.com/google/diff-match-patch) (sw-delta) and the binary [vcdiff](https://en.wikipedia.org/wiki/VCDIFF) (delta-cache). The large size drop from complete resource to delta makes for diminishing returns in optimising the format (also the delta can be compressed with gzip/Brotli); performance of computing and applying is more important.


## Conclusion
Eliminating the inefficiency of transferring complete resources when only a small part of them have changed is an old idea that doesn't want to go away. The first mention I was able to find was in [this W3C note from 1997](https://www.w3.org/TR/NOTE-drp-19970825).

While SDCH was put to work by Google in their browser for their own websites for many years, none of the approaches have gained traction. The individual incentive is perhaps lacking in our world of ever-faster-and-cheaper data connections. The use cases may also be too different to allow a single standard approach that application developers can use without significant custom implementation.

There are two new-ish and compelling use cases I see in the area of application bundles and libraries. First, delivering frequent updates with continuous delivery (as previously mentioned). The other is allowing [micro frontends](https://martinfowler.com/articles/micro-frontends.html) to independently use different versions of libraries (thus avoiding coupling through lockstep upgrades) without the overhead of transferring each one in full.

From the browser perspective, I think service workers are the star of this story. They allow developers to experiment and quickly iterate at a level previously reserved for browser developers, acting as a breeding ground for ideas that could one day make their way into web standards.


---
[^jsdiff]: Using `diffChars` from the [jsdiff](https://github.com/kpdecker/jsdiff) library, then a [simple pruning](https://github.com/robatwilliams/differential-loading-poc/blob/103c99f1f5c7292c376686fcfc42d42a608ce95d/src/deltaUtil.js#L29) of unchanged/replaced values.

[^poc]: I had called my POC "differential" rather than "delta" loading. The term "differential loading" is in fact popularly used to describe the [technique of conditionally serving modern or legacy bundles](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) to different browsers depending on their support for modern features.
