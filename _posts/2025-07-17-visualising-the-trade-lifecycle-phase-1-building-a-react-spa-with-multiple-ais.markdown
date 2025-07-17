---
title: 'Visualising the Trade Lifecycle - Phase 1: Building a React SPA with Multiple
  AIs'
date: 2025-07-17 14:33:00 Z
categories:
- Artificial Intelligence
- Tech
- Cloud
- AI
- Development
tags:
- Artificial Intelligence
- Technology
- Cloud
- Development
- AI
summary: A non-React developer built a trade lifecycle simulation using three AI assistants
  as his coding team, discovering that managing AI agents is rather like conducting
  an orchestra where each musician excels at different parts of the piece but occasionally
  abandons the score for a spot of impromptu improvisation. The project demonstrated
  that whilst AI collaboration can be very useful, someone still needs to wave the
  baton when your string section decides to have a go at bebop when they should be
  playing Beethoven.
author: rgriffiths
---

In mid-2025, I set myself what seemed like a straightforward challenge: to build a React Single Page Application that would simulate a hybrid/on-premises trade processing workflow. The idea drew inspiration from Scott Logic's Trade Lifecycle Modernisation service offering (now live on AWS) and aimed to visualise each stage of a trade's journey through the various stages of a trade processing workflow with components both on-premises and in cloud. What unfolded, however, proved to be far more interesting than the application itself: a revealing glimpse into the art of orchestrating multiple AI tools in a single development project.

To provide total clarity and candour, I have never written a line of React in my life. Consequently, this wasn't a chance for me to learn React to build an application. Rather, it was a chance for me to rely completely on an AI assistant to write all the code for me: I provided the business domain knowledge, the vision, the product ownership, and the roadmap: I expected "the AI" to do the rest.

However, rather than rely on just one assistant, I ended up working with an ensemble: ChatGPT, Claude, and Microsoft Copilot Chat *aka* The Three Cs. Each brought distinct strengths, quirks, and occasional frustrations. My role shifted from being the developer to becoming the conductor of this AI orchestra.

This is the story of Phase 1 of that journey. Alas, I didn't keep screenshots of the evolving application but I can promise you a picture or two in Phase 2...

---

## The Vision

The application I wanted to build would simulate a full trading day, compressed into accelerated time. Each second of real time would represent five minutes of market activity. My goals for the system included:

- A trading day from 08:00 to 17:00 simulated in fast-forward
- Trade volume and downtime counters
- Cloud auto-scaling, spawning new instances after 3 seconds (which is 15 minutes of market activity time) and removing failed ones after 12 seconds (or 1h of market activity time).
- Chaos engineering capabilities (manual, random, automatic failures)
- A volume slider (0% to 120%) to simulate changing load where the 120% is meant to represent short bursts of activity over the design capacity (100%) to simulate periods of intense market volatility and activity.
- A hybrid layout showing on-premises and cloud components clearly

What I hadn't anticipated was that the process of building this would become as compelling as the application itself.

---

## Why Multiple AIs?

The choice to use multiple assistants wasn't strategic at first. It was a mix of curiosity coupled with the more pressing realities of free-tier usage limits. Each AI had its own distinct "personality traits" (let's call it that), some distinct strengths and, on occasion, some weaknesses. Overall, though, each AI showed clear and distinct tendencies:

**ChatGPT** was the systems thinker. It excelled at high-level architecture, simulation logic, and scaffolding React components. I used this either via the web interface or through the ChatGPT app on my Macbook Pro.

**Claude** brought depth and visual awareness, especially in hybrid layout design and iterative interface development. It was my go-to for architectural refinement and interface logic. This was web interface only.

**Copilot Chat** proved strong in implementation and refactoring. It was dependable when it came to converting prompts into modular, production-ready code. Microsoft Copilot Chat could work with larger files and had a more generous daily limit. Note that this wasn't GitHub Copilot - this was just the M365 version via the web portal.

This division of labour quickly became a strength. Orchestration, i.e., managing the interplay of these assistants, became the core skill.

---

## The Development Timeline

What follows is a roughly chronological account of how the application came to life, showing which AI contributed to which aspect. My own memory was supplemented by data collected from each of The Three Cs retrospectively. That little side note will appear as its own blog at some point in the future.

### Day 1: Simulation Foundations (ChatGPT followed by Claude)

The brief had started as a text-based GraphViz depiction of a trade lifecycle that I had created previously as part of the Trade Lifecycle Modernisation Service Offering project.

