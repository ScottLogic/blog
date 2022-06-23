---
published: true
author: swaterman
layout: default_post
title: "Down the ergonomic keyboard rabbit hole"
summary: "Over the past few months I've had an ergonomic keyboard obsession. It started out simple, just wanting to improve my typing experience. It ended with me writing a driver. This is my story - now available as an audiobook!"
summary-short: "My keyboard is strange, and I love it"
categories:
  - Tech
tags:
  - retrospectives
  - keyboards
  - ergonomics
image: swaterman/assets/ergo-rabbit-hole/toolate.png
---

For best results, listen to me read you this post instead!
Just play the audio and the page will automatically scroll in sync.

<audio 
  id="audio_book" 
  controls 
  src="{{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/audio.mp3"
  style="width: 100%;"
  preload="metadata"
>
Your browser does not support the <code>audio</code> element.
</audio>

---

<div id="audio_book_paragraph_0"></div>

This post is all about my recent obsession with ergonomic keyboards.
There are technical elements to it, but mostly I'm just gonna tell you a story about my slow descent into madness.
Hang on, and enjoy the ride.

## Prologue

<div id="audio_book_paragraph_15.9"></div>

The story starts a few years ago, when I decided to buy myself a [Koolertron Programmable Split Mechanical Keyboard, All 89 Keys Programmable Ergonomic Keypad, 8 Macro Keys...](https://www.amazon.co.uk/Koolertron-Programmable-Mechanical-Keyboard-Ergonomic/dp/B07PZT3Z25).
If it wasn't obvious from the name, it was *very* Chinese, *very* badly documented, and *very* badly made.
That didn't matter though, I was smitten.

<div id="audio_book_paragraph_39.5"></div>

![For reference, all of the images in this article are terrible mspaint drawings done by me. This one has a stick figure holding a keyboard surrounded by what looks like fire or an explosion]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/smitten.png "I hope you're ready for a lot of mspaint...")

<div id="audio_book_paragraph_56"></div>

I bought the split keyboard because I was obsessed with the idea of typing one-handed.
If I could program the keyboard to use chorded keys (sending one character by pressing two buttons at once), then I could have the whole alphabet available on half a keyboard.
At that point, I could use a keyboard and a mouse, or even a pen, at the same time.
Think of the efficiency!

<div id="audio_book_paragraph_79.2"></div>

The keyboard came, and I started learning to use it.
It was a bit of a pain, as the manual was mostly Chinese and the software only worked on Windows.
I use the term *worked* loosely.
It would break at random times, and had various undocumented limitations that I had to figure out through trial and error.

<div id="audio_book_paragraph_98.9"></div>

That wouldn't stop me though, I was smitten!
I dutifully programmed the keyboard and started learning to type again.
Over the course of a couple of days, I slowly worked my way up to 20 words per minute.

<div id="audio_book_paragraph_111.4"></div>

At some point, I realised it wasn't going to be as quick and easy as I hoped.
I *also* realised that it was exam season, that I was a university student, and that I really had better things to do.
Had my excitement just been subconscious procrastination?

<div id="audio_book_paragraph_129"></div>

Years later, the keyboard sat on a shelf, unused ever since.
The answer seemed to be a yes.

<div id="audio_book_paragraph_137"></div>

![The keyboard is covered in cobwebs]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/cobweb.png "We all have a tech graveyard like this. Admit it.")

## Accidental Rediscovery

<div id="audio_book_paragraph_146.5"></div>

We jump forwards to March 2020, and I was working from home.
Fed up with swapping my keyboard between my PC and company laptop, I went looking for a second one to use.
As luck would have it, the only spare keyboard was the one I had abandoned years earlier.

<div id="audio_book_paragraph_166.5"></div>

There was no way I was using the chord-based setup though, so I went in search of a way to reset it.
A few hours and one dodgy Google Drive link later, I had a copy of the software.
I traipsed the keyboard upstairs to my wife's (Windows-based) PC, and reconfigured it to something resembling a standard QWERTY keyboard.

<div id="audio_book_paragraph_186"></div>

At this point, I couldn't care less about the ergonomics of my new keyboard.
I just wanted it to work.

<div id="audio_book_paragraph_193"></div>

![Man asks keyboard to be normal. Keyboard refuses.]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/normal.png "Has *this* ever happened to you?")

<div id="audio_book_paragraph_200"></div>

At first, it was a struggle.
Learning any new keyboard is always a bit jarring, but the split layout was especially confusing.
I had a bad habit of using my left hand for most keys, and I kept trying to press `Y` and `H` on the left keyboard.
Both of those were on the right side, and what I was actually pressing was a macro key that tabbed out of the current window.
That was a little annoying!

