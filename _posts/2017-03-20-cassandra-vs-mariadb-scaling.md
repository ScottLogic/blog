---
title: Cassandra vs. MariaDB, Scaling
date: 2017-03-20 00:00:00 Z
categories:
- Data Engineering
author: jwhite
contributors:
- dketley
summary: In this post we compare how Cassandra and MariaDB can be configured to operate in clusters and how this affects response time for queries. We found Cassandra to scale well and to be highly configurable. MariaDB can be used with Galera Cluster but it does not provide horizontal scaling. Also NDB can be used to scale MySQL but it was not as configurable as Cassandra.
layout: default_post
---

## Keeping Ahead of the Demand
In a [previous post]({{ site.baseurl }}/2017/03/01/cassandra-vs-mariadb.html), Dave and Laurie, compared running the database of a theoretical hat shop on single node instances of [Cassandra](http://cassandra.apache.org/) and [MariaDB](https://mariadb.org/). In that scenario, the unoptimised performance of the two databases is fairly equivalent. But, what shall we do as the hat shop grows more popular? How do we scale out the new database, or is the shop's size doomed to be... *capped*?

Previously Dave and Laurie claimed that it's a foregone conclusion that Cassandra should out scale a traditional relational database. In this post, we test that assumption to see how well the databases scale in reality and look at some of the options available.

## We're Gonna Need a Bigger Host

For assessing the performance of the different clusters we made use of the database event generation and logging mechanism created by Dave and Laurie. The Java client for Cassandra by default supports load balancing so it was relatively straightforward to start up multiple docker containers on a development PC and run some tests.

It quickly became apparent that this approach was unrealistic, **Fig 1** shows a slow down in write response times as the number of nodes was increased and **Fig 2** shows a drastic slow down in read response times. As more nodes are added the more they end up competing for the same limited hardware resources of the host. In order to make any kind of realistic assessment of the scaling it was necessary to run the nodes on separate machines.   

**Fig 1**
[![Write operation response times for multiple Cassandra nodes running on the same machine]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig1.png "Write operation response times for multiple Cassandra nodes running on the same machine")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig1.png)

**Fig 2**
[![Read response times for multiple Cassandra nodes running on the same machine]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig2.png "Read response times for multiple Cassandra nodes running on the same machine")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig2.png)

Since we didn't have multiple unused PCs to hand, we opted to build the clusters on [Amazon Web Services](https://aws.amazon.com/). AWS is well established and numerous tools integrate with its EC2 VM service.

We used [Vagrant](https://www.vagrantup.com/) to automate spinning up and provisioning our VMs. In addition to the cluster hosts, we created a separate test client host in the same region and subnet (previously we were running the tests locally) thus minimising the effect of network latency on our results.

## Configuring Cassandra Cluster

As soon as a database spans multiple hosts then some decisions need to be made about how the data is split across those machines and how communication failures between the hosts should be handled.

### Replication Factor

The replication factor defines how many copies of the data are created on different nodes and is set when the keyspace is created. Increasing the replication factor naturally increases the availability of the data.  **Fig 3** shows the different response times for different replication strategies in a five node cluster.

**Fig 3**
[![Response times for different Cassandra replication factors in a 5 node cluster]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig3.png "Response times for different Cassandra replication factors in a 5 node cluster")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig3.png)

We saw there was a slight overhead for the higher replication factors. Since this is set at the keyspace level, greater replication can be configured for more important data. Two kinds of replication strategy are available in Cassandra.  We used the `SimpleStrategy` which is rack and data centre unaware. In this strategy, replicas are stored on the next nodes on the ring. Alternatively there is the `NetworkTopologyStrategy` in which replicas are stored in distinct racks to minimise the chances of the nodes going offline at the same time.

### Consistency Level

Cassandra places its emphasis on availability, it will continue to return data from the nodes that are online even though there could potentially be more recent data on the offline nodes. However it is possible to configure Cassandra to be more likely to return the most recent data but this increases latency and sacrifices some availability.

This trade-off is controlled via the *consistency level* parameter. The consistency level is configured on a per query basis and specifies how many nodes need to respond successfully for the operation to be considered successful. This flexibility enables individual operations to determine how important getting the most up to date data is.  A selection of the consistency levels are described below:

