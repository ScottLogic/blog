---
title: Developing large scale KnockoutJS applications
date: 2014-02-28 00:00:00 Z
categories:
- Tech
author: rwilliams
image: rwilliams/assets/featured/building.jpg
image-attribution: image courtesy of <a href="http://www.flickr.com/photos/bgreenlee/4713148/sizes/o/">bgreenlee</a>
layout: default_post
summary: It's easy to get started building data-bound user interfaces in the browser using the KnockoutJS MVVM library. This post covers some practices and techniques that help with using it successfully in large single page applications.
summary-short: Practical practices and techniques for large SPAs
oldlink: http://www.scottlogic.com/blog/2014/02/28/developing-large-scale-knockoutjs-applications.html
disqus-id: "/2014/02/28/developing-large-scale-knockoutjs-applications.html"
---

Using the [KnockoutJS](http://knockoutjs.com/) JavaScript front end [MVVM](http://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/) library, it's easy to get started with building data-bound user interfaces in the browser. Using the library and the pattern can greatly improve many of the aspects that matter in building a high quality application.

Building large single-page applications that work requires careful consideration of structure, patterns and practices - and consistent application of these throughout. This includes the use of libraries and frameworks, especially the core ones. This post covers some practices and techniques that help with successfully using Knockout in such applications.



## Maintainable and extensible view models

The patterns often used in many Knockout demos and documentation don't apply well to creating non-trivial view models. Patterns such as object literals and per-object functions are often used in such cases for brevity and simplicity.


### Constructors and prototypes
Using constructors and defining all functions on their prototypes brings many benefits. The constructor can be short, there is no need to use `self` for context, only one of each function will exist, and functions can be overridden on inheriting view models. The name of the constructor is also helpful when inspecting binding contexts.

{% highlight javascript %}
var Person = function Person(firstName, lastName) {
    this.firstName = ko.observable(firstName);
    this.lastName = ko.observable(lastName);
    
    this.fullName = ko.computed(this._fullName, this);
};
Person.prototype._fullName = function () {
    return this.firstName() + ' ' + this.lastName();
};
{% endhighlight %}


### The ko.mapping plugin
The [mapping plugin](http://knockoutjs.com/documentation/plugins-mapping.html) allows you to quickly and easily build a view models out of plain JavaScript objects, but it has its limitations as things grow. It does offer customization options for how your view models are created and serialized, but even with these it's often not the best choice. The benefits of specific types for your view models are mostly lost when using it, and the amount and complexity of the mapping customization options will often grow over time. It also removes the need for the developer to think about what needs to be observable and what doesn't. For all but the simplest view models and data structures, defining types and building them yourself is usually more maintainable and extensible.



## Manageable views
As views become more complex, with large amounts of nesting and many bindings applied to each element, they can become more difficult to understand that they need to be.

### Avoiding binding string clutter
When a large number of bindings are applied to elements, view markup can become cluttered and difficult to read. This can be mostly alleviated by adopting a formatting convention (when necessary) that places each binding on its own line, and indenting binding options:

{% highlight html %}
<div data-bind="
    enabled: isEnabled,
    attr: {
        foo: isFoo,
        bar: isBar
    }
"></div>
{% endhighlight %}

Most of the clutter often comes from the binding options; this can be avoided by putting the entire options onto the view model. This can be as a plain object, an observable, or a computed observable:

{% highlight javascript %}
var Person = function Person(firstName, lastName) {
    // ...
    
    this.attr = {
        foo: this.isFoo,
        bar: this.isBar
    };
};
{% endhighlight %}

The view then becomes much cleaner:
{% highlight html %}
<div data-bind="enabled: isEnabled, attr: attr"></div>
{% endhighlight %}


### Use named templates to split up complex views
Named templates are often used when markup needs to be reused, but they can also help with splitting up large and complex views. A few high level template bindings makes it easy to understand via their names what the main parts of a complex view are, without having to scroll a great distance to see the rest of the view.


## Separation of components
Simple Knockout applications often use a single view model and a single application of bindings to the document body by a "main" file. As the application grows, new "sub view models" are often added for separate parts. In a calendar application for example, there might be ones for the calendar itself, the reminders section, and the new appointment section. This is better than a single mega view model, but there's still only one place to put non-view model code - in the main file that's responsible for creating the view model and applying the bindings.

A better approach is to use components for each of these parts, with each component having its own "main" code, view model and view. These components can then be created in other views by using custom bindings. If you're using jQuery, the [jQuery UI widget factory](http://learn.jquery.com/jquery-ui/widget-factory/) can be used as a framework for creating such components.


### Initializing and controlling components with custom bindings
Creating a custom binding to initialize widgets/components is easy, and will also go a long way to avoiding DOM operations in your view models and main file. The following is a basic example of such a binding for jQuery UI widgets:

{% highlight javascript %}
ko.bindingHandlers.widget = {
    init: function (element, valueAccessor) {
        var widgetElement,
            value = valueAccessor();
        
        widgetElement = document.createElement('div');
        ko.virtualElements.prepend(element, widgetElement);
        
        $(widgetElement)[value.type.prototype.widgetName](value.options);
        
        return { controlsDescendantBindings: true };
    }
};
ko.virtualElements.allowedBindings.component = true;
{% endhighlight %}

Usage:
{% highlight html %}
<!-- ko widget: { type: $.myNamespace.clock, options: { mode: 'analogue' }  } -->
<!-- /ko -->
{% endhighlight %}

The binding takes a widget type and some options, creates an element, and initializes a widget of that type on the newly created element. Since the new widget will apply bindings to its own element, the binding handler lets the current binding application know not to descend into the widget.

With some enhancement, the binding handler could handle updating options on the widget based on observables on the view model. It could also optionally not control descendant bindings, which would allow it to be used to apply interaction widgets such as jQuery UI's draggable.


### Auto-generate element IDs for named templates
When using the `template` binding with named templates, the script tags containing those templates must be named using the `id` attribute. As the number of templates in an application grows, it becomes difficult to ensure that all templates have unique names.

This problem can be avoided by passing all templates through a mapper that gives each one an unique `id`, and returns an object mapping meaningful template names to the unique `id`s.

A simple mapper implementation I created can be found [here](https://github.com/robatwilliams/knockout-handybits/blob/master/templateMapper.js); this is how it's used to avoid the conflicting `id` problem:

When defining templates, use the `data-templatename` attribute instead of `id`:

{% highlight html %}
<script data-templatename="add" type="text/html">
  <div>
    <input data-bind="value: todoText" />
    <button data-bind="click: addTodo">Add</button>
  </div>
</script>
{% endhighlight %}

Map the templates once, and expose them on your view models:

{% highlight javascript %}
define([
    'templateMapper',
    'text!views/templates.htm'
], function (templateMapper, templatesText) {
    var ViewModel, mappedTemplates;
    
    mappedTemplates = templateMapper.map(templatesText);
    
    ViewModel = function ViewModel() {
    	this.mappedTemplates = mappedTemplates;
    };
    
    return ViewModel;
});
{% endhighlight %}

Use the mapped `id`s via their mapped names in your views. The mapped names are those given in the `data-templatename` attributes of the script tags.
{% highlight html %}
<!-- ko template: mappedTemplates.add --><!-- /ko -->
{% endhighlight %}

## Using Knockout with AMD
Using modules is essential for managing a large codebase. This section covers the use of AMD for modules, but the ideas will also apply to other module APIs.


### Always use jQuery, or never use it
If `jQuery` is available on `window` when Knockout defines itself, it will capture a reference to it and use it internally for some enhancements such as more capable HTML parsing. If jQuery and Knockout are being loaded as dependencies of your modules, there is no certainty of which one will load first. This can cause Knockout to sometimes define itself with jQuery, and sometimes without. If your code relies on some of the internal enhancements that jQuery gives, this can cause problems which are hard to track down.

As jQuery is an optional dependency of Knockout, Knockout's `define` call doesn't specify it as a dependency. Fortunately, it's easy to force it in as a dependency when using the RequireJS AMD loader by using the `shim` config option. The option is intended for use with older non-AMD scripts which export themselves as browser globals, but we can use it to add additional dependencies to AMD modules:

{% highlight javascript %}
// require.config.js
var require = {
    shim: {
        'knockout': {
            deps: ['jquery']
        }
    }
};
{% endhighlight %}

This will work in all cases except when using the [noConflict map pattern](http://requirejs.org/docs/jquery.html#noconflictmap) to do a deep `noConflict` which will remove both `$` and `jQuery` from the `window` object.

In [Knockout 3.1.0](https://github.com/knockout/knockout/releases/tag/v3.1.0beta) (currently in beta), the jQuery capturing is done when `ko.applyBindings` is called, rather than when the module defines itself. The above shim config will therefore no longer be necessary, as long as jQuery is loaded before the bindings are applied. It also allows for a less than ideal solution for the deep `noConflict` map pattern, by doing an invalid `ko.applyBindings` to force a capture:

{% highlight javascript %}
// require-config.js
var require = {
    paths: {
        'knockout-raw': 'lib/knockout-3.1.0beta.debug'
    },
    map: {
        '*': {
            'jquery': 'jquery-private',
            'knockout': 'knockout-jquery'
        },
        'jquery-private': {
            'jquery': 'jquery'
        }
    }
};
{% endhighlight %}

{% highlight javascript %}
// knockout-jquery.js
define(['knockout-raw', 'jquery'], function (ko, jQuery) {
    var _jQuery = window.jQuery;
    
    window.jQuery = jQuery;
    
    try {
        // ko will capture jQuery, and error immediately due to invalid arguments
        ko.applyBindings(null, {}); 
    } catch (expected) {
    }
    
    window.jQuery = _jQuery;

    return ko;
});
{% endhighlight %}


### Ensure plugins and extensions are loaded before use
It's usual (required in some cases) for extensions (e.g. custom bindings, extenders, custom `fn` functions, plugins) to put themselves onto the Knockout module itself (e.g. `ko.mapping`) or add additional functions onto parts of Knockout itself.

This can be a source of problems when using AMD because it's easy to forget to declare a dependency and still be able to use it due to other modules having loaded it onto Knockout earlier on. This causes problems when different application flows result in different sets of modules being loaded, and in different orders. It's particularly difficult to spot this with extenders, as no error is thrown when you try to apply an extender that doesn't exist.

This is a general problem that's also seen for example when loading jQuery and jQuery UI extensions/widgets onto `$`.

For plugins, I think the ideal solution would be for them not to put themselves onto `ko` when they detect themselves being loaded via AMD. In the meantime, and for other types of extensions, I think the safest approach is to adapt the AMD jQuery noConflict map pattern seen earlier in this post:

For all modules, when they want `knockout`, give them our own Knockout module:
{% highlight javascript %}
// require.config.js
var require = {
    paths: {
        'knockout-raw': 'lib/knockout-3.0.0.debug'
    },
    map: {
        '*': {
            'knockout': 'lib/knockout-extended'
        }
    }
};
{% endhighlight %}

Our own Knockout module declares dependencies on all our extensions, and returns the real Knockout:
{% highlight javascript %}
// knockout-extended.js
define([
    'knockout-raw',
    'ko-extensions/ko.extenders.foo',
    'ko-extensions/ko.bindingHandlers.widget'
], function (ko) {
    return ko;
});
{% endhighlight %}

In our extensions, we use `knockout-raw` as Knockout to avoid a circular dependency. For third party extensions that depend on `knockout`, we could add an entry into the RequireJS `map` config to point them to `knockout-raw`.
{% highlight javascript %}
// ko-extensions/ko.extenders.foo.js
define([
    'knockout-raw'
], function (ko) {
    ko.extenders.foo = function (target) {
        return target;
    };
});
{% endhighlight %}



## "Gotchas"
This small collection isn't specific to large applications, but may be useful to keep in mind.


### Avoid abusing the callbacks of the foreach binding
It can be tempting to grab DOM elements and do things to them in the `afterRender` callback, for example to apply a UI control. The documentation warns against this, and with good reason as it's much easier to do with a custom binding.

Furthermore, until Knockout 3.0.0, descendant bindings will not yet have been applied when `afterRender` is called. So the children of the inserted elements won't be in the state you might expect them to be in.


### Control dependencies in custom bindings
When using a binding handler to initialise and update a component (e.g. a jQuery UI custom widget) that itself uses Knockout, it's easy to create unwanted dependencies that will cause the binding handler to run in response to things happening inside the component. In Knockout versions lower than 3.0, all binding handlers would run, as they are not independent.

Consider this enhancement to the widget binding handler mentioned earlier, that allows updates on the created widget to be updated when some observable options on our view model change. The widget may run some code internally in response to options changing, and that code could evaluate some observables. Because binding handlers run within a computed observable, those observables that the component evaluated will become dependencies of the binding handler's computed observable. So when those observables are later set by actions inside the component, they'll cause the binding handler to run. This is undesirable and will likely have unwanted effects.

We can use a computed observable that we immediately dispose of in our binding handler to capture and discard those unwanted dependencies. All binding handler code that calls in to unknown code (the widget) is placed inside the evaluator function of the computed observable, so that any dependencies created will be on that computed observable, rather than on that of the binding handler itself.

{% highlight javascript %}
ko.bindingHandlers.component = {
    init: function (element, valueAccessor) {
        // ...
    },
    
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            options = ko.toJS(value.options);
        
        ko.computed(function () {
            $(element).myComponent('options', options);
        }).dispose();
    }
};
{% endhighlight %}


### Applying extenders
An extender can either return the subscribable that it's applied to, or return a new one. This clearly affects whether you need to store the return value of `extend`, but also what happens when you apply multiple extenders with a single call to `extend`:

{% highlight javascript %}
var name = ko.observable().extend({
    extenderThatReturnsOriginal: true,
    extenderThatReturnsNewThing: true
})
{% endhighlight %}

As property iteration order is not guaranteed, the order in which extenders will be applied isn't either. And as each extender is applied to the return value of the previous, what each extender is applied to is also not guaranteed. Applying multiple extenders in a single call is therefore only appropriate if all those extenders return the target that they're applied to.


### Element attribute bindings
The `css`, `style` and `attr` bindings control attributes on elements based only on the properties of the current object given to them. Those properties are fixed if the object is declared in the binding string, but as we saw earlier for larger objects it can be useful to point the binding to a property or computed observable on the view model (`data-bind="css: css"`):

{% highlight javascript %}
this.css = ko.computed(function () {
    return {
        valid: this.valid(),
        invalid: !this.valid()
    };
}, this);
{% endhighlight %}

When doing this however, it's important to keep the set of properties fixed - properties that disappear on the next evaluation won't cause attributes/styles/classes to be removed from the element.


### Modifying binding strings
The built in bindings unwrap their given values if needed, which means there is no need to evaluate them in the binding string. It's easy to forget however that evaluations must be added when introducing conditionals to existing binding strings:

{% highlight html %}
<input data-bind="enabled: isActive" />
{% endhighlight %}

Needs to become:

{% highlight html %}
<input data-bind="enabled: isActive() && isEditable()" />
{% endhighlight %}
