<div id="audio_book_paragraph_223"></div>

I tried to retrain my brain, but it was far too much effort.
I gave up and just reprogrammed the keyboard to have `Y` and `H` on the left instead.
Feeling like a genius, I started using the new layout.
It felt much more natural, but I was still having trouble.

<div id="audio_book_paragraph_240.5"></div>

What was wrong?
Turns out I press `Y` and `H` with my right hand too.
Good job Steve, good typing skills you've got there.
Up the stairs we went, reprogramming it to have two of each.

<div id="audio_book_paragraph_253.5"></div>

Finally, I wasn't making constant mistakes.
The unfamiliar setup still caused problems though, and my typing speed definitely got worse.
What's more, I ended each day with a sore back.
Aren't split keyboards meant to be more ergonomic?

<div id="audio_book_paragraph_270"></div>

It turned out that the issue was just how unfamiliar it was.
Everything was a bit more manual, and I was having to type more consciously.
I couldn't rely on muscle memory, meaning I actually had to *think* about how to type.
In the end, that just meant I was much more tense, hunching over and looking at the keys.

<div id="audio_book_paragraph_288.75"></div>

![Man rotates spine 720 degrees, gets back pain.]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/posture.png "Nobody could've seen this coming")

<div id="audio_book_paragraph_297.5"></div>

Over the next few months, I started to notice that I preferred typing on the split keyboard.
The back pain was gone, and it just started to feel comfy.
Going back to my old keyboard felt alien.
Its keys felt too close together, and the bend in my wrists felt tense and uncomfortable.
When the work project ended and I no longer needed two keyboards, I decided to keep using the split keyboard on my PC.

## Getting Serious

<div id="audio_book_paragraph_323"></div>

Things weren't all sunshine and rainbows though.
The (lack of) build quality was starting to catch up with me.
The micro-usb ports were coming loose, and it started to disconnect randomly.
It was fine at first, and I just accepted that the cable needed to be in a specific position.

<div id="audio_book_paragraph_342"></div>

Over time, that position became more and more specific.
At its worst, I once spent half an hour trying to get a connection.
Exasperated, I held the cable in exactly the right place and pulled out the hot glue gun.
Now the cable wasn't going anywhere, and I could use my keyboard in peace.

<div id="audio_book_paragraph_360"></div>

![Half the keyboard is covered in a thick layer of glue]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/hotglue.png "LifeHax")

<div id="audio_book_paragraph_370"></div>

A couple of weeks later, the problem returned.
The cable was now so fiddly that the slight flex in the hot glue was enough for it to disconnect.
Drastic times call for drastic measures, so I started taking the other side of the keyboard apart.
There were micro-usb ports on both sides, so I could just remove the port and solder a wire onto the pads directly.

<div id="audio_book_paragraph_393"></div>

With the keyboard in pieces and a micro-usb port on my dining room table, I learned that micro-usb is really small.
Probably could've guessed, given the name...
I briefly considered taking my keyboard to a phone repair shop, but decided that I had too much self respect.

<div id="audio_book_paragraph_409.5"></div>

