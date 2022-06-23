---
author: alee
title: Single Page Applications - Angular vs Knockout
image: alee/assets/featured/chess.jpg
categories:
  - Tech
summary: "A comparison of Angular and Knockout in an enterprise scale single page application, by building the same sample application with both tools."
layout: default_post
oldlink: "http://www.scottlogic.com/blog/2014/07/30/spa-angular-knockout.html"
disqus-id: /2014/07/30/spa-angular-knockout.html
---


A few weeks ago I finished working on a project that made extensive use of Knockout. It wasn't a Single Page Application (SPA), but Knockout allowed us to create a very rich and engaging user experience. During my time on the project, I had seen blogs and posts mentioning Angular as an alternative to Knockout, and colleagues had asked me whether I would consider Angular in future projects. It was time for me to learn more about Angular.

I discovered that while Angular and Knockout are very different, they're both excellent tools for building SPAs, and the solutions ended up being quite similar.

"Angular is great - it works with plain old JavaScript objects, so you don't need to clutter your code with 'observables'" (paraphrased), but it doesn't take long to realise that Angular and Knockout aren't very similar at all. Knockout is a tool for binding your model to the view, and automatically updating the view when things change. Angular does this too, but it also does much more. In fact Angular is more like a framework for building an SPA. It implements hashtag routing for different page views, and an MVC pattern for wiring up controllers and models. It also has its own modules and dependency injection to help you build an application at enterprise scale.

Knockout doesn't have any of that, but then it isn't supposed to. Instead, it gets out of the way so you can plug in other tools to do those tasks. Recently, Steve Sanderson gave a great talk at <a href="http://bris.tech/">Bristech</a> showing how well this can work (and also demonstrating the new "Components" feature in the preview version). You can see the talk at the <a href="https://www.youtube.com/watch?v=UyQNARf2bQs">Bristech YouTube Channel</a>.

If I'm going to compare Angular with Knockout, then I need to plug in some of these other tools to make it a fair comparison. I think my title needs updating:

## Angular vs Knockout + CrossroadsJS + RequireJS

I decided to follow Steve's example, using yeoman to scaffold out an SPA with Knockout, <a href="http://millermedeiros.github.io/crossroads.js/">CrossroadsJS</a> and <a href="http://requirejs.org/">RequireJS</a>. CrossroadsJS implements hashtag routing, and RequireJS handles module loading and dependencies.

For my Angular project, I used <a href="https://github.com/angular/angular-seed">angular-seed</a>, which is a skeleton of an Angular app with everything you need to quickly get up and running. I added Bootstrap (to match the scaffolded Knockout project), and tweaked it to look the same as the bare bones Knockout version.

I wanted to build a sample application using both tools. It had to be simple enough to be completed relatively quickly, but still interesting enough to make good use of the main features of both tools. It needed multiple pages, and I also wanted a dashboard-like screen with several loosely coupled components that automatically respond to user input.

I chose a simple investment portfolio, showing a list of investments with transactions, and some related charts. You can filter the investments by name, and can also click through on each investment to view additional details.
The finished project is on GitHub: <a href="https://github.com/DevAndyLee/Angular-vs-Knockout/">Angular-vs-Knockout</a>, with a live demo of both versions of the app here:

The <a href="{{ site.baseurl }}/alee/assets/spa-an-ko/Knockout/index.html" target="_blank">Knockout version</a>, and the
<a href="{{ site.baseurl }}/alee/assets/spa-an-ko/Angular/index.html" target="_blank">Angular version</a>.

Try entering text into the filter box, and clicking on individual investments. Here's an example screenshot (the Knockout and Angular versions look identical, other than the title):

<a href="{{ site.baseurl }}/alee/assets/spa-an-ko/Knockout/index.html" target="_blank">
	<img src="{{ site.baseurl }}/alee/assets/spa-an-ko/SampleApp.png"/>
</a>

## Getting Started

Both projects use Node Package Manager (npm), so <a href="http://nodejs.org/">Node</a> is a prerequisite.

### Knockout Project

Getting the Knockout project going was surprisingly easy. Steve Sanderson's talk goes through the process in detail, so I won't reproduce that here, but here are the commands to install Yeoman and scaffold the project:

    npm install -g yo
    npm install -g generator-ko
    yo ko

That gives you a simple project with routing and two initial views (Home and About pages). Adding additional views and components can be done manually, but Yeoman also provides a shortcut command:

    yo ko:component <name>

### Angular Project

For the Angular project, I cloned it from angular-seed, then used npm to pull in all the dependencies:

    git clone https://github.com/angular/angular-seed.git
    npm install

## Modules

