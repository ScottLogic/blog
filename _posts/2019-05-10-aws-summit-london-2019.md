---
title: AWS Summit London
date: 2019-05-10 00:00:00 Z
categories:
- zwali
- Cloud
author: zwali
layout: default_post
summary: A summary of my experiences attending AWS Summit London, 2019. Highlights
  from talks that I found interesting and/or informative. Topics are mainly focused
  on high-performance computing, security and distributed architecture.
---

Braving the wet weather and swarming crowd in the DLR stations, this week a few of us went to attend the AWS summit at Excel, London. It is a terrific opportunity to immerse yourself in all things AWS. There are spoilers about new features, as well as battle hardened knowledge from other early adopters and not to mention mingling and collecting goodies. This year’s extra attraction was [Deep Racer League](https://aws.amazon.com/deepracer/league/) where you train your DeepRacer car using re-enforcement learning and top leader board to win a ticket to the AWS re:invent, 2019 in Las Vegas with all expenses included! Whether you are a racer a not, it is great to see all the various products that have built around AWS and talk to people who are working with interesting problems. 

##The keynote

Focused a lot on Database technology, closely followed by AI and high-performance computing tools on AWS. It mentioned Amazon Aurora as the fastest growing product on AWS. The keynote introduced the release of Amazon EC2 instance type I3en which is storage-optimised and tailored for IO intensive applications. This is to satisfy customer requests for I3 instances with cheaper storage and higher network bandwidth. In the AI sector, it talked about Amazon Elastic Inference which allows adding GPU acceleration on EC2 instances, and upcoming products AWS inferentia (custom machine learning inference chip) and EC2 G4 instances (designed for machine learning, training, inference and video transcoding). There was a lot of emphasis on security in AI algorithms as transparency and robustness are of immense value when AI is still trying to secure a position among mainstream technologies. Coming to think about it, AI algorithms are often very complex, and it is important to have the ability to explain why an AI algorithm chose a certain decision path. 

##What would you do with a million cores? High-performance computing on AWS

Covered a high level snapshot of all the new things that happened in the last year in HPC. [Frank](https://www.linkedin.com/in/frankmunz/) opened the talk with a mention of limitations of processing power in pre-cloud era. Machines had a fixed size at a fixed cost. It is different in cloud. Anyone can set up their own high-performance computing system and focus on innovation rather than capex, capacity and technology. Some of the recent innovations in AWS compute are worth mentioning here.

<ul>
	<li>
	P3dn.24xlarge: Optimized for distributed machine learning and HPC applications. P3dn instances were already available up to 16xlarge. 24xlarge was introduced in December 2018.	
	</li>
	<li>
	Z1d: Optimized for applications that require sustained core performance. Suitable for memory and compute-intensive applications.
	</li>
	<li>
	C5n: High bandwidth compute instances. Massively scalable performance.
	</li>
	<li>
	EC2 instance types with AMD EPYC: Lower prices, application compatible
	</li>
	<li>
	EC2 A1: Run scale-out and Arm-based workloads in the cloud, not application compatible
	</li>
</ul>

Among other innovation worth mentioning are these.

<ul>
	<li>
	Elastic Fabric Adapter:  Allows high performance systems bypass the TCP IP stack in the operating system and connect to HPC class interconnect. 
	</li>
	<li>
	AWS FSx for Lustre: POSIX compliant parallel filesystem. It is SSD based, allows consistent sub millisecond latencies, and integrates with S3.
	</li>
	<li>
	AWS parallel cluster: Open source cluster management tool. Takes minutes to set up a high-performance cluster in cloud. 
	</li>
</ul>

All these products were introduced November, 2018 and later. The talk finished with an experience shared by AstraZeneca centre for genomics research. They are researching to identify new drug targets. And their research is done at an unprecedented scale of 2 million clinical record  of which 0.5 million records come from AZ clinics. There is a requirement to understand more about the disease, identify new drug targets, support selection of patients and match therapies to patients. Their challenges were limited compute performance on premise, dependency on 3rd party informatics provider and operational inefficiency as it was costly and difficult to orchestrate / scale-up.
Moved to AWS with an overhaul of the whole infrastructure. Now they are using all things AWS. To name a few:

<ul>
	<li>StepFunctions for each workflow</li>
	<li>Lambda for workflow steps</li>
	<li>SQS for dispatcher queues</li>
	<li>FPGA (programmable ICs)  instances for sequence processing</li>
	<li>Batch for running genomics software</li>
	<li>Dynamodb for sequence metadata</li>
	<li>Aurora MySQL for variant database</li>
	<li>S3 for file objects</li>
</ul>

They are now able to analyse 100,000 exomes in 100 hours and claims to be the fastest and most efficient pipeline in the industry.

##Threat detection and remediation in the cloud

Discussed building blocks for threat detection in AWS. It focused on log data collection tools such as CloudTrail, VPC flow logs, CloudWatch and DNS logs. There was talk about Amazon GuardDuty. GuardDuty starts monitoring logs as soon as you turn on. It is learning behaviour patterns around the account. If it sees behaviour that is unusual like a compromised instance based on increased CPU utilization, it alerts you and keeps getting smarter as it is AI based. Amazon Macie  is also ML powered and detects unusual activities on S3, accidentally publishing IP etc. AWS security hub gathers security information from many accounts and put under one glass.

AWS Inspector, GuardDuty, Macie and AWS Security Partners can all feed into Security hub.

AWS Config rules can see CloudTrail data and flags breach of config rules that security admin can set up. Amazon CloudWatch Events captures stream of events that describe changes to AWS resources.

AWS Inspector can keep audit trail that you can later show auditors that there was a threat and it was normalised within x amount of time.

Example automation pipeline:

AWS cloud > GuardDuty > CloudWatch event > Lambda > Slack/Jira/PagerDuty

Amazon GuardDuty > Rule > Lambda > EBS > EBS snapshot

CloudTrail / VPC Flow Log / GuardDuty / Macie / Config > CloudWatch > Lambda > Team collaboration / AWS APIs >  AWS Inspector 

The options are not limited to a single linear path. Can run a few paths in parallel. 

##Depop:Kubernetes on EKS: Beyond Hello World

Experience of using Kubernetes on AWS at Depop. Although AWS has a Kubernetes service on EKS, it has quite a lot of gaps. Depop had to use Kube2Iam as it doesn’t have any IAM support and Kubernetes-Autoscaler as there is no autoscaling support. Also, there is no Application Load Balancer support, so they are using ALBIngressController. There is no option of setting up multi-account cluster.

##To sum it up

It was a highly informative event. Some of the talks could probably use a bit more vigour in presentation. I found 'Modern application Architecture' rather dated as it seemed to be stuck at the time when Microservices were considered as an all-curing solution whereas in reality we have started to see that it does not always apply and there are pitfalls to be aware of.  