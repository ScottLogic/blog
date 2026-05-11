---
title: Data Engineering on a Budget
author: blogan
date: 2026-05-12
summary: An exploration of a lightweight, open-source alternative to traditional SaaS data engineering platforms, highlighting the benefits and trade-offs of each approach.
category: Data Engineering
---

# Context

Today a lot of data engineering projects leverage Cloud SaaS offerings like Databricks and Microsoft Fabric. While they are excellent offerings, they are quite expensive to use and do not always naturally lend themselves to best practises. In this article I am going to outline an open-source alternative to these common software systems that can be used in a small, lightweight data project. A “build it yourself” solution may appear more complicated and harder to maintain than a SaaS product but I will show that all depends on the size of your project.

# The Project

## Overview

In this scenario, we are creating a solution for a small data project. All data will be consumed from Kafka and there will be no more than a few hundred messages per day. 
The components used in this example are:

* Kafka
* Docker
* Prefect
* Postgres
 
In this example, messages enter the system via Kafka and are stored in Postgres using a medallion layer architecture. Prefect orchestrates the data pipelines, handling ingestion from Kafka to Postgres and performing additional ETL operations across the medallion layers. Although Postgres isn't traditionally associated with medallion architectures, it can be effectively adapted for this purpose. Its support for multiple databases and tables enables the creation of distinct bronze, silver, and gold layers, each tailored to meet different consumer requirements.

All the components are underpinned by docker containers and since all the components are open source, running the containers will be the main infrastructure cost of the project. In production this project could be run on something like ECS Fargate with deployment pipelines pushing between environments. An alternative approach could be to run it on Kubernetes however this will increase complexity and cost. As a result I think it would be better to not use it.

An example docker compose file for this project is displayed below:

~~~yaml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "9093:9093"     
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENERS: INTERNAL://0.0.0.0:9092,EXTERNAL://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL://localhost:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_CREATE_TOPICS: "swiss_events:1:1"

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: pguser
      POSTGRES_PASSWORD: pgpass
      POSTGRES_DB: pgdb
    ports:
      - "5432:5432"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pguser -d pgdb"]
      interval: 5s
      timeout: 5s
      retries: 5

  prefect-server:
    image: prefecthq/prefect:3-latest
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      PREFECT_API_DATABASE_CONNECTION_URL: postgresql+asyncpg://pguser:pgpass@postgres:5432/pgdb
      PREFECT_SERVER_API_HOST: 0.0.0.0
      PREFECT_UI_API_URL: http://localhost:4200/api
    command: prefect server start
    ports:
      - "4200:4200"
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:4200/api/health || echo 'Healthcheck failed'"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 90s

  create-pool:
    image: prefecthq/prefect:3-latest
    depends_on:
      prefect-server:
        condition: service_healthy
    environment:
      PREFECT_API_URL: http://prefect-server:4200/api
    entrypoint: ["sh", "-c", "sleep 20 && prefect work-pool create --type process local-pool"]
    restart: "no"

  prefect-worker:
    image: prefecthq/prefect:3-latest
    depends_on:
      prefect-server:
        condition: service_healthy
    entrypoint: ["sh", "-c", "apt-get update && apt-get install -y gcc libpq-dev && pip install --no-cache-dir -r requirements.txt && sleep 15 && prefect worker start --pool local-pool --type process"]
    environment:
      PREFECT_API_URL: http://prefect-server:4200/api
      PREFECT_WORKER_WEBSERVER_HOST: 0.0.0.0
    working_dir: /app/flows
    volumes:
      - ./flows:/app/flows

  register-deployment:
    build:
      context: ./flows
      dockerfile: Dockerfile
    depends_on:
      create-pool:
        condition: service_completed_successfully
    environment:
      PREFECT_API_URL: http://prefect-server:4200/api
    restart: "no"
~~~

## Why Postgres?

There are many open-source database options available—so why choose Postgres? While other databases could certainly do the job, I prefer Postgres for its powerful capabilities in querying JSON data stored in database columns in its jsonb format. In this example, the initial data ingestion from Kafka into the bronze layer arrives in JSON format, so the payload is stored in a jsonb column. This allows us to take full advantage of Postgres’s robust JSON querying features when transforming data from the bronze to the silver layer.

