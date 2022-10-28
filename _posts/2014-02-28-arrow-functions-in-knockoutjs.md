---
title: Arrow functions in Knockout.js
date: 2014-02-28 00:00:00 Z
categories:
- cprice
- Tech
author: cprice
image: cprice/assets/featured/arrows.jpg
image-attribution: image courtesy of <a href="http://www.flickr.com/photos/byronj/12637612753/sizes/z/">Byron
  James</a>
layout: default_post
oldlink: http://www.scottlogic.com/blog/2014/02/28/arrow-functions-in-knockoutjs.html
disqus-id: "/2014/02/28/arrow-functions-in-knockoutjs.html"
summary: Recently, Knockout's original author Steve Sanderson released a plugin called [knockout-projections](https://github.com/stevesanderson/knockout-projections) which optimises the performance of the observable array methods filter and map.
---

Recently, Knockout's original author Steve Sanderson released a plugin called [knockout-projections](https://github.com/stevesanderson/knockout-projections) which optimises the performance of the observable array methods filter and map. In this post, I'll take a peek into the future by combining this plugin with the forthcoming ES6 arrow functions to produce some very terse and highly efficient collection bindings.

# Array filter and map

Before I jump into arrow functions I'll quickly introduce a couple of the ES5 array methods, you can safely skip this section if you're familiar with them. However, if you're not already using these methods, you're missing out. Equivalent to the C# IEnumerable methods ```where``` and ```select```, they're basically shorthand for -

{% highlight javascript %}
  // var newArr = arr.filter(conditional);
  var arr = ..., newArr = [];
  for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (conditional(item)) {
          newArr.push(item);
      }
  }

  // var newArr = arr.map(projection);
  var arr = ..., newArr = [];
  for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      newArr.push(projection(item));
  }
{% endhighlight %}

They've now got widespread adoption in the browsers and are [easily poly-filled](https://github.com/es-shims/es5-shim/). Consider yourself informed.

# The problem

I used to write a lot of C# and I was a big fan of LINQ, so I was looking forward to using these methods in my bindings. Unfortunately, I'd forgotten about one thing... JavaScript's crazy verbose function syntax. For me, adding that in really takes the shine off using these new methods in bindings -

{% highlight javascript %}
  <ul data-bind="foreach: items.filter(function(item) { return item.done(); })">
    <li data-bind="text: description"></li>
  </ul>
{% endhighlight %}

If you haven't already heard, [ES6 will introduce a new syntax for lambdas called arrow functions](http://tc39wiki.calculist.org/es6/arrow-functions/). Now the new syntax might only shave off a few characters (21 if you're feeling pedantic), but to me it looks so much neater -

{% highlight javascript %}
  <ul data-bind="foreach: items.filter(item => item.done)">
    <li data-bind="text: description"></li>
  </ul>
{% endhighlight %}

Unfortunately, browser support for ES6 just isn't there yet and short of inventing a time machine there's not much we can do about that... or is there?

# A solution (of sorts)

Adopting a fairly liberal artistic license (basically throwing any loading performance concerns out the window...), it turns out that we can use the new syntax in bindings with a small Knockout plugin. This is because bindings aren't directly interpreted as JavaScript by the browser, instead Knockout pre-processes them to support e.g. re-evaluating expressions when dependencies change. 

In Knockout 3.0 it is now very easy to hook into this preprocessing. For example we can add a preprocessor to all binding values with something like -

{% highlight javascript %}
  Object.keys(ko.bindingHandlers).forEach(function(key) {
      // A bit of fudging to make sure we don't clobber any existing preprocessors
      var originalPreprocess = ko.bindingHandlers[key].preprocess;
      ko.bindingHandlers[key].preprocess = function(stringFromMarkup) {
          if (originalPreprocess) {
              stringFromMarkup = originalPreprocess(stringFromMarkup);
          }
          return rewriteBindingValue(stringFromMarkup);
      };
  });
{% endhighlight %}

