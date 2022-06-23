---
title: Variable scopes in Postman
date: 2020-09-04 00:00:00 Z
categories:
- sbulut
- Testing
author: sbulut
layout: default_post
summary: Variables allow you to store and reuse values in your requests and scripts.
  Storing a value in a variable allows you to reference it throughout your environments
  and collections. It’s also practical because if you want to update a value, you
  have to change it only in one place. There are a few types of variables in Postman
  and might be confusing where to use which so in this blogpost I will try to explain
  that.
---

A variable is a symbolic name for - or a reference to - information. The variable’s name represents what information the variable contains. Variables allow you to store and reuse values in your requests and scripts. The type of variables in Postman might be confusing as there are quite a few of them, such as environment variables, collection variables, data variables etc. Similar to working with variables in other programming languages, in Postman, all variables conform to a specific hierarchy. 

Scope is nothing but the accessibility of a variable. Using variables within specific scopes allows you to reuse values efficiently. All variables defined in the current iteration take precedence over the variables defined in the current environment, which overrides the ones defined in the global scope.

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/1.png' />

# Variable types in Postman

## Global

Global variables are available to all requests available in the Postman console regardless of which collection they belong to. These variables are general purpose variables and, as a best practise, should mostly be avoided: otherwise, you’ll get a crowded global space and you won’t know which variable belongs to which API.

When you click on the eye icon next to environment dropdown, a context window will be opened with details around the current global variables. By clicking edit you can create a new global variable by entering a name and an initial value.

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/2.png' />

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/3.png' />

If you want to get something running and don’t want to worry about which variable you should use at the moment, if you are exploring an API for example, you can go for global variables initially. Once you understand how your API is supposed to work, remove any variables as soon as you don’t need them : *pm.globals.unset(‘myVariable’);*

**Tip**: If you want to clear all the variables, you can use *pm.globals.clear();*

## Environment

Environment variables have narrower scope than global variables. If your collection needs to run against different servers, such as localhost, test server, pre-prod and prod, you can easily switch environments. Even if you have one server / API only, it might still be useful to use environment variables as it would keep the variables away from global namespace otherwise it can get crowded. In this case, however, you can choose to use collection variables too but environment variables give you different access levels when working as a team. You can assign the same role in the workspace or configure roles, such as viewer, editor etc on an individual basis.

Environment variables should be used for environment specific information such as URLs, username and password. You should avoid mixing them with global variables, stick to environment variables and not to use one variable as a global variable and the other one as an environment variable because your scripts will be very confusing especially if you share them with teammates.

To add an environment variable, click on the eye and then add.

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/4.png' />

Add an environment name which will also show in the environment selector. Here you can enter the environment specific variables.

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/5.png' />

Now the environments are ready to be selected from the dropdown. If you hover over the url, you can see the scope and the value.

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/6.png' />

## Collection

A collection is a group of Postman requests that are related to each other. Collection variables are used to define variables at - guess where - the collection scope. Collection variables are available throughout the requests in a collection and are independent of environments, so do not change based on the selected environment.

They are useful to store any information (URLs, credentials if there’s only one environment) that doesn’t change during the request and when you export your collection, all this information will be exported with your collection.

To add a collection variable, click edit, go to the Variables tab, add your variables and update it.

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/7.png' />

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/8.png' />

## Local

Local variables are temporary and only accessible in your request scripts. Local variable values are scoped to a single request or collection run, and are no longer available when the run is complete.

One important use case of local variables is that they can be used when you want to override the values of a variable that is defined in any other scope like global, collection or environment but you don’t want the value to persist when the execution ends.

## Data

Data variables come in the context of request execution through the collection runner. Postman allows us to execute requests in a collection through the collection runner and we can provide a data set in the form of JSON or CSV that are used while running the requests inside the collection so the source of data variables is the user-supplied data file in the format of JSON or CSV. During the request execution, the data variables can only be fetched but not updated/modified or added.

Here is an end2end scenario of executing requests through the collection runner. I supplied a data file in CSV whose values are replaced while the request is getting executed.

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/9.png' />

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/10.png' />

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/11.png' />

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/12.png' />

<img src='{{ site.github.url }}/sbulut/assets/2020-09-02-variableScopes/13.png' />

## Conclusion

Postman variables allow you to store and reuse values in your requests and scripts in an effective way. Which variables you use and how you use them can benefit your testing by knowing which scope to use and when to provide a more readable and logical way of accessing data.
