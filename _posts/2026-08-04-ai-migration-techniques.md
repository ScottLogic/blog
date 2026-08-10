---
title: Confidence Techniques for Guiding AI Migration
date: 2026-08-04 00:00:00 Z
categories:
- Artificial Intelligence
tags:
- AI
- Rust
- testing
author: pedwin-scottlogic
summary: 'Migrating a legacy codebase of any reasonable complexity has always been
  challenging, but AI tools have fundamentally changed the economics of the process.
  Generating code is now cheap and fast, but we still need confidence that the generated
  code is as good as, or better than, code we''d write ourselves.

'
---

Migrating a legacy codebase of any reasonable complexity has always been a challenging activity, but the economics of this migration have changed with the introduction of AI tools that can help with that process. Generating the code is cheap and quick, but we need to be confident that the generated code is as good (or better) than if we'd written it ourselves.

I had an opportunity to combine two topics that I've been pursuing recently: gaining familiarity with Rust beyond what [The Book](https://doc.rust-lang.org/stable/book/) can teach me, and getting up to speed with the latest developments in AI developer tooling.

We have an internal project (a competitive coding game platform) which has been around for over 10 years. The bulk of the functionality is written in Java, using multiple components, with ~10,000 lines of code. It's had multiple contributors with varying levels of experience and usually limited time for polishing of code, resulting in a codebase that's complex, somewhat buggy, and under-tested.

