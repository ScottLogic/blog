---
title: Introducing FINOS Common Cloud Controls (CCC)
categories: 
- Open Source
author: smendis-scottlogic
summary: FINOS Common Cloud Controls (CCC) is an open standard by FINOS, to describe consistent controls for compliant public cloud deployments in the financial services sector. The project is supported by Scott Logic, aligning with its mission to promote and support open-source initiatives. This is an effort to introduce FINOS CCC and its goals.
---

Since September last year (2023), I have been working on a somewhat unusual software project. The project is supported by Scott Logic, aligning with its commitment to open source. I was excited, not only for the opportunity to contribute to an open-source project, but also by the idea of playing a role in shaping the cloud itself.

Over the course of a year, we’ve come a long way — transforming what was once a vague, uncertain vision into a releasable open standard. This blog post aims to introduce the FINOS Common Cloud Controls (CCC) project, outlining its objectives, timeline, and benefits.

## What is FINOS CCC?

![FINOS_LOGO]({{ site.github.url }}/smendis-scottlogic/assets/finos-logo.png)

As stated on the official page for the [Common Cloud Controls](https://www.finos.org/common-cloud-controls-project) project on the FINOS website, 

> “FINOS Common Cloud Controls (FINOS CCC) is the codename for an **open standard** project, originally proposed by Citi and now open source under Fintech Open Source Foundation (FINOS), to describe **consistent controls** for **compliant public cloud deployments** in the **financial services sector**”.

To fully understand the above definition, let's explore the key elements highlighted. 

- *Open standard* - set of guidelines or specifications developed collaboratively that can be used freely or with minimal restrictions.
- *Consistent controls* - standardized security, compliance, and governance measures applied uniformly across the infrastructure, applications and processes.
- *Compliant public cloud deployments* - cloud service deployments that adhere to regulatory standards, international laws and industry best practices. Most popular public clouds are AWS, Microsoft Azure, and Google Cloud.
- *Financial services sector* - encompasses a broad range of services related to finance and money management, including banking, mortgages, payment services, investments, insurance and more.

In summary, FINOS CCC project aims to establish a set of guidelines that enforce security, compliance, and governance for public cloud services used by the financial institutions.

## Goals of FINOS CCC

Based on the [Common Cloud Controls GitHub](https://github.com/finos/common-cloud-controls) repo the project aims to fulfil following goals: 

- Defining Best Practices Around Cloud Security
- One Target For CSPs To Conform To
- Sharing The Burden Of A Common Definition
- A Path Towards Common Implementation
- A Path Towards Certification

## Why do we need it?

These goals were shaped by the unique challenges of the financial sector. Unlike a small startup adopting the cloud, financial institutions face greater challenges due to the complexity and specific requirements of financial applications, as well as the sensitive nature of their data. In such cases, machine-verifiable deployments that are secure, compliant, and adhere to industry best practices are highly beneficial. The project is also driven by the need for a clear migration path between cloud vendors, ensuring institutions are not overly dependent on any single provider. By establishing a common set of controls, it creates a framework that ensures a system's architecture meets the compliance requirements of each institution while demonstrating compliance across multiple cloud providers. This approach allows a system built and deployed on one cloud to be seamlessly rebuilt on another, as it adheres to the same best practices and has already passed the necessary compliance checks of the new provider. As a result, higher-level cloud services, specific to each Cloud Service Provider (CSP), can be fully utilized without resorting to the lowest common denominator, ensuring that the unique strengths of each CSP are leveraged.

## Pros and Cons

In the past, regulatory requirements for the financial institutes mandated that data be stored in highly secured, custom on-premises data centres. However, with the growing adoption of cloud services, the financial services sector is increasingly moving towards adapting the public cloud. The diagram below shows a comparison of the main advantages and disadvantages of migrating complex financial applications to the public cloud.

![PROS_AND_CONS_OF_CLOUD]({{ site.github.url }}/smendis-scottlogic/assets/pros-n-cons.png)

Let’s elaborate more on few key concerns in moving financial data to the public cloud. Despite the robust security measures cloud providers offer, financial data is highly sensitive, and breaches can be devastating.  When complex system architectures evolve over time on a cloud provider of choice, it makes it more difficult to migrate to a different cloud provider. This may be due to the use of native offerings or lack of skilled workforce specialized in multiple cloud services. 

Public cloud environments are also multi-tenant, meaning data from multiple organizations shares the same infrastructure. While cloud providers enforce strict isolation, the risk of data leakage still exists. The cloud provider’s employees may have access to critical data, posing potential insider threats. 

When it comes to regulatory challenges, regulations in some regions require that sensitive financial data must be stored within national borders. Cloud providers may not offer appropriate data centre locations, hence complying to data residency laws could sometimes be difficult. Auditing in cloud environments can also be more challenging, especially with limited visibility into the provider’s operations.

Despite the challenges, the advantages of migrating to the cloud are considerable. One of the most notable is the reduction in operational costs associated with maintaining and upgrading physical servers and hardware. Additionally, cloud services tend to be more energy-efficient. The ability to scale resources on demand is not only simpler but also much faster with cloud solutions. Furthermore, the wide range of available software as a service (SaaS) offerings reduces the need for specialized expertise, enabling innovation and accelerating development processes.

Cloud infrastructure also enhances business agility by allowing companies to quickly adapt to market changes. The pay-as-you-go model offers financial flexibility, where businesses only pay for the resources they actually use, preventing unnecessary expenditures. Cloud providers also typically offer built-in security features and compliance certifications, reducing the burden on internal IT teams to maintain security protocols.

Disaster recovery and data backup solutions are another key benefit, as cloud platforms provide reliable, automated solutions for minimizing downtime in the event of disruptions. These advantages collectively lead to improved business continuity, performance, and scalability in ways that traditional, on-premises setups struggle to match.

## Timeline and Contributors

**On July 27, 2023, in New York,** [FINOS announced the formation of an open standard project, to describe consistent controls](https://www.linuxfoundation.org/press/finos-announces-open-standards-project-for-financial-services-common-cloud-controls), based upon an approach developed by FINOS Platinum Member Citi. 

In conjunction with the announcement of formation, **Jim Adams**, *CTO and Head of Technology Infrastructure* at Citi, the world’s fifth largest bank, stated,

> “There is a need for a Cloud Standard that will improve certain security and control measures across the Financial Services industry, whilst simplifying and democratizing access for all institutions to operate and benefit by leveraging the public cloud. It is important to collaborate with our peers to ensure consistency across cloud service providers, ensuring the industry can realize true multi-cloud strategies”.

**On October 24, 2023, in Las Vegas,** [FINOS announced the open sourcing of FINOS Common Cloud Controls (FINOS CCC)](https://www.finos.org/press/finos-announces-open-sourcing-common-cloud-controls) under the Community Specification License.

The project, seeded by Citi and approved in July by the FINOS Governing Board, has quickly garnered participation from over 20 leading financial institutions, cloud service providers and technology vendors. Some key member organizations involved in the formation and development of the project include Citi, Bank of Montreal (BMO), Goldman Sachs, JPMorgan, Morgan Stanley, Royal Bank of Canada (RBC), Deutsche Bank, London Stock Exchange Group (LSEG), Natwest, Google Cloud, Microsoft, NIST, Red Hat, Symphony, ControlPlane, GitHub, GitLab, and Scott Logic. 

## Anatomy of FINOS CCC

The Common Cloud Controls (CCC) project encompasses multiple layers. A key goal of this initiative is to establish a unified taxonomy for the services offered by various cloud service providers. For instance, AWS provides virtual computing services under the name Elastic Compute Cloud (EC2), while Azure refers to it as Virtual Machine (VM), and Google offers a similar service called Google Compute Engine (GCE). Despite the different names, these services provide comparable functionalities. Regardless of the cloud provider, it’s essential to have controls in place. These controls are tied to specific infrastructure components, which must be identified and classified using cloud-agnostic terminology before controls can be designed for better clarity. Hence identifying these common features is the foundational step in creating the CCC standard.

Threats in the cloud are reasonably well-understood. The [MITRE ATT&CK](https://attack.mitre.org/) framework is a globally recognized knowledge base used to understand and analyze the behavior of cyber adversaries. It provides a structured way to describe and categorize the tactics, techniques, and procedures (TTPs) that attackers use to infiltrate and compromise systems. CCC also aims to create a mapping of threats found in Mitre framework with the common features identified by the cloud services taxonomy in their controls. 

FINOS CCC project uses [OSCAL](https://pages.nist.gov/OSCAL/) (Open Security Controls Assessment Language) developed by NIST (National Institute of Standards and Technology) as their control language. OSCAL utilizes a machine-readable format for defining controls, which facilitates automated assessments, reporting, automated generation of compliance documentation and much more.

The project also aims to validate controls through a series of tests. If you are aware of the controls required in your public cloud, you can use the tests provided in the CCC standard to verify whether those controls are properly implemented.

It is envisaged that eventually, CCC will offer certification for CSPs who conform to the standard.

## Controls, Threats and Features

To provide you with a clearer understanding of what a control is, let's take a closer look at a specific example.

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>
id: CCC.ObjStor.C02 # Enforce uniform bucket-level access to prevent inconsistent permissions
title: Enforce uniform bucket-level access to prevent inconsistent
    permissions
control_family: Identity and Access Management
objective: |
    Ensure that uniform bucket-level access is enforced across all 
    object storage buckets. This prevents the use of ad hoc or 
    inconsistent object-level permissions, ensuring centralized, 
    consistent, and secure access management in accordance with the 
    principle of least privilege.
threats:
    - CCC.TH01 # Access control is misconfigured
    - CCC.ObjStor.TH02 # Improper enforcement of object modification locks
nist_csf: PR.AC-4 # Access permissions and authorizations are managed, incorporating the principles of least privilege and separation of duties
control_mappings:
    CCM:
    - DCS-09 # Access Control
    ISO_27001:
    - 2013 A.9.4.1 # Information Access Restriction
    NIST_800_53:
    - AC-3 # Access Enforcement
    - AC-6 # Least Privilege
test_requirements:
    - id: CCC.ObjStor.C02.TR01
    text: |
        Admin users can configure bucket-level permissions uniformly across 
        all buckets, ensuring that object-level permissions cannot be 
        applied without explicit authorization.
    tlp_levels:
        - tlp_amber
        - tlp_red
</code></pre>

This control defined in the file [`controls.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/storage/object/controls.yaml) under object storage. This control is designed to prevent the use of ad hoc object level permissions in buckets. This control is mapped to specific threats within the standard, identified as `CCC.TH01` and `CCC.ObjStor.TH02`, which we will explore in more detail later. Additionally, this control is mapped to a NIST control, specified as [`PR.AC-4`]( https://csf.tools/reference/nist-cybersecurity-framework/v1-1/pr/pr-ds/pr-ac-4/), which is part of the NIST framework's guidelines for access control. There are also specific methods to test whether this control is effectively implemented within your cloud service provider, ensuring that it meets security and compliance standards.

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>
id: CCC.TH01 # Access control is misconfigured
title: Access control is misconfigured
description: |
    An attacker can exploit misconfigured access controls to grant excessive
    privileges or gain unauthorized access to sensitive resources.
features:
    - CCC.F06 # Identity Based Access Control
mitre_technique:
    - T1078 # Valid Accounts
    - T1548 # Abuse Elevation Control Mechanism
    - T1203 # Exploitation for Credential Access
    - T1098 # Account Manipulation
    - T1484 # Domain or Tenant Policy Modification
    - T1546 # Event Triggered Execution
    - T1537 # Transfer Data to Cloud Account
    - T1567 # Exfiltration Over Web Services
    - T1048 # Exfiltration Over Alternative Protocol
    - T1485 # Data Destruction
    - T1565 # Data Manipulation
    - T1027 # Obfuscated Files or Information
</code></pre>

Let’s examine the threat `CCC.TH01` in the file [`common-threats.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/common-threats.yaml). This highlights the potential risk where attackers exploit access control to gain high privilege access to data. This is identified as a common threat but applicable to object storage. Hence listed under `common_threats` section in the file [`threats.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/storage/object/threats.yaml) under object storage. This particular threat is also linked to few specific threats in MITRE ATT&CK framework under the IDs [`T1078`](https://attack.mitre.org/techniques/T1078/), [`T1548`](https://attack.mitre.org/techniques/T1548/), [`T1203`](https://attack.mitre.org/techniques/T1203/), [`T1098`](https://attack.mitre.org/techniques/T1098/), [`T1484`](https://attack.mitre.org/techniques/T1484/), [`T1546`](https://attack.mitre.org/techniques/T1546/), [`T1537`](https://attack.mitre.org/techniques/T1537/), [`T1567`](https://attack.mitre.org/techniques/T1567/), [`T1048`](https://attack.mitre.org/techniques/T1048/), [`T1485`](https://attack.mitre.org/techniques/T1485/), [`T1565`](https://attack.mitre.org/techniques/T1565/), [`T1027`](https://attack.mitre.org/techniques/T1027/), which discuss data and access manipulation. This threat is also mapped to a specific feature within the standard identified as `CCC.F06` with the title **Identity Based Access Control** which we will explore later. 

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>
id: CCC.ObjStor.TH02 # Improper enforcement of object modification locks
title: Improper enforcement of object modification locks
description: |
    Attackers may exploit vulnerabilities in object modification locks to
    delete or alter objects despite the lock being in place, leading to data
    loss or tampering.
features:
    - CCC.ObjStor.F09 # Object Modification Locks
mitre_technique:
    - T1027 # Obfuscated Files or Information
    - T1485 # Data Destruction
    - T1490 # Inhibit System Recovery
    - T1491 # Defacement
    - T1565 # Data Manipulation
</code></pre>

Let's examine the threat `CCC.ObjStor.TH02` in the file [`threats.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/storage/object/threats.yaml) under object storage. This is an object storage specific threat that discusses attackers exploiting vulnerabilities in object modification locks to destroy data. This particular threat is also linked to a few specific threats in MITRE ATT&CK framework under the IDs [`T1027`](https://attack.mitre.org/techniques/T1027/), [`T1485`](https://attack.mitre.org/techniques/T1485/), [`T1490`](https://attack.mitre.org/techniques/T1490/), [`T1491`](https://attack.mitre.org/techniques/T1491/), [`T1565`](https://attack.mitre.org/techniques/T1565/), which discuss data destruction and manipulation. This threat is also mapped to a specific feature within the standard identified as `CCC.ObjStor.F09` with the title **Object Modification Locks** which we will discuss in more detail later. 

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>
id: CCC.F06 # Identity Based Access Control
title: Identity Based Access Control
description: |
    Provides the ability to determine access to resources based on
    attributes associated with a user identity.
</code></pre>

The feature `CCC.F06`, found in the file [`common-features.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/common-features.yaml) is a common feature that is referred to by the object storage threat `CCC.TH01` discussed above. This feature is also listed under `common_features` in the file [`features.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/storage/object/features.yaml) under the object storage, identifying it as a feature in object storage. The functionality of this feature is to control access to the object storage buckets based on identity.

<pre style="margin-inline: 0; margin-block: 1.5rem"><code>
id: CCC.ObjStor.F09 # Object Modification Locks
title: Object Modification Locks
description: |
    Allows locking of objects to disable modification and/or deletion of an
    object for a defined period of time.
</code></pre>

The feature `CCC.ObjStor.F09`, found in the file [`features.yaml`](https://github.com/finos/common-cloud-controls/blob/main/services/storage/object/features.yaml) under object storage is an object storage specific feature that is referred to by the threat `CCC.ObjStor.TH02` discussed above. The functionality of this feature is to provide object locks for data stored in object buckets disabling modifications and/or deletion.

In summary, if your architecture relies on object storage and its features such as *identity based access control* and *object modification locks*, you are susceptible to threats such as *misconfigured access control* and *improper enforcement of object modification locks*. To prevent those attacks from taking place, it's critical to implement controls such as *enforce uniform bucket-level access to prevent inconsistent permissions* for all your object storage buckets that retain sensitive data in your financial institute. You can validate whether these controls are in place by executing validation tests that are listed under the controls.


For more details refer to the [Common Cloud Control GitHub](https://github.com/finos/common-cloud-controls) page.


## Scott Logic FINOS CCC Team

Scott Logic was among the first organizations to collaborate with the FINOS Foundation in establishing the FINOS CCC, under the leadership of [Colin Eberhardt](https://blog.scottlogic.com/ceberhardt/) and [Robert Griffiths](https://blog.scottlogic.com/rgriffiths/). As the project's sponsorship lead at Scott Logic, Rob plays a key role in advancing this initiative as a member of the FINOS CCC Steering Committee. Alongside Rob, Stevie Shiells, chair of the Community Structure working group, and I, as chair of the Taxonomy working group, represent Scott Logic in leading this open-source project. We've also received, and continue to benefit from, valuable contributions from our Scott Logic team members: [Joshua Isted](https://blog.scottlogic.com/jisted/), [Cara Fisher](https://blog.scottlogic.com/cfisher/), [David Ogle](https://blog.scottlogic.com/dogle/), Mike Smith, Euthyme Ziogas, Daniel Moorhouse, and Ivan Mladjenovic.

## Conclusion

We have a diverse community of professionals within the FINOS CCC family, with a wide range of contributors, including CTOs, security experts, and industry professionals. The wealth of experience they bring to our discussions is mesmerizing. I enjoy contributing to this project because of the valuable exposure I gain from seeing how these experts approach various challenges.

FINOS Common Cloud Controls (FINOS CCC) is an ongoing project, and welcomes continued involvement. If you're passionate about supporting Scott Logic's vision of fostering and empowering open-source initiatives, we encourage you to get in touch with any of our team members. Whether you're looking to contribute your skills or collaborate with like-minded individuals, there's always an opportunity to make a meaningful impact on this exciting and evolving initiative.

---