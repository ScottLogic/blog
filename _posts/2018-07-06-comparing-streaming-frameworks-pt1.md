---
title: Comparing Apache Spark, Storm, Flink and Samza stream processing engines -
  Part 1
date: 2018-07-06 00:00:00 Z
categories:
- Data Engineering
author: acarr
contributors:
- aaspellc
layout: default_post
summary: Distributed stream processing engines have been on the rise in the last few
  years, first Hadoop became popular as a batch processing engine, then focus shifted
  towards stream processing engines. Stream processing engines can make the job of
  processing data that comes in via a stream easier than ever before.
image: aaspellc/assets/stream-processing.jpeg
---

[DAG]:                       {{site.github.url}}/aaspellc/assets/directed-acyclic-graph.jpeg "Directed Acyclic Graph"
[Apache Storm Architecture]: {{site.github.url}}/aaspellc/assets/apache-storm-architecture.jpeg "Apache Storm Architecture"
[Apache Storm Stage Output]: {{site.github.url}}/aaspellc/assets/apache-storm-stage-output.jpeg "Apache Storm Stage Output"
[Apache Spark Architecture]: {{site.github.url}}/aaspellc/assets/apache-spark-architecture.jpeg "Apache Spark Architecture"
[Apache Samza Architecture]: {{site.github.url}}/aaspellc/assets/apache-samza-architecture.jpeg "Apache Samza Architecture"
[Flink Data Flow]:           {{site.github.url}}/aaspellc/assets/flink-data-flow.jpeg "Flink Data Flow"

[Part 1]: {{site.github.url}}/aaspellc/_posts/2018-07-09-comparing-streaming-frameworks-pt1.md "Part 1"
[Part 2]: {{site.github.url}}/aaspellc/_posts/2018-07-16-comparing-streaming-frameworks-pt2.md "Part 2"


