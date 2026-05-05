---
author: wtrimble
date: 2026-04-29 00:00:00 Z
title: Building an AI-Powered Exploratory Tester
categories:
- Testing
- Artificial Intelligence
tags:
- Testing
- Transformation
layout: default_post
summary: What happens when you point an AI agent at a web application and tell it to test like an experienced human? This post is the story of an experiment that started with a simple question from my test team about their future. Their concern resonated with my own experience of seismic shifts in our industry; from dumb terminals to serverless, I've seen technology change, but the people with transferable skills endure. This project honed in on the unique value of exploratory testing and ended up revealing some uncomfortable truths about the future of our industry.

---




# Building an AI-Powered Exploratory Testing Agent: What I Found

*What happens when you point an AI agent at a web application and tell it to test like an experienced human? This post is the story of an experiment that started with a simple question from my test team about their future. Their concern resonated with my own experience of seismic shifts in our industry: from dumb terminals to serverless, I've seen technology change, but the people with transferable skills endure. This project honed in on the unique value of exploratory testing and ended up revealing some uncomfortable truths about the future of our industry.*

---

## The Problem: Exploratory Testing Doesn't Scale

What started this wasn't a technical problem. It was a conversation with my test team, and the mood was tense.

"Do we have a future? How do we adjust? AI is powerful and it's going to replace us."

That concern, genuine, worried, and shared by testers across the industry, is what motivated this entire exercise. I was skeptical about the whole idea myself. My goal wasn't to prove them wrong, but to find out what the answer actually looks like. My journey to answer them led me to build an AI agent focused on a uniquely human skill: exploratory testing. This is what I found.

I should be honest about my own expectations: I thought the exploratory tester would be a complete failure. A fun experiment that proved AI wasn't ready for anything beyond deterministic test generation. I even built my own test application as a control (one of my earliest experiments with AI dev tools): a multi-tenant booking platform, 5 roles in an RBAC model with a user management module, tenant specific content management and a task management module with stubs to emulate contact and billing systems. This was designed with known, deliberate bugs seeded throughout, so I'd have ground truth for what the explorer should find. I knew exactly where the bugs were and could measure what the agent caught, what it missed, and what it found that I hadn't planted.

Building the control app was revealing in its own right. I built it mostly with Copilot and Claude, and the experience gave me a front-row seat to the "hallucinated coverage" problem I describe later in this post. The AI-generated test suite that came with the app looked comprehensive: good coverage numbers, green across the board. But when I compared it against the bugs I'd deliberately seeded, significant gaps were obvious. The tests verified the happy paths thoroughly and missed the adversarial cases entirely. Several tests were effectively tautological, asserting that the code did what the code did, not that the behaviour was correct. Test *value* was dramatically overinflated because no human had reviewed whether the tests were actually testing anything meaningful. That experience alone validated the need for an external, behaviour-level check: something that tests the deployed system without sharing the same blind spots as the code that built it.

I was wrong about the failure part. It has performed significantly better than I expected, finding real bugs that matter, across roles and permission boundaries, for pennies per run. But the premise that AI will *completely replace* human testers? That's been thoroughly debunked by the same exercise. The tool is impressive at execution but limited at strategy. It can navigate every page and try every edge case, and it produces useful risk assessments and test plans for each session, but it can't decide which pages matter most to the *business* or why. The strategic direction still comes from humans. That split (better than expected at doing, exactly as limited as expected at thinking) is the answer I was looking for.

The technical problem came second: exploratory testing is one of the most effective ways to find real bugs (the kind that scripted tests miss) but it's expensive, time-consuming, and doesn't scale. You need experienced testers with domain knowledge who can exercise judgment, follow hunches, and dig into areas that "don't feel right." When you have one application with a handful of roles, that's manageable. When you're testing a multi-tenant SaaS platform with platform admins, tenant admins, regular users, and back-office support, each with different permissions, workflows, and edge cases, the combinatorial explosion hits hard.

I wanted to know: **what if an AI agent could do exploratory testing the way an experienced tester would?**

My first attempt was revealing. I built the testing tool in the same repository as the control application.  Copilot, with full access to the app's source code, followed its natural instinct and generated a set of role-based Playwright scripts before wiring them into a CI pipeline. Solid, deterministic, conventional test automation. Exactly what you'd expect from a tool that can see every route, every component, every permission check in the codebase.