Rust is a great target for code generation. Features enforced by the compiler like strict typing, ownership and borrowing rules and exhaustiveness checks, along with detailed error messages, help guide towards producing robust code. There are no nulls, fewer opportunities for implicit errors, and strong language guarantees that make code more predictable and easier to reason about. The detailed error messages which often suggest exact fixes, along with standard tooling such as [`clippy`](https://doc.rust-lang.org/clippy/) which gives structured feedback, provide an ideal feedback loop for AI agents.

I was hopeful that migrating the legacy Java code to Rust would help address some of the known issues and make it easier to maintain in future, especially since adding tests would be a key part of the migration process, but what would be really useful was the experience of using AI to do the heavy lifting, allowing me to concentrate on ensuring the quality of the produced code, and gathering techniques that could be applied equally well to future migrations.

---

## 1. Confidence in Generated Test Code

### Problem

It's easy to get AI to translate existing tests from Java to Rust, but how can we make it easier to ensure that the generated tests correspond with the originals? It can often be hard to match these up even where there's meant to be a one-to-one mapping, for various reasons:

- Different naming conventions between languages (if followed at all!)
- Implementation differences between languages impact test naming and applicability

### Solution

We can ask the AI to include documentation comments on the generated tests to show which original tests they relate to, making it much easier for us to navigate between the two when reviewing. We've used links to GitHub in this case, but these could be whatever's most appropriate for your use case.

~~~ rust
/// Java equivalent: [`noEnemiesInRange_noKills`](https://github.com/…/BattleSystemTest.java#L32)
#[test]
fn no_enemies_in_range_no_kills() { }
~~~

Sometimes the migrated tests won't have a one-to-one mapping to the originals. Language differences might mean that certain scenarios are no longer applicable when migrated, or tests might be combined to take advantage of parameterisation. In this case, we can instruct the AI to provide documentation at the module level to highlight these differences.

~~~ rust
#[cfg(test)]
mod tests {
    //! Covers the same behaviour as [`BattleSystemTest`](https://github.com/…/BattleSystemTest.java).
    //!
    //! All 11 Java scenarios are represented: 10 direct ports plus `playersAtExactBattleRadius_inRange`
    //! and `playersJustOutsideRadius_notInRange` merged into the single parametrized `radius_boundary` test.
}
~~~

When AI is writing the majority of your migrated code, being confident in the generated tests is essential. Improving the traceability gives you the confidence that's needed to let the AI get on with doing the laborious part of the work.

---

## 2. Being Lazy _Might_ be a Virtue

### Problem

I encountered something quite surprising during my early attempts at migrating one of the more basic components in the project. I'd already used AI to increase the test coverage on the original code, and had the idea of running these Java tests against the generated Rust code by creating a Java-Rust compatibility layer. This same compatibility layer could then be used by other Java components to call the Rust code.

What I wanted: Java-Rust compatibility layer ☕⇄🦀

What I expected: implementation using something [JNI](https://en.wikipedia.org/wiki/Java_Native_Interface) or [JNA](https://en.wikipedia.org/wiki/Java_Native_Access), frameworks that are designed to solve exactly this problem 🤓

What I got: `stdio` calls to a separate Rust executable for **each** function call 🧐

The AI had added string handling functionality to both the Java and Rust side, calling the Rust code as an executable with each function parameter passed as an argument, and the results returned on `stdout`. Whilst this technically satisfied the requirement that I asked for, it really wasn't a practical solution for so, so many reasons. The AI had managed to reinvent the wheel, creating a custom wrapper that was inefficient and likely to introduce further bugs, rather than using one of many standard proven approaches.

Human developers wouldn't do this (we hope). It's a lot of extra code to write that isn't providing useful functionality and would likely introduce further issues. Even if someone started down that path, we think that they'd usually question whether they're doing the right thing before getting too carried away. LLMs don't have that built-in limit on effort, they'll happily churn out code that provides a viable implementation without considering whether the approach is correct or having any architectural opinion.

### Solution

The LLM's approach wasn't explicitly wrong, and that's why we need to preempt poor choices by being more explicit about what we mean and what we want. Specify performance expectations and architectural considerations, try to identify ambiguities upfront, and instruct the model to ask questions when a decision needs to be made rather than just churning out the most probable solution.

*[JNI]: Java Native Interface
*[JNA]: Java Native Access

---

## 3. Coverage is Misleading

### Problem

It's easy to ask an LLM to generate test code to meet any arbitrary level of test coverage, and they usually do a pretty good job of it: near 100% coverage, clean test runs and no issues. But what's the point of this coverage if introducing a small bug in your code wouldn't be caught by at least one test?

That's where mutation testing comes in: deliberate introduction of small changes to the code being tested, mimicking typical coding mistakes or error conditions that should be handled, which _should_ be detected by existing tests. If the changes aren't detected, the test suite can be improved by adding further tests.

### Solution

Analysing the results of mutation testing can be quite tedious to perform manually, and improving the tests appropriately can take significant effort, but fortunately we have existing tools for that (e.g. [`cargo-mutants`](https://mutants.rs/) for Rust) and a willing assistant to do the hard work for us.

Performing mutation tests and improving the test suite is a great technique for improving the **quality** of your code coverage rather than just the percentage, giving a big increase in confidence in the generated code.

---

## Summary

Whilst AI can ease the burden of migrating legacy code, we need to have confidence in the generated code, otherwise it's just shifting the manual effort from the development phase to the review and test phase. Nobody wants to be trying to review code as fast as an LLM can generate it. The only way to achieve productivity gains is by increasing confidence in the generated code, by improved specifications and test techniques. (Something that also holds true if you let a horde of developers loose on your codebase.)

Writing code used to be expensive, but there was always an almost implicit assumption that it was mostly good, especially when created by engineers whose experience instilled confidence in their work. Testing was (sadly) seen as something of a secondary consideration.

Although it's tempting to start small, this creates the risk of drifting away from the desired target with the need for regular course corrections. It's better to provide more context at the start to achieve better alignment, then ask for this to be delivered in smaller chunks which are assessed along the way to ensure progress is in the correct direction. Iterating with verification towards a desired result increases trust and confidence in the code being generated.

Now it's easy for AI to generate code, and just as easy for it to generate the wrong code and the wrong tests. We need to gain our confidence in other ways, and that means verification and testing become a much more important part of software engineering.
