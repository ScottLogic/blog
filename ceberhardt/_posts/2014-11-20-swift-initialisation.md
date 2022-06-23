---
author: ceberhardt
title: Swift Initialization and the Pain of Optionals
title-short: Swift Initialization Options
layout: default_post
summary: >-
  Swift's strict initialisation process results in a number of practical issues,
  leaving developers scratching their heads. This post explores a few solutions
  including two-phase initialisation, the use of optionals and lazy properties. 
summary-short: >-
  Swift's strict initialisation process results in a number of practical issues,
  leaving developers scratching their heads.
image: ceberhardt/assets/featured/options.jpg
image-attribution: >-
  image courtesy of <a href="https://www.flickr.com/photos/laenulfean/">Carsten
  Tolkmit</a>
tags:
  - featured
oldlink: 'http://www.scottlogic.com/blog/2014/11/20/swift-initialisation.html'
disqus-id: /2014/11/20/swift-initialisation.html
categories:
  - Tech
---

Swift's strict initialisation process results in a number of practical issues, leaving developers scratching their heads. This post explores a few solutions including two-phase initialisation, the use of optionals and lazy properties.

## Introduction

Swift is an opinionated language. It is clear that it was designed with strictness and safety in mind.

One of the more radical features of this language is that it doesn't permit nil references.

<img src="{{ site.baseurl }}/ceberhardt/assets/SwiftStrict.png" />

Unlike most other mainstream languages you have to explicitly opt-in to nil via the use of optionals. Whilst this sounds like a very sensible concept it has a knock-on effect to the seemingly simple task of initialising objects.

