---
title: Elasticsearch - clustering on AWS with optional auto-scaling
date: 2019-07-19 00:00:00 Z
categories:
- Data Engineering
author: zwali
layout: default_post
summary: Create your own Elasticsearch cluster in cloud in next to no time. Leverage ElasticHQ and CloudWatch logging to gain transparency. Excerpts from a client project.
---

Recently I worked with Elasticsearch in a client project. It was a multi-pipeline serverless system that ingests and transforms data before pooling them in Elasticsearch. A search heavy front-end application points all its queries at the cluster.

<img src='{{ site.baseurl }}/zwali/assets/elastic-cluster/cluster.png' title="data flow" alt="data flow" />

The system was hosted in AWS. As Elasticsearch is open source, we installed in EC2 rather than using the managed AWS service. It kept the costs considerably cheaper and that was a key requirement for our client. At the time of the project, [Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/) was not available yet. That could be a potential contender. We had a daily backup plan in place that ensured that in any contingency, the Elasticsearch cluster could be recreated with all the data within minutes. 

We built the whole architecture from scratch. Elasticsearch installation was single instance for a while into development. But as we started to roll it out to real user groups outside the team of our 3 / 5 people, it became imminent that we needed a proper cluster. After all, the single instance was already homing ~6 million documents with a daily ingest of ~1-2k new documents. But even if you are not running at a scale like that, cluster is recommended to take advantage of data redundancy and self-healing nature of Elasticsearch. The robustness of Elasticsearch comes from Replication and Sharding of Indices.

