---
author: wtrimble
date: 2026-05-06 00:00:00 Z
title: Building an AI-Powered Exploratory Tester - Where the harness hit its limits
categories:
- Testing
- Artificial Intelligence
tags:
- Testing
- Transformation
layout: default_post
summary: Part 4 of an ongoing series on AI-augmented testing. Parts 1 to 3 built the harness, deployed it, and worked out where it lives. This one is about what the harness couldn't do, and what we built next.

---


## The morning the harness's limits became obvious

The harness had been finding things on BookingPlatform for weeks. Real things. It was also taking longer than I wanted, and missing parts of the app I'd seeded with bugs. Instinct said something wasn't right. Then I noticed I'd filed the same bug three times.

Run one had turned up `/api/admin/users` returning 400 when called as platform admin. I logged it, the team fixed it, the ticket closed. A few runs later, `/api/maintenance/[id]/notes` returned 403 for the same role on what should have been an authorised call. Different endpoint, different fix, separate ticket. Then a third: a Postgres error on `/api/tracking/stats`, only on the platform-admin tour. Three tickets, three fixes, three closures.

They were all the same bug. The platform admin role didn't consistently inherit tenant-level access. Three symptoms of one structural problem, and the harness had no way to see that, because every run started from scratch. It found what was in front of it on the night, filed the report, and forgot. The next night it ran into the same shape again, dressed differently, and filed a fresh ticket on it. The harness was doing exactly what I'd built it to do. The problem was that I'd built a thing that could find bugs but couldn't make sense of them.

## Five gaps, in plain sight once you saw them

The harness had no memory across runs. Every morning it woke up new. That was fine when the goal was overnight discovery on a fresh codebase, but it meant findings stood alone, and patterns across findings stayed invisible. There was no thread connecting Tuesday's authorisation oddity to Friday's authorisation oddity unless I sat down and noticed the connection myself. Which, predictably, I sometimes did and sometimes didn't.

It had no judgement about what to test next. Each run picked from the same prior (its initial set of assumptions about where to look) at the same priority. The fact that yesterday's run had hammered the booking flow and turned up nothing didn't change today's plan; the fact that the messaging surface had been throwing 500s for a week didn't redirect attention towards it. Iteration budgets got spent on the same well-trodden ground night after night. The compensation, when I noticed it, was that I'd been feeding more and more app-specific context into each sweep to nudge attention towards the parts I cared about. Each new sweep wanted another paragraph of "and please look at...". I was heading towards writing a full spec for it, at which point I might as well have been writing test cases.

It had no notion that bugs cluster around design smells. The three platform-admin tickets weren't just three findings; they were three witnesses to a single architectural problem, and that's the thing the team actually needed to know. The harness gave them three discrete tickets with three discrete fixes, and the structural answer never surfaced because no layer of the system was asked to look for it.