But it wasn't what I'd asked for. I'd asked for *exploration*, and Copilot gave me *scripted verification*. It produced tests bounded by its understanding of the code: tests for the routes it could see, the roles it could infer, the flows it could trace statically. What it couldn't do was behave like a tester who doesn't know exactly what the app does and is trying to find out by poking at it.

That experience crystallised the distinction. The tool that became Exploratory Tester had to be *separated* from the target application's source. It couldn't know the code. It had to know the *domain* (how booking systems work, how RBAC typically fails, what multi-tenant architectures get wrong) and then go find out whether this particular application gets those things right. Not by reading the source, but by using the application the way a user would.

**Exploratory Tester** was born from this: a tool that pairs LLMs (Google Gemini, or any OpenAI-compatible model including local ones via Ollama) with Playwright's browser automation via the Model Context Protocol (MCP) to autonomously explore and test web applications. It is genuine exploratory testing: navigating the app, making judgments about what to test next, prioritising high-risk areas, investigating anomalies, and producing a structured report with steps to reproduce.

---

## But Don't We Already Have AI-Generated Tests?

A fair challenge. Tools like Copilot and Devin have full code context: they know every function, every branch, every edge case in your source. They generate deterministic unit and integration tests that are repeatable, fast, and excellent for regression safety. So where's the value in a non-deterministic explorer?

**Deterministic tests verify what you intended works as intended. Exploratory testing discovers what you didn't intend.**

Think of it as the difference between CSI and Columbo. Copilot and Devin are CSI: they have the lab, the forensics, the full evidence chain. They know the codebase and can systematically verify every function against its specification. Thorough, precise, essential. The explorer is Columbo: shabby raincoat, no apparent plan, wandering around asking seemingly naive questions. "Just one more thing... what happens if a regular member types this admin URL directly?" It looks less sophisticated. But it catches what the lab missed, precisely because it doesn't start with assumptions about where the evidence should be.

The distinction matters because the two approaches have fundamentally different blind spots:

**It tests the deployed system at the behavioural layer, not the source code.** Unit tests verify `cancelBooking()` returns the right status code. The explorer found that the API returns 200 but the frontend doesn't update: the cancellation "succeeds" but the booking stays on screen as "confirmed." That bug lives in the *integration between* components that individual tests don't cover. Copilot knows your code; the explorer knows how SaaS platforms, RBAC, multi-tenant architectures, and booking systems *typically* behave, and flags departures from those patterns based on domain experience.

**It finds what nobody thought to test.** A developer writing tests thinks: "admin can access `/admin/settings`, member cannot." The explorer, operating without that assumption, just tries navigating a member to every URL it discovers: including ones nobody explicitly listed as protected. It found tenant admin pages accessible to regular members via slug manipulation. No unit test existed for that path because it wasn't in anyone's threat model.

**Non-determinism is the feature, not a bug.** Each run takes different paths, interacts in different order, encounters different application states. A deterministic test suite runs the same assertions every time: perfect for catching regressions, useless for discovering new failure modes. The explorer's variability mirrors what real users do: unpredictable sequences of actions that expose hidden assumptions.

**Data-driven discovery can't be scripted in advance.** The agent sees a tenant slug on a page and immediately tries `/that-slug` in the URL bar. It sees an entity ID and swaps it for another. It spots credentials in an admin panel and tries logging in with them. A static test suite can't adapt to runtime data it hasn't seen yet.

The shape-of-coverage argument still applies, and the explorer's role is to *strengthen it*. I've never been keen on the rigid "testing pyramid" framing: the right shape depends on the application. Sometimes it's a pyramid; sometimes a diamond, when the integration layer is where the real risk lives; sometimes something stranger again. The principle that survives the shape debate is simpler: push each test to the layer where it's most effective and most efficient, and accept the trade-offs honestly. Unit and integration tests deliver deterministic, fast, cheap verification of *known* behaviours. Contract tests verify API agreements between services. Exploratory testing sits above all of these as a discovery layer: it finds *unknown* behaviours that none of the deterministic layers caught.

