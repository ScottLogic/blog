---
title: Is Aeron a Good Choice for a Messaging Solution
date: 2020-02-28 00:00:00 Z
categories:
- Tech
author: imaxwell
layout: default_post
summary: A look at the design principals behind the Aeron messaging system and the
  consequences on its suitability for Scott Logic's purposes.
---

# Is Aeron a Good Choice for a Messaging Solution
A few weeks ago, in a conversation with a colleague I was made aware of a piece of software called Aeron – a messaging system for unicast, multicast and Inter Process Communication.  I Googled it and found myself inundated by pictures of office chairs.  I Google it again with a little more detail and found the Github repository, and I got to thinking.  What is this project, why is it upstaged by chairs and is it a tool that organisations can make use of?

## What is it?
The README for the project describes it as an ‘Efficient reliable UDP unicast , UDP multicast, and IPC message transport’. More specifically it is a messaging solution that puts a particular emphasis on three things:
- High bandwidth with Low latency 
- Reliability
- Being easy to monitor

Java, C++ and .NET clients are available.

## What makes it different
The first question to ask is what makes Aeron different from other open source solutions in this space such as ActiveMQ and RabbitMQ. Or desirable when compared to commercial solutions like Ultra Messaging. 

What makes is stand out is its dedication to its core goals. Aeron wants to avoid feature bloat and focus on speed, reliability and transparency. It is designed to thrive on modern hardware with multiple processors with multiple cores, and every facet of this design has been present since day zero. Aeron is not making use of existing tools and working around their limitations – it is writing its own version of them without said limitations. This has the additional benefit of minimising dependencies.

This clarity of vision can be summed up in a quote from one of the creators of Aeron Martin Thomson: “Many messaging products are a Swiss Army knife; Aeron is a scalpel.”

### High bandwidth with low latency 
Transferring a high number of messages quickly is baked into Aeron from the early stages of design. The team behind the initial releases had a background in performance and optimisation, and this combined knowledge ensures the process is streamlined.

A few examples of this in action:
- Aeron encodes its messages in binary. Encoding messages in human readable formats is hugely inefficient, so Aeron passes them in a way that’s easiest for the computer
- Aeron keeps data to be transferred in memory mapped files and transfers these files over the network (where necessary). This allows them to avoid the Java heap.
- High performance data structures and utilities. Not content with the performance of existing data structures, the project makes use of several new ones designed to be as efficient as possible. So many of them are used up and down the stack, they have actually been refactored into their own project. https://github.com/real-logic/agrona

This allows Aeron to send millions of small 40 byte messages (all with headers and identifiers) per second. A metric they are proud of, as most of their peers lose bandwidth as messages get smaller and more numerous.

### High reliability
When first reading the phrase ‘reliable UDP’, my first thought was that seems oxymoronic, and bears a little explanation. It brings to mind the old chestnut “I’d tell you a joke about UDP, but you might not get it”. 

The limitations of UDP are factored into Aeron’s simple and elegant design.  There’s obviously far more to it than I can go into in a blog post, but I would point out three elements of the design pointed out by Martin Thomson himself at Strange Loop 2014.

1.	Structure of message logs

    Aeron stores its messages in memory mapped files called logs.  These logs are of a fixed maximum size, and the     current allocated space is tracked in a variable known as the tail.  When a new message is to be added the tail     is moved atomically to ensure there is space for the new message.  The message can then be written while other     threads are allocating space and writing other messages.  This is crudely illustrated by the following diagram:
    
    ![Structure]({{site.baseurl}}/imaxwell/assets/Section 1.png)
    
    The system knows that the message has been written in its entirety once the header for the message has been     added as in the fourth column above.  

2.	Information in the headers

    Although the header signifies that the message has been written, it contains other key information as well.  It     contains information about itself allowing it to be sent directly onto the network without further processing       and contains information about how it relates to other messages in the log to allow it to be reconstructed at the other end.

3.	Reconstruction of the log at the other end

    After the messages have traversed the network, Aeron must reconstruct the message contents in the correct  order. This is traditionally where UDP becomes unreliable, but not Aeron.  Like the tail in point one, reconstruction tracks 2 values: 
	- ‘Complete’ the point at which all messages prior have been received correctly
	- ‘High Watermark’ the end of the highest indexed message to have been received 
    
    When a new message comes in that is known to be after the completed messages, the ‘High Watermark’ moves to show what messages should have been read.  If there are any messages that should have been read, but have not, there may have been an error so the system sends a NAK (Negative Acknowledgement) back to the sender.  While the resending of that message is going on, new messages can be read without blocking, and the entire log so far is known to be completely read when ‘Complete’ is equal to the ‘High Watermark’ once again.  This is crudely illustrated in the following diagram:
    
    ![Reconstruction]({{site.baseurl}}/imaxwell/assets/Section 3.png)

And with that core design, Aeron is able to get the reliability of TCP without any associated overhead.

### Easy to Monitor
This is the real differentiator between Aeron and its peers. High performance and reliability are desirable for all software, especially when it comes to messaging, but this is highly specialised for a first-class design requirement. In fact, Aeron was first created because existing solutions were not giving the team’s clients the required transparency.

