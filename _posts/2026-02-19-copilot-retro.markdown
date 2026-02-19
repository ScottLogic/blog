---
title: Things to expect when starting to work with Copilot
date: 2026-02-19 10:00:00 Z
categories:
- Artificial Intelligence
- Tech
tags:
- AI
- Artificial Intelligence
- software engineering
summary: AI will likely play a major role in software development, but using it effectively requires understanding its limits. While working with GitHub Copilot, I found that small, well-defined tasks and better prompting improved results, while context limits and over-eager implementations caused issues. By working incrementally and verifying each step, I increased my productivity and learned to collaborate with AI more deliberately.
author: osharon
---

The future of software development will probably have some element of AI. Whether it's simple auto-complete or a full end-to-end ticket implementation, it has the potential to make us more productive. But alas, the more we rely on it, it has the risk of bogging the work down. As a software developer, one should familiarise themselves with its capabilities and learn how to work with it. Or stay behind.

I took the opportunity to allocate some time to learn how to work with Agentic AI. Picking a shelved project I had been eyeing for quite some time, I hoped that AI would expedite the development process. considering the promise of "[now everyone can build their app](https://uk.cybernews.com/lp/best-ai-app-builders-uk/)", the learning curve was actually much steeper than I'd expected. However, I managed to get some real value from an output prespective and I also picked up a few insights along the way that I thought would be worth sharing.

## Copilot is very eager

