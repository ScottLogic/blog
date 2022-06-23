---
published: true
author: dogle
title: Apache Storm Taster
layout: default_post
summary: >-
  A quick look at Apache Storm with a short word count walk-through example
  using a Redis Database.
tags: 'Storm, Redis, Java'
categories:
  - Tech
image: dogle/assets/storm-taster/storm-flow.png
---
In this post I am going to have a look at [Apache Storm](http://storm.apache.org/) and put together a small example using Java with [Apache Maven](https://maven.apache.org/) based on ["Getting Started With Storm"](http://ifeve.com/wp-content/uploads/2014/03/Getting-Started-With-Storm-Jonathan-Leibiusky-Gabriel-E_1276.pdf).

First things first, what exactly is Storm? The official website describes it as:

> ...a free and open source distributed realtime computation system

...right, so that’s clear then. So just in case you are still a bit unsure I’ll try to clarify. Storm is an Event Processor. That means that we can hook it up to a stream or multiple streams of data, run some processing on the data in a distributed manner, and output the result.
Storm is split conceptually into three parts.

## Spouts ## 
The Spout, as suggested by the name is the responsible for streaming the data. There can be multiple Spouts but each should emit a stream of data. For example a Spout could connect to a message queue like Kafka or RabbitMQ or we could use a data source such as Twitter’s Streaming API and emit Tweets from the Spout.

## Bolts ##
 A Bolt (less intuitively) connects to a Spout or to another Bolt. The Bolt is the part of the infrastructure that is going to do the actually processing jobs on the data.  Each bolt takes an input and can optionally emit an output.

## Topology ##
 Our network of Spouts and Bolts is packaged up as a Topology. The Topology defines what streams the Bolts will receive and once started will run forever until the process is killed.
 
![Storm flow]({{site.baseurl}}/dogle/assets/storm-taster/storm-flow.png)

## Distribution ##
A Storm cluster is generally run on multiple machines and tasks are run concurrently across multiple threads managed by a master **Nimbus** node aided by [Apache ZooKeeper](https://zookeeper.apache.org/) framework. A single machine in a Storm cluster will run one or more **Worker Processes** that are each responsible for at least one Topology. These Worker Processes run threads called **Executors** for each Topology. The Executors run **Tasks** for the Spouts and Bolts. The number of Worker Processes, Executors and Tasks for a Topology is all configurable in Storm. A much more comprehensive description of the parallelism in Storm can be found [here](http://storm.apache.org/releases/1.1.1/Understanding-the-parallelism-of-a-Storm-topology.html).
This provides us with a real-time data processing system that we can build however we like, is horizontally scalable and highly configurable.

## Example ##
Enough talk, let's get stuck in and look at an example. The first thing to do is fire up your favourite text editor and create a new Java Maven project.
Add a couple of empty packages called `spouts` and `bolts` and you should have a project structure that looks a little like this:

~~~
src
 +--main
 |   +--java
 |   |   +-bolts
 |   |   +-spouts
 |   +-resources
pom.xml
~~~

Once you have this add a dependency to your `pom.xml` file for Storm

{% highlight xml %}
...
    <repositories>
        <!-- Repository where we can found the storm dependencies -->
        <repository>
            <id>central</id>
            <url>http://repo1.maven.org/maven2</url>
        </repository>
    </repositories>
    <dependencies>
        <!-- Storm Dependency -->
        <dependency>
            <groupId>org.apache.storm</groupId>
            <artifactId>storm-core</artifactId>
            <version>1.1.1</version>
        </dependency>
    </dependencies>
{% endhighlight sql %}

The complete `pom.xml` can be found [here](https://github.com/dogle-scottlogic/storm-taster/commit/cb70212b7e74a1845cf10b125f64d433e13be71a#diff-600376dffeb79835ede4a0b285078036)

Now before we go any further we are going to need some data to stream. In your `src/main/resources` folder create a new file `words.txt` and fill this with some text. I've used 'Address to a Haggis' by Robert Burns which you can get [here](https://github.com/dogle-scottlogic/storm-taster/commit/cb70212b7e74a1845cf10b125f64d433e13be71a#diff-ad7a1c2b777648f6d5f84a0a5f912b80), but you can put anything you like in here.

### Create a Spout ###
Next we're going to create a new Spout component to stream the lines from our `words.txt` file. Inside the `spouts` package create a new Java file called `WordReader.java`.

The code for this file should look like this:

~~~java
package spouts;

import org.apache.storm.spout.SpoutOutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichSpout;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Values;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Map;

public class WordReader extends BaseRichSpout {

    private SpoutOutputCollector collector;
    private FileReader fileReader;
    private boolean completed = false;

    // Called when Storm detects a tuple emitted successfully
    public void ack(Object msgId) {
        System.out.println("SUCCESS: " + msgId);
    }

    // Called when a tuple fails to be emitted
    public void fail(Object msgId) {
        System.out.println("ERROR: " + msgId);
    }

    public void close() {
    }

    // Called when a task for this component is initialized within a worker on the cluster.
    public void open(Map conf, TopologyContext context, SpoutOutputCollector collector) {
        try {
            // new reader with the words.txt file passed from the config
            this.fileReader = new FileReader(conf.get("wordsFile").toString());
        } catch (FileNotFoundException e) {
            throw new RuntimeException("Error reading file [" + conf.get("wordFile") + "]");
        }
        this.collector = collector;
    }

    public void nextTuple() {
        /**
         * NextTuple either emits a new tuple into the topology or simply returns if there are no new tuples to emit
         */
        if (completed) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println("Error: " + e.getMessage());
            }
            return;
        }
        String line;
        //Open the reader
        BufferedReader reader = new BufferedReader(fileReader);
        try {
            //Read all lines
            while ((line = reader.readLine()) != null) {
                /**
                 * For each line emmit a new value
                 */
                this.collector.emit(new Values(line), line);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error reading tuple", e);
        } finally {
            completed = true;
        }
    }

    // The declareOutputFields function declares the output fields ("line") for the component.
    public void declareOutputFields(OutputFieldsDeclarer declarer) {
        declarer.declare(new Fields("line"));
    }
}
~~~

Let's have a quick look at what is going on here.
First our class extends the `BaseRichSpout` abstract class from the Storm library. This requires us to implement a few methods.

#### `ack` ####
`ack` is called when the Spout successfully emits a tuple, in this case we are just going to print an acknowledgement to the console.

#### `fail` ####
The opposite of `ack`, `fail` is called when the Spout fails to emit a tuple. Again we will just log to the console.

#### `open` ####
`open` is called when a task for this Spout is initialized by a Worker on the Storm cluster. It takes a configuration Map, a context and a collector. We can pass values to the Spout from the Topology setup using the configuration Map. In this case we are going to pass in the file path for our `words.txt` file.

~~~java
this.fileReader = new FileReader(conf.get("wordsFile").toString());
~~~

So when our Spout is called we are going to set up the `FileReader` with the right file-path and initialise the collector which we will use later to emit an output from the spout.

#### `nextTuple` ####
Storm expects Spouts to emit [Tuples](https://storm.apache.org/releases/0.9.6/javadocs/backtype/storm/tuple/Tuple.html). These are named lists of values where the value can be of any type. `nextTuple` is the method that Storm will call whenever it is ready for a new tuple. In a 'real-world' use case the spout would simply be called continuously until the cluster is shutdown. In this instance we are using a *completed* flag to simply return from the method once we have emitted all the lines of text from our file.

#### `declareOutputFields` ####
Each Spout must declare it's output. Here we declare that our Spout emits one tuple with a single field called "line".

### Word Normalizer Bolt ###
Great! Now we have a Spout defined that's going to spit out a line from our text file each time it's called. Next thing we are going to need is a Bolt to attach to that Spout and do some processing. We're going to perform a word count on our text file so we'll create a Bolt to split the line into words and one to perform the count.
First step is to create a Java file under `bolts` called `WordNormalizer.java`, it should look like this:

~~~java
package bolts;

import org.apache.storm.topology.BasicOutputCollector;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseBasicBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;

public class WordNormalizer extends BaseBasicBolt {


    // The execute method receives a tuple from one of the bolt's inputs
    // It performs an operation on the input and can also emit a new value.
    // In this example we take the line of text, split it into words and trim the words.
    // Then we emit each word.
    @Override
    public void execute(Tuple input, BasicOutputCollector collector) {
        String line = input.getString(0);
        String[] words = line.split(" ");
        for (String word : words) {
            word = word.trim();
            if (!word.isEmpty()) {
                word = word.toLowerCase();
                collector.emit(new Values(word));
            }
        }
    }

    // As in the spouts we must declare any outputs.
    @Override
    public void declareOutputFields(OutputFieldsDeclarer declarer) {
        declarer.declare(new Fields("word"));
    }
}
~~~

This time we extend the `BaseBasicBolt` class but are only required to implement two methods.

#### `execute` ####
This method is fairly self-explanatory, it is the method called when the Bolt receives a tuple from the component it is connected to. In this case we are going to use the input (our line of text), split it into words 

~~~java
String[] words = line.split(" ");
~~~ 

then for each word we will trim the white space and if it's not an empty string emit the word as an output.

#### `declareOutputFields` ####
Because we are emitting an output from this Bolt we have to declare it same as we do in our Spout.

### Word Counter Bolt ###
Next up is the bolt to count the words. Again under `bolts` create a new Java file `WordCounter.java`. It should look like this:

~~~java
package bolts;

import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.BasicOutputCollector;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseBasicBolt;
import org.apache.storm.tuple.Tuple;

import java.util.Map;

public class WordCounter extends BaseBasicBolt {

    Integer id;
    String name;
    Map<String, Integer> counters;

    @Override
    // This should be called when the cluster is shutdown in Local mode only
    public void cleanup() {
        System.out.println("-- Word Counter ["+name+"-"+id+"] --");
        for(Map.Entry<String, Integer> entry : counters.entrySet()){
            System.out.println(entry.getKey()+": "+entry.getValue());
        }
    }

    @Override
    // Called before the bolt is run
    public void prepare(Map conf, TopologyContext context) {
        this.name = context.getThisComponentId();
        this.id = context.getThisTaskId();
    }

    @Override
    public void execute(Tuple input, BasicOutputCollector collector) {
        String word = input.getString(0);

        if(!counters.containsKey(word)){
            counters.put(word, 1);
        }else{
            Integer c = counters.get(word) + 1;
            counters.put(word, c);
        }
    }

    @Override
    public void declareOutputFields(OutputFieldsDeclarer declarer) {
    }
}
~~~

This time our Bolt is a little bigger. Let's start with the bits we already know about.

#### `execute` ####
takes the word from the `WordNormalizer` Bolt and if it isn't found in the global `counters` map adds it with a count of 1. If it is found we simply increment the count. There is no output so we don't use the collector.

#### `declareOutputFields` ####
We can leave this empty as we don't have an output.

#### `prepare` ####
This method is optional and is called once when the Bolt is initialised the same as the `open` method in our Spout. We are going to use it here to store the id's from the component and the task.

#### `cleanup` ####
This method may be called when the Bolt shuts down. However there is no guarantee that the method will be called and it will only be called if Storm is run using debug mode in a local cluster. We we only use it here to print the results of the word count when we have finished streaming our file and will remove it later.

### Create a Topology ###
Now we have all the pieces of the puzzle we need it's time to package them all together as a Topology. Create another Java file  `TopologyMain.java` in the `java` folder.

~~~java
import bolts.WordCounter;
import bolts.WordNormalizer;
import org.apache.storm.Config;
import org.apache.storm.LocalCluster;
import org.apache.storm.tuple.Fields;
import org.apache.storm.topology.TopologyBuilder;
import spouts.WordReader;

import java.io.File;

public class TopologyMain {
    public static void main(String[] args) throws InterruptedException {
        String path = new File("src/main/resources/words.txt").getAbsolutePath();

        // Topology definition
        TopologyBuilder builder = new TopologyBuilder();
        builder.setSpout("word-reader", new WordReader());
        //The spout and the bolts are connected using shuffleGroupings. This type of grouping
        //tells Storm to send messages from the source node to target nodes in randomly distributed
        //fashion.
        builder.setBolt("word-normalizer", new WordNormalizer()).shuffleGrouping("word-reader");
        // Send the same word to the same instance of the word-counter using fieldsGrouping instead of shuffleGrouping
        builder.setBolt("word-counter", new WordCounter()).fieldsGrouping("word-normalizer", new Fields("word"));

        // Configuration
        Config config = new Config();
        config.put("wordsFile", path);
         config.setDebug(true);

        // Run topology
        LocalCluster localCluster = new LocalCluster();
        localCluster.submitTopology("my-first-topology", config, builder.createTopology());
         Thread.sleep(5000);
        localCluster.shutdown();
    }

}
~~~

Let's have a look at what we're doing here line by line:

1. We get the file-path for the text file we are using
2. We create a new Topology builder
3. We use the builder to set our spout with an id of **word-reader**
4. We set our first Bolt and attach it to the Spout using the `shuffleGrouping` method. When we attach Bolts we must tell Storm how the tuples from the Spout should be distributed to instances of our Bolt. The shuffle grouping method will randomly distribute tuples such that each bolt gets an equal number of tuples.
5. Next we add our second Bolt to the first, this time using `fieldsGrouping`. This means that the same word will always be sent to the same Bolt keeping our word count accurate.
6. We create a new `Config` object
7. We add the file-path to the config
8. Set debug mode
9. Create a new Storm local cluster
10. This is the point at which we run the Topology with a given name **my-first-topology**
11. We wait a few seconds for the spout to finish reading the file
12. Lastly we force a shutdown on the cluster.

At this point you should be able to compile and run the code and (if the `cleanup` method is called) view your output in the created `logs` folder. If the `cleanup` is not called you can put a breakpoint into your code to ensure you are getting an output.

This obviously isn't ideal and it would be nice to have a proper output that we could use to hook a front end to for instance. For the last step of this tutorial I have extended this example to pipe the output to a [Redis](https://redis.io/) database hosted in a [Docker](https://www.docker.com/) container. To follow along you will need to spin up a Redis Docker container on your machine. I recommend [`Kitematic`](https://kitematic.com/) if you are using a Windows machine.

### Once more with Redis ###
Ok so the first thing to do is add an extra dependency to your `pom.xml` file for the Redis Client:

{% highlight xml %}
    <!-- Redis Client -->
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>2.9.0</version>
        <type>jar</type>
        <scope>compile</scope>
    </dependency>
{% endhighlight xml %}

Next we'll create a database package alongside **bolts** and **spouts** called **database** and a new Java file inside named `JedisClient.java`.

~~~java
package database;

import redis.clients.jedis.*;

import java.util.Set;

public class JedisClient {

    private Jedis jedis;

    public JedisClient(String host, int port) {
        this.jedis = new Jedis(host, port);
    }

    // Add a tuple to the database
    public void setTuple(String key, String value) {
        try {
            jedis.set(key, value);
        } catch (Exception e) {
            printError(e.getMessage());
        }
    }

    // get a value from the database
    public String getValue(String key) {
        try {
            return jedis.get(key);
        } catch (Exception e) {
            printError(e.getMessage());
        }
        return null;
    }

    // print all the values in the database
    public void printDatabaseValues() {
        Set<String> keys = jedis.keys("*");
        for (String key : keys) {
            System.out.println(key + " : " + jedis.get(key));
        }
    }

    // handle errors
    public void printError(String error) {
        System.out.println(error);
    }
}
~~~

Nothing overly complex here, just a few helper methods for interacting with our database. A method for setting a Tuple, one to retrieve a value, an error handler and a method to print all the values from the database to the console.

Now that we have a database let's look at hooking it up to Storm. Firstly we want to modify the `WordCounter` Bolt, we no longer need the `id`, `name` and `counters` fields so we can replace these with a single `jedis` field.

~~~java
private JedisClient jedis;
~~~

We can also ditch the `cleanup` method as we don't need it and it may not be called in any case. We now need to modify the `prepare` method to initialize the database connection:

~~~java
    public void prepare(Map conf, TopologyContext context) {
        try {
            this.jedis = new JedisClient(conf.get("host").toString(), Integer.parseInt(conf.get("port").toString()));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
~~~

Lastly in the `execute` method rather than store results in a map we are going to send it to the Redis database instead.

~~~java
    public void execute(Tuple input, BasicOutputCollector collector) {
        String word = input.getString(0);

        if (jedis.getValue(word) == null) {
            jedis.setTuple(word, "1");
        } else {
            Integer c = Integer.parseInt(jedis.getValue(word)) + 1;
            jedis.setTuple(word, c.toString());
        }
    }
~~~

You may have noticed that in our modified `prepare` method we are getting the **host** and **port** values from the `conf` object the same way we extract the file-path for the text document, so to finish off we will now need to modify the `TopologyMain` file.
Firstly we need to add a few more global fields:

~~~java
    private static final String path = new File("src/main/resources/words.txt").getAbsolutePath();
    private static final String host = "<Your host address>";
    private static final Integer port = <Your port>;
    private static final Integer timeout = 5000;
~~~

Next we are going to extract the contents of `main` into a method called `runTopology` and add the **host** and **port** fields to the `conf` object:

~~~java
    public static void runTopology() throws InterruptedException {
        // Topology definition
        TopologyBuilder builder = new TopologyBuilder();
        builder.setSpout("word-reader", new WordReader());
        //The spout and the bolts are connected using shuffleGroupings. This type of grouping
        //tells Storm to send messages from the source node to target nodes in randomly distributed
        //fashion.
        builder.setBolt("word-normalizer", new WordNormalizer()).shuffleGrouping("word-reader");
        // Send the same word to the same instance of the word-counter using fieldsGrouping instead of shuffleGrouping
        builder.setBolt("word-counter", new WordCounter()).fieldsGrouping("word-normalizer", new Fields("word"));

        // Configuration
        Config config = new Config();
        config.put("wordsFile", path);
        config.put("host", host);
        config.put("port", port.toString());

        // Run topology
        LocalCluster localCluster = new LocalCluster();
        localCluster.submitTopology("my-first-topology", config, builder.createTopology());
        Thread.sleep(timeout);
        localCluster.shutdown();
    }
~~~

For the final step in the `main` method we will run the topology then print the contents of the database to the console:

~~~java
    public static void main(String[] args) throws InterruptedException {
        runTopology();
        JedisClient jedis = new JedisClient(host, port);
        jedis.printDatabaseValues();
    }
~~~

That's it! If we run the main method we should get a printout to the console that looks a little like this:

~~~
nieve : 2
your : 7
bluidy : 1
thrissle. : 1
feckless : 1
poor : 1
sight, : 1
thro’ : 2
hindmost, : 1
they : 2
pores : 1
whissle; : 1
pow'rs : 1
he'll : 1
mankind : 1
bill : 1
them : 2
then : 1
flood : 1
mill : 1
owre : 2
as : 3
gratefu’ : 1
luggies; : 1
entrails : 1
puddin-race! : 1
dight, : 1
cut : 1
ware : 1
blade, : 1
how : 1
see : 2
are : 2
grace : 1
maist : 1
staw : 1
a : 12
whip-lash, : 1
address : 1
need, : 1
wordy : 1
o : 2
the : 6
fare, : 1
clap : 1
to : 4
sconner, : 1
haggis : 1
but : 1
weel-swall'd : 1
auld : 2
till : 1
legs, : 1
down : 1
scotland : 1
wish : 1
view : 1
care, : 1
chieftain : 1
up : 1
resounds : 1
jaups : 1
face, : 1
bethankit : 1
rich! : 1
knife : 1
guid : 1
fill, : 1
trembling : 1
for : 1
sic : 1
fa' : 1
stretch : 1
bright, : 1
wants : 1
wad : 3
bead. : 1
trencher : 1
horn, : 1
hums. : 1
warm-reekin, : 1
what : 1
there : 2
arms, : 1
time : 1
drive, : 1
mark : 1
honest, : 1
taps : 1
tread, : 1
fair : 1
ye : 6
onie : 1
thairm: : 1
nae : 1
haggis! : 1
her : 3
if : 1
french : 1
burns : 1
groaning : 1
in : 3
ditch; : 1
tripe, : 1
distant : 1
is : 1
it : 1
's : 1
dews : 1
field : 1
place, : 1
then, : 2
devil! : 1
belyve : 1
aboon : 1
deil : 1
out : 1
robert : 1
dinner? : 1
rustic, : 1
mak : 2
glorious : 1
ragout, : 1
skinking : 1
trenching : 1
haggis-fed, : 1
bent : 1
amber : 1
great : 1
drums; : 1
sonsie : 1
help : 1
nit; : 1
dash, : 1
heads : 1
mend : 1
arm. : 1
perfect : 1
sneering, : 1
wi’ : 3
o’ : 3
while : 1
an’ : 5
him : 1
that : 3
looks : 1
trash, : 1
his : 7
pin : 1
o' : 1
rash, : 1
tak : 2
like : 6
wither'd : 1
guidman, : 1
unfit! : 1
my : 1
wha : 1
rive, : 1
horn : 1
rustic-labour : 1
dish : 1
slight, : 1
sned, : 1
scornfu’ : 1
weel : 1
gie : 1
sow, : 1
walie : 1
strive: : 1
their : 2
fricassee : 1
and : 2
ready : 1
of : 1
hurdies : 1
lang : 1
make : 1
spindle : 1
on : 2
hill, : 1
or : 4
will : 1
but, : 1
a' : 2
kytes : 1
painch, : 1
distil : 1
shank : 1
gushing : 1
prayer, : 1
earth : 1
olio : 1
spew : 1
~~~

## What's Next? ##
From here the next steps could be to tweak the parallelism to optimize performance, we could remove the text document and hook the spout to the Twitter streaming API or a Kafka queue. Lastly we can remove the local cluster and deploy for real.

Complete source code for the above example can be found [here](https://github.com/dogle-scottlogic/storm-taster)
