---
title: 'Finite State Machines: The Developer''s Bug Spray'
date: 2020-12-08 00:00:00 Z
categories:
- Tech
tags:
- finite
- state
- machines
- bugs
author: mstobbs
layout: default_post
image: mstobbs/assets/reducing-bugs-with-finite-state-machines/BugPacman.png
summary: Everyone hates bugs. Unfortunately, as codebases grow, it's easy for bugs
  to spread out of control. Fortunately, they can be brought back under control using
  psychology and a mathematical model from the 1950s.
---

Bugs suck.

I recently fixed a bug by adding two characters. But finding the source of the bug, creating a fix, finding the necessary approvals, and merging the fix took the entire day. Just to add two characters.

According to a [Cambridge University study](http://www.prweb.com/releases/2013/1/prweb10298185.htm), the average developer spends 50% of their time finding and fixing bugs.

Bugs suck. However, they are also [inevitable](https://xkcd.com/2030/).

Unfortunately, the amount of time spent battling bugs increases as the codebase grows, but not always at a linear rate. [Dan Abramov](https://twitter.com/dan_abramov) introduced a metric to think about this called "[Bug-O](https://overreacted.io/the-bug-o-notation/)" notation:

> The Big-O describes how much an algorithm slows down as the inputs grow. The _Bug-O_ describes how much an API slows _you_ down as your codebase grows.

Large, complex codebases are the perfect culture for one bug in particular: invalid-state bugs. These are easy to introduce and difficult to detect before it's too late. Fortunately, they can also be tamed by a tool that has been around for over half a century.

## Finite State Machines

A [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine) is a mathematical model where an automaton (or in our case, an application) can exist in one of a finite number of states. For example, in the game of Pacman, the ghosts can exist in one of three states: chase, frightened, or dead.

<div style="display: flex; flex-wrap: wrap; justify-content: center;">
  <img style="flex: 0 1 150px; max-width: 200px; margin: 0 0.5rem;" src="{{ site.baseurl }}/mstobbs/assets/reducing-bugs-with-finite-state-machines/pacman-ghost-chase.png" alt="A Pacman ghost chasing Pacman" title="A Pacman ghost chasing Pacman">
  <img style="flex: 0 1 150px; max-width: 200px; margin: 0 0.5rem;" src="{{ site.baseurl }}/mstobbs/assets/reducing-bugs-with-finite-state-machines/pacman-ghost-frightened.png" alt="A frightened Pacman ghost being chased by Pacman" title="A frightened Pacman ghost being chased by Pacman">
  <img style="flex: 0 1 150px; max-width: 200px; margin: 0 0.5rem;" src="{{ site.baseurl }}/mstobbs/assets/reducing-bugs-with-finite-state-machines/pacman-ghost-dead.png" alt="A dead Pacman ghost" title="A dead Pacman ghost">
</div>

The application always starts at some initial state, and transitions from state to state based on events. So the ghosts always start by chasing Pacman, until Pacman eats an [Energizer](https://pacman.fandom.com/wiki/Power_Pellet), which causes them to transition to the frightened state.

<img src="{{ site.baseurl }}/mstobbs/assets/reducing-bugs-with-finite-state-machines/pacman-ghost-transition.jpg" alt="A Pacman ghost transitions to be frightened after Pacman eats an energizer" title="A Pacman ghost transitions to be frightened after Pacman eats an energizer">

Every application is a state machine. If we don't think so, that usually means the rules determining what valid states are and how those states transition between each other is not explicitly defined.

## Implicit Finite State Machines

David Khourshid [explains the dangers of implicit finite state machines](https://medium.com/@DavidKPiano/the-facetime-bug-and-the-dangers-of-implicit-state-machines-a5f0f61bdaa2):

> "Implicit state machines are dangerous because, since the application logic implied by the state machine is scattered around the code base, _it only exists in the developers’ heads_, and they’re not very well-specified. Nobody can quickly reference what states the application can be in, nor how the states can transition due to events, nor what happens when events occur in certain states, because that crucial information is just not readily available without studying and untangling the code in which it exists."

In other words, as the codebase grows, as new developers join, and as the overall complexity increases, it becomes harder for anyone to understand what are valid states and transitions. It also becomes more difficult to guard against _invalid_ states and transitions.

Looking back at our Pacman example, a naive approach may be to control our Pacman's state based on two booleans - `isAlive` and `isFrightened`. Let's see how this would map to our states:

<table>
  <tbody>
    <tr>
      <td>&nbsp;</td>
      <td align="center"><code class="language-plaintext highlighter-rouge">isAlive</code></td>
      <td align="center"><code class="language-plaintext highlighter-rouge">!isAlive</code></td>
    </tr>
    <tr>
      <td align="center"><code class="language-plaintext highlighter-rouge">isFrightened</code></td>
      <td><img src="{{ site.baseurl }}/mstobbs/assets/reducing-bugs-with-finite-state-machines/pacman-ghost-frightened.png" alt="A frightened Pacman ghost being chased by Pacman" title="A frightened Pacman ghost being chased by Pacman"></td>
      <td align="center">⚠ Invalid state</td>
    </tr>
    <tr>
      <td align="center"><code class="language-plaintext highlighter-rouge">!isFrightened</code></td>
      <td><img src="{{ site.baseurl }}/mstobbs/assets/reducing-bugs-with-finite-state-machines/pacman-ghost-chase.png" alt="A Pacman ghost chasing Pacman" title="A Pacman ghost chasing Pacman"></td>
      <td><img src="{{ site.baseurl }}/mstobbs/assets/reducing-bugs-with-finite-state-machines/pacman-ghost-dead.png" alt="A dead Pacman ghost" title="A dead Pacman ghost"></td>
    </tr>
  </tbody>
</table>

Uh oh. Instead of three possible states, a fourth one has appeared. This kind of problem can easily slip into your code and be very difficult to spot. This would be handled differently by our application depending on which boolean we happen to check for first, which may not be the [expected result](https://kentcdodds.com/blog/stop-using-isloading-booleans).

To show this, let's use an example of the code we might use to render the ghost:

~~~js
renderGhost(isAlive, isFrightened) {
  if (isFrightened) {
    renderFrightenedGhost();
  }
  else if (isAlive) {
    renderChaseGhost();
  }
  else {
    renderDeadGhost();
  }
}
~~~

Let's imagine two possible scenarios:

1. The ghost is frightened and fleeing for its "life" but it's no use - Pacman catches him and "kills" him. This causes `isAlive` to toggle to `false`. However, because we have forgotten to also toggle `isFrightened` to `false`, our ghost somehow survives and remains frightened (until, presumably, the frightened timer ends and the ghost dies for no apparent reason).

2. The ghost is dead and returning to his ghost home to be revived. Pacman picks up an energizer, causing `isFrightened` to toggle to `true`. According to our code, this would have the effect of magically bringing our ghost back from the dead as a frightened ghost.

In both of these situations, we would expect the ghost to be in the "Dead" state, but instead it's in the "Frightened" state. This is because our code happens to check the `isFrightened` flag first. There's nothing explicitly tying the `isFrightened` and `isAlive` flags together, so it is easy for events that should toggle both flags to only toggle one.

Perhaps more dangerous, if the transition between these states is not explicitly defined, unexpected interactions between states and events can occur. Invalid transitions between states can become possible. This is likely what caused [the FaceTime bug](https://medium.com/@DavidKPiano/the-facetime-bug-and-the-dangers-of-implicit-state-machines-a5f0f61bdaa2), which allowed users to video call someone and listen to the person at the other end _before they had accepted the call_. As the codebase size grows, testing all possible edge cases becomes increasingly impractical.

What does this look like in terms of Bug-O? Our current model contains three states, and four events.

<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
  <div>
    <p><strong>States</strong></p>
    <ul>
      <li>Chase</li>
      <li>Frightened</li>
      <li>Dead</li>
    </ul>
  </div>

  <div>
    <p><strong>Events</strong></p>
    <ul>
      <li>Pacman eats energizer</li>
      <li>Frightened timer ends</li>
      <li>Ghost hits Pacman</li>
      <li>Ghost returns home</li>
    </ul>
  </div>
</div>

With an implicit finite state machine, any event could interact with our app in any state. This gives us 3 x 4 = 12 possible interactions to consider. This number will grow polynomially as the number of states and events grow.

## We Are Not Smart Enough For Complexity

The problem, then, is not the software, but our biological hardware. Have you ever been shown a bug and thought, "Ah, how did I not think about that edge case?"

If anyone could understand how humans think, it was [Herbert Simon](https://en.wikipedia.org/wiki/Herbert_A._Simon). Winner of the 1978 Nobel Prize in economics, he studied many subjects, including organizational behaviour, business administration, economics, cognitive psychology and artificial intelligence.

Simon argued that human rationality is "[bounded](https://en.wikipedia.org/wiki/Bounded_rationality)". The world is too complex and uncertain for our minds to fully process.

Luckily, evolution created a solution. _We deliberately restrict our choices to reduce the complexity of the problems we face._

<p>For example, if you were playing a “hyper-rational” being at chess, they would be able to visualise all the possible moves and calculate the likelihood that you would make each move. But, Simon shows, there are around 10<sup>120</sup> possibilities in an average game of chess, so this approach would be impossible for mere mortals.</p>

Instead, chess masters use rules of thumb (heuristics) to focus on a smaller number of possible moves. This reduces the number of scenarios that need to be analysed, even if the "optimal" move maybe have been excluded.

Similarly, programmers are not hyper-rational computers (as much as we like to [think we are](https://twitter.com/cassidoo/status/1216871876192088065)). We aren't able to store every possible interaction of a non-trivial app in our mind, nor should we have to. The blind spots of our understanding are where invalid state bugs can slip in undetected. Therefore, the solution is to place restrictions in our code using explicit rules, to reduce the complexity we face.

## Explicit Finite State Machines

We'll define valid states, events, and the interactions between them. To make this easier, we can draw a [state diagram](https://en.wikipedia.org/wiki/State_diagram) to visualise the allowed behaviour.

<img src="{{ site.baseurl }}/mstobbs/assets/reducing-bugs-with-finite-state-machines/simple-ghost-FSM.png" alt="A finite state machine showing the states and transitions of Pacman ghosts" title="A finite state machine showing the states and transitions of Pacman ghosts">

Using this chart, we can see the behaviour of the app depends on two things: the current state and the event. Our state machine logic would take the current state and the event, and return the new state.

~~~js
function ghostLogic(state, event) {
  switch (state) {
    case 'chase':
      return handleChaseStateLogic(event);
    case 'frightened':
      return handleFrightenedStateLogic(event);
    case 'dead':
      return handleDeadStateLogic(event);
    default:
      // Should never reach this point - each
      // possible state should have been defined
      return state;
  }
}

function handleChaseStateLogic(event) {
  switch (event.type) {
    case 'ENERGIZER':
      return 'frightened';
    default:
      return state;
  }
}

function handleFrightenedStateLogic(event) {
  switch (event.type) {
    case 'HIT_PACMAN':
      return 'dead';
    case 'FRIGHTENED-END':
      return 'chase';
    default:
      return state;
  }
}

function handleDeadStateLogic(event) {
  switch (event.type) {
    case 'HOME':
      return 'chase';
    default:
      return state;
  }
}
~~~

For each state, we define which events will cause the state to update, and what the new state will be. If an event occurs and the state hasn't defined a valid transition, then the logic ensures no change will occur.

This prevents any invalid states from occurring. We no longer need to consider what would happen if `isAlive` is false and `isMoving` is true because only explicitly defined states can exist.

If a new event is added, we don't need to worry about how that event will interact with each of our existing states. They will ignore the new event unless we explicitly tell it otherwise. Therefore, the Bug-O growth becomes linear, instead of the polynomial growth we saw previously.

## Conclusion

The idea of using explicit state machines in your application has existed for over half a century and has been essential to the success of several industries. They can be used to control the high-level state of the entire application or the lower-level details in specific components.

Using explicit state machines won't remove all your bugs. Attempting to access properties before checking something is `null` will still catch you out (or is that just me?). But they can help you keep the number of bugs from growing out of control and slowing you down as the codebase grows.
