---
title: Building an Assignment Algorithm - Episode 3 / 3
date: 2024-11-05 9:30:00 Z
categories:
- Tech
tags:
- Algorithms
summary: The final installment of the assignment algorithm series! This episode covers the last piece of the puzzle - slot sorting, as well as wrapping up all that has been discussed in the previous 2 episodes. 
author: jwarren
---

<style> 
    summary {
        font-weight: 300;
        display: block;
        font-style: normal;
        cursor: pointer;
    }
    summary::after {
        content: '[+more]';
        text-decoration: underline;
        text-decoration-style: dotted;
        padding-left: 0.5em;
        font-size: 0.8em;
    }
    details[open] > summary::after {
        content: ' [−less]';
    }
    details[open]::before {
        content: '';
        display: block;
        border-top: 1px solid #ccc;
        margin-top: 1em;
    }
    details[open]::after {
        content: '';
        display: block;
        border-top: 1px solid #ccc;
        margin-top: 1em;
        margin-bottom: 1em;
    }
        details {
        font-style: italic;
    }
</style>

The third and final post of the series, well done for making it this far! We will look at the last piece of the puzzle - slot sorting, which can make a substantial difference to the outcome of our algorithm. Then we will wrap up - looking at how all the elements of the algorithm discussed in this series come together. You can find the [first episode here]({{site.baseurl}}/2024/10/24/building-an-assignment-algorithm-1.html), and the [second episode here]({{site.baseurl}}/2024/11/04/building-an-assignment-algorithm-2.html). 

In the first two episodes in this series, we looked at the mechanics of how we assigned talks to attendees algorithmically for a conference. This involved: 

1. Sorting by surplus difference: Looking ahead, seeing what talks are more popular and thereafter ordering attendees accordingly. Calculating who would need to compromise (if at all) on their first choice for an optimal result.
2. Sorting by aggregate compromise: Examining how attendees compromise over multiple time slots. Sorting the attendees in a way that avoids an individual(s) being the sacrificial lamb and taking the burden of all the compromise.
3. The interplay between these two sorting methods: How surplus difference and aggregate compromise must be combined and run simultaneously, for the algorithm to give an optimal result.

<br>

## Slot Sorting

We assign talks one time slot at a time. However, what time slot should we start with? Would the order even make a difference?  

Since we do assign talks according to compromise, any mass accumulation of compromise in one slot will be evened out in the subsequent slot(s). However, if there is a mass accumulation of compromise in the last slot (that assignments are made in), then there won’t be any scope for this to be evened-out. Therefore, we decided that we wanted to make all the difficult decisions, high in compromise, earlier on in the process. Meaning that there would be space for compromise to be evened out amongst the attendees, after having run the process through the rest of the slots. That is to say, the slots with the least even-spread of surplus difference should go first.  

For example, imagine everyone had the exact same preferences in the last slot (unevenly distributed preferences), with talks having a capacity constraint. Furthermore, let’s say the compromise levels are all equal because the algorithm has managed to be very fair up to this final slot. Everyone having the same preferences would lead to a few people getting 3rd choices. So, the end result of the algorithm is unfortunately unfair for some individuals, because there’s a lack of slots left to compensate any compromise.  

Alternatively, let’s say we order the slots from an uneven spread of surplus difference to an even spread. Beginning with a slot of unevenly distributed surplus difference, everyone has the same talk preferences (as we finished with in the previous example). People in this slot would still get their third choices, but this time there are many slots for these attendees to get priority. Those who got their 3rd choice before, would be more likely to get first choices for the rest of the algorithmic process. Now for the last slot, there is an even spread of surplus difference, let’s say everyone’s first choice is for separate talks and they all receive their first choice. Since this algorithm has run over multiple slots already, we can assume the spread of compromise between the attendees is also very even. Since everyone gets their first choice, there is no compromise, the spread of compromise remains even and everyone is happy.  

<details><summary>Click here for a more precise definition of spread.</summary>

<br>
<h4>
The spread score:
</h4>
<p>
Spread is a measure given to a slot of how oversubscribed the talks that it contains are. For example, if a slot has many oversubscribed talks, it has an uneven spread and a high “spread score”. If there are no oversubscribed talks, there is an even spread.
</p>

<p>
The spread score is measured before any assignments are made. The process is as follows...

<ol>
    <li>Each talk is given a “popular score” based on a sum of what choices people have made for that talk, minus a value for the capacity of the talk venue. If a talk has a high “popular score”, it is oversubscribed.</li>
    <li>Order all the talks by the “popular score”, irrespective of slot to make a popularity list</li>
    <li>For each talk, according to its ranking in the ordered popularity list, you accrue a value to the slot it’s part of. This is the slot’s “spread score”. ie if a talk is 1st in the popularity list of a 10 talk conference, you would +10 to the spread score of the slot it is from, the last talk in the list (least popular talk) would +1 to the spread score of the slot it is from. </li>
