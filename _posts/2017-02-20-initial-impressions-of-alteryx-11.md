---
title: Initial impressions of Alteryx 11
date: 2017-02-20 00:00:00 Z
categories:
- Tech
author: jdunkerley
summary: My first thoughts and impressions of version 11 of Alteryx.
layout: default_post
image: jdunkerley/assets/alteryx11/splashScreen
---

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/splashScreen.png" alt="Alteryx 11 New Splash Screen" />

Alteryx has released [version 11](http://downloads.alteryx.com/) of both the designer and the server. It has a lot of nice improvements and few changes worth being aware of. I don’t use the server so this post is just going to concentrate on the designer and the features I have noticed.

The move towards HTML5 based property panels has continued. These were used within 10.6 for the Prescriptive tools category but this has been extended to various of the core tools. The Record ID tool has a much nicer look and the formula tool has had a completed overhaul. I am sure this move will continue with upcoming versions. The HTML SDK allows them to link a new UI to existing tools, I look forward to digging into this capability in the next few months.

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/htmlConfiguration.png" alt="Record ID HTML based configuration" />

## Improvements to the Formula Tool

The formula tool has had a complete makeover. It finally adds syntax highlighting and auto-complete to the editing experience. This makes it a lot quicker to work with to create complex expressions. It is worth noting the underlying C++ code that evaluates the formulas has not changed so there is no incompatibility with existing workflows.

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/formulaEditor.png" alt="New enhanced formula editor" />
<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/formulaEditor2.png" alt="New enhanced formula editor" />

The old column showing the formula has been replaced by a data preview. While I miss the ability to see all the expressions within a formula tool instantly, you can expand more than one row at once to see multiple expressions. The data preview gives a live value based off the first row of the data. If the expression has errors or is incomplete then the error messages are displayed within the data preview.

Since the last beta, the remaining issues around custom functions have been resolved. If you are using my [Alteryx Abacus](https://github.com/jdunkerley/AlteryxFormulaAddOns/releases) add in then all the functions will appear in the correct categories and within the autocomplete. I am hopeful I will be able to integrate with the suggested functions but haven’t looked into it yet.

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/formulaToday.png" alt="Today function" />

My only issue in using them so far has been that the new layout means I regularly forget to set the data type when I create a new column. In the old layout, this naturally followed after creating the column, whereas now you naturally move onto entering the expression.

Currently, only the formula tool has been given this overhaul, the other places you can use formulas will hopefully get the upgrade to this new style in the next release.

## Enhanced Search

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/enhancedSearch.png" alt="New search bar" />

A new enhanced search feature has been added to the UI replacing the old tool search. Hit Ctrl-Shift-F and the cursor will jump straight to the search box. As you search it searches all the metadata on Tools, the online help, and the [community](http://community.alteryx.com).

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/toolMatches.png" alt="Tool search results" />

For the tools, it also includes custom SDK based tools (for example DateTimeInput above is one of my C# tools). You can drag the tool from here straight onto a workflow. Click on *Show More* and the old search results within the tool ribbon will appear. The Alteryx Gallery results will take you to the online gallery and show you all the matching public contributions matching the search.

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/helpMatches.png" alt="Help search results" />

The help section shows you the help pages matching the field and gives the beginning of the actual text. Clicking on the link at the bottom will take you straight to the online help for version 11. As Google will often return older version documentation this is a great improvement.

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/communityMatches.png" alt="Community search results" />

Finally, the community section of the results integrates the community experience right into the UI. It will show you matches of what is there already and allow you to add a new question. The community is becoming a fantastic resource for Alteryx and the increased exposure can only increase the speed of adoption.

## The Browse Tool

So version 10 added Browse Anywhere and reduced the use of the Browse Tool. Debugging was now much simpler using the output shown from Browse Anywhere within the results tab. Version 11 brings back the Browse tool with a vengeance. It now integrates data quality checks into it. Within the results pane:

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/browseResults.png" alt="Browse Results" />

The colour under each column shows the quality of the data. Green for OK records, Red for bad values, Yellow for NULLs and Grey for blank. It gives a fantastic quick view of the quality of the data. The configuration panel shows a nice overview of current column selected within the Results pane:

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/dataProfile.png" alt="Browse Tool Data Profile" />

A great extension to the Browse tool and a massive time saver when you are working with data.

**One pretty important change of behaviour.** The partial results system used for Browse Anywhere has been updated so it now gets the correct row count. This means that it needs to evaluate all of the records within the input, previously it only did a lazy evaluation until sufficient records to fill the partial results window had been read. As this could potentially take a long time on massive datasets when developing remember to use the record limit function on Input tools.

## Date Time Improvements

As anyone who works with Alteryx knows, the date time support has been a little bit lacking. There have been some major upgrades to the parsing functionality. The DateTime tool now supports custom formats allowing you to enter any format you like in it.

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/dateTimeConfig.png" alt="Date Time Tool Config" />

Within a formula tool, the *DateTimeParse* function now supports more format types allowing for much simpler parsing of strings into Alteryx date and times. The common issue around lacking leading zeros has been resolved and number valued specifiers can now cope when missing the leading zero. One slight change I didn’t expect is that %Y (the four digit year) will now accept 2 digit years. As there is a %y to specify 2 digit years, I liked the fact that %Y used to expect 4 digit years and report an error if it found 2.

The input specifiers with changes are:

- **%a** Abbreviated weekday name: Allows more valid values, previously just 3 letters
- **%A** Full weekday name: Allows for abbreviated names as well now
- **%b (or %h)** Abbreviated month name: Allows any valid abbreviation, previously just 3 letters
- **%B** Full month name: Allows for abbreviated names as well now
- **%d (or %e)** Day of the month: Allows for 1 digit, ignores spaces
- **%m** Month number: Allows for 1 digit, ignores spaces
- **%Y** Four digit year: Allows for 2 digit years
- **%H (or %k)** Hour in 24 hour clock: Allows for 1 digit. Cannot be used with %P or %p
- **%I** Hour in 12 hour clock: Now supported. Allows for 1 digit. Must be used with %P or %p
- **%P (or %p)** "AM" or "PM": Now supported. Case insensitive AM/PM
- **%M** Minute: Allows for 1 digit, ignores spaces
- **%S** Second: Allows for 1 digit, ignores spaces

## SDK Improvements

The next two features are issues that have been limitations when using the C# SDK to develop custom tools.

<img src="{{ site.baseurl }}/jdunkerley/assets/alteryx11/jdTools.png" alt="JDTools" />

The tool group specified in a plug-in configuration was not being used within version 10.5 and 10.6. This meant that the tools ended up within the Laboratory tab. This is fixed in 11 and the tools show up where the developer specifies.

The other feature was a fantastic surprise for me. The output of SDK based tools is now automatically included within the Browse Anywhere system. I had been pestering Ned for this as was impossible to do prior to version 11. This now means that C# based tools I have are now able to do everything the first party ones do (although my UI aren’t as nice!).

## Other Improvements

There are various improvements to the UI which will improve development speed, for example, you can right click now and *Add to a New Container*. Lots of nice little tweaks, like small margin being used by default on Tool Containers, and the ability to *Open Containing Folder* by right clicking on the workflow’s tab.

The new seamless connection experiences for SQL Server and Oracle are really nice and the fact it will manage necessary installs of drivers is a good step forward. That being said once you have the connection then it was always easy to reuse.

Overall, version 11 has some great improvements which will increase productivity and the speed at which you can get to an answer. The increased use of HTML5 based designers is great and gives a much more modern look and feel. It is also really nice to see that old tools (such as the Formula tool) and the SDKs are not being neglected and the platform continues to grow.

This post was also published on my own personal blog - [jdunkerley.co.uk](https://jdunkerley.co.uk/)
