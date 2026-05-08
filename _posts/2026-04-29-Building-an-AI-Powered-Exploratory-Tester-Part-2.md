---
author: wtrimble
date: 2026-04-29 00:00:00 Z
title: Building an AI-Powered Exploratory Tester- Part 2
categories:
- Testing
tags:
- Testing
- Transformation
- Artificial Intelligence
layout: default_post
summary: The engineering behind an AI exploratory tester, describing architecture, prompt failures, context window management, rate limiting, and the specific problems that shaped the design.

---

# How It Works: Inside the Exploratory Testing Agent

*The engineering behind an AI exploratory tester: architecture, prompt failures, context window management, rate limiting, and the specific problems that shaped the design.*

---

## The Architecture

The system has six components: an LLM provider layer (supporting Gemini and any OpenAI-compatible model including local ones via Ollama), a Tool Router that manages MCP server connections, the agent loop itself, an orchestrator handling multi-role execution, a settings system, and GitHub IssueOps for bidirectional issue tracking.

```
                    ┌──────────────┐
                    │  LLM Provider │ (i / OpenAI-compatible / Ollama)
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │  Agent Loop  │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │ Tool Router  │
                    └──┬───────┬───┘
                       │       │
              ┌────────┴──┐ ┌──┴──────────┐
              │ Playwright │ │ Extra MCP   │
              │ MCP Server │ │ Servers     │
              └────────────┘ └─────────────┘
```

The design choice that matters most is the Tool Router's use of MCP as its protocol. Because MCP is just a protocol for tool interaction, the agent doesn't know or care what's behind its tools. Today it drives Playwright for web testing. But the same agent, same system prompt, same context docs could drive Appium for mobile apps, a Swagger/OpenAPI server for API testing, or both simultaneously for cross-layer verification. The agent's testing reasoning (check permissions, probe boundaries, exploit observed data) is surface-agnostic.

This isn't equally valuable on all surfaces. The explorer shines brightest where the interaction surface is *undefined*: web UIs, mobile apps, and especially cross-layer integration (UI + API together). It adds less value for well-spec'd APIs where Copilot or Schemathesis can generate exhaustive deterministic tests directly from the spec. For APIs, the explorer's value is in what the spec doesn't cover: business logic ("can you book a slot that overlaps with a maintenance window?"), cross-endpoint sequences, and auth boundary probing beyond what the RBAC spec defines.

The honest positioning: for well-spec'd APIs, generate deterministic tests first, then use the explorer for the gaps. For web UI, mobile, and cross-layer testing, the explorer is the primary discovery mechanism.

---

## Design Principles

Three principles shaped how the tool evolved.

**App-agnostic core, app-specific config.** The runtime code knows nothing about any particular application. All domain knowledge lives in config files under `apps/{AppName}/{profile}/`: context documents, role definitions, testing scope directives, historical bugs, feature flag definitions. Adding a new application under test is a config-only operation. No code changes required.

**Context is everything.** The single biggest factor in result quality is the context you give the agent. Role-specific capability maps tell it what to test. Testing scope directives tell it what to skip. Historical bugs help it identify regressions. The agent is only as useful as the human decisions encoded in those files.

**Multi-role concurrent execution.** Real applications have multiple personas with different permissions. The tool runs them concurrently, each with its own browser and iteration budget. This has an underappreciated side effect: each role deals with the spontaneous behaviour of other active users. When the admin approves a booking mid-session, the member's next page load shows different data. The bugs that emerge from concurrent interaction (race conditions, stale data, notification timing) are precisely the ones sequential testing misses.

---

## The Prompt: Getting It Wrong Before Getting It Right

The system prompt is now ~120 lines of carefully refined directives. It didn't start that way. Early versions were a paragraph: "You are an exploratory tester. Test this website thoroughly." What followed was an iterative process of running the agent, watching it fail in a specific way, and adding the directive that would have prevented that failure.

