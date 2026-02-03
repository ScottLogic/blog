---
title: Working with Co-Pilot - Retrospective
date: 2026-02-03 10:00:00 Z
categories:
- Artificial Intelligence
- Tech
tags:
- AI
- Artificial Intelligence
- software engineering
summary: Reflecting on using Co-Pilot to explore Agentic AI, I concluded that it offers valuable productivity gains when expectations are kept realistic. Co-Pilot is overly eager, constrained by a small context window, struggling at refactoring and terminal usage, and largely indifferent across model choices, making it unreliable for large or complex tasks. The key lesson was to work in very small, incremental steps, as errors compound quickly and passing unit tests do not guarantee correct behavior. Design documents and specs required constant maintenance and often became liabilities, compared to tightly scoped, per-task specs. Overall, Co-Pilot is useful when carefully guided with minimal, relevant context and used for small, verifiable changes, but it falls short as an autonomous development partner.
author: osharon
---

I took an opportunity and allocated some time to learn how to work with Agentic AI. Picking a shelved project I was eying for quite some time I hoped that AI will expedite the development process. I believed it has, but far less than my wildest hopes. I picked up a few insights along the way I thought it would be worth sharing.

## Co-Pilot is a very trigger-happy junior developer

I initially tried working with the free version of co-pilot, but I got frustrated with it very quickly - there seem to be a limit to how many moving parts it can handle in any request and things turned into uncompilable slop soon after.
Since then, I learnt to write clearer prompts, break the tasks to smaller, more reasonable, clear instructions. I also switched to the paid version which made life much easier. Perhaps a more expert prompter could've used the free version better. I just got fed up with it.
My initial prompt, that was something along the lines of "write a Java-based CLI application that does 1,2,3..." led to code that didn't even compile.
I tried a different approach - plan, review, implement. But Co-Pilot was very insisting and after every suggested plan it asked to implement it.
After writing several spec design, I finally answered his question with a "yes" - only for it to go ahead and try to implement his own picks from everything we designed so far.

## Context matters

One of the biggest caveats I encountered - and particularly with the free version, is the context-size limitation. In one of the tasks it was very clear that by the end the implementation, it completely forgot the first line of the plan and simply ignored that instruction. On the other hand, some concepts I couldn't get out of its head, even after being explicit about it - it insisted making my application multi-thread, not matter how much I emphasised it should be singe-threaded. Later on in the project, I wanted to change an object's ID from String to int. This is something I would expect a smart-enough IDE to be handle rather gracefully. Not only Co-Pilot worked for an extended amount of time on it, it also gave up in the middle, complaining "this is taking took long, should I carry on?" and even then it missed quite a few spots - particularly serialization unit-tests. it worth pointing that Co-Pilot isn't aware of the project's code. I need to actively look for string pieces (using RegExp). This is unlike a normal IDE that when asked to refactor, can very quickly access anywhere it needs in the code.

## Accessing the terminal is an unnecessary pain

 Co-Pilot tried several to access the terminal to either delete files or run tests and it failed miserably. It kept messing up with Power-Shell and WSL' commands and gotten itself to endless loop of failing to run the test units without figuring out it has permissions issues. This was extremely disappointing as for these two functionalities, I would've expect it to manage it internally. Instead, it tried to utilise the terminal to run ./gradlew test and then parse the output to understand what happened. Not only I think these two functionalities should be handled internally, I would even  suggest that it should never actually delete files, rather then just archive them safely.

## Models are soda

In her Ted Talk, Sheena Iyengar tells a story in which she offer participants a drink from a selection of drinks - Coca Cola, Pepsi, 7Up amongst others. He replied frustrated "Oh, it's all just soda". Co-Pilot offers 15 different models and sadly they're all just soda. Of course, there's a difference in pricing (between 0.3x, 1x and 3x) but once we settled on budget, I couldn't identify any significant difference between Sonnet 4.5 and GPT-5.2. Yes, some might be faster than other; some have deeper reasoning or quicker response but ultimately a lot of it is handled in black box and the results from my point of view are similar enough to me to be bothered to change the model per task.

## AI is like an unreliable teleportation device

Imagine you have a teleportation device that becomes less reliable exponentially the further you travel. Travelling for one metre is not a problem. Travelling for a hundred metres, as cool as it may be, and you might find yourself somewhere very different. Travelling for more than a kilometre and there's a growing chance you'll turn to a fly. I learned the hard way that any mistake in the system will worsen every additional step you take if not being taken care of. The solution I compromised with was sacrificing the efficiency and making tiny measurable steps instead of reckless leaps of faith. If one side of the spectrum would be mere autocomplete (that truly improved significantly over the year) and the other side is "build an app that does X". My lesson learnt was not to venture further than adding a single feature at a time and making sure it was properly added.

## Unit Tests come with limited warranty

For every feature I added, I made sure to include unit test to verify it works properly. Unfortunately, verifying they all pass and paying special attention to those that fail wasn't enough. I didn't check the code actually work as it should until I had an MVP ready, and it this point it was quite late in the game. Despite giving a specific architectural design, Co-Pilot created all the objects but left them with empty functions while having the actual code in what it believed is the right design, which didn't always made sense. When eventually I ran the app, it didn't behave as expected, despite all tests passing properly. It might be controversial, especially for TDD-enthusiasts but I would argue that MVP is more important than a comprehensive code coverage.

## Design Documents are yet another thing that require maintenance

I definitely didn't become 10x developer. 2x developer if any. But I comforted myself that at least I learned how to write clearly defined spec documents that even the most junior developer will be able to implement. I then asked to translate the documents into measurable tasks and had it implement one task at a time while I made sure the unit test pass properly (a necessary step, but as I learned, far from enough)

In reality those document were still not perfect, but it didn't matter - As soon I could run the app, I learned that some initial assumptions needed to be adjusted (for example the, object's ID being a string bloated my files) and now I had few options - I can ask Co-Pilot to update the spec, or I can edit myself; and then how will I use this updated spec to fix the code? The solution I decided was to discard the initial spec and ask Co-Pilot to create a spec, per-task. Make sure that I'm happy with it and ask it to implement it. Those tasks still needed to be well-contained. If they were too big for its context-window, it would still get lost. It also need to keep looking for files (often using regExp to scan through the files). It felt incredibly inefficient, compared to modern-day IDE's refactoring features. The old spec files? it would probably be smart to ditch them as we wouldn' want them to taint the context with outdated assumptions...

## Conclusion

Co-Pilot is valuable, when properly utilised;  Make small verifiable, incremental changes to your code as slop grows when unattended; A limited-size context forces you to feed Co-Pilot only what's relevant - your spec document should be scoped appropriately and be sure to archive after implementation.