## The rise of stream processing engines
Distributed stream processing engines have been on the rise in the last few years, first Hadoop became popular
as a batch processing engine, then focus shifted towards stream processing engines. Stream processing engines
can make the job of processing data that comes in via a stream easier than ever before and by using clustering
can enable processing data in larger sets in a timely manner. Handling error scenarios, providing common
processing functions, and making data manipulation easier - a great example is the SQL like syntax that is
becoming common to process streams such as [KSQL](https://www.confluent.io/blog/tag/ksql/) for Kafka and
[Spark SQL](https://spark.apache.org/sql/) for Apache Spark. I'll look at the SQL like manipulation
technologies in another blog as they are a large use case in themselves.

In part 1 we will show example code for a simple wordcount stream processor in four different stream
processing systems and will demonstrate why coding in Apache Spark or Flink is so much faster and easier than
in Apache Storm or Samza.
In part 2 we will look at how these systems handle checkpointing, issues and
failures.

Apache Spark is the most popular engine which supports stream processing<sup>[\[1\]](#footnote1)</sup> - with
an increase of 40% more jobs asking for Apache Spark skills than the same time last year according to IT Jobs
watch. This compares to only a 7% increase in jobs looking for Hadoop skills in the same period.


<a name="footnote1"><sup>\[1\]</sup></a> : <font size="1">Technically Apache Spark previously only supported
pseudo stream processing - which was more accurately called Micro batching, but in Spark 2.3 has introduced <a
href="https://databricks.com/blog/2018/03/20/low-latency-continuous-processing-mode-in-structured-streaming-in-apache-spark-2-3-0.html">
Continuous Processing Execution</a> mode which has very low latency like a true stream processing
engine.</font>


## What are they?
What really is a stream processing engine? Well they are libraries and run-time engines, which
enable the developer to write code to do some form of processing on data which comes in as a stream
without having to worry about all the lower level mechanics of the stream itself. Some of them also
have lots of standard algorithms out of the box to enable different types of processing, such as the
MLLib Machine Learning algorithms in Apache Spark.

Processing engines in general typically consider the process pipeline, the functions that the
processes goes through, in terms of a [Directed Acyclic
Graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) or DAG. This is where the processing
can go through functions in a particular order, where the functions can be chained together, but the
processing must never go back to an earlier point in the graph as in the diagram below.

![Directed Acyclic Graph][DAG]


### Types of processing engines

There are two main types of processing engines

  + **Declarative** - where you simply chain functions together, and the engine works out the correct DAG, and then pumps the data through
  + **Compositional** - where the developer explicitly defines the DAG, and then pumps the data through

In **Declarative** engines such as Apache Spark and Flink the coding will look very functional, as
is shown in the examples below. Plus the user may imply a DAG through their coding, which could be
optimised by the engine.

In **Compositional** engines such as Apache Storm, Samza, Apex the coding is at a lower level, as
the user is explicitly defining the DAG, and could easily write a piece of inefficient code, but
_the code is at complete control of the developer_.

To see the two types in action, let's consider a simple piece of processing, a word count on a
stream of data coming in. The word count is the processing engine equivalent to printing "`hello
world`". So we are looking to stream in some fixed sentences and then count the words coming out. To
compare the two approaches let's consider solutions in frameworks that implement each type of engine.


### Apache Storm Architecture and example Word Count
The Apache Storm Architecture is based on the concept of Spouts and Bolts. Spouts are sources of
information and push information to one or more Bolts, which can then be chained to other Bolts and
the whole topology becomes a DAG. The topology - how the Spouts and Bolts are connected together is
explicitly defined by the developer.

Once the topology is up, it stays up processing data pushed into the network via a Spout until the
network is stopped.

![Apache Storm Architecture][Apache Storm Architecture]

To do a Word Count example in Apache Storm, we need to create a simple Spout which generates
sentences to be streamed to a Bolt which breaks up the sentences into words, and then another Bolt
which counts word as they flow through.

The output at each stage is shown in the diagram below.

![Apache Storm Stage Output][Apache Storm Stage Output]


The following example is taken from the [ADMI Workshop Apache Storm Word Count](http://admicloud.github.io/www/storm.html).

The first piece of code is a Random Sentence Spout to generate the sentences.

~~~java
public class RandomSentenceSpout extends BaseRichSpout {
  SpoutOutputCollector _collector;
  Random _rand;


  @Override
  public void open(Map conf, TopologyContext context, SpoutOutputCollector collector) {
    _collector = collector;
    _rand = new Random();
  }

  @Override
  public void nextTuple() {
    Utils.sleep(100);
    String[] sentences = new String[]{ "the cow jumped over the moon", "an apple a day keeps the doctor away",
        "four score and seven years ago", "snow white and the seven dwarfs", "i am at two with nature" };
    String sentence = sentences[_rand.nextInt(sentences.length)];
    _collector.emit(new Values(sentence));
  }

  @Override
  public void ack(Object id) {
  }

  @Override
  public void fail(Object id) {
  }

  @Override
  public void declareOutputFields(OutputFieldsDeclarer declarer) {
    declarer.declare(new Fields("word"));
  }
}
~~~

Then you need a Bolt to split the sentences into words.

~~~java
public static class SplitSentence extends BaseBasicBolt {
    @Override
    public void declareOutputFields(OutputFieldsDeclarer declarer) {
      declarer.declare(new Fields("word"));
    }

    @Override
    public Map<String, Object> getComponentConfiguration() {
      return null;
    }

    public void execute(Tuple tuple, BasicOutputCollector basicOutputCollector) {
      String sentence = tuple.getStringByField("sentence");
      String words[] = sentence.split("\\s+");
      for (String w : words) {
        basicOutputCollector.emit(new Values(w));
      }
    }
}

~~~

Then you need a Bolt which counts the words

~~~java
public static class WordCount extends BaseBasicBolt {
    Map<String, Integer> counts = new HashMap<String, Integer>();

    @Override
    public void execute(Tuple tuple, BasicOutputCollector collector) {
      String word = tuple.getString(0);
      Integer count = counts.get(word);
      if (count == null)
        count = 0;
      count++;
      counts.put(word, count);
      collector.emit(new Values(word, count));
    }

    @Override
    public void declareOutputFields(OutputFieldsDeclarer declarer) {
      declarer.declare(new Fields("word", "count"));
    }
}
~~~

Lastly you need to build the topology, which is how the DAG gets defined.

~~~java
public static void main(String[] args) throws Exception {
    TopologyBuilder builder = new TopologyBuilder();
    builder.setSpout("spout", new RandomSentenceSpout(), 5);
    builder.setBolt("split", new SplitSentence(), 8).shuffleGrouping("spout");
    builder.setBolt("count", new WordCount(), 12).fieldsGrouping("split", new Fields("word"));

    Config conf = new Config();
    conf.setDebug(true);

    if (args != null && args.length > 0) {
      conf.setNumWorkers(3);

      StormSubmitter.submitTopologyWithProgressBar(args[0], conf, builder.createTopology());
    } else {
      conf.setMaxTaskParallelism(3);
      LocalCluster cluster = new LocalCluster();
      cluster.submitTopology("word-count", conf, builder.createTopology());
      Thread.sleep(10000);
      cluster.shutdown();
    }
}
~~~

This is a [compositional engine](#types-of-processing-engines) and as can be seen from this example, there is
quite a lot of code to get the basic topology up and running and a word count working. This is in clear
contrast to Apache Spark.


### Apache Spark Architecture and example Word Count

The Apache Spark Architecture is based on the concept of
[RDDs](https://spark.apache.org/docs/latest/rdd-programming-guide.html) or Resilient Distributed
Datasets, or essentially distributed immutable tables of data, which are split up and sent to
Workers to be executed by their Executors. It is very similar to the
[MapReduce](https://en.wikipedia.org/wiki/MapReduce) concept of having a controlling process and
delegate processing to multiple nodes, which each do their own piece of processing and then combine
the results to make a complete final result.
For Apache Spark the RDD being immutable,
so no worker node can modify it;
only process it and output some results,
lends itself well to the
Functional and Set theory based programming models (such as SQL).

![Apache Spark Architecture][Apache Spark Architecture]


The Apache Spark word count example (taken from
[https://spark.apache.org/examples.html](https://spark.apache.org/examples.html) ) can be seen as
follows

~~~java
JavaRDD<String> textFile = sc.textFile("hdfs://...");
JavaPairRDD<String, Integer> counts = textFile
    .flatMap(s -> Arrays.asList(s.split("\\s+")).iterator())
    .mapToPair(word -> new Tuple2<>(word, 1))
    .reduceByKey((a, b) -> a + b);
counts.saveAsTextFile("hdfs://...");
~~~

This code is essentially just reading from a file, splitting the words by a space, creating
a Tuple which includes each word and a number (1 to start with), and then bringing them all
together and adding the counts up.

None of the code is concerned explicitly with the DAG itself, as Spark uses a [declarative
engine](#types-of-processing-engines), the code defines just the functions that need to be performed on the
data. The Spark framework implies the DAG from the functions called.


### Apache Flink Architecture and example Word Count

Apache Flink uses the concept of Streams and Transformations which make up a flow of data through
its system. Data enters the system via a "Source" and exits via a "Sink"

![Flink Data Flow][Flink Data Flow]

To create a Flink job maven is used to create a skeleton project that has all of the dependencies
and packaging requirements setup ready for custom code to be added.

~~~shell
mvn archetype:generate -DarchetypeGroupId=org.apache.flink -DarchetypeArtifactId=flink-quickstart-java -DarchetypeVersion=1.5.0
~~~

Maven will ask for a group and artifact id. for our example wordcount we used `uk.co.scottlogic` as
the groupId and `wc-flink` as the artifactId.

Once maven has finished creating the skeleton project we can edit the `StreamingJob.java` file and
change the main function in line with the [Flink wordcount example on
github](https://github.com/apache/flink/blob/master/flink-examples/flink-examples-streaming/src/main/java/org/apache/flink/streaming/examples/wordcount/WordCount.java):

~~~java
public static void main(String[] args) throws Exception {
    // set up the streaming execution environment
    final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
    String textPath = "<text file name>";
    DataStreamSource<String> text = env.readTextFile(textPath);
    DataStream<Tuple2<String, Integer>> counts =
            // split up the lines into pairs (2-tuples) containing: (word,1)
            text.flatMap(new Tokenizer())
                    // group by the tuple field "0" and sum up tuple field "1"
                    .keyBy(0).sum(1);

    counts.writeAsText("<output directory>/wcflink.results");
    env.execute("Streaming WordCount");
}
~~~

We also added the `Tokenizer` class from the example:

~~~java
public static final class Tokenizer implements FlatMapFunction<String, Tuple2<String, Integer>> {
   private static final long serialVersionUID = 1L;
   @Override
   public void flatMap(String value, Collector<Tuple2<String, Integer>> out)
           throws Exception {
       String[] tokens = value.toLowerCase().split("\\s+");
       for (String token : tokens) {
           if (token.length() > 0) {
               out.collect(new Tuple2<String, Integer>(token, 1));
           }
       }
   }
}
~~~

We can now compile the project and execute it

~~~shell
mvn clean package
<fLink root dir>/bin/flink-1.5.0/bin/flink run ./target/wc-flink-1.0-SNAPSHOT.jar
~~~

The results of the wordcount operations will be saved in the file `wcflink.results` in the output
directory specified.

Flink also uses a [declarative engine](#types-of-processing-engines) and the DAG is implied by the ordering of
the transformations (flatmap -> keyby -> sum). If the engine detects that a transformation does not depend on
the output from a previous transformation, then it can reorder the transformations.


### Apache Samza Architecture and example Word Count

Apache Samza is based on the concept of a Publish/Subscribe Task that listens to a data stream,
processes messages as they arrive and outputs its result to another stream. A stream can be
broken into multiple partitions and a copy of the task will be spawned for each partition.

Apache Samza relies on third party systems to handle :

 * The streaming of data between tasks (Apache Kafka, _which has a dependency on Apache zookeeper_)
 * The distribution of tasks among nodes in a cluster (Apache Hadoop YARN)

Streams of data in Kafka are made up of multiple partitions (based on a key value). A Samza Task
consumes a Stream of data and multiple tasks can be executed in parallel to consume all of the
partitions in a stream simultaneously.

Samza tasks execute in YARN containers. YARN will distribute the containers over a multiple nodes
in a cluster and will evenly distribute tasks over containers.

The following diagram shows how the parts of the Samza word count example system fit together.
 Data enters the system via a Kafka topic. Samza tasks are executed in YARN containers and
 listen for data from a Kafka topic. When data arrives on the Kafka topic the Samza task
 executes and performs its processing. The Samza task then sends its output to another Kafka
 topic (which will also store the topic messages using zookeeper).

At the end of the word count pipeline, we use a console to view the Kafka topic that the word
 count is sending it's output to.

![Apache Samza Architecture][Apache Samza Architecture]

To define a streaming topology in Samza you must explicitly define the inputs and outputs of
the Samza tasks before compilation. Once the application has been compiled the topology is
fixed as the definition is embedded into the application package which is distributed to YARN.

An update to the topology would entail:

  * Stopping the existing tasks in YARN.
  * Recompiling the application package.
  * Distributing the new application package to YARN.

To create a word count Samza application we first need to get a feed of lines into the system. We
do this by creating a file reader that reads in a text file publishing it's lines to a Kafka topic.

_ReadFile.java_

~~~java
package uk.co.scottlogic.wordcount;
public class ReadFile {
    private final static String TOPIC = "sl-lines";
    private final static String BOOTSTRAP_SERVERS = "localhost:9092,localhost:9093,localhost:9094";
    private long index = 0;

    private static Producer<Long, String> createProducer() {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        props.put(ProducerConfig.CLIENT_ID_CONFIG, "kafka");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, LongSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        return new KafkaProducer<>(props);
    }

    void runProducer(final String filename) throws Exception {
        final Producer<Long, String> producer = createProducer();
        long time = System.currentTimeMillis();
        index = 0;

        try (Stream<String> stream = Files.lines(Paths.get(filename))) {
            Consumer<String> consumerNames = line -> {
                try {
                    RecordMetadata metadata = producer.send(new ProducerRecord<>(TOPIC, index++, line.trim())).get();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            };
            stream.forEach(consumerNames);

        } finally {
            producer.close();
        }
    }

    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Please specify a filename");
        } else {
            try {
                new ReadFile().runProducer(args[0]);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
~~~

The next step is to define the first Samza task. This Samza task will split the incoming lines into
words and output the words onto another Kafka topic. To do this we create a java class that
implements the `org.apache.samza.task.StreamTask` interface.

_SplitLineTask.java_

~~~java
package uk.co.scottlogic.wordcount;
public class SplitLineTask implements StreamTask {
    private static final SystemStream OUTPUT_STREAM = new SystemStream("kafka", "sl-words");
    @Override
    public void process(IncomingMessageEnvelope envelope, MessageCollector collector, TaskCoordinator coordinator) {
        String message = (String) envelope.getMessage();
        String[] words = message.split("\\s+"); // split line on one or more whitespace
        for (String word : words) {
            try {
                collector.send(new OutgoingMessageEnvelope(OUTPUT_STREAM, word, word));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
~~~

The `process()` function will be executed every time a message is available on the Kafka stream it
is listening to. To define the stream that this task listens to we create a configuration file.
This file defines what the job will be called in YARN, where YARN can find the package that the
executable class is included in. it also defines the Kafka topic that this task will listen to and
how the messages on the incoming and outgoing topics are formatted.

_sl-splittask.properties_

~~~
# Job
job.factory.class=org.apache.samza.job.yarn.YarnJobFactory
job.name=sl-splittask

# YARN
yarn.package.path=file://${basedir}/target/${project.artifactId}-${pom.version}-dist.tar.gz

# Task
task.class=uk.co.scottlogic.wordcount.SplitLineTask
task.inputs=kafka.sl-lines

# Serializers
serializers.registry.string.class=org.apache.samza.serializers.StringSerdeFactory
serializers.registry.long.class=org.apache.samza.serializers.LongSerdeFactory

# Systems
systems.kafka.samza.factory=org.apache.samza.system.kafka.KafkaSystemFactory
systems.kafka.samza.key.serde=string
systems.kafka.samza.msg.serde=string
systems.kafka.consumer.zookeeper.connect=localhost:2181/
systems.kafka.consumer.auto.offset.reset=largest
systems.kafka.producer.bootstrap.servers=localhost:9092

systems.kafka.streams.sl-words.samza.key.serde=string
systems.kafka.streams.sl-words.samza.msg.serde=string

streams.sl-words.samza.key.serde=string
streams.sl-words.samza.msg.serde=string
~~~

We now need a task to count the words. For this we create another class that implements
the `org.apache.samza.task.StreamTask` interface.

_WordCountTask.java_

~~~java
package uk.co.scottlogic.wordcount;
public class WordCountTask implements StreamTask, WindowableTask {
    private static final SystemStream OUTPUT_STREAM = new SystemStream("kafka", "sl-wordtotals");
    private Map<String, Integer> wordCountsWindowed = new HashMap<String, Integer>();

    @Override
    public void process(IncomingMessageEnvelope envelope, MessageCollector collector, TaskCoordinator coordinator) {
        String word = (String) envelope.getMessage();
        Integer count = wordCountsWindwd.get(word.toLowerCase());
        if (count == null) count = 0;
        count++;
        wordCountsWindowed.put(word.toLowerCase(), count);
    }

    @Override
    public void window(org.apache.samza.task.MessageCollector collector, org.apache.samza.task.TaskCoordinator coordinator) throws Exception {
        // send wordcounts to stream
        try {
            for (String key : wordCountsWindowed.keySet()) {
                collector.send(new OutgoingMessageEnvelope(OUTPUT_STREAM,
                        key,
                        key + ":" + wordCountsWindowed.get(key)));
            }
        } catch (Exception e) {
                e.printStackTrace();
        }

        // Reset wordcounts after windowing.
        wordCountsWindowed = new HashMap<String, Integer>();
    }
}
~~~

This task also implements the `org.apache.samza.task.WindowableTask` interface to allow it to handle a continuous stream
of words and output the total number of words that it has processed during a specified time window.
This task also needs a configuration file.

_sl-wordcount.properties_

~~~
# Job
job.factory.class=org.apache.samza.job.yarn.YarnJobFactory
job.name=sl-wordcount

# YARN
yarn.package.path=file://${basedir}/target/${project.artifactId}-${pom.version}-dist.tar.gz

# Task
task.class=uk.co.scottlogic.wordcount.WordCountTask
task.inputs=kafka.sl-words
task.window.ms=10000
# Serializers

serializers.registry.string.class=org.apache.samza.serializers.StringSerdeFactory
serializers.registry.integer.class=org.apache.samza.serializers.IntegerSerdeFactory

# Kafka System
systems.kafka.samza.factory=org.apache.samza.system.kafka.KafkaSystemFactory
systems.kafka.samza.key.serde=string
systems.kafka.samza.msg.serde=string
systems.kafka.consumer.zookeeper.connect=localhost:2181/
systems.kafka.producer.bootstrap.servers=localhost:9092

systems.kafka.streams.sl-words.samza.key.serde=string
systems.kafka.streams.sl-words.samza.msg.serde=string

streams.sl-words.samza.key.serde=string
streams.sl-words.samza.msg.serde=string


systems.kafka.streams.sl-wordtotals.samza.key.serde=string
systems.kafka.streams.sl-wordtotals.samza.msg.serde=string

streams.sl-wordtotals.samza.key.serde=string
streams.sl-wordtotals.samza.msg.serde=string
~~~

This configuration file also specifies the name of the task in YARN and where YARN can find the
Samza package. It also specifies the input and output stream formats and the input stream to listen
to. This configuration file also specifies the time window that the `WordCount` task will use
(`task.window.ms`).

When these files are compiled and packaged up into a Samza Job archive file, we can execute the
Samza tasks. First, we need to make sure that YARN, Zookeeper and Kafka are running.
Once the systems that Samza uses are running we can extract the Samza package archive and then
execute the tasks by using a Samza supplied script as below:

~~~bash
$PRJ_ROOT/tmp/bin/run-job.sh --config-factory=org.apache.samza.config.factories.PropertiesConfigFactory --config-path=file://$PRJ_ROOT/tmp/config/sl-splittask.properties
~~~

In this snippet `$PRJ_ROOT` will be the directory that the Samza package was extracted into. The
Samza supplied run-job.sh executes the `org.apache.samza.job.JobRunner` class and passes it the
configuration file for our line splitter class `SplitTask`. Samza then starts the task specified in
the configuration file in a YARN container. We can then execute the word counter task

~~~bash
$PRJ_ROOT/tmp/bin/run-job.sh --config-factory=org.apache.samza.config.factories.PropertiesConfigFactory --config-path=file://$PRJ_ROOT/tmp/config/sl-wordcount.properties
~~~

To be able to see the word counts being produced we will start a new console window and run the
Kafka command line topic consumer

~~~bash
$KAFKA_DIR/bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic sl-wordtotals
~~~

We can now publish data into the system and see the word counts being displayed in the console window

~~~bash
$PRJ_ROOT/tmp/bin/run-class.sh uk.co.scottlogic.wordcount.ReadFile <filename>
~~~

We should now see wordcounts being emitted from the Samza task stream at intervals of 10 seconds
(as specified in the `sl-wordtotals.properties` file).

As well as the code examples above, the creation of a Samza package file needs a Maven pom build
file and an xml file to define the contents of the Samza package file. These build files need to be
correct as they create the Samza job package by extracting some files (_such as the `run-job.sh`
script_) from the Samza archives and creating the tar.gz archive in the correct format. To conserve
space these essential files have not been shown above.

Apache Samza uses a [compositional engine](#types-of-processing-engines) with the topology of the Samza job
explicitly defined in the codebase, but not in one place, it is spread out over several files with input
streams being specified in the configuration files for each task and output streams being specified in each
task's code.

The stream names are text string and if any of the specified streams do not match (output of one task to the
input of the next) then the system will not process data. To deploy a Samza system would require extensive
testing to make sure that the topology is correct.

This makes creating a Samza application error prone and difficult to change at a later date.


## What are stream processing engines good for?

Why use a stream processing engine at all? When does it beat writing your own code to process a stream?

Stream processing engines allow manipulations on a data set to be broken down into small steps. Each
step can be run on multiple parts of the data in parallel which allows the processing to scale: as
more data enters the system, more tasks can be spawned to consume it.

From the above examples we can see that the ease of coding the wordcount example in Apache Spark and Flink is
an order of magnitude easier than coding a similar example in Apache Storm and Samza, so if implementation
speed is a priority then Spark or Flink would be the obvious choice. If you need complete
control over how the DAG is formed then Storm or Samza would be the choice.

Apache Spark also offers several libraries that could make it the choice of engine if, for example,  you need
to access an SQL database (Spark SQL) or machine learning (MLlib).

Given all this, in the vast majority of cases Apache Spark is the correct choice due to its extensive out of the box features and ease of coding.


In financial services there is a huge drive in moving from batch processing where data is sent between systems
by batch to stream processing. A typical use case is therefore
[ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) between systems. Apache Spark is a good example
of a streaming tool that is being used in many ETL situations. But as well as ETL, processing things in real
or pseudo real time is a common application. Another example is processing a live price feed monitoring for
prices to hit a high or a low and then trigger off some processing is a good example. Risk calculations are
another and are typically moving from daily batch processing to real time live processing, as companies want
to understand their exposure as and when it happens.

Each of these frameworks has it's own pros and cons, but using any of them frees developers from having to
implement complex multiprocessing and data synchronisation architectures.

In this post we looked at implementing a simple wordcount example in the frameworks. in Part 2
we will look at how these systems handle checkpointing, issues and failures.
