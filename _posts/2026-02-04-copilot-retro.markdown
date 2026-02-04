---
title: Working with Copilot - A Retrospective
date: 2026-02-04 10:00:00 Z
categories:
- Artificial Intelligence
- Tech
tags:
- AI
- Artificial Intelligence
- software engineering
summary: Reflecting on using Copilot to explore Agentic AI, I concluded that it offers valuable productivity gains when expectations are kept realistic. Copilot is overly eager, constrained by a small context window, struggles with refactoring and terminal usage, and is largely indifferent across model choices, making it unreliable for large or complex tasks. The key lesson was to work in very small, incremental steps, as errors compound quickly and passing unit tests do not guarantee correct behavior. Design documents and specs required constant maintenance and often became liabilities, compared to tightly scoped, per-task specs. Overall, Copilot is useful when carefully guided with minimal, relevant context and used for small, verifiable changes, but it falls short as an autonomous development partner.
author: osharon
---

I took the opportunity to allocate some time to learn how to work with Agentic AI. Picking a shelved project I had been eyeing for quite some time, I hoped that AI would expedite the development process. I believe it has, but far less than my wildest hopes. I picked up a few insights along the way that I thought would be worth sharing.

## Copilot is a very trigger-happy junior developer

I initially tried working with the free version of [GitHub Copilot](https://github.com/features/copilot), but I got frustrated with it very quickly—there seems to be a limit to how many moving parts it can handle in any request, and things turned into uncompilable slop soon after.  
Since then, I learned to write clearer prompts and break the tasks into smaller, more reasonable, clear instructions. I also switched to the paid version, which made life much easier. Perhaps a more experienced prompter could have used the free version better, but I just got fed up with it.  
My initial prompt was something along the lines of "write a Java-based CLI application that does 1,2,3..." which led to code that didn't even compile.  
I tried a different approach—plan, review, implement. But Copilot was very insistent, and after every suggested plan, it asked to implement it.  
After writing several spec designs, I finally answered its question with a 'yes'—only for it to go ahead and try to implement its own picks from everything we designed so far.

## Context matters

One of the biggest caveats I encountered—particularly with the free version—is the context-size limitation. In one of the tasks, it was very clear that by the end of the implementation, it had completely forgotten the first line of the plan and simply ignored that instruction. On the other hand, some concepts I couldn't get out of its head, even after being explicit about it—it insisted on making my application multi-threaded, no matter how much I emphasized it should be single-threaded.  
Later on in the project, I wanted to change an object's ID from String to int. This is something I would expect a smart-enough IDE to handle rather gracefully. Not only did Copilot work for an extended amount of time on it, it also gave up in the middle, complaining "this is taking too long, should I carry on?" and even then it missed quite a few spots—particularly serialization unit tests.  
It's worth pointing out that Copilot isn't aware of the project's code. It needed to actively look for string pieces (using [RegExp](https://en.wikipedia.org/wiki/Regular_expression)). This is unlike a normal IDE, which can quickly access any part of the code when asked to refactor.

## Accessing the terminal is an unnecessary pain

Copilot tried several times to access the terminal to either delete files or run tests, and it failed miserably. It kept messing up PowerShell and WSL commands and got itself into an endless loop of failing to run the test units without figuring out it had permissions issues. This was extremely disappointing, as for these two functionalities, I would have expected it to manage this internally. Instead, it tried to utilize the terminal to run `./gradlew test` and then parse the output to understand what happened. Not only do I think these two functionalities should be handled internally, I would even suggest that it should never actually delete files, but rather just archive them safely.

## Models are soda

In her [TED Talk](https://www.ted.com/talks/sheena_iyengar_the_art_of_choosing), Sheena Iyengar tells a story in which she offers participants a drink from a selection—Coca Cola, Pepsi, 7Up, amongst others. One participant replied, frustrated, "Oh, it's all just soda."  
Copilot offers 15 different models, and sadly from my experience, they're all just soda. Of course, there's a difference in pricing (between 0.3x, 1x, and 3x), but once we settled on a budget, I couldn't identify any significant [difference](https://docs.github.com/en/copilot/reference/ai-models/model-comparison) between Sonnet 4.5 and GPT-5.2. Yes, some might be [faster](https://arcprize.org/leaderboard) than others; some have deeper reasoning or quicker responses, but ultimately a lot of it is handled in a black box, and the results, from my point of view, are similar enough that I can't be bothered to change the model per task.

Chatting with my colleagues, they explained that this is due to my 'small-step' strategy, as some of the models are best suited for deeper reasoning, big tasks, or 'quick-and-dirty' work. I'm afraid that my initial experience left me skeptical (rightfully or not) regarding any model's capability to manage long and complicated tasks.

## AI is like an unreliable teleportation device

Imagine you have a teleportation device that becomes less reliable exponentially the further you travel. Traveling one meter is not a problem. Traveling a hundred meters, as cool as it may be, and you might find yourself somewhere very different. Traveling more than a kilometer, and there's a growing chance you'll turn into a [fly](https://en.wikipedia.org/wiki/The_Fly_(Langelaan_short_story)).  
I learned the hard way that any mistake in the system will worsen with every additional step you take if not addressed. The solution I settled on was sacrificing efficiency and making tiny, measurable steps instead of reckless leaps of faith. If one side of the spectrum is mere autocomplete (which has truly improved significantly over the years), and the other side is "build an app that does X," my lesson learned was not to venture further than adding a single feature at a time and making sure it was properly added.

## Unit tests come with limited warranty

For every feature I added, I made sure to include unit tests to verify it worked properly. Unfortunately, verifying that they all passed and paying special attention to those that failed wasn't enough. I didn't check that the code actually worked as it should until I had an [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product) ready, and at this point it was quite late in the game. Despite giving a specific architectural design, Copilot created all the objects but left them with empty functions while packing the actual code into two objects. When I eventually ran the app, it didn't behave as expected, despite all tests passing.  
It might be controversial, especially for [TDD](https://en.wikipedia.org/wiki/Test-driven_development) enthusiasts, but I would argue that an MVP is more important than comprehensive code coverage.

## Design documents are yet another thing that require maintenance

I definitely didn't become a 10x developer. Maybe a 2x developer, if anything. But I comforted myself with the fact that at least I learned how to write clearly defined spec documents that even the most junior developer would be able to implement.  
I then asked it to translate the documents into measurable tasks and had it implement one task at a time, while I made sure the unit tests passed properly (a necessary step, but as I learned, far from enough).

In reality, those documents were still not perfect, but I soon found out it didn't matter. As soon as I could run the app, I learned that some initial assumptions needed to be adjusted (for example, the object's ID being a string bloated my files), and now I had a few options: I could ask Copilot to update the spec, or I could edit it myself; but then how would I use this updated spec to fix the code? The solution I decided on was to discard the initial spec and ask Copilot to create a spec per task. I made sure that I was happy with the task spec and asked it to implement it. Those tasks still needed to be well-contained. If they were too big for its context window, it would still get lost. It also needed to keep looking for files (often using RegExp to scan through the files). It felt incredibly inefficient compared to modern-day IDEs' refactoring features. The old spec files? It would probably be smart to ditch them, as we wouldn't want them to taint the context with outdated assumptions. The same goes, in fact, for any old code that might send Copilot down the wrong rabbit hole.

## Conclusion

Copilot is valuable when properly utilized: make small, verifiable, incremental changes to your code, as slop grows when unattended. A limited-size context forces you to feed Copilot only what's relevant—your spec document should be scoped appropriately, and be sure to archive it after implementation. My prediction, or wish, is that future IDEs will incorporate AI capabilities into their existing features, such as refactoring and running unit tests, instead of relying on a third party that's unaware of the code's context.