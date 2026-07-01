---
title: The Art of Logging
date: 2009-10-01 00:00:00 Z
categories:
- Tech
tags:
- codeproject
author: ceberhardt
layout: default_post
source: codeproject
summary: Accompanies the Simple Logging Facade (SLF) open-source framework with practical guidance on when, what, and how to log effectively throughout an application's lifecycle. The article argues that logging deserves the same structured, first-principles thinking as unit testing, and provides concrete guidelines for log levels and useful log content.
---

*This article was originally published on CodeProject, which has since shut down.*

![ArtOfLogging/slf.png]({{ site.baseurl }}/ceberhardt/assets/codeproject/slf.png)

## Introduction

This article is an accompaniment to the Simple Logging Facade (SLF), a recently launched Open Source logging framework written by Philipp Sumi and myself. You can read Philipp's excellent introduction to SLF and how logging fits into the software development lifecycle elsewhere [on his blog](http://www.hardcodet.net/2009/12/slf-introduction), and SLF is available to [download from CodePlex](http://slf.codeplex.com/).

## Overview

Unit testing, design documentation, logging - all of these are secondary development activities that we know we really should be doing! For most of these activities, such as unit testing and design, you will find a wealth of information both online and in books regarding patterns, techniques, and best practices. However, logging doesn't seem to receive the same level of attention; consequently, developers find it hard to know the 'what, when, and how' of logging. Is it important? I think anyone who has been in the position of debugging a live application armed with just a log file will tell you, "yes!" There is nothing more frustrating than finding a log file swamped with superfluous detail, or worse still, lacking that vital piece of information you require to diagnose the fault.

