---
author: ceberhardt
title: Recursive Pattern Matching and Transformation of JavaScript AST
layout: default_post
categories:
  - Tech
---

I've recently been playing around with the JavaScript [Abstract Syntax Trees](https://en.m.wikipedia.org/wiki/Abstract_syntax_tree) (AST), with the aim of transforming some JavaScript code into various other languages (Java, C#, Objective-C). As part of my research, I looked at how Babel performs AST transforms. If you're not familiar with Babel, and the plugins which perform the transformations, I'd recommend [this blog post by Shuhei Kagawa](http://shuheikagawa.com/blog/2015/09/13/lets-create-a-babel-plugin/) that describes the development of a simple plugin for Angular 2 code generation.

Babel plugins expose a visitor which matches AST node types. The plugin interface also provides an API for mutating the AST directly.

There are a few things I don't like about this process:

1. Complex patterns are not easily matched, e.g. match nodes that are binary expressions with numeric literals for both the left- and right-hand side.
2. The mutation of the existing AST seems wrong to me, I'd prefer to project the AST into a new form.
3. The API for mutating the AST seems quite cumbersome, it's just JSON after all.

As a caveat, I am sure there are good reasons for Babel operating the way it does, I am certainly not attacking its design! However, for my purposes, transforming from one AST form to another, or JavaScript AST to text (e.g. Java sourcecode), the approach doesn't quite fit.

The problem of transforming AST strikes me as being quite similar to the problem of transforming XML from one form to another. XML transforms can be achieved using XSLT and XPath, a couple of technologies which I find quite elegant. This blog post looks at how an XSLT-inspired approach can be used applied to JavaScript AST.

As a quick example of the approach I came up with, this transform automatically assigns properties based on a constructor signature:

~~~ javascript
module.exports = pathRule(
  '.{.type === "ClassMethod" && .kind === "constructor"}',
  (ast, runner) => Object.assign({}, ast, {
    body: {
      type: 'BlockStatement',
      body: ast.params.map(p => parse(`this.${p.name} = ${p.name}`))
        .concat(ast.body.body.map(runner))
    }
  })
);
~~~

For example, it takes a class which has constructor parameters:

~~~ javascript
class Shape {
  constructor(width, height) {
    console.log(`Shape constructed (${width}, ${height})`);
  }
}
~~~

Transforming it to a class where the parameters are mapped to properties:

~~~ javascript
class Shape {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    console.log(`Shape constructed (${width}, ${height})`);
  }
}
~~~

