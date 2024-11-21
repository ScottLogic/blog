---
title: Making a RTL plugin in less
date: 2015-02-19 00:00:00 Z
categories:
- Tech
author: lpage
layout: default_post
oldlink: http://www.scottlogic.com/blog/2015/02/19/rtl-plugin.html
disqus-id: "/2015/02/19/rtl-plugin.html"
summary: I mentioned in the previous post that I would create a plugin for less which
  converted from LTR to RTL. Here is a tutorial post on creating that plugin.
---

I mentioned in the previous post that I would create a plugin for less which converted from LTR to RTL. Here is a tutorial post on creating that plugin.

## Setting the project up

I know we want to modify the AST (abstract syntax tree), so we will need a visitor plugin - I wrote an [example visitor plugin](https://github.com/less/less-plugin-inline-urls) and that would help us in getting started. 

We need a `package.json` which has a dev-dependency on less but nothing else - this is because less plugins get required from within the less compiler, not the other way round.

The first thing to sort out is tests - because there is no UI, it is crucial we know what is going on. I've created a test folder and that can re-use the acceptance tests framework from less. There we have a set of less files and corresponding CSS files. The CSS is generated from the less and then compared to the checked in CSS, which then passes if they are the same. The source is simple..

{% highlight js %}
var less = require("less"),
    lessTest = require("less/test/less-test"),
    lessTester = lessTest(),
    plugin = require('../lib'),
    stylize = less.lesscHelper.stylize;

console.log("\n" + stylize("LESS - RTL", 'underline') + "\n");

lessTester.runTestSet(
    {strictMath: true, relativeUrls: true, silent: true, plugins: [plugin] },
    "rtl/");
{% endhighlight %}

and we are passing our own plugin in the plugins array so it is used when creating the less. I've added two files `css/rtl/test.css` and `less/rtl/test.less`.

Next we need the base of the plugin. Less expects an object with an install function, so in `lib/index.js` we have that:

{% highlight js %}
module.exports = {
    install: function(less, pluginManager) {
        pluginManager.addVisitor(new RTLPlugin());
    }
};
{% endhighlight %}

less gives the plugin itself and the plugin manager for this current compile, so it is just a matter of adding a visitor.

A visitor is a class that has a function for each type of node in the AST and then is called on those. So you may have a visitRule function which gets called once for each rule and a visitURL that gets called once per URL node. Here is a basic visitor that doesn't do anything.

{% highlight js %}
function RTLPlugin() {
    this._visitor = new less.visitors.Visitor(this);
};

RTLPlugin.prototype = {
    isReplacing: true,
    run: function (root) {
        return this._visitor.visit(root);
    },
    visitRule: function (ruleNode, visitArgs) {
        return ruleNode;
    }
};
{% endhighlight %}

It uses the less visitor base class in order to get the visitor functionality. We can now run the tests in order to check no exceptions occur.

<div class="highlight"><pre><code class="language-bash" data-lang="bash">
<span class="nv">$ </span>node <span class="nb">test</span>

LESS - RTL

- test\less\rtl\test: <span style="color: green;">OK</span>
</code></pre></div>

You can see the full commit [here](https://github.com/less/less-plugin-rtl/commit/bd02add79d85573993403235548ced3afb0f9070).

## Reversing floats

My next step would be to define simple tests - this means we can verify the tests fail and also debug our solution. Adding `float: left` and the reverse in the css and re-running the tests shows..

<div class="highlight"><pre><code class="language-bash" data-lang="bash">
<span class="nv">$ </span>node <span class="nb">test</span>

LESS - RTL

- test\less\rtl\test: <span style="color: red;">FAIL</span>
.reverse {
<span style="color:red">  float: left;¶</span>
<span style="color:green">  float: right;¶</span>
}
</code></pre></div>

So, going back to the visitor, we want to catch the keyword left when the rule is float. [Referring back to the nodes](https://github.com/less/less.js/tree/master/lib/less/tree) we can write the following.

{% highlight js %}
visitRule: function (ruleNode, visitArgs) {
    if (ruleNode.name === "float") {
        this._reverseKeywords = true;
    }
    return ruleNode;
},
visitRuleOut: function () {
    this._reverseKeywords = false;
},
visitKeyword: function (keywordNode, visitArgs) {
    if (this._reverseKeywords) {
        switch(keywordNode.value) {
            case "left":
                return new less.tree.keyword("right");
            case "right":
                return new less.tree.keyword("left");
        }
    }
}
{% endhighlight %}

So, the out appended function is called once all child nodes have been visited. So we store a flag that we are reversing, then if that is set when we visit a keyword, we flip it. However this doesn't quite work - less uses an anonymous node when it can as a performance improvement, so we need to catch that too. A bit of abstraction later and the test passes. I also add a test that has the reverse and uses a comment, which forces less into using the keyword node rather than the anonymous one. See the [commit here](https://github.com/less/less-plugin-rtl/commit/10153ef636f9755e1c7f9f38d90451392e8a684e).

## Reversing Property Names

The next job is to reverse properties like `margin-left` to `margin-right`. For this we just need to transform the rule node and replace the name with the correct one. We always create a new node as some nodes may be shared and we wouldn't want to replace a node twice.

{% highlight js %}
 visitRule: function (ruleNode, visitArgs) {
    if (!ruleNode.variable && ruleNode.name.match(/(^|-)(left|right)($|-)/)) {
        return new less.tree.Rule(
            ruleNode.name.replace(/(^|-)(left|right)($|-)/, function(allOfMatch, leftPart, replacePart, rightPart) {
                if (replacePart === "left") {
                    replacePart = "right";
                } else {
                    replacePart = "left";
                }
                return leftPart + replacePart + rightPart;
           }),
           ruleNode.value,
           ruleNode.important,
           ruleNode.merge,
           ruleNode.index,
           ruleNode.currentFileInfo,
           ruleNode.inline,
           ruleNode.variable);
{% endhighlight %}

Unfortunately at the moment there is no way to clone a node and change just what you need, but it is something I will need to add in the future. See the full commit [here](https://github.com/less/less-plugin-rtl/commit/23b2e72cb75d6b81070fd9cbadfcfa9a8331ab6f).

## Reversing Shorthand Properties

Next, we want to reverse shorthand properties. So for instance this is all the shorthands for margin.
{% highlight css %}
.reverse {
  @top: 1px;
  @right: 2px;
  @bottom: 3px;
  @left: 4px;
  @all: 5px;
  @vertical: 6px;
  @horizontal: 7px;

  margin: @all; 
  margin: @vertical @horizontal; 
  margin: @top @horizontal @bottom; 
  margin: @top @right @bottom @left; 
}
{% endhighlight %}

We need only replace the last example, swapping the left and right. We can do this by setting a flag and reversing the order when we reach an expression (in less, an expression is space separated, a value is comma separated).

{% highlight js %}
visitExpression: function (expressionNode, visitArgs) {
    if (this._shortHandReorder && expressionNode.value.length === 4) {
        this._shortHandReorder = false;
        return new less.tree.Expression([expressionNode.value[0], expressionNode.value[3], expressionNode.value[2], expressionNode.value[1]]);
    }
    return expressionNode;
}
{% endhighlight %}

You can see these changes [here](https://github.com/less/less-plugin-rtl/commit/cdd83189b3553cc42c8bf54db2cfc9b6d07acb78).

## Adding a variable

Lastly, you will come across situations where you do not just want to reverse, but have a conditional. For these situations we will use a pre-process plugin. This allows us to add variables to a file that is compiling. So, back in our index file we add the variable plugin..

{% highlight js %}
pluginManager.addPreProcessor(new RTLVariablePlugin());
{% endhighlight %}

and then we implement our plugin...

{% highlight js %}
function RTLVariablePlugin() {
}

RTLVariablePlugin.prototype.process = function(src, extra) {
    var variable = "@rtl: true; @ltr: false;\n"
    var contentsIgnoredChars = extra.imports.contentsIgnoredChars;
    var filename = extra.fileInfo.filename;
    contentsIgnoredChars[filename] = contentsIgnoredChars[filename] || 0;
    contentsIgnoredChars[filename] += variable.length;
    return variable + src;
};
{% endhighlight %}

We update the contentsIgnoredChars in order that the sourcemap offset is correctly updated. You can see this commit [here](https://github.com/less/less-plugin-rtl/commit/fd1cf38e3be17241aecedd334b5e0ae8350e396d). Finally, since we have a variable we probably want to run the plugin whether we are producing LTR or RTL, so finally we [add some options and update the readme](https://github.com/less/less-plugin-rtl/commit/259adba62b388302c9d6442d92f360dcf4b03fb7).

## Conclusion

I have no doubt there are CSS rules I have missed, but I hope this takes some of the mystery out of less and creates something that with a little bit of polishing and bug-fixing can be a useful plugin.

There is also a change we need to make soon which makes extensions like this easier. At the moment comment nodes are added as nodes to the AST, which means that the code that reverses shorthands might not always work if there is a comment in the middle of the value. We need to move comments and white-space inside the nodes and then create a better mechanism for cloning so that plugins can be forward compatible. Its also clear there is boiler plate code in this plugin that could be taken back into the less project, when someone has time.























