---
title: 'React Suspense: Documenting the Undocumented'
date: 2023-08-15 13:18:00 Z
categories:
- UI
- jbickley-wallace
- Front End Development
tags:
- suspense
- react
- Javascript
summary: I have long anted to explore the much heralded Suspense features of react,
  but have been frustrated by the lack of documentation about making it actually happen.
  In this post I dig into an example to find out how it actually works, and how we
  can make use of it.
author: jbickley-wallace
---

For a while I've wanted to explore Suspense.
I read a react blog post way back in 2019 about
[building great UX with React Suspense](https://legacy.reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html).
I remember it giving me a real aha moment.
That difference between the waterfall approach to loading data and loading data as you render cycle sounded nothing short of miraculous.
The slow down that causes was something we'd experienced in the application I was working on at the time.
And I remember thinking about a banking app I use which put, I kid you not, 4 _different_ spinners up for ~200ms each while it loaded,
and the sense of mistrust that I felt when I experienced that.
I immediately started to build delays in to my loading spinners to reduce "flicker" and improve the feel of my applications,
and eagerly awaited the arrival of the Suspense API in production ready state.
It was experimental in react 16, The only thing it was actually supported for was `Lazy` components,
and I never like using experimental API's in production.

But that day never arrived, and there was a little note at the beginning of that post which always niggled...

> This post will be most relevant to people working on data fetching libraries for React.

I remember feeling slightly patronised by that.
Why can't I, as an application author, become master of my own destiny and make use of this powerful feature?
Was it too complex for mere mortals to comprehend?
I was put off and lost interest.

Years later the react team announced some
really [interesting](https://react.dev/blog/2022/03/29/react-v18#new-feature-transitions)
[features](https://react.dev/blog/2022/03/29/react-v18#new-suspense-features) in v18
(concurrent rendering - multiverse theory for react applications?).

But while Suspense is now "Stable" and "Production Ready" it is _still_ only recommended for use in
[data fetching frameworks](https://react.dev/blog/2022/03/29/react-v18#suspense-in-data-frameworks).
And the docs still don't describe how to make suspense work, only how to make use of it with things like `Suspense` and `useTransition`.

They talk about what happens when a component "Suspends" or "while a component is loading", but not how one actually does suspend.

Come on!

What the react authors don't know is that in the intervening years I have become a
[data fetching library author](https://www.npmjs.com/package/@jaybeeuu/recoilless).
So I think it's time to exercise my prerogatives.

In this post I'm going to investigate `Suspense`, and how to make components suspend and how to work with them.
Let's see if I can sneak you in with my backstage pass, shall we?

## So what is Suspense any way?

Well... the answer to that question is a component.
[`Suspense`](https://react.dev/reference/react/Suspense)
is well documented, it "lets you display a fallback until its children have finished loading".
"Loading" is doing a lot of work there - what does it mean to be loading?
Further down the page it talks about how a "component suspends while fetching [data]".

But still no mention of actually how to make a component suspend.

I dug into one of their examples to see if there were any answers there.
[This example](https://codesandbox.io/s/s9zlw3?file=/index.js&utm_medium=sandpack),
from
[the suspense docs usage section](https://react.dev/reference/react/Suspense#usage)
looked promising, showing all the key features we're interested in and is really simple.
It displays a button, which you can click to (fake) fetch, then display album data for a niche 60's pop band.

![The beatles](./the-beatles.gif)

It's simple enough that we can see all the moving parts, and they haven't used a library... so...

Picking through it, there's only few components in there, but the three we are interested in are these:

```jsx
function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}

function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

`ArtistPage` uses `Suspense` to display a fallback (`Loading`) if it's child (`Albums`) "suspends".
[`use`](https://codesandbox.io/s/s9zlw3?file=/Albums.js&utm_medium=sandpack)
must be the place where the magic happens.

There it is, under yet another note telling me, _please_, don't look behind the curtain (sorry Oz...).

```js
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

See at the end - they `throw promise` as if it were an error.

That's suspending.
I feel like I should add a line to the docs:

> If a react component throws a promise during it's render then it is said to have suspended.

Welcome to the inner sanctum.
The `Suspense` component essentially catches the promise, and renders the fallback in it's place.
I'm not sure whether or not it's actually directly in the call stack, I suspect there's more of an event model at play, like with `Error Boundaries`,
but it feels like a good enough mental model.

Let me pick `use` apart and refactor it a bit, so that we can see what's happening.

```js
export const use = (promise) => {
  observePromise(promise);

  switch (promise.status) {
    case "pending": throw promise;
    case "fulfilled": return promise.value;
    case "rejected": throw promise.error;
  }
};
```

The first line on that function we "observe" the promise. Here's what that looks like:

```js
const observePromise = (promise) => {
  if (isObservedPromise(promise)) {
    return;
  }

  promise.status = "pending";

  void (async () => {
    try {
      promise.value = await promise;
      promise.status = "fulfilled";
    } catch (error) {
      promise.error = error;
      promise.status = "rejected";
    }
  })();
};
```

If we've already observed then just return, there's nothing to do.
Otherwise there's a bit of mutation (I'm biting my tongue - this is an example after all) going on to assign statuses and values etc. into properties on the promise.

The promise starts in `pending`.
Then we use an asynchronous
[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
to `await` the promise.
When it resolves, we assign it the status to`fulfilled` and set a value property on the promise.
If it rejects we likewise set the `rejected` status and set the error property.

Back in `use` now,  we're up to the `switch/case`, where we decide how to handle what we have.
Those lines again so you don't need to scroll:

```tsx
  switch (promise.status) {
    case "pending": throw promise;
    case "fulfilled": return promise.value;
    case "rejected": throw promise.error;
  }
```

You can see us handling each of the three states a promise can be in:

* `"pending"` - we're still waiting for a value, throw the promise.
* `"fulfilled"` - we've got a value, return it synchronously.
* `"rejected"` - the promise rejected and we throw the error.

So that's `use`. Back in [Albums.js](https://codesandbox.io/s/s9zlw3?file=/Albums.js&utm_medium=sandpack)
we can see it in the context of a react component. There they simply call it passing a promise they got from `fetchData()` (a simulated API call),

```js
const albums = use(fetchData(`/${artistId}/albums`));
```

To belabour the point: there's three outcomes of that call.

* thrown error (which we could catch with an [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)),
* thrown promise (the component "suspends") caught by the `Suspense` in `ArtistPage`, which falls back to the `Loading` component.
* the value - allows the component to render.

## How do we... uh... reanimate?

How do we let react know when the promise has fulfilled so it can have another try?
That bit is simple and, maybe, unsurprising.
`Suspense` awaits the promise we throw and then attempts to render again when it resolves.
A little experimentation with throwing other promises confirms that - if you return a promise that never resolves for example then suspense never retries the render.
Interestingly if the promise you throw doesn't resolve a value or resolves to an unrelated value, the component still renders properly... more on that later.

## The bear trap

Easy? Sounds it - but, I'm going to let you into a secret - I've tried writing this before.
I needed a hook to bind RXJS Observables into react and thought I might try using `Suspense`.
I got in a horrible loop.
That experience was, in part, motivation for this post.
There's something extra that we need to make it all work and that's a little hidden in this example.

Have a look again at `<Albums>`.
When it is rendered, it uses `fetchData`, which returns the promise that is passed to `use`.
Fine.

The problem is that _we need to have seen the promise before_. Remember at th beginning of `observePromise`

```ts
if (isObservedPromise(promise)) {
  return promise;
}
```

If the promise has already been observed then simply return it. But that means we need to have seen this exact instance of a promise before.
Otherwise we're back to pending mode, and we'll suspend - that could be a loop.

But we're making a bare call to `fetchData` there's no  `useRef` or `useMemo`
(although that
[shouldn't be for data fetches and resource management](https://react.dev/reference/react/useMemo#caveats)
).
So on each render of `<Albums>` we are making a new call to `fetchData` and, on first glance, getting a new `promise`.

Which means we can't possibly pass an observed promise into `use` and so should always suspend?
Don't we **need** something to stabilise the `promise` reference, and avoid making network requests over and over?
This was the cause of my loop in the RXJS binging.
On each render, I subscribed to the Observable again and ended up in a loop.
My default reaction was to use `useRef` and effects to stabilise the subscription,
but that didn't help.
It turns out no hook can help us here.
When a component suspends, it is removed from the tree.
When the promise resolves, and `Suspense` rerenders - it starts from scratch - with an entirely new instance of the child component.
This is mentioned in the [`Suspense`](https://react.dev/reference/react/Suspense#caveats) docs:

> React does not preserve any state for renders that got suspended before they were able to mount for the first time.
> When the component has loaded, React will retry rendering the suspended tree from scratch.

Remember how I said that the value the promise resolves to don't matter?
This is why.
`Suspense` doesn't pass the value back into a half rendered component (ho could it?),
it just rebuilds and rerenders the component as if it had never tried in the firsts place.

This example doesn't loop though. so we must have missed something.
Let's have another look at `fetchData`, maybe there's answers in there.
From [`data.js`](https://codesandbox.io/s/s9zlw3?file=/data.js:170-316&utm_medium=sandpack):

```js
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

Right - a cache.
Either, the cache doesn't have a record for our URL, so we make a "request" (`getData`) and set the promise into the cache,
or we simply retrieve a pre-existing promise (which is subsequently mutated when we observe it).
So long as the URL is the same, we get the same promise, regardless of the caller and for the lifetime of the application.

Great - there's a second line we need to add to our documentation:

> Manage your data fetches outside of the lifecycle and state of the suspended component.

You can't rely on React state and component lifecycle to manage your data fetches.
Maybe you can trigger them with a render, as is done here, but something else needs to track them and play them back when they resolve.
In production couldn't quite be a simple as the `Map` we see here - that would be a memory leak.
The Map isn't told when we're done with the promise, so it would keep references to all the promises the app ever made, forever.
Over time that could eat a lot of memory.
Something would have to along and tidy up that `Map` to remove requests wer're finished with.

Here we're finally at something which is tricky, and thar be dragons.
Managing a cache like this is notoriously difficult.

When should we remove that promise from the map?
do it too soon and your application won't work, in our case we could end up in cycles, do it too late and you end up with a huge memory footprint.
Here, the component which triggered the fetch in the first place can't be used to manage cleanup either, so something else would have to weigh in.
For example, we could add some clean up logic to a `useEffect`, but then when would it get called?
A little experimentation indicates it _doesn't_ get called when the component suspends, even if it's set up before the component suspended.
But it also doesn't get called if the component _never get's rerendered_.
For example if `Albums` started to render, made the promise and suspended, then something in the application changed before the promise resolved so `Albums` is never rerendered by suspense.
Then we would never get that `useEffect` cleanup.
(Effects are not called if a component suspends, so we don't need to worry about untidied effects, it's just not useful to us.)

Libraries like [`@tanstack/react-query`](https://tanstack.com/query/latest/docs/react/overview) do this for us, with declared timeouts and cache lengths that we can configure.
So maybe it makes sense that the react team are pushing for us not to try and work with `Suspense` directly.
It could lead us into some dangerous territory and as an application developer I want to be writing features, not caching mechanisms.

On the other hand - It turns out that a cache like this isn't necessarily what's required.
In a [(very) slightly more complicated example application](https://github.com/jaybeeuu/react-suspense)
I managed to stabilise the promise by simply by having the promise managed by hooks in a wrapper, between the `Suspense` and the component that needed the data.
The downside here being the separation between the creation of the data from the need for the data.
But depending on your application, and philosophy, that could be desirable any way.

At first all of this seems like a weakness in the design, but having played with it a little,
I actually think it lends some power of `Suspense`.
Remember one of the goals of suspense is to avoid waterfalls of data fetches.
You don't want to render a component, wait for the data to load, only to render a child which also needs to wait for data to load.
The need to manage the promise outside the component means you're forced into separating render from fetch,
and therefore into the mindset that data and render are separate.
Looking at the docs, the react team are
[expecting and hoping for just that](https://legacy.reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html#fetch-in-event-handlers).
Preparatory calls to be made at the top level when transitional state changes are made,
e.g. in the click handlers of links from routing libraries.
So that by the time the components are being rendered, the data they need is already being fetched.

My container sidestepped some of that advantage of course,
the container wasn't that far from the component,
but maybe that's ok in some use cases.
The simplicity of having an operation declared and managed close to it's point of use, rather than off in he gods, and separated in the codebase,
might well be a desirable tradeoff depending on the scale of your application.
Certainly some of the applications I have worked on, have been so large and complicated that it would take some very careful architecting to separate data fetch from render meaningfully, without creating an unmanageable, tangle.

There's risk that you create a hidden dependencies in what at first glance appears to be a pure function - it's behaviour is suddenly dependent on state stored and setup elsewhere in the application, and that dependency is in no way declared in the way you call the function (or if you're using typescript in the type of the function).
Arguably this has always been the case with hooks.
Their behaviour depends, often, on what has gone before.

## So where does that leave us?

We've figured out how to make suspense work:

> * If a react component throws a promise during it's render then it is said to have suspended.
> * Manage your promises, e.g. for data fetching, outside of the lifecycle and state of the suspended component.

Overall I think suspense is an interesting approach to the problem of asynchrony in applications, and what to display in the meantime.
The way the React team have implemented it makes the actual use of that asynchrony nicely declarative,abstracting away a lot of that decision making form the application developers and presenting a decent base UX.
In combination with
[transitions](https://react.dev/blog/2022/03/29/react-v18#new-feature-transitions)
it's a powerful tool.
(I also make use of that API in my
[example application](https://github.com/jaybeeuu/react-suspense)
but decided it was a topic for a whole other post.)

There's still a question about whether it's a good idea to use it bare like this, especially in the face of all the react team's encouragement not to do so.
It's stable and "allowed" for ["data fetching in opinionated libraries"](https://react.dev/blog/2022/03/29/react-v18#suspense-in-data-frameworks).

I'm also left wondering if it's not a little too clever for it's own good.
Much like hooks it feels like the learning curve is going to be steep, especially for those new to React, with plenty of pitfalls and foot-guns for folk to discover along the way.
Would it have been needed if the React authors had leaned into more of
[JavaScripts built in features for handling asynchrony](https://crank.js.org/)
rather than being caught up by exciting but
experimental [frontiers](https://overreacted.io/algebraic-effects-for-the-rest-of-us/)?
Maybe that's why the react team only really want libraries to adopt it?
Best to hide the magic behind a library call so we don't have to look at it?

Either way - it's here to stay and they do mention the possibility of introducing more primitives to lubricate it's use in the future, so maybe one day all of this will be ours.
