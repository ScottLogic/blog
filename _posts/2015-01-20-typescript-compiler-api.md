---
title: Investigating TypeScript compiler APIs
date: 2015-01-20 00:00:00 Z
categories:
- nwolverson
- Tech
tags:
- blog
- featured
author: nwolverson
image: nwolverson/assets/featured/compiler.jpg
image-attribution: image courtesy of <a href='https://www.flickr.com/photos/stvan4245/'>KāSteve</a>
layout: default_post
summary: 'TypeScript 1.4 was released last Friday, bringing union types, type aliases,
  and some ES6-related features. It also brought a new compiler and language services
  API to facilitate better tool support. Here I''ll give a brief introduction with
  some pointers on places to get started.

'
oldlink: http://www.scottlogic.com/blog/2015/01/20/typescript-compiler-api.html
disqus-id: "/2015/01/20/typescript-compiler-api.html"
---

<script src="{{ site.baseurl }}/nwolverson/assets/tsc/highlight.pack.js"> </script>

<style type="text/css">
    @import url("{{ site.baseurl }}/nwolverson/assets/tsc/snippets.css");
    @import url("{{ site.baseurl }}/nwolverson/assets/tsc/vs.css");
    @import url("{{ site.baseurl }}/nwolverson/assets/tsc/tsblog.css");
    <!-- -->
</style>

<script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
  crossorigin="anonymous">
</script>


<script type="application/javascript">
    hljs.initHighlightingOnLoad();
</script>
<script src="{{ site.baseurl }}/nwolverson/assets/tsc/tips.js">
</script>
<script src="{{ site.baseurl }}/nwolverson/assets/tsc/typescriptServices.js">
</script>
<script src="{{ site.baseurl }}/nwolverson/assets/tsc/blog.js">
</script>


TypeScript 1.4 was released last Friday, bringing union types, type aliases, and some ES6-related features. It also brought a new compiler and language services API to
facilitate better tool support. I spent some time playing with this new API in the last month or so, and found it somewhat hard to get started with
the existing documentation but fairly straightforward once you get going. Here I'll give a brief introduction with  some pointers on places to get started.