When developing an enterprise web application, some sort of module loading system is very important. It allows us to decouple all the various parts of the application, and helps stop the project from becoming an unmanageable mess.

Angular builds up the application by adding modules, which have dependencies on other modules and so on. Each module can implement Angular features such as Controllers, Directives and Filters. I really like the powerful dependency injection system that injects services and other objects and makes unit testing easy.

The scaffolded Knockout project uses RequireJS for module loading, which works a bit differently. RequireJS follows the dependencies and dynamically loads the necessary JavaScript files, so you don't need to explicitly reference them in the main HTML page (unlike the Angular solution). Module dependencies are injected into the modules that need them, but we don't have the flexibility of Angular's dependency injection container.

It's also possible to use RequireJS with Angular, but I won't try to cover that here.

## Navigation / Views

Hash-tag routing means we can navigate around the SPA using the part of the URL after the '#'. Using the hash-tag for navigation means that the browser automatically records the history for us, so clicking the back button should do what the user expects it to.

In the Angular project, the routes are configured like this:

    {% highlight js %}
    $routeProvider.when('/investment/:id', {
        templateUrl: 'partials/investment-page.html',
        controller: 'InvestmentPageCtrl'
    });
{% endhighlight %}

We've got "/home", "/about" and "/investment" routes for the three main pages in the sample application. The "/investment" route also takes a parameter to identify the investment id. Each route specifies the controller that will be invoked and the template page to use.

Hooking that up to the view is easy with Angular's ng-view directive:

    <div id="page">
        <div ng-view></div>
    </div>

In the Knockout version, the scaffolded project includes a "suggested" implementation of routing:

    {% highlight js %}
    { url: 'investment/{id}', params: { page: 'investment-page' } }
{% endhighlight %}

The accompanying code configures CrossroadsJS from the list of routes. The page name corresponds to the registered component that implements the page, and the component pulls in its template as a dependency.

The view uses the 'component' binding to render the correct component based on the current route (note that components are currently a preview feature of Knockout):

    <div id="page" data-bind="component: { name: route().page }"></div>

## Components

I want to build the home page up from loosely coupled components, but they must still talk to each other. For example, when I type in the search text box, the other components should automatically update themselves.

<img src="{{ site.baseurl }}/alee/assets/spa-an-ko/PropogateFilter.png"/>


In both projects I've created a "searchModel" object to represent the filter specification (in this case just a simple text query on the investment name). The searchModel is a service that can be injected into the home page, and passed to each of the components as a parameter.

In Angular, I create a component by defining a Directive, which in this case gives me a custom DOM element. The Directive loads it's own template into the DOM and has its own Controller. For example, for the filter component:

    {% highlight js %}
    angular.module('testSPA.investmentFilter', [])
        .directive('investmentFilter', function () {
            return {
                restrict: 'E',
                scope: { search: '=' },
                templateUrl: 'partials/investment-filter.html',
                controller: 'InvestmentFilterCtrl'
            };
        })
        .controller('InvestmentFilterCtrl', ['$scope', function ($scope) {
            // $scope.search is the searchModel instance
            // ...
        }]);
{% endhighlight %}

The 'scope' parameter of the directive allows me to pass the 'search' parameter through to the controller. Setting 'restrict' to 'E' means I can include the component in the home page using a custom element like this:

    <investment-filter search="search"></investment-filter>

The controller for the home page has a property "search" in its scope, so the "search" parameter in the above line passes that property through to the component.

In Knockout, the components feature does the same thing:

    {% highlight js %}
    define(['knockout', 'text!./investment-filter.html'], function(ko, templateMarkup) {
        function InvestmentFilter(params) {
            this.search = params.search;
        }
        return { viewModel: InvestmentFilter, template: templateMarkup };
    });
    ko.components.register('investment-filter', {
        require: 'components/investment-filter/investment-filter'
    });
{% endhighlight %}

In this case, the component parameters (including the searchModel) get passed in as a parameter to the constructor function. Knockout also supports custom elements, so including it in the home page looks very similar:

    <investment-filter params="search: search"></investment-filter>

Knockout components are currently a preview feature, and they're pretty neat. When used with RequireJS, it's also smart enough to only load the JavaScript and template files when the component is actually used.

### Binding to controls

The investment filter component contains a text box which is bound to the 'name' parameter of the search model. I also wanted the binding to delay updates slightly - i.e. when the filter changes we'll be triggering ajax requests to do some analysis, so we don't want that to happen too often while the user is still typing.

