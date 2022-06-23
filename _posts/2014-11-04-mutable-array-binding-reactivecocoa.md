---
title: Binding mutable arrays with ReactiveCocoa
date: 2014-11-04 00:00:00 Z
categories:
- ceberhardt
- Tech
author: ceberhardt
layout: default_post
summary: This post describes a binding helper that allows you to bind arrays directly
  to table views with ReactiveCocoa. In this update to my previous post, the helper
  is extended to support mutable arrays.
oldlink: http://www.scottlogic.com/blog/2014/11/04/mutable-array-binding-reactivecocoa.html
disqus-id: "/2014/11/04/mutable-array-binding-reactivecocoa.html"
---

A few months ago I wrote a wrote about a utility class that allows you to [bind ReactiveCocoa view models to table views]({{ site.baseurl }}/2014/05/11/reactivecocoa-tableview-binding.html). With this binding helper, each item in the view model array is automatically bound to a cell. The binding helper also automatically updates the table view if the array property on the view model is updated.

Since publishing this binding helper, I've had  number of people ask me how to handle view model properties which are mutable arrays. This presents a bit of a problem; you can certainly use the binding helper with `NSMutableArray` properties, however, there is no way to observe an array for changes, making it impossible to know when to update the UI.

In this update, I've introduced a new class, `CEObservableMutableArray`, a mutable array that supports observers. When used as part of a view model, the binding helper is able to automatically update the UI when items are added / removed / inserted etc ...

## A quick example

This example shows how the binding helper can be used to render a dynamic list of stock prices. Every second the list is randomly updated, with prices changing, new items being added and some being removed or updated.

Here's the example in action:

<img src="{{ site.baseurl }}/ceberhardt/assets/quotes.gif" />

The view model for this application is very simple, each item within the list is backed by the following view model:

{% highlight objc %}
＠interface QuoteViewModel : NSObject

＠property (strong, nonatomic) NSString *symbol;

＠property (strong, nonatomic) NSNumber *price;

＠end
{% endhighlight %}

The 'top level' view model contains an array of these items as follows:


{% highlight objc %}
＠interface QuoteListViewModel : NSObject

＠property (nonatomic, strong) CEObservableMutableArray *quotes;

＠end
{% endhighlight %}

Notice that the `quotes` property uses the `CEObservableMutableArray` type.

The cell, which has its UI defined in a nib, adopts the `CEReactiveView` protocol:

{% highlight objc %}
＠interface QuoteTableViewCell : UITableViewCell<CEReactiveView>

＠end
{% endhighlight %}

The implementation of this protocol is used to bind each `QuoteViewModel` to their respective cell:

{% highlight objc %}
＠implementation QuoteTableViewCell 

- (void)bindViewModel:(id)viewModel {
  QuoteViewModel *quoteViewModel = (QuoteViewModel *)viewModel;
  
  self.symbolLabel.text = quoteViewModel.symbol;
  
  // bind the price property, converting it from a number to a string
  [[RACObserve(quoteViewModel, price)
    takeUntil:self.rac_prepareForReuseSignal]
    subscribeNext:^(NSNumber *x) {
      self.priceLabel.text = [numberFormater stringFromNumber:x];
    }];
}

＠end
{% endhighlight %}

The `symbol` property of the view model is constant and the view just takes the initial state. The `price` property is dynamic, as a result `RACObserve` is used to observe changes to the property (via KVO). Because cells can be recycled, we want to stop observing changes to the associated view model when recycling occurs. The simplest way to achieve this is to use the ReactiveCocoa `takeUntil` operation to 'terminate' the signal at the point of recycling.

Finally, the view controller that renders the quotes list is bound to the `QuoteListViewModel` using the binding helper

{% highlight objc %}
＠implementation QuoteListViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  
  // create the view model
  _viewModel = [QuoteListViewModel new];

  // bind the table view to the list of quotes
  UINib *nib = [UINib nibWithNibName:＠"QuoteTableViewCell" bundle:nil];
  [CETableViewBindingHelper
      bindingHelperForTableView:self.quotesTableView                
                   sourceSignal:RACObserve(_viewModel, quotes)
               selectionCommand:nil
                   templateCell:nib];
}
＠end 
{% endhighlight %}

The binding helper takes care of informing the table view when items are added / removed / replaced, triggering the required animations.

## Summary

If you are using ReactiveCocoa for MVVM hopefully you will find this a useful little addition to your toolbox. 

The binding helper code and the example illustrated above are [available on GitHub](https://github.com/ColinEberhardt/CETableViewBinding).

Regards, Colin E.























