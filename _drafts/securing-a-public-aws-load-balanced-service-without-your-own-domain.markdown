---
title: Securing a public AWS load-balanced service without your own domain
date: 2024-05-09 11:05:00 Z
tags:
- AWS
- load balancer
- api gateway
- spylogic
- cloudfront
- edge functions
summary: Meanderings on securing a load balancer without needing your own domain
author: cwilton
---

<img alt="the holy grail" src="/uploads/grail-shaped-beacon.jpg" title="Bad, bad Zoot!" style="display: block; margin: 0 auto" />

## The quest

I have recently been working on our company's prompt injection playground: an educational, now open-source application we named [SpyLogic](https://github.com/ScottLogic/prompt-injection). The UI is a standard React Single Page App, and the API is served using Express. I was tasked with deploying the application to AWS, and while the UI deployment uses the ubiquitous CloudFront / S3 pattern, the API layer required some thought.

![The three-headed giant of Arthurian legend](/uploads/three-headed-giant.jpg "He bravely turned his tail and fled!")

There are numerous ways to provision a public API in AWS, but utilising so-called [serverless architecture](https://en.wikipedia.org/wiki/Serverless_computing) for an API that exists solely to serve a UI makes a lot of sense - you write the application code, and let AWS manage compute capacity according to demand. Discarding the idea of managing my own [EC2 containers](https://aws.amazon.com/ec2/) leaves a choice of two serverless patterns: API Gateway-fronted [Lambda](https://aws.amazon.com/lambda/) functions, and a load balanced [Fargate](https://aws.amazon.com/fargate/) service running the application in a container.

Our API code had not been written with discrete function logic in mind, as the server persists a data cache across requests for the lifetime of a user session. While I could have switched to [ElastiCache](https://aws.amazon.com/elasticache/) storage for the cloud deployment, and put the entire backend in a lambda function, the path of least resistance was to use Fargate to spin up the API in a single container, initially with an in-memory cache. That would allow us to deploy the entire application relatively painlessly, and test its performance front-to-back. The eagle-eyed will have spotted that all-important phrase, "in-memory cache", which for persisting user data across requests implies either [sticky load balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/sticky-sessions.html) or a single container serving all requests. Again, the easiest approach was to use a single container to begin with, and worry about scalability / redundancy later.

![The Black Knight](/uploads/black-knight.jpg "None shall pass")

The final concern was security. I originally assumed - _spoiler alert!_ - that the load balancer would be public-facing, with authentication performed via the UI and authorization at the load balancer to verify an [OAuth](https://aaronparecki.com/oauth-2-simplified/) token in incoming requests. This was particularly important for us, because we would be using our own OpenAI API key to enable users to access ChatGPT models, so we wanted it all locked down to prevent malicious actors hammering our API and emptying our wallet. Of course, authorization means using https protocol, which in turn requires a valid domain and certificate. Which we didn't yet have.

![Sorcery required](/uploads/tim-the-enchanter.jpg "There are some who call me ... Tim")

At this stage we weren't even settled on the name "SpyLogic"; that would come later. I set to thinking on how I might magic together some AWS services to deploy the API securely, without needing to buy a domain until we were ready.

## Enter API Gateway

As luck would have it, [API Gateway in its bantamweight HTTP form](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) offers direct integration with Application Load Balancer. This gives me the free, secure https endpoint of my desires: I can configure it as a simple passthrough proxy, with authorization on incoming requests via a lambda function. Then when the time comes, I can just take it out and move authorization to the load balancer. Seems almost too easy ...

![Killer Rabbit of Caerbannog](/uploads/vicious-rabbit.jpg "Death awaits you all with nasty, big, pointy teeth")

## Proxy header troubles

After stumbling over a few CORS ditches, I eventually came across a deeper problem with our session cookie. For the uninitiated, if you have a proxy server terminating TLS in between client and destination, it will appear to the destination that the request is coming from an insecure origin: the proxy. Therefore it is standard practice for a proxy server to add request headers identifying the client IP / protocol and host of the incoming request. However, in typical fashion there are two ways to achieve this: the original ["de-facto standard" X-Forwarded headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) and the newer ["standard" Forwarded header](https:/developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) 🤨. In a predictable turn of events, even though the [Forwarded header is 10 years old this summer](https://www.rfc-editor.org/rfc/rfc7239), many proxy servers still use the original X-Forwarded headers.

![Crossing the Gorge of Eternal Peril](/uploads/bridge-of-death.jpg "Blue. No yel-- Aaaaargh")

It is possible to [configure Express to trust proxy servers](https://expressjs.com/en/guide/behind-proxies.html) en route. In our setup there are two proxies: API Gateway and Application Load Balancer. If you've been following me so far, you might be able to guess the problem... Yep, HTTP API Gateway uses the Forwarded header, while at the time of writing, Application Load Balancer uses X-Forwarded headers and ignores any existing Forwarded header. This means that our Express server receives both sets of headers in every request, so in theory it wouldn't know the order in which our proxies were encountered, and therefore which one to trust. In fact, at the time of writing [Express ignores the Forwarded header](https://github.com/expressjs/express/issues/5459) as well, so it doesn't even know that requests have passed through our secure API Gateway, instead believing they come from the insecure load balancer. As a result, Express will not include our [secure session cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#security) in responses, so the browser will be unable to preserve a user's session. In a conversational AI application this is a dealbreaker, as every request will begin a new chat, instead of building up a conversation over time.

> Me: In Monty Python and the Holy Grail, who is the first to be cast into the gorge of eternal peril?
> Bot: Sir Robin is the first to be cast into the Gorge of Eternal Peril.
> Me: What question was he unable to answer?
> Bot: I don't know. Aaaaaargh!

## Express wrangling

In response to my issue describing this [Forwarded vs X-Forwarded headers problem](https://github.com/expressjs/express/issues/5459), the lovely folks at Express pointed out there is a way to override request properties using the [Express extensions API](https://expressjs.com/en/guide/overriding-express-api.html). Visit the issue for more detail, but the summary is that I can intercept all requests and overwrite the "ip" and "protocol" properties with the values in the Forwarded header (if present), and ignore the X-Forwarded headers entirely. The end result is that our [Express Session middleware](https://www.npmjs.com/package/express-session) sees IP and protocol identifying the secure API Gateway, not the insecure load balancer, thus happily returns the Set-Cookie header to the client, and our user session is successfully established 🥂

If you want to see it in action, here's my [repo on GitHub with the final working solution](https://github.com/chriswilty/apigw-fargate-stacks), also including an attempt with Network Load Balancer that didn't work.

## A twist in the tale

![Keeper of the Grail](/uploads/french-taunter.jpg "I told them we already got one!")

This intermediate architecture is different enough to our ultimate solution that when it came time to remove gateway, there was an unpleasant surprise. It turns out you cannot add _authorization_ to an Application Load Balancer as you can with API Gateway; instead the load balancer will only allow initiating _authentication_ and provides no mechanism to verify an access token in incoming requests. For this reason, I decided to put a CloudFront proxy in front of the load balancer, with an [Edge Function](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html) to perform token verification. Because in theory you could hit the load balancer directly to bypass authorization, I also added a custom header to authorized requests in my edge function, and added [filtering at the load balancer](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html) to reject any request not coming through CloudFront. As a final security measure, you can also use a [CloudFront prefix list](https://docs.amazonaws.cn/en_us/AmazonCloudFront/latest/DeveloperGuide/LocationsOfEdgeServers.html#managed-prefix-list) at the load balancer to block requests not originating from CloudFront. But all that would be unnecessary if we could simply authorize requests at the load balancer.

## So was it all worth it?

I learned a whole lot about secure cookies, proxy headers, and how fickle different AWS services can be, so in terms of education it was worth some pain. But that pain cost time and money, so let me save you some of your own.

Domains can be really cheap - $3 a year cheap - so just buy one and architect it right first time! All you'll need to swap out when you have a permanent home for your application is the domain and certificates. At the time of writing, holyhandgrena.de is available for $9/year. Enjoy!

![Holy Hand Grenade of Antioch](/uploads/holy-hand-grenade-footer.png)