</ol>

The higher up the popularity list, the more oversubscribed the talk, the higher the value given to its associated slot. That is to say, the more oversubscribed talks a slot has, the higher its spread score, the more uneven its spread. 
</p>

<h4>
The “popular score”,  is given as follows:
</h4>

<p>
For every 1st choice someone made for a talk, the talk is given +20 to their popular score (irrespective of whether everyone gets this first choice). +8 for every 2nd choice and +3 for every 3rd choice. So for every choice a talk gets (no matter whether it's assigned or not)...

- 1st choice: +20
- 2nd choice: +8 
- 3rd choice: +3

The value attached to the venue capacity which we minus from the sum of these choice values is the equivalent of the room capacity full of 1st choices. So if the capacity is 10 people, this would be the equivalent of 10 x 20 = 200.
</p>
</details>

<br>
The plot thickens if there are duplicate talks. Duplicate talks are the same talk given in different time slots - if for example, the talk is thought to be popular or important. Obviously, attendees shouldn’t attend the same talk twice, so care must be taken in not assigning the same talk twice. We won’t go into this in too much depth, but this does affect slot sorting. 

<details><summary>Click here to find out how.</summary>
<br>
<p>
Firstly, slots containing the most duplicate talks go first. Duplicate talks are put at the front so that the most forced choices happen at the beginning, meaning that the attendees’ aggregate compromise has time (/remaining slots to assign) to even out, in comparison to other attendees, by the end of the algorithm.  
</p>
<p>
Next, we sort by how spread-out choices are. Duplicate talk slots with an even spread of choices to go first. This way, users aren't assigned a bad set of choices because the good assignments are no longer possible. This would be due to the previously assigned slots, which were oversubscribed (and therefore compromise high). Whereas as we discussed earlier, we want non-duplicate talk slots with a small spread (ie as many oversubscribed talks as possible) to go first. This is so that again, we generate as much compromise at the beginning of the algorithm run as possible, which will then even out over all the delegates by the end. After trialling and testing this method, we found it led to optimal results. 
</p>
</details>

<br>
There is one more element to the algorithm that we haven’t introduced yet, which is needed before we bring everything together.  

## Undersubscribed Talk Assignments:

If there is an undersubscribed talk (there are less people than the talk's prescribed minimum attendees), then users are moved from other groups into this group. Users are chosen from other groups as follows… 

Pick an attendee with the undersubscribed talk as a 2nd choice, from the most oversubscribed talk possible. If no attendees have this undersubscribed talk as a second choice, the process begins again for attendees with this as a 3rd choice and so on. This process then repeats until the undersubscribed talk's prescribed minimum attendees has been reached. 

## Bringing it all together 

So how do all these elements of the algorithm come together as a single flow, the accumulation of everything shared in this blog series?  

Here is the list of steps to be taken for the algorithm:

1. Data (of attendee choices) is collected and formatted 
2. Slots are sorted 
3. For each slot, groups are made for every talk in that slot, and then attendees are initially put into groups based on their first choice 
4. Next, attendees are assigned talks
    <ol type="a">
        <li>Attendees are first of all sorted by comparing their personal compromise and personal surplus difference (ie how much they have already had to compromise, and what is the potential for compromising in the future if they don’t get the current choice talk). </li>
        <li>If a talk is undersubscribed, then attendees from other groups are moved into this group. </li>
        <li>Then attendees are added into groups until a group has reached max capacity. When this occurs, the remaining attendees are moved into different groups according to their next choice (as long as they have not already been assigned this talk in a previous slot). </li>
    </ol>
5. Slot compromise for each user is calculated and then added to their aggregate compromise 

Here is a flowchart of the process:

<div style="position: relative; width: 100%; height: 0; padding-top: 120.0000%;
 padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
 border-radius: 8px; will-change: transform;">
  <iframe title="Flowchart representing the entire algorithm" loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
    src="https://www.canva.com/design/DAGUMczeZ0g/zzjhOfeMNDN88TuDguYPyg/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
  </iframe>
</div>

(The first slide is the overview, then the subsequent slides describes each step from the overview). 

<br>

## Conclusion

In this post we looked at how we ordered slots, what to do with undersubscribed talk assignments and then how all the elements in these 3 posts mesh together into a unified whole. Thank you for sticking with me through this algorithm journey. It wasn’t light reading, and you’ve done well to make it to the end. I hope you have found some useful insights to take away and possibly even found a means to apply them to your own projects.  

Designing this app taught me much about algorithm design. It’s important to start with a high-level skeletal structure, and then with this structure, meat can be put on the bones for precision and clarity. I suppose this is true for planning most projects. The fact that surprised me the most was that some tiny details could have a significant effect on the output of an algorithm, such as how slot sorting was inverted depending on the presence of duplicate talks. I certainly enjoyed this challenge and look forward to the next opportunity to do something similar. 