---
author: garora
title: There's console.more where that came from! Make greater use of console in JS
categories:
  - Tech
layout: default_post
summary: The function console.log is a JS developer's best friend. In this post
  I explore the console API in greater detail to help you in your next big
  project, or help you mess around.
category: Tech
---

Modern browsers give us conditional breakpoints, the ability to step back in pure functions and a whole lot more. We used `console.log`! However, the `console` API offers a lot more. Let's find out what that "more" is.

## General tips
Before I dive into extra functionality, here are some tips to help with using `console.log` more efficiently. When I first started using JavaScript, I would often do this.


~~~js
console.log("name",  name);
console.log("number", number);
~~~


However, ES6 allows us to use this shorthand.


~~~js
console.log({ name, number }); // {name: "John Smith", number: 07700900461}
~~~


 Another common issue with `console.log` (and other functions mentioned below) is that often logging an object doesn't work as expected, because the object value changes and the console will display the latest value rather than the one at the time of logging. ES6 makes it easy to copy the object.


~~~js
console.log({...object});
~~~


## 1. trace
Sometimes you need to know how/why the code reached a specific point. For this just call `console.trace` which will print out the "stack trace", which is a list of functions that are currently running.[^1]


~~~js
const jumpToTheLeft = () => console.trace("TimeWarp!"); 
const stepToTheRight = () => jumpToTheLeft();
const handsOnYourHips = () => stepToTheRight();
const bringYourKneesInTight = () => handsOnYourHips();
const pelvicThrust = () => bringYourKneesInTight();
const drivesYouInsane = () => pelvicThrust();

drivesYouInsane();
~~~


![Output of console.trace]({{site.baseurl}}/garora/assets/2020-07-03/timeWarpStackOutput.png)

## 2. count
Call `console.count` to have it log a counter. You can also give the counter a name, allowing you to track multiple counters simultaneously. Call `console.countReset` to (can you guess what it does?) reset a counter.

~~~js
console.count(); // default: 1
console.count(); // default: 2
console.count("discworld"); // discworld: 1
console.count("discworld"); // discworld: 2
console.countReset();
console.count(); // default: 1
~~~

## 3. warn and error
You have probably seen warnings and errors in the console before. You can also create them yourself.


~~~js
console.warn("This is a warning");
console.error("This is an error");
~~~


![Output of console.warnError]({{site.baseurl}}/garora/assets/2020-07-03/warnErrorOutput.png)

## 4. assert
Use `console.assert` when you want to log something conditionally. The function will log the second parameter as an error if the first evaluates to `false`.


~~~js
console.assert(42 === 0, "This will log an error");
console.assert(42 === 42, "This will log nothing");
~~~


## 5. clear
Sometimes the console becomes cluttered, when this happens, call `console.clear` to remove everything sent to the console up until that point. I found this to be useful when my chrome extensions started cluttering the console.

## 6. table
Tables are great for displaying data. Pass in an object or an array for a delightful display.


![Output of console.table]({{site.baseurl}}/garora/assets/2020-07-03/table.gif)

## 7. styling
That's right styling! You can apply CSS to your logging. Do this by calling `console.log("%c message", "totally real CSS")`. The `"%c"` tells the console to apply the CSS in the second argument. Styling is available in a lot of the other functions too, depending on the browser.


~~~js
console.log("%cJavaScript Is King", "font-size: 80px;color: white; text-shadow: 2px 2px 2px \
             indigo, 4px 4px 2px blue, 6px 6px 2px green,  8px 8px 2px yellow, 8px 8px 2px \
             orange, 10px 10px 2px red; background-color: black; padding-bottom: 20px; \
            padding-right:20px");
~~~


![Output of console.table]({{site.baseurl}}/garora/assets/2020-07-03/styling.png)

## 8. group
For even more organisation, group some logs together. Calling `console.group` starts a collapsible group. The group subsequent `console` calls to itself. And `console.groupEnd` ends the most recent group. Contents of a group are indented and collapsible. You can force the group to start collapsed by calling `console.groupCollapsed`. Groups can also be nested.

~~~js
console.group("Normal group");

console.group("Set 1");
console.log("So long and");
console.log("thanks for all the fish");
console.groupEnd()
console.group("Set 2");
console.log("Wibbly wobbly");
console.log("timey wimey");
console.groupEnd()

console.groupEnd()

console.groupCollapsed("Collapsed group");
console.log("1.21 Jigowatts")
console.groupEnd()
~~~


![Output of console.group]({{site.baseurl}}/garora/assets/2020-07-03/groups.gif)


## 9. dir and dirxml

If you deal with XML (e.g. HTML or SVG) elements directly, you might find this useful. When you use `console.log(XMLelement)`, it logs them in XML format, which looks like this.


![Output of XML by console.log]({{site.baseurl}}/garora/assets/2020-07-03/log-XML.png)


This format mostly is what people want. But if you need to check what properties there are, you should call `console.dir(XMLelement)`, which will log it like a standard object. 


![Output of XML by console.dir]({{site.baseurl}}/garora/assets/2020-07-03/dir-XML.png)


There is also `console.dirXML`. Its purpose is to choose the XML formatting over the object formatting, but I couldn't find a case where this wouldn't be the same as `console.log`.

## 10. time
Call `console.time` to start a timer. When you want to log how much time has passed call `console.timeLog`. Calling `console.timeEnd` will end the timer and log the final value. Similar to `count`, `time` can take a name so you can have multiple timers.


~~~js
console.time();
console.timeLog(); // default: 0.00390625ms
console.time("Good Timer Name");
setTimeout(console.timeEnd, 2000); // default: 2001.047021484375ms
console.timeEnd("Good Timer Name"); // Good Timer Name: 0.0380859375ms
~~~


Unfortunately, Firefox limits the number of timers to 10000, so if you are building something that needs more than that, stay away from it.[^2]

## Bonus content
There are a few features that vary more across browsers, in some cases because they are new to the API.

There is string substitution which allows you to do things like `console.log("%s world!", "Hello")` which would log "Hello world". This feature also has some formatting options for numbers, but that doesn't work in all browsers.

You can also interface with built-in profilers with `console.profile`, and with the Timeline or Waterfall tools with `console.timeStamp`. These tools are for performance monitoring. Unfortunately, the functions don't yet have a standardised API.

As you probably know, you can filter errors and warnings in your console. You can also use the functions `console.debug` and `console.info`, which work like `console.log` but can be filtered separately (specifics depending on the browser). Some browsers also add additional styling to them.

## To conclude
It's easy to stick to what you know, but it's fun to not. I enjoyed messing around with these additional features, and I hope you have taken something useful from this too. In all honesty, I won't use a lot of these functions, but it's good to know they are there. It's also good to mess around sometimes.

![Thanks for reading animation]({{site.baseurl}}/garora/assets/2020-07-03/thanksForReading.gif)
 
[^1]: At the time of writing this blog, Edge did not output the data passed to it, only a stack trace.  
[^2]: If you find a non-trivial reason to need to break this limit, please enlighten me.  