That means that *all* we need to do is use an ES6 compatible parser to parse the ```stringFromMarkup```, use an ES6 compatible Abstract Syntax Tree traverser to swap out the arrow functions for their old-skool counterparts and then finally generate the corresponding JavaScript snippet from the modified AST. Simples! (If a lot-a-bit overkill).

# Static meta-programming

[Esprima](https://github.com/ariya/esprima), [estraverse](https://github.com/Constellation/estraverse) and [escodegen](https://github.com/Constellation/escodegen) are existing tools for static meta-programming, a fancy way of saying "messing around with the source code before it's executed". The tools are well documented on their respective sites but and in this case I think the APIs are obvious enough -

{% highlight javascript %}
  function rewriteBindingValue(stringFromMarkup) {
      var ast = esprima.parse(stringFromMarkup);
      estraverse.replace(ast, {
          enter: function (node, parent) {
              if (node.type === 'ArrowFunctionExpression') {
                  return rewriteArrowFunctionExpressionNode(node);
              }
          }
      })
      return escodegen.generate(ast);
  }
{% endhighlight %}

We take the source ```stringFromMarkup``` and use esprima to translate it into an AST. We then traverse this AST searching for ArrowFunctionExpression nodes. If we find one, we use a helper function to rewrite the node into an ES5 compatible version and then tell estraverse to replace the node with our rewritten version. Finally, we use escodegen to generate JavaScript code corresponding to the rewritten AST.

# Rewriting an arrow function expression

The last piece in the puzzle is how to rewrite the arrow function into a plain function. Helpfully, the TC39 (JavaScript's standards committee) wiki defines [how arrow functions should behave](http://tc39wiki.calculist.org/es6/arrow-functions/). In essence we need -

{% highlight javascript %}
  items.filter(item => item.done)
{% endhighlight %} 

To become -

{% highlight javascript %}
  items.filter(function(item) { 
      return ko.unwrap(item.done); 
  }.bind(this))
{% endhighlight %}

This basic implementation just maps the parameters as they are, adds a return statement to the body expression and lexically binds this. I've also thrown in a ```ko.unwrap``` to allow us to be lazy about referencing the observable itself or the observable's value. 

Converting the above JavaScript to an AST representation looks something like -

{% highlight javascript %}
  function rewriteArrowFunctionExpressionNode(node) {
      return {
          type: 'CallExpression',
          arguments: [
              {
                  type: 'ThisExpression'
              }
          ],
          callee: {
              type: 'MemberExpression',
              object: {
                  type: 'FunctionExpression',
                  params: node.params,        // <- we pass the AFE params as the function params
                  body: {
                      type: 'BlockStatement',
                      body: [
                          {
                              type: 'ReturnStatement',
                              argument: {
                                  type: 'CallExpression',
                                  arguments: [
                                      node.body   // <- and the body as the argument to ko.unwrap
                                  ],
                                  callee: {
                                      type: 'MemberExpression',
                                      object: {
                                          type: 'Identifier',
                                          name: 'ko'
                                      },
                                      property: {
                                          type: 'Identifier',
                                          name: 'unwrap'
                                      }
                                  }
                              }
                          }
                      ]
                  }
              },
              property: {
                  type: 'Identifier',
                  name: 'bind'
              }
          }
      };
  }
{% endhighlight %}

It looks complicated but actually it's just quite a verbose, repetitive pattern of nested objects representing the nodes of the AST. The comments highlight the two places that the substitution takes place. 

You can see a really basic [example in action here](http://chrisprice.io/knockout-arrows/example/), make sure you peek at the DOM to see the arrow function in the binding. The [source is available here](https://github.com/chrisprice/knockout-arrows/) and creating your own example with browserify should be as simple as -

{% highlight bash %}
  npm install chrisprice/knockout-arrows
{% endhighlight %}

{% highlight javascript %}
  // add in arrow support
  require('knockout-arrows');
{% endhighlight %}

# Conclusion

So whilst not the most practical end result i.e. you probably don't want to be loading a full-blown ES6 parser, tree traversal and code generation logic along with your app. I do think it gives a glimpse of the future of bindings in the browser. I look forward to the day that all of this comes for free but until then I'll happily buy a beer for the first person to turn this into a build-time grunt task.
