Critically, the value isn't just individual bug reports; it's **pattern discovery**. A single bug is a data point. Multiple related bugs reveal a missing *category* of testing, not one test to backfill, but an entire suite to create. A mature dev team asking the right questions of their own AI tooling could surface some of these patterns at source: "generate tests for every protected route against every role" is exactly the kind of systematic instruction Copilot can follow. The explorer's pattern discovery is most valuable when that discipline doesn't exist yet, or when the patterns span boundaries that no single team owns.

Consider the real examples:

- The **cancelBooking** bug (API returns 200, frontend stays "confirmed") isn't just a missing integration test for one endpoint. It reveals that *no* integration test verifies frontend state after *any* API mutation. That's a new suite: "for every state-changing API call, assert the UI reflects the new state." Suddenly you're writing tests for updateBooking, createBooking, deleteUser: all the same pattern.

- The **tenant slug IDOR** isn't just "add a test for `/tenant-slug`." It reveals there's no authorisation test suite that systematically checks every endpoint against every role. That's a new suite: "for every protected route, for every role, assert the expected access control." That single discovery might generate dozens of parameterised tests.

This is the real feedback loop: the explorer runs against the deployed system and discovers bugs; each bug reveals a missing *category* of coverage; a new test suite is created to systematically cover that pattern; the explorer's next run skips the now-covered ground and discovers the next pattern. The explorer doesn't just find bugs: it finds the *shape* of what's missing.

The definition of what to test is a living record of this loop. "Form field validation: comprehensively covered by unit tests. Do not spend iterations." That directive exists because a human has assessed the risks associated with the organisation's development approach and determined that unit tests already handle it, or because earlier runs confirmed that assessment. The explorer spends its budget on multi-step authenticated workflows, permission boundaries, and cross-role interactions: exactly where the deterministic layers have the biggest blind spots, and exactly where the next round of test suites will come from.

### The Value Depends on Your Team's Maturity

Not all teams will get the same thing from the explorer, and that's the point. Its value shifts depending on how mature a team's relationship with AI development tools is.

**Mature teams (human-in-the-loop, disciplined AI usage)** likely have good deterministic coverage already. Developers review AI-generated tests, verify they're meaningful, and maintain them. For these teams, the explorer's value is in the *subtle* gaps. It's a refinement tool that finds the cross-boundary patterns even experienced developers miss: the integration seams, the permission edge cases, and the multi-step workflow failures that no single service's test suite covers.

**Less mature teams (AI-assisted but with weak review)** may have what looks like good coverage on paper but contains significant blind spots. AI-generated tests tend to test the happy path thoroughly and miss the adversarial cases. Tests may verify that an endpoint returns 200 without checking what side effects actually occurred. For these teams, the explorer acts as an *audit*: it reveals the gap between perceived coverage and actual coverage.

**Teams with no human in the dev loop** face the worst case: **hallucinated coverage**. When AI generates both the code and the tests without meaningful human review, the tests and the implementation share the same blind spots. Coverage metrics look healthy, the test suite is green, but the deployed application has real bugs the suite is structurally incapable of finding because nobody designed it to look for them.

For these teams, the explorer is a reality check. It tests the *deployed system*, not the source code. It doesn't care what the test suite claims to cover. It navigates the actual application, clicks actual buttons, submits actual forms, and reports what actually happens. A grounding rule in the system prompt enforces that every claim in its report must be backed by an actual browser interaction: if it hasn't navigated to a page and taken a snapshot, it can't report on what's there. So when the test suite says "authorisation is covered" but the explorer walks a regular member into an admin panel via URL manipulation, the gap between claimed coverage and real coverage becomes undeniable, and grounded in evidence rather than inference.

This maps to a broader truth about AI-assisted development: the less human judgment in the loop, the more valuable external verification becomes. A mature team with strong review practices catches most issues during development. A team that rubber-stamps AI output needs something outside the code-and-test generation loop to tell them what's actually broken. The explorer, by operating at the deployment layer rather than the code layer, provides that independent perspective.

