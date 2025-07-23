---
title: 'Visualising the Trade Lifecycle - Phase 2: Refactoring with Cursor IDE'
date: 2025-07-22 09:04:00 Z
categories:
- Artificial Intelligence
- Technology
- Cloud
- Development
- AI
tags:
- Artificial Intelligence
- Technology
- Cloud
- Development
- AI
summary: In this instalment, I discovered that Cursor IDE transformed my chaotic multi-AI
  orchestra of wayward soloists into something rather more like a proper piano duet,
  successfully refactoring my 847-line monolith into modular components without the
  usual algorithmic amnesia. I found that when your IDE becomes your coding partner,
  you stop waving the baton at three separate musicians who occasionally abandon the
  sheet music for their own creative interpretations and start playing chamber music,
  even when you accidentally set fire to the entire score and your duet partner rescues
  the concert from almost certain disaster by magically producing a fresh copy from
  the archives.
author: rgriffiths
---

In [Part 1](https://blog.scottlogic.com/2025/07/17/visualising-the-trade-lifecycle-phase-1-building-a-react-spa-with-multiple-ais.html), I built a hybrid cloud trade lifecycle visualiser using a triumvirate of AI assistants: ChatGPT, Claude, and Microsoft Copilot. What began as a playful experiment in multi-LLM development had resulted in a working React application that mapped the journey of financial trades through on-premises and cloud infrastructure.

But, as any developer knows, early success often leads to complexity. And complexity demands better tools.

Enter **Cursor IDE**. Note that there are many possible alternatives to Cursor: I just happened to choose Cursor for this experiment.

---

## **Why Cursor Changed the Game**

By the end of [Part 1](https://blog.scottlogic.com/2025/07/17/visualising-the-trade-lifecycle-phase-1-building-a-react-spa-with-multiple-ais.html), I was juggling browser tabs, ferrying code between three AI interfaces, and manually assembling the pieces. It worked (just about) but it was clunky, brittle, and error-prone.

Cursor IDE changed all of that. It brought:

- Context-aware AI chat embedded directly in the IDE
- Inline suggestions with full project visibility
- One-click refactors, component extraction, and error fixing
- Git integration and persistent chat history for traceability

In short: the scattered, multi-window workflow of [Phase 1](https://blog.scottlogic.com/2025/07/17/visualising-the-trade-lifecycle-phase-1-building-a-react-spa-with-multiple-ais.html) gave way to something streamlined, contextual, and, dare I say it, rather enjoyable. I hadn’t planned a Phase 2, but Cursor made it inevitable.

---

## **The Cursor Chronicles: A Timeline**

### **Day 7: The Great Migration**  

**Morning: ChatGPT → Cursor (Claude)**

The day started by downloading and installing Cursor which, thankfully, was a simple job. Guided through some of the settings by the IDE itself, I pointed it at the folder containing the current project. 

![001-Cursor-IDE-FileList.png](/uploads/001-Cursor-IDE-FileList.png)

Cursor created the necessary IDE wrappers and asked if I wanted to commit everything to a git repo. I agreed and, just like that, my standalone code was now being managed by git repo in GitHub!

![002-Cursor-GitHistory.png](/uploads/002-Cursor-GitHistory.png)

- Opened the now 847-line TradeLifecycleVisualizer.tsx
- Began working with Claude inside Cursor
- Prompt: “Break this component into smaller, reusable parts”
- Result: ControlsBar.tsx is the first successful extraction

**Afternoon: Deep Component Surgery**

- Continued iterative refactoring  
- Extracted StatusBar.tsx (architecture summary)
- Built TopMetricsBar.tsx (downtime, volume, and time counters)
![003-TopMetrics.png](/uploads/003-TopMetrics.png)

- Refactored layout into TradeFlowGrid.tsx, preserving dual-column logic

![004-DualColumnLayout.png](/uploads/004-DualColumnLayout.png)

By now, I had a fully-refactored version of my code not only in an IDE but also in GitHub. It had manageable, maintainable, logical chunks of code that was much more aligned with good software engineering principles than the monolith I was left with when I concluded Phase 1. A very productive day!

### **Day 8: TypeScript Reckoning**

Today was all about cleaning up warnings and spring-cleaning the code. Ordinarily, this is a tedious job and often takes quite a while as warnings (or even error messages) can take a long time to be understood sufficiently well to enable meaningful change without introducing compromise or, as a last resort, just silencing the warning.

**Morning: The Great Warning Purge**

There were dozens and dozens of warnings such as:

- TS6183: **Cannot resolve return type of exported function expression**
- TS2322: **Type ‘X’ is not assignable to type ‘Y’**
- TS6192:  **All imports in import declaration are unused.**

The first just required an explicit return type to be added to many functions; the second invariably involved confusion between a DateTime as an object and a string representation; the third is just a hint that you have unreferenced variables in the code.

Cursor handled them contextually, applying fixes across files. Not only did it fix the first two warning easily, as part of remedying the third warning, Cursor also removed 47 unused imports, 23 variables, and 12 orphaned props.

**Afternoon: Logic Extraction**

It was now time for further consolidation of the codebase, extracting "business logic" where it made sense to do so, divorcing it from the layout code as much as possible. By the end of the day, Cursor had achieved the following improvements for me:

- Created tradeStages.ts for trade metadata
- Moved simulation code into simUtils.ts 
- Added tradeflowUtils.ts for layout logic and flow validation

I ran the app via Cursor and a local web browser and it still worked perfectly. A great outcome for the day!

### **Day 9: Feature Growth**

Having got the codebase modernised and modularised, it was time to start using Cursor to add some much-needed enhancements and refinements. The morning saw the following enhancements being delivered:

- Added “All On-Prem” and “All On-Cloud” migration buttons
![TLC-005-AllOnPremCloud-Buttons.png](/uploads/TLC-005-AllOnPremCloud-Buttons.png)
- Built visual offset logic for failed cloud instances
![TLC-006-OffsetCloudIInstances.png](/uploads/TLC-006-OffsetCloudIInstances.png)
- Created TradeFlowRateWidget for real-time trade volume control
![TLC-007-RateWidget-Zero.png](/uploads/TLC-007-RateWidget-Zero.png)
![TLC-008-RateWidget-MidValue.png](/uploads/TLC-008-RateWidget-MidValue.png)

Then disaster struck...

I had accidentally moved (or maybe even deleted?) the entire folder containing the refactored files. Oops. Whatever I had done, it was terminal and irrecoverable. Naturally, I had not committed them to the repo by then so there was no chance of getting them back from version control. Another valuable lesson learned.

Thankfully, Cursor stepped in to help me out. With a prompt that went something like "I've just trashed my file structure for the project. Help!", Cursor recovered (or regenerated?) the structure and restored the overwritten files. Catastrophe averted. Thanks, Cursor.

### **Day 10: Polish and Performance**

Today was all about making the UI useful, instructive, intuitive, and something that we could actually show off to clients to demo the benefits of moving parts of their trade processing workflow to cloud. Quite the challenge!

Today's co-operative work with Cursor yielded the following set of improvements:

- Added centralised simulation clock
![TLC-009-CentralisedSimulationClock.png](/uploads/TLC-009-CentralisedSimulationClock.png)
- Downtime counters for each infrastructure stack
![TLC-010-DowntimeOnPrem.png](/uploads/TLC-010-DowntimeOnPrem.png)
![TLC-011-DowntimeCloud.png](/uploads/TLC-011-DowntimeCloud.png)
- Built stage progression speed slider (1–10 simulated minutes per second)
![TLC-012-SimulationTimeScaler.png](/uploads/TLC-012-SimulationTimeScaler.png)
- Added stage-specific capacity configs
![TLC-014-VaryingConstraints.png](/uploads/TLC-014-VaryingConstraints.png)
- Horizontal scaling visualisation for cloud instances
![TLC-013-CloudScalingX1.png](/uploads/TLC-013-CloudScalingX1.png)
![TLC-013-CloudScalingX2.png](/uploads/TLC-013-CloudScalingX2.png)
![TLC-013-CloudScalingX3.png](/uploads/TLC-013-CloudScalingX3.png)
![TLC-013-CloudScalingX4.png](/uploads/TLC-013-CloudScalingX4.png)
- Stacked rendering with visual hierarchy
- Cloud errors now spawn replacements; instances auto-remove after 15–60 simulated minutes

There were still a few minor quirks but you really had to look for them. Something to fix in a future version, perhaps?

### **Day 11: Architectural Closure**

Given that this was an open-ended "research" project, knowing when and how to bring it to a close was always going to be tricky. So far, I had created (with code generated by The Four Cs) a working SPA in React that demonstrated all of the points that I wanted it to (at least for an MVP). The code was managed by GitHub. It was modular, manageable, and maintainable. A pretty decent place to bring this experiment to a close, albeit with a final few changes:

- Flattened refactored/ into a clean components/ directory
- Created Legend.tsx for UI reference
- Added StageComponent.tsx for per-stage logic

I was rather impressed with what I had managed to achieve with my AI coding partners over the last two weeks or so. I knew what I wanted to achieve but lacked any skill in modern UI development. Until fairly recently, realising my goals would have meant working with other people who had the skill to build and develop my vision. The other alternative would have been to teach myself how to build applications using React but that would have taken many months to get to the level of fluency required to build such an app. Working with the AI companions has allowed me to build something awesome, on my own (in human terms anyway), in a few short weeks: this is something that would have been unthinkable even a year ago.

---

## **The Modular Architecture (Post-Refactor)**

The monolith was gone. In its place: a composable, logical structure that looks like this:

**UI Components**

- ControlsBar.tsx: Simulation controls (play, pause, chaos, etc.)
- StatusBar.tsx: On-prem vs. cloud summary with error counts
- TopMetricsBar.tsx: Downtime, volume, and time-of-day metrics
- TradeFlowGrid.tsx: Main dual-column flow layout
- StageComponent.tsx: Logic and visuals for each trade stage
- Legend.tsx: Interface guide and visual key

**Logic and Utilities**

- tradeStages.ts: Metadata and stage definitions
- simUtils.ts: Simulation timing and constants
- tradeflowUtils.ts: Flow validation and positioning
  
---

## **What Made This Work**

### **The Cursor Advantage**  

Unlike browser-based AIs, Cursor understood the _entire project_ rather than just a file or two at a time. It could extract a component and update its imports, props, and types correctly and all in one go. From TypeScript warning and errors to unused props, Cursor offered corrections inline and made it easy to accept those suggestions. 

When I made a mess, Cursor recovered file structure and restored logic. It felt like pair programming with version control, DR, and BCS all baked-in.

### **The Technical Wins**

On-prem failures now block trade flow. Cloud failures spawn replacement instances which disappear after a realistic time delay just like resilient infrastructure should.

Each trade stage has its own pre-defined capacity constraints. The constraints have different values in the on-prem world from the cloud world. The cloud scales horizontally to provide enough horsepower to meet the current demand whereas the on-prem version stalls when overrun, stops the flow and increments the downtime counter.

The system is clock-driven, with stack-specific downtime counters and a user-controlled speed slider. Everything (well... mostly everything) is configurable in the UI. There are some constraints which are defined in the code but these could also be surfaced to the UI, if required.

---

## **What Made This Phase Different**

This wasn’t just a refactor. It was an architectural evolution.

- **One Context, Multiple Capabilities**: No need to explain the same problem three times.
- **Refinement, Not Regeneration**: Improvements built on prior work, rather than replacing it wholesale.
- **Recovery Built In**: Mistakes were recoverable.

Compared to the AI juggling act of Phase 1, this felt integrated. Collaborative. Efficient. I liked it. A lot.

---

## **What’s Next?**

Now that the structure is sound, a whole new set of possibilities opens up. Some of the possibilities for the next phase or phases include:

- **Custom Hooks**: useTradeSimulation will simplify state sharing and unlock testability
- **Component-Level Testing**: The architecture finally allows for proper unit testing
- **Performance Profiling**: With clear boundaries, performance optimisation becomes possible
- **Terraform Integration**: Actual infrastructure-as-code deployments now feel achievable
- **Multi-Cloud Possibility**: A lot of investment banks make use of more than one cloud.

This project started as a means of showcasing Scott Logic's Trade Lifecycle Modernisation service in AWS's Book of Offers and was, therefore, focussed solely on showing how the AWS cloud could help investment banks to modernise their trade processing workflow.

This prototype simulates the cloud element but, with Terraform integration as a possible next step, it would be possible to actually deploy AWS resources in the cloud. Future versions of this tool could be made to deliver Azure, GCP or even other cloud vendor solutions too. Once that has been achieved, solutions involving more than one cloud should also be achievable.

---
## **Final Reflections**

Cursor IDE didn’t just help refactor code. It changed how I approached building software with AI support. From file recovery to modular design, it felt like working with an intelligent coding partner who actually understood what I was trying to build. Genuine pair programming with more than a hint of Star Trek about it!

The result was a transformation: from a single, tangled file into a cleanly-defined system of composable components. That is definitely shifting the needle on rapid application prototyping.

Perhaps more tellingly, it made me want to tell the story. Now that's **really** shifting the needle!

---

_The future of development isn’t just AI-assisted. It’s AI-collaborative._
