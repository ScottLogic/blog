---
author: wtrimble
date: 2026-05-06 00:00:00 Z
title: Building an AI-Powered Exploratory Tester - Where it lives
categories:
- Testing
- Artificial Intelligence
tags:
- Testing
- Transformation
layout: default_post
summary: Part 3 of an ongoing series on AI-augmented testing. Part 1 told the story of what an exploratory testing agent found and what that meant for testers. Part 2 went under the bonnet. This one answers a question that's harder than it sounds: where in your delivery process does this thing actually live?.

---


## Where it lives

I've borrowed the title from a former project. The component itself was a single service on the edge of a much bigger, much more complex system, functionally about as simple as services come. Architecturally it should have been straightforward but it wasn't.

It took weeks to settle on where the thing should live, because *where it lives* dictated where it could deploy from, what build estate it sat in, which on-prem variant it had to talk to, which external systems it would be permitted to reach. Development sat blocked the whole time. Then, having finally chosen, we'd revisit the decision a fortnight later — not because the room had missed a trade-off, but because the room had changed, and the reasoning behind the original choice hadn't been captured anywhere durable. So the new room reopened the question. And the room after that. *Where does it live?* became the project's running joke and one of its standing frustrations.

I'm using the phrase here for the same reason. The agent itself isn't complicated. The hard question is the same one, and as you'll see, it isn't a one-shot answer either.

## Where does it go?

Once I had something that found real bugs in BookingPlatform, the next question was the obvious one: where does it actually live in a delivery process? CI is the natural first thought. We've spent twenty years getting good at automated quality gates, and a tool that finds bugs slots into that mental model. Commit, pipeline, tests, deploy.

It rules itself out fairly quickly.

## Why not in the pipeline

The crux is non-determinism. Every run takes a different path. Same context, same budgets, different findings. That's what makes the agent useful for discovery, because repeated runs accumulate coverage in places no scripted test was looking. It's also what makes it useless as a gate. Pass and fail need to mean something. A run that found three bugs yesterday and zero today hasn't necessarily improved; it might just have wandered down a different corridor.

The environment matters too. Part 1 made the case that this tool works against deployed systems, not synthetic test rigs. Standing up an approximation of production inside the pipeline so the agent can run against it spends ten minutes building the very thing whose absence the agent was supposed to catch. No real flag service, no real IAM policies, none of the propagation behaviour between services that bites you in the wild.

## Where it actually lives

Deployed, then. Staging works but staging is late in the lifecycle; by the time something's reached staging it's already been through several hands. The release candidate (RC) is better. Better still is the slice of work that's accumulated in the pre-RC environment, the long-lived integration env where features land before they're cut into a candidate. This is recent enough to be cheap to change but real enough to behave like production. Run the agent against that. Overnight, or three times a day if your deploy cadence justifies it.

That cadence is cheap enough to be trivial because overnight runs cost pennies, not pounds, and the findings are there in the morning for the team to triage with their first cup of tea. For the deeper run against the candidate itself, push the budgets up to match the asymmetric risk inherent in any system. In the exmple from the control app; heavy where a privileged user can do real damage, light where a guest can barely do anything.

In both shapes the agent is doing work the rest of your test estate isn't. Your unit tests verified `cancelBooking()` returns 200, your contract tests verified the API agreement, your integration suite checked the happy path through checkout. The agent is the one that walks a regular member to a tenant slug they shouldn't have access to, finds the page renders, and files it. That's the tenant-slug IDOR from Part 1, and it's the shape of bug this kind of sweep is built to surface. Not because the agent is cleverer than the scripted suites; because nobody had thought to write that test.

## The cloud-native sweet spot

The placement story gets more interesting on cloud-native architectures, because that's where the gap between what your tests cover and what production actually does tends to be widest.

Bugs in serverless and managed-service applications don't usually live inside any one component. They live in the integrations. The Step Function timeout that's fine in dev and too short under load. The IAM policy that's correctly scoped in one account and over-permissive in another. The DynamoDB eventual-consistency window that causes the UI to read stale data immediately after a write. None of these can be tested without the actual infrastructure, and the actual infrastructure is expensive to stand up. So the common pattern across organisations I've worked with is to keep the pipeline on unit and contract tests, deploy to a real environment overnight, run a scripted E2E suite against it, and hope for the best.