Aeron stores much information about the system in memory mapped files – it’s much more efficient to store data in such files than it is to record to STDOUT. These various files contain data about any errors the system has encountered, the output of dynamically generated debug statements and assorted state stored as a series of counters.

These files can then be read by external processes without slowing Aeron down. Aeron provides a series of command line tools for this purpose including:
- LossStat – print report of any recorded loss
- AeronStat – print the names and values of the systems counters
- LogInspector – print the contents of the log for a given Aeron stream

By having command line utilities to read this data, the system can be monitored in an automated fashion to identify bottlenecks, recurring errors or loss and any other items that may need the explicit attention of a human.

## The drawbacks
So, these are the main reasons to use it. But there are a couple of things working against it

### Lack of Community
The most overt problem with using Aeron is simply how little is known of it. Despite being around for about 5 years, there is a lack of online content surrounding how to use it. While the Github repository is extremely well maintained and full of well documented examples, all the other resources of note I have found on Aeron are at least a year out of date.

Google searches for tutorials or guides yield no results, searching video-based training sites yields no results and even the mighty Stack Overflow has had only 9 questions asked on the topic in the past 5 years.

Clearly Aeron has users – it wouldn’t be so well maintained if it didn’t. But finding those users and seeking their counsel will be more challenging than seeking online resources for the likes of Kafka or Hazelcast.

### Lack of Encryption
Encrypting data, whether it is at rest or in transit has a cost. In order to keep things blisteringly fast, Aeron doesn’t do it – yet.

This is fine if you are dealing with a system where message contents are not sensitive – a social media platform or online gaming for instance. However, this can become very problematic when handling sensitive data; passing credit card data or people’s names and addresses unencrypted over a network is an alarming prospect. 

This is a known issue, but it is not easy to solve. Most messaging systems simply use TLS, but this slows them down, and as already noted, that is not a price Aeron is willing to pay. In order to accomplish this, Aeron will have to design its own way to have higher rates of crypto messaging. And this takes time. In fact, the Github issue (#203) about adding security has been open for almost 4 years.

## Why is it upstaged by chairs?
In some regards, I do not know why more people aren’t talking about Aeron. It is very good at what it does and its being actively worked on and improved all the time. I suspect however that it is the laser focus on being what it wants to be that may be putting people off – it may simply be too niche. Specifically, its dedication to transparency while being one of the pillars on which Aeron is built, is probably not as desirable to a mainstream consumer as say, the guaranteed zero downtime of Kafka or JSON support of Hazelcast.

It may be less technical even than that and be a mere marketing problem. Even when explicitly trying to find information on Aeron, all roads lead back to Github. My searches have yielded results about a Discworld character and a caravan park in Aberystwyth, but no debate or discussion around the use of this solution or comparisons to others. Sad though it seems, people just don’t seem to know about it, so no one talks about it, so no one knows about it and the circle continues.

## Is this a good solution?
The short answer is yes.  Aeron has significant technical strengths and few drawbacks.  It could be a useful tool for any organisation.

The lack of cryptography is not as problematic as it may first sound as messages can be encrypted before sending them.  Further, if the system being developed is to be deployed within an organisation on a secure network it’s susceptibility to being intercepted is mitigated (although not eliminated).

However, Aeron will only be a good tool for those willing to put in the time to learn how to wield it properly.  With a lack of online API or step by step tutorials, developers will have to get their hands dirty under the hood to understand how it is used.  The codebase has several examples of the library in use and has stellar Javadoc, but there will be a learning curve here.


## Resources
I’ve barely scratched the surface of the technical details of Aeron. If you’re interested there’s a lot more detail available from these resources. Some of these are a little outdated, but the underlying design remains.

- **Github Repository**: [https://github.com/real-logic/aeron](https://github.com/real-logic/aeron)
- **Aeron: Do We Really Need Another Messaging System?:** [http://highscalability.com/blog/2014/11/17/aeron-do-we-really-need-another-messaging-system.html](http://highscalability.com/blog/2014/11/17/aeron-do-we-really-need-another-messaging-system.html)
- **Github issue ‘Encryption/Security Discussion’:** [https://github.com/real-logic/aeron/issues/203](https://github.com/real-logic/aeron/issues/203)
- **Google Group discussing StrangeLoop 2014:** [https://groups.google.com/forum/#!msg/mechanical-sympathy/fr7moLcsuiI/IMvQY_bCQf8J](https://groups.google.com/forum/#!msg/mechanical-sympathy/fr7moLcsuiI/IMvQY_bCQf8J)
- **Aeron talk at StrangeLoop 2014:** [https://www.youtube.com/watch?v=tM4YskS94b0](https://www.youtube.com/watch?v=tM4YskS94b0)
- **Alexey Piogov’s Blog (2017):** [https://medium.com/@pirogov.alexey/aeron-low-latency-transport-protocol-9493f8d504e8](https://medium.com/@pirogov.alexey/aeron-low-latency-transport-protocol-9493f8d504e8)
- **Info Q Podcast MAY 07, 2018:** [https://www.infoq.com/podcasts/aeron-raft/](https://www.infoq.com/podcasts/aeron-raft/)
