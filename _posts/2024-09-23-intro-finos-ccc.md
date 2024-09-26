---
title: Introducing FINOS Common Cloud Controls (CCC)
categories: 
- Open Source
author: smendis-scottlogic
summary: FINOS Common Cloud Controls (CCC) is an open standard by FINOS, to describe consistent controls for compliance public cloud deployments in financial services sector. The project is sponsored by Scott Logic, aligning with its mission to promote and support open-source initiatives. This is an effort to introduce FINOS CCC and its goals.
---

Since September last year (2023), I have been working on a somewhat unusual software project. The project is sponsored by Scott Logic, aligning with its commitment to open source. I was excited, not only for the opportunity to contribute to an open-source project but also by the idea of playing a role in shaping the cloud itself.

Over the course of a year, we’ve come a long way—transforming what was once a vague, uncertain vision into releasable open standard. This blog post aims to introduce the FINOS Common Cloud Controls (CCC) project, outlining its objectives, timeline, and benefits.

## What is FINOS CCC?

![FINOS_LOGO]({{ site.github.url }}/smendis-scottlogic/assets/finos-logo.png)

As stated on the [official page](https://www.finos.org/common-cloud-controls-project) for the CCC project on the FINOS website, 

> “FINOS Common Cloud Controls (FINOS CCC) is the codename for an open standard project, originally proposed by Citi and now open source under Fintech Open Source Foundation (FINOS), to describe consistent controls for compliant public cloud deployments in the financial services sector”.

This statement outlines several important aspects of the project. First and foremost, it is designed to cater specific needs of the **financial services sector**, which includes banking, insurance, investment and wealth management, mortgage lending, and more. An **open standard** refers to a set of guidelines or specifications developed collaboratively that can be used freely or with minimal restrictions. **Consistent controls** imply standardized security, compliance, and governance measures applied uniformly across the infrastructure, applications and processes. These controls ensure that policies related to data protection, access management, auditing, encryption, and monitoring are reliably implemented. **Compliance public cloud deployments** involve using public cloud services, such as AWS, Microsoft Azure, or Google Cloud, that meet the regulatory and legal standards required by regulating authorities. 

In summary, FINOS CCC project aims to establish a set of guidelines that enforce security, compliance, and governance for public cloud services used by financial institutions.

## Goals of FINOS CCC

Base on the Common Cloud Controls GitHub repo the project aims to fulfil following goals, 

* Defining Best Practices Around Cloud Security
* One Target For CSPs To Conform To
* Sharing The Burden Of A Common Definition
* A Path Towards Common Implementation
* A Path Towards Certification

For a more detailed explanation of each project goal and how they are achieved, please refer to the project's [GitHub](https://github.com/finos/common-cloud-controls) repository.

## Why do we need it?

These goals were shaped by the unique challenges faced by the financial sector. Not like a small startup adopting cloud, when a financial institute migrates towards using the cloud, they have face more challenged based on the sensitive nature of their data. They store personally identifiable information of their customers, such as full name, date of birth, social security numbers, national identification numbers, home address, email addresses, phone numbers, etc. They also sometimes store customer income and credit data such as employment status, employer details, salary information, other income sources, credit score, defaults and bankruptcies, etc. Not only that, they also have records of customer in-store & online purchase history, withdrawals, deposits, investment activities and related transactional and behavioral patterns.

In the past, regulatory requirements for financial institutes mandated that data be stored in highly secured on-premise data centres. However, with the growing adoption of cloud services, the financial services sector is increasingly moving towards adapting the public cloud. Key benefits driving this shift include agility, scalability, cost optimization, accelerated innovation, geographic availability, and enhanced resilience. Some of the potential drawbacks and challenges, particularly given the sensitive nature of the financial data are security concerns, compliance and regulatory challenges, loss of control, downtime, data privacy risks, vendor lock-in and skills gap. 

![PROS_AND_CONS_OF_CLOUD]({{ site.github.url }}/smendis-scottlogic/assets/pros-n-cons.png)

Let’s elaborate more on few key concerns in moving financial data to the public cloud. Despite the robust security measures cloud providers offer, financial data is highly sensitive, and breaches can be devastating. Public cloud environments are multi-tenant, meaning data from multiple organizations shares the same infrastructure. While cloud providers enforce strict isolation, the risk of data leakage still exists. The cloud provider’s employees may have access to critical data, posing potential insider threats. When it comes to regulatory challenges, regulations in some regions require that sensitive financial data must be stored within national borders. Cloud providers may not offer appropriate data centre locations, or ensure compliance with data residency laws can be complex. Auditing and proving compliance in cloud environments can be more challenging, especially with limited visibility into the provider’s operations.

According to the Linux Foundation [announcement](https://www.linuxfoundation.org/press/finos-announces-open-standards-project-for-financial-services-common-cloud-controls) on July 27, 2023 Jim Adams, CTO and Head of Technology Infrastructure at Citi, the world’s fifth largest bank, stated

> “There is a need for a Cloud Standard that will improve certain security and control measures across the Financial Services industry, whilst simplifying and democratizing access for all institutions to operate and benefit by leveraging the public cloud. It is important to collaborate with our peers to ensure consistency across cloud service providers, ensuring the industry can realize true multi-cloud strategies,”

## Timeline and Contributors

**On July 27, 2023, in New York,** FINOS announced the formation of an open standard project, based upon an approach developed by FINOS Platinum Member Citi, to describe consistent controls for compliant public cloud deployments in the financial services sector.

**On October 24, 2023, in Las Vegas,** FINOS announced the open sourcing of FINOS Common Cloud Controls (FINOS CCC) under the Community Specification License.

The project, seeded by Citi and approved in July by the FINOS Governing Board, has quickly garnered participation from over 20 leading financial institutions, cloud service providers and technology vendors. Some key member organizations involved in the formation and development of the project include Citi, Bank of Montreal (BMO), Goldman Sachs, JPMorgan, Morgan Stanley, Royal Bank of Canada (RBC), Deutsche Bank, London Stock Exchange Group (LSEG), Natwest, Google Cloud, Microsoft, NIST, Red Hat, Symphony, ControlPlane, GitHub, GitLab, and Scott Logic. 

## Anatomy of FINOS CCC

The Common Cloud Controls (CCC) project encompasses multiple layers. A key goal of this initiative is to establish a unified taxonomy for the services offered by various cloud service providers. For instance, AWS provides virtual computing services under the name Elastic Compute Cloud (EC2), while Azure refers to it as Virtual Machine (VM), and Google offers a similar service called Google Compute Engine (GCE). Despite the different names, these services provide comparable functionalities. Regardless of the cloud provider, it’s essential to have controls in place. These controls are tied to specific infrastructure components, which must be identified and classified using cloud-agnostic terminology before controls can be designed for better clarity. Hence identifying these common features is the foundational step in creating the CCC standard.

Threats in the cloud are reasonably understood. The [MITRE ATT&CK](https://attack.mitre.org/) framework is a globally recognized knowledge base used to understand and analyze the behavior of cyber adversaries. It provides a structured way to describe and categorize the tactics, techniques, and procedures (TTPs) that attackers use to infiltrate and compromise systems. CCC also aims to create a mapping of threats found in Mitre framework with the common features identified by the cloud services taxonomy in their controls. 

FINOS CCC project uses [OSCAL](https://pages.nist.gov/OSCAL/) (Open Security Controls Assessment Language) developed by NIST (National Institute of Standards and Technology) as their control language. OSCAL utilizes a machine-readable format for defining controls, which facilitates automated assessments, reporting, automated generation of compliance documentation and many more.

The project also aims to validate controls through a series of tests. If you are aware of the controls required in your public cloud, you can use the tests provided in the CCC standard to verify whether those controls are properly implemented.

It is envisaged that eventually, CCC will offer certification for CSPs who conform to the standard.

## Controls, Threats and Features

To provide you with a clearer understanding of what a control is, let's take a closer look at a specific example.

~~~ yaml
id: CCC.ObjStor.08
title: Prevent object replication to destinations outside of defined 
    trust perimeter
control_family: Data
objective: |
    Prevent replicating objects to untrusted destinations outside of 
    defined trust perimeter. An untrusted destination is defined as a 
    resource that exists outside of a specified trusted identity or network 
    perimeter (i.e., a data perimeter).
threats:
    - CCC.ObjStor.TH01 # Data exfiltration via insecure lifecycle policies
nist_csf: PR.DS-4
test_requirements:
    - id: CCC.ObjStor.C08.TR01
    text: |
        Object replication to destinations outside of the defined trust 
        perimeter is automatically blocked, preventing replication to 
        untrusted resources.
    tlp_levels:
        - tlp_green
        - tlp_amber
        - tlp_red
~~~

This control defined in the file named `controls.yaml` under object storage [link](https://github.com/finos/common-cloud-controls/blob/main/services/storage/object/controls.yaml). This control is designed to ensure that data can not be replicated outside of defined trust identity or network. This control is mapped to a specific threat within the standard, identified as `CCC.ObjStor.TH01`, which we will explore in more detail later. Additionally, this control is mapped to a NIST control, specified as `PR.DS-4` [link]( https://csf.tools/reference/nist-cybersecurity-framework/v1-1/pr/pr-ds/pr-ds-4/), which is part of the NIST framework's guidelines for protecting data. There are also specific methods to test whether this control is effectively implemented within your cloud service provider, ensuring that it meets security and compliance standards.

~~~yaml
id: CCC.ObjStor.TH01 # Data exfiltration via insecure lifecycle policies
title: Data exfiltration via insecure lifecycle policies
description: |
    Misconfigured lifecycle policies may unintentionally allow data to be
    exfiltrated or destroyed prematurely, resulting in a loss of availability
    and potential exposure of sensitive data.
features:
    - CCC.ObjStor.F08 # Lifecycle Policies
    - CCC.F11 # Backup
mitre_technique:
    - T1020 # Automated Exfiltration
    - T1537 # Transfer Data to Cloud Account
    - T1567 # Exfiltration Over Web Services
    - T1048 # Exfiltration Over Alternative Protocol
    - T1485 # Data Destruction
~~~

Let’s examine the threat `CCC.ObjStor.TH01` in the file named [`threats.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/storage/object/threats.yaml). This highlights the potential risk where important data could be exfiltrated via misconfigure lifecycle policies. This particular threat is also linked to few threats in MITRE ATT&CK framework under the IDs [`T1020`](https://attack.mitre.org/techniques/T1020/), [`T1537`](https://attack.mitre.org/techniques/T1537/), [`T1567`](https://attack.mitre.org/techniques/T1567/), [`T1048`](https://attack.mitre.org/techniques/T1048/), [`T1485`](https://attack.mitre.org/techniques/T1485/)., which discus exfiltration and data destruction. This threat is also mapped to specific features within the standard identified as `CCC.ObjStor.F08` and `CCC.F11`. 

~~~yaml
id: CCC.ObjStor.F08
title: Lifecycle Policies
description: |
    Supports defining policies to automate data management tasks.
~~~

The feature `CCC.ObjStor.F08`, found in the file named [`features.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/storage/object/features.yaml) under the object storage, describes the ability to define lifecycle policies for object buckets. This functionality is the main target of the threat identified in `CCC.ObjStor.TH01`.

~~~yaml
id: CCC.F11 # Backup
title: Backup
description: |
    Provides the ability to create copies of associated data or
    configurations in the form of automated backups, snapshot-based backups,
    and/or incremental backups.
~~~

The feature `CCC.F11`, found in the file named [`common-features.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/common-features.yaml), describes the ability to backup data stored in object storage. This functionality can be used against premature destruction of data resulting in loss of availability as identified in the threat `CCC.ObjStor.TH01`.


In summary, if your architecture relies on object storage to retain customer data in a financial institution, it's critical to prevent replication data to destinations outside of defined trust identities and networks. This can be achieved by implementing backups and proper lifecycle policies for object storage. By doing so, you ensure that vital customer data remains secure and compliant with regulatory requirements, safeguarding against data loss.

For more details refer to the project's [GitHub](https://github.com/finos/common-cloud-controls) page.


## Scott Logic FINOS CCC Team

Scott Logic was one of the first organizations to collaborate with the FINOS Foundation in establishing the FINOS CCC, under the leadership of Colin Eberhardt and Robert Griffiths. Rob, as the project’s sponsorship lead at Scott Logic, plays a pivotal role in driving this initiative by being a key member of the FINOS CCC Steering Committee. Alongside Rob, Stevie Shiells, who chairs the Community Structure working group, and I, as the chair of the Taxonomy working group, represent Scott Logic in driving this open-source project. We have received, and continue to receive, valuable contributions over time from our Scott Logic team, including Joshua Isted, Cara Fisher, David Ogle, Mike Smith, Euthyme Ziogas, Daniel Moorhouse, and Ivan Mladjenovic.

## Conclusion

We have a diverse community of professionals within the FINOS CCC family, with a wide range of contributors, including CTOs, security experts, and industry professionals. The wealth of experience they bring to our discussions is mesmerizing. I enjoy contributing to this project because of the valuable exposure I gain from seeing how these experts approach various challenges.

FINOS Common Cloud Controls (FINOS CCC) is an ongoing project, and welcome continued involvement. If you're passionate about supporting Scott Logic's vision of fostering and empowering open-source initiatives, we encourage you to get in touch with any of our team members. Whether you're looking to contribute your skills or collaborate with like-minded individuals, there's always an opportunity to make a meaningful impact on this exciting and evolving initiative.

---