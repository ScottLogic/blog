---
published: true
author: tclarke-scottlogic
title: Why Java Developers Should Learn C++
layout: default_post
categories:
  - Tech
summary: >-
  Why Java Developers can gain from C++, what C++ can gain from Java Developers, and how the language has made itself more comfortable for you to make the transition.
---

~~~C++
	#include <string>
	#include <iostream>

	using namespace std;
	
	int main() {
		string name;
		cout << "Type in your name\n";
		cin >> name;
		cout << "Hello " << name << "\n";
	}
~~~

[Feel free to run it](https://onlinegdb.com/G_6CeufMM).

For a Scott Logic employee, my background is a little unconventional. I came out of a predominantly "[Java School](https://www.joelonsoftware.com/2005/12/29/the-perils-of-javaschools-2/)" education in the heady days of 2007, but like many of my peers, was happy to take any job that would begin a career in software development, in [less than ideal circumstances](https://en.wikipedia.org/wiki/Financial_crisis_of_2007%E2%80%932008).

That led me to a number of companies that were hiring for C++ developers, and a decade of semicolons, asterisks and ampersands later, I have a fairly solid foundation of professional C++ experience.

Recently, I suggested writing an "Intro to C++ for non-C++ developers" entry for the SL blog, and while everyone at Scott Logic is always supportive, especially when it leads to more content for the blog, the one question I got back more than any other was "why?".

So I guess that's the first question for me to answer.

## Why Java Developers Should Learn C++

Obviously, someone who's gainfully employed as a professional Java Developer doesn't *need* C++. They may need to be weaned off an [addiction to the word "Get"](https://twitter.com/KevlinHenney/status/278165612830810112), but it's [not like Java is going anywhere](https://jaxenter.com/java-slippery-slope-downward-trend-133843.html).

But if a Java developer was looking to learn a new language ([which I heartily recommend](https://blog.teamtreehouse.com/learn-another-programming-language)), C++ is the one I would recommend, for several reasons.

Let's start with the most famous.

### Performance

I remember in my first interview for a C++ company, I was asked why I thought that company used C++ for their real-time software. I wasn't 100% sure, but I knew it was something to do with performance. So I threw out my guess and then asked if they could explain it to me<a name="footnote1source"></a><sup>[[1]](#footnote1)</sup>.

The key was not so much that C++ was "faster", because it is possible to write inefficient code in any language<a name="footnote2source"></a><sup>[[2]](#footnote2)</sup>.

The actual reason was because when working with real-time software, garbage collection is a complete pain in the CPU. The whole point of the garbage collector is that it will wait until it thinks you will notice least and then do a bunch of relatively grindy memory deallocations. Two related problems occur when working with real-time software; firstly, it's hard for the collector to find a gap when it can do this, and secondly, when it gives up and has to do it while you're trying to land your virtual aircraft *you really notice*.

If you don't want to have those effects on performance, you effectively have to write and/or maintain your own [situation-specific garbage collector](https://wiki.openjdk.java.net/display/shenandoah/Main), and in that case, why bother having one?

With C++, you have **better control** over your performance. Because there's no underlying runtime framework that you either have to accept or take control of between you and your device's operating system, you can be a lot more precise about your performance characteristics.

The same applies in the world of embedded software. The JVM is a miracle of modern technology. It is inarguably responsible for Java's *staggering* success as a program language. It is also, by the standards of embedded software, [a bit of a chunky beast](https://spring.io/blog/2019/03/11/memory-footprint-of-the-jvm). Work has been done to mitigate this with Embedded and Customisable JVM projects, but in a culture that instinctively doesn't like wasting memory, the impression is still of wasting memory that you don't have to.

But what if you're **not** dealing with software with these specific non-functional requirements? What if you're just writing CRUD applications all day? It may still be worth it just to learn how Java works "under the hood"?

### Experience

>Many Developers write programs without understanding how the programs are executed. They program in Java and they write nice and working code, but they have no idea how the underlying technology works. They have no idea about the class loaders, garbage collections. Or they do, but they do not know anything about the machine code that the JIT compiler generates. Or they even do that but they have no idea about the processor caches, different memory types, hardware architecture. Or they know that but have no knowledge about microelectronics and lithography and how the layout of the integrated circuits are, how the electrons move inside the semiconductor, how quantum mechanics determines the non-deterministic inner working of the computer.
> 
> - Peter Verhas, "[Lazy assignments in Java](https://javax0.wordpress.com/2019/05/15/lazy-assignment-in-java/)"

Every programming language, by its nature, conceals some of the workings of the underlying computer<a name="footnote3source"></a><sup>[[3]](#footnote3)</sup>. They abstract away some of the information that is confusing or rote, and thus make it clearer what the programmer intended rather than what the computer is actually doing. The problem with that is that [every abstraction is, to some extent, leaky](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/).

Developers in Java eventually have to encounter the stack and the heap and so forth, normally either in a textbook, or when they're dealing with performance issues. The major advantage of Java is that they get to avoid it until that moment. The major disadvantage is that when it comes, it hits like a freight train. With C++, you have more gradual exposure. The concept of memory management and its effects on performance is exposed more gradually, and as part of the overall language, rather as some work that's always been going on but has been concealed from you.

This also provides a healthy way to introduce yourself to some fundamental concepts that are key to learning C. There are Developers who were exposed to raw C in laboratory, had a horrific segmentation fault experience, and still use pointer the way some people use the term "switchblade".

C++ helps you to get used to the idea of memory as a form of managed resource allocation without sacrificing little things like type safety. You slowly get comfortable with the idea of smart pointers, and then raw pointers, then the heap, as things that you have control over. Then someone shows you "malloc/free" or "[placement new](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/performance-enhancements-7.html)" or the cool stuff you can do with C-arrays, and while you should still shudder and question why it's being used, you don't have a Lovecraftian experience over it.

It also makes new languages dealing in the same space, such as Rust, easier to learn. A lot of the concepts in Rust, such as mutability or lifetimes, directly correspond to an equivalent concept in C++. This means you can focus on the deeper design knowledge about how they differ, rather than having to focus on what they're doing.

And speaking of Rust...

### Maturity

>Personally, I'm thrilled that Ruby is now mature enough that the community no longer needs to bother with the pretense of being the coolest kid on the block. That means the rest of us who just like to Get Shit Done can roll up our sleeves and focus on the mission of building stuff with our peers rather than frantically running around trying to suss out the next shiny thing.
> 
> - Jeff Atwood, [Coding Horror](https://blog.codinghorror.com/why-ruby/)

> "There are only two kinds of programming languages: those people always bitch about and those nobody uses"
> 
> - Bjarne Stroustrup, C++

I am a semi-serious advocate of Stroustrup's hypothesis that a language isn't truly production ready until there is at least one cadre of developers who hate it<a name="footnote4source"></a><sup>[[4]](#footnote4)</sup>. Because if developers hate a language, that means they're either using it for something that they can't trivially discard, or that despite its flaws, they keep encountering it "in the wild".

This means that there's a subtle but critical guarantee baked into that language:

> With C++, you *know* that you can write large complicated programs that you can continue to maintain, *because multiple companies are based on having done that*.

[Lisp, not so much](https://redditblog.com/2005/12/05/on-lisp/).

[Rust, maybe someday](https://internals.rust-lang.org/t/rust-2019-address-the-big-problem/9109).

[C++, ](https://www.reddit.com/r/cpp/comments/5r4ecp/what_industries_use_c/)[you'd better ](https://www.quora.com/Which-software-giants-use-C++-as-their-main-technology)[believe it](https://www.google.com/search?q=c%2B%2B+jobs).

There is a joy to the [new and shiny tech stack](https://blog.codinghorror.com/the-magpie-developer/), and I would never try and dissuade someone from experimenting with new tech; if nothing else, that's how the old dull tech [acquires new features](https://www.infoworld.com/article/2607502/do-more-with-less--lambda-expressions-in-java-8.html). But when it comes to production code, I like to have confidence that I'm not constructing a trap for future developers. C++, like Java, C# and Python, comes with a relatively strong guarantee that the issues you will face during development will not be unexpected and that the language will have the tools to cope with them.

As a corollary, with millions of lines of C/C++ out there, I suspect that even if the "C++ => Rust Replacement Initiative" goes into effect, Rust's full adoption will be a few decades in the future. Which has an impact on how well you can translate your development experience into that most base and vile of resources:

### Jobs

> "People ask me why I'm playing in this picture. The answer is simple: Money, dear boy."
>
> -  Laurence Olivier

C++ has doggedly hung on to the top 5 of the [TIOBE index](https://www.tiobe.com/tiobe-index/) for at least the last 2 decades. Not only does this confirm that there are aspects of C++ that have not been superceded by modern languages, it also implies that there is enough code out there that needs maintaining and supporting to provide a living for any developer who wants to feed his cat/family/self.

**This is an entirely legitimate reason to learn a language**. Programming languages are tools to help developers support user and/or business needs more effectively. If your step 1 in coming to a business is to say "you'd be better off rewriting your code in a modern language", then you're not doing either of those things.<a name="footnote5source"></a><sup>[[5]](#footnote5)</sup>

Knowing how to develop in different languages enhances your value to a company, it can gain you access to certain roles that would otherwise be unavailable, and it gives you leverage when applying for new roles, because your field of available options is wider.

Of course, that means that you're now competing with more established C++ devs, but they should be welcoming your interest in the language:

## Why C++ Should Welcome Java Developers

As a graduate mostly taught in Java going into a C++ development environment, I was very clear that I was going to need some support to ensure I was writing the best possible code. My first company eventually got around to it (if only after I had been programming C++ systems for over a year) and I still have the folder of the course I attended.

What's interesting is that a solid chunk of that course was spent teaching Embedded C developers concepts I already knew from Java.

Classes. Inheritance. Exceptions. Patterns. Threads.

While a big boost to my confidence, it showed me something interesting about the C++ ecosystem.

### Java Developers are more likely to program in C++ than C

C is an interesting and powerful language that has been in a fight for the top of the TIOBE index for years. The ability to seamlessly integrate with existing C code is one of the reasons C++ was originally so successful, and continues to be one of the most important development languages in the world.

**[But C++ is not C](https://www.youtube.com/watch?v=YnWhqhNdYyk)**.

> There's a strong temptation to teach the way you learned. So step 1, teach them C, step 2, teach them \[the thing you were actually intending them to teach them\].
>
> \[But if you're starting with C\], you're teaching them *bad* C++.
>
> [It] makes C++ seem harder than it really is[ and] doesn't encourage good modern C++ code from beginners
> 
> - Kate Gregory, ["Stop Teaching C"](https://www.youtube.com/watch?v=YnWhqhNdYyk)

However, because you *can* write C code in C++ and it will compile and function correctly, it is very easy for C developers to pull in the few tools they see as immediately useful, and ignore a lot of the more powerful tools that are a bit "too C++-y".

Whereas Java Developers are more likely to the value of those tools.

### Java Developers "get" structure

One of the things I've noticed *as a trend*, is that the Java community encourages design and architectural patterns more than you commonly find C++. I think a part of this comes from the work that Java is used for, and a part of it from the language's use of frameworks, but what it means is that they are used to thinking in terms of architectures rather than processor cycles.

The larger the C++ project, the more that ability to consider how larger systems should be structured matters, and the less optimisation of individual functions counts. 

In many ways, C++ is a language *designed* to solve the same problems as Java, but in a very different way. It gives you the tools you need to structure large software projects and to encapsulate away some of the routine work that you care less about. And those tools have become far more sophisticated over the last 10 years.

Given these newer tools are available, it makes sense to introduce them to a development community that will immediately understand their value, and they'll probably enjoy it more than when they encountered the language in 2004.

### Innovation comes from cultural overlap

I've heard it said that programmers who come from, for example, C++ to Java tend to write bad Java code in an attempt to keep writing C++.

I don't actually think that's completely true. 

What is true, from my experience, is that you initially rely on the tools that almost all languages share. You'll lean on for-loops over streams, rolling your own REST framework over using the power of Spring, focusing on the more basic tools that you understand.

Then you start to learn some of the more powerful tools available. Some of them you'll choose to use, some of them you won't. But you should be starting to write code that better represents the idioms of your current language.

But at some point, you miss something from a previous language. Maybe it's the ability to [tie the lifetime of a resource to the scope-time of an object](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html). But you'll want that technique in the language you're now using. At that point, developers start thinking how to improve their own toolset by [programming a technique into the language](https://medium.com/@scottradcliff/programming-into-a-language-and-outside-of-the-box-8c8407a1699d). And if it's successful or useful enough, eventually the language adopts it.

Most of the major programming languages have some advance that is [clearly copied from another language](https://www.foreach.be/blog/java-and-net-comparing-streams-linq). The more overlap you have between programmers of those languages, the more chance that someone will program a technique back into the language that they find really useful. And that's how languages innovate and evolve.

----

So, there are some good reasons for Java developers to try to learn Modern C++ and for the C++ community to welcome that. But then why did I get an initial pushback over it, in a way I don't think you would find for other languages like Rust or Python?

Are they just afraid of it?

## Getting comfortable with C++ 

I think most Java developers would rightly bristle at the idea they're "afraid" of C++. A better phrase might be that it's "not worth the frustration". The trade-off for having more control over resources like memory, is that you have to spend more time thinking about how you use that control.

Beyond that, C++ feels like an old and understood language, that Java developers "outgrew", whereas languages like Rust feel like they'll increase in relevance over time.

If you are interested in learning more about C++, here's some good initial guidelines.

### Aim for simplicity

I was fortunate enough to receive, fairly early on in my career, an excellent series of courses on introductory C++. Apart, it gave me a lot more confidence in how to approach the language, and which bits were important.

Not only has C++ improved since then, [the courses have also improved](https://www.youtube.com/watch?v=YnWhqhNdYyk).

Look at the code above. The only way it could be more simple is if cin and cout had better names. It might not be the most performant, but given its functionality, it's entirely performant for the task at hand.

Use the simpler tools available, because you can start fine tuning performance when it matters. [*Good* C++ should look "clean"](https://www.youtube.com/watch?v=P2lxGnbDkDI); in some ways cleaner than Java, because you don't need the boilerplate of a class structure for your main method or to de-null every declared object.

### Write as Modern C++ as you can justify

C++ has moved on a *lot* in the last decade. C++ devs are now [even discussing](https://www.modernescpp.com/index.php/no-new-new) whether `new` and `delete` can be deprecated to being "legacy practice" instead of part of the core of what you teach. So much of the boilerplate that has been traditional in C++ is being encapsulated into clean, manageable structures.

Learn them and use them. And then come back to the fiddly stuff once you're comfortable with the "new basics"

### Compilers Are Smart, Performance Is Measurable

Do not try to outwit the C++ compiler. Modern C++ compilers are *very* good at spotting common patterns and using the most performant solution for that pattern.

When you've detected an actual performance impact, *at that point* you can start reaching into C++'s infinite toolbox of performance enhancing code.

Note that there are thousands of developers who have very specific ideas about things that are simply inefficient in C++. Don't disagree with them. Don't argue with them. Get them to show you the effect under simple conditions in a modern compiler. At worst, someone in that scenario is going to learn something.

And remember, on the internet, you can always find a contrary opinion expressed more coherently and authoritatively than you can do so yourself.

### Find good sources of information

The problems with C++ is not finding reliable information for beginners, but filtering out the complexity.

For me, once you're past the basic tutorials, [Scott Meyers' books on C++ are really excellent](https://www.amazon.co.uk/Scott-Meyers/e/B004BBEYYW), as is anything put out by the [ACCU conference](https://www.youtube.com/channel/UCJhay24LTpO1s4bIZxuIqKw) or [CPPCon](https://www.youtube.com/channel/UCJhay24LTpO1s4bIZxuIqKw).

Don't be afraid to ask "why", even for questions that seem obvious. The [Stack Overflow C++ community](https://stackoverflow.com/questions/1642028/what-is-the-operator-in-c) is excellent, and really helpful, and if they haven't already answered a question, that means it's probably a good question.

Also, my next planned post is going to be on some of the best introductory functionality of C++, how it relates to equivalents in Java, and some advice about how to interact with it when learning C++. So hopefully that'll be helpful.

---

As I said at the start of this article, if you're happy working in Java, there's no reason not to keep learning Java in more depth. [There is a *lot* of depth](https://www.amazon.co.uk/Core-Java-II-Advanced-Features-11th/dp/0135166314/).

But if you're looking to learn another programming language, C++ rewards your attention.

> The more that you read, the more things you will know. The more that you learn, the more places you'll go.
>
> - Theodor "Dr." Seuss Geisel

----
----

<a name="footnote1">[1](#footnote1source)</a>: A valuable approach during any interview, because you learn information that will definitely be asked during other interviews and will be useful if you get the job, you (correctly) appear engaged and interested, and it uses up time that they could be using to quiz you further.

<a name="footnote2">[2](#footnote2source)</a>: Simply rely more heavily on disk/database storage when in-memory data is more reasonable, and you too can degrade your performance!

<a name="footnote3">[3](#footnote3source)</a>: Yes, [even assembly languages](https://en.wikipedia.org/wiki/MIPS_architecture#Pseudo_instructions).

<a name="footnote4">[4](#footnote4source)</a>: Admittedly, by this standard, C++ might be the most production ready language of all time

<a name="footnote5">[5](#footnote5source)</a>: Also, [you're probably wrong](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/)