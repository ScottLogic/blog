---
author: dkerr
title: As It Stands - Electron Security
title-short: Electron Security
layout: default_post
categories:
  - Tech
summary: A brief look at the current state of application security in Electron
image: dkerr/assets/featured/electron.jpg
tags:
  - featured
---

Over the past few years, there's been an increasing demand for web applications to separate from the browser and become fully integrated desktop applications. Previously, the amount of time and effort required to convert an existing application was a major roadblock to developers and businesses. However, frameworks are starting to appear offering an easier route to build cross-platform desktop applications utilising web technologies.

Back in early 2014, the [Atom IDE](https://atom.io) was released by GitHub with much fanfare. What made Atom unique was how GitHub managed to develop this cross-platform desktop application using only web technologies. Under the hood of Atom, the open-source Electron framework was developed to allow Atom to look, feel and behave just like a desktop application.

Ever since Atom's release, Electron has been rapidly gaining popularity and is being used to build an [extensive variety](http://electron.atom.io/#built-on-electron) of desktop applications. Companies such as Facebook, Slack, Docker and Microsoft are using it to build applications from the eponymously named [Slack](https://slack.com/), a messaging client inspired by IRC, to [Kinematic](https://kitematic.com), a GUI used to visualise and manage docker containers.

<p style="text-align: center">
	<img src='{{ site.baseurl }}/dkerr/assets/atom-electron-chromium.png' title="Atom stack" alt="Atom + Electron + Chromium stack" />
</p>

To allow web applications to run as desktop applications, Electron uses [Chromium](https://www.chromium.org/Home). Chromium is the open source foundation on which the Chrome web browser is based. Effectively, an Electron application is running inside a customised Chromium wrapper. Therefore, the security challenges an Electron application faces are almost identical to if it was running inside Chrome or any other web browser.

## Goodbye Sandbox

<p style="text-align: center">
	<img src='{{ site.baseurl }}/dkerr/assets/chromium-sandbox.png' title="Chromum Sandbox" alt="Chromium sandbox" />
</p>

The [Chromium sandbox](https://www.chromium.org/developers/design-documents/sandbox) encapsulates processes inside a very restrictive environment. The only resources sandboxed processes can freely use are CPU cycles and memory. What processes can do is controlled by a well-defined policy, this prevents bugs or attacks from performing IO operations (e.g. reading / writing files) on the user's system.

To provide applications with desktop functionality, the Electron team modified Chromium to introduce a runtime to access native APIs as well as Node.js's built in and third-party modules. To do this the Chromium sandbox protection was disabled, meaning any application running inside Electron is given unfiltered access to the operating system.

<p style="text-align: center">
	<img src='{{ site.baseurl }}/dkerr/assets/electron-sandbox.png' title="Electron Sandbox" alt="Electron sandbox" />
</p>

This is not a concern for a lot of Electron applications, especially those that don't pull in remote data and need extensive operating system privileges anyway (such as an IDE). However, this is a (potentially) serious and unnecessary security risk for applications that do pull in remote data, any successful XSS attack would give the attacker full control over the victim's machine!

It's worth stressing that a successful XSS attack within a sandboxed application is still a catastrophic event that can do untold damage. Even restricted to the sandbox, an attack can execute scripts to hijack user sessions, deface web sites, insert hostile content, redirect users and install malware. Nonetheless, unless they escape the sandbox the potential for damage stops at the browser level with the operating system left unharmed and only data explicitly shared with the browser at risk.

## False sense of security

To reduce the potential impact of an XSS attack on their application, many developers look at turning off node integration if it isn't needed. It's a sensible approach taken to [minimise the attack surface](https://www.owasp.org/index.php/Secure_Coding_Principles#Minimize_attack_surface_area) of the application, and [retain the least amount of privilege](https://www.owasp.org/index.php/Secure_Coding_Principles#Principle_of_Least_privilege) required to perform their business function.

Each Electron application has a [main process](http://electron.atom.io/docs/v0.36.8/tutorial/quick-start/#main-process) which executes a script that bootstraps the application. This script creates web pages by instantiating [BrowserWindow](https://github.com/atom/electron/blob/master/docs/api/browser-window.md) objects, each instance runs in their own process called the renderer process. In this script, it's possible to turn off node integration for each renderer process by setting a [`nodeIntegration` flag](https://github.com/atom/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions) to false inside the configuration provided when instantiating the BrowserWindow:

{% highlight js %}
new BrowserWindow({
    webPreferences: { nodeIntegration: false }
});
{% endhighlight %}

**However, exploits exist that allow the renderer processes to re-enable node integration despite it being explicitly turned off in the configuration!** This is something many developers are unaware of, any XSS attack has the potential to use these loopholes to re-enable node integration and gain full control over the victim's machine.

The first [workaround](https://github.com/atom/electron/issues/4026) uses Electron's [`window.open`](http://electron.atom.io/docs/v0.36.8/api/window-open/) function to spawn new child windows. The default behaviour for a new child window is to inherit the parent window's options. Currently, it's possible to override the options (including node integration) by setting them in the features string when calling `window.open`:

{% highlight js %}
window.open("www.example.com/evil.html", "", "nodeIntegration=1");
{% endhighlight %}

The code above spawns a new BrowserWindow object which displays the provided URL in a web page with node integration enabled. Any scripts ran within the given URL would have full access to all the Node APIs (e.g. [`FileSystem`](https://nodejs.org/api/fs.html#fs_file_system)) and any Electron modules [provided to renderer processes](http://electron.atom.io/docs/v0.36.8/#modules-for-the-renderer-process-web-page).

Another [workaround](https://github.com/atom/electron/issues/3943) involves inserting a [`webview`](https://electron.atom.io/docs/api/webview-tag/) element into the page. The webview element is a custom Electron DOM element used to embed guest content (such as web pages) inside an application. It's possible to add `nodeintegration` and `disablewebsecurity` attributes to the webview element to provide the guest content with access to the Node APIs as well as bypassing any [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) restrictions enforced by the renderer process.

{% highlight html %}
<webview src="data:text/html,<script>var fs = require('fs')</script>" nodeintegration></webview>
{% endhighlight %}

The example above runs an inline script that imports Node's [`FileSystem`](https://nodejs.org/api/fs.html#fs_file_system) module, access is granted thanks to the `nodeintegration` attribute placed on the `webview` element. The guest content inside the webview has identical privileges to the `window.open` workaround.

## As it stands

Successful XSS attacks are already catastrophe events for web applications. Electron widens the consequences of these attacks since they are no longer constrained by the sandbox from accessing the victim's machine. This places even greater emphasis on developers to ensure that their applications are not vulnerable to XSS, as the layer of protection offered by the sandbox is no longer present.

One smaller concern is how up-to-date the Electron team will keep its version of Chromium. As security issues are [patched and published](http://googlechromereleases.blogspot.co.uk/2016/03/stable-channel-update.html) by the Chromium team, Electron will need to keep updated to stay protected against exploits. So far, the team have been keeping Electron closely in sync and [their plan](https://electron.atom.io/docs/faq/#when-will-electron-upgrade-to-latest-chrome) is to be only one to two weeks behind. It's worth pointing out that there are a number of large companies who have a lot to lose if Electron ever fell too far behind, this makes it rather unlikely to happen but it's still a potential risk to monitor.

## Planned Changes

The good news is that Electron is a very active open source project, backed by a major web player ([GitHub](https://www.github.com)) and a lot of companies have built their products using it. As a result, the workarounds mentioned above (as well as other issues) are already being addressed thanks to contributions from a number of interested parties.

Once those workarounds have been patched, Electron applications should be a lot more resilient against XSS attacks re-enabling node integration. It's worth pointing out that there's an [open discussion](https://github.com/atom/electron/issues/1753) around Electron's security model on GitHub, so further changes and improvements are likely to be made once this discussion is finalised.

One notable contribution that's underway is the return of sandbox protection for any Electron applications that don't need node integration. This work is being undertaken by the developers of [Brave](https://www.brave.com/), a recently-announced web browser which aims to block ads and trackers to protect user's privacy and enhance browsing speed. They've been incredibly open about [their plan](https://twitter.com/BrendanEich/status/696610645693730816) which is to contribute their progress back to the community, once the work on their forked version of Electron is finished.

<p style="text-align: center">
	<img src='{{ site.baseurl }}/dkerr/assets/brave-sandbox.png' title="Brave Sandbox" alt="Brave sandbox" />
</p>

They're using Electron to wrap the webpage content shown by their browser, this means they're not in control of the content being shown and so are far more vulnerable to attacks. The content they are showing needs no node or desktop integration, so the loss of this functionality caused by re-enabling the sandbox protection isn't an issue to them.

## Conclusion

To summarise, Electron currently has its fair share of security issues that complicate the process of building secure applications. The removal of the sandbox protection in return for desktop integration removes an important [layer of defence](https://www.owasp.org/index.php/Defense_in_depth) against XSS attacks. Various workarounds also exist that circumvent turning node integration off in the event of an XSS attack. Fortunately, due to the framework's popularity and active community the Electron team are already making good progress to resolving these issues.

With that said, there's still a lot of work to be done. One major goal should be a more secure way for applications that do need some node and desktop integration to interact with the operating system. At the moment however, there's no clear path forward on how that would be achieved.

**[See this post for an update](http://blog.scottlogic.com/2016/06/01/An-update-on-Electron-Security.html) to the points raised in this article.**
