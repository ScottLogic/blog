---
title: I spent 2 weeks making Narration.studio to save an hour writing this post
date: 2020-11-02 00:00:00 Z
categories:
- Tech
tags:
- javascript
- dev logs
- narration.studio
author: swaterman
layout: default_post
summary: 'Narration.studio is my latest project: a web app for automatically editing
  voiceovers. In this first part, I introduce the project and the motivations behind
  it.'
summary-short: 'Introducing Narration.studio: automatic in-browser audio editing'
image: swaterman/assets/narration-studio-1/coldsweat.png
---

> AKA 'How to use every experimental web technology you can think of to re-implement a bedtime story'

![Years have passed. Now an old man, I celebrate how much time I saved while rising sea levels cause a child to almost drown]({{ site.github.url }}/swaterman/assets/narration-studio-1/oldman.png "Does this imply that I caused global warming?")

This post is the first in a series about my latest project, [Narration.studio](https://narration.studio) ([GitHub](https://github.com/stevenwaterman/narration.studio)).
In this post, we simply introduce it, discuss the motivations behind the project, and give a top-level view of how it all works.
In the next posts, we'll deep-dive into the more technical aspects of the project.

Click the links below to jump to the other parts.

1. **Introduction**
1. Markdown Parsing (Coming Soon)
1. Speech Recognition (Coming Soon)
1. Audio Processing (Coming Soon)
1. High-Performance Rendering (Coming Soon)

<hr/>

For best results, listen to me read you this post instead!
Just play the audio and the page will automatically scroll in sync.
After all, don't you want to see the fruits of my labour?

<audio 
  id="narration" 
  controls 
  src="{{ site.github.url }}/swaterman/assets/narration-studio-1/narration.mp3"
  style="width: 100%;"
  preload="metadata"
>
  Your browser does not support the <code>audio</code> element.
</audio>

<hr/>

## Background

<div id="timestamp-0.000"></div>
 
When I wrote my [last blog post](https://blog.scottlogic.com/2020/10/09/ergo-rabbit-hole.html) about ergonomic keyboards, I decided at the last minute that it would be nice if there was a narration you could listen to, since it was very story-like.
Without putting much thought into it, I loaded up [Audacity](https://www.audacityteam.org/) and started recording myself reading the script.
It's not the first time I've done something like that - I've been involved in podcasts in the past so it was basically muscle memory.

<div id="timestamp-19.733"></div>
 
When I was done with the recording, I had to start editing it.
I cut out the bad takes, deleted the bit where my cat walked in screaming, and tidied up the pauses between sentences.
Then, I listened to the whole thing at 2x speed and made a note of when each paragraph started.
I manually translated those timestamps into `<div>`s, annotating the script so it knew when to highlight each paragraph.

<div id="timestamp-40.353"></div>
 
What I'm trying to say here is that it was incredibly manual.
It only took me an hour or two in total, but those were some *very boring* minutes of my life.
There was only one thing on my mind:

<div id="timestamp-51.480"></div>
 
> Surely there's a way to [automate it](https://xkcd.com/1319/) [and save time](https://xkcd.com/1205/)?
<div id="timestamp-55.250"></div>
 
That thought bounced around inside my skull until one day, I woke up in a cold sweat with little memory of those days prior.
Two weeks had passed.
[Narration.studio](https://narration.studio) was released.

<div id="timestamp-66.775"></div>
 
![An angry-looking narration studio hovers over me in bed, waking me up with a start]({{ site.github.url }}/swaterman/assets/narration-studio-1/coldsweat.png "FATHER WHY HAVE YOU CREATED ME")

<div id="timestamp-72.286"></div>
 
## What does it do?

<div id="timestamp-74.424"></div>
 
We know that it automates your narration, but what does that mean in practice?
Well, I could do a write-up, but there's already one on the home page so I'm just going to steal that.
Here's how to use Narration.studio:

<div id="timestamp-86.509"></div>
 
Step 1: **Enter the script**.

<div id="timestamp-89.448"></div>
 
* Plain Text / CommonMark / GitHub Flavored Markdown
* Supports links, images, tables, code blocks, and more!

<div id="timestamp-97.901"></div>
 
Step 2: **Record the script**

<div id="timestamp-100.942"></div>
 
* Read each line as it's shown to you
* Don't like your delivery? Just say the last line again!
* Got distracted and said something not in the script? It'll get cut!
* 5 second pause? 10 minute pause? It'll get cut!
* No manual input required, everything works with speech recognition

<div id="timestamp-120.320"></div>
 
Step 3: **Edit the recording**

<div id="timestamp-123.265"></div>
 
* Listen to the auto-edited recording
* Adjust the start and end of each clip
* Auto-saves, so leave and come back later!
* Grab the script annotated with audio timestamps
* Download your edited audio as a high quality .wav file

<div id="timestamp-139.889"></div>
 
## How does it work?

<div id="timestamp-141.981"></div>
 
Those are the important bits from a user's perspective, but which bits were the hardest to implement?
The project may look simple at a glance, but once you peel back the curtain there's a whole host of interesting problems that needed to be solved.
It has the amusing effect of making the project really impressive to other developers but kinda underwhelming to everyone else!

<div id="timestamp-159.476"></div>
 
On top of the hard Computer Science problems to be solved, I had the added complexity of building it as a frontend-only web app.
That was better from a privacy perspective, but more importantly meant it was completely free to host.
It's probably no surprise to anyone that's seen my recent tech talks and other blogs, but I picked [Svelte](https://svelte.dev) as the project's front-end framework.
On top of that, I used every experimental web technology imaginable, including:

<div id="timestamp-181.727"></div>
 
* Speech Recognition API
* Web Audio API
* MediaDevices API
* OffscreenCanvas
* WebGL2
* IndexedDB

<div id="timestamp-193.581"></div>
 
![2-step cake recipe. Step 1: Buy a cafe. Step 2: Ignore everything except the cake. Simple!]({{ site.github.url }}/swaterman/assets/narration-studio-1/cafe.png "Ever use a library for one method? This is you. And me.")

<div id="timestamp-203.425"></div>
 
Let's talk a bit more about where that technical complexity came into play.
To me, there were 4 main areas.
Each one is getting its own blog post, but here's a summary:

<div id="timestamp-213.354"></div>
 
### Part 2: Markdown Parsing

<div id="timestamp-216.575"></div>
 
The whole point of Narration.studio was to automate the process of recording voiceovers for my blog posts.
Since I write them in Markdown, I really wanted to be able to use that in the script to remove the need for any manual pre-processing.

<div id="timestamp-228.954"></div>
 
Given a Markdown script, we need to know where the start and end of each sentence is.
We also need to determine which bits should be read aloud, and which bits are just for formatting or metadata.
How can we make sure the user only has to read the text, and not links and other non-text bits?

<div id="timestamp-244.716"></div>
 
You can probably see where this is going.
Yes, I started with regular expressions.
And yes, I did eventually give up and use a Markdown lexer.
That's not to say it solved the problem though - there was still a lot of post-processing needed.

<div id="timestamp-258.289"></div>
 
In part 2 (coming soon), we see *once again* why you shouldn't try to write your own parser in regex.

<div id="timestamp-263.924"></div>
 
### Part 3: Speech Recognition

<div id="timestamp-266.814"></div>
 
I didn't want any manual input during the recording process.
The site knows the script and knows what the user could be saying, and is already recording the mic.
Can't we use that information to automatically determine which line was said, and when?

<div id="timestamp-280.324"></div>
 
The answer is yes - there is an experimental Speech Recognition API in recent Chromium-based browsers, and it works seamlessly.
However, the API just returns the sentence it thinks you said.
That brings a whole host of new problems.

<div id="timestamp-293.959"></div>
 
![Option A or Option B, asks the computer. The human knows what they want - Option C! Computer is ANGRY!]({{ site.github.url }}/swaterman/assets/narration-studio-1/optionC.png "Computer problems are easy until those darn humans get involved!")

<div id="timestamp-304.306"></div>
 
What happens when the recognised speech doesn't perfectly match any of the lines in the script?
What happens when **two** words sound **too** similar **to** distinguish?
How can you determine how similar two sentences *sound*?

<div id="timestamp-317.143"></div>
 
Dealing with those problems, I finally got a chance to use that advanced algorithms module I suffered through at uni.
Join me on that journey in part 3 (coming soon), where we explore the strange intersection between Speech Recognition websites and 1960s mathematical theory.

<div id="timestamp-330.997"></div>
 
### Part 4: Audio Processing

<div id="timestamp-334.084"></div>
 
Shockingly, web browsers weren't designed for audio production.
How can we ignore that inconvenient fact, and record lossless audio in a browser?
Once we've done that, how can we edit it in the browser, keeping that lossless quality?
How can we post-process it to improve the quality in a generic way that works for everyone?

<div id="timestamp-353.277"></div>
 
The Speech Recognition API gives us an approximate start and end time for each sentence, but how can we get it exact?
We have the audio recorded, so we can base the timings on that, but how can you tell the difference between speech and silence?
How do you deal with background noise?

<div id="timestamp-369.599"></div>
 
![My cat screams and deafens everyone within earshot]({{ site.github.url }}/swaterman/assets/narration-studio-1/scream.png "Each creature in a 20-foot radius must succeed on a Constitution saving throw")

<div id="timestamp-375.223"></div>
 
In part 4 (coming soon), we go on an in-depth journey through the Web Audio API, putting everything I learnt writing [MuseTree](https://www.stevenwaterman.uk/musetree) to use.

<div id="timestamp-383.184"></div>
 
### Part 5: High-Performance Rendering

<div id="timestamp-386.556"></div>
 
On the editor screen, the waveform is a visual indication of the audio, making it easier to edit the start and end of each snippet accurately.
However, that's not as simple as it sounds.

<div id="timestamp-398.050"></div>
 
Uncompressed audio is around 1MB of data every 10 seconds.
The sheer quantity of data causes a lot of issues - or at least I thought it would.
In a classic tale of premature optimisation, I went through a few different approaches trying to minimise the amount of rendering that needs to happen.

<div id="timestamp-414.646"></div>
 
In the end, guess what?
Turns out it's way faster to just throw all the data at the GPU using WebGL and brute-force your way to victory!
It's not perfect, but it's good enough.

<div id="timestamp-426.025"></div>
 
Part 5 (coming soon) is dedicated to this topic, walking through a few of my failed attempts to optimise the rendering code before discussing what I ended up with.
We'll explore the strengths and weaknesses of my approach, before introducing a few optimisations that might actually be necessary.

<div id="timestamp-440.701"></div>
 
## Conclusion

<div id="timestamp-442.668"></div>
 
It took me a while, and it was a lot harder than I expected, but I'm happy with the finished product.
I mean, clearly - I used it for this post!
It works consistently, does what it says on the tin, and gave me an excuse to try out a load of new web technologies!
Want to know more about the technical side of things?
Go check out part 2 (Coming Soon), which discusses how I parse the script and figure out which bits need narrating.

<div id="timestamp-465.202"></div>
 
If you've heard enough, try it out for yourself at [Narration.studio](https://narration.studio)!
Found a bug?
It's [open source on GitHub](https://github.com/stevenwaterman/narration.studio/), so open an issue.
Even better, do my work for me and fix it with a PR!
<hr/>

<div id="timestamp-477.082"></div>
 
Questions? Feedback? Hit me up on [Twitter](https://twitter.com/SteWaterman)!

<script src="{{ site.github.url }}/swaterman/assets/narration-studio-1/audioEvents.js"></script>