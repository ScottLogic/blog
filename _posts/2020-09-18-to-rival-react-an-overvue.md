---
title: 'To Rival React: an OverVue'
date: 2020-09-18 00:00:00 Z
categories:
- Tech
tags:
- vue,
- vuejs,
- featured,
- nuxt,
- vuex
author: jporter
layout: default_post
summary: This blog post is written for developers who have not used the Vue ecosystem
  before and want to decide whether to use it in a project or not. To help with this
  decision, this blog post will give a brief overview of the technology and ecosystem.
image: jporter/assets/512px-Vue.js_Logo_2.svg.png
---

This blog post is a brief overview of the Vue technology and ecosystem written for developers who have not come across it before but need to decide whether to include it in a project or not. While Vue 3 has just been released, this post will focus on Vue 2 which is widely used.

## Background
VueJS was released in February 2014 by former Google employee Evan You. After working with Angular on several internal projects at the tech giant, Evan decided to build a light-weight framework inspired by the best parts of Angular. He later said, “I figured, what if I could just extract the part that I really liked about Angular and build something really lightweight without all the extra concepts involved?”.

## Installation
In its most simple form Vue is easy to add to a web app. Firstly, add a script tag to link to the Vue codebase.

~~~html
<script src="https://unpkg.com/vue"></script>
~~~

~~~html
{% raw %}<div id="app">
  {{ message }}
</div>{% endraw %}
~~~

~~~js
new Vue({
  el: '#app',
  data: {
    message: 'Hello World!'
  }
});
~~~

