---
author: hpowell
title: A first foray into functional programming with Scala and Clojure
title-short: Scala vs. Clojure
layout: default_post
summary: "Having recently dipped my toe into the world of functional programming with both Scala and Clojure I thought it'd be useful to do a quick compare and contrast of these two JVM based languages."
summary-short: Comparing and contrasting these JVM based languages
image: hpowell/assets/featured/functional.jpg
oldlink: "http://www.scottlogic.com/blog/2014/10/28/Scala-Vs-Clojure.html"
disqus-id: /2014/10/28/Scala-Vs-Clojure.html
categories:
  - Tech
---


Having recently dipped my toe into the world of functional programming with both Scala and Clojure I thought it'd be useful to do a quick compare and contrast of these two JVM based languages.  Firstly I'll define what a functional programming language is and then move on to discuss the major similarities and differences between Scala and Clojure.

## And so it begins ##

![Missing jigsaw piece]({{ site.baseurl }}/hpowell/assets/MissingPiece.jpg)

Having spent more man hours than I care to think about debugging multi-threaded programs that shared state I started looking for ways to reduce these problems and get back to developing code rather than debugging it.  I quickly discovered Clojure and was intrigued by its purported elegance and simplicity and have been dabbling in it for the last 6 months or so.  I've also recently joined a MOOC, along with some of the other developers in the Edinburgh office, on functional programming in Scala.  Now that I'm half way through the course I thought I'd do a quick compare and contrast of the major similarities and differences I've found between the languages.

## Just what is functional programming exactly? ##
To start with I'm going to define a functional programming language simply as one that has first class functions.  So, "What are first class functions?" I hear you say.  [Wikipedia](http://en.wikipedia.org/wiki/First-class_function) describes them as follows as "... a programming language is said to have first-class functions if it treats functions as first-class citizens. Specifically, this means the language supports passing functions as arguments to other functions, returning them as the values from other functions, and assigning them to variables or storing them in data structures.".  As well as the languages most of us would recognise as functional (ML, Haskell, Scala, Clojure, etc.) this would also allow C and C++ to be included but not Java or C#.

## Some things are the same... ##

![Four yachts in a line]({{ site.baseurl }}/hpowell/assets/Yacht.jpg)

Firstly I'm going to take a look at what I've found to be the most important similarities between the two languages.  The first two points apply to (almost?) all modern functional programming languages with the final one not being just limited to Scala and Clojure.

### Immutable Collections ###
Not only do both Scala and Clojure have immutable collections, but they are used by default.  "But won't immutable collections lead to an explosion in required memory resources?" I hear you say.  Only if naively implemented and both projects appear to have taken great care in how they've gone about implementing their implementation of them.  A comparison to this thought is often made to the charges levelled at garbage collection when that was first introduced to the world.  Immutable collections aren't a panacea, they do take more resources and are slower to interact with than their mutable cousins, but the ability to more easily reason about them is a trade off I've often found myself willing to make. 

### The REPL ###
Both languages come with a Read-Eval-Print-Loop.  This allows the user to enter commands and have them evaluated immediately.  The quick feedback allows you to experiment with the syntax of the language and newly discovered libraries very efficiently.  To be honest, if you write Java, even if you have no interest in learning a functional language, it's probably worth your while learning how the interop works just so you can use the REPL (although [by the looks of things](http://www.javaworld.com/article/2601433/java-language/programmers-could-get-repl-in-official-java.html) you'll be getting one soon anyway).

### Java and the JVM ###
Java has been around for the best part of 20 years, in which time it has become one of the most popular languages in use today.  With the JVM becoming increasingly speedy and efficient and continuously being deployed to new devices both projects decided this would be an excellent platform on which to run their new languages.  Running on top of the JVM also gives both languages full access to the huge array of standard and third party libraries that would be available to any regular Java program, so no need to reimplement all those web frameworks and http stacks we all rely on.  Programs written in both languages can, with a little work, also be exposed to any regular Java program.

## ... some not so much ##

