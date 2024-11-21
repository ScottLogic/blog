---
title: Regular Expressions As Icebergs
date: 2019-12-16 00:00:00 Z
categories:
- Tech
tags:
- regex
- datahelix
- data
author: csalt
layout: default_post
summary: Regular expressions are very powerful, but something that many developers
  are wary of using&mdash;they have a reputation of being difficult to understand.  If
  you appreciate their underlying principles, you can understand them better, and
  if your code takes advantage of this, you may be able to refactor them into a more
  readable form.
---

Regular expressions are a key feature of many languages and text-processing systems, but are also something that many developers are uncomfortable using.  They have a reputation for being difficult to understand unless you are an expert, so that complex expressions effectively become "write-only code".  There is a well-known quote attributed to [Jamie Zawinski](https://jwz.org/) over twenty years ago, that 'some people, when confronted with a problem, think "I know, I'll use regular expressions." Now they have two problems.'  However much interactive tools like [RegExr](https://regexr.com/) help, there are still many developers who think regular expressions are unmaintainable, or even a code smell.

That's a shame, because they are very powerful, and this power means that they can be used as an extremely flexible solution to wide classes of problems involving text matching and text generation.  Here at Scott Logic we have a team working on [FINOS DataHelix](https://finos.github.io/datahelix/), an open-source Java tool for generating large amounts of mock data which complies with arbitrary business rules.  Regular expressions cannot handle all of DataHelix's requirements, but they do provide a straightforward and widely-known way to specify requirements for how string data should be generated&mdash;or, indeed, how it must not be generated.  Indeed, many organisations will already have encoded at least some aspects of their business rules into regular expressions, so in developing DataHelix it made sense to ensure that it could handle arbitrary regular expressions efficiently.

### Going below the surface

Most developers are familiar with regular expressions purely as a way to check if an input string matches a particular pattern, but if that is all you think they are, you are missing out on quite a lot of their power and beauty.  Like icebergs, you need to look below the surface to understand their true nature.  As a mathematical concept, they were first described back in the 1950s by the mathematician [Stephen C Kleene](https://en.wikipedia.org/wiki/Stephen_Cole_Kleene).  Kleene spent the majority of his career investigating the field of computability, one of the foundations of computer science, and described *regular languages*.  These are the basis of modern regular expressions; he showed that any such expression is equivalent to a *finite automaton*, a type of state machine.  Essentially, any non-backtracking regular expression can be represented as a finite automaton, and there are straightforward algorithms such as [Thompson's Construction](https://en.wikipedia.org/wiki/Thompson%27s_construction) to create such an automaton.  Equally, any finite automaton can be represented as a regular expression, although there are no guarantees that it will be a short or readable one!

What use can we make of this?  Well, without going too deep into the maths behind it, it is straightforward to transform and combine finite automata in such a way that we get useful results.  Moreover, it is simple to determine whether an automaton will match any strings at all, and if it does, whether the set of matching strings is finite or infinite.  For example, given two regular expressions *A* and *B*, how do you determine whether or not the expression *A AND B* matches any input?  In some cases&mdash;for example if one of the expressions is `.*`&mdash;this is trivial, but doing this lexically in the general case is not necessarily a straightforward job given the complexity of regular expression syntax.  If you convert the expressions to automata first, however, it is not difficult to combine the automata representations of *A* and *B* into a single automaton which matches the intersection of the strings matched by the two separate expressions, and then to determine whether or not that combined automaton will match anything at all.  As well as intersection, you can also carry out other basic set operations such as complement or union.

Because of the above, the vast majority of regular expression libraries available to you do already do this conversion and treat each expression as an automaton internally.  Have you ever wondered why a number of languages recommend that you "compile" frequently-used regular expressions and reuse the compiled forms?  That's because the "compilation" step consists of parsing the regular expression in the code and converting it into a state machine of some form.  The exact nature of the compiled form depends on the nature of the platform and library you are using: some, such as the regular expression library in .NET Framework (but not .NET Core) can even write out a library containing the compiled and optimised code of the state machines for your specific expressions, for you to then reuse later.  The most commonly-used regular expression libraries, however, treat compilation as a relatively opaque process and do not allow you to examine the compiled form of each expression very closely.

### Taking advantage of automata

Inside the DataHelix code, we use the [dk.brics.automaton](https://www.brics.dk/automaton/) regular expression library, for a number of reasons but primarily because it freely allows us to inspect the automata produced by the compilation process, and carry out operations upon them.  DataHelix provides a very flexible way to define the rules which its generated data must comply with, including a full set of grammatical operators.  For example, you could write a DataHelix data profile containing the following:

~~~ json
"allOf": [
  {
    "field": "username",
	"matchingRegex": "[A-Za-z0-9 ]+"
  },
  {
    "not": {
      "field": "username",
	  "containingRegex": "^ +"
	}
  },
  {
    "field": "username",
	"shorterThan": 16
  },
}
~~~

This is an extract from a relatively simple example, which [you can try out for yourself in the DataHelix playground](https://finos.github.io/datahelix/playground/#ewogICAgImZpZWxkcyI6IFsKICAgIHsKICAgICAgIm5hbWUiOiAidXNlcm5hbWUiLAogICAgICAidHlwZSI6ICJzdHJpbmciLAogICAgICAibnVsbGFibGUiOiBmYWxzZQogICAgfQogIF0sCiAgImNvbnN0cmFpbnRzIjogWwogICAgewogICAgICAiYWxsT2YiOiBbCiAgICAgICAgewogICAgICAgICAgImZpZWxkIjogInVzZXJuYW1lIiwKICAgICAgICAgICJtYXRjaGluZ1JlZ2V4IjogIltBLVphLXowLTkgXSsiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibm90IjogewogICAgICAgICAgICAiZmllbGQiOiAidXNlcm5hbWUiLAogICAgICAgICAgICAiY29udGFpbmluZ1JlZ2V4IjogIl4gKyIKICAgICAgICAgIH0KICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJmaWVsZCI6ICJ1c2VybmFtZSIsCiAgICAgICAgICAic2hvcnRlclRoYW4iOiAxNgogICAgICAgIH0KICAgICAgXQogICAgfQogIF0KfQo%3D), but it shows how DataHelix lets you break down what could potentially be a complex regular expression into simple parts, each of which is straightforward to understand.  The first part states that our hypothetical `username` field can only contain alphanumeric characters or spaces; the second part states that it must not start with spaces, and the third gives it a maximum length.  Note how the second part is of the form `"not": { ... }`&mdash;this is how DataHelix expresses negation.  If you have a finite automaton which accepts a particular set of strings, you can also create the automaton which accepts the complement of the set.  That gives us a very straightforward way to implement the negation of a regular expression, rather than expect a developer to create an expression which does the opposite of what they need.

We could potentially process this specification into a list of regular expressions, generate data that matches one and then test that it matches the others&mdash;but this would be a relatively inefficient process even for just this small data profile, and hopefully you can see that it would scale very poorly if additional terms are added.  Instead, when DataHelix reads this profile, it will use the dk.brics.automaton library to convert each of these constraints to an automaton&mdash;the `shorterThan` constraint will be converted into the regular expression `^.{,15}$` first, and the automaton for the second constraint will be replaced by its complement because of the `"not": { ... }` clause.  Then, it will combine all three automata into a single automaton representing the intersection of all constraints.  This enables the code to quickly discover that the data profile can produce a finite but non-empty data set, and to start generating data using the combined automaton.

This is a relatively simple example; we *could*, if we wanted, have entered the single constraint `"matchingRegex": "[A-Za-z0-9][A-Za-z0-9 ]{,14}"`.  Even with this case, though, you can see how breaking the expression down into fragments which each represent a single straightforward rule, and using more intuitive terms like `"shorterThan": 16`, produces a set of rules which becomes much more readable and maintainable than the single expression.  If we want to change our data set&mdash;say, for example, a database schema change in our products has increased our maximum username length&mdash;it is straightforward to see what we need to change in our data profile to create a new test dataset.

In just one blog post, we can only really scratch the surface of the theory behind regular languages and finite automata.  Indeed, we can only just scratch the surface of what DataHelix can do; if you have ever found yourself needing to generate quantities of realistic test data, I recommend you consider [reading its documentation](https://github.com/finos/datahelix/tree/master/docs), [downloading the latest version](https://github.com/finos/datahelix/releases/latest), or trying out [the DataHelix Playground](https://finos.github.io/datahelix/playground/).  Hopefully, though, this post has shown you how regular expressions are much more than just a simple string matching tool, and that if you're able to take advantage of their full theoretical capabilities you can factor them to make them much more readable and maintainable.  Although not all regular expression libraries enable you to do so easily, it's always possible to carry out the standard set operations of intersection, union and complementation on any regular language, and if you can access the finite automata used to implement them this is computationally straightforward to do.  If you can split a regular expression apart into pieces that each have a single responsibility, rather than writing a single monolithic mass, they become much easier to handle.
