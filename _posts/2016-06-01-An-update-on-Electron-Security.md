---
title: An update on Electron Security
date: 2016-06-01 00:00:00 Z
categories:
- dkerr
- Tech
tags:
- featured
author: dkerr
title-short: Electron Security update
layout: default_post
summary: It’s been a couple of months since my first post about the security of Electron.
  With v1.0 having recently been released I felt it was time for a a fresh look
image: dkerr/assets/featured/electron.jpg
---

It’s been a couple of months since [my post](http://blog.scottlogic.com/2016/03/09/As-It-Stands-Electron-Security.html) about the state of security in Electron and a lot has changed in this short time frame already! Now that Electron v1.0 has been [released](http://electron.atom.io/blog/2016/05/11/electron-1-0) I thought it would be a good time to take another look to see what improvements have been made.

## Growth + Maturity

<p style="text-align: center">
	<img src='{{ site.baseurl }}/dkerr/assets/electron-growth.png' title="Electron Growth" alt="Growth of the Electron framework over time" />
	<br />
	<span style="font-style: italic; font-size: 12px">Image taken from Electron v1.0 release announcement</span>
</p>

Electron continues to enjoy enormous growth, with the 1.0 release representing a major milestone in its maturity and stability. Electron’s developer community also continues to grow, with more and more companies building an ever-widening variety of applications using the framework. This is welcoming news, illustrating how Electron is being tried and tested for an ever increasing amount of use cases each with their own security challenges.

Electron’s documentation has also been completely revamped, it’s now a lot cleaner and clearer to read through and understand. API demos have been introduced to help explore the API in a more practical way, and a [security tutorial](http://electron.atom.io/docs/tutorial/security/) has been written to provide advice, tips and guidelines on securing your application. It’s nice to see official security guidance from the Electron team, demonstrating that it’s something they're concerned with when developing their framework.

## Workarounds Fixed

In my previous post, I discussed two workarounds ([3943](https://github.com/electron/electron/issues/3943), [4026](https://github.com/electron/electron/issues/4026)) that allowed node integration to be re-enabled despite it being explicitly turned off in the configuration. In the event of a successful XSS attack, it meant the attacker could re-enable node integration to gain full control over the victim's machine! Since then, [changes](https://github.com/electron/electron/pull/4897) have been implemented that were released in [version 1.1.1](https://github.com/electron/electron/releases/tag/v1.1.1) to fix these workarounds.

Firstly, child windows are now prevented from having `nodeIntegration` if their parent windows do not have it.

{% highlight js %}
// This will now only enable nodeIntegration if the parent window also has it enabled
window.open("www.example.com/evil.html", "", "nodeIntegration=1");
{% endhighlight %}

Additionally, webview elements are now disabled in any parent window without node integration:

{% highlight html %}
<!-- webview elements are now disabled if the parent window doesn’t have node integration -->
<webview src="data:text/html,<script>var fs = require('fs')</script>" nodeintegration></webview>
{% endhighlight %}

With these fixes, `nodeIntegration` cannot be re-enabled in the event of an XSS attack. Previously, any XSS attack could re-enable `nodeIntegration` to gain full control over the victim’s machine, even if it was explicitly turned off in the configuration.

## Sandbox

One notable contribution highlighted as an upcoming change in my last post was the re-introduction of the Chromium sandbox for any Electron processes that didn’t need node integration. The developers behind the Brave browser [planned to contribute back](https://github.com/electron/electron/issues/3943#issuecomment-205559782) the sandbox support they implemented on their fork of Electron. However, it seems the changes they made won’t be contributed back after all, since it required [extensions that some core contributors weren’t happy including in Electron](https://github.com/electron/electron/issues/3943#issuecomment-218844210).

It’s an understandable decision to make but nonetheless a bit of a shame that sandbox support hasn’t been contributed back. Without the sandbox, Electron applications aren’t run inside a restrictive environment that controls what processes can do.

It's worth mentioning that the benefits to introducing the sandbox are reduced thanks to the node integration workarounds being fixed. Without those fixes, only the sandbox would have prevented XSS attacks from gaining full privileges over a victim’s machine. Adding the sandbox now would mean it serves as an additional robust layer of protection and last line of defence.

Additionally, this doesn’t change the job of securing any Electron processes that did require node integration. The sandbox was only planned to be enabled for processes that didn't require any integration at all. For applications with node integration, it's especially important to follow the principle of [retaining the least amount of privileges](https://www.owasp.org/index.php/Secure_Coding_Principles#Principle_of_Least_privilege) needed to perform their business function, to ensure any successful attacks don't result in complete control being granted over a victim's machine.

## Conclusion

Only two months have passed and already so much progress has been made towards improving Electron’s security and reliability. All of the security workarounds highlighted in my previous post have been fixed, illustrating the rapid progress being made by the community.

It's a shame that Brave's sandbox support hasn't made it into Electron, giving Electron applications the same sort of protection offered by applications running inside Google Chrome. There's still hope that this may be something added into the framework in the near future.

I’d consider the Electron framework to be mature and secure enough for the vast majority of applications to be built using it. With the rapid growth and progress of the framework, it won’t be too long before more and more people share my viewpoint!