I initially tried working with the free version of [GitHub Copilot](https://github.com/features/copilot), but I got frustrated with it very quickly. I couldn't figure out the right balance of details needed for it to do a descent job. Too little, and I realised I should've specified I want the code to be [compilable](https://everydayaiblog.com/cursor-ai-browser-cant-compile/). Too much details, and it quickly went beyond its context window, forgetting the first thing I told it.

There were no epiphany or light-bulb moments but over time I learned to write better prompts. I also broke the tasks into smaller, more reasonable, clear instructions. I also switched to the paid version, which made life much easier as it gave me a bigger context window. With the write prompts, you can achieve a lot with the paid version but unless you don't have the budget or enjoy challenging yourself, I'd argue it that's life much more comfortable with bigger contexts.

My attitude towards copilot changed over time. Form "go write an application" which led to utter disasters, I reverted to "plan, review & implement". it was considerably slower, but gave me better chance to course-correct whenever it veered in a wrong direction.

Copilot, however, was very eager and often wrote bits of code directly in the spec files and always suggest to go to implementation stage, despite me insisting on avoiding to write any code before I'm happy with the suggested design.

## Context matters

As mentioned, one of the biggest caveats I encountered—particularly with the free version—is the context-size limitation. In one of the tasks I gave it, it was very clear that by the end of the implementation, it had completely forgotten the first line of the plan and simply ignored that instruction. On the other hand, some concepts I couldn't get out of its head, even after being explicit about it. For example, copilot insisted on making my application multi-threaded, no matter how much I emphasized it should be single-threaded.
A general tip in such scenarios would be to start a new conversation (with a fresh new context) but if your code has ill-concieved concepts, they might pollute any future solution.

Later on in the project, I ask copilot to refactor a variable from string to int. This is something I would expect a smart-enough IDE to handle rather efficiently. I was there dissapointed that copilot manually scanned the entire code a looked for changes, and it ended missing out some of the unit-tests due the the sheer amount of changes. Frustringly, it also missed out serialisation tests.  
Copilot isn't "aware" of the project's code. It needed to actively look for string pieces (using [RegExp](https://en.wikipedia.org/wiki/Regular_expression)). This is unlike a normal IDE, which can quickly access any part of the code when asked to refactor.

## Accessing the terminal is an unnecessary pain

Copilot tried several times to access the terminal to either delete files or run tests, and it failed miserably. It kept messing up PowerShell and WSL commands and got itself into an endless loop of failing to run the test units without figuring out it had permissions issues. This was extremely frustrating, as for these two functionalities, I would have expected it to manage this internally (via the IDE). Instead, it tried to utilize the terminal to run `./gradlew test` and then parse the output to understand what happened. Not only do I think these two functionalities should be handled internally, I would even suggest that it should never actually delete files, but rather just archive them safely.

This has actually improved over time, whether it was updates in the IDE or in the model, but it now creates its own terminal console it can better control. So at least the test work properly, and I'm pleased that "keep fixing the code until the test pass" is much more likely to work now.

## Models are soda

In her [TED Talk](https://www.ted.com/talks/sheena_iyengar_the_art_of_choosing), Sheena Iyengar tells a story in which she offers participants a drink from a selection—Coca Cola, Pepsi, 7Up, amongst others. One participant replied, frustrated, "Oh, it's all just soda."  
Copilot offers 15 different models, and sadly from my experience, they're all just soda. Of course, there's a difference in pricing (between 0.3x, 1x, and 3x), but once we settled on a budget, I couldn't identify any significant [difference](https://docs.github.com/en/copilot/reference/ai-models/model-comparison) between Sonnet 4.5 and GPT-5.2. Yes, some might be [faster](https://arcprize.org/leaderboard) than others; some have deeper reasoning or quicker responses, but ultimately a lot of it is handled in a black box, and the results, from my point of view, are similar enough that I can't be bothered to change the model per task.

Chatting with my colleagues, they explained that this is due to my 'small-step' strategy, as some of the models are best suited for deeper reasoning, big tasks, or 'quick-and-dirty' work. I'm afraid that my initial experience left me skeptical (rightfully or not) regarding any model's capability to manage long and complicated tasks.

At the time of writing this post, more new models came out, and there's a significant different in the likelyhood for them to match my vision. They are getting better, but I still don't know when would I want to use an older model.

## AI is like an unreliable teleportation device

Imagine you have a teleportation device that becomes less reliable exponentially the further you travel. Traveling one meter is not a problem. Traveling a hundred meters, as cool as it may be, and you might find yourself somewhere very different. Traveling more than a kilometer, and there's a growing chance you'll turn into a [fly](https://en.wikipedia.org/wiki/The_Fly_(Langelaan_short_story)).  
I learned the hard way that any mistake in the system will worsen with every additional step you take if not addressed. The solution I settled on was sacrificing efficiency and making tiny, measurable steps instead of reckless leaps of faith. If one side of the spectrum is mere autocomplete (which has truly improved significantly over the years), and the other side is "build an app that does X," my lesson learned was not to venture further than adding a single feature at a time and making sure it was properly added. That said, I felt I reached nirvana when I asked to implement a particular feature and it nailed it almost completely on the first try.

## Unit tests come with limited warranty

For every feature I added, I made sure to include unit tests to verify it worked properly. Unfortunately, verifying that they all passed and paying special attention to those that failed wasn't enough. I didn't check that the code actually worked as it should until I had an [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product) ready, and at this point it was quite late in the game. Despite giving a specific architectural design, Copilot created all the objects but left them with empty functions while packing the actual code into two objects. When I eventually ran the app, it didn't behave as expected, despite all tests passing.  
It might be controversial, especially for [TDD](https://en.wikipedia.org/wiki/Test-driven_development) enthusiasts, but I would argue that an MVP is more important than comprehensive code coverage.

## Design documents are yet another thing that require maintenance

I definitely didn't become a 10x developer. Maybe a 2x developer, if anything. But I comforted myself with the fact that at least I learned how to write clearly defined spec documents that even the most junior developer would be able to implement. "Writing clear specs" is an important, applicable skill to have. 
I asked copilot to translate my spec into measurable tasks and had it implement one task at a time, while I made sure the unit tests passed properly (a necessary step, but as I learned, far from enough).

In reality, my specs were still not perfect, but I soon found out it didn't matter. As soon as I could run the app, I learned that some initial assumptions needed to be adjusted (for example, the object's ID being a string bloated my files), and now I had a few options: I could ask Copilot to update the spec, or I could edit it myself; but then how would I use this updated spec to fix the code? The solution I decided on was to discard the initial spec and ask Copilot to create a spec per task. I made sure that I was happy with the task spec and asked it to implement it. Those tasks still needed to be well-contained. If they were too big for its context window, it would still get lost. It also needed to keep looking for files (often using RegExp to scan through the files). It felt incredibly inefficient compared to modern-day IDEs' refactoring features. The old spec files? It would probably be smart to ditch them, as we wouldn't want them to taint the context with outdated assumptions. The same goes, in fact, for any old code that might send Copilot down the wrong rabbit hole.

## Conclusion

As I mentioned, I have no million-dollar tip how to get copilot to do what I want, but I can clearly see how my productivity improved within a mere month of working with it. It may have been intuitive learning and may have been upgrades to the IDE or the models but eitherway the result is undeniable and there's no chance I could've achieved the progress I made without it.

Copilot is valuable when properly utilized: The size of the tasks you give it are in direction relation to the amount of trust you give it. Start with small, verifiable, incremental changes to your code, as slop grows when unattended. A limited-size context will force you to feed Copilot only what's relevant—your spec document should be scoped appropriately, and be sure to archive it after implementation. My prediction, or wish, is that future IDEs will incorporate AI capabilities into their existing features, such as refactoring and running unit tests, instead of relying on a third party that's unaware of the code's context.