Each failure was a lesson about what LLMs don't know without being told. These are the *behavioural* fixes: solved by editing the prompt. The operational problems that needed engineering around the model, rather than instructions to it, come later.

**The agent wandered aimlessly.** The first prompt gave no structure. The agent would navigate to the homepage, click a few links at random, and produce a report so generic it could have been about any website. The fix: a numbered testing approach (navigate, snapshot, systematically explore, document as you go). Structure gave direction.

**The agent declared victory after barely trying.** With a 500-iteration budget, the agent would sometimes complete in 10–15 iterations, producing a thin report that covered the homepage and one form. It had fulfilled the literal instruction ("test the website") without fulfilling the intent. The fix: a minimum tool call threshold (at least 10% of the iteration budget) and an explicit directive: "Before declaring done, review the capability list provided in your role context. For each capability, confirm you have tested it or explain why you could not." Vague instructions produced vague effort.

**The agent hallucinated interactions.** It would write "I clicked the Admin button and saw a permission denied error" without ever calling `browser_click`. The output read like a plausible test report, but nothing had actually happened. This was the scariest failure mode, because it looked right. The fix: the grounding rule, stated bluntly: "Every claim in your report MUST be backed by an actual tool interaction. Reports containing claims not backed by tool interactions will be rejected." Plus the hallucination detector that scans responses for text-formatted tool calls and forces correction.

**Reports were unstructured and hard to act on.** Early reports were prose paragraphs. A developer reading them couldn't tell what was a bug, what was a hunch, and what had been tested vs. missed. The fix: an explicit report format with Issues (STR/Expected/Actual/Test Data), split into Regressions and New Findings (when historical bugs are provided), plus Areas Not Tested and Anomalies & Hunches. The Anomalies section was a deliberate addition: it captures the "this felt wrong but I ran out of budget to investigate" observations that are pure exploratory testing gold.

**The agent was polite but shallow.** It would test happy paths thoroughly (valid logins, correct form submissions, expected navigation) but never tried the adversarial cases: empty forms, SQL injection patterns, boundary values, special characters. The fix: explicit directives for edge case testing in the approach, plus the domain knowledge instruction: "you have broad knowledge of how real-world systems work. Use that knowledge to judge whether observed behaviour is reasonable." The agent needed permission to be suspicious.

**The agent didn't exploit what it found.** It would see a tenant slug displayed on a page and move on. A human tester would immediately try navigating to `/that-slug`. The agent needed to learn the data-driven exploration habit: "treat every piece of data you encounter during testing as a potential lead for new exploration." This single directive, added after watching runs that were thorough but surface-level, produced the deepest findings: the IDOR vulnerabilities, the tenant isolation failures, the privilege escalation paths.

**The agent forgot what it had already done.** Long sessions (500 iterations) generate enormous conversation histories. The agent would revisit pages it had already tested, re-discover bugs it had already reported, and lose track of its testing strategy. This wasn't a prompt problem; it was a **context window problem**. The conversation history filled up, responses degraded, and the agent's sense of continuity dissolved. The fix was conversation compression: summarise the middle of the conversation while keeping the system prompt and recent interactions intact. But compression has its own cost. The summary loses detail, and the agent may revisit areas that were covered in the compressed section. Tuning the threshold (when to compress) and the window size (how much recent history to keep) was its own iterative process. Too aggressive and the agent loses context; too late and the context window overflows.

**The agent wasted budget on the wrong things.** Without guidance, a maintenance role with limited capabilities would burn 200 iterations exploring pages it couldn't interact with. A platform admin would spend equal time on the homepage and the complex permission management pages. The fix wasn't in the prompt itself but in the **context configuration**. Per-role iteration budgets, testing scope directives ("form validation is covered by unit tests, don't spend iterations"), and role-specific capability maps that tell the agent what it should be able to do. The prompt just needed to say "review your capability list before declaring done."

### The Compression Tradeoff

Context compression deserves a closer look because it's where the model's limitations become tangible.