In addition, I chose Postgres because it is better suited to lightweight workloads. While lakehouses are the industry standard in Data Engineering sometimes projects do not need the large scalability of a lakehouse. A lakehouse can take petabytes of data in different formats, but not all projects have petabytes of data and multiple formats. If there is one data source with a consistent format, that is not producing a huge amount of data, then using a database can be preferable.

## What is Prefect? 

Prefect is a python-only application that allows developers to create pipelines. It performs a similar role as Apache Airflow since they are both workflow orchestration tools. In Prefect, pipelines contain tasks that represent a stage of the pipeline. These pipelines can be integrated with packages like PySpark and Dask. The advantages of using Prefect that I will outline aren’t Prefect specific but rather apply to most open-source options.

Firstly, you aren’t locked into Spark. Spark is normally used by default but packages like Dask can be a good alternative. Spark does scale better than Dask when using data volumes above 100GB however if you are using data less than 100GB then Dask may be a better option. See [Spark vs Dask: Environmental Big Data Analytics Tools Compared - Round Table Environmental Informatics](https://rtei.net/spark-vs-dask-environmental-big-data-analytics-tools-compared/) for an interesting read on this. By using Dask you can get around managing Spark clusters and the learning curve should be less but will depend on your previous knowledge. Dask also works better for local development as it can be run from a simple python file without much setup whereas PySpark can be quite hard to set up locally.

~~~python
from prefect import flow, task
from prefect_dask import DaskTaskRunner
import dask.dataframe as dd
from adapters.db_adapter import DBAdapter

@task
def extract_data():
    db = DBAdapter(username="kafkauser", password="kafkapass", host="localhost", port="5432", dbname="kafkafb")
    db.open_connection()
    query_str = "SELECT * FROM raw_table"
    df = db.query(query_str)
    db.close_connection()
    return df

@task
def transform_data(df):
    ddf = dd.from_pandas(df, npartitions=10)
    ddf = ddf.dropna().query("value > 100") 
    return ddf.compute()

@task
def load_data(df):
    db = DBAdapter(username="kafkauser", password="kafkapass", host="localhost", port="5432", dbname="kafkafb")

    db.bulk_insert_df(df)

    db.close_connection()

@flow(task_runner=DaskTaskRunner())
def etl_pipeline():
    raw_df = extract_data()
    transformed_df = transform_data(raw_df)
    load_data(transformed_df)

if __name__ == "__main__":
    etl_pipeline()
~~~

Above is an example flow in Prefect that leverages Dask to do some simple ETL operations. 
The code snippet above demonstrates how Prefect enables a more intuitive and modular approach to structuring workflows, supporting familiar design patterns like the adapter pattern. In contrast, platforms like Databricks and Fabric advocate for the use of notebooks, which—due to their cell-based architecture—can limit flexibility and make it harder to implement conventional coding practices seamlessly.
 
~~~python
import psycopg2
import pandas as pd
from io import StringIO

class DBAdapter:
    conn = None

    def __init__(self, username: str, password: str, host: str, port: str, dbname: str):
        self.username = username
        self.password = password
        self.host = host
        self.port = port
        self.dbname = dbname
    
    def open_connection(self):
        self.conn = psycopg2.connect(
            dbname="my_database", user="user", password="password", host="localhost", port="5432"
        )
    
    def close_connection(self):
        self.conn.close()
    
    def query(self, query_str):
        return pd.read_sql(query_str, self.conn)
    
    def bulk_insert_df(self, df):
        cursor = self.conn.cursor()

        # Use a temporary buffer to bulk insert
        buffer = StringIO()
        df.to_csv(buffer, index=False, header=False)
        buffer.seek(0)

        cursor.copy_expert("COPY cleaned_table FROM STDIN WITH CSV", buffer)
        self.conn.commit()
        cursor.close()
~~~

As shown above, since Prefect is purely python we can create classes such as this DBAdapter class. This allows us to create cleaner code that is more maintainable and easier to read. Furthermore, this class can be mocked during unit testing to allow for the pipeline code itself to be tested. 
Unit testing is a lot easier in a pure python environment as you have a broader range of tools that can be used compared to what is available when using notebooks. Moreover, notebooks don’t lend themselves well to unit tests since they do not possess the ability to import anything from another notebook. 
In summary there are multiple advantages to being able to use pure python files over notebooks. These advantages include:

1.	Not locked into spark
2.	Better code structure
3.	Can use common code patterns easier
4.	Can import custom classes from python files
5.	Better unit testing

## Trade Offs

The point of this article is to highlight that not every data project needs a big data software platform. There are trade-offs to using Databricks and Fabric as well as various open-source applications or cloud services. No one technology should be the default for every application; the use case should be examined carefully.
I personally think there are two types of architecture currently available – single big data platform or a more granular, lightweight platform. 

| Architecture | When to use |
|---|---|
| SaaS Big Data Platform | Many types of data sources and large volumes of data |
| Lightweight Platform | Single type of data source and small to medium amounts of data |

For the purposes of breaking down the benefits and draw backs of both types I am going to compare them to booking a holiday.

## SaaS Big Data Platform

This is the equivalent of an all-inclusive holiday. Everything is included from breakfast to flights. SaaS offerings abstract the details of managing infrastructure like setting up a delta lake or provisioning an EC2 instance to run your spark cluster on. It’s all handled by the platform.

**Benefits**

* Quick set up for a project
* Easy to get started
* Infrastructure managed by platform
* Security is easier to manage

**Drawbacks**

* High cost
* Often you will spend time developing “workarounds” for limitations of the platform
* Notebook development
* Can be a steep learning curve after the initial set up for developers
* Testing can be difficult

We don’t really talk enough about how steep the learning curve to fully master a SaaS platform can be. There are similarities between the different offerings however someone who has mastered Fabric will need to relearn a lot to master Databricks. It is like having expert skills in AWS and working on Azure. 

## Lightweight Platform

This is the equivalent of booking every detail of the holiday yourself. You book the flights, research restaurants and sorted out all the individual parts yourself and saved money in the process! 
A lightweight platform which uses open-source applications allows you to pick each piece of the tech stack. You will have less infrastructure costs, but it will result in a larger development time as there will be more devops tasks and coding work to do. The size of the project will dictate whether this approach will produce any benefit. 

**Benefits**

*	More selection of tools and services
*	More control over each part
*	Cheaper infrastructure costs
*	More transferable skills 

A benefit that perhaps should be considered more is developers having more transferrable skills. You do not need to be a master at Databricks for this to be feasible. A developer who has used python and docker will have a very shallow learning curve for the example project I have demonstrated in this article. This approach will more easily allow software engineers to act as data engineers.

**Drawbacks**

*	Maintaining the platform can be expensive
*	Development time will be longer
*	Only useful for smaller projects
*	Must be skilled in operating all the individual tech
*	Have to stand-up the runtime platform unless using cloud services
*	Reliability/availability can be harder to achieve
*	Monitoring

# Conclusion
The perfect solution does not exist, but the question is – does a lightweight architecture provide a better way to do data engineering? I think personally it provides a better approach when you know that there will be one type of data source that will not produce large amounts of data. SaaS offerings will be better for other use cases.

**Pros of this project**

1. Better code structure
2. Better unit testing
3. Cost of development will be less as more can be ran on local machines instead of incurring cluster costs when developing

**Cons of this Project**

1. More complicated as there are more parts
2. Developers need knowledge of multiple services instead of just Databricks or Microsoft Fabric
3. More work needed to set up and maintain the platform which could cost a lot

A final thought that could become a positive for open source
Having done a few projects on cloud SaaS offerings, I would be interested to know how much time engineers spend  working on fixes for limitations of the SaaS platform. It is something that is not normally recorded and can be quite repetitive as you will likely have to put the same work arounds in every time you use the SaaS product.
