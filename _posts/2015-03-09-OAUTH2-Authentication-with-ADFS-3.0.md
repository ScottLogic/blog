---
title: OAUTH2 Authentication with ADFS 3.0
date: 2015-03-09 00:00:00 Z
categories:
- cprice
- Tech
author: cprice
layout: default_post
summary: A quick run through of the steps involved in integrating a Node.js client with Active Directory Federation Services for authentication using OAUTH2.
---

A quick run through of the steps involved in integrating a Node.js client with Active Directory Federation Services for authentication using OAUTH2.

I recently had the dubious pleasure of proving the feasibility of authenticating apps against ADFS using its OAUTH2 endpoints. In short, whilst it is possible to securely prove identity and other claims, I’m left thinking there must be a better way.

## Configuring ADFS for a new OAUTH2 client

I started with an Azure Windows Server 2012 R2 VM pre-configured with an ADFS instance integrated with existing SAML 2.0 clients (or Relying Parties in identity-speak). As I was only interested in proving the OAUTH2 functionality I could piggy-back on one of the existing Trusts. If you need to set one up, [this guide](https://technet.microsoft.com/en-us/library/dn486828.aspx) might be useful.

To register a new client, from an Administrative PowerShell prompt, run the following -

{% highlight powershell %}
Add-ADFSClient -Name "OAUTH2 Test Client" -ClientId "some-uid-or-other" -RedirectUri "http://localhost:3000/getAToken"
{% endhighlight %}

This registers a client called ```OAUTH2 Test Client``` which will identify itself as ```some-uid-or-other``` and provide ```http://localhost:3000/getAToken``` as the redirect location when performing the authorization request ```(A)``` to the ```Authorization Server``` (in this case ADFS).

## The Authorization Code Flow

{% highlight text %}
+----------+
| Resource |
|   Owner  |
|          |
+----------+
     ^
     |
    (B)
+----|-----+          Client Identifier      +---------------+
|         -+----(A)-- & Redirection URI ---->|               |
|  User-   |                                 | Authorization |
|  Agent  -+----(B)-- User authenticates --->|     Server    |
|          |                                 |               |
|         -+----(C)-- Authorization Code ---<|               |
+-|----|---+                                 +---------------+
  |    |                                         ^      v
 (A)  (C)                                        |      |
  |    |                                         |      |
  ^    v                                         |      |
+---------+                                      |      |
|         |>---(D)-- Authorization Code ---------'      |
| Client  |          & Redirection URI                  |
|         |                                             |
|         |<---(E)----- Access Token -------------------'
+---------+       (w/ Optional Refresh Token)
{% endhighlight %}

The diagram above, taken from the [OAUTH2 RFC](https://tools.ietf.org/html/rfc6749#section-4.1), represents the ```Authorization Code Flow``` which is the only flow implemented by ADFS 3.0. This is the exchange that’s going to end up taking place to grant a user access. It’s pretty easy to understand but it’s worth pointing out that -
Some of the requests and responses go via the ```User-Agent``` i.e. they’re HTTP redirects.
```(B)``` is a double-headed arrow because it represents an arbitrary exchange between the ```Authorization Server``` (ADFS) and the ```Resource Owner``` (user) e.g. ```login form -> submit -> wrong password -> submit```.

## The ADFS 3.0 Authorization Code Flow

The OAUTH2 *specification* isn’t any more *specific* than that, I’ll come back to this. So now you need to know what this translates to on the wire. Luckily someone’s already done a great job of [capturing this](https://github.com/nordvall/TokenClient/wiki/OAuth-2-Authorization-Code-grant-in-ADFS) (in more detail than reproduced below).

### A. Authorization Request

{% highlight http %}
GET /adfs/oauth2/authorize?response_type=code&client_id=some-uid-or-other&resource=urn%3Arelying%3Aparty%3Atrust%3Aidentifier&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FgetAToken HTTP/1.1
Host: your.adfs.server
{% endhighlight %}

In this request the app asks the ADFS server (via the user agent) for an authorization ```code``` with the ```client_id``` and ```redirect_uri``` we registered earlier and a ```resource``` identifier associated with a Relying Party Trust.

### B. The Actual Login Bit...
This is the bit where the sign-in is handed off to the standard ADFS login screen if you don’t have a session or you’re implicitly signed in if you do. Speaking of that login screen, if you were hoping to meaningfully customise it, [forget](https://technet.microsoft.com/en-us/library/dn280950.aspx) [it](https://technet.microsoft.com/en-gb/library/dn636121.aspx).

### C. Authorization Grant

{% highlight http %}
HTTP 302 Found
Location: http://localhost:3000/getAToken?code=<the code>
{% endhighlight %}


### D. Access Token

{% highlight http %}
POST /adfs/oauth2/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Host: your.adfs.server
Content-Length: <some number>

grant_type=authorization_code&client_id=some-uid-or-other&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FgetAToken&code=thecode
{% endhighlight %}


### E. Access Token

{% highlight http %}
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
    "access_token":"<access_token>",
    "token_type":"bearer",
    "expires_in":3600
}
{% endhighlight %}


## Establishing the user’s identity and other grants

The interesting bit is the ```<access_token>``` itself, it is in fact a [JSON Web Token (JWT)](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32). That’s to say a signed representation of the user’s identity and other grants. You can either opt to trust it if you retrieved it over a secure channel from the ADFS server, or validate it using the public key of the configured [Token Signing Certificate](https://technet.microsoft.com/en-us/library/dn781426.aspx).

Here’s the [example Node.js implementation](https://github.com/chrisprice/adfs-example-integration) I created, which opts to validate the token. The validation itself is performed by the following snippet -

{% highlight js %}
var adfsSigningPublicKey = fs.readFileSync('ADFS-Signing.cer'); // Exported from ADFS
function validateAccessToken(accessToken) {
    var payload = null;
    try {
        payload = jwt.verify(accessToken, adfsSigningPublicKey);
    }
    catch(e) {
        console.warn('Dropping unverified accessToken', e);
    }
    return payload;
}
{% endhighlight %}


## Obtaining refresh tokens from ADFS 3.0

Refresh tokens are available from the ADFS implementation but you need to be aware of the settings detailed in [this blog post](http://blog.sonomapartners.com/2014/03/crm-2013-adfs-oauth-hey-wheres-the-refresh-token.html). To set them you’d run the following from an Administrative PowerShell prompt -

{% highlight powershell %}
Set-AdfsRelyingPartyTrust -TargetName "RPT Name" -IssueOAuthRefreshTokensTo AllDevices
Set-AdfsRelyingPartyTrust -TargetName "RPT Name" -TokenLifetime 10
Set-AdfsProperties -SSOLifetime 480
{% endhighlight %}

This would issue access tokens with a lifetime of 10 minutes and refresh tokens to all clients with a lifetime of 8 hours.

## Conclusion

Whilst I did get the OAUTH2 integration to work, I was left a bit underwhelmed by it especially when compared to the [features touted by AzureAD](http://www.cloudidentity.com/blog/2015/02/19/introducing-adal-js-v1/). Encouraged by [TechNet library docs](https://technet.microsoft.com/en-gb/library/dn633593.aspx), I’d initially  considered ADFS to be compatible with AzureAD and tried to get ADAL to work with ADFS. However, I quickly discovered that it’s expecting an [OpenID Connect](http://openid.net/connect/) compatible implementation and that’s something ADFS does not currently offer.

It might be my lack of Google foo, but this became typical of the problems I had finding definitive documentation. I think this is just one of the problems associated with the *non-standardised* OAUTH2 *standard*. Another is the vast amount of customisation you must do to make an OAUTH2 library work with a given implementation. OpenID Connect looks like a promising solution to this, but only time will tell if it gains significant adoption.

## When things go wrong…

Whilst trying to work out the correct configuration, I ran into a number of errors along the way. Most of them pop out in the ADFS event log but occasionally you might also get a helpful error response to an HTTP request. Here’s a brief summary of some of the ones I encountered and how to fix them -

> Microsoft.IdentityServer.Web.Protocols.OAuth.Exceptions. OAuthInvalidClientException: MSIS9223: Received invalid OAuth authorization request. The received 'client_id' is invalid as no registered client was found with this client identifier. Make sure that the client is registered. Received client_id: '...'.

When making the authorize request, you either need to follow the process above for registering a new OAUTH2 client or you’ve mistyped the identifier (n.b. not the name).

> Microsoft.IdentityServer.Web.Protocols.OAuth.Exceptions. OAuthInvalidResourceException: MSIS9329: Received invalid OAuth authorization request. The 'resource' parameter's value does not correspond to any valid registered relying party. Received resource: '...'.

When making the authorize request you’ve either got a typo in your RPT identifier, you need to create an RPT with the given identifier or you need to register it against an existing RPT.

> Microsoft.IdentityServer.Web.Protocols.OAuth.Exceptions. OAuthAuthorizationMissingResourceException: MSIS9226: Received invalid OAuth authorization request. The 'resource' parameter is missing or found empty. The 'resource' parameter must be provided specifying the relying party identifier for which the access is requested.

When making the authorize request, you’ve not specified a resource parameter, see previous. I found that most OAUTH2 libraries expect to pass a scope but not a resource parameter.

> HTTP error 503

This normally meant I had a typo in the ```/adfs/oauth2/authorize``` or ```/adfs/oauth2/token``` URLs (don’t forget the 2).