#### Goal
At some point last year I wanted to write some TypeScript in a web page, so I looked for a way of generating some nice syntax-highlighted markup. As I was interested in the types involved, I wanted something a bit more than your regular syntax-highlighter, but actually to display the types involved (even when inferred). [FSSnip](http://www.fssnip.net/) gives a good example of this for `F#` (live example, mouse over an identifier):

<pre class="fssnip">
<span class="l">1: </span><span class="c">//</span><span class="c"> </span><span class="c">calculates</span><span class="c"> </span><span class="c">the</span><span class="c"> </span><span class="c">factorial:</span>
<span class="l">2: </span><span class="c">//</span><span class="c"> </span><span class="c">n!</span><span class="c"> </span><span class="c">=</span><span class="c"> </span><span class="c">1</span><span class="c"> </span><span class="c">*</span><span class="c"> </span><span class="c">2</span><span class="c"> </span><span class="c">*</span><span class="c"> </span><span class="c">3</span><span class="c"> </span><span class="c">*</span><span class="c"> </span><span class="c">...</span><span class="c"> </span><span class="c">*</span><span class="c"> </span><span class="c">n</span>
<span class="l">3: </span><span class="c">//</span><span class="c"> </span><span class="c">the</span><span class="c"> </span><span class="c">factorial</span><span class="c"> </span><span class="c">only</span><span class="c"> </span><span class="c">exists</span><span class="c"> </span><span class="c">for</span><span class="c"> </span><span class="c">positive</span><span class="c"> </span><span class="c">integers</span>
<span class="l">4: </span><span class="k">let</span> <span class="k">rec</span> <span onmouseout="hideTip(event, 'fst1', 1)" onmouseover="showTip(event, 'fst1', 1)" class="i">factorial</span> <span onmouseout="hideTip(event, 'fst2', 2)" onmouseover="showTip(event, 'fst2', 2)" class="i">n</span> <span class="o">=</span>
<span class="l">5: </span>    <span class="k">match</span> <span onmouseout="hideTip(event, 'fst2', 3)" onmouseover="showTip(event, 'fst2', 3)" class="i">n</span> <span class="k">with</span>
<span class="l">6: </span>    | <span class="n">0</span> | <span class="n">1</span> <span class="k">-&gt;</span> <span class="n">1</span>
<span class="l">7: </span>    | _ <span class="k">-&gt;</span> <span onmouseout="hideTip(event, 'fst2', 4)" onmouseover="showTip(event, 'fst2', 4)" class="i">n</span> <span class="o">*</span> <span onmouseout="hideTip(event, 'fst1', 5)" onmouseover="showTip(event, 'fst1', 5)" class="i">factorial</span> (<span onmouseout="hideTip(event, 'fst2', 6)" onmouseover="showTip(event, 'fst2', 6)" class="i">n</span> <span class="o">-</span> <span class="n">1</span>)</pre>

<!-- HTML code for ToolTips -->
<div class="tip" id="fst1">val factorial : int -&gt; int<br /><br />Full name: Test.factorial<br /></div>
<div class="tip" id="fst2">val n : int<br /><br />&#160;&#160;type: int<br />&#160;&#160;implements: System.IComparable<br />&#160;&#160;implements: System.IFormattable<br />&#160;&#160;implements: System.IConvertible<br />&#160;&#160;implements: System.IComparable&lt;int&gt;<br />&#160;&#160;implements: System.IEquatable&lt;int&gt;<br />&#160;&#160;inherits: System.ValueType<br /></div>

![Tooltip screenshot]({{site.baseurl}}/nwolverson/assets/tsc/fs-tooltip.png) Tooltip appearing on mouseover.

A basic implementation of the tooltip type-display idea is available [on my github](https://github.com/nwolverson/tstooltip), but for the purpose of this blog we will simplify the goal to get a list of identifiers and types in a sample program. Another notable simplification is that that project makes use of web workers to perform the actual parsing - running the TypeScript compiler in the browser can be slow and will lock up the page.

The end result is something like the following (live example, mouse over an identifier):

<pre><code class="nohighlight"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title"><span class="ts-typeinfo" title="factorial: (n: number) => number">factorial</span></span><span class="hljs-params">(<span class="ts-typeinfo" title="n: number">n</span>: number)</span> : <span class="hljs-title">number</span> </span>{
    <span class="hljs-keyword">switch</span> (<span class="ts-typeinfo" title="n: number">n</span>) {
        <span class="hljs-keyword">case</span> <span class="hljs-number">0</span>:
        <span class="hljs-keyword">case</span> <span class="hljs-number">1</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-number">1</span>;
        <span class="hljs-keyword">default</span>:
            <span class="hljs-keyword">return</span> <span class="ts-typeinfo" title="n: number">n</span> * <span class="ts-typeinfo" title="factorial: (n: number) => number">factorial</span>(<span class="ts-typeinfo" title="n: number">n</span> - <span class="hljs-number">1</span>);
    }
}</code></pre>

![Tooltip screenshot]({{site.baseurl}}/nwolverson/assets/tsc/ts-tooltip.png) Tooltip appearing on mouseover.

#### Getting Started
The APIs described here are part of the TypeScript compiler 1.4 release, which you can grab from [npm](https://www.npmjs.com/package/typescript) or [with VS tools](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.TypeScript14forVisualStudio2013-13057).
The TypeScript 1.4 compiler version is required for the runtime services and corresponding definition file,
but in order to compile these examples the latest compiler is also required, as the definition files make use of TypeScript 1.4 features.

For reference, [TypeScript official API docs](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API).

#### Language Service API

The Language Service API is a wrapper on top of the TypeScript compiler APIs intended for editor support (e.g. code completion). It provides the following API:

    interface LanguageService {
        cleanupSemanticCache(): void;
        getSyntacticDiagnostics(fileName: string): Diagnostic[];
        getSemanticDiagnostics(fileName: string): Diagnostic[];
        getCompilerOptionsDiagnostics(): Diagnostic[];
        getSyntacticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
        getSemanticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
        getCompletionsAtPosition(fileName: string, position: number): CompletionInfo;
        getCompletionEntryDetails(fileName: string, position: number, entryName: string): CompletionEntryDetails;
        getQuickInfoAtPosition(fileName: string, position: number): QuickInfo;
        getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): TextSpan;
        getBreakpointStatementAtPosition(fileName: string, position: number): TextSpan;
        getSignatureHelpItems(fileName: string, position: number): SignatureHelpItems;
        getRenameInfo(fileName: string, position: number): RenameInfo;
        findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean): RenameLocation[];
        getDefinitionAtPosition(fileName: string, position: number): DefinitionInfo[];
        getReferencesAtPosition(fileName: string, position: number): ReferenceEntry[];
        getOccurrencesAtPosition(fileName: string, position: number): ReferenceEntry[];
        getNavigateToItems(searchValue: string): NavigateToItem[];
        getNavigationBarItems(fileName: string): NavigationBarItem[];
        getOutliningSpans(fileName: string): OutliningSpan[];
        getTodoComments(fileName: string, descriptors: TodoCommentDescriptor[]): TodoComment[];
        getBraceMatchingAtPosition(fileName: string, position: number): TextSpan[];
        getIndentationAtPosition(fileName: string, position: number, options: EditorOptions): number;
        getFormattingEditsForRange(fileName: string, start: number, end: number, options: FormatCodeOptions): TextChange[];
        getFormattingEditsForDocument(fileName: string, options: FormatCodeOptions): TextChange[];
        getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions): TextChange[];
        getEmitOutput(fileName: string): EmitOutput;
        getSourceFile(filename: string): SourceFile;
        dispose(): void;
    }