Major change hits teams regularly, and the emotional arc is remarkably consistent each time. I've watched it through the shift from dumb terminals to client-server, from waterfall to agile, from manual testing to automation, from on-prem to cloud, and now from automation to AI. The initial reaction is fear: "the machine is coming for our jobs." Then comes skepticism: "this thing is never going to do what we do." The turning point is always the same: the moment the new approach delivers something the old one couldn't. In this case, it was a genuine, subtle, critical bug that the human testers had missed: Columbo wandering back into the room with "just one more thing" while everyone else had already filed the case. The mood shifts from fear to curiosity, and then to collaboration. People start shaping the tool, feeding it context, using its output to justify work they wanted to do anyway. The tool doesn't replace them; it becomes a force multiplier that takes on the repetitive grind, freeing them to do the strategic thinking they excel at.

My own journey on this project followed the same arc. I was enthusiastic when I first started building the agent, delighted that my life experience was becoming useful again without needing to worry about my coding skills. Then came the bad days, when the tech simply refused to comply with seemingly simple instructions. Those highs and lows are normal on any project, and it turns out they still exist when AI tooling is in play.

---

## The Economics

The headline is simple: a full multi-role exploratory run against a non-trivial SaaS application costs roughly the price of a coffee, and a human tester covering the same surface (multiple roles, permission boundaries, multi-step workflows) takes days. I'll go deeper on real numbers in later posts as the tool evolves and the data matures, but the order-of-magnitude gap is what matters here. The explorer does the exhaustive, repetitive, role-by-role grind cheaply enough to run overnight, on weekends, or on every deployment, files findings straight into GitHub as issues with severity labels and deduplication, and produces machine-consumable reports that dev agents can act on directly.

It's a **probabilistic discoverer, not a deterministic coverage engine**. Each run finds a different subset of issues. Because runs are cheap, you can afford to repeat until coverage accumulates rather than demanding it in one pass. The explorer's economics make repetition the strategy, for now. Repetition is the cheap answer to non-determinism, but it's not the smart one. The world the explorer is testing keeps changing while it runs: features get pulled, hot deploys land on the test rig mid-session, the human spots a category of risk that wasn't in the original scope. A static harness can't react to any of that; it can only be re-run with new inputs. A future post in this series picks up this thread: the explorer becoming an MCP-exposed tool driven by an agent that can be steered midflight by humans or by deployment events, learning and re-prioritising while the run is still in progress instead of waiting for the next one.

The human is still in control. The explorer doesn't aim itself. A human decides which roles matter, what context to provide, what to skip, and what to look for. The explorer is the weapon; the human is the targeting system.

### Keeping the Targeting System Sharp

But there's a nuance worth noting: the explorer already has broad testing instincts baked into its system prompt: it will probe IDOR, check permission boundaries, try data-driven exploitation, and test edge cases without being told. You don't need to write "probe entity IDs across tenant boundaries" into your context docs; the agent does that anyway. What the human *does* control is the higher-level framing: which areas of the application deserve the most iteration budget, what business context makes certain failures more critical than others, and what the application's specific risk profile looks like. The explorer's generic testing instincts are strong. The human sharpens them into *specific* testing priorities.

The IT landscape moves fast. New architectural patterns (serverless, edge computing, AI-generated code), new vulnerability classes (prompt injection, supply chain attacks, dependency confusion), new deployment strategies (GitOps, progressive delivery, service mesh), new compliance requirements. The tester needs to keep up, or their context docs will have blind spots that propagate directly into the explorer's blind spots.

This is where AI tools (not the explorer itself, but the broader ecosystem) help the human stay current. Copilot and code assistants explain unfamiliar architectures and failure modes in minutes; AI-assisted threat modelling proposes integration risks the human then curates; vulnerability summarisation keeps historical bug docs aligned with emerging attack patterns; and after each run, an AI assistant can help synthesise findings into structural insights that feed back into the next iteration's context. The AI proposes; the human disposes. Each cycle sharpens both the human's expertise and the explorer's targeting.

This also addresses the team maturity question from a different angle. A less experienced tester, armed with AI assistants to help them understand architectures and threat models, can write context docs that approach the quality of an experienced tester's. The floor rises. The explorer makes exploratory testing *execution* accessible to any team; AI assistants make the *expertise* needed to aim it effectively accessible too.

A human tester's judgment is also still superior for synthesis: "this cluster of UX issues suggests the design team and backend team aren't communicating." The explorer can't make that inference. But the explorer can run every night cheaply enough to be unremarkable, catch the regressions that slipped through, and free the human tester to do the higher-order thinking that no amount of token budget can replicate.

## What I've Learned