Elasticsearch is document storage. The documents are organised in indices. Each index is a collection of similar type documents e.g. all user data, all transaction data, all address data etc. As the index grows, it becomes inefficient to store the whole index in one machine, as queries and writes will take increasingly longer time and have more possibility of contention. That is where Sharding comes in. An index is split into multiple shards and the shards are independent, self-contained store of data that can be stored in physically separate nodes. The introduction of shards takes away the performance inefficiency problem. To add durability on top of that, it is recommended to specify a non-zero replication factor. What it means is that, each shard has multiple copies stored across different nodes in the cluster. No two replica are ever stored in the same node. Elasticsearch [documentation](https://www.elastic.co/guide/en/elasticsearch/reference/6.2/_basic_concepts.html) is nice and detailed on this topic.

I was confident that it would not be too hard to find resources on this as the use case seemed like one that a lot of AWS based projects would come across. We are wanting to create an Elasticsearch cluster where each node is housed in its own EC2. In the official Elasticsearch references, it refers to discovery-ec2 plugin that needs to be installed on each node. And the rest is a glossary of properties that you could choose to configure in your elasticsearch.yml. So, the document is quite open. It does not say anything about the bare minimum that would enable two nodes talk to each other. I started looking at other blogs written by individuals who tried to muddle through the same problem before me. And I found a few and following them, was able to create my own version. At the end of it, felt like it would be good to write down the summary for future reference.

##Define the security group for cluster
The security group for the nodes must allow inbound traffic on port 9300 to the rest of the cluster and on port 9200 from all downstream clients. The security group can be pre-created and then used for all new nodes joining the cluster. We used it in a stand-alone PowerShell script at first for launching new Elasticsearch nodes and later added to Launch Template of the cluster auto-scaling group.
All the remaining steps are done in a bootstrap script. Again, we used the bootstrap script for creating individual nodes with AWS CLI first and later in the Launch Template of the auto-scaling group.
The key idea is to launch a node equipped with all the right configuration so that when it comes to life for the first time, it knows which cluster it belongs to and the cluster recognises the node as a member.

##Platform requirements
The machines need to have Java installed. The very first section in the bootstrap script installs Java, pip, unzip and awscli. Java is pre-requisite for functioning as an Elasticsearch node. We used [ElasticHQ](https://www.elastichq.org/) for administering the Cluster. It is a Python application. Pip3 was used to install all the requirements for ElasticHQ. Unzip was used to extract ElasticHQ from the archive fetched via wget. Awscli was needed for interacting with the Systems Manager. Systems Manager's parameter store was used for securely storing the secret key and access key for a user in AWS IAM. The user is configured with necessary permission to find other nodes. I also installed jq for manipulating Json returned by awscli.

~~~ sh
apt-get install -y python-software-properties debconf-utils
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade
wget https://d3pxv6yz143wms.cloudfront.net/8.212.04.1/java-1.8.0-amazon-corretto-jdk_8.212.04-1_amd64.deb
apt-get install java-common
dpkg --install java-1.8.0-amazon-corretto-jdk_8.212.04-1_amd64.deb
echo "1" | update-alternatives --config java
echo "1" | update-alternatives --config javac
apt-get install -y python3-pip
apt install unzip
apt install -y awscli
apt install -y jq
~~~

##Working with a CIS hardened image
A CIS (Center for Internet Security) hardened image is the base image for all our nodes. The base image we used has all CIS Level 1 guidelines for securing a machine pre-baked in its configuration. As part of these measures, all ports are by default closed. Therefore, we must open the ports that will be needed for communication with other nodes (9300), receiving queries and write requests (9200) and incoming queries for ElasticHQ (5000). Here, security guideline for well-architected systems in AWS is of utmost importance. Only open what the minimum necessity is. As the ports are opened, they were restricted to only allow traffic from the same subnet as the node in question.

~~~ sh
host_ip=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
subnet_range=`echo $host_ip | sed -r 's/\.[0-9]+$/.0\/24/g'`
subnet_for_whitelist=`echo $host_ip | sed -r 's/\.[0-9]+$/.*\/g'`

iptables -A INPUT -p tcp -s $subnet_range --dport 5000 -m state --state NEW -j ACCEPT
iptables -A INPUT -p tcp -s $subnet_range --dport 9200 -m state --state NEW -j ACCEPT
iptables -A INPUT -p tcp -s $subnet_range --dport 9300 -m state --state NEW -j ACCEPT
iptables-save > /etc/iptables/rules.v4
~~~

##Install Elasticsearch and update the yml file
The elasticsearch.yml file was modified to reflect cluster name and host. The cluster name is needed mainly for ease of use and maintenance. The host is the local IP address of the node.

~~~ sh
mkdir /tmp/elastic
chmod 777 /tmp/elastic

cd /tmp/elastic
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.4.2.deb
dpkg -i elasticsearch-6.4.2.deb

sed -i "s/#cluster.name: my-application/cluster.name: aardvark-cluster/g" /etc/elasticsearch/elasticsearch.yml
sed -i "s/#network.host: 192.168.0.1/network.host: [${host_ip}]/g" /etc/elasticsearch/elasticsearch.yml
~~~

The following two lines are required for enabling CORS. We needed it because we were hooking Elasticsearch to API gateway to serve data to our frontend, and if it did not have a CORS header, frontend application would not accept any response from Elasticsearch.

~~~ sh
echo 'http.cors.enabled: true' >> /etc/elasticsearch/elasticsearch.yml
echo $'http.cors.allow-origin: \'*\'' >> /etc/elasticsearch/elasticsearch.yml
~~~

Added settings required for networking using the discovery-ec2 plugin such as discovery.zen.hosts_provider, discovery.ec2.any_group, discovery.ec2.host_type,  cloud.node.auto_attributes, cluster.routing.allocation.awareness.attributes, discovery.ec2.tag.es_cluster, and discovery.ec2.endpoint. Of these, the most important attribute is the discovery.ec2.tags.es_cluster. In launch template, it must ensured that all new launches have this resource tag es_cluster and all nodes belonging to the same cluster must have same value for es_cluster tag. 

~~~ sh
echo 'discovery.zen.hosts_provider: ec2' >> /etc/elasticsearch/elasticsearch.yml
echo 'discovery.ec2.any_group: true' >> /etc/elasticsearch/elasticsearch.yml
echo 'discovery.ec2.host_type: private_ip' >> /etc/elasticsearch/elasticsearch.yml
echo 'cloud.node.auto_attributes: true' >> /etc/elasticsearch/elasticsearch.yml
echo 'cluster.routing.allocation.awareness.attributes: aws_availability_zone' >> /etc/elasticsearch/elasticsearch.yml
echo 'discovery.ec2.tag.es_cluster: "aardvark-cluster"' >> /etc/elasticsearch/elasticsearch.yml
echo 'discovery.ec2.endpoint: ec2.eu-west-2.amazonaws.com' >> /etc/elasticsearch/elasticsearch.yml
~~~

One additional line was added to the yml later in the project as we needed to reindex documents. This is usually required if there is a change in certain data fields of a mapping. Mapping is like schema in traditional databases. Mappings are defined at the time of index creation. Changing it anytime afterwards requires reindexing. Reindexing updates all the existing documents so that they comply with the new mapping. We ran a script invoking the Reindex API in Elasticsearch. The idea was that these reindex actions will get replicated to all the other nodes and eventually all the nodes will have the same data and mapping. This is by far the fastest way to apply mapping changes across the cluster. Here, it took ~40 minutes to reindex 2.6 million documents.

<img src='{{ site.baseurl }}/zwali/assets/elastic-cluster/reindex-output.PNG' title="reindexing" alt="reindexing" />

It is pre-requisite to have the below line for reindex to work like that.

~~~ sh
echo 'reindex.remote.whitelist: "'$subnet_for_whitelist':9200"' >> /etc/elasticsearch/elasticsearch.yml  
~~~

The next lines set the JVM options for elastic to be half of the total RAM, as suggested in the docs. Round the available memory up to next int and half it.

~~~ sh
allowed_elastic_memory=$(grep MemTotal /proc/meminfo | awk '{print int(($2/1024/1024)+0.9)/2}')
sed -i "s/-Xms1g/-Xms${allowed_elastic_memory}g/g" /etc/elasticsearch/jvm.options
sed -i "s/-Xmx1g/-Xms${allowed_elastic_memory}g/g" /etc/elasticsearch/jvm.options
~~~

##Keys, permissions, and go!
An IAM user is created that only has access to describe ec2 instances. This is important to keep access to minimum. So, that role must not have any permission other than describe-instances. The secret key and access key for the user are stored in Systems Manager Parameter Store and Elasticsearch keystore are updated with these details. 

~~~ sh
cd /usr/share/elasticsearch/bin
aws ssm get-parameter --region eu-west-2 --name elastic-discovery-access-key --with-decryption| jq '. | .Parameter | .Value' | tr -d '"' | ./elasticsearch-keystore add --stdin discovery.ec2.access_key
aws ssm get-parameter --region eu-west-2 --name elastic-discovery-secret-key --with-decryption| jq '. | .Parameter | .Value' | tr -d '"' | ./elasticsearch-keystore add --stdin discovery.ec2.secret_key
./elasticsearch-plugin install -b discovery-ec2
~~~

Once all these are in place, the Elasticsearch service is enabled and all files and directories under the Elasticsearch root directory are opened for read and append. As the service runs, it needs to access files and write logs. Hence, the permission is needed.

~~~ sh
systemctl enable elasticsearch.service
chmod a+r /usr/local/lib/python3.6/dist-packages/elasticsearch-6.3.1.dist-info -R
~~~

##Install ElasticHQ 
ElasticHQ is a monitoring and management tool for Elasticsearch. Specially if one is not interested to get in the guts of server every time they need a view of the server health, it is great. 

<img src='{{ site.baseurl }}/zwali/assets/elastic-cluster/hq-left.png' title="ElasticHQ" alt="ElasticHQ" />

<img src='{{ site.baseurl }}/zwali/assets/elastic-cluster/hq-right.png' title="ElasticHQ" alt="ElasticHQ" />

ElasticHQ is open source. As part of our bootstrap script, it is fetched and stored at an appropriate location. 

~~~ sh
mkdir /tmp/elasticsearch-hq
chmod 777 /tmp/elasticsearch-hq
cd /tmp/elasticsearch-hq/
wget https://github.com/ElasticHQ/elasticsearch-HQ/archive/v3.5.0.zip
chmod 666 v3.5.0.zip
mkdir -p /usr/share/elasticsearch-hq/elasticsearch-HQ-3.5.0
chmod -R 777 /usr/share/elasticsearch-hq
~~~

A dedicated user is created for running ElasticHQ. This is necessary as it is a massive security risk to run any application/service as root.

~~~ sh
useradd -p $(openssl rand -base64 8) elasticsearch-hq 
mkdir /home/elasticsearch-hq
chown elasticsearch-hq -R /home/elasticsearch-hq
~~~

A install.sh file is created for doing the extraction and installation of ElasticHQ and the script is run as the ElasticHQ user.

~~~ sh
echo "unzip v3.5.0.zip" > install.sh
echo "mv elasticsearch-HQ-3.5.0/* /usr/share/elasticsearch-hq/elasticsearch-HQ-3.5.0" >> install.sh
echo "cd /usr/share/elasticsearch-hq/elasticsearch-HQ-3.5.0" >> install.sh
echo "pip3 install -r requirements.txt" >> install.sh 
echo "pip3 install python-engineio --upgrade" >> install.sh
chmod 777 install.sh
su elasticsearch-hq -c /tmp/elasticsearch-hq/install.sh
~~~

As mentioned earlier, ElasticHQ is simply a python application. But we want it to restart by itself every time the node reboots. For that to happen, it is run as a service. A small script is created under /etc/system/system to use as a service configuration and ElasticHQ is enabled as a service.

~~~ sh
echo "[Unit]" > /etc/systemd/system/elastichq.service
echo "Description=ElasticSearchHQ instance" >> /etc/systemd/system/elastichq.service
echo "After=network.target" >> /etc/systemd/system/elastichq.service
echo "[Service]" >> /etc/systemd/system/elastichq.service
echo "User=elasticsearch-hq" >> /etc/systemd/system/elastichq.service
echo "WorkingDirectory=/usr/share/elasticsearch-hq/elasticsearch-HQ-3.5.0" >> /etc/systemd/system/elastichq.service
echo "ExecStart=/usr/bin/python3 /usr/share/elasticsearch-hq/elasticsearch-HQ-3.5.0/application.py" >> /etc/systemd/system/elastichq.service
echo "[Install]" >> /etc/systemd/system/elastichq.service
echo "WantedBy=multi-user.target" >> /etc/systemd/system/elastichq.service

systemctl enable elastichq.service
~~~

##Clean up after yourself
All temporary holdings are removed.

~~~ sh
rm -rf /tmp/elasticsearch-hq
rm -rf /tmp/elasticsearch
~~~

It is also recommended to uninstall all the software that were installed and won't be needed for the ongoing functionality as a cluster node. 

##Make those logs work
As you are on AWS, it only makes sense to leverage all the tools that comes with it. [CloudWatch](https://aws.amazon.com/cloudwatch/) is great for having a unified view of all your logs and you have the option to pull some custom metrics from them, put them in a CloudWatch dashboard or set email notifications/alarms. To channel all your Elasticsearch logs to CloudWatch, all you need to do it install a CloudWatch agent in every node. The below code block does that. The only customisation is the host_ip being used for naming the stream so you know which logs are coming from where.

~~~ sh
mkdir /usr/share/cloudwatch-agent
cd /usr/share/cloudwatch-agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb.sig
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
aws s3 cp s3://aardvark-mapping/files/amazon-cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
sed -i "s/ip/${host_ip}/g" /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file://opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
~~~

##Last but not the least
The node is restarted, so that it comes back up with the services being kicked off at restart. This gives validation of that "auto-start on boot" behaviour for both Elasticsearch and ElasticHQ.

~~~ sh
shutdown -r now
~~~

That should give you a complete bootstrap script. Stick that  along with the security group into a Launch template. You can choose to launch instances manually at first until you are comfortable with your traffic level and happy to leave scaling to AWS.