<style type="text/css">
.consistencyTable th,
.consistencyTable td {
    border: 1px solid;
    padding: 10px;
}
.consistencyTable th {
    font-weight: bold;
}
</style>
<table class="consistencyTable">
  <thead>
    <tr>
      <th>Consistency level</th>
      <th>Write effect</th>
      <th>Read effect</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code class="highlighter-rouge">ONE</code>, <code class="highlighter-rouge">TWO</code>, <code class="highlighter-rouge">THREE</code></td>
      <td>The write must be successfully written to the specified number of replicas</td>
      <td>Returns the response from the specified number of closest replicas</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">ANY</code></td>
      <td>This allows the write to succeed even if none of the replica nodes are available. The operation will be stored on the coordinator node and replayed to the correct node when it comes online again</td>
      <td>Not applicable for reads</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">QUORUM</code></td>
      <td>The write must be successfully written to (replication factor/2)+1 replica nodes</td>
      <td>Returns the response when (replication factor/2)+1 nodes have responded</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">ALL</code></td>
      <td>The write must be successfully written to all replica nodes</td>
      <td>Returns the response once all replica nodes have responded</td>
    </tr>
  </tbody>
</table>

There are other consistency levels that are data centre aware which we did not look at as our database was restricted to a single data centre.

The less strict the consistency level is the higher the availability of the system will be, and the lower the latency, but there will be a greater chance of stale data being read. For example a write operation with consistency of `ANY` can succeed even if none of the replica nodes are available but it will not be possible to read that data until the nodes are available again.

Conversely, higher consistency levels give a higher likelihood of the data being up to date at a cost of lower availability and higher latency. The extreme example of `ALL` illustrates this best. The latency of the query will be determined by the slowest replica node in the cluster. If *any* replica nodes are down then the operation will not succeed. **Fig 4** show the performance of the different consistency levels in a 5 node cluster with a replication factor of 3. As expected, higher consistency levels lead to higher latency.

**Fig 4**
[![Response times for different Cassandra consistency levels]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig4.png "Response times for different Cassandra consistency levels")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig4.png)

## Clustering: the SQL

### Galera cluster

Though MariaDB does not by itself support clustering, the API for [Galera cluster](http://galeracluster.com/products/) is included with MariaDB.
Therefore this was the first approach we tried for creating a SQL cluster.

Galera cluster is a multi-master system which offers synchronous replication across all the nodes so that each one contains the same data. Galera cluster is not directly equivalent to a Cassandra cluster; the aim of Cassandra cluster is to provide horizontal scaling. Conversely, Galera only provides mild read scaling but negative write scaling -  the aim of Galera cluster is to improve availability without compromising the consistency of the data.

## Comparing Galera and Cassandra

Since all of the nodes in a Galera cluster have all the data and can handle requests, we used a simple round robin load balancing strategy in our tests.  **Fig 5** shows what happened to response times as more nodes were added to Cassandra and Galera clusters.

**Fig 5**
[![Response times for different cluster sizes for Cassandra and Galera]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig5.png "Response times for different cluster sizes for Cassandra and Galera")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig5.png)

As more nodes were added the response times of Cassandra decreased whereas the MariaDB write times increased. For Cassandra the update status was noticeably slower than the similar update operation. This was because this query used the `IF EXISTS` condition to ensure the item is present before it is updated. By default Cassandra creates a new row with the updated data without any check to see if the row already exists. The updated data is then combined with the previous record on read. Adding this extra check adds a significant overhead to the operation.

The MariaDB read times stayed roughly the same as they were effectively still returning the data off the node which received the request - all the extra work to replicate the data across the nodes was handled at write time.

This comparison isn't particularly informative as we are comparing apples with oranges and top hats with fezzes. Galera cluster replicates data to every node, so as more nodes are added the cost of storing that data is increased. Conversely, Cassandra is configured to store only two copies of the data, irrespective of the number of nodes.  We can achieved a fair, yet artificial comparison by requiring Cassandra to replicate data to every node. **Fig 6** shows the resulting response times.

**Fig 6**
[![Response times for a Cassandra cluster with a replication factor equal to the nodes compared with a Galera cluster]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig6.png "Response times for a Cassandra cluster with a replication factor equal to the nodes compared with a Galera cluster")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig6.png)

With this configuration the performance difference was less striking, though Cassandra still scaled better. Cassandra's performance remained fairly constant whilst Galera response times increased with the number of nodes.

Whilst Galera cluster might theoretically offer some [mild scaling](https://www.percona.com/blog/2014/11/17/typical-misconceptions-on-galera-for-mysql/) due to there being multiple nodes to handle requests it is not what we observed here and certainly not the primary function of a Galera cluster. Additionally as more nodes were added we saw greater numbers of deadlocks where two nodes tried to edit the same data at the same time (see **Fig 7**).

**Fig 7**
[![Number of deadlocks in a Galera cluster as more nodes were added]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig7.png "Number of deadlocks in a Galera cluster as more nodes were added")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig7.png)

Each of these failed requests would need to be retried by the application for them to be applied. However with Cassandra if two conflicting writes occurred concurrently both would have succeeded. On the next read, Cassandra will consider the one with the most recent timestamp as the correct version. So with Galera it is immediately clear when data has failed to be updated whereas in Cassandra there is a chance that the update will silently not be applied.

