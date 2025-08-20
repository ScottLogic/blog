---
title: Developing a Custom Query Language with ANTLR and Elasticsearch
date: 2025-08-20 00:00:00 Z
categories:
- Tech
tags:
- elasticsearch
- antlr
author: jjgray
layout: default_post
summary: Learn how to build a custom, user-friendly search language using ANTLR and
  Elasticsearch. We'll cover grammar design, query parsing, and indexing techniques
  to turn plain user input into powerful search results.
---

<script src="https://unpkg.com/mermaid@11.9.0/dist/mermaid.min.js"></script>

Searching through large datasets is a core challenge for many applications. User experience depends on how intuitive and powerful your search functionality is, so it's crucial to get it right. While mature query languages like SQL and GraphQL offer flexibility, they can be daunting for non-technical users. On the other hand, simple UI-based filters such as dropdowns may feel restrictive, especially when searching free text, such as the content of a news article. What if you could offer users a search experience that's both approachable and expressive? [Google's advanced search operators](https://www.google.com/advanced_search) are perhaps the most well known example, allowing for powerful searches such as `"find these exact words" OR this -but -not -others`.

We'll explore how to design and implement a custom query language using [ANTLR](https://www.antlr.org/) for lexing and parsing and [Elasticsearch](https://www.elastic.co/elasticsearch) for fast, flexible search. We'll walk through the process step-by-step, from preparing your data to building a grammar and translating user queries into Elasticsearch requests. Let's explore a naive implementation of such a language with the aim to build a robust and extensible solution.

## Step 1: Prepare your content for search

To build a query language we need a database capable of storing and searching both structured and unstructured data. Structured data includes fields like the publication date of an article, while unstructured data is missing a clear format, such as the text content of the article. For this, we'll use [Elasticsearch](https://www.elastic.co/elasticsearch). Elasticsearch is an open source, distributed search and analytics engine. It's well-suited for our needs as we'll be taking advantage of its powerful indexing and search capabilities. Elasticsearch isn't designed to be a database and doesn't support ACID operations or transactions. In a real-world production environment, it's common to have a separate database that acts as the primary source of truth and to use Elasticsearch as a secondary store optimised for search and analytics. For the purposes of this post, we'll keep things simple and focus solely on Elasticsearch, omitting the additional complexity of integrating another database.

Elasticsearch organises data using inverted indexes. A traditional forward index (or primary index) maps document identifiers to tokens, which correspond to small, searchable fragments of text, e.g. words. Forward indexes allow for efficient indexing but relatively inefficient searching on anything other than the document ID. In our context, this could be mapping from news article IDs to the tokens contained in the article, a useful tool if we need to quickly find all of the tokens in a given article.

<pre class="mermaid" style="text-align:center">
---
config:
  theme: base
  themeVariables:
    fontFamily: 'Menlo, Monaco, Consolas, Courier New, monospace'
  flowchart:
    curve: 'step'
---
flowchart LR

id1[1] ==> the1[the] === dog[dog]
id2[2] ==> the2[the] === cat1[cat]
id3[3] ==> the3[the] === black[black] === cat2[cat]

class id1,id2,id3 id
class the1,the2,the3,dog,cat1,black,cat2 document

classDef id fill:#f9cae0,stroke:#f495c0,stroke-width:4px
classDef document fill:#d1f3f5,stroke:#a4e6ea,stroke-width:4px

linkStyle default stroke:#c41565
</pre>

In contrast, an inverted index (or secondary index) maps from tokens to document identifiers and is optimised for searching based on tokens. Secondary indices are commonly found in other database platforms but the implementation in Elasticsearch (which utilises [the underlying Lucene engine](https://lucene.apache.org/)) is particularly well-suited to text search. If we want to find documents with the token `dog`, it's as simple as looking in the inverted index. This approach enables efficient searching, especially for free-text queries with many tokens.

<pre class="mermaid" style="text-align:center">
---
config:
  theme: base
  themeVariables:
    fontFamily: 'Menlo, Monaco, Consolas, Courier New, monospace'
  flowchart:
    curve: 'step'
---
flowchart LR

the4[the] ==> id1_1[1] === id2_1[2] === id3_1[3]
dog2[dog] ==> id1_2[1]
cat3[cat] ==> id2_2[2] === id3_2[3]
black2[black] ==> id3_3[3]

class the4,dog2,cat3,black2 token
class id1_1,id1_2,id2_1,id2_2,id3_1,id3_2,id3_3 id

classDef id fill:#f9cae0,stroke:#f495c0,stroke-width:4px
classDef token fill:#cce7bf,stroke:#b2db9f,stroke-width:4px

linkStyle default stroke:#c41565
</pre>

Elasticsearch lets you control how it builds inverted indexes using [mappings](https://www.elastic.co/docs/manage-data/data-store/mapping), which tell Elasticsearch how to break up your data into tokens. You can set up different mappings for each field. This means you can search for exact matches or similar words, depending on your needs. For example, one mapping might only match the word `climbing`, while another could also match related words like `climb` or `climber`.

A mapping usually includes:

1. The field in your data (like a title or description)
2. A name for the mapping
3. The type of data (such as date, text, or [one of the many that are supported](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/field-data-types))
4. An analyser, which decides how to split and process the text into tokens

These analysers allow for huge customisation over how Elasticsearch processes data. You can [define a custom analyser](https://www.elastic.co/docs/manage-data/data-store/text-analysis/create-custom-analyzer) and use it in one of your mappings. This can be useful for normalising text to make it easier to search on.

In our news article example, we could create a custom analyser for our search. This will be a fairly generic analyser, allowing for generalist search against the text:

1. Begin with a whitespace tokeniser, that splits text into tokens at any whitespace character.
2. Apply normalisation strategies to the tokens, such as capitalisation and the simplification of plurals and equivalent words.
3. Use a stop token filter to remove any words we consider unimportant.

Elasticsearch offers extensive tooling for building your own custom analysers, such as [predefined language analysers](https://www.elastic.co/docs/reference/text-analysis/analysis-lang-analyzer) and predefined analyser components, like [this list of English-language stop tokens](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/java/org/apache/lucene/analysis/en/EnglishAnalyzer.java#L39-L53).

<pre class="mermaid" style="text-align:center">
---
config:
  theme: base
  themeVariables:
    fontFamily: 'Menlo, Monaco, Consolas, Courier New, monospace'
  flowchart:
    curve: 'step'
---
flowchart TD

wholeSentence[The Bristol office chairs]

subgraph tier1[" "]
    direction LR
    the5[The] ~~~ bristol1[Bristol] ~~~ office1[office] ~~~ chairs1[chairs]
end

subgraph tier2[" "]
    direction LR
    the6[the] ~~~ bristol2[bristol] ~~~ office2[office] ~~~ chair1[chair]
end

subgraph tier3[" "]
    direction LR
    bristol3[bristol] ~~~ office3[office] ~~~ chair2[chair]
end

wholeSentence ==>|Tokenisation| tier1
tier1 ==>|Normalisation| tier2
tier2 ==>|Filtering| tier3

class wholeSentence,the5,the6,bristol1,bristol2,bristol3,office1,office2,office3,chairs1,chair1,chair2 words

classDef words fill:#d1f3f5,stroke:#a4e6ea,stroke-width:4px

linkStyle default stroke:#c41565
</pre>

## Step 2: Prepare your user's input for search

Now that we have a means to store and search on our data, how should our search behave? It's up to us to define how words, whitespace and symbols can be combined into a functional search language. 

Let's consider whitespace - how do we treat queries with words separated by whitespace? One approach would be to perform an `AND` operation, which would only match documents containing all the specified tokens. The search query `bristol office chair` would get parsed like so.

<pre style="text-align:center">
<code><u>bristol</u> AND <u>office</u> AND <u>chair</u></code>
</pre>

Alternatively, we could use an `OR` operation that would require one or more of the search tokens to be present. We likely care more about documents that have more of our specified terms. We can add scoring rules so that search results are scored based on how many of the terms they match. Higher scores are shown higher in the search results. In this way, `OR` is more flexible than `AND` and is often the more desirable approach.

<pre style="text-align:center">
<code><u>bristol</u> OR <u>office</u> OR <u>chair</u></code>
</pre>

Translating simple queries like this into [Elasticsearch's Query DSL language](https://www.elastic.co/docs/explore-analyze/query-filter/languages/querydsl) is straightforward. We use a [match query](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-match-query) and specify that we want to perform an 'OR' across the generated tokens. These tokens are produced by Elasticsearch's inbuilt [English language analyser](https://www.elastic.co/docs/reference/text-analysis/analysis-lang-analyzer), which handles tokenisation, normalisation, and filtering. The search is then applied to the `my_field` field in our source data.

~~~json
{
  "query": {
    "match": {
      "my_field": "The Bristol office chairs",
      "analyzer": "english",
      "operator": "OR",
    }
  },
  "fields": ["my_field"],
  "from": 0,
  "size": 20
}
~~~

When it comes to adding search operators to these Elasticsearch queries, we might end up with a query such as `hello "world" –programming`, which roughly translates to the following Elasticsearch query utilising the [boolean query](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-bool-query).

~~~json
{
  "query": {
    "bool": {
      "should": { "term": { "my_field": "hello" }},
      "must": { "term": { "my_field": "world" }},
      "must_not": { "term": { "my_field": "programming" }}
    }
  },
  "fields": ["my_field"],
  "from": 0,
  "size": 20
}
~~~

### Converting from plaintext to Elasticsearch queries

While, for these trivial examples, it may be obvious how we could programmatically convert from plaintext to a structured query, designing a solution for more complex examples, and ensuring that solution is testable and extensible, is more of a challenge.

My very first thought when coming to this problem was *'I can use a regex for that'*. And yes, I probably could have, at least for a simple grammar like this. But most naive approaches such as regex start to fall over for non-trivial grammars. Grammars often need an order of precedence of their operators, or they might require nesting of operators using brackets. Imagine trying to parse the following with regex, I wouldn't envy you!

<pre style="text-align:center">
<code>(cat OR dog) AND (bird AND "elephant seal")</code>
</pre>

[ANother Tool for Language Recognition, ANTLR](https://www.antlr.org/), offers itself as a solution to this problem. ANTLR is an open-source tool for parsing input text into an [abstract syntax tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree). You create a grammar file in ANTLR's proprietary syntax that defines a set of rules determining how the structured language is constructed. Then, supply this grammar and some source text and ANTLR will parse it into an AST for you. There are many code clients available including one for C# that we'll be using.

A basic grammar supporting `"` and `-` operators is given in the following example. It begins with a name for the grammar, followed by a series of [lexer rules](https://github.com/antlr/antlr4/blob/dev/doc/lexer-rules.md) and [parser rules](https://github.com/antlr/antlr4/blob/dev/doc/parser-rules.md).

~~~
grammar MyCustomQueryLanguage;

/* Parser Rules */

query: expression EOF                            # Query;

expression:
  KEYWORD
  | MINUS expression                             # MinusOperator
  | PHRASE KEYWORD PHRASE                        # PhraseOperator
  | Left=expression WHITESPACE Right=expression  # WhitespaceOperator;

/* Lexer Rules */

KEYWORD: ~["-]+;
PHRASE: '"';
MINUS: '-';
WHITESPACE: [ ]+;
~~~

ANTLR will start by using the lexer rules to transform the input string into a sequence of tokens. It does this by repeatedly matching the longest token possible until it has consumed the entire input, backtracking if necessary. In our example, these are the `KEYWORD`, `PHRASE`, `MINUS`, and `WHITESPACE` tokens.

After that, ANTLR uses the parser rules to combine these tokens. These are structural rules showing how we can combine tokens to form valid expressions. In our example, we declare a top level expression called `query`, which will match any valid `expression` followed by an end of input marker. The `expression` itself can take multiple forms, which are themselves constructions of other tokens and expressions. Below is an example of the evaluation of these parsing rules to form an AST.

<pre class="mermaid" style="text-align:center">
---
config:
  theme: base
  themeVariables:
    fontFamily: 'Menlo, Monaco, Consolas, Courier New, monospace'
---
flowchart TB

A["`Hello#nbsp;#quot;world#quot;#nbsp;#minus;programming`"]

subgraph S1[" "]
  direction LR
  B["KEYWORD"]
  C["WHITESPACE"]
  D["PHRASE"]
  E["KEYWORD"]
  F["PHRASE"]
  G["WHITESPACE"]
  H["MINUS"]
  I["KEYWORD"]
  J["EOF"]
end

subgraph S2[" "]
  direction LR
  K["expression"]
  L["WHITESPACE"]
  M["expression"]
  N["WHITESPACE"]
  O["expression"]
  P["EOF"]
end

subgraph S3[" "]
  direction LR
  Q["expression"]
  R["WHITESPACE"]
  S["expression"]
  T["EOF"]
end

subgraph S4[" "]
  direction LR
  U["expression"]
  V["EOF"]
end

subgraph S5[" "]
  direction LR
  W["query"]
end

A ===  B & C & D & E & F & G & H & I & J

B === K
C === L
D & E & F === M
G === N
H & I === O
J === P

K & L & M === Q
N === R
O === S
P === T

Q & R & S === U
T === V

U === W
V === W

class A source
class B,C,D,E,F,G,H,I,J,L,N,P,R,T,V token
class K,M,O,Q,S,U,W expression

classDef source fill:#cce7bf,stroke:#b2db9f,stroke-width:4px
classDef token fill:#f9cae0,stroke:#f495c0,stroke-width:4px
classDef expression fill:#d1f3f5,stroke:#a4e6ea,stroke-width:4px

linkStyle default stroke:#c41565
</pre>

## Step 3: Perform the search

Now that we have an ANTLR grammar, we need to write some code that uses this grammar to generate an Elasticsearch query. For the purpose of this example, we'll be using C#, as it has relatively mature and stable implementations of both Elasticsearch and ANTLR clients. That said, the concepts and approaches described here are broadly applicable to any implementation and most major programming languages offer robust Elasticsearch clients and ANTLR integrations, so you could easily adapt the examples to suit your preferred technology stack.

For the ANTLR C# client generator, there are some fairly rigid steps we need to take in order to get our search query parsed. I'll give a brief overview here, but can recommend [Gabrielle Tomassetti's fantastic collection of resources](https://tomassetti.me/getting-started-with-antlr-in-csharp/) that go into a lot more depth as to how this all works.

1. Start by running the [ANTLR codegen tool](https://github.com/antlr/antlr4/tree/master/runtime/CSharp/src) against your grammar file to generate C# code. Perhaps the simplest way to do this is by using [ANTLR's example Dockerfile](https://github.com/antlr/antlr4/tree/master/docker), and specifying C# as the output language. This will generate code for parsing text into an AST and code for traversing the AST.
2. Implement one of the interfaces that the codegen tool provides. We need to implement the visitor (as opposed to the listener), as this will allow us to return a value (an Elasticsearch query) once we've traversed the whole AST. Gabrielle's blog has [a great explainer of this distinction](https://tomassetti.me/listeners-and-visitors/), if you're interested.
3. Call the ANTLR client from your C# code
    1. Pass in your user's search input
    2. Receive your Elasticsearch query as an output
    3. Submit this query to Elasticsearch
    4. Return the results to your user

Below is an example implementation of such an interface, showing us implementing the `MyCustomQueryLanguageVisitor<>` that ANTLR has generated. Only some of the methods are shown, but the premise is that there is one method for each node type in the AST (these correspond to the parser rules). When we visit a node, we recursively calculate the Elasticsearch query for all of the child nodes by making calls to `Visit()`, a method that ANTLR provides for us.

~~~csharp
// 'Query' is an Elasticsearch type representing a database query
public class MyVisitor : MyCustomQueryLanguageVisitor<Query>
{
  // We could implement this to match multiple fields if we wanted,
  // or have operators that only apply to certain fields
  public static readonly Field Field = new Field("my_field");

  public override Query VisitQuery(QueryContext context)
  {
    return Visit(context.expression());
  }

  public override Query VisitKeyword(KeywordContext context)
  {
    return new TermQuery() { Field = Field, Value = context.value.Text };
  }

  // We can easily handle recursion by labelling the arguments in our
  // ANTLR grammar. Here I’ve imagined calling them 'Left' and 'Right'
  public override IExpression VisitWhitespaceOperator(WhitespaceOperatorContext context)
  {
    return new BoolQuery()
    {
      Field = Field,
      Should = [Visit(context.Left), Visit(context.Right)],
    };
  }

  ...
}
~~~

With a little more code, we can then instantiate our implementation of the interface and use it to convert from the AST that ANTLR generates to an Elasticsearch query.

~~~csharp
var inputText = "hello \"world\" -programming";

// Perform the lexing of text into tokens
var inputStream = new AntlrInputStream(inputText);
var lexer = new MyCustomQueryLanguageLexer(inputStream);
var commonTokenStream = new CommonTokenStream(lexer);

// Perform the parsing of tokens into an AST
var parser = new MyCustomQueryLanguageParser(commonTokenStream);
var queryContext = parser.query();

// Visit the AST and return the Elasticsearch query
var visitor = new MyVisitor();
var query = visitor.Visit(queryContext);

/// Make the Elasticsearch query
var elasticsearchClient = new ElasticsearchClient(...);
var elasticsearchResponse = await elasticsearchClient.SearchAsync<MyDoc>(s => s
    .Index("my_index")
    .From(0)
    .Size(10)
    .Query(query)
);
~~~

In a production setup, you'd likely want to add some safeguards around this code. To start, Elasticsearch's Query DSL uses JSON to make queries. Internally,  Elasticsearch's JSON serialiser [is limited to a JSON nesting depth of 64](https://discuss.elastic.co/t/the-maximum-configured-depth-of-64-has-been-exceeded-cannot-read-next-json-object/378954), which means that if a user constructs a complex enough query such as `A AND B AND C AND ... AND Y AND Z` and we produce an unbalanced AST (as ANTLR will by default), then this depth can easily be exceeded. For most queries using boolean operators it's relatively easy to balance the AST or optimise the tree structure to remove this unnecessary nesting, for more advanced operators this may be more of a challenge.

<pre class="mermaid" style="text-align:center">
---
config:
  theme: base
  themeVariables:
    fontFamily: 'Menlo, Monaco, Consolas, Courier New, monospace'
---
flowchart LR

subgraph unbalanced["An unbalanced AST"]
  direction TB

  and1[AND]

  and2[AND]
  letterZ1[Z]

  and3[AND]
  letterY1[Y]

  and4[AND]
  letterC1[C]

  letterA1[A]
  letterB1[B]

  and1 ==> and2 & letterZ1
  and2 ==>|...| and3
  and2 ==> letterY1
  and3 ==> and4 & letterC1
  and4 ==> letterA1 & letterB1
end

subgraph balanced["A more balanced AST"]
  direction TB

  and5[AND]
  letterA2[A]
  letterB2[B]
  letterC2[C]
  ellipsis@{ shape: text, label: "..." }
  letterY2[Y]
  letterZ2[Z]

  and5 ==> letterA2 & letterB2 & letterC2 & ellipsis & letterY2 & letterZ2
end

unbalanced ==> balanced

class and1,and2,and3,and4,and5 operator
class letterA1,letterB1,letterC1,letterY1,letterZ1,letterA2,letterB2,letterC2,letterY2,letterZ2 token

classDef operator fill:#f9cae0,stroke:#f495c0,stroke-width:4px
classDef token fill:#d1f3f5,stroke:#a4e6ea,stroke-width:4px

linkStyle default stroke:#c41565
</pre>

Another issue that often crops up is a lack of definition in your search language grammar. It can be difficult to know ahead of time how you want your language to behave, especially for edge cases such as order of precedence between operators, or handling whitespace, symbols, and stop tokens. It's crucial that details like this aren't overlooked, as changing functionality late in the product cycle can be difficult with ANTLR and Elasticsearch and once you've released to your users it becomes much more difficult for anything to change.

## Conclusion

To conclude, writing a lexer-parser in ANTLR is remarkably simple. With a single grammar file and some C# code, we've been able to convert structured text into an abstract syntax tree, and convert that AST into an Elasticsearch query. Tooling from ANTLR and Elasticsearch has made it simple for us to do this, allowing us to focus our efforts on the more challenging task of defining a flexible and effective search language. While we can take inspiration from the big players, there isn't a one-size-fits-all solution to developing your own query language, and careful thought and consideration will be needed to ensure your language is both user-friendly and robust enough to meet your application's needs.