### It operationalises Quality Engineering
"Quality Engineering" gets mentioned a lot in our industry: often as an aspiration, sometimes as a rebrand of the same QA function with a new title. The explorer makes it concrete by operationalising what QE actually *means*:

**Risk-based prioritisation.** The iteration budgets per role (platform admin: 500, guest: 50) and the testing scope are explicit risk encoding. QE's core premise is that quality effort should be proportional to business risk. The explorer makes this configurable and transparent rather than implicit in a tester's head.

**Quality intelligence over bug counting.** The "these three bugs are symptoms of the same missing test suite" synthesis is QE thinking: not "we found 12 bugs" but "we have a structural gap in tenant isolation coverage." The context files and historical bugs feed this loop: each run's findings inform the next run's strategy.

**Cross-functional quality ownership.** Developers can contribute to historical bug reports. Product owners can influence the testing scope. Security can write the security scope. Quality input isn't locked behind a QA team: it's collaborative context curation. The tool doesn't care who wrote the context; it cares that the context is expert.

**Measurable, observable quality process.** Token tracking, dashboards, run comparisons, and structured reports make the testing process itself observable. You can answer "are we testing the right things?" with data: not opinion, not gut feel, but actual coverage patterns and finding distributions across runs.

The thread that ties this together: Quality Engineering says quality is an engineering discipline with feedback loops, data, and continuous improvement, not a gate at the end. The explorer operationalises that by making exploratory testing repeatable, measurable, cheap, and configurable by the people closest to the risk.

### It's a discovery tool, not a pipeline gate
The explorer tests *deployed* systems. It can't replace deterministic tests for per-commit verification, but it doesn't need to. Its natural home is a nightly or per-release sweep against a real environment: run it overnight, review findings in the morning. For CD pipelines, it catches emergent issues from accumulated changes. For scheduled releases, it gives you a behavioural check of the release candidate for pennies. For complex cloud-native architectures where standing up realistic test environments is expensive, it extracts value from infrastructure you've already deployed. A companion post on where the explorer fits covers the pipeline positioning in detail, including feature flag testing, cloud-native architectures, and local vs cloud LLM trade-offs for CI runners.

### Context quality dominates model quality
A well-written application context with domain knowledge, a focused testing scope, and accurate historical bug data do more for result quality than switching to a more expensive model. The agent is only as good as the context it operates with.

### Multi-role testing reveals permission boundary bugs
Running the same app with different personas concurrently is where the tool really shines. It catches cases where a regular member can access admin functions, or where cross-role interactions (admin approves a booking submitted by a user) break in unexpected ways.

### Iteration budgets need tuning per role
A maintenance role with a handful of capabilities needs 50 iterations. A platform admin managing tenants, users, payments, and configuration needs 500. Flat budgets waste resources.

### Cost management is a first-class concern
Context caching reduces the per-iteration cost of the large system prompt. Conversation compression keeps working context manageable. Token usage logging and cost dashboards make it possible to budget and optimise. At current frontier-model pricing the cost stays low enough to run on every deployment; with local models via Ollama, it drops to zero (minus electricity). I'll publish concrete numbers as the tool evolves; "stable" isn't a state I expect to reach any time soon, given how fast the underlying models, pricing, and capabilities are moving.

Teaching the agent to "think like a tester" about observed data (slugs become URL paths, IDs become IDOR candidates, visible emails become login attempts) dramatically increased the depth of testing. Surface-level page exploration found real bugs, but data-driven exploration found *deeper* bugs: tenant isolation failures, authorisation boundary issues, IDOR vulnerabilities.

### The biggest shift isn't technical: it's about who decides what matters
Building this tool crystallised something I think will define the next era of software testing, and it echoes lessons I've learned from every major industry shift I've witnessed. Twenty-six years of consulting work, much of it spent running training programmes, conducting assessments, and being parachuted into red programmes to help stabilise them, gives you a particular vantage point: you see the same failure modes recur across clients, sectors, and technology generations, and you learn to recognise them before the team inside the programme can. I've seen organisations replace people who had outdated tech skills but deep, real-world experience with new, inexperienced teams who only had modern tech skills. Those teams did well until the project hit real trouble. They were left with people who could only operate on well-run projects; nobody had the experience to identify when things were going wrong or the wisdom to turn them around. Transferable skills endure. The technical execution of testing (writing a Playwright script, parameterising test data, setting up assertions) is rapidly becoming commodity work. Copilot can generate a test suite from a spec. The explorer can run hundreds of test interactions for pennies. The *execution* is automated or automatable.