You'll find questions cropping up all over
[StackOverflow](http://stackoverflow.com/questions/24021093/error-in-swift-class-property-not-initialized-at-super-init-call), [Reddit](http://www.reddit.com/r/swift/comments/288b08/initializing_a_property_with_the_need_of_self/) and [Twitter](https://twitter.com/erynofwales/status/506105166831972352) where developers are baffled by the simplest task of how to initialise the properties of a class.

Let's take a look at this problem ...

## Strictness bites

When you first start programming in Swift you will no doubt discover that it is very fussy about where you initialise the properties of a class. Here's a quick example:

{% highlight csharp %}
class ViewController: UIViewController {
  private let animator: UIDynamicAnimator

  required init(coder aDecoder: NSCoder) {
    // ERROR: Property 'self.animator' not initialized at super.init call
    super.init(coder: aDecoder)
    animator = UIDynamicAnimator(referenceView: self.view)
  }
}
{% endhighlight %}

One of Swift's rules is that you must initialise all the properties of a class before initialising the superclass. This avoids issues that can arise if a super initialiser calls a method which is overridden resulting in inconsistent state. For a simple illustration of the issue, take a look at [this gist](https://gist.github.com/qnoid/1499fb8e0e344f706e00).

OK ... so let's shift it before the super.init call:

{% highlight csharp %}
class ViewController: UIViewController {
  private let animator: UIDynamicAnimator

  required init(coder aDecoder: NSCoder) {
    // use of property 'view' in base object before super.init initializes it
    animator = UIDynamicAnimator(referenceView: self.view)
    super.init(coder: aDecoder)
  }
}
{% endhighlight %}

Unfortunately you cannot use the `view` property of the superclass before there super initializer has been invoked.

The restrictions illustrated by these examples are a direct result of Swift's [two-phase initialisation process](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Initialization.html) and the associated safety checks.

So, what next? How about taking a two-phase approach; first initialising the UIDynamicAnimator, then setting the reference view after the superclass has been initialised?

{% highlight csharp %}
class ViewController: UIViewController {
  private let animator: UIDynamicAnimator

  required init(coder aDecoder: NSCoder) {
    animator = UIDynamicAnimator()
    super.init(coder: aDecoder)
    // ERROR: Cannot assign to the result of this expression
    animator.referenceView = self.view
  }
}
{% endhighlight %}

Unfortunately the `referenceView` property is read only, so that isn't going to help much. Furthermore, accessing the `view` property of a view controller within the initialiser is unsafe, it results in an `NSInternalInconsistencyException` being thrown as it attempts to load the view.

**NOTE:** There is nothing inherently wrong with the code above, and in some cases a two-phase approach of initialisation and configuration will work just fine. Just not in this case ... and numerous others!

## Options, options, optionals

When faced with this problem, (as most Swift developers are, on a daily basis!) there are a number of different techniques that can be used to circumnavigate this restriction.

Let's take a look at some of them.

### Make the property a variable

If you're new to Swift, your first thought might be to change the property from being a constant (`let`), to a variable (`var`):

{% highlight csharp %}
private var animator: UIDynamicAnimator
{% endhighlight %}
Recall that table at the start of this post? That's right, Swift doesn't support nillable references. All properties, regardless of whether they are constants or variables, must be initialised.


### Make the property an optional variable

Swift doesn't allow nil references, but similar behaviour is possible via optionals. One practical solution to this problem it to change the property type to an optional `UIDynamicAnimator?`:

{% highlight csharp %}
class ViewController: UIViewController {
  private var animator: UIDynamicAnimator?

  required init(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    animator = UIDynamicAnimator(referenceView: self.view)
  }
}
{% endhighlight %}

Notice that the `UIDynamicAnimator` is now initialised within `viewDidLoad` where it is safe to access the `view` property.

This works, but is not an ideal solution. We've gone from a constant property to an optional variable property. Furthermore, whenever you use the property, you have to do the usual 'unwrapping' dance:

{% highlight csharp %}
if let actualAnimator = animator {
  actualAnimator.addBehavior(UIGravityBehavior())
}
{% endhighlight %}

You could of course use a forced unwrapping:

{% highlight csharp %}
animator!.addBehavior(UIGravityBehavior())
{% endhighlight %}

Or call the method through an optional chain:

{% highlight csharp %}
animator?.addBehavior(UIGravityBehavior())
{% endhighlight %}

All three of which are pretty nasty!

### Make the property an implicitly un-wrapped optional variable

Another potential solution is to change the property type to an implicitly unwrapped optional `UIDynamicAnimator!`:

{% highlight csharp %}
class ViewController: UIViewController {
  private var animator: UIDynamicAnimator!

  required init(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    animator = UIDynamicAnimator(referenceView: self.view)
  }
}
{% endhighlight %}

The subtle difference here is that you can now pretend that this property isn't an optional, and invoke methods directly:

{% highlight csharp %}
animator.addBehavior(UIGravityBehavior())
{% endhighlight %}

But let's face it, this isn't much better that the earlier solution.

I am firmly of the opinion that no language designer in their right minds would dream up the concept of implicitly unwrapped optionals! Their sole reason for existence is the need to interop with Objective-C, a language which permits nil references and as a result where almost anything *could* be nil.

I see implicitly unwrapped optionals as a legacy-support concept and avoid them where possible.

### Lazy stored properties

Lazy properties are an interesting language feature, where a property value is initialised the first time it is accessed. You can make a property lazy by simply adding the `lazy` keyword:

{% highlight csharp %}
lazy private var animator =  UIDynamicAnimator()
{% endhighlight %}

Notice that the lazy property uses the `var` keyword, hence it is a variable and can be re-assigned.

Unfortunately you cannot pass values to the initialiser, as a result the following will not compile:

{% highlight csharp %}
lazy private var animator =  UIDynamicAnimator(referenceView: self.view)
{% endhighlight %}

However, you can use a closure expression to initialise the lazy property:

{% highlight csharp %}
class ViewController: UIViewController {
  lazy private var animator: UIDynamicAnimator = {
    return UIDynamicAnimator(referenceView: self.view)
  }()

  required init(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    animator.addBehavior(UIGravityBehavior())
  }
}
{% endhighlight %}

When the animator property is first accessed, the closure is invoked, which results in the construction of the `UIDynamicAnimator`. The closure in this example is a simple one-liner, but more complex initialisation is entirely possible.

In my opinion this solution is an improvement on those that require the use of optionals, and one which I have used myself on a number of occasions. However it is far from perfect:

Firstly, the `animator` property is still a variable, when conceptually it is a constant.

Secondly, lazy properties are initialised when they are first accessed. If the initialisation logic has side-effects (for example it changes the view), you have to be careful about where and when this initialisation takes place.

## Conclusions

Whilst Swift's two-phase initialisation was designed with safety in mind, it has resulted in some tricky problems for developers, often forcing us into a slightly uncomfortable usage of optionals.

I do feel that lazy properties provide a slightly more palatable solution, although they are far from perfect.

I am sure there are other techniques that can be employed to overcome this issue. If you have any ideas, please share them in the comments below.

Regards, Colin E.
