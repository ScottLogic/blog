---
title: Learning Resources for Rust
date: 2021-11-05 00:00:00 Z
categories:
- jstrachan
- Tech
tags:
- Rust,
- learning
author: jstrachan
layout: default_post
summary: Have you ever wanted to learn Rust or just simply know why everyone is so
  hyped about it? Well, I’ve put together a pile of links to interesting resources
  to get you started!
---

Whilst it's no longer the [newcomer on the scene](https://ziglang.org/), [Rust](https://www.rust-lang.org/) continues to be [very popular with developers](https://insights.stackoverflow.com/survey/2020#most-loved-dreaded-and-wanted) and [generate headlines](https://rome.tools/blog/2021/09/21/rome-will-be-rewritten-in-rust). If you have ever wanted to learn the language, or just find out what all the hype is about, this post is for you. I'll run through a variety of links to interesting resources to get you started.

### What is Rust
A very good intro to what Rust is, why people want to use it and why your company should use it, is Jon Gjengset’s talk "Considering Rust".
<iframe width="560" height="315" src="https://www.youtube.com/embed/DnT-LUQgc7s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
It gives a very good overview of the history of Rust, it's features and and why you would want to use it today!

### Beginner Rust Resources

Of course any “Intro to Rust” will include a mention of the book. A free to look at and download, in-depth intro to Rust. Most people start their Rust journey with the [online Rust book](https://doc.rust-lang.org/book/) because it's the most up to date.

The Rust book also has physical copies for each “edition” [2021](https://nostarch.com/rust-rustaceans) (not yet released), [2018](https://nostarch.com/Rust2018) and “vintage”. [Editions](https://doc.rust-lang.org/edition-guide/editions/index.html) are Rust's way of releasing features that are backwards incompatible. Therefore the latest edition is the one to go for if you have the choice, but any of the books will be able to give you a solid foundation in the language.

After, or while, reading the book I'd encourage you to explore the resources available at [The Rust Learning Page](https://www.rust-lang.org/learn). It covers multiple different books for learning Rust or learning particular ways of using Rust. The [Rust by Example](https://doc.rust-lang.org/stable/rust-by-example/) or the [Rustlings](https://github.com/rust-lang/rustlings/) course is a great supplement to the Book.

If you already have a particular idea for a project, these books might be of interest:

* [Command-Line Applications](https://rust-cli.github.io/book/index.html) - I've made a fair few of these and it's really helped me to learn Rust.

* [Rust Webassembly Book](https://rustwasm.github.io/docs/book/) - I'd also recommend the [WASM in 2021](https://blog.scottlogic.com/2021/06/21/state-of-wasm.html) and [Build your own Web assembly compiler](https://blog.scottlogic.com/2019/05/17/webassembly-compiler.html) posts on this blog.

If [cheatsheets](https://cheats.rs/) are more your thing. This one has sections on how to write idiomatic rust but you might be better served in that particular area by the next link.

Finally, here's a GitHub repo that is all about [Idiomatic Rust](https://github.com/mre/idiomatic-rust). I would heavily recommend exploring the resources that they link to, as some of them can be deep dives into particular topics or cookbooks for certain tasks.


### Further learning:

Once you have wrapped your head around the basics, here's another set of interesting links to push your learning a bit further.
Jon Gjengset (the speaker in the video above) is writing an early access book for [intermediate rustaceans](https://nostarch.com/rust-rustaceans) for when you have a grip on the language and want to do more.

Rust lifetimes can be a confusing topic, this article covers some of the [common misconceptions](https://github.com/pretzelhammer/rust-blog/blob/master/posts/common-rust-lifetime-misconceptions.md).

Along similar lines, this article on [Rust Ownership the Hard Way](https://chrismorgan.info/blog/rust-ownership-the-hard-way/) explains the underlying theory.

Strings in Rust can be initially confusing but this article about [working with strings in Rust](https://fasterthanli.me/articles/working-with-strings-in-rust) explains how strings in other languages are handled and why Rust handles them this particular way. An interesting read on the history of this data representation and how tricky language is to deal with in programming. Their other articles are well worth a read as well.

[Matklad](https://matklad.github.io/) the person behind [Rust analyzer](https://rust-analyzer.github.io/) (the IDE tool that helps with writing rust) writes great articles about Rust. Including ones on how [Rust Analyzer works](https://rust-analyzer.github.io/blog/2020/07/20/three-architectures-for-responsive-ide.html) and articles on how to [speed up compilation speed](https://matklad.github.io/2021/09/04/fast-rust-builds.html).

To understand more about error handling, you'll want to read more about the Result type. The [rust-by-example](https://doc.rust-lang.org/rust-by-example/error.html) book helps with this. For more in-depth info on how to do it in bigger projects, this [blog post for the error handling project](https://blog.rust-lang.org/inside-rust/2021/07/01/What-the-error-handling-project-group-is-working-towards.html) and this [blog post about anyhow and thiserror](https://nick.groenen.me/posts/rust-error-handling/) can help. Or you can dive into these popular libraries [snafu](https://github.com/shepmaster/snafu) and [anyhow](https://github.com/dtolnay/anyhow).

The [Rust Patterns Book](https://rust-unofficial.github.io/patterns/) isn't being currently updated but it has lots of info about coding patterns in Rust and is a useful repository of info.

### Industry Readiness of Rust

A lot of folks ask if Rust is ready for certain projects or if it’s going to lose its steam and peter out. Luckily the Rust community provides websites showing how mature technology stacks are for certain tasks and companies showing how they are using Rust in production.

The series of websites Are We There Yet? details Rust’s ecosystem around certain key areas that can be worth checking out if you have a particular project in mind.
There is a [Mozilla Wiki Areweyet](https://wiki.mozilla.org/Areweyet) list detailing all the different websites with a similar list at [UgurcanAkkok's Are We Rust Yet](https://github.com/UgurcanAkkok/AreWeRustYet).

In particular interest to what we do at Scott Logic: 

* [Are We IDE yet](https://areweideyet.com/)
which is about the state of IDE’s for rust. Personally speaking, VS Code with the Rust Analyzer plugin is good.

* [Are We Web Yet](https://www.arewewebyet.org/)
Describes the state of readiness in building web backend apis and frontend applications. The website has lots of good resources for building web backends and frontends in Rust.

Reports and stories about Rust in production are detailed by the [Rust Production Users](https://www.rust-lang.org/production/users). Companies using Rust show and tell what worked for them and how Rust helped them!

### Staying up to date
Once you're up and developing with Rust, here's a few pointers for staying up to date with the latest from the community.

I would recommend the weekly newsletter, [This Week In Rust](https://this-week-in-rust.org/), it has a good pick of interesting articles every week.

The [Rust Forum](https://users.rust-lang.org/) is a place to ask questions to the rest of the Rust community.

The [Rust Youtube Channel](https://www.youtube.com/channel/UCaYhcUwRBNscFNUKTjgPFiA) is a very good resource with videos from lots of conferences which can provide lots of interesting lunchtime breaks.

### Best of luck

I hope you enjoy learning Rust and getting engaged with the community! I started hearing about Rust after looking into Webassembly and have fallen in love with the language and community. It's an exciting language that I've found teaches me a lot about programming and how languages work under the hood. I also appreciate that it allows me to write programs that don't have garbage collection without being afraid! 