It had no learning that compounded. The seeded heuristics (FEW HICCUPPS, OWASP WSTG, and the experience I'd been leaning on for years) were available to the planning prompt as static reference material, but they weren't accruing weight. A heuristic that fired three times on three different apps gained no more credibility than one that had never landed. The harness didn't know which of its prompts were earning their keep.

And the orchestration layer didn't really exist. The original harness had been built to run multiple roles, with an interleave model meant to emulate users acting concurrently against the system. It worked in the sense that several roles could share a session, but it was slow, and the concurrency was more theatrical than real. Budget management was the obvious tell. I ran a sweep with `--total-budget 30` and watched it churn for an hour before timing out internally. The harness was running three roles in parallel and giving each of them a budget of 30 iterations, because it had been told the cycle budget was 30 and per-role budget was a thing it owned. So 30 became 90 actual iterations, and the orchestrator only deducted 30 from its bookkeeping because that was what it had handed out. Both layers thought they were in charge of the same number, and the seam between them was badly drawn.

Taken together, the gaps describe a tool that executes well but doesn't know what it's doing.

## What an experienced practitioner actually does

I parked it. Fed back to the AI incubator team I'd been comparing notes with that I didn't think the approach was viable yet, that the models weren't good enough for what I'd been trying to do. The reaction was mixed. Other people's experiments hadn't hit the same walls in the same way, there was some healthy "you might be holding it wrong" pushback, and there was some quiet acknowledgement that yes, the models do have limits. I let it sit for a bit.

What brought me back was remembering how I'd felt the first few times the harness had turned up something I knew a scripted suite would have walked straight past. There was something genuinely capable in there. The mistake had been holding it like a test runner and trying to specify it into behaving. I came back to it with a different question: not what spec would make it correct, but how the gap between what it did and what I do might be closed.

A good tester, three months into a system, isn't valuable because they execute test cases more accurately than someone in week one. They're valuable because they have a model of the system. They know which subsystem is fragile, which feature was rushed before a release and never properly cleaned up, which team's code tends to bite under load. They walk in on Monday and head straight for the suspicious bit. They notice when a new bug rhymes with one from three sprints ago. They keep a notebook, formal or otherwise, of what's true about this system, and they update it as evidence changes.

That's the working pattern I'd been comparing against. The execution work matters, but it's the supporting layer; the model is what makes the execution selective. And the model accumulates: the longer the tester has been on the system, the better it gets, the more efficiently the next round of work is targeted.

The harness had none of that. It had a planner that picked from the same priors every night, and it had findings that stood alone in a directory and didn't talk to each other. There was no notebook. There was no tester sitting alongside it building a model. The execution layer was working; the practitioner layer was missing.

Closing that gap meant building something above the harness that did what I do on a system I'm getting to know: remember what it's seen, decide what to do next given what it remembers, dispatch focused investigations rather than generic sweeps, and accumulate beliefs about the system rather than re-discovering it from cold every night.

## Naming the thing

I called this layer Columbo, for the same reason Part 1 used him as the analogy. The shabby raincoat, the patient return, the willingness to look like he's missed the point right up until the moment he hasn't. The name felt apt before I'd started building and more apt the more the layer took shape. Where the harness had been a competent investigator who never got beyond the first interview, Columbo was the senior detective who'd been around the case a few times, knew which questions were worth asking again, and trusted his hunches enough to come back through the door.

## What Columbo does differently

The shape of the thing is roughly this. Columbo plans, the harness executes, and findings flow back into a memory that informs the next plan. The capabilities below each deserve their own piece, and most of them will get one. For now the headlines are enough.

It orchestrates investigations, not just runs. Part 3 talked about runs as the unit of work; that was a useful shorthand, but the actual unit is closer to a thread of investigation. A thread is a focused line of enquiry: a hypothesis, a budget, an archetype to run it under, and a plan that ends when the line of enquiry is exhausted rather than when an iteration counter ticks down. Archetypes are how Columbo varies the personality of the investigator. Part 2 named exploratory and security testing as separate kinds of work; in the harness, choosing between them was a human decision baked into how a run was launched. Columbo picks. An exploratory archetype wanders curiously and notices oddness; a security archetype probes auth boundaries and data exposure; the two see different things on the same screen. Columbo looks at what the notebook is currently chewing on and assigns the archetype that fits the question. A thread picks one and commits to it for the duration. Columbo plans a handful of threads per cycle, dispatches them, and stitches their evidence together afterwards. The harness no longer concerns itself with what to investigate, or with what kind of tester to be; it just runs the thread it's handed.

It keeps memory. Findings accumulate into a notebook of beliefs about the system, each with a confidence and a lifecycle. Beliefs don't get promoted to confirmed on the strength of one chatty run agreeing with itself; corroboration has to come from a separate run, on separate evidence. Beliefs that go unconfirmed for long enough fade. Beliefs that get repeatedly confirmed harden, and the planner takes them seriously when picking what to investigate next. The notebook is the start of Columbo becoming the senior tester who's been around.

It builds a case rather than filing tickets. Findings live in Columbo's own store; issue trackers (GitHub, JIRA, plain reports) are pluggable destinations downstream of that. The framing matters: findings are evidence, not verdicts. Columbo presents the case; the operator delivers the judgement. That's a deliberate split, and it changes how the tool reads. It isn't a bug scanner that gates a release; it's a junior practitioner laying out what it found and what it thinks it means, leaving the actual call to someone who can be held to account for it.

It runs threads in parallel where the API will tolerate it. Sequentially-run threads were leaving rate-limit headroom on the table and stretching elapsed time well past what overnight cadence wants. The rate-limit scaffolding from Part 2 turned out to be exactly the safety surface this needed; with that already in place, a bounded concurrency wrap on thread dispatch was a small change. The interesting work was the safety, not the parallelism.

## Using it in anger

Once the orchestrator started producing better bug reports, sharper hunches, and coverage that moved between cycles, my view of it shifted. The capability I'd suspected was in there was starting to show up in the output. There was a brief stretch where I thought it might genuinely replace human testers. That feeling didn't survive contact with the next few weeks, but it was real at the time, and worth admitting.

I'm using it in anger now. The harness app has grown significantly to keep pace with what Columbo wants to do with it. I run the tool against feature branches as a matter of course. It finds things; those things flow back to whoever wrote the feature; fixes land; the next sweep picks up the next layer. The loop on the dev side is interesting: AI writes code, Columbo tests it, findings come back, AI writes the fix, Columbo tests again. I'm the human in the middle of that conversation by choice, not by necessity. The messenger work is already automated; both projects could read and write GitHub issues directly, and the early harness did exactly that. I've turned it off because I still want to review findings before they land in a ticket queue and steer the next sweep based on what I've seen. Fundamentally, I still don't trust full-blown automation on this; the value of the tool is highest when there's a human reading what it produces and steering. Pushback still happens, but less than it used to. The accumulated context probably has something to do with that.

The thing that surprised me most was the compounding. The longer it runs against an app, the better its next plan gets. The notebook does what I hoped it would: it accrues, it sharpens, it stops re-discovering what it already knows. The tool has learned how to learn.

## What Columbo doesn't do yet

The honest list is shorter than it ought to be.

It isn't multi-app. Each client's notebook is local to that client, and there's no shared view across apps yet. A precinct view (one investigator, all his open cases visible on one wall) is on the roadmap; it isn't built.

It isn't federated. Beliefs learned on one client's app stay on that client's app. There are good reasons for that, mostly to do with not leaking client-specific patterns sideways, and there are interesting reasons to revisit it eventually. Neither is happening yet.

It isn't a daemon, though it's close enough that the line is more about discipline than capability. Columbo runs from the CLI, which means anything that can fire a CLI command can launch it: a deploy hook, a cron, a CI job. Multiple instances are fine too; you can point one at the booking flow under the member role and another at the admin surface under platform admin, with different budgets and different scopes, and they don't tread on each other. Because they share the same notebook, what one instance learns is available to the next plan the other instance makes; the parallel work compounds rather than splintering. What it doesn't have is a long-running mode that decides for itself when to wake up and what to look at. Every cycle is launched by something. I've kept it that way because the moment of launching is also a moment to glance at the previous cycle's findings, and that glance has been worth keeping.

It isn't a replacement for human judgement. Columbo presents evidence; the call on what's worth fixing, what's a false positive, what's an unsurprising consequence of how this particular system works, stays with someone who can be held to that call.

And there's a thinking-problem worth flagging on the way out, because Columbo surfaces it sharply even though he doesn't yet solve it. The word "role" is doing more work than it can carry. Identity (who is logged in), capability (what they can do), and trust zone (what we expect them to be allowed to do) are three different things, and the current model treats them as one. That's tolerable when permissions are fixed and known up front. It starts to creak the moment permissions become per-tenant, per-group, per-anything dynamic, because then two users with the same role label might legitimately have different capabilities, and the operator's expectation about what either of them should be able to do is just one input among several. That's a substantial reframe.

## The case stays open

When the picture got clear, the work moved fast. The decision to give Columbo end-to-end ownership of budgeting and the decision to retire the harness's per-role parallelism were a few days apart, and the implementations were a few days apart from those again. That's what design clarity buys: a backlog that suddenly knows what to do next.

Most of this post has been signposts. The notebook deserves its own piece, including the morning the detective hallucinated a finding from no evidence at all and we caught him. The role reframe deserves another, when there's a real-world example to ground it. There's a story behind an audit that turned up forty-nine historical findings nobody had noticed were orphaned in the database since project start.

The harness has its place, Columbo has his, and the case stays open.

---