This example was inspired by the [Vue guide](https://vuejs.org/v2/guide/).

However, in commercial projects you may want a more robust framework. Enter Nuxt, the ["intuitive Vue framework"](https://nuxtjs.org/). While you can create Vue apps without Nuxt, it is worth considering the framework as it reduces boilerplate and enables easy routing and state management. For the rest of this blog post Nuxt will be used in the examples.

While there are [many advantages of Nuxt](https://medium.com/vue-mastery/10-reasons-to-use-nuxt-js-for-your-next-web-application-522397c9366b), the biggest is that it helps developers to write universal apps more simply. Forget tedious configuration on both client and server, Nuxt enables an out of the box solution which enables you to deliver a fast experience to the user based on custom data.

To get started with Nuxt, use the Scaffolding tool `create-nuxt-app`.

~~~
npx create-nuxt-app <project-name>
~~~

This will create a directory structure with these key parts, each of which will be discussed below. (There are more default folders created but they are beyond the scope of this blog post.)

~~~
src
|--components
|--pages
|--layouts
|--store
~~~

You can find full instructions on the [Nuxt website](https://nuxtjs.org/guide/installation/).

## Dev Tools
Vue DevTools are a must for developers. You can download the Vue devtools browser extension for Chromium Edge, Chrome and Firefox from the appropriate online stores. The extension contains tabs for inspecting components, managing state, routes and performance. Relevant tabs will be referenced in the following sections.

## Components
Components in Vue are composed of three parts; a template (which is like HTML), styles and JavaScript. These can be split into multiple files or the same `.vue` file. For simplicity here these examples are combined into one file.

Here is an example of a simple example of a hello world component, showing each constituent part.

~~~html
{% raw %}<template>
  <span class="welcome">
    {{ message }}
  </span>
</template>{% endraw %}

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'Welcome',
  data() {
    return {
      message: 'Hello World'
    }
  }
});
</script>

<style>
.welcome {
  color: blue;
}
</style> 
~~~

In Nuxt, components are stored within the "components" directory and can be referenced from each other, pages and layouts.

When the app is running, components can be inspected using the Vue devtools. Component data can be edited and updates will happen to the app in real-time. Here is an example of the devtools running on the official Vue website.

![Vue DevTools - Components Tab]({{site.baseurl}}/jporter/assets/vue devtools components.png)

Components are perhaps the most important part of Vue to understand. To deep dive in this topic, I recommend checking out [Part 2](https://blog.scottlogic.com/2020-09-22-vue-components.html) of this series.

## Layouts
Layouts enable reuse of repeated components across multiple pages. The default layout is defined in `src/layouts/default.vue` although other layouts can also be defined.

Here is an example of a possible layout. 

~~~html
<template>
  <div>
    <div>[Navigation Bar]</div>
    <nuxt />
    <div>[Footer]</div>
  </div>
</template>
~~~

## Pages
Pages are similar to components but differ in a number of ways. In Nuxt, the directory structure of the pages defines the app routing. This is a fantastic way of reducing boilerplate but can feel unusual on first use.

For instance, consider the following directory structure:

~~~
src
|--pages
   |--index.vue
   |--about.vue
   |--blog
      |--index.vue
      |--summary.vue
      |--_id.vue
~~~

There are four 'page' files defined here which correspond to different routes. When the app is running, a user can navigate to the top level index page by viewing the "/" route (for instance by typing `localhost:3020/` into the address bar, assuming the app is running on localhost:3020). The about page can be found at "/about" and the blog page at `/blog`. However, the blog summary page lives at `/blog/summary` and the blog id page at `/blog/_id`, where `_id` can be any URL parameter.

This structure can be seen within the Vue devtools, which have a router section. This displays information about every route, including which is active.

![Screenshot 2020-09-16 092451.png]({{site.baseurl}}/jporter/assets/Screenshot 2020-09-16 092451.png)

In addition to easy routing, each Vue page can specify custom middleware which can be used for authentication and handle redirects. Furthermore, a layout can be specified, although if none is given the default layout will be used.

## Store (Vuex)
Nuxt implements the Vuex store, which is comparable to Redux in the React ecosystem. As always, detailed guidance can be found in the [official documentation](https://nuxtjs.org/guide/vuex-store). Similar to routing within Nuxt, there is a low amount of boilerplate in setting up the store.

The basic store has two components; state and mutations. The state object represents the currency state of the application and the mutation methods, unsurprisingly, mutate this. Consider this example store, located at `src/store/index.js`, which contains a simple message.

~~~js
export const state = () => ({
  message: 'Hello World'
});

export const mutations = {
  updateMessage(state, payload) {
    state.message = payload;
  },
};
~~~

This store can be used within a page or component via the `$store` object. The state cannot be mutated directly so changes must be committed to the store in order to trigger mutations.

~~~html
{% raw %}<template>
  <div>
    <h1>Welcome</h1>
    <p>Message: {{ $store.state.message }}</p>
    <input ref="input" />
    <button @click="update">Update</button>
  </div>
</template>{% endraw %}

<script>
import Vue from 'vue'

export default Vue.extend({
  methods: {
    update() {
      this.$store.commit('updateMessage', this.$refs.input.value)
    },
  },
})
</script>
~~~

In the template the state is accessed through `$store.state` and mutations are triggered in the script via `this.$store.commit(mutation, payload)`.

Mutations, and the state after each was applied, can be viewed in Vuex tab of the Vue devtools. The developer can step backwards and forwards in time and observe the changes to the app or revert certain mutations entirely.

![Screenshot 2020-09-16 095335.png]({{site.baseurl}}/jporter/assets/Screenshot 2020-09-16 095335.png)

Mutations are synchronous, so what if you want to do asynchronous operations? Enter actions. Actions are similar to mutations but can be asynchronous and do not mutate the store. Instead, they commit mutations.

~~~js
export const actions = {
  updateMessageAsync(contex, payload) {
    setTimeout(() => {
      context.commit('updateMessage', payload);
    }, 1000)
  },
};
~~~

To call an action, dispatch rather than commit to the store.

~~~html
<script>
import Vue from 'vue'

export default Vue.extend({
  methods: {
    update() {
      this.$store.dispatch('updateMessageAsync', this.$refs.input.value)
    },
  },
})
</script>
~~~

## Language: Typescript vs JavaScript
JavaScript is the primary language of Vue and Nuxt however supersets such as TypeScript can also be used. In my experience, Vue components do not play well with TypeScript however the language does have advantages within utility functions, business logic, API calls and the store. A hybrid approach could be considered, but there are many articles that compare these two languages in detail so they will not be discussed here.

## Competitor Comparisons
Vue is great to work with and technically advanced however the biggest drawback is that the community is smaller than that of React and Angular, its biggest rivals. There are many detailed comparisons of these frameworks, so this will not be discussed in detail here. [Here is one such example](https://www.codeinwp.com/blog/angular-vs-vue-vs-react/), although more can be found by searching online.

## Summary
Vue and Nuxt together are a fantastic pairing to build modern web applications. I recommend creating a hello world app to try them out and reading around online to learn more about them. To deep dive into Vue components, check out [Part 2](https://blog.scottlogic.com/2020-09-22-vue-components.html) of this series and to read more into the other topics discussed in this blog post take a look at the official guides on [Vue](https://vuejs.org/v2/guide/), [Nuxt](https://nuxtjs.org/guide) and [Vuex](https://vuex.vuejs.org/guide/).
