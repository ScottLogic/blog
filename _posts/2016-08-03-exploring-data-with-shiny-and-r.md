---
title: Exploring Data - Creating Reactive Web Apps with R and Shiny
date: 2016-08-03 00:00:00 Z
categories:
- Testing
tags:
- software testing survey
- data analysis
- R programming
- software testers
- shiny
- data
author: rhamilton
title-short: Exploring Data With R and Shiny
summary: I developed a web application to enable exploration of the data collected
  by a survey of software testers. I explain how R and Shiny can be used to create
  reactive web applications which make data accessible to a wider audience.
image: rhamilton/assets/bubbles.jpg
layout: default_post
---

<img src="{{ site.baseurl }}/rhamilton/assets/bubbles.jpg" alt="title image" title="title image"/>

Back in May I taught myself a [programming language called R](https://en.wikipedia.org/wiki/R_(programming_language)) so that I could solve the problem of analysing large amounts of data collected as part of a survey of software testers.

After writing some R code to analyse the data from my survey and blogging about the findings I realised something. I was sharing my findings with other people mainly through static images, graphs and charts. I felt like there were a large number of combinations and queries that could be applied to the data and I wasn't able to document all of them. I was also aware that the target audience of the survey would likely be unable to write R code to explore the data themselves. I wanted to find a way for non-technical people to be able to explore the data created by my survey.

I decided I was going to solve this problem and the solution I chose was [Shiny](http://shiny.rstudio.com/). Shiny is a web application framework for R that turn data analyses into interactive web applications. Shiny also lets you host your completed web app in the [shinyapps.io](http://www.shinyapps.io/) cloud so they can be shared with other people.

I made a Shiny web app to explore a sample of software testers. It can currently be found at:[https://testersurvey.shinyapps.io/shiny_testers/](https://testersurvey.shinyapps.io/shiny_testers/)

The user is able to interact with check boxes and radio buttons to define a group of software testers. Data for the defined group is then displayed across multiple tabs. As the inputs are changed, the data displayed changes at the same time.

The web application makes it possible for a user to ask their own questions of the data. For example, defining the group of testers as testers which responded "No" when asked if they were happy in their current job (Setting option 4. to "No Group") and looking at the 'Positive 2' tab reveals that only 41.7% of testers in this group feel that their judgement is trusted. Now if option 4 is changed to be the "Yes group", the percentage of tester which say they feel their judgement is trusted now jumps up to 91.7%, a big increase.

While I have written a lot about the findings of the survey I conducted, I am hopeful that the creation of this Shiny web app will allow anyone interested in exploring the collected data to do so independently without the need for technical skills.

I want to take a different direction from my previous blog posts (where I have been discussing the data discovered) and instead share the process of creating a Shiny web app with R.

##Getting started with R

I would highly recommend using [RStudio](https://www.rstudio.com/) to write and execute R code. RStudio is an open-source, integrated development environment (IDE) for R that can be downloaded for free. Once downloaded and installed, R code can be typed in at the console or a new R script file can be made to hold the R code written.

R works slightly differently to other programming languages I have used (Python & Golang). The main difference with R is that it is built around vectors. A vector is simply is a sequence of data elements which share the same basic type. A bit like a one dimensional array.

R has a special function called <b><font color="B6025C"><code> c()</code></font></b> which can be used to make vectors.
The assignment operator is <b><font color="B6025C"><code>  <- </code></font></b> this is used to perform operations in R

The following code snippets can either be typed line by line or saved as an R script and executed in RStudio.

The snippet below shows how to make a vector which contains numerical values 1,2,3,4 & 5, name this vector 'numbers' and print it to the console.

<script src="https://gist.github.com/Rosalita/694e22a9d1f96e32e290042fef5c3a52.js"></script>

Output:

<b><font color="B6025C"><code> [1] 1 2 3 4 5</code></font></b>

Note, RStudio defaults to prefixing all output with line numbers, this is why the output starts with [1]

In R, when a transformation is applied to a vector, it is applied to each component in the vector. So if numbers was transformed by adding 3, this addition would take place on each component in the vector.

<script src="https://gist.github.com/Rosalita/381d62666d0604df3bce0f3641e291e9.js"></script>

Output:

<b><font color="B6025C"><code> [1] 4 5 6 7 8</code></font></b>

This vectorisation where operations are automatically applied to each component in a vector makes loop statements redundant and unnecessary in R. While it is possible to force R into loop statements, this is widely considered a bad practice, it's always better to try do things in a vectorised manner instead of forcing R into a loop.

##Data frames are created by combining vectors.

An important data structure for importing and analysing data in R is the data frame. A data frame is a rectangular structure which represents a table of data. It is essentially a list of vectors which are all of equal length.

The following R code snippet creates four vectors of equal lengths and then combines them into a data frame named hurricanes and prints hurricanes to the console

<script src="https://gist.github.com/Rosalita/db340d3de68625c3020921d1caaf44c4.js"></script>

Output:

~~~
> hurricanes
name date_of_impact highest_gust_mph power_outages
1  Abigail     2015-11-12               84         20000
2   Barney     2015-11-17               85         26000
3  Clodagh     2015-11-29               97         16000
4  Desmond     2015-12-04               81         46300
~~~

Data can be selected within a data frame by referencing rows and columns. Typing <b><font color="B6025C"><code> hurricanes[1,2]</code></font></b> on the console will return <b><font color="B6025C"><code>"2015-11-12"</code></font></b>. This is the data held in row 1, column 2 of the data frame.

It is also possible to select a row without a column value or a column without a row value. For example, <b><font color="B6025C"><code>hurricanes[,3]</code></font></b> will return all the values in column 3, the highest gust in mph.

##Queries can be applied to data using indexes.

The <b><font color="B6025C"><code> which()</code></font></b> function can be used to make an index of values which match an expression.

The following code snippet uses <b><font color="B6025C"><code> which()</code></font></b> to create an index called <b><font color="B6025C"><code> outages_index</code></font></b>. This index is a vector which contains the row numbers of the data frame where column 4, <b><font color="B6025C"><code>power_outages</code></font></b>, is greater than 25,000. The R script prints this index to the console. This index of row numbers is then applied to the data frame by assigning the data held only in those rows to a new variable named <b><font color="B6025C"><code> over_25000_outages</code></font></b>. This <b><font color="B6025C"><code> over_25000_outages</code></font></b> is then also printed to the console.

<script src="https://gist.github.com/Rosalita/8a319255d7ba5aee9b6e081315e18331.js"></script>

Output:

~~~
> outages_index <- which(hurricanes[,4] > 25000)
> outages_index
[1] 2 4
> over_25000_outages <- hurricanes[outages_index,]
> over_25000_outages
     name date_of_impact highest_gust_mph power_outages
2  Barney     2015-11-17               85         26000
4 Desmond     2015-12-04               81         46300
~~~

Data can be imported into RStudio from .csv and .xlsl formats and held in a data frame. R code can then be written to query and explore this data.

If you are interested in learning more basic R functionality the interactive lessons at [Try R](http://tryr.codeschool.com/) will let you practice by writing real R code in a few minutes

##Creating Reactive data driven web applications

All Shiny apps consist of two basic components that interact with each other, a user-interface script (ui.R) and a server script (server.R).

The user interface script ui.R lists all the front end inputs that the user can manipulate, things like radio buttons, check boxes, drop down selection lists. It also contains the names of outputs which will be displayed and the location of inputs and outputs on the page.

The server script server.R is passed input values from ui.R, executes R code using those input values and generates outputs. Outputs can be anything from a text string to graphical plot of data.

Shiny stores all the input values in a list named input and the values of outputs in a list named output. As soon as a value in the input list changes, all the values in the output list are immediately recalculated.

This means as soon as the user changes a front end input, by selecting a check box or an item from a drop down list, all of the output elements on the page update to immediately reflect the user's selection.

This is very powerful because R code is executed on demand and the results are displayed to the user as soon as they are requested.

Continuing with our example hurricane data frame, let's take a look at how this data could be turned into a simple Shiny web application.

Here is the ui.R script

<script src="https://gist.github.com/Rosalita/30b2081691dc046403c613c02f24206f.js"></script>

The ui.R script has been intentionally kept minimal. It consists of a select drop down box, a horizontal rule and some html output.

This is the corresponding server.R script which sits in the same directory as ui.R

<script src="https://gist.github.com/Rosalita/0c698ae047b9b1e7431c1804555d6e53.js"></script>

The server.R script receives <b><font color="B6025C"><code> input$name</code></font></b> from the ui.R and it generates <b><font color="B6025C"><code> output$data</code></font></b> which ui.R displays. The  <b><font color="B6025C"><code> output$data</code></font></b> is generated by the <b><font color="B6025C"><code> renderUI()</code></font></b> function. Inside the <b><font color="B6025C"><code> renderUI()</code></font></b>  function, the <b><font color="B6025C"><code> input$name</code></font></b> is received from ui.R, a switch statement makes a variable called 'row' which is set to the row number containing the data which matches the name.

HTML is then generated using 'row' as an index on the hurricanes data frame. This HTML output is displayed by the ui.R script

The web application created by this code can be seen running at:[https://testersurvey.shinyapps.io/shiny_demo/](https://testersurvey.shinyapps.io/shiny_demo/)

##Final thoughts

I found the Shiny framework highly effective and flexible as it enabled me to create a complex interface that interacted with and displayed my data. The input & output system for reactivity did the majority of the hard work making it easy for me to concentrate on the queries and results I wanted to display. Development time was pretty quick and the handful of bugs found during testing (mostly edge cases) turned out to be solvable with some very straight-forward changes

I would highly recommend the detailed tutorials at [shiny.rstudio.com/tutorial/](http://shiny.rstudio.com/tutorial/) for anyone wishing to explore Shiny in more detail.

This post was also published on my software testing blog [Mega Ultra Super Happy Software Testing Fun time](http://testingfuntime.blogspot.co.uk/).
