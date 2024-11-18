---
title: State of localisation on the web
date: 2015-03-06 00:00:00 Z
categories:
- Tech
author: lpage
layout: default_post
summary: Localising a web application to a high standard is difficult. Why is that? Consider the following differently formatted numbers...
---

Localising a web application to a high standard is difficult. Why is that? Consider the following differently formatted numbers...

* -1,23,45,678.99
* 12.345.678,99-
* (12 345 678.99)
* <span dir="rtl">١٢,٣٤٥,٦٧٨.٩٩</span>
  
There are several differences between them:

* The location and type of the negative sign - it can be brackets (though of the standard windows locales, only Lao has this format), the - can be on the right side (e.g. Arabic, Persian and Tamazight) and in addition it may have a space between the `-` and the number (e.g. Croatian and Cambodia).

* The grouping of the numbers - in most cultures it is every 3 characters, but in some it is at the thousand marker, then hundred thousand, then 10 million (e.g. India, Mongolia) and in others the thousands marker does not repeat (e.g. Tibet, Cambodia, Lao, US-Spanish)

* The obvious difference between the group separators and decimal separator.

* Lastly you get languages which do not represent numbers using the latin characters - and these might also be read right to left.
  
With datetimes you get a whole new set of problems:

Do you allow language and locale to be set separately or do you disallow e.g. Norwegian language to be used with American style dates - no-US is not a common locale format (as opposed to es-US).

How do you configure date formats for each locale and yet still be configurable for different parts of your app (e.g. date only, long date, with time, with time and seconds etc.)

Do you need to cope with calendars other than Gregorian? Note that none of the libraries below appear to support this, though it is supported in the native Intl.

## The Old

### Native

Natively, older browsers did not have any support for different number formats and the dates don't support changing the timezone - meaning that if you ever want a timezone that isn't the one that the browser thinks the user is in currently, the timezone is useless.

### Microsoft ASP.net Ajax (v2)