As can be seen there are many methods centered around giving information at a particular source code location, e.g. for completion, navigation, "quick info", as
well as for generating the compiled output, getting diagnostics, etc. So how do we get hold of a `LanguageService` instance? The interface between the language service and the environment is defined by the `LanguageServiceHost` API as below:

    interface Logger {
        log(s: string): void;
        trace(s: string): void;
        error(s: string): void;
    }
    interface LanguageServiceHost extends Logger {
        getCompilationSettings(): CompilerOptions;
        getScriptFileNames(): string[];
        getScriptVersion(fileName: string): string;
        getScriptIsOpen(fileName: string): boolean;
        getScriptSnapshot(fileName: string): IScriptSnapshot;
        getLocalizedDiagnosticMessages?(): any;
        getCancellationToken?(): CancellationToken;
        getCurrentDirectory(): string;
        getDefaultLibFilename(options: CompilerOptions): string;
    }

We can implement this to feed in source text directly for analysis. The host API is file-centric, primarily based upon the needs of an IDE which will have multiple versions of one file with small changes as editing takes place, but here we will just create a simple file wrapper to our input text. An implementation of the host with basic storage of text as "files" in memory:

    class MyLanguageServiceHost implements ts.LanguageServiceHost {
        files: { [fileName: string]: { file: ts.IScriptSnapshot; ver: number } } = {}

        log = _ => { };
        trace = _ => { };
        error = _ => { };
        getCompilationSettings = ts.getDefaultCompilerOptions;
        getScriptIsOpen = _ => true;
        getCurrentDirectory = () => "";
        getDefaultLibFilename = _ => "lib";

        getScriptVersion = fileName => this.files[fileName].ver.toString();
        getScriptSnapshot = fileName => this.files[fileName].file;

        getScriptFileNames(): string[] {
            var names: string[] = [];
            for (var name in this.files) {
                if (this.files.hasOwnProperty(name)) {
                    names.push(name);
                }
            }
            return names;
        }

        addFile(fileName: string, body: string) {
            var snap = ts.ScriptSnapshot.fromString(body);
            snap.getChangeRange = _ => undefined;
            var existing = this.files[fileName];
            if (existing) {
                this.files[fileName].ver++;
                this.files[fileName].file = snap
              } else {
                this.files[fileName] = { ver: 1, file: snap };
            }
        }
    }

We can then make use of this to make some simple analyses. Omitting the code to load `lib.d.ts` as required reference, here is what is required to get the actual compiler output:

    var host = new MyLanguageServiceHost();
    var languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
    host.addFile("script.ts", text);
    var output = languageService.getEmitOutput("script.ts").outputFiles[0].text;

