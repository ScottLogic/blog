---
title: Fixing an LDAP PermGen leak in JBoss
date: 2015-07-06 00:00:00 Z
categories:
- Tech
author: awallis
layout: default_post
summary: The standard LDAP JNDI implementation that ships with Java leaks a classloader
  reference when used from a web application hosted in a web container. While Tomcat
  and Jetty both include factory-fitted workarounds, JBoss  does not. This post describes
  a JBoss-specific fix.
---

I recently devoted some time to tracking down a couple of PermGen errors in a web application hosted on JBoss. After 
fixing the first leak I came up against a leak from the JNDI/LDAP implementation included in Oracle's JVM. Both the 
Tomcat and Jetty web application containers provide factory-fitted workarounds, but unfortunately not so with JBoss. 
Since I struggled to find anything online, I had to come up with my own workaround. I've described it in this post in 
the hopes it may help someone else.

<img src='{{ site.baseurl }}/awallis/assets/fixing_permgen_leak.jpg' title="Fixing Leaks" alt="Firemen fixing a leak" />

## Leak Background

At some point during Java EE development it is likely you will encounter a dreaded 
`java.lang.OutOfMemoryError: PermGen space`. [This article](http://java.dzone.com/articles/what-permgen-leak 
"What is a PermGen Leak?") published on DZone provides a good background to PermGen leaks. All the leaks I encountered 
were due to long-running threads that continue after the web application has been undeployed.

When a thread is started it holds a reference to a classloader. If the thread is started either directly or indirectly
(typically through a third-party dependency) by a web application, this classloader will be the web application's 
classloader. If the thread is not cleanly stopped when the web application is undeployed, the thread continues running
and the strong reference to the classloader will prevent the web application's classes from being garbage-collected.
After a few redeploys typical of a development environment the application server will run out of permanent generation
memory, resulting in a PermGen OutOfMemoryError. It should be noted that it makes no difference if a thread is marked
as a daemon thread - this will only influence the lifetime of the JVM (when all non-daemon threads complete the JVM
will exit). Since the application server itself continues running even after all web applications are undeployed, any
daemon threads started by any web applications will continue running.

It is very easy for such leaks to be introduced into your web application through the use of third-party or system 
libraries. A library may have a justified reason for starting a long-running background thread but since it cannot know 
the context in which it is used it is up to the web application to ensure it is cleanly stopped. This is typically done 
by calling a suitable close method provided by the library from a servlet context listener's `contextDestroyed` method.

## JNDI/LDAP Leak

The JNDI/LDAP leak occurs when Oracle's JNDI/LDAP service provider is configured to use connection pooling with a 
non-zero idle timeout. Under these conditions the JNDI/LDAP provider starts a daemon "PoolCleaner" thread responsible 
for closing idle connections, however this thread is long-running and there is no clean way of requesting it to stop.
The PoolCleaner thread is started when the `com.sun.jndi.ldap.LdapPoolManager` class is first loaded which may happen
if using the JNDI API directly, or indirectly for example through using the `spring-security` library configured for 
LDAP authentication. In either of these cases the `LdapPoolManager` class is loaded while the web application's 
classloader is in context and is consequently set as the PoolCleaner thread's `contextClassLoader` thereby leaking the
web application's classloader.

At this point it should be noted this leak only occurs the first time the `LdapPoolManager` class is loaded. Because 
this class is a system class it is only loaded once by the system classloader. Subsequent redeploys of the 
web application will not be leaked in this fashion, but the PoolCleaner thread will continue to reference the 
classloader of the first-deployed web application. While this makes the impact of this leak less critical in that the
memory consumed by the leak will be finite, it will still impact the overall memory available to subsequent deployments.

Tomcat and Jetty both provide workarounds for this leak - see Tomcat's [JRE Memory Leak Prevention Listener](https://tomcat.apache.org/tomcat-7.0-doc/config/listeners.html#JRE%20Memory%20Leak%20Prevention%20Listener%20-%20org.apache.catalina.core.JreMemoryLeakPreventionListener)
and Jetty's [LDAPLeakPreventer](http://www.eclipse.org/jetty/documentation/current/preventing-memory-leaks.html). Both
these workarounds function by ensuring the `LdapPoolManager` class is loaded up front by the application server itself
which ensures the PoolCleaner thread's context classloader will be initialised to the application server's classloader.
Unfortunately JBoss does not include this workaround. The most I've been able to find is [this thread](https://developer.jboss.org/thread/164760?_sscc=t) 
which seems to indicate there was no plan to add the workaround.

<a name="gotcha"/>
There is a gotcha around how the `LdapPoolManager` is configured - it reads its configuration system properties once when
the class is loaded, and since it is effectively a singleton the system properties available at the time the class is 
loaded control its behaviour for the remainder of the JVM's lifetime. This means the system properties related to
`LdapPoolManager` should not be defined at a web application level but rather as part of the configuration of the 
application server itself. If this is not done then the ultimate `LdapPoolManager` configuration will be determined by
which web application is first deployed leading to a non-deterministic configuration being applied.

## JBoss Workaround

The workaround is misleadingly simple - invoke `Class.forName("com.sun.jndi.ldap.LdapPoolManager")`, however this must
only be called when we know the context classloader is the system classloader. For this reason we cannot implement the
workaround from within our web application - it needs to be done from within the application server.

