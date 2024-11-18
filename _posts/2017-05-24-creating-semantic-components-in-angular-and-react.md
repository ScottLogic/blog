---
title: Creating semantic components in Angular and React
date: 2017-05-24 00:00:00 Z
categories:
- Tech
author: nowen
summary: Using two of the currently most popular web frameworks I'll demonstrate how to create semantic looking code.
layout: default_post
---

This post is to compare, what I would say are, the two currently most popular web front-end frameworks: [React](https://facebook.github.io/react/) and [Angular](https://angular.io/).

A direct comparison across all their features would be too large a task, so this post will focus specifically on creating components to increase readability and code reuse throughout the codebase.

The example will demonstrate with a simple component: one that renders a page in a defined structure. It'll contain a section for any header material (including the page title), and for the body.

_Note: I'll be referring to all new versions (post v1) of Angular as "Angular", as per [this release](http://angularjs.blogspot.co.uk/2016/12/ok-let-me-explain-its-going-to-be.html), given we're currently on version 4 with version 5 to come this year._

## The React page

We'll leverage React's inherent composability, passing `children` through as prop-types, to create semantic and bite-size components.

### The components

Starting with a simple [build](https://github.com/owennw/react-semantic-component/blob/master/webpack.config.js) we can quickly get a React application up and running, rendering a simple `App` component back to the DOM.

~~~javascript
// index.js
import React from 'react'
import { render } from 'react-dom'

import App from './app'

render(
  <App />,
  document.getElementById('root')
)
~~~

Now let's create the `Page` components that we'll use inside `App`.

Firstly the concept of the Page itself is rather simple:

~~~javascript
export function Page({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}
~~~

All it needs to do is act as a container for its content.

As mentioned we want to manage the header and title, so that can come up next:

~~~javascript
export function Header({ title, children }) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
}
~~~

Again this is a simple wrapper. The point here is two-fold:

* To make consuming components easy to read (which we'll see later), and
* To make this functionality common across the application.

Making this structure common allows us to modify each and every page's structure, or title, in a single testable location.

Finally let's draft up our concept of a side-header and the body:

~~~javascript
export function SideHeader({ children }) {
  return (
    <div>{children}</div>
  )
}

export function Body({ children }) {
  return (
    <div>{children}</div>
  )
}
~~~

These might look very similar now, but later we'll be adding small changes that allow these to diverge.

Now these are in place, let's use them.

### Using the components

Our `App` component can now be written.

~~~javascript
// app.js
import React from 'react'

import { Page, Header, SideHeader, Body } from './page/Page'

export default function App() {
  return (
    <Page>
      <Header title="React Page">
        Extra header content lives here.
        <SideHeader>
          Side header content lives here.
        </SideHeader>
      </Header>
      <Body>
        Lorem ipsum dolor sit amet, adipisci maluisset efficiantur ut nec. Ea cum epicuri suscipit appareat. Sit et dico mazim deseruisse, recusabo definitiones mea ne. Ignota accumsan nec ad, cu vel modus senserit dignissim, mel probatus expetenda ei.

        Vel ei amet commune definitionem, has an scripserit conclusionemque. Sit eu autem vivendo ullamcorper, nam an quando partem. Timeam consetetur reprehendunt ut usu, verear singulis mel at. No ius facer partem, vel solum iudico molestiae in. Corrumpit molestiae abhorreant ut per, te magna luptatum sea. At velit labitur vis.

        Quando cetero no cum, natum mundi suavitate at duo. Omnis oblique in cum, eu vix assum nullam. Delicata salutatus ad sit. Vim et veri platonem, per deleniti copiosae singulis id. Vim nobis dicam percipitur id.

        Omnes numquam vivendo ex sit. Ei pri consul explicari voluptatibus, viris vitae te vix. Per meliore repudiandae accommodare id, noster philosophia qui te, ei mei oblique habemus. Dolore epicurei duo no, nam no tamquam eligendi temporibus, ut unum minimum his. Usu et nisl augue.

        In sit noster persius mandamus, ne abhorreant suscipiantur deterruisset sed. Vel cu ceteros imperdiet concludaturque. Has quot definitionem ex. Vel in homero iudicabit euripidis, quo inimicus moderatius ne.
      </Body>
    </Page>
  )
}
~~~

Here we can see that the layout is obvious -- whether content is contained in the body, header or side-header is immediately clear, and using React's `children` injecting content into each component is a cinch. This actually reads pretty similarly to how the page will show!

To show-off the benefits of this structure let's add some styling.

### Styling

Let's add some classes to our common `Page` components, so we end up with:

~~~javascript
// Page.js
import React from 'react'

import styles from './Page.css'

export function Page({ children }) {
  return (
    <div className={styles.page}>
      {children}
    </div>
  )
}

export function Header({ title, children }) {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      {children}
    </div>
  )
}

export function SideHeader({ children }) {
  return (
    <div className={styles.sideHeader}>
      {children}
    </div>
  )
}

export function Body({ children }) {
  return (
    <div className={styles.body}>{children}</div>
  )
}
~~~

Notice how the `SideHeader` and `Body` components now differ.

_N.B. You may want to extract each of these functions into separate files in the same folder. I haven't here for brevity._

And if we now apply some styling:

~~~css
// Page.css
.page
  margin: 0 50px
  width: 1280px

.header
  margin-bottom: 30px
  color: blue

  h1
    color: #444

.sideHeader
  float: right
  color: red

.body
  color: green
~~~

we can see the final result.

<img src="{{ site.baseurl }}/nowen/assets/semantic-components/semantic-components-page-react.jpg" alt="React page" />

## Angular

To achieve a similar development experience we need to leverage Angular's multiple transclusion. Those familiar with AngularJS (or Angular 1) might remember "transclusion" as a magic allowing some fancy DOM manipulation -- Angular has kept a similar concept.

### The components

As we did with the React app, we can quickly get [something running](https://github.com/owennw/angular2-semantic-component/blob/master/config/webpack.common.js) with Angular, so let's go straight into the components.

The consumer of the semantic common components looks like this:

~~~html
// home.component.html
<page>
  <page-header [title]="'Angular Page'">
    Extra header content lives here.
    <page-side-header>Side header content lives here.</page-side-header>
  </page-header>
  <page-body>
    Lorem ipsum dolor sit amet, adipisci maluisset efficiantur ut nec. Ea cum epicuri suscipit appareat. Sit et dico mazim deseruisse, recusabo definitiones mea ne. Ignota accumsan nec ad, cu vel modus senserit dignissim, mel probatus expetenda ei.

    Vel ei amet commune definitionem, has an scripserit conclusionemque. Sit eu autem vivendo ullamcorper, nam an quando partem. Timeam consetetur reprehendunt ut usu, verear singulis mel at. No ius facer partem, vel solum iudico molestiae in. Corrumpit molestiae abhorreant ut per, te magna luptatum sea. At velit labitur vis.

    Quando cetero no cum, natum mundi suavitate at duo. Omnis oblique in cum, eu vix assum nullam. Delicata salutatus ad sit. Vim et veri platonem, per deleniti copiosae singulis id. Vim nobis dicam percipitur id.

    Omnes numquam vivendo ex sit. Ei pri consul explicari voluptatibus, viris vitae te vix. Per meliore repudiandae accommodare id, noster philosophia qui te, ei mei oblique habemus. Dolore epicurei duo no, nam no tamquam eligendi temporibus, ut unum minimum his. Usu et nisl augue.

    In sit noster persius mandamus, ne abhorreant suscipiantur deterruisset sed. Vel cu ceteros imperdiet concludaturque. Has quot definitionem ex. Vel in homero iudicabit euripidis, quo inimicus moderatius ne.
  </page-body>
</page>
~~~

with an [accompanying shell component class](https://github.com/owennw/angular2-semantic-component/blob/master/src/home/home.component.ts) to hook up the HTML.

Immediately we see the structure is very similar to the React version. The components have had to be prefixed by "page-" as they're selectors and we don't want to clash with the native HTML `header` and `body`. There's also a little more of Angular getting in the way with its syntax `[title]="'Angular Page'"`, but it's quite light touch.

Diving into the components themselves, first we have the `page.component`

~~~html
// page.component.html
<div class="page">
  <ng-content></ng-content>
  <div class="body">
    <ng-content select="page-body"></ng-content>
  </div>
</div>
~~~

This looks quite different from the React `page`, as we have to define the HTML structure here and include placeholders for what's to come. The `ng-content` allows the injection of DOM elements and is the Angular method of transclusion. In this case it is taking all of the header content.

We have a real looking angular component, `page-body` being used above in `home.component.html`, but this is really just a veneer across the `ng-content` and its selection. Using a `select="page-body"` we can limit where the content is injected into this `page.component`, so that only the body contents are included in the correct place. This way no new component needs to be written.

However, in the case of the `page-header` we _do_ need a new component, as it itself will take transcluded content.

~~~html
// page-header.component.html
<div class="header">
  <h1>{{"{{title"}}}}</h1>
  <ng-content></ng-content>
  <div class="sideHeader"><ng-content select="page-side-header"></ng-content></div>
</div>
~~~

Again we need to set-up the correct placeholders for the correct content to be injected. This time the top `ng-content` is allowing for extra header material to be added.

In both of these components we demonstrate multiple transclusion -- a fancy way of stating that there are multiple `ng-content`s allowing for different injection points. And as above, the `page-side-header` is not a real and registered Angular component, solely an entry point for the named content.

Wrapping this all up with the same stylesheet as before yields:

<img src="{{ site.baseurl }}/nowen/assets/semantic-components/semantic-components-page-angular2.jpg" alt="Angular page" />

As we can see this page is identical in layout when rendered.

#### Notes

This page component has been wrapped up in an [Angular Module](https://github.com/owennw/angular2-semantic-component/blob/master/src/components/components.module.ts) for better exposure and re-use. As well as this the [NO_ERRORS_SCHEMA](https://angular.io/docs/ts/latest/api/core/index/NO_ERRORS_SCHEMA-let.html) has had to be imported and used in the [app.module](https://github.com/owennw/angular2-semantic-component/blob/master/src/app/app.module.ts) to prevent build errors with the unrecognised tags `page-header` etc.

## Summary

It's been demonstrated here that both frameworks allow for semantic components to control duplication and page layout, producing the same end result.

In my opinion Angular's multiple transclusion model yields a steeper learning curve against leveraging React's composability. The `ng-content` syntax is less readable to my eyes, and requires a clearer defined structure in which to consciously inject content. However once that's abstracted away in the component I'd say that the consuming components are just as readable as their React counterparts.

While in React I had to create more components, their simplicity and small size doesn't make it much of a hurdle at all. They are all equally readable and extendable, and don't produce much clutter.

The Angular structure forces the consumers to 'do the right thing'. If a `page-side-header` were placed inside the `page-body` then it would not be rendered, as it only belongs to the `page-header` (however if it were to become a separate component in its own right it would start to work). The React approach allows any component to be inserted anywhere in the structure, so requires more of a 'good faith' with the developer to make sure they don't abuse the components (though this should be a clear mistake to see a header inside the body).

All in all a framework choice will most likely not come down to this issue, but it's good to know that the solutions are there in both!


Nick


The code for the React page is [here](https://github.com/owennw/react-semantic-component), and the Angular page is [here](https://github.com/owennw/angular2-semantic-component).
