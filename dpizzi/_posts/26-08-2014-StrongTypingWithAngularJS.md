---
title: Strong Typing With AngularJS
author: dpizzi
title-short: TypingScript & AngularJS
layout: default_post
summary: This article demonstrates a successful integration of TypeScript with AngularJS
  to provide a strongly-typed environment for development of HTML5 apps.
tags: featured
image: dpizzi/assets/featured/Strong.png
oldlink: http://www.scottlogic.com/blog/2014/08/26/StrongTypingWithAngularJS.html
disqus-id: "/2014/08/26/StrongTypingWithAngularJS.html"
categories:
- Tech
---

A few weeks ago my colleague presented a detailed article about [strong typing for SignalR]({{ site.baseurl }}/2014/08/08/signalr-typed.html). This article presents the integration of TypeScript with the AngularJS framework. Whilst both technologies are widely adopted, and thoroughly documented, their integration seems however to rather lack documentation.

[AngularJS](https://angularjs.org/) is a JavaScript Model-View-Whatever ([MVW](https://plus.google.com/+AngularJS/posts/aZNVhj355G2)) framework that allows the writing of dynamic Single Page web Applications, and is becoming widely embraced because of its simplicity and completeness. Amongst its exhaustive list of features, the framework includes Dynamic Data Binding, Client-side Routing, Unit and End2End Testing or even HTML language extension.

[Typescript](http://www.typescriptlang.org/), on the other hand, is a typed superset of the JavaScript language that is compiled to produce clean, simple cross-browser compatible JavaScript code, which can help when building and maintaining large-scale applications. Typescript follows ECMAScript 5 (ES5) syntax but also includes several proposed features of ES6 such as interfaces, classes and modules.

In order to use strong typing we need first to define the types mapping the Angular objects, but writing all these interfaces - including the properties and methods that compose them - seems like a tedious task. Luckily, a popular TypeScript declaration file ( _.d.ts_ ) already exists and is available in the GitHub project named [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/angular).

The Visual Studio 2013 solution containing the code for this article is available on [GitHub](https://github.com/dpizzi-scottlogic/StrongTypingWithAngularJS).

## Project Organisation

### A Modular Design

In JavaScript, it is good practice to avoid name collisions and (over) pollution of the global namespace. The concept of modules has already been adopted in several frameworks - such as RequireJS or CommonJS. TypeScript also provides modularity by implementing the module feature proposed by ES6:

{% highlight javascript %}
module _modulename {
	...
}
{% endhighlight %}

As the application grows, we can define each component within its own file and split the modules across multiple files. The compiler just needs to know about the relationships between the files by adding reference tags.

### File Referencing

A simple reference to the definition file _angular.d.ts_ will make available all the interfaces defined for AngularJS within the _ng_ module. In TypeScript, internal references for the compiler are defined using:

{% highlight javascript %}
/// <reference path="../Lib/DefinitelyTyped/jquery/jquery.d.ts" />
{% endhighlight %}

However, as every file will need to reference all the required definitions, a useful design is to centralise all of them within one unique file which will be reference instead wherever needed.

For example,

*\_app.ts*
{% highlight javascript %}
/// <reference path="../Lib/DefinitelyTyped/angular/angular.d.ts" />
/// <reference path="./Services/AppStorage.ts" />
/// <reference path='./Controllers/AppCtrl.ts' />
/// <reference path="./Modules/app.ts" />
{% endhighlight %}

This file will reference every component defined within the application (services, controller, directives, filters, etc…).
Then, each file will use this centralised referencing, such as:

_AppStorage.ts_
{% highlight javascript %}
/// <reference path="_app.ts" />
{% endhighlight %}

### Concatenated Output

Modularity within the example project makes use of multiple files, therefore we have to make sure that the compiled output includes all the input files into a single JavaScript file. The TypeScript compiler uses the _–out_ flag to signify this:

{% highlight javascript %}
tsc --out app.js _app.ts
{% endhighlight %}

The resulting app.js file will just need to be included within our main HTML file.
For Visual Studio users, where TypeScript has been included within VS 2012 and 2013 since Update 2, the JavaScript compiled files can be combined into one by setting the Project Properties:

<img src="{{ site.baseurl }}/dpizzi/assets/StrongTypingWithAngularJS/VSProjectSettings.jpg"/>

## Defining Angular Components

Now that the overall structure has been defined and the proper referencing of TypeScript files is in place, we can start defining our AngularJS components. Angular components are defined using TypeScript classes which are directly attached to the main application Angular module.

_app.ts_
{% highlight javascript %}
/// <reference path="../_app.ts" />
module app {
    'use strict';
    angular.module('app', [])
        .service('appStorage', AppStorage)
        .controller('appCtrl', AppCtrl);
{% endhighlight %}

Here, the main application module app is defined, the service _appStorage_ and the controller _appCtrl_ are attached with their corresponding TypeScript classes _AppStorage_ and _AppCtrl_, which will be compiled into JavaScript functions.

### Services

In this example we will defined a unique service - here called _appStorage_ –, which will be in charge of storing information using the local storage API. This service is defined using the _AppStorage_ TypeScript class, which is part of the _app_ module.
Let’s have a look at its implementation:

_AppStorage.ts_
{% highlight javascript %}
/// <reference path="../_app.ts" />
module app {
    'use strict';
    export class AppStorage {
        get(key: string): string {
            return JSON.parse(localStorage.getItem(key) || '""');
        }
        set(key: string, value: any): void {
            localStorage.setItem(key, JSON.stringify(value));
        }           
    }
}
{% endhighlight %}

The class holds two methods _set_ and _get_, which are responsible for setting and getting values stored using the given key.
NOTE: The implementation above is simplified for presentation purpose; for example, unicity of the stored keys is not respected and previous duplicate entry will therefore be overridden.
Whilst the implementation of this service was quite simple, the definition of the controller is less straightforward.

### Controllers

The Angular controller will also be implemented using a TypeScript class, however one main difference with the service is that a constructor will be defined to allow dependency injection to insert the _$scope_ parameter object. In addition, the controller will make use of the _appStorage_ service.

_AppCtrl.ts_
{% highlight javascript %}
/// <reference path="../_app.ts" />
module app {
    'use strict';
    export class AppCtrl {
        constructor(private $scope, private appStorage) {
		...
        }
    }
}
{% endhighlight %}

Now, this raises an issue; what type should be used for each parameter?
Whilst the _appStorage_ parameter is typed using the service recently defined by the _AppStorage_ class, the _$scope_ is (at first sight) less obvious… The solution will come from the DefinitelyTyped definition file. Indeed, within that file, the interface _ng.IScope_ is defined to mirror all the native properties of the _$scope_ service provided by Angular (such as _$apply_, _$digest_, etc.). We have therefore the following signature for the constructor:

{% highlight javascript %}
export class AppCtrl {
    constructor(private $scope: ng.IScope, private appStorage: AppStorage) {
	...
    }
}
{% endhighlight %}

However, this base interface will need to be extended in order to add the properties and methods specific to our controller. The controller will hold a greeting string property and the _changeName_ method. The _greeting_ displays a generic message if no name have been stored so far, otherwise the message is customised. The _changeName_ method, defined using a lambda expression, stores the new name using the _appStorage_ service and modify the _greeting_ message.

{% highlight javascript %}
export interface IAppCtrlScope extends ng.IScope {
        greeting: string;
        changeName(name): void;
}
export class AppCtrl {
    constructor(private $scope: IAppCtrlScope, private appStorage: AppStorage) {
            $scope.greeting = appStorage.get('name') !== '' ?
				'Hello ' + appStorage.get('name') + ' !' :
				'Hello you !';
            $scope.changeName = (name) => {
                appStorage.set('name', name);
                $scope.greeting = 'Hello ' + name + ' !';
    }
}
{% endhighlight %}

NOTE: In this case a lambda expression is used for clarity and is interchangeable with a classic JavaScript anonymous function definition. Indeed, the advantage of using lambda expression emerges on call-back scenario as it automatically captures the right this pointer available when the function is created and not invoked (more details [here](http://www.typescriptlang.org/Handbook#functions-lambdas-and-using-39this39)).

### Directives

The last component that we are going to investigate is the directive, which are HTML language extension and represents markers on a DOM element. In this article, we will restrict the directive to an attribute of a button element whose main function will be to call the changeName method of the _appCtrl_ controller when clicked by the user. The second feature will be to animate the background of the element with CSS transition when hovered by the mouse cursor.
The directive is simply attached to the angular _app_ module in _app.ts_ file by adding the following statement:

_app.ts_
{% highlight javascript %}
/// <reference path="../_app.ts" />
module app {
    'use strict';
    angular.module('app', [])
        .service('appStorage', AppStorage)
        .controller('appCtrl', AppCtrl)
        .directive('changeName', changeName);
}
{% endhighlight %}

Now, let’s have a look at the _changeName_ directive in details. First difference is that instead of a class we are going to use a function as we need to return an object. The type of this object is _ng.IDirective_ interface, which is defined in the _angular.d.ts_ definition as well.

_changeName.ts_
{% highlight javascript %}
/// <reference path="../_app.ts" />
module app {
    'use strict';
    export function changeName(): ng.IDirective {
        return {
            restrict:'A',
            scope: false, // use controller scope
            link: ($scope: IAppCtrlScope, element:JQuery, attributes) => {
                ...
            }
        }
    };
}
{% endhighlight %}

There are a few interesting points to discuss here. First, notice that we chose to not use the isolated scope of the directive and instead simply used the controller scope. The main reason is to keep the directive definition as simple as possible and instead focus on the TypeScript integration aspect rather than pure Angular directive implementation. The main consequence is the use of the _IAppCtrlScope_ interface instead of having to define a new interface to match the scope specific to the directive.
Whilst this remains fairly similar to the controller class definition in term of interface and dependency injection, a new type is introduced here: _jQuery_. This type is also defined within a definition file provided by the DefinitelyTyped GitHub [project](https://github.com/borisyankov/DefinitelyTyped/tree/master/jquery). This file is also referenced within the *\_app.ts* file:

{% highlight javascript %}
/// <reference path="../Lib/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="../Lib/DefinitelyTyped/angular/angular.d.ts" />
/// <reference path="./Services/AppStorage.ts" />
/// <reference path='./Controllers/AppCtrl.ts' />
/// <reference path="./Directives/changeName.ts" />
/// <reference path="./Modules/app.ts" />
{% endhighlight %}

This interface provides us with all the jQuery mechanisms needed to manipulate the DOM. Here, the call-back functions handling of the _mouseenter_ and _mouseleave_ events are responsible for adding and removing a CSS class _animate_, which can, for example, control the background colour.

{% highlight javascript %}
link: ($scope: IAppCtrlScope, element:JQuery) => {
	element.on('mouseenter', function () {
		element.addClass('animate');
	})
	.on('mouseleave', function () {
		element.removeClass('animate');
	})
      	.on('click', function () {
		...
	});
}
{% endhighlight %}

The function handling the _click_ event must change the name stored and update the message displayed on the page, which is implemented within the controller _changeName_ method. Having direct access to the controller’s scope makes it simple to invoke the method. However, we have to keep in mind that the event call-back is occurring outside the Angular execution context, which means that Angular is unaware of model modifications (for more details about [scope life cycle](https://docs.angularjs.org/guide/scope#scope-life-cycle)). Therefore we need to explicitly ask for the scope to be ‘digested’ by calling the _$apply_ method of the controller scope:

{% highlight javascript %}
link: ($scope: IAppCtrlScope, element:JQuery) => {
	element.on('mouseenter', function () {
		element.addClass('animate');
	})
	.on('mouseleave', function () {
		element.removeClass('animate');
	})
	.on('click', function () {
		var name = JSON.parse(JSON.stringify(prompt('Please Enter your name:'))); // encode input
		$scope.changeName(name);
		$scope.$digest();
	});
}
{% endhighlight %}

### Some Consideration about Minification

A well-known issue occurs with the Angular Dependency Injection resolution mechanism when working with minified code: once renamed, the parameters cannot be properly resolved as it cannot retrieve the proper object to inject to the constructor.
This issue is traditionally solved using inline annotation (i.e. an array containing a list of the service names, followed by the function itself). However with strong typing, the TypeScript compilation of the class forces us to use a second solution which is to create an _$inject_ property to the controller function:

_AppCtrl.ts_
{% highlight javascript %}
export class AppCtrl {
	public static $inject = [
		'$scope',
		'appStorage'
	];
	constructor(private $scope: IAppCtrlScope, private appStorage: AppStorage) {
			...
	}
}
{% endhighlight %}

## Further Readings

The goal of this article was to give an overview of the integration between TypeScript and AngularJS by first exposing the overall project organisation and the file referencing. Later, we saw how to implement the main Angular components by taking into consideration the issues raised by superset typing introduced by TypeScript.
So where can we go from there?

The [usage notes](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/angular/README.md) of the definition file from the DefinitelyTyped GitHub repository discusses many aspects of the integration. It presents, for instance, extra definition files that can be referenced such as - amongst many others - the _angular-resource.d.ts_ (for the _ngResource_ module).

This [blog](http://notebookheavy.com/2013/05/22/angularjs-and-typescript/) post, by David Iffland, on using AngularJS and TypeScript together with MVC and .NET also presents similar content together with links to other resources.

Finally, an example of integration can also be found on the [TodoMVC](http://todomvc.com/examples/typescript-angular/#/) project website which has the overall goal of comparing different JavaScript MV* framework by implementing the same application with each.
