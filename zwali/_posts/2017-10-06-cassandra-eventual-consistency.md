---
author: zwali
title: Cassandra - Achieving high availability while maintaining consistency
layout: default_post
summary: "A discussion about Cassandra consistency levels and replication factor, which are frequently misunderstood. This post explains the Cassandra infrastructure and how its configuration can be tuned."
categories:
  - Data Engineering
---

Last year we happened to work with a client who replaced all their traditional databases with Apache Cassandra. They wanted to have a streamlined database infrastructure across their whole system while stepping into the world of horizontal scaling and super-fast read-write. But after taking on all the development tasks, as they embarked on the integration testing phase, things started to fall apart. They were writing some transactions and attempting to read immediately following the write. The read request was coming back with stale data instead of the entry that has just been written. When I heard of this, at first it was hard to comprehend why this was happening. But then I attended [this event](https://www.eventbrite.com/e/dse-workshop-data-n-drinks-tickets-34656447367) and the DataStax guys focused a lot on explaining  how to manage consistency and replication factors. Apparently, most companies that are struggling with Cassandra set-ups are struggling because they didn’t understand configuration and what the impacts are. Although bizarre, the issue that our client ran into is a very common one!

In this blog post, I will try to explain why Cassandra infrastructure leads to situations like this and potential solutions.

##The architecture in a nutshell

The core architecture of Cassandra was created based on two very successful database systems – Amazon’s Dynamo and Google’s Big Table. In understanding Cassandra, it is key to understand some of the concepts behind its ancestors.

Dynamo is a key-value data storage. So, it is quite simple in terms of data structure. But the main power of this architecture comes from a peer to peer architecture of nodes in a cluster, data replication and auto-sharding. These features make it a high performance and high availability data storage. The nodes in a Dynamo cluster use a gossip protocol to keep consistency of data. The nodes talk between neighbours for detecting failures. This eliminates the need for a master node. As the nodes pass messages for this type of communication, it takes a while for a certain piece of data to be consistent across all the nodes. This is called Eventual Consistency.

Google Big Table uses a commit log. Whenever a change is made to data, the action is written to a commit log, and in memory views of data are updated. This is eventually carried on to disk based storage called Sorted String Table. The fact that data is being written to memory and not disks at the time of change makes the change superfast. If there is a failure while the data is still in-memory the commit log can be used to execute the same sequence of events.

Cassandra uses similar underlying storage as Google Big Table and it incorporates the peer to peer structure similar to the one used in Dynamo. Cassandra is designed to be deployed across multiple machines in a distributed system. These machines work in parallel and handle read-write requests simultaneously. So, the more machines added, the higher the number of requests that can be fielded. There are caveats to this statement which we will discuss in a moment.

##What happens when a program initiates a read or write request?

Assuming that a calling program is using some sort of Cassandra connector,

<ul>
	<li>
	The driver instantiates a cluster object. The read/write request can be received by any node in the cluster. When a client connects to a node with a request, that node becomes the co-ordinator for that request. The co-ordinator runs partitioning algorithm to calculate which node and which partition the data is in. Replicas are identified with the replication algorithm. For writes, ALL nodes are sent the request in parallel. For reads, the request is sent to only enough nodes required to meet the requested read consistency level in parallel.
	</li>
	<li>
	If the co-ordinator knows a node is down and it cannot meet requirement of consistency, it throws an exception.
	</li>
	<li>
	If the co-ordinator does not know that a node has failed but it cannot complete consistency requirement, it throws a ‘Timed Out’ exception. The calling program should treat the exception as an incomplete operation and retry. When a node later joins / comes back within gc_grace_seconds, it gets updated with the latest data.
	</li>
</ul>

##Latency - Consistency trade-off

We all want database transactions to have as low latency as possible. This is one of the main reasons for switching to Cassandra. Cassandra doesn’t have the atomicity of transactions like traditional RDMS, but it uses replication to ensure availability. Each entry is database is replicated across different nodes. The level of replication is specified at the time of creating a keyspace.

~~~ cql
CREATE KEYSPACE "Example"
  WITH REPLICATION = {'class' : 'NetworkTopologyStrategy', 'dc1' : 5, 'dc2' : 3};
~~~

In this example, we are specifying that each entry within this keyspace will have five copies within datacentre dc1 and three copies within datacentre dc2. Replicas can be in different data centres to ensure data retention even when some of the data centres go down. The process of replication across geographically separated datacentres incurs higher latency. But replication is important for availability and consistency. This trade-off underpins the configuration plan of a Cassandra cluster.

##So, what is the answer to this trade-off?

There is no one true answer here. The parameters should be tuned based on the use case. There are two main parameters that can be manipulated. There is the Replication Factor (RF) which is the number of copies each entry will have. We just saw an example of Replication factor being 5 in dc1 and 3 in dc2. And then there is the Consistency Level which is specified per query during Reads and Writes. If Read Consistency Level (R) is ONE, then when read is initiated, any one of the copies of the data will be queried and returned to user. If Read Consistency Level is QUORUM, then a majority number of the copies are queried, and the copy with the latest timestamp is taken as the true one and all the other copies are updated with the latest copy. Similarly, if Write Consistency (W) Level is QUORUM, an acknowledgement is only returned after majority of the copies are updated with the new entry.

If it is a system where the key is to keep recording information and the entries are so frequent that it doesn’t really matter if some entries get lost. This would be the case with scientific data like sensor readings. W=1 will be good enough.

If it is a system where consistency is important as well as latency, R+W > RF usually is a safe choice. Let’s see how following this equation can ensure consistency. Imagine a 5-node system, read consistency level of Quorum, Write Consistency Level of Quorum and Replication factor is 3. As Write Consistency level is Quorum, write needs to happen in at least 2 replica nodes before an acknowledgement is returned. Let’s say that for a write request comes to a coordinator. It figures out the Primary, Replica 1, and Replica 2 nodes, and sends them a write request. Let’s say the write is acknowledged by Primary and Replica 1, but not by Replica 2.

If a read request is initiated when Write Quorum has been met:

<ul>
	<li>
		If it tries to read from Primary and Replica 1, it will get the latest entry.
		<p><img src='{{ site.baseurl }}/zwali/assets/cassandra-discussion/Capture000.PNG' title="read after write quorum satified" alt="read after write quorum satified" /></p>
	</li>
	<li>
		If it tries to read from Replica 1 and Replica 2, it will see a discrepancy, but will take the entry with the latest timestamp i.e. the one from Replica 1, update Replica 2 with that and return the latest data.
		<p><img src='{{ site.baseurl }}/zwali/assets/cassandra-discussion/Capture001.PNG' title="read after write quorum satified" alt="read after write quorum satified" /></p>
	</li>
</ul>


So, that is the happy path where we always get latest data if we follow R+W > RF. When the actions are sequential, a read is initiated only after the write action has come back successfully meeting the Quorum requirements. But consider the following scenario where the read and write invocations are not sequential.

If a read request is initiated when only Primary has the latest data:

<ul>
	<li>
		If it tries to read from Replica 1 and Replica 2, it will get the already existing entry and not the latest one.
		<p><img src='{{ site.baseurl }}/zwali/assets/cassandra-discussion/Capture002.PNG' title="read after write quorum satified" alt="read while write in progress" /></p>
	</li>
	<li>
		If it tries to read from Primary and one of the replicas, it will see a discrepancy, but take the entry with the latest timestamp i.e. the one from Primary, update replica with that and return the latest data.
		<p><img src='{{ site.baseurl }}/zwali/assets/cassandra-discussion/Capture003.PNG' title="read after write quorum satified" alt="read while write in progress" /></p>
	</li>
</ul>


This is eventually consistent i.e. eventually all the copies are consistent and you are getting the most consistent copy of data at the time of query. This is in line with commonly used isolation levels in relational databases – until a transaction is completed, its effects are not observable by others. However, there is a very specific sequence of events that can cause inconsistency even when R + W > RF is followed.

-	Say, we have the same node setup as before.
-	Replica 1 fails but co-ordinator does not know yet.
-	It only writes to Primary.
-	It attempts to write to Replica 1 but sees that Replica 1 is not available.
-	It throws the ‘Timeout’ exception.
-	The calling program sees the exception but doesn’t retry.
-	Primary crashes before Replica 1 comes back i.e. no node has copy of the latest write now.

<img src='{{ site.baseurl }}/zwali/assets/cassandra-discussion/Capture004.PNG' title="write timeout" alt="write timeout" />

As we can see, multiple things will have to go wrong for this to happen. Therefore, eventual consistency is not as bad as it sounds. It is not at all easy to lose data. And even if you lose data, the calling program is aware of the fact so it can mitigate the situation in other ways e.g. showing an on-screen message or sending an error at a designated place specifying the failure. More commonly, the calling program would retry when it sees the exception.

Now let’s say the following sequence of events occur afterwards.

-	Primary comes back within gc_grace_seconds so we have the latest copy of data.
-	The data gets replicated to Replica 2 as well.
-	Replica 1 comes back after gc_grace_seconds and it gets repaired instead of wiped. The older piece of data will now have newer timestamp because of the repair. The older copy will get precedence because of its new-found timestamp.

Again, this is avoidable. Any node that comes back after gc_grace_seconds should be wiped and not repaired.

If you want to be really risk-reverse, then you can specify Read ALL or Write ALL, that will make sure that the read request checks all copies and takes the latest or in the latter case, acknowledgement of successful write is only returned once all the copies have been updated. If a program is write heavy, specify Write ONE and Read ALL, and if a program is read heavy, specify Read ONE and Write ALL.  This is problematic though, and will cause much bigger strain on availability. In practice, ALL is hardly ever used as it implies that if any single node – primary or replica for a query - crashes at some point, no read or write that has a consistency level of ALL targeting said nodes will be able to complete.  

In all these scenarios, we have assumed that read and write actions are happening within the same three nodes and the nodes are all residing within the same data centre. Now let’s extend the scenario over multiple data centres and replicas of the same data are sitting across different data centres. Here, we have two possibilities.

One is to have LOCAL_QUORUM within each data centre. In that case, a read or write request will be acknowledged to the client once it has achieved quorum within the data centre it is talking to. In this setup, it is crucial that any read following the write queries the same data centre. If the read request queries a different data centre, it is possible that the queried data centre is not yet up-to-date with the latest data.

The other option is EACH_QUORUM. With this configuration, a read or write request will be complete once it has achieved quorum across all the data centres. This way the calling program can be rid of the restriction on data centres which can be queried for read following a write. But as these are separate data centres, latency will be at least double if not more.

When it is possible to configure client code in a way that it always hits one specific data centre for meeting quorum, it is the more efficient option. That way, it never has to go to a faraway data centre for replication, which improves latency. It is also possible to vary this kind of primary data centre for client application based on end user’s location. [This article](http://www.datastax.com/dev/blog/multi-datacenter-replication) details two very specific use cases along with caveats for each use case.

##Back to our original problem

Turns out our client system was adhering to a microservices architecture. And one microservice was trying to read while the other was in progress with writing. They were using LOCAL_QUORUM for read and write. The read request was bringing back stale data. I suspect it was caused by the fact that they were querying different data centres and LOCAL_QUORUM doesn’t ensure consistency across multiple data centres. It is not uncommon with traditional databases to return slightly stale data. With SQL server, if you don’t specify read uncommitted (which has risk of bringing in unstable / dirty data), any read request happening while the write hasn’t been committed will get stale data as well. So why is it a more common problem with Cassandra? I think it is because when people think RDMS, they tend to think a singular flow of transactions and design their applications as such. But with Cassandra and other distributed databases, there is this concept of parallelisation of tasks, super-fast read writes, and distributed processing. These are powerful features, but require attention in terms of the logistics of latency, availability, and consistency. They require a bit more planning and understanding, without which the resulting designs fall apart.
