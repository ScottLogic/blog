---
title: Vue Components
date: 2020-09-22 00:00:00 Z
categories:
- jporter
- Tech
tags:
- vue,
- components
author: jporter
layout: default_post
summary: This is part two of a series introducing Vue to developers who are new to
  the ecosystem and evaluating whether to include it in their next project. In this
  post we will look at Vue components but check out part one if you are looking for
  an initial overview.
---

This is part two of a series introducing Vue to developers who are new to the ecosystem and evaluating whether to include it in their next project. In this post we will look at Vue components, but check out [Part 1](https://blog.scottlogic.com/2020/09/18/to-rival-react-an-overvue.html) if you are looking for an initial overview. While Vue 3 has just been released, this post will focus on Vue 2 which is commonly used.

As the [Vue Guide](https://vuejs.org/v2/guide/#Composing-with-Components) states, "a component is essentially a Vue instance with pre-defined options". Given that an entire Vue app is a Vue instance, a component is essentially a microcosm of an app. This also applies to each page as these are also Vue instances. In practice, this means that the processes of creating pages and components are extremely similar.

Components in Vue are composed of three parts; a template (which is like HTML), styles and JavaScript. These can be split into multiple files or the same `.vue` file. For simplicity here these examples are combined into one file.

Here is an example of a hello world component showing each constituent part.

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

Let's look at each of the three parts of a component, starting with the template.

## Template
Vue templates are designed to be similar to vanilla HTML with two main exceptions: directives and custom components. Templates are used in both pages and components and usually sit at the top of a `.vue` file.

### Custom Components
Custom components are simple to create and use. In fact, this whole section is about creating a custom component. A new `.vue` file must be made then imported into the page or component it needs to be displayed in. It then needs to be added to the component options object within the script tag (see that section) before it can be added to the template, as shown here.

~~~html
<custom-component :custom-prop="message" />
~~~

For more information about custom components visit the [Vue Guide](https://vuejs.org/v2/guide/components.html).

### Directives
Directives are special attributes that can be added to tags in templates. These provide functionality to the component or page, and always start with the `v-` prefix. While there are many directives available, the most useful 5 categories (in my opinion) are listed here:

- `v-bind`
- `v-on`
- `v-model`
- `v-if`; `v-else-if`; `v-else`
- `v-for`

### Data Binding: v-bind
`v-bind` is a directive that pipes a variable into a component and updates that component when the variable changes.

For example, an input element could take a value of `counter`. When `counter` is updated by other components, this input will automatically update.

~~~html
<input type="text" v-bind:value="counter" />
~~~

The directive must prefix a property of the element that will be dynamically updated. Any property can be bound to data using `v-bind`.

As this is the most common directive a single colon can be used for brevity, as shown here.

~~~html
<input type="text" :value="counter" />
~~~

### Event Handling: v-on
`v-on` is a directive that takes a function which is called when the specified event is fired. Like `v-bind`, the directive must prefix an event name. However, rather than taking a variable this takes an expression or method.

For example, this button will add 1 to the counter when clicked.

~~~html
<button v-on:click="counter += 1">Add 1</button>
~~~

Like `v-bind`, this is a commonly used directive and has a shorthand - the `@` symbol.

~~~html
<button @click="counter += 1">Add 1</button>
~~~

`v-on` can take either an expression or a method name, as shown here. The method can be written with or without the curly brackets.

~~~html
<button @click="increment()">Add 1</button>
~~~

### Parent-Child Communication
The method of communication between a parent and child component changes depending on the direction. According to best practice, props (and therefore `v-bind` should be used for downwards communication but events (and therefore `v-on`) for upwards.

To communicate upwards, emit events from the child component using the `$emit` method.

~~~javascript
export default Vue.extend({
  methods: {
    emitEvent(value) {
      this.$emit('click', value);
    }
  }
});
~~~

Within the parent component, an event can be consumed in the same way as is done for standard HTML components.

~~~html
<child-component @click="clickHandler" />
~~~

Although it is possible, the Vue community considers it an anti-pattern to pass callbacks down to the child component via its props, as shown here.

~~~html
<child-component :onclick="clickHandler" />
~~~

### Two Way Data Binding: v-model
While `v-bind` enables one-way data binding, Vue also supports two-way binding using the directive `v-model`. 

For example, this input component will react to changes to the variable `message` but also will push updates to this variable when a user enters text.

~~~html
<div id="app">
  <input v-model="message" />
</div>
~~~

As an aside, `v-model` is a shorthand directive that adds two directives under the hood. The example above could be rewritten using `v-on` and `v-bind` as shown here.

~~~html
<div id="app">
  <input :value="message" @input="message = $event.target.value" />
</div>
~~~

### Conditional Display: v-if
`v-if` is used to conditionally display elements.

For example, this text will only display if the variable `visible` is `true`.

~~~html
<div>
  <span v-if="visible">Hello World</span>
</div>
~~~

Much like standard programming logic, `v-else-if` and `v-else` can be used also. This next example will display one of three strings depending on the value of `type`.

~~~html
<div>
  <span v-if="type === 'A'">Type A!</span>
  <span v-else-if="type === 'B'">Type B!</span>
  <span v-else>Unknown Type!</span>
</div>
~~~

### Loops: v-for
`v-for` is used to display multiple copies of similar elements, as you might expect from the name. This is useful for displaying lists and tables.

Here is an example of how this is used to display a list of names. Note that the `v-bind` directive is needed for the `key` attribute (`:key`) so that each generated element is distinct in the DOM.

~~~html
{% raw %}<template>
  <div>
    <p v-for="name in names" :key="name">{{ name }}</p>
  </div>
</template>{% endraw %}

<script>
export default {
  data() {
    return {
      names: [
        'Alice',
        'Bob',
        'Connor',
        'Doug'
      ]
    }
  }
};
</script>
~~~

## Script
The second part of a Vue component is the script, which can be either JavaScript or transpiled languages such as TypeScript. This code, contained within the `<script>` tag, defines the functionality of the component.

As you can see from this example, most of the logic is contained within the component options object; the object passed to `Vue.extend()`.

~~~html
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
~~~

There are many types of component options to choose from; the key ones are listed here.

### Data
The data option provides variables for use in the template.

~~~javascript
export default Vue.extend({
  data() {
    return {
      counter: 0
    }
  }
});
~~~

This can be accessed in other component options by referencing `this.counter`. In the above sections we have already seen how to reference variables, either through double curly brackets or the directives `v-model` and `v-bind`.

### Props
Props are passed into components using XML attributes as is standard in HTML.

For example, this shows the variable `counter` being passed into the prop `value` of the component `MyComponent`.

~~~html
<my-component :value="counter" />
~~~

Within `MyComponent.vue`, this can be achieved in the component options.

~~~javascript
export default Vue.extend({
  props {
    value: { type: Number, default: 0 },
  },
});
~~~

As shown, each value requires meta data such as its data type, default and whether it is required or not. This prop can now be used in the same way as a variable in the template or accessed in other component options using `this.value`.


### Methods
Methods are a key way of enabling functionality in your component. They are defined within the component options and referenced in a similar way to variables.

This example shows an `increment()` method which increases the value of `counter` by 1.

~~~javascript
export default Vue.extend({
  data() {
    return {
      counter: 0
    }
  },
  methods: {
    increment() {
      this.counter++;
    }
  }
});
~~~

To use this in the template, reference `increment()` within a `v-on` directive, as shown in the above section.

~~~html
<button @click="increment">+</button>
~~~

To learn more about event handling, see the [Vue docs](https://vuejs.org/v2/guide/events.html).

### Computed
Computed values are similar to methods but differ in how they update. As you might expect, methods are run each time they are called and will recalcuate their return value. However, this is not the case for computed values. These are recalculated whenever any of the data they depend on updates, and the resulting updated return value is pushed to any components consuming the computed values. Therefore, they are a powerful tool for manipulating input values but maintaining reactivity.

This example shows how to set up a computed value.

~~~javascript
export default Vue.extend({
  props {
    value: { type: String, default: '' },
  },
  computed: {
    message() {
      return `[Message: ${this.value}]`;
    }
  }
});
~~~

This is consumed in the same was as variables are consumed. In this example, when the value prop updates the message computed value will also update causing the text on the screen to do likewise.

~~~html
{% raw %}<span>{{ message }}</span>{% endraw %}
~~~

### Components
Child components can be added as follows.

~~~javascript
import ChildComponent from '../ChildComponent.vue';

export default Vue.extend({
  components: {
    ChildComponent,
  },
});
~~~

`ChildComponent` can be now added to the template in one of two ways depending on convention.

~~~html
<child-component />
~~~

~~~html
<ChildComponent />
~~~

## Style
Styling within Vue is versatile and modern. Less, Sass and SCSS come built-in, along with support for scoped and modular CSS. As you might expect, multiple style tags can be written per component and styles can be imported from other files too. This allows you choice of a multi-file or single file approach.

CSS modules are easy to use. Simply add the "module" attribute to the style tag and reference the `$style` variable within the template.

~~~html
<template>
  <span :class="$style.welcome">
    Hello World!
  </span>
</template>

<style lang="scss" module>
.welcome {
  color: blue;
}
</style>
~~~

## Summary
In summary, Vue components are clear to write and maintain with appropriate separation of concerns built in. In particular, component options enable complexity to be handled in JavaScript rather than in the template which results a concise structure. However, the Vue approach does require some time to get used to. I recommend checking out [Part 1 of this series](https://blog.scottlogic.com/2020/09/18/to-rival-react-an-overvue.html) if you haven't yet to gain an "Over-Vue" of the framework (pun intended). To dive deeper into Vue components, take a look at the [official guide](https://vuejs.org/v2/guide/components.html).