In Angular, we use the ng-model attribute to bind the text box, and the 'debounce' option gives us the delayed updates. The searchModel itself is implemented as a service:

    <input type="search" id="investmentFilter" placeholder="Filter Investments"
        ng-model="search.name"
        ng-model-options="{ debounce: { default: 500, blur: 0 } }">

    {% highlight js %}
    .service('searchModel', function SearchModel() {
        this.name = '';
        this.json = function () {
            return { name: this.name };
        };
    })
{% endhighlight %}

In Knockout, the value binding is used. The searchModel uses an observable, with a computed observable for the 'json' property (so I can easily add more filtering properties in future). To delay updates I've used Knockout's 'rateLimit' extension on the computed observable:

    <input type="search" id="investmentFilter" placeholder="Filter Investments"
        data-bind="value: search.name, valueUpdate: 'afterkeydown'">

    {% highlight js %}
    function SearchModel() {
        this.name = ko.observable('');
        this.json = ko.computed(function () {
            return { name: this.name() };
        }, this).extend({ rateLimit: 500 });
    };
{% endhighlight %}

### Filters and custom bindings

Displaying raw data values on the screen is no good. The values must be formatted so they look like dates and currency and percentages etc. Angular uses 'filters' for this task, which is a simple function that takes a value and returns a modified result. The built in date and currency filters are ok, but I still ended up creating my own custom filters because I wanted custom formatting without having to set the formatting options everywhere the filters were used (in case I decide to change the formatting in the future).

In Angular, a custom date filter using <a href="https://github.com/jquery/globalize">Globalize</a> looks like this:

    {% highlight js %}
    .filter('customDate', ['dateFilter', function (dateFilter) {
        return function (text) {
            return Globalize.format(new Date(Date.parse(text)), 'D');
        };
    }])
{% endhighlight %}

The Knockout version does the same thing with a custom binding:

    {% highlight js %}
    ko.bindingHandlers.date = {
        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).text(Globalize.format(new Date(Date.parse(value)), 'D'));
        }
    };
{% endhighlight %}

### Reacting to model changes

When the search model changes (i.e. a user has typed in the search box), the other components need to make ajax requests for analysis based on the updated model.

In Angular, we 'watch' a variable in the scope, giving it a callback function to do the analysis. Angular has a 'digest' process that checks the values of watched variables in the scope object, and calls any registered callbacks when something has changed.

    {% highlight js %}
    $scope.$watch('search.name', function () {
        backEndServer.analysis($scope.search.json()).then(function (data) {
            $scope.investments = data;
        });
    });
{% endhighlight %}

In this case I've injected the service 'backEndServer', which is a proxy for making the ajax request to the server. When the ajax call completes, it simply applies the data to the controller's scope so it can be rendered.

For the purposes of this sample app, 'backEndServer' is actually a mocked server, which doesn't actually make any ajax requests. Instead, it simulates a response by calling back with some data after a short delay. Mocking the server just means I can easily have a live demo, since I don't need to host an actual server anywhere.

Here's the corresponding HTML to display the data in a table:

    <tbody>
        <tr ng-repeat="investment in investments" ng-click="showInvestment()">
            <td>{{"{{"}}investment.name}}</td>
            <td>{{"{{"}}investment.startDate | customDate}}</td>
            <td>{{"{{"}}investment.holdingPeriod | duration}}</td>
            <td>{{"{{"}}investment.investedAmount | customCurrency}}</td>
            <td>{{"{{"}}investment.returnAmount | customCurrency}}</td>
            <td>{{"{{"}}investment.returnOnInvestment | percent}}</td>
        </tr>
    </tbody>

In Knockout, the same sort of thing is done by subscribing to an observable. This is a wrapper around a value, with a method to register functions to call when the value changes. We also have to implement a 'dispose' function for the component to make sure the subscription gets disposed of properly, or else we'd have a memory leak:

    {% highlight js %}
    var getInvestments = function () {
        $.getJSON('http://localhost:54361/analysis',
            params.search.json(), this.investments);
    };

    getInvestments.call(this);
    var subscription = params.search.json.subscribe(getInvestments, this);

    this.dispose = function () { subscription.dispose(); };
{% endhighlight %}

My Knockout project makes ajax requests via jQuery, so I've used jQuery.Mockjax to mock out the server. Here's the Knockout table:

    <tbody data-bind="foreach: investments">
        <tr data-bind="click: $parent.showInvestment">
            <td data-bind="text: name"></td>
            <td data-bind="date: startDate"></td>
            <td data-bind="duration: holdingPeriod"></td>
            <td data-bind="currency: investedAmount"></td>
            <td data-bind="currency: returnAmount"></td>
            <td data-bind="percent: returnOnInvestment"></td>
        </tr>
    </tbody>

### Binding data to charts