## Network Database (NDB): the Return of (SQL) Scaling

For a SQL clustering mechanism which is more comparable to Cassandra we looked at [NDB](https://dev.mysql.com/doc/refman/5.7/en/mysql-cluster.html). Unfortunately this is not currently supported by MariaDB so in order to investigate this we used [MySQL](https://www.mysql.com/) instead. NDB consists of SQL frontend nodes, whose data is stored on NoSQL backend data nodes. Cluster configuration is controlled by management nodes. Scaling is achieved by automatically sharding the data across the NoSQL nodes. The data nodes can then be replicated up to four times to protect against data loss. Therefore the number of data nodes is equal to the number of fragments multiplied by the number of replicas.

Though NDB provides an API to store data directly on the NoSQL data nodes, we did not use this - all our requests went via the SQL nodes.

Since an NDB cluster has both SQL nodes and NoSQL nodes which can be varied independently we looked at both of these to see how they affected performance.  However, we found that, for our small test client, varying the number of SQL nodes made no noticeable impact on performance.

Unexpectedly, when we varied the number of data nodes, we saw that the performance *degraded* with the number of nodes. In seeking simple optimisations we made two changes to the configuration.

1. We doubled the connection pool on the SQL nodes from one to two, in line with the guideline of twice the number of cores on the SQL node. This connection pool controls the maximum number of simultaneous connections to the data nodes.
2. The default partitioning for NDB is based on the primary key. For our data, this meant operations affecting a single order could hit multiple data nodes. To fix this we altered the partitioning of the order items table to be by the order ID.

**Fig 8** shows the difference in response times these changes made.

**Fig 8**
[![NDB cluster response times before and after optimisation]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig8.png "NDB cluster response times before and after optimisation")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig8.png)

Having made these optimisations we then compared NDB to Cassandra. **Fig 9** shows the response times for the two clusters.

**Fig 9**
[![NDB and Cassandra cluster response times]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig9.png "NDB and Cassandra cluster response times")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig9.png)

As can be seen in this graph the performance of the two clusters were reasonably similar but the NBD response times did appear to be increasing as more nodes were added.

In this comparison we increased the number of data nodes by increasing the fragments. We also investigated increasing the number of replicas instead. **Fig 10** shows how this affected response times.
​         
**Fig 10**
[![Response times as more replicas were added]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig10.png "Response times as more replicas were added")]({{ site.baseurl }}/jwhite/assets/cass_vs_mdb_fig10.png)

As might be expected, like Cassandra the response times increased as more replicas are stored but for NDB the read times remained fairly consistently low.

## Conclusions

Cassandra seems to scale well out of the box. It is highly flexible - the replication factor can be set on a per-keyspace basis. Furthermore, the consistency level is set by the client in the query, allowing the balance between availability and consistency to be tuned differently for different types of data and different client needs.

Galera cluster offers a robust multi-master cluster that will replicate data across nodes but it is not designed to provide horizontal scaling.

NDB provides a way to scale a SQL database horizontally, though without as much flexibility as Cassandra.

A few thing need to be kept in mind whilst looking at any conclusions about performance.
1. We tested against small clusters with a small test client, so it is not clear how valid it would be to extrapolate these results out to more realistic production scenarios.
2. We restricted our VMs to those available through the free tier of AWS, the resources of which are very limited. They only had single processors with 1GB of RAM. Furthermore, there seemed to be contention for resources at the host level - the performance would sometimes slow dramatically.
3. Crucially, however, the differences in response times we observed were tiny; even the slowest data point was less than 15ms.

## Future Work

The queries we used in these tests are fairly simple, mostly using primary keys. It would be interesting to see how we could make our analysis more realistic.

Firstly we could investigate how the different databases perform with more complex operations, ideally using real world data. We would expect different use cases to perform better with particular data models, and this would drive the choice of database technology. It'd be worth investigating this through a series of case studies.

We could also extend our analysis so we are not just looking at average response times. We could look specifically at the slow queries, the VM's resources as the tests run or the failed requests.

In the real world, nodes fail and so database resilience is an important characteristic. Netflix's [Chaos Monkey](https://github.com/Netflix/SimianArmy) might be a useful tool for investigating this.

In reality, a large system is going to span multiple data centres. Future testing should use more realistic deployment topologies and sizes. Ideally, we would take inspiration from how large companies setup their databases in the real world.

Our investigations on scaling SQL were constrained by our starting point of using MariaDB.
In reality, there are a class of [NewSQL](https://en.wikipedia.org/wiki/NewSQL) scalable databases to choose from.
