---
author: dpizzi
title: Strong Typing With KnockoutJS and RequireJS
layout: default_post
summary: >-
  This article demonstrates a successful integration of TypeScript with
  KnockoutJS and RequireJS to provide a strongly-typed environment for
  development of HTML5 apps.
image: dpizzi/assets/featured/Strong.png
oldlink: >-
  http://www.scottlogic.com/blog/2015/06/02/StrongTypingWithKnockoutJSAndRequireJS.html
disqus-id: /2015/06/02/StrongTypingWithKnockoutJSAndRequireJS.html
categories:
  - Tech
---

Following my previous post on [Strong Typing With AngularJS]({{ site.baseurl }}/2014/08/26/StrongTypingWithAngularJS.html), this article presents the integration of TypeScript with an other client MVC framework: _KnockoutJS_. We will also integrate RequireJS that allows the use of the [Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD) (AMD) API.  

[KnockoutJS](http://knockoutjs.com/) is a JavaScript front-end library based on the Model-View-ViewModel ([MVVM](http://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/)) pattern that helps in the creation of rich and dynamic User Interface (UI).

[Typescript](http://www.typescriptlang.org/), on the other hand, is a typed superset of the JavaScript language that is compiled to produce clean, simple, cross-browser compatible JavaScript code, which can help when building and maintaining large-scale applications.

[RequireJS](http://requirejs.org/) is a JavaScript file and module loader, which makes easier managing code structure. It is optimized for in-browser use, but it can be used in other JavaScript environments, like Rhino and Node.

The Visual Studio 2013 (VS) solution containing the code for this article is available on [GitHub](https://github.com/dpizzi-scottlogic/StrongTypingWithKnockOutJS).

## Project Setup

### Adding a new Visual Studio project

For this tutorial, we use a Visual Studio (VS) template project of type _HTML Application with TypeScript_ which is included in the VS extension [Web Essentials 2013 for Update 4](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebEssentials20135) .

<img src="{{ site.baseurl }}/dpizzi/assets/StrongTypingWithKnockoutJS/AddNewProject.jpg"/>

_NOTE: The [version 1.4 of TypeScript](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.TypeScript14forVisualStudio2013-13057) is also needed for the latest KnockoutJS TypeScript declaration file._

Once created, simply remove the files _app.css_ and _app.ts_ from the project as they won't be needed any more.

This tutorial makes use of AMD modules (e.g. we will use `export` and `import` keywords) that we will be loaded asynchronously when needed at runtime.
In order to support this, TypeScript requires the `--module` flag on compilation which you can specify on the _TypeScript Build_ settings on the project properties by choosing _AMD_ in _Module system_.

<img src="{{ site.baseurl }}/dpizzi/assets/StrongTypingWithKnockoutJS/TypeScriptBuild.jpg"/>

### Importing NuGet Packages

We now have a clean project but also need several JavaScript frameworks.
We will [install them via NuGet](https://docs.nuget.org/consume/installing-nuget) using the following packages:

 * __RequireJS__ (Current version 2.1.17)
 * __requirejs.TypeScript.DefinitelyTyped__ (Current version 0.2.0 by Jason Jarrett)
 * __Text Plugin for RequireJS__ (Current version 2.0.7)
 * __KnockoutJS__ (Current version 3.3.0)
 * __knockout.TypeScript.DefinitelyTyped__ (Current version 0.8.2 by Jason Jarrett)
 * __jQuery__ (Current version 2.1.4)

The corresponding files will be added into the `/Scripts/` folder with the exception of the DefinitelyTyped packages that are added to the folder `/Scripts/Typing/`.

### RequireJS Configuration

To set the RequireJS [configuration options](http://requirejs.org/docs/api.html#config) we use a [data-main attribute](http://requirejs.org/docs/api.html#data-main) in the HTML page.

_index.html_
{% highlight html %}
<head>
    <script data-main="Scripts/requireConfig" type="text/javascript" src="Scripts/require.js"></script>
</head>
{% endhighlight %}

The configuration in `requireConfig.ts` is needed to hold the list of dependencies that are wired up but is also used to load the first application module which acts as the main entry point.

_/Scripts/requireConfig.ts_
{% highlight javascript %}
require.config({
    baseUrl: "",
    paths: {
        "jQuery": "Scripts/jquery-2.1.4",
        "knockout": "Scripts/knockout-3.3.0.debug",
        "text":"Scripts/text"
    },
    shim: {
        "jQuery": {
            exports: "$"
        }
    }
});
require(["Scripts/App/main"]);
{% endhighlight %}

The first application module (`Scripts/App/main.ts`) is in charge of initialising the viewmodel binding.

### KnockoutJS Activation

The [activation process](http://knockoutjs.com/documentation/observables.html#activating-knockout) is needed in order to make use of KnockoutJS functionalities.
After creating an instance of the page viewmodel we simply pass its reference to the method __ko.applyBindings()__.

_/Scripts/App/main.ts_
{% highlight javascript %}
import ko = require('knockout');
require(["jQuery"], function ($) {
    $(document).ready(function () {
        //Instantiate page view model
        ko.applyBindings(/* page view model instance */);
    });
});
{% endhighlight %}

We will see later the definition of the page viewmodel when [integrating everything together]({{ site.baseurl }}/2015/06/02/StrongTypingWithKnockoutJSAndRequireJS.html#integrating-everything-together).

## Component Creation

[Components](http://knockoutjs.com/documentation/component-overview.html) are a powerful, clean way of organizing your UI code into self-contained, reusable chunks.
Custom elements are an optional but convenient syntax for consuming components.

In this example, we are creating a widget that displays a list of people within a table.
The full name field is computed from the first and last names but is also editable.

<img src="{{ site.baseurl }}/dpizzi/assets/StrongTypingWithKnockoutJS/Component.jpg"/>

### Models

This data represents objects and operations in your business domain (e.g., bank accounts that can perform money transfers, etc.) and is independent of any UI.
In our case, this will represent the person object that is composed of the `firstName`, the `lastName` and the `age` fields.

We define the `IPerson` interface to prototype our objects.

_/Scripts/App/Components/PersonTable/Models/IPerson.ts_
{% highlight javascript %}
module PersonTable {
    export interface IPerson {
        firstName: string;
        lastName: string;
        age: number;
    }
}
{% endhighlight %}

Now we just need to define the `Person` class to implement this interface.

_/Scripts/App/Components/PersonTable/Models/Person.ts_
{% highlight javascript %}
class Person implements PersonTable.IPerson {  
    constructor(public firstName: string, public lastName: string, public age: number) {
    }     
}
export = Person;
{% endhighlight %}

### View Models

When using KnockoutJS, your view models are pure JavaScript objects that are a pure-code representation of the data and operations on a UI.
Therefore, the `Person` class also needs its equivalent in the viewmodel world to manage sophisticated behaviours such as the calculation of the full name or editing.

The functionalities of the `PersonViewModel` class have been inspired by examples provided in the KnockOutJs documentation: See [decomposing user input](http://knockoutjs.com/documentation/computed-writable.html#example-1-decomposing-user-input) and [Click-to-edit](http://knockoutjs.com/documentation/hasfocus-binding.html#example-2-click-to-edit) for implementation details.

The class `PersonViewModel` has its properties represented by [observables](http://knockoutjs.com/documentation/observables.html) - because these are special JavaScript objects that can notify subscribers about changes - which automatically detect dependencies.

_/Scripts/App/Components/PersonTable/ViewModels/PersonViewModel.ts_
{% highlight javascript %}
import Person = require('../Models/Person');
import ko = require('knockout');
class PersonViewModel {
    public firstName: KnockoutObservable<string>;
    public lastName: KnockoutObservable<string>;
    public age: KnockoutObservable<number>;
    public fullName: KnockoutComputed<string>;
    public editing: KnockoutObservable<boolean>;
    constructor(person: PersonTable.IPerson) {
        this.firstName = ko.observable(person.firstName);
        this.lastName = ko.observable(person.lastName);
        this.age = ko.observable(person.age);
        this.fullName = ko.computed({
            read: () => {
                return this.firstName() + " " + this.lastName();
            },
            write: (value: string) => {
                var lastSpacePos = value.lastIndexOf(" ");
                if (lastSpacePos > 0) {
                    this.firstName(value.substring(0, lastSpacePos));
                    this.lastName(value.substring(lastSpacePos + 1));
                }
            }
        });
        this.editing = ko.observable(false);
    }
    edit() {to hold these data
        this.editing(true);
    }
}
export = PersonViewModel;
{% endhighlight %}

_NOTE: In order to follow good practices (e.g. Interface-based programming), the class PersonViewModel should normally implement its own interface.
However we will omit this pattern in this tutorial for clarity reasons._

_In JavaScript, `this` is a variable that is set when a function is called rather than being part of any object by default.
This can lead to [issues in KnockOutJs](http://knockoutjs.com/documentation/computedObservables.html#managing-this) which requires different solutions to be solved (e.g. use of the 'self' variable).
However, TypeScript allows the use of the [lambda functions](http://www.typescriptlang.org/Handbook#functions-lambdas-and-using-39this39) which are a more elegant solution._

The value of the `fullName` property is represented using a [writeable computed observable](http://knockoutjs.com/documentation/computed-writable.html) and can therefore be both read or written.

We need now to define the viewmodel of our component, the `PersonTableViewModel` class. It is in charge of creating and storing a list of `PersonViewModel` objects from a list of `Person` which will be provided during construction as a parameter.
Its `persons` field uses the `KnockoutObservableArray` generic type to track which `PersonViewModel` objects are in the [observable array](http://knockoutjs.com/documentation/observableArrays.html).

_/Scripts/App/Components/PersonTable/ViewModels/PersonTableViewModel.ts_
{% highlight javascript %}
import Person = require('../Models/Person');
import PersonViewModel = require('./PersonViewModel');
import ko = require('knockout');
class PersonTableViewModel {
    public persons: KnockoutObservableArray<PersonViewModel>;
    constructor(params) {
        var persons = params.value();
        this.persons = ko.observableArray([]);
        if (persons && persons.length > 0) {
            persons.forEach((value: Person) => {
                this.persons.push(new PersonViewModel(value));
            });
        }
    }
}   
export = PersonTableViewModel;
{% endhighlight %}

### Views

The view is an HTML document containing the declarative bindings that will be linked with the view model.
For a component, the view comes from its template and is cloned then injected into the container HTML element before being bound.

_/Scripts/App/Components/PersonTable/Views/PersonTableView.html_
{% highlight html %}
<table>
    <thead>
        <tr><th>First name</th><th>Last name</th><th>Full name</th><th>Age</th></tr>
    </thead>
    <tbody data-bind="foreach: persons">
        <tr>
            <td data-bind="text: firstName"></td>
            <td data-bind="text: lastName"></td>
            <td>
                <span data-bind="visible: !editing(), text: fullName, click: edit">&nbsp;</span>
                <input data-bind="visible: editing, textInput: fullName, hasFocus: editing" />
            </td>
            <td data-bind="text: age"></td>
        </tr>
    </tbody>
</table>
{% endhighlight %}

### Integrating everything together

Now that we have implemented the component, we need to first register it into KnockoutJS before being able to use it.

For that we can use the __ko.components.register()__ method (for more details on [component registration](http://knockoutjs.com/documentation/component-registration.html#registering-components-as-a-viewmodeltemplate-pair)).
The registration happens during the initialisation and [loads the component via AMD](http://knockoutjs.com/documentation/component-registration.html#how-knockout-loads-components-via-amd).

_/Scripts/App/main.ts_
{% highlight javascript %}
...
require(["jQuery"], function ($) {
    $(document).ready(function () {
        ko.components.register('person-table', {
            viewModel: { require: 'Scripts/App/Components/PersonTable/ViewModels/PersonTableViewModel' },
            template: { require: 'text!Scripts/App/Components/PersonTable/Views/PersonTableView.html' }
        });
        ...
    });
});
{% endhighlight %}

We can now add the `person-table` [custom element](http://knockoutjs.com/documentation/component-custom-elements.html) that injects the component template into the page.
However, we need to also pass the list of person to display to its viewmodel.
We can fortunately do this using the [params attribute](http://knockoutjs.com/documentation/component-custom-elements.html#passing-parameters).

_index.html_
{% highlight html %}
<body>
    <person-table params="value: persons"></person-table>
</body>
{% endhighlight %}

The `PageViewModel` is responsible for holding these data using its `persons` property.

_/Scripts/App//ViewModels/PageViewModel.ts_
{% highlight javascript %}
import Person = require('Scripts/App/Components/PersonTable/Models/Person');
import ko = require('knockout');
class PageViewModel {
    public persons: KnockoutObservableArray<Person>;
    constructor(personData: Person[]) {
        this.persons = ko.observableArray(personData);
    }
}
export = PageViewModel;
{% endhighlight %}

For simplicity the data is created during initialisation and passed to the `PageViewModel`.

_/Scripts/App/main.ts_
{% highlight javascript %}
import ko = require('knockout');
import Person = require('Scripts/App/Components/PersonTable/Models/Person');
import PageViewModel = require('Scripts/App/ViewModels/PageViewModel');
require(["jQuery"], function ($) {
    $(document).ready(function () {
        var personArray: Person[] = [
            new Person('Steve', 'Maxwell', 36),
            new Person('John', 'Smith', 40)
        ];
        ...
        var pageViewModel: PageViewModel = new PageViewModel(personArray);
        ko.applyBindings(pageViewModel);
    });
});
{% endhighlight %}

_NOTE: On a real scenario the data are more likely to come from the server using AJAX calls._

## Conclusions

In this article we have presented one practical solution of the integration of strong typing using the TypeScript framework with KnockoutJS and RequireJS.
Whilst the size of the project - which you can find on [GitHub](https://github.com/dpizzi-scottlogic/StrongTypingWithKnockOutJS) - is not considerable, the integration of these technologies are not straightforward, essentially due to the lack of documentation available on Internet.

First, we detailed project creation, framework configuration and activation.
Then, we implemented a component that allows re-usability and asynchronous loading which is essential in large scale project.
Finally, we integrated everything together and explained how data can be passed between viewmodels.

What to do from here? Well, the [DefinitelyTyped](http://definitelytyped.org/) type definitions from KnockoutJS and its [GitHub repository](https://github.com/borisyankov/DefinitelyTyped) presents further examples that might (definitely) be worth a read.
