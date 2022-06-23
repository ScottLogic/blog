---
author: acarr
title: The Big Data technologies that saved BP $7bn
summary: "Yesterday the Financial Times boldly declared that BP saved $7bn since 2014 by investing in Big Data technologies. I spent a couple of hours researching Big Data technologies associated with BP members of staff to try and build up a picture of exactly which technologies they are using."
layout: default_post
categories:
  - Data Engineering
tags:
  - featured
image: acarr/assets/featured/oil.jpg
---

Yesterday the Financial Times published an article on the front cover of their Companies and Markets section that boldly declared [BP made $7bn annual savings since 2014 by investing in Big Data technologies](https://www.ft.com/content/16261952-6a28-11e7-bfeb-33fe0c5b7eaa). This is a colossal saving, even for a company with an $87bn market capital!

The oil and gas industry is asset-sensitive, with capital assets ranging from drilling rigs, off-shore platforms to wells and pipelines. For BP these represents around 50% of their total assets, with management and maintenance representing a significant operational cost.

In the current Internet-of-Things (IoT) Big Data era, asset optimization focuses on continuously monitoring key operating characteristics of assets and applying advanced machine learning to maximize asset performance and minimize unplanned outages. The Financial Times article highlights how BP rolled out a vast array of sensors to more than 99% of their oil and gas wells, and as a result are looking to increase their data capacity by 5 fold in the next 3 years. This data, coupled with predictive maintenance techniques, allows BP to better optimise their assets, by scheduling preventative maintenance, or delivering replacements parts at just the right time.

<img src="{{ site.baseurl }}/acarr/assets/oil.jpg" />

<small>Photo by [SMelindo on Flickr](https://www.flickr.com/photos/melindo/8206088016/in/photolist-dv9m59-SM4Z5k-98G8NB-cMkkPJ-6q5MDF-2vJWPo-QQbgYz-cj2RnA-5zmEbT-3iEE3D-cXGJ5m-QGAKC3-4zs6A7-oNA4R-9YTrqE-5PuWw1-iffL2-Ui99Ze-7ZfGXv-7ZfBed-7ZfGjN-7ZfFuF-4zdrKN-cj3bc7-6ZQvDd-6HpMDu-fQhgWR-aWruST-8fuK6L-iwkGaE-9sQtyZ-pyhUb-SM4Z6c-iffdZ-9YQvJa-71Pb5L-9YTqkU-9YQnp6-6ZQwF9-8xU1KP-6F4AwJ-ei9gGX-qiDChF-4d7qJq-71Karr-54ErBN-nCMq2e-54AdyT-8mAkSb-6k5mMT)</small>

**So how did they achieve such an impressive feat?**

I spent a couple of hours researching Big Data technologies associated with BP members of staff to try and build up a picture of exactly which technologies they are using. As anticipated they use a variety of modern Big Data technologies including a range of open source technologies and approaches available to everyone. The rest of this article take a quick look at some of these technologies.

There has been a huge amount of innovation in the three main areas that helped BP save all that money, namely storage of data, streaming data and processing of data.

## Data Storage

Storing huge volumes of data either in a datalake architecture such as Hadoop or scalable datastore such as Cassandra has never been easier. There is a huge amount of highly capable technologies which fit the use case of time series event / sampled data which BPs army of sensors produce. From my research it looks like BP might be using Parquet files on HDFS.

HDFS (Hadoop Disk Filing System) is a virtually large Filing System which can be run over multiple machines or nodes. It is designed and built on the assumption that machines develop faults easily, and the virtual Filing System should be able to easily cope with a loss of a node. In this case, HDFS stores a replica of each chunk of data a predefined number of times, typically an odd number such as three so that during retrieval a voting process can take place to decide what was stored.

To reduce the potential waste of storing everything three times it has become common to use highly optimised compressed files on HDFS, with Parquet being one such file format. Parquet files are compressed column orientated files which can be referenced in a similar way to SQL tables by technologies such as Apache HIVE. One of the solutions BP use to access its data in the Parquet files is Cloudera Impala, a faster, more optimised SQL access on HDFS files. This enables developers to interact with the storage in a very similar way to a traditional SQL datastore, or warehouse so saves on development time.

This technique is becoming a popular way of storing super large volumes of data for analytics processing due to the ease of scaling out, the compression size of the files, combined with the throughput speed for processing those files - it's a great set of technology for analytics over large volumes of historical immutable data.

BP also appear to be using Cassandra for storing time series data. Again this is a very popular choice for historical time series data, where there are very large data volumes. Cassandra naturally scales out, and is both rack and datacenter aware, so can be optimised for storage and reading.

## Data Streaming

The vast quantities of data collected by BPs sensors represent not only a challenging storage problem, but also, a challenging data 'collection' problem. The process of moving the data from sensors on oil rigs to the data-store, ready for processing, is helped by the recent innovations in streaming technologies. These help BP move the data from sensors to storage, or process in near-realtime, allowing actions to be taken in a timely manner.

BP have made a big investment in improving their monitoring to get early warnings of an impending issues - which in BPs case could have prevented a disaster plus a $62bn fine. Technologies such as Kafka which is a distributed log, Apache NiFi (a bi directional streaming system), Apex, Amazon Kinesis, Google Pub/Sub are all gaining significant momentum displacing older messaging and streaming technologies and helping to get very large volumes of data from source systems or sensors to their destination ready for timely processing. Getting the data to the destination with low latency can be key for monitoring applications to spot early warning signs of issues developing.

## Data Processing

But BP wouldn't be able to make significant savings without applying Machine Learning algorithms to these large datasets. Luckily there has been a huge amount of innovation in this area and technologies such as Apache Spark, Hadoop, Flink, Samza, Apex. Some of these technologies are mostly streaming technologies such as Apache Flink and Samza, which can be low latency. Whereas technologies such as Hadoop or Spark in batch mode typically have higher latencies. Apache Spark also has a streaming API, which is strictly speaking Micro batching but is often looked upon as a happy medium between batch and stream processing. It appears that BP uses a few technologies for its machine learning, including Apache Spark and Hadoop. Apache Spark has very recently become the most popular open source processing engine and is able to process data at scale easier than ever before with the inclusion of out-of-the-box machine learning algorithms.

So BP has used a variety of technologies to help it achieve the very impressive operational savings, and has done so using a mix which includes some very popular open source technologies which are available to everyone, and can be 'assembled' within a few weeks. These technologies have matured to a point where they really can pay back their investment in no time at all for those who know how to use them and which ones to choose.

Andrew.