What can't be automated is the judgment layer above it: *which* risks matter for this product, *what* the context documents should say, *where* the iteration budget should be concentrated, *why* this application's multi-tenant permission model is the highest-risk area while form validation is safely covered by unit tests. The definition of testing scope doesn't write itself. The decision to give platform admin 500 iterations and guest 50 is domain expertise, not configuration.

Often that judgment cuts the other way. The most valuable thing an experienced tester says often isn't "we need more coverage here"; it's "this doesn't need an end-to-end test, the unit and integration layers already cover it, spend the budget elsewhere." Knowing where coverage is *redundant* matters as much as knowing where it's missing. I find myself spending more time these days arguing for tests to be removed, or pushed to a different layer where they're cheaper and faster, than I do asking for more time to add coverage. It's a sign of maturity, both in a team and in a tester: the goal stops being "increase the bug count" and becomes "directly address the risk." That instinct, to *remove* tests, to recognise that an e2e suite is duplicating what a contract test already proves, comes from years of watching test estates rot under their own weight. It's invisible to anyone counting tests, and it's exactly the kind of judgment the next generation needs to learn.

This maps to a broader industry shift from **technical competence** to **strategic orchestration**. The value of a tester (or a developer writing tests) is moving from "can produce a working test" to "knows what to test, why it matters, and how to aim the tools." The explorer makes this tangible: its output quality is bounded by the quality of human decisions encoded in context files. The same agent, same model, same iteration budget produces mediocre results with generic context and excellent results with expert context. The human's expertise didn't go away: it moved from the keyboard to the configuration.

If this sounds familiar, it should. I started with SQARobot in 2000: record and playback. You'd record a click-through, play it back, and it would break the moment anything changed. The natural evolution was to move from recorded scripts to programmatic test definitions, but the real complexity didn't live in the test code. It lived in *setting up the environments* so the tests could actually run: getting the right database state, service configuration, user accounts, feature toggles. The test itself was the easy part. Making it *executable in a repeatable context* was the hard part. Before Selenium and QTP became mainstream, the valued skill was *manual test execution*: a tester who could methodically click through hundreds of test cases, document results, and find bugs through patient repetition. When automation arrived, that execution skill was commoditised. The testers who thrived stopped clicking and started *designing*: deciding what to automate, structuring suites, building frameworks, defining coverage strategies. The ones who clung to manual execution got displaced.

We're watching the same pattern repeat one layer up. The automation era commoditised *manual* execution and made *scripting* the valued skill. Now the AI era is commoditising *scripting* (Copilot generates the Playwright test, the explorer runs the exploratory session, the pen tester probes OWASP categories) and making *orchestration* the valued skill. The tester who writes a Selenium suite is in the same position as the tester who clicked through test cases in 2006: doing work that a cheaper, faster, more tireless alternative can now handle.

And the environment problem? It hasn't gone away: it's *transformed*. In 2005, the hard part was configuring databases, services, and user state so a scripted test could run. In 2026, the hard part is curating the application's context, its testing scope, role definitions, and historical bug data so an AI agent knows what to explore and why. The context files *are* the environment. They're the setup that makes the difference between a useful run and a waste of tokens.

The career path that survived the last transition (from executor to strategist) is the same one that survives this one. The testers who'll thrive aren't the ones who can write the best Playwright scripts. They're the ones who can write the best testing scope definitions: who understand the application's risk profile, know where the architectural seams are, can articulate which permission boundaries matter most, and can look at the explorer's findings and say "these three bugs are symptoms of the same missing test suite." That synthesis (from individual findings to structural insight) is the same skill that made great manual testers great, that made great automation architects great, and that will make great AI test orchestrators great.

For the pen testing mode, this is even more pronounced. Anyone can run `--mode=security` against a URL. The value is in the security scope definition that says "this application uses JWT with RS256, the token is stored in localStorage, the refresh flow is handled by a separate auth service, and the biggest risk is horizontal privilege escalation between tenants via the booking API." That's not a prompt engineering exercise: it's a security architecture understanding exercise. The tool makes the *execution* of pen testing accessible to any team; the *expertise* to aim it remains human.