Demo (feel free to edit - but note there's no error checking, code may be emitted even for bad input):

<div id="ex1">
        <textarea rows="5" cols="80">class c {
    f = (n : number) => n * 2;
}</textarea>
        <button>Translate</button>
        <pre></pre>
</div>

Or to get matching brace position:

    var braces = languageService.getBraceMatchingAtPosition("script.ts", text.indexOf("{"));
    var matchingPos = braces[1].start;

Demo (Move cursor to the left of brackets to show matching pairs):

<div id="ex2">
<pre><code class="nohighlight" id="highlightDiv"> </code></pre>
<textarea >
function test() {
    var x = ({ y: { z: () => { return ((1 + 3) * 5) / 2; } } }.y)
}
</textarea>
</div>

Or "quick info", ie tooltip info about an identifier. Unfortunately this is rather pre-processed and textual in nature:

    var info = languageService.getQuickInfoAtPosition("script.ts", 10);
    var text = info.displayParts.map(x =>x.text).join("");

Demo:

<div id="ex3">
    <textarea rows="5" cols="80">var x = [1].map(z => [z, z])</textarea>
    <label>Identifier name: <input type="text" id="identifiername" value="x"/></label>
    <button>Show info</button>
    <pre></pre>
</div>

#### Compiler API

Rather than using the language service layer we can use the compiler API a little more directly. The host interface we have to implement is `CompilerHost`:

    interface CompilerHost {
        getSourceFile(filename: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile;
        getDefaultLibFilename(options: CompilerOptions): string;
        getCancellationToken?(): CancellationToken;
        writeFile(filename: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void): void;
        getCurrentDirectory(): string;
        getCanonicalFileName(fileName: string): string;
        useCaseSensitiveFileNames(): boolean;
        getNewLine(): string;
    }

This is even easier for us than the above, as it shares a number of members but others can be omitted. Extending the class we defined above to do both, we have:

    class MyCompilerHost extends MyLanguageServiceHost implements ts.CompilerHost {
        getSourceFile(filename: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile {
            var f = this.files[filename];
            if (!f) return null;
            var sourceFile = ts.createLanguageServiceSourceFile(filename, f.file, ts.ScriptTarget.ES5, f.ver.toString(), true, false);
            return sourceFile;
        }
        writeFile(filename: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void): void {
        }
        getCanonicalFileName = (fileName: string) => fileName;
        useCaseSensitiveFileNames = () => true;
        getNewLine = () => "\n";
    }

Having done that, we create a `Program` instance and obtain a `TypeChecker`:

    var program = ts.createProgram([scriptName], host.getCompilationSettings(), host);
    var typeChecker = program.getTypeChecker(true);

This lets us easily get the types of a program's declarations:

    var decls = sf.getNamedDeclarations().map(nd => nd.symbol.name + ": " +
        typeChecker.typeToString(typeChecker.getTypeAtLocation(nd)));

Demo:

<div id="ex4">
    <textarea rows="5" cols="80">class c {
    x = 42;
    f = (n: number) => n + this.x;
    log = console.log;
}</textarea>
    <button>Show Declarations</button>
    <pre></pre>
</div>

How about all identifiers? Well there's no dedicated way to do this, what we can do is iterate over the tree. The tree `Node` interface
is perhaps a little awkward for this, the compiler provides us a utility function `ts.forEachChild`. Here we do a quick and dirty accumulation
of all nodes:

<pre><code class="typescript">function getNodes(sf: ts.SourceFile): ts.Node[] {
    var nodes: ts.Node[] = [];
    function allNodes(n: ts.Node) {
        ts.forEachChild(n, n => { nodes.push(n); allNodes(n); return false; })
    };
    allNodes(sf);
    return nodes;
}</code></pre>

Then fetch identifier nodes and again get their types:

    var idNodes = getNodes(sf).filter(n => n.kind === ts.SyntaxKind.Identifier);
    var typed = idNodes.map(n => (<ts.Identifier>n).text + ": " + typeChecker.getTypeAtLocation(n));

Demo:

<div id="ex5">
    <textarea rows="5" cols="80">class c {
    x = 42;
    f = (n: number) => n + this.x;
}</textarea>
    <button>Show Identifiers</button>
    <pre></pre>
</div>

#### Final Words
I've enjoyed integrating with the TypeScript compiler/language services, and the API seems to be improving from when I first looked at it. I hope there is
a little useful information here to get you started, or perhaps provide a little inspiration to have a go.

After I started writing this post, an example was posted of using the Language Service to [reformat TypeScript code](http://blog.ctaggart.com/2015/01/format-typescript-with-v14-language.html), it can be seen that the in-memory language service there turns out very similar to mine (i.e. do as little as possible).
[TypeScript official API docs](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API) are also a useful reference.
