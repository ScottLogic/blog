---
title: Securing Web Applications, Part 2. SQL (and other) Injection Attacks
date: 2016-02-11 00:00:00 Z
categories:
- rsillem
- Tech
author: rsillem
summary: In this post, we discuss SQL and other injection attacks against web apps,
  and how to defend against them.
layout: default_post
---

Robin Sillem, William Ferguson

This blog post explores performing SQL and other injection attacks on your own machine, on some pre-made sample web apps. The focus of this post is on securing web apps, rather than the attacks themselves. It is part of an ongoing series of blog posts on web application security, which includes:

[Securing Web Applications, Part 1. Man In The Middle Attacks](http://blog.scottlogic.com/2016/02/01/man-in-the-middle.html)

An important note before starting:

**This blog post shows how to perform an attack on a sandboxed sample website. Attacking targets without prior mutual consent is illegal. It is the reader's responsibility to obey all applicable laws. The writers of this blog post and Scott Logic assume no liability and are not responsible for any misuse or damage caused from the use of this tutorial.**

Injection attacks
-----

Many (or most?) real-world websites interact with other back-end systems by sending them commands to do things - this can be databases, the OS, the file system, external services, actual physical hardware including large real-world machinery, whatever. This is a normal part of their operations, and is part of the design of the system.

Many (or most?) real-world websites also accept input from users. This generally comes from front-end clients, but it can also come from other back end systems (including the databases used by the site). The web application has no control over what input is presented to it - it is **untrusted**. This is a normal part of their operations, and is part of the design of the system.

Many (or most?) real-world websites use this input in the construction of the commands to external systems. This is a normal part of their operations, and is part of the design of the system.

Injection attacks occur when the web application passes maliciously crafted input data into an external system in a form which can damage that system. This may or may not damage the website itself (in the narrow sense), but it's certainly going to damage something or someone somehow. Note that I said 'the web application passes...', not 'an attacker presents...'. As an application developer **it is your fault** if this happens - you must expect input data to be malicious.

Note also, that I haven't mentioned SQL anywhere there. SQL injection has been known about for many years, but injection attacks apply to all kinds of back end systems. Having said that, SQL databases are very common targets, and they tend to be powerful things that can open up other systems to attack. Obviously, the various databases and back end systems each have their own very specific command language or dialect, so the input used for injection attacks tend to be very carefully crafted to suit the specific target. You can assume that a serious attacker may know more about the obscure corners of the target and its command language than you do - your focus is on getting it to do what you want, not how to break it. You may also assume that any unskilled attacker has access to tools written by someone who knows all that stuff.


Real-world examples
-----

Scared yet? You should be. Injection is #1 in the OWASP top 10 vulnerabilities list, because it is easy to do and the impact can be severe. Here are some recent news stories

[Talk-talk](https://itsecuritything.com/talktalk-breach-comedy-of-security-errors/). DDoS distraction followed by SQL injection

[VTech](http://www.troyhunt.com/2015/11/when-children-are-breached-inside.html)

[Stuxnet](http://www.langner.com/en/2011/06/07/enumerating-stuxnet%E2%80%99s-exploits/). A complex attack using SQL injection as one link in a chain of attack, resulting in physical damage to centrifuges at a uranium enrichment plant.

Many (but not all) of the big data breaches, the list goes on and on. And no discussion of SQLi would be complete without [Little Bobby Tables](https://xkcd.com/327/)


Getting Started
-----

This blog post is intended to be a hands-on discussion - at various points I'll ask you to do things to the sample applications. Obviously you don't have to - I'm not your boss - but I certainly found doing it a better way to learn than reading about it. This is a bit of a truism, but security is something of a special case, as it you need to get into the mind-set of actually trying to subvert and break your own handiwork.  

* Clone the [Sandboxed Containers Repo](https://github.com/WPFerg/SandboxedContainers) and check out the SQL_Injection branch
* Install Fiddler [link](http://www.telerik.com/fiddler)
* Create the sample apps (and new databases) by running `vagrant up` from the sub-folders of the 'samples' folder.  There are two apps, the MEAN stack accessible at `10.10.10.10`, and Jade, Express & MySQL at `10.10.10.20`. These apps have basic user login and post making facilities, inspired by *Write Modern Web Apps with the MEAN Stack* by Jeff Dickey. There's a third site, an 'attacker site' which collects data from the other two apps at `10.10.10.30`.

Moving on from a previous article
-----

If you're moving on from a different article in this series you may want to clean up your system somewhat:

* Kill the sample app VMs with vagrant destroy.
* Make sure you're using the right branch for this article - a variety of new features and vulnerabilities have been added to support it. The right branch is SQL_Injection.
* Reset the Fiddler rules - delete the customrules.js file inside your \Documents\Fiddler2\Scripts folder.
* Recreate the sample apps (and new databases) with vagrant up.


Defeating the login page
-----

So without further ado, let's walk through an injection attack on the 2 sample apps. The object of the attack is to gain access to a user's account without presenting a password.

You will find it easier to see what's going on if you have 2 ssh sessions (vagrant ssh, or use putty with username and password 'vagrant', cd /vagrant) going for each app - one to run the app (kill the running node process, then sudo gulp dev) and one to run a command line prompt [command line prompt](http://dev.mysql.com/doc/refman/5.7/en/mysql.html) for mysql or [mongo](https://docs.mongodb.org/manual/reference/mongo-shell/) (see also [https://docs.mongodb.org/manual/core/crud-introduction/](https://docs.mongodb.org/manual/core/crud-introduction/)) as appropriate.

In each case, you should start the app and register a user named 'Robin', log in that user, then log out. The sample apps have been modified so that they echo the db query and response to the console, so you can see what is being sent and returned.

In the Jade\_Express\_mySQL sample go to the second ssh shell and start a mysql command line session (`mysql --user=root --password=sec_training`, then `use sec_training;`) and run the SELECT command you see in the first ssh shell. You'll see (hopefully) 1 row - the registered user, with the given email and password. If you use the wrong password you'll get no rows back.

<img src="{{ site.baseurl }}/rsillem/assets/security-injection/MySQL1.PNG" style="display: block; margin: auto;"/>

However, if you add

```
AND 1=0
```

to your correct query, you'll get 0 rows. And if you add

```
AND 1=0 UNION SELECT '1', 'a', 'Robin', 'b' FROM users
```

you'll get 1 row back, with your user's name in the right column, totally ignoring the email and password in the first part of the query.

This is looking hopeful, but how do we get this query to run via the UI? Looking at the code, the query is built up by string concatenation. We see that whatever we typed into the Email field goes inside some quotes in a where clause, as does whatever we typed into the Password field. So it's easy - we insert a whole new ending to the query as the Email input data, including a closing quote at the beginning and a comment at the end to throw the original part of the query away. It will look something like this:

```
' AND 1=0 UNION SELECT '1', 'a', 'Robin', 'b' --
```

And bingo, you're in, using a union-based SQL injection attack. Or not, if you haven't quite got the attack string right - keep trying until you do (*hint*: there should be a space after the --), you can look at the console log to see what is actually being presented to the database. If you haven't come across the UNION keyword in SQL before, you may be sure that the attacker has (see above) - deep knowledge of the target system is key for an attacker, and UNION isn't very deep.

But wait, it gets worse. Even with this very simple injection we can replace 'Robin' with a subquery like:

```
(select password from users where name = 'Robin') p
```

<img src="{{ site.baseurl }}/rsillem/assets/security-injection/Injection1.PNG" style="display: block; margin: auto;"/>

and the app will helpfully display a password in the place you normally see a user name.

<img src="{{ site.baseurl }}/rsillem/assets/security-injection/Injection2.PNG" style="display: block; margin: auto;"/>

You could also try piggybacking an additional SQL command onto the query, like:

```
; drop table posts --
```

Though you'd need to deliberately weaken this app a bit do this (see db.js, and exercise 7 below). I'll leave this to you to play with, though.

Of course this specific attack does rely on the fact that the UI (and the Add Post feature) only cares about user names, but it should be clear that you can put any select you like after the UNION, so long as it has the right number of columns and types. It also relies on you knowing the structure of the code/data and seeing what is going on, but there are tools to help the attacker with that, as we shall see below.

The MEAN\_stack sample is slightly different, because it doesn't use a SQL database. However, a little googling throws up this: [HACKING NODEJS AND MONGODB](http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html). The TLDR here is that mongo will accept partial expressions using its built-in operators inside javascript objects  So we might try a valid email and paste

```
{"$gte": ""}
```

into the Password box (i.e. accept any password greater than "", which is to say *any password*. No dice, it fails, so that attack doesn't work, right? Wrong. Start Fiddler and run it again to see what's actually being sent - it turns out that something on the client side (AngularJS maybe, who cares?) has escaped some quotes and quoted the whole input field. But hey, we can get round that. We can submit the request direct to the API using Fiddler or Postman [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en), then use Fiddler's autoresponder to drop the JWT in, like when we did the MITM attack. We could leave Fiddler on and write some Fiddlerscript to automagically replace all passwords with `{"$gte": ""}`, so we can do passwordless login with **any** valid user. The key point here is that anything the client javascript does is **outside your trust boundary** and the attacker can bypass it via your API and/or client-side tools.

Oh, and if you haven't come across Mongo's operators before, you may be sure that the attacker has (see above) - deep knowledge of the target system is key for an attacker, and Mongo's operators aren't very deep. Does that warning sound familiar?

But wait, it gets worse. :-(. Why stop with `{"$gte": ""}`, when sequentially trying ..., `{"$gte": "P"}`, `{"$gte": "Q"}`, ..., `{"$gte": "Pa"}`, `{"$gte": "Pb"}`, ..., `{"$gte": "Pas"}` etc. (the exact letters will depend on your password) will expose the complete password one letter at a time? Here's an example of a case where multiple weakness combine - it wouldn't be possible if the passwords were stored hashed, or would it?

So what does all this tell us?

* Injection attacks occur when you pass untrusted input directly into a command to an external system
* They're very specific to the target system, detailed knowledge is invaluable
* Once the attacker finds a way in he can escalate the attack
* Directed trial and error gets the attacker a long way
* It can be laborious

*spoiler alert*: This suggests automation...


Review your data/command flows
-----

Before we get onto automating these attacks, let's take a look at what we're trying to defend. Specifically we should be looking at the flows of untrusted data, with special regard to untrusted data that is used to construct commands to external back-end systems. We might also consider untrusted data that is sent to a web client, but that's more in the arena of cross-site scripting, so let's not worry about that in this article.

In the sample apps, untrusted data comes from the client as posts during registration, login and the Add Post feature. Data from the database might also be regarded as untrusted - you don't necessarily know how it was inserted.

The external system we immediately think of as an injection target is the database, but you might also bear in mind that untrusted data is written to log files and the console. We'll briefly consider logging below, but for now we'll only worry about the database.

Review the whole codebase for both samples (it's short, don't worry - look in the controllers folder, and both apps *should* be the same), looking for places where the application accesses the database. Enumerate all pieces of untrusted input that are used in commands to the database. In each case consider what constitutes 'valid' data for that input (e.g. an email address should be a valid email address, but also consider what constitutes a unique email address and whether they should be canonicalised in some way - casing, maybe?). Enumerate all the API/form entry points for those pieces of untrusted data.

This process will give you a listing of the attack surface of your application, including the fields that are relevant in the context of injection attacks, and some idea of how to sanitize the untrusted data (see below). Consider doing the same process for the system you are working on in your day job - it'll take you much longer, of course.


Automating injection risk discovery
-----

Because injection is so automatable, there are lots of tools you can use to discover and exploit vulnerabilities, and in the exercise we'll try some of them. But before we do, let's have a look at some categories of SQL injection, so  we understand what the tools do, in relation to how information is passed to the attacker (either actual payload, or metadata about the system).

We've seen a union-based attack, which replaces or extends an expected query result set with another. The information is extracted via the result set, and as we've seen an attacker can get quite creative with subqueries.

Information can also be extracted via over-informative error messages. Using the Jade\_Express\_MySQL sample, try this in the Email field of the login page:

```
' AND foo = '' --
```

This tells us that there is no 'foo' column. It also gives us a nice stack trace which will help us identify the components and versions used in the application. On the other hand,

```
' AND password = '' --
```

does not throw up an exception, from which we may infer that it is valid SQL and there is a 'password' column. This is an error-based attack.

Now of course we all know that exposing raw exception traces to the user is A Bad Thing, so maybe we fix that (see below). But there's another trick. Try this:

```
' AND 1=0 UNION SELECT '', '', IF( (SELECT COUNT(*) from users) = 1, 'Yes', 'No') as c, '' --
```

Here we've set up a way of asking yes/no questions, in this case "Is there 1 row of user data?". This is blind SQL injection, and even if we can't get yes/no out of it directly we might for instance cause the response to be delayed (using WAITFOR) for a yes, and not for a no.

So now you know enough to interpret what the first tool I will introduce is telling you (it also illustrates that if there is any way for the attacker to execute SQL, you're pretty much hosed).

**Important - dire warning.** The tools below will insert data and may damage your sample apps (which is one reason they live in VMs and can be rebuilt from scratch) **Do not start pointing them at real systems until you genuinely know what they are going to do, and you have permission to do so**

[sql-inject-me](https://addons.mozilla.org/en-GB/firefox/addon/sql-inject-me/) is a firefox add-on that performs simple fuzz testing on a page. Fuzz testing basically means hitting the page with a bunch of canned likely attack strings to see what it does. This tool is not all that sophisticated, but as soon as you see '500 Internal Server Error' or worse 'You have an error in your SQL syntax' you know you're vulnerable. Install it and point it at our favourite victim, that poor login page.

<img src="{{ site.baseurl }}/rsillem/assets/security-injection/sqlinjectme.PNG" style="display: block; margin: auto;"/>

Next up is [ZAP](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project). This is one of OWASP's flagship projects and actually does a lot more than just injection tests - it's an easy to use scanner for all manner of vulnerabilities, and is something you should familiarise yourself with. Rather than me explaining it all myself, look at the [ZAP Getting Started Guide](http://shadowsgovernment.com/shadows-library/User%20Guide/OWASP%20Zed%20Attack%20Proxy%20(18894)/OWASP%20Zed%20Attack%20Proxy%20-%20User%20Guide.pdf). Download ZAP and start digging into the sample apps.

ZAP will tell you you have an injection vulnerability, but it won't tell you how bad it is. To really get medieval on your system try [sqlmap](http://sqlmap.org/). This is a command line based tool for running fully automated attacks. Download it and run it (you'll need Python on your system too). The full reference is [here](https://github.com/sqlmapproject/sqlmap/wiki/Usage) and you should explore the functionality a bit, but here's a starter for 10:

```
python sqlmap.py -u "http://10.10.10.20/login" --data="email=foo&password=bar" -D sec_training --schema --batch
```

Yup, that just took the database schema out through the login page. You'll see some horrifying stuff in the reference documentation. For instance you can ask it to execute OS commands on the server (i.e. step out of the SQL context altogether). This may not work on the sample apps, but it illustrates that if the user permissions on the server and database are not set up right, the attacker could get behind all your firewalls and own all your servers. This is why the potential impact of SQL injection is described as 'severe'.

The great (or not so great) thing about these tools is that they relieve you of the burden of devising horribly cunning and complex attack payloads. If you try it by hand, you will need a really good grip of SQL queries and the behaviour of your DB to run these attacks. The specific attacks depend on the syntax used by the specific RDBMS you are using. See [http://troels.arvin.dk/db/rdbms/](http://troels.arvin.dk/db/rdbms/).

The tools also have the useful ability to run in batch or headless modes which make them suitable for CI tests. As a general observation, these kind of vulnerabilities are not particularly suited to unit testing, because a. they often depend on a chain of cause and effect through multiple application layers so they're not very isolatable, and b. it's not easy to think of the horribly cunning and complex attack payloads to hit them with yourself.

Depending how creatively you tinkered with sqlmap, you may need to kill and recreate your vm, with vagrant destroy and vagrant up.


Mitigate by displaying appropriate error messages
-----

It's a generally good practice from a security (and user experience) point of view to give the user the *right level* of information when his actions don't have the expected result (and when they do, for that matter). Defining what the *right level* actually is can be an interesting question, and there is some tension between usability and security - UX says "Tell them what they need to know" and security says "Don't tell them anything they don't need to know", probably without actually agreeing on the definition of 'need'.

For example, the login pages of the sample apps (in the commits tagged for this article, but not the previous article's code) go down the road of reporting 'Incorrect username or password', rather than 'Incorrect username' and separately 'Incorrect password'. The first is balanced a little more towards security and away from usability, because with the second approach you can trial-and-error user names first, then passwords - it's a design choice.  

This doesn't bear too much on injection risks, but what does do so is showing the user internal implementation details. In most cases there is **no reason** to show a user a stack trace or an http status code. Yes, I know github shows a cutesy picture saying "404 This is not the web page you are looking for", but their audience is geeks, by and large, and anyway that cutesy animation arrives as part of a 200 response, not an actual 404, for what it's worth. I'm going to bandy response codes about from here on - see a [list of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for their meanings

Try the error based attack from the last section again:

```
' AND foo = '' --
```

<img src="{{ site.baseurl }}/rsillem/assets/security-injection/Error1.PNG" style="display: block; margin: auto;"/>

You will see a 500 response with a visible stack trace. This is giving away a ton of information to an attacker, not just about the DB schema, but the identity of all the components in the execution stack, and possibly version numbers as well, as he could partially infer them from the line numbers and source code listings obtained separately.

If you see this kind of thing in a production, pre-production or test environment (there are valid reasons for seeing it in dev environments) it's a bug, no question. Log it. You should also have automated tests to ensure that appropriate response codes are returned by requests to the web site. For this section use Fiddler - it's out of the box behaviour is to highlight 5xx responses in red text. 5xx responses are server errors - these are also probably bugs.

Review the server-side code of both sample apps and fix it so that in the test cases we have tried so far you get a politely helpful but uninformative message - deciding what that message is is part of the exercise. Make sure you still write the errors to the error log on the server. Obviously the attacks will still leak information about whether the operation succeeded or not, but we've reduced the attacker's information gain to the minimum and made the attack a little bit harder. We've also improved the overall experience for real users who *accidentally* name their children Robert'); DROP TABLE students; -- . Now try running SQL inject me against the Jade\_Express\_MySQL site. You'll see far less warnings than before - it's not picking up error strings or 500 Internal Server Error any more.

You will of course observe that it's still possible to run the passwordless login attack. We haven't actually stopped anything, just made the attacker's life a bit harder. D'oh.

Beyond this point the article takes us through various forms of fix and mitigation. This is an example of defence in depth, with multiple independent ways of stopping some of these attacks. You may therefore want to commit your error message fixes locally and try each subsequent exercise on a new local branch off that, so that you're not in a situation where the attack you're looking at was already fixed in the last section.

However, this absolutely does not mean that you only ever need to do one of the things below - the defences overlap but do not individually stop **all** injection attacks, and you should be thinking in terms of implementing all of them.

Mitigate by sanitizing output
-----

The primary defence against *SQL* injection is to use prepared statements rather than concatenating (trusted) fragments of SQL with (untrusted) fragments of data. Read this [https://en.wikipedia.org/wiki/Prepared_statement](https://en.wikipedia.org/wiki/Prepared_statement) for a clear explanation of prepared statements. The key point from the security point of view is the separation of code and data - the command is parsed, compiled and (partially) optimized without reference to the untrusted data in the parameters, which is bound at a subsequent point. So whatever the data, it's not going to alter the intent of the query - the data is never parsed or compiled. The [OWASP SQL Injection Prevention Cheat Sheet](https://www.owasp.org/index.php/SQL_Injection_Prevention_Cheat_Sheet) covers prepared statements and all the other topics in this section.

The details of how to code prepared statements differ from one framework/database to another, and we're about to see a cautionary tale. The Jade\_Express\_MySQL sample app uses the node.js driver for mysql. This library has a feature described here [here](https://www.npmjs.com/package/mysql#preparing-queries) which looks like it's what we need. Your eyebrows might have twitched slightly at `mysql.format(sql, inserts)` so tweak the sample code to use this construct and see what appears in the server console output.

This is not using MySQL prepared statements, it's escaping the single quotes. This is an entirely different (and weaker) defence - it's better than doing the escaping in code yourself, but it's still external to the database itself, and does the escaping in ignorance of how the database is set up. See the OWASP cheat sheet and/or google around escaping vs prepared statements for more details. You can continue to tinker with this, but basically the library doesn't support prepared statements. That's unfortunate, but on the other hand it does actually stop the passwordless login attempt.

Happily though, further googling reveals [mysql2](https://www.npmjs.com/package/mysql2) which does support prepared statements. Try this - you'll need to npm install it in an ssh shell, or just update the packages.json file then vagrant destroy and vagrant up. This should now cleanly reject the passwordless login attempt. We can now retry the sqlmap test we did earlier to extract the schema (you may need to add the `--flush-session` argument), and you should see sqlmap rather grudgingly admit that the email and password fields are not injectable. Sqlmap is a powerful tool, and this simple fix stopped it cold.

Another approach would be to use stored procedures. Try this if you like, but we'll discuss it further below in a different context.

None of this applies in the same way to the MEAN\_stack sample because it doesn't use SQL. However,

* The APIs expect data in JSON format, but we have *no control* over what is presented to our APIs.
* We may well want to allow characters such as { , } & : \ in a strong password.
* Body-parser is parsing JSON into javascript objects, and the characters above have special meanings
* Mongo will accept javascript objects representing partial expressions - i.e. part of a command, it's changing the intent of the database lookup.

It is possible to tell mongo not to allow arbitrary javascript functions to run, but that's not really what's happening here. What's happening is that we are providing mongo with data that will cause it to behave in unintended (by us) ways. So for this section convert the untrusted email and password data to strings (i.e. the schema we defined for users) if it is not already in that format, before sending it on to mongo - you will also need to do the same conversion for the registration process so that everything works with escaped strings. Then be sure to test with reasonable data as well as things like `{ $gt: "" }` via both the UI and the API directly. Of course, we'll also want to sanitize the input values, and we won't want to be storing plain-text passwords, but those are stories for another article.

So, what we've done here in both cases is to ensure that we pass untrusted data to external systems in such a way that those systems do not treat it as a command. Maybe we escape it, maybe we use the features of the external system. Either way you need to pick some pattern/library/whatever that works for the specific system you are sending data to. And you'll need to confirm that your choice does in fact provide the necessary defence against injection and you'll need to test it. For instance, your solution may use an ORM. Does the ORM you are using enforce the parametrization between its API and the DB? You should expect so, but check - EF does, Django does, etc. However, they may let you do raw SQL, and then it's up to you to Do The Right Thing. Code review, test.

Research and understand the security features your components (in the specific versions you use) provide, and any known vulnerabilities they have. For instance, see [Mongo's security checklist](https://docs.mongodb.org/v3.0/administration/security-checklist/). Also keep components updated, as security vulnerabilities may be patched and new defences added. This implies keeping up to date on what's going on, and having a very slick build/test/deploy cycle. Consider any features of your app that send data to external systems, to see if there is any way in which that data might be interpreted as a command - e.g. can we inject commands into the logging system? Is there a weakness/feature of the logging component?


Mitigate by input sanitization
-----

*You may wish to reset your local repo to the insecure version before your changes from the previous section before proceeding.*

Another layer of defence is input sanitization at your trust boundary. It's likely that you will have client-side validation of user input - it's good practice for usability and for performance reasons. However, this offers no defence against:

* Malicious direct access to APIs bypassing the UI altogether.
* Malicious data coming from other systems (your database, for example, or even your own config files, depending well secured they are)

You trust boundary is the point at which your server-side code either accepts or requests data from an external system. Anything coming from outside that is untrusted data.

In an earlier section we constructed the known good patterns for each input field, to allow us to whitelist input - to say 'this is not known to be good - reject it'. This is better than blacklisting 'this is bad so reject it'. There are many many ways of avoiding blacklists - splitting, white space, hex, comments etc. etc.. An analogy is antibiotics - they kill 'bad' bugs, but new resistant bugs evolve.  

In input sanitization there are design decisions to be made, balancing security and usability. Let's have a look at the 2 fields on the login page. as they are both interesting:

Email addresses have various issues, one of which is case sensitivity. Technically (from [the SMTP RFC](http://www.rfc-editor.org/rfc/rfc5321.txt) ) "*The local-part of a mailbox MUST BE treated as case sensitive. Therefore, SMTP implementations MUST take care to preserve the case of mailbox local-parts. In particular, for some hosts, the user "smith" is different from the user "Smith". However, exploiting the case sensitivity of mailbox local-parts impedes interoperability and is discouraged. Mailbox domains follow normal DNS rules and are hence not case sensitive*". However, this is about their intended usage as **email addresses**, and in the sample apps they are being used as **unique user IDs**. So you have a requirements/design decision to make - you may for instance disallow registration of new users whose email address differs from existing ones by case only, or not. But whatever you decide it will impact your input data sanitization. For this section implement an input sanitization rule that accepts email addresses and forces them to be lower case. **Tip** It turns out that writing a regex for all valid email address formats is very hard - see [http://tools.ietf.org/html/rfc2822](https://tools.ietf.org/html/rfc2822). But in these apps, it's up to you what you accept as a valid user ID, and in any case the input sanitization gives you no help in deciding whether a valid email address actually belongs to the person sending it to you. Apply this sanitization to the server-side code for the login and registration pages. You'd want to do this in the client-side code too for usability and/or performance reasons, but that's not a security feature as such.

Passwords are another interesting case. Passwords are often made stronger by including non-alphanumeric characters, e.g. !$%@#. While in principle this opens an injection risk, you should never be storing passwords in plain text in the first place - you should be using salted hashes and storing those. So input sanitization should not be an issue, though you may wish to reject weak or previously compromised passwords such as 'password'.

The MEAN\_Stack sample could also use the simple input sanitization approach of rejecting input in the form of javascript objects, and only accept strings or numbers (as discussed in the output sanitization section). Given what body-parser actually does, this is effectively a blacklisting process, but you're probably going to have to reject objects anyway in order to implement the whitelisting above so it's a moot point really.

Test the modified apps for injection vulnerabilities with the tools described in the automation section.


Mitigate by least privilege
-----

*You may wish to reset your local repo to the insecure version before your changes from the previous section before proceeding.*

So, assuming that an injection attack has got through all the defences above, how much damage can it do? Well that depends on the permissions given to the user counts running the injected commands. If your vulnerable app is running under a user account with root/admin privileges to every service, database and server in your organisation there's really no limit to what the attacker can do, you're completely compromised. If on the other hand the user account has no rights other than to write to a single database table, then the attacker can only write to that table. Obviously the implementation details are going to be complex than that but the principle is clear:

**Only give your user accounts the permissions they need to perform their role, no more.**

All of this begs some obvious questions about your app that you need to be able to answer:

* What roles does my app require to do its work?
* What actions is each role required to perform?

For the sample apps we can easily enumerate them at a hand-wavy level:

* An anonymous user can view posts, register and log in
* A logged in user can view and create posts, register, log in and out
* The system can serve application assets and write log files

For review purposes we can then ask:

* What processes are running, with what user identities?
* What application-specific (e.g. database user) identities in being used?
* What permissions are assigned to each identity?

The answers are very specific to the technologies in use in your system and the requirements of your application. Looking at the OS users and processes we see (after creating the system with vagrant up) that there are processes for gulp and node server.js, both running as root, which gives them way more permissions than they need, but it is a local demo system, and we'll return to this theme in a later article, and concentrate on database access. Taking the Jade\_Express\_MySQL sample app as an example, you really have to know how the MySQL security system works - see [http://dev.mysql.com/doc/refman/5.7/en/security.html](http://dev.mysql.com/doc/refman/5.7/en/security.html) and all its subsections.

Digging into vagrant_bootstrap.sh you will see that we have created 2 databases and a user with ALL privileges to one of them, and that user is the one used by the web application

    mysql -u root -psec_training -e "CREATE database sec_training"
    mysql -u root -psec_training -e "CREATE database some_other_database"
    mysql -u root -psec_training sec_training < /vagrant/db/create.sql
    mysql -u root -psec_training some_other_database < /vagrant/db/create.sql
    mysql -u root -psec_training -e "GRANT ALL PRIVILEGES ON sec_training.* To 'sec_train_web'@'localhost' IDENTIFIED BY 'web_pass'"

-----------------------

    var connection = mysql.createConnection({
	    host : 'localhost',
	    user : 'sec_train_web',
	    password : 'web_pass',
	    multipleStatements: true,
	    database : 'sec_training'
    });

Let's see what that means in relation to SQL injection. Run the following sqlmap command (from a Windows command prompt - we're not cheating by ssh-ing into the ubuntu vm):  

python sqlmap.py -u "http://10.10.10.20/login" --data="email=foo&password=bar" --dbs --batch

Sqlmap finds 2 databases, information\_schema and sec_training. It doesn't find some\_other\_database, because it's using the sec\_train\_web identity and that has no permissions on some\_other\_database. The sqlmap command we used in the automation section to get the schema actually did so by reading data from information\_schema, but under the hood this database is *actually* a projection showing only the information accessible to the current user, so you couldn't get the schema for some\_other\_database either - try it if you like. So far so good.

However, we foolishly gave the sec\_train\_web user ALL privileges, so let's see if an injection attack can do something it definitely shouldn't be able to - drop the posts table. Now in fact, the following exploit actually depends on another weakness as well as the permissions one. Out of the box the node mysql client won't allow stacked (piggy-backed) queries - it won't allow SELECT 'foo'; DROP TABLE bar; so the injection attack would fail. But that's a config option in `mysql.createconnection` so you should uncomment `multipleStatements: true` in db.js deliberately to allow the (unnecessarily dramatic) DROP TABLE attack to operate, and then restart the web server. You wouldn't need that in order to do a massive data exfiltration, but it does illustrate how weaknesses combine, and that you shouldn't take liberties with by-default security features in order to 'make something work', so we'll deliberately weaken the app a bit. Now run

```
python sqlmap.py -u "http://10.10.10.20/login" --data="email=foo&password=bar" -D sec_training --sql-query="DROP TABLE posts" --batch
```

Now navigate to the posts page of the app, and you'll see an exception report. Yes, we dropped the posts table, and if you wish you can confirm this with ssh into the vm and a MySQL command line or by re-running

```
python sqlmap.py -u "http://10.10.10.20/login" --data="email=foo&password=bar" -D sec_training --schema --batch
```

Fix the permissions weakness by rebuilding the system with the sec\_train\_web user only being granted SELECT and INSERT permissions on the sec\_training database. When you then run the DROP TABLE attack again, sqlmap will tell you that stacked queries are possible but it won't be able to drop the users table. It will, however, fill the posts table with its attack payloads.

This is a simple fix, reducing permissions on a single database user, at a database level. In real life, you should develop with least privilege from the start, to avoid (not) finding a load of bugs when you reduce permissions. The detail is specific to MySQL's security model and in other systems you may be able to apply permissions to specific tables and columns, and so achieve a more fine-grained permission set.

Another approach to consider is to put all the DB access in stored procedures. In this scenario, the user would not have permission to the general SELECT/INSERT/UPDATE/DELETE operations, just EXECUTE for the specific SPs the application uses - though this would work best on DBMS systems where SPs can be individually permissioned. You might also want to use multiple SQL logins for different application user roles.


Other risks and mitigations
-----

Beware of constructs such as eval() (in the context of server-side javascript) that take arbitrary input and use it as a command - this is effectively opening an injection vulnerability with your own code as the target.

The sample apps are single server deployment, but in real life this will not happen much. See also network segmentation architecture (firewall rules etc.) - it may not strictly be part of the application but you need to understand it and assure yourself that your app has only what it needs. Maybe a service-based architecture will help to isolate web app from data, if you have one - security is not necessarily a sufficient reason - but you also have to sanitize what you send to the services, like any other external system.

Consider *additional* intrusion detection system or web application firewalls (e.g. [urlscan](http://www.iis.net/downloads/microsoft/urlscan), [Barracuda](https://www.barracuda.com/) or  [Cloudflare](https://www.cloudflare.com/). These are (possibly heuristic) blacklisting systems. Even without these, consider what you are logging - does this provide evidence for identifying injection attempts, after the event?


Further reading
-----

[https://www.owasp.org/index.php/SQL_Injection_Prevention_Cheat_Sheet](https://www.owasp.org/index.php/SQL_Injection_Prevention_Cheat_Sheet)

[https://www.owasp.org/index.php/OWASP_Testing_Guide_v4_Table_of_Contents](https://www.owasp.org/index.php/OWASP_Testing_Guide_v4_Table_of_Contents) Sections 4.8.5 (and all its subsections) - 4.8.12