### But where does the next generation come from?

That observation surfaces an uncomfortable question: **how will the next generation of testers develop that judgment?**

The experienced testers on my team built their instincts over years of hands-on testing. They learned what permission boundaries look like by breaking them. They learned that booking systems fail at midnight on daylight saving transitions because they once spent three days debugging one. They learned to distrust green test suites because they've seen suites that pass while the application burns. That experience came from *doing the work*: the mechanical, repetitive, exploratory work that AI is now automating away.

If the execution layer is handled by agents, where does the next junior tester get those formative experiences? You can't develop a nose for bugs by writing testing scope definitions: you develop it by finding bugs, learning what they smell like, and building pattern recognition over hundreds of test sessions.

The answer is probably the same one the industry arrived at decades ago, before test automation existed: **apprenticeship**. Junior testers learning by working alongside experienced ones. Reviewing the explorer's findings together: "why did you flag this as a missing test suite? what pattern do you see?" Curating context docs as a pair, where the experienced tester explains *why* this permission boundary matters and *how* they know that booking systems fail under these conditions. The explorer's output becomes a teaching tool: here are the bugs it found, here's what they mean, here's the structural insight that would have caught them earlier.

The irony is worth noting: AI automates the execution that was the traditional training ground, and the solution is the most human of learning methods: mentorship, apprenticeship, situated learning.

I see the same pattern outside work. I'm a new grandfather to a three-month-old, and several of my younger colleagues are becoming parents for the first time. The detailed parenting guidance has shifted in the fifty-odd years since my parents started out: sleep advice, feeding norms, screen time, what's safe and what isn't. But the fundamentals haven't moved. Babies still need to be fed and changed. New parents still need patient support from people who've been through it, and they still need permission to make mistakes and learn from them without being judged for it. The methods evolve; the apprenticeship doesn't. That's exactly what I want for the next generation of testers: enough room to make real mistakes, and experienced people around them who remember what it was like to be the one getting it wrong.

This isn't hypothetical for my team. I've organised two deliberate responses: cross-client experience-sharing sessions where testers across finance, retail, public sector, and utilities compare how modern tooling is reshaping their daily work, and hands-on workshops for team members whose clients haven't yet adopted AI tooling so they're already fluent when adoption arrives. The findings from those workshops will be a separate article.

### The bigger question: what happens to the roles themselves?

The apprenticeship answer addresses *how* expertise transfers. But there's a more fundamental question underneath it that I don't think the industry has answered yet: **what happens to the boundaries between developer, tester, and analyst when AI collapses the execution barriers between them?**

Consider what's already happening. A developer with Copilot can generate a test suite without knowing testing methodology. A tester with the explorer can run hundreds of test interactions without writing a line of code. A business analyst with an AI assistant can produce acceptance criteria that are machine-parseable. The *execution* skills that once defined these roles: coding for developers, test scripting for testers, requirements documentation for analysts: are increasingly commoditised. If any of them can do the mechanical work of the others, what distinguishes the roles?

One answer is: nothing. They converge into a "product engineer" who does everything, aided by AI tools that handle the specialist execution. This is an appealing simplification, and some organisations are already moving toward it.

But I think this undersells what's actually at stake. These roles don't just represent different *skills*: they represent different *mindsets*. The builder mindset asks "how do I make this work?": optimistic, constructive, focused on delivering functionality, attentive to whether the thing being built is right. The tester mindset asks "how does this fail?": adversarial, sceptical, focused on what's wrong with what was built, and on whether the right thing is being built at all.

These mindsets are in genuine tension. Building requires optimism; breaking requires suspicion. You can hold both, but not simultaneously: context-switching between "make it work" and "make it fail" has a cognitive cost. There's a reason pair testing works: one person drives, the other probes. The tension between the perspectives is productive precisely because it's distributed across different people.

If AI collapses these roles into one, does the adversarial mindset survive? Or does "everyone's responsible for quality" quietly become an excuse for nobody specifically looking for what's wrong? When the builder is also supposed to be the breaker, optimism tends to win: it's psychologically easier to believe your code works than to hunt for evidence it doesn't.

