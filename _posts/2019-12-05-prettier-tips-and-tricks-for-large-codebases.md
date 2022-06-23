---
title: Pros, Cons, Tips and Tricks when using Prettier in a large codebase
date: 2019-12-05 00:00:00 Z
categories:
- rpilling
- Tech
tags:
- prettier,
- git,
- featured
author: rpilling
layout: default_post
summary: 'Prettier, or code formatting in general can polarise developers - everyone
  has an opinion on braces. There are changes we can make and tricks we can apply
  to streamline all of this. Or: How I Learnt to Stop Worrying and Love Automated
  Code Formatting'
---

Prettier, and code formatting can polarise developers - everyone has an opinion on braces. There are changes we can make and tricks we can apply to streamline all of this. Or: How I Learnt to Stop Worrying and Love Automated Code Formatting

## Intro

When collaborating on code, tools like Prettier can be incredibly useful for productivity. They free developers from having to format their code as they type, and prevent disagreements in code reviews over code formatting. When I'm developing, I can even forget about extra spaces or scrambled pasted-in object definitions - Prettier will tidy them all.

However this does have its downsides. As with any feature we add to the development process, there is a cost. In Prettier's case, this cost surfaces in a few areas, and here's how my project tackled them.

So read on for all the gory details about Prettier - does running it on your code after changes always produce the same result? (spoiler: no) Can its interaction with `git` be improved? (spoiler: yes) Do you have to let it clobber files and trigger rebuilds? (spoiler: no)


## Prettier

### Peculiar Formatting

Prettier can take a little getting used to - many of its choices are well intentioned and make code much easier to read. For example, the indent of the closing-parenthesis/opening-brace on complex if-statements:

~~~javascript
if (
    status !== UNAVAILABLE &&
    status !== ERROR &&
    status !== UNEXPECTED_ERROR
) {
  ...
}
~~~

At a glance, the code reads vaguely as:

~~~
XX (                                                     XX (
    XXXXXX XXX XXXXXXXXXXX XX                                XXXXXX XXX XXXXXXXXXXX XX
    XXXXXX XXX XXXXX XX               compared to -->        XXXXXX XXX XXXXX XX
    XXXXXX XXX XXXXXXXXXXXXXXXX                              XXXXXX XXX XXXXXXXXXXXXXXXX) {
) {                                                        XXX
  XXX                                                      XXX
  XXX                                                    }
}
~~~

The left-hand code block being much more clear about where the if-condition ends and the body begins.

There are problematic cases, however:

~~~javascript
rest.post(
    'objects/24281292?account=rob',
)
    .body({    // what's this '.body' doing floating around here?
      orderId,
      account,
    });
~~~

This used to make me to do a double-take, before I actually read the code. Prettier's view is that there might be more methods chained later, so this maintains consistency with that case.


### Formatting Edge Cases

