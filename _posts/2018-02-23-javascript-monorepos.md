---
title: JavaScript Monorepos
date: 2018-02-23 00:00:00 Z
categories:
- Tech
tags:
- JavaScript,
- Node,
- NPM,
- Lerna,
- monorepo
author: mamos
layout: default_post
summary: I found splitting JavaScript applications into separate packages within a
  single source tree difficult, until I found a tool called Lerna.
---

When working in Java or Scala, I'm used to the code repositories I work with consisting of multiple sub projects with dependencies between them. This enables each project to focus on one thing only, simply, and with limited dependencies. Any common code used by multiple sub projects can be extracted into a common one.

A common term for such multi-project code repositories is a monorepo.

This monorepo approach is not the only one. Each project could have its own repository and build its own artefacts, mirroring the structure declared in dependency management tools like Ivy or the relevant parts of Maven. In practice the monorepo approach is better.

Google agree and have one of the most extreme examples of a monorepo. The ACM describe [Google's setup](https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext). This article lists the advantages of the approach, which I won't duplicate. 

### Monorepos and Npm

Working on a recent JavaScript and Node.js project, I had some code that it made sense to share between the server and client sides. I decided to split my project up into multiple packages in one code repository.

Npm is a widely used package manager for JavaScript. It uses a package.json configuration file for each package, just as a POM file for Maven might be used in Java.

Npm doesn't have the same facilities for handling a monorepo setup [like Maven](http://books.sonatype.com/mvnref-book/reference/pom-relationships-sect-pom-best-practice.html). So I investigated the capabilities it does have.

### Npm local dependencies

My first discovery was that the dependencies declared in a package.json file can contain [local dependencies](https://docs.npmjs.com/files/package.json#local-paths). This allows e.g. my server package to depend on my common package using a relative file path.

Assuming I have this repository layout:

~~~
    + project-dir
        + server-package
            - package.json
        + common-package
            - package.json
~~~

Then in the `server-package/package.json` file I can declare the dependency on the `common-package` like this:

~~~
  {
    ...
    dependencies: {
      "common-package": "file:../common-package",
      ...
    }
  }
~~~

Npm is smart, and instead of copying the files from the common-package, and its installed dependencies i.e. `common-package/node_modules`, it creates a symlink.

#### Problem 1: Duplicated dependencies

If both the server and common packages depend on the same package, something like [Jasmine](https://jasmine.github.io/) for their unit tests, then we end up with two copies of the same dependency. This can cause issues, e.g. when trying to set breakpoints when debugging, as well as being inefficient, especially at scale.

I was able to remove this problem in my limited case, by removing the dependency from the server package, and relying on the common package's dependency. Unfortunately, to make this work, I had to add the common package's `node_modules` to the `NODE_PATH` of all the tools I ran. Node's [package resolution algorithm](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders) searches up the file tree looking for `node_modules`, but not down it.

#### Problem 2: Can't publish packages with local dependencies

The Npm documentation for [local dependencies](https://docs.npmjs.com/files/package.json#local-paths), points out that the feature is useful for local offline testing, but is not suitable for published packages.  That precludes their effective use in a monorepo.

### Lerna

[Lerna](https://github.com/lerna/lerna) is a tool that has been built to make monorepos work for JavaScript. In this article I am going to concentrate on how it enables you to work with monorepos, but it also gives you tools to control the versioning and publishing of packages from your monorepo.

#### Setting up Lerna

Installing Lerna is easiest done using Npm. I installed it globally so that the command line `lerna` command is available. In the root directory of your monorepo you can run <span style="white-space: nowrap">`lerna init`</span>. This will result in your monorepo looking like this:

~~~
    + project-dir
        + server-package
            - package.json
        + common-package
            - package.json
        - lerna.json
        - package.json
~~~

The `package.json` declares the monorepo's dependency on lerna, and the `lerna.json` file configures lerna. Lerna's default setup is to expect all your packages to live under a `packages` folder, but that didn't match my setup, so I changed the default to:

~~~
  {
    "lerna": "2.8.0",
    "packages": [
      "server-package",
      "common-package"
    ]
  }
~~~

I then also needed to change the `server-dir/package.json` file to use the version number from the `common-package/package.json`, like this:

~~~
  {
    ...
    dependencies: {
      "common-package": "^0.0.1",
      ...
    }
  }
~~~

With this config in place, I deleted the existing `node_modules` folders from my earlier attempts and ran <span style="white-space: nowrap">`lerna bootstrap`</span>. This single command installed the dependencies for both of the packages and created the symlink from the `server-package/node_modules/common-package` to the `common-package` directory.

#### Duplicated Dependencies

With Lerna we have solved problem 2 from above, we can use a monorepo and have a `package.json` file that is also suitable for publishing your packages, but we still have problem 1; common dependencies in your packages result in multiple copies in your working space.

Lerna can help us solve that problem too. There is an option for Lerna called hoist e.g. <span style="white-space: nowrap">`lerna bootstrap --hoist`</span>. When that option is set all common dependencies, i.e. same package name and version, are all pulled up to the `project-dir/node_modules` level. Since Npm's [package resolution algorithm](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders) ascends the file tree looking for dependencies, these will still be correctly resolved.

Note that you can also add dependencies that you expect to be common across all subprojects in the root directory's `package.json` and it will be available to all of the others. An example would be a linting tool.

#### Making your monorepo easier for others to use

One neat trick that can make things easier for others to use your monorepo is to add a post install script to the root `package.json` that invokes lerna. For example I added:

~~~
  {
    ...
    "scripts": {
      "test": "lerna run test"
    }
  }
~~~

This way, when your colleague pulls your code, all they need to do is to run `npm install` and they will download and run Lerna, bootstrapping all of the packages.
  
#### Invoking scripts across all projects at once

Another thing that you can do to make it easier to use the monorepo is to ask Npm to get Lerna to run tasks for you across all projects. Here I show how you can run `npm test` at the root level and have Lerna run the tests in all the child packages. It can even run arbitrary commands for you, here I somewhat pointlessly illustrate that by printing the current working directory of all the packages.

~~~
  {
    ...
    "scripts": {
	  "test": "lerna run test",
	  "listDirs": "lerna exec -- node -p \"process.cwd()\"",
  	  "postinstall": "lerna bootstrap"
    }
  }
~~~

#### Publishing

The purpose of this post was to highlight how developers can work on monorepos more easily with Lerna, but since we are all DevOps now, I should give publishing packages a mention.

Lerna was originally designed to take the version number from the root `package.json` and publish all the packages in the monorepo with it. It was also used in a manual way, prompting you to ask if you want to update the version, and whether you are really sure that you do want to publish.

Since then it has grown up to facilitate use in a continuous integration environment. Command line flags can specify the version number explicitly and skip the prompts.

There is a problem left here with Lerna. [Semantic versioning](https://semver.org/) is a popular approach to working out what the next version number should be, showing you immediately how extensive changes to a package are. In our monorepo, we may have a release that only makes minor changes to some packages and major breaking ones to others. It isn't possible to use Lerna's fixed behaviour and retain semantic versioning of all the packages.

Lerna does have an `--independent` option when publishing. In this mode it will prompt you for version numbers of all the packages, so that they can vary independently. Alas, this is currently [not possible](https://github.com/lerna/lerna/issues/389) to set via command line flags and so unsuitable for CI.

For now, my preference when setting up CI is to use Lerna to unify the build and test of my packages, but not to use it for publishing.
  
### Conclusion

Using Lerna and hoisting is awesome. I have inter-package dependencies working, no duplicated dependencies, and Lerna even symlinks the `.bin` directory of the `node_modules` to ensure that command line tools like Gulp or Jasmine still work. It also lets you work with the monorepo on the macro scale when it makes sense too.

There is one note of caution though. Since all packages in your monorepo will be able to resolve dependencies of any of the others, it is quite easy to accidentally miss declaring one. I would recommend not hoisting as part of your CI build to catch this, and only hoist in your dev environment.