"I want a single page application that depicts the process workflow of a typical trade lifecycle process within an investment bank as mapped out in the accompanying GraphViz file"

ChatGPT did a reasonable job at parsing the file and creating a rudimentary and static React SPA but I had, by then, run out of free tier usage so I moved over to Claude for the next refinements and embellishments.

Asking Claude to refine the app further, Claude responded with:

- A phased roadmap (static → dynamic → Terraform integration)
- Hybrid layout logic (on-prem/cloud split)
- Technology stack suggestions: React, D3.js, WebSockets
- Clean architectural principles

Suddenly, the simulation had a direction and some code... but I could only see the outcome in Claude's web portal! I needed to see this on my own computer so some additional guidance was now required for the author in how to set up a React project and debug it as it was not a technology that I had used before. So, back to the AI for some more help.

### Day 2 Morning: Project Setup (Claude)

With no prior React experience, I turned to Claude for scaffolding support.

"Help me create a fully functional dev environment with Visual Studio Code as the primary IDE so that I can build and run this React SPA on my own laptop"

Claude delivered:

- Vite + React + TypeScript setup
- ESLint, Prettier, and hot reload
- Full project structure, with launch instructions

After a lot of downloading and packaged installations (thank you homebrew and npm for making it easy), I was ready. My laptop now had the means to run what the AI was generating and I could finally test the outputs directly.

### Day 2 Afternoon: Layout Logic (Claude)

Continuing with Claude, I worked with it to add an easy way where I could migrate a piece of the workflow from the on-premises world to cloud (and back again) using a relatively short prompt such as: "Add click-to-migrate which must work both ways, i.e., if the item is on-prem then it moves to cloud and vice versa."

This unlocked the visual language where Claude and I iterated over a whole raft of visual tweaks and improvements which resulted in the following enhancements:

- Hybrid layout design
- Directional trade flow arrows
- Custom component state management
- Fixed vertical alignment between environments
- Placeholder logic for migrated components

It started to look and feel like a real application or, at the very least, a working prototype I could build on.

### Day 3 Morning: Unifying the Views (Claude)

Originally, I had separate layouts for on-premises, cloud-only, and hybrid. I realised that a single hybrid view could show all three cases, i.e., all on-premises, all in cloud, and a bit of both. Claude helped me consolidate these into a single hybrid view, adding some migration buttons along the way, and also with:

- Downtime timers (for on-premises errors)
- Alternate routing (for cloud errors)
- Trade volume counter
- Simplified interface logic

This significantly reduced complexity without sacrificing clarity and made for a much more streamlined UI.

### Day 3 Afternoon: Button Logic (Copilot Chat)

On playing around with the React GUI, I realised that the chaos engineering element was rather lacking: it put some red highlighting around the boxes that were affected but there wasn't much more to it than that as all of the errors auto-resolved after a short period. What I really wanted was for on-prem errors to stay in error state until the error had been resolved manually. However, for the cloud-based systems, I wanted to demonstrate the fault-tolerance of a well-built, cloud-native system so these errors were allowed to auto-resolve after a short amount of time.

Here's where necessity drove innovation. Claude's free usage window had closed, but I wanted to maintain momentum. Copilot Chat stepped in to refine the interface:

"Replace click-to-migrate with Migrate and Error/Resolve buttons per stage."

Copilot Chat provided:

- Migrate and Error/Resolve buttons for each stage
- Logic ensuring on-premises errors block entire flow
- Cloud errors with auto-resolution after delay
- Updated TSX, CSS, and component properties

However, wider context needed repeating. The AI understood the code, but not the story. This is one of the recurring problems when working with multiple AI agents: you find yourself repeating a lot of text (and burning through a lot of tokens to boot) just to get the new AI up to the point where you got cut-off with the previous AI. The joys of working with the free tier!

### Day 4 Morning: Cloud Auto-Scaling Visuals (Claude)

Today, I wanted to show off the cloud's ability to scale (both up and down) in a dynamic and *visual* way. In addition, some additional performance-related metrics for display alongside the other counters could also be a useful tool to demonstrate the benefits of a cloud-based solution over a fixed-capacity, on-premises system.

The prompt for the morning (along with refinements and tweaks thereafter) was: "Visualise cloud auto-scaling and add performance metrics."

Once Claude was available again, and having updated its context with a fresh copy of the React file, I used it to create and enhance the following:

- Cloud instances scaled visually with parallel rendering
- Integrated clock and performance counters
- Automatic removal of failed instances
- Integrated metrics counters
- Clock and instance timers

