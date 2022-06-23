---
title: TypeScript compiler APIs revisited
date: 2017-05-02 00:00:00 Z
categories:
- nwolverson
- Tech
tags:
- blog
author: nwolverson
layout: default_post
summary: Two years ago I wrote about TypeScript compiler APIs. There has recently
  been further progress in this area and I explore the newly exposed API in TypeScript
  2.3.
---

Two years ago I [wrote about TypeScript compiler APIs](http://blog.scottlogic.com/2015/01/20/typescript-compiler-api.html). That investigation, and discussions around that blog post and elsewhere pointed to some deficiencies in the exposed API. In particular, constructing a TypeScript AST directly (not from source code) and manipulating the AST, and emitting or pretty-printing TypeScript from an existing AST, were not directly supported. 

I've been following [this Github issue](https://github.com/Microsoft/TypeScript/issues/10786) for some time, and was pleased to hear that TypeScript 2.2 [exposes some AST node factories](https://github.com/Microsoft/TypeScript/pull/13825) and [the AST pretty-printer](https://github.com/Microsoft/TypeScript/pull/13761) and just released 2.3 exposes [a transformation API](https://github.com/Microsoft/TypeScript/pull/13940). That issue has a rather concise example of how to put these pieces together, here I will go through this in a little more depth.

There has recently been further progress in this area and I explore the newly exposed API. Examples available [in this repository](https://github.com/nwolverson/blog-typescript-api/).

Ecosystem update
===
Looking back at that earlier blog post, it was evident that the TypeScript compiler and ecosystem has moved on. Again I was initially in the position of using features that haven't made it into an official TypeScript release yet, but rather than having to build a local distribution of the current TypeScript master, I was able to just `npm install typescript@next` and get a nightly build, to build with or bundle with my demo code.

Various changes have been made to the compiler API, in particular some of the interfaces I discussed before have changed a little, in particular `getNamedDeclarations` is no longer exposed (though you can easily enough search for them with `ts.forEachChild`). 

Despite the restricted API until recently provided by the TypeScript compiler, various projects have made extensive use of the TypeScript compiler API. For example, TSLint rules are [written as TS AST visitors](https://palantir.github.io/tslint/develop/custom-rules/). The [TSTypeInfo library](https://github.com/dsherret/ts-type-info) has provided an AST wrapper for information/manipulation. With the changes in the TypeScript compiler API, 
this is now superseded by [ts-simple-ast](https://github.com/dsherret/ts-simple-ast) which aims to add a convenience layer over the compiler AST (though currently is a work in progress).

## Pretty-printing

A simple thing to start with, but one which enables various other tooling possibilities, a pretty-printer has been exposed to convert a TypeScript API into TypeScript source. This should enable transformation and program generation scenarios:

~~~typescript
import * as ts from 'typescript';
const printer: ts.Printer = ts.createPrinter();
const sourceFile: ts.SourceFile = ts.createSourceFile(
  'test.ts', 'const x  :  number = 42', ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS
);
console.log(printer.printFile(sourceFile))
~~~

Prints

~~~typescript
const x: number = 42;
~~~

As well as `printFile` a `printNode` is available to print particular parts of an AST.

## Node factories
A major limitation previously was that there was no way to construct a TypeScript AST directly, it could only be parsed in from source file. Now factory functions have been exposed for creating (and updating) AST nodes. IntelliSense starting `create` shows the list of options (there are many more on scrolling down):

![ts.create IntelliSense]({{site.baseurl}}/nwolverson/assets/tsc-2/create-complete.png)

Here's an example of creating and printing a TypeScript AST for a simple expression, and printing it out:

~~~typescript
const lit = ts.createAdd(ts.createLiteral(42), ts.createLiteral("foo"));

const sourceFile: ts.SourceFile = 
    ts.createSourceFile('test.ts', '', ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS);
console.log(ts.createPrinter().printNode(ts.EmitHint.Expression, lit, sourceFile) );
~~~

(Note that for some reason a source file is required to print a node, even if not really relevant).

Or as another example, `(x: number) => 42`:

~~~typescript
const lit = ts.createArrowFunction([], [], [
    ts.createParameter([], [], null, 'x', null, ts.createTypeReferenceNode('number', []))
], null, null, ts.createLiteral(42));
~~~

A little verbose, perhaps

## Transforming the AST
The brief example linked earlier hints at the transformation API:

~~~typescript
const result: ts.TransformationResult<ts.SourceFile> = ts.transform(
  sourceFile, [ transformer ]
);

const transformedSourceFile: ts.SourceFile = result.transformed[0];
~~~

But what is a transformer? The type of `ts.transform` is as follows:

~~~typescript
function transform<T extends Node>(source: T | T[],
    transformers: TransformerFactory<T>[],
    compilerOptions?: CompilerOptions): TransformationResult<T>;
type TransformerFactory<T extends Node> =
    (context: TransformationContext) => Transformer<T>;
type Transformer<T extends Node> = (node: T) => T;
~~~

So at the root of it, we have a simple function from `Node` to `Node`. I previously mentioned `ts.forEachChild`, which can be used to build up a traversal of the AST, the sibling `ts.visitEachChild` can be used to build up a traversal modifying the AST.

~~~typescript
function visitEachChild<T extends Node>(node: T,
    visitor: Visitor,
    context: TransformationContext): T;
~~~

The important thing to note here is that `visitEachChild` iterates over the children, but returns us the (possibly updated) node it is called on. First lets build up the stupidest transformer which simply logs the types of nodes it encounters:

~~~typescript
const transformer = <T extends ts.Node>(context: ts.TransformationContext) =>
        (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
        console.log("Visiting " + ts.SyntaxKind[node.kind]);
        return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
};
~~~

If I call this with input `let x = n + 42;` I get the result:

    Visiting SourceFile
    Visiting VariableStatement
    Visiting VariableDeclarationList
    Visiting VariableDeclaration
    Visiting Identifier
    Visiting BinaryExpression
    Visiting Identifier
    Visiting FirstLiteralToken

### Transformation example: constant folding
We'll apply this to a simple tree transformation, eliminating arithmetic expressions on constants to constants, i.e. replacing `2 + 2` with `4`.

~~~typescript
const transformer = <T extends ts.Node>(context: ts.TransformationContext) =>
        (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            const binary = node as ts.BinaryExpression;
            if (binary.left.kind === ts.SyntaxKind.NumericLiteral
              && binary.right.kind === ts.SyntaxKind.NumericLiteral) {
                const left = binary.left as ts.NumericLiteral;
                const leftVal = parseFloat(left.text);
                const right = binary.right as ts.NumericLiteral;
                const rightVal = parseFloat(right.text);
                if (binary.operatorToken.kind === ts.SyntaxKind.PlusToken) {
                    return ts.createLiteral(leftVal + rightVal);
                }
            }
        }
        return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
};
~~~

This seems to work! When run with input `var x = 2 + 2;`, it outputs `var x = 4;`. However, when run with `var x = 1 + 2 + 3`, it outputs `var x = 3 + 3;`. Run it a second time and it would simplify again, but what we want is a bottom-up recursive traversal. The fix is simple, first we transform the node by visiting the children, then construct the results (also catering for another couple of cases):

~~~typescript
const transformer = <T extends ts.Node>(context: ts.TransformationContext) =>
        (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
        node = ts.visitEachChild(node, visit, context);
        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            const binary = node as ts.BinaryExpression;
            if (binary.left.kind === ts.SyntaxKind.NumericLiteral
              && binary.right.kind === ts.SyntaxKind.NumericLiteral) {
                const left = binary.left as ts.NumericLiteral;
                const leftVal = parseFloat(left.text);
                const right = binary.right as ts.NumericLiteral;
                const rightVal = parseFloat(right.text);
                switch (binary.operatorToken.kind) {
                    case ts.SyntaxKind.PlusToken:
                        return ts.createLiteral(leftVal + rightVal);
                    case ts.SyntaxKind.AsteriskToken:
                        return ts.createLiteral(leftVal * rightVal);
                    case ts.SyntaxKind.MinusToken:
                        return ts.createLiteral(leftVal - rightVal);
                }
            }
        }
        return node;
    }
    return ts.visitNode(rootNode, visit);
};
~~~

I wish I could say I gave the earlier example for pedagogical purposes, but I really did fall into this trap.

### Putting it together

Transformations can be [plugged in in a few places](https://github.com/Microsoft/TypeScript/pull/13940), the `transform` method used above gives a simple API for operating on nodes (which might not even typecheck), but transformations can also be plugged into the `emit` process. There are also some subtleties to understand around the transforms API, for example `onSubstituteNode`:

> This hook provides just-in-time substitution during the final print phase, and is primarily used to substitute a relatively small subset of nodes to avoid an expensive full walk of the tree during every transformation

## Last words

I'd very much like to be able to generate a `.d.ts` file, declarations generated according to some external data source. Currently it seems this [is not supported](https://github.com/Microsoft/TypeScript/pull/13940#issuecomment-295033796) via this API; the [dts-dom](https://github.com/RyanCavanaugh/dts-dom) library gives a way to generate `.d.ts` files.

Examples above, and an updated version of the in-memory `CompilerHost` which can be useful in playing around with these APIs, are available [in this github repo](https://github.com/nwolverson/blog-typescript-api/).