I've written some <a href="http://d3js.org/">D3</a> code to render and animate bar and column charts, so now I want to bind the data to the charts.

In Angular, this can be done as a Directive, which allows me to attach custom behaviour to a DOM element. Here's a simplified version of the 'chart' directive, using a 'link' function:

    {% highlight js %}
    .directive('chart', [function() {
        var link = function link(scope, element, attrs) {
            // Create the chart object bound to the element
            var chart = new SVGBarChart(element[0]);
            // The data is passed in as an attribute of the directive
            scope.$watch(attrs.chart, function (value) {
                chart.setData(scope[attrs.chart]);
            });
        };
        return { link: link     };
    }])
{% endhighlight %}

Then we can put the chart in the component using a simple div, where 'sectors' is a property of the controller's scope containing the data:

    <div chart="sectors"></div>

The Knockout version uses a custom binding to do the same thing in a slightly different way:

    {% highlight js %}
    ko.bindingHandlers.chart = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            // Create the chart object bound to the element
            $(element).data('chart', new SVGBarChart(element));
            ko.bindingHandlers.chart.update(element, valueAccessor);
        },
        update: function (element, valueAccessor) {
            // The data is passed via valueAccessor
            var data = ko.unwrap(valueAccessor());
            $(element).data('chart').setData(data);
        }
    };
{% endhighlight %}

Adding the chart is equally simple:

    <div data-bind="chart: sectors"></div>

In the completed project, I've expanded on the chart directive and binding to provide a more generic method for binding to multiple types of chart (bar and column charts are implemented).

## Unit testing

Both projects come with unit testing already configured, using Jasmine and Karma. Great! Unit testing is one area that really benefits from tools like Angular and Knockout, because we can concentrate on testing the controllers and models, without having to worry about what's happening to the DOM. Karma is a command line test runner, so it's easy to integrate with a continuous integration build process. The Knockout project also has a browser-based test runner, which makes it a lot easier to debug failing tests.

We're interested in how easy it is to write unit tests, and create mocked behaviour or inject mocked dependencies.

In Angular, we can load the module we want to test easily in a 'beforeEach' step:

    {% highlight js %}
    beforeEach(module('testSPA.investmentsComponent'));
{% endhighlight %}

The test will need to create a test target (the controller), with the test scope and a mocked 'backEndServer'. To do that we need to inject some services into a setup function. Here we use a Jasmine 'spy' to create a mocked analysis function that responds asynchronously, and inject it into a new instance of our test target along with a test scope.

    {% highlight js %}
    var controller, scope, backEndServer;
    beforeEach(inject(function ($rootScope, $controller) {
        backEndServer = {
            analysis: jasmine.createSpy().andCallFake(function (params) { return {
                then: function (fn) {
                    setTimeout(function () { fn([{ name: 'i-1' }]); }, 10);
                }
            };})

        };
        scope = $rootScope.$new();
        scope.search = { json: function () { return { name: 'f-1' }; } };

        // Create the test target with the scope and mocked server
        controller = $controller('InvestmentsComponentCtrl', {
            $scope: scope, backEndServer: backEndServer });
    }));
{% endhighlight %}

If you're making ajax requests directly by injecting the $http service, then Angular will let you mock responses by injecting $httpBackend into your test setup. Now we can test the controller with an asynchronous test:

    {% highlight js %}
    it('should initialise and load full investments list', function (done) {
        // Trigger the server request
        scope.$digest();

        // Wait for it to finish
        setTimeout(function () {
            // Check that the server was called and we saved the correct data
            expect(backEndServer.analysis).toHaveBeenCalledWith({ name: 'f-1' });
            expect(scope.investments).toEqualData([{ name: 'i-1' }]);

            // Let Jasmine know the test has completed
            done();
        }, 20);
    });
{% endhighlight %}

In Knockout, we need to use RequireJS to load the test target and dependencies:

    {% highlight js %}
    define(['investments-component', 'jquery-mockjax'],
        function ($, ko, investmentsComponent) {
            // Test code...
        });
{% endhighlight %}

This has the undesirable effect of using the real dependencies instead of mocked versions. However, there are dependency injection libraries for RequireJS, which should solve this problem. In my case, I can use jQuery MockJax to mock the server requests like this:

    {% highlight js %}
    $.mockjax({
        url: 'http://localhost:54361/analysis', data: { name: 'f-1' },
        responseTime: 10, responseText: [{ name: "i-1" }]
    });
{% endhighlight %}

