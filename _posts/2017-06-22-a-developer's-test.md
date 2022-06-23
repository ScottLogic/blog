---
title: Load testing Alteryx API with Gatling
date: 2017-06-22 00:00:00 Z
categories:
- zwali
- Data Engineering
tags:
- Load Testing
- Alteryx
- OAuth
author: zwali
layout: default_post
summary: A successful attempt of load testing Alteryx API with Gatling and a not-so-successful
  attempt with Apache JMeter
---

Recently I had to integrate Alteryx API into a web page. If you are familiar with Alteryx, you would probably know that Alteryx is amazing for data modelling and has an array of capabilities for connecting to other data related tools. My prototype was based on the Alteryx – Tableau combination which is pretty standard. However, we were then embedding Tableau visualisations in a webpage and one of the requirements was to invoke Alteryx workflows on demand from the web page which will take parameters, re-run the workflow and publish fresh data into the Tableau workbook. This whole chain of events is required to happen in seconds’ delay at most, otherwise the user experience will be poor. There is not much web content available on the API performance of Alteryx, in fact there is nothing other than [this one page](https://gallery.alteryx.com/api-docs/) on their official website. Data Analysis has traditionally been desktop based so it kind of explains the scarcity of resources in this area.

However, given my requirements, it became apparent that I need to load test the API. First I started by looking at possible tools for doing tests like this. As a web developer, I am well versed with fiddler and postman. But none of those tools seem to have load testing capabilities. I was looking at NPM as a possible option. Now the next catch – Alteryx API is protected by OAuth 1.0, and a rather rigid version of it. As in they only allow passing of OAuth credentials in the query string and not in the request header. The encryption protocol is HMC-SHA1. They don’t accept any other encryption type. There is a nonce required, and the signature is generated based on the nonce and a few other parameters. So, you can’t reuse a signature between requests. You can download basic client code written in C# or JavaScript from the Alteryx page for generating these parameters as per the criteria.

I set off by trying out [Apache JMeter](http://jmeter.apache.org/). It seems like a popular tool. You can plug in scripts as pre-processors or post-processors written in groovy, BeanShell Java, JavaScript etc. As I am using the JavaScript library I got from Alteryx website, I decided to write a JavaScript pre-processor. There are a few issues with loading external files in JMeter pre-processor, but even after jumping through those hoops, I found that the library is using some browser functions and it throws exception when run from JMeter. I am not saying that I am one hundred percent confident that those exceptions could not be averted if I un-minified the JavaScript library and re-wrote the browser based functions. But the whole JMeter environment felt really restricted. No proper code editor or debugging functionalities were available. It is no more than a notepad really. At least for a developer who is used to well-equipped IDEs, I was finding it rather crippling. I still spent some more time in it, tried an alternative JavaScript library for OAuth client and a BeanShell library, too. But they came back with an API response of ‘The provided signature was invalid’. Given such limited capability of troubleshooting and code building, I decided to look for a more ‘developer friendly’ test tool.

This time I tried [Gatling](http://gatling.io/). Gatling is quite flexible as it is geared for both non-coding testers and dev-testers alike. It has a recording tool that can record your page activities and you can then re-adjust parameters on that recording and replay it. That is the non-coding side of it. If you are a coder, you can write code in Scala or any other JVM language. So I can now actually write test code in a Scala project in IntelliJ or Eclipse.

There are a couple of Scala packages io.gatling.highcharts and io.gatling that you have to import in your standard Scala project. You have to implement the Simulation trait from that package. And you set up your test inside that class. I am assuming that you will already have sbt installed on your PC. It is the de facto build tool for Scala projects, similar to Maven for Java. sbt allows mix of Java and Scala code. You can write build definition in Scala so that adds enormous flexibility.

For executing the simulation-

<ol>
  <li>At the project root directory, open up the command line.</li>
  <li>Type in sbt. This should give you a prompt.</li>
  <li>Type in gatling:test.</li>
</ol>

The output is pretty verbose. I turned on logging for failure scenarios so I can get more detailed messages. It is done by going into the conf folder of where Gatling in installed in your PC. There is a file named logback.xml. The below two lines need to be uncommented.

~~~ xml
<logger name="io.gatling.http.ahc" level="DEBUG" />
<logger name="io.gatling.http.response" level="DEBUG" />
~~~

Now that’s half the battle conquered already as I can now import any library I want, I can debug and have ‘bare necessities’ like syntax checking, compile time checking etc. Also, Gatling generates some pretty HTML output with the test results if you want to impress others.

##Inside the Simulation class

I am instantiating a ScenarioBuilder where I am defining the http request that I want to simulate. I am specifying the URL and query string parameters.

~~~ scala
val scn: ScenarioBuilder = scenario("Scenario Name")
  .exec(
  http("request_1")
    .post(url)
    .headers(headers)
    .queryParam("oauth_consumer_key", consumerKey)
    .queryParam("oauth_signature_method", signatureMethod)
    .queryParam("oauth_nonce",  "${nonce}")
    .queryParam("oauth_timestamp", "${ts}")
    .queryParam("oauth_version", "1.0")
    .queryParam("oauth_signature", "${signature}")
~~~

This looks straightforward, assuming I have a separate OAuth class that is doing the generation of the parameter values.
The scenario can then be invoked by the code below.

~~~ scala
setUp(scn.inject(atOnceUsers(1)).protocols(http))
~~~

I am starting with one concurrent request. And it works. Now if I change the 1 in this call to anything more than 1, only the first test passes, all the others fail. Guess why.

Because I am doing an OAuth call and it requires a nonce, all the API requests after the first one gets a ‘Duplicate nonce found’ error. I need to load up ideally 100 concurrent requests but I want different parameters in each one of those 100 requests.

Turns out Gatling has this amazing feature called feeder that you can populate from a CSV or an in-memory array and a few other iterator options. I am defining a feeder as below.

~~~ scala
val feeder = Iterator.continually {
  val n = oAuth1.getNonce
  val ts = oAuth1.getTimestamp

  val oauthParams = Map(
    "oauth_consumer_key"-> consumerKey,
    "oauth_signature_method"-> signatureMethod,
    "oauth_nonce" -> n,
    "oauth_timestamp" -> ts,
    "oauth_version"-> "1.0")

  val signature = oAuth1.generateSignature(
    "POST",
    url,
    oauthParams.asJava,
    consumerSecret
  )

  Map (
    "nonce" -> n,
    "ts" -> ts,
    "signature" -> signature
  )
}
~~~

And then put it in the ScenarioBuilder definition. For each of the concurrent users, it reads the next record from the feeder.

~~~ scala
// A scenario is a chain of requests and pauses
val scn: ScenarioBuilder = scenario("Scenario Name")
  .feed(feeder)
  .exec(
  http("request_1")
    .post(url)
    .headers(headers)
….
~~~

And now it works!

##Getting to grips with OAuth 1.0 (or the Alteryx version of it)

I found it bewildering that OAuth is such a widely-used protocol but it was hard to find a library that actually works for my use case. Gatling has its own OAuthSignatureCalculator but that puts the signature in the request header and as crazy as it sounds, there is no way to move that signature from header to query string. I tried a few different things and ended up using the bouncycastle library from maven. In my OAuth1 class, I have methods for generating Nonce and Timestamp which are pretty standard.

<div></div>

~~~ scala
public String getNonce()
{
    return RandomStringUtils.randomNumeric(9);
}

public String getTimestamp()
{
    return Long.toString((System.currentTimeMillis() / 1000));
}
~~~

The below method generates the precious signature.

~~~ scala
public String generateSignature(
        String httpMethod,
        String stringUrl,
        Map<String, String> oauthParams,
        String secret
) throws UnsupportedEncodingException, MalformedURLException
{
    // Ensure the HTTP Method is upper-cased
    httpMethod = httpMethod.toUpperCase();

    // Construct the URL-encoded OAuth parameter portion of the signature base string
    String encodedParams = normalizeParams(oauthParams);

    // URL-encode the relative URL
    String encodedUri = URLEncoder.encode(stringUrl, "UTF-8");

    // Build the signature base string to be signed with the Consumer Secret
    String baseString = String.format("%s&%s&%s", httpMethod, encodedUri, encodedParams);

    return generateHmac(secret+ "&", baseString);
}
~~~

Trust me. This was hard to get right. I had to read the [OAuthBible](http://oauthbible.com/). Upper case, normalization, URL encoding and base string creation is standard and same across libraries (although the one I was following at first was only encoding the domain address and not the whole URL), but when you put in the secret, append an ampersand to it. This is required as when you are generating the signature you send a combination of API secret and user secret. I only have a API secret. I don’t have any user secret which is fine. But you still need the ampersand that sits between the two.

Phew!

I am not going to bore you with the details of normalizeParams() or generateHmac(). The project is available [here](https://github.com/ZinatWali/Alteryx-API-Client).

Bottom line: If I need to load test another API, I will use Gatling. In hindsight, I could probably try importing my Java code as a jar in JMeter. I would probably try doing that if I am already hugely invested in JMeter. But the amount of documentation and developer support is much better in Gatling.
