---
title: Produce data for test and development systems quickly and reliably
date: 2020-08-06 00:00:00 Z
categories:
- Open Source
author: slaing
layout: default_post
summary: Data for development and test systems is essential for testing, feature design and development. This post explores the options and presents the Data Helix tool, that provides an effective means of producing data.
---

Nearly every piece of software needs data to run. Nearly all systems need some form of personal data, even if it is your email address (to login) and a name to make it all a bit more personal.

You'll have this data secured away in production, but you're not supposed to use it in development. It's people's [personal identifiable information](https://en.m.wikipedia.org/wiki/Personal_data) and you don't want to inur the wrath of the [ICO](https://ico.org.uk/) if you're in breach of [GDPR](https://en.m.wikipedia.org/wiki/General_Data_Protection_Regulation). Nope, sensitive production data stays in production, period.

It's easy to relate to personal data as its sensitive, but the same restrictions surround commercially and legally sensitive data to mention just a few. What if you want to stress test a system with excessive quantities of data, or where the data simply doesn't exist yet (e.g. for a new system or for a new feature). You'll need to produce - through some means - fake data. Whatever you do it'll cost, in time and/or money, but it doesn't have to...

Let's take stock for a moment, **what do you actually need**?

1. The means to create as much data as required. Maybe less or more than in production, but an amount nevertheless
2. The means to create data that will fit into your database, so it needs to match your database schema
3. The means to create realistic data, so it needs to meet your business rules, and 'look right'

There may be other nuances of what you require, but generally these are the things you need. By 'look right' I mean, a name in the name column, not just jibberish. And business rules, mean things like the dispatch date is always after the purchase date.

There happens to be a product that allows you to achieve all of the above points. It's an open source product so completely free, and will be - forever.

The product is [Data Helix](https://finos.github.io/datahelix), it's an open source Java project supported by the [FINOS foundation](https://finos.org). [Data Helix](https://finos.github.io/datahelix) is designed to solve these problems, that so many of our clients also have on a regular basis.

<div style="background-color: #7462e0; padding: 100px;">
  <img src="https://finos.github.io/datahelix/logo-white.svg">
</div><br />

You can:

- define your database schema ✔
- define your relationships between fields ✔
- specify how much data you want ✔
- output data into a database ✔

And there are lots of other features in the pipeline. You can see them all here, and suggest more if you'd like.

[Data Helix](https://finos.github.io/datahelix) is a suite of tools that has the data profile at its core. This is a file that allows you to describe the data you need. That is all of those points above.

For example:

~~~~
{
  "fields": [ 
    { "name": "order_reference", "type": "string" },
    { "name": "order_date", "type": "datetime" },
    { "name": "dispatch_date", "type": "datetime", "nullable": true }
  ],
  "constraints": [
    { 
      "field": "dispatch_date", "equalToField": "order_date", 
      "offset": 3, "offsetUnit": "days" 
    },
    { "field": "order_reference", "matchingRegex": "[A-Z0-9]{5}" },
    { "field": "order_date", "afterOrAt": "2010-01-01T00:00:00.000" },
    { "field": "order_date", "afterOrAt": "2010-01-01T00:00:00.000" },
    { "field": "order_date", "beforeOrAt": "2020-06-01T00:00:00.000" },
    { "field": "order_date", "beforeOrAt": "2020-06-01T00:00:00.000" } 
  ]
}
~~~~

If you want to see it working, try it out in [the online playground](https://finos.github.io/datahelix/playground/#ewogICJmaWVsZHMiOiBbIAogICAgeyAibmFtZSI6ICJvcmRlcl9yZWZlcmVuY2UiLCAidHlwZSI6ICJzdHJpbmciIH0sCiAgICB7ICJuYW1lIjogIm9yZGVyX2RhdGUiLCAidHlwZSI6ICJkYXRldGltZSIgfSwKICAgIHsgIm5hbWUiOiAiZGlzcGF0Y2hfZGF0ZSIsICJ0eXBlIjogImRhdGV0aW1lIiwgIm51bGxhYmxlIjogdHJ1ZSB9CiAgXSwKICAiY29uc3RyYWludHMiOiBbCiAgICB7IAogICAgICAiZmllbGQiOiAiZGlzcGF0Y2hfZGF0ZSIsICJlcXVhbFRvRmllbGQiOiAib3JkZXJfZGF0ZSIsIAogICAgICAib2Zmc2V0IjogMywgIm9mZnNldFVuaXQiOiAiZGF5cyIgCiAgICB9LAogICAgeyAiZmllbGQiOiAib3JkZXJfcmVmZXJlbmNlIiwgIm1hdGNoaW5nUmVnZXgiOiAiW0EtWjAtOV17NX0iIH0sCiAgICB7ICJmaWVsZCI6ICJvcmRlcl9kYXRlIiwgImFmdGVyT3JBdCI6ICIyMDEwLTAxLTAxVDAwOjAwOjAwLjAwMCIgfSwKICAgIHsgImZpZWxkIjogIm9yZGVyX2RhdGUiLCAiYWZ0ZXJPckF0IjogIjIwMTAtMDEtMDFUMDA6MDA6MDAuMDAwIiB9LAogICAgeyAiZmllbGQiOiAib3JkZXJfZGF0ZSIsICJiZWZvcmVPckF0IjogIjIwMjAtMDYtMDFUMDA6MDA6MDAuMDAwIiB9LAogICAgeyAiZmllbGQiOiAib3JkZXJfZGF0ZSIsICJiZWZvcmVPckF0IjogIjIwMjAtMDYtMDFUMDA6MDA6MDAuMDAwIiB9IAogIF0KfQ%3D%3D).

Take a look at the [Data Helix website](https://finos.github.io/datahelix) or the samples in [the online playground](https://finos.github.io/datahelix/playground) or take a look at [the documentation](https://github.com/finos/datahelix/blob/master/README.md).
