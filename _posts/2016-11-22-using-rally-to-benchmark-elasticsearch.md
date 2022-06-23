---
title: Using Rally to benchmark Elasticsearch queries
date: 2016-11-22 00:00:00 Z
categories:
- dsmith
- Data Engineering
author: dsmith
layout: default_post
summary: In this post I describe how to use Elastic's Rally to generate benchmarks
  for your private Elasticsearch queries and clusters.  I'll be creating a benchmark
  which allows comparison of an unscored query with one where scoring is enabled.
---

Elasticsearch is a popular open source search and analysis engine which is used in applications ranging from search to large-scale log aggregation and analysis.

On a recent project I have been working a lot with Elasticsearch to provide the search capabilities of our application.  As we add new features we aim to provide the best performance possible for our users.

To help with this I've been investigating a tool called Rally which was recently open-sourced by Elastic (the company which supports Elasticsearch).  Rally is Elastic's internal benchmarking tool which provides functionality specifically tailored to Elasticsearch and offers a number of improvements versus using a standard benchmarking tool.

One of the advantages of using Rally is that it will take care of building, setting up and tearing down a new cluster for each test.  This provides a known configuration and clean state to help with reproducibility.  It also controls for issues like cluster warm up, provides proper error handling and gives you the ability to visualise metrics in Kibana.

In this post I'll be describing how to set up a private Rally benchmark which is called a track.   The track I'll be creating will determine the impact of document scoring on request latency.  Document scoring is a feature of Elasticsearch which helps to sort search results in order of those which are most relevant to the user.  This is often useful but is not always needed (for example you may wish to sort by date rather than relevance) and also comes with a performance impact.

To get started you'll need to ensure you have `Python 3.4+`, `pip3`, `JDK 8` and `git 1.9+` installed on your machine.  I also found that an exact version of `Gradle` (2.13) was required due to an [Elasticsearch issue](https://github.com/elastic/elasticsearch/issues/18936 "Gradle 2.14 compatibility? Issue 18935. elastic/elasticsearch").  It's also worth noting that these steps are intended for Mac OSX however they should also work for most linux distributions with some minor modifications and should still be useful to Windows users.

Once you have the required dependencies you can install Rally using Pip:

~~~ bash
pip3 install esrally
~~~

And configure it using:

~~~ bash
esrally configure
~~~

When you configure Rally you will be asked where to put its configuration directory.  On Mac and Linux this is located by default in your user's home directory in a folder called .rally.  There are two important folders in that directory: tracks and data.

When you run a benchmark with Rally it first downloads records in JSON format to be indexed into Elasticsearch and used for the tests.  These are stored in files in the data folder and this is also where you'll be adding your own data when developing an offline test.

A track refers to a specific benchmark configuration within Rally and there are several default tracks built in such as the `geopoint` track.  The tracks folder contains both the built in tracks and your private tracks which live within track repositories.  A track repository is actually a git repository so you can create one with `git init` and add in a folder to contain the new track.

~~~ bash
cd ~/.rally/benchmarks/tracks
mkdir private
cd private
git init
~~~

For testing purposes I've used open-source data [made available by Camden Council](https://opendata.camden.gov.uk/Business-Economy/Companies-Registered-In-Camden-And-Surrounding-Bor/iix4-id37) detailing companies in the Borough.  I wrote a small bash script to download it, convert it to the format required by ES/Rally and store it in the correct location.

~~~ bash
#! /bin/bash
DATA_PATH=~/.rally/benchmarks/data/companies
FILENAME=documents
DOWNLOAD_URL=https://opendata.camden.gov.uk/api/views/iix4-id37/rows.csv?accessType=DOWNLOAD

if [ ! -d $DATA_PATH ]; then
    mkdir $DATA_PATH
fi

curl -o $DATA_PATH/$FILENAME.csv $DOWNLOAD_URL
python3 toJsonWithID.py > $DATA_PATH/$FILENAME.json
bzip2 -9 -c $DATA_PATH/$FILENAME.json > $DATA_PATH/$FILENAME.json.bz2

echo "The following values will be required in the meta section of track.json:"
wc -l $DATA_PATH/$FILENAME.csv | awk {'print "Document count: " $1'}

UNCOMPRESSED_BYTES="$(wc -c < "$DATA_PATH/$FILENAME.json")"
echo "Uncompressed Bytes: $UNCOMPRESSED_BYTES"

COMPRESSED_BYTES="$(wc -c < $DATA_PATH/$FILENAME.json.bz2)"
echo "Compressed Bytes: $COMPRESSED_BYTES"
~~~

The data can be converted from csv to json using a small Python script:

~~~python
import json
import csv
import sys

cols = (("company_name", "string"),
       ("company_number", "string"),
       ("care_of", "string"),
       ("po_box", "string"),
       ("address_line_1", "string"),
       ("address_line_2", "string"),
       ("town", "string"),
       ("county", "string"),
       ("country", "string"),
       ("postcode", "string"),
       ("company_category", "string"))

with open('../../../../data/companies/documents.csv') as f:
    reader = csv.reader(f)
    next(reader)
    id = 1000
    try:
        for row in reader:
            d = {}
            id = id + 1
            d["id"] = str(id)


            for i in range(len(cols)):
                name, type = cols[i]
                d[name] = row[i]


            print(json.dumps(d))
    except csv.Error:
        sys.exit('file %s, line %d' % (filename, reader.line_num))
~~~

For convenience both these scripts can be stored in a scripts folder within the tracks directory.

