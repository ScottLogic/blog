---
title: Using Kafka and Grafana to monitor meteorological conditions
date: 2017-10-13 00:00:00 Z
categories:
- Data Engineering
tags:
- featured
author: okenyon
layout: default_post
summary: Apache Kafka provides distributed log store used by increasing numbers of companies and often forming the heart of systems processing huge amounts of data. This post shows how to use it for storing meteorological data and displaying this in a graphical dashboard with Graphite and Grafana
image: okenyon/assets/featured/clouds.jpg
---

This post gives an overview of Apache Kafka and using an example use-case, shows how to get up and running with it quickly and easily.

Kafka was originally developed by engineers at LinkedIn, and the context and background of its creation is well explained by the excellent [LinkedIn engineering blog post from 2013](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying). Data on [Google trends](https://trends.google.co.uk/trends/explore?date=today%205-y&q=%2Fm%2F0zmynvd) shows a steady increase in searches for this technology in the years since then and it looks set to continue growing as more companies build event-based solutions.

It is rumoured to have been named after the 20th century novelist, but presumably the aim was not to share characteristics with [topics in the books](https://en.wiktionary.org/wiki/Kafkaesque)!  

## What is Kafka and what is it used for?

At its heart, Kafka is a durable event store, it maintains ordered sequences of entries called topics which are stored on disk and replicated within a cluster. Kafka uses sequential disk writes with minimal amounts of random access, which allows it to be scaled to huge amounts of throughput, with big volumes of data stored, on cheap hardware including spinning disks.

One of the common use-cases for Kafka is to act as a central point for large amounts of incoming data, keeping a medium-term store of the events and allowing multiple consumers to pull in the data they are interested in and process it. Kafka can be used as input to Apache Spark, allowing for real-time alerting, as explained in [The Rise of Big Data Streaming](../../../2017/02/07/the-rise-of-big-data-streaming.html)

One situation where Kafka is a good choice is to ingest data from remote sensors and allow various consumers to monitor this, producing alerts and visualizations. This is likely what BP are doing to monitor their assets: [The Big Data Technologies that Saved BP $7BN](../../../2017/07/18/bp-big-data.html)

There is detailed information about the architecture and internals of Kafka on their site: [https://kafka.apache.org/intro](https://kafka.apache.org/intro)

## An Example use-case

The Met Office is the UK's national weather service, and amongst many other functions, it provides observational data for approximately 140 locations around the country. For each location, data is made available hourly, containing temperature, pressure, wind speed and other information. The Met Office provides a free API allowing access to this data, and the same information is available via their website. One limitation of both API and website is that data is only available for the last 24 hours.

I'm a climber and so am interested in mountain conditions around the UK. For example has the average temperature been low enough over the last few weeks for a particular ice climb to have formed? I would like to see the data and ideally also be alerted when suitable conditions have occurred for long enough. This seems like a perfect job for Kafka:

[![Overview]({{ site.baseurl }}/okenyon/assets/kafka/Diagram.PNG "Overview")]({{ site.baseurl }}/okenyon/assets/kafka/Diagram.PNG)

##Creating the environment

Because Kafka normally depends on Zookeeper, it takes a bit of effort to manually install and configure it. A quick search on docker hub reveals an image created by Spotify which contains both tools, preconfigured. This allows a working instance of Kafka to be spun up in seconds. Similarly, I'm planning to use Graphite and Grafana to create a nice looking dashboard to visualize the data with minimal amounts of work, and these are also available as pre-built docker images.  The below [docker-compose](https://docs.docker.com/compose/) file allows all three services to be launched by issuing a single command:

~~~yaml
version: "3"
services:

  kafka:
    image: spotify/kafka
    hostname: kafka
    container_name: kafka
    volumes:
      - /storage/kafka/kafka-logs:/tmp/kafka-logs
    ports:
      - "2181:2181"
      - "9092:9092"
    environment:
      ADVERTISED_HOST: kafka
      ADVERTISED_PORT: 9092
      LOG_RETENTION_HOURS: 1440

  graphite:
    image: sitespeedio/graphite
    ports:
      - "2003:2003"
      - "2004:2004"
      - "8080:80"

  grafana:
    image: grafana/grafana
    volumes:
      - /storage/grafana:/var/lib/grafana
    ports:
      - "3000:3000"
    links:
      - graphite
~~~

Before typing *docker-compose-up*, create the directories /storage/grafana and /storage/kafka on the host machine. These are mounted as volumes in the containers and give us persistent storage for the data. Kafka is configured here to keep data for 60 days, after which older stuff will be deleted. It would be possible to make this value much higher given the relatively low volume of data coming in, but 2 months is plenty for our purposes.



## Ingesting the data

The first step is to query the Met Office's DataPoint API and obtain some observational data. There is documentation on their site: [DataPoint API](https://www.metoffice.gov.uk/datapoint/product/uk-hourly-site-specific-observations/detailed-documentation). I signed up for a free API key, and tried the endpoints out in the browser. There are three main options

- Data for a specific site of interest
- For all locations at a particular time
- All locations at all available times (giving the last 24 hours).  

I decided to write my data producer in Java, mainly because the official Kafka client libraries are maintained in this language. There are third party clients available for many other languages here: [Kafka clients](https://cwiki.apache.org/confluence/display/KAFKA/Clients)

Historical data is queried first if applicable, then a timer is started to check again every hour and send the new data to Kafka:

~~~java

public void start() {
       if (Config.fetchHistoricalData()) {
           ObservationsResponse observationsResponse = connector.getAllAvailableObservations();
           List<KafkaObservationData> list = processor.process(observationsResponse);
           kafkaSender.send(list);
       }

       Instant firstSampleTime = Config.fetchHistoricalData()
               ? Instant.now().plus(1, ChronoUnit.HOURS)
               : Instant.now();

       Timer timer = new Timer();
       timer.scheduleAtFixedRate(new TimerTask() {
           @Override
           public void run() {
               ObservationsResponse observationsResponse = connector.getLatestObservations();
               List<KafkaObservationData> list = processor.process(observationsResponse);
               kafkaSender.send(list);

           }
       }, Date.from(firstSampleTime), 3600000);
   }
~~~

The connector and processor objects deal with requesting the data from the API and converting it into a list of objects suitable for storing in Kafka. These are available on [GitHub](https://github.com/oliverkenyon/wm-producer) in full. The object we're going to store in Kafka looks like this:

~~~java

public class KafkaObservationData {
    public String dataDate;
    public String locationName;
    public String locationElevation;
    public String windGustMph;
    public String temperatureCelcius;
    public String visibilityMetres;
    public String windDirection;
    public String windSpeedMph;
    public String weatherType;
    public String pressureHpa;
    public String pressureTendencyPaps;
    public String dewPointCelcius;
    public String humidityPercentage;
    public String locationIdentifier;
}
~~~

The values are all returned as strings by the API, and we're not interested in converting them or doing any extra work here, we want to dump the data into Kafka as quickly as possible to maximize throughput.

The list is passed to a *KafkaSender* class, by calling the *send* method. This opens up a *KafkaProducer*, provided by the client library and sends each individual record. The *KafkaProducer* buffers the records internally until flush is called. After sending, the producer is closed down, because the next batch of data is not available for an hour. The sender code looks like this:

~~~java

   public void send(List<KafkaObservationData> data) {
        Properties props = getProducerConfig();
        KafkaProducer<String, KafkaObservationData> producer = new KafkaProducer<>(props);

        data.forEach(dataPoint -> {
            ProducerRecord<String, KafkaObservationData> record
                    = new ProducerRecord<>(dataPoint.locationIdentifier, dataPoint);

            logSend(dataPoint);
            producer.send(record, this::logResult);
        });

        producer.flush();
    }
~~~

The first argument passed to the constructor of the *ProducerRecord* is the name of the Kafka topic the record is being sent to. We want a topic per location, because the consumers will be interested in particular locations. The Met Office gives each location an identifier, for example "3065" is the value of *dataPoint.locationIdentifer* for the station on the summit of [Cairn Gorm](http://cairngormweather.eps.hw.ac.uk/).

The *KafkaProducer* requires two generic type arguments, these are the type of each record's key and value. The value will be our *KafkaObservationData* class, and the key is set to be a string. The key is optional and controls how Kafka partitions the data. [Partitioning is an important subject](https://www.confluent.io/blog/how-to-choose-the-number-of-topicspartitions-in-a-kafka-cluster/), but for the purposes of this application, the default value of 1 per topic is used, so a record key is not needed.

Before connecting to the broker, you need to supply a producer config, this has quite a lot of potential options: [Kafka Producer Options](https://kafka.apache.org/documentation/#producerconfigs). Here we send the most basic and important ones:

~~~java

private static Properties getProducerConfig() {
       Properties props = new Properties();
       props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, Config.kafkaHost());
       props.put(ProducerConfig.CLIENT_ID_CONFIG, "WeatherMonitor");
       props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
       props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, ObservationDataSerializer.class.getName());
       return props;
   }
~~~

The main detail here that needs attention is the serializer classes. For simple objects like Strings, Integers and Doubles, Kafka provides implementations, but for anything else you need to create your own. When creating the serializers there are a few things to consider, the data can be placed in Kafka as a byte
array, as JSON or using some other format, for example [Apache Avro](https://avro.apache.org/docs/current/).

The serialization and deserialization of data going through Kafka is a potential performance bottleneck in high volume systems, and also you need to consider consumer compatibility. For example it may be best to pick a language-neutral format that doesn't make things difficult for future consumers written in other programming languages. Another important consideration is that the incoming data format may need to change in the future, in a way that doesn't break existing consumers.  For this example application, performance considerations are outweighed by the ease of use and compatibility of JSON. So the serializer looks like this:

~~~java

public class ObservationDataSerializer implements Serializer<KafkaObservationData> {

    private final static Logger logger = LoggerFactory.getLogger(ObservationDataSerializer.class);

    @Override
    public void configure(Map configs, boolean isKey) {
    }

    @Override
    public byte[] serialize(String topic, KafkaObservationData data) {
        ObjectWriter writer = new ObjectMapper().writer();
        byte[] jsonBytes = new byte[0];

        try {
            jsonBytes = writer.writeValueAsString(data).getBytes();
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize object", e);
        }
        return jsonBytes;
    }

    @Override
    public void close() {
    }
}
~~~

The complete code for the Kafka producer is available on [GitHub](https://github.com/oliverkenyon/wm-producer). When launched, we see output looking like the below sample, from the *logSend* and *logResult* methods:

~~~shell
10:07:55.031 [main] INFO  com.company.kafka.KafkaSender - Sending record for location: 99060(STONYHURST), at time: 2017-10-13T09:00
10:07:55.031 [main] INFO  com.company.kafka.KafkaSender - Sending record for location: 99081(NORTH WYKE), at time: 2017-10-12T09:00
10:07:55.032 [kafka-producer-network-thread | WeatherMonitor] INFO  com.company.kafka.KafkaSender - Successfully sent data to topic: 99060 and partition: 0 with offset: 40
10:07:55.032 [kafka-producer-network-thread | WeatherMonitor] INFO  com.company.kafka.KafkaSender - Successfully sent data to topic: 99060 and partition: 0 with offset: 41
~~~



##Consuming from Kafka

After running the producer with *Config.fetchHistoricalData* set to return true, we should now have 24 hourly readings for all 140 available sites in Kafka, with another reading for each site coming every hour if the producer is left running.

What I wanted to do next was to look at the data visually. In order to do this, we need a consumer that subscribes to a subset of the data from Kafka, and puts it into something that lets us graph it. Graphite has been around for a while and provides an easy and scalable way to do this. I'm going to use Graphite as a data source to Grafana rather than to show graphs itself, as Grafana provides better features and looks a lot nicer.

Again the consumer is going to use Java. First we identify the data to visualize. I'm interested in a small selection of the available locations, so I pass the Met Office identifiers of these into a *Consumer* class which will subscribe to these topics in Kafka:

~~~java
    public static void main(String[] arguments) {
        List<String> areasOfInterest = Arrays.asList(
                "3065",     // Cairn gorm summit
                "3039",     // Bealach na Ba
                "3047",     // Tulloch Bridge
                "3072",     // Cairnwell
                "3080",     // Aboyne
                "3148",     // Glen Ogle
                "3162"      // Eskdalemuir
        );

        Consumer consumer = new Consumer(areasOfInterest);
        Runtime.getRuntime().addShutdownHook(new Thread(() -> consumer.close()));
        consumer.run();
    }
~~~

The *run* method of the consumer will subscribe the topics and continue to process data until it's shutdown. Here's the code for it:

~~~java
public void run() {
        Properties consumerProperties = getConsumerProperties();
        consumer = new KafkaConsumer<>(consumerProperties);
        consumer.subscribe(topicNames);

        if (Config.startFromBeginning()) {
            consumer.poll(100);
            consumer.seekToBeginning(Collections.EMPTY_LIST);
        }

        try {
            while (true) {
                ConsumerRecords<String, KafkaObservationData> records = consumer.poll(100);

                if (!records.isEmpty()) {
                    graphiteSender.send(records);
                }
            }
        }
        catch(WakeupException ex) {
            logger.info("Consumer has received instruction to wake up");
        }
        finally {
            logger.info("Consumer closing...");
            consumer.close();
            shutdownLatch.countDown();
            logger.info("Consumer has closed successfully");
        }
    }
~~~

The Kafka cluster keeps track of the last read offset of each consumer. So by default if a consumer gets restarted, when it comes back up it'll carry on where it left off. For this application I have built in the ability for the consumer to override this and start at the beginning of the available data. This is mainly because the Graphite container I created doesn't have persistent storage, so might need to be repopulated. Doing this in a high volume production system may not always be a great idea, but Kafka does allow it. It's also possible to seek to a specific offset, which could be very useful in some situations.

The consumer repeatedly calls poll on the *KafkaConsumer* class, which is provided by the client library. If some records are returned, these are sent to Graphite. As with the producer, there are some required config settings:

~~~java
  private Properties getConsumerProperties() {
        Properties configProperties = new Properties();
        configProperties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, Config.kafkaHost());
        configProperties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        configProperties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ObservationDataDeserializer.class.getName());
        configProperties.put(ConsumerConfig.GROUP_ID_CONFIG, "GraphiteConsumers");
        configProperties.put(ConsumerConfig.CLIENT_ID_CONFIG, "GraphiteConsumer");
        return configProperties;
    }
~~~

We have deserializers, which do the opposite of the serializers used by the producer, and of most interest here is the *GROUP_ID_CONFIG*. This setting puts our consumer in a group called *GraphiteConsumers*. When multiple consumers subscribe from the same group, Kafka divides the events up between the consumers in the group allowing parallel processing. If two consumers subscribe from different groups, each will receive a copy of every event.

The graphiteSender is pretty simple, it makes use of [Graphite's Pickle Protocol](http://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-pickle-protocol) to send batches of records together in a compressed format. This is quite easy to do directly in Java thanks to the [jython library](http://www.jython.org/).

~~~java
   public void send(ConsumerRecords<String, KafkaObservationData> records) {
        try (Socket socket = new Socket(Config.graphiteHostName(), Config.graphitePort()))  {
            PyList list = new PyList();

            records.forEach(record -> {
                addTemperature(record, list);
                addDewPoint(record, list);
                addHumidity(record, list);
                addWindSpeed(record, list);
            });

            PyString payload = cPickle.dumps(list);
            byte[] header = ByteBuffer.allocate(4).putInt(payload.__len__()).array();

            OutputStream outputStream = socket.getOutputStream();
            outputStream.write(header);
            outputStream.write(payload.toBytes());
            outputStream.flush();

        } catch (IOException e) {
            logger.error("Exception thrown writing data to graphite: " + e);
        }
    }
~~~

~~~java
 private void addTemperature(ConsumerRecord<String, KafkaObservationData> record, PyList list) {
        addFloatMetric(record, list, "temperatureCelcius", record.value().temperatureCelcius);
    }

    private void addFloatMetric(ConsumerRecord<String, KafkaObservationData> record, List list, String name, String value) {
        if (value == null) {
            // Some values are optional or not giving data due to broken sensors etc
            return;
        }

        LocalDateTime dateTime = LocalDateTime.parse(record.value().dataDate);

        PyString metricName = new PyString(record.topic() + "." + name);
        PyInteger timestamp = new PyInteger((int) dateTime.toEpochSecond(ZoneOffset.UTC));
        PyFloat metricValue = new PyFloat(Double.parseDouble(value));
        PyTuple metric = new PyTuple(metricName, new PyTuple(timestamp, metricValue));
        logMetric(metric);
        list.add(metric);
    }
~~~

The full consumer code is available on [GitHub](https://github.com/oliverkenyon/wm-graphite-consumer).

Launching the consumer results in output like:

~~~shell
11:07:58.766 [main] INFO  com.company.graphite.GraphiteSender - Added metric: ('3162.temperatureCelcius', (1507888800, 14.1))
11:07:58.767 [main] INFO  com.company.graphite.GraphiteSender - Added metric: ('3162.dewpointCelcius', (1507888800, 13.9))
11:07:58.773 [main] INFO  com.company.graphite.GraphiteSender - Added metric: ('3162.humidityPercentage', (1507888800, 98.8))
11:07:58.784 [main] INFO  com.company.graphite.GraphiteSender - Added metric: ('3162.windSpeedMph', (1507888800, 22.0))
~~~

A look at the web dashboard shows that the data has been successfully stored in Graphite:

[![Graphite]({{ site.baseurl }}/okenyon/assets/kafka/Graphite.PNG "Graphite dashboard")]({{ site.baseurl }}/okenyon/assets/kafka/Graphite.PNG)





## Creating the dashboard

The Graphite dashboard is not the prettiest. I worked with Grafana in a previous project and found it a great tool for quickly visualizing live data. Grafana is already running and the link to Graphite is configured in the docker-compose file above. The dashboard is available at localhost:3000

Before creating graphs, a data source needs to be added to Grafana. It supports a few different options, and Graphite is among those with the best support. The data source URL should be "http://graphite:80" and proxy access should be chosen, as going direct won't work if the docker containers are running in a virtual machine. The default username and password for the Graphite container are both just "guest". Once this is working, creating a dashboard to display the data is a matter of minutes. For example the configuration of the temperature graph looks like below:

[![Metrics Config]({{ site.baseurl }}/okenyon/assets/kafka/GrafanaMetricsConfig.PNG "Metric config in Grafana")]({{ site.baseurl }}/okenyon/assets/kafka/GrafanaMetricsConfig.PNG)

And the basic dashboard for a location of interest looks like:

[![Metrics Config]({{ site.baseurl }}/okenyon/assets/kafka/Dashboard1.PNG "Metric config in Grafana")]({{ site.baseurl }}/okenyon/assets/kafka/Dashboard1.PNG)

[![Metrics Config]({{ site.baseurl }}/okenyon/assets/kafka/Dashboard2.PNG "Metric config in Grafana")]({{ site.baseurl }}/okenyon/assets/kafka/Dashboard2.PNG)

Grafana has time selection facilities very similar to Kibana, and so it's easy to zoom in and out and look at data from various ranges. Once this application has been running for a while it will be possible to look back over the last few weeks, perfect for forecasting ice climbing conditions!

## Conclusion

This post has shown how to get going with Kafka very easily and show live graphs of the data. The code for the alerter component shown in the diagram at the top is not shown, but is easy to implement based on the structure used in the Graphite consumer. I implemented it by keeping a moving average of temperature in memory and triggering an alert if it the average was below zero for a certain amount of time.

There are many more considerations related to configuring and using Kafka effectively, but hopefully this offers a starting point and some inspiration.