A 500-iteration session generates hundreds of conversation entries: tool calls, tool results (many containing full page snapshots), agent reasoning, and observations. At some point, the total token count approaches the model's context window limit. When that happens, response quality drops: the agent's responses become incoherent, repetitive, or contradictory. It forgets its testing strategy.

The compression algorithm keeps the system prompt (always first), summarises the middle section into a digest, and preserves the most recent N entries (default: 20). This means the agent always know its **identity, capabilities and objectives** (system prompt), has a rough summary of *what it's done* (compressed middle), and has full detail on *what just happened* (recent window).

The tradeoffs:

- **Threshold too low** (compress early): The agent compresses when it doesn't need to, losing useful detail from recent interactions. It may revisit areas because the summary didn't capture them with enough specificity.
- **Threshold too high** (compress late): The context window fills before compression triggers, and the model starts producing degraded output. By the time compression runs, the quality has already suffered.
- **Window too small** (keep few recent entries): The agent loses track of its immediate context. It forgets what it just clicked, what it was investigating, what it planned to do next.
- **Window too large** (keep many recent entries): Less room for the compressed summary and system prompt. The oldest entries in the "recent" window are stale but taking up space.

The current defaults (threshold: 40 entries, window: 20 entries) emerged from watching many runs. A single 5-role run today might perform 10+ compressions across the roles. The user role (59 iterations, 16 minutes) compressed 5 times; the platform admin (30 iterations, 7 minutes) compressed once. It's not perfect (the agent occasionally revisits areas covered in the compressed section) but it keeps multi-hundred-iteration sessions coherent.

### Running Local: 16GB MacBook Constraints

The OpenAI-compatible provider exists partly because running every prompt iteration against a cloud API adds up during development. Iterating on the system prompt (trying a new directive, running 20 iterations, reading the report, tweaking the wording, running again) burns through tokens fast. Running a local model via Ollama makes this loop free.

But a 16GB MacBook constrains your options. A 14B parameter model (Qwen 2.5 14B) is roughly the ceiling: it fits in memory with enough room for a reasonable context window (`num_ctx=32768`). Larger models either won't load or run so slowly they're impractical. Smaller models (7B) load fast but struggle with complex tool calling. They produce malformed JSON, forget to call tools at all, or lose track of multi-step testing strategies.

The JSON repair layer in the OpenAI-compatible provider exists because of this. Local models regularly produce tool call arguments with trailing commas, unquoted keys, or truncated JSON. Rather than failing the iteration, the agent attempts to repair the JSON and retry. It works surprisingly often: the model's *intent* was correct, it just couldn't produce syntactically valid JSON.

Lest you think this is purely a local-model problem: **Gemini produces malformed responses too.** Not as frequently, but it happens, and the cause is often *what the agent sends to the model*, not the model itself. The explorer feeds Playwright page snapshots and console output back to Gemini as tool results. If a page snapshot contains user-generated content with profanity, error messages that look like attack strings (the agent *is* testing SQL injection patterns), or response bodies from failed API calls, Gemini's safety filters can trigger. When that happens, the response comes back with `finishReason: 'SAFETY'` or `'RECITATION'`, empty candidate parts, and incomplete `usageMetadata`. No output token count, no text, no tool calls. Just a blank wall.