![Geese, one looking backwards]({{ site.baseurl }}/hpowell/assets/Geese.jpg)

Now that we've seen some of the similarities between the languages lets take a look at what distinguishes them from each other.

### Static vs dynamic typing ###
Scala is statically typed whereas Clojure is typed dynamically (although Clojure does have library, core.typed, that allows users to add typing information to their Clojure code).  Neither brings anything revolutionary to their respective type system so we're back to the flame wars on this particular issue.

### Classes vs data structures ###
Scala builds on Java's class based infrastructure retaining the "everything is an object" philosophy, which includes functions themselves.  So, a function defined as[1](http://www.scala-lang.org/old/node/133)

    (x: Int) => x + 1

is simply syntactic sugar for the anonymous class

    new Function1[Int, Int] {
      def apply(x: Int): Int = x + 1
    }

While Scala allows the definition of functions anonymously and as part of class declarations it doesn't allow free floating function definitions.

Clojure takes a different approach by starting you out with lists, vectors, maps and sets and a multitude of functions to act on them.  Only later are you introduced to records, which are analogous to and underpinned by Java's classes.  The idea appears to be that they should be used only when some aspect of the map collection is found to be deficient.

### Extension vs Reinvention ###
Scala appears to have taken a look at Java and asked itself "How can I add to this?".  This has lead to a very wide and powerful syntax.  For example, here are 4 ways to call toString on a list:

    List(1,2,3) toString
    List(1,2,3) toString()
    List(1,2,3).toString
    List(1,2,3).toString()

This allows the natural implementation of a wide array of domain specific languages without having to write the associated parsing code.  With all this power though comes responsibility and developers are left with the decision as to how large a subset of Scala they wish to use in any one project.

Conversely Clojure wears its Lisp heritage on its sleeve (so be prepared to break out your parenthesis keys if you've never experienced a Lisp like language before).  It's project leaders appear to have taken the view that they'd create the language they always wanted and then cast about for something to run it on.  This has lead to several different implementations including one that runs on the MicroSoft CLR and one that is compiled down to JavaScript.  The syntax is somewhat narrower than Scala's with a focus on the one correct way rather than umpteen different ways to do the same thing.  To implement DSLs in Clojure usually requires the use of macros which can also be immensely powerful, but requires great care to be used correctly.

### Generalisation vs Simplification ###
This sort of leads on from the point above.  With Scala's seeming extension of Java it tends to lead towards powerful generalisations.  Infix operator precedence, for example, has been extended from its mathematical stance in Java to include any infix operator.  The precedence of a custom infix operator is defined by its first character according to the following[2](http://www.scala-lang.org/docu/files/ScalaReference.pdf):

    (all letters)
    |
    ^
    &
    < >
    = !
    :
    + -
    *
    / %
    (all other special characters)

Again, very powerful stuff, but I'm not sure I want to pull that table out every time I have to decipher how a newly defined operator plays with the rest of the world.

Clojure, on the other hand, just does away with infix operators.  No infix operators means no infix operator precedence.

## And with that ... ##
So far as I've learned both languages seem to be perfectly competent functional languages and offer many of the benefits of such languages.  The biggest difference appears to be in the philosophy behind each of them, wide and generalised in the case of Scala and simple and easy[3](http://www.infoq.com/presentations/Simple-Made-Easy) for Clojure.  Having spent much of my career wading through feature laden C++ code I find myself more drawn towards the simple and easy approach offered by Clojure.  Once I've finished the second half of the Scala course hopefully I'll come back and see if the above still holds true.

[\[1\] http://www.scala-lang.org/old/node/133](http://www.scala-lang.org/old/node/133)

[\[2\] http://www.scala-lang.org/docu/files/ScalaReference.pdf (section 6.12.3)](http://www.scala-lang.org/docu/files/ScalaReference.pdf)

[\[3\] http://www.infoq.com/presentations/Simple-Made-Easy](http://www.infoq.com/presentations/Simple-Made-Easy)