The hybrid model now had motion and life: flowing trades in a different colour, ticking clocks, reactive downtime timers and other metric counters. I also had to add a variety of reset buttons to ensure that the UI could be wound back to the beginning of the day (and zero trades) easily without having to restart the app.

### Day 4 Afternoon: Lost Features (Claude)

Somewhere along the way, some of the functionality that was already created was dropped or glossed-over in a second or third pass. This appears to be a theme across all of the AI engines that I used. It's as if they've genuinely "forgotten" (yes, yes, I know!) what has been done before or maybe there's a bias towards generating something new (and often lesser) when asked to do something again.

On a side note, complex requests that require the engine to give you a precis of the ask followed by an outline of the plan that the AI will work on (before you then have to say yes to their suggestion...) often generates a feature-lite prototype of what was asked for rather than the full implementation. Is this a way of making use of fewer computational resources? Who knows? The outcome, though, sadly, is that you have to do some more to-and-fro-ing in order to achieve the same result. I also noticed that, on occasion, there was just *no way* to get the AI engine out of its prototype *funk* and it was just never going to generate the fully-implemented code that you hoped for: those moments are *AI Engine-Switching* moments, for sure!

Back to the story... so the rest of the day was asking for re-implementations (with improvements) of functionality that had already been implemented once before. Sigh.

Still with Claude, the prompts included "Add Migrate and Error/Resolve buttons" which, not only had been done before, but also required several more iterations to restore the previous behaviour, which was a bit of a drag.

The eventual outcome was that all of the "lost" functionality was now restored along with these additional refinements:

- Comprehensive state management for error conditions
- Visual feedback with red and yellow state indicators
- Flow-blocking logic reflecting real-world constraints

The lesson: AI can forget and AI can also ignore your requests no matter how many shouty capitals you use!

### Day 5 Morning: Refactor Planning (Claude)

I realised with horror this morning that the main component had now grown to 600+ lines. It was a mess! It was time for a refactor so who better to ask for help than my new best friend, Claude.

Claude's response to a prompt like "Refactor monolithic TSX file into maintainable modules" was architectural gold, although it was all suggestion about what to do at this point rather than actual implementation:

- Custom hooks: `useTradeSimulation`, `useErrorManagement`, `useMigrationState`
- Modular component structure
- Comprehensive inline documentation
- Clear separation of concerns

The next step was to agree to its suggestion and ask Claude to implement the changes. However, Claude failed spectacularly in the implementation. It just couldn't do it no matter how often it tried. Every iteration, something new was added or corrected but to the detriment of something else. It felt like a computational hokey cokey!

```
You put one feature in,

You take another feature out,

You shake up the structure,

And it all turns about...
```

It seemed like the AI had somehow lost track of the global context and that the monolith built by AI could no longer be broken down sensibly without unexpected side effects. What started well in the early days now felt like it could never be complete nor stable: every round of regeneration was more like turning in a circle rather than moving forward. This was a rather disappointing end to the morning's work but things would improve after lunch - not that I knew that at the time, of course.

### Day 5 Afternoon: Refactor Execution (Copilot Chat)

Claude had provided the strategy but I didn't feel comfortable doing the implementation myself so I needed some more AI help with the implementation phase. However, the file was now so large that parsing it used up the entire free tier on Claude. That was a rather sticky impasse.

Without knowing the actual limits allowed by my various free-tier accounts (and having already run out of Claude credits for the day), I turned to Copilot Chat as I suspected that Copilot Chat had the biggest allowance for file ingestion and analysis due to our M365 licence tier. So, with Claude's plan in hand along with the monolithic monster of a TSX file, I turned to Copilot Chat for the hard graft of executing the refactor plan:

Claude's plan had suggested the following restructure:

- `TradeLifecycleVisualizer.tsx` (main component)
- `StageComponent.tsx` (reusable stage logic)
- `Controls.tsx` (simulation controls)
- `ArchitectureStatus.tsx` (system status display)
- `TradeFlow.tsx` (flow visualisation)
- `Legend.tsx` (interface legend)
- `utils.ts` (shared utilities)

Copilot Chat gave me a fully refactored version. The codebase had transformed from prototype to maintainable architecture although, sadly, it too was missing several components. Copilot Chat, like Claude, had decided to give me just skeletons or shells for certain functions. Seemingly, this was a trickier ask than I had imagined but I knew it was possible because "Refactoring" is something that human software developers do frequently - it just takes us humans a fair amount of thinking and doing time!

