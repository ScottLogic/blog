---
title: OAuth2 with SAML2.0 Authentication
date: 2015-11-19 00:00:00 Z
categories:
- bdimitrov-SL
- Tech
tags:
- Security
- OAuth
- SAML
- ".NET"
- Web
author: bdimitrov-SL
layout: default_post
summary: There aren't many examples of OAuth2 working with a SAML 2.0 as an authentication
  method on the Internet. The purpose of this post is to provide a simple implementation
  of these two technologies working together.
---

There aren't many examples of OAuth2 working with SAML 2.0 as an authentication method on the Internet. The purpose of this post is to provide a simple implementation of these two technologies working together.

First a bit of background. Since there <b>are</b> many articles explaining the workings of both OAuth and SAML on their own we have provided only a brief summary of each with relevant links for reference.

### Brief summary of SAML 2.0


SAML 2.0 is an XML based framework that is used for describing and exchanging security information. It can be used for Single Sign On (SSO), Identity Management and Federation.

More in depth information can be found here: [SAML Technical Overview](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).

### Brief summary of OAuth 2


OAuth 2 is an authorisation framework that enables applications to obtain limited access to user accounts. However it does not deal with authentication.

A more detailed explanation of this can be found here: [An Introduction to OAuth2](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2).

### SAML 2.0 and OAuth 2 terminology


Some of the SAML and OAuth terms are for similar concepts. Below is a list that should clarify the similarities.
SAML terms with OAuth equivalents in brackets:

 * Service Provider (Resource Server) – This is where the resources the client wishes to access reside.
 * Client – How user is interacting with resource server. E.g. web app through browser.
 * Identity Provider (Authorisation Server) – The server that owns user identities and credentials.

More information found here: [Choosing an SSO Strategy SAML vs OAuth2](https://www.mutuallyhuman.com/blog/2013/05/09/choosing-an-sso-strategy-saml-vs-oauth2/).

### Why use SAML and OAuth together?


Systems which already use SAML for both authentication and authorisation and want to migrate to OAuth as a means of authorisation will be facing the challenge of integrating the two together. It makes sense for such systems to keep using SAML as it is already set up as an authentication mechanism.


### The Solution


The implemented solution has the same flow as described in the following article:  [SAML 2.0 Bearer Assertion Flow for OAuth 2.0](https://help.sap.com/saphelp_nw74/helpdata/en/12/41087770d9441682e3e02958997846/content.htm).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/oauth_with_saml_flow.png" title="OAuth2 with SAML2 flow" alt="Diagram of the interactions between the different actors in the flow" />

Here the Client gets a SAML bearer assertion from the SAML Identity Provider then requests an access token from the Authorisation Server using the SAML bearer assertion as proof of identity. The Authorisation Server then verifies this and passes back an OAuth token which is used by the client to access the Resource Server. In our solution we use OAuth2 [Authorization Code Grant](https://tools.ietf.org/html/rfc6749#section-4.1) flow.

### .NET Solution structure


The solution with the implementation can be found here: <a href="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/OAuthWithSAMLAuthentication.zip">Download</a>. We have intentionally used as few external libraries as possible. The aim is to have our own simplified version of all the components from the diagram above. In this way the implementation details will be clearly visible as opposed to being hidden "behind the scenes" in a library.

The solution consists of the following projects:

 * Client – the application used by the resource owner to access his resources.
 * Resource server – the server holding the resources.
 * SAMLIdentityProvider – implementation of a SAML server; authenticates the user and issues a SAML token containing assertions about the user
 * SAMLLibrary – classes and utilities for SAML; based on code from: [C# SAML 2.0 Identity Provider](https://github.com/covermymeds/saml-http-post-reference)
 * AuthorisationServer – implementation of an OAuth server; authorises the client app to access the resources; based on the following post: [OWIN OAuth 2.0 Authorization Server](http://www.asp.net/aspnet/overview/owin-and-katana/owin-oauth-20-authorization-server)

You need to build the entire solution in order to run the demo.

### User interactions


To access his resource the user goes through 6 screens. First the main Client app page provides the interface for accessing the resource.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/client_screen.png" title="Main client app page" alt="Main screen for of the Client app" />

The user clicks 'Get Resource', but since he has not been authenticated yet he is redirected to the SAML server to provide credentials. For this demo project we have hardcoded "user" and "password" as login details.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/saml_login_screen.png" title="SAML Login screen" alt="SAML Login screen prompting for username and password" />

The credentials are validated, the user is authenticated using the federated identity (agreed between the SAML server and OAuth server) and is redirected back to the Client app.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/saml_redirect_screen.png" title="SAML Redirect screen" alt="Redirect screen informing the user he is being taken back to the Client app" />

The Client app in turn redirects to the OAuth Authorisation server in order for the user to grant permissions to the Client app to access resources on his behalf.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/client_redirect_screen.png" title="Client Redirect screen" alt="Redirect screen informing the user he was successfully logged in and is being taken to the authorisation server" />

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/authorisation_server_screen.png" title="Authorisation server screen" alt="A form prompting the user to grant the Client app access to his resources" />

After the user grants permission he is redirected back to the Client app main page where he can now access the resource.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/client_success_screen.png" title="Resource successfully accessed screen" alt="Main screen for the Client app with the resource loaded" />

### Sequence diagram and code explanation


The sequence of interactions between the different components is shown in the following diagram. (Link to bigger image: <a href="{{site.baseurl}}/bdimitrov-SL/assets/oauth_with_saml/sequence_diagram.png">Sequence diagram</a>)

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/sequence_diagram.png" title="Sequence diagram" alt="Sequence diagram of interaction between the different components" />

The alternating colours indicate the set of actions that occur between the different screens the user (resource owner) sees as described in User Interactions section above.

1) The user opens a web browser (user agent) and navigates to the Client app URL issuing a GET request to the Client. The Client app returns the Main view to the user agent (<code>ClientController.cs</code> line 35). The user now sees the form with 'Get Resource' button.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_1.png" />

2) The user clicks 'Get Resource' button in the user agent issuing a GET request to the Client app. The Client app in turn tries to access the resource on behalf of the user by issuing a GET request to the Resource server. If the user is already authenticated and authorized then an OAuthToken is stored in a cookie. The Client attempts to extract the token from the cookie (<code>ClientController.cs</code> line 47) and adds it as a URL parameter to the resource request using the OAuthRequestHandler (<code>ClientController.cs</code> line 50). The GET request is then issued (<code>ClientController.cs</code> line 54).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_2.png" />

As the user is not authenticated the Resource server does not receive an OAuthToken and returns Unauthorized to the Client app – this is done by the OWIN middleware. The Client app then redirects the user agent to the SAML server for authentication and includes a SAML request as a query parameter (<code>ClientController.cs</code> line 65).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_3.png" />

The SAML server receives the request, checks that the issuer of the SAML Request is in the list of trusted sources (<code>SAMLController.cs</code> line 48) and returns the Login view to the user agent. The user now sees the login form.


<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_4.png" />

3) The user enters his credentials and clicks the 'Submit' button issuing a POST request to the SAML server. The SAML server checks the user credentials (<code>SAMLController.cs</code> line 76 – for our simple demo purposes we just use hardcoded strings) and creates and signs a SAML Response. Since the SAML response is too big to include as a query parameter the SAML server embeds it in a form and returns the ClientRedirect view to the user agent. The user now sees a “Please wait to be redirected back to the client” message.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_5.png" />

4) The user agent automatically submits the form from the ClientRedirect view using JS. This issues a POST request to the Client app with the SAML Response in the payload. The Client caches the username and SAML Response (<code>ClientController.cs</code> line 130), crafts the appropriate URL to the Authentication server (<code>ClientController.cs</code> line 139), and again embeds the SAML in a form and returns OAuthRedirect view to the user agent. The user now sees a “Successful login! Redirecting to the authorisation server” message.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_6.png" />

5) The user agent automatically submits the form from the OAuthRedirect View using JS. This issues a POST request to the Authorisation server with the SAML Response in the payload and a state parameter that will be used to access the user's session back on the Client app. The Authorisation server verifies that the SAML is valid (<code>OAuthController.cs</code> line 97), stores a hash of the SAML response so that it can be used later for verifying the user identity (<code>OAuthController.cs</code> line 106), creates an application cookie identity with the information provided by SAML (<code>OAuthController.cs</code> line 109), and redirects the user agent to the authorisation endpoint (<code>OAuthController.cs</code> line 118).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_7.png" />