~~~ bash
cd ~/.rally/benchmarks/tracks
mkdir scripts
touch setup.sh # add the contents of the first script
touch toJsonWithID.py # add the contents of the second script
~~~

Running the `setup.sh` script will download the data from the Camden Council site.  It will also compress it and output statistics about the resulting file sizes and row counts (these will be required in a later step).

~~~~ bash
cd ~/.rally/benchmarks/tracks/private/companies/scripts
chmod u+x setup.sh
./setup.sh
~~~~

Once the data has downloaded we need to tell Rally how to index it using a `mappings.json` file.  This lives in the root of the companies folder and is in the same format as that used by Elasticsearch:

~~~ json
{
  "company": {
    "dynamic": "strict",
    "_all": {
      "enabled": false
    },
    "properties": {
      "id": {
        "type": "text"
      },
      "company_name": {
        "type": "text"
      },
      "company_number": {
        "type": "text"
      },
      "care_of": {
        "type": "text"
      },
      "po_box": {
        "type": "text"
      },
      "address_line_1": {
        "type": "text"
      },
      "address_line_2": {
        "type": "text"
      },
      "town": {
        "type": "text"
      },
      "county": {
        "type": "text"
      },
      "country": {
        "type": "text"
      },
      "postcode": {
        "type": "text"
      },
      "company_category": {
        "type": "text"
      }
    }
  }
}
~~~

Finally we need a `track.json` which sits alongside `mappings.json` and contains the index settings, operations and benchmarking configuration.

The file has the following structure:

~~~ json
    {
        "meta": { ... },
        "indices": { ... },
        "operations" : { ... },
        "challenges" : { ... }
    }
~~~

The `meta` section contains metadata about the track including description fields and a data-url which has a dummy value here since it is only required when the `offline` flag is not specified.

~~~ json
"meta": {
    "short-description": "Benchmarking scored/unscored queries",
    "description": "Benchmarking scored/unscored queries",
    "data-url": "remote-path-to-your-uploaded-data"
 }
~~~

The `indices` section contains information about the index, document count and size in bytes.  Usually you would determine these values before uploading your test data to a remote location as they are used to check a downloaded copy for corruption before running the track.  Since we're working offline in this example I've output the required information at the end of the `setup.sh` script for convenience.

~~~ json
  "indices": [
    {
      "name": "companies",
      "types": [
        {
          "name": "company",
          "mapping": "mappings.json",
          "documents": "documents.json.bz2",
          "document-count": <value from setup.sh as number>,
          "compressed-bytes": <value from setup.sh as number>,
          "uncompressed-bytes": <value-from-setup.sh as number>
        }
      ]
    }
  ]
~~~

The `operations` and `challenges` sections define the commands which will run against Elasticsearch during the benchmarking process and additionally the order in which they will run.  I have defined two challenges which differ in only whether they run a scored query or an unscored query.

~~~ json
  "operations": [
    {
      "name": "index",
      "operation-type": "index",
      "bulk-size": 5613
    },
    {
      "name": "force-merge",
      "operation-type": "force-merge"
    },
    {
      "name": "unscored-query",
      "operation-type": "search",
      "body": {
        "query": {
          "constant_score": {
            "filter": {
              "bool": {
                "must": [
                  {
                    "terms": {
                      "company_name": [
                        "limited",
                        "ltd"
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    {
      "name": "scored-query",
      "operation-type": "search",
      "body": {
        "query": {
          "bool": {
            "must": [
              {
                "terms": {
                  "company_name": [
                    "limited",
                    "ltd"
                  ]
                }
              }
            ]
          }
        }
      }
    }
  ],
  "challenges": [
    {
      "name": "unscored-challenge",
      "description": "",
      "index-settings": {
        "index.number_of_replicas": 0
      },
      "schedule": [
        {
          "operation": "index",
          "warmup-time-period": 120,
          "clients": 8
        },
        {
          "operation": "force-merge",
          "clients": 1
        },
        {
          "operation": "unscored-query",
          "clients": 8,
          "warmup-iterations": 10000,
          "iterations": 10000,
          "target-throughput": 100
        }
      ]
    },
    {
      "name": "scored-challenge",
      "description": "",
      "index-settings": {
        "index.number_of_replicas": 0
      },
      "schedule": [
        {
          "operation": "index",
          "warmup-time-period": 120,
          "clients": 8
        },
        {
          "operation": "force-merge",
          "clients": 1
        },
        {
          "operation": "scored-query",
          "clients": 8,
          "warmup-iterations": 10000,
          "iterations": 10000,
          "target-throughput": 100
        }
      ]
    }
  ]
}
~~~

We should now have everything required for a working track and should be able to run each of the challenges using the following commands:

~~~ bash
esrally --track=companies --challenge=unscored-challenge --track-repository=private --offline
esrally --track=companies --challenge=scored-challenge --track-repository=private --offline
~~~

The output should look something like this:

![Completed Rally]({{ site.baseurl }}/dsmith/assets/completed-rally.jpg "Screenshot of a completed rally run.")

On my developer machine I saw 99.99th percentile latency results for unscored queries of between twenty-five to thirty milliseconds and for scored queries of between forty to fifty milliseconds.  There was a reasonable amount of variance in the results which was probably due to running locally instead of on a dedicated benchmarking machine.  There are also lots of other factors to consider when running benchmarks and I'd highly recommend the [talk from Daniel Mitterdorfer](https://www.youtube.com/watch?v=HriBY2zoChw) about the challenges of ensuring reproducible benchmarking results and the motivation for Rally.

Rally seems like a useful addition to the Elasticsearch toolkit and I'll certainly be making more use of it in the future.