This is actually an example taken from the [blog post I mentioned earlier](http://shuheikagawa.com/blog/2015/09/13/lets-create-a-babel-plugin/), but achieved with much less code!

NOTE: The example given by Shuhei Kagawa uses a decorator, `@autoassign`, to invoke this behaviour. Decorators have been removed from Babel as of version 6 due to the specification being in flux, which is why I've omitted them from my example.

## Pattern matching the AST

One of the key components of XSLT is its use of XPath, which is a versatile query language for XML. As an example, if the  JavaScript AST were represented in XML, the following XPath could be used to locate any computed member expressions (i.e. `foo['bar']`):

~~~ console
//*[./type ='MemberExpression' and ./computed = 'true']
~~~

Fortunately I found a project called [JSPath](https://github.com/dfilatov/jspath) which provides a similar query language for JSON. The same query using JSPath looks like this:

~~~ javascript
const path = '..{.type === "MemberExpression" && .computed === true}',
const nodes = JSPath.apply(path, ast);
~~~

This will pull out any computed member expressions from the AST.

This query language makes it easy to match complex patterns within the AST.

## Identity Transform

JSPath provides a mechanism for querying the AST, what we also need is a mechanism for applying these queries to the AST, and associating them with a transformation.

With XSLT you define a number of template rules, each of which are evaluated to determine matches against the current nodeset. Matching rules typically emit a transformed XML representation, then select a subset of nodes to recursively apply the rules to. There is also an identity transform which copies elements and attributes, recursively applying template rules. I quite like this approach, so decided to copy it!

The following code defines a set of rules (which currently just contains the identity), and a simple runner that iterates over all the rules, breaking on the first that matches (i.e. returns a result).

~~~ javascript
const rules = [
  identity
];

const rulesRunner = (ast) => {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const res = rule(ast, rulesRunner);
    if (res !== '') {
      return res;
    }
  }
};
~~~

Rules are invoked, passing the AST and the runner so that they can recurse. Here's the identity transform:

~~~ javascript
const identity = (ast, runner) => {
  var out = {};
  for (var prop in ast) {
    const value = ast[prop];
    if (Array.isArray(value)) {
      out[prop] = value.map(runner);
    } else if (typeof value === 'object' && value !== null) {
      out[prop] = runner(value);
    } else {
      out[prop] = value;
    }
  }
  return out;
};
~~~

This iterates over the properties of the current AST node, recursively applying the runner to arrays and properties, and returning simple property values.

The above code can be executed against an AST generated via Babel:

~~~ javascript
const ast = babel.transform(code).ast;
let transformed = rulesRunner(ast);
~~~

... with the output being exactly the same as the input. Good result!

## A simple transformations

OK, now that the identity is working, it's time to do something more interesting. One of the first posts I read about JavaScript AST transformation described how to take a simple binary operation, `const x = 5 * 10`, compute the operation and replace the expression with the result, `const x = 50`.

The AST that Babel generates for this expression is as follows:

~~~ json
{
 "type": "BinaryExpression",
 "left": {
   "type": "NumericLiteral",
   "value": 5
 },
 "operator": "*",
 "right": {
   "type": "NumericLiteral",
   "value": 10
 }
}
~~~

(Note, other parses such as Acorn create a different AST representation, there isn't actually a standard for this)

The above AST gives an indication of the type of pattern that this transform rule needs to match.

The `rulesRunner` provides each transformation rule with the current AST fragment, and a reference to the runner itself. With JSPath, I'd like to define rules as a path which, if matched, results in a transformation:

~~~ javascript
const JSPath = require('JSPath');

const matchOnce = (pattern, ast) => {
  const match = JSPath.apply(pattern, ast);
  return match.length > 0 ? match[0] : undefined;
};

module.exports /* pathRule */ = (path, ifMatch) =>
  (ast, runner) => {
    const match = matchOnce(path, ast);
    return match ? ifMatch(match, runner) : '';
  };
~~~

With the above defined `pathRule`, the rule which computes the result of binary expressions can be defined as follows:

~~~ javascript
const pathRule = require('./pathRule');

module.exports = pathRule(
  '.{.type === "BinaryExpression" && .left.type === "NumericLiteral" && .right.type === "NumericLiteral"}',
  (ast, runner) => ({
    type: 'NumericLiteral',
    value: eval(ast.left.value + ast.operator + ast.right.value)
  })
);
~~~

The above rule is quite concise and readable, it matches any binary expression where both the left and right side are numeric literals. When a match occurs, it returns a literal which is the result of computing this expression.

Adding this to the rules, and once again using babel to transform from JavaScript source to the AST and back again, demonstrates this rule in action:

~~~ javascript
const rules = [
  require('./rules/computeExpression'),
  identity
];

const code = 'var foo = 5 * 10';
const ast = babel.transform(code).ast;
let transformed = rulesRunner(ast);
console.log(babel.transformFromAst(transformed).code);
// output: var foo = 50;
~~~

The recursive nature of the identity transform ensure that this transform occurs wherever the expression is located in the AST.

## A few more simple examples

With this basic structure in place, we can do all sorts of things. What about removing console.log statements? Easy ...

We just have to match the correct pattern, returning `undefined` when the pattern matches:

~~~ javascript
module.exports /* removeCallExpression */= (objectName, propertyName) => pathRule(
  `.{.type === "CallExpression" && .callee.object.name === "${objectName}" && .callee.property.name === "${propertyName}"}`,
  (ast, runner) => undefined
);
~~~

This can be added to the list of rules:

~~~ javascript
const rules = [
  require('./rules/computeExpression'),
  removeCallExpression('console', 'log'),
  identity
];
~~~

What about renaming a call expression? In this case we want to change part of the AST, but leave the rest intact. In this case, we can make use of `Object.assign` to mutate parts of the AST:

~~~ javascript
module.exports /* renameCallExpression */ = (objectName, propertyName, newPropertyName) => pathRule(
  `.{.type === "MemberExpression" && .object.name === "${objectName}" && .property.name === "${propertyName}"}`,
  (ast, runner) => Object.assign({}, ast, {
    property: {
      type: 'Identifier',
      name: newPropertyName
    }
  })
);
~~~

This can be added to the list of rules, changing call to `console.warn` to `console.error`:

~~~ javascript
const rules = [
  require('./rules/computeExpression'),
  removeCallExpression('console', 'log'),
  renameCallExpression('console', 'warn', 'error'),
  identity
];
~~~

## Combining variable declarations

Now for something more complicated. Given a number of variable declarations:

~~~ javascript
var f = 10;
var g = 20;
var m = 4 + 7;
~~~

I'd like to merge them into a single declaration:

~~~ javascript
var f = 10, g = 20, m = 11;
~~~

Babel actually has a [plugin that performs this transformation](https://babeljs.io/docs/plugins/transform-merge-sibling-variables/).

Here's a transformation rule that achieves this:

~~~ javascript
module.exports = pathRule(
  '.{.type === "Program" || .type === "BlockStatement" && .body.type === "VariableDeclaration"}',
  (ast, runner) => Object.assign({}, ast, {
    body: [{
      type: 'VariableDeclaration',
      kind: 'var',
      declarations:
        JSPath
          .apply('.body{.type === "VariableDeclaration"}.declarations', ast)
          .map(runner)
    }]
    .concat(ast.body.filter(d => d.type !== 'VariableDeclaration'))
      .map(runner)
  })
);
~~~

This rule is a little more complex ... firstly, it matches on any block statement or program that contains a variable declaration. The transformation returns a copy of this block where a new variable declaration is added to the top, [hoisting the declarations](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/var#var_hoisting). The JSPath `.body{.type === "VariableDeclaration"}.declarations` is used to find these declarations, with `map(runner)` being used to ensure that rules are recursively applied to these declarations. Finally, the declaration is concatenated to the remaining contents of the block statement, filtering out any of the variable declarations, and again recursively applying rules.

## Auto assigning class properties

Here's one final one, at the top of the post I showed a transformation rule that auto-assigned the properties of a class based on the constructor parameters.

The rule is probably quite self explanatory now:

~~~ javascript
const parse = code =>
  babel.transform(code).ast.program.body[0];

module.exports = pathRule(
  '.{.type === "ClassMethod" && .kind === "constructor"}',
  (ast, runner) => Object.assign({}, ast, {
    body: {
      type: 'BlockStatement',
      body: ast.params.map(p => parse(`this.${p.name} = ${p.name}`))
        .concat(ast.body.body.map(runner))
    }
  })
);
~~~

With one subtlety, rather than working out the AST required for the code `this.foo = foo`, I thought it was much easier to have babel construct the AST by parsing the JavaScript that I want in the eventual output!

## Conclusions

This has really just been a bit of fun for me - I don't have any plans to turn this into a babel competitor! Hopefully it was fun to read about too?

You can find the [complete code on GitHub](https://github.com/ColinEberhardt/ast-transformation-xslt-style).

Enjoy.