Unfortunately, despite its importance, when an application moves into a production environment, logging, like unit testing, is one of the activities that developers like to perpetually leave until tomorrow. With unit testing, there is a whole movement encouraging [test-driven](http://en.wikipedia.org/wiki/Test-driven_development) or test-first programming. However, with logging, it is often added to the codebase as an afterthought, or not added at all.

Logging, like unit testing, should be considered from day one of a project. It is a valuable tool, not a tedious task. This article seeks to make the important task of logging more of an art than an afterthought.

![ArtOfLogging/logs.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/logs.jpg)

## What is logging?

I know what you are thinking, that's an easy question to answer, "Logging - it's writing stuff to a file, isn't it?" This answer, although partially correct, is a little simplistic. If we analyse the question in a little more detail, it will help us to answer more important questions such as "What should I log?".

All computer applications have some form of interface for communicating with the user; for desktop applications, this is provided by the Windows (or other) Operating System; for web applications, this interface is presented remotely via the browser. This user-interface is the primary output mechanism that the software uses to communicate with the outside world. In Use-Case-speak, it is the system's mechanism for communicating with the primary actor. It can be advantageous to the process of maintaining an application to have some record of the actions it performs and changes to its internal state. This information is usually of no concern to the primary user; therefore, the application requires a secondary interface for communication. With this in mind ...

> ***Logging is the process of recording application actions and state to a secondary interface.***

This definition encourages us to think a little more about how we should be logging information in our application. We are recording application actions and state ... which actions and what state should we record? We are recording these to a secondary interface, which could be a file, Web-Service, email, etc... The nature of the interface is not so important, what is important is that this is a secondary interface. The user who sees this interface, the support guy looking at the application log, does not have access to the application's primary interface. This means that what is detailed in this log is very important; it is often the main source of information when diagnosing a problem.

Consumers of the application log can have different reasons for wanting to observe the application actions and state. The example described above is for application maintenance and bug resolution. However, an application log may also be used for creating statistics relating to the application usage. For example, a log file may be used to determine the number of concurrent users as a measure of performance, or it could be used to explore usage patterns for market research purposes.

Clearly, logging is an important application function, and one which deserves just a little bit of thought!

## A structured approach to logging

Some state changes or actions performed by an application are more important than others. To meet this need for classification, all good logging frameworks provide a simple classification system for log messages; as a facade, SLF does the same.

The typical classification system associates a log level with each item sent to the log. These log levels are usually comprised of three types which describe events or problems that have occurred within the application, of gradually increasing severity, WARN, ERROR, FATAL, one for general information purposes, INFO, and one for the purposes of debugging, DEBUG.

Logging frameworks will write to the log in a structured manner, making it easier to search the log for entries relating to a certain level. Also, some frameworks allow you to filter messages, possibly suppressing entries with a certain level, or diverting them to a different interface, for example, FATAL messages may be sent via email to the support team, and DEBUG messages may be suppressed completely.

Considering the importance of log levels, when embarking on a project, the development team should agree on exactly how these levels are used in order to ensure consistency between developers. The following is a suggested guideline for the usage of each level:

#### INFO

As the name suggests, these are purely informational messages; they should not be used to indicate a fault or error state in the application. To use this log level effectively, try to think about what general information would be useful for diagnosing an application error when the primary interface is not accessible. Some information that may be of use are:

- Version information relating to the software - it is often a good idea to output this to the log at application startup. There is nothing worse than trying to diagnose a problem when you are not even sure what software is being used!
- Usage information - who is using the software? What are they currently doing?
- What external services is this application using - databases, Web-Services, etc...

#### WARN

This is the first level which indicates some form of application failure. With three levels at your disposal, consistent usage guidelines are important. WARN level messages should be used to indicate that the application faced a potential problem; however, the user experience has not been affected in any way. For example, a WARN message might be appropriate if an external service could not be used; however, a secondary service which performs the same functions was available. Also, a WARN message is appropriate if repeated attempts were required to access a given resource.

#### ERROR

This is the second level of failure, and by its very name, it should indicate that something more critical has occurred. ERROR messages should be used to indicate that the application faced a significant problem and that, as a result, the user experience was affected in some way. For example, a database connection could have failed, resulting in parts of the application being rendered unusable.

#### FATAL

This third level of failure should be used to indicate a fatal error. The user experience was not just affected, it has entirely ceased! For example, a component which is central to the operation of the application has failed in a way that leaves it in an unstable state, with the only possible course of action being to terminate the application altogether.

#### DEBUG

This log level is used to indicate that the logged message is to be used for debugging purposes - in other words, these messages are aimed squarely at the developer. What you use this for really depends on the application you are developing. Many problems can be resolved via the debugger, making the use of DEBUG messages redundant; however, there are a few situations where DEBUG messages are quite useful, for example:

- In debugging graphics rendering desktop applications, the process of firing up the debugger may interfere with the render process itself. In these instances, DEBUG messages can be a useful way of 'watching' the render process in a less obtrusive fashion.
- Some application types or stages in the development process require special environments for application execution. In these cases, using a debugger tool may not be a viable option. In these cases, DEBUG messages can be a useful instrument for finding the solution to tricky bugs.

The above are just two examples where DEBUG messages are useful. As stated before, the usefulness really does depend on the nature of the application being developed.

![ArtOfLogging/rasp.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/rasp.jpg)

## What should I be logging?

We now have a definition of what is logging, and some guidelines for how to use each log level. Now, it is time for the big question: "what should I be logging?" This is not an easy question to answer, and it depends very much on the nature of the application which is being developed.

If the application log is the only detailed source of information available to the support team when trying to diagnose a failure, then it probably needs to be quite detailed. However, if there are other tools available for monitoring user-activities, the logged information could be more sparse. Either way, regardless of the required level of detail, the quality of each individual logged message is important, and that is what this section will primarily focus on.

### The importance of context

Whether an application executes a task successfully or not is often highly dependent on the input from the user. As a result, this contextual information may be vital when trying to diagnose a fault. Unfortunately, these vital last bits of information are often missing. Take, for example, the quintessential software example of an Automated Teller Machine (ATM - or cashpoint). An application log might look like this:

~~~
2009-06-05 08:15:23 [INFO] User credentials entered
2009-06-05 08:15:23 [WARN] Incorrect PIN
2009-06-05 08:15:37 [INFO] User credentials entered
2009-06-05 08:15:37 [INFO] User credentials validated
2009-06-05 08:15:46 [INFO] Cash withdrawal requested
2009-06-05 08:15:47 [ERROR] Communication failure
Acme.ATM.Integration.ServerException: Unable to connect to bank server
  at Acme.ATM.Integration.WithdrawalService.Connect(): line 23
  ...
~~~

If we were performing a daily audit of the ATM logs in identifying issues, what does the above log file excerpt tell us? Some user logged on successfully after two attempts, requested a cash withdrawal, however, this request could not be serviced due to a communication error. The logged stack trace gives us the line of code where the exception was thrown; however, this same code may have executed successfully a few thousand times in the same day. Basically, the above tells us very little, it informs us that a problem occurred, but gives us precious little information in order to diagnose and hopefully fix it. The problem could relate to the specific user, a specific bank server, or something else.

The main piece of information missing in the above log is context. If we simply added the credentials of the user, this would probably lead us to a wealth of information, such as their account details, or the bank which they have an account with (could it be this bank's server that is down?). A few simple additional details relating to the context make the world of difference:

~~~
2009-06-05 08:15:23 [INFO] User credentials entered, Acc=123765987
2009-06-05 08:15:23 [WARN] Incorrect PIN
2009-06-05 08:15:37 [INFO] User credentials entered, Acc=123765987
2009-06-05 08:15:37 [INFO] User credentials validated
2009-06-05 08:15:46 [INFO] Cash withdrawal requested, Amount=450.00
2009-06-05 08:15:47 [ERROR] Communication failure, server=acmebank.com:345
Acme.ATM.Integration.ServerException: Unable to connect to bank server
  at Acme.ATM.Integration.WithdrawalService.Connect(): line 23
  ...
~~~

This time, we know which user, how much was requested, and the address of the server. With this additional information, we now stand a fighting chance of tracking the bug down. Or, even if we are unable to from this log message - a pattern may emerge from future failures, leading us to the fault.

The addition of context information adds very little effort to the development process. With SLF, the addition of methods such as `ILogger.Info(string format, params object[] args)`, which follows the `String.Format()` pattern of replacing tokens in a string, makes it even easier to include this information as part of a formatted message.

In summary, a log message without context information is often as useful as no log message at all!

While we are on the subject of formatting logged messages, it is worth thinking about applying a standard format to your logged messages. This can prove very valuable if you need to analyse large log files (where tools like [grep](http://en.wikipedia.org/wiki/Grep) are indispensible). For example, a log message which includes a username might look like the following:

~~~
2009-06-05 08:15:37 [INFO] User credentials entered, User=Bob Smith, Acc=123765987
~~~

However, enclosing the values of the user and account variables makes it much easier to create a Regular Expression, or another form of pattern match, to locate specific values in a large log file:

~~~
2009-06-05 08:15:37 [INFO] User credentials entered, User={Bob Smith}, Acc={123765987}
~~~

### Logging in a concurrent environment

We will continue with our hypothetical ATM example to illustrate our next point. The above example showed the interaction of a single user with a system. Let's assume that our ATM business logic is centralised, with multiple ATM terminals interacting with our software (a client-server, just like a web server, and its remote clients). A log snippet might look like the following:

~~~
2009-06-05 08:15:23 [INFO] User credentials entered, Acc={123765987}
2009-06-05 08:15:23 [WARN] Incorrect PIN
2009-06-05 08:15:37 [INFO] User credentials entered, Acc={567993322}
2009-06-05 08:15:23 [INFO] User credentials entered, Acc={123765987}
2009-06-05 08:15:23 [WARN] Incorrect PIN
2009-06-05 08:15:37 [INFO] User credentials validated
2009-06-05 08:15:23 [WARN] Account locked - reset required
2009-06-05 08:15:46 [INFO] Cash withdrawal requested, Amount={450.00}
~~~

In the above example, we now have a situation where there are two ATM users operating concurrently. We can see that there has been a couple of failed login attempts, with one user having their account locked, whereas the other makes a successful withdrawal, but which customer is which?

The problem we have here, again, is lack of context; however, the additional complexity of concurrency has exacerbated the problem. We have a couple of options available to us here: either every log message must be sufficiently descriptive in that it includes all the context information required to relate it to other messages in the log, or we need to relate log messages by some other parameter such as a session ID.

Here is the same example as above, with a sequential session ID created at the point the user enters their credentials:

~~~
2009-06-05 08:15:23 [INFO] User credentials entered, Acc={123765987}, Session={5789}
2009-06-05 08:15:23 [WARN] Incorrect PIN, Session={5789}
2009-06-05 08:15:37 [INFO] User credentials entered, Acc={567993322}, Session={5790}
2009-06-05 08:15:23 [INFO] User credentials entered, Acc={123765987}, Session={5791}
2009-06-05 08:15:23 [WARN] Incorrect PIN, Session={5790}
2009-06-05 08:15:37 [INFO] User credentials validated, Session={791}
2009-06-05 08:15:23 [WARN] Account locked - reset required, Session={5790}
2009-06-05 08:15:46 [INFO] Cash withdrawal requested, Amount={450.00}, Session={5791}
~~~

In the above example, it is now quite easy to see which log message related to each account. As a side-note, some logging framework can be configured to add context information such as the thread, or user identity (see the `%thread` or `%identity` tokens in the [log4net pattern layout](http://logging.apache.org/log4net/release/sdk/log4net.Layout.PatternLayout.html)). However, in a server environment, a user request might be serviced by different threads each time, so some other form of session information is required.

### Why not log everything?

The more information we have at our disposal, the easier it is to diagnose a fault, so the question "why not log everything?" does sound like quite a reasonable one. Interestingly, one hapless stack overflow user described his/her approach to logging, which was just that - they logged everything, the start and end of each method, the start / end of code blocks within the method, the method arguments, etc... their response was the subject of a hotly debated [codinghorror blog post](http://www.codinghorror.com/blog/archives/001192.html).

There are numerous problems with excessive logging:

- Lines of logging code are like any other, they take time to write and maintain. Excessive logging is costly.
- If the application is writing 1000's of lines to the log each second, performance will be affected.
- Long and detailed log files full of superfluous information can take a long time to analyse, masking the really important information (I am sure there is a logging related pun involving "not being able to see the wood for the trees" - answers on a postcard...).
- If for some reason you really do need this level of detail, there are much better ways of adding it than manually typing this all in yourself! [AOP](http://en.wikipedia.org/wiki/Aspect-oriented_programming) frameworks such as [PostSharp](http://www.postsharp.org/) can be used to add highly detailed logging to your compiled code with a few simple changes of configuration.

The simple fact is, highly detailed log messages regarding each and every method invoked in turn are almost always unnecessary. With the right level of context information available, it is an easy task to re-trace the program execution - fortunately, computer programs are deterministic!

### Not all exceptions are errors

A commonly observed paradigm is the following:

~~~csharp
try
{
  ComponentX.DoStuff();
}
catch (Exception e)
{
  log.Error("ComponentX threw an exception", e);
}
~~~

Every single time an exception is caught, an ERROR level message is sent to the log. The problem with this is that, quite often, exceptions are anticipated or even expected. With the definition given above, ERROR level messages are intended for those where the user experience is affected or degraded in some way. When catching an exception, think twice before logging it as an ERROR ...

### Get organised with named loggers

Large applications are typically composed of numerous components of great complexity. As mentioned in the previous section, good messages are brief and provide the most important context information. With components often performing similar tasks such as authentication or connecting to databases, it can sometimes be a tricky task to determine exactly which component wrote a specific message to the log. This is where the concept of named loggers becomes very useful. A logger, when given a name, will write its name to the log each time it is used to submit a message. But, what name should we use?

Our application code already has a naming system which is used to organise it, that of class name and namespace. A common logging paradigm makes use of this existing organisation, by associating a logger with each class that logs information via its name:

~~~csharp
namespace Acme.Components.Things
{
  class WidgetClass
  {
    static Logger logger = LoggerService.GetLogger("Acme.Components.Things.WidgetClass");

    // other class members go here
  }
}
~~~

Or alternatively, you can remove the need for a string literal by using the `FullName` of the class:

~~~csharp
namespace Acme.Components.Things
{
  class WidgetClass
  {
    static Logger logger = LoggerService.GetLogger(typeof(WidgetClass).FullName);

    // other class members go here
  }
}
~~~

Any messages logged by this class' logger instance will bear the name `Acme.Components.Things.WidgetClass`, allowing them to be unambiguously associated with this class.

![ArtOfLogging/dna.jpg]({{ site.baseurl }}/ceberhardt/assets/codeproject/dna.jpg)

## Unit testing your logging code

I know what you are thinking, "isn't this taking it just a little bit too far?" Anyone who unit tests their logging code is either a unit testing addict or a slave to their coverage metrics. Hopefully, this section will convince you that there is value in unit testing your logging code.

A good developer is pragmatic when it comes to unit testing their code. Whilst testing everything helps to ensure proper functionality, unit tests take time to write and maintain, and have a cost associated with them. Therefore, when deciding whether or not to test a method or branch in your code, you should weigh up just how likely this code is to fail and the potential cost should it fail. Only when you feel the cost of writing the test is justified, should you write it!

In the earlier sections of this article, we have already detailed how logging plays an important role in your application. If, when writing our code, we determine that a particular failure (i.e., exception) impacts the user experience, then it certainly is important that it is logged.

Remember, users are funny things, you cannot always rely on them to communicate the details of an error or that they have experienced an error at all. Some users tend to feel that any fault in the software they are using is their own, and will continue to use applications that are quite clearly not working correctly. Again, this stresses the need to log important incidents, and again, the need to test for this.

So, why is it that you rarely see logging code tested? In my entire software career, I have not seen this ever done ... not once!

It is probably because the code is tightly coupled to a logging framework that is configured to write log messages to a file. Configuring the chosen logging framework for unit test, reading the message, and cleaning up afterwards is not an easy task. However, with the SLF, this is no longer a problem; when unit testing, we can simply plug in a logger which holds the logged messages in memory, ready for replay when we validate our tests. Here is a simple example:

~~~csharp
public class CommunicationLogic
{
  /// <summary>
  /// The <see cref="ILogger"> used to log messages
  /// </see>
  /// </summary>
  private static ILogger logger =
     LoggerService.GetLogger(typeof(CommunicationLogic).FullName);

  /// <summary>
  /// A service used by this class
  /// </summary>
  private IRemoteService remoteService;

  public CommunicationLogic(IRemoteService remoteService)
  {
    this.remoteService = remoteService;
  }

  public void SendMessage(string message)
  {
    try
    {
      remoteService.SendMessage(message);
    }
    catch (Exception e)
    {
      logger.WarnFormat(e, "Failed to send the given message [{0}]",
        message);
    }
  }
}
~~~

The above class has a dependency on some other component, `IRemoteService`, and a single method, `SendMessage`, which we wish to test. The implementation of this method is trivial; it simply delegates to `IRemoteService` in order to send the message. A positive test, where we create a stub of this dependent service, might look like this:

~~~csharp
[TestMethod]
public void SendMessage_RemoteServiceOK_MessageSent()
{
  // create our test fixture
  StubbedRemoteService service = new StubbedRemoteService();
  CommunicationLogic comLogic = new CommunicationLogic(service);

  // run the test
  string message = "Hello World!";
  comLogic.SendMessage(message);

  // verify that the given serivce was used to send the message
  Assert.AreEqual(message, service.SentMessage);
}

/// summary
/// A stub IRemoteService for test purposes
/// summary
private class StubbedRemoteService : IRemoteService
{
  public string SentMessage = null;

  public void SendMessage(string message)
  {
    SentMessage = message;
  }
}
~~~

Here, we provide a 'stubbed' implementation of the service which simply records the message being sent. Hence this is a true unit test.

Now, we wish to verify that if the remote service should throw an exception, resulting in our message being unsent that this failure is logged. In order to do this, we first extend our stub implementation to force a failure:

~~~csharp
private class StubbedRemoteService : IRemoteService
{
  public bool FailOnSend = false;

  public string SentMessage = null;

  public void SendMessage(string message)
  {
    SentMessage = message;
    if (FailOnSend)
    {
      throw new Exception("Message send failed");
    }
  }
}
~~~

Then, we simply configure SLF to supply a `TestLogger` to our class under test. We are now able to verify that the failure was logged:

~~~csharp
[TestMethod]
public void SendMessage_RemoteServiceFails_FailureLogged()
{
  // ensure that we record logged messages by supplying a test logger
  // because our class under creates a static logger, we have to 'inject' our
  // test logger.
  TestLogger logger = new TestLogger();
  typeof(CommunicationLogic).GetField("logger",
      BindingFlags.NonPublic | BindingFlags.Static).SetValue(null, logger);

  // create our test fixture
  StubbedRemoteService service = new StubbedRemoteService()
  {
    FailOnSend = true
  };
  CommunicationLogic comLogic = new CommunicationLogic(service);

  // run the test
  string message = "Hello World!";
  comLogic.SendMessage(message);

  // verify that the given serivce was used to send the message
  Assert.AreEqual(message, service.SentMessage);

  // verify that the exception was logged
  Assert.AreEqual(1, logger.LoggedItems.Count);
  Assert.AreEqual(LogLevel.Warn, logger.LoggedItems[0].LogLevel);
  Assert.IsNotNull(logger.LoggedItems[0].Exception);
}
~~~

Simple! Note that whilst we could have unit tested the message that was logged, this would have tightly coupled the unit test to the implementation. What really matters is that the message was logged at the given level and that the exception was included.

## Conclusions

Cooperating with Philipp on the creation of the SLF has certainly made me think about logging in far more depth than I have ever done before. I have worked on various projects with totally different logging styles (from class-to-class, not just project-to-project); however, it is only now that I have thought about the 'Art of Logging' itself and that I have finally decided how I think logging should be done.

If you agree with my guidelines, great! I hope your logging, and application maintainability improves as a result. If you do not agree with them, but this article has made you think a little more about logging than you have done previously, then that is (almost as) great also.

If you think I have missed anything, or disagree with my guidelines, please feel free to leave a comment, and please visit the [SLF homepage on CodePlex](http://slf.codeplex.com/) and give it a go for yourself.