This isn't a bug in Gemini; it's a fundamental tension in the design. The explorer's job is to poke at the application in adversarial ways, which means the data flowing back through tool results is exactly the kind of content safety filters are trained to flag. A page snapshot containing `'; DROP TABLE users; --` (which the agent itself typed into a form field) looks like a prompt injection attack to the safety layer. An error response containing a stack trace with internal paths looks like sensitive data exposure. The tool's own test behaviour triggers the model's defences.

The engineering response is defensive: treat every LLM response as potentially incomplete. Null-coalesce all token metadata (`?? 0`), handle empty tool call arrays, retry on safety blocks, and never let a single malformed response crash a multi-hour run. Google's SDK issue tracker documents these edge cases (safety blocks returning incomplete metadata was a P1 bug), but even with SDK fixes, the underlying tension remains: exploratory and security testing will always generate content that sits close to safety filter boundaries.

---

## The Evolution: Operational Problems Solved Along the Way

The prompt fixes above were about *behaviour*: teaching the agent how to test, mirroring Part 1's theme that the explorer tests deployed behaviour, not code. The fixes below are different. These are the operational problems that no amount of prompt engineering could solve, the ones that needed code wrapped around the model: overlays the agent couldn't dismiss, rate limits that killed long runs, dead servers that burned tokens, and findings stranded inside hours-long sessions.

### Problem: Modals, Cookies, and Overlays Block Everything

Cookie consent banners, newsletter popups, chat widgets (Intercom, Zendesk, Drift, etc.), browser permission prompts, and JavaScript alert dialogs can completely block the agent from interacting with the actual application. This is the same problem that plagues all automated UI testing: Selenium and Cypress suites break on the same overlays. The difference is that a scripted test can hard-code a dismiss step at a known point; the explorer encounters them unpredictably during freeform exploration.

**Solution**: A multi-layer recovery system. When an interaction fails with a "not clickable" or "intercepted" error, the agent:

1. Takes a snapshot to classify the blocker (browser dialog, permission prompt, external overlay, in-app modal, or focus interference)
2. Parses dismiss candidates from the snapshot, prioritising safe labels (Close, Cancel, Dismiss) over proceed labels (OK, Accept)
3. Attempts to dismiss each candidate in priority order
4. Falls back to Escape key
5. Records the entire recovery sequence in a blocker event log that gets appended to the final report

Permission prompts are handled by clicking Deny/Block labels specifically. External overlays from third-party chat services get their own detection patterns.

### Problem: API Rate Limits Kill Long Runs

Testing at scale means hundreds of Gemini API calls. Rate limits (HTTP 429) are inevitable.

**Solution**: Exponential backoff with jitter. The system retries up to 10 times per API call, with delays starting at 2 seconds and scaling to 60 seconds. If all retries are exhausted, a cooldown counter tracks consecutive failures. After 5 consecutive cooldowns, the role gives up gracefully rather than spinning forever. Total backoff time is tracked and reported per role.

### Problem: Rate Limits Were Harder to Handle Than Expected

The shared Gemini rate limiter worked, but blind exponential backoff was wasteful. Sometimes the server's 429 response included a specific `retryDelay` recommendation that the client was ignoring.

**Solution**: The `GeminiProvider` now parses `errorDetails` from 429 responses, extracts the server-recommended `retryDelay` (e.g. `"51s"`), and uses it instead of the calculated exponential backoff. Additionally, when any agent hits a 429, the shared token bucket is *drained*, forcing all concurrent agents to wait until the bucket refills rather than immediately retrying and wasting their own attempts.

### Problem: The Agent Wastes Budget Against a Dead Server

During a long multi-role run, the application under test might crash or become unreachable mid-session. Without detection, subsequent roles would burn their entire iteration budget making API calls against connection-refused errors. Expensive and pointless.

**Solution**: A two-layer defence:

1. **Pre-flight health check**: Before any LLM setup or iteration loops begin, a simple HTTP HEAD request verifies the target URL is reachable. If the server is down, the run fails fast with a clear error instead of burning tokens.
2. **Connection-failure circuit breaker**: During testing, the agent tracks consecutive connection-refused results from browser tools. After 5 consecutive failures, the role is terminated with a synthetic report explaining the infrastructure issue. This prevents budget waste when the server goes down mid-run.

*The reasoning: "As a human it is very easy to see if the app is up or not but the tester agent disnae have a' the tools at its disposal tae ken this."*

### Problem: Findings Are Only Available After the Run Completes

A 4-role × 500-iteration run can take hours. Bugs discovered in iteration 50 aren't visible until the entire run finishes: too late for developers to start fixing them.

The current GitHub IssueOps integration extracts findings from each role's final report and files them as individual issues post-run, with `dedupeByTitle` deduplication and configurable `enabled`/`dryRun` toggles in settings. This works, but it means the full set of findings is batched at the end rather than streamed as they're discovered.

**Planned**: Filing findings mid-run as the agent discovers them, creating a live stream of bugs that developers can pick up and fix while the tester is still running. Combined with a re-validation webhook, this would let the explorer confirm fixes within the same run.

### Problem: Locked Into One LLM Provider

The original implementation was tightly coupled to Google Gemini. Running against a local model for development or cost control, or using a different cloud provider, would require rewriting the agent.

**Solution**: A full LLM provider abstraction layer (`src/llm/`). The `LLMProvider` interface is provider-neutral: `generateContent()` accepts canonical `LLMMessage` types and returns canonical `LLMGenerateResult`. Two providers ship today: `GeminiProvider` (with context caching, shared rate limiting, and cache expiry auto-recreation) and `OpenAICompatibleProvider` (supporting Ollama, vLLM, and any OpenAI-compatible endpoint). Switching providers is a single env var: `LLM_PROVIDER=openai-compatible LLM_BASE_URL=http://localhost:11434/v1 LLM_MODEL=qwen2.5:14b`.

