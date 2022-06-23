---
author: soneill
title: Introducing the MEAN stack
summary: Taking a look at a new fullstack Javascript web application framework.
tags:
  - mongo
  - express
  - angular
  - node
  - javascript
image: soneill/assets/featured/mean-carousel.png
categories:
  - Tech
layout: default_post
source: site
title-short: MEAN.IO
summary-short: An introduction to MEAN.IO
oldlink: "http://www.scottlogic.com/blog/2014/11/21/introducing-the-mean-stack.html"
disqus-id: /2014/11/21/introducing-the-mean-stack.html
---

In this post I’ll go over what the MEAN stack is and how easy it is to setup and develop with. Hopefully this will give you enough of a taste to try it yourself. The post will cover the following topics :

- ###What is MEAN.IO
- ###Installation
- ###Hello, World! in MEAN.IO
- ###Developing with the MEAN.IO stack

<br>
<br>
<br>
<br>
<br>
<br>

<h2 style="text-indent: -9999px; background-image:url('{{ site.baseurl }}/soneill/assets/2014-11-21-introducing-the-mean-stack/what-header.png'); height:265px; background-repeat: no-repeat; background-position: center;" class="aligncenter">What is MEAN.IO</h2>


Mean.io is a full stack, Javascript, [web application framework](http://en.wikipedia.org/wiki/Web_application_framework). Full stack means that we're involved in each level of the application, so that's database + server + front end + UI. There are other stacks but MEAN.IO stands out in it's use of Javascript at every level. This means that you can reduce context switching, use a common data format and common tools. The name mean.io is an acronym of its constituent parts:

- MongoDB
- Express.js
- AngularJS
- Node.js

Let’s take a quick look at each technology and why it’s in the stack. Although the order above forms a nice acronym, we’ll address them in a conceptually more appropriate order:

<br>
<br>

<img title="mongodb" class="alignleft" src="{{ site.baseurl }}/soneill/assets/2014-11-21-introducing-the-mean-stack/mongologo.svg"/>
MongoDB is a NoSQL Database. It's designed for storing non-relational data. It's included in the stack because it's queried using JSON and can persist objects as serialized JSON, making it ideal for Javascript clients. It's fast, cheap and flexible, suited for simpler applications. [more info](http://www.mongodb.org/)

<br>
<br>

<img title="node" class="alignleft" src="{{ site.baseurl }}/soneill/assets/2014-11-21-introducing-the-mean-stack/nodelogo.svg"/>
Node is a runtime environment for server-side applications. Node is useful as it allows the server to push to the client over websockets, helping to create responsive web applications. It was included in the stack to as it provides the server-side processing and it's applications are written in Javascript. It also brings npm, a package popular package manager, to the party. [more info](http://nodejs.org/)

<br>
<br>

<img title="express" class="alignleft" src="{{ site.baseurl }}/soneill/assets/2014-11-21-introducing-the-mean-stack/express.png"/>
Express is a lightweight Node.js web application framework. Node provides a http module by default but it's very low level. Express wraps this up to provide simple get/post methods and other routing. In the stack, it glues everything together... and it's also written in Javascript (Are you seeing the theme yet?).[more info](http://expressjs.com/)

<br>
<br>

<img title="angular" class="alignleft" src="{{ site.baseurl }}/soneill/assets/2014-11-21-introducing-the-mean-stack/angularlogo.svg"/>
AngularJS is the front end, UI and client side logic of the stack. The application's structure is defined in HTML and extended by AngularJS directives. Control logic is nicely separated into Controllers which are easy to re-use and organize. Angular brings a lot to bear in reducing complexity but at the cost of less control. [more info](https://angularjs.org/)

<br>
<br>
<br>

<h2 style="text-indent: -9999px; background-image:url('{{ site.baseurl }}/soneill/assets/2014-11-21-introducing-the-mean-stack/install-header.png'); height:206px; background-repeat: no-repeat; background-position: center;" class="aligncenter">Install MEAN.IO</h2>

### Installing dependencies

- Git (version control) [download](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

- MongoDB [download](http://docs.mongodb.org/manual/installation/). MongoDB can be tricky to setup. On Debian, it’s simply an apt-get but on Windows it requires download and installation, followed by running the MongoDB service. [MongoDB’s guide](http://docs.mongodb.org/manual/installation/) covers these variations in detail. You can also skip this and create a remote database on [MongoLab](https://mongolab.com/welcome/). Just update the MongoDB URL in `config/env/development`.

- Node [download](http://nodejs.org/download/)

- Bower - a package manager, [more info](http://bower.io/).
{% highlight javascript %}
    $ npm install -g bower
{% endhighlight %}
- Grunt - a build tool, [more info](http://gruntjs.com/).
{% highlight javascript %}
    $ npm install -g grunt
{% endhighlight %}

### Installing MEAN.IO
{% highlight javascript %}
    $ sudo npm install -g mean-cli
{% endhighlight %}

### Creating a MEAN.IO project
{% highlight javascript %}
    $ mean init <myApp>
    $ cd <myApp> && npm install
{% endhighlight %}

Okay, so you've run some commands from a blog, what has it done? If you check the command line output you'll notice that `$ mean init` created a default project, with structure, code and config, by cloning a git repo. The project's external dependencies were then installed using `$ npm install`. Inside the new project you'll find the following folders.

1. __bower__ :
  The bower folder contains some of the front end libraries that are used. These are angular, a few default angular modules, [bootstrap](http://getbootstrap.com/) and [jquery](http://jquery.com/). Bower is handled by our build file that we'll introduce later.

2. __config__ :
  This contains our Express config, our list of bower assets and an `env` folder. The `env` folder contains configuration files for each stage, production, development and test. This means we can use different URLs, logins and database config when building the project.

3. __node_modules__ :
  This folder contains more external libraries that are needed or helpful. There's too many to go through but I'd recommend checking out [passport](http://passportjs.org/) the authentication module and [mongoose](http://mongoosejs.com/), the node-to-mongoDB database connector.

4. __packages__ :
Mean provides more structure by dividing features out into packages. These are found under the packages folder. This is where you'll add your code when you start to develop the stack. You'll notice there's already some features provided by MEAN.IO's project scaffolding.
  * _access_ - authentication handling code, for intercepting requests, routing them to an auth provider and handling the callback.
  * _articles_ - the default CRUD functionality. Great for understanding the data flow and basic web application structure.
  * _contrib_ - awesome admin control for your application. Allows an admin to update config, themes and database from the front end UI
  * _system_ - logic and ui for the index page and navigation header
  * _users_ - out of the box user management, handles forgotten passwords, sign up, login and the usual boilerplate.

### INSIDE A MEAN.IO PACKAGE

__app.js__
Contains the feature's meta config, such as menu items.

__public (the front end)__
- assets - CSS and images go here
- controllers - the front end processing
- routes - routes to each view
- services - angular wrappers for data providers
- tests - karma tests
- views - the HTML for each page

__server (the back end)__
- controllers - the back end processing
- models - the data object's definitions
- routes - routes to the controllers, from get/posts...
- tests

You'll notice the similarities between the front end and back end. You might also notice that it appears to be a MVC structure. Angular considers itself MVW, 'Model View Whatever', as it's not quite MVC. In either definition though, the separation of concerns makes the project easier to navigate and understand, which is critical in Javascript applications.

<br>
<br>
<br>

<h2 style="text-indent: -9999px; background-image:url('{{ site.baseurl }}/soneill/assets/2014-11-21-introducing-the-mean-stack/hello-header.png'); height:243px; background-repeat: no-repeat; background-position: center;" class="aligncenter">Hello, World! In MEAN.IO</h2>

With all this default structure and code, where do we jump in and start coding? Let's be original and create a website that displays 'Hello World'.

Open the file `packages\system\public\views`, this is the HTML description of the index page. We're navigating into `system` as it handles the front page and menu navigation. We're going into `public` as it holds the front end logic and UI. We're going into `view` as that's where the pages are defined in HTML. Grab all the stuff inside the `<section>` element and delete it. Then type `Hello, World!`. It should look like:
{% highlight html %}
  <section class="welcome container-fluid" data-ng-controller="IndexController">
    Hello, World!
  </section>
{% endhighlight %}

Now, we'll build and run the application. You'll find the build file, Gruntfile.js, at the top level of the project. Run grunt and go to [http://localhost:3000](http://localhost:3000) to see it in action
{% highlight javascript %}
    $ grunt
{% endhighlight %}

Wait what just happened? Let’s take a look in the build tool's configuration file. We can see the tasks registered at the bottom with each of their steps listed. Running grunt without a parameter actually calls
{% highlight javascript %}
    $ grunt default
{% endhighlight %}

Which we can see is comprised of 'clean', 'jshint', 'csslint' and 'concurrent'. Tracing those steps through the config file shows us, bower components(angular, bootstrap etc) are built, our Javascript is validated by [jshint](http://www.jshint.com/), our CSS by [csslint](http://csslint.net/) and a watch task is setup up to check for changes and serve without a restart. You can find out more about grunt [here](http://gruntjs.com/). You can also run the tests, [karma](http://karma-runner.github.io/0.12/index.html) for the front end and [mocha](http://mochajs.org/) for the back end, just by calling
{% highlight javascript %}
    $ grunt test
{% endhighlight %}

You’ll also notice the environment variable, `NODE_ENV`, which can be set or checked by grunt to use different build tasks, config and even databases.

If you got lost or stuck take a look at the official [MEAN.IO guide](http://learn.mean.io/) to installation for full details. It's worth taking a look around the site at this point and see how the example CRUD feature, articles, works.

<br>
<br>
<br>

<h2 style="text-indent: -9999px; background-image:url('{{ site.baseurl }}/soneill/assets/2014-11-21-introducing-the-mean-stack/develop-header.png'); height:200px" class="aligncenter">Developing the mean stack</h2>

The default app involves creating articles which only members can see. It also shows every article to every user. Let's add some extra functionality to the default app that shows us the structure of the stack. Here’s our token [user story](https://en.wikipedia.org/wiki/User_story) to rectify that.

> As a user, I would like to be able to publish the best articles for public consumption.

This breaks down into the following tasks :
1. list all articles on the front page
2. add a filter to the front page to only display published articles
3. add a 'published' state to the article model
4. add a mechanism and UI to change the published state of an article
5. make the articles private to a user if not published
6. update the sites styling
7. deploy the application

### 1. list all articles on the front page
We’ll clean out the MEAN.IO propaganda from the front page by copying the contents of `packages/articles/public/view/list.html` into `packages/system/public/view/index.html`. The code we just 'borrowed' is a view which lists articles. It contains some article data and two buttons for modifying the article. Make sure to remove the `H1` element at the bottom for creating new articles as we don't want that behaviour on the front page.

### 2. add a filter to the front page
Now we restrict the articles on the front page to those that are published. Go to the html file for the front page, `packages/system/public/views/index.html` and change the element
{% highlight html %}
    <li data-ng-repeat="article in articles">
{% endhighlight %}
to
{% highlight html %}
    <li data-ng-repeat="article in articles | filter: {published: true}">
{% endhighlight %}
`ng-repeat` is an Angular directive that uses the tagged element and it's children as a template for displaying each article in the list called articles. A list comprehension is added that filters out articles that don't have a 'published' field equal to 'true'.

### 3. add a 'published' state to the article model
The front page will be empty now as all of the articles will be filtered out. Let’s add a `published` field to the article model in the database.
find the file `packages/articles/server/models/articles.js` and add the following to the existing properties

{% highlight javascript %}
    published: {
         type: Boolean,
         required: false,
         default: false
    },
{% endhighlight %}

This really highlights why we're using MongoDB, using JSON to specify the model is simple and easy to understand.

### 4. add a way to change the published state of an article
Articles are now not published by default so we need a mechanism to edit the state. Let’s add a button to each article that toggles its published state. Go to `packages/system/public/view/index.html` and add the following button

{% highlight html %}
    <a class="btn" data-ng-click="publish(article);">
          <i class="glyphicon glyphicon-ok"></i>
    </a>
{% endhighlight %}
You'll notice it looks like the other buttons but calls a different function. `glyphicon` is a CSS class used to add an image to the button; it's included as part of bootstrap. We now need to add the function to the controller. Go to the ArticlesController, located at `packages/articles/public/controller/articles.js` and add the following :

{% highlight javascript %}
    $scope.publish = function(article) {
         if (article) {
              article.published = !article.published;
              article.$update();
         }
    };
{% endhighlight %}

Now the button can be clicked on each article to change its published state. If you take a look around the controller a bit more you’ll see the update, remove and add functionality. The publish functionality is just a mix of existing CRUD functionality. With this we can publish articles to the front page and view them without logging in. However, If we add a new user we notice that the first user’s articles are appearing under the private article list.

### 5. making the user’s articles private
Go to `packages/articles/app.js` and change the title from ‘Articles’ to ‘My Articles’. This updates the button in the menu and makes it clear to the user that their articles are private. We’d like to restrict the listed articles on that page to those that belong to the current user. If we look in the ArticlesController, we can see the reference to the current user in the `hasAuthorization()` function. We’ll create a synonym for the current user into the ArticlesController to keep it clean.

{% highlight javascript %}
  $scope.currentUser = $scope.global.user;
{% endhighlight %}

We’re currently using the same controller for both the front page and private page. The data is loaded using the `find()` function in ArticleController. Let’s load different data for the private page.
Change the `find()` function in ArticleController to

{% highlight javascript %}
$scope.find = function(user) {
      Articles.query(function(articles) {
          $scope.articles = user ? articles.filter(function(article) {
              return article.user._id === user._id;
          }) : articles;
      });
 };
{% endhighlight %}

This means that if a user is provided, the function should remove articles that do not belong to that user. Go to `packages/articles/public/views/list.html`. Update the call to find by providing the currentUser we just placed in scope.

{% highlight html %}
  <section data-ng-controller="ArticlesController" data-ng-init="find(currentUser)">
{% endhighlight %}

### 6. update the styling

Now that we have some new functionality, let’s be a real full stack developer and update the UI. Bootstrap comes with MEAN.IO so let’s override the default values and make the heading a bright colour. You’ll find the index page’s CSS in `packages/system/public/assets/css/common.css`. Just add the following and use your favourite colour as the heading background

{% highlight css %}
  .navbar-inverse {
      background-color: #D55D8A;
  }
  .navbar-inverse .navbar-brand {
      color: white;
  }
  .navbar-inverse .navbar-nav > li > a {
      color: white;
  }
{% endhighlight %}

At this point, it would be nice to have some admin control. Luckily, this is provided out of the box by MEAN.IO. Simply update a user in the mongo database by adding a role, “admin”. This allows that user to manage the app, its settings, change the theme dynamically for all users, add and edit other users. Also, the admin is authorized to edit, remove and publish/unpublish any article. Check the `hasAuthorization()` function in ArticleController to see why.

### 7. Deploying the application
Now that we have a minimal viable product, you can deploy it. MEAN.IO leans towards [heroku](http://mean.io/blog/2014/01/installing-mean-io-on-heroku-from-a-to-z/), a cloud platform for running applications, but anything node-based should work. For this blog post I’ve developed and deployed the example using [cloud 9](https://c9.io/) another cloud based service that provides a browser IDE and linux kernel.
Database hosting such as [mongolabs](https://mongolab.com/) is free. You can update the database’s URL and other settings in `config/env/development`.

## Conclusion
This blog demonstrated how to change
* front end logic
* front end ui
* data model
* styling

It should have also given you a taste of Angular.

In the end, MEAN.IO is just a tool. If you require a fast, easy, simple way to create a modern, responsive, dynamic web site then MEAN.IO would be a great solution. If you've followed the steps this far, creating your responsive website only requires a quick `mean init ...`

__Sean__
