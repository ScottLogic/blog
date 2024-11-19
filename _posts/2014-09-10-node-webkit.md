---
title: Writing Desktop and Web-Based JavaScript Applications
date: 2014-09-10 00:00:00 Z
categories:
- Tech
author: isullivan
layout: default_post
summary: This post demonstrates how JavaScript and HTML5 related technologies can
  be used to create an application that can run in both a web browser and as a cross-platform
  desktop application using node-webkit.
summary-short: Creating desktop and web applications from a single codebase
image: isullivan/assets/featured/hybridApp.jpg
oldlink: http://www.scottlogic.com/blog/2014/09/10/node-webkit.html
disqus-id: "/2014/09/10/node-webkit.html"
---

This post demonstrates how JavaScript and HTML5 related technologies can be used to create an application that can run in both a web browser and as a cross-platform desktop application using [node-webkit](https://github.com/rogerwang/node-webkit). It describes the tools that were used in creating a simple contact list application.

<img alt="phone list" src="{{ site.baseurl }}/isullivan/assets/phone-list.png" />

As you can see in the above screenshots, the app has been built for both the web and desktop. Both versions have the same core functionality and UI. The web version lives within a browser window and is therefore cluttered with toolbars, an address bar, various icons and a cartoon of a dog that my wife insists she has nothing to do with. The desktop version on the other hand is lean and has only a small toolbar and minimize button which are built with standard HTML elements.

node-webkit
-----------
The most common place to run JavaScript is probably the web browser. In the web browser, you have access to `window` and `document` objects, you can interact with the DOM of your web page and use various APIs such as JSON parsing and Web Sockets. It is a sandboxed, safe, child proof place to play. Another environment in which to run JavaScript is provided by Node.js. Here, you have powerful APIs, a simple module system and full access to your system with no restrictive sandbox. Node-webkit mashes these two environments together giving you the best of both - HTML5 capabilities of a browser with the powerful APIs of node. A quote from node-webkit's github page:

>node-webkit is an app runtime based on Chromium and node.js. You can write native apps in HTML and JavaScript with node-webkit. It also lets you call Node.js modules directly from the DOM and enables a new way of writing native applications with all Web technologies.

The following is an extremely simple program to show off node-webkit's capabilities. The program takes a directory path and lists the files contained within it. It uses node's `require` and also browser methods for manipulating the dom.

    <!html>
    <head>
        <title>Example Application</title>
    </head>
    <body>
        <input id="search" type="search" style="width:100%;" />
        <ul id="container">
        </ul>
        <script>
            var fs = require('fs'),
                container = document.getElementById("container");

            document.getElementById('search').addEventListener('change', function() {
                fs.readdir(this.value, function(e, files) {
                    files = files || [];
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                    files.forEach(function(file) {
                        container.innerHTML += "<li>" + file + "</li>";
                    });
                });
            });
        </script>
    </body>

This, coupled with a very modest configuration file:

    {
      "main": "index.html",
      "name": "Example Application"
    }

is enough to produce an application that node-webkit can run. Run node-webkit with the directory containing these files as an argument and you're good to go!
    
<img alt="Example application" src="{{ site.baseurl }}/isullivan/assets/node-webkit-example.png" />

Granted, it does look like a web browser but the extraneous toolbars and chrome can be hidden in the configuration file making it look much more appealing. 

Building for Web & Desktop
--------------------------
The JavaScript behind both versions is largely the same however there are some differences. The desktop version has some css styles to show the grey bar at the top, it stores the list of contacts in a file whereas the web version uses HTML5 local storage and it has code for creating a system tray item when the window is closed. The two versions are built and managed using [gulp.js](http://gulpjs.com/). Gulp is a build system for defining build tasks using code rather than configuration. The tasks in this application are largely for copying and bundling code (css/html/javascript) into the appropriate output directory.

<img alt="Gulp flow chart" src="{{ site.baseurl }}/isullivan/assets/gulp.png" />

As the tasks are written in vanilla JavaScript, they can be abstracted into shared methods. If the source is stored in a directory called `src`, the web and desktop scripts can be compiled, minified and deployed using the following gulp tasks:

    function scriptTask(additionalSourceFolder, destination) {
        var sources = ['src/app/js/common/**/*.js', additionalSourceFolder];

        return gulp.src(source)
            .pipe(uglify('app.min.js'))
            .pipe(gulp.dest(destination));
    }
    
    gulp.task('desktop-script', scriptTask.bind(null, 'src/app/js/desktop/**/*.js', './dist/desktop/');
    gulp.task('web-script', scriptTask.bind(null, 'src/app/js/web/**/*.js', './dist/web/');

Handling Differences In Code
----------------------------
The web version of this code stores the list of contacts using the HTML5 local storage API. The desktop app can go one better. It's more useful to store the list of contacts in a file that can be modified. A neat way to handle the differences between the web and desktop versions is to utilise AngularJS and its dependency injection system. In this case I want to define a 'persistence' angular service. This service can be defined once in the web folder and once in the desktop folder. The gulp task includes the correct file and the service can therefore be used transparently in the rest of the code.

js/web/persistence-service.js:

    angular.module('phoneListApp.services').factory('Persistence', [function () {
        return {
            set: function(key, string) {
                window.localStorage.setItem(key, string);
            },
            get: function(key) {
                return window.localStorage.getItem(key);
            }
        };
    }]);

js/desktop/persistence-service.js (Please excuse the lack of asynchrony):

    angular.module('phoneListApp.services').factory('Persistence', [function () {
        var fs = require('fs'),
            path = require('path'),
            homeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

        function getJsonFilePath(key) {
            return path.join(homeDirectory, key) + ".json";
        }

        return {
            set: function(key, string) {
                fs.writeFileSync(getJsonFilePath(key), string, "utf8"); 
            },
            get: function(key) {
                var fileName = getJsonFilePath(key);
                if (fs.existsSync(fileName)) {
                    return fs.readFileSync(getJsonFilePath(key), "utf8");
                }
                return null;
            }
        };    
    }]);
    
As long as as correct file is included by gulp, the web and desktop versions can be used in other Angular controllers and services without caring about the implementation details. Here's a snippet that uses the persistence service to save contacts. It may be saving to a file, it may be saving to local storage - the code using the service couldn't care less.

    angular.module('phoneListApp.services').factory('Contact', ['Persistence', function (persistence) {
        var storageKey = "phone-contacts",
            cachedContacts = null;

        function saveContacts(contacts) {
            cachedContacts = contacts;
            persistence.set(storageKey, angular.toJson(contacts));
        }
        
GUI Customisation
-----------------
The window itself can be customised in the application's configuration file. There are a lot of options but the phone list only uses four:

    {
        "window": {
            "toolbar": false,
            "frame": false,
            "width": 300,
            "height": 330
        }
    }

Node-webkit also supports a surprisingly simple interface for interacting with native gui elements at runtime. The following code adds logic for closing the phone list application to the system tray:

    var gui = require('nw.gui'),
        win = gui.Window.get();

    document.querySelector('#close-button').addEventListener('click', function() {
        var tray = new gui.Tray({ icon: 'tray.png' });
        var menu = new gui.Menu();
        menu.append(new gui.MenuItem({ label: 'Exit', click: gui.App.quit}));
        tray.menu = menu;
        win.hide();
        tray.on('click', function() {
            win.show();
            tray.remove();
        });
    });

Conclusion
----------
Desktop applications are another arrow in the web developer's quiver. Node-webkit is a great, cross-platform way to use existing web development skills without having to learn new tools, languages or frameworks.

All code is available on [github](https://github.com/iansullivan88/desktop-phone-list).























