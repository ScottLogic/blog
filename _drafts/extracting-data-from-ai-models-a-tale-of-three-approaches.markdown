---
title: 'Extracting Data From AI Models: A Tale of Three Approaches'
date: 2025-07-23 15:49:00 Z
author: rgriffiths
---

This blog is about the ease (or not) of obtaining, collecting, or extracting data from past interactions with three different AI models. Perhaps I should have called it _What I wish I had known before starting a pair-programming project with AI?_ 

It is based solely on my experience of trying to retrospectively document my efforts at building a React application by extracting conversation threads I had developed with three different AI models. See my earlier blog posts: [Visualising the Trade Lifecycle - Phase 1: Building a React SPA with Multiple AIs](https://blog.scottlogic.com/2025/07/17/visualising-the-trade-lifecycle-phase-1-building-a-react-spa-with-multiple-ais.html) and [Visualising the Trade Lifecycle - Phase 2: Refactoring with Cursor IDE
](https://blog.scottlogic.com/2025/07/22/visualising-the-trade-lifecycle-phase-2-refactoring-with-cursor-ide.html) for more details about that project.

The models in question are ChatGPT, Claude and Copilot (Chat).

The interfaces used for each of them was the native web portal. In addition, and for ChatGPT alone, there was also the option of using a native Mac OS X app which was logged into the same account as used on the portal.

Once Phase 1 (see blog Phase 1 [Visualising the Trade Lifecycle - Phase 1: Building a React SPA with Multiple AIs](https://blog.scottlogic.com/2025/07/17/visualising-the-trade-lifecycle-phase-1-building-a-react-spa-with-multiple-ais.html)) had been completed, the development moved onto Cursor which implements Claude inside an IDE. _The experience with Cursor is not documented in this blog post._

Having developed a React SPA using the Three Cs and, latterly, The Four Cs (when Cursor was involved), the idea of creating a blog about my experience was suggested to me. However, the mere act of creating those blog posts led naturally to the creation of this blog post or, perhaps more accurately, a blog _metapost_ as it contains information about how those two other blog posts were created which, themselves, define the actual work done. Very meta indeed...

Not wishing to spoil the denouement of the blog post but, had I known in advance how much trouble it would be to extract data from the AI engines retrospectively, I would have collected and gathered the information I needed as the project progressed: it would have saved a lot of time, effort, and frustration. Thankfully, no tears were expended in the generation of this post. This structured approach could well be the topic of a future blog post... but I'm getting ahead of myself.

## The Good, The Bad, and The Ugly

### The Good

#### ChatGPT

Ultimately, it was a successful outcome here but it wasn't without its voyage of discovery along the way. When I first set out to extract and analyse my ChatGPT history, I assumed it would be a relatively straightforward task. After all, asking ChatGPT to tell me how to extract its own history gave a relatively straightforward answer and a file called `conversations.json` was downloaded. Surely it's just a matter of parsing that and splitting it into readable chunks, right?

Well, yes… and no...

My goal was simple: I wanted to convert my entire ChatGPT archive into a set of plain-text files - one per conversation - with clear timestamps, roles (user vs assistant), and the full content of each exchange. That goal seemed simple, however, the extraction of the `conversations.json` file was just the first step in a long and protracted journey...

What happened next was some additional, collaborative work with ChatGPT because the file was written to be machine-readable, not human-readable. Technically, it was all text and had what appeared to be JSON tags in what appeared to be the right places. However, it was only one line long (even though the file was 9.1MB in size!), didn't contain a line ending character (no LF nor CR), and the structure within was often inconsistent and therefore rather tricky to parse on screen by eye.

#### First Attempt: A Clean Script That Did Nothing

I started by asking ChatGPT itself how to approach the problem. It gave me a Python script that looked promising: it loaded the JSON, found the root node of each conversation (where `parent` is `null`), and walked through the message tree, writing out each exchange to a `.txt` file.

I ran it. No errors. No output either.

After a bit of debugging, I added a `print(f"Loaded {len(conversations)} conversations")` line. It printed `0`. So either the file was empty (it wasn't), or the script was assuming the wrong structure.

I think I could and should be forgiven for my assumption that ChatGPT should know its own internal file formats well enough to be the world-leading SME on how to read and parse them! Alas, we had some more work to do to get to that point.

#### The JSON Format: Not What I Expected

A quick `wc -l` on the file revealed something odd: zero lines. Turns out the entire JSON was minified, *i.e.*, it was just one massive line, no whitespace (for padding), no line termination. That's fine for parsers, but it made manual inspection tricky.

Worse, the file didn't have a top-level `"conversations"` key at all. Instead, it looked like a list of conversation objects, each with its own `"mapping"` of a graph of messages linked by UUIDs.

So the original script's assumption that there was a single root node per conversation didn't hold. Some conversations had multiple roots, or none at all. Others had malformed or missing timestamps. What a mess!

#### Iterating Toward a Working Solution

With some patient debugging by me, aided by python scripts provided by ChatGPT, and a rather nice feedback loop of investigation where we helped each other to solve the mystery, we gradually improved the approach. We added:

- A fallback for missing root nodes
- A recursive traversal that walked the entire message graph
- Logging for each file written

Eventually, I had a script that worked. It detected the structure of the file (list, dict, or wrapped export), extracted all messages, and wrote them out in timestamp order.

Success. Or so I thought.

#### The "Where Are My Prompts?" Moment

The output looked clean, but something was missing: the actual content. I was getting headers(titles, IDs, timestamps) but not the prompts nor the responses.

Turns out the script was still relying on a root-to-leaf traversal. If a conversation had forks, edits, or injected messages, they were skipped.

The fix was simple but crucial: instead of walking the tree, I just iterated over every node in the `"mapping"` and sorted them by `create_time`. That gave me a complete, linearised view of each conversation with every prompt and every reply in order.

#### The Unix Epoch Problem

One last wrinkle: all the timestamps were showing as `1970-01-01 01:00:00`. Classic Unix epoch. Some queries remained about the timestamps in the file but it transpires that most of these were missing and also not handled very well, i.e., they were zeroes (zero being that 1970 date on the Unix epoch timescale).

I updated the formatter to return `"Unknown Time"` for anything suspiciously early. That made it obvious which messages were missing metadata and helped me spot patterns in the export quality.

#### Final Outcome

In the end, the massive file of unintelligible gibberish was extracted into a sequence of well-formed, structured, human-readable files. I had a working pipeline:

- A Python script that auto-detects the JSON structure
- A more robust timestamp formatter that returned `"Unknown Time"` if the value was `0` or suspiciously small
- Full extraction of all messages, sorted by timestamp
- Clean `.txt` files with metadata and content
- A foundation I could build on for Markdown conversion, search indexing, or even training a personal GPT

The outcome was useful although not yet excellent nor easy). Little did I know that this would be "The Good" outcome...

### The Bad

#### Claude

## The Problem

The TL;DR is that Claude does not provide any way of programmatically extracting your own previous conversation history - not even as a dirty great big tarball! This immediately put it in the "Bad" category, but the journey to discover this was particularly frustrating.

## The False Dawn

Claude's own initial suggestion was refreshingly straightforward: save the contents of each chat separately in its own file, then use a Python script to parse and analyse the data. Simple enough, right?

Wrong.

After some additional digging, Claude offered what seemed like a more sophisticated solution - a Selenium plugin that could automate the download procedure. But that felt unnecessarily complicated for what should be a basic data export function.

## The API Red Herring

After even further pressure from me, Claude finally mentioned the golden ticket: an Anthropic API Key. "Finally!" I thought. Here was the programmatic solution I'd been looking for.

I dutifully went through the entire setup process:

- Obtained the API key
- Set up console access to Claude
- Configured my Python (virtual) environment with the appropriate anthropic libraries
- Overcame numerous configuration and access errors
- Dealt with repeated null or empty results from API queries

I was ready!

## The Crushing Revelation

It was only after I had invested significant time and effort in this approach - after getting the API working and thinking I'd cracked the problem - that Claude delivered the crushing blow: it wouldn't actually work. The Claude Console (API Access) keeps its conversation history in a completely different place from the Web Front-End. The API couldn't access my web conversations at all.

This felt like a bait-and-switch. Why suggest an API solution when you know it won't work for the stated purpose?

## The Workaround Journey

Left with no official solution, I had to get creative. The process that eventually worked involved:

### Building a Conversation Logger

Since I couldn't extract historical data easily, I built a Python script that could log future conversations through the API. This meant:

- Setting up a proper Python virtual environment
- Installing the anthropic package(s)
- Creating a structured logging system that captured dates, times, prompts, responses, and metadata
- Implementing automatic export to both JSON (machine-readable) and Markdown (human-readable) formats

### API Model Confusion

The online documentation suggested using `claude-sonnet-4-20250514`, but this threw HTTP 400 errors (Bad Request). Through trial and error, I discovered that `claude-3-5-sonnet-20241022` worked so I switched to that. This kind of disconnect between documentation and reality is frustrating when you're trying to build reliable tooling.

### The System Prompt Gotcha

Even after getting the right model, I hit another API quirk: the system parameter must be a string (if provided), or omitted entirely. Passing `system=None` caused failures. These are the kinds of edge cases that make programmatic access feel fragile.

## The Browser Automation Fallback

For historical conversations, I ultimately had to explore browser automation:

- **Selenium/Playwright approach**: Navigate to Claude.ai, handle authentication, iterate through conversations
- **Browser Extension option**: Create a Chrome/Firefox extension to extract DOM data
- **Manual export workflow**: Copy conversations from web interface and process with Python

None of these are elegant solutions. They're all workarounds for what should be a basic data portability feature.

## The Tools That Emerged

Despite the frustrations, I did end up with some useful tools:

### ConversationLogger

A Python class that:

- Logs all API conversations with timestamps
- Exports to JSON and Markdown formats
- Tracks token usage and metadata
- Provides conversation analysis capabilities

### ConversationTranscriptManager

A processor for web-exported conversations that:

- Parses raw conversation text into structured data
- Handles different conversation formats automatically
- Generates beautiful Markdown transcripts
- Creates comprehensive summary reports

## The Verdict

This was a rather tortuous journey with many blind alleys and wrong turns along the way. Ultimately, I failed to get hold of my previous web conversations in a programmatic way and discovered the following nuggets along the way:

1. **No native export functionality** - Basic data portability should be a given
2. **Misleading API guidance** - Suggesting solutions that don't work wastes developer time
3. **Fragmented storage** - Web conversations and API conversations live in different worlds
4. **Unnecessary complexity** - Simple data export requires building custom tooling

The irony is that I ended up with a more sophisticated conversation logging system than I originally needed, but only because the straightforward approach simply doesn't exist.

If you're planning to work with Claude programmatically, learn from my experience: build your logging system from day one. Don't assume you can extract historical data later - you probably can't. Consequently, this experiment is flagged as "The Bad".

### The Ugly

#### Copilot

## The Problem

Like Claude, Copilot provided no easy way to extract the data I needed - at least not immediately. But unlike Claude's complete absence of solutions, Copilot dangled a carrot that turned out to be behind a corporate firewall.

## The Bait: "Yes, There's an API!"

When I asked about programmatic access to my chat history, Copilot's initial response was encouraging. After dismissing browser automation as "an awful lot of work" (which it absolutely is), Copilot revealed the existence of the Microsoft 365 Copilot Interaction Export API.

Finally! A proper, official solution. The API promised to:

- Capture and archive user interactions with Copilot across Microsoft 365 apps
- Enable compliance, monitoring, and auditing of AI usage
- Export structured data including timestamps, user prompts, and AI responses

This sounded perfect - exactly what I needed for my analysis.

## The Switch: Enterprise-Only Access

The ugly truth emerged in the requirements. To use this API, I needed:

- Microsoft 365 Enterprise account with Copilot enabled ✓ (I had this)
- Admin permissions to register and authorise applications ✗ (I didn't have this)
- Access to Microsoft Graph API and Copilot extensibility features ✗ (Blocked by the above)

## The Corporate Runaround

Even with my M365 E5 license, I couldn't simply access my own data. The process required:

### Step 1: Beg IT for Permissions

Copilot helpfully drafted an email for me to send to our IT team:

> I'd like to analyze my Copilot chat history for internal research and productivity insights. To do this, I need access to the Microsoft 365 Copilot Interaction Export API.
> 
> Could you please help register an app in Microsoft Entra ID with the following permissions?
> 
> API Permissions:
> 
> - Copilot.Interaction.Export.All (Application)
> - User.Read (Delegated)
> - offline_access (Delegated)
> 
> Once registered, I'll need:
> 
> - Application (client) ID
> - Directory (tenant) ID
> - Client secret

### Step 2: Wait for Corporate Approval

My request had to go through:

- IT approval processes
- Security reviews
- Compliance checks
- App registration procedures

All of this bureaucracy just to access my own conversation history.

## The Fallback: Manual Labor

If the API request was denied, I'd be back to the same manual extraction methods that made this whole exercise frustrating in the first place:

- Copy-paste individual conversations
- Browser automation with Selenium
- Manual structuring of unstructured data

## The Architectural Problem

The ugly reality is that Copilot's suggested solution, while technically more attractive than Claude's non-solution, puts individual users at the mercy of corporate IT policies. Unlike ChatGPT's straightforward export, Copilot treats your conversation history as corporate data that requires enterprise-level access controls.

This creates a fundamental mismatch between:

- **What users expect**: Simple access to their own data
- **What Microsoft provides**: Enterprise-grade data governance that blocks individual access

## The Irony

The most frustrating part? Copilot could clearly explain exactly how to access the data, provide step-by-step instructions, and even draft the necessary communication. It had all the knowledge to solve my problem - but the solution was locked behind corporate policies that Copilot itself couldn't circumvent. Nor did I ask it to try, just to be clear!

## The Plot Thickens: When AI Doesn't Know Its Own APIs

Eventually, IT got back to me with a query about my request for access to `Copilot.Interaction.Export.All`. The response was illuminating: "This permission doesn't exist..."

Thanks very much, Copilot, for confidently requesting access to something that doesn't actually exist. That's not super awesome.

## Back to the Drawing Board

I returned to Copilot with this revelation:

> "Copilot.Interaction.Export.All doesn't appear to exist for our admins to grant me that permission."

Copilot's response was rather matter-of-fact:

> "The permission Copilot.Interaction.Export.All does not exist. Instead, the correct permission for the Microsoft 365 Copilot Interaction Export API is: `AiEnterpriseInteraction.Read.All` (Application permission)"

So back to IT I went, cap in hand, requesting this new permission. Their response was swift and definitive. This wouldn't be possible for two critical reasons:

1. **Wrong product**: I don't have access to "Microsoft 365 Copilot," just "Copilot Chat"
2. **Security nightmare**: This role would give access to chat history for **ALL USERS** in the organisation

## The Microsoft Naming Maze

This is where the "ugly" really crystallised. I was dealing with the obfuscated naming of Microsoft's AI products:

- **Microsoft 365 Copilot** (requires license) - what the API actually serves
- **Microsoft 365 Copilot Chat** (no license required) - what I actually had access to

The API documentation doesn't clearly distinguish between these products, leading to confusion about what's actually accessible. I also hadn't appreciated the difference between the two different offerings.

## The Final Nail

When I explained this limitation back to Copilot, it confirmed my worst fears:

> "This permission grants access to all users' Copilot interactions across the tenant. It requires admin consent and is not scoped to individual users. It only works for Microsoft 365 Copilot (licensed), not Copilot Chat (unlicensed)."

Even if IT had been willing to grant enterprise-wide access to chat histories (which they absolutely were not going to do!), the API wouldn't return any data for my unlicensed account anyway.

## The Surrender

At this point, I decided to park the entire Copilot extraction effort.

- Non-existent APIs confidently recommended by the AI itself
- Corporate security policies preventing enterprise-wide access (and justifiably so!)
- Product licensing restrictions that made the whole exercise pointless

This combination meant that I would restrict my usage of Copilot Chat to simple tasks like text summaries of Teams chats and meeting notes but nothing deeper that would require historical analysis or potential future data extraction.

## The Verdict

1. **AI misinformation** - Copilot confidently suggested non-existent API permissions
2. **False hope** - The solution was alleged to exist but may be inaccessible due to organisational constraints
3. **Corporate gatekeeping** - Individual users can't access their own data without enterprise-wide permissions (and even then only for those with an active product licence)
4. **Product fragmentation** - The API serves a different product from what most users actually have access to
5. **Security overreach** - The only available permission grants access to all users' data, making it unsuitable for individual use
6. **Licensing confusion** - The distinction between "Copilot" and "Copilot Chat" isn't clear in documentation
7. **Wasted effort** - Multiple rounds of IT requests for permissions that were never going to work

The Copilot experience represents the absolute worst-case scenario: an AI that doesn't understand its own infrastructure, wrapped in corporate governance that treats individual data access as an enterprise security risk, all while obscuring the fundamental product limitations that make the entire exercise futile. It's a masterclass in how not to implement data portability in enterprise environments.

This is why this experiment gets labelled as "The Ugly".