The user agent then issues a GET request to the authorisation endpoint. If the user was successfully authenticated the Authorisation server returns the Authorize View. The user now sees a form that prompts them to grant privileges to the Client app.

6) The user clicks the “Grant” button. The user agent issues a POST request to the Authorisation server. The Authorisation server creates a new bearer type identity for the user with all of the rights that the user authorised. (<code>OAuthController.cs</code> line 61).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_8.png" />

The OWIN middleware creates an OAuth authentication code (<code>Startup.Auth.cs</code> line 102) and redirects the user agent to the Client app redirect URL. The query parameters include the authentication code and the state parameter provided by the Client app back in 5).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_9.png" />

The Client app uses the state parameter to access the user's session state (<code>ClientController.cs</code> line 86) and issues a POST back to the Authorisation server in order to exchange the authorisation code for an OAuth access token (<code>ClientController.cs</code> line 99). The request includes the username and SAML hash to be compared as means of authentication (<code>ClientController.cs</code> line 90).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_10.png" />

The Authorisation server compares the provided SAML hash with the one stored in the cache to authenticate the user (<code>Startup.Auth.cs</code> line 86) and the OWIN middleware returns an OAuth access token to the Client app.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_11.png" />

The Client app stores the OAuth access token in a cookie and redirects the user agent to the Main view (<code>ClientController.cs</code> line 114). The user now sees the form with “Get resource” button again.

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_12.png" />

7) The user clicks 'Get resource' button in the user agent issuing a GET request to the Client app. The Client app in turn tries to access the resource on behalf of the user by issuing a GET request to the Resource server (<code>ClientController.cs</code> line 54).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_13.png" />

The user has already authenticated and authorized the Client app so the OAuthToken from the cookie is sent as well. The OWIN middleware on the Resource server parses the OAuthToken and sets the user identity automatically. The identity information is extracted and returned as a response to the Client app (<code>ResourceController.cs</code> line 14).

<img src="{{ site.baseurl }}/bdimitrov-SL/assets/oauth_with_saml/code_14.png" />

The Client app returns the Main view containing the response to the user agent. The user sees the response.

### Summary


It is hard to find working examples of OAuth working with SAML. Hopefully this post can serve as a reference point as to what an actual implementation should include. While the provided code uses as few libraries as possible for simplicity, a real solution can make use of existing libraries such as [ComponentSpace's SAML library](http://www.componentspace.com/SAMLv20.aspx) and [DotNetOpenAuth](http://dotnetopenauth.net/).
