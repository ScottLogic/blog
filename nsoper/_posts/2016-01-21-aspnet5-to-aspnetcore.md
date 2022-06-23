---
author: nsoper
title: ASP.NET 5 to ASP.NET Core 1.0
layout: default_post
summary: >-
  Literally a couple of hours after we released the previous post on writing a
  RESTful API with ASP.NET 5, I learned that Microsoft have renamed the new
  platform. This is a very short summary of that decision.
categories:
  - Tech
---

Earlier today I released a post called [Building a RESTful API with ASP.NET 5]({{site.baseurl}}/2016/01/20/restful-api-with-aspnet50.html).

A couple of hours later I was watching the [latest community stand up](https://www.youtube.com/watch?v=FSf83_TU5Yg&feature=em-lbcastemail-np) from the ASP.NET team and they dropped the bombshell that they are renaming the new platform to **ASP.NET Core 1.0**.

I always found this version numbering odd, and I alluded to the fact [in my previous post]({{site.baseurl}}/2016/01/20/restful-api-with-aspnet50.html#version5-of-1). Scott Hanselman has [recently described the reasons](http://www.hanselman.com/blog/ASPNET5IsDeadIntroducingASPNETCore10AndNETCore10.aspx) for the name change, but I thought I'd attempt a brief summary.

The **1.0** part of the new name is a much better reflection of the fact that they have completely re-written the platform - it's much more than just a major release.

The inclusion of **Core** in the name reflects the fact that the new ASP.NET is far more modular and can run on the new *.NET Core 1.0* framework as well as the 'old' **.NET Framework 4.6*.

### What about MVC 6?

Throughout my previous post I referred a great deal to MVC 6. In the new world we are not going to be referring to MVC 6, instead the amalgamation of MVC 5 and Web API 2 will just be **ASP.NET Core MVC**, and the package version will start at 1.0.0. I think it seems very sensible to drop the 6 because it's not a version up from MVC 5 - it's a complete rewrite.

### Namespaces

According to the community stand up, this name change will introduce a new **Microsoft.AspNetCore.Mvc** namespace. NuGet packages will also be named using this convention - all starting from v1.0.0.

### Summary

So top marks to Microsoft for engaging with the community both to gather feedback from the community and communicate the name change via regular, interactive video updates.

To hear about the name change directly from [@DamianEdwards](https://twitter.com/DamianEdwards) (the ASP.NET lead), I highly recommend watching [latest community stand up](https://www.youtube.com/watch?v=FSf83_TU5Yg&feature=em-lbcastemail-np) (the name change is discussed from 5:50 to 18:00).

Oh, and if you want to tweet about ASP.NET Core 1.0 then there is even a recommended hashtag: [#aspnetcore](https://twitter.com/search?q=%23aspnetcore&src=typd)