The scripted suite checks the flows that someone thought to script. The agent checks what nobody scripted. Both run against infrastructure you've already paid for. The marginal cost of adding the agent to that overnight slot is essentially nothing, and what you get in return is a class of bug that mocked tests structurally cannot find. If your overnight environment is the only place your real IAM policies and real Step Functions live, it's also the only place where some of your bugs live.

## The feature-flag matrix

The other place the agent earns its keep is anywhere your application's actual behaviour depends on a tangle of feature flags.

Most teams I've worked with started with feature flags as short-lived release toggles and ended up with thirty, fifty, sometimes a hundred flags in various long-lived states: A/B experiments, entitlement gates, operational kill switches, tenant-level overrides. The combinations multiply fast. Nobody tests the full matrix. Most teams don't try. The deterministic suite tests the headline configurations (all-on, all-off, maybe half a dozen explicit pairings) and lives with the rest.

The agent's non-determinism, which made it a bad pipeline gate, makes it a good probe for this space. Different runs touch different flag states and stumble into different interactions. Over a week of nightlies you've exercised more of the flag matrix than the scripted suite covers in a year. It isn't exhaustive, but it's a kind of coverage you couldn't economically buy any other way.

What sharpens the case is flag leakage: bugs where flags don't propagate cleanly through the system. The flag service updates but the payment service is running a cached evaluation from before the toggle. The CDN serves a JavaScript bundle that doesn't know about the new checkout. Two services receive a flag change at slightly different times and disagree about which version of reality they're in for a few seconds. The booking goes through the new flow; the confirmation email uses the old template with the wrong fields. These bugs are mundane in cause and ugly in symptom. They never reproduce in unit tests because the flag service is mocked. They might appear in integration tests if you happen to test during the propagation window, which is mostly luck. The agent finds them because it just uses the application during and after flag changes, and notices when the pages it visits disagree with each other.

## The cost of late bugs hasn't gone away everywhere

The old line is "bugs cost a hundred times more to fix the later you find them." Mature CD shops have spent a decade chipping away at that multiplier, and on the right kind of product they've largely succeeded. A greenfield web app with a small user base, fast deploys, feature flags and decent observability can afford to find a bug in production: you roll back, you fix, you redeploy, you've maybe annoyed a handful of users. An internal back-office tool where the "users" are colleagues and a Slack message buys you time is closer to free.

Most products I get called in to look at aren't that. They're multi-tenant SaaS platforms where one permission bug exposes every customer at once. They're regulated systems where a production defect triggers compliance reporting before you've had your morning coffee. They're cloud-native systems with weekly or fortnightly release cycles, change-advisory boards, and rollback procedures that need three teams in a Slack huddle. They're long-lived products with enough accumulated complexity that every fix risks breaking two unrelated things. On all of those, finding a bug late is still genuinely more expensive, sometimes by orders of magnitude. The hundred-times multiplier hasn't gone away; it's gone away on a particular kind of product, and most of the industry doesn't ship that kind of product.

That's also the shortlist where the agent earns its keep. The fit isn't accidental. The pre-RC overnight slot exists precisely because these organisations don't deploy on every commit; they batch, they stage, they have a window between "code's in" and "release goes out" where finding something is cheap and finding it later is not. The agent fits the shape of the lifecycle these teams already run.

If you're already on full CD with a fast rollback and a small blast radius, the agent is still useful for discovery, but you'll feel the value differently. You're not buying insurance against expensive bugs. You're buying the ability to know what you don't know.

## What kind of work this is

The explorer's natural home isn't the pipeline. It's a deployed environment, run before the release candidate is cut, on a schedule the team treats as part of its rhythm. Overnight against the pre-RC slice, deeper against the candidate itself, occasionally on demand when someone wants a second opinion.

That isn't just an operational answer. It's a statement about what kind of work this is. Pipeline tests verify that the things you intended still work. The agent does something different: it discovers what you didn't intend. They aren't the same activity, and trying to gate the second on the same cadence as the first doesn't help either of them.

In Part 1 I framed the explorer as Columbo to Copilot's CSI: the lab versus the shabby raincoat. The detective doesn't accept "case closed" the first time either. He wanders off, has a think, comes back through the door with *one more thing*. The agent settles into the same rhythm when it's run somewhere alive: not a single answer, but a string of returns. The case stays open as long as the application keeps changing, which is forever.

What it doesn't yet do, when it comes back through the door tomorrow night, is remember what it noticed the night before. Each run starts fresh. Each report stands alone. That's been a deliberate constraint up to now, and it's where the next part of this story picks up.

---