### Problem: Results Were Hard to Track Across Runs

Multiple apps, multiple environments, multiple runs per day: without structure, outputs become chaos.

**Solution**: Every run produces timestamped, hierarchically organised outputs:

```
apps/BookingPlatform/local/outputs/localhost/2026-04-26T07-35-21-608Z/
  role-reports/
    platform-admin-localhost-2026-04-26T07-35-21-608Z.md
    tenant-admin-localhost-2026-04-26T07-35-21-608Z.md
    user-localhost-2026-04-26T07-35-21-608Z.md
    maintenance-localhost-2026-04-26T07-35-21-608Z.md
  combined/
    test-plan-localhost-2026-04-26T07-35-21-608Z.md
    combined-summary-localhost-2026-04-26T07-35-21-608Z.md
  artifacts/
```

Plus NDJSON token usage logs for cost analysis across all runs.

---

## What Else It Does

The tool has grown beyond basic "point at URL, explore, report." A few capabilities worth mentioning briefly:

- **Feature flag testing**: Configure flags with interaction relationships, and the agent toggles them during runs to observe effects and test combinations.
- **External systems cross-checking**: After triggering errors, the agent can check Kibana, Grafana, or Sentry to verify the right things were logged. (Infrastructure in place; still being validated.)
- **GitHub IssueOps**: Bidirectional. Outbound: auto-file findings as GitHub issues with severity labels and deduplication. Inbound: a PM opens an issue with a test charter, and the tool picks it up and executes autonomously.
- **Pre-execution test plans**: Before testing begins, the tool generates a risk-prioritised plan document for human review. It doesn't feed into execution; its value is as an audit trail and a comparator for post-run analysis.
- **Run analysis**: Automated post-run summary covering budget utilisation, infrastructure issues, rate limiting pressure, cross-role duplicate findings, and coverage gaps.

Everything is tuneable via `settings.json` per app profile.

---

## What's Next

- **Live bug filing during runs**: discovering bugs and filing them in real time, not batching at the end
- **Cross-role scenario chains**: coordinated multi-role workflows where one agent's actions create preconditions for another
- **Security penetration testing mode**: the same architecture with an adversarial mindset, systematically probing OWASP Top 10 categories
- **Alternative interaction surfaces**: mobile via Appium, API-only via OpenAPI, or both simultaneously for cross-layer verification

A future post in this series picks up the orchestration thread: the explorer becoming an MCP-exposed tool driven by an agent that can be steered midflight by humans or by deployment events, learning and re-prioritising while the run is still in progress.

---
