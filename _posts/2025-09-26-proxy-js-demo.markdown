---
title: Using proxy object for state management
date: 2025-09-26 08:00:00 Z
categories:
- Tech
tags:
- Javascript
summary: We explore using JavaScript’s native Proxy object as a simpler, safer alternative
  to external state-management libraries. We demonstrate how a Proxy can intercept
  gets and sets on an object to enable reactive behavior—like creating computed properties,
  triggering listeners when state changes, and even achieving bi-directional binding
  between form inputs and state. Drawing inspiration from Angular Signals, we argue
  that for many cases, proxies are sufficient without needing full frameworks, reducing
  complexity and dependency risk.
author: osharon
---

A recent internal talk by [Jessica Holding](https://www.linkedin.com/in/jessica-holding-bristol/) about [Angular Signals](https://angular.dev/guide/signals) made me wonder if I could get a similar experience using native JavaScript functionality. I have long advocated about careful [consideration of any third-party library](https://blog.scottlogic.com/2022/03/24/the-dependencies-reckoning.html) added to your code, and with the recent [supply chain attack](https://thehackernews.com/2025/09/20-popular-npm-packages-with-2-billion.html) on a third-party library with 2 billion weekly downloads, I think it’s a good opportunity to play around and see if we can replicate some of Angular's "black magic".
In my opinion, JavaScript’s [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object doesn’t get the recognition it deserves. Simply put, it allows to add seamless code to an Object's getters and setters. This means we can perform additional operations whenever we read or write a value. Consider the following code:

~~~javascript
  const data = {};
  const state = new Proxy(data, { get(target, prop) { return target[prop] * 2; } });
  state.value = 8;
  console.log(data.value, state.value); // 8 16
~~~

We’re creating an empty ​`data` object and wrapped with a Proxy that has a getter that doubles the returned value. The data.value​ doesn’t change but whenever we’ll try to access it via the proxy we’ll get the doubled value. Alternatively, we can manipulate the values as they’re being written - 
​

~~~javascript
  const data = {};
  const state = new Proxy(data, {
    set(target, prop, value) { 
      return (target[prop] = value * 2); 
    }
  });
  state.value = 8;
  console.log(data.value, state.value); // 16 16
~~~

So let’s build a state machine:
We’ll start off with a [computed](https://angular.dev/guide/signals#computed-signals)​ value, that is a readonly​ value that is a result of a function

~~~javascript
function State(initial = {}) {
  const computed = new Map();

  const handler = {
    get(target, prop, receiver) {
      if (computed.has(prop)) {
        return computed.get(prop)(receiver); // compute dynamically
      }
      return Reflect.get(...arguments);
    }
  };

  const proxy = new Proxy(initial, handler);

  proxy.compute = (prop, fn) => computed.set(prop, fn);

  return proxy;
}
~~~
And we can use it like this -

~~~javascript
const state = new State({ count: 0 });
state.compute('doubleCount', s => s.count * 2);

State.count++;
Console.log(state.doubleCount); // 2
~~~

Now our state has a `state.doubleCount`​ value that is being calculated on the fly. Note that we can use the ++​ operator and it would work just fine, and note that doubleCount​ isn’t a function but an actual object’s property;

We can also add listeners (an [effect](https://angular.dev/guide/signals#effects) in the world of angular) so whenever a value changes, something else will be triggered.

~~~javascript
function State(initial = {}) {
  const listeners = new Map();

  const notify = (key, value) => {
    if (listeners.has(key)) {
      listeners.get(key).forEach(fn => fn(value));
    }
    };

  const handler = {
    set(target, prop, value, receiver) {
      const result = Reflect.set(...arguments);
      notify(prop, value);
      return result;
    }
    };

  const proxy = new Proxy(initial, handler);

  proxy.addListener = (prop, fn) => {
    if (!listeners.has(prop)) {
      listeners.set(prop, new Set());
    }
    listeners.get(prop).add(fn);
  };

  proxy.removeListener = (prop, fn) => {
    if (listeners.has(prop)) {
      listeners.get(prop).delete(fn);
    }
  };

  return proxy;
}
~~~
And we can use it like this to update the display whenever a value changes -

~~~javascript
state.addListener('name', newValue => {
  const text = newValue.length > 0 ? `Welcome, ${newValue}!` : 'Enter your name';
  document.getElementById('welcomeMessage').textContent = text;
});
~~~

Finally we’d like to create a [bi-directional binding](https://angular.dev/guide/templates/two-way-binding#two-way-binding-with-form-controls) between an input field and variable. We’ll add a listener to the field that will update the variable and add a proxy listener to update the field whenever the variable changes.

~~~javascript
proxy.bidi = (prop, elm, attribute = 'value', event = 'input') => {
  elm[attribute] = proxy[prop] || '';
  elm.addEventListener(event, () => proxy[prop] = elm[attribute]);
  proxy.addListener(prop, (newValue) => {
    if (elm[attribute] !== newValue) {
      elm[attribute] = newValue || '';
    }
  });
};
~~~

And then we can use it to bind the name​ element with the name​ variable -
`state.bidi('name', document.getElementById('name'));`

Of course, Angular adds much more functionality. It provides an advanced mechanism to refresh only the relevant part of the page in case of state changes. It’s easy to refresh the entire page but it’ll have performance costs. Instead, I suggest updating the specific elements that need changing.

You can see a <a href="{{ site.baseurl }}/osharon/assets/proxy.js/proxy-demo.html" target="demo" target="demo">demo</a> of this proxy-based State here (or its <a href="{{ site.baseurl }}/osharon/assets/proxy.js/proxy-demo.html.txt" target="demo">source code</a>)
<iframe id="demo" name="demo" src="{{ site.baseurl }}/osharon/assets/proxy.js/proxy-demo.html" style="width:100%;height:31rem;border:0;" title="demo"></iframe>

Deciding which framework is the right one for your project, or which framework you should use is not a lightweight call to make. [Uncle Bob](http://www.cleancoder.com/products) also cautions about the [commitment such decision requires](https://www.youtube.com/watch?v=evmZTh7l6UE)
. But should you decide to use native JS, it still doesn’t mean you need to reinvent the wheel, and I hope this article will inspire you to find a simple solution that works for you.