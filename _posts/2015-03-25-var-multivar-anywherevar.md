---
title: var, multi-var or anywhere var?
date: 2015-03-25 00:00:00 Z
categories:
- Tech
author: lpage
layout: default_post
summary: When it comes to coding style in JavaScript, what makes most sense - one
  var declaration, multiple at the start or scoped?
---

Anyone familiar with Crockford and jshint will be familiar with the onevar rule: all variables must be declared in a single var statement at the top of the file.

{% highlight js %}
function myFunc() {
    var i,
        j,
        date,
        myVariable;
    ...
}
{% endhighlight %}

There is logic behind it: this is what the language is actually doing, so if you write your code like this, no variable hoisting will occur and therefore people reading your code will not have to worry about hoisting and instead concentrate on program function.

Then, a couple of months ago I came across [this post from @cowboy](http://benalman.com/news/2012/05/multiple-var-statements-javascript/); if you haven't read it already, read it now, it's very convincing and I'm not going to repeat it all here. After reading it, I was a convert and started using a single var statement less.

Now I think we should scrap the whole hoisted var altogether and put them where we like. Why? jshint and ES6.

Firstly, I'd like to propose that having vars throughout the code is easier to read (if the reader of the code assumes hoisting has not been abused).

{% highlight js %}
function myFunc(input) {
    var i, j, item;
    var date = 0;
    for(i = 0; i < input.length; i++) {
        item = input[i];
        for(j = 0; j < item.length; j++) {
            if(date > item[j]) {
                date = item[j];
            }
        }
    }
}
{% endhighlight %}
vs
{% highlight js %}
function myFunc(input) {
    var date = 0;
    for(var i = 0; i < input.length; i++) {
        var item = input[i];
        for(var j = 0; j < item.length; j++) {
            if(date > item[j]) {
                date = item[j];
            }
        }
    }
}
{% endhighlight %}

It is one less line of code (more if you have a var on each line) and you can tell if a variable is hoisted or global where it is first used, instead of glancing up to the top. In this simple example it is perhaps less obvious a difference, but compare it with a more complex function with eight local variables and I think it starts making a big difference.

So, it's simpler. What about reusing a variable and all the hoisting quirks? [If you have jshint set up correctly](http://jshint.com/docs/options/#shadow) and you use a variable outside its scope you get an error 'variable' used out of scope. So, you are protected from creating a situation where the code is confusing or buggy through the use of hoisted variables. Developers who don't understand hoisting will learn through jshint rejections (assuming your build rejects if jshint does not pass - it should) and developers who do understand won't do it, unless by mistake.

That, by itself, may not be enough. But consider that ES6 has the `let` keyword, which gives you scoped variables. If you agree that the code is easier to understand with scoped variables, shouldn't you use `let` in all cases? If you accept that, then code of the future will use let everywhere and won't have a single var declaration at the beginning of the function. Wouldn't it be nice to be able to replace all `var` with `let` and for it to look like the JavaScript of the future and not a new keyword combined with an old style rule?























