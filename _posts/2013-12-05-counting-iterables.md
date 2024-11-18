---
title: Iterating while counting
date: 2013-12-05 00:00:00 Z
categories:
- Tech
tags:
- blog
author: aaylett
layout: default_post
source: site
oldlink: http://www.scottlogic.com/blog/2013/12/05/counting-iterables.html
disqus-id: "/2013/12/05/counting-iterables.html"
summary: Suppose you have a collection, and you need to perform an action on each element.  That's not hard to do in any mainstream programming language.  What if you need to know the index of each element as you process it?  Not hard, but depending on your datastructures, possibly not as straightforward as it first sounds.
---

Suppose you have a collection, and you need to perform an action on each
element.  That's not hard to do in any mainstream programming language.  What
if you need to know the index of each element as you process it?  Not hard,
but depending on your datastructures, possibly not as straightforward as it
first sounds.

I think most people reading this will be most familiar with C-style languages.
Traditionally, there are two types of loop construct: a counted `for` loop and
an uncounted `while` loop.  Java was introduced with these loop constructs:

{% highlight java %}
for (int i = 0; i < list.size(); i++) {
  process(i, list.get(i));
}

int j = 0;
while (j < list.size()) {
  process(j, list.get(j));
  j++;
}
{% endhighlight %}

These work well enough, but there's no way to actually convey what it is
you're achieving: you're looping until a condition is met, rather than
explicitly looping over all the elements of the collection.  These particular
examples will also only work when accessing something indexable, and are
sub-optimal for collections (like `LinkedList`) which don't have constant-time
access to their elements.  You can use an iterator with a while loop to avoid
these issues, but you still have to manually increment your counter:

{% highlight java %}
int j = 0;
Iterator<Thing> it = list.iterator();
while (it.hasNext()) {
  process(j, it.next());
  j++;
}
{% endhighlight %}

Java 1.5 adds an explicit iteration construct, which runs off the `Iterable`
interface:

{% highlight java %}
int j = 0;
for (Thing t : list) {
  process(j, t);
  j++;
}
{% endhighlight %}

This leaves your iteration at the right level of abstraction, but you still
have to count your elements.  In a language like Python, you'd solve this
issue by zipping with an integer sequence:

{% highlight python %}
>>> a = ['a','b','c','d']
>>> for val,i in zip(a, count()):
...   print val, i
...
a 0
b 1
c 2
d 3
{% endhighlight %}

Java doesn't have the ability to perform multiple assignments, and a general
zip operator is non-idiomatic as with strong typing we really want to avoid a
generic `Pair<?,?>` interface.  What we can easily do, though, is wrap our
iterable so that it gives us the right information.  Consider this code
snippet:

{% highlight java %}
for (Counted<Thing> t : counting(list)) {
  process(t.getCount(), t.getValue());
}
{% endhighlight %}

This code also makes it clear what's going on: you're released from having to
manually manage your counter, and the count and value are accessible on-demand.

It's not difficult to implement, either.  I've arranged my code into four classes, although two would probably suffice.  I'm using Java 7, and I've also pulled in Guava for some helper classes.  Complete code is [on GitHub](https://github.com/andrewaylett/iterables). Starting from the top, most of the code's interaction with the implementation is through the `Counted<T>` interface:

{% highlight java %}
public interface Counted<T> {
    long getCount();
    T getValue();
}
{% endhighlight %}

The only other user-visible code is the static function `counting()`, which returns our iterable:

{% highlight java %}
    public static <T> Iterable<Counted<T>> counting(Iterable<T> iterable) {
        return new CountingIterable<>(iterable);
    }
{% endhighlight %}

I've put this in a class with a second overloaded version that converts an `Iterator`.

The actual implementation of the `CountingIterable` isn't important for the user of the code, but is quite simple -- it's a fairly minimal wrapper around the `Iterable` that's passed in and another wrapper around that `Iterable`'s `Iterator`.  Here's the `CountingIterable`:

{% highlight java %}
public class CountingIterable<T> implements Iterable<Counted<T>> {

    private final Iterable<T> iterable;

    public CountingIterable(Iterable<T> iterable) {
        this.iterable = iterable;
    }

    @Override
    public CountingIterator<T> iterator() {
        return new CountingIterator<>(iterable.iterator());
    }
}
{% endhighlight %}

And here's the `CountingIterator` that it uses:

{% highlight java %}
public final class CountingIterator<T> implements Iterator<Counted<T>> {
    private final Iterator<T> it;
    private long count = 0;

    public CountingIterator(Iterator<T> it) {
        this.it = checkNotNull(it);
    }

    @Override
    public boolean hasNext() {
        return it.hasNext();
    }

    @Override
    public Counted<T> next() {
        final long currentCount = count++;
        final T currentValue = it.next();

        return new Counted<T>() {
            @Override
            public long getCount() {
                return currentCount;
            }

            @Override
            public T getValue() {
                return currentValue;
            }
        };
    }

    @Override
    public void remove() {
        it.remove();
    }
}
{% endhighlight %}

Again, the complete code (including test cases) is [on GitHub](https://github.com/andrewaylett/iterables).

You'll see that most of the complexity, such as there is, is in the `next()` function -- up to that point, we're simply wrapping the existing objects.  This allows us to write as little code as possible.  If we were creating a number of custom iteration types, we could even abstract out the pattern of wrapping the existing `Iterator` into an abstract superclass.  That's probably overkill for most use-cases, but I think that thinking about it is a useful exercise in understanding how to apply the design pattern in more complicated (and possibly more useful) cases.























