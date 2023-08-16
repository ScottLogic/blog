---
title: 'React Suspense: Documenting the Undocumented'
date: 2023-08-15 13:18:00 Z
categories:
- UI
- jbickley-wallace
- React
tags:
- suspense
- react
- Javascript
- guides
- how-to
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
The description of the waterfall approach to loading data vs. loading data as you render really resonated with performance problems we'd had in a project I was working with at the time.
Suspense though was experimental in react 16; the only thing that it was supported with was `Lazy` components,
and I never like using experimental API's in production
so I eagerly awaited the arrival of a stable API.

But that day never arrived. I was put off and lost interest.

Years later the react team announced some
really [interesting](https://react.dev/blog/2022/03/29/react-v18#new-feature-transitions)
[features](https://react.dev/blog/2022/03/29/react-v18#new-suspense-features) in v18
(concurrent rendering - multiverse theory for react applications?).

But while Suspense is now "Stable" and "Production Ready" it is _still_ only recommended for use in
[data fetching frameworks](https://react.dev/blog/2022/03/29/react-v18#suspense-in-data-frameworks).
And the docs _still_ don't describe how to it works; only how to use things like `Suspense` and `useTransition`.

They tantalise by talking about what happens when a component "Suspends" or "while a component is loading", but not how to actually make a component suspend.
There was a similar note at the beginning of the original post which always niggled too...

> This post will be most relevant to people working on data fetching libraries for React.

I remember feeling slightly patronised by that.
Why can't I, as an _application author_, become master of my own destiny and make use of this powerful feature?
Is it too complex for mere mortals to comprehend?

What the react authors don't know is that in the intervening years I have become a
[data fetching framework author](https://www.npmjs.com/package/@jaybeeuu/recoilless).
So I think it's time to exercise my prerogatives.

In this post I'm going to try to fill in the blanks in the `Suspense` documentation. How do you make components suspend & handle promises in a react application to build a fantastic UX?

Let's see if I can sneak you in with my backstage pass, shall we?

## So what is Suspense any way?

The answer surface answer to that question is well
[documented](https://react.dev/reference/react/Suspense)
\- it's a component:

> `Suspense` lets you display a fallback until its children have finished loading.

But "Loading" is doing a lot of work there - what does it mean for a component to be loading?
Further down the page it talks about how a "component suspends while fetching [data]"

My understanding of that and the examples is - if you wrap a component tree in `Suspense` then, if the component tree requests data that isn't available,
`Suspense` will display your fallback, usually some kind of loading indicator.
It's easy to use:

~~~ jsx
<Suspense fallback={<SomeLoadingSpinner />}>
  <YourDataHungryComponent />
</Suspense>
~~~

But there's no mention of actually how to make a component suspend.
It's absence is obvious and weird, like they are dancing around it - "what elephant?".

I dug into one of their examples to see if there were any answers there.
[This example](https://codesandbox.io/s/s9zlw3?file=/index.js&utm_medium=sandpack),
from
[the suspense docs usage section](https://react.dev/reference/react/Suspense#usage)
looked promising, showing all the key features we're interested in and is really simple.
It displays a button, which you can click to (fake) fetch, then display album data for a niche 60's pop band.

![the-beatles.gif](/uploads/the-beatles.gif)

It's simple enough that we can see all the moving parts, and they haven't used a library... so maybe we can use this to figure it out.

Picking through it, there's only few components in there, but the three we are interested in are these:

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

`ArtistPage` uses `Suspense` to display a fallback (`Loading`) if it's child (`Albums`) "suspends".
[`use`](https://codesandbox.io/s/s9zlw3?file=/Albums.js&utm_medium=sandpack)
must be the place where the magic happens.

There it is, under yet another note telling me, _please_, don't look behind the curtain (sorry Oz...).

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

See at the end - they `throw promise` as if it were an error.

That's suspending.
I feel like I should add a line to the docs:

> If a react component throws a promise during it's render then it is said to have suspended.

Welcome to the inner sanctum. Don't forget to pay your membership dues, and never talk about Suspense.
The `Suspense` component essentially catches the promise, and renders the fallback in it's place.
I'm not sure whether or not it's actually directly in the call stack, I suspect there's more of an event model at play, like with `Error Boundaries`,
but catching feels like a good enough mental model.

Let me pick `use` apart and refactor it a bit, so that we can see what's happening.

    export const use = (promise) => {
      observePromise(promise);
    
      switch (promise.status) {
        case "pending": throw promise;
        case "fulfilled": return promise.value;
        case "rejected": throw promise.error;
      }
    };

The first line on that function we "observe" the promise. Here's what that looks like:

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

    switch (promise.status) {
      case "pending": throw promise;
      case "fulfilled": return promise.value;
      case "rejected": throw promise.error;
    }

You can see us handling each of the three states a promise can be in:

* `"pending"` - we're still waiting for a value, throw the promise.
* `"fulfilled"` - we've got a value, return it synchronously.
* `"rejected"` - the promise rejected and we throw the error.

So that's `use`. Back in [Albums.js](https://codesandbox.io/s/s9zlw3?file=/Albums.js&utm_medium=sandpack)
we can see it in the context of a react component. There they simply call it passing a promise they got from `fetchData()` (a simulated API call),

    const albums = use(fetchData(`/${artistId}/albums`));

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

Easy? Sounds it, but I'm going to let you into a secret - I've tried writing this before.
I needed a hook to bind RXJS Observables into react and thought I might try using `Suspense`.
I got in a horrible loop.
That experience was, in part, motivation for this post.
There's something extra that we need to make it all work and that's a little hidden in this example.

Have a look again at `<Albums>`.
When it is rendered, it uses `fetchData`, which returns the promise that is passed to `use`.
Fine.

The problem is that _we need to have seen the promise before_.
Remember at the beginning of `observePromise`

    if (isObservedPromise(promise)) {
      return promise;
    }

If the promise has already been observed then simply return it.
But that means we need to have seen this _exact instance_ of a promise before.
Otherwise we're back to pending mode and we'll suspend. That could make a loop.

The example works though, and we're making a bare call to `fetchData` there's no  `useRef` or `useMemo`
(although that
[shouldn't be for data fetches and resource management](https://react.dev/reference/react/useMemo#caveats)
).
So on each render of `<Albums>` we are making a new call to `fetchData` and, on first glance, getting a new `promise`.

Which means we can't possibly pass an observed promise into `use` and so should always suspend?
Don't we **need** something to stabilise the `promise` reference, and avoid making network requests over and over?
This was the cause of my loop in the RXJS binding.
On each render, I subscribed to the Observable again and made a new promise, which went to pending and suspended the component, when the promise resolved I rerendered the component... forever.
My default reaction was to use `useRef` and effects to stabilise the subscription,
but that didn't help.
It turns out no hook can help us here.
When the promise resolves, and `Suspense` "rerenders" the component, it really starts from scratch with an entirely new instance of the child component, there's no "re-" about it.
This is mentioned in the [`Suspense`](https://react.dev/reference/react/Suspense#caveats) docs:

> React does not preserve any state for renders that got suspended before they were able to mount for the first time.
> When the component has loaded, React will retry rendering the suspended tree from scratch.

Remember how I said that the value the promise resolves to doesn't matter?
This is why.
`Suspense` doesn't pass the value back into a half rendered component.
How could it?
JS doesn't support that control flow for `throw` statements.
React, while it does seem magical, is still running in the JavaScript runtime.
Instead, `Suspense` just renders the component as if it had never tried in the first place.
I'm going to call it reanimating from now on so we don't fall into the rerender mental model.

The example though, doesn't loop, so we must have missed something.
Let's have another look at `fetchData`, maybe there's answers in there.
From [`data.js`](https://codesandbox.io/s/s9zlw3?file=/data.js:170-316&utm_medium=sandpack):

    let cache = new Map();
    
    export function fetchData(url) {
      if (!cache.has(url)) {
        cache.set(url, getData(url));
      }
      return cache.get(url);
    }

Right - a cache.
Either the cache doesn't have a record for our URL, so we make a "request" (`getData`) and set the promise into the cache,
or we simply retrieve a pre-existing promise (which is subsequently mutated \*shudder\* when we observe it).
The map is in the root scope of the module, not in the function, so it is created the the first time the module is imported, and exists for the lifetime of the application.
So long as the URL is the same, we get the same promise, regardless of the caller and for the lifetime of the application.

Great - and I think we understand enough to add a second line to our documentation:

> Manage your data fetches outside of the life cycle and state of the suspended component.

You can't rely on React state and component life cycle to manage your data fetches.
Maybe you can trigger them with a render, as is done here, but something else needs to track them and play them back when they resolve.
In production couldn't quite be a simple as the `Map` we see here - that would be a memory leak.
The Map isn't told when we're done with the promise, so it would keep references to all the promises the app ever made, forever.
Over time that could eat a lot of memory.
Something would have to along and tidy up that `Map` to remove requests we're finished with.

Here we're finally at something which is tricky, and thar be dragons.
Managing a cache like this is notoriously difficult.

When should we remove that promise from the map?
do it too soon and your application won't work, in our case we could end up in cycles, do it too late and you end up with a huge memory footprint.
Here, the component which triggered the fetch in the first place can't be used to manage cleanup either, so something else would have to weigh in.
For example, we could add some clean up logic to a `useEffect`, but then when would it get called?
A little experimentation indicates it _doesn't_ get called when the component suspends, even if it's set up before the component suspended.
(the effect is also not called so `useEffect`'s are still safe in suspending components.)
It would get called if the component reanimated successfully then unmounted, but what if it _never_ reanimates?
For example if `Albums` started to render, made the promise and suspended. Then something in the application changed before the promise resolved, maybe the user navigates away or decides on a different band to look at. `Albums` is never reanimated by suspense, so we would never get that `useEffect` cleanup.

Libraries like [`@tanstack/react-query`](https://tanstack.com/query/latest/docs/react/overview) do this for us, with declared timeouts and cache lengths that we can configure.
So maybe it makes sense that the react team are pushing for us not to try and work with `Suspense` directly.
It could lead us into some dangerous, time consuming, territory. As an application developer I want to be writing features, not caching mechanisms.

On the other hand, it turns out that a cache like this isn't necessarily what's required.
In a [only very slightly more complicated example application](https://github.com/jaybeeuu/react-suspense)
I managed the promise managed with hooks in a [wrapper](https://github.com/jaybeeuu/react-suspense/blob/main/src/image-loader/image-loader.tsx) between the `Suspense` and the component that needed the data.
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

My wrapper also sidestepped some of that advantage as it wasn't that far from the component.
Maybe that's OK in some use cases.
The simplicity of having an operation declared and managed close to it's point of use, rather than off in he gods, and separated in the code base,
might well be a desirable trade off depending on the scale of your application.
Certainly some of the applications I have worked on, have been so large and complicated that it would take some very careful rearchitecting to put the data fetches next to the state changes that cause a component to be rendered somewhere in the tree, without creating an unmanageable tangle.

## So where does that leave us?

We've figured out how to make suspense work:

> * If a react component throws a promise during it's render then it is said to have suspended.
> * Manage your promises, e.g. for data fetching, outside of the lifecycle and state of the suspended component.

And overall I think suspense is an interesting approach to the problem of handling asynchrony in applications and what to display in the meantime.
The way the React team have implemented it makes the actual use of that asynchrony nicely declarative,abstracting away a lot of that decision making form the application developers and presenting a decent base UX.
In combination with
[transitions](https://react.dev/blog/2022/03/29/react-v18#new-feature-transitions)
it's a powerful tool.
(I also make use of that API in my
[example application](https://github.com/jaybeeuu/react-suspense)
but decided it was a topic for a whole other post.)

Even though it is relatively simple to use, there's still a question about whether it's a good idea to do so. Especially in the face of all the react team's pleading for us not to do so. As with anything, that probably depends on your use case. If you're just hammering out an application then probably not, if you're writing a component library or framework intended to be consumed by other teams... maybe.

I'm also left wondering if it's not a little too clever for it's own good.
Much like hooks it feels like the learning curve is going to be steep, especially for those new to React, with plenty of pitfalls and foot-guns for folk to discover along the way.
Suspendable components making use of it effectively get an extra, undeclared result/return value which is surprising given it's not the intended use of the `throw` statement. 
Would it have been needed if the React authors had leaned into more of
[JavaScripts built in features for handling asynchrony](https://crank.js.org/)
rather than
[being caught up by (hyped?) experimental frontiers](https://overreacted.io/algebraic-effects-for-the-rest-of-us/)?
Maybe that's why the react team only really want libraries to adopt it?
Best to hide the magic behind a library call so we don't have to look at it?

Either way - it's here to stay and they do mention the possibility of introducing more primitives to lubricate it's use in the future, so maybe one day all of this will be ours.