The explorer is an interesting data point here. It embodies the tester mindset in an automated tool: it is, by construction, adversarial. It doesn't care whether the code is elegant or the architecture is clean. It navigates, probes, and reports what breaks. In a world where product engineers handle all three concerns, the explorer might become the mechanism by which the adversarial perspective is *preserved* even when there's no dedicated human tester to carry it.

But that only covers the tactical tester mindset: the "try this button, probe this boundary" level. The strategic tester mindset, "this *category* of testing is missing, this *architecture* creates a class of risks", still requires human judgment. And the bigger issue, "we're solving the wrong problem", isn't addressed by testing tools at all.

I don't have clean answers here. Does the explorer's context pipeline become a form of *institutional adversarial thinking*, encoding the tester mindset in configuration rather than in a person? Is the right model specialisation within a generalist team, with experienced testers and analysts embedded as coaches who transfer their mindset into AI tool configurations rather than full convergence into a single "product engineer" role? The answers will differ by organisation size, product complexity, and risk profile. A 5-person startup building an internal tool probably doesn't need a dedicated tester: the blast radius is small enough that convergence works. A 500-person organisation building a multi-tenant financial services platform probably does: the stakes are too high for adversarial thinking to be an afterthought.

The explorer doesn't answer these questions. But building it brought them into focus for me and the way teams choose to integrate it: as a developer's self-service tool, as a dedicated tester's force multiplier, or as an orchestrated layer in a quality engineering practice: will say a lot about which model each organisation is converging toward.

And there's a compounding factor: as AI accelerates the speed of code delivery, the demand for testing doesn't shrink: it *intensifies*. More releases means more risk surface. More features means more integration points, more edge cases, more permission boundaries to verify. The bottleneck shifts from "can we test fast enough?" to "do we know *what* to test?": and that's a domain knowledge question, not a tooling question.

My team supports clients across a range of industry verticals. I've spent years across financial services, retail, public sector, and utilities, and each one has different regulatory constraints, different risk profiles, different user expectations. A booking system in financial services has compliance implications that a retail booking system doesn't. An investment banking platform's permission model has audit requirements that a public sector portal handles completely differently. The tester who's lived in *any* of those sectors *knows* where the bodies are buried, knows the regulatory tripwires, knows which failure modes actually matter to the business. That sector-specific knowledge is exactly what the testing scope needs to contain. And it's exactly what AI can't generate from first principles.

As delivery velocity increases, the testers who can write "here's what matters in *this* sector, for *this* type of application, given *these* regulatory and business constraints" become more valuable, not less. The explorer can execute a thousand test interactions in an hour. Someone still has to know which thousand matter.

Here's what that looks like in practice. The BookingPlatform's dev team provided a complexity map: 22 pages, 91 API handlers across 5 roles, 9 feature flags, a payment engine, a content CMS, and 18 forms with 80+ fields. The full role-boundary test surface, every API handler probed from every role, is 455 combinations. A developer or architect can describe this complexity. They know the module boundaries, the entity count, the integration points. That's a technical complexity map.

But technical complexity alone doesn't set the testing budget. The tester adds the business priority overlay: payments is where the revenue comes from, so even moderate technical complexity gets maximum iterations. Content CMS is technically richer than user management, but for this client the CMS is low-risk while user suspension has regulatory implications. The explorer's April 28 run against the conrol app covered roughly 25–30% of that surface in 48 minutes for $0.29. The dev team's complexity map tells you *what exists*. The tester's business overlay tells you *what matters*. Neither has the full picture alone, and the explorer's iteration budgets are where those two perspectives meet.

---

## None of This Was Right First Time

Nothing described here arrived fully formed. The system prompt went through dozens of iterations, each prompted by a specific failure mode. The architecture has been reshaped more than once. The compression algorithm, the hallucination detector, the blocker recovery system, the rate limiter: each exists because something broke during a real run and needed a concrete fix.

That evolution is the subject of a companion post on how the explorer works under the hood. If you're interested in the engineering: how the prompt went wrong before it went right, what happens when context windows overflow, how you run a 500-iteration session without the agent losing its mind, and the specific problems that shaped the tool's design, that's where the technical detail lives.

---

*Exploratory Tester is built with TypeScript, Google Gemini / OpenAI-compatible LLMs, Playwright MCP, and a healthy respect for the unpredictability of real web applications.*