Prettier is designed with an 80-column limit in mind. That is - Prettier will attempt to fit as much as possible on one line, which works well for this limit, but perhaps not so much for longer lines. While this can be [configured](https://prettier.io/docs/en/rationale.html#print-width), a lot of the formatting rules are implemented to work prettily on lines that go up to around column 80.

This means any project that goes away from the beaten track may run into edge-cases. For example, applying a line width of 80/90 to code originally written for 120 columns will cause some uglifications. This is in part because line width drives how we structure code, in a similar way to indent spacing - 2-space indent makes code more likely to have nested constructs.

Unit tests, with their long identifiers, can be particularly hard-done-by:

~~~javascript
describe(..., () => {
    describe(..., () => {
        it(..., () => {
            // we've barely gotten started and we're already up to column 85
            requestModelSelectors.generatedRequestBody(firstArgument, secondArgument)
        });
    });
});
~~~

### Canonical Form

Prettier may appear at first glance to be a canonical form for the codebase.

However, this isn't the case. The following code is formatted by Prettier over three lines:

~~~javascript
yield fetchInstrument({
  instrumentId: requestedInstrument.id,
});
~~~

... but manually joining the lines, and re-running Prettier yields:

~~~javascript
yield fetchInstrument({ instrumentId: requestedInstrument.id });
~~~

... meaning there isn't one canonical view of a codebase, and developers may still leave a mark of their style.

As a tangent, this can cause troubles with object literals - the properties are unsorted, and Prettier won't sort them. Some linters are capable of doing this, however - for example sass-lint can be [configured with a sort order] for CSS declarations.

[configured with a sort order]: https://github.com/sasstools/sass-lint/blob/master/docs/rules/property-sort-order.md

### Interaction with Linters

For those of you thinking, "How does Prettier differ from my linter?" - fair question. There's a lot of overlap between a linter's functionality and Prettier's. That being said, linters shouldn't be discarded.

Linters cover stylistic changes that Prettier will leave alone, for example, newlines.

~~~javascript
if (isDog) {
    uploadMeme();
}

feedAnimal(); // linters can ensure we're separated by newline from the previous if-statement
~~~

Linters are also useful for validating simple, yet valid constructs that could indicate bugs - like unused local variables.

Deeper syntactic constructs can also be checked - a codebase I worked on recently made heavy use of sagas, and debugging the generator functions was problematic. Essentially the problem came down to a codebase consensus - we would `yield` another generator, rather than delegate to it (`yield*`). This meant the call-stack only had one generator in at any one time, making it hard to see who's calling who.

Changing these generator calls to use `yield*` was the solution, and a lint rule for this was fairly easy to [write](https://github.com/SaxoBank/eslint-plugin-saxo/blob/063b230988b0cf76a8d05d98355e61b4a7957a53/src/rules/saga-direct-delegation.js).

## History

### git-diff

Prettier (and all formatters, generally) can have a worryingly large effect on diffs. For instance, renaming an identifier to push a line over the limit:

~~~diff
-    const requestArgs = { clientId, requestId, docId, componentId, window };
+    const requestArgs = {
+        clientId,
+        requestId,
+        externalReferenceId,
+        componentId,
+        window,
+    };
~~~

However, this can easily be resolved, and in fact become advantageous for diffs. Setting trailing commas to `"all"` makes function calls and objects particularly immune to changes, letting us keep a one-line change as a one-line diff:

~~~diff
    const requestArgs = {
        clientId,
        requestId,
        externalReferenceId,
        componentId,
-       window,
    };
~~~

### git-blame / history

Unless Prettier's been introduced from the start, converting a codebase usually leaves one large prettification commit, which can have knock-on effects. The primary one of these being `git blame`, but also, conflicts with currently open PRs - this difficulty can be [eased though](https://blog.scottlogic.com/2019/03/04/retroactively-applying-prettier-to-existing-branches.html).

This means that the modification history for the majority of files now includes the prettification commit, and most individual lines will git-blame to this commit.

This can be worked around in a few ways - one can manually "reblame" past the prettification commit, but this usually means some level of manual effort - some IDEs offer reblame functionality, and the [fugitive vim plugin] has several bindings for different kinds of reblame.

Another technique, that's editor independent, can be to use git's replace API to step over the offending commits, but this is a very manual procedure, and usually has the effect of charging the changes to the child commit of the replacement.

Alternatively, as of [git v2.23.0], `git blame` learnt [`--ignore-rev <rev>`], which means it can skip over particular commits. In a large repo, there can be many of these, so `--ignore-revs-file <file>` is also supported. Maintainers can store the commit hashes of "rewrite commits" in `.git-blame-ignore-revs`, and with a quick config change, you suddenly skip all these problematic commits with `git blame`.

~~~sh
git config blame.ignoreRevsFile .git-blame-ignore-revs
~~~

[git v2.23.0]: https://github.com/git/git/commit/ae3f36dea16e51041c56ba9ed6b38380c8421816
[fugitive vim plugin]: https://github.com/tpope/vim-fugitive/blob/67efbf66e0fcfd25e617d22892a7e9768bfd0f92/doc/fugitive.txt#L89
[`--ignore-rev <rev>`]: https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---ignore-revltrevgt

## Automating Prettier

There are several options for automating Prettier

* Run on save
* Run pre-commit

There are pros and cons to these approaches. The format-on-save setting for IDEs, particularly VS Code, is very popular.

There are a few problems, however:

* The file to-be-saved must be run through an external program, which can cause some editors to lose marks in a file, line-local undo, etc.
* There can be a delay while the external processes fires up (this is usually more noticeable on Windows, because of how processes are expected to be long-lived)
* The prettification might not be desired, for instance, if a developer is part way through a debug session or reproducing a bug, and has made notes in the source file, these comments will be shuffled round and any adjusted code will be reformatted, potentially bringing the developer out of 'the zone'
* The IDE losing focus will trigger a save and a reformat, interrupting workflow, which could hot reload a webapp where you're mid-debug session (admittedly this is more a problem with IDE-saving than Prettier).

We could use a commit hook to prettify on-save, however this has a few problems, the primary one being that my editor won't be aware of a commit, and it'll either re-save the unprettified files, or complain that the file's been changed externally.

As developers, we might want Prettier to keep out from under our feet until we commit. If this sounds like your kind of problem, look no further - we can solve this with an index-based commit hook.

When we queue up a commit in git, we stage the changes in git's "index", before committing. We can write a hook that runs Prettier on the files staged in this index, rather than on disk - this means anything that goes into git is pretty, and it's a simple step to restore these changes to our local copy, at our convenience.

[This script](https://gist.github.com/bobrippling/24c74e948d8a5fbc27ac1b3bb6f6c089), installed under `.git/hooks/pre-commit`, will do just that. It also allows us to blacklist certain files, to prevent Prettier from changing them.

As a side-note, there are tools that can perform a similar task, however these will still touch the files on disk, rather than the magic staging area only. They also have slightly more dependencies: [husky] (which comes bundled with `create-react-app`), and [pretty-quick].

[husky]: https://www.npmjs.com/package/husky
[pretty-quick]: https://github.com/azz/pretty-quick

## Formatting Other File Types

Prettier isn't just a JavaScript formatter - it has parsers and formatters for many languages. In the above script, I also use it to format css/less files. It'll also handle formatting for GraphQL statements inside other files as GraphQL - Prettier will look for a [tagged template literal] with the tag `gql`, and assume the containing text should be formatted as GraphQL. It can also format code blocks within markdown files.

~~~javascript
gql`
{
    human(id: "1001") {
        name
        height
    }
}
`
~~~

[tagged template literal]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

## Integrating with Existing Linters

Prettier functionality can overlap existing functionality that's more traditionally been the role of the linter. For example, curly brace enforcement, line length and double- or single-quote use. This means bringing Prettier into a project that already has a linter can be problematic if they disagree on style.

There is a somewhat-standard way of coping with this - linters come with a "recommended" ruleset, and `eslint-config-prettier` provides an "anti" ruleset, which will cancel out conflicting rules. For example:

~~~json
    "extends": [
        "eslint:all",                 // enable all eslint rules
        "prettier",                   // ... then disable those which conflict with prettier

        "plugin:unicorn/recommended", // enable all unicorn rules
        "prettier/unicorn",           // ... then disable those which conflict with prettier
    ],
~~~

... then custom tweaks can be added, to suit your needs:

~~~json
    "curly": "error",
    "max-len": ["error", { "code": 1000, "comments": 90, "ignoreUrls": true }],

    "quotes": [
      "error",
      "single",
      { "avoidEscape": true, "allowTemplateLiterals": false }
    ],
~~~

## Summary

Having used Prettier for several months now, I really start to miss it on other projects. Fortunately, it's becoming more and more common - JavaScript isn't the first language to do this. Go somewhat controversially bundled [`go fmt`] by default, and Rust comes with [`rustfmt`]. Look forward to seeing a formatter for your favourite language soon!

[`go fmt`]: https://blog.golang.org/go-fmt-your-code
[`rustfmt`]: https://github.com/rust-lang/rustfmt

## References and Further Reading

* [Prettier Rationale](https://prettier.io/docs/en/rationale.html)
* [Sass Lint](https://github.com/sasstools/sass-lint)
* [Ignoring bulk change commits with git blame](https://www.moxio.com/blog/43/ignoring-bulk-change-commits-with-git-blame)
* [Running checks on commit with husky](https://github.com/typicode/husky#supported-hooks)
