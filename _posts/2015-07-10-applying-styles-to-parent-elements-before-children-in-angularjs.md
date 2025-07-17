---
title: Applying styles to parent elements before children in AngularJS
date: 2015-07-10 00:00:00 Z
categories:
- Tech
author: rwilliams
layout: default_post
summary: Sizing advanced components such as grids using ng-style can leave you with
  rendering problems. Here, I create a variant of ng-style with some small tweaks
  to avoid this problem.
---

The ng-style directive is used to apply inline styles to an element. Using it to apply a width and a height to an element containing a [ui-grid](http://ui-grid.info/) will cause the grid to be incorrectly sized. The container element is the one with the red border below.

<img src='{{ site.baseurl }}/rwilliams/assets/2015-07-10-ng-style/problem.png' title="Incorrectly sized grid" />

This problem can occur when any advanced component that does some internal programmatic styling is used as a descendant of an ng-styled element. It's caused by the container element not having its styles applied when the grid is initialised, due to the order in which Angular runs the different initialisation phases of directives.

Many such components monitor their size and restyle their internals when resized, but that often causes a visible jump from the initial render to the correct size, and is needless expense.

When creating directives, the default place to do any linking beyond Angular's data binding is in the directive's post-link (commonly referred to as "link") function. At this point, data binding will be complete, and child directives will have finished linking. It's also where most of Angular's built-in directives do their custom logic - including ng-style.

Because post-link functions are run from the bottom up (as Angular traverses back up the DOM after traversing down to compile each directive), the element won't have it's ng-style styles applied when the grid renders.

To avoid this issue, we can create a custom directive that applies the styles in the pre-link function. These functions are run top-down, so the styles will be applied to the parent element before the descendants link. Here's our new directive:

{% highlight javascript %}
app.directive('slngStylePrelink', function() {
    return {
        compile: function() {
            return {
                pre: function($scope, element, attr) {

                    // from angular.js 1.4.1
                    function ngStyleWatchAction(newStyles, oldStyles) {
                        if (oldStyles && (newStyles !== oldStyles)) {
                            forEach(oldStyles, function(val, style) {
                                element.css(style, '');
                            });
                        }
                        if (newStyles) element.css(newStyles);
                    }

                    $scope.$watch(attr.slngStylePrelink, ngStyleWatchAction, true);

                    // Run immediately, because the watcher's first run is async
                    ngStyleWatchAction($scope.$eval(attr.slngStylePrelink));
                }
            };
        }
    };
});
{% endhighlight %}

The only other difference compared to [ng-style](https://github.com/angular/angular.js/blob/v1.4.1/src/ng/directive/ngStyle.js) is that we're calling `ngStyleWatchAction` directly in the post-link function, rather than relying on the `$watch`'s first run to apply the initial styles. This is because that first run is asynchronous.

After replacing `ng-style` with `sl-ng-style-prelink` in our view, the grid now renders correctly within the container:

<img src='{{ site.baseurl }}/rwilliams/assets/2015-07-10-ng-style/solution.png' title="Correctly sized grid" />

Take a look at [this Plunker](http://plnkr.co/edit/67VByRQK65GoLdAlkZb2?p=preview) for the surrounding code and live demo.

I've only encountered this problem when using ng-style, but there will be cases where the same behaviour of directives such as ng-class cause the same problem. I don't see a reason why the shipped versions of these directives couldn't work in the way described in this post.






















