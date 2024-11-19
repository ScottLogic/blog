---
title: Reimplementing Scala assignments in Clojure
date: 2015-01-07 00:00:00 Z
categories:
- Tech
author: hpowell
title-short: Scala vs. Clojure part 2
layout: default_post
summary: Now that I've completed the Scala MOOC I thought I'd go back and re-implement
  the assignments in Clojure to get a better understanding of the differences between
  these two languages
summary-short: Reimplementing Scala assignments in Clojure
oldlink: http://www.scottlogic.com/blog/2015/01/07/Scala-Vs-Clojure-Pt2.html
disqus-id: "/2015/01/07/Scala-Vs-Clojure-Pt2.html"
---

## Introduction ##
Having completed the [Scala MOOC](https://class.coursera.org/progfun-005) [I started]({{ site.baseurl }}/2014/10/28/Scala-Vs-Clojure.html) I thought it would be interesting to go back and reimplement the assignments in Clojure and compare the results.  Obviously this isn't an entirely fair comparison, the assignments are presumably designed to help the student learn Scala and show off its best qualities which are unlikely to match up with Clojures.  Also, with my only Scala experience being this course I'm certain all of my answers won't be entirely efficient and idiomatic.  Similarly, the assignments were given in a very structured form with direct translations unlikely to lead to idiomatic Clojure code.  Where the resulting code wasn't particularly idiomatic I went back and tried to clean it up.  In this post I'll look at each of the assignments in turn, specifically how the answers I came up with differed and then draw conclusions from my experience.

## Recursive and Higher Order Functions ##
The first two assignments looked at recursive and higher order functions.  Pretty straightforward stuff for any functional language.  The only thing to mention is that because both languages run on the JVM there are issues with [tail call optimisation](http://www.drdobbs.com/jvm/tail-call-optimization-and-java/240167044).  Scala is able to implement tail call optimisation at compile time by turning the call into a loop if the recursive call is in the tail position (there's an annotation you can use to tell the complier where you expect a tail call and it'll warn you if it isn't). Clojure, on the other hand, has a form called "recur" which is used in place of the recursive call allowing the use of tail call optimisation.  The incorrect use of this form causes an exception.

## Data and Abstraction ##
![Data from Star Trek]({{ site.baseurl }}/hpowell/assets/Data.jpg)
[Big Data](https://www.flickr.com/photos/jdhancock/8031897271/in/photolist-834e93-7K6TWX-deKzer-7PMpXT-6UDnWP-gdMrKi-8Lsgfn-nX546-ax8z4B-9rnTdL-6GiYkV-i3Rby3-bf2wtK-gdMuhT-bf2wpa-i3NECz-5NfuQU-9uDrJR-7GaoYw-22CjS2) by [JD Hancock](https://www.flickr.com/photos/jdhancock/) is licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/legalcode)

The third assignment requires the creation of an immutable set of tweets using two data structures, a binary search tree and a linked list.  Skeletons are provided for the trait and abstract class along with skeletons for empty and non-empty concrete classes (or objects, essentially a Singleton of a class) for each.

{% highlight scala %}
abstract class TweetSet {
  def filterAcc(...)
  def filter(p: Tweet => Boolean): TweetSet =
    filterAcc(p, new Empty)
  def union(...)
  def mostRetweeted(...)
  def descendingByRetweet(...)
  def incl(...)
  def remove(...)
  def contains(...)
  def foreach(...)
  ...
}
    
class Empty extends TweetSet {
  ...8 functions...
}
    
class NonEmpty(...) extends TweetSet {
  ...8 functions...
}
    
trait TweetList {
  def head
  def tail
  def isEmpty
  def foreach(f: Tweet => Unit): Unit =
    if (!isEmpty) {
      f(head)
      tail.foreach(f)
    }
}
    
object Nil extends TweetList {
  ...3 functions...
}
    
class Cons(...) extents TweetList {
  ...3 functions...
}
{% endhighlight %}

This is where the idiomatic Clojure starts to diverge quite dramatically.  Clojure doesn't have an inheritance class system, but handles polymorphism through multi-methods and protocols (discussed later) and its approach to data structures can be boiled down to ["It is better to have 100 functions operate on one data structure than to have 10 functions operate on 10 data structures." - Alan J. Perlis](http://clojure.org/rationale).  Although it has somewhere around four (list, vector, map and set) concrete collections, with some having more than one implementation, all can be coerced into a seq.  There are also defrecords which are implemented under the hood as Java classes with additional methods to allow them to act as drop in replacement for maps.  This allows data structures to be created with their own type and comes with performance improvements compared to regular maps.  Finally there is the deftype construct that is used for the implementation of new data structures, something which is likely to be pretty rare, and provides the user with a blank object containing no implemented methods.  Into this dark hole is where we'll be heading.

Most of the functions defined on TweetSet and TweetList have equivalent functions in Clojure that require an implementation of the ISeq interface.  union, however, requires an IPersistentSet, which leads us to implementing 4 new deftypes as follows:

{% highlight clojure %}
(deftype NonEmpty
  [...]
  clojure.lang.ISequable
  clojure.lang.ISeq
  ...7 functions...
  clojure.lang.Sequable
  ...1 function...
  clojure.lang.IPersistentSet
  ...3 functions...)
    
(deftype Empty
  [...]
  clojure.lang.ISequable
  clojure.lang.ISeq
  ...7 functions...
  clojure.lang.Sequable
  ...1 function...
  clojure.lang.IPersistentSet
  ...3 functions...)
    
(deftype Cons
  [...]
  clojure.lang.ISequable
  clojure.lang.ISeq
  ...7 functions...
  clojure.lang.Sequable
  ...1 function...)

(deftype Nil []
  clojure.lang.ISequable
  clojure.lang.ISeq
  ...7 functions...
  clojure.lang.Sequable
  ...1 function...)
{% endhighlight %}

This is isn't something Clojurians would be expected to do on a regular basis, if ever.  The interfaces have almost no documentation (for instance, notice the ISequable interface, it requires the implementation of no functions and yet many of them will fail if it is not "implemented") and required a substantial amount of Google-fu and trial and error before I was able to hammer something together.

The Clojure version requires the implementation of nearly twice as many functions, but allows for the new deftypes to be used as drop in replacements for sets and seqs respectively.

## Types and Pattern Matching ##
![Swirly Pattern]({{ site.baseurl }}/hpowell/assets/Pattern.jpg)

[Webtreats Abstract Wavy Photoshop Patterns 1](https://www.flickr.com/photos/webtreatsetc/5663012271/in/photolist-9CqqfB-7tdSwx-7ELgDS-7ZSBk7-7Mp9ye-3sdkMh-pCaSMa-7NCPf9-7vg6ne-6oQE3u-5jTgTA-7f1cr9-8fBTBf-5h39EN-9AE76t-7GnWHM-8zYrEi-6bB3Ud-8fyCZP-3sdkMw-8Y56q9-9BBvfd-9AiDkX-5MEhA1-92hxHD-qhLeHm-9GbKkN-ejU2kr-7AQpm8-dKdjpS-eerw4x-ejZLyG-6fT1A2-ib3TXU-7TP53b-77QDrK-eQaSxu-9Ph8mg-8Xjxht-7VFWrF-4zEYcH-6uoKzD-ePYCaK-91YrTZ-5MA9XX-e2rzA9-ejZLAU-5MA2KH) by [webtreats](https://www.flickr.com/photos/webtreatsetc/) is licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/legalcode)

The fourth assignment looks at case classes and pattern matching.  Case classes are regular classes that inherit from the same, possibly abstract, base class.  Scala provides a pattern matching syntax that allows switching based on a match, including the type of a case class.  Clojure, on the other hand, provides multi-methods and protocols.  Multi-methods allow dispatch on the result of an ordinary function whereas protocols dispatch on the type of their first argument.

Here Scala uses two very simple case classes and then pattern matching when specific functionality is required:

{% highlight scala %}
abstract class CodeTree
case class Fork(left: CodeTree, right: CodeTree, chars: List[Char], weight: Int) extends CodeTree
case class Leaf(char: Char, weight: Int) extends CodeTree

def weight(tree: CodeTree): Int = tree match {
  case Leaf(char, weight) => weight
  case Fork(left, right, chars, weight) => this.weight(left) + this.weight(right)
}

def chars(tree: CodeTree): List[Char] = tree match {
  case Leaf(char, weight) => List(char)
  case Fork(left, right, chars, weight) => this.chars(left) ::: this.chars(right)
}
{% endhighlight %}

This use of pattern matching seems to be very reminiscent of the use of conditionals instead of polymorphism I'm sure we all experienced when first learning object oriented programming.  Using polymorphism would certainly be possible in this situation by having the case classes inherit from a trait that contained the weight and chars functions.  This lead to the idiomatic Clojure to deviate quite quickly.  Extracting each of the functions that used pattern matching into a protocol gave the following:

{% highlight clojure %}
(defprotocol HUFFMAN
  (char-list [this])
  (weight [this])
  ...3 more functions...)

(defrecord Fork [left right]
  HUFFMAN
  (char-list [this]
   (concat (char-list left) (char-list right)))
  (weight [this]
   (+ (weight left) (weight right)))
  ...3 more functions...)

(defrecord Leaf [character weight]
  HUFFMAN
  (char-list [this]
   [character])
  (weight [this]
   weight)
  ...3 more functions...)
{% endhighlight %}

This is much more how we would expect polymorphic functions to be constructed and would allow the easy creation of additional defrecords to add additional functionality.

Case classes aren't the only way Scala has to pattern match, but unfortunately that wasn't covered in the assignment.  I suspect those cases would match pretty neatly to Clojures multi-methods.

## Collections ##
The penultimate assignment introduces maps (which Clojure has and are used regularly) and tuples (which Clojure doesn't have, although lists can easily be used in their place).  It also introduces list comprehension using the for loop with Clojure having a similar form.

## Lazy Evaluation ##
![Lazy Lioness]({{ site.baseurl }}/hpowell/assets/Lazy.jpg)
[Lazy lioness](https://www.flickr.com/photos/tambako/12213600616/in/photolist-jBgTWY-99bb2c-5v8bik-duAe9-4E2s7M-7Y2mnC-78CoJx-87MqPt-7XY7BH-oNNxYp-bwKSef-6ohr3r-g1hJge-a21uq9-oYaswj-oFHbmB-nrmHt9-myozEy-5w7mht-oQ1Bij-87MqVk-ihrNo2-amZua5-9D2Zso-4z9hJ-i1vEU4-4iR5UZ-aFi2LB-hCThu2-esZEKQ-8iU2Wv-4UiSu-5bkvyj-8eP3So-zsMAG-6m5Ft-7YUB5d-cbV975-4A4Y27-fhtqqR-cYv8q9-tM5nv-g4Ufc9-jWJf-6CbdfG-g4j71P-5yY6v4-o9yAVK-76PCvE-936fG4) by [Tambako The Jaguar](https://www.flickr.com/photos/tambako/) is licensed under [CC BY-ND 2.0](https://creativecommons.org/licenses/by-nd/2.0/legalcode)

Both Scala and Clojure are strict about passing parameters.  However, both have the ability to return lazy collections, Streams and lazy-seqs respectively.  The usual collection modifying functions (e.g. map, filter, range (although it's called from when used by Scala Streams), etc.) can be applied to these lazy collections and will return lazy collections.

The most significant difference is that Clojure will return a lazy-seq from these functions whether they were applied to lazy or regular collections whereas Scala requires an explicit use of the Stream object to be able to benefit from laziness.  The final assignment was a breadth first exploration of a 2 dimensional space to find the optimal path between two points.  The solutions were very similar, although Clojure didn't require the use of explicitly lazy collections.

## Conclusion ##
Porting the assignments from Scala to Clojure has been an interesting experience although I'm not sure it has given me the insight I was looking for.  I had assumed the exercises would be shining examples of idiomatic Scala, but this seems not to be the case.  Specifically, surely "in the real world" the TweetSet would be built on top of a more generic and reusable binary tree collection and the CodeTree would be a trait providing weight and char-list functions rather than violating the Open/Closed principle through pattern matching.

So what are the biggest differences between these two languages?  From my perspective, there are two.  

### Syntax ###
Scala's syntax is an evolution from Java and allows the user to use a variety of styles.  This requires discipline on the part of the user and could increase the learning curve on a new project that has a different style.  Clojure, on the other hand, shouts its Lisp ancestry from the top of its lungs.  It's a syntax that's not for everyone, will have a steep learning curve for anyone without a Lisp background and, like all languages, with sufficient effort can be contorted into incomprehensibility.  

### Data ###
Scala wants you to take all of that OO knowledge you've accumulated over the years and expand upon it.  Classes are very much at its forefront, although significantly more flexible than those in Java, C# and C++ thanks to traits.  This is a familiar paradigm allowing users to get up to speed more quickly and take advantage of all of the benefits of OO (along with all of its downsides).  Clojure thinks OO is rather overrated and gives the user a new paradigm to work with having emulated/pillaged the bits of OO it does like (e.g. Polymorphism, although without inheritance).  It breaks with the OO notion that functions and data should be inextricably linked with its philosophy of 100 functions applied to 1 data structure.