Having had some glimmer of hope in the early afternoon, the whole day was rather a disappointment as I had made no demonstrable progress and now had a set of files that could become the basis of a well-designed software project (although it contained very little substance) and I also had a behemoth of a file that contained all of the functionality I had created with The Three Cs but was no longer manageable nor maintainable.

### Day 6: Integration Attempt (ChatGPT)

Having had a few days away from the project, I decided to have a go at blending the functionality in the existing 600+ line monolith with the features and architecture of the new design.

Back to ChatGPT: "Merge the simulation logic from the monolith into the new structure."

The first attempt was disappointing. ChatGPT returned a simplified prototype rather than proper integration. This required yet more human intervention, pushing back on the AI's tendency to oversimplify and demanding a complete solution - over and over and over again.

This was not a success and I was now left with just a mess.

It was time to give it a break for now... and come back to it when I was ready to tackle all of this again.

After multiple failed attempts, I reverted to my "last known good": the 600+ line monster. It might have been messy, but it worked. It worked well enough... but it wasn't a well-designed software project; it wasn't designed according to good software engineering principles; it was not easy to modify or maintain. However, I'd run out of free token space to do anything with it so I concluded my investigations... The refactoring could wait for another day which will be discussed in Phase 2 of the blog.

---

## The Art of AI Orchestration

What made this development process unique wasn't just the use of multiple AI tools: it was the deliberate orchestration of their capabilities. Several patterns emerged:

**Tool Switching by Availability**: When Claude's free tier reached its daily limit, I switched to Copilot Chat. When I needed architectural synthesis, I returned to ChatGPT. Momentum was everything and managing this handover was a deliberate strategy to enable this.

**Strength-Based Assignment**: Each AI excelled in different areas. Claude for architectural thinking, ChatGPT for synthesis and planning, Copilot Chat for code generation and (some lightweight) refactoring.

**Human-in-the-Loop Quality Control**: The AIs occasionally took shortcuts or misunderstood requirements. All three assistants made assumptions. I had to nudge, refactor, and reiterate. Over and over and over again. My role became one of quality control, i.e., challenging responses that didn't meet (my) standards and providing the context needed (multiple times!) to maintain consistency across tool switches.

**Contextual Handoffs**: Successfully switching between AIs required providing sufficient context about what had been built previously. This documentation became crucial for maintaining project coherence.

---

## Technical Architecture

The final architecture of Phase 1 consisted of two permanent containers representing On-Premises and Cloud environments. Each trade lifecycle stage could migrate between these environments, with arrows showing the flow of trades including cross-environment transitions along with real-time status indicators.

Cloud components demonstrated auto-scaling capabilities and could reroute around failures, while on-premises components would block the entire trade flow until errors were resolved. This created a realistic simulation of hybrid infrastructure challenges.

The visual interface included real-time clocks, trade volume counters, downtime tracking, and interactive controls for chaos engineering. The entire system ran in accelerated time, compressing a full trading day into a manageable demonstration.

---

## What I Learned

**Multi-agent workflows are not just possible, they're powerful.** Each AI brought distinct capabilities to the project, and the sum was genuinely greater than its parts.

**Failures still happen**. Just because you're using an AI, it doesn't mean that failures won't happen!

**Documentation matters more than ever.** When working with multiple AIs, maintaining clear documentation of what has been built and why becomes crucial for successful handoffs.

**Human judgement remains essential.** While the AIs were remarkably capable, they occasionally made assumptions or took shortcuts that required human intervention to correct.

**Availability constraints drive innovation.** The need to switch between tools due to usage limits forced me to think more strategically about which AI to use for which tasks.

---

## Looking Forward

As Phase 1 concluded, I thought the project was complete. The simulation worked, the code was modular (well... sort of...), and the visual interface effectively demonstrated the concepts I had set out to explore. My trusted trio of AI companions (*aka* The Three Cs) had served me well, each bringing their own strengths to the development process.

But then Cursor IDE arrived like D'Artagnan joining The Three Musketeers, and everything changed.

In Phase 2, I'll explore how Cursor's integrated LLM chat, context-aware suggestions, and IDE-native workflows transformed the development process once again. What had been a capable trio became something greater, proving that sometimes it takes a fourth member to unlock the group's true potential, a bit like when Ringo joined Paul, John, and George.

The story of multi-AI development was just beginning.

---

*Next: Phase 2 — Refactoring with Cursor IDE: When Your Editor Becomes Your Navigator*