The following test creates a test target with a mock search model, and checks that the server was called and the data was saved:

    {% highlight js %}
    it('should initialise and load full investments list', function (done) {
        var search = { json: ko.observable({ name: 'f-1' }) };
        var instance = new InvestmentsComponentViewModel({ search: search });

        setTimeout(function () {
            expect(instance.investments()).toEqual([{ name: "i-1" }]);
            done();
        }, 20);
    });
{% endhighlight %}

The Angular documentation also advocates building end-to-end (e2e) tests, and the project comes with some sample tests to start with. They use Protractor to run the site in a browser and verify behaviour. I won't try to cover e2e testing in this post, but as the site is identical between the Angular and Knockout versions, the same e2e tests should work in both versions.

## Packaging and optimisation

At the moment our Angular website makes thirty two requests to serve the home page, and the Knockout version makes thirty nine. These are mostly JavaScript modules, but also css files and templates. For production we need to package up all these files and minify them to optimise the website.

The Knockout project comes with packaging already configured, using <a href="https://github.com/gulpjs/gulp/">Gulp</a>. It can follow the RequireJS dependencies to automatically find the necessary JavaScript files that need to be bundled up and minified. A really cool feature is the ability to create separate 'bundles'. You can put all the components for the home page in the main bundle, since we know they will always need to be loaded. For the other pages (e.g. the About and Investment pages), you can create separate bundles, and the Gulp task will automatically work out the necessary dependencies and bundle them together. At runtime, the bundles for those pages will only be loaded when the user navigates to them. For a large scale application, this is a brilliant feature that should help get the initial application loading faster without having to download a load of stuff the user might not need.

Here's a quick taste of a Gulp task that replaces the css and JavaScript links in 'index.html', then minifies and writes it to the 'dist' folder:

    {% highlight js %}
    gulp.task('html', function() {
        return gulp.src('./src/index.html')
            .pipe(htmlreplace({
                'css': 'css.css',
                'js': 'scripts.js'
            }))
            .pipe(minifyHTML({ empty: true, quotes: true }))
            .pipe(gulp.dest('./dist/'));
        });
{% endhighlight %}

My Knockout application now only needs four minified files (the glyph-icons are just there for the icon in the filter box):

<img src="{{ site.baseurl }}/alee/assets/spa-an-ko/ServedFilesKO.png"/>


The Angular project didn't have any of this, so I decided to create my own using Gulp. It's easy enough to package together all the JavaScript files and minify them, but that still leaves all the partials (several of which need to be downloaded for the home page thanks to the components). Luckily there are solutions to this problem. I used gulp-angular-templatecache to preload the templates and insert them into Angular's TemplateCache, so that it doesn't have to download them. The resulting JavaScript file can then be bundled with the others. In a similar approach to the Knockout project, I have only bundled the partials needed for the home page, so the others are loaded on demand. This isn't quite as good as the Knockout version, since we still have to load all the JavaScript for the application in one bundle, but it should still help a bit in a large application.

<img src="{{ site.baseurl }}/alee/assets/spa-an-ko/ServedFilesAN.png"/>


## Animation

Other than the D3 charts, I haven't tried to do much with animation. It's an important subject though, and worth a mention.

Angular has good support for animated transitions, including between pages. You can do this via CSS classes or JavaScript and jQuery.

In Knockout, animated transitions can be built using custom bindings and jQuery. The easy example in the Knockout documentation is a fadeVisible binding (fade elements in and out so they don't instantly appear or disappear). For page transitions, we'd need to replace the 'component' binding with a custom binding that does the same thing but with an animation step. Knockout Components are still in preview though, so it's possible this may change before release.

## Conclusion

Both Angular and Knockout (with CrossroadsJS and RequireJS) are brilliant tools for building enterprise scale single page applications. My sample application looks and behaves identically in the two versions, and the development process was pretty smooth in both cases. I'd certainly be more than happy working with either of them.

There are a few differences between the two solutions, but they are fairly minor. Angular was more verbose in some cases (creating a component from a directive and a controller), but the Knockout version was more verbose in others (watching for model changes and getting data from the server). Angular is a fully integrated solution. Knockout lets you choose the best tools to solve your problems, but you have to integrate them yourself.

If you don't like having Knockout's observables all over your JavaScript code, then you'll probably lean towards Angular. Personally, I'm used to observables, so I don't mind them at all. I appreciate having direct control over when and where I'm changing something that will trigger updates to other objects and the view. I also like how RequireJS pulls in dependencies, and can build specific packages for different parts of the SPA. On the other hand, I like the MVC pattern used by Angular, and the dependency injection system, and the ability to easily create mocked dependencies in tests.

While there are pros and cons to both solutions, I still don't have a clear preference for either Angular or Knockout. At least I can be confident that neither one would be the wrong choice.
