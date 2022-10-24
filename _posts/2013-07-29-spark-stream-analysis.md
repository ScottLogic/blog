---
title: Real-time data analysis using Spark
date: 2013-07-29 00:00:00 Z
categories:
- jphillpotts
- Data Engineering
tags:
- Scala
- Big Data
- Streaming
- WebSocket
- Spark
author: jphillpotts
layout: default_post
source: site
summary:
  "Big Data is a hot topic these days, and one aspect of that problem space
  is\nprocessing streams of high velocity data in near-real time. Here we're going
  \nto look at using Big Data-style techniques in Scala on a stream of data from \na
  WebSocket.\n"
oldlink: http://www.scottlogic.com/blog/2013/07/29/spark-stream-analysis.html
disqus-id: "/2013/07/29/spark-stream-analysis.html"
---

Big Data is a hot topic these days, and one aspect of that problem space is
processing streams of data in near-real time. One of the applications that can
help you do this is [Spark](http://spark-project.org), which is produced at [UC
Berkeley's AMP (Algorithms, Machines and People) Lab](https://amplab.cs.berkeley.edu/).

The first thing you need when you're looking at data stream analysis techniques
is a stream of data to analyse. I'm using a JSON/WebSocket representation of
[SIX Financial Information](http://en.wikipedia.org/wiki/SIX_Financial_Information)'s
real time market data feed.

The next thing I need is a problem to solve using my data stream. Now, I'm no
great financial wizard, but I'm going to suggest that there might be something
useful to be gained from knowing what sectors are currently "trending" - where
trending means showing an overall trend in a positive direction, through lots
of price changes.

## Spark - a quick introduction

For those of you that haven't heard of [Spark](http://spark-project.org) before,
it's a project written by the folks over at Berkeley, and is a key component of
their [Berkeley Data Analytics Stack](https://amplab.cs.berkeley.edu/software/).
It is written mostly in Scala, and provides APIs for Scala, Java and Python. It
is fully compatible with Hadoop Distributed File System, but extends on Hadoop's
core functionality by providing in-memory cluster computation, and, most
importantly for this blog post, a stream handling framework.

If you're interested in finding out more about Spark, they offer a free online
[introductory course](http://ampcamp.berkeley.edu/big-data-mini-course/) (that
will set you back about $10 in Amazon EC2 fees). However, at the time of
writing, the streaming exercise doesn't work as the EC2 image is based on an
old version of Spark that uses a decommissioned Twitter API.

## Spark Streaming

To consume a stream of data in Spark you need to have a `StreamingContext` in
which you register an `InputDStream` that in turn can produce a `Receiver`
object. Spark provides a number of default implementations of these (e.g.
Twitter, Akka Actor, ZeroMQ, etc.) that are accessible from the context. As
there is no default implementation for a WebSocket, so we're going to have to
define our own.

The real work is done by the Receiver implementation, so we'll start there.

I planned to use the [scalawebsocket](https://github.com/pbuda/scalawebsocket)
library to access the WebSocket, but unfortunately it's only available for Scala
2.10, and Spark is only available for Scala 2.9 - it's when this happens that
you have to swallow down your annoyance at the lack of binary compatibility
between Scala versions - fortunately all I had to do was strip out the logging
statements from `scalawebsocket` (they used 2.10 macros), and then I could
recompile it for 2.9.

With that done, we can now implement a simple trait for using our WebSocket (it
uses the `Listings` object, which just produces a list of all the available
stock listings for which the sector is known, and a map of sector id to name
for later):

~~~ scala
import scalawebsocket.WebSocket

trait PriceWebSocketClient {
  import Listings._

  def createSocket(handleMessage: String => Unit) = {
    websocket = WebSocket().open("ws://localhost:8080/1.0/marketDataWs").onTextMessage(m => {
      handleMessage(m)
    })
    subscriptions.foreach(listing => websocket.sendText("{\"subscribe\":{" + listing + "}}"))
  }

  var websocket: WebSocket = _
}
~~~

This is useful because to start off with, we just want to check that we're
receiving messages from the WebSocket correctly. We can write a simple
extension of this trait:

~~~ scala
class PriceEcho extends PriceWebSocketClient {
  createSocket(println)
}
~~~

So once we've got our Scala application hooked up to the WebSocket correctly,
we can implement a `Receiver` to consume messages using Spark. Seeing as
we're receiving our stream over a generic network protocol, we're going to
extend the `NetworkReceiver`. All we need to do then is create a block
generator and append our messages onto it:

~~~ scala
class PriceReceiver extends NetworkReceiver[String] with PriceWebSocketClient {

  lazy val blockGenerator = new BlockGenerator(StorageLevel.MEMORY_ONLY_SER)
  
  protected override def onStart() {
    blockGenerator.start
    createSocket(m => blockGenerator += m)  
  }

  protected override def onStop() {
    blockGenerator.stop
    websocket.shutdown
  }
}
~~~

That was pretty simple, but all we've got here is a text string containing
JSON data - we can extract the salient bits of data into a case class that is
then going to be easier to manipulate. Let's create a `PriceUpdate` case
class:

~~~ scala
import scala.util.parsing.json.JSON
import scala.collection.JavaConversions
import java.util.TreeMap

case class PriceUpdate(id: String, price: Double, lastPrice: Double)

object PriceUpdate {
  // No native Scala TreeMap as yet, so I'll borrow Java's
  val lastPrices = JavaConversions.asMap(new TreeMap[String,Double])

  def apply(text: String): PriceUpdate = {
    val (id, price) = getIdAndPriceFromJSON(text)
    val lastPrice: Double = lastPrices.getOrElse(id, price)
    lastPrices.put(id, price)
    PriceUpdate(id, price, lastPrice)
  }

  def getIdAndPriceFromJSON(text: String) = // snip - simple JSON processing

}
~~~

Unfortunately I couldn't find the financial listing attribute to give me the
previous price for a listing. We'll just close our eyes and pretend there
isn't a threading problem using a central map to hold onto the previous values
of the price - obviously if we were writing a production application we
wouldn't be able to use this hack.

Now our receiver can look like this:

~~~ scala
import spark.streaming.dstream.NetworkReceiver
import spark.storage.StorageLevel

class PriceReceiver extends NetworkReceiver[PriceUpdate] with PriceWebSocketClient {

  lazy val blockGenerator = new BlockGenerator(StorageLevel.MEMORY_ONLY_SER)
  
  protected override def onStart() {
    blockGenerator.start
    createSocket(m => {
      val priceUpdate = PriceUpdate(m)
      blockGenerator += priceUpdate
    })  
  }

  protected override def onStop() {
    blockGenerator.stop
    websocket.shutdown
  }
}
~~~

Much better. Now we need a corresponding `InputDStream`. Seeing as we're only
ever going to be returning new `PriceReceiver` objects whenever the
`getReceiver` function is called, we can just create our stream as an object:

~~~ scala
object stream extends NetworkInputDStream[PriceUpdate](ssc) {
  override def getReceiver(): NetworkReceiver[PriceUpdate] = {
    new PriceReceiver()
  }
}
~~~

Right, let's plug it into a Spark Streaming application and fire it up. If we
follow the Spark
[Quick Start instructions](http://spark-project.org/docs/latest/quick-start.html)
and then the guide for
[using Spark Streaming](http://spark-project.org/docs/latest/streaming-programming-guide.html),
we need to wrap up the following basic outline into an application:

~~~ scala
val ssc = new StreamingContext("local", "datastream", Seconds(15), "C:/software/spark-0.7.3", List("target/scala-2.9.3/spark-data-stream_2.9.3-1.0.jar"))

// create InputDStream

ssc.registerInputStream(stream)

// interact with stream

ssc.start()
~~~

This code is initialising the streaming context, providing the cluster
details (I'm just using a local single node), the name of the application,
how much time to gather data from the stream before processing it, the
location of the installed Spark software, and the jar file to run the
application from. The latter we can use the output from sbt, all we need
to do is make sure we use `sbt package run` from the command line, and it
will produce a jar file in the target directory, and Spark then uses that as
a result of our passing it on creation of the `StreamingContext`.

Then we just register our input stream, do some processing on it, and start
the streaming context. We can start off by just using the print function,
which will just print the first 10 items off the stream:

~~~ scala
override def main(args: Array[String]) {
  import Listings._
  val ssc = new StreamingContext("local", "datastream", Seconds(15), "C:/software/spark-0.7.3", List("target/scala-2.9.3/spark-data-stream_2.9.3-1.0.jar"))

  object stream extends NetworkInputDStream[PriceUpdate](ssc) {
    override def getReceiver(): NetworkReceiver[PriceUpdate] = {
      new PriceReceiver()
    }
  }
      
  ssc.registerInputStream(stream)
  
  stream.map(pu => listingNames(pu.id) + " - " + pu.lastPrice + " - " + pu.price).print()

  ssc.start()
}
~~~

Which gives us output like this:

    -------------------------------------------
    Time: 1375194945000 ms
    -------------------------------------------
    Croda International PLC - 24.82 - 24.82
    ASOS PLC - 47.485 - 47.485
    Arian Silver Corp - 0.0435 - 0.0435
    Medicx Fund Ltd - 0.7975 - 0.7975
    Supergroup PLC - 10.73 - 10.73
    Diageo PLC - 20.07 - 20.075
    Barclays PLC - 2.891 - 2.8925
    QinetiQ Group PLC - 1.874 - 1.874
    CSR PLC - 5.7 - 5.7
    United Utilities Group PLC - 7.23 - 7.23
    ...

## Processing the data

Now we just need to process the blocks of data. First, we want to turn them
into a list of sector, price change and change frequency. If we first turn
each item into sector, change and a count of 1, we can do this as follows:

    val sectorPriceChanges = stream.map(pu => (listingSectors(pu.id), (pu.price - pu.lastPrice, 1)))

The result of this line is that the stream has been transformed into a tuple
of sector id combined with another tuple containing price change and the
count of 1. Stream elements that are tuple pairs have an extra set of
functions that we can use in the `PairDStreamFunctions` class, for which
there is an implicit conversion function available in the `StreamingContext`,
so by importing `StreamingContext._` we can now use the `reduceByKeyAndWindow`
function. This function allows us to use a moving frame to reduce over, using
the first value of the pair as the key for the reduction. We supply a reduce
function and an inverse reduce function - then for each iteration within the
frame, Spark will reduce the new data and "un-reduce" the old. Here's a
picture to try and illustrate this:

<p class="text-center">
  <img title="reduceByKeyAndWindow" src="{{ site.baseurl }}/jphillpotts/assets/reduceByKeyAndWindow.png">
</p>

Here we're looking at a sliding window in its old state (red) and new state
(blue), with the Spark iterations marked by the dashed lines. As each
iteration passes by, the purple area is staying the same, so all Spark needs
to do is undo the reduction of the red section that has fallen off the end,
and add on the reduction of the new blue section.

So now we need a reduce and inverse reduce function to use - I want my
reduction to sum all of the price changes (positive and negative), and then
I want to know whether the number of changes were more in a positive
direction than negative, so if the price change was positive, I'm going to
increase my count, but if negative, I'm going to decrease it:

~~~ scala
val reduce = (reduced: (Double,Int), pair: (Double,Int)) => {
  if (pair._1 > 0) (reduced._1 + pair._1, reduced._2 + pair._2)
  else (reduced._1 + pair._1, reduced._2 - pair._2)
}
val invReduce = (reduced: (Double,Int), pair: (Double,Int)) => {
  if (pair._1 > 0) (reduced._1 + pair._1, reduced._2 - pair._2)
  else (reduced._1 + pair._1, reduced._2 + pair._2)
}
val windowedPriceChanges = sectorPriceChanges.reduceByKeyAndWindow(reduce, invReduce, Seconds(5*60), Seconds(15))
~~~

Now we've got a reduced stream of net price change and movement trend. We
only want to display the biggest positive movers, so we can filter the
stream for those values that have a positive movement trend, then we can
switch the tuples around so that we have a key of something we can sort by.
Now my statistics isn't that great, but I want my ordering to be weighted
by net price change and the positive movement trend, so I'm just going to
multiply the two values together. Finally we can sort the data and print
out the top 5. Put it all together and we've got our streaming application:

~~~ scala
import scala.collection.immutable.List

import spark.SparkContext._
import spark.streaming._
import spark.streaming.StreamingContext._
import spark.streaming.dstream._

object DataStream extends App {
  
  val reportHeader = """----------------------------------------------
                        Positive Trending
                        =================
                        """.stripMargin

  override def main(args: Array[String]) {
    import Listings._
    import System._
    val ssc = new StreamingContext("local", "datastream", Seconds(15), "C:/software/spark-0.7.3", List("target/scala-2.9.3/spark-data-stream_2.9.3-1.0.jar"))

    object stream extends NetworkInputDStream[PriceUpdate](ssc) {
      override def getReceiver(): NetworkReceiver[PriceUpdate] = {
        new PriceReceiver()
      }
    }
      
    ssc.checkpoint("spark")
    ssc.registerInputStream(stream)
    
    val reduce = (reduced: (Double,Int), pair: (Double,Int)) => {
      if (pair._1 > 0) (reduced._1 + pair._1, reduced._2 + pair._2)
      else (reduced._1 + pair._1, reduced._2 - pair._2)
    }
    val invReduce = (reduced: (Double,Int), pair: (Double,Int)) => {
      if (pair._1 > 0) (reduced._1 + pair._1, reduced._2 - pair._2)
      else (reduced._1 + pair._1, reduced._2 + pair._2)
    }
      
    val sectorPriceChanges = stream.map(pu => (listingSectors(pu.id), (pu.price - pu.lastPrice, 1)))
    val windowedPriceChanges = sectorPriceChanges.reduceByKeyAndWindow(reduce, invReduce, Seconds(5*60), Seconds(15))
    val positivePriceChanges = windowedPriceChanges.filter{case (_, (_, count)) => count > 0}
    val priceChangesToSector = positivePriceChanges.map{case(sector, (value, count)) => (value * count, sector)}
    val sortedSectors = priceChangesToSector.transform(rdd => rdd.sortByKey(false)).map(_._2)
    sortedSectors.foreach(rdd => {
      println("""|----------------------------------------------
                 |Positive Trending (Time: %d ms)
                 |----------------------------------------------
                 |""".stripMargin.format(currentTimeMillis + rdd.take(5).map(sectorCodes(_)).mkString("\n"))
    })    

    ssc.start()
  }

}
~~~

Note that we've had to add a location for Spark to checkpoint the `DStream`
that is created when we use `reduceByKeyAndWindow` with an inverse function

- it isn't really explained why this is needed (it is just mentioned in
  passing in the Spark streaming guide), but my assumption is that Spark needs
  to store the data that is received in each interval so that it has it
  available when it comes to applying the inverse reduction function.

When we run this (you may run into PermGen space problems the first time
you try running your application - I found these went away on a subsequent
run), we then get the trending sectors being printed:

    ----------------------------------------------
    Positive Trending (Time: 1375269240035 ms)
    ----------------------------------------------
    Real estate
    Telecommunication
    Graphics, publishing & printing media
    Environmental services & recycling
    Agriculture & fishery
    ----------------------------------------------
    Positive Trending (Time: 1375269255035 ms)
    ----------------------------------------------
    Real estate
    Graphics, publishing & printing media
    Environmental services & recycling
    Agriculture & fishery
    Electrical appliances & components
    ----------------------------------------------
    Positive Trending (Time: 1375269270034 ms)
    ----------------------------------------------
    Environmental services & recycling
    Agriculture & fishery
    Electrical appliances & components
    Vehicles
    Precious metals & precious stones

It looks like **Agriculture & fishery** or **Environmental services &
recycling** are worth investing in right now, but don't take my word for it!

In this blog we've looked at how stream processing can be achieved using
Spark - obviously if we were developing a real application we'd use much
more solid statistical analysis, and we might use a smaller sliding
interval to do our reduction over. Spark is a powerful application, and its
future is definitely looking good - it has a sound footing at UC Berkeley,
and has just been accepted as an Apache Incubator project, so expect to see
more about it as it becomes a real alternative to Hadoop.