### Workaround Attempt 1 - Global Modules

My first attempt at applying the workaround was to make use of JBoss's global modules. These are basically libraries 
that you can pre-install into your JBoss installation and which can then be accessed by web applications. This can allow 
for commonly used frameworks and libraries such as spring or hibernate to be installed and effectively shared across 
multiple web applications, avoiding the need for packaging these hefty frameworks with each web application. 
The JBoss documentation on classloading provides some limited information on 
[global modules](https://docs.jboss.org/author/display/AS71/Class+Loading+in+AS7#ClassLoadinginAS7-GlobalModules "Global Modules").

The limitation with global modules is that they are not automatically loaded - they are passive libraries made available
to web applications when they need them. In our case this would mean our web application would need to load a class from
the global module. This introduces a dependency from the web application on the global module which is not ideal, 
especially if there are multiple web applications. 

I implemented a workaround using this technique, however I was not happy with the solution due to the need for the 
web application to trigger the loading of the `LdapPoolManager` class.

### Workaround Attempt 2 - Extensions

I then discovered that JBoss supports extensions which offers the potential for a better solution that removes the 
requirement for the web application. An extension is packaged (and installed) as a JBoss module, but it includes the 
notion of a life-cycle - it is constructed and initialised when JBoss starts. This provides us with a chance to 
pre-emptively load the `LdapPoolManager` class ahead of any web application deployments.

My naive attempt at implementing an extension assumed I could simply load the `LdapPoolManager` class from the
extension's initialize method and add the `com.sun.jndi.ldap.connect.pool.*` properties to JBoss's standalone.xml
configuration file under the convenient `<system-properties>` element. This however does not work due to the unexpected 
way in which JBoss extensions are loaded - they are constructed and initialised before the properties in the 
system-properties element are made available. This means my extension loads the `LdapPoolManager` class with the 
default configuration instead of the configuration defined by my system properties.

### Workaround Attempt 3 - Subsystems

A JBoss subsystem is an extension that is further configured by a `<subsystem>` element in JBoss's configuration file.
JBoss subsystems are tightly coupled to how the configuration file is parsed. A subsystem is registered by an extension
which hooks into JBoss's configuration file parsing mechanism. By the time the parser encounters the extension's 
subsystem element, the `<system-properties>` element will have been processed making the defined properties 
available via Java's `System.getProperty(String)` method.

My workaround therefore needs to plug into this subsystem parsing mechanism even though it won't require any direct
configuration. My extension registers a parser during `Extension.initializeParsers()`, and a subsystem definition
during `Extension.initialize()`. The subsystem definition includes an *add* operation that is used when the parser 
encounters the extension's subsystem element in the JBoss configuration file. By the time the parser is parsing
the subsystem elements, the system-properties section will have been processed which means when my *add* 
operation is invoked, the LDAP properties I defined in system-properties will be available. My *add* operation 
implementation is therefore very simple and just loads the `LdapPoolManager` class.

I will not pretend to be an expert in JBoss subsystems, I based my implementation on the skeleton 
subsystem code that is generated when using the maven archetype `org.jboss.as.archetypes.jboss-as-subsystem` as 
described in the [example subsystem](https://docs.jboss.org/author/display/AS71/Example+subsystem) section of the JBoss
documentation. I have published the source on GitHub [here](https://github.com/awallis-scottlogic/jboss-ldap-leak-preventer). 
You can build the extension using `mvn package`. The resulting module is packaged under `target/module` and should be 
installed in your `<JBOSS_INSTALLATION>/modules`. You must then update the JBoss `standalone.xml` configuration file as 
follows:

  1. Add `<extension module="com.scottlogic.ldapleakpreventer"/>` to the `<extensions>` element.
  1. Add `<subsystem xmlns="urn:scottlogic:ldapleakpreventer:1.0"/>` to the `<profile>` element.
  1. Add your LDAP configuration properties to the `<system-propeties>` element. If you currently apply these properties
from your web application they should be moved to standalone.xml for the reasons discussed [here](#gotcha).

## Final Thoughts

The amount of time I've spent in hunting memory leaks and working out how to implement this fix for JBoss feels 
disproportionate to the value gained - especially since the LDAP leak in particular has a finite impact on PermGen 
space. It does however quiet the niggling in my brain that would otherwise keep reminding me that there is a full set of
web application classes unnecessarily retained in PermGen memory.

This process has also highlighted for me just how easy it is to introduce a classloader memory leak without writing any
dodgy code. For example, one of the leaks I found was due to a third-party library that in turn used 
Apache's HttpClient. The third-party library should have offered an API through which it could be cleanly shut down 
when the web application was undeployed but it didn't. Ideally the developer should not be required to be aware of the
transient dependency on HttpClient, however in this case it is necessary in order to step in and call 
`MultiThreadedHttpConnectionManager.shutdownAll()` during undeployment. Since such leaks could be introduced simply
through upgrading a dependency version, it is probably a good idea to pre-emptively profile for leaks as part of the
development cycle.

My final Final Thought is that this LDAP leak and similar JRE leaks handled by Tomcat's JreMemoryLeakPreventionListener
become a non-issue if the web application is implemented as a microservice running in its own process.