![Man begs for his son's life. Phone repair shop is confused.]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/phones.png "This is the point where most people would re-evaluate their priorities")

<div id="audio_book_paragraph_421"></div>

I tried just going back to my old keyboard, but it was too late.
I was a split keyboard weirdo now, and I had to embrace it.

<div id="audio_book_paragraph_429.5"></div>

Suffering through the dodgy connection and the fact that I couldn't reprogram the right-hand side of my keyboard, I started looking for a replacement.
I *could* just buy another of the same model, but that felt short-sighted.
This one had broken - who's to say the next one wouldn't too?

<div id="audio_book_paragraph_447"></div>

I stumbled across the [Kinesis Advantage 2](https://kinesis-ergo.com/shop/advantage2/) but couldn't find it in stock anywhere.
What's more, it just felt a bit old-fashioned.
I'd seen the crazy stuff people had been doing with mechanical keyboards, surely things have moved on from that?

<div id="audio_book_paragraph_462"></div>

![Strange looking keyboard child stands next to old-man kinesis advantage 2.]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/old.png "How many times do we have to teach you this lesson, old man?")

<div id="audio_book_paragraph_469.5"></div>

My suspicions were quickly confirmed when I found the [Ergodox EZ](https://ergodox-ez.com/).
It had a pretty compelling feature list:

<div id="audio_book_paragraph_478.5"></div>

* Completely configurable - both hardware and software
* Ortholinear layout, meaning the keys were arranged in neat columns without being offset left-right
* Adjustable legs to tilt it in any direction
* Completely open-source, even down to the PCBs
* Great build quality, reliable warranty, and an active DIY community with spare parts widely available

<div id="audio_book_paragraph_510"></div>

I was sold.
It took me a while to stomach the price at nearly £300, but I worked my way through the configurator.

<div id="audio_book_paragraph_519.5"></div>

The [black case](https://cdn.shopify.com/s/files/1/1152/3264/products/ab39140e3565f145aa488ee14e3bbd18_fdf03bc1-a62b-45f8-a10d-f62cc3e82ceb.jpg?v=1570475753) was an easy choice because I'm not flamboyant enough to pull off an [all-white keyboard](https://cdn.shopify.com/s/files/1/1152/3264/products/e1fbe3297b62fb3a394029694f7d3d90_95ac7869-4eec-4249-a80b-b49b1e14e50e.jpg?v=1570475753).
Blank keycaps weren't my first choice, but are nicer to use as they're sculpted for a specific location on the keyboard.
Meanwhile, the printed keycaps are designed to be swapped around based on your configured layout.
The adjustable legs seemed like a must, so I shelled out the extra for those.
Trying to save at least a little money, I declined all of the RGB lights - both under the keys and the under-keyboard *mood lighting*.

<div id="audio_book_paragraph_553.5"></div>

When it came to keyswitches, I'm experienced enough to know I wanted [Cherry MX Browns](https://www.cherrymx.de/en/mx-original/mx-brown.html), which are quiet but tactile.
I bought an extra 20 [Kailh Gold](https://ergodox-ez.com/pages/keyswitches) switches which are super clicky, to use for the macro buttons.
Yes, that's right.
The key switches are hot-swappable.

<div id="audio_book_paragraph_577.75"></div>

Then, I began long wait for delivery.

## Learning to type again, again

<div id="audio_book_paragraph_582.5"></div>

I watched the tracker as my keyboard made its way over from Taiwan.
With each city it passed through over the next few weeks, I got more and more excited.
Then it arrived.
I immediately unboxed it and tried it out.

<div id="audio_book_paragraph_599.5"></div>

![Santa delivers the post.]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/santa.png "It was June")

<div id="audio_book_paragraph_603.5"></div>

It was fine.

<div id="audio_book_paragraph_605.5"></div>

Like, it was a nice keyboard and everything.
It was just different.
I felt the same tension with this keyboard as I did when learning to use the first split keyboard.
It was unfamiliar, felt strange, and made typing into a conscious activity.

<div id="audio_book_paragraph_621.5"></div>

I tried to get used to it, learning the default QWERTY layout, but it wasn't easy.
At some point, I snapped.

<div id="audio_book_paragraph_629.5"></div>

> Screw this, if I have to relearn how to type I may as well learn a better layout.

<div id="audio_book_paragraph_636.5"></div>

I had a look around at the available options, especially [Dvorak](https://en.wikipedia.org/wiki/Dvorak_keyboard_layout) and [Colemak](https://en.wikipedia.org/wiki/Colemak).
In the end, I chose Colemak, and honestly can't remember why.
It probably just looked less scary, and the [data supports that it's the more efficient option](https://colemak.com/Fast).

<div id="audio_book_paragraph_652.5"></div>

I loaded up [Oryx](configure.ergodox-ez.com/), the Ergodox configuration tool, and started reprogramming my keyboard.
It was basically just Colemak, but with the number keys in a separate layer to emphasise the symbols.
My first attempt a custom keyboard layout [looked like this](https://configure.ergodox-ez.com/ergodox-ez/layouts/Ov6O3/OYOD3/0):

<div id="audio_book_paragraph_667.5"></div>

![A screenshot of the configuartion tool showing the Colemak layout on the Ergodox EZ]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/colemak.png "This was the *less* scary option?")

<div id="audio_book_paragraph_676"></div>

Armed with my new keyboard layout, I started my typing practice again.
It was painful, but we worked through it.
4 hours of hard practice later, I had typed 228 snippets and the website decided I was a competent typist.

<div id="audio_book_paragraph_691.5"></div>

At least, I was competent with the letters `ENITRL`.
Yes, I spent 4 hours typing words with those 6 letters before it decided I could handle `S`.
The website was wrong - I couldn't handle `S`.
My typing speed dropped from 45wpm to 20wpm.

<div id="audio_book_paragraph_712.5"></div>

![I am saying "I'm tired" but the M and D are red]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/tired.png "Six letters is not enough")

<div id="audio_book_paragraph_721.5"></div>

Nevertheless, I stuck with it and slowly learned how to type `S`.
After another 50 snippets, I was ready to move on.
While we're here, just take a mental note that each of these snippets took between 30 seconds and two minutes to type.
Every time I say 50 snippets, just mentally replace that with 50 minutes.

<div id="audio_book_paragraph_744.5"></div>

When I got to the letter `D` after almost 400 snippets total, I found it a lot harder than I expected.
In Colemak, `D` requires you to move your left index finger out of its column and press the key to the right.
It was the first time I had to do that, and It didn't come naturally.

<div id="audio_book_paragraph_761.5"></div>

![A finger has a 90 degree sideways bend in it]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/finger.png "Have you been in an accident that wasn't your fault?")

<div id="audio_book_paragraph_768.5"></div>

Later that day, I learned about the [Workman keyboard layout](https://workmanlayout.org/).
It's based around avoiding that horizontal movement I found so difficult.
I briefly thought about swapping to the Workman layout completely, but wasn't willing to go through another 7 hours re-learning the home row.

<div id="audio_book_paragraph_784.5"></div>

Instead, I took the concepts they discussed and applied them to my keyboard layout, only moving the keys I hadn't learnt yet (and `D`).
If moving my fingers sideways is hard, why don't we just... not?
Could we build a keyboard layout around 8 columns, rather than the usual 10 columns?

<div id="audio_book_paragraph_803.5"></div>

The obvious answer is no.
There are only 3 rows of buttons, meaning the layout would only have space for 24 letters total.
A strange thought hit me.
I started playing around with my keyboard, trying to rank how easy it was to press each key.

<div id="audio_book_paragraph_819"></div>

Moving my index fingers towards the middle, like I was with `D`, is hard.
Moving my little finger up, like you would to press Q on a standard layout, is also really hard.
Pressing the number row with my index and middle fingers is easy.
Why not just put letters there?

<div id="audio_book_paragraph_838"></div>

![A middle finger extends to be incredibly long and presses the F key]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/pressF.png "Press F to pay respects to 10-column layouts")

<div id="audio_book_paragraph_846"></div>

That seemed like a pretty crazy idea, but I'm not one to be held back by tradition or common practice.
I loaded up Oryx and gave it a go.
At this point I felt like a complete lunatic, but jumped right back into the typing practice.
Re-learning the letter `D` was hard, but once I was there, it felt much easier.

<div id="audio_book_paragraph_865.5"></div>

I continued through the training, dreading the day I'd unlock one of the number-row letters and have to give up on the layout.
Roughly 600 snippets in, I unlocked `B` which was where `4` was on a normal layout.
It was... fine?
To everyone's surprise, I had no real problem with it.
Moving my finger 2 keys up was much easier than 1 key sideways.
I had settled on [this](https://configure.ergodox-ez.com/ergodox-ez/layouts/5BvvY/LnPYL/0):

<div id="audio_book_paragraph_890"></div>

![A very strange keyboard layout with letters in the top row]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/custom-colemak.png "Yes, that's the layout I'm using right now to type this")

<div id="audio_book_paragraph_900"></div>

I kept going with that layout and had no real issues, unlocking the final 9 keys in the next 150 snippets.
I had finally unlocked every letter.
I was free!

<div id="audio_book_paragraph_912"></div>

I'm not going to say I was a fast typist at that point.
I had hovered around 20wpm ever since unlocking the first letter.
Every time I got a little faster, they threw more letters in and slowed me down again.

<div id="audio_book_paragraph_924"></div>

All in all, I spent almost 12 hours doing typing practice over a period of 7 days.
It had consumed all my free time, and at least some of my life.
I just wanted to be done.

<div id="audio_book_paragraph_935"></div>

![I lie dead in a desert]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/desert.png "They said being a keyboard nerd wouldn't make me hot")

<div id="audio_book_paragraph_940.5"></div>

I started using the Ergodox for programming, despite how slow I was.
It was frustrating, I felt tense, and my back hurt.
At times, it was wonderful.
As I started to relax, I could see why people liked this keyboard so much.

<div id="audio_book_paragraph_954.5"></div>

Three months later, I was mostly happy with my [keyboard layout](https://configure.ergodox-ez.com/ergodox-ez/layouts/5BvvY/x6PQL/0).
All the symbols had their place, and I'd figured out how to make the best use of the layers.
I was up to around 70wpm, which was enough for me to feel comfortable using it for almost everything.
My current layout isn't much different, and we'll walk through that in depth at the end.

<div id="audio_book_paragraph_972.5"></div>

The biggest problem I had wasn't with the keyboard at all.
It was the mouse.
Every time I wanted to use the mouse, I had to take my hand off the keyboard and move it over to the mouse pad.
Alternatively, I *could* use my keyboard as the mouse, but that wasn't precise enough.
I could turn down the sensitivity, but then it wasn't fast enough to navigate across my monitors.

<div id="audio_book_paragraph_993.5"></div>

Instead, I picked the secret third option.
I bought a [trackball mouse](https://www.amazon.co.uk/gp/product/B002Q42S4E/) and used it as a wrist rest.

<div id="audio_book_paragraph_1001"></div>

![I run towards the trackball mouse]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/trackball.png "It's beautiful")

## Going too far

<div id="audio_book_paragraph_1005.5"></div>

It's become a theme at this point that I impulse-buy computer peripherals without thinking of the issues.
Let's walk through some of the issues I had with my purchase.

<div id="audio_book_paragraph_1016.5"></div>

The first issue was the size of the mouse.
It was just too wide, and it wouldn't sit close enough to the keyboard.
That meant I was using my wrist rather than the palm of my hand.
It was uncomfortable, awkward, and hard to use.
The solution? 
Get a screwdriver and take the cover off!

<div id="audio_book_paragraph_1034.5"></div>

Great!
Now it fits under the keyboard and is nicer to use.
New issue - the trackball is all wobbly without the cover to reinforce it.
The solution?
Get a hacksaw, cut the cover up, screw it back into place.

<div id="audio_book_paragraph_1044"></div>

![An actual photo of my trackball mouse with a badly sawn-off cover]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/cut-trackball.jpg "Just as it was intended to be used")

<div id="audio_book_paragraph_1049"></div>

Fantastic.
Now it's more stable and I don't worry about breaking it when resting my hand there.
One issue though - it'd really be a lot nicer if I could place the mouse sideways.
That way, it would fit on my desk better and have the same sideways tilt as the keyboard.
I did that, but it's quite hard to use a sideways mouse.
No worries, we're on Linux!
Open the terminal, do a quick little `xinput --set-prop "Primax Kensington Eagle Trackball" 745 270` and boom!
It's configured with a 270-degree rotation.

<div id="audio_book_paragraph_1091.5"></div>

Surely there are no more issues now?
Well, it turns out that resting your hand on a mouse while typing isn't very helpful.
The mouse keeps moving and changing which window is focussed.
No worries, we can fix that!
Find an unused key combination, like `Alt + Win + Escape`, and add that to your keyboard layout.
Listen for it in i3 (my window manager) and toggle the mouse off/on whenever it's pressed.
Now I can turn the mouse on whenever I need it and turn it off afterwards.

<div id="audio_book_paragraph_1119.5"></div>

![Man looks shocked when mouse gets disabled]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/disable.png "Waauughhh... Impossible!!!")

<div id="audio_book_paragraph_1130"></div>

But I don't like having to toggle the mouse on and off.
I already have a layer dedicated to navigation - can't the mouse just turn on whenever we're in that layer?
I searched every bit of Oryx, and there was no option for anything like that.
Defeated, I just accepted there was no way to do it.
I would just have to live with it like this forever.
I accepted that, and I could move on.

<div id="audio_book_paragraph_1153.5"></div>

The next day, I got fed up with accepting that, and reverted to [grief stage 3](https://en.wikipedia.org/wiki/Five_stages_of_grief): bargaining.
There had to be another way.
I took the step that I'd avoided for months and clicked `Download Source`.
You see, the Ergodox is based on [QMK](https://qmk.fm/), an open-source keyboard firmware.
Oryx is really just a wrapper around that, generating and compiling layouts for you.
By avoiding the big shiny `Download Layout` button and clicking the scary one under that instead, you get the generated source code.

<div id="audio_book_paragraph_1185.5"></div>

A short while later, I had a working development environment and flashed my keyboard manually for the first time.
I had unlocked the true power of my keyboard!
Armed with my *limited* knowledge of C, I stumbled through the process of customising my keyboard layout.
I added a tiny bit of code into the `layer_state_set_user` function, which is called each time the layer changes.
One *if* statement later, my keyboard would press the (unused) calculator button when it entered layer 3, and the home button when it left.
In the i3 config, I listened for those keyboard events and turned the trackball on/off.

<div id="audio_book_paragraph_1221.5"></div>

![Ricky meme, my mother is shouting STEVEN, while I hold two keyboards and say It's too late mother]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/toolate.png "We are not a cult... Join us")

<div id="audio_book_paragraph_1229"></div>

It was beautiful.
No more toggle button - just go into the nav layer and the mouse starts working like magic.
I was finally happy.
Then I tried to use a web browser.

<div id="audio_book_paragraph_1240.5"></div>

I was typing in a URL, and the browser autocompleted the end of it.
I wanted to add something to the end of the URL, so went into the nav layer and tried to use the arrow keys.
However, as soon as I went into the layer, the autocompleted text disappeared.

<div id="audio_book_paragraph_1255.5"></div>

It turns out this is a limitation with [X11](https://en.wikipedia.org/wiki/X_Window_System), the windowing system at the core of most Linux desktops.
Any time you listen for a key and react to it, X11 sends a `FocusOut` event, then runs the code, then sends a `FocusIn` event.
That happens [no matter what key you use](https://stackoverflow.com/questions/26489193/how-to-prevent-window-from-loosing-focus-when-receiving-a-grabbed-key-from-x11) - even media keys.
In web browsers, that breaks autocomplete.
In a lot of other software, it causes unfocus and focus animations to play.
I rely a lot on autocomplete, so that wasn't gonna fly.

<div id="audio_book_paragraph_1286.5"></div>

I did what anyone else would do in my position.
I wrote a driver.

<div id="audio_book_paragraph_1291.5"></div>

Well, kinda.
One of the features of QMK is the [raw HID mode](https://docs.qmk.fm/#/feature_rawhid).
This lets you perform two-way communication between the keyboard and host, bypassing the drivers completely and only working with the raw bytes sent to and from the device.

<div id="audio_book_paragraph_1307.5"></div>

I set up the Ergodox to broadcast on two interfaces, and listened to the second one with [Python's hidapi](https://pypi.org/project/hidapi/).
On the keyboard side, I replaced my previous layer-based key presses with this:

<div id="audio_book_paragraph_1321"></div>

~~~C
uint8_t msg[RAW_EPSIZE];
sprintf((char *)msg, "LAYER:%u", layer);
raw_hid_send(msg, RAW_EPSIZE);
~~~

Then, on the host side, I wrote:

<div id="audio_book_paragraph_1328"></div>

~~~python
while True:
  msg = h.read(8).decode()
  
  if msg.startswith("LAYER:"):
    layer = int(msg[6])
    if layer == 3:
      os.system("xinput --set-prop \"Primax Kensington Eagle Trackball\" 276 0 0")
    else:
      os.system("xinput --set-prop \"Primax Kensington Eagle Trackball\" 276 1 0")
~~~

<div id="audio_book_paragraph_1336"></div>

There are no issues with windows unfocussing now!
In fact, there's not even any key commands being sent.
I made the script run on startup, and the mouse works reliably!

<div id="audio_book_paragraph_1346"></div>

That's the end of the whole trackball saga.
There are a few other things I want to talk about, but let's walk through my final setup and discuss those as they come up.

## My Current Setup

<div id="audio_book_paragraph_1356.5"></div>

That brings us to today, and my [current keyboard layout](https://configure.ergodox-ez.com/ergodox-ez/layouts/5BvvY/ZKx5z/3).
This section is an in-depth discussion of how it all works.
If you're just here for the story, this button will skip to the conclusion:

<div id="audio_book_paragraph_1368"></div>

<a onclick="skip()" style=""><b>Skip to Conclusion</b></a>

<div id="audio_book_paragraph_1381"></div>

By default, it looks like this:

<div id="audio_book_paragraph_1384"></div>

![Layer 0 of my keyboard layout]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/layer0.png "I love it like it's my child - in that it annoys everyone else")

<div id="audio_book_paragraph_1387"></div>

Other than the weird 8×4 lettering system, there are a few other things to note.
Escape has been moved to the Caps Lock key, because who actually uses that?
The Escape button is now used for a macro that opens a new terminal.
My most common punctuation is in the middle columns and above my little fingers, where most other layouts have letters.
I have two space bars, two backspaces, and two delete keys, all designed to be used with my thumbs.
Also in the thumb clusters, I've got dynamic macro recording and the media keys.

<div id="audio_book_paragraph_1420.5"></div>

The media keys are interesting because they didn't work at first.
Something about my setup in Linux wasn't forwarding them properly to Spotify.
Thankfully, I could configure i3 to work around the issue by manually listening for the keys and notifying Spotify:

<div id="audio_book_paragraph_1435.5"></div>

~~~
bindsym XF86AudioPlay exec "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause"
bindsym XF86AudioStop exec "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Stop"
bindsym XF86AudioPrev exec "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Previous"
bindsym XF86AudioNext exec "dbus-send --print-reply --dest=org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Next"
~~~

### Layer 1: Shift

<div id="audio_book_paragraph_1440.5"></div>

By pressing either Shift key we move into layer 1, which contains the alternate variant of each key.
In most cases, that's just the shifted version of the key from the default layer.

<div id="audio_book_paragraph_1450"></div>

![Layer 1 of my keyboard layout]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/layer1.png "This seemed like a good idea at the time")

<div id="audio_book_paragraph_1457"></div>

That's not always the case though.
Sometimes, I decided to ignore common sense and bind a completely different key.
For example, the default layer contains `[`.
On a normal keyboard, pressing that while holding shift gives you `{`.
I don't like that, so instead layer 0 contains all the open brackets and you get the closed version by holding shift.
In other words, `Shift + [` gives you `]`.

<div id="audio_book_paragraph_1485.5"></div>

That goes for a lot of other keys too.
Forward slash is on the default layer, hold shift and you get a backslash.
The dollar (`$`) sign becomes a pound sign (`£`), and apostrophes (`'`) become speech marks (`"`).
Rather than working from a normal keyboard, I worked from first principles, thinking about which keys are related semantically.

<div id="audio_book_paragraph_1505.5"></div>

There's other interesting things on the shift layer, like the left side's bottom row.
There, we have `Cut`, `Copy`, `Paste`, and `Programs`.
The first three are just macros for `Ctrl + X/C/V`, while the last one launches i3's program menu, which is similar to the Windows key on that OS.
You press it, type the name of a program, press enter, and it starts up.

<div id="audio_book_paragraph_1528"></div>

My only problem with the Cut/Copy/Paste buttons is that the required shortcut changes constantly in Linux.
In an IDE, `Ctrl + C` will copy, but in a terminal it interrupts the running process.
A future improvement would be to send those events via raw HID, then handle the clipboard with shell commands from Python, allowing it to work anywhere.

<div id="audio_book_paragraph_1551.5"></div>

Finally, you can see that the Caps Lock key is now bound to Enter.
That allows me to press enter with just my left hand, for when I'm using my normal mouse and don't have my right hand on the keyboard.

<div id="audio_book_paragraph_1563.5"></div>

The only problem with this setup was that the Shift key didn't work as a Shift key.
Most of the time, programs don't listen for Shift directly.
Games and image editors were the exception.
I couldn't crouch or scroll horizontally!

<div id="audio_book_paragraph_1577"></div>

![A man doesn't crouch behind the cover in a game and gets shot, says oof]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/crouch.png "It's the keyboard's fault, honest.")

<div id="audio_book_paragraph_1581.5"></div>

For a while, I used a workaround where holding the Caps Lock key would act as Shift.
That really wasn't ideal though.
Once I had solved the trackball issues, I knew it was time to fix the Shift key once and for all.
I had a workaround, but wasn't there a better way to do it?

<div id="audio_book_paragraph_1598"></div>

In the end, I did get it to work.
First, I set up the keyboard so it sent a `Press Shift` event whenever we entered layer 1, and `Release Shift` whenever we left.
That meant our Shift key now worked as normal, but it also meant that everything on the shift layer was pressed with Shift.
For a lot of keys, like the alphabet, that wasn't an issue since the keyboard needed to hold Shift.
For some keys like `]`, pressing shift would break it.
In this case, it turns `]` into `}`.

<div id="audio_book_paragraph_1628.5"></div>

For each of those keys that would break, I defined a macro.
The macro sent `Release Shift`, then pressed the key, then sent `Press Shift`.
As hacky as that is, I've actually had no issues with it so far.

<div id="audio_book_paragraph_1641.5"></div>

That's it for layer 1, so let's move on to layer 2.

### Layer 2: Numbers

<div id="audio_book_paragraph_1645.5"></div>

This is the numbers layer, given that we booted them off the top row to make room for more letters.

![Layer 2 of my keyboard layout]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/layer2.png "This layer is one of those things that makes logical sense but melts my brain")

<div id="audio_book_paragraph_1654.5"></div>

Rather than go for a simple number pad layout, I used a layout similar to the letters on the first layer.
The home row contains the numbers `0123`, [which are the most common](https://en.wikipedia.org/wiki/Benford%27s_law).
The next row contains `4567`, and the top row contains `89` to be used by the index and middle fingers.
The numbers appear on both sides of the keyboard, always laid out with the smallest ones in the middle.
That means that the most common numbers are used by the strongest fingers.

<div id="audio_book_paragraph_1682.5"></div>

At one point, I had all the number-related symbols on this layer too, like `+`.
However, I wasn't really using them enough to commit it to muscle-memory.
Instead, I just go back to the default layer and enter the symbols that way.
It doesn't really seem to slow me down, but I'm still working on being fast with the number keys.
Later down the line it might become an issue, and we can revisit it then.

### Layer 3: Navigation

<div id="audio_book_paragraph_1703.5"></div>

Layer 3 is entirely built around navigation - whether that means moving the text cursor or the mouse.
You get there by pressing the button next to space in the thumb cluster - giving it pride of place.

<div id="audio_book_paragraph_1718.5"></div>

![Layer 3 of my keyboard layout]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/layer3.png "This is my favourite layer because nobody expects a mouse built into my keyboard")

<div id="audio_book_paragraph_1724"></div>

First of all, being in layer 3 enables the trackball.
I have the sensitivity set fairly low, which lets me move the mouse roughly half a screen using just the palm of my hand.
If I want to make bigger mouse movements, I use the mouse keys on the right half of the layer.
The sensitivity here is quite high, meaning it's useless for precise mouse movements but perfect for getting close enough.
Once I'm close, I can use the trackball to position the mouse precisely.

<div id="audio_book_paragraph_1750"></div>

The right half of the keyboard also contains keys for scrolling, both vertically and horizontally.
Both thumb clusters contain left click, right click, and middle click.

<div id="audio_book_paragraph_1761"></div>

The left side of the layer is dedicated to navigating text.
It may seem weird that I have to use both hands to move the mouse, and that I didn't just put the mouse keys on the left half.
The problem with that is the trackball.

<div id="audio_book_paragraph_1773"></div>

Whenever we're in this layer, the trackball is enabled.
With the mouse keys on the left half, I have to move my hand to press the keys which causes the mouse to move around.
The way it's set up now, I can press the mouse keys without moving my left hand.
I can focus completely on the trackball, rather than trying to press the keys without moving too much.

<div id="audio_book_paragraph_1793"></div>

The keys on the left side of the layout are fairly straightforward.
We have the arrow keys, Home, and End.
Home is placed under the left arrow, and End is under the right arrow.
At some point I'll probably add PageDown under the down arrow, but I've recently moved the Home key from there and I keep pressing it by mistake.

### Layer 4: Spaces

<div id="audio_book_paragraph_1811"></div>

This layer is dedicated to i3, and moving windows around.
It's bound to the button above layer 3, in the middle of the centermost columns.

![Layer 4 of my keyboard layout]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/layer4.png "I don't *like* this layer, but that's because I never notice it. That probably means it's the best one.")

<div id="audio_book_paragraph_1823"></div>

Pressing any letter brings that workspace into focus, and holding shift moves the currently selected window to that workspace.
The right side of the keyboard has some arrow keys, which are used for moving focus or windows relatively.
For example, the left arrow selects the window to the left of the currently selected window.
If holding shift, it moves the window to the left instead.

<div id="audio_book_paragraph_1847.5"></div>

The middle columns are used to swap between different window layouts.
The space key toggles full-screen on the currently selected window, while the backspace key closes it.

### Layer 5: Function

<div id="audio_book_paragraph_1856.5"></div>

This layer contains the function keys, using the same layout as the number layer.
It's a bit hard to reach the layer 5 key, which sits at the top of the center column, but it's rarely used.

<div id="audio_book_paragraph_1870.5"></div>

![Layer 5 of my keyboard layout]({{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/layer5.png "F keys are endangered so I'm fostering two full litters")

<div id="audio_book_paragraph_1874"></div>

I'm still getting used to this, and honestly I usually revert to my old, standard-layout QWERTY keyboard to press the F keys.
We'll get there!

### Other Functionality

<div id="audio_book_paragraph_1882.5"></div>

All layer buttons are momentary - we stay in the layer as long as the key is held.
The exception to that is if you press the Escape key (as in, the one in the top left) while holding the layer button.
This locks you in the current layer.
To get out, press the Escape key again.

<div id="audio_book_paragraph_1904.5"></div>

There's also the debug layer, which is accessed through the right thumb cluster.
By pressing that key and the mirrored one on the left side, you put the keyboard into its bootloader, allowing new firmware to be flashed.
That's a godsend - because I can never find a paper clip to press the reset button!

<div id="audio_book_paragraph_1920.5"></div>

You can see the current revision of my keyboard firmware [on GitHub](https://github.com/stevenwaterman/keyboard).

## Conclusion

<div id="audio_book_paragraph_1924"></div>

Over the past few months, I have well and truly gone down the ergonomic keyboard rabbit hole.
There wasn't one big event that thrust me into this subculture.
It's been the culmination of me asking "couldn't this be better" for 3 months straight.

<div id="audio_book_paragraph_1941"></div>

I don't expect you to immediately run out and spend money on a split keyboard, or change your layout.
However, next time you're doing something and get annoyed at your keyboard, ask yourself if it could be better.
If you experience wrist pain when using your keyboard, ask yourself if it could be better.

<div id="audio_book_paragraph_1942"></div>

I've gone too far with my setup, but it's been fun.
And yes, I am getting worse at QWERTY.

---

<div id="audio_book_paragraph_1964.5"></div>

This has been a bit of a weird post, but I hope you enjoyed the ride!
Please do get in touch on [Twitter](https://twitter.com/SteWaterman) with any feedback, or to give suggestions about my setup!

<script src="{{ site.github.url }}/swaterman/assets/ergo-rabbit-hole/audioEvents.js"></script>