In the beginning, Microsoft tried with ASP.net Ajax to simulate a .net winforms environment in JavaScript. This means that you had shimmed classes, inheritance and the javascript patterns mirrored the server. [They also did that with the globalisation](https://msdn.microsoft.com/en-us/library/bb386581%28v=vs.140%29.aspx), meaning you set the culture of the page when the server was rendering the html and the [culture info](https://msdn.microsoft.com/en-us/library/system.globalization.cultureinfo%28v=vs.110%29.aspx) was then serialised into the page and used by the JavaScript. This gave very good localisation and allowed web apps to have almost as good localisation support as windows.

I've been unable to find out what's happened to this code - I know Microsoft has allowed jQuery to use it as the basis for Globalize (more on that later), but I can't find any references to it in modern versions of ASP.net.

## The Current

### momentjs

Two libraries that are very popular at the moment are the open source [momentjs](http://momentjs.com/) and [numeraljs](http://numeraljs.com/).

Moment came first and covers date-time manipulation, formatting and through a [plugin, time-zones](http://momentjs.com/timezone/). It has a nice API, but for use in complex web applications it has a few issues:

 * The locales are user contributed, meaning there may be some missing and the data may not be perfect.

  * The date formats are built into the locales, so unless you fork and edit the locales, you must keep your own date formats to [the ones moment supports](https://github.com/moment/moment/blob/develop/locale/en-gb.js#L20).

 * It doesn't support the [genitive form of the month name](http://stackoverflow.com/questions/19675155/what-is-difference-between-monthgenitivenames-and-monthnames-why-there-is-blank).
 
Regarding locale information, the alternative to having open source contributed locale information for each library is using [CLDR](http://cldr.unicode.org/) - a Unicode run database used by Microsoft, Apple, Google, IBM. Moment has an [issue to use this information](https://github.com/moment/moment/issues/1241) and there is a repo where someone has [made a start at converting between CLDR and momentjs](https://github.com/ichernev/moment-cldr), but currently neither seems to be getting much traction.

To elaborate on the problems for date formats - moment has its own code for date formats so that an app specifies `L` and this gets converted to a short date format. Its formats are:

 * LT   05:34
 * LTS  05:34:22
 * L    06/03/2015
 * LL   6 March 2015
 * LLL  6 March 2015 05:34
 * LLLL Friday, 6 March 2015 05:34

You can combine, so `LL LTS` gives you the same as `LL` but with seconds, however, notice there is no format for a 3 letter month name or a time with milliseconds. This means that if you want formats not above, you have to create them yourself or else decide that cultures are not going to get a culture specific date format - just translations.

The other libraries all base themselves on CLDR formats, which for en-gb looks like this

Comparing the CLDR date formats with moment, this is en-gb

{% highlight js %}
"dateFormats": {
  "full": "EEEE, d MMMM y",
  "long": "d MMMM y",
  "medium": "d MMM y",
  "short": "dd/MM/y"
},
"timeFormats": {
  "full": "HH:mm:ss zzzz",
  "long": "HH:mm:ss z",
  "medium": "HH:mm:ss",
  "short": "HH:mm"
},
"dateTimeFormats": {
  "full": "{1} 'at' {0}",
  "long": "{1} 'at' {0}",
  "medium": "{1}, {0}",
  "short": "{1}, {0}",
{% endhighlight %}

### numeraljs

numeraljs suffers from the same problem, it has user contributed locales and it doesn't support the breadth of configurations that you need. I found quite a few problems with it, [even just using it for locale in a few European countries](https://github.com/adamwdraper/Numeral-js/issues/created_by/lukeapage).

### React / Formatjs

React gets localisation through React Intl, which is also available outside React as [Format JS](http://formatjs.io/). However it is worth noting that this just a set of extra functionality to complement browser Intl support (see below). Unfortunately I can't see any parsing support.

### Other Frameworks (Angular, dojo)

[Angular has support for localisation](https://docs.angularjs.org/guide/i18n) and looking through the locale files, it looks like support comes from CLDR. [dojo also supports localisation](http://dojotoolkit.org/reference-guide/1.10/quickstart/internationalization/number-and-currency-formatting.html#quickstart-internationalization-number-and-currency-formatting) and again it looks like it comes from CLDR.


### jQuery globalize

[Globalize](https://github.com/jquery/globalize) is a new library, seeded from the Microsoft Ajax source code, but modified to use CLDR. It comes in modules, does not require jQuery and leaves it up to the consumer to extract the pieces out of CLDR that they need.

The fact you load the data yourself and that the data is well separated means it looks like it would not be too difficult to use one locale for the formats and another for the translations.
 
## The Native

### Intl Support

New native support is coming for localisation in the form of a [Intl namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). You can ask for a specific locale, you get back the best match the browser is able to provide and then you can format numbers and datetimes, with a number of options. It does seem to have the most forward-thinking and flexible control over the format, as this [example from MDN shows](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Example:_Using_options).

{% highlight js %}
// request a weekday along with a long date
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
console.log(new Intl.DateTimeFormat('de-DE', options).format(date));
// → "Donnerstag, 20. Dezember 2012"
{% endhighlight %}

However, the one thing missing appears to be parsing. It isn't on any methods and it [isn't in the spec](http://www.ecma-international.org/ecma-402/1.0/#sec-12.1).

### Polyfill for Intl

There is a [polyfill for Intl](https://github.com/andyearnshaw/Intl.js) which covers most of what is in the spec, but I would investigate it does everything you need before deciding to adopt it. It suffers from the same flaw as the native implementation in that there is no parse.

## Custom Controls

You also need to consider what controls your app is going to need when showing localised dates and numbers and how the user is going to edit them. For instance, if you want an input box that shows group separators (which can be handy to re-enforce which character is the decimal separator) then you either listen to the blur event and re-format at that point (which is not ideal) or you use a templated input in order to format as you type. The problem then, is working out what the template is, for the language you are localising, without re-implementing all of the localisation code.

The same argument applies to the date picker, though in that case, the jQuery UI team are re-writing their date picker to work with their globalize library, which should provide a very useful and powerful control.

## Conclusion

momentjs is good for its timezone and date handling, but I would not recommend using it for date formatting. It's a shame that moment isn't split up into a small library that does date time handling and another which does the formatting.

If your app *only* has to output numbers and dates localised, then look at polyfilling Intl - by picking a technology that has already been adopted in Firefox and Chrome, you are future protecting yourself better than picking a library which might get abandoned in the future. It also looks like one of the best libraries for formatting.

If you need to parse the numbers too (and you are not using Angular), I'd consider globalize as the best option, but it should be tested first and you should bear in mind it is not